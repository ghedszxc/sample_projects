<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="isVisitorsLoaded"
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
                  :items="visitors"
                  :items-per-page="itemsPerPage"
                >
                  <template v-slot:header>
                    <v-row no-gutters class="pa-4 fill-height" align="center">
                      <v-col cols="12" class="mb-4">
                        <v-row no-gutters align="center">
                          <v-col
                            cols="10"
                            lg="6"
                            :md="
                              currentUser?.type == 'admin' ||
                              currentUser?.type == 'organization'
                                ? 7
                                : 8
                            "
                          >
                            <span class="font-weight-bold text-h6">
                              Visitors Management
                            </span>
                          </v-col>
                          <v-col cols="12" lg="6" md="4">
                            <v-row align="end" justify="end">
                              <!-- v-if="
                                  $vuetify.display.md &&
                                  $ability.can('create', 'create-visitors') &&
                                  currentUser?.type !== 'admin' &&
                                  currentUser?.type !== 'organization'
                                " -->
                              <v-col cols="12" lg="4" md="6">
                                <v-menu location="bottom">
                                  <template #activator="{ props }">
                                    <v-btn
                                      v-bind="props"
                                      color="blue-darken-3"
                                      block
                                      variant="flat"
                                      size="small"
                                      style="height: 40px"
                                      :loading="
                                        isExportingPdf || isExportingCsv
                                      "
                                    >
                                      <v-icon v-if="$vuetify.display.lgAndDown"
                                        >mdi-download</v-icon
                                      >
                                      <span v-if="$vuetify.display.smAndDown"
                                        >Download Report</span
                                      >
                                      <span v-if="$vuetify.display.mdAndUp"
                                        >Download Report</span
                                      >
                                    </v-btn>
                                  </template>

                                  <v-list density="compact" class="pa-0">
                                    <v-list-item
                                      class="text-caption"
                                      @click="onExportAsPdf()"
                                    >
                                      Download PDF Report
                                    </v-list-item>
                                    <v-list-item
                                      class="text-caption"
                                      @click="onExportAsCsv()"
                                    >
                                      Download CSV Report
                                    </v-list-item>
                                  </v-list>
                                </v-menu>
                              </v-col>
                              <v-col
                                v-if="siteSetting.qrCode"
                                cols="12"
                                lg="4"
                                md="6"
                              >
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
                              <v-col
                                cols="12"
                                lg="3"
                                md="6"
                                v-if="
                                  $vuetify.display.md &&
                                  $ability.can('create', 'create-visitors') &&
                                  currentUser?.type !== 'admin' &&
                                  currentUser?.type !== 'organization'
                                "
                              >
                                <v-btn
                                  color="blue-darken-3"
                                  block
                                  variant="flat"
                                  size="small"
                                  style="height: 40px"
                                  @click="addVisitorDialog = true"
                                >
                                  <v-icon v-if="$vuetify.display.lgAndDown"
                                    >mdi-plus</v-icon
                                  >
                                  <span v-if="$vuetify.display.smAndDown"
                                    >Add Visitor</span
                                  >
                                  <span v-if="$vuetify.display.mdAndUp"
                                    >Add Visitor</span
                                  >
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>

                      <!-- tabs -->
                      <v-col cols="12" class="mt-2 mb-4">
                        <v-row no-gutters>
                          <v-col
                            cols="3"
                            class="text-center font-weight-bold"
                            @click="switchTab('visitor')"
                            style="cursor: pointer; font-size: 16px"
                            :style="
                              tab === 'visitor'
                                ? 'border-bottom: 3px solid #0077b6; padding: .5rem; color: #0077b6;'
                                : 'border-bottom: 3px solid gray; padding: .5rem'
                            "
                          >
                            Visitors
                          </v-col>
                          <v-col
                            cols="3"
                            class="text-center font-weight-bold"
                            @click="switchTab('guest')"
                            style="cursor: pointer; font-size: 16px"
                            :style="
                              tab === 'guest'
                                ? 'border-bottom: 3px solid #0077b6; padding: .5rem; color: #0077b6;'
                                : 'border-bottom: 3px solid gray; padding: .5rem'
                            "
                          >
                            Guests
                          </v-col>
                          <v-col
                            cols="3"
                            class="text-center font-weight-bold"
                            @click="switchTab('temporary')"
                            style="cursor: pointer; font-size: 16px"
                            :style="
                              tab === 'temporary'
                                ? 'border-bottom: 3px solid #0077b6; padding: .5rem; color: #0077b6;'
                                : 'border-bottom: 3px solid gray; padding: .5rem'
                            "
                          >
                            Temporary Registered
                          </v-col>

                          <v-col
                            cols="3"
                            class="text-center font-weight-bold"
                            @click="switchTab('unregistered')"
                            style="cursor: pointer; font-size: 16px"
                            :style="
                              tab === 'unregistered'
                                ? 'border-bottom: 3px solid #0077b6; padding: .5rem; color: #0077b6;'
                                : 'border-bottom: 3px solid gray; padding: .5rem'
                            "
                          >
                            Unregistered Visitors
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col
                        cols="12"
                        md="5"
                        :lg="
                          currentUser?.type == 'admin' ||
                          currentUser?.type == 'organization'
                            ? 5
                            : 4
                        "
                        sm="9"
                      >
                        <v-row>
                          <v-col
                            cols="12"
                            sm="11"
                            md="11"
                            lg="11"
                            :class="`d-flex ${$vuetify.display.smAndDown && 'mb-4'}`"
                          >
                            <v-text-field
                              v-model="search"
                              placeholder="Search"
                              hide-details
                              density="compact"
                              append-inner-icon="mdi-magnify"
                              @update:modelValue="updateFilter()"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="3"
                        v-if="
                          $vuetify.display.sm &&
                          $ability.can('create', 'create-visitors')
                        "
                        :class="`d-flex ${$vuetify.display.smAndDown && 'mb-4'}`"
                      >
                        <v-btn
                          color="blue-darken-3"
                          block
                          variant="flat"
                          size="small"
                          style="height: 40px"
                          @click="addVisitorDialog = true"
                        >
                          <v-icon v-if="$vuetify.display.lgAndDown"
                            >mdi-plus</v-icon
                          >
                          <span v-if="$vuetify.display.smAndDown"
                            >Add Visitor</span
                          >
                          <span v-if="$vuetify.display.mdAndUp"
                            >Add Visitor</span
                          >
                        </v-btn>
                      </v-col>

                      <v-col
                        cols="12"
                        md="7"
                        :lg="
                          currentUser?.type == 'admin' ||
                          currentUser?.type == 'organization'
                            ? 7
                            : 8
                        "
                      >
                        <v-row class="d-flex justify-end">
                          <v-col
                            cols="12"
                            sm="4"
                            md="4"
                            :lg="
                              currentUser?.type == 'admin' ||
                              currentUser?.type == 'organization'
                                ? 4
                                : 3
                            "
                          >
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
                          <v-col
                            cols="12"
                            sm="4"
                            md="4"
                            :lg="
                              currentUser?.type == 'admin' ||
                              currentUser?.type == 'organization'
                                ? 4
                                : 3
                            "
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

                          <v-col
                            v-if="tab !== 'unregistered'"
                            cols="12"
                            sm="4"
                            md="4"
                            :lg="
                              currentUser?.type == 'admin' ||
                              currentUser?.type == 'organization'
                                ? 4
                                : 3
                            "
                          >
                            <v-autocomplete
                              v-model="filterVisitor"
                              label="Filter by type(s)"
                              :items="
                                tab === 'guest'
                                  ? visitorTypesGuest
                                  : visitorTypes
                              "
                              item-title="title"
                              item-value="value"
                              hide-details
                              density="compact"
                              menu-icon="mdi-chevron-down"
                              chips
                              closable-chips
                              multiple
                              clearable
                              @update:modelValue="updateFilter()"
                            >
                            </v-autocomplete>
                          </v-col>

                          <v-col
                            cols="12"
                            lg="3"
                            md="2"
                            v-if="
                              ($vuetify.display.lgAndUp ||
                                $vuetify.display.xs) &&
                              $ability.can('create', 'create-visitors') &&
                              currentUser?.type !== 'admin' &&
                              currentUser?.type !== 'organization'
                            "
                          >
                            <v-btn
                              color="blue-darken-3"
                              block
                              variant="flat"
                              size="small"
                              style="height: 40px"
                              @click="addVisitorDialog = true"
                            >
                              <v-icon v-if="$vuetify.display.lgAndDown"
                                >mdi-plus</v-icon
                              >
                              <span v-if="$vuetify.display.smAndDown"
                                >Add Visitor</span
                              >
                              <span v-if="$vuetify.display.mdAndUp"
                                >Add Visitor</span
                              >
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-row no-gutters class="mt-2">
                        <v-col
                          cols="12"
                          lg="5"
                          md="5"
                          sm="6"
                          v-if="
                            currentUser?.type == 'admin' ||
                            currentUser?.type == 'organization'
                          "
                          :class="{ 'mb-2': $vuetify.display.smAndDown }"
                        >
                          <v-row no-gutters>
                            <v-col cols="12" sm="11">
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
                          </v-row>
                        </v-col>
                        <v-col
                          cols="12"
                          lg="5"
                          md="5"
                          sm="6"
                          :class="{ 'mb-5': $vuetify.display.smAndDown }"
                          v-if="
                            currentUser?.type == 'admin' ||
                            currentUser?.type == 'organization'
                          "
                        >
                          <v-row no-gutters>
                            <v-col cols="12" md="11">
                              <v-select
                                v-model="filterSite"
                                :items="siteOptions"
                                :disabled="!sites.length"
                                item-title="name"
                                item-value="_id"
                                hide-details
                                density="compact"
                                menu-icon="mdi-chevron-down"
                                @update:model-value="updateFilter()"
                              >
                              </v-select>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col
                          cols="12"
                          lg="2"
                          md="2"
                          v-if="
                            ($vuetify.display.xs || $vuetify.display.mdAndUp) &&
                            (($ability.can('create', 'create-visitors') &&
                              currentUser?.type == 'admin') ||
                              currentUser?.type == 'organization')
                          "
                        >
                          <v-btn
                            color="blue-darken-3"
                            block
                            variant="flat"
                            size="small"
                            style="height: 40px"
                            @click="addVisitorDialog = true"
                          >
                            <v-icon v-if="$vuetify.display.lgAndDown"
                              >mdi-plus</v-icon
                            >
                            <span v-if="$vuetify.display.smAndDown"
                              >Add Visitor</span
                            >
                            <span v-if="$vuetify.display.mdAndUp"
                              >Add Visitor</span
                            >
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-row>

                    <v-divider />

                    <v-list
                      class="pa-0"
                      density="compact"
                      v-if="$vuetify.display.smAndUp"
                    >
                      <v-list-item class="px-md-8">
                        <v-list-item-title>
                          <v-row no-gutters>
                            <v-col cols="12" lg="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                                align="center"
                              >
                                <span
                                  v-if="$vuetify.display.lgAndUp"
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Name
                                </span>
                                <v-col
                                  v-if="$vuetify.display.mdAndDown"
                                  cols="3"
                                  sm="4"
                                  md="3"
                                >
                                  <v-row no-gutters class="mr-2">
                                    <span
                                      class="d-inline-block text-capitalize text-caption font-weight-bold ml-4"
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      Name/Type
                                      <span v-if="$vuetify.display.sm"
                                        >/Company</span
                                      >
                                    </span>
                                  </v-row>
                                </v-col>
                                <v-col v-if="$vuetify.display.md" cols="3">
                                  <v-row no-gutters class="mr-2">
                                    <span
                                      class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                    >
                                      Company/Location
                                    </span>
                                  </v-row>
                                </v-col>
                                <v-col
                                  v-if="$vuetify.display.mdAndDown"
                                  cols="2"
                                  sm="4"
                                  md="3"
                                >
                                  <v-row no-gutters class="mr-2">
                                    <span
                                      class="d-inline-block text-capitalize text-caption font-weight-bold"
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      Contact/Plate #
                                      <span v-if="$vuetify.display.sm"
                                        >/Location</span
                                      >
                                    </span>
                                  </v-row>
                                </v-col>
                                <v-col
                                  v-if="$vuetify.display.mdAndDown"
                                  cols="3"
                                  sm="4"
                                  md="3"
                                >
                                  <v-row no-gutters class="mr-2">
                                    <span
                                      v-if="tab === 'guest'"
                                      class="d-inline-block text-capitalize text-caption font-weight-bold"
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      Arrival Date/Time
                                    </span>
                                    <span
                                      v-else
                                      class="d-inline-block text-capitalize text-caption font-weight-bold"
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      Check In/Out/Key/Pass
                                    </span>
                                  </v-row>
                                </v-col>
                              </v-row>
                            </v-col>

                            <v-col cols="12" md="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  v-if="$vuetify.display.lgAndUp"
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Type/Company
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" md="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  v-if="$vuetify.display.lgAndUp"
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Location
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" md="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  v-if="$vuetify.display.lgAndUp"
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Contact/Vehicle No.
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" md="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <v-col cols="12">
                                  <span
                                    v-if="
                                      $vuetify.display.lgAndUp &&
                                      tab === 'guest'
                                    "
                                    style="margin-bottom: -5px"
                                    class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                  >
                                    Arrival Date/Time
                                  </span>
                                  <span
                                    v-else-if="$vuetify.display.lgAndUp"
                                    style="margin-bottom: -5px"
                                    class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                  >
                                    Check In/Out
                                  </span>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider v-if="$vuetify.display.lgAndUp" />
                    </v-list>
                  </template>

                  <template
                    v-if="$vuetify.display.lgAndUp"
                    #default="{ items }"
                  >
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="itemIndex"
                      >
                        <v-list-item class="pt-2 pb-1 px-8">
                          <v-list-item-title>
                            <v-row no-gutters align="center">
                              <v-col
                                cols="12"
                                md="2"
                                :class="`text ${
                                  $vuetify.display.mdAndUp
                                    ? 'my-1'
                                    : 'mb-2 mt-2'
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
                                    <v-avatar
                                      size="x-small"
                                      :color="materialColors[itemIndex]"
                                      :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-3'}`"
                                    >
                                      {{
                                        item.raw.firstName && item.raw.firstName
                                          ? `${getInitial(item.raw.firstName)}${getInitial(item.raw.lastName)}`
                                          : getInitial(item.raw.name)
                                      }}
                                    </v-avatar>
                                    {{
                                      item.raw.firstName || item.raw.lastName
                                        ? `${item.raw.firstName} ${item.raw.lastName}`
                                        : item.raw.name
                                    }}
                                  </span>
                                  <v-col
                                    cols="10"
                                    :class="`${$vuetify.display.lgAndUp ? 'pl-8' : 'pl-4'}`"
                                  >
                                    <div
                                      class="text-caption text-grey"
                                      v-if="item.raw?.members?.length"
                                    >
                                      {{
                                        item.raw?.members &&
                                        item.raw?.members?.length
                                          ? `(+${item.raw?.members?.length} members)`
                                          : ""
                                      }}
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="2"
                                :class="`text ${
                                  $vuetify.display.mdAndUp
                                    ? 'my-1 pr-2'
                                    : 'mb-2'
                                }`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <v-col cols="12" class="d-flex flex-column">
                                    <span
                                      class="d-inline-block text-capitalize text-body-2"
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1 mr-4'}`"
                                      >
                                        mdi-account
                                      </v-icon>
                                      {{
                                        item.raw.type === "contractor" &&
                                        item.raw.contractorType
                                          ? item.raw.contractorType ||
                                            "".split("-").join(" ")
                                          : item.raw.type === "guest"
                                            ? item.raw.residentGuestType
                                              ? item.raw.residentGuestType
                                              : "Drive-In"
                                            : item.raw.type === "delivery" &&
                                                item.raw.deliveryType
                                              ? `${item.raw.deliveryType}-Delivery`
                                              : item.raw.type
                                      }}
                                    </span>
                                    <span
                                      class="d-inline-block text-wrap text-capitalize text-body-2"
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1 mr-4'}`"
                                      >
                                        mdi-domain
                                      </v-icon>
                                      {{
                                        item.raw.companyName
                                          ? item.raw.companyName
                                          : `N/A`
                                      }}
                                    </span>
                                  </v-col>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="3"
                                :class="`text ${
                                  $vuetify.display.mdAndUp
                                    ? 'my-1 pr-2'
                                    : item.raw.email
                                      ? 'mb-2'
                                      : ''
                                }`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <span
                                    class="d-inline-block text-wrap text-capitalize text-body-2"
                                  >
                                    <v-icon
                                      v-if="
                                        item.raw.blockName ||
                                        item.raw.blockLevelName ||
                                        item.raw.unitName
                                      "
                                      size="small"
                                      :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1 mr-4'}`"
                                    >
                                      mdi-storefront-outline
                                    </v-icon>
                                    {{
                                      item.raw.blockName ||
                                      item.raw.blockLevelName ||
                                      item.raw.unitName
                                        ? `${item.raw.blockName} ${item.raw.blockLevelName ? "/ " + item.raw.blockLevelName : ""} ${item.raw.unitName ? "/ " + item.raw.unitName : ""}`
                                        : "N/A"
                                    }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="2"
                                :class="`text pr-2 ${
                                  $vuetify.display.mdAndUp ? 'my-0' : 'mb-2'
                                }`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <span
                                    class="d-inline-block text-capitalize text-body-2"
                                    style="width: 100%"
                                  >
                                    <v-row no-gutters>
                                      <v-col
                                        cols="12"
                                        :class="`${$vuetify.display.mdAndUp ? 'pl-1 text-body-2' : 'pl-4 text-body-2'}`"
                                      >
                                        <template
                                          v-if="
                                            item.raw.email &&
                                            item.raw.phoneNumber
                                          "
                                        >
                                          <div
                                            :class="
                                              !item.raw.email &&
                                              'pt-2 text-body-2'
                                            "
                                            style="
                                              word-break: break-word;
                                              white-space: normal;
                                            "
                                          >
                                            <v-icon size="small" class="mr-1"
                                              >mdi-phone</v-icon
                                            >
                                            {{
                                              item.raw.phoneNumber
                                                ? item.raw.phoneNumber
                                                : "N/A"
                                            }}
                                          </div>
                                          <div
                                            class="text-caption text-grey text-truncate text-body-2"
                                            v-if="item.raw.email"
                                          >
                                            <v-icon size="small" class="mr-1"
                                              >mdi-email</v-icon
                                            >
                                            {{
                                              item.raw.email
                                                ? item.raw.email
                                                : "N/A"
                                            }}
                                          </div>
                                        </template>
                                        <div
                                          v-else
                                          style="
                                            word-break: break-word;
                                            white-space: normal;
                                          "
                                        >
                                          <v-icon size="small" class="mr-1"
                                            >mdi-phone</v-icon
                                          >
                                          {{
                                            item.raw.email
                                              ? item.raw.email
                                              : item.raw.phoneNumber
                                                ? item.raw.phoneNumber
                                                : "N/A"
                                          }}
                                        </div>
                                        <span
                                          class="d-inline-block text-capitalize text-body-2"
                                          style="width: 100%"
                                        >
                                          <v-row
                                            no-gutters
                                            align="center"
                                            justify="start"
                                            class="d-flex align-center"
                                          >
                                            <v-icon
                                              size="small"
                                              class="mr-2"
                                              :class="`${$vuetify.display.mdAndUp ? '' : 'mx-1'}`"
                                              >mdi-car-back</v-icon
                                            >
                                            <div>
                                              {{
                                                item.raw.plateNumber
                                                  ? item.raw.plateNumber.toUpperCase()
                                                  : "N/A"
                                              }}
                                            </div>
                                            <div
                                              v-if="
                                                item.raw.type === 'guest' &&
                                                currentUser.type ===
                                                  'organization'
                                              "
                                            >
                                              <div
                                                v-if="
                                                  compareDate(
                                                    item.raw.checkIn,
                                                    item.raw.checkOut,
                                                  )
                                                "
                                                class="text-caption text-grey"
                                              >
                                                Overnight
                                              </div>
                                            </div>
                                          </v-row>
                                        </span>
                                      </v-col>
                                    </v-row>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="2"
                                class="text text-capitalize text-truncate"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <v-col cols="12">
                                    <span
                                      class="d-inline-block text-truncate text-capitalize text-body-2"
                                    >
                                      <div v-if="tab === 'guest'">
                                        <v-icon
                                          size="small"
                                          :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1 mr-4'}`"
                                          >mdi-calendar-month-outline
                                        </v-icon>
                                        <span>
                                          {{
                                            item.raw.registeredAt
                                              ? standardFormatDate(
                                                  item.raw.registeredAt,
                                                )
                                              : "N/A"
                                          }}
                                        </span>
                                      </div>
                                      <div v-else>
                                        <v-icon
                                          size="small"
                                          :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1 mr-4'}`"
                                          color="green"
                                        >
                                          <v-img
                                            src="/icons/timein-green.svg"
                                          ></v-img>
                                        </v-icon>

                                        <v-btn
                                          v-if="
                                            siteSetting.manualCheckIn &&
                                            !item.raw.actualCheckIn
                                          "
                                          color="green"
                                          class="ml-1"
                                          size="x-small"
                                          style="height: 17px"
                                          @click="
                                            updateVisitorInfo(
                                              item.raw._id,
                                              'check-in',
                                            )
                                          "
                                        >
                                          Check In
                                        </v-btn>
                                        <span class="text-truncate" v-else>
                                          {{
                                            item.raw.actualCheckIn
                                              ? standardFormatDateTime(
                                                  item.raw.actualCheckIn,
                                                )
                                              : "N/A"
                                          }}
                                          <v-icon
                                            v-if="item.raw.checkInImage"
                                            size="small"
                                            class="mr-1 mr-md-1"
                                            :class="`${$vuetify.display.mdAndUp ? '' : 'mx-1'}`"
                                            @click="
                                              openInApp(item.raw.checkInImage)
                                            "
                                            >mdi-image</v-icon
                                          >
                                          <span
                                            class="text-truncate"
                                            :class="`${$vuetify.display.xlAndUp ? null : 'd-flex flex-wrap'}`"
                                          >
                                            <br />
                                            <span
                                              v-if="
                                                item.raw.type ===
                                                  'contractor' &&
                                                item.raw.passKeys &&
                                                item.raw.passKeys.length > 0 &&
                                                !Array.isArray(
                                                  item.raw.passKeys[0],
                                                ) &&
                                                !item.raw.isKeyReturned
                                              "
                                              class="d-inline-block"
                                            >
                                              <v-chip
                                                class="my-1"
                                                variant="outlined"
                                                size="small"
                                                color="gray"
                                                :class="`${$vuetify.display.mdAndUp ? 'mx-1 mr-2' : 'mx-1 mr-2'}`"
                                              >
                                                <v-icon
                                                  size="medium"
                                                  :class="`${$vuetify.display.mdAndUp ? 'mx-1 mr-2' : 'mx-1 mr-2'}`"
                                                  >mdi-key</v-icon
                                                >
                                                {{
                                                  item.raw.passKeys &&
                                                  item.raw.passKeys.length >
                                                    0 &&
                                                  !Array.isArray(
                                                    item.raw.passKeys[0],
                                                  )
                                                    ? item.raw.passKeys.length
                                                    : 0
                                                }}
                                              </v-chip>
                                            </span>
                                            <span
                                              v-if="
                                                (item.raw.type ===
                                                  'contractor' ||
                                                  item.raw.type === 'guest' ||
                                                  item.raw.type ===
                                                    'walk-in') &&
                                                ((Array.isArray(
                                                  item.raw.visitorPass,
                                                ) &&
                                                  item.raw.visitorPass[0]
                                                    ?.keyId) ||
                                                  (!['', null].includes(
                                                    item.raw.visitorPass,
                                                  ) &&
                                                    !Array.isArray(
                                                      item.raw.visitorPass,
                                                    )))
                                              "
                                              class="d-inline-block"
                                            >
                                              <span
                                                style="
                                                  display: inline-block;
                                                  margin-right: -2px;
                                                  cursor: pointer;
                                                "
                                                @click="
                                                  viewPass(
                                                    item.raw,
                                                    Array.isArray(
                                                      item.raw.visitorPass,
                                                    ) &&
                                                      item.raw.visitorPass[0]
                                                        ?.keyId
                                                      ? item.raw.visitorPass[0]
                                                          ?.keyId
                                                      : item.raw.visitorPass,
                                                  )
                                                "
                                              >
                                                <v-chip
                                                  class="my-1"
                                                  variant="outlined"
                                                  size="small"
                                                  color="gray"
                                                >
                                                  <v-icon
                                                    size="medium"
                                                    :class="`${$vuetify.display.mdAndUp ? '' : 'mx-1 mr-2'}`"
                                                  >
                                                    mdi-badge-account-outline
                                                  </v-icon>
                                                  <v-icon start size="x-large">
                                                    mdi-information-slab-symbol
                                                  </v-icon>
                                                </v-chip>
                                              </span>
                                            </span>
                                          </span>
                                        </span>
                                      </div>
                                    </span>
                                  </v-col>

                                  <v-col cols="12">
                                    <span
                                      class="d-inline-block text-truncate text-capitalize text-body-2"
                                    >
                                      <div v-if="tab === 'guest'">
                                        <v-icon
                                          size="small"
                                          :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1 mr-4'}`"
                                          >mdi-clock-time-eight-outline
                                        </v-icon>
                                        <span>
                                          {{
                                            item.raw.arrivalTime
                                              ? item.raw.arrivalTime
                                              : "N/A"
                                          }}
                                        </span>
                                      </div>
                                      <div v-else>
                                        <v-icon
                                          size="small"
                                          :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1 mr-4'}`"
                                          color="red"
                                        >
                                          <v-img
                                            src="/icons/timeout-green.svg"
                                          ></v-img>
                                        </v-icon>
                                        <span
                                          v-if="
                                            ((item.raw.type === 'pick-up' ||
                                              item.raw.type === 'drop-off' ||
                                              item.raw.type === 'delivery' ||
                                              item.raw.type === 'walk-in') &&
                                              item.raw.actualCheckIn &&
                                              !item.raw.actualCheckOut) ||
                                            ((item.raw.type === 'guest' ||
                                              item.raw.type === 'pick-up' ||
                                              item.raw.type === 'drop-off' ||
                                              item.raw.type === 'delivery' ||
                                              item.raw.type === 'walk-in' ||
                                              item.raw.type === 'contractor') &&
                                              item.raw.actualCheckIn &&
                                              !item.raw.actualCheckOut &&
                                              (currentUser.type ===
                                                'service-provider' ||
                                                currentUser.type ===
                                                  'service-provider-member' ||
                                                currentUser.type === 'site'))
                                          "
                                        >
                                          <v-btn
                                            color="red"
                                            size="x-small"
                                            style="height: 17px"
                                            @click="
                                              (Array.isArray(
                                                item.raw.visitorPass,
                                              ) &&
                                                item.raw.visitorPass.length) ||
                                              (typeof item.raw.visitorPass ==
                                                'string' &&
                                                item.raw.visitorPass) ||
                                              (Array.isArray(
                                                item.raw.passKeys,
                                              ) &&
                                                item.raw.passKeys.length)
                                                ? onSelectVisitor(
                                                    item.raw,
                                                    'return-pass-keys',
                                                  )
                                                : updateVisitorInfo(
                                                    item.raw._id,
                                                    'check-out',
                                                    currentUser.type,
                                                  )
                                            "
                                            :loading="isVisitorCheckingOut"
                                          >
                                            Check Out
                                          </v-btn>
                                          <!-- <v-btn
                                          color="red"
                                          size="x-small"
                                          style="height: 17px"
                                          @click="
                                            (Array.isArray(
                                              item.raw.visitorPass,
                                            ) &&
                                              item.raw.visitorPass[0]?.keyId) ||
                                            (!['', null].includes(
                                              item.raw.visitorPass,
                                            ) &&
                                              !Array.isArray(
                                                item.raw.visitorPass,
                                              )) ||
                                            (Array.isArray(item.raw.passKeys) &&
                                              item.raw.passKeys.length)
                                              ? onSelectVisitor(
                                                  item.raw,
                                                  'return-pass-keys',
                                                )
                                              : updateVisitorInfo(
                                                  item.raw._id,
                                                  'check-out',
                                                  currentUser.type,
                                                )
                                          "
                                          :loading="isVisitorCheckingOut"
                                          :disabled="tab === 'temporary'"
                                        >
                                          Check Out 11
                                        </v-btn>  -->
                                        </span>
                                        <span
                                          v-else-if="
                                            item.raw.actualCheckIn &&
                                            item.raw.actualCheckOut
                                          "
                                        >
                                          {{
                                            standardFormatDateTime(
                                              item.raw.actualCheckOut,
                                            )
                                          }}
                                          <v-icon
                                            v-if="item.raw.checkOutImage"
                                            size="medium"
                                            class="mr-1 mr-md-1"
                                            :class="`${$vuetify.display.mdAndUp ? '' : 'mx-1'}`"
                                            @click="
                                              openInApp(item.raw.checkOutImage)
                                            "
                                            >mdi-image</v-icon
                                          >
                                        </span>
                                        <span v-else> N/A</span>
                                      </div>
                                    </span>
                                  </v-col>
                                </v-row>
                              </v-col>

                              <v-col cols="1">
                                <v-row
                                  no-gutters
                                  align-content="end"
                                  justify="end"
                                  align="center"
                                >
                                  <v-menu>
                                    <template #activator="{ props }">
                                      <v-icon
                                        v-bind="props"
                                        density="compact"
                                        :class="
                                          $vuetify.display.mdAndDown
                                            ? ''
                                            : 'pa-4 border-md rounded-xl'
                                        "
                                      >
                                        mdi-dots-vertical
                                      </v-icon>
                                    </template>

                                    <v-card>
                                      <v-list
                                        density="compact"
                                        class="text-caption pa-0"
                                        v-if="
                                          $ability.can('read', 'view-visitors')
                                        "
                                      >
                                        <v-list-item
                                          @click="changePath(item.raw)"
                                        >
                                          View
                                        </v-list-item>
                                        <v-list-item
                                          v-if="
                                            (item.raw.type === 'contractor' ||
                                              item.raw.type === 'guest') &&
                                            tab === 'temporary'
                                          "
                                          @click="
                                            showEditVisitorDialog(item.raw)
                                          "
                                        >
                                          Edit
                                        </v-list-item>

                                        <v-list-item
                                          v-if="
                                            $ability.can(
                                              'read',
                                              'view-visitors',
                                            ) &&
                                            tab == 'visitor' &&
                                            ![
                                              'pick-up',
                                              'drop-off',
                                              'delivery',
                                            ].includes(item.raw.type)
                                          "
                                          @click="
                                            onSelectVisitor(
                                              item.raw,
                                              'return-pass-keys',
                                            )
                                          "
                                        >
                                          {{
                                            item.raw.type === "guest" ||
                                            item.raw.type === "walk-in"
                                              ? "Pass"
                                              : "Pass & Keys"
                                          }}
                                        </v-list-item>
                                        <v-list-item
                                          v-if="
                                            item.raw.type == 'contractor' &&
                                            $ability.can(
                                              'read',
                                              'view-visitors',
                                            ) &&
                                            tab == 'visitor'
                                          "
                                          @click="
                                            onSelectVisitor(
                                              item.raw,
                                              'add-keys',
                                            )
                                          "
                                          :disabled="
                                            item.raw.type !== 'contractor'
                                          "
                                        >
                                          Add Keys
                                        </v-list-item>
                                      </v-list>
                                    </v-card>
                                  </v-menu>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-list-item-title>
                        </v-list-item>
                        <v-divider v-if="itemIndex + 1 !== items.length" />
                      </template>
                    </v-list>
                  </template>
                  <template
                    v-else
                    #default="{ items }"
                    v-if="$vuetify.display.mdAndDown"
                  >
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="item.raw._id"
                      >
                        <v-list-item
                          :class="
                            $vuetify.display.xs ? 'py-4' : 'py-lg-4 px-lg-8'
                          "
                        >
                          <v-list-item-title>
                            <v-row no-gutters>
                              <v-col
                                cols="12"
                                lg="4"
                                :class="`text-capitalize white--text text ${$vuetify.display.xs && 'mb-2'}`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate"
                                  :class="
                                    $vuetify.display.xs
                                      ? ''
                                      : 'border-md py-3 px-2 rounded-lg'
                                  "
                                  :align-content="
                                    $vuetify.display.xs ? 'center' : ''
                                  "
                                  :align="
                                    $vuetify.display.xs ? 'center' : 'center'
                                  "
                                  :justify="
                                    $vuetify.display.xs
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span
                                    v-if="$vuetify.display.xs"
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Name:
                                  </span>
                                  <span
                                    v-if="$vuetify.display.xs"
                                    class="text-truncate mt-1 text-body-2"
                                    :style="
                                      $vuetify.display.mdAndDown
                                        ? 'font-size: 1rem;'
                                        : ''
                                    "
                                  >
                                    <v-avatar
                                      size="x-small"
                                      :color="materialColors[itemIndex]"
                                      :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-3'}`"
                                    >
                                      {{
                                        item.raw.firstName && item.raw.firstName
                                          ? `${getInitial(item.raw.firstName)}${getInitial(item.raw.lastName)}`
                                          : getInitial(item.raw.name)
                                      }}
                                    </v-avatar>
                                    {{
                                      item.raw.firstName || item.raw.lastName
                                        ? `${item.raw.firstName} ${item.raw.lastName}`
                                        : item.raw.name
                                    }}
                                    <v-col
                                      class="pa-0 ma-0 pt-1"
                                      cols="10"
                                      :class="`${$vuetify.display.mdAndUp ? '' : ''}`"
                                    >
                                      <div
                                        class="text-caption text-grey"
                                        v-if="item.raw?.members?.length"
                                      >
                                        {{
                                          item.raw?.members &&
                                          item.raw?.members?.length
                                            ? `(+${item.raw?.members?.length} members)`
                                            : ""
                                        }}
                                      </div>
                                    </v-col>
                                  </span>

                                  <!-- Tablet -->
                                  <!-- Col 1 -->
                                  <v-col
                                    cols="3"
                                    sm="4"
                                    md="3"
                                    class="pl-2 pr-2"
                                    v-if="
                                      $vuetify.display.md || $vuetify.display.sm
                                    "
                                  >
                                    <v-row no-gutters class="mb-2">
                                      <span
                                        v-if="$vuetify.display.mdAndDown"
                                        class="text-truncate mt-1 mr-4 text-body-2"
                                        :style="
                                          $vuetify.display.mdAndDown
                                            ? 'font-size: .9rem;'
                                            : ''
                                        "
                                      >
                                        <v-avatar
                                          size="x-small"
                                          :color="materialColors[itemIndex]"
                                          :class="`${$vuetify.display.mdAndUp ? 'mr-1' : 'mr-1'}`"
                                        >
                                          {{
                                            item.raw.firstName &&
                                            item.raw.firstName
                                              ? `${getInitial(item.raw.firstName)}${getInitial(item.raw.lastName)}`
                                              : getInitial(item.raw.name)
                                          }}
                                        </v-avatar>
                                        {{
                                          item.raw.firstName ||
                                          item.raw.lastName
                                            ? `${item.raw.firstName} ${item.raw.lastName}`
                                            : item.raw.name
                                        }}
                                      </span>
                                      <v-col
                                        cols="10"
                                        :class="`${$vuetify.display.mdAndUp ? 'pl-8' : 'pl-4'}`"
                                      >
                                        <div
                                          class="text-caption text-grey"
                                          v-if="item.raw?.members?.length"
                                        >
                                          {{
                                            item.raw?.members &&
                                            item.raw?.members?.length
                                              ? `(+${item.raw?.members?.length} members)`
                                              : ""
                                          }}
                                        </div>
                                      </v-col>
                                    </v-row>
                                    <v-row
                                      no-gutters
                                      class="text-truncate mb-2"
                                    >
                                      <span
                                        class="text-truncate mt-1 d-flex align-center text-body-2 mr-1"
                                        :style="
                                          $vuetify.display.mdAndDown
                                            ? 'font-size: .9rem;'
                                            : ''
                                        "
                                      >
                                        <v-icon
                                          size="small"
                                          :class="`${$vuetify.display.mdAndUp ? 'mr-1' : 'mr-1'}`"
                                        >
                                          mdi-account
                                        </v-icon>
                                        <span class="text-truncate">
                                          {{
                                            item.raw.type === "contractor" &&
                                            item.raw.contractorType
                                              ? item.raw.contractorType ||
                                                "".split("-").join(" ")
                                              : item.raw.type === "guest"
                                                ? item.raw.residentGuestType
                                                  ? item.raw.residentGuestType
                                                  : "Drive-In"
                                                : item.raw.type ===
                                                      "delivery" &&
                                                    item.raw.deliveryType
                                                  ? `${item.raw.deliveryType}-Delivery`
                                                  : item.raw.type
                                          }}
                                        </span>
                                      </span>
                                    </v-row>
                                    <v-row
                                      no-gutters
                                      class="mb-2"
                                      v-if="$vuetify.display.sm"
                                    >
                                      <span
                                        class="text-truncate mt-1 text-body-2"
                                        :style="
                                          $vuetify.display.mdAndDown
                                            ? 'font-size: .9rem;'
                                            : ''
                                        "
                                      >
                                        <v-icon
                                          size="small"
                                          :class="`${$vuetify.display.mdAndUp ? 'mr-1 mb-1' : 'mr-1 mb-1'}`"
                                        >
                                          {{
                                            item.raw.companyName
                                              ? "mdi-domain"
                                              : "mdi-storefront-outline"
                                          }}
                                        </v-icon>
                                        {{
                                          item.raw.companyName
                                            ? item.raw.companyName
                                            : "N/A"
                                        }}
                                      </span>
                                    </v-row>
                                  </v-col>
                                  <!-- Col 2 -->
                                  <v-col cols="3" v-if="$vuetify.display.md">
                                    <v-row no-gutters class="mb-2">
                                      <span
                                        class="text-truncate mt-1 text-body-2"
                                        :style="
                                          $vuetify.display.mdAndDown
                                            ? 'font-size: .9rem;'
                                            : ''
                                        "
                                      >
                                        <v-icon
                                          size="small"
                                          :class="`${$vuetify.display.mdAndUp ? 'mr-1 mb-1' : 'mr-1 mb-1'}`"
                                        >
                                          {{
                                            item.raw.companyName
                                              ? "mdi-domain"
                                              : "mdi-storefront-outline"
                                          }}
                                        </v-icon>
                                        {{
                                          item.raw.companyName
                                            ? item.raw.companyName
                                            : "N/A"
                                        }}
                                      </span>
                                    </v-row>
                                    <v-row no-gutters class="mb-2">
                                      <span
                                        class="text-truncate mt-1 mr-4 text-body-2"
                                        :style="
                                          $vuetify.display.mdAndDown
                                            ? 'font-size: .9rem;'
                                            : ''
                                        "
                                      >
                                        <v-icon
                                          v-if="
                                            item.raw.blockName ||
                                            item.raw.blockLevelName ||
                                            item.raw.unitName
                                          "
                                          size="small"
                                          :class="`${$vuetify.display.mdAndUp ? 'mr-1 mb-1' : 'mr-1 mb-1'}`"
                                        >
                                          {{
                                            item.raw.companyName
                                              ? "mdi-domain"
                                              : "mdi-storefront-outline"
                                          }}
                                        </v-icon>
                                        {{
                                          item.raw.blockName ||
                                          item.raw.blockLevelName ||
                                          item.raw.unitName
                                            ? `${item.raw.blockName} ${item.raw.blockLevelName ? "/ " + item.raw.blockLevelName : ""} ${item.raw.unitName ? "/ " + item.raw.unitName : ""}`
                                            : "N/A"
                                        }}
                                      </span>
                                    </v-row>
                                  </v-col>
                                  <!-- Col 3 -->
                                  <v-col
                                    cols="2"
                                    sm="4"
                                    md="3"
                                    v-if="
                                      $vuetify.display.md || $vuetify.display.sm
                                    "
                                  >
                                    <v-row no-gutters class="mb-2">
                                      <template
                                        v-if="
                                          item.raw.email && item.raw.phoneNumber
                                        "
                                      >
                                        <div
                                          class="text-truncate mr-2 text-body-2"
                                          :class="!item.raw.email && 'pt-2'"
                                        >
                                          <v-icon size="small" class="mr-1"
                                            >mdi-phone</v-icon
                                          >
                                          {{
                                            item.raw.phoneNumber
                                              ? item.raw.phoneNumber
                                              : "N/A"
                                          }}
                                        </div>
                                        <div
                                          class="text-caption text-grey text-truncate mr-2 text-body-2"
                                          v-if="item.raw.email"
                                        >
                                          <v-icon size="small" class="mr-1"
                                            >mdi-email</v-icon
                                          >
                                          {{
                                            item.raw.email
                                              ? item.raw.email
                                              : "N/A"
                                          }}
                                        </div>
                                      </template>
                                      <div
                                        v-else
                                        class="mr-2 text-truncate text-body-2"
                                      >
                                        <v-icon size="small" class="mr-1"
                                          >mdi-phone</v-icon
                                        >
                                        {{
                                          item.raw.email
                                            ? item.raw.email
                                            : item.raw.phoneNumber
                                              ? item.raw.phoneNumber
                                              : "N/A"
                                        }}
                                      </div>
                                    </v-row>
                                    <v-row no-gutters class="mb-2">
                                      <span
                                        class="text-truncate mt-1 mr-4 d-flex align-center text-body-2"
                                        :style="
                                          $vuetify.display.mdAndDown
                                            ? 'font-size: .9rem;'
                                            : ''
                                        "
                                      >
                                        <span
                                          class="d-flex align-center text-truncate"
                                        >
                                          <v-icon
                                            size="small"
                                            :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'mr-2'}`"
                                            >mdi-car-back</v-icon
                                          >

                                          <span class="text-truncate">
                                            {{
                                              item.raw.plateNumber
                                                ? item.raw.plateNumber.toUpperCase()
                                                : "N/A"
                                            }}
                                          </span>
                                        </span>
                                        <span v-if="item.raw.type === 'guest'">
                                          <div
                                            v-if="
                                              compareDate(
                                                item.raw.checkIn,
                                                item.raw.checkOut,
                                              )
                                            "
                                            class="text-caption text-grey"
                                          >
                                            Overnight
                                          </div>
                                        </span>
                                      </span>
                                    </v-row>
                                    <v-row
                                      no-gutters
                                      v-if="$vuetify.display.sm"
                                    >
                                      <div
                                        class="mt-1 mr-4 text-body-2 d-flex align-center"
                                        :style="
                                          $vuetify.display.mdAndDown
                                            ? 'font-size: .9rem;'
                                            : ''
                                        "
                                      >
                                        <v-icon
                                          v-if="
                                            item.raw.blockName ||
                                            item.raw.blockLevelName ||
                                            item.raw.unitName
                                          "
                                          size="small"
                                          :class="`${$vuetify.display.mdAndUp ? 'mr-1 mb-1' : 'mr-1 mb-1'}`"
                                        >
                                          {{
                                            item.raw.companyName
                                              ? "mdi-domain"
                                              : "mdi-storefront-outline"
                                          }}
                                        </v-icon>
                                        <span
                                          style="
                                            word-break: break-word;
                                            white-space: normal;
                                          "
                                        >
                                          {{
                                            item.raw.blockName ||
                                            item.raw.blockLevelName ||
                                            item.raw.unitName
                                              ? `${item.raw.blockName} ${item.raw.blockLevelName ? "/ " + item.raw.blockLevelName : ""} ${item.raw.unitName ? "/ " + item.raw.unitName : ""}`
                                              : "N/A"
                                          }}
                                        </span>
                                      </div>
                                    </v-row>
                                  </v-col>
                                  <!-- Col 4 -->
                                  <v-col
                                    cols="3"
                                    sm="3"
                                    md="2"
                                    v-if="
                                      $vuetify.display.md || $vuetify.display.sm
                                    "
                                    class="d-flex align-center text-truncate"
                                  >
                                    <v-row
                                      no-gutters
                                      class="text-truncate mr-1"
                                    >
                                      <v-col cols="12">
                                        <div
                                          v-if="tab === 'guest'"
                                          class="text-capitalize text-body-2 d-flex align-center"
                                        >
                                          <v-icon
                                            size="small"
                                            :class="`${$vuetify.display.mdAndUp ? 'mx-1 mb-2' : 'mx-1 mr-1 mb-2'}`"
                                          >
                                            mdi-calendar-month-outline
                                          </v-icon>
                                          <span
                                            style="
                                              word-break: break-word;
                                              white-space: normal;
                                            "
                                            class="mb-2"
                                          >
                                            {{
                                              item.raw.registeredAt
                                                ? standardFormatDate(
                                                    item.raw.registeredAt,
                                                  )
                                                : "N/A"
                                            }}
                                          </span>
                                        </div>
                                        <div
                                          v-else
                                          class="text-capitalize text-body-2 d-flex align-center"
                                        >
                                          <v-icon
                                            size="small"
                                            :class="`${$vuetify.display.mdAndUp ? 'mx-1 mb-2' : 'mx-1 mr-1 mb-2'}`"
                                            color="green"
                                          >
                                            <v-img
                                              src="/icons/timein-green.svg"
                                            ></v-img>
                                          </v-icon>

                                          <v-btn
                                            v-if="
                                              (item.raw.type === 'delivery' ||
                                                item.raw.type === 'pick-up' ||
                                                item.raw.type === 'drop-off') &&
                                              !item.raw.actualCheckIn
                                            "
                                            color="green"
                                            class="mb-2"
                                            size="x-small"
                                            style="height: 17px"
                                            @click="
                                              updateVisitorInfo(
                                                item.raw._id,
                                                'check-in',
                                              )
                                            "
                                          >
                                            Check In
                                          </v-btn>
                                          <span
                                            v-else
                                            style="
                                              word-break: break-word;
                                              white-space: normal;
                                            "
                                            class="mb-2"
                                          >
                                            {{
                                              item.raw.actualCheckIn
                                                ? standardFormatDateTime(
                                                    item.raw.actualCheckIn,
                                                  )
                                                : "N/A"
                                            }}
                                            <v-icon
                                              v-if="item.raw.checkInImage"
                                              size="medium"
                                              class="mr-1 mr-md-1"
                                              :class="`${$vuetify.display.mdAndUp ? '' : 'mx-1'}`"
                                              @click="
                                                openInApp(item.raw.checkInImage)
                                              "
                                              >mdi-image</v-icon
                                            >
                                            <span
                                              class="text-truncate"
                                              :class="`${$vuetify.display.xlAndUp ? null : 'd-flex flex-wrap'}`"
                                            >
                                              <span
                                                v-if="
                                                  item.raw.type ===
                                                    'contractor' &&
                                                  item.raw.passKeys &&
                                                  item.raw.passKeys.length >
                                                    0 &&
                                                  !Array.isArray(
                                                    item.raw.passKeys[0],
                                                  ) &&
                                                  !item.raw.isKeyReturned
                                                "
                                                class="d-inline-block"
                                              >
                                                <v-chip
                                                  class="my-1"
                                                  variant="outlined"
                                                  size="small"
                                                  color="gray"
                                                  :class="`${$vuetify.display.mdAndUp ? 'mx-1  mr-1' : '  mr-1'}`"
                                                >
                                                  <v-icon
                                                    size="small"
                                                    :class="`${$vuetify.display.mdAndUp ? 'mx-1 mr-2' : 'mx-1 mr-2'}`"
                                                    >mdi-key</v-icon
                                                  >
                                                  {{
                                                    item.raw.passKeys &&
                                                    item.raw.passKeys.length >
                                                      0 &&
                                                    !Array.isArray(
                                                      item.raw.passKeys[0],
                                                    )
                                                      ? item.raw.passKeys.length
                                                      : 0
                                                  }}
                                                </v-chip>
                                              </span>
                                              <span
                                                v-if="
                                                  (item.raw.type ===
                                                    'contractor' ||
                                                    item.raw.type === 'guest' ||
                                                    item.raw.type ===
                                                      'walk-in') &&
                                                  ((Array.isArray(
                                                    item.raw.visitorPass,
                                                  ) &&
                                                    item.raw.visitorPass[0]
                                                      ?.keyId) ||
                                                    (!['', null].includes(
                                                      item.raw.visitorPass,
                                                    ) &&
                                                      !Array.isArray(
                                                        item.raw.visitorPass,
                                                      )))
                                                "
                                                class="d-inline-block"
                                              >
                                                <span
                                                  style="
                                                    display: inline-block;
                                                    margin-right: -2px;
                                                    cursor: pointer;
                                                  "
                                                  @click="
                                                    viewPass(
                                                      item.raw,
                                                      Array.isArray(
                                                        item.raw.visitorPass,
                                                      ) &&
                                                        item.raw.visitorPass[0]
                                                          ?.keyId
                                                        ? item.raw
                                                            .visitorPass[0]
                                                            ?.keyId
                                                        : item.raw.visitorPass,
                                                    )
                                                  "
                                                >
                                                  <v-chip
                                                    class="my-1"
                                                    variant="outlined"
                                                    size="small"
                                                    color="gray"
                                                  >
                                                    <v-icon
                                                      size="medium"
                                                      :class="`${$vuetify.display.mdAndUp ? '' : 'mx-1 mr-2'}`"
                                                    >
                                                      mdi-badge-account-outline
                                                    </v-icon>
                                                    <v-icon
                                                      start
                                                      size="x-large"
                                                    >
                                                      mdi-information-slab-symbol
                                                    </v-icon>
                                                  </v-chip>
                                                </span>
                                              </span>
                                            </span>
                                          </span>
                                        </div>
                                      </v-col>

                                      <v-col cols="12">
                                        <div
                                          v-if="tab === 'guest'"
                                          class="text-capitalize text-body-2 d-flex align-center"
                                        >
                                          <v-icon
                                            size="small"
                                            :class="`${$vuetify.display.mdAndUp ? 'mx-1 mb-2' : 'mx-1 mr-1 mb-2'}`"
                                          >
                                            mdi-clock-time-eight-outline
                                          </v-icon>
                                          <span
                                            style="
                                              word-break: break-word;
                                              white-space: normal;
                                            "
                                            class="mb-2"
                                          >
                                            {{
                                              item.raw.arrivalTime
                                                ? item.raw.arrivalTime
                                                : "N/A"
                                            }}
                                          </span>
                                        </div>
                                        <div
                                          v-else
                                          class="text-capitalize text-body-2 d-flex align-center"
                                        >
                                          <v-icon
                                            size="small"
                                            :class="`${$vuetify.display.mdAndUp ? 'mx-1 mb-2' : 'mx-1 mr-1 mb-2'}`"
                                            color="red"
                                          >
                                            <v-img
                                              src="/icons/timeout-green.svg"
                                            ></v-img>
                                          </v-icon>
                                          <span
                                            v-if="
                                              ((item.raw.type === 'pick-up' ||
                                                item.raw.type === 'drop-off' ||
                                                item.raw.type === 'delivery' ||
                                                item.raw.type === 'walk-in') &&
                                                item.raw.actualCheckIn &&
                                                !item.raw.actualCheckOut) ||
                                              ((item.raw.type === 'guest' ||
                                                item.raw.type === 'pick-up' ||
                                                item.raw.type === 'drop-off' ||
                                                item.raw.type === 'delivery' ||
                                                item.raw.type === 'walk-in' ||
                                                item.raw.type ===
                                                  'contractor') &&
                                                item.raw.actualCheckIn &&
                                                !item.raw.actualCheckOut &&
                                                (currentUser.type ===
                                                  'service-provider' ||
                                                  currentUser.type ===
                                                    'service-provider-member' ||
                                                  currentUser.type === 'site'))
                                            "
                                          >
                                            <v-btn
                                              color="red"
                                              size="x-small"
                                              style="height: 17px"
                                              class="mb-2"
                                              @click="
                                                (Array.isArray(
                                                  item.raw.visitorPass,
                                                ) &&
                                                  item.raw.visitorPass
                                                    .length) ||
                                                (typeof item.raw.visitorPass ==
                                                  'string' &&
                                                  item.raw.visitorPass) ||
                                                (Array.isArray(
                                                  item.raw.passKeys,
                                                ) &&
                                                  item.raw.passKeys.length)
                                                  ? onSelectVisitor(
                                                      item.raw,
                                                      'return-pass-keys',
                                                    )
                                                  : updateVisitorInfo(
                                                      item.raw._id,
                                                      'check-out',
                                                      currentUser.type,
                                                    )
                                              "
                                              :loading="isVisitorCheckingOut"
                                            >
                                              Check Out
                                            </v-btn>
                                            <!-- <v-btn
                                              color="red"
                                              size="x-small"
                                              style="height: 17px"
                                              class="mb-2"
                                              @click="
                                                (Array.isArray(
                                                  item.raw.visitorPass,
                                                ) &&
                                                  item.raw.visitorPass[0]
                                                    ?.keyId) ||
                                                (!['', null].includes(
                                                  item.raw.visitorPass,
                                                ) &&
                                                  !Array.isArray(
                                                    item.raw.visitorPass,
                                                  )) ||
                                                (Array.isArray(
                                                  item.raw.passKeys,
                                                ) &&
                                                  item.raw.passKeys.length)
                                                  ? onSelectVisitor(
                                                      item.raw,
                                                      'return-pass-keys',
                                                    )
                                                  : updateVisitorInfo(
                                                      item.raw._id,
                                                      'check-out',
                                                      currentUser.type,
                                                    )
                                              "
                                              :loading="isVisitorCheckingOut"
                                              :disabled="tab === 'temporary'"
                                            >
                                              Check Out
                                            </v-btn> -->
                                          </span>
                                          <span
                                            style="
                                              word-break: break-word;
                                              white-space: normal;
                                            "
                                            class="mb-2"
                                            v-else-if="
                                              item.raw.actualCheckIn &&
                                              item.raw.actualCheckOut
                                            "
                                          >
                                            {{
                                              item.raw.actualCheckOut
                                                ? standardFormatDateTime(
                                                    item.raw.actualCheckOut,
                                                  )
                                                : "N/A"
                                            }}
                                            <v-icon
                                              v-if="item.raw.checkOutImage"
                                              size="medium"
                                              class="mr-1 mr-md-1"
                                              :class="`${$vuetify.display.mdAndUp ? '' : 'mx-1'}`"
                                              @click="
                                                openInApp(
                                                  item.raw.checkOutImage,
                                                )
                                              "
                                              >mdi-image</v-icon
                                            >
                                          </span>
                                        </div>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                  <!-- Col 5 -->
                                  <v-col
                                    cols="1"
                                    v-if="
                                      $vuetify.display.md || $vuetify.display.sm
                                    "
                                    class="d-flex align-center"
                                  >
                                    <v-row
                                      no-gutters
                                      class="mb-2"
                                      justify="center"
                                      align-content="center"
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
                                            v-if="
                                              $ability.can(
                                                'read',
                                                'view-visitors',
                                              )
                                            "
                                          >
                                            <v-list-item
                                              @click="changePath(item.raw)"
                                            >
                                              View
                                            </v-list-item>
                                            <v-list-item
                                              v-if="
                                                (item.raw.type ===
                                                  'contractor' ||
                                                  item.raw.type === 'guest') &&
                                                tab === 'temporary'
                                              "
                                              @click="
                                                showEditVisitorDialog(item.raw)
                                              "
                                            >
                                              Edit
                                            </v-list-item>
                                            <v-list-item
                                              v-if="
                                                $ability.can(
                                                  'read',
                                                  'view-visitors',
                                                ) &&
                                                tab == 'visitor' &&
                                                ![
                                                  'pick-up',
                                                  'drop-off',
                                                  'delivery',
                                                ].includes(item.raw.type)
                                              "
                                              @click="
                                                onSelectVisitor(
                                                  item.raw,
                                                  'return-pass-keys',
                                                )
                                              "
                                            >
                                              {{
                                                item.raw.type === "guest" ||
                                                item.raw.type === "walk-in"
                                                  ? "Pass"
                                                  : "Pass & Keys"
                                              }}
                                            </v-list-item>
                                            <v-list-item
                                              v-if="
                                                item.raw.type == 'contractor' &&
                                                $ability.can(
                                                  'read',
                                                  'view-visitors',
                                                ) &&
                                                tab == 'visitor'
                                              "
                                              @click="
                                                onSelectVisitor(
                                                  item.raw,
                                                  'add-keys',
                                                )
                                              "
                                              :disabled="
                                                item.raw.type !== 'contractor'
                                              "
                                            >
                                              Add Keys
                                            </v-list-item>
                                          </v-list>
                                        </v-card>
                                      </v-menu>
                                    </v-row>
                                  </v-col>
                                </v-row>
                              </v-col>
                              <v-col
                                v-if="$vuetify.display.xs"
                                cols="12"
                                md="3"
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
                                    v-if="$vuetify.display.xs"
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Type:
                                  </span>
                                  <span
                                    v-if="$vuetify.display.xs"
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon
                                      size="small"
                                      :class="`${$vuetify.display.mdAndUp ? '' : 'mr-1'}`"
                                    >
                                      mdi-account
                                    </v-icon>
                                    {{
                                      item.raw.type === "contractor" &&
                                      item.raw.contractorType
                                        ? item.raw.contractorType ||
                                          "".split("-").join(" ")
                                        : item.raw.type === "guest"
                                          ? item.raw.residentGuestType
                                            ? item.raw.residentGuestType
                                            : "Drive-In"
                                          : item.raw.type === "delivery" &&
                                              item.raw.deliveryType
                                            ? `${item.raw.deliveryType}-Delivery`
                                            : item.raw.type
                                    }}
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                v-if="$vuetify.display.xs"
                                cols="12"
                                md="3"
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
                                    v-if="$vuetify.display.xs"
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Company:
                                  </span>
                                  <span
                                    v-if="$vuetify.display.xs"
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon
                                      v-if="item.raw.companyName"
                                      size="small"
                                      :class="`${$vuetify.display.mdAndUp ? '' : 'mr-1'}`"
                                    >
                                      {{
                                        item.raw.companyName
                                          ? "mdi-domain"
                                          : "mdi-storefront-outline"
                                      }}
                                    </v-icon>
                                    {{
                                      item.raw.companyName
                                        ? item.raw.companyName
                                        : "N/A"
                                    }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                v-if="$vuetify.display.xs"
                                cols="12"
                                md="3"
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
                                    v-if="$vuetify.display.xs"
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Location:
                                  </span>
                                  <span
                                    v-if="$vuetify.display.xs"
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon
                                      v-if="
                                        item.raw.blockName ||
                                        item.raw.blockLevelName ||
                                        item.raw.unitName
                                      "
                                      size="small"
                                      :class="`${$vuetify.display.mdAndUp ? '' : 'mr-1'}`"
                                    >
                                      {{
                                        item.raw.companyName
                                          ? "mdi-domain"
                                          : "mdi-storefront-outline"
                                      }}
                                    </v-icon>
                                    {{
                                      item.raw.blockName ||
                                      item.raw.blockLevelName ||
                                      item.raw.unitName
                                        ? `${item.raw.blockName} ${item.raw.blockLevelName ? "/ " + item.raw.blockLevelName : ""} ${item.raw.unitName ? "/ " + item.raw.unitName : ""}`
                                        : "N/A"
                                    }}
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                v-if="$vuetify.display.xs"
                                cols="12"
                                md="3"
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
                                    v-if="$vuetify.display.xs"
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Contact No:
                                  </span>
                                  <span
                                    v-if="$vuetify.display.xs"
                                    :class="
                                      item.raw.email && item.raw.phoneNumber
                                        ? 'text-truncate mt-1 d-flex align-center'
                                        : 'text-truncate mt-1'
                                    "
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon
                                      size="small"
                                      :class="`${$vuetify.display.mdAndUp ? '' : 'mr-1'}`"
                                      >mdi-phone</v-icon
                                    >

                                    <span
                                      class="d-flex flex-column align-end"
                                      v-if="
                                        item.raw.email && item.raw.phoneNumber
                                      "
                                    >
                                      <span :class="!item.raw.email && 'pt-2'">
                                        {{
                                          item.raw.phoneNumber
                                            ? item.raw.phoneNumber
                                            : "N/A"
                                        }}
                                      </span>
                                      <span
                                        class="text-caption text-grey"
                                        v-if="item.raw.email"
                                      >
                                        {{
                                          item.raw.email
                                            ? item.raw.email
                                            : "N/A"
                                        }}
                                      </span>
                                    </span>
                                    <span v-else class="pt-2">
                                      {{
                                        item.raw.email
                                          ? item.raw.email
                                          : item.raw.phoneNumber
                                            ? item.raw.phoneNumber
                                            : "N/A"
                                      }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                v-if="$vuetify.display.xs"
                                cols="12"
                                md="3"
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
                                    v-if="$vuetify.display.xs"
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Vehicle No:
                                  </span>
                                  <span
                                    v-if="$vuetify.display.xs"
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon
                                      size="small"
                                      :class="`${$vuetify.display.mdAndUp ? '' : 'mr-1'}`"
                                      >mdi-car-back</v-icon
                                    >

                                    <span>
                                      {{
                                        item.raw.plateNumber
                                          ? item.raw.plateNumber.toUpperCase()
                                          : "N/A"
                                      }}
                                    </span>
                                    <span v-if="item.raw.type === 'guest'">
                                      <div
                                        v-if="
                                          compareDate(
                                            item.raw.checkIn,
                                            item.raw.checkOut,
                                          )
                                        "
                                        class="text-caption text-grey"
                                      >
                                        Overnight
                                      </div>
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                v-if="$vuetify.display.xs"
                                cols="12"
                                md="3"
                                class="text text-capitalize mb-6"
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
                                    v-if="
                                      $vuetify.display.xs && tab === 'guest'
                                    "
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Arrival Date/Time:
                                  </span>
                                  <span
                                    v-else-if="$vuetify.display.xs"
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Check In/Out:
                                  </span>
                                  <span
                                    v-if="$vuetify.display.xs"
                                    class="text-truncate mt-1 d-flex justify-center flex-column"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-btn
                                      v-if="
                                        (item.raw.type === 'delivery' ||
                                          item.raw.type === 'pick-up' ||
                                          item.raw.type === 'drop-off') &&
                                        !item.raw.actualCheckIn
                                      "
                                      color="green"
                                      class="ml-1"
                                      size="x-small"
                                      style="height: 17px"
                                      @click="
                                        updateVisitorInfo(
                                          item.raw._id,
                                          'check-in',
                                        )
                                      "
                                    >
                                      Check In
                                    </v-btn>
                                    <span
                                      class="d-flex justify-center text-capitalize"
                                      style="
                                        white-space: normal;
                                        overflow-wrap: break-word;
                                        width: 100%;
                                      "
                                      v-else-if="tab === 'guest'"
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? '' : 'mr-1 ml-2'}`"
                                      >
                                        mdi-calendar-month-outline
                                      </v-icon>

                                      {{
                                        item.raw.registeredAt
                                          ? standardFormatDate(
                                              item.raw.registeredAt,
                                            )
                                          : "N/A"
                                      }}
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? '' : 'mr-1 ml-2'}`"
                                      >
                                        mdi-clock-time-eight-outline
                                      </v-icon>

                                      {{
                                        item.raw.arrivalTime
                                          ? item.raw.arrivalTime
                                          : "N/A"
                                      }}
                                    </span>
                                    <span
                                      class="d-flex justify-center text-capitalize"
                                      style="
                                        white-space: normal;
                                        overflow-wrap: break-word;
                                        width: 100%;
                                      "
                                      v-else
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? '' : 'mr-1 ml-2'}`"
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
                                      <v-icon
                                        v-if="item.raw.checkInImage"
                                        size="medium"
                                        class="mr-1 mr-md-1"
                                        :class="`${$vuetify.display.mdAndUp ? '' : 'mx-1'}`"
                                        @click="
                                          openInApp(item.raw.checkInImage)
                                        "
                                        >mdi-image</v-icon
                                      >
                                      <span
                                        :class="`${$vuetify.display.xlAndUp || $vuetify.display.xlAndDown ? null : 'd-flex flex-wrap pl-8'}`"
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
                                          <v-chip
                                            class="my-1"
                                            variant="outlined"
                                            size="small"
                                            color="gray"
                                            :class="`${$vuetify.display.mdAndUp ? 'mx-1 mr-2' : 'mx-1 mr-2'}`"
                                          >
                                            <v-icon
                                              size="small"
                                              :class="`${$vuetify.display.mdAndUp ? 'mx-1 mr-2' : 'mx-1 mr-2'}`"
                                              >mdi-key</v-icon
                                            >
                                            {{
                                              item.raw.passKeys &&
                                              item.raw.passKeys.length > 0 &&
                                              !Array.isArray(
                                                item.raw.passKeys[0],
                                              )
                                                ? item.raw.passKeys.length
                                                : 0
                                            }}
                                          </v-chip>
                                        </span>
                                        <span
                                          v-if="
                                            (item.raw.type === 'contractor' ||
                                              item.raw.type === 'guest' ||
                                              item.raw.type === 'walk-in') &&
                                            ((Array.isArray(
                                              item.raw.visitorPass,
                                            ) &&
                                              item.raw.visitorPass[0]?.keyId) ||
                                              (!['', null].includes(
                                                item.raw.visitorPass,
                                              ) &&
                                                !Array.isArray(
                                                  item.raw.visitorPass,
                                                )))
                                          "
                                          class="d-inline-block"
                                          ><span
                                            style="
                                              display: inline-block;
                                              margin-right: -2px;
                                              cursor: pointer;
                                            "
                                            @click="
                                              viewPass(
                                                item.raw,
                                                Array.isArray(
                                                  item.raw.visitorPass,
                                                ) &&
                                                  item.raw.visitorPass[0]?.keyId
                                                  ? item.raw.visitorPass[0]
                                                      ?.keyId
                                                  : item.raw.visitorPass,
                                              )
                                            "
                                          >
                                            <v-chip
                                              class="my-1"
                                              variant="outlined"
                                              size="small"
                                              color="gray"
                                            >
                                              <v-icon
                                                size="medium"
                                                :class="`${$vuetify.display.mdAndUp ? '' : 'mx-1 mr-2'}`"
                                              >
                                                mdi-badge-account-outline
                                              </v-icon>
                                              <v-icon start size="x-large">
                                                mdi-information-slab-symbol
                                              </v-icon>
                                            </v-chip>
                                          </span>
                                        </span>
                                      </span>
                                    </span>
                                    <span
                                      v-if="
                                        ((item.raw.type === 'pick-up' ||
                                          item.raw.type === 'drop-off' ||
                                          item.raw.type === 'delivery' ||
                                          item.raw.type === 'walk-in' ||
                                          item.raw.type === 'guest') &&
                                          item.raw.actualCheckIn &&
                                          !item.raw.actualCheckOut) ||
                                        ((item.raw.type === 'guest' ||
                                          item.raw.type === 'pick-up' ||
                                          item.raw.type === 'drop-off' ||
                                          item.raw.type === 'delivery' ||
                                          item.raw.type === 'walk-in' ||
                                          item.raw.type === 'contractor') &&
                                          item.raw.actualCheckIn &&
                                          !item.raw.actualCheckOut &&
                                          (currentUser.type ===
                                            'service-provider' ||
                                            currentUser.type ===
                                              'service-provider-member' ||
                                            currentUser.type === 'site'))
                                      "
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? '' : 'mr-1 ml-2'}`"
                                        color="red"
                                      >
                                        <v-img
                                          src="/icons/timeout-green.svg"
                                        ></v-img>
                                      </v-icon>
                                      <v-btn
                                        color="red"
                                        size="x-small"
                                        style="height: 17px"
                                        @click="
                                          (Array.isArray(
                                            item.raw.visitorPass,
                                          ) &&
                                            item.raw.visitorPass.length) ||
                                          (typeof item.raw.visitorPass ==
                                            'string' &&
                                            item.raw.visitorPass) ||
                                          (Array.isArray(item.raw.passKeys) &&
                                            item.raw.passKeys.length)
                                            ? onSelectVisitor(
                                                item.raw,
                                                'return-pass-keys',
                                              )
                                            : updateVisitorInfo(
                                                item.raw._id,
                                                'check-out',
                                                currentUser.type,
                                              )
                                        "
                                        :loading="isVisitorCheckingOut"
                                      >
                                        Check Out
                                      </v-btn>
                                      <!-- <v-btn
                                        color="red"
                                        size="x-small"
                                        style="height: 17px"
                                        @click="
                                          (Array.isArray(
                                            item.raw.visitorPass,
                                          ) &&
                                            item.raw.visitorPass[0]?.keyId) ||
                                          (!['', null].includes(
                                            item.raw.visitorPass,
                                          ) &&
                                            !Array.isArray(
                                              item.raw.visitorPass,
                                            )) ||
                                          (Array.isArray(item.raw.passKeys) &&
                                            item.raw.passKeys.length)
                                            ? onSelectVisitor(
                                                item.raw,
                                                'return-pass-keys',
                                              )
                                            : updateVisitorInfo(
                                                item.raw._id,
                                                'check-out',
                                                currentUser.type,
                                              )
                                        "
                                        :loading="isVisitorCheckingOut"
                                        :disabled="tab === 'temporary'"
                                      >
                                        Check Out
                                      </v-btn> -->
                                    </span>
                                    <span
                                      v-else-if="
                                        item.raw.actualCheckIn &&
                                        item.raw.actualCheckOut
                                      "
                                    >
                                      <v-icon
                                        size="small"
                                        :class="`${$vuetify.display.mdAndUp ? '' : 'mr-1 ml-2'}`"
                                        color="red"
                                      >
                                        <v-img
                                          src="/icons/timeout-green.svg"
                                        ></v-img>
                                      </v-icon>
                                      {{
                                        item.raw.actualCheckOut
                                          ? standardFormatDateTime(
                                              item.raw.actualCheckOut,
                                            )
                                          : "N/A"
                                      }}
                                      <v-icon
                                        v-if="item.raw.checkOutImage"
                                        size="medium"
                                        class="mr-1 mr-md-1"
                                        :class="`${$vuetify.display.mdAndUp ? '' : 'mx-1'}`"
                                        @click="
                                          openInApp(item.raw.checkOutImage)
                                        "
                                        >mdi-image</v-icon
                                      >
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>
                            </v-row>
                            <v-row no-gutters v-if="$vuetify.display.xs">
                              <v-col
                                cols="6"
                                md="2"
                                class="pa-2 text-capitalize white--text text font-weight-bold"
                              >
                              </v-col>
                              <v-col
                                cols="6"
                                md="10"
                                class="text-capitalize white--text d-flex align-center d-flex justify-center"
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
                                        >mdi-dots-vertical</v-icon
                                      >
                                    </template>

                                    <v-card>
                                      <v-list
                                        density="compact"
                                        class="text-caption pa-0"
                                        v-if="
                                          $ability.can('read', 'view-visitors')
                                        "
                                      >
                                        <v-list-item
                                          @click="changePath(item.raw)"
                                        >
                                          View
                                        </v-list-item>
                                        <v-list-item
                                          v-if="
                                            (item.raw.type === 'contractor' ||
                                              item.raw.type === 'guest') &&
                                            tab === 'temporary'
                                          "
                                          @click="
                                            showEditVisitorDialog(item.raw)
                                          "
                                        >
                                          Edit
                                        </v-list-item>
                                        <v-list-item
                                          v-if="
                                            $ability.can(
                                              'read',
                                              'view-visitors',
                                            ) &&
                                            tab == 'visitor' &&
                                            ![
                                              'pick-up',
                                              'drop-off',
                                              'delivery',
                                            ].includes(item.raw.type)
                                          "
                                          @click="
                                            onSelectVisitor(
                                              item.raw,
                                              'return-pass-keys',
                                            )
                                          "
                                        >
                                          {{
                                            item.raw.type === "guest" ||
                                            item.raw.type === "walk-in"
                                              ? "Pass"
                                              : "Pass & Keys"
                                          }}
                                        </v-list-item>
                                        <v-list-item
                                          v-if="
                                            item.raw.type == 'contractor' &&
                                            $ability.can(
                                              'read',
                                              'view-visitors',
                                            ) &&
                                            tab == 'visitor'
                                          "
                                          @click="
                                            onSelectVisitor(
                                              item.raw,
                                              'add-keys',
                                            )
                                          "
                                          :disabled="
                                            item.raw.type !== 'contractor'
                                          "
                                        >
                                          Add Keys
                                        </v-list-item>
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
                            $vuetify.display.xs
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
                            You don't have any visitor yet.
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
                :disabled="canPrevPage"
                @click="
                  prevPage({
                    search,
                    sites: [mySite],
                    types: filterVisitor.length ? filterVisitor : null,
                    date: {
                      from: moment.tz(
                        moment(filters.from, 'DD/MM/YYYY'),
                        'Asia/Singapore',
                      ),
                      to: moment.tz(
                        moment(filters.to, 'DD/MM/YYYY').endOf('day'),
                        'Asia/Singapore',
                      ),
                    },

                    tab,
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
                :disabled="!canNextPage"
                @click="
                  nextPage({
                    search,
                    sites: [mySite],
                    types: filterVisitor.length ? filterVisitor : null,
                    date: {
                      from: moment.tz(
                        moment(filters.from, 'DD/MM/YYYY'),
                        'Asia/Singapore',
                      ),
                      to: moment.tz(
                        moment(filters.to, 'DD/MM/YYYY').endOf('day'),
                        'Asia/Singapore',
                      ),
                    },

                    tab,
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

    <VisitorsAddForSpmAndSpt
      v-if="
        currentUser.type == 'service-provider' ||
        currentUser.type == 'site' ||
        currentUser.type == 'service-provider-member'
      "
    />
    <VisitorsEditVisitor />
    <VisitorsAddForSP v-if="currentUser.type == 'organization'" />
    <!-- <VisitorsEditPasskey /> -->
    <VisitorsScannedVisitor
      :data="unregisteredData"
      @on-proceed="onAddingUnregistered($event)"
    />

    <v-dialog
      v-model="openImageDialog"
      width="80vw"
      @update:modelValue="imageDialogClosed"
    >
      <div style="max-height: 90vh; overflow: auto">
        <v-img :src="`/api/files/${selectedImage}`" />
      </div>
    </v-dialog>

    <!-- Please use this and transfer the logic here -->
    <!-- <QrScanner v-model="showQRdialog" @qr-scanned="handleScannedResult" /> -->

    <v-dialog
      v-model="showQRdialog"
      transition="dialog-bottom-transition"
      width="700"
      max-width="700"
      persistent
      @after-enter="startScanner"
    >
      <v-container class="d-flex justify-center" max-height="90vh">
        <!-- QR code reader container -->
        <v-card
          elevation="2"
          class="d-flex flex-column align-center pa-2 w-100 h-100"
          :style="
            $vuetify.display.xs
              ? 'max-width: 90vw;'
              : $vuetify.display.sm
                ? 'max-width: 80vw;'
                : 'max-width: 100%;'
          "
        >
          <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
            <v-card-title class="text-h5"> Scan QR Code </v-card-title>
            <v-spacer></v-spacer>
            <v-btn
              color="grey-darken-1"
              icon="mdi-close"
              @click="closeDialog()"
            ></v-btn>
          </v-toolbar>

          <div
            id="reader"
            class="d-flex justify-center align-center w-100 h-100"
            style="height: calc(100vh - 64px)"
          >
            <!-- The QR code scanner box -->
            <!-- This is where the QR code scanner will be displayed -->
          </div>
          <!-- Show Error Messages -->
          <div v-if="showNotFoundMessage">
            <p>{{ errorMessage }}</p>
          </div>
          <!-- Switch camera button inside the reader box -->
          <v-btn color="primary" icon class="mt-4" @click="switchCamera()">
            <v-icon large>mdi-camera-switch</v-icon>
          </v-btn>
        </v-card>
      </v-container>
    </v-dialog>

    <!-- show visitor pass dialog -->
    <v-dialog
      v-model="showVisitorPassDialog"
      transition="dialog-right-transition"
      fullscreen
      persistent
      :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
    >
      <v-card
        v-if="visitor"
        :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
        :class="`${theme == 'light' && 'bg-white'} px-3 h-100 ${$vuetify.display.mdAndUp && 'rounded-s-xl'}`"
      >
        <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
          <span class="font-weight-bold pl-4 pt-1"> Visitor's Pass </span>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            icon="mdi-close"
            @click="closeViewPassDialog()"
          ></v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text>
          <v-row no-gutters class="fill-height" align-content="center">
            <v-col cols="12">
              <v-img src="/images/visitor-contractor.svg" height="125" />
            </v-col>
            <v-col cols="12" class="text-capitalize">
              <v-avatar size="x-small" color="blue-darken-3" class="mr-1">
                {{
                  visitor.firstName && visitor.firstName
                    ? `${getInitial(visitor.firstName)}${getInitial(visitor.lastName)}`
                    : getInitial(visitor.name)
                }}
              </v-avatar>
              {{
                visitor.firstName || visitor.lastName
                  ? `${visitor.firstName} ${visitor.lastName}`
                  : visitor.name
              }}
            </v-col>

            <v-col cols="12" class="my-4 ml-1">
              <span class="text-caption">Location: </span>
              <br />
              <v-icon start>mdi-map-marker</v-icon>{{ visitor.blockName }} /
              {{ visitor.blockLevelName }} / {{ visitor.unitName }}
            </v-col>

            <v-col cols="12" class="mt-4">
              <v-chip class="font-weight-bold" color="gray" size="x-large">
                <v-avatar color="primary">
                  <v-icon icon="mdi-badge-account-outline" />
                </v-avatar>
                <div v-if="isPassListLoading" class="dot-pulse ml-5"></div>
                <div v-else class="ml-2">{{ visitorPass }}</div>
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- update passes and or keys dialog -->
    <v-dialog
      v-model="updatePassesKeysDialog"
      transition="dialog-right-transition"
      fullscreen
      persistent
      :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
    >
      <v-card
        v-if="visitor"
        :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
        :class="`${theme == 'light' && 'bg-white'} px-3 h-100 ${$vuetify.display.mdAndUp && 'rounded-s-xl'}`"
      >
        <!-- kejfh -->
        <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
          <span class="font-weight-bold pl-4 pt-1">
            {{
              dialogType !== "add-keys"
                ? visitor.type === "guest" || visitor.type === "walk-in"
                  ? "Update Pass"
                  : "Update Pass or Keys"
                : visitor.type === "guest" || visitor.type === "walk-in"
                  ? "Add Pass"
                  : "Add Keys"
            }}
          </span>
          <!-- <span class="font-weight-bold pl-4 pt-1">
            {{ dialogType !== "add-keys" ? "Update Pass or" : "Add" }} Keys
          </span> -->
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            icon="mdi-close"
            @click="onCloseUpdatePassesKeysDialog()"
          ></v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text>
          <v-row no-gutters class="fill-height" align-content="center">
            <v-col cols="12">
              <v-img src="/images/visitor-contractor.svg" height="125" />
            </v-col>
            <v-col cols="12" class="text-capitalize">
              <v-avatar size="x-small" color="blue-darken-3" class="mr-1">
                {{
                  visitor.firstName && visitor.firstName
                    ? `${getInitial(visitor.firstName)}${getInitial(visitor.lastName)}`
                    : getInitial(visitor.name)
                }}
              </v-avatar>
              {{
                visitor.firstName || visitor.lastName
                  ? `${visitor.firstName} ${visitor.lastName}`
                  : visitor.name
              }}
            </v-col>

            <v-col cols="12" class="my-4 ml-1">
              <span class="text-caption">Location: </span>
              <br />
              <v-icon start>mdi-map-marker</v-icon>{{ visitor.blockName }} /
              {{ visitor.blockLevelName }} / {{ visitor.unitName }}
            </v-col>
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

            <!-- add keys-->
            <v-col
              v-if="dialogType == 'add-keys' && !isSuccessfullyUpdated"
              cols="12"
              class="mt-4"
            >
              <v-row no-gutters>
                <v-col cols="12" class="font-weight-bold font-weight-bold">
                  Current Pass
                </v-col>
                <v-col v-if="isPassListLoading" cols="12">
                  <v-progress-linear color="deep-purple" indeterminate />
                </v-col>
                <v-col
                  v-if="
                    visitorCurrentPass?.length && visitorCurrentPass[0]?.keyId
                  "
                  cols="12"
                >
                  <v-card
                    class="border rounded"
                    variant="flat"
                    style="
                      display: flex;
                      height: 52px;
                      padding: var(--f-spacing-0, 0px) var(--f-spacing-80, 8px)
                        var(--f-spacing-0, 0px) 16px;
                      justify-content: space-between;
                      align-items: center;
                      align-self: stretch;
                    "
                    tile
                  >
                    <v-chip
                      v-for="(visitorPass, i) in visitorCurrentPass"
                      :key="i"
                      size="small"
                      prepend-icon="mdi-badge-account-outline"
                      :text="visitorPass.prefixAndName"
                    />
                  </v-card>
                </v-col>
                <v-col v-else cols="12" class="text-caption">
                  No current pass assigned.
                </v-col>

                <v-col cols="12" class="font-weight-bold mt-4 font-weight-bold">
                  Current Keys
                </v-col>
                <v-col v-if="isKeyListLoading" cols="12">
                  <v-progress-linear color="deep-purple" indeterminate />
                </v-col>
                <v-col v-if="visitorCurrentKeys[0]?.keyId" cols="12">
                  <v-card
                    class="border rounded"
                    variant="flat"
                    style="
                      display: flex;
                      height: auto;
                      padding: var(--f-spacing-0, 0px) var(--f-spacing-80, 8px)
                        var(--f-spacing-0, 0px) 16px;
                      justify-content: space-between;
                      align-items: center;
                      align-self: stretch;
                    "
                    tile
                  >
                    <v-row no-gutters class="my-3">
                      <v-col
                        v-for="(currentKey, i) in visitorCurrentKeys"
                        :key="i"
                        cols="auto"
                        class="mr-1 my-1"
                      >
                        <v-chip
                          size="small"
                          prepend-icon="mdi-key"
                          :text="currentKey.prefixAndName"
                        />
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>

                <v-col v-else cols="12" class="text-caption">
                  No current key(s) assigned.
                </v-col>

                <v-col cols="12" class="font-weight-bold mt-4">
                  New Keys
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="visitorNewKeys"
                    :items="availableKeyList"
                    placeholder="Select keys to add"
                    item-title="prefixAndName"
                    item-value="_id"
                    return-object
                    density="comfortable"
                    :disabled="!availableKeyList.length"
                    :loading="isKeyListLoading"
                    :hint="
                      !availableKeyList.length
                        ? 'No available key(s) found.'
                        : ''
                    "
                    clearable
                    multiple
                    chips
                    closable-chips
                    @update:search="(query: string) => searchKey(query)"
                  >
                    <template v-slot:append-item>
                      <div v-intersect="endIntersectKeys" />
                    </template>
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
            </v-col>

            <!-- return passes or keys -->
            <v-col v-if="dialogType == 'return-pass-keys'" cols="12">
              <v-row no-gutters>
                <!-- pass -->
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="12" class="mt-4 ml-1 font-weight-bold">
                      Pass
                    </v-col>

                    <v-col v-if="isPassListLoading" cols="12">
                      <v-progress-linear color="deep-purple" indeterminate />
                    </v-col>

                    <v-col cols="12" class="mt-4 ml-1">
                      <v-row no-gutters>
                        <v-col
                          v-if="
                            visitorCurrentPass?.length &&
                            visitorCurrentPass[0]?.keyId
                          "
                          v-for="(visitorPass, i) in visitorCurrentPass"
                          :key="i"
                          cols="12"
                        >
                          <v-card
                            class="border rounded"
                            variant="flat"
                            :style="`display: flex;
                              height: ${!['Not Returned', 'Returned'].includes(visitorPass?.status) || ['Damaged', 'Lost', 'Others'].includes(visitorPass?.status) ? 'auto' : '52px'};
                              padding: var(--f-spacing-0, 0px)
                                var(--f-spacing-80, 8px) var(--f-spacing-0, 0px)
                                16px;
                              justify-content: space-between;
                              align-items: center;
                              align-self: stretch;
                              `"
                            tile
                          >
                            <v-row no-gutters justify="space-between">
                              <v-col cols="5">
                                <v-row
                                  no-gutters
                                  :class="`fill-height ${!['Not Returned', 'Returned'].includes(visitorPass?.status) || ['Damaged', 'Lost', 'Others'].includes(visitorPass?.status) ? 'my-2' : ''}`"
                                  align-content="center"
                                >
                                  <v-col cols="12">
                                    {{ visitorPass?.prefixAndName }}
                                  </v-col>
                                </v-row>
                              </v-col>
                              <v-col cols="7">
                                <v-row
                                  no-gutters
                                  :class="`fill-height ${!['Not Returned', 'Returned'].includes(visitorPass?.status) || ['Damaged', 'Lost', 'Others'].includes(visitorPass?.status) ? 'my-2' : ''}`"
                                  align-content="center"
                                >
                                  <v-combobox
                                    v-model="visitorPass.status"
                                    :items="[
                                      'Not Returned',
                                      'Returned',
                                      'Damaged',
                                      'Lost',
                                      'Others',
                                    ]"
                                    hide-details
                                  />
                                </v-row>
                              </v-col>
                              <v-col
                                v-if="
                                  !['Not Returned', 'Returned'].includes(
                                    visitorPass?.status,
                                  ) ||
                                  ['Damaged', 'Lost', 'Others'].includes(
                                    visitorPass?.status,
                                  )
                                "
                                cols="12"
                              >
                                <v-row no-gutters>
                                  <v-col cols="12">
                                    <span class="text-caption">Remarks</span>
                                  </v-col>
                                  <v-col cols="12">
                                    <v-textarea
                                      v-model="visitorPass.remarks"
                                      placeholder="Enter remarks..."
                                      rows="3"
                                      dense
                                      hide-details
                                    />
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-card>
                        </v-col>
                        <v-col v-else cols="12" class="ml-1 text-caption">
                          No current pass assigned.
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
                <!-- keys -->

                <v-col
                  cols="12"
                  class="mt-10 ml-1 font-weight-bold"
                  v-if="!['guest', 'walk-in'].includes(visitor.type)"
                >
                  Keys
                </v-col>
                <v-col v-if="isKeyListLoading" cols="12">
                  <v-progress-linear color="deep-purple" indeterminate />
                </v-col>
                <v-col v-if="visitorCurrentKeys[0]?.keyId" cols="12">
                  <v-row no-gutters>
                    <v-col
                      v-for="(key, i) in visitorCurrentKeys"
                      :key="i"
                      cols="12"
                      class="mt-4 ml-1"
                    >
                      <v-card
                        class="border rounded"
                        variant="flat"
                        :style="`display: flex;
                              height: ${!['Not Returned', 'Returned'].includes(key?.status) || ['Damaged', 'Lost', 'Others'].includes(key?.status) ? 'auto' : '52px'};
                              padding: var(--f-spacing-0, 0px)
                                var(--f-spacing-80, 8px) var(--f-spacing-0, 0px)
                                16px;
                              justify-content: space-between;
                              align-items: center;
                              align-self: stretch;
                              `"
                        tile
                      >
                        <v-row no-gutters justify="space-between">
                          <v-col cols="5">
                            <v-row
                              no-gutters
                              :class="`fill-height ${!['Not Returned', 'Returned'].includes(key?.status) || ['Damaged', 'Lost', 'Others'].includes(key?.status) ? 'my-2' : ''}`"
                              align-content="center"
                            >
                              <v-col cols="12">
                                {{ key?.prefixAndName }}
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="7">
                            <v-row
                              no-gutters
                              :class="`fill-height ${!['Not Returned', 'Returned'].includes(key?.status) || ['Damaged', 'Lost', 'Others'].includes(key?.status) ? 'my-2' : ''}`"
                              align-content="center"
                            >
                              <v-combobox
                                v-model="key.status"
                                :items="[
                                  'Not Returned',
                                  'Returned',
                                  'Damaged',
                                  'Lost',
                                  'Others',
                                ]"
                                hide-details
                              />
                            </v-row>
                          </v-col>
                          <v-col
                            v-if="
                              !['Not Returned', 'Returned'].includes(
                                key?.status,
                              ) ||
                              ['Damaged', 'Lost', 'Others'].includes(
                                key?.status,
                              )
                            "
                            cols="12"
                          >
                            <v-row no-gutters>
                              <v-col cols="12">
                                <span class="text-caption">Remarks</span>
                              </v-col>
                              <v-col cols="12">
                                <v-textarea
                                  v-model="key.remarks"
                                  placeholder="Enter remarks..."
                                  rows="3"
                                  dense
                                  hide-details
                                />
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col
                  v-else-if="!['guest', 'walk-in'].includes(visitor.type)"
                  cols="12"
                  class="ml-1 text-caption"
                >
                  No current key(s) assigned.
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" class="mt-4">
              <!-- <v-col
              v-if="
                (visitorCurrentPass?.length && visitorCurrentPass[0]?.keyId) ||
                visitorCurrentKeys[0]?.keyId
              "
              cols="12"
              class="mt-4"
            > -->
              <v-row no-gutters justify="space-between">
                <v-col
                  v-if="
                    dialogType == 'add-keys' ? !isSuccessfullyUpdated : true
                  "
                  :cols="dialogType == 'return-pass-keys' ? 5 : 12"
                >
                  <v-btn
                    block
                    color="blue-darken-3"
                    variant="flat"
                    style="height: 40px"
                    :loading="isUpdatingPassKeys"
                    @click="updatePassesKeys()"
                    :disabled="
                      dialogType == 'add-keys' ? !visitorNewKeys?.length : false
                    "
                  >
                    <span class="text-caption">
                      {{
                        dialogType == "return-pass-keys"
                          ? visitor.type === "guest" ||
                            visitor.type === "walk-in"
                            ? "Update Pass"
                            : "Update Pass & Keys"
                          : "Add"
                      }}
                    </span>
                  </v-btn>
                </v-col>
                <v-col v-if="dialogType == 'return-pass-keys'" cols="5">
                  <v-btn
                    block
                    color="red-darken-3"
                    variant="flat"
                    style="height: 40px"
                    :loading="isVisitorCheckingOut"
                    @click="
                      updateVisitorInfo(
                        visitor._id,
                        'check-out',
                        currentUser.type,
                      )
                    "
                    :disabled="
                      visitorCurrentPass?.length && visitorCurrentPass[0]?.keyId
                        ? (visitorCurrentPass[0]?.keyId
                            ? visitorCurrentPass.find(
                                (pass: any) =>
                                  ![
                                    'Returned',
                                    'Damaged',
                                    'Lost',
                                    'Others',
                                  ].includes(pass.status),
                              )
                            : ![
                                'Returned',
                                'Damaged',
                                'Lost',
                                'Others',
                              ].includes(visitorCurrentPass?.status)) ||
                          visitorCurrentKeys.find(
                            (key: any) =>
                              ![
                                'Returned',
                                'Damaged',
                                'Lost',
                                'Others',
                              ].includes(key.status),
                          )
                        : visitorCurrentKeys.find(
                            (key: any) =>
                              ![
                                'Returned',
                                'Damaged',
                                'Lost',
                                'Others',
                              ].includes(key.status),
                          )
                    "
                  >
                    checkout
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>

            <v-col
              v-if="dialogType == 'add-keys' && isSuccessfullyUpdated"
              cols="12"
            >
              <div class="text-center mt-6 text-subtitle-1 font-weight-bold">
                Great!
              </div>
              <div class="text-center mt-2 text-caption">
                Successfully added the new keys.
              </div>
              <v-row class="px-3 mt-5" justify="space-between">
                <v-col cols="12">
                  <v-btn
                    color="grey-lighten-4"
                    block
                    size="small"
                    variant="flat"
                    style="height: 40px"
                    @click="onCloseUpdatePassesKeysDialog()"
                  >
                    Close
                  </v-btn>
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
  </v-row>
</template>

<script setup lang="ts">
import moment from "moment-timezone";
import autoTable from "jspdf-autotable";
import io from "socket.io-client";

definePageMeta({
  middleware: ["secure", "site"],
});

const { theme, setSnackbar } = useLocal();
const { visitorSocket } = useSocket();
const { setBlocks } = useBlock();
const { sites, setSites, getSiteById } = useSite();
const { currentUser } = useLocalAuth();
// const { getPassList, getKeyList } = useKey();
// const { organizations, setOrganizations } = useOrganization();
const { $ability } = useNuxtApp();

const {
  getInitial,
  materialColors,
  standardFormatDateTime,
  standardFormatDate,
  compareDate,
  getPast30DaysDate,
} = useUtils();
const {
  tab,
  search,
  visitor,
  visitors,
  visitorTypes,
  visitorTypesGuest,
  setVisitor,
  setVisitors,
  isVisitorsLoaded,
  itemsPerPage,
  page,
  pageRange,
  canNextPage,
  nextPage,
  canPrevPage,
  prevPage,
  filterVisitor,
  addVisitorDialog,
  editVisitorDialog,
  //contractorInfo,
  editPasskeysDialog,
  addVisitorRealtime,
  addVisitorRealtimeDialog,
  updateVisitorCheckInAndOut,
  //selectedFilter,
  updatePassKeysById,
  getVisitorVmsLogsByPageSearch,
  isVisitorsCheckOut,
  getVisitorsByPageSearch,
  downloadVisitorReportPdf,
  isDownloadingPdf,
} = useVisitor();

const isExportingPdf = ref(false);
const isExportingCsv = ref(false);

const inUseKeyList = ref<any>([]);
const availableKeyList = ref<any>([]);
const hasNextPage = ref(true);

import { jsPDF } from "jspdf";

const { getPassKeysByPageSearch, isPassListLoading, isKeyListLoading } =
  usePassKey();

const updatePassesKeysDialog = ref(false);
const isProgress = ref(false);
const visitorCurrentPass = ref<any>([]);
const visitorCurrentKeys = ref<any>([]);
const visitorNewKeys = ref([]);
const isSuccessfullyUpdated = ref(false);

const isUpdatingPassKeys = ref(false);
const isVisitorCheckingOut = ref(false);

const {
  getSitesOptionsForFiltering,
  siteOptions,
  filterSite,
  filterOrganization,
  mySite,
} = useFilter();
const { siteSetting, getSiteSettingsById } = useSiteSettings();

const startDateDialog = ref(false);
const endDateDialog = ref(false);
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const openImageDialog = ref(false);
const selectedImage = ref("");

// const scannedResult = ref("");
const showQRdialog = ref(false);
const html5QrCodeInstance = ref(null);
const showNotFoundMessage = ref(false);
const errorMessage = ref("");
const { $Html5Qrcode } = useNuxtApp();
const cameraFacingMode = ref("environment");

const handleScannedResult = (result: any) => {};

const startScanner = async () => {
  console.log("SVAL", cameraFacingMode.value);

  console.log("STARTING");
  if (html5QrCodeInstance.value) return; // Prevent multiple initializations
  const config = {
    fps: 10,
    qrbox: { width: 250, height: 250 },
  };
  html5QrCodeInstance.value = new $Html5Qrcode("reader");

  html5QrCodeInstance.value
    .start(
      { facingMode: cameraFacingMode.value },
      config,
      async (qrCodeMessage: string) => {
        showNotFoundMessage.value = false; // Hide message if QR is found

        // Automatically navigate to the scanned URL if it's a valid link
        if (isValidUrl(qrCodeMessage)) {
          window.location.href = qrCodeMessage;
        } else {
          await closeDialog();

          if (updatePassesKeysDialog.value) {
            let keyUpdate = false;
            if (
              Array.isArray(visitorCurrentPass.value) &&
              visitorCurrentPass.value.length > 0
            ) {
              visitorCurrentPass.value.map((pass: any) => {
                if (pass.prefixAndName == qrCodeMessage) {
                  keyUpdate = true;
                  if (pass.status == "Returned") {
                    setSnackbar({
                      text: `This pass ${qrCodeMessage} has already been selected as Returned.`,
                      modal: true,
                      type: "error",
                    });
                  } else {
                    pass.status = "Returned";
                  }
                }
                return pass;
              });
            }
            if (
              Array.isArray(visitorCurrentKeys.value) &&
              visitorCurrentKeys.value.length > 0
            ) {
              visitorCurrentKeys.value.map((key: any) => {
                if (key.prefixAndName == qrCodeMessage) {
                  keyUpdate = true;
                  if (key.status == "Returned") {
                    setSnackbar({
                      text: `This key ${qrCodeMessage} has already been selected as Returned.`,
                      modal: true,
                      type: "error",
                    });
                  } else {
                    key.status = "Returned";
                  }
                }
                return key;
              });
            }
            if (!keyUpdate) {
              setSnackbar({
                text: `Pass or key: ${qrCodeMessage} not found in this visitor transaction.`,
                modal: true,
                type: "error",
              });
            }
          } else {
            const result: any = await getPassKeysByPageSearch({
              sites: [mySite.value],
              search: qrCodeMessage,
            });

            if (result.items.length < 1) {
              setSnackbar({
                text: "Pass or key not found.",
                modal: true,
                type: "error",
              });
              return;
            }

            const data: any = await getVisitorVmsLogsByPageSearch({
              sites: [mySite.value],
              passOrKey: {
                keyId: result.items[0]._id,
                type: result.items[0].passType == "pass-key" ? "key" : "pass",
              },
              isActualCheckOut: "No",
            });

            if (data.items.length < 1) {
              setSnackbar({
                text: "There are no unchecked-out visitor transactions for the scanned pass or key.",
                modal: true,
                type: "error",
              });
              return;
            }

            await onSelectVisitor(
              data.items[0],
              "return-pass-keys",
              qrCodeMessage,
            );
          }

          // showNotFoundMessage.value = true;
          // errorMessage.value = "Invalid QR Code Scanned!";
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
    .catch((err: any) => {
      console.log(`Unable to start scanning, error: ${err}`);
    });
};

const stopScanner = () => {
  return new Promise((resolve, reject) => {
    if (html5QrCodeInstance.value) {
      html5QrCodeInstance.value
        .stop()
        .then(() => {
          html5QrCodeInstance.value.clear();
          html5QrCodeInstance.value = null;
          showNotFoundMessage.value = false;
          resolve(); // Resolve the promise when the scanner is fully stopped
        })
        .catch((err: any) => {
          console.log("Unable to stop scanning.", err);
          reject(err); // Reject the promise if there's an error
        });
    } else {
      resolve(); // Resolve immediately if no scanner instance exists
    }
  });
};

const switchCamera = async () => {
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

const closeDialog = () => {
  showQRdialog.value = false;
  stopScanner();
};

const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const openDialog = () => {
  showQRdialog.value = true;
};

onBeforeUnmount(() => {
  stopScanner();
});

function openInApp(id: string) {
  openImageDialog.value = true;
  selectedImage.value = id;
}

function imageDialogClosed() {
  selectedImage.value = "";
}

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

async function switchTab(Tab: string) {
  tab.value = Tab;
  await updateFilter();
}
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

onMounted(() => {
  if (isVisitorsCheckOut.value) {
    setSnackbar({
      text: "Already Check out the user",
      modal: true,
      type: "success",
    });
  }
  startDate.value = getPast30DaysDate();
  filters.value.from = standardFormatDate(startDate.value);
  updateFilter();
  visitorSocket.disconnect();
  visitorSocket.auth = {
    userId: currentUser.value._id,
    siteId: mySite.value || currentUser.value.site,
    organizationId: currentUser.value.organization,
    serviceProviderId: currentUser.value.serviceProvider,
    serviceProviderGroupId: currentUser.value.serviceProviderGroup,
    type: currentUser.value.type,
  };
  visitorSocket.connect();
});

async function updateFilter() {
  page.value = 1;
  setVisitors({
    search: search.value,
    sites: [filterSite.value || mySite.value],
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

const onRedirect = () => {
  useRouter().push({
    name: "visitors",
    query: {
      site: mySite.value,
    },
  });
};

const unregisteredData = ref<any>();

function onAddingUnregistered(data: any) {
  tab.value = "unregistered";
  setVisitor({ plateNumber: data.plateNumber });
  setVisitors({
    sites: [mySite.value],
    types: ["unregistered"],
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

  visitor.value.site = mySite.value;
  visitor.value.organization = "";
  addVisitorRealtime.value = true;
  addVisitorRealtimeDialog.value = false;

  addVisitorDialog.value = true;
}

const APP_VISITOR = useRuntimeConfig().public.API_VISITOR;

const socket = io(`${APP_VISITOR}/site-${mySite.value}`, {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to visitor socket");
});

socket.on("plate-detected", async (data: any) => {
  unregisteredData.value = data;

  if (siteSetting.value.anpr.showUnregisteredTransactions) {
    addVisitorRealtimeDialog.value = true;
  } else {
    setSnackbar({
      text: `Unregistered vehicle has checked ${data.transactionType === "check-in" ? "in" : "out"} with the plate number `,
      modal: true,
      type: "info",
      highlight: data.plateNumber,
      callback: onRedirect,
    });
  }
});

socket.on("reload-visitors", async (data: any) => {
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
});

socket.on("disconnect", () => {
  console.log("Disconnected from visitor socket");
});

// visitorSocket.on("add-unregistered", async (data: any) => {
//   //tab.value = "unregistered";

//   unregisteredData.value = data;

//   if (siteSetting.value.anpr.showUnregisteredTransactions) {
//     addVisitorRealtimeDialog.value = true;
//   } else {
//     setSnackbar({
//       text: `Unregistered vehicle has checked ${data.transactionType === "check-in" ? "in" : "out"} with the plate number `,
//       modal: true,
//       type: "info",
//       highlight: data.plateNumber,
//       callback: onRedirect,
//     });
//   }
// });

visitorSocket.on("reload-visitors", async () => {
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
});

onMounted(async () => {
  //selectedFilter.value = "all";
  await getSitesOpt();

  await Promise.all([
    setVisitor(),
    // getPassList({
    //   site: mySite.value,
    // }),
    // getKeyList({
    //   site: mySite.value,
    // }),
    setVisitors({
      sites: [filterSite.value || mySite.value],
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
    }),
    setBlocks({
      site: mySite.value,
    }),
    getSiteSettingsById(mySite.value),
  ]);
});

onBeforeRouteLeave(() => {
  page.value = 1;
  filterVisitor.value = [];
});

async function getSitesOpt() {
  try {
    isVisitorsLoaded.value = true;
    await getSitesOptionsForFiltering();
  } catch (error: any) {
    setSnackbar({ text: error.message || error, modal: true, type: "error" });
  } finally {
    isVisitorsLoaded.value = false;
    filterSite.value =
      siteOptions.value.find((i: any) => i._id === mySite.value)?._id || "";
  }
}

watch(
  addVisitorRealtime,
  () => {
    visitor.value.checkIn = null;
    visitor.value.checkOut = null;
    visitor.value.remarks = null;
    delete visitor.value.actualCheckIn;
    delete visitor.value.actualCheckOut;
    delete visitor.value.updatedAt;
    delete visitor.value.registeredAt;
    delete visitor.value.qrCodeId;
    delete visitor.value.qrCodeIdExpiresAt;
    delete visitor.value.contractorType;
    delete visitor.value.block;
    delete visitor.value.blockLevel;
    delete visitor.value.unit;
    delete visitor.value.members;
  },
  { deep: true },
);

watch(
  filterOrganization,
  (newValue: any) => {
    setSites(newValue);
    filterSite.value = "";
  },
  { deep: true },
);

async function changePath(data: TVisitor) {
  useRouter().push({
    name: "visitors-id",
    params: {
      id: data._id,
    },
    query: {
      site: mySite.value,
    },
  });
}

const dialogType = ref("");
const showVisitorPassDialog = ref<boolean>(false);
const visitorPass = ref(null);

async function viewPass(item: any, passId: any) {
  visitor.value = item;
  showVisitorPassDialog.value = true;
  isPassListLoading.value = true;
  const result: any = await getPassKeysByPageSearch({
    _ids: [passId],
    limit: 10000,
    sites: [mySite.value],
    passTypes: ["visitor-pass", "contractor-pass", "agent-pass"],
  });

  visitorPass.value = result?.items[0]?.prefixAndName;
  isPassListLoading.value = false;
}

async function closeViewPassDialog() {
  showVisitorPassDialog.value = false;
  visitorPass.value = null;
  setVisitor();
}

async function onSelectVisitor(data: any, type: string, passOrKey?: string) {
  dialogType.value = type;
  visitor.value = data;

  updatePassesKeysDialog.value = true;

  await fetchPassKeys(dialogType.value, passOrKey);
}

// fetching for the v-autocomplete
const pagePassKey = ref(1);
const isSearching = ref(false);
const passes = ref([]);

async function fetchPassKeys(type: string, passOrKey?: string) {
  // get pass list
  isPassListLoading.value = true;
  const _ids = [
    visitor.value.visitorPass?.length
      ? visitor.value.visitorPass[0]?.keyId
      : visitor.value.visitorPass
        ? visitor.value.visitorPass
        : null,
  ];
  if (_ids) {
    passes.value = await getPassKeysByPageSearch({
      limit: 10000,
      sites: [mySite.value],
      passTypes: [
        visitor.value.type == "contractor"
          ? visitor.value.contractorType === "property-agent"
            ? "agent-pass"
            : "contractor-pass"
          : "visitor-pass",
      ],
    });
  }

  if (
    Array.isArray(visitor.value.visitorPass) &&
    visitor.value.visitorPass.length > 0
  ) {
    visitor.value.visitorPass[0].prefixAndName = passes.value?.items.find(
      (pass: any) => visitor.value.visitorPass[0].keyId == pass._id,
    )?.prefixAndName;
    if (visitor.value.visitorPass[0].prefixAndName == passOrKey) {
      visitor.value.visitorPass[0].status = "Returned";
    }
  } else if (
    visitor.value.visitorPass &&
    !Array.isArray(visitor.value.visitorPass)
  ) {
    visitor.value.visitorPass = [
      {
        keyId: visitor.value.visitorPass,
        status: visitor.value.isPassReturned ? "Returned" : "Not Returned",
        receivedDate: visitor.value.passReceivedDate,
        lastUpdate: visitor.value.passReturnDate,
        remarks: "",
        prefixAndName: passes.value?.items.find(
          (pass: any) => visitor.value.visitorPass == pass._id,
        )?.prefixAndName,
      },
    ];
    if (visitor.value.visitorPass[0].prefixAndName == passOrKey) {
      visitor.value.visitorPass[0].status = "Returned";
    }
  }

  visitorCurrentPass.value = visitor.value.visitorPass;

  isPassListLoading.value = false;
  let keyIds: string[] = [];
  if (
    Array.isArray(visitor.value.passKeys) &&
    visitor.value.passKeys.length > 0
  ) {
    visitor.value.passKeys?.forEach((key: any) => {
      if (key.keyId) {
        keyIds.push(key.keyId);
      } else {
        keyIds.push(key);
      }
    });
  }

  // get key list
  isKeyListLoading.value = true;
  if (
    Array.isArray(keyIds) &&
    keyIds.length > 0 &&
    Array.isArray(visitor.value.passKeys) &&
    visitor.value.passKeys.length > 0
  ) {
    const inUseKeys: any = await getPassKeysByPageSearch({
      limit: 10000,
      sites: [mySite.value],
      passTypes: ["pass-key"],
      _ids: keyIds,
    });
    if (!visitor.value.passKeys[0]?.keyId) {
      let passKeyTemporary: any[] = [];

      visitor.value.passKeys?.forEach((key: any) => {
        let status = visitor.value.isKeyReturned ? "Returned" : "Not Returned";
        if (
          passOrKey &&
          Array.isArray(inUseKeys.items) &&
          inUseKeys.items.find((item: any) => item._id == key)?.prefixAndName ==
            passOrKey
        ) {
          status = "Returned";
        }
        passKeyTemporary.push({
          keyId: key,
          status,
          receivedDate: visitor.value.keyReceivedDate,
          lastUpdate: visitor.value.keyReturnDate,
          remarks: "",
          prefixAndName: Array.isArray(inUseKeys?.items)
            ? inUseKeys.items.find((item: any) => item._id == key)
                ?.prefixAndName
            : null,
        });
      });
      visitor.value.passKeys = passKeyTemporary;
    } else {
      visitor.value.passKeys.map((key: any) => {
        const keyData = inUseKeys.items.find(
          (item: any) => item._id == key.keyId,
        );
        if (passOrKey == keyData.prefixAndName) key.status = "Returned";
        key.prefixAndName = keyData?.prefixAndName;
      });
    }

    visitorCurrentKeys.value = visitor.value.passKeys;
  }

  if (type == "add-keys") {
    const availableKeys: any = await getPassKeysByPageSearch({
      sites: [mySite.value],
      passTypes: ["pass-key"],
      statuses: ["Available"],
    });
    availableKeyList.value = availableKeys?.items;
  }

  isKeyListLoading.value = false;
}

const searchKey = async (query: string) => {
  isSearching.value = true;

  pagePassKey.value = 1;
  const availableKeys: any = await getPassKeysByPageSearch({
    page: pagePassKey.value,
    search: query,
    passTypes: ["pass-key"],
    sites: [mySite.value],
    statuses: ["Available"],
  });

  availableKeyList.value = availableKeys?.items;

  isSearching.value = false;
};

const endIntersectKeys = async (isIntersecting: boolean) => {
  if (isIntersecting && !isSearching.value) {
    if (hasNextPage.value) {
      pagePassKey.value += 1;
      let moreItems = await fetchPassKeysByPageSearch();
      availableKeyList.value = [...availableKeyList.value, ...moreItems];
    }
  }
};

const fetchPassKeysByPageSearch = async () => {
  isKeyListLoading.value = true;

  const availableKeys: any = await getPassKeysByPageSearch({
    sites: [mySite.value],
    passTypes: ["pass-key"],
    page: pagePassKey.value,
    statuses: ["Available"],
  });
  if (availableKeys?.pageRange) {
    const parts = availableKeys.pageRange.split(" ");
    const pageItemEnd = parseInt(parts[0].split("-")[1]);
    const totalItems = parseInt(parts[2]);
    if (pageItemEnd < totalItems) {
      hasNextPage.value = true;
    } else {
      hasNextPage.value = false;
    }
  }

  isKeyListLoading.value = false;

  return availableKeys?.items;
};

async function updateVisitorInfo(
  visitor_id: string,
  action: string,
  clientUserType?: string,
) {
  isProgress.value = true;
  try {
    // update pass or keys before checkout
    const payload: any = {
      visitorPass: ["", null].includes(visitorCurrentPass.value)
        ? []
        : visitorCurrentPass.value,
      passKeys: visitorCurrentKeys.value,
      updateType: "updateStatus",
      sites: [mySite.value],
    };

    await updatePassKeysById(visitor_id, payload);

    // visitor checkout after updating pass or keys
    isVisitorCheckingOut.value = true;
    const data: any = await updateVisitorCheckInAndOut(
      visitor_id,
      action,
      clientUserType,
      mySite.value,
    );
    const findVisitor = visitors.value.findIndex(
      (find: any) => find._id === visitor_id,
    );

    if (data.status === "error") {
      setSnackbar({ text: `${data.message}`, modal: true, type: "error" });
    }

    if (!data.status && data.status !== "error" && action === "check-in") {
      visitors.value[findVisitor].actualCheckIn = data.actualCheckIn;
      setSnackbar({
        text: `Visitor successfully checked in.`,
        modal: true,
        type: "success",
      });
    }

    if (!data.status && data.status !== "error" && action === "check-out") {
      visitors.value[findVisitor].actualCheckOut = data.actualCheckOut;
      setSnackbar({
        text: `Visitor successfully checked out.`,
        modal: true,
        type: "success",
      });
    }

    if (data?.actualCheckOut) {
      visitors.value[findVisitor].actualCheckOut = data.actualCheckOut;
      setSnackbar({
        text: `Visitor successfully checked out.`,
        modal: true,
        type: "success",
      });
    }

    await updateFilter();
    isVisitorCheckingOut.value = false;
    isSuccessfullyUpdated.value = true;
    await onCloseUpdatePassesKeysDialog();
  } catch (err: any) {
    setSnackbar({ text: err, modal: true, type: "error" });
  }
}

async function updatePassesKeys() {
  try {
    isUpdatingPassKeys.value = true;

    if (dialogType.value == "add-keys") {
      const payload: any = {
        passKeys: visitorNewKeys.value?.map((item: any) => ({
          keyId: item._id,
        })),
        updateType: "updatePassOrKey",
        sites: [mySite.value],
      };
      await updatePassKeysById(visitor.value._id, payload);
    } else if (dialogType.value == "return-pass-keys") {
      const payload: any = {
        visitorPass: ["", null].includes(visitorCurrentPass.value)
          ? []
          : visitorCurrentPass.value,
        passKeys: visitorCurrentKeys.value,
        updateType: "updateStatus",
        sites: [mySite.value],
      };

      await updatePassKeysById(visitor.value._id, payload);

      setSnackbar({
        text: "Successfully updated the pass or key(s).",
        modal: true,
        type: "success",
      });
    }

    await updateFilter();
    isUpdatingPassKeys.value = false;
    isSuccessfullyUpdated.value = true;
  } catch (err) {
    setSnackbar({ text: err, modal: true, type: "error" });
    isUpdatingPassKeys.value = false;
  }
}

async function onCloseUpdatePassesKeysDialog() {
  updatePassesKeysDialog.value = false;
  passes.value = [];
  inUseKeyList.value = [];
  availableKeyList.value = [];
  visitorCurrentKeys.value = [];
  visitorNewKeys.value = [];
  isSuccessfullyUpdated.value = false;
  await setVisitor();
}

const showEditVisitorDialog = async (visitor: any) => {
  setVisitor(visitor);
  editVisitorDialog.value = true;
};

const capitalizeWords = (str?: string) =>
  (str || "")
    .split(" ")
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(" ");

async function onExportAsPdf() {
  isExportingPdf.value = true;

  const result: any = await downloadVisitorReportPdf({
    sites: [filterSite.value || mySite.value],
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

  try {
    if (result && result.items) {
      const generateItems = result.items.map((item: any) => {
        return {
          name:
            item.firstName || item.lastName
              ? capitalizeWords(
                  `${item.firstName || ""} ${item.lastName || ""}`,
                )
              : "N/A",
          typeOrCompany: item.type
            ? item.companyName
              ? `${capitalizeWords(item.type)}\n${item.companyName}`
              : `${capitalizeWords(item.type)}\nN/A`
            : item.companyName
              ? item.companyName
              : "N/A",
          location:
            (item.blockName
              ? "Block: " + capitalizeWords(item.blockName)
              : "") +
            (item.blockLevelName
              ? "\nLevel: " + capitalizeWords(item.blockLevelName)
              : "") +
            (item.unitName ? "\nUnit: " + capitalizeWords(item.unitName) : ""),
          contactOrVehicleNo:
            `${item.phoneNumber ? item.phoneNumber : ""}` +
            `${item.phoneNumber && item.plateNumber ? "\n" : ""}` +
            `${item.plateNumber ? item.plateNumber : ""}`,
          checkInCheckOut: `Check In:\n${standardFormatDateTime(item.actualCheckIn) || "N/A"}\n\nCheck Out: \n${standardFormatDateTime(item.actualCheckOut) || "N/A"}\n`,
          imageLinks: [
            item.checkInImage
              ? `${window.location.origin}/visitors/check-in-image/${item.checkInImage}`
              : "",
            item.checkOutImage
              ? `${window.location.origin}/visitors/check-in-image/${item.checkOutImage}`
              : "",
          ],
        };
      });

      const body = generateItems.map((item: any) => [
        item.name,
        item.typeOrCompany,
        item.location,
        item.contactOrVehicleNo,
        item.checkInCheckOut,
      ]);

      const doc = new jsPDF();
      doc.setFont("helvetica");
      doc.setFontSize(11);
      doc.text(
        `Visitor Management - ${capitalizeWords(tab.value)} (${result.items.length} items) \nDate Range: ${filters.value.from} to ${filters.value.to}`,
        14,
        20,
      );

      doc.text(
        `Site Name: ${currentUser.value.siteName || current_site_name.value || "N/A"}`,
        14,
        35,
      );
      doc.text(
        `Generated By: ${(currentUser.value.givenName.trim() + " " + currentUser.value.surname.trim()).trim()}`,
        14,
        45,
      );
      autoTable(doc, {
        startY: 55,
        head: [
          [
            "Name",
            "Type/Company",
            "Location",
            "Contact/Vehicle No.",
            "Check In/Out",
            "Check In/Out Image",
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
          valign: "middle",
        },
        tableLineWidth: 0.1,
        tableLineColor: [128, 128, 128],
        rowPageBreak: "avoid",
        columnStyles: {
          5: {
            cellWidth: 35,
            overflow: "linebreak",
          },
        },
        showHead: "firstPage",
        didDrawCell: (data) => {
          const { row, column, cell } = data;
          if (column.index === 5 && data.section === "body") {
            function drawUnderlinedText(doc, text, x, y, url) {
              const textWidth = doc.getTextWidth(text);
              const textHeight =
                doc.internal.getFontSize() / doc.internal.scaleFactor;

              doc.setTextColor(0, 0, 255);
              doc.textWithLink(text, x, y, { url: url });

              // Draw underline
              doc.setDrawColor(0, 0, 255);
              doc.setLineWidth(0.5);
              doc.line(x, y + 1, x + textWidth, y + 1);
            }

            try {
              const imageLink = generateItems[row.index]?.imageLinks;

              if (imageLink[0]) {
                const checkInImageText = `In: ${imageLink[0].slice(-5)}.jpeg`;

                const textX = cell.x + 2;
                let textY = cell.y + 5;

                drawUnderlinedText(
                  doc,
                  checkInImageText,
                  textX,
                  textY,
                  imageLink[0],
                );
              }

              if (imageLink[1]) {
                const checkOutImageText = `Out: ${imageLink[1].slice(-5)}.jpeg`;

                const textX = data.cell.x + 2;
                let textY = data.cell.y + 16;

                drawUnderlinedText(
                  doc,
                  checkOutImageText,
                  textX,
                  textY,
                  imageLink[1],
                );
              }
            } catch (error) {
              console.error(
                `Error adding image link for row ${row.index}:`,
                error,
              );
            }
          }
        },

        didDrawPage: (data) => {
          const totalPages = (doc.internal as any).getNumberOfPages();
          doc.setFontSize(10);
          doc.text(
            `Page ${data.pageNumber}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: "center" },
          );
        },
      });

      doc.save(
        `VISITOR_MANAGEMENT_PDF_REPORT_${tab.value}_${filters.value.from} - ${filters.value.to}.pdf`,
      );
    }
  } catch (error) {
    console.log("error", error);
    setSnackbar({
      text: "Failed to download visitor management pdf report.",
      modal: true,
      type: "error",
    });
  }

  isExportingPdf.value = false;
}

async function onExportAsCsv() {
  isExportingCsv.value = true;

  const result: any = await downloadVisitorReportPdf({
    sites: [filterSite.value || mySite.value],
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

  try {
    if (result && result.items) {
      const generateItems = result.items.map((item: any) => {
        return {
          name:
            item.firstName || item.lastName
              ? capitalizeWords(
                  `${item.firstName || ""}${" " + item.lastName || ""}`,
                )
              : "N/A",
          type:
            item.type === "guest"
              ? "Drive In"
              : item.type
                ? capitalizeWords(item.type)
                : "",
          companyName: item.companyName || "N/A",
          block: capitalizeWords(item.blockName) || "",
          level: capitalizeWords(item.blockLevelName) || "",
          unit: capitalizeWords(item.unitName) || "",
          contact: item.phoneNumber ? item.phoneNumber : "",
          vehicleNo: item.plateNumber ? item.plateNumber : "",
          checkIn: standardFormatDateTime(item.actualCheckIn) || "N/A",
          checkOut: standardFormatDateTime(item.actualCheckOut) || "",
          checkInImage: item.checkInImage
            ? `${window.location.origin}/visitors/check-in-image/${item.checkInImage}`
            : "",
          checkOutImage: item.checkOutImage
            ? `${window.location.origin}/visitors/check-in-image/${item.checkOutImage}`
            : "",
        };
      });

      const body = generateItems.map((item: any) => [
        item.name,
        item.type,
        item.companyName,
        item.block,
        item.level,
        item.unit,
        item.contact,
        item.vehicleNo,
        item.checkIn,
        item.checkOut,
        item.checkInImage,
        item.checkOutImage,
      ]);

      const headers = [
        [
          "NAME",
          "TYPE",
          "COMPANY",
          "BLOCK",
          "LEVEL",
          "UNIT",
          "CONTACT",
          "VEHICLE NO.",
          "CHECK-IN",
          "CHECK-OUT",
          "CHECK-IN IMAGE",
          "CHECK-OUT IMAGE",
        ],
      ];

      const csvData = [...headers, ...(body || [])];

      const fileContent = `data:text/csv;charset=utf-8,${csvData
        .map((e) => e.join(","))
        .join("\n")}`;

      let encodedUri = encodeURI(fileContent);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `VISITOR_MANAGEMENT_CSV_REPORT_${tab.value}_${filters.value.from} - ${filters.value.to}.csv`,
      );
      document.body.appendChild(link);
      link.click();

      isExportingCsv.value = false;
    }
  } catch (error) {
    console.log("error", error);
    setSnackbar({
      text: "Failed to download visitor management csv report.",
      modal: true,
      type: "error",
    });
  }
}

const current_site_name = ref("");

onMounted(async () => {
  const { name } = (await getSiteById(mySite.value)) as TSite;
  current_site_name.value = name;
});
</script>

<style scoped>
:deep() .v-text-field input {
  font-size: 13px;
}

:deep() .v-field__field {
  font-size: 13px;
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

.overridePicker {
  width: 18px;
}

.dialog_desktop {
  margin: 0 0 0 auto;
  max-width: 28rem;
  border-radius: 25px 0 0 25px;

  box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
}

.dot-pulse {
  position: relative;
  left: -9999px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
  box-shadow: 9999px 0 0 -5px;
  animation: dot-pulse 1.5s infinite linear;
  animation-delay: 0.25s;
}
.dot-pulse::before,
.dot-pulse::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
}
.dot-pulse::before {
  box-shadow: 9984px 0 0 -5px;
  animation: dot-pulse-before 1.5s infinite linear;
  animation-delay: 0s;
}
.dot-pulse::after {
  box-shadow: 10014px 0 0 -5px;
  animation: dot-pulse-after 1.5s infinite linear;
  animation-delay: 0.5s;
}

@keyframes dot-pulse-before {
  0% {
    box-shadow: 9984px 0 0 -5px;
  }
  30% {
    box-shadow: 9984px 0 0 2px;
  }
  60%,
  100% {
    box-shadow: 9984px 0 0 -5px;
  }
}
@keyframes dot-pulse {
  0% {
    box-shadow: 9999px 0 0 -5px;
  }
  30% {
    box-shadow: 9999px 0 0 2px;
  }
  60%,
  100% {
    box-shadow: 9999px 0 0 -5px;
  }
}
@keyframes dot-pulse-after {
  0% {
    box-shadow: 10014px 0 0 -5px;
  }
  30% {
    box-shadow: 10014px 0 0 2px;
  }
  60%,
  100% {
    box-shadow: 10014px 0 0 -5px;
  }
}
</style>
