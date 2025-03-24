<template>
  <v-dialog
    v-model="updateVehicleStatusDialog"
    transition="dialog-right-transition"
    fullscreen
    persistent
    :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
  >
    <v-card
      :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
      :class="`${theme == 'light' && 'bg-white'} px-3 h-100 ${$vuetify.display.mdAndUp && 'rounded-s-xl'}`"
    >
      <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
        <span class="font-weight-bold pl-4 pt-1 text-capitalize"
          >Change Status</span
        >
        <v-spacer></v-spacer>
        <v-btn
          size="x-small"
          color="grey-darken-1"
          icon="mdi-close"
          @click="onCloseDialog()"
        ></v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text v-if="selectedVehicle">
        <v-row class="h-100 align-center">
          <v-col cols="12" class="mb-4">
            <v-row v-if="addVehicleSteps == 1">
              <v-col cols="6" class="mb-5">
                <v-img :src="`/images/ban-individual.svg`" height="125" />
              </v-col>
              <v-col cols="6" class="mb-5">
                <v-img :src="`/images/ban-vehicle.svg`" height="125" />
              </v-col>

              <v-col cols="12" class="font-weight-bold pb-4">
                General information
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="type"
                  label="Select Status"
                  :items="statuses"
                  item-title="title"
                  item-value="value"
                  density="comfortable"
                  hide-details
                ></v-select>
              </v-col>

              <v-col v-if="type === 'blocklist'" cols="12">
                <v-textarea
                  v-model="reason"
                  label="Remarks"
                  density="compact"
                  hide-details
                  rows="3"
                  no-resize
                ></v-textarea>
              </v-col>

              <v-col cols="12">
                <v-btn
                  block
                  color="blue-darken-3"
                  size="small"
                  variant="flat"
                  style="height: 40px"
                  @click="submit()"
                >
                  Update
                </v-btn>
              </v-col>
            </v-row>

            <v-row v-if="addVehicleSteps == 2">
              <v-col cols="12" class="mb-5">
                <v-img :src="`/images/confirmation.svg`" height="125" />
              </v-col>

              <v-col cols="12">
                <div class="text-center mt-6 text-subtitle-1 font-weight-bold">
                  {{ type == "whitelist" ? "Whitelisted" : "Blocklisted" }}
                </div>
                <div class="text-center mt-2 text-caption">
                  Vehicle status was updated
                </div>
                <v-row class="px-3 mt-5" justify="space-between">
                  <v-col cols="12">
                    <v-btn
                      block
                      size="small"
                      variant="flat"
                      style="height: 40px"
                      @click="onCloseDialog()"
                    >
                      Close
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <span :class="`${$vuetify.display.mdAndUp && 'pl-4'} text-caption`">
          @ 2024 by Seven 365 Pte Ltd V1.0
        </span>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const { theme } = useLocal();
const { setSnackbar } = useLocal();
const { currentUser } = useLocalAuth();
const {
  updateVehicleStatusDialog,
  selectedVehicle,
  updateVehicleStatus,
  setVehicles,
  addVehicleSteps,
  filterOrganization,
  filterSite,
  filterByType,
  filterByStatus,
} = useVehicle();
const { getSitesOptionsForFiltering, mySite } = useFilter();

const type = ref("");
const reason = ref("");

const statuses = ref([
  { title: "Unblock", value: "whitelist" },
  { title: "Block", value: "blocklist" },
]);

async function submit() {
  try {
    await Promise.all([
      getSitesOptionsForFiltering(),
      updateVehicleStatus(selectedVehicle.value._id || '', type.value, reason.value),
    ]);
    addVehicleSteps.value = 2;

    await setVehicles({
      site: mySite.value,
      type: filterByType.value.toLowerCase(),
      status: filterByStatus.value.toLowerCase(),
    });

    setSnackbar({
      text: "Successful updating vehicle status",
      modal: true, type: "success"
    });
  } catch (err) {
    setSnackbar({ text: err as string, modal: true, type: "error" });
  }
}

async function onCloseDialog() {
  updateVehicleStatusDialog.value = false;
  addVehicleSteps.value = 1;

  type.value = "";
  reason.value = "";
}
</script>
<style scoped>
.override_shadow {
  box-shadow: 0px 13px 19px -13px rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 0px 13px 19px -13px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 13px 19px -13px rgba(0, 0, 0, 0.15);
}

.dialog_desktop {
  margin: 0 0 0 auto;
  max-width: 28rem;
  border-radius: 25px 0 0 25px;

  box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
}

:deep() .v-field__outline {
  --v-field-border-opacity: 0.1;
}

:deep() .v-overlay__scrim {
  opacity: var(--v-overlay-opacity, 0);
}
</style>
