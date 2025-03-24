<template>
  <v-row no-gutters>
    <!-- go back -->
    <v-col
      cols="6"
      :class="`mt-6 ${$vuetify.display.smAndUp ? 'px-12' : 'px-3'}`"
      @click="goBack()"
    >
      <v-icon start size="x-large" style="position: relative; right: 5px">
        <v-img
          class="pl-0 ml-0 mt-2"
          src="/dark-mode/utility-all/right-arrow.svg"
          cover
        ></v-img>
      </v-icon>
      <span style="position: relative; right: 15px"> My Unit </span>
    </v-col>

    <!-- icon -->
    <v-col cols="12" class="mt-6">
      <v-row no-gutters justify="center">
        <v-card class="add-resident-icon">
          <v-img
            src="/icons/resident/home/no-my-residents.svg"
            style="width: 124px; height: 124px"
          ></v-img>
        </v-card>
      </v-row>
    </v-col>

    <!-- relationship -->
    <v-col cols="12" :class="`relationship-text px-5`"> Relationship </v-col>

    <!-- form -->
    <v-col cols="12" class="mt-6 px-5">
      <v-form ref="form" v-model="valid" lazy-validation>
        <!-- relationship -->
        <v-row class="mb-3">
          <v-col cols="12">
            <v-radio-group v-model="relationship" class="mt-2">
              <v-row no-gutters>
                <v-col cols="12">
                  <v-card :class="cardMenuItems" elevation="0">
                    <v-col cols="9"> Family </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="1">
                      <v-radio value="family"></v-radio>
                    </v-col>
                  </v-card>
                </v-col>
                <v-col cols="12" class="mt-4">
                  <v-card :class="cardMenuItems" elevation="0">
                    <v-col cols="9"> Friend </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="1">
                      <v-radio value="friend"></v-radio>
                    </v-col>
                  </v-card>
                </v-col>
              </v-row>
            </v-radio-group>
          </v-col>
        </v-row>
        <!-- general information title -->
        <v-col cols="12" class="pa-0 pb-6">
          <v-row class="d-flex justify-start">
            <v-col cols="12" :class="`${generalInformationTitle} text-start`">
              General Information
            </v-col>
          </v-row>
        </v-col>
        <v-row>
          <!-- firstname-->
          <v-col cols="6" class="pb-0">
            <v-text-field
              class="mb-6"
              v-model="givenName"
              :rules="[requiredInput]"
              label="First Name"
              placeholder="Enter first name"
              density="default"
              filled
              variant="outlined"
              hide-details
            ></v-text-field>
          </v-col>
          <!-- lastname-->
          <v-col cols="6" class="pb-0">
            <v-text-field
              class="mb-6"
              v-model="surname"
              :rules="[requiredInput]"
              label="Last Name"
              placeholder="Enter last name"
              density="default"
              filled
              variant="outlined"
              hide-details
            ></v-text-field
          ></v-col>
        </v-row>
        <!-- email-->
        <v-row>
          <v-col cols="12" class="pb-0">
            <v-text-field
              class="mb-6"
              v-model="email"
              :rules="[requiredInput, validEmail]"
              label="Email"
              placeholder="Enter email"
              density="default"
              filled
              variant="outlined"
              hide-details
            ></v-text-field
          ></v-col>
        </v-row>
        <!-- Phone Number -->
        <v-row no-gutters>
          <!-- country code -->
          <v-col cols="5" class="py-0 pr-1 pt-4 pr-4">
            <v-autocomplete
              v-model="prefix"
              label="Country Code"
              density="default"
              :items="prefixes"
              item-title="country"
              item-value="value"
              hide-details
              menu-icon="mdi-chevron-down"
              chips
            >
              <template v-slot:chip="{ props, item }">
                <v-row no-gutters v-bind="props">
                  <!-- <v-avatar size="20" :image="item.raw.flag" class="mr-3">
                    </v-avatar> -->
                  <!-- {{ item.raw.dial_code }} -->
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
          <!-- number -->
          <v-col cols="7" class="py-0 pt-4">
            <v-text-field
              class="mb-6"
              v-model="primaryPhone"
              :rules="[requiredInput]"
              label="Contact No."
              placeholder="Enter contact no."
              required
              density="default"
              filled
              variant="outlined"
              hide-details
              @input="validatePhoneNumber"
            ></v-text-field
          ></v-col>

          <!-- add resident button -->
          <v-col cols="12" class="mt-4">
            <v-btn
              block
              @click="dialogVisible = true"
              color="#eb261e"
              style="
                width: 260px;
                height: 52px;
                padding: 0px 16px;
                justify-content: center;
                align-items: center;
                margin-bottom: 15px;
                background: var(--Primary, #eb261e);
                box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
              "
            >
              Add Resident
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-col>

    <!-- confirmation dialog -->
    <v-dialog v-model="dialogVisible" max-width="500">
      <v-card class="pa-5" style="border-radius: 24px">
        <!-- close icon -->
        <v-img
          src="/icons/resident/home/close-confirm-dialog.svg"
          class="close-dialog-icon"
          @click="dialogVisible = false"
        ></v-img>

        <!-- icon -->
        <v-col cols="12" class="pa-0">
          <v-row
            no-gutters
            class="fill-height"
            align-content="center"
            justify="center"
          >
            <v-card class="add-resident-icon">
              <v-img
                src="/icons/resident/home/no-my-residents.svg"
                style="width: 124px; height: 124px"
              ></v-img>
            </v-card>
          </v-row>
        </v-col>

        <!-- confirm message -->
        <v-col
          cols="12"
          :class="`${confirmDialogMessage} font-weight-bold text-center mt-5`"
        >
          Are you sure you want to add this in your Resident List?
        </v-col>

        <!-- confirm button -->
        <v-col cols="12" class="mt-6">
          <v-btn
            block
            style="
              display: flex;
              height: 52px;
              padding: 0px 16px;
              justify-content: center;
              align-items: center;
              align-self: stretch;
              border-radius: 8px;
              box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
            "
            color="#EB261E"
            @click="confirmAddResident"
            :loading="loading"
          >
            Confirm
          </v-btn>
        </v-col>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

const { theme } = useLocal();

const back = computed(() =>
  theme.value === "dark" ? "go-back-dark" : "go-back-light",
);

const cardMenuItems = computed(() =>
  theme.value === "dark" ? "card-menu-dark" : "card-menu-light",
);

const generalInformationTitle = computed(() =>
  theme.value === "dark"
    ? "general-information-title-dark"
    : "general-information-title-light",
);

const confirmDialogMessage = computed(() =>
  theme.value === "dark"
    ? "confirm-dialog-message-dark"
    : "confirm-dialog-message-light",
);

const { addUnitResident } = useMyUnit();
const dialogVisible = ref(false);
const loading = ref(false);

// Function to confirm adding resident
const confirmAddResident = async () => {
  loading.value = true;
  const dialCode = phoneCode.find((item) => item.country == prefix.value);
  const data = {
    firstName: givenName.value,
    lastName: surname.value,
    email: email.value,
    relationship: relationship.value,
    prefix: dialCode?.dial_code,
    contactNo: primaryPhone.value,
  };

  const result = await addUnitResident(data);
  if (result) {
    useRouter().push({ name: "resident-my-unit" });
  } else {
    setSnackbar({
      text: "Please fill out all required fields.",
      modal: true,
      type: "error",
    });
  }
  loading.value = false;
};

import phoneCode from "../invite/phone-code.json";

const { requiredInput, validEmail } = useUtils();

const prefix = ref(null);

const { setSnackbar } = useLocal();
const prefixes = phoneCode;

const relationship = ref("");
const givenName = ref("");
const surname = ref("");
const primaryPhone = ref("");
const email = ref("");

const validatePhoneNumber = (event) => {
  // Only allow digits
  primaryPhone.value = event.target.value.replace(/\D/g, "");
};

const form = ref(null);
// Define reactive variables for form validation
onMounted(() => {
  if (!theme.value) theme.value = "light";
});

function goBack() {
  useRouter().push({ name: "resident-my-unit" });
}

const isLoading = ref(false);
</script>

<style scoped>
.chevron-icon {
  filter: drop-shadow(0px 4px 10px #d01b1b);
}
.go-back-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  margin-top: 3px;
}
.go-back-dark {
  color: #fcfcfc;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  margin-top: 3px;
}
.add-resident-icon {
  display: flex;
  width: 124px;
  height: 124px;
  padding: 30px;
  justify-content: space-between;
  align-items: center;
  border-radius: 80px;
  border: 10px solid var(--icon-gradient-light-mode, #72707d);
  box-shadow: 0px 10px 20px 0px rgba(201, 201, 201, 0.3);
}

.relationship-text {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}
.card-menu-light {
  display: flex;
  height: 52px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  align-self: stretch;
  border-radius: 4px;
  border: 1px solid var(--black-012, rgba(0, 0, 0, 0.12));
  background: var(--White, #fff);
}
.card-menu-dark {
  display: flex;
  height: 52px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  align-self: stretch;
  height: 52px;
  border: 1px solid var(--black-004, rgba(0, 0, 0, 0.04));
  background: var(--Corporate-blue, #111723);
  box-shadow: 0px 0px 14px 0px rgba(255, 255, 255, 0.1);
}
.general-information-title-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}
.general-information-title-dark {
  color: #fcfcfc;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}
.close-dialog-icon {
  width: 24px;
  height: 24px;
  align-self: end;
}
.confirm-dialog-message-light {
  color: var(--Corporate-blue, #111723);
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;
}
.confirm-dialog-message-dark {
  color: #fcfcfc;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;
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

.fill-height {
  height: 100vh;
}

.green-radio .v-input--selection-controls__ripple {
  background-color: green !important;
}

.green-radio .v-icon {
  color: green !important;
}

.v-radio {
  display: flex;
  justify-content: flex-end;
}
</style>
