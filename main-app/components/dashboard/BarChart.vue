<template>
  <v-card
    class="mx-2"
    :style="{
      borderRadius: '15px',
    }"
    :loading="props.isLoading"
  >
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="orange"
        height="8"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-card-title class="text-body-1 font-weight-bold px-12 pt-5">
      <v-row justify="space-between" align="center">
        <v-col cols="12" lg="4"> Feedback Tickets </v-col>
        <v-col cols="12" lg="8" align="right">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                color="transparent"
                variant="flat"
                v-bind="props"
                :block="$vuetify.display.mobile"
                class="border rounded-lg"
                style="font-size: 12px !important"
              >
                {{ dateFilter || "Date Filter" }}
                <v-icon class="ml-1">mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in dateFilters"
                :key="index"
                :value="index"
              >
                <v-list-item-title @click="dateFilter = item.title">
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <ApexChart
        type="bar"
        height="250"
        :options="chartInfo.options"
        :series="chartInfo.series"
      ></ApexChart>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const props = defineProps<{
  isLoading: boolean;
  chartInfo: any;
}>();

const { theme } = useLocal();
const { dateFilters } = useDashboard();

const dateFilter = ref("This Week");

const chartOptions = ref({
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    theme: theme.value,
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    position: "top",
    fontSize: "14px",
    fontWeight: "bold",
  },
  xaxis: {
    categories: [
      "Jan 2024",
      "Feb 2024",
      "Mar 2024",
      "Apr 2024",
      "May 2024",
      "Jun 2024",
      "Jul 2024",
    ],
  },
});

const series = ref([
  {
    name: "Resolved",
    data: [28, 29, 33, 36, 32, 32, 33],
  },
  {
    name: "Unresolved",
    data: [12, 11, 14, 18, 17, 13, 13],
  },
]);
</script>
