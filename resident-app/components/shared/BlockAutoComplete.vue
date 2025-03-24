<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <v-autocomplete
    v-model="block"
    class="custom-input-class"
    :items="blocks"
    item-title="name"
    variant="plain"
    :disabled="isProgress"
    :rules="[requiredInput]"
    hide-details
    no-filter
    return-object
    @update:model-value="onSelectBlock($event as unknown as TBlock)"
    @update:search="onSearchBlock"
    @click:clear="$emit('click:clear')"
  >
    <template #label>
      Block
      <span class="text-red font-weight-bold">*</span>
    </template>
    <template #append-item>
      <div v-if="canNextBlockPage" v-intersect="endBlockIntersect" />
      <v-row v-if="canNextBlockPage" no-gutters align-content="center">
        <v-col cols="12" class="d-flex justify-center">
          <v-progress-circular :size="20" color="primary" indeterminate />
        </v-col>
      </v-row>
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";
const { requiredInput } = useUtils();
const {
  search: blockSearch,
  page: blockPage,
  canNextPage: canNextBlockPage,
  loadMore: loadMoreBlocks,
  setBlocks,
} = useBlock();
const { search: levelSearch, setBlockLevels } = useBlockLevel();
const { currentUser } = useLocalAuth();

defineProps({
  blocks: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["update:modelValue", "click:clear"]);

const isProgress = ref(false);
const block = ref("");

async function onSelectBlock(block?: TBlock) {
  if (!block) return;
  const { _id } = block;
  levelSearch.value = "";
  await setBlockLevels({ block: _id });
  emit("update:modelValue", block);
}

const onSearchBlock = async (_search: string) => {
  debouncedSearchBlock(_search);
};

const debouncedSearchBlock = debounce(async (value: string) => {
  blockSearch.value = value;
  blockPage.value = 1;
  await setBlocks({
    site: currentUser.value.site,
  });
}, 500);

async function endBlockIntersect(isIntersecting: unknown, entries: unknown) {
  if (
    isIntersecting &&
    Array.isArray(entries) &&
    entries[0].boundingClientRect.top > 0
  ) {
    loadMoreBlocks({ site: currentUser.value.site });
  }
}
</script>
