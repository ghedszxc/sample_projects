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
              <span class="font-weight-bold">Email</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="form.email"
                density="comfortable"
                :rules="[requiredInput, validEmail]"
                clearable
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

<script setup lang="ts">
definePageMeta({
  middleware: "guest",
  layout: "plain",
});

const { requiredInput, validEmail } = useUtils();
const valid = ref(false);
const form = ref({
  givenName: "",
  surname: "",
  email: "",
  password: "",
});

const { setSnackbar } = useLocal();

async function submit(form: any) {
  try {
    await $fetch(`/api/auth/users/forgot-password`, {
      method: "POST",
      body: form,
    });

    setSnackbar({
      text: "Password reset email sent.",
      modal: true,
      type: "success",
    });

    setTimeout(() => {
      useRouter().push({ name: "login" });
    }, 2000);
  } catch (error: any) {
    setSnackbar({
      text: error.data.message,
      modal: true,
      type: "error",
    });
  }
}

function cancel() {
  useRouter().push({ name: "login" });
}
</script>
