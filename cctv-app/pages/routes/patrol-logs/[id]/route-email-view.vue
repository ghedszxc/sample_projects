<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card width="100%" elevation="3" height="100%">
        <v-progress-linear
          v-if="isVPatrolRouteEmailViewLoading"
          color="deep-purple"
          height="4"
          indeterminate
        ></v-progress-linear>

        <v-row no-gutters>
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <v-data-iterator
                  :items="patrolLogsEmail"
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
                              Route Email Log
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
                            <v-col cols="12" sm="4" md="3" lg="2">
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
                                  <span
                                    v-if="
                                      $vuetify.display.sm || $vuetify.display.md
                                    "
                                    >/ Assignee</span
                                  >
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="7"
                              md="2"
                              v-if="
                                $vuetify.display.xs || $vuetify.display.lgAndUp
                              "
                            >
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

                            <v-col cols="12" sm="5" md="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Submitted to
                                  <span v-if="$vuetify.display.sm"
                                    >/ Sent Date</span
                                  >
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="7"
                              md="2"
                              v-if="
                                $vuetify.display.xs || $vuetify.display.mdAndUp
                              "
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Sent Date
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" sm="3" md="2" lg="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Duration
                                  <span v-if="$vuetify.display.sm"
                                    >/ Status</span
                                  >
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="3"
                              md="1"
                              lg="1"
                              v-if="
                                $vuetify.display.xs || $vuetify.display.mdAndUp
                              "
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Status
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
                                sm="4"
                                md="3"
                                lg="2"
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
                                    <span
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      {{ item.raw.cctv.name }}
                                    </span>
                                  </span>

                                  <span
                                    class="d-flex align-center text-capitalize mr-sm-2 ml-lg-0 w-100 mt-1"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem; word-break: break-word; white-space: normal;'
                                        : 'word-break: break-word; white-space: normal;'
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                    v-if="
                                      $vuetify.display.sm || $vuetify.display.md
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
                                sm="4"
                                md="2"
                                lg="2"
                                :class="`text ${
                                  $vuetify.display.smAndUp ? 'my-1' : ''
                                }`"
                                class="mt-2 mt-sm-0"
                                v-if="
                                  $vuetify.display.xs ||
                                  $vuetify.display.lgAndUp
                                "
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
                                sm="5"
                                md="3"
                                lg="3"
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
                                    >Sent to:
                                  </span>
                                  <span
                                    class="d-flex align-center text-capitalize mr-sm-3 text-lowercase text-truncate"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : 'word-break: break-word; white-space: normal;'
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-icon class="mr-2 text-green">
                                      mdi-email-arrow-right-outline
                                    </v-icon>
                                    <span class="text-truncate mr-2">
                                      {{
                                        Array.isArray(
                                          item.raw.patrolLogEmail.submittedTo,
                                        )
                                          ? item.raw.patrolLogEmail
                                              .submittedTo[0] ||
                                            "No email available"
                                          : item.raw.patrolLogEmail
                                              .submittedTo ||
                                            "No email available"
                                      }}
                                    </span>
                                  </span>

                                  <span
                                    class="d-flex align-center text-capitalize mr-sm-3 w-100 mt-1"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : 'word-break: break-word; white-space: normal;'
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                    v-if="$vuetify.display.sm"
                                  >
                                    <v-icon size="small" class="mr-2"
                                      >mdi-calendar-month-outline</v-icon
                                    >
                                    <span
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      {{
                                        standardFormatDateTime(
                                          item.raw.patrolLogEmail.dateSent,
                                        )
                                      }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="3"
                                md="2"
                                lg="2"
                                :class="`text ${
                                  $vuetify.display.smAndUp ? 'my-1' : ''
                                }`"
                                class="mt-2 mt-sm-0"
                                v-if="
                                  $vuetify.display.xs ||
                                  $vuetify.display.mdAndUp
                                "
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
                                    >Sent Date:
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
                                    <span
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      {{
                                        standardFormatDateTime(
                                          item.raw.patrolLogEmail.dateSent,
                                        )
                                      }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="3"
                                md="2"
                                lg="2"
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
                                    class="d-flex align-center text-capitalize mr-sm-3 w-sm-100 w-md-auto"
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

                                  <v-chip
                                    :color="
                                      getStatusColor(
                                        item.raw.patrolLogEmail.status,
                                      )
                                    "
                                    class="text-body-2 text-capitalize mt-1"
                                    v-if="$vuetify.display.sm"
                                  >
                                    <v-icon class="mr-2">
                                      {{
                                        getStatusIcon(
                                          item.raw.patrolLogEmail.status,
                                        )
                                      }}
                                    </v-icon>
                                    <span>
                                      {{
                                        getStatusText(
                                          item.raw.patrolLogEmail.status,
                                        )
                                      }}
                                    </span>
                                  </v-chip>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="3"
                                md="1"
                                lg="1"
                                :class="`text ${
                                  $vuetify.display.smAndUp ? 'my-1' : ''
                                }`"
                                class="mt-2 mt-sm-0"
                                v-if="
                                  $vuetify.display.xs ||
                                  $vuetify.display.mdAndUp
                                "
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
                                    >Status:
                                  </span>
                                  <v-chip
                                    :color="
                                      getStatusColor(
                                        item.raw.patrolLogEmail.status,
                                      )
                                    "
                                    class="text-body-2 text-capitalize"
                                  >
                                    <v-icon class="mr-2">
                                      {{
                                        getStatusIcon(
                                          item.raw.patrolLogEmail.status,
                                        )
                                      }}
                                    </v-icon>
                                    <span>
                                      {{
                                        getStatusText(
                                          item.raw.patrolLogEmail.status,
                                        )
                                      }}
                                    </span>
                                  </v-chip>
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
              <span>{{ pageRangeRouteEmailView }}</span>
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
                :disabled="page >= pagesRangeRouteEmailView"
                @click="nextPage"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
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
  getPatrolLogListByEmailRouteId,
  page,
  pagesRangeRouteEmailView,
  itemsPerPage,
  pageRangeRouteEmailView,
  isVPatrolRouteEmailViewLoading,
} = useVirtualPatrol();

const patrolLogsEmail = ref([]);
const search = ref("");
const isLoading = ref(false);

const router = useRouter();
const route = useRoute();

const routeIdEmail = computed(() =>
  route.params.id ? String(route.params.id) : "",
);

onMounted(() => {
  if (routeIdEmail) {
    fetchPatrolLogsEmail();
  }
});

async function fetchPatrolLogsEmail() {
  isLoading.value = true;
  const payload = {
    id: routeIdEmail.value,
    search: search.value,
    page: page.value,
    limit: itemsPerPage.value,
  };

  try {
    const result = await getPatrolLogListByEmailRouteId(payload);
    if (result) {
      patrolLogsEmail.value = result.items;
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
  fetchPatrolLogsEmail();
}, 1000);

function nextPage() {
  if (page.value < pagesRangeRouteEmailView.value) {
    page.value++;
    fetchPatrolLogsEmail();
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value--;
    fetchPatrolLogsEmail();
  }
}

const getStatusColor = (status: string) => {
  return status === "pending"
    ? "orange"
    : status === "success"
      ? "green"
      : "red";
};

const getStatusText = (status: string) => {
  return status === "success"
    ? "sent"
    : status === "pending"
      ? "pending"
      : "failed";
};

const getStatusIcon = (status: string) => {
  return status === "pending"
    ? "mdi-clock-outline"
    : status === "success"
      ? "mdi-check-circle-outline"
      : "mdi-alert-circle-outline";
};

function goBack() {
  router.back();
}

onMounted(() => {
  fetchPatrolLogsEmail();
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
