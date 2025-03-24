<template>
  <v-row no-gutters justify="center" class="py-lg-8">
    <v-col cols="12" xxl="4" xl="4" lg="5" class="font-weight-light mt-lg-4">
      <v-card width="100%" elevation="0" style="border-width: thin">
        <v-form v-model="isOrganizationValid" @submit.prevent="submit()">
          <v-row no-gutters justify="center">
            <v-col cols="12" class="pa-4">
              <v-row no-gutters class="fill-height" align-content="center">
                <v-btn
                  fav
                  density="compact"
                  icon="mdi-arrow-left"
                  variant="text"
                  class="mt-1"
                  :to="{ name: 'organizations' }"
                ></v-btn>
                <span
                  class="ml-2 text-h6 font-weight-bold text-capitalize"
                  style="letter-spacing: 2px !important"
                >
                  Organizations
                </span>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>

            <v-col cols="12">
              <v-row no-gutters class="pa-8">
                <v-col cols="12" class="mb-8">
                  <v-img src="/organization-add.svg" height="150px"></v-img>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Organization Name <span class="text-red">*</span>
                  </div>
                  <v-text-field
                    v-model="organization.name"
                    density="comfortable"
                    placeholder="Enter organization name"
                    :rules="[requiredInput]"
                    :persistent-hint="false"
                    clearable
                  ></v-text-field>

                  <div class="text-subtitle-1 text-medium-emphasis">
                    Email <span class="text-red">*</span>
                  </div>
                  <v-text-field
                    v-model="payload.email"
                    density="comfortable"
                    :rules="[requiredInput, validEmail]"
                    placeholder="Enter valid email"
                    :persistent-hint="false"
                    clearable
                  ></v-text-field>

                  <div class="text-subtitle-1 text-medium-emphasis">
                    Contact Number <span class="text-red">*</span>
                  </div>
                  <v-row>
                    <v-col cols="5" lg="5" class="pr-2">
                      <v-select
                        v-model="prefix"
                        :items="prefixes"
                        item-title="country"
                        item-value="dial_code"
                        hide-details
                        menu-icon="mdi-chevron-down"
                        chips
                        density="comfortable"
                        :rules="[requiredInput]"
                      >
                        <template v-slot:chip="{ props, item }">
                          <v-row no-gutters v-bind="props">
                            <v-col cols="5">
                              <v-avatar
                                size="20"
                                :image="item.raw.flag"
                                class="mr-3"
                              ></v-avatar>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="7">
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
                    <v-col cols="7" lg="7">
                      <v-text-field
                        v-model="primaryPhone"
                        label="Phone Number"
                        hide-details
                        density="comfortable"
                        :rules="[requiredInput]"
                        @input="filterNumericInput"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <div class="text-subtitle-1 text-medium-emphasis">
                    Owner First Name <span class="text-red">*</span>
                  </div>
                  <v-text-field
                    v-model="payload.givenName"
                    density="comfortable"
                    :rules="[requiredInput]"
                    placeholder="Enter owner first name"
                    :persistent-hint="false"
                    clearable
                  ></v-text-field>

                  <div class="text-subtitle-1 text-medium-emphasis">
                    Owner Last Name <span class="text-red">*</span>
                  </div>
                  <v-text-field
                    v-model="payload.surname"
                    density="comfortable"
                    :rules="[requiredInput]"
                    placeholder="Enter owner last name"
                    :persistent-hint="false"
                    clearable
                  ></v-text-field>
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Role and Permission <span class="text-red">(Optional)</span>
                  </div>
                  <v-select
                    v-model="payload.role"
                    :items="roles"
                    item-title="roleName"
                    item-value="_id"
                    variant="outlined"
                    clearable
                    hide-details
                    class="mb-8"
                  >
                    <template v-slot:prepend-item>
                      <v-card-text>
                        <search-text-field
                          @on-search="onSearch($event)"
                          @clear-search="callItBack"
                        ></search-text-field>
                      </v-card-text>
                      <v-divider class="mt-2"></v-divider>
                    </template>
                  </v-select>

                  <div class="text-subtitle-1 text-medium-emphasis">
                    Upload Logo <span class="text-blue">(Optional)</span>
                  </div>
                  <v-file-input
                    v-model="files"
                    accept="image/png, image/jpeg"
                    label="Upload your logo"
                    placeholder="Pick an avatar"
                    prepend-icon="mdi-image"
                  ></v-file-input>
                </v-col>

                <v-col cols="12">
                  <v-row no-gutters>
                    <v-btn
                      block
                      class="font-weight-bold"
                      :disabled="!isOrganizationValid"
                      type="submit"
                      color="primary"
                      size="large"
                      :loading="isLoading"
                    >
                      submit
                    </v-btn>
                  </v-row>
                </v-col>
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

import phoneCode from "@/components/old-phone-code.json";
const prefixes = phoneCode;

const { requiredInput, validEmail, selectedCountryCode, countryCodes } =
  useUtils();
const {
  organization,
  addOrganizationWithSendInvite,
  setOrganization,
  isOrganizationValid,
} = useOrganization();
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const { roles, searchRole, setRoles } = useRole();

const prefix = ref("+65");
const primaryPhone = ref("");
const fullPhoneNumber = ref("");
const selectedRoles = ref<string[]>([]);
const roleSearch = ref("");

watch([prefix, primaryPhone], ([newPrefix, newPrimaryPhone]) => {
  if (!newPrefix || !newPrimaryPhone) {
    fullPhoneNumber.value = ""; // Handle null or undefined values
  } else {
    fullPhoneNumber.value = `${newPrefix}${newPrimaryPhone}`;
  }
  // Update the contact information in props
  organization.value.contactNumber = fullPhoneNumber.value;
});
const filterNumericInput = (event) => {
  const value = event.target.value;
  primaryPhone.value = value.replace(/\D/g, "");
};
const isLoading = ref(false);
const files = ref<File[]>([]);
const payload = ref({
  givenName: "",
  surname: "",
  email: "",
  type: "organization",
  organization: "",
  isAdmin: true,
  role: "",
} as any);

onMounted(() => {
  setOrganization();
});

type TFile = {
  name: string;
  data: File;
  progress: number;
  id?: string;
};
const logo = ref<TFile[]>([]);
async function submit() {
  isLoading.value = true;
  try {
    if (files.value.length > 0) {
      files.value.forEach((file) => {
        logo.value.push({
          name: file.name,
          data: file,
          progress: 0,
        });
      });

      for (let i = 0; i < logo.value.length; i++) {
        const formData = new FormData();
        formData.append("file", logo.value[i].data);

        let id = (await uploadFile(formData)) as string;

        if (!organization.value.logo) throw new Error("Logo is undefined!");
        organization.value.logo.id = id;
      }
    }

    if (files.value.length > 0) {
      if (!organization.value.logo) throw new Error("Logo is undefined!");
      organization.value.logo.name = files.value[0].name;
    }
    organization.value.email = payload.value.email;
    organization.value.isAdmin = true;
    organization.value.contactNumber = `${selectedCountryCode.value} ${organization.value.contactNumber}`;
    if (currentUser.value && currentUser.value.type === "service-provider") {
      console.log(currentUser.value._id);
      organization.value.createdBySpId = currentUser.value._id;
    }

    const result = await addOrganizationWithSendInvite(
      organization.value,
      payload.value,
    );
    setSnackbar({ text: result.message, modal: true });
    goBack();
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await setRoles({
    userId: currentUser.value.type === "admin" ? "" : currentUser.value._id,
    page: 1,
    limit: 10000,
  });
});
const onSearch = async (_search: string) => {
  searchRole.value = _search;
  await setRoles({
    userId: currentUser.value.type === "admin" ? "" : currentUser.value._id,
    page: 1,
    limit: 10000,
  });
};

const callItBack = async () => {
  searchRole.value = "";
  await setRoles({
    userId: currentUser.value.type === "admin" ? "" : currentUser.value._id,
    page: 1,
    limit: 10000,
  });
};

function uploadFile(
  formData?: XMLHttpRequestBodyInit | Document | null | undefined,
) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/files/upload?status=draft");

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.id);
      } else {
        reject(new Error("Upload failed"));
      }
    };

    xhr.send(formData);
  });
}

function goBack() {
  useRouter().back();
}
</script>
