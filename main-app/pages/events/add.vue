<template>
  <v-row no-gutters justify="center" class="py-8">
    <v-col cols="6" class="font-weight-light mt-4">
      <v-card
        width="100%"
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
              Add Event
            </v-col>

            <v-col>
              <span class="font-weight-bold">Title</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="event.title"
                density="comfortable"
                :rules="[requiredInput]"
                type="text"
                class="input-group--focused"
              ></v-text-field>
            </v-col>

            <v-col>
              <span class="font-weight-bold">Description</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-textarea
                v-model="event.description"
                density="comfortable"
                :rules="[requiredInput]"
                type="text"
                class="input-group--focused"
              ></v-textarea>
            </v-col>

            <v-col
              v-if="
                ['service-provider', 'service-provider-member'].includes(
                  currentUser.type
                )
              "
            >
              <span class="font-weight-bold">Site</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col
              v-if="
                ['service-provider', 'service-provider-member'].includes(
                  currentUser.type
                )
              "
              cols="12"
              class="mb-4"
            >
              <v-autocomplete
                v-model:model-value="filterSite"
                :loading="isCollabSitesLoading"
                :items="collabSites.items"
                item-title="name"
                item-value="_id"
                density="comfortable"
                :rules="[requiredInput]"
                @update:modelValue="onUpdateSite"
              ></v-autocomplete>
            </v-col>

            <v-col>
              <span class="font-weight-bold">Service</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-autocomplete
                v-model:model-value="event.serviceType"
                :loading="isServicesLoading"
                :items="services"
                item-title="service"
                item-value="service"
                density="comfortable"
                :rules="[requiredInput]"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="12" md="6">
              <v-row :class="$vuetify.display.mdAndUp && 'pr-2'">
                <v-col cols="12">
                  <span class="font-weight-bold">Start Date</span>
                  <span class="text-red mx-1 mb-2">*</span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-text-field
                    v-model="filters.from"
                    density="comfortable"
                    :rules="[requiredInput]"
                  >
                    <template v-slot:append-inner>
                      <v-menu>
                        <template v-slot:activator="{ props }">
                          <input
                            v-bind="props"
                            type="date"
                            class="overridePicker"
                            id="from"
                            @input="onUpdateDate('from')"
                          />
                        </template>
                      </v-menu>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" sm="12" md="6">
              <v-row :class="$vuetify.display.mdAndUp && 'pl-2'">
                <v-col cols="12">
                  <span class="font-weight-bold">End Date</span>
                  <span class="text-red mx-1 mb-2">*</span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-text-field
                    v-model="filters.to"
                    density="comfortable"
                    :rules="[requiredInput]"
                  >
                    <template v-slot:append-inner>
                      <v-menu>
                        <template v-slot:activator="{ props }">
                          <input
                            v-bind="props"
                            type="date"
                            class="overridePicker"
                            id="to"
                            @input="onUpdateDate('to')"
                          />
                        </template>
                      </v-menu>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-row no-gutters>
                <v-btn
                  theme="dark"
                  class="font-weight-bold"
                  :disabled="!isEventValid"
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
const { $ability } = useNuxtApp();
import moment from "moment-timezone";

const {
  event,
  addEvent,
  setEvent,
  isEventValid,
  getCollabSites,
  isCollabSitesLoading,
  filterSite,
  getServicesBySite,
  isServicesLoading,
} = useEvent();

const { currentUser } = useLocalAuth();
const { standardFormatDate, requiredInput } = useUtils();
const { setSnackbar } = useLocal();

const services = ref([]);
const collabSites = ref([]);

onMounted(async () => {
  setEvent();
  if (currentUser.value.type == "site") {
    const result = await getServicesBySite({ site: currentUser.value.site });

    services.value = result.items;
  } else {
    collabSites.value = await getCollabSites();
  }

  event.value.start = filters.value.from;
  event.value.end = filters.value.to;
});

const filters = ref({
  from: standardFormatDate(new Date()),
  to: standardFormatDate(new Date()),
});

function goBack() {
  useRouter().back();
}

async function cancel() {
  await setEvent();
  await goBack();
}

function dateStrToObj(data: string) {
  const [year, month, date] = data.split("-").map(Number);
  return new Date(year, month - 1, date);
}

async function submit() {
  const checkStartDate = dateStrToObj(event.value.start);
  const checkEndDate = dateStrToObj(event.value.end);

  if (checkEndDate.valueOf() < checkStartDate.valueOf()) {
    // to validate start & end date
    setSnackbar({
      text: "End date must not be earlier than start date",
      modal: true, type: "warning"
    });
    return;
  } else {
    try {
      const result = await addEvent({
        title: event.value.title,
        description: event.value.description,
        serviceType: event.value.serviceType,
        start: moment
          .tz(
            moment(event.value.start, "DD/MM/YYYY").startOf("day"),
            "Asia/Singapore"
          )
          .toDate(),
        end: moment
          .tz(
            moment(event.value.end, "DD/MM/YYYY").endOf("day"),
            "Asia/Singapore"
          )
          .toDate(),
        site: currentUser?.value?.site || filterSite.value,
        serviceProvider: services.value.find(
          (i) => i.service === event.value.serviceType
        )._id,
      });
      if (!result) {
        setSnackbar({ text: "Failed to create event", modal: true, type: "error" });
        return;
      }

      setSnackbar({ text: "Successfull created event", modal: true, type: "success" });
      goBack();
    } catch (error) {
      setSnackbar({ text: error as string, modal: true, type: "error" });
    }
  }
}
</script>

<style scoped>
.overridePicker {
  width: 18px;
}
</style>
