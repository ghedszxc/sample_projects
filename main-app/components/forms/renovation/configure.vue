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
                Renovation Form
              </span>
            </div>
          </div>
          <div class="px-10">
            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start pt-6 pb-2 subheader-class">
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
                  <div class="label-class mr-4">Name</div>
                  <div>Your Name</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Unit No.</div>
                  <div>You Unit No.</div>
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
                  <div class="label-class mr-4">Contact No.</div>
                  <div>Your Contact No.</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Office No.</div>
                  <div>Your Office No.</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Mobile No.</div>
                  <div>Your Mobile No.</div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="py-3 d-flex" v-if="$vuetify.display.mdAndUp">
                <div class="align-start pt-6 pb-2 subheader-class">
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
                  <div class="label-class mr-4">Company Name</div>
                  <div>Your Company Name</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Registration No.</div>
                  <div>Your Registration No.</div>
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
                  <div class="label-class mr-4">Address</div>
                  <div>Your Contractor Address</div>
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
                  <div class="label-class mr-4">Person in charge</div>
                  <div>Your Person In Charge</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Office No.</div>
                  <div>Your Contractor Office No.</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Mobile No.</div>
                  <div>Your Contractor Mobile No.</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Home No.</div>
                  <div>Your Contractor Home No.</div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start pt-6 pb-2 subheader-class">
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
                  <div class="label-class mr-4">Start Date</div>
                  <div>{{ formatStandardDate(new Date()) }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">End Date</div>
                  <div>
                    {{ formatStandardDate(new Date()) }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start pt-6 pb-2 subheader-class">
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
                  <div class="label-class mr-4">From</div>
                  <div>{{ formatStandardDate(new Date()) }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">To</div>
                  <div>
                    {{ formatStandardDate(new Date()) }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="my-5">
              <div>
                <tiptap-editor
                  v-if="isEnableApprovalEdit"
                  :removeDefaultWrapper="true"
                  :hideBubble="true"
                  :initialContent="configForm.firstLabel"
                  @content-updated="onHandleApprovalLabel"
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
                          In applying for approval, the Subsidiary Proprietor
                          (Unit Owner) and Contractor undertake to abide by and
                          be subjected to the General Rules & Regulations on
                          Renovation / Addition & Alteration Works as contained
                          in the House Rules.
                        </span>
                      </v-col>
                    </v-row>
                  </v-container>
                </span>
                <span
                  class="text-primary cursor-pointer"
                  @click="
                    onExecuteApprovalLabel(isEnableApprovalEdit ? 'save' : '')
                  "
                >
                  {{ isEnableApprovalEdit ? "(Save Label)" : "(Change Label)" }}
                </span>
              </div>
              <div>
                <tiptap-editor
                  v-if="isEnableAgreementEdit"
                  :removeDefaultWrapper="true"
                  :hideBubble="true"
                  :initialContent="configForm.secondLabel"
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
                        Signature of Subsidiary Proprietors
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
                  class="bg-grey-lighten-3"
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
                      <v-col cols="auto"> Signature of Contractor </v-col>
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
                  <div class="label-class mr-4">Signature Date</div>
                  <div>
                    {{ formatStandardDate(new Date()) }}
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
                  <div class="label-class mr-4">Signature Date</div>
                  <div>
                    {{ formatStandardDate(new Date()) }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start pt-6 pb-2 subheader-class">
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
                  <div class="label-class mr-4">Processed By</div>
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
                  <div class="label-class mr-4">Work to be completed by</div>
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
                  <div class="label-class mr-4">Renovation deposit of</div>
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
                  <div class="label-class mr-4">Address</div>
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
                  <div class="label-class mr-4">Person in charge</div>
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
                  <div class="label-class mr-4">Office No.</div>
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
                  <div class="label-class mr-4">Mobile No.</div>
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
                  <div class="label-class mr-4">Home Phone</div>
                  <div>
                    {{ item.homePhone || "N/A" }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start pt-6 pb-2 subheader-class">
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
                  <div class="label-class mr-4">Management</div>
                  <div>Your Site Name</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">
                    By Cheque - Bank / Cheque No
                  </div>
                  <div>
                    {{ item.chequeNumber || "N/A" }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start text-body-1 pt-6 pb-2 font-weight-bold">
                Note
              </div>

              <div>
                <tiptap-editor
                  v-if="isEnableNoteOneEdit"
                  :removeDefaultWrapper="true"
                  :hideBubble="true"
                  :initialContent="configForm.thirdLabel"
                  @content-updated="onHandleNoteOneLabel"
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
                          1. The submission by Subsidiary Proprietor(s) to the
                          Management for the “Application for Renovation /
                          Addition & Alteration Works” shall not be construed as
                          exemption from compliance with the building
                          regulations/laws or exemption from obtaining approval
                          from other relevant authorities.
                        </span>
                      </v-col>
                    </v-row>
                  </v-container>
                </span>
                <span
                  class="text-primary cursor-pointer"
                  @click="
                    onExecuteNoteOneLabel(isEnableNoteOneEdit ? 'save' : '')
                  "
                >
                  {{ isEnableNoteOneEdit ? "(Save Label)" : "(Change Label)" }}
                </span>
              </div>
              <div>
                <tiptap-editor
                  v-if="isEnableNoteTwoEdit"
                  :removeDefaultWrapper="true"
                  :hideBubble="true"
                  :initialContent="configForm.fourthLabel"
                  @content-updated="onHandleNoteTwoLabel"
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
                            configForm.fourthLabel &&
                            configForm.fourthLabel.trim() !== `<p></p>`.trim()
                          "
                          v-html="configForm.fourthLabel"
                        >
                        </span>
                        <span v-else>
                          2. Subsidiary Proprietor(s) shall consult or liaise
                          directly and/or obtain necessary approvals from the
                          relevant authorities before submitting this
                          application to the Management.
                        </span>
                      </v-col>
                    </v-row>
                  </v-container>
                </span>
                <span
                  class="text-primary cursor-pointer"
                  @click="
                    onExecuteNoteTwoLabel(isEnableNoteTwoEdit ? 'save' : '')
                  "
                >
                  {{ isEnableNoteTwoEdit ? "(Save Label)" : "(Change Label)" }}
                </span>
              </div>
            </div>
          </div>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { item } = useRenovation();
const { isValid } = useForms();
const { configForm, getSelectedFormById, updateSelectedForms } =
  useSiteSettings();
const { setSnackbar } = useLocal();
const { formatStandardDate } = useUtils();
const route = useRoute();
const router = useRouter();

const routeId = computed(() =>
  route.params.id ? String(route.params.id) : "",
);

const approvalLabel = ref("");
const agreementLabel = ref("");
const noteOneLabel = ref("");
const noteTwoLabel = ref("");
const isEnableApprovalEdit = ref(false);
const isEnableAgreementEdit = ref(false);
const isEnableNoteOneEdit = ref(false);
const isEnableNoteTwoEdit = ref(false);
const isShowFirstSignature = ref(true);
const isLoadingFirstSignature = ref(false);
const isShowSecondSignature = ref(true);
const isLoadingSecondSignature = ref(false);

onMounted(async () => {
  try {
    await getSelectedFormById(routeId.value);
    approvalLabel.value = configForm.value.firstLabel || "";
    agreementLabel.value = configForm.value.secondLabel || "";
    noteOneLabel.value = configForm.value.thirdLabel || "";
    noteTwoLabel.value = configForm.value.fourthLabel || "";
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

const onHandleApprovalLabel = (newContent: any) => {
  configForm.value.firstLabel = newContent;
};
const onExecuteApprovalLabel = async (status: string) => {
  try {
    isEnableApprovalEdit.value = !isEnableApprovalEdit.value;
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

const onHandleNoteOneLabel = (newContent: any) => {
  configForm.value.thirdLabel = newContent;
};
const onExecuteNoteOneLabel = async (status: string) => {
  try {
    isEnableNoteOneEdit.value = !isEnableNoteOneEdit.value;
    if (status === "save") await updateSelectedForms(configForm.value);
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  }
};

const onHandleNoteTwoLabel = (newContent: any) => {
  configForm.value.fourthLabel = newContent;
};
const onExecuteNoteTwoLabel = async (status: string) => {
  try {
    isEnableNoteTwoEdit.value = !isEnableNoteTwoEdit.value;
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
  border-bottom: 2px solid #b9b8c0;
  text-align: center;
  width: 33.33%;
  display: flex;
  align-items: center;
}

.stepper-container li:first-child {
  border-bottom: 2px solid #1867c0;
}

.stepper-number {
  background: #b9b8c0;
  width: fit-content;
  padding: 4px 11px;
  border-radius: 100%;
  margin-right: 7px;
  color: #fff;
}

.stepper-container li:first-child .stepper-number {
  background: #1867c0;
}
</style>
