<template>
  <v-row no-gutters justify="center" class="pa-md-8">
    <v-col cols="12">
      <v-card
        v-if="dataFetchedSuccessfully"
        width="100%"
        elevation="3"
        height="100%"
        class=""
      >
        <div class="pa-5 d-flex justify-space-between">
          <div class="d-flex align-center">
            <v-btn
              fav
              density="compact"
              icon="mdi-arrow-left"
              variant="text"
              class="mt-1"
              @click="goBack()"
            ></v-btn>
            <span
              class="ml-2 text-h6 font-weight-bold text-capitalize"
              style="letter-spacing: 2px !important"
            >
              {{ incident.reportId }}
            </span>
          </div>

          <div class="d-flex ga-5" v-if="$vuetify.display.mdAndUp">
            <div
              v-if="
                incident.status === 'pending' &&
                (currentUser.type === 'site' ||
                  currentUser.type === 'service-provider')
              "
            >
              <v-dialog v-model="deleteDialog" max-width="400" persistent>
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn
                    class="bg-red text-white py-6 px-5 text-center d-flex align-center justify-center"
                    v-bind="activatorProps"
                  >
                    <v-icon class="mr-1"> mdi-trash-can-outline </v-icon>Delete
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
                      type="password"
                      label="Enter Password"
                      v-model="myDeletePassword"
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
                            :loading="buttonDeleteLoader"
                            @click="deleteIncidentReport()"
                          >
                            Confirm
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </template>
                </v-card>
              </v-dialog>
            </div>
            <v-btn
              class="bg-light-blue-darken-2 text-white py-6 px-5 text-center d-flex align-center justify-center"
              :loading="isDownloadingPdf"
              @click.stop="onDownloadDobPdf(incident._id || '')"
              ><v-icon class="mr-1">mdi-download</v-icon>Download PDF</v-btn
            >
          </div>
          <v-menu v-else>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon flat size="x-small" class="border-md">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item>
                <v-btn
                  class="bg-light-blue-darken-2 text-white py-6 px-5 text-center d-flex align-center justify-center"
                  :loading="isDownloadingPdf"
                  @click.stop="onDownloadDobPdf(incident._id || '')"
                >
                  <v-icon>mdi-download</v-icon>
                  Download PDF
                </v-btn>
              </v-list-item>

              <v-list-item
                v-if="
                  incident.status === 'pending' &&
                  (currentUser.type === 'site' ||
                    currentUser.type === 'service-provider')
                "
              >
                <v-dialog v-model="deleteDialog" max-width="400" persistent>
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-list-item-title
                      class="action-style text-caption"
                      v-bind="activatorProps"
                    >
                      <v-btn
                        class="bg-red text-white py-6 px-5 text-center d-flex align-center justify-center w-100"
                      >
                        <v-icon class="mr-1"> mdi-trash-can-outline </v-icon>
                        Delete
                      </v-btn>
                    </v-list-item-title>
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
                        type="password"
                        label="Enter Password"
                        v-model="myDeletePassword"
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
                              :loading="buttonDeleteLoader"
                              @click="deleteIncidentReport()"
                            >
                              Confirm
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </template>
                  </v-card>
                </v-dialog>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <v-divider></v-divider>
        <div class="d-flex">
          <div
            :class="{
              'bg-red': incident.status === 'rejected',
              'bg-orange-darken-1': incident.status === 'pending',
              'bg-green': incident.status === 'approved',
            }"
            class="d-flex text-white px-12 pa-5 align-center justify-center font-weight-medium"
          >
            {{
              (incident.status || "").charAt(0).toUpperCase() +
              (incident.status || "").slice(1)
            }}
          </div>
          <div class="pa-4" v-if="incident.status === 'rejected'">
            <div class="text-h6">Reason</div>
            <div>
              {{ incident.reasonForReject }}
            </div>
          </div>
          <div class="pa-4" v-else-if="incident.status === 'approved'">
            <div class="text-h6">Remarks</div>
            <div>
              {{ incident.reasonForReject }}
            </div>
          </div>
        </div>
        <v-divider></v-divider>

        <div
          class="d-flex w-100 justify-space-around stepper-height"
          :style="$vuetify.display.smAndDown ? 'font-size: .8rem' : ''"
        >
          <div
            :class="[
              'd-flex align-center justify-center h-container',
              selectedTemplate === 1 ? 'h-container-bottom' : '',
              $vuetify.display.mdAndDown
                ? 'w-100 text-center'
                : 'w-25 w-25 text-body-1 text-center ',
            ]"
            @click="selectTemplate(1)"
          >
            Incident Informations
          </div>
          <div
            :class="[
              'd-flex align-center justify-center h-container',
              selectedTemplate === 2 ? 'h-container-bottom' : '',
              $vuetify.display.mdAndDown
                ? 'w-100 text-center'
                : 'w-25 text-body-1 text-center',
            ]"
            @click="selectTemplate(2)"
          >
            Affected Entities
          </div>
          <div
            :class="[
              'd-flex align-center justify-center h-container',
              selectedTemplate === 3 ? 'h-container-bottom' : '',
              $vuetify.display.mdAndDown ? 'w-100' : 'w-25 text-body-1',
            ]"
            @click="selectTemplate(3)"
          >
            Authorities
          </div>
          <div
            :class="[
              'd-flex align-center justify-center h-container',
              selectedTemplate === 4 ? 'h-container-bottom' : '',
              $vuetify.display.mdAndDown ? 'w-100' : 'w-25 w-25 text-body-1',
            ]"
            @click="selectTemplate(4)"
          >
            Brief Summary
          </div>
        </div>

        <div v-if="selectedTemplate === 1" class="px-10">
          <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
            Incident Information
          </div>
          <v-divider />
          <div class="mb-5">
            <div class="py-3">Site Information</div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Site</div>
                <div>{{ incident.incidentInformation.siteInfo.site.name }}</div>
              </div>
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Incident Ref. No.</div>
                <div>{{ incident.reportId }}</div>
              </div>
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6">Submitted by</div>
                <div v-if="incident.incidentInformation.siteInfo.submittedBy">
                  <v-avatar
                    size="x-small"
                    :color="materialColors[1]"
                    class="mr-2"
                  >
                    {{
                      getInitial(
                        incident.incidentInformation.siteInfo.submittedBy || "",
                      )
                    }}
                  </v-avatar>

                  {{
                    `${incident.incidentInformation.siteInfo.submittedBy || ""}`
                      .trim()
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                      )
                      .join(" ")
                  }}
                </div>
                <div v-else>---</div>
              </div>
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Designation</div>
                <div>
                  {{ incident?.incidentInformation.siteInfo.designation }}
                </div>
              </div>
            </div>
          </div>
          <div class="mb-5">
            <div class="py-3 d-flex" v-if="$vuetify.display.mdAndUp">
              <div class="w-50">Place Of Incident</div>
              <div class="w-50">Type of Incident</div>
            </div>

            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-50 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Place of Incident</div>
                <div>
                  {{
                    `${incident.incidentInformation.placeOfIncident.block?.name || ""} - 
                    Level ${incident.incidentInformation.placeOfIncident.level?.level || ""} - 
                    ${incident.incidentInformation.placeOfIncident?.unit.name || ""}`
                  }}
                </div>
              </div>
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'd-flex border w-50 pa-3 justify-space-between'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4 py-md-0'
                "
              >
                <div>
                  <div class="text-h6 mr-4">Type of Incident</div>
                  <div class="text-primary">
                    {{
                      incident.incidentInformation.incidentTypeAndTime
                        .typeOfIncident || ""
                    }}
                  </div>
                </div>
                <div>
                  <div class="font-small text-green">Incident Start</div>
                  <div>
                    {{
                      incident.incidentInformation.incidentTypeAndTime
                        .incidentStart || ""
                    }}h
                  </div>
                </div>
                <div>
                  <div class="font-small text-red">Incident End</div>
                  <div>
                    {{
                      incident?.incidentInformation.incidentTypeAndTime
                        .incidentEnd !== "Pending" &&
                      incident?.incidentInformation.incidentTypeAndTime
                        .incidentEnd !== "N/A"
                        ? incident?.incidentInformation.incidentTypeAndTime
                            .incidentEnd + "h"
                        : incident?.incidentInformation.incidentTypeAndTime
                            .incidentEnd || ""
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-5">
            <div class="py-3">Response/Submission From (1st Contact)</div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-33 pa-3'
                    : 'border w-100 pa-3 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">
                  Time of response from (1st contact)
                </div>
                <div class="text-green">
                  {{ incident.incidentInformation.submissionForm.time || "" }}h
                </div>
              </div>
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-33 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">
                  Time of Response Report Submission
                </div>
                <div class="text-green">
                  {{
                    incident?.incidentInformation.submissionForm
                      .timeOfResponse || ""
                  }}h
                </div>
              </div>
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-33 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Date of report Submission</div>
                <div class="text-green">
                  {{
                    formatDate(
                      incident.incidentInformation.submissionForm.dateOfReport,
                    ) || ""
                  }}
                </div>
              </div>
            </div>
          </div>
          <div class="mb-5">
            <div class="py-3">Informant/Complainant Information</div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-33 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Informant/Complainant</div>
                <div>
                  {{
                    incident.incidentInformation.complaintInfo.complainant || ""
                  }}
                </div>
              </div>
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-33 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Contact Number</div>
                <div>
                  {{ incident.incidentInformation.complaintInfo.contact || "" }}
                </div>
              </div>
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-33 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">NRIC</div>
                <div class="text-red">
                  {{
                    maskText(
                      incident.incidentInformation.complaintInfo.nric || "",
                    )
                  }}
                </div>
              </div>
            </div>
          </div>
          <div class="mb-5">
            <div class="py-3">Recipient of Complaint (1st Contact)</div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-33 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Informant/Complainant</div>
                <div>
                  {{
                    incident.incidentInformation.recipientOfComplaint
                      .recipient || ""
                  }}
                </div>
              </div>
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-33 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Contact Number</div>
                <div>
                  {{
                    incident.incidentInformation.recipientOfComplaint.contact ||
                    ""
                  }}
                </div>
              </div>
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-33 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">NRIC</div>
                <div class="text-red">
                  {{
                    maskText(
                      incident.incidentInformation.recipientOfComplaint.nric ||
                        "",
                    )
                  }}
                </div>
              </div>
            </div>
          </div>
          <div class="mb-5">
            <div class="py-3">Complaint Received through</div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-33 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Complaint Received through</div>
                <div>
                  {{
                    incident?.incidentInformation.complaintReceivedTo
                      .receivedVia || ""
                  }}
                </div>
              </div>
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-66 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Other description</div>
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
            </div>
          </div>
          <div class="mb-5">
            <div class="py-3">Brief Description</div>
            <div class="d-flex">
              <div class="border w-100 pa-3">
                <!-- <div class="font-small">Brief Description</div> -->
                <div>
                  {{
                    incident?.incidentInformation.complaintReceivedTo
                      .briefDescription || ""
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedTemplate === 2" class="px-10">
          <div class="align-start text-h5 py-5 font-weight-medium">
            Affected Entities
          </div>
          <div class="mb-5">
            <div class="py-3">Anyone Unit Affected</div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex w-100' : ''">
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                "
              >
                <div class="font-small">Anyone Unit Affected</div>
                <div>
                  {{ incident?.affectedEntities.anyUnitAffectedValue || "" }}
                </div>
              </div>
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                "
              >
                <div class="font-small">Resident/Tenant</div>
                <div
                  class="text-capitalize"
                  v-if="incident.affectedEntities.affectedUnit.resident"
                >
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
                </div>
                <div v-else>---</div>
              </div>
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                "
              >
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
              <!-- <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Contact Number</div>
                <div> {{ incident?.affectedEntities?.affectedUnit?.resident }}</div>
              </div> -->
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                "
              >
                <div class="font-small">Remarks</div>
                <div>
                  <!-- remarks = description -->
                  {{ incident.affectedEntities.affectedUnit.description }}
                </div>
              </div>
            </div>
          </div>
          <div class="mb-5">
            <div class="py-3">Anyone Affected/Injured</div>
            <div :class="$vuetify.display.mdAndUp ? '' : 'd-flex'">
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'd-flex w-100'
                    : 'd-flex flex-column w-100 custom-height-md'
                "
              >
                <div
                  :class="[
                    'border pa-3',
                    $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-25',
                    'd-flex flex-column justify-center flex-fill',
                  ]"
                >
                  <div>Anyone Affected/Injured</div>
                </div>
                <div
                  :class="[
                    'border pa-3',
                    $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-25',
                    'd-flex flex-column justify-center flex-fill',
                  ]"
                >
                  <div>Resident/Tenant</div>
                </div>
                <div
                  :class="[
                    'border pa-3',
                    $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-25',
                    'd-flex flex-column justify-center flex-fill',
                  ]"
                >
                  <div>Contact Number</div>
                </div>
                <div
                  :class="[
                    'border pa-3',
                    $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-25',
                    'd-flex flex-column justify-center flex-fill',
                  ]"
                >
                  <div>NRIC/WP Number</div>
                </div>
              </div>

              <div v-if="incident.affectedEntities.affectedInjured.length > 0">
                <div
                  v-for="items in incident.affectedEntities.affectedInjured"
                  :key="items.id"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'd-flex w-100'
                      : 'd-flex flex-column w-100 custom-height-md'
                  "
                >
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-25',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div>
                      {{ incident.affectedEntities.anyUnitAffectedValue }}
                    </div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-25',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div>{{ items.name }}</div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-25',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div>{{ items.contact }}</div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-25',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div>
                      {{ maskText(items.nric || "") }}
                    </div>
                  </div>
                </div>
              </div>

              <div v-else>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'd-flex w-100'
                      : 'd-flex flex-column w-100 custom-height-md'
                  "
                >
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-25',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="text-red">n/a</div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-25',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="text-red">n/a</div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-25',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="text-red">n/a</div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-25',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="text-red">n/a</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-5">
            <div class="py-3">Property damage information</div>
            <div :class="$vuetify.display.mdAndUp ? '' : 'd-flex'">
              <div
                :class="$vuetify.display.mdAndUp ? 'd-flex w-100' : 'd-none'"
              >
                <div
                  :class="[
                    'border pa-3',
                    $vuetify.display.mdAndUp ? 'w-25 d-flex' : 'd-none',
                    'flex-column justify-center flex-fill',
                  ]"
                >
                  <div>Any property damage</div>
                </div>
                <div
                  :class="[
                    'border pa-3',
                    $vuetify.display.mdAndUp ? 'w-25 d-flex' : 'd-none',
                    'flex-column justify-center flex-fill',
                  ]"
                >
                  <div>Name</div>
                </div>
                <div
                  :class="[
                    'border pa-3',
                    $vuetify.display.mdAndUp ? 'w-25 d-flex' : 'd-none',
                    'flex-column justify-center flex-fill',
                  ]"
                >
                  <div>Block / Level / Unit</div>
                </div>
                <div
                  :class="[
                    'border pa-3',
                    $vuetify.display.mdAndUp ? 'w-25 d-flex' : 'd-none',
                    'flex-column justify-center flex-fill',
                  ]"
                >
                  <div>Description</div>
                </div>
                <div
                  :class="[
                    'border pa-3',
                    $vuetify.display.mdAndUp ? 'w-25 d-flex' : 'd-none',
                    'flex-column justify-center flex-fill',
                  ]"
                >
                  <div>Contact Number</div>
                </div>
              </div>
              <div
                v-if="
                  incident.affectedEntities.anyoneDamageToProperty.length > 0
                "
              >
                <div
                  v-for="items in incident.affectedEntities
                    .anyoneDamageToProperty"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'd-flex w-100'
                      : 'd-flex flex-column w-100'
                  "
                >
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-20',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div
                      :class="
                        $vuetify.display.smAndDown ? 'd-inline-flex' : 'd-none'
                      "
                    >
                      Any property damage
                    </div>
                    <div
                      :class="$vuetify.display.smAndDown ? 'text-caption' : ''"
                    >
                      - Yes
                    </div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-20',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div
                      :class="
                        $vuetify.display.smAndDown ? 'd-inline-flex' : 'd-none'
                      "
                    >
                      Name
                    </div>
                    <div
                      :class="$vuetify.display.smAndDown ? 'text-caption' : ''"
                    >
                      - {{ items.name }}
                    </div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-20',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div
                      :class="
                        $vuetify.display.smAndDown ? 'd-inline-flex' : 'd-none'
                      "
                    >
                      Block/Level/Unit
                    </div>
                    <div
                      :class="$vuetify.display.smAndDown ? 'text-caption' : ''"
                    >
                      -
                      {{
                        ` 
                    ${items.block.name || ""} /
                    ${items.level.level || ""} /
                    ${items.unit.name || ""} 
                    `
                      }}
                    </div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-10',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div
                      :class="
                        $vuetify.display.smAndDown ? 'd-inline-flex' : 'd-none'
                      "
                    >
                      Description
                    </div>
                    <div
                      :class="$vuetify.display.smAndDown ? 'text-caption' : ''"
                    >
                      -
                      {{ items.description }}
                    </div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-10',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div
                      :class="
                        $vuetify.display.smAndDown ? 'd-inline-flex' : 'd-none'
                      "
                    >
                      Contact No.
                    </div>
                    <div
                      :class="$vuetify.display.smAndDown ? 'text-caption' : ''"
                    >
                      -
                      {{ items.contact }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'd-flex w-100'
                      : 'd-flex flex-column w-100 custom-height-md'
                  "
                >
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-20',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="text-red">n/a</div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-20',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="text-red">n/a</div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-20',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="text-red">n/a</div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-30',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="text-red">n/a</div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-10',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="text-red">n/a</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedTemplate === 3" class="px-10">
          <div class="align-start text-h5 py-5 font-weight-medium">
            Authorities
          </div>
          <div class="mb-5">
            <div class="py-3">
              Authorities (Police / SCDF / Ambulance) called in at the scene?
            </div>
            <div :class="$vuetify.display.mdAndUp ? '' : 'd-flex'">
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'd-flex w-100'
                    : 'd-flex flex-column w-100 custom-height-md'
                "
              >
                <div
                  :class="[
                    'border pa-3',
                    $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-20',
                    'd-flex flex-column justify-center flex-fill',
                  ]"
                >
                  <div>Authorities</div>
                </div>
                <div
                  :class="[
                    'border pa-3',
                    $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-20',
                    'd-flex flex-column justify-center flex-fill',
                  ]"
                >
                  <div>Officer In Charge</div>
                </div>
                <div
                  :class="[
                    'border pa-3',
                    $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-10',
                    'd-flex flex-column justify-center flex-fill',
                  ]"
                >
                  <div>Vehicle Number</div>
                </div>
                <div
                  :class="[
                    'border pa-3',
                    $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-30',
                    'd-flex flex-column justify-center flex-fill',
                  ]"
                >
                  <div>Description</div>
                </div>
                <div
                  :class="[
                    'border pa-3',
                    $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-20',
                    'd-flex flex-column justify-center flex-fill',
                  ]"
                >
                  <div class="small-font">Case Report Reference No.</div>
                </div>
              </div>

              <div v-if="incident.authorities.authoritiesCalled?.length > 0">
                <div
                  v-for="items in incident.authorities.authoritiesCalled"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'd-flex w-100'
                      : 'd-flex flex-column w-100 custom-height-md'
                  "
                >
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-20',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="text-green">Yes</div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-20',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="text-green">{{ items.personInCharge }}</div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-10',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="text-green">{{ items.vehicleNumber }}</div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-30',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="text-green">{{ items.description }}</div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-20',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="small-font text-green">
                      {{ items.caseReportReferenceNumber }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'd-flex w-100'
                      : 'd-flex flex-column w-100 custom-height-md'
                  "
                >
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-20',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="text-red">n/a</div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-20',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="text-red">n/a</div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-10',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="text-red">n/a</div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-30',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="text-red">n/a</div>
                  </div>
                  <div
                    :class="[
                      'border pa-3',
                      $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-20',
                      'd-flex flex-column justify-center flex-fill',
                    ]"
                  >
                    <div class="small-font text-red">n/a</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-5">
            <div :class="$vuetify.display.mdAndUp ? 'd-flex w-100' : ''">
              <div class="border w-100 pa-3">
                <div class="font-small">
                  What was done to address the incident thereafter?
                </div>
                <div class="text-caption">
                  -
                  {{
                    incident.authorities.incidentThereAfter.actionTaken || ""
                  }}
                </div>
              </div>
              <!-- <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Status</div>
                <div>
                  {{ incident.authorities.incidentThereAfter.status || "" }}
                </div>
              </div>
              <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Time</div>
                <div>
                  {{ incident.authorities.incidentThereAfter.time || "" }}
                </div>
              </div> -->
            </div>

            <div :class="$vuetify.display.mdAndUp ? 'd-flex w-100' : ''">
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-75 pa-3'
                    : 'border w-100 pa-3'
                "
              >
                <div class="font-small">
                  Were the management notified and who was notified?
                </div>
                <div class="text-caption">
                  -
                  {{
                    incident.authorities.managementNotified.actionTaken || ""
                  }}
                </div>
              </div>
              <!-- <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Status</div>
                <div>
                  {{ incident.authorities.managementNotified.status || "" }}
                </div>
              </div> -->
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                "
              >
                <div class="font-small">Time</div>
                <div class="text-caption">
                  - {{ incident.authorities.managementNotified.time || "" }}h
                </div>
              </div>
            </div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex w-100' : ''">
              <div class="border w-100 pa-3">
                <div class="font-small">How was the Incident resolved</div>
                <div class="text-caption">
                  -
                  {{ incident.authorities.incidentResolved.actionTaken || "" }}
                </div>
              </div>
              <!-- <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Status</div>
                <div>
                  {{ incident.authorities.incidentResolved.status || "" }}
                </div>
              </div>
              <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Time</div>
                <div>
                  {{ incident.authorities.incidentResolved.time || "" }}
                </div>
              </div> -->
            </div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex w-100' : ''">
              <div class="border w-100 pa-3">
                <div class="font-small">What was the cause of the Incident</div>
                <div class="text-caption">
                  -
                  {{ incident.authorities.causeOfIncident.actionTaken || "" }}
                </div>
              </div>
              <!-- <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Status</div>
                <div>
                  {{ incident.authorities.causeOfIncident.actionTaken || "" }}
                </div>
              </div>
              <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Time</div>
                <div>
                  {{ incident.authorities.causeOfIncident.time || "" }}
                </div>
              </div> -->
            </div>

            <div :class="$vuetify.display.mdAndUp ? 'd-flex w-100' : ''">
              <div class="border w-100 pa-3">
                <div class="font-small">
                  Any systems used to verify the incident?
                </div>
                <div class="text-caption">
                  -
                  {{ incident.authorities.systemUsed.actionTaken || "" }}
                </div>
              </div>
              <!-- <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Status</div>
                <div>{{ incident.authorities.systemUsed.status || "" }}</div>
              </div>
              <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Time</div>
                <div>{{ incident.authorities.systemUsed.time || "" }}</div>
              </div> -->
            </div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex w-100' : ''">
              <div class="border w-100 pa-3">
                <div class="font-small">
                  Any CCTV records or pictures taken?
                </div>
                <div class="text-caption">
                  -
                  {{ incident.authorities.cctvRecord.actionTaken || "" }}
                </div>
              </div>
              <!-- <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Status</div>
                <div>{{ incident.authorities.cctvRecord.status || "" }}</div>
              </div>
              <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Time</div>
                <div>{{ incident.authorities.cctvRecord.time || "" }}</div>
              </div> -->
            </div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex w-100' : ''">
              <div class="border w-100 pa-3">
                <div class="font-small">
                  Particulars of tenant / owner (if any)
                </div>
                <div class="text-caption">
                  -
                  {{ incident.authorities.particularsOwner.actionTaken || "" }}
                </div>
              </div>
              <!-- <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Status</div>
                <div>
                  {{ incident.authorities.particularsOwner.status || "" }}
                </div>
              </div>
              <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Time</div>
                <div>
                  {{ incident.authorities.particularsOwner.time || "" }}
                </div>
              </div> -->
            </div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex w-100' : ''">
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-75 pa-3'
                    : 'border w-100 pa-3'
                "
              >
                <div class="font-small">When was the incident resolved?</div>
                <div class="text-caption">
                  -
                  {{
                    incident.authorities.whenIncidentResolve.actionTaken || ""
                  }}
                </div>
              </div>
              <!-- <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Status</div>
                <div>
                  {{ incident.authorities.whenIncidentResolve.status || "" }}
                </div>
              </div> -->
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                "
              >
                <div class="font-small">Time</div>
                <div class="text-caption">
                  - {{ incident.authorities.whenIncidentResolve.time || "" }}h
                </div>
              </div>
            </div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex w-100' : ''">
              <div
                :class="[
                  'border pa-3',
                  $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-25',
                  'd-flex flex-column justify-center flex-fill',
                ]"
              >
                <div class="font-small">Name of Shift In charge</div>
                <div class="text-caption">
                  -
                  {{
                    incident.authorities.nameOfShiftIncharge.personInCharge ||
                    ""
                  }}
                </div>
              </div>
              <div
                :class="[
                  'border pa-3',
                  $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-25',
                  'd-flex flex-column justify-center flex-fill',
                ]"
              >
                <div class="font-small">Action Taken</div>
                <div class="text-caption">
                  -
                  {{
                    incident.authorities.nameOfShiftIncharge.actionTaken || ""
                  }}
                </div>
              </div>
              <div
                :class="[
                  'border pa-3',
                  $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-25',
                  'd-flex flex-column justify-center flex-fill',
                ]"
              >
                <div class="font-small">Shift Start</div>
                <div class="text-caption">
                  -
                  {{ incident?.authorities?.nameOfShiftIncharge?.shiftStart }}h
                </div>
              </div>
              <div
                :class="[
                  'border pa-3',
                  $vuetify.display.mdAndUp ? 'w-25' : 'w-100 h-25',
                  'd-flex flex-column justify-center flex-fill',
                ]"
              >
                <div class="font-small">Shift End</div>
                <div class="text-caption">
                  - {{ incident?.authorities?.nameOfShiftIncharge?.shiftEnd }}h
                </div>
              </div>
              <!-- <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Status</div>
                <div>
                  {{ incident.authorities.nameOfShiftIncharge.status || "" }}
                </div>
              </div>
              <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Time</div>
                <div>
                  {{ incident.authorities.nameOfShiftIncharge.time || "" }}
                </div>
              </div> -->
            </div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex w-100' : ''">
              <div class="border w-100 pa-3">
                <div class="font-small">
                  Any security implication due to the incident?
                </div>
                <div class="text-caption">
                  -
                  {{
                    incident.authorities.securityImplication.actionTaken || ""
                  }}
                </div>
              </div>
              <!-- <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Status</div>
                <div>
                  {{ incident.authorities.securityImplication.status || "" }}
                </div>
              </div>
              <div :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-25 pa-3'
                    : 'border w-100 pa-3'
                ">
                <div class="font-small">Time</div>
                <div>
                  {{ incident.authorities.securityImplication.time || "" }}
                </div>
              </div> -->
            </div>
          </div>
        </div>

        <div v-if="selectedTemplate === 4" class="px-10 pb-5">
          <div class="align-start text-h5 py-5 font-weight-medium">
            Brief Summary
          </div>
          <div class="mb-5 text-blue">
            {{ incident.briefSummary || "" }}
          </div>

          <v-row no-gutters class="my-3">
            <v-item-group selected-class="bg-primary">
              <v-row>
                <v-col
                  v-for="(attachmentItem, idx) in incident.photos"
                  :key="idx"
                  cols="12"
                  md="6"
                >
                  <v-item v-slot="{ isSelected, selectedClass, toggle }">
                    <v-card
                      :class="['d-flex align-center', selectedClass]"
                      height="200"
                      width="200"
                      dark
                      @click="openInApp(attachmentItem.id)"
                    >
                      <v-img
                        :src="`/api/files/${attachmentItem.id}`"
                        height="100%"
                        width="100%"
                      >
                        <template #placeholder>
                          <v-skeleton-loader height="100%" width="100%" />
                        </template>
                      </v-img>
                    </v-card>
                  </v-item>
                </v-col>
              </v-row>
            </v-item-group>
          </v-row>

          <v-dialog
            v-model="openImageDialog"
            width="50vw"
            @update:modelValue="imageDialogClosed"
          >
            <div style="max-height: 90vh; overflow: auto">
              <v-img :src="`/api/files/${selectedImage}`" />
            </div>
          </v-dialog>

          <div
            v-if="
              $ability.can('update', 'edit-incidents') &&
              /^(pending)$/i.test(incident.status || '')
            "
          >
            <div>Approved/Reject Incident Report</div>
            <div class="d-flex align-center">
              <v-radio-group v-model="confirmPayload.status">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-radio
                      label="Approve Incident Report"
                      value="approved"
                    ></v-radio>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-radio
                      label="Reject Incident Report"
                      value="rejected"
                    ></v-radio>
                  </v-col>
                </v-row>
              </v-radio-group>

              <v-dialog v-model="submitDialog" max-width="400" persistent>
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn
                    class="bg-blue-darken-3 align-center btn-w"
                    v-bind="activatorProps"
                    :disabled="
                      !shouldOpenDialog || confirmPayload.status === ''
                    "
                  >
                    Submit
                  </v-btn>
                </template>

                <v-card>
                  <div class="pa-10">
                    <div class="d-flex justify-center">
                      <img
                        :src="'/images/confirmPass/confirm_password.png'"
                        alt="Image"
                      />
                    </div>
                    <div class="font-weight-bold text-center my-5">
                      Confirm Password to Approve
                    </div>
                    <v-text-field
                      type="password"
                      label="Enter Password"
                      v-model="myPassword"
                    ></v-text-field>
                  </div>
                  <template v-slot:actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="submitDialog = false"> Cancel </v-btn>
                    <v-btn
                      class="bg-blue-darken-4"
                      :loading="buttonLoader"
                      @click="updateIncidentReport()"
                    >
                      Confirm
                    </v-btn>
                  </template>
                </v-card>
              </v-dialog>
            </div>
            <div v-if="confirmPayload.status === 'rejected'">
              <div>Reason of Rejection</div>
              <v-textarea
                hide-details
                placeholder="Reason for Rejection"
                v-model="confirmPayload.reasonForReject"
              ></v-textarea>
            </div>
            <div v-else-if="confirmPayload.status === 'approved'">
              <div>Remarks</div>
              <v-textarea
                hide-details
                placeholder="Remarks"
                v-model="confirmPayload.reasonForReject"
              ></v-textarea>
            </div>
          </div>
        </div>
      </v-card>
      <div v-else>
        <p>Loading...</p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure"],
});
const { $ability } = useNuxtApp();
const { getInitial, materialColors, maskText, formatDate } = useUtils();
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const userId = currentUser.value._id;
const {
  incident,
  getIncidentById,
  setIncident,
  updateIncident,
  approveOrRejectIncidentReport,
  deleteIncidentById,
  downloadDobPdf,
} = useIncident();
const { confirmSign } = useOccurrenceEntry();
const { getSitesOptionsForFiltering, mySite } = useFilter();

const id = computed(() => useRoute().params.id as string);
const selectedTemplate = ref(1);
const dataFetchedSuccessfully = ref(false);
const submitDialog = ref(false);
const deleteDialog = ref(false);
const myPassword = ref("");
const myDeletePassword = ref("");
const buttonLoader = ref(false);
const buttonDeleteLoader = ref(false);

const confirmPayload = reactive({
  _id: id.value,
  status: "",
  approvedBy: currentUser.value._id,
  reasonForReject: "",
  site: mySite.value,
});

onMounted(async () => {
  try {
    const [result] = await Promise.all([
      getIncidentById(id.value),
      getSitesOptionsForFiltering(),
    ]);
    if (result !== undefined) {
      setIncident(result);
      dataFetchedSuccessfully.value = true;
    } else {
      throw new Error("Failed to fetch incident data");
    }

    // console.log(result);
  } catch (error) {
    console.error("Error fetching incident data:", error);
    dataFetchedSuccessfully.value = false;
  }
});

function goBack() {
  useRouter().back();
}

const shouldOpenDialog = computed(() => {
  return !(
    (confirmPayload.status === "rejected" &&
      confirmPayload.reasonForReject === "") ||
    (confirmPayload.status === "approved" &&
      confirmPayload.reasonForReject === "")
  );
});

const updateIncidentReport = async () => {
  buttonLoader.value = true;
  try {
    const confirmResult = await confirmSign({
      user: userId,
      password: myPassword.value,
    });

    if (confirmResult) {
      const updatedIr: any =
        await approveOrRejectIncidentReport(confirmPayload);
      if (updatedIr) {
        setSnackbar({
          text: `${updatedIr.message}`,
          modal: true,
          type: `${updatedIr.status}`,
        });
        const result = await getIncidentById(id.value);
        setIncident(result);
        submitDialog.value = false;
        buttonLoader.value = false;
      }
    }
  } catch (error) {
    setSnackbar({
      text: "Failed to update incident report.",
      modal: true,
      type: "error",
    });
  } finally {
    buttonLoader.value = false;
  }
};

const deleteIncidentReport = async () => {
  buttonDeleteLoader.value = true;
  try {
    const confirmResult = await confirmSign({
      user: userId,
      password: myDeletePassword.value,
    });
    if (confirmResult) {
      const updatedIr = await deleteIncidentById(
        id.value,
        incident.value.status,
      );
      if (updatedIr) {
        setSnackbar({
          text: "Successfully deleted",
          modal: true,
          type: "success",
        });
        deleteDialog.value = false;
        buttonDeleteLoader.value = false;
        await navigateTo({ path: "/incidents", query: { site: mySite.value } });
      }
    }
  } catch (error) {
    setSnackbar({ text: "Failed to confirm", modal: true, type: "error" });
  } finally {
    buttonDeleteLoader.value = false;
  }
};

const selectTemplate = (template: number) => {
  selectedTemplate.value = template;
};

const isDownloadingPdf = ref(false);
async function onDownloadDobPdf(id: string) {
  try {
    isDownloadingPdf.value = true;

    const currentUrl = `/incidents/${id}/download`;
    await downloadDobPdf(currentUrl);
  } finally {
    isDownloadingPdf.value = false;
  }
}

function imageDialogClosed() {
  selectedImage.value = "";
}

const openImageDialog = ref(false);
const selectedImage = ref("");

function openInApp(id: string) {
  openImageDialog.value = true;
  selectedImage.value = id;
}

function downloadFile(id: string, fileName: string) {
  const link = document.createElement("a");
  link.href = `/api/files/${id}`;
  link.download = fileName;

  // Append the anchor to the body
  document.body.appendChild(link);

  // Trigger a click event on the anchor
  link.click();

  // Remove the anchor from the body
  document.body.removeChild(link);
}
</script>

<style scoped>
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
</style>
