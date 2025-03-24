<template>
  <v-card
    class="mx-2"
    :style="{
      borderRadius: '15px',
    }"
    :loading="props.isLoading"
  >
    <v-card-title class="text-body-1 font-weight-bold px-12 pt-5">
      <v-row justify="space-between" align="center">
        <v-col cols="12" lg="4"> No. of Visitors </v-col>
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
                <v-list-item-title @click="dateFilter = item.value">
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
        type="line"
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

const emits = defineEmits(["updateFilter"]);

const { mySite, myOrg } = useFilter();
const { dateFilters, getDashboardOverviewInfo } = useDashboard();

const dateFilter = ref("This Week");

watch(dateFilter, (newVal) => {
  emits("updateFilter", { filter: newVal, ...props.chartInfo });
});
</script>
