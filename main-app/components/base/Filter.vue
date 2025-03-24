<template>
  <v-select
    v-model:model-value="selectedFilter"
    :items="items"
    :item-title="itemTitle"
    :item-value="itemValue"
    hide-details
    density="compact"
    menu-icon="mdi-chevron-down"
    @update:model-value="onFilter(selectedFilter)"
  >
  </v-select>
</template>
<script setup lang="ts" generic="T">
const props = defineProps<{
  selectFilter: any;
  items: T[];
  itemTitle?: string;
  itemValue?: string;
  label?: string;
}>();
const emit = defineEmits<{
  (event: "onFilter", keyword: string): void;
}>();

const selectedFilter = computed(() => props.selectFilter);

function onFilter(keyword: string) {
  console.log("🚀 ~ onFilter ~ keyword:", keyword);
  emit("onFilter", keyword);
}
</script>
<style scoped></style>
