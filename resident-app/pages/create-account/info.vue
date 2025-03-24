<template>
  <v-row no-gutters class="px-6">
    <!-- header -->
    <v-col cols="12" class="header mt-6 pa-0 ma-0">
      <v-icon
        style="position: relative; right: 10px"
        start
        size="x-large"
        @click="useRouter().push({ name: 'create-account-terms-condition' })"
      >
        <v-img
          class="pl-0 ml-0 mt-1"
          src="/dark-mode/utility-all/right-arrow.svg"
          cover
        ></v-img>
      </v-icon>
      <span
        style="position: relative; right: 15px; bottom: 1px"
        :class="textBackColor"
      >
        Personal Information</span
      >
    </v-col>

    <!-- icon -->
    <v-col cols="12" class="mt-6">
      <v-row
        no-gutters
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-img
          src="/dark-mode/create-account/icons/personal-info.svg"
          style="width: 190px; height: 190px"
        ></v-img>
      </v-row>
    </v-col>

    <!-- title-->
    <v-col cols="12" class="mt-8">
      <v-row no-gutters>
        <span class="title font-weight-bold" :class="textColor">
          Personal Information
        </span>
        <v-spacer></v-spacer>
        <v-chip variant="flat" class="pa-4 chip-shadow" color="#EB261E">
          Step
          <span class="ml-1"> 1 </span>
          /5
        </v-chip>
      </v-row>
    </v-col>

    <!-- Note for required fields -->
    <v-col cols="12" class="text-right mt-2">
      <span class="text-body-2" :class="textColor">
        <span style="color: red">*</span> are required fields
      </span>
    </v-col>

    <!-- Form -->
    <v-col cols="12" class="mt-4">
      <v-form ref="form" v-model="valid" lazy-validation>
        <!-- first name  -->
        <v-text-field
          :base-color="baseColor"
          :bg-color="bgColor"
          class="mb-6"
          v-model="resident.givenName"
          :rules="[requiredInput]"
          placeholder="Enter first name"
          density="default"
          filled
          variant="outlined"
          hide-details
        >
          <template v-slot:label>
            <span>First Name </span><span class="required">*</span>
          </template>
        </v-text-field>

        <!-- last name -->
        <v-text-field
          :base-color="baseColor"
          :bg-color="bgColor"
          class="mb-6"
          v-model="resident.surname"
          :rules="[requiredInput]"
          placeholder="Enter last name"
          density="default"
          filled
          variant="outlined"
          hide-details
        >
          <template v-slot:label>
            <span>Last Name </span><span class="required">*</span>
          </template>
        </v-text-field>

        <!-- Email -->
        <v-text-field
          :base-color="baseColor"
          :bg-color="bgColor"
          class="mb-6"
          v-model="resident.email"
          :rules="[requiredInput, validEmail]"
          placeholder="Enter e-mail"
          required
          density="default"
          filled
          variant="outlined"
          hide-details
        >
          <template v-slot:label>
            <span>E-mail </span><span class="required">*</span>
          </template>
        </v-text-field>

        <!-- Phone Number -->
        <v-row no-gutters>
          <v-col cols="5" class="py-0 pr-4">
            <v-autocomplete
              :base-color="baseColor"
              :bg-color="bgColor"
              v-model="resident.prefix"
              density="default"
              :items="prefixes"
              item-title="country"
              item-value="value"
              hide-details
              menu-icon="mdi-chevron-down"
              chips
            >
              <template v-slot:label>
                <span>Country Code </span><span class="required">*</span>
              </template>
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
                    <v-avatar
                      size="30"
                      :image="item.raw.flag"
                      class="mr-4"
                    ></v-avatar>
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
          <v-col cols="7" class="mr py-0">
            <v-text-field
              :base-color="baseColor"
              :bg-color="bgColor"
              class="mb-6"
              v-model="resident.primaryPhone"
              :rules="[requiredInput]"
              placeholder="Enter phone number"
              required
              density="default"
              filled
              variant="outlined"
              hide-details
              @input="validatePhoneNumber"
            >
              <template v-slot:label>
                <span>Phone Number </span><span class="required">*</span>
              </template></v-text-field
            ></v-col
          >
        </v-row>

        <!-- NRIC -->
        <v-text-field
          :base-color="baseColor"
          :bg-color="bgColor"
          class="mb-6"
          v-model="resident.nric"
          :append-inner-icon="showNric ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showNric = !showNric"
          :rules="[requiredInput]"
          :type="showNric ? 'text' : 'password'"
          placeholder="Enter identification ID"
          required
          density="default"
          filled
          variant="outlined"
          hide-details
        >
          <template v-slot:label>
            <span>NRIC/Passport Number </span><span class="required">*</span>
          </template></v-text-field
        >
        <!-- Date of Birth -->
        <div>
          <v-menu :close-on-content-click="false" v-model="menu">
            <template v-slot:activator="{ props }">
              <v-text-field
                :base-color="baseColor"
                :bg-color="bgColor"
                class="mb-6"
                v-model="formattedDate"
                :rules="[requiredInput]"
                placeholder="Enter your date of birth"
                required
                density="default"
                filled
                outlined
                v-bind="props"
                @click="menu = true"
                hide-details
                readonly
                ><template v-slot:label>
                  <span>Date of Birth </span><span class="required">*</span>
                </template>
                <template #prepend-inner>
                  <v-icon class="cursor-pointer"
                    >mdi-calendar-month-outline</v-icon
                  >
                </template>
              </v-text-field>
            </template>
            <v-date-picker
              v-model="dob"
              :max="maxDate"
              @update:modelValue="onDateSelected"
              :format="customFormat"
            >
              <template v-slot:header="{}"></template>
            </v-date-picker>
          </v-menu>
        </div>

        <!-- Vehicle Model -->
        <!-- <v-text-field
          :base-color="baseColor"
          :bg-color="bgColor"
          class="mb-6"
          v-model="resident.vehicleModel"
          label="Vehicle Model (Optional)"
          placeholder="Enter vehicle model"
          density="default"
          filled
          variant="outlined"
          hide-details
        ></v-text-field> -->

        <v-text-field
          :base-color="baseColor"
          :bg-color="bgColor"
          v-model="resident.vehicleNo"
          class="mb-6"
          label="Vehicle No. (Optional)"
          placeholder="Enter vehicle no."
          density="default"
          filled
          variant="outlined"
          hide-details
        ></v-text-field>

        <!-- Vehicle No. and Vehicle Color -->
        <v-row v-if="resident.vehicleNo">
          <!-- <v-col cols="6">
            <v-text-field
              :base-color="baseColor"
              :bg-color="bgColor"
              v-model="resident.vehicleNo"
              class="mb-6"
              label="Vehicle No."
              placeholder="Enter vehicle no."
              density="default"
              filled
              variant="outlined"
              hide-details
            ></v-text-field>
          </v-col> -->
          <v-col cols="6">
            <v-text-field
              :base-color="baseColor"
              :bg-color="bgColor"
              class="mb-6"
              v-model="resident.vehicleModel"
              label="Vehicle Model "
              placeholder="Enter vehicle model"
              density="default"
              filled
              variant="outlined"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :base-color="baseColor"
              :bg-color="bgColor"
              class="mb-6"
              v-model="resident.vehicleColor"
              label="Vehicle color"
              placeholder="Enter vehicle color"
              density="default"
              filled
              variant="outlined"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Password -->
        <v-text-field
          v-if="resident.status !== 'resubmit'"
          :base-color="baseColor"
          :bg-color="bgColor"
          class="mb-6"
          v-model="resident.password"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showPassword = !showPassword"
          :rules="[requiredInput, minPasswordLength]"
          :type="showPassword ? 'text' : 'password'"
          placeholder="*********"
          required
          density="default"
          filled
          variant="outlined"
          hint="At least 8 characters"
        >
          <template v-slot:label>
            <span>Password </span><span class="required">*</span>
          </template>
        </v-text-field>

        <!-- Confirm Password -->
        <v-text-field
          v-if="resident.status !== 'resubmit'"
          :base-color="baseColor"
          :bg-color="bgColor"
          v-model="confirm_password"
          :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"
          :rules="[requiredInput, minPasswordLength]"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="*********"
          required
          density="default"
          filled
          variant="outlined"
          hint="At least 8 characters"
          class="mb-4"
        >
          <template v-slot:label>
            <span>Confirm Password </span><span class="required">*</span>
          </template>
        </v-text-field>
      </v-form>
    </v-col>

    <!-- next -->
    <v-col cols="12" class="button-shadow mb-4">
      <v-btn
        class="button-shadow"
        block
        color="#E0241C"
        flat
        style="height: 48px"
        @click="validate"
      >
        next
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "only-footer",
  pageTitle: "Personal Information",
  pageRedirect: "create-account-terms-condition",
});

import phoneCode from "./phone-code.json";
const { theme } = useLocal();
const { resident } = useResident();
const { requiredInput, validEmail, minPasswordLength } = useUtils();
const { setSnackbar } = useLocal();

const prefixes = phoneCode;
const menu = ref(false);
const dob = ref(null);

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const confirm_password = ref("");

const maxDate = computed(() => {
  const now = new Date();
  now.setDate(now.getDate() - 1); // Set maximum date to yesterday
  return now.toISOString().substr(0, 10);
});

const formattedDate = computed(() => {
  if (!resident.value.dateOfBirth) return null;
  const date = new Date(resident.value.dateOfBirth);
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + 8 * 60); // Adjust to SGT
  return `${pad(date.getDate())}/${pad(
    date.getMonth() + 1,
  )}/${date.getFullYear()}`;
});

const customFormat = (value: any) => {
  if (!value) return null;
  const [year, month, day] = value.split("-");
  return `${pad(month)}/${pad(day)}/${year}`;
};

const pad = (number: number) => {
  if (number < 10) {
    return "0" + number;
  }
  return number;
};

const onDateSelected = <T,>(value: T) => {
  resident.value.dateOfBirth = value as any;
  menu.value = false;
};
const form = ref(null);

// Define reactive variables for form validation
const valid = ref(true);
const validatePhoneNumber = () => {
  resident.value.primaryPhone = resident.value.primaryPhone.replace(/\D/g, "");
};

// Function to validate form fields and navigate to next step
function validate() {
  const {
    givenName,
    surname,
    email,
    prefix,
    primaryPhone,
    nric,
    dateOfBirth,
    vehicleModel,
    vehicleNo,
    vehicleColor,
    password,
  } = resident.value;
  if (
    givenName &&
    surname &&
    email &&
    prefix &&
    primaryPhone &&
    nric &&
    dateOfBirth &&
    (password || resident.status !== "resubmit")
  ) {
    if (vehicleModel && (!vehicleNo || !vehicleColor)) {
      setSnackbar({
        text: "Please fill out vehicle No and Color.",
        modal: true,
        type: "error",
      });
      return;
    } else if (password !== confirm_password.value) {
      setSnackbar({
        text: "Password and confirm password did not match. Please try again",
        modal: true,
        type: "error",
      });
    } else {
      resident.value.prefix = phoneCode.find(
        (p) =>
          p.country === resident.value.prefix ||
          p.dial_code === resident.value.prefix.dial_code,
      );
      localStorage.setItem("resident", JSON.stringify(resident.value));
      if (vehicleModel && vehicleNo && vehicleColor) {
        useRouter().push({ name: "create-account-car-registration" });
      } else {
        useRouter().push({ name: "create-account-site-residency" });
      }
    }
  } else {
    setSnackbar({
      text: "Please fill out all required fields.",
      modal: true,
      type: "error",
    });
  }
}

onMounted(() => {
  const values = localStorage.getItem("resident");

  if (values) resident.value = JSON.parse(values);

  resident.value.prefix = phoneCode.find((p) => p.country === "Singapore");
  if (!theme.value) theme.value = "light";
});

const textBackColor = computed(() =>
  theme.value === "dark" ? "text-back-dark" : "text-back",
);

const textColor = computed(() =>
  theme.value === "dark" ? "title-dark" : "title",
);

const baseColor = computed(() =>
  theme.value === "dark" ? "#FAFAFAFA" : "#111723",
);

const bgColor = computed(() =>
  theme.value === "dark" ? "#111723" : "#FAFAFAFA",
);

const showNric = ref(false);
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

.text-back {
  color: #052439;
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
}
.text-back-dark {
  color: #fcfcfc;
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
}

.agree-terms-conditions-text-light {
  position: relative;
  top: 2px;
  right: 15px;
  color: var(--Secondary-Dark, #0f131c);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}

.agree-terms-conditions-text-dark {
  position: relative;
  top: 2px;
  right: 15px;
  color: var(--Light, #dfe2e9);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}

.color-text {
  color: #052439;
}

.text-back-dark {
  color: #dfe2e9;
}

.text-back {
  color: #0f131c;
}

.chip-shadow {
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}

.button-shadow {
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}

.title {
  font-size: 20px;
  line-height: 32px;
  color: #052439;
}
.title-dark {
  font-size: 20px;
  line-height: 32px;
  color: #fcfcfc;
}

.required {
  color: red;
  font-size: 16px;
}
</style>
