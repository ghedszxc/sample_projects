<template>
  <v-row no-gutters justify="center" class="py-8">
    <v-col cols="11" col="6" class="font-weight-light mt-4">
      <v-card
        width="100%"
        elevation="0"
        style="border-width: thin"
      >
        <v-form v-model="validProfile" @submit.prevent="submit()">
          <v-row no-gutters class="pa-8" justify="center">
            <v-col
              cols="12"
              class="text-h4 font-weight-bold mb-7 text-capitalize"
              style="letter-spacing: 2px !important"
            >
              Update Password
            </v-col>

            <v-col>
              <span class="font-weight-bold">Current Password</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="currentPassword"
                density="comfortable"
                clearable
                :append-inner-icon="
                  showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'
                "
                :rules="[requiredInput, minPasswordLength]"
                :type="showCurrentPassword ? 'text' : 'password'"
                name="input-10-2"
                hint="At least 8 characters"
                class="input-group--focused"
                @click:append-inner="showCurrentPassword = !showCurrentPassword"
              ></v-text-field>
            </v-col>

            <v-col>
              <span class="font-weight-bold">New Password</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="newPassword"
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
                  :disabled="!validProfile"
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
  middleware: "secure",
});

const { requiredInput, minPasswordLength } = useUtils();
const { currentUser, validProfile, updatePassword } = useLocalAuth();

const currentPassword = ref("");
const showCurrentPassword = ref(false);
const newPassword = ref("");
const showNewPassword = ref(false);

function goBack() {
  useRouter().back();
}

async function cancel() {
  goBack();
}

async function submit() {
  await updatePassword({
    _id: currentUser.value._id,
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
  });
  goBack();
}
</script>
