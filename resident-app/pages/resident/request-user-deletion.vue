<template>
  <v-row no-gutters class="px-6 d-flex align-center justify-center">
    <v-col cols="12" class="mt-15">
      <v-row no-gutters class="mt-15"
        ><v-col cols="12" class="d-flex justify-center align-center">
          <v-img
            class="pl-0 ml-0 mt-1"
            src="/delete-account.svg"
            width="154px"
            height="154px"
          ></v-img
        ></v-col>
        <v-col
          cols="12"
          class="mb-6 text-center d-flex justify-center align-center"
        >
          <span class="text-h5 text-center pa-2" v-if="!deletionRequested"
            >Request Account Deletion</span
          >

          <span class="text-h5 pa-2" v-else> Revoke Deletion</span>
        </v-col>
        <v-col cols="6" class="px-2">
          <v-btn
            v-if="!deletionRequested"
            size="x-large"
            color="#E0241C"
            @click="showDialog = true"
            class="text-center"
            block
          >
            Delete
          </v-btn>
          <v-btn
            v-else
            size="x-large"
            color="#E0241C"
            @click="showDialog = true"
            class="text-center px-2"
            block
          >
            Revoke Deletion
          </v-btn>
        </v-col>
        <v-col cols="6" class="pl-2">
          <v-btn
            width="50px"
            size="x-large"
            block
            color="#E0241C"
            class="text-center"
            @click="() => $router.push('/resident/profile')"
          >
            Cancel
          </v-btn></v-col
        ></v-row
      >
    </v-col>
  </v-row>

  <v-dialog v-model="showDialog" max-width="600">
    <v-card>
      <v-card-text>
        <div>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </div>
        <v-text-field
          v-model="password"
          label="Enter your password"
          :type="show ? 'text' : 'password'"
          :rules="[(v) => !!v || 'Password is required']"
          @keyup.enter="confirmDelete"
          :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="show = !show"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="justify-content-center">
        <v-btn color="blue darken-1" @click="showDialog = false">
          Cancel
        </v-btn>
        <v-btn color="red darken-1" @click="confirmDelete">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showDeleted" max-width="600">
    <v-card>
      <v-card-text class="text-center">
        <div v-if="deletionRequested">
          Your account deletion request is pending approval by site personnel
        </div>
        <div v-else>Your account deletion request has been revoked.</div>
      </v-card-text>
      <v-card-actions class="justify-content-center">
        <v-btn color="blue darken-1" @click="showDeleted = false"> OK </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "only-footer",
  middleware: "secure",
});

const show = ref(false);
const { deleteUser, logout } = useLocalAuth();
const { currentUser, getCurrentUser } = useLocalAuth();
const showDialog = ref(false);
const showDeleted = ref(false);
const password = ref<string>("");

const deletionRequested = ref();

onMounted(async () => {
  const data = await getCurrentUser();

  deletionRequested.value = data.deletionRequested;
});

const confirmDelete = async () => {
  const deleted = await deleteUser(password.value);
  if (deleted) {
    showDialog.value = false;
    const data = await getCurrentUser();
    deletionRequested.value = data.deletionRequested;
    showDeleted.value = true;
    // logout();
    // setTimeout(() => {
    //   useRouter().push("/");
    // }, 3000);
  }
};
</script>

<style scoped>
.content {
  text-align: center;
}

.content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
