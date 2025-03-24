<template>
  <v-dialog max-width="1300" v-model="isDialogVisible" persistent>
    <v-card class="rounded-xl">
      <v-toolbar>
        <v-toolbar-title> Create Incident Report </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="hideModal"></v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text>
        <v-row no-gutters justify="center" style="max-height: 700px">
          <v-col cols="12" class="font-weight-light mt-4">
            <v-form
              v-model="isIncidentValid"
              @submit.prevent="submit()"
              ref="form"
            >
              <v-row no-gutters class="pa-0" justify="center">
                <v-stepper
                  v-model:model-value="step"
                  class="w-100 px-0 px-md-16"
                  style="box-shadow: none !important"
                >
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

                  <template v-if="step == 0">
                    <IncidentsStep1
                      :incident="incident"
                      :blocks="blocks"
                      :blockLevels="blockLevels"
                      :units="units"
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
                        ><v-icon class="mr-1"> mdi-arrow-left </v-icon
                        >Prev</v-btn
                      >
                    </div>

                    <div>
                      <v-btn v-if="step == 0" @click="nextStep2"
                        >Go to Step 2</v-btn
                      >
                      <v-btn v-if="step == 1" @click="nextStep3"
                        >Go to Step 3</v-btn
                      >
                      <v-btn v-if="step == 2" @click="nextStep4"
                        >Go to Step 4</v-btn
                      >

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
                    </div>
                  </v-row>
                </v-stepper>
              </v-row>
            </v-form>
          </v-col>
          <DobEntryConfirmPassword
            @sign-dob="confirmSign($event)"
            is-confirm-title="Confirm Password to Submit the Incident Report"
          />
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const { getSiteById } = useSite();
const { timeValidation, timeValueValidation } = useUtils();

const {
  incident,
  addIncident,
  dateSelected,
  setIncidents,
  setIncident,
  isIncidentValid,
  getGenerateSummary,
  getIncrementedReportId,

  isSummary,
} = useIncident();

const { getAllBuildingBlocks, blocks } = useBlock();
const { getAllLevel, blockLevels } = useBlockLevel();
const { getAllUnits, units } = useBlockLevelUnit();
const { isConfirmModal } = useOccurrenceEntry();
const isSubmitting = ref(false);
const siteId = ref("");
const isLoading = ref(false);
const form = ref(null);
const siteName = ref("");
const { getSitesOptionsForFiltering, mySite } = useFilter();

type TFile = {
  name: string;
  data: File;
  progress: number;
  id?: string;
};
const uploadedAttachments = ref<TFile[]>([]);

const emit = defineEmits(["signDob", "closeModal", "createIncident"]);
const step = ref(0);

let props = defineProps({
  isConfirmTitle: {
    type: String,
  },
  isConfirmModal: {
    type: Boolean,
    default: false,
  },
});

onMounted(async () => {
  isLoading.value = true;
  await getSitesOptionsForFiltering();
  const [referenceNumber] = await Promise.all([
    getIncrementedReportId({
      site: mySite.value,
    }),
    getAllBuildingBlocks({
      site: mySite.value,
    }),
  ]);

  const site = await getSiteById(String(mySite.value));
  siteName.value = (site && site.name) || "No Site";

  siteId.value = (site && site._id) || "";
  incident.value.incidentInformation.siteInfo.irNumber = referenceNumber;
  isLoading.value = false;
});

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

const isDialogVisible = computed(() => props.isConfirmModal);

const hideModal = () => {
  emit("closeModal", false);
};

const getDataIncident = (data: any) => {
  incident.value = data;
};

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

  return (
    _isValidTime &&
    incidentInformation.siteInfo.designation !== "" &&
    incidentInformation.placeOfIncident.block !== "" &&
    incidentInformation.placeOfIncident.level !== "" &&
    incidentInformation.placeOfIncident.unit !== "" &&
    incidentInformation.incidentTypeAndTime.typeOfIncident !== "" &&
    incidentInformation.incidentTypeAndTime.incidentStart !== "" &&
    incidentInformation.incidentTypeAndTime.incidentEnd !== "" &&
    incidentInformation.submissionForm.time !== "" &&
    incidentInformation.submissionForm.timeOfResponse !== "" &&
    incidentInformation.submissionForm.dateOfReport !== "" &&
    incidentInformation.recipientOfComplaint.contact !== "" &&
    incidentInformation.recipientOfComplaint.nric !== "" &&
    incidentInformation.recipientOfComplaint.recipient !== "" &&
    complaintReceivedTo.receivedVia !== "" &&
    complaintReceivedTo.briefDescription !== ""
  );
});

const isStep2Valid = computed(() => {
  let affectedEntities = false;

  if (incident.value.affectedEntities.anyUnitAffectedValue !== "") {
    if (incident.value.affectedEntities.anyUnitAffectedValue != "no") {
      affectedEntities =
        incident.value.affectedEntities.affectedUnit.block &&
        incident.value.affectedEntities.affectedUnit.level &&
        incident.value.affectedEntities.affectedUnit.unit &&
        incident.value.affectedEntities.affectedUnit.description &&
        incident.value.affectedEntities.affectedUnit.resident
          ? true
          : false;
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

async function submit() {
  if (step.value == 3 && incident.value.briefSummary !== "") {
    isConfirmModal.value = true;
  }
}

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
  if (
    step.value === 1 &&
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

    try {
      isSummary.value = true;
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

async function confirmSign(user?: TUser) {
  if (user && typeof user === "object") {
    // incident.value.incidentInformation.siteInfo.submittedBy = user._id;
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
      incident.value.status = "pending";
      incident.value.organization = currentUser.value.organization;
      incident.value.site = mySite.value;
      const ids = uploadedAttachments.value.map((item) => {
        return { name: item.name, id: item.id };
      });
      incident.value.photos = ids;

      // add here
      let data = await addIncident(incident.value);
      emit("createIncident", data);
      setSnackbar({
        text: "Successful created incident report",
        modal: true,
        type: "success",
      });
    } catch (error: any) {
      setSnackbar({
        text: error || error.message || "Error",
        modal: true,
        type: "error",
      });
    } finally {
      // to reset
      setIncident();
      isSubmitting.value = false;
      isConfirmModal.value = false;
      hideModal();
    }
  }
}
</script>
