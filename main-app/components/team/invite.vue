<template>
  <v-dialog
    v-model="isDialogVisible"
    transition="dialog-right-transition"
    fullscreen
    :style="{
      'margin-left': 'auto',
      'margin-right': '0',
      'max-width': '551px',
    }"
  >
    <v-card class="">
      <v-toolbar>
        <v-toolbar-title>Invite Team</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="hideModal"></v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text>
        <v-row class="h-100 align-center">
          <v-form
            v-model="isInviteValid"
            @submit.prevent="submit()"
            class="w-100"
          >
            <v-col cols="12">
              <v-row class="justify-center mb-10">
                <v-img
                  src="/images/undraw_team_page.svg"
                  width="190px"
                  height="190px"
                ></v-img>
              </v-row>

              <v-responsive class="mx-auto">
                <v-row>
                  <v-col>
                    <div class="text-subtitle-1 text-medium-emphasis">
                      First Name
                    </div>
                    <v-text-field
                      v-model="user.givenName"
                      density="comfortable"
                      hint=""
                      placeholder="Enter given name"
                      :rules="[requiredInput]"
                      :persistent-hint="false"
                    >
                    </v-text-field>
                  </v-col>

                  <v-col>
                    <div class="text-subtitle-1 text-medium-emphasis">
                      Last Name
                    </div>
                    <v-text-field
                      v-model="user.surname"
                      density="comfortable"
                      hint=""
                      placeholder="Enter surname name"
                      :rules="[requiredInput]"
                      :persistent-hint="false"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>

                <div class="text-subtitle-1 text-medium-emphasis">
                  Email Address
                </div>
                <v-text-field
                  v-model="user.email"
                  density="comfortable"
                  hint=""
                  placeholder="Enter email address"
                  class="mb-2"
                  :rules="[requiredInput, validEmail]"
                  :persistent-hint="false"
                >
                </v-text-field>

                <v-select
                  v-model="user.role"
                  label="Roles and Permission (Optional)"
                  :items="roles"
                  item-title="roleName"
                  item-value="_id"
                  variant="outlined"
                  clearable
                  hide-details
                  class="mb-8"
                  :loading="isRoleLoading"
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
                <v-btn
                  color="#1867C0"
                  :disabled="!isInviteValid"
                  type="submit"
                  class="py-4 w-100 rounded-lg"
                  height="52px"
                  :loading="isSendInvite"
                >
                  Send Invite
                </v-btn>
              </v-responsive>
            </v-col>
          </v-form>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const { requiredInput, validEmail } = useUtils();

const emit = defineEmits(["submit", "closeModal"]);
const selectedRoles = ref<string[]>([]);
const roleSearch = ref("");
const {
  getSitesOptionsForFiltering,
  siteOptions,
  filterSite,
  mySite,
  myOrg,
  myProvider,
} = useFilter();

const { user, isInviteValid, isSendInvite } = useUser();

const { roles, searchRole, setRoles, isRoleLoading, page } = useRole();

let props = defineProps({
  isConfirmTitle: {
    type: String,
  },
  isConfirmModal: {
    type: Boolean,
    default: false,
  },
});

onMounted(async () => {
  await getAllRoles();
});

const isDialogVisible = computed(() => props.isConfirmModal);

watch(isDialogVisible, async (newValue) => {
  if (newValue) await getAllRoles();
});

const hideModal = () => {
  emit("closeModal", false);
};

const onSearch = async (_search: string) => {
  searchRole.value = _search;
  debouncedSearch(_search);
};

const debouncedSearch = debounce(async (value: string) => {
  await getAllRoles();
}, 500);

const callItBack = async () => {
  searchRole.value = "";
  await getAllRoles();
};

function submit() {
  user.value.email = user.value.email.toLowerCase();
  emit("submit", user.value);
}

async function getAllRoles() {
  page.value = 1;
  if (currentUser.value.isAdmin) {
    // seven365 admin, ma, site, spm & spt
    await setRoles({
      limit: 10000,
      organization: currentUser.value.type === "admin" ? "" : myOrg.value,
      site: currentUser.value.type === "admin" ? "" : mySite.value,
      userId: currentUser.value.type === "admin" ? "" : currentUser.value._id,
    });
  } else {
    if (currentUser.value.type === "admin") {
      // non admin
      await setRoles({
        // type: currentUser.value.type,
        limit: 10000,
      });
    } else {
      // non admin
      await setRoles({
        type: currentUser.value.type,
        site: myProvider.value ? "" : mySite.value,
        organization: mySite.value || myProvider.value ? "" : myOrg.value,
        serviceProvider: myProvider.value,
        limit: 10000,
        // userId: currentUser.value._id,
      });
    }
  }
}
</script>
