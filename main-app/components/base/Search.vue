<template>
  <v-text-field
    v-model="search"
    :placeholder="placeholder"
    :append-inner-icon="icon"
    :clearable="clearable"
    density="compact"
    hide-details
    @update:modelValue="onSearch($event)"
    @click:clear="emit('onClearSearch')"
  >
  </v-text-field>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";
defineProps({
  placeholder: {
    type: String,
    default: "Search for keyword",
  },
  icon: {
    type: String,
    default: "mdi-magnify",
  },
  clearable: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits<{
  (event: "onSearch", keyword: string): void;
  (event: "onClearSearch"): void;
}>();

const search = ref("");

const onSearch = (keyword: string) => {
  debouncedSearch(keyword);
};
const debouncedSearch = debounce(async (keyword: string) => {
  emit("onSearch", keyword);
}, 1000);
</script>
