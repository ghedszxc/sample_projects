<template>
  <v-row no-gutters>
    <!-- go back -->
    <v-col
      cols="6"
      :class="`mt-3 pb-3 ${$vuetify.display.smAndUp ? 'px-6' : 'px-3'}`"
      @click="goBack()"
    >
      <v-icon
        start
        size="x-large"
        style="position: relative; right: 5px; top: 1px"
      >
        <v-img
          class="pl-0 ml-0 mt-2"
          src="/dark-mode/utility-all/right-arrow.svg"
          cover
        ></v-img>
      </v-icon>
      <span style="position: relative; right: 15px; top: 1px"> Go Back </span>
    </v-col>

    <!-- header -->
    <v-col cols="12" class="header">
      <!-- profile image -->
      <v-card variant="flat" width="100" height="100" :class="cardProfileImage">
        <label
          v-if="editable"
          :for="editable ? 'file' : ''"
          @click="(e: Event) => editable || e.preventDefault()"
          :style="!editable && 'cursor: default'"
        >
          <v-avatar
            size="32"
            style="
              position: absolute;
              right: 12px;
              z-index: 12;
              background: var(
                --icon-gradient,
                linear-gradient(180deg, #b9b8c0 0%, #57565a 100%)
              );
            "
          >
            <v-icon icon="mdi-camera-outline" size="14" color="white"></v-icon>
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
        <v-img
          :src="
            currentUser.profilePicture
              ? `/api/files/${currentUser.profilePicture}`
              : '/default-profile.svg'
          "
          class="profile-image"
          :style="{ marginLeft: theme === 'dark' ? '10px' : '10px' }"
          elevation="0"
        ></v-img>
      </v-card>
      <!-- background image -->
      <v-img :class="headerBackgroundImage">
        <!-- site name -->
        <v-chip variant="outlined" size="small" class="ml-4 mt-6 chip">
          <span class="chip-text text-capitalize">
            {{ siteName }}
          </span>
        </v-chip>
        <v-row no-gutters class="fill-height px-6 mt-3" align-content="end">
          <v-col cols="12" class="pb-3">
            <v-row no-gutters>
              <v-col :cols="$vuetify.display.smAndUp ? '5' : '4'"> </v-col>
              <!-- full name, block name, level name, unit name, resident type -->
              <v-col cols="7" class="text-capitalize">
                <v-row no-gutters>
                  <v-col
                    :cols="$vuetify.display.smAndDown ? '9' : '8'"
                    class="mb-3"
                  >
                    <v-row no-gutters>
                      <!-- full name -->
                      <v-col
                        cols="12"
                        :class="`${residentName} font-weight-bold text-truncate`"
                      >
                        {{ currentUser.givenName }}
                        {{ currentUser.surname }}
                      </v-col>
                      <!-- block name, level name, unit name -->
                      <v-col
                        cols="12"
                        :class="`${blockLevelUnit} `"
                        class="mt-1"
                      >
                        {{ currentUser.blockName }}
                        {{ currentUser.levelName }}
                        {{ currentUser.unitName }}
                      </v-col>
                    </v-row>
                  </v-col>
                  <!-- resident type -->
                  <v-col :cols="$vuetify.display.smAndDown ? '3' : '4'">
                    <v-chip variant="outlined" size="small" class="mt-3 chip">
                      <span class="chip-text text-capitalize">
                        {{ currentUser.type }}
                      </span>
                    </v-chip>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-img>
    </v-col>

    <!-- title-->
    <v-col cols="12" :class="`${titleColor} font-weight-bold mt-10 px-6`">
      Personal Information
    </v-col>

    <v-form ref="profileForm" style="width: 100%">
      <v-row no-gutters>
        <!-- firstname and lastname -->
        <v-col cols="12" class="mt-6 px-6">
          <v-row no-gutters>
            <v-col cols="6" class="pr-2">
              <v-text-field
                :variant="editable ? 'outlined' : 'solo'"
                :base-color="baseColor"
                :bg-color="bgColor"
                v-model="currentUser.givenName"
                density="default"
                label="First Name"
                :rules="[requiredInput]"
                hide-details
                :readonly="!editable"
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="6" class="pl-2">
              <v-text-field
                :variant="editable ? 'outlined' : 'solo'"
                :base-color="baseColor"
                :bg-color="bgColor"
                v-model="currentUser.surname"
                density="default"
                label="Last Name"
                :rules="[requiredInput]"
                hide-details
                :readonly="!editable"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <!-- email -->
        <v-col cols="12" class="mt-6 px-6">
          <v-text-field
            :variant="editable ? 'outlined' : 'solo'"
            :base-color="baseColor"
            :bg-color="bgColor"
            v-model="currentUser.email"
            density="default"
            label="Email Address"
            hide-details
            :rules="[requiredInput, validEmail]"
            :readonly="!editable"
          ></v-text-field>
        </v-col>

        <!-- mobile phone -->
        <v-col cols="12" class="mt-6 px-6">
          <v-row no-gutters>
            <v-col cols="5" class="py-0 pr-1 pr-4">
              <v-select
                :variant="editable ? 'outlined' : 'solo'"
                :base-color="baseColor"
                :bg-color="bgColor"
                v-model="prefix"
                density="default"
                :items="prefixes"
                item-title="country"
                item-value="value"
                :rules="[requiredInput]"
                hide-details
                menu-icon="mdi-chevron-down"
                chips
                :readonly="!editable"
              >
                <template v-slot:chip="{ props, item }">
                  <v-row no-gutters v-bind="props">
                    <v-col cols="6">
                      <v-avatar size="20" :image="item.raw.flag" class="mr-3">
                      </v-avatar>
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
            <v-spacer></v-spacer>
            <v-col cols="7">
              <v-text-field
                :variant="editable ? 'outlined' : 'solo'"
                :base-color="baseColor"
                :bg-color="bgColor"
                v-model="primaryPhone"
                :rules="[requiredInput]"
                density="default"
                label="Contact Number"
                hide-details
                :readonly="!editable"
                @input="validatePhoneNumber"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <!-- NRIC/ID No. -->
        <v-col cols="12" class="mt-6 px-6" v-if="editable">
          <v-text-field
            :variant="editable ? 'outlined' : 'solo'"
            :base-color="baseColor"
            :bg-color="bgColor"
            v-model="currentUser.nric"
            :rules="[requiredInput]"
            label="NRIC/Passport Number"
            placeholder="Enter identificaion ID"
            required
            density="default"
            filled
            variant="outlined"
            hide-details
            :readonly="!editable"
            :append-inner-icon="showNricID ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showNricID = !showNricID"
            :type="showNricID ? 'text' : 'password'"
          ></v-text-field>
        </v-col>

        <v-col cols="12" class="mt-6 px-6" v-else>
          <v-card :base-color="baseColor" :bg-color="bgColor">
            <v-card-text class="py-2">
              <v-row no-gutters>
                <v-col cols="10">
                  <v-card-subtitle class="pa-0 ma-0" style="font-size: 12px">
                    NRIC/Passport Number
                  </v-card-subtitle>
                  <div
                    style="display: flex; justify-content: space-between"
                    class="pt-1"
                  >
                    <span style="font-size: 16px">{{
                      showFullNric ? currentUser.nric : maskedNric
                    }}</span>
                  </div>
                </v-col>
                <v-col class="d-flex justify-end align-center">
                  <v-icon
                    @click="toggleNricVisibility"
                    :color="mdiEyeColor"
                    size="large"
                  >
                    {{ showFullNric ? "mdi-eye" : "mdi-eye-off" }}
                  </v-icon>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- date of birth -->

        <v-col cols="12" class="mt-6 px-6">
          <v-menu
            :close-on-content-click="false"
            v-model="menu"
            :disabled="!editable"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                :variant="editable ? 'outlined' : 'solo'"
                :base-color="baseColor"
                :bg-color="bgColor"
                class="mb-6"
                v-model="formattedDateOfBirth"
                :rules="[requiredInput]"
                label="Date of Birth"
                placeholder="DD/MM/YYYY"
                required
                density="default"
                filled
                outlined
                v-bind="props"
                hide-details
                readonly
              >
                <template #prepend-inner>
                  <div style="width: 35px" class="pl-2 pr-1">
                    <v-img :src="calendarImgSrc" class="cursor-pointer" />
                  </div>
                </template>
              </v-text-field>
            </template>
            <v-date-picker
              v-model="editableDateOfBirth"
              @update:modelValue="onDateSelected"
            >
              <template v-slot:header="{}"></template>
            </v-date-picker>
          </v-menu>
        </v-col>

        <!-- vehicle model -->
        <v-col cols="12" class="px-6">
          <v-text-field
            :variant="editable ? 'outlined' : 'solo'"
            :base-color="baseColor"
            :bg-color="bgColor"
            v-model="currentUser.vehicleModel"
            class="mb-6"
            label="Vehicle Model"
            placeholder="Enter Vehicle Model"
            density="default"
            filled
            hide-details
            :readonly="!editable"
          ></v-text-field>
        </v-col>

        <!-- vehicle model and color -->
        <v-col cols="12" class="px-6" v-if="currentUser.vehicleModel">
          <v-row no-gutters>
            <!-- vehicle model -->
            <v-col cols="6" class="pr-2">
              <v-text-field
                :variant="editable ? 'outlined' : 'solo'"
                :base-color="baseColor"
                :bg-color="bgColor"
                v-model="currentUser.vehicleNo"
                class="mb-6"
                label="Vehicle No."
                placeholder="Enter vehicle no."
                density="default"
                filled
                hide-details
                :readonly="!editable"
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <!-- vehicle color -->
            <v-col cols="6" class="pl-2">
              <v-text-field
                :variant="editable ? 'outlined' : 'solo'"
                :base-color="baseColor"
                :bg-color="bgColor"
                class="mb-6"
                v-model="currentUser.vehicleColor"
                label="Vehicle color"
                placeholder="Enter vehicle color"
                density="default"
                filled
                variant="outlined"
                hide-details
                :readonly="!editable"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <!-- Password -->
        <v-col cols="12" class="px-6">
          <v-text-field
            :variant="editable ? 'outlined' : 'solo'"
            :base-color="baseColor"
            :bg-color="bgColor"
            class="mb-6"
            v-model="currentUser.password"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
            :rules="
              !editable
                ? []
                : [
                    (v) =>
                      v === '' ||
                      v.length >= 8 ||
                      'Password must be at least 8 characters',
                  ]
            "
            :type="showPassword ? 'text' : 'password'"
            label="Current Password"
            placeholder="*********"
            required
            density="default"
            filled
            hint="Empty or at least 8 characters"
            :readonly="!editable"
          ></v-text-field>
        </v-col>
        <!--New Password -->
        <v-col cols="12" class="px-6">
          <v-text-field
            :variant="editable ? 'outlined' : 'solo'"
            :base-color="baseColor"
            :bg-color="bgColor"
            class="mb-6"
            v-model="userPassword.new"
            :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showNewPassword = !showNewPassword"
            :rules="
              !editable
                ? []
                : [
                    (v) =>
                      v === '' ||
                      v.length >= 8 ||
                      'Password must be at least 8 characters',
                  ]
            "
            :type="showNewPassword ? 'text' : 'password'"
            label="New Password"
            placeholder="*********"
            required
            density="default"
            filled
            hint="Empty or at least 8 characters"
            :readonly="!editable"
          ></v-text-field>
        </v-col>

        <!-- Confirm Password -->
        <v-col cols="12" class="px-6">
          <v-text-field
            :variant="editable ? 'outlined' : 'solo'"
            :base-color="baseColor"
            :bg-color="bgColor"
            v-model="confirm_password"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
            :rules="[matchWithPassword]"
            :type="showConfirmPassword ? 'text' : 'password'"
            label="Confirm Password"
            placeholder="*********"
            required
            density="default"
            filled
            hint="Must be the same with password"
            :readonly="!editable"
          ></v-text-field>
        </v-col>

        <!-- edit/save profile -->
        <v-col cols="12" class="mt-6 px-6">
          <v-btn
            block
            flat
            color="#1867C0"
            size="x-large"
            class="edit-button"
            @click="!editable ? (editable = true) : saveProfile()"
          >
            {{ !editable ? "Edit Profile" : "Save" }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <!-- request deletion -->
    <v-col cols="12" class="mt-6 px-6">
      <v-btn
        block
        color="#E0241C"
        size="x-large"
        class="request-deletion-button"
        to="/resident/request-user-deletion"
      >
        Request Deletion
      </v-btn>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import phoneCode from "./phone-code.json";
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

const { currentUser, getCurrentUser } = useLocalAuth();

const { uploadProfilePicture, user, verifyPassword } = useUser();

const editableDateOfBirth: any = ref(null);
const file = ref<File>();
const menu = ref(false);
const profileForm: any = ref(null);

const formattedDateOfBirth = computed(() => {
  if (!currentUser.value.dateOfBirth) return "";
  const formattedDate = new Date(
    currentUser.value.dateOfBirth,
  ).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const [month, day, year] = formattedDate.split("/");
  return `${day}/${month}/${year}`;
});

const onDateSelected = <T,>(value: T) => {
  currentUser.value.dateOfBirth = new Date(value as any).toISOString();
  menu.value = false;
};

async function handleFile() {
  if (!file.value) return;
  isLoading.value = true;
  const upload = (await uploadProfilePicture(file.value)) as {
    id: string;
    message: string;
  };
  currentUser.value.profilePicture = upload.id;
  isLoading.value = false;
}

const calendarImgSrc = computed(() =>
  theme.value === "dark"
    ? "/dark-mode/invite-visitor/calendar-dark.svg"
    : "/dark-mode/invite-visitor/calendar-light.svg",
);

const matchWithPassword = computed(() => {
  return (
    confirm_password.value === userPassword.value.new ||
    "Must match with password"
  );
});

const editable = ref(false);

const { requiredInput, validEmail, minPasswordLength } = useUtils();

const validatePhoneNumber = () => {
  primaryPhone.value = primaryPhone.value.replace(/\D/g, "");
};

const prefixes = phoneCode;

const prefix = ref<string | undefined>("");

const primaryPhone = ref("");

const dateOfBirth = computed(() => {
  const date = new Date(currentUser.value.dateOfBirth);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
});

const showPassword = ref(false);
const showNricID = ref<boolean>(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const confirm_password = ref("");
const userPassword = ref({
  old: "",
  new: "",
});
const siteName = ref("");

const { getSiteById } = useSite();

onMounted(async () => {
  if (!theme.value) theme.value = "light";

  const res = await getSiteById(currentUser.value.site);
  siteName.value = res.name;

  primaryPhone.value = currentUser.value.primaryPhone.split(" ")[1];

  prefix.value = phoneCode.find(
    (i) => i.dial_code === currentUser.value.primaryPhone.split(" ")[0],
  )?.country;
  editableDateOfBirth.value = new Date(currentUser.value.dateOfBirth);
});

const { theme, setSnackbar } = useLocal();

const back = computed(() =>
  theme.value === "dark" ? "go-back-dark" : "go-back-light",
);

function goBack() {
  useRouter().push({ name: "menu" });
}

const headerBackgroundImage = computed(() =>
  theme.value === "dark"
    ? "header-background-image-dark"
    : "header-background-image-light",
);

const cardProfileImage = computed(() =>
  theme.value === "dark"
    ? "card-profile-image-dark"
    : "card-profile-image-light",
);

const residentName = computed(() =>
  theme.value === "dark" ? "resident-name-dark" : "resident-name-light",
);

const blockLevelUnit = computed(() =>
  theme.value === "dark" ? "block-level-unit-dark" : "block-level-unit-light",
);

const titleColor = computed(() =>
  theme.value === "dark" ? "title-dark" : "title-light",
);

const baseColor = computed(() =>
  theme.value === "dark" ? "#FAFAFAFA" : "#111723",
);

const bgColor = computed(() =>
  theme.value === "dark" ? "#111723" : "#FAFAFAFA",
);

const mdiEyeColor = computed(() =>
  theme.value === "dark" ? "#B8BABD" : "#777777",
);
const isLoading = ref(false);
const { updateProfile } = useUser();

async function saveProfile() {
  if (profileForm.value) {
    const validationResult = await profileForm.value.validate();

    if (validationResult.valid) {
      try {
        isLoading.value = true;

        if (confirm_password.value && userPassword.value.new) {
          // check if current password is exist/correct use this verifyUserUsingPassword /verify-password
          const verified = await verifyPassword({
            id: currentUser.value._id,
            password: currentUser.value.password,
          });
          if (!verified.value) throw new Error(verified.message);
          currentUser.value.password = userPassword.value.new;
        } else {
          // if you dont update password
          currentUser.value.password = "";
        }

        const dial_code = phoneCode.find(
          (i) => i.country === prefix.value,
        )?.dial_code;

        const data: any = {
          givenName: currentUser.value.givenName,
          surname: currentUser.value.surname,
          email: currentUser.value.email,
          primaryPhone: `${dial_code} ${primaryPhone.value}`,
          nric: currentUser.value.nric,
          dateOfBirth: currentUser.value.dateOfBirth,
          vehicleModel: currentUser.value.vehicleModel,
          vehicleNo: currentUser.value.vehicleNo,
          vehicleColor: currentUser.value.vehicleColor,
          password: currentUser.value.password,
          profilePicture: currentUser.value.profilePicture,
        };

        const updateUser: any = await updateProfile(data);

        setSnackbar({
          text: updateUser,
          modal: true,
          type: "success",
        });
        editable.value = false;
      } catch (error) {
        setSnackbar({
          text: error,
          modal: true,
          type: "error",
        });
      } finally {
        isLoading.value = false;

        const newData = await getCurrentUser();
        currentUser.value = newData;
      }
    } else {
      setSnackbar({
        text: "Please fill in all required fields in red.",
        modal: true,
        type: "error",
      });
    }
  } else {
    setSnackbar({
      text: "Failed to Load the form. Please refresh the page.",
      modal: true,
      type: "error",
    });
  }
}

const showFullNric = ref(false);
const maskedNric = computed(() => {
  return "******" + currentUser.value.nric.slice(-4);
});

const toggleNricVisibility = () => {
  showFullNric.value = !showFullNric.value;
};
</script>

<style scoped>
.chevron-icon {
  filter: drop-shadow(0px 4px 10px #d01b1b);
}
.go-back-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}
.go-back-dark {
  color: #fcfcfc;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}
.header {
  position: relative;
}
.header-background-image-light {
  height: 212px;
  background:
    linear-gradient(180deg, rgba(20, 22, 39, 0) 25.66%, #fff 83.16%),
    url("/images/resident/home.png") no-repeat lightgray 50% / cover;
  box-shadow: inset 0 -1px 0 rgb(255, 255, 255);
  border: 0;

  /* background: linear-gradient(180deg, rgba(20, 22, 39, 0) 25.66%, #fff 83.16%),
    url("/images/resident/home.png") lightgray 50% / cover no-repeat, #111824; */
}

.header-background-image-dark {
  height: 212px;
  background:
    linear-gradient(180deg, rgba(20, 22, 39, 0) 0%, #131218 100%),
    url("/images/resident/home.png") no-repeat lightgray 50% / cover;
  box-shadow: inset 0 -1px 0 rgb(255, 255, 255);
  border: 0px solid #131218;

  /* background: linear-gradient(180deg, rgba(20, 22, 39, 0) 25.66%, #fff 83.16%),
    url("/images/resident/home.png") lightgray 50% / cover no-repeat, #111824; */
}
.card-profile-image-light {
  position: absolute;
  bottom: -35px;
  left: 15px;
  z-index: 1;
  border-radius: 757.819px;
  align-content: center;
}
.card-profile-image-dark {
  position: absolute;
  bottom: -35px;
  left: 15px;
  z-index: 1;
  border-radius: 757.819px;
  /* border: 11.89px solid #131218; */
  align-content: center;
}
.profile-image {
  width: 81px;
  height: 81px;
  border-radius: 757.819px;
  border: 2px solid var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(224, 36, 28, 0.2);
}
.resident-name-light {
  color: #111824;
  font-size: 17px;
  font-style: normal;
  line-height: 24px;
}
.resident-name-dark {
  color: var(--Light, #dfe2e9);
  font-size: 17px;
  font-style: normal;
  line-height: 24px;
}
.block-level-unit-light {
  color: #111824;
  text-shadow:
    0px 4px 10px rgba(0, 0, 0, 0.3),
    0px 16px 30px rgba(0, 0, 0, 0.9);
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  opacity: 0.7;
}
.block-level-unit-dark {
  color: var(--Light, #dfe2e9);
  text-shadow:
    0px 4px 10px rgba(0, 0, 0, 0.3),
    0px 16px 30px rgba(0, 0, 0, 0.9);
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  opacity: 0.7;
}
.chip {
  border-radius: 24px;
  border: 1px solid var(--Primary, #eb261e);
  background: var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
  position: absolute;
}
.chip-text {
  color: #fff;
  text-shadow:
    0px 4px 10px rgba(0, 0, 0, 0.3),
    0px 16px 30px rgba(0, 0, 0, 0.9);
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;

  margin-top: 1px;
}
.title {
  color: #052439;
  font-size: 20px;
  line-height: 32px;
}
.title-dark {
  font-size: 20px;
  line-height: 32px;
  color: #fcfcfc;
}
.grey-field {
  background-color: #f2f2f2;
}

.edit-button {
  font-size: 16px;
  line-height: 52px;
  border-radius: 8px;
}

.request-deletion-button {
  font-size: 16px;
  line-height: 52px;
  border-radius: 8px;
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}
</style>
