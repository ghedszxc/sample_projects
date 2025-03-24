<template>
  <v-row no-gutters justify="center" class="pa-md-8">
    <v-col cols="12">
      <v-card width="100%" elevation="3" height="100%" class="">
        <v-form v-model="isValid">
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
                Application for Electronic Access Card Form
              </span>
            </div>
          </div>
          <v-divider></v-divider>

          <div class="px-10">
            <div class="mb-5">
              <div class="align-start text-h6 pt-6 pb-2">
                Application for Electronic Access Card
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
                      {{ formatStandardDate(new Date()) }}
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
                    <div>Your Management</div>
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
                <span class="text-blue-darken-3">Your Owner Name</span>
                being the owner of Unit
                <span class="text-blue-darken-3">Your Unit No.</span> of [Your
                Site] hereby submit my / our application for number/s of
                <span class="text-blue-darken-3">Your Access Card No. </span>
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
                    <div>Your Owner NRIC No.</div>
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
                    <div>Your Owner Phone No.</div>
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
                    <div>Your Owner R.</div>
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
                <span class="text-blue-darken-3">Your Nominator Name</span>
                being the owner of Unit
                <span class="text-blue-darken-3">Your Nominator Unit No.</span>
                of [Your Site] hereby nominate my immediate family / tenant
                whose name is given below for the application for (Access Card
                Type) number/s of Access Card
                <span class="text-blue-darken-3">
                  Your Tenant Access Card No.
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
                    <div>Your Tenant Name</div>
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
                      {{ formatStandardDate(new Date()) }}
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
                      {{ formatStandardDate(new Date()) }}
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
                    <div>Your Tenant I/C Passport No.</div>
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
                    <div>Your Tenant Contact No.</div>
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
                    <div>Your Tenant HP</div>
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
                    <div>Your Tenant R</div>
                  </div>
                </div>
              </div>
            </div>
            <v-divider></v-divider>

            <!-- RULES AND REGULATIONS -->
            <div class="pb-5">
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                Rules and regulations
                <span
                  class="text-primary cursor-pointer"
                  @click="
                    onExecuteRulesAndRegLabel(
                      isEnableRulesAndRegEdit ? 'save' : '',
                    )
                  "
                >
                  {{
                    isEnableRulesAndRegEdit
                      ? "(Save)"
                      : "(Change Rules & Regulations)"
                  }}
                </span>
              </p>
              <tiptap-editor
                v-if="isEnableRulesAndRegEdit"
                :removeDefaultWrapper="true"
                :hideBubble="true"
                :initialContent="configForm.firstLabel"
                @content-updated="onHandleRulesAndRegLabel"
              />
              <div v-else>
                <p
                  v-if="
                    configForm &&
                    configForm.firstLabel &&
                    configForm.firstLabel.trim() !== `<p></p>`.trim()
                  "
                  v-html="configForm.firstLabel"
                ></p>
                <div v-else>
                  <p class="mb-3">
                    A. The electronic access card is used to access the side
                    gate, lift lobby and common facilities (where applicable)
                    within the development.
                  </p>

                  <p class="mb-3">
                    B. Additional cards above the allocated number (as
                    distributed at time of vacant possession) will be charged at
                    S$50.00 per card (subject to availability). Units requiring
                    extra cards will be considered on a case-by-case basis and
                    documentary proof is required to prove that the applicants
                    are residing in the Development.
                  </p>

                  <p class="mb-3">
                    C. The replacement of lost / damaged card is charged at
                    S$50.00 per card (non-refundable). All lost card/s must be
                    reported to the Management immediately.
                  </p>

                  <p class="mb-3">
                    D. All residents must exercise due care and diligence in the
                    maintenance of the access card to keep it in good working
                    condition. Keep all cards away from any magnetic
                    device/fields and place them in a cool dry place when not in
                    use.
                  </p>

                  <p class="mb-3">
                    E. The Management reserves the right to request for
                    documentary proof to prove that the applicant/s is/are
                    residing in the development before issuing the access
                    card/s.
                  </p>

                  <p class="mb-3">
                    F. Upon termination of lease, tenants must surrender the
                    access card/s to the Management before moving out of the
                    estate.
                  </p>

                  <p class="mb-3">
                    G. When the owner sells/lease his/her unit, he/she must
                    surrender the access card/s to the Management prior to
                    moving out of the estate.
                  </p>

                  <p class="mb-3">
                    H. The Management, personnel or any appointed representative
                    of the Managing Agent may require the person/s using the
                    access card to identify themselves.
                  </p>

                  <p class="mb-3">
                    I. The access card/s will only be issued to residents living
                    in Royal Palms. Visitors at the Development will not be
                    eligible for an access card. The Management reserves the
                    right to reject the application if documentary proof of the
                    intended access cardholder is not fully furnished.
                  </p>

                  <p class="mb-3">
                    J. The Management reserves the right to change any rules and
                    regulations.
                  </p>

                  <p class="mb-3">
                    K. All cheques are to be issued in favour of “Royal Palms”
                    or the MCST Plan No. (upon constitution).
                  </p>
                </div>
              </div>

              <div class="mb-3">
                <tiptap-editor
                  v-if="isEnableAgreementEdit"
                  :removeDefaultWrapper="true"
                  :hideBubble="true"
                  :initialContent="configForm.secondLabel"
                  @content-updated="onHandleAgreementLabel"
                />
                <span v-else>
                  <v-icon icon="mdi-check-circle" color="green" />
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
                    I / We agree to provide my personal information as indicated
                    and understand that it is solely to be used by the
                    Management for management purposes only. The personal data
                    shall not be used for other purposes.
                  </span>
                </span>
                <span
                  class="text-primary cursor-pointer"
                  @click="
                    onExecuteAgreementLabel(isEnableAgreementEdit ? 'save' : '')
                  "
                >
                  {{
                    isEnableAgreementEdit ? "(Save Label)" : "(Change Label)"
                  }}
                </span>
              </div>
            </div>

            <v-divider></v-divider>

            <!-- FOR MANAGEMENT -->
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
                    <div>Your Cheque No.</div>
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
                      {{ formatStandardDate(new Date()) }}
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
                    <div>Your Approver</div>
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
                      {{ formatStandardDate(new Date()) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <v-container>
                <v-row
                  class="text-h6"
                  align="center"
                  justify="center"
                  no-gutters
                >
                  <v-col cols="auto">
                    Signature <span class="text-red">*</span>
                  </v-col>
                  <v-col class="ml-5">
                    <v-switch
                      v-model="isShowFirstSignature"
                      :base-color="isShowFirstSignature ? 'primary' : 'red'"
                      :color="isShowFirstSignature ? 'primary' : 'red'"
                      :loading="isLoadingFirstSignature"
                      :disabled="isLoadingFirstSignature"
                      hide-details
                      @update:model-value="onShowFirstSignature"
                    >
                      <template v-slot:label>
                        Show/Hide Signature
                        <v-progress-circular
                          v-if="isLoadingFirstSignature"
                          :indeterminate="isLoadingFirstSignature"
                          class="ms-2"
                          size="24"
                        ></v-progress-circular>
                      </template>
                    </v-switch>
                  </v-col>
                  <v-col cols="12" class="text-subtitle-1">
                    Your Signature
                  </v-col>
                </v-row>
              </v-container>
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
          </div>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { item } = useElectronicAccessCard();
const { isValid } = useForms();
const { configForm, getSelectedFormById, updateSelectedForms } =
  useSiteSettings();
const { setSnackbar } = useLocal();
const { formatStandardDate } = useUtils();
const route = useRoute();
const router = useRouter();

const rulesAndRegLabel = ref("");
const agreementLabel = ref("");
const isEnableRulesAndRegEdit = ref(false);
const isEnableAgreementEdit = ref(false);
const isShowFirstSignature = ref(true);
const isLoadingFirstSignature = ref(false);

const routeId = computed(() =>
  route.params.id ? String(route.params.id) : "",
);
onMounted(async () => {
  try {
    await getSelectedFormById(routeId.value);
    rulesAndRegLabel.value = configForm.value.firstLabel || "";
    agreementLabel.value = configForm.value.secondLabel || "";
    agreementLabel.value = configForm.value.thirdLabel || "";
    isShowFirstSignature.value = configForm.value.isShowFirstSignature || false;
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  }
});

const onHandleRulesAndRegLabel = (newContent: any) => {
  configForm.value.firstLabel = newContent;
};
const onExecuteRulesAndRegLabel = async (status: string) => {
  try {
    isEnableRulesAndRegEdit.value = !isEnableRulesAndRegEdit.value;
    if (status === "save") await updateSelectedForms(configForm.value);
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  }
};

const onHandleAgreementLabel = (newContent: any) => {
  configForm.value.secondLabel = newContent;
};
const onExecuteAgreementLabel = async (status: string) => {
  try {
    isEnableAgreementEdit.value = !isEnableAgreementEdit.value;
    if (status === "save") await updateSelectedForms(configForm.value);
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  }
};

const onShowFirstSignature = async () => {
  try {
    isLoadingFirstSignature.value = true;
    configForm.value.isShowFirstSignature = isShowFirstSignature.value;
    await updateSelectedForms(configForm.value);
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  } finally {
    isLoadingFirstSignature.value = false;
  }
};

function goBack() {
  router.replace({ name: "forms-config" });
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
