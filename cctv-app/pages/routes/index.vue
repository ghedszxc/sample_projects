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
            <span class="font-weight-bold text-h6">Virtual Patrol</span>
          </v-col>
          <v-col cols="12">
            <v-tabs grow v-model="tab" color="#0077b6" height="60px">
              <v-tab value="virtual-patrol-list"
                ><span class="font-weight-bold"> Virtual Patrol </span></v-tab
              >
              <v-tab value="patrol-settings"
                ><span class="font-weight-bold">Patrol Questions</span></v-tab
              >
            </v-tabs>
          </v-col>
        </v-row>

        <v-tabs-window v-model="tab">
          <!-- Virtual Patrol Tab -->
          <v-tabs-window-item value="virtual-patrol-list">
            <v-data-iterator :items="vPatrols" :items-per-page="itemsPerPage">
              <template v-slot:header>
                <v-row no-gutters class="pa-4 fill-height" align="center">
                  <v-col cols="12">
                    <v-row>
                      <v-col
                        cols="12"
                        sm="8"
                        :md="
                          currentUser?.type == 'admin'
                            ? 4
                            : currentUser?.type == 'organization'
                              ? 4
                              : 10
                        "
                        item="2"
                      >
                        <v-row no-gutters>
                          <v-col
                            cols="12"
                            sm="11"
                            :md="
                              currentUser?.type == 'admin'
                                ? 12
                                : currentUser?.type == 'organization'
                                  ? 12
                                  : 4
                            "
                          >
                            <v-text-field
                              v-model="search"
                              placeholder="Search"
                              hide-details
                              density="compact"
                              append-inner-icon="mdi-magnify"
                              @update:modelValue="onSearch"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="4"
                        md="3"
                        v-if="
                          $ability.can('create', 'create-virtual-patrol') &&
                          $vuetify.display.sm
                        "
                      >
                        <v-row class="d-flex justify-end">
                          <v-col cols="12" md="11">
                            <v-btn
                              color="blue-darken-3"
                              block
                              variant="flat"
                              size="small"
                              style="height: 40px"
                              @click="addDialog = true"
                            >
                              Add Patrol
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col
                        cols="12"
                        :sm="currentUser?.type == 'admin' && 6"
                        :md="currentUser?.type == 'admin' && 3"
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
                        :sm="
                          currentUser?.type == 'admin'
                            ? 6
                            : currentUser?.type == 'organization'
                              ? 6
                              : 6
                        "
                        :md="
                          currentUser?.type == 'admin'
                            ? 3
                            : currentUser?.type == 'organization'
                              ? 3
                              : 3
                        "
                        v-if="
                          currentUser?.type == 'admin' ||
                          currentUser?.type == 'organization'
                        "
                      >
                        <v-select
                          v-model="filterSite"
                          :items="siteOptions"
                          :disabled="!sites.length"
                          item-title="name"
                          item-value="_id"
                          hide-details
                          density="compact"
                          menu-icon="mdi-chevron-down"
                          @update:modelValue="updateFilter()"
                        >
                        </v-select>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="4"
                        md="2"
                        v-if="
                          ($ability.can('create', 'create-virtual-patrol') &&
                            $vuetify.display.mdAndUp) ||
                          $vuetify.display.xs
                        "
                      >
                        <v-row class="d-flex justify-end">
                          <v-col cols="12" md="11">
                            <v-btn
                              color="blue-darken-3"
                              block
                              variant="flat"
                              size="small"
                              style="height: 40px"
                              @click="addDialog = true"
                            >
                              Add Patrol
                            </v-btn>
                          </v-col>
                        </v-row>
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
                  <v-list-item class="py-3">
                    <v-list-item-title>
                      <v-row no-gutters align="center">
                        <v-col cols="12" sm="4" md="2">
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                            align="center"
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

                                <v-card class="elevation-2" min-width="200px">
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
                              <span v-if="$vuetify.display.sm"
                                >- Start/End Time</span
                              >
                            </span>
                          </v-row>
                        </v-col>

                        <v-col cols="12" sm="7" md="4" lg="4">
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
                                <v-card class="elevation-2" min-width="200px">
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
                                              (assignee) =>
                                                (assignee.selected = true),
                                            )
                                          "
                                        >
                                          mdi-select-all
                                        </v-icon>
                                        <v-icon
                                          color="red"
                                          @click.stop="
                                            assigneeList.forEach(
                                              (assignee) =>
                                                (assignee.selected = false),
                                            )
                                          "
                                          >mdi-selection-ellipse-remove</v-icon
                                        >
                                      </div>
                                    </div>
                                    <v-divider />

                                    <v-list density="compact" class="pa-0">
                                      <template
                                        v-for="(assignee, key) in assigneeList"
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
                              Assigned To
                              <span v-if="$vuetify.display.sm">- Schedule</span>
                            </span>
                          </v-row>
                        </v-col>

                        <v-col
                          cols="12"
                          sm="3"
                          md="3"
                          lg="3"
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
                              Schedule
                            </span>
                          </v-row>
                        </v-col>

                        <v-col
                          cols="12"
                          sm="2"
                          md="1"
                          lg="1"
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
                              <span v-if="$vuetify.display.mdAndUp"
                                >Start Time</span
                              >
                              <span v-if="$vuetify.display.sm"
                                >Start/End Time</span
                              >
                            </span>
                          </v-row>
                        </v-col>

                        <v-col cols="12" md="2" v-if="$vuetify.display.mdAndUp">
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                            >
                              End Time
                            </span>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
                <v-divider
                  v-if="$vuetify.display.xs || $vuetify.display.lgAndUp"
                />
              </template>

              <template #default="{ items }">
                <v-list class="pa-0">
                  <template v-for="(item, itemIndex) in items" :key="itemIndex">
                    <v-list-item
                      @click="changePath(item.raw)"
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
                            sm="4"
                            md="2"
                            :class="`text ${
                              $vuetify.display.smAndUp ? 'my-1' : ''
                            }`"
                            class="mt-2 mt-sm-0 pl-sm-2 pl-md-0"
                          >
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.xs ? 'space-between' : 'start'
                              "
                            >
                              <span class="mr-2 d-flex d-sm-none">Route: </span>
                              <span
                                class="d-flex align-center text-capitalize mr-sm-2"
                                :style="
                                  $vuetify.display.xs
                                    ? 'font-size: 1rem;'
                                    : 'word-break: break-word; white-space: normal;'
                                "
                                :class="
                                  $vuetify.display.xs ? '' : 'text-body-2'
                                "
                              >
                                <v-icon
                                  size="x-small"
                                  class="pa-3 mr-2"
                                  style="
                                    background: #1976d2;
                                    border-radius: 25px;
                                    color: #ffffff;
                                  "
                                  >mdi-cctv</v-icon
                                >
                                {{ item.raw.routeName }}
                              </span>
                              <span
                                class="d-inline-block text-truncate text-capitalize w-100 mt-sm-3"
                                :style="
                                  $vuetify.display.xs ? 'font-size: 1rem;' : ''
                                "
                                :class="
                                  $vuetify.display.xs ? '' : 'text-body-2'
                                "
                                v-if="$vuetify.display.sm"
                              >
                                <v-icon class="mr-2" color="green">
                                  <v-img src="/icons/timein-green.svg"></v-img>
                                </v-icon>
                                {{ item.raw.schedule.startTime }}
                                <v-icon class="mr-2" color="red">
                                  <v-img src="/icons/timeout-green.svg"></v-img>
                                </v-icon>
                                {{ item.raw.schedule.endTime }}
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="7"
                            md="4"
                            lg="4"
                            :class="`text ${
                              $vuetify.display.smAndUp ? 'my-1' : ''
                            }`"
                            class="mt-2 mt-sm-0"
                          >
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.xs ? 'space-between' : 'start'
                              "
                            >
                              <span class="mr-2 d-flex d-sm-none"
                                >Assigned to:
                              </span>
                              <span
                                class="d-flex align-center text-capitalize ml-sm-2 mr-sm-2"
                                :style="
                                  $vuetify.display.xs
                                    ? 'font-size: 1rem; word-break: break-word; white-space: normal;'
                                    : 'word-break: break-word; white-space: normal;'
                                "
                                :class="
                                  $vuetify.display.xs ? '' : 'text-body-2'
                                "
                              >
                                <v-avatar
                                  size="x-small"
                                  :color="materialColors[itemIndex]"
                                  class="mr-2"
                                >
                                  {{
                                    getInitial(
                                      item.raw.assignedUser &&
                                        Array.isArray(item.raw.assignedUser)
                                        ? `${item.raw.assignedUser[0].givenName || ""}`
                                        : `${item.raw.assignedUser.givenName || ""}`,
                                    )
                                  }}
                                </v-avatar>
                                {{
                                  item.raw.assignedUser &&
                                  Array.isArray(item.raw.assignedUser)
                                    ? item.raw.assignedUser
                                        .map(
                                          (item) =>
                                            " " +
                                            `${item.givenName || ""} ${item.surname || ""}`,
                                        )
                                        .toString()
                                    : `${item.raw.assignedUser.givenName || ""} ${item.raw.assignedUser.surname || ""}`
                                }}
                              </span>

                              <span
                                class="d-flex align-center text-capitalize mr-sm-3 w-100 pl-2 mt-3"
                                :style="
                                  $vuetify.display.xs
                                    ? 'font-size: 1rem;'
                                    : 'word-break: break-word; white-space: normal;'
                                "
                                :class="
                                  $vuetify.display.xs ? '' : 'text-body-2'
                                "
                                v-if="$vuetify.display.sm"
                              >
                                <v-icon class="mr-2"
                                  >mdi-calendar-month-outline</v-icon
                                >
                                <span>
                                  {{
                                    formatScheduleDays(
                                      item.raw.schedule.daysOfWeek,
                                    )
                                  }}
                                </span>
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="3"
                            md="3"
                            lg="3"
                            :class="`text ${
                              $vuetify.display.smAndUp ? 'my-1' : ''
                            }`"
                            class="mt-2 mt-sm-0"
                            v-if="
                              $vuetify.display.xs || $vuetify.display.mdAndUp
                            "
                          >
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.xs ? 'space-between' : 'start'
                              "
                            >
                              <span class="mr-2 d-flex d-sm-none"
                                >Schedule:
                              </span>
                              <span
                                class="d-flex align-center text-capitalize mr-sm-3"
                                :style="
                                  $vuetify.display.xs
                                    ? 'font-size: 1rem;'
                                    : 'word-break: break-word; white-space: normal;'
                                "
                                :class="
                                  $vuetify.display.xs ? '' : 'text-body-2'
                                "
                              >
                                <v-icon size="small" class="mr-2"
                                  >mdi-calendar-month-outline</v-icon
                                >
                                <span>
                                  {{
                                    formatScheduleDays(
                                      item.raw.schedule.daysOfWeek,
                                    )
                                  }}
                                </span>
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="2"
                            md="1"
                            lg="1"
                            :class="`text ${
                              $vuetify.display.smAndUp ? 'my-1' : ''
                            }`"
                            class="mt-2 mt-sm-0"
                            v-if="
                              $vuetify.display.xs || $vuetify.display.mdAndUp
                            "
                          >
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.xs ? 'space-between' : 'start'
                              "
                            >
                              <span class="mr-2 d-flex d-sm-none"
                                >Start Time:
                              </span>
                              <span
                                class="d-inline-block text-truncate text-capitalize"
                                :style="
                                  $vuetify.display.xs ? 'font-size: 1rem;' : ''
                                "
                                :class="
                                  $vuetify.display.xs ? '' : 'text-body-2'
                                "
                              >
                                <v-icon size="small" class="mr-1" color="green">
                                  <v-img src="/icons/timein-green.svg"></v-img>
                                </v-icon>
                                {{ item.raw.schedule.startTime }}
                              </span>
                            </v-row>
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.xs ? 'space-between' : 'start'
                              "
                              v-if="$vuetify.display.sm"
                            >
                              <span class="mr-2 d-flex d-sm-none"
                                >Start Time:
                              </span>
                              <span
                                class="d-inline-block text-truncate text-capitalize"
                                :style="
                                  $vuetify.display.xs ? 'font-size: 1rem;' : ''
                                "
                                :class="
                                  $vuetify.display.xs ? '' : 'text-body-2'
                                "
                              >
                                <v-icon size="small" class="mr-1" color="red">
                                  <v-img src="/icons/timeout-green.svg"></v-img>
                                </v-icon>
                                {{ item.raw.schedule.endTime }}
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            md="1"
                            lg="1"
                            :class="`text ${
                              $vuetify.display.smAndUp ? 'my-1' : ''
                            }`"
                            class="mt-2 mt-sm-0"
                            v-if="
                              $vuetify.display.xs || $vuetify.display.mdAndUp
                            "
                          >
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.xs ? 'space-between' : 'start'
                              "
                            >
                              <span class="mr-2 d-flex d-sm-none"
                                >End Time:
                              </span>
                              <span
                                class="d-inline-block text-truncate text-capitalize"
                                :style="
                                  $vuetify.display.xs ? 'font-size: 1rem;' : ''
                                "
                                :class="
                                  $vuetify.display.xs ? '' : 'text-body-2'
                                "
                              >
                                <v-icon size="x-small" class="mx-1" color="red">
                                  <v-img src="/icons/timeout-green.svg"></v-img>
                                </v-icon>
                                {{ item.raw.schedule.endTime }}
                              </span>
                            </v-row>
                          </v-col>
                          <v-col :cols="$vuetify.display.smAndUp ? '1' : '12'">
                            <v-row
                              no-gutters
                              align-content="end"
                              :justify="
                                $vuetify.display.smAndUp ? 'end' : 'center'
                              "
                              align="center"
                            >
                              <v-menu
                                v-if="
                                  $ability.can(
                                    'update',
                                    'edit-virtual-patrol',
                                  ) ||
                                  $ability.can(
                                    'delete',
                                    'delete-virtual-patrol',
                                  )
                                "
                              >
                                <template #activator="{ props }">
                                  <v-btn
                                    v-bind="props"
                                    icon
                                    flat
                                    size="small"
                                    v-if="$vuetify.display.smAndUp"
                                  >
                                    <v-icon>mdi-dots-vertical</v-icon>
                                  </v-btn>
                                  <v-btn
                                    block
                                    v-bind="props"
                                    color="primary"
                                    class="border mx-2 mt-4 mb-4"
                                    variant="outlined"
                                    v-else
                                    ><v-icon class="mr-2">mdi-eye</v-icon>
                                    View
                                  </v-btn>
                                </template>

                                <v-card>
                                  <v-list density="compact" class="pa-0">
                                    <v-list-item
                                      v-if="
                                        $ability.can(
                                          'update',
                                          'edit-virtual-patrol',
                                        )
                                      "
                                      @click="editRoute(item.raw)"
                                    >
                                      <span class="text-caption">
                                        Edit Route
                                      </span>
                                    </v-list-item>
                                    <RoutesDeleteRoute :route="item.raw" />
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
                        You don't have any route yet.
                      </span>
                    </v-row>
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>

            <v-divider></v-divider>

            <v-row no-gutters justify="end" align-content="center" class="pa-4">
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
          </v-tabs-window-item>

          <v-tabs-window-item value="patrol-settings">
            <RoutesPatrolSettingsTab />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
    </v-col>
    <RoutesAddRoute></RoutesAddRoute>
    <RoutesEditRoute></RoutesEditRoute>
  </v-row>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

definePageMeta({
  middleware: "secure",
});
const { $ability } = useNuxtApp();
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const { getInitial, materialColors, formatScheduleDays } = useUtils();
const { setOrganizations, organizations } = useOrganization();
const { sites, setSites } = useSite();
const { users, getAllSecurityGroupMembers, setUsers } = useUser();
const {
  newVPatrol,
  vPatrols,
  page,
  pages,
  pageRange,
  nextPage,
  prevPage,
  itemsPerPage,
  isVPatrolLoading,
  addDialog,
  editRouteDialog,
  setVPatrol,
  setVPatrols,
  setNewVPatrol,
  search,
} = useVirtualPatrol();
const {
  getSitesOptionsForFiltering,
  siteOptions,
  mySite,
  filterSite,
  filterOrganization,
  myProvider,
} = useFilter();
const { setOnGoingPatrol } = usePatrolLog();
const { getAllServicesAvailable } = useSiteCollab();
const selectedGroup = ref("");
const routeList = ref<
  { _id: string | undefined; name: string | undefined; selected: boolean }[]
>([]);
const assigneeList = ref<
  { _id: string | undefined; name: string | undefined; selected: boolean }[]
>([]);

const tab = ref("virtual-patrol-list");

const routeIds = computed(() => {
  return routeList.value
    .filter((item) => item.selected && item._id)
    .map((item) => item._id);
});

const assigneeIds = computed(() => {
  return assigneeList.value
    .filter((item) => item.selected && item._id)
    .map((item) => item._id);
});

async function onUpdateFilters() {
  // FILTER ROUTE LIST
  const removeDuplicateRouteName = new Map(
    vPatrols.value
      .filter((item) => item.routeName)
      .map((item) => [item.routeName, item]),
  );
  const getRouteName = [...removeDuplicateRouteName.values()].map((item) => ({
    _id: item._id,
    name: item.routeName,
    selected: true,
  }));
  routeList.value = getRouteName;

  const allAssignees = vPatrols.value
    .map((item) => item.assignedUser)
    .flatMap((item) => [...item]);

  // FILTER ASSIGNEE LIST
  const removeDuplicateAssignee = new Map(
    allAssignees
      .filter((item) => item && item.givenName)
      .map((item) => [item._id, item]),
  );

  const getAssignee = [...removeDuplicateAssignee.values()].map((item) => ({
    _id: item._id,
    name: item.givenName,
    selected: true,
  }));
  assigneeList.value = getAssignee;
}

async function editRoute(rt: {}) {
  editRouteDialog.value = true;
  let data = JSON.stringify(rt);
  newVPatrol.value = JSON.parse(data);
}

async function updateFilter() {
  await onFilterTable();
  onUpdateFilters();
}

async function onFilterTable() {
  // const routeIds = routeList.value
  //   .filter((item) => item.selected)
  //   .map((item) => item._id)
  //   .filter((id) => id);

  // const assigneeIds = assigneeList.value
  //   .filter((item) => item.selected)
  //   .map((item) => item._id)
  //   .filter((id) => id);

  await setVPatrols({
    site: mySite.value,
    routeIds:
      routeIds.value.length != routeList.value.length
        ? routeIds.value.toString()
        : "",
    assigneeIds: /^(service-provider-member)$/i.test(currentUser.value.type)
      ? currentUser.value._id
      : assigneeIds.value.length != assigneeList.value.length
        ? assigneeIds.value.toString()
        : "",
  });
}

watch(
  filterOrganization,
  (newValue) => {
    setSites(newValue);
  },
  { deep: true },
);

onMounted(async () => {
  await getSitesOpt();
  const response = await getAllServicesAvailable(
    String(mySite.value),
    String(currentUser.value.serviceProvider || ""),
    "Security",
  );

  const isPatrolling = await setOnGoingPatrol({ site: mySite.value });

  if (isPatrolling.length > 0) {
    setSnackbar({
      text: "Virtual Patrolling is currently ongoing.",
      type: "info",
      modal: true,
    });
  }

  const assignedGroup =
    response.items.length > 0
      ? response.items.filter((i) => i)[0].assignedGroup
      : undefined;

  selectedGroup.value =
    assignedGroup && Boolean(assignedGroup) && typeof assignedGroup === "object"
      ? assignedGroup._id || ""
      : String(assignedGroup || "");
  if (selectedGroup.value) {
    await getAllAssignee();
  }

  await Promise.all([
    setVPatrols({
      site: mySite.value,
      assigneeIds: /^(service-provider-member)$/i.test(currentUser.value.type)
        ? currentUser.value._id
        : assigneeIds.value.length != assigneeList.value.length
          ? assigneeIds.value.toString()
          : "",
    }),
    setOrganizations(),
  ]);
  onUpdateFilters();
});

onUnmounted(() => {
  filterSite.value = "";
  siteOptions.value = [];
});

async function getAllAssignee() {
  await getAllSecurityGroupMembers({
    service: "security",
    serviceProvider: myProvider.value,
    serviceProviderGroup: selectedGroup.value,
    site: mySite.value,
  });
}

function onSearch(val: string) {
  debouncedSearch(val);
}
const debouncedSearch = debounce(async (value: string) => {
  search.value = value;
  await setVPatrols({
    site: mySite.value,
    routeIds:
      routeIds.value.length != routeList.value.length
        ? routeIds.value.toString()
        : "",
    assigneeIds: /^(service-provider-member)$/i.test(currentUser.value.type)
      ? currentUser.value._id
      : assigneeIds.value.length != assigneeList.value.length
        ? assigneeIds.value.toString()
        : "",
  });
}, 500);

async function getSitesOpt() {
  try {
    isVPatrolLoading.value = true;
    await getSitesOptionsForFiltering();
  } catch (error: any) {
    setSnackbar({ text: error.message || error, modal: true, type: "error" });
  } finally {
    isVPatrolLoading.value = false;
    filterSite.value =
      siteOptions.value.find((i) => i._id === mySite.value)?._id || "";
  }
}

async function changePath(data: TVirtualPatrol) {
  useRouter().push({
    name: "routes-routeId",
    params: {
      routeId: data._id,
    },
    query: {
      site: mySite.value,
    },
  });
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
</style>
