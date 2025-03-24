<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-row no-gutters>
        <v-col cols="12" class="header">
          <!-- <v-card
            variant="flat"
            width="100"
            height="100"
            :class="cardProfileImage"
          >
            <v-img
              class="profile-image"
              :src="
                facility.icon
                  ? `${config.public.MAIN_APP_URL}/icons/facility/${theme === 'dark' ? 'dark' : 'light'}/${facility.icon}`
                  : '/icons/facility-booking/default.svg'
              "
              elevation="0"
            ></v-img>
          </v-card> -->
          <div>
            <!-- <div
              v-if="loading"
              class="d-flex align-center justify-center fill-height"
              height="300"
              lazy-src="https://picsum.photos/id/11/100/60"
              max-width="500"
              src="https://bad.src/not/valid"
            >
              <v-progress-circular
                color="grey-lighten-4"
                indeterminate
              ></v-progress-circular>
            </div> -->
            <v-img
              v-if="loading"
              :class="headerBackgroundImage"
              class="header-background-image"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular color="grey" indeterminate />
                </div>
              </template>
            </v-img>
            <v-img
              v-else
              :src="
                settingInfoData &&
                settingInfoData.siteInformation &&
                settingInfoData.siteInformation.bgImage
                  ? `/api/files/${settingInfoData.siteInformation.bgImage}`
                  : '/icons/facility-booking/default.jpg'
              "
              cover
              :class="headerBackgroundImage"
              class="header-background-image"
              @load="onImageLoad"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular color="grey" indeterminate />
                </div>
              </template>
              <v-col cols="6" class="header">
                <v-icon
                  start
                  size="x-large"
                  @click="goBack()"
                  style="position: relative; right: 2px; top: 1px; z-index: 1"
                >
                  <v-img
                    class="pl-0 ml-0 mt-1"
                    src="/dark-mode/utility-all/right-arrow.svg"
                    cover
                  />
                </v-icon>
                <span
                  class="text-white text-capitalize"
                  :style="` color: ${textColor}; z-index: 1; position: relative; right: 10px;`"
                  @click="goBack()"
                >
                  Back</span
                >
              </v-col>
              <v-row no-gutters class="fill-height px-4" align-content="end">
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="5" />
                    <v-spacer />
                    <v-col cols="7" class="text-white text-capitalize mb-2">
                      <v-row no-gutters class="fill-height" align="end">
                        <v-col cols="12" class="mb-15">
                          <v-row no-gutters>
                            <v-col
                              cols="12"
                              class="text-end text-capitalize font-weight-bold my-0 py-0"
                              :style="`font-size: 24px; color: ${textColor}; z-index: 1; position: relative;  top: 10px;`"
                            >
                              <span>
                                {{ currentUser.blockName }}
                                {{ currentUser.levelName }}
                                {{ currentUser.unitName }}
                              </span>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-img>
          </div>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" class="mt-3">
      <v-toolbar color="surface" class="mb-3">
        <v-tabs v-model="tabs" slider-color="#EB261E" grow>
          <v-tab :value="1" text="Description" />
          <v-tab :value="2" text="Site Docs" />
          <v-tab :value="3" text="Unit Docs" />
        </v-tabs>
      </v-toolbar>

      <v-tabs-window v-model="tabs">
        <v-tabs-window-item :value="1">
          <v-card class="pa-6">
            <p>
              {{
                settingInfoData && settingInfoData.siteInformation
                  ? settingInfoData.siteInformation.description
                  : ""
              }}
            </p>
          </v-card>
        </v-tabs-window-item>
        <v-tabs-window-item :value="2">
          <template
            v-if="
              settingInfoData &&
              settingInfoData.siteInformation &&
              settingInfoData.siteInformation.docs
            "
          >
            <template v-if="settingInfoData.siteInformation.docs.length === 0">
              <v-col
                cols="12"
                class="ma-0 pa-0 pl-3 pt-2 d-flex text-center justify-center align-center"
              >
                No documents
              </v-col>
            </template>
            <template v-else>
              <v-col
                v-for="doc in settingInfoData.siteInformation.docs"
                :key="doc.id"
                cols="12"
                class="pa-2"
              >
                <v-card
                  style="
                    padding: var(--f-spacing-80, 8px) 16px;
                    border-radius: 4px;
                    border: 0px solid var(--dark-grey-border, #343a45);
                  "
                  class="border-md"
                  color="cardBackground"
                >
                  <v-row no-gutters align="center" justify="space-between">
                    <v-col cols="8" class="ma-0 pa-0 pl-3">
                      {{ doc.name }}
                    </v-col>
                    <v-col cols="4" class="pl-2">
                      <NuxtLink :to="`/api/files/${doc.id}`" target="_blank">
                        <v-chip
                          class="text-white rounded-lg text-decoration-none"
                          style="background-color: red"
                        >
                          Download
                        </v-chip>
                      </NuxtLink>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </template>
          </template>
        </v-tabs-window-item>
        <v-tabs-window-item :value="3">
          <div style="height: 50vh; overflow-y: auto">
            <template v-if="UnitDocuments && UnitDocuments.items">
              <template v-if="UnitDocuments.items.length === 0">
                <v-col
                  cols="12"
                  class="ma-0 pa-0 pl-3 pt-2 d-flex text-center justify-center align-center"
                >
                  No documents
                </v-col>
              </template>
              <template v-else>
                <template v-for="unit in UnitDocuments.items" :key="unit._id">
                  <template
                    v-for="doc in unit.uploadedDocuments"
                    :key="doc.name"
                  >
                    <v-col cols="12" class="ma-0 pa-0 pl-3">
                      <h3 class="text-capitalize">{{ doc.name }}</h3>
                    </v-col>

                    <v-col
                      v-for="file in doc.files"
                      :key="file.id"
                      cols="12"
                      class="pa-2"
                    >
                      <v-card
                        style="
                          padding: var(--f-spacing-80, 8px) 16px;
                          border-radius: 4px;
                          border: 0px solid var(--dark-grey-border, #343a45);
                        "
                        class="border-md"
                        color="cardBackground"
                      >
                        <v-row
                          no-gutters
                          align="center"
                          justify="space-between"
                        >
                          <v-col cols="8" class="ma-0 pa-0 pl-3">
                            {{ file.name }}
                          </v-col>
                          <v-col cols="4" class="pl-2">
                            <NuxtLink
                              :to="`/api/files/${file.id}`"
                              target="_blank"
                            >
                              <v-chip
                                class="text-white rounded-lg text-decoration-none"
                                style="background-color: red"
                              >
                                Download
                              </v-chip>
                            </NuxtLink>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </template>
                </template>
              </template>
            </template>
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-col>

    <v-dialog v-model="showDialog" max-width="500px">
      <v-card>
        <v-carousel v-model="selectedImageIndex">
          <v-carousel-item
            v-for="(item, index) in facility.gallery"
            :key="index"
          >
            <v-img
              :src="`/api/files/${item._id}`"
              height="100%"
              width="100%"
              cover
            />
          </v-carousel-item>
        </v-carousel>
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
const { theme } = useLocal();
const { currentUser } = useLocalAuth();

const selectedImageIndex = ref(null);
const loading = ref<boolean>(true);
const showDialog = ref<boolean>(false);
const id = computed(() => useRoute().params.id as string);
const tabs = ref<number>(1);
const settingInfoData = ref<any>(null);
const UnitDocuments = ref<any>(null);

const { getFacilitiesByPageSearch, facility } = useFacility();
const { getSiteSettingsById } = useSiteSettings();

const { getBlockLevelUnitsByPageSearch } = useBlockLevelUnit();

onMounted(async () => {
  if (!theme.value) theme.value = "light";
  const siteId = currentUser.value.site;

  const result = await getFacilitiesByPageSearch({
    sites: [String(siteId)],
    _id: id.value,
  });
  settingInfoData.value = await getSiteSettingsById(siteId);

  UnitDocuments.value = await getBlockLevelUnitsByPageSearch({
    site: String(siteId),
    unit: String(currentUser.value.unitNumber),
  });

  facility.value = result.items[0];

  localStorage.setItem("facility", JSON.stringify(facility.value));

  loading.value = false;
});

const onImageLoad = () => {
  loading.value = false;
};

const navigateToBooking = () => {
  useRouter().push({
    name: "resident-facility-booking-Book-id",
    params: { id: id.value },
  });
};

const cardProfileImage = computed(() =>
  theme.value === "dark"
    ? "card-profile-image-dark"
    : "card-profile-image-light",
);

function goBack() {
  useRouter().push({
    name: "resident",
  });
}

const headerBackgroundImage = computed(() =>
  theme.value === "dark"
    ? "header-background-image-dark"
    : "header-background-image-light",
);
const textColor = computed(() => (theme.value === "dark" ? "white" : "white"));
</script>

<style scoped>
.header {
  position: relative;
}

.header-background-image {
  position: relative;
  height: 240px;
}
.header-background-image-light::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  box-shadow: inset 0 -1px 0 rgb(134, 134, 134);
  z-index: 1;
}

.header-background-image-dark::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    180deg,
    rgba(20, 22, 39, 0.5) 0%,
    rgba(0, 0, 0, 0.5) 100%,
    #131218 120%
  );
  box-shadow: inset 0 -1px 0 rgb(255, 255, 255);
  z-index: 1;
}
.profile-image {
  box-shadow: 0px 12px 14px 0px rgba(224, 36, 28, 0.5);
}
.container-card-announcements {
  margin-top: 35px;
  margin-bottom: -20px;
}
.card-announcements {
  border-radius: 20px;
  height: 97px;
  align-content: center;
  border: 1px solid var(--dark-grey-border, #343a45);
  background: var(--Corporate-blue, #111723);
}
.card-announcements-light {
  border-radius: 20px;
  height: 97px;
  align-content: center;
  border: 2px solid var(--stroke-light-mode, rgba(185, 184, 192, 0.2));

  /* ds-light-mode */
  box-shadow: 0px 5px 14px 0px rgba(15, 14, 20, 0.1);
}
.offer-assistance {
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}
.card-menu-feedback-announcement {
  font-size: 12px;
  line-height: 24px;
  border: 1px solid #f2f2f2;
  border-radius: 16px;
  padding: 10px;
  background: #fff;
  width: 182px;
  height: 90px;
}
.card-menu-items {
  font-size: 12px;
  line-height: 24px;
  border: 1px solid #f2f2f2;
  border-radius: 16px;
  padding: 10px;
  background: #fff;
}
.menu-icon {
  width: 48px;
  height: 48px;
}

.no-underline {
  text-decoration: none;
}
.profile-image {
  width: 81px;
  height: 81px;
  border-radius: 757.819px;
  border: 2px solid var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(224, 36, 28, 0.2);
}

.header-about {
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 100% */
}

.sub-header {
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
}

.text-details {
  font-feature-settings:
    "clig" off,
    "liga" off;

  hyphens: auto;
  -webkit-hyphens: auto;
  word-spacing: -1px;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 24px; /* 150% */
}

.style-card {
  border-radius: 16px;
}

.text-time {
  text-align: right;
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.box-shadow {
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}

.card-design {
  background: #0f131c;
}

.card-profile-image-light {
  position: absolute;
  bottom: -35px;
  left: 15px;
  z-index: 1;
  border-radius: 757.819px;
  border: 11.89px solid #ffffff;
  align-content: center;
}
.card-profile-image-dark {
  position: absolute;
  bottom: -35px;
  left: 15px;
  z-index: 1;
  border-radius: 757.819px;
  border: 11.89px solid #131218;
  align-content: center;
}
.chip {
  border-radius: 24px;
  border: 1px solid var(--Primary, #eb261e);
  background: var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}

.maintenanceStyleText {
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
}

.text-white :deep(*) {
  color: white !important;
}

.text-black :deep(*) {
  color: black !important;
}

p:empty::after {
  content: "\00A0";
}
</style>
