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
              Update Name
            </v-col>

            <v-col>
              <span class="font-weight-bold">Given Name</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="profile.givenName"
                density="comfortable"
                :rules="[requiredInput]"
                clearable
              ></v-text-field>
            </v-col>

            <v-col>
              <span class="font-weight-bold">Middle Name</span>
              <span class="text-red mx-1 mb-2"></span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="profile.middleName"
                density="comfortable"
                hint="This field is optional"
                clearable
              ></v-text-field>
            </v-col>

            <v-col>
              <span class="font-weight-bold">Surname</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-8">
              <v-text-field
                v-model="profile.surname"
                density="comfortable"
                :rules="[requiredInput]"
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

const { requiredInput } = useUtils();
const { currentUser, profile, validProfile, updateName } = useLocalAuth();

onMounted(() => {
  profile.value = JSON.parse(JSON.stringify(currentUser.value));
});

function goBack() {
  useRouter().back();
}

async function cancel() {
  goBack();
}

async function submit() {
  await updateName({
    _id: profile.value._id,
    givenName: profile.value.givenName,
    middleName: profile.value.middleName,
    surname: profile.value.surname,
  });
  goBack();
}
</script>
