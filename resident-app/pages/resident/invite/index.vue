<template>
  <v-row no-gutters class="d-flex px-6 pb-0 mb-0">
    <v-col cols="12" class="header mt-6">
      <v-icon
        start
        size="x-large"
        @click="goBack()"
        style="position: relative; right: 10px"
      >
        <v-img
          class="pl-0 ml-0 mt-1"
          src="/dark-mode/utility-all/right-arrow.svg"
          cover
        ></v-img>
      </v-icon>
      <span
        style="position: relative; right: 15px; color: baseColor"
        :class="textBackColor"
      >
        Invite Visitor</span
      >
    </v-col>
    <v-col class="mt-8 ma-0 pa-0">
      <template v-for="inviteItem in menu" :key="inviteItem.icon">
        <v-col cols="12" class="px-0 card-border">
          <v-card
            :color="colorCard"
            :to="{ name: inviteItem.to }"
            class="style-card"
            flat
            @click="saveToLocalStorage(inviteItem.title)"
          >
            <div class="d-flex flex-no-wrap">
              <v-avatar
                class="ma-4 mr-0"
                rounded="0"
                size="80"
                border="false"
                :style="{ border: 'none' }"
              >
                <v-img
                  :src="`/dark-mode/invite-visitor/${inviteItem.icon}`"
                ></v-img>
              </v-avatar>
              <div class="mt-6">
                <v-card-title class="style-title pb-0" :class="textBackColor">
                  {{ inviteItem.title }}
                </v-card-title>

                <v-card-subtitle class="subtitle-style">{{
                  inviteItem.subtitle
                }}</v-card-subtitle>
              </div>
            </div>
          </v-card>
        </v-col>
      </template>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});
const { theme } = useLocal();

const menu = [
  {
    title: "Drive In",
    subtitle: "Invite guest with vehicle",
    get icon() {
      return theme.value === "dark" ? "drive-in-dark.png" : "drive-in.png";
    },
    to: "resident-invite-visitor-form",
  },
  {
    title: "Walk In",
    subtitle: "Invite walk in guest",
    get icon() {
      return theme.value === "dark" ? "walk-in-dark.png" : "walk-in.png";
    },
    to: "resident-invite-visitor-form",
  },
];

const saveToLocalStorage = (title: string): void => {
  const valueToStore = title === "Drive In" ? "guest" : title;
  localStorage.setItem("Visitor type", valueToStore);
};

function goBack() {
  useRouter().push({ name: "resident" });
}
const previousRoute = ref(false);
const route = useRoute();

onBeforeRouteLeave((to, from, next) => {
  if (from.name === "menu") {
    previousRoute.value = true;
  } else {
    previousRoute.value = false;
  }
  next();
});

onMounted(() => {
  if (!theme.value) theme.value = "light";
});

const textBackColor = computed(() =>
  theme.value === "dark" ? "text-back-dark" : "text-back",
);

const colorCard = computed(() =>
  theme.value === "dark" ? "#111723" : "#FFFFFF",
);
</script>

<style scoped>
.style-card {
  border-radius: 16px;
  background: #fff;
  border: 1px solid #f2f2f2;
  border: 2px solid var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}

.style-title {
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
}

.style-subtitle {
  color: var(--black-038, rgba(0, 0, 0, 0.38));
  text-align: right;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}

.subtitle-style {
  color: var(--Grey-sub-text, #555e6f);
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
</style>
