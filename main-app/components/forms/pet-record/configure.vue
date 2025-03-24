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
                Pet Record Form
              </span>
            </div>
          </div>
          <v-divider></v-divider>
          <div class="px-10">
            <div class="align-start text-h6 pt-6 mb-5">
              Pet Record Information
            </div>

            <v-divider />

            <div class="mb-5">
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Site</div>
                  <div>Your Site</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Date</div>
                  <div>
                    {{ formatStandardDate(new Date()) }}
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
                  <div class="label-class mr-4">Name of Pet/s</div>
                  <div>Your Pets</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Type of Pet/s</div>
                  <div>Type of your Pet</div>
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
                  <div class="label-class mr-4">Breed</div>
                  <div>Breed of your Pet</div>
                </div>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">License No.</div>
                  <div>License number of your Pet</div>
                </div>
              </div>
            </div>

            <div class="mb-5">
              <div class="py-3 d-flex" v-if="$vuetify.display.mdAndUp">
                <div class="subheader-class w-50">Owner's Particulars</div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="border bg-grey"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'w-50 pa-3'
                      : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">
                    Name <span class="text-red">*</span>
                  </div>
                  <div>Your Name</div>
                </div>
                <div
                  class="border bg-grey"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'w-50 pa-3'
                      : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">
                    Unit No. <span class="text-red">*</span>
                  </div>
                  <div>Your Unit No.</div>
                </div>
                <div
                  class="border bg-grey"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'w-50 pa-3'
                      : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">
                    Contact No. <span class="text-red">*</span>
                  </div>
                  <div>Your Contact No.</div>
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="border bg-grey"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'w-50 pa-3'
                      : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">
                    Email <span class="text-red">*</span>
                  </div>
                  <div>Your Email</div>
                </div>
                <div
                  class="border bg-grey"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'w-50 pa-3'
                      : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">
                    Correspondence Address <span class="text-red">*</span>
                  </div>
                  <div>Your Correspondence Address</div>
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
                            configForm.firstLabel &&
                            configForm.firstLabel.trim() !== `<p></p>`.trim()
                          "
                          v-html="configForm.firstLabel"
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

              <div class="py-3 d-flex mt-5" v-if="$vuetify.display.mdAndUp">
                <div class="subheader-class w-50">
                  Declaration from Subsidiary Proprietor / Tenant:
                </div>
              </div>
              <div class="mb-5">
                <tiptap-editor
                  v-if="isEnableDeclarationEdit"
                  :removeDefaultWrapper="true"
                  :hideBubble="true"
                  :initialContent="configForm.secondLabel"
                  @content-updated="onHandleDeclarationLabel"
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
                    I declare that I am residing at (Site Property) and that all
                    the above particulars given by me are true and correct.
                  </span>
                </span>
                <span
                  class="text-primary cursor-pointer"
                  @click="
                    onExecuteDeclarationLabel(
                      isEnableDeclarationEdit ? 'save' : '',
                    )
                  "
                >
                  {{
                    isEnableDeclarationEdit ? "(Save Label)" : "(Change Label)"
                  }}
                </span>
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
                  <div class="label-class mr-4">
                    Site Property <span class="text-red">*</span>
                  </div>
                  <div>Your Site</div>
                </div>
                <div
                  class="border"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'w-50 pa-3'
                      : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">
                    Attach Files <span class="ml-1">(Optional)</span>
                  </div>
                  <div
                    v-if="
                      Array.isArray(item.attachments) &&
                      item.attachments.length > 0
                    "
                  >
                    Your Attachment/s
                  </div>
                  <div v-else>No Attachments</div>
                </div>
              </div>
            </div>
            <div class="mb-5">
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
                      :loading="isLoadingSignature"
                      :disabled="isLoadingSignature"
                      hide-details
                      @update:model-value="onShowFirstSignature"
                    >
                      <template v-slot:label>
                        Show/Hide Signature
                        <v-progress-circular
                          v-if="isLoadingSignature"
                          :indeterminate="isLoadingSignature"
                          class="ms-2"
                          size="24"
                        ></v-progress-circular>
                      </template>
                    </v-switch>
                  </v-col>
                  <v-col cols="12"> Your Signature </v-col>
                </v-row>
              </v-container>
            </div>
          </div>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { item } = usePetRecords();
const { isValid } = useForms();
const { configForm, getSelectedFormById, updateSelectedForms } =
  useSiteSettings();
const { setSnackbar } = useLocal();
const { formatStandardDate } = useUtils();
const route = useRoute();
const router = useRouter();

const agreementLabel = ref("");
const declarationLabel = ref("");
const isShowFirstSignature = ref(true);
const isEnableAgreementEdit = ref(false);
const isEnableDeclarationEdit = ref(false);
const isLoadingSignature = ref(false);

const routeId = computed(() =>
  route.params.id ? String(route.params.id) : "",
);

onMounted(async () => {
  try {
    await getSelectedFormById(routeId.value);
    agreementLabel.value = configForm.value.firstLabel || "";
    declarationLabel.value = configForm.value.secondLabel || "";
    isShowFirstSignature.value = configForm.value.isShowFirstSignature || false;
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  }
});

const onHandleAgreementLabel = (newContent: any) => {
  configForm.value.firstLabel = newContent;
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

const onHandleDeclarationLabel = (newContent: any) => {
  configForm.value.secondLabel = newContent;
};
const onExecuteDeclarationLabel = async (status: string) => {
  try {
    isEnableDeclarationEdit.value = !isEnableDeclarationEdit.value;
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
    isLoadingSignature.value = true;
    configForm.value.isShowFirstSignature = isShowFirstSignature.value;
    await updateSelectedForms(configForm.value);
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  } finally {
    isLoadingSignature.value = false;
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
</style>
