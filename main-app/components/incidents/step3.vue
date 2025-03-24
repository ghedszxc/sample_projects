<template>
  <div v-if="incident" class="pa-8">
    <div class="w-100">
      <div class="font-weight-bold">
        Authorities (Police/SCDF/Ambulance called in at the scene)?
      </div>

      <v-radio-group
        :rules="[requiredInput]"
        v-model="incident.authorities.authoritiesValue"
      >
        <v-row class="mx-4 my-4">
          <v-radio-group v-model="incident.authorities.authoritiesValue">
            <v-row>
              <v-col cols="12" md="6">
                <v-radio
                  label="Yes, details appended herein"
                  value="yes"
                ></v-radio>
              </v-col>
              <v-col cols="12" md="6">
                <v-radio label="No" value="no"></v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
        </v-row>
      </v-radio-group>

      <v-row v-if="incident.authorities.authoritiesValue === 'yes'">
        <v-col class="pa-5 pt-0" cols="12">
          <v-select
            v-model="authoritiesCalled.description"
            hide-details="auto"
            :items="['Police', 'SCDF', 'CNB', 'NEA', 'HSA']"
            label="Description"
            :disabled="isAuthorityArrived"
            :hint="isAuthorityArrived ? 'This is required.' : ''"
          ></v-select>
        </v-col>

        <v-col class="pa-5" cols="12" md="4">
          <v-text-field
            v-model="authoritiesCalled.vehicleNumber"
            hide-details="auto"
            label="Vehicle Number"
            :disabled="isAuthorityArrived"
            :hint="isAuthorityArrived ? 'This is required.' : ''"
          ></v-text-field
        ></v-col>
        <v-col class="pa-5" cols="12" md="4">
          <v-text-field
            v-model="authoritiesCalled.personInCharge"
            hide-details="auto"
            label="Person in Charge"
            :disabled="isAuthorityArrived"
            :hint="isAuthorityArrived ? 'This is required.' : ''"
          ></v-text-field>
        </v-col>
        <v-col class="pa-5" cols="12" md="4">
          <v-text-field
            v-model="authoritiesCalled.caseReportReferenceNumber"
            hide-details="auto"
            label="Case report reference number"
            :disabled="isAuthorityArrived"
            :hint="isAuthorityArrived ? 'This is required.' : ''"
          ></v-text-field
        ></v-col>
        <v-col
          cols="12"
          md="2"
          class="pa-2 pa-md-0 d-flex justify-center ml-md-5"
        >
          <v-btn
            class="bg-blue-darken-4 w-100"
            :disabled="incident.authorities.authoritiesValue === 'no'"
            @click="addAuthoritiesArrived()"
            ><v-icon class="mr-2">mdi-table</v-icon>Add</v-btn
          ></v-col
        >
        <!-- <v-col class="pa-5 d-flex justify-center" cols="12" md="12">
          <v-btn
            class="bg-blue-darken-4"
            @click="a"
            :disabled="incident.authorities.authoritiesValue === 'no'"
          >
            Add
          </v-btn></v-col
        > -->
      </v-row>

      <div class="my-5 mx-5">
        <v-row
          class="d-none d-md-flex"
          :style="
            $vuetify.theme.current.dark
              ? 'background-color: #495057'
              : 'background-color: #f5f5f5'
          "
        >
          <v-col class="border pa-3 font-weight-medium">
            <div>Description</div>
          </v-col>
          <v-col class="border pa-3 font-weight-medium">
            <div>Vehicle Number</div>
          </v-col>
          <v-col class="border pa-3 font-weight-medium">
            <div>Person in Charge</div>
          </v-col>
          <v-col class="border pa-3 font-weight-medium">
            <div>Case Report Reference Number</div>
          </v-col>
        </v-row>

        <v-row
          v-if="incident.authorities.authoritiesCalled.length > 0"
          v-for="(authority, index) in incident.authorities.authoritiesCalled"
          :key="index"
          class="border"
        >
          <v-col class="border pa-3" cols="12" md="3">
            <div class="font-weight-bold d-md-none">Description</div>
            <div>{{ authority.description }}</div>
          </v-col>
          <v-col class="border pa-3" cols="12" md="3">
            <div class="font-weight-bold d-md-none">Vehicle Number</div>
            <div>{{ authority.vehicleNumber }}</div>
          </v-col>
          <v-col class="border pa-3" cols="12" md="3">
            <div class="font-weight-bold d-md-none">Person in Charge</div>
            <div>{{ authority.personInCharge }}</div>
          </v-col>
          <v-col class="border pa-3" cols="12" md="3">
            <div class="font-weight-bold d-md-none">
              Case Report Reference Number
            </div>
            <div>{{ authority.caseReportReferenceNumber }}</div>
          </v-col>
        </v-row>

        <v-row v-else class="d-flex justify-center border pa-3">
          <v-col class="pa-3" cols="12">
            <div class="text-center">No authorities listed.</div>
          </v-col>
        </v-row>
      </div>
    </div>

    <div class="w-100">
      <div class="font-weight-bold">
        What was done to address the incident thereafter?
      </div>
      <v-row class="pa-2">
        <v-col cols="12">
          <v-text-field
            v-model="incident.authorities.incidentThereAfter.actionTaken"
            hide-details="auto"
            label="Action Taken"
            :rules="[requiredInput]"
          ></v-text-field>

          <!-- <VTimePicker
                      id="incidentThereAfter"
                      v-model="
                        incident.authorities.incidentThereAfter.time
                      "
                      style="width:250px !important"
                      :rules="[requiredInput]"
                      close-on-complete
                      placeholder="Time"
                    >
                      
                    </VTimePicker> -->
        </v-col>
      </v-row>
    </div>

    <div class="w-100">
      <div class="font-weight-bold">
        Were the management notified and who was notified?
      </div>
      <v-row class="pa-2">
        <v-col cols="12" md="8">
          <v-text-field
            v-model="incident.authorities.managementNotified.actionTaken"
            hide-details="auto"
            label="Action Taken"
            :rules="[requiredInput]"
          ></v-text-field>
          <!-- <v-text-field
                      v-model="incident.authorities.managementNotified.status"
                      hide-details="auto"
                      label="Status"
                      :rules="[requiredInput]"
                    ></v-text-field> -->
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="incident.authorities.managementNotified.time"
            :active="menuManagementNotified"
            :focus="menuManagementNotified"
            label="Management Notified Time (HH:mm)"
            append-inner-icon="mdi-clock-time-four-outline"
            :rules="[timeFormatRule]"
            @keypress="validateMilitaryTime"
            class="w-100"
            @click="() => (menuManagementNotified = true)"
          >
            <v-menu
              v-model="menuManagementNotified"
              :close-on-content-click="false"
              activator="parent"
              transition="scale-transition"
            >
              <v-time-picker
                v-if="menuManagementNotified"
                v-model="incident.authorities.managementNotified.time"
                :rules="[requiredInput]"
                full-width
                format="24h"
                close-on-complete
              ></v-time-picker>
            </v-menu>
          </v-text-field>
        </v-col>
      </v-row>
    </div>

    <div class="w-100">
      <div class="font-weight-bold">How the incident resolved?</div>
      <v-row class="pa-2">
        <v-col cols="12">
          <v-text-field
            v-model="incident.authorities.incidentResolved.actionTaken"
            hide-details="auto"
            label="Action Taken"
            :rules="[requiredInput]"
          ></v-text-field> </v-col
      ></v-row>
    </div>

    <div class="w-100">
      <div class="font-weight-bold">What was the cause of the incident?</div>
      <v-row class="pa-2">
        <v-col cols="12">
          <v-text-field
            v-model="incident.authorities.causeOfIncident.actionTaken"
            hide-details="auto"
            label="Action Taken"
            :rules="[requiredInput]"
          ></v-text-field>
          <!-- <v-text-field
                      v-model="incident.authorities.causeOfIncident.status"
                      hide-details="auto"
                      label="Status"
                      :rules="[requiredInput]"
                    ></v-text-field>
                    
                    <VTimePicker
                      id="causeOfIncidentTime"
                      v-model="
                        incident.authorities.causeOfIncident.time
                      "
                      style="width:250px !important"
                      :rules="[requiredInput]"
                      close-on-complete
                      placeholder="Time"
                    >
                    </VTimePicker> -->
        </v-col>
      </v-row>
    </div>

    <div class="w-100">
      <div class="font-weight-bold">Any system used to verify incident?</div>

      <v-row class="pa-2">
        <v-col cols="12">
          <v-text-field
            v-model="incident.authorities.systemUsed.actionTaken"
            hide-details="auto"
            label="Action Taken"
            :rules="[requiredInput]"
          ></v-text-field>
          <!-- <v-text-field
                      v-model="incident.authorities.systemUsed.status"
                      hide-details="auto"
                      label="Status"
                      :rules="[requiredInput]"
                    ></v-text-field>
                
                    <VTimePicker
                      id="systemUsedTime"
                      v-model="
                        incident.authorities.systemUsed.time
                      "
                      style="width:250px !important"
                      :rules="[requiredInput]"
                      close-on-complete
                      placeholder="Time"
                    >
                    </VTimePicker> -->
        </v-col>
      </v-row>
    </div>

    <div class="w-100">
      <div class="font-weight-bold">Any cctv records or picture taken</div>

      <v-row class="pa-2">
        <v-col cols="12">
          <v-text-field
            v-model="incident.authorities.cctvRecord.actionTaken"
            hide-details="auto"
            label="Action Taken"
            :rules="[requiredInput]"
          ></v-text-field>
          <!-- <v-text-field
                      v-model="incident.authorities.cctvRecord.status"
                      hide-details="auto"
                      label="Status"
                      :rules="[requiredInput]"
                    ></v-text-field>
                    <VTimePicker
                      id="cctvRecordTime"
                      v-model="incident.authorities.cctvRecord.time"
                      style="width:250px !important"
                      :rules="[requiredInput]"
                      close-on-complete
                      placeholder="Time"
                    >
                    </VTimePicker> -->
        </v-col>
      </v-row>
    </div>

    <div class="w-100">
      <div class="font-weight-bold">Particulars of tenant/Owner (if any)</div>

      <v-row class="pa-2">
        <v-col cols="12">
          <v-text-field
            v-model="incident.authorities.particularsOwner.actionTaken"
            hide-details="auto"
            label="Action Taken"
            :rules="[requiredInput]"
          ></v-text-field>
          <!-- <v-text-field
                      v-model="incident.authorities.particularsOwner.status"
                      hide-details="auto"
                      label="Status"
                      :rules="[requiredInput]"
                    ></v-text-field>
                    <VTimePicker
                      id="particularsOwnerTime"
                      v-model="incident.authorities.particularsOwner.time"
                      style="width:250px !important"
                      :rules="[requiredInput]"
                      close-on-complete
                      placeholder="Time"
                    >
                    </VTimePicker> -->
        </v-col>
      </v-row>
    </div>

    <div class="w-100">
      <div class="font-weight-bold">When was the incident resolved?</div>

      <v-row class="pa-2">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="incident.authorities.whenIncidentResolve.actionTaken"
            hide-details="auto"
            label="Action Taken"
            :rules="[requiredInput]"
          ></v-text-field>
        </v-col>
        <!-- <v-text-field
                      v-model="incident.authorities.whenIncidentResolve.status"
                      hide-details="auto"
                      label="Status"
                      :rules="[requiredInput]"
                    ></v-text-field> -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="incident.authorities.whenIncidentResolve.time"
            :active="menuIncidentResolveTime"
            :focus="menuIncidentResolveTime"
            label="Incident Resolve Time (HH:mm)"
            append-inner-icon="mdi-clock-time-four-outline"
            :rules="[timeFormatRule]"
            @keypress="validateMilitaryTime"
            class="w-100"
            @click="() => (menuIncidentResolveTime = true)"
          >
            <v-menu
              v-model="menuIncidentResolveTime"
              :close-on-content-click="false"
              activator="parent"
              transition="scale-transition"
            >
              <v-time-picker
                v-if="menuIncidentResolveTime"
                v-model="incident.authorities.whenIncidentResolve.time"
                :rules="[requiredInput]"
                full-width
                format="24h"
                close-on-complete
              ></v-time-picker>
            </v-menu>
          </v-text-field>
        </v-col>
      </v-row>
    </div>

    <div class="w-100">
      <div class="font-weight-bold">Name of shift in charge?</div>

      <v-row class="pa-2">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="incident.authorities.nameOfShiftIncharge.personInCharge"
            hide-details="auto"
            label="Person in Charge"
            :rules="[requiredInput]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="incident.authorities.nameOfShiftIncharge.actionTaken"
            hide-details="auto"
            label="Action Taken"
            :rules="[requiredInput]"
          ></v-text-field>
        </v-col>
        <!-- <v-text-field
                        v-model="incident.authorities.nameOfShiftIncharge.status"
                        hide-details="auto"
                        label="Status"
                        :rules="[requiredInput]"
                        class="w-33"
                      ></v-text-field> -->
      </v-row>

      <v-row class="pa-2 pt-0">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="incident.authorities.nameOfShiftIncharge.shiftStart"
            :active="menuShiftStart"
            :focus="menuShiftStart"
            label="Shift Start (HH:mm)"
            append-inner-icon="mdi-clock-time-four-outline"
            :rules="[timeFormatRule]"
            @keypress="validateMilitaryTime"
            class="w-100"
            @click="() => (menuShiftStart = true)"
          >
            <v-menu
              v-model="menuShiftStart"
              :close-on-content-click="false"
              activator="parent"
              transition="scale-transition"
            >
              <v-time-picker
                v-if="menuShiftStart"
                v-model="incident.authorities.nameOfShiftIncharge.shiftStart"
                :rules="[requiredInput]"
                full-width
                format="24h"
                close-on-complete
              ></v-time-picker>
            </v-menu>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="incident.authorities.nameOfShiftIncharge.shiftEnd"
            :active="menuShiftEnd"
            :focus="menuShiftEnd"
            label="Shift Ends (HH:mm)"
            append-inner-icon="mdi-clock-time-four-outline"
            :rules="[timeFormatRule]"
            @keypress="validateMilitaryTime"
            class="w-100"
            @click="() => (menuShiftEnd = true)"
          >
            <v-menu
              v-model="menuShiftEnd"
              :close-on-content-click="false"
              activator="parent"
              transition="scale-transition"
            >
              <v-time-picker
                v-if="menuShiftEnd"
                v-model="incident.authorities.nameOfShiftIncharge.shiftEnd"
                :rules="[requiredInput]"
                full-width
                format="24h"
                close-on-complete
              ></v-time-picker>
            </v-menu>
          </v-text-field>
        </v-col>
        <!-- 
                      <VTimePicker
                        id="nameOfShiftInchargeTime"
                        v-model="incident.authorities.nameOfShiftIncharge.time"
                        :rules="[requiredInput]"
                        close-on-complete
                        placeholder="Time"
                        class="w-33"
                      >
                      </VTimePicker> -->
      </v-row>
    </div>

    <div class="w-100">
      <div class="font-weight-bold">
        Any security implication due to the incident?
      </div>

      <v-row class="pa-2">
        <v-col cols="12">
          <v-text-field
            v-model="incident.authorities.securityImplication.actionTaken"
            hide-details="auto"
            label="Action Taken"
            :rules="[requiredInput]"
          ></v-text-field>
          <!-- <v-text-field
                      v-model="incident.authorities.securityImplication.status"
                      hide-details="auto"
                      label="Status"
                      :rules="[requiredInput]"
                    ></v-text-field> -->

          <!-- <VTimePicker
                      id="securityImplicationTime"
                      v-model="incident.authorities.securityImplication.time"
                      :rules="[requiredInput]"
                      style="width:250px"
                      close-on-complete
                      placeholder="Time"
                      drop-direction="up"
                    >
                    </VTimePicker> -->
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  IAffectedInjured,
  IAnyoneDamageToProperty,
  IAuthoritiesCalled,
} from "~/types/incident";

const { requiredInput, timeFormatRule, validateMilitaryTime } = useUtils();
const { currentUser } = useLocalAuth();

const menuManagementNotified = ref(false);
const menuIncidentResolveTime = ref(false);
const menuShiftStart = ref(false);
const menuShiftEnd = ref(false);

const props = defineProps({
  incident: {
    type: Object,
  },
});

const authoritiesCalled = ref({
  caseReportReferenceNumber: "",
  description: "",
  personInCharge: "",
  vehicleNumber: "",
} as IAuthoritiesCalled);

const isAuthorityArrived = computed(() => {
  return (
    !props.incident.authorities.authoritiesValue ||
    props.incident.authorities.authoritiesValue === "no"
  );
});

const addAuthoritiesArrived = () => {
  if (
    authoritiesCalled.value.caseReportReferenceNumber &&
    authoritiesCalled.value.description &&
    authoritiesCalled.value.personInCharge &&
    authoritiesCalled.value.vehicleNumber
  ) {
    props.incident.authorities.authoritiesCalled.push(authoritiesCalled.value);
    authoritiesCalled.value = {};
  }
};
</script>
