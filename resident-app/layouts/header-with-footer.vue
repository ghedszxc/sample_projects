<template>
  <v-app :theme="theme">
    <v-app-bar density="comfortable" elevation="0" app :class="appBarClass">
      <template #prepend>
        <v-img
          src="/images/resident/light/seven-365.svg"
          style="width: 100.153px; margin-left: 10px; margin-top: 6px"
        ></v-img>
      </template>
      <template #append>
        <v-btn
          icon
          density="comfortable"
          @click="theme = theme === 'light' ? 'dark' : 'light'"
        >
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main :class="mainClass">
      <slot />
    </v-main>

    <v-footer height="70" class="px-0" app :class="appBarClass">
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

<script setup>
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

const imageSource = computed(() =>
  theme.value === "dark"
    ? "/images/resident/dark/seven-365.svg"
    : "/images/resident/light/seven-365.svg",
);

const notificationBell = computed(() =>
  theme.value === "dark"
    ? "/icons/resident/home/dark/notification-bell.svg"
    : "/icons/resident/home/light/notification-bell.svg",
);

const card1Plus = computed(() =>
  theme.value === "dark" ? "card1-plus-dark" : "card1-plus-light",
);
</script>

<style>
.dark-background {
  background: #0f131c;
}
.dark-app-bar {
  background: #0f131c !important;
}

.bottom-navigation-light {
  margin-top: 10px;
  height: 66px;
  border-radius: 100px;
  background: linear-gradient(
    180deg,
    rgba(239, 239, 239, 0.5) 35.51%,
    rgba(17, 24, 36, 0.5) 100%
  );
}

.bottom-navigation-dark {
  margin-top: 10px;
  height: 66px;
  border-radius: 100px;
  background: var(
    --glass,
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 35.51%,
      rgba(48, 48, 48, 0.1) 100%
    )
  );
}

.card1-plus-light {
  width: 79px;
  height: 79px;
  border-radius: 123.438px;
  background: #fff;
  box-shadow: 0px 14.813px 17.281px 0px rgba(235, 38, 30, 0.3);
  position: absolute;
  z-index: 1;
  align-self: center;
  margin-left: 9px;
  bottom: 10px;
}

.card1-plus-dark {
  width: 79px;
  height: 79px;
  border-radius: 123.438px;
  background: #131218;
  box-shadow: 0px 14.813px 17.281px 0px rgba(235, 38, 30, 0.3);
  position: absolute;
  z-index: 1;
  align-self: center;
  margin-left: 9px;
  bottom: 10px;
}

.card2-plus {
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(235, 38, 30, 0.3);
}
</style>
