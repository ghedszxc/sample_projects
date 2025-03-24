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
            <!-- Date of Completion, Joint Inspection & Remarks -->
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

            <!-- Submitted By -->
            <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
              Unit No. (Block/Level/Unit) Move In / Out / Delivery
            </div>

            <div class="my-5">
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-100 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Unit No.</div>
                  <div>
                    {{ item.unitNumber || "" }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider />

            <!-- Unit Owner's Particular -->
            <div class="mb-5">
              <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
                Unit owner's Particulars
              </div>

              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Name</div>
                  <div>{{ item.nameOfOwner }}</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">IC/Passport No.</div>
                  <div>
                    {{ item.icPassportNumber }}
                  </div>
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Contact No.</div>
                  <div>{{ item.ownerContactNumber }}</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Office No.</div>
                  <div>{{ item.ownerOffice }}</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Home Phone</div>
                  <div>{{ item.ownerHP }}</div>
                </div>
              </div>
            </div>

            <div class="mb-5">
              <div class="align-start text-h6 font-weight-regular">
                <span
                  v-if="
                    configForm &&
                    configForm.firstLabel &&
                    configForm.firstLabel.trim() !== `<p></p>`.trim()
                  "
                  v-html="configForm.firstLabel"
                >
                </span>
                <span v-else>
                  I / We shall be responsible for our mover(s) (particulars
                  below) complying with the Rules & Regulations of Royal Palm.
                </span>
              </div>
            </div>

            <v-divider />

            <!-- Mover's Particular -->
            <div class="mb-5">
              <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
                Mover's Particulars
              </div>

              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Mover's Company</div>
                  <div>{{ item.companyName }}</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Office No.</div>
                  <div>{{ item.office }}</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Home Phone</div>
                  <div>{{ item.hp }}</div>
                </div>
              </div>
            </div>

            <!-- Section 2 -->
            <div class="mb-5">
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Name of Supervisor</div>
                  <div>{{ item.nameOfSupervisor }}</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">ID/Passport No.</div>
                  <div>{{ item.iDPassportNumber }}</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Work Permit</div>
                  <div>{{ item.workPermit }}</div>
                </div>
              </div>
            </div>

            <!-- Section 3 -->
            <div class="mb-5">
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Address</div>
                  <div>{{ item.address }}</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Vehicle Type</div>
                  <div>{{ item.vehicleType }}</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Vehicle Registration</div>
                  <div>{{ item.vehicleRgn }}</div>
                </div>
              </div>
            </div>

            <v-divider />

            <!-- Undertakings.. -->
            <div class="mb-5">
              <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
                Undertakings by Subsidiary Proprietor / Tenant
              </div>
            </div>

            <div class="my-5">
              <div class="mb-3 text-body">
                <span
                  v-if="
                    configForm &&
                    configForm.secondLabel &&
                    configForm.secondLabel.trim() !== `<p></p>`.trim()
                  "
                  v-html="configForm.secondLabel"
                >
                </span>
                <span v-else>
                  I confirm that I have read and will abide by the House Rules
                  governing the Moving In / Out & Delivery (or any changes to
                  the House Rules thereafter) as determined by the Management.
                </span>
              </div>
              <div class="text-body">
                <span
                  v-if="
                    configForm &&
                    configForm.thirdLabel &&
                    configForm.thirdLabel.trim() !== `<p></p>`.trim()
                  "
                  v-html="configForm.thirdLabel"
                >
                </span>
                <span v-else>
                  I / We agree to provide my personal information as indicated
                  and understand that it is solely to be used by the Management
                  for management purposes only. The personal data shall not be
                  used for other purposes.
                </span>
              </div>
            </div>

            <v-divider />

            <!-- Signature of Subsidiary Proprietor / Tenant -->
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
                      :src="item.signature"
                      alt="Signature"
                      class="custom-height-md"
                    />
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
                  <div class="text-h6 mr-4">Signature Date</div>
                  <div>
                    {{ formatStandardDate(item.signedDate) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Mover's Particular -->
            <div class="mb-5">
              <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
                For Management Use
              </div>

              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">[ ] By Bank / Cheque No</div>
                  <div>{{ item.chequeNumber }}</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Approved By</div>
                  <div>{{ item.approvedBy }}</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Date</div>
                  <div>{{ item.chequeDate }}</div>
                </div>
              </div>
            </div>

            <!-- Date of Refund Cheque No. -->
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
const { item, isLoading, setItem, getItemById } = useMoving();
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
    await getSelectedFormByType("Application for Moving");
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
