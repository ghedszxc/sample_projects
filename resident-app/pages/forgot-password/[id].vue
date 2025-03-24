<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-row no-gutters class="pa-8 overlay">
        <v-col cols="12">
          <v-row no-gutters class="pl-4">
            <v-img :src="LogoSrc" class="image"></v-img>
          </v-row>
        </v-col>

        <v-col cols="12" class="text-center ml-2">
          <v-form
            v-model="valid"
            @submit.prevent="checkPasswords(confirmPassword, password)"
          >
            <v-row justify="end">
              <v-col cols="12">
                <v-row no-gutters justify="center" class="mt-15">
                  <v-card max-width="504" mb-3 rounded="0" flat>
                    <v-img height="100%" cover>
                      <v-avatar rounded="0" size="120">
                        <v-img
                          :color="ColorImage"
                          class="image-design"
                          src="/dark-mode/forgot-password/images/forgot.svg"
                          cover
                        ></v-img>
                      </v-avatar>
                    </v-img>
                  </v-card>
                </v-row>
              </v-col>

              <v-col cols="12" class="text-center pb-3">
                <div>
                  <span
                    :class="forgotPasswordClass"
                    class="reset-style"
                    :color="textColor"
                  >
                    Reset Password</span
                  >
                </div>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" class="mt-6">
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.password"
                      :rules="[requiredInput, minPasswordLength]"
                      label="New Password"
                      density="comfortable"
                      :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append-inner="show = !show"
                      hint="At least 8 characters"
                      :type="show ? 'text' : 'password'"
                      :base-color="baseColor"
                      :bg-color="bgColor"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" class="mt-6">
                    <v-text-field
                      v-model="confirmPassword"
                      :rules="[requiredInput, minPasswordLength]"
                      label="Confirm Password"
                      density="comfortable"
                      :append-inner-icon="
                        showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'
                      "
                      @click:append-inner="
                        showConfirmPassword = !showConfirmPassword
                      "
                      hint="At least 8 characters"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      :base-color="baseColor"
                      :bg-color="bgColor"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" class="mt-3">
                <v-btn
                  :disabled="!valid"
                  block
                  color="#E0241C"
                  size="x-large"
                  class="login-button"
                  type="submit"
                >
                  Reset Password
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>

        <v-col
          cols="12"
          class="mt-10 text-center text-white"
          style="font-size: 12px; opacity: 0.8"
        >
          <v-row no-gutters class="fill-height" align-content="end">
            <!-- <v-col cols="12" class="mt-10"> Need help? </v-col> -->
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card :color="colorCard">
        <v-row no-gutters class="d-flex px-6 pb-0 mb-0">
          <v-col cols="12" class="">
            <v-row no-gutters justify="center" class="mt-11">
              <v-col cols="6" class="d-flex justify-start">
                <div @click="goLogin()" style="cursor: pointer">
                  <v-img
                    :src="imgSrc"
                    style="width: 100.153px; margin-left: 10px; margin-top: 6px"
                  ></v-img>
                </div>
              </v-col>
              <v-col cols="6" class="d-flex justify-end align-center">
                <div @click="goLogin()" style="cursor: pointer">
                  <v-avatar rounded="0" style="width: 24px; height: 24px">
                    <v-img :src="BackIconimgSrc" cover></v-img>
                  </v-avatar>
                </div>
              </v-col>

              <v-col cols="12" class="mt-3">
                <v-row no-gutters justify="center">
                  <v-card max-width="504" mb-3 rounded="0" flat>
                    <v-img height="100%" cover>
                      <v-avatar rounded="0" size="190">
                        <v-img
                          :color="ColorImage"
                          src="/dark-mode/forgot-password/images/email-sent-image.svg"
                          cover
                        ></v-img>
                      </v-avatar>
                    </v-img>
                  </v-card>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-row justify="end">
                  <v-col cols="12" class="text-center pb-3">
                    <div class="px-15">
                      <span class="forgot-password">{{
                        modalMessage.message1
                      }}</span>
                      <br class="" />
                      <span
                        class="subtitle-forgot"
                        style="position: relative; top: 14px"
                        >{{ modalMessage.message }}
                      </span>
                    </div>
                  </v-col>
                </v-row>

                <v-col cols="12" class="pt-8 d-flex justify-center">
                  <v-btn
                    color="#E0241C"
                    size="large"
                    @click="goLogin"
                    width="160px"
                    block
                    rounded="lg"
                  >
                    Log in
                  </v-btn>
                </v-col>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-footer height="44" class="px-0" app :color="colorCard">
          <v-row no-gutters class="px-12">
            <v-col cols="12" class="text-caption pt-1">
              <v-row no-gutters justify="center">
                <span class="Subtitle 2 fs12"
                  >© 2024 by Seven 365 Pte Ltd V1.0</span
                >
              </v-row>
            </v-col>
          </v-row>
        </v-footer>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "plain-footer-none",
});
import useUtils from "~/composables/useUtils";
const { requiredInput, minPasswordLength } = useUtils();
const { login, getCurrentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const { theme } = useLocal();

const show = ref(false);
const showConfirmPassword = ref(false);
const valid = ref(false);

const password = ref("");
const confirmPassword = ref("");
const dialog = ref(false);
const form = ref({
  id: useRoute().params.id,
  password: "",
});
const modalMessage = ref({
  message: "Your password has been successfully changed.",
  modalIcon: "/images/forgot-password/verified.svg",
  message1: "Password Changed!",
  messageError: "",
});

const forgotPasswordClass = computed(() =>
  theme.value === "dark" ? "forgot-password dark-mode" : "forgot-password",
);

const LogoSrc = computed(() =>
  theme.value === "dark"
    ? "/seven365.png"
    : "/dark-mode/forgot-password/images/seven365Logo.svg",
);

const ColorImage = computed(() => (theme.value === "dark" ? "#0F131C" : ""));

const baseColor = computed(() =>
  theme.value === "dark" ? "#0F131C" : "#FAFAFAFA",
);

const bgColor = computed(() =>
  theme.value === "dark" ? "#111723" : "#FAFAFAFA",
);

const colorCard = computed(() =>
  theme.value === "dark" ? "#0F131C" : "#FFFFFF",
);

const imgSrc = computed(() =>
  theme.value === "dark"
    ? "/images/resident/dark/seven-365.svg"
    : "/images/resident/light/seven-365.svg",
);

const BackIconimgSrc = computed(() =>
  theme.value === "dark"
    ? "/dark-mode/forgot-password/images/back.svg"
    : "/dark-mode/forgot-password/images/back-light.svg",
);

const isFormValid = computed(() => password.value && confirmPassword.value);

const checkPasswords = () => {
  if (form.value.password !== confirmPassword.value) {
    setSnackbar({
      text: "Passwords do not match.",
      modal: true,
      type: "error",
    });
  } else {
    submit(form.value);
  }
};

async function submit(form) {
  try {
    const result = await $fetch(`/api/auth/users/forgot-password`, {
      method: "PUT",
      body: form,
    });
    if (result) {
      dialog.value = true;
    }
    // dialog.value = true;
  } catch (error) {
    if (error && error.data && error.data.message) {
      modalMessage.value.message = error.data.message;
      modalMessage.value.message1 = "Password Change Failed!";
      modalMessage.value.modalIcon = "/images/forgot-password/error.gif";
      dialog.value = true;
    }
  }
}

function goLogin() {
  useRouter().push({ name: "index" });
}
</script>
<style scoped>
.image {
  height: 40px;
}

.text {
  font-size: 16px;
  line-height: 24px;
  opacity: 0.6;
}

.login-button {
  font-size: 16px;
  line-height: 52px;
  border-radius: 8px;
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}

.form-container {
  margin-top: 280px;
}
.v-btn[disabled] {
  background-color: #090909 !important;
  cursor: not-allowed !important;
}

.reset-style {
  text-align: right;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 100% */
}
</style>
