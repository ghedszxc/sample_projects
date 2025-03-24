<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="isVPatrolQuestionsLoading"
      >
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-row no-gutters>
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <v-data-iterator
                  :items="patrolMainQuestions"
                  :items-per-page="itemsPerPage"
                >
                  <template v-slot:header>
                    <v-row
                      no-gutters
                      class="px-4 pt-4 pb-4 pb-sm-0 fill-height"
                      align="center"
                    >
                      <v-col cols="12">
                        <v-row no-gutters class="mb-md-4">
                          <v-col
                            cols="12"
                            sm="8"
                            md="10"
                            :class="`d-flex ${
                              $vuetify.display.smAndDown && 'mb-4'
                            }`"
                          >
                            <v-row no-gutters>
                              <v-col cols="12" sm="11" md="5" lg="4">
                                <v-text-field
                                  v-model="search"
                                  placeholder="Search"
                                  hide-details
                                  density="compact"
                                  append-inner-icon="mdi-magnify"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            :md="currentUser?.type == 'admin' ? 3 : 6"
                            v-if="currentUser?.type == 'admin'"
                          >
                            <v-select
                              v-model="filterOrganization"
                              :items="organizations"
                              item-title="name"
                              item-value="_id"
                              hide-details
                              density="compact"
                              menu-icon="mdi-chevron-down"
                            >
                            </v-select>
                          </v-col>

                          <v-col
                            cols="12"
                            md="4"
                            :class="{ 'mb-5': $vuetify.display.smAndDown }"
                            v-if="
                              currentUser?.type == 'admin' ||
                              currentUser?.type == 'organization'
                            "
                          >
                            <v-select
                              v-model="filterSite"
                              :items="siteOptions"
                              :disabled="!sites.length"
                              item-title="name"
                              item-value="_id"
                              hide-details
                              density="compact"
                              menu-icon="mdi-chevron-down"
                            >
                              <template v-slot:append>
                                <v-btn
                                  color="blue-darken-3"
                                  block
                                  variant="flat"
                                  size="small"
                                  style="
                                    height: 40px;
                                    border-radius: 0 5px 5px 0;
                                    left: -20px !important;
                                  "
                                  @click="updateFilter()"
                                >
                                  View
                                </v-btn>
                              </template>
                            </v-select>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="4"
                            md="2"
                            v-if="
                              $ability.can(
                                'create',
                                'create-log-question-virtual-patrol',
                              )
                            "
                          >
                            <v-row class="d-flex justify-end">
                              <v-col cols="12">
                                <v-btn
                                  color="blue-darken-3"
                                  block
                                  variant="flat"
                                  size="small"
                                  style="height: 40px"
                                  @click="patrolSettingsDialog = true"
                                >
                                  <v-icon class="mr-2"
                                    >mdi-file-question</v-icon
                                  >
                                  Add Question
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-divider />
                    <v-list
                      class="pa-0"
                      density="compact"
                      v-if="$vuetify.display.smAndUp"
                    >
                      <v-list-item class="">
                        <v-list-item-title>
                          <v-row no-gutters>
                            <v-col cols="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  No.
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="4">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Question
                                </span>
                              </v-row>
                            </v-col>
                            <v-col cols="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Routes
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  <v-menu location="bottom">
                                    <template #activator="{ props }">
                                      <v-btn v-bind="props" size="x-small" flat>
                                        <v-icon size="small"
                                          >mdi-filter-variant</v-icon
                                        >
                                      </v-btn>
                                    </template>

                                    <v-card width="250">
                                      <v-card-text>
                                        <v-list
                                          density="compact"
                                          class="text-caption pa-0"
                                        >
                                          <v-list-item link @click.stop="">
                                            <v-text-field
                                              v-model="filters.from"
                                              readonly
                                              label="Start Date"
                                              hide-details
                                              clearable
                                              append-inner-icon="mdi-calendar"
                                              class="w-100 mt-2"
                                              @click="startDateDialog = true"
                                            >
                                              <v-dialog
                                                v-model="startDateDialog"
                                                max-width="355"
                                              >
                                                <v-card>
                                                  <v-card-subtitle>
                                                    <v-date-picker
                                                      width="320"
                                                      v-model="startDate"
                                                      @input="updateStartDate"
                                                      :locale="locale"
                                                      @change="applyStartDate"
                                                    ></v-date-picker>
                                                  </v-card-subtitle>
                                                </v-card>
                                              </v-dialog>
                                            </v-text-field>
                                          </v-list-item>
                                        </v-list>
                                      </v-card-text>
                                    </v-card>
                                  </v-menu>
                                  Created Date
                                </span>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                    <v-divider />
                  </template>

                  <template #default="{ items }">
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="itemIndex"
                      >
                        <v-list-item class="py-2">
                          <v-list-item-title>
                            <v-row no-gutters align="center">
                              <v-col
                                cols="12"
                                sm="2"
                                md="2"
                                :class="`text ${
                                  $vuetify.display.smAndUp ? 'my-1' : ''
                                }`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none"
                                    >No:
                                  </span>
                                  <span
                                    class="d-inline-block text-truncate text-capitalize"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-icon color="green" size="small"
                                      >mdi-pound</v-icon
                                    >
                                    {{ itemIndex + 1 }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="4"
                                md="4"
                                :class="`text ${
                                  $vuetify.display.smAndUp
                                    ? 'my-1'
                                    : 'border rounded-lg pa-2'
                                }`"
                                class="mt-2 mt-sm-0"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none w-100"
                                    >Question:
                                  </span>
                                  <v-tooltip
                                    :text="item.raw.question"
                                    :disabled="item.raw.question.length < 40"
                                    location="bottom"
                                  >
                                    <template v-slot:activator="{ props }">
                                      <div
                                        v-bind="props"
                                        :class="[
                                          item.raw.question.length > 40
                                            ? 'cursor-pointer'
                                            : '',
                                        ]"
                                        class="text-body-2"
                                      >
                                        {{
                                          item.raw.question.length > 40
                                            ? item.raw.question
                                                .slice(0, 40)
                                                .concat("...")
                                            : item.raw.question
                                        }}
                                      </div>
                                    </template>
                                  </v-tooltip>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="2"
                                md="3"
                                :class="`text ${
                                  $vuetify.display.smAndUp
                                    ? 'my-1'
                                    : 'border rounded-lg pa-2'
                                }`"
                                class="mt-2 mt-sm-0"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none w-100"
                                    >Routes:
                                  </span>
                                  <v-tooltip location="bottom">
                                    <template v-slot:activator="{ props }">
                                      <span
                                        class="d-flex align-center text-capitalize"
                                        :style="
                                          $vuetify.display.xs
                                            ? 'font-size: 1rem; word-break: break-word; white-space: normal;'
                                            : 'word-break: break-word; white-space: normal;'
                                        "
                                        :class="
                                          $vuetify.display.xs
                                            ? ''
                                            : 'text-body-2'
                                        "
                                      >
                                        {{
                                          item.raw.routes &&
                                          Array.isArray(item.raw.routes)
                                            ? item.raw.routes.length >= 1
                                              ? item.raw.routes
                                                  .map(
                                                    (item: any) =>
                                                      " " +
                                                      `${item.routeName || ""}`,
                                                  )
                                                  .toString()
                                              : "All Routes"
                                            : "All Routes"
                                        }}
                                      </span>
                                    </template>
                                  </v-tooltip>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="3"
                                md="2"
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
                                    >Date Created:
                                  </span>
                                  <span
                                    class="d-inline-block text-truncate text-capitalize ml-sm-2"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-icon
                                      size="small"
                                      class="mr-1"
                                      color="blue"
                                      >mdi-calendar-month-outline</v-icon
                                    >

                                    {{
                                      standardFormatDateTime(item.raw.createdAt)
                                    }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col cols="12" sm="1" class="my-4">
                                <v-row
                                  no-gutters
                                  align-content="end"
                                  justify="end"
                                  align="center"
                                >
                                  <v-menu>
                                    <template #activator="{ props }">
                                      <v-btn
                                        v-bind="props"
                                        icon
                                        flat
                                        size="x-small"
                                        class="border"
                                      >
                                        <v-icon>mdi-dots-vertical</v-icon>
                                      </v-btn>
                                    </template>

                                    <v-card>
                                      <v-list density="compact" class="pa-0">
                                        <v-list-item
                                          class="text-caption"
                                          @click="
                                            onSetSpecificQuestionId(
                                              item.raw._id,
                                            )
                                          "
                                        >
                                          View
                                        </v-list-item>

                                        <v-list-item
                                          v-if="
                                            $ability.can(
                                              'delete',
                                              'delete-log-question=virtual-patrol',
                                            )
                                          "
                                          class="text-caption"
                                          @click="
                                            onOpenDeleteDialog(item.raw._id)
                                          "
                                        >
                                          Delete
                                        </v-list-item>
                                      </v-list>
                                    </v-card>
                                  </v-menu>
                                  <v-dialog
                                    v-model="confirmDeleteQuestionDialog"
                                    persistent
                                    max-width="500px"
                                  >
                                    <v-card :loading="isDeletingQuestion">
                                      <template v-slot:loader="{ isActive }">
                                        <v-progress-linear
                                          :active="isActive"
                                          color="blue"
                                          height="8"
                                          indeterminate
                                        ></v-progress-linear>
                                      </template>

                                      <v-card-text class="pb-3">
                                        <v-row>
                                          <v-col
                                            cols="12"
                                            align="center"
                                            class="pt-0"
                                          >
                                            <v-img
                                              src="/images/confirmation.svg"
                                              width="130px"
                                              height="130px"
                                            ></v-img>
                                          </v-col>

                                          <v-col
                                            cols="12"
                                            class="text-center pt-0"
                                          >
                                            Are you sure you want to Delete the
                                            Patrol Question?
                                          </v-col>
                                          <v-col cols="6">
                                            <v-btn
                                              size="small"
                                              color="green"
                                              block
                                              :loading="isDeletingQuestion"
                                              @click="
                                                onDeleteSpecificQuestion(
                                                  selectedIdToDelete,
                                                )
                                              "
                                              >Confirm</v-btn
                                            >
                                          </v-col>
                                          <v-col cols="6">
                                            <v-btn
                                              size="small"
                                              color="red"
                                              block
                                              @click="onCloseDeleteDialog()"
                                              :disabled="isDeletingQuestion"
                                              >Cancel</v-btn
                                            >
                                          </v-col>
                                        </v-row>
                                      </v-card-text>
                                    </v-card>
                                  </v-dialog>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-list-item-title>
                        </v-list-item>

                        <v-divider v-if="itemIndex + 1 !== items.length" />
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
                            You don't have any patrol log questions yet.
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
              <span>{{ questionsPageRange }}</span>
              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="questionsPage === 1"
                @click="
                  prevPageQuestions({
                    site: mySite,
                    search: search,
                    limit: 10,
                  })
                "
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>

              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="questionsPage >= questionsPages"
                @click="
                  nextPageQuestions({
                    site: mySite,
                    search: search,
                    limit: 10,
                  })
                "
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <RoutesPatrolSettings></RoutesPatrolSettings>
    <RoutesEditPatrolSettings></RoutesEditPatrolSettings>
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
const {
  getInitial,
  materialColors,
  formatScheduleDays,
  standardFormatDateTime,
} = useUtils();
const { setOrganizations, organizations } = useOrganization();
const { sites, setSites } = useSite();
const {
  setVPatrols,
  vPatrols,
  page,
  pages,
  pageRange,
  questionsPages,
  questionsPageRange,
  nextPage,
  prevPage,
  itemsPerPage,
  isVPatrolLoading,
  addDialog,
  patrolSettingsDialog,
  isVPatrolQuestionsLoading,
  getPatrolQuestionnaires,
  patrolMainQuestions,
  getPatrolQuestionnairesByPage,
  deletePatrolQuestion,
  specificPatrolQuestionId,
  editDialog,
  getSpecificPatrolQuestionById,
  specificPatrolQuestion,
  questionsPage,
  nextPageQuestions,
  prevPageQuestions,
  newOptionValues,
} = useVirtualPatrol();
const {
  getSitesOptionsForFiltering,
  siteOptions,
  mySite,
  filterSite,
  filterOrganization,
} = useFilter();
const { standardFormatDateYearMonthDay } = useUtils();

const search = ref("");
const customDate = ref("");
const confirmDeleteQuestionDialog = ref(false);
const isDeletingQuestion = ref(false);

const selectedIdToDelete = ref("");
const startDateDialog = ref(false);
const startDate = ref<Date | null>(null);
const locale = "en";
const filters = ref({
  from: "",
});

const updateStartDate = (date: Date | null) => {
  startDate.value = date;
};

const clearStartDate = () => {
  startDate.value = null;
  filters.value.from = "";
  startDateDialog.value = false;
  onFilterTable();
};

const applyStartDate = () => {
  if (startDate.value) {
    filters.value.from = standardFormatDateYearMonthDay(startDate.value);
  } else {
    filters.value.from = "";
  }
  startDateDialog.value = false;
  onFilterTable();
};
watch(startDate, (newVal) => {
  if (newVal) {
    applyStartDate();
  }
});
watch(() => filters.value.from, onFilterTable);

async function onFilterTable() {
  await getPatrolQuestionnairesByPage({
    page: questionsPage.value,
    site: mySite.value,
    limit: 10,
    search: "",
    date: filters.value.from,
  });
}

const debouncedFetch = debounce((newSearch) => {
  getPatrolQuestionnairesByPage({
    page: questionsPage.value,
    site: mySite.value,
    limit: 10,
    search: newSearch,
    date: customDate.value,
  });
}, 700);

watch(search, async (newSearch) => {
  debouncedFetch(newSearch);
});

watch(
  filterOrganization,
  (newValue) => {
    setSites(newValue);
  },
  { deep: true },
);

onMounted(async () => {
  isVPatrolQuestionsLoading.value = true;
  await getSitesOpt();
  // await Promise.all([
  //   setVPatrols({
  //     site: mySite.value,
  //   }),
  //   setOrganizations(),
  // ]);

  await getPatrolQuestionnairesByPage({
    page: questionsPage.value,
    site: mySite.value,
    limit: 10,
    search: "",
  });
});

onUnmounted(() => {
  filterSite.value = "";
  siteOptions.value = [];
});

async function onSetSpecificQuestionId(id: string) {
  const item: any = await getSpecificPatrolQuestionById(id);

  // TPatrolLogQuestion

  const newInnerQuestions = item.innerQuestions.map((i: any) => ({
    ...i,
    newOption: "",
  }));

  specificPatrolQuestion.value = { ...item, innerQuestions: newInnerQuestions };

  editDialog.value = true;
}

async function getSitesOpt() {
  try {
    isVPatrolLoading.value = true;
    await getSitesOptionsForFiltering();
  } catch (error: any) {
    setSnackbar({ text: error.message || error, modal: true, type: "error" });
  } finally {
    isVPatrolLoading.value = false;
    filterSite.value =
      siteOptions.value.find((i) => i._id === mySite.value)?._id || "";
  }
}

async function onDeleteSpecificQuestion(id: string) {
  isDeletingQuestion.value = true;
  const item: any = await deletePatrolQuestion(id);

  if (item && item?.status === "success") {
    await getPatrolQuestionnairesByPage({
      page: questionsPage.value,
      site: mySite.value,
      limit: 10,
      search: "",
      date: customDate.value,
    });

    onCloseDeleteDialog();
  }
}

async function updateFilter() {
  setVPatrols({
    site: filterSite.value,
  });
}

function onOpenDeleteDialog(id: string) {
  selectedIdToDelete.value = id;
  confirmDeleteQuestionDialog.value = true;
}

function onCloseDeleteDialog() {
  selectedIdToDelete.value = "";
  isDeletingQuestion.value = false;
  confirmDeleteQuestionDialog.value = false;
}
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
