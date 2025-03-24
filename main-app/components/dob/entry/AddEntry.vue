<template>
  <v-form
    class="w-100 h-50"
    v-model="isOccurrenceEntryValid"
    @submit.prevent="submit()"
    :disabled="!showButtonIfAllowed && !isEdit"
  >
    <v-col v-if="serialNumber && !isEdit" cols="12" style="margin-top: -10px">
      <v-text-field
        :model-value="serialNumber"
        density="comfortable"
        hint=""
        label="ID"
        placeholder="Enter version"
        :persistent-hint="false"
        readonly
      ></v-text-field>
    </v-col>

    <v-col v-else cols="12" style="margin-top: -10px">
      <v-text-field
        :model-value="`${occurrenceEntry.serialNumber || ''} ${occurrenceEntry.version || ''}`"
        density="comfortable"
        hint=""
        label="ID"
        placeholder="Enter version"
        :persistent-hint="false"
        :loading="isFormLoading"
        readonly
      ></v-text-field>
    </v-col>

    <!-- Form select field Subject -->
    <v-col cols="12" class="mx-0" style="margin-top: -25px">
      <v-select
        v-if="logSubjects.length > 0"
        v-model="occurrenceEntry.subject"
        label="Subject"
        hint=""
        :disabled="
          typeof occurrenceEntry.subject === 'object' &&
          Object.keys(occurrenceEntry.subject).length > 0
        "
        :rules="[requiredInput]"
        :items="logSubjects"
        item-title="subject"
        item-value="_id"
      ></v-select>
    </v-col>

    <!-- Form row field date and time -->
    <v-row no-gutters class="mb-2 mx-3 mx-md-0 mb-5" style="margin-top: -20px">
      <v-col
        cols="12"
        md="12"
        sm="6"
        lg="6"
        class="pl-0 pr-0 mb-4 mb-sm-0 mb-md-2"
      >
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="dateSelectedForm"
              v-bind="props"
              disabled
              hide-details
              density="compact"
              clearable
              class="custom-disabled-text-field px-md-3 pr-sm-2"
            >
              <template #prepend-inner>
                <v-icon class="cursor-pointer"
                  >mdi-calendar-month-outline</v-icon
                >
              </template>
            </v-text-field>
          </template>
          <v-date-picker
            v-model:model-value="selectDateForm"
            @update:model-value="onSelectDate(selectDateForm)"
          >
            <template v-slot:header="{}"></template>
          </v-date-picker>
        </v-menu>
      </v-col>

      <v-col
        cols="12"
        md="12"
        sm="6"
        lg="6"
        class="pr-0 pl-0 mb-2 mb-md-0 mt-2 mt-sm-0"
      >
        <v-text-field
          v-model="timeSelected"
          :active="menuDobTime"
          :focus="menuDobTime"
          label="DOB Time (HH:mm)"
          append-inner-icon="mdi-clock-outline"
          :rules="[timeFormatRule]"
          @keypress="validateMilitaryTime"
          class="w-100 px-md-3"
          :disabled="!showButtonIfAllowed && !isEdit"
          @click="() => (menuDobTime = true)"
        >
          <v-menu
            v-model="menuDobTime"
            :close-on-content-click="false"
            activator="parent"
            transition="scale-transition"
          >
            <v-time-picker
              v-if="menuDobTime"
              v-model="timeSelected"
              :hour-range="allowedHours"
              :minute-range="_allowMinutes"
              full-width
              format="24hr"
              :max="maxTime"
              close-on-complete
              @close="validateTime"
            ></v-time-picker>
          </v-menu>
        </v-text-field>
      </v-col>
    </v-row>

    <!-- <v-toolbar color="white" class="pr-3">
      <span class="ml-3 text-h5 font-weight-bold">Attach Incident Report</span>
    </v-toolbar>

    <v-col cols="12">
      <v-btn
        class="py-4 w-100 rounded-lg border"
        height="52px"
        variant="flat"
        @click="isIncidentList = true"
        :disabled="!showButtonIfAllowed && !isEdit"
      >
        <div class="d-flex justify-between align-center sign-container">
          <span class="sign-text">Attach Incident</span> : {{ attachBy }}
          <v-icon class="sign-icon">mdi-chevron-right</v-icon>
        </div>
      </v-btn>
    </v-col> -->

    <v-toolbar class="pr-3">
      <span class="ml-3 text-h5">Summary</span>
    </v-toolbar>

    <!-- Form field summary -->
    <v-col cols="12">
      <v-textarea
        v-model="occurrenceEntry.occurrence"
        hide-details="auto"
        rows="15"
        :rules="[requiredInput]"
        hint=""
        placeholder="Summary"
        label="Description"
      ></v-textarea>
    </v-col>

    <!-- Form Button sign -->
    <!-- <v-col cols="12">
      <v-btn class="py-4 w-100 rounded-lg border" height="52px" variant="flat">
        <div class="d-flex justify-between align-center sign-container">
          <span class="sign-text">Sign</span> : {{ signedBy }}
          <v-icon class="sign-icon">mdi-pencil-outline</v-icon>
        </div>
      </v-btn>
    </v-col> -->

    <!-- Form Button submit -->
    <v-col cols="12">
      <v-row no-gutters justify="center">
        <v-col :cols="isEdit ? 6 : 12">
          <v-btn
            v-if="showButtonIfAllowed || isEdit"
            color="#1867C0"
            type="submit"
            class="py-4 w-100 rounded-lg"
            height="52px"
            :disabled="btnvalidate"
            :loading="isBtnLoading"
          >
            Submit
          </v-btn>
        </v-col>

        <template v-if="isEdit">
          <v-col :cols="isEdit ? 6 : 12" class="pl-3">
            <v-btn
              color="#ff5252"
              class="py-4 w-100 rounded-lg"
              height="52px"
              @click="cancelVersion()"
            >
              Cancel
            </v-btn>
          </v-col>
        </template>
      </v-row>
    </v-col>

    <DobEntryConfirmPassword
      ref="confirmPass"
      @sign-dob="confirmSign($event)"
      :isConfirmTitle="`Confirm your digital signature with password`"
    />
  </v-form>
</template>

<script setup lang="ts">
const props = defineProps({
  logSubjects: {
    type: Object,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  serialNumber: {
    type: String,
  },
  today: {
    type: Boolean,
  },
  showButtonIfAllowed: {
    type: Boolean,
    default: true,
  },
});
const confirmPass = ref("");
const { logSubject, logSubjects } = useLogSubject();
const { validateMilitaryTime, timeFormatRule } = useUtils();
const {
  formatDateAndTime,
  formatDate,
  formatTime,
  standardFormatTime,
  formatDateMDY,
  requiredInput,
} = useUtils();
const { occurrence } = useOccurrence();
const {
  occurrenceEntry,
  isOccurrenceEntryValid,
  timeSelected,
  selectDateForm,
  isConfirmModal,
  isBtnLoading,
  isSigned,
  signedBy,
  isFormLoading,
  attachBy,
} = useOccurrenceEntry();
const { currentUser } = useLocalAuth();
const signed = ref(false);
const menuDobTime = ref(false);
const _timeValidation = ref(true);
const _allowMinutes = ref<number[]>([]);
onUnmounted(() => {
  attachBy.value = "";
  timeSelected.value = "";
  clearInterval(interval);
});
const { setSnackbar } = useLocal();
const currentTime = ref(new Date());

const maxTime = computed(() => {
  const hours = currentTime.value.getHours();
  const minutes = currentTime.value.getMinutes();
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
});

const interval = setInterval(() => {
  currentTime.value = new Date();
}, 60000);

const dateSelectedForm = ref(
  new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date()),
);

const emit = defineEmits(["addData", "cancel"]);

async function submit() {
  isConfirmModal.value = true;
}

const allowedHours = computed(() => {
  if (!props.today) {
    return Array.from({ length: 23 + 1 }, (_, index) => index);
  }

  const currentHour = new Date().getHours();
  return Array.from({ length: currentHour + 1 }, (_, index) => index);
});

const allowedMinutes = computed(() => {
  if (!props.today) {
    _allowMinutes.value = Array.from({ length: 59 + 1 }, (_, index) => index);
  }

  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  if (parseInt(timeSelected.value?.split(":")[0]) === currentHour) {
    _allowMinutes.value = Array.from(
      { length: currentMinute + 1 },
      (_, index) => index,
    );
  } else {
    _allowMinutes.value = Array.from(
      { length: currentMinute },
      (_, index) => index,
    );
  }
});

watch(timeSelected, (newValue) => {
  if (!newValue) {
    timeSelected.value = "";
    return;
  }
  if (timeSelected.value && timeSelected.value.includes("mm")) {
    const hours = timeSelected.value.substring(0, 2);
    const currentHour = new Date().getHours();

    if (currentHour != parseInt(hours)) {
      _allowMinutes.value = Array.from({ length: 59 + 1 }, (_, index) => index);
    } else {
      const currentHour = new Date().getHours();
      const currentMinute = new Date().getMinutes();
      if (parseInt(timeSelected.value?.split(":")[0]) === currentHour) {
        _allowMinutes.value = Array.from(
          { length: currentMinute + 1 },
          (_, index) => index,
        );
      } else {
        _allowMinutes.value = Array.from(
          { length: currentMinute },
          (_, index) => index,
        );
      }
    }
  }
});
watch(occurrence, (newValue) => {
  const selectedDate = new Date(newValue.date);
  const formattedDate = new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(selectedDate);
});

const cancelVersion = () => {
  emit("cancel");
};

const confirmSign = (data: any) => {
  occurrenceEntry.value.signature = data._id;
  if (
    formatDate(occurrenceEntry.value.date) == formatDate(new Date()) &&
    timeSelected.value == ""
  ) {
    let _date = new Date();
    _date.setHours(_date.getHours() + 8);
    occurrenceEntry.value.date = formatDateAndTime(_date);
  } else {
    let _time = timeSelected.value;
    if (timeSelected.value == "") {
      _time = standardFormatTime(new Date());
    }

    let _date = new Date();
    if (timeSelected.value && timeSelected.value.includes("mm")) {
      const updatedTime = timeSelected.value.replace("mm", "00");
      _date = new Date(
        `${formatDateMDY(occurrenceEntry.value.date)} ${updatedTime}`,
      );
    } else {
      occurrenceEntry.value.date = new Date();
      _date = new Date(`${formatDateMDY(occurrenceEntry.value.date)} ${_time}`);
    }
    _date.setHours(_date.getHours() + 8);
    occurrenceEntry.value.date = formatDateAndTime(_date);
  }
  isConfirmModal.value = false;
  signedBy.value = `${data.givenName} ${data.surname}`;
  attachBy.value = "";
  timeSelected.value = "";
  occurrenceEntry.value.subject =
    typeof occurrenceEntry.value.subject === "object"
      ? occurrenceEntry.value.subject._id
      : occurrenceEntry.value.subject;

  if (!_timeValidation.value) {
    setSnackbar({
      text: "Invalid Date, Please select hours and minutes",
      modal: true,
      type: "warning",
    });
    return;
  }
  emit("addData", occurrenceEntry.value);
};

async function onSelectDate(value: string | Date) {
  dateSelectedForm.value = new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

const dropdownState = ref("closed");
const validateTime = () => {
  const dobTimeElement = document.getElementById("dobTime");
  if (dobTimeElement) {
    const closestTimePicker = dobTimeElement.closest(".vue__time-picker");
    if (closestTimePicker) {
      const closestDropdown = closestTimePicker.querySelector(".dropdown");
      if (
        closestDropdown &&
        (timeSelected.value.includes("mm") || timeSelected.value.includes("HH"))
      ) {
        // closestDropdown.classList.add('d-block');
        setSnackbar({
          text: "Invalid Time, Please select hours and minutes",
          modal: true,
          type: "warning",
        });
        dobTimeElement.classList.add("required-time");
        _timeValidation.value = false;
        timeSelected.value = "";
      } else {
        _timeValidation.value = true;
      }
    }
  }
  return "closed";
};

const btnvalidate = computed(() => {
  if (isOccurrenceEntryValid.value === null) {
    return true;
  }

  if (isOccurrenceEntryValid.value && _timeValidation.value) {
    return false;
  }

  return true;
});
</script>

<style>
.sign-container {
  position: absolute;
  left: 10px !important;
  width: 100%;
}

.sign-icon {
  position: absolute;
  right: 30px !important;
}

.vue__time-picker-input {
  width: 100% !important;
  border-radius: 5px !important;
  height: 40px !important;
  padding-left: 50px !important;
}
</style>
