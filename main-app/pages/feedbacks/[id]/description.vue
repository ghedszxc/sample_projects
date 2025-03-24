<template>
  <v-row no-gutters justify="center" class="py-8">
    <v-col cols="11" md="6" class="font-weight-light mt-4">
      <v-card
        width="100%"
        elevation="0"
        style="border-width: thin"
        min-height="368px"
      >
        <v-form v-model="isFeedbackValid" @submit.prevent="submit()">
          <v-row no-gutters class="pa-8" justify="center">
            <v-col
              cols="12"
              class="text-h4 font-weight-bold mb-7 text-capitalize"
              style="letter-spacing: 2px !important"
            >
              Update Description
            </v-col>

            <v-col>
              <span class="font-weight-bold">Description</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="feedback.description"
                density="comfortable"
                :rules="[requiredInput]"
                clearable
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-row no-gutters>
                <v-btn
                  theme="dark"
                  class="font-weight-bold"
                  :disabled="!isFeedbackValid"
                  type="submit"
                >
                  submit
                </v-btn>
                <v-btn
                  variant="text"
                  class="font-weight-bold"
                  @click="cancel()"
                >
                  cancel
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const { requiredInput } = useUtils();

const { feedback, isFeedbackValid, updateFeedbackDescriptionById } =
  useFeedback();

function goBack() {
  useRouter().back();
}

async function cancel() {
  goBack();
}

const { setSnackbar } = useLocal();

async function submit() {
  try {
    await updateFeedbackDescriptionById({
      _id: feedback.value._id as string,
      description: feedback.value.description as string,
    });
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  goBack();
}
</script>
