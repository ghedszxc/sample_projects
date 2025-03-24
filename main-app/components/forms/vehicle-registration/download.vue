<template>
  <v-row no-gutters justify="center" class="pa-md-8">
    <v-col cols="12">
      <v-card v-if="!isLoading" width="100%" height="100%" variant="flat">
        <div class="px-10">
          <div class="align-start text-h4 pt-6 pb-10 font-weight-bold">
            {{ item.typeOfForm }}
          </div>
        </div>

        <div class="px-10">
          <div class="mb-5">
            <!-- Date / To -->
            <div class="my-5">
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-100 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Date</div>
                  <div>
                    {{ formatStandardDate(item.date || "") }}
                  </div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-100 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Management</div>
                  <div>
                    {{ item.management || "" }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider />

            <!-- Unit Owner's Particular -->
            <div class="mb-5">
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Name of Unit Owner</div>
                  <div>{{ item.unitOwner }}</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">NRIC</div>
                  <div>
                    {{ item.ownerNRIC }}
                  </div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Contact No.</div>
                  <div>{{ item.ownerContactNumber }}</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Unit No.</div>
                  <div>
                    {{ item.ownerUnitNumber }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Car Owner's Particular -->
            <div class="mb-5">
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Car Owner</div>
                  <div>{{ item.carOwner }}</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Car Plate No.</div>
                  <div>
                    {{ item.carPlateNumber }}
                  </div>
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Make</div>
                  <div>{{ item.make }}</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Model</div>
                  <div>
                    {{ item.model }}
                  </div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Colour</div>
                  <div>
                    {{ item.colour }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Agreement -->
            <div class="my-5">
              <div class="text-body">
                <div
                  v-if="
                    configForm &&
                    configForm.firstLabel &&
                    configForm.firstLabel.trim() !== `<p></p>`.trim()
                  "
                  v-html="configForm.firstLabel"
                ></div>
                <span v-else>
                  <p class="mt-10">
                    A. I/We agree to abide by the rules and regulations as
                    stipulated in Royal Palms handbook at all times.
                  </p>

                  <p class="mt-5">
                    B. I/We also understand that all vehicles are parked
                    entirely at the owner’s risk. All persons and vehicles
                    within the car park enter entirely at the risk of such
                    person and/or the motorist. Persons entering the car park
                    shall be responsible for any damage or loss to the car(s)
                    parked or the car park equipment caused by such persons.
                  </p>

                  <p class="mt-5 mb-5">
                    C. I/We acknowledge that the vehicle shall be parked
                    properly without causing any inconvenience to other users.
                  </p>

                  <p class="mt-5 mb-5">
                    D. I/We acknowledge that I/we fully understand the balloting
                    of car park lots when required.
                  </p>

                  <p class="mt-5 mb-5">
                    E. I/We acknowledge that for 2 nd and subsequent car
                    application will not be entertained. The Management reserved
                    the right to terminate the approval of vehicle application
                    at any point in time.
                  </p>
                </span>
              </div>
            </div>

            <v-divider />

            <!-- Acknowledgement of Application -->
            <div class="my-5">
              <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
                Acknowledgement
              </div>
            </div>
            <div class="my-5">
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Signature</div>
                  <div>
                    <v-img
                      :src="item.recipientSignature"
                      alt="Signature"
                      class="custom-height-md"
                    />
                  </div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'w-50 pa-3'
                      : ' w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="mb-5">
                    <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                      <div
                        :class="
                          $vuetify.display.mdAndUp
                            ? 'border w-100 pa-3'
                            : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                        "
                      >
                        <div class="text-h6 mr-4">Signature Date</div>
                        <div>
                          {{
                            formatStandardDate(item.recipientSignedDate || "")
                          }}
                        </div>
                      </div>
                    </div>
                    <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                      <div
                        :class="
                          $vuetify.display.mdAndUp
                            ? 'border w-50 pa-3'
                            : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                        "
                      >
                        <div class="text-h6 mr-4">Name of Unit Owner</div>
                        <div>{{ item.unitOwner }}</div>
                      </div>
                      <div
                        :class="
                          $vuetify.display.mdAndUp
                            ? 'border w-50 pa-3'
                            : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                        "
                      >
                        <div class="text-h6 mr-4">Unit No.</div>
                        <div>
                          {{ item.ownerUnitNumber }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
      <div v-else>
        <p>Loading...</p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { item, isLoading, setItem, getItemById } = useVehicleRegistration();
const { formatStandardDate } = useUtils();
const { configForm, getSelectedFormByType } = useSiteSettings();
const { setSnackbar } = useLocal();
const route = useRoute();

const statusSelection = ref("");

const routeId = computed(() =>
  route.params.id ? String(route.params.id) : "",
);

onMounted(async () => {
  try {
    setItem(await getItemById(routeId.value));
    statusSelection.value = "Approved";
    await getSelectedFormByType("Vehicle Registration Form");
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  }
});
</script>

<style scoped>
.signature-container {
  text-align: left; /* Aligns text and images to the left */
}

.signature-container div,
.signature-container v-img {
  display: block; /* Ensures elements stack vertically */
}
.stepper-height {
  min-height: 80px;
}
.h-container {
  border-bottom-width: 3px;
  border-bottom-style: solid;
  border-bottom-color: rgb(206, 206, 206);
}

.h-container-bottom {
  border-bottom-color: rgb(42, 42, 254) !important;
  transition: all 0.2s;
}

.h-container:hover {
  background-color: rgb(189, 189, 189);
  transition: ease 0.2s;
  cursor: pointer;
}

.font-small {
  font-size: 13.5px;
}

.btn-w {
  min-width: 100px;
  min-height: 60px;
}
.custom-height-md {
  height: 300px; /* Set the exact height for mdAndUp */
}
@media (max-width: 600px) {
  .small-font {
    font-size: 13px; /* Adjust this value as needed */
  }
}
</style>
