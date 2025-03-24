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

              <v-col cols="12" class="pt-3">
                <v-row no-gutters>
                  <v-col :cols="$vuetify.display.xs ? 12 : 6">
                    <v-text-field
                      label="Enter Template Name"
                      v-model="templateQrCode.name"
                      type="input"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    :cols="$vuetify.display.xs ? 12 : 6"
                    :class="{ 'pl-1': !$vuetify.display.xs }"
                  >
                    <v-text-field
                      label="Enter Template Prefix pass"
                      v-model="templateQrCode.prefixPass"
                      type="input"
                    ></v-text-field>
                  </v-col>

                  <!-- <v-col cols="6" class="pl-1">
                    <v-text-field
                      label="Enter Template Prefix key"
                      v-model="templateQrCode.prefixKey"
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
                      <span class="text-subtitle-1 mr-2 d-flex align-center">
                        Enable A4 Size
                      </span>
                      <v-card
                        class="pa-3 rounded-lg mr-3"
                        @click="templateQrCode.A4Enabled = true"
                      >
                        <v-row>
                          <v-col col="6"> Yes</v-col>
                          <v-col col="6">
                            <v-icon
                              :color="
                                templateQrCode.A4Enabled ? 'green' : 'gray'
                              "
                            >
                              {{
                                templateQrCode.A4Enabled
                                  ? "mdi-check-circle"
                                  : "mdi-check-circle-outline"
                              }}
                            </v-icon>
                          </v-col>
                        </v-row>
                      </v-card>
                      <v-card
                        class="pa-3 rounded-lg"
                        @click="templateQrCode.A4Enabled = false"
                      >
                        <v-row>
                          <v-col col="6"> No</v-col>
                          <v-col col="6">
                            <v-icon
                              :color="
                                !templateQrCode.A4Enabled ? 'green' : 'gray'
                              "
                            >
                              {{
                                !templateQrCode.A4Enabled
                                  ? "mdi-check-circle"
                                  : "mdi-check-circle-outline"
                              }}
                            </v-icon>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                    <v-col cols="12" class="d-flex justify-end pa-0">
                      <v-switch
                        v-model="templateQrCode.A4FrontQREnabled"
                        :label="
                          templateQrCode.A4FrontQREnabled
                            ? 'Disable QR'
                            : 'Enable QR'
                        "
                        hide-details
                        inset
                        color="primary"
                      ></v-switch>
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
                </v-row>
              </v-col>
              <v-col cols="12" class="pt-3 position-relative">
                <tiptap-editor-qr
                  @content-updated="handleDescriptionFrontPage"
                  :initialContent="templateQrCode.A4FrontWysiwyg"
                  maxHeight="707px"
                  minHeight="707px"
                  storageKey="frontPage"
                  :clearOnLoad="isFirstLoad"
                />
                <div
                  :style="{
                    top: templateQrCode.A4FrontQRCodeTop + '%',
                    left: templateQrCode.A4FrontQRCodeLeft + '%',
                    transform: 'translate(-50%, -50%)',
                  }"
                  class="position-absolute"
                >
                  <qrcode-vue
                    v-if="templateQrCode.A4FrontQREnabled"
                    :size="templateQrCode.A4FrontQRCodeSize"
                    level="H"
                  />
                </div>

                <!-- <qrcode-vue
                  v-if="templateQrCode.A4FrontQREnabled"
                  :size="templateQrCode.A4FrontQRCodeSize"
                  level="H"
                  margin="3"
                  :style="{
                    top: templateQrCode.A4FrontQRCodeTop + '%',
                    left: templateQrCode.A4FrontQRCodeLeft + '%',
                    transform: 'translate(-50%, -50%)',
                  }"
                  class="position-absolute"
                /> -->
                <div
                  v-if="templateQrCode.A4FrontQREnabled"
                  :style="{
                    top: templateQrCode.A4FrontPassTop + '%',
                    left: templateQrCode.A4FrontPassLeft + '%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: templateQrCode.A4FrontPassSize + 'px',
                  }"
                  class="position-absolute text-center"
                >
                  Pass Number: C01
                </div>
              </v-col>
              <v-col cols="12" class="">
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
                          v-model="templateQrCode.A4FrontQRCodeTop"
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
                          v-model="templateQrCode.A4FrontQRCodeLeft"
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
                          v-model="templateQrCode.A4FrontQRCodeSize"
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
                          v-model="templateQrCode.A4FrontPassSize"
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
                          v-model="templateQrCode.A4FrontPassTop"
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
                          v-model="templateQrCode.A4FrontPassLeft"
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
                      v-model="templateQrCode.A4BackQREnabled"
                      :label="
                        templateQrCode.A4BackQREnabled
                          ? 'Disable QR'
                          : 'Enable QR'
                      "
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
                  :initialContent="templateQrCode.A4BackWysiwyg"
                  maxHeight="707px"
                  minHeight="707px"
                  storageKey="backPage"
                  :clearOnLoad="isFirstLoad"
                />
                <div
                  :style="{
                    top: templateQrCode.A4BackQRCodeTop + '%',
                    left: templateQrCode.A4BackQRCodeLeft + '%',
                    transform: 'translate(-50%, -50%)',
                  }"
                  class="position-absolute"
                >
                  <qrcode-vue
                    v-if="templateQrCode.A4BackQREnabled"
                    :size="templateQrCode.A4BackQRCodeSize"
                    level="H"
                  />
                </div>

                <!-- <qrcode-vue
                  v-if="templateQrCode.A4BackQREnabled"
                  :size="templateQrCode.A4BackQRCodeSize"
                  level="H"
                  margin="3"
                  :style="{
                    top: templateQrCode.A4BackQRCodeTop + '%',
                    left: templateQrCode.A4BackQRCodeLeft + '%',
                    transform: 'translate(-50%, -50%)',
                  }"
                  class="position-absolute"
                /> -->
                <div
                  v-if="templateQrCode.A4BackQREnabled"
                  :style="{
                    top: templateQrCode.A4BackPassTop + '%',
                    left: templateQrCode.A4BackPassLeft + '%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: templateQrCode.A4BackPassSize + 'px',
                  }"
                  class="position-absolute text-center"
                >
                  Pass Number: C01
                </div>
              </v-col>
              <v-col cols="12" class="">
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
                          v-model="templateQrCode.A4BackQRCodeTop"
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
                          v-model="templateQrCode.A4BackQRCodeLeft"
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
                          v-model="templateQrCode.A4BackQRCodeSize"
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
                          v-model="templateQrCode.A4BackPassSize"
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
                          v-model="templateQrCode.A4BackPassTop"
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
                          v-model="templateQrCode.A4BackPassLeft"
                        ></v-text-field>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <v-col cols="12" class="d-flex justify-end pt-3">
                <v-btn
                  color="primary"
                  @click="
                    !isViewOnly ? submitTemplateA4AndCreditCard() : goBack()
                  "
                >
                  {{ !isViewOnly ? "submit" : "back" }}
                </v-btn>
              </v-col>
            </v-row>
          </v-tabs-window-item>
        </v-tabs-window>

        <v-tabs-window v-if="tab === 2" v-model="tab">
          <v-tabs-window-item :value="2">
            <v-row no-gutters class="pa-6 px-15">
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
                      v-model="templateQrCode.name"
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
                      v-model="templateQrCode.prefixPass"
                      type="input"
                    ></v-text-field>
                  </v-col>
                  <!-- 
                  <v-col cols="6" class="pl-1">
                    <v-text-field
                      label="Enter Template Prefix key"
                      v-model="templateQrCode.prefixKey"
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
                        @click="templateQrCode.CCEnabled = true"
                      >
                        <v-row>
                          <v-col col="6"> Yes</v-col>
                          <v-col col="6">
                            <v-icon
                              :color="
                                templateQrCode.CCEnabled ? 'green' : 'gray'
                              "
                            >
                              {{
                                templateQrCode.CCEnabled
                                  ? "mdi-check-circle"
                                  : "mdi-check-circle-outline"
                              }}
                            </v-icon>
                          </v-col>
                        </v-row>
                      </v-card>
                      <v-card
                        class="pa-3 rounded-lg"
                        @click="templateQrCode.CCEnabled = false"
                      >
                        <v-row>
                          <v-col col="6"> No</v-col>
                          <v-col col="6">
                            <v-icon
                              :color="
                                !templateQrCode.CCEnabled ? 'green' : 'gray'
                              "
                            >
                              {{
                                !templateQrCode.CCEnabled
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
                        @click="templateQrCode.CCOrientation = 'portrait'"
                      >
                        <v-row>
                          <v-col col="6"> Portrait</v-col>
                          <v-col col="6">
                            <v-icon
                              :color="
                                templateQrCode.CCOrientation === 'portrait'
                                  ? 'green'
                                  : 'gray'
                              "
                            >
                              {{
                                templateQrCode.CCOrientation === "portrait"
                                  ? "mdi-check-circle"
                                  : "mdi-check-circle-outline"
                              }}
                            </v-icon>
                          </v-col>
                        </v-row>
                      </v-card>
                      <v-card
                        class="pa-3 rounded-lg"
                        @click="templateQrCode.CCOrientation = 'landscape'"
                      >
                        <v-row>
                          <v-col col="6"> Landscape</v-col>
                          <v-col col="6">
                            <v-icon
                              :color="
                                templateQrCode.CCOrientation === 'landscape'
                                  ? 'green'
                                  : 'gray'
                              "
                            >
                              {{
                                templateQrCode.CCOrientation === "landscape"
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
                      v-model="templateQrCode.CCFrontQREnabled"
                      :label="
                        templateQrCode.CCFrontQREnabled
                          ? 'Disable QR'
                          : 'Enable QR'
                      "
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
                  class="editor-container justify-center align-center pa-0 ma-0"
                  :style="{
                    position: 'relative',
                    display: 'inline-block',
                    width:
                      templateQrCode.CCOrientation === 'portrait'
                        ? '243.712px'
                        : '369.950px',
                    height:
                      templateQrCode.CCOrientation === 'portrait'
                        ? '369.950px'
                        : '243.712px',
                  }"
                >
                  <tiptap-editor-qr
                    class="pa-0 ma-0"
                    @content-updated="handleDescriptionFrontPageCreditCard"
                    :initialContent="templateQrCode.CCFrontWysiwyg"
                    :maxHeight="
                      templateQrCode.CCOrientation === 'portrait'
                        ? '369.950px'
                        : '243.712px'
                    "
                    :minHeight="
                      templateQrCode.CCOrientation === 'portrait'
                        ? '369.950px'
                        : '243.712px'
                    "
                    :maxWidth="
                      templateQrCode.CCOrientation === 'portrait'
                        ? '243.712px'
                        : '369.950px'
                    "
                    storageKey="frontPageCreditCard"
                    :clearOnLoad="isFirstLoad"
                  />

                  <!-- QR Code -->
                  <div
                    :style="{
                      top: `${templateQrCode.CCFrontQRCodeTop}%`,
                      left: `${templateQrCode.CCFrontQRCodeLeft}%`,
                    }"
                    class="position-absolute"
                  >
                    <qrcode-vue
                      v-if="templateQrCode.CCFrontQREnabled"
                      :size="templateQrCode.CCFrontQRCodeSize"
                      level="H"
                    />
                  </div>

                  <!-- <qrcode-vue
                    v-if="templateQrCode.CCFrontQREnabled"
                    :size="templateQrCode.CCFrontQRCodeSize"
                    level="H"
                    :style="{
                      backgroundColor: 'red',
                      top: `${templateQrCode.CCFrontQRCodeTop}%`,
                      left: `${templateQrCode.CCFrontQRCodeLeft}%`,
                    }"
                    class="position-absolute"
                  /> -->

                  <div
                    v-if="templateQrCode.CCFrontQREnabled"
                    :style="{
                      top: `${templateQrCode.CCFrontPassTop}%`,
                      left: `${templateQrCode.CCFrontPassLeft}%`,
                      fontSize: `${templateQrCode.CCFrontPassSize}px`,
                      textWrap: 'nowrap',
                    }"
                    class="position-absolute"
                  >
                    Pass Number: C01
                  </div>
                </div>

                <!-- <qrcode-vue
                  v-if="templateQrCode.CCFrontQREnabled"
                  :size="templateQrCode.CCFrontQRCodeSize"
                  level="H"
                  :style="{
                    top: `${Math.max(
                      0,
                      Math.min(
                        100,
                        parseFloat(templateQrCode.CCFrontQRCodeTop),
                      ),
                    )}%`,
                    left: `${Math.max(
                      0,
                      Math.min(
                        100,
                        parseFloat(templateQrCode.CCFrontQRCodeLeft),
                      ),
                    )}%`,
                    transform: 'translate(-50%, -50%)',
                  }"
                  class="position-absolute"
                /> -->

                <!-- Pass Number -->

                <!-- <div
                  v-if="templateQrCode.CCFrontQREnabled"
                  :style="{
                    top: `${Math.max(
                      0,
                      Math.min(100, parseFloat(templateQrCode.CCFrontPassTop)),
                    )}%`,
                    left: `${Math.max(
                      0,
                      Math.min(100, parseFloat(templateQrCode.CCFrontPassLeft)),
                    )}%`,
                    transform: 'translate(-50%, -50%)',
                    fontSize: `${templateQrCode.CCFrontPassSize}px`,
                  }"
                  class="position-absolute text-center"
                >
                  Pass Number: C01
                </div> -->
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
                          v-model="templateQrCode.CCFrontQRCodeTop"
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
                          v-model="templateQrCode.CCFrontQRCodeLeft"
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
                          v-model="templateQrCode.CCFrontQRCodeSize"
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
                          v-model="templateQrCode.CCFrontPassSize"
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
                          v-model="templateQrCode.CCFrontPassTop"
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
                          v-model="templateQrCode.CCFrontPassLeft"
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
                      v-model="templateQrCode.CCBackQREnabled"
                      :label="
                        templateQrCode.CCBackQREnabled
                          ? 'Disable QR'
                          : 'Enable QR'
                      "
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
                    width:
                      templateQrCode.CCOrientation === 'portrait'
                        ? '243.712px'
                        : '369.950px',
                    height:
                      templateQrCode.CCOrientation === 'portrait'
                        ? '369.950px'
                        : '243.712px',
                  }"
                >
                  <tiptap-editor-qr
                    @content-updated="handleDescriptionBackPageCreditCard"
                    :initialContent="templateQrCode.CCBackWysiwyg"
                    :maxHeight="
                      templateQrCode.CCOrientation === 'portrait'
                        ? '369.950px'
                        : '243.712px'
                    "
                    :minHeight="
                      templateQrCode.CCOrientation === 'portrait'
                        ? '369.950px'
                        : '243.712px'
                    "
                    :maxWidth="
                      templateQrCode.CCOrientation === 'portrait'
                        ? '243.712px'
                        : '369.950px'
                    "
                    storageKey="backPageCreditCard"
                    :clearOnLoad="isFirstLoad"
                  />
                  <div
                    :style="{
                      top: `${templateQrCode.CCBackQRCodeTop}%`,
                      left: `${templateQrCode.CCBackQRCodeLeft}%`,
                    }"
                    class="position-absolute"
                  >
                    <qrcode-vue
                      v-if="templateQrCode.CCBackQREnabled"
                      :size="templateQrCode.CCBackQRCodeSize"
                      level="H"
                    />
                  </div>

                  <!-- <qrcode-vue
                    v-if="templateQrCode.CCBackQREnabled"
                    :size="templateQrCode.CCBackQRCodeSize"
                    level="H"
                    :style="{
                      top: `${templateQrCode.CCBackQRCodeTop}%`,
                      left: `${templateQrCode.CCBackQRCodeLeft}%`,
                    }"
                    class="position-absolute"
                  /> -->
                  <!-- <qrcode-vue
                    v-if="templateQrCode.CCBackQREnabled"
                    :size="templateQrCode.CCBackQRCodeSize"
                    level="H"
                    :style="{
                      top: `${Math.max(
                        0,
                        Math.min(
                          100,
                          parseFloat(templateQrCode.CCBackQRCodeTop),
                        ),
                      )}%`,
                      left: `${Math.max(
                        0,
                        Math.min(
                          100,
                          parseFloat(templateQrCode.CCBackQRCodeLeft),
                        ),
                      )}%`,
                      transform: 'translate(-50%, -50%)',
                    }"
                    class="position-absolute"
                  /> -->

                  <div
                    v-if="templateQrCode.CCBackQREnabled"
                    :style="{
                      top: `${templateQrCode.CCBackPassTop}%`,
                      left: `${templateQrCode.CCBackPassLeft}%`,
                      fontSize: `${templateQrCode.CCBackPassSize}px`,
                      textWrap: 'nowrap',
                    }"
                    class="position-absolute text-center"
                  >
                    Pass Number: C01
                  </div>
                  <!-- <div
                    v-if="templateQrCode.CCBackQREnabled"
                    :style="{
                      top: `${Math.max(
                        0,
                        Math.min(100, parseFloat(templateQrCode.CCBackPassTop)),
                      )}%`,
                      left: `${Math.max(
                        0,
                        Math.min(
                          100,
                          parseFloat(templateQrCode.CCBackPassLeft),
                        ),
                      )}%`,
                      transform: 'translate(-50%, -50%)',
                      fontSize: `${templateQrCode.CCBackPassSize}px`,
                    }"
                    class="position-absolute text-center"
                  >
                    Pass Number: C01
                  </div> -->
                </div>

                <!-- <div
                  v-if="templateQrCode.CCBackQREnabled"
                  :style="{
                    top: templateQrCode.CCBackPassTop + '%',
                    left: templateQrCode.CCBackPassLeft + '%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: templateQrCode.CCBackPassSize + 'px',
                  }"
                  class="position-absolute text-center"
                >
                  Pass Number: C01
                </div> -->
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
                          v-model="templateQrCode.CCBackQRCodeTop"
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
                          v-model="templateQrCode.CCBackQRCodeLeft"
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
                          v-model="templateQrCode.CCBackQRCodeSize"
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
                          v-model="templateQrCode.CCBackPassSize"
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
                          v-model="templateQrCode.CCBackPassTop"
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
                          v-model="templateQrCode.CCBackPassLeft"
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
              <p class="watermark">[ Front ]</p>
              <VuetifyViewer
                class="a4-size"
                :maxWidth="'8.27in'"
                :value="templateQrCode.A4FrontWysiwyg"
                markdown-theme="github"
              />

              <qrcode-vue
                :size="templateQrCode.A4FrontQRCodeSize"
                level="H"
                margin="3"
                :style="{
                  top: templateQrCode.A4FrontQRCodeTop + '%',
                  left: templateQrCode.A4FrontQRCodeLeft + '%',
                  transform: 'translate(-50%, -50%)',
                }"
                class="position-absolute"
              />

              <div
                :style="{
                  top: templateQrCode.A4FrontPassTop + '%',
                  left: templateQrCode.A4FrontPassLeft + '%',
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
              <p class="watermark">[ Back ]</p>
              <VuetifyViewer
                class="a4-size"
                :maxWidth="'8.27in'"
                :value="templateQrCode.A4BackWysiwyg"
                markdown-theme="github"
              />

              <qrcode-vue
                :size="templateQrCode.A4BackQRCodeSize"
                level="H"
                margin="3"
                :style="{
                  top: templateQrCode.A4BackQRCodeTop + '%',
                  left: templateQrCode.A4BackQRCodeLeft + '%',
                  transform: 'translate(-50%, -50%)',
                }"
                class="position-absolute"
              />

              <div
                :style="{
                  top: templateQrCode.A4BackPassTop + '%',
                  left: templateQrCode.A4BackPassLeft + '%',
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
                <!-- <v-card
                class=""
                :style="{
                  height: '1123.2px',
                  width: '796.8px',
                }"
                elevation="16"
              > -->
                <v-row no-gutters class="pa-5 position-relative">
                  <v-col
                    cols="6"
                    v-for="n in 3"
                    :key="n"
                    class="ma-0"
                    :style="{
                      flex: flexEnabled ? 1 : 0,
                    }"
                  >
                    <v-card
                      class="border-dashed border-md ma-0 pa-0 position-relative pa-2"
                      :height="
                        templateQrCode.CCOrientation === 'portrait'
                          ? '369.950px'
                          : '243.712px'
                      "
                      :width="
                        templateQrCode.CCOrientation === 'portrait'
                          ? '243.712px'
                          : '369.950px'
                      "
                      :class="creditCardSizeClassPortraitOrLandscape"
                    >
                      <p class="watermarkCC">[ Front ]</p>

                      <VuetifyViewer
                        :class="creditCardSizeClassPortraitOrLandscape"
                        :style="{
                          maxWidth:
                            templateQrCode.CCOrientation === 'portrait'
                              ? '243.712px'
                              : '369.950px',
                        }"
                        :value="templateQrCode.CCFrontWysiwyg"
                        markdown-theme="github"
                      />

                      <qrcode-vue
                        v-if="templateQrCode.CCFrontQREnabled"
                        :size="templateQrCode.CCFrontQRCodeSize"
                        level="H"
                        :style="{
                          top: `${templateQrCode.CCFrontQRCodeTop - 45}%`,
                          left: `${templateQrCode.CCFrontQRCodeLeft}%`,
                        }"
                        class="position-absolute"
                      />

                      <!-- Pass Number -->
                      <!-- <div :style="computedStyle" class="pass-number-preview">
                        Pass Number: C01
                      </div> -->
                      <div
                        :style="{
                          top: `${templateQrCode.CCFrontPassTop - 45}%`,
                          left: `${templateQrCode.CCFrontPassLeft}%`,
                          fontSize: templateQrCode.CCFrontPassSize + 'px',
                          textWrap: 'nowrap',
                        }"
                        class="position-absolute"
                      >
                        Pass Number: C01
                      </div>
                    </v-card>

                    <!-- back card -->
                    <v-card
                      class="border-dashed border-md ma-0 pa-0 position-relative pa-2"
                      :class="creditCardSizeClassPortraitOrLandscape"
                      :height="
                        templateQrCode.CCOrientation === 'portrait'
                          ? '369.950px'
                          : '243.712px'
                      "
                      :width="
                        templateQrCode.CCOrientation === 'portrait'
                          ? '243.712px'
                          : '369.950px'
                      "
                    >
                      <p class="watermarkCC">[ Back ]</p>
                      <VuetifyViewer
                        :class="creditCardSizeClassPortraitOrLandscape"
                        :style="{
                          maxWidth:
                            templateQrCode.CCOrientation === 'portrait'
                              ? '243.712px'
                              : '369.950px',
                        }"
                        :value="templateQrCode.CCBackWysiwyg"
                        markdown-theme="github"
                      />

                      <!-- <qrcode-vue
                        :size="templateQrCode.CCBackQRCodeSize"
                        level="H"
                        margin="3"
                        :style="{
                          top: templateQrCode.CCBackQRCodeTop + '%',
                          left: templateQrCode.CCBackQRCodeLeft + '%',
                          transform: 'translate(-50%, -50%)',
                        }"
                        class="position-absolute"
                      /> -->
                      <qrcode-vue
                        v-if="templateQrCode.CCBackQREnabled"
                        :size="templateQrCode.CCBackQRCodeSize"
                        level="H"
                        :style="{
                          top: `${templateQrCode.CCBackQRCodeTop - 45}%`,
                          left: `${templateQrCode.CCBackQRCodeLeft}%`,
                        }"
                        class="position-absolute"
                      />

                      <div
                        v-if="templateQrCode.CCBackQREnabled"
                        :style="{
                          top: `${templateQrCode.CCBackPassTop - 45}%`,
                          left: `${templateQrCode.CCBackPassLeft}%`,
                          fontSize: templateQrCode.CCBackPassSize + 'px',
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

const isViewOnly = useRoute().query.view as string;
const { mySite } = useFilter();

const { setSnackbar } = useLocal();
const {
  addQrCodeTemplate,
  templateQrCode,
  getTemplatesByPageSearch,
  getTemplatesByPageSearchReusable,
} = useTemplateReusable();

const tab = ref(1);

const fontSizes = ref([10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]);
const QRSizes = ref([
  80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 250, 300, 350,
  400, 450, 500,
]);
//if true then portrait else landscape
const isPortraitOrLandScape = ref<boolean>(false);
const templateName = ref<string>("");

const topImageFront = ref<number>(80);

const flexEnabled = ref(false); //

const frontPage = ref<any>(""); //FrontWysiwyg
const backPage = ref<any>(""); //BackWysiwyg
const CCFrontWysiwyg = ref<any>("");
const CCBackWysiwyg = ref<any>("");

const dialogPreview = ref<boolean>(false);
const dialogPreviewStandardCreditCardSize = ref<boolean>(false);

const creditCardSizeClassPortraitOrLandscape = computed(() => {
  return templateQrCode.value.CCOrientation === "landscape"
    ? "credit-card-size-landscape"
    : "credit-card-size-portrait";
});

const handleDescriptionFrontPage = (newContent: any) => {
  templateQrCode.value.A4FrontWysiwyg = newContent;
};

const handleDescriptionBackPage = (newContent: any) => {
  templateQrCode.value.A4BackWysiwyg = newContent;
};
const handleDescriptionFrontPageCreditCard = (newContent: any) => {
  templateQrCode.value.CCFrontWysiwyg = newContent;
};

const handleDescriptionBackPageCreditCard = (newContent: any) => {
  templateQrCode.value.CCBackWysiwyg = newContent;
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
const route = useRoute();
const querySite = ref("");

onMounted(async () => {
  await fetchTemplateData();
});

async function fetchTemplateData() {
  const id = useRoute().params.id as string;
  const status = route.query.status as string;
  let siteId = mySite.value;
  const data = await getTemplatesByPageSearch({
    _id: id,
    sites: [siteId],
    statuses: [status],
  });
  templateQrCode.value = data.items[0];
}

watch(frontPage, () => convertBlobUrlToDataUrl(frontPage, frontPageDataUrl));
watch(backPage, () => convertBlobUrlToDataUrl(backPage, backPageDataUrl));
watch(CCFrontWysiwyg, () =>
  convertBlobUrlToDataUrl(CCFrontWysiwyg, CCFrontWysiwygPageDataUrl),
);
watch(CCBackWysiwyg, () =>
  convertBlobUrlToDataUrl(CCBackWysiwyg, CCBackWysiwygPageDataUrl),
);

const submitTemplateA4AndCreditCard = async () => {
  try {
    await getTemplatesByPageSearchReusable({
      dataArgument: templateQrCode.value,
      method: "PUT",
    });

    setSnackbar({
      text: "Template successfully updated!",
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
  navigateTo({
    name: "keys-manage-pass-template",
    query: { site: mySite.value },
  });
  // let templateUrl = "/keys/manage-pass-template";

  // if (querySite.value) {
  //   useRouter().push(`/keys/manage-pass-template?site=${querySite.value}`);
  // } else {
  //   useRouter().push(`/keys/manage-pass-template`);
  // }
}
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
/* portrait */
.credit-card-size-portrait {
  width: 369.95px;
  height: 243.712px;
}
/* .credit-card-size-portrait {
  width: 203.904px;
  height: 323.52px;
} */

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
.watermark {
  font-size: 3em;
  color: rgba(128, 128, 128, 0.17);
  position: absolute;
  font-family: "Denk One", sans-serif;
  text-transform: uppercase;
  padding-left: 65%;
  top: 0;
}

.watermarkCC {
  font-size: 1em;
  color: rgba(128, 128, 128, 0.17);
  position: absolute;
  font-family: "Denk One", sans-serif;
  text-transform: uppercase;
  padding-left: 62%;
  top: 0;
}

/* :deep() .vuetify-pro-tiptap-editor__content {
  background-color: green !important;
} */

:deep() .vuetify-pro-tiptap .ProseMirror {
  min-height: 180px;
  padding: 0px !important;
  overflow-wrap: anywhere;
}
</style>
