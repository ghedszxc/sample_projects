<template>
  <v-row no-gutters justify="center" class="py-8">
    <v-col cols="6" class="font-weight-light mt-4">
      <v-card
        width="100%"
        elevation="0"
        style="border-width: thin"
        min-height="368px"
      >
        <v-form v-model="isSiteValid" @submit.prevent="submit()">
          <v-row no-gutters class="pa-8" justify="center">
            <v-col
              cols="12"
              class="text-h4 font-weight-bold mb-7 text-capitalize"
              style="letter-spacing: 2px !important"
            >
              Add Site
            </v-col>

            <v-col>
              <div class="text-subtitle-1 text-medium-emphasis">
                Site Name <span class="text-red">*</span>
              </div>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="site.name"
                density="comfortable"
                placeholder="Enter site name"
                :rules="[noSpecialCharacters, requiredInput]"
                :persistent-hint="false"
                clearable
              ></v-text-field>
            </v-col>

            <v-col>
              <div class="text-subtitle-1 text-medium-emphasis">
                Email <span class="text-red">*</span>
              </div>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="payload.email"
                density="comfortable"
                :rules="[requiredInput, validEmail]"
                placeholder="Enter valid email"
                :persistent-hint="false"
                clearable
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <div class="text-subtitle-1 text-medium-emphasis">
                Contact Number <span class="text-red">*</span>
              </div>
            </v-col>

            <v-col cols="4" class="mb-4 pr-2">
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
            <v-col cols="8" clas="mb-4">
              <v-text-field
                v-model="primaryPhone"
                label="Phone Number"
                hide-details
                density="comfortable"
                :rules="[requiredInput]"
                @input="filterNumericInput"
              ></v-text-field>
            </v-col>

            <v-col>
              <div class="text-subtitle-1 text-medium-emphasis">
                Site Personnel Name <span class="text-red">*</span>
              </div>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="payload.givenName"
                density="comfortable"
                :rules="[requiredInput]"
                placeholder="Enter owner first name"
                :persistent-hint="false"
                clearable
              ></v-text-field>
            </v-col>

            <v-col>
              <div class="text-subtitle-1 text-medium-emphasis">
                Site Personnel Last Name <span class="text-red">*</span>
              </div>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="payload.surname"
                density="comfortable"
                :rules="[requiredInput]"
                placeholder="Enter owner last name"
                :persistent-hint="false"
                clearable
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-row no-gutters>
                <v-btn
                  theme="dark"
                  class="font-weight-bold"
                  :disabled="!isSiteValid"
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
const { requiredInput, validEmail, noSpecialCharacters } = useUtils();
const { site, addSite, setSite, isSiteValid, addSiteWithSendInvite } =
  useSite();
const { setSnackbar } = useLocal();

const prefix = ref("+65");
const primaryPhone = ref("");
const fullPhoneNumber = ref("");
const filterNumericInput = (event) => {
  const value = event.target.value;
  primaryPhone.value = value.replace(/\D/g, "");
};
watch([prefix, primaryPhone], ([newPrefix, newPrimaryPhone]) => {
  if (!newPrefix || !newPrimaryPhone) {
    fullPhoneNumber.value = ""; // Handle null or undefined values
  } else {
    fullPhoneNumber.value = `${newPrefix}${newPrimaryPhone}`;
  }
  // Update the contact information in props
  site.value.contactNumber = fullPhoneNumber.value;
});

const isLoading = ref(false);
const payload = ref({
  givenName: "",
  surname: "",
  email: "",
  type: "site",
  organization: "",
  site: "",
} as TSignUpForm);

const organization = computed(() => useRoute().params.organization as string);

onMounted(() => {
  setSite();
  site.value.organization = organization.value;
});

async function submit() {
  isLoading.value = true;
  try {
    site.value.email = payload.value.email;
    site.value.organization = organization.value;
    const result = await addSiteWithSendInvite(site.value, {
      ...payload.value,
      organization: organization.value,
    });
    setSnackbar({ text: result.message, modal: true, type: "success" });
    goBack();
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  } finally {
    isLoading.value = false;
  }
}

function goBack() {
  useRouter().back();
}

async function cancel() {
  setSite();
  goBack();
}
</script>
