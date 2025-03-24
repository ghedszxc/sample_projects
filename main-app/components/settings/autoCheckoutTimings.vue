<template>
  <v-row no-gutters justify="center">
    <v-col cols="12" sm="4" md="4" lg="3" xl="3">
      <v-row no-gutters>
        <v-col cols="12" class="mt-4 font-weight-bold text-h5">
          Auto Checkout Visitor Timings
        </v-col>
        <!-- day and time-->
        <v-col
          cols="12"
          class="mt-4"
          v-for="(day, index) in daysList"
          :key="index"
        >
          <v-row no-gutters>
            <v-col cols="6" class="text-capitalize font-weight-bold">
              {{ day }}
            </v-col>

            <v-col cols="1" class="text-end">
              <v-icon
                @click="
                  autoCheckoutTimingsRef[day].isEnabled =
                    !autoCheckoutTimingsRef[day].isEnabled
                "
                :color="autoCheckoutTimingsRef[day].isEnabled ? 'green' : ''"
              >
                {{
                  autoCheckoutTimingsRef[day].isEnabled
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
              End
              <div @click="handleClick(!autoCheckoutTimingsRef[day].isEnabled)">
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
                  v-model="autoCheckoutTimingsRef[day].endTime"
                  :disabled="!autoCheckoutTimingsRef[day].isEnabled"
                  hide-details
                ></v-combobox>
              </div>
            </v-col>
          </v-row>
          <v-row no-gutters v-if="autoCheckoutTimingsRef[day].endTime">
            <span
              class="mt-1 text-caption"
              style="cursor: pointer"
              @click="
                openApplyTimeSlotsToSelectedDaysDialog(
                  autoCheckoutTimingsRef[day].endTime,
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
        <v-col cols="8" class="mt-4 text-end">
          <v-btn
            flat
            rounded="lg"
            color="#1867C0"
            class="px-6"
            @click="updateContractorAllotedTime"
            :loading="isUpdatingContractorAllotedTime"
            :disabled="
              !(
                autoCheckoutTimingsRef?.monday.endTime ||
                autoCheckoutTimingsRef?.tuesday.endTime ||
                autoCheckoutTimingsRef?.wednesday.endTime ||
                autoCheckoutTimingsRef?.thursday.endTime ||
                autoCheckoutTimingsRef?.friday.endTime ||
                autoCheckoutTimingsRef?.saturday.endTime ||
                autoCheckoutTimingsRef?.sunday.endTime
              )
            "
          >
            Update
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>

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
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const { theme, setSnackbar } = useLocal();
const { siteSetting, getSiteSettingsById, updateSiteSettingsById } =
  useSiteSettings();
const { getSitesOptionsForFiltering, mySite } = useFilter();

const autoCheckoutTimingsRef = ref({
  monday: {
    isEnabled: false,
    endTime: "",
  },
  tuesday: {
    isEnabled: false,
    endTime: "",
  },
  wednesday: {
    isEnabled: false,
    endTime: "",
  },
  thursday: {
    isEnabled: false,
    endTime: "",
  },
  friday: {
    isEnabled: false,
    endTime: "",
  },
  saturday: {
    isEnabled: false,
    endTime: "",
  },
  sunday: {
    isEnabled: false,
    endTime: "",
  },
});

onMounted(async () => {
  if (siteSetting.value.autoCheckoutTimings)
    autoCheckoutTimingsRef.value = siteSetting.value.autoCheckoutTimings;
});

const isUpdatingContractorAllotedTime = ref(false);

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

// daysList.value.forEach((day) => {
//   watch(
//     () => contractorAllotedTime.value[day].startTime,
//     () => {
//       contractorAllotedTime.value[day].endTime = "";
//     },
//   );
// });

function getEndTimeList(day) {
  if (autoCheckoutTimingsRef.value[day]) {
    const startIndex = timeList.value.indexOf(
      autoCheckoutTimingsRef.value[day].startTime,
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

function openApplyTimeSlotsToSelectedDaysDialog(endTime: string, Day: string) {
  selectedDay.value = Day;
  selectedEndTime.value = endTime;
  applyTimeSlotsToSelectedDaysDialog.value = true;
  selectedDaysToApplyTheSelectedTimeSlot.value.push(Day);
}

async function applyTimeSlotsToSelectedDays(Days: string[]) {
  for await (const day of Days) {
    autoCheckoutTimingsRef.value[day].endTime = selectedEndTime.value;
  }
  closeDialog();
}

function closeDialog() {
  applyTimeSlotsToSelectedDaysDialog.value = false;
  selectedDay.value = "";
  selectedEndTime.value = "";
}

async function updateContractorAllotedTime() {
  isUpdatingContractorAllotedTime.value = true;
  try {
    console.log(
      "visitor",
      autoCheckoutTimingsRef.value.monday,
      autoCheckoutTimingsRef.value.tuesday,
      autoCheckoutTimingsRef.value.wednesday,
      autoCheckoutTimingsRef.value.thursday,
      autoCheckoutTimingsRef.value.friday,
      autoCheckoutTimingsRef.value.saturday,
      autoCheckoutTimingsRef.value.sunday,
    );

    await updateSiteSettingsById(mySite.value, {
      ...siteSetting.value,
      autoCheckoutTimings: autoCheckoutTimingsRef.value,
    });

    setSnackbar({
      text: "Auto Checkout Visitor Timings successfully updated!",
      modal: true,
    });
  } catch (error: any) {
    setSnackbar({
      text: error.message,
      modal: true,
      type: "error",
    });
  }
  isUpdatingContractorAllotedTime.value = false;
}
</script>
<style scoped lang="scss">
:deep() .v-switch .v-label {
  font-size: 12px;
}
$tab-slider-size: 16px;
</style>
