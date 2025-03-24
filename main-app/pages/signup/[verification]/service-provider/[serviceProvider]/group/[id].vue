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
                  <span class="font-weight-bold">Given Name </span>
                  <span class="text-red mx-1 mb-2">*</span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-text-field
                    v-model="form.givenName"
                    :rules="[requiredInput]"
                    type="text"
                    name="input-10-2"
                    label=""
                    class="input-group--focused"
                  ></v-text-field>
                </v-col>

                <v-col class="mb-2">
                  <span class="font-weight-bold"> Surname </span>
                  <span class="text-red mx-1 mb-2">*</span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-text-field
                    v-model="form.surname"
                    type="text"
                    name="input-10-2"
                    class="input-group--focused"
                  ></v-text-field>
                </v-col>

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
                    :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[requiredInput, passwordsMatch]"
                    :type="show ? 'text' : 'password'"
                    name="input-10-2"
                    autocomplete="new-password"
                    label="Confirm Password"
                    class="input-group--focused"
                    @click:append-inner="showConfirm = !showconfirm"
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
import ConfirmPassword from "~/components/dob/entry/ConfirmPassword.vue";

definePageMeta({
  layout: "plain",
});

const valid = ref(false);
const show = ref(false);
const showConfirm = ref(false);

const form = ref({
  givenName: "",
  surname: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const emailVerified = ref(true);
const isFormValid = ref(false);
const verification = ref({
  _id: "",
  userType: "",
} as { _id: string; userType?: string } | undefined);

const { requiredInput, validEmail, minPasswordLength } = useUtils();
const { createMembertoGroup, getVerificationById } = useLocalAuth();
const { inviteAndCollab } = useServiceProvider();
const { setSnackbar } = useLocal();
const route = useRoute();

const passwordsMatch = (value: string) => {
  return value === form.value.password || "Passwords do not match";
};

onMounted(async () => {
  verification.value = await getVerificationById(
    String(route.params.verification)
  );
  form.value.email = verification.value.email;
});

async function verify() {
  try {
    await createMembertoGroup({
      givenName: form.value.givenName,
      surname: form.value.surname,
      email: form.value.email,
      password: form.value.password,
      type: "service-provider-member",
      serviceProvider: route.params.serviceProvider,
      serviceProviderGroup: route.params.id,
      verification: route.params.verification,
      isAdmin: false,
    });
    valid.value = true;
  } catch (error: any) {
    valid.value = false;
    setSnackbar({ text: error, modal: true, type: "error" });
  }
}
</script>
