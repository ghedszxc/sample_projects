<template>
  <v-card :class="`my-6 ${$vuetify.display.mdAndUp ? 'mx-12' : 'mx-2'}`">
    <v-card-title
      :class="`text-h6 font-weight-bold ${$vuetify.display.mdAndUp ? 'pl-6 pt-4' : 'pl-3 mb-4'}`"
    >
      Settings
    </v-card-title>
    <v-card-text :class="{ 'mt-12': $vuetify.display.mdAndUp }">
      <v-row>
        <v-col cols="12" lg="8" offset-lg="2">
          <v-row>
            <v-col cols="12">
              <span class="text-h6 font-weight-bold">Entry Pass Settings</span>
            </v-col>

            <v-col cols="12">
              <v-toolbar color="transparent">
                <span class="text-h6">Physical Pass</span>
                <v-spacer></v-spacer>
                <v-switch color="green"></v-switch>
              </v-toolbar>
              <div
                :class="{ 'pr-12': $vuetify.display.mdAndUp }"
                class="text-grey text-body-1"
              >
                A Physical Pass Card is a tangible identification or access card
                used for entry and verification purposes at a specific site or
                property. Its primary functions include granting authorized
                access, enhancing security, and tracking attendance or movement.
              </div>
              <v-divider class="mt-3"></v-divider>
            </v-col>

            <v-col cols="12">
              <v-toolbar color="transparent">
                <span class="text-h6">NFC Pass</span>
                <v-spacer></v-spacer>
                <v-switch color="green"></v-switch>
              </v-toolbar>
              <div
                :class="{ 'pr-12': $vuetify.display.mdAndUp }"
                class="text-grey text-body-1"
              >
                NFC Card Pass is a type of access card that uses Near Field
                Communication (NFC) technology to enable secure and convenient
                entry to a site or property. This technology facilitates
                wireless communication between the card and an NFC reader when
                they are placed in close proximity (typically within 4 cm)
              </div>
              <v-divider class="mt-3"></v-divider>
            </v-col>

            <v-col cols="12">
              <v-list>
                <v-list-item class="text-grey text-body-1">
                  If the Physical Pass is enabled, the NFC Pass will
                  automatically be disabled to prevent conflicts and ensure a
                  seamless access control system.

                  <template v-slot:prepend>
                    <v-icon size="40px" color="primary">mdi-information</v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-col>

            <v-col cols="12">
              <v-toolbar color="transparent">
                <span class="text-h6">QR Pass</span>
                <v-spacer></v-spacer>
                <v-switch color="green"></v-switch>
              </v-toolbar>
              <div
                :class="{ 'pr-12': $vuetify.display.mdAndUp }"
                class="text-grey text-body-1"
              >
                QR Code Pass is a type of digital or physical pass that uses a
                Quick Response (QR) code as a secure and scannable identifier to
                grant access to a site, facility, or event. It combines
                convenience with modern technology, often replacing traditional
                cards or physical passes.
              </div>
              <v-divider class="mt-3"></v-divider>
            </v-col>

            <v-col cols="12">
              <v-toolbar color="transparent">
                <span class="text-h6">Key Pass</span>
                <v-spacer></v-spacer>
                <v-switch color="green"></v-switch>
              </v-toolbar>
              <div
                :class="{ 'pr-12': $vuetify.display.mdAndUp }"
                class="text-grey text-body-1"
              >
                Key Pass for Contractors is a specific type of access credential
                provided exclusively to contractors to regulate and monitor
                their entry into a site or facility. It ensures that contractors
                have controlled access to designated areas while maintaining the
                site's security and integrity.
              </div>
              <v-divider class="mt-3"></v-divider>
            </v-col>
          </v-row>
        </v-col>

        <!-- <v-col align-self="start" style="border: 1px solid red">
          <v-sheet class="pa-2 ma-2"> .align-self-start </v-sheet>
        </v-col> -->
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts"></script>
