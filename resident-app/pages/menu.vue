<template>
  <v-row no-gutters>
    <!-- go back -->
    <v-col
      cols="6"
      :class="`mt-6 ${$vuetify.display.smAndUp ? 'px-6' : 'px-3'}`"
      @click="goBack()"
    >
      <v-icon start size="x-large" style="position: relative; right: 5px">
        <v-img
          class="pl-0 ml-0 mt-2"
          src="/dark-mode/utility-all/right-arrow.svg"
          cover
        ></v-img>
      </v-icon>
      <span style="position: relative; right: 15px"> Go Back </span>
    </v-col>

    <!-- header -->
    <v-col
      cols="12"
      :class="`mt-6 ${$vuetify.display.smAndUp ? 'px-6' : 'px-3'}`"
    >
      <v-card :class="`${cardHeader} pa-3`">
        <v-row no-gutters class="fill-height" align-content="center">
          <!-- profile image -->
          <v-col :cols="$vuetify.display.smAndUp ? '5' : '4'">
            <v-img
              cover
              :src="
                currentUser.profilePicture
                  ? `/api/files/${currentUser.profilePicture}`
                  : '/default-profile.svg'
              "
              class="profile-image"
              elevation="0"
            ></v-img>
          </v-col>
          <!-- full name, block name, level name, unit name -->
          <v-col cols="5">
            <v-row no-gutters class="fill-height" align-content="center">
              <!-- full name -->
              <v-col
                cols="12"
                :class="`${residentName} text-capitalize font-weight-bold`"
              >
                {{ currentUser.givenName }} {{ currentUser.surname }}
              </v-col>
              <!-- block name, level name, unit name -->
              <v-col cols="12" :class="blockLevelUnit" class="pr-4">
                {{ currentUser.blockName }}
                {{ currentUser.levelName }}
                {{ currentUser.unitName }}
              </v-col>
            </v-row>
          </v-col>
          <!-- resident type -->
          <v-col :cols="$vuetify.display.smAndUp ? '1' : '3'">
            <v-row no-gutters class="fill-height" align-content="center">
              <v-chip variant="outlined" size="small" class="chip" color="red">
                <span class="chip-text text-capitalize">
                  {{ currentUser.type }}
                </span>
              </v-chip>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <!-- menu items-->
    <v-col
      cols="12"
      :class="`mt-1 ${$vuetify.display.smAndUp ? 'px-6' : 'px-3'}`"
    >
      <v-row no-gutters>
        <v-col cols="12" class="mt-4">
          <v-card :class="cardMenuItems" style="height: 65px">
            <v-row no-gutters class="fill-height" align-content="center">
              <v-col cols="1" class="ml-3">
                <v-icon icon="mdi-web" />
              </v-col>
              <v-col v-show="!isLoadingLanguage" cols="9">
                <google-translate
                  @onShowGoogleTranslate="() => (isLoadingLanguage = false)"
                />
              </v-col>
              <v-col v-show="isLoadingLanguage" cols="9" class="ml-1">
                Google Translate is loading...
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <template v-for="menuItem in menu">
          <v-col cols="12" class="mt-4">
            <v-card :class="cardMenuItems">
              <v-row
                no-gutters
                class="fill-height"
                align-content="center"
                @click="navigateTo(menuItem)"
              >
                <v-col cols="9" class="ml-3">
                  {{ menuItem }}
                </v-col>
                <v-spacer></v-spacer>
                <v-icon
                  start
                  size="medium"
                  style="position: relative"
                  class="mr-5 mt-1"
                >
                  <v-img src="/icons/resident/home/right-arrow.svg"></v-img>
                </v-icon>
              </v-row>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-col>

    <!-- logout button -->
    <v-col
      cols="12"
      :class="`mt-4 ${$vuetify.display.smAndUp ? 'px-6' : 'px-3'}`"
    >
      <v-btn
        block
        color="#E0241C"
        size="x-large"
        class="logout-button"
        @click="logOut"
      >
        Log out
      </v-btn>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
const { currentUser } = useLocalAuth();
const { logout } = useLocalAuth();
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

const { theme } = useLocal();

const back = computed(() =>
  theme.value === "dark" ? "go-back-dark" : "go-back-light",
);

const cardHeader = computed(() =>
  theme.value === "dark" ? "card-header-dark" : "card-header-light",
);

const residentName = computed(() =>
  theme.value === "dark" ? "resident-name-dark" : "resident-name-light",
);

const blockLevelUnit = computed(() =>
  theme.value === "dark" ? "block-level-unit-dark" : "block-level-unit-light",
);

const cardMenuItems = computed(() =>
  theme.value === "dark" ? "card-menu-dark" : "card-menu-light",
);

const currentRoute = ref(false);
const isLoadingLanguage = ref(true);

const router = useRouter();

onBeforeRouteLeave((to, from, next) => {
  if (from.name === "menu") {
    currentRoute.value = true;
  } else {
    currentRoute.value = false;
  }
  next();
});

onMounted(() => {
  if (!theme.value) theme.value = "light";

  const from = router.currentRoute.value;

  if (from.name === "menu") {
    currentRoute.value = true;
  } else {
    currentRoute.value = false;
  }
});

const menu = [
  "Profile",
  "Notification Settings",
  "Account Settings",
  "My Unit",
  "Facility Booking",
  "My Visitor",
  "Online Forms",
  "Terms & Condition / Privacy Policy",
];

function goBack() {
  useRouter().push({ name: "resident" });
}

async function navigateTo(route: string) {
  if (route === "Profile") {
    useRouter().push({ name: "resident-profile" });
  } else if (route === "Account Settings") {
    useRouter().push({ name: "coming-soon" });
  } else if (route === "Notification Settings") {
    useRouter().push({ name: "resident-notification-setting" });
  } else if (route === "My Unit") {
    useRouter().push({ name: "coming-soon" });
  } else if (route === "Facility Booking") {
    useRouter().push({ name: "resident-facility-booking" });
  } else if (route === "My Visitor") {
    useRouter().push({ name: "resident-my-visitor" });
  } else if (route === "Online Forms") {
    useRouter().push({ name: "online-forms" });
  } else {
    await navigateToTermsCondition();
  }
}

const navigateToTermsCondition = () => {
  const currentPath = router.currentRoute.value?.name; // Get current route name directly

  if (currentPath) {
    // Check if currentPath is not null or undefined
    router.push({
      name: "terms-condition",
      query: { fromMenu: currentPath },
    });
  } else {
  }
};

async function logOut() {
  await logout();
  useRouter().push({ name: "index" });
}
</script>
<style scoped>
.go-back-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}
.go-back-dark {
  color: #fcfcfc;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.card-header-light {
  height: 129px;
  width: 100%;
  border-radius: 16px;
  border: 2px solid var(--stroke-light-mode, rgba(185, 184, 192, 0.2));
  background: var(--White, #fff);
  box-shadow: 0px 5px 14px 0px rgba(15, 14, 20, 0.1);
}
.card-header-dark {
  height: 129px;
  width: 100%;
  border-radius: 16px;
  border: 2px solid var(--dark-grey-border, #343a45);
  background: var(--Corporate-blue, #111723);
  box-shadow: 0px 0px 14px 0px rgba(255, 255, 255, 0.1);
}
.profile-image {
  width: 81px;
  height: 81px;
  border-radius: 757.819px;
  border: 2px solid var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(224, 36, 28, 0.5);
}
.resident-name-light {
  color: var(--Secondary-Dark, #0f131c);
  font-feature-settings:
    "liga" off,
    "clig" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 150% */
}
.resident-name-dark {
  color: var(--Light, #dfe2e9);
  font-feature-settings:
    "liga" off,
    "clig" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 150% */
}
.block-level-unit-light {
  color: var(--Grey-sub-text, #555e6f);
  font-feature-settings:
    "liga" off,
    "clig" off;

  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  /* text-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3), 0px 16px 30px rgba(0, 0, 0, 0.9);
  font-size: 12px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  opacity: 0.7; */
}
.block-level-unit-dark {
  color: var(--Light, #dfe2e9);
  font-feature-settings:
    "liga" off,
    "clig" off;

  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  /* text-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3), 0px 16px 30px rgba(0, 0, 0, 0.9);
  font-size: 12px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  opacity: 0.7; */
}
.chip {
  padding: var(--f-spacing-40, 4px) 16px;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  border: 1px solid var(--Primary, #eb261e);
  background: var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}
.chip-text {
  color: #fff;
  font-feature-settings:
    "liga" off,
    "clig" off;
  text-shadow:
    0px 4px 10px rgba(0, 0, 0, 0.3),
    0px 16px 30px rgba(0, 0, 0, 0.9);
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
}
.card-menu-light {
  height: 52px;
  border-radius: 8px;
  border: 1px solid var(--stroke-light-mode, rgba(185, 184, 192, 0.2));
  background: var(--shades-white, #fff);
  box-shadow: 0px 5px 14px 0px rgba(15, 14, 20, 0.1);
}
.card-menu-dark {
  height: 52px;
  border-radius: 8px;
  border: 1px solid var(--black-004, rgba(0, 0, 0, 0.04));
  background: var(--Corporate-blue, #111723);
  box-shadow: 0px 0px 14px 0px rgba(255, 255, 255, 0.1);
}
.logout-button {
  font-size: 16px;
  line-height: 52px;
  border-radius: 8px;
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}
</style>
