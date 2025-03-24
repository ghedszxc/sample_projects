<template>
  <v-row no-gutters>
    <v-col cols="12" lg="3" md="3" class="d-md-block d-sm-none d-none">
      <v-img src="/image-1.svg" height="100vh" cover></v-img>
    </v-col>

    <v-col cols="12" lg="9" md="3" class="fill-height">
      <v-row no-gutters>
        <v-col cols="12" lg="6">
          <v-col cols="12" lg="9">
            <v-form v-model="valid" @submit.prevent="signup(form)">
              <v-row no-gutters class="pa-8">
                <v-col cols="12" class="text-h4 mb-8"> Seven 365 </v-col>
                <v-col cols="12" class="text-h5"> Create your account </v-col>
                <v-col cols="12" class="text-subtitle-1 font-weight-bold mb-4">
                  Have an account?
                  <nuxt-link :to="{ name: 'login' }">Log in now</nuxt-link>
                </v-col>
                <v-col cols="12" class="my-2">
                  <v-text-field
                    v-model="form.email"
                    label="Email Address"
                    :rules="[requiredInput, validEmail]"
                    hint="We recommend using your work email"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="my-2">
                  <v-text-field
                    v-model="form.givenName"
                    label="Given Name"
                    :rules="[requiredInput]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="my-2">
                  <v-text-field
                    v-model="form.surname"
                    label="Surname"
                    :rules="[requiredInput]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="my-2">
                  <v-text-field
                    v-model="form.password"
                    :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[requiredInput, minPasswordLength]"
                    :type="show ? 'text' : 'password'"
                    name="input-10-2"
                    label="Password"
                    hint="At least 8 characters"
                    class="input-group--focused"
                    @click:append-inner="show = !show"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="mt-2">
                  <v-btn
                    size="small"
                    rounded="lg"
                    class="font-weight-bold"
                    elevation="2"
                    :disabled="!valid"
                    type="submit"
                  >
                    next
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup>
definePageMeta({
  layout: "plain",
});

const { requiredInput, validEmail, minPasswordLength } = useUtils();
const valid = ref(false);
const show = ref(false);
const form = ref({
  givenName: "",
  surname: "",
  email: "",
  password: "",
});

const { signup } = useLocalAuth();
</script>
