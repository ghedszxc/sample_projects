<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="isFacilityBookingsLoaded"
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
                  :items="facilityBookings"
                  :items-per-page="itemsPerPage"
                >
                  <!-- header -->
                  <template v-slot:header>
                    <v-row no-gutters class="pa-4" align="center">
                      <v-col cols="12" md="6">
                        <v-row align="center">
                          <v-col cols="12" sm="12" lg="12">
                            <v-btn
                              fav
                              density="compact"
                              icon="mdi-arrow-left"
                              variant="text"
                              @click="useRouter().push('/facilities')"
                            />
                            <span class="font-weight-bold text-h6">
                              Facility Bookings
                            </span>
                          </v-col>

                          <v-col cols="12" lg="12" class="d-flex ga-1">
                            <v-text-field
                              v-model="search"
                              placeholder="Search facility"
                              hide-details
                              density="compact"
                              append-inner-icon="mdi-magnify"
                              :class="$vuetify.display.mdAndUp ? 'mr-3' : ''"
                              clearable
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col cols="12" md="6" class="mt-lg-14">
                        <v-row class="justify-end">
                          <!-- export csv or pdf -->
                          <v-col
                            cols="12"
                            lg="4"
                            md="7"
                            sm="4"
                            :class="{ 'mt-5': $vuetify.display.smAndDown }"
                          >
                            <v-menu location="bottom" width="135">
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  color="primary"
                                  block
                                  append-icon="mdi-tray-arrow-up"
                                  :loading="isExportingCsv || isExportingPdf"
                                  :disabled="!facilityBookings.length"
                                >
                                  export
                                </v-btn>
                              </template>

                              <v-card rounded="lg" class="mt-3">
                                <v-list density="compact" class="pa-0">
                                  <!-- as csv -->
                                  <v-list-item
                                    style="
                                      font-size: 14px;
                                      font-style: normal;
                                      font-weight: 400;
                                      line-height: 19px;
                                    "
                                    @click="
                                      onExportAsCsv(
                                        `FACILITY BOOKINGS - ${tab.toUpperCase()} - ${filterHistories.from + ' - ' + filterHistories.to}.csv`,
                                      )
                                    "
                                  >
                                    Export as CSV
                                  </v-list-item>
                                  <!-- as pdf -->
                                  <v-list-item
                                    style="
                                      font-size: 14px;
                                      font-style: normal;
                                      font-weight: 400;
                                      line-height: 19px;
                                    "
                                    @click="onExportAsPdf()"
                                  >
                                    Export as PDF
                                  </v-list-item>
                                </v-list>
                              </v-card>
                            </v-menu>
                          </v-col>

                          <!-- from -->
                          <v-col
                            v-if="!isValidObjectId()"
                            cols="12"
                            md="6"
                            lg="3"
                          >
                            <v-text-field
                              v-if="tab !== 'histories'"
                              v-model="filter.from"
                              label="Start Date"
                              readonly
                              hide-details
                              append-inner-icon="mdi-calendar"
                              @click="startDateDialog = true"
                            />
                            <v-text-field
                              v-else
                              v-model="filterHistories.from"
                              label="Start Date"
                              readonly
                              hide-details
                              append-inner-icon="mdi-calendar"
                              @click="startDateDialog = true"
                            />
                            <v-dialog v-model="startDateDialog" max-width="355">
                              <v-card>
                                <v-card-subtitle>
                                  <v-date-picker
                                    v-if="tab !== 'histories'"
                                    width="320"
                                    v-model="startDate"
                                    @input="updateStartDate"
                                    :locale="locale"
                                    @change="applyStartDate"
                                  />
                                  <v-date-picker
                                    v-else
                                    width="320"
                                    v-model="startDateHistories"
                                    @input="updateStartDateHistories"
                                    :locale="locale"
                                    @change="applyStartDateHistories"
                                  />
                                </v-card-subtitle>
                              </v-card>
                            </v-dialog>
                          </v-col>

                          <v-col
                            cols="12"
                            md="1"
                            class="text-subtitle-1 font-weight-medium"
                            v-if="
                              $vuetify.display.mdAndUp && !isValidObjectId()
                            "
                          >
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                              justify="center"
                            >
                              to
                            </v-row>
                          </v-col>

                          <!-- to -->
                          <v-col
                            v-if="!isValidObjectId()"
                            md="5"
                            lg="3"
                            class="d-flex"
                          >
                            <v-text-field
                              v-if="tab !== 'histories'"
                              v-model="filter.to"
                              label="End Date"
                              readonly
                              hide-details
                              append-inner-icon="mdi-calendar"
                              @click="endDateDialog = true"
                            />
                            <v-text-field
                              v-else
                              v-model="filterHistories.to"
                              label="End Date"
                              readonly
                              hide-details
                              append-inner-icon="mdi-calendar"
                              @click="endDateDialog = true"
                            />

                            <v-dialog v-model="endDateDialog" max-width="355">
                              <v-card>
                                <v-card-subtitle>
                                  <v-date-picker
                                    v-if="tab !== 'histories'"
                                    width="320"
                                    v-model="endDate"
                                    @input="updateEndDate"
                                    :locale="locale"
                                    @change="applyEndDate"
                                  />
                                  <v-date-picker
                                    v-else
                                    width="320"
                                    v-model="endDateHistories"
                                    @input="updateEndDateHistories"
                                    :locale="locale"
                                    @change="applyEndDateHistories"
                                  />
                                </v-card-subtitle>
                              </v-card>
                            </v-dialog>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <v-divider v-if="$vuetify.display.sm"></v-divider>

                    <!-- tabs -->
                    <v-col cols="12" lg="6">
                      <v-row no-gutters>
                        <v-col
                          cols="4"
                          class="text-center font-weight-bold"
                          @click="tab = 'approved'"
                          style="cursor: pointer; font-size: 16px"
                          :style="
                            tab === 'approved'
                              ? 'border-bottom: 3px solid #0077b6; padding: .5rem; color: #0077b6;'
                              : 'border-bottom: 3px solid gray; padding: .5rem'
                          "
                        >
                          Booked
                        </v-col>
                        <v-col
                          cols="4"
                          class="text-center font-weight-bold"
                          @click="tab = 'pending'"
                          style="cursor: pointer; font-size: 16px"
                          :style="
                            tab === 'pending'
                              ? 'border-bottom: 3px solid #0077b6; padding: .5rem; color: #0077b6;'
                              : 'border-bottom: 3px solid gray; padding: .5rem'
                          "
                        >
                          Pending
                        </v-col>
                        <v-col
                          cols="4"
                          class="text-center font-weight-bold"
                          @click="tab = 'histories'"
                          style="cursor: pointer; font-size: 16px"
                          :style="
                            tab === 'histories'
                              ? 'border-bottom: 3px solid #0077b6; padding: .5rem; color: #0077b6;'
                              : 'border-bottom: 3px solid gray; padding: .5rem'
                          "
                        >
                          Booking History
                        </v-col>
                      </v-row>
                    </v-col>

                    <!-- bulk action buttons -->
                    <v-row
                      v-if="tab !== 'histories' && selectedItems.length > 1"
                      no-gutters
                      class="pa-4"
                    >
                      <v-btn
                        v-if="tab !== 'approved'"
                        flat
                        color="error"
                        class="mr-3"
                        @click="
                          openDialog(null, {
                            text: 'reject',
                            status: 'rejected',
                          })
                        "
                        :disabled="
                          !selectedItems.filter(
                            (item) => item.status == 'pending',
                          ).length
                        "
                      >
                        Bulk Reject
                      </v-btn>

                      <v-btn
                        v-if="tab !== 'pending'"
                        flat
                        color="error"
                        class="mr-3"
                        @click="
                          openDialog(null, {
                            text: 'cancel',
                            status: 'cancelled',
                          })
                        "
                        :disabled="
                          !selectedItems.filter(
                            (item) => item.status == 'approved',
                          ).length
                        "
                      >
                        Bulk Cancel
                      </v-btn>
                    </v-row>

                    <v-row
                      v-if="
                        !$vuetify.display.mdAndUp &&
                        tab !== 'histories' &&
                        facilityBookings.length > 1
                      "
                      no-gutters
                      class="pa-4"
                    >
                      <v-checkbox
                        v-model="selectedItems"
                        label="Select All"
                        value=""
                        @update:modelValue="selectAllBookings"
                      ></v-checkbox>
                    </v-row>

                    <v-list
                      v-if="$vuetify.display.smAndUp"
                      class="pa-0"
                      density="compact"
                    >
                      <v-list-item class="pt-1 px-6">
                        <v-list-item-title>
                          <v-row no-gutters align="center">
                            <v-col v-if="tab !== 'histories'" cols="12" sm="1">
                              <v-icon class="pt-6">
                                <v-checkbox
                                  v-model="selectAll"
                                  @update:modelValue="selectAllBookings"
                                ></v-checkbox>
                              </v-icon>
                            </v-col>

                            <v-col
                              cols="12"
                              lg="2"
                              md="2"
                              sm="4"
                              class="text-capitalize text"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                  style="
                                    word-break: break-word;
                                    white-space: normal;
                                  "
                                >
                                  Created At
                                  <span v-if="$vuetify.display.sm"
                                    >/ Resident</span
                                  >
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              :lg="tab !== 'histories' ? 2 : 3"
                              :md="tab !== 'histories' ? 2 : 3"
                              :sm="tab !== 'histories' ? 2 : 3"
                              class="text-capitalize text"
                              v-if="$vuetify.display.mdAndUp"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Resident Name
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              lg="1"
                              md="2"
                              :sm="tab !== 'histories' ? 3 : 3"
                              class="text my-1"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold mr-2"
                                  style="
                                    word-break: break-word;
                                    white-space: normal;
                                  "
                                >
                                  Booking Date
                                  <span
                                    v-if="
                                      $vuetify.display.sm || $vuetify.display.md
                                    "
                                    >/ Slot</span
                                  >
                                  <span
                                    v-if="
                                      tab !== 'histories' && $vuetify.display.sm
                                    "
                                    >/ Pax</span
                                  >
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              lg="1"
                              class="text my-1"
                              v-if="$vuetify.display.lgAndUp"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold mr-2"
                                  style="
                                    word-break: break-word;
                                    white-space: normal;
                                  "
                                >
                                  Booking Slot
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              lg="1"
                              md="1"
                              sm="2"
                              class="text text-capitalize"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                                :justify="
                                  $vuetify.display.mdAndUp ? 'center' : 'start'
                                "
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                  style="
                                    word-break: break-word;
                                    white-space: normal;
                                  "
                                >
                                  Pax
                                  <span
                                    v-if="
                                      tab !== 'histories' && $vuetify.display.sm
                                    "
                                    >/ Invites</span
                                  >
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              v-if="!$vuetify.display.sm"
                              cols="12"
                              lg="1"
                              md="1"
                              sm="2"
                              class="text text-capitalize"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                  style="
                                    word-break: break-word;
                                    white-space: normal;
                                  "
                                >
                                  Invites
                                </span>
                              </v-row>
                            </v-col>

                            <!-- <v-col
                              cols="12"
                              lg="1"
                              :md="tab !== 'histories' ? 2 : 1"
                              class="text text-capitalize"
                              v-if="
                                $vuetify.display.xs || $vuetify.display.mdAndUp
                              "
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  <span
                                    v-if="
                                      $vuetify.display.mdAndUp &&
                                      tab !== 'histories'
                                    "
                                    >Pax / </span
                                  >Invite
                                </span>
                              </v-row>
                            </v-col> -->

                            <v-col
                              cols="12"
                              :lg="tab !== 'histories' ? '1' : '2'"
                              md="3"
                              sm="3"
                              class="text text-capitalize"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Facility
                                  <span
                                    v-if="
                                      $vuetify.display.sm || $vuetify.display.md
                                    "
                                  >
                                    / Status
                                  </span>
                                  <span
                                    v-if="
                                      tab !== 'histories' && $vuetify.display.sm
                                    "
                                    >/ Invites</span
                                  >
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              lg="1"
                              class="`text text-capitalize"
                              v-if="$vuetify.display.lgAndUp"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Status
                                </span>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider
                        v-if="$vuetify.display.xs || $vuetify.display.lgAndUp"
                      />
                    </v-list>
                  </template>
                  <!-- items -->
                  <template #default="{ items }">
                    <v-list class="pa-0" density="compact">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="item.raw._id"
                      >
                        <v-list-item
                          :class="
                            $vuetify.display.smAndDown || $vuetify.display.md
                              ? 'py-2 border-md px-4 rounded-lg mb-2 my-2 mx-2'
                              : 'py-0 px-2 mx-2 my-0 text-body-2'
                          "
                        >
                          <template #default>
                            <v-list-item-title>
                              <v-row no-gutters align="center">
                                <v-col
                                  v-if="tab !== 'histories'"
                                  cols="12"
                                  sm="1"
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
                                      class="mr-2 d-flex d-sm-none font-weight-bold"
                                      >Checkbox:
                                    </span>
                                    <span
                                      class="d-inline-block text-body-2 pl-lg-2 pt-3"
                                    >
                                      <v-checkbox
                                        v-model="selectedItems"
                                        :value="item.raw"
                                      ></v-checkbox>
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="2"
                                  sm="4"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height text-truncate mr-2"
                                    align-content="center"
                                    align="center"
                                    :justify="
                                      $vuetify.display.smAndDown
                                        ? 'space-between'
                                        : 'start'
                                    "
                                  >
                                    <span
                                      class="mr-2 d-flex d-sm-none font-weight-bold"
                                      >Created at:
                                    </span>
                                    <span
                                      class="d-inline-block text-body-2 mr-2"
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-4'}`"
                                      >
                                        mdi-calendar-month-outline
                                      </v-icon>
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

                                    <div
                                      class="d-flex align-center ga-2 text-truncate mr-2 w-100"
                                      v-if="$vuetify.display.sm"
                                    >
                                      <span>
                                        <v-avatar
                                          size="x-small"
                                          :color="materialColors[itemIndex]"
                                        >
                                          {{
                                            getInitial(
                                              item.raw.userGivenName ||
                                                item.raw.userSurname,
                                            )
                                          }}
                                        </v-avatar>
                                      </span>
                                      <span class="text-truncate">
                                        <div class="text-truncate">
                                          {{ item.raw.userGivenName }}
                                          {{ item.raw.userSurname }}
                                        </div>
                                        <div
                                          class="text-caption text-grey text-truncate"
                                        >
                                          <v-icon size="small" class="mb-1">
                                            mdi-map-marker
                                          </v-icon>
                                          {{
                                            `${item.raw.userBlockName} ${item.raw.userLevelName} ${item.raw.userBlockName}`
                                          }}
                                        </div>
                                      </span>
                                    </div>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  :md="tab !== 'histories' ? 2 : 3"
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
                                      class="mr-2 d-flex d-sm-none font-weight-bold"
                                      >Resident:
                                    </span>
                                    <span
                                      class="d-inline-block text-truncate text-capitalize text-body-2"
                                    >
                                      <div
                                        class="d-flex align-center ga-2 text-truncate mr-2"
                                      >
                                        <span>
                                          <v-avatar
                                            size="x-small"
                                            :color="materialColors[itemIndex]"
                                          >
                                            {{
                                              getInitial(
                                                item.raw.userGivenName ||
                                                  item.raw.userSurname,
                                              )
                                            }}
                                          </v-avatar>
                                        </span>
                                        <span class="text-truncate">
                                          <div class="text-truncate">
                                            {{ item.raw.userGivenName }}
                                            {{ item.raw.userSurname }}
                                          </div>
                                          <div
                                            class="text-caption text-grey text-truncate"
                                          >
                                            <v-icon size="small" class="mb-1">
                                              mdi-map-marker
                                            </v-icon>
                                            {{
                                              `${item.raw.userBlockName} ${item.raw.userLevelName} ${item.raw.userBlockName}`
                                            }}
                                          </div>
                                        </span>
                                      </div>
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  lg="1"
                                  md="2"
                                  sm="3"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
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
                                      class="mr-2 d-flex d-sm-none font-weight-bold"
                                      >Booking Date:
                                    </span>
                                    <span
                                      class="d-inline-block text-body-2 mr-1"
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-1' : 'mr-1'}`"
                                      >
                                        mdi-calendar-month-outline
                                      </v-icon>
                                      <span
                                        style="
                                          word-break: break-word;
                                          white-space: normal;
                                        "
                                      >
                                        {{ standardFormatDate(item.raw.date) }}
                                      </span>
                                    </span>

                                    <span
                                      class="d-inline-block text-body-2 w-100"
                                      v-if="
                                        $vuetify.display.sm ||
                                        $vuetify.display.md
                                      "
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-1' : 'mr-1'}`"
                                      >
                                        mdi-clock-time-eight-outline
                                      </v-icon>

                                      <span
                                        style="
                                          word-break: break-word;
                                          white-space: normal;
                                        "
                                      >
                                        {{ item.raw.slotName }}
                                      </span>
                                    </span>

                                    <span
                                      v-if="
                                        tab !== 'histories' &&
                                        $vuetify.display.sm
                                      "
                                      class="d-flex align-center text-body-2 w-100"
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-5'}`"
                                      >
                                        mdi-account-group
                                      </v-icon>
                                      {{ item.raw.pax }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="1"
                                  sm="2"
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
                                      class="mr-2 d-flex d-sm-none font-weight-bold"
                                      >Booking Slot:
                                    </span>
                                    <span class="d-inline-block text-body-2">
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-1' : 'mr-4'}`"
                                      >
                                        mdi-clock-time-eight-outline
                                      </v-icon>

                                      <span
                                        style="
                                          word-break: break-word;
                                          white-space: normal;
                                        "
                                      >
                                        {{ item.raw.slotName }}
                                      </span>
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="1"
                                  sm="2"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height text-truncate"
                                    align-content="center"
                                    align="center"
                                    :justify="
                                      $vuetify.display.smAndDown
                                        ? 'space-between'
                                        : 'center'
                                    "
                                  >
                                    <span
                                      class="mr-2 d-flex d-sm-none font-weight-bold"
                                      >Pax/Invites:
                                    </span>
                                    <span
                                      class="d-flex align-center text-body-2"
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-5'}`"
                                      >
                                        mdi-account-group
                                      </v-icon>
                                      {{ item.raw.pax }}
                                    </span>

                                    <span
                                      class="d-flex align-center text-body-2 w-100"
                                      :style="
                                        Array.isArray(item.raw.invites) &&
                                        item.raw.invites.length
                                          ? 'cursor: pointer;'
                                          : ''
                                      "
                                      @click="
                                        Array.isArray(item.raw.invites) &&
                                        item.raw.invites.length
                                          ? openDialog(item.raw, {
                                              text: 'invites',
                                              status: 'invites',
                                            })
                                          : null
                                      "
                                      v-if="$vuetify.display.sm"
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-5'}`"
                                      >
                                        <v-img
                                          src="/icons/facility/invites.svg"
                                          style="width: 5px; height: 15px"
                                        />
                                      </v-icon>
                                      {{
                                        Array.isArray(item.raw.invites)
                                          ? item.raw.invites.length
                                          : 0
                                      }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  lg="1"
                                  md="1"
                                  :class="tab !== 'histories' ? 'pl-2' : ''"
                                  v-if="
                                    $vuetify.display.xs ||
                                    $vuetify.display.mdAndUp
                                  "
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height text-truncate"
                                    align-content="center"
                                  >
                                    <!-- <span
                                      class="mr-2 d-flex d-sm-none font-weight-bold"
                                      >Pax/Invites:
                                    </span>
                                    <span
                                      class="d-flex align-center text-body-2 w-100"
                                      v-if="
                                        tab !== 'histories' &&
                                        $vuetify.display.mdAndUp
                                      "
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-5'}`"
                                      >
                                        mdi-account-group
                                      </v-icon>
                                      {{ item.raw.pax }}
                                    </span> -->
                                    <span
                                      class="d-flex text-capitalize align-center text-body-2"
                                      :style="
                                        Array.isArray(item.raw.invites) &&
                                        item.raw.invites.length
                                          ? 'cursor: pointer;'
                                          : ''
                                      "
                                      @click="
                                        Array.isArray(item.raw.invites) &&
                                        item.raw.invites.length
                                          ? openDialog(item.raw, {
                                              text: 'invites',
                                              status: 'invites',
                                            })
                                          : null
                                      "
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-5'}`"
                                      >
                                        <v-img
                                          src="/icons/facility/invites.svg"
                                          style="width: 5px; height: 15px"
                                        />
                                      </v-icon>
                                      {{
                                        Array.isArray(item.raw.invites)
                                          ? item.raw.invites.length
                                          : 0
                                      }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  :lg="tab !== 'histories' ? '1' : '2'"
                                  :md="tab !== 'histories' ? '2' : '3'"
                                  sm="3"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
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
                                      class="mr-2 d-flex d-sm-none font-weight-bold"
                                      >Facility:
                                    </span>
                                    <span
                                      class="d-flex align-center text-truncate text-capitalize text-body-2"
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-2'}`"
                                      >
                                        mdi-office-building-outline
                                      </v-icon>
                                      <span
                                        style="
                                          word-break: break-word;
                                          white-space: normal;
                                        "
                                        class="mr-1"
                                      >
                                        {{ item.raw.facilityName }}
                                      </span>
                                    </span>

                                    <span
                                      :class="`d-inline-block text-capitalize text-body-2 w-100 ${$vuetify.display.mdAndUp ? '' : 'ml-6'}`"
                                      v-if="
                                        $vuetify.display.sm ||
                                        $vuetify.display.md
                                      "
                                    >
                                      <v-chip
                                        size="small"
                                        :class="
                                          item.raw.status !== 'pending'
                                            ? 'text-white'
                                            : ''
                                        "
                                        :style="`background-color: ${
                                          item.raw.status === 'approved'
                                            ? '#4CAF50'
                                            : [
                                                  'rejected',
                                                  'cancelled',
                                                ].includes(item.raw.status)
                                              ? '#F44336'
                                              : ''
                                        }`"
                                      >
                                        <span>
                                          {{ item.raw.status }}
                                        </span>
                                        <v-icon
                                          end
                                          v-if="
                                            ['rejected', 'cancelled'].includes(
                                              item.raw.status,
                                            )
                                          "
                                          size="x-small"
                                          style="cursor: pointer"
                                          @click="
                                            openDialog(item.raw, {
                                              text: 'remarks',
                                              status: 'remarks',
                                            })
                                          "
                                        >
                                          mdi-eye
                                        </v-icon>
                                      </v-chip>
                                    </span>

                                    <span
                                      class="d-flex align-center text-body-2 w-100"
                                      :style="
                                        Array.isArray(item.raw.invites) &&
                                        item.raw.invites.length
                                          ? 'cursor: pointer;'
                                          : ''
                                      "
                                      @click="
                                        Array.isArray(item.raw.invites) &&
                                        item.raw.invites.length
                                          ? openDialog(item.raw, {
                                              text: 'invites',
                                              status: 'invites',
                                            })
                                          : null
                                      "
                                      v-if="
                                        $vuetify.display.sm &&
                                        tab !== 'histories'
                                      "
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-5'}`"
                                      >
                                        <v-img
                                          src="/icons/facility/invites.svg"
                                          style="width: 5px; height: 15px"
                                        />
                                      </v-icon>
                                      {{
                                        Array.isArray(item.raw.invites)
                                          ? item.raw.invites.length
                                          : 0
                                      }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="1"
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
                                      class="mr-2 d-flex d-sm-none font-weight-bold"
                                      >Status:
                                    </span>
                                    <span
                                      :class="`d-inline-block text-capitalize text-body-2  ${$vuetify.display.mdAndUp ? '' : 'ml-9'}`"
                                    >
                                      <v-chip
                                        size="small"
                                        :class="
                                          item.raw.status !== 'pending'
                                            ? 'text-white'
                                            : ''
                                        "
                                        :style="`background-color: ${
                                          item.raw.status === 'approved'
                                            ? '#4CAF50'
                                            : [
                                                  'rejected',
                                                  'cancelled',
                                                ].includes(item.raw.status)
                                              ? '#F44336'
                                              : ''
                                        }`"
                                      >
                                        <span>
                                          {{ item.raw.status }}
                                        </span>
                                        <v-icon
                                          end
                                          v-if="
                                            ['rejected', 'cancelled'].includes(
                                              item.raw.status,
                                            )
                                          "
                                          size="x-small"
                                          style="cursor: pointer"
                                          @click="
                                            openDialog(item.raw, {
                                              text: 'remarks',
                                              status: 'remarks',
                                            })
                                          "
                                        >
                                          mdi-eye
                                        </v-icon>
                                      </v-chip>
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  v-if="tab !== 'histories'"
                                  cols="12"
                                  sm="1"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    justify="end"
                                    align-content="center"
                                  >
                                    <v-menu>
                                      <template #activator="{ props }">
                                        <v-icon
                                          v-bind="props"
                                          class="pa-4 rounded-xl border-md"
                                          density="compact"
                                        >
                                          mdi-dots-vertical
                                        </v-icon>
                                      </template>

                                      <v-card>
                                        <v-list-item
                                          @click="
                                            openDialog(item.raw, actions[0])
                                          "
                                          :disabled="
                                            item.raw.status == 'approved' ||
                                            !actions[0].disabled
                                          "
                                        >
                                          <template #title>
                                            <span class="text-caption">
                                              {{ actions[0].text }}
                                            </span>
                                          </template>
                                        </v-list-item>

                                        <v-divider></v-divider>

                                        <v-list-item
                                          v-if="tab !== 'approved'"
                                          @click="
                                            openDialog(item.raw, actions[1])
                                          "
                                          :disabled="!actions[1].disabled"
                                        >
                                          <template #title>
                                            <span class="text-caption">
                                              {{ actions[1].text }}
                                            </span>
                                          </template>
                                        </v-list-item>

                                        <v-divider></v-divider>

                                        <v-list-item
                                          v-if="tab !== 'pending'"
                                          @click="
                                            openDialog(item.raw, actions[2])
                                          "
                                          :disabled="!actions[2].disabled"
                                        >
                                          <template #title>
                                            <span class="text-caption">
                                              {{ actions[2].text }}
                                            </span>
                                          </template>
                                        </v-list-item>
                                        <v-divider></v-divider>
                                      </v-card>
                                    </v-menu>
                                  </v-row>
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </template>
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
                  <!-- if no items-->
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
                            You don't have any data yet.
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

          <!-- pagination -->
          <v-col cols="12" class="pa-4">
            <v-row no-gutters justify="end" align-content="center">
              <span>{{ bookingPageRange }}</span>
              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="canPrevBookingPage"
                @click="
                  prevBookingPage({
                    search,
                    site: mySite,
                    dataType: tab !== 'histories' ? null : tab,
                    status: tab !== 'histories' ? tab : '',
                    date: {
                      start: moment
                        .tz(
                          moment(
                            tab !== 'histories'
                              ? filter.from
                              : filterHistories.from,
                            'DD/MM/YYYY',
                          ).startOf('day'),
                          'Asia/Singapore',
                        )
                        .toDate(),
                      end: moment
                        .tz(
                          moment(
                            tab !== 'histories'
                              ? filter.to
                              : filterHistories.to,
                            'DD/MM/YYYY',
                          ).endOf('day'),
                          'Asia/Singapore',
                        )
                        .toDate(),
                    },
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
                :disabled="!canNextBookingPage"
                @click="
                  nextBookingPage({
                    search,
                    site: mySite,
                    dataType: tab !== 'histories' ? null : tab,
                    status: tab !== 'histories' ? tab : '',
                    date: {
                      start: moment
                        .tz(
                          moment(
                            tab !== 'histories'
                              ? filter.from
                              : filterHistories.from,
                            'DD/MM/YYYY',
                          ).startOf('day'),
                          'Asia/Singapore',
                        )
                        .toDate(),
                      end: moment
                        .tz(
                          moment(
                            tab !== 'histories'
                              ? filter.to
                              : filterHistories.to,
                            'DD/MM/YYYY',
                          ).endOf('day'),
                          'Asia/Singapore',
                        )
                        .toDate(),
                    },
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

    <!-- dialog -->
    <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      persistent
      :width="dialogType.text == 'remarks' ? '70vh' : '150vh'"
      :style="`margin-left: ${$vuetify.display.mdAndUp ? '40' : '0'}px;`"
    >
      <v-card
        :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
        :class="`${theme == 'light' && 'bg-white'} px-3 h-100`"
      >
        <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
          <span class="font-weight-bold pl-4 pt-1 text-capitalize">
            {{ dialogType.text }}
          </span>

          <v-spacer></v-spacer>
          <v-btn
            size="x-small"
            color="grey-darken-1"
            icon="mdi-close"
            @click="closeDialog()"
          ></v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text>
          <v-col v-if="dialogType.status !== 'remarks'" cols="12">
            <v-row no-gutters>
              <span v-if="dialogType.text !== 'invites'">
                The following booked slot will be {{ dialogType.status }}
              </span>
              <span v-else>
                Below is the list of visitor(s) that were invited during booking
                of the facility
              </span>
              :
              <v-col cols="12">
                <v-data-iterator
                  :items="
                    dialogType.text !== 'invites'
                      ? selectedItems
                      : bookingInvites
                  "
                  :items-per-page="
                    dialogType.text !== 'invites'
                      ? selectedItems.length
                      : bookingInvites.length
                  "
                >
                  <!-- header -->
                  <template v-slot:header>
                    <v-list
                      class="pa-0"
                      density="compact"
                      v-if="$vuetify.display.mdAndUp"
                    >
                      <v-list-item class="pt-10 px-0">
                        <v-list-item-title>
                          <v-row no-gutters>
                            <v-col
                              v-if="dialogType.text !== 'invites'"
                              cols="12"
                              md="2"
                              class="text-capitalize text"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Created At
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              :md="dialogType.text == 'invites' ? 4 : 3"
                              class="text-capitalize text"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Name
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              v-if="dialogType.text !== 'invites'"
                              cols="12"
                              md="1"
                              class="text my-1"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Booking Date
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              v-if="dialogType.text !== 'invites'"
                              cols="12"
                              md="1"
                              class="text my-1"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Booking Slot
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              v-if="dialogType.text !== 'invites'"
                              cols="12"
                              md="1"
                              class="text text-capitalize"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                                :justify="
                                  $vuetify.display.mdAndUp ? 'center' : 'start'
                                "
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Pax
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              v-if="dialogType.text !== 'invites'"
                              cols="12"
                              md="1"
                              class="text text-capitalize"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Invites
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              v-if="dialogType.text !== 'invites'"
                              cols="12"
                              md="2"
                              class="`text text-capitalize"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Facility
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              v-if="dialogType.text === 'invites'"
                              cols="12"
                              md="3"
                              class="text"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Email
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              v-if="dialogType.text === 'invites'"
                              cols="12"
                              md="1"
                              class="text"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Type
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" md="1" class="text">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  {{
                                    dialogType.text !== "invites"
                                      ? "Status"
                                      : "Overnight Parking"
                                  }}
                                </span>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                    </v-list>
                  </template>
                  <!-- items -->
                  <template #default="{ items }">
                    <v-list class="pa-0" density="compact">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="item.raw._id"
                      >
                        <v-list-item
                          :class="`px-${$vuetify.display.mdAndUp ? '0' : '4'}`"
                        >
                          <template #default>
                            <v-list-item-title>
                              <v-row no-gutters>
                                <v-col
                                  v-if="dialogType.text !== 'invites'"
                                  cols="12"
                                  md="2"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span class="d-inline-block text-body-2">
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-4'}`"
                                      >
                                        mdi-calendar-month-outline
                                      </v-icon>
                                      {{
                                        standardFormatDateTime(
                                          item.raw.createdAt,
                                        )
                                      }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  :md="dialogType.text == 'invites' ? 4 : 3"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span class="d-inline-block text-body-2">
                                      <v-row no-gutters>
                                        <v-avatar
                                          size="x-small"
                                          :color="materialColors[itemIndex]"
                                        >
                                          {{
                                            getInitial(
                                              item.raw.userGivenName ||
                                                item.raw.userSurname ||
                                                item.raw.name,
                                            )
                                          }}
                                        </v-avatar>

                                        <span
                                          class="text-truncate text-capitalize ml-2"
                                          style="align-content: center"
                                        >
                                          <div>
                                            {{
                                              dialogType.text !== "invites"
                                                ? `${item.raw.userGivenName} ${item.raw.userSurname}`
                                                : item.raw.name
                                            }}
                                          </div>
                                          <div
                                            v-if="dialogType.text !== 'invites'"
                                            class="text-caption text-grey"
                                          >
                                            <v-icon size="small" class="mb-1">
                                              mdi-map-marker
                                            </v-icon>
                                            {{
                                              `${item.raw.userBlockName} ${item.raw.userLevelName} ${item.raw.userBlockName}`
                                            }}
                                          </div>
                                        </span>
                                      </v-row>
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  v-if="dialogType.text !== 'invites'"
                                  cols="12"
                                  md="1"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span class="d-inline-block text-body-2">
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-4'}`"
                                      >
                                        mdi-calendar-month-outline
                                      </v-icon>
                                      {{ standardFormatDate(item.raw.date) }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  v-if="dialogType.text !== 'invites'"
                                  cols="12"
                                  md="1"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span class="d-inline-block text-body-2">
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-4'}`"
                                      >
                                        mdi-clock-time-eight-outline
                                      </v-icon>

                                      {{ item.raw.slotName }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  v-if="dialogType.text !== 'invites'"
                                  cols="12"
                                  md="1"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                    :justify="
                                      $vuetify.display.mdAndUp
                                        ? 'center'
                                        : 'start'
                                    "
                                  >
                                    <span
                                      class="d-flex align-center text-body-2"
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-5'}`"
                                      >
                                        mdi-account-group
                                      </v-icon>
                                      {{ item.raw.pax }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  v-if="dialogType.text !== 'invites'"
                                  cols="12"
                                  md="1"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      class="d-flex text-capitalize align-center text-body-2"
                                      :style="
                                        Array.isArray(item.raw.invites) &&
                                        item.raw.invites.length
                                          ? 'cursor: pointer;'
                                          : ''
                                      "
                                      @click="
                                        Array.isArray(item.raw.invites) &&
                                        item.raw.invites.length
                                          ? openDialog(item.raw, {
                                              text: 'invites',
                                              status: 'invites',
                                            })
                                          : null
                                      "
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-5'}`"
                                      >
                                        <v-img
                                          src="/icons/facility/invites.svg"
                                          style="width: 5px; height: 15px"
                                        />
                                      </v-icon>
                                      {{
                                        Array.isArray(item.raw.invites)
                                          ? item.raw.invites.length
                                          : 0
                                      }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  v-if="dialogType.text !== 'invites'"
                                  cols="12"
                                  md="2"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      class="d-flex align-center text-truncate text-capitalize text-body-2"
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-5'}`"
                                      >
                                        mdi-office-building-outline
                                      </v-icon>
                                      {{ item.raw.facilityName }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  v-if="dialogType.text === 'invites'"
                                  cols="12"
                                  md="3"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span class="d-inline-block text-body-2">
                                      <v-icon
                                        color="error"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-4'}`"
                                      >
                                        mdi-at
                                      </v-icon>
                                      {{ item.raw.email }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  v-if="dialogType.text === 'invites'"
                                  cols="12"
                                  md="1"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span class="d-inline-block text-body-2">
                                      {{
                                        item.raw.isOvernightParking == null
                                          ? "Walk-In"
                                          : "Drive-In"
                                      }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="1"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      :class="`d-inline-block text-capitalize text-body-2  ${$vuetify.display.mdAndUp ? '' : 'ml-6'}`"
                                    >
                                      <v-chip
                                        v-if="dialogType.text !== 'invites'"
                                        size="small"
                                        :class="
                                          item.raw.status !== 'pending'
                                            ? 'text-white'
                                            : ''
                                        "
                                        :style="`background-color: ${
                                          item.raw.status === 'approved'
                                            ? '#4CAF50'
                                            : [
                                                  'rejected',
                                                  'cancelled',
                                                ].includes(item.raw.status)
                                              ? '#F44336'
                                              : ''
                                        }`"
                                      >
                                        {{ item.raw.status }}
                                      </v-chip>
                                      <v-chip
                                        v-else
                                        size="small"
                                        :class="
                                          item.raw.isOvernightParking !== null
                                            ? 'text-white'
                                            : ''
                                        "
                                        :style="`background-color: ${
                                          item.raw.isOvernightParking !== null
                                            ? item.raw.isOvernightParking
                                              ? '#4CAF50'
                                              : '#F44336'
                                            : ''
                                        }`"
                                      >
                                        {{
                                          item.raw.isOvernightParking !== null
                                            ? item.raw.isOvernightParking
                                              ? "Yes"
                                              : "No"
                                            : "N/A"
                                        }}
                                      </v-chip>
                                    </span>
                                  </v-row>
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </template>
                        </v-list-item>

                        <v-divider
                          v-if="itemIndex + 1 !== items.length"
                        ></v-divider>
                      </template>
                    </v-list>
                  </template>
                </v-data-iterator>
              </v-col>
            </v-row>
          </v-col>

          <!-- remarks -->
          <v-col
            v-if="
              !similarBookedSlots &&
              !similarBookedSlots?.items.length &&
              ['rejected', 'cancelled', 'remarks'].includes(dialogType.status)
            "
            cols="12"
            :md="dialogType.status !== 'remarks' ? 4 : 8"
          >
            <v-textarea
              v-model="remarks"
              label="Remarks"
              placeholder="Remarks"
              rows="3"
              :hide-details="dialogType.status == 'remarks'"
              :readonly="dialogType.status == 'remarks'"
              dense
            ></v-textarea>
          </v-col>

          <!-- if similar booked slots -->
          <v-col
            v-if="similarBookedSlots?.items.length"
            cols="12"
            class="mt-10"
          >
            <v-row no-gutters>
              The following booked slot(s) are needed to be rejected first:
              <v-col cols="12">
                <v-progress-linear
                  v-if="isSimilarBookedSlotsLoading"
                  color="deep-purple"
                  height="4"
                  indeterminate
                ></v-progress-linear>
                <v-data-iterator
                  :items="similarBookedSlots.items"
                  :items-per-page="selectedPageRange"
                >
                  <!-- header -->
                  <template v-slot:header>
                    <v-list
                      class="pa-0"
                      density="compact"
                      v-if="$vuetify.display.mdAndUp"
                    >
                      <v-list-item class="pt-10 px-0">
                        <v-list-item-title>
                          <v-row no-gutters>
                            <v-col
                              cols="12"
                              md="2"
                              class="text-capitalize text"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Created At
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              md="3"
                              class="text-capitalize text"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Name
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" md="1" class="text my-1">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Booking Date
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" md="1" class="text my-1">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Booking Slot
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              md="1"
                              class="text text-capitalize"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                                :justify="
                                  $vuetify.display.mdAndUp ? 'center' : 'start'
                                "
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Pax
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              md="1"
                              class="text text-capitalize"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Invites
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              md="2"
                              class="`text text-capitalize"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Facility
                                </span>
                              </v-row>
                            </v-col>
                            <v-col
                              cols="12"
                              md="1"
                              class="`text text-capitalize"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Status
                                </span>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                    </v-list>
                  </template>
                  <!-- items -->
                  <template #default="{ items }">
                    <v-list class="pa-0" density="compact">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="item.raw._id"
                      >
                        <v-list-item
                          :class="`px-${$vuetify.display.mdAndUp ? '0' : '4'}`"
                        >
                          <template #default>
                            <v-list-item-title>
                              <v-row no-gutters>
                                <v-col
                                  cols="12"
                                  md="2"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span class="d-inline-block text-body-2">
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-4'}`"
                                      >
                                        mdi-calendar-month-outline
                                      </v-icon>
                                      {{
                                        standardFormatDateTime(
                                          item.raw.createdAt,
                                        )
                                      }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="3"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      class="d-inline-block text-truncate text-capitalize text-body-2"
                                    >
                                      <v-row no-gutters>
                                        <v-col cols="1" md="2">
                                          <v-avatar
                                            size="x-small"
                                            :color="materialColors[itemIndex]"
                                          >
                                            {{
                                              getInitial(
                                                item.raw.userGivenName ||
                                                  item.raw.userSurname,
                                              )
                                            }}
                                          </v-avatar>
                                        </v-col>
                                        <v-col
                                          cols="10"
                                          :class="`${$vuetify.display.mdAndUp ? 'pl-4' : 'pl-6'}`"
                                          style="align-content: center"
                                        >
                                          <div>
                                            {{
                                              `${item.raw.userGivenName} ${item.raw.userSurname}`
                                            }}
                                          </div>
                                          <div
                                            v-if="dialogType.text !== 'invites'"
                                            class="text-caption text-grey"
                                          >
                                            <v-icon size="small" class="mb-1">
                                              mdi-map-marker
                                            </v-icon>
                                            {{
                                              `${item.raw.userBlockName} ${item.raw.userLevelName} ${item.raw.userBlockName}`
                                            }}
                                          </div>
                                        </v-col>
                                      </v-row>
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="1"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span class="d-inline-block text-body-2">
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-4'}`"
                                      >
                                        mdi-calendar-month-outline
                                      </v-icon>
                                      {{ standardFormatDate(item.raw.date) }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="1"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span class="d-inline-block text-body-2">
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-4'}`"
                                      >
                                        mdi-clock-time-eight-outline
                                      </v-icon>

                                      {{ item.raw.slotName }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="1"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                    :justify="
                                      $vuetify.display.mdAndUp
                                        ? 'center'
                                        : 'start'
                                    "
                                  >
                                    <span
                                      class="d-flex align-center text-body-2"
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-5'}`"
                                      >
                                        mdi-account-group
                                      </v-icon>
                                      {{ item.raw.pax }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="1"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      class="d-flex text-capitalize align-center text-body-2"
                                      :style="
                                        Array.isArray(item.raw.invites) &&
                                        item.raw.invites.length
                                          ? 'cursor: pointer;'
                                          : ''
                                      "
                                      @click="
                                        Array.isArray(item.raw.invites) &&
                                        item.raw.invites.length
                                          ? openDialog(item.raw, {
                                              text: 'invites',
                                              status: 'invites',
                                            })
                                          : null
                                      "
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-5'}`"
                                      >
                                        <v-img
                                          src="/icons/facility/invites.svg"
                                          style="width: 5px; height: 15px"
                                        />
                                      </v-icon>
                                      {{
                                        Array.isArray(item.raw.invites)
                                          ? item.raw.invites.length
                                          : 0
                                      }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="2"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      class="d-flex align-center text-truncate text-capitalize text-body-2"
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-5'}`"
                                      >
                                        mdi-office-building-outline
                                      </v-icon>
                                      {{ item.raw.facilityName }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="1"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      :class="`d-inline-block text-capitalize text-body-2  ${$vuetify.display.mdAndUp ? '' : 'ml-6'}`"
                                    >
                                      <v-chip
                                        size="small"
                                        :class="
                                          item.raw.status !== 'pending'
                                            ? 'text-white'
                                            : ''
                                        "
                                        :style="`background-color: ${
                                          item.raw.status === 'approved'
                                            ? '#4CAF50'
                                            : [
                                                  'rejected',
                                                  'cancelled',
                                                ].includes(item.raw.status)
                                              ? '#F44336'
                                              : ''
                                        }`"
                                      >
                                        {{ item.raw.status }}
                                      </v-chip>
                                    </span>
                                  </v-row>
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </template>
                        </v-list-item>

                        <v-divider
                          v-if="itemIndex + 1 !== items.length"
                        ></v-divider>
                      </template>
                    </v-list>
                  </template>
                </v-data-iterator>
              </v-col>
              <v-divider></v-divider>

              <!-- pagination -->
              <v-col cols="12" class="py-4">
                <v-row no-gutters>
                  <v-col cols="2">
                    <v-select
                      :items="pageRanges"
                      v-model="selectedPageRange"
                      label="Select items per page"
                      class="mx-2"
                      hide-details
                      @update:modelValue="updateItemsPerPage"
                    ></v-select>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="3">
                    <span>{{ similarBookedSlots.pageRange }}</span>
                    <v-btn
                      density="compact"
                      variant="text"
                      icon
                      class="mx-2"
                      :disabled="canPrevPage"
                      @click="prevPage()"
                    >
                      <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn
                      density="compact"
                      variant="text"
                      icon
                      class="mx-2"
                      :disabled="!canNextPage"
                      @click="nextPage()"
                    >
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>

              <!-- remarks -->
              <v-col cols="12" md="4">
                <v-textarea
                  v-model="remarks"
                  label="Remarks"
                  placeholder="Remarks"
                  rows="3"
                  dense
                ></v-textarea>
              </v-col>

              <!-- reject all button -->
              <v-col cols="12" class="mt-3">
                <v-row no-gutters>
                  <v-btn
                    flat
                    class="font-weight-bold mr-4"
                    color="error"
                    @click="rejectAll()"
                    :loading="loadingReject"
                    :disabled="
                      similarBookedSlots?.items.length ? !remarks : false
                    "
                  >
                    reject all
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
          </v-col>

          <!-- action buttons -->
          <v-col cols="12" class="mt-10">
            <v-row no-gutters>
              <v-btn
                v-if="!['invites', 'remarks'].includes(dialogType.status)"
                flat
                class="font-weight-bold mr-4"
                :color="dialogType.status !== 'approved' ? 'error' : 'success'"
                @click="submit()"
                :loading="loading"
                :disabled="
                  !['rejected', 'cancelled'].includes(dialogType.status)
                    ? similarBookedSlots?.items.length
                    : !remarks
                "
              >
                proceed
              </v-btn>
              <v-btn
                variant="text"
                class="font-weight-bold"
                @click="closeDialog()"
              >
                close
              </v-btn>
            </v-row>
          </v-col>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

import debounce from "lodash/debounce";
import moment from "moment-timezone";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const { $ability } = useNuxtApp();

const bookingId = computed(() => useRoute().query.booking as string);

const selectAll = ref(false);
const selectedItems = ref<TFacilityBooking[]>([]);
const bookingInvites = ref([]);

const {
  materialColors,
  getInitial,
  standardFormatDate,
  standardFormatDateTime,
  getPast30DaysDate,
} = useUtils();

const { setSnackbar } = useLocal();

const {
  tab,
  page,
  nextBookingPage,
  prevBookingPage,
  canPrevBookingPage,
  canNextBookingPage,
  itemsPerPage,
  bookingPageRange,
  setFacilityBookings,
  facilityBookings,
  isFacilityBookingsLoaded,
  search,
  filters,
  updateStatus,
  getSimilarBookingSlot,
  generateBookingHistoryPdfOrCsv,
} = useFacilityBookings();

const { mySite } = useFilter();

const { getFacilitiesSetting } = useFacility();

const startDateDialog = ref(false);
const endDateDialog = ref(false);
const startDate = ref<any>(null);
const endDate = ref<any>(null);
const startDateHistories = ref<any>(null);
const endDateHistories = ref<any>(null);
const locale = "en";

const filter = ref<any>({
  from: standardFormatDate(new Date()),
  to: standardFormatDate(new Date()),
});

const filterHistories = ref<any>({
  from: standardFormatDate(new Date()),
  to: standardFormatDate(new Date()),
});

const updateStartDate = (date: Date | null) => {
  startDate.value = date;
};
const updateEndDate = (date: Date | null) => {
  endDate.value = date;
};

const applyStartDate = () => {
  if (startDate.value) {
    filter.value.from = standardFormatDate(startDate.value);
    startDateDialog.value = false;
    page.value = 1;
    updateFilter();
  }
};
const applyEndDate = () => {
  if (endDate.value) {
    filter.value.to = standardFormatDate(endDate.value);
    endDateDialog.value = false;
    page.value = 1;
    updateFilter();
  }
};

watch(startDate, (newVal: any) => {
  if (newVal) {
    applyStartDate();
  }
});
watch(endDate, (newVal: any) => {
  if (newVal) {
    applyEndDate();
  }
});

const updateStartDateHistories = (date: Date | null) => {
  startDateHistories.value = date;
};
const updateEndDateHistories = (date: Date | null) => {
  endDateHistories.value = date;
};

const applyStartDateHistories = () => {
  if (startDateHistories.value) {
    filterHistories.value.from = standardFormatDate(startDateHistories.value);
    startDateDialog.value = false;
    page.value = 1;
    updateFilter();
  }
};
const applyEndDateHistories = () => {
  if (endDateHistories.value) {
    filterHistories.value.to = standardFormatDate(endDateHistories.value);
    endDateDialog.value = false;
    page.value = 1;
    updateFilter();
  }
};

watch(startDateHistories, (newVal: any) => {
  if (newVal) {
    applyStartDateHistories();
  }
});
watch(endDateHistories, (newVal: any) => {
  if (newVal) {
    applyEndDateHistories();
  }
});

const isExportingCsv = ref(false);
const isExportingPdf = ref(false);

const dialog = ref(false);
const dialogType = ref({
  text: "",
  status: "",
  disabled: [],
});
const { theme } = useLocal();
const remarks = ref("");
const loading = ref(false);
const loadingReject = ref(false);
const isSimilarBookedSlotsLoading = ref(false);

const similarBookedSlots = ref<any>(null);
const currentPage = ref(1);
const totalPages = ref(0);

const canNextPage = computed(() => totalPages.value > currentPage.value);
const canPrevPage = computed(() => currentPage.value <= 1);

const pageRanges = ref([1, 2, 10, 20, 30, 40, 50]);
const selectedPageRange = ref(10);

const advanceBookingDays = ref<any>(null);

onMounted(async () => {
  const result = await getFacilitiesSetting({ site: mySite.value });

  advanceBookingDays.value = +result?.advanceBookingDays || 30;

  const now = new Date();
  now.setDate(now.getDate() + advanceBookingDays.value);
  startDate.value = new Date();
  endDate.value = new Date(now);

  // check if redirected from notifications page
  if (bookingId.value) {
    search.value = bookingId.value;
    tab.value = "pending";
  }

  await setFacilityBookings({
    search: search.value,
    site: mySite.value,
    dataType: null,
    status: tab.value,
    date: {
      start: moment
        .tz(
          moment(
            tab.value !== "histories"
              ? filter.value.from
              : filterHistories.value.from,
            "DD/MM/YYYY",
          ).startOf("day"),
          "Asia/Singapore",
        )
        .toDate(),
      end: moment
        .tz(
          moment(
            tab.value !== "histories"
              ? filter.value.to
              : filterHistories.value.to,
            "DD/MM/YYYY",
          ).endOf("day"),
          "Asia/Singapore",
        )
        .toDate(),
    },
  });
});

function isValidObjectId() {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(search.value);
}
watch(
  tab,
  async (newValue: string) => {
    facilityBookings.value = [];
    if (newValue == "histories") {
      startDateHistories.value = new Date(
        new Date().setDate(new Date().getDate() - advanceBookingDays.value),
      );
      endDateHistories.value = new Date(
        new Date().setDate(new Date().getDate() - 1),
      );
    } else {
      page.value = 1;
      await updateFilter();
    }
  },
  { deep: true },
);

watchEffect(() => {
  if (selectedItems.value.length == facilityBookings.value.length) {
    selectAll.value = true;
  } else {
    selectAll.value = false;
  }
});

watch(search, (newValue: string) => {
  debouncedSearch(newValue);
});

const debouncedSearch = debounce(async (value: string) => {
  page.value = 1;
  await setFacilityBookings({
    search: value,
    site: mySite.value,
    dataType: tab.value !== "histories" ? null : tab.value,
    status: tab.value !== "histories" ? tab.value : "",
    date: {
      start: moment
        .tz(
          moment(
            tab.value !== "histories"
              ? filter.value.from
              : filterHistories.value.from,
            "DD/MM/YYYY",
          ).startOf("day"),
          "Asia/Singapore",
        )
        .toDate(),
      end: moment
        .tz(
          moment(
            tab.value !== "histories"
              ? filter.value.to
              : filterHistories.value.to,
            "DD/MM/YYYY",
          ).endOf("day"),
          "Asia/Singapore",
        )
        .toDate(),
    },
  });
}, 500);

const minDate = computed(() => {
  const now = new Date();
  return now.toISOString().substr(0, 10);
});

async function onUpdateDate(elementId: string, date: string | Date) {
  const getDate = new Date(date);
  filter.value[elementId] = standardFormatDate(getDate);
  await updateFilter();
}

async function updateFilter() {
  await setFacilityBookings({
    search: search.value,
    site: mySite.value,
    dataType: tab.value !== "histories" ? null : tab.value,
    status: tab.value !== "histories" ? tab.value : "",
    date: {
      start: moment
        .tz(
          moment(
            tab.value !== "histories"
              ? filter.value.from
              : filterHistories.value.from,
            "DD/MM/YYYY",
          ).startOf("day"),
          "Asia/Singapore",
        )
        .toDate(),
      end: moment
        .tz(
          moment(
            tab.value !== "histories"
              ? filter.value.to
              : filterHistories.value.to,
            "DD/MM/YYYY",
          ).endOf("day"),
          "Asia/Singapore",
        )
        .toDate(),
    },
  });
}

const actions = [
  {
    text: "Approve",
    status: "approved",
    disabled:
      $ability.can("update", "approve-facility") &&
      $ability.can("update", "reject-facility"),
  },
  {
    text: "Reject",
    status: "rejected",
    disabled: $ability.can("update", "reject-facility"),
  },
  {
    text: "Cancel",
    status: "cancelled",
    disabled: $ability.can("update", "cancel-facility"),
  },
];

const fileType = ref<"csv" | "pdf" | "">("");

async function onExportAsCsv(filename: string) {
  isExportingCsv.value = true;
  fileType.value = "csv";

  const response: any = await generateBookingHistoryPdfOrCsv({
    limit: 100000,
    site: mySite.value,
    dataType: "histories",
    date: {
      start: moment
        .tz(
          moment(filterHistories.value.from, "DD/MM/YYYY").startOf("day"),
          "Asia/Singapore",
        )
        .toDate(),
      end: moment
        .tz(
          moment(filterHistories.value.to, "DD/MM/YYYY").endOf("day"),
          "Asia/Singapore",
        )
        .toDate(),
    },
  });

  const headers = [
    [
      "SLOTNAME",
      "PAX",
      "DATE",
      "STATUS",
      "REMARKS",
      "CREATEDAT",
      "UPDATEDAT",
      "FACILITYNAME",
      "USERGIVENNAME",
      "USERSURNAME",
      "USERBLOCKNAME",
      "USERLEVELNAME",
      "USERUNITNAME",
    ],
  ];

  const bookingHistories = response?.items?.map((item: any) => [
    item.slotName || "",
    !item.pax ? 0 : item.pax,
    standardFormatDate(item.date) || "",
    item.status.charAt(0).toUpperCase() + item.status.slice(1) || "",
    item.remarks || "",
    standardFormatDateTime(item.createdAt) || "",
    standardFormatDateTime(item.updatedAt) || "",
    item.facilityName || "",
    item.userGivenName || "",
    item.userSurname || "",
    item.userBlockName || "",
    item.userLevelName || "",
    item.userUnitName || "",
  ]);

  const csvData = [...headers, ...(bookingHistories || [])];

  const fileContent = `data:text/csv;charset=utf-8,${csvData
    .map((e) => e.join(","))
    .join("\n")}`;

  let encodedUri = encodeURI(fileContent);
  let link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  await updateFilter();

  isExportingCsv.value = false;
}

async function onExportAsPdf() {
  isExportingPdf.value = true;
  fileType.value = "pdf";

  const result: any = await generateBookingHistoryPdfOrCsv({
    limit: 100000,
    site: mySite.value,
    dataType: "histories",
    date: {
      start: moment
        .tz(
          moment(filterHistories.value.from, "DD/MM/YYYY").startOf("day"),
          "Asia/Singapore",
        )
        .toDate(),
      end: moment
        .tz(
          moment(filterHistories.value.to, "DD/MM/YYYY").endOf("day"),
          "Asia/Singapore",
        )
        .toDate(),
    },
  });

  try {
    if (result && result.items) {
      const body = result.items.map((item: any) => [
        new Date(item.createdAt).toLocaleDateString(),
        `${item.userGivenName.trim()} ${item.userSurname.trim()}`,
        new Date(item.date).toLocaleDateString(),
        item.slotName,
        item.pax,
        item.invites && item.invites.length > 0 ? item.invites.length : 0,
        item.facilityName,
        item.status.charAt(0).toUpperCase() + item.status.slice(1),
      ]);

      const doc = new jsPDF();

      doc.setFont("helvetica");
      doc.setFontSize(11);
      doc.text(
        `Facility Bookings - History (${result.items.length}) \nDate Range: ${filter.value.from} to ${filter.value.to}`,
        14,
        20,
      );

      autoTable(doc, {
        startY: 40,
        head: [
          [
            "Created At",
            "Name",
            "Booking Date",
            "Booking Slot",
            "Pax",
            "Invites",
            "Facility",
            "Status",
          ],
        ],
        body,
        headStyles: {
          halign: "center",
          valign: "middle",
        },
        bodyStyles: {
          lineWidth: 0.1,
          lineColor: [128, 128, 128],
          halign: "center",
          valign: "middle",
        },
        tableLineWidth: 0.1,
        tableLineColor: [128, 128, 128],
        didDrawPage: (data) => {
          const totalPages = (doc.internal as any).getNumberOfPages();
          doc.setFontSize(10);
          doc.text(
            `Page ${data.pageNumber} of ${totalPages}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: "center" },
          );
        },
      });

      doc.save(
        `FACILITY BOOKINGS - HISTORY - ${filter.value.from} - ${filter.value.to}.pdf`,
      );
    }
  } catch (error) {
    setSnackbar({
      text: `Failed to download ${fileType.value}`,
      modal: true,
      type: "error",
    });
  }

  isExportingPdf.value = false;
}

async function selectAllBookings() {
  if (selectAll.value) {
    selectedItems.value = facilityBookings.value;
  } else {
    selectedItems.value = [];
  }
}

async function openDialog(booking?: any, action?: any) {
  if (booking && action.text !== "invites") {
    selectedItems.value = [booking];
  }

  if (action) {
    dialogType.value = action;
    if (action.status !== "invites") {
      if (action.status !== "remarks") {
        selectedItems.value = selectedItems.value.filter(
          (item: TFacilityBooking) =>
            item.status ==
            `${action.status !== "cancelled" ? "pending" : "approved"}`,
        );

        const _ids = selectedItems.value.map(
          (item: TFacilityBooking) => item._id,
        );

        if (action.status == "approved") {
          // fetch the similar bookings
          isSimilarBookedSlotsLoading.value = true;
          similarBookedSlots.value = await getSimilarBookingSlot({
            limit: selectedPageRange.value,
            _ids: _ids,
            site: mySite.value,
          });

          if (similarBookedSlots.value.items.length) {
            totalPages.value = similarBookedSlots.value.pages;
          }
          isSimilarBookedSlotsLoading.value = false;
        }
      } else {
        remarks.value = booking.remarks;
      }
    } else {
      bookingInvites.value = booking.invites;
    }

    dialog.value = true;
  }
}

async function updateItemsPerPage() {
  isSimilarBookedSlotsLoading.value = true;
  similarBookedSlots.value = await getSimilarBookingSlot({
    limit: selectedPageRange.value,
    page: currentPage.value,
    _ids: selectedItems.value.map((item: TFacilityBooking) => item._id),
    site: mySite.value,
  });
  totalPages.value = similarBookedSlots.value.pages;
  isSimilarBookedSlotsLoading.value = false;
}

async function prevPage() {
  isSimilarBookedSlotsLoading.value = true;
  currentPage.value -= 1;
  similarBookedSlots.value = await getSimilarBookingSlot({
    limit: selectedPageRange.value,
    page: currentPage.value,
    _ids: selectedItems.value.map((item: TFacilityBooking) => item._id),
    site: mySite.value,
  });
  isSimilarBookedSlotsLoading.value = false;
}

async function nextPage() {
  isSimilarBookedSlotsLoading.value = true;
  currentPage.value += 1;
  similarBookedSlots.value = await getSimilarBookingSlot({
    limit: selectedPageRange.value,
    page: currentPage.value,
    _ids: selectedItems.value.map((item: TFacilityBooking) => item._id),
    site: mySite.value,
  });
  isSimilarBookedSlotsLoading.value = false;
}

async function rejectAll() {
  loadingReject.value = true;
  try {
    const similarBookedSlotsIds = similarBookedSlots.value.items.map(
      (item: TFacilityBooking) => item._id,
    );
    await updateStatus({
      _ids: similarBookedSlotsIds,
      site: mySite.value,
      remarks: remarks.value || "",
      status: "rejected",
    });

    // fetch the similar bookings
    const _ids = selectedItems.value.map((item: TFacilityBooking) => item._id);
    isSimilarBookedSlotsLoading.value = true;
    similarBookedSlots.value = await getSimilarBookingSlot({
      limit: selectedPageRange.value,
      _ids: _ids,
      site: mySite.value,
    });

    if (similarBookedSlots.value.items.length) {
      totalPages.value = similarBookedSlots.value.pages;
    }
    isSimilarBookedSlotsLoading.value = false;
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  loadingReject.value = false;
}

async function submit() {
  loading.value = true;
  try {
    const _ids = selectedItems.value.map((item: TFacilityBooking) => item._id);
    const result = await updateStatus({
      _ids: _ids,
      site: mySite.value,
      remarks: remarks.value || "",
      status: dialogType.value.status,
    });

    if (dialogType.value.status == "approved" && result?.similarSlotFound) {
      // fetch the similar bookings
      isSimilarBookedSlotsLoading.value = true;
      similarBookedSlots.value = await getSimilarBookingSlot({
        limit: selectedPageRange.value,
        _ids: _ids,
        site: mySite.value,
      });

      if (similarBookedSlots.value.items.length) {
        totalPages.value = similarBookedSlots.value.pages;
      }
      isSimilarBookedSlotsLoading.value = false;
    } else {
      setSnackbar({
        text: `Booked slot successfully ${dialogType.value.status}.` as string,
        modal: true,
        type: "success",
      });
      await updateFilter();
      await closeDialog();
    }
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  loading.value = false;
}

async function closeDialog() {
  dialog.value = false;
  dialogType.value = {
    text: "",
    status: "",
    disabled: [],
  };
  remarks.value = "";
  selectAll.value = false;
  selectedItems.value = [];
  bookingInvites.value = [];
  similarBookedSlots.value = null;
  currentPage.value = 1;
  totalPages.value = 0;
}
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

:deep() .v-field__field {
  font-size: 14px;
}

.overridePicker {
  width: 18px;
}
</style>
