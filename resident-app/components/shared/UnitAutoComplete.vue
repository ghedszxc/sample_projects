<template>
  <v-autocomplete
    v-model="unit"
    class="custom-input-class"
    :items="units"
    item-title="name"
    :rules="[requiredInput]"
    density="compact"
    variant="plain"
    :disabled="isProgress"
    hide-details
    no-filter
    return-object
    @update:search="onSearchBlockLevelUnit"
  >
    <template #label>
      Unit
      <span class="text-red font-weight-bold">*</span>
    </template>
    <template #append-item>
      <div v-if="canNextUnitPage" v-intersect="endUnitIntersect" />
      <v-row v-if="canNextUnitPage" no-gutters align-content="center">
        <v-col cols="12" class="d-flex justify-center">
          <v-progress-circular :size="20" color="primary" indeterminate />
        </v-col>
      </v-row> </template
  ></v-autocomplete>
</template>
<script setup lang="ts">
import debounce from "lodash/debounce";
const { requiredInput } = useUtils();
const {
  search: unitSearch,
  page: unitPage,
  canNextPage: canNextUnitPage,
  setUnits,
  loadMore: loadMoreUnits,
} = useBlockLevelUnit();

const prop = defineProps({
  units: {
    type: Array,
    default: () => [],
  },
  blockId: {
    type: String,
    default: "",
  },
  unitId: {
    type: String,
    default: "",
  },
});

const isProgress = ref(false);
const unit = ref("");

const onSearchBlockLevelUnit = async (_search: string) => {
  debouncedSearchBlockLevelUnit(_search);
};

const debouncedSearchBlockLevelUnit = debounce(async (value: string) => {
  unitSearch.value = value;
  unitPage.value = 1;
  await setUnits({
    block: prop.blockId,
    level: prop.unitId,
  });
}, 500);

async function endUnitIntersect(isIntersecting: unknown, entries: unknown) {
  if (
    isIntersecting &&
    Array.isArray(entries) &&
    entries[0].boundingClientRect.top > 0
  ) {
    // possible bug here
    loadMoreUnits({
      block: prop.blockId,
      level: prop.unitId,
    });
  }
}
</script>
