<template>
  <v-row no-gutters justify="center" class="pa-md-8">
    <v-col cols="12">
      <v-card v-if="!isLoading" width="100%" height="100%" variant="flat">
        <div class="px-10">
          <div class="align-start text-h4 pt-6 pb-10 font-weight-bold">
            {{ item.typeOfForm }}
          </div>
          <!-- Management & Date -->
          <div class="mb-5">
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-50 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Date</div>
                <div>
                  {{ formatStandardDate(item.date || item.createdAt || "") }}
                </div>
              </div>
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-50 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">To: The Management</div>
                <div>{{ item.management }}</div>
              </div>
            </div>
          </div>

          <div>
            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
                Unit owner's particulars
              </div>

              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
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
                  class="bg-grey-lighten-3"
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
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
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
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Office No.</div>
                  <div>{{ item.ownerOfficeNumber }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Mobile No.</div>
                  <div>{{ item.ownerMobileNumber }}</div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="py-3 d-flex" v-if="$vuetify.display.mdAndUp">
                <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
                  Contractor's particulars
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Company Name</div>
                  <div>{{ item.companyName }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Registration No.</div>
                  <div>
                    {{ item.registrationNumber }}
                  </div>
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-100 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Address</div>
                  <div>{{ item.contractorAddress }}</div>
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Person in charge</div>
                  <div>{{ item.contractorPersonInCharge }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Office No.</div>
                  <div>
                    {{ item.contractorOfficeNumber }}
                  </div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Mobile No.</div>
                  <div>{{ item.contractorContactNumber }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Home No.</div>
                  <div>
                    {{ item.contractorHomePhone }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
                Summary of Proposed Renovation / Addition & Alteration Works
                (Attach separate sheet if applicable)
              </div>

              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Start Date</div>
                  <div>{{ formatStandardDate(item.startDate) }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">End Date</div>
                  <div>
                    {{ formatStandardDate(item.endDate) }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
                Hacking Period
              </div>

              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">From</div>
                  <div>{{ formatStandardDate(item.hackingPeriodFrom) }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">To</div>
                  <div>
                    {{ formatStandardDate(item.hackingPeriodTo) }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="my-5">
              <div class="mb-3 text-body">
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
                  In applying for approval, the Subsidiary Proprietor (Unit
                  Owner) and Contractor undertake to abide by and be subjected
                  to the General Rules & Regulations on Renovation / Addition &
                  Alteration Works as contained in the House Rules.
                </span>
              </div>
              <div class="text-body">
                <v-container>
                  <v-row class="text-h6" align="start" justify="space-between">
                    <v-col cols="auto" class="pa-0">
                      <v-icon icon="mdi-check-circle" color="green" />
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
                        personal data shall not be used for other purposes
                      </span>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="my-5">
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">
                    Signature of Subsidiary Proprietors
                  </div>
                  <div>
                    <v-img
                      :src="item.signatureOfSubsidiaryProprietors"
                      alt="Signature"
                      class="custom-height-md"
                    />
                  </div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Signature of Contractor</div>
                  <div>
                    <v-img
                      :src="item.signatureOfSubsidiaryProprietors"
                      alt="Signature"
                      class="custom-height-md"
                    />
                  </div>
                  <div></div>
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Signature Date</div>
                  <div>
                    {{ formatStandardDate(item.signatureOfSubsidiaryDate) }}
                  </div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Signature Date</div>
                  <div>
                    {{ formatStandardDate(item.signatureOfContractorDate) }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
                For management use:
              </div>

              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Processed By</div>
                  <div>{{ item.processedBy || "N/A" }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Work to be completed by</div>
                  <div>
                    {{ formatStandardDate(item.workToBeCompletedDate || "") }}
                  </div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Renovation deposit of</div>
                  <div>
                    {{ item.renovationDeposit || "N/A" }}
                  </div>
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-100 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Address</div>
                  <div>{{ item.address || "N/A" }}</div>
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Person in charge</div>
                  <div>{{ item.personInCharge || "N/A" }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Office No.</div>
                  <div>
                    {{ item.officeNumber || "N/A" }}
                  </div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Mobile No.</div>
                  <div>
                    {{ item.mobileNumber || "N/A" }}
                  </div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Home Phone</div>
                  <div>
                    {{ item.homePhone || "N/A" }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start text-body-1 pt-6 pb-2 font-weight-bold">
                (Cheque payable to “{{ item.siteName }}” or the MCST Plan No.
                [upon constitution]).
              </div>

              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Management</div>
                  <div>{{ item.siteName }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">By Cheque - Bank / Cheque No</div>
                  <div>
                    {{ item.chequeNumber || "N/A" }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start text-body-1 pt-6 pb-2 font-weight-bold">
                Note:
              </div>

              <div class="mb-3 text-body">
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
                  1. The submission by Subsidiary Proprietor(s) to the
                  Management for the “Application for Renovation / Addition &
                  Alteration Works” shall not be construed as exemption from
                  compliance with the building regulations/laws or exemption
                  from obtaining approval from other relevant authorities.
                </span>
              </div>
              <div class="text-body">
                <span
                  v-if="
                    configForm &&
                    configForm.fourthLabel &&
                    configForm.fourthLabel.trim() !== `<p></p>`.trim()
                  "
                  v-html="configForm.fourthLabel"
                >
                </span>
                <span v-else>
                  2. Subsidiary Proprietor(s) shall consult or liaise directly
                  and/or obtain necessary approvals from the relevant
                  authorities before submitting this application to the
                  Management.
                </span>
              </div>
            </div>

            <v-divider></v-divider>
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
const { item, isLoading, isValid, setItem, getItemById } = useRenovation();
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
    await getSelectedFormByType("Renovation Form");
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
