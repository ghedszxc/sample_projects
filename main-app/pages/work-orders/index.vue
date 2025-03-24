<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <base-table
        table-name="Work Orders"
        :items="workOrders"
        :headers="headers"
        :itemPerPage="itemsPerPage"
        :pageRange="pageRange"
        :page="page"
        :pages="pages"
        :isLoading="isLoading"
        noDataMsg="You don't have any work order(s) yet."
        noDataImg="/empty.svg"
        @next-page="onNextPage()"
        @prev-page="onPrevPage()"
        @on-search="onSearch($event)"
      >
        <template #headerActions>
          <v-row no-gutters align="center">
            <v-col cols="12" sm="6" md="6" lg="2">
              <v-row no-gutters>
                <v-col
                  cols="12"
                  :class="
                    /^(organization|service-provider)$/i.test(currentUser.type)
                      ? 'mb-0'
                      : 'mb-0'
                  "
                  class="mb-md-0 ml-0 ml-md-0 pr-sm-3 pr-md-0 mb-sm-3 mb-md-0 pl-md-1"
                  v-if="
                    /^(organization|service-provider)$/i.test(currentUser.type)
                  "
                >
                  <v-select
                    v-model:model-value="filterSite"
                    :items="siteOptions"
                    item-title="name"
                    item-value="_id"
                    label="Site"
                    hide-details
                    :persistent-hint="false"
                    @update:model-value="onFilterSite(filterSite)"
                    class="mt-4 my-md-0 mt-md-0"
                  ></v-select>
                </v-col>
              </v-row>
            </v-col>

            <v-col
              cols="12"
              :sm="
                /^(organization|service-provider)$/i.test(currentUser.type)
                  ? 6
                  : 6
              "
              :md="
                /^(organization|service-provider)$/i.test(currentUser.type)
                  ? 6
                  : 6
              "
              :lg="
                /^(organization|service-provider)$/i.test(currentUser.type)
                  ? 2
                  : 2
              "
              :class="
                $vuetify.display.mdAndUp
                  ? 'mt-0 pl-sm-3 pl-md-2'
                  : 'mt-4 mb-3 pl-sm-3 '
              "
            >
              <v-row no-gutters class="">
                <v-col cols="12" md="12">
                  <v-autocomplete
                    v-model="filterByStatus"
                    :items="[
                      'All',
                      'To-Do',
                      'Pending',
                      'In-Progress',
                      'Completed',
                      'Resolved',
                    ]"
                    label="Filter by status"
                    hide-details
                    @update:model-value="updateFilter()"
                  />
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="12" lg="8" class="mt-md-4 pl-md-1 mt-lg-0">
              <v-row class="d-flex align-center">
                <div
                  class="w-100 mx-md-0 mt-md-0 px-4"
                  :class="
                    /^(organization|service-provider)$/i.test(currentUser.type)
                      ? 'mt-0'
                      : 'mt-7'
                  "
                  :style="$vuetify.display.smAndDown ? '' : 'max-width: 75%'"
                >
                  <base-date-filter-one-month-ago
                    @on-select-date-range="onSelectDateRange($event)"
                    @on-clear-date-rage="onClearDateRage($event)"
                    @on-start-date-change="onStartDateChange"
                    @on-end-date-change="onEndDateChange"
                  />
                </div>
                <v-col
                  v-if="$ability.can('create', 'create-work-orders')"
                  cols="12"
                  md="3"
                >
                  <v-btn
                    color="blue-darken-3"
                    block
                    variant="flat"
                    style="height: 40px"
                    @click="handleClickWorkOrder"
                  >
                    <v-icon>mdi-plus</v-icon>Work Order
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </template>

        <template #tableItems="{ items }">
          <v-list class="pa-0">
            <template v-for="(item, itemIndex) in items" :key="itemIndex">
              <v-list-item link class="px-2" @click="changePath(item.raw)">
                <v-list-item-title
                  :class="
                    $vuetify.display.smAndDown || $vuetify.display.md
                      ? 'py-2 border-md px-2 rounded-lg mb-2 my-2'
                      : 'py-0 px-2 mx-2 my-0 text-body-2'
                  "
                >
                  <v-row no-gutters align="center">
                    <!-- name -->
                    <v-col
                      cols="12"
                      sm="2"
                      md="2"
                      lg="2"
                      class="text-capitalize white--text text mb-2 mb-sm-0"
                    >
                      <v-row
                        no-gutters
                        class="fill-height text-truncate"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown ? 'space-between' : 'start'
                        "
                      >
                        <span class="mr-2 d-flex d-sm-none font-weight-bold"
                          >Created by:
                        </span>
                        <span
                          class="text-truncate mr-sm-2 d-flex align-center"
                          :style="
                            $vuetify.display.xs ? 'font-size: .8rem;' : ''
                          "
                          :class="$vuetify.display.smAndUp ? 'text-body-2' : ''"
                        >
                          <v-avatar
                            size="small"
                            :color="materialColors[itemIndex]"
                            class="text-subtitle-2 mr-1 mr-md-4"
                          >
                            {{
                              getInitial(
                                `${item.raw?.createdBy?.givenName} ${item.raw?.createdBy?.surname}`,
                              ) || "N/A"
                            }}
                          </v-avatar>
                          <span class="subject-text">
                            {{
                              `${item.raw?.createdBy?.givenName} ${item.raw?.createdBy?.surname}` ||
                              "N/A"
                            }}
                          </span>
                        </span>
                      </v-row>
                    </v-col>
                    <!-- subject / date -->
                    <v-col
                      cols="12"
                      sm="3"
                      md="3"
                      lg="2"
                      class=""
                      :class="`text text-capitalize text-truncate ${
                        !$vuetify.display.smAndUp && 'mb-3'
                      }`"
                    >
                      <v-row
                        no-gutters
                        class="fill-height text-truncate"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown ? 'space-between' : 'start'
                        "
                      >
                        <span class="mr-2 d-flex d-sm-none font-weight-bold"
                          >Subject:
                        </span>

                        <span
                          class="text-truncate mr-sm-2 d-flex align-center"
                          :style="
                            $vuetify.display.xs ? 'font-size: .8rem;' : ''
                          "
                          :class="$vuetify.display.smAndUp ? 'text-body-2' : ''"
                        >
                          <v-icon class="mr-1 mr-md-4">
                            mdi-note-text-outline
                          </v-icon>
                          <span class="subject-text">
                            {{ item.raw.subject ? item.raw.subject : "N/A" }}
                          </span>
                        </span>
                        <span
                          :style="
                            $vuetify.display.xs ? 'font-size: .8rem;' : ''
                          "
                          :class="
                            $vuetify.display.smAndUp
                              ? 'text-body-2 w-100 mt-2'
                              : ''
                          "
                          v-if="$vuetify.display.sm || $vuetify.display.md"
                        >
                          <v-icon class="mr-1 mr-md-4"
                            >mdi-calendar-month-outline</v-icon
                          >
                          {{ standardFormatDate(item.raw.createdAt || "") }}
                        </span>
                      </v-row>
                    </v-col>
                    <!-- Date -->
                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      class="text text-capitalize"
                      v-if="$vuetify.display.lgAndUp || $vuetify.display.xs"
                    >
                      <v-row
                        no-gutters
                        class="fill-height text-truncate"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown ? 'space-between' : 'start'
                        "
                      >
                        <span class="mr-2 d-flex d-md-none font-weight-bold">
                          Created at:
                        </span>
                        <span
                          :style="
                            $vuetify.display.xs ? 'font-size: .8rem;' : ''
                          "
                          :class="$vuetify.display.smAndUp ? 'text-body-2' : ''"
                        >
                          <v-icon class="mr-1 mr-md-4">
                            mdi-calendar-month-outline
                          </v-icon>
                          {{ standardFormatDate(item.raw.createdAt || "") }}
                        </span>
                      </v-row>
                    </v-col>
                    <!-- Applications -->
                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      sm="2"
                      class="text text-capitalize"
                    >
                      <v-row
                        no-gutters
                        class="fill-height text-truncate"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown ? 'space-between' : 'start'
                        "
                      >
                        <span class="mr-2 d-flex d-sm-none font-weight-bold">
                          Application:
                        </span>
                        <span
                          :style="
                            $vuetify.display.xs ? 'font-size: .8rem;' : ''
                          "
                          class="mr-sm-2"
                          :class="$vuetify.display.smAndUp ? 'text-body-2' : ''"
                        >
                          {{ item.raw.app || "N/A" }}
                        </span>
                      </v-row>
                    </v-col>
                    <!-- Status -->
                    <v-col
                      cols="12"
                      sm="2"
                      md="2"
                      lg="1"
                      :class="`text ${!$vuetify.display.mdAndUp ? '' : 'my-1'} ${$vuetify.display.mdAndUp && ''}`"
                    >
                      <v-row
                        no-gutters
                        class="fill-height text-truncate"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown ? 'space-between' : 'start'
                        "
                      >
                        <span class="mr-2 d-flex d-sm-none font-weight-bold"
                          >Status:
                        </span>
                        <span class="d-inline-block text-truncate">
                          <v-avatar
                            class="text-capitalize"
                            :size="
                              $vuetify.display.mdAndUp ? 'small' : 'x-small'
                            "
                            :class="
                              'text-subtitle-2' +
                              ($vuetify.display.mdAndUp ? '' : 'mr-2') +
                              (/^(to-do)$/i.test(item.raw.status)
                                ? ' text-black'
                                : ' text-white')
                            "
                            :color="`${
                              /^(in-progress)$/i.test(item.raw.status)
                                ? '#FB8C00'
                                : item.raw.status &&
                                    /^(done|completed|resolved)$/i.test(
                                      item.raw.status,
                                    )
                                  ? '#4CAF50'
                                  : item.raw.status &&
                                      /^(pending|cancelled|deleted)$/i.test(
                                        item.raw.status,
                                      )
                                    ? 'red'
                                    : 'grey-lighten-3'
                            }`"
                            style="width: 100px; border-radius: 25px"
                          >
                            {{
                              item.raw.status ||
                              "".charAt(0).toUpperCase() + item.raw.status ||
                              "".slice(1)
                            }}
                          </v-avatar>
                        </span>
                      </v-row>
                    </v-col>
                    <!-- Assignee-->
                    <v-col
                      cols="12"
                      sm="1"
                      md="1"
                      lg="2"
                      class="text text-capitalize"
                    >
                      <v-row
                        no-gutters
                        class="fill-height pa-2"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown
                            ? 'space-between'
                            : 'center'
                        "
                      >
                        <span v-if="!item.raw?.assigneeName">
                          Not Assigned
                        </span>
                        <v-avatar
                          v-if="item.raw?.assigneeName"
                          size="small"
                          :color="materialColors[itemIndex]"
                          class="mr-2 text-white"
                        >
                          {{ getInitial(item.raw?.assigneeName) }}
                        </v-avatar>

                        <span
                          v-if="item.raw?.assigneeName"
                          class="mt-1 text-wrap"
                        >
                          {{ item.raw?.assigneeName || "N/A" }}
                        </span>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-list-item-title>
              </v-list-item>
              <v-divider
                v-if="
                  itemIndex + 1 !== items.length && $vuetify.display.lgAndUp
                "
              />
            </template>
          </v-list>
        </template>
      </base-table>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

definePageMeta({
  middleware: "secure",
});

const { $ability } = useNuxtApp();
const { setSnackbar } = useLocal();

const {
  workOrders,
  setWorkOrders,
  pageRange,
  page,
  pages,
  search,
  itemsPerPage,
  nextPage,
  prevPage,
  isLoading,
} = useWorkOrder();
const { currentUser } = useLocalAuth();
const { myProvider } = useFilter();
const {
  getInitial,
  materialColors,
  standardFormatDate,
  standardFormatDateYearMonthDay,
  getPast30DaysDate,
} = useUtils();
const { getSitesOptionsForFiltering, siteOptions, filterSite, mySite, myOrg } =
  useFilter();

const filters = ref({
  from: standardFormatDateYearMonthDay(getPast30DaysDate()),
  to: standardFormatDateYearMonthDay(new Date()),
});

const filterByStatus = ref("All");
const status = computed(() =>
  filterByStatus.value === "All" ? "" : filterByStatus.value.toLowerCase(),
);

const startDate = ref("");
const endDate = ref("");
function onStartDateChange(value: string) {
  startDate.value = value;
}

function onEndDateChange(value: string) {
  endDate.value = value;
}

// Listen for window resize events to update the condition dynamically
const isLgAndUp = ref(window.innerWidth >= 1280);

window.addEventListener("resize", () => {
  isLgAndUp.value = window.innerWidth >= 1280;
});
const headers = computed(() => {
  const baseHeaders = [
    {
      sm: "2",
      md: "2",
      lg: "2",
      title: "Name",
      align: "left",
      visible: true,
    },
    {
      sm: "3",
      md: "3",
      lg: "2",
      title: "Subject / Date",
      align: "left",
      visible: true,
    },
    {
      sm: "2",
      md: "2",
      lg: "2",
      title: "Application",
      align: "left",
      visible: true,
    },
    // {
    //   sm: "2",
    //   md: "2",
    //   lg: "1",
    //   title: "Category",
    //   align: "left",
    //   visible: true,
    // },
    {
      sm: "2",
      md: "1",
      lg: "1",
      title: "Status",
      align: "left",
      visible: true,
    },
    {
      sm: "3",
      md: "2",
      lg: "2",
      title: "Assignee",
      align: "center",
      visible: true,
    },
  ];
  if (isLgAndUp.value) {
    baseHeaders[1].title = "Subject";
    baseHeaders.splice(2, 0, {
      sm: "3",
      md: "3",
      lg: "2",
      title: "Date",
      align: "left",
      visible: true,
    });
  }

  return baseHeaders;
}) as unknown as {
  sm: string;
  md: string;
  lg: string;
  title: string;
  align: string;
  visible: any;
}[];

onMounted(async () => {
  await getSitesOpt();
  // await setWorkOrders({
  //   // organization: myOrg.value,
  //   provider: currentUser.value.type.includes("service-provider")
  //     ? ""
  //     : myProvider.value,
  //   site: mySite.value,
  //   startDate: filters.value.from,
  //   endDate: filters.value.to,
  // });
});

onUnmounted(() => {
  filterSite.value = "";
  siteOptions.value = [];
});

async function getSitesOpt() {
  try {
    isLoading.value = true;
    await getSitesOptionsForFiltering();
  } catch (error: any) {
    setSnackbar({ text: error.message || error, modal: true, type: "error" });
  } finally {
    isLoading.value = false;
    filterSite.value =
      siteOptions.value.find((i: any) => i._id === mySite.value)?._id || "";
  }
}

async function onFilterSite(value: string) {
  filterSite.value = value;
  await setWorkOrders({
    provider: currentUser.value.type.includes("service-provider")
      ? ""
      : myProvider.value,

    site: filterSite.value,
  });
}

function onSearch(searchTerm: string) {
  debouncedSearch(searchTerm);
}

const debouncedSearch = debounce(async (value: string) => {
  search.value = value;
  page.value = 1;
  setWorkOrders({
    provider: currentUser.value.type.includes("service-provider")
      ? ""
      : myProvider.value,

    site: filterSite.value || mySite.value,
    search: value,
  });
}, 500);

async function changePath(data: TWorkOrder) {
  useRouter().push({
    name: `${data.feedback ? "feedbacks" : "work-orders"}-id`,
    params: {
      id: data.feedback ? data.feedback : data._id,
    },
    query: {
      site: mySite.value,
      page: page.value,
    },
  });
}

async function updateFilter() {
  await setWorkOrders({
    // organization: myOrg.value,
    site: filterSite.value || mySite.value,
    provider: currentUser.value.type.includes("service-provider")
      ? ""
      : myProvider.value,
    startDate: filters.value.from,
    endDate: filters.value.to,
    search: search.value,
    status: filterByStatus.value == "All" ? "" : filterByStatus.value,
  });
}

async function onSelectDateRange(filter: { to: string; from: string }) {
  filters.value = filter;
  page.value = 1;
  await updateFilter();
}

async function onClearDateRage(filter: { to: string; from: string }) {
  page.value = 1;
  await setWorkOrders({
    provider: currentUser.value.type.includes("service-provider")
      ? ""
      : myProvider.value,

    site: filterSite.value || mySite.value,
    status: filterByStatus.value == "All" ? "" : filterByStatus.value,
    search: search.value,
  });
}

// async function accept(feedBack: any) {
//   if (feedBack && feedBack._id) {
//     const data = {
//       _id: feedBack._id,
//       statusUpdate: {
//         status: "In-Progress",
//         updatedById: currentUser.value._id,
//         updatedByName: `${currentUser.value.givenName} ${currentUser.value.surname}`,
//         assignee: currentUser.value._id,
//       },
//     };
//     await updateFeedbackAssignee(data);
//   }
//   page.value = 1;
//   await updateFilter();
// }

async function onNextPage() {
  nextPage({
    // organization: myOrg.value,
    provider: currentUser.value.type.includes("service-provider")
      ? ""
      : myProvider.value,
    site: mySite.value,
    startDate: filters.value.from,
    endDate: filters.value.to,
    search: search.value,
    status: filterByStatus.value == "All" ? "" : filterByStatus.value,
  });
}

async function onPrevPage() {
  prevPage({
    // organization: myOrg.value,
    provider: currentUser.value.type.includes("service-provider")
      ? ""
      : myProvider.value,
    site: mySite.value,
    startDate: filters.value.from,
    endDate: filters.value.to,
    search: search.value,
    status: filterByStatus.value == "All" ? "" : filterByStatus.value,
  });
}

const handleClickWorkOrder = () => {
  console.log("current user", currentUser.value.type);
  if (currentUser.value.type == "site") {
    useRouter().push({
      name: "work-orders-add",
      query: {
        site: mySite.value,
      },
    });
  } else {
    setSnackbar({
      text: `Only site personnel are allowed to create work order.`,
      modal: true,
      type: "error",
    });
  }
};
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

:deep() .v-field__field {
  font-size: 14px;
}

.subject-text {
  display: inline-block;
  word-wrap: break-word;
  white-space: normal;
}
</style>
