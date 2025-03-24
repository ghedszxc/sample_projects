<template>
  <v-row v-if="smAndDown" no-gutters class="login-background">
    <v-col cols="12">
      <v-row no-gutters class="pa-4">
        <v-col cols="12" class="mb-16 d-flex justify-center align-center">
          <v-img src="/seven365.png" height="48px" width="156px"></v-img>
        </v-col>
        <v-col cols="12" md="8" lg="6">
          <v-row class="pa-8" color="rgba(255, 255, 255, 0)" outlined="false">
            <v-row no-gutters class="fill-height" align-content="center">
              <v-col cols="12">
                <v-form
                  v-model="valid"
                  @submit.prevent="submit(email, password)"
                >
                  <v-row no-gutters>
                    <v-row no-gutters class="ga-3 mb-7">
                      <v-col
                        cols="12"
                        class="text-white font-weight-bold pl-2"
                        style="border-left: 4px solid #e51e4b"
                      >
                        Login with your account
                      </v-col>

                      <v-col cols="12">
                        <v-text-field
                          class="text-white"
                          v-model="email"
                          placeholder="Email"
                          filled
                          :rules="[(v) => !!v || 'Required', validEmail]"
                          density="default"
                          prepend-inner-icon="mdi-email"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          class="text-white"
                          v-model="password"
                          :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="[requiredInput, minPasswordLength]"
                          :type="show ? 'text' : 'password'"
                          name="input-10-2"
                          placeholder="Password"
                          @click:append-inner="show = !show"
                          density="default"
                          filled
                          prepend-inner-icon="mdi-lock-outline"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-col cols="12" class="mb-7">
                      <v-btn
                        class="text rounded-xl"
                        elevation="2"
                        :disabled="!valid"
                        color="primary"
                        type="submit"
                        block
                        size="large"
                        ><v-icon class="mr-2"> mdi-login </v-icon>
                        login
                      </v-btn>
                    </v-col>

                    <v-row no-gutters justify="center">
                      <v-col
                        cols="12"
                        class="mb-7 text-center text-caption"
                        justify="center"
                      >
                        <nuxt-link
                          class="text-white"
                          :to="{ name: 'forgot-password' }"
                        >
                          Forgot password?
                        </nuxt-link>
                      </v-col>
                    </v-row>
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
          </v-row>
          <v-footer
            class="px-0 text-caption"
            style="background-color: #042134; height: 6.5vh"
            app
          >
            <v-row
              class="d-flex px-12 align-items-center w-100 text-white"
              :class="
                $vuetify.display.smAndDown
                  ? 'justify-center'
                  : 'justify-space-between'
              "
              align="center"
              align-content="center"
              justify="center"
              style="flex-wrap: nowrap"
            >
              <span class="text-truncate"
                >© 2024 powered by Seven 365 Pte. Ltd. v.1</span
              >
              <!-- <v-btn class="text-blue rounded-xl" variant="tonal">Need Help?</v-btn> -->
            </v-row>
          </v-footer>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-row
    v-else
    no-gutters
    class="fill-height"
    align-content="center"
    style="position: relative"
  >
    <div style="height: 100vh; position: fixed; top: 0; z-index: 1">
      <v-row no-gutters class="fill-height pl-16" align-content="center">
        <v-card
          width="400"
          elevation="4"
          color="navigationDrawer"
          class="pa-8"
          rounded="xl"
        >
          <v-row no-gutters class="fill-height" align-content="center">
            <v-col cols="12" lg="12" md="12">
              <v-form v-model="valid" @submit.prevent="submit(email, password)">
                <v-row no-gutters>
                  <v-col cols="12" class="mb-7 ml-n4">
                    <v-img src="/seven365.png" height="48px" width="156px">
                    </v-img>
                  </v-col>
                  <v-row no-gutters class="ga-3 mb-7">
                    <v-col cols="12" class=".text">
                      Login with your account
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="email"
                        placeholder="Email"
                        filled
                        :rules="[(v) => !!v || 'Required', validEmail]"
                        density="default"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="password"
                        :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[requiredInput, minPasswordLength]"
                        :type="show ? 'text' : 'password'"
                        name="input-10-2"
                        placeholder="Password"
                        variant="outlined"
                        @click:append-inner="show = !show"
                        density="default"
                        filled
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-col cols="12" class="mb-7">
                    <v-btn
                      class=".text rounded-lg"
                      elevation="2"
                      :disabled="!valid"
                      color="#1867C0"
                      type="submit"
                      block
                      size="large"
                    >
                      login
                    </v-btn>
                  </v-col>
                  <v-row no-gutters justify="center">
                    <nuxt-link
                      class="forgot-password-link"
                      :to="{ name: 'forgot-password' }"
                    >
                      Forgot password?
                    </nuxt-link>
                  </v-row>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </v-card>
      </v-row>
    </div>

    <v-carousel
      :modelValue="activeSlide"
      @update:modelValue="activeSlide = $event"
      :show-arrows="false"
      hide-delimiter-background
      continuous
      cycle
      cover
      style="height: 100vh; position: relative"
      class="custom"
    >
      <template v-for="item in slides" :key="item._id">
        <v-carousel-item>
          <v-img :src="item.img" cover>
            <div class="overlay-container text-caption">
              <div class="dark-overlay"></div>
              <v-row
                no-gutters
                class="fill-height"
                align-content="center"
                justify="end"
              >
                <v-col cols="7">
                  <v-row no-gutters>
                    <template v-for="title in item.title">
                      <v-col
                        cols="12"
                        class="text-white text-h2 font-weight-medium text-shadow"
                      >
                        {{ title }}
                      </v-col>
                    </template>
                    <v-col cols="12" class="text-white pl-2 text-shadow">
                      {{ item.subTitle }}
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-img>
        </v-carousel-item>
      </template>
    </v-carousel>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "guest",
  layout: "plain",
});

import { useDisplay } from "vuetify";
const { smAndDown } = useDisplay();

const { requiredInput, validEmail, minPasswordLength } = useUtils();
const show = ref(false);
const valid = ref(false);
const email = ref("");
const password = ref("");
const activeSlide = ref(0);

const slides = [
  {
    _id: 1,
    title: ["Find Serenity in", "Your New Home"],
    subTitle: "Explore Peaceful Residence",
    // img: "/images/bg/condo.jpg",
    img: `${useRuntimeConfig().public.S3_BUCKET}/images/bg/condo.jpg`,
  },
  {
    _id: 2,
    title: ["Maintenance Solutions", "for Residences"],
    subTitle: "Explore Clean Residence",
    // img: "/images/bg/city.jpg",
    img: `${useRuntimeConfig().public.S3_BUCKET}/images/bg/city.jpg`,
  },
  {
    _id: 3,
    title: ["Secure Your Future"],
    subTitle: "Explore Safe Living Spaces",
    // img: "/images/bg/camera.jpg",
    img: `${useRuntimeConfig().public.S3_BUCKET}/images/bg/camera.jpg`,
  },
];

const { login, getCurrentUser } = useLocalAuth();

const { setSnackbar } = useLocal();

async function submit(email: string, password: string) {
  try {
    const lowercaseEmail = email.toLowerCase();

    await login(lowercaseEmail, password);

    const _user = await getCurrentUser();

    if (_user) {
      switch (_user.type) {
        case "resident":
          await navigateTo({
            name: "residents-resident",
            params: { resident: _user._id },
          });
          break;
        case "admin":
        case "organization":
        case "site":
        case "service-provider":
        case "service-provider-member":
          await navigateTo({ name: "dashboard" });
          break;
        case "leader":
          await navigateTo({ name: "occurrences-today" });
          break;
        default:
          console.error("Unknown user type:", _user.type);
          break;
      }
    }
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}
</script>

<style scoped>
.password-field .v-icon {
  position: relative;
  cursor: pointer;
}

.password-field .v-input__append {
  background-color: white;
}

.text-shadow {
  text-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
}

.overlay-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.dark-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.overlay-container > .v-row {
  position: relative;
  z-index: 2;
}

.forgot-password-link {
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password-link:hover {
  color: #9ab1f6;
  text-decoration: underline;
}

.login-background {
  position: relative;
  background-image: url("https://seven365bucket.s3.ap-southeast-1.amazonaws.com/images/resident/resident-login.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 94.6vh;
}

.login-background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 90%;
  background: linear-gradient(rgba(4, 33, 52, 0.8), rgba(4, 33, 52, 0.3));
  z-index: 1;
}

.v-row {
  position: relative;
  z-index: 2;
}
</style>
