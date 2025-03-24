<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="isAnnouncementLoaded"
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
                  :items="announcements"
                  :items-per-page="itemsPerPage"
                  :search="search"
                >
                  <template v-slot:header>
                    <v-row no-gutters class="pa-4 fill-height" align="center">
                      <v-col cols="12" class="mb-4">
                        <v-row>
                          <v-col cols="12">
                            <span class="font-weight-bold text-h6">
                              Bulletin Board
                            </span>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col cols="12" md="5" class="mr-2 mb-4 mb-md-0">
                        <v-text-field
                          v-model="search"
                          placeholder="Search"
                          hide-details
                          density="compact"
                          append-inner-icon="mdi-magnify"
                        ></v-text-field>
                      </v-col>

                      <v-spacer></v-spacer>

                      <v-col cols="12" md="2" sm="4" class="mb-3 mb-sm-0">
                        <v-btn
                          flat
                          variant="outlined"
                          append-inner-icon="mdi-calendar"
                          @click="dateDialog = true"
                        >
                          filter by dates
                        </v-btn>
                      </v-col>
                      <v-dialog v-model="dateDialog" max-width="355">
                        <v-card>
                          <v-toolbar>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="grey-darken-1"
                              icon="mdi-close"
                              @click="dateDialog = false"
                            ></v-btn>
                          </v-toolbar>

                          <v-divider></v-divider>
                          <v-card-subtitle>
                            <v-date-picker
                              width="320"
                              v-model="date"
                              :locale="locale"
                              multiple
                            ></v-date-picker>
                          </v-card-subtitle>
                          <v-card-action>
                            <v-btn
                              color="blue-darken-3"
                              block
                              tile
                              @click="updateFilter"
                              :loading="isApplyingFilterByDates"
                            >
                              Apply
                            </v-btn>
                          </v-card-action>
                        </v-card>
                      </v-dialog>

                      <!-- <v-col
                        cols="12"
                        md="2"
                        sm="4"
                        class="mb-3 mb-sm-0 ml-sm-4"
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

                      <v-spacer></v-spacer> -->
                      <v-col cols="12" md="2" sm="3" class="pl-md-3">
                        <v-row class="d-flex justify-end">
                          <v-col cols="12" md="12">
                            <v-btn
                              color="blue-darken-3"
                              block
                              variant="flat"
                              size="small"
                              style="height: 40px"
                              @click="addAnnouncement"
                              ><v-icon>mdi-plus</v-icon>
                              Bulletin Board
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>

                      <!-- tabs -->
                      <v-col cols="12" class="mt-5 mb-10">
                        <v-row no-gutters>
                          <v-col
                            cols="6"
                            md="4"
                            class="text-center font-weight-bold text-capitalize"
                            @click="switchTab('active-upcoming')"
                            style="cursor: pointer; font-size: 16px"
                          >
                            active/upcoming
                            <v-divider
                              class="mt-2"
                              thickness="5"
                              v-if="tab === 'active-upcoming'"
                            ></v-divider>
                          </v-col>
                          <v-col
                            cols="6"
                            md="4"
                            class="text-center font-weight-bold text-capitalize"
                            @click="switchTab('expired')"
                            style="cursor: pointer; font-size: 16px"
                          >
                            expired
                            <v-divider
                              class="mt-2"
                              thickness="5"
                              v-if="tab === 'expired'"
                            ></v-divider>
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
                            <v-col cols="6">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Title
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Date Created
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Start Date/End Date
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="1">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  No Expiration
                                </span>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                    </v-list>
                  </template>

                  <template #default="{ items }">
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="itemIndex"
                      >
                        <v-list-item class="pt-2 pb-1 px-8">
                          <v-list-item-title>
                            <v-row no-gutters>
                              <v-col
                                cols="12"
                                sm="6"
                                md="6"
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
                                    class="d-inline-block text-truncate text-body-2"
                                  >
                                    <v-icon class="mr-1" color="red">
                                      mdi-bullhorn-outline
                                    </v-icon>
                                    {{ item.raw.title }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="2"
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
                                  <span class="d-inline-block text-body-2">
                                    <v-icon class="mr-1" color="green">
                                      mdi-calendar-range
                                    </v-icon>
                                    {{
                                      standardFormatDate(
                                        new Date(item.raw.createdAt),
                                      )
                                    }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="2"
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
                                  <span class="d-inline-block text-body-2">
                                    <div>
                                      <v-icon class="mr-1" color="success">
                                        mdi-calendar-clock-outline
                                      </v-icon>
                                      {{
                                        standardFormatDate(
                                          new Date(item.raw.startDate),
                                        )
                                      }}
                                    </div>
                                    <div>
                                      <v-icon class="mr-1" color="error">
                                        mdi-calendar-clock-outline
                                      </v-icon>
                                      {{
                                        standardFormatDate(
                                          new Date(item.raw.endDate),
                                        )
                                      }}
                                    </div>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="2"
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
                                    class="d-inline-block text-capitalize text-body-2"
                                  >
                                    <v-chip
                                      size="small"
                                      class="text-white"
                                      :style="`background-color: ${
                                        item.raw.noExpiration
                                          ? '#4CAF50'
                                          : '#F44336'
                                      }`"
                                    >
                                      {{ item.raw.noExpiration ? "Yes" : "No" }}
                                    </v-chip>
                                  </span>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-list-item-title>

                          <template v-slot:append>
                            <v-menu location="bottom">
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  icon
                                  flat
                                  size="x-small"
                                  class="border-md"
                                  style="position: absolute; right: 20px"
                                >
                                  <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                              </template>

                              <v-card>
                                <v-list density="compact" class="pa-0">
                                  <v-list-item
                                    class="text-caption"
                                    @click="viewAnnouncement(item.raw)"
                                  >
                                    View
                                  </v-list-item>
                                  <v-list-item
                                    class="text-caption"
                                    @click="editAnnouncement(item.raw)"
                                  >
                                    Edit
                                  </v-list-item>
                                  <v-list-item
                                    class="text-caption"
                                    @click="deleteAnnouncement(item.raw)"
                                  >
                                    Delete
                                  </v-list-item>
                                </v-list>
                              </v-card>
                            </v-menu>
                          </template>
                        </v-list-item>

                        <v-divider v-if="itemIndex + 1 !== items.length" />
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
                            You don't have any announcement yet.
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
                @click="onPreviousPage()"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="!canNextPage"
                @click="onNextPage()"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>

  <AnnouncementsAdd />
  <AnnouncementsDelete />
  <AnnouncementsEdit />
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";
import moment from "moment-timezone";

definePageMeta({
  middleware: "secure",
});

const { standardFormatDate } = useUtils();

const {
  tab,
  isAnnouncementLoaded,
  setAnnouncement,
  setAnnouncements,
  announcements,
  itemsPerPage,

  search,

  page,
  pageRange,
  canNextPage,
  nextPage,
  canPrevPage,
  prevPage,
  searchAnnouncements,
  addAnnouncementDialog,
  deleteAnnouncementDialog,
  editAnnouncementDialog,
  date,
  dates,
} = useAnnouncement();
const { mySite } = useFilter();

const locale = "en";

const dateDialog = ref(false);

const isApplyingFilterByDates = ref(false);

onMounted(async () => {
  page.value = 1;

  setAnnouncement();
  announcements.value = [];
  date.value = [];
  dates.value = JSON.parse(
    JSON.stringify(
      date.value.map((dateString: any) => {
        return moment
          .tz(moment(dateString, "DD/MM/YYYY"), "Asia/Singapore")
          .toDate();
      }),
    ),
  );
  await setAnnouncements({
    site: mySite.value!,
    dates: dates.value,
    tab: tab.value,
  });
});

watch(search, (newValue: string) => {
  debouncedSearch(newValue);
});

const debouncedSearch = debounce(async (value: string) => {
  dates.value = JSON.parse(
    JSON.stringify(
      date.value.map((dateString: any) => {
        return moment
          .tz(moment(dateString, "DD/MM/YYYY"), "Asia/Singapore")
          .toDate();
      }),
    ),
  );
  await searchAnnouncements({
    search: value,
    site: mySite.value!,
    dates: dates.value,
    tab: tab.value,
  });
}, 500);

async function switchTab(Tab: string) {
  tab.value = Tab;
  search.value = "";
  dates.value = [];
  date.value = tab.value == "active-upcoming" ? [new Date()] : [];

  dates.value = JSON.parse(
    JSON.stringify(
      date.value.map((dateString: any) => {
        return moment
          .tz(moment(dateString, "DD/MM/YYYY"), "Asia/Singapore")
          .toDate();
      }),
    ),
  );

  await setAnnouncements({
    search: search.value,
    site: mySite.value!,
    dates: dates.value,
    tab: tab.value,
  });
}

async function updateFilter() {
  if (dateDialog.value) {
    isApplyingFilterByDates.value = true;
  }

  dates.value = JSON.parse(
    JSON.stringify(
      date.value.map((dateString: any) => {
        return moment
          .tz(moment(dateString, "DD/MM/YYYY"), "Asia/Singapore")
          .toDate();
      }),
    ),
  );

  await setAnnouncements({
    search: search.value,
    site: mySite.value!,
    dates: dates.value,
    tab: tab.value,
  });

  if (dateDialog.value) {
    isApplyingFilterByDates.value = false;
    dateDialog.value = false;
  }
}

function addAnnouncement() {
  addAnnouncementDialog.value = true;
  setAnnouncement();
}

async function viewAnnouncement(data: TAnnouncement) {
  addAnnouncementDialog.value = true;
  setAnnouncement(data);
}

async function editAnnouncement(data: TAnnouncement) {
  editAnnouncementDialog.value = true;
  setAnnouncement(data);
}

async function deleteAnnouncement(data: TAnnouncement) {
  deleteAnnouncementDialog.value = true;
  setAnnouncement(data);
}

async function onNextPage() {
  announcements.value = [];
  dates.value = JSON.parse(
    JSON.stringify(
      date.value.map((dateString: any) => {
        return moment
          .tz(moment(dateString, "DD/MM/YYYY"), "Asia/Singapore")
          .toDate();
      }),
    ),
  );
  await nextPage({
    search: search.value,
    site: mySite.value!,
    dates: dates.value,
    tab: tab.value,
  });
}

async function onPreviousPage() {
  announcements.value = [];
  dates.value = JSON.parse(
    JSON.stringify(
      date.value.map((dateString: any) => {
        return moment
          .tz(moment(dateString, "DD/MM/YYYY"), "Asia/Singapore")
          .toDate();
      }),
    ),
  );
  await prevPage({
    search: search.value,
    site: mySite.value!,
    dates: dates.value,
    tab: tab.value,
  });
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

.overridePicker {
  width: 18px;
}
</style>
