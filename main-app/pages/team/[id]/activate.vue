<template>
  <v-row
    no-gutters
    justify="center"
    align-content="center"
    class="fill-height py-8"
  >
    <v-col cols="10" lg="8" class="font-weight-light mt-4">
      <v-card width="100%" elevation="0" style="border-width: thin">
        <v-row no-gutters class="pa-8" justify="center">
          <v-img
            src="/images/activate.svg"
            alt="User Image"
            width="12rem"
            height="15rem"
            class="mb-4"
          ></v-img>
          <v-col
            cols="12"
            class="text-h4 font-weight-bold mb-4 text-center"
            style="letter-spacing: 2px !important"
          >
            {{ userName }}
          </v-col>

          <v-col cols="12" class="text-center">
            Are you sure you want to activate this user?
          </v-col>

          <v-col cols="12" class="mt-4">
            <v-row no-gutters justify="center">
              <v-btn
                theme="dark"
                class="font-weight-bold"
                variant="elevated"
                color="red darken-2"
                @click="submit"
              >
                Yes
              </v-btn>
              <v-btn
                variant="outlined"
                class="font-weight-bold ml-4"
                color="accent-4"
                :to="{
                  name: 'team',
                  params: { id },
                }"
              >
                No
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});
const { setSnackbar } = useLocal();
const { updateUserStatusById, getUserByIdLocal } = useUser();
const router = useRouter();
const id = computed(() => useRoute().params.id as string);

async function submit() {
  try {
    await updateUserStatusById({ id: id.value, status: "active" });
    setSnackbar({
      text: "User activated successfully",
      modal: true,
      type: "success",
    });
    router.push({ name: "team" });
  } catch (error: any) {
    setSnackbar({ text: error.message, modal: true, type: "error" });
  }
}
interface User {
  givenName?: string;
  surname?: string;
}

const user: Ref<User> = ref({});
const userName = ref("");
getUserByIdLocal(id.value).then((userData) => {
  if (userData) {
    user.value = userData;
    userName.value = user.value?.givenName + " " + user.value?.surname;
  } else {
    console.error("User data is undefined.");
  }
});
</script>
