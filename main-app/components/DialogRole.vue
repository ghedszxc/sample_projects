<template>
  <v-dialog v-model="isDialogVisible" max-width="400">
    <v-card :loading="isRoleLoading">
      <v-toolbar>
        <v-toolbar-title>Roles</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="hideModal"></v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text>
        <search-text-field
          @on-search="onSearch($event)"
          @clear-search="callItBack"
        ></search-text-field>
      </v-card-text>

      <v-divider></v-divider>
      <v-list class="px-3">
        <template v-for="role in roles" :key="role._id">
          <v-list-item>
            <div class="d-flex justify-space-between align-center w-full">
              <v-list-item-title>{{ role?.roleName }}</v-list-item-title>
              <v-checkbox
                color="success"
                hide-details
                v-model="selectedAssignedRole"
                :value="role._id"
              ></v-checkbox>
            </div>
          </v-list-item>
        </template>
      </v-list>
      <v-divider></v-divider>
      <v-col cols="auto" class="text-right">
        <v-btn color="#1867C0" class="mx-3" @click="confirmSelection">
          Confirm
        </v-btn>
      </v-col>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const { getSitesOptionsForFiltering, siteOptions, filterSite, mySite, myOrg } =
  useFilter();

const errMsg = ref("");
const loading = ref(false);

const { roles, searchRole, setRole, setRoles, isRoleLoading } = useRole();

const emit = defineEmits(["confirmSelect", "closeModal"]);
let props = defineProps({
  isConfirmTitle: {
    type: String,
  },
  isConfirmModal: {
    type: Boolean,
    default: false,
  },
  roleSet: {
    type: Object,
  },
});

watch(
  () => props.roleSet,
  (newValue, oldValue) => {
    selectedAssignedRole.value = newValue.role;
  },
);
const thisistheway = ref(false);
const selectedAssignedRole = ref<any>([]);

const isDialogVisible = computed(() => props.isConfirmModal);

const onSearch = async (_search: string) => {
  searchRole.value = _search;
  await setRoles({
    page: 1,
    limit: 10000,
    organization: currentUser.value.type === "admin" ? "" : myOrg.value,
    site: currentUser.value.type === "admin" ? "" : mySite.value,
    userId: currentUser.value.type === "admin" ? "" : currentUser.value._id,
  });
};

const callItBack = async () => {
  searchRole.value = "";
  await setRoles({
    page: 1,
    limit: 10000,
    organization: currentUser.value.type === "admin" ? "" : myOrg.value,
    site: currentUser.value.type === "admin" ? "" : mySite.value,
    userId: currentUser.value.type === "admin" ? "" : currentUser.value._id,
  });
};

const hideModal = () => {
  emit("closeModal", false);
};
const confirmSelection = async () => {
  if (selectedAssignedRole.value) {
    const _role = roles.value.find(
      (item) => item._id == selectedAssignedRole.value,
    );
    emit("confirmSelect", _role);
  } else {
    setSnackbar({
      text: "Please select a role before confirming.",
      modal: true,
      type: "warning",
    });
  }
};
</script>
