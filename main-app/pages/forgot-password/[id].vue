<template>
  <v-row
    no-gutters
    class="pa-4 fill-height"
    justify="center"
    align-content="center"
  >
    <v-col
      cols="12"
      xxl="4"
      xl="4"
      lg="4"
      md="6"
      class="font-weight-light mt-4"
    >
      <v-card width="100%" elevation="0" style="border-width: thin">
        <v-form v-model="valid" @submit.prevent="submit(form)">
          <v-row no-gutters class="pa-8" justify="center">
            <v-col
              cols="12"
              class="text-h4 font-weight-bold mb-7 text-capitalize"
              style="letter-spacing: 2px !important"
            >
              Account Recovery
            </v-col>

            <v-col>
              <span class="font-weight-bold"> Set new password </span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="form.password"
                density="comfortable"
                clearable
                :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[requiredInput, minPasswordLength]"
                :type="showNewPassword ? 'text' : 'password'"
                name="input-10-3"
                hint="At least 8 characters"
                class="input-group--focused"
                @click:append-inner="showNewPassword = !showNewPassword"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-row no-gutters>
                <v-btn
                  theme="dark"
                  class="font-weight-bold"
                  :disabled="!valid"
                  type="submit"
                >
                  submit
                </v-btn>
                <v-btn
                  variant="text"
                  class="font-weight-bold"
                  @click="cancel()"
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
</template>

<script setup>
import useUtils from "~/composables/useUtils";
const { requiredInput, minPasswordLength } = useUtils();
const valid = ref(false);
const showNewPassword = ref(false);
const form = ref({
  id: useRoute().params.id,
  password: "",
});

const { setSnackbar } = useLocal();

async function submit(form) {
  try {
    const result = await $fetch(`/api/auth/users/forgot-password`, {
      method: "PUT",
      body: form,
    });

    setSnackbar({
      text: result.message,
      modal: true, type: "success"
    });

    setTimeout(() => {
      useRouter().push({ name: "forgot-password-success" });
    }, 3000);
  } catch (error) {
    if (error && error.data && error.data.message) {
      setSnackbar({
        text: error.data.message,
        modal: true, type: "error"
      });
    }
  }
}

function cancel() {
  useRouter().push({ name: "login" });
}

definePageMeta({
  layout: "plain",
});
</script>
