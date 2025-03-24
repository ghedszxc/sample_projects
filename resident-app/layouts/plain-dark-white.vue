<template>
  <v-app :theme="theme">
    <v-main :class="mainClass">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
const { theme } = useLocal();
onMounted(async () => {
  if (!theme.value) theme.value = "light";
});

const mainClass = computed(() =>
  theme.value === "dark" ? "dark-background" : "",
);
</script>

<style scoped>
.dark-background {
  background: #0f131c;
}
</style>
