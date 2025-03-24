<template>
  <v-row no-gutters class="px-6">
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
      <span style="position: relative; right: 15px; color: baseColor">
        Emergency</span
      >
    </v-col>

    <v-col v-if="loading" class="mt-3">
      <skeleton-loader-component
        :loading="loading"
        v-for="i in 5"
        :key="i"
        transition="fade-transition"
      />
    </v-col>

    <v-col cols="12" class="mt-4" v-else-if="emergency.length">
      <template v-for="emergencyItem in emergency" :key="emergencyItem._id">
        <!-- <skeleton-loader-component v-if="loading" :loading="loading" /> -->

        <v-col cols="12" class="px-0 py-2">
          <v-card
            @click="
              openDialog(
                parseInt(emergencyItem.phoneNumber),
                emergencyItem.title,
              )
            "
            class="style-card"
            flat
          >
            <v-row no-gutters class="mx-6 my-6">
              <v-col cols="1" class="d-flex align-center justify-center">
                <v-avatar rounded="0" size="32">
                  <v-img
                    :src="`${
                      config.public.MAIN_APP_URL
                    }/icons/emergency-contact/${
                      theme === 'dark' ? 'dark' : 'light'
                    }/${emergencyItem.icon}`"
                    class="menu-icon"
                  />
                </v-avatar>
              </v-col>
              <v-col cols="10" class="d-flex align-center">
                <v-card-title
                  class="emergency-txt text-wrap"
                  style="max-width: 250px"
                >
                  {{
                    emergencyItem.title
                      ? emergencyItem.title
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ")
                      : ""
                  }}
                </v-card-title>
              </v-col>
              <v-col cols="1" class="d-flex align-center justify-end">
                <v-avatar rounded="0" size="32">
                  <v-avatar rounded="0" size="32">
                    <v-img src="/icons/emergency/contact.svg" />
                  </v-avatar>
                </v-avatar>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </template>
    </v-col>

    <v-col v-else-if="dataFetched">
      <v-row no-gutters class="d-flex px-6 pb-0 mb-0">
        <v-col cols="12" class="">
          <v-row no-gutters justify="center" class="mt-11">
            <v-col cols="12" class="mt-3 text-center">
              <v-row no-gutters justify="center">
                <v-img height="100%" cover>
                  <v-avatar rounded="0" size="190">
                    <v-img
                      src="/icons/emergency/emergencyData.svg"
                      cover
                    ></v-img>
                  </v-avatar>
                </v-img>
              </v-row>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" class="mt-3">
          <v-row justify="end">
            <v-col cols="12" class="text-center pb-3">
              <div class="px-4">
                <span>No Emergency Contact Listed Yet</span>
                <br class="" />
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>

    <v-dialog
      content-class="my-custom-dialog"
      v-model="dialog"
      transition="dialog-bottom-transition"
    >
      <v-card class="mb-10 style-card-dialog pa-6 rounded-lg">
        <v-card-title
          class="px-0 dialog-title text-truncate"
          style="max-width: 260px"
        >
          {{
            selectedTitle
              ? selectedTitle
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
              : ""
          }}</v-card-title
        >
        <v-row
          no-gutters
          class="mb-5 row-design-dialog pa-2 text-decoration-none"
        >
          <v-col cols="10" class="d-flex align-center">
            <a
              :href="'tel:' + selectedNumber"
              class="text-decoration-none"
              style="font-family: inherit; color: inherit"
            >
              <v-card-title
                class="dialog-number text-truncate"
                style="max-width: 260px"
              >
                {{ selectedNumber }}
              </v-card-title>
            </a>
          </v-col>
          <v-col cols="2" class="d-flex align-center justify-center">
            <v-avatar rounded="0" size="32">
              <v-img src="/icons/emergency/contact.svg"></v-img>
            </v-avatar>
          </v-col>
        </v-row>

        <v-btn
          class="text-none mb-4"
          color="#EB261E"
          size="large"
          variant="flat"
          block
          rounded-sm
          @click="dialog = false"
        >
          Cancel
        </v-btn>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});
const config = useRuntimeConfig();
const { currentUser } = useLocalAuth();
const {
  getAllResidentEmergencyNumber,
  emergency,
  getEmergencyCategory,
  getEmergencyAll,
} = useEmergency();
const { theme } = useLocal();
const dialog = ref(false);
const selectedNumber = ref();
const selectedTitle = ref("");
const emergencyCategoryList = ref([]);
const loading = ref(true);
const dataFetched = ref(false);

onMounted(async () => {
  if (!theme.value) theme.value = "light";
  emergency.value = (
    await getEmergencyAll(currentUser.value.site)
  ).items?.filter((item: { isShown: boolean }) => item.isShown);

  setTimeout(() => {
    loading.value = false;
  }, 1000);
  // loading.value = false;
  dataFetched.value = true;
});

function openDialog(number: number, title: string) {
  selectedNumber.value = number;
  selectedTitle.value = title;
  dialog.value = true;
}

function goBack() {
  useRouter().push({ name: "resident" });
}
function addResident() {
  useRouter().push({ name: "resident-my-unit" });
}

const getIcon = (title: string) => {
  const iconList = [
    { title: "Police", icon: "police-cap.svg" },
    { title: "Ambulance", icon: "ambulance-car.svg" },
    { title: "Fire Fighter", icon: "fire-fighters.svg" },
    { title: "Management", icon: "management.svg" },
    { title: "Security", icon: "security.svg" },
    { title: "Default", icon: "default.svg" },
  ];

  const item = iconList.find((item) =>
    title?.toUpperCase().includes(item.title.toUpperCase()),
  );
  return item ? item.icon : "default.svg";
};

const formatTitle = (title: string) => {
  return title
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const imgSrc = computed(() =>
  theme.value === "dark"
    ? "/dark-mode/forgot-password/images/dark-mode-up.svg"
    : "/dark-mode/forgot-password/images/light-mode-up.svg",
);

const BackIconimgSrc = computed(() =>
  theme.value === "dark"
    ? "/dark-mode/forgot-password/images/back.svg"
    : "/dark-mode/forgot-password/images/back-light.svg",
);
</script>

<style scoped>
.style-card {
  border-radius: 16px;
  box-shadow: 0px 16px 30px 0px rgba(0, 0, 0, 0.3);
}

.style-card-dialog {
  border-radius: 16px;
  background: rgb(var(--v-theme-textBox));
}

.row-design-dialog {
  border-radius: 5px;
  background: rgb(var(--v-theme-bluelight));
}

:deep() .my-custom-dialog {
  align-self: flex-end;
}

.emergency-txt {
  /* text-align: right; */
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px; /* 118.75% */
}

.dialog-title {
  font-family: Roboto;
  font-size: 18.355px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.dialog-number {
  text-align: right;
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px; /* 79.167% */
}
</style>
