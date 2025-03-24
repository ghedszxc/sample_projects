<template>
  <div :class="['g-col', `g-col-${cols}`]">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  cols: {
    type: Number,
    default: 1,
    validator: (value) => value >= 1 && value <= 12,
  },
});
</script>

<style scoped>
.g-col {
  grid-column: span auto;
  align-content: start;
}

.g-col-1 {
  grid-column: span 1;
}
.g-col-2 {
  grid-column: span 2;
}
.g-col-3 {
  grid-column: span 3;
}
.g-col-4 {
  grid-column: span 4;
}
.g-col-5 {
  grid-column: span 5;
}
.g-col-6 {
  grid-column: span 6;
}
.g-col-7 {
  grid-column: span 7;
}
.g-col-8 {
  grid-column: span 8;
}
.g-col-9 {
  grid-column: span 9;
}
.g-col-10 {
  grid-column: span 10;
}
.g-col-11 {
  grid-column: span 11;
}
.g-col-12 {
  grid-column: span 12;
}
</style>
