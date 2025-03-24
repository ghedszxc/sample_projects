<template>
  <v-row no-gutters class="pa-md-8 pa-4">
    <v-col cols="12 " v-if="status === 'success'">
      <v-card elevation="3" class="d-flex flex-column">
        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12" class="d-flex ga-4 items-center pa-4">
                <v-btn
                  fav
                  density="compact"
                  icon="mdi-arrow-left"
                  variant="text"
                  class="mb-1"
                  @click="useRouter().push('/visitors')"
                />
                <h1 class="titleDesign font-weight-bold text-h6">
                  Visitor's Information
                </h1>
              </v-col>
              <v-divider></v-divider>

              <v-row class="pa-0 position-relative custom-background">
                <div class="background-wrapper"></div>
                <v-col cols="12" class="pa-6 mb-7">
                  <v-row>
                    <v-col cols="12" class="d-flex justify-center">
                      <v-card
                        elevation="3"
                        class="rounded-lg"
                        width="100%"
                        height="100%"
                        :class="$vuetify.display.smAndDown ? ' ' : 'mx-15'"
                      >
                        <v-row no-gutters>
                          <v-col :cols="$vuetify.display.xs ? 9 : 11">
                            <h3
                              class="titleDesign pb-1 font-weight-bold text-h6 pa-4 pl-8"
                            >
                              Visitor Information
                            </h3>
                          </v-col>
                          <v-col
                            :cols="$vuetify.display.xs ? 3 : 1"
                            class="d-flex justify-center align-center pt-2"
                          >
                            <v-btn
                              @click="useRouter().push('/visitors')"
                              variants="flat"
                              density="compact"
                              icon="mdi-close-circle-outline"
                              size="x-large"
                            ></v-btn>
                          </v-col>
                        </v-row>

                        <v-row no-gutters class="pa-6">
                          <v-col :cols="$vuetify.display.mdAndDown ? 12 : 6">
                            <v-col cols="12" class="py-0">
                              <v-text-field
                                label="Name"
                                density="compact"
                                style="margin-bottom: 10px"
                                hide-details
                                readonly
                                v-model="fullName"
                                variant="solo"
                              ></v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              class="text-grey text-caption py-0"
                            >
                              NRIC/Passport/ID No.
                            </v-col>
                            <v-col cols="12" class="pt-0 pb-0">
                              <v-text-field
                                v-if="!visitorInfo.actualCheckIn"
                                v-model="visitorInfo.nric"
                                density="compact"
                                hide-details
                                clearable
                              >
                              </v-text-field>

                              <!-- {{
                                visitorInfo.actualCheckIn
                                  ? visitorInfo.nric
                                  : null
                              }} -->
                              <v-text-field
                                class="py-0"
                                v-else
                                density="compact"
                                style="margin-bottom: 10px"
                                hide-details
                                readonly
                                v-model="visitorInfoNric"
                                variant="solo"
                              ></v-text-field>
                            </v-col>

                            <!-- next -->

                            <v-col
                              cols="12"
                              class="text-grey text-caption py-0"
                            >
                              Vehicle Number
                              <span>(Optional)</span>
                            </v-col>
                            <!-- <v-col
                              v-if="!visitorInfo.actualCheckIn"
                              cols="12"
                              class="text-caption font-weight-bold py-0"
                            >
                              <v-text-field
                                v-if="!visitorInfo.actualCheckIn"
                                v-model="visitorInfo.plateNumber"
                                density="compact"
                                hide-details
                                clearable
                                required
                              >
                              </v-text-field>

                              <v-text-field
                                v-else
                                density="compact"
                                style="margin-bottom: 10px"
                                hide-details
                                readonly
                                v-model="visitorInfoPlateNumber"
                                variant="solo"
                              ></v-text-field>
                      
                            </v-col> -->
                            <v-col cols="12" class="pt-3">
                              <v-text-field
                                v-if="!visitorInfo.actualCheckIn"
                                v-model="visitorInfo.plateNumber"
                                density="compact"
                                hide-details
                                clearable
                                required
                              >
                                <template v-slot:label>
                                  <span class="text-1-4rem">
                                    Vehicle Number</span
                                  >
                                  <span class="text-1-4rem"> (Optional)</span>
                                </template>
                              </v-text-field>
                              <v-text-field
                                v-else
                                density="compact"
                                style="margin-bottom: 10px"
                                hide-details
                                readonly
                                v-model="visitorInfoPlateNumber"
                                variant="solo"
                              ></v-text-field>
                            </v-col>
                            <!-- out -->
                            <v-col cols="12" class="pb-0 pt-2">
                              <v-text-field
                                variant="solo"
                                label="Type"
                                density="compact"
                                style="margin-bottom: 10px"
                                hide-details
                                readonly
                                v-model="visitorInfo.residentGuestType"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" class="pt-0 pb-0">
                              <v-text-field
                                variant="solo"
                                label="Phone"
                                density="compact"
                                style="margin-bottom: 10px"
                                hide-details
                                readonly
                                v-model="visitorInfo.phoneNumber"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" class="py-0">
                              <v-textarea
                                v-model="visitorInfo.remarks"
                                readonly
                                label="  Purpose of Visit"
                                row-height="25"
                                rows="3"
                                variant="solo"
                                auto-grow
                                hide-details
                                shaped
                              ></v-textarea>
                            </v-col>
                            <v-col cols="12" class="pt-2 pb-0">
                              <v-text-field
                                variant="solo"
                                label="Location"
                                density="compact"
                                style="margin-bottom: 10px"
                                hide-details
                                readonly
                                v-model="location"
                              ></v-text-field>
                            </v-col>
                          </v-col>
                          <v-col :cols="$vuetify.display.mdAndDown ? 12 : 6">
                            <v-card
                              v-if="
                                visitorInfo.actualCheckIn
                                  ? visitorInfo.visitorPass &&
                                    Object.keys(visitorInfo.visitorPass)
                                      .length > 0
                                  : true
                              "
                              elevation="3"
                              class="rounded-lg"
                            >
                              <v-col cols="12">
                                <h3
                                  class="titleDesign pb-1 font-weight-bold text-h6"
                                >
                                  Visitor pass
                                </h3>
                              </v-col>

                              <v-col cols="12">
                                <v-autocomplete
                                  v-if="!visitorInfo.actualCheckIn"
                                  v-model="visitor.visitorPass"
                                  :items="passList"
                                  item-title="prefixAndName"
                                  item-value="_id"
                                  density="comfortable"
                                  hide-details
                                  :disabled="isProgress"
                                  :loading="isPassListLoading"
                                  clearable
                                  @update:search="(query: string) => search(query)"
                                >
                                  <template v-slot:label>
                                    Select Pass
                                  </template>
                                  <template v-slot:append-item>
                                    <div v-intersect="endIntersect" />
                                  </template>
                                </v-autocomplete>

                                <div v-else>
                                  <v-text-field
                                    label=""
                                    density="compact"
                                    style="margin-bottom: 10px"
                                    hide-details
                                    readonly
                                    v-model="
                                      visitorInfo.visitorPass.prefixAndName
                                    "
                                    variant="solo"
                                  ></v-text-field>

                                  <v-combobox
                                    v-if="!visitorInfo.actualCheckOut"
                                    class="pb-2"
                                    hide-details
                                    label="Pass Status"
                                    :items="[
                                      'Damage',
                                      'Lost',
                                      'Returned',
                                      'Not Returned',
                                    ]"
                                    v-model="visitorInfo.visitorPass.status"
                                    variant="outlined"
                                    :disabled="!visitorInfo.visitorPass.keyId"
                                  ></v-combobox>

                                  <v-text-field
                                    v-else
                                    label="Pass Status"
                                    density="compact"
                                    style="margin-bottom: 10px"
                                    hide-details
                                    readonly
                                    v-model="visitorInfo.visitorPass.status"
                                    variant="solo"
                                  ></v-text-field>

                                  <v-textarea
                                    v-if="
                                      !/^(Returned|Not Returned)$/i.test(
                                        visitorInfo.visitorPass.status,
                                      ) && visitorInfo.visitorPass.status
                                    "
                                    label="Remarks"
                                    :variant="
                                      visitorInfo.actualCheckOut
                                        ? 'solo'
                                        : 'outlined'
                                    "
                                    hide-details
                                    v-model="selectedPassRemarks"
                                    :readonly="visitorInfo.actualCheckOut"
                                  ></v-textarea>
                                </div>
                              </v-col>
                              <v-col cols="12">
                                <v-btn
                                  color="blue-darken-3"
                                  block
                                  variant="flat"
                                  size="small"
                                  style="height: 40px"
                                  @click="openDialog"
                                >
                                  <v-icon v-if="$vuetify.display.lgAndDown"
                                    >mdi-qrcode-scan</v-icon
                                  >
                                  <span v-if="$vuetify.display.smAndDown">
                                    Scan QR Code</span
                                  >
                                  <span v-if="$vuetify.display.mdAndUp">
                                    Scan QR Code</span
                                  >
                                </v-btn>
                              </v-col>
                            </v-card>

                            <v-row no-gutters class="pt-2">
                              <v-col cols="6" class="pr-1">
                                <v-card
                                  elevation="3"
                                  height="100%"
                                  width="100%"
                                >
                                  <v-col
                                    cols="12"
                                    class="d-flex justify-center pb-0"
                                  >
                                    <span
                                      class="text-h6 font-weight-bold d-flex text-center"
                                      style="color: #4caf50"
                                    >
                                      {{
                                        visitorInfo.actualCheckIn
                                          ? standardFormatDateTime(
                                              visitorInfo.actualCheckIn,
                                            )
                                          : "N/A"
                                      }}</span
                                    >
                                  </v-col>
                                  <v-col cols="12" class="d-flex justify-center"
                                    >Actual Check In</v-col
                                  >
                                </v-card>
                              </v-col>
                              <v-col cols="6" class="pl-1">
                                <v-card
                                  elevation="3"
                                  height="100%"
                                  width="100%"
                                >
                                  <v-col
                                    cols="12"
                                    class="d-flex justify-center pb-0"
                                  >
                                    <span
                                      class="text-h6 font-weight-bold d-flex text-center"
                                      style="color: red"
                                    >
                                      {{
                                        visitorInfo.actualCheckOut
                                          ? standardFormatDateTime(
                                              visitorInfo.actualCheckOut,
                                            )
                                          : "N/A"
                                      }}
                                    </span>
                                  </v-col>
                                  <v-col cols="12" class="d-flex justify-center"
                                    >Actual Check Out</v-col
                                  >
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                        <v-card-actions
                          class="px-6"
                          v-if="
                            !(
                              visitorInfo.actualCheckIn &&
                              visitorInfo.actualCheckOut
                            )
                          "
                        >
                          <v-btn
                            v-if="
                              !visitorInfo.actualCheckIn &&
                              !visitorInfo.actualCheckOut
                            "
                            color="green-darken-1"
                            block
                            variant="flat"
                            size="small"
                            style="height: 40px"
                            :loading="loading"
                            @click="updateVisitorInfo('check-in')"
                          >
                            Check In
                          </v-btn>

                          <v-btn
                            v-if="
                              visitorInfo.actualCheckIn &&
                              !visitorInfo.actualCheckOut
                            "
                            color="red-darken-1"
                            block
                            variant="flat"
                            size="small"
                            style="height: 40px"
                            @click="updateVisitorInfo('check-out')"
                            :loading="loading"
                          >
                            Check Out
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <v-col
      v-else-if="status === 'error' && showErrorStatus"
      col="12"
      class="text-h2 font-weight-bold text-center"
    >
      <div class="mb-5">{{ errorMessage }}</div>
    </v-col>
    <v-dialog
      v-model="showCameraDialog"
      transition="dialog-bottom-transition"
      width="800"
      max-width="800"
      persistent
      @after-enter="startCamera"
    >
      <v-container
        class="d-flex justify-center"
        max-height="90vh"
        width="800"
        max-width="800"
      >
        <!-- QR code reader container -->
        <v-card elevation="2" class="d-flex flex-column align-center pa-2">
          <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
            <v-card-title class="text-h5"> Take a Picture </v-card-title>
            <v-spacer></v-spacer>
            <v-btn
              color="grey-darken-1"
              icon="mdi-close"
              @click="closeCameraDialog()"
            ></v-btn>
          </v-toolbar>

          <div
            id="reader"
            class="d-flex justify-center align-center"
            style="
              position: relative;
              width: 500px;
              min-width: 400px;
              height: 400px;
            "
          >
            <video
              ref="video"
              style="flex: 1; height: 400px; min-width: 300px"
              class="video-shutter"
              autoplay
            ></video>
            <canvas
              ref="canvas"
              style="flex: 1; height: 400px; min-width: 300px; display: none"
            ></canvas>
            <div ref="flash" class="flash-effect"></div>
          </div>

          <v-row align="center" justify="center">
            <v-col cols="6"
              ><v-btn color="primary" icon class="mt-4" @click="switchCamera()">
                <v-icon>mdi-camera-switch</v-icon>
              </v-btn></v-col
            >
            <v-col cols="6"
              ><v-btn
                color="secondary"
                icon
                class="mt-4"
                @click="captureImageFromCamera()"
              >
                <v-icon large>mdi-camera-outline</v-icon>
              </v-btn></v-col
            >
          </v-row>
        </v-card>
      </v-container>
    </v-dialog>

    <v-dialog
      v-model="showQRdialog"
      transition="dialog-bottom-transition"
      width="700"
      max-width="700"
      persistent
      @after-enter="startScanner"
    >
      <v-container class="d-flex justify-center" max-height="90vh">
        <!-- QR code reader container -->
        <v-card
          elevation="2"
          class="d-flex flex-column align-center pa-2 w-100 h-100"
          :style="
            $vuetify.display.xs
              ? 'max-width: 90vw;'
              : $vuetify.display.sm
                ? 'max-width: 80vw;'
                : 'max-width: 100%;'
          "
        >
          <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
            <v-card-title class="text-h5"> Scan QR Code </v-card-title>
            <v-spacer></v-spacer>
            <v-btn
              color="grey-darken-1"
              icon="mdi-close"
              @click="closeDialog()"
            ></v-btn>
          </v-toolbar>

          <div
            id="reader"
            class="d-flex justify-center align-center w-100 h-100"
            style="height: calc(100vh - 64px)"
          >
            <!-- The QR code scanner box -->
            <!-- This is where the QR code scanner will be displayed -->
          </div>
          <!-- Show Error Messages -->
          <div v-if="showNotFoundMessage">
            <p>{{ errorMessage }}</p>
          </div>
          <!-- Switch camera button inside the reader box -->
          <v-btn
            color="primary"
            icon
            class="mt-4"
            @click="switchCameraQRCodeScan()"
          >
            <v-icon large>mdi-camera-switch</v-icon>
          </v-btn>
        </v-card>
      </v-container>
    </v-dialog>
  </v-row>
  <!-- <div :class="`fill-height d-flex align-center`">
    <v-row no-gutters> -->
  <!-- <v-col cols="12" v-if="status === 'success'">
        <div>
          <v-card
            :width="$vuetify.display.lgAndUp ? '35%' : '94.5%'"
            :class="`pa-5 ${$vuetify.display.mdAndDown ? 'ml-3 mt-10' : 'ml-16'}`"
            rounded="xl"
          >
       
            <v-toolbar
              :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`"
            >
              <v-card-title class="mb-2 font-weight-bold text-grey">
                Visitor's Information
              </v-card-title>
              <v-spacer></v-spacer>
              <v-btn
                color="grey-darken-1"
                icon="mdi-close"
                :to="{
                  name: 'visitors',
                  query: {
                    site: mySite,
                  },
                }"
              ></v-btn>
            </v-toolbar>
            <v-card-text>
              <v-row>
                <v-col cols="4" class="text-center">
                  <v-icon :size="100">mdi-account-circle-outline</v-icon>
                </v-col>

                <v-col cols="8" class="d-flex align-center">
                  <v-row no-gutters>
                    <v-col cols="3" class="text-grey"> Name </v-col>
                    <v-col
                      cols="9"
                      class="text-caption font-weight-bold text-capitalize text-body-2"
                    >
                      {{ visitorInfo.firstName }} {{ visitorInfo.lastName }}
                    </v-col>

                    <v-col cols="3" class="text-grey text-caption"> ID </v-col>
                    <v-col cols="9" class="text-caption font-weight-bold">
                      <v-text-field
                        v-if="!visitorInfo.actualCheckIn"
                        v-model="visitorInfo.nric"
                        density="comfortable"
                        hide-details
                        clearable
                      >
                      </v-text-field>
                      {{ visitorInfo.actualCheckIn ? visitorInfo.nric : null }}
                    </v-col>

                    <v-col
                      v-if="
                        visitorInfo.residentGuestType.toLowerCase() ===
                        'guest (drive-in)'
                      "
                      cols="3"
                      class="text-grey text-caption"
                    >
                      Vehicle Number
                    </v-col>
                    <v-col
                      v-if="
                        visitorInfo.residentGuestType.toLowerCase() ===
                        'guest (drive-in)'
                      "
                      cols="9"
                      class="text-caption font-weight-bold"
                    >
                      <v-text-field
                        v-if="!visitorInfo.actualCheckIn"
                        v-model="visitorInfo.plateNumber"
                        density="comfortable"
                        hide-details
                        clearable
                      >
                      </v-text-field>
                      {{
                        visitorInfo.actualCheckIn
                          ? visitorInfo.plateNumber
                          : null
                      }}
                    </v-col>

                    <v-col cols="3" class="text-grey text-caption">
                      Type
                    </v-col>
                    <v-col
                      cols="9"
                      class="text-caption font-weight-bold text-capitalize"
                    >
                      {{ visitorInfo.residentGuestType }}
                    </v-col>

                    <v-col cols="3" class="text-grey text-caption">
                      Phone
                    </v-col>
                    <v-col
                      cols="9"
                      class="text-caption font-weight-bold text-capitalize"
                    >
                      {{ visitorInfo.phoneNumber }}
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12">
                  <v-divider></v-divider>
                </v-col>

                <v-col cols="6">
                  <v-card class="red text-center">
                    <v-img
                      src="/images/service_provider/completing.svg"
                      height="70"
                      width="100%"
                    ></v-img>
                    <div class="text-subtitle-2 text-grey py-2">
                      Actual Check In
                    </div>
                    <div class="text-caption font-weight-bold">
                      {{
                        visitorInfo.actualCheckIn
                          ? standardFormatDateTime(visitorInfo.actualCheckIn)
                          : "N/A"
                      }}
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="6">
                  <v-card class="red text-center">
                    <v-img
                      src="/images/service_provider/cancel.svg"
                      height="70"
                      width="100%"
                    ></v-img>
                    <div class="text-subtitle-2 text-grey py-2">
                      Actual Check Out
                    </div>
                    <div class="text-caption font-weight-bold">
                      {{
                        visitorInfo.actualCheckOut
                          ? standardFormatDateTime(visitorInfo.actualCheckOut)
                          : "N/A"
                      }}
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="6">
                  <v-card class="red text-center">
                    <v-img
                      src="/images/service_provider/ordinary_day.svg"
                      height="70"
                      width="100%"
                    ></v-img>
                    <div class="text-subtitle-2 text-grey py-2">
                      Purpose of Visit
                    </div>
                    <div class="text-caption font-weight-bold text-capitalize">
                      {{ visitorInfo.remarks }}
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="6">
                  <v-card class="red text-center">
                    <v-img
                      src="/images/service_provider/sweet_home.svg"
                      height="70"
                      width="100%"
                    ></v-img>
                    <div class="text-subtitle-2 text-grey py-2">Location</div>
                    <div class="text-caption font-weight-bold text-capitalize">
                      {{
                        visitorInfo.blockName &&
                        visitorInfo.blockLevelName &&
                        visitorInfo.unitName
                          ? `${visitorInfo.blockName}  /
                       ${visitorInfo.blockLevelName}  /
                      ${visitorInfo.unitName}`
                          : visitorInfo.blockName &&
                              !visitorInfo.blockLevelName &&
                              !visitorInfo.unitName
                            ? visitorInfo.blockName
                            : "N/A"
                      }}
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <v-divider />
            </v-card-text>
            <v-col cols="12">
              <v-btn
                color="blue-darken-3"
                block
                variant="flat"
                size="small"
                style="height: 40px"
                @click="openDialog"
              >
                <v-icon v-if="$vuetify.display.lgAndDown"
                  >mdi-qrcode-scan</v-icon
                >
                <span v-if="$vuetify.display.smAndDown"> Scan QR Code</span>
                <span v-if="$vuetify.display.mdAndUp"> Scan QR Code</span>
              </v-btn>
            </v-col>

            <v-col cols="12">
              <v-autocomplete
                v-model="visitor.visitorPass"
                :items="passList"
                item-title="prefixAndName"
                item-value="_id"
                density="comfortable"
                hide-details
                :disabled="isProgress"
                :loading="isPassListLoading"
                clearable
                @update:search="(query: string) => search(query)"
              >
                <template v-slot:label> Pass</template>
                <template v-slot:append-item>
                  <div v-intersect="endIntersect" />
                </template>
              </v-autocomplete>
            </v-col>

            <v-card-actions>
              <v-btn
                v-if="!visitorInfo.actualCheckIn && !visitorInfo.actualCheckOut"
                color="green-darken-1"
                block
                variant="flat"
                size="small"
                style="height: 40px"
                :loading="loading"
                @click="updateVisitorInfo('check-in')"
              >
                Check In
              </v-btn>

              <v-btn
                v-if="visitorInfo.actualCheckIn && !visitorInfo.actualCheckOut"
                color="red-darken-1"
                block
                variant="flat"
                size="small"
                style="height: 40px"
                @click="updateVisitorInfo('check-out')"
                :loading="loading"
              >
                Check Out
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-col>

      <v-col
        v-else-if="status === 'error'"
        col="12"
        class="text-h2 font-weight-bold text-center"
      >
        <div class="mb-5">{{ errorMessage }}</div>
      </v-col> -->

  <!-- </v-row>
  </div> -->
</template>
import TruncatedText from '~/components/TruncatedText.vue';

<script setup>
definePageMeta({
  middleware: "secure",
});

const { currentUser } = useLocalAuth();
const { validateVisitorQrCode, updateVisitorCheckInAndOut, searchPass } =
  useVisitor();
const { setSnackbar } = useLocal();
const { getSitesOptionsForFiltering, mySite } = useFilter();
const { standardFormatDateTime } = useUtils();
const { visitorSocket } = useSocket();

const visitor_id = useRoute().params.id;
const qrcode_id = useRoute().params.qrCodeId;
const visitorInfo = ref("");
const status = ref("");
const errorMessage = ref("");
const loading = ref(false);
const hasNextPage = ref(true);
const selectedPassRemarks = ref("");

const {
  visitor,
  updatePassKeysById,
  addVisitorSteps,
  isVisitorsCheckOut,
  setVisitor,
} = useVisitor();

const { getPassKeysByPageSearch, isPassListLoading, isKeyListLoading } =
  usePassKey();

//camera variable
const { siteSetting } = useSiteSettings();

const isProgress = ref(false);

const video = ref(null);
const canvas = ref(null);
const flash = ref(null);

const showCameraDialog = ref(false);
const cameraFacingMode = ref("environment");
const isCapturing = ref(false);
const showErrorStatus = ref(false);

// camera variable end

// pass variable

const passList = ref([]);
let fullName = ref("");
watch(
  visitorInfo,
  (newVal) => {
    if (newVal && newVal.firstName && newVal.lastName) {
      fullName.value = `${newVal.firstName} ${newVal.lastName}`;
    }
  },
  { immediate: true },
);

watch(
  () => visitorInfo.value.plateNumber,
  (newPlateNumber) => {
    if (newPlateNumber) {
      visitorInfo.value.residentGuestType = "Guest (Drive-In)";
    } else {
      visitorInfo.value.residentGuestType = "Guest (Walk-In)";
    }
  },
);

const visitorInfoNric = computed({
  get: () =>
    visitorInfo.value && visitorInfo.value.actualCheckIn
      ? visitorInfo.value.nric
      : null,
  set: () => {}, // readonly, do nothing on set
});

const visitorInfoPlateNumber = computed({
  get: () =>
    visitorInfo.value && visitorInfo.value.actualCheckIn
      ? visitorInfo.value.plateNumber
      : null,
  set: () => {}, // readonly, do nothing on set
});
// pass variable end

const phoneNumber = computed({
  get: () => (visitorInfo.value ? visitorInfo.value.phoneNumber : ""),
  set: () => {}, // readonly, do nothing on set
});

const location = computed({
  get: () => {
    if (
      visitorInfo.value &&
      visitorInfo.value.blockName &&
      visitorInfo.value.blockLevelName &&
      visitorInfo.value.unitName
    ) {
      return `${visitorInfo.value.blockName} / ${visitorInfo.value.blockLevelName} / ${visitorInfo.value.unitName}`;
    } else if (
      visitorInfo.value &&
      visitorInfo.value.blockName &&
      !visitorInfo.value.blockLevelName &&
      !visitorInfo.value.unitName
    ) {
      return visitorInfo.value.blockName;
    } else {
      return "N/A";
    }
  },
  set: () => {}, // readonly, do nothing on set
});

onMounted(async () => {
  await getSitesOptionsForFiltering();
  await setVisitor();
  const site = mySite.value;
  visitorSocket.disconnect();
  visitorSocket.auth = {
    userId: currentUser.value._id,
    siteId: mySite.value || currentUser.value.site,
    organizationId: currentUser.value.organization,
    serviceProviderId: currentUser.value.serviceProvider,
    serviceProviderGroupId: currentUser.value.serviceProviderGroup,
    type: currentUser.value.type,
  };
  visitorSocket.connect();

  isPassListLoading.value = true;
  const result1 = await getPassKeysByPageSearch({
    sites: [mySite.value],
    passTypes: ["visitor-pass"],
    statuses: ["Available"],
  });

  passList.value = result1?.items;
  isPassListLoading.value = false;

  try {
    const getVisitorInfo = await validateVisitorQrCode(
      visitor_id,
      qrcode_id,
      site,
      currentUser.value.organization,
    );

    if (getVisitorInfo?.status === "error") {
      status.value = getVisitorInfo?.status;
      errorMessage.value = getVisitorInfo?.message;
      showErrorStatus.value = true;
    }

    if (getVisitorInfo && getVisitorInfo.status === "success") {
      status.value = getVisitorInfo.status;
      visitorInfo.value = getVisitorInfo.data;

      visitorInfo.value.visitorPass =
        Array.isArray(getVisitorInfo.data.visitorPass) &&
        getVisitorInfo.data.visitorPass.length > 0
          ? getVisitorInfo.data.visitorPass[0]
          : { prefixAndName: "N/A" };
      fullName.value = `${getVisitorInfo.data.firstName} ${getVisitorInfo.data.lastName}`;
    }
  } catch (err) {
    setSnackbar({ text: err, modal: true, type: "error" });
  }
});

watch(
  () => visitorInfo.value.plateNumber,
  (newPlateNumber) => {
    if (newPlateNumber) {
      visitorInfo.value.residentGuestType = "Guest (Drive-In)";
    } else {
      visitorInfo.value.residentGuestType = "Guest (Walk-In)";
    }
  },
);

async function updateVisitorInfo(action) {
  // if (
  //   action != "check-out" &&
  //   visitorInfo.value.residentGuestType.toLowerCase() === "guest (drive-in)" &&
  //   !visitorInfo.plateNumber
  // ) {
  //   setSnackbar({
  //     text: `Vehicle Number is Required.`,
  //     modal: true,
  //     type: "error",
  //   });
  //   loading.value = false;
  //   return;
  // }
  loading.value = true;

  let visitorPass =
    (Array.isArray(visitor.value.visitorPass) &&
      !visitor.value.visitorPass.length) ||
    ["", null].includes(visitor.value.visitorPass)
      ? []
      : [{ keyId: visitor.value.visitorPass }];
  if (action === "check-out" && visitorInfo?.value?.visitorPass?.keyId) {
    // return;
    let payloadVisitorPass = null;
    if (visitorInfo?.value?.visitorPass?.keyId) {
      payloadVisitorPass = [
        {
          keyId: visitorInfo.value.visitorPass.keyId,
          status: visitorInfo.value.visitorPass.status,
          remarks: selectedPassRemarks.value,
          prefixAndName: visitorInfo.value.visitorPass.prefixAndName,
        },
      ];
    }

    const payload = {
      visitorPass: payloadVisitorPass ? payloadVisitorPass : null,
      updateType: "updateStatus",
      sites: [mySite.value],
    };

    await updatePassKeysById(visitor_id.toString(), payload);
  }

  if (
    visitorInfo?.value?.residentGuestType == "Guest (Drive-In)" &&
    !visitorInfo?.value?.plateNumber
  ) {
    console.log("inside hte drive in function");
    visitorInfo.value.residentGuestType = "Guest (Walk-In)";
  }

  console.log("visitorInfo.value", visitorInfo.value.residentGuestType);

  const data = await updateVisitorCheckInAndOut(
    visitor_id.toString(),
    action,
    currentUser.value.type,
    visitorInfo.value.plateNumber,
    visitorInfo.value.nric,
    visitorPass,
    fullName.value,
    visitorInfo.value.phoneNumber,
    visitorInfo.value.residentGuestType,
    visitorInfo.value.remarks,
  );

  if (data.status === "error") {
    loading.value = false;
    return setSnackbar({
      text: data.message,
      modal: true,
      type: "error",
    });
  }

  visitorInfo.value = {
    ...data,
    blockName: visitorInfo.value.blockName,
    blockLevelName: visitorInfo.value.blockLevelName,
    unitName: visitorInfo.value.unitName,
  };
  const site = mySite.value;
  const result = await validateVisitorQrCode(
    visitor_id,
    qrcode_id,
    site,
    currentUser.value.organization,
  );
  const isLoading = ref(false);
  if (result && result.status === "error") {
    // status.value = result.status;
    errorMessage.value = result.message;
    showErrorStatus.value = false;
    isVisitorsCheckOut.value = true;

    useRouter()
      .push("/visitors")
      .finally(() => {
        status.value = "success";
        isLoading.value = false;
      });
    status.value = "success";
  }

  if (result && result.status === "success") {
    status.value = result.status;
    visitorInfo.value = result.data;

    visitorInfo.value.visitorPass = Array.isArray(result.data.visitorPass)
      ? result.data.visitorPass[0]
      : result.data.visitorPass;
    fullName.value = `${result.data.firstName} ${result.data.lastName}`;
  }

  setSnackbar({
    text: `Visitor successfully ${action}.`,
    modal: true,
    type: "success",
  });
  loading.value = false;
}

visitorSocket.on("scan-plate", async (data) => {
  if (
    !visitorInfo.value.actualCheckIn ||
    visitorInfo.value.plateNumber === ""
  ) {
    setSnackbar({
      text: `Vehicle with platenumber ${data.plateNumber} is at the barrier!`,
      modal: true,
      type: "info",
    });
    visitorInfo.value.plateNumber = data.plateNumber;
  }
});

// camera
const showQRdialog = ref(false);
const html5QrCodeInstance = ref(null);
const showNotFoundMessage = ref(false);

const { $Html5Qrcode } = useNuxtApp();

const openDialog = () => {
  showQRdialog.value = true;
};

const startScanner = async () => {
  if (html5QrCodeInstance.value) return; // Prevent multiple initializations
  const config = { fps: 10, qrbox: { width: 250, height: 250 } };

  html5QrCodeInstance.value = new $Html5Qrcode("reader");

  html5QrCodeInstance.value
    .start(
      { facingMode: cameraFacingMode.value },
      config,
      async (qrCodeMessage) => {
        closeDialog();
        showNotFoundMessage.value = false; // Hide message if QR is found

        // Automatically navigate to the scanned URL if it's a valid link
        if (isValidUrl(qrCodeMessage)) {
          window.location.href = qrCodeMessage;
        } else {
          if (!visitorInfo.value.actualCheckIn) {
            isPassListLoading.value = true;
            const result1 = await getPassKeysByPageSearch({
              sites: [mySite.value],
              limit: 10,
              passTypes: ["visitor-pass"],
              search: qrCodeMessage,
            });

            if (result1?.items.length < 1) {
              setSnackbar({
                text: "Visitor Pass not found",
                type: "error",
                modal: true,
              });
            } else if (result1?.items.length > 1) {
              setSnackbar({
                text: "Visitor Pass duplicate found",
                type: "error",
                modal: true,
              });
            } else {
              if (
                result1?.items[0].status.toLowerCase() !==
                "Available".toLowerCase()
              ) {
                setSnackbar({
                  text: `Visitor Pass is ${result1?.items[0].status}`,
                  type: "error",
                  modal: true,
                });
              } else {
                passList.value = result1?.items;
                visitor.value.visitorPass = result1?.items[0]._id;
              }
              showQRdialog.value = false;
              isPassListLoading.value = false;
            }
            isPassListLoading.value = false;
          } else if (visitorInfo.value.actualCheckIn) {
            if (
              typeof visitorInfo.value.visitorPass?.prefixAndName ===
                "string" &&
              typeof qrCodeMessage === "string" &&
              visitorInfo.value.visitorPass?.prefixAndName == qrCodeMessage
            ) {
              isPassListLoading.value = true;
              visitorInfo.value.visitorPass.status = "Returned";
              updateVisitorInfo("check-out");
              showQRdialog.value = false;
              isPassListLoading.value = false;
            } else {
              setSnackbar({
                text: `Invalid QR code. Your QR code is ${visitorInfo.value.visitorPass.prefixAndName} but the one you scanned is ${qrCodeMessage}`,
                type: "error",
                modal: true,
              });
            }
          } else {
            showNotFoundMessage.value = true;
            errorMessage.value = "Invalid QR Code Scanned!";
          }
        }
      },
      (msg) => {
        if (msg === "QR Code no longer in front") {
          showNotFoundMessage.value = true;
          errorMessage.value = msg;
        } else {
          console.log("Error: " + msg);
        }
      },
    )
    .catch((err) => {
      console.log("Unable to start scanning, error: " + err);
    });
};

const stopScanner = () => {
  return new Promise((resolve, reject) => {
    if (html5QrCodeInstance.value) {
      html5QrCodeInstance.value
        .stop()
        .then(() => {
          html5QrCodeInstance.value.clear();
          html5QrCodeInstance.value = null;
          showNotFoundMessage.value = false;
          resolve(); // Resolve the promise when the scanner is fully stopped
        })
        .catch((err) => {
          reject(err); // Reject the promise if there's an error
        });
    } else {
      resolve(); // Resolve immediately if no scanner instance exists
    }
  });
};

const switchCameraQRCodeScan = async () => {
  await stopScanner();
  cameraFacingMode.value =
    cameraFacingMode.value === "environment" ? "user" : "environment";
  setSnackbar({
    text: `Switched to ${cameraFacingMode.value === "environment" ? "Back Camera" : "Front Camera"}`,
    modal: true,
    type: "info",
  });
  startScanner();
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// qrcode scan functions
const closeDialog = () => {
  showQRdialog.value = false;
  stopScanner();
};

onBeforeUnmount(() => {
  stopScanner();
});

//camera dialog functions

const closeCameraDialog = () => {
  showCameraDialog.value = false;
  stopCamera();
};

const showCamDialog = () => {
  showCameraDialog.value = true;
};

const startCamera = async () => {
  try {
    const videoElement = video.value;
    const constraints = {
      video: {
        facingMode: cameraFacingMode, // Use the current facing mode (front or back)
      },
    };

    // Request access to the camera
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = stream;
    videoElement.play();
  } catch (error) {
    setSnackbar({
      text: `Error accessing camera: ${error.message}`,
      type: "error",
      modal: true,
    });
  }
};

const switchCamera = async () => {
  await stopCamera();
  cameraFacingMode.value =
    cameraFacingMode.value === "environment" ? "user" : "environment";
  setSnackbar({
    text: `Switched to ${cameraFacingMode.value === "environment" ? "Back Camera" : "Front Camera"}`,
    modal: true,
    type: "info",
  });
  startCamera();
};

const shutterEffect = () => {
  const videoElement = video.value;

  // Briefly apply a flash effect using CSS
  videoElement.style.transition = "opacity 0.1s ease-in-out";
  videoElement.style.opacity = "0.1"; // Make the video almost invisible

  setTimeout(() => {
    videoElement.style.opacity = "1"; // Restore the video after the flash
  }, 100); // Flash duration
};

const stopCamera = async () => {
  const videoElement = video.value;
  const stream = videoElement.srcObject;
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
};

const captureImageFromCamera = async () => {
  // Check if video and canvas refs are available
  if (video.value && canvas.value) {
    // Get video and canvas contexts

    setTimeout(() => {
      const videoElement = video.value;
      const canvasElement = canvas.value;
      if (canvasElement instanceof HTMLCanvasElement) {
        const context = canvasElement.getContext("2d");

        if (context) {
          // Draw the current frame from video onto the canvas
          context.drawImage(
            videoElement,
            0,
            0,
            canvasElement.width,
            canvasElement.height,
          );
          const imageDataUrl = canvasElement.toDataURL("image/png");
          const capturedImage = dataURLtoFile(imageDataUrl, "image.png");
          appendCapturedImage(capturedImage);
          shutterEffect();
          isCapturing.value = false;
        } else {
          console.error("Failed to get canvas context");
        }
      } else {
        console.error(
          "Canvas element reference is not a valid HTMLCanvasElement",
        );
      }
    }, 1000);
  } else {
    console.error("Video or Canvas element not found");
  }
};

// Fetching in v-autocomplete
const page = ref(1);
const isSearching = ref(false);

const endIntersect = async (isIntersecting) => {
  if (isIntersecting && !isSearching.value) {
    if (hasNextPage.value) {
      page.value += 1;
      let moreItems = await fetchPassKeysByPageSearch("pass");
      passList.value = [...passList.value, ...moreItems];
    }
  }
};

// const fetchPassKeysByPageSearch = async () => {
//   isPassListLoading.value = true;

//   const result1 = await getPassKeysByPageSearch({
//     sites: [mySite.value],
//     passTypes: [
//       visitor.value.type == "contractor"
//         ? visitor.value.contractorType === "property-agent"
//           ? "agent-pass"
//           : "contractor-pass"
//         : "visitor-pass",
//     ],
//     page: page.value,
//   });

//   isPassListLoading.value = false;
//   return result1?.items;
// };

const fetchPassKeysByPageSearch = async (type) => {
  if (type == "pass") {
    isPassListLoading.value = true;
  } else {
    isKeyListLoading.value = true;
  }

  const result1 = await getPassKeysByPageSearch({
    sites: [mySite.value],
    passTypes: [
      type !== "key"
        ? visitor.value.type == "contractor"
          ? visitor.value.contractorType === "property-agent"
            ? "agent-pass"
            : "contractor-pass"
          : "visitor-pass"
        : "pass-key",
    ],
    statuses: ["Available"],
    page: page.value,
  });
  if (result1?.pageRange) {
    const parts = result1.pageRange.split(" ");
    const pageItemEnd = parseInt(parts[0].split("-")[1]);
    const totalItems = parseInt(parts[2]);
    if (pageItemEnd < totalItems) {
      hasNextPage.value = true;
    } else {
      hasNextPage.value = false;
    }
  }

  if (type == "pass") {
    isPassListLoading.value = false;
  } else {
    isKeyListLoading.value = false;
  }
  return result1?.items;
};

const search = async (query) => {
  isSearching.value = true;

  page.value = 1;
  const result = await getPassKeysByPageSearch({
    page: 1,
    search: query,
    passTypes: [
      visitor.value.type == "contractor"
        ? visitor.value.contractorType === "property-agent"
          ? "agent-pass"
          : "contractor-pass"
        : "visitor-pass",
    ],
    sites: [mySite.value],
  });

  passList.value = result.items;

  isSearching.value = false;
};
</script>

<style scoped>
.custom-background {
  min-height: 500px; /* Use min-height instead of height for flexibility */
  position: relative;
  overflow: visible; /* Set to visible to allow child elements to grow */
}

.background-wrapper {
  background-image: url("/images/qr-template/visitorQrBackground.svg");
  background-size: cover;
  background-position: center;
  height: 50%; /* This is fine, but make sure it's responsive */
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
