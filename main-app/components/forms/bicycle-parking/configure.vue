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
                Application for Bicycle Parking Form
              </span>
            </div>
          </div>
          <v-divider></v-divider>
          <div class="px-10">
            <div class="mb-5">
              <div class="align-start text-h6 pt-6 pb-2">
                Application for Bicycle Parking
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
                      Unit Owner/Tenant's Name: <span>*</span>
                    </p>
                    <div>Your Unit Owner</div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Unit No. #<span>*</span>
                    </p>
                    <div>Your Unit No.</div>
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
                    <div>Your Owner Contact No.</div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      (Hp): <span>*</span>
                    </p>
                    <div>Your Owner HP</div>
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <!-- NOMINEE IF APPLICABLE -->
            <div class="pb-5">
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                Reasons for application:
                <span class="font-weight-bold">
                  Your Reason for Application
                </span>
              </p>

              <div class="mt-5">
                <tiptap-editor
                  v-if="isEnableConditionEdit"
                  :removeDefaultWrapper="true"
                  :hideBubble="true"
                  :initialContent="configForm.firstLabel"
                  @content-updated="onHandleConditionLabel"
                />
                <span v-else>
                  <v-container>
                    <v-row
                      class="text-h6"
                      align="start"
                      justify="space-between"
                    >
                      <v-col cols="auto" class="pa-0">
                        <v-icon icon="mdi-check-circle" color="green" />
                      </v-col>
                      <v-col class="pa-0 ml-10">
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
                          I / We have read the above conditions and agreed to
                          abide by the terms and conditions therein. I / We
                          confirmed that the above particulars are correct and
                          undertake to comply with all rules and regulations
                          governing the usage of bicycle parking.
                        </span>
                      </v-col>
                    </v-row>
                  </v-container>
                </span>
                <span
                  class="text-primary cursor-pointer"
                  @click="
                    onExecuteConditionLabel(isEnableConditionEdit ? 'save' : '')
                  "
                >
                  {{
                    isEnableConditionEdit ? "(Save Label)" : "(Change Label)"
                  }}
                </span>
              </div>

              <div class="mt-5">
                <tiptap-editor
                  v-if="isEnablePersonalInfoEdit"
                  :removeDefaultWrapper="true"
                  :hideBubble="true"
                  :initialContent="configForm.secondLabel"
                  @content-updated="onHandlePersonalInfoLabel"
                />
                <span v-else>
                  <v-container>
                    <v-row
                      class="text-h6"
                      align="start"
                      justify="space-between"
                    >
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
                          indicated and understand that it is solely to be used
                          by the Management for management purposes only. The
                          personal data shall not be used for other purposes.
                        </span>
                      </v-col>
                    </v-row>
                  </v-container>
                </span>
                <span
                  class="text-primary cursor-pointer"
                  @click="
                    onExecutePersonalInfoLabel(
                      isEnablePersonalInfoEdit ? 'save' : '',
                    )
                  "
                >
                  {{
                    isEnablePersonalInfoEdit ? "(Save Label)" : "(Change Label)"
                  }}
                </span>
              </div>

              <div class="mt-5 mb-5">
                <tiptap-editor
                  v-if="isEnableAgreementEdit"
                  :removeDefaultWrapper="true"
                  :hideBubble="true"
                  :initialContent="configForm.thirdLabel"
                  @content-updated="onHandleAgreementLabel"
                />
                <span v-else>
                  <v-container>
                    <v-row
                      class="text-h6"
                      align="start"
                      justify="space-between"
                    >
                      <v-col cols="auto" class="pa-0">
                        <v-icon icon="mdi-check-circle" color="green" />
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
                          I / We understand that when I / We lease/move out of
                          the apartment. I / We are to surrender use of the
                          bicycle parking to the Management immediately upon
                          vacating the premises. I / We agree to adhere to the
                          above rules governing the bicycle parking.
                        </span>
                      </v-col>
                    </v-row>
                  </v-container>
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

            <!-- SIGNATURE -->
            <div class="pb-5">
              <div class="mb-5">
                <div :class="$vuetify.display.mdAndUp ? 'block' : ''">
                  <div
                    :class="
                      $vuetify.display.mdAndUp ? 'border w-50 ' : 'border w-100'
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
                          Signature <span class="text-red">*</span>
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

            <!-- ACKNOWLEDGEMENT -->
            <div>
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                Acknowledgement:
              </p>
              <p class="mt-6 mb-5">
                I/We Your Recipient hereby acknowledge receipt of bicycle tag
              </p>

              <div class="mb-5">
                <div :class="$vuetify.display.mdAndUp ? 'block' : ''">
                  <div
                    :class="
                      $vuetify.display.mdAndUp ? 'border w-50 ' : 'border w-100'
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
                          Signature <span class="text-red">*</span>
                        </v-col>
                        <v-col class="ml-5">
                          <v-switch
                            v-model="isShowSecondSignature"
                            :base-color="
                              isShowSecondSignature ? 'primary' : 'red'
                            "
                            :color="isShowSecondSignature ? 'primary' : 'red'"
                            :loading="isLoadingSecondSignature"
                            :disabled="isLoadingSecondSignature"
                            hide-details
                            @update:model-value="onShowSecondSignature"
                          >
                            <template v-slot:label>
                              Show/Hide Signature
                              <v-progress-circular
                                v-if="isLoadingSecondSignature"
                                :indeterminate="isLoadingSecondSignature"
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
            <div class="pb-5">
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
                      Tag No. Issued: <span>*</span>
                    </p>
                    <div>Your Tag Number</div>
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
const { item } = useBicycleParking();
const { isValid } = useForms();
const { configForm, getSelectedFormById, updateSelectedForms } =
  useSiteSettings();
const { setSnackbar } = useLocal();
const { formatStandardDate } = useUtils();
const route = useRoute();
const router = useRouter();

const conditionLabel = ref("");
const personalInfoLabel = ref("");
const agreementLabel = ref("");
const isEnableConditionEdit = ref(false);
const isEnablePersonalInfoEdit = ref(false);
const isEnableAgreementEdit = ref(false);
const isShowFirstSignature = ref(true);
const isLoadingFirstSignature = ref(false);
const isShowSecondSignature = ref(true);
const isLoadingSecondSignature = ref(false);

const routeId = computed(() =>
  route.params.id ? String(route.params.id) : "",
);
onMounted(async () => {
  try {
    await getSelectedFormById(routeId.value);
    conditionLabel.value = configForm.value.firstLabel || "";
    personalInfoLabel.value = configForm.value.secondLabel || "";
    agreementLabel.value = configForm.value.thirdLabel || "";
    isShowFirstSignature.value = configForm.value.isShowFirstSignature || false;
    isShowSecondSignature.value =
      configForm.value.isShowSecondSignature || false;
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  }
});

const onHandleConditionLabel = (newContent: any) => {
  configForm.value.firstLabel = newContent;
};
const onExecuteConditionLabel = async (status: string) => {
  try {
    isEnableConditionEdit.value = !isEnableConditionEdit.value;
    if (status === "save") await updateSelectedForms(configForm.value);
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  }
};

const onHandlePersonalInfoLabel = (newContent: any) => {
  configForm.value.secondLabel = newContent;
};
const onExecutePersonalInfoLabel = async (status: string) => {
  try {
    isEnablePersonalInfoEdit.value = !isEnablePersonalInfoEdit.value;
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

const onShowSecondSignature = async () => {
  try {
    isLoadingSecondSignature.value = true;
    configForm.value.isShowSecondSignature = isShowSecondSignature.value;
    await updateSelectedForms(configForm.value);
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  } finally {
    isLoadingSecondSignature.value = false;
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
