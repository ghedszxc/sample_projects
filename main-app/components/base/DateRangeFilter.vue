<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-text-field
        v-model="formattedStartDate"
        density="compact"
        label="Date From"
        placeholder="dd/mm/yyyy"
        hide-details
        readonly
        @click="startDateDialog = true"
        append-inner-icon="mdi-calendar"
      >
      </v-text-field>
    </v-col>
    <v-dialog
      v-model="startDateDialog"
      :max-width="$vuetify.display.xs ? '100%' : '332px'"
    >
      <v-card>
        <v-card-subtitle>
          <v-date-picker
            :width="$vuetify.display.xs ? '100%' : '300px'"
            v-model="selectedStartDate"
            :locale="locale"
          ></v-date-picker>
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="startDateDialog = false">Cancel</v-btn>
          <v-btn @click="applyStartDate">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- End Date -->
    <v-col cols="12" sm="6">
      <v-text-field
        v-model="formattedEndDate"
        density="compact"
        label="Date To"
        placeholder="dd/mm/yyyy"
        hide-details
        readonly
        @click="endDateDialog = true"
        append-inner-icon="mdi-calendar"
      >
      </v-text-field>
    </v-col>
    <v-dialog
      v-model="endDateDialog"
      :max-width="$vuetify.display.xs ? '100%' : '332px'"
    >
      <v-card>
        <v-card-subtitle>
          <v-date-picker
            :width="$vuetify.display.xs ? '100%' : '300px'"
            v-model="selectedEndDate"
            :locale="locale"
          ></v-date-picker>
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="endDateDialog = false">Cancel</v-btn>
          <v-btn @click="applyEndDate">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
const { standardFormatDate } = useUtils();
// const emit = defineEmits<{
//   (
//     event: "onSelectDateRange",
//     value: {
//       from: string;
//       to: string;
//     },
//   ): void;
//   (
//     event: "onClearDateRange",
//     value: {
//       from: string;
//       to: string;
//     },
//   ): void;
// }>();
const emit = defineEmits<{
  (event: "onSelectDateRange", value: { from: string; to: string }): void;
  (event: "onClearDateRange", value: { from: string; to: string }): void;
  (event: "onStartDateChange", value: string): void;
  (event: "onEndDateChange", value: string): void;
}>();

const filters = ref({
  from: "",
  to: "",
});
const selectedStartDate = ref<Date | null>(null);
const selectedEndDate = ref<Date | null>(null);

// const today = new Date();
// const oneMonthLater = new Date();
// oneMonthLater.setMonth(today.getMonth() + 1);

// const selectedStartDate = ref(today.toISOString().split("T")[0]); // Format as YYYY-MM-DD
// const selectedEndDate = ref(oneMonthLater.toISOString().split("T")[0]); // Format as YYYY-MM-DD
const startDateDialog = ref(false);
const endDateDialog = ref(false);
const locale = ref("en");

const formattedStartDate = computed(() =>
  selectedStartDate.value ? standardFormatDate(selectedStartDate.value) : "",
);
const formattedEndDate = computed(() =>
  selectedEndDate.value ? standardFormatDate(selectedEndDate.value) : "",
);

onMounted(() => {
  const today = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setDate(today.getDate() + 30);

  selectedStartDate.value = today;
  selectedEndDate.value = oneMonthLater;

  filters.value.from = formatDateToBe(selectedStartDate.value);
  filters.value.to = formatDateToBe(selectedEndDate.value);
  emit("onSelectDateRange", filters.value);
  emit("onStartDateChange", filters.value.from);
  emit("onEndDateChange", filters.value.to);
});

function formatDateToBe(date: Date | null): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function updateStartDate(date: Date | null) {
  if (date) {
    selectedStartDate.value = date;
    filters.value.from = formatDateToBe(date);
    emit("onSelectDateRange", filters.value);
  }
}

function applyStartDate() {
  startDateDialog.value = false;
  updateStartDate(selectedStartDate.value);
}

function updateEndDate(date: Date | null) {
  if (date) {
    selectedEndDate.value = date;
    filters.value.to = formatDateToBe(date);
    emit("onSelectDateRange", filters.value);
  }
}

function applyEndDate() {
  endDateDialog.value = false;
  updateEndDate(selectedEndDate.value);
}
</script>

<style scoped>
.overridePicker {
  width: 18px;
}
</style>
