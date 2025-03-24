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

            <!-- <div class="d-flex ga-5" v-if="$vuetify.display.mdAndUp">
              <div v-if="!/^Approved$/i.test(item.status || '')">
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
              </div>
              <v-btn
                v-if="/^Approved$/i.test(item.status || '')"
                class="bg-light-blue-darken-2 text-white py-6 px-5 text-center d-flex align-center justify-center"
                :loading="isDownloading"
                @click.stop="onDownloadPdf(item as unknown as TPetRecords)"
              >
                <v-icon class="mr-1">mdi-download</v-icon>
                Download PDF
              </v-btn>
            </div> -->
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
              <div class="text-h6">Remarks (Optional)</div>
              <div class="text-caption">{{ item.reason }}</div>
            </div>
            <div class="pa-4" v-else-if="/^Rejected$/i.test(item.status || '')">
              <div class="text-h6">Reason:</div>
              <div class="text-caption">{{ item.reason }}</div>
            </div>
            <div
              class="pa-4"
              v-else-if="/^Resubmission$/i.test(item.status || '')"
            >
              <div class="text-h6">Reason:</div>
              <div class="text-caption">{{ item.reason }}</div>
            </div>
          </div>

          <div class="px-10">
            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start pt-6 pb-2 subheader-class">
                Unit owner's particulars
              </div>

              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Name</div>
                  <div>{{ item.nameOfOwner }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Unit No.</div>
                  <div>
                    {{ item.unitNumber }}
                  </div>
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Contact No.</div>
                  <div>{{ item.ownerContactNumber }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Office No.</div>
                  <div>{{ item.ownerOfficeNumber }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Mobile No.</div>
                  <div>{{ item.ownerMobileNumber }}</div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="py-3 d-flex" v-if="$vuetify.display.mdAndUp">
                <div class="align-start pt-6 pb-2 subheader-class">
                  Contractor's particulars
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Company Name</div>
                  <div>{{ item.companyName }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Registration No.</div>
                  <div>
                    {{ item.registrationNumber }}
                  </div>
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-100 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Address</div>
                  <div>{{ item.contractorAddress }}</div>
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Person in charge</div>
                  <div>{{ item.contractorPersonInCharge }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Office No.</div>
                  <div>
                    {{ item.contractorOfficeNumber }}
                  </div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Mobile No.</div>
                  <div>{{ item.contractorContactNumber }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Home No.</div>
                  <div>
                    {{ item.contractorHomePhone }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start pt-6 pb-2 subheader-class">
                Summary of Proposed Renovation / Addition & Alteration Works
                (Attach separate sheet if applicable)
              </div>

              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Start Date</div>
                  <div>{{ formatStandardDate(item.startDate) }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">End Date</div>
                  <div>
                    {{ formatStandardDate(item.endDate) }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start pt-6 pb-2 subheader-class">
                Hacking Period
              </div>

              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">From</div>
                  <div>{{ formatStandardDate(item.hackingPeriodFrom) }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">To</div>
                  <div>
                    {{ formatStandardDate(item.hackingPeriodTo) }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="my-5">
              <div class="mb-3 text-body">
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
                  In applying for approval, the Subsidiary Proprietor (Unit
                  Owner) and Contractor undertake to abide by and be subjected
                  to the General Rules & Regulations on Renovation / Addition &
                  Alteration Works as contained in the House Rules.
                </span>
              </div>
              <div class="text-body">
                <v-container>
                  <v-row class="text-h6" align="start" justify="space-between">
                    <v-col cols="auto" class="pa-0">
                      <v-icon icon="mdi-check-circle" color="green" />
                    </v-col>
                    <v-col class="pa-0 ml-10">
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
                        I / We agree to provide my personal information as
                        indicated and understand that it is solely to be used by
                        the Management for management purposes only. The
                        personal data shall not be used for other purposes
                      </span>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="my-5">
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">
                    Signature of Subsidiary Proprietors
                  </div>
                  <div>
                    <v-img
                      :src="item.signatureOfSubsidiaryProprietors"
                      alt="Signature"
                      class="custom-height-md"
                    />
                  </div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Signature of Contractor</div>
                  <div>
                    <v-img
                      :src="item.signatureOfContractor"
                      alt="Signature"
                      class="custom-height-md"
                    />
                  </div>
                  <div></div>
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Signature Date</div>
                  <div>
                    {{ formatStandardDate(item.signatureOfSubsidiaryDate) }}
                  </div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Signature Date</div>
                  <div>
                    {{ formatStandardDate(item.signatureOfContractorDate) }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start pt-6 pb-2 subheader-class">
                For management use:
              </div>

              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div>
                    <v-text-field
                      v-model="item.processedByName"
                      :rules="[requiredInput]"
                      label="Processed By *"
                      density="comfortable"
                      variant="solo-filled"
                      hide-details
                      :disabled="
                        Boolean(item.status && /approve/i.test(item.status))
                      "
                    />
                  </div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div>
                    <v-date-input
                      v-model="item.workToBeCompletedDate"
                      :rules="[requiredInput]"
                      label="Work to be completed date *"
                      density="comfortable"
                      variant="solo-filled"
                      :min="new Date()"
                      hide-details
                      :disabled="
                        Boolean(item.status && /approve/i.test(item.status))
                      "
                    />
                  </div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-33 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div>
                    <v-text-field
                      v-model="item.renovationDeposit"
                      :rules="[requiredInput]"
                      label="Renovation deposit of *"
                      density="comfortable"
                      variant="solo-filled"
                      hide-details
                      :disabled="
                        Boolean(item.status && /approve/i.test(item.status))
                      "
                    />
                  </div>
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-100 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div>
                    <v-text-field
                      v-model="item.address"
                      :rules="[requiredInput]"
                      label="Address *"
                      density="comfortable"
                      variant="solo-filled"
                      hide-details
                      :disabled="
                        Boolean(item.status && /approve/i.test(item.status))
                      "
                    />
                  </div>
                </div>
              </div>
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div>
                    <v-text-field
                      v-model="item.personInCharge"
                      :rules="[requiredInput]"
                      label="Person in charge *"
                      density="comfortable"
                      variant="solo-filled"
                      hide-details
                      :disabled="
                        Boolean(item.status && /approve/i.test(item.status))
                      "
                    />
                  </div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div>
                    <v-text-field
                      v-model="item.officeNumber"
                      :rules="[requiredInput]"
                      label="Office No. *"
                      density="comfortable"
                      variant="solo-filled"
                      hide-details
                      :disabled="
                        Boolean(item.status && /approve/i.test(item.status))
                      "
                    />
                  </div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div>
                    <v-text-field
                      v-model="item.mobileNumber"
                      :rules="[requiredInput]"
                      label="Mobile No. *"
                      density="comfortable"
                      variant="solo-filled"
                      hide-details
                      :disabled="
                        Boolean(item.status && /approve/i.test(item.status))
                      "
                    />
                  </div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-25 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div>
                    <v-text-field
                      v-model="item.homePhone"
                      :rules="[requiredInput]"
                      label="Home Phone *"
                      density="comfortable"
                      variant="solo-filled"
                      hide-details
                      :disabled="
                        Boolean(item.status && /approve/i.test(item.status))
                      "
                    />
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start pt-6 pb-2 subheader-class">
                (Cheque payable to “{{ item.siteName }}” or the MCST Plan No.
                [upon constitution]).
              </div>

              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="label-class mr-4">Management</div>
                  <div>{{ item.siteName }}</div>
                </div>
                <div
                  class="bg-grey-lighten-3"
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div>
                    <v-text-field
                      v-model="item.chequeNumber"
                      :rules="[requiredInput]"
                      label="By Cheque - Bank / Cheque No *"
                      density="comfortable"
                      variant="solo-filled"
                      hide-details
                      :disabled="
                        Boolean(item.status && /approve/i.test(item.status))
                      "
                    />
                  </div>
                </div>
              </div>
            </div>

            <v-divider></v-divider>

            <div class="mb-5">
              <div class="align-start text-body-1 pt-6 pb-2 font-weight-bold">
                Note:
              </div>

              <div class="mb-3 text-body">
                <span
                  v-if="
                    configForm &&
                    configForm.thirdLabel &&
                    configForm.thirdLabel.trim() !== `<p></p>`.trim()
                  "
                  v-html="configForm.thirdLabel"
                >
                </span>
                <span v-else>
                  1. The submission by Subsidiary Proprietor(s) to the
                  Management for the “Application for Renovation / Addition &
                  Alteration Works” shall not be construed as exemption from
                  compliance with the building regulations/laws or exemption
                  from obtaining approval from other relevant authorities.
                </span>
              </div>
              <div class="text-body">
                <span
                  v-if="
                    configForm &&
                    configForm.fourthLabel &&
                    configForm.fourthLabel.trim() !== `<p></p>`.trim()
                  "
                  v-html="configForm.fourthLabel"
                >
                </span>
                <span v-else>
                  2. Subsidiary Proprietor(s) shall consult or liaise directly
                  and/or obtain necessary approvals from the relevant
                  authorities before submitting this application to the
                  Management.
                </span>
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

              <!-- STEPPER -->
              <section>
                <ul class="stepper-container">
                  <li>
                    <p class="stepper-number">1</p>
                    <p>Application For Renovation</p>
                  </li>
                  <li>
                    <p class="stepper-number">2</p>
                    <p>Letter of undertaking & indemnity</p>
                  </li>
                  <li>
                    <p class="stepper-number">3</p>
                    <p>Refund of deposit</p>
                  </li>
                </ul>
              </section>

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
const { item, isLoading, setItem, getItemById } = useRenovation();
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
    item.value.processedByName = userFullName.value;
    item.value.workToBeCompletedDate = new Date();
    await getSelectedFormByType("Renovation Form");
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  }
});

const onUpdateItem = async () => {
  let payload = {
    status: statusSelection.value,
    reason: item.value.reason,
    approvedBy: currentUser.value._id,
    approvedName: userFullName.value,
  } as TUpdateFormStatus;
  if (/renovation/i.test(item.value.typeOfForm)) {
    payload = {
      ...payload,
      processedByName: item.value.processedByName,
      workToBeCompletedDate: item.value.workToBeCompletedDate,
      renovationDeposit: item.value.renovationDeposit,
      address: item.value.address,
      personInCharge: item.value.personInCharge,
      officeNumber: item.value.officeNumber,
      mobileNumber: item.value.mobileNumber,
      homePhone: item.value.homePhone,
      chequeNumber: item.value.chequeNumber,
    } as TUpdateFormStatus;
  }
  await updateFormStatus(routeId.value, payload);
  await router.replace({ name: "forms" });
  submitDialog.value = false;
};

const onDownloadPdf = async (item: TPetRecords) => {
  const { _id, typeOfForm } = item;
  const id = _id as string;
  let currentUrl = "";
  try {
    isDownloading.value = true;
    currentUrl = `/forms/${id}/download/renovation?site=${mySite.value}`;
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
.stepper-container {
  display: flex;
  margin-bottom: 30px;
  width: 100%;
  overflow: hidden;
}

.stepper-container li {
  padding: 20px 10px;
  border-bottom: 2px solid #b9b8c0;
  text-align: center;
  width: 33.33%;
  display: flex;
  align-items: center;
}

.stepper-container li:first-child {
  border-bottom: 2px solid #1867c0;
}

.stepper-number {
  background: #b9b8c0;
  width: fit-content;
  padding: 4px 11px;
  border-radius: 100%;
  margin-right: 7px;
  color: #fff;
}

.stepper-container li:first-child .stepper-number {
  background: #1867c0;
}
</style>
