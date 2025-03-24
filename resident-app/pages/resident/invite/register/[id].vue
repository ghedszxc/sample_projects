<template>
  <div>
    <div
      v-if="
        status === 'pre registered guest' || status === 'pre registered walk-in'
      "
    >
      <v-col cols="12" class="header pa-0">
        <v-img :class="headerBackgroundImage">
          <!-- site name -->
          <v-chip
            variant="flat"
            density="comfortable"
            size="large"
            class="ml-4 mt-6 chip-design"
            color="red"
          >
            <span class="chip-text text-capitalize">
              {{ siteName }}
            </span>
          </v-chip>
          <v-row no-gutters class="fill-height px-4 mt-3" align-content="end">
            <v-col cols="12">
              <v-row no-gutters>
                <v-col cols="4"> </v-col>
                <!-- full name, block name, level name, unit name, resident type -->
                <v-col cols="12" class="text-capitalize">
                  <v-row no-gutters>
                    <v-col cols="12" class="mb-3">
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          class="text-center mb-7"
                          style="position: relative; bottom: 120px"
                        >
                          <span
                            class="upper_title font-weight-bold text-capitalize"
                            style="font-size: 24px"
                          >
                            {{
                              visitor.status == "pre registered guest"
                                ? "guest"
                                : "walk-in"
                            }}
                            Pre Registration
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
      </v-col>
      <v-row no-gutters class="px-6">
        <v-col cols="12">
          <v-row no-gutters>
            <v-col
              cols="6"
              class="title font-weight-bold mt-3"
              :style="{ color: textColor }"
            >
              Visitor Information
            </v-col>
            <v-col cols="6" class="mt-3 text-end" :class="textColor">
              <span class="required">*</span> are required fields
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" class="mt-6">
          <v-text-field
            class="mb-6"
            v-model="formattedDate"
            label="Arrival Date"
            hide-details
            readonly
            density="default"
            fill
            flat
            variant="solo"
            :base-color="baseColor"
            :bg-color="bgColor"
          >
            <template #prepend-inner>
              <v-icon class="cursor-pointer">mdi-calendar-month-outline</v-icon>
            </template>
          </v-text-field>
          <v-row>
            <v-col cols="6">
              <v-text-field
                class="mb-6 grey-field"
                v-model="visitor.arrivalTime"
                label="Arrival Time"
                hide-details
                readonly
                density="default"
                fill
                flat
                variant="solo"
                :base-color="baseColor"
                :bg-color="bgColor"
              >
              </v-text-field>
            </v-col>
            <!-- Unit -->
            <v-col cols="6">
              <v-text-field
                class="mb-6 grey-field"
                v-model="visitor.duration"
                label="Duration"
                hide-details
                readonly
                density="default"
                fill
                flat
                variant="solo"
                :base-color="baseColor"
                :bg-color="bgColor"
              ></v-text-field
            ></v-col>
          </v-row>
          <!-- First Name -->
          <v-text-field
            v-if="visitor.firstName"
            class="mb-6 grey-field"
            v-model="visitor.firstName"
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
          <!-- Last Name -->
          <v-text-field
            v-if="visitor.lastName"
            class="mb-6 grey-field"
            v-model="visitor.lastName"
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
          <!-- Phone Number -->
          <v-row no-gutters v-if="visitor.phoneNumber">
            <v-col cols="5" class="py-0 pr-1 pr-4">
              <v-autocomplete
                class="grey-field"
                v-model="prefix"
                label="Country Code"
                :items="prefixes"
                item-title="country"
                item-value="value"
                hide-details
                menu-icon="mdi-chevron-down"
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
                    <v-avatar size="20" :image="item.raw.flag" class="mr-3">
                    </v-avatar>
                    {{ item.raw.dial_code }}
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
            <v-col cols="7" class="mr">
              <v-text-field
                class="mb-6 grey-field"
                v-model="phoneNumber"
                label="Contact No."
                hide-details
                readonly
                density="default"
                fill
                flat
                variant="solo"
                :base-color="baseColor"
                :bg-color="bgColor"
                @input="validatePhoneNumber"
              ></v-text-field
            ></v-col>
          </v-row>

          <!-- NRIC/ID No. -->
          <v-text-field
            class="mb-6"
            v-model="visitor.nric"
            placeholder="Enter identification ID"
            density="default"
            variant="outlined"
            hide-details
            :base-color="baseColor"
            :bg-color="bgColor"
            :append-inner-icon="showNric ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showNric = !showNric"
            :type="showNric ? 'text' : 'password'"
          >
            <template v-slot:label>
              NRIC/ID No./Passport Number (optional)
            </template>
          </v-text-field>

          <!-- Email -->
          <v-text-field
            class="mb-6"
            v-model="visitor.email"
            :rules="emailRules"
            label="E-mail"
            placeholder="Enter email"
            density="default"
            variant="outlined"
            hide-details
            :base-color="baseColor"
            :bg-color="bgColor"
          >
            <template v-slot:label>
              <span>E-mail </span>
              <span
                v-if="visitor.status === 'pre registered walk-in'"
                class="required"
                >*
              </span>
              <span v-else>(optional)</span>
            </template>
          </v-text-field>

          <!-- Vehicle Plate Number -->
          <v-text-field
            v-if="visitor.status == 'pre registered guest'"
            class="mb-6"
            v-model="visitor.plateNumber"
            :rules="[requiredInput]"
            placeholder="Enter vehicle plate number"
            density="default"
            variant="outlined"
            hide-details
            :base-color="baseColor"
            :bg-color="bgColor"
          >
            <template v-slot:label>
              <span>Vehicle plate number </span><span class="required">*</span>
            </template>
          </v-text-field>

          <!-- Overnight Parking -->
          <v-text-field
            v-if="visitor.status == 'pre registered guest'"
            v-model="visitor.isOvernightParking"
            model-value="Overnight Parking"
            class="mb-6"
            density="default"
            variant="outlined"
            readonly
            :append-inner-icon="
              visitor.isOvernightParking
                ? 'mdi-check-circle'
                : 'mdi-check-circle-outline'
            "
            :class="{ 'text-green': visitor.isOvernightParking }"
            hide-details
            :base-color="baseColor"
          >
          </v-text-field>

          <!-- Number of Passengers -->
          <v-col
            cols="12"
            class="mb-1"
            v-if="visitor.status == 'pre registered guest'"
          >
            <v-row>
              <span
                class="mb-6"
                style="
                  color: #052439;
                  font-size: 16px;
                  font-weight: 400;
                  line-height: 19px;
                "
                :style="{ color: textColor }"
              >
                Number of Passengers
              </span>
            </v-row>
          </v-col>
          <v-text-field
            v-if="visitor.status == 'pre registered guest'"
            class="mb-6"
            v-model.number="visitor.numberOfPassenger"
            :rules="[
              (value) =>
                /^\d+$/.test(value) || 'Input must be a positive number',
            ]"
            placeholder="Enter no. of passengers"
            required
            density="default"
            filled
            variant="outlined"
            hide-details
            :base-color="baseColor"
            :bg-color="bgColor"
            @keypress="filter"
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
          <v-col cols="12" class="mb-1">
            <v-row>
              <span
                class="mb-6"
                style="
                  color: #052439;
                  font-size: 16px;
                  font-weight: 400;
                  line-height: 19px;
                "
                :style="{ color: textColor }"
              >
                Tenant/Resident Address
              </span>
            </v-row>
          </v-col>

          <!-- Block -->
          <v-text-field
            class="mb-6 grey-field"
            v-model="visitor.blockName"
            label="Block"
            placeholder="Block"
            hide-details
            readonly
            density="default"
            fill
            flat
            variant="solo"
            :base-color="baseColor"
            :bg-color="bgColor"
          ></v-text-field>

          <!-- Level -->
          <v-row>
            <v-col cols="6">
              <v-text-field
                class="mb-6 grey-field"
                v-model="visitor.blockLevelName"
                label="Level"
                placeholder="Level"
                hide-details
                readonly
                density="default"
                fill
                flat
                variant="solo"
                :base-color="baseColor"
                :bg-color="bgColor"
              ></v-text-field
            ></v-col>

            <!-- Unit -->
            <v-col cols="6">
              <v-text-field
                class="mb-6 grey-field"
                v-model="visitor.unitName"
                label="Unit"
                placeholder="Unit"
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
          </v-row>

          <!-- Purpose of Visit -->
          <v-textarea
            v-if="visitor.remarks"
            class="grey-field"
            v-model="visitor.remarks"
            :rules="[requiredInput]"
            label="Purpose of Visit"
            placeholder="Enter purpose of visit"
            required
            hide-details
            readonly
            density="default"
            fill
            flat
            variant="solo"
            :base-color="baseColor"
            :bg-color="bgColor"
          ></v-textarea>
        </v-col>

        <!-- back and next -->
        <v-col cols="12" class="mt-6">
          <v-btn
            block
            color="#EB261E"
            flat
            class="button"
            :loading="isLoading"
            @click="validate"
          >
            <template v-if="isLoading"> Submitting... </template>
            <!-- Display "Send Invitation" when not loading -->
            <template v-else> Submit </template>
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <ApproveVisitor
      v-if="status === 'approved'"
      :qr-code-url="qrCodeUrl"
      :visitor="visitor"
      :overnight-parking="visitor.isOvernightParking ?? false"
    />
    <RejectVisitor
      v-if="status === 'rejected'"
      :name="visitor.name"
      :phone="site?.contactNumber"
      :email="site?.email"
      :rejectionSerialNumber="visitor.rejectionSerialNumber"
      :purposeOfVisit="visitor.remarks"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "only-footer",
});

const config = useRuntimeConfig();

import ApproveVisitor from "~/components/visitor/approve-visitor.vue";
import RejectVisitor from "~/components/visitor/reject-visitor.vue";

const { theme } = useLocal();
const { visitor, setVisitor, updateVisitorResident, getVisitorResident } =
  useVisitor();
const { getSiteById } = useSite();
const { requiredInput, validEmail } = useUtils();

import phoneCode from "~/pages/create-account/phone-code.json";

const showNric = ref(false);
const siteName = ref("");
const prefixes = phoneCode;
const prefix = ref("");
const phoneNumber = ref("");
const status = computed<
  "approved" | "rejected" | "pre registered guest" | "pre registered walk-in"
>(() => visitor.value.status as any);
const site = ref<TSite>();

const verifyUrl = `${config.public.MAIN_APP_URL}/visitors/qr-code`;
const qrCodeUrl = computed<string>(
  () => `${verifyUrl}/${visitor.value._id}/${visitor.value.qrCodeId}`,
);

const convertDateTimeToSGT = (dateTime: string | Date, timeZone: string) => {
  let date = new Date(dateTime);
  let convertedDateString = date.toLocaleString("en-US", {
    timeZone: timeZone,
  });
  let convertedDate = new Date(convertedDateString);
  return convertedDate;
};

onMounted(async () => {
  const id = computed(() => useRoute().params.id as string);
  const result: any = await getVisitorResident(id.value);
  if (!result || result?.status === "error")
    window.location.href = "/resident/invite/register?msg=Invalid visitor id!";
  const getSite = await getSiteById(result.visitor.site);
  site.value = getSite;
  siteName.value = site.value?.name!;

  if (result?.visitor?.actualCheckOut)
    window.location.href =
      "/resident/invite/register?msg=Visitor has already checked in and out!";
  if (!result?.visitor?.checkIn)
    window.location.href =
      "/resident/invite/register?msg=Invalid checkIn date!";
  if (!result?.visitor?.checkOut)
    window.location.href =
      "/resident/invite/register?msg=Invalid checkOut date!";
  const checkIn = convertDateTimeToSGT(
    result?.visitor?.checkIn,
    "Asia/Singapore",
  );
  const checkOut = convertDateTimeToSGT(
    result?.visitor?.checkOut,
    "Asia/Singapore",
  );
  const currentDate = convertDateTimeToSGT(new Date(), "Asia/Singapore");

  if (
    checkOut.getTime() < currentDate.getTime() &&
    !result?.visitor?.actualCheckIn
  ) {
    window.location.href =
      "/resident/invite/register?msg=Visitor already missed their scheduled check-in!";
  }

  // if (
  //   checkIn.getTime() < currentCheckIn.getTime() &&
  //   !result?.visitor?.actualCheckIn &&
  //   result?.visitor?.status !== "rejected"
  // ) {
  //   window.location.href = "/resident/invite/register";
  // }
  // check when check in date is greater than current date to inform visitor that qr code will generate on check in date
  // if (checkIn.getTime() > currentCheckIn.getTime()) {
  //   window.location.href = `/resident/invite/register?checkIn=${checkIn}`;
  // }

  setVisitor(result.visitor);

  prefix.value = visitor.value.phoneNumber.split(" ")[0];
  prefix.value = phoneCode.find((i) => i.dial_code == prefix.value);
  phoneNumber.value = visitor.value.phoneNumber.split(" ")[1];

  visitor.value.numberOfPassenger = visitor.value.numberOfPassenger || 0;
});

const decreaseNumber = () => {
  if (visitor.value.numberOfPassenger > 0) {
    visitor.value.numberOfPassenger--;
  }
};
const increaseNumber = () => {
  if (visitor.value.numberOfPassenger < 500) {
    visitor.value.numberOfPassenger++;
  }
};
const validatePhoneNumber = () => {
  resident.value.primaryPhone = resident.value.primaryPhone.replace(/\D/g, "");
};
const formattedTime = visitor.value.arrivalTime;

// const formattedDate = computed(() =>
//   new Date(visitor.value.checkIn).toLocaleDateString(),
// );

const formattedDate = computed(() => {
  const date = new Date(visitor.value.checkIn);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
});
const { setSnackbar } = useLocal();
const isLoading = ref(false);

async function validate() {
  if (visitor.value.status === "pre registered guest") {
    visitor.value.type = "guest";
  } else if (visitor.value.status === "pre registered walk-in") {
    visitor.value.type = "walk-in";
  }
  if (visitor.value.type === "walk-in" && !visitor.value.email) {
    setSnackbar({
      text: " Please enter your email address.",
      modal: true,
      type: "error",
    });
  } else {
    isLoading.value = true;
    try {
      const visitorID = useRoute().params.id;

      const patchVisitor = await updateVisitorResident(
        visitor.value,
        visitorID,
      );
      if (patchVisitor?.result?.success) {
        setVisitor(patchVisitor.result.visitor);
      } else if (patchVisitor.success) {
        setVisitor(patchVisitor.visitor);
      } else {
        isLoading.value = false;
      }
    } catch (error) {
      let error1 = error || "Server Gateway Error";
      setSnackbar({
        text: error1 + ". Please try again. ",
        modal: true,
        type: "error",
      });
      // Create a snackbar element
      const snackbar = document.createElement("div");
      snackbar.className = "snackbar error";
      snackbar.textContent = "Please enter required fields";
      // Append snackbar to the document body
      document.body.appendChild(snackbar);
      // Remove the snackbar after a certain duration
      setTimeout(() => {
        snackbar.remove();
      }, 3000); // Adjust the duration as needed
      isLoading.value = false;
    }
  }
}

const headerBackgroundImage = computed(() =>
  theme.value === "dark"
    ? "header-background-image-dark"
    : "header-background-image-light",
);

const baseColor = computed(() =>
  theme.value === "dark" ? "#FAFAFAFA" : "#111723",
);

const bgColor = computed(() =>
  theme.value === "dark" ? "#111723" : "#FAFAFA",
);

const textColor = computed(() =>
  theme.value === "dark" ? "#FFFFFF" : "#0F131C",
);

const filter = (evt) => {
  evt = evt ? evt : window.event;
  let expect = evt.target.value.toString() + evt.key.toString();

  if (expect === "-" || !/^\d*$/.test(expect) || parseInt(expect) > 500) {
    evt.preventDefault();
  } else {
    return true;
  }
};

const nricRules = computed(() => {
  if (visitor.status === "pre registered guest") {
    return [requiredInput];
  } else {
    return [];
  }
});

const emailRules = computed(() => {
  if (visitor.status === "pre registered walk-in") {
    return [requiredInput, validEmail];
  } else {
    return [];
  }
});
</script>

<style scoped>
.grey-field {
  pointer-events: none;
  /* background-color: #f2f2f2; */
}

.grey-field-green {
  pointer-events: none;
  background-color: #fafafa;
}
.custom-card {
  height: 100px;
  /* Adjust the height as needed */
  color: #052439;
  width: 100%;
}

.custom-app-bar .v-toolbar__title {
  margin-left: 0 !important;
  /* Optional: Adjust margin as needed */
}

.title {
  font-size: 18px;
  line-height: 32px;
  color: #052439;
}

.upper_title {
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0px 5px 14px rgba(0, 0, 0, 0.4);
  font-size: 24px;
  font-style: normal;
  font-weight: 900;
  line-height: 48px; /* 200% */
  text-transform: uppercase;
}

.button {
  width: 178px;
  height: 48px;
}

.header {
  position: relative;
}
.header-background-image-light {
  height: 212px;
  background:
    linear-gradient(180deg, rgba(20, 22, 39, 0) 65.66%, #fff 100.16%),
    url("/images/resident/pre-registration.jpg") no-repeat lightgray 50% / cover;
  box-shadow: inset 0 -1px 0 rgb(255, 255, 255);
  border: 0;

  /* background: linear-gradient(180deg, rgba(20, 22, 39, 0) 25.66%, #fff 83.16%),
    url("/images/resident/home.png") lightgray 50% / cover no-repeat, #111824; */
}

.header-background-image-dark {
  height: 212px;
  background:
    linear-gradient(180deg, rgba(20, 22, 39, 0) 0%, #131218 100%),
    url("/images/resident/pre-registration.jpg") no-repeat lightgray 50% / cover;
  border: 0px solid #131218;

  /* background: linear-gradient(180deg, rgba(20, 22, 39, 0) 25.66%, #fff 83.16%),
    url("/images/resident/home.png") lightgray 50% / cover no-repeat, #111824; */
}

.card-profile-image-light {
  position: absolute;
  bottom: -35px;
  left: 15px;
  z-index: 1;
  border-radius: 757.819px;
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
.profile-image {
  width: 81px;
  height: 81px;
  border-radius: 757.819px;
  border: 2px solid var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(224, 36, 28, 0.2);
}

.chip-design {
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}

.required {
  color: red;
  font-size: 16px;
}
</style>
