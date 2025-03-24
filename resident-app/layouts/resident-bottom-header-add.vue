<template>
  <v-app :theme="theme">
    <v-app-bar density="comfortable" elevation="0" app :class="appBarClass">
      <!-- <v-icon
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

      <span style="position: relative; right: 7px; bottom: 2px">
        {{ useRoute().meta.pageTitle }}
      </span>

      <v-icon start size="40" style="position: relative; top: 3px; right: 10px">
        <v-img
          class="pl-0 ml-0 mt-2"
          src="/dark-mode/utility-all/add-visitor.svg"
          cover
        ></v-img>
      </v-icon>

      <template v-slot:append>
        <v-img
          src="/images/resident/light/seven-365.svg"
          style="width: 78.153px; height: 30px"
        ></v-img>
      </template> -->

      <v-col cols="8" class="header">
        <v-row no-gutters>
          <div class="pl-0 ml-0 mt-1" @click="goBack()">
            <v-icon start size="x-large">
              <v-img
                class="pl-0 ml-0 mt-1"
                src="/dark-mode/utility-all/right-arrow.svg"
                cover
              ></v-img>
            </v-icon>

            <span style="position: relative; right: 6px">
              {{ useRoute().meta.pageTitle }}
            </span>
          </div>
          <div @click="goAdd()">
            <v-icon
              start
              size="40"
              style="position: relative; top: 4px; right: 4px"
            >
              <v-img
                class="pl-0 ml-0 mt-2"
                src="/dark-mode/utility-all/add-visitor.svg"
                cover
              ></v-img>
            </v-icon>
          </div>
        </v-row>
      </v-col>
      <template v-slot:append>
        <v-img
          src="/images/resident/light/seven-365.svg"
          style="
            width: 78.153px;
            height: 30px;
            margin-left: 10px;
            margin-top: 6px;
          "
        ></v-img>
      </template>
    </v-app-bar>

    <v-main :class="mainClass">
      <slot />
    </v-main>

    <v-footer app :class="`px-0 justify-center  px-3`">
      <v-card :class="card1Plus">
        <v-row
          no-gutters
          class="fill-height"
          align-content="center"
          justify="center"
        >
          <v-card class="card2-plus">
            <v-row
              no-gutters
              class="fill-height"
              align-content="center"
              justify="center"
            >
              <v-img
                src="/icons/resident/home/light/plus.svg"
                style="width: 24px; height: 24px"
              ></v-img>
            </v-row>
          </v-card>
        </v-row>
      </v-card>
      <v-card :class="bottomNavigation">
        <v-row no-gutters class="fill-height px-3" align-content="center">
          <v-col cols="3">
            <nuxt-link :to="{ name: 'resident' }">
              <v-img
                :src="`/icons/resident/home/${
                  theme === 'dark' ? 'dark' : 'light'
                }/home.svg`"
                style="width: 24px; height: 24px"
              ></v-img>
            </nuxt-link>
          </v-col>

          <v-col cols="5">
            <nuxt-link :to="{ name: '' }">
              <v-img
                :src="`/icons/resident/home/${
                  theme === 'dark' ? 'dark' : 'light'
                }/phone.svg`"
                style="width: 24px; height: 24px"
              ></v-img>
            </nuxt-link>
          </v-col>

          <v-spacer></v-spacer>

          <v-col cols="3">
            <nuxt-link :to="{ name: '' }">
              <v-img
                :src="`/icons/resident/home/${
                  theme === 'dark' ? 'dark' : 'light'
                }/notification-bell.svg`"
                style="width: 24px; height: 24px"
              ></v-img>
            </nuxt-link>
          </v-col>

          <nuxt-link :to="{ name: 'menu' }">
            <v-img
              :src="`/icons/resident/home/${
                theme === 'dark' ? 'dark' : 'light'
              }/menu.svg`"
              style="width: 24px; height: 24px"
            ></v-img>
          </nuxt-link>
        </v-row>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script setup>
const { theme } = useLocal();

const mainClass = computed(() =>
  theme.value === "dark" ? "dark-background" : "background",
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

const bottomNavigation = computed(() =>
  theme.value === "dark" ? "bottom-navigation-dark" : "bottom-navigation-light",
);

const card1Plus = computed(() =>
  theme.value === "dark" ? "card1-plus-dark" : "card1-plus-light",
);

function goBack() {
  useRouter().push({
    name: useRoute().meta.pageRedirect,
  });
}
function goAdd() {
  useRouter().push({
    name: useRoute().meta.pageAdd,
  });
}
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
  width: 100%;
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
  width: 100%;
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
  margin-left: 4px;
  bottom: 15px;
}

.card1-plus-dark {
  width: 79px;
  height: 79px;
  border-radius: 123.438px;
  background: #131218;
  box-shadow: 0px 14.813px 17.281px 0px rgba(235, 38, 30, 0.3);
  position: absolute;
  z-index: 1;
  margin-left: 4px;
  bottom: 15px;
}

.card2-plus {
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(235, 38, 30, 0.3);
}

.text-style {
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  /* 158.333% */
}
</style>
