<template>
  <v-row no-gutters class="pa-8">
    <v-col
      cols="12"
      :class="`mb-4 ${$vuetify.display.lgAndUp && 'pl-3'}`"
      align="center"
    >
      <v-row no-gutters align="center" class="">
        <v-col cols="12" md="4" class="text-left mb-2 pl-2 mb-md-0 pl-md-0">
          <span class="text-h5"> Overview </span>
        </v-col>

        <v-col cols="12" md="8">
          <v-row no-gutters align="center" align-content="center">
            <v-col
              cols="12"
              :md="
                /^(organization|service-provider)$/i.test(currentUser.type)
                  ? 8
                  : 12
              "
            >
              <base-date-range-filter
                @on-select-date-range="onSelectDateRange($event)"
                @on-clear-date-rage="onClearDateRage($event)"
              />
            </v-col>
            <v-col
              cols="12"
              :md="
                /^(organization|service-provider)$/i.test(currentUser.type)
                  ? 4
                  : 0
              "
              v-if="/^(organization|service-provider)$/i.test(currentUser.type)"
            >
              <v-select
                v-model:model-value="filterSite"
                :items="siteOptions"
                item-title="name"
                item-value="_id"
                label="Select site to filter"
                hide-details
                :persistent-hint="false"
                @update:model-value="onFilterSite"
                class="mx-3 mx-md-0 mt-2 mt-md-0"
              ></v-select>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12">
      <div
        :class="`d-flex ${
          $vuetify.display.lgAndUp ? 'flex-row' : 'flex-column'
        }`"
      >
        <dashboard-count-card
          v-for="(data, key) in countCardList"
          :key="key"
          :class="`flex-1-0 ${$vuetify.display.lgAndUp ? 'ma-2' : 'my-2'}`"
          :data="data"
          @update-filter="onFilterCountCard($event)"
        />
      </div>
    </v-col>

    <v-col cols="12">
      <dashboard-line-chart
        :isLoading="isDashboardLoading"
        :chartInfo="visitorsChart"
        @update-filter="onFilterLineGraph($event)"
      />
    </v-col>

    <v-col cols="12" class="mt-2">
      <dashboard-bar-chart
        :isLoading="isFeedbackTicketLoading"
        :chartInfo="feedbackTicketChart"
      />
    </v-col>

    <v-col cols="12" class="mt-2">
      <v-row no-gutters>
        <v-col
          cols="12"
          lg="4"
          :class="`px-2 ${$vuetify.display.mobile && key && 'mt-2'}`"
          v-for="(data, key) in pieChartList"
          :key="key"
        >
          <dashboard-pie-chart :data="data" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const {
  dashboard,
  setDashboardByQueryParams,
  isDashboardLoading,
  countCardList,
  pieChartList,

  visitorsChart,
  getDashboardOverviewInfo,

  feedbackTicketChart,
  getFeedbackTicketsInfo,
  isFeedbackTicketLoading,
} = useDashboard();

const { currentUser } = useLocalAuth();
const { getSitesOptionsForFiltering, mySite, siteOptions } = useFilter();
import FacilityCard from "~/components/FacilityCard.vue";

const userId = computed(() => currentUser.value._id);
const type = computed(() => currentUser.value.type);
const siteId = ref();
const filterSite = ref("");
const dateRangeFilter = ref({
  from: "",
  to: "",
});

const filterPayload = ref({
  guests: "thisWeek",
  "pick-up": "thisWeek",
  "drop-off": "thisWeek",
  contractor: "thisWeek",
  delivery: "thisWeek",
});

const lineFilter = ref("thisWeek");

onMounted(async () => {
  await onInit();
  getDashboardOverviewInfo(mySite.value, "thisWeek", {
    filters: filterPayload.value,
  });
  getFeedbackTicketsInfo(mySite.value, "thisYear");
});

async function onInit() {
  await getSitesOptionsForFiltering();
  if (
    siteOptions.value.length > 0 &&
    /^(organization|service-provider)$/i.test(currentUser.value.type)
  ) {
    // set default value
    const { name, _id } = siteOptions.value[siteOptions.value.length - 1];
    filterSite.value = name;
    siteId.value = _id;
  }
  await setDashboardByQueryParams({
    userId: userId.value,
    siteId: siteId.value || mySite.value,
    type: type.value,
    dateFrom: dateRangeFilter.value.from,
    dateTo: dateRangeFilter.value.to,
  });
}

async function onSelectDateRange(filter: { to: string; from: string }) {
  dateRangeFilter.value = filter;
  await setDashboardByQueryParams({
    userId: userId.value,
    siteId: siteId.value || mySite.value || filterSite.value,
    dateFrom: dateRangeFilter.value.from,
    dateTo: dateRangeFilter.value.to,
    type: type.value,
  });
}

async function onClearDateRage(filter: { to: string; from: string }) {
  dateRangeFilter.value = filter;
  await setDashboardByQueryParams({
    userId: userId.value,
    siteId: siteId.value || mySite.value || filterSite.value,
    dateFrom: dateRangeFilter.value.from,
    dateTo: dateRangeFilter.value.to,
    type: type.value,
  });
}

async function onFilterSite(value: string) {
  await setDashboardByQueryParams({
    userId: userId.value,
    siteId: value,
    dateFrom: dateRangeFilter.value.from,
    dateTo: dateRangeFilter.value.to,
    type: type.value,
  });
}

async function onFilterCountCard(payload: any) {
  const title = payload.value as string;
  if (title === "guests") {
    filterPayload.value[title] = payload.filter;
  }

  getDashboardOverviewInfo(mySite.value, lineFilter.value, {
    filters: filterPayload.value,
  });
}

async function onFilterLineGraph(payload: any) {
  lineFilter.value = payload.filter;
  getDashboardOverviewInfo(mySite.value, lineFilter.value, {
    filters: filterPayload.value,
  });
}
</script>

<style scoped>
.override_border {
  border: thin solid grey !important;
}

.overridePicker {
  width: 18px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

.button-container {
  margin-top: 20px;
}

.success {
  color: green;
  margin-top: 20px;
}

.error {
  color: red;
  margin-top: 20px;
}
</style>
