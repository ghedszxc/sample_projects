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
              Create Service Provider
            </v-col>

            <v-col>
              <span class="font-weight-bold">Name</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="serviceProvider.name"
                density="comfortable"
                :rules="[requiredInput]"
                clearable
              ></v-text-field>
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
  middleware: "secure",
});

const orgId = computed(() => useRoute().params.organization as string);
const siteId = computed(() => useRoute().params.site as string);

const { requiredInput } = useUtils();

const {
  setServiceProvider,
  addServiceProvider,
  serviceProvider,
  isServiceProviderValid,
  search: serviceProviderSearch,
  services,
} = useServiceProvider();

onMounted(() => {
  setServiceProvider();
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
    const result = await addServiceProvider({
      organization: orgId.value,
      site: siteId.value,
      name: serviceProvider.value.name,
      services: serviceProvider.value.services,
    });
    setSnackbar({ text: result, modal: true, type: "success" });
    goBack();
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}
</script>
