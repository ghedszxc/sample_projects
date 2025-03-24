<template>
  <v-row no-gutters class="px-6">
    <!-- header -->
    <v-col cols="12" class="header mt-4" @click="goBack()">
      <v-icon
        start
        size="x-large"
        @click="goBack()"
        style="position: relative; right: 10px"
      >
        <v-img
          class="pl-0 ml-0 mt-1"
          src="/dark-mode/utility-all/right-arrow.svg"
          cover
        ></v-img>
      </v-icon>
      <span style="position: relative; right: 15px"> Facility Booking</span>
    </v-col>

    <!-- icon -->
    <v-col cols="12" class="mt-6">
      <v-row
        no-gutters
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-img
          src="/icons/facility-booking/booking.png"
          style="width: 190px; height: 190px"
        ></v-img>
      </v-row>
    </v-col>

    <!-- title-->
    <v-col cols="12" class="mt-8">
      <v-row no-gutters>
        <span class="title font-weight-bold mt-1"> Personal Information </span>
        <v-spacer></v-spacer>
      </v-row>
    </v-col>

    <v-col cols="12" class="text-right mt-2">
      <span class="text-body-2">
        <span style="color: red">*</span> are required fields
      </span>
    </v-col>

    <!-- Form -->
    <v-col cols="12" class="mt-6">
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="sendInvite"
      >
        <v-row>
          <v-col cols="6" class="pb-0">
            <v-text-field
              class="mb-6 grey-field"
              v-model="currentUser.givenName"
              :rules="[requiredInput]"
              label="First Name"
              placeholder="Enter first name"
              density="default"
              filled
              flat
              variant="outlined"
              hide-details
              readonly
              :base-color="baseColor"
              :bg-color="bgColor"
            ></v-text-field>
          </v-col>
          <v-col cols="6" class="pb-0">
            <v-text-field
              readonly
              class="mb-6 grey-field"
              v-model="currentUser.surname"
              :rules="[requiredInput]"
              label="Last Name"
              placeholder="Enter last name"
              density="default"
              filled
              variant="outlined"
              hide-details
              :base-color="baseColor"
              :bg-color="bgColor"
            ></v-text-field
          ></v-col>
        </v-row>
        <v-col cols="12" class="px-0">
          <v-text-field
            readonly
            class="grey-field"
            v-model="currentUser.email"
            :rules="[requiredInput]"
            label="Email"
            placeholder="Enter last name"
            density="default"
            filled
            variant="outlined"
            hide-details
            :base-color="baseColor"
            :bg-color="bgColor"
          ></v-text-field>
        </v-col>
        <v-row no-gutters class="">
          <v-col cols="5" class="py-0 pr-1 pt-4 pr-4">
            <v-autocomplete
              class="grey-field"
              v-model="prefix"
              label="Country Code"
              density="default"
              :items="prefixes"
              item-title="country"
              item-value="value"
              hide-details
              menu-icon="mdi-chevron-down"
              chips
              readonly
              :base-color="baseColor"
              :bg-color="bgColor"
            >
              <template v-slot:chip="{ props, item }">
                <v-row no-gutters v-bind="props">
                  <v-avatar size="20" :image="item.raw.flag" class="mr-3">
                  </v-avatar>
                  {{ item.raw.dial_code }}
                </v-row>
              </template>
              <template v-slot:item="{ props, item }">
                <v-row no-gutters v-bind="props" class="px-3">
                  <v-col cols="auto">
                    <v-avatar
                      size="30"
                      :image="item.raw.flag"
                      class="mr-4"
                    ></v-avatar>
                  </v-col>
                  <v-col>
                    <span>{{ item.raw.dial_code }}</span>
                  </v-col>
                  <v-col class="text-center">
                    <v-chip color="primary">{{ item.raw.country }}</v-chip>
                  </v-col>
                </v-row>
              </template>
            </v-autocomplete>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="7" class="py-0 pt-4">
            <v-text-field
              :base-color="baseColor"
              :bg-color="bgColor"
              readonly
              class="mb-6 grey-field"
              v-model="primaryPhoneWithoutPrefix"
              :rules="[requiredInput]"
              label="Contact No."
              placeholder="Enter contact no."
              required
              density="default"
              filled
              variant="outlined"
              hide-details
            ></v-text-field
          ></v-col>
        </v-row>
        <!--Arrival date -->

        <div>
          <v-menu :close-on-content-click="false" v-model="menu">
            <template v-slot:activator="{ props }">
              <v-text-field
                class="mb-6"
                v-model="formattedDate"
                :rules="[requiredInput]"
                placeholder="DD/MM/YYYY"
                required
                density="default"
                filled
                outlined
                v-bind="props"
                @click="menu = true"
                hide-details
              >
                <template #append-inner>
                  <v-avatar rounded="0" size="24">
                    <v-img :src="calendarImgSrc"></v-img>
                  </v-avatar>
                </template>
                <template v-slot:label>
                  <span>Book on</span><span class="required pl-1">*</span>
                </template>
              </v-text-field>
            </template>
            <v-date-picker
              v-model="bookDate"
              :max="maxDate"
              @update:modelValue="onDateSelected"
              :format="customFormat"
              :min="minDate"
              :allowed-dates="allowedDates"
            >
              <template v-slot:header="{}"></template>
            </v-date-picker>
          </v-menu>
        </div>

        <v-text-field
          class="mb-6 input-field"
          v-model="selectedTimes"
          density="default"
          filled
          variant="outlined"
          hide-details
          type="text"
          readonly
          @click="selectSlot()"
          :disabled="!formattedDate"
        >
          <template #append-inner>
            <v-avatar rounded="0" size="24">
              <v-img :src="calendarImgSrc"></v-img>
            </v-avatar>
          </template>
          <template v-slot:label>
            <span>Time Slot </span><span class="required pl-1">*</span>
          </template>
        </v-text-field>

        <v-text-field
          v-if="facility.pax"
          class="mb-3"
          :rules="[requiredInput]"
          v-model="duration"
          density="default"
          filled
          variant="outlined"
          hide-details
          type="number"
          @input="limitInput"
        >
          <template v-slot:label>
            <span>Pax</span><span class="required pl-1">*</span>
          </template></v-text-field
        >

        <v-col cols="12" class="px-0 d-flex justify-end">
          <v-btn
            color="#EB261E"
            density="compact"
            flat
            style="height: 48px"
            type="submit"
            @click="inviteVisitorDialog = true"
            class="box-shadow rounded-lg"
          >
            <v-icon left>mdi-plus</v-icon>
            Invite Visitor
          </v-btn>
        </v-col>

        <v-col cols="12" class="pa-0 ma-0" v-if="invitedResidents.length">
          <div class="top-0 left-0 right-0 pb-3 w-100 text-h6">
            <span class="title font-weight-bold mt-1">
              Invited Resident List
            </span>
          </div>

          <div class="bg-surface-light position-relative rounded-lg py-3 ps-3">
            <div class="overflow-y-auto pe-3" style="max-height: 350px">
              <v-card
                class="rounded-lg pa-3 mt-2"
                flat
                :class="cardDesign"
                v-for="(resident, index) in invitedResidents"
                :key="index"
                @click="viewInvitedResident(index)"
              >
                <v-row no-gutters class="mx-6 my-3">
                  <v-col cols="10" class="d-flex align-center">
                    <span
                      >{{ index + 1 }}: {{ resident.name }} -
                      {{ resident.entryMethod }}</span
                    >
                  </v-col>
                  <v-col cols="2" class="d-flex align-center justify-end">
                    <v-icon @click="viewInvitedResident(index)"
                      >mdi-eye-arrow-right-outline</v-icon
                    >
                  </v-col>
                </v-row>
              </v-card>
            </div>
          </div>
        </v-col>

        <v-col cols="12" class="px-0">
          <v-btn
            v-if="facility.pax"
            block
            color="#EB261E"
            flat
            style="height: 48px"
            type="submit"
            @click="dialog = true"
            :disabled="!duration || !selectedTimes || !bookDate"
            class="box-shadow rounded-lg"
          >
            Book
          </v-btn>
          <v-btn
            v-else
            block
            color="#EB261E"
            flat
            style="height: 48px"
            type="submit"
            @click="dialog = true"
            :disabled="!selectedTimes || !bookDate"
            class="box-shadow rounded-lg"
          >
            Book
          </v-btn>
        </v-col>
      </v-form>
    </v-col>

    <v-dialog v-model="dialog" max-width="500px" max-height="100%">
      <v-card class="rounded-xl" color="secondaryDark">
        <v-row no-gutters class="px-6">
          <!-- header -->

          <v-col cols="12" class="header mt-2 pt-4 text-end">
            <v-avatar rounded="0" size="24" @click="dialog = false">
              <v-img
                src="/icons/facility-booking/x-icon.svg"
                class="menu-icon"
              ></v-img>
            </v-avatar>
          </v-col>

          <!-- icon -->
          <v-col cols="12" class="mt-6">
            <v-row
              no-gutters
              class="fill-height"
              align-content="center"
              justify="center"
            >
              <v-img
                src="/icons/facility-booking/booking.png"
                style="width: 190px; height: 190px"
              ></v-img>
            </v-row>
          </v-col>
        </v-row>
        <v-card-title class="headline text-center"
          >Booking Confirmation</v-card-title
        >

        <div class="px-6 pt-6">
          <v-menu :close-on-content-click="false" v-model="menu">
            <template v-slot:activator="{ props }">
              <v-text-field
                :base-color="baseColor"
                :bg-color="bgColor"
                readonly
                class="mb-4 grey-field"
                v-model="formattedDate"
                :rules="[requiredInput]"
                label="Book on"
                placeholder="DD/MM/YYYY"
                required
                density="default"
                filled
                outlined
                v-bind="props"
                @click="menu = true"
                hide-details
                :disabled="isDateDisabled(formattedDate)"
              >
              </v-text-field>
            </template>
            <v-date-picker
              v-model="bookDate"
              :max="maxDate"
              @update:modelValue="onDateSelected"
              :format="customFormat"
              :min="minDate"
            >
              <template v-slot:header="{}"></template>
            </v-date-picker>
          </v-menu>
        </div>
        <v-row>
          <v-col
            cols="12"
            class="mb-0 pb-0 pt-0 mt-0"
            v-for="(time, index) in selectedTimesArray"
            :key="index"
          >
            <v-card
              class="card-design py-3 mx-6 my-1"
              color="base"
              :class="cardDesign"
            >
              <v-row no-gutters>
                <v-col cols="12">
                  <v-row no-gutters class="d-flex align-center justify-center">
                    <v-avatar
                      rounded="2"
                      size="24"
                      class="text-center justify-center"
                    >
                      <v-img src="/icons/facility-booking/clock.svg"></v-img>
                    </v-avatar>
                    <v-card-title>{{ time }}</v-card-title></v-row
                  >
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- setting data  -->
        <v-col cols="12" class="px-6 pt-5 py-0" v-if="hasEnabledDays">
          <v-card variant="outlined">
            <v-col cols="12">
              <p class="px-3 pb-3">
                Booking requests outside our below business hours will not be
                guaranteed a response
              </p>
            </v-col>

            <v-row v-if="hasEnabledDays" class="pb-3">
              <v-col cols="12" class="mb-0 pb-0 pt-0 mt-0">
                <v-row no-gutters class="pb-2">
                  <v-col cols="12" v-for="(day, name) in setting" :key="name">
                    <v-row
                      no-gutters
                      class="d-flex align-center justify-center"
                      v-if="day.isEnabled && day.startTime && day.endTime"
                    >
                      <span class="text-capitalize text-body-2 pb-1"
                        >{{ name }}: {{ day.startTime }} -
                        {{ day.endTime }}</span
                      >
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card></v-col
        >

        <v-text-field
          v-if="facility.pax"
          :base-color="baseColor"
          :bg-color="bgColor"
          readonly
          class="mt-6 mx-6"
          :rules="[requiredInput]"
          v-model="duration"
          label="No of seat"
          density="default"
          variant="outlined"
          hide-details
          type="number"
          @input="limitInput"
        ></v-text-field>
        <v-btn
          color="#EB261E "
          size="large"
          @click="confirmBooking"
          class="box-shadow mb-4 mx-6 mt-5"
          >Confirm</v-btn
        >
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDialog" max-width="500px">
      <v-card class="rounded-xl">
        <v-row no-gutters class="px-6">
          <!-- header -->

          <v-col cols="12" class="header mt-2 pt-4 text-end">
            <v-avatar rounded="0" size="24" @click="confirmDialog = false">
              <v-img
                src="/icons/facility-booking/x-icon.svg"
                class="menu-icon"
              ></v-img>
            </v-avatar>
          </v-col>

          <!-- icon -->
          <v-col cols="12" class="">
            <v-row no-gutters align-content="center" justify="center">
              <v-col cols="12" class="d-flex justify-center text-center">
                <v-img
                  src="/icons/facility-booking/verified.svg"
                  style="width: 190px; height: 190px"
                ></v-img>
              </v-col>
              <v-col cols="cols" class="d-flex justify-center pt-5">
                <span class="text-center text-successful mb-12"
                  >Book Successful</span
                ></v-col
              >
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDialogTakenSlot" max-width="500px">
      <v-card class="rounded-xl">
        <v-row no-gutters class="px-6">
          <!-- header -->

          <v-col cols="12" class="header mt-2 pt-4 text-end">
            <v-avatar
              rounded="0"
              size="24"
              @click="confirmDialogTakenSlot = false"
            >
              <v-img
                src="/icons/facility-booking/x-icon.svg"
                class="menu-icon"
              ></v-img>
            </v-avatar>
          </v-col>

          <!-- icon -->
          <v-col cols="12" class="">
            <v-row no-gutters align-content="center" justify="center">
              <v-img
                src="/icons/facility-booking/cancelBooking.svg"
                style="width: 190px; height: 190px"
              ></v-img>

              <span class="text-center text-successful mb-3"
                >Book Taken slot already</span
              >
              <v-row no-gutters class="mb-4">
                <v-col
                  cols="12"
                  class="mb-0 pb-0 pt-0 mt-0"
                  v-for="(slot, index) in bookedTakenSlot"
                  :key="index"
                >
                  <v-card
                    class="card-design py-3 my-1"
                    color="base"
                    :class="cardDesign"
                  >
                    <v-row no-gutters>
                      <v-col cols="12">
                        <v-row
                          no-gutters
                          class="d-flex align-center justify-center"
                        >
                          <v-avatar
                            rounded="2"
                            size="24"
                            class="text-center justify-center"
                          >
                            <v-img
                              src="/icons/facility-booking/clock.svg"
                            ></v-img>
                          </v-avatar>
                          <v-card-title>{{
                            slot.slotName
                          }}</v-card-title></v-row
                        >
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDialog" persistent max-width="400">
      <v-card class="rounded-lg">
        <v-col cols="12" class="d-flex justify-end align-center">
          <div
            @click="showDialog = false"
            style="cursor: pointer"
            class="text-center"
          >
            <v-avatar rounded="0" style="width: 24px; height: 24px">
              <v-img :src="BackIconimgSrc" cover></v-img>
            </v-avatar>
          </div>
        </v-col>

        <v-col cols="12" class="text-center">
          <span class="text-h5 text-dialog"> Time Slot </span>
        </v-col>

        <v-row
          v-if="timeSlots.length === 0"
          no-gutters
          class="fill-height d-flex align-center justify-center"
          align-content="center"
          justify="center"
        >
          <v-col cols="12" class="text-center justify-center">
            <v-img
              class="text-center justify-center"
              src="/icons/facility-booking/info.svg"
              style="height: 100px"
            ></v-img>
          </v-col>
          <v-col cols="12" class="text-center justify-center pt-6">
            <h3>No available slots</h3>
          </v-col>
        </v-row>
        <v-col
          v-else
          cols="12"
          class="mb-0 pb-0"
          v-for="(card, index) in timeSlots.items"
          :key="index"
          @click="card.message ? null : selectCard(card)"
        >
          <v-card
            class="card-design py-4"
            color="base"
            :class="cardDesign"
            :disabled="card.message"
          >
            <v-row no-gutters class="py-0 pt-2">
              <v-col cols="8">
                <v-row no-gutters class="d-flex align-start justify-start pl-4">
                  <v-avatar
                    rounded="2"
                    size="24"
                    class="text-center justify-start pt-1"
                  >
                    <v-img src="/icons/facility-booking/clock.svg"></v-img>
                  </v-avatar>
                  <div class="pl-3 py-0 my-0">
                    <span style="font-size: 20px"> {{ card.slot }}</span>
                  </div>
                </v-row>
              </v-col>

              <v-col cols="4" class="d-flex align-center justify-end pr-5">
                <v-icon
                  :color="
                    card.message
                      ? 'red'
                      : selectedTimes.includes(card.slot) && !card.message
                        ? 'green'
                        : 'gray'
                  "
                >
                  {{
                    card.message
                      ? "mdi-close-circle"
                      : selectedTimes.includes(card.slot)
                        ? "mdi-check-circle"
                        : "mdi-check-circle-outline"
                  }}
                </v-icon>
                <!-- <v-icon
                  :color="
                    selectedTimes.includes(card.slot) && !card.message
                      ? 'green'
                      : 'gray'
                  "
                >
                  {{
                    card.message
                      ? "mdi-close-circle"
                      : selectedTimes.includes(card.slot)
                      ? "mdi-check-circle"
                      : "mdi-check-circle-outline"
                  }}
                </v-icon> -->
                <!-- <v-icon
                  :color="selectedTimes.includes(card.slot) ? 'green' : 'gray'"
                >
                  {{
                    selectedTimes.includes(card.slot)
                      ? "mdi-check-circle"
                      : "mdi-check-circle-outline"
                  }}
                </v-icon> -->
              </v-col>
              <v-col
                cols="12"
                class="pa-0 ma-0 pl-5 pt-1 d-flex align-center justify-start"
              >
                <div class="Caption" style="color: red">
                  {{ card.message }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-btn
          size="large"
          color="#EB261E"
          class="mx-4 mb-6 mt-6"
          @click="showDialog = false"
          >Close</v-btn
        >
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDialogMaintenance" persistent max-width="400">
      <v-card class="rounded-lg">
        <v-col cols="12" class="d-flex justify-end align-center">
          <div
            @click="showDialogMaintenance = false"
            style="cursor: pointer"
            class="text-center"
          >
            <v-avatar rounded="0" style="width: 24px; height: 24px">
              <v-img :src="BackIconimgSrc" cover></v-img>
            </v-avatar>
          </div>
        </v-col>

        <v-row
          no-gutters
          class="fill-height d-flex align-center justify-center"
          align-content="center"
          justify="center"
        >
          <v-col cols="12" class="text-center justify-center">
            <v-img
              class="text-center justify-center"
              src="/icons/facility-booking/info.svg"
              style="height: 100px"
            ></v-img>
          </v-col>
          <v-col cols="12" class="text-center justify-center pt-6">
            <h3 class="px-3 pb-4">
              Booking is temporarily unavailable for all the listed dates.
            </h3>
          </v-col>
        </v-row>

        <v-col
          cols="12"
          class="mb-0 pb-0"
          v-for="(maintenanceDate, index) in maintenanceDates"
          :key="index"
          @click="selectCard(maintenanceDate)"
        >
          <v-card class="card-design py-3" color="base" :class="cardDesign">
            <v-row no-gutters>
              <v-col cols="8">
                <v-col cols="12" class="d-flex align-center pl-5">
                  <v-avatar rounded="0" size="24">
                    <v-avatar rounded="0" size="24">
                      <v-img :src="calendarImgSrc"></v-img>
                    </v-avatar>
                  </v-avatar>
                  <v-card-title class="list-text pt-3">
                    {{ standardFormatDate(maintenanceDate) }}
                  </v-card-title>
                </v-col>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-btn
          size="large"
          color="#EB261E"
          class="mx-4 mb-6 mt-6"
          @click="showDialogMaintenance = false"
          >Close</v-btn
        >
      </v-card>
    </v-dialog>

    <v-dialog v-model="showFacilityNotFound" persistent max-width="400">
      <v-card class="rounded-lg">
        <v-col cols="12" class="d-flex justify-end align-center">
          <div
            @click="showFacilityNotFound = false"
            style="cursor: pointer"
            class="text-center"
          >
            <v-avatar rounded="0" style="width: 24px; height: 24px">
              <v-img :src="BackIconimgSrc" cover></v-img>
            </v-avatar>
          </div>
        </v-col>

        <v-row
          no-gutters
          class="fill-height d-flex align-center justify-center"
          align-content="center"
          justify="center"
        >
          <v-col cols="12" class="text-center justify-center">
            <v-img
              class="text-center justify-center"
              src="/icons/facility-booking/info.svg"
              style="height: 100px"
            ></v-img>
          </v-col>
          <v-col cols="12" class="text-center justify-center pt-6 px-6">
            <h3 class="px-6">
              {{ messageForBookPastAndDate }}
            </h3>
          </v-col>
        </v-row>

        <v-btn
          size="large"
          color="#EB261E"
          class="mx-4 mb-6 mt-6"
          @click="showFacilityNotFound = false"
          >Close</v-btn
        >
      </v-card>
    </v-dialog>

    <v-dialog v-model="showBookingHoursNotStarted" persistent max-width="400">
      <v-card class="rounded-lg">
        <v-col cols="12" class="d-flex justify-end align-center">
          <div
            @click="showBookingHoursNotStarted = false"
            style="cursor: pointer"
            class="text-center"
          >
            <v-avatar rounded="0" style="width: 24px; height: 24px">
              <v-img :src="BackIconimgSrc" cover></v-img>
            </v-avatar>
          </div>
        </v-col>

        <v-row
          no-gutters
          class="fill-height d-flex align-center justify-center"
          align-content="center"
          justify="center"
        >
          <v-col cols="12" class="text-center justify-center">
            <v-img
              class="text-center justify-center"
              src="/icons/facility-booking/info.svg"
              style="height: 100px"
            ></v-img>
          </v-col>
          <v-col cols="12" class="text-center justify-center pt-6">
            <h3 class="px-3">
              {{ responseData.message }}
            </h3>
          </v-col>
        </v-row>

        <v-btn
          size="large"
          color="#EB261E"
          class="mx-4 mb-6 mt-6"
          @click="showBookingHoursNotStarted = false"
          >Close</v-btn
        >
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="showFacilityCannotBookPastDate"
      persistent
      max-width="400"
    >
      <v-card class="rounded-lg">
        <v-col cols="12" class="d-flex justify-end align-center">
          <div
            @click="showFacilityCannotBookPastDate = false"
            style="cursor: pointer"
            class="text-center"
          >
            <v-avatar rounded="0" style="width: 24px; height: 24px">
              <v-img :src="BackIconimgSrc" cover></v-img>
            </v-avatar>
          </div>
        </v-col>

        <v-row
          no-gutters
          class="fill-height d-flex align-center justify-center"
          align-content="center"
          justify="center"
        >
          <v-col cols="12" class="text-center justify-center">
            <v-img
              class="text-center justify-center"
              src="/icons/facility-booking/info.svg"
              style="height: 100px"
            ></v-img>
          </v-col>
          <v-col cols="12" class="text-center justify-center pt-6">
            <h3 class="px-3">
              The facility has been removed. Please choose another facility
            </h3>
          </v-col>
        </v-row>

        <v-btn
          size="large"
          color="#EB261E"
          class="mx-4 mb-6 mt-6"
          @click="showFacilityCannotBookPastDate = false"
          >Close</v-btn
        >
      </v-card>
    </v-dialog>

    <v-dialog v-model="inviteVisitorDialog" max-width="500px" persistent>
      <v-card>
        <v-row no-gutters>
          <v-col class="d-flex justify-end pr-2">
            <v-btn
              icon="mdi-close"
              variant="text"
              @click="closeInviteResidentDialog"
            ></v-btn
          ></v-col>
        </v-row>
        <v-row
          no-gutters
          class="fill-height mb-0 pb-0"
          align-content="center"
          justify="center"
        >
          <v-img
            src="/icons/facility-booking/invite-resident-dm.svg"
            style="width: 190px; height: 190px"
          ></v-img>
        </v-row>

        <v-card-title class="mt-0 pt-0 text-center"
          >Invite Visitor</v-card-title
        >
        <v-card-text>
          <v-form ref="form">
            <v-select
              class="mb-3"
              hide-details
              v-model="entryMethod"
              :items="['Drive In', 'Walk In']"
              label="Entry Method"
              placeholder="Select Entry Method"
              required
            >
              <template v-slot:label>
                <span>Entry Method</span><span class="required pl-1">*</span>
              </template></v-select
            >
            <v-text-field
              class="mb-3"
              v-model="email"
              :rules="[validEmail]"
              label="Email"
              required
              hide-details
            >
              <template v-slot:label>
                <span>Email</span><span class="required pl-1">*</span>
              </template></v-text-field
            >
            <v-text-field
              class="mb-3"
              v-model="name"
              label="Name"
              hide-details
              required
            >
              <template v-slot:label>
                <span>Name</span><span class="required pl-1">*</span>
              </template></v-text-field
            >

            <h6 v-if="entryMethod === 'Drive In'" class="text-body-2">
              Will the invited visitor be parking overnight?
            </h6>

            <v-radio-group
              v-model="isOvernightParking"
              row
              class="mb-3"
              v-if="entryMethod === 'Drive In'"
              @change="handleOvernightParkingChange"
            >
              <v-radio label="Yes" :value="true"></v-radio>
              <v-radio label="No" :value="false"></v-radio>
            </v-radio-group>
          </v-form>
        </v-card-text>

        <v-row no-gutters class="px-6 pb-2 mb-2">
          <v-col
            class="pb-2"
            cols="12"
            sm="6"
            md="6"
            lg="6"
            v-if="deleteVisible"
          >
            <v-btn block @click="removeResident" color="#EB261E"
              >Delete</v-btn
            ></v-col
          >
          <v-col
            cols="12"
            :sm="deleteVisible ? '6' : '12'"
            :md="deleteVisible ? '6' : '12'"
            :lg="deleteVisible ? '6' : '12'"
            :class="$vuetify.display.smAndUp ? 'pl-2' : ''"
          >
            <!-- <v-btn
              block
              @click="
                deleteVisible ? updateInvitedResident() : saveInvitedResident()
              "
              color="#EB261E"
              >{{ deleteVisible ? "Update" : "Save" }}</v-btn
            > -->
            <v-btn
              block
              @click="
                deleteVisible ? updateInvitedResident() : saveInvitedResident()
              "
              color="#EB261E"
              :disabled="!isFormValid"
              >{{ deleteVisible ? "Update" : "Save" }}</v-btn
            >
          </v-col>
          <!-- <v-btn block @click="saveInvitedResident" color="#EB261E"
              >Save</v-btn
            ></v-col
          > -->
        </v-row>
      </v-card>
    </v-dialog>

    <v-dialog v-model="overnightParkingShowDialog" max-width="290" persistent>
      <v-card class="pa-1 rounded-lg">
        <v-col cols="12" class="pt-5 py-0">
          <v-card variant="outlined">
            <v-col cols="12">
              <p class="px-3 pb-3">
                Overnight Parking requests outside our below business hours will
                not be guaranteed a response
              </p>
            </v-col>

            <v-row class="pb-3">
              <v-col cols="12" class="mb-0 pb-0 pt-0 mt-0">
                <v-row no-gutters class="pb-2">
                  <v-col
                    cols="12"
                    v-for="(day, name) in settingOvernight"
                    :key="name"
                  >
                    <v-row
                      no-gutters
                      class="d-flex align-center justify-center"
                      v-if="day.isEnabled && day.startTime && day.endTime"
                    >
                      <span class="text-capitalize text-body-2 pb-1"
                        >{{ name }}: {{ day.startTime }} -
                        {{ day.endTime }}</span
                      >
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card></v-col
        >

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="tonal"
            color="green darken-1"
            @click="
              overnightParkingShowDialog = false;
              isOvernightParking = true;
            "
            >Yes</v-btn
          >
          <v-btn
            variant="tonal"
            color="red darken-1"
            @click="
              overnightParkingShowDialog = false;
              isOvernightParking = false;
            "
            >No</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="openDialogAlreadyBooked" persistent max-width="400">
      <v-card class="rounded-lg">
        <v-col cols="12" class="d-flex justify-end align-center">
          <div
            @click="openDialogAlreadyBooked = false"
            style="cursor: pointer"
            class="text-center"
          >
            <v-avatar rounded="0" style="width: 24px; height: 24px">
              <v-img :src="BackIconimgSrc" cover></v-img>
            </v-avatar>
          </div>
        </v-col>

        <v-row
          no-gutters
          class="fill-height d-flex align-center justify-center"
          align-content="center"
          justify="center"
        >
          <v-col cols="12" class="text-center justify-center">
            <v-img
              class="text-center justify-center"
              src="/icons/facility-booking/info.svg"
              style="height: 100px"
            ></v-img>
          </v-col>
          <v-col cols="12" class="text-center justify-center pt-6">
            <h3>You have already booked this slot</h3>

            <v-col
              cols="12"
              v-for="(item, index) in alreadyBookedListData"
              :key="index"
              class="mb-0 pb-0"
            >
              <v-row
                no-gutters
                class="d-flex align-center justify-center ma-0 pa-0"
              >
                <v-avatar
                  rounded="2"
                  size="24"
                  class="text-center justify-center mr-2"
                >
                  <v-img src="/icons/facility-booking/clock.svg"></v-img>
                </v-avatar>
                <v-card-title class="pa-0 ma-0">
                  {{ item.slotName }}</v-card-title
                ></v-row
              >
            </v-col>
          </v-col>
        </v-row>

        <v-btn
          size="large"
          color="#EB261E"
          class="mx-4 mb-6 mt-6"
          @click="openDialogAlreadyBooked = false"
          >Close</v-btn
        >
      </v-card>
    </v-dialog>

    <v-dialog v-model="openDialogWeeklyFound" persistent max-width="400">
      <v-card class="rounded-lg">
        <v-col cols="12" class="d-flex justify-end align-center">
          <div
            @click="openDialogWeeklyFound = false"
            style="cursor: pointer"
            class="text-center"
          >
            <v-avatar rounded="0" style="width: 24px; height: 24px">
              <v-img :src="BackIconimgSrc" cover></v-img>
            </v-avatar>
          </div>
        </v-col>

        <v-row
          no-gutters
          class="fill-height d-flex align-center justify-center"
          align-content="center"
          justify="center"
        >
          <v-col cols="12" class="text-center justify-center">
            <v-img
              class="text-center justify-center"
              src="/icons/facility-booking/info.svg"
              style="height: 100px"
            ></v-img>
          </v-col>
          <v-col cols="12" class="text-center justify-center pt-6">
            <h3 class="px-3 pb-4">
              Booking is temporarily unavailable due to weekly maintenance on
              the following days.
            </h3>
          </v-col>
        </v-row>

        <v-col
          cols="12"
          class="mb-0 pb-0"
          v-for="(maintenanceDate, index) in maintenanceWeeklyData"
          :key="index"
        >
          <v-card class="card-design" color="base" :class="cardDesign">
            <v-row no-gutters>
              <v-col cols="12">
                <v-col cols="12" class="d-flex align-center pl-5">
                  <v-avatar rounded="0" size="24">
                    <v-avatar rounded="0" size="24">
                      <v-img :src="calendarImgSrc"></v-img>
                    </v-avatar>
                  </v-avatar>
                  <v-card-title class="list-text pt-3">
                    {{ maintenanceDate }}
                  </v-card-title>
                </v-col>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-btn
          size="large"
          color="#EB261E"
          class="mx-4 mb-6 mt-6"
          @click="openDialogWeeklyFound = false"
          >Close</v-btn
        >
      </v-card>
    </v-dialog>

    <v-dialog v-model="openDialogMonthlyFound" persistent max-width="400">
      <v-card class="rounded-lg">
        <v-col cols="12" class="d-flex justify-end align-center">
          <div
            @click="openDialogMonthlyFound = false"
            style="cursor: pointer"
            class="text-center"
          >
            <v-avatar rounded="0" style="width: 24px; height: 24px">
              <v-img :src="BackIconimgSrc" cover></v-img>
            </v-avatar>
          </div>
        </v-col>

        <v-row
          no-gutters
          class="fill-height d-flex align-center justify-center"
          align-content="center"
          justify="center"
        >
          <v-col cols="12" class="text-center justify-center">
            <v-img
              class="text-center justify-center"
              src="/icons/facility-booking/info.svg"
              style="height: 100px"
            ></v-img>
          </v-col>
          <v-col cols="12" class="text-center justify-center pt-6">
            <h3 class="px-3 pb-4">
              Booking is temporarily unavailable due to monthly maintenance on
              the following days.
            </h3>
          </v-col>
        </v-row>

        <v-col
          cols="12"
          class="mb-0 pb-0"
          v-for="(chunk, chunkIndex) in chunkedMaintenanceMonthlyData"
          :key="'chunk-' + chunkIndex"
        >
          <v-card class="card-design" color="" :class="cardDesign">
            <v-row no-gutters>
              <v-col
                cols="12"
                class="d-flex align-center pa-0 ma-0"
                style="width: 20px"
              >
                <v-col
                  :cols="maintenanceDate === 'Last day' ? 'auto' : '2'"
                  class="d-flex align-center px-0 pl-2"
                  v-for="(maintenanceDate, index) in chunk"
                  :key="'date-' + index"
                >
                  <v-avatar
                    color="red"
                    class=""
                    v-if="maintenanceDate !== 'Last day'"
                  >
                    {{ maintenanceDate }}
                  </v-avatar>
                  <v-chip v-else color="red" variant="flat" class="py-5">
                    {{ maintenanceDate }}
                  </v-chip>
                </v-col>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-btn
          size="large"
          color="#EB261E"
          class="mx-4 mb-6 mt-6"
          @click="openDialogMonthlyFound = false"
          >Close</v-btn
        >
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});
const { theme } = useLocal();
const { currentUser } = useLocalAuth();
import phoneCode from "./phone-code.json";
import moment from "moment-timezone";

const { requiredInput, formatDateAndTimeORIG, validEmail, standardFormatDate } =
  useUtils();

const {
  getFacilitiesByPageSearch,
  facility,
  facilities,
  pageRange,
  nextPage,
  prevPage,
  canNextPage,
  canPrevPage,
  createBooking,
  getBookingSlot,
  getFacilitiesSetting,
} = useFacility();

const { getBookingVacantSlot } = useFacilityBookings();
const { addVisitorResident, getOvernightSetting } = useVisitor();

const prefix = ref(null);

const { setSnackbar } = useLocal();
const prefixes = phoneCode;
const menu = ref<boolean>(false);

const bookDate = ref<any>(null);
const arrivalTime = ref("");
const duration = ref<any>("");
const dialog = ref<boolean>(false);
const confirmDialog = ref<boolean>(false);
const confirmDialogTakenSlot = ref<boolean>(false);
const bookedTakenSlot = ref(null);

const showDialog = ref<boolean>(false);
const showDialogMaintenance = ref<boolean>(false);
const showFacilityNotFound = ref<boolean>(false);
const showBookingHoursNotStarted = ref<boolean>(false);
const showFacilityCannotBookPastDate = ref<boolean>(false);
const responseData = ref({});
const messageForBookPastAndDate = ref<string>("");
const isOvernightParking = ref<boolean>(false);

const selectedCards = ref<{ _id: string; slot: string }[]>([]);
const selectedCard = ref(null);
const form = ref(null);
const valid = ref(true);
const route = useRoute();
const openDialogAlreadyBooked = ref<boolean>(false);
const openDialogMonthlyFound = ref<boolean>(false);
const openDialogWeeklyFound = ref<boolean>(false);
const maintenanceWeeklyData = ref<any>([]);
const maintenanceMonthlyData = ref<any>([]);

const alreadyBookedListData = ref<any>([]);

//invite visitor
const inviteVisitorDialog = ref<boolean>(false);
const entryMethod = ref<string>("Walk In");
const email = ref<string>("");
const name = ref<string>("");
const plateNumber = ref<string>("");
const invitedResidents = ref<any>([]);
const currentIndex = ref<number>(0);
const deleteVisible = ref<boolean>(false);
const isFormValid = ref<boolean>(false);

const overnightParkingShowDialog = ref<boolean>(false);
const hasShownOvernightParkingDialog = ref(false);
const settingOvernight = ref<any>([]);

const handleOvernightParkingChange = (value) => {
  const hasOvernightParking = invitedResidents.value.some(
    (resident) => resident.isOvernightParking,
  );

  if (!settingOvernight?.value) {
    settingOvernight.value = {};
  }

  if (
    Object.values(settingOvernight.value).some(
      (day: any) => day.isEnabled && day.startTime && day.endTime,
    )
  ) {
    if (hasOvernightParking) {
      overnightParkingShowDialog.value = false;
      hasShownOvernightParkingDialog.value = false;
    } else {
      overnightParkingShowDialog.value = true;
      hasShownOvernightParkingDialog.value = false;
    }
  } else {
    if (hasOvernightParking) {
      hasShownOvernightParkingDialog.value = false;
    } else {
      hasShownOvernightParkingDialog.value = false;
    }
  }
};

const loading = ref(true);
const setting = ref<any>([]);

const chunkedMaintenanceMonthlyData = computed(() => {
  const chunkSize = 6;
  const array = maintenanceMonthlyData.value;
  return Array(Math.ceil(array.length / chunkSize))
    .fill()
    .map((_, index) => index * chunkSize)
    .map((begin) => array.slice(begin, begin + chunkSize));
});

const id = ref("");

const daySelected = ref(null);

const selectCard = (card: any) => {
  if (
    selectedCards.value.some(
      (selectedCard: any) => selectedCard._id === card._id,
    )
  ) {
    selectedCards.value = selectedCards.value.filter(
      (selectedCard: any) => selectedCard._id !== card._id,
    );
  } else if (selectedCards.value.length < 3) {
    selectedCards.value.push(card);
  }
};

watch([email, name], () => {
  isFormValid.value =
    email.value !== "" &&
    validEmail(email.value) === true &&
    name.value !== "" &&
    entryMethod.value !== "";
});

const allowedDates = (date: any) => {
  const dateObj = new Date(date);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const dayOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ][dateObj.getDay()];

  const dayData = facility.value[dayOfWeek];

  const isAllowed = dayData.isEnabled && dayData.timeSlots.length > 0;

  // Check if the day of the week is a maintenance day
  const isMaintenanceDay = facility?.value?.maintenanceWeekly?.includes(
    dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
  );

  // Check if the date is a maintenance day
  const isMaintenanceDayMonth = facility?.value?.maintenanceMonthly?.some(
    (day: any) => {
      if (day === "Last day") {
        // Check if the date is the last day of the month
        return (
          new Date(
            dateObj.getFullYear(),
            dateObj.getMonth() + 1,
            0,
          ).getDate() === dateObj.getDate()
        );
      } else {
        return dateObj.getDate() === day;
      }
    },
  );
  // check if the date is a maintenance date
  const isMaintenanceDate = facility?.value?.maintenanceDates?.some(
    (dateString: any) => {
      const maintenanceDate = new Date(dateString);
      return (
        maintenanceDate.getDate() === dateObj.getDate() &&
        maintenanceDate.getMonth() === dateObj.getMonth() &&
        maintenanceDate.getFullYear() === dateObj.getFullYear()
      );
    },
  );

  const diffInDays = Math.ceil(
    (dateObj.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Check if the date is within the next 30 days
  const isWithinAdvanceBookingDays =
    diffInDays >= 0 && diffInDays <= facility.value.advanceBookingDays;

  return (
    isAllowed &&
    !isMaintenanceDay &&
    !isMaintenanceDayMonth &&
    !isMaintenanceDate
  );
};

const maxDate = computed(() => {
  const currentDate = new Date();
  currentDate.setDate(
    currentDate.getDate() + (facility.value.advanceBookingDays || 30),
  );
  return currentDate.toISOString().split("T")[0];
});

const selectedTimesArray = ref([]);
const selectedTimes = computed(() => {
  selectedTimesArray.value = [];
  const times = selectedCards.value
    .map((card: any) => {
      selectedTimesArray.value.push(card.slot);
      return card.slot;
    })
    .join(", ");

  return times;
});

const primaryPhoneWithoutPrefix = computed(() => {
  const parts = currentUser.value.primaryPhone.split(" ");
  return parts.length > 1 ? parts[1] : "";
});

// const maxDate = computed(() => {
//   const now = new Date();
//   const daysToAdd = 365;
//   now.setDate(now.getDate() + daysToAdd);
//   return now.toISOString().substr(0, 10);
// });

const formattedDate = computed(() => {
  let today = "";

  if (
    !bookDate.value ||
    (today && new Date(bookDate.value) <= new Date(today))
  ) {
    return today;
  }

  const bookDateConverted = new Date(bookDate.value);
  bookDateConverted.setMinutes(
    bookDateConverted.getMinutes() +
      bookDateConverted.getTimezoneOffset() +
      8 * 60,
  ); // Adjust to SGT

  return formatDate(bookDateConverted);
});

const limitInput = () => {
  if (duration.value.length > 2) {
    duration.value = duration.value.slice(0, 2);
  }
};

function formatDate(date: any) {
  return `${pad(date.getDate())}/${pad(
    date.getMonth() + 1,
  )}/${date.getFullYear()}`;
}

function pad(number: any) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}

function isDateDisabled(date: any) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date < yesterday;
}
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().substr(0, 10);
});
const customFormat = (value: any) => {
  if (!value) return null;
  const [year, month, day] = value.split("-");
  return `${pad(month)}/${pad(day)}/${year}`;
};

const onDateSelected = <T,>(value: T) => {
  const date = new Date(value as unknown as string);
  const dayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][date.getDay()];

  daySelected.value = dayOfWeek.toLowerCase();

  bookDate.value = value as any;
  menu.value = false;

  selectedCards.value = [];
};

onMounted(async () => {
  id.value = useRoute().params.id as string;

  if (!theme.value) theme.value = "light";
  prefix.value = phoneCode.find((p) => p.country === "Singapore");

  const result: any = await getFacilitiesByPageSearch({
    sites: [String(currentUser.value.site)],
    _id: route.params.id as string,
  });

  if (result.items.length > 0) {
    facility.value = result.items[0];
    localStorage.setItem("facility", JSON.stringify(facility.value));
  }
  setting.value = await getFacilitiesSetting({ site: currentUser.value.site });
  settingOvernight.value = await getOvernightSetting({
    site: currentUser.value.site,
  });

  loading.value = false;
});

async function sendInvite() {}

const timeSlots = ref([]);
const maintenanceDates = ref([]);

async function selectSlot() {
  selectedCards.value = [];
  try {
    if (
      Array.isArray(facility.value[daySelected.value].timeSlots) &&
      facility.value[daySelected.value].timeSlots.length > 0
    ) {
      const timeSlotsFuture: any = [];
      facility.value[daySelected.value].timeSlots.forEach((item: any) => {
        let date = moment(bookDate.value);
        const startTime = item.slot.split("-")[0].trim();
        const siteDateCurrentDateTime = moment.tz("Asia/Singapore");
        const [hours, minutes] = startTime.split(":").map(Number);
        date = date.add(hours, "hours").add(minutes, "minutes");
        const siteDate = date.clone().tz("Asia/Singapore");
        if (siteDate.isAfter(siteDateCurrentDateTime)) {
          timeSlotsFuture.push(item);
        }
      });

      timeSlots.value = await getBookingVacantSlot({
        facility: facility.value._id,
        date: bookDate.value,
        site: currentUser.value.site,
      });

      if (timeSlots.value.facilityNotFound) {
        showFacilityNotFound.value = true;
      }
    }
  } catch (error) {}
  showDialog.value = true;
}

async function confirmBooking() {
  let responseBooking: any = null;
  let invites: any = [];
  invitedResidents.value.forEach((item: any) => {
    let isOvernightParking =
      item.entryMethod === "Walk In" ? null : item.isOvernightParking;
    invites.push({
      email: item.email,
      name: item.name,
      isOvernightParking,
    });
  });

  try {
    responseBooking = await createBooking({
      facility: facility.value._id as string,
      timeSlots: selectedCards.value.map((timeSlot: any) => timeSlot) as {
        _id: string;
        slot: string;
      }[],
      user: currentUser.value._id,
      date: bookDate.value,
      pax: Number(duration.value),
      site: currentUser.value.site,
      invites,
    });

    dialog.value = false;

    if (responseBooking?.maintenanceWeeklyFound) {
      maintenanceWeeklyData.value =
        responseBooking.maintenanceWeeklyFound.maintenanceWeekly;
      openDialogWeeklyFound.value = true;
    } else if (responseBooking?.maintenanceMonthlyFound) {
      openDialogMonthlyFound.value = true;
      maintenanceMonthlyData.value =
        responseBooking.maintenanceMonthlyFound.maintenanceMonthly;
      maintenanceMonthlyData.value = maintenanceMonthlyData.value.map(
        (item: string | number) => putOrdinalSuffix(item),
      );

      maintenanceMonthlyData.value.sort((a, b) => {
        if (a === "Last day") return 1;
        if (b === "Last day") return -1;
        return parseInt(a) - parseInt(b);
      });
    } else if (responseBooking?.youAlreadyBooked) {
      alreadyBookedListData.value = responseBooking.youAlreadyBooked;
      openDialogAlreadyBooked.value = true;
    } else if (responseBooking?.bookingHoursNotStarted) {
      responseData.value = responseBooking;

      showBookingHoursNotStarted.value = true;
    } else if (responseBooking?.facilityNotFound) {
      showFacilityNotFound.value = true;
    } else if (responseBooking?.maintenanceDatesFound) {
      showDialogMaintenance.value = true;

      maintenanceDates.value =
        responseBooking.maintenanceDatesFound.maintenanceDates;
    } else if (responseBooking?.insertedIds) {
      confirmDialog.value = true;
      bookDate.value = null;
      selectedCards.value = [];
      duration.value = null;
      selectedTimesArray.value = [];
    } else if (
      Array.isArray(responseBooking?.bookedSlots) &&
      responseBooking?.bookedSlots.length > 0
    ) {
      bookedTakenSlot.value = responseBooking.bookedSlots;
      confirmDialogTakenSlot.value = true;
    } else {
      const bookingIds = responseBooking?.map((item: any) => item._id);

      const selectedDaySlots = facility.value[daySelected.value].timeSlots;

      const matchedSlots = selectedDaySlots?.filter((slot: any) =>
        bookingIds?.includes(slot._id),
      );

      confirmDialogTakenSlot.value = true;
    }

    invitedResidents.value = [];
    deleteVisible.value = false;

    useRouter().push({
      name: "resident-facility-booking",
      query: { tabBooked: 2 },
    });
  } catch (error) {
    dialog.value = false;
    messageForBookPastAndDate.value = error as string;
    showFacilityNotFound.value = true;
  }
}

function goBack() {
  useRouter().push({
    name: "resident-facility-booking-id",
    params: { id: id.value },
  });
}

function goBackToFacility() {
  useRouter().push({
    name: "resident-facility-booking",
  });
  showFacilityNotFound.value = false;
}

const updateInvitedResident = () => {
  const residentToUpdate = invitedResidents.value[currentIndex.value];
  residentToUpdate.entryMethod = entryMethod.value;
  residentToUpdate.email = email.value;
  residentToUpdate.name = name.value;
  residentToUpdate.isOvernightParking = isOvernightParking.value;

  entryMethod.value = "";
  email.value = "";
  name.value = "";

  currentIndex.value = 0;
  entryMethod.value = "Walk In";
  inviteVisitorDialog.value = false;
  isOvernightParking.value = false;
  deleteVisible.value = false;
};

const saveInvitedResident = () => {
  invitedResidents.value.push({
    entryMethod: entryMethod.value,
    email: email.value,
    name: name.value,
    isOvernightParking: isOvernightParking.value,
  });
  entryMethod.value = "Walk In";
  email.value = "";
  name.value = "";
  currentIndex.value = 0;
  isOvernightParking.value = false;
  inviteVisitorDialog.value = false;
};

const closeInviteResidentDialog = () => {
  inviteVisitorDialog.value = false;
  entryMethod.value = "";
  email.value = "";
  name.value = "";
  plateNumber.value = "";
  currentIndex.value = 0;
  deleteVisible.value = false;
  isOvernightParking.value = false;
  entryMethod.value = "Walk In";
};

const removeResident = () => {
  invitedResidents.value.splice(currentIndex.value, 1);
  entryMethod.value = "";
  email.value = "";
  name.value = "";
  plateNumber.value = "";
  currentIndex.value = 0;
  inviteVisitorDialog.value = false;
  deleteVisible.value = false;
  isOvernightParking.value = false;
  entryMethod.value = "Walk In";
};

const viewInvitedResident = (index: any) => {
  const resident = invitedResidents.value[index];
  entryMethod.value = resident.entryMethod;
  email.value = resident.email;
  name.value = resident.name;
  isOvernightParking.value = resident.isOvernightParking;
  plateNumber.value = resident.plateNumber;
  currentIndex.value = index;
  inviteVisitorDialog.value = true;
  deleteVisible.value = true;
};

const putOrdinalSuffix = (item: string | number) => {
  if (typeof item === "number") {
    const lastDigit = item % 10;
    const lastTwoDigits = item % 100;
    if (lastDigit == 1 && lastTwoDigits != 11) {
      return item + "st";
    }
    if (lastDigit == 2 && lastTwoDigits != 12) {
      return item + "nd";
    }
    if (lastDigit == 3 && lastTwoDigits != 13) {
      return item + "rd";
    }
    return item + "th";
  }
  return item; // If item is not a number, return it as is
};
// checking for the business hours
const hasEnabledDays = computed(() =>
  setting?.value
    ? Object.values(setting.value).some(
        (day) => day.isEnabled && day.startTime && day.endTime,
      )
    : false,
);

const baseColor = computed(() =>
  theme.value === "dark" ? "#FAFAFAFA" : "#111723",
);

const bgColor = computed(() =>
  theme.value === "dark" ? "#111723" : "#FAFAFAFA",
);

const calendarImgSrc = computed(() =>
  theme.value === "dark"
    ? "/dark-mode/invite-visitor/calendar-dark.svg"
    : "/dark-mode/invite-visitor/calendar-light.svg",
);

const BackIconimgSrc = computed(() =>
  theme.value === "dark"
    ? "/dark-mode/forgot-password/images/back.svg"
    : "/dark-mode/forgot-password/images/back-light.svg",
);

const cardDesign = computed(() =>
  theme.value === "dark" ? "card-design" : "card-design-light",
);
</script>

<style scoped>
.header {
  font-size: 16px;
  line-height: 24px;
}
.title {
  font-size: 20px;
  line-height: 32px;
}
.text-area {
  border-radius: 4px;
  border: 1px solid var(--black-012, rgba(0, 0, 0, 0.12));
}
.menu-icon {
  width: 36.711px;
  height: 36.711px;
}

.input-field {
  border-radius: 4px;
  border: 1px solid var(--black-012, rgba(0, 0, 0, 0.12));
}
.grey-field {
  pointer-events: none;
}

.text-successful {
  text-align: center;
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;
}

.box-shadow {
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
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

.text-dialog {
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px; /* 160% */
}

.required {
  color: red;
  font-size: 16px;
}

:deep() .v-date-picker-table .v-btn--disabled {
  color: rgb(214, 0, 0) !important;
}

.list-text {
  text-align: right;
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}
</style>
