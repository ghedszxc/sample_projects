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
            <!-- Management & Date -->
            <div class="my-5">
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
                    {{ formatStandardDate(item.date || "") }}
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
          </div>

          <!-- Completed By Owner -->
          <div class="mb-5">
            <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
              To be completed by Unit Owner
            </div>
            <p class="align-start text-body pt-6 font-weight-regular">
              I / We <span class="text-primary">{{ item.nameOfOwner }}</span> Do
              being the owner of Unit
              <span class="text-primary">{{ item.unitNumber }}</span> of Royal
              Palms hereby submit my / our application for number/s of
              <span class="text-primary">NFC Access Card</span>
              .
            </p>
          </div>
          <div class="mb-5">
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                class="border"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'w-50 pa-3'
                    : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Owner's NRIC No.</div>
                <div>{{ item.ownerNricNumber }}</div>
              </div>
              <div
                class="border"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'w-50 pa-3'
                    : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Home Phone No.</div>
                <div>{{ item.ownerHomePhone }}</div>
              </div>
              <div
                class="border"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'w-50 pa-3'
                    : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">(R)</div>
                <div>{{ item.ownerR }}</div>
              </div>
            </div>
          </div>

          <!-- Completed By Nominee (If Applicable) -->
          <div class="my-5">
            <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
              To be completed by Nominee (If Applicable)
            </div>
            <p class="align-start text-body pt-6 font-weight-regular">
              I / We <span class="text-primary">{{ item.nameOfOwner }}</span> Do
              being the owner of Unit
              <span class="text-primary">{{ item.unitNumber }}</span> of Royal
              Palms hereby nominate my immediate family / tenant whose name is
              given below for the application for (Access Card Type) number/s of
              Access Card <span class="text-primary">NFC Access Card</span>
              .
            </p>
          </div>
          <div class="mb-5">
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                class="border"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'w-50 pa-3'
                    : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Name of Tenant.</div>
                <div>{{ item.ownerNricNumber }}</div>
              </div>
              <div
                class="border"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'w-50 pa-3'
                    : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Commencement of Tenancy.</div>
                <div>
                  {{ formatStandardDate(item.tenancyCommencement || "") }}
                </div>
              </div>
              <div
                class="border"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'w-50 pa-3'
                    : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Expiry of Tenancy</div>
                <div>{{ formatStandardDate(item.tenancyExpiry || "") }}</div>
              </div>
            </div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                class="border"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'w-50 pa-3'
                    : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Tenant's I/C or Passport No.</div>
                <div>{{ item.tenantICPassportNumber }}</div>
              </div>
              <div
                class="border"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'w-50 pa-3'
                    : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Tenant's Contact No.</div>
                <div>
                  {{ item.tenantContactNumber }}
                </div>
              </div>
              <div
                class="border"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'w-50 pa-3'
                    : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">(Hp)</div>
                <div>{{ item.tenantHp }}</div>
              </div>
              <div
                class="border"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'w-50 pa-3'
                    : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">(R)</div>
                <div>{{ item.tenantR }}</div>
              </div>
            </div>
          </div>

          <!-- Rules and Regulations -->
          <div class="mb-5">
            <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
              Rules and Regulations
            </div>
            <div
              v-if="
                configForm &&
                configForm.firstLabel &&
                configForm.firstLabel.trim() !== `<p></p>`.trim()
              "
              v-html="configForm.firstLabel"
            ></div>
            <span v-else>
              <p class="align-start text-body pt-6 font-weight-regular">
                A. The electronic access card is used to access the side gate,
                lift lobby and common facilities (where applicable) within the
                development.
              </p>

              <p class="align-start text-body pt-6 font-weight-regular">
                B. Additional cards above the allocated number (as distributed
                at time of vacant possession) will be charged at S$50.00 per
                card (subject to availability). Units requiring extra cards will
                be considered on a case-by-case basis and documentary proof is
                required to prove that the applicants are residing in the
                Development.
              </p>

              <p class="align-start text-body pt-6 font-weight-regular">
                C. The replacement of lost / damaged card is charged at S$50.00
                per card (non-refundable). All lost card/s must be reported to
                the Management immediately.
              </p>

              <p class="align-start text-body pt-6 font-weight-regular">
                D. All residents must exercise due care and diligence in the
                maintenance of the access card to keep it in good working
                condition. Keep all cards away from any magnetic device/fields
                and place them in a cool dry place when not in use.
              </p>

              <p class="align-start text-body pt-6 font-weight-regular">
                E. The Management reserves the right to request for documentary
                proof to prove that the applicant/s is/are residing in the
                development before issuing the access card/s.
              </p>

              <p class="align-start text-body pt-6 font-weight-regular">
                F. Upon termination of lease, tenants must surrender the access
                card/s to the Management before moving out of the estate.
              </p>

              <p class="align-start text-body pt-6 font-weight-regular">
                G. When the owner sells/lease his/her unit, he/she must
                surrender the access card/s to the Management prior to moving
                out of the estate.
              </p>

              <p class="align-start text-body pt-6 font-weight-regular">
                H. The Management, personnel or any appointed representative of
                the Managing Agent may require the person/s using the access
                card to identify themselves.
              </p>

              <p class="align-start text-body pt-6 font-weight-regular">
                I. The access card/s will only be issued to residents living in
                Royal Palms. Visitors at the Development will not be eligible
                for an access card. The Management reserves the right to reject
                the application if documentary proof of the intended access
                cardholder is not fully furnished.
              </p>

              <p class="align-start text-body pt-6 font-weight-regular">
                J. The Management reserves the right to change any rules and
                regulations.
              </p>

              <p class="align-start text-body pt-6 font-weight-regular">
                K. All cheques are to be issued in favour of “Royal Palms” or
                the MCST Plan No. (upon constitution).
              </p>
            </span>

            <p class="align-start text-body pt-6 font-weight-regular">
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
                      the Management for management purposes only. The personal
                      data shall not be used for other purposes.
                    </span>
                  </v-col>
                </v-row>
              </v-container>
            </p>
          </div>

          <!-- Signature -->
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
                  {{ formatStandardDate(item.signedDate || "") }}
                </div>
              </div>
            </div>
          </div>

          <!-- For Management's Use -->
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
                <div class="text-h6 mr-4">Application Fees Received</div>
                <div>{{ item.applicationFee }}</div>
              </div>
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
        </div>
      </v-card>
      <div v-else>
        <p>Loading...</p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { item, isLoading, setItem, getItemById } = useElectronicAccessCard();
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
    await getSelectedFormByType("Application for Electronic Access Card");
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
