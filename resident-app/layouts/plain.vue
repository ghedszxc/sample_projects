<template>
  <v-app :theme="theme">
    <slot />
  </v-app>
</template>

<script setup>
const { theme } = useUtils();
</script>
