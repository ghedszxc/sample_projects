<template>
  <div
    :class="['g-row', { 'no-gutters': noGutters }]"
    :style="{ gridTemplateRows }"
  >
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  noGutters: {
    type: Boolean,
    default: false,
  },
  gridTemplateRows: {
    type: String,
    default: "auto",
  },
});
</script>

<style scoped>
.g-row {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 0.5rem;
  height: 100%;
}

.g-row.no-gutters {
  gap: 0;
}
</style>
