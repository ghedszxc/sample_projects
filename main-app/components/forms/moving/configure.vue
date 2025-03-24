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
                class="ml-2 text-h6 font-weight-bold text-capitalize"
                style="letter-spacing: 2px !important"
              >
                Application for Moving In/Out & Delivery Form
              </span>
            </div>
          </div>
          <v-divider></v-divider>
          <div class="px-10">
            <div class="mb-5">
              <div class="align-start text-h6 pt-6 pb-2">
                Application for Moving In/Out & Delivery Form
              </div>
            </div>

            <div class="mb-5">
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

            <!-- UNIT NUMBER -->
            <div class="mb-5">
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                Unit No. (Block/Level/Unit) Move In / Out / Delivery
              </p>
              <div class="mb-5">
                <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-100 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">Unit No.</p>
                    <div>Your Unit No.</div>
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <!-- OWNERS PARTICULARS -->
            <div>
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                Owner’s Particulars:
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
                    <p class="label-class mr-4">Name</p>
                    <div>Your Name</div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4">IC/Passport No:</p>
                    <div>Your IC/Passport</div>
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
                    <p class="label-class mr-4">Contact No</p>
                    <div>Your Owner Contact No.</div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4">Office No</p>
                    <div>Your Owner Office</div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4">Home Phone</p>
                    <div>Your Home Phone</div>
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <!-- MOVERS PARTICULARS -->
            <div>
              <div class="mt-10">
                <tiptap-editor
                  v-if="isEnableRulesAndRegEdit"
                  :removeDefaultWrapper="true"
                  :hideBubble="true"
                  :initialContent="configForm.firstLabel"
                  @content-updated="onHandleRulesAndRegLabel"
                />
                <span v-else>
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
                </span>
                <span
                  class="text-primary cursor-pointer"
                  @click="
                    onExecuteRulesAndRegLabel(
                      isEnableRulesAndRegEdit ? 'save' : '',
                    )
                  "
                >
                  {{
                    isEnableRulesAndRegEdit ? "(Save Label)" : "(Change Label)"
                  }}
                </span>
              </div>
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                Mover’s particulars
              </p>

              <div class="mb-5">
                <div :class="$vuetify.display.mdAndUp ? 'd-flex ga-3' : ''">
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Mover's Company: <span>*</span>
                    </p>
                    <div>Your Company Name</div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Office: <span>*</span>
                    </p>
                    <div>Your Office</div>
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
                    <div>Your Home Phone</div>
                  </div>
                </div>
              </div>

              <div class="mb-5">
                <div :class="$vuetify.display.mdAndUp ? 'd-flex ga-3' : ''">
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Name of Supervisor <span>*</span>
                    </p>
                    <div>Your Supervisor Name</div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4">ID/Passport No:</p>
                    <div>Your ID/Passport</div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Work Permit <span>*</span>
                    </p>
                    <div>Your Work Permit</div>
                  </div>
                </div>
              </div>

              <div class="mb-5">
                <div :class="$vuetify.display.mdAndUp ? 'd-flex ga-3' : ''">
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Address <span>*</span>
                    </p>
                    <div>Your Address</div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-25 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Vehicle Type: <span>*</span>
                    </p>
                    <div>Your Vehicle Type</div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-25 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Vehicle Regn: <span>*</span>
                    </p>
                    <div>Your Vehicle Registration</div>
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <!-- UNDERTAKINGS BY SUBSIDIARY -->
            <div>
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                Undertakings by Subsidiary Proprietor / Tenant
              </p>
              <div class="mt-6">
                <tiptap-editor
                  v-if="isEnableHouseRulesEdit"
                  :removeDefaultWrapper="true"
                  :hideBubble="true"
                  :initialContent="configForm.secondLabel"
                  @content-updated="onHandleHouseRulesLabel"
                />
                <span v-else>
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
                </span>
                <span
                  class="text-primary cursor-pointer"
                  @click="
                    onExecuteHouseRulesLabel(
                      isEnableHouseRulesEdit ? 'save' : '',
                    )
                  "
                >
                  {{
                    isEnableHouseRulesEdit ? "(Save Label)" : "(Change Label)"
                  }}
                </span>
              </div>

              <div class="my-6">
                <tiptap-editor
                  v-if="isEnableAgreementEdit"
                  :removeDefaultWrapper="true"
                  :hideBubble="true"
                  :initialContent="configForm.thirdLabel"
                  @content-updated="onHandleAgreementLabel"
                />
                <span v-else>
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

              <div class="mb-5">
                <div :class="$vuetify.display.mdAndUp ? 'block' : ''">
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 '
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <v-container>
                      <v-row
                        class="text-h6"
                        align="center"
                        justify="center"
                        no-gutters
                      >
                        <v-col cols="auto">
                          Signature of Applicant Signature (Subsidiary
                          Proprietor)
                        </v-col>
                        <v-col class="ml-5">
                          <v-switch
                            v-model="isShowFirstSignature"
                            :base-color="
                              isShowFirstSignature ? 'primary' : 'red'
                            "
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
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Signature Date <span>*</span>
                    </p>
                    <div>
                      {{ formatStandardDate(new Date()) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <!-- FOR MANAGEMENT -->

            <div>
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                For management use:
              </p>

              <div class="mb-10">
                <tiptap-editor
                  v-if="isEnableSecDepositEdit"
                  :removeDefaultWrapper="true"
                  :hideBubble="true"
                  :initialContent="configForm.fourthLabel"
                  @content-updated="onHandleSecDepositLabel"
                />
                <span v-else>
                  <span
                    v-if="
                      configForm &&
                      configForm.fourthLabel &&
                      configForm.fourthLabel.trim() !== `<p></p>`.trim()
                    "
                    v-html="configForm.fourthLabel"
                  >
                  </span>
                  <span v-else> Security deposit of S$1,000.00 </span>
                </span>
                <span
                  class="text-primary cursor-pointer"
                  @click="
                    onExecuteSecDepositLabel(
                      isEnableSecDepositEdit ? 'save' : '',
                    )
                  "
                >
                  {{
                    isEnableSecDepositEdit ? "(Save Label)" : "(Change Label)"
                  }}
                </span>
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
          </div>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { isValid } = useForms();
const { configForm, getSelectedFormById, updateSelectedForms } =
  useSiteSettings();
const { setSnackbar } = useLocal();
const { formatStandardDate } = useUtils();
const route = useRoute();
const router = useRouter();

const rulesAndRegLabel = ref("");
const houseRulesLabel = ref("");
const agreementLabel = ref("");
const secDepositLabel = ref("");
const isEnableRulesAndRegEdit = ref(false);
const isEnableHouseRulesEdit = ref(false);
const isEnableAgreementEdit = ref(false);
const isEnableSecDepositEdit = ref(false);
const isShowFirstSignature = ref(true);
const isLoadingFirstSignature = ref(false);

const routeId = computed(() =>
  route.params.id ? String(route.params.id) : "",
);
onMounted(async () => {
  try {
    await getSelectedFormById(routeId.value);
    rulesAndRegLabel.value = configForm.value.firstLabel || "";
    houseRulesLabel.value = configForm.value.secondLabel || "";
    agreementLabel.value = configForm.value.thirdLabel || "";
    secDepositLabel.value = configForm.value.fourthLabel || "";
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

const onHandleHouseRulesLabel = (newContent: any) => {
  configForm.value.secondLabel = newContent;
};
const onExecuteHouseRulesLabel = async (status: string) => {
  try {
    isEnableHouseRulesEdit.value = !isEnableHouseRulesEdit.value;
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
  configForm.value.thirdLabel = newContent;
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

const onHandleSecDepositLabel = (newContent: any) => {
  configForm.value.fourthLabel = newContent;
};
const onExecuteSecDepositLabel = async (status: string) => {
  try {
    isEnableSecDepositEdit.value = !isEnableSecDepositEdit.value;
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
