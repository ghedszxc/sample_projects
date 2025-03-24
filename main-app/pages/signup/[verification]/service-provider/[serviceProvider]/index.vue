<template>
  <v-row no-gutters class="fill-height" align-content="center">
    <v-col v-if="valid" cols="12" class="text-center">
      Thank you for verifying your invitation. You can now
      <nuxt-link :to="{ name: 'login' }">login</nuxt-link>.
    </v-col>

    <v-col v-else cols="12">
      <v-row no-gutters justify="center">
        <v-col cols="12" xxl="3" xl="3" lg="4" class="font-weight-light mt-4">
          <v-card width="100%" elevation="0" style="border-width: thin">
            <v-form v-model="isFormValid" @submit.prevent="verify()">
              <v-row no-gutters class="pa-8" justify="center">
                <v-col
                  cols="12"
                  class="text-h4 font-weight-bold mb-7 text-capitalize"
                  style="letter-spacing: 2px !important"
                >
                  Account Registration
                </v-col>

                <v-col class="mb-2">
                  <span class="font-weight-bold">
                    Email :
                    <label class="text-small">{{ form.email }}</label></span
                  >
                </v-col>
                <v-col cols="12" class="mb-4"> </v-col>

                <v-col class="mb-2">
                  <span class="font-weight-bold">Company Name </span>
                  <span class="text-red mx-1 mb-2">*</span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-text-field
                    v-model="form.name"
                    :rules="[requiredInput]"
                    type="text"
                    name="input-10-2"
                    label=""
                    class="input-group--focused"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="mb-2">
                  <span class="font-weight-bold">Contact Number </span>
                  <span class="text-red mx-1 mb-2">*</span>
                </v-col>
                <v-col cols="4" class="pr-2">
                  <v-select
                    v-model="prefix"
                    :items="prefixes"
                    item-title="country"
                    item-value="dial_code"
                    hide-details
                    menu-icon="mdi-chevron-down"
                    chips
                    label="Dial Code"
                    density="comfortable"
                    :rules="[requiredInput]"
                  >
                    <template v-slot:chip="{ props, item }">
                      <v-row no-gutters v-bind="props">
                        <v-col cols="6">
                          <v-avatar
                            size="20"
                            :image="item.raw.flag"
                            class="mr-3"
                          ></v-avatar>
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
                          <v-chip color="primary">{{
                            item.raw.country
                          }}</v-chip>
                        </v-col>
                      </v-row>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="primaryPhone"
                    label="Phone Number"
                    hide-details
                    density="comfortable"
                    :rules="[requiredInput]"
                    @input="filterNumericInput"
                  ></v-text-field>
                </v-col>

                <v-col class="mb-2">
                  <span class="font-weight-bold"> Services </span>
                  <span class="text-red mx-1 mb-2">*</span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-select
                    v-model="form.services"
                    :rules="[requiredInput]"
                    :items="filterOpt"
                    item-title="text"
                    item-value="value"
                    density="comfortable"
                    hint=""
                    :persistent-hint="false"
                    class="input-group--focused"
                  ></v-select>
                </v-col>

                <v-divider></v-divider>

                <v-col class="my-3">
                  <span class="font-weight-bold"> Set Password </span>
                  <span class="text-red mx-1 mb-2">*</span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-text-field
                    v-model="form.password"
                    :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[requiredInput, minPasswordLength]"
                    :type="show ? 'text' : 'password'"
                    name="input-10-2"
                    autocomplete="new-password"
                    label="Password"
                    hint="At least 8 characters"
                    class="input-group--focused"
                    @click:append-inner="show = !show"
                  ></v-text-field>
                </v-col>
                <v-col class="my-3">
                  <span class="font-weight-bold"> Confirm Password </span>
                  <span class="text-red mx-1 mb-2">*</span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-text-field
                    v-model="form.confirmPassword"
                    :append-inner-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[requiredInput, passwordsMatch]"
                    :type="showConfirm ? 'text' : 'password'"
                    name="input-10-2"
                    autocomplete="new-password"
                    label="Confirm Password"
                    class="input-group--focused"
                    @click:append-inner="showConfirm = !showConfirm"
                  ></v-text-field>
                </v-col>
                <v-col class="my-3">
                  <span class="font-weight-bold"> First Name </span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-text-field
                    v-model="form.fname"
                    name="input-10-2"
                    :rules="[requiredInput]"
                    class="input-group--focused"
                  ></v-text-field>
                </v-col>

                <v-col class="my-3">
                  <span class="font-weight-bold"> Last Name </span>
                  <span class="text-red mx-1 mb-2">*</span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-text-field
                    v-model="form.lname"
                    type="text"
                    name="input-10-2"
                    :rules="[requiredInput]"
                    class="input-group--focused"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-row no-gutters>
                    <v-btn theme="dark" class="font-weight-bold" type="submit">
                      submit
                    </v-btn>
                    <v-btn
                      variant="text"
                      class="font-weight-bold"
                      :to="{ name: 'login' }"
                    >
                      cancel
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "plain",
});

import phoneCode from "@/components/phone-code.json";
const prefixes = phoneCode;

const valid = ref(false);
const show = ref(false);
const showConfirm = ref(false);
const search = ref("");

const form = ref({
  name: "",
  contactNumber: "",
  services: "",
  email: "",
  password: "",
  confirmPassword: "",
  fname: "",
  lname: "",
});

const prefix = ref("+65");
const primaryPhone = ref("");
const fullPhoneNumber = ref("");

watch([prefix, primaryPhone], ([newPrefix, newPrimaryPhone]) => {
  if (!newPrefix || !newPrimaryPhone) {
    fullPhoneNumber.value = ""; // Handle null or undefined values
  } else {
    fullPhoneNumber.value = `${newPrefix}${newPrimaryPhone}`;
  }
  // Update the contact information in props
  form.value.contactNumber = fullPhoneNumber.value;
});

const emailVerified = ref(true);
const isFormValid = ref(false);
const verification = ref({
  _id: "",
  userType: "",
} as { _id: string; userType?: string } | undefined);

const { requiredInput, validEmail, minPasswordLength } = useUtils();
const { signUpVerification, getVerificationById, signUpServiceProvider } =
  useLocalAuth();
const { inviteAndCollab } = useServiceProvider();
const { createSiteCollab } = useSiteCollab();

const { setSnackbar } = useLocal();
const route = useRoute();
const filterOpt = ref([
  "Security",
  "Cleaning",
  "Pest Control",
  "Landscape",
  "Pool Maintenance",
  "Lift Maintenance",
  "M&E",
]);
const filterNumericInput = (event) => {
  const value = event.target.value;
  primaryPhone.value = value.replace(/\D/g, "");
};
onMounted(async () => {
  verification.value = await getVerificationById(
    String(route.params.verification),
  );
  console.log(verification.value);

  form.value.email = verification.value.email;
});

const passwordsMatch = (value: string) => {
  return value === form.value.password || "Passwords do not match";
};

async function verify() {
  try {
    if (form.value.password !== form.value.confirmPassword) {
      setSnackbar({
        text: "Passwords do not match",
        modal: true,
        type: "warning",
      });
      return;
    }
    await signUpServiceProvider({
      serviceProvider: {
        name: form.value.name,
        contactNumber: form.value.contactNumber,
        service: form.value.services,
        email: verification.value.email,
      },
      user: {
        _id: verification.value._id,
        givenName: form.value.fname,
        surname: form.value.lname,
        email: verification.value.email,
        password: form.value.password,
        type: verification.value.type,
        serviceProvider: verification.value.serviceProvider,
        isAdmin: true,
      },
    });
    valid.value = true;
  } catch (error: any) {
    valid.value = false;
    setSnackbar({ text: error, modal: true, type: "error" });
  }

  // if invite SPM directly from admin 7365 module
  if (verification.value.site) {
    try {
      const result = await inviteAndCollab({
        serviceProvider: verification.value.serviceProvider,
        site: verification.value.site,
        email: verification.value.email,
      });
    } catch (error) {}

    const result = await createSiteCollab({
      serviceProvider: verification.value.serviceProvider,
      site: verification.value.site,
      status: "pending",
    });
  }
}
</script>
