<template>
  <v-row no-gutters justify="center" class="py-md-8 h-100 h-md-auto">
    <v-col cols="12" md="6" class="font-weight-light mt-md-4">
      <v-card
        width="100%"
        height="100%"
        elevation="0"
        style="border-width: thin"
        min-height="368px"
      >
        <v-form v-model="isEventValid" @submit.prevent="submit()">
          <v-row no-gutters class="pa-8" justify="center">
            <v-col
              cols="12"
              class="text-h4 font-weight-bold mb-7 text-capitalize"
              style="letter-spacing: 2px !important"
            >
              <v-btn
                @click="goBack"
                class="rounded-xl"
                size="small"
                elevation="0"
              >
                <v-icon> mdi-arrow-left </v-icon></v-btn
              >
              Update Service Provider Member
              <v-divider class="mt-2" />
            </v-col>

            <v-col class="mb-2">
              <span class="font-weight-bold">Select member:</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-autocomplete
                hide-details
                v-model:model-value="event.serviceProviderMember"
                :loading="isServiceProvidersLoading"
                :items="collabServiceProviderMembers"
                item-title="fullName"
                return-object
                density="comfortable"
                clearable
              ></v-autocomplete>
            </v-col>

            <v-col cols="12">
              <v-row no-gutters>
                <v-col cols="12" md="3" class="mr-md-2">
                  <v-btn
                    theme="dark"
                    class="font-weight-bold w-100 mb-2"
                    :disabled="!isEventValid"
                    type="submit"
                    color="primary"
                    variant="tonal"
                  >
                    submit
                  </v-btn>
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn
                    variant="outlined"
                    class="font-weight-bold w-100"
                    @click="cancel()"
                    color="red"
                  >
                    cancel
                  </v-btn>
                </v-col>
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

const {
  event,
  getEventById,
  setEvent,
  isEventValid,
  updateEvent,
  getServiceProviderMembersById,
  isServiceProvidersLoading,
} = useEvent();

const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const loading = ref(false);

const { getSitesOptionsForFiltering, mySite, filterSite } = useFilter();

const id = computed(() => useRoute().params.id as string);

const collabServiceProviderMembers = ref([]);

onMounted(async () => {
  const result1 = await getEventById(id.value);
  setEvent(result1);

  await getSitesOptionsForFiltering();

  const result = await getServiceProviderMembersById({
    site: ["site", "service-provider-member"].includes(currentUser.value.type)
      ? mySite.value
      : filterSite.value,
    serviceProviderGroupId: event.value.serviceProviderGroup,
    serviceProvider: event.value.serviceProvider,
  });

  collabServiceProviderMembers.value = result.items;

  event.value.serviceProviderMember = collabServiceProviderMembers.value.find(
    (item) => item._id == event.value.serviceProviderMember,
  );
});

function goBack() {
  useRouter().back();
}

async function cancel() {
  goBack();
}

async function submit() {
  loading.value = true;
  try {
    await updateEvent(id.value, {
      serviceProviderMember: event.value.serviceProviderMember?._id
        ? event.value.serviceProviderMember?._id
        : undefined,
    });
    setSnackbar({ text: "Successfully Updated", modal: true, type: "success" });
    goBack();
  } catch (error: any) {
    setSnackbar({ text: error.message, type: "error", modal: true });
  } finally {
    loading.value = false;
  }
}
</script>
