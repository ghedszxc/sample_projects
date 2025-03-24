<template>
  <v-row no-gutters justify="center" class="d-flex flex-column">
    <v-text-field
      class="search-bar mt-10"
      label="Search forms"
      density="compact"
      variant="plain"
      hide-details
      clearable
      append-inner-icon="mdi-magnify"
    />

    <!-- SOA COL -->
    <v-col
      v-for="soa in soaData"
      :key="soa._id"
      class="mt-10 border-md rounded pt-5 pb-3 px-3"
      :style="computeInputColor"
    >
      <div class="pb-5 pt-3 border-b d-flex align-center justify-space-between">
        <p style="font-weight: 500">SOA</p>
        <p style="font-weight: 700">
          {{ formatDateString(soa.createdAt as string, "mm-dd-yyyy") }}
        </p>
      </div>
      <div class="py-5 border-b d-flex align-center justify-space-between">
        <p>SOA Period</p>
        <p>{{ soa.duration }}</p>
      </div>
      <div class="mt-5 d-flex align-center justify-space-between">
        <v-btn
          color="#111723"
          class="mb-5 border"
          height="42px"
          style="width: 48%"
          >Download
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
import { formatDateString } from "../../utils/date-format.util";
const { theme } = useLocal();
const { getStatementOfAccounts } = useSOA();
const { currentUser } = useLocalAuth();

// Local State
const soaData = ref<TSOA[]>([]);
const soaTo = ref("");

// Computed
const computeInputColor = computed(() => {
  return theme.value === "dark"
    ? { background: "#111723" }
    : { background: "#FFF" };
});

// Methods
const loadUserSOA = async () => {
  const payload = {
    unitId: currentUser.value.unitNumber,
    page: 1,
    status: "Approved",
  };
  const res = await getStatementOfAccounts(payload);
  if (res) {
    soaData.value = res.items;
    soaTo.value = soaData.value[0].unit;
  }
};

// onMounted
onMounted(async () => {
  await loadUserSOA();
});
</script>

<style lang="scss" scoped>
.search-bar {
  border: 1px solid #eb261e;
  padding: 12px 12px 17px 12px;
  border-radius: 4px;
  position: relative;
}
</style>
