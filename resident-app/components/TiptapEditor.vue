<template>
  <div>
    <VCard class="mx-auto">
      <VuetifyTiptap v-model="content" />
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps, watchEffect } from "vue";

const props = defineProps({
  initialContent: String,
});

const content = ref(props.initialContent);

watchEffect(() => {
  content.value = props.initialContent;
});

console.log("content: ", content.value);

const emit = defineEmits(["content-updated"]);

watchEffect(() => {
  emit("content-updated", content.value);
});
</script>
