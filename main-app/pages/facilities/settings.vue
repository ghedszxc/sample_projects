<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card width="100%" elevation="3" height="100%">
        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters class="pa-4">
              <!-- header -->
              <v-col cols="12">
                <v-row align="center">
                  <v-col cols="12" class="d-flex items-center ga-4">
                    <v-btn
                      fav
                      density="compact"
                      icon="mdi-arrow-left"
                      variant="text"
                      @click="useRouter().push('/facilities')"
                    />
                    <span class="font-weight-bold text-h6 mr-3">
                      Facility Settings
                    </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row no-gutters justify="center">
                  <v-col cols="12" md="6">
                    <v-row no-gutters>
                      <!-- advance booking configuration -->
                      <v-col cols="12" class="text-h6 mt-10 border-b">
                        Advance booking configuration
                      </v-col>
                      <v-col cols="12" class="mt-6">
                        <v-row no-gutters align="center" justify="center">
                          <v-col cols="9" class="pr-10 text-body-2">
                            <p>
                              Set specific number of days for advance booking
                            </p>
                          </v-col>
                          <v-col cols="3" class="text-end">
                            <v-row no-gutters>
                              <v-text-field
                                v-model="setting.advanceBookingDays"
                                label="Days"
                                type="number"
                                hide-details
                                :rules="[
                                  (v) =>
                                    !v ||
                                    v <= 365 ||
                                    'Input must be 365 or less',
                                ]"
                                @keypress="onlyPositiveNumber($event)"
                              ></v-text-field>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                      <!-- booking hours -->
                      <!-- <v-col
                        cols="12"
                        class="mt-15"
                        style="
                          color: #052439;
                          font-size: 20px;
                          font-style: normal;
                          font-weight: 500;
                          line-height: 32px;
                        "
                      >
                        Booking hours
                      </v-col>
                      <v-col cols="12" class="mt-6">
                        <v-row no-gutters align="center" justify="center">
                          <v-col md="6" lg="7" cols="12">
                            Set specific booking hours
                          </v-col>
                          <v-col md="6" lg="3" cols="12">
                            <v-row no-gutters align="center">
                              <v-combobox
                                placeholder="Select time"
                                :items="timeList"
                                hide-details
                                v-model="setting.bookingHours"
                              ></v-combobox>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col> -->
                      <!-- others -->
                      <v-col cols="12" class="mt-4 text-h6 pb-0 border-b">
                        Others
                      </v-col>

                      <v-col cols="12" class="mt-2">
                        <v-row no-gutters>
                          <v-col
                            cols="9"
                            class="d-flex align-center justify-start text-body-2"
                          >
                            Pax
                          </v-col>
                          <v-col
                            cols="3"
                            class="d-flex align-center justify-end"
                          >
                            <v-switch
                              class="d-flex align-center"
                              color="primary"
                              v-model="setting.pax"
                            ></v-switch>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col cols="12" class="mt-2">
                        <v-row no-gutters>
                          <v-col
                            cols="9"
                            class="d-flex align-center justify-start text-body-2"
                          >
                            Only one booking pending per facility slot
                          </v-col>
                          <v-col
                            cols="3"
                            class="d-flex align-center justify-end"
                          >
                            <v-switch
                              class="d-flex align-center"
                              color="primary"
                              v-model="setting.onePending"
                            ></v-switch>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col cols="12">
                        <v-divider class="my-4"></v-divider>
                        <h3 class="titleDesign mt-4">
                          Facility Approval Hours
                        </h3>
                        <v-card class="ma-2">
                          <v-col
                            cols="12"
                            v-for="(day, index) in daysList"
                            :key="index"
                          >
                            <v-row no-gutters>
                              <v-col cols="6" class="text-capitalize">
                                {{ day }}
                              </v-col>
                              <v-col cols="6" class="text-end">
                                <v-icon
                                  @click="
                                    setting[day].isEnabled =
                                      !setting[day].isEnabled
                                  "
                                  :color="setting[day].isEnabled ? 'green' : ''"
                                >
                                  {{
                                    setting[day].isEnabled
                                      ? "mdi-check-circle"
                                      : "mdi-check-circle-outline"
                                  }}
                                </v-icon>
                              </v-col>
                            </v-row>

                            <v-row no-gutters>
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
                                <span class="text-combobox">Start</span>
                                <div
                                  @click="handleClick(!setting[day].isEnabled)"
                                >
                                  <v-combobox
                                    :items="timeList"
                                    v-model="setting[day].startTime"
                                    :disabled="!setting[day].isEnabled"
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
                                <span class="text-combobox">End</span>
                                <div
                                  @click="handleClick(!setting[day].isEnabled)"
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
                                    v-model="setting[day].endTime"
                                    :disabled="!setting[day].isEnabled"
                                    hide-details
                                  ></v-combobox>
                                </div>
                              </v-col>
                            </v-row>
                            <v-row
                              no-gutters
                              v-if="
                                setting[day].startTime && setting[day].endTime
                              "
                            >
                              <span
                                class="mt-1 text-caption"
                                style="cursor: pointer"
                                @click="
                                  openApplyTimeSlotsToSelectedDaysDialog(
                                    setting[day].startTime,
                                    setting[day].endTime,
                                    day,
                                  )
                                "
                              >
                                <v-icon size="small">mdi-content-copy</v-icon>
                                Apply to other days
                              </span>
                            </v-row>
                          </v-col>
                        </v-card>
                      </v-col>

                      <v-col cols="12" class="mt-6 my-4">
                        <v-row no-gutters justify="end">
                          <v-btn
                            :block="!$vuetify.display.smAndUp"
                            color="primary"
                            @click="saveSettings"
                            :disabled="
                              !$ability.can('update', 'update-facility')
                            "
                            ><v-icon class="mr-2">mdi-cog</v-icon>Save
                            Settings</v-btn
                          >
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

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
                :loading="isApplyingSelectedTimeSlotToSelectedDays"
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

const { $ability } = useNuxtApp();

const { setFacilitySettings, getFacilitiesSetting } = useFacility();
const { theme, setSnackbar } = useLocal();
const { currentUser } = useLocalAuth();

const isApplyingSelectedTimeSlotToSelectedDays = ref<boolean>(false);

const setting = ref({
  advanceBookingDays: 30,
  bookingHours: "08:00",
  pax: false,
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
  onePending: false,
});
const applyTimeSlotsToSelectedDaysDialog = ref<boolean>(false);
const selectedDay = ref<string>("");
const selectedStartTime = ref<string>("");
const selectedEndTime = ref<string>("");
const selectedDaysToApplyTheSelectedTimeSlot = ref<string[]>([]);

const daysList = ref([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

const endTimeListMonday = computed(() => getEndTimeList("monday"));
const endTimeListTuesday = computed(() => getEndTimeList("tuesday"));
const endTimeListWednesday = computed(() => getEndTimeList("wednesday"));
const endTimeListThursday = computed(() => getEndTimeList("thursday"));
const endTimeListFriday = computed(() => getEndTimeList("friday"));
const endTimeListSaturday = computed(() => getEndTimeList("saturday"));
const endTimeListSunday = computed(() => getEndTimeList("sunday"));

function getEndTimeList(day: any) {
  if (setting.value[day]) {
    const startIndex = timeList.value.indexOf(setting.value[day].startTime);

    // just make it 1 when you want 30 mins interval
    return startIndex >= 0
      ? timeList.value.slice(startIndex + 2)
      : timeList.value;
  } else {
    return timeList.value;
  }
}

function handleClick(disabled: boolean) {
  if (disabled) {
    setSnackbar({
      text: "Please enable the day first, then you can set the start and end times",
      modal: true,
      type: "error",
    });
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
    setting.value[day].isEnabled = true;
    setting.value[day].startTime = selectedStartTime.value;
  }

  for await (const day of Days) {
    setting.value[day].endTime = selectedEndTime.value;
  }
  closeDialog();
}

function closeDialog() {
  applyTimeSlotsToSelectedDaysDialog.value = false;
  selectedDay.value = "";
  selectedStartTime.value = "";
  selectedEndTime.value = "";
}
// added facility setting end

onMounted(async () => {
  const settings = await getFacilitiesSetting({ site: currentUser.value.site });

  if (settings?._id) {
    setting.value = settings;
  }
});

watch(
  () => setting.advanceBookingDays,
  (newVal) => {
    if (newVal > 365) {
      setting.advanceBookingDays = 365;
    }
  },
);

const onlyPositiveNumber = ($event) => {
  let keyCode = $event.keyCode ? $event.keyCode : $event.which;
  let value = $event.target.value;

  // Allow digits from 1 to 9 for the first character
  if (value.length === 0 && (keyCode < 49 || keyCode > 57)) {
    $event.preventDefault();
  }
  // Allow digits from 0 to 9 for the rest
  else if (value.length > 0 && (keyCode < 48 || keyCode > 57)) {
    $event.preventDefault();
  }
};

async function saveSettings() {
  const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
    setting.value;

  try {
    await setFacilitySettings({
      advanceBookingDays: setting.value.advanceBookingDays,
      bookingHours: setting.value.bookingHours,
      pax: setting.value.pax,
      site: currentUser.value.site,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      onePending: setting.value.onePending || false,
    });

    setSnackbar({
      text: "Facility successfully added!",

      modal: true,
      type: "success",
    });
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}
</script>
