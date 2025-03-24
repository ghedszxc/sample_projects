<template>
  <div>
    <VCard class="">
      <VuetifyTiptap v-model="content" markdown-theme="github" />
    </VCard>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  initialContent: String,
});

const content = ref("");

onMounted(() => {
  content.value = props.initialContent;
});

watch(
  () => props.initialContent,
  (newVal) => {
    content.value = newVal;
  },
);

watch(
  () => content.value,
  (newVal) => {
    updateContent();
  },
);

const emit = defineEmits(["content-updated"]);

const updateContent = () => {
  emit("content-updated", content.value);
};
</script>

<style scoped>
/deep/ .vuetify-pro-tiptap-editor__content {
  padding: 15px;
}
</style>
