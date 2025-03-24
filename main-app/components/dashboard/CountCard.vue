<template>
  <v-card
    :style="{
      width: `${$vuetify.display.lgAndUp ? '15%' : '100%'}`,
      borderRadius: '15px',
    }"
  >
    <v-card-title class="text-body-1">
      <v-row justify="space-between" align="center">
        <v-col cols="12" v-if="$vuetify.display.mdAndDown" class="pb-0">
          <v-img
            :src="`/charts/${props.data.icon}`"
            height="32"
            width="32"
          ></v-img>
        </v-col>
        <v-col cols="6">
          {{ props.data.title }}
        </v-col>
        <v-col cols="6" v-if="$vuetify.display.lgAndUp">
          <v-img
            :src="`/charts/${props.data.icon}`"
            height="32"
            width="32"
            class="float-right"
          ></v-img>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-row align="center">
        <v-col cols="12" class="text-h3 font-weight-bold">
          {{ props.data.count }}
        </v-col>
        <v-col cols="6">
          <v-chip
            class="ma-2 font-weight-bold"
            color="green"
            border="success sm opacity-100"
            label
          >
            <v-icon icon="mdi-trending-up" start></v-icon>
            20%
          </v-chip>
          <!-- trending-up -->
          <!-- trending-down -->
        </v-col>
        <v-col cols="12" sm="3" lg="6">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                color="transparent"
                variant="flat"
                v-bind="props"
                size="small"
                block
                class="py-4 border rounded-lg"
              >
                {{ dateFilter || "Date Filter" }}
                <v-icon class="ml-1">mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in dateFilters"
                :key="`${index}-${item.title}`"
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
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: any;
}>();

const emits = defineEmits(["updateFilter"]);

const { mySite, myOrg } = useFilter();
const { dateFilters, getDashboardOverviewInfo } = useDashboard();

const dateFilter = ref("This Week");

watch(dateFilter, (newVal) => {
  emits("updateFilter", { filter: newVal, ...props.data });
});
</script>
