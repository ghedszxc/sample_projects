<template>
  <v-row no-gutters justify="center" class="py-8">
    <v-col cols="11" col="6" class="font-weight-light mt-4">
      <v-card
        width="100%"
        elevation="0"
        style="border-width: thin"
        min-height="368px"
      >
        <v-form v-model="validProfile" @submit.prevent="submit()">
          <v-row no-gutters class="pa-8" justify="center">
            <v-col
              cols="12"
              class="text-h4 font-weight-bold mb-7 text-capitalize"
              style="letter-spacing: 2px !important"
            >
              Update Address
            </v-col>

            <v-col>
              <span class="font-weight-bold">Country/Region</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="profile.address.country"
                density="comfortable"
                :rules="[requiredInput]"
                clearable
              ></v-text-field>
            </v-col>

            <v-col>
              <span class="font-weight-bold">Address 1</span>
              <span class="text-red mx-1 mb-2"></span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="profile.address.address1"
                density="comfortable"
                hint="This field is optional"
                clearable
              ></v-text-field>
            </v-col>

            <v-col>
              <span class="font-weight-bold">Address 2</span>
              <span class="text-red mx-1 mb-2"></span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="profile.address.address2"
                density="comfortable"
                hint="This field is optional"
                clearable
              ></v-text-field>
            </v-col>

            <v-col>
              <span class="font-weight-bold">City</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="profile.address.city"
                density="comfortable"
                hint="This field is optional"
                clearable
                :rules="[requiredInput]"
              ></v-text-field>
            </v-col>

            <v-col>
              <span class="font-weight-bold">Province</span>
              <span class="text-red mx-1 mb-2"></span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="profile.address.province"
                density="comfortable"
                hint="This field is optional"
                clearable
              ></v-text-field>
            </v-col>

            <v-col>
              <span class="font-weight-bold">Postal Code</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-8">
              <v-text-field
                v-model="profile.address.postalCode"
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
const { currentUser, profile, validProfile, updateAddress } = useLocalAuth();

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
  await updateAddress({
    _id: profile.value._id,
    address: profile.value.address,
  });
  goBack();
}
</script>
