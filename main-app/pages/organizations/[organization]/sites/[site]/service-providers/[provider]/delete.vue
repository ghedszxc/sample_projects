<template>
  <v-row
    no-gutters
    justify="center"
    align-content="center"
    class="fill-height py-8"
  >
    <v-col cols="8" class="font-weight-light mt-4">
      <v-card width="100%" elevation="0" style="border-width: thin">
        <v-row no-gutters class="pa-8" justify="center">
          <v-col
            cols="12"
            class="text-h4 font-weight-bold mb-4 text-center"
            style="letter-spacing: 2px !important"
          >
            {{ serviceProvider.name }}
          </v-col>

          <v-col cols="12" class="text-center">
            Are you sure you want to delete this service provider?
          </v-col>

          <v-col cols="12" class="mt-4">
            <v-row no-gutters justify="center">
              <v-btn theme="dark" class="font-weight-bold" @click="submit">
                Yes
              </v-btn>
              <v-btn variant="text" class="font-weight-bold" @click="cancel">
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

const orgId = computed(() => useRoute().params.organization as string);
const siteId = computed(() => useRoute().params.site as string);
const providerId = computed(() => useRoute().params.provider as string);

const {
  getServiceProviderById,
  serviceProvider,
  setServiceProvider,
  deleteServiceProviderById,
} = useServiceProvider();

const { setSnackbar } = useLocal();

onMounted(async () => {
  try {
    const _provider = (await getServiceProviderById(
      providerId.value
    )) as TServiceProvider;
    if (_provider) {
      setServiceProvider(_provider);
    }
  } catch (error) {
    setSnackbar({ text: "Failed to load service provider data.", modal: true, type: "error" });
  }
});

async function submit() {
  try {
    await deleteServiceProviderById(providerId.value);
    useRouter().push({
      name: "organizations-organization-sites-site-service-providers",
      params: { organization: orgId.value, site: siteId.value },
    });
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}

function cancel() {
  useRouter().back();
}
</script>
