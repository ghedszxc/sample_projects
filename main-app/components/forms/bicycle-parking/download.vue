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
                  <div class="text-h6 mr-4">Unit Owner/Tenant Name</div>
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
                    {{ item.unitNumber }}
                  </div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Tenant's Contact No.</div>
                  <div>{{ item.ownerContactNumber }}</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">(Hp)</div>
                  <div>
                    {{ item.ownerHP }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider />

            <!-- Reason for Application -->
            <div class="mb-5">
              <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
                Reason for Application
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
                    <div class="text-h6 mr-4">Reason</div>
                    <div>
                      {{ item.reasonForApplication || "" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 2 -->

            <div class="my-5">
              <div class="text-body">
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
                  I / We have read the above conditions and agreed to abide by
                  the terms and conditions therein. I / We confirmed that the
                  above particulars are correct and undertake to comply with all
                  rules and regulations governing the usage of bicycle parking.
                </span>
              </div>
              <div class="text-body">
                <v-container>
                  <v-row class="text-h6" align="start" justify="space-between">
                    <v-col cols="auto" class="pa-0">
                      <v-icon
                        :icon="
                          item.isAgree ? 'mdi-check-circle' : 'mdi-close-circle'
                        "
                        :color="item.isAgree ? 'green' : 'red'"
                      />
                    </v-col>
                    <v-col class="pa-0 ml-10">
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
                        I / We agree to provide my personal information as
                        indicated and understand that it is solely to be used by
                        the Management for management purposes only. The
                        personal data shall not be used for other purposes.
                      </span>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
              <div class="text-body">
                <v-container>
                  <v-row class="text-h6" align="start" justify="space-between">
                    <v-col cols="auto" class="pa-0">
                      <v-icon
                        :icon="
                          item.isAgreeToLeaseMoveOut
                            ? 'mdi-check-circle'
                            : 'mdi-close-circle'
                        "
                        :color="item.isAgreeToLeaseMoveOut ? 'green' : 'red'"
                      />
                    </v-col>
                    <v-col class="pa-0 ml-10">
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
                        I / We understand that when I / We lease/move out of the
                        apartment. I / We are to surrender use of the bicycle
                        parking to the Management immediately upon vacating the
                        premises. I / We agree to adhere to the above rules
                        governing the bicycle parking.
                      </span>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </div>

            <!-- Signature of Tenant -->
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
                      :src="item.ownerSignature"
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
                    {{ formatStandardDate(item.ownerSignedDate || "") }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Acknowledgement of Application -->
            <div class="my-5">
              <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
                Acknowledgement
              </div>
              <p class="align-start text-body pt-6 font-weight-regular">
                I / We
                <span class="text-primary">{{ item.recipient }}</span> Do hereby
                acknowledge receipt of bicycle tag.
              </p>
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
                    {{ formatStandardDate(item.recipientSignedDate || "") }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider />

            <!-- For Management Use -->
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
                  <div class="text-h6 mr-4">Tag No. Issued</div>
                  <div>{{ item.tagNumber }}</div>
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
                  <div>{{ item.approvedDate }}</div>
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
const { item, isLoading, setItem, getItemById } = useBicycleParking();
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
    await getSelectedFormByType("Application for Bicycle Parking");
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
