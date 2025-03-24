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

    <v-col
      v-for="soa in soaData"
      :key="soa._id"
      class="mt-10 border-md rounded py-5 px-3"
      :style="computeInputColor"
    >
      <div class="d-flex align-center justify-space-between pb-5 border-b">
        <p class="pt-3" style="font-weight: 500">SOA request</p>
        <!-- date requested -->
        <p>{{ formatDateString(soa.createdAt as string, "mm-dd-yyyy") }}</p>
      </div>

      <div class="pt-5 d-flex align-center justify-space-between">
        <p>SOA Period</p>
        <p>{{ soa.duration }}</p>
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
    status: "Pending",
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
