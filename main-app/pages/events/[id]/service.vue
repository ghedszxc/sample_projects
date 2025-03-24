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
              Update Service
              <v-divider class="mt-2" />
            </v-col>

            <v-col class="mb-2">
              <span class="font-weight-bold">Service</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-autocomplete
                hide-details
                v-model:model-value="event.service"
                :loading="isServicesLoading"
                :items="services"
                item-title="service"
                item-value="service"
                density="comfortable"
                :rules="[requiredInput]"
                @update:modelValue="onUpdateService"
                clearable
              ></v-autocomplete>
            </v-col>

            <v-col class="mb-2">
              <span class="font-weight-bold">
                Select service provider group
              </span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-autocomplete
                hide-details
                v-model:model-value="event.serviceProviderGroup"
                :loading="isServiceProviderGroupsLoading"
                :items="collabServiceProviderGroups"
                item-title="groupName"
                return-object
                density="comfortable"
                :rules="[requiredInput]"
                @update:modelValue="onUpdateServiceProviderGroup"
                clearable
              ></v-autocomplete>
            </v-col>

            <v-col class="mb-2">
              <span class="font-weight-bold">Select member</span>
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
                    :loading="loading"
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
  setEventsByDate,
  setEvent,
  isEventValid,
  updateEvent,
  getServicesBySite,
  isServicesLoading,
  isServiceProviderGroupsLoading,
  isServiceProvidersLoading,
  getServiceProviderGroupsById,
  getServiceProviderMembersById,
} = useEvent();
const { setSnackbar } = useLocal();

const { requiredInput } = useUtils();

const { getSitesOptionsForFiltering, mySite, filterSite } = useFilter();

const { currentUser } = useLocalAuth();

const id = computed(() => useRoute().params.id as string);

const loading = ref(false);

const services = ref([]);

const collabServiceProviderMembers = ref([]);
const collabServiceProviderGroups = ref([]);

onMounted(async () => {
  setEventsByDate({ _id: id.value });

  console.log("Event", event.value);

  if (currentUser.value.type == "site") {
    await getSitesOptionsForFiltering();
    const result = await getServicesBySite({
      site: ["site", "service-provider-member"].includes(currentUser.value.type)
        ? mySite.value
        : filterSite.value,
      serviceProvider: currentUser.value.serviceProvider,
    });
    services.value = result.items;
  } else {
    const result = await getServicesBySite({
      site: event.value.site,
      serviceProvider: event.value.serviceProvider,
    });
    services.value = result.items;
  }

  await onUpdateService(true);
  await onUpdateServiceProviderGroup(true);
  // event.value.serviceProviderGroup = null;
  // event.value.serviceProviderMember = null;
});

async function onUpdateService(doNotNull: any) {
  if (!doNotNull) {
    event.value.serviceProviderGroup = null;
    event.value.serviceProviderMember = null;
    collabServiceProviderGroups.value = [];
    collabServiceProviderMembers.value = [];
  }

  const result = await getServiceProviderGroupsById({
    site: ["site", "service-provider-member"].includes(currentUser.value.type)
      ? mySite.value
      : filterSite.value,
    service: event.value.service,
  });
  collabServiceProviderGroups.value = result.items;

  console.log("Event", event.value);
  console.log("CollabServiceProviderGroups", collabServiceProviderGroups.value);
}

async function onUpdateServiceProviderGroup(doNotNull: any) {
  console.log("test");

  if (!doNotNull) {
    event.value.serviceProviderMember = null;
    collabServiceProviderMembers.value = [];
  }

  const result = await getServiceProviderMembersById({
    site: ["site", "service-provider-member"].includes(currentUser.value.type)
      ? mySite.value
      : filterSite.value,
    serviceProviderGroupId: event.value.serviceProviderGroup._id,
    serviceProvider: event.value.serviceProviderGroup.serviceProvider,
  });

  collabServiceProviderMembers.value = result.items;
  console.log(
    "CollabServiceProviderMembers",
    collabServiceProviderMembers.value,
  );

  console.log("Event", event.value);
}

function onUpdateServiceProviderMember() {
  console.log("Event", event.value);
}

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
      serviceType: event.value.service,
      serviceProvider: event.value.serviceProviderGroup.serviceProvider,
      serviceProviderGroup: event.value.serviceProviderGroup._id,
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
