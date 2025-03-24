<template>
  <v-row no-gutters class="pa-8">
    <v-col
      cols="12"
      style="letter-spacing: 2px !important; font-size: 14px"
      class="fill-height mb-5 d-none d-md-inline-flex"
      align-content="center"
    >
      <v-breadcrumbs class="pa-0" :items="nav">
        <template v-slot:divider>
          <v-icon icon="mdi-chevron-right"></v-icon>
        </template>
        <template #item="{ item }">
          <v-breadcrumbs-item :to="item.to" class="text-truncate">
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </v-col>
    <v-col cols="12">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="
          residentsTab !== 'overnight parking'
            ? isUsersLoaded
            : isVisitorsLoaded
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

        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12">
                <v-data-iterator
                  :items="
                    residentsTab !== 'overnight parking'
                      ? users
                      : visitors.items
                  "
                  :items-per-page="itemsPerPage"
                  :search="search"
                >
                  <template v-slot:header>
                    <v-row no-gutters class="pa-4 fill-height" align="center">
                      <v-col cols="12" order="1">
                        <span class="font-weight-bold text-h6">
                          Residents
                        </span>
                      </v-col>
                      <v-col
                        cols="12"
                        md="4"
                        class="mb-md-0 mt-2"
                        :order="$vuetify.display.mdAndUp ? 3 : 4"
                      >
                        <v-row align="center">
                          <v-col cols="12" class="d-flex">
                            <v-text-field
                              v-model="search"
                              placeholder="Search"
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

                      <v-col
                        v-if="residentsTab === 'overnight parking'"
                        cols="12"
                        md="8"
                        :order="$vuetify.display.mdAndUp ? 4 : 3"
                      >
                        <v-row class="justify-end">
                          <!-- from -->
                          <v-col cols="12" sm="6" md="4" class="mt-5 mt-md-3">
                            <v-text-field
                              v-model="filters.from"
                              label="Start Date"
                              readonly
                              hide-details
                              append-inner-icon="mdi-calendar"
                              @click="startDateDialog = true"
                            >
                            </v-text-field>
                          </v-col>
                          <!-- to -->
                          <v-col
                            cols="12"
                            sm="6"
                            md="4"
                            class="mb-5 mb-md-3 mt-sm-5 mt-md-3"
                          >
                            <v-text-field
                              v-model="filters.to"
                              label="End Date"
                              readonly
                              hide-details
                              append-inner-icon="mdi-calendar"
                              @click="endDateDialog = true"
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
                          <v-dialog v-model="endDateDialog" max-width="355">
                            <v-card>
                              <v-card-subtitle>
                                <v-date-picker
                                  width="320"
                                  v-model="endDate"
                                  @input="updateEndDate"
                                  :locale="locale"
                                  @change="applyEndDate"
                                ></v-date-picker>
                              </v-card-subtitle>
                            </v-card>
                          </v-dialog>
                        </v-row>
                      </v-col>

                      <!-- tabs -->
                      <v-col cols="12" class="mt-5" order="2">
                        <v-row no-gutters>
                          <v-col
                            cols="6"
                            class="text-center font-weight-bold"
                            @click="residentsTab = 'residents'"
                            style="cursor: pointer; font-size: 16px"
                            :style="
                              residentsTab === 'residents'
                                ? 'border-bottom: 3px solid #0077b6; padding: .5rem; color: #0077b6;'
                                : 'border-bottom: 3px solid gray; padding: .5rem'
                            "
                          >
                            Residents
                          </v-col>
                          <v-col
                            cols="6"
                            class="text-center font-weight-bold"
                            @click="residentsTab = 'overnight parking'"
                            style="cursor: pointer; font-size: 16px"
                            :style="
                              residentsTab === 'overnight parking'
                                ? 'border-bottom: 3px solid #0077b6; padding: .5rem; color: #0077b6;'
                                : 'border-bottom: 3px solid gray; padding: .5rem'
                            "
                          >
                            Overnight Parking
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
                      <v-list-item class="px-8">
                        <v-list-item-title>
                          <v-row no-gutters>
                            <v-col
                              cols="12"
                              :sm="residentsTab !== 'overnight parking' ? 4 : 4"
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
                                  <span
                                    v-if="residentsTab == 'overnight parking'"
                                    >/Email
                                  </span>
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              :sm="residentsTab !== 'overnight parking' ? 4 : 2"
                              lg="3"
                              v-if="residentsTab !== 'overnight parking'"
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
                              cols="12"
                              :sm="residentsTab !== 'overnight parking' ? 3 : 4"
                              lg="2"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  {{
                                    residentsTab !== "overnight parking"
                                      ? "Type"
                                      : "Invited"
                                  }}
                                </span>
                                <span
                                  class="text-caption font-weight-bold"
                                  v-if="
                                    $vuetify.display.sm || $vuetify.display.md
                                  "
                                >
                                  /Status
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              v-if="residentsTab == 'overnight parking'"
                              cols="12"
                              sm="2"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Check In Date/Arrival
                                  <span
                                    v-if="
                                      $vuetify.display.sm || $vuetify.display.md
                                    "
                                  >
                                    <br />
                                    Actual Check In/Out
                                  </span>
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              v-if="
                                residentsTab == 'overnight parking' &&
                                $vuetify.display.lgAndUp
                              "
                              cols="12"
                              sm="2"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Actual Check In/Out
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="1"
                              v-if="$vuetify.display.lgAndUp"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <v-col cols="12">
                                  <span
                                    class="d-inline-block text-caption font-weight-bold"
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

                  <!-- rows  -->
                  <template #default="{ items }">
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="item.raw._id"
                      >
                        <v-list-item class="py-4 px-8 overflow-auto">
                          <v-list-item-title>
                            <v-row no-gutters align="center">
                              <v-col
                                class="text-capitalize white--text text mb-2 mb-sm-0"
                                cols="12"
                                :sm="
                                  residentsTab !== 'overnight parking' ? 4 : 4
                                "
                                lg="4"
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
                                  >
                                    Name:
                                  </span>
                                  <span
                                    class="mt-1 d-flex flex-column justify-end justify-sm-start align-end align-sm-start"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem; word-break: break-word; white-space: normal;'
                                        : ''
                                    "
                                  >
                                    <div class="text-truncate">
                                      <v-avatar
                                        size="x-small"
                                        :color="materialColors[itemIndex]"
                                        class="mr-1"
                                      >
                                        {{
                                          getInitial(
                                            residentsTab !== "overnight parking"
                                              ? item.raw.givenName ||
                                                  item.raw.surname
                                              : item.raw.firstName ||
                                                  item.raw.lastName,
                                          )
                                        }}
                                      </v-avatar>
                                      <span
                                        style="
                                          word-break: break-word;
                                          white-space: normal;
                                        "
                                        :style="
                                          $vuetify.display.xs
                                            ? 'font-size: .8rem'
                                            : ''
                                        "
                                        class="text-body-2 text-capitalize"
                                      >
                                        {{
                                          residentsTab !== "overnight parking"
                                            ? item.raw.givenName
                                            : item.raw.firstName
                                        }}
                                        {{
                                          residentsTab !== "overnight parking"
                                            ? item.raw.surname
                                            : item.raw.lastName
                                        }}
                                      </span>
                                    </div>
                                    <div
                                      v-if="
                                        residentsTab !== 'overnight parking'
                                      "
                                      class="text-caption text-grey ml-5 ml-sm-0 mt-sm-1 text-body-2"
                                    >
                                      <v-icon size="small" class="mb-1">
                                        mdi-map-marker
                                      </v-icon>
                                      {{
                                        `${item.raw.blockName || ""} ${item.raw.levelName || ""} ${item.raw.unitName || ""}`.trim() ||
                                        "N/A"
                                      }}
                                    </div>
                                  </span>
                                  <span
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                    class="text-truncate text-body-2 w-sm-100 mr-sm-2"
                                    :class="
                                      residentsTab !== 'overnight parking'
                                        ? 'mr-2'
                                        : 'mr-0'
                                    "
                                    v-if="
                                      ($vuetify.display.sm ||
                                        $vuetify.display.md) &&
                                      residentsTab === 'overnight parking'
                                    "
                                  >
                                    <v-icon
                                      color="red"
                                      class="mr-1"
                                      :class="
                                        ($vuetify.display.sm ||
                                          $vuetify.display.md) &&
                                        residentsTab === 'overnight parking'
                                          ? 'mt-1'
                                          : ''
                                      "
                                    >
                                      mdi-at
                                    </v-icon>
                                    <span v-if="item.raw.email">
                                      {{ item.raw.email }}
                                    </span>
                                    <span v-else="">N/A</span>
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                class="text mb-2 mb-sm-0 text-truncate"
                                cols="12"
                                :sm="
                                  residentsTab !== 'overnight parking' ? 4 : 2
                                "
                                lg="3"
                                v-if="residentsTab !== 'overnight parking'"
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
                                    >Email:
                                  </span>
                                  <span
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                    class="text-truncate text-body-2"
                                    :class="
                                      residentsTab !== 'overnight parking'
                                        ? 'mr-2'
                                        : 'mr-0'
                                    "
                                  >
                                    <v-icon color="red" class="ml-1 mr-1">
                                      mdi-at
                                    </v-icon>
                                    <span v-if="item.raw.email">
                                      {{ item.raw.email }}
                                    </span>
                                    <span v-else="">N/A</span>
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                class="text text-capitalize mb-2 mb-sm-0"
                                cols="12"
                                :sm="
                                  residentsTab !== 'overnight parking' ? 3 : 4
                                "
                                lg="2"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
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
                                    >{{
                                      residentsTab !== "overnight parking"
                                        ? "Type:"
                                        : "Invited:"
                                    }}
                                  </span>
                                  <span
                                    v-if="residentsTab !== 'overnight parking'"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                    class="text-body-2 text-capitalize"
                                  >
                                    <v-icon color="blue" class="ml-1 mr-1">
                                      mdi-account-cog-outline
                                    </v-icon>

                                    {{ item.raw.type }}
                                  </span>
                                  <span
                                    v-else
                                    class="mt-1 text-truncate"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-row no-gutters>
                                      <v-col cols="2" md="2">
                                        <v-avatar
                                          size="x-small"
                                          :color="materialColors[itemIndex]"
                                          v-if="$vuetify.display.lgAndUp"
                                        >
                                          {{
                                            getInitial(
                                              item.raw.inviterGivenName ||
                                                item.raw.inviterSurname,
                                            )
                                          }}
                                        </v-avatar>
                                      </v-col>
                                      <v-col
                                        :cols="
                                          $vuetify.display.lgAndUp ? 10 : 12
                                        "
                                        :class="`${$vuetify.display.mdAndUp ? 'pl-2' : 'pl-0'}`"
                                        style="align-content: center"
                                        class="d-flex flex-column justify-end align-end justify-sm-start align-sm-start"
                                      >
                                        <div
                                          style="
                                            word-break: break-word;
                                            white-space: normal;
                                          "
                                        >
                                          {{ item.raw.inviterGivenName }}
                                          <span v-if="$vuetify.display.smAndUp">
                                            {{ item.raw.inviterSurname }}
                                          </span>
                                        </div>
                                        <div
                                          class="text-caption text-grey"
                                          style="
                                            word-break: break-word;
                                            white-space: normal;
                                          "
                                        >
                                          <v-icon size="small" class="mb-1">
                                            mdi-map-marker
                                          </v-icon>
                                          {{
                                            `${item.raw.blockName} ${item.raw.blockLevelName} ${item.raw.unitName}`
                                          }}
                                        </div>
                                      </v-col>
                                    </v-row>
                                  </span>
                                  <span
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                    class="text-caption mt-1 w-100"
                                    v-if="
                                      $vuetify.display.sm || $vuetify.display.md
                                    "
                                  >
                                    <v-chip
                                      :size="
                                        $vuetify.display.sm
                                          ? 'x-small'
                                          : 'small'
                                      "
                                      v-if="
                                        residentsTab !== 'overnight parking' &&
                                        item.raw.status
                                      "
                                      class="text-capitalize text-truncate"
                                      :color="
                                        !item.raw.deletionRequested
                                          ? item.raw.status === 'active'
                                            ? 'green'
                                            : item.raw.status ===
                                                'pending approval'
                                              ? 'blue'
                                              : 'red'
                                          : 'blue'
                                      "
                                    >
                                      <span class="text-truncate">
                                        {{
                                          item.raw.deletionRequested
                                            ? "Deletion Requested"
                                            : item.raw.status ===
                                                "pending approval/resubmitted"
                                              ? "Pending Approval"
                                              : item.raw.status
                                        }}
                                      </span>
                                    </v-chip>
                                    <v-chip
                                      size="small"
                                      v-if="
                                        residentsTab == 'overnight parking' &&
                                        item.raw.overnightParking?.status
                                      "
                                      :class="
                                        item.raw.overnightParking?.status !==
                                        'pending approval'
                                          ? 'text-white'
                                          : ''
                                      "
                                      :style="`background-color: ${
                                        item.raw.overnightParking?.status ===
                                        'approved'
                                          ? '#4CAF50'
                                          : item.raw.overnightParking
                                                ?.status === 'rejected'
                                            ? '#F44336'
                                            : ''
                                      }`"
                                    >
                                      {{
                                        item.raw.overnightParking?.status.split(
                                          " ",
                                        )[0]
                                      }}
                                    </v-chip>
                                    <span
                                      v-if="
                                        residentsTab == 'overnight parking' &&
                                        !item.raw.overnightParking?.status
                                      "
                                    >
                                      N/A
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>
                              <v-divider
                                v-if="
                                  $vuetify.display.xs &&
                                  residentsTab == 'overnight parking'
                                "
                                class="mb-2"
                              />
                              <v-col
                                v-if="residentsTab == 'overnight parking'"
                                class="text text-capitalize"
                                cols="12"
                                sm="3"
                                md="3"
                                lg="2"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.smAndDown
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span
                                    class="mr-2 d-flex d-sm-none font-weight-bold mb-2"
                                  >
                                    Check In Date/Arrival Time:
                                  </span>
                                  <span
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                    class="w-100"
                                  >
                                    <div>
                                      <v-icon
                                        :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1 mr-1'}`"
                                      >
                                        mdi-calendar-month-outline
                                      </v-icon>
                                      {{ standardFormatDate(item.raw.checkIn) }}
                                    </div>
                                    <div>
                                      <v-icon
                                        :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1 mr-1'}`"
                                      >
                                        mdi-clock-time-eight-outline
                                      </v-icon>

                                      {{ item.raw.arrivalTime }}
                                    </div>
                                  </span>
                                  <span
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                    class="ml-1 mt-1"
                                    v-if="
                                      ($vuetify.display.sm ||
                                        $vuetify.display.md) &&
                                      residentsTab === 'overnight parking'
                                    "
                                  >
                                    <v-row no-gutters>
                                      <v-col cols="12">
                                        <v-icon
                                          size="small"
                                          :class="`${$vuetify.display.mdAndUp ? '' : 'mr-2'}`"
                                          color="green"
                                        >
                                          <v-img
                                            src="/icons/timein-green.svg"
                                          ></v-img>
                                        </v-icon>
                                        <span
                                          style="
                                            word-break: break-word;
                                            white-space: normal;
                                          "
                                        >
                                          {{
                                            item.raw.actualCheckIn
                                              ? standardFormatDateTime(
                                                  item.raw.actualCheckIn,
                                                )
                                              : "N/A"
                                          }}
                                        </span>

                                        <span
                                          :class="`${$vuetify.display.xlAndUp ? null : 'd-flex flex-wrap'}`"
                                        >
                                          <span
                                            v-if="
                                              item.raw.type === 'contractor' &&
                                              item.raw.passKeys &&
                                              item.raw.passKeys.length > 0 &&
                                              !Array.isArray(
                                                item.raw.passKeys[0],
                                              ) &&
                                              !item.raw.isKeyReturned
                                            "
                                            class="d-inline-block"
                                          >
                                            <v-icon
                                              size="small"
                                              :class="`${$vuetify.display.mdAndUp ? 'mx-1 mr-2' : 'mx-1 mr-2'}`"
                                            >
                                              mdi-key
                                            </v-icon>
                                          </span>
                                          <span
                                            v-if="
                                              item.raw.type === 'contractor' &&
                                              Object.keys(item.raw.visitorPass)
                                                .length !== 0 &&
                                              !item.raw.isPassReturned
                                            "
                                            class="d-inline-block"
                                          >
                                            <v-icon
                                              size="small"
                                              :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1 mr-2'}`"
                                            >
                                              mdi-badge-account-outline
                                            </v-icon>
                                          </span>
                                        </span>
                                      </v-col>
                                      <v-col cols="12">
                                        <v-icon
                                          size="small"
                                          :class="`${$vuetify.display.mdAndUp ? 'mr-1' : 'mr-3'}`"
                                          color="red"
                                        >
                                          <v-img
                                            src="/icons/timeout-green.svg"
                                          ></v-img>
                                        </v-icon>
                                        <span
                                          style="
                                            word-break: break-word;
                                            white-space: normal;
                                          "
                                          v-if="
                                            item.raw.actualCheckIn &&
                                            item.raw.actualCheckOut
                                          "
                                        >
                                          {{
                                            standardFormatDateTime(
                                              item.raw.actualCheckOut,
                                            )
                                          }}
                                        </span>
                                        <span v-else>N/A</span>
                                      </v-col>
                                    </v-row>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                v-if="
                                  residentsTab == 'overnight parking' &&
                                  ($vuetify.display.lgAndUp ||
                                    $vuetify.display.xs)
                                "
                                class="text text-capitalize"
                                cols="12"
                                md="2"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.smAndDown
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span
                                    class="mr-2 d-flex d-sm-none font-weight-bold mb-2 mt-2 w-100"
                                  >
                                    Actual Check In/Out:
                                  </span>
                                  <span
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-row no-gutters>
                                      <v-col cols="12">
                                        <v-icon
                                          size="small"
                                          :class="`${$vuetify.display.mdAndUp ? '' : 'mr-2'}`"
                                          color="green"
                                        >
                                          <v-img
                                            src="/icons/timein-green.svg"
                                          ></v-img>
                                        </v-icon>
                                        {{
                                          item.raw.actualCheckIn
                                            ? standardFormatDateTime(
                                                item.raw.actualCheckIn,
                                              )
                                            : "N/A"
                                        }}
                                        <span
                                          :class="`${$vuetify.display.xlAndUp ? null : 'd-flex flex-wrap'}`"
                                        >
                                          <span
                                            v-if="
                                              item.raw.type === 'contractor' &&
                                              item.raw.passKeys &&
                                              item.raw.passKeys.length > 0 &&
                                              !Array.isArray(
                                                item.raw.passKeys[0],
                                              ) &&
                                              !item.raw.isKeyReturned
                                            "
                                            class="d-inline-block"
                                          >
                                            <v-icon
                                              size="small"
                                              :class="`${$vuetify.display.mdAndUp ? 'mx-1 mr-2' : 'mx-1 mr-2'}`"
                                            >
                                              mdi-key
                                            </v-icon>
                                          </span>
                                          <span
                                            v-if="
                                              item.raw.type === 'contractor' &&
                                              Object.keys(item.raw.visitorPass)
                                                .length !== 0 &&
                                              !item.raw.isPassReturned
                                            "
                                            class="d-inline-block"
                                          >
                                            <v-icon
                                              size="small"
                                              :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1 mr-2'}`"
                                            >
                                              mdi-badge-account-outline
                                            </v-icon>
                                          </span>
                                        </span>
                                      </v-col>
                                      <v-col cols="12">
                                        <v-icon
                                          size="small"
                                          :class="`${$vuetify.display.mdAndUp ? 'mr-1' : 'mr-3'}`"
                                          color="red"
                                        >
                                          <v-img
                                            src="/icons/timeout-green.svg"
                                          ></v-img>
                                        </v-icon>
                                        <span
                                          v-if="
                                            item.raw.actualCheckIn &&
                                            item.raw.actualCheckOut
                                          "
                                        >
                                          {{
                                            standardFormatDateTime(
                                              item.raw.actualCheckOut,
                                            )
                                          }}
                                        </span>
                                        <span v-else>N/A</span>
                                      </v-col>
                                    </v-row>
                                  </span>
                                </v-row>
                              </v-col>
                              <v-divider
                                v-if="
                                  $vuetify.display.xs &&
                                  residentsTab == 'overnight parking'
                                "
                                class="mb-2 mt-2"
                              />
                              <v-col
                                class="text text-capitalize"
                                cols="12"
                                :md="
                                  residentsTab !== 'overnight parking' ? 2 : 1
                                "
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
                                    $vuetify.display.smAndDown
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span
                                    class="mr-2 d-flex d-md-none font-weight-bold mt-2 mb-2"
                                  >
                                    Status:
                                  </span>
                                  <span
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-chip
                                      size="small"
                                      v-if="
                                        residentsTab !== 'overnight parking' &&
                                        item.raw.status
                                      "
                                      class="text-capitalize"
                                      :color="
                                        !item.raw.deletionRequested
                                          ? item.raw.status === 'active'
                                            ? 'green'
                                            : item.raw.status ===
                                                'pending approval'
                                              ? 'blue'
                                              : 'red'
                                          : 'blue'
                                      "
                                    >
                                      {{
                                        item.raw.deletionRequested
                                          ? "Deletion Requested"
                                          : item.raw.status
                                      }}
                                    </v-chip>
                                    <v-chip
                                      size="small"
                                      v-if="
                                        residentsTab == 'overnight parking' &&
                                        item.raw.overnightParking?.status
                                      "
                                      :class="
                                        item.raw.overnightParking?.status !==
                                        'pending approval'
                                          ? 'text-white'
                                          : ''
                                      "
                                      :style="`background-color: ${
                                        item.raw.overnightParking?.status ===
                                        'approved'
                                          ? '#4CAF50'
                                          : item.raw.overnightParking
                                                ?.status === 'rejected'
                                            ? '#F44336'
                                            : ''
                                      }`"
                                    >
                                      {{
                                        item.raw.overnightParking?.status.split(
                                          " ",
                                        )[0]
                                      }}
                                    </v-chip>
                                    <span
                                      v-if="
                                        residentsTab == 'overnight parking' &&
                                        !item.raw.overnightParking?.status
                                      "
                                    >
                                      N/A
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col sm="1" class="text-caption mt-4 mt-sm-0">
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  justify="end"
                                  align-content="center"
                                >
                                  <v-menu>
                                    <template v-slot:activator="{ props }">
                                      <v-icon
                                        density="compact"
                                        v-bind="props"
                                        class="rounded-xl border-md pa-4"
                                      >
                                        mdi-dots-vertical
                                      </v-icon>
                                    </template>
                                    <v-list>
                                      <v-list-item
                                        v-if="actions[0].display"
                                        :to="{
                                          name: actions[0].to,
                                          params: {
                                            resident: item.raw._id,
                                          },
                                        }"
                                        :disabled="actions[0].disabled"
                                      >
                                        <template #title>
                                          <span class="text-caption">
                                            {{ actions[0].text }}
                                          </span>
                                        </template>
                                      </v-list-item>
                                      <v-list-item
                                        v-if="actions[1].display"
                                        @click="
                                          approveRejectOvernightParking(
                                            item.raw._id,
                                            {
                                              text: actions[1].text.toLowerCase(),
                                              status: actions[1].status,
                                            },
                                            null,
                                          )
                                        "
                                        :disabled="
                                          !currentUser?.isAdmin
                                            ? actions[1].access
                                              ? item.raw.overnightParking
                                                  ?.status == actions[1].status
                                              : true
                                            : item.raw.overnightParking
                                                  ?.status == actions[1].status
                                              ? true
                                              : false
                                        "
                                      >
                                        <template #title>
                                          <span class="text-caption">
                                            {{ actions[1].text }}
                                          </span>
                                        </template>
                                      </v-list-item>
                                      <v-divider
                                        v-if="actions[2].display"
                                      ></v-divider>
                                      <v-list-item
                                        v-if="actions[2].display"
                                        @click="
                                          approveRejectOvernightParking(
                                            item.raw._id,
                                            {
                                              text: actions[2].text.toLowerCase(),
                                              status: actions[2].status,
                                            },
                                            null,
                                          )
                                        "
                                        :disabled="
                                          !currentUser?.isAdmin
                                            ? actions[2].access
                                              ? item.raw.overnightParking
                                                  ?.status == actions[2].status
                                              : true
                                            : item.raw.overnightParking
                                                  ?.status == actions[2].status
                                              ? true
                                              : false
                                        "
                                      >
                                        <template #title>
                                          <span class="text-caption">
                                            {{ actions[2].text }}
                                          </span>
                                        </template>
                                      </v-list-item>
                                      <v-divider
                                        v-if="actions[3].display"
                                      ></v-divider>
                                      <v-list-item
                                        v-if="actions[3].display"
                                        @click="
                                          approveRejectOvernightParking(
                                            item.raw._id,
                                            {
                                              text: actions[3].text.toLowerCase(),
                                              status: actions[3].status,
                                            },
                                            item.raw.overnightParking?.remarks,
                                          )
                                        "
                                        :disabled="
                                          item.raw.overnightParking?.status ==
                                          'pending approval'
                                        "
                                      >
                                        <template #title>
                                          <span class="text-caption">
                                            {{ actions[3].text }}
                                          </span>
                                        </template>
                                      </v-list-item>
                                    </v-list>
                                  </v-menu>
                                </v-row>
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

                  <!-- row without data -->
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
                            {{
                              residentsTab !== "overnight parking"
                                ? "No residents found."
                                : "No overnight parking requests found."
                            }}
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
              <span>
                {{
                  residentsTab !== "overnight parking"
                    ? pageRange
                    : visitorsPageRange
                }}
              </span>
              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="
                  residentsTab !== 'overnight parking'
                    ? canPrevPage
                    : canPrevVisitorsPage
                "
                @click="
                  residentsTab !== 'overnight parking'
                    ? prevPage({
                        search,
                        organization: id,
                        site: siteId,
                        type: 'resident',
                      })
                    : prevVisitorsPage()
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
                  residentsTab !== 'overnight parking'
                    ? !canNextPage
                    : !canNextVisitorsPage
                "
                @click="
                  residentsTab !== 'overnight parking'
                    ? nextPage({
                        search,
                        organization: id,
                        site: siteId,
                        type: 'resident',
                      })
                    : nextVisitorsPage()
                "
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <!-- approve/reject overnight parking dialog -->
    <v-dialog
      v-model="approveRejectOvernightParkingDialog"
      transition="dialog-bottom-transition"
      persistent
      width="60vh"
    >
      <v-card
        :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
        :class="`${theme == 'light' && 'bg-white'} px-3 h-100`"
      >
        <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
          <span class="font-weight-bold pl-4 pt-1 text-capitalize">
            {{ approveRejectOvernightParkingDialogType.text }}
          </span>

          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            icon="mdi-close"
            @click="closeApproveRejectOvernightParkingDialog()"
          ></v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text>
          <v-row class="fill-height" justify="center" align-content="center">
            <v-col
              v-if="
                approveRejectOvernightParkingDialogType.status !== 'remarks'
              "
              cols="12"
              class="text-h6 text-center"
            >
              {{
                `Are you sure you want to ${approveRejectOvernightParkingDialogType.text} the visitor's overnight parking request?`
              }}
            </v-col>

            <v-col cols="12" class="mt-4">
              <v-row no-gutters justify="center">
                <v-col cols="12" md="8">
                  <v-textarea
                    v-model="remarks"
                    label="Remarks"
                    placeholder="Enter remarks"
                    :rules="[requiredInput]"
                    outlined
                    rows="3"
                    clearable
                    :hide-details="
                      approveRejectOvernightParkingDialogType.status ===
                      'remarks'
                    "
                    :readonly="
                      approveRejectOvernightParkingDialogType.status ===
                      'remarks'
                    "
                  />
                </v-col>
                <v-col cols="12" class="mt-10 text-center">
                  <v-btn
                    v-if="
                      approveRejectOvernightParkingDialogType.status !==
                      'remarks'
                    "
                    theme="dark"
                    class="font-weight-bold"
                    @click="updateOvernightParkingStatus()"
                    :disabled="!remarks"
                    :loading="loading"
                  >
                    Yes
                  </v-btn>
                  <v-btn
                    variant="text"
                    class="font-weight-bold ml-3"
                    @click="closeApproveRejectOvernightParkingDialog()"
                  >
                    {{
                      ["approved", "rejected"].includes(
                        approveRejectOvernightParkingDialogType.status,
                      )
                        ? "No"
                        : "Close"
                    }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import moment from "moment-timezone";

import debounce from "lodash/debounce";

definePageMeta({
  middleware: ["secure", "organization", "site"],
});

const { currentUser } = useLocalAuth();

const { theme } = useLocal();

const { $ability } = useNuxtApp();

const nav = computed(() => {
  return [
    {
      title: "Organizations",
      to: { name: "organizations" },
    },
    {
      title: organization.value.name,
      to: {
        name: "organizations-organization",
        params: { organization: id.value },
      },
    },
    {
      title: "Sites",
      to: {
        name: "organizations-organization-sites",
        params: { organization: id.value },
      },
    },
    {
      title: theSite.value.name,
      to: {
        name: "organizations-organization-sites-site",
        params: { organization: id.value, site: siteId.value },
      },
    },
    {
      title: "Residents",
    },
  ];
});

const {
  residentsTab,
  setUser,
  users,
  isUsersLoaded,
  setUsers,
  pageRange,
  canNextPage,
  canPrevPage,
  nextPage,
  prevPage,
  itemsPerPage,
  searchResidents,
} = useUser();

const {
  //selectedFilter,
  getVisitorsByPageSearch,
  isVisitorsLoaded,
  updateVisitorOvernightParkingStatus,
} = useVisitor();

const visitors = ref([]);

const {
  getInitial,
  materialColors,
  requiredInput,
  standardFormatDate,
  standardFormatDateTime,
} = useUtils();

const visitorId = computed(() => useRoute().query.visitor as string);

const search = ref("");

const { organization } = useOrganization();

const id = computed(() => useRoute().params.organization as string);
const siteId = computed(() => useRoute().params.site as string);

const { site } = useSite();

const theSite = computed(() => site.value);

const { setSnackbar } = useLocal();

const currentPage = ref(1);
const totalPages = ref(0);

const canNextVisitorsPage = computed(
  () => totalPages.value > currentPage.value,
);
const canPrevVisitorsPage = computed(() => currentPage.value <= 1);

const visitorsPageRange = ref("-- - -- of --");

const approveRejectOvernightParkingDialog = ref(false);
const approveRejectOvernightParkingDialogType = ref({ text: "", status: "" });
const remarks = ref("");
const loading = ref(false);

const selectedVisitor = ref("");

const startDateDialog = ref(false);
const endDateDialog = ref(false);
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const locale = "en";

const filters = ref({
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
    filters.value.from = standardFormatDate(startDate.value);
    startDateDialog.value = false;
    updateFilter();
  }
};
const applyEndDate = () => {
  if (endDate.value) {
    filters.value.to = standardFormatDate(endDate.value);
    endDateDialog.value = false;
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

watch(() => filters.value.from, updateFilter);
watch(() => filters.value.to, updateFilter);

async function updateFilter() {
  if (residentsTab.value !== "overnight parking") {
    await setUsers({
      search: search.value,
      organization: id.value,
      site: siteId.value,
      type: "resident",
    });
  } else {
    isVisitorsLoaded.value = true;
    visitors.value = await getVisitorsByPageSearch({
      page: currentPage.value,
      search: search.value,
      sites: [siteId.value],
      arrivalDate: {
        from: moment.tz(
          moment(filters.value.from, "DD/MM/YYYY"),
          "Asia/Singapore",
        ),
        to: moment.tz(
          moment(filters.value.to, "DD/MM/YYYY").endOf("day"),
          "Asia/Singapore",
        ),
      },
      // isVisitorCleared: selectedFilter.value || "all",
      overnightParking: "overnight parking",
      types: null,
      tab: "Overnight Parking",
    });

    totalPages.value = visitors.value.pages;
    visitorsPageRange.value = visitors.value.pageRange;

    isVisitorsLoaded.value = false;
  }
}

onMounted(async () => {
  // check if redirected from notifications page
  if (visitorId.value) {
    search.value = visitorId.value;
    residentsTab.value = "overnight parking";
  }

  if (residentsTab.value !== "overnight parking") {
    await setUser();
    users.value = [];
    await setUsers({
      organization: id.value,
      site: siteId.value,
      type: "resident",
    });
  } else {
    await updateFilter();
  }
});

watch(search, (newValue: string) => {
  debouncedSearch(newValue);
});

const debouncedSearch = debounce(async (value: string) => {
  if (residentsTab.value !== "overnight parking") {
    isUsersLoaded.value = true;
    await searchResidents({
      search: value,
      site: siteId.value,
      organization: id.value,
    });
    isUsersLoaded.value = false;
  } else {
    isVisitorsLoaded.value = true;
    visitors.value = await getVisitorsByPageSearch({
      page: 1,
      search: value,
      sites: [siteId.value],
      arrivalDate: {
        from: moment.tz(
          moment(filters.value.from, "DD/MM/YYYY"),
          "Asia/Singapore",
        ),
        to: moment.tz(
          moment(filters.value.to, "DD/MM/YYYY").endOf("day"),
          "Asia/Singapore",
        ),
      },
      // isVisitorCleared: selectedFilter.value || "all",
      overnightParking: "overnight parking",
      tab: "Overnight Parking",
      types: null,
    });

    totalPages.value = visitors.value.pages;
    visitorsPageRange.value = visitors.value.pageRange;

    isVisitorsLoaded.value = false;
  }
}, 500);

watch(
  residentsTab,
  async (newValue: string) => {
    search.value = "";
    if (newValue === "residents") {
      visitors.value = [];
      await setUsers({
        organization: id.value,
        site: siteId.value,
        type: "resident",
      });
    } else {
      users.value = [];
      await updateFilter();
    }
  },
  { deep: true },
);

async function prevVisitorsPage() {
  isVisitorsLoaded.value = true;
  currentPage.value -= 1;
  await updateFilter();
  isVisitorsLoaded.value = false;
}

async function nextVisitorsPage() {
  isVisitorsLoaded.value = true;
  currentPage.value += 1;
  await updateFilter();
  isVisitorsLoaded.value = false;
}

const actions = computed(() => {
  return [
    {
      text: "View Application",
      to: "organizations-organization-sites-site-residents-resident",
      disabled: false,
      display: residentsTab.value == "residents",
    },
    // actions below are for overnight parking tab only
    {
      text: "Approve",
      status: "approved",
      access: $ability.can("update", "edit-resident-approve-parking"),
      display: residentsTab.value == "overnight parking",
    },
    {
      text: "Reject",
      status: "rejected",
      access: $ability.can("update", "edit-resident-reject-parking"),
      display: residentsTab.value == "overnight parking",
    },
    {
      text: "View Remarks",
      status: "remarks",
      display: residentsTab.value == "overnight parking",
    },
  ];
});

function approveRejectOvernightParking(
  visitorId: string,
  dialogType: any,
  remark?: any,
) {
  selectedVisitor.value = visitorId;
  approveRejectOvernightParkingDialog.value = true;
  approveRejectOvernightParkingDialogType.value = dialogType;
  remarks.value = remark;
}

async function updateOvernightParkingStatus() {
  loading.value = true;
  try {
    await updateVisitorOvernightParkingStatus({
      _id: selectedVisitor.value,
      status: approveRejectOvernightParkingDialogType.value.status,
      remarks: remarks.value || "",
    });
    setSnackbar({
      text: `Visitor's overnight parking request successfully ${approveRejectOvernightParkingDialogType.value.status}`,
      modal: true,
      type: "success",
    });
    await updateFilter();
    closeApproveRejectOvernightParkingDialog();
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  loading.value = false;
}

function closeApproveRejectOvernightParkingDialog() {
  selectedVisitor.value = "";
  approveRejectOvernightParkingDialogType.value = { text: "", status: "" };
  remarks.value = "";
  approveRejectOvernightParkingDialog.value = false;
}
</script>

<style scoped>
.overridePicker {
  width: 18px;
}
</style>
