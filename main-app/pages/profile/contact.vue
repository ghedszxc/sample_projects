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
              Update Mobile Number
            </v-col>

            <v-col>
              <span class="font-weight-bold">Contact Number</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="4">
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
                      <v-chip color="primary">{{ item.raw.country }}</v-chip>
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
import phoneCode from "@/components/phone-code.json";
const prefixes = phoneCode;
const { requiredInput } = useUtils();
const { currentUser, profile, validProfile, updateMobilePhone } =
  useLocalAuth();

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
  profile.value.primaryPhone = fullPhoneNumber.value;
});
const filterNumericInput = (event) => {
  const value = event.target.value;
  primaryPhone.value = value.replace(/\D/g, "");
};
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
  await updateMobilePhone({
    _id: profile.value._id,
    mobilePhone: profile.value.mobilePhone,
  });
  goBack();
}
</script>
