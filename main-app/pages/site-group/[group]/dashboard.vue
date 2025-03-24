<template>
  <v-row no-gutters class="pa-8">
    <v-col
      cols="12"
      md="6"
      :class="`mb-4 ${$vuetify.display.lgAndUp && 'pl-3'}`"
    >
      <v-row>
        <v-col cols="12" v-if="$vuetify.display.smAndDown">
          <span class="text-h6"> Overview </span>
        </v-col>

        <v-col cols="12" md="6" class="d-flex">
          <span class="text-h6 mr-6 pt-1" v-if="$vuetify.display.mdAndUp">
            Overview
          </span>

          <v-menu>
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                v-model="filters.from"
                hide-details
                density="compact"
                variant="outlined"
                prepend-inner-icon="mdi-calendar-month-outline"
              ></v-text-field>
            </template>
            <v-date-picker v-model="selectDateFrom">
              <template v-slot:header="{}"></template>
            </v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12" md="4" class="d-flex">
          <span
            class="text-subtitle-1 font-weight-medium mr-6 pt-2"
            v-if="$vuetify.display.mdAndUp"
            >to</span
          >
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                v-model="filters.to"
                hide-details
                density="compact"
                variant="outlined"
                prepend-inner-icon="mdi-calendar-month-outline"
              ></v-text-field>
            </template>
            <v-date-picker v-model="selectDateTo">
              <template v-slot:header="{}"></template>
            </v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12" md="2">
          <v-btn
            block
            variant="outlined"
            class="override_border"
            style="height: 40px"
          >
            Today
          </v-btn>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" v-if="currentUser?.type">
      <div
        v-if="dashboard"
        :class="`d-flex ${
          $vuetify.display.lgAndUp ? 'flex-row' : 'flex-column'
        }`"
      >
        <overview-chart
          v-for="(data, key) in dashboard.charts"
          :key="key"
          :class="`flex-1-0 ${$vuetify.display.lgAndUp ? 'ma-2' : 'my-2'}`"
          :dataProps="data"
          :loading="isDashboardLoading"
        />
      </div>

      <div v-if="dashboard?.workOrders.length" class="mt-6">
        <div :class="`text-h6 ${$vuetify.display.lgAndUp && 'pl-3 mb-2'}`">
          Work Orders
        </div>
        <div
          :class="`d-flex ${
            $vuetify.display.lgAndUp ? 'flex-row' : 'flex-column'
          }`"
        >
          <overview-card
            v-for="(data, key) in dashboard?.workOrders"
            :key="key"
            :class="`flex-1-0 ${$vuetify.display.lgAndUp ? 'ma-2' : 'my-2'}`"
            :dataProps="data"
            :loading="isDashboardLoading"
          />
        </div>
      </div>

      <div v-if="dashboard?.feedbacks.length" class="mt-6">
        <div :class="`text-h6 ${$vuetify.display.lgAndUp && 'pl-3 mb-2'}`">
          Feedback Tickets
        </div>
        <div
          :class="`d-flex ${
            $vuetify.display.lgAndUp ? 'flex-row' : 'flex-column'
          }`"
        >
          <overview-card
            v-for="(data, key) in dashboard?.feedbacks"
            :key="key"
            :class="`flex-1-0 ${$vuetify.display.lgAndUp ? 'ma-2' : 'my-2'}`"
            :dataProps="data"
            :loading="isDashboardLoading"
          />
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const { dashboard, setDashboardByQueryParams, isDashboardLoading } =
  useDashboard();
const { getSPGroupById } = useSPGroup();
const { currentUser } = useLocalAuth();
const route = useRoute();

const filters = {
  from: new Date().toLocaleDateString(),
  to: new Date().toLocaleDateString(),
};
const selectDateFrom = ref(new Date());
const selectDateTo = ref(new Date());

const userId = computed(() => currentUser.value._id);
const type = computed(() => currentUser.value.type);
const serviceProviderGroupId = computed(() => String(route.params.group));

watch(
  selectDateFrom,
  (newValue) => {
    filters.from = newValue.toLocaleDateString();
  },
  { deep: true }
);

watch(
  selectDateTo,
  (newValue) => {
    filters.to = newValue.toLocaleDateString();
  },
  { deep: true }
);

onMounted(async () => {
  // get service provider group by `serviceProviderGroupId`
  const spGroup = await getSPGroupById(serviceProviderGroupId.value);
  const siteId =
    spGroup &&
    spGroup.site &&
    Boolean(spGroup.site) &&
    typeof spGroup.site === "object"
      ? spGroup.site._id
      : spGroup?.site || "";
  const serviceProviderId =
    spGroup && spGroup.serviceProvider && Boolean(spGroup.serviceProvider) && typeof spGroup.serviceProvider === "object"
      ? spGroup.serviceProvider._id
      : spGroup?.serviceProvider || "";
  await setDashboardByQueryParams({
    userId: userId.value,
    siteId: String(siteId || ""),
    serviceProviderId: String(serviceProviderId || ""),
    serviceProviderGroupId: String(spGroup?._id),
    type: "service-provider-dashboard",
  });
});
function toggleLoadingState() {
  isDashboardLoading.value = !isDashboardLoading.value;
}
</script>

<style scoped>
.override_border {
  border: thin solid grey !important;
}
</style>
