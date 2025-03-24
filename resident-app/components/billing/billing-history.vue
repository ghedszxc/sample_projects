<template>
  <v-row no-gutters justify="center" class="d-flex flex-column mb-10">
    <!-- BILLING FILTER -->
    <v-col class="mt-10 border-md pa-4 rounded" :style="computeInputColor">
      <p>Filter</p>

      <v-select
        label="Select Filter"
        :items="['Master Card', 'Master Card 1', 'Master Card 2']"
        variant="plain"
        class="custom-input-class"
        hide-details
      ></v-select>

      <div class="custom-input-class">
        <v-date-input
          v-model="dateFrom"
          label="From"
          density="compact"
          hide-details
          variant="plain"
        />
      </div>

      <div class="custom-input-class">
        <v-date-input
          v-model="dateTo"
          label="To"
          density="compact"
          hide-details
          variant="plain"
          :min="dateFrom"
        />
      </div>
    </v-col>

    <!-- INVOICE COL -->
    <v-col class="mt-10 border-md pa-4 rounded" :style="computeInputColor">
      <div class="py-5 border-b d-flex align-center justify-space-between">
        <p style="font-weight: 500">Invoice Date</p>
        <p style="font-weight: 700">12/03/25</p>
      </div>

      <div class="d-flex align-center justify-space-between mt-5">
        <p>Transaction</p>
        <p style="color: #eb261e">Invoice 001</p>
      </div>

      <div class="d-flex align-center justify-space-between mt-3">
        <p>Invoice Period</p>
        <p>12/01/24 - 01/01/25</p>
      </div>

      <div class="d-flex align-center justify-space-between mt-3">
        <p>Total</p>
        <p style="color: #4caf50">$S800.00</p>
      </div>

      <div class="d-flex align-center justify-space-between mt-3 pb-5 border-b">
        <p>Payment Status</p>
        <p style="color: #4caf50">Successful</p>
      </div>

      <div class="mt-5 d-flex align-center justify-space-between">
        <v-btn
          color="#111723"
          class="mb-5 border"
          height="42px"
          style="width: 48%"
          >Download Invoice
        </v-btn>
        <v-btn color="#EB261E" class="mb-5" height="42px" style="width: 48%"
          >View
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

// Props

// Emits

// Utilities
const { theme } = useLocal();

// Local State
const dateFrom = ref(new Date());
const dateTo = ref(new Date());

// Computed
const computeInputColor = computed(() => {
  return theme.value === "dark"
    ? { background: "#111723" }
    : { background: "#FFF" };
});

// Methods

// onMounted
onMounted(async () => {});
</script>

<style lang="scss" scoped>
.custom-input-class {
  border: 1px solid #343a45;
  padding: 12px 12px 17px 12px;
  border-radius: 4px;
  margin-top: 20px;
}
</style>
