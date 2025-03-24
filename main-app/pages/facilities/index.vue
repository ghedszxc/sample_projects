<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="isFacilitiesLoaded"
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
            <v-row no-gutters>
              <v-col cols="12">
                <v-data-iterator
                  :items="facilities"
                  :items-per-page="itemsPerPage"
                >
                  <!-- header -->
                  <template v-slot:header>
                    <v-row no-gutters class="pa-4">
                      <v-col cols="12">
                        <v-row no-gutters class="align-center" align="center">
                          <v-col cols="12" class="mb-2">
                            <span class="font-weight-bold text-h6">
                              Facility
                            </span>
                          </v-col>

                          <v-col cols="12" md="6" lg="4" class="mb-2 mb-md-0">
                            <v-text-field
                              v-model="search"
                              placeholder="Search facility"
                              hide-details
                              density="compact"
                              append-inner-icon="mdi-magnify"
                              :class="$vuetify.display.mdAndUp ? 'mr-3' : ''"
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" md="6" lg="8">
                            <v-row
                              no-gutters
                              justify="end"
                              class="align-center"
                            >
                              <v-col cols="12" sm="6" lg="4" class="pr-sm-1">
                                <v-btn
                                  block
                                  color="#1867C0"
                                  @click="dialogScheduleMaintenance = true"
                                  class="mx-0 mr-sm-3 mb-xs-3 mb-sm-0 w-100 w-sm-auto"
                                  :class="{
                                    'mb-1': $vuetify.display.smAndDown,
                                    'mb-0': !$vuetify.display.smAndDown,
                                  }"
                                  :disabled="
                                    !(
                                      $ability.can(
                                        'update',
                                        'update-facility',
                                      ) &&
                                      $ability.can('update', 'reject-facility')
                                    )
                                  "
                                >
                                  Schedule Maintenance
                                </v-btn>
                              </v-col>
                              <v-col cols="12" sm="6" lg="3">
                                <v-btn
                                  block
                                  color="#1867C0"
                                  @click="goToFacilityAdd"
                                  class="mx-0 w-100 w-sm-auto"
                                  :disabled="
                                    !$ability.can('create', 'create-facility')
                                  "
                                >
                                  Add Facility
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-list
                      v-if="$vuetify.display.smAndUp"
                      class="pa-0"
                      density="compact"
                    >
                      <v-list-item class="pt-1 px-8">
                        <v-list-item-title>
                          <v-row no-gutters>
                            <v-col
                              cols="12"
                              sm="5"
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
                                  Facility Name
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" sm="3" class="text my-1">
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

                            <v-col cols="12" sm="4" class="text my-1">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Scheduled Maintenance
                                </span>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider v-if="$vuetify.display.lgAndUp || $vuetify.display.xs"></v-divider>
                    </v-list>
                  </template>
                  <!-- items -->
                  <template
                    v-if="$vuetify.display.lgAndUp"
                    #default="{ items }"
                  >
                    <v-list class="pa-0" density="compact">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="item.raw._id"
                      >
                        <v-list-item
                          :class="`py-4 ${
                            $vuetify.display.mdAndUp ? 'px-8' : 'px-4'
                          }`"
                        >
                          <template #default>
                            <v-list-item-title>
                              <v-row no-gutters>
                                <v-col
                                  cols="12"
                                  lg="5"
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
                                        <v-icon
                                          :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-1'}`"
                                        >
                                          mdi-office-building
                                        </v-icon>
                                        {{ item.raw.name }}
                                      </v-row>
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  lg="3"
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
                                        class="text-white"
                                        :style="`background-color: ${
                                          item.raw.status === 'active'
                                            ? '#4CAF50'
                                            : '#F44336'
                                        }`"
                                      >
                                        {{ item.raw.status }}
                                      </v-chip>
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  lg="3"
                                  class="text text-capitalize mb-2"
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
                                      >Scheduled Maintenance:
                                    </span>
                                    <span
                                      class="text-truncate mt-1"
                                      :style="
                                        $vuetify.display.smAndDown
                                          ? 'font-size: .8rem;'
                                          : ''
                                      "
                                      v-if="
                                        isAllCurrentAndFutureDatesOnly(
                                          item.raw.maintenanceDates,
                                          item.raw.maintenanceWeekly,
                                          item.raw.maintenanceMonthly,
                                        )
                                      "
                                    >
                                      <v-btn
                                        flat
                                        variant="text"
                                        @click="
                                          openViewScheduledMaintenanceDialog(
                                            item.raw,
                                            'view scheduled maintenance',
                                          )
                                        "
                                      >
                                        <v-icon start size="large">
                                          mdi-wrench-clock
                                        </v-icon>
                                        view
                                      </v-btn>
                                    </span>
                                    <span
                                      class="text-truncate mt-1 ml-2"
                                      :style="
                                        $vuetify.display.smAndDown
                                          ? 'font-size: .8rem;'
                                          : ''
                                      "
                                      v-else
                                    >
                                      N/A
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="1"
                                  :class="`text ${
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                    justify="end"
                                  >
                                    <v-menu>
                                      <template #activator="{ props }">
                                        <v-icon
                                          v-bind="props"
                                          class="pa-4 rounded-xl border-md"
                                          density="compact"
                                          >mdi-dots-vertical</v-icon
                                        >
                                      </template>

                                      <v-card>
                                        <v-list-item
                                          @click="
                                            useRouter().push({
                                              name: 'facilities-id',
                                              params: { id: item.raw._id },
                                            })
                                          "
                                          :disabled="
                                            !(
                                              $ability.can(
                                                'update',
                                                'update-facility',
                                              ) &&
                                              $ability.can(
                                                'update',
                                                'cancel-facility',
                                              )
                                            )
                                          "
                                        >
                                          <template #title>
                                            <span class="text-caption">
                                              Edit
                                            </span>
                                          </template>
                                        </v-list-item>

                                        <v-divider></v-divider>

                                        <v-list-item
                                          @click="
                                            dialogDelete = true;
                                            selectedFacility = item.raw._id;
                                          "
                                          :disabled="
                                            !(
                                              $ability.can(
                                                'update',
                                                'update-facility',
                                              ) &&
                                              $ability.can(
                                                'update',
                                                'cancel-facility',
                                              )
                                            )
                                          "
                                        >
                                          <template #title>
                                            <span class="text-caption">
                                              Delete
                                            </span>
                                          </template>
                                        </v-list-item>
                                      </v-card>
                                    </v-menu>
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
                  <template v-else #default="{ items }">
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="item.raw._id"
                      >
                        <v-list-item class="px-4">
                          <v-list-item-title
                            :class="
                              $vuetify.display.smAndDown || $vuetify.display.md
                                ? 'py-2 border-md px-2 rounded-lg mb-0 my-2'
                                : 'py-0 px-2 mx-2 my-0 text-body-2'
                            "
                          >
                            <v-row no-gutters align="center">
                              <v-col
                                cols="12"
                                sm="5"
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
                                    class="mr-2 d-flex d-sm-none font-weight-bold"
                                    >Facility Name:
                                  </span>
                                  <span
                                    class="d-inline-block text-truncate text-capitalize text-body-2"
                                  >
                                    <v-row no-gutters>
                                      <v-icon
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-1'}`"
                                      >
                                        mdi-office-building
                                      </v-icon>
                                      {{ item.raw.name }}
                                    </v-row>
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                cols="12"
                                sm="3"
                                class="text text-capitalize mb-2"
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
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-chip
                                      size="small"
                                      class="text-white"
                                      :style="`background-color: ${
                                        item.raw.status === 'active'
                                          ? '#4CAF50'
                                          : '#F44336'
                                      }`"
                                    >
                                      {{ item.raw.status }}
                                    </v-chip>
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                cols="12"
                                sm="3"
                                class="text text-capitalize mb-2"
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
                                    >Scheduled Maintenance:
                                  </span>
                                  <span
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                    v-if="
                                      isAllCurrentAndFutureDatesOnly(
                                        item.raw.maintenanceDates,
                                        item.raw.maintenanceWeekly,
                                        item.raw.maintenanceMonthly,
                                      )
                                    "
                                  >
                                    <v-btn
                                      flat
                                      variant="text"
                                      @click="
                                        openViewScheduledMaintenanceDialog(
                                          item.raw,
                                          'view scheduled maintenance',
                                        )
                                      "
                                    >
                                      <v-icon start size="large">
                                        mdi-wrench-clock
                                      </v-icon>
                                      view
                                    </v-btn>
                                  </span>
                                  <span
                                    class="text-truncate mt-1 ml-2"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                    v-else
                                  >
                                    N/A
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="1"
                                class="text-capitalize white--text d-flex align-center d-flex justify-center"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  justify="end"
                                  align-content="end"
                                  align="end"
                                >
                                  <v-menu>
                                    <template #activator="{ props }">
                                      <v-icon
                                        v-bind="props"
                                        class="pa-4 rounded-xl border-md"
                                        density="compact"
                                        >mdi-dots-vertical</v-icon
                                      >
                                    </template>

                                    <v-card>
                                      <v-list
                                        density="compact"
                                        class="text-caption pa-0"
                                      >
                                        <v-list-item
                                          @click="
                                            useRouter().push({
                                              name: 'facilities-id',
                                              params: { id: item.raw._id },
                                            })
                                          "
                                          :disabled="
                                            !(
                                              $ability.can(
                                                'update',
                                                'update-facility',
                                              ) &&
                                              $ability.can(
                                                'update',
                                                'cancel-facility',
                                              )
                                            )
                                          "
                                        >
                                          View & Edit
                                        </v-list-item>
                                        <v-list-item
                                          @click="
                                            dialogDelete = true;
                                            selectedFacility = item.raw._id;
                                          "
                                          :disabled="
                                            !(
                                              $ability.can(
                                                'update',
                                                'update-facility',
                                              ) &&
                                              $ability.can(
                                                'update',
                                                'cancel-facility',
                                              )
                                            )
                                          "
                                        >
                                          Delete
                                        </v-list-item>

                                        <VisitorsUpdatePassKeyStatus
                                          v-if="
                                            item.raw.type == 'contractor' &&
                                            (!item.raw.isKeyReturned ||
                                              !item.raw.isPassReturned) &&
                                            $ability.can(
                                              'read',
                                              'view-visitors',
                                            )
                                          "
                                          :visitorInfo="item.raw"
                                        />
                                      </v-list>
                                    </v-card>
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
                  <!-- row without data -->
                  <template #no-data>
                    <v-row no-gutters justify="center" class="pa-16">
                      <v-col cols="12">
                        <v-row no-gutters justify="center">
                          <v-img
                            src="/images/facility/facility.svg"
                            width="100px"
                            height="100px"
                          ></v-img>
                        </v-row>
                      </v-col>

                      <v-col cols="12" class="mt-6">
                        <v-row no-gutters justify="center">
                          <span class="text-center">
                            <span
                              class=""
                              style="
                                font-size: 32px;
                                font-style: normal;
                                font-weight: 500;
                                line-height: 32px;
                              "
                            >
                              Facilities
                            </span>
                            <br />
                            <span
                              style="
                                font-size: 16px;
                                font-style: normal;
                                font-weight: 400;
                                line-height: 19px;
                              "
                            >
                              You don't have list of facilities yet.
                            </span>
                          </span>
                        </v-row>
                        <v-row no-gutters justify="center" class="mt-2">
                          <v-btn
                            rounded="lg"
                            color="#1867C0"
                            class="px-6"
                            @click="goToFacilityAdd"
                          >
                            Add facility
                          </v-btn>
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
              <span>{{ pageRange }}</span>
              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="canPrevPage"
                @click="prevPage({ sites: [mySite] })"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="!canNextPage"
                @click="nextPage({ sites: [mySite] })"
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
      location="center"
      :width="dialogType == 'view scheduled maintenance' ? '50vh' : '130vh'"
      :style="`margin-left: ${$vuetify.display.mdAndUp ? '40' : '8'}px;`"
    >
      <v-card
        :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
        :class="`${theme == 'light' && 'bg-white'} px-3 h-100 `"
        :loading="
          dialogType !== 'delete facility'
            ? isAffectedBookingsLoading
            : isFacilityBookingsLoaded
        "
      >
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
          <span class="font-weight-bold pl-4 pt-1 text-capitalize">
            {{
              dialogType == "view scheduled maintenance"
                ? "Scheduled Maintenance"
                : "Affected Bookings"
            }}
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
          <v-col cols="12">
            <v-row no-gutters>
              <div v-if="dialogType == 'view scheduled maintenance'">
                Below is the list of all the scheduled maintenance:
              </div>

              <!-- weekly maintenance -->
              <v-col
                v-if="
                  maintenanceWeekly.length &&
                  !(affectedBookings?.items.length && facilityBookings.length)
                "
                cols="12"
                class="mt-5"
              >
                <span class="font-weight-bold"> Weekly:</span>
                <v-row no-gutters>
                  <v-col
                    v-for="(selectedWeekDay, i) in maintenanceWeekly"
                    :key="i"
                    cols="12"
                    class="ma-2"
                  >
                    {{ selectedWeekDay }}
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <!-- monthly maintenance -->
              <v-col
                v-if="
                  maintenanceMonthly.length &&
                  !(affectedBookings?.items.length && facilityBookings.length)
                "
                cols="12"
                class="mt-3"
              >
                <span class="font-weight-bold"> Monthly:</span>
                <v-row no-gutters>
                  <v-col
                    v-for="(selectedMonthDay, i) in maintenanceMonthly"
                    :key="i"
                    :cols="selectedMonthDay !== 'Last day' ? 2 : 3"
                    class="ma-2"
                  >
                    {{ selectedMonthDay }},
                  </v-col>
                </v-row>
              </v-col>

              <!-- tabs -->
              <v-col
                v-if="dialogType !== 'view scheduled maintenance'"
                cols="12"
                class="mt-5"
              >
                <v-row no-gutters>
                  <v-col
                    cols="6"
                    md="4"
                    class="text-center"
                    @click="affectedBookingsTab = 'approved'"
                    style="cursor: pointer"
                  >
                    APPROVED
                    <v-divider
                      class="mt-2"
                      thickness="5"
                      :style="`
                              color: ${theme == 'dark' ? 'white' : 'black'};
                              font-size: 14px;
                              font-weight: 500;
                              line-height: 36px;`"
                      v-if="affectedBookingsTab === 'approved'"
                    ></v-divider>
                  </v-col>
                  <v-col
                    cols="6"
                    md="4"
                    class="text-center"
                    @click="affectedBookingsTab = 'pending'"
                    style="cursor: pointer"
                  >
                    PENDING
                    <v-divider
                      class="mt-2"
                      thickness="5"
                      :style="`
                              color: ${theme == 'dark' ? 'white' : 'black'};
                              font-size: 14px;
                              font-weight: 500;
                              line-height: 36px;`"
                      v-if="affectedBookingsTab === 'pending'"
                    ></v-divider>
                  </v-col>
                </v-row>
              </v-col>

              <div
                v-if="affectedBookings?.items.length || facilityBookings.length"
                class="my-3"
              >
                {{
                  `Below is the list of all the affected ${affectedBookingsTab} bookings that needs to be ${affectedBookingsTab !== "pending" ? "CANCELLED" : "REJECTED"} in order to ${dialogType == "delete facility" ? "delete the facility" : "schedule the maintenance"}`
                }}
                :
              </div>

              <v-col cols="12" class="mt-3">
                <v-divider
                  v-if="
                    maintenanceDates.length ||
                    affectedBookings?.items.length ||
                    facilityBookings.length
                  "
                ></v-divider>
                <v-data-iterator
                  :items="
                    dialogType == 'view scheduled maintenance'
                      ? maintenanceDates
                      : dialogType !== 'delete facility'
                        ? affectedBookings?.items
                        : facilityBookings
                  "
                  :items-per-page="
                    dialogType == 'view scheduled maintenance'
                      ? maintenanceDates.length
                      : dialogType !== 'delete facility'
                        ? affectedBookings?.items.length
                        : itemsPerPage
                  "
                >
                  <!-- header -->
                  <template v-slot:header>
                    <v-list
                      class="pa-0 pt-0"
                      density="compact"
                      v-if="
                        ($vuetify.display.mdAndUp && maintenanceDates.length) ||
                        affectedBookings?.items.length ||
                        facilityBookings.length
                      "
                    >
                      <v-list-item
                        :class="`px-${$vuetify.display.mdAndUp ? '8' : '5'}`"
                      >
                        <v-list-item-title>
                          <v-row no-gutters>
                            <v-col
                              v-if="dialogType !== 'view scheduled maintenance'"
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
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Facility
                                </span>
                              </v-row>
                            </v-col>
                            <v-col
                              v-if="dialogType !== 'view scheduled maintenance'"
                              cols="12"
                              md="5"
                              class="text-capitalize text"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Name
                                </span>
                              </v-row>
                            </v-col>
                            <v-col
                              v-if="dialogType == 'view scheduled maintenance'"
                              cols="12"
                              md="6"
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
                                  Date
                                </span>
                              </v-row>
                            </v-col>
                            <v-col
                              v-if="dialogType !== 'view scheduled maintenance'"
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
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Book Date/Slot
                                </span>
                              </v-row>
                            </v-col>
                            <v-col
                              v-if="dialogType !== 'view scheduled maintenance'"
                              cols="12"
                              md="2"
                              class="text"
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
                    <v-list
                      v-if="
                        maintenanceDates.length ||
                        affectedBookings?.items.length ||
                        facilityBookings.length
                      "
                      :class="`pa-0 pt-${$vuetify.display.mdAndUp ? '0' : '5'}`"
                      density="compact"
                    >
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="item.raw._id"
                      >
                        <v-list-item
                          :class="`px-${$vuetify.display.mdAndUp ? '8' : '5'}`"
                        >
                          <template #default>
                            <v-list-item-title>
                              <v-row no-gutters>
                                <v-col
                                  v-if="
                                    dialogType !== 'view scheduled maintenance'
                                  "
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
                                      class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                    >
                                      <v-icon
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-3'}`"
                                      >
                                        mdi-office-building
                                      </v-icon>
                                      {{ item.raw.facilityName }}
                                    </span>
                                  </v-row>
                                </v-col>
                                <v-col
                                  v-if="
                                    dialogType !== 'view scheduled maintenance'
                                  "
                                  cols="12"
                                  md="5"
                                  class="text-capitalize text"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
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
                                            {{ item.raw.userGivenName }}
                                            {{ item.raw.userSurname }}
                                          </div>
                                          <div class="text-caption text-grey">
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
                                  v-if="
                                    dialogType == 'view scheduled maintenance'
                                  "
                                  cols="12"
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
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mr-2' : `mr-4 ${dialogType == 'view scheduled maintenance' ? 'ml-3' : ''}`}`"
                                      >
                                        mdi-calendar-month-outline
                                      </v-icon>
                                      {{
                                        standardFormatDate(
                                          dialogType !==
                                            "view scheduled maintenance"
                                            ? item.raw.date
                                            : item.raw,
                                        )
                                      }}
                                    </span>
                                  </v-row>
                                </v-col>
                                <v-col
                                  v-if="
                                    dialogType !== 'view scheduled maintenance'
                                  "
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
                                      <v-row no-gutters>
                                        <v-col cols="12">
                                          <v-icon
                                            size="small"
                                            :class="`${$vuetify.display.mdAndUp ? 'mr-2' : `mr-4 ${dialogType == 'view scheduled maintenance' ? 'ml-3' : ''}`}`"
                                          >
                                            mdi-calendar-month-outline
                                          </v-icon>
                                          {{
                                            standardFormatDate(
                                              dialogType !==
                                                "view scheduled maintenance"
                                                ? item.raw.date
                                                : item.raw,
                                            )
                                          }}
                                        </v-col>
                                        <v-col cols="12">
                                          <v-icon
                                            size="small"
                                            :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-4'}`"
                                          >
                                            mdi-clock-outline
                                          </v-icon>
                                          {{ item.raw.slotName }}
                                        </v-col>
                                      </v-row>
                                    </span>
                                  </v-row>
                                </v-col>
                                <v-col
                                  v-if="
                                    dialogType !== 'view scheduled maintenance'
                                  "
                                  cols="12"
                                  md="2"
                                  class="text"
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
                                      class="d-inline-block text-caption text-capitalize font-weight-bold"
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
                  <!-- row without data -->
                  <template
                    v-if="dialogType !== 'view scheduled maintenance'"
                    #no-data
                  >
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
                          <span class="font-weight-bold text-caption">
                            {{
                              `No affected ${affectedBookingsTab} bookings found.`
                            }}
                          </span>
                        </v-row>
                      </v-col>
                    </v-row>
                  </template>
                </v-data-iterator>
              </v-col>

              <v-divider
                v-if="
                  maintenanceDates.length ||
                  affectedBookings?.items.length ||
                  facilityBookings.length
                "
              ></v-divider>

              <!-- pagination -->
              <v-col
                cols="12"
                class="py-4"
                v-if="affectedBookings?.items.length || facilityBookings.length"
              >
                <v-row no-gutters align-content="center">
                  <v-col
                    cols="12"
                    md="3"
                    v-if="dialogType !== 'delete facility'"
                  >
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
                  <v-col cols="12" md="3">
                    <span>
                      {{
                        dialogType !== "delete facility"
                          ? affectedBookings?.pageRange
                          : bookingPageRange
                      }}
                    </span>
                    <v-btn
                      density="compact"
                      variant="text"
                      icon
                      class="mx-2"
                      :disabled="
                        dialogType !== 'delete facility'
                          ? canPrevAffectedBookingsPage
                          : canPrevBookingPage
                      "
                      @click="
                        dialogType !== 'delete facility'
                          ? prevAffectedBookingsPage()
                          : prevBookingPage({
                              facility: String(selectedFacility),
                              site: String(mySite),
                              status: affectedBookingsTab,
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
                      :disabled="
                        dialogType !== 'delete facility'
                          ? !canNextAffectedBookingsPage
                          : !canNextBookingPage
                      "
                      @click="
                        dialogType !== 'delete facility'
                          ? nextAffectedBookingsPage()
                          : nextBookingPage({
                              facility: String(selectedFacility),
                              site: String(mySite),
                              status: affectedBookingsTab,
                            })
                      "
                    >
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>

          <!-- remarks -->
          <v-col
            v-if="affectedBookings?.items.length || facilityBookings.length"
            cols="12"
            md="6"
          >
            <v-textarea
              v-model="remarks"
              label="Remarks"
              placeholder="Remarks"
              rows="3"
              dense
            ></v-textarea>
          </v-col>

          <!-- cancel/reject / close -->
          <v-col
            v-if="
              maintenanceDates.length ||
              maintenanceWeekly.length ||
              maintenanceMonthly.length ||
              affectedBookings?.items.length ||
              facilityBookings.length
            "
            cols="12"
          >
            <v-row no-gutters>
              <v-btn
                flat
                color="error"
                class="font-weight-bold mr-4"
                @click="cancel(dialogType)"
                :loading="loading"
                :disabled="
                  dialogType !== 'view scheduled maintenance'
                    ? !remarks ||
                      !(
                        $ability.can('update', 'update-facility') &&
                        $ability.can('update', 'cancel-facility')
                      )
                    : (selectedMaintenanceDates.length === 0 &&
                        selectedMaintenanceWeekly.length === 0 &&
                        selectedMaintenanceMonthly.length === 0) ||
                      !$ability.can('update', 'update-facility')
                "
              >
                {{
                  dialogType !== "view scheduled maintenance"
                    ? !facilityBookings.length
                      ? `${affectedBookings?.items.filter((i) => i.status == "approved").length ? "Cancel" : "Reject"}`
                      : `${facilityBookings?.filter((i) => i.status == "approved").length ? "Cancel" : "Reject"}`
                    : "Cancel"
                }}
                All
              </v-btn>
              <v-btn
                flat
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

    <!-- delete -->
    <v-dialog v-model="dialogDelete" max-width="420px" persistent>
      <v-card rounded="lg">
        <v-card-title class="d-flex justify-end align-center">
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="dialogDelete = false"
          ></v-btn>
        </v-card-title>

        <v-card-text>
          <div class="text-center">
            <v-img height="129px" src="/images/facility/trash.svg"></v-img>
          </div>
          <div class="mt-6 text-center">
            Are you sure you want to delete this facility
          </div>
        </v-card-text>
        <v-btn
          flat
          color="#1867C0"
          size="large"
          class="mx-6 mb-6"
          @click="removeFacility()"
          :loading="loading"
        >
          Yes
        </v-btn>
      </v-card>
    </v-dialog>

    <!-- create schedule maintenance-->
    <v-dialog
      v-model="dialogScheduleMaintenance"
      class="mx-auto"
      max-width="344"
      persistent
    >
      <v-card rounded="lg">
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-h6">Schedule Maintenance</div>
          <v-btn icon="mdi-close" variant="text" @click="closeDialog()"></v-btn>
        </v-card-title>

        <v-select
          class="mx-4"
          label="Facility"
          placeholder="Select Facility"
          hide-details
          clearable
          item-title="name"
          item-value="_id"
          :items="facilitiesSelectList"
          v-model:model-value="selectedFacility"
          @update:modelValue="selectFacility"
        ></v-select>

        <v-row class="mx-5 my-5" no-gutters justify="center">
          <v-card>
            <v-date-picker
              color="#EB261E"
              show-adjacent-months
              hide-header
              style="width: 100%"
              multiple
              :min="minDate"
              v-model="maintenanceDates"
              :disabled="!selectedFacility"
            ></v-date-picker>
          </v-card>
        </v-row>

        <v-row class="mx-5" no-gutters>
          Weekly
          <v-col cols="12">
            <v-autocomplete
              v-model="selectedMaintenanceWeekly"
              :items="weekDays"
              item-title="text"
              item-value="value"
              label="Select week day(s)"
              density="compact"
              hide-details
              chips
              closable-chips
              multiple
              clearable
              :disabled="!selectedFacility"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row class="mx-5 mt-5" no-gutters>
          Monthly
          <v-col cols="12">
            <v-autocomplete
              v-model="selectedMaintenanceMonthly"
              :items="monthDays"
              item-title="text"
              item-value="value"
              label="Select month day(s)"
              density="compact"
              hide-details
              chips
              closable-chips
              multiple
              clearable
              :disabled="!selectedFacility"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row class="mx-5 mt-5" no-gutters>
          <v-btn
            block
            flat
            color="#EB261E"
            size="large"
            class="mb-6"
            @click="onConfirmMaintenance"
            :disabled="
              !selectedFacility ||
              (maintenanceDates.length === 0 &&
                selectedMaintenanceWeekly.length === 0 &&
                selectedMaintenanceMonthly.length === 0)
            "
            :loading="loading"
          >
            Confirm
          </v-btn>
        </v-row>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

import debounce from "lodash/debounce";
const { $ability } = useNuxtApp();

const selectAll = ref(false);

const dialog = ref(false);
const dialogType = ref("");
const { theme } = useLocal();
const remarks = ref("");
const loading = ref(false);

const { mySite } = useFilter();

const { setSnackbar } = useLocal();
const { getInitial, materialColors, standardFormatDate } = useUtils();
const {
  search,
  isFacilitiesLoaded,
  setFacilities,
  updateMaintenance,
  getAffectedBookings,
  deleteFacility,
  facilities,
  itemsPerPage,
  pageRange,
  nextPage,
  prevPage,
  canNextPage,
  canPrevPage,
  affectedBookingsTab,
} = useFacility();

const {
  bookingPageRange,
  canPrevBookingPage,
  canNextBookingPage,
  setFacilityBookings,
  isFacilityBookingsLoaded,
  nextBookingPage,
  prevBookingPage,
  facilityBookings,
  updateStatus,
} = useFacilityBookings();

const dialogDelete = ref(false);
const dialogScheduleMaintenance = ref(false);
const selectedFacility = ref(null);
const maintenanceDates = ref<Date[]>([]);
const selectedMaintenanceDates = ref<Date[]>([]);

const maintenanceWeekly = ref<String[]>([]);
const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const selectedMaintenanceWeekly = ref<String[]>([]);

const maintenanceMonthly = ref<String[]>([]);

const monthDays = Array.from({ length: 28 }, (_, i) => {
  const num = i + 1;
  const suffix = (num: any) => {
    if (num % 10 === 1 && num % 100 !== 11) return "st";
    if (num % 10 === 2 && num % 100 !== 12) return "nd";
    if (num % 10 === 3 && num % 100 !== 13) return "rd";
    return "th";
  };
  return `${num}${suffix(num)}`;
});

monthDays.push("Last day");

const selectedMaintenanceMonthly = ref<String[]>([]);

const isAffectedBookingsLoading = ref(false);
const affectedBookings = ref<any>(null);

const currentPage = ref(1);
const totalPages = ref(0);

const canNextAffectedBookingsPage = computed(
  () => totalPages.value > currentPage.value,
);
const canPrevAffectedBookingsPage = computed(() => currentPage.value <= 1);

const pageRanges = ref([1, 2, 10, 20, 30, 40, 50]);
const selectedPageRange = ref(10);

const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().substr(0, 10);
});

function addOrdinalSuffixes(days: any) {
  return days.map((num: any) => {
    const suffix = (num: any) => {
      if (num % 10 === 0 && num % 100 !== 10) return "th";
      if (num % 10 === 1 && num % 100 !== 11) return "st";
      if (num % 10 === 2 && num % 100 !== 12) return "nd";
      if (num % 10 === 3 && num % 100 !== 13) return "rd";
      if (num % 10 === 4 && num % 100 !== 14) return "th";
      if (num % 10 === 5 && num % 100 !== 15) return "th";
      if (num % 10 === 6 && num % 100 !== 16) return "th";
      if (num % 10 === 7 && num % 100 !== 17) return "th";
      if (num % 10 === 8 && num % 100 !== 18) return "th";
      if (num % 10 === 9 && num % 100 !== 19) return "th";
      return num !== "Last day" ? "th" : "";
    };
    return `${num}${suffix(num)}`;
  });
}

function removeOrdinalSuffixes(days: any) {
  return days.map((day: any) => {
    if (typeof day === "string") {
      return parseInt(day, 10) || day;
    }
    return day;
  });
}

function selectFacility() {
  if (selectedFacility.value) {
    selectedMaintenanceWeekly.value = [];
    selectedMaintenanceMonthly.value = [];
    const facility = facilities.value.find(
      (facility: TFacility) => facility._id == selectedFacility.value,
    );

    if (Array.isArray(facility?.maintenanceDates)) {
      maintenanceDates.value = facility.maintenanceDates
        .filter(
          (date: any) =>
            date >= new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        )
        .map((date: any) => new Date(date));
    }

    if (Array.isArray(facility?.maintenanceWeekly)) {
      selectedMaintenanceWeekly.value = facility?.maintenanceWeekly;
    }

    if (Array.isArray(facility?.maintenanceMonthly)) {
      selectedMaintenanceMonthly.value = addOrdinalSuffixes(
        facility?.maintenanceMonthly,
      );
    }
  }
}

const onConfirmMaintenance = async () => {
  loading.value = true;
  try {
    const result: any = await updateMaintenance({
      _id: String(selectedFacility.value),
      maintenanceDates: maintenanceDates.value,
      maintenanceWeekly: selectedMaintenanceWeekly.value,
      maintenanceMonthly: removeOrdinalSuffixes(
        selectedMaintenanceMonthly.value,
      ),
      site: String(mySite.value),
    });

    if (result?.bookedSlots) {
      dialogScheduleMaintenance.value = false;
      // fetch the affected scheduled maintenance
      isAffectedBookingsLoading.value = true;
      affectedBookings.value = await getAffectedBookings({
        limit: selectedPageRange.value,
        facility: String(selectedFacility.value),
        site: String(mySite.value),
        maintenanceDates: maintenanceDates.value,
        maintenanceWeekly: selectedMaintenanceWeekly.value,
        maintenanceMonthly: removeOrdinalSuffixes(
          selectedMaintenanceMonthly.value,
        ),
        status: affectedBookingsTab.value,
      });
      const approvedAffectedBookings = affectedBookings.value.items.filter(
        (i: any) => i.status == "approved",
      );
      if (approvedAffectedBookings.length) {
        affectedBookingsTab.value = "approved";
      } else {
        affectedBookingsTab.value = "pending";
      }
      totalPages.value = affectedBookings.value.pages;
      isAffectedBookingsLoading.value = false;
      dialogType.value = "affected bookings";
      dialog.value = true;
    } else if (result?._id) {
      setSnackbar({
        text: "Maintenance successfully scheduled." as string,
        modal: true,
        type: "success",
      });
      await setFacilities({ sites: [mySite.value] });
      dialogScheduleMaintenance.value = false;
    } else {
      setSnackbar({
        text: "Schedule maintenance failed. Unexpected error occurred." as string,
        modal: true,
        type: "error",
      });
    }
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  loading.value = false;
};

watchEffect(() => {
  if (selectedMaintenanceDates.value.length == maintenanceDates.value.length) {
    selectAll.value = true;
  } else {
    selectAll.value = false;
  }
});

const facilitiesSelectList = ref<({ _id: string; name: string } | [])[]>([]);

watchEffect(() => {
  facilitiesSelectList.value = facilities.value.map((facility: any) => ({
    _id: String(facility._id),
    name: String(facility.name),
  }));
});

watch(
  affectedBookingsTab,
  async (newValue: string) => {
    if (dialogType.value == "affected bookings") {
      isAffectedBookingsLoading.value = true;
      affectedBookings.value.items = [];
      affectedBookings.value = await getAffectedBookings({
        limit: selectedPageRange.value,
        facility: String(selectedFacility.value),
        site: String(mySite.value),
        maintenanceDates: maintenanceDates.value,
        maintenanceWeekly: selectedMaintenanceWeekly.value,
        maintenanceMonthly: removeOrdinalSuffixes(
          selectedMaintenanceMonthly.value,
        ),
        status: newValue,
      });

      if (affectedBookings.value.items.length) {
        totalPages.value = affectedBookings.value.pages;
      }
      isAffectedBookingsLoading.value = false;
    }

    if (dialogType.value == "delete facility") {
      isFacilityBookingsLoaded.value = true;
      facilityBookings.value = [];
      await setFacilityBookings({
        facility: String(selectedFacility.value),
        site: String(mySite.value),
        status: newValue,
      });
      isFacilityBookingsLoaded.value = false;
    }
  },
  { deep: true },
);

onMounted(async () => {
  await setFacilities({ sites: [mySite.value] });
});

watch(search, (newValue: string) => {
  debouncedSearch(newValue);
});

const debouncedSearch = debounce(async (value: string) => {
  await setFacilities({ sites: [mySite.value] });
}, 500);

function goToFacilityAdd() {
  useRouter().push({ name: "facilities-add" });
}

function isAllCurrentAndFutureDatesOnly(dates: any, weekly: any, monthly: any) {
  return (
    dates.filter(
      (date: any) =>
        date >= new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
    ).length ||
    weekly?.length ||
    monthly?.length
  );
}

function openViewScheduledMaintenanceDialog(item: any, type: string) {
  dialogType.value = type;
  selectedFacility.value = item._id;
  maintenanceDates.value = item.maintenanceDates.filter(
    (date: string) =>
      date >= new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
  );
  selectedMaintenanceDates.value = maintenanceDates.value;
  maintenanceWeekly.value = item.maintenanceWeekly || [];
  selectedMaintenanceWeekly.value = maintenanceWeekly.value;
  maintenanceMonthly.value = addOrdinalSuffixes(item.maintenanceMonthly) || [];
  selectedMaintenanceMonthly.value = maintenanceMonthly.value;
  selectAll.value = true;
  dialog.value = true;
}

async function updateItemsPerPage() {
  isAffectedBookingsLoading.value = true;
  affectedBookings.value = await getAffectedBookings({
    limit: selectedPageRange.value,
    page: currentPage.value,
    facility: String(selectedFacility.value),
    site: String(mySite.value),
    maintenanceDates: maintenanceDates.value,
    maintenanceWeekly: selectedMaintenanceWeekly.value,
    maintenanceMonthly: removeOrdinalSuffixes(selectedMaintenanceMonthly.value),
    status: affectedBookingsTab.value,
  });
  totalPages.value = affectedBookings.value.pages;
  isAffectedBookingsLoading.value = false;
}

async function prevAffectedBookingsPage() {
  isAffectedBookingsLoading.value = true;
  currentPage.value -= 1;
  affectedBookings.value = await getAffectedBookings({
    limit: selectedPageRange.value,
    page: currentPage.value,
    facility: String(selectedFacility.value),
    site: String(mySite.value),
    maintenanceDates: maintenanceDates.value,
    maintenanceWeekly: selectedMaintenanceWeekly.value,
    maintenanceMonthly: removeOrdinalSuffixes(selectedMaintenanceMonthly.value),
    status: affectedBookingsTab.value,
  });
  isAffectedBookingsLoading.value = false;
}

async function nextAffectedBookingsPage() {
  isAffectedBookingsLoading.value = true;
  currentPage.value += 1;
  affectedBookings.value = await getAffectedBookings({
    limit: selectedPageRange.value,
    page: currentPage.value,
    facility: String(selectedFacility.value),
    site: String(mySite.value),
    maintenanceDates: maintenanceDates.value,
    maintenanceWeekly: selectedMaintenanceWeekly.value,
    maintenanceMonthly: removeOrdinalSuffixes(selectedMaintenanceMonthly.value),
    status: affectedBookingsTab.value,
  });
  isAffectedBookingsLoading.value = false;
}

async function removeFacility() {
  loading.value = true;
  try {
    const result = await deleteFacility({
      _id: String(selectedFacility.value),
      site: String(mySite.value),
    });
    if (result) {
      if (result?.isWithBookedSlot) {
        await setFacilityBookings({
          facility: String(selectedFacility.value),
          site: String(mySite.value),
          status: affectedBookingsTab.value,
        });
        const approvedAffectedBookings = facilityBookings.value.filter(
          (i: any) => i.status == "approved",
        );
        if (approvedAffectedBookings.length) {
          affectedBookingsTab.value = "approved";
        } else {
          affectedBookingsTab.value = "pending";
        }
        dialogType.value = "delete facility";
        dialog.value = true;
      } else if (result?.status == "deleted") {
        setSnackbar({
          text: "Facility successfully deleted." as string,
          modal: true,
          type: "success",
        });
        await setFacilities({ sites: [mySite.value] });
      } else {
        setSnackbar({
          text: "Failed to delete facility. Unexpected error occurred." as string,
          modal: true,
          type: "error",
        });
      }
    } else {
      setSnackbar({
        text: "Failed to delete facility. Unexpected error occurred." as string,
        modal: true,
        type: "error",
      });
    }
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  dialogDelete.value = false;
  loading.value = false;
}

async function cancel(type: string) {
  loading.value = true;
  try {
    if (type == "view scheduled maintenance") {
      await updateMaintenance({
        _id: String(selectedFacility.value),
        maintenanceDates: null,
        maintenanceWeekly: null,
        maintenanceMonthly: null,
        site: String(mySite.value),
      });
      setSnackbar({
        text: "All scheduled maintenances has been successfully cancelled." as string,
        modal: true,
        type: "success",
      });
      await closeDialog();
      await setFacilities({ sites: [mySite.value] });
    } else {
      const _approvedIds = !facilityBookings.value.length
        ? affectedBookings.value.items
            .filter((item: any) => item.status == "approved")
            .map((item: TFacilityBooking) => item._id)
        : facilityBookings.value
            .filter((item: any) => item.status == "approved")
            .map((item: TFacilityBooking) => item._id);

      if (_approvedIds.length) {
        await updateStatus({
          _ids: _approvedIds,
          site: mySite.value,
          remarks: remarks.value || "",
          status: "cancelled",
        });
      }
      const _pendingIds = !facilityBookings.value.length
        ? affectedBookings.value.items
            .filter((item: any) => item.status == "pending")
            .map((item: TFacilityBooking) => item._id)
        : facilityBookings.value
            .filter((item: any) => item.status == "pending")
            .map((item: TFacilityBooking) => item._id);

      if (_pendingIds.length) {
        await updateStatus({
          _ids: _pendingIds,
          site: mySite.value,
          remarks: remarks.value || "",
          status: "rejected",
        });
      }

      // check again if there are still affected bookings
      if (type !== "delete facility") {
        isAffectedBookingsLoading.value = true;
        affectedBookings.value = await getAffectedBookings({
          limit: selectedPageRange.value,
          facility: String(selectedFacility.value),
          site: String(mySite.value),
          maintenanceDates: maintenanceDates.value,
          maintenanceWeekly: selectedMaintenanceWeekly.value,
          maintenanceMonthly: removeOrdinalSuffixes(
            selectedMaintenanceMonthly.value,
          ),
          status: affectedBookingsTab.value,
        });
        isAffectedBookingsLoading.value = false;

        if (affectedBookings?.value.items.length) {
          totalPages.value = affectedBookings.value.pages;
          const approvedAffectedBookings = affectedBookings?.value.items.filter(
            (i: any) => i.status == "approved",
          );
          if (approvedAffectedBookings.length) {
            affectedBookingsTab.value = "approved";
          } else {
            affectedBookingsTab.value = "pending";
          }
        } else {
          setSnackbar({
            text: "Selected booked slot(s) successfully cancelled." as string,
            modal: true,
            type: "success",
          });

          await closeDialog();
          await setFacilities({ sites: [mySite.value] });
        }
      } else {
        isFacilityBookingsLoaded.value = true;
        await setFacilityBookings({
          facility: String(selectedFacility.value),
          site: String(mySite.value),
          status: affectedBookingsTab.value,
        });
        isFacilityBookingsLoaded.value = false;

        if (facilityBookings.value.length) {
          const approvedAffectedBookings = facilityBookings.value.filter(
            (i: any) => i.status == "approved",
          );
          if (approvedAffectedBookings.length) {
            affectedBookingsTab.value = "approved";
          } else {
            affectedBookingsTab.value = "pending";
          }
        } else {
          setSnackbar({
            text: "Selected booked slot(s) successfully cancelled." as string,
            modal: true,
            type: "success",
          });

          await closeDialog();
          await setFacilities({ sites: [mySite.value] });
        }
      }
    }
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  loading.value = false;
}

function closeDialog() {
  dialog.value = false;
  dialogScheduleMaintenance.value = false;
  selectedFacility.value = null;
  maintenanceDates.value = [];
  maintenanceWeekly.value = [];
  maintenanceMonthly.value = [];
  selectedMaintenanceWeekly.value = [];
  selectedMaintenanceMonthly.value = [];
  selectAll.value = false;
  remarks.value = "";
  affectedBookings.value = null;
  facilityBookings.value = [];
  currentPage.value = 1;
  totalPages.value = 0;
}
</script>

<style scoped>
.text {
  text-align: start;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}
</style>
