<template>
  <v-row no-gutters class="d-flex px-6 pb-0 mb-0">
    <v-col cols="12" class="">
      <v-row no-gutters justify="center" class="mt-11">
        <v-col cols="6" class="d-flex justify-start">
          <div @click="cancel()" style="cursor: pointer">
            <v-img
              :src="imgSrc"
              style="width: 100.153px; margin-left: 10px; margin-top: 6px"
            ></v-img>
          </div>
        </v-col>
        <v-col cols="6" class="d-flex justify-end align-center">
          <div @click="cancel()" style="cursor: pointer">
            <v-avatar rounded="0" style="width: 24px; height: 24px">
              <v-img :src="BackIconimgSrc" cover></v-img>
            </v-avatar>
            <!-- <v-avatar rounded="0" style="width: 24px; height: 24px">
              <v-img src="/images/forgot-password/x-icon.svg" cover></v-img>
            </v-avatar> -->
          </div>
        </v-col>

        <v-col cols="12" class="mt-3 d-flex text-center">
          <v-row no-gutters>
            <v-img height="100%" cover>
              <v-avatar rounded="0" size="190">
                <v-img
                  :color="forgotColorImage"
                  src="/dark-mode/forgot-password/images/forgot.svg"
                  cover
                ></v-img>
              </v-avatar>
            </v-img>
          </v-row>
        </v-col>

        <v-col cols="12" class="mt-6">
          <v-form v-model="valid" @submit.prevent="submit(form)">
            <v-row justify="end">
              <v-col cols="12" class="text-center pb-3">
                <div>
                  <span :class="forgotPasswordClass"> Forgot password?</span>
                  <!-- <span class="forgot-password" light> Forgot password?</span> -->
                  <br class="" />
                  <span
                    :class="forgotPasswordClass"
                    class="subtitle-forgot"
                    style="position: relative; top: 14px"
                    >Please enter your email address below.</span
                  >
                </div>
              </v-col>
            </v-row>

            <v-col cols="12 " class="py-0 mt-6">
              <v-text-field
                label="Email"
                placeholder="Enter email Address"
                v-model="form.email"
                density="comfortable"
                :rules="[requiredInput, validEmail]"
                clearable
                :base-color="baseColor"
                :bg-color="bgColor"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="pt-3">
              <v-btn
                class="button-design"
                color="#E0241C"
                size="large"
                block
                :disabled="!valid"
                type="submit"
              >
                Submit
              </v-btn>
            </v-col>
          </v-form>
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
                <div @click="cancel()" style="cursor: pointer">
                  <v-img
                    :src="imgSrc"
                    style="width: 100.153px; margin-left: 10px; margin-top: 6px"
                  ></v-img>
                </div>
              </v-col>
              <v-col cols="6" class="d-flex justify-end align-center">
                <div @click="cancel()" style="cursor: pointer">
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
                          :color="forgotColorImage"
                          src="/dark-mode/forgot-password/images/email-sent-image.svg"
                          cover
                        ></v-img>
                      </v-avatar>
                    </v-img>
                  </v-card>
                </v-row>
              </v-col>

              <v-col cols="12" class="mt-6">
                <v-row justify="end">
                  <v-col cols="12" class="text-center pb-3">
                    <div class="px-15">
                      <span
                        class="forgot-password"
                        :class="forgotPasswordClass"
                      >
                        Email Sent
                      </span>
                      <br class="" />
                      <span
                        :class="forgotPasswordClass"
                        class="subtitle-forgot"
                        style="position: relative; top: 14px"
                      >
                        A message is sent to your email address for confirmation
                        of password reset
                      </span>
                    </div>
                  </v-col>
                </v-row>

                <v-col cols="12" class="pt-8 d-flex justify-center">
                  <v-btn
                    color="#1867C0"
                    size="large"
                    @click="cancel"
                    width="160px"
                  >
                    Ok
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
                <span class="Subtitle 2 fs12">
                  © 2024 by Seven 365 Pte Ltd V1.0
                </span>
              </v-row>
            </v-col>
          </v-row>
        </v-footer>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import useUtils from "~/composables/useUtils";
const { requiredInput, validEmail } = useUtils();
const { theme } = useLocal();
const valid = ref(false);
const dialog = ref(false);
const form = ref({
  givenName: "",
  surname: "",
  email: "",
  password: "",
  postType: "forgot-password-resident",
});

onMounted(async () => {
  if (!theme.value) theme.value = "light";
});

const baseColor = computed(() =>
  theme.value === "dark" ? "#0F131C" : "#FAFAFAFA",
);

const bgColor = computed(() =>
  theme.value === "dark" ? "#111723" : "#FAFAFAFA",
);

const forgotPasswordClass = computed(() =>
  theme.value === "dark" ? "forgot-password dark-mode" : "forgot-password",
);

const forgotColorImage = computed(() =>
  theme.value === "dark" ? "#0F131C" : "",
);

const imgColor = computed(() => (theme.value === "dark" ? "" : "#72707D"));

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

const { setSnackbar } = useLocal();

async function submit(form) {
  try {
    await $fetch(`/api/auth/users/forgot-password`, {
      method: "POST",
      body: form,
    });

    dialog.value = true;
  } catch (error) {
    setSnackbar({
      text: error.data.message,
      modal: true,
      type: "error",
    });
  }
}

function cancel() {
  useRouter().push({ name: "index" });
}

definePageMeta({
  layout: "plain-footer-none",
});
</script>

<style scoped>
.forgot-password {
  color: #052439;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px; /* 79.167% */
}

.subtitle-forgot {
  color: var(--Grey-sub-text, #555e6f);

  text-align: center;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}

.forgot-password.dark-mode {
  color: #cfd8dc;
}

.button-design {
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}

.card-color {
  /* button-s-red */
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}
</style>
