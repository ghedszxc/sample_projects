<template>
  <v-row no-gutters justify="center" class="py-8">
    <v-col cols="10" class="font-weight-light mt-4">
      <v-card
        v-if="!isLoading"
        elevation="0"
        style="border-width: thin"
        min-height="368px"
      >
        <v-form v-model="isIncidentValid" @submit.prevent="submit()" ref="form">
          <v-row no-gutters class="pa-8" justify="center">
            <v-col
              cols="12"
              class="text-h5 font-weight-bold mb-7 text-capitalize"
              style="letter-spacing: 2px !important"
            >
              Update Incident Report
            </v-col>
            <v-stepper v-model:model-value="step" class="w-100">
              <v-stepper-header>
                <v-stepper-item
                  :complete="step > 0"
                  editable
                  step="0"
                  value="0"
                >
                  Incident Information
                </v-stepper-item>

                <v-divider></v-divider>

                <v-stepper-item
                  :complete="step > 1"
                  :editable="isStep1Valid"
                  value="1"
                  step="1"
                >
                  Affected Entities
                </v-stepper-item>

                <v-divider></v-divider>

                <v-stepper-item
                  :complete="step > 2"
                  :editable="isStep2Valid"
                  step="2"
                  value="2"
                >
                  Authorities
                </v-stepper-item>

                <v-divider></v-divider>

                <v-stepper-item
                  :complete="step > 3"
                  :editable="isStep3Valid"
                  step="3"
                  value="3"
                >
                  Brief Summary
                </v-stepper-item>
              </v-stepper-header>

              <template v-if="step == 0 && !isLoading">
                <IncidentsStep1
                  :incident="incident"
                  :blocks="blocks"
                  :blockLevels="blockLevels"
                  :units="units"
                  :is-edit="true"
                  @update-data="getDataIncident($event)"
                />
              </template>

              <template v-if="step == 1">
                <IncidentsStep2 :incident="incident" />
              </template>

              <template v-if="step == 2">
                <IncidentsStep3 :incident="incident" />
              </template>

              <template v-if="step == 3">
                <IncidentsStep4
                  :incident="incident"
                  :uploadedAttachments="uploadedAttachments"
                />
              </template>

              <v-row no-gutters class="d-flex justify-space-between pa-5">
                <div>
                  <v-btn @click="prevStep" v-if="step != 0"
                    ><v-icon class="mr-1"> mdi-arrow-left </v-icon>Prev</v-btn
                  >
                </div>

                <div>
                  <v-btn v-if="step == 0" @click="nextStep2" color="primary"
                    >Go to Step 2
                    <v-icon class="ml-1"> mdi-arrow-right </v-icon>
                  </v-btn>
                  <v-btn v-if="step == 1" @click="nextStep3" color="primary"
                    >Go to Step 3<v-icon class="ml-1">
                      mdi-arrow-right
                    </v-icon></v-btn
                  >
                  <v-btn
                    v-if="step == 2"
                    @click="nextStep4"
                    color="primary"
                    :loading="isLoading"
                    >Go to Step 4
                    <v-icon class="ml-1"> mdi-arrow-right </v-icon>
                  </v-btn>

                  <template v-if="$ability.can('create', 'create-incidents')">
                    <v-btn
                      v-if="step == 3"
                      type="submit"
                      color="primary"
                      variant="flat"
                      :loading="isSubmitting"
                      @click="submit()"
                    >
                      submit
                    </v-btn>
                  </template>
                </div>
              </v-row>
            </v-stepper>
          </v-row>
        </v-form>
      </v-card>
      <div v-else>Loading...</div>
    </v-col>
    <DobEntryConfirmPassword
      @sign-dob="confirmSign($event)"
      is-confirm-title="Confirm Password to Submit the Incident Report"
    />
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure"],
  name: "Edit Incident Report",
});

const { isConfirmModal } = useOccurrenceEntry();
const { currentUser } = useLocalAuth();
const {
  incident,
  updateIncident,
  setIncidents,
  setIncident,
  isIncidentValid,
  getIncidentById,
  getIncrementedReportId,
  photoId,
} = useIncident();
const { getAllBuildingBlocks, blocks } = useBlock();
const { blockLevels } = useBlockLevel();
const { units } = useBlockLevelUnit();
const { setSnackbar } = useLocal();
const { getSiteById } = useSite();
const route = useRoute();
const { timeValidation, timeValueValidation } = useUtils();

const router = useRouter();
const { getSitesOptionsForFiltering, siteOptions, filterSite, mySite } =
  useFilter();

const isSubmitting = ref(false);
const isLoading = ref(false);
const siteId = ref("");
const form = ref(null);
const siteName = ref("");
const oldIncident = ref();

const isUnitAffectedHasNoValue = computed(() => {
  return incident.value.affectedEntities.anyUnitAffectedValue === "no";
});
const isAnyoneAffectedHasNoValue = computed(() => {
  return incident.value.affectedEntities.anyoneAffectedValue === "no";
});
const isPropertyAffectedHasNoValue = computed(() => {
  return incident.value.affectedEntities.anyPropertyAffectedValue === "no";
});
const isAuthorityArrived = computed(() => {
  return (
    !incident.value.authorities.authoritiesValue ||
    incident.value.authorities.authoritiesValue === "no"
  );
});
const id = computed(() => route.params.id as string);
const isSummary = ref(false);
onMounted(async () => {
  isLoading.value = true;
  await getSitesOptionsForFiltering();
  const [referenceNumber, site] = await Promise.all([
    getIncrementedReportId({
      site: mySite.value,
    }),
    getSiteById(String(mySite.value)),
    getAllBuildingBlocks({
      site: mySite.value,
    }),
    setIncidents({
      site: mySite.value,
    }),
  ]);
  let _incident = await getIncidentById(id.value);
  setIncident(_incident);
  siteName.value = (site && site.name) || "No Site";
  siteId.value = (site && site._id) || "";
  incident.value.incidentInformation.siteInfo.irNumber = referenceNumber;
  oldIncident.value = incident.value;
  isLoading.value = false;
});

const step = ref(0);

const isStep1Valid = computed(() => {
  const { incidentInformation } = incident.value;
  const complaintReceivedTo = incidentInformation.complaintReceivedTo;

  const isReceivedViaOther = complaintReceivedTo.receivedVia === "other";
  const isOtherDescriptionEmpty =
    incidentInformation.complaintReceivedTo.otherDescription === "";

  if (isReceivedViaOther && isOtherDescriptionEmpty) {
    return false;
  }

  timeValidation(
    incidentInformation.incidentTypeAndTime.incidentStart,
    "incidentStart",
  );
  timeValidation(
    incidentInformation.incidentTypeAndTime.incidentEnd,
    "incidentEnd",
  );
  timeValidation(incidentInformation.submissionForm.time, "responseTime");
  timeValidation(
    incidentInformation.submissionForm.timeOfResponse,
    "responseTimeSubmit",
  );

  let isValidValueTime = [];
  isValidValueTime.push(
    timeValueValidation(incidentInformation.incidentTypeAndTime.incidentStart),
  );
  isValidValueTime.push(
    timeValueValidation(incidentInformation.incidentTypeAndTime.incidentEnd),
  );
  isValidValueTime.push(
    timeValueValidation(incidentInformation.submissionForm.time),
  );
  isValidValueTime.push(
    timeValueValidation(incidentInformation.submissionForm.timeOfResponse),
  );

  let _isValidTime = true;
  if (isValidValueTime.includes(false)) {
    _isValidTime = false;
  }

  let placeIncident = false;
  if (incidentInformation.placeOfIncident.isOther) {
    placeIncident = incidentInformation.placeOfIncident.other ? true : false;
  } else {
    placeIncident =
      incidentInformation.placeOfIncident.block !== "" &&
      incidentInformation.placeOfIncident.level !== "" &&
      incidentInformation.placeOfIncident.unit !== ""
        ? true
        : false;
  }

  return (
    _isValidTime &&
    placeIncident &&
    incidentInformation.siteInfo.designation !== "" &&
    incidentInformation.incidentTypeAndTime.typeOfIncident !== "" &&
    incidentInformation.incidentTypeAndTime.incidentStart !== "" &&
    incidentInformation.incidentTypeAndTime.incidentEnd !== "" &&
    incidentInformation.submissionForm.time !== "" &&
    incidentInformation.submissionForm.timeOfResponse !== "" &&
    incidentInformation.submissionForm.dateOfReport !== "" &&
    incidentInformation.recipientOfComplaint.contact !== "" &&
    incidentInformation.recipientOfComplaint.recipient !== "" &&
    complaintReceivedTo.receivedVia !== "" &&
    complaintReceivedTo.briefDescription !== ""
  );
});

const isStep2Valid = computed(() => {
  let affectedEntities = false;

  if (incident.value.affectedEntities.anyUnitAffectedValue !== "") {
    if (incident.value.affectedEntities.anyUnitAffectedValue != "no") {
      if (incident.value.affectedEntities.affectedUnit.isOther) {
        affectedEntities = incident.value.affectedEntities.affectedUnit.other
          ? true
          : false;
      } else {
        affectedEntities =
          incident.value.affectedEntities.affectedUnit.block &&
          incident.value.affectedEntities.affectedUnit.level &&
          incident.value.affectedEntities.affectedUnit.unit &&
          incident.value.affectedEntities.affectedUnit.description &&
          incident.value.affectedEntities.affectedUnit.resident
            ? true
            : false;
      }
    } else {
      affectedEntities = true;
    }
  }

  let anyDamageProperty = false;

  if (incident.value.affectedEntities.anyPropertyAffectedValue !== "") {
    if (incident.value.affectedEntities.anyPropertyAffectedValue != "no") {
      anyDamageProperty =
        incident.value.affectedEntities.anyoneDamageToProperty.length > 0
          ? true
          : false;
    } else {
      anyDamageProperty = true;
    }
  }

  return (
    affectedEntities &&
    anyDamageProperty &&
    incident.value.affectedEntities.anyUnitAffectedValue !== "" &&
    incident.value.affectedEntities.anyoneAffectedValue !== "" &&
    incident.value.affectedEntities.anyoneDamageToProperty !== ""
  );
});

const isStep3Valid = computed(() => {
  const authorities = incident.value.authorities;

  const isValidValueTime = [
    timeValueValidation(authorities.managementNotified.time),
    timeValueValidation(authorities.whenIncidentResolve.time),
    timeValueValidation(authorities.nameOfShiftIncharge.shiftStart),
    timeValueValidation(authorities.nameOfShiftIncharge.shiftEnd),
  ];

  const _isValidTime = !isValidValueTime.includes(false);

  return (
    authorities.authoritiesValue !== "" &&
    authorities.incidentThereAfter.actionTaken !== "" &&
    authorities.managementNotified.actionTaken !== "" &&
    authorities.managementNotified.time !== "" &&
    authorities.incidentResolved.actionTaken !== "" &&
    authorities.causeOfIncident.actionTaken !== "" &&
    authorities.systemUsed.actionTaken !== "" &&
    authorities.cctvRecord.actionTaken !== "" &&
    authorities.particularsOwner.actionTaken !== "" &&
    authorities.whenIncidentResolve.actionTaken !== "" &&
    authorities.whenIncidentResolve.time !== "" &&
    authorities.nameOfShiftIncharge.actionTaken !== "" &&
    authorities.nameOfShiftIncharge.shiftStart !== "" &&
    authorities.nameOfShiftIncharge.shiftEnd !== "" &&
    authorities.securityImplication.actionTaken !== "" &&
    _isValidTime
  );
});

function nextStep2() {
  const { incidentInformation } = incident.value;

  timeValidation(
    incidentInformation.incidentTypeAndTime.incidentStart,
    "incidentStart",
  );
  timeValidation(
    incidentInformation.incidentTypeAndTime.incidentEnd,
    "incidentEnd",
  );
  timeValidation(incidentInformation.submissionForm.time, "responseTime");
  timeValidation(
    incidentInformation.submissionForm.timeOfResponse,
    "responseTimeSubmit",
  );

  let isValidValueTime = [];
  isValidValueTime.push(
    timeValueValidation(incidentInformation.incidentTypeAndTime.incidentStart),
  );
  isValidValueTime.push(
    timeValueValidation(incidentInformation.incidentTypeAndTime.incidentEnd),
  );
  isValidValueTime.push(
    timeValueValidation(incidentInformation.submissionForm.time),
  );
  isValidValueTime.push(
    timeValueValidation(incidentInformation.submissionForm.timeOfResponse),
  );

  let _isValidTime = true;
  if (isValidValueTime.includes(false)) {
    setSnackbar({
      text: "Invalid time, please select hours and minutes",
      modal: true,
      type: "warning",
    });
    _isValidTime = false;
  }

  if (isStep1Valid.value && _isValidTime) {
    form.value.resetValidation();
    step.value++;
  } else {
    console.log("Cannot go to step 2");
    form.value.validate();
  }
}

function nextStep3() {
  // submit();
  let affectedEntities = false;

  if (incident.value.affectedEntities.anyUnitAffectedValue !== "") {
    if (incident.value.affectedEntities.anyUnitAffectedValue != "no") {
      if (incident.value.affectedEntities.affectedUnit.isOther) {
        affectedEntities = incident.value.affectedEntities.affectedUnit.other
          ? true
          : false;
      } else {
        affectedEntities =
          incident.value.affectedEntities.affectedUnit.block &&
          incident.value.affectedEntities.affectedUnit.level &&
          incident.value.affectedEntities.affectedUnit.unit &&
          incident.value.affectedEntities.affectedUnit.description &&
          incident.value.affectedEntities.affectedUnit.resident
            ? true
            : false;
      }
    } else {
      affectedEntities = true;
    }
  }

  let anyDamageProperty = false;

  if (incident.value.affectedEntities.anyPropertyAffectedValue !== "") {
    if (incident.value.affectedEntities.anyPropertyAffectedValue != "no") {
      anyDamageProperty =
        incident.value.affectedEntities.anyoneDamageToProperty.length > 0
          ? true
          : false;
    } else {
      anyDamageProperty = true;
    }
  }

  if (
    affectedEntities &&
    anyDamageProperty &&
    incident.value.affectedEntities.anyUnitAffectedValue !== "" &&
    incident.value.affectedEntities.anyoneAffectedValue !== "" &&
    incident.value.affectedEntities.anyoneDamageToProperty !== ""
  ) {
    form.value.resetValidation();
    step.value++;
  } else {
    // step.value++;
    form.value.validate();
    console.log("Cannot go to step 3");
  }
}

async function nextStep4() {
  isLoading.value = true;

  timeValidation(
    incident.value.authorities.managementNotified.time,
    "managementNotifiedTime",
  );
  timeValidation(
    incident.value.authorities.whenIncidentResolve.time,
    "whenIncidentResolveTime",
  );
  timeValidation(
    incident.value.authorities.nameOfShiftIncharge.shiftStart,
    "shiftStart",
  );
  timeValidation(
    incident.value.authorities.nameOfShiftIncharge.shiftEnd,
    "shiftEnd",
  );

  if (isStep3Valid.value) {
    form.value.resetValidation();
    incident.value.incidentInformation.siteInfo.site = siteId.value;
    incident.value.organization = currentUser.value.organization;
    incident.value.site = mySite.value;
    step.value++;

    isSummary.value = true;

    try {
      const summary = await getGenerateSummary(incident.value);
      incident.value.briefSummary = summary;
      isSummary.value = false;
    } catch (error: any) {
      isSummary.value = false;
    }
  } else {
    isLoading.value = false;
    form.value.validate();
    console.log("Cannot go to step 4");
  }

  isLoading.value = false;
}

function prevStep() {
  step.value--;
}

function goBack() {
  useRouter().back();
}

type TFile = {
  name: string;
  data: File;
  progress: number;
  id?: string;
};

const uploadedAttachments = ref<TFile[]>([]);

async function confirmSign(user?: TUser) {
  if (user && typeof user === "object") {
    try {
      isSubmitting.value = true;
      incident.value.incidentInformation.siteInfo.site = siteId.value;
      currentUser.value._id;
      if (isUnitAffectedHasNoValue.value) {
        incident.value.affectedEntities.affectedUnit = {};
      }
      if (isAnyoneAffectedHasNoValue.value) {
        incident.value.affectedEntities.affectedInjured = [];
      }
      if (isPropertyAffectedHasNoValue.value) {
        incident.value.affectedEntities.anyoneDamageToProperty = [];
      }
      if (isAuthorityArrived.value) {
        incident.value.authorities.authoritiesCalled = [];
      }
      incident.value.organization = currentUser.value.organization;
      incident.value.site = mySite.value;

      if (uploadedAttachments.value && uploadedAttachments.value.length > 0) {
        // when updating and adding new photos + old photos
        const ids = uploadedAttachments.value.map((item) => {
          return { name: item.name, id: item.id };
        }) as IPhotos[];
        incident.value.photos = [...ids, ...incident.value.photos!];
      }

      await Promise.all([updateIncident(incident.value), deleteAttachment()]);

      router.replace({ name: "incidents", query: { site: mySite.value } });
      setSnackbar({
        text: "Successful updated incident report",
        modal: true,
        type: "success",
      });
      setIncident();
    } catch (error: any) {
      setSnackbar({
        text: error || error.message || "Error",
        modal: true,
        type: "error",
      });
    } finally {
      isSubmitting.value = false;
      isConfirmModal.value = false;
    }
  }
}

async function submit() {
  if (step.value === 3 && incident.value.briefSummary !== "") {
    isConfirmModal.value = true;
  }
}

const getDataIncident = (data: any) => {
  incident.value = data;
};

const deleteAttachment = async () => {
  if (photoId.value) {
    const { error, data } = await useLocalFetch(`/api/files/${photoId.value}`, {
      method: "DELETE",
    });
  }
};
</script>

<style>
.vue__time-picker-input {
  width: 100% !important;
  border-radius: 5px !important;
  height: 40px !important;
  padding-left: 20px !important;
}
</style>
<style scoped>
.stepper-height {
  min-height: 80px;
}
.h-container {
  background-color: #fff;
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
</style>
