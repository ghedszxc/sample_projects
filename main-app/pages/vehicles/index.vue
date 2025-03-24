<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="isVehicleLoaded"
      >
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>
        <v-tabs grow v-model="tab">
          <v-tab active-color="#0077b6" value="main">Main</v-tab>
          <v-tab active-color="#0077b6" value="resident"
            >Resident Transactions</v-tab
          >
        </v-tabs>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="main">
            <v-row no-gutters>
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-data-iterator
                      :items="vehicles"
                      :items-per-page="itemsPerPage"
                    >
                      <template v-slot:header>
                        <v-row
                          no-gutters
                          class="pa-4 fill-height"
                          align="center"
                        >
                          <v-col
                            cols="12"
                            md="12"
                            class="font-weight-bold text-h6 mb-4"
                          >
                            Vehicle Management
                          </v-col>

                          <v-col cols="12" md="5">
                            <v-row>
                              <v-col
                                cols="12"
                                :md="
                                  currentUser?.type == 'admin' ||
                                  currentUser?.type == 'organization'
                                    ? 5
                                    : 12
                                "
                                :class="`d-flex ${$vuetify.display.smAndDown && 'mb-5'}`"
                              >
                                <v-text-field
                                  v-model="search"
                                  placeholder="Search"
                                  hide-details
                                  density="compact"
                                  append-inner-icon="mdi-magnify"
                                  clearable
                                ></v-text-field>
                              </v-col>

                              <v-col
                                cols="12"
                                :md="currentUser?.type == 'admin' ? 4 : 0"
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
                                :md="
                                  currentUser?.type == 'admin' ||
                                  currentUser?.type == 'organization'
                                    ? 3
                                    : 0
                                "
                                :class="{ 'mb-5': $vuetify.display.smAndDown }"
                                v-if="
                                  currentUser?.type == 'admin' ||
                                  currentUser?.type == 'organization'
                                "
                              >
                                <v-select
                                  v-model="filterSite"
                                  :items="siteOptions"
                                  :disabled="!siteOptions.length"
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

                          <v-col cols="12" md="7">
                            <v-row class="d-flex justify-end">
                              <v-col cols="12" md="3" sm="4">
                                <v-select
                                  v-model="filterByType"
                                  :items="vehicleTypes"
                                  item-title="title"
                                  item-value="value"
                                  hide-details
                                  density="compact"
                                  menu-icon="mdi-chevron-down"
                                  @update:modelValue="updateFilter()"
                                ></v-select>
                              </v-col>

                              <v-col cols="12" md="3" sm="4">
                                <v-select
                                  v-model="filterByStatus"
                                  :items="vehicleStatuses"
                                  item-title="title"
                                  item-value="value"
                                  hide-details
                                  density="compact"
                                  menu-icon="mdi-chevron-down"
                                  @update:modelValue="updateFilter()"
                                ></v-select>
                              </v-col>

                              <v-col
                                cols="12"
                                md="3"
                                sm="4"
                                v-if="$ability.can('create', 'create-vehicles')"
                              >
                                <v-btn
                                  color="blue-darken-3"
                                  block
                                  variant="flat"
                                  style="height: 40px"
                                  @click="addVehicleDialog = true"
                                >
                                  <v-icon>mdi-plus</v-icon>
                                  Add Vehicle
                                </v-btn>
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
                                <v-col cols="12" sm="3" lg="2">
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

                                <v-col cols="12" sm="2" lg="2">
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      v-if="$vuetify.display.lgAndUp"
                                      class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                    >
                                      Status
                                    </span>
                                    <v-col
                                      v-if="$vuetify.display.mdAndDown"
                                      cols="12"
                                    >
                                      <v-row no-gutters class="mr-2">
                                        <span
                                          class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                        >
                                          Status/Type
                                        </span>
                                      </v-row>
                                    </v-col>
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
                                      v-if="$vuetify.display.lgAndUp"
                                      class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                    >
                                      Type
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col cols="12" sm="3" md="3" lg="2">
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      v-if="$vuetify.display.lgAndUp"
                                      class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                    >
                                      Phone No.
                                    </span>
                                    <v-col
                                      v-if="$vuetify.display.mdAndDown"
                                      cols="12"
                                    >
                                      <v-row no-gutters class="mr-2">
                                        <span
                                          class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                        >
                                          Contact/Plate #
                                        </span>
                                      </v-row>
                                    </v-col>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  :sm="$vuetify.display.mdAndDown ? 3 : 2"
                                  lg="2"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                    >
                                      Company/Location
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
                                      class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                    >
                                      Vehicle No.
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
                                    sm="3"
                                    lg="2"
                                    :class="`text ${
                                      $vuetify.display.smAndUp ? 'my-1' : 'mb-2'
                                    }`"
                                    class="d-flex align-center text-truncate"
                                  >
                                    <div
                                      class="d-flex align-center text-truncate mr-2"
                                    >
                                      <v-avatar
                                        size="x-small"
                                        :color="materialColors[itemIndex]"
                                        class="mr-2 pa-4"
                                        v-if="
                                          item.raw?.fullName ||
                                          item.raw.user.name ||
                                          'N/A'
                                        "
                                      >
                                        {{
                                          getInitial(
                                            item.raw?.fullName
                                              ? item.raw.fullName
                                              : item.raw.user.name,
                                          )
                                        }}
                                      </v-avatar>

                                      <div
                                        cols="10"
                                        class="text-capitalize text-body-2 text-truncate"
                                      >
                                        <div class="text-truncate">
                                          {{
                                            item.raw?.fullName
                                              ? item.raw.fullName
                                              : item.raw.user.name
                                                ? item.raw.user.name
                                                : "N/A"
                                          }}
                                        </div>
                                        <div
                                          class="text-caption text-grey text-capitalize text-truncate"
                                          v-if="
                                            item.raw.userType.toLowerCase() !==
                                            'resident'
                                          "
                                        >
                                          {{
                                            item.raw?.fullName
                                              ? "Guest"
                                              : item.raw.user.type
                                          }}
                                        </div>
                                      </div>
                                    </div>
                                  </v-col>

                                  <v-col cols="12" sm="2" class="text-truncate">
                                    <v-row
                                      no-gutters
                                      class="fill-height my-2 my-lg-0 text-truncate"
                                      align-content="center"
                                    >
                                      <span
                                        class="d-inline-block text-truncate text-capitalize text-body-2 mb-2 mb-lg-0 mr-2 w-100"
                                      >
                                        <div
                                          v-if="
                                            item.raw.listType.toLowerCase() ===
                                            'seasonpass'
                                          "
                                          class="text-truncate border-md"
                                        >
                                          <div
                                            class="d-flex flex-column text-truncate"
                                          >
                                            <div
                                              class="text-truncate border-md"
                                            >
                                              <v-icon class="mr-1"
                                                >mdi-car-back</v-icon
                                              >
                                              {{
                                                item.raw.listType === "all"
                                                  ? "Whitelist"
                                                  : item.raw.listType
                                              }}
                                            </div>
                                            <div
                                              class="text-capitalize text-caption text-grey text-truncate"
                                            >
                                              <v-icon class="mr-1"
                                                >mdi-car-back</v-icon
                                              >
                                              {{
                                                new Date(
                                                  item.raw.subscriptionExpiry,
                                                ).getTime() > Date.now()
                                                  ? "(Active)"
                                                  : "(Expired)"
                                              }}
                                            </div>
                                          </div>
                                        </div>

                                        <div v-else class="d-flex align-center">
                                          <v-icon class="mr-1"
                                            >mdi-car-back</v-icon
                                          >
                                          <span class="text-truncate">
                                            {{
                                              item.raw.listType === "all"
                                                ? "Whitelist"
                                                : item.raw.listType
                                            }}
                                          </span>
                                        </div>
                                      </span>
                                      <span
                                        v-if="$vuetify.display.mdAndDown"
                                        class="d-inline-block text-truncate text-capitalize text-body-2 mr-2 w-100"
                                      >
                                        <v-icon color="red" class="mr-1"
                                          >mdi-account-circle-outline</v-icon
                                        >
                                        {{
                                          item.raw.listType.toLowerCase() ===
                                          "seasonpass"
                                            ? "Seasonpass"
                                            : item.raw.userType
                                        }}
                                      </span>
                                    </v-row>
                                  </v-col>

                                  <v-col
                                    cols="12"
                                    sm="2"
                                    v-if="$vuetify.display.lgAndUp"
                                  >
                                    <v-row
                                      no-gutters
                                      class="fill-height"
                                      align-content="center"
                                    >
                                      <span
                                        class="d-flex align-center text-truncate text-capitalize text-body-2"
                                      >
                                        <v-icon color="red" class="mr-1"
                                          >mdi-account-circle-outline</v-icon
                                        >
                                        {{
                                          item.raw.listType.toLowerCase() ===
                                          "seasonpass"
                                            ? "Seasonpass"
                                            : item.raw.userType
                                        }}
                                      </span>
                                    </v-row>
                                  </v-col>

                                  <v-col cols="12" sm="3" lg="2">
                                    <v-row
                                      no-gutters
                                      class="fill-height mr-2"
                                      align-content="center"
                                    >
                                      <span
                                        class="d-flex align-center text-truncate text-capitalize text-body-2 mb-2 mb-lg-0 w-100"
                                      >
                                        <v-icon class="mr-1">mdi-phone</v-icon>
                                        <span class="text-truncate">
                                          {{
                                            item.raw.user.phoneNumber
                                              ? item.raw.user.phoneNumber
                                              : item.raw.phoneNumber
                                                ? item.raw.phoneNumber
                                                : "N/A"
                                          }}
                                        </span>
                                      </span>
                                      <span
                                        v-if="$vuetify.display.mdAndDown"
                                        class="d-flex align-center text-truncate text-capitalize text-body-2 w-100"
                                      >
                                        <v-icon class="mr-1"
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
                                    </v-row>
                                  </v-col>

                                  <v-col cols="12" sm="3" lg="2">
                                    <v-row
                                      no-gutters
                                      class="fill-height mr-2"
                                      align-content="center"
                                    >
                                      <span
                                        class="d-flex align-center text-truncate text-capitalize text-body-2"
                                      >
                                        <v-icon color="green" class="mr-1">
                                          {{
                                            item.raw.user.companyName
                                              ? "mdi-domain"
                                              : "mdi-storefront-outline"
                                          }}
                                        </v-icon>

                                        <span class="text-truncate">
                                          {{
                                            item.raw.user.companyName
                                              ? item.raw.user.companyName
                                              : item.raw.user &&
                                                  item.raw.user.block &&
                                                  item.raw.user.level &&
                                                  item.raw.user.unit
                                                ? `${item.raw.user.block} / ${item.raw.user.level} / ${item.raw.user.unit}`
                                                : item.raw.userType ===
                                                    "resident"
                                                  ? `${item.raw.block} / ${item.raw.level} / ${item.raw.unit}`
                                                  : "N/A"
                                          }}
                                        </span>
                                      </span>
                                    </v-row>
                                  </v-col>

                                  <v-col
                                    cols="12"
                                    sm="2"
                                    v-if="$vuetify.display.lgAndUp"
                                  >
                                    <v-row
                                      no-gutters
                                      class="fill-height"
                                      align-content="center"
                                    >
                                      <span
                                        class="d-flex align-center text-truncate text-capitalize text-body-2"
                                      >
                                        <v-icon class="mr-1"
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
                                    </v-row>
                                  </v-col>

                                  <div
                                    class="position-absolute right-0 top-0 mt-3 mt-lg-0"
                                    :class="
                                      $vuetify.display.mdAndDown
                                        ? 'mr-1'
                                        : 'mr-5'
                                    "
                                  >
                                    <v-menu location="bottom">
                                      <template #activator="{ props }">
                                        <v-btn
                                          v-bind="props"
                                          icon
                                          flat
                                          size="x-small"
                                          style="
                                            position: absolute;
                                            right: 30px;
                                            top: 8px;
                                          "
                                        >
                                          <v-icon
                                            class="pa-4 rounded-xl border-md"
                                            >mdi-dots-vertical</v-icon
                                          >
                                        </v-btn>
                                      </template>

                                      <v-card>
                                        <v-list density="compact" class="pa-0">
                                          <v-list-item
                                            v-if="
                                              $ability.can(
                                                'read',
                                                'view-vehicles',
                                              )
                                            "
                                            class="text-caption"
                                            @click="onSelectVehicle(item.raw)"
                                          >
                                            View
                                          </v-list-item>

                                          <v-list-item
                                            v-if="
                                              $ability.can(
                                                'update',
                                                'edit-vehicles',
                                              )
                                            "
                                            class="text-caption"
                                            @click="
                                              onUpdateVehicleStatus(item.raw)
                                            "
                                          >
                                            Update Status
                                          </v-list-item>
                                          <VehiclesDelete :vehicle="item.raw" />
                                        </v-list>
                                      </v-card>
                                    </v-menu>
                                  </div>
                                </v-row>
                              </v-list-item-title>
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
                                    md="2"
                                    class="text-capitalize white--text font-weight-bold"
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
                                        class="text-truncate mt-1"
                                        :style="
                                          $vuetify.display.smAndDown
                                            ? 'font-size: .8rem;'
                                            : ''
                                        "
                                      >
                                        <v-avatar
                                          size="x-small"
                                          :color="materialColors[itemIndex]"
                                          class="mr-2 pa-4"
                                          v-if="
                                            item.raw?.fullName ||
                                            item.raw.user.name
                                          "
                                        >
                                          {{
                                            getInitial(
                                              item.raw?.fullName
                                                ? item.raw.fullName
                                                : item.raw.user.name,
                                            )
                                          }}
                                        </v-avatar>
                                        {{
                                          item.raw?.fullName
                                            ? item.raw.fullName
                                            : item.raw.user.name
                                        }}
                                        <span
                                          v-if="
                                            item.raw.userType.toLowerCase() !==
                                            'resident'
                                          "
                                        >
                                          {{
                                            item.raw?.fullName
                                              ? "Guest"
                                              : item.raw.user.type
                                          }}
                                        </span>
                                      </span>
                                    </v-row>
                                  </v-col>

                                  <v-col
                                    cols="12"
                                    md="2"
                                    class="mb-2 text-capitalize white--text text font-weight-bold"
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
                                        class="text-truncate mt-1"
                                        :style="
                                          $vuetify.display.smAndDown
                                            ? 'font-size: .8rem;'
                                            : ''
                                        "
                                      >
                                        <v-icon class="ml-1 mr-1"
                                          >mdi-car-back</v-icon
                                        >
                                        <span
                                          v-if="
                                            item.raw.listType.toLowerCase() ===
                                            'seasonpass'
                                          "
                                        >
                                          {{
                                            item.raw.listType === "all"
                                              ? "Whitelist"
                                              : item.raw.listType
                                          }}
                                          {{
                                            new Date(
                                              item.raw.subscriptionExpiry,
                                            ).getTime() > Date.now()
                                              ? "(Active)"
                                              : "(Expired)"
                                          }}
                                        </span>
                                        <span v-else>
                                          {{
                                            item.raw.listType === "all"
                                              ? "Whitelist"
                                              : item.raw.listType
                                          }}
                                        </span>
                                      </span>
                                    </v-row>
                                  </v-col>

                                  <v-col
                                    cols="12"
                                    md="2"
                                    class="mb-2 text-capitalize white--text text font-weight-bold"
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
                                        class="text-truncate mt-1"
                                        :style="
                                          $vuetify.display.smAndDown
                                            ? 'font-size: .8rem;'
                                            : ''
                                        "
                                      >
                                        <v-icon class="ml-1 mr-1"
                                          >mdi-account-circle-outline</v-icon
                                        >
                                        {{ item.raw.userType }}
                                      </span>
                                    </v-row>
                                  </v-col>

                                  <v-col
                                    cols="12"
                                    md="2"
                                    class="mb-2 text-capitalize white--text text font-weight-bold"
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
                                        >Phone:
                                      </span>
                                      <span
                                        class="text-truncate mt-1"
                                        :style="
                                          $vuetify.display.smAndDown
                                            ? 'font-size: .8rem;'
                                            : ''
                                        "
                                      >
                                        <v-icon class="ml-1 mr-1"
                                          >mdi-phone</v-icon
                                        >
                                        {{
                                          item.raw.user.phoneNumber
                                            ? item.raw.user.phoneNumber
                                            : item.raw.phoneNumber
                                              ? item.raw.phoneNumber
                                              : "N/A"
                                        }}
                                      </span>
                                    </v-row>
                                  </v-col>

                                  <v-col
                                    cols="12"
                                    md="2"
                                    class="mb-2 text-capitalize white--text text font-weight-bold"
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
                                        class="text-truncate mt-1"
                                        :style="
                                          $vuetify.display.smAndDown
                                            ? 'font-size: .8rem;'
                                            : ''
                                        "
                                      >
                                        <v-icon
                                          size="x-small"
                                          class="ml-1 mr-1"
                                        >
                                          {{
                                            item.raw.user.companyName
                                              ? "mdi-domain"
                                              : "mdi-storefront-outline"
                                          }}
                                        </v-icon>
                                        {{
                                          item.raw.user.companyName
                                            ? item.raw.user.companyName
                                            : item.raw.user &&
                                                item.raw.user.block &&
                                                item.raw.user.level &&
                                                item.raw.user.unit
                                              ? `${item.raw.user.block} / ${item.raw.user.level} / ${item.raw.user.unit}`
                                              : item.raw.userType === "resident"
                                                ? `${item.raw.block} / ${item.raw.level} / ${item.raw.unit}`
                                                : "N/A"
                                        }}
                                      </span>
                                    </v-row>
                                  </v-col>

                                  <v-col
                                    cols="12"
                                    md="2"
                                    class="mb-2 text-capitalize white--text text font-weight-bold"
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
                                        >Vehicle No:
                                      </span>
                                      <span
                                        class="text-truncate mt-1"
                                        :style="
                                          $vuetify.display.smAndDown
                                            ? 'font-size: .8rem;'
                                            : ''
                                        "
                                      >
                                        <v-icon size="x-small" class="ml-1 mr-1"
                                          >mdi-car-back</v-icon
                                        >
                                        {{
                                          item.raw.plateNumber
                                            ? item.raw.plateNumber.toUpperCase()
                                            : "N/A"
                                        }}
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
                                    class="text-capitalize white--text d-flex align-center d-flex justify-center"
                                  >
                                    <v-row
                                      no-gutters
                                      class="fill-height mt-1"
                                      justify="end"
                                      align-content="center"
                                    >
                                      <v-menu location="bottom">
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
                                            class="pa-0"
                                          >
                                            <v-list-item
                                              v-if="
                                                $ability.can(
                                                  'read',
                                                  'view-vehicles',
                                                )
                                              "
                                              class="text-caption"
                                              @click="onSelectVehicle(item.raw)"
                                            >
                                              View
                                            </v-list-item>

                                            <v-list-item
                                              v-if="
                                                $ability.can(
                                                  'update',
                                                  'edit-vehicles',
                                                )
                                              "
                                              class="text-caption"
                                              @click="
                                                onUpdateVehicleStatus(item.raw)
                                              "
                                            >
                                              Update Status
                                            </v-list-item>
                                            <VehiclesDelete
                                              :vehicle="item.raw"
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
                                You don't have any vehicle yet.
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
                        site: mySite,
                        type: filterByType.toLowerCase(),
                        status: filterByStatus.toLowerCase(),
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
                        site: mySite,
                        type: filterByType.toLowerCase(),
                        status: filterByStatus.toLowerCase(),
                      })
                    "
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
          </v-tabs-window-item>
        </v-tabs-window>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="resident">
            <v-row no-gutters>
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-data-iterator
                      :items="visitors"
                      :items-per-page="vItemsPerPage"
                    >
                      <template v-slot:header>
                        <v-row
                          no-gutters
                          class="pa-4 fill-height"
                          align="center"
                        >
                          <v-col
                            cols="12"
                            md="12"
                            class="font-weight-bold text-h6 mb-4"
                          >
                            Transactions
                          </v-col>

                          <v-col cols="12" md="5">
                            <v-row>
                              <v-col
                                cols="12"
                                :md="
                                  currentUser?.type == 'admin' ||
                                  currentUser?.type == 'organization'
                                    ? 5
                                    : 12
                                "
                                :class="`d-flex ${$vuetify.display.smAndDown && 'mb-5'}`"
                              >
                                <v-text-field
                                  v-model="search"
                                  placeholder="Search"
                                  hide-details
                                  density="compact"
                                  append-inner-icon="mdi-magnify"
                                ></v-text-field>
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
                          <v-list-item class="px-md-8">
                            <v-list-item-title>
                              <v-row no-gutters>
                                <v-col cols="12" lg="3">
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
                                      lg="3"
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
                                        </span>
                                      </v-row>
                                    </v-col>
                                    <v-col v-if="$vuetify.display.md" cols="3">
                                      <v-row no-gutters class="mr-2">
                                        <span
                                          class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                        >
                                          Location
                                        </span>
                                      </v-row>
                                    </v-col>
                                    <v-col
                                      v-if="$vuetify.display.mdAndDown"
                                      cols="2"
                                      sm="4"
                                      md="3"
                                      lg="3"
                                    >
                                      <v-row no-gutters class="mr-2">
                                        <span
                                          class="d-inline-block text-capitalize text-caption font-weight-bold"
                                          style="
                                            word-break: break-word;
                                            white-space: normal;
                                          "
                                        >
                                          Plate #
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
                                      lg="3"
                                    >
                                      <v-row no-gutters class="mr-2">
                                        <span
                                          class="d-inline-block text-capitalize text-caption font-weight-bold"
                                          style="
                                            word-break: break-word;
                                            white-space: normal;
                                          "
                                        >
                                          Check In/Out
                                        </span>
                                      </v-row>
                                    </v-col>
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
                                      Vehice No.
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
                                        v-if="$vuetify.display.lgAndUp"
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
                                    lg="3"
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
                                          {{ `${getInitial(item.raw.name)}` }}
                                        </v-avatar>
                                        {{ item.raw.name }}
                                      </span>
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
                                          <v-icon
                                            size="small"
                                            :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1 mr-4'}`"
                                            color="green"
                                          >
                                            <v-img
                                              src="/icons/timein-green.svg"
                                            ></v-img>
                                          </v-icon>

                                          <span class="text-truncate">
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
                                            </span>
                                          </span>
                                        </span>
                                      </v-col>

                                      <v-col cols="12">
                                        <span
                                          class="d-inline-block text-truncate text-capitalize text-body-2"
                                        >
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
                                                openInApp(
                                                  item.raw.checkOutImage,
                                                )
                                              "
                                              >mdi-image</v-icon
                                            >
                                          </span>
                                          <span v-else> N/A</span>
                                        </span>
                                      </v-col>
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
                                        $vuetify.display.xs
                                          ? 'center'
                                          : 'center'
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
                                          {{ `${getInitial(item.raw.name)}` }}
                                        </v-avatar>
                                        {{ item.raw.name }}
                                      </span>
                                      <!-- Tablet -->
                                      <!-- Col 1 -->
                                      <v-col
                                        cols="3"
                                        sm="4"
                                        md="3"
                                        class="pl-2 pr-2"
                                        v-if="
                                          $vuetify.display.md ||
                                          $vuetify.display.sm
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
                                                `${getInitial(item.raw.name)}`
                                              }}
                                            </v-avatar>
                                            {{ item.raw.name }}
                                          </span>
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
                                              Resident
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
                                              mdi-domain
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
                                      <!-- Col 2 -->
                                      <v-col
                                        cols="3"
                                        v-if="$vuetify.display.md"
                                      >
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
                                              mdi-domain
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
                                              mdi-domain
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
                                          $vuetify.display.md ||
                                          $vuetify.display.sm
                                        "
                                      >
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
                                              mdi-domain
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
                                          $vuetify.display.md ||
                                          $vuetify.display.sm
                                        "
                                        class="d-flex align-center text-truncate"
                                      >
                                        <v-row
                                          no-gutters
                                          class="text-truncate mr-1"
                                        >
                                          <v-col cols="12">
                                            <div
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

                                              <span
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
                                                    openInApp(
                                                      item.raw.checkInImage,
                                                    )
                                                  "
                                                  >mdi-image</v-icon
                                                >
                                              </span>
                                            </div>
                                          </v-col>

                                          <v-col cols="12">
                                            <div
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
                                                style="
                                                  word-break: break-word;
                                                  white-space: normal;
                                                "
                                                class="mb-2"
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
                                        Resident
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
                                          mdi-domain
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
                                        v-if="$vuetify.display.xs"
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
                                        <span
                                          class="d-flex justify-center text-capitalize"
                                          style="
                                            white-space: normal;
                                            overflow-wrap: break-word;
                                            width: 100%;
                                          "
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
                                        </span>
                                        <span>
                                          <v-icon
                                            size="small"
                                            :class="`${$vuetify.display.mdAndUp ? '' : 'mr-1 ml-2'}`"
                                            color="red"
                                          >
                                            <v-img
                                              src="/icons/timeout-green.svg"
                                            ></v-img>
                                          </v-icon>
                                        </span>
                                        <span
                                          v-if="
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
                                      </span>
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
                                You don't have any vehicle yet.
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
                  <span>{{ rpageRange }}</span>
                  <v-btn
                    density="compact"
                    variant="text"
                    icon
                    class="mx-2"
                    :disabled="vcanPrevPage"
                    @click="
                      vprevPage({
                        site: mySite,
                        isResident: true,
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
                    :disabled="!vcanNextPage"
                    @click="
                      vnextPage({
                        site: mySite,
                        isResident: true,
                      })
                    "
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

    <VehiclesAdd />
    <VehiclesInfo />
    <VehiclesUpdateStatus />
    <v-dialog
      v-model="openImageDialog"
      width="80vw"
      @update:modelValue="imageDialogClosed"
    >
      <div style="max-height: 90vh; overflow: auto">
        <v-img :src="`/api/files/${selectedImage}`" />
      </div>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});
const { $ability } = useNuxtApp();
const { currentUser } = useLocalAuth();
const {
  getInitial,
  materialColors,
  standardFormatDateTime,
  standardFormatDate,
  compareDate,
  getPast30DaysDate,
} = useUtils();
const { organizations, setOrganizations } = useOrganization();
const { sites, setSites } = useSite();

const {
  search,
  isVehicleLoaded,
  setVehicle,
  setVehicles,
  vehicles,
  itemsPerPage,
  page,
  pageRange,
  canNextPage,
  nextPage,
  canPrevPage,
  prevPage,
  filterOrganization,
  filterByType,
  filterByStatus,
  vehicleInfoDialog,
  updateVehicleStatusDialog,
  vehicleStatuses,
  vehicleTypes,
  selectedVehicle,
  addVehicleDialog,
  tab,
} = useVehicle();
const { getSitesOptionsForFiltering, siteOptions, filterSite, mySite } =
  useFilter();

const {
  search: vsearch,
  visitor,
  visitors,
  setVisitor,
  setResidents,
  isVisitorsLoaded,
  itemsPerPage: vItemsPerPage,
  rpages,
  rpageRange,
  vcanNextPage,
  vcanPrevPage,
  vnextPage,
  vprevPage,
  filterVisitor: vfilterVisitor,
} = useVisitor();
const openImageDialog = ref(false);
const selectedImage = ref("");
const debouncedSearch = ref("");

const loadMainTabData = async () => {
  try {
    isVehicleLoaded.value = true;
    await setVehicles({
      site: mySite.value,
      type: filterByType.value.toLowerCase(),
      status: filterByStatus.value.toLowerCase(),
      search: debouncedSearch.value,
    });
  } catch (error) {
    console.error("Error loading main tab:", error);
    isVehicleLoaded.value = false;
  } finally {
    isVehicleLoaded.value = false;
  }
};

const loadResidentTabData = async () => {
  try {
    isVehicleLoaded.value = true;
    await setResidents({
      search: debouncedSearch.value,
      site: mySite.value,
      isResident: true,
    });
  } catch (error) {
    console.error("Error loading resident tab:", error);
    isVehicleLoaded.value = false;
  } finally {
    isVehicleLoaded.value = false;
  }
};

const debounce = (fn: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
};

// Create debounced update function
const debouncedUpdate = debounce(async () => {
  if (tab.value === "main") {
    await loadMainTabData();
  } else {
    await loadResidentTabData();
  }
}, 500); // 500ms delay

// Watch for search changes
watch(search, (newValue) => {
  debouncedSearch.value = newValue;
  debouncedUpdate();
});

watch(
  tab,
  async (newTab) => {
    if (newTab === "main") {
      await loadMainTabData();
    } else if (newTab === "resident") {
      await loadResidentTabData();
    }
  },
  { immediate: false },
);

onMounted(async () => {
  await getSitesOptionsForFiltering();

  // Only load data for initial tab
  if (tab.value === "main") {
    await loadMainTabData();
  } else if (tab.value === "resident") {
    await loadResidentTabData();
  }

  if (
    currentUser.value &&
    currentUser.value.organization &&
    currentUser.value.type == "organization"
  ) {
    setSites(currentUser.value.organization);
  } else if (currentUser.value?.type == "admin") {
    setOrganizations();
  }
});

onUnmounted(() => {});

onBeforeRouteLeave(() => {
  page.value = 1;
  filterByType.value = "all";
  filterByStatus.value = "all";
  filterSite.value = "";
  siteOptions.value = [];
});

watch(
  filterOrganization,
  (newValue) => {
    setSites(newValue);
    filterSite.value = "";
  },
  { deep: true },
);

async function updateFilter() {
  page.value = 1;

  setVehicles({
    search: debouncedSearch.value,
    site: mySite.value,
    type: filterByType.value.toLowerCase(),
    status: filterByStatus.value.toLowerCase(),
  });
}

function onSelectVehicle(data: string) {
  vehicleInfoDialog.value = true;
  selectedVehicle.value = data;
}

async function onUpdateVehicleStatus(data: string) {
  updateVehicleStatusDialog.value = true;
  selectedVehicle.value = data;
}

function openInApp(id: string) {
  openImageDialog.value = true;
  selectedImage.value = id;
}

function imageDialogClosed() {
  selectedImage.value = "";
}
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
</style>
