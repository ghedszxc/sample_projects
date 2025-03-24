<template>
  <v-row no-gutters justify="center" class="pa-md-8">
    <v-col cols="12">
      <v-card
        v-if="!isLoading"
        width="100%"
        elevation="3"
        height="100%"
        class=""
      >
        <v-form v-model="isValid" @submit.prevent="onUpdateItem()">
          <div class="pa-5 d-flex justify-space-between">
            <div class="d-flex align-center">
              <v-btn
                fav
                density="compact"
                icon="mdi-arrow-left"
                variant="text"
                class="mt-1"
                @click="goBack()"
              />
              <span
                class="ml-2 header-6 font-weight-bold text-capitalize"
                style="letter-spacing: 2px !important"
              >
                {{ item.typeOfForm }}
              </span>
            </div>

            <div class="d-flex ga-5" v-if="$vuetify.display.mdAndUp">
              <!-- <div v-if="!/^Approved$/i.test(item.status || '')">
                <v-dialog v-model="deleteDialog" max-width="400" persistent>
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn
                      class="bg-red text-white py-6 px-5 text-center d-flex align-center justify-center"
                      v-bind="activatorProps"
                    >
                      <v-icon class="mr-1"> mdi-trash-can-outline </v-icon
                      >Delete
                    </v-btn>
                  </template>

                  <v-card class="pa-10">
                    <div>
                      <div class="d-flex justify-center">
                        <v-img :src="'/images/throw.svg'" alt="Delete Image" />
                      </div>
                      <div class="font-weight-bold text-center my-5">
                        Confirm Password to Delete
                      </div>
                      <v-text-field
                        v-model="myDeletePassword"
                        type="password"
                        label="Enter Password"
                      ></v-text-field>
                    </div>
                    <template v-slot:actions>
                      <v-spacer></v-spacer>
                      <v-col cols="12">
                        <v-row no-gutters>
                          <v-col cols="6" class="pr-2">
                            <v-btn
                              class="w-100"
                              @click="deleteDialog = false"
                              variant="outlined"
                            >
                              Cancel
                            </v-btn>
                          </v-col>

                          <v-col cols="6" class="pl-2">
                            <v-btn
                              class="bg-red-darken-4 w-100"
                              :loading="isLoading"
                              @click=""
                            >
                              Confirm
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </template>
                  </v-card>
                </v-dialog>
              </div> -->
              <v-btn
                v-if="/^Approved$/i.test(item.status || '')"
                class="bg-light-blue-darken-2 text-white py-6 px-5 text-center d-flex align-center justify-center"
                :loading="isDownloading"
                @click.stop="onDownloadPdf(item as unknown as TMoving)"
              >
                <v-icon class="mr-1">mdi-download</v-icon>
                Download PDF
              </v-btn>
            </div>
          </div>
          <v-divider></v-divider>
          <div class="d-flex">
            <div
              :class="{
                'bg-orange-darken-1': /^Pending$/i.test(item.status || ''),
                'bg-green': /^Approved$/i.test(item.status || ''),
                'bg-red': /^Rejected$/i.test(item.status || ''),
                'bg-blue': /^Resubmission$/i.test(item.status || ''),
              }"
              class="d-flex text-white px-12 pa-5 align-center justify-center font-weight-medium"
            >
              {{
                (item.status || "").charAt(0).toUpperCase() +
                (item.status || "").slice(1)
              }}
            </div>
            <div class="pa-4" v-if="/^Approved$/i.test(item.status || '')">
              <div>Remarks (Optional)</div>
              <div class="reason-class">{{ item.reason }}</div>
            </div>
            <div class="pa-4" v-else-if="/^Rejected$/i.test(item.status || '')">
              <div>Reason:</div>
              <div class="reason-class">{{ item.reason }}</div>
            </div>
            <div
              class="pa-4"
              v-else-if="/^Resubmission$/i.test(item.status || '')"
            >
              <div>Reason:</div>
              <div class="reason-class">{{ item.reason }}</div>
            </div>
          </div>

          <div class="px-10">
            <div class="mb-5">
              <div class="align-start text-h6 pt-6 pb-2">
                {{ item.typeOfForm }}
              </div>
            </div>

            <div class="pb-5">
              <div class="mb-5">
                <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Date <span>*</span>
                    </p>
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
                    <p class="label-class mr-4 asterisk-class">
                      To: The Management <span>*</span>
                    </p>
                    <div>
                      {{ item.management }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <!-- UNIT OWNER -->
            <div class="pb-5">
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                To be completed by unit owner
              </p>
              <p class="mb-10">
                I / We
                <span class="text-blue-darken-3">{{ item.nameOfOwner }}</span>
                being the owner of Unit
                <span class="text-blue-darken-3">{{ item.unitNumber }}</span> of
                Royal Palms hereby submit my / our application for number/s of
                <span class="text-blue-darken-3"
                  >{{ item.accessCardNumber }}
                </span>
              </p>

              <div class="mb-5">
                <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Owner's NRIC No. <span>*</span>
                    </p>
                    <div>
                      {{ item.ownerNricNumber }}
                    </div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Home Phone <span>*</span>
                    </p>
                    <div>
                      {{ item.ownerHomePhone }}
                    </div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      (R): <span>*</span>
                    </p>
                    <div>
                      {{ item.ownerR }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <!-- NOMINEE IF APPLICABLE -->
            <div class="pb-5">
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                To be completed for nominee (if applicable)
              </p>
              <p class="mb-10">
                I / We
                <span class="text-blue-darken-3">{{ item.nominatorName }}</span>
                being the owner of Unit
                <span class="text-blue-darken-3">{{
                  item.nominatorUnitNumber
                }}</span>
                of Royal Palm hereby nominate my immediate family / tenant whose
                name is given below for the application for (Access Card Type)
                number/s of Access Card
                <span class="text-blue-darken-3"
                  >{{ item.tenantAccessCardNumber }}
                </span>
              </p>
            </div>

            <v-divider></v-divider>

            <!-- NOMINEE IF TENANT -->
            <div class="pb-5">
              <p class="align-start text-h5 pt-6 pb-2 mb-2">
                If the Nominee is a Tenant, please state:
              </p>

              <div>
                <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Name of Tenant <span>*</span>
                    </p>
                    <div>
                      {{ item.nameOfTenant }}
                    </div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Commencement of Tenancy <span>*</span>
                    </p>
                    <div>
                      {{ formatStandardDate(item.tenancyCommencement || "") }}
                    </div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Expiry of Tenancy <span>*</span>
                    </p>
                    <div>
                      {{ formatStandardDate(item.tenancyExpiry || "") }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-5">
                <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Tenant's I/C or Passport No. <span>*</span>
                    </p>
                    <div>
                      {{ item.tenantICPassportNumber }}
                    </div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Tenant's Contact No. <span>*</span>
                    </p>
                    <div>
                      {{ item.tenantContactNumber }}
                    </div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      (Hp) <span>*</span>
                    </p>
                    <div>
                      {{ item.tenantHp }}
                    </div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      (R) <span>*</span>
                    </p>
                    <div>
                      {{ item.tenantR }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <v-divider></v-divider>

            <!-- RULES AND REGULATIONS -->
            <div class="pb-5">
              <div
                v-if="
                  configForm &&
                  configForm.firstLabel &&
                  configForm.firstLabel.trim() !== `<p></p>`.trim()
                "
                v-html="configForm.firstLabel"
              ></div>
              <span v-else>
                <p class="mb-3">
                  A. The electronic access card is used to access the side gate,
                  lift lobby and common facilities (where applicable) within the
                  development.
                </p>

                <p class="mb-3">
                  B. Additional cards above the allocated number (as distributed
                  at time of vacant possession) will be charged at S$50.00 per
                  card (subject to availability). Units requiring extra cards
                  will be considered on a case-by-case basis and documentary
                  proof is required to prove that the applicants are residing in
                  the Development.
                </p>

                <p class="mb-3">
                  C. The replacement of lost / damaged card is charged at
                  S$50.00 per card (non-refundable). All lost card/s must be
                  reported to the Management immediately.
                </p>

                <p class="mb-3">
                  D. All residents must exercise due care and diligence in the
                  maintenance of the access card to keep it in good working
                  condition. Keep all cards away from any magnetic device/fields
                  and place them in a cool dry place when not in use.
                </p>

                <p class="mb-3">
                  E. The Management reserves the right to request for
                  documentary proof to prove that the applicant/s is/are
                  residing in the development before issuing the access card/s.
                </p>

                <p class="mb-3">
                  F. Upon termination of lease, tenants must surrender the
                  access card/s to the Management before moving out of the
                  estate.
                </p>

                <p class="mb-3">
                  G. When the owner sells/lease his/her unit, he/she must
                  surrender the access card/s to the Management prior to moving
                  out of the estate.
                </p>

                <p class="mb-3">
                  H. The Management, personnel or any appointed representative
                  of the Managing Agent may require the person/s using the
                  access card to identify themselves.
                </p>

                <p class="mb-3">
                  I. The access card/s will only be issued to residents living
                  in Royal Palms. Visitors at the Development will not be
                  eligible for an access card. The Management reserves the right
                  to reject the application if documentary proof of the intended
                  access cardholder is not fully furnished.
                </p>

                <p class="mb-3">
                  J. The Management reserves the right to change any rules and
                  regulations.
                </p>

                <p class="mb-3">
                  K. All cheques are to be issued in favour of “Royal Palms” or
                  the MCST Plan No. (upon constitution).
                </p>
              </span>
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                Rules and regulations
              </p>

              <p class="mb-3">
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
                        personal data shall not be used for other purposes.
                      </span>
                    </v-col>
                  </v-row>
                </v-container>
              </p>
            </div>

            <v-divider></v-divider>

            <!-- FOR MANAGEMENT -->

            <!-- // unable to update when approved, resubmit or cancel -->
            <div v-show="/^(Approved)$/i.test(item.status || '')" class="pb-5">
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                For Management Use:
              </p>

              <div class="mb-5">
                <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      [ ] By Bank / Cheque No <span>*</span>
                    </p>
                    <div>
                      {{ item.chequeNumber }}
                    </div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Cheque Date <span>*</span>
                    </p>
                    <div>
                      {{ formatStandardDate(item.approvedDate || "") }}
                    </div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Approved By <span>*</span>
                    </p>
                    <div>
                      {{ item.approvedName }}
                    </div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Date <span>*</span>
                    </p>
                    <div>
                      {{ formatStandardDate(item.approvedDate || "") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="signature-container mb-5">
              <div class="text-h6 mr-4">
                Signature <span class="text-red">*</span>
              </div>
              <v-img
                :src="item.signature"
                alt="Signature"
                class="custom-height-md"
              />
            </div>

            <div
              v-if="
                $ability.can('update', 'update-form-status') &&
                /^(pending)$/i.test(item.status || '')
              "
              class="pb-5"
            >
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                For management use:
              </p>
              <p class="mb-10">Security deposit of $1,000.00</p>

              <div class="mb-5">
                <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'w-50 pa-3'
                        : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      [ ] By Bank / Cheque No <span>*</span>
                    </p>
                    <div>
                      <v-text-field
                        v-model="item.chequeNumber"
                        :rules="
                          statusSelection !== 'Approved' ? [] : [requiredInput]
                        "
                        hide-details
                        :disabled="statusSelection !== 'Approved'"
                      ></v-text-field>
                    </div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'w-50 pa-3'
                        : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Approved By <span>*</span>
                    </p>
                    <div>
                      <v-text-field
                        v-model="userFullName"
                        :rules="[requiredInput]"
                        hide-details
                        disabled
                      ></v-text-field>
                    </div>
                  </div>
                  <!-- Note that cheque date and approved date are the same -->
                </div>
              </div>
            </div>

            <div
              v-if="
                $ability.can('update', 'update-form-status') &&
                /^(pending)$/i.test(item.status || '')
              "
              class="my-5"
            >
              <div class="text-h6 mr-4">
                Approved/Reject Incident Application
              </div>
              <div class="d-flex align-center">
                <v-radio-group v-model="statusSelection">
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-radio label="Approve Form" value="Approved"></v-radio>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-radio
                        label="Request for Resubmission Form"
                        value="Resubmission"
                      ></v-radio>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-radio label="Reject Form" value="Rejected"></v-radio>
                    </v-col>
                  </v-row>
                </v-radio-group>

                <v-btn
                  class="bg-blue-darken-3 align-center btn-w"
                  type="submit"
                  :disabled="!isValid"
                  :loading="isUpdating"
                >
                  Submit
                </v-btn>
              </div>
              <div v-if="statusSelection === 'Rejected'">
                <div class="text-h6 mr-4">
                  Reason of Rejection <span class="text-red">(Required)</span>
                </div>
                <v-textarea
                  v-model="item.reason"
                  :rules="[requiredInput]"
                  hide-details
                  placeholder="Reason for Rejection"
                ></v-textarea>
              </div>
              <div v-if="statusSelection === 'Resubmission'">
                <div class="text-h6 mr-4">
                  Reason of Resubmission
                  <span class="text-red">(Required)</span>
                </div>
                <v-textarea
                  v-model="item.reason"
                  :rules="[requiredInput]"
                  hide-details
                  placeholder="Reason of Resubmission"
                ></v-textarea>
              </div>
              <div v-else-if="statusSelection === 'Approved'">
                <div class="text-h6 mr-4">Remarks (Optional)</div>
                <v-textarea
                  v-model="item.reason"
                  hide-details
                  placeholder="Remarks"
                ></v-textarea>
              </div>
            </div>
          </div>
        </v-form>
      </v-card>
      <div v-else>
        <p>Loading...</p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { $ability } = useNuxtApp();
const { item, isLoading, setItem, getItemById } = useElectronicAccessCard();
const {
  downloadDobPdf,
  updateFormStatus,
  isUpdating,
  isValid,
  updateManagementInfo,
} = useForms();
const { formatStandardDate, requiredInput } = useUtils();
const { currentUser } = useLocalAuth();
const { mySite } = useFilter();
const { configForm, getSelectedFormByType } = useSiteSettings();
const { setSnackbar } = useLocal();
const route = useRoute();
const router = useRouter();

const isDownloading = ref(false);
const submitDialog = ref(false);
const statusSelection = ref("");

const routeId = computed(() =>
  route.params.id ? String(route.params.id) : "",
);
const userFullName = computed(
  () => `${currentUser.value.surname}, ${currentUser.value.givenName}`,
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

const onUpdateItem = async () => {
  const payload = {
    status: statusSelection.value,
    reason: item.value.reason,
    approvedBy: currentUser.value._id,
    approvedName: userFullName.value,
  } as TUpdateFormStatus;
  const updatePayload = {
    chequeNumber: item.value.chequeNumber,
    approvedBy: currentUser.value._id,
    approvedByName: userFullName.value,
    approvedName: userFullName.value,
    approvedDate: new Date(),
    status: statusSelection.value,
    reason: item.value.reason,
  } as TUpdateManagementInfo;

  await Promise.all([
    updateFormStatus(routeId.value, payload),
    updateManagementInfo(routeId.value, updatePayload),
  ]);

  await router.replace({ name: "forms" });
  submitDialog.value = false;
};
const onDownloadPdf = async (item: TMoving) => {
  const { _id, typeOfForm } = item;
  const id = _id as string;
  let currentUrl = "";
  try {
    isDownloading.value = true;
    currentUrl = `/forms/${id}/download/electronic-access-card?site=${mySite.value}`;
    await downloadDobPdf(currentUrl, typeOfForm);
  } finally {
    isDownloading.value = false;
  }
};
function goBack() {
  router.replace({ name: "forms" });
}
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
.asterisk-class span {
  color: red;
}
.subheader-class {
  font-size: 20px;
  font-weight: 400;
}
.label-class {
  font-size: 12px;
  font-weight: 400;
  line-height: 19px;
  margin-bottom: 10px;
}
.reason-class {
  font-size: 20px;
  font-weight: 400;
  line-height: 19px;
  margin-top: 10px;
}
</style>
