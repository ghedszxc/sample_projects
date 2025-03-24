<template>
  <v-dialog
    v-model="editVisitorDialog"
    transition="dialog-right-transition"
    fullscreen
    persistent
    :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
  >
    <v-card
      :loading="isProgress"
      :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
      :class="`${theme == 'light' && 'bg-white'} px-3 h-100 ${$vuetify.display.mdAndUp && 'rounded-s-xl'}`"
    >
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="orange"
          height="8"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
        <span class="font-weight-bold pl-4 pt-1 text-capitalize">{{
          visitor.type ? `Update ${visitor.type} Details` : "Visitor"
        }}</span>
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          icon="mdi-close"
          @click="onCloseDialog()"
        ></v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text>
        <v-row :class="`h-100 ${!uploadUsingCsv && 'align-center'}`">
          <v-col cols="12" v-if="!visitor.type">
            <v-img src="/images/add-visitor.svg" />
            <div class="text-center my-6 text-subtitle-2">
              Please Select Visitor Type
            </div>

            <v-btn
              v-for="(item, key) in visitorTypes"
              :key="key"
              :class="`${key && 'mt-4'}`"
              block
              color="blue-darken-3"
              size="small"
              variant="flat"
              style="height: 40px"
              @click="onSelectVisitorType(item)"
            >
              {{ item.title }}
            </v-btn>
          </v-col>

          <v-col cols="12" class="mb-4" v-if="visitor.type == 'guest'">
            <v-form ref="guestForm">
              <v-col cols="12" class="mb-5">
                <v-img
                  :src="`/images/${addVisitorSteps <= 2 ? 'visitor-guest.svg' : 'confirmation.svg'}`"
                  height="125"
                />
              </v-col>

              <v-col cols="12" v-if="addVisitorSteps && addVisitorSteps <= 2">
                <v-row class="px-3" justify="space-between">
                  <span class="font-weight-bold">
                    <v-btn
                      v-if="addVisitorSteps === 2"
                      size="x-small"
                      variant="flat"
                      class="grey-darken-1"
                      icon="mdi-chevron-left"
                      @click="addVisitorSteps--"
                    />

                    {{
                      addVisitorSteps === 1
                        ? "General"
                        : addVisitorSteps === 2
                          ? "Pass"
                          : "Member"
                    }}
                    Information
                  </span>
                  <v-chip size="small" color="grey-lighten-1">
                    <span :class="`${theme === 'light' && 'text-black'}`">
                      Step
                      <span class="text-blue">{{ addVisitorSteps }}</span
                      >/2
                    </span>
                  </v-chip>
                  <v-col cols="12" class="text-body-2 text-end">
                    <span class="text-red font-weight-bold">* </span>
                    <span> are required fields</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-row v-if="addVisitorSteps == 1">
                <v-col class="d-flex ga-12" cols="12">
                  <v-text-field
                    v-model="visitor.firstName"
                    :rules="[requiredInput]"
                    density="compact"
                    hide-details
                    :disabled="isProgress || isNricOngoingDetection"
                    :loading="isNricOngoingDetection"
                  >
                    <template v-slot:label>
                      Name
                      <span class="text-red font-weight-bold">*</span>
                    </template></v-text-field
                  >
                </v-col>

                <v-col cols="12">
                  <v-menu
                    v-model="nricMenu"
                    :close-on-content-click="false"
                    offset-y
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-if="!displayInput"
                        v-model="visitor.nric"
                        label="NRIC/Passport/ID No. (optional)"
                        hide-details
                        clearable
                        :disabled="isProgress"
                        @input="handleInputNric"
                        @update:modelValue="onSearchNRIC"
                        v-bind="props"
                      >
                        <template v-slot:append>
                          <slot name="append">
                            <v-btn
                              height="40px"
                              color="#1867C0"
                              @click="openNricScan()"
                            >
                              <v-icon>mdi-camera</v-icon>
                            </v-btn>
                          </slot>
                        </template>
                      </v-text-field>
                    </template>
                    <!-- Dropdown menu for suggestions -->
                    <v-list v-if="nricOptions && nricOptions.length">
                      <v-list-item
                        v-for="(item, index) in nricOptions"
                        :key="index"
                        @click="selectNricOption(item)"
                      >
                        <v-list-item>
                          <v-list-item-title
                            v-text="item.name"
                          ></v-list-item-title>
                        </v-list-item>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>

                <!-- <v-col
                    cols="12"
                    class="text-center"
                    :style="{
                      position: 'relative',
                      marginBottom: `${!enabledCam ? '-150px' : '-8px'}`,
                    }"
                  >
                    <video
                      ref="video"
                      id="video"
                      width="100%"
                      class="rounded-lg"
                      style="display: none"
                    />
  
                    <v-btn
                      v-if="enabledCam && !takePicture"
                      size="x-small"
                      icon="mdi-camera"
                      color="primary"
                      style="position: absolute; top: 20px; right: 63px"
                      @click="onCaptureImage()"
                      :disabled="isProgress"
                    />
  
                    <v-btn
                      v-if="enabledCam && !takePicture"
                      icon="mdi-close"
                      color="error"
                      style="position: absolute; top: 20px; right: 23px"
                      @click="onCancelCamera()"
                      :disabled="isProgress"
                    />
  
                    <canvas
                      ref="canvas"
                      id="canvas"
                      width="640"
                      class="rounded-lg"
                      height="480"
                      style="position: relative; width: 100%; display: none"
                    />
  
                    <v-btn
                      v-if="takePicture"
                      size="x-small"
                      color="warning"
                      style="
                        position: absolute;
                        top: 20px;
                        right: 63px;
                        height: 30px;
                        z-index: 2000;
                      "
                      @click="retakeImage()"
                      :disabled="isProgress"
                    >
                      Retake Image
                    </v-btn>
  
                    <v-btn
                      v-if="takePicture || takePictureViaMobile"
                      size="x-small"
                      icon="mdi-check-bold"
                      color="success"
                      style="position: absolute; top: 20px; right: 23px"
                      @click="onUploadImage()"
                      :disabled="isProgress"
                    />
                  </v-col> -->

                <v-col cols="4">
                  <v-select
                    v-model="prefix"
                    :items="prefixes"
                    item-title="country"
                    item-value="dial_code"
                    chips
                    label="Dial Code"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                  >
                    <template v-slot:chip="{ props, item }">
                      <v-row no-gutters v-bind="props">
                        <v-col cols="12">
                          {{ item.raw.dial_code }}
                        </v-col>
                      </v-row>
                    </template>
                    <template v-slot:item="{ props, item }">
                      <v-row no-gutters v-bind="props" class="px-3">
                        <v-col cols="auto">
                          <v-avatar
                            size="30"
                            :image="item.raw.flag"
                            class="mr-4"
                          ></v-avatar>
                        </v-col>
                        <v-col>
                          <span>{{ item.raw.dial_code }}</span>
                        </v-col>
                        <v-col class="text-center">
                          <v-chip color="primary">{{
                            item.raw.country
                          }}</v-chip>
                        </v-col>
                      </v-row>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="primaryPhone"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @input="handleInputPhone"
                  >
                    <template v-slot:label>
                      Phone Number
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>

                <!-- <v-col cols="12">
                    <v-text-field
                      v-model="visitor.plateNumber"
                      density="comfortable"
                      hide-details
                      :disabled="isProgress"
                      :rules="[requiredInput]"
                      clearable
                      @input="handleInputVehicleNumber"
                      @update:modelValue="onSearchVehicleNumber"
                    >
                      <template v-slot:label>
                        Vehicle Number
                        <span class="text-red font-weight-bold">*</span>
                      </template>
                    </v-text-field>
                  </v-col> -->

                <v-col cols="12">
                  <v-menu
                    v-model="vehicleMenu"
                    :close-on-content-click="false"
                    offset-y
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-model="visitor.plateNumber"
                        density="comfortable"
                        hide-details
                        clearable
                        :disabled="isProgress"
                        :rules="[requiredInput]"
                        @input="handleInputVehicleNumber"
                        @update:modelValue="onSearchVehicleNumber"
                        v-bind="props"
                      >
                        <template v-slot:label>
                          Vehicle Number
                          <span class="text-red font-weight-bold">*</span>
                        </template></v-text-field
                      >
                    </template>
                    <!-- Dropdown menu for suggestions -->
                    <v-list
                      v-if="
                        Array.isArray(vehicleOptions) && vehicleOptions.length
                      "
                    >
                      <v-list-item
                        v-for="(item, index) in vehicleOptions"
                        :key="index"
                        @click="selectVehicleOption(item)"
                      >
                        <v-list-item>
                          <v-list-item-title
                            v-text="item.name"
                          ></v-list-item-title>
                        </v-list-item>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="visitor.block"
                    :items="blocks"
                    item-title="name"
                    item-value="_id"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @update:modelValue="onSelectBlock(visitor.block)"
                    @update:search="onSearchBlock"
                    clearable
                    no-filter
                  >
                    <template v-slot:label>
                      Block
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                    <template v-slot:append-item>
                      <div
                        v-if="canNextBlockPage"
                        v-intersect="endBlockIntersect"
                      />
                      <v-row
                        no-gutters
                        align-content="center"
                        v-if="canNextBlockPage"
                      >
                        <v-col cols="12" class="d-flex justify-center">
                          <v-progress-circular
                            :size="20"
                            color="primary"
                            indeterminate
                          ></v-progress-circular>
                        </v-col>
                      </v-row>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="visitor.blockLevel"
                    :items="blockLevels"
                    item-title="level"
                    item-value="_id"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @update:modelValue="
                      onSelectBlockLevel(visitor.block, visitor.blockLevel)
                    "
                    @update:search="onSearchBlockLevel"
                    clearable
                    no-filter
                  >
                    <template v-slot:label>
                      Level
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                    <template v-slot:append-item>
                      <div
                        v-if="canNextLevelPage"
                        v-intersect="endLevelIntersect"
                      />
                      <v-row
                        no-gutters
                        align-content="center"
                        v-if="canNextLevelPage"
                      >
                        <v-col cols="12" class="d-flex justify-center">
                          <v-progress-circular
                            :size="20"
                            color="primary"
                            indeterminate
                          ></v-progress-circular>
                        </v-col>
                      </v-row>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="visitor.unit"
                    :items="units"
                    item-title="name"
                    item-value="_id"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @update:search="onSearchBlockLevelUnit"
                    clearable
                    no-filter
                  >
                    <template v-slot:label>
                      Unit
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                    <template v-slot:append-item>
                      <div
                        v-if="canNextUnitPage"
                        v-intersect="endUnitIntersect"
                      />
                      <v-row
                        no-gutters
                        align-content="center"
                        v-if="canNextUnitPage"
                      >
                        <v-col cols="12" class="d-flex justify-center">
                          <v-progress-circular
                            :size="20"
                            color="primary"
                            indeterminate
                          ></v-progress-circular>
                        </v-col>
                      </v-row>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="visitor.remarks"
                    label="Remarks"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    rows="3"
                    no-resize
                  ></v-textarea>
                </v-col>
              </v-row>

              <v-row v-if="addVisitorSteps === 2" class="mt-5">
                <v-col v-if="addVisitorSteps === 2" cols="12">
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
                <v-spacer></v-spacer>
              </v-row>
              <v-col cols="12" v-if="addVisitorSteps === 3">
                <div class="text-center mt-6 text-subtitle-1 font-weight-bold">
                  Great!
                </div>
                <div class="text-center mt-2 text-caption">
                  A new visitor is added to the list of visitors
                </div>
                <v-row class="px-3 mt-5" justify="space-between">
                  <v-col cols="6">
                    <v-btn
                      block
                      size="small"
                      variant="flat"
                      style="height: 40px"
                      @click="onCloseDialog()"
                    >
                      Close
                    </v-btn>
                  </v-col>

                  <v-col cols="6">
                    <v-btn
                      block
                      color="blue-darken-3"
                      size="small"
                      variant="flat"
                      style="height: 40px"
                      @click="goBack()"
                    >
                      Add New Visitor
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-btn
                  v-if="addVisitorSteps === 1"
                  block
                  color="blue-darken-3"
                  size="small"
                  variant="flat"
                  style="height: 40px"
                  @click="validateContractorStep"
                >
                  Next
                </v-btn>
                <v-btn
                  v-if="addVisitorSteps !== 1 && addVisitorSteps !== 3"
                  block
                  color="blue-darken-3"
                  size="small"
                  variant="flat"
                  style="height: 40px"
                  @click="submit()"
                  :disabled="isProgress"
                  :loading="isProgress"
                >
                  Update Drive In
                </v-btn>
              </v-col>
            </v-form>
          </v-col>

          <v-col cols="12" class="mb-4" v-if="visitor.type === 'contractor'">
            <v-form ref="contractorForm">
              <v-row>
                <v-col cols="12" class="mb-5">
                  <v-img
                    :src="`/images/${addVisitorSteps <= 3 ? 'visitor-contractor.svg' : 'confirmation.svg'}`"
                    height="125"
                  />
                </v-col>

                <!-- Hide Add Multiple Contractor (temporarily) -->
                <!-- <v-col cols="12" v-if="addVisitorSteps == 1">
                                          <v-row no-gutters>
                                              <v-col cols="3" v-if="uploadUsingCsv">
                                                  <v-btn
                                                  size="small"
                                                  color="green-darken-2"
                                                  icon
                                                  @click="onDownloadCSV()"
                                                  :disabled="isProgress"
                                                  >
                                                  <v-icon>mdi-microsoft-excel</v-icon>
                                                  <v-tooltip activator="parent" location="start"
                                                      >Download CSV Template</v-tooltip
                                                  >
                                                  </v-btn>
                                              </v-col>
                                              <v-col :cols="!uploadUsingCsv ? 12 : 9">
                                                  <v-switch
                                                  v-model="uploadUsingCsv"
                                                  label="Add Multiple Contractor"
                                                  color="blue-darken-3"
                                                  density="compact"
                                                  hide-details
                                                  inset
                                                  :disabled="isProgress"
                                                  ></v-switch>
                                              </v-col>
                                          </v-row>
                                      </v-col> -->

                <v-col cols="12" class="mt-5" v-if="uploadUsingCsv">
                  <v-row>
                    <v-col cols="12" v-if="addVisitorSteps === 1">
                      <v-text-field
                        label="Attach File"
                        density="compact"
                        hide-details
                        variant="outlined"
                        clearable
                        type="file"
                        accept=".csv"
                        v-on:change="onSelectCSV"
                        prepend-inner-icon="mdi-paperclip"
                        :disabled="isProgress"
                      ></v-text-field>

                      <v-btn
                        block
                        color="blue-darken-3"
                        size="small"
                        variant="flat"
                        :disabled="isProgress"
                        style="height: 40px; margin-top: 25px"
                        @click="onAddMultipleContractor()"
                      >
                        Update Contractor
                      </v-btn>
                    </v-col>

                    <v-col cols="12" v-if="addVisitorSteps === 2">
                      <div
                        class="text-center mt-6 text-subtitle-1 font-weight-bold"
                      >
                        Great!
                      </div>
                      <div class="text-center mt-2 text-caption">
                        A new visitor is added to the list of visitors
                      </div>
                      <v-row class="px-3 mt-5" justify="space-between">
                        <v-col cols="6">
                          <v-btn
                            block
                            size="small"
                            variant="flat"
                            style="height: 40px"
                            @click="onCloseDialog()"
                          >
                            Close
                          </v-btn>
                        </v-col>

                        <v-col cols="6">
                          <v-btn
                            block
                            color="blue-darken-3"
                            size="small"
                            variant="flat"
                            style="height: 40px"
                            @click="goBack()"
                          >
                            Add New Visitor
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" v-else>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      v-if="addVisitorSteps && addVisitorSteps <= 3"
                    >
                      <v-row class="px-3" justify="space-between">
                        <span class="font-weight-bold">
                          <v-btn
                            v-if="addVisitorSteps <= 3 && addVisitorSteps !== 1"
                            size="x-small"
                            variant="flat"
                            class="grey-darken-1"
                            icon="mdi-chevron-left"
                            @click="addVisitorSteps--"
                          />

                          {{
                            addVisitorSteps === 1
                              ? "General"
                              : addVisitorSteps === 2
                                ? "Pass and Keys"
                                : "Member"
                          }}
                          Information
                        </span>
                        <v-chip size="small" color="grey-lighten-1">
                          <span :class="`${theme === 'light' && 'text-black'}`">
                            Step
                            <span class="text-blue">{{ addVisitorSteps }}</span
                            >/3
                          </span>
                        </v-chip>
                        <v-col cols="12" class="text-body-2 text-end">
                          <span class="text-red font-weight-bold">* </span>
                          <span> are required fields</span>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12" class="mb-6" v-if="addVisitorSteps <= 3">
                      <v-row v-if="addVisitorSteps === 1">
                        <v-col cols="12">
                          <v-select
                            v-model="visitor.contractorType"
                            density="compact"
                            :items="contractorTypes"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                          >
                            <template v-slot:label>
                              Contractor Type
                              <span class="text-red font-weight-bold">*</span>
                            </template>
                          </v-select>
                        </v-col>

                        <v-col class="d-flex ga-12" cols="12">
                          <v-text-field
                            v-model="visitor.firstName"
                            density="compact"
                            hide-details
                            :disabled="isProgress || isNricOngoingDetection"
                            :loading="isNricOngoingDetection"
                            :rules="isTemporary ? [] : [requiredInput]"
                          >
                            <template v-slot:label>
                              Name
                              <span
                                v-if="!isTemporary"
                                class="text-red font-weight-bold"
                                >*</span
                              >
                            </template>
                          </v-text-field>
                        </v-col>

                        <v-col cols="12" v-if="!isTemporary">
                          <v-menu
                            v-model="nricMenu"
                            :close-on-content-click="false"
                            offset-y
                          >
                            <template v-slot:activator="{ props }">
                              <v-text-field
                                v-if="!displayInput"
                                v-model="visitor.nric"
                                hide-details
                                clearable
                                :disabled="isProgress || isNricOngoingDetection"
                                :loading="isNricOngoingDetection"
                                @input="handleInputNric"
                                @update:modelValue="onSearchNRIC"
                                :rules="[requiredInput]"
                                v-bind="props"
                              >
                                <template v-slot:label>
                                  NRIC/Passport/ID No.
                                  <span class="text-red font-weight-bold"
                                    >*</span
                                  >
                                </template>
                                <template v-slot:append>
                                  <slot name="append">
                                    <v-btn
                                      :loading="isNricOngoingDetection"
                                      :disabled="isNricOngoingDetection"
                                      height="40px"
                                      color="#1867C0"
                                      @click="openNricScan()"
                                    >
                                      <v-icon>mdi-camera</v-icon>
                                    </v-btn>
                                  </slot>
                                </template></v-text-field
                              >
                            </template>
                            <!-- Dropdown menu for suggestions -->
                            <v-list v-if="nricOptions && nricOptions.length">
                              <v-list-item
                                v-for="(item, index) in nricOptions"
                                :key="index"
                                @click="selectNricOption(item)"
                              >
                                <v-list-item>
                                  <v-list-item-title
                                    v-text="item.name"
                                  ></v-list-item-title>
                                </v-list-item>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </v-col>

                        <v-col cols="12" v-if="!isTemporary">
                          <v-text-field
                            v-model="visitor.companyName"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                          >
                            <template v-slot:label>
                              Company Name
                              <span class="text-red font-weight-bold">*</span>
                            </template>
                          </v-text-field>
                        </v-col>

                        <template v-if="!isTemporary">
                          <v-col cols="4">
                            <v-select
                              v-model="prefix"
                              :items="prefixes"
                              item-title="country"
                              item-value="dial_code"
                              chips
                              label="Dial Code"
                              density="compact"
                              hide-details
                              :disabled="isProgress"
                              :rules="[requiredInput]"
                            >
                              <template v-slot:chip="{ props, item }">
                                <v-row no-gutters v-bind="props">
                                  <v-col cols="12">
                                    {{ item.raw.dial_code }}
                                  </v-col>
                                </v-row>
                              </template>
                              <template v-slot:item="{ props, item }">
                                <v-row no-gutters v-bind="props" class="px-3">
                                  <v-col cols="auto">
                                    <v-avatar
                                      size="30"
                                      :image="item.raw.flag"
                                      class="mr-4"
                                    ></v-avatar>
                                  </v-col>
                                  <v-col>
                                    <span>{{ item.raw.dial_code }}</span>
                                  </v-col>
                                  <v-col class="text-center">
                                    <v-chip color="primary">{{
                                      item.raw.country
                                    }}</v-chip>
                                  </v-col>
                                </v-row>
                              </template>
                            </v-select>
                          </v-col>
                          <v-col cols="8">
                            <v-text-field
                              v-model="primaryPhone"
                              density="compact"
                              hide-details
                              :disabled="isProgress"
                              :rules="[requiredInput]"
                              @input="handleInputPhone"
                            >
                              <template v-slot:label>
                                Phone Number
                                <span class="text-red font-weight-bold">*</span>
                              </template>
                            </v-text-field>
                          </v-col>
                        </template>
                        <!-- <v-col cols="12">
                            <v-text-field
                              v-model="visitor.plateNumber"
                              label="Vehicle Number"
                              density="comfortable"
                              hide-details
                              :disabled="isProgress"
                              clearable
                              @input="handleInputVehicleNumber"
                              @update:modelValue="onSearchVehicleNumber"
                            ></v-text-field>
                          </v-col> -->

                        <v-col cols="12">
                          <v-menu
                            v-model="vehicleMenu"
                            :close-on-content-click="false"
                            offset-y
                          >
                            <template v-slot:activator="{ props }">
                              <v-text-field
                                v-model="visitor.plateNumber"
                                density="comfortable"
                                hide-details
                                clearable
                                :rules="isTemporary ? [requiredInput] : []"
                                :disabled="isProgress"
                                @input="handleInputVehicleNumber"
                                @update:modelValue="onSearchVehicleNumber"
                                v-bind="props"
                              >
                                <template v-slot:label>
                                  Vehicle Number
                                  <span
                                    v-if="isTemporary"
                                    class="text-red font-weight-bold"
                                    >*</span
                                  >
                                </template></v-text-field
                              >
                            </template>
                            <!-- Dropdown menu for suggestions -->
                            <v-list
                              v-if="
                                Array.isArray(vehicleOptions) &&
                                vehicleOptions.length
                              "
                            >
                              <v-list-item
                                v-for="(item, index) in vehicleOptions"
                                :key="index"
                                @click="selectVehicleOption(item)"
                              >
                                <v-list-item>
                                  <v-list-item-title
                                    v-text="item.name"
                                  ></v-list-item-title>
                                </v-list-item>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </v-col>

                        <v-col cols="12" v-if="!isTemporary">
                          <v-autocomplete
                            v-model="visitor.block"
                            :items="blocks"
                            item-title="name"
                            item-value="_id"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            @update:modelValue="onSelectBlock(visitor.block)"
                            @update:search="onSearchBlock"
                            clearable
                            no-filter
                            :rules="[requiredInput]"
                          >
                            <template v-slot:label>
                              Block
                              <span class="text-red font-weight-bold">*</span>
                            </template>
                            <template v-slot:append-item>
                              <div
                                v-if="canNextBlockPage"
                                v-intersect="endBlockIntersect" />
                              <v-row
                                no-gutters
                                align-content="center"
                                v-if="canNextBlockPage"
                              >
                                <v-col cols="12" class="d-flex justify-center">
                                  <v-progress-circular
                                    :size="20"
                                    color="primary"
                                    indeterminate
                                  ></v-progress-circular>
                                </v-col> </v-row
                            ></template>
                          </v-autocomplete>
                        </v-col>

                        <v-col cols="12" v-if="!isTemporary">
                          <v-autocomplete
                            v-model="visitor.blockLevel"
                            :items="blockLevels"
                            item-title="level"
                            item-value="_id"
                            :rules="[requiredInput]"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            @update:modelValue="
                              onSelectBlockLevel(
                                visitor.block,
                                visitor.blockLevel,
                              )
                            "
                            @update:search="onSearchBlockLevel"
                            clearable
                            no-filter
                          >
                            <template v-slot:label>
                              Level
                              <span class="text-red font-weight-bold">*</span>
                            </template>
                            <template v-slot:append-item>
                              <div
                                v-if="canNextLevelPage"
                                v-intersect="endLevelIntersect"
                              />
                              <v-row
                                no-gutters
                                align-content="center"
                                v-if="canNextLevelPage"
                              >
                                <v-col cols="12" class="d-flex justify-center">
                                  <v-progress-circular
                                    :size="20"
                                    color="primary"
                                    indeterminate
                                  ></v-progress-circular>
                                </v-col>
                              </v-row> </template
                          ></v-autocomplete>
                        </v-col>

                        <v-col cols="12" v-if="!isTemporary">
                          <v-autocomplete
                            v-model="visitor.unit"
                            :items="units"
                            item-title="name"
                            item-value="_id"
                            :rules="[requiredInput]"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            @update:search="onSearchBlockLevelUnit"
                            clearable
                            no-filter
                          >
                            <template v-slot:label>
                              Unit
                              <span class="text-red font-weight-bold">*</span>
                            </template>
                            <template v-slot:append-item>
                              <div
                                v-if="canNextUnitPage"
                                v-intersect="endUnitIntersect"
                              />
                              <v-row
                                no-gutters
                                align-content="center"
                                v-if="canNextUnitPage"
                              >
                                <v-col cols="12" class="d-flex justify-center">
                                  <v-progress-circular
                                    :size="20"
                                    color="primary"
                                    indeterminate
                                  ></v-progress-circular>
                                </v-col>
                              </v-row> </template
                          ></v-autocomplete>
                        </v-col>

                        <v-col cols="12" v-if="!isTemporary">
                          <v-textarea
                            v-model="visitor.remarks"
                            label="Remarks"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            rows="3"
                            no-resize
                          ></v-textarea>
                        </v-col>
                      </v-row>

                      <v-row v-if="addVisitorSteps === 2" class="mt-5">
                        <v-col v-if="addVisitorSteps === 2" cols="12">
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
                        <v-col cols="12">
                          <v-autocomplete
                            v-model="visitor.visitorPass"
                            :items="result1?.items"
                            item-title="prefixAndName"
                            item-value="_id"
                            density="comfortable"
                            clearable
                            chips
                            hide-details
                            :loading="isPassListLoading"
                            @update:search="(query: string) => search(query)"
                          >
                            <template v-slot:label> Pass</template>
                            <template v-slot:append-item>
                              <div v-intersect="endIntersect" />
                            </template>
                            <template v-slot:chip="{ props, item }">
                              <v-chip
                                v-bind="props"
                                prepend-icon="mdi-badge-account-outline"
                                :text="item.raw.prefixAndName"
                              />
                            </template>
                          </v-autocomplete>
                        </v-col>

                        <v-col cols="12">
                          <span class="font-weight-bold"> Keys </span>
                        </v-col>

                        <v-col cols="12">
                          <v-autocomplete
                            v-model="visitor.passKeys"
                            :items="keys"
                            item-title="prefixAndName"
                            item-value="_id"
                            density="comfortable"
                            return-object
                            :disabled="isKeyListLoading"
                            :loading="isKeyListLoading"
                            hide-details
                            clearable
                            multiple
                            chips
                            closable-chips
                            @update:search="(query: string) => searchKey(query)"
                          >
                            <template v-slot:label> Keys</template>
                            <!-- <template v-slot:append-item>
                              <div v-intersect="endIntersectKeys" />
                            </template> -->
                            <template v-slot:chip="{ props, item }">
                              <v-chip
                                v-bind="props"
                                prepend-icon="mdi-key"
                                :text="item.raw.prefixAndName"
                              />
                            </template>
                          </v-autocomplete>
                        </v-col>
                      </v-row>

                      <v-row v-if="addVisitorSteps === 3">
                        <v-col v-if="addVisitorSteps === 3" cols="12">
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

                        <v-col cols="10">
                          <v-row no-gutters align="center" justify="center">
                            <v-col cols="12">
                              <v-text-field
                                v-model="contractorMember.name"
                                density="comfortable"
                                hide-details
                                :disabled="isProgress"
                                class="mb-2"
                                clearable
                              >
                                <template v-slot:label>
                                  Name
                                  <span class="text-red font-weight-bold">
                                    *
                                  </span>
                                </template>
                              </v-text-field>
                            </v-col>

                            <v-col cols="12">
                              <v-text-field
                                v-model="contractorMember.nric"
                                density="comfortable"
                                hide-details
                                :disabled="isProgress"
                                class="mb-2"
                                clearable
                              >
                                <template v-slot:label>
                                  NRIC
                                  <span class="text-red font-weight-bold">
                                    *
                                  </span>
                                </template>
                              </v-text-field>
                            </v-col>

                            <v-col cols="12">
                              <v-autocomplete
                                v-model="contractorMember.visitorPass"
                                label="Pass"
                                :items="getFilteredPassListForStep2()"
                                item-title="prefixAndName"
                                item-value="_id"
                                density="comfortable"
                                hide-details
                                clearable
                                :disabled="isProgress"
                                @update:search="
                                  (query: string) => search(query)
                                "
                              >
                                <template v-slot:append-item>
                                  <div v-intersect="endIntersect" />
                                </template>
                              </v-autocomplete>
                            </v-col>
                          </v-row>
                        </v-col>

                        <v-col cols="10" class="mt-2">
                          <v-row no-gutters justify="space-between">
                            <v-col cols="5">
                              <v-btn
                                block
                                size="small"
                                color="blue-darken-3"
                                @click="addContractorMember(contractorMember)"
                                :disabled="
                                  isProgress ||
                                  !contractorMember.name ||
                                  !contractorMember.nric
                                "
                              >
                                <v-icon start>mdi-plus</v-icon>
                                Add Member
                              </v-btn>
                            </v-col>
                            <v-col cols="5">
                              <v-btn
                                block
                                size="small"
                                color="blue-darken-3"
                                @click="clearForm()"
                                :disabled="
                                  !contractorMember.name &&
                                  !contractorMember.nric &&
                                  !contractorMember.visitorPass
                                "
                              >
                                <v-icon start>mdi-refresh</v-icon>
                                Clear Form
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-col>

                        <v-divider v-if="visitor.members?.length"></v-divider>

                        <!-- added members -->
                        <v-col cols="12" class="mt-4">
                          <v-row
                            class="mb-1"
                            v-for="(member, key) in visitor.members"
                            :key="key"
                          >
                            <v-card
                              style="
                                display: flex;
                                padding: 12px 17px 12px 12px;
                                width: 420px;
                                height: 196px;
                                align-items: center;
                                border-radius: 8px;
                                border: 1px solid
                                  var(--black-004, rgba(0, 0, 0, 0.04));
                                background: rgba(250, 250, 250, 0.98);
                              "
                              elevation="0"
                            >
                              <v-col cols="10">
                                <v-row
                                  no-gutters
                                  align="center"
                                  justify="center"
                                >
                                  <v-col cols="12">
                                    <v-card
                                      variant="flat"
                                      style="
                                        display: flex;
                                        height: 52px;
                                        padding: var(--f-spacing-0, 0px) 16px;
                                        flex-direction: column;
                                        justify-content: center;
                                        align-items: flex-start;
                                        align-self: stretch;
                                        border-radius: 4px;
                                        border: 1px solid
                                          var(--black-004, rgba(0, 0, 0, 0.04));
                                        background: var(--white, #fff);
                                      "
                                      tile
                                    >
                                      <div class="text-caption">Name</div>
                                      <div>{{ member.name }}</div>
                                    </v-card>
                                  </v-col>

                                  <v-col cols="12" class="mt-1">
                                    <v-card
                                      variant="flat"
                                      style="
                                        display: flex;
                                        height: 52px;
                                        padding: var(--f-spacing-0, 0px) 16px;
                                        flex-direction: column;
                                        justify-content: center;
                                        align-items: flex-start;
                                        align-self: stretch;
                                        border-radius: 4px;
                                        border: 1px solid
                                          var(--black-004, rgba(0, 0, 0, 0.04));
                                        background: var(--white, #fff);
                                      "
                                      tile
                                    >
                                      <div class="text-caption">NRIC</div>

                                      <div>{{ nricChecker(member.nric) }}</div>
                                    </v-card>
                                  </v-col>
                                  <v-col cols="12" class="mt-1">
                                    <v-card
                                      variant="flat"
                                      style="
                                        display: flex;
                                        height: 52px;
                                        padding: var(--f-spacing-0, 0px) 16px;
                                        flex-direction: column;
                                        justify-content: center;
                                        align-items: flex-start;
                                        align-self: stretch;
                                        border-radius: 4px;
                                        border: 1px solid
                                          var(--black-004, rgba(0, 0, 0, 0.04));
                                        background: var(--white, #fff);
                                      "
                                      tile
                                    >
                                      <v-chip
                                        v-if="member.visitorPass"
                                        size="small"
                                        prepend-icon="mdi-badge-account-outline"
                                        :text="
                                          result1?.items?.find(
                                            (pass: any) =>
                                              pass._id == member.visitorPass,
                                          )?.prefixAndName
                                        "
                                      />
                                    </v-card>
                                  </v-col>
                                </v-row>
                              </v-col>
                              <v-col
                                cols="2"
                                align-self="center"
                                class="pa-0 ma-0"
                              >
                                <v-btn
                                  color="red-darken-3"
                                  icon="mdi-delete-outline"
                                  @click="visitor.members?.splice(key, 1)"
                                />
                              </v-col>
                            </v-card>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12" v-if="addVisitorSteps === 4">
                      <div
                        class="text-center mt-6 text-subtitle-1 font-weight-bold"
                      >
                        Great!
                      </div>
                      <div class="text-center mt-2 text-caption">
                        A new visitor is added to the list of visitors
                      </div>
                      <v-row class="px-3 mt-5" justify="space-between">
                        <v-col cols="6">
                          <v-btn
                            block
                            size="small"
                            variant="flat"
                            style="height: 40px"
                            @click="onCloseDialog()"
                          >
                            Close
                          </v-btn>
                        </v-col>

                        <v-col cols="6">
                          <v-btn
                            block
                            color="blue-darken-3"
                            size="small"
                            variant="flat"
                            style="height: 40px"
                            @click="goBack()"
                          >
                            Add New Visitor
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12">
                      <v-btn
                        v-if="addVisitorSteps <= 2 && !isTemporary"
                        block
                        color="blue-darken-3"
                        size="small"
                        variant="flat"
                        style="height: 40px"
                        @click="validateContractorStep"
                      >
                        Next
                      </v-btn>

                      <v-btn
                        v-if="addVisitorSteps <= 2 && isTemporary"
                        block
                        color="blue-darken-3"
                        size="small"
                        variant="flat"
                        style="height: 40px"
                        @click="submitTemporary()"
                        :loading="isProgress"
                      >
                        Add Contractor
                      </v-btn>

                      <v-btn
                        v-if="addVisitorSteps === 3"
                        block
                        color="blue-darken-3"
                        size="small"
                        variant="flat"
                        style="height: 40px"
                        @click="submit()"
                        :loading="isProgress"
                      >
                        Update Contractor
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-form>
          </v-col>

          <v-col cols="12" class="mb-4" v-if="visitor.type === 'delivery'">
            <v-form ref="deliveryForm">
              <v-row v-if="addVisitorSteps === 1">
                <v-col cols="12" class="mb-5">
                  <v-img :src="`/images/visitor-delivery.svg`" height="125" />
                </v-col>

                <v-col cols="12">
                  <div class="font-weight-bold">General information</div>
                  <div class="text-body-2 text-end">
                    <span class="text-red font-weight-bold">* </span>
                    <span> are required fields</span>
                  </div>
                </v-col>

                <v-col cols="12">
                  <BaseCarousel
                    v-if="filesUrlUploaded.length > 0"
                    :urls="filesUrlUploaded"
                  ></BaseCarousel>
                  <v-img v-else src="/icons/placeholder-image.svg"></v-img>
                </v-col>

                <v-col cols="12" class="mb-4">
                  <BaseFileInput
                    @on-button-click="showCamDialog()"
                    ref="fileInput"
                  />
                </v-col>

                <v-col class="d-flex ga-12" cols="12">
                  <v-text-field
                    v-model="visitor.firstName"
                    label="Name"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-radio-group v-model="visitor.deliveryType" inline>
                    <v-radio
                      color="primary"
                      label="Food"
                      value="Food"
                    ></v-radio>
                    <v-radio
                      color="primary"
                      label="Parcel"
                      value="Parcel"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="visitor.companyName"
                    :items="siteSetting.deliveryCompanyList"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    clearable
                  >
                    <template v-slot:label>
                      Company Name
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-menu
                    v-model="nricMenu"
                    :close-on-content-click="false"
                    offset-y
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-if="!displayInput"
                        v-model="visitor.nric"
                        label="NRIC/Passport/ID No. (optional)"
                        hide-details
                        clearable
                        :disabled="isProgress"
                        @input="handleInputNric"
                        @update:modelValue="onSearchNRIC"
                        v-bind="props"
                      >
                        <template v-slot:append>
                          <slot name="append">
                            <v-btn
                              height="40px"
                              color="#1867C0"
                              @click="openNricScan()"
                            >
                              <v-icon>mdi-camera</v-icon>
                            </v-btn>
                          </slot>
                        </template></v-text-field
                      >
                    </template>
                    <!-- Dropdown menu for suggestions -->
                    <v-list v-if="nricOptions && nricOptions.length">
                      <v-list-item
                        v-for="(item, index) in nricOptions"
                        :key="index"
                        @click="selectNricOption(item)"
                      >
                        <v-list-item>
                          <v-list-item-title
                            v-text="item.name"
                          ></v-list-item-title>
                        </v-list-item>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>

                <v-col cols="4">
                  <v-select
                    v-model="prefix"
                    :items="prefixes"
                    item-title="country"
                    item-value="dial_code"
                    chips
                    label="Dial Code"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                  >
                    <template v-slot:chip="{ props, item }">
                      <v-row no-gutters v-bind="props">
                        <v-col cols="12">
                          {{ item.raw.dial_code }}
                        </v-col>
                      </v-row>
                    </template>
                    <template v-slot:item="{ props, item }">
                      <v-row no-gutters v-bind="props" class="px-3">
                        <v-col cols="auto">
                          <v-avatar
                            size="30"
                            :image="item.raw.flag"
                            class="mr-4"
                          ></v-avatar>
                        </v-col>
                        <v-col>
                          <span>{{ item.raw.dial_code }}</span>
                        </v-col>
                        <v-col class="text-center">
                          <v-chip color="primary">{{
                            item.raw.country
                          }}</v-chip>
                        </v-col>
                      </v-row>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="primaryPhone"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @input="handleInputPhone"
                    @update:modelValue="onSearchPhoneNumber"
                  >
                    <template v-slot:label>
                      Phone Number
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>

                <!-- <v-col cols="12">
                    <v-text-field
                      v-model="visitor.plateNumber"
                      label="Vehicle Number"
                      density="comfortable"
                      hide-details
                      :disabled="isProgress"
                      clearable
                      @input="handleInputVehicleNumber"
                      @update:modelValue="onSearchVehicleNumber"
                    ></v-text-field>
                  </v-col> -->

                <v-col cols="12">
                  <v-menu
                    v-model="vehicleMenu"
                    :close-on-content-click="false"
                    offset-y
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-model="visitor.plateNumber"
                        density="comfortable"
                        hide-details
                        clearable
                        :disabled="isProgress"
                        :rules="[requiredInput]"
                        @input="handleInputVehicleNumber"
                        @update:modelValue="onSearchVehicleNumber"
                        v-bind="props"
                      >
                        <template v-slot:label>
                          Vehicle Number
                          <span class="text-red font-weight-bold">*</span>
                        </template></v-text-field
                      >
                    </template>
                    <!-- Dropdown menu for suggestions -->
                    <v-list
                      v-if="
                        Array.isArray(vehicleOptions) && vehicleOptions.length
                      "
                    >
                      <v-list-item
                        v-for="(item, index) in vehicleOptions"
                        :key="index"
                        @click="selectVehicleOption(item)"
                      >
                        <v-list-item>
                          <v-list-item-title
                            v-text="item.name"
                          ></v-list-item-title>
                        </v-list-item>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="visitor.block"
                    :items="blocks"
                    item-title="name"
                    item-value="_id"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @update:modelValue="onSelectBlock(visitor.block)"
                    @update:search="onSearchBlock"
                    clearable
                    no-filter
                  >
                    <template v-slot:label>
                      Block
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                    <template v-slot:append-item>
                      <div
                        v-if="canNextBlockPage"
                        v-intersect="endBlockIntersect" />
                      <v-row
                        no-gutters
                        align-content="center"
                        v-if="canNextBlockPage"
                      >
                        <v-col cols="12" class="d-flex justify-center">
                          <v-progress-circular
                            :size="20"
                            color="primary"
                            indeterminate
                          ></v-progress-circular>
                        </v-col> </v-row
                    ></template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="visitor.blockLevel"
                    :items="blockLevels"
                    item-title="level"
                    item-value="_id"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @update:modelValue="
                      onSelectBlockLevel(visitor.block, visitor.blockLevel)
                    "
                    @update:search="onSearchBlockLevel"
                    clearable
                    no-filter
                  >
                    <template v-slot:label>
                      Level
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                    <template v-slot:append-item>
                      <div
                        v-if="canNextLevelPage"
                        v-intersect="endLevelIntersect"
                      />
                      <v-row
                        no-gutters
                        align-content="center"
                        v-if="canNextLevelPage"
                      >
                        <v-col cols="12" class="d-flex justify-center">
                          <v-progress-circular
                            :size="20"
                            color="primary"
                            indeterminate
                          ></v-progress-circular>
                        </v-col>
                      </v-row>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="visitor.unit"
                    :items="units"
                    item-title="name"
                    item-value="_id"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @update:search="onSearchBlockLevelUnit"
                    clearable
                    no-filter
                  >
                    <template v-slot:label>
                      Unit
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                    <template v-slot:append-item>
                      <div
                        v-if="canNextUnitPage"
                        v-intersect="endUnitIntersect"
                      />
                      <v-row
                        no-gutters
                        align-content="center"
                        v-if="canNextUnitPage"
                      >
                        <v-col cols="12" class="d-flex justify-center">
                          <v-progress-circular
                            :size="20"
                            color="primary"
                            indeterminate
                          ></v-progress-circular>
                        </v-col>
                      </v-row>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="visitor.remarks"
                    label="Remarks"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    rows="3"
                    no-resize
                  ></v-textarea>
                </v-col>

                <v-col cols="12">
                  <v-btn
                    block
                    color="blue-darken-3"
                    size="small"
                    variant="flat"
                    style="height: 40px"
                    @click="submit()"
                    :disabled="isProgress"
                    :loading="isProgress"
                  >
                    Add Delivery
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>

            <v-row v-if="addVisitorSteps === 2">
              <v-col cols="12" class="mb-5">
                <v-img :src="`/images/confirmation.svg`" height="125" />
              </v-col>

              <v-col cols="12">
                <div class="text-center mt-6 text-subtitle-1 font-weight-bold">
                  Great!
                </div>
                <div class="text-center mt-2 text-caption">
                  A new visitor is added to the list of visitors
                </div>
                <v-row class="px-3 mt-5" justify="space-between">
                  <v-col cols="6">
                    <v-btn
                      block
                      size="small"
                      variant="flat"
                      style="height: 40px"
                      @click="onCloseDialog()"
                    >
                      Close
                    </v-btn>
                  </v-col>

                  <v-col cols="6">
                    <v-btn
                      block
                      color="blue-darken-3"
                      size="small"
                      variant="flat"
                      style="height: 40px"
                      @click="goBack()"
                    >
                      Add New Visitor
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" class="mb-4" v-if="visitor.type === 'walk-in'">
            <v-form ref="walkinForm">
              <v-col cols="12" class="mb-5">
                <v-img
                  :src="`/images/${addVisitorSteps <= 2 ? 'visitor-walkin.svg' : 'confirmation.svg'}`"
                  height="125"
                />
              </v-col>
              <v-col cols="12" v-if="addVisitorSteps && addVisitorSteps <= 2">
                <v-row class="px-3" justify="space-between">
                  <span class="font-weight-bold">
                    <v-btn
                      v-if="addVisitorSteps === 2"
                      size="x-small"
                      variant="flat"
                      class="grey-darken-1"
                      icon="mdi-chevron-left"
                      @click="addVisitorSteps--"
                    />

                    {{
                      addVisitorSteps === 1
                        ? "General"
                        : addVisitorSteps === 2
                          ? "Pass"
                          : "Member"
                    }}
                    Information
                  </span>
                  <v-chip size="small" color="grey-lighten-1">
                    <span :class="`${theme === 'light' && 'text-black'}`">
                      Step
                      <span class="text-blue">{{ addVisitorSteps }}</span
                      >/2
                    </span>
                  </v-chip>
                  <v-col cols="12" class="text-body-2 text-end">
                    <span class="text-red font-weight-bold">* </span>
                    <span> are required fields</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-row v-if="addVisitorSteps == 1">
                <v-col class="d-flex ga-12" cols="12">
                  <v-text-field
                    v-model="visitor.firstName"
                    label="Name"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-menu
                    v-model="nricMenu"
                    :close-on-content-click="false"
                    offset-y
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-if="!displayInput"
                        v-model="visitor.nric"
                        label="NRIC/Passport/ID No. (optional)"
                        hide-details
                        clearable
                        :disabled="isProgress"
                        @input="handleInputNric"
                        @update:modelValue="onSearchNRIC"
                        v-bind="props"
                      >
                        <template v-slot:append>
                          <slot name="append">
                            <v-btn
                              height="40px"
                              color="#1867C0"
                              @click="openNricScan()"
                            >
                              <v-icon>mdi-camera</v-icon>
                            </v-btn>
                          </slot>
                        </template></v-text-field
                      >
                    </template>
                    <!-- Dropdown menu for suggestions -->
                    <v-list v-if="nricOptions && nricOptions.length">
                      <v-list-item
                        v-for="(item, index) in nricOptions"
                        :key="index"
                        @click="selectNricOption(item)"
                      >
                        <v-list-item>
                          <v-list-item-title
                            v-text="item.name"
                          ></v-list-item-title>
                        </v-list-item>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>

                <v-col
                  cols="12"
                  class="text-center"
                  :style="{
                    position: 'relative',
                    marginBottom: `${!enabledCam ? '-150px' : '-8px'}`,
                  }"
                >
                  <canvas
                    ref="canvas"
                    id="canvas"
                    width="640"
                    class="rounded-lg"
                    height="480"
                    style="position: relative; width: 100%; display: none"
                  />
                </v-col>

                <v-col cols="4">
                  <v-select
                    v-model="prefix"
                    :items="prefixes"
                    item-title="country"
                    item-value="dial_code"
                    chips
                    label="Dial Code"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                  >
                    <template v-slot:chip="{ props, item }">
                      <v-row no-gutters v-bind="props">
                        <v-col cols="12">
                          {{ item.raw.dial_code }}
                        </v-col>
                      </v-row>
                    </template>
                    <template v-slot:item="{ props, item }">
                      <v-row no-gutters v-bind="props" class="px-3">
                        <v-col cols="auto">
                          <v-avatar
                            size="30"
                            :image="item.raw.flag"
                            class="mr-4"
                          ></v-avatar>
                        </v-col>
                        <v-col>
                          <span>{{ item.raw.dial_code }}</span>
                        </v-col>
                        <v-col class="text-center">
                          <v-chip color="primary">{{
                            item.raw.country
                          }}</v-chip>
                        </v-col>
                      </v-row>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    v-model="primaryPhone"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @input="handleInputPhone"
                  >
                    <template v-slot:label>
                      Phone Number
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="visitor.block"
                    :items="blocks"
                    item-title="name"
                    item-value="_id"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @update:modelValue="onSelectBlock(visitor.block)"
                    @update:search="onSearchBlock"
                    clearable
                    no-filter
                  >
                    <template v-slot:label>
                      Block
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                    <template v-slot:append-item>
                      <div
                        v-if="canNextBlockPage"
                        v-intersect="endBlockIntersect" />
                      <v-row
                        no-gutters
                        align-content="center"
                        v-if="canNextBlockPage"
                      >
                        <v-col cols="12" class="d-flex justify-center">
                          <v-progress-circular
                            :size="20"
                            color="primary"
                            indeterminate
                          ></v-progress-circular>
                        </v-col> </v-row
                    ></template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="visitor.blockLevel"
                    :items="blockLevels"
                    item-title="level"
                    item-value="_id"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @update:modelValue="
                      onSelectBlockLevel(visitor.block, visitor.blockLevel)
                    "
                    @update:search="onSearchBlockLevel"
                    clearable
                    no-filter
                  >
                    <template v-slot:label>
                      Level
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                    <template v-slot:append-item>
                      <div
                        v-if="canNextLevelPage"
                        v-intersect="endLevelIntersect"
                      />
                      <v-row
                        no-gutters
                        align-content="center"
                        v-if="canNextLevelPage"
                      >
                        <v-col cols="12" class="d-flex justify-center">
                          <v-progress-circular
                            :size="20"
                            color="primary"
                            indeterminate
                          ></v-progress-circular>
                        </v-col>
                      </v-row>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="visitor.unit"
                    :items="units"
                    item-title="name"
                    item-value="_id"
                    label="Unit *"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @update:search="onSearchBlockLevelUnit"
                    clearable
                    no-filter
                  >
                    <template v-slot:label>
                      Unit
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                    <template v-slot:append-item>
                      <div
                        v-if="canNextUnitPage"
                        v-intersect="endUnitIntersect"
                      />
                      <v-row
                        no-gutters
                        align-content="center"
                        v-if="canNextUnitPage"
                      >
                        <v-col cols="12" class="d-flex justify-center">
                          <v-progress-circular
                            :size="20"
                            color="primary"
                            indeterminate
                          ></v-progress-circular>
                        </v-col>
                      </v-row>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="visitor.remarks"
                    label="Remarks"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    rows="3"
                    no-resize
                  ></v-textarea>
                </v-col>
              </v-row>

              <v-row v-if="addVisitorSteps === 2" class="mt-5">
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
                <v-spacer></v-spacer>
              </v-row>
              <v-col cols="12" v-if="addVisitorSteps === 3">
                <div class="text-center mt-6 text-subtitle-1 font-weight-bold">
                  Great!
                </div>
                <div class="text-center mt-2 text-caption">
                  A new visitor is added to the list of visitors
                </div>
                <v-row class="px-3 mt-5" justify="space-between">
                  <v-col cols="6">
                    <v-btn
                      block
                      size="small"
                      variant="flat"
                      style="height: 40px"
                      @click="onCloseDialog()"
                    >
                      Close
                    </v-btn>
                  </v-col>

                  <v-col cols="6">
                    <v-btn
                      block
                      color="blue-darken-3"
                      size="small"
                      variant="flat"
                      style="height: 40px"
                      @click="goBack()"
                    >
                      Add New Visitor
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-btn
                  v-if="addVisitorSteps === 1"
                  block
                  color="blue-darken-3"
                  size="small"
                  variant="flat"
                  style="height: 40px"
                  @click="validateContractorStep"
                >
                  Next
                </v-btn>
                <v-btn
                  v-if="addVisitorSteps !== 1 && addVisitorSteps !== 3"
                  block
                  color="blue-darken-3"
                  size="small"
                  variant="flat"
                  style="height: 40px"
                  @click="submit()"
                  :disabled="isProgress"
                  :loading="isProgress"
                >
                  Add Walk-In
                </v-btn>
              </v-col>
            </v-form>
          </v-col>

          <v-col
            cols="12"
            class="mb-4"
            v-if="visitor.type === 'pick-up' || visitor.type === 'drop-off'"
          >
            <v-form ref="pickupForm">
              <v-row v-if="addVisitorSteps === 1">
                <v-col cols="12" class="mb-5">
                  <v-img :src="`/images/visitor-walkin.svg`" height="125" />
                </v-col>

                <v-col cols="12">
                  <div class="font-weight-bold">General information</div>
                  <div class="text-body-2 text-end">
                    <span class="text-red font-weight-bold">* </span>
                    <span> are required fields</span>
                  </div>
                </v-col>

                <v-col cols="12">
                  <v-menu
                    v-model="vehicleMenu"
                    :close-on-content-click="false"
                    offset-y
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-model="visitor.plateNumber"
                        density="comfortable"
                        hide-details
                        clearable
                        :disabled="isProgress"
                        :rules="[requiredInput]"
                        @input="handleInputVehicleNumber"
                        @update:modelValue="onSearchVehicleNumber"
                        v-bind="props"
                      >
                        <template v-slot:label>
                          Vehicle Number
                          <span class="text-red font-weight-bold">*</span>
                        </template></v-text-field
                      >
                    </template>
                    <!-- Dropdown menu for suggestions -->
                    <v-list
                      v-if="
                        Array.isArray(vehicleOptions) && vehicleOptions.length
                      "
                    >
                      <v-list-item
                        v-for="(item, index) in vehicleOptions"
                        :key="index"
                        @click="selectVehicleOption(item)"
                      >
                        <v-list-item>
                          <v-list-item-title
                            v-text="item.name"
                          ></v-list-item-title>
                        </v-list-item>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="visitor.pickupDropoffType"
                    :items="pickupDropoffTypes"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    clearable
                    no-filter
                    @update:modelValue="
                      onSelectPickUpDropoffType(visitor.pickupDropoffType)
                    "
                  >
                    <template v-slot:label>
                      Type
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="visitor.companyName"
                    :items="companies"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    clearable
                  >
                    <template v-slot:label>
                      Company
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="visitor.block"
                    :items="blocks"
                    item-title="name"
                    item-value="_id"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @update:search="onSearchBlock"
                    clearable
                    no-filter
                  >
                    <template v-slot:label>
                      Block
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                    <template v-slot:append-item>
                      <div
                        v-if="canNextBlockPage"
                        v-intersect="endBlockIntersect" />
                      <v-row
                        no-gutters
                        align-content="center"
                        v-if="canNextBlockPage"
                      >
                        <v-col cols="12" class="d-flex justify-center">
                          <v-progress-circular
                            :size="20"
                            color="primary"
                            indeterminate
                          ></v-progress-circular>
                        </v-col> </v-row
                    ></template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="visitor.remarks"
                    label="Remarks"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    rows="3"
                    no-resize
                  ></v-textarea>
                </v-col>

                <v-col cols="12">
                  <v-btn
                    block
                    color="blue-darken-3"
                    size="small"
                    variant="flat"
                    style="height: 40px"
                    @click="submit()"
                    :disabled="isProgress"
                    :loading="isProgress"
                  >
                    Add {{ visitor.type }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>

            <v-row v-if="addVisitorSteps == 2">
              <v-col cols="12" class="mb-5">
                <v-img :src="`/images/confirmation.svg`" height="125" />
              </v-col>

              <v-col cols="12">
                <div class="text-center mt-6 text-subtitle-1 font-weight-bold">
                  Great!
                </div>
                <div class="text-center mt-2 text-caption">
                  A new visitor is added to the list of visitors
                </div>
                <v-row class="px-3 mt-5" justify="space-between">
                  <v-col cols="6">
                    <v-btn
                      block
                      size="small"
                      variant="flat"
                      style="height: 40px"
                      @click="onCloseDialog()"
                    >
                      Close
                    </v-btn>
                  </v-col>

                  <v-col cols="6">
                    <v-btn
                      block
                      color="blue-darken-3"
                      size="small"
                      variant="flat"
                      style="height: 40px"
                      @click="goBack()"
                    >
                      Add New Visitor
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <span :class="`${$vuetify.display.mdAndUp && 'pl-4'} text-caption`">
          @ 2024 by Seven 365 Pte Ltd V1.0
        </span>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

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

  <!-- Dialog for NRIC Scanning -->
  <v-dialog
    v-model="isNricScanning"
    transition="dialog-bottom-transition"
    width="700"
    max-width="700"
    persistent
    @after-enter="startNricScanner"
  >
    <v-container class="d-flex justify-center" max-height="90vh">
      <!-- QR code reader container -->
      <v-card elevation="2" class="d-flex flex-column align-center pa-2">
        <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
          <v-card-title class="text-h5"> Scan NRIC </v-card-title>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            icon="mdi-close"
            @click="closeNricScan()"
          ></v-btn>
        </v-toolbar>
        <video
          ref="ivideo"
          class="mt-4"
          autoplay
          style="width: 500px; height: 300px"
        />

        <v-row align="center" justify="center">
          <v-col cols="6"
            ><v-btn color="primary" icon class="mt-4" @click="onCaptureNric()">
              <v-icon large>mdi-camera-outline</v-icon>
            </v-btn></v-col
          >
          <v-col cols="6"
            ><v-btn
              color="secondary"
              icon
              class="mt-4"
              @click="switchNricCamera()"
            >
              <v-icon large>mdi-camera-switch</v-icon>
            </v-btn></v-col
          >
        </v-row>
      </v-card>
    </v-container>
  </v-dialog>
  <!-- End dialog for NRIC Scanning -->
  <OcrScanner
    :isNricScanning="isNricScanning"
    @onScanning="
      (e) => {
        isNricScanning = false;
        isNricDetecting = e;
      }
    "
    @onHideDialog="onHideOcrScanner($event)"
  />
</template>

<script setup lang="ts">
import moment, { calendarFormat } from "moment-timezone";
import phoneCode from "@/components/old-phone-code.json";
import debounce from "lodash/debounce";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const prefixes = phoneCode;

const {
  requiredInput,
  standardFormatDate,
  standardFormatDateTime,
  getPast30DaysDate,
} = useUtils();
const {
  tab,
  visitor,
  contractorTypes,
  addVisitor,
  addVisitorTemp,
  setVisitor,
  setVisitors,
  visitorTypes,
  addVisitorDialog,
  editVisitorDialog,
  addVisitorSteps,
  addMultipleContractor,
  filterVisitor,
  addVisitorRealtime,
  getScannedNricInfo,
  searchVehicleNumber,
  searchNRIC,
  searchPhoneNumber,
  pickupDropoffTypes,
  filesUrlUploaded,
  showUploadedFiles,
  page: pageVisitor,
  updateVisitorTemp,
} = useVisitor();
const {
  allBlocks,
  getAllBlocks,
  search: blockSearch,
  setBlocks,
  blocks,
  pages: blockPages,
  page: blockPage,
  canNextPage: canNextBlockPage,
  nextPage: nextBlockPage,
  loadMore: loadMoreBlocks,
} = useBlock();
const {
  blockLevels,
  setBlockLevels,
  allBlockLevels,
  getAllLevelsUsingBlock,
  search: levelSearch,
  pages: levelPages,
  page: levelPage,
  canNextPage: canNextLevelPage,
  nextPage: nextLevelPage,
  loadMore: loadMoreLevels,
} = useBlockLevel();
const {
  getAllUnitsUsingLevel,
  allUnits,
  search: unitSearch,
  units,
  setUnits,
  pages: unitPages,
  page: unitPage,
  canNextPage: canNextUnitPage,
  nextPage: nextUnitPage,
  loadMore: loadMoreUnits,
} = useBlockLevelUnit();
//const { passList, keyList, getPassList } = useKey();
const { getPassKeysByPageSearch, isPassListLoading, isKeyListLoading } =
  usePassKey();

const passList = ref([]);
const keyList = ref([]);
const hasNextPage = ref(true);
const { theme, setSnackbar } = useLocal();
const { currentUser } = useLocalAuth();
const { getSitesOptionsForFiltering, mySite, myOrg } = useFilter();

const { siteSetting } = useSiteSettings();

const isProgress = ref(false);
const uploadUsingCsv = ref(false);
const payloadForm = ref({});
const willOvernight = ref(false);

const displayInput = ref(false);
const enabledCam = ref(true);
const takePicture = ref(false);
const takePictureViaMobile = ref(false);
const video = ref(null);
const canvas = ref(null);
const flash = ref(null);
const companies = ref([]);
const passes = ref([]);
const showCameraDialog = ref(false);
const cameraFacingMode = ref("environment");
const isCapturing = ref(false);
const imagePreviews = ref([]);
const selectedImages = ref([]);
const uploadedFiles = ref<
  Array<{ name: string; data: File; progress: number; url: string }>
>([]);
const fileInput = ref<InstanceType<typeof BaseFileInput> | null>(null);
// Step 1 selected pass
const selectedPassStep1 = ref(null);

let timerId: NodeJS.Timeout | null = null;
const nricOptions = ref(null);
const nricMenu = ref(false);

//vehicle search
const vehicleOptions = ref(null);
const vehicleMenu = ref(false);

const showQRdialog = ref(false);
const html5QrCodeInstance = ref(null);
const showNotFoundMessage = ref(false);
const errorMessage = ref("");
const { $Html5Qrcode } = useNuxtApp();
const ivideo = ref({});
const isTemporary = ref(false);

const isNricScanning = ref(false);
const isNricDetecting = ref(false);
const isNricOngoingDetection = computed(() => isNricDetecting.value);
const nricScanningIntervalId = ref();
const isDetectingNricHints = ref(false);
const isDetectingNricHintsHighConfidence = ref(false);
const isDetectingNric = computed(() => isDetectingNricHints.value);
const isDetectingNricHighConfidence = computed(
  () => isDetectingNricHintsHighConfidence.value,
);
const isNricDetected = ref(false);
const openNricScan = () => {
  isNricScanning.value = true;
};

const closeNricScan = () => {
  isNricScanning.value = false;
  stopNricScanner();
};

const contractorMember = ref({
  name: null,
  nric: "",
  visitorPass: null,
});

const openDialog = () => {
  showQRdialog.value = true;
};

const onCaptureNric = async () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = ivideo.value.videoWidth;
  canvas.height = ivideo.value.videoHeight;
  context.drawImage(ivideo.value, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL("image/png");

  isProgress.value = true;
  const result = await getScannedNricInfo({
    image: imageData,
  });

  if (result) {
    visitor.value.nric = result[2];
    visitor.value.firstName = result[8];
    isProgress.value = false;
    closeNricScan();
  }
};

const switchNricCamera = () => {
  cameraFacingMode.value =
    cameraFacingMode.value === "user" ? "environment" : "user";
  stopNricScanner(); // Stop the current camera stream
  startNricScanner(); // Start the camera with the new facing mode
};

const startNricScanner = async () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: cameraFacingMode.value },
        audio: false,
      })
      .then((stream) => {
        ivideo.value.style.display = "";
        ivideo.value.srcObject = stream;
        ivideo.value.play();
      });
  }
};

const stopNricScanner = async () => {
  if (ivideo.value) {
    const stream = ivideo.value.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });

    ivideo.value.srcObject = null;
  }
};

const startScanner = async () => {
  console.log("SVAL", cameraFacingMode.value);

  console.log("STARTING");
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
          if (addVisitorSteps.value == 2) {
            isPassListLoading.value = true;
            const result1: any = await getPassKeysByPageSearch({
              sites: [mySite.value],
              limit: 10,
              passTypes: [
                visitor.value.type == "contractor"
                  ? visitor.value.contractorType == "property-agent"
                    ? "agent-pass"
                    : "contractor-pass"
                  : "visitor-pass",
                "pass-key",
              ],
              search: qrCodeMessage,
            });

            isPassListLoading.value = false;

            if (result1?.items.length < 1) {
              setSnackbar({
                text: `${visitor.value.type !== "contractor" ? "Visitor" : "Contractor"} Pass or Key not found.`,
                type: "error",
                modal: true,
              });
            } else if (result1?.items.length > 1) {
              const namePassOrKey =
                result1?.items[0].passType == "pass-key" ? "Key" : "Pass";
              setSnackbar({
                text: `${visitor.value.type !== "contractor" ? "Visitor" : "Contractor"} ${namePassOrKey} found duplicates.`,
                type: "error",
                modal: true,
              });
            } else {
              if (result1?.items[0].status != "Available") {
                const namePassOrKey =
                  result1?.items[0].passType == "pass-key" ? "Key" : "Pass";
                setSnackbar({
                  text: `${visitor.value.type !== "contractor" ? "Visitor" : "Contractor"} ${namePassOrKey} is ${result1?.items[0].status}`,
                  type: "error",
                  modal: true,
                });
              } else {
                if (result1?.items[0].passType == "pass-key") {
                  if (!Array.isArray(visitor.value.passKeys)) {
                    visitor.value.passKeys = [];
                  }

                  if (
                    visitor.value.passKeys.some(
                      (item) => item._id === result1?.items[0]._id,
                    )
                  ) {
                    setSnackbar({
                      text: `${visitor.value.type !== "contractor" ? "Visitor" : "Contractor"} ${result1?.items[0].prefixAndName} is already selected`,
                      type: "error",
                      modal: true,
                    });
                  } else {
                    visitor.value.passKeys.push(result1?.items[0]);
                  }
                } else {
                  passList.value = result1?.items;
                  console.log("PASS LIST");
                  // visitor.value.visitorPass = result1?.items[0]._id;
                  if (visitor.value.visitorPass === result1?.items[0]._id) {
                    setSnackbar({
                      text: `${visitor.value.type !== "contractor" ? "Visitor" : "Contractor"} ${result1?.items[0].prefixAndName} is already selected`,
                      type: "error",
                      modal: true,
                    });
                  } else {
                    visitor.value.visitorPass = result1?.items[0]._id;
                  }
                }
              }
            }
          } else if (addVisitorSteps.value === 3) {
            console.log("QR CODE", qrCodeMessage);
            const filteredPassList = await getFilteredPassListForStep2();
            const regularObjects = filteredPassList.map((item) =>
              JSON.parse(JSON.stringify(item)),
            );
            const matchingObject = regularObjects.find(
              (item) => item.prefixAndName === qrCodeMessage,
            );

            console.log("Matching Object", matchingObject);
            if (matchingObject) {
              contractorMember.value.visitorPass = matchingObject._id;
            } else {
              setSnackbar({
                text: `${visitor.value.type !== "contractor" ? "Visitor" : "Contractor"} ${qrCodeMessage} is currently selected`,
                type: "error",
                modal: true,
              });
            }
            console.log("Filtered Pass List", regularObjects);
          } else {
            showNotFoundMessage.value = true;
            errorMessage.value = "Invalid QR Code Scanned!";
          }
        }
      },
      (msg: string) => {
        if (msg === "QR Code no longer in front") {
          showNotFoundMessage.value = true;
          errorMessage.value = msg;
        } else {
          console.log(`Error: ${msg}`);
        }
      },
    )
    .catch((err) => {
      console.log(`Unable to start scanning, error: ${err}`);
    });
};

const stopScanner = () => {
  return new Promise((resolve, reject) => {
    if (html5QrCodeInstance.value) {
      html5QrCodeInstance.value
        .stop()
        .then(() => {
          console.log("QR Code scanning stopped.");
          html5QrCodeInstance.value.clear();
          html5QrCodeInstance.value = null;
          showNotFoundMessage.value = false;
          resolve(); // Resolve the promise when the scanner is fully stopped
        })
        .catch((err) => {
          console.log("Unable to stop scanning.", err);
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

const onFileAttach = (
  fileList: Array<{ name: string; data: File; progress: number; url: string }>,
) => {
  uploadedFiles.value = [...uploadedFiles.value, ...fileList];
  showUploadedFiles(uploadedFiles.value);
};

const appendCapturedImage = (capturedImage: File) => {
  if (fileInput.value) {
    fileInput.value.addFileToInput(capturedImage);
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

const dataURLtoFile = (dataUrl, filename) => {
  const [header, data] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(data);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new File([new Uint8Array(array)], filename, { type: mime });
};

//end

// Filter pass list for Step 1 (removing selected passes from Step 2)
const getFilteredPassListForStep1 = computed(() => {
  const selectedInStep2 = visitor.value.members
    ?.map((select) => select.visitorPass)
    .filter(Boolean);

  return passList.value.filter(
    (pass: any) => !selectedInStep2.includes(pass._id),
  );
});

// Filter pass list for Step 2 (removing selected pass from Step 1 and other selects in Step 2)
const getFilteredPassListForStep2 = () => {
  const selectedInStep1 = visitor.value.visitorPass || null;
  const selectedInStep2 = visitor.value.members
    //.slice(0, index) // Get previously selected values in Step 2
    .map((select: any) => select.visitorPass)
    .filter(Boolean); // Remove null/undefined
  const selectedIds = [selectedInStep1, ...selectedInStep2].filter(Boolean);
  return result1.value.items.filter(
    (pass: any) => !selectedIds.includes(pass._id),
  );
};

async function endBlockIntersect(isIntersecting: any, entries: any) {
  if (isIntersecting && entries[0].boundingClientRect.top > 0) {
    loadMoreBlocks({ site: mySite.value });
  }
}

async function endLevelIntersect(isIntersecting: any, entries: any) {
  if (isIntersecting && entries[0].boundingClientRect.top > 0) {
    loadMoreLevels({ block: visitor.value.block });
  }
}

async function endUnitIntersect(isIntersecting: any, entries: any) {
  if (isIntersecting && entries[0].boundingClientRect.top > 0) {
    loadMoreUnits({
      block: visitor.value.block,
      level: visitor.value.blockLevel,
    });
  }
}

const dateTomorrow = ref(new Date().toISOString().slice(0, 16));

function onSearchVehicleNumber(val: string) {
  debouncedSearch(val);
}

function onSearchNRIC(val: string) {
  debouncedSearchNric(val);
}

function onSearchPhoneNumber(val: string) {
  debouncedSearchPhoneNumber(val);
}

const debouncedSearch = debounce(async (value: string) => {
  vehicleMenu.value = false;
  const result = await searchVehicleNumber({
    site: mySite.value,
    plateNumber: value,
  });

  if (
    result.message == "Result found" &&
    result.data &&
    Array.isArray(result.data) &&
    result.data.length !== 0
  ) {
    if (result.data.length === 1) {
      result?.data[0].companyName
        ? (visitor.value.companyName = result?.data[0].companyName)
        : null;
      result?.data[0].pickUpDropOffType
        ? (visitor.value.pickupDropoffType = result?.data[0].pickupDropoffType)
        : null;
      result?.data[0].email
        ? (visitor.value.email = result?.data[0].email)
        : null;
      result?.data[0].firstName
        ? (visitor.value.firstName = result?.data[0].firstName)
        : null;
      result?.data[0].lastName
        ? (visitor.value.lastName = result?.data[0].lastName)
        : null;
      result?.data[0].nric ? (visitor.value.nric = result?.data[0].nric) : null;

      result?.data[0].phoneNumber && result?.data[0].phoneNumber !== ""
        ? (primaryPhone.value = parsePhoneNumberFromString(
            result?.data[0].phoneNumber,
          ).nationalNumber)
        : null;
    } else {
      vehicleMenu.value = true;
      vehicleOptions.value = result.data;
    }
  }
}, 500);

const debouncedSearchNric = debounce(async (value: string) => {
  if (!value || value.trim() === "") {
    nricMenu.value = false;
    nricOptions.value = [];
    return;
  }

  nricMenu.value = false;
  const result = await searchNRIC({
    site: mySite.value,
    nric: value,
  });

  if (
    result.message == "Result found" &&
    result.data &&
    Array.isArray(result.data) &&
    result.data.length !== 0
  ) {
    if (result.data.length === 1) {
      result?.data[0].companyName
        ? (visitor.value.companyName = result?.data[0].companyName)
        : null;
      result?.data[0].pickUpDropOffType
        ? (visitor.value.pickupDropoffType = result?.data[0].pickupDropoffType)
        : null;
      result?.data[0].email
        ? (visitor.value.email = result?.data[0].email)
        : null;
      result?.data[0].firstName
        ? (visitor.value.firstName = result?.data[0].firstName)
        : null;
      result?.data[0].lastName
        ? (visitor.value.lastName = result?.data[0].lastName)
        : null;
      result?.data[0].nric ? (visitor.value.nric = result?.data[0].nric) : null;

      result?.data[0].phoneNumber && result?.data[0].phoneNumber !== ""
        ? (primaryPhone.value = parsePhoneNumberFromString(
            result?.data[0].phoneNumber,
          ).nationalNumber)
        : null;
    } else {
      nricMenu.value = true;
      nricOptions.value = result.data;
    }
  }
}, 500);

const selectNricOption = (item: { name: string; value: string }) => {
  nricMenu.value = false;
  visitor.value.nric = item.nric ? item.nric : null;
  visitor.value.companyName = item.companyName ? item.companyName : null;
  visitor.value.firstName = item.firstName ? item.firstName : null;
  visitor.value.lastName = item.lastName ? item.lastName : null;
  primaryPhone.value =
    item.phoneNumber && item.phoneNumber !== ""
      ? parsePhoneNumberFromString(item.phoneNumber).nationalNumber
      : null;
  nricOptions.value = null;
};

const selectVehicleOption = (item: { name: string; value: string }) => {
  vehicleMenu.value = false;
  visitor.value.nric = item.nric ? item.nric : null;
  visitor.value.companyName = item.companyName ? item.companyName : null;
  visitor.value.firstName = item.firstName ? item.firstName : null;
  visitor.value.lastName = item.lastName ? item.lastName : null;
  primaryPhone.value =
    item.phoneNumber && item.phoneNumber !== ""
      ? parsePhoneNumberFromString(item.phoneNumber).nationalNumber
      : null;
  vehicleOptions.value = null;
};

const debouncedSearchPhoneNumber = debounce(async (value: string) => {
  const result = await searchPhoneNumber({
    site: mySite.value,
    phoneNumber: value,
  });

  if (result.message == "Result found" || result.message == "No data found!") {
    result?.data?.companyName
      ? (visitor.value.companyName = result?.data?.companyName)
      : null;
    result?.data?.pickUpDropOffType
      ? (visitor.value.pickupDropoffType = result?.data?.pickupDropoffType)
      : null;
    result?.data?.email ? (visitor.value.email = result?.data?.email) : null;
    result?.data?.firstName
      ? (visitor.value.firstName = result?.data?.firstName)
      : null;
    result?.data?.lastName
      ? (visitor.value.lastName = result?.data?.lastName)
      : null;
    result?.data?.nric ? (visitor.value.nric = result?.data?.nric) : null;

    result?.data?.phoneNumber && result?.data?.phoneNumber !== ""
      ? (primaryPhone.value = parsePhoneNumberFromString(
          result?.data?.phoneNumber,
        ).nationalNumber)
      : null;
  } else {
    setSnackbar({
      text: result?.message,
      type: "error",
      modal: true,
    });
  }
}, 500);

const handleInputNric = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  if (target) {
    const originalValue = target.value;

    const transformedValue = originalValue
      .replace(/[^A-Z0-9]/gi, "")
      .toUpperCase();
    visitor.value.nric = transformedValue;
  }
};
const populateFields = () => {
  console.log("populated");
};

const handleInputVehicleNumber = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  if (target) {
    const originalValue = target.value;

    const transformedValue = originalValue
      .replace(/[^A-Z0-9]/gi, "")
      .toUpperCase();
    visitor.value.plateNumber = transformedValue;
  }
};

const handleInputPhone = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  if (target) {
    const originalValue = target.value;

    const transformedValue = originalValue.replace(/[^\d]/g, "");
    primaryPhone.value = transformedValue;
  }
};

onMounted(async () => {
  try {
    blockSearch.value = "";
    levelSearch.value = "";
    unitSearch.value = "";
    setVisitor();
    setInitialCheckIn();
    await setBlocks({ site: mySite.value });
    await getSitesOptionsForFiltering();
  } catch (err) {
    console.log("ERR: ", err);
  }
});

onBeforeUnmount(() => {
  blockSearch.value = "";
  levelSearch.value = "";
  unitSearch.value = "";
  setVisitor();
  if (timerId !== null) {
    clearInterval(timerId!);
  }
});

watch(
  willOvernight,
  (newValue) => {
    const tomorrowDate = `${new Date(new Date().setDate(new Date().getDate() + 1))}`;
    visitor.value.checkOut = newValue
      ? `${standardFormatDate(tomorrowDate)} 00:00`
      : "";
  },
  { deep: true },
);

const setInitialCheckIn = () => {
  updateCheckIn();
  startTimer();
};

const updateCheckIn = () => {
  const now = new Date();

  if (visitor.value.type === "walk-in") {
    visitor.value.checkIn = standardFormatDateTime(now);
  }
};

const startTimer = () => {
  timerId = setInterval(updateCheckIn, 1000);
};

const prefix = ref("+65");
const primaryPhone = ref("");
const fullPhoneNumber = ref("");
watch([prefix, primaryPhone], ([newPrefix, newPrimaryPhone]) => {
  if (!newPrefix || !newPrimaryPhone) {
    fullPhoneNumber.value = ""; // Handle null or undefined values
  } else {
    fullPhoneNumber.value = `${newPrefix}${newPrimaryPhone}`;
  }
  // Update the contact information in props
  visitor.value.phoneNumber = fullPhoneNumber.value;
});

const keys = computed(() => {
  return keyList.value.map((k: { codes: string | any[]; code: any }) => {
    const codes = k.codes || [];
    if (k.codes && k.codes.length > 0 && !k.code) {
      return {
        ...k,
        code: codes[0],
      };
    }
    return k;
  });
});

async function onOpenCamera() {
  if (!enabledCam.value) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" }, audio: false })
        .then((stream) => {
          video.value.style.display = "";
          video.value.srcObject = stream;
          video.value.play();

          enabledCam.value = true;
        });
    }
  } else {
    video.value.srcObject = null;
    video.value.pause();
    video.value.currentTime = 0;
    enabledCam.value = false;
  }
}

async function onCaptureImage() {
  canvas.value.getContext("2d").drawImage(video.value, 0, 0, 640, 480);
  canvas.value.style.display = "";

  video.value.style.display = "none";
  takePicture.value = true;
}

async function retakeImage() {
  canvas.value.style.display = "none";

  video.value.style.display = "";
  takePicture.value = false;

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        video.value.style.display = "";
        video.value.srcObject = stream;
        video.value.play();
        enabledCam.value = true;
      });
  }
}

async function onSelectImage(event: any) {
  if (event.target.files[0] != null) {
    const base_image = new Image();
    const image = event.target.files[0];

    base_image.src = URL.createObjectURL(image);
    base_image.onload = function () {
      canvas.value.getContext("2d").drawImage(base_image, 0, 0, 640, 480);
      canvas.value.style.display = "";
      canvas.value.style.marginBottom = "140px";

      takePictureViaMobile.value = true;
    };
  }
}

async function onUploadImage() {
  try {
    isProgress.value = true;
    const result = await getScannedNricInfo({
      image: canvas.value.toDataURL(),
    });

    visitor.value.nric = result[2];
    visitor.value.firstName = result[8];

    isProgress.value = false;
    enabledCam.value = false;
    takePicture.value = false;
    takePictureViaMobile.value = false;
    displayInput.value = false;

    canvas.value.style.display = "none";
    video.value.style.display = "none";

    canvas.value.toDataURL();

    const stream = video.value.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });

    video.value.srcObject = null;
  } catch (err) {}
}

async function onCancelCamera() {
  const stream = video.value.srcObject;
  const tracks = stream.getTracks();

  tracks.forEach((track) => {
    track.stop();
  });

  video.value.srcObject = null;

  isProgress.value = false;
  enabledCam.value = false;
  takePicture.value = false;
  takePictureViaMobile.value = false;
  displayInput.value = false;

  canvas.value.style.display = "none";
  video.value.style.display = "none";

  canvas.value.toDataURL();
}

interface IVisitorFormRef {
  validate: () => void;
}

const guestForm: Ref<IVisitorFormRef | null> = ref(null);
const contractorForm: Ref<IVisitorFormRef | null> = ref(null);
const deliveryForm: Ref<IVisitorFormRef | null> = ref(null);
const walkinForm: Ref<IVisitorFormRef | null> = ref(null);
const pickupForm: Ref<IVisitorFormRef | null> = ref(null);

function clearForm() {
  contractorMember.value = { name: null, nric: "", visitorPass: null };
}

async function submit() {
  if (visitor.value.type === "guest") {
    let visitorPass: any = [];

    if (
      typeof visitor.value.visitorPass === "string" &&
      /^[0-9a-fA-F]{24}$/.test(visitor.value.visitorPass)
    ) {
      visitorPass = [{ keyId: visitor.value.visitorPass }];
    }

    let dataArgument = JSON.parse(
      JSON.stringify({
        ...visitor.value,
        visitorPass,
      }),
    );

    if (dataArgument.checkIn)
      dataArgument.checkIn = moment
        .tz(dataArgument.checkIn, "DD/MM/YYYY HH:mm", "Asia/Singapore")
        .toDate();
    if (dataArgument.checkOut)
      dataArgument.checkOut = moment
        .tz(dataArgument.checkOut, "DD/MM/YYYY HH:mm", "Asia/Singapore")
        .toDate();

    onAddVisitorFetch(dataArgument);
  } else if (visitor.value.type === "contractor") {
    if (
      contractorMember.value?.name ||
      contractorMember.value?.nric ||
      contractorMember.value?.visitorPass
    ) {
      setSnackbar({
        text: "Kindly clear the form first if you do not wish to add them, else continue to 'Add Member'.",
        modal: true,
        type: "error",
      });
    } else {
      let visitorPass: any = [];

      if (
        typeof visitor.value.visitorPass === "string" &&
        /^[0-9a-fA-F]{24}$/.test(visitor.value.visitorPass)
      ) {
        visitorPass = [{ keyId: visitor.value.visitorPass }];
      }

      let dataArgument = JSON.parse(
        JSON.stringify({
          ...visitor.value,
          visitorPass,
          passKeys: visitor.value.passKeys?.map((key: any) => ({
            keyId: key._id,
          })),
        }),
      );
      if (dataArgument.checkIn)
        dataArgument.checkIn = moment
          .tz(dataArgument.checkIn, "DD/MM/YYYY HH:mm", "Asia/Singapore")
          .toDate();
      if (dataArgument.checkOut)
        dataArgument.checkOut = moment
          .tz(dataArgument.checkOut, "DD/MM/YYYY HH:mm", "Asia/Singapore")
          .toDate();

      onAddVisitorFetch(dataArgument);
    }
  } else if (visitor.value.type === "delivery") {
    if (
      !visitor.value.companyName ||
      !visitor.value.phoneNumber ||
      !visitor.value.block ||
      !visitor.value.blockLevel ||
      !visitor.value.unit
    ) {
      deliveryForm.value?.validate();

      if (!visitor.value.firstName && !visitor.value.lastName) {
        return setSnackbar({
          text: "Name is required",
          type: "error",
          modal: true,
        });
      } else if (!visitor.value.companyName) {
        return setSnackbar({
          text: "Company name is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.phoneNumber) {
        return setSnackbar({
          text: "Phone number is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.block) {
        return setSnackbar({
          text: "Block is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.blockLevel) {
        return setSnackbar({
          text: "Level is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.unit) {
        return setSnackbar({
          text: "Unit is required",
          modal: true,
          type: "error",
        });
      }
    } else {
      let dataArgument = JSON.parse(JSON.stringify(visitor.value));
      if (dataArgument.checkIn)
        dataArgument.checkIn = moment
          .tz(dataArgument.checkIn, "DD/MM/YYYY HH:mm", "Asia/Singapore")
          .toDate();
      if (dataArgument.checkOut)
        dataArgument.checkOut = moment
          .tz(dataArgument.checkOut, "DD/MM/YYYY HH:mm", "Asia/Singapore")
          .toDate();
      onAddVisitorFetch(dataArgument);
    }
  } else if (visitor.value.type === "walk-in") {
    // let dataArgument = JSON.parse(JSON.stringify(visitor.value));

    let visitorPass: any = [];

    if (
      typeof visitor.value.visitorPass === "string" &&
      /^[0-9a-fA-F]{24}$/.test(visitor.value.visitorPass)
    ) {
      visitorPass = [{ keyId: visitor.value.visitorPass }];
    }

    let dataArgument = JSON.parse(
      JSON.stringify({
        ...visitor.value,
        visitorPass,
      }),
    );

    if (dataArgument.checkIn)
      dataArgument.checkIn = moment
        .tz(dataArgument.checkIn, "DD/MM/YYYY HH:mm", "Asia/Singapore")
        .toDate();
    if (dataArgument.checkOut)
      dataArgument.checkOut = moment
        .tz(dataArgument.checkOut, "DD/MM/YYYY HH:mm", "Asia/Singapore")
        .toDate();
    onAddVisitorFetch(dataArgument);
  } else if (
    visitor.value.type === "pick-up" ||
    visitor.value.type === "drop-off"
  ) {
    if (
      !visitor.value.plateNumber ||
      !visitor.value.pickupDropoffType ||
      !visitor.value.block
    ) {
      pickupForm.value?.validate();

      if (!visitor.value.plateNumber) {
        return setSnackbar({
          text: "Vehicle number is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.pickupDropoffType) {
        return setSnackbar({
          text: "Type is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.block) {
        return setSnackbar({
          text: "Block is required",
          modal: true,
          type: "error",
        });
      }
    } else {
      let dataArgument = JSON.parse(JSON.stringify(visitor.value));
      const currentDate = moment().tz("Asia/Singapore").toDate();
      const addOneHour = moment(currentDate).add(1, "hours").toDate();

      dataArgument.checkIn = currentDate;
      dataArgument.checkOut = addOneHour;
      dataArgument.remarks = visitor.value.type;

      onAddVisitorFetch(dataArgument);
    }
  }
  blockSearch.value = "";
  levelSearch.value = "";
  unitSearch.value = "";

  await setBlocks({
    site: mySite.value,
  });
}

// temporary add contractor visitor
async function submitTemporary() {
  if (!visitor.value.contractorType) {
    return setSnackbar({
      text: "Contractor Type is required",
      type: "error",
      modal: true,
    });
  }
  if (!visitor.value.plateNumber) {
    return setSnackbar({
      text: "Vehicle Number is required",
      type: "error",
      modal: true,
    });
  }

  try {
    isProgress.value = true;
    let data = visitor.value;

    const visitorId = await addVisitorTemp(data);
    if (visitorId === 900) {
      setSnackbar({
        text: "Unable to save. The visitor's plate number is on the ban list.",
        modal: true,
        type: "error",
      });
      isProgress.value = false;
      return;
    }
    if (visitorId === 901) {
      setSnackbar({
        text: "Unable to save. The visitor's plate number is on the white list.",
        modal: true,
        type: "error",
      });
      isProgress.value = false;
      return;
    }

    addVisitorSteps.value = 4;
    isTemporary.value = false;
    await updateFilter();
  } catch (err) {
    setSnackbar({ text: err as string, modal: true, type: "error" });
  }
  isProgress.value = false;
  primaryPhone.value = "";
}
// end add temporary contractor visitor

const result1 = ref<any>(null);
async function validateContractorStep() {
  page.value = 1;
  if (
    /^(contractor)$/i.test(visitor.value.type) &&
    addVisitorSteps.value == 1
  ) {
    if (
      !visitor.value.contractorType ||
      !visitor.value.companyName ||
      !visitor.value.phoneNumber ||
      !visitor.value.block ||
      !visitor.value.blockLevel ||
      !visitor.value.unit
    ) {
      contractorForm.value?.validate();

      if (!visitor.value.contractorType) {
        return setSnackbar({
          text: "Contractor Type is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.firstName && !visitor.value.lastName) {
        return setSnackbar({
          text: "Name is required",
          type: "error",
          modal: true,
        });
      } else if (!visitor.value.companyName) {
        return setSnackbar({
          text: "Company name is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.phoneNumber) {
        return setSnackbar({
          text: "Phone number is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.block) {
        return setSnackbar({
          text: "Block is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.blockLevel) {
        return setSnackbar({
          text: "Level is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.unit) {
        return setSnackbar({
          text: "Unit is required",
          modal: true,
          type: "error",
        });
      }
    } else {
      addVisitorSteps.value++;
      isPassListLoading.value = true;
      page.value = 1;
      result1.value = await getPassKeysByPageSearch({
        page: page.value,
        sites: [mySite.value],
        limit: 100,
        passTypes: [
          visitor.value.contractorType === "property-agent"
            ? "agent-pass"
            : "contractor-pass",
        ],
        statuses: ["Available"],
      });
      passList.value = result1.value?.items;
      isPassListLoading.value = false;

      // get key list
      isKeyListLoading.value = true;
      page.value = 1;
      const result2 = await getPassKeysByPageSearch({
        page: page.value,
        sites: [mySite.value],
        limit: 10,
        passTypes: ["pass-key"],
        statuses: ["Available"],
      });

      const selectedKeys = keyList.value.filter((item: any) =>
        visitor.value.passKeys.includes(item._id),
      );

      const filteredArray = result2.items.filter(
        (item: any) => !visitor.value.passKeys.includes(item._id),
      );

      keyList.value = [...selectedKeys, ...filteredArray];

      contractorMember.value = { name: null, nric: "", visitorPass: null };

      isKeyListLoading.value = false;
    }
  } else if (
    /^(contractor)$/i.test(visitor.value.type) &&
    addVisitorSteps.value == 2
  ) {
    addVisitorSteps.value++;
  } else if (
    /^(guest)$/i.test(visitor.value.type) &&
    addVisitorSteps.value == 1
  ) {
    if (
      !visitor.value.plateNumber ||
      (!visitor.value.firstName && !visitor.value.lastName) ||
      !visitor.value.block ||
      !visitor.value.blockLevel ||
      !visitor.value.phoneNumber ||
      !visitor.value.unit
    ) {
      guestForm.value?.validate();

      if (!visitor.value.phoneNumber) {
        return setSnackbar({
          text: "Phone number is required",
          type: "error",
          modal: true,
        });
      } else if (!visitor.value.plateNumber) {
        return setSnackbar({
          text: "Vehicle number is required",
          type: "error",
          modal: true,
        });
      } else if (!visitor.value.firstName && !visitor.value.lastName) {
        return setSnackbar({
          text: "First Name or Last Name is required",
          type: "error",
          modal: true,
        });
      } else if (!visitor.value.block) {
        return setSnackbar({
          text: "Block is required",
          type: "error",
          modal: true,
        });
      } else if (!visitor.value.blockLevel) {
        return setSnackbar({
          text: "Level is required",
          type: "error",
          modal: true,
        });
      } else if (!visitor.value.unit) {
        return setSnackbar({
          text: "Unit is required",
          type: "error",
          modal: true,
        });
      }
    } else {
      addVisitorSteps.value++;
      // getPassList({
      //   site: mySite.value,
      //   passType: "visitor-pass",
      // });
      isPassListLoading.value = true;
      page.value = 1;
      const result1 = await getPassKeysByPageSearch({
        page: page.value,
        sites: [mySite.value],
        limit: 100,
        passTypes: ["visitor-pass"],
        statuses: ["Available"],
      });

      passList.value = result1?.items;
      isPassListLoading.value = false;
    }
  } else if (
    /^(walk-in)$/i.test(visitor.value.type) &&
    addVisitorSteps.value == 1
  ) {
    if (
      !visitor.value.block ||
      !visitor.value.blockLevel ||
      !visitor.value.unit
    ) {
      walkinForm.value?.validate();

      if (!visitor.value.firstName && !visitor.value.lastName) {
        return setSnackbar({
          text: "Name is required",
          type: "error",
          modal: true,
        });
      } else if (!visitor.value.block) {
        return setSnackbar({
          text: "Block is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.blockLevel) {
        return setSnackbar({
          text: "Level is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.unit) {
        return setSnackbar({
          text: "Unit is required",
          modal: true,
          type: "error",
        });
      }
    } else {
      addVisitorSteps.value++;
      // getPassList({
      //   site: mySite.value,
      //   passType: "visitor-pass",
      // });
      isPassListLoading.value = true;
      page.value = 1;
      const result1 = await getPassKeysByPageSearch({
        page: page.value,
        sites: [mySite.value],
        limit: 100,
        passTypes: ["visitor-pass"],
        statuses: ["Available"],
      });

      passList.value = result1?.items;

      isPassListLoading.value = false;
    }
  }
}

// fetching for the v-autocomplete
const page = ref(1);
const isSearching = ref(false);

const endIntersect = async (isIntersecting: boolean) => {
  if (isIntersecting && !isSearching.value) {
    console.log("hasNextPage.value", hasNextPage.value);
    if (hasNextPage.value) {
      page.value += 1;
      let moreItems = await fetchPassKeysByPageSearch("pass");
      passList.value = [...passList.value, ...moreItems];
    }
  }
};

const endIntersectKeys = async (isIntersecting: boolean) => {
  if (isIntersecting && !isSearching.value) {
    console.log("hasNextPage.value", hasNextPage.value);
    if (hasNextPage.value) {
      page.value += 1;
      let moreItems = await fetchPassKeysByPageSearch("key");
      keyList.value = [...keyList.value, ...moreItems];
    }
  }
};

const fetchPassKeysByPageSearch = async (type: string) => {
  if (type == "pass") {
    isPassListLoading.value = true;
  } else {
    isKeyListLoading.value = true;
  }

  const result1: any = await getPassKeysByPageSearch({
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

const search = async (query: string) => {
  isSearching.value = true;

  page.value = 1;
  const result: any = await getPassKeysByPageSearch({
    page: page.value,
    limit: 10000,
    search: query,
    passTypes: [
      visitor.value.type == "contractor"
        ? visitor.value.contractorType === "property-agent"
          ? "agent-pass"
          : "contractor-pass"
        : "visitor-pass",
    ],
    sites: [mySite.value],
    statuses: ["Available"],
  });

  passList.value = result.items;

  isSearching.value = false;
};

const searchKey = async (query: string) => {
  isSearching.value = true;

  page.value = 1;
  const result = await getPassKeysByPageSearch({
    page: page.value,
    search: query,
    passTypes: ["pass-key"],
    sites: [mySite.value],
    statuses: ["Available"],
  });

  const selectedKeys = keyList.value.filter((item: any) =>
    visitor.value.passKeys.includes(item._id),
  );

  const filteredArray = result?.items.filter(
    (item: any) => !visitor.value.passKeys.includes(item._id),
  );
  // Include the scanned item in keys
  const scannedItem = visitor.value.passKeys.find(
    (item: any) => !keyList.value.includes(item._id),
  );
  if (scannedItem) {
    filteredArray.push(scannedItem);
  }
  keyList.value = [...selectedKeys, ...filteredArray];

  isSearching.value = false;
};

function addContractorMember(member: any) {
  visitor.value.members?.push(member);
  contractorMember.value = { name: null, nric: "", visitorPass: null };
}

const filters = ref({
  from: standardFormatDate(new Date()),
  to: standardFormatDate(new Date()),
});

async function onAddVisitorFetch(dataArgument: any | undefined = undefined) {
  try {
    isProgress.value = true;
    let data = visitor.value;
    if (dataArgument) {
      dataArgument.name = `${dataArgument.firstName || ""} ${dataArgument.lastName || ""}`;

      if (
        /^(service-provider|service-provider-member|site)$/i.test(
          currentUser.value.type,
        )
      ) {
        dataArgument.clientUserType = currentUser.value.type;

        if (
          dataArgument.type === "guest" ||
          dataArgument.type === "contractor"
        ) {
          dataArgument.checkIn = null;
          dataArgument.checkOut = null;
        }
      }

      data = dataArgument;

      data.organization = myOrg.value;
    }

    const visitorId = await updateVisitorTemp(data);
    if (visitorId === 900) {
      setSnackbar({
        text: "Unable to save. The visitor's plate number is on the ban list.",
        modal: true,
        type: "error",
      });
      isProgress.value = false;
      return;
    }
    if (visitorId === 901) {
      setSnackbar({
        text: "Unable to save. The visitor's plate number is on the white list.",
        modal: true,
        type: "error",
      });
      isProgress.value = false;
      return;
    }

    addVisitorSteps.value =
      visitor.value?.type != "contractor" &&
      visitor.value?.type != "guest" &&
      visitor.value?.type !== "walk-in"
        ? 2
        : visitor.value?.type === "contractor"
          ? 4
          : 3;
    tab.value = "visitor";
    await updateFilter();
  } catch (err) {
    setSnackbar({ text: err as string, modal: true, type: "error" });
  }
  isProgress.value = false;
  primaryPhone.value = "";
}

async function updateFilter() {
  filters.value.from = standardFormatDate(getPast30DaysDate());
  pageVisitor.value = 1;
  setVisitors({
    sites: [mySite.value],
    types: filterVisitor.value.length ? filterVisitor.value : null,
    date: {
      from: moment.tz(
        moment(filters.value.from, "DD/MM/YYYY"),
        "Asia/Singapore",
      ),
      to: moment.tz(
        moment(filters.value.to, "DD/MM/YYYY").endOf("day"),
        "Asia/Singapore",
      ),
    },
    tab: tab.value,
  });
}

async function onCloseDialog() {
  setVisitor();

  addVisitorRealtime.value = false;
  editVisitorDialog.value = false;
  primaryPhone.value = "";
  addVisitorSteps.value = 1;
  uploadUsingCsv.value = false;

  enabledCam.value = false;
  takePicture.value = false;
  takePictureViaMobile.value = false;
  displayInput.value = false;

  primaryPhone.value = "";
  blockSearch.value = "";
  levelSearch.value = "";
  unitSearch.value = "";
  visitor.value.block = "";
  visitor.value.blockLevel = "";
  visitor.value.unit = "";
}

async function goBack() {
  setVisitor();
  addVisitorSteps.value = 1;
  uploadUsingCsv.value = false;

  enabledCam.value = false;
  takePicture.value = false;
  takePictureViaMobile.value = false;

  addVisitorRealtime.value = false;
  displayInput.value = false;

  primaryPhone.value = "";
  blockSearch.value = "";
  levelSearch.value = "";
  unitSearch.value = "";
  visitor.value.block = "";
  visitor.value.blockLevel = "";
  visitor.value.unit = "";
  contractorMember.value = { name: null, nric: "", visitorPass: null };
}

async function onSelectVisitorType(data: any) {
  visitor.value.type = data.value;
  visitor.value.site = mySite.value;
  visitor.value.organization = currentUser.value?.organization;
}

const onSearchBlock = async (_search: string) => {
  debouncedSearchBlock(_search);
};

const onSearchBlockLevel = async (_search: string) => {
  debouncedSearchBlockLevel(_search);
};

const onSearchBlockLevelUnit = async (_search: string) => {
  debouncedSearchBlockLevelUnit(_search);
};

const debouncedSearchBlock = debounce(async (value: string) => {
  blockSearch.value = value;
  blockPage.value = 1;
  await setBlocks({
    site: mySite.value,
  });
}, 500);

const debouncedSearchBlockLevel = debounce(async (value: string) => {
  levelSearch.value = value;
  levelPage.value = 1;
  await setBlockLevels({
    block: visitor.value.block,
  });
}, 500);

const debouncedSearchBlockLevelUnit = debounce(async (value: string) => {
  unitSearch.value = value;
  unitPage.value = 1;
  await setUnits({
    block: visitor.value.block,
    level: visitor.value.blockLevel,
  });
}, 500);

async function onSelectBlock(block: string) {
  levelSearch.value = "";
  await setBlockLevels({ block });
  visitor.value.blockLevel = "";
  visitor.value.unit = "";
}

async function onSelectPickUpDropoffType(type: string) {
  console.log(type, siteSetting.value);
  if (type == "Taxi") {
    companies.value = siteSetting.value.taxiHireCompanies;
  } else {
    companies.value = siteSetting.value.privateHireCompanies;
  }
}

async function onSelectBlockLevel(block: string, blockLevel: string) {
  unitSearch.value = "";
  await setUnits({
    block: block,
    level: blockLevel,
  });
  visitor.value.unit = "";
}

async function onAddMultipleContractor() {
  try {
    isProgress.value = true;
    await addMultipleContractor(payloadForm.value);

    setVisitors({
      site: mySite.value,
      type: filterVisitor.value.toLowerCase(),
      startDate: new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
      endDate: new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
    });

    addVisitorSteps.value++;

    setSnackbar({
      text: "Successful created visitor information",
      modal: true,
      type: "success",
    });

    isProgress.value = false;
  } catch (err) {
    setSnackbar({ text: err, modal: true, type: "error" });
    isProgress.value = false;
  }
}

async function onDownloadCSV() {
  isProgress.value = true;
  const headers = [
    [
      "name",
      "nric",
      "companyName",
      "plateNumber",
      "phoneNumber",
      "email",
      "checkIn",
      "checkOut",
      "remarks",
    ],
    [
      "{ insert name }",
      "{ insert nric}",
      "{ insert company name }",
      "{ insert Vehicle Number }",
      "{ insert phone number }",
      "{ insert email}",
      "mm/dd/yyyy hh:mm",
      "mm/dd/yyyy hh:mm",
      "{ you can start filling up 2nd or 3rd row }",
    ],
  ];
  let csvContent =
    "data:text/csv;charset=utf-8," + headers.map((e) => e.join(",")).join("\n");

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  await link.setAttribute("href", encodedUri);
  await link.setAttribute("download", "add-contrators-template.csv");
  await document.body.appendChild(link);
  await link.click();

  isProgress.value = false;
}

async function onSelectCSV(event: any) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.readAsText(file);
  reader.onload = function (e: any) {
    $papa.parse(e.target.result, {
      headers: true,
      complete: (result: any) => {
        constructDataFormat(result.data.filter((find: any) => find.length > 1)); // data is parsed & remove empty row
      },
    });
  };
}

async function constructDataFormat(csvRows: any) {
  const formattedData: any = {
    organization: currentUser.value?.organization,
    site: mySite.value,
    data: [],
  };

  await csvRows.map((rows: any, key: number) => {
    if (key) {
      const objectKeys = csvRows[0].reduce(
        (acc: any, key: number) => ((acc[key] = ""), acc),
        {},
      );

      Object.keys(objectKeys).map((data: string, index: number) => {
        if (rows[index].split("")[0] != "{") {
          objectKeys[data] = rows[index];
        }
      });

      const regex = /^[a-zA-Z ]+$/;
      const validateStringName = regex.test(rows[0]); // to check if name contain alphabet only
      if (validateStringName) formattedData.data.push(objectKeys);
    }
  });

  payloadForm.value = formattedData;
}

async function onUpdateDate(elementId: string) {
  const getDate = new Date(document.getElementById(elementId).value);
  visitor.value[elementId] = standardFormatDateTime(getDate);

  if (elementId === "checkIn") {
    dateTomorrow.value = parseCustomDateStringToISO(
      visitor.value.checkIn,
    ).slice(0, 16);
  }
}

function parseCustomDateStringToISO(dateString: string): string {
  const [datePart, timePart] = dateString.split(" ");

  const [day, month, year] = datePart.split("/").map(Number);

  const [hours, minutes] = timePart.split(":").map(Number);

  const date = new Date(year, month - 1, day, hours, minutes);

  return date.toISOString();
}

async function onCaptureDeliveryItem(event: any) {
  if (event.target.files[0] != null) {
    const base_image = new Image();
    const image = event.target.files[0];

    base_image.src = URL.createObjectURL(image);
    base_image.onload = function () {
      canvas.value.getContext("2d").drawImage(base_image, 0, 0, 640, 480);
      canvas.value.style.display = "";
      canvas.value.style.marginBottom = "140px";
    };
  }
}

function nricChecker(data: string) {
  const length = data.length;
  if (length <= 4) {
    return data;
  } else {
    return "*".repeat(length - 4) + data.slice(-4);
  }
}
</script>

<style scoped>
.dialog_desktop {
  margin: 0 0 0 auto;
  max-width: 28rem;
  border-radius: 25px 0 0 25px;

  box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
}

:deep() .v-field__outline {
  --v-field-border-opacity: 0.1;
}

:deep() .v-overlay__scrim {
  opacity: var(--v-overlay-opacity, 0);
}

:deep() .v-switch .v-label {
  padding-right: 10px;
  font-size: 13px;
}

:deep() .v-switch .v-selection-control {
  display: flex;
  flex-direction: row-reverse;
}

.overridePicker {
  width: 18px;
}

@media (max-width: 768px) {
  :deep(.v-autocomplete input) {
    font-size: 16px !important;
  }
  :deep() .v-text-field input {
    font-size: 16px !important;
  }
  :deep() .v-textarea .v-field__input {
    font-size: 16px !important;
  }
}

@media (min-width: 769px) {
  :deep(.v-autocomplete input) {
    font-size: 13px !important;
  }
  :deep() .v-text-field input {
    font-size: 13px !important;
  }
  :deep() .v-textarea .v-field__input {
    font-size: 13px !important;
  }

  .flash-effect {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    opacity: 0;
    transition: opacity 0.1s ease-out;
    pointer-events: none;
    border: "1px solid red";
  }

  .flash-effect.active {
    opacity: 1;
  }
}
</style>
