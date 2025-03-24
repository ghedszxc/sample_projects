<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card width="100%" elevation="3" height="100%" :loading="isUnitsLoaded">
        <v-card-title>
          <back-button></back-button>
          <span class="font-weight-bold ml-2 text-capitalize"
            >Application for electronic access card form</span
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters justify="center" class="pa-8">
            <v-col cols="8">
              <v-row>
                <v-col cols="12"
                  ><span class="font-weight-bold text-body-1"
                    >Application for electronic access card</span
                  ></v-col
                >

                <v-col cols="12" sm="6">
                  <v-text-field
                    readonly
                    hide-details
                    clearable
                    append-inner-icon="mdi-calendar"
                  >
                    <template v-slot:label>
                      Date of Birth
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      To: The Management,
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12"><v-divider></v-divider></v-col>
                <v-col cols="12"
                  ><span class="text-body-1 font-weight-bold"
                    >To be completed by unit owner</span
                  ></v-col
                >

                <v-col cols="12" sm="6">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      I / We
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      being the owner of Unit
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12"
                  ><span class="text-body-1"
                    >of {{ "--" }} hereby submit my / our application for
                    number/s of
                  </span></v-col
                >

                <v-col cols="12" sm="6">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      Access Card.
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      Owner's NRIC No.
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      Home Phone
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      (R):
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12"><v-divider></v-divider></v-col>
                <v-col cols="12"
                  ><span class="text-body-1 font-weight-bold"
                    >To be completed for nominee (if applicable)</span
                  ></v-col
                >

                <v-col cols="12" sm="6">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      I / We
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      being the owner of Unit
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12"
                  ><span class="text-body-1"
                    >of {{ "--" }} hereby nominate my immediate family / tenant
                    whose name is given below for the application for (Access
                    Card Type) number/s of Access Card
                  </span></v-col
                >
                <v-col cols="12" sm="6">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      Access Card.
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12"><v-divider></v-divider></v-col>
                <v-col cols="12"
                  ><span class="text-body-1 font-weight-bold"
                    >If the Nominee is a Tenant, please state:</span
                  ></v-col
                >
                <v-col cols="12" sm="4">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      Name of Tenant
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    readonly
                    hide-details
                    clearable
                    append-inner-icon="mdi-calendar"
                  >
                    <template v-slot:label>
                      Commencement of Tenancy
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    readonly
                    hide-details
                    clearable
                    append-inner-icon="mdi-calendar"
                  >
                    <template v-slot:label>
                      Expiry of Tenancy
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      Tenant’s I/C or Passport No.
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      Tenant’s Contact No.
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      (Hp)
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      (R)
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12"><v-divider></v-divider></v-col>
                <v-col cols="12"
                  ><span class="text-body-1 font-weight-bold"
                    >Rules and regulations</span
                  ></v-col
                >
                <v-col cols="12">
                  <div class="text-body-2">
                    <p class="mb-3">
                      A. The electronic access card is used to access the side
                      gate, lift lobby and common facilities (where applicable)
                      within the development.
                    </p>

                    <p class="mb-3">
                      B. Additional cards above the allocated number (as
                      distributed at time of vacant possession) will be charged
                      at S$50.00 per card (subject to availability). Units
                      requiring extra cards will be considered on a case-by-case
                      basis and documentary proof is required to prove that the
                      applicants are residing in the Development.
                    </p>

                    <p class="mb-3">
                      C. The replacement of lost / damaged card is charged at
                      S$50.00 per card (non-refundable). All lost card/s must be
                      reported to the Management immediately.
                    </p>

                    <p class="mb-3">
                      D. All residents must exercise due care and diligence in
                      the maintenance of the access card to keep it in good
                      working condition. Keep all cards away from any magnetic
                      device/fields and place them in a cool dry place when not
                      in use.
                    </p>

                    <p class="mb-3">
                      E. The Management reserves the right to request for
                      documentary proof to prove that the applicant/s is/are
                      residing in the development before issuing the access
                      card/s.
                    </p>

                    <p class="mb-3">
                      F. Upon termination of lease, tenants must surrender the
                      access card/s to the Management before moving out of the
                      estate.
                    </p>

                    <p class="mb-3">
                      G. When the owner sells/lease his/her unit, he/she must
                      surrender the access card/s to the Management prior to
                      moving out of the estate.
                    </p>

                    <p class="mb-3">
                      H. The Management, personnel or any appointed
                      representative of the Managing Agent may require the
                      person/s using the access card to identify themselves.
                    </p>

                    <p class="mb-3">
                      I. The access card/s will only be issued to residents
                      living in Royal Palms. Visitors at the Development will
                      not be eligible for an access card. The Management
                      reserves the right to reject the application if
                      documentary proof of the intended access cardholder is not
                      fully furnished.
                    </p>

                    <p class="mb-3">
                      J. The Management reserves the right to change any rules
                      and regulations.
                    </p>

                    <p class="mb-3">
                      K. All cheques are to be issued in favour of “Royal Palms”
                      or the MCST Plan No. (upon constitution).
                    </p>

                    <p class="mb-3">
                      I / We agree to provide my personal information as
                      indicated and understand that it is solely to be used by
                      the Management for management purposes only. The personal
                      data shall not be used for other purposes. (Change Label)
                    </p>
                  </div>
                </v-col>
                <v-col cols="12"><v-divider></v-divider></v-col>
                <v-col cols="12" sm="4">
                  <v-textarea rows="3" density="compact" hide-details>
                    <template v-slot:label>
                      Signature
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-col cols="4" class="pl-0"
                    ><v-text-field
                      readonly
                      hide-details
                      clearable
                      append-inner-icon="mdi-calendar"
                    >
                      <template v-slot:label>
                        Signature Date
                        <span class="text-red font-weight-bold">*</span>
                      </template>
                    </v-text-field></v-col
                  >
                </v-col>
                <v-col cols="12"><v-divider thickness="4"></v-divider></v-col>
                <v-col cols="12"
                  ><span class="text-body-1 font-weight-bold"
                    >For management use:</span
                  ></v-col
                >
                <v-col cols="12" sm="3">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      Application Fees Received: *
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      [ ] By Bank / Cheque No:*
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field density="compact" hide-details>
                    <template v-slot:label>
                      Approved By
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    readonly
                    hide-details
                    clearable
                    append-inner-icon="mdi-calendar"
                  >
                    <template v-slot:label>
                      Date
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>

                <v-row justify="end" class="mt-4 px-2">
                  <v-col cols="12" md="3">
                    <v-btn
                      color="blue-darken-3"
                      block
                      variant="flat"
                      size="small"
                      style="height: 40px"
                      >Submit</v-btn
                    >
                  </v-col>
                </v-row>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
