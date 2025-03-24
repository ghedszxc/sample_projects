<template>
  <v-row no-gutters class="pa-8">
    <!-- image -->
    <v-col cols="12">
      <v-row no-gutters>
        <v-img :src="imageSource" class="image"></v-img>
      </v-row>
    </v-col>

    <!-- text -->
    <v-col cols="12" :class="`${text} font-weight-bold mt-6`">
      Login with your account
    </v-col>

    <!-- form -->
    <v-col cols="12">
      <v-form v-model="valid" @submit.prevent="submit(email, password)">
        <v-row no-gutters>
          <v-col cols="12" class="mt-8">
            <v-row no-gutters>
              <v-col cols="12">
                <v-text-field
                  v-model="email"
                  :rules="[requiredInput, validEmail]"
                  variant="outlined"
                  placeholder="Email"
                  density="comfortable"
                  hide-details
                  rounded="lg"
                  :bg-color="!email ? `${bgColor}` : '#fff'"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="mt-6">
                <v-text-field
                  v-model="password"
                  :rules="[requiredInput, minPasswordLength]"
                  :type="show ? 'text' : 'password'"
                  variant="outlined"
                  placeholder="Password"
                  density="comfortable"
                  hide-details
                  :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="show = !show"
                  rounded="lg"
                  :bg-color="!password ? `${bgColor}` : '#fff'"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <!-- login button -->
          <v-col cols="12" class="mt-6">
            <v-btn
              block
              color="#E0241C"
              size="x-large"
              class="login-button"
              :style="
                valid
                  ? 'box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);'
                  : ''
              "
              type="submit"
              :loading="loading"
            >
              Log in
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-col>

    <!-- create account -->
    <v-col cols="6" class="text-center mt-8" style="margin-bottom: 150px">
      <nuxt-link
        :to="{ name: 'create-account-terms-condition' }"
        class="text-decoration-none"
        :style="`
          color: ${
            theme === 'dark' ? '#CFD8DC' : 'var(--Secondary-Dark, #0f131c)'
          };
          font-size: 16px;
          font-style: normal;
          font-weight: 300;
          line-height: normal;
        `"
        @click="deleteLocalStorage()"
      >
        Create an account
      </nuxt-link>
    </v-col>

    <!-- forgot password -->
    <v-col cols="6" class="text-center mt-8">
      <nuxt-link
        :to="{ name: 'forgot-password' }"
        class="text-decoration-none"
        :style="`
          color: ${
            theme === 'dark' ? '#CFD8DC' : 'var(--Secondary-Dark, #0f131c)'
          };
          font-size: 16px;
          font-style: normal;
          font-weight: 300;
          line-height: normal;
        `"
      >
        Forgot password
      </nuxt-link>
    </v-col>

    <!-- footer -->
    <v-col cols="12" class="text-center">
      <nuxt-link
        :to="{ name: 'coming-soon' }"
        class="need-help text-decoration-none"
      >
        Need help?
      </nuxt-link>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "footer",
});

const { theme } = useLocal();

const { setResidentValue } = useResident();

const { requiredInput, validEmail, minPasswordLength } = useUtils();
const loading = ref(false);
const show = ref(false);
const valid = ref(false);
const email = ref("");
const password = ref("");

const { login, getCurrentUser } = useLocalAuth();

const { setSnackbar } = useLocal();

onMounted(async () => {
  if (!theme.value) theme.value = "light";
});

const imageSource = computed(() =>
  theme.value === "dark"
    ? "/images/resident/dark/seven-365.svg"
    : "/images/resident/light/seven-365.svg",
);

const text = computed(() =>
  theme.value === "dark" ? "text-dark" : "text-light",
);

const bgColor = computed(() =>
  theme.value === "dark"
    ? "var(--Corporate-blue, #111723)"
    : "rgba(250, 250, 250, 0.98)",
);

async function submit(email: string, password: string) {
  loading.value = true;
  try {
    if (email && password) {
      const lowercaseEmail = email.toLowerCase();

      const userData = await login(lowercaseEmail, password);

      if (userData) {
        const prefix = userData.primaryPhone?.split(" ")[0];
        const primaryPhone = userData.primaryPhone?.split(" ")[1];

        localStorage.setItem(
          "resident",
          JSON.stringify({ ...userData, prefix, primaryPhone }),
        );
        await navigateTo({
          name: "remarks",
        });
      }

      const _user = await getCurrentUser();

      if (_user) {
        await navigateTo({
          name: "resident",
        });
      }
    } else if (email) {
      setSnackbar({
        text: "Please fill in the password.",
        modal: true,
        type: "error",
      });
    } else if (password) {
      setSnackbar({
        text: "Please fill in the email.",
        modal: true,
        type: "error",
      });
    } else {
      setSnackbar({
        text: "Please fill in the email and password.",
        modal: true,
        type: "error",
      });
    }
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  loading.value = false;
}

function deleteLocalStorage() {
  setResidentValue();
  localStorage.removeItem("resident");
}
</script>
<style scoped>
.image {
  width: 208.407px;
  height: 100px;
  margin-top: 130px;
}
.text-light {
  color: var(--Secondary-Dark, #0f131c);
  text-align: center;
  font-size: 24px;
  font-style: normal;
  line-height: 24px;
}

.text-dark {
  color: #cfd8dc;
  text-align: center;
  font-size: 24px;
  font-style: normal;
  line-height: 24px;
}

.login-button {
  font-size: 16px;
  line-height: 52px;
  border-radius: 8px;
}

.need-help {
  text-align: center;
  color: #e0241c;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
}

.footer {
  text-align: center;
  color: var(--Grey-sub-text, #555e6f);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
</style>
