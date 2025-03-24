<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-row no-gutters>
        <v-col cols="12" class="header">
          <v-card
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
          </v-card>
          <div>
            <v-img
              :src="
                facility.featuredImage?._id
                  ? `/api/files/${facility.featuredImage?._id}`
                  : '/icons/facility-booking/default.jpg'
              "
              cover
              :class="headerBackgroundImage"
              class="header-background-image"
            >
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
                  ></v-img>
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
                    <v-col cols="5"> </v-col>
                    <v-spacer></v-spacer>
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
                                {{ facility.name }}
                              </span>
                            </v-col>
                            <v-col
                              cols="12"
                              class="text-end mt-0 pt-0"
                              :style="`font-size: 16px;  color: ${textColor}; z-index: 2; position: relative; top: 3px;`"
                            >
                              <span>
                                {{ facility.siteName }}
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

    <v-col class="d-flex justify-end my-0 py-0 px-4 mt-7" cols="12">
      <v-btn
        @click="navigateToBooking"
        class="mt-3 rounded-lg px-5"
        max-width="950"
        color="#EB261E"
        size="large"
        block
        variant="flat"
      >
        Book
      </v-btn>
    </v-col>

    <v-col
      cols="12"
      class="container-card-announcements px-0 ma-0 py-0 pt-0 px-3"
    >
      <skeleton-loader-component v-if="loading" :loading="loading" />

      <v-slide-group class="pt-2" selected-class="bg-primary" multiple>
        <v-slide-group-item
          v-for="(facilityData, index) in facility.gallery"
          :key="index"
          v-slot="{ isSelected, toggle, selectedClass }"
        >
          <v-col
            v-if="facility.gallery.length === 1"
            cols="12"
            @click="
              toggle;
              showDialog = true;
              selectedImageId = facilityData._id;
            "
            :style="{ height: $vuetify.display.smAndUp ? '300px' : '180px' }"
          >
            <v-card variant="flat" width="100%">
              <v-img
                :src="`/api/files/${facility?.gallery[0]?._id}`"
                width="100%"
                cover
              ></v-img>
            </v-card>
          </v-col>
          <v-card
            v-else
            :class="['ma-2 ', selectedClass]"
            height="200"
            :style="{ width: $vuetify.display.smAndUp ? '420px' : '180px' }"
            @click="
              toggle;
              showDialog = true;
              selectedImageId = facilityData._id;
              selectedImageIndex = index;
            "
          >
            <v-img
              :src="`/api/files/${facilityData._id}`"
              height="100%"
              width="100%"
              cover
            ></v-img>
            <div class="d-flex fill-height align-center justify-center">
              <v-scale-transition>
                <v-icon
                  v-if="isSelected"
                  color="white"
                  icon="mdi-close-circle-outline"
                  size="48"
                ></v-icon>
              </v-scale-transition>
            </div>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-col>

    <v-col cols="12">
      <v-toolbar color="surface">
        <v-tabs v-model="tabs" slider-color="#EB261E" grow stacked>
          <v-tab :value="1" text="Description "> </v-tab>

          <v-tab :value="2" text="Availability "> </v-tab>

          <v-tab :value="3" text="Maintenance "> </v-tab>
        </v-tabs>
      </v-toolbar>

      <v-tabs-window v-model="tabs">
        <v-tabs-window-item :value="1">
          <v-card class="pa-6">
            <h4 class="header-about font-weight-medium text-h5 pb-3">About</h4>
            <VuetifyViewer
              :value="facility.description"
              dark
              :class="textColorClass"
            />

            <v-divider class="my-3"></v-divider>
            <h4 class="header-about font-weight-medium text-h5 pt-3 pb-3">
              Rules/Policies
            </h4>

            <div class="text-white" :class="textColorClass" dark>
              <VuetifyViewer
                :value="facility.rulesAndPolicies"
                :dark="true"
                markdown-theme="github"
              />
            </div>
          </v-card>
        </v-tabs-window-item>
        <v-tabs-window-item :value="2">
          <v-card
            class="mt-6"
            flat
            :class="cardDesign"
            v-for="(daySlots, index) in enabledTimeSlots"
            :key="index"
          >
            <v-row no-gutters class="mx-6 my-3">
              <v-col cols="2" class="d-flex align-center justify-center">
                <v-avatar rounded="2" size="24">
                  <v-img src="/icons/facility-booking/clock.svg"></v-img>
                </v-avatar>
              </v-col>

              <v-col cols="10" class="d-flex align-center">
                <span
                  >{{
                    daySlots.day.charAt(0).toUpperCase() + daySlots.day.slice(1)
                  }}
                  : {{ daySlots.data.startTime }} -
                  {{ daySlots.data.endTime }}</span
                >
              </v-col>
            </v-row>
          </v-card>
        </v-tabs-window-item>
        <v-tabs-window-item :value="3">
          <div class="pt-3">
            <span class="px-6 maintenanceStyleText">Maintenance Dates</span>
            <v-card
              class="mx-6 my-3"
              v-for="(maintenanceDate, index) in facility.maintenanceDates"
              :key="index"
            >
              <v-row no-gutters class="mx-6 my-3">
                <v-col cols="2" class="d-flex align-center justify-center">
                  <v-avatar rounded="2" size="24">
                    <v-img :src="calendarImgSrc"></v-img>
                  </v-avatar>
                </v-col>

                <v-col cols="10" class="d-flex align-center">
                  <span> {{ standardFormatDate(maintenanceDate) }} </span>
                </v-col>
              </v-row>
            </v-card>
          </div>
          <v-divider :thickness="2"></v-divider>
          <div class="pt-3">
            <span class="px-6 maintenanceStyleText">Maintenance Monthly</span>
            <v-card
              class="mx-6 my-3"
              v-for="(Monthly, index) in sortedMaintenanceMonthly"
              :key="index"
            >
              <v-row no-gutters class="mx-6 my-3">
                <v-col cols="2" class="d-flex align-center justify-center">
                  <v-avatar rounded="2" size="24">
                    <v-img :src="calendarImgSrc"></v-img>
                  </v-avatar>
                </v-col>

                <v-col cols="10" class="d-flex align-center">
                  <span> {{ formatDay(Monthly) }} </span>
                </v-col>
              </v-row>
            </v-card>
          </div>
          <v-divider :thickness="2"></v-divider>

          <div class="pt-3">
            <span class="px-6 maintenanceStyleText">Maintenance Weekly</span>
            <v-card
              class="mx-6 my-3"
              v-for="(Weekly, index) in facility.maintenanceWeekly"
              :key="index"
            >
              <v-row no-gutters class="mx-6 my-3">
                <v-col cols="2" class="d-flex align-center justify-center">
                  <v-avatar rounded="2" size="24">
                    <v-img :src="calendarImgSrc"></v-img>
                  </v-avatar>
                </v-col>

                <v-col cols="10" class="d-flex align-center">
                  <span> {{ Weekly }} </span>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-col>
    <v-col cols="12" class="px-6 pt-3">
      <v-btn
        @click="navigateToBooking"
        class="mb-4 mt-4 box-shadow rounded-lg"
        color="#EB261E"
        size="x-large"
        variant="flat"
        block
      >
        Book
      </v-btn>
    </v-col>
    <!-- 
    <v-dialog v-model="showDialog" max-width="500px">
      <v-card>
        <v-img :src="`/api/files/${selectedImageId}`"></v-img>
      </v-card>
    </v-dialog> -->
    <!-- <v-dialog v-model="showDialog" max-width="500px">
      <v-card>
        <v-carousel v-model="selectedImageIndex">
          <v-carousel-item
            v-for="(item, index) in facility.gallery"
            :key="index"
          >
            <v-img :src="`/api/files/${item._id}`"></v-img>
          </v-carousel-item>
        </v-carousel>
      </v-card>
    </v-dialog> -->

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
            ></v-img>
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

const selectedImageId = ref(null);
const selectedImageIndex = ref(null);
const loading = ref<boolean>(true);
const showDialog = ref<boolean>(false);
const id = computed(() => useRoute().params.id as string);
const tabs = ref<number>(1);

const { getFacilitiesByPageSearch, facility, editFacilityById } = useFacility();
const { standardFormatDate } = useUtils();

onMounted(async () => {
  if (!theme.value) theme.value = "light";
  const siteId = currentUser.value.site;

  const result = await getFacilitiesByPageSearch({
    sites: [String(siteId)],
    _id: id.value,
  });

  facility.value = result.items[0];

  localStorage.setItem("facility", JSON.stringify(facility.value));

  loading.value = false;
});

const navigateToBooking = () => {
  useRouter().push({
    name: "resident-facility-booking-Book-id",
    params: { id: id.value },
  });
};

const enabledTimeSlots = computed(() => {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  let slots: any[] = [];
  days.forEach((day) => {
    if (facility.value[day].isEnabled) {
      slots.push({ day, data: facility.value[day] });
    }
  });
  return slots;
});

const cardDesign = computed(() =>
  theme.value === "dark" ? "card-design" : "card-design-light",
);

const cardDesignCaroulse = computed(() =>
  theme.value === "dark" ? "card-announcements" : "card-announcements-light",
);

const cardProfileImage = computed(() =>
  theme.value === "dark"
    ? "card-profile-image-dark"
    : "card-profile-image-light",
);

function goBack() {
  useRouter().push({
    name: "resident-facility-booking",
  });
}
const calendarImgSrc = computed(() =>
  theme.value === "dark"
    ? "/dark-mode/invite-visitor/calendar-dark.svg"
    : "/dark-mode/invite-visitor/calendar-light.svg",
);

const headerBackgroundImage = computed(() =>
  theme.value === "dark"
    ? "header-background-image-dark"
    : "header-background-image-light",
);
const textColor = computed(() => (theme.value === "dark" ? "white" : "white"));

const formatDay = (day: any) => {
  if (day === "Last day") {
    return `The last day of each month`;
  }

  let j = day % 10,
    k = day % 100;
  if (j == 1 && k != 11) {
    return `${day}st`;
  }
  if (j == 2 && k != 12) {
    return `${day}nd`;
  }
  if (j == 3 && k != 13) {
    return `${day}rd`;
  }
  return `${day}th`;
};

const sortedMaintenanceMonthly = computed(() => {
  const numbers = facility.value.maintenanceMonthly
    .filter((item: any) => typeof item === "number")
    .sort((a: any, b: any) => a - b);
  const lastDay = facility.value.maintenanceMonthly.filter(
    (item: any) => item === "Last day",
  );
  return [...numbers, ...lastDay];
});
const textColorClass = computed(() =>
  theme.value === "dark" ? "text-white" : "text-black",
);
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
