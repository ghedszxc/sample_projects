<template>
  <v-row no-gutters class="pa-8">
    <!-- back -->
    <v-col
      cols="12"
      class="text-h6 font-weight-bold my-4"
      style="letter-spacing: 2px !important"
    >
      <v-btn
        fav
        density="compact"
        icon="mdi-arrow-left"
        variant="text"
        @click="goBack()"
      ></v-btn>
      Template
    </v-col>
    <v-col cols="12">
      <v-card width="100%" elevation="3" height="100%">
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-tabs v-model="tab" fixed-tabs color="deep-purple-accent-4">
          <v-tab :value="1">A4 Size</v-tab>
          <v-tab :value="2">Standard Credit Card Size</v-tab>
        </v-tabs>

        <v-tabs-window v-if="tab === 1" v-model="tab">
          <v-tabs-window-item :value="1">
            <v-row
              no-gutters
              :class="{
                'pa-6 px-15': !$vuetify.display.xs,
                'pa-2': $vuetify.display.xs,
              }"
            >
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col cols="6" class="d-flex justify-start">
                    <h4>Add new pass template</h4>
                  </v-col>
                  <v-col cols="6" class="d-flex justify-end">
                    <v-btn color="primary" @click="dialogPreview = true"
                      >Preview</v-btn
                    >
                  </v-col>
                </v-row>
              </v-col>
              <!-- <v-col cols="12" class="pt-3">
                <v-text-field
                  label="Enter Template Name"
                  v-model="templateName"
                  type="input"
                ></v-text-field>
              </v-col> -->
              <v-col cols="12" class="pt-3">
                <v-row no-gutters>
                  <v-col :cols="$vuetify.display.xs ? 12 : 6">
                    <v-text-field
                      label="Enter Template Name"
                      v-model="templateName"
                      type="input"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    :cols="$vuetify.display.xs ? 12 : 6"
                    :class="{ 'pl-1': !$vuetify.display.xs }"
                  >
                    <v-text-field
                      label="Enter Template Prefix pass"
                      v-model="PrefixPass"
                      type="input"
                    ></v-text-field>
                  </v-col>

                  <!-- <v-col cols="6" class="pl-1">
                    <v-text-field
                      label="Enter Template Prefix key"
                      v-model="PrefixKey"
                      type="input"
                    ></v-text-field>
                  </v-col> -->
                </v-row>
              </v-col>
              <v-col cols="12" class="pt-3">
                <v-card class="pa-3" color="#FAFAFA" variant="flat">
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="6"
                      lg="6"
                      xl="6"
                      class="d-flex justify-start align-center"
                    >
                      <h4>Template: A4 Size</h4>
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                      lg="6"
                      xl="6"
                      class="d-flex justify-end"
                    >
                      <span class="text-subtitle-1 mr-2 d-flex align-center"
                        >Enable A4 Size</span
                      >
                      <v-card
                        class="pa-3 rounded-lg mr-3"
                        @click="isA4Enabled = true"
                      >
                        <v-row>
                          <v-col col="6"> Yes</v-col>
                          <v-col col="6">
                            <v-icon :color="isA4Enabled ? 'green' : 'gray'">
                              {{
                                isA4Enabled
                                  ? "mdi-check-circle"
                                  : "mdi-check-circle-outline"
                              }}
                            </v-icon>
                          </v-col>
                        </v-row>
                      </v-card>
                      <v-card
                        class="pa-3 rounded-lg"
                        @click="isA4Enabled = false"
                      >
                        <v-row>
                          <v-col col="6"> No</v-col>
                          <v-col col="6">
                            <v-icon :color="!isA4Enabled ? 'green' : 'gray'">
                              {{
                                !isA4Enabled
                                  ? "mdi-check-circle"
                                  : "mdi-check-circle-outline"
                              }}
                            </v-icon>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col
                    cols="12"
                    md="4"
                    lg="4"
                    xl="4"
                    class="d-flex justify-start"
                  >
                    <h4>Pass Template (Front)</h4>
                  </v-col>
                  <v-col
                    cols="12"
                    md="8"
                    lg="8"
                    xl="8"
                    class="d-flex justify-end"
                  >
                    <span class="text-body-2">
                      The content here will be shown on the front of Visitor
                      Pass & Keys
                    </span>
                  </v-col>
                  <v-col cols="12" class="d-flex justify-end pa-0">
                    <v-switch
                      v-model="A4FrontQREnabled"
                      :label="A4FrontQREnabled ? 'Disable QR' : 'Enable QR'"
                      hide-details
                      inset
                      color="primary"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="pt-3 position-relative">
                <tiptap-editor-qr
                  @content-updated="handleDescriptionFrontPage"
                  maxHeight="707px"
                  minHeight="707px"
                  storageKey="frontPage"
                  :clearOnLoad="isFirstLoad"
                />
                <!-- <img
                  :style="{
                    top: topImageFront + '%',
                    left: leftImageFront + '%',
                    transform: 'translate(-50%, -50%)',
                  }"
                  src="public/images/qr-template/qr.svg"
                  class="position-absolute"
                  :height="`${a4QrSizeFront}%`"
                /> -->
                <div
                  :style="{
                    top: topImageFront + '%',
                    left: leftImageFront + '%',
                    transform: 'translate(-50%, -50%)',
                  }"
                  class="position-absolute"
                >
                  <qrcode-vue
                    v-if="A4FrontQREnabled"
                    :size="a4QrSizeFront"
                    level="H"
                  />
                </div>

                <!-- <qrcode-vue
                  v-if="A4FrontQREnabled"
                  :size="a4QrSizeFront"
                  level="H"
                  margin="3"
                  :style="{
                    top: topImageFront + '%',
                    left: leftImageFront + '%',
                    transform: 'translate(-50%, -50%)',
                  }"
                  class="position-absolute"
                /> -->

                <div
                  v-if="A4FrontQREnabled"
                  :style="{
                    top: topPassNumberPosition + '%',
                    left: leftPassNumberPosition + '%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: a4TextSizeFront + 'px',
                  }"
                  class="position-absolute text-center"
                >
                  Pass Number: C01
                </div>
              </v-col>
              <v-col cols="12" class="" v-if="A4FrontQREnabled">
                <v-card class="pa-3" color="#FAFAFA" variant="flat">
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      xl="2"
                      class="d-flex justify-start align-center"
                    >
                      <v-row no-gutters>
                        <v-col cols="12">
                          <span class="text-caption">Qr Code Position</span>
                        </v-col>
                        <v-col col="12">
                          <span class="text-caption">Restore Default</span>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      lg="1"
                      xl="1"
                      class="d-flex justify-start align-center pr-1"
                    >
                      <v-row no-gutters>
                        <v-text-field
                          hide-details="true"
                          label="Top "
                          clearable
                          v-model="topImageFront"
                        ></v-text-field>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      lg="1"
                      xl="1"
                      class="d-flex justify-start align-center"
                    >
                      <v-row no-gutters>
                        <v-text-field
                          hide-details="true"
                          label="Left "
                          clearable
                          v-model="leftImageFront"
                        ></v-text-field>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      xl="2"
                      class="d-flex justify-start align-center pl-1 pr-1"
                    >
                      <v-row no-gutters>
                        <v-select
                          hide-details="true"
                          :items="QRSizes"
                          label="QR Size"
                          v-model="a4QrSizeFront"
                        ></v-select>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      xl="2"
                      class="d-flex justify-start align-center pl-1"
                    >
                      <v-row no-gutters>
                        <v-col cols="12">
                          <span class="text-caption">Pass Number Position</span>
                        </v-col>
                        <v-col col="12">
                          <span class="text-caption">Restore Default</span>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      xl="2"
                      class="d-flex justify-start align-center pl-2 pr-1"
                    >
                      <v-row no-gutters>
                        <v-select
                          hide-details="true"
                          :items="fontSizes"
                          label="Font Size"
                          v-model="a4TextSizeFront"
                        ></v-select>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      lg="1"
                      xl="1"
                      class="d-flex justify-start align-center pr-1"
                    >
                      <v-row no-gutters>
                        <v-text-field
                          hide-details="true"
                          label="Top "
                          clearable
                          v-model="topPassNumberPosition"
                        ></v-text-field>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      lg="1"
                      xl="1"
                      class="d-flex justify-start align-center"
                    >
                      <v-row no-gutters>
                        <v-text-field
                          hide-details="true"
                          label="Left "
                          clearable
                          v-model="leftPassNumberPosition"
                        ></v-text-field>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <v-col cols="12" class="pt-5">
                <v-row no-gutters>
                  <v-col
                    cols="12"
                    md="4"
                    lg="4"
                    xl="4"
                    class="d-flex justify-start"
                  >
                    <h4>Pass Template (Back)</h4>
                  </v-col>
                  <v-col
                    cols="12"
                    md="8"
                    lg="8"
                    xl="8"
                    class="d-flex justify-end"
                  >
                    <span class="text-body-2">
                      The content here will be shown on the front of Visitor
                      Pass & Keys
                    </span>
                  </v-col>
                  <v-col cols="12" class="d-flex justify-end pa-0">
                    <v-switch
                      v-model="A4BackQREnabled"
                      :label="A4BackQREnabled ? 'Disable QR' : 'Enable QR'"
                      hide-details
                      inset
                      color="primary"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="pt-3 position-relative">
                <tiptap-editor-qr
                  @content-updated="handleDescriptionBackPage"
                  maxHeight="707px"
                  minHeight="707px"
                  storageKey="backPage"
                  :clearOnLoad="isFirstLoad"
                />
                <!-- <img
                  :style="{
                    top: topImageBack + '%',
                    left: leftImageBack + '%',
                    transform: 'translate(-50%, -50%)',
                  }"
                  src="public/images/qr-template/qr.svg"
                  class="position-absolute"
                  :height="`${a4QrSizeBack}%`"
                /> -->
                <div
                  :style="{
                    top: topImageBack + '%',
                    left: leftImageBack + '%',
                    transform: 'translate(-50%, -50%)',
                  }"
                  class="position-absolute"
                >
                  <qrcode-vue
                    v-if="A4BackQREnabled"
                    :size="a4QrSizeBack"
                    level="H"
                  />
                </div>

                <!-- <qrcode-vue
                  v-if="A4BackQREnabled"
                  :size="a4QrSizeBack"
                  level="H"
                  margin="3"
                  :style="{
                    top: topImageBack + '%',
                    left: leftImageBack + '%',
                    transform: 'translate(-50%, -50%)',
                  }"
                  class="position-absolute"
                /> -->
                <div
                  v-if="A4BackQREnabled"
                  :style="{
                    top: topPassNumberPosition + '%',
                    left: leftPassNumberPosition + '%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: a4TextSizeBack + 'px',
                  }"
                  class="position-absolute text-center"
                >
                  Pass Number: C01
                </div>
              </v-col>
              <v-col cols="12" class="" v-if="A4BackQREnabled">
                <v-card class="pa-3" color="#FAFAFA" variant="flat">
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      xl="2"
                      class="d-flex justify-start align-center"
                    >
                      <v-row no-gutters>
                        <v-col cols="12">
                          <span class="text-caption">Qr Code Position</span>
                        </v-col>
                        <v-col col="12">
                          <span class="text-caption">Restore Default</span>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      lg="1"
                      xl="1"
                      class="d-flex justify-start align-center pr-1"
                    >
                      <v-row no-gutters>
                        <v-text-field
                          hide-details="true"
                          label="Top "
                          clearable
                          v-model="topImageBack"
                        ></v-text-field>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      lg="1"
                      xl="1"
                      class="d-flex justify-start align-center"
                    >
                      <v-row no-gutters>
                        <v-text-field
                          hide-details="true"
                          label="Left "
                          clearable
                          v-model="leftImageBack"
                        ></v-text-field>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      xl="2"
                      class="d-flex justify-start align-center pl-1 pr-1"
                    >
                      <v-row no-gutters>
                        <v-select
                          hide-details="true"
                          :items="QRSizes"
                          label="QR Size"
                          v-model="a4QrSizeBack"
                        ></v-select>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      xl="2"
                      class="d-flex justify-start align-center pl-1"
                    >
                      <v-row no-gutters>
                        <v-col cols="12">
                          <span class="text-caption">Pass Number Position</span>
                        </v-col>
                        <v-col col="12">
                          <span class="text-caption">Restore Default</span>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      xl="2"
                      class="d-flex justify-start align-center pl-2"
                    >
                      <v-row no-gutters>
                        <v-select
                          hide-details="true"
                          :items="fontSizes"
                          label="Font Size"
                          v-model="a4TextSizeBack"
                        ></v-select>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      lg="1"
                      xl="1"
                      class="d-flex justify-start align-center pl-1 pr-1"
                    >
                      <v-row no-gutters>
                        <v-text-field
                          hide-details="true"
                          label="Top "
                          clearable
                          v-model="topPassNumberPosition"
                        ></v-text-field>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      lg="1"
                      xl="1"
                      class="d-flex justify-start align-center"
                    >
                      <v-row no-gutters>
                        <v-text-field
                          hide-details="true"
                          label="Left "
                          clearable
                          v-model="leftPassNumberPosition"
                        ></v-text-field>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <v-col cols="12" class="d-flex justify-end pt-3">
                <v-btn color="primary" @click="submitTemplateA4AndCreditCard"
                  >Submit</v-btn
                >
              </v-col>
            </v-row>
          </v-tabs-window-item>
        </v-tabs-window>

        <v-tabs-window v-if="tab === 2" v-model="tab">
          <v-tabs-window-item :value="2">
            <v-row
              no-gutters
              :class="{
                'pa-6 px-15': !$vuetify.display.xs,
                'pa-2': $vuetify.display.xs,
              }"
            >
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col cols="6" class="d-flex justify-start">
                    <h4>Template: Standard Credit Card Size</h4>
                  </v-col>
                  <v-col cols="6" class="d-flex justify-end">
                    <v-btn
                      color="primary"
                      @click="dialogPreviewStandardCreditCardSize = true"
                      >Preview</v-btn
                    >
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" class="pt-3">
                <v-row no-gutters>
                  <v-col :cols="$vuetify.display.xs ? 12 : 6">
                    <v-text-field
                      v-model="templateName"
                      label="Enter Template Name"
                      type="input"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    :cols="$vuetify.display.xs ? 12 : 6"
                    :class="{ 'pl-1': !$vuetify.display.xs }"
                  >
                    <v-text-field
                      label="Enter Template Prefix pass"
                      v-model="PrefixPass"
                      type="input"
                    ></v-text-field>
                  </v-col>

                  <!-- <v-col cols="6" class="pl-1">
                    <v-text-field
                      label="Enter Template Prefix key"
                      v-model="PrefixKey"
                      type="input"
                    ></v-text-field>
                  </v-col> -->
                </v-row>
              </v-col>
              <v-col cols="12" class="pt-3">
                <v-card class="pa-3" color="#FAFAFA" variant="flat">
                  <v-row no-gutters>
                    <v-col cols="12" md="6" lg="6" xl="6" class="d-flex">
                      <span class="text-subtitle-1 mr-2 d-flex align-center"
                        >Enable Standard Credit Card Size</span
                      >
                      <v-card
                        class="pa-3 rounded-lg mr-3"
                        @click="CCEnabled = true"
                      >
                        <v-row>
                          <v-col col="6"> Yes</v-col>
                          <v-col col="6">
                            <v-icon :color="CCEnabled ? 'green' : 'gray'">
                              {{
                                CCEnabled
                                  ? "mdi-check-circle"
                                  : "mdi-check-circle-outline"
                              }}
                            </v-icon>
                          </v-col>
                        </v-row>
                      </v-card>
                      <v-card
                        class="pa-3 rounded-lg"
                        @click="CCEnabled = false"
                      >
                        <v-row>
                          <v-col col="6"> No</v-col>
                          <v-col col="6">
                            <v-icon :color="!CCEnabled ? 'green' : 'gray'">
                              {{
                                !CCEnabled
                                  ? "mdi-check-circle"
                                  : "mdi-check-circle-outline"
                              }}
                            </v-icon>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="6" lg="6" xl="6" class="d-flex">
                      <span class="text-subtitle-1 mr-2 d-flex align-center"
                        >Orientation</span
                      >
                      <v-card
                        class="pa-3 rounded-lg mr-3"
                        @click="isPortraitOrLandScape = true"
                      >
                        <v-row>
                          <v-col col="6"> Portrait</v-col>
                          <v-col col="6">
                            <v-icon
                              :color="isPortraitOrLandScape ? 'green' : 'gray'"
                            >
                              {{
                                isPortraitOrLandScape
                                  ? "mdi-check-circle"
                                  : "mdi-check-circle-outline"
                              }}
                            </v-icon>
                          </v-col>
                        </v-row>
                      </v-card>
                      <v-card
                        class="pa-3 rounded-lg"
                        @click="isPortraitOrLandScape = false"
                      >
                        <v-row>
                          <v-col col="6"> Landscape</v-col>
                          <v-col col="6">
                            <v-icon
                              :color="!isPortraitOrLandScape ? 'green' : 'gray'"
                            >
                              {{
                                !isPortraitOrLandScape
                                  ? "mdi-check-circle"
                                  : "mdi-check-circle-outline"
                              }}
                            </v-icon>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col
                    cols="12"
                    md="4"
                    lg="4"
                    xl="4"
                    class="d-flex justify-start"
                  >
                    <h4>Pass Template (Front)</h4>
                  </v-col>
                  <v-col
                    cols="12"
                    md="8"
                    lg="8"
                    xl="8"
                    class="d-flex justify-end"
                  >
                    <span class="text-body-2">
                      The content here will be shown on the front of Visitor
                      Pass & Keys
                    </span>
                  </v-col>

                  <v-col cols="12" class="d-flex justify-end pa-0">
                    <v-switch
                      v-model="CCFrontQREnabled"
                      :label="CCFrontQREnabled ? 'Disable QR' : 'Enable QR'"
                      hide-details
                      inset
                      color="primary"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                cols="12"
                class="pt-3 position-relative d-flex justify-center mb-16"
              >
                <!-- <v-col cols="12" class="pt-3 position-relative text-center"> -->
                <div
                  class="editor-container justify-center align-center"
                  :style="{
                    position: 'relative',
                    display: 'inline-block',
                    width: isPortraitOrLandScape ? '243.712px' : '369.950px',
                    height: isPortraitOrLandScape ? '369.950px' : '243.712px',
                  }"
                >
                  <tiptap-editor-qr
                    @content-updated="handleDescriptionFrontPageCreditCard"
                    :maxHeight="
                      isPortraitOrLandScape ? '369.950px' : '243.712px'
                    "
                    :minHeight="
                      isPortraitOrLandScape ? '369.950px' : '243.712px'
                    "
                    :maxWidth="
                      isPortraitOrLandScape ? '243.712px' : '369.950px'
                    "
                    storageKey="frontPageCreditCard"
                    :clearOnLoad="isFirstLoad"
                  />
                  <!-- <tiptap-editor-qr
                  @content-updated="handleDescriptionFrontPageCreditCard"
                  maxHeight="383"
                  minHeight="383"
                  maxWidth="606.917"
                  storageKey="frontPageCreditCard"
                  :clearOnLoad="isFirstLoad"
                /> -->
                  <!-- <img
                  :style="{
                    top: topCreditCardImageFront + '%',
                    left: leftCreditCardImageFront + '%',
                    transform: 'translate(-50%, -50%)',
                  }"
                  src="public/images/qr-template/qr.svg"
                  class="position-absolute"
                  :height="`${CCQrSizeFront}%`"
                /> -->

                  <!-- <qrcode-vue
                    v-if="CCFrontQREnabled"
                    :size="CCQrSizeFront"
                    level="H"
                    :style="{
                      top: `${Math.max(
                        0,
                        Math.min(100, parseFloat(topCreditCardImageFront)),
                      )}%`,
                      left: `${parseFloat(leftCreditCardImageFront)}%`,
                      transform: 'translate(-50%, -50%)',
                    }"
                    class="position-absolute"
                  /> -->
                  <div
                    :style="{
                      top: topCreditCardImageFront + '%',
                      left: leftCreditCardImageFront + '%',
                    }"
                    class="position-absolute"
                  >
                    <qrcode-vue
                      v-if="CCFrontQREnabled"
                      :size="CCQrSizeFront"
                      level="H"
                    />
                  </div>

                  <!-- <qrcode-vue
                    v-if="CCFrontQREnabled"
                    :size="CCQrSizeFront"
                    level="H"
                    :style="{
                      top: topCreditCardImageFront + '%',
                      left: leftCreditCardImageFront + '%',
                    }"
                    class="position-absolute"
                  /> -->
                  <div
                    v-if="CCFrontQREnabled"
                    :style="{
                      top: topPassNumberPositionCreditCard + '%',
                      left: leftPassNumberPositionCreditCard + '%',

                      fontSize: creditCardSizeTextSizeFront + 'px',
                      textWrap: 'nowrap',
                    }"
                    class="position-absolute"
                  >
                    Pass Number: C01
                  </div>
                </div>

                <!-- <div
                  v-if="CCFrontQREnabled"
                  :style="{
                    top: topPassNumberPositionCreditCard + '%',
                    left: leftPassNumberPositionCreditCard + '%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: creditCardSizeTextSizeFront + 'px',
                  }"
                  class="position-absolute text-center"
                >
                  Pass Number: C01
                </div> -->
              </v-col>
              <v-col cols="12" style="margin-top: 106px">
                <v-card class="pa-3 mt-16" color="#FAFAFA" variant="flat">
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      xl="2"
                      class="d-flex justify-start align-center"
                    >
                      <v-row no-gutters>
                        <v-col cols="12">
                          <span class="text-caption">Qr Code Position</span>
                        </v-col>
                        <v-col col="12">
                          <span class="text-caption">Restore Default</span>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      lg="1"
                      xl="1"
                      class="d-flex justify-start align-center pr-1"
                    >
                      <v-row no-gutters>
                        <v-text-field
                          hide-details="true"
                          label="Top "
                          clearable
                          v-model="topCreditCardImageFront"
                        ></v-text-field>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      lg="1"
                      xl="1"
                      class="d-flex justify-start align-center"
                    >
                      <v-row no-gutters>
                        <v-text-field
                          hide-details="true"
                          label="Left "
                          clearable
                          v-model="leftCreditCardImageFront"
                        ></v-text-field>
                      </v-row>
                    </v-col>

                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      xl="2"
                      class="d-flex justify-start align-center pl-1 pr-1"
                    >
                      <v-row no-gutters>
                        <v-select
                          hide-details="true"
                          :items="QRSizes"
                          label="QR Size"
                          v-model="CCQrSizeFront"
                        ></v-select>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      xl="2"
                      class="d-flex justify-start align-center pl-1"
                    >
                      <v-row no-gutters>
                        <v-col cols="12">
                          <span class="text-caption">Pass Number Position</span>
                        </v-col>
                        <v-col col="12">
                          <span class="text-caption">Restore Default</span>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      xl="2"
                      class="d-flex justify-start align-center px-1"
                    >
                      <v-row no-gutters>
                        <v-select
                          hide-details="true"
                          :items="fontSizes"
                          label="Font Size"
                          v-model="creditCardSizeTextSizeFront"
                        ></v-select>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      lg="1"
                      xl="1"
                      class="d-flex justify-start align-center pr-1"
                    >
                      <v-row no-gutters>
                        <v-text-field
                          hide-details="true"
                          label="Top"
                          clearable
                          v-model="topPassNumberPositionCreditCard"
                        ></v-text-field>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      lg="1"
                      xl="1"
                      class="d-flex justify-start align-center"
                    >
                      <v-row no-gutters>
                        <v-text-field
                          hide-details="true"
                          label="Left "
                          clearable
                          v-model="leftPassNumberPositionCreditCard"
                        ></v-text-field>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <v-col cols="12" class="pt-5">
                <v-row no-gutters>
                  <v-col
                    cols="12"
                    md="4"
                    lg="4"
                    xl="4"
                    class="d-flex justify-start"
                  >
                    <h4>Pass Template (Back)</h4>
                  </v-col>
                  <v-col
                    cols="12"
                    md="8"
                    lg="8"
                    xl="8"
                    class="d-flex justify-end"
                  >
                    <span class="text-body-2">
                      The content here will be shown on the front of Visitor
                      Pass & Keys
                    </span>
                  </v-col>
                  <v-col cols="12" class="d-flex justify-end pa-0">
                    <v-switch
                      v-model="CCBackQREnabled"
                      :label="CCBackQREnabled ? 'Disable QR' : 'Enable QR'"
                      hide-details
                      inset
                      color="primary"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                cols="12"
                class="pt-3 position-relative d-flex justify-center mb-16"
              >
                <!-- <v-col cols="12" class="pt-3 position-relative text-center"> -->
                <div
                  class="editor-container justify-center align-center"
                  :style="{
                    position: 'relative',
                    display: 'inline-block',
                    width: isPortraitOrLandScape ? '243.712px' : '369.950px',
                    height: isPortraitOrLandScape ? '369.950px' : '243.712px',
                  }"
                >
                  <tiptap-editor-qr
                    @content-updated="handleDescriptionBackPageCreditCard"
                    :maxHeight="
                      isPortraitOrLandScape ? '369.950px' : '243.712px'
                    "
                    :minHeight="
                      isPortraitOrLandScape ? '369.950px' : '243.712px'
                    "
                    :maxWidth="
                      isPortraitOrLandScape ? '243.712px' : '369.950px'
                    "
                    storageKey="backPageCreditCard"
                    :clearOnLoad="isFirstLoad"
                  />
                  <div
                    :style="{
                      top: `${topCreditCardImageBack}%`,
                      left: `${leftCreditCardImageBack}%`,
                    }"
                    class="position-absolute"
                  >
                    <qrcode-vue
                      v-if="CCBackQREnabled"
                      :size="CCQrSizeBack"
                      level="H"
                    />
                  </div>

                  <!-- <qrcode-vue
                    v-if="CCBackQREnabled"
                    :size="CCQrSizeBack"
                    level="H"
                    :style="{
                      top: `${topCreditCardImageBack}%`,
                      left: `${leftCreditCardImageBack}%`,
                    }"
                    class="position-absolute"
                  /> -->
                  <div
                    v-if="CCBackQREnabled"
                    :style="{
                      top: `${topBackPassNumberPositionCreditCard}%`,
                      left: `${leftBackPassNumberPositionCreditCard}%`,
                      fontSize: `${creditCardSizeTextSizeBack}px`,
                      textWrap: 'nowrap',
                    }"
                    class="position-absolute text-center"
                  >
                    Pass Number: C01
                  </div>
                </div>
              </v-col>
              <v-col cols="12" class="" style="margin-top: 106px">
                <v-card class="pa-3 mt-16" color="#FAFAFA" variant="flat">
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      xl="2"
                      class="d-flex justify-start align-center"
                    >
                      <v-row no-gutters>
                        <v-col cols="12">
                          <span class="text-caption">Qr Code Position</span>
                        </v-col>
                        <v-col col="12">
                          <span class="text-caption">Restore Default</span>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      lg="1"
                      xl="1"
                      class="d-flex justify-start align-center"
                    >
                      <v-row no-gutters>
                        <v-text-field
                          hide-details="true"
                          label="Top "
                          clearable
                          v-model="topCreditCardImageBack"
                        ></v-text-field>
                      </v-row>
                    </v-col>

                    <v-col
                      cols="12"
                      md="1"
                      lg="1"
                      xl="1"
                      class="d-flex justify-start align-center pl-1"
                    >
                      <v-row no-gutters>
                        <v-text-field
                          hide-details="true"
                          label="Left "
                          clearable
                          v-model="leftCreditCardImageBack"
                        ></v-text-field>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      xl="2"
                      class="d-flex justify-start align-center pl-1 pr-1"
                    >
                      <v-row no-gutters>
                        <v-select
                          hide-details="true"
                          :items="QRSizes"
                          label="QR Size"
                          v-model="CCQrSizeBack"
                        ></v-select>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      xl="2"
                      class="d-flex justify-start align-center pl-1"
                    >
                      <v-row no-gutters>
                        <v-col cols="12">
                          <span class="text-caption">Pass Number Position</span>
                        </v-col>
                        <v-col col="12">
                          <span class="text-caption">Restore Default</span>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col
                      cols="12"
                      md="2"
                      lg="2"
                      xl="2"
                      class="d-flex justify-start align-center pr-1"
                    >
                      <v-row no-gutters>
                        <v-select
                          hide-details="true"
                          :items="fontSizes"
                          label="Font Size"
                          v-model="creditCardSizeTextSizeBack"
                        ></v-select>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      lg="1"
                      xl="1"
                      class="d-flex justify-start align-center pr-1"
                    >
                      <v-row no-gutters>
                        <v-text-field
                          hide-details="true"
                          label="Top "
                          clearable
                          v-model="topBackPassNumberPositionCreditCard"
                        ></v-text-field>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      lg="1"
                      xl="1"
                      class="d-flex justify-start align-center"
                    >
                      <v-row no-gutters>
                        <v-text-field
                          hide-details="true"
                          label="Left "
                          clearable
                          v-model="leftBackPassNumberPositionCreditCard"
                        ></v-text-field>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <v-col cols="12" class="d-flex justify-end pt-3">
                <v-btn color="primary" @click="submitTemplateA4AndCreditCard"
                  >Submit</v-btn
                >
              </v-col>
            </v-row>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>

      <v-dialog v-model="dialogPreview" width="2480px">
        <v-card>
          <v-col cols="12" class="d-flex justify-end mb-3">
            <v-btn
              color="red"
              icon="mdi-close"
              @click="dialogPreview = false"
            ></v-btn>
          </v-col>

          <v-col
            cols="12"
            class="border-thin pa-5 d-flex justify-center position-relative"
          >
            <v-card class="a4-size">
              <p class="watermarkA4">[Front ]</p>
              <VuetifyViewer
                class="a4-size"
                :maxWidth="'8.27in'"
                :value="frontPageDataUrl"
                markdown-theme="github"
              />

              <qrcode-vue
                v-if="A4FrontQREnabled"
                :size="a4QrSizeFront"
                level="H"
                margin="3"
                :style="{
                  top: topImageFront + '%',
                  left: leftImageFront + '%',
                  transform: 'translate(-50%, -50%)',
                }"
                class="position-absolute"
              />

              <div
                v-if="A4FrontQREnabled"
                :style="{
                  top: topPassNumberPosition + '%',
                  left: leftPassNumberPosition + '%',
                  transform: 'translate(-50%, -50%)',
                }"
                class="position-absolute text-center"
              >
                Pass Number: C01
              </div>
            </v-card>
          </v-col>

          <v-col
            cols="12"
            class="border-thin pa-5 d-flex justify-center position-relative"
          >
            <v-card class="a4-size">
              <p class="watermarkA4">[ Back ]</p>
              <VuetifyViewer
                class="a4-size"
                :maxWidth="'8.27in'"
                :value="backPageDataUrl"
                markdown-theme="github"
              />
              <!-- <img
                :style="{
                  top: topImageBack + '%',
                  left: leftImageBack + '%',
                  transform: 'translate(-50%, -50%)',
                }"
                src="public/images/qr-template/qr.svg"
                class="position-absolute"
                :height="`${a4QrSizeBack}%`"
              /> -->

              <qrcode-vue
                v-if="A4BackQREnabled"
                :size="a4QrSizeBack"
                level="H"
                margin="3"
                :style="{
                  top: topImageBack + '%',
                  left: leftImageBack + '%',
                  transform: 'translate(-50%, -50%)',
                }"
                class="position-absolute"
              />

              <div
                v-if="A4BackQREnabled"
                :style="{
                  top: topPassNumberPosition + '%',
                  left: leftPassNumberPosition + '%',
                  transform: 'translate(-50%, -50%)',
                }"
                class="position-absolute text-center"
              >
                Pass Number: C01
              </div>
            </v-card>
          </v-col>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogPreviewStandardCreditCardSize" width="2480px">
        <v-card>
          <v-col cols="12" class="d-flex justify-end mb-3">
            <v-btn
              color="red"
              icon="mdi-close"
              @click="dialogPreviewStandardCreditCardSize = false"
            ></v-btn>
          </v-col>
          <v-col cols="12" class="py-0 my-0">
            <v-switch
              v-model="flexEnabled"
              color="success"
              label="Enable With Space"
              hide-details
            ></v-switch
          ></v-col>

          <v-row class="d-flex" no-gutters>
            <v-col
              cols="12"
              class="border-thin pa-5 d-flex justify-center position-relative"
            >
              <v-card
                class=""
                :style="{
                  height: '1123.2px',
                  width: '796.8px',
                }"
                elevation="16"
              >
                <v-row no-gutters class="pa-5 position-relative">
                  <v-col
                    cols="6"
                    v-for="n in 3"
                    :key="n"
                    class="ma-0"
                    :style="{ flex: flexEnabled ? 1 : 0 }"
                  >
                    <v-card
                      class="border-dashed border-md ma-0 pa-0 position-relative pa-2"
                      :height="
                        isPortraitOrLandScape ? '369.950px' : '243.712px'
                      "
                      :width="isPortraitOrLandScape ? '243.712px' : '369.950px'"
                      :class="creditCardSizeClassPortraitOrLandscape"
                    >
                      <p class="watermarkCC">[ Front ]</p>
                      <VuetifyViewer
                        :class="creditCardSizeClassPortraitOrLandscape"
                        :style="{
                          maxWidth: isPortraitOrLandScape
                            ? '243.712px'
                            : '369.950px',
                        }"
                        :value="CCFrontWysiwygPageDataUrl"
                        markdown-theme="github"
                      />

                      <qrcode-vue
                        v-if="CCFrontQREnabled"
                        :size="CCQrSizeFront"
                        level="H"
                        :style="{
                          top: `${topCreditCardImageFront - 45}%`,
                          left: `${leftCreditCardImageFront}%`,
                        }"
                        class="position-absolute"
                      />

                      <div
                        v-if="CCFrontQREnabled"
                        :style="{
                          top: `${topPassNumberPositionCreditCard - 45}%`,
                          left: `${leftPassNumberPositionCreditCard}%`,
                          fontSize: creditCardSizeTextSizeFront + 'px',
                          textWrap: 'nowrap',
                        }"
                        class="position-absolute text-center"
                      >
                        Pass Number: C01
                      </div>
                    </v-card>
                    <!-- back -->
                    <v-card
                      border="dashed  lg "
                      class="border-dashed border-md ma-0 pa-0 position-relative pa-2"
                      :height="
                        isPortraitOrLandScape ? '369.950px' : '243.712px'
                      "
                      :width="isPortraitOrLandScape ? '243.712px' : '369.950px'"
                      :class="creditCardSizeClassPortraitOrLandscape"
                    >
                      <p class="watermarkCC">[ Back ]</p>
                      <VuetifyViewer
                        :class="creditCardSizeClassPortraitOrLandscape"
                        :style="{
                          maxWidth: isPortraitOrLandScape
                            ? '243.712px'
                            : '369.950px',
                        }"
                        :value="CCBackWysiwygPageDataUrl"
                        markdown-theme="github"
                      />

                      <qrcode-vue
                        v-if="CCBackQREnabled"
                        :size="CCQrSizeBack"
                        level="H"
                        :style="{
                          top: `${topCreditCardImageBack - 45}%`,
                          left: `${leftCreditCardImageBack}%`,
                        }"
                        class="position-absolute"
                      />

                      <div
                        v-if="CCBackQREnabled"
                        :style="{
                          top: `${topBackPassNumberPositionCreditCard - 45}%`,
                          left: `${leftBackPassNumberPositionCreditCard}%`,
                          fontSize: creditCardSizeTextSizeBack + 'px',
                          textWrap: 'nowrap',
                        }"
                        class="position-absolute"
                      >
                        Pass Number: C01
                      </div>
                    </v-card>
                  </v-col></v-row
                >
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
definePageMeta({
  middleware: ["secure"],
});

const { setSnackbar } = useLocal();
const { addQrCodeTemplate, templateQrCode } = useTemplateReusable();

const { mySite } = useFilter();

const tab = ref(1);
const isA4Enabled = ref<boolean>(false);
const CCEnabled = ref<boolean>(false);
const fontSizes = ref([10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]);
const QRSizes = ref([
  80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 250, 300, 350,
  400, 450, 500,
]);
//if true then portrait else landscape
const isPortraitOrLandScape = ref<boolean>(false);
const templateName = ref<string>("");
const flexEnabled = ref<boolean>(false);
const PrefixPass = ref<string>("");
// const PrefixKey = ref<string>("");

const topImageFront = ref<number>(80);
const leftImageFront = ref<number>(50);
const topImageBack = ref<number>(80);
const leftImageBack = ref<number>(50);
const topPassNumberPosition = ref<number>(90);
const leftPassNumberPosition = ref<number>(50);
const a4TextSizeFront = ref<number>(16);
const a4TextSizeBack = ref<number>(16);
const a4QrSizeFront = ref<number>(100);
const a4QrSizeBack = ref<number>(100);

const topCreditCardImageFront = ref<number>(80);
const leftCreditCardImageFront = ref<number>(35);
const topPassNumberPositionCreditCard = ref<number>(130);
const leftPassNumberPositionCreditCard = ref<number>(30);
const creditCardSizeTextSizeFront = ref<number>(16);
const creditCardSizeTextSizeBack = ref<number>(16);
const topCreditCardImageBack = ref<number>(80);
const leftCreditCardImageBack = ref<number>(35);
const topBackPassNumberPositionCreditCard = ref<number>(130);
const leftBackPassNumberPositionCreditCard = ref<number>(30);
const CCQrSizeFront = ref<number>(100);
const CCQrSizeBack = ref<number>(100);

const frontPage = ref<any>(""); //FrontWysiwyg
const backPage = ref<any>(""); //BackWysiwyg
const CCFrontWysiwyg = ref<any>("");
const CCBackWysiwyg = ref<any>("");

// Enable QR code on front page of credit card
const CCFrontQREnabled = ref<boolean>(true);
const CCBackQREnabled = ref<boolean>(true);

// Enable QR code on front page of A4 size

const A4FrontQREnabled = ref<boolean>(true);
const A4BackQREnabled = ref<boolean>(true);

const dialogPreview = ref<boolean>(false);
const dialogPreviewStandardCreditCardSize = ref<boolean>(false);

const creditCardSizeClassPortraitOrLandscape = computed(() => {
  return isPortraitOrLandScape.value
    ? "credit-card-size-portrait"
    : "credit-card-size-landscape";
});

const handleDescriptionFrontPage = (newContent: any) => {
  frontPage.value = newContent;
};

const handleDescriptionBackPage = (newContent: any) => {
  backPage.value = newContent;
};
const handleDescriptionFrontPageCreditCard = (newContent: any) => {
  CCFrontWysiwyg.value = newContent;
};

const handleDescriptionBackPageCreditCard = (newContent: any) => {
  CCBackWysiwyg.value = newContent;
};

const frontPageDataUrl = ref("");
const backPageDataUrl = ref("");
const CCFrontWysiwygPageDataUrl = ref("");
const CCBackWysiwygPageDataUrl = ref("");

const convertBlobUrlToDataUrl = async (page: any, pageDataUrl: any) => {
  const blobUrlRegex = /blob:http:\/\/localhost:4011\/([a-f0-9\-]+)/g;
  if (page?.value) {
    const matches = Array.from(page.value.matchAll(blobUrlRegex));
    let value = page.value;
    const promises = matches.map(
      (match) =>
        new Promise(async (resolve) => {
          const response = await fetch(match[0]);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result;
            value = value.replace(match[0], base64data);
            resolve();
          };
          reader.readAsDataURL(blob);
        }),
    );
    await Promise.all(promises);
    pageDataUrl.value = value;
  }
};

const isFirstLoad = ref(true);
const querySite = ref("");

onMounted(() => {
  localStorage.removeItem("frontPage");
  localStorage.removeItem("backPage");
  localStorage.removeItem("frontPageCreditCard");
  localStorage.removeItem("backPageCreditCard");
  frontPage.value = "";
  backPage.value = "";
  CCFrontWysiwyg.value = "";
  CCBackWysiwyg.value = "";

  isFirstLoad.value = false;
});

watch(frontPage, () => convertBlobUrlToDataUrl(frontPage, frontPageDataUrl));
watch(backPage, () => convertBlobUrlToDataUrl(backPage, backPageDataUrl));
watch(CCFrontWysiwyg, () =>
  convertBlobUrlToDataUrl(CCFrontWysiwyg, CCFrontWysiwygPageDataUrl),
);
watch(CCBackWysiwyg, () =>
  convertBlobUrlToDataUrl(CCBackWysiwyg, CCBackWysiwygPageDataUrl),
);

const submitTemplateA4AndCreditCard = async () => {
  console.log("A4FrontQREnabled", A4FrontQREnabled.value);
  Object.assign(templateQrCode.value, {
    A4FrontPassLeft: leftPassNumberPosition.value,
    A4FrontPassTop: topPassNumberPosition.value,
    A4FrontQRCodeLeft: leftImageFront.value,
    A4FrontQRCodeSize: a4QrSizeFront.value,
    A4FrontQRCodeTop: topImageFront.value,
    A4FrontPassSize: a4TextSizeFront.value,
    A4Enabled: isA4Enabled.value,
    name: templateName.value,
    site: mySite.value,
    A4Orientation: "portrait",
    A4FrontWysiwyg: frontPage.value,
    A4BackWysiwyg: backPage.value,
    A4BackQRCodeTop: topImageBack.value,
    A4BackQRCodeLeft: leftImageBack.value,
    A4BackQRCodeSize: a4QrSizeBack.value,
    A4BackPassSize: a4TextSizeBack.value,
    A4BackPassTop: topPassNumberPosition.value,
    A4BackPassLeft: leftPassNumberPosition.value,
    CCFrontWysiwyg: CCFrontWysiwyg.value,
    CCFrontQRCodeTop: topCreditCardImageFront.value,
    CCFrontQRCodeLeft: leftCreditCardImageFront.value,
    CCFrontQRCodeSize: CCQrSizeFront.value,
    CCFrontPassSize: creditCardSizeTextSizeFront.value,
    CCFrontPassTop: topPassNumberPositionCreditCard.value,
    CCFrontPassLeft: leftPassNumberPositionCreditCard.value,
    CCBackWysiwyg: CCBackWysiwyg.value,
    CCBackQRCodeTop: topCreditCardImageBack.value,
    CCBackQRCodeLeft: leftBackPassNumberPositionCreditCard.value,
    CCBackQRCodeSize: CCQrSizeBack.value,
    CCBackPassSize: creditCardSizeTextSizeBack.value,
    CCEnabled: CCEnabled.value,
    CCBackPassTop: topBackPassNumberPositionCreditCard.value,
    CCBackPassLeft: leftBackPassNumberPositionCreditCard.value,
    CCOrientation: isPortraitOrLandScape.value ? "portrait" : "landscape",
    status: "active",
    prefixPass: PrefixPass.value,
    CCFrontQREnabled: CCFrontQREnabled.value,
    CCBackQREnabled: CCBackQREnabled.value,
    A4FrontQREnabled: A4FrontQREnabled.value,
    A4BackQREnabled: A4BackQREnabled.value,
    // prefixKey: PrefixKey.value,
  });

  console.log("templateQrCode.value", templateQrCode.value);

  try {
    console.log(templateQrCode.value);
    await addQrCodeTemplate(templateQrCode.value);

    setSnackbar({
      text: "Template successfully added!",
      modal: true,
      type: "success",
    });
    localStorage.removeItem("frontPage");
    localStorage.removeItem("backPage");
    localStorage.removeItem("frontPageCreditCard");
    localStorage.removeItem("backPageCreditCard");
    frontPage.value = "";
    backPage.value = "";
    CCFrontWysiwyg.value = "";
    CCBackWysiwyg.value = "";
    await goBack();
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
};

async function goBack() {
  console.log("go back", mySite.value);
  navigateTo({
    name: "keys-manage-pass-template",
    query: { site: mySite.value },
  });
}
const parseValue = (value: any) => parseFloat(value ?? 0);
// Front QR Code Left Position
const qrCodeLeftPosition = computed(() => {
  let leftValue = parseValue(leftCreditCardImageFront.value);
  console.log("isPortraitOrLandScape", isPortraitOrLandScape.value);
  if (isPortraitOrLandScape.value) {
    if (leftValue <= 36) {
      leftValue -= 60;
    } else if (leftValue <= 40) {
      leftValue -= 38;
    } else if (leftValue <= 47) {
      leftValue -= 20;
    } else if (leftValue <= 49) {
      leftValue -= 5;
    } else if (leftValue <= 48) {
      leftValue -= 10;
    } else if (leftValue >= 64) {
      leftValue += 60;
    } else if (leftValue >= 60) {
      leftValue += 40;
    } else if (leftValue >= 58) {
      leftValue += 29;
    } else if (leftValue >= 54) {
      leftValue += 22;
    } else if (leftValue >= 52) {
      leftValue += 10;
    } else if (leftValue >= 51) {
      leftValue += 5;
    }
  } else {
    if (leftValue <= 30) {
      leftValue -= 60;
    } else if (leftValue <= 32) {
      leftValue -= 35;
    } else if (leftValue <= 33) {
      leftValue -= 30;
    } else if (leftValue <= 36) {
      leftValue -= 25;
    } else if (leftValue <= 40) {
      leftValue -= 20;
    } else if (leftValue <= 45) {
      leftValue -= 10;
    } else if (leftValue <= 49) {
      leftValue -= 10;
    } else if (leftValue >= 85) {
      leftValue += 60;
    } else if (leftValue >= 70) {
      leftValue += 40;
    } else if (leftValue >= 65) {
      leftValue += 25;
    } else if (leftValue >= 60) {
      leftValue += 20;
    } else if (leftValue >= 55) {
      leftValue += 13;
    } else if (leftValue >= 51) {
      leftValue += 10;
    }
  }

  return `${leftValue}%`;
});

// Back QR Code Left Position
const qrCodeBackLeftPosition = computed(() => {
  let leftValue = parseValue(leftCreditCardImageBack.value);

  if (isPortraitOrLandScape.value) {
    if (leftValue <= 36) {
      leftValue -= 60;
    } else if (leftValue <= 40) {
      leftValue -= 38;
    } else if (leftValue <= 47) {
      leftValue -= 20;
    } else if (leftValue <= 49) {
      leftValue -= 5;
    } else if (leftValue <= 48) {
      leftValue -= 10;
    } else if (leftValue >= 64) {
      leftValue += 60;
    } else if (leftValue >= 60) {
      leftValue += 40;
    } else if (leftValue >= 58) {
      leftValue += 29;
    } else if (leftValue >= 54) {
      leftValue += 22;
    } else if (leftValue >= 52) {
      leftValue += 10;
    } else if (leftValue >= 51) {
      leftValue += 5;
    }
  } else {
    if (leftValue <= 30) {
      leftValue -= 60;
    } else if (leftValue <= 32) {
      leftValue -= 35;
    } else if (leftValue <= 33) {
      leftValue -= 30;
    } else if (leftValue <= 36) {
      leftValue -= 25;
    } else if (leftValue <= 40) {
      leftValue -= 20;
    } else if (leftValue <= 45) {
      leftValue -= 15;
    } else if (leftValue <= 49) {
      leftValue -= 10;
    } else if (leftValue >= 85) {
      leftValue += 60;
    } else if (leftValue >= 70) {
      leftValue += 40;
    } else if (leftValue >= 65) {
      leftValue += 25;
    } else if (leftValue >= 60) {
      leftValue += 20;
    } else if (leftValue >= 55) {
      leftValue += 15;
    } else if (leftValue >= 51) {
      leftValue += 10;
    }
  }

  return `${leftValue}%`;
});

// Back pass left position
const qrCodeBackPassLeftPosition = computed(() => {
  let leftValue = parseValue(leftBackPassNumberPositionCreditCard.value);

  if (isPortraitOrLandScape) {
    if (leftValue <= 36) {
      leftValue -= 60;
    } else if (leftValue <= 40) {
      leftValue -= 38;
    } else if (leftValue <= 47) {
      leftValue -= 20;
    } else if (leftValue <= 49) {
      leftValue -= 5;
    } else if (leftValue <= 48) {
      leftValue -= 10;
    } else if (leftValue >= 64) {
      leftValue += 60;
    } else if (leftValue >= 60) {
      leftValue += 40;
    } else if (leftValue >= 58) {
      leftValue += 29;
    } else if (leftValue >= 54) {
      leftValue += 22;
    } else if (leftValue >= 52) {
      leftValue += 10;
    } else if (leftValue >= 51) {
      leftValue += 5;
    }
  } else {
    if (leftValue <= 30) {
      leftValue -= 60;
    } else if (leftValue <= 32) {
      leftValue -= 35;
    } else if (leftValue <= 33) {
      leftValue -= 30;
    } else if (leftValue <= 36) {
      leftValue -= 25;
    } else if (leftValue <= 40) {
      leftValue -= 20;
    } else if (leftValue <= 45) {
      leftValue -= 15;
    } else if (leftValue <= 49) {
      leftValue -= 10;
    } else if (leftValue >= 85) {
      leftValue += 60;
    } else if (leftValue >= 70) {
      leftValue += 40;
    } else if (leftValue >= 65) {
      leftValue += 25;
    } else if (leftValue >= 60) {
      leftValue += 20;
    } else if (leftValue >= 55) {
      leftValue += 15;
    } else if (leftValue >= 51) {
      leftValue += 10;
    }
  }

  return `${leftValue}%`;
});

const qrCodeFrontPassLeftPosition = computed(() => {
  let leftValue = parseValue(leftPassNumberPositionCreditCard.value);

  if (isPortraitOrLandScape) {
    if (leftValue <= 36) {
      leftValue -= 60;
    } else if (leftValue <= 40) {
      leftValue -= 38;
    } else if (leftValue <= 47) {
      leftValue -= 20;
    } else if (leftValue <= 49) {
      leftValue -= 5;
    } else if (leftValue <= 48) {
      leftValue -= 10;
    } else if (leftValue >= 64) {
      leftValue += 60;
    } else if (leftValue >= 60) {
      leftValue += 40;
    } else if (leftValue >= 58) {
      leftValue += 29;
    } else if (leftValue >= 54) {
      leftValue += 22;
    } else if (leftValue >= 52) {
      leftValue += 10;
    } else if (leftValue >= 51) {
      leftValue += 5;
    }
  } else {
    if (leftValue <= 30) {
      leftValue -= 60;
    } else if (leftValue <= 32) {
      leftValue -= 35;
    } else if (leftValue <= 33) {
      leftValue -= 30;
    } else if (leftValue <= 36) {
      leftValue -= 25;
    } else if (leftValue <= 40) {
      leftValue -= 20;
    } else if (leftValue <= 45) {
      leftValue -= 15;
    } else if (leftValue <= 49) {
      leftValue -= 10;
    } else if (leftValue >= 85) {
      leftValue += 60;
    } else if (leftValue >= 70) {
      leftValue += 40;
    } else if (leftValue >= 65) {
      leftValue += 25;
    } else if (leftValue >= 60) {
      leftValue += 20;
    } else if (leftValue >= 55) {
      leftValue += 15;
    } else if (leftValue >= 51) {
      leftValue += 10;
    }
  }

  return `${leftValue}%`;
});
</script>

<style scoped>
.a4-size {
  width: 794px;
  height: 561.5px;
  padding: 20px;
}

.credit-card-size-landscape {
  height: 203.904px;
  width: 323.52px;
}
.credit-card-size-portrait {
  width: 203.904px;
  height: 323.52px;
}

.no-flex-grow {
  flex-grow: 0 !important;
}

.rotingtxt {
  -webkit-transform: rotate(331deg);
  -moz-transform: rotate(331deg);
  -o-transform: rotate(331deg);
  transform: rotate(331deg);
  font-size: 2em;
  color: rgba(255, 5, 5, 0.17);
  position: absolute;
  font-family: "Denk One", sans-serif;
  text-transform: uppercase;
  padding-left: 1%;
  padding-top: 20%;
}
.watermarkA4 {
  font-size: 3em;
  color: rgba(128, 128, 128, 0.17);
  position: absolute;
  font-family: "Denk One", sans-serif;
  text-transform: uppercase;
  padding-left: 65%;
  top: 0;
}

.watermarkCC {
  font-size: 1 em;
  color: rgba(128, 128, 128, 0.17);
  position: absolute;
  font-family: "Denk One", sans-serif;
  text-transform: uppercase;
  padding-left: 65%;
  top: 0;
}
:deep() .vuetify-pro-tiptap .ProseMirror {
  min-height: 180px;
  padding: 0px !important;
  overflow-wrap: anywhere;
}
</style>
