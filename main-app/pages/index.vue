<template>
  <v-row
    no-gutters
    class="fill-height"
    align-content="center"
    style="background-color: #042134"
  >
    <v-col cols="12">
      <v-row no-gutters class="pa-xxl-16 pa-xl-16 pa-lg-16 pa-8">
        <v-col
          cols="12"
          class="text-center text-h2 text-sm-h2 text-md-h2 text-lg-h1 text-xl-h1 text-xxl-h1 font-weight-medium d-flex justify-center"
        >
          <v-img
            src="/seven365.png"
            alt="User Image"
            class="mb-4"
            style="max-width: 20rem"
          ></v-img>
        </v-col>

        <v-col cols="12" class="mt-8">
          <v-row
            no-gutters
            justify="center"
            class="d-flex flex-column items-center align-center w-full"
          >
            <span
              v-if="loggedIn"
              class="mb-2 text-h6 font-weight-bold text-body-2 text-white w-full"
            >
              Continue with
            </span>
            <v-btn
              rounded="xl"
              size="large"
              color="cyan"
              variant="tonal"
              class="wrap-text-button font-weight-bold text-body-2 px-4 text-white d-flex items-center mb-2"
              style="text-transform: none !important"
              @click="signIn"
              ><v-icon class="mr-2"> mdi-account</v-icon>
              <div style="word-break: break-word; white-space: normal; font-size: .8rem">
                <div v-if="loggedIn">
                  {{ email.toLowerCase() }}
                </div>
                <div v-else>Sign In</div>
              </div>
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup>
definePageMeta({
  layout: "plain",
});

const { loggedIn, currentUser, getCurrentUser } = useLocalAuth();

const email = useCookie("user").value;

async function signIn() {
  if (loggedIn.value) {
    if (currentUser.value && currentUser.value.type === "resident") {
      const _user = await getCurrentUser();
      return navigateTo({
        name: "residents-resident",
        params: { resident: _user._id },
      });
    } else {
      return navigateTo({ name: "dashboard" });
    }
  }

  return navigateTo({ name: "login" });
}
</script>

<style scoped>
.wrap-text-button {
  white-space: normal;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 100%;
  max-width: 300px;
  line-height: 1.2;
}
</style>
