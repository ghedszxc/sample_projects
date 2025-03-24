<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="isTableLoading"
      >
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-row no-gutters>
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <v-data-iterator
                  :items="incidents"
                  :items-per-page="itemsPerPage"
                >
                  <template v-slot:header>
                    <v-row no-gutters class="pa-4" justify="space-between">
                      <v-col cols="12" md="5">
                        <v-row align="center">
                          <v-col cols="12" class="mb-4">
                            <span class="font-weight-bold text-h6">
                              Incidents
                            </span>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col cols="12" sm="12">
                        <v-row align="center">
                          <v-col cols="12" sm="12" md="4">
                            <v-text-field
                              :model-value="search"
                              placeholder="Search"
                              hide-details
                              density="compact"
                              append-inner-icon="mdi-magnify"
                              clearable
                              @update:modelValue="onSearch"
                              @click:clear="callItBack()"
                            >
                            </v-text-field>
                          </v-col>

                          <v-col cols="12" sm="4" md="3" lg="2">
                            <v-select
                              v-model:model-value="selectFilter"
                              :items="filterOpt"
                              item-title="name"
                              item-value="value"
                              hide-details
                              density="compact"
                              menu-icon="mdi-chevron-down"
                              @update:model-value="onFilter(selectFilter)"
                            >
                            </v-select>
                          </v-col>
                          <v-col cols="12" sm="4" md="3" lg="2">
                            <v-text-field
                              v-model="selectedDate"
                              label="Select Date"
                              readonly
                              hide-details
                              clearable
                              append-inner-icon="mdi-calendar"
                              @click="startDateDialog = true"
                              @click:clear="clearDateFilter"
                            >
                            </v-text-field>
                          </v-col>
                          <v-dialog v-model="startDateDialog" max-width="355">
                            <v-card>
                              <v-card-subtitle>
                                <v-date-picker
                                  width="320"
                                  v-model="startDate"
                                  @input="updateStartDate"
                                  :locale="locale"
                                  @change="applyStartDate"
                                ></v-date-picker>
                              </v-card-subtitle>
                            </v-card>
                          </v-dialog>
                          <v-col
                            v-if="$ability.can('create', 'create-incidents')"
                            cols="12"
                            sm="4"
                            md="2"
                            lg="4"
                            class="pl-md-3"
                          >
                            <v-row no-gutters justify="end">
                              <v-col cols="12" lg="6">
                                <v-btn
                                  color="blue-darken-3"
                                  block
                                  variant="flat"
                                  style="height: 40px"
                                  :to="{
                                    name: 'incidents-add',
                                    query: {
                                      site: mySite,
                                    },
                                  }"
                                >
                                  Create
                                  <span v-if="$vuetify.display.xlAndUp"
                                    >Incident Report</span
                                  >
                                  <span v-else> IR</span>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <v-divider />

                    <v-list
                      class="pa-0"
                      density="compact"
                      v-if="$vuetify.display.smAndUp"
                    >
                      <v-list-item>
                        <v-list-item-title>
                          <v-row no-gutters align="center">
                            <v-col cols="12" sm="3" lg="1">
                              <v-row
                                no-gutters
                                class="fill-height d-flex flex-column"
                              >
                                <span
                                  class="d-inline-block text-capitalize text-caption font-weight-bold"
                                >
                                  ID No.
                                </span>
                                <span
                                  class="d-inline-block text-capitalize text-caption font-weight-bold"
                                  v-if="$vuetify.display.mdAndDown"
                                >
                                  Submitted By
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="2"
                              lg="2"
                              v-if="$vuetify.display.lgAndUp"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-blocktext-capitalize text-caption font-weight-bold"
                                >
                                  Submitted By
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" sm="3" lg="2">
                              <v-row
                                no-gutters
                                class="fill-height d-flex flex-column"
                                align-content="start"
                              >
                                <span
                                  class="d-inline-block text-capitalize text-caption font-weight-bold"
                                >
                                  Incident Type
                                </span>
                                <span
                                  class="d-inline-block text-capitalize text-caption font-weight-bold"
                                  v-if="$vuetify.display.mdAndDown"
                                >
                                  Date & Time
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="3"
                              lg="3"
                              class="text-truncate"
                            >
                              <v-row
                                no-gutters
                                class="fill-height d-flex flex-column text-truncate"
                                align-content="start"
                                justify="start"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Incident Location
                                </span>
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                  v-if="$vuetify.display.mdAndDown"
                                >
                                  Approved/Rejected By
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="2"
                              lg="2"
                              v-if="$vuetify.display.lgAndUp"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="start"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Approved/Rejected By
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" sm="3" lg="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <v-col cols="12">
                                  <span
                                    class="text-capitalize text-caption font-weight-bold"
                                    style="
                                      word-break: break-word;
                                      white-space: normal;
                                    "
                                  >
                                    Status
                                  </span>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                    </v-list>
                  </template>

                  <template
                    v-if="$vuetify.display.smAndUp"
                    #default="{ items }"
                  >
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="item.raw._id"
                      >
                        <v-list-item class="py-4">
                          <v-list-item-title>
                            <v-row no-gutters align="center">
                              <v-col cols="12" sm="3" lg="1">
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="start"
                                >
                                  <span
                                    class="text-truncate d-flex flex-column ga-2 ga-lg-0"
                                  >
                                    <span
                                      class="text-truncate text-body-2 text-capitalize font-weight-bold"
                                    >
                                      {{ item.raw.reportId }}
                                    </span>
                                    <span
                                      v-if="$vuetify.display.mdAndDown"
                                      class="text-truncate text-body-2 text-capitalize"
                                    >
                                      <v-avatar
                                        size="x-small"
                                        :color="
                                          stringToColor(
                                            item.raw.incidentInformation
                                              .siteInfo.submittedBy || '',
                                          )
                                        "
                                        :class="`pa-4 ${$vuetify.display.mdAndUp ? 'mr-1' : 'mr-1'}`"
                                      >
                                        {{
                                          getInitial(
                                            item.raw.incidentInformation
                                              .siteInfo.submittedBy || "",
                                          )
                                        }}
                                      </v-avatar>
                                      {{
                                        item.raw.incidentInformation.siteInfo
                                          .submittedBy || "N/A"
                                      }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="2"
                                lg="2"
                                v-if="$vuetify.display.lgAndUp"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <span
                                    :class="`d-inline-block text-truncate text-capitalize text-body-2 ${$vuetify.display.smAndDown && 'mb-2'}`"
                                  >
                                    <v-avatar
                                      size="x-small"
                                      :color="
                                        stringToColor(
                                          typeof item.raw.incidentInformation
                                            .siteInfo.submittedBy === 'object'
                                            ? `${item.raw.incidentInformation.siteInfo.submittedBy}`
                                            : '',
                                        )
                                      "
                                      :class="`pa-4 ${$vuetify.display.mdAndUp ? 'mr-1' : 'mr-1'}`"
                                    >
                                      {{
                                        getInitial(
                                          `${item.raw.incidentInformation.siteInfo.submittedBy}`,
                                        )
                                      }}
                                    </v-avatar>
                                    {{
                                      `${item.raw.incidentInformation.siteInfo.submittedBy} 
                                      `
                                    }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col cols="12" sm="3" lg="2" class="ml-2">
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="start"
                                >
                                  <span
                                    class="text-truncate d-flex flex-column ga-4 ga-lg-0"
                                  >
                                    <span
                                      class="text-truncate text-body-2 text-capitalize text-blue font-weight-bold"
                                    >
                                      {{
                                        incidentType(
                                          item.raw.incidentInformation,
                                        )
                                      }}
                                    </span>
                                    <span
                                      class="text-truncate text-body-2 text-capitalize"
                                    >
                                      <v-icon class="mr-1"
                                        >mdi-calendar-month-outline</v-icon
                                      >
                                      {{
                                        formatDateAndTimeSG(
                                          item.raw.createdAt || "",
                                          true,
                                        )
                                      }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <!-- <v-col
                                cols="12"
                                md="2"
                                lg="2"
                                v-if="$vuetify.display.lgAndUp"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <span
                                    class="text-truncate text-capitalize text-body-2"
                                  >
                                    <v-icon class="mr-1"
                                      >mdi-calendar-month-outline</v-icon
                                    >
                                    {{
                                      formatDateAndTimeSG(
                                        item.raw.createdAt || "",
                                        true,
                                      )
                                    }}
                                  </span>
                                </v-row>
                              </v-col> -->

                              <v-col
                                cols="12"
                                sm="3"
                                lg="3"
                                class="ml-2 ml-lg-0 text-truncate pr-1"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="start"
                                >
                                  <span
                                    class="text-truncate d-flex flex-column ga-2 ga-lg-0"
                                  >
                                    <span
                                      class="d-inline-block text-capitalize text-body-2"
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      <v-icon class="mr-1 mb-1">
                                        mdi-map-marker-alert
                                      </v-icon>
                                      <span>
                                        {{
                                          incidentLocation(
                                            item.raw.incidentInformation,
                                          )
                                        }}
                                      </span>
                                    </span>
                                    <span v-if="$vuetify.display.mdAndDown">
                                      <span
                                        v-if="item.raw.approvedBy"
                                        class="text-truncate text-capitalize text-body-2"
                                      >
                                        <v-avatar
                                          size="x-small"
                                          :color="
                                            stringToColor(
                                              typeof item.raw.approvedBy ===
                                                'object'
                                                ? `${item.raw.approvedBy?.givenName} ${item.raw.approvedBy?.surname}`
                                                : '',
                                            )
                                          "
                                          class="mr-2 pa-4"
                                        >
                                          {{
                                            getInitial(
                                              `${item.raw.approvedBy?.givenName || ""} ${item.raw.approvedBy?.surname || ""}`,
                                            )
                                          }}
                                        </v-avatar>

                                        <span class="text-truncate">{{
                                          `${item.raw.approvedBy?.givenName || ""} ${item.raw.approvedBy?.surname || ""}`
                                        }}</span>
                                      </span>
                                      <span
                                        class="d-inline-block text-truncate text-capitalize text-body-2 text-red mt-1"
                                        v-else
                                        >N/A</span
                                      >
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="2"
                                class="ml-lg-4"
                                v-if="$vuetify.display.lgAndUp"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <span
                                    v-if="item.raw.approvedBy"
                                    class="text-truncate text-capitalize text-body-2"
                                  >
                                    <v-avatar
                                      size="x-small"
                                      :color="
                                        stringToColor(
                                          typeof item.raw.approvedBy ===
                                            'object'
                                            ? `${item.raw.approvedBy?.givenName} ${item.raw.approvedBy?.surname}`
                                            : '',
                                        )
                                      "
                                      class="mr-2 pa-4"
                                    >
                                      {{
                                        getInitial(
                                          `${item.raw.approvedBy?.givenName || ""} ${item.raw.approvedBy?.surname || ""}`,
                                        )
                                      }}
                                    </v-avatar>

                                    <span class="text-truncate">{{
                                      `${item.raw.approvedBy?.givenName || ""} ${item.raw.approvedBy?.surname || ""}`
                                    }}</span>
                                  </span>
                                  <span
                                    class="d-inline-block text-truncate text-capitalize text-body-2 text-red"
                                    v-else
                                    >N/A</span
                                  >
                                </v-row>
                              </v-col>

                              <v-col cols="12" sm="2" lg="1" class="ml-2">
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <v-chip
                                    :class="`text-truncate text-capitalize text-body-2
                                    ${item.raw.status === 'pending' ? 'text-orange' : item.raw.status === 'approved' ? 'text-green' : 'text-red'}`"
                                  >
                                    <span>
                                      {{ item.raw.status }}
                                    </span>
                                  </v-chip>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-list-item-title>

                          <template v-slot:append>
                            <v-menu>
                              <template v-slot:activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  icon
                                  flat
                                  size="x-small"
                                  class="border-md"
                                >
                                  <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                              </template>

                              <v-list class="">
                                <v-list-item class="pa-0">
                                  <template
                                    v-if="
                                      /^(pending|reject|rejected)$/i.test(
                                        item.raw.status || '',
                                      ) &&
                                      $ability.can('update', 'edit-incidents')
                                    "
                                  >
                                    <v-list-item-title
                                      class="action-style text-caption"
                                      @click="editSpecificIr(item.raw._id)"
                                      ><span>Edit</span></v-list-item-title
                                    >
                                    <v-divider></v-divider>
                                  </template>
                                  <v-list-item-title
                                    v-if="
                                      $ability.can('read', 'view-incidents')
                                    "
                                    class="action-style text-caption"
                                    @click="viewSpecificIr(item.raw._id)"
                                    >View</v-list-item-title
                                  >
                                  <div
                                    v-if="
                                      /^(pending|reject|rejected)$/i.test(
                                        item.raw.status || '',
                                      ) &&
                                      $ability.can('delete', 'delete-incidents')
                                    "
                                  >
                                    <v-divider></v-divider>
                                    <v-dialog
                                      v-model="deleteIrDialog"
                                      max-width="400"
                                      persistent
                                    >
                                      <template
                                        v-slot:activator="{
                                          props: activatorProps,
                                        }"
                                      >
                                        <v-list-item-title
                                          class="action-style text-caption"
                                          v-bind="activatorProps"
                                          >Delete</v-list-item-title
                                        >
                                      </template>

                                      <v-card class="pa-10">
                                        <div>
                                          <div class="d-flex justify-center">
                                            <v-img
                                              :src="'/images/throw.svg'"
                                              alt="Delete Image"
                                            />
                                          </div>

                                          <div
                                            class="font-weight-bold text-center my-5"
                                          >
                                            Confirm Password to Delete
                                            {{ item.raw.reportId }}
                                          </div>
                                          <v-text-field
                                            type="password"
                                            label="Enter Password"
                                            v-model="passwordDeleteIr"
                                          ></v-text-field>
                                        </div>
                                        <template v-slot:actions>
                                          <v-spacer></v-spacer>
                                          <v-col cols="12">
                                            <v-row no-gutters>
                                              <v-col cols="6" class="pr-2">
                                                <v-btn
                                                  class="w-100"
                                                  @click="
                                                    deleteIrDialog = false
                                                  "
                                                  variant="outlined"
                                                >
                                                  Cancel
                                                </v-btn>
                                              </v-col>

                                              <v-col cols="6" class="pl-2">
                                                <v-btn
                                                  class="bg-red-darken-4 w-100"
                                                  :loading="buttonDeleteLoader"
                                                  @click="
                                                    deleteIncidentReport(
                                                      item.raw._id,
                                                      item.raw.status,
                                                    )
                                                  "
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
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </template>
                        </v-list-item>

                        <v-divider v-if="itemIndex + 1 !== items.length" />
                      </template>
                    </v-list>
                  </template>

                  <template v-else #default="{ items }">
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="item.raw._id"
                      >
                        <v-list-item class="py-4 px-8">
                          <v-list-item-title>
                            <v-row no-gutters>
                              <v-col
                                cols="12"
                                md="4"
                                :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.smAndDown
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >ID:
                                  </span>
                                  <span
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon class="mr-1 mb-1">
                                      mdi-id-card
                                    </v-icon>
                                    {{ item.raw.reportId }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="4"
                                :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.smAndDown
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Submitted by:
                                  </span>
                                  <span
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-avatar
                                      size="x-small"
                                      :color="
                                        stringToColor(
                                          typeof item.raw.incidentInformation
                                            .siteInfo.submittedBy === 'object'
                                            ? `${item.raw.incidentInformation.siteInfo.submittedBy}`
                                            : '',
                                        )
                                      "
                                      :class="`pa-4 ${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-1'}`"
                                    >
                                      {{
                                        getInitial(
                                          `${item.raw.incidentInformation.siteInfo.submittedBy}`,
                                        )
                                      }}
                                    </v-avatar>
                                    {{
                                      `${item.raw.incidentInformation.siteInfo.submittedBy}`
                                    }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="4"
                                :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.smAndDown
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Incident Type:
                                  </span>
                                  <span
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon class="mr-1 mb-1">
                                      mdi-alert-octagon
                                    </v-icon>
                                    {{
                                      incidentType(item.raw.incidentInformation)
                                    }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="4"
                                :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.smAndDown
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Date & Time:
                                  </span>
                                  <span
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon class="mr-1 mb-1">
                                      mdi-calendar-month-outline
                                    </v-icon>
                                    {{
                                      formatDateAndTimeSG(
                                        item.raw.createdAt || "",
                                        true,
                                      )
                                    }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="4"
                                :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.smAndDown
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Status:
                                  </span>
                                  <span
                                    :class="`text-truncate mt-1 ${$vuetify.display.mdAndUp ? 'pl-5' : 'mb-1'}
                              ${item.raw.status === 'pending' ? 'text-orange' : item.raw.status === 'approved' ? 'text-green' : 'text-red'}`"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon class="mr-1 mb-1">
                                      mdi-account-alert
                                    </v-icon>
                                    <span>
                                      {{ item.raw.status }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="4"
                                :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.smAndDown
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Approved/Rejected By:
                                  </span>
                                  <span
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                    v-if="item.raw.approvedBy"
                                  >
                                    <v-avatar
                                      size="x-small"
                                      :color="
                                        stringToColor(
                                          typeof item.raw.approvedBy ===
                                            'object'
                                            ? `${item.raw.approvedBy?.givenName} ${item.raw.approvedBy?.surname}`
                                            : '',
                                        )
                                      "
                                      class="mr-2 pa-4"
                                    >
                                      {{
                                        getInitial(
                                          `${item.raw.approvedBy?.givenName || ""} ${item.raw.approvedBy?.surname || ""}`,
                                        )
                                      }}
                                    </v-avatar>
                                    <span class="text-truncate">{{
                                      `${item.raw.approvedBy?.givenName || ""} ${item.raw.approvedBy?.surname || ""}`
                                    }}</span>
                                  </span>
                                  <span
                                    :class="`d-inline-block text-truncate text-capitalize text-body-2 ${$vuetify.display.mdAndUp ? 'pl-7' : 'mb-1'}`"
                                    v-else
                                    >N/A</span
                                  >
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="4"
                                :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.smAndDown
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Incident <br />
                                    Location:
                                  </span>
                                  <span
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon class="mr-1 mb-1">
                                      mdi-map-marker-alert
                                    </v-icon>
                                    <span>
                                      {{
                                        incidentLocation(
                                          item.raw.incidentInformation,
                                        )
                                      }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>
                            </v-row>
                            <v-row no-gutters>
                              <v-col
                                cols="6"
                                md="2"
                                class="pa-2 text-capitalize white--text text font-weight-bold"
                              >
                                <span></span>
                              </v-col>
                              <v-col
                                cols="6"
                                md="10"
                                class="text-capitalize white--text d-flex align-end d-flex justify-end"
                              >
                                <v-menu>
                                  <template v-slot:activator="{ props }">
                                    <v-btn
                                      v-bind="props"
                                      icon
                                      flat
                                      size="x-small"
                                      class="border-md rounded-xl"
                                    >
                                      <v-icon>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                  </template>

                                  <v-list class="">
                                    <v-list-item class="pa-0">
                                      <template
                                        v-if="
                                          /^(pending|reject|rejected)$/i.test(
                                            item.raw.status || '',
                                          ) &&
                                          $ability.can(
                                            'update',
                                            'edit-incidents',
                                          )
                                        "
                                      >
                                        <v-list-item-title
                                          class="action-style text-caption"
                                          @click="editSpecificIr(item.raw._id)"
                                          ><span>Edit</span></v-list-item-title
                                        >
                                        <v-divider></v-divider>
                                      </template>
                                      <v-list-item-title
                                        v-if="
                                          $ability.can('read', 'view-incidents')
                                        "
                                        class="action-style text-caption"
                                        @click="viewSpecificIr(item.raw._id)"
                                        >View</v-list-item-title
                                      >
                                      <div
                                        v-if="
                                          /^(pending|reject|rejected)$/i.test(
                                            item.raw.status || '',
                                          ) &&
                                          $ability.can(
                                            'delete',
                                            'delete-incidents',
                                          )
                                        "
                                      >
                                        <v-divider></v-divider>
                                        <v-dialog
                                          v-model="deleteIrDialog"
                                          max-width="400"
                                          persistent
                                        >
                                          <template
                                            v-slot:activator="{
                                              props: activatorProps,
                                            }"
                                          >
                                            <v-list-item-title
                                              class="action-style text-caption"
                                              v-bind="activatorProps"
                                              >Delete</v-list-item-title
                                            >
                                          </template>

                                          <v-card class="pa-10">
                                            <div>
                                              <div
                                                class="d-flex justify-center"
                                              >
                                                <v-img
                                                  :src="'/images/throw.svg'"
                                                  alt="Delete Image"
                                                />
                                              </div>

                                              <div
                                                class="font-weight-bold text-center my-5"
                                              >
                                                Confirm Password to Delete
                                                {{ item.raw.reportId }}
                                              </div>
                                              <v-text-field
                                                type="password"
                                                label="Enter Password"
                                                v-model="passwordDeleteIr"
                                              ></v-text-field>
                                            </div>
                                            <template v-slot:actions>
                                              <v-spacer></v-spacer>
                                              <v-col cols="12">
                                                <v-row no-gutters>
                                                  <v-col cols="6" class="pr-2">
                                                    <v-btn
                                                      class="w-100"
                                                      @click="
                                                        deleteIrDialog = false
                                                      "
                                                      variant="outlined"
                                                    >
                                                      Cancel
                                                    </v-btn>
                                                  </v-col>

                                                  <v-col cols="6" class="pl-2">
                                                    <v-btn
                                                      class="bg-red-darken-4 w-100"
                                                      :loading="
                                                        buttonDeleteLoader
                                                      "
                                                      @click="
                                                        deleteIncidentReport(
                                                          item.raw._id,
                                                          item.raw.status,
                                                        )
                                                      "
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
                                    </v-list-item>
                                  </v-list>
                                </v-menu>
                              </v-col>
                            </v-row>
                          </v-list-item-title>
                        </v-list-item>
                        <v-divider
                          v-if="itemIndex + 1 !== items.length"
                        ></v-divider>
                      </template>
                    </v-list>
                  </template>

                  <template #no-data>
                    <v-row no-gutters justify="center" class="pa-16">
                      <v-col cols="12">
                        <v-row no-gutters justify="center">
                          <v-img
                            src="/empty.svg"
                            width="100px"
                            height="100px"
                          ></v-img>
                        </v-row>
                      </v-col>

                      <v-col cols="12">
                        <v-row no-gutters justify="center">
                          <span class="font-weight-bold">
                            You don't have any incident yet.
                          </span>
                        </v-row>
                      </v-col>
                    </v-row>
                  </template>
                </v-data-iterator>
              </v-col>
            </v-row>
          </v-col>

          <v-divider></v-divider>

          <v-col cols="12" class="pa-4">
            <v-row no-gutters justify="end" align-content="center">
              <span>{{ pageRange }}</span>
              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="page === 1"
                @click="
                  prevPage({
                    site: mySite,
                  })
                "
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>

              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="page >= pages"
                @click="
                  nextPage({
                    site: mySite,
                  })
                "
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import moment from "moment-timezone";
import debounce from "lodash/debounce";
import vuetify from "~/plugins/vuetify";

definePageMeta({
  middleware: ["secure", "leader"],
});
const { $ability } = useNuxtApp();
const router = useRouter();
const { currentUser } = useLocalAuth();
const buttonDeleteLoader = ref(false);
const deleteIrDialog = ref(false);
const passwordDeleteIr = ref("");
const { confirmSign } = useOccurrenceEntry();
const { setSnackbar } = useLocal();
const {
  getInitial,
  materialColors,
  formatDateAndTimeSG,
  standardFormatDate,
  stringToColor,
} = useUtils();
const {
  incidents,
  search,
  selectFilter,
  dateSelected,
  page,
  pages,
  pageRange,
  itemsPerPage,
  prevPage,
  nextPage,
  isTableLoading,
  setIncidents,
  setIncident,
  deleteIncidentById,
} = useIncident();
const { getSitesOptionsForFiltering, mySite } = useFilter();

const filterOpt = computed(() => {
  return [
    {
      name: "All",
      value: "",
      disabled: false,
    },
    {
      name: "Pending",
      value: "pending",
      disabled: false,
    },
    {
      name: "Rejected",
      value: "rejected",
      disabled: false,
    },
    {
      name: "Approved",
      value: "approved",
      disabled: false,
    },
  ];
});

const startDate = ref<Date | null>(null);
const selectedDate = ref("");
const startDateDialog = ref(false);
const locale = "en";

onMounted(async () => {
  clearDateFilter();
  await getSitesOptionsForFiltering();
  await setIncidents({
    site: mySite.value,
  });
  // reset data
  setIncident();
});

async function updateStartDate(date: Date | null) {
  startDate.value = date;
}

watch(startDate, (newVal) => {
  if (newVal) {
    applyStartDate("hasValue");
  } else {
    applyStartDate("empty");
  }
});

async function applyStartDate(condition: string) {
  if (condition === "hasValue" && startDate.value) {
    const getDate = new Date(startDate.value);

    selectedDate.value = standardFormatDate(getDate);
    dateSelected.value = moment
      .tz(moment(selectedDate.value, "DD/MM/YYYY"), "Asia/Singapore")
      .format("MM/DD/YYYY");

    await setIncidents({
      site: mySite.value,
    });
  } else {
    selectedDate.value = "";
    dateSelected.value = "";
    await setIncidents({
      site: mySite.value,
    });
  }

  startDateDialog.value = false;
}

function clearDateFilter() {
  startDate.value = null;
  selectedDate.value = "";
  dateSelected.value = "";
  setIncidents({
    site: mySite.value,
  });
}

onUnmounted(async () => {
  selectedDate.value = "";
});

const deleteIncidentReport = async (id: string, status?: string) => {
  buttonDeleteLoader.value = true;
  try {
    const confirmResult = await confirmSign({
      user: currentUser.value._id,
      password: passwordDeleteIr.value,
    });
    if (confirmResult) {
      const updatedIr = await deleteIncidentById(id, status);
      if (updatedIr) {
        setSnackbar({
          text: "Successfully deleted",
          modal: true,
          type: "success",
        });
        deleteIrDialog.value = false;
        buttonDeleteLoader.value = false;
        passwordDeleteIr.value = "";
        await setIncidents({
          site: mySite.value,
        });
      }
    }
  } catch (error) {
    setSnackbar({ text: "Failed to confirm", modal: true, type: "error" });
  } finally {
    buttonDeleteLoader.value = false;
  }
};

const viewSpecificIr = (id: string) => {
  const updatedPath = `${router.currentRoute.value.path}/${id}`;
  router.push({
    path: updatedPath,
    query: {
      site: mySite.value,
    },
  });
};

const editSpecificIr = (id: string) => {
  router.push({
    name: "Edit Incident Report",
    params: { id },
    query: {
      site: mySite.value,
    },
  });
};

function incidentType(incidentInformation: IIncidentInformation) {
  if (incidentInformation.incidentTypeAndTime) {
    return incidentInformation.incidentTypeAndTime.typeOfIncident;
  }
  return "";
}

function incidentLocation(incidentInformation: IIncidentInformation) {
  if (incidentInformation.placeOfIncident) {
    return `${incidentInformation.placeOfIncident.block.name}
          - L${incidentInformation.placeOfIncident.level.level}
          - ${incidentInformation.placeOfIncident.unit.name}
          `;
  }
  return "";
}

function onSearch(val: string) {
  debouncedSearch(val);
}

const debouncedSearch = debounce(async (value: string) => {
  search.value = value;
  page.value = 1;
  await setIncidents({
    site: mySite.value,
  });
}, 500);

async function callItBack() {
  await setIncidents({
    site: mySite.value,
  });
}

async function onFilter(value: string) {
  selectFilter.value = value;
  await setIncidents({
    site: mySite.value,
  });
}

async function onRouteOrShowDialog(
  val: { text: string; to: boolean | string },
  incident: IIncident,
) {
  if (typeof val.to === "string") {
    if (val.to === "showNotify") {
      // notify

      return;
    }
    // routes
    navigateTo({
      name: val.to,
      query: {
        site: mySite.value,
      },
    });
    return;
  } else if (typeof val.to === "boolean") {
    // dialog
  }
}

let threeDotsBool = ref(false);

const openThreeDots = () => {
  console.log(threeDotsBool.value);
};
</script>

<style scoped>
.select-class {
  min-width: 100px;
}

.search-class {
  min-width: 250px !important;
}

.three-dots-hover {
  background-color: transparent;
  transition:
    background-color 0.5s ease,
    cursor 0.3s ease;
}

.three-dots-hover:hover {
  background-color: rgb(188, 188, 188);
  cursor: pointer;
  transition: ease;
}

.action-style {
  padding: 3px 20px;
  cursor: pointer;
}

.action-style:hover {
  background-color: rgb(174, 174, 174);
  transition: all 0.2s;
}

.overridePicker {
  width: 18px;
}
</style>
