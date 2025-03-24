<template>
  <v-row no-gutters justify="center" class="py-8">
    <v-col cols="11" md="6" class="font-weight-light mt-4">
      <v-card
        width="100%"
        elevation="0"
        style="border-width: thin"
        min-height="368px"
      >
        <v-form v-model="isVisitorValid" @submit.prevent="submit()">
          <v-row no-gutters class="pa-8" justify="center">
            <v-col
              cols="12"
              class="text-h4 font-weight-bold mb-7 text-capitalize"
              style="letter-spacing: 2px !important"
            >
              Update Visitor Name
            </v-col>

            <v-col>
              <span class="font-weight-bold">First Name</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="visitor.firstName"
                density="comfortable"
                hint="This field is required"
              ></v-text-field>
            </v-col>

            <v-col>
              <span class="font-weight-bold">Last Name</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="visitor.lastName"
                density="comfortable"
                hint="This field is required"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-row no-gutters>
                <v-btn
                  theme="dark"
                  class="font-weight-bold"
                  :disabled="!isVisitorValid"
                  type="submit"
                >
                  Update
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
const { visitor, getVisitorById, setVisitor, isVisitorValid, updateVisitor } =
  useVisitor();

const id = computed(() => useRoute().params.id as string);

onMounted(async () => {
  const result = await getVisitorById(id.value);
  setVisitor(result);
});

function goBack() {
  useRouter().back();
}

async function cancel() {
  goBack();
}

const { setSnackbar } = useLocal();

async function submit() {
  try {
    const result = await updateVisitor({
      _id: visitor.value._id,
      name: visitor.value.name,
    });
    setSnackbar({ text: "Successfully update visitor name", modal: true, type: "success" });
    goBack();
  } catch (error) {
    setSnackbar({ text: error, modal: true, type: "error" });
  }
}
</script>
