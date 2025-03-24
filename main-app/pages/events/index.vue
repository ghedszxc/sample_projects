<template>
  <v-row no-gutters class="pa-8" :theme="theme">
    <v-col cols="12" lg="8" class="pr-lg-2">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="isEventsLoading"
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
                  :items="tab !== 'visitor checkout' ? events : visitors"
                  :items-per-page="itemsPerPage"
                >
                  <template v-slot:header>
                    <v-row
                      no-gutters
                      class="px-4 py-4 fill-height"
                      align="center"
                    >
                      <v-col cols="12">
                        <v-row>
                          <v-col cols="12">
                            <span class="font-weight-bold text-h6">
                              Calendar
                            </span>
                          </v-col>

                          <v-col cols="12" lg="6" md="6" class="d-flex">
                            <v-card
                              :class="`${
                                tab !== 'upcoming events' ? '' : 'text-white'
                              }`"
                              :style="`display: flex;
                                width: 100%;
                                height: 48px;
                                padding: var(--f-spacing-0, 0px) 16px;
                                justify-content: space-between;
                                align-items: center;
                                ${
                                  tab !== 'upcoming events' && theme === 'light'
                                    ? 'border-radius: 8px 0 0 8px; border-top: 1px solid #ECECEC; border-bottom: 1px solid #ECECEC; border-left: 1px solid #ECECEC; background: var(--white, #fff);'
                                    : tab !== 'upcoming events' &&
                                        theme === 'dark'
                                      ? 'border-radius: 8px 0 0 8px; border-top: 1px solid #6c757d; border-bottom: 1px solid #6c757d; border-left: 1px solid #6c757d;'
                                      : 'border-radius: 8px 0 0 8px; background: var(--def-primary, #1867C0);'
                                }`"
                              @click="switchTab('upcoming events')"
                            >
                              Upcoming Events
                              <v-icon> mdi-calendar-star </v-icon>
                            </v-card>
                            <v-card
                              v-if="
                                ['organization', 'site'].includes(
                                  currentUser.type,
                                )
                              "
                              :class="`${
                                tab !== 'visitor checkout' ? '' : 'text-white'
                              }`"
                              :style="`display: flex;
								width: 100%;
								height: 48px;
								padding: var(--f-spacing-0, 0px) 16px;
								justify-content: space-between;
								align-items: center;
							    ${
                    tab !== 'visitor checkout' && theme === 'light'
                      ? 'border-radius: 0 8px 8px 0; border-top: 1px solid #ECECEC; border-bottom: 1px solid #ECECEC; border-right 1px solid #ECECEC; background: var(--white, #fff);'
                      : tab !== 'visitor checkout' && theme === 'dark'
                        ? 'border-radius: 0 8px 8px 0; border-top: 1px solid #6c757d; border-bottom: 1px solid #6c757d; border-right: 1px solid #6c757d;'
                        : 'border-radius: 0 8px 8px 0; background: var(--def-primary, #1867C0);'
                  }`"
                              @click="switchTab('visitor checkout')"
                            >
                              Visitor Check out
                              <v-icon> mdi-account-arrow-right </v-icon>
                            </v-card>
                          </v-col>
                          <v-col cols="12" lg="6" md="6" class="text-end mb-2">
                            <v-row no-gutters align="end" justify="end">
                              <v-col cols="12" lg="7" md="5">
                                <v-btn
                                  color="primary"
                                  variant="tonal"
                                  prepend-icon="mdi-file-download-outline"
                                  class="text-capitalized w-100"
                                  style="height: 46px"
                                  :loading="isDownloading"
                                  @click="
                                    tab !== 'visitor checkout'
                                      ? onDownloadCSV(
                                          `${tab} - ${date.length > 1 ? standardFormatDate(date[0]) + ' - ' + standardFormatDate(date[date.length - 1]) : standardFormatDate(date[0])}.csv`,
                                        )
                                      : onDownloadCSV(
                                          `${tab} - ${date.length > 1 ? standardFormatDate(date[0]) + ' - ' + standardFormatDate(date[date.length - 1]) : standardFormatDate(date[0])}.csv`,
                                        )
                                  "
                                  :disabled="
                                    tab !== 'visitor checkout'
                                      ? !events.length
                                      : !visitors.length ||
                                        !['organization', 'site'].includes(
                                          currentUser.type,
                                        )
                                  "
                                >
                                  download CSV
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <v-list v-if="$vuetify.display.smAndUp">
                      <v-divider></v-divider>
                      <v-list-item>
                        <v-list-item-title>
                          <v-row
                            no-gutters
                            v-if="tab !== 'visitor checkout'"
                            align="center"
                            class="font-weight-bold text-body-2"
                          >
                            <v-col cols="12" sm="6" md="4">
                              Event Title/Description
                            </v-col>

                            <v-col cols="12" sm="6" md="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                Service
                                <span class="ml-1" v-if="$vuetify.display.sm">
                                  & Date</span
                                >
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="4"
                              v-if="
                                $vuetify.display.mdAndUp || $vuetify.display.xs
                              "
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                Date
                              </v-row>
                            </v-col>
                          </v-row>
                          <v-row
                            no-gutters
                            v-else
                            class="font-weight-bold text-body-2"
                          >
                            <v-col
                              cols="12"
                              sm="6"
                              md="4"
                              :style="
                                theme === 'light'
                                  ? 'color: #052439;'
                                  : 'color: #ffffff;'
                              "
                            >
                              Name
                            </v-col>

                            <v-col cols="12" md="2" sm="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                Date
                                <span class="ml-1" v-if="$vuetify.display.sm"
                                  >& In/Out</span
                                >
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="2"
                              v-if="$vuetify.display.mdAndUp"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                                :style="
                                  theme === 'light'
                                    ? 'color: #052439;'
                                    : 'color: #ffffff;'
                                "
                              >
                                Check In
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="2"
                              v-if="$vuetify.display.mdAndUp"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                                :style="
                                  theme === 'light'
                                    ? 'color: #052439;'
                                    : 'color: #ffffff;'
                                "
                              >
                                Check Out
                              </v-row>
                            </v-col>

                            <v-col cols="12" md="1" sm="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                                :style="
                                  theme === 'light'
                                    ? 'color: #052439;'
                                    : 'color: #ffffff;'
                                "
                              >
                                Visitor Type
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                    </v-list>
                  </template>

                  <template #default="{ items }">
                    <v-list>
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="itemIndex"
                      >
                        <v-list-item
                          :class="
                            $vuetify.display.smAndDown || $vuetify.display.md
                              ? 'py-2 border-md px-4 px-sm-2 rounded-lg mb-2 mx-2 my-2'
                              : 'py-2 px-2 mx-2 my-0 text-body-2'
                          "
                        >
                          <v-list-item-title>
                            <v-row
                              no-gutters
                              v-if="tab !== 'visitor checkout'"
                              align="center"
                              class="py-2"
                            >
                              <v-col cols="12" sm="6" md="4">
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate text-body-2"
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
                                    >Event:
                                  </span>
                                  <div class="d-flex flex-column align-start">
                                    <span
                                      class="font-weight-bold mr-sm-2 w-100"
                                    >
                                      <v-icon>mdi-calendar-star</v-icon
                                      ><span
                                        style="
                                          word-break: break-word;
                                          white-space: normal;
                                        "
                                        >{{ item.raw.title }}</span
                                      >
                                    </span>
                                    <span
                                      class="text-wrap"
                                      :style="
                                        theme === 'light'
                                          ? 'color: #000;'
                                          : 'color: #ffffff;'
                                      "
                                    >
                                      <v-icon>mdi-circle-small</v-icon
                                      >{{ item.raw.description }}
                                    </span>
                                  </div>
                                </v-row>
                              </v-col>

                              <v-divider
                                class="my-2"
                                v-if="$vuetify.display.xs"
                              ></v-divider>

                              <v-col cols="12" md="3" sm="5">
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate text-body-2"
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
                                    >Service:
                                  </span>
                                  {{ item.raw.serviceType }}
                                </v-row>
                                <v-row
                                  no-gutters
                                  class="fill-height text-body-2"
                                  align-content="center"
                                  v-if="$vuetify.display.sm"
                                  :style="
                                    theme === 'light'
                                      ? 'color: #052439; '
                                      : 'color: #ffffff; '
                                  "
                                >
                                  <v-icon
                                    :class="`${
                                      $vuetify.display.mdAndUp ? 'mr-1' : 'mr-1'
                                    }`"
                                  >
                                    mdi-calendar-month-outline
                                  </v-icon>
                                  {{ standardFormatDate(item.raw.start) }} -
                                  {{ standardFormatDate(item.raw.end) }}
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="4"
                                v-if="
                                  $vuetify.display.mdAndUp ||
                                  $vuetify.display.xs
                                "
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate text-body-2"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.smAndDown
                                      ? 'space-between'
                                      : 'start'
                                  "
                                  :style="
                                    theme === 'light'
                                      ? 'color: #052439; '
                                      : 'color: #ffffff; '
                                  "
                                >
                                  <span
                                    class="mr-2 d-flex d-sm-none font-weight-bold"
                                    >Date:
                                  </span>
                                  <span>
                                    <v-icon
                                      :class="`${
                                        $vuetify.display.mdAndUp
                                          ? 'mr-1'
                                          : 'mr-1'
                                      }`"
                                    >
                                      mdi-calendar-month-outline
                                    </v-icon>
                                    {{ standardFormatDate(item.raw.start) }} -
                                    {{ standardFormatDate(item.raw.end) }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col cols="12" sm="1" align="end" justify="end">
                                <v-menu v-if="tab == 'upcoming events'">
                                  <template v-slot:activator="{ props }">
                                    <v-icon
                                      density="compact"
                                      v-bind="props"
                                      class="border pa-4 rounded-xl"
                                    >
                                      mdi-dots-horizontal
                                    </v-icon>
                                  </template>
                                  <v-list>
                                    <template
                                      v-for="(
                                        actionItem, actionIndex
                                      ) in filteredActions"
                                      :key="actionItem.text"
                                    >
                                      <v-list-item
                                        v-if="
                                          ['Update', 'Delete'].includes(
                                            actionItem.text,
                                          )
                                            ? item.raw.createdBy ==
                                              currentUser._id
                                              ? actionItem.text
                                              : ''
                                            : actionItem.text
                                        "
                                        :to="{
                                          name: actionItem.to,
                                          params: { id: item.raw._id },
                                          query: { site: mySite },
                                        }"
                                      >
                                        <template #title>
                                          <span class="text-caption">
                                            {{ actionItem.text }}
                                          </span>
                                        </template>
                                      </v-list-item>
                                    </template>
                                  </v-list>
                                </v-menu>
                              </v-col>
                            </v-row>
                            <v-row no-gutters v-else class="py-2">
                              <v-col cols="12" md="4" sm="6">
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
                                    >Name:
                                  </span>
                                  <span
                                    class="text-truncate mt-1 mr-sm-2"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.smAndUp
                                        ? 'text-body-2'
                                        : ''
                                    "
                                  >
                                    <v-avatar
                                      size="small"
                                      :color="materialColors[itemIndex]"
                                      class="mr-1 mr-md-3"
                                    >
                                      {{ getInitial(item.raw.firstName) }}
                                    </v-avatar>
                                    <span class="mt-1">{{
                                      item.raw.name
                                    }}</span>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col cols="12" md="2" sm="3">
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
                                    >Date:
                                  </span>
                                  <span
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.smAndUp
                                        ? 'text-body-2'
                                        : ''
                                    "
                                  >
                                    <v-icon class="mr-1 mr-md-3">
                                      mdi-calendar-month-outline
                                    </v-icon>
                                    {{
                                      standardFormatDate(item.raw.actualCheckIn)
                                    }}
                                  </span>

                                  <span
                                    class="text-truncate mt-1 d-flex align-center w-100"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                    v-if="$vuetify.display.sm"
                                    :class="
                                      $vuetify.display.smAndUp
                                        ? 'text-body-2'
                                        : ''
                                    "
                                  >
                                    <v-icon class="mr-1 mr-md-3" color="green">
                                      mdi-clock-check-outline
                                    </v-icon>
                                    {{
                                      moment
                                        .tz(
                                          item.raw.actualCheckIn,
                                          "Asia/Singapore",
                                        )
                                        .format("HH:mm")
                                    }}
                                  </span>

                                  <span
                                    class="text-truncate mt-1 d-flex align-center w-100"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                    v-if="$vuetify.display.sm"
                                    :class="
                                      $vuetify.display.smAndUp
                                        ? 'text-body-2'
                                        : ''
                                    "
                                  >
                                    <v-icon class="mr-1 mr-md-3" color="red">
                                      mdi-clock-remove-outline
                                    </v-icon>
                                    {{
                                      moment
                                        .tz(
                                          item.raw.actualCheckOut,
                                          "Asia/Singapore",
                                        )
                                        .format("HH:mm")
                                    }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="2"
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
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Check In:
                                  </span>
                                  <span
                                    class="text-truncate mt-1 d-flex align-center"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.smAndUp
                                        ? 'text-body-2'
                                        : ''
                                    "
                                  >
                                    <v-icon class="mr-1 mr-md-3" color="green">
                                      mdi-clock-check-outline
                                    </v-icon>
                                    {{
                                      moment
                                        .tz(
                                          item.raw.actualCheckIn,
                                          "Asia/Singapore",
                                        )
                                        .format("HH:mm")
                                    }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="2"
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
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Check Out:
                                  </span>
                                  <span
                                    class="text-truncate mt-1 d-flex align-center"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.smAndUp
                                        ? 'text-body-2'
                                        : ''
                                    "
                                  >
                                    <v-icon class="mr-1 mr-md-3" color="red">
                                      mdi-clock-remove-outline
                                    </v-icon>
                                    {{
                                      moment
                                        .tz(
                                          item.raw.actualCheckOut,
                                          "Asia/Singapore",
                                        )
                                        .format("HH:mm")
                                    }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col cols="12" md="2" sm="3">
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
                                    >Visitor Type:
                                  </span>
                                  <span
                                    class="text-truncate mt-1 d-flex align-center"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: .8rem; text-transform: capitalize;'
                                        : 'text-transform: capitalize !important;'
                                    "
                                    :class="
                                      $vuetify.display.smAndUp
                                        ? 'text-body-2'
                                        : ''
                                    "
                                  >
                                    <v-icon class="mr-1 mr-md-3">
                                      mdi-account-outline
                                    </v-icon>
                                    {{ item.raw.type }}
                                  </span>
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
                            No data available.
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
              <span v-if="tab !== 'visitor checkout'">{{ pageRange }}</span>
              <span v-else>{{ pageRangeVisitor }}</span>
              <v-btn
                v-if="tab !== 'visitor checkout'"
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="canPrevPage"
                @click="
                  prevPage({
                    dates,
                    organization: currentUser?.organization,
                    site: ['site', 'service-provider-member'].includes(
                      currentUser.type,
                    )
                      ? mySite
                      : filterSite,
                    serviceProvider: currentUser?.serviceProvider,
                    status: 'active',
                  })
                "
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>

              <v-btn
                v-else
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="canPrevPageVisitor"
                @click="
                  prevVisitorsPage({
                    dateActualCheckOut: dates,
                  })
                "
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                v-if="tab !== 'visitor checkout'"
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="!canNextPage"
                @click="
                  nextPage({
                    dates,
                    organization: currentUser?.organization,
                    site: ['site', 'service-provider-member'].includes(
                      currentUser.type,
                    )
                      ? mySite
                      : filterSite,
                    serviceProvider: currentUser?.serviceProvider,
                    status: 'active',
                  })
                "
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
              <v-btn
                v-else
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="!canNextPageVisitor"
                @click="
                  nextVisitorsPage({
                    dateActualCheckOut: dates,
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

    <!-- calendar -->
    <v-col cols="12" lg="4" md="12">
      <v-row no-gutters align="end" justify="end">
        <v-col cols="12">
          <v-date-picker
            hide-header
            show-adjacent-months
            border
            width="100%"
            v-model="date"
            color="#1867C0"
            multiple
          ></v-date-picker>
        </v-col>
        <v-col cols="12" md="4" lg="12" class="pt-md-4">
          <v-btn
            class="text-subtitle-1"
            color="#1867C0"
            size="large"
            variant="flat"
            @click="AddEventClick"
            block
            :disabled="
              ['admin', 'organization', 'service-provider-member'].includes(
                currentUser?.type,
              )
            "
          >
            Add Event
          </v-btn>
        </v-col>
      </v-row>
    </v-col>

    <!-- dialog component -->

    <v-dialog
      v-model="addEventDialog"
      transition="dialog-right-transition"
      fullscreen
      :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
    >
      <v-card
        :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
        :class="`${theme == 'light' && 'bg-white'} px-3 h-100 ${
          $vuetify.display.mdAndUp && 'rounded-s-xl'
        }`"
      >
        <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
          <v-btn
            color="grey-darken-1"
            icon="mdi-arrow-left"
            @click="addEventDialog = false"
          ></v-btn>
          <span class="font-weight-bold pl-4 pt-1 text-capitalize"
            >Add Event</span
          >
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            icon="mdi-close"
            @click="addEventDialog = false"
          ></v-btn>
        </v-toolbar>

        <v-divider></v-divider>
        <v-card-text>
          <v-row class="h-100 align-center">
            <v-form v-model="isEventValid" @submit.prevent="submit()">
              <v-row no-gutters class="pa-8" justify="center">
                <v-row class="justify-center mb-10">
                  <v-img
                    src="/images/event/addEvent.svg"
                    width="100px"
                    height="100px"
                  ></v-img>
                </v-row>

                <v-col cols="12">
                  <span class="font-weight-bold">Event Title</span>
                  <span class="text-red mx-1 mb-2">*</span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-text-field
                    placeholder="Enter Event Tile"
                    v-model="event.title"
                    density="comfortable"
                    :rules="[requiredInput]"
                    hide-details
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col>
                  <span class="font-weight-bold">Description</span>
                  <span class="text-red mx-1 mb-2">*</span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-textarea
                    placeholder="Enter description of the event"
                    v-model="event.description"
                    density="comfortable"
                    :rules="[requiredInput]"
                    hide-details
                    clearable
                  ></v-textarea>
                </v-col>

                <v-col v-if="currentUser.type !== 'service-provider'">
                  <span class="font-weight-bold">Select service</span>
                  <span class="text-red mx-1 mb-2">*</span>
                </v-col>
                <v-col
                  cols="12"
                  class="mb-4"
                  v-if="currentUser.type !== 'service-provider'"
                >
                  <v-autocomplete
                    hide-details
                    v-model:model-value="event.service"
                    :loading="isServicesLoading"
                    :items="services"
                    item-title="service"
                    item-value="service"
                    density="comfortable"
                    :rules="[requiredInput]"
                    @update:modelValue="onUpdateService"
                    clearable
                  ></v-autocomplete>
                </v-col>

                <v-col>
                  <span class="font-weight-bold">
                    Select service provider group
                  </span>
                  <span class="text-red mx-1 mb-2">*</span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-autocomplete
                    hide-details
                    v-model:model-value="event.serviceProviderGroup"
                    :loading="isServiceProviderGroupsLoading"
                    :items="collabServiceProviderGroups"
                    item-title="groupName"
                    return-object
                    density="comfortable"
                    :rules="[requiredInput]"
                    @update:modelValue="onUpdateServiceProviderGroup"
                    clearable
                  ></v-autocomplete>
                </v-col>

                <v-col>
                  <span class="font-weight-bold">Select member</span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-autocomplete
                    hide-details
                    v-model:model-value="event.serviceProviderMember"
                    :loading="isServiceProvidersLoading"
                    :items="collabServiceProviderMembers"
                    item-title="fullName"
                    return-object
                    density="comfortable"
                    clearable
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-row :class="$vuetify.display.mdAndUp && 'pr-2'">
                    <v-col cols="12" class="pb-0">
                      <span class="font-weight-bold">Start Date</span>
                      <span class="text-red mx-1 mb-2">*</span>
                    </v-col>
                    <v-col cols="12" class="mb-4">
                      <v-text-field
                        hide-details
                        v-model="filters.from"
                        density="comfortable"
                        :rules="[requiredInput]"
                        clearable
                      >
                        <template v-slot:append-inner>
                          <v-menu>
                            <template v-slot:activator="{ props }">
                              <input
                                v-bind="props"
                                type="date"
                                class="overridePicker"
                                id="from"
                                @input="onUpdateDate('from')"
                              />
                            </template>
                          </v-menu>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12">
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <span class="font-weight-bold">End Date</span>
                      <span class="text-red mx-1 mb-2">*</span>
                    </v-col>
                    <v-col cols="12" class="mb-4">
                      <v-text-field
                        hide-details
                        v-model="filters.to"
                        density="comfortable"
                        :rules="[requiredInput]"
                        clearable
                      >
                        <template v-slot:append-inner>
                          <v-menu>
                            <template v-slot:activator="{ props }">
                              <input
                                v-bind="props"
                                type="date"
                                class="overridePicker"
                                id="to"
                                @input="onUpdateDate('to')"
                              />
                            </template>
                          </v-menu>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12">
                  <v-row no-gutters>
                    <v-btn
                      color="#1867C0"
                      class="font-weight-bold"
                      :disabled="!isEventValid"
                      type="submit"
                      :loading="isSubmitLoading"
                      block
                    >
                      submit
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>
            </v-form>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure"],
});

const { $ability } = useNuxtApp();
import moment from "moment-timezone";
const {
  tab,
  events,
  visitors,
  setEventsByDate,
  setVisitorsByDate,
  isEventsLoading,
  itemsPerPage,
  pageRange,
  nextPage,
  prevPage,
  canNextPage,
  canPrevPage,
  pageRangeVisitor,
  nextVisitorsPage,
  prevVisitorsPage,
  canNextPageVisitor,
  canPrevPageVisitor,
  event,
  addEvent,
  setEvent,
  isEventValid,
  getServicesBySite,
  isServicesLoading,
  getServiceProviderMembersById,
  getServiceProviderGroupsById,
  isServiceProvidersLoading,
  isServiceProviderGroupsLoading,
  getEventsByDate,
  getVisitorsByDate,
} = useEvent();

const { theme, setSnackbar } = useLocal();

const { getInitial, materialColors, standardFormatDate, requiredInput } =
  useUtils();

const { currentUser } = useLocalAuth();

const date = ref([new Date()]);

let dates = [];

const addEventDialog = ref(false);

const isDownloading = ref(false);
const services = ref([]);

const collabServiceProviderMembers = ref([]);
const collabServiceProviderGroups = ref([]);

const isSubmitLoading = ref(false);

const { getSitesOptionsForFiltering, filterSite, mySite, myOrg, myProvider } =
  useFilter();

onMounted(async () => {
  await getSitesOptionsForFiltering();

  if (tab.value == "upcoming events") {
    dates = JSON.parse(
      JSON.stringify(
        date.value.map((dateString) => {
          return moment
            .tz(moment(dateString, "DD/MM/YYYY"), "Asia/Singapore")
            .toDate();
        }),
      ),
    );

    await setEventsByDate({
      dates,
      organization: myOrg.value,
      site: ["site", "service-provider-member"].includes(currentUser.value.type)
        ? mySite.value
        : filterSite.value,
      serviceProvider: myProvider.value,
      status: "active",
      limit: 5,
    });
  } else {
    dates = JSON.parse(
      JSON.stringify(
        date.value.map((dateString) => {
          return {
            start: moment
              .tz(
                moment(dateString, "DD/MM/YYYY").startOf("day"),
                "Asia/Singapore",
              )
              .toDate(),
            end: moment
              .tz(
                moment(dateString, "DD/MM/YYYY").endOf("day"),
                "Asia/Singapore",
              )
              .toDate(),
          };
        }),
      ),
    );

    await setVisitorsByDate({
      dateActualCheckOut: dates,
    });
  }
});

watch(date, async (newVal) => {
  if (tab.value == "upcoming events") {
    dates = JSON.parse(
      JSON.stringify(
        newVal.map((dateString) => {
          return moment
            .tz(moment(dateString, "DD/MM/YYYY"), "Asia/Singapore")
            .toDate();
        }),
      ),
    );

    await setEventsByDate({
      dates,
      organization: myOrg.value,
      site: ["site", "service-provider-member"].includes(currentUser.value.type)
        ? mySite.value
        : filterSite.value,
      serviceProvider: myProvider.value,
      status: "active",
      limit: 5,
    });
  } else if (tab.value == "visitor checkout") {
    dates = JSON.parse(
      JSON.stringify(
        date.value.map((dateString) => {
          return {
            start: moment
              .tz(
                moment(dateString, "DD/MM/YYYY").startOf("day"),
                "Asia/Singapore",
              )
              .toDate(),
            end: moment
              .tz(
                moment(dateString, "DD/MM/YYYY").endOf("day"),
                "Asia/Singapore",
              )
              .toDate(),
          };
        }),
      ),
    );

    await setVisitorsByDate({
      dateActualCheckOut: dates,
    });
  }
});

async function switchTab(tabName: string) {
  tab.value = tabName;

  if (tab.value == "upcoming events") {
    dates = JSON.parse(
      JSON.stringify(
        date.value.map((dateString) => {
          return moment
            .tz(moment(dateString, "DD/MM/YYYY"), "Asia/Singapore")
            .toDate();
        }),
      ),
    );

    await setEventsByDate({
      dates,
      organization: myOrg.value,
      site: ["site", "service-provider-member"].includes(currentUser.value.type)
        ? mySite.value
        : filterSite.value,
      serviceProvider: myProvider.value,
      status: "active",
      limit: 5,
    });
  } else if (tab.value == "visitor checkout") {
    dates = JSON.parse(
      JSON.stringify(
        date.value.map((dateString) => {
          return {
            start: moment
              .tz(
                moment(dateString, "DD/MM/YYYY").startOf("day"),
                "Asia/Singapore",
              )
              .toDate(),
            end: moment
              .tz(
                moment(dateString, "DD/MM/YYYY").endOf("day"),
                "Asia/Singapore",
              )
              .toDate(),
          };
        }),
      ),
    );

    await setVisitorsByDate({
      dateActualCheckOut: dates,
    });
  }
}

const actions = [
  {
    text: "View",
    to: "events-id-view",
    action: "read",
    subject: "view-calendar",
  },
  {
    text: "Update",
    to: "events-id",
    action: "update",
    subject: "edit-calendar",
  },
  {
    text: "Delete",
    to: "events-id-delete",
    action: "delete",
    subject: "delete-calendar",
  },
];

const filteredActions = computed(() => {
  return actions.filter((action) =>
    $ability.can(action.action, action.subject),
  );
});

async function getItemsOnDownload() {
  if (tab.value === "upcoming events") {
    const _events = await getEventsByDate({
      dates: date,
      organization: myOrg.value,
      site: ["site", "service-provider-member"].includes(currentUser.value.type)
        ? mySite.value
        : filterSite.value,
      serviceProvider: myProvider.value,
      status: "active",
      page: 1,
      limit: 10000,
    });

    return _events.items;
  }

  const _visitors = await getVisitorsByDate({
    dateActualCheckOut: dates,
    page: 1,
    limit: 10000,
  });

  return _visitors.items;
}

async function onDownloadCSV(filename: string) {
  let rows = [];

  try {
    rows = (await getItemsOnDownload()) || [];
  } catch (error) {
    isDownloading.value = false;
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }

  isDownloading.value = true;

  if (!rows || !rows.length) {
    isDownloading.value = false;
    setSnackbar({
      text: "There is nothing to download.",
      modal: true,
      type: "error",
    });
    return;
  }

  // revise events array

  rows.forEach(async (row) => {
    delete row._id;
    delete row.site;
    delete row.organization;
    delete row.serviceProvider;
    delete row.serviceProviderId;
    delete row.serviceProviderGroup;
    delete row.serviceProviderMember;
    delete row.duration;
    delete row.createdAt;
    delete row.createdBy;
    delete row.createdAccountType;
    delete row.updatedAt;

    if (tab.value == "visitor checkout") {
      delete row.checkOut;
      delete row.block;
      delete row.blockLevel;
      delete row.unit;
      delete row.passKeys;
      delete row.visitorPass;
      delete row.start;
      delete row.end;

      row.checkIn = standardFormatDate(row.checkIn);
      row.actualCheckIn = standardFormatDate(row.actualCheckIn);
      row.actualCheckOut = standardFormatDate(row.actualCheckOut);

      row.passReceivedDate = row.passReceivedDate
        ? standardFormatDate(row.passReceivedDate)
        : "";
      row.keyReceivedDate = row.keyReceivedDate
        ? standardFormatDate(row.keyReceivedDate)
        : "";
      row.passReturnDate = row.passReturnDate
        ? standardFormatDate(row.passReturnDate)
        : "";
      row.keyReturnDate = row.keyReturnDate
        ? standardFormatDate(row.keyReturnDate)
        : "";

      row.registeredAt = row.registeredAt
        ? standardFormatDate(row.registeredAt)
        : "";
    } else {
      row.start = standardFormatDate(row.start);
      row.end = standardFormatDate(row.end);
    }
  });

  const separator = ",";
  const keys = Object.keys(rows[0]);
  const csvContent =
    `${tab.value.toUpperCase()} ${date.value.length > 1 ? standardFormatDate(date.value[0]) + " - " + standardFormatDate(date.value[date.value.length - 1]) : standardFormatDate(date.value[0])}` +
    "\n" +
    "\n" +
    keys.join(separator).toUpperCase() +
    "\n" +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? "" : row[k];
            cell =
              cell instanceof Date
                ? cell.toLocaleString()
                : cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  dates = JSON.parse(
    JSON.stringify(
      date.value.map((dateString) => {
        return moment
          .tz(moment(dateString, "DD/MM/YYYY"), "Asia/Singapore")
          .toDate();
      }),
    ),
  );

  await setEventsByDate({
    dates,
    organization: myOrg.value,
    site: ["site", "service-provider-member"].includes(currentUser.value.type)
      ? mySite.value
      : filterSite.value,
    serviceProvider: myProvider.value,
    status: "active",
    limit: 5,
  });

  isDownloading.value = false;
}

async function AddEventClick() {
  addEventDialog.value = true;
  setEvent();
  if (currentUser.value.type == "service-provider") {
    const result = await getServicesBySite({
      site: ["site", "service-provider-member"].includes(currentUser.value.type)
        ? mySite.value
        : filterSite.value,
      serviceProvider: currentUser.value.serviceProvider,
    });
    event.value.service = result.items[0];
    await onUpdateService();
  } else {
    const result = await getServicesBySite({
      site: ["site", "service-provider-member"].includes(currentUser.value.type)
        ? mySite.value
        : filterSite.value,
      serviceProvider: currentUser.value.serviceProvider,
    });
    services.value = result.items;
  }

  event.value.start = filters.value.from;
  event.value.end = filters.value.to;
}

async function onUpdateService() {
  const result = await getServiceProviderGroupsById({
    site: ["site", "service-provider-member"].includes(currentUser.value.type)
      ? mySite.value
      : filterSite.value,
    service: event.value.service,
  });
  collabServiceProviderGroups.value = result.items;
}

async function onUpdateServiceProviderGroup() {
  const result = await getServiceProviderMembersById({
    site: ["site", "service-provider-member"].includes(currentUser.value.type)
      ? mySite.value
      : filterSite.value,
    serviceProviderGroupId: event.value.serviceProviderGroup._id,
    serviceProvider: event.value.serviceProviderGroup.serviceProvider,
  });

  collabServiceProviderMembers.value = result.items;
}

const filters = ref({
  from: standardFormatDate(new Date()),
  to: standardFormatDate(new Date()),
});

async function onUpdateDate(elementId) {
  const getDate = new Date(document.getElementById(elementId).value);
  filters.value[elementId] = standardFormatDate(getDate);

  if (elementId === "from") {
    event.value.start = filters.value.from;
  } else {
    event.value.end = filters.value.to;
  }
}

// function dateStrToObj(data: string) {
//   const [year, month, date] = data.split("-").map(Number);
//   return new Date(year, month - 1, date);
// }
async function submit() {
  //   const checkStartDate = new Date(event.value.start);
  //   const checkEndDate = new Date(event.value.end);

  //   if (checkEndDate < checkStartDate) {
  //     // to validate start & end date
  //     setSnackbar({
  //       text: "End date must not be earlier than start date",
  //       modal: true,
  //     });
  //     return;
  //   } else {
  try {
    isSubmitLoading.value = true;

    const result = await addEvent({
      title: event.value.title,
      description: event.value.description,
      serviceType: event.value.service,
      start: moment
        .tz(
          moment(event.value.start, "DD/MM/YYYY").startOf("day"),
          "Asia/Singapore",
        )
        .toDate(),
      end: moment
        .tz(
          moment(event.value.end, "DD/MM/YYYY").endOf("day"),
          "Asia/Singapore",
        )
        .toDate(),
      site: ["site", "service-provider-member"].includes(currentUser.value.type)
        ? mySite.value
        : filterSite.value,
      organization: String(myOrg.value),
      serviceProvider: event.value.serviceProviderGroup.serviceProvider,
      serviceProviderGroup: event.value.serviceProviderGroup._id,
      serviceProviderMember: event.value.serviceProviderMember?._id
        ? event.value.serviceProviderMember?._id
        : undefined,
    });

    if (!result) {
      setSnackbar({
        text: "Failed to create event",
        modal: true,
        type: "error",
      });
      return;
    }

    dates = JSON.parse(
      JSON.stringify(
        date.value.map((dateString) => {
          return moment
            .tz(moment(dateString, "DD/MM/YYYY"), "Asia/Singapore")
            .toDate();
        }),
      ),
    );

    await setEventsByDate({
      dates,
      organization: myOrg.value,
      site: ["site", "service-provider-member"].includes(currentUser.value.type)
        ? mySite.value
        : filterSite.value,
      serviceProvider: myProvider.value,
      status: "active",
      limit: 5,
    });

    isSubmitLoading.value = false;
    setSnackbar({
      text: "Successfull created event",
      modal: true,
      type: "success",
    });
    addEventDialog.value = false;
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  //}
}

// const showEventModal = (arg) => {
//   useRouter().push(`/event/${arg.event._def.extendedProps._id}`);
// };

// async function getEvents() {
//   const date = new Date();

//   const thisMonth =
//     new Date(date.getFullYear(), date.getMonth(), 1).getMonth() + 1;
//   const thisYear = new Date(
//     date.getFullYear(),
//     date.getMonth(),
//     1
//   ).getFullYear();

//   const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
//   const lastDay = new Date(
//     date.getFullYear(),
//     date.getMonth() + 1,
//     0
//   ).getDate();

//   await setEvents({
//     from: `${thisYear}-${thisMonth >= 10 ? thisMonth : "0" + thisMonth}-${firstDay >= 10 ? firstDay : "0" + firstDay}`,
//     to: `${thisYear}-${thisMonth >= 10 ? thisMonth : "0" + thisMonth}-${lastDay >= 10 ? lastDay : "0" + lastDay}`,
//   });

//   events.value.map((data) => {
//     calendarOptions.value.events.push({
//       _id: data._id,
//       title: data.title,
//       description: data.description,
//       start: data.start,
//       duration: data?.duration,
//       end: data.end,
//     });
//   });
// }

// async function handleDateClick(arg) {

// 	alert(arg)
// 	// :to="{
// 	// 	name: 'feedback-id',
// 	// 	params: {
// 	// 		id: item.raw._id,
// 	// 	}
// 	// }"
// }

// const calendarOptions = ref({
//   plugins: [dayGridPlugin, listPlugin],
//   initialView: "dayGridMonth",
//   eventClick: showEventModal,

//   headerToolbar: {
//     start: "prev,next today",
//     center: "title",
//     end: "dayGridMonth,dayGridWeek,dayGridDay,listMonth",
//   },
//   events: [],
// });

// submit function
</script>

<style scoped>
.fc-event {
  padding-left: 5px;
  cursor: pointer;
  width: 100%;
  display: block;
}

.dialog_desktop {
  margin: 0 0 0 auto;
  max-width: 28%;
  border-radius: 25px 0 0 25px;

  box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
}
.overridePicker {
  width: 18px;
}
</style>
