<template>
  <v-dialog max-width="400" v-model="isConfirmModalCross" persistent>
    <v-card class="rounded-xl">
      <v-toolbar>
        <v-title-toolbar class="pl-4 text-h6"
          >Are you sure to delete ?</v-title-toolbar
        >
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="isConfirmModalCross = false"></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row class="justify-center mb-7 mt-3">
          <v-img
            src="/images/dob/forgot-password.svg"
            width="130px"
            height="130px"
          ></v-img>
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
              @click="signCrossEntry()"
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
const { confirmSign, isConfirmModalCross, isSigned } = useOccurrenceEntry();
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();

const username = ref("");
const password = ref("");
const errMsg = ref("");

const emit = defineEmits(["signCross"]);
defineProps(["isConfirmTitle"]);

const signCrossEntry = async () => {
  try {
    let data = await confirmSign({
      user: currentUser.value._id,
      password: password.value,
    });
    if (!data) {
      errMsg.value = data.message;
      return;
    }

    password.value = "";
    setSnackbar({ text: data.message, modal: true, type: "success" });
    emit("signCross", data.value);
  } catch (error: any) {
    setSnackbar({ text: error, modal: true, type: "error" });
    errMsg.value = error;
  }
};
</script>
