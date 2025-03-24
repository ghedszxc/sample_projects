<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="isVPatrolLoading"
      >
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-row no-gutters class="pa-4" justify="center">
          <v-col cols="12">
            <span class="font-weight-bold text-h6">Patrol Log</span>
          </v-col>
          <v-col cols="12">
            <v-tabs grow v-model="tab" color="#0077b6" height="60px">
              <v-tab value="patrol-log"
                ><span class="font-weight-bold"> Patrol Log </span></v-tab
              >
              <v-tab value="patrol-log-email"
                ><span class="font-weight-bold">Patrol Log Emails</span></v-tab
              >
            </v-tabs>
          </v-col>
        </v-row>

        <v-tabs-window v-model="tab">
          <!-- Patrol Log Tab -->
          <v-tabs-window-item value="patrol-log">
            <v-row no-gutters>
              <v-col cols="12">
                <v-data-iterator
                  :items="patrolLogList"
                  :items-per-page="patrolLogsItemsPerPage"
                >
                  <template v-slot:header>
                    <v-row no-gutters class="pa-4" justify="space-between">
                      <v-col cols="12" sm="12">
                        <v-row align="center">
                          <v-col cols="12" sm="12" md="4">
                            <v-text-field
                              v-model="search"
                              placeholder="Search"
                              hide-details
                              density="compact"
                              append-inner-icon="mdi-magnify"
                              @update:modelValue="onSearch"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            :sm="currentUser?.type == 'admin' ? 6 : 6"
                            v-if="currentUser?.type == 'admin'"
                          >
                            <v-select
                              v-model="filterOrganization"
                              :items="organizations"
                              item-title="name"
                              item-value="_id"
                              hide-details
                              density="compact"
                              menu-icon="mdi-chevron-down"
                            >
                            </v-select>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="6"
                            :class="{ 'mb-5': $vuetify.display.smAndDown }"
                            v-if="
                              currentUser?.type == 'admin' ||
                              currentUser?.type == 'organization'
                            "
                          >
                            <v-select
                              v-model="filterSite"
                              :items="sites"
                              :disabled="!sites.length"
                              item-title="name"
                              item-value="_id"
                              hide-details
                              density="compact"
                              menu-icon="mdi-chevron-down"
                            >
                              <template v-slot:append>
                                <v-btn
                                  color="blue-darken-3"
                                  block
                                  variant="flat"
                                  size="small"
                                  style="
                                    height: 40px;
                                    border-radius: 0 5px 5px 0;
                                    left: -20px !important;
                                  "
                                  @click="updateFilter()"
                                >
                                  View
                                </v-btn>
                              </template>
                            </v-select>
                          </v-col>
                          <v-row
                            no-gutters
                            justify="end"
                            align="center"
                            class="px-2"
                          >
                            <v-col
                              v-if="
                                $ability.can(
                                  'create',
                                  'email-log-virtual-patrol',
                                )
                              "
                              cols="12"
                              sm="6"
                              lg="4"
                            >
                              <v-btn-group
                                color="#b2d7ef"
                                density="comfortable"
                                class="w-100"
                              >
                                <v-btn
                                  prepend-icon="mdi-email-arrow-left-outline"
                                  variant="flat"
                                  class="w-100"
                                  @click="isSendPatrolOpen = true"
                                >
                                  <div class="text-none font-weight-regular">
                                    Send Patrol Log
                                  </div>

                                  <v-dialog
                                    v-model="isSendPatrolOpen"
                                    max-width="500"
                                  >
                                    <v-card rounded="lg">
                                      <v-card-title
                                        class="d-flex justify-space-between align-center"
                                      >
                                        <div
                                          class="text-h5 text-medium-emphasis ps-2"
                                        >
                                          Send Email Patrol Log
                                        </div>

                                        <v-btn
                                          icon="mdi-close"
                                          variant="text"
                                          @click="onCloseSendEmailDialog()"
                                        ></v-btn>
                                      </v-card-title>

                                      <v-divider class="mb-4"></v-divider>

                                      <v-card-text class="pb-0">
                                        <v-combobox
                                          v-model="emailList"
                                          class="mb-5"
                                          label="To"
                                          variant="underlined"
                                          chips
                                          clearable
                                          multiple
                                          hide-details
                                          closable-chips
                                          :disabled="isSendingEmail"
                                        >
                                          <template
                                            v-slot:selection="{
                                              attrs,
                                              item,
                                              select,
                                              selected,
                                            }"
                                          >
                                            <v-chip
                                              v-bind="attrs"
                                              :model-value="selected"
                                              @click="select"
                                            >
                                              <strong>{{ item }}</strong
                                              >&nbsp;
                                            </v-chip>
                                          </template>
                                        </v-combobox>

                                        <v-text-field
                                          v-model="emailSubject"
                                          :counter="300"
                                          class="mb-5"
                                          rows="2"
                                          persistent-counter
                                          label="Subject"
                                          hide-details
                                          variant="underlined"
                                          :disabled="isSendingEmail"
                                        ></v-text-field>
                                        <!-- 
                                    <v-textarea
                                      v-model="emailMessage"
                                      :counter="300"
                                      class="mb-2 my-10"
                                      rows="5"
                                      variant="underlined"
                                      persistent-counter
                                      label="Message (optional)"
                                      hide-details
                                    ></v-textarea> -->
                                        <div
                                          :class="[
                                            'mt-10',
                                            'text-red',
                                            isErrorEmailMessage ? '' : 'd-none',
                                          ]"
                                        >
                                          {{ errorEmailMessage }}
                                        </div>
                                      </v-card-text>

                                      <v-card-actions
                                        class="my-2 d-flex justify-end"
                                      >
                                        <v-btn
                                          class="text-none"
                                          rounded="xl"
                                          text="Cancel"
                                          @click="onCloseSendEmailDialog()"
                                        ></v-btn>

                                        <v-btn
                                          class="text-none"
                                          color="primary"
                                          rounded="xl"
                                          text="Send"
                                          variant="flat"
                                          :loading="isSendingEmail"
                                          @click="
                                            onSendPatrolLogs({
                                              subject: emailSubject,
                                              emails: emailList,
                                              items: checkedPatrolLogs,
                                              site: mySite,
                                            })
                                          "
                                        ></v-btn>
                                      </v-card-actions>
                                    </v-card>
                                  </v-dialog>
                                </v-btn>
                              </v-btn-group>
                            </v-col>
                            <v-col
                              v-if="
                                $ability.can(
                                  'create',
                                  'download-log-reports-virtual-patrol',
                                )
                              "
                              cols="12"
                              sm="6"
                              lg="4"
                              class="pl-sm-2 my-2 my-sm-2"
                            >
                              <v-menu location="bottom">
                                <template #activator="{ props }">
                                  <v-btn
                                    v-bind="props"
                                    color="primary"
                                    block
                                    style="height: 40px"
                                  >
                                    <v-icon class="mr-2"
                                      >mdi-file-download-outline</v-icon
                                    >
                                    Download Report
                                  </v-btn>
                                </template>

                                <v-list density="compact" class="pa-0">
                                  <v-list-item
                                    class="text-caption"
                                    @click="onDownloadAllPdf()"
                                  >
                                    Download All Report
                                  </v-list-item>
                                  <v-list-item
                                    class="text-caption"
                                    @click="onOpenDownloadReportDialog('daily')"
                                  >
                                    Download Daily Report via PDF
                                  </v-list-item>
                                  <v-list-item
                                    class="text-caption"
                                    @click="
                                      onOpenDownloadReportDialog('monthly')
                                    "
                                  >
                                    Download Monthly Report via PDF
                                  </v-list-item>
                                </v-list>
                              </v-menu>
                              <v-dialog
                                v-model="selectReportRangeDialog"
                                max-width="600"
                              >
                                <v-card
                                  prepend-icon="mdi-account"
                                  title="Download All Report on Specific Date Range"
                                >
                                  <v-card-text class="">
                                    <v-row dense class="d-flex align-center">
                                      <v-col cols="5" class="">
                                        <v-text-field
                                          v-model="dateFrom"
                                          label="Date From"
                                          required
                                          type="date"
                                          @input="resetDateTo()"
                                        ></v-text-field>
                                      </v-col>
                                      <v-col cols="2" class="">
                                        <div class="text-center">to</div>
                                      </v-col>
                                      <v-col cols="5" class="">
                                        <v-text-field
                                          v-model="dateTo"
                                          label="Date To"
                                          required
                                          type="date"
                                          :disabled="!dateFrom"
                                          :min="dateFrom"
                                        ></v-text-field>
                                      </v-col>
                                    </v-row>
                                    <v-row>
                                      <v-col
                                        cols="12"
                                        class="d-flex justify-end"
                                      >
                                        <v-btn-toggle
                                          v-model="fileType"
                                          color="primary"
                                          variant="outlined"
                                          mandatory
                                        >
                                          <v-btn value="csv" class="text-bold"
                                            >CSV</v-btn
                                          >
                                          <v-btn value="pdf" class="text-bold"
                                            >PDF</v-btn
                                          >
                                        </v-btn-toggle>
                                      </v-col>
                                    </v-row>
                                  </v-card-text>

                                  <v-divider></v-divider>

                                  <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn
                                      text="Close"
                                      variant="plain"
                                      @click="onCloseSelectRangeDialog()"
                                    ></v-btn>

                                    <v-btn
                                      :loading="isDownloadingRangeReport"
                                      color="primary"
                                      text="Download"
                                      variant="tonal"
                                      :disabled="
                                        !dateFrom ||
                                        !dateTo ||
                                        !fileType ||
                                        isDownloadingRangeReport
                                      "
                                      @click="
                                        onDownloadRangeReports({
                                          fileType,
                                          dateFrom,
                                          dateTo,
                                          site: mySite,
                                        })
                                      "
                                    >
                                      <template v-slot:loader>
                                        <v-progress-circular
                                          indeterminate
                                          color="white"
                                          size="20"
                                        ></v-progress-circular>
                                      </template>
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                              <v-dialog
                                v-model="downloadReportDialog"
                                max-width="600"
                              >
                                <v-card
                                  prepend-icon="mdi-account"
                                  :title="`Download ${typeOfReport === 'daily' ? 'Daily' : 'Monthly'} Report Summary`"
                                >
                                  <v-card-text class="pa-5">
                                    <v-row dense class="d-flex justify-center">
                                      <v-col cols="6" class="">
                                        <v-text-field
                                          v-if="typeOfReport === 'daily'"
                                          v-model="specificDate"
                                          label="Date"
                                          required
                                          type="date"
                                        ></v-text-field>
                                        <v-text-field
                                          v-else-if="typeOfReport === 'monthly'"
                                          v-model="specificMonth"
                                          label="Month and Year"
                                          required
                                          type="month"
                                        ></v-text-field>
                                      </v-col>
                                    </v-row>
                                  </v-card-text>

                                  <v-divider></v-divider>

                                  <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn
                                      text="Close"
                                      variant="plain"
                                      @click="onCloseDownloadReportDialog()"
                                    ></v-btn>

                                    <v-btn
                                      :loading="isDownloadingReport"
                                      color="primary"
                                      text="Download"
                                      variant="tonal"
                                      :disabled="
                                        (typeOfReport === 'daily' &&
                                          !specificDate) ||
                                        (typeOfReport === 'monthly' &&
                                          !specificMonth)
                                      "
                                      @click="
                                        if (typeOfReport === 'daily') {
                                          onDownloadPatrolLogPdf({
                                            timeFrame: typeOfReport,
                                            date: formatDate(specificDate),
                                            site: mySite,
                                          });
                                        } else if (typeOfReport === 'monthly') {
                                          onDownloadPatrolLogPdf({
                                            timeFrame: typeOfReport,
                                            monthAndYear:
                                              getCurrentMonthAndYear(
                                                specificMonth,
                                              ),
                                            site: mySite,
                                          });
                                        }
                                      "
                                    >
                                      <template v-slot:loader>
                                        <v-progress-circular
                                          indeterminate
                                          color="white"
                                          size="20"
                                        ></v-progress-circular>
                                      </template>
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                            </v-col>
                          </v-row>
                        </v-row>
                      </v-col>
                    </v-row>

                    <v-divider></v-divider>

                    <v-list
                      class="pa-0"
                      density="compact"
                      v-if="$vuetify.display.smAndUp"
                    >
                      <v-list-item class="py-3">
                        <v-list-item-title>
                          <v-row no-gutters>
                            <v-col cols="12" sm="5" md="3" lg="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  <v-menu location="bottom">
                                    <template #activator="{ props }">
                                      <v-btn v-bind="props" size="x-small" flat>
                                        <v-icon size="small"
                                          >mdi-filter-variant</v-icon
                                        >
                                      </v-btn>
                                    </template>

                                    <v-card
                                      class="elevation-2"
                                      min-width="200px"
                                    >
                                      <v-card-text>
                                        <div
                                          class="d-flex justify-space-between align-center mb-2"
                                        >
                                          <span class="font-weight-bold"
                                            >Route List</span
                                          >
                                          <div class="d-flex align-center ga-1">
                                            <v-icon
                                              color="primary"
                                              @click.stop="
                                                routeList.forEach(
                                                  (route) =>
                                                    (route.selected = true),
                                                )
                                              "
                                            >
                                              mdi-select-all
                                            </v-icon>
                                            <v-icon
                                              color="red"
                                              @click.stop="
                                                routeList.forEach(
                                                  (route) =>
                                                    (route.selected = false),
                                                )
                                              "
                                              >mdi-selection-ellipse-remove</v-icon
                                            >
                                          </div>
                                        </div>
                                        <v-divider />

                                        <v-list density="compact" class="pa-0">
                                          <template
                                            v-for="(route, key) in routeList"
                                            :key="key"
                                          >
                                            <v-list-item
                                              link
                                              @click.stop="
                                                route.selected = !route.selected
                                              "
                                              class="d-flex align-center"
                                            >
                                              <v-icon
                                                v-if="!route.selected"
                                                size="small"
                                                class="mr-2"
                                              >
                                                mdi-checkbox-blank-circle-outline
                                              </v-icon>
                                              <v-icon
                                                v-else
                                                size="small"
                                                class="mr-2"
                                                color="green"
                                              >
                                                mdi-checkbox-marked-circle
                                              </v-icon>
                                              {{ route.name }}
                                            </v-list-item>
                                          </template>
                                        </v-list>
                                        <v-divider />
                                      </v-card-text>
                                      <v-card-actions>
                                        <v-btn
                                          color="success"
                                          block
                                          variant="tonal"
                                          @click="onFilterTable()"
                                          ><v-icon> mdi-filter </v-icon>
                                          Filter
                                        </v-btn>
                                      </v-card-actions>
                                    </v-card>
                                  </v-menu>
                                  Route
                                </span>
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                  v-if="
                                    $vuetify.display.sm || $vuetify.display.md
                                  "
                                >
                                  / CCTV
                                </span>
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                  v-if="$vuetify.display.sm"
                                >
                                  / Status
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              lg="1"
                              v-if="$vuetify.display.lgAndUp"
                              class="pl-3"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  CCTV
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" sm="4" md="3" lg="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  <v-menu location="bottom">
                                    <template #activator="{ props }">
                                      <v-btn v-bind="props" size="x-small" flat>
                                        <v-icon size="small"
                                          >mdi-filter-variant</v-icon
                                        >
                                      </v-btn>
                                    </template>

                                    <v-card
                                      class="elevation-2"
                                      min-width="200px"
                                    >
                                      <v-card-text>
                                        <div
                                          class="d-flex justify-space-between align-center mb-2"
                                        >
                                          <span class="font-weight-bold"
                                            >Assignee List</span
                                          >
                                          <div class="d-flex align-center ga-1">
                                            <v-icon
                                              color="primary"
                                              @click.stop="
                                                assigneeList.forEach(
                                                  (route) =>
                                                    (route.selected = true),
                                                )
                                              "
                                            >
                                              mdi-select-all
                                            </v-icon>
                                            <v-icon
                                              color="red"
                                              @click.stop="
                                                assigneeList.forEach(
                                                  (route) =>
                                                    (route.selected = false),
                                                )
                                              "
                                              >mdi-selection-ellipse-remove</v-icon
                                            >
                                          </div>
                                        </div>
                                        <v-divider />

                                        <v-list density="compact" class="pa-0">
                                          <template
                                            v-for="(
                                              assignee, key
                                            ) in assigneeList"
                                            :key="key"
                                          >
                                            <v-list-item
                                              link
                                              @click.stop="
                                                assignee.selected =
                                                  !assignee.selected
                                              "
                                              class="d-flex align-center"
                                            >
                                              <v-icon
                                                v-if="!assignee.selected"
                                                size="small"
                                                class="mr-2"
                                              >
                                                mdi-checkbox-blank-circle-outline
                                              </v-icon>
                                              <v-icon
                                                v-else
                                                size="small"
                                                class="mr-2"
                                                color="green"
                                              >
                                                mdi-checkbox-marked-circle
                                              </v-icon>
                                              {{ assignee.name }}
                                            </v-list-item>
                                          </template>
                                        </v-list>
                                        <v-divider />
                                      </v-card-text>
                                      <v-card-actions>
                                        <v-btn
                                          color="success"
                                          block
                                          variant="tonal"
                                          @click="onFilterTable()"
                                          ><v-icon> mdi-filter </v-icon>
                                          Filter
                                        </v-btn>
                                      </v-card-actions>
                                    </v-card>
                                  </v-menu>
                                  Submitted By
                                </span>
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold w-100"
                                  v-if="$vuetify.display.sm"
                                >
                                  <v-menu location="bottom">
                                    <template #activator="{ props }">
                                      <v-btn v-bind="props" size="x-small" flat>
                                        <v-icon size="small"
                                          >mdi-filter-variant</v-icon
                                        >
                                      </v-btn>
                                    </template>

                                    <v-card width="250">
                                      <v-card-text>
                                        <v-list
                                          density="compact"
                                          class="text-caption pa-0"
                                        >
                                          <v-list-item link @click.stop="">
                                            <v-text-field
                                              v-model="filters.from"
                                              readonly
                                              label="Start Date"
                                              hide-details
                                              clearable
                                              append-inner-icon="mdi-calendar"
                                              class="w-100 mt-2"
                                              @click="startDateDialog = true"
                                            >
                                              <v-dialog
                                                v-model="startDateDialog"
                                                max-width="355"
                                              >
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
                                            </v-text-field>
                                          </v-list-item>
                                        </v-list>
                                      </v-card-text>
                                    </v-card>
                                  </v-menu>
                                  Created Date
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              md="2"
                              lg="2"
                              v-if="$vuetify.display.mdAndUp"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  <v-menu location="bottom">
                                    <template #activator="{ props }">
                                      <v-btn v-bind="props" size="x-small" flat>
                                        <v-icon size="small"
                                          >mdi-filter-variant</v-icon
                                        >
                                      </v-btn>
                                    </template>

                                    <v-card width="250">
                                      <v-card-text>
                                        <v-list
                                          density="compact"
                                          class="text-caption pa-0"
                                        >
                                          <v-list-item link @click.stop="">
                                            <v-text-field
                                              v-model="filters.from"
                                              readonly
                                              label="Start Date"
                                              hide-details
                                              clearable
                                              append-inner-icon="mdi-calendar"
                                              class="w-100 mt-2"
                                              @click="startDateDialog = true"
                                            >
                                              <v-dialog
                                                v-model="startDateDialog"
                                                max-width="355"
                                              >
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
                                            </v-text-field>
                                          </v-list-item>
                                        </v-list>
                                      </v-card-text>
                                    </v-card>
                                  </v-menu>
                                  Created Date
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              lg="2"
                              md="2"
                              class="pl-3"
                              v-if="$vuetify.display.mdAndUp"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Status
                                  <span v-if="$vuetify.display.md">/ IR</span>
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="3"
                              lg="1"
                              class="pl-3"
                              v-if="
                                $vuetify.display.lgAndUp || $vuetify.display.sm
                              "
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-capitalize text-caption font-weight-bold pl-2"
                                  style="
                                    word-break: break-word;
                                    white-space: normal;
                                  "
                                >
                                  IR
                                </span>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                    <v-divider />
                  </template>

                  <template #default="{ items }">
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="itemIndex"
                      >
                        <v-list-item
                          :to="{
                            name: 'routes-patrol-logs-id-route-view',
                            params: { id: item.raw._id },
                          }"
                          :class="
                            $vuetify.display.smAndDown || $vuetify.display.md
                              ? 'py-2 border-md px-4 px-sm-2 rounded-lg mb-2 mx-2 my-2'
                              : 'py-1 px-0 px-lg-4 mx-2 my-0 text-body-2'
                          "
                        >
                          <v-list-item-title>
                            <v-row no-gutters align="center">
                              <v-col
                                cols="12"
                                sm="5"
                                md="3"
                                :class="`text ${
                                  $vuetify.display.mdAndUp ? 'my-1' : 'mb-1'
                                }`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none"
                                    >Route:
                                  </span>
                                  <span
                                    class="d-flex text-truncate text-capitalize align-center mr-sm-2 text-truncate"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : 'word-break: break-word; white-space: normal;'
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-checkbox
                                      v-model="checkedPatrolLogs"
                                      :value="item.raw._id"
                                      density="compact"
                                      hide-details
                                      class="mr-1"
                                    ></v-checkbox>

                                    <v-icon
                                      size="x-small"
                                      class="mx-1 pa-3"
                                      style="
                                        background: #1976d2;
                                        border-radius: 25px;
                                        color: #ffffff;
                                      "
                                      v-if="
                                        $vuetify.display.xs ||
                                        $vuetify.display.lgAndUp
                                      "
                                      >mdi-cctv</v-icon
                                    >
                                    <span
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      {{
                                        item.raw.routeName
                                          ? item.raw.routeName
                                          : "Error"
                                      }}
                                    </span>
                                  </span>
                                  <span
                                    class="d-inline-block text-truncate text-capitalize w-100"
                                    v-if="
                                      $vuetify.display.sm || $vuetify.display.md
                                    "
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-icon
                                      size="x-small"
                                      class="mx-1 pa-3"
                                      style="
                                        background: #1976d2;
                                        border-radius: 25px;
                                        color: #ffffff;
                                      "
                                      >mdi-cctv</v-icon
                                    >
                                    {{ item.raw.count }}
                                    <span
                                      v-if="
                                        $vuetify.display.sm ||
                                        $vuetify.display.md
                                      "
                                      >cctv</span
                                    >
                                  </span>

                                  <span
                                    class="d-inline-block text-truncate text-capitalize ml-md-2 w-100 mt-1"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                    v-if="$vuetify.display.sm"
                                  >
                                    <v-chip
                                      v-if="
                                        item.raw.status.filter(
                                          (status) => status,
                                        ).length > 0
                                      "
                                      :color="
                                        item.raw.status.includes(
                                          'incomplete',
                                        ) &&
                                        item.raw.status.includes('late-patrol')
                                          ? 'orange' // If both incomplete and late-patrol are present
                                          : item.raw.status.includes(
                                                'incomplete',
                                              )
                                            ? 'red'
                                            : item.raw.status.includes(
                                                  'complete',
                                                ) &&
                                                item.raw.status.includes(
                                                  'late-patrol',
                                                )
                                              ? 'blue'
                                              : item.raw.status.includes(
                                                    'complete',
                                                  )
                                                ? 'green'
                                                : 'grey'
                                      "
                                      class="ma-1"
                                    >
                                      <v-icon class="mr-1"
                                        >mdi-calendar-month-outline</v-icon
                                      >
                                      <span
                                        style="
                                          word-break: break-word;
                                          white-space: normal;
                                        "
                                      >
                                        {{
                                          item.raw.status
                                            .filter((status) => status)
                                            .join(", ")
                                        }}
                                      </span>
                                    </v-chip>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                lg="1"
                                :class="`text ${
                                  $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                }`"
                                v-if="
                                  $vuetify.display.lgAndUp ||
                                  $vuetify.display.xs
                                "
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none"
                                    >CCTV:
                                  </span>
                                  <span
                                    class="d-inline-block text-truncate text-capitalize ml-sm-2"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-icon
                                      size="x-small"
                                      class="mx-1 pa-3"
                                      style="
                                        background: #1976d2;
                                        border-radius: 25px;
                                        color: #ffffff;
                                      "
                                      >mdi-cctv</v-icon
                                    >
                                    {{ item.raw.count }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="4"
                                md="3"
                                lg="2"
                                :class="`text ${
                                  $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                }`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none"
                                    >Submitted by:
                                  </span>
                                  <span
                                    class="d-inline-block text-truncate text-capitalize mt-sm-2 ml-sm-2"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-avatar
                                      size="x-small"
                                      :color="materialColors[itemIndex]"
                                      class="mr-2 pa-2"
                                    >
                                      {{
                                        getInitial(
                                          `${item.raw.assigneeName ? item.raw.assigneeName.givenName + " " + item.raw.assigneeName.surname : ""}`,
                                        ).slice(0, 2)
                                      }}
                                    </v-avatar>
                                    <span
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      {{
                                        `${item.raw.assigneeName ? item.raw.assigneeName.givenName + " " + item.raw.assigneeName.surname : ""}`
                                      }}
                                    </span>
                                  </span>

                                  <span
                                    class="d-flex align-center text-truncate text-capitalize ml-sm-2 mr-sm-2 mr-lg-0 w-100 mt-2"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                    v-if="$vuetify.display.sm"
                                  >
                                    <v-icon class="mr-1"
                                      >mdi-calendar-month-outline</v-icon
                                    >
                                    <span
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      {{
                                        standardFormatDateTime(
                                          item.raw.createdAt,
                                        )
                                      }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                cols="12"
                                md="2"
                                lg="2"
                                :class="`text ${
                                  $vuetify.display.smAndDown ? 'my-1' : 'mb-2'
                                }`"
                                v-if="$vuetify.display.md"
                              >
                                <span
                                  class="d-flex align-center text-truncate text-capitalize ml-sm-2 mr-sm-2 mr-lg-0"
                                  :style="
                                    $vuetify.display.xs
                                      ? 'font-size: 1rem;'
                                      : ''
                                  "
                                  :class="
                                    $vuetify.display.xs ? '' : 'text-body-2'
                                  "
                                >
                                  <v-icon class="mr-1"
                                    >mdi-calendar-month-outline</v-icon
                                  >
                                  <span
                                    style="
                                      word-break: break-word;
                                      white-space: normal;
                                    "
                                  >
                                    {{
                                      standardFormatDateTime(item.raw.createdAt)
                                    }}
                                  </span>
                                </span>
                              </v-col>
                              <v-col
                                cols="12"
                                md="2"
                                lg="2"
                                :class="`text ${
                                  $vuetify.display.xs ? 'my-1' : 'mb-2'
                                }`"
                                v-if="
                                  $vuetify.display.xs ||
                                  $vuetify.display.lgAndUp
                                "
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="d-flex d-sm-none"
                                    >Date Created:
                                  </span>

                                  <span
                                    class="d-flex align-center text-truncate text-capitalize mr-lg-0"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-icon class="mr-1"
                                      >mdi-calendar-month-outline</v-icon
                                    >
                                    <span
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      {{
                                        standardFormatDateTime(
                                          item.raw.createdAt,
                                        )
                                      }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="3"
                                lg="2"
                                :class="`text ${
                                  $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                }`"
                                v-if="
                                  $vuetify.display.xs ||
                                  $vuetify.display.mdAndUp
                                "
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none"
                                    >Status:
                                  </span>

                                  <span
                                    class="d-inline-block text-truncate text-capitalize ml-md-2"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-chip
                                      v-if="
                                        item.raw.status.filter(
                                          (status) => status,
                                        ).length > 0
                                      "
                                      :color="
                                        item.raw.status.includes(
                                          'incomplete',
                                        ) &&
                                        item.raw.status.includes('late-patrol')
                                          ? 'orange' // If both incomplete and late-patrol are present
                                          : item.raw.status.includes(
                                                'incomplete',
                                              )
                                            ? 'red'
                                            : item.raw.status.includes(
                                                  'complete',
                                                ) &&
                                                item.raw.status.includes(
                                                  'late-patrol',
                                                )
                                              ? 'blue'
                                              : item.raw.status.includes(
                                                    'complete',
                                                  )
                                                ? 'green'
                                                : 'grey'
                                      "
                                      class="ma-sm-1"
                                    >
                                      <v-icon class="mr-1"
                                        >mdi-calendar-month-outline</v-icon
                                      >
                                      <span
                                        style="
                                          word-break: break-word;
                                          white-space: normal;
                                        "
                                      >
                                        {{
                                          item.raw.status
                                            .filter((status) => status)
                                            .join(", ")
                                        }}
                                      </span>
                                    </v-chip>
                                  </span>

                                  <span
                                    class="w-100 pl-4"
                                    v-if="
                                      $vuetify.display.sm || $vuetify.display.md
                                    "
                                  >
                                    <span
                                      :class="[
                                        'fill-height',
                                        item.raw &&
                                        item.raw?.irAttachment?.reportId
                                          ? 'hover-effect '
                                          : '',
                                      ]"
                                      v-if="
                                        item.raw &&
                                        item.raw?.irAttachment?.reportId
                                      "
                                      class="text-red"
                                      @click="
                                        navigateToIncidentReport(
                                          item.raw.irAttachment?._id,
                                          item.raw._id,
                                          false,
                                        )
                                      "
                                    >
                                      <v-icon class="mr-1"
                                        >mdi-folder-alert</v-icon
                                      >
                                      {{ item.raw?.irAttachment?.reportId }}
                                    </span>
                                    <span v-else class="text-red text-body-2"
                                      >N/A</span
                                    >
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="2"
                                md="2"
                                lg="1"
                                :class="`text ${
                                  $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                }`"
                                v-if="
                                  $vuetify.display.smAndDown ||
                                  $vuetify.display.lgAndUp
                                "
                              >
                                <v-row
                                  no-gutters
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="d-flex d-sm-none"
                                    >IR Attachment:
                                  </span>
                                  <v-btn
                                    icon
                                    variant="text"
                                    width="80"
                                    v-if="
                                      item.raw &&
                                      item.raw?.irAttachment?.reportId
                                    "
                                    class="text-red"
                                    :loading="isDownloadingPdf === item.raw._id"
                                    :disabled="
                                      isDownloadingPdf !== '' &&
                                      isDownloadingPdf !== item.raw._id
                                    "
                                    @click="
                                      navigateToIncidentReport(
                                        item.raw.irAttachment?._id,
                                        item.raw._id,
                                        $vuetify.display.smAndDown,
                                      )
                                    "
                                  >
                                    <v-icon class="mr-1"
                                      >mdi-folder-alert</v-icon
                                    >
                                    {{ item.raw?.irAttachment?.reportId }}
                                  </v-btn>
                                  <span
                                    v-else
                                    class="text-red text-body-2 pl-sm-3 pl-md-0 pl-lg-4"
                                    >N/A</span
                                  >
                                </v-row>
                              </v-col>

                              <!-- Share Button -->
                              <v-col cols="10" v-if="$vuetify.display.xs">
                                <v-row
                                  no-gutters
                                  :justify="
                                    $vuetify.display.xs ? 'end' : 'center'
                                  "
                                >
                                  <v-col cols="12">
                                    <v-btn
                                      color="primary"
                                      @click="shareContent(item.raw)"
                                    >
                                      <v-icon>
                                        mdi-share-variant-outline
                                      </v-icon>
                                    </v-btn>
                                  </v-col>
                                </v-row>
                              </v-col>

                              <v-col cols="2" sm="1">
                                <v-row
                                  no-gutters
                                  :justify="
                                    $vuetify.display.xs ? 'end' : 'center'
                                  "
                                >
                                  <v-menu location="bottom">
                                    <template #activator="{ props }">
                                      <v-btn
                                        v-bind="props"
                                        icon
                                        flat
                                        size="small"
                                        class="border"
                                      >
                                        <v-icon>mdi-dots-vertical</v-icon>
                                      </v-btn>
                                    </template>

                                    <v-list>
                                      <v-list-item
                                        :to="{
                                          name: 'routes-patrol-logs-id-route-view',
                                          params: { id: item.raw._id },
                                        }"
                                      >
                                        <v-list-item-title class="text-caption"
                                          >View</v-list-item-title
                                        >
                                      </v-list-item>

                                      <v-list-item
                                        v-if="
                                          $ability.can(
                                            'create',
                                            'attach-incident-virtual-patrol',
                                          )
                                        "
                                        @click="attachIrModal(item.raw)"
                                      >
                                        <v-list-item-title class="text-caption">
                                          {{
                                            item.raw.irAttachment?.reportId
                                              ? "Update Incident Report"
                                              : "Attach Incident Report"
                                          }}
                                        </v-list-item-title>
                                      </v-list-item>

                                      <v-list-item
                                        @click="
                                          showDeleteConfirmation(
                                            item.raw,
                                            itemIndex,
                                          )
                                        "
                                      >
                                        <v-list-item-title class="text-caption">
                                          Delete
                                        </v-list-item-title>
                                      </v-list-item>
                                    </v-list>
                                  </v-menu>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-list-item-title>
                        </v-list-item>
                        <v-divider
                          v-if="
                            itemIndex + 1 !== items.length &&
                            $vuetify.display.lgAndUp
                          "
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
                            You don't have any patrol log yet.
                          </span>
                        </v-row>
                      </v-col>
                    </v-row>
                  </template>
                </v-data-iterator>
              </v-col>

              <v-divider></v-divider>

              <v-col cols="12" class="pa-4">
                <v-row no-gutters justify="end" align-content="center">
                  <span>{{ patrolLogsPageRange }}</span>
                  <v-btn
                    density="compact"
                    variant="text"
                    icon
                    class="mx-2"
                    :disabled="patrolLogsPage === 1"
                    @click="patrolLogsPage--, onUpdateSelectedPage()"
                  >
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>

                  <v-btn
                    density="compact"
                    variant="text"
                    icon
                    class="mx-2"
                    :disabled="patrolLogsPage >= patrolLogsPages"
                    @click="patrolLogsPage++, onUpdateSelectedPage()"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
          </v-tabs-window-item>

          <!-- Patrol Log Emails Tab -->
          <v-tabs-window-item value="patrol-log-email">
            <v-row no-gutters>
              <v-col cols="12">
                <v-data-iterator
                  :items="patrolLogEmailList"
                  :items-per-page="patrolLogsEmailItemsPerPage"
                >
                  <template v-slot:header>
                    <v-row no-gutters class="pa-4" justify="space-between">
                      <v-col cols="12" sm="12">
                        <v-row align="center">
                          <v-col cols="12" sm="12" md="4">
                            <v-text-field
                              v-model="search"
                              placeholder="Search"
                              hide-details
                              density="compact"
                              append-inner-icon="mdi-magnify"
                              @update:modelValue="onSearch"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            :sm="currentUser?.type == 'admin' ? 6 : 6"
                            v-if="currentUser?.type == 'admin'"
                          >
                            <v-select
                              v-model="filterOrganization"
                              :items="organizations"
                              item-title="name"
                              item-value="_id"
                              hide-details
                              density="compact"
                              menu-icon="mdi-chevron-down"
                            >
                            </v-select>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="6"
                            :class="{ 'mb-5': $vuetify.display.smAndDown }"
                            v-if="
                              currentUser?.type == 'admin' ||
                              currentUser?.type == 'organization'
                            "
                          >
                            <v-select
                              v-model="filterSite"
                              :items="sites"
                              :disabled="!sites.length"
                              item-title="name"
                              item-value="_id"
                              hide-details
                              density="compact"
                              menu-icon="mdi-chevron-down"
                            >
                              <template v-slot:append>
                                <v-btn
                                  color="blue-darken-3"
                                  block
                                  variant="flat"
                                  size="small"
                                  style="
                                    height: 40px;
                                    border-radius: 0 5px 5px 0;
                                    left: -20px !important;
                                  "
                                  @click="updateFilter()"
                                >
                                  View
                                </v-btn>
                              </template>
                            </v-select>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <v-divider></v-divider>

                    <v-list
                      class="pa-0"
                      density="compact"
                      v-if="$vuetify.display.smAndUp"
                    >
                      <v-list-item>
                        <v-list-item-title>
                          <v-row no-gutters align="center" class="px-2 px-sm-6">
                            <v-col cols="12" sm="4" md="2" lg="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="start"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Route
                                  <span v-if="$vuetify.display.sm">/ CCTV</span>
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              lg="1"
                              v-if="$vuetify.display.lgAndUp"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  CCTV
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" sm="4" md="3" lg="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Submitted By
                                </span>
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold w-100"
                                  v-if="$vuetify.display.sm"
                                >
                                  / Sent Date
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              md="2"
                              lg="2"
                              v-if="$vuetify.display.mdAndUp"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Sent Date
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" sm="3" md="2" lg="2" class="ml-2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Status
                                  <span v-if="$vuetify.display.sm">/ IR</span>
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="4"
                              md="1"
                              lg="1"
                              v-if="$vuetify.display.mdAndUp"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="end"
                                :justify="
                                  $vuetify.display.lgAndUp ? 'center' : 'end'
                                "
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  IR
                                </span>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                    <v-divider />
                  </template>

                  <template #default="{ items }">
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="itemIndex"
                      >
                        <v-list-item class="py-2">
                          <v-list-item-title
                            :class="
                              $vuetify.display.smAndDown || $vuetify.display.md
                                ? 'py-2 border-md px-4 px-sm-2 rounded-lg mb-2 mx-0 my-0'
                                : 'py-1 px-0 px-lg-4 mx-2 my-0 text-body-2'
                            "
                          >
                            <v-row no-gutters align="center">
                              <v-col
                                cols="12"
                                sm="4"
                                md="2"
                                lg="3"
                                :class="`text ${
                                  $vuetify.display.mdAndUp ? 'my-1' : 'mb-1'
                                }`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none"
                                    >Route:
                                  </span>
                                  <span
                                    class="d-flex text-truncate text-capitalize align-center mr-sm-2 text-truncate"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-icon
                                      size="x-small"
                                      class="mx-2 pa-3"
                                      style="
                                        background: #1976d2;
                                        border-radius: 25px;
                                        color: #ffffff;
                                      "
                                      >mdi-cctv</v-icon
                                    >
                                    <span
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      {{
                                        item.raw.routeName
                                          ? item.raw.routeName
                                          : "Error"
                                      }}
                                    </span>
                                  </span>
                                  <span
                                    class="d-inline-block text-truncate text-capitalize w-100 pl-1 mt-1"
                                    v-if="
                                      $vuetify.display.sm || $vuetify.display.md
                                    "
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-icon
                                      size="x-small"
                                      class="mx-1 pa-3"
                                      style="
                                        background: #1976d2;
                                        border-radius: 25px;
                                        color: #ffffff;
                                      "
                                      >mdi-cctv</v-icon
                                    >
                                    {{ item.raw.count }}
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                cols="12"
                                lg="1"
                                :class="`text ${
                                  $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                }`"
                                v-if="
                                  $vuetify.display.xs ||
                                  $vuetify.display.lgAndUp
                                "
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none"
                                    >CCTV:
                                  </span>
                                  <span
                                    class="d-inline-block text-truncate text-capitalize ml-sm-2 ml-lg-0"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-icon
                                      size="x-small"
                                      class="mx-1 pa-3"
                                      style="
                                        background: #1976d2;
                                        border-radius: 25px;
                                        color: #ffffff;
                                      "
                                      >mdi-cctv</v-icon
                                    >
                                    {{ item.raw.count }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="4"
                                md="3"
                                lg="2"
                                :class="`text ${
                                  $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                }`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none"
                                    >Submitted by:
                                  </span>
                                  <span
                                    class="d-inline-block text-truncate text-capitalize mt-sm-2 ml-sm-2 ml-lg-0"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-avatar
                                      size="x-small"
                                      :color="materialColors[itemIndex]"
                                      class="mr-2 pa-2"
                                    >
                                      {{
                                        getInitial(
                                          `${item.raw.assigneeName ? item.raw.assigneeName.givenName + " " + item.raw.assigneeName.surname : ""}`,
                                        ).slice(0, 2)
                                      }}
                                    </v-avatar>
                                    <span
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      {{
                                        `${item.raw.assigneeName ? item.raw.assigneeName.givenName + " " + item.raw.assigneeName.surname : ""}`
                                      }}
                                    </span>
                                  </span>
                                  <span
                                    class="d-flex align-center text-truncate text-capitalize w-100 pl-2 mt-1"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                    v-if="$vuetify.display.sm"
                                  >
                                    <v-icon class="mr-1"
                                      >mdi-calendar-month-outline</v-icon
                                    >
                                    <span
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      {{
                                        standardFormatDateTime(
                                          item.raw.patrolLogEmail.lastSent
                                            ? item.raw.patrolLogEmail.lastSent
                                            : item.raw.patrolLogEmail.dateSent,
                                        )
                                      }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                cols="12"
                                md="2"
                                lg="2"
                                :class="`text ${
                                  $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                }`"
                                v-if="
                                  $vuetify.display.xs ||
                                  $vuetify.display.mdAndUp
                                "
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none"
                                    >Sent Date:
                                  </span>

                                  <span
                                    class="d-flex align-center text-truncate text-capitalize mr-2"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: 1rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.xs ? '' : 'text-body-2'
                                    "
                                  >
                                    <v-icon class="mr-1"
                                      >mdi-calendar-month-outline</v-icon
                                    >
                                    <span
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      {{
                                        standardFormatDateTime(
                                          item.raw.patrolLogEmail.lastSent
                                            ? item.raw.patrolLogEmail.lastSent
                                            : item.raw.patrolLogEmail.dateSent,
                                        )
                                      }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="3"
                                md="2"
                                lg="2"
                                :class="`text ${
                                  $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                }`"
                              >
                                <v-row
                                  no-gutters
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none"
                                    >Status:
                                  </span>
                                  <v-chip
                                    :color="getStatusColor(item.raw.status)"
                                    class="text-body-2 text-capitalize"
                                  >
                                    <v-icon class="mr-2">
                                      {{ getStatusIcon(item.raw.status) }}
                                    </v-icon>
                                    <span>
                                      {{ getStatusText(item.raw.status) }}
                                    </span>
                                  </v-chip>
                                  <span
                                    class="w-100 mt-1"
                                    v-if="$vuetify.display.sm"
                                  >
                                    <span
                                      :class="[
                                        'fill-height pl-2',
                                        item.raw &&
                                        item.raw?.irAttachment?.reportId
                                          ? 'hover-effect '
                                          : '',
                                      ]"
                                      v-if="
                                        item.raw &&
                                        item.raw?.irAttachment?.reportId
                                      "
                                      class="text-red"
                                      @click="
                                        navigateToIncidentReport(
                                          item.raw.irAttachment?._id,
                                          item.raw._id,
                                          false,
                                        )
                                      "
                                    >
                                      <v-icon class="mr-1"
                                        >mdi-folder-alert</v-icon
                                      >
                                      {{ item.raw?.irAttachment?.reportId }}
                                    </span>
                                    <span
                                      v-else
                                      class="text-red text-body-2 pl-1"
                                      >N/A</span
                                    >
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="2"
                                md="2"
                                lg="1"
                                :class="`text ${
                                  $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                }`"
                                v-if="
                                  $vuetify.display.xs ||
                                  $vuetify.display.mdAndUp
                                "
                              >
                                <v-row
                                  no-gutters
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'center'
                                  "
                                >
                                  <span class="mr-2 d-flex d-sm-none"
                                    >IR Attachment:
                                  </span>
                                  <v-btn
                                    icon
                                    variant="text"
                                    width="80"
                                    v-if="
                                      item.raw &&
                                      item.raw?.irAttachment?.reportId
                                    "
                                    class="text-red"
                                    :loading="isDownloadingPdf === item.raw._id"
                                    :disabled="
                                      isDownloadingPdf !== '' &&
                                      isDownloadingPdf !== item.raw._id
                                    "
                                    @click="
                                      navigateToIncidentReport(
                                        item.raw.irAttachment?._id,
                                        item.raw._id,
                                        $vuetify.display.smAndDown,
                                      )
                                    "
                                  >
                                    <v-icon class="mr-1"
                                      >mdi-folder-alert</v-icon
                                    >
                                    {{ item.raw?.irAttachment?.reportId }}
                                  </v-btn>
                                  <span v-else class="text-red text-body-2"
                                    >N/A</span
                                  >
                                </v-row>
                              </v-col>

                              <v-col cols="12" sm="1">
                                <v-row
                                  no-gutters
                                  :justify="
                                    $vuetify.display.xs ? 'end' : 'center'
                                  "
                                >
                                  <v-menu location="bottom">
                                    <template #activator="{ props }">
                                      <v-btn
                                        v-bind="props"
                                        icon
                                        flat
                                        size="small"
                                        class="border"
                                      >
                                        <v-icon>mdi-dots-vertical</v-icon>
                                      </v-btn>
                                    </template>

                                    <v-btn
                                      block
                                      :to="{
                                        name: 'routes-patrol-logs-id-route-email-view',
                                        params: { id: item.raw._id },
                                      }"
                                    >
                                      View
                                    </v-btn>
                                  </v-menu>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-list-item-title>
                        </v-list-item>
                        <v-divider
                          v-if="
                            itemIndex + 1 !== items.length &&
                            $vuetify.display.lgAndUp
                          "
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
                            You don't have any patrol log emails yet.
                          </span>
                        </v-row>
                      </v-col>
                    </v-row>
                  </template>
                </v-data-iterator>
              </v-col>

              <v-divider></v-divider>

              <v-col cols="12" class="pa-4">
                <v-row no-gutters justify="end" align-content="center">
                  <span>{{ patrolLogsEmailPageRange }}</span>
                  <v-btn
                    density="compact"
                    variant="text"
                    icon
                    class="mx-2"
                    :disabled="patrolLogsEmailPage === 1"
                    @click="patrolLogsEmailPage--, onUpdateSelectedPage()"
                  >
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>

                  <v-btn
                    density="compact"
                    variant="text"
                    icon
                    class="mx-2"
                    :disabled="patrolLogsEmailPage >= patrolLogsEmailPages"
                    @click="patrolLogsEmailPage++, onUpdateSelectedPage()"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
    </v-col>

    <RoutesAddRoute></RoutesAddRoute>
    <!-- <RoutesSpecificPatrolLog/> -->
    <RoutesViewIncidents
      :isConfirmModal="isAttachIncident"
      @view-ir="viewIr($event)"
      @submit-data="attachIR($event)"
      @close-modal="isAttachIncident = false"
    />

    <v-dialog
      v-model="deletePatrolDialog"
      transition="dialog-top-transition"
      max-width="500"
    >
      <v-card :loading="deletePatrolLoading">
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="orange"
            height="8"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-card-text class="pb-3">
          <v-row>
            <v-col cols="12" align="center" class="pt-0">
              <v-img
                src="/images/confirmation.svg"
                width="130px"
                height="130px"
              ></v-img>
            </v-col>

            <v-col cols="12" class="text-center pt-0">
              Are you sure you want to delete this patrol log?
            </v-col>
            <v-col cols="6">
              <v-btn
                size="small"
                color="green"
                block
                @click="onDeletePatrolLog()"
                :disabled="deletePatrolLoading"
                >Yes</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-btn
                size="small"
                color="red"
                block
                @click="hideDeleteConfirmation()"
                :disabled="deletePatrolLoading"
                >No</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import jsPDF from "jspdf";
import debounce from "lodash/debounce";

definePageMeta({
  middleware: "secure",
});

const { setSnackbar } = useLocal();
const { getInitial, materialColors, standardFormatDateTime, validEmail } =
  useUtils();
const { organizations } = useOrganization();
const { sites, setSites } = useSite();
const { currentUser } = useLocalAuth();
const { isTableLoading } = useIncident();
const {
  isVPatrolLoading,
  getPatrolLogListByRoute,
  getPatrolLogEmailList,

  currentPatrolLog,
  specificPatrolLogDialog,
  incidentReports,
  updateSpecificVPatrol,
  patrolLogsPage,
  patrolLogsEmailPage,
  patrolLogsItemsPerPage,
  patrolLogsEmailItemsPerPage,
  patrolLogList,
  patrolLogEmailList,
  patrolLogsPages,
  patrolLogsEmailPages,
  patrolLogsPageRange,
  patrolLogsEmailPageRange,
  isSendingEmail,
  sendPatrolLogs,
  generatePatrolLogReport,
  useGenerateAllReportsViaDateRange,
  deleteSelectedPatrolLog,
} = useVirtualPatrol();
const { mySite, filterSite, filterOrganization } = useFilter();
const { getAllIncidents } = useIncident();
const { standardFormatDateYearMonthDay } = useUtils();
const { setOnGoingPatrol } = usePatrolLog();

const downloadReportDialog = ref(false);
const typeOfReport = ref<"daily" | "monthly">("daily");
const specificDate = ref<string | Date>("");
const specificMonth = ref("");

const fileType = ref("");
const isDownloadingReport = ref(false);
const isDownloadingRangeReport = ref(false);
const startDateDialog = ref(false);
const startDate = ref<Date | null>(null);
const locale = "en";
const filters = ref({
  from: "",
});
const isAttachIncident = ref(false);

function onOpenDownloadReportDialog(timeFrame: "daily" | "monthly") {
  downloadReportDialog.value = true;
  typeOfReport.value = timeFrame;
}

function onCloseDownloadReportDialog() {
  downloadReportDialog.value = false;
  specificDate.value = "";
  specificMonth.value = "";
  typeOfReport.value = "daily";
}

function attachIrModal(data: any) {
  currentPatrolLog.value = data;
  isAttachIncident.value = true;
}

const attachIR = async (data: any) => {
  isTableLoading.value = true;
  const item = await updateSpecificVPatrol({
    _id: currentPatrolLog.value._id,
    irId: data._id,
  });

  getPatrolLogListByRoute({
    page: patrolLogsPage.value,
    limit: patrolLogsItemsPerPage.value,
    site: mySite.value,
  }).then((res) => {
    patrolLogList.value = res.items;
    patrolLogsPages.value = res.pages;
    patrolLogsPageRange.value = res.pageRange;
  });
  isTableLoading.value = false;
  isAttachIncident.value = false;
};

const updateStartDate = (date: Date | null) => {
  startDate.value = date;
};

const applyStartDate = () => {
  if (startDate.value) {
    filters.value.from = standardFormatDateYearMonthDay(startDate.value);
  } else {
    filters.value.from = "";
  }
  startDateDialog.value = false;
  onFilterTable();
};
watch(startDate, (newVal: boolean) => {
  if (newVal) {
    applyStartDate();
  }
});
watch(() => filters.value.from, onFilterTable);

const shareContent = (selectedLog: any) => {
  const routeName = selectedLog.routeName || "Unknown Route";
  const cctvList = selectedLog.count || 0;
  const submittedBy = `${selectedLog.assigneeName?.givenName || "Unknown"} ${selectedLog.assigneeName?.surname || ""}`;
  const dateCreated = standardFormatDateTime(selectedLog.createdAt);
  const incidentReportId =
    selectedLog.irAttachment?.reportId || "No Incident Report";
  const incidentId = selectedLog.irAttachment?._id;
  const siteId = selectedLog.site;
  const rootUrl = window.location.origin;
  const incidentsPath = "/incidents";
  const incidentReportUrl = `${rootUrl}${incidentsPath}/${incidentId}?site=${siteId}`;

  const doc = new jsPDF();
  doc.text("Patrol Log Report", 10, 10);

  doc.text(`Route Name: ${routeName}`, 10, 20);
  doc.text(`CCTV: ${cctvList}`, 10, 30);
  doc.text(`Submitted By: ${submittedBy}`, 10, 40);
  doc.text(`Date Created: ${dateCreated}`, 10, 50);
  doc.text(`Incident Report ID: ${incidentReportId}`, 10, 60);

  if (incidentReportUrl) {
    doc.setTextColor(0, 0, 255);
    doc.textWithLink("View Incident Report", 10, 70, {
      url: incidentReportUrl,
    });
    const textWidth = doc.getTextWidth("View Incident Report");
    doc.line(10, 72, 10 + textWidth, 72);
  } else {
    doc.text("No Incident Report Available", 10, 70);
  }

  const pdfBlob = doc.output("blob");

  const pdfFile = new File([pdfBlob], "patrol-log-report.pdf", {
    type: "application/pdf",
    lastModified: new Date().getTime(),
  });

  if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    navigator
      .share({
        files: [pdfFile],
        title: "Patrol Log Report",
        text: `Here is the patrol log report for Route: ${routeName}`,
      })
      .then(() =>
        setSnackbar({
          text: "PDF shared successfully",
          modal: true,
          type: "success",
        }),
      )
      .catch((error) =>
        setSnackbar({
          text: "Sharing the PDF failed.",
          modal: true,
          type: "error",
        }),
      );
  } else {
    setSnackbar({
      text: "Sharing PDF is not supported on this browser.",
      modal: true,
      type: "error",
    });
  }
};

const search = ref("");
const routeList = ref<
  { _id: string | undefined; name: string | undefined; selected: boolean }[]
>([]);
const cctvList = ref<
  { _id: string | undefined; name: string | undefined; selected: boolean }[]
>([]);
const assigneeList = ref<
  { _id: string | undefined; name: string | undefined; selected: boolean }[]
>([]);

const checkedPatrolLogs = ref([]);
const searchIr = ref("");

const emailList = ref([]);
const emailSubject = ref("");
const emailMessage = ref("");
const isSendPatrolOpen = ref(false);
const isErrorEmailMessage = ref(false);
const errorEmailMessage = ref("");
const tab = ref("patrol-log");
const selectReportRangeDialog = ref(false);
const dateFrom = ref("");
const dateTo = ref("");

const { downloadDobPdf } = useIncident();
const isDownloadingPdf = ref("");

function resetDateTo() {
  if (
    dateTo.value &&
    new Date(dateTo.value).getTime() < new Date(dateFrom.value).getTime()
  ) {
    dateTo.value = "";
  }
}

function onCloseSelectRangeDialog() {
  selectReportRangeDialog.value = false;
  dateFrom.value = "";
  dateTo.value = "";
  fileType.value = "";
}

const routeIds = computed(() => {
  return routeList.value
    .map((find: any) => {
      return find.selected && find._id;
    })
    .filter((id: string) => id);
});

const cctvIds = computed(() => {
  return cctvList.value
    .map((find: any) => {
      return find.selected && find._id;
    })
    .filter((id: string) => id);
});

const assigneeIds = computed(() => {
  return assigneeList.value
    .map((find: any) => {
      return find.selected && find._id;
    })
    .filter((id: string) => id);
});

watch(
  patrolLogList,
  () => {
    onUpdateFilters();
  },
  { deep: true },
);

watch(
  filterOrganization,
  (newValue: any) => {
    setSites(newValue);
  },
  { deep: true },
);

onMounted(async () => {
  await Promise.all([
    await getPatrolLogListByRoute({
      page: patrolLogsPage.value,
      limit: patrolLogsItemsPerPage.value,
      site: mySite.value,
      assignees: /^(service-provider-member)$/i.test(currentUser.value.type)
        ? currentUser.value._id
        : assigneeIds.value.length != assigneeList.value.length
          ? assigneeIds.value.toString()
          : "",
    }).then((res) => {
      patrolLogList.value = res.items;
      patrolLogsPages.value = res.pages;
      patrolLogsPageRange.value = res.pageRange;

      onUpdateFilters();
    }),
    await getPatrolLogEmailList({
      page: patrolLogsEmailPage.value,
      limit: patrolLogsEmailItemsPerPage.value,
      site: mySite.value,
      assignees: /^(service-provider-member)$/i.test(currentUser.value.type)
        ? currentUser.value._id
        : assigneeIds.value.length != assigneeList.value.length
          ? assigneeIds.value.toString()
          : "",
    }).then((res) => {
      patrolLogEmailList.value = res.items;
      patrolLogsEmailPages.value = res.pages;
      patrolLogsEmailPageRange.value = res.pageRange;
    }),
  ]);
  await getIncidents(mySite.value, searchIr.value);

  const isPatrolling = await setOnGoingPatrol({ site: mySite.value });

  if (isPatrolling.length > 0) {
    setSnackbar({
      text: "Virtual Patrolling is currently ongoing.",
      type: "info",
      modal: true,
    });
  }
});

onUnmounted(() => {
  filterSite.value = "";
});

function onSearch(val: string) {
  debouncedSearch(val);
}
const debouncedSearch = debounce(async (value: string) => {
  if (tab.value === "patrol-log") {
    getPatrolLogListByRoute({
      page: value ? 1 : patrolLogsPage.value,
      limit: patrolLogsItemsPerPage.value,
      site: mySite.value,
      date: filters.value.from,
      search: value,
    }).then((res) => {
      patrolLogList.value = res.items;
      patrolLogsPages.value = res.pages;
      patrolLogsPageRange.value = res.pageRange;
    });
  } else {
    getPatrolLogEmailList({
      page: value ? 1 : patrolLogsEmailPage.value,
      limit: patrolLogsEmailItemsPerPage.value,
      site: mySite.value,
      search: value,
    }).then((res) => {
      patrolLogEmailList.value = res.items;
      patrolLogsEmailPages.value = res.pages;
      patrolLogsEmailPageRange.value = res.pageRange;
    });
  }
}, 500);

async function getIncidents(site: string, search: string) {
  const allIncidents = await getAllIncidents({
    site: site,
    search: search,
  });

  incidentReports.value = allIncidents.value;
}

function onCloseSendEmailDialog() {
  isSendPatrolOpen.value = false;
  isErrorEmailMessage.value = false;
  errorEmailMessage.value = "";

  emailSubject.value = "";
  emailMessage.value = "";
  emailList.value = [];
}

async function onSendPatrolLogs({
  subject,
  emails,
  items,
  site,
  organization,
}: {
  subject: string;
  emails: string[];
  items: string[];
  site: string;
  organization?: string;
}) {
  if (!emails.length) {
    isErrorEmailMessage.value = true;
    errorEmailMessage.value = "Email recipient is required.";
    return;
  }

  if (!subject) {
    isErrorEmailMessage.value = true;
    errorEmailMessage.value = "Subject is required.";
    return;
  }

  if (!items.length) {
    isErrorEmailMessage.value = true;
    errorEmailMessage.value = "Must check atleast one patrol log.";
    return;
  }

  isErrorEmailMessage.value = false;
  errorEmailMessage.value = "";

  isSendingEmail.value = true;
  const sendAction: any = await sendPatrolLogs({
    subject: subject,
    emails: emails,
    items: items,
    site: site,
  });

  if (sendAction && sendAction.status === "success") {
    checkedPatrolLogs.value = [];

    isSendingEmail.value = false;

    await getPatrolLogEmailList({
      page: patrolLogsEmailPage.value,
      limit: patrolLogsEmailItemsPerPage.value,
      site: mySite.value,
    }).then((res) => {
      patrolLogEmailList.value = res.items;
      patrolLogsEmailPages.value = res.pages;
      patrolLogsEmailPageRange.value = res.pageRange;
    });

    onCloseSendEmailDialog();

    return setSnackbar({
      text: "Patrol log has been successfully sent to specific email.",
      modal: true,
      type: sendAction.status,
    });
  } else {
    isSendingEmail.value = false;
    return setSnackbar({
      text: "Failed to send patrol log to specific email.",
      modal: true,
      type: "error",
    });
  }
}

const navigateToIncidentReport = async (
  irId: string,
  id: any,
  isMobile: boolean,
) => {
  const incidentsPath = "incidents";

  if (isMobile) {
    isDownloadingPdf.value = id;
    const url = `/incidents/${irId}/download`;

    try {
      await downloadDobPdf(url);
      setSnackbar({
        text: "Incident Report downloaded successfully.",
        type: "success",
        modal: true,
      });
      isDownloadingPdf.value = "";
    } catch (err: any) {
      isDownloadingPdf.value = "";
      setSnackbar({
        text: `${err.message || err}`,
        type: "error",
        modal: true,
      });
    }

    return;
  }

  const url = `${useRuntimeConfig().public.SERVICE_ACCOUNT}${incidentsPath}/${irId}/download?site=${mySite.value}`;
  window.open(url, "_blank");
};

async function updateFilter() {
  await onFilterTable();
  onUpdateFilters();
}

async function onFilterTable() {
  getPatrolLogListByRoute({
    page: patrolLogsPage.value,
    limit: patrolLogsItemsPerPage.value,
    site: mySite.value,
    date: filters.value.from,

    routeIds:
      routeIds.value.length != routeList.value.length
        ? routeIds.value.toString()
        : "",
    assignees:
      assigneeIds.value.length != assigneeList.value.length
        ? assigneeIds.value.toString()
        : "",
  }).then((res) => {
    patrolLogList.value = res.items;
    patrolLogsPages.value = res.pages;
    patrolLogsPageRange.value = res.pageRange;
  });
}

async function onUpdateSelectedPage() {
  if (tab.value === "patrol-log") {
    getPatrolLogListByRoute({
      page: patrolLogsPage.value,
      limit: patrolLogsItemsPerPage.value,
      site: mySite.value,
      date: filters.value.from,

      routeId:
        routeIds.value.length != routeList.value.length
          ? routeIds.value.toString()
          : "",
      cctvId:
        cctvIds.value.length != cctvList.value.length
          ? cctvIds.value.toString()
          : "",
      assignee:
        assigneeIds.value.length != assigneeList.value.length
          ? assigneeIds.value.toString()
          : "",
    }).then((res) => {
      patrolLogList.value = res.items;
      patrolLogsPages.value = res.pages;
      patrolLogsPageRange.value = res.pageRange;
    });
  } else {
    getPatrolLogEmailList({
      page: patrolLogsEmailPage.value,
      limit: patrolLogsEmailItemsPerPage.value,
      site: mySite.value,
    }).then((res) => {
      patrolLogEmailList.value = res.items;
      patrolLogsEmailPages.value = res.pages;
      patrolLogsEmailPageRange.value = res.pageRange;
    });
  }
}

async function onUpdateFilters() {
  // FILTER ROUTE LIST
  const removeDuplicateRouteName = new Map(
    patrolLogList.value
      .filter(
        (item: { route?: { routeName?: string } }) => item.route?.routeName,
      )
      .map((item: { routeId?: string; route?: { routeName?: string } }) => [
        item.route?.routeName,
        item,
      ]),
  );
  const getRouteName = [...removeDuplicateRouteName.values()].map(
    (item: { routeId?: string; route?: { routeName?: string } }) => ({
      _id: item.routeId,
      name: item.route?.routeName,
      selected: true,
    }),
  );
  routeList.value = getRouteName;

  // FILTER ASSIGNEE LIST
  const removeDuplicateAssignee = new Map(
    patrolLogList.value
      .filter(
        (item: { assigneeName?: { givenName?: string } }) =>
          item.assigneeName?.givenName,
      )
      .map(
        (item: {
          assignee?: string;
          assigneeName?: { givenName?: string };
        }) => [item.assigneeName?.givenName, item],
      ),
  );
  const getAssignee = [...removeDuplicateAssignee.values()].map(
    (item: { assignee?: string; assigneeName?: { givenName?: string } }) => ({
      _id: item.assignee,
      name: item.assigneeName?.givenName,
      selected: true,
    }),
  );
  assigneeList.value = getAssignee;
}

async function onDownloadPatrolLogPdf({
  timeFrame,
  monthAndYear = "",
  date = "",
  site,
  organization,
}: {
  timeFrame: "daily" | "monthly";
  monthAndYear?: Date | string;
  date?: Date | string;
  site: string;
  organization?: string;
}) {
  isDownloadingReport.value = true;
  await generatePatrolLogReport({
    timeFrame,
    monthAndYear,
    date,
    site,
    organization,
  });

  isDownloadingReport.value = false;
  onCloseDownloadReportDialog();
}

async function onDownloadAllPdf() {
  selectReportRangeDialog.value = true;
}

async function onDownloadRangeReports({
  fileType,
  dateFrom,
  dateTo,
  site,
  organization,
}: {
  fileType: "csv" | "pdf";
  dateFrom: Date | string;
  dateTo: Date | string;
  site: string;
  organization?: string;
}) {
  try {
    isDownloadingRangeReport.value = true;
    const form = {
      fileType,
      dateFrom,
      dateTo,
      site,
      organization,
    };
    await useGenerateAllReportsViaDateRange(form);
    selectReportRangeDialog.value = false;
  } catch (error: any) {
    setSnackbar({ text: error.message || error, modal: true, type: "error" });
  } finally {
    isDownloadingRangeReport.value = false;
  }
}

function formatDate(date: Date | string): string {
  const customDate = new Date(date);
  const year = customDate.getFullYear();
  const month = (customDate.getMonth() + 1).toString().padStart(2, "0");
  const day = customDate.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentMonthAndYear(date: Date | string): string {
  const monthAndYear = new Date(date);
  const month = (monthAndYear.getMonth() + 1).toString().padStart(2, "0");
  const year = monthAndYear.getFullYear();

  return `${month}-${year}`;
}

const sampleItems: any = ref(Array.from({ length: 30 }, (k, v) => v + 1));

async function api() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        Array.from({ length: 10 }, (k, v) => v + sampleItems.value.at(-1) + 1),
      );
    }, 1000);
  });
}
async function load({ done }: any) {
  // Perform API call
  const res: any = await api();

  sampleItems.value.push(...res);

  done("ok");
}

const getStatusColor = (status: string) => {
  return status === "pending"
    ? "orange"
    : status === "success"
      ? "green"
      : "red";
};

const getStatusText = (status: string) => {
  return status === "success"
    ? "sent"
    : status === "pending"
      ? "pending"
      : "failed";
};

const getStatusIcon = (status: string) => {
  return status === "pending"
    ? "mdi-clock-outline"
    : status === "success"
      ? "mdi-check-circle-outline"
      : "mdi-alert-circle-outline";
};

const deletePatrolDialog = ref(false);
const deletePatrolLoading = ref(false);

const selectedPatrolLog = ref({
  index: -1,
  data: {},
});

async function hideDeleteConfirmation() {
  selectedPatrolLog.value = {
    index: -1,
    data: {},
  };

  deletePatrolDialog.value = false;
}
async function showDeleteConfirmation(data: any, index: number) {
  selectedPatrolLog.value = {
    index: index,
    data: data,
  };

  deletePatrolDialog.value = true;
}

async function onDeletePatrolLog() {
  deletePatrolLoading.value = true;

  try {
    const result = await deleteSelectedPatrolLog(
      selectedPatrolLog.value.data._id,
    );

    deletePatrolDialog.value = false;
    deletePatrolLoading.value = false;
    setSnackbar({
      text: result?.message?.message,
      modal: true,
      type: "success",
    });

    patrolLogList.value.splice(selectedPatrolLog.value.index, 1);
  } catch (err) {
    deletePatrolLoading.value = false;
    setSnackbar({
      text: err,
      modal: true,
      type: "error",
    });
  }
}
</script>

<style scoped>
.text {
  text-align: start;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}

.rows-per-page :deep() .v-field__outline {
  --v-field-border-width: 0;
  --v-field-border-opacity: 0;
  border-bottom: 0.1px solid;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  width: 50px;
  margin-left: 16px;
}

:deep() .v-text-field input {
  font-size: 13px !important;
}

.hover-effect:hover {
  text-decoration: underline;
  cursor: pointer;
  color: rgb(52, 133, 255);
}

:deep() .v-slide-group__content {
  border-bottom: 2px grey solid;
}
</style>
