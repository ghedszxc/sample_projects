<template>
  <v-dialog max-width="400" v-model="isDialogVisible">
    <v-card class="rounded-xl">
      <v-toolbar color="transparent">
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="hideModal" />
      </v-toolbar>
      <v-card-text>
        <v-row class="justify-center mb-7 mt-3">
          <slot name="image">
            <v-img
              src="/images/dob/forgot-password.svg"
              width="130px"
              height="130px"
            ></v-img>
          </slot>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" class="text-center">
            <span class="font-weight-bold text-h6">{{
              isConfirmTitle || "Confirm Password to Sign"
            }}</span>
          </v-col>

          <v-col cols="12">
            <input style="opacity: 0; position: absolute" />
            <v-text-field
              v-model="password"
              class="mt-4"
              type="password"
              density="comfortable"
              :hint="errMsg"
              autocomplete="new-password"
              label="Enter Password"
            ></v-text-field>
          </v-col>

          <v-col cols="12" class="text-center">
            <v-btn
              color="#1867C0"
              type="submit"
              class="my-4 w-100 rounded-lg"
              height="40px"
              @click="signPassword()"
              :loading="loading"
            >
              Confirm
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const { confirmSign, isSigned } = useOccurrenceEntry();
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();

const username = ref("");
const password = ref("");
const errMsg = ref("");
const loading = ref(false);

const emit = defineEmits(["confirmSign", "closeModal"]);

let props = defineProps({
  isConfirmTitle: {
    type: String,
  },
  isConfirmModal: {
    type: Boolean,
    default: false,
  },
});

const isDialogVisible = computed(() => props.isConfirmModal);

const hideModal = () => {
  emit("closeModal", false);
};
const signPassword = async () => {
  try {
    loading.value = true;
    let data = await confirmSign({
      user: currentUser.value._id,
      password: password.value,
    });

    errMsg.value = !data ? data.message : "";
    password.value = "";
    setSnackbar({ text: data.message, modal: true, type: "success" });
    loading.value = false;
    emit("confirmSign", data.value);
  } catch (error: any) {
    setSnackbar({ text: error, modal: true, type: "error" });
    errMsg.value = error;
    loading.value = false;
  }
};
</script>
