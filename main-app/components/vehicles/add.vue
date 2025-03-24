<template>
  <v-dialog
    v-model="addVehicleDialog"
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
        <span class="font-weight-bold pl-4 pt-1 text-capitalize"
          >Add Vehicle</span
        >
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          icon="mdi-close"
          @click="onCloseDialog()"
        ></v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text>
        <v-row class="h-100 align-center">
          <v-col cols="12" v-if="!selectedStatus">
            <v-img src="/images/add-visitor.svg" />
            <div class="text-center my-6 text-subtitle-2">
              Please Select Status
            </div>

            <v-btn
              block
              size="small"
              class="mt-4"
              variant="flat"
              style="height: 40px"
              color="blue-darken-3"
              @click="onSelectStatus('whitelist')"
            >
              Whitelist
            </v-btn>

            <v-btn
              block
              size="small"
              class="mt-4"
              variant="flat"
              style="height: 40px"
              color="blue-darken-3"
              @click="onSelectStatus('seasonpass')"
            >
              Season Pass
            </v-btn>

            <v-btn
              block
              size="small"
              class="mt-4"
              variant="flat"
              style="height: 40px"
              color="blue-darken-3"
              @click="onSelectStatus('blocklist')"
            >
              Blocklist
            </v-btn>
          </v-col>

          <v-form ref="banVehicleForm">
            <v-col cols="12" class="mb-4" v-if="selectedStatus === 'blocklist'">
              <v-row v-if="addVehicleSteps === 1">
                <v-col cols="12" class="mb-5">
                  <v-img :src="`/images/ban-vehicle.svg`" height="125" />
                </v-col>

                <v-col cols="12" class="font-weight-bold pb-4">
                  <v-btn
                    v-if="selectedStatus"
                    size="x-small"
                    variant="flat"
                    class="grey-darken-1"
                    icon="mdi-chevron-left"
                    @click="selectedStatus = ''"
                  />
                  General information
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="firstName"
                    label="First Name"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="lastName"
                    label="Last Name"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="nric"
                    label="NRIC"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                  ></v-text-field>
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
                    @input="filterNumericInput"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="plateNumber"
                    label="Vehicle Number"
                    density="compact"
                    hide-details
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="remarks"
                    label="Remarks"
                    density="compact"
                    hide-details
                    rows="3"
                    no-resize
                    :disabled="isProgress"
                    :rules="[alphabetAndSpaceOnly]"
                  ></v-textarea>
                </v-col>

                <v-col cols="12">
                  <v-btn
                    block
                    color="blue-darken-3"
                    size="small"
                    variant="flat"
                    style="height: 40px"
                    :disabled="isProgress"
                    @click="submit()"
                  >
                    Add Ban
                  </v-btn>
                </v-col>
              </v-row>

              <v-row v-if="addVehicleSteps == 2">
                <v-col cols="12" class="mb-5">
                  <v-img :src="`/images/confirmation.svg`" height="125" />
                </v-col>

                <v-col cols="12">
                  <div
                    class="text-center mt-6 text-subtitle-1 font-weight-bold"
                  >
                    Blocklisted
                  </div>
                  <div class="text-center mt-2 text-caption">
                    Successfully added a banned vehicle
                  </div>
                  <v-row class="px-3 mt-5" justify="space-between">
                    <v-col cols="12">
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
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-form>

          <v-col cols="12" class="mt-5" v-if="selectedStatus === 'seasonpass'">
            <v-row>
              <v-col cols="12" class="mb-5">
                <v-img :src="`/images/add-visitor.svg`" height="125" />
              </v-col>

              <v-col cols="12" v-if="addVehicleSteps === 1">
                <!-- <v-row no-gutters>
                  <v-col cols="3" v-if="uploadUsingCsv">
                    <v-btn
                      v-if="selectedStatus"
                      size="x-small"
                      variant="flat"
                      class="grey-darken-1 mb-6 mr-2"
                      icon="mdi-chevron-left"
                      @click="uploadUsingCsv = false"
                    ></v-btn>

                    <v-btn
                      size="small"
                      color="green-darken-2"
                      icon
                      class="mb-7"
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
                      label="Add Multiple Whitelist"
                      color="blue-darken-3"
                      density="compact"
                      hide-details
                      inset
                      :disabled="isProgress"
                    ></v-switch>
                  </v-col>
                </v-row> -->
              </v-col>

              <!-- <v-col cols="12" class="mt-5" v-if="uploadUsingCsv">
                <v-row>
                  <v-col cols="12" v-if="addVehicleSteps === 1">
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
                      @click="onAddMultipleWhitelist()"
                    >
                      Add Whitelist
                    </v-btn>
                  </v-col>

                  <v-col cols="12" v-if="addVehicleSteps == 2">
                    <div
                      class="text-center mt-6 text-subtitle-1 font-weight-bold"
                    >
                      Great!
                    </div>
                    <div class="text-center mt-2 text-caption">
                      A new vehicle is added to the list of vehicles
                    </div>
                    <v-row class="px-3 mt-5" justify="space-between">
                      <v-col cols="12">
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
                    </v-row>
                  </v-col>
                </v-row>
              </v-col> -->

              <!-- v-else -->
              <v-col cols="12">
                <v-row no-gutters>
                  <v-form @submit.prevent ref="addSeasonPassForm">
                    <v-col cols="12" class="mb-6" v-if="addVehicleSteps === 1">
                      <v-row>
                        <v-col cols="12" class="font-weight-bold pb-4">
                          <v-btn
                            v-if="addVehicleSteps === 1"
                            size="x-small"
                            variant="flat"
                            class="grey-darken-1"
                            icon="mdi-chevron-left"
                            @click="onGoBack()"
                          />
                          General information
                        </v-col>

                        <v-col cols="12">
                          <v-select
                            v-model="whitelistVehicle.seasonPassType"
                            :items="seasonPassTypes"
                            :item-title="seasonPassTypes"
                            :item-value="seasonPassTypes"
                            label="Season Pass Type"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                          ></v-select>

                          <!-- :item-title="itemTitle"
                          :item-value="itemValue" -->
                        </v-col>

                        <v-col cols="6">
                          <v-text-field
                            v-model="whitelistVehicle.firstName"
                            label="First Name"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="6">
                          <v-text-field
                            v-model="whitelistVehicle.lastName"
                            label="Last Name"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="4">
                          <v-select
                            v-model="prefix_whitelist"
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
                            v-model="primaryPhone_whitelist"
                            label="Phone Number"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            @input="filterNumericInput"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-autocomplete
                            v-model="whitelistVehicle.block"
                            :items="blocks"
                            item-title="name"
                            item-value="_id"
                            label="Block"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                            @update:modelValue="
                              onGetAllLevels(whitelistVehicle.block)
                            "
                            @update:search="onSearchBlock"
                            clearable
                            no-filter
                          ></v-autocomplete>
                        </v-col>

                        <v-col cols="12">
                          <v-select
                            v-model="whitelistVehicle.level"
                            :items="itemLevels"
                            item-title="level"
                            item-value="_id"
                            label="Level"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                            @update:modelValue="
                              onGetAllUnits(
                                whitelistVehicle.block,
                                whitelistVehicle.level,
                              )
                            "
                          ></v-select>
                        </v-col>

                        <v-col cols="12">
                          <v-select
                            v-model="whitelistVehicle.unit"
                            :items="itemUnits"
                            item-title="name"
                            item-value="_id"
                            label="Unit"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                          ></v-select>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="whitelistVehicle.plateNumber"
                            label="Vehicle Number"
                            density="comfortable"
                            hide-details
                            :disabled="isProgress"
                            clearable
                            :rules="[requiredInput]"
                          ></v-text-field>
                        </v-col>

                        <!-- <v-col cols="12">
                        <v-select
                          v-model="whitelistVehicle.type"
                          label="Type"
                          density="compact"
                          :items="userListTypes"
                          hide-details
                          :disabled="isProgress"
                          :rules="[requiredInput]"
                        ></v-select>
                      </v-col> -->

                        <v-col cols="12" class="h-100">
                          <v-sheet divided class="d-flex flex-wrap h-100 ga-3">
                            <v-btn
                              v-for="item in customRanges"
                              :disabled="isProgress"
                              :variant="
                                dateRangeChoice === item.value
                                  ? 'outlined'
                                  : undefined
                              "
                              class="flex-grow-1"
                              @click="setDateRange(item.value)"
                              >{{ item.label }}</v-btn
                            >
                          </v-sheet>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            label="Start Date"
                            v-model="whitelistVehicle.subscriptionStart"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :readonly="dateRangeChoice !== 'Custom'"
                            :clearable="dateRangeChoice === 'Custom'"
                            type="datetime-local"
                            class="mb-6"
                          ></v-text-field>

                          <v-text-field
                            v-model="whitelistVehicle.subscriptionExpiry"
                            label="End Date"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :readonly="dateRangeChoice !== 'Custom'"
                            :clearable="dateRangeChoice === 'Custom'"
                            type="datetime-local"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12" v-if="addVehicleSteps === 2">
                      <div
                        class="text-center mt-6 text-subtitle-1 font-weight-bold"
                      >
                        Great!
                      </div>
                      <div class="text-center mt-2 text-caption">
                        A new vehicle is added to the list of vehicles
                      </div>
                      <v-row class="px-3 mt-5" justify="space-between">
                        <v-col cols="12">
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
                      </v-row>
                    </v-col>

                    <v-col cols="12">
                      <v-btn
                        v-if="addVehicleSteps === 1"
                        block
                        color="blue-darken-3"
                        size="small"
                        variant="flat"
                        style="height: 40px"
                        @click="onAddSingleWhitelist()"
                        :disabled="isProgress"
                      >
                        Add Whitelist
                      </v-btn>
                    </v-col>
                  </v-form>
                </v-row>
              </v-col>

              <v-col cols="12" v-if="!uploadUsingCsv && addVehicleSteps == 2">
                <v-row> </v-row>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" class="mt-5" v-if="selectedStatus === 'whitelist'">
            <v-row>
              <v-col cols="12" class="mb-5">
                <v-img :src="`/images/add-visitor.svg`" height="125" />
              </v-col>

              <v-col cols="12" v-if="addVehicleSteps === 1">
                <v-row no-gutters>
                  <v-col cols="3" v-if="uploadUsingCsv">
                    <v-btn
                      v-if="selectedStatus"
                      size="x-small"
                      variant="flat"
                      class="grey-darken-1 mb-6 mr-2"
                      icon="mdi-chevron-left"
                      @click="uploadUsingCsv = false"
                    ></v-btn>

                    <v-btn
                      size="small"
                      color="green-darken-2"
                      icon
                      class="mb-7"
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
                      label="Add Multiple Whitelist"
                      color="blue-darken-3"
                      density="compact"
                      hide-details
                      inset
                      :disabled="isProgress"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" class="mt-5" v-if="uploadUsingCsv">
                <v-row>
                  <v-col cols="12" v-if="addVehicleSteps === 1">
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
                      @click="onAddMultipleWhitelist()"
                    >
                      Add Whitelist
                    </v-btn>
                  </v-col>

                  <v-col cols="12" v-if="isUploading">
                    <v-progress-linear
                      v-model="uploadProgress"
                      color="success"
                      height="25"
                      rounded
                    >
                      <template v-slot:default>
                        <strong
                          :class="
                            uploadProgress > 50 ? 'text-white' : 'text-black'
                          "
                        >
                          {{ Math.ceil(uploadProgress) }}% ({{
                            processedItems
                          }}/{{ totalItems }})
                        </strong>
                      </template>
                    </v-progress-linear>
                  </v-col>

                  <v-col cols="12" v-if="addVehicleSteps == 2">
                    <div
                      class="text-center mt-6 text-subtitle-1 font-weight-bold"
                    >
                      Great!
                    </div>
                    <div class="text-center mt-2 text-caption">
                      A new vehicle is added to the list of vehicles
                    </div>
                    <v-row class="px-3 mt-5" justify="space-between">
                      <v-col cols="12">
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
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" v-else>
                <v-row no-gutters>
                  <v-form @submit.prevent ref="addWhitelistForm">
                    <v-col cols="12" class="mb-6" v-if="addVehicleSteps === 1">
                      <v-row>
                        <v-col cols="12" class="font-weight-bold pb-4">
                          <v-btn
                            v-if="addVehicleSteps === 1"
                            size="x-small"
                            variant="flat"
                            class="grey-darken-1"
                            icon="mdi-chevron-left"
                            @click="onGoBack()"
                          />
                          General information
                        </v-col>

                        <v-col cols="6">
                          <v-text-field
                            v-model="whitelistVehicle.firstName"
                            label="First Name"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="6">
                          <v-text-field
                            v-model="whitelistVehicle.lastName"
                            label="Last Name"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="4">
                          <v-select
                            v-model="prefix_whitelist"
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
                            v-model="primaryPhone_whitelist"
                            label="Phone Number"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            @input="filterNumericInput"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-autocomplete
                            v-model="whitelistVehicle.block"
                            :items="blocks"
                            item-title="name"
                            item-value="_id"
                            label="Block"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                            @update:modelValue="
                              onGetAllLevels(whitelistVehicle.block)
                            "
                            @update:search="onSearchBlock"
                            clearable
                            no-filter
                          ></v-autocomplete>
                        </v-col>

                        <v-col cols="12">
                          <v-select
                            v-model="whitelistVehicle.level"
                            :items="itemLevels"
                            item-title="level"
                            item-value="_id"
                            label="Level"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                            @update:modelValue="
                              onGetAllUnits(
                                whitelistVehicle.block,
                                whitelistVehicle.level,
                              )
                            "
                          ></v-select>
                        </v-col>

                        <v-col cols="12">
                          <v-select
                            v-model="whitelistVehicle.unit"
                            :items="itemUnits"
                            item-title="name"
                            item-value="_id"
                            label="Unit"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                          ></v-select>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="whitelistVehicle.plateNumber"
                            label="Vehicle Number"
                            density="comfortable"
                            hide-details
                            :disabled="isProgress"
                            clearable
                            :rules="[requiredInput]"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12" v-if="addVehicleSteps === 2">
                      <div
                        class="text-center mt-6 text-subtitle-1 font-weight-bold"
                      >
                        Great!
                      </div>
                      <div class="text-center mt-2 text-caption">
                        A new vehicle is added to the list of vehicles
                      </div>
                      <v-row class="px-3 mt-5" justify="space-between">
                        <v-col cols="12">
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
                      </v-row>
                    </v-col>

                    <v-col cols="12">
                      <v-btn
                        v-if="addVehicleSteps === 1"
                        block
                        color="blue-darken-3"
                        size="small"
                        variant="flat"
                        style="height: 40px"
                        @click="onAddSingleWhitelist()"
                        :disabled="isProgress"
                      >
                        Add Whitelist
                      </v-btn>
                    </v-col>
                  </v-form>
                </v-row>
              </v-col>

              <v-col cols="12" v-if="!uploadUsingCsv && addVehicleSteps == 2">
                <v-row> </v-row>
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
definePageMeta({
  middleware: "secure",
});
import phoneCode from "@/components/phone-code.json";
import debounce from "lodash/debounce";
import moment from "moment";
import io from "socket.io-client";
const prefixes = phoneCode;
const { theme } = useLocal();
const { setSnackbar } = useLocal();
const { requiredInput, alphabetAndSpaceOnly } = useUtils();
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
const { currentUser } = useLocalAuth();
const userListTypes = [
  { title: "Whitelist", value: "whitelist" },
  { title: "Season Pass", value: "seasonpass" },
];
const prefix = ref("+65");
const primaryPhone = ref("");
const fullPhoneNumber = ref("");
const addWhitelistForm = ref<HTMLFormElement | null>(null);
const addSeasonPassForm = ref<HTMLFormElement | null>(null);
const uploadProgress = ref(0);
const isUploading = ref(false);
const processedItems = ref(0);
const totalItems = ref(0);

watch([prefix, primaryPhone], ([newPrefix, newPrimaryPhone]) => {
  if (!newPrefix || !newPrimaryPhone) {
    fullPhoneNumber.value = ""; // Handle null or undefined values
  } else {
    fullPhoneNumber.value = `${newPrefix}${newPrimaryPhone}`;
  }
  // Update the contact information in props
  phone.value = fullPhoneNumber.value;
});

const prefix_whitelist = ref("+65");
const primaryPhone_whitelist = ref("");
const fullPhoneNumber_whitelist = ref("");
watch(
  [prefix_whitelist, primaryPhone_whitelist],
  ([newPrefix, newPrimaryPhone]) => {
    if (!newPrefix || !newPrimaryPhone) {
      fullPhoneNumber_whitelist.value = ""; // Handle null or undefined values
    } else {
      fullPhoneNumber_whitelist.value = `${newPrefix}${newPrimaryPhone}`;
    }
    // Update the contact information in props
    phone.value = fullPhoneNumber_whitelist.value;
  },
);
const {
  vehicle,
  setVehicle,
  setVehicles,
  addBanVehicle,
  addWhiteListVehicle,
  addVehicleDialog,
  addVehicleSteps,
  filterByType,
  filterByStatus,
  filterOrganization,
  addMultipleWhitelist,
} = useVehicle();
const { getSitesOptionsForFiltering, mySite } = useFilter();
const { getSiteSettingsById } = useSiteSettings();

const dateRangeChoice = ref("Custom");
const customRanges = ref([
  { label: "Custom", value: "Custom" },
  { label: "1 Week", value: "1 Week" },
  { label: "2 Weeks", value: "2 Week" },
  { label: "3 Weeks", value: "3 Week" },
  { label: "4 Weeks", value: "4 Week" },
  { label: "5 Weeks", value: "5 Week" },
]);

// const banVehicleForm = ref(null);
const banVehicleForm = ref<HTMLFormElement | null>(null);

const name = ref("");
const firstName = ref("");
const lastName = ref("");

const plateNumber = ref("");
const nric = ref("");
const phone = ref("");
const remarks = ref("");

const payloadForm = ref({});
const isProgress = ref(false);
const selectedStatus = ref("");
const uploadUsingCsv = ref(false);

// const seasonPassTypes = ref([]);
const seasonPassTypes = ref<string[]>([]);

const itemBlocks = ref<TItemBlock[]>([]);
const itemLevels = ref<IItemLevel[]>([]);
const itemUnits = ref<TItemUnits[]>([]);
const filterNumericInput = (event: any) => {
  const value = event.target.value;
  primaryPhone.value = value.replace(/\D/g, "");
  primaryPhone_whitelist.value = value.replace(/\D/g, "");
};
const whitelistVehicle = ref({
  name: "",
  firstName: "",
  lastName: "",
  plateNumber: "",
  phoneNumber: "",
  block: "",
  level: "",
  unit: "",
  remarks: "",
  type: "",
  seasonPassType: "",
  subscriptionStart: "",
  subscriptionExpiry: "",
});

onMounted(async () => {
  await getSitesOptionsForFiltering();
  await setBlocks({ site: mySite.value });
  const my_site = await getSiteSettingsById(mySite.value);

  seasonPassTypes.value = my_site?.seasonPassType ?? [];
});

onUnmounted(() => {
  dateRangeChoice.value = "Custom";
});

function setDateRange(value: string) {
  dateRangeChoice.value = value;

  if (value !== "Custom") {
    // whitelistVehicle.value.subscriptionStart = new Date()
    //   .toISOString()
    //   .slice(0, 16)

    whitelistVehicle.value.subscriptionStart = new Date(
      new Date().getTime() + 8 * 60 * 60 * 1000,
    )
      .toISOString()
      .slice(0, 16);
  }

  if (value === "Custom") {
    whitelistVehicle.value.subscriptionStart = "";
    whitelistVehicle.value.subscriptionExpiry = "";
  }

  if (value === "1 Week") {
    // whitelistVehicle.value.subscriptionExpiry = "";
    whitelistVehicle.value.subscriptionExpiry = new Date(
      new Date().getTime() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000,
    )
      .toISOString()
      .slice(0, 16);
  }

  if (value === "2 Week") {
    // whitelistVehicle.value.subscriptionExpiry = "";
    whitelistVehicle.value.subscriptionExpiry = new Date(
      new Date().getTime() + 7 * 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000,
    )
      .toISOString()
      .slice(0, 16);
  }

  if (value === "3 Week") {
    // whitelistVehicle.value.subscriptionExpiry = "";
    whitelistVehicle.value.subscriptionExpiry = new Date(
      new Date().getTime() + 7 * 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000,
    )
      .toISOString()
      .slice(0, 16);
  }

  if (value === "4 Week") {
    // whitelistVehicle.value.subscriptionExpiry = "";
    whitelistVehicle.value.subscriptionExpiry = new Date(
      new Date().getTime() + 7 * 4 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000,
    )
      .toISOString()
      .slice(0, 16);
  }

  if (value === "5 Week") {
    // whitelistVehicle.value.subscriptionExpiry = "";
    whitelistVehicle.value.subscriptionExpiry = new Date(
      new Date().getTime() + 7 * 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000,
    )
      .toISOString()
      .slice(0, 16);
  }
}

async function submit() {
  try {
    isProgress.value = true;

    banVehicleForm.value?.validate();

    if (!firstName.value) {
      return setSnackbar({
        text: "First name is required",
        modal: true,
        type: "warning",
      });
    } else if (!lastName.value) {
      return setSnackbar({
        text: "Last name is required",
        modal: true,
        type: "warning",
      });
    } else if (!nric.value) {
      return setSnackbar({
        text: "NRIC is required",
        modal: true,
        type: "warning",
      });
    } else if (!phone.value) {
      return setSnackbar({
        text: "Phone number is required",
        modal: true,
        type: "warning",
      });
    } else if (!plateNumber.value) {
      return setSnackbar({
        text: "Vehicle Number is required",
        modal: true,
        type: "warning",
      });
    } else if (!remarks.value) {
      return setSnackbar({
        text: "Remarks is required",
        modal: true,
        type: "warning",
      });
    }

    const result = await addBanVehicle({
      name: firstName.value + " " + lastName.value,
      firstName: firstName.value,
      lastName: lastName.value,
      plateNumber: plateNumber.value,
      nric: nric.value,
      phone: phone.value,
      remarks: remarks.value,
      site: mySite.value,
      organization: currentUser.value?.organization,
    });

    getVehicleList();

    setSnackbar({ text: result, modal: true, type: "success" });
    addVehicleSteps.value = 2;
    isProgress.value = false;
  } catch (err) {
    setSnackbar({ text: err as string, modal: true, type: "error" });
    isProgress.value = false;
  } finally {
    isProgress.value = false;
  }
}

async function onGetAllLevels(block: string) {
  const levels = await getAllLevelsUsingBlock(block, mySite.value);
  itemLevels.value = levels as IItemLevel[];
}

async function onGetAllUnits(block: string, level: string) {
  const units = await getAllUnitsUsingLevel({
    block,
    level,
    site: mySite.value,
  });
  itemUnits.value = units;
}

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-");

  return `${day}/${month}/${year}`;
}

async function onAddSingleWhitelist() {
  isProgress.value = true;

  if (whitelistVehicle.value.type === "whitelist") {
    addWhitelistForm.value?.validate();

    if (!whitelistVehicle.value.block) {
      isProgress.value = false;
      return setSnackbar({
        text: "Block is required.",
        modal: true,
        type: "error",
      });
    } else if (!whitelistVehicle.value.level) {
      isProgress.value = false;
      return setSnackbar({
        text: "Level is required.",
        modal: true,
        type: "error",
      });
    } else if (!whitelistVehicle.value.unit) {
      isProgress.value = false;
      return setSnackbar({
        text: "Unit is required.",
        modal: true,
        type: "error",
      });
    } else if (!whitelistVehicle.value.plateNumber) {
      isProgress.value = false;
      return setSnackbar({
        text: "Vehicle Number is required.",
        modal: true,
        type: "error",
      });
    }
  } else if (whitelistVehicle.value.type === "seasonpass") {
    addSeasonPassForm.value?.validate();

    if (!whitelistVehicle.value.block) {
      isProgress.value = false;
      return setSnackbar({
        text: "Block is required.",
        modal: true,
        type: "error",
      });
    } else if (!whitelistVehicle.value.level) {
      isProgress.value = false;
      return setSnackbar({
        text: "Level is required.",
        modal: true,
        type: "error",
      });
    } else if (!whitelistVehicle.value.unit) {
      isProgress.value = false;
      return setSnackbar({
        text: "Unit is required.",
        modal: true,
        type: "error",
      });
    } else if (!whitelistVehicle.value.plateNumber) {
      isProgress.value = false;
      return setSnackbar({
        text: "Vehicle Number is required.",
        modal: true,
        type: "error",
      });
    } else if (!whitelistVehicle.value.subscriptionStart) {
      isProgress.value = false;
      return setSnackbar({
        text: "Season pass start date is required.",
        modal: true,
        type: "error",
      });
    } else if (!whitelistVehicle.value.subscriptionExpiry) {
      isProgress.value = false;
      return setSnackbar({
        text: "Season pass end date is required.",
        modal: true,
        type: "error",
      });
    }
  }

  const _firstName = whitelistVehicle.value.firstName?.trim() || "";
  const _lastName = whitelistVehicle.value.lastName?.trim() || "";
  const _fullName =
    _firstName && _lastName
      ? `${_firstName} ${_lastName}`
      : !_firstName && !_lastName
        ? ""
        : _firstName
          ? _firstName
          : _lastName
            ? _lastName
            : "";

  try {
    const result = await addWhiteListVehicle({
      name: _fullName,
      firstName: _firstName,
      lastName: _lastName,
      plateNumber: whitelistVehicle.value.plateNumber,
      phoneNumber: whitelistVehicle.value.phoneNumber,
      block: whitelistVehicle.value.block,
      level: whitelistVehicle.value.level,
      unit: whitelistVehicle.value.unit,
      remarks: whitelistVehicle.value.remarks,
      type: whitelistVehicle.value.type,
      seasonPassType: whitelistVehicle.value.seasonPassType,
      subscriptionStart: whitelistVehicle.value.subscriptionStart,
      subscriptionExpiry: whitelistVehicle.value.subscriptionExpiry,
      site: mySite.value,
      organization: currentUser.value?.organization,
    });

    getVehicleList();

    setSnackbar({ text: result, modal: true, type: "success" });
    addVehicleSteps.value = 2;
    isProgress.value = false;

    whitelistVehicle.value.name = "";
    whitelistVehicle.value.plateNumber = "";
    whitelistVehicle.value.phoneNumber = "";
    whitelistVehicle.value.block = "";
    whitelistVehicle.value.level = "";
    whitelistVehicle.value.unit = "";
    whitelistVehicle.value.remarks = "";
    whitelistVehicle.value.type = "";
    whitelistVehicle.value.seasonPassType = "";
    whitelistVehicle.value.subscriptionStart = "";
    whitelistVehicle.value.subscriptionExpiry = "";

    dateRangeChoice.value = "Custom";
  } catch (err) {
    setSnackbar({ text: err as string, modal: true, type: "error" });
  }

  isProgress.value = false;
}

async function onCloseDialog() {
  await setVehicle();
  uploadUsingCsv.value = false;

  addVehicleDialog.value = false;
  addVehicleSteps.value = 1;

  name.value = "";
  plateNumber.value = "";
  remarks.value = "";
  selectedStatus.value = "";

  whitelistVehicle.value.name = "";
  whitelistVehicle.value.firstName = "";
  whitelistVehicle.value.lastName = "";
  whitelistVehicle.value.plateNumber = "";
  whitelistVehicle.value.phoneNumber = "";
  whitelistVehicle.value.block = "";
  whitelistVehicle.value.level = "";
  whitelistVehicle.value.unit = "";
  whitelistVehicle.value.remarks = "";
  whitelistVehicle.value.type = "";
  whitelistVehicle.value.seasonPassType = "";
  whitelistVehicle.value.subscriptionStart = "";
  whitelistVehicle.value.subscriptionExpiry = "";
}

async function onGoBack() {
  await setVehicle();
  dateRangeChoice.value = "Custom";
  selectedStatus.value = "";
  addVehicleSteps.value = 1;
}

async function getVehicleList() {
  await setVehicles({
    site: mySite.value,
    type: filterByType.value.toLowerCase(),
    status: filterByStatus.value.toLowerCase(),
  });
}

async function onSelectStatus(data: string) {
  selectedStatus.value = data;
  whitelistVehicle.value.type = data;
}

async function onAddMultipleWhitelist() {
  try {
    isProgress.value = true;
    isUploading.value = true;
    uploadProgress.value = 0;

    await addMultipleWhitelist(payloadForm.value);
    getVehicleList();

    addVehicleSteps.value++;
    setSnackbar({
      text: "Successfully created whitelist",
      modal: true,
      type: "success",
    });
  } catch (err) {
    setSnackbar({
      text: "Failed to add whitelist",
      modal: true,
      type: "error",
    });
  } finally {
    isProgress.value = false;
    isUploading.value = false;
    uploadProgress.value = 0;
  }
}

async function onDownloadCSV() {
  isProgress.value = true;
  const headers = [
    [
      "fullName",
      "userType",
      "phoneNumber",
      "block",
      "level",
      "unit",
      "plateNumber",
      "subscriptionExpiry",
    ],
    [
      "{ insert name }",
      "{ insert resident / season pass }",
      "{ insert phone number }",
      "{ insert EXACT block name }",
      "{ insert EXACT block level }",
      "{ insert EXACT unit }",
      "{ insert Vehicle Number }",
      "{ insert subscription date expiry }",
    ],
  ];
  let csvContent =
    "data:text/csv;charset=utf-8," + headers.map((e) => e.join(",")).join("\n");

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  await link.setAttribute("href", encodedUri);
  await link.setAttribute("download", "add-whitelist-template.csv");
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
      const regex = /^[a-zA-Z\s\-(),/]+$|^N\/A$/;
      const validateStringName = regex.test(rows[0]); // to check if name contains alphabet, spaces, or N/A
      if (validateStringName) formattedData.data.push(objectKeys);
    }
  });
  payloadForm.value = formattedData;
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
    block: whitelistVehicle.value.block,
  });
}, 500);

const debouncedSearchBlockLevelUnit = debounce(async (value: string) => {
  unitSearch.value = value;
  await setUnits({
    block: whitelistVehicle.value.block,
    level: whitelistVehicle.value.unit,
  });
}, 500);

//sockets

const APP_VISITOR = useRuntimeConfig().public.API_VISITOR;

const socket = io(`${APP_VISITOR}/site-${mySite.value}`, {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to visitor socket");
});

socket.on("upload-progress", async (data: any) => {
  uploadProgress.value = data.progress;
  processedItems.value = data.processed;
  totalItems.value = data.total;
});

socket.on("disconnect", () => {
  console.log("Disconnected from visitor socket");
});

//end sockets
</script>
<style scoped>
.override_shadow {
  box-shadow: 0px 13px 19px -13px rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 0px 13px 19px -13px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 13px 19px -13px rgba(0, 0, 0, 0.15);
}

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

:deep() .v-text-field input {
  font-size: 13px !important;
}

:deep() .v-textarea .v-field__input {
  font-size: 13px !important;
}

:deep() .v-switch .v-label {
  padding-right: 10px;
  font-size: 13px;
}

:deep() .v-switch .v-selection-control {
  display: flex;
  flex-direction: row-reverse;
}
</style>
