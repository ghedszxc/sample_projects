<template>
  <v-row class="pa-8">
    <v-col cols="12">
      <v-card>
        <v-card-title>
          <v-row no-gutters>
            <v-col cols="12" md="4" :class="`font-weight-bold text-h5`">
              <v-container fill-height>
                <v-layout
                  align-center
                  :class="{ 'mt-2': $vuetify.display.mdAndUp }"
                >
                  Site Settings
                </v-layout>
              </v-container>
            </v-col>
            <v-col cols="12" md="8" class="d-flex">
              <v-row no-gutters>
                <v-col cols="12" sm="4">
                  <v-switch
                    v-model="siteSetting.qrCode"
                    color="primary"
                    label="QR Code"
                    hide-details
                    density="compact"
                    class="mr-8"
                    @update:modelValue="onUpdateSiteSettings()"
                  ></v-switch>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-switch
                    v-model="siteSetting.manualCheckIn"
                    color="primary"
                    label="Manual Check-In"
                    hide-details
                    density="compact"
                    @update:modelValue="onUpdateSiteSettings()"
                  ></v-switch>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-switch
                    v-model="siteSetting.anpr.showUnregisteredTransactions"
                    color="primary"
                    label="Enable/Disable ANPR Dialog"
                    hide-details
                    density="compact"
                    class="mr-8"
                    @update:model-value="onTransactionSwitchChange($event)"
                  ></v-switch>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-switch
                    v-model="siteSetting.autoCheckOut"
                    color="primary"
                    label="Auto Check Out Visitor on Pass/Keys Returned"
                    hide-details
                    density="compact"
                    class="mr-8"
                    @update:modelValue="onUpdateSiteSettings()"
                  ></v-switch>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-switch
                    v-model="siteSetting.openBarrierForPickupDropoff"
                    color="primary"
                    label="Enable Opening of Barrier for Pickup & Drop-off"
                    hide-details
                    density="compact"
                    class="mr-8"
                    @update:modelValue="onUpdateSiteSettings()"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
        </v-card-title>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card :loading="isSiteSettingsLoading">
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>
        <v-tabs v-model="tab" slider-color="primary">
          <v-tab value="one">Delivery</v-tab>
          <v-tab value="three">Overnight Parking</v-tab>
          <v-tab value="four">Feedback Notification Interval</v-tab>
          <v-tab value="five">Visitor Allotted Time</v-tab>
          <v-tab value="six">Contractor Allotted Time</v-tab>
          <v-tab value="seven"
            >Visitor & Contractor Notification Interval</v-tab
          >
          <v-tab value="eight">Site Information</v-tab>
          <v-tab value="nine">Virtual Patrol Settings</v-tab>
          <v-tab value="ten">EntryPass Server Settings</v-tab>
          <v-tab value="eleven">Auto Checkout Visitor Time</v-tab>
          <v-tab value="twelve">ANPR Camera Settings</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="one">
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="4">
                <SettingsDelivery />
              </v-col>

              <!-- <v-col cols="12" sm="6" md="6" lg="4">
                <SettingsTaxiHire />
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="4">
                <SettingsPrivateHire />
              </v-col> -->
              <v-col cols="12" sm="6" md="6" lg="4">
                <SettingsSeasonPassType />
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="4"> <SettingsAnpr /> </v-col
              ><v-col cols="12" sm="6" md="6" lg="4"> <SettingsCctv /> </v-col>
            </v-row>
          </v-tabs-window-item>

          <v-tabs-window-item value="three">
            <v-col cols="12">
              <v-row no-gutters justify="center">
                <v-col cols="12" sm="4" md="4" lg="3" xl="3">
                  <v-row no-gutters>
                    <v-col cols="12" class="mt-4 font-weight-bold text-h5">
                      Overnight Parking Approval Hours
                    </v-col>
                    <!-- day and time-->
                    <v-col
                      cols="12"
                      class="mt-4"
                      v-for="(day, index) in daysList"
                      :key="index"
                    >
                      <v-row no-gutters>
                        <v-col
                          cols="6"
                          class="text-capitalize font-weight-bold"
                        >
                          {{ day }}
                        </v-col>

                        <v-col cols="6" class="text-end">
                          <v-icon
                            @click="
                              overnightParkingApprovalHoursSettings[
                                day
                              ].isEnabled =
                                !overnightParkingApprovalHoursSettings[day]
                                  .isEnabled
                            "
                            :color="
                              overnightParkingApprovalHoursSettings[day]
                                .isEnabled
                                ? 'green'
                                : ''
                            "
                          >
                            {{
                              overnightParkingApprovalHoursSettings[day]
                                .isEnabled
                                ? "mdi-check-circle"
                                : "mdi-check-circle-outline"
                            }}
                          </v-icon>
                        </v-col>

                        <v-col
                          cols="12"
                          sm="6"
                          md="6"
                          lg="6"
                          xl="6"
                          :class="{
                            'pr-0': $vuetify.display.smAndDown,
                            'pr-2': $vuetify.display.smAndUp,
                          }"
                        >
                          Start
                          <div
                            @click="
                              handleClick(
                                !overnightParkingApprovalHoursSettings[day]
                                  .isEnabled,
                              )
                            "
                          >
                            <v-combobox
                              :items="timeList"
                              v-model="
                                overnightParkingApprovalHoursSettings[day]
                                  .startTime
                              "
                              :disabled="
                                !overnightParkingApprovalHoursSettings[day]
                                  .isEnabled
                              "
                              hide-details
                            ></v-combobox>
                          </div>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="6"
                          lg="6"
                          xl="6"
                          :class="{
                            'pr-0': $vuetify.display.smAndDown,
                            'pr-2': $vuetify.display.smAndUp,
                          }"
                        >
                          End
                          <div
                            @click="
                              handleClick(
                                !overnightParkingApprovalHoursSettings[day]
                                  .isEnabled,
                              )
                            "
                          >
                            <v-combobox
                              :items="
                                day === 'monday'
                                  ? endTimeListMonday
                                  : day === 'tuesday'
                                    ? endTimeListTuesday
                                    : day === 'wednesday'
                                      ? endTimeListWednesday
                                      : day === 'thursday'
                                        ? endTimeListThursday
                                        : day === 'friday'
                                          ? endTimeListFriday
                                          : day === 'saturday'
                                            ? endTimeListSaturday
                                            : day === 'sunday'
                                              ? endTimeListSunday
                                              : []
                              "
                              v-model="
                                overnightParkingApprovalHoursSettings[day]
                                  .endTime
                              "
                              :disabled="
                                !overnightParkingApprovalHoursSettings[day]
                                  .isEnabled
                              "
                              hide-details
                            ></v-combobox>
                          </div>
                        </v-col>
                      </v-row>
                      <v-row
                        no-gutters
                        v-if="
                          overnightParkingApprovalHoursSettings[day]
                            .startTime &&
                          overnightParkingApprovalHoursSettings[day].endTime
                        "
                      >
                        <span
                          class="mt-1 text-caption"
                          style="cursor: pointer"
                          @click="
                            openApplyTimeSlotsToSelectedDaysDialog(
                              overnightParkingApprovalHoursSettings[day]
                                .startTime,
                              overnightParkingApprovalHoursSettings[day]
                                .endTime,
                              day,
                            )
                          "
                        >
                          <v-icon size="small">mdi-content-copy</v-icon>
                          Apply to other the days
                        </span>
                      </v-row>
                    </v-col>
                    <!-- update button -->
                    <v-col cols="12" class="mt-4 text-end">
                      <v-btn
                        flat
                        rounded="lg"
                        color="#1867C0"
                        class="px-6"
                        @click="updateVisitorOvernightParkingApprovalHours"
                        :loading="isUpdatingOvernightParkingApprovalHours"
                        :disabled="
                          !(
                            (overnightParkingApprovalHoursSettings?.monday
                              .startTime &&
                              overnightParkingApprovalHoursSettings?.monday
                                .endTime) ||
                            (overnightParkingApprovalHoursSettings?.tuesday
                              .startTime &&
                              overnightParkingApprovalHoursSettings?.tuesday
                                .endTime) ||
                            (overnightParkingApprovalHoursSettings?.wednesday
                              .startTime &&
                              overnightParkingApprovalHoursSettings?.wednesday
                                .endTime) ||
                            (overnightParkingApprovalHoursSettings?.thursday
                              .startTime &&
                              overnightParkingApprovalHoursSettings?.thursday
                                .endTime) ||
                            (overnightParkingApprovalHoursSettings?.friday
                              .startTime &&
                              overnightParkingApprovalHoursSettings?.friday
                                .endTime) ||
                            (overnightParkingApprovalHoursSettings?.saturday
                              .startTime &&
                              overnightParkingApprovalHoursSettings?.saturday
                                .endTime) ||
                            (overnightParkingApprovalHoursSettings?.sunday
                              .startTime &&
                              overnightParkingApprovalHoursSettings?.sunday
                                .endTime)
                          )
                        "
                      >
                        Update
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-tabs-window-item>

          <v-tabs-window-item value="four">
            <v-col cols="12">
              <v-row no-gutters justify="center">
                <v-col cols="12" sm="4" md="4" lg="3" xl="3">
                  <v-row no-gutters>
                    <v-col cols="12" class="mt-4 font-weight-bold text-h5">
                      Feedback Interval
                    </v-col>

                    <v-col cols="12" class="text-end">
                      <v-icon
                        @click="isChecked = !isChecked"
                        :color="isChecked ? 'green' : ''"
                      >
                        {{
                          isChecked
                            ? "mdi-check-circle"
                            : "mdi-check-circle-outline"
                        }}
                      </v-icon>
                      <div @click="alertUser">
                        <v-text-field
                          class="pt-2"
                          :disabled="!isChecked"
                          label="Interval Minutes"
                          type="number"
                          @keypress="isNumber"
                          v-model="feedbackIntervalMinutes"
                        ></v-text-field>
                      </div>

                      <v-snackbar v-model="showSnackbar" color="#E0241C">
                        Please enable the checkbox first.
                      </v-snackbar>
                    </v-col>

                    <v-col cols="12" class="mt-4 text-end">
                      <v-btn
                        flat
                        rounded="lg"
                        color="#1867C0"
                        class="px-6"
                        @click="updateFeedBackIntervalNotification"
                        :loading="isUpdatingFeedBackInterval"
                      >
                        Update
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-tabs-window-item>

          <v-tabs-window-item value="five">
            <v-col cols="12">
              <SettingsVisitorTimings />
            </v-col>
          </v-tabs-window-item>

          <v-tabs-window-item value="six">
            <v-col cols="12">
              <SettingsContractorTimings />
            </v-col>
          </v-tabs-window-item>

          <v-tabs-window-item value="seven">
            <v-col cols="12">
              <SettingsVisitorContractorNotificationInterval />
            </v-col>
          </v-tabs-window-item>

          <v-tabs-window-item value="eight">
            <v-col cols="12">
              <SettingsSiteSettings />
            </v-col>
          </v-tabs-window-item>
          <v-tabs-window-item value="nine">
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="4">
                <SettingsGracePeriod />
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="4">
                <SettingsScreenshotSwitch />
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="4">
                <SettingsRecordingSwitch />
              </v-col>
            </v-row>
          </v-tabs-window-item>
          <v-tabs-window-item value="ten">
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="4">
                <SettingsHostServer />
              </v-col>
            </v-row>
          </v-tabs-window-item>
          <v-tabs-window-item value="eleven">
            <v-col cols="12">
              <SettingsAutoCheckoutTimings />
            </v-col>
          </v-tabs-window-item>
          <v-tabs-window-item value="twelve">
            <v-col cols="12"><SettingsAnprSettings /></v-col>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
    </v-col>

    <!-- <v-col cols="12" sm="4">
      <SettingsDelivery />
    </v-col>

    <v-col cols="12" sm="4">
      <SettingsTaxiHire />
    </v-col>
    <v-col cols="12" sm="4">
      <SettingsPrivateHire />
    </v-col>
    <v-col cols="12" sm="4">
      <SettingsSeasonPassType />
    </v-col> -->

    <!-- dialog -->
    <v-dialog
      v-model="applyTimeSlotsToSelectedDaysDialog"
      transition="dialog-bottom-transition"
      persistent
      location="center"
      width="60vh"
      :style="`margin-left: ${$vuetify.display.mdAndUp ? '40' : '8'}px;`"
    >
      <v-card
        :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
        :class="`${theme == 'light' && 'bg-white'} px-3 h-100`"
      >
        <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
          <span class="font-weight-bold pl-4 pt-1">
            Select the days below where you want to apply the time slot:
          </span>

          <v-spacer></v-spacer>
          <v-btn
            size="x-small"
            color="grey-darken-1"
            icon="mdi-close"
            @click="closeDialog()"
          ></v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col
                v-for="(day, i) in [
                  'monday',
                  'tuesday',
                  'wednesday',
                  'thursday',
                  'friday',
                  'saturday',
                  'sunday',
                ]"
                :key="i"
                cols="12"
                md="5"
                class="text-capitalize"
              >
                <v-checkbox
                  v-model="selectedDaysToApplyTheSelectedTimeSlot"
                  :label="day"
                  :value="day"
                  hide-details
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-col>

          <!-- submit / cancel -->
          <v-col cols="12">
            <v-row no-gutters>
              <v-btn
                flat
                color="error"
                class="font-weight-bold mr-4"
                @click="
                  applyTimeSlotsToSelectedDays(
                    selectedDaysToApplyTheSelectedTimeSlot,
                  )
                "
                :loading="isApplyingToSelectedDays"
                :disabled="!selectedDaysToApplyTheSelectedTimeSlot.length"
              >
                submit
              </v-btn>
              <v-btn
                flat
                variant="text"
                class="font-weight-bold"
                @click="closeDialog()"
              >
                close
              </v-btn>
            </v-row>
          </v-col>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const { theme, setSnackbar } = useLocal();
const {
  siteSetting,
  getSiteSettingsById,
  isSiteSettingsLoading,
  updateSiteSettingsById,
} = useSiteSettings();
const { getSitesOptionsForFiltering, mySite } = useFilter();

const {
  updateOvernightParkingApprovalHoursSettings,
  getOvernightParkingApprovalHoursSettings,
} = useVisitor();

const {
  updateFeedBackNotificationIntervalSettings,
  getFeedBackIntervalNotificationSettings,
} = useFeedback();

const overnightParkingApprovalHoursSettings = ref({
  monday: {
    isEnabled: false,
    startTime: "",
    endTime: "",
  },
  tuesday: {
    isEnabled: false,
    startTime: "",
    endTime: "",
  },
  wednesday: {
    isEnabled: false,
    startTime: "",
    endTime: "",
  },
  thursday: {
    isEnabled: false,
    startTime: "",
    endTime: "",
  },
  friday: {
    isEnabled: false,
    startTime: "",
    endTime: "",
  },
  saturday: {
    isEnabled: false,
    startTime: "",
    endTime: "",
  },
  sunday: {
    isEnabled: false,
    startTime: "",
    endTime: "",
  },
});

const delivery = ref("");
const editDelivery = ref("");
const deliveryIndex = ref(NaN);
const isEditDelivery = ref(false);
const isDeliveryLoading = ref(false);
const isChecked = ref<boolean>(false);

const pickUpDropOff = ref("");
const editPickUpDropOff = ref("");
const pickUpDropOffIndex = ref(NaN);
const isEditPickUpDropOff = ref(false);
const isPickUpDropOffLoading = ref(false);

const seasonPassType = ref("");
const editSeasonPassType = ref("");
const seasonPassIndex = ref(NaN);
const isEditSeasonPass = ref(false);
const isSeasonPassTypeLoading = ref(false);
const tab = ref("one");

const feedbackIntervalMinutes = ref<number>();
const showSnackbar = ref(false);
const isUpdatingFeedBackInterval = ref<boolean>(false);

const alertUser = () => {
  if (!isChecked.value) {
    showSnackbar.value = true;
  }
};
const isSwitchDisabled = computed(() => {
  const { api, username, password, channel } = siteSetting.value.anpr;
  return (
    api === null || username === null || password === null || channel === null
  );
});

onMounted(async () => {
  await getSitesOptionsForFiltering();
  await getSiteSettingsById(mySite.value);
});

watch(tab, async (newValue: string) => {
  if (newValue === "three") {
    isSiteSettingsLoading.value = true;
    const result = await getOvernightParkingApprovalHoursSettings(mySite.value);
    if (result) {
      for await (const day of daysList.value) {
        overnightParkingApprovalHoursSettings.value[day].isEnabled =
          result[day].isEnabled;
        overnightParkingApprovalHoursSettings.value[day].startTime =
          result[day].startTime;
      }

      for await (const day of daysList.value) {
        overnightParkingApprovalHoursSettings.value[day].endTime =
          result[day].endTime;
      }
    }
    isSiteSettingsLoading.value = false;
  } else if (newValue === "four") {
    isSiteSettingsLoading.value = true;
    const feedBackNotificationInterval =
      await getFeedBackIntervalNotificationSettings(mySite.value, "feedback");
    feedbackIntervalMinutes.value = feedBackNotificationInterval.minutes;
    isChecked.value = feedBackNotificationInterval.isEnabled;
    isSiteSettingsLoading.value = false;
  }
});

async function onSwitchChange(event: boolean) {
  if (event) {
    if (isSwitchDisabled.value) {
      siteSetting.value.anpr.isEnabled = false;
      setSnackbar({
        text: "Please setup ANPR Settings first before enabling it",
        modal: true,
        type: "error",
      });
    } else {
      siteSetting.value.anpr.isEnabled = true;
      await updateSiteSettingsById(
        siteSetting.value._id || "",
        siteSetting.value,
      );
      setSnackbar({
        text: "ANPR Enabled!",
        modal: true,
        type: "success",
      });
    }
  } else {
    siteSetting.value.anpr.isEnabled = false;
    await updateSiteSettingsById(
      siteSetting.value._id || "",
      siteSetting.value,
    );
    setSnackbar({
      text: "ANPR Disabled!",
      modal: true,
      type: "success",
    });
  }
}

async function onTransactionSwitchChange(event: boolean) {
  if (event) {
    if (isSwitchDisabled.value) {
      siteSetting.value.anpr.showUnregisteredTransactions = false;
      setSnackbar({
        text: "Please setup ANPR Settings first before enabling it",
        modal: true,
        type: "error",
      });
    } else {
      siteSetting.value.anpr.showUnregisteredTransactions = true;
      await updateSiteSettingsById(
        siteSetting.value._id || "",
        siteSetting.value,
      );
      setSnackbar({
        text: "Unregistered Transactions Tab Enabled!",
        modal: true,
        type: "success",
      });
    }
  } else {
    siteSetting.value.anpr.showUnregisteredTransactions = false;
    await updateSiteSettingsById(
      siteSetting.value._id || "",
      siteSetting.value,
    );
    setSnackbar({
      text: "Unregistered Transactions Tab Disabled!",
      modal: true,
      type: "success",
    });
  }
}

async function onUpdateSiteSettings(type?: "delivery" | "pickup" | "season") {
  try {
    if (delivery.value && type === "delivery") {
      isDeliveryLoading.value = true;
      siteSetting.value.deliveryCompanyList.splice(0, 0, delivery.value);
    } else if (pickUpDropOff.value && type === "pickup") {
      isPickUpDropOffLoading.value = true;
      siteSetting.value.pickUpdropOffCompanyList.splice(
        0,
        0,
        pickUpDropOff.value,
      );
    } else if (seasonPassType.value && type === "season") {
      isSeasonPassTypeLoading.value = true;
      siteSetting.value.seasonPassType.splice(0, 0, seasonPassType.value);
    }

    await updateSiteSettingsById(
      siteSetting.value._id || "",
      siteSetting.value,
    );
    if (delivery.value && type === "delivery") delivery.value = "";
    else if (pickUpDropOff.value && type === "pickup") pickUpDropOff.value = "";
    else if (seasonPassType.value && type === "season")
      seasonPassType.value = "";
    setSnackbar({
      text: "Site Settings updated",
      modal: true,
    });
  } catch (error: any) {
    setSnackbar({
      text: error.message,
      modal: true,
      type: "error",
    });
  } finally {
    isDeliveryLoading.value = false;
    isPickUpDropOffLoading.value = false;
    isSeasonPassTypeLoading.value = false;
  }
}

const isUpdatingOvernightParkingApprovalHours = ref(false);

const endTimeListMonday = computed(() => getEndTimeList("monday"));
const endTimeListTuesday = computed(() => getEndTimeList("tuesday"));
const endTimeListWednesday = computed(() => getEndTimeList("wednesday"));
const endTimeListThursday = computed(() => getEndTimeList("thursday"));
const endTimeListFriday = computed(() => getEndTimeList("friday"));
const endTimeListSaturday = computed(() => getEndTimeList("saturday"));
const endTimeListSunday = computed(() => getEndTimeList("sunday"));

const daysList = ref([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

daysList.value.forEach((day) => {
  watch(
    () => overnightParkingApprovalHoursSettings.value[day].startTime,
    () => {
      overnightParkingApprovalHoursSettings.value[day].endTime = "";
    },
  );
});

function getEndTimeList(day) {
  if (overnightParkingApprovalHoursSettings.value[day]) {
    const startIndex = timeList.value.indexOf(
      overnightParkingApprovalHoursSettings.value[day].startTime,
    );

    // just make it 1 when you want 30 mins interval
    return startIndex >= 0
      ? timeList.value.slice(startIndex + 2)
      : timeList.value;
  } else {
    return timeList.value;
  }
}
const timeList = computed(() => {
  let times = [];
  let hours, minutes;
  for (var i = 0; i < 1440; i += 30) {
    hours = Math.floor(i / 60);
    minutes = i % 60;
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    let s = hours + ":" + minutes;
    times.push(s);
  }
  return times;
});

function handleClick(disabled: boolean) {
  if (disabled) {
    setSnackbar({
      text: "Please enable the day first, then you can set the start and end times.",
      modal: true,
      type: "error",
    });
  }
}

const isApplyingToSelectedDays = ref(false);
const applyTimeSlotsToSelectedDaysDialog = ref<boolean>(false);
const selectedDay = ref<string>("");
const selectedStartTime = ref<string>("");
const selectedEndTime = ref<string>("");
const selectedDaysToApplyTheSelectedTimeSlot = ref<string[]>([]);

function openApplyTimeSlotsToSelectedDaysDialog(
  startTime: string,
  endTime: string,
  Day: string,
) {
  selectedDay.value = Day;
  selectedStartTime.value = startTime;
  selectedEndTime.value = endTime;
  applyTimeSlotsToSelectedDaysDialog.value = true;
  selectedDaysToApplyTheSelectedTimeSlot.value.push(Day);
}

async function applyTimeSlotsToSelectedDays(Days: string[]) {
  for await (const day of Days) {
    overnightParkingApprovalHoursSettings.value[day].isEnabled = true;
    overnightParkingApprovalHoursSettings.value[day].startTime =
      selectedStartTime.value;
  }

  for await (const day of Days) {
    overnightParkingApprovalHoursSettings.value[day].endTime =
      selectedEndTime.value;
  }
  closeDialog();
}

function closeDialog() {
  applyTimeSlotsToSelectedDaysDialog.value = false;
  selectedDay.value = "";
  selectedStartTime.value = "";
  selectedEndTime.value = "";
}

async function updateVisitorOvernightParkingApprovalHours() {
  isUpdatingOvernightParkingApprovalHours.value = true;
  try {
    console.log(
      "visitor",
      overnightParkingApprovalHoursSettings.value.monday,
      overnightParkingApprovalHoursSettings.value.tuesday,
      overnightParkingApprovalHoursSettings.value.wednesday,
      overnightParkingApprovalHoursSettings.value.thursday,
      overnightParkingApprovalHoursSettings.value.friday,
      overnightParkingApprovalHoursSettings.value.saturday,
      overnightParkingApprovalHoursSettings.value.sunday,
    );

    await updateOvernightParkingApprovalHoursSettings({
      site: mySite.value,
      monday: overnightParkingApprovalHoursSettings.value.monday,
      tuesday: overnightParkingApprovalHoursSettings.value.tuesday,
      wednesday: overnightParkingApprovalHoursSettings.value.wednesday,
      thursday: overnightParkingApprovalHoursSettings.value.thursday,
      friday: overnightParkingApprovalHoursSettings.value.friday,
      saturday: overnightParkingApprovalHoursSettings.value.saturday,
      sunday: overnightParkingApprovalHoursSettings.value.sunday,
    });

    setSnackbar({
      text: "Overnight Parking Approval Hours successfully updated!",
      modal: true,
    });
  } catch (error: any) {
    setSnackbar({
      text: error.message,
      modal: true,
      type: "error",
    });
  }
  isUpdatingOvernightParkingApprovalHours.value = false;
}

//updating the interval
async function updateFeedBackIntervalNotification() {
  isUpdatingFeedBackInterval.value = true;

  try {
    await updateFeedBackNotificationIntervalSettings({
      site: mySite.value,
      module: "feedback",
      minutes: parseInt(feedbackIntervalMinutes.value),
      isEnabled: isChecked.value,
    });

    setSnackbar({
      text: "Notification interval for feedbacks has been successfully updated!",
      modal: true,
    });
  } catch (error: any) {
    console.log("error", error);

    setSnackbar({
      text: error.message,
      modal: true,
      type: "error",
    });
  }
  isUpdatingFeedBackInterval.value = false;
}

async function onDeleteSiteSetting(
  idx: number,
  type: "delivery" | "pickup" | "season",
) {
  try {
    if (type === "delivery") {
      isDeliveryLoading.value = true;
      siteSetting.value.deliveryCompanyList?.splice(idx, 1);
      deliveryIndex.value = -1;
    } else if (pickUpDropOff.value && type === "pickup") {
      isPickUpDropOffLoading.value = true;
      siteSetting.value.pickUpdropOffCompanyList?.splice(idx, 1);
      pickUpDropOffIndex.value = -1;
    } else if (seasonPassType.value && type === "season") {
      isSeasonPassTypeLoading.value = true;
      siteSetting.value.seasonPassType?.splice(idx, 1);
      seasonPassIndex.value = -1;
    }
    await updateSiteSettingsById(
      siteSetting.value._id || "",
      siteSetting.value,
    );
    setSnackbar({
      text: "Successfully Deleted!",
      modal: true,
    });
  } catch (error: any) {
    setSnackbar({
      text: error.message,
      modal: true,
      type: "error",
    });
  } finally {
    isDeliveryLoading.value = false;
    isPickUpDropOffLoading.value = false;
    isSeasonPassTypeLoading.value = false;
  }
}

async function onSelectPickupDropOffToBeUpdate(
  value: string,
  idx: number,
  type: "delivery" | "pickup" | "season",
  action: string,
) {
  if (value && type === "delivery") {
    const result = siteSetting.value.deliveryCompanyList?.find(
      (v: string) => v === value,
    );

    action == "edit"
      ? (editDelivery.value = result || "")
      : (delivery.value = result || "");

    deliveryIndex.value = idx;
    isEditDelivery.value = true;
  } else if (value && type === "pickup") {
    const result = siteSetting.value.pickUpdropOffCompanyList?.find(
      (v: string) => v === value,
    );
    pickUpDropOff.value = result || "";

    action == "edit"
      ? (editPickUpDropOff.value = result || "")
      : (pickUpDropOff.value = result || "");

    pickUpDropOffIndex.value = idx;
    isEditPickUpDropOff.value = true;
  } else if (value && type === "season") {
    const result = siteSetting.value.seasonPassType?.find(
      (v: string) => v === value,
    );

    action == "edit"
      ? (editSeasonPassType.value = result || "")
      : (seasonPassType.value = result || "");

    seasonPassIndex.value = idx;
    isEditSeasonPass.value = true;
  }
}

async function onUpdatePickUpDropOff(
  type: "delivery" | "pickup" | "season",
  action: string,
) {
  try {
    if (type === "delivery") {
      isDeliveryLoading.value = true;
      action == "edit"
        ? (siteSetting.value.deliveryCompanyList![deliveryIndex.value] =
            editDelivery.value)
        : siteSetting.value.deliveryCompanyList.splice(0, 0, delivery.value);
    } else if (type === "pickup") {
      isPickUpDropOffLoading.value = true;
      action == "edit"
        ? (siteSetting.value.pickUpdropOffCompanyList![
            pickUpDropOffIndex.value
          ] = editPickUpDropOff.value)
        : siteSetting.value.pickUpdropOffCompanyList.splice(
            0,
            0,
            pickUpDropOff.value,
          );
    } else if (type === "season") {
      isSeasonPassTypeLoading.value = true;

      action == "edit"
        ? (siteSetting.value.seasonPassType![seasonPassIndex.value] =
            editSeasonPassType.value)
        : siteSetting.value.seasonPassType.splice(0, 0, seasonPassType.value);
    }

    console.log(
      "API: ",
      deliveryIndex.value,
      JSON.stringify(siteSetting.value.deliveryCompanyList),
    );
    await updateSiteSettingsById(
      siteSetting.value._id || "",
      siteSetting.value,
    );
    if ((editDelivery.value || delivery.value) && type === "delivery") {
      action == "edit" ? (editDelivery.value = "") : (delivery.value = "");
      isEditDelivery.value = false;
    } else if (
      (editPickUpDropOff.value || pickUpDropOff.value) &&
      type === "pickup"
    ) {
      action == "edit"
        ? (editPickUpDropOff.value = "")
        : (pickUpDropOff.value = "");
      isEditPickUpDropOff.value = false;
    } else if (
      (editSeasonPassType.value || seasonPassType.value) &&
      type === "season"
    ) {
      action == "edit"
        ? (editSeasonPassType.value = "")
        : (seasonPassType.value = "");
      isEditSeasonPass.value = false;
    }
    setSnackbar({
      text: "Successfully Updated!",
      modal: true,
    });
  } catch (error: any) {
    setSnackbar({
      text: error.message,
      modal: true,
      type: "error",
    });
  } finally {
    isDeliveryLoading.value = false;
    isPickUpDropOffLoading.value = false;
    isSeasonPassTypeLoading.value = false;
  }
}

function resetValues(type: "delivery" | "pickup" | "season") {
  if (type === "delivery") {
    isEditDelivery.value = false;
    deliveryIndex.value = -1;
  } else if (type === "pickup") {
    isEditPickUpDropOff.value = false;
    pickUpDropOffIndex.value = -1;
  } else if (type === "season") {
    isEditSeasonPass.value = false;
    seasonPassIndex.value = -1;
  }
}

const isNumber = (evt) => {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    evt.preventDefault();
  } else {
    return true;
  }
};
</script>
<style scoped lang="scss">
:deep() .v-switch .v-label {
  font-size: 12px;
}
$tab-slider-size: 16px;
</style>
