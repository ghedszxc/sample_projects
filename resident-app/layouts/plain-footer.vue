<template>
  <v-app :theme="theme">
    <v-main>
      <slot />
    </v-main>

    <v-footer height="70" class="px-0" app :class="mainClass">
      <v-row no-gutters class="px-12">
        <v-col cols="12" class="text-caption pt-1">
          <v-row no-gutters justify="center">
            <span class="Subtitle 2 fs12"
              >© 2024 powered by Seven365 Pte. Ltd. v.1</span
            >
          </v-row>
        </v-col>
      </v-row>
    </v-footer>
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
.background {
  background: #fafafa;
}

.dark-background {
  background: #0f131c;
}
</style>
