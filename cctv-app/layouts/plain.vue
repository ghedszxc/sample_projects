<template>
  <v-app :theme="theme">
    <v-main class="bg-secondary">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
const { theme } = useUtils();
</script>
