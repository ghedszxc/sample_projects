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
      <span
        style="position: relative; right: 18px; bottom: 1px"
        :class="textBackColor"
      >
        Confirm Details</span
      >
    </v-col>

    <v-col cols="12" class="mt-6">
      <v-row no-gutters>
        <span class="title font-weight-bold mt-1" :class="textBackColor">
          Confirm Details
        </span>
        <v-spacer></v-spacer>
        <v-chip variant="flat" class="pa-4 chip-shadow" color="#EB261E">
          Step
          <span class="ml-1"> 5 </span>
          /5
        </v-chip>
      </v-row>
    </v-col>

    <!-- firstname -->
    <v-col cols="12" class="mt-6">
      <v-text-field
        v-model="resident.givenName"
        label="First Name"
        hide-details
        readonly
        density="default"
        fill
        flat
        variant="solo"
        :base-color="baseColor"
        :bg-color="bgColor"
      ></v-text-field>
    </v-col>

    <!-- Lastname -->
    <v-col cols="12" class="mt-6">
      <v-text-field
        v-model="resident.surname"
        label="Last Name"
        hide-details
        readonly
        density="default"
        fill
        flat
        variant="solo"
        :base-color="baseColor"
        :bg-color="bgColor"
      ></v-text-field>
    </v-col>

    <!-- email -->
    <v-col cols="12" class="mt-6">
      <v-text-field
        v-model="resident.email"
        label="Email Address"
        hide-details
        readonly
        density="default"
        fill
        flat
        variant="solo"
        :base-color="baseColor"
        :bg-color="bgColor"
      ></v-text-field>
    </v-col>

    <!-- mobile phone -->
    <v-col cols="12" class="mt-6">
      <v-row no-gutters>
        <v-col cols="5" class="py-0 pr-1 pr-4">
          <v-select
            v-model="resident.prefix"
            :items="prefixes"
            item-title="country"
            item-value="value"
            hide-details
            menu-icon="mdi-chevron-down"
            chips
            readonly
            density="default"
            fill
            flat
            variant="solo"
            :base-color="baseColor"
            :bg-color="bgColor"
          >
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
          </v-select>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="7">
          <v-text-field
            v-model="resident.primaryPhone"
            density="default"
            fill
            flat
            variant="solo"
            :base-color="baseColor"
            :bg-color="bgColor"
            label="Contact Number"
            hide-details
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
    </v-col>

    <!-- date of birth -->
    <v-col cols="12" class="mt-7">
      <v-text-field
        v-model="dateOfBirth"
        label="Date of Birth"
        density="default"
        fill
        flat
        variant="solo"
        :base-color="baseColor"
        :bg-color="bgColor"
        hide-details
        type="text"
        prepend-inner-icon="mdi-calendar-month-outline"
        readonly
      ></v-text-field>
    </v-col>

    <v-col cols="12" class="mt-7">
      <v-text-field
        v-model="maskedNric"
        label="NRIC/Passport Number"
        density="default"
        fill
        flat
        variant="solo"
        :base-color="baseColor"
        :bg-color="bgColor"
        hide-details
        type="text"
        readonly
      ></v-text-field>
    </v-col>

    <!-- vehicle model -->
    <v-col cols="12" class="mt-6" v-if="resident.vehicleModel">
      <v-text-field
        readonly
        v-model="resident.vehicleModel"
        density="default"
        fill
        flat
        variant="solo"
        :base-color="baseColor"
        :bg-color="bgColor"
        label="Vehicle Model"
        hide-details
      ></v-text-field>
    </v-col>

    <!-- vehicle model and color -->
    <v-col cols="12" class="mt-6" v-if="resident.vehicleModel">
      <v-row no-gutters>
        <!-- vehicle model -->
        <v-col cols="6" class="pr-2">
          <v-text-field
            readonly
            v-model="resident.vehicleNo"
            density="default"
            fill
            flat
            variant="solo"
            :base-color="baseColor"
            :bg-color="bgColor"
            label="Vehicle No"
            hide-details
          ></v-text-field>
        </v-col>
        <v-spacer></v-spacer>
        <!-- vehicle color -->
        <v-col cols="6" class="pl-2">
          <v-text-field
            v-model="resident.vehicleColor"
            density="default"
            fill
            flat
            variant="solo"
            :base-color="baseColor"
            :bg-color="bgColor"
            label="Vehicle Color"
            hide-details
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
    </v-col>

    <!-- organization/site -->
    <v-col cols="12" class="mt-6">
      <v-text-field
        v-model="resident.site.name"
        density="default"
        fill
        flat
        variant="solo"
        :base-color="baseColor"
        :bg-color="bgColor"
        label="Organization/Site"
        hide-details
        readonly
      ></v-text-field>
    </v-col>

    <!-- organization/site -->
    <v-col cols="12" class="mt-6">
      <v-text-field
        v-model="siteAddress"
        density="default"
        fill
        flat
        variant="solo"
        :base-color="baseColor"
        :bg-color="bgColor"
        label="Address"
        hide-details
        readonly
      ></v-text-field>
    </v-col>

    <!-- uploaded tenant document(s) -->
    <v-col cols="12" class="mt-6">
      <v-card
        class="pt-2 pb-2"
        :style="{ backgroundColor: bgColor }"
        :class="{ 'shadow-button': true }"
      >
        <v-card-subtitle class="font-small">
          Tenant Agreement/Tenancy Stamp
        </v-card-subtitle>
        <v-card-subtitle>
          <v-chip-group column multiple>
            <template v-for="file in resident.tenantDocument" :key="file._id">
              <NuxtLink
                :to="`/api/files/${file._id}`"
                target="_blank"
                style="color: #eb261e"
              >
                <v-chip class="text-wrap text-caption pa-6">
                  {{ file.name }}
                </v-chip>
              </NuxtLink>
            </template>
          </v-chip-group>
        </v-card-subtitle>
      </v-card>
    </v-col>

    <!-- uploaded car registration document(s) -->
    <v-col v-if="resident.carRegistration.length" cols="12" class="mt-6">
      <v-card
        class="pt-2 pb-2"
        :style="{ backgroundColor: bgColor }"
        :class="{ 'shadow-button': true }"
      >
        <v-card-subtitle class="font-small"> Car registration </v-card-subtitle>
        <v-card-subtitle>
          <v-chip-group column multiple>
            <template v-for="file in resident.carRegistration" :key="file._id">
              <NuxtLink
                :to="`/api/files/${file._id}`"
                target="_blank"
                style="color: #eb261e"
              >
                <v-chip class="text-wrap text-caption pa-6">
                  {{ file.name }}
                </v-chip>
              </NuxtLink>
            </template>
          </v-chip-group>
        </v-card-subtitle>
      </v-card>
    </v-col>

    <v-col cols="12" class="mt-6">
      <v-text-field
        v-if="resident.status === 'resubmit'"
        :base-color="baseColor"
        :bg-color="bgColor"
        class="mb-6"
        v-model="resident.password"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPassword = !showPassword"
        :rules="[requiredInput]"
        :type="showPassword ? 'text' : 'password'"
        label="Password"
        placeholder="*********"
        required
        density="default"
        filled
        variant="outlined"
        hint="Enter your password"
      ></v-text-field>
    </v-col>

    <!-- confirm -->
    <v-col cols="12" class="mt-6 shadow-button">
      <v-btn
        class="shadow-button"
        block
        color="#E0241C"
        flat
        style="height: 48px"
        @click="submit"
      >
        Submit
      </v-btn>
    </v-col>

    <!-- dialog -->
    <v-dialog
      v-model="confirmation_dialog"
      fullscreen
      hide-overlay
      transition="dialog-right-transition"
    >
      <v-card :color="colorCard">
        <v-row no-gutters class="d-flex pb-0 mb-0">
          <v-col cols="6" class="d-flex justify-start align-center pl-3">
            <div @click="cancel()" style="cursor: pointer">
              <v-img
                :src="imgSrc"
                style="width: 100.153px; margin-left: 10px; margin-top: 6px"
              ></v-img>
            </div>
          </v-col>
          <v-col cols="6" class="d-flex justify-end align-center pr-7">
            <div @click="cancel()" style="cursor: pointer">
              <v-avatar rounded="0" style="width: 24px; height: 24px">
                <v-img :src="BackIconimgSrc" cover></v-img>
              </v-avatar>
            </div>
          </v-col>
          <v-col cols="12">
            <v-row no-gutters>
              <!-- close -->

              <!-- gif icon -->
              <v-col cols="12">
                <v-row no-gutters justify="center">
                  <v-img
                    src="/dark-mode/forgot-password/images/password_check.svg"
                    style="width: 190px; height: 190px"
                  ></v-img>
                </v-row>
              </v-col>
              <v-col
                :color="textBackColor"
                cols="12"
                class="text-center"
                style="line-height: 19px; font-size: 24px"
              >
                {{
                  resident.status !== "resubmit"
                    ? "Account Created!"
                    : "Account Resubmitted!"
                }}
              </v-col>
              <v-col
                cols="12"
                class="mt-3 text-center"
                style="
                  color: #555e6f;
                  line-height: 19px;
                  font-size: 16px;
                  font-weight: 400;
                "
              >
                {{
                  resident.status !== "resubmit"
                    ? "Your account is successfully created!"
                    : "Your account is successfully resubmitted!"
                }}
              </v-col>

              <v-col cols="12" class="mt-3 px-10">
                <v-row no-gutters justify="center">
                  <v-card
                    class="rounded-lg mx-auto pa-6 border-card"
                    variant="flat"
                    style="text-align: center"
                  >
                    <span class="text-box-content">
                      We will verify your information and you will receive on
                      your email if your account is “Approve” or “Rejected”
                    </span>
                  </v-card></v-row
                >
              </v-col>
              <v-col cols="12" class="mt-3">
                <v-row no-gutters justify="center">
                  <v-col
                    cols="8"
                    class="text-center"
                    style="
                      color: #555e6f;
                      line-height: 19px;
                      font-size: 16px;
                      font-weight: 400;
                    "
                  >
                    Your account is subject to restriction until your identity
                    is verified.
                  </v-col>
                </v-row>
              </v-col>
              <!-- ok button -->
              <v-col cols="12" class="mt-7 text-center px-7">
                <v-btn
                  color="#E0241C"
                  size="large"
                  style="width: 160px; height: 48px"
                  block
                  :to="{ name: 'index' }"
                >
                  ok
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-footer height="44" class="px-0 pt-15" :color="colorCard">
          <v-row no-gutters class="px-12">
            <v-col cols="12" class="text-caption pt-1">
              <v-row no-gutters justify="center">
                <span class="Subtitle 2 fs12">
                  © 2024 by Seven 365 Pte Ltd V1.0
                </span>
              </v-row>
            </v-col>
          </v-row>
        </v-footer>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "only-footer",
});
const { requiredInput } = useUtils();
const { theme } = useLocal();
const { resident, setResidentValue } = useResident();
const { signupResident } = useLocalAuth();
const confirmation_dialog = ref(false);

import phoneCode from "./phone-code.json";

const siteAddress = ref("");
const prefixes = phoneCode;
const showPassword = ref(false);

const dateOfBirth = computed(() => {
  const date = new Date(resident.value.dateOfBirth);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
});

onMounted(() => {
  if (!theme.value) theme.value = "light";
  const values = localStorage.getItem("resident");

  console.log("values", values);

  if (values) resident.value = JSON.parse(values);

  siteAddress.value =
    resident.value.block.name +
    " " +
    resident.value.level.name +
    " " +
    resident.value.unitNumber.name;
});

async function submit() {
  resident.value.dateOfBirth = new Date(resident.value.dateOfBirth);

  try {
    const data = toRaw(resident.value);

    phoneCode.forEach((item) => {
      if (data.prefix.country == item.country) {
        data.prefix = item.dial_code;
      }
    });

    const result = await signupResident(data);
    if (!result) {
      return;
    }

    confirmation_dialog.value = true;
    localStorage.removeItem("resident");

    if (resident.value.status !== "resubmit") {
      setTimeout(() => {
        setResidentValue();
      }, 1000);
    }
  } catch (error) {}
}

const maskedNric = computed(() => {
  return resident.value.nric
    ? "*".repeat(
        resident.value.nric.length - (resident.value.nric.length > 4 ? 4 : 2),
      ) +
        resident.value.nric.substr(
          resident.value.nric.length - (resident.value.nric.length > 4 ? 4 : 2),
        )
    : "";
});

function cancel() {
  useRouter().push({ name: "index" });
}

function goBack() {
  useRouter().push({ name: "create-account-proof-document" });
}

const textBackColor = computed(() =>
  theme.value === "dark" ? "text-back-dark" : "text-back",
);
const colorCard = computed(() =>
  theme.value === "dark" ? "#0F131C" : "#FFFFFF",
);

const baseColor = computed(() =>
  theme.value === "dark" ? "#FAFAFAFA" : "#111723",
);

const bgColor = computed(() =>
  theme.value === "dark" ? "#111723" : "#FAFAFAFA",
);

const imgSrc = computed(() =>
  theme.value === "dark"
    ? "/images/resident/dark/seven-365.svg"
    : "/images/resident/light/seven-365.svg",
);

const BackIconimgSrc = computed(() =>
  theme.value === "dark"
    ? "/dark-mode/forgot-password/images/back.svg"
    : "/dark-mode/forgot-password/images/back-light.svg",
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
.button {
  width: 178px;
  height: 48px;
}

.text-back-dark {
  color: #dfe2e9;
}

.text-back {
  color: #0f131c;
}

.shadow-button {
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}

.border-card {
  border-radius: 24px;
  /* border: 2px solid var(--dark-grey-border, #343a45); */
  border: 1px solid var(--Primary, #eb261e);
  /* card-ds */
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.1);
}
</style>
