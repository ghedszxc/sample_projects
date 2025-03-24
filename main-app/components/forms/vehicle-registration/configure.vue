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
                Vehicle Registration Form
              </span>
            </div>
          </div>
          <v-divider></v-divider>
          <div class="px-10">
            <div class="mb-5">
              <div class="align-start text-h6 pt-6 pb-2">
                Vehicle Registration
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
            <div class="pb-5 pt-10">
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
                      Name of Unit Owner: <span>*</span>
                    </p>
                    <div>Your Unit Owner Name</div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      NRIC: <span>*</span>
                    </p>
                    <div>Your Owner NRIC</div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Contact No. (HP)<span>*</span>
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
                      Unit No. # <span>*</span>
                    </p>
                    <div>Your Item No.</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CAR INFORMATION -->
            <div class="pb-5">
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
                      Car Owner Name: <span>*</span>
                    </p>
                    <div>Your Car Owner</div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4 asterisk-class">
                      Car Plate No. <span>*</span>
                    </p>
                    <div>Your Car Plate No.</div>
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
                    <p class="label-class mr-4">Make</p>
                    <div>Your Car Make</div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4">Model</p>
                    <div>Your Car Model</div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4">Colour</p>
                    <div>Your Car Color</div>
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <!-- SECTION TEXT -->
            <div class="pb-5">
              <tiptap-editor
                v-if="isEnableAgreementEdit"
                :removeDefaultWrapper="true"
                :hideBubble="true"
                :initialContent="configForm.firstLabel"
                @content-updated="onHandleAgreementLabel"
              />
              <div v-else>
                <span
                  v-if="
                    configForm &&
                    configForm.firstLabel &&
                    configForm.firstLabel.trim() !== `<p></p>`.trim()
                  "
                  v-html="configForm.firstLabel"
                ></span>
                <div v-else>
                  <p class="mt-10">
                    A. I/We agree to abide by the rules and regulations as
                    stipulated in Royal Palms handbook at all times.
                  </p>

                  <p class="mt-5">
                    B. I/We also understand that all vehicles are parked
                    entirely at the owner’s risk. All persons and vehicles
                    within the car park enter entirely at the risk of such
                    person and/or the motorist. Persons entering the car park
                    shall be responsible for any damage or loss to the car(s)
                    parked or the car park equipment caused by such persons.
                  </p>

                  <p class="mt-5 mb-5">
                    C. I/We acknowledge that the vehicle shall be parked
                    properly without causing any inconvenience to other users.
                  </p>

                  <p class="mt-5 mb-5">
                    D. I/We acknowledge that I/we fully understand the balloting
                    of car park lots when required.
                  </p>

                  <p class="mt-5">
                    E. I/We acknowledge that for 2 nd and subsequent car
                    application will not be entertained. The Management reserved
                    the right to terminate the approval of vehicle application
                    at any point in time.
                  </p>
                </div>
              </div>
              <div>
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

            <!-- SIGNATURE -->
            <div class="pt-5 pb-7">
              <p class="align-start subheader-class pt-6 pb-2 mb-2">
                Acknowledge By:
              </p>
              <div class="mb-5">
                <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
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
                          Signature
                          <span style="color: red">*</span>
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
                        : 'border w-100 d-flex justify-space-between align-center flex-wrap'
                    "
                  >
                    <div class="border w-100 pa-4">
                      <p class="label-class mr-4">
                        Date
                        <span style="color: red">*</span>
                      </p>
                      <div>
                        {{ formatStandardDate(new Date()) }}
                      </div>
                    </div>

                    <div
                      :class="
                        $vuetify.display.mdAndUp
                          ? 'border d-flex w-100'
                          : 'border w-100 d-flex justify-space-between align-center flex-wrap'
                      "
                    >
                      <div class="border w-100 pa-4">
                        <p class="label-class mr-4">
                          Name of Unit Owner <span style="color: red">*</span>
                        </p>
                        <div>Your Unit Owner Name</div>
                      </div>
                      <div class="border w-100 pa-4">
                        <p class="label-class mr-4">
                          Unit No. # <span style="color: red">*</span>
                        </p>
                        <div>Your Unit No.</div>
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
const { item } = useVehicleRegistration();
const { isValid } = useForms();
const { configForm, getSelectedFormById, updateSelectedForms } =
  useSiteSettings();
const { setSnackbar } = useLocal();
const { formatStandardDate } = useUtils();
const route = useRoute();
const router = useRouter();

const agreementLabel = ref("");
const isEnableAgreementEdit = ref(false);
const isShowFirstSignature = ref(true);
const isLoadingFirstSignature = ref(false);

const routeId = computed(() =>
  route.params.id ? String(route.params.id) : "",
);
onMounted(async () => {
  try {
    await getSelectedFormById(routeId.value);
    agreementLabel.value = configForm.value.firstLabel || "";
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
