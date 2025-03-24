<template>
  <v-dialog
    v-model="patrolLogDialog"
    transition="dialog-top-transition"
    max-width="900"
  >
    <v-card
      :loading="isProgress"
      style="border: thin solid #e8e8e8"
      :class="`bg-white px-3 h-100`"
    >
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="orange"
          height="8"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-card-title class="px-5 pt-5 pb-0">
        <v-row no-gutters justify="space-between">
          <v-col
            cols="12"
            md="7"
            class="font-weight-bold text-h6 text-truncate"
          >
            Patrol Log
          </v-col>
          <v-col cols="12" md="5">
            <v-text-field
              v-model="search"
              placeholder="Search"
              hide-details
              density="compact"
              append-inner-icon="mdi-magnify"
            >
              <template v-slot:append>
                <v-menu location="left">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      flat
                      size="x-small"
                      style="position: absolute; right: 10px"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list density="compact" class="pa-0">
                    <v-list-item
                      class="text-caption"
                      @click="onDownloadRangePdf()"
                    >
                      Download All Report via PDF
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-dialog v-model="selectReportRangeDialog" max-width="600">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn
                      class="text-none font-weight-regular"
                      prepend-icon="mdi-account"
                      text="Edit Profile"
                      variant="tonal"
                      v-bind="activatorProps"
                    ></v-btn>
                  </template>

                  <v-card prepend-icon="mdi-account" title="User Profile">
                    <v-card-text>
                      <v-row dense>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            label="First name*"
                            required
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            hint="example of helper text only on focus"
                            label="Middle name"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            hint="example of persistent helper text"
                            label="Last name*"
                            persistent-hint
                            required
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                          <v-text-field label="Email*" required></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            label="Password*"
                            type="password"
                            required
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            label="Confirm Password*"
                            type="password"
                            required
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6">
                          <v-select
                            :items="['0-17', '18-29', '30-54', '54+']"
                            label="Age*"
                            required
                          ></v-select>
                        </v-col>

                        <v-col cols="12" sm="6">
                          <v-autocomplete
                            :items="[
                              'Skiing',
                              'Ice hockey',
                              'Soccer',
                              'Basketball',
                              'Hockey',
                              'Reading',
                              'Writing',
                              'Coding',
                              'Basejump',
                            ]"
                            label="Interests"
                            auto-select-first
                            multiple
                          ></v-autocomplete>
                        </v-col>
                      </v-row>

                      <small class="text-caption text-medium-emphasis"
                        >*indicates required field</small
                      >
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn
                        text="Close"
                        variant="plain"
                        @click="selectReportRangeDialog = false"
                      ></v-btn>

                      <v-btn
                        color="primary"
                        text="Save"
                        variant="tonal"
                        @click="selectReportRangeDialog = false"
                      ></v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text class="px-0 pt-0">
        <v-data-table :items="patrolLogs" :headers="headers" :search="search">
          <template v-slot:headers="{ headers }">
            <tr>
              <th
                v-for="(item, key) in headers[0]"
                :key="key"
                class="text-capitalize text-caption font-weight-bold"
              >
                {{ item.title }}
              </th>
            </tr>
          </template>

          <template v-slot:item="{ index, item }">
            <tr class="pt-10">
              <th class="text-capitalize" style="width: 150px">
                <v-avatar
                  size="x-small"
                  :color="materialColors[index]"
                  class="mr-2 text-caption"
                >
                  {{
                    getInitial(
                      `${item.assignee.givenName} ${item.assignee.surname}`,
                    )
                  }}
                </v-avatar>
                {{ `${item.assignee.givenName} ${item.assignee.surname}` }}
              </th>
              <th>
                <div v-for="(item, index) in item.questions" :key="index">
                  {{ item.question }}
                </div>
              </th>
              <th>
                {{ formatDateAndTime(item.createdAt) }}

                <v-menu location="left">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      flat
                      size="x-small"
                      style="position: absolute; right: 40px; margin-top: -5px"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list density="compact" class="pa-0">
                    <v-list-item
                      v-if="currentUser.type === 'service-provider'"
                      class="text-caption"
                      @click="navigateToPatrolLog(item._id)"
                      >View</v-list-item
                    >
                    <v-list-item
                      class="text-caption"
                      @click="onDownloadPerRow('csv', item)"
                    >
                      Download CSV
                    </v-list-item>

                    <v-list-item
                      class="text-caption"
                      @click="onDownloadPerRow('pdf', item)"
                    >
                      Download PDF
                    </v-list-item>
                  </v-list>
                </v-menu>
              </th>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

definePageMeta({
  middleware: "secure",
});

const router = useRouter();
const { setSnackbar } = useLocal();
const { getInitial, materialColors, formatDateAndTime, formatDate } =
  useUtils();
const {
  vPatrol,
  selectedCctv,
  specificPatrolLog,
  patrolLogDialog,
  getPatrolLogList,
  patrolQuestionnaires,
} = useVirtualPatrol();
const { capitalizeName } = useUtils();
const { currentUser } = useLocalAuth();
const { getSitesOptionsForFiltering, mySite } = useFilter();

const route_id = computed(() => vPatrol.value.routeDetails._id as string);
const cctv_id = computed(() => selectedCctv.value._id as string);
const isProgress = ref(false);
const patrolLogs = ref([]);
const search = ref("");
const selectReportRangeDialog = ref(false);

const headers = ref([
  { title: "Submitted By", key: "assignee.givenName" },
  { title: "Questionnaires", key: "logQuestion.innerQuestions.name" },
  { title: "Date", key: "createdAt" },
]);

watch(
  patrolLogDialog,
  (newValue: string) => {
    if (newValue) onLoadPage();
  },
  { deep: true },
);

onMounted(async () => {
  await getSitesOptionsForFiltering();
});

const navigateToPatrolLog = (id: string) => {
  const router = useRouter();
  const currentRoute = router.currentRoute.value;
  const baseUrl = currentRoute.path.split("?")[0];
  const newRoute = `${baseUrl}/patrol-log/${id}`;

  router.push({
    path: newRoute,
    query: {
      site: mySite.value,
    },
  });
};

async function onLoadPage() {
  try {
    const result = await getPatrolLogList(route_id.value, cctv_id.value);
    patrolLogs.value = result.items;
  } catch (err) {
    setSnackbar({ text: err as string, modal: true, type: "error" });
  }
}

async function onDownloadAllCsv() {
  isProgress.value = true;

  const headers = [["Name", "Question", "Date"]];

  await patrolQuestionnaires.value.map((item: any) => {
    item.innerQuestions.map((itm: any) => {
      let findInnerQuestion = headers[0].findIndex((find) => find == itm.name);
      if (findInnerQuestion == -1) headers[0].splice(2, 0, itm.name);
    });
  });

  patrolLogs.value.map((log: any) => {
    log.questions.map((outer: any, key: number) => {
      let row = [
        !key ? `${log.assignee.givenName} ${log.assignee.surname}` : "",
        `${outer.question}`,
        formatDateAndTime(log.createdAt),
      ];
      log.questions[key].innerQuestions.map((inner: any) => {
        row.splice(2, 0, inner.answer);
      });

      headers.push(row);
    });
  });

  const fileContent = `data:text/csv;charset=utf-8,${headers.map((e) => e.join(",")).join("\n")}`;

  var encodedUri = encodeURI(fileContent);
  var link = document.createElement("a");
  await link.setAttribute("href", encodedUri);
  await link.setAttribute("download", `patrol-log-report.csv`);
  await document.body.appendChild(link);
  await link.click();

  isProgress.value = false;
}

function onDownloadRangePdf() {
  console.log("Hello");
}

async function onDownloadAllPdf() {
  console.log("Hello World");
  // selectReportRangeDialog.value = true;

  // const head = [["Name", "Question", "Date"]];
  // const body: any = [];

  // await patrolQuestionnaires.value.map((item: any) => {
  //   item.innerQuestions.map((itm: any) => {
  //     let findInnerQuestion = head[0].findIndex((find) => find == itm.name);
  //     if (findInnerQuestion == -1) head[0].splice(2, 0, itm.name);
  //   });
  // });

  // patrolLogs.value.map((log: any) => {
  //   log.questions.map((outer: any, key: number) => {
  //     let row = [
  //       !key ? `${log.assignee.givenName} ${log.assignee.surname}` : "",
  //       `${outer.question}`,
  //       formatDateAndTime(log.createdAt),
  //     ];
  //     log.questions[key].innerQuestions.map((inner: any) => {
  //       row.splice(2, 0, inner.answer);
  //     });

  //     body.push(row);
  //   });
  // });

  // const doc = new jsPDF({ orientation: "landscape" });
  // autoTable(doc, { head: head, body: body });
  // doc.save("patrol-log-report.pdf");
}

async function onDownloadPerRow(file_type: string, data: any) {
  isProgress.value = true;

  // populate header (csv & pdf)
  const head: string[][] = [["Name", "Question", "Date"]];
  await data.questions.reverse().map((item: any) => {
    item.innerQuestions.reverse().map((itm: any) => {
      let findInnerQuestion = head[0].findIndex((find) => find === itm.name);
      if (findInnerQuestion === -1) head[0].splice(2, 0, itm.name);
    });
  });

  // populate body (for pdf only)
  const body: any = [];
  data.questions.reverse().map((outer: any, key: number) => {
    let row = [
      !key
        ? `${capitalizeName(data.assignee.givenName)} ${capitalizeName(data.assignee.surname)}`
        : "",
      `${outer.question}`,
      formatDateAndTime(data.createdAt),
    ];
    data.questions[key].innerQuestions.map((inner: any) => {
      row.splice(2, 0, inner.answer);
    });

    file_type === "csv" ? head.push(row) : body.push(row);
  });

  if (file_type === "csv") {
    const fileContent = `data:text/csv;charset=utf-8,${head.map((e) => e.join(",")).join("\n")}`;

    let encodedUri = encodeURI(fileContent);
    let link = document.createElement("a");
    await link.setAttribute("href", encodedUri);
    await link.setAttribute(
      "download",
      `${`${data.assignee.givenName} ${data.assignee.surname}`}-patrol-log-${formatDate(data.createdAt)}.csv`,
    );
    await document.body.appendChild(link);
    await link.click();

    isProgress.value = false;
  } else {
    const doc = new jsPDF({ orientation: "landscape" });
    autoTable(doc, { head: head, body: body });
    doc.save(
      `${`${data.assignee.givenName} ${data.assignee.surname}`}-patrol-log-${formatDate(data.createdAt)}.pdf`,
    );
    isProgress.value = false;
  }
}
</script>
<style scoped>
:deep() .v-overlay__scrim {
  opacity: var(--v-overlay-opacity, 0);
}

:deep() .v-text-field input {
  font-size: 13px !important;
}
</style>
