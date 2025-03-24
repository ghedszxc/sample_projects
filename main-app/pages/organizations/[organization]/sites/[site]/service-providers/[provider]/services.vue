<template>
  <v-row no-gutters justify="center" class="py-8">
    <v-col cols="6" class="font-weight-light mt-4">
      <v-card
        width="100%"
        elevation="0"
        style="border-width: thin"
        min-height="368px"
      >
        <v-form v-model="isServiceProviderValid" @submit.prevent="submit()">
          <v-row no-gutters class="pa-8" justify="center">
            <v-col
              cols="12"
              class="text-h4 font-weight-bold mb-7 text-capitalize"
              style="letter-spacing: 2px !important"
            >
              Update Service Provider Services
            </v-col>

            <v-col>
              <span class="font-weight-bold"> Services </span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-combobox
                v-model="serviceProvider.services"
                v-model:search="serviceProviderSearch"
                :hide-no-data="false"
                :items="services"
                hide-selected
                multiple
                chips
                :rules="[requiredInput]"
                clearable
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-title>
                      No results matching "<strong>{{
                        serviceProviderSearch
                      }}</strong
                      >". Press <kbd>enter</kbd> to create a new one
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-combobox>
            </v-col>

            <v-col cols="12">
              <v-row no-gutters>
                <v-btn
                  theme="dark"
                  class="font-weight-bold"
                  :disabled="!isServiceProviderValid"
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
  middleware: ["secure", "site"],
});

const { requiredInput } = useUtils();

const {
  serviceProvider,
  isServiceProviderValid,
  updateServiceProviderServicesById,
  search: serviceProviderSearch,
  services,
} = useServiceProvider();

function goBack() {
  useRouter().back();
}

async function cancel() {
  goBack();
}

const { setSnackbar } = useLocal();

async function submit() {
  try {
    await updateServiceProviderServicesById({
      _id: serviceProvider.value._id as string,
      services: serviceProvider.value.services as string[],
    });
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  goBack();
}
</script>
