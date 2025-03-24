<template>
  <v-autocomplete
    v-model="level"
    class="custom-input-class"
    :items="blockLevels"
    item-title="level"
    variant="plain"
    :rules="[requiredInput]"
    density="compact"
    :disabled="isProgress"
    hide-details
    no-filter
    return-object
    @update:model-value="
      onSelectBlockLevel($event as unknown as TBlockLevelUnit)
    "
    @update:search="onSearchBlockLevel"
    @click:clear="$emit('click:clear')"
  >
    <template #label>
      Level
      <span class="text-red font-weight-bold">*</span>
    </template>
    <template #append-item>
      <div v-if="canNextLevelPage" v-intersect="endLevelIntersect" />
      <v-row v-if="canNextLevelPage" no-gutters align-content="center">
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
  search: levelSearch,
  page: levelPage,
  canNextPage: canNextLevelPage,
  loadMore: loadMoreLevels,
  setBlockLevels,
} = useBlockLevel();
const { search: unitSearch, setUnits } = useBlockLevelUnit();

const prop = defineProps({
  blockLevels: {
    type: Array,
    default: () => [],
  },
  blockId: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:modelValue", "click:clear"]);

const isProgress = ref(false);
const level = ref("");

async function onSelectBlockLevel(level?: TBlockLevelUnit) {
  if (!level && !prop.blockId) return;
  unitSearch.value = "";
  await setUnits({
    block: prop.blockId,
    level: level?._id,
  });
  emit("update:modelValue", level);
}

const onSearchBlockLevel = async (_search: string) => {
  debouncedSearchBlockLevel(_search);
};

const debouncedSearchBlockLevel = debounce(async (value: string) => {
  levelSearch.value = value;
  levelPage.value = 1;
  await setBlockLevels({
    block: prop.blockId,
  });
}, 500);

async function endLevelIntersect(isIntersecting: unknown, entries: unknown) {
  if (
    isIntersecting &&
    Array.isArray(entries) &&
    entries[0].boundingClientRect.top > 0
  ) {
    loadMoreLevels({ block: prop.blockId });
  }
}
</script>
