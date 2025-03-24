<template>
  <v-card
    :loading="isLoading"
    width="100%"
    height="100%"
    class="pa-8"
    rounded="xl"
  >
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
                  <label
                    for="file"
                    @click="
                      (e: Event) => readOnlyCondition && e.preventDefault()
                    "
                    :style="!readOnlyCondition && 'cursor: pointer'"
                  >
                    <v-avatar
                      size="32"
                      :color="readOnlyCondition ? '#83ADDD' : '#1C75BC'"
                      style="
                        position: absolute;
                        right: 2px;
                        top: 5px;
                        z-index: 1;
                      "
                    >
                      <v-icon icon="mdi-camera-outline" size="14"></v-icon>
                    </v-avatar>
                  </label>
                  <div style="display: none !important">
                    <v-file-input
                      v-model="file"
                      id="file"
                      @change="handleFile"
                      accept="image/png, image/jpeg, image/bmp"
                    ></v-file-input>
                  </div>
                  <v-avatar size="120">
                    <v-img
                      height="120"
                      width="120"
                      cover
                      :src="`/api/files/${editUser.profilePicture}`"
                      v-if="editUser.profilePicture"
                    ></v-img>
                    <v-icon
                      icon="mdi-account-outline"
                      color="grey"
                      size="46"
                      v-else
                    ></v-icon>
                  </v-avatar>
                </v-sheet>
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
                    class="pb-4 text-h6 font-weight-bold d-flex justify-lg-start justify-sm-center justify-center text-capitalize"
                    style="font-size: 20px"
                  >
                    {{ selectedUserInfo?.givenName }}
                    {{ selectedUserInfo?.surname }}
                  </v-col>
                  <v-col cols="12" class="d-flex justify-center">
                    <v-sheet
                      class="pill d-flex align-center justify-start px-4 border-md"
                    >
                      <v-icon size="20" icon="mdi-card-account-details-outline">
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
              <template v-for="(permission, i) in permissions" :key="i">
                <v-col class="mr-2" cols="12" lg="5" md="12" sm="12" xl="5">
                  <v-sheet
                    class="pill d-flex align-center justify-start px-4 mr-2 mb-2 border-md"
                  >
                    <v-icon size="20" icon="mdi-lock-check-outline"> </v-icon>
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
                v-if="
                  $ability.can('update', 'edit-profile') &&
                  selectedUserInfo?.isAdmin
                "
              >
                <v-btn
                  color="#1867C0"
                  class="rounded-lg w-100"
                  :disabled="readOnlyCondition"
                  @click="showRoleModal()"
                >
                  Change Role
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="my-4"></v-divider>
    <v-form @submit.prevent="submit">
      <v-row no-gutters class="d-flex justify-space-evenly">
        <v-col
          cols="12"
          class="text-h6 font-weight-bold d-flex align-center px-4 text-truncate"
          style="font-size: 20px"
        >
          Account Information
        </v-col>

        <v-col cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
          <v-row no-gutters class="pa-4">
            <v-col cols="12">
              <v-text-field
                flat
                density="compact"
                label="First Name"
                v-model="editUser.givenName"
                persistent-placeholder
                class="elevation-0"
                :readonly="readOnlyCondition"
                :hide-details="!!editUser.givenName"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
          <v-row no-gutters class="pa-4">
            <v-col cols="12">
              <v-text-field
                flat
                density="compact"
                label="Last Name"
                v-model="editUser.surname"
                persistent-placeholder
                class="elevation-0"
                :readonly="readOnlyCondition"
                :hide-details="!!editUser.surname"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
          <v-row no-gutters class="pa-4">
            <v-col cols="12">
              <v-text-field
                flat
                density="compact"
                label="Email"
                v-model="editUser.email"
                persistent-placeholder
                class="elevation-0"
                :readonly="readOnlyCondition"
                :hide-details="!!editUser.email"
                :rules="[requiredInput, validEmail]"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
          <v-row no-gutters class="pa-4">
            <v-col cols="6" lg="5" class="pr-2">
              <v-select
                v-model="prefix"
                :items="prefixes"
                item-title="country"
                item-value="dial_code"
                menu-icon="mdi-chevron-down"
                chips
                label="Dial Code"
                flat
                density="compact"
                :readonly="readOnlyCondition"
                :hide-details="!!editUser.primaryPhone"
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
                      <v-chip color="primary">{{ item.raw.country }}</v-chip>
                    </v-col>
                  </v-row>
                </template>
              </v-select>
            </v-col>
            <v-col cols="6" lg="7">
              <v-text-field
                v-model="editUser.primaryPhone"
                label="Primary Number"
                flat
                density="compact"
                :readonly="readOnlyCondition"
                :hide-details="!!editUser.primaryPhone"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="3" md="3" xxl="3" xl="3" lg="3">
          <v-row no-gutters class="pa-4">
            <v-col cols="12">
              <v-text-field
                v-model="userPassword.old"
                density="compact"
                class="custom-field elevation-0"
                label="Current Password"
                placeholder="Enter current password"
                type="password"
                persistent-placeholder
                hide-details
                flat
                :readonly="readOnlyCondition"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="3" md="3" xxl="3" xl="3" lg="3">
          <v-row no-gutters class="pa-4">
            <v-col cols="12">
              <v-text-field
                v-model="userPassword.new"
                class="custom-field elevation-0"
                density="compact"
                label="New Password"
                placeholder="Enter new password"
                type="password"
                hint="At least 8 characters"
                persistent-placeholder
                flat
                :readonly="readOnlyCondition"
                :hide-details="!!userPassword.new"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
          <v-row no-gutters class="pa-4">
            <v-col cols="6" lg="5" class="pr-2">
              <v-select
                v-model="prefix_mobile"
                :items="prefixes"
                item-title="country"
                item-value="dial_code"
                menu-icon="mdi-chevron-down"
                chips
                label="Dial Code"
                flat
                density="compact"
                :readonly="readOnlyCondition"
                :hide-details="!!editUser.mobilePhone"
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
                      <v-chip color="primary">{{ item.raw.country }}</v-chip>
                    </v-col>
                  </v-row>
                </template>
              </v-select>
            </v-col>
            <v-col cols="6" lg="7">
              <v-text-field
                v-model="editUser.mobilePhone"
                label="Primary Mobile Number"
                flat
                density="compact"
                :readonly="readOnlyCondition"
                :hide-details="!!editUser.mobilePhone"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <v-col
          cols="12"
          class="text-h6 font-weight-bold d-flex align-center px-4 text-truncate"
          style="font-size: 20px"
        >
          Address
        </v-col>

        <v-col cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
          <v-row no-gutters class="pa-4">
            <v-col cols="12">
              <v-text-field
                flat
                density="compact"
                label="Address Line 1"
                v-model="editUser.address.address1"
                persistent-placeholder
                class="custom-field elevation-0"
                :readonly="readOnlyCondition"
                :hide-details="!!editUser.address.address1"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
          <v-row no-gutters class="pa-4">
            <v-col cols="12">
              <v-text-field
                flat
                density="compact"
                label="Address Line 2"
                v-model="editUser.address.address2"
                persistent-placeholder
                class="custom-field elevation-0"
                :readonly="readOnlyCondition"
                :hide-details="!!editUser.address.address2"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
          <v-row no-gutters class="pa-4">
            <v-col cols="12">
              <v-text-field
                flat
                density="compact"
                label="Country"
                v-model="editUser.address.country"
                persistent-placeholder
                class="custom-field elevation-0"
                :readonly="readOnlyCondition"
                :hide-details="!!editUser.address.country"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
          <v-row no-gutters class="pa-4">
            <v-col cols="12">
              <v-text-field
                flat
                density="compact"
                label="City/Town"
                v-model="editUser.address.city"
                persistent-placeholder
                class="custom-field elevation-0"
                :readonly="readOnlyCondition"
                :hide-details="!!editUser.address.city"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
          <v-row no-gutters class="pa-4">
            <v-col cols="12">
              <v-text-field
                flat
                density="compact"
                label="Province"
                v-model="editUser.address.province"
                persistent-placeholder
                class="custom-field elevation-0"
                :readonly="readOnlyCondition"
                :hide-details="!!editUser.address.province"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
          <v-row no-gutters class="pa-4">
            <v-col cols="12">
              <v-text-field
                flat
                density="compact"
                label="Postal Code"
                v-model="editUser.address.postalCode"
                persistent-placeholder
                class="custom-field elevation-0"
                :readonly="readOnlyCondition"
                :hide-details="!!editUser.address.postalCode"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" class="d-flex align-center justify-end">
          <v-row no-gutters justify="end">
            <v-col cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
              <v-row
                no-gutters
                justify="end"
                v-if="$ability.can('update', 'edit-profile')"
              >
                <v-col
                  cols="12"
                  sm="4"
                  md="4"
                  xxl="4"
                  xl="4"
                  lg="4"
                  class="mb-2 mb-sm-0"
                >
                  <v-btn
                    style="border-radius: 8px"
                    flat
                    block
                    :color="readOnlyCondition ? '#1867C0' : 'red'"
                    size="large"
                    @click="toggleEditProfile"
                  >
                    {{ readOnlyCondition ? "Edit" : "Cancel" }}
                  </v-btn>
                </v-col>
                <v-col
                  cols="12"
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
                    @click="submit"
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

    <dialog-role
      :isConfirmModal="dialogAssignRoles"
      :roleSet="selectedTeam"
      @close-modal="dialogAssignRoles = false"
      @confirm-select="submitReassign($event)"
    ></dialog-role>
    <digital-password
      @confirmSign="confirmSign($event)"
      :isConfirmModal="isDeleteLoading"
      isConfirmTitle="Confirm Password To Delete!"
    />
  </v-card>
</template>

<script setup lang="ts">
import phoneCode from "@/components/phone-code.json";
import cloneDeep from "lodash/cloneDeep";

const prefixes = phoneCode;
const prefix = ref("+65");
const prefix_mobile = ref("+65");

const props = defineProps<{
  userId: string;
}>();

const { $ability } = useNuxtApp();
const {
  validEmail,
  requiredInput,
  getChangedValues,
  formatPhoneNumber,
  displayPhoneNumber,
} = useUtils();
const { setSnackbar } = useLocal();
const {
  user,
  updateUserRole,
  getUserById,
  updateUserProfile,
  verifyPassword,
  setUser,
  uploadProfilePicture,
  requestAccountDeletion,
} = useUser();

const permissions = ref(["View Only"]);
const readOnlyCondition = ref(true);
const isLoading = ref(false);

const isDeleteLoading = ref(false);
const dialogAssignRoles = ref(false);
const selectedTeam = ref({});
const selectedRole = ref<TRole>();
const userPassword = ref({
  old: "",
  new: "",
});
const file = ref<File>();
const editUser = ref(cloneDeep(user.value));

const selectedUserInfo = ref(null);

onMounted(async () => {
  const getUserInfo = await getUserById(props.userId);

  const result = await useLocalFetch(
    `/api/auth/users/${getUserInfo?.email}`,
    {},
  );

  editUser.value = result.data.value;
  selectedUserInfo.value = result.data.value;

  displayMobilePhone();
  displayPrimaryPhone();

  permissions.value = [
    (editUser.value.role as unknown as { roleName: string })?.roleName ||
      "View Only",
  ];
});

async function confirmSign(user?: TUser) {
  if (user && typeof user === "object") {
    try {
      const result = (await requestAccountDeletion(
        user._id,
        user.type,
      )) as unknown as { message: string; value: boolean };
      if (result.value) {
        setSnackbar({
          modal: true,
          text: "Account Deletion Request Submitted Successfully!",
          type: "success",
        });
      }
    } catch (error: any) {
      setSnackbar({
        modal: true,
        text: error || error.message || "Something went wrong!",
        type: "error",
      });
    } finally {
      isDeleteLoading.value = false;
    }
  }
}

function displayMobilePhone(value?: string) {
  // format mobile number
  // prefix_mobile.value = editUser.value.mobilePhone?.split(" ")[0];
  // editUser.value.mobilePhone = editUser.value.mobilePhone?.split(" ")[1];

  const { countryCode, pNumber } = displayPhoneNumber(
    editUser.value.mobilePhone || value || "",
  );
  editUser.value.mobilePhone = pNumber;
  prefix_mobile.value = countryCode;
}

function displayPrimaryPhone(value?: string) {
  // format primary number
  // prefix.value = editUser.value.primaryPhone?.split(" ")[0];
  // editUser.value.primaryPhone = editUser.value.primaryPhone?.split(" ")[1];
  const { countryCode, pNumber } = displayPhoneNumber(
    editUser.value.primaryPhone || value || "",
  );
  editUser.value.primaryPhone = pNumber;
  prefix.value = countryCode;
}

async function toggleEditProfile() {
  readOnlyCondition.value = !readOnlyCondition.value;
  if (readOnlyCondition.value) {
    editUser.value = cloneDeep(user.value);

    const getUserInfo = await getUserById(props.userId);

    const result = await useLocalFetch(
      `/api/auth/users/${getUserInfo?.email}`,
      {},
    );

    editUser.value = result.data.value;

    displayMobilePhone();
    displayPrimaryPhone();
    permissions.value = [
      (editUser.value.role as unknown as { roleName: string })?.roleName,
    ];
  }
}

async function handleFile() {
  if (!file.value) return;
  isLoading.value = true;
  const upload = (await uploadProfilePicture(file.value)) as {
    id: string;
    message: string;
  };
  editUser.value.profilePicture = upload.id;
  isLoading.value = false;
}

function showRoleModal() {
  selectedTeam.value = selectedUserInfo?.value;
  dialogAssignRoles.value = true;
}

async function submitReassign(_role: TRole) {
  permissions.value = [_role.roleName];
  selectedRole.value = _role;
  dialogAssignRoles.value = false;
}

async function submit() {
  try {
    isLoading.value = true;
    const emailValidation = validEmail(editUser.value.email);
    if (emailValidation !== true) {
      throw new Error(emailValidation);
    }
    const requiredValidation = requiredInput(editUser.value.email);
    if (requiredValidation !== true) {
      throw new Error(requiredValidation);
    }
    if (userPassword.value.old && userPassword.value.new) {
      // check if current password is exist/correct use this verifyUserUsingPassword /verify-password
      const verified = await verifyPassword({
        id: editUser.value._id,
        password: userPassword.value.old,
      });
      if (!verified.value) throw new Error(verified.message);
      editUser.value.password = userPassword.value.new;
    } else {
      // if you dont update password
      editUser.value.password = "";
    }
    let patch = getChangedValues(user.value, editUser.value);
    if (!editUser.value.password) delete patch.password;
    delete patch.role;
    let checkAddressChanges = false;
    if (patch.address) {
      const addr = { ...editUser.value.address, ...patch.address };
      const checkIfChangedAddress = getChangedValues(user.value.address, addr);
      if (!!checkIfChangedAddress) checkAddressChanges = true;
    }
    if (patch.mobilePhone) {
      patch.mobilePhone = formatPhoneNumber(
        prefix_mobile.value,
        patch.mobilePhone || "",
      );
    }
    if (patch.primaryPhone) {
      patch.primaryPhone = formatPhoneNumber(
        prefix.value,
        patch.primaryPhone || "",
      );
    }
    if (editUser.value.surname === "") {
      patch.surname = " ";
    }
    if (editUser.value.givenName === "") {
      patch.givenName = " ";
    }
    const userProfile = await updateUserProfile({
      id: props.userId,
      data: {
        ...patch,
        ...(checkAddressChanges && {
          address: { ...editUser.value.address, ...patch.address },
        }),
      },
    });
    if (!userProfile.value) throw new Error(userProfile.message);
    if (selectedRole.value && selectedRole.value._id) {
      await updateUserRole({
        id: selectedUserInfo?.value._id,
        role: selectedRole.value?._id || "",
      });
    }
    userPassword.value = {
      new: "",
      old: "",
    };
    // Resets Data or Re-rendered
    setUser(userProfile.value);
    displayMobilePhone(userProfile.value.mobilePhone);
    displayPrimaryPhone(userProfile.value.primaryPhone);
    setSnackbar({
      modal: true,
      text: "Successfully updated User Profile.",
      type: "success",
    });
    isLoading.value = false;
    readOnlyCondition.value = true;
  } catch (error: any) {
    setSnackbar({
      modal: true,
      text: error || error.message || "Server internal error.",
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
.label-module {
  max-width: 100vw;
}
@media (max-width: 768px) {
  .label-module {
    max-width: 40vw !important;
  }
}
</style>
