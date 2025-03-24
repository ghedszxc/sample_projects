<template>
  <div>
    <VCard class="mx-auto">
      <VuetifyTiptap
        v-model="content"
        markdown-theme="github"
        :maxHeight="maxHeight"
        :minHeight="minHeight"
        :maxWidth="maxWidth"
      />
    </VCard>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  initialContent: String,
  maxHeight: String,
  minHeight: String,
  maxWidth: String,
  storageKey: String,
  clearOnLoad: Boolean,
});

const content = ref(localStorage.getItem(props.storageKey) || "");

onMounted(() => {
  if (props.clearOnLoad) {
    content.value = "";
    localStorage.removeItem(props.storageKey);
  }
  if (props.initialContent !== undefined) {
    content.value = props.initialContent;
  }
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
    localStorage.setItem(props.storageKey, newVal);
  },
);

const emit = defineEmits(["content-updated"]);

const updateContent = () => {
  emit("content-updated", content.value);
};
</script>

<style scoped></style>
