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
                  :items="filteredVisitors"
                  :items-per-page="itemsPerPage"
                >
                  <template v-slot:header>
                    <v-row no-gutters class="pa-4" justify="space-between">
                      <v-col
                        cols="12"
                        :class="$vuetify.display.sm ? 'mb-3' : ''"
                      >
                        <v-row align="center">
                          <v-col cols="12">
                            <v-row no-gutters align="center">
                              <v-col col="12" lg="12" md="10">
                                <span class="font-weight-bold text-h6">
                                  Key Management
                                </span>
                              </v-col>
                              <v-col
                                cols="12"
                                md="2"
                                v-if="$vuetify.display.md"
                              >
                                <v-btn
                                  color="blue-darken-3"
                                  block
                                  variant="flat"
                                  size="small"
                                  style="height: 40px"
                                  :to="{
                                    name: 'keys-visitor',
                                    query: {
                                      site: mySite,
                                    },
                                  }"
                                >
                                  Visitor Pass & Keys
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-col>

                          <v-col cols="12" lg="4" md="4" sm="9">
                            <v-text-field
                              :model-value="search"
                              placeholder="Search"
                              hide-details
                              density="compact"
                              append-inner-icon="mdi-magnify"
                              @update:model-value="onSearch"
                            >
                            </v-text-field>
                          </v-col>

                          <v-col cols="12" sm="3" v-if="$vuetify.display.sm">
                            <v-btn
                              color="blue-darken-3"
                              block
                              variant="flat"
                              size="small"
                              style="height: 40px"
                              :to="{
                                name: 'keys-visitor',
                                query: {
                                  site: mySite,
                                },
                              }"
                            >
                              <span
                                style="
                                  word-break: break-word;
                                  white-space: normal;
                                "
                                class="text-center"
                              >
                                Visitor Pass & Keys
                              </span>
                            </v-btn>
                          </v-col>

                          <v-col cols="12" lg="8" md="8" sm="12">
                            <v-row class="d-flex justify-end">
                              <v-col cols="12" lg="3" md="4" sm="4">
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
                              <v-col cols="12" lg="3" md="4" sm="4">
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

                              <v-col cols="12" lg="3" md="4" sm="4">
                                <v-select
                                  v-model="selectedFilter"
                                  :items="filterOpt"
                                  item-title="name"
                                  item-value="value"
                                  hide-details
                                  density="compact"
                                  menu-icon="mdi-chevron-down"
                                  @update:model-value="onFilter(selectedFilter)"
                                >
                                </v-select>
                              </v-col>

                              <v-col
                                cols="12"
                                lg="3"
                                md="4"
                                v-if="
                                  $vuetify.display.lgAndUp ||
                                  $vuetify.display.xs
                                "
                              >
                                <v-btn
                                  color="blue-darken-3"
                                  block
                                  variant="flat"
                                  size="small"
                                  style="height: 40px"
                                  :to="{
                                    name: 'keys-visitor',
                                    query: {
                                      site: mySite,
                                    },
                                  }"
                                >
                                  Visitor Pass & Keys
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
                      <v-list-item class="px-8">
                        <v-list-item-title>
                          <v-row no-gutters align="center">
                            <v-col
                              cols="12"
                              sm="3"
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
                                  Name
                                  <span v-if="$vuetify.display.sm"
                                    >/ Contact</span
                                  >
                                </span>
                              </v-row>
                            </v-col>
                            <v-col cols="12" sm="3" md="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Location / Type
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="3"
                              md="2"
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
                                  Contact No.
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" sm="3" md="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-capitalize text-caption font-weight-bold"
                                  style="
                                    word-break: break-word;
                                    white-space: normal;
                                  "
                                >
                                  Pass / Key Pass
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="3"
                              md="3"
                              class="text text-capitalize"
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
                                </span>
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
                    <v-list class="pa-0" density="compact">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="item.raw._id"
                      >
                        <v-list-item class="py-4 px-8">
                          <template #default>
                            <v-list-item-title>
                              <v-row no-gutters>
                                <v-col
                                  cols="12"
                                  sm="3"
                                  md="2"
                                  :class="`text ${
                                    $vuetify.display.smAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span class="d-flex flex-column">
                                      <span
                                        class="d-inline-block text-truncate text-capitalize text-body-2 mb-2 mb-md-0"
                                      >
                                        <v-row no-gutters>
                                          <v-col cols="1" md="2" class="pt-2">
                                            <v-avatar
                                              size="x-small"
                                              :color="materialColors[itemIndex]"
                                              class="mr-3"
                                            >
                                              {{
                                                getInitial(item.raw.name || "")
                                              }}
                                            </v-avatar>
                                          </v-col>
                                          <v-col
                                            cols="10"
                                            :class="`${$vuetify.display.smAndUp ? 'pl-4' : 'pl-8'}`"
                                          >
                                            <div>
                                              {{ item.raw.name }}
                                            </div>
                                            <div class="text-caption text-grey">
                                              {{
                                                item.raw.nric
                                                  ? `#${item.raw.nric}`
                                                  : "N/A"
                                              }}
                                            </div>
                                          </v-col>
                                        </v-row>
                                      </span>
                                      <span
                                        class="d-inline-block text-truncate text-capitalize text-body-2 mr-2 mb-2 mb-md-0 text-caption"
                                        v-if="$vuetify.display.sm"
                                      >
                                        <v-icon
                                          :class="`${$vuetify.display.smAndUp ? 'mx-0' : 'mx-1 mr-4'}`"
                                          >mdi-phone</v-icon
                                        >
                                        {{
                                          item.raw.phoneNumber
                                            ? item.raw.phoneNumber
                                            : "N/A"
                                        }}
                                      </span>
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  sm="3"
                                  md="3"
                                  :class="`text ${
                                    $vuetify.display.smAndUp ? 'my-1' : 'mb-2'
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
                                          :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1'}`"
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
                                      <span
                                        class="d-inline-block text-wrap text-capitalize text-body-2"
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
                                    </v-col>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  sm="3"
                                  md="2"
                                  :class="`text ${
                                    $vuetify.display.smAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                  v-if="$vuetify.display.mdAndUp"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height mr-2"
                                    align-content="center"
                                  >
                                    <span
                                      class="d-inline-block text-truncate text-capitalize text-body-2"
                                    >
                                      <v-icon
                                        :class="`${$vuetify.display.smAndUp ? 'mx-1' : 'mx-1 mr-4'}`"
                                        >mdi-phone</v-icon
                                      >
                                      {{
                                        item.raw.phoneNumber
                                          ? item.raw.phoneNumber
                                          : "N/A"
                                      }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  sm="3"
                                  md="2"
                                  :class="`text ${
                                    $vuetify.display.smAndUp ? 'my-1' : 'mb-2'
                                  }`"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span>
                                      <span
                                        class="d-inline-block text-truncate text-capitalize text-body-2"
                                      >
                                        <v-chip size="small" class="pa-2">
                                          <v-icon
                                            >mdi-badge-account-outline</v-icon
                                          >
                                          {{
                                            item.raw.visitorPass.name || "N/A"
                                          }}
                                        </v-chip>
                                      </span>
                                      <span
                                        class="d-flex align-center text-truncate text-capitalize text-body-2"
                                      >
                                        <v-icon
                                          :class="`${$vuetify.display.smAndUp ? 'mx-1' : 'mx-1'}`"
                                          color="red"
                                          >mdi-key</v-icon
                                        >
                                        <span
                                          v-if="
                                            item.raw.passKeys &&
                                            item.raw.passKeys.length > 0
                                          "
                                        >
                                          <v-tooltip
                                            v-if="item.raw.passKeys.length > 2"
                                            activator="parent"
                                            location="bottom"
                                          >
                                            <div
                                              v-for="(key, idx) in item.raw
                                                .passKeys"
                                              :key="idx"
                                              style="
                                                display: block;
                                                margin-bottom: 5px;
                                              "
                                            >
                                              <span>
                                                {{ idx + 1 }}. {{ key.name }}
                                              </span>
                                            </div>
                                          </v-tooltip>
                                          <span
                                            v-for="(
                                              key, idx
                                            ) in item.raw.passKeys.slice(0, 2)"
                                            :key="idx"
                                            class="text-primary cursor-pointer"
                                          >
                                            <span
                                              class="text-decoration-underline"
                                            >
                                              {{ key.name }}
                                            </span>
                                            <span
                                              v-if="
                                                idx + 1 !==
                                                  item.raw.passKeys.length &&
                                                idx + 1 !== 2
                                              "
                                            >
                                              ,
                                            </span>
                                          </span>
                                          <span v-if="item.raw.passKeys == ''"
                                            >No Key</span
                                          >
                                        </span>
                                      </span>
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  sm="3"
                                  md="2"
                                  :class="`text ${
                                    $vuetify.display.smAndUp ? 'my-1' : 'mb-2'
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
                                      <v-chip
                                        size="small"
                                        :color="
                                          (item.raw.isKeyReturned ||
                                            item.raw.isKeyReturned === null) &&
                                          (item.raw.isPassReturned ||
                                            item.raw.isPassReturned === null)
                                            ? 'green'
                                            : 'red'
                                        "
                                        variant="outlined"
                                      >
                                        <v-icon class="mr-1">
                                          {{
                                            (item.raw.isPassReturned &&
                                              item.raw.isKeyReturned) ||
                                            (item.raw.isPassReturned &&
                                              item.raw.isKeyReturned ===
                                                null) ||
                                            (item.raw.isPassReturned === null &&
                                              item.raw.isKeyReturned)
                                              ? "mdi-key-arrow-right"
                                              : !item.raw.isPassReturned &&
                                                  item.raw.isPassReturned !==
                                                    null &&
                                                  (item.raw.isKeyReturned ||
                                                    item.raw.isKeyReturned ===
                                                      null)
                                                ? "mdi-key-alert"
                                                : !item.raw.isKeyReturned &&
                                                    item.raw.isKeyReturned !==
                                                      null &&
                                                    (item.raw.isPassReturned ||
                                                      item.raw
                                                        .isPassReturned ===
                                                        null)
                                                  ? "mdi-key-alert"
                                                  : !item.raw.isKeyReturned &&
                                                      !item.raw
                                                        .isKeyReturned !==
                                                        null &&
                                                      !item.raw
                                                        .isPassReturned &&
                                                      item.raw
                                                        .isPassReturned !== null
                                                    ? "mdi-key-alert"
                                                    : null
                                          }}
                                        </v-icon>
                                        {{
                                          (item.raw.isPassReturned &&
                                            item.raw.isKeyReturned) ||
                                          (item.raw.isPassReturned &&
                                            item.raw.isKeyReturned === null) ||
                                          (item.raw.isPassReturned === null &&
                                            item.raw.isKeyReturned)
                                            ? "Returned"
                                            : !item.raw.isPassReturned &&
                                                item.raw.isPassReturned !==
                                                  null &&
                                                (item.raw.isKeyReturned ||
                                                  item.raw.isKeyReturned ===
                                                    null)
                                              ? "Pass Not Yet Returned"
                                              : !item.raw.isKeyReturned &&
                                                  item.raw.isKeyReturned !==
                                                    null &&
                                                  (item.raw.isPassReturned ||
                                                    item.raw.isPassReturned ===
                                                      null)
                                                ? "Keys Not Returned"
                                                : !item.raw.isKeyReturned &&
                                                    !item.raw.isKeyReturned !==
                                                      null &&
                                                    !item.raw.isPassReturned &&
                                                    item.raw.isPassReturned !==
                                                      null
                                                  ? "Not Returned"
                                                  : null
                                        }}
                                      </v-chip>
                                    </span>
                                  </v-row>
                                </v-col>
                                <v-col md="1" class="text-caption mt-4 mt-sm-0">
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
                                          class="pa-4 rounded-xl border-md"
                                          >mdi-dots-vertical</v-icon
                                        >
                                      </template>
                                      <v-list>
                                        <template
                                          v-for="(
                                            actionItem, actionIndex
                                          ) in actions"
                                          :key="actionItem.text"
                                        >
                                          <v-list-item
                                            :disabled="actionItem.disabled"
                                            @click="
                                              onRouteOrShowDialog(
                                                actionItem,
                                                item.raw,
                                              )
                                            "
                                          >
                                            <template #title>
                                              <span class="text-caption">
                                                {{ actionItem.text }}
                                              </span>
                                            </template>
                                          </v-list-item>

                                          <v-divider
                                            v-if="
                                              actionIndex + 1 !== actions.length
                                            "
                                          ></v-divider>
                                        </template>
                                      </v-list>
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
                        <v-list-item class="py-4 px-8">
                          <v-list-item-title>
                            <v-row no-gutters>
                              <v-col
                                cols="12"
                                class="text-capitalize white--text font-weight-bold mb-1"
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
                                    >Name:
                                  </span>
                                  <span
                                    class="mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-row no-gutters>
                                      <v-col cols="1" md="2" class="pt-2">
                                        <v-avatar
                                          size="x-small"
                                          :color="materialColors[itemIndex]"
                                        >
                                          {{ getInitial(item.raw.name || "") }}
                                        </v-avatar>
                                      </v-col>
                                      <v-col
                                        cols="11"
                                        align="end"
                                        justify="end"
                                        :class="`${$vuetify.display.mdAndUp ? 'pl-4' : 'pl-2'}`"
                                      >
                                        <div>
                                          {{ item.raw.name }}
                                        </div>
                                        <div class="text-caption text-grey">
                                          {{ `#${item.raw.nric}` || "N/A" }}
                                        </div>
                                      </v-col>
                                    </v-row>
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                cols="12"
                                class="text-capitalize white--text mb-1"
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
                                    >Contact:
                                  </span>
                                  <span
                                    class="mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon
                                      size="small"
                                      :class="`${$vuetify.display.mdAndUp ? 'mr-4' : 'mr-1'}`"
                                      >mdi-phone</v-icon
                                    >
                                    {{
                                      item.raw.phoneNumber
                                        ? item.raw.phoneNumber
                                        : "N/A"
                                    }}
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                cols="12"
                                class="text-capitalize white--text mb-1"
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
                                    >Location:
                                  </span>
                                  <span
                                    class="mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon
                                      size="small"
                                      :class="`${$vuetify.display.mdAndUp ? 'mr-4' : 'mr-1'}`"
                                    >
                                      mdi-storefront-outline</v-icon
                                    >
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
                                class="text-capitalize white--text mb-1"
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
                                    >Type:
                                  </span>
                                  <span
                                    class="mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon
                                      size="small"
                                      :class="`${$vuetify.display.mdAndUp ? 'mr-4' : 'mr-1'}`"
                                      >mdi-account</v-icon
                                    >
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
                                cols="12"
                                class="text-capitalize white--text mb-1"
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
                                    >Pass Type:
                                  </span>
                                  <span
                                    class="mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon
                                      size="small"
                                      :class="`${$vuetify.display.mdAndUp ? '' : 'mr-1'}`"
                                      >mdi-badge-account-outline</v-icon
                                    >
                                    <v-chip size="small" color="orange">
                                      {{ item.raw.passKeyNumber || "N/A" }}
                                    </v-chip>
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                cols="12"
                                class="text-capitalize white--text mb-1"
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
                                    >Key Pass:
                                  </span>
                                  <span
                                    class="mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon
                                      size="small"
                                      :class="`${$vuetify.display.mdAndUp ? 'mx-1 mr-2' : 'mx-1'}`"
                                      >mdi-key</v-icon
                                    >
                                    <span
                                      v-if="
                                        item.raw.passKeys &&
                                        item.raw.passKeys.length > 0
                                      "
                                    >
                                      <v-tooltip
                                        v-if="item.raw.passKeys.length > 2"
                                        activator="parent"
                                        location="bottom"
                                      >
                                        <div
                                          v-for="(key, idx) in item.raw
                                            .passKeys"
                                          :key="idx"
                                          style="
                                            display: block;
                                            margin-bottom: 5px;
                                          "
                                        >
                                          <span>
                                            {{ idx + 1 }}. {{ key.name }}
                                          </span>
                                        </div>
                                      </v-tooltip>
                                      <span
                                        v-for="(
                                          key, idx
                                        ) in item.raw.passKeys.slice(0, 2)"
                                        :key="idx"
                                        class="text-primary cursor-pointer"
                                      >
                                        <span class="text-decoration-underline">
                                          {{ key.name }}
                                        </span>
                                        <span
                                          v-if="
                                            idx + 1 !==
                                              item.raw.passKeys.length &&
                                            idx + 1 !== 2
                                          "
                                        >
                                          ,
                                        </span>
                                      </span>
                                      <span v-if="item.raw.passKeys == ''"
                                        >No Keys</span
                                      >
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                cols="12"
                                class="text-capitalize white--text"
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
                                    class="mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-chip
                                      size="small"
                                      :color="
                                        (item.raw.isKeyReturned ||
                                          item.raw.isKeyReturned === null) &&
                                        (item.raw.isPassReturned ||
                                          item.raw.isPassReturned === null)
                                          ? 'green'
                                          : 'red'
                                      "
                                    >
                                      {{
                                        (item.raw.isKeyReturned ||
                                          item.raw.isKeyReturned === null) &&
                                        (item.raw.isPassReturned ||
                                          item.raw.isPassReturned === null)
                                          ? "Returned"
                                          : "Not Returned"
                                      }}
                                    </v-chip>
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col cols="12" class="mt-2">
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
                                        class="pa-4 rounded-xl border-md"
                                        >mdi-dots-vertical</v-icon
                                      >
                                    </template>
                                    <v-list>
                                      <template
                                        v-for="(
                                          actionItem, actionIndex
                                        ) in actions"
                                        :key="actionItem.text"
                                      >
                                        <v-list-item
                                          :disabled="actionItem.disabled"
                                          @click="
                                            onRouteOrShowDialog(
                                              actionItem,
                                              item.raw,
                                            )
                                          "
                                        >
                                          <template #title>
                                            <span class="text-caption">
                                              {{ actionItem.text }}
                                            </span>
                                          </template>
                                        </v-list-item>

                                        <v-divider
                                          v-if="
                                            actionIndex + 1 !== actions.length
                                          "
                                        ></v-divider>
                                      </template>
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

          <v-col cols="12" class="pa-4">
            <v-row no-gutters justify="end" align-content="center">
              <span>{{ pageRange }}</span>
              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="page === 1"
                @click="prevPage()"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>

              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="page >= pages"
                @click="nextPage()"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <v-dialog
      v-model="dialog"
      transition="dialog-right-transition"
      fullscreen
      :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
    >
      <v-card>
        <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
          <v-btn
            color="grey-darken-1"
            icon="mdi-arrow-left"
            @click="dialog = false"
          ></v-btn>
          <span class="font-weight-bold pl-4 text-capitalize">
            {{ dialogView }} Pass & Key
          </span>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            icon="mdi-close"
            @click="dialog = false"
          ></v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text>
          <v-row class="align-center text-center">
            <v-col cols="12">
              <v-row class="justify-center mb-7 mt-4">
                <v-img
                  src="/images/undraw_team_page.svg"
                  width="190px"
                  height="190px"
                ></v-img>
              </v-row>
            </v-col>
            <v-col cols="12" class="text-h6 text-left">
              <v-row align="center" justify-space-between>
                <v-col cols="12" md="12" class="py-0 mb-2">
                  Visitor Pass
                </v-col>
                <v-col cols="12" md="12" class="py-0 mb-1">
                  <v-select
                    :model-value="visitor.isPassReturned"
                    :items="passStatusOption"
                    item-title="name"
                    item-value="value"
                    density="compact"
                    hide-details
                    @update:modelValue="onUpdatePassStatus"
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="12" class="pt-1">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-chip color="primary" class="w-100">
                        <v-icon class="mr-2"> mdi-calendar-start </v-icon>
                        {{
                          standardFormatDateTime(visitor.passReceivedDate || "")
                        }}
                      </v-chip>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-chip color="green" class="w-100">
                        <v-icon class="mr-2"> mdi-calendar-refresh </v-icon>
                        {{
                          standardFormatDateTime(visitor.passReturnDate || "")
                        }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="visitor.visitorPass" cols="12">
              <v-text-field
                v-model="visitor.visitorPass.name"
                class="pb-4"
                label="Visitor Pass"
                hide-details
                :readonly="/^(View)$/i.test(dialogView)"
              >
              </v-text-field>
              <div v-if="visitor.passKeyNumber">
                <div class="text-left py-1 text-h6">
                  Pass:<span class="pl-1 text-primary">
                    <v-chip class="ml-1" color="error">
                      {{ visitor.passKeyNumber || "N/A" }}
                    </v-chip>
                  </span>
                </div>
              </div>
              <div v-else class="mx-1 text-primary text-truncate">NO PASS</div>
            </v-col>

            <v-col cols="12" class="text-h6 text-left">
              <v-row
                v-if="visitor.passKeys && visitor.passKeys.length > 0"
                align="center"
                justify-space-between
              >
                <v-col cols="12" md="12" class="py-0 mb-2"> Key </v-col>
                <v-col cols="12" md="12" class="py-0">
                  <v-select
                    :model-value="visitor.isKeyReturned"
                    :items="keyStatusOption"
                    item-title="name"
                    item-value="value"
                    density="compact"
                    hide-details
                    @update:modelValue="onUpdateKeyStatus"
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" md="12" class="pt-0 mt-1">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-chip color="primary" class="w-100">
                        <v-icon class="mr-2"> mdi-calendar-start </v-icon>
                        {{
                          standardFormatDateTime(visitor.keyReceivedDate || "")
                        }}
                      </v-chip>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-chip color="green" class="w-100">
                        <v-icon class="mr-2"> mdi-calendar-refresh </v-icon>
                        {{
                          standardFormatDateTime(visitor.keyReturnDate || "")
                        }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <div v-if="visitor.passKeys && visitor.passKeys.length > 0">
                <div class="text-left text-h6">
                  Key Lists:<span
                    v-for="(key, idx) in visitor.passKeys"
                    :key="idx"
                    class="pl-1 text-primary"
                  >
                    <v-chip class="ml-1" color="primary">
                      {{ key.name || "N/A" }}
                    </v-chip>
                  </span>
                </div>
              </div>
              <div v-else class="mx-1 text-primary text-truncate">NO KEYS</div>
            </v-col>
            <v-col cols="12">
              <v-btn
                color="#1867C0"
                class="w-100 rounded-lg"
                height="40px"
                size="small"
                @click="onUpdatePassAndKeyStatus"
              >
                Update
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";
import moment from "moment-timezone";

definePageMeta({
  middleware: ["secure"],
});
const { $ability } = useNuxtApp();
const { theme, setSnackbar } = useLocal();
const {
  getInitial,
  standardFormatDateTime,
  materialColors,
  standardFormatDate,
  getPast30DaysDate,
} = useUtils();
const currentDate = new Date().toISOString().split("T")[0];
const {
  getVisitorById,
  updateVisitorPassStatusById,
  updateVisitorKeyStatusById,
  setVisitors,
  setVisitor,
  nextPage,
  prevPage,
  visitor,
  visitors,
  page,
  pages,
  itemsPerPage,
  pageRange,
  isVisitorsLoaded,
  search,
  selectedFilter,
} = useVisitor();
const { getSitesOptionsForFiltering, siteOptions, filterSite, mySite, myOrg } =
  useFilter();

const dialogView = ref("");
const dialog = ref(false);
const updateStatusDialog = ref(false);

const startDateDialog = ref(false);
const endDateDialog = ref(false);
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);

const locale = "en";

const filteredVisitors = computed(() => {
  return visitors.value.filter(
    (v) => !(v.isPassReturned === null && v.isKeyReturned === null),
  );
});

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
    onUpdateDate("from", startDate.value);
  }
};
const applyEndDate = () => {
  if (endDate.value) {
    filters.value.to = standardFormatDate(endDate.value);
    endDateDialog.value = false;
    onUpdateDate("to", endDate.value);
  }
};

watch(startDate, (newVal) => {
  if (newVal) {
    applyStartDate();
  }
});
watch(endDate, (newVal) => {
  if (newVal) {
    applyEndDate();
  }
});

watch(() => filters.value.from, getAllVisitors);
watch(() => filters.value.to, getAllVisitors);

onMounted(() => {
  startDate.value = getPast30DaysDate();
  filters.value.from = standardFormatDate(startDate.value);
  getAllVisitors();
});

async function onUpdateDate(elementId: string, date: string | Date) {
  // const getDate = new Date(document.getElementById(elementId).value);
  const getDate = new Date(date);
  filters.value[elementId] = standardFormatDate(getDate);
  await getAllVisitors();
}

async function getAllVisitors() {
  await setVisitors({
    search: search.value,
    site: mySite.value,
    type: "all",
    startDate: moment.tz(
      moment(filters.value.from, "DD/MM/YYYY"),
      "Asia/Singapore",
    ) as unknown as string,
    endDate: moment.tz(
      moment(filters.value.to, "DD/MM/YYYY").endOf("day"),
      "Asia/Singapore",
    ) as unknown as string,
  });
}

const actions = [
  {
    text: "View",
    to: true,
    disabled: false,
    action: "read",
    subject: "view-keys",
  },
];

const filteredActions = computed(() => {
  return actions.filter((action) =>
    $ability.can(action.action, action.subject),
  );
});

const filterOpt = computed(() => {
  return [
    {
      name: "All",
      value: "all",
      disabled: false,
    },
    {
      name: "Returned",
      value: "returned",
      disabled: false,
    },
    {
      name: "Not Returned",
      value: "not returned",
      disabled: false,
    },
  ];
});

const passStatusOption = computed(() => {
  return [
    {
      name: "Pass Returned",
      value: true,
    },
    {
      name: "Pass Not Return",
      value: false,
    },
  ];
});

const keyStatusOption = computed(() => {
  return [
    {
      name: "Key Returned",
      value: true,
    },
    {
      name: "Key Not Return",
      value: false,
    },
  ];
});

onMounted(async () => {
  await getSitesOpt();
  await getAllVisitors();
});

onUnmounted(() => {
  filterSite.value = "";
  siteOptions.value = [];
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
      siteOptions.value.find((i) => i._id === mySite.value)?._id || "";
  }
}

async function onUpdatePassStatus(val: boolean) {
  visitor.value.isPassReturned = val;
}

async function onUpdateKeyStatus(val: boolean) {
  visitor.value.isKeyReturned = val;
}

async function onUpdatePassAndKeyStatus() {
  await Promise.all([
    updateVisitorPassStatusById(
      visitor.value._id!,
      (visitor.value.isPassReturned = visitor.value.isPassReturned),
      visitor.value.visitorPass._id,
    ),
    updateVisitorKeyStatusById(
      visitor.value._id!,
      (visitor.value.isKeyReturned = visitor.value.isKeyReturned),
    ),
  ]);
  await getAllVisitors();
  dialog.value = false;
}

function onSearch(val: string) {
  debouncedSearch(val);
}

const debouncedSearch = debounce(async (value: string) => {
  search.value = value;
  await getAllVisitors();
}, 500);

async function onFilter(value: string) {
  selectedFilter.value = value;
  await getAllVisitors();
}

async function onRouteOrShowDialog(
  val: { text: string; to: boolean | string },
  visitor: TVisitor,
) {
  dialogView.value = val.text;
  setVisitor(visitor);
  if (typeof val.to === "string") {
    if (val.to === "showNotify") {
      // notify
      updateStatusDialog.value = true;
      return;
    }
    // routes
    navigateTo({
      name: val.to,
      query: { site: mySite.value },
    });
  } else if (typeof val.to === "boolean") {
    // dialog
    dialog.value = val.to;
    if (/^(View|Edit)$/i.test(dialogView.value)) {
      const result = (await getVisitorById(visitor._id)) as
        | TVisitor
        | undefined;
      setVisitor(result);
    }
  }
}
</script>

<style scoped>
.dialog_desktop {
  margin: 0 0 0 auto;
  max-width: 30rem;
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
