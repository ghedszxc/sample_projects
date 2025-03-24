<template>
  <v-app :theme="theme">
    <v-app-bar density="comfortable" elevation="0" app :class="appBarClass">
      <template #prepend>
        <v-img
          :src="imageSource"
          style="width: 100.153px; margin-left: 10px; margin-top: 6px"
        ></v-img>
      </template>
      <template #append>
        <v-btn icon flat @click="theme = theme === 'light' ? 'dark' : 'light'">
          <v-icon start style="width: 46px; margin-right: 16px">
            <v-img
              :src="`/icons/resident/home/${
                theme === 'dark' ? 'dark' : 'light'
              }/light-dark-mode.svg`"
              :style="`border-radius: 24px; background: ${
                theme === 'dark' ? 'var(--Corporate-blue, #111723)' : '#E8E8E8'
              }`"
            ></v-img>
          </v-icon>
        </v-btn>
      </template>
    </v-app-bar>
    <v-main :class="mainClass">
      <slot />
    </v-main>

    <v-footer height="70" class="px-0" app :class="mainClass">
      <v-row no-gutters class="px-12 d-flex">
        <v-col cols="12" class="text-caption pt-1 text-center">
          <v-row no-gutters justify="center">
            <v-col cols="12" class="pt-6 pb-6">
              <span class="Subtitle 2 fs12"
                >© 2024 powered by Seven365 Pte. Ltd. v.1</span
              ></v-col
            >
          </v-row>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
const { theme } = useLocal();

onMounted(async () => {
  if (!theme.value) theme.value = "light";
});

const mainClass = computed(() =>
  theme.value === "dark" ? "dark-background" : "",
);

const appBarClass = computed(() =>
  theme.value === "dark" ? "dark-app-bar" : "",
);

function goBack() {
  useRouter().push({
    name: useRoute().meta.pageRedirect,
  });
}
const imageSource = computed(() =>
  theme.value === "dark"
    ? "/images/resident/dark/seven-365.svg"
    : "/images/resident/light/seven-365.svg",
);
</script>

<style scoped>
.dark-background {
  background: #0f131c;
}

.dark-app-bar {
  background: #0f131c !important;
}

.text-style {
  color: #e0241c;
  text-align: right;
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}

.header {
  font-size: 16px;
  line-height: 24px;
}
</style>
