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
            <div class="align-start text-h6 font-weight-regular">
              Request for Refund of Renovation Deposit in Respect of
              Renovation/Addition & Alteration Works at Unit No.
              <b>{{ item.unitNumber }}</b>
            </div>

            <div class="mb-5">
              <p class="align-start text-body pt-6 font-weight-regular">
                Dear Sir/Madam
              </p>
              <p class="align-center text-body pt-6 font-weight-regular">
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
                  We wish to inform you that we have completed the works that
                  are reflected in the Application for Renovation / A&A works
                  and there is no violation of the stated guidelines as
                  contained herewith.
                </span>
              </p>
            </div>

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
                  <div class="text-h6 mr-4">
                    Date of completion of Renovation / A & A Works
                  </div>
                  <div>
                    {{ formatStandardDate(item.dateOfCompletion || "") }}
                  </div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-100 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Date of Joint Inspection</div>
                  <div>
                    {{ formatStandardDate(item.dateOfJointInspection || "") }}
                  </div>
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-100 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Remarks:</div>
                  <div>
                    <span>{{ item.remarks || "" }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submitted By -->
            <div class="align-start text-h6 font-weight-regular">
              Submitted By:
            </div>

            <div class="my-5">
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="row"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-100 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Signature</div>
                  <div>
                    <v-img
                      :src="item.signedByApplicant"
                      alt="Signature"
                      class="custom-height-md"
                    />
                  </div>
                </div>
                <div
                  class="row"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-100 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div
                    class="col"
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-100 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <div class="text-h6 mr-4">
                      Name of Applicant (Subsidiary Proprietor)
                    </div>
                    <div>
                      {{ item.submittedByApplicant || "" }}
                    </div>
                  </div>
                  <div
                    class="col"
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-100 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <div class="text-h6 mr-4">Date of Refund</div>
                    <div>
                      {{ formatStandardDate(item.dateOfRefund || "") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Certified By -->
            <div class="align-start text-h6 font-weight-regular">
              Certified By:
            </div>

            <div class="my-5">
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="row"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-100 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Signature</div>
                  <div>
                    <v-img
                      :src="item.signedByStaff"
                      alt="Signature"
                      class="custom-height-md"
                    />
                  </div>
                </div>
                <div
                  class="row"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-100 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div
                    class="col"
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-100 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <div class="text-h6 mr-4">Certified By</div>
                    <div>
                      {{ item.certifiedByStaff || "" }}
                    </div>
                  </div>
                  <div
                    class="col"
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-100 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <div class="text-h6 mr-4">Date of Refund</div>
                    <div>
                      {{ formatStandardDate(item.dateOfRefund || "") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Received By -->
            <div class="align-start text-h6 font-weight-regular">
              Received By:
            </div>

            <div class="my-5">
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="row"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-100 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Signature</div>
                  <div>
                    <v-img
                      :src="item.signedByReceiver"
                      alt="Signature"
                      class="custom-height-md"
                    />
                  </div>
                </div>
                <div
                  class="row"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-100 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div
                    class="col"
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-100 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <div class="text-h6 mr-4">Name of Receiver</div>
                    <div>
                      {{ item.receivedBy || "" }}
                    </div>
                  </div>
                  <div
                    class="col"
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-100 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <div class="text-h6 mr-4">Date of Refund</div>
                    <div>
                      {{ formatStandardDate(item.dateOfRefund || "") }}
                    </div>
                  </div>
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
const { item, isLoading, setItem, getItemById } = useRenovationRefund();
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
    await getSelectedFormByType("Renovation Refund Form");
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
