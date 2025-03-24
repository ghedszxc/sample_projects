<template>
  <div>
    <div style="height: 347px; position: relative; margin-bottom: -280px">
      <v-img
        :src="`${useRuntimeConfig().public.S3_BUCKET}/images/bg/condo.jpg`"
        cover
      >
      </v-img>
    </div>
    <v-row no-gutters class="pa-6 mb-1 profile-card" justify="center">
      <v-col cols="12" md="10" xxl="10" xl="10" lg="10">
        <v-card width="100%" height="100%" class="pa-8" rounded="xl">
          <v-row no-gutters class="mb-6">
            <v-col cols="12">
              <v-row no-gutters>
                <v-col cols="12" md="6" xxl="6" xl="6" lg="6">
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="12"
                      xxl="6"
                      xl="6"
                      lg="6"
                      class="d-flex justify-center"
                    >
                      <v-sheet
                        class="rounded-circle d-flex justify-center align-center border-md"
                        height="120"
                        width="120"
                        color="#fff"
                        style="position: relative"
                      >
                        <v-avatar
                          size="32"
                          :color="readOnlyCondition ? '#ccc' : '#1C75BC'"
                          style="
                            position: absolute;
                            right: 2px;
                            top: 5px;
                            z-index: 1;
                          "
                        >
                          <v-icon
                            icon="mdi-camera-outline"
                            size="14"
                            @click="triggerFileInput"
                          ></v-icon>
                        </v-avatar>
                        <v-img
                          v-if="selectedImage"
                          :src="selectedImage"
                          class="rounded-circle"
                          height="120"
                          width="120"
                          cover
                        ></v-img>
                        <v-img
                          v-else-if="profilePictureUrl"
                          :src="profilePictureUrl"
                          class="rounded-circle"
                          height="120"
                          width="120"
                          cover
                        ></v-img>
                        <v-icon
                          v-else
                          icon="mdi-account-outline"
                          color="grey"
                          size="46"
                        ></v-icon>
                      </v-sheet>
                      <input
                        type="file"
                        ref="fileInput"
                        @change="onFileSelected"
                        style="display: none"
                        :disabled="readOnlyCondition"
                      />
                    </v-col>
                    <v-col cols="12" md="12" xxl="6" xl="6" lg="6">
                      <v-row no-gutters class="">
                        <v-col
                          cols="12"
                          class="pb-2 fs12 d-flex justify-lg-start justify-sm-center justify-center"
                        >
                        </v-col>
                        <v-col
                          cols="12"
                          class="pb-4 text-h6 font-weight-bold d-flex justify-lg-start justify-sm-center justify-center"
                          style="font-size: 20px"
                        >
                          {{ user.givenName }} {{ user.surname }}
                        </v-col>
                        <v-col cols="12" class="d-flex justify-center">
                          <v-sheet
                            class="pill d-flex align-center justify-start px-4 border-md"
                          >
                            <v-icon
                              size="20"
                              icon="mdi-card-account-details-outline"
                            >
                            </v-icon>
                            <span class="pl-4 font-weight-medium text-truncate">
                              #IDSeven399940
                            </span>
                          </v-sheet>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  xxl="6"
                  xl="6"
                  lg="6"
                  :class="{
                    'pl-6': $vuetify.display.mdAndUp,
                  }"
                >
                  <v-row no-gutters class="pt-2">
                    <v-col
                      cols="12"
                      class="pb-4 text-h6 font-weight-bold"
                      style="font-size: 20px"
                    >
                      Roles & Permissions
                    </v-col>
                    <template
                      v-for="permission in permissions"
                      :key="permission"
                    >
                      <v-col
                        class="mr-2"
                        cols="12"
                        lg="5"
                        md="12"
                        sm="12"
                        xl="5"
                      >
                        <v-sheet
                          class="pill d-flex align-center justify-start px-4 mr-2 mb-2 border-md"
                        >
                          <v-icon size="20" icon="mdi-lock-check-outline">
                          </v-icon>
                          <span
                            class="pl-4 font-weight-medium text-wrap text-truncate"
                          >
                            {{ permission }}
                          </span>
                        </v-sheet>
                      </v-col>
                    </template>
                    <v-col
                      cols="12"
                      lg="5"
                      md="12"
                      sm="12"
                      xl="5"
                      v-if="$ability.can('update', 'edit-teams')"
                    >
                      <v-btn
                        color="#1867C0"
                        class="rounded-lg w-100"
                        @click="showRoleModal()"
                      >
                        Change
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider class="my-4"></v-divider>
          <v-form @submit.prevent="handleUpdateProfile">
            <v-row no-gutters class="d-flex justify-space-evenly">
              <template v-for="item in items" :key="item">
                <v-col
                  cols="12"
                  class="text-h6 font-weight-bold d-flex justify-end align-center px-4 text-truncate"
                  style="font-size: 20px"
                >
                  {{ item.title }}
                </v-col>
                <template v-for="data in item.data" :key="data">
                  <v-col cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
                    <v-row no-gutters class="pa-4">
                      <v-col cols="12">
                        <v-text-field
                          flat
                          density="compact"
                          :label="data.label"
                          v-model="data.value"
                          persistent-placeholder
                          class="elevation-0"
                          :readonly="readOnlyCondition || isAdmin(data.label)"
                          :type="data.type"
                          :disabled="isAdmin(data.label)"
                          @input="handleInput(data)"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </template>
              </template>
              <v-col cols="12" class="d-flex align-center justify-end">
                <v-row no-gutters justify="end">
                  <v-col cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
                    <v-row
                      no-gutters
                      justify="end"
                      v-if="
                        $ability.can('update', 'edit-teams') && canEditProfile()
                      "
                    >
                      <v-col
                        cols="12"
                        xs="4"
                        sm="4"
                        md="4"
                        xxl="4"
                        xl="4"
                        lg="4"
                        class="mb-2 mb-sm-0"
                      >
                        <v-btn
                          :disabled="!readOnlyCondition"
                          style="border-radius: 8px"
                          flat
                          type="submit"
                          block
                          variant="outlined"
                          size="large"
                          :color="readOnlyCondition ? '#1867C0' : 'red'"
                          @click="handleEditProfile"
                        >
                          Edit
                        </v-btn>
                      </v-col>
                      <v-col
                        cols="12"
                        xs="4"
                        sm="4"
                        md="4"
                        xxl="4"
                        xl="4"
                        lg="4"
                        class="mt-2 mt-sm-0 mx-sm-4"
                      >
                        <v-btn
                          :disabled="readOnlyCondition"
                          flat
                          class="fs12 text-white rounded-lg"
                          color="#1867C0"
                          type="submit"
                          block
                          size="large"
                          :loading="isLoading"
                          @click="handleUpdateProfile"
                        >
                          Update
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <dialog-role
      :isConfirmModal="dialogAssignRoles"
      :roleSet="selectedTeam"
      @close-modal="dialogAssignRoles = false"
      @confirm-select="submitReassign($event)"
    ></dialog-role>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["secure", "role", "user"],
});
const { $ability } = useNuxtApp();
const id = computed(() => useRoute().params.id);
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const {
  user,
  updateUserRole,
  getUserById,
  uploadProfilePicture,
  updateUserProfile,
  verifyPassword,
} = useUser();
const address = currentUser.value.address;
const { filterNumericInput } = useUtils();

const readOnlyCondition = ref($ability.can("update", "edit-teams"));
const isLoading = ref(false);
const dialogAssignRoles = ref(false);

const handleInput = (data) => {
  if (
    data.label === "Primary number" ||
    data.label === "Primary Mobile number"
  ) {
    data.value = filterNumericInput(data.value);
  }
};
const handleEditProfile = () => {
  readOnlyCondition.value = false;
};
const items = reactive([
  {
    title: "Account Information",
    data: [
      {
        label: "Full name",
        value: `${user.value.givenName} ${user.value.surname}`,
      },
      { label: "Email", value: user.value.email },
      { label: "Password", value: "", type: "password" },
      { label: "Primary number", value: user.value.primaryPhone },
      { label: "New Password", value: "", type: "password" },
      { label: "Primary Mobile number", value: user.value.mobilePhone },
    ],
  },
  {
    title: "Address",
    data: [
      { label: "Address line 1", value: user.value.address?.address1 || "" },
      { label: "Address line 2", value: user.value.address?.address2 || "" },
      { label: "Country", value: user.value.address?.country || "" },
      { label: "City/Town", value: user.value.address?.city || "" },
      { label: "Province", value: user.value.address?.province || "" },
      { label: "Postal Code", value: user.value.address?.postalCode || "" },
    ],
  },
]);

watch(user, (newUserValue) => {
  items[0].data[0].value = `${newUserValue.givenName} ${newUserValue.surname}`;
  items[0].data[1].value = newUserValue.email;
  items[0].data[3].value = newUserValue.primaryPhone;
  items[0].data[5].value = newUserValue.mobilePhone;

  if (newUserValue.address) {
    items[1].data[0].value = newUserValue.address.address1 || "";
    items[1].data[1].value = newUserValue.address.address2 || "";
    items[1].data[2].value = newUserValue.address.country || "";
    items[1].data[3].value = newUserValue.address.city || "";
    items[1].data[4].value = newUserValue.address.province || "";
    items[1].data[5].value = newUserValue.address.postalCode || "";
  }
});

const selectedTeam = ref({});
const selectedRole = ref({});
function showRoleModal() {
  selectedTeam.value = currentUser.value;
  dialogAssignRoles.value = true;
}

async function submitReassign(_role) {
  permissions.value = [_role.roleName];
  selectedRole.value = _role;
  dialogAssignRoles.value = false;
}

const isAdmin = (label) => {
  return (
    currentUser.value.type === "admin" &&
    (label === "Password" || label === "New Password") &&
    currentUser.value._id !== id.value
  );
};

const canEditProfile = () => {
  return (
    currentUser.value.type === "admin" || currentUser.value._id === id.value
  );
};

const permissions = ref(["View Only"]);
async function fetchSelectedUser() {
  try {
    const userData = await getUserById(id.value);
    user.value = userData;
    permissions.value = [user.value.role?.roleName];
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}
onMounted(async () => {
  permissions.value = [user.value.role?.roleName];
  fetchSelectedUser();
});
const selectedImage = ref("");

const triggerFileInput = () => {
  document.querySelector('input[type="file"]').click();
};
const profilePictureUrl = computed(() => {
  return user.value.profilePicture
    ? `/api/files/${user.value.profilePicture}`
    : "";
});
let uploadedFileId = null;
const onFileSelected = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async () => {
      selectedImage.value = reader.result;
      try {
        const upload = await uploadProfilePicture(file);
        uploadedFileId = upload.id;
      } catch (error) {
        setSnackbar({
          modal: true,
          text: "Error Uploading Image",
          type: "error",
        });
      }
    };
    reader.readAsDataURL(file);
  }
};

async function handleUpdateProfile() {
  readOnlyCondition.value = true;
  isLoading.value = true;
  try {
    const updatedProfileData = {
      givenName: items[0].data[0].value.split(" ")[0],
      surname: items[0].data[0].value.split(" ")[1],
      email: items[0].data[1].value,
      primaryPhone: items[0].data[3].value,
      mobilePhone: items[0].data[5].value,
      address: {
        address1: items[1].data[0].value,
        address2: items[1].data[1].value,
        country: items[1].data[2].value,
        city: items[1].data[3].value,
        province: items[1].data[4].value,
        postalCode: items[1].data[5].value,
      },
      profilePicture: uploadedFileId,
    };
    const currentPassword = items[0].data[2].value;
    const newPassword = items[0].data[4].value;
    if (currentPassword && newPassword) {
      const verified = await verifyPassword({
        id: id.value,
        password: currentPassword,
      });
      if (!verified.value) {
        setSnackbar({
          text: "Current password is incorrect.",
          modal: true,
          type: "warning",
        });
        return;
      }
      updatedProfileData.password = newPassword;
    }
    await updateUserRole({
      id: id.value,
      role: selectedRole.value._id,
    });
    await updateUserProfile({ id: id.value, data: updatedProfileData });
    setSnackbar({
      modal: true,
      text: "Successfully updated user profile.",
      type: "success",
    });
  } catch (error) {
    console.error("Error Updating Profile:", error);
    setSnackbar({
      modal: true,
      text: error.message || "Error Updating Profile",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>
<style scoped>
.pill {
  height: 35px;
  width: 100%;
  border-radius: 100px;
}
</style>
