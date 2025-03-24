<template>
  <v-dialog
    v-model="addIncidentDialog"
    transition="dialog-right-transition"
    fullscreen
    persistent
    :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
  >
    <v-card
      :loading="isProgress"
      :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
      :class="`${theme == 'light' && 'bg-white'} px-3 h-100 ${$vuetify.display.mdAndUp && 'rounded-s-xl'}`"
    >
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="orange"
          height="8"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
        <span class="font-weight-bold pl-4 pt-1 text-capitalize"
          >Create Incident Report</span
        >
        <v-spacer></v-spacer>
        <v-btn
          size="x-small"
          color="grey-darken-1"
          icon="mdi-close"
          @click="onCloseDialog()"
        ></v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text>
        <v-form v-model="isIncidentValid" @submit.prevent="submit()" ref="form">
          <v-row no-gutters justify="center">
            <v-stepper
              v-model:model-value="step"
              flat
              :items="[
                'Incident Information',
                'Affected Entities',
                'Authorities',
                'Brief Summary',
              ]"
            >
              <template v-slot:item.1>
                <IncidentsStep1
                  :incident="incident"
                  :blocks="blocks"
                  :blockLevels="blockLevels"
                  :units="units"
                  @update-data="getDataIncident($event)"
                />
              </template>

              <template v-slot:item.2>
                <IncidentsStep2 :incident="incident" />
              </template>

              <template v-slot:item.3>
                <IncidentsStep3 :incident="incident" />
              </template>

              <template v-slot:item.4>
                <IncidentsStep4
                  :incident="incident"
                  :uploadedAttachments="uploadedAttachments"
                />
              </template>

              <template v-slot:next>
                <v-btn v-if="step === 1" @click="nextStep2">Go to Step 2</v-btn>
                <v-btn v-if="step === 2" @click="nextStep3">Go to Step 3</v-btn>
                <v-btn v-if="step === 3" @click="nextStep4">Go to Step 4</v-btn>
              </template>
              <template v-slot:prev>
                <v-btn @click="prevStep">Prev</v-btn>
                <v-btn
                  v-if="step === 4"
                  type="submit"
                  color="primary"
                  variant="flat"
                  :loading="isSubmitting"
                  @click="submit()"
                >
                  submit
                </v-btn>
              </template>
            </v-stepper>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <span :class="`${$vuetify.display.mdAndUp && 'pl-4'} text-caption`">
          @ 2024 by Seven 365 Pte Ltd V1.0
        </span>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <DobEntryConfirmPassword
    @sign-dob="confirmSign($event)"
    is-confirm-title="Confirm Password to Submit the Incident Report"
  />
</template>

<script setup lang="ts">
import type { IPhotos } from "~/types/incident";

const isProgress = ref(false);
const { addIncidentDialog } = useVirtualPatrol();

const { theme } = useLocal();
const { isConfirmModal } = useOccurrenceEntry();
const { currentUser } = useLocalAuth();
const { requiredInput, timeValidation, timeValueValidation } = useUtils();
const { getAllBuildingBlocks, blocks } = useBlock();
const { blockLevels } = useBlockLevel();
const { units } = useBlockLevelUnit();
const { getSiteById } = useSite();
const { setSnackbar } = useLocal();
const {
  incident,
  addIncident,
  setIncidents,
  setIncident,
  isIncidentValid,
  getIncrementedReportId,
} = useIncident();
const { getSitesOptionsForFiltering, mySite } = useFilter();

const isSubmitting = ref(false);
const isLoading = ref(false);
const siteId = ref("");

const form = ref(null);
const siteName = ref("");

watch(
  addIncidentDialog,
  (newValue: string) => {
    if (newValue) populateData();
  },
  { deep: true },
);

async function populateData() {
  isLoading.value = true;
  await getSitesOptionsForFiltering();
  const [referenceNumber, site] = await Promise.all([
    getIncrementedReportId({
      site: mySite.value,
    }),
    getSiteById(mySite.value || ""),
    getAllBuildingBlocks({
      site: mySite.value,
    }),
    setIncidents({
      site: mySite.value,
    }),
  ]);
  siteName.value = (site && site.name) || "No Site";
  siteId.value = (site && site._id) || "";
  incident.value.incidentInformation.siteInfo.irNumber = referenceNumber;
  isLoading.value = false;
}

// stepper
const step = ref(1);

async function nextStep2() {
  const { incidentInformation } = incident.value;
  const complaintReceivedTo = incidentInformation.complaintReceivedTo;

  const isReceivedViaOther = complaintReceivedTo.receivedVia === "other";
  const isOtherDescriptionEmpty =
    incidentInformation.complaintReceivedTo.otherDescription === "";

  const isStep1Valid =
    step.value === 1 &&
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
    complaintReceivedTo.briefDescription !== "";

  if (isReceivedViaOther && isOtherDescriptionEmpty) {
    // otherDescription is required when receivedVia is "other"
    console.log("Other Description is required.");
    return form.value.validate();
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
    setSnackbar({
      text: "Invalid time, please select hours and minutes",
      modal: true,
      type: "warning",
    });
    _isValidTime = false;
  }

  if (isStep1Valid && _isValidTime) {
    form.value.resetValidation();
    step.value++;
  } else {
    console.log("Cannot go to step 2");
    form.value.validate();
  }
}

async function nextStep3() {
  if (
    step.value === 2 &&
    incident.value.affectedEntities.anyUnitAffectedValue !== "" &&
    incident.value.affectedEntities.anyoneAffectedValue !== "" &&
    incident.value.affectedEntities.anyoneDamageToProperty !== ""
  ) {
    form.value.resetValidation();
    step.value++;
  } else {
    form.value.validate();
    console.log("Cannot go to step 3");
  }
}

async function nextStep4() {
  // submit();
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
  let isValidValueTime = [];
  isValidValueTime.push(
    timeValueValidation(incident.value.authorities.managementNotified.time),
  );
  isValidValueTime.push(
    timeValueValidation(incident.value.authorities.whenIncidentResolve.time),
  );
  isValidValueTime.push(
    timeValueValidation(
      incident.value.authorities.nameOfShiftIncharge.shiftStart,
    ),
  );
  isValidValueTime.push(
    timeValueValidation(
      incident.value.authorities.nameOfShiftIncharge.shiftEnd,
    ),
  );

  let _isValidTime = true;
  if (isValidValueTime.includes(false)) {
    setSnackbar({
      text: "Invalid Time, Please select hours and minutes",
      modal: true,
      type: "warning",
    });
    _isValidTime = false;
  }
  if (
    step.value === 3 &&
    incident.value.authorities.authoritiesValue !== "" &&
    incident.value.authorities.incidentThereAfter.actionTaken !== "" &&
    incident.value.authorities.managementNotified.actionTaken !== "" &&
    incident.value.authorities.managementNotified.time !== "" &&
    incident.value.authorities.incidentResolved.actionTaken !== "" &&
    incident.value.authorities.causeOfIncident.actionTaken !== "" &&
    incident.value.authorities.systemUsed.actionTaken !== "" &&
    incident.value.authorities.cctvRecord.actionTaken !== "" &&
    incident.value.authorities.particularsOwner.actionTaken !== "" &&
    incident.value.authorities.whenIncidentResolve.actionTaken !== "" &&
    incident.value.authorities.whenIncidentResolve.time !== "" &&
    incident.value.authorities.nameOfShiftIncharge.actionTaken !== "" &&
    incident.value.authorities.nameOfShiftIncharge.shiftStart !== "" &&
    incident.value.authorities.nameOfShiftIncharge.shiftEnd !== "" &&
    incident.value.authorities.securityImplication.actionTaken !== "" &&
    _isValidTime
  ) {
    form.value.resetValidation();
    step.value++;
  } else {
    form.value.validate();
    console.log("Cannot go to step 4");
  }
}

async function prevStep() {
  step.value--;
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
    incident.value.incidentInformation.siteInfo.submittedBy = user._id;
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
      incident.value.site = currentUser.value.site;
      const ids = uploadedAttachments.value.map((item) => {
        return { name: item.name, id: item.id };
      }) as IPhotos[];
      incident.value.photos = ids;
      await addIncident(incident.value);

      onCloseDialog();
      setSnackbar({
        text: "Successful created incident report",
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
  if (step.value === 4 && incident.value.briefSummary !== "") {
    isConfirmModal.value = true;
  }
}

const getDataIncident = (data: any) => {
  incident.value = data;
};

async function onCloseDialog() {
  await setIncident();
  addIncidentDialog.value = false;
  step.value = 1;

  siteName.value = "";

  isSubmitting.value = false;
  isConfirmModal.value = false;
}
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
.dialog_desktop {
  margin: 0 0 0 auto;
  max-width: 800px;
  border-radius: 25px 0 0 25px;

  box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
}

:deep() .v-field__outline {
  --v-field-border-opacity: 0.1;
}

:deep() .v-overlay__scrim {
  opacity: var(--v-overlay-opacity, 0);
}

:deep() .v-text-field input {
  font-size: 13px !important;
}

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
