<template>
  <v-row no-gutters class="pa-4" id="bookings">
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
                  :items-per-page="facilityBookings.length"
                >
                  <template v-slot:header>
                    <v-row no-gutters class="pa-4">
                      <v-col cols="12" md="4">
                        <v-row align="center">
                          <v-col cols="12">
                            <span
                              class="font-weight-bold text-capitalize text-h6"
                            >
                              facility bookings - {{ tab }} ({{
                                facilityBookings.length
                              }})
                            </span>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-row class="d-flex justify-center">
                          <!-- from -->
                          <v-col cols="12" md="6">
                            FROM: {{ standardFormatDate(startDate) }}
                          </v-col>

                          <!-- to -->
                          <v-col cols="12" md="6">
                            TO: {{ standardFormatDate(endDate) }}
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <!-- header -->
                    <v-list class="pa-0" density="compact">
                      <v-list-item class="pt-10 px-8">
                        <v-list-item-title>
                          <v-row no-gutters>
                            <v-col
                              cols="12"
                              md="1"
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
                              md="1"
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
                              cols="12"
                              md="1"
                              :class="`text my-${
                                !$vuetify.display.mdAndUp ? '3' : '1'
                              }`"
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
                              cols="12"
                              md="1"
                              :class="`text my-${
                                !$vuetify.display.mdAndUp ? '3' : '1'
                              }`"
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
                              cols="12"
                              md="1"
                              :class="`text text-capitalize ${
                                !$vuetify.display.mdAndUp && 'mb-3'
                              }`"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
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
                              :class="`text text-capitalize ${
                                !$vuetify.display.mdAndUp && 'mb-3'
                              }`"
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
                              md="1"
                              :class="`text text-capitalize ${
                                !$vuetify.display.mdAndUp && 'mb-3'
                              }`"
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
                        <v-list-item class="py-4 px-8">
                          <template #default>
                            <v-list-item-title>
                              <v-row no-gutters>
                                <v-col cols="12" md="1" class="text my-1">
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      class="d-inline-block text-truncate text-capitalize text-body-2"
                                    >
                                      {{
                                        standardFormatDateTime(
                                          item.raw.createdAt,
                                        )
                                      }}
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
                                      class="d-inline-block text-truncate text-capitalize text-body-2"
                                    >
                                      <v-row no-gutters>
                                        <div>
                                          {{ item.raw.userGivenName }}
                                          {{ item.raw.userSurname }}
                                        </div>
                                        <div class="text-caption text-grey">
                                          {{
                                            `${item.raw.userBlockName} ${item.raw.userLevelName} ${item.raw.userBlockName}`
                                          }}
                                        </div>
                                      </v-row>
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col cols="12" md="1" class="text my-1">
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span class="d-inline-block text-body-2">
                                      {{ standardFormatDate(item.raw.date) }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col cols="12" md="1" class="text my-1">
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span class="d-inline-block text-body-2">
                                      {{ item.raw.slotName }}
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
                                      class="d-flex align-center text-body-2"
                                    >
                                      {{ item.raw.pax }}
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
                                      class="d-flex align-center text-body-2"
                                    >
                                      {{
                                        Array.isArray(item.raw.invites)
                                          ? item.raw.invites.length
                                          : 0
                                      }}
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
                                      class="d-flex align-center text-truncate text-capitalize text-body-2"
                                    >
                                      {{ item.raw.facilityName }}
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
                                      class="d-flex align-center text-body-2"
                                    >
                                      {{ item.raw.status }}
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
        </v-row>
      </v-card>
    </v-col>
  </v-row>

  <!-- exporting as pdf loading dialog -->
  <v-dialog v-model="isExportingPdf" max-width="320" persistent>
    <v-list class="py-2" color="primary" elevation="12" rounded="lg">
      <v-list-item prepend-icon="mdi-file-pdf-box" title="Exporting...">
        <template v-slot:prepend>
          <div class="pe-4">
            <v-icon color="error" size="x-large"></v-icon>
          </div>
        </template>

        <template v-slot:append>
          <v-progress-circular
            color="primary"
            indeterminate="disable-shrink"
            size="25"
            width="3"
          ></v-progress-circular>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "plain",
});

import moment from "moment-timezone";
import { jsPDF } from "jspdf";

const {
  materialColors,
  getInitial,
  standardFormatDate,
  standardFormatDateTime,
} = useUtils();

const { setSnackbar } = useLocal();

const { setFacilityBookings, facilityBookings, isFacilityBookingsLoaded } =
  useFacilityBookings();

const isExportingPdf = ref(false);
const site = ref(localStorage.getItem("site") as string);
const search = ref(localStorage.getItem("search") as string);
const tab = ref(localStorage.getItem("tab") as string);
const startDate = ref(localStorage.getItem("startDate") as string);
const endDate = ref(localStorage.getItem("endDate") as string);

const from = ref(localStorage.getItem("from") as string);
const to = ref(localStorage.getItem("to") as string);

onMounted(async () => {
  await setFacilityBookings({
    search: search.value,
    site: site.value,
    dataType: tab.value,
    limit: 0,
    date: {
      start: moment
        .tz(
          moment(new Date(startDate.value), "DD/MM/YYYY").startOf("day"),
          "Asia/Singapore",
        )
        .toDate(),
      end: moment
        .tz(
          moment(new Date(endDate.value), "DD/MM/YYYY").endOf("day"),
          "Asia/Singapore",
        )
        .toDate(),
    },
  });

  await onExportAsPdf();
});

async function onExportAsPdf() {
  isExportingPdf.value = true;
  try {
    const doc = new jsPDF("p", "pt", "a4");

    await doc.html(document.querySelector("#bookings"), {
      callback: function (pdf: any) {
        pdf.save(
          `FACILITY BOOKINGS - ${tab.value !== "histories" ? "BOOKED" : "HISTORY"} - ${from.value + " - " + to.value}.pdf`,
        );
      },
      x: 0,
      y: 0,
      html2canvas: { scale: 0.48 },
    });
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }

  isExportingPdf.value = false;
}
</script>

<style scoped>
.title {
  font-size: 20px;
  line-height: 32px;
  color: #052439;
}
</style>
