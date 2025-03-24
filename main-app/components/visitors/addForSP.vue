<template>
  <v-dialog
    v-model="addVisitorDialog"
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
        <v-btn
          color="grey-darken-1"
          icon="mdi-arrow-left"
          @click="goBack()"
          v-if="visitor.type"
        ></v-btn>
        <span class="font-weight-bold pl-4 pt-1 text-capitalize">{{
          visitor.type ? `Add ${visitor.type}` : "Visitor"
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
              v-for="(item, key) in visitorTypes.filter((find, key) => {
                return addVisitorRealtime ? key >= 2 : find;
              })"
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
              <v-row v-if="addVisitorSteps == 1">
                <v-col cols="12" class="mb-5">
                  <v-img :src="`/images/visitor-guest.svg`" height="125" />
                </v-col>

                <v-col cols="12" class="font-weight-bold pb-4">
                  General information
                </v-col>

                <v-col class="d-flex ga-3" cols="12">
                  <v-text-field
                    v-model="visitor.firstName"
                    label="First Name"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                  ></v-text-field>
                  <v-text-field
                    v-model="visitor.lastName"
                    label="Last Name"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" v-if="!enabledCam">
                  <v-text-field
                    v-if="!displayInput"
                    v-model="visitor.nric"
                    label="NRIC/Passport/ID No. (optional)"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    @input="handleInputNric"
                  ></v-text-field>
                  <!-- append-inner-icon="mdi-camera-outline"
                      @click:append-inner="
                        $vuetify.display.mdAndUp
                          ? onOpenCamera()
                          : (displayInput = !displayInput)
                      " -->

                  <input
                    v-if="displayInput"
                    type="file"
                    accept="image/*"
                    capture="user"
                    :class="`${!displayInput && 'mt-4'}`"
                    @change="onSelectImage"
                    :disabled="isProgress"
                  />
                </v-col>

                <v-col
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
                  <v-text-field
                    v-model="visitor.plateNumber"
                    label="Vehicle Number"
                    density="comfortable"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    clearable
                    @update:modelValue="onSearchVehicleNumber"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="visitor.email"
                    label="Email"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput, validEmail]"
                  ></v-text-field>
                </v-col>

                <v-col cols="4">
                  <v-autocomplete
                    v-model="visitor.block"
                    :items="blocks"
                    item-title="name"
                    item-value="_id"
                    label="Block"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @update:modelValue="onSelectBlock(visitor.block)"
                    @update:search="onSearchBlock"
                    clearable
                    no-filter
                  ></v-autocomplete>
                </v-col>

                <v-col cols="4">
                  <v-autocomplete
                    v-model="visitor.blockLevel"
                    :items="blockLevels"
                    item-title="level"
                    item-value="_id"
                    label="Level"
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
                  ></v-autocomplete>
                </v-col>

                <v-col cols="4">
                  <v-autocomplete
                    v-model="visitor.unit"
                    :items="units"
                    item-title="name"
                    item-value="_id"
                    label="Unit"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @update:search="onSearchBlockLevelUnit"
                    clearable
                    no-filter
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="visitor.checkIn"
                    label="Check In"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    readonly
                  >
                    <template v-slot:append-inner>
                      <v-menu>
                        <template v-slot:activator="{ props }">
                          <input
                            v-bind="props"
                            type="datetime-local"
                            :min="minimumDate"
                            class="overridePicker"
                            id="checkIn"
                            @input="onUpdateDate('checkIn')"
                          />
                        </template>
                      </v-menu>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="visitor.checkOut"
                    label="Check Out"
                    density="compact"
                    hide-details
                    :disabled="isProgress || !visitor.checkIn"
                    :rules="[requiredInput]"
                    readonly
                  >
                    <template v-slot:append-inner>
                      <v-menu>
                        <template v-slot:activator="{ props }">
                          <input
                            v-bind="props"
                            type="datetime-local"
                            :min="dateTomorrow"
                            class="overridePicker"
                            id="checkOut"
                            @input="onUpdateDate('checkOut')"
                          />
                        </template>
                      </v-menu>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="visitor.remarks"
                    label="Remarks"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
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
                  >
                    Add Drive In
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

          <v-col cols="12" class="mb-4" v-if="visitor.type === 'contractor'">
            <v-form ref="contractorForm">
              <v-row>
                <v-col cols="12" class="mb-5">
                  <v-img
                    :src="`/images/${addVisitorSteps <= 2 ? 'visitor-contractor.svg' : 'confirmation.svg'}`"
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
                        Add Contractor
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
                      v-if="addVisitorSteps && addVisitorSteps <= 2"
                    >
                      <v-row class="px-3 pb-4" justify="space-between">
                        <span class="font-weight-bold">
                          <v-btn
                            v-if="addVisitorSteps === 2"
                            size="x-small"
                            variant="flat"
                            class="grey-darken-1"
                            icon="mdi-chevron-left"
                            @click="addVisitorSteps--"
                          />

                          {{ addVisitorSteps === 1 ? "General" : "Pass" }}
                          Information
                        </span>
                        <v-chip size="small" color="grey-lighten-1">
                          <span :class="`${theme === 'light' && 'text-black'}`">
                            Step
                            <span class="text-blue">{{ addVisitorSteps }}</span
                            >/2
                          </span>
                        </v-chip>
                      </v-row>
                    </v-col>

                    <v-col cols="12" class="mb-6" v-if="addVisitorSteps <= 2">
                      <v-row v-if="addVisitorSteps === 1">
                        <v-col cols="12" class="mt-5">
                          <v-select
                            v-model="visitor.contractorType"
                            label="Contractor Type"
                            density="compact"
                            :items="contractorTypes"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                          ></v-select>
                        </v-col>
                        <v-col class="d-flex ga-3" cols="12">
                          <v-text-field
                            v-model="visitor.firstName"
                            label="First Name"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                          ></v-text-field>
                          <v-text-field
                            v-model="visitor.lastName"
                            label="Last Name"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="visitor.nric"
                            label="NRIC/Passport/ID No. (optional)"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            @input="handleInputNric"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="visitor.companyName"
                            label="Company Name"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="visitor.phoneNumber"
                            label="Phone Number"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="visitor.plateNumber"
                            label="Vehicle Number"
                            density="comfortable"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                            clearable
                            @update:modelValue="onSearchVehicleNumber"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="visitor.email"
                            label="Email"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput, validEmail]"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="visitor.checkIn"
                            label="Check In"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                            readonly
                          >
                            <template v-slot:append-inner>
                              <v-menu>
                                <template v-slot:activator="{ props }">
                                  <input
                                    v-bind="props"
                                    type="datetime-local"
                                    :min="minimumDate"
                                    class="overridePicker"
                                    id="checkIn"
                                    @input="onUpdateDate('checkIn')"
                                  />
                                </template>
                              </v-menu>
                            </template>
                          </v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="visitor.checkOut"
                            label="Check Out"
                            density="compact"
                            hide-details
                            :disabled="isProgress || !visitor.checkIn"
                            :rules="[requiredInput]"
                            readonly
                          >
                            <template v-slot:append-inner>
                              <v-menu>
                                <template v-slot:activator="{ props }">
                                  <input
                                    v-bind="props"
                                    type="datetime-local"
                                    :min="dateTomorrow"
                                    class="overridePicker"
                                    id="checkOut"
                                    @input="onUpdateDate('checkOut')"
                                  />
                                </template>
                              </v-menu>
                            </template>
                          </v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-textarea
                            v-model="visitor.remarks"
                            label="Remarks"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                            rows="3"
                            no-resize
                          ></v-textarea>
                        </v-col>
                      </v-row>

                      <v-row v-if="addVisitorSteps === 2">
                        <v-col cols="6">
                          <v-select
                            v-model="visitor.visitorPass"
                            label="Pass Type"
                            :items="passList"
                            item-title="name"
                            item-value="_id"
                            density="comfortable"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                          ></v-select>
                        </v-col>

                        <v-col cols="6">
                          <v-select
                            v-model="visitor.passKeyNumber"
                            :items="
                              passList.find(
                                (find) => find._id == visitor.visitorPass,
                              )?.codes
                            "
                            label="Pass Code"
                            density="comfortable"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                          ></v-select>
                        </v-col>

                        <v-col cols="12">
                          <span class="font-weight-bold"> Pass Keys </span>
                        </v-col>

                        <v-col cols="12">
                          <v-select
                            v-model="visitor.passKeys"
                            :items="keys"
                            item-title="name"
                            item-value="_id"
                            label="Pass Keys"
                            density="comfortable"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredArrayInput]"
                            clearable
                            multiple
                          >
                            <template v-slot:selection="{ item, index }">
                              <v-chip v-if="index < 2" size="x-small">
                                <span>{{ item.title }}</span>
                              </v-chip>
                              <span
                                v-if="index === 2"
                                class="text-grey text-caption align-self-center"
                              >
                                (+{{ (visitor.passKeys || []).length - 2 }}
                                others)
                              </span>
                            </template>
                          </v-select>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12" v-if="addVisitorSteps === 3">
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
                        v-if="addVisitorSteps === 1"
                        block
                        color="blue-darken-3"
                        size="small"
                        variant="flat"
                        style="height: 40px"
                        @click="validateContractorStepOne"
                      >
                        Next
                      </v-btn>

                      <v-btn
                        v-if="addVisitorSteps === 2"
                        block
                        color="blue-darken-3"
                        size="small"
                        variant="flat"
                        style="height: 40px"
                        @click="submit()"
                        :disabled="isProgress"
                      >
                        Add Contractor
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

                <v-col cols="12" class="font-weight-bold pb-4">
                  General Information
                </v-col>

                <v-col class="d-flex ga-3" cols="12">
                  <v-text-field
                    v-model="visitor.firstName"
                    label="First Name"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                  ></v-text-field>
                  <v-text-field
                    v-model="visitor.lastName"
                    label="Last Name"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="visitor.companyName"
                    label="Company Name"
                    :items="siteSetting.deliveryCompanyList"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    clearable
                    no-filter
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" v-if="!enabledCam">
                  <v-text-field
                    v-if="!displayInput"
                    v-model="visitor.nric"
                    label="NRIC/Passport/ID No. (optional)"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                  ></v-text-field>

                  <!-- append-inner-icon="mdi-camera-outline"
                      @click:append-inner="
                        $vuetify.display.mdAndUp
                          ? onOpenCamera()
                          : (displayInput = !displayInput)
                      " -->

                  <input
                    v-if="displayInput"
                    type="file"
                    accept="image/*"
                    capture="user"
                    :class="`${!displayInput && 'mt-4'}`"
                    @change="onSelectImage"
                    :disabled="isProgress"
                  />
                </v-col>

                <v-col
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
                    label="Phone Number"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="visitor.plateNumber"
                    label="Vehicle Number"
                    density="comfortable"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    clearable
                    @update:modelValue="onSearchVehicleNumber"
                  ></v-text-field>
                </v-col>

                <v-col cols="4">
                  <v-autocomplete
                    v-model="visitor.block"
                    :items="blocks"
                    item-title="name"
                    item-value="_id"
                    label="Block"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @update:modelValue="onSelectBlock(visitor.block)"
                    @update:search="onSearchBlock"
                    clearable
                    no-filter
                  ></v-autocomplete>
                </v-col>

                <v-col cols="4">
                  <v-autocomplete
                    v-model="visitor.blockLevel"
                    :items="blockLevels"
                    item-title="level"
                    item-value="_id"
                    label="Level"
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
                  ></v-autocomplete>
                </v-col>

                <v-col cols="4">
                  <v-autocomplete
                    v-model="visitor.unit"
                    :items="units"
                    item-title="name"
                    item-value="_id"
                    label="Unit"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @update:search="onSearchBlockLevelUnit"
                    clearable
                    no-filter
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="visitor.checkIn"
                    label="Check In"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    readonly
                  >
                    <template v-slot:append-inner>
                      <v-menu>
                        <template v-slot:activator="{ props }">
                          <input
                            v-bind="props"
                            type="datetime-local"
                            :min="minimumDate"
                            class="overridePicker"
                            id="checkIn"
                            @input="onUpdateDate('checkIn')"
                          />
                        </template>
                      </v-menu>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="visitor.checkOut"
                    label="Check Out"
                    density="compact"
                    hide-details
                    :disabled="isProgress || !visitor.checkIn"
                    :rules="[requiredInput]"
                    readonly
                  >
                    <template v-slot:append-inner>
                      <v-menu>
                        <template v-slot:activator="{ props }">
                          <input
                            v-bind="props"
                            type="datetime-local"
                            :min="dateTomorrow"
                            class="overridePicker"
                            id="checkOut"
                            @input="onUpdateDate('checkOut')"
                          />
                        </template>
                      </v-menu>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="visitor.remarks"
                    label="Remarks"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
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
              <v-row v-if="addVisitorSteps == 1">
                <v-col cols="12" class="mb-5">
                  <v-img :src="`/images/visitor-walkin.svg`" height="125" />
                </v-col>

                <v-col cols="12" class="font-weight-bold pb-4">
                  General Information
                </v-col>

                <v-col class="d-flex ga-3" cols="12">
                  <v-text-field
                    v-model="visitor.firstName"
                    label="First Name"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                  ></v-text-field>
                  <v-text-field
                    v-model="visitor.lastName"
                    label="Last Name"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" v-if="!enabledCam">
                  <v-text-field
                    v-if="!displayInput"
                    v-model="visitor.nric"
                    label="NRIC/Passport/ID No. (optional)"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                  ></v-text-field>
                  <!-- append-inner-icon="mdi-camera-outline"
                      @click:append-inner="
                        $vuetify.display.mdAndUp
                          ? onOpenCamera()
                          : (displayInput = !displayInput)
                      " -->

                  <input
                    v-if="displayInput"
                    type="file"
                    accept="image/*"
                    capture="user"
                    :class="`${!displayInput && 'mt-4'}`"
                    @change="onSelectImage"
                    :disabled="isProgress"
                  />
                </v-col>

                <v-col
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
                    label="Phone Number"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="visitor.plateNumber"
                    label="Vehicle Number (Optional)"
                    density="comfortable"
                    hide-details
                    :disabled="isProgress"
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="visitor.email"
                    label="Email"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput, validEmail]"
                  ></v-text-field>
                </v-col>

                <v-col cols="4">
                  <v-autocomplete
                    v-model="visitor.block"
                    :items="blocks"
                    item-title="name"
                    item-value="_id"
                    label="Block"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @update:modelValue="onSelectBlock(visitor.block)"
                    @update:search="onSearchBlock"
                    clearable
                    no-filter
                  ></v-autocomplete>
                </v-col>

                <v-col cols="4">
                  <v-autocomplete
                    v-model="visitor.blockLevel"
                    :items="blockLevels"
                    item-title="level"
                    item-value="_id"
                    label="Level"
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
                  ></v-autocomplete>
                </v-col>

                <v-col cols="4">
                  <v-autocomplete
                    v-model="visitor.unit"
                    :items="units"
                    item-title="name"
                    item-value="_id"
                    label="Unit"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @update:search="onSearchBlockLevelUnit"
                    clearable
                    no-filter
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="visitor.checkIn"
                    label="Check In"
                    density="compact"
                    hide-details
                    readonly
                  >
                    <template v-slot:append-inner>
                      <v-menu>
                        <template v-slot:activator="{ props }">
                          <input
                            v-bind="props"
                            type="datetime-local"
                            :min="minimumDate"
                            class="overridePicker"
                            id="checkIn"
                            @input="onUpdateDate('checkIn')"
                            disabled
                          />
                        </template>
                      </v-menu>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="visitor.checkOut"
                    label="Check Out"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    readonly
                  >
                    <template v-slot:append-inner>
                      <v-menu>
                        <template v-slot:activator="{ props }">
                          <input
                            v-bind="props"
                            type="datetime-local"
                            :min="!willOvernight ? minimumDate : dateTomorrow"
                            class="overridePicker"
                            id="checkOut"
                            @input="onUpdateDate('checkOut')"
                          />
                        </template>
                      </v-menu>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="visitor.remarks"
                    label="Remarks"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
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
                  >
                    Add Walk In
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

                <v-col cols="12" class="font-weight-bold pb-4">
                  General Information
                </v-col>

                <v-col class="d-flex ga-3" cols="12">
                  <v-text-field
                    v-model="visitor.firstName"
                    label="First Name"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                  ></v-text-field>
                  <v-text-field
                    v-model="visitor.lastName"
                    label="Last Name"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="visitor.plateNumber"
                    label="Vehicle Number"
                    density="comfortable"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    clearable
                    @update:modelValue="onSearchVehicleNumber"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="visitor.phoneNumber"
                    label="Phone Number (Optional)"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="visitor.pickupDropoffType"
                    label="Type"
                    :items="siteSetting.deliveryCompanyList"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    clearable
                    no-filter
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="visitor.block"
                    :items="blocks"
                    item-title="name"
                    item-value="_id"
                    label="Block"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                    @update:search="onSearchBlock"
                    clearable
                    no-filter
                  ></v-autocomplete>
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
</template>

<script setup lang="ts">
import moment from "moment-timezone";
import phoneCode from "@/components/old-phone-code.json";
import debounce from "lodash/debounce";

const prefixes = phoneCode;

const {
  requiredInput,
  requiredArrayInput,
  validEmail,
  standardFormatDate,
  standardFormatDateTime,
} = useUtils();
const {
  visitor,
  visitors,
  contractorTypes,
  addVisitor,
  setVisitor,
  setVisitors,
  visitorTypes,
  addVisitorDialog,
  addVisitorSteps,
  getVisitorById,
  addMultipleContractor,
  filterVisitor,
  addVisitorRealtime,
  getScannedNricInfo,
  pickupDropoffTypes,
  searchVehicleNumber,
} = useVisitor();
const {
  allBlocks,
  getAllBlocks,
  search: blockSearch,
  setBlocks,
  blocks,
} = useBlock();
const {
  blockLevels,
  setBlockLevels,
  allBlockLevels,
  getAllLevelsUsingBlock,
  search: levelSearch,
} = useBlockLevel();
const {
  getAllUnitsUsingLevel,
  allUnits,
  search: unitSearch,
  units,
  setUnits,
} = useBlockLevelUnit();
const { passList, keyList } = useKey();
const { theme, setSnackbar } = useLocal();
const { currentUser } = useLocalAuth();
const { getSitesOptionsForFiltering, mySite, myOrg } = useFilter();
const { siteSetting } = useSiteSettings();

const isProgress = ref(false);
const uploadUsingCsv = ref(false);
const payloadForm = ref({});
const willOvernight = ref(false);

const displayInput = ref(false);
const enabledCam = ref(false);
const takePicture = ref(false);
const takePictureViaMobile = ref(false);
const video = ref({});
const canvas = ref({});

let timerId: NodeJS.Timeout | null = null;

const minimumDate = ref(new Date().toISOString().slice(0, 16));
const dateTomorrow = ref(new Date().toISOString().slice(0, 16));

function onSearchVehicleNumber(val: string) {
  debouncedSearch(val);
}

const debouncedSearch = debounce(async (value: string) => {
  const result = await searchVehicleNumber({
    site: mySite.value,
    plateNumber: value,
  });

  if (result.message == "Result found" || result.message == "No data found!") {
    result?.data?.companyName
      ? (visitor.value.companyName = result?.data?.companyName)
      : null;
    result?.data?.email ? (visitor.value.email = result?.data?.email) : null;
    result?.data?.firstName
      ? (visitor.value.firstName = result?.data?.firstName)
      : null;
    result?.data?.lastName
      ? (visitor.value.lastName = result?.data?.lastName)
      : null;
    result?.data?.nric ? (visitor.value.nric = result?.data?.nric) : null;

    result?.data?.phoneNumber
      ? (primaryPhone.value = result?.data?.phoneNumber)
      : null;

    setSnackbar({
      text: result?.message,
      type: "primary",
      modal: true,
    });
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

const handleInputPlateNumber = (event: Event) => {
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
    setVisitor();
    setInitialCheckIn();
    const blockResults = await getAllBlocks(mySite.value);

    allBlocks.value = blockResults;

    await getSitesOptionsForFiltering();
  } catch (err) {
    console.log("ERR: ", err);
  }
});

onBeforeUnmount(() => {
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
  // const timezoneOffset = now.getTimezoneOffset()
  // const localNow = new Date(now.getTime() - timezoneOffset * 60000)

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

async function submit() {
  if (visitor.value.type === "guest") {
    if (
      !visitor.value.firstName ||
      !visitor.value.lastName ||
      !visitor.value.plateNumber ||
      !visitor.value.phoneNumber ||
      !visitor.value.email ||
      !visitor.value.block ||
      !visitor.value.blockLevel ||
      !visitor.value.unit ||
      !visitor.value.checkIn ||
      !visitor.value.checkOut ||
      (visitor.value.checkIn &&
        visitor.value.checkOut &&
        new Date(parseCustomDateStringToISO(visitor.value.checkIn)).getTime() >
          new Date(
            parseCustomDateStringToISO(visitor.value.checkOut),
          ).getTime()) ||
      !visitor.value.remarks
    ) {
      guestForm.value?.validate();

      if (!visitor.value.firstName) {
        return setSnackbar({
          text: "First name is required",
          type: "error",
          modal: true,
        });
      } else if (!visitor.value.lastName) {
        return setSnackbar({
          text: "Last name is required",
          type: "error",
          modal: true,
        });
      } else if (!visitor.value.plateNumber) {
        return setSnackbar({
          text: "Vehicle number is required",
          type: "error",
          modal: true,
        });
      } else if (!visitor.value.phoneNumber) {
        return setSnackbar({
          text: "Phone number is required",
          type: "error",
          modal: true,
        });
      } else if (!visitor.value.email) {
        return setSnackbar({
          text: "Email is required",
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
      } else if (!visitor.value.checkIn) {
        return setSnackbar({
          text: "Check In is required",
          type: "error",
          modal: true,
        });
      } else if (!visitor.value.checkOut) {
        return setSnackbar({
          text: "Check Out is required",
          type: "error",
          modal: true,
        });
      } else if (
        visitor.value.checkIn &&
        visitor.value.checkOut &&
        new Date(parseCustomDateStringToISO(visitor.value.checkIn)).getTime() >=
          new Date(parseCustomDateStringToISO(visitor.value.checkOut)).getTime()
      ) {
        return setSnackbar({
          text: "Check Out cannot be equal or ahead than Check In",
          type: "error",
          modal: true,
        });
      } else if (!visitor.value.remarks) {
        return setSnackbar({
          text: "Remarks is required",
          type: "error",
          modal: true,
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
  } else if (visitor.value.type === "contractor") {
    if (
      !visitor.value.visitorPass ||
      !visitor.value.passKeyNumber ||
      visitor.value.passKeys?.length === 0
    ) {
      contractorForm.value?.validate();

      if (!visitor.value.visitorPass) {
        return setSnackbar({
          text: "Pass Type is required",
          type: "error",
          modal: true,
        });
      } else if (!visitor.value.passKeyNumber) {
        return setSnackbar({
          text: "Pass Code is required",
          type: "error",
          modal: true,
        });
      } else if (visitor.value.passKeys?.length === 0) {
        return setSnackbar({
          text: "Pass Key is required",
          type: "error",
          modal: true,
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
  } else if (visitor.value.type === "delivery") {
    if (
      !visitor.value.firstName ||
      !visitor.value.lastName ||
      !visitor.value.companyName ||
      !visitor.value.plateNumber ||
      !visitor.value.phoneNumber ||
      !visitor.value.block ||
      !visitor.value.blockLevel ||
      !visitor.value.unit ||
      !visitor.value.checkIn ||
      !visitor.value.checkOut ||
      (visitor.value.checkIn &&
        visitor.value.checkOut &&
        new Date(parseCustomDateStringToISO(visitor.value.checkIn)).getTime() >=
          new Date(
            parseCustomDateStringToISO(visitor.value.checkOut),
          ).getTime()) ||
      !visitor.value.remarks
    ) {
      deliveryForm.value?.validate();

      if (!visitor.value.firstName) {
        return setSnackbar({
          text: "First name is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.lastName) {
        return setSnackbar({
          text: "Last name is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.companyName) {
        return setSnackbar({
          text: "Company name is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.plateNumber) {
        return setSnackbar({
          text: "Vehicle number is required",
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
      } else if (!visitor.value.checkIn) {
        return setSnackbar({
          text: "Check In is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.checkOut) {
        return setSnackbar({
          text: "Check Out is required",
          modal: true,
          type: "error",
        });
      } else if (
        visitor.value.checkIn &&
        visitor.value.checkOut &&
        new Date(parseCustomDateStringToISO(visitor.value.checkIn)).getTime() >=
          new Date(parseCustomDateStringToISO(visitor.value.checkOut)).getTime()
      ) {
        return setSnackbar({
          text: "Check Out cannot be equal or ahead than Check In",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.remarks) {
        return setSnackbar({
          text: "Remarks is required",
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
    if (
      !visitor.value.firstName ||
      !visitor.value.lastName ||
      !visitor.value.phoneNumber ||
      !visitor.value.email ||
      !visitor.value.block ||
      !visitor.value.blockLevel ||
      !visitor.value.unit ||
      !visitor.value.checkIn ||
      !visitor.value.checkOut ||
      (visitor.value.checkIn &&
        visitor.value.checkOut &&
        new Date(parseCustomDateStringToISO(visitor.value.checkIn)).getTime() >=
          new Date(
            parseCustomDateStringToISO(visitor.value.checkOut),
          ).getTime()) ||
      !visitor.value.remarks
    ) {
      walkinForm.value?.validate();

      if (!visitor.value.firstName) {
        return setSnackbar({
          text: "First name is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.lastName) {
        return setSnackbar({
          text: "Last name is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.phoneNumber) {
        return setSnackbar({
          text: "Phone number is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.email) {
        return setSnackbar({
          text: "Email is required",
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
      } else if (!visitor.value.checkIn) {
        return setSnackbar({
          text: "Check In is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.checkOut) {
        return setSnackbar({
          text: "Check Out is required",
          modal: true,
          type: "error",
        });
      } else if (
        visitor.value.checkIn &&
        visitor.value.checkOut &&
        new Date(parseCustomDateStringToISO(visitor.value.checkIn)).getTime() >=
          new Date(parseCustomDateStringToISO(visitor.value.checkOut)).getTime()
      ) {
        return setSnackbar({
          text: "Check Out cannot be equal or ahead than Check In",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.remarks) {
        return setSnackbar({
          text: "Remarks is required",
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
  } else if (
    visitor.value.type === "pick-up" ||
    visitor.value.type === "drop-off"
  ) {
    if (
      !visitor.value.firstName ||
      !visitor.value.lastName ||
      !visitor.value.plateNumber ||
      !visitor.value.pickupDropoffType ||
      !visitor.value.block
    ) {
      pickupForm.value?.validate();

      if (!visitor.value.firstName) {
        return setSnackbar({
          text: "First name is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.lastName) {
        return setSnackbar({
          text: "Last name is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.plateNumber) {
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
}

function validateContractorStepOne() {
  if (visitor.value.type === "contractor" && addVisitorSteps.value === 1) {
    if (
      !visitor.value.contractorType ||
      !visitor.value.firstName ||
      !visitor.value.lastName ||
      !visitor.value.companyName ||
      !visitor.value.plateNumber ||
      !visitor.value.phoneNumber ||
      !visitor.value.email ||
      !visitor.value.checkIn ||
      !visitor.value.checkOut ||
      (visitor.value.checkIn &&
        visitor.value.checkOut &&
        new Date(parseCustomDateStringToISO(visitor.value.checkIn)).getTime() >=
          new Date(
            parseCustomDateStringToISO(visitor.value.checkOut),
          ).getTime()) ||
      !visitor.value.remarks
    ) {
      contractorForm.value?.validate();

      if (!visitor.value.contractorType) {
        return setSnackbar({
          text: "Contractor Type is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.firstName) {
        return setSnackbar({
          text: "First name is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.lastName) {
        return setSnackbar({
          text: "Last name is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.companyName) {
        return setSnackbar({
          text: "Company name is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.plateNumber) {
        return setSnackbar({
          text: "Vehicle number is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.phoneNumber) {
        return setSnackbar({
          text: "Phone number is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.email) {
        return setSnackbar({
          text: "Email is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.checkIn) {
        return setSnackbar({
          text: "Check In is required",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.checkOut) {
        return setSnackbar({
          text: "Check Out is required",
          modal: true,
          type: "error",
        });
      } else if (
        visitor.value.checkIn &&
        visitor.value.checkOut &&
        new Date(parseCustomDateStringToISO(visitor.value.checkIn)).getTime() >=
          new Date(parseCustomDateStringToISO(visitor.value.checkOut)).getTime()
      ) {
        return setSnackbar({
          text: "Check Out cannot be equal or ahead than Check In",
          modal: true,
          type: "error",
        });
      } else if (!visitor.value.remarks) {
        return setSnackbar({
          text: "Remarks is required",
          modal: true,
          type: "error",
        });
      }
    } else {
      addVisitorSteps.value++;
    }
  }
}

async function onAddVisitorFetch(dataArgument: any | undefined = undefined) {
  try {
    visitor.value.name =
      visitor.value?.firstName + " " + visitor.value?.lastName;
    isProgress.value = true;
    let data = visitor.value;
    if (dataArgument) {
      dataArgument.name = `${dataArgument.firstName} ${dataArgument.lastName}`;
      delete dataArgument.members;

      data = dataArgument;
      data.organization = myOrg.value;
    }

    const visitorId = await addVisitor(data);
    if (visitorId === 900) {
      setSnackbar({
        text: "Cannot Save. Visitor Platenumber is in Banlist!!",
        modal: true,
        type: "error",
      });
      isProgress.value = false;
      return;
    }
    if (visitorId === 901) {
      setSnackbar({
        text: "Cannot Save. Visitor Platenumber is in WhiteList!!",
        modal: true,
        type: "error",
      });
      isProgress.value = false;
      return;
    }

    const newVisitor = (await getVisitorById(
      String(visitorId || ""),
    )) as TVisitor;
    console.log("newVisitor", newVisitor);
    visitors.value.unshift(newVisitor);
    setSnackbar({
      text: "Successful created visitor information",
      modal: true,
      type: "success",
    });
    addVisitorSteps.value = visitor.value?.type != "contractor" ? 2 : 3;
    isProgress.value = false;
  } catch (err) {
    setSnackbar({ text: err as string, modal: true, type: "error" });
    isProgress.value = false;
    addVisitorDialog.value = false;
  }
}

async function onCloseDialog() {
  await setVisitor();

  addVisitorRealtime.value = false;
  addVisitorDialog.value = false;
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
  await setVisitor();
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
}

async function onSelectVisitorType(data: any) {
  visitor.value.type = data.value;
  visitor.value.site = mySite.value;
  visitor.value.organization = currentUser.value?.organization;
}

async function onSelectBlock(block: string) {
  const results = (await getAllLevelsUsingBlock(
    block,
    mySite.value,
  )) as TBlockLevel[];
  allBlockLevels.value = results;

  visitor.value.blockLevel = "";
  visitor.value.unit = "";
}

async function onSelectBlockLevel(block: string, blockLevel: string) {
  const results = await getAllUnitsUsingLevel({
    block: block,
    level: blockLevel,
    site: mySite.value,
  });
  allUnits.value = results;

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
    // console.log(parseCustomDateStringToISO(visitor.value.checkIn));
    dateTomorrow.value = parseCustomDateStringToISO(
      visitor.value.checkIn,
    ).slice(0, 16);
    // console.log(dateTomorrow.value);
  }
}

function parseCustomDateStringToISO(dateString: string): string {
  const [datePart, timePart] = dateString.split(" ");

  const [day, month, year] = datePart.split("/").map(Number);

  const [hours, minutes] = timePart.split(":").map(Number);

  const date = new Date(year, month - 1, day, hours, minutes);

  return date.toISOString();
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
  await setBlocks({
    site: mySite.value,
  });
}, 500);

const debouncedSearchBlockLevel = debounce(async (value: string) => {
  levelSearch.value = value;
  await setBlockLevels({
    block: visitor.value.block,
  });
}, 500);

const debouncedSearchBlockLevelUnit = debounce(async (value: string) => {
  unitSearch.value = value;
  await setUnits({
    block: visitor.value.block,
    level: visitor.value.blockLevel,
  });
}, 500);
</script>

<style scoped>
.dialog_desktop {
  margin: 0 0 0 auto;
  max-width: 28%;
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

:deep() .v-text-field input {
  font-size: 13px !important;
}

:deep() .v-textarea .v-field__input {
  font-size: 13px !important;
}

.overridePicker {
  width: 18px;
}
</style>
