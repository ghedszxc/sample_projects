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
                Renovation Refund Form
              </span>
            </div>
          </div>
          <v-divider></v-divider>

          <div class="px-10">
            <div class="mb-5">
              <div class="align-start text-h6 pt-6 mb-5">
                Renovation Refund Form
              </div>
            </div>

            <div class="mb-5">
              <div class="align-start">
                Request for refund of renovation deposit In respect of
                renovation / addition & alteration works at unit no
                <span style="color: blue">Your Unit No.</span>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                Dear Sir/Madam
              </p>
              <div class="pb-5">
                <tiptap-editor
                  v-if="isEnableInformEdit"
                  :removeDefaultWrapper="true"
                  :hideBubble="true"
                  :initialContent="configForm.firstLabel"
                  @content-updated="onHandleInformLabel"
                />
                <span
                  v-else
                  class="align-start text-body pt-6 font-weight-regular mb-5"
                >
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
                </span>
                <span
                  class="text-primary cursor-pointer"
                  @click="
                    onExecuteInformLabel(isEnableInformEdit ? 'save' : '')
                  "
                >
                  {{ isEnableInformEdit ? "(Save Label)" : "(Change Label)" }}
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
                    <div class="label-class mr-4">
                      Date of completion of Renovation / A & A works
                    </div>
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
                    <div class="label-class mr-4">Date of joint inspection</div>
                    <div>
                      {{ formatStandardDate(new Date()) }}
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
                    <div class="label-class mr-4">Remarks</div>
                    <div>Your Remarks</div>
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <!-- SUBMITTED -->
            <div>
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                Submitted By:
              </p>
              <div class="mb-5">
                <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50'
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
                        ? 'border w-50'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <div class="border w-100 pa-4">
                      <p class="label-class mr-4">
                        Name of Applicant Name (Subsidiary Proprietor)
                        <span style="color: red">*</span>
                      </p>
                      <div>Your Applicant Name</div>
                    </div>
                    <div class="border w-100 pa-4">
                      <p class="label-class mr-4">
                        Date of Refund <span style="color: red">*</span>
                      </p>
                      <div>
                        {{ formatStandardDate(new Date()) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CERTIFIED -->
            <div>
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                Certified By:
              </p>
              <div class="mb-5">
                <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50'
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
                        ? 'border w-50'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <div class="border w-100 pa-4">
                      <p class="label-class mr-4">
                        Name of Applicant Name (Subsidiary Proprietor)
                        <span style="color: red">*</span>
                      </p>
                      <div>Your Applicant Name</div>
                    </div>
                    <div class="border w-100 pa-4">
                      <p class="label-class mr-4">
                        Date of Refund <span style="color: red">*</span>
                      </p>
                      <div>
                        {{ formatStandardDate(new Date()) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- RECEIVED -->
            <div>
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                Received By:
              </p>
              <div class="mb-5">
                <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50'
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
                            v-model="isShowThirdSignature"
                            :base-color="
                              isShowThirdSignature ? 'primary' : 'red'
                            "
                            :color="isShowThirdSignature ? 'primary' : 'red'"
                            :loading="isLoadingThirdSignature"
                            :disabled="isLoadingThirdSignature"
                            hide-details
                            @update:model-value="onShowThirdSignature"
                          >
                            <template v-slot:label>
                              Show/Hide Signature
                              <v-progress-circular
                                v-if="isLoadingThirdSignature"
                                :indeterminate="isLoadingThirdSignature"
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
                        ? 'border w-50'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <div class="border w-100 pa-4">
                      <p class="label-class mr-4">
                        Name of Applicant Name (Subsidiary Proprietor)
                        <span style="color: red">*</span>
                      </p>
                      <div>Your Applicant Name</div>
                    </div>
                    <div class="border w-100 pa-4">
                      <p class="label-class mr-4">
                        Date of Refund <span style="color: red">*</span>
                      </p>
                      <div>
                        {{ formatStandardDate(new Date()) }}
                      </div>
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
const { item } = useRenovationRefund();
const { isValid } = useForms();
const { configForm, getSelectedFormById, updateSelectedForms } =
  useSiteSettings();
const { setSnackbar } = useLocal();
const { formatStandardDate } = useUtils();
const route = useRoute();
const router = useRouter();

const informLabel = ref("");
const isEnableInformEdit = ref(false);
const isShowFirstSignature = ref(true);
const isLoadingFirstSignature = ref(false);
const isShowSecondSignature = ref(true);
const isLoadingSecondSignature = ref(false);
const isShowThirdSignature = ref(true);
const isLoadingThirdSignature = ref(false);

const routeId = computed(() =>
  route.params.id ? String(route.params.id) : "",
);
onMounted(async () => {
  try {
    await getSelectedFormById(routeId.value);
    informLabel.value = configForm.value.firstLabel || "";
    isShowFirstSignature.value = configForm.value.isShowFirstSignature || false;
    isShowSecondSignature.value =
      configForm.value.isShowSecondSignature || false;
    isShowThirdSignature.value = configForm.value.isShowThirdSignature || false;
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  }
});

const onHandleInformLabel = (newContent: any) => {
  configForm.value.firstLabel = newContent;
};
const onExecuteInformLabel = async (status: string) => {
  try {
    isEnableInformEdit.value = !isEnableInformEdit.value;
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

const onShowThirdSignature = async () => {
  try {
    isLoadingThirdSignature.value = true;
    configForm.value.isShowThirdSignature = isShowThirdSignature.value;
    await updateSelectedForms(configForm.value);
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  } finally {
    isLoadingThirdSignature.value = false;
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
.stepper-container {
  display: flex;
  margin-bottom: 30px;
  width: 100%;
  overflow: hidden;
}

.stepper-container li {
  padding: 20px 10px;
  border-bottom: 2px solid #1867c0;
  text-align: center;
  width: 33.33%;
  display: flex;
  align-items: center;
}

.stepper-number {
  background: #1867c0;
  width: fit-content;
  padding: 4px 11px;
  border-radius: 100%;
  margin-right: 7px;
  color: #fff;
}
</style>
