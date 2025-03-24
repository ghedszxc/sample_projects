<template>
  <v-row no-gutters class="px-6">
    <!-- header -->
    <v-col cols="12" class="header mt-13">
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
        :class="textColor"
      >
        Invite {{ textHeader.charAt(0).toUpperCase() + textHeader.slice(1) }}
        <span v-if="textHeader.toLowerCase() !== 'guest'">Visitor</span>
      </span>
    </v-col>

    <!-- icon -->
    <v-col cols="12" class="mt-6">
      <v-row
        no-gutters
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-img :src="imgSrc" style="width: 190px; height: 190px"></v-img>
      </v-row>
    </v-col>

    <!-- title-->
    <v-col cols="12" class="mt-8">
      <v-row no-gutters>
        <v-col cols="6" class="title font-weight-bold mt-1" :class="textColor">
          Visitor Arrival
        </v-col>

        <v-col cols="6" class="mt-2 text-end" :class="textColor">
          <span class="required">*</span> are required fields
        </v-col>
      </v-row>
    </v-col>

    <!-- Form -->
    <v-col cols="12" class="mt-6">
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="sendInvite"
      >
        <!--Arrival date -->
        <div>
          <v-menu :close-on-content-click="false" v-model="menu">
            <template v-slot:activator="{ props }">
              <v-text-field
                :base-color="baseColor"
                :bg-color="bgColor"
                class="mb-6"
                v-model="formattedDate"
                :rules="[requiredInput]"
                placeholder="DD/MM/YYYY"
                required
                density="default"
                filled
                outlined
                v-bind="props"
                @click="menu = true"
                hide-details
                readonly
                :disabled="isDateDisabled(formattedDate)"
              >
                <template v-slot:label>
                  <span>DD/MM/YYYY </span><span class="required">*</span>
                </template>

                <template #prepend-inner>
                  <div style="width: 35px" class="pl-2 pr-1">
                    <v-img :src="calendarImgSrc" class="cursor-pointer" />
                  </div>
                </template>
              </v-text-field>
            </template>
            <v-date-picker
              v-model="arrivalDate"
              :max="maxDate"
              @update:modelValue="onDateSelected"
              :format="customFormat"
              :min="minDate"
            >
              <template v-slot:header="{}"></template>
            </v-date-picker>
          </v-menu>
        </div>

        <v-row>
          <v-col cols="6">
            <v-text-field
              class="mb-6"
              v-model="arrivalTime"
              :rules="[requiredInput]"
              density="default"
              filled
              variant="outlined"
              hide-details
              type="time"
              :base-color="baseColor"
              :bg-color="bgColor"
            >
              <template v-slot:label>
                <span>Arrival Time </span>
                <span class="required">*</span>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :base-color="baseColor"
              :bg-color="bgColor"
              label="Duration"
              class="mb-6"
              v-model="duration"
              density="default"
              filled
              variant="outlined"
              hide-details
              type="number"
              @input="limitInput"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-col cols="12" class="pa-0 pb-6">
          <v-row no-gutters>
            <span class="title font-weight-bold mt-1" :class="textColor">
              Visitor Information
            </span>
            <v-spacer></v-spacer>
          </v-row>
        </v-col>
        <v-row no-gutters>
          <v-col cols="12" class="pb-0">
            <v-text-field
              :base-color="baseColor"
              :bg-color="bgColor"
              v-model="givenName"
              :rules="[atLeastOneFieldRequired]"
              placeholder="Enter Name"
              density="default"
              filled
              variant="outlined"
              hint=""
            >
              <template v-slot:label> Name </template>
            </v-text-field>
          </v-col>
          <!-- <v-col cols="12" class="pb-0">
            <v-text-field
              :base-color="baseColor"
              :bg-color="bgColor"
              v-model="surname"
              :rules="[atLeastOneFieldRequired]"
              placeholder="Enter last name"
              density="default"
              filled
              variant="outlined"
              hint=""
            >
              <template v-slot:label> Last Name </template>
            </v-text-field></v-col
          > -->
        </v-row>
        <!-- Phone Number -->
        <v-row no-gutters class="mt-0 pt-0">
          <v-col cols="5" class="py-0 pr-1 pr-4">
            <v-autocomplete
              :base-color="baseColor"
              :bg-color="bgColor"
              v-model="prefix"
              density="default"
              :items="prefixes"
              item-title="country"
              item-value="value"
              hide-details
              menu-icon="mdi-chevron-down"
              chips
            >
              <template v-slot:label> Country Code </template>
              <template v-slot:chip="{ props, item }">
                <v-row no-gutters v-bind="props">
                  <v-col cols="6">
                    <v-avatar size="20" :image="item.raw.flag" class="mr-3">
                    </v-avatar>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="6">
                    {{ item.raw.dial_code }}
                  </v-col>
                </v-row>
              </template>
              <template v-slot:item="{ props, item }">
                <v-row no-gutters v-bind="props" class="px-3">
                  <v-col cols="auto">
                    <v-avatar size="20" :image="item.raw.flag"></v-avatar>
                  </v-col>
                  <v-col>
                    <span>{{ item.raw.dial_code }}</span>
                  </v-col>
                  <v-col class="text-center">
                    <v-chip color="primary">{{ item.raw.country }}</v-chip>
                  </v-col>
                </v-row>
              </template>
            </v-autocomplete>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="7" class="py-0">
            <v-text-field
              :base-color="baseColor"
              :bg-color="bgColor"
              class="mb-6"
              v-model="primaryPhone"
              placeholder="Enter contact no."
              required
              density="default"
              filled
              variant="outlined"
              hide-details
              @input="validatePhoneNumber"
            >
              <template v-slot:label> Contact No (optional) </template>
            </v-text-field>
          </v-col>

          <v-spacer></v-spacer>
          <!-- v-model="resident.email"
            :rules="[requiredInput, validEmail]" -->
          <v-col cols="12">
            <v-text-field
              :base-color="baseColor"
              :bg-color="bgColor"
              class="mb-6"
              placeholder="Enter e-mail"
              v-model="visitorEmail"
              density="default"
              :rules="[validEmail]"
              filled
              variant="outlined"
              hide-details
            >
            </v-text-field
          ></v-col>
          <v-col cols="12">
            <v-row no-gutters class="px-3 pt-0">
              <v-col cols="10">
                <p>or select contact in your phone book</p>
              </v-col>
              <v-col cols="2" class="mb-8 d-flex justify-end">
                <v-icon left>mdi-plus</v-icon>
              </v-col>
            </v-row></v-col
          >

          <!-- <v-col cols="12" v-show="textHeader === 'guest'" class="py-0">
            <v-text-field
              :base-color="baseColor"
              v-model="textFill"
              class="mb-6"
              required
              density="default"
              variant="outlined"
              readonly
              @click="toggleInviteOvernightParking"
              :append-inner-icon="
                isOvernightParking === true
                  ? 'mdi-check-decagram'
                  : 'mdi-xamarin'
              "
              :class="{
                'text-green': isOvernightParking === true,
                'text-red': isOvernightParking === false,
              }"
              hide-details
            ></v-text-field>
          </v-col> -->
          <v-col cols="12" v-show="textHeader === 'guest'" class="py-0">
            <v-text-field
              :base-color="baseColor"
              v-model="textFill"
              class="mb-6"
              required
              density="default"
              variant="outlined"
              readonly
              @click="checkAndShowDialogOvernightParkingApprovalHours"
              :append-inner-icon="
                isOvernightParking === true
                  ? 'mdi-check-decagram'
                  : 'mdi-xamarin'
              "
              :class="{
                'text-green': isOvernightParking === true,
                'text-red': isOvernightParking === false,
              }"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12" v-show="textHeader === 'guest'">
            <v-text-field
              class="mb-6"
              v-model.number="numberOfPassenger"
              :rules="[
                (value) =>
                  /^\d+$/.test(value) || 'Input must be a positive number',
              ]"
              placeholder="Enter no. of passengers"
              density="default"
              filled
              variant="outlined"
              hide-details
              :base-color="baseColor"
              :bg-color="bgColor"
              @keypress="numberOfPassengerfilter"
            >
              <template v-slot:label> No. of passengers (optional) </template>
              <template #append-inner>
                <v-icon class="cursor-pointer" @click="decreaseNumber">
                  mdi-minus-circle-outline
                </v-icon>
                <v-icon class="cursor-pointer" @click="increaseNumber">
                  mdi-plus-circle-outline
                </v-icon>
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="12" class="pt-0">
            <v-textarea
              :base-color="baseColor"
              :bg-color="bgColor"
              v-model="messagePurpose"
              placeholder="Enter purpose of visit"
              hide-details
              class="text-area"
              name="input-7-1"
              auto-grow
            >
              <template v-slot:label> Purpose of visit (optional) </template>
            </v-textarea>
          </v-col>

          <v-col cols="12" class="mt-3">
            <v-btn
              block
              color="#EB261E"
              flat
              style="height: 48px"
              type="submit"
              :loading="isLoading"
              class="button-design mb-3"
              :disabled="isButtonDisabled"
            >
              <!-- Display "Sending Invitation" when loading -->
              <template v-if="isLoading"> Sending Invitation </template>
              <!-- Display "Send Invitation" when not loading -->
              <template v-else> Send Invitation </template>
            </v-btn>
          </v-col>

          <!-- <v-dialog v-model="dialogConfirmOvernight" max-width="290">
            <v-card>
              <v-card-title class="headline">Overnight Parking</v-card-title>
              <v-card-text
                >Do you want to enable overnight parking?</v-card-text
              >

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  text
                  @click="
                    isOvernightParking = true;
                    dialogConfirmOvernight = false;
                  "
                  >Yes</v-btn
                >
                <v-btn
                  color="red darken-1"
                  text
                  @click="
                    isOvernightParking = false;
                    dialogConfirmOvernight = false;
                  "
                  >No</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog> -->
          <v-dialog v-model="dialogConfirmOvernight" max-width="290">
            <v-card>
              <!-- <v-card-title class="headline">Overnight Parking</v-card-title>
              <v-card-text>
               Overnight Parking requests outside our below business hours will
                not be guaranteed a response
                <div v-for="(day, name) in setting" :key="name">
                  <v-row
                    no-gutters
                    class="my-3"
                    v-if="day.isEnabled && day.startTime && day.endTime"
                  >
                    <v-col cols="2" class="d-flex align-center justify-center">
                      <v-avatar rounded="2" size="24">
                        <v-img src="/icons/facility-booking/clock.svg"></v-img>
                      </v-avatar>
                    </v-col>

                    <v-col
                      cols="10"
                      class="d-flex align-center text-capitalize"
                    >
                      <span
                        >{{ name }}: {{ day.startTime }} -
                        {{ day.endTime }}</span
                      >
                    </v-col>
                  </v-row>
                </div>
              </v-card-text> -->
              <v-col cols="12" class="pt-5 py-0">
                <v-card variant="outlined">
                  <v-col cols="12">
                    <p class="px-3 pb-3">
                      Overnight Parking requests outside our below business
                      hours will not be guaranteed a response
                    </p>
                  </v-col>

                  <v-row class="pb-3">
                    <v-col cols="12" class="mb-0 pb-0 pt-0 mt-0">
                      <v-row no-gutters class="pb-2">
                        <v-col
                          cols="12"
                          v-for="(day, name) in setting"
                          :key="name"
                        >
                          <v-row
                            no-gutters
                            class="d-flex align-center justify-center"
                            v-if="day.isEnabled && day.startTime && day.endTime"
                          >
                            <span class="text-capitalize text-body-2 pb-1"
                              >{{ name }}: {{ day.startTime }} -
                              {{ day.endTime }}</span
                            >
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card></v-col
              >

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  variant="tonal"
                  text
                  @click="
                    isOvernightParking = true;
                    dialogConfirmOvernight = false;
                  "
                  >Yes</v-btn
                >
                <v-btn
                  color="red darken-1"
                  variant="tonal"
                  text
                  @click="
                    isOvernightParking = false;
                    dialogConfirmOvernight = false;
                  "
                  >No</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});
const { theme } = useLocal();
const { addVisitorResident, getOvernightSetting } = useVisitor();
import phoneCode from "./phone-code.json";

const { requiredInput, validEmail, minPasswordLength } = useUtils();
const { getFacilitiesSetting } = useFacility();
const { currentUser } = useLocalAuth();

const prefix = ref(null);

const { setSnackbar } = useLocal();
const prefixes = phoneCode;
const menu = ref(false);

const arrivalDate = ref(new Date());
const arrivalTime = ref("");
const duration = ref("");
const givenName = ref("");
const surname = ref("");
const primaryPhone = ref("");
const messagePurpose = ref("");
const visitorType = ref("");
const visitorEmail = ref("");
const numberOfPassenger = ref(0);

const textHeader = ref("");
const setting = ref({});

const isOvernightParking = ref(false);
const dialogConfirmOvernight = ref<boolean>(false);

const residentType = ref(false);
const textFill = ref("Overnight Parking");
const validatePhoneNumber = (event) => {
  // Only allow digits
  primaryPhone.value = event.target.value.replace(/\D/g, "");
};
const maxDate = computed(() => {
  const now = new Date();
  const daysToAdd = 365;
  now.setDate(now.getDate() + daysToAdd);
  return now.toISOString().substr(0, 10);
});

const formattedDate = computed(() => {
  const today = new Date(); // Get today's date

  // If date of birth is not available or in the past, return today's date
  if (!arrivalDate.value || new Date(arrivalDate.value) <= today) {
    return formatDate(today);
  }

  // Otherwise, format the date of birth
  const arrivalDateConverted = new Date(arrivalDate.value);
  arrivalDateConverted.setMinutes(
    arrivalDateConverted.getMinutes() +
      arrivalDateConverted.getTimezoneOffset() +
      8 * 60,
  ); // Adjust to SGT
  arrivalDate.value = arrivalDateConverted;
  return formatDate(arrivalDateConverted);
});

const limitInput = () => {
  if (duration.value.length > 2) {
    duration.value = duration.value.slice(0, 2);
  }
};

function formatDate(date) {
  return `${pad(date.getDate())}/${pad(
    date.getMonth() + 1,
  )}/${date.getFullYear()}`;
}

// Function to pad single digit numbers with leading zeros
function pad(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}

// Function to check if a date is disabled (before yesterday)
function isDateDisabled(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Set yesterday's date
  return date < yesterday;
}
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().substr(0, 10);
});
const customFormat = (value: any) => {
  if (!value) return null;
  const [year, month, day] = value.split("-");
  return `${pad(month)}/${pad(day)}/${year}`;
};

const onDateSelected = <T,>(value: T) => {
  arrivalDate.value = value as any;
  menu.value = false;
};
const form = ref(null);
// Define reactive variables for form validation
const valid = ref(true);

onMounted(async () => {
  if (!theme.value) theme.value = "light";
  visitorType.value = localStorage.getItem("Visitor type");
  prefix.value = phoneCode.find((p) => p.country === "Singapore");
  textHeader.value = visitorType.value ?? "";
  setting.value = await getOvernightSetting({ site: currentUser.value.site });
});

const toggleInviteOvernightParking = () => {
  isOvernightParking.value = !isOvernightParking.value;
};

const decreaseNumber = () => {
  if (numberOfPassenger.value > 0) {
    numberOfPassenger.value--;
  }
};
const increaseNumber = () => {
  if (numberOfPassenger.value < 500) {
    numberOfPassenger.value++;
  }
};

const isLoading = ref(false);

async function sendInvite() {
  isLoading.value = true; // Set loading to true when form is submitting

  const timeParts = arrivalTime.value.split(":");
  const date = new Date(arrivalDate.value);
  const type = visitorType.value === "guest" ? "guest" : "walk-in";
  const data = {
    arrivalTime: arrivalTime.value,
    firstName: givenName.value,
    lastName: surname.value,
    checkIn: new Date(date.setHours(0, 0)),
    checkOut: new Date(date.setHours(23, 59)),
    prefix: phoneCode.find(
      (p) => p.country === prefix.value.country || p.country === prefix.value,
    )?.dial_code,
    phoneNumber: primaryPhone.value,
    type,
    duration: duration.value,
    remarks: messagePurpose.value,
    isOvernightParking: isOvernightParking.value,
    email: visitorEmail.value,
    numberOfPassenger: numberOfPassenger.value,
  };

  try {
    const getData = await addVisitorResident(data);
    if (getData) {
      useRouter().push({
        name: "resident-invite-pre-register-id",
        params: { id: getData },
      });
    } else {
      setSnackbar({
        text: "Visitor invitation failed",
        modal: true,
        type: "error",
      });
    }
  } catch (error) {
    let error1 = error || "Server Gateway Timeout Error";

    setSnackbar({
      text: error1 + ". Please try again.",
      modal: true,
      type: "error",
    });
  } finally {
    isLoading.value = false; // Reset loading state after submission
  }
}

const isButtonDisabled = computed(() => {
  return !arrivalTime.value || !(givenName.value || surname.value);
});

const atLeastOneFieldRequired = computed(() => {
  return (v: string) =>
    !!givenName.value ||
    !!surname.value ||
    "Fill in either the First Name or Last Name";
});

const numberOfPassengerfilter = (evt) => {
  evt = evt ? evt : window.event;
  let expect = evt.target.value.toString() + evt.key.toString();

  if (expect === "-" || !/^\d*$/.test(expect) || parseInt(expect) > 500) {
    evt.preventDefault();
  } else {
    return true;
  }
};

const checkAndShowDialogOvernightParkingApprovalHours = () => {
  if (!setting.value) {
    setting.value = {};
  }
  if (
    Object.values(setting.value).some(
      (day: any) => day.isEnabled && day.startTime && day.endTime,
    )
  ) {
    dialogConfirmOvernight.value = true;
  } else {
    isOvernightParking.value = !isOvernightParking.value;
  }
};

function goBack() {
  useRouter().push({ name: "resident-invite" });
}

const textColor = computed(() =>
  theme.value === "dark" ? "text-dark" : "text-light",
);

const imgSrc = computed(() => {
  if (textHeader.value === "guest") {
    return theme.value === "dark"
      ? "/dark-mode/invite-visitor/drive-in-dark.png"
      : "/dark-mode/invite-visitor/drive-in.png";
  } else {
    return theme.value === "dark"
      ? "/dark-mode/invite-visitor/walk-in-dark.png"
      : "/dark-mode/invite-visitor/walk-in.png";
  }
});

const baseColor = computed(() =>
  theme.value === "dark" ? "#FAFAFAFA" : "#111723",
);

const bgColor = computed(() =>
  theme.value === "dark" ? "#111723" : "#FAFAFAFA",
);

const calendarImgSrc = computed(() =>
  theme.value === "dark"
    ? "/dark-mode/invite-visitor/calendar-dark.svg"
    : "/dark-mode/invite-visitor/calendar-light.svg",
);
</script>

<style scoped>
.header {
  font-size: 16px;
  line-height: 24px;
  color: #052439;
}
.title {
  font-size: 20px;
  line-height: 32px;
  color: #052439;
}
.text-area {
  border-radius: 4px;
  border: 1px solid var(--black-012, rgba(0, 0, 0, 0.12));
  background: var(--Background-card, #fff);
}
.menu-icon {
  width: 36.711px;
  height: 36.711px;
}

.text-dark {
  color: #dfe2e9;
}

.text-light {
  color: #0f131c;
}

.button-design {
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}

.required {
  color: red;
  font-size: 16px;
}
</style>
