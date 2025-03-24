<template>
  <v-row no-gutters justify="center" class="pa-8">
    <v-col cols="12">
      <v-card
        v-if="dataFetchedSuccessfully"
        width="100%"
        height="100%"
        class="transparent-card"
        elevation="0"
      >
        <div class="px-10">
          <div
            class="d-flex justify-center text-h5 py-5 font-weight-medium"
            v-if="organization.logo"
          >
            <v-img
              :src="`/images/aigle security.jpg`"
              width="400px"
              height="150px"
            ></v-img>
          </div>

          <div
            class="d-flex justify-center text-h5 py-5"
            style="background-color: #ffff00; border: 2px solid #000"
          >
            <label class="font-weight-bold">INCIDENT REPORT</label>
          </div>

          <div
            class="d-flex justify-center text-h5 py-1 font-weight-medium"
            style="background-color: #000; color: #fff; border: 2px solid #000"
          >
            Information of Incident
          </div>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="6" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">Site: </span>
              <p>
                {{ incident.incidentInformation.siteInfo.site.name }}
              </p>
            </v-col>
            <v-col cols="6" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">Reference No.: </span>
              <p>{{ incident.reportId }}</p>
            </v-col>
          </v-row>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="6" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">Place of Incident: </span>
              <p>
                <template
                  v-if="!incident.incidentInformation.placeOfIncident.isOther"
                >
                  <div>
                    {{
                      `${incident.incidentInformation.placeOfIncident.block?.name || ""} -
                  Level ${incident.incidentInformation.placeOfIncident.level?.level || ""} -
                  ${incident.incidentInformation.placeOfIncident.unit?.name || ""}`
                    }}
                  </div>
                </template>

                <template v-else>
                  {{ incident.incidentInformation.placeOfIncident.other }}
                </template>
              </p>
            </v-col>
            <v-col cols="6" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">Type of Incident: </span>
              <p>
                {{
                  incident.incidentInformation.incidentTypeAndTime
                    .typeOfIncident || ""
                }}
              </p>
            </v-col>
          </v-row>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="6" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">Date of Incident: </span>
              <p></p>
            </v-col>
            <v-col cols="6" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">Incident Start Time: </span>
              <p>
                {{
                  incident.incidentInformation.incidentTypeAndTime
                    .incidentStart || ""
                }}h
              </p>
            </v-col>
          </v-row>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="6" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold"
                >Time of Response (From 1st contact):
              </span>
              <p>
                {{ incident.incidentInformation.submissionForm.time || "" }}h
              </p>
            </v-col>
            <v-col cols="6" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">Incident End Time: </span>
              <p>
                {{
                  incident?.incidentInformation.incidentTypeAndTime
                    .incidentEnd || ""
                }}h
              </p>
            </v-col>
          </v-row>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="6" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">Date of report submission: </span>
              <p>
                {{
                  formatDate(
                    incident.incidentInformation.submissionForm.dateOfReport,
                  ) || ""
                }}
              </p>
            </v-col>
            <v-col cols="6" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">Time of report submission: </span>
              <p>
                {{
                  incident?.incidentInformation.submissionForm.timeOfResponse ||
                  ""
                }}h
              </p>
            </v-col>
          </v-row>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="6" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold"
                >Incident report submitted by:
              </span>

              <div v-if="incident.incidentInformation.siteInfo.submittedBy">
                <v-avatar
                  size="x-small"
                  :color="materialColors[1]"
                  class="mr-2"
                >
                  {{
                    getInitial(
                      `${incident.incidentInformation.siteInfo.submittedBy || ""}`,
                    )
                  }}
                </v-avatar>
                {{
                  `${incident.incidentInformation.siteInfo.submittedBy || ""}`
                }}
              </div>
              <div v-else>---</div>
            </v-col>
            <v-col cols="6" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">Designation: </span>
              <p>
                {{ incident?.incidentInformation.siteInfo.designation }}
              </p>
            </v-col>
          </v-row>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="6" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold"
                >Name of Informant/ Complainant:
              </span>
              <p>
                {{
                  incident.incidentInformation.complaintInfo.complainant || ""
                }}
              </p>
            </v-col>
            <v-col cols="6" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold"
                >Name of Recipient of complaint (1st contact):
              </span>
              <p>
                {{
                  incident.incidentInformation.recipientOfComplaint.recipient ||
                  ""
                }}
              </p>
            </v-col>
          </v-row>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="3" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">Contact No.: </span>
              <p>
                {{ incident.incidentInformation.complaintInfo.contact || "" }}
              </p>
            </v-col>
            <v-col cols="3" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">NRIC/WP No.: </span>
              <p>
                {{ incident.incidentInformation.complaintInfo.nric || "" }}
              </p>
            </v-col>
            <v-col cols="3" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">Contact No.: </span>
              <p>
                {{
                  incident.incidentInformation.recipientOfComplaint.contact ||
                  ""
                }}
              </p>
            </v-col>
            <v-col cols="3" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">NRIC/WP No.: </span>
              <p>
                {{
                  incident.incidentInformation.recipientOfComplaint.nric || ""
                }}
              </p>
            </v-col>
          </v-row>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="12" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">Complaint received through </span>
              <v-row class="d-flex">
                <v-radio-group
                  v-model="
                    incident.incidentInformation.complaintReceivedTo.receivedVia
                  "
                  class="d-flex flex-column"
                  readonly
                >
                  <v-row>
                    <v-col cols="3">
                      <v-radio
                        label="Phone"
                        value="phone"
                        width="w-25"
                      ></v-radio>
                    </v-col>
                    <v-col cols="3">
                      <v-radio label="FCC Counter" value="fcc"></v-radio>
                    </v-col>
                    <v-col cols="3">
                      <v-radio label="Walkie Talkie" value="walkie"></v-radio>
                    </v-col>
                    <v-col cols="3">
                      <v-radio label="Other" value="other"></v-radio>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </v-row>

              <p>
                Please specify
                <span
                  v-if="
                    incident.incidentInformation.complaintReceivedTo
                      .receivedVia === 'other'
                  "
                  >{{
                    incident.incidentInformation.complaintReceivedTo
                      .otherDescription
                  }}</span
                >
                <span v-else
                  >______________________________________________________________________</span
                >
              </p>
            </v-col>
          </v-row>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="12" class="px-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">Brief Description: </span>
              <p>
                {{
                  incident.incidentInformation.complaintReceivedTo
                    .briefDescription
                }}
              </p>
            </v-col>
          </v-row>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="12" class="px-3 pt-3" style="border: 1px solid #000">
              <v-row>
                <v-col cols="3" class="pt-5">
                  <span class="font-weight-bold">Any UNIT AFFECTED? </span>
                </v-col>

                <v-col cols="9">
                  <v-radio-group
                    v-model="incident.affectedEntities.anyUnitAffectedValue"
                    class="d-flex flex-column"
                    readonly
                  >
                    <v-row>
                      <v-col cols="4">
                        <v-radio
                          label="Yes, details appended herein"
                          value="yes"
                          width="w-25"
                        ></v-radio>
                      </v-col>
                      <v-col cols="2">
                        <v-radio label="No" value="no"></v-radio>
                      </v-col>
                      <v-col cols="6">
                        <v-radio
                          label="Uncertain / Unable to determine"
                          value="uncertain"
                        ></v-radio>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="6" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">Unit No.: </span>
              <p
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
              </p>

              <p v-else>---</p>
            </v-col>
            <v-col cols="6" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">Name of tenant/resident: </span>
              <p v-if="incident.affectedEntities.affectedUnit.resident">
                <v-avatar
                  size="x-small"
                  :color="materialColors[1]"
                  class="mr-2"
                >
                  {{
                    getInitial(`${incident.affectedEntities.affectedUnit.resident.givenName || ""} 
                                    ${incident.affectedEntities.affectedUnit.resident.surname || ""}
                                    `)
                  }}
                </v-avatar>
                {{
                  `${incident.affectedEntities.affectedUnit.resident.givenName || ""} 
                                    ${incident.affectedEntities.affectedUnit.resident.surname || ""}
                                    `
                }}
              </p>
              <p v-else>---</p>
            </v-col>
          </v-row>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="12" class="pl-3 pb-2" style="border: 1px solid #000">
              <span class="font-weight-bold">Remarks (if any): </span>
              <p style="min-height: 100px">
                {{ incident.affectedEntities.affectedUnit.description }}
              </p>
            </v-col>
          </v-row>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="12" class="" style="border: 1px solid #000">
              <span class="font-weight-bold pl-3"
                >ANYONE AFFECTED / INJURED?
              </span>
              <p style="min-height: 100px">
                <v-radio-group
                  v-model="incident.affectedEntities.anyoneAffectedValue"
                  class="d-flex flex-column"
                  readonly
                >
                  <v-row>
                    <v-col cols="4">
                      <v-radio
                        label="Yes, details appended herein"
                        value="yes"
                        width="w-25"
                      ></v-radio>
                    </v-col>
                    <v-col cols="2">
                      <v-radio label="No" value="no"></v-radio>
                    </v-col>
                    <v-col cols="6">
                      <v-radio
                        label="Pending determination by relevant authorities"
                        value="pending"
                      ></v-radio>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </p>

              <v-row no-gutters>
                <v-col
                  cols="4"
                  class="py-4"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 0px;
                  "
                >
                  Name of Victim / Injured / Casualty
                </v-col>
                <v-col
                  cols="2"
                  class="py-4"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 1px solid #000;
                  "
                >
                  NRIC/WP No.
                </v-col>
                <v-col
                  cols="3"
                  class="py-4"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 1px solid #000;
                  "
                >
                  Unit No.
                </v-col>
                <v-col
                  cols="3"
                  class="py-4"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 1px solid #000;
                  "
                >
                  Contact No.
                </v-col>
              </v-row>

              <template
                v-for="items in incident.affectedEntities.affectedInjured"
              >
                <v-row no-gutters>
                  <v-col
                    cols="4"
                    class="py-5"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 0px;
                    "
                  >
                    {{ items.name }}
                  </v-col>
                  <v-col
                    cols="2"
                    class="py-5"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 1px solid #000;
                    "
                  >
                    {{ items.nric }}
                  </v-col>
                  <v-col
                    cols="3"
                    class="py-5"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 1px solid #000;
                    "
                  >
                  </v-col>
                  <v-col
                    cols="3"
                    class="py-5"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 1px solid #000;
                    "
                  >
                    {{ items.contact }}
                  </v-col>
                </v-row>
              </template>
            </v-col>
          </v-row>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="12" class="" style="border: 1px solid #000">
              <span class="font-weight-bold pl-3"
                >ANYONE DAMAGE TO PROPERTY?
              </span>
              <p style="min-height: 100px">
                <v-radio-group
                  v-model="incident.affectedEntities.anyPropertyAffectedValue"
                  class="d-flex flex-column"
                  readonly
                >
                  <v-row>
                    <v-col cols="4">
                      <v-radio
                        label="Yes, details appended herein"
                        value="yes"
                        width="w-25"
                      ></v-radio>
                    </v-col>
                    <v-col cols="2">
                      <v-radio label="No" value="no"></v-radio>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </p>

              <v-row no-gutters>
                <v-col
                  cols="4"
                  class="py-4"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 0px;
                  "
                >
                  Description of damage
                </v-col>
                <v-col
                  cols="2"
                  class="py-4"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 1px solid #000;
                  "
                >
                  Name of property owner
                </v-col>
                <v-col
                  cols="3"
                  class="py-4"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 1px solid #000;
                  "
                >
                  Unit No.
                </v-col>
                <v-col
                  cols="3"
                  class="py-4"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 1px solid #000;
                  "
                >
                  Contact No.
                </v-col>
              </v-row>
              <template
                v-for="items in incident.affectedEntities
                  .anyoneDamageToProperty"
              >
                <v-row no-gutters>
                  <v-col
                    cols="4"
                    class="py-5"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 0px;
                    "
                  >
                    {{ items.description }}
                  </v-col>
                  <v-col
                    cols="2"
                    class="py-5"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 1px solid #000;
                    "
                  >
                    {{ items.name }}
                  </v-col>
                  <v-col
                    cols="3"
                    class="py-5"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 1px solid #000;
                    "
                  >
                    {{
                      `${items.block?.name || ""} -
                  Level ${items.level?.level || ""} -
                  ${items.unit?.name || ""}`
                    }}
                  </v-col>
                  <v-col
                    cols="3"
                    class="py-5"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 1px solid #000;
                    "
                  >
                    {{ items.contact }}
                  </v-col>
                </v-row>
              </template>
            </v-col>
          </v-row>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="12" class="" style="border: 1px solid #000">
              <span class="font-weight-bold pl-3"
                >AUTHORITIES (POLICE / SCDF / AMBULANCE ) CALLED IN AT THE
                SCENE?
              </span>
              <p style="min-height: 100px">
                <v-radio-group
                  v-model="incident.affectedEntities.anyoneAffectedValue"
                  class="d-flex flex-column"
                  readonly
                >
                  <v-row>
                    <v-col cols="4">
                      <v-radio
                        label="Yes, details appended herein"
                        value="yes"
                        width="w-25"
                      ></v-radio>
                    </v-col>
                    <v-col cols="2">
                      <v-radio label="No" value="no"></v-radio>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </p>

              <v-row no-gutters class="font-weight-bold">
                <v-col
                  cols="3"
                  class="py-4"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 0px;
                  "
                >
                  Description
                </v-col>
                <v-col
                  cols="3"
                  class="py-4"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 1px solid #000;
                  "
                >
                  Vehicle Number
                </v-col>
                <v-col
                  cols="3"
                  class="py-4"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 1px solid #000;
                  "
                >
                  Officer in charge
                </v-col>
                <v-col
                  cols="3"
                  class="py-4"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 1px solid #000;
                  "
                >
                  Case / Report Ref.
                </v-col>
              </v-row>

              <template v-for="items in incident.authorities.authoritiesCalled">
                <v-row no-gutters>
                  <v-col
                    cols="3"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 0px;
                    "
                  >
                    <v-checkbox
                      v-model="items.description"
                      :label="items.description"
                      :value="items.description"
                    ></v-checkbox>
                  </v-col>
                  <v-col
                    class="d-flex align-center justify-center"
                    cols="3"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 1px solid #000;
                    "
                  >
                    {{ items.vehicleNumber }}
                  </v-col>
                  <v-col
                    class="d-flex align-center justify-center"
                    cols="3"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 1px solid #000;
                    "
                  >
                    {{ items.personInCharge }}
                  </v-col>
                  <v-col
                    class="d-flex align-center justify-center py-5"
                    cols="3"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 1px solid #000;
                    "
                  >
                    {{ items.caseReportReferenceNumber }}
                  </v-col>
                </v-row>
              </template>

              <v-row no-gutters>
                <v-col
                  cols="3"
                  class="py-5"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 0px;
                  "
                >
                  Others:________________
                </v-col>
                <v-col
                  cols="3"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 1px solid #000;
                  "
                >
                </v-col>
                <v-col
                  cols="3"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 1px solid #000;
                  "
                >
                </v-col>
                <v-col
                  cols="3"
                  class="py-5"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 1px solid #000;
                  "
                >
                </v-col>
              </v-row>

              <v-row no-gutters class="font-weight-bold">
                <v-col
                  cols="1"
                  class="py-4"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 0px;
                  "
                >
                  S/No
                </v-col>
                <v-col
                  cols="4"
                  class="py-4"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 1px solid #000;
                  "
                >
                  Areas of Concern
                </v-col>
                <v-col
                  cols="3"
                  class="py-4"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 1px solid #000;
                  "
                >
                  Action Taken
                </v-col>
                <v-col
                  cols="2"
                  class="py-4"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 1px solid #000;
                  "
                >
                  Status
                </v-col>
                <v-col
                  cols="2"
                  class="py-4"
                  style="
                    text-align: center;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    border-left: 1px solid #000;
                  "
                >
                  Time
                </v-col>
              </v-row>

              <template v-for="(question, i) in questions">
                <v-row
                  v-if="question.row === 3"
                  no-gutters
                  class="font-weight-bold"
                >
                  <v-col
                    cols="1"
                    class="py-4"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 0px;
                    "
                  >
                    {{ i + 1 }}
                  </v-col>
                  <v-col
                    cols="4"
                    class="py-4 px-2"
                    style="
                      text-align: left;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 1px solid #000;
                    "
                    >{{ question.text }}
                  </v-col>
                  <v-col
                    cols="3"
                    class="py-4"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 1px solid #000;
                    "
                  >
                    {{ question.action }}
                  </v-col>
                  <v-col
                    cols="2"
                    class="py-4"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 1px solid #000;
                    "
                  >
                    {{ question.status }}
                  </v-col>
                  <v-col
                    cols="2"
                    class="py-4"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 1px solid #000;
                    "
                  >
                    {{ question.time }}
                  </v-col>
                </v-row>

                <v-row v-else no-gutters class="font-weight-bold">
                  <v-col
                    cols="1"
                    class="py-4"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 0px;
                    "
                  >
                    {{ i + 1 }}
                  </v-col>
                  <v-col
                    cols="4"
                    class="py-4 px-2"
                    style="
                      text-align: left;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 1px solid #000;
                    "
                  >
                    {{ question.text }}
                    <br v-if="question.personInCharge" />

                    {{
                      question.personInCharge
                        ? `- ${question.personInCharge}`
                        : ""
                    }}
                  </v-col>
                  <v-col
                    cols="3"
                    class="py-4"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 1px solid #000;
                    "
                  >
                    {{ question.action }}
                  </v-col>
                  <v-col
                    cols="2"
                    class="py-4"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 1px solid #000;
                    "
                  >
                    {{ question.shiftStart }}
                  </v-col>
                  <v-col
                    cols="2"
                    class="py-4"
                    style="
                      text-align: center;
                      border-top: 1px solid #000;
                      border-bottom: 1px solid #000;
                      border-left: 1px solid #000;
                    "
                  >
                    {{ question.shiftEnd }}
                    <span
                      v-if="question.text == 'When was the incident resolved'"
                    >
                      {{ question.time }}
                    </span>
                  </v-col>
                </v-row>
              </template>
            </v-col>
          </v-row>

          <div
            class="d-flex justify-center text-h5 py-1 font-weight-medium"
            style="background-color: #000; color: #fff; border: 2px solid #000"
          >
            Brief Summary of Incident
          </div>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="12" class="pb-2 pt-2" style="border: 1px solid #000">
              <!-- <span class="pl-3 font-weight-bold"
                >Summary should include the following:</span
              >
              <ul style="margin-left: 70px" class="mb-5">
                <li>What happened?</li>
                <li>When did it happened?</li>
                <li>Where did it happened?</li>
                <li>Who was involved?</li>
                <li>How did it happened?</li>
                <li>Why did it happened?</li>
                <li>Is there any security implication due to the incident?</li>
              </ul> -->
              <div class="py-5 px-8">{{ incident.briefSummary }}</div>

              <p
                class="pl-3"
                style="
                  /* min-height: 100px; */
                  /* border-top: 1px solid #000; */
                  border-bottom: 1px solid #000;
                "
              >
                <!-- {{ incident.affectedEntities.affectedUnit.description }} -->
              </p>

              <v-row class="my-5 mx-3">
                <v-col cols="12">
                  <div class="text-h5 font-weight-medium pl-5">
                    Attached Photos:
                  </div>
                </v-col>
                <v-col
                  v-for="(imageUrl, index) in imageUrls"
                  :key="index"
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <img
                    :src="imageUrl"
                    :alt="'Rendered Image ' + (index + 1)"
                    style="
                      max-width: 22rem;
                      height: auto;
                      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                      border-radius: 8px;
                    "
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row no-gutters style="font-size: 20px">
            <v-col cols="12" class="pb-2 pt-2">
              <span class="pl-3 font-weight-bold">Important note:</span>
              <ol style="margin-left: 30px" class="mb-5">
                <li>
                  This report must be submitted to the MCST management within 24
                  hours from the end time of the incident.
                </li>
                <li>
                  Please fax a copy to Aigle Office at DID: 6416 and file
                  original into incident file.
                </li>
                <li>Follow up Action/Instruction</li>
              </ol>
            </v-col>
          </v-row>

          <v-row no-gutters style="font-size: 18px">
            <v-col cols="12" class="pb-5 pt-5" style="margin-bottom: 50px">
              <table>
                <tbody>
                  <tr>
                    <td style="width: 20%">
                      <span class="">Verified by Management:</span>
                    </td>
                    <td style="width: 30%; border-bottom: 1px solid #000">
                      &nbsp;
                    </td>
                    <td style="width: 35%">&nbsp;</td>
                    <td style="width: 20%; border-bottom: 1px solid #000">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 20%"></td>
                    <td style="width: 30%">Name</td>
                    <td style="width: 35%">&nbsp;</td>
                    <td style="width: 20%">Date</td>
                  </tr>
                </tbody>
              </table>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "plain",
});

const { getInitial, materialColors, formatDate } = useUtils();
const route = useRoute();
const { currentUser } = useLocalAuth();
const { organization, setOrganization, getOrganizationById } =
  useOrganization();
const { setSnackbar } = useLocal();
const userId = currentUser.value._id;
const {
  incident,
  getIncidentById,
  setIncident,
  updateIncident,
  deleteIncidentById,
  getImage,
} = useIncident();
const { getSpecificImage } = useFiles();
const { confirmSign } = useOccurrenceEntry();
const { getSitesOptionsForFiltering, mySite } = useFilter();

const id = computed(() => useRoute().params.id as string);
const selectedTemplate = ref(1);
const dataFetchedSuccessfully = ref(false);
const authorities = ref([
  {
    text: "Police (SPF)",
    value: "Police",
  },
  {
    text: "SCDF",
    value: "SCDF",
  },
  {
    text: "Ambulance",
    value: "ambulance",
  },
]);
const questions: any = computed(() => {
  return [
    {
      rows: 3,
      text: "What was done to address the incident thereafter",
      action: incident.value.authorities.incidentThereAfter.actionTaken,
      status: incident.value.authorities.incidentThereAfter.status,
      time: incident.value.authorities.incidentThereAfter.time,
    },
    {
      rows: 3,
      text: "Were the management notified and who was notified",
      action: incident.value.authorities.managementNotified.actionTaken,
      status: incident.value.authorities.managementNotified.status,
      time: incident.value.authorities.managementNotified.time,
    },
    {
      rows: 3,
      text: "How was the Incident resolved?",
      action: incident.value.authorities.incidentResolved.actionTaken,
      status: incident.value.authorities.incidentResolved.status,
      time: incident.value.authorities.incidentResolved.time,
    },
    {
      rows: 3,
      text: "What was the cause of the Incident?",
      action: incident.value.authorities.causeOfIncident.actionTaken,
      status: incident.value.authorities.causeOfIncident.actionTaken,
      time: incident.value.authorities.causeOfIncident.time,
    },
    {
      rows: 3,
      text: "Any systems used to verify the incident",
      action: incident.value.authorities.systemUsed.actionTaken,
      status: incident.value.authorities.systemUsed.status,
      time: incident.value.authorities.systemUsed.time,
    },
    {
      rows: 3,
      text: "Any CCTV records or pictures taken?",
      action: incident.value.authorities.cctvRecord.actionTaken,
      status: incident.value.authorities.cctvRecord.status,
      time: incident.value.authorities.cctvRecord.time,
    },
    {
      rows: 3,
      text: "Particulars of tenant / owner (if any)",
      action: incident.value.authorities.particularsOwner.actionTaken,
      status: incident.value.authorities.particularsOwner.status,
      time: incident.value.authorities.particularsOwner.time,
    },
    {
      rows: 3,
      text: "When was the incident resolved",
      action: incident.value.authorities.whenIncidentResolve.actionTaken,
      status: incident.value.authorities.whenIncidentResolve.status,
      time: incident.value.authorities.whenIncidentResolve.time,
    },
    {
      rows: 4,
      text: "Name of Shift In charge",
      action: incident.value.authorities.nameOfShiftIncharge.actionTaken,
      personInCharge:
        incident.value.authorities.nameOfShiftIncharge.personInCharge,
      shiftStart: incident.value.authorities.nameOfShiftIncharge.shiftStart,
      shiftEnd: incident.value.authorities.nameOfShiftIncharge.shiftEnd,
    },
    {
      rows: 3,
      text: "Any security implication due to the incident?",
      action: incident.value.authorities.securityImplication.actionTaken,
      status: "",
      time: "",
    },
  ];
});

const submitDialog = ref(false);
const deleteDialog = ref(false);
const myPassword = ref("");
const myDeletePassword = ref("");
const buttonLoader = ref(false);
const buttonDeleteLoader = ref(false);
const confirmPayload = reactive({
  _id: id,
  status: "",
  approvedBy: currentUser.value._id,
  reasonForReject: "",
});
const incidentPhotos = computed(() => incident.value.photos);
const _organization = computed(() => currentUser.value.organization);
const attachmentPhotos = ref<string[]>([]);

const imageUrls = ref<string[]>([]);

async function fetchAndRenderImages() {
  imageUrls.value = [];

  const photos = incident.value?.photos;
  if (!photos || photos.length === 0) {
    console.warn("No photos found in incident data");
    return;
  }

  try {
    for (const photo of photos) {
      const myImage = await getSpecificImage(photo.id);
      const imageUrl = URL.createObjectURL(myImage);
      imageUrls.value.push(imageUrl);
    }
  } catch (error: any) {
    console.error("Error fetching images:", error.message);
  }
}

onMounted(async () => {
  try {
    const [result] = await Promise.all([
      getIncidentById(id.value),
      getSitesOptionsForFiltering(),
    ]);

    if (result) {
      setIncident(result);
      dataFetchedSuccessfully.value = true;

      await fetchAndRenderImages();
    } else {
      throw new Error("Failed to fetch incident data");
    }
  } catch (error: any) {
    console.error("Error fetching incident data:", error.message);
    dataFetchedSuccessfully.value = false;
  }
});

onUnmounted(() => {
  imageUrls.value.forEach((imageUrl) => {
    URL.revokeObjectURL(imageUrl);
  });
});

function goBack() {
  useRouter().back();
}
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
