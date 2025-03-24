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
                class="ml-2 text-h6 font-weight-bold text-capitalize"
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
                    <div>
                      {{ item.unitOwner }}
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
                      NRIC: <span>*</span>
                    </p>
                    <div>
                      {{ item.ownerNRIC }}
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
                      Contact No. (HP)<span>*</span>
                    </p>
                    <div>
                      {{ item.ownerContactNumber }}
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
                      Unit No. # <span>*</span>
                    </p>
                    <div>
                      {{ item.unitNumber }}
                    </div>
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
                    <div>
                      {{ item.carOwner }}
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
                      Car Plate No. <span>*</span>
                    </p>
                    <div>
                      {{ item.carPlateNumber }}
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
                    <p class="label-class mr-4">Make</p>
                    <div>
                      {{ item.make }}
                    </div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4">Model</p>
                    <div>
                      {{ item.model }}
                    </div>
                  </div>
                  <div
                    :class="
                      $vuetify.display.mdAndUp
                        ? 'border w-50 pa-3'
                        : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                    "
                  >
                    <p class="label-class mr-4">Colour</p>
                    <div>
                      {{ item.colour }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <!-- SECTION TEXT -->
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
                <p class="mt-10">
                  A. I/We agree to abide by the rules and regulations as
                  stipulated in Royal Palms handbook at all times.
                </p>

                <p class="mt-5">
                  B. I/We also understand that all vehicles are parked entirely
                  at the owner’s risk. All persons and vehicles within the car
                  park enter entirely at the risk of such person and/or the
                  motorist. Persons entering the car park shall be responsible
                  for any damage or loss to the car(s) parked or the car park
                  equipment caused by such persons.
                </p>

                <p class="mt-5 mb-5">
                  C. I/We acknowledge that the vehicle shall be parked properly
                  without causing any inconvenience to other users.
                </p>

                <p class="mt-5 mb-5">
                  D. I/We acknowledge that I/we fully understand the balloting
                  of car park lots when required.
                </p>

                <p class="mt-5 mb-5">
                  E. I/We acknowledge that for 2 nd and subsequent car
                  application will not be entertained. The Management reserved
                  the right to terminate the approval of vehicle application at
                  any point in time.
                </p>
              </span>
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
                    class="signature-container pa-3"
                    :class="
                      $vuetify.display.mdAndUp ? 'border w-50 ' : 'border w-100'
                    "
                  >
                    <div class="label-class mr-4">
                      Signature
                      <span style="color: red">*</span>
                    </div>
                    <div>
                      <v-img
                        :src="item.recipientSignature"
                        alt="Signature"
                        class="custom-height-md"
                      />
                    </div>
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
                        {{ formatStandardDate(item.recipientSignedDate || "") }}
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
                        <div>
                          {{ item.unitOwner }}
                        </div>
                      </div>
                      <div class="border w-100 pa-4">
                        <p class="label-class mr-4">
                          Unit No. # <span style="color: red">*</span>
                        </p>
                        <div>
                          {{ item.unitNumber }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div
              v-if="
                $ability.can('update', 'update-form-status') &&
                /^(pending)$/i.test(item.status || '')
              "
              class="my-5"
            >
              <div class="text-h5 mb-2">Approved/Reject Application</div>
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
const { item, isLoading, setItem, getItemById } = useVehicleRegistration();
const { downloadDobPdf, updateFormStatus, isUpdating, isValid } = useForms();
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
    await getSelectedFormByType("Vehicle Registration Form");
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
  await updateFormStatus(routeId.value, payload);
  await router.replace({ name: "forms" });
  submitDialog.value = false;
};
const onDownloadPdf = async (item: TMoving) => {
  const { _id, typeOfForm } = item;
  const id = _id as string;
  let currentUrl = "";
  try {
    isDownloading.value = true;
    currentUrl = `/forms/${id}/download/vehicle-registration?site=${mySite.value}`;
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
