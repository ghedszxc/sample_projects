<template>
  <v-dialog
    v-model="specificPatrolLogDialog"
    transition="dialog-right-transition"
    fullscreen
    persistent
    :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
  >
    <v-card
      :loading="isProgress"
      :style="{ border: `${theme === 'light' && 'thin solid #E8E8E8'}` }"
      :class="`${theme === 'light' && 'bg-white'} px-3 h-100 ${$vuetify.display.mdAndUp && 'rounded-s-xl'}`"
    >
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="orange"
          height="8"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-toolbar :color="`${theme === 'dark' ? 'grey-darken-4' : 'white'}`">
        <span class="font-weight-bold pl-4 pt-1 text-capitalize"
          >Patrol Log</span
        >
        <v-spacer></v-spacer>
        <v-btn
          size="x-small"
          color="grey-darken-1"
          icon="mdi-close"
          @click="onCloseDialog()"
        ></v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text>
        <v-row>
          <v-col cols="12" class="mb-12">
            <v-img src="/empty.svg" height="125" />
          </v-col>

          <v-col cols="12" v-if="updatePatrolLogSteps === 1">
            <v-row no-gutters>
              <v-col cols="12">
                <v-row class="px-3 mb-4" justify="space-between">
                  <span class="font-weight-bold"> General Information </span>
                </v-row>
              </v-col>

              <v-col cols="12" class="mb-6">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="currentPatrolLog.route.routeName"
                      label="Route"
                      density="comfortable"
                      hide-details
                      readonly
                      :disabled="isProgress"
                      :rules="[requiredInput]"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="currentPatrolLog.cctv.name"
                      label="CCTV"
                      density="comfortable"
                      hide-details
                      readonly
                      :disabled="isProgress"
                      :rules="[requiredInput]"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      :model-value="`${currentPatrolLog.assigneename.givenName} ${currentPatrolLog.assigneename.surname}`"
                      label="Submitted By"
                      density="comfortable"
                      hide-details
                      readonly
                      :disabled="isProgress"
                      :rules="[requiredInput]"
                    ></v-text-field>
                  </v-col>
                  <!-- standardFormatDateTime -->
                  <v-col cols="12">
                    <v-text-field
                      :model-value="
                        standardFormatDateTime(currentPatrolLog.createdAt)
                      "
                      label="Created Date"
                      density="comfortable"
                      hide-details
                      readonly
                      :disabled="isProgress"
                      :rules="[requiredInput]"
                    ></v-text-field>
                  </v-col>
                  <!-- @input="getIncidents(mySite, searchIr)" -->
                  <v-col cols="12">
                    <!-- <v-autocomplete
                      v-model="currentPatrolLog.irAttachment"
                      label="Incident Report"
                      density="comfortable"
                      hide-details
                      :items="incidentReports"
                      item-title="reportId"
                      item-value="_id"
                      @click.stop
                      :disabled="isProgress"
                    >
                    </v-autocomplete> -->
                    <v-btn
                      v-if="
                        $ability.can('create', 'attach-incident-virtual-patrol')
                      "
                      block
                      variant="flat"
                      @click="attachIncident()"
                    >
                      Attach Incident Report
                      <v-icon>mdi-paperclip</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>

              <!-- <v-col cols="12">
                <v-btn
                  block
                  color="blue-darken-3"
                  size="small"
                  variant="flat"
                  style="height: 40px"
                  :disabled="isUpdatingPatrolLog"
                  @click="onUpdatePatrolLog(currentPatrolLog)"
                  >Update Patrol Log
                </v-btn>
              </v-col> -->
            </v-row>
          </v-col>

          <v-col cols="12" v-if="updatePatrolLogSteps === 2">
            <div class="text-center mt-6 text-subtitle-1 font-weight-bold">
              Great!
            </div>
            <div class="text-center mt-2 text-caption">
              Patrol log successfully updated.
            </div>
            <v-row class="px-3 mt-5" justify="space-between">
              <v-col cols="12">
                <v-btn
                  block
                  size="small"
                  variant="flat"
                  style="height: 40px"
                  @click="onCloseDialog()"
                >
                  Close
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <span :class="`${$vuetify.display.mdAndUp && 'pl-4'} text-caption`">
          @ 2024 by Seven 365 Pte Ltd V1.0
        </span>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const emit = defineEmits(["attachIr"]);

const { theme } = useLocal();
const { getUserList, users, setUsers } = useUser();
const { setSnackbar } = useLocal();
const { currentUser } = useLocalAuth();
const { requiredInput, standardFormatDateTime } = useUtils();
const { getBlocks, getCctvOfBlock } = useCCTV();
const {
  vPatrol,
  setVPatrol,
  editDialog,
  addVirtualPatrol,
  getPatrolQuestionnairesByPage,
  updatePatrolQuestionnaire,
  specificPatrolQuestion,
  editQuestionSteps,
  specificPatrolLogDialog,
  currentPatrolLog,
  incidentReports,
  updateSpecificVPatrol,
  getPatrolLogListV2,
  patrolLogsPage,
  patrolLogsItemsPerPage,
  patrolLogList,
  patrolLogsPages,
  patrolLogsPageRange,
  isVPatrolLoading,
  updatePatrolLogSteps,
} = useVirtualPatrol();
const { getSitesOptionsForFiltering, mySite, myOrg, myProvider } = useFilter();
const { getAllServicesAvailable } = useSiteCollab();

const isProgress = ref(false);
const selectedLocation = ref("");

const patrolQuestionOption = ref("");
const innerQuestionOption = ref("");
const newOptionValues = reactive({});
const specificInnerQuestion = ref<TPatrolLogInnerQuestion>({
  name: "",
  options: [],
});
const isUpdatingPatrolLog = ref(false);

const cctvList = ref([]);

async function attachIncident(data: any) {
  console.log("attach");
  emit("attachIr", data);
}

async function onUpdatePatrolLog(currentPatrolLog: TVirtualPatrol) {
  const { _id, irAttachment } = currentPatrolLog;

  isVPatrolLoading.value = true;

  const item = await updateSpecificVPatrol({ _id: _id, irId: irAttachment });

  if (item && item?.status === "success") {
    updatePatrolLogSteps.value++;
  }

  getPatrolLogListV2({
    page: patrolLogsPage.value,
    limit: patrolLogsItemsPerPage.value,
    site: mySite.value,
  }).then((res) => {
    patrolLogList.value = res.items;
    patrolLogsPages.value = res.pages;
    patrolLogsPageRange.value = res.pageRange;
  });

  isVPatrolLoading.value = true;

  // isUpdatingPatrolLog.value = true;
  //   const item = await updatePatrolQuestionnaire(patrolLogQuestion);
  //   if (item?.status === "success") {
  //     await getPatrolQuestionnairesByPage({
  //       page: 1,
  //       site: mySite.value,
  //       limit: 10,
  //       search: "",
  //     });
  //     setSnackbar({
  //       text: "Successful updated patrol log question.",
  //       modal: true,
  //       type: "success",
  //     });
  //     specificPatrolQuestion.value = {
  //       question: "",
  //       options: [],
  //       innerQuestions: [],
  //     };
  //     isUpdating.value = false;
  //     editQuestionSteps.value++;
  //   } else {
  //     setSnackbar({
  //       text: "Failed to update patrol log question.",
  //       modal: true,
  //       type: "error",
  //     });
  //     isUpdatingPatrolLog.value = false;
  //   }

  // getPatrolLogListV2({
  //   page: patrolLogsPage.value,
  //   limit: patrolLogsItemsPerPage.value,
  //   site: mySite.value,
  // }).then((res) => {
  //   patrolLogList.value = res.items;
  //   patrolLogsPages.value = res.pages;
  //   patrolLogsPageRange.value = res.pageRange;
}

function onAddPatrolOption(option: string) {
  specificPatrolQuestion.value.options.push(option);
  patrolQuestionOption.value = "";
}

function onAddInnerQuestion(innerQuestion: TPatrolLogInnerQuestion) {
  specificPatrolQuestion.value.innerQuestions.push(innerQuestion);

  specificInnerQuestion.value = {
    name: "",
    options: [],
  };
}

function onAddInnerQuestionOption(innerOption: string, item: string) {
  const index = specificPatrolQuestion.value.innerQuestions.findIndex(
    (i) => i.name === item,
  );

  if (index !== -1) {
    specificPatrolQuestion.value.innerQuestions[index].options.push(
      innerOption,
    );

    innerQuestionOption.value = "";
  }
}

function onRemoveInnerQuestion(item: string) {
  specificPatrolQuestion.value.innerQuestions =
    specificPatrolQuestion.value.innerQuestions.filter((i) => i.name !== item);
}

function onDeletePatrolOption(option: string) {
  specificPatrolQuestion.value.options =
    specificPatrolQuestion.value.options.filter(
      (item: string) => item !== option,
    );
}

function onDeleteInnerOption(innerQuestion: string, innerOption: string) {
  const itemIndex = specificPatrolQuestion.value.innerQuestions.findIndex(
    (i) => i.name === innerQuestion,
  );

  // const itemInnerQuestionIndex = specificPatrolQuestion.value?.innerQuestions[
  //   itemIndex
  // ].findIndex((idx) => idx.options === innerOption);

  // const index = specificPatrolQuestion.value.innerQuestions.findIndex(
  //     (i) => i.name === item,
  //   );
}

async function submit() {
  // try {
  //   isProgress.value = true;
  //   await addVirtualPatrol(vPatrol.value);
  //   setSnackbar({
  //     text: "Successful created route",
  //     modal: true,
  //     type: "success",
  //   });
  //   editQuestionSteps.value = 3;
  //   isProgress.value = false;
  //   cctvList.value = [];
  //   selectedLocation.value = "";
  // } catch (err) {
  //   setSnackbar({ text: err as string, modal: true, type: "error" });
  //   isProgress.value = false;
  // } finally {
  //   await setVPatrols({
  //     site: mySite.value,
  //   });
  // }
}

async function onCloseDialog() {
  specificPatrolLogDialog.value = false;
  updatePatrolLogSteps.value = 1;

  //   specificPatrolQuestion.value = {
  //     question: "",
  //     options: [],
  //     innerQuestions: [],
  //   };
}

async function goBack() {
  // await setVPatrol();
  updatePatrolLogSteps.value = 1;
}
</script>

<style scoped>
.text {
  text-align: start;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}

.dialog_desktop {
  margin: 0 0 0 auto;
  max-width: 28%;
  border-radius: 25px 0 0 25px;

  box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
}

:deep() .v-field__outline {
  --v-field-border-opacity: 0.1;
}

:deep() .v-overlay__scrim {
  opacity: var(--v-overlay-opacity, 0);
}

:deep() .v-switch .v-label {
  padding-right: 10px;
  font-size: 13px;
}

:deep() .v-switch .v-selection-control {
  display: flex;
  flex-direction: row-reverse;
}

:deep() .v-text-field input {
  font-size: 13px !important;
}

.overridePicker {
  width: 28px;
}
</style>
