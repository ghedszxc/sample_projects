<template>
  <v-row no-gutters>
    <!-- go back -->
    <v-col
      cols="6"
      :class="`mt-6 ${$vuetify.display.smAndUp ? 'px-6' : 'px-3'}`"
      @click="goBack()"
    >
      <v-icon start size="x-large" style="position: relative; right: 5px">
        <v-img
          class="pl-0 ml-0 mt-2"
          src="/dark-mode/utility-all/right-arrow.svg"
          cover
        ></v-img>
      </v-icon>
      <span style="position: relative; right: 15px"> My Visitor </span>
    </v-col>

    <!-- tabs-->
    <v-col
      cols="12"
      :class="`mt-8 ${$vuetify.display.smAndUp ? 'px-6' : 'px-5'}`"
    >
      <v-row no-gutters justify="center">
        <v-col cols="6" :class="tabTitle">
          <v-btn variant="text" @click="guest = 'invitation'">
            Guest Invitation
          </v-btn>
          <v-divider
            class="mt-2"
            thickness="5"
            style="
              color: #e0241c;
              font-size: 14px;
              font-weight: 500;
              line-height: 36px;
            "
            v-if="guest == 'invitation'"
          ></v-divider>
        </v-col>
        <v-col cols="6" :class="tabTitle">
          <v-btn variant="text" @click="guest = 'histories'">
            Guest History
          </v-btn>
          <v-divider
            class="mt-2"
            thickness="5"
            style="
              color: #e0241c;
              font-size: 14px;
              font-weight: 500;
              line-height: 36px;
            "
            v-if="guest == 'histories'"
          ></v-divider>
        </v-col>
      </v-row>
    </v-col>

    <!-- search and date range -->
    <v-col
      cols="12"
      :class="`mt-10 ${$vuetify.display.smAndUp ? 'px-6' : 'px-5'}`"
    >
      <v-row no-gutters justify="center">
        <v-col :cols="$vuetify.display.smAndUp ? '10' : '9'">
          <v-text-field
            v-model="searchInput"
            label="Search name"
            placeholder="Enter name"
            density="comfortable"
            variant="plain"
            hide-details
            :class="searchBox"
            @input="(e: Event) => searchName(e)"
          >
            <template #append-inner>
              <v-img
                src="/icons/resident/home/search.svg"
                class="mt-1"
                style="width: 16px; height: 16px"
              ></v-img>
            </template>
          </v-text-field>
        </v-col>
        <v-spacer></v-spacer>
        <v-col :cols="$vuetify.display.smAndUp ? '1' : '2'">
          <v-menu
            v-model="menu"
            class="mt-15"
            transition="scale-transition"
            offset-y
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                :class="`${dateRangeBox} mb-6`"
                flat
                outlined
                required
                @click="menu = true"
              >
                <v-img
                  src="/icons/resident/home/calendar.svg"
                  style="width: 24px; height: 24px"
                ></v-img>
              </v-btn>
            </template>
            <v-date-picker
              v-model="dates"
              color="#eb261e"
              hide-header
              class="datePicker"
              show-adjacent-months
              show-current
              scrollable
              rounded
              elevation="5"
              @click="save"
            >
              <template v-slot:header="{}"></template>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-col>

    <!-- loading -->

    <v-col
      v-if="loading"
      cols="12"
      :class="`mt-4 ${$vuetify.display.smAndUp ? 'px-6' : 'px-5'}`"
      v-for="i in 5"
      :key="i"
    >
      <v-skeleton-loader type="card"></v-skeleton-loader>
    </v-col>

    <!-- guests -->
    <v-infinite-scroll mode="manual" @load="load" width="100%">
      <template v-for="(group, date) in groupedVisitors" :key="date">
        <div
          v-if="!loading"
          :class="` ${$vuetify.display.smAndUp ? 'px-6' : 'px-5'}`"
        >
          <div class="date-group">
            <div class="text-subtitle-1 pl-3 my-2">{{ date }}</div>
            <template v-for="visitor in group" :key="visitor">
              <nuxt-link
                :to="{
                  name: 'resident-my-visitor-id',
                  params: { id: visitor._id },
                  query: {
                    status: getStatus(visitor),
                    share: guest === 'invitation' ? 'true' : 'false',
                  },
                }"
                class="no-underline"
              >
                <v-card :class="card" flat class="my-4">
                  <v-row no-gutters>
                    <v-col cols="1" class="mr-3 text-capitalize">
                      <v-avatar
                        style="height: 32px; width: 32px"
                        color="#eb261e"
                      >
                        {{ visitor.firstName[0] }}
                      </v-avatar>
                    </v-col>
                    <v-col cols="7" :class="`${visitorName} text-capitalize`">
                      {{ `${visitor.firstName} ${visitor.lastName}` }}
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="3" class="text-end">
                      <v-chip variant="outlined" class="chip">
                        <span class="chip-text text-capitalize">
                          {{
                            visitor.isOvernightParking === null
                              ? "Walk in"
                              : "Drive in"
                          }}
                        </span>
                      </v-chip>
                    </v-col>

                    <v-col cols="12" class="mt-6">
                      <v-card
                        flat
                        class="text-capitalize text-white pa-2"
                        :style="`display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    align-self: stretch;border-radius: 24px;
                    background: ${
                      !['approved', 'rejected'].includes(visitor.status)
                        ? 'var(--standart-theme-warning, #FB8C00);'
                        : visitor.status == 'approved'
                        ? 'var(--standart-theme-success, #4CAF50)'
                        : 'var(--standart-theme-error, #FF5252)'
                    };
                    #FFFFFF
                    `"
                      >
                        {{ getStatus(visitor) }}
                      </v-card>
                    </v-col>

                    <v-col cols="12" class="mt-6">
                      <v-divider></v-divider>
                    </v-col>

                    <v-col cols="12" class="mt-6">
                      <v-row no-gutters>
                        <v-col cols="5">
                          <v-row no-gutters>
                            <v-col cols="12" :class="text">
                              Arrival Date
                            </v-col>
                            <v-col cols="12" :class="`${value} mt-2`">
                              <v-icon size="small">
                                mdi-calendar-month-outline
                              </v-icon>

                              {{
                                new Date(
                                  convertDateTimeToSGT(
                                    visitor.checkIn,
                                    "Asia/Singapore",
                                  ),
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })
                              }}
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="4">
                          <v-row no-gutters>
                            <v-col cols="12" :class="text">
                              Arrival Time
                            </v-col>
                            <v-col cols="12" class="mt-3">
                              <v-row no-gutters>
                                <v-col
                                  :cols="$vuetify.display.smAndUp ? '1' : '2'"
                                >
                                  <v-img
                                    src="/icons/resident/home/my-visitor/arrival-time.svg"
                                    style="width: 16px; height: 16px"
                                  ></v-img>
                                </v-col>
                                <v-col cols="10" :class="value">
                                  {{ visitor.arrivalTime }}
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="3">
                          <v-row no-gutters>
                            <v-col
                              cols="12"
                              :class="text"
                              class="text-truncate"
                            >
                              Duration
                            </v-col>
                            <v-col cols="12" :class="`${value} mt-2`">
                              {{
                                visitor.duration
                                  ? `${visitor.duration} Hour(s)`
                                  : "N/A"
                              }}
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card></nuxt-link
              >
            </template>
          </div>
        </div>
      </template>
      <template v-slot:load-more="{ props }">
        <v-row no-gutters class="align-center px-3">
          <v-btn
            width="100%"
            size="large"
            color="#E0241C"
            class="mt-4 my-button"
            v-bind="props"
            :disabled="!canNextPage"
            @click="props.onClick"
            v-if="canNextPage && !loading"
          >
            Load More
          </v-btn>
          <div class="w-100" v-else-if="!loading">
            <p class="text-grey text-center">No more guests to load.</p>
          </div>
        </v-row>
      </template>
    </v-infinite-scroll>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

import debounce from "lodash/debounce";

const loading = ref(false);

const { theme } = useLocal();

const tabTitle = computed(() =>
  theme.value === "dark" ? "tab-title-dark" : "tab-title-light",
);

const searchBox = computed(() =>
  theme.value === "dark" ? "search-box-dark" : "search-box-light",
);

const dateRangeBox = computed(() =>
  theme.value === "dark" ? "date-range-box-dark" : "date-range-box-light",
);

const cardTitle = computed(() =>
  theme.value === "dark" ? "card-title-dark" : "card-title-light",
);

const card = computed(() =>
  theme.value === "dark" ? "card-dark" : "card-light",
);

const visitorName = computed(() =>
  theme.value === "dark" ? "visitor-name-dark" : "visitor-name-light",
);

const text = computed(() =>
  theme.value === "dark" ? "text-dark" : "text-light",
);

const value = computed(() =>
  theme.value === "dark" ? "value-dark" : "value-light",
);

const { guest, getAllVisitorsByRole } = useVisitor();

const searchInput = ref("");

const page = ref<number>(1);
const pages = ref<number>(0);
const hasNextPage = ref(true);
const canNextPage = computed(() => pages.value > page.value);
const visitors = ref<Record<string, any>>([]);

const pageNames = ref<number>(1);

const range = ref([]);
const menu = ref(false);
const model = defineModel<Date[]>();
const dates = computed({
  get: datesBetween,
  set: updateRange,
});

const convertDateTimeToSGT = (dateTime: string | Date, timeZone: string) => {
  let date = new Date(dateTime);
  let convertedDateString = date.toLocaleString("en-US", {
    timeZone: timeZone,
  });
  let convertedDate = new Date(convertedDateString);
  return convertedDate;
};

function updatePage(visitors: Record<string, any>) {
  if (visitors.length === 0) {
    hasNextPage.value = false;
  } else {
    hasNextPage.value = true;
  }
}
const debouncedSearch = debounce(async (value: string) => {
  loading.value = true;
  hasNextPage.value = true;
  pageNames.value = 1;
  const guests = (await getAllVisitorsByRole({
    search: value,
  })) as Record<string, any>;
  updatePage(guests.items);
  if (!value) {
    pageNames.value = 1;
    const nameSearch = (await getAllVisitorsByRole()) as any;
    visitors.value = nameSearch.items;
    updatePage(visitors.value);
  } else {
    visitors.value = guests.items;
  }
  loading.value = false;
}, 1000);

watch(
  guest,
  async (newValue) => {
    loading.value = true;
    searchInput.value = "";
    range.value = [];
    const res = await getAllVisitorsByRole({
      guest: newValue,
      search: "",
      startDate: "",
      endDate: "",
    });
    page.value = 1;
    pages.value = res.pages;

    visitors.value = res.items;
    loading.value = false;
  },
  { deep: true },
);

onMounted(async () => {
  loading.value = true;
  if (!theme.value) theme.value = "light";

  const data = {
    guest: guest.value,
  };
  const res = await getAllVisitorsByRole(data);
  pages.value = res.pages;
  visitors.value = res.items;
  loading.value = false;
});

function updateRange(date) {
  const [start, end] = unref(range);
  //if everything is null or everything is not
  if (!!start === !!end) {
    range.value = [date];
  } else if (date < start) {
    range.value = [date, start];
  } else if (date > start) {
    range.value = [start, date];
  }
}

function datesBetween() {
  if (range.value == undefined) {
    return [];
  }
  const [start, end] = unref(range);
  if (!!start && !!end) {
    const between = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
      between.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return between;
  } else {
    return range.value;
  }
}

async function save() {
  loading.value = true;
  model.value = range.value;
  const startDate = range.value[0]
    ? convertDateTimeToSGT(range.value[0], "Asia/Singapore")
    : undefined;
  const endDate = range.value[1]
    ? convertDateTimeToSGT(range.value[1], "Asia/Singapore")
    : startDate
    ? new Date(startDate)
    : undefined;

  if (startDate) startDate.setHours(0, 0);
  if (endDate) endDate.setHours(23, 59);
  const data = { startDate, endDate, guest: guest.value };

  const res = await getAllVisitorsByRole(data);

  visitors.value = res.items;
  loading.value = false;
}

function getStatus(item: any) {
  let status = "Pending";

  if (item.actualCheckIn && !item.actualCheckOut) {
    status = "Checked In";
  } else if (item.actualCheckOut) {
    status = "Checked Out";
  } else if (
    item.status == "approved" &&
    !item.actualCheckIn &&
    guest.value == "invitation"
  ) {
    status = "Approved";
  } else if (
    item.status == "approved" &&
    !item.actualCheckIn &&
    guest.value == "histories"
  ) {
    status = "No show";
  } else if (
    item?.status &&
    item.status.includes("pre registered") &&
    !item.actualCheckIn &&
    guest.value == "histories"
  ) {
    status = "Expired";
  } else if (item.status == "rejected") {
    status = "Rejected";
  }
  return status;
}

function load({ done }) {
  setTimeout(async () => {
    loading.value = true;
    page.value = page.value + 1;
    const startDate = range.value[0]
      ? convertDateTimeToSGT(range.value[0], "Asia/Singapore")
      : undefined;
    const endDate = range.value[1]
      ? convertDateTimeToSGT(range.value[1], "Asia/Singapore")
      : startDate
      ? new Date(startDate)
      : undefined;

    if (startDate) {
      startDate.setHours(0, 0);
    }
    if (endDate) {
      endDate.setHours(23, 59);
    }

    const data = {
      page: page.value,
      search: searchInput.value,
      guest: guest.value,
      startDate,
      endDate,
    };

    const _nextVisitors = await getAllVisitorsByRole(data);
    pages.value = _nextVisitors.pages;
    if (_nextVisitors.items.length) {
      visitors.value.push(
        ..._nextVisitors.items.map((item, index) => ({
          ...item,
          index: visitors.value.length + index + 1,
        })),
      );
    }
    done("ok");
    loading.value = false;
  }, 1000);
}

function goBack() {
  useRouter().push({ name: "resident" });
}
async function searchName(event: Event) {
  debouncedSearch((event.target as HTMLInputElement)?.value);
}

const groupedVisitors = computed(() => {
  return visitors.value.reduce((groups, visitor) => {
    const date = new Date(visitor.checkIn).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(visitor);
    return groups;
  }, {});
});
</script>

<style scoped>
.chevron-icon {
  filter: drop-shadow(0px 4px 10px #d01b1b);
}
.go-back-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}
.go-back-dark {
  color: #fcfcfc;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}
.tab-title-light {
  color: #052439;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 36px;
}
.tab-title-dark {
  color: var(--White, #fff);
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 36px;
}
.search-box-light {
  height: 64px;
  padding: var(--f-spacing-0, 0px) 16px;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 0;
  border-radius: 8px;
  border: 1px solid var(--Primary, #eb261e);
  background: var(--White, #fff);
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}
.search-box-dark {
  height: 64px;
  padding: var(--f-spacing-0, 0px) 16px;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 0;
  border-radius: 8px;
  border: 1px solid var(--Primary, #eb261e);
  background: var(--Corporate-blue, #111723);
}
.date-range-box-light {
  height: 64px;
  border-radius: 8px;
  border: 1px solid var(--Primary, #eb261e);
  background: var(--White, #fff);
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}
.date-range-box-dark {
  height: 64px;
  border-radius: 8px;
  border: 1px solid var(--Primary, #eb261e);
  background: var(--Corporate-blue, #111723);
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}
.card-title-light {
  color: #052439;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
}
.card-title-dark {
  color: var(--White, #fff);
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
}
.card-light {
  display: flex;
  padding: 24px 16px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--black-004, rgba(0, 0, 0, 0.04));
  background: #fff;
}
.card-dark {
  display: flex;
  padding: 24px 16px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--black-004, rgba(0, 0, 0, 0.04));
  background: var(--Corporate-blue, #111723);
}
.visitor-name-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
  margin-top: 6px;
  margin-left: 3px;
}
.visitor-name-dark {
  color: var(--White, #fff);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
  margin-top: 6px;
  margin-left: 3px;
}
.chip {
  padding: var(--f-spacing-40, 4px) 16px;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  border: 1px solid var(--Primary, #eb261e);
  background: var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}
.chip-text {
  color: #fff;
  text-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3), 0px 16px 30px rgba(0, 0, 0, 0.9);
  font-size: 10px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  margin-top: 1px;
}
.text-light {
  color: #052439;
  font-size: 12px;
  font-weight: 400;
  line-height: 19px;
}
.text-dark {
  color: var(--White, #fff);
  font-size: 12px;
  font-weight: 400;
  line-height: 19px;
}
.value-light {
  color: #052439;
  font-size: 13px;
  font-weight: 400;
  line-height: 19px;
}
.value-dark {
  color: var(--White, #fff);
  font-size: 13px;
  font-weight: 400;
  line-height: 19px;
}

.datePicker {
  border-radius: 20px !important;
}
.datePicker .v-date-picker-month__day--selected {
  background-color: #eb261e;
}
.datePicker .v-date-picker-month__day--selected .v-btn,
.datePicker .v-date-picker-month__day .v-btn {
  background-color: transparent !important;
  color: #eb261e !important;
}
.datePicker :nth-child(1 of .v-date-picker-month__day--selected) {
  border-radius: 50% 0 0 50%;
}
.datePicker :nth-child(1 of .v-date-picker-month__day--selected) .v-btn {
  background-color: #eb261e !important;
}
.datePicker :nth-last-child(1 of .v-date-picker-month__day--selected) {
  border-radius: 0 50% 50% 0;
}
.datePicker :nth-last-child(1 of .v-date-picker-month__day--selected) .v-btn {
  background-color: #eb261e !important;
}
.datePicker
  :nth-child(1 of .v-date-picker-month__day--selected):nth-last-child(
    1 of .v-date-picker-month__day--selected
  ) {
  border-radius: 50% 50% 50% 50%;
}
.datePicker
  :nth-child(1 of .v-date-picker-month__day--selected):nth-last-child(
    1 of .v-date-picker-month__day--selected
  )
  .v-btn {
  background-color: #eb261e !important;
}
.no-underline {
  text-decoration: none;
}

.my-button {
  background-color: #e0241c !important;
  color: #ffffff !important;
}
</style>
