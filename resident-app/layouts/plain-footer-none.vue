<template>
  <v-app :theme="theme">
    <v-main :class="mainClass">
      <slot />
    </v-main>

    <v-footer height="70" class="px-0" app :class="mainClass">
      <v-row no-gutters class="px-12 d-flex">
        <v-col cols="12" class="text-caption pt-1 text-center">
          <v-row no-gutters justify="center">
            <v-col cols="12">
              <nuxt-link
                :to="{ name: 'coming-soon' }"
                class="need-help text-decoration-none"
              >
                Need help?
              </nuxt-link>
              <br
            /></v-col>
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

<script setup>
// const { theme } = useUtils();
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
</script>

<style scoped>
.dark-background {
  background: #0f131c;
}

.text-style {
  color: #e0241c;
  text-align: right;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}
.need-help {
  text-align: center;
  color: #e0241c;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
}
</style>
