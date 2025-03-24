<template>
  <v-skeleton-loader
    v-if="loading"
    class="mb-4 rounded-xl"
    :elevation="4"
    type="list-item-avatar"
    height="100"
  ></v-skeleton-loader>
</template>

<script setup>
const props = defineProps({
  loading: Boolean,
});
</script>

<style lang="scss" scoped>
</style>