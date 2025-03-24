<template>
  <v-row no-gutters justify="center">
    <v-col cols="12" sm="4" md="4" lg="3" xl="3">
      <v-row no-gutters>
        <v-col cols="12" class="mt-4 font-weight-bold text-h5">
          Contractor Alloted Time
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

            <v-col cols="6" class="text-end">
              <v-icon
                @click="
                  contractorAllotedTime[day].isEnabled =
                    !contractorAllotedTime[day].isEnabled
                "
                :color="contractorAllotedTime[day].isEnabled ? 'green' : ''"
              >
                {{
                  contractorAllotedTime[day].isEnabled
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
              <div @click="handleClick(!contractorAllotedTime[day].isEnabled)">
                <v-combobox
                  :items="timeList"
                  v-model="contractorAllotedTime[day].startTime"
                  :disabled="!contractorAllotedTime[day].isEnabled"
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
              <div @click="handleClick(!contractorAllotedTime[day].isEnabled)">
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
                  v-model="contractorAllotedTime[day].endTime"
                  :disabled="!contractorAllotedTime[day].isEnabled"
                  hide-details
                ></v-combobox>
              </div>
            </v-col>
          </v-row>
          <v-row
            no-gutters
            v-if="
              contractorAllotedTime[day].startTime &&
              contractorAllotedTime[day].endTime
            "
          >
            <span
              class="mt-1 text-caption"
              style="cursor: pointer"
              @click="
                openApplyTimeSlotsToSelectedDaysDialog(
                  contractorAllotedTime[day].startTime,
                  contractorAllotedTime[day].endTime,
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
            @click="updateContractorAllotedTime"
            :loading="isUpdatingContractorAllotedTime"
            :disabled="
              !(
                (contractorAllotedTime?.monday.startTime &&
                  contractorAllotedTime?.monday.endTime) ||
                (contractorAllotedTime?.tuesday.startTime &&
                  contractorAllotedTime?.tuesday.endTime) ||
                (contractorAllotedTime?.wednesday.startTime &&
                  contractorAllotedTime?.wednesday.endTime) ||
                (contractorAllotedTime?.thursday.startTime &&
                  contractorAllotedTime?.thursday.endTime) ||
                (contractorAllotedTime?.friday.startTime &&
                  contractorAllotedTime?.friday.endTime) ||
                (contractorAllotedTime?.saturday.startTime &&
                  contractorAllotedTime?.saturday.endTime) ||
                (contractorAllotedTime?.sunday.startTime &&
                  contractorAllotedTime?.sunday.endTime)
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

const contractorAllotedTime = ref({
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

onMounted(async () => {
  await getSiteSettingsById(mySite.value);
  if (siteSetting.value.contractorAllotedTime)
    contractorAllotedTime.value = siteSetting.value.contractorAllotedTime;
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
  if (contractorAllotedTime.value[day]) {
    const startIndex = timeList.value.indexOf(
      contractorAllotedTime.value[day].startTime,
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
    contractorAllotedTime.value[day].isEnabled = true;
    contractorAllotedTime.value[day].startTime = selectedStartTime.value;
  }

  for await (const day of Days) {
    contractorAllotedTime.value[day].endTime = selectedEndTime.value;
  }
  closeDialog();
}

function closeDialog() {
  applyTimeSlotsToSelectedDaysDialog.value = false;
  selectedDay.value = "";
  selectedStartTime.value = "";
  selectedEndTime.value = "";
}

async function updateContractorAllotedTime() {
  isUpdatingContractorAllotedTime.value = true;
  try {
    console.log(
      "visitor",
      contractorAllotedTime.value.monday,
      contractorAllotedTime.value.tuesday,
      contractorAllotedTime.value.wednesday,
      contractorAllotedTime.value.thursday,
      contractorAllotedTime.value.friday,
      contractorAllotedTime.value.saturday,
      contractorAllotedTime.value.sunday,
    );

    await updateSiteSettingsById(mySite.value, {
      ...siteSetting.value,
      contractorAllotedTime: contractorAllotedTime.value,
    });

    setSnackbar({
      text: "Contractor Alloted Time successfully updated!",
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
