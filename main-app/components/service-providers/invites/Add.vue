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
    <v-card class="h-100">
      <v-toolbar>
        <v-btn icon="mdi-arrow-left" @click="hideModal"></v-btn>
        <v-toolbar-title>Service Provider</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="hideModal"></v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text>
        <v-row class="h-100 align-center">
          <v-form
            v-model="isServiceProviderValid"
            @submit.prevent="submit"
            class="w-100"
          >
            <v-col cols="12">
              <v-row class="justify-center mb-7">
                <v-img
                  :src="'/images/service_provider/invite.svg'"
                  width="190px"
                  height="190px"
                ></v-img>
              </v-row>

              <v-responsive class="mx-auto">
                <v-col cols="12">
                  <div class="text-subtitle-1 text-medium-emphasis">Email</div>

                  <v-text-field
                    v-model="email"
                    density="comfortable"
                    :rules="[requiredInput, validEmail]"
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Role and Permission
                  </div>

                  <v-select
                    v-model="role"
                    :items="roles"
                    item-title="roleName"
                    item-value="_id"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    hide-details
                    class="mb-8"
                    :rules="[requiredInput]"
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
                </v-col>

                <v-col cols="12" class="mb-2">
                  <v-btn
                    color="#1867C0"
                    :disabled="!isServiceProviderValid"
                    type="submit"
                    :loading="isServiceProviderLoading"
                    class="py-4 w-100 rounded-lg"
                    height="52px"
                  >
                    Invite
                  </v-btn>
                </v-col>
              </v-responsive>
            </v-col>
          </v-form>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
let props = defineProps({
  isConfirmModal: {
    type: Boolean,
    default: false,
  },
});
const { requiredInput, validEmail } = useUtils();

const {
  setServiceProvider,
  serviceProviders,
  serviceProvider,
  setServiceProviders,
  search,
  pageRange,
  canNextPage,
  canPrevPage,
  nextPage,
  isServiceProviderLoading,
  isServiceProviderValid,
  prevPage,
  addServiceProvider,
} = useServiceProvider();

const { currentUser } = useLocalAuth();
const { roles, searchRole, setRoles, isRoleLoading } = useRole();

const email = ref("");
const role = ref("");

const isDialogVisible = computed(() => props.isConfirmModal);
const emit = defineEmits(["submitData", "closeModal"]);
const hideModal = () => {
  emit("closeModal", false);
};

const submit = () => {
  emit("submitData", { email: email.value.toLowerCase(), role: role.value });
  // emit("submitData", email.value.toLowerCase());
};

onMounted(async () => {
  await setRoles({
    page: 1,
    limit: 10000,
    userId: currentUser.value.type === "admin" ? "" : currentUser.value._id,
  });
});

const onSearch = async (_search: string) => {
  searchRole.value = _search;
  await setRoles({
    page: 1,
    limit: 10000,
    userId: currentUser.value.type === "admin" ? "" : currentUser.value._id,
  });
};

const callItBack = async () => {
  searchRole.value = "";
  await setRoles({
    page: 1,
    limit: 10000,
    userId: currentUser.value.type === "admin" ? "" : currentUser.value._id,
  });
};
</script>
