<template>
  <v-app :theme="theme">
    <!-- <v-app-bar density="comfortable" elevation="0" app :class="appBarClass">
      <v-col cols="8" class="header" @click="goBack()">
        <v-icon
          start
          size="x-large"
          @click="useRouter().push({ name: 'create-account-terms-condition' })"
        >
          <v-img
            class="pl-0 ml-0 mt-1"
            src="/dark-mode/utility-all/right-arrow.svg"
            cover
          ></v-img>
        </v-icon>

        <span style="position: relative; right: 6px">
          {{ useRoute().meta.pageTitle }}
        </span>
      </v-col>
      <template v-slot:append>
        <v-img
          src="/images/resident/light/seven-365.svg"
          style="
            width: 78.153px;
            height: 24px;
            margin-left: 10px;
            margin-top: 6px;
          "
        ></v-img>
      </template>
    </v-app-bar> -->
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
  console.log("goBack", useRoute().meta.pageRedirect);

  useRouter().push({
    name: useRoute().meta.pageRedirect,
  });
}
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
  font-feature-settings: "clig" off, "liga" off;
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
