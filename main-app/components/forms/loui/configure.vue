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
                Letter of Undertaking & Indemnity Form
              </span>
            </div>
          </div>
          <v-divider></v-divider>

          <div class="px-10">
            <div class="mb-5">
              <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
                Letter of Undertaking & Indemnity
              </div>
            </div>

            <div class="mb-5">
              <div class="align-start text-h6 font-weight-regular">
                Letter of undertaking in respect of renovation / addition &
                alteration works at unit
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <p class="align-start text-body pt-6 font-weight-regular">
                I / We, Subsidiary Proprietor(s) of Unit
                <span class="text-primary">Your Unit No.</span>, hereby
                authorize our contractor,
                <span class="text-primary text-capitalize">
                  Your Contractor
                </span>
                Of M/s
                <span class="text-primary">Your Contractor Owner</span> Do to
                undertake the purposes of renovation / addition & alteration
                works to the above property, such works to commence from
                <span class="text-primary">{{
                  formatStandardDate(new Date())
                }}</span>
                to
                <span class="text-primary">{{
                  formatStandardDate(new Date())
                }}</span
                >.
              </p>

              <div>
                <tiptap-editor
                  v-if="isEnableConsiderationEdit"
                  :removeDefaultWrapper="true"
                  :hideBubble="true"
                  :initialContent="configForm.firstLabel"
                  @content-updated="onHandleConsiderationLabel"
                />
                <div
                  v-else
                  class="align-start text-body pt-6 font-weight-regular"
                >
                  <p
                    v-if="
                      configForm &&
                      configForm.firstLabel &&
                      configForm.firstLabel.trim() !== `<p></p>`.trim()
                    "
                    v-html="configForm.firstLabel"
                  ></p>
                  <div v-else>
                    <p>
                      In consideration of you at our request permitting the
                      contractor to have access to the above premises, we hereby
                      agree and undertake to indemnify and hold harmless the
                      Developer, the appointed Managing Agent and the
                      Management, for and against all actions, claims, damages,
                      costs and expenses that may arise from any loss, damage,
                      death, injury from any causes whatsoever to the property
                      or persons caused by or resulting from the Subsidiary
                      Proprietor(s)’ A&A works caused by any act, omission,
                      neglect, default of the Subsidiary Proprietor(s), their
                      servants, agents, contractors, sub-contractors, employees,
                      invitees or any other persons whether or not the loss,
                      damage death or injury is due to the negligence of the
                      Developer, the appointed Managing Agent and the
                      Management.
                    </p>

                    <p>
                      We further undertake to reimburse the developer and its
                      appointed managing agent for all costs involved in
                      removing waste materials and debris arising from our works
                      if they are not removed by our contractors, failing which
                      the costs involved is to be offset from our deposit.
                    </p>

                    <p>
                      We understand that it is our sole responsibility to
                      consult, liaise directly and/or obtain the necessary
                      approvals from the relevant authorities and/or our own
                      Qualified Person before submitting our application to the
                      Management. We shall not commence works of any nature
                      unless we have received the acknowledgement letter from
                      the Management.
                    </p>

                    <p>
                      Enclosed herewith is our cheque of
                      <span class="text-primary"
                        >S${{ item.chequeAmount || 0 }}</span
                      >
                      being the refundable deposit required to be placed with
                      the Management. We shall ensure that our contractors
                      comply with the following:
                    </p>
                  </div>
                </div>
                <div
                  class="text-primary cursor-pointer"
                  @click="
                    onExecuteConsiderationLabel(
                      isEnableConsiderationEdit ? 'save' : '',
                    )
                  "
                >
                  {{
                    isEnableConsiderationEdit
                      ? "(Save Label)"
                      : "(Change Label)"
                  }}
                </div>
              </div>

              <div>
                <tiptap-editor
                  v-if="isEnableComplyEdit"
                  :removeDefaultWrapper="true"
                  :hideBubble="true"
                  :initialContent="configForm.secondLabel"
                  @content-updated="onHandleComplyLabel"
                />
                <div
                  v-else
                  class="align-start text-body pt-6 font-weight-regular"
                >
                  <span
                    v-if="
                      configForm &&
                      configForm.secondLabel &&
                      configForm.secondLabel.trim() !== `<p></p>`.trim()
                    "
                    v-html="configForm.secondLabel"
                  >
                  </span>
                  <div v-else>
                    <p>
                      A. To adhere to the renovation guidelines as laid out in
                      the Renovation / Addition & Alteration Guidelines.
                    </p>
                    <p>
                      B. To keep the common property clean and remove and cart
                      away waste materials and debris, arising out of works,
                      from time to time and on completion of our works or as and
                      when directed by the Management.
                    </p>
                    <p>
                      C. To protect the lobby floors, wall finishes, carpets and
                      lifts against damages when transporting materials.
                    </p>
                    <p>
                      D. To note that any replacement of the existing floor
                      finishes (with or without water proofing membrane) will
                      void the waterproof warranty on the floor finishes.
                    </p>
                    <p>
                      E. To strictly comply with all conditions stated in the
                      application for permit to carry out Addition & Alteration
                      works.
                    </p>
                  </div>
                </div>
                <div
                  class="text-primary cursor-pointer"
                  @click="
                    onExecuteComplyLabel(isEnableComplyEdit ? 'save' : '')
                  "
                >
                  {{ isEnableComplyEdit ? "(Save Label)" : "(Change Label)" }}
                </div>
              </div>
            </div>

            <div class="mb-5">
              <div>
                <tiptap-editor
                  v-if="isEnableAgreementEdit"
                  :removeDefaultWrapper="true"
                  :hideBubble="true"
                  :initialContent="configForm.firstLabel"
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

            <div class="my-5">
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-100 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">Name of Subsidiary Proprietors</div>
                  <div>Your Name of Subsidiary Proprietors</div>
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-100'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <v-container>
                    <v-row
                      class="text-h6 mr-4"
                      align="center"
                      justify="center"
                      no-gutters
                    >
                      <v-col cols="auto">
                        <span> Signature <span class="text-red">*</span> </span>
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
                  <div class="text-h6 mr-4">Date</div>
                  <div>{{ formatStandardDate(new Date()) }}</div>
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
const { item } = useLOUI();
const { isValid } = useForms();
const { configForm, getSelectedFormById, updateSelectedForms } =
  useSiteSettings();
const { setSnackbar } = useLocal();
const { formatStandardDate } = useUtils();
const route = useRoute();
const router = useRouter();

const considerationLabel = ref("");
const complyLabel = ref("");
const agreementLabel = ref("");
const isEnableConsiderationEdit = ref(false);
const isEnableComplyEdit = ref(false);
const isEnableAgreementEdit = ref(false);
const isShowFirstSignature = ref(true);
const isLoadingFirstSignature = ref(false);

const routeId = computed(() =>
  route.params.id ? String(route.params.id) : "",
);

onMounted(async () => {
  try {
    await getSelectedFormById(routeId.value);
    considerationLabel.value = configForm.value.firstLabel || "";
    complyLabel.value = configForm.value.secondLabel || "";
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

const onHandleConsiderationLabel = (newContent: any) => {
  configForm.value.firstLabel = newContent;
};
const onExecuteConsiderationLabel = async (status: string) => {
  try {
    isEnableConsiderationEdit.value = !isEnableConsiderationEdit.value;
    if (status === "save") await updateSelectedForms(configForm.value);
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  }
};

const onHandleComplyLabel = (newContent: any) => {
  configForm.value.secondLabel = newContent;
};
const onExecuteComplyLabel = async (status: string) => {
  try {
    isEnableComplyEdit.value = !isEnableComplyEdit.value;
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

.stepper-container li:last-child {
  border-bottom: 2px solid #b9b8c0;
  color: #bdbdbd;
}

.stepper-number-3 {
  background: #b9b8c0;
  width: fit-content;
  padding: 4px 11px;
  border-radius: 100%;
  margin-right: 7px;
  color: #fff;
}
</style>
