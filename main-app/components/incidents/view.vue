<template>
  <v-dialog max-width="1500" v-model="isDialogVisible" persistent>
    <v-card class="rounded-xl pa-2" min-height="700px">
      <v-toolbar color="white" class="rounded-xl">
        <v-toolbar-title>
          <span class="text-h6">
            Incidents Record of {{ incident.reportId }}
          </span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="hideModal"></v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text class="py-0 px-1">
        <v-row
          no-gutters
          justify="center"
          class="pa-8 overflow-auto"
          style="max-height: 850px"
        >
          <v-col cols="12">
            <v-card
              width="100%"
              height="100%"
              class="transparent-card"
              elevation="0"
            >
              <div class="px-10">
                <div class="align-start text-h5 py-5 font-weight-medium">
                  Incident Information
                </div>
                <div class="mb-5">
                  <div class="py-3">Site Information</div>
                  <v-row dense>
                    <v-col cols="12" md="3">
                      <div class="border pa-3">
                        <div class="font-small">Site</div>
                        <div>
                          {{ incident.incidentInformation.siteInfo.site.name }}
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div class="border pa-3">
                        <div class="font-small">Incident Reference Number</div>
                        <div>{{ incident.reportId }}</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div class="border pa-3">
                        <div class="font-small">Submitted by</div>
                        <div
                          v-if="
                            incident.incidentInformation.siteInfo.submittedBy
                          "
                        >
                          <v-avatar :color="materialColors[1]" class="mr-2">
                            {{
                              getInitial(
                                `${incident.incidentInformation.siteInfo.submittedBy || ""}`,
                              )
                            }}
                          </v-avatar>
                          {{
                            `${incident.incidentInformation.siteInfo.submittedBy || "N/A"}`
                          }}
                        </div>
                        <div v-else>---</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div class="border pa-3">
                        <div class="font-small">Designation</div>
                        <div>
                          {{
                            incident?.incidentInformation.siteInfo.designation
                          }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
                <div class="mb-5">
                  <div class="py-3">
                    <v-row>
                      <v-col cols="12" md="6">
                        <div class="font-small">Place Of Incident</div>
                      </v-col>
                      <v-col cols="12" md="6">
                        <div class="font-small">Type of Incident</div>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" md="6">
                        <div class="border pa-3">
                          <div class="font-small">Place of Incident</div>
                          <div>
                            {{
                              `${incident.incidentInformation.placeOfIncident.block?.name || ""} - 
                              Level ${incident.incidentInformation.placeOfIncident.level?.level || ""} - 
                              ${incident.incidentInformation.placeOfIncident.unit?.name || ""}`
                            }}
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12" md="6">
                        <div
                          class="border pa-3 d-flex flex-column justify-between"
                        >
                          <div>
                            <div class="font-small">Type of Incident</div>
                            <div>
                              {{
                                incident.incidentInformation.incidentTypeAndTime
                                  .typeOfIncident || ""
                              }}
                            </div>
                          </div>
                          <div>
                            <div class="font-small">Incident Start</div>
                            <div>
                              {{
                                incident.incidentInformation.incidentTypeAndTime
                                  .incidentStart || ""
                              }}h
                            </div>
                          </div>
                          <div>
                            <div class="font-small">Incident End</div>
                            <div>
                              {{
                                incident?.incidentInformation
                                  .incidentTypeAndTime.incidentEnd || ""
                              }}h
                            </div>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
                <div class="mb-5">
                  <div class="py-3">Response/Submission From (1st Contact)</div>
                  <v-row>
                    <v-col cols="12" md="4">
                      <div class="border pa-3">
                        <div class="font-small">
                          Time of response from (1st contact)
                        </div>
                        <div>
                          {{
                            incident.incidentInformation.submissionForm.time ||
                            ""
                          }}h
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="border pa-3">
                        <div class="font-small">
                          Time of Response Report Submission
                        </div>
                        <div>
                          {{
                            incident?.incidentInformation.submissionForm
                              .timeOfResponse || ""
                          }}h
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="border pa-3">
                        <div class="font-small">Date of Report Submission</div>
                        <div>
                          {{
                            incident.incidentInformation.submissionForm
                              .dateOfReport
                              ? formatDate(
                                  incident.incidentInformation.submissionForm
                                    .dateOfReport,
                                )
                              : ""
                          }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
                <div class="mb-5">
                  <div class="py-3">Informant/Complainant Information</div>
                  <v-row>
                    <v-col cols="12" md="4">
                      <div class="border pa-3">
                        <div class="font-small">Informant/Complainant</div>
                        <div>
                          {{
                            incident.incidentInformation.complaintInfo
                              .complainant || ""
                          }}
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="border pa-3">
                        <div class="font-small">Contact Number</div>
                        <div>
                          {{
                            incident.incidentInformation.complaintInfo
                              .contact || ""
                          }}
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="border pa-3">
                        <div class="font-small">NRIC</div>
                        <div>
                          {{
                            incident.incidentInformation.complaintInfo.nric ||
                            ""
                          }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
                <div class="mb-5">
                  <div class="py-3">Recipient of Complaint (1st Contact)</div>
                  <v-row>
                    <v-col cols="12" md="4">
                      <div class="border pa-3">
                        <div class="font-small">Informant/Complainant</div>
                        <div>
                          {{
                            incident.incidentInformation.recipientOfComplaint
                              .recipient || ""
                          }}
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="border pa-3">
                        <div class="font-small">Contact Number</div>
                        <div>
                          {{
                            incident.incidentInformation.recipientOfComplaint
                              .contact || ""
                          }}
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="border pa-3">
                        <div class="font-small">NRIC</div>
                        <div>
                          {{
                            incident.incidentInformation.recipientOfComplaint
                              .nric || ""
                          }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
                <div class="mb-5">
                  <div class="py-3">Complaint Received to</div>
                  <v-row>
                    <v-col cols="12" md="4">
                      <div class="border pa-3">
                        <div class="font-small">Complaint Received to</div>
                        <div>
                          {{
                            incident?.incidentInformation.complaintReceivedTo
                              .receivedVia || ""
                          }}
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="8">
                      <div class="border pa-3">
                        <div class="font-small">Other description</div>
                        <div
                          v-if="
                            incident?.incidentInformation.complaintReceivedTo
                              .receivedVia === 'other'
                          "
                        >
                          {{
                            incident?.incidentInformation.complaintReceivedTo
                              .otherDescription || ""
                          }}
                        </div>
                        <div v-else>n/a</div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
                <div class="mb-5">
                  <div class="py-3">Brief Description</div>
                  <v-row>
                    <v-col cols="12">
                      <div class="border pa-3">
                        <div>
                          {{
                            incident?.incidentInformation.complaintReceivedTo
                              .briefDescription || ""
                          }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>

              <div class="px-10">
                <div class="align-start text-h5 py-5 font-weight-medium">
                  Affected Entities
                </div>
                <div class="mb-5">
                  <div class="py-3">Anyone Unit Affected</div>
                  <v-row>
                    <v-col cols="12" md="3">
                      <div class="border pa-3">
                        <div class="font-small">Anyone Unit Affected</div>
                        <div>
                          {{
                            incident?.affectedEntities.anyUnitAffectedValue ||
                            ""
                          }}
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div class="border pa-3">
                        <div class="font-small">Resident/Tenant</div>
                        <div
                          v-if="incident.affectedEntities.affectedUnit.resident"
                        >
                          <v-avatar
                            size="x-small"
                            :color="materialColors[1]"
                            class="mr-2"
                          >
                            {{
                              getInitial(`${incident.affectedEntities.affectedUnit.resident.givenName || ""} 
                                                            ${incident.affectedEntities.affectedUnit.resident.surname || ""}`)
                            }}
                          </v-avatar>
                          {{
                            `${incident.affectedEntities.affectedUnit.resident.givenName || ""} 
                                                            ${incident.affectedEntities.affectedUnit.resident.surname || ""}`
                          }}
                        </div>
                        <div v-else>---</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div class="border pa-3">
                        <div class="font-small">Unit</div>
                        <div
                          v-if="
                            incident.affectedEntities.affectedUnit.block &&
                            incident.affectedEntities.affectedUnit.level &&
                            incident.affectedEntities.affectedUnit.unit
                          "
                        >
                          {{
                            `${incident.affectedEntities.affectedUnit.block?.name || ""} - 
                          Level ${incident.affectedEntities.affectedUnit.level?.level || ""} - 
                          ${incident.affectedEntities.affectedUnit.unit?.name || ""}`
                          }}
                        </div>
                        <div v-else>---</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div class="border pa-3">
                        <div class="font-small">Remarks</div>
                        <div>
                          {{
                            incident.affectedEntities.affectedUnit
                              .description || ""
                          }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>

                <div class="mb-5">
                  <div class="py-3">Anyone Affected/Injured</div>
                  <v-row>
                    <v-col cols="12" md="3">
                      <div class="border pa-3">
                        <div>Anyone Affected/Injured</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div class="border pa-3">
                        <div>Resident/Tenant</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div class="border pa-3">
                        <div>Contact Number</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div class="border pa-3">
                        <div>NRIC/WP Number</div>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row
                    v-if="incident.affectedEntities.affectedInjured.length > 0"
                  >
                    <v-col
                      v-for="items in incident.affectedEntities.affectedInjured"
                      :key="items.nric"
                      cols="12"
                      md="3"
                    >
                      <div class="border pa-3">
                        <div>yes</div>
                      </div>
                    </v-col>
                    <v-col
                      v-for="items in incident.affectedEntities.affectedInjured"
                      :key="items.nric"
                      cols="12"
                      md="3"
                    >
                      <div class="border pa-3">
                        <div>{{ items.name }}</div>
                      </div>
                    </v-col>
                    <v-col
                      v-for="items in incident.affectedEntities.affectedInjured"
                      :key="items.nric"
                      cols="12"
                      md="3"
                    >
                      <div class="border pa-3">
                        <div>{{ items.contact }}</div>
                      </div>
                    </v-col>
                    <v-col
                      v-for="items in incident.affectedEntities.affectedInjured"
                      :key="items.nric"
                      cols="12"
                      md="3"
                    >
                      <div class="border pa-3">
                        <div>{{ items.nric }}</div>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row v-else>
                    <v-col cols="12" md="3">
                      <div class="border pa-3">
                        <div>n/a</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div class="border pa-3">
                        <div>n/a</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div class="border pa-3">
                        <div>n/a</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div class="border pa-3">
                        <div>n/a</div>
                      </div>
                    </v-col>
                  </v-row>
                </div>

                <div class="mb-5">
                  <div class="py-3">Property Damage Information</div>
                  <v-row>
                    <v-col cols="12" md="2">
                      <div class="border pa-3">
                        <div>Any property damage</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="2">
                      <div class="border pa-3">
                        <div>Name</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="2">
                      <div class="border pa-3">
                        <div>Unit</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="border pa-3">
                        <div>Description</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="2">
                      <div class="border pa-3">
                        <div>Contact Number</div>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row
                    v-if="
                      incident.affectedEntities.anyoneDamageToProperty.length >
                      0
                    "
                  >
                    <v-col
                      v-for="items in incident.affectedEntities
                        .anyoneDamageToProperty"
                      :key="items.contact"
                      cols="12"
                      md="2"
                    >
                      <div class="border pa-3">
                        <div>Yes</div>
                      </div>
                    </v-col>
                    <v-col
                      v-for="items in incident.affectedEntities
                        .anyoneDamageToProperty"
                      :key="items.contact"
                      cols="12"
                      md="2"
                    >
                      <div class="border pa-3">
                        <div>{{ items.name }}</div>
                      </div>
                    </v-col>
                    <v-col
                      v-for="items in incident.affectedEntities
                        .anyoneDamageToProperty"
                      :key="items.contact"
                      cols="12"
                      md="2"
                    >
                      <div class="border pa-3">
                        <div>Tower B Level 5 Unit 1-A</div>
                      </div>
                    </v-col>
                    <v-col
                      v-for="items in incident.affectedEntities
                        .anyoneDamageToProperty"
                      :key="items.contact"
                      cols="12"
                      md="4"
                    >
                      <div class="border pa-3">
                        <div>{{ items.description }}</div>
                      </div>
                    </v-col>
                    <v-col
                      v-for="items in incident.affectedEntities
                        .anyoneDamageToProperty"
                      :key="items.contact"
                      cols="12"
                      md="2"
                    >
                      <div class="border pa-3">
                        <div>{{ items.contact }}</div>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row v-else>
                    <v-col cols="12" md="2">
                      <div class="border pa-3">
                        <div>n/a</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="2">
                      <div class="border pa-3">
                        <div>n/a</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="2">
                      <div class="border pa-3">
                        <div>n/a</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="border pa-3">
                        <div>n/a</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="2">
                      <div class="border pa-3">
                        <div>n/a</div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>

              <div class="px-10">
                <div class="align-start text-h5 py-5 font-weight-medium">
                  Authorities
                </div>
                <div class="mb-5">
                  <div class="py-3">
                    Authorities (Police / SCDF / Ambulance) called in at the
                    scene?
                  </div>

                  <!-- Table Header -->
                  <v-row>
                    <v-col cols="12" md="2" class="border pa-3">
                      <div>Authorities</div>
                    </v-col>
                    <v-col cols="12" md="2" class="border pa-3">
                      <div>Officer In Charge</div>
                    </v-col>
                    <v-col cols="12" md="2" class="border pa-3">
                      <div>Vehicle Number</div>
                    </v-col>
                    <v-col cols="12" md="2" class="border pa-3">
                      <div>Description</div>
                    </v-col>
                    <v-col cols="12" md="2" class="border pa-3">
                      <div>Case Report Reference No.</div>
                    </v-col>
                  </v-row>

                  <!-- Table Data -->
                  <div
                    v-if="incident.authorities.authoritiesCalled?.length > 0"
                  >
                    <v-row
                      v-for="items in incident.authorities.authoritiesCalled"
                      :key="items.caseReportReferenceNumber"
                      class="d-flex"
                    >
                      <v-col cols="12" md="2" class="border pa-3">
                        <div>Yes</div>
                      </v-col>
                      <v-col cols="12" md="2" class="border pa-3">
                        <div>{{ items.personInCharge }}</div>
                      </v-col>
                      <v-col cols="12" md="2" class="border pa-3">
                        <div>{{ items.vehicleNumber }}</div>
                      </v-col>
                      <v-col cols="12" md="2" class="border pa-3">
                        <div>{{ items.description }}</div>
                      </v-col>
                      <v-col cols="12" md="2" class="border pa-3">
                        <div>{{ items.caseReportReferenceNumber }}</div>
                      </v-col>
                    </v-row>
                  </div>

                  <div v-else>
                    <v-row class="d-flex">
                      <v-col cols="12" md="2" class="border pa-3">
                        <div>n/a</div>
                      </v-col>
                      <v-col cols="12" md="2" class="border pa-3">
                        <div>n/a</div>
                      </v-col>
                      <v-col cols="12" md="2" class="border pa-3">
                        <div>n/a</div>
                      </v-col>
                      <v-col cols="12" md="2" class="border pa-3">
                        <div>n/a</div>
                      </v-col>
                      <v-col cols="12" md="2" class="border pa-3">
                        <div>n/a</div>
                      </v-col>
                    </v-row>
                  </div>
                </div>

                <div class="mb-5">
                  <div class="py-3">Incident Follow-up Information</div>

                  <!-- Incident Thereafter -->
                  <v-row>
                    <v-col cols="12" md="6" class="border pa-3">
                      <div class="font-small">
                        What was done to address the incident thereafter?
                      </div>
                      <div>
                        {{
                          incident.authorities.incidentThereAfter.actionTaken ||
                          ""
                        }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Status</div>
                      <div>
                        {{
                          incident.authorities.incidentThereAfter.status || ""
                        }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Time</div>
                      <div>
                        {{
                          incident.authorities.incidentThereAfter.time || ""
                        }}h
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Management Notified -->
                  <v-row>
                    <v-col cols="12" md="6" class="border pa-3">
                      <div class="font-small">
                        Were the management notified and who was notified?
                      </div>
                      <div>
                        {{
                          incident.authorities.managementNotified.actionTaken ||
                          ""
                        }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Status</div>
                      <div>
                        {{
                          incident.authorities.managementNotified.status || ""
                        }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Time</div>
                      <div>
                        {{
                          incident.authorities.managementNotified.time || ""
                        }}h
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Incident Resolved -->
                  <v-row>
                    <v-col cols="12" md="6" class="border pa-3">
                      <div class="font-small">
                        How was the Incident resolved?
                      </div>
                      <div>
                        {{
                          incident.authorities.incidentResolved.actionTaken ||
                          ""
                        }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Status</div>
                      <div>
                        {{ incident.authorities.incidentResolved.status || "" }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Time</div>
                      <div>
                        {{ incident.authorities.incidentResolved.time || "" }}h
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Cause of Incident -->
                  <v-row>
                    <v-col cols="12" md="6" class="border pa-3">
                      <div class="font-small">
                        What was the cause of the Incident?
                      </div>
                      <div>
                        {{
                          incident.authorities.causeOfIncident.actionTaken || ""
                        }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Status</div>
                      <div>
                        {{ incident.authorities.causeOfIncident.status || "" }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Time</div>
                      <div>
                        {{ incident.authorities.causeOfIncident.time || "" }}h
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Systems Used to Verify -->
                  <v-row>
                    <v-col cols="12" md="6" class="border pa-3">
                      <div class="font-small">
                        Any systems used to verify the incident?
                      </div>
                      <div>
                        {{ incident.authorities.systemUsed.actionTaken || "" }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Status</div>
                      <div>
                        {{ incident.authorities.systemUsed.status || "" }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Time</div>
                      <div>
                        {{ incident.authorities.systemUsed.time || "" }}h
                      </div>
                    </v-col>
                  </v-row>

                  <!-- CCTV Records or Pictures -->
                  <v-row>
                    <v-col cols="12" md="6" class="border pa-3">
                      <div class="font-small">
                        Any CCTV records or pictures taken?
                      </div>
                      <div>
                        {{ incident.authorities.cctvRecord.actionTaken || "" }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Status</div>
                      <div>
                        {{ incident.authorities.cctvRecord.status || "" }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Time</div>
                      <div>
                        {{ incident.authorities.cctvRecord.time || "" }}h
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Particulars of Tenant / Owner -->
                  <v-row>
                    <v-col cols="12" md="6" class="border pa-3">
                      <div class="font-small">
                        Particulars of tenant / owner (if any)
                      </div>
                      <div>
                        {{
                          incident.authorities.particularsOwner.actionTaken ||
                          ""
                        }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Status</div>
                      <div>
                        {{ incident.authorities.particularsOwner.status || "" }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Time</div>
                      <div>
                        {{ incident.authorities.particularsOwner.time || "" }}h
                      </div>
                    </v-col>
                  </v-row>

                  <!-- When was the Incident Resolved -->
                  <v-row>
                    <v-col cols="12" md="6" class="border pa-3">
                      <div class="font-small">
                        When was the incident resolved?
                      </div>
                      <div>
                        {{
                          incident.authorities.whenIncidentResolve
                            .actionTaken || ""
                        }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Status</div>
                      <div>
                        {{
                          incident.authorities.whenIncidentResolve.status || ""
                        }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Time</div>
                      <div>
                        {{
                          incident.authorities.whenIncidentResolve.time || ""
                        }}h
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Name of Shift In Charge -->
                  <v-row>
                    <v-col cols="12" md="6" class="border pa-3">
                      <div class="font-small">Name of Shift In charge</div>
                      <div>
                        {{
                          incident.authorities.nameOfShiftIncharge
                            .personInCharge || ""
                        }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="6" class="border pa-3">
                      <div class="font-small">Action Taken</div>
                      <div>
                        {{
                          incident.authorities.nameOfShiftIncharge
                            .actionTaken || ""
                        }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Status</div>
                      <div>
                        {{
                          incident.authorities.nameOfShiftIncharge.status || ""
                        }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Time</div>
                      <div>
                        {{
                          incident.authorities.nameOfShiftIncharge.time || ""
                        }}h
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Security Implication -->
                  <v-row>
                    <v-col cols="12" md="6" class="border pa-3">
                      <div class="font-small">
                        Any security implication due to the incident?
                      </div>
                      <div>
                        {{
                          incident.authorities.securityImplication
                            .actionTaken || ""
                        }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Status</div>
                      <div>
                        {{
                          incident.authorities.securityImplication.status || ""
                        }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" class="border pa-3">
                      <div class="font-small">Time</div>
                      <div>
                        {{
                          incident.authorities.securityImplication.time || ""
                        }}h
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>

              <div class="px-10 pb-5">
                <div class="align-start text-h5 py-5 font-weight-medium">
                  Brief Summary
                </div>
                <v-row>
                  <v-col cols="12" md="12" class="border pa-3">
                    {{ incident.briefSummary || "" }}
                  </v-col>
                </v-row>
                <v-row no-gutters class="my-3">
                  <v-item-group selected-class="bg-primary">
                    <v-row>
                      <v-col
                        v-for="(
                          attachmentItem, attachmentindex
                        ) in incident.photos"
                        :key="attachmentindex"
                        cols="12"
                        lg="4"
                      >
                        <v-item v-slot="{ isSelected, selectedClass, toggle }">
                          <v-img
                            height="200"
                            width="200"
                            :src="`/api/files/${attachmentItem.id}`"
                          >
                            <template #placeholder>
                              <v-skeleton-loader height="100%" width="100%" />
                            </template>
                          </v-img>
                        </v-item>
                      </v-col>
                    </v-row>
                  </v-item-group>
                </v-row>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "plain",
});

const { getInitial, materialColors, formatDate } = useUtils();
const route = useRoute();
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const userId = currentUser.value._id;
const {
  incident,
  getIncidentById,
  setIncident,
  updateIncident,
  deleteIncidentById,
} = useIncident();
const { confirmSign } = useOccurrenceEntry();
const selectedTemplate = ref(1);
const dataFetchedSuccessfully = ref(false);
const submitDialog = ref(false);
const deleteDialog = ref(false);
const myPassword = ref("");
const myDeletePassword = ref("");
const buttonLoader = ref(false);
const buttonDeleteLoader = ref(false);

const props = defineProps({
  incident: {
    type: String,
  },
  isConfirmModal: {
    type: Boolean,
    default: false,
  },
});
const isDialogVisible = computed(() => props.isConfirmModal);

const emit = defineEmits(["closeModal"]);

const hideModal = () => {
  emit("closeModal", false);
};
</script>

<style scoped>
.transparent-card {
  background-color: transparent !important;
  border: none !important;
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
