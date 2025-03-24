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
                    class="pb-4 text-h6 font-weight-bold d-flex justify-lg-start justify-sm-center justify-center"
                    style="font-size: 20px"
                  >
                    {{ currentUser.givenName }} {{ currentUser.surname }}
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
                  $ability.can('update', 'edit-profile') && currentUser.isAdmin
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
        <!-- <v-col cols="12">
          <v-btn
            v-if="currentUser.type === 'organization'"
            color="purple"
            @click="onCreateStripeAccount"
            :loading="isLoadingStripe"
            :disabled="isLoadingStripe"
          >
        </v-col> -->
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
    <v-divider class="my-4"></v-divider>

    <v-col
      cols="12"
      class="text-h6 font-weight-bold d-flex align-center px-4 text-truncate"
      style="font-size: 20px"
    >
      Notification Settings
    </v-col>
    <v-row no-gutters class="d-flex justify-space-evenly">
      <v-col cols="12" class="d-flex">
        <v-row no-gutters justify="start" class="d-flex">
          <v-col cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
            <div class="text text-h6 label-module pt-3">
              Enable All Notifications
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters justify="end" class="d-flex">
          <div cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
            <v-switch
              v-model="enableAllNotifications"
              color="primary"
              label="Enable All"
              @change="toggleEnableAllNotifications"
            ></v-switch>
          </div>
        </v-row>
      </v-col>

      <!-- Disable All Notifications -->
      <v-col cols="12" class="d-flex">
        <v-row no-gutters justify="start">
          <v-col cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
            <div class="text text-h6 label-module pt-3">
              Disable All Notifications
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters justify="end">
          <div cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
            <v-switch
              v-model="disableNotifications"
              color="primary"
              :label="disableNotifications ? 'Disabled' : 'Enabled'"
              @change="toggleDisableNotifications"
            ></v-switch>
          </div>
        </v-row>
      </v-col>

      <v-col
        cols="12"
        class="d-flex"
        v-for="module in modules"
        :key="module.key"
      >
        <v-row no-gutters justify="start">
          <v-col cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
            <div class="text text-h6 label-module pt-3">
              {{ module.label }}
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters justify="end">
          <div cols="12" sm="6" md="6" xxl="6" xl="6" lg="6">
            <v-switch
              v-model="module.value"
              color="primary"
              label="Enable"
              @change="updateNotificationModules"
            ></v-switch>
          </div>
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="my-4"></v-divider>
    <v-col
      cols="12"
      class="text-h6 font-weight-bold d-flex align-center px-4 text-truncate"
      style="font-size: 20px"
    >
      Request Account Deletion
    </v-col>
    <v-row no-gutters class="d-flex justify-space-evenly">
      <v-col cols="12" class="d-flex">
        <v-btn
          size="large"
          color="red"
          @click="onRequestAccountDelete"
          :loading="isDeleteLoading"
          :disabled="isDeleteLoading || currentUser.deletionRequested"
          >Delete Account</v-btn
        >
      </v-col>
    </v-row>

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
      @close-modal="isDeleteLoading = false"
    />
  </v-card>
</template>

<script setup lang="ts">
import phoneCode from "@/components/phone-code.json";
import cloneDeep from "lodash/cloneDeep";
import debounce from "lodash/debounce";

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
  filterNumericInput,
  formatPhoneNumber,
  displayPhoneNumber,
} = useUtils();
const { setSnackbar } = useLocal();
const { currentUser } = useLocalAuth();
const {
  user,
  updateUserRole,
  getUserById,
  updateUserProfile,
  verifyPassword,
  setUser,
  uploadProfilePicture,
  updateNotificationSettings,
  requestAccountDeletion,
} = useUser();
const {
  visitorSocket,
  organizationSocket,
  feedbackSocket,
  incidentSocket,
  facilitySocket,
} = useSocket();
const { createStripeAccount, verifyStripeAccount } = usePayment();

const permissions = ref(["View Only"]);
const readOnlyCondition = ref(true);
const isLoading = ref(false);
const isLoadingStripe = ref(false);
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

onMounted(() => {
  displayMobilePhone();
  displayPrimaryPhone();
  permissions.value = [
    (editUser.value.role as unknown as { roleName: string })?.roleName,
  ];
});

async function onVerifyStripeAccount() {
  try {
    if (
      currentUser.value.stripeAccount &&
      currentUser.value.stripeAccount.stripeAccountId
    ) {
      return verifyStripeAccount(
        currentUser.value.stripeAccount.stripeAccountId || "",
      );
    }
  } catch (error: any) {
    setSnackbar({
      modal: true,
      text: error || error.message || "Something went wrong!",
      type: "error",
    });
    return;
  }
}

async function onCreateStripeAccount() {
  try {
    isLoadingStripe.value = true;
    const account = await onVerifyStripeAccount();
    if (account && account.isVerified)
      throw new Error("This user already created a stripe account!");
    const result = (await createStripeAccount({
      email: currentUser.value.email,
      country: "SG",
    })) as unknown as TStripeCreateAccountResponse;
    const { accountLink } = result;
    window.location.href = accountLink;
  } catch (error: any) {
    setSnackbar({
      modal: true,
      text: error || error.message || "Something went wrong!",
      type: "error",
    });
  } finally {
    isLoadingStripe.value = false;
  }
}

async function onRequestAccountDelete() {
  isDeleteLoading.value = true;
}

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
  const { countryCode, pNumber } = displayPhoneNumber(
    editUser.value.mobilePhone || value || "",
  );
  editUser.value.mobilePhone = pNumber;
  prefix_mobile.value = countryCode;
}

function displayPrimaryPhone(value?: string) {
  // format primary number
  const { countryCode, pNumber } = displayPhoneNumber(
    editUser.value.primaryPhone || value || "",
  );
  editUser.value.primaryPhone = pNumber;
  prefix.value = countryCode;
}

async function toggleEditProfile() {
  readOnlyCondition.value = !readOnlyCondition.value;
  if (readOnlyCondition.value) editUser.value = cloneDeep(user.value);
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
  selectedTeam.value = currentUser.value;
  dialogAssignRoles.value = true;
}
async function submitReassign(_role: TRole) {
  permissions.value = [_role.roleName];
  selectedRole.value = _role;
  dialogAssignRoles.value = false;
}
function handleNumericInput(field: string, event: Event) {
  const input = (event.target as HTMLInputElement).value;
  const numericInput = filterNumericInput(input);
  editUser.value[field] = numericInput;
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
        id: currentUser.value._id,
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

const disableNotifications = ref<boolean>(false);
const enableAllNotifications = ref<boolean>(false);

const modules = ref([
  {
    label: "Service Providers",
    key: "service-provider",
    value: currentUser.value.notificationSettings["service-provider"] || false,
  },
  {
    label: "Residents",
    key: "resident",
    value: currentUser.value.notificationSettings.resident || false,
  },
  {
    label: "Facility Management",
    key: "facility",
    value: currentUser.value.notificationSettings.facility || false,
  },
  {
    label: "Forms",
    key: "form",
    value: currentUser.value.notificationSettings.form || false,
  },
  {
    label: "Roles & Permissions",
    key: "role",
    value: currentUser.value.notificationSettings.role || false,
  },
  {
    label: "Feedback",
    key: "feedback",
    value: currentUser.value.notificationSettings.feedback || false,
  },
  {
    label: "Work Orders",
    key: "work-order",
    value: currentUser.value.notificationSettings["work-order"] || false,
  },
  {
    label: "Calendar",
    key: "calendar",
    value: currentUser.value.notificationSettings.calendar || false,
  },
  {
    label: "Key Management",
    key: "key",
    value: currentUser.value.notificationSettings.key || false,
  },
  {
    label: "Visitors Management",
    key: "visitor",
    value: currentUser.value.notificationSettings.visitor || false,
  },
  {
    label: "Building Management",
    key: "building",
    value: currentUser.value.notificationSettings.building || false,
  },
  {
    label: "Sky-I",
    key: "cctv",
    value: currentUser.value.notificationSettings.cctv || false,
  },
  {
    label: "Announcement Configuration",
    key: "announcement",
    value: currentUser.value.notificationSettings.announcement || false,
  },
  {
    label: "Emergency Contact Configuration",
    key: "emergency-contact",
    value: currentUser.value.notificationSettings["emergency-contact"] || false,
  },
  {
    label: "Daily Occurrence Book Configuration",
    key: "daily-occurrence-book",
    value:
      currentUser.value.notificationSettings["daily-occurrence-book"] || false,
  },
  {
    label: "Incident Management",
    key: "incident",
    value: currentUser.value.notificationSettings.incident || false,
  },
]);

const allModulesDisabled = computed(() => {
  return modules.value.every((module) => !module.value);
});
const allModulesEnabled = computed(() => {
  return modules.value.every((module) => module.value);
});

watchEffect(() => {
  if (allModulesDisabled.value) {
    disableNotifications.value = true;
    enableAllNotifications.value = false;
  } else {
    disableNotifications.value = false;
  }
});

watchEffect(() => {
  if (allModulesEnabled.value) {
    enableAllNotifications.value = true;
    disableNotifications.value = false;
  } else {
    enableAllNotifications.value = false;
  }
});

const toggleAllNotifications = () => {
  if (disableNotifications.value) {
    modules.value = modules.value.map((module) => ({
      ...module,
      value: false,
    }));
    enableAllNotifications.value = false;
  } else if (enableAllNotifications.value) {
    modules.value = modules.value.map((module) => ({ ...module, value: true }));
    disableNotifications.value = false;
  }
  updateNotificationModules();
};

const toggleEnableAllNotifications = () => {
  if (enableAllNotifications.value) {
    disableNotifications.value = false;
    modules.value = modules.value.map((module) => ({ ...module, value: true }));
  }
  updateNotificationModules();
};

const toggleDisableNotifications = () => {
  if (disableNotifications.value) {
    enableAllNotifications.value = false;
    modules.value = modules.value.map((module) => ({
      ...module,
      value: false,
    }));
  }
  updateNotificationModules();
};

const updateNotificationModules = debounce(async () => {
  isLoading.value = true;
  const notificationSettings: TUserNotificationSettings = {
    "service-provider": modules.value.find(
      (module) => module.key === "service-provider",
    )!.value,
    resident: modules.value.find((module) => module.key === "resident")!.value,
    facility: modules.value.find((module) => module.key === "facility")!.value,
    form: modules.value.find((module) => module.key === "form")!.value,
    role: modules.value.find((module) => module.key === "role")!.value,
    feedback: modules.value.find((module) => module.key === "feedback")!.value,
    "work-order": modules.value.find((module) => module.key === "work-order")!
      .value,
    calendar: modules.value.find((module) => module.key === "calendar")!.value,
    key: modules.value.find((module) => module.key === "key")!.value,
    visitor: modules.value.find((module) => module.key === "visitor")!.value,
    building: modules.value.find((module) => module.key === "building")!.value,
    cctv: modules.value.find((module) => module.key === "cctv")!.value,
    announcement: modules.value.find((module) => module.key === "announcement")!
      .value,
    "emergency-contact": modules.value.find(
      (module) => module.key === "emergency-contact",
    )!.value,
    "daily-occurrence-book": modules.value.find(
      (module) => module.key === "daily-occurrence-book",
    )!.value,
    incident: modules.value.find((module) => module.key === "incident")!.value,
  };

  try {
    await updateNotificationSettings(
      currentUser.value._id,
      notificationSettings,
    );
    if (allModulesDisabled.value) {
      visitorSocket.disconnect();
      organizationSocket.disconnect();
      feedbackSocket.disconnect();
      incidentSocket.disconnect();
      facilitySocket.disconnect();
    } else {
      visitorSocket.disconnect();
      organizationSocket.disconnect();
      feedbackSocket.disconnect();
      incidentSocket.disconnect();
      facilitySocket.disconnect();
      visitorSocket.auth = {
        userId: currentUser.value._id,
        siteId: currentUser.value.site,
        organizationId: currentUser.value.organization,
        serviceProviderId: currentUser.value.serviceProvider,
        serviceProviderGroupId: currentUser.value.serviceProviderGroup,
        type: currentUser.value.type,
      };
      visitorSocket.connect();
      organizationSocket.auth = {
        userId: currentUser.value._id,
        siteId: currentUser.value.site,
        organizationId: currentUser.value.organization,
        serviceProviderId: currentUser.value.serviceProvider,
        serviceProviderGroupId: currentUser.value.serviceProviderGroup,
        type: currentUser.value.type,
      };
      organizationSocket.connect();
      feedbackSocket.auth = {
        userId: currentUser.value._id,
        siteId: currentUser.value.site,
        organizationId: currentUser.value.organization,
        serviceProviderId: currentUser.value.serviceProvider,
        serviceProviderGroupId: currentUser.value.serviceProviderGroup,
        type: currentUser.value.type,
      };
      feedbackSocket.connect();
      incidentSocket.auth = {
        userId: currentUser.value._id,
        siteId: currentUser.value.site,
        organizationId: currentUser.value.organization,
        serviceProviderId: currentUser.value.serviceProvider,
        serviceProviderGroupId: currentUser.value.serviceProviderGroup,
        type: currentUser.value.type,
      };
      facilitySocket.connect();
      facilitySocket.auth = {
        userId: currentUser.value._id,
        siteId: currentUser.value.site,
        organizationId: currentUser.value.organization,
        serviceProviderId: currentUser.value.serviceProvider,
        serviceProviderGroupId: currentUser.value.serviceProviderGroup,
        type: currentUser.value.type,
      };
      facilitySocket.connect();
    }
    setSnackbar({
      modal: true,
      text: "Successfully updated Notification Settings.",
      type: "success",
    });
    isLoading.value = false;
  } catch (error: any) {
    setSnackbar({
      modal: true,
      text: error || error.message || "Server internal error.",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
}, 1000);
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
