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
                  Account Verification
                </v-col>

                <v-col class="mb-2">
                  <span class="font-weight-bold"> Set Password </span>
                  <span class="text-red mx-1 mb-2">*</span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-text-field
                    v-model="password"
                    :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[requiredInput, minPasswordLength]"
                    :type="show ? 'text' : 'password'"
                    name="input-10-2"
                    label="Password"
                    hint="At least 8 characters"
                    class="input-group--focused"
                    @click:append-inner="show = !show"
                  ></v-text-field>
                </v-col>

                <v-col class="mb-2">
                  <span class="font-weight-bold"> Confirm Password </span>
                  <span class="text-red mx-1 mb-2">*</span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-text-field
                    v-model="confirmPassword"
                    :append-inner-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[requiredInput, confirmPasswordMatch]"
                    :type="showConfirm ? 'text' : 'password'"
                    name="input-10-3"
                    label="Confirm Password"
                    class="input-group--focused"
                    @click:append-inner="showConfirm = !showConfirm"
                  ></v-text-field>
                </v-col>

                <div
                  v-if="
                    verification &&
                    /^(resident)$/i.test(verification.userType || '')
                  "
                >
                  <v-col
                    cols="12"
                    class="text-h4 font-weight-bold mb-7 text-capitalize pt-2"
                    style="letter-spacing: 2px !important"
                  >
                    Vehicle Registration
                  </v-col>
                  <v-col class="mb-2">
                    <span class="font-weight-bold">
                      Add Vehicle Vehicle Number
                    </span>
                    <span class="text-primary mx-1 mb-2">(Optional)</span>
                  </v-col>
                  <v-col cols="12" class="mb-4">
                    <v-text-field
                      v-model="plateNumber"
                      label="Vehicle Number"
                      hint="Please add your vehicle Vehicle Number to whitelist"
                    ></v-text-field>
                  </v-col>
                </div>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-btn
                      theme="dark"
                      class="font-weight-bold"
                      :disabled="!isFormValid"
                      type="submit"
                    >
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
const valid = ref(false);
const show = ref(false);
const showConfirm = ref(false);
const password = ref("");
const confirmPassword = ref("");
const plateNumber = ref("");
const emailVerified = ref(true);
const isFormValid = ref(false);
const verification = ref({
  _id: "",
  userType: "",
} as { _id: string; userType?: string } | undefined);

const { requiredInput, minPasswordLength } = useUtils();
const { signUpVerification, getVerificationById } = useLocalAuth();
const { setSnackbar } = useLocal();
const route = useRoute();

const confirmPasswordMatch = (value: string) =>
  value === password.value || "Passwords do not match";

onMounted(async () => {
  // Show the Vehicle Number input only for user.type === 'resident'
  verification.value = await getVerificationById(String(route.params.id));
});

async function verify() {
  if (password.value !== confirmPassword.value) {
    setSnackbar({ text: "Passwords do not match", modal: true, type: "warning" });
    return;
  }

  try {
    await signUpVerification(
      {
        password: password.value,
        plateNumber: plateNumber.value,
        emailVerified: emailVerified.value,
      },
      String(route.params.id)
    );
    valid.value = true;
  } catch (error: any) {
    valid.value = false;
    setSnackbar({ text: error, modal: true, type: "error" });
  }
}
</script>
