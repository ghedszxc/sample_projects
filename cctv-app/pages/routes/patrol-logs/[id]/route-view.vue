<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card width="100%" elevation="3" height="100%">
        <v-progress-linear
          v-if="isVPatrolRouteViewLoading"
          color="deep-purple"
          height="4"
          indeterminate
        ></v-progress-linear>

        <v-row no-gutters>
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <v-data-iterator
                  :items="patrolLogs"
                  :items-per-page="itemsPerPage"
                >
                  <template v-slot:header>
                    <v-row no-gutters class="pa-4 fill-height" align="center">
                      <v-col cols="12">
                        <v-row>
                          <v-col cols="12" item="1">
                            <span class="font-weight-bold text-h6">
                              <v-btn @click="goBack" icon size="small">
                                <v-icon size="small">mdi-arrow-left</v-icon>
                              </v-btn>
                              Route CCTV
                            </span>
                          </v-col>
                          <v-col cols="12" lg="4">
                            <v-text-field
                              v-model="search"
                              placeholder="Search"
                              hide-details
                              density="compact"
                              append-inner-icon="mdi-magnify"
                              @update:modelValue="onSearch"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <v-divider></v-divider>

                    <v-list
                      class="pa-0"
                      density="compact"
                      v-if="$vuetify.display.smAndUp"
                    >
                      <v-list-item class="py-3 mx-3">
                        <v-list-item-title>
                          <v-row no-gutters align="center">
                            <v-col cols="12" sm="3" md="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                                align="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  CCTV
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" sm="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Assignee
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" sm="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Created At
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" sm="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Duration
                                </span>
                              </v-row>
                            </v-col>
                            <v-col cols="12" sm="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Attachments
                                </span>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                    <v-divider
                      v-if="$vuetify.display.xs || $vuetify.display.lgAndUp"
                    />
                  </template>

                  <template #default="{ items }">
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="itemIndex"
                      >
                        <v-list-item
                          :class="
                            $vuetify.display.smAndDown || $vuetify.display.md
                              ? 'py-2 border-md px-4 px-sm-2 rounded-lg mb-2 mx-2 my-2'
                              : 'py-1 px-0 px-lg-4 mx-2 my-0 text-body-2'
                          "
                        >
                          <v-list-item-title>
                            <v-row no-gutters align="center">
                              <v-col
                                cols="12"
                                sm="3"
                                md="3"
                                :class="`text ${
                                  $vuetify.display.smAndUp ? 'my-1' : ''
                                }`"
                                class="mt-2 mt-sm-0 pl-sm-2 pl-md-0"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none"
                                    >CCTV:
                                  </span>
                                  <span
                                    class="d-flex align-center text-capitalize mr-sm-2"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : 'word-break: break-word; white-space: normal;'
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-icon
                                      size="x-small"
                                      class="pa-3 mr-2"
                                      style="
                                        background: #1976d2;
                                        border-radius: 25px;
                                        color: #ffffff;
                                      "
                                      >mdi-cctv</v-icon
                                    >
                                    {{ item.raw.cctv.name }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="2"
                                :class="`text ${
                                  $vuetify.display.smAndUp ? 'my-1' : ''
                                }`"
                                class="mt-2 mt-sm-0"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none"
                                    >Assignee:
                                  </span>
                                  <span
                                    class="d-flex align-center text-capitalize ml-sm-2 mr-sm-2 ml-lg-0"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem; word-break: break-word; white-space: normal;'
                                        : 'word-break: break-word; white-space: normal;'
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-avatar
                                      size="x-small"
                                      :color="materialColors[itemIndex]"
                                      class="mr-2"
                                    >
                                      {{
                                        getInitial(
                                          item.raw.assignee &&
                                            Array.isArray(item.raw.assignee)
                                            ? item.raw.assignee[0].givenName
                                            : item.raw.assignee.givenName,
                                        )
                                      }}
                                    </v-avatar>
                                    <span
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      {{
                                        item.raw.assignee &&
                                        Array.isArray(item.raw.assignee)
                                          ? item.raw.assignee[0].givenName
                                          : item.raw.assignee.givenName
                                      }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="2"
                                :class="`text ${
                                  $vuetify.display.smAndUp ? 'my-1' : ''
                                }`"
                                class="mt-2 mt-sm-0"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none"
                                    >Created At:
                                  </span>
                                  <span
                                    class="d-flex align-center text-capitalize mr-sm-3"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : 'word-break: break-word; white-space: normal;'
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-icon size="small" class="mr-2"
                                      >mdi-calendar-month-outline</v-icon
                                    >
                                    <span>
                                      {{
                                        standardFormatDateTime(
                                          item.raw.createdAt,
                                        )
                                      }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="2"
                                :class="`text ${
                                  $vuetify.display.smAndUp ? 'my-1' : ''
                                }`"
                                class="mt-2 mt-sm-0"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none"
                                    >Duration:
                                  </span>
                                  <span
                                    class="d-flex align-center text-capitalize mr-sm-3"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : 'word-break: break-word; white-space: normal;'
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-icon size="small" class="mr-2"
                                      >mdi-timer-outline</v-icon
                                    >
                                    <span>
                                      {{ item.raw.duration }} seconds
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                cols="12"
                                sm="3"
                                :class="`text ${
                                  $vuetify.display.smAndUp ? 'my-1' : ''
                                }`"
                                class="mt-2 mt-sm-0"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none"
                                    >Attachments:
                                  </span>
                                  <span
                                    v-if="getAttachments(item.raw.logQuestions)"
                                    class="d-flex align-center text-capitalize mr-sm-3"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : 'word-break: break-word; white-space: normal;'
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <span
                                      v-if="
                                        getAttachments(item.raw.logQuestions)
                                          .screenshots.length > 0
                                      "
                                      @click="
                                        openAttachment(
                                          'Screenshots',
                                          getAttachments(item.raw.logQuestions)
                                            .screenshots,
                                        )
                                      "
                                      class="text-decoration-underline cursor-pointer"
                                    >
                                      <v-icon size="small" class="mr-1"
                                        >mdi-image-outline</v-icon
                                      >
                                      Screenshots
                                    </span>
                                    <span
                                      v-if="
                                        getAttachments(item.raw.logQuestions)
                                          .recordings.length > 0
                                      "
                                      @click="
                                        openAttachment(
                                          'Recordings',
                                          getAttachments(item.raw.logQuestions)
                                            .recordings,
                                        )
                                      "
                                      class="text-decoration-underline cursor-pointer"
                                    >
                                      <v-icon size="small" class="ml-2 mr-2"
                                        >mdi-file-video-outline</v-icon
                                      >Recordings
                                    </span>
                                  </span>
                                  <span
                                    v-else
                                    class="d-flex align-center text-capitalize mr-sm-3"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : 'word-break: break-word; white-space: normal;'
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-icon size="small" class="mr-2"
                                      >mdi-file-document-remove-outline</v-icon
                                    >
                                    No attachments
                                    <span> </span>
                                  </span>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-list-item-title>
                        </v-list-item>
                        <v-divider
                          v-if="
                            itemIndex + 1 !== items.length &&
                            $vuetify.display.lgAndUp
                          "
                        ></v-divider>
                      </template>
                    </v-list>
                  </template>

                  <template #no-data>
                    <v-row no-gutters justify="center" class="pa-16">
                      <v-col cols="12">
                        <v-row no-gutters justify="center">
                          <v-img
                            src="/empty.svg"
                            width="100px"
                            height="100px"
                          ></v-img>
                        </v-row>
                      </v-col>

                      <v-col cols="12">
                        <v-row no-gutters justify="center">
                          <span class="font-weight-bold">
                            You don't have any route yet.
                          </span>
                        </v-row>
                      </v-col>
                    </v-row>
                  </template>
                </v-data-iterator>
              </v-col>
            </v-row>
          </v-col>

          <v-divider></v-divider>

          <v-col cols="12" class="pa-4">
            <v-row no-gutters justify="end" align-content="center">
              <span>{{ pageRangeRouteView }}</span>
              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="page === 1"
                @click="prevPage"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>

              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="page >= pagesRangeRouteView"
                @click="nextPage"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <routes-show-logs-attachments />
  </v-row>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

definePageMeta({
  middleware: "secure",
});
const { $ability } = useNuxtApp();
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const { getInitial, materialColors, standardFormatDateTime } = useUtils();
const {
  getPatrolLogListByRouteId,
  page,
  pagesRangeRouteView,
  itemsPerPage,
  pageRangeRouteView,
  isVPatrolRouteViewLoading,
  showLogAttachmentDialog,
  dialogAttachments,
} = useVirtualPatrol();

const patrolLogs = ref([]);
const search = ref("");
const isLoading = ref(false);

const router = useRouter();
const route = useRoute();

const routeId = computed(() =>
  route.params.id ? String(route.params.id) : "",
);

type TLogAttachments = {
  screenshots: {
    question: string;
    file: string;
  }[];
  recordings: {
    question: string;
    file: string;
  }[];
};

onMounted(() => {
  console.log("routeId", routeId.value);
  if (routeId) {
    fetchPatrolLogs();
  }
});

function openAttachment(label: string, items: any) {
  showLogAttachmentDialog.value = label;
  dialogAttachments.value = items;
}

function getAttachments(data: any) {
  const filterScreenshot = data.filter(
    (item: any) =>
      item.screenshotAttachment && item.screenshotAttachment !== "",
  );

  const filterRecording = data.filter(
    (item: any) => item.recordingAttachment && item.recordingAttachment !== "",
  );

  if (filterScreenshot.length < 1 && filterRecording.length < 1) return false;

  const attachments: TLogAttachments = {
    screenshots: filterScreenshot.map((item: any) => ({
      question: item.mainQuestionLabel,
      file: item.screenshotAttachment,
    })),
    recordings: filterRecording.map((item: any) => ({
      question: item.mainQuestionLabel,
      file: item.recordingAttachment,
    })),
  };

  return attachments;
}

async function fetchPatrolLogs() {
  isLoading.value = true;
  const payload = {
    id: routeId.value,
    search: search.value,
    page: page.value,
    limit: itemsPerPage.value,
  };

  try {
    const result = await getPatrolLogListByRouteId(payload);
    if (result) {
      patrolLogs.value = result.items;
    }
  } catch (error) {
    setSnackbar({
      type: "error",
      text: "Failed to fetch patrol logs",
      modal: true,
    });
  } finally {
    isLoading.value = false;
  }
}

const onSearch = debounce(() => {
  page.value = 1;
  fetchPatrolLogs();
}, 1000);

function nextPage() {
  if (page.value < pagesRangeRouteView.value) {
    page.value++;
    fetchPatrolLogs();
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value--;
    fetchPatrolLogs();
  }
}

function goBack() {
  router.back();
}

onMounted(() => {
  fetchPatrolLogs();
});
</script>

<style scoped>
.text {
  text-align: start;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}

.rows-per-page :deep() .v-field__outline {
  --v-field-border-width: 0;
  --v-field-border-opacity: 0;
  border-bottom: 0.1px solid;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  width: 50px;
  margin-left: 16px;
}

:deep() .v-text-field input {
  font-size: 13px !important;
}
</style>
