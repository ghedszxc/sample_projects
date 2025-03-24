<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-col cols="12">
        <v-toolbar color="secondaryDark">
          <v-col
            cols="12"
            class="header d-flex justify-space-between align-center pa-0"
          >
            <!-- <div>
              <v-icon @click="goBack()" class="pr-2 pb-1">
                mdi-arrow-left
              </v-icon>
              <span class="header-text pt-2 mt-2">Announcement</span>
            </div> -->
            <v-col cols="12">
              <v-icon
                start
                size="x-large"
                @click="goBack()"
                style="position: relative; right: 15px; top: 2px"
              >
                <v-img
                  class="pl-0 ml-0 mt-1"
                  src="/dark-mode/utility-all/right-arrow.svg"
                  cover
                ></v-img>
              </v-icon>
              <span style="position: relative; right: 23px; color: baseColor">
                Facility Booking</span
              >
            </v-col>
          </v-col>

          <template v-slot:extension>
            <v-tabs v-model="tabs" slider-color="#EB261E" grow stacked class="">
              <v-tab
                @click="loadTab(1)"
                :value="1"
                text="Facilities"
                class="pb-2"
              >
              </v-tab>
              <v-tab @click="loadTab(2)" :value="2" text="Booked" class="pb-2">
              </v-tab>
              <v-tab
                @click="loadTab(3)"
                :value="3"
                text="Booking History"
                class="pb-2"
              >
              </v-tab>
            </v-tabs>
          </template>
        </v-toolbar>

        <v-tabs-window v-model="tabs">
          <v-tabs-window-item :value="1">
            <v-row class="mt-6">
              <v-col cols="12">
                <v-text-field
                  class="search-facility"
                  v-model="search"
                  label="Search Facility"
                  placeholder="Search Facility"
                  density="default"
                  filled
                  variant="outlined"
                  hide-details
                  rounded="lg"
                  base-color="var(--Primary, #eb261e)"
                >
                  <template v-slot:append-inner>
                    <div style="width: 30px">
                      <v-img
                        style="margin: auto 0"
                        max-height="25"
                        max-width="30"
                        src="/dark-mode/create-account/icons/search.svg"
                      />
                    </div> </template
                ></v-text-field>

                <v-col cols="12" class="px-0">
                  <div v-if="loading" class="my-6 mx-2">
                    <skeleton-loader-component
                      :loading="loading"
                      v-for="i in 10"
                      :key="i"
                      transition="fade-transition"
                    />
                  </div>
                  <v-infinite-scroll mode="manual" @load="load">
                    <template
                      v-for="FacilityList in facilities"
                      :key="FacilityList._id"
                    >
                      <v-col cols="12" class="px-0 py-2">
                        <nuxt-link
                          class="no-underline"
                          :to="{
                            name: 'resident-facility-booking-id',
                            params: { id: FacilityList._id },
                          }"
                        >
                          <v-card
                            class="card-design"
                            color="base"
                            :class="cardDesign"
                          >
                            <v-row no-gutters class="mx-4 my-2">
                              <v-col cols="1" class="d-flex align-center">
                                <v-avatar class="pa-0" rounded="0" size="26">
                                  <v-img
                                    class="profile-image"
                                    :src="
                                      FacilityList.icon
                                        ? `${config.public.MAIN_APP_URL}/icons/facility/${theme === 'dark' ? 'dark' : 'light'}/${FacilityList.icon}`
                                        : '/icons/facility-booking/default.svg'
                                    "
                                    elevation="0"
                                    :style="`filter: brightness(${iconBrightness});`"
                                  ></v-img>
                                </v-avatar>
                              </v-col>
                              <v-col cols="9" class="d-flex align-center">
                                <v-card-title class="list-text">
                                  {{
                                    FacilityList.name
                                      ? FacilityList.name
                                          .split(" ")
                                          .map(
                                            (word) =>
                                              word.charAt(0).toUpperCase() +
                                              word.slice(1),
                                          )
                                          .join(" ")
                                      : ""
                                  }}
                                </v-card-title>
                              </v-col>
                              <v-col
                                cols="2"
                                class="d-flex align-center justify-center"
                              >
                                <v-avatar rounded="0" size="24">
                                  <v-avatar rounded="0" size="24">
                                    <v-img :src="calendarImgSrc"></v-img>
                                  </v-avatar>
                                </v-avatar>
                              </v-col>
                            </v-row> </v-card
                        ></nuxt-link>
                      </v-col>
                    </template>
                    <template v-if="search && facilities.length === 0">
                      <v-col cols="12" class="px-0 py-2">
                        <p class="text-center">No data</p>
                      </v-col>
                    </template>
                    <template v-slot:load-more="{ props }">
                      <v-btn
                        v-if="facilities.length > 0"
                        width="100%"
                        size="large"
                        color="#E0241C"
                        :variant="!canNextPage ? 'text' : 'outlined'"
                        :class="!canNextPage ? 'mt-2' : 'mt-2 my-button'"
                        v-bind="props"
                        :disabled="!canNextPage"
                      >
                        {{
                          !canNextPage
                            ? "No more facilities to load."
                            : "Load more"
                        }}
                      </v-btn>
                    </template>
                  </v-infinite-scroll>
                </v-col>
              </v-col>
            </v-row>
          </v-tabs-window-item>

          <v-tabs-window-item :value="2">
            <v-row>
              <v-col cols="12">
                <v-col cols="12" class="px-0">
                  <div v-if="loadingBooked" class="my-6 mx-2">
                    <skeleton-loader-component
                      :loading="loadingBooked"
                      v-for="i in 10"
                      :key="i"
                      transition="fade-transition"
                    />
                  </div>
                  <v-infinite-scroll mode="manual" @load="loadBooked" else>
                    <template
                      v-for="FacilityList in facilityBookings"
                      :key="FacilityList._id"
                    >
                      <v-col cols="12" class="px-0 py-1 pb-2">
                        <nuxt-link class="no-underline">
                          <v-card
                            class="card-design"
                            color="base"
                            :class="cardDesign"
                          >
                            <div @click="bookedDialog(FacilityList)">
                              <v-row no-gutters class="ml-3 mt-2">
                                <v-col cols="12" class="d-flex align-center">
                                  <v-avatar rounded="0" size="20">
                                    <v-avatar rounded="0" size="20">
                                      <v-img :src="calendarImgSrc"></v-img>
                                    </v-avatar>
                                  </v-avatar>
                                  <v-card-title class="list-text pt-3">
                                    {{ formatDate(FacilityList.date) }}
                                  </v-card-title>
                                </v-col>
                              </v-row>
                              <v-col cols="12" class="pb-0 mt-0 pt-0">
                                <span style="font-size: 20px">{{
                                  FacilityList.facilityName
                                }}</span>
                                <br />
                                <span style="font-size: 16px"
                                  >{{ FacilityList.slotName }}
                                </span>
                              </v-col>
                              <v-col
                                cols="12"
                                class="mt-0 pt-0 pb-1 d-flex justify-end"
                              >
                                <v-chip
                                  :color="
                                    FacilityList.status === 'approved'
                                      ? 'green'
                                      : FacilityList.status === 'pending'
                                        ? 'orange'
                                        : 'red'
                                  "
                                  variant="flat"
                                  class="text-capitalize"
                                  style="
                                    font-size: 14px;
                                    color: white !important;
                                  "
                                >
                                  {{ FacilityList.status }}
                                </v-chip>
                              </v-col>
                            </div>

                            <v-col cols="12" class="pt-1 mt-0">
                              <v-btn
                                block
                                color="#EB261E"
                                @click="cancelBookingSelect(FacilityList)"
                              >
                                Cancel</v-btn
                              ></v-col
                            >
                          </v-card></nuxt-link
                        >
                      </v-col>
                    </template>

                    <template v-slot:load-more="{ props }">
                      <v-btn
                        v-if="facilityBookings.length > 0"
                        width="100%"
                        size="large"
                        color="#E0241C"
                        :variant="!canNextPageBooked ? 'text' : 'outlined'"
                        :class="!canNextPageBooked ? 'mt-2' : 'mt-2 my-button'"
                        v-bind="props"
                        :disabled="!canNextPageBooked"
                      >
                        {{
                          !canNextPageBooked
                            ? "No more Booked to load."
                            : "Load more"
                        }}
                      </v-btn>
                    </template>
                  </v-infinite-scroll>
                </v-col>

                <v-dialog
                  v-model="cancelBookingStatus"
                  persistent
                  max-width="400"
                >
                  <v-card class="rounded-lg">
                    <v-col cols="12" class="d-flex justify-end align-center">
                      <div
                        @click="cancelBookingStatus = false"
                        style="cursor: pointer"
                        class="text-center"
                      >
                        <v-avatar rounded="0" style="width: 24px; height: 24px">
                          <v-img :src="BackIconimgSrc" cover></v-img>
                        </v-avatar>
                      </div>
                    </v-col>

                    <v-col cols="12" class="mb-0 pb-0">
                      <v-row no-gutters justify="center">
                        <v-card max-width="504" mb-3 rounded="0" flat>
                          <v-img height="100%" cover>
                            <v-avatar rounded="0" size="190">
                              <v-img
                                src="/icons/facility-booking/cancelBooking.svg"
                                cover
                              ></v-img>
                            </v-avatar>
                          </v-img>
                        </v-card>
                      </v-row>
                    </v-col>
                    <v-card-title class="text-h5 text-center mt-0 pt-0"
                      >Cancel Booking</v-card-title
                    >
                    <v-card-text class="text center">
                      <p class="text-center">
                        Are you sure you want to cancel this booking
                      </p></v-card-text
                    >
                    <v-btn
                      size="large"
                      color="#EB261E"
                      class="mx-6 mb-6"
                      @click="
                        cancelBookingStatus = false;
                        cancelBookingRemarks = true;
                      "
                      >Yes</v-btn
                    >
                  </v-card>
                </v-dialog>

                <v-dialog
                  v-model="cancelBookingRemarks"
                  persistent
                  max-width="400"
                >
                  <v-card class="rounded-lg">
                    <v-col cols="12" class="d-flex justify-end align-center">
                      <div
                        @click="cancelBookingRemarks = false"
                        style="cursor: pointer"
                        class="text-center"
                      >
                        <v-avatar rounded="0" style="width: 24px; height: 24px">
                          <v-img :src="BackIconimgSrc" cover></v-img>
                        </v-avatar>
                      </div>
                    </v-col>

                    <v-col cols="12" class="mb-0 pb-0">
                      <v-row no-gutters justify="center">
                        <v-card max-width="504" mb-3 rounded="0" flat>
                          <v-img height="100%" cover>
                            <v-avatar rounded="0" size="190">
                              <v-img
                                src="/icons/facility-booking/cancelBooking.svg"
                                cover
                              ></v-img>
                            </v-avatar>
                          </v-img>
                        </v-card>
                      </v-row>
                    </v-col>
                    <v-card-title class="text-h5 text-center mt-0 pt-0"
                      >Remarks</v-card-title
                    >
                    <v-textarea
                      v-model="remarks"
                      label="Remarks"
                      class="pa-2"
                      clear-icon="mdi-close-circle"
                      clearable
                    ></v-textarea>
                    <v-btn
                      size="large"
                      color="#EB261E"
                      class="mx-6 mb-6"
                      @click="cancelBooking"
                      >Yes</v-btn
                    >
                  </v-card>
                </v-dialog>

                <v-dialog
                  v-model="approveBookingStatus"
                  persistent
                  max-width="400"
                >
                  <v-card class="rounded-lg">
                    <v-col cols="12" class="d-flex justify-end align-center">
                      <div
                        @click="approveBookingStatus = false"
                        style="cursor: pointer"
                        class="text-center"
                      >
                        <v-avatar rounded="0" style="width: 24px; height: 24px">
                          <v-img :src="BackIconimgSrc" cover></v-img>
                        </v-avatar>
                      </div>
                    </v-col>

                    <v-col cols="12" class="mb-0 pb-0">
                      <v-row no-gutters justify="center">
                        <v-card max-width="504" mb-3 rounded="0" flat>
                          <v-img height="100%" cover>
                            <v-avatar rounded="0" size="190">
                              <v-img
                                src="/icons/facility-booking/approveCancel.svg"
                                cover
                              ></v-img>
                            </v-avatar>
                          </v-img>
                        </v-card>
                      </v-row>
                    </v-col>
                    <v-card-title class="text-h5 text-center mt-0 pt-0 mb-6"
                      >Booking Cancelled</v-card-title
                    >
                  </v-card>
                </v-dialog>

                <v-dialog v-model="openBookedDialog" max-width="500px">
                  <v-card class="card-design" color="base" :class="cardDesign">
                    <v-col cols="12" class="d-flex justify-end align-center">
                      <div
                        @click="openBookedDialog = false"
                        style="cursor: pointer"
                        class="text-center"
                      >
                        <v-avatar rounded="0" style="width: 24px; height: 24px">
                          <v-img :src="BackIconimgSrc" cover></v-img>
                        </v-avatar>
                      </div>
                    </v-col>
                    <v-row no-gutters class="ml-3 my-2">
                      <v-col cols="6" class="d-flex align-center">
                        <v-avatar rounded="0" size="24">
                          <v-avatar rounded="0" size="24">
                            <v-img :src="calendarImgSrc"></v-img>
                          </v-avatar>
                        </v-avatar>
                        <v-card-title class="list-text pt-3">
                          {{ formatDate(dialogBookedData.date) }}
                        </v-card-title>
                      </v-col>
                      <v-col
                        cols="6"
                        class="d-flex mt-0 pt-0 align-center justify-end pr-5"
                      >
                        <v-chip
                          :color="
                            dialogBookedData.status === 'approved'
                              ? 'green'
                              : dialogBookedData.status === 'pending'
                                ? 'orange'
                                : 'red'
                          "
                          style="font-size: 16px; color: white !important"
                          class="text-capitalize"
                          variant="flat"
                        >
                          {{ dialogBookedData.status }}
                        </v-chip>
                      </v-col>
                    </v-row>
                    <v-col cols="12" class="mb-0 pb-0 mt-0 pt-0 pb-1">
                      <span style="font-size: 20px">{{
                        dialogBookedData.facilityName
                      }}</span>
                      <br />

                      <span>{{ dialogBookedData.slotName }} </span>
                    </v-col>
                    <v-col
                      cols="12"
                      class="mb-0 pb-0 pb-1"
                      v-if="dialogBookedData.invites"
                    >
                      <span style="font-size: 20px">Invited Visitor</span>
                      <br />
                      <v-col
                        cols="12"
                        class="ma-0 pa-0"
                        v-for="(invite, index) in dialogBookedData.invites"
                        :key="index"
                      >
                        <v-col cols="12" class="ma-0 pa-0 mb-2">
                          <v-card>
                            <template v-slot:prepend>
                              <v-icon
                                icon="mdi-account"
                                class="my-0 py-0"
                              ></v-icon>
                            </template>
                            <v-card-title
                              class="text-no-wrap my-0 py-0"
                              style="font-size: 18px"
                            >
                              {{ invite.name }}
                            </v-card-title>
                            <v-card-subtitle
                              class="text-no-wrap my-0 py-0"
                              style="font-size: 16px"
                            >
                              {{ invite.email }}
                            </v-card-subtitle>
                            <v-card-text class="my-0 pt-0">
                              <v-row no-gutters>
                                <v-col cols="6">{{
                                  invite.isOvernightParking === null
                                    ? "Walk in"
                                    : "Drive in"
                                }}</v-col>
                                <v-col
                                  cols="6"
                                  v-if="invite.isOvernightParking !== null"
                                  >{{
                                    invite.isOvernightParking
                                      ? "Overnight"
                                      : "Not overnight"
                                  }}</v-col
                                >
                              </v-row></v-card-text
                            >
                          </v-card>
                        </v-col>
                      </v-col>
                    </v-col>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </v-tabs-window-item>

          <v-tabs-window-item :value="3">
            <v-row>
              <v-col cols="12">
                <v-col cols="12" class="px-0">
                  <div v-if="loadingBookingHistory" class="my-6 mx-2">
                    <skeleton-loader-component
                      :loading="loadingBookingHistory"
                      v-for="i in 10"
                      :key="i"
                      transition="fade-transition"
                    />
                  </div>
                  <v-infinite-scroll
                    mode="manual"
                    @load="loadBookedHistory"
                    v-else
                  >
                    <template
                      v-for="FacilityList in facilityBookingsHistory"
                      :key="FacilityList._id"
                    >
                      <v-col cols="12" class="px-0 py-1 pb-2">
                        <nuxt-link class="no-underline">
                          <v-card
                            class="card-design"
                            color="base"
                            :class="cardDesign"
                            @click="openDialog(FacilityList)"
                          >
                            <v-row no-gutters class="ml-3 mt-2">
                              <v-col cols="12" class="d-flex align-center">
                                <v-avatar rounded="0" size="24">
                                  <v-avatar rounded="0" size="24">
                                    <v-img :src="calendarImgSrc"></v-img>
                                  </v-avatar>
                                </v-avatar>
                                <v-card-title class="list-text pt-3">
                                  {{ formatDate(FacilityList.date) }}
                                </v-card-title>
                              </v-col>
                            </v-row>
                            <v-col cols="12" class="mb-0 pb-0 pt-0">
                              <span style="font-size: 20px">{{
                                FacilityList.facilityName
                              }}</span>
                              <br />
                              <span>{{ FacilityList.slotName }} </span>
                            </v-col>

                            <v-col
                              cols="12"
                              class="mt-0 mb-3 pt-0 pb-1 d-flex justify-end"
                            >
                              <v-chip
                                :color="
                                  FacilityList.status === 'approved'
                                    ? 'green'
                                    : FacilityList.status === 'pending'
                                      ? 'orange'
                                      : 'red'
                                "
                                variant="flat"
                                class="text-capitalize"
                                style="font-size: 16px; color: white !important"
                              >
                                {{ FacilityList.status }}
                              </v-chip>
                            </v-col>
                          </v-card>
                        </nuxt-link>
                      </v-col>
                    </template>

                    <template v-slot:load-more="{ props }">
                      <v-btn
                        v-if="facilityBookings.length > 0"
                        width="100%"
                        size="large"
                        color="#E0241C"
                        :variant="
                          !canNextPageBookedHistory ? 'text' : 'outlined'
                        "
                        :class="
                          !canNextPageBookedHistory ? 'mt-2' : 'mt-2 my-button'
                        "
                        v-bind="props"
                        :disabled="!canNextPageBookedHistory"
                      >
                        {{
                          !canNextPageBookedHistory
                            ? "No more History to load."
                            : "Load more"
                        }}
                      </v-btn>
                    </template>
                  </v-infinite-scroll>
                </v-col>
              </v-col>
            </v-row>

            <v-dialog v-model="bookingHistoryDialog" max-width="500px">
              <v-card class="card-design" color="base" :class="cardDesign">
                <v-col cols="12" class="d-flex justify-end align-center">
                  <div
                    @click="bookingHistoryDialog = false"
                    style="cursor: pointer"
                    class="text-center"
                  >
                    <v-avatar rounded="0" style="width: 24px; height: 24px">
                      <v-img :src="BackIconimgSrc" cover></v-img>
                    </v-avatar>
                  </div>
                </v-col>
                <v-row no-gutters class="ml-3 mt-2">
                  <v-col cols="6" class="d-flex align-center">
                    <v-avatar rounded="0" size="24">
                      <v-avatar rounded="0" size="24">
                        <v-img :src="calendarImgSrc"></v-img>
                      </v-avatar>
                    </v-avatar>
                    <v-card-title class="list-text pt-3">
                      {{ formatDate(bookingHistoryData.date) }}
                    </v-card-title>
                  </v-col>
                  <v-col
                    cols="6"
                    class="d-flex mt-0 pt-0 align-center justify-end pr-5"
                  >
                    <v-chip
                      class="text-capitalize"
                      variant="flat"
                      :color="
                        bookingHistoryData.status === 'approved'
                          ? 'green'
                          : bookingHistoryData.status === 'pending'
                            ? 'orange'
                            : 'red'
                      "
                      style="font-size: 16px; color: white !important"
                    >
                      {{ bookingHistoryData.status }}
                    </v-chip>
                  </v-col>
                </v-row>
                <v-col cols="12" class="mb-0 pb-0">
                  <span style="font-size: 20px">{{
                    bookingHistoryData.facilityName
                  }}</span>
                  <br />
                  <span>{{ bookingHistoryData.slotName }} </span>
                </v-col>
                <v-col
                  cols="12"
                  class="mb-0 pb-0 pb-1"
                  v-if="bookingHistoryData.remarks"
                >
                  <span style="font-size: 20px">Remarks</span>
                  <br />
                  <span>{{ bookingHistoryData.remarks }} </span>
                </v-col>

                <v-col
                  cols="12"
                  class="mb-0 pb-0 pb-2"
                  v-if="bookingHistoryData.invites"
                >
                  <span style="font-size: 20px" class="pb-2"
                    >Invited Visitor</span
                  >
                  <br />
                  <v-col
                    cols="12"
                    class="ma-0 pa-0"
                    v-for="(invite, index) in bookingHistoryData.invites"
                    :key="index"
                  >
                    <v-col cols="12" md="6" class="ma-0 pa-0 mb-2">
                      <v-card>
                        <template v-slot:prepend>
                          <v-icon icon="mdi-account" class="my-0 py-0"></v-icon>
                        </template>
                        <v-card-title
                          class="text-no-wrap my-0 py-0"
                          style="font-size: 18px"
                        >
                          {{ invite.name }}
                        </v-card-title>
                        <v-card-subtitle
                          class="text-no-wrap my-0 py-0"
                          style="font-size: 16px"
                        >
                          {{ invite.email }}
                        </v-card-subtitle>

                        <v-card-text class="my-0 pt-0">
                          <v-row no-gutters>
                            <v-col cols="6">{{
                              invite.isOvernightParking === null
                                ? "Walk in"
                                : "Drive in"
                            }}</v-col>
                            <v-col
                              cols="6"
                              v-if="invite.isOvernightParking !== null"
                              >{{
                                invite.isOvernightParking
                                  ? "Overnight"
                                  : "Not overnight"
                              }}</v-col
                            >
                          </v-row></v-card-text
                        >
                      </v-card>
                    </v-col>
                  </v-col>
                </v-col>
              </v-card>
            </v-dialog>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-col>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

import debounce from "lodash/debounce";
const config = useRuntimeConfig();
const { theme } = useLocal();
const { currentUser } = useLocalAuth();

const {
  search,
  isFacilitiesLoaded,
  setFacilities,
  getFacilitiesByPageSearch,
  facilities,
  itemsPerPage,
  pageRange,
  nextPage,
  pages,
  page,
  prevPage,
  canPrevPage,
  MFacility,
  getFacilitiesSetting,
} = useFacility();

const {
  pageBook,
  pagesBook,
  setFacilityBookings,
  facilityBooking,
  facilityBookings,
  isFacilityBookingsLoaded,
  cancelFacilityBooking,
  facilityBookingsHistory,
  setFacilityBookingsHistory,
  nextPages,
  prevPages,
  canNextPages,
  canPrevPages,
  pagesHistory,
  itemsPerPageHistory,
  pageHistory,
  nextPageHistory,
  prevPageHistory,
  canNextPageHistory,
  canPrevPageHistory,

  getFacilityBookingsByPageSearch,
} = useFacilityBookings();

const { formatDate } = useUtils();

const tabs = ref(1);
const cancelBookingRemarks = ref<boolean>(false);
const cancelBookingStatus = ref(false);
const approveBookingStatus = ref(false);
const searchInput = ref("");
const pagesw = ref<number>(0);
const pagesBooked = ref<number>(0);
const pagesBookedHistory = ref<number>(0);
const canNextPage = computed(() => pages.value > page.value);
const canNextPageBooked = computed(() => pagesBook.value > pageBook.value);
const canNextPageBookedHistory = computed(
  () => pagesHistory.value > pageHistory.value,
);
const loading = ref<boolean>(true);
const loadingBooked = ref<boolean>(false);
const loadingBookingHistory = ref<boolean>(false);
const remarks = ref<string>("");
const bookingHistoryDialog = ref<boolean>(false);
const openBookedDialog = ref<boolean>(false);
const bookingHistoryData = ref<any>(null);
const dialogBookedData = ref<any>(null);

const openDialog = (facility: any) => {
  bookingHistoryData.value = facility;
  bookingHistoryDialog.value = true;
};

const bookedDialog = (facility: any) => {
  dialogBookedData.value = facility;
  openBookedDialog.value = true;
};

onMounted(async () => {
  if (!theme.value) theme.value = "light";
  if (useRoute().query.tabBooked) {
    tabs.value = parseInt(useRoute().query.tabBooked as string);
    loadTab(tabs.value);
  }
  console.log;
  facilities.value = [];
  const siteId = currentUser.value.site;

  page.value = 1;
  pagesw.value = pages.value;
  await setFacilities({ sites: [siteId] });

  pagesBooked.value = pagesBook.value;
  pagesBookedHistory.value = pagesHistory.value;

  setTimeout(() => {
    loading.value = false;
  }, 1000);
});

const debouncedSearch = debounce(async (value: string) => {
  await setFacilities({ sites: [currentUser.value.site] });
}, 500);

const loadTab = async (tab: any) => {
  const siteId = currentUser.value.site;
  if (tab === 1) {
    loading.value = true;
    await setFacilities({ sites: [siteId] });
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  } else if (tab === 2) {
    pageBook.value = 1;
    loadingBooked.value = true;
    await setFacilityBookings({
      site: siteId,
      user: currentUser.value._id,
      dataType: "null",
    });

    setTimeout(() => {
      loadingBooked.value = false;
    }, 1000);
  } else if (tab === 3) {
    pageHistory.value = 1;
    loadingBookingHistory.value = true;

    await setFacilityBookingsHistory({
      site: siteId,
      user: currentUser.value._id,
      dataType: "histories",
    });

    setTimeout(() => {
      loadingBookingHistory.value = false;
    }, 1000);
  }
};

watch(search, (newValue, oldValue) => {
  debouncedSearch(newValue);
});

const calendarImgSrc = computed(() =>
  theme.value === "dark"
    ? "/dark-mode/invite-visitor/calendar-dark.svg"
    : "/dark-mode/invite-visitor/calendar-light.svg",
);
const cardDesign = computed(() =>
  theme.value === "dark" ? "card-design" : "card-design-light",
);

const BackIconimgSrc = computed(() =>
  theme.value === "dark"
    ? "/dark-mode/forgot-password/images/back.svg"
    : "/dark-mode/forgot-password/images/back-light.svg",
);

function goBack() {
  useRouter().push({ name: "resident" });
}

function load({ done }) {
  setTimeout(async () => {
    let siteId = currentUser.value.site;

    pagesw.value = pages.value;
    page.value = page.value + 1;
    const _nextVisitors: any = await getFacilitiesByPageSearch({
      sites: [siteId],
      page: page.value,
    });

    pagesw.value = _nextVisitors.pagesw;

    if (_nextVisitors.items.length) {
      facilities.value.push(
        ..._nextVisitors.items.map((item, index) => ({
          ...item,
          index: facilities.value.length + index + 1,
        })),
      );
    }

    done("ok");
  }, 1000);
}

function loadBooked({ done }) {
  setTimeout(async () => {
    let siteId = currentUser.value.site;
    pagesBooked.value = pagesBooked.value;
    pageBook.value = pageBook.value + 1;
    const _nextVisitors: any = await getFacilityBookingsByPageSearch({
      page: pageBook.value,
      site: siteId,
      user: currentUser.value._id,
      dataType: "null",
    });

    pagesBooked.value = _nextVisitors.items;

    if (_nextVisitors.items.length) {
      facilityBookings.value.push(
        ..._nextVisitors.items.map((item, index) => ({
          ...item,
          index: facilityBookings.value.length + index + 1,
        })),
      );
    }

    done("ok");
  }, 1000);
}

function loadBookedHistory({ done }) {
  setTimeout(async () => {
    const siteId = currentUser.value.site;
    pagesHistory.value = pagesHistory.value;
    pageHistory.value = pageHistory.value + 1;
    const _nextVisitors: any = await getFacilityBookingsByPageSearch({
      page: pageHistory.value,
      site: siteId,
      user: currentUser.value._id,
      dataType: "histories",
    });

    pagesBooked.value = _nextVisitors.items;

    if (_nextVisitors.items.length) {
      facilityBookingsHistory.value.push(
        ..._nextVisitors.items.map((item, index) => ({
          ...item,
          index: facilityBookingsHistory.value.length + index + 1,
        })),
      );
    }

    done("ok");
  }, 1000);
}
const bookingData = ref<any[]>([]);

async function cancelBooking() {
  const siteId = currentUser.value.site;

  await cancelFacilityBooking({
    _ids: [bookingData.value._id],
    remarks: remarks.value,
    facility: bookingData.value.facility,
    site: siteId,
    status: "cancelled",
  });

  await setFacilityBookings({
    site: siteId,
    user: currentUser.value._id,
    dataType: "null",
  });
  loadingBooked.value = true;
  setTimeout(() => {
    loadingBooked.value = false;
  }, 1000);
  remarks.value = "";
  cancelBookingRemarks.value = false;
  approveBookingStatus.value = true;
}

function cancelBookingSelect(facilityData: any) {
  bookingData.value = facilityData;

  cancelBookingStatus.value = true;
}

const iconBrightness = computed(() => {
  return theme.value === "dark" ? 1 : 0.3;
});
</script>

<style scoped>
.header-text {
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;
}

.search-facility {
  border-radius: 8px;
  border: 1px solid var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}

.style-card {
  border-radius: 16px;
  border: 1px solid #f2f2f2;
}

.list-text {
  text-align: right;
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;

  line-height: 19px;
}
.no-underline {
  text-decoration: none;
}

.card-design {
  border-radius: 8px;
  border: 1px solid var(--black-004, rgba(0, 0, 0, 0.04));
  box-shadow: 0px 0px 14px 0px rgba(255, 255, 255, 0.1);
}

.card-design-light {
  border: 1px solid var(--black-004, rgba(0, 0, 0, 0.04));
  background: var(--Off-white, #fafafa);

  box-shadow: 0px 5px 14px 0px rgba(15, 14, 20, 0.1);
}

.my-button {
  background-color: #e0241c !important;
  color: #ffffff !important;
}
</style>
