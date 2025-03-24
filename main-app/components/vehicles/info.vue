<template>
  <v-dialog
    v-model="vehicleInfoDialog"
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
        <span class="font-weight-bold pl-4 pt-1 text-capitalize">Vehicle</span>
        <v-spacer></v-spacer>
        <v-btn
          size="x-small"
          color="grey-darken-1"
          icon="mdi-close"
          @click="vehicleInfoDialog = false"
        ></v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text v-if="selectedVehicle">
        <v-row class="h-100 align-center">
          <v-col cols="12" class="mb-4">
            <v-row>
              <v-col cols="12" class="mb-5">
                <v-img :src="`/images/visitor-guest.svg`" height="125" />
              </v-col>

              <v-col cols="12" class="font-weight-bold pb-4">
                General information
              </v-col>

              <v-col cols="12" class="py-2">
                <fieldset class="styled-fieldset">
                  <legend class="text-caption">Name</legend>
                  <div class="text-capitalize">
                    {{
                      selectedVehicle.user.name
                        ? selectedVehicle.user.name
                        : selectedVehicle.fullName
                    }}
                  </div>
                </fieldset>
              </v-col>

              <v-col cols="12" class="py-2" v-if="selectedVehicle.nric">
                <fieldset class="styled-fieldset">
                  <legend class="text-caption">NRIC</legend>
                  <div class="text-capitalize">
                    {{ selectedVehicle.nric }}
                  </div>
                </fieldset>
              </v-col>

              <v-col cols="12" class="py-2">
                <fieldset class="styled-fieldset">
                  <legend class="text-caption">Phone Number</legend>
                  <div class="text-capitalize">
                    {{
                      selectedVehicle.user.phoneNumber
                        ? selectedVehicle.user.phoneNumber
                        : selectedVehicle.phoneNumber
                          ? selectedVehicle.phoneNumber
                          : "N/A"
                    }}
                  </div>
                </fieldset>
              </v-col>

              <v-col cols="12" class="py-2">
                <fieldset class="styled-fieldset">
                  <legend class="text-caption">Vehicle Number</legend>
                  <div class="text-capitalize">
                    {{
                      selectedVehicle.user.plateNumber
                        ? selectedVehicle.user.plateNumber
                        : selectedVehicle.plateNumber
                          ? selectedVehicle.plateNumber
                          : "N/A"
                    }}
                  </div>
                </fieldset>
              </v-col>

              <v-col
                cols="12"
                class="py-2"
                v-if="selectedVehicle.user.companyName"
              >
                <fieldset class="styled-fieldset">
                  <legend class="text-caption">Company Name</legend>
                  <div class="text-capitalize">
                    {{ selectedVehicle.user.companyName }}
                  </div>
                </fieldset>
              </v-col>
              <template
                v-else-if="
                  !selectedVehicle.companyName && selectedVehicle.block
                "
              >
                <v-col class="py-2" cols="12" v-if="selectedVehicle.block">
                  <fieldset class="styled-fieldset">
                    <legend class="text-caption">Block</legend>
                    <div class="text-capitalize">
                      {{ selectedVehicle.block }}
                    </div>
                  </fieldset>
                </v-col>
                <v-col cols="12" class="py-2" v-if="selectedVehicle.level">
                  <fieldset class="styled-fieldset">
                    <legend class="text-caption">Level</legend>
                    <div class="text-capitalize">
                      {{ selectedVehicle.level }}
                    </div>
                  </fieldset>
                </v-col>
                <v-col cols="12" class="py-2" v-if="selectedVehicle.unit">
                  <fieldset class="styled-fieldset">
                    <legend class="text-caption">Unit</legend>
                    <div class="text-capitalize">
                      {{ selectedVehicle.unit }}
                    </div>
                  </fieldset>
                </v-col>
              </template>

              <template
                v-else-if="
                  !selectedVehicle.companyName &&
                  !selectedVehicle.block &&
                  !selectedVehicle.level &&
                  !selectedVehicle.unit
                "
              >
                <v-col
                  cols="12"
                  class="py-2"
                  v-if="selectedVehicle.listType !== 'blocklist'"
                >
                  <fieldset class="styled-fieldset">
                    <legend class="text-caption">Block</legend>
                    <div class="text-capitalize">
                      {{ selectedVehicle.user.block }}
                    </div>
                  </fieldset>
                </v-col>
                <v-col cols="12" class="py-2" v-if="selectedVehicle.user.level">
                  <fieldset class="styled-fieldset">
                    <legend class="text-caption">Level</legend>
                    <div class="text-capitalize">
                      {{ selectedVehicle.user.level }}
                    </div>
                  </fieldset>
                </v-col>
                <v-col cols="12" class="py-2">
                  <fieldset
                    class="styled-fieldset"
                    v-if="selectedVehicle.user.unit"
                  >
                    <legend class="text-caption">Unit</legend>
                    <div class="text-capitalize" id="vehicle_info">
                      {{ selectedVehicle.user.unit }}
                    </div>
                  </fieldset>
                </v-col>
              </template>

              <v-col cols="6" class="py-2">
                <fieldset class="styled-fieldset">
                  <legend class="text-caption">Type</legend>
                  <div class="text-capitalize">
                    {{ selectedVehicle.userType }}
                  </div>
                </fieldset>
              </v-col>

              <v-col cols="6" class="py-2">
                <fieldset class="styled-fieldset">
                  <legend class="text-caption">Status</legend>
                  <div class="text-capitalize">
                    {{ selectedVehicle.listType }}
                  </div>
                </fieldset>
              </v-col>

              <v-col
                cols="12"
                class="py-2"
                v-if="selectedVehicle.listType.toLowerCase() === 'seasonpass'"
              >
                <fieldset class="styled-fieldset">
                  <legend class="text-caption">Subscription Expiry</legend>
                  <div>
                    {{ formattedSubscriptionDate() }}
                  </div>
                </fieldset>
              </v-col>

              <v-col
                v-if="selectedVehicle.listType === 'blocklist'"
                cols="12"
                class="py-2"
              >
                <v-textarea
                  class="text-capitalize"
                  v-model="selectedVehicle.reason"
                  label="Remarks"
                  density="compact"
                  hide-details
                  readonly
                ></v-textarea>
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
const { vehicleInfoDialog, selectedVehicle } = useVehicle();
const { formatISODateTime, formatToNormalDate, standardFormatDate } =
  useUtils();

function formattedSubscriptionDate() {
  if (selectedVehicle.value.subscriptionExpiry) {
    return standardFormatDate(selectedVehicle.value.subscriptionExpiry);
  }
}

const capitalizeUserListType = capitalizeFirstLetter(
  selectedVehicle.value.listType,
);

const capitalizeUserType = capitalizeFirstLetter(
  selectedVehicle.value.userType,
);

function capitalizeFirstLetter(string: string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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

.styled-fieldset {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0 10px 5px;
  display: inline-block;
  width: 100%;
  position: relative;
  border-color: rgb(229, 229, 229);
  max-height: 50px;
}
</style>
