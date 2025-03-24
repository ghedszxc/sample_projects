<template>
  <v-dialog
    v-model="isDialogVisible"
    transition="dialog-right-transition"
    fullscreen
    :style="
      $vuetify.display.smAndDown
        ? 'margin-left: auto; margin-right: 0; max-width: 100%;'
        : 'margin-left: auto; margin-right: 0; max-width: 28rem;'
    "
  >
    <v-card class="h-100">
      <v-toolbar>
        <v-btn icon="mdi-arrow-left" @click="hideModal"></v-btn>
        <v-toolbar-title>Add Site </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="hideModal"></v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text>
        <v-row no-gutters justify="center">
          <v-form v-model="isSiteValid" @submit.prevent="submit()">
            <v-row class="justify-center my-10">
              <v-img
                src="/images/invite/invite-site.svg"
                width="190px"
                height="190px"
              ></v-img>
            </v-row>
            <v-row no-gutters class="pa-8" justify="center">
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col>
                    <div class="text-subtitle-1 text-medium-emphasis">
                      Site Name <span class="text-red">*</span>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="site.name"
                      density="comfortable"
                      placeholder="Enter site name"
                      :rules="[requiredInput, noSpecialCharacters]"
                      clearable
                      :persistent-hint="false"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col>
                    <div class="text-subtitle-1 text-medium-emphasis">
                      Site Category <span class="text-red">*</span>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="siteCategories"
                      v-model="site.siteCategory"
                      density="comfortable"
                      placeholder="Select site category"
                      :rules="[requiredInput]"
                      :persistent-hint="false"
                      clearable
                    ></v-select>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-row no-gutters>
                  <v-col class="pr-2">
                    <div class="text-subtitle-1 text-medium-emphasis">
                      First Name <span class="text-red">*</span>
                    </div>
                    <v-text-field
                      v-model="payload.givenName"
                      density="comfortable"
                      :rules="[requiredInput]"
                      placeholder="Owner F.N"
                      :persistent-hint="false"
                      clearable
                    ></v-text-field>
                  </v-col>

                  <v-col class="pl-2">
                    <div class="text-subtitle-1 text-medium-emphasis">
                      Last Name <span class="text-red">*</span>
                    </div>
                    <v-text-field
                      v-model="payload.surname"
                      density="comfortable"
                      :rules="[requiredInput]"
                      placeholder="Owner L.N"
                      :persistent-hint="false"
                      clearable
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-row no-gutters>
                  <v-col>
                    <div class="text-subtitle-1 text-medium-emphasis">
                      Email <span class="text-red">*</span>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="payload.email"
                      density="comfortable"
                      :rules="[requiredInput, validEmail]"
                      placeholder="Enter valid email"
                      :persistent-hint="false"
                      clearable
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>

              <v-row no-gutters>
                <v-col cols="12">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Contact Number <span class="text-red">*</span>
                  </div>
                </v-col>
                <v-col cols="6" lg="5" class="mb-4 pr-2">
                  <v-select
                    v-model="prefix"
                    :items="prefixes"
                    item-title="country"
                    item-value="dial_code"
                    hide-details
                    menu-icon="mdi-chevron-down"
                    chips
                    density="comfortable"
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
                <v-col cols="6" lg="7" class="mb-4">
                  <v-text-field
                    v-model="primaryPhone"
                    label="Phone Number"
                    hide-details
                    density="comfortable"
                    @input="filterNumericInput"
                    :rules="[requiredInput]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-col cols="12">
                <v-btn
                  color="#1867C0"
                  :disabled="!isSiteValid"
                  type="submit"
                  class="py-4 w-100 rounded-lg mt-4"
                  height="52px"
                  :loading="isSiteLoadingBtn"
                >
                  Send Invite
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import phoneCode from "../old-phone-code.json";
const prefixes = phoneCode;
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const { requiredInput, validEmail, noSpecialCharacters } = useUtils();
const {
  site,
  addSite,
  setSite,
  isSiteValid,
  addSiteWithSendInvite,
  isSiteLoadingBtn,
} = useSite();

const emit = defineEmits(["submit", "closeModal"]);
const selectedRoles = ref<string[]>([]);
const roleSearch = ref("");
const siteCategories = ref<string[]>([
  "Commercial",
  "Residential",
  "Mix Development",
  "Industrial",
]);

const { roles, searchRole, setRoles } = useRole();
const { getSitesOptionsForFiltering, siteOptions, filterSite, mySite } =
  useFilter();

const payload = ref({
  givenName: "",
  surname: "",
  email: "",
  type: "site",
  organization: "",
  serviceProvider: "",
  site: "",
} as TSignUpForm);

let props = defineProps({
  isConfirmTitle: {
    type: String,
  },
  isConfirmModal: {
    type: Boolean,
    default: false,
  },
});

const isDialogVisible = computed(() => props.isConfirmModal);

const organization = computed(() => useRoute().params.organization as string);

onMounted(() => {
  setSite();
  site.value.organization = organization.value;
});

const hideModal = () => {
  emit("closeModal", false);
};
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
  site.value.contactNumber = fullPhoneNumber.value;
});
const filterNumericInput = (event) => {
  const value = event.target.value;
  primaryPhone.value = value.replace(/\D/g, "");
};
const onSearch = async (_search: string) => {
  searchRole.value = _search;
  await setRoles({
    organization: currentUser.value.organization,
    site: mySite.value,
    userId: currentUser.value._id,
  });
};

const callItBack = async () => {
  searchRole.value = "";
  await setRoles({
    organization: currentUser.value.organization,
    site: mySite.value,
    userId: currentUser.value._id,
  });
};

function submit() {
  if (["service-provider"].includes(currentUser.value.type)) {
    site.value.organization = "";
    site.value.serviceProvider = organization.value;
    payload.value.serviceProvider = organization.value;
  } else {
    site.value.organization = organization.value;
    payload.value.organization = organization.value;
  }

  payload.value.isAdmin = true;

  emit("submit", {
    site: site.value,
    payload: payload.value,
  });
}
</script>
