<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <custom-table
        tableName="DOB"
        :items="occurrences"
        :headers="columnHeader"
        :itemPerPage="itemsPerPage"
        :pageRange="pageRange"
        :page="page"
        :pages="pages"
        noDataMsg="No DOB recorded yet."
        noDataImg="/empty.svg"
        :isLoading="isTableLoading"
        @nextPage="nextPage({ site: mySite })"
        @prevPage="prevPage({ site: mySite })"
        @onSearch="onSearch"
        @onClear="onClearSearch"
      >
        <!-- Custom Header Slot -->
        <template v-if="$vuetify.display.mdAndUp" #customHeader>
          <v-row no-gutters class="pa-4" justify="space-between">
            <v-col cols="12" md="6">
              <v-row align="center">
                <v-col cols="12" md="1" v-if="$vuetify.display.smAndDown">
                  <span class="font-weight-bold text-h6"> DOB</span>
                </v-col>

                <v-col cols="12" md="10" class="d-flex">
                  <span
                    class="font-weight-bold text-h6 mr-6 pt-1"
                    v-if="$vuetify.display.mdAndUp"
                  >
                    DOB
                  </span>

                  <v-text-field
                    v-model="searchEntries"
                    placeholder="Book No, Occurrence, Subject, Name, Surname"
                    hide-details
                    density="compact"
                    append-inner-icon="mdi-magnify"
                    clearable
                    @keypress.enter="onSearch(searchEntries)"
                    @click:clear="onClearSearch"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="6">
              <v-row align="center" justify="end">
                <v-col
                  cols="12"
                  md="6"
                  :class="{ 'mb-5': $vuetify.display.smAndDown }"
                >
                  <v-select
                    v-model:model-value="selectFilter"
                    :items="filterOpt"
                    item-title="name"
                    item-value="value"
                    hide-details
                    density="compact"
                    menu-icon="mdi-chevron-down"
                    @update:model-value="onFilter(selectFilter)"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="dateSelected"
                    readonly
                    hide-details
                    density="compact"
                    placeholder="Select Date"
                    @click="startDateDialog = true"
                    @click:clear="callItBack"
                    clearable
                  >
                    <template #prepend-inner>
                      <v-icon class="cursor-pointer"
                        >mdi-calendar-month-outline</v-icon
                      >
                    </template>
                  </v-text-field>

                  <v-dialog v-model="startDateDialog" max-width="355">
                    <v-card>
                      <v-card-subtitle>
                        <v-date-picker
                          v-model:model-value="selectDateFrom"
                          @update:model-value="onSelectDate(selectDateFrom)"
                        ></v-date-picker>
                      </v-card-subtitle>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </template>
        <template v-else #customHeader>
          <v-row no-gutters class="pa-4" justify="space-between">
            <v-col cols="12" md="6">
              <v-row align="center">
                <v-col class="" cols="12">
                  <span class="font-weight-bold text-h6"> DOB</span>
                </v-col>

                <v-col cols="12" class="pa-2 d-flex">
                  <v-text-field
                    v-model="searchEntries"
                    placeholder="Book No, Occurrence, Subject, Name, Surname"
                    hide-details
                    density="compact"
                    append-inner-icon="mdi-magnify"
                    clearable
                    @keypress.enter="onSearch(searchEntries)"
                    @click:clear="onClearSearch"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" class="pa-2">
                  <v-select
                    v-model:model-value="selectFilter"
                    :items="filterOpt"
                    item-title="name"
                    item-value="value"
                    hide-details
                    density="compact"
                    menu-icon="mdi-chevron-down"
                    @update:model-value="onFilter(selectFilter)"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" class="pa-2">
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-model="dateSelected"
                        v-bind="props"
                        hide-details
                        density="compact"
                        placeholder="Select Date"
                        @click:clear="callItBack"
                        clearable
                      >
                        <template #prepend-inner>
                          <v-icon class="cursor-pointer"
                            >mdi-calendar-month-outline</v-icon
                          >
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      v-model:model-value="selectDateFrom"
                      @update:model-value="onSelectDate(selectDateFrom)"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </template>
        <!-- Table Items Slot -->
        <template v-if="$vuetify.display.lgAndUp" #tableItems="{ items }">
          <v-list class="pa-0">
            <template v-for="(item, itemIndex) in items" :key="item.raw._id">
              <v-list-item
                class="py-3 px-4"
                @click="
                  navigateTo({
                    name: 'occurrences-id',
                    params: { id: item.raw._id },
                    query: { site: mySite },
                  })
                "
              >
                <v-list-item-title>
                  <v-row no-gutters align="center">
                    <v-col
                      cols="12"
                      md="2"
                      class="text-capitalize white--text text text-body-2"
                    >
                      <span>{{ item.raw.occurrenceId }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="text-capitalize white--text text text-body-2"
                    >
                      <span>{{ formatDateSG(item.raw.date) }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="3"
                      class="text-capitalize white--text text text-body-2"
                    >
                      <v-chip
                        color="primary"
                        class="px-10 font-weight-bold dob-counter text-body-2"
                        v-if="item.raw.status == 'open'"
                      >
                        <span class="dob-counter">{{
                          remainingTime[item.raw._id]
                        }}</span>
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="12"
                      :md="actionColumn ? '2' : '3'"
                      class="text-capitalize white--text text text-body-2"
                    >
                      <v-chip
                        color="primary"
                        class="font-weight-bold"
                        style="padding: 10px 40px"
                      >
                        <span class="">{{ item.raw.totalInput }}</span>
                      </v-chip>
                    </v-col>
                    <v-col
                      cols="12"
                      :md="actionColumn ? '1' : '2'"
                      class="text-capitalize white--text text text-body-2"
                    >
                      <v-chip
                        color="green-darken-4"
                        :class="`px-10 dob-status-${item.raw.status}`"
                        class="d-flex justify-center"
                      >
                        <span :class="`dob-status-${item.raw.status}`">{{
                          item.raw.status
                        }}</span>
                      </v-chip>
                    </v-col>
                    <v-col
                      v-if="actionColumn"
                      cols="12"
                      md="2"
                      class="text-capitalize white--text text-right d-flex align-center justify-end text-body-2"
                    >
                      <v-btn
                        color="primary"
                        class="border mx-2 text-body-2"
                        :loading="isDownloadingPdf[item.raw._id]"
                        @click.stop="onDownloadDobPdf(item.raw._id)"
                      >
                        Download
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-list-item-title>
              </v-list-item>
              <v-divider v-if="itemIndex + 1 !== items.length"></v-divider>
            </template>
          </v-list>
        </template>

        <!-- Mobile Custom Header Slot -->

        <!-- Table Items Slot -->
        <template v-else #tableItems="{ items }">
          <v-list class="pa-0">
            <template v-for="(item, itemIndex) in items" :key="item.raw._id">
              <v-list-item
                :class="
                  $vuetify.display.smAndDown || $vuetify.display.md
                    ? 'py-2 border-md px-4 px-sm-2 rounded-lg mb-2 mx-2 my-2'
                    : 'py-1 px-2 px-lg-4 mx-2 my-0 text-body-2'
                "
                @click="
                  navigateTo({
                    name: 'occurrences-id',
                    params: { id: item.raw._id },
                    query: { site: mySite },
                  })
                "
              >
                <v-list-item-title>
                  <v-row no-gutters align="center">
                    <v-col
                      cols="12"
                      sm="2"
                      md="2"
                      :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                    >
                      <v-row
                        no-gutters
                        class="fill-height text-truncate"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown ? 'space-between' : 'start'
                        "
                      >
                        <span class="mr-2 d-flex d-sm-none font-weight-bold"
                          >No:
                        </span>
                        <span class="text-truncate mt-1 font-weight-bold">
                          {{ item.raw.occurrenceId }}
                        </span>
                      </v-row>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="4"
                      md="2"
                      :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                    >
                      <v-row
                        no-gutters
                        class="fill-height text-truncate"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown ? 'space-between' : 'start'
                        "
                      >
                        <span class="mr-2 d-flex d-sm-none font-weight-bold"
                          >Date:
                        </span>
                        <span class="text-truncate mt-1">
                          <v-icon>mdi-calendar-month-outline</v-icon>
                          {{ formatDateSG(item.raw.date) }}
                        </span>
                        <span
                          v-if="$vuetify.display.sm"
                          class="text-truncate mt-1 w-100"
                          :style="
                            $vuetify.display.smAndDown
                              ? 'font-size: .8rem;'
                              : ''
                          "
                        >
                          <v-chip
                            color="primary"
                            class="px-6 font-weight-bold"
                            v-if="item.raw.status == 'open'"
                          >
                            <span>{{ remainingTime[item.raw._id] }}</span>
                          </v-chip>
                        </span>
                      </v-row>
                    </v-col>

                    <v-col
                      cols="12"
                      md="3"
                      :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                      v-if="$vuetify.display.xs || $vuetify.display.md"
                    >
                      <v-row
                        no-gutters
                        class="fill-height text-truncate"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown
                            ? 'space-between'
                            : 'center'
                        "
                      >
                        <span class="mr-2 d-flex d-sm-none font-weight-bold"
                          >DOB Closed In:
                        </span>
                        <span
                          class="text-truncate mt-1"
                          :style="
                            $vuetify.display.smAndDown
                              ? 'font-size: .8rem;'
                              : ''
                          "
                        >
                          <v-chip
                            color="primary"
                            class="px-6 font-weight-bold"
                            v-if="item.raw.status == 'open'"
                          >
                            <span>{{ remainingTime[item.raw._id] }}</span>
                          </v-chip>
                        </span>
                      </v-row>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="4"
                      md="2"
                      :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                    >
                      <v-row
                        no-gutters
                        class="fill-height text-truncate"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown ? 'space-between' : 'start'
                        "
                      >
                        <span class="mr-2 d-flex d-sm-none font-weight-bold"
                          >Total Input:
                        </span>
                        <span
                          class="text-truncate mt-1 mt-sm-0 font-weight-bold"
                        >
                          <v-icon>mdi-post-outline</v-icon>
                          {{ item.raw.totalInput }}
                        </span>
                        <span
                          v-if="$vuetify.display.sm"
                          class="text-truncate mt-1 w-100"
                          :style="
                            $vuetify.display.smAndDown
                              ? 'font-size: .8rem;'
                              : ''
                          "
                        >
                          <v-chip
                            color="green-darken-4"
                            :class="`px-2 dob-status-${item.raw.status}`"
                            class="d-flex justify-center w-50"
                            @click="
                              navigateTo({
                                name: 'occurrences-id',
                                params: { id: item.raw._id },
                                query: { site: mySite },
                              })
                            "
                          >
                            <span :class="`dob-status-${item.raw.status}`">{{
                              item.raw.status
                            }}</span>
                          </v-chip>
                        </span>
                      </v-row>
                    </v-col>

                    <v-col
                      cols="12"
                      md="2"
                      :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                      v-if="$vuetify.display.xs || $vuetify.display.md"
                    >
                      <v-row
                        no-gutters
                        class="fill-height text-truncate"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown ? 'space-between' : 'start'
                        "
                      >
                        <span class="mr-2 d-flex d-sm-none font-weight-bold"
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
                          <v-chip
                            color="green-darken-4"
                            :class="`px-6 dob-status-${item.raw.status}`"
                            class="d-flex justify-center"
                            @click="
                              navigateTo({
                                name: 'occurrences-id',
                                params: { id: item.raw._id },
                                query: { site: mySite },
                              })
                            "
                          >
                            <span :class="`dob-status-${item.raw.status}`">{{
                              item.raw.status
                            }}</span>
                          </v-chip>
                        </span>
                      </v-row>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="2"
                      md="1"
                      :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                    >
                      <v-row
                        no-gutters
                        class="fill-height text-truncate"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown ? 'space-between' : 'start'
                        "
                      >
                        <span class="mr-2 d-flex d-sm-none font-weight-bold"
                          >Actions:
                        </span>
                        <span
                          class="text-truncate mt-1"
                          :style="
                            $vuetify.display.smAndDown
                              ? 'font-size: .8rem;'
                              : ''
                          "
                          v-if="actionColumn"
                        >
                          <v-btn
                            variant="plain"
                            class="border"
                            v-if="
                              ['service-provider', 'leader'].includes(
                                currentUser.type,
                              )
                            "
                          >
                            <v-icon>mdi-eye</v-icon>
                          </v-btn>
                          <v-btn
                            color="primary"
                            class="border"
                            :loading="isDownloadingPdf[item.raw._id]"
                            @click.stop="onDownloadDobPdf(item.raw._id)"
                          >
                            <v-icon>mdi-download</v-icon>
                          </v-btn>
                        </span>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-list-item-title>
              </v-list-item>
              <v-divider
                v-if="
                  itemIndex + 1 !== items.length && $vuetify.display.lgAndUp
                "
              ></v-divider>
            </template>
          </v-list>
        </template>
      </custom-table>
    </v-col>
    <DobEntrySearchEntry v-if="isShowOccurrenceEntryDialog" />
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});
import CustomTable from "@/components/base/Table.vue"; // Import the CustomTable component

const { $ability } = useNuxtApp();
const { formatDateSG, calculateRemainingTime } = useUtils();
const { currentUser } = useLocalAuth();
const {
  setSearchOccurrencesEntry,
  isShowOccurrenceEntryDialog,
  searchEntries,
} = useOccurrenceEntry();
const {
  occurrences,
  selectFilter,
  page,
  pages,
  pageRange,
  itemsPerPage,
  dateSelected,
  prevPage,
  nextPage,
  isTableLoading,
  setOccurrences,
  downloadDobPdf,
} = useOccurrence();
const { getSitesOptionsForFiltering, mySite, filterSite } = useFilter();

const selectDateFrom = ref(new Date());
const remainingTime = ref({} as any);
const isDownloadingPdf = ref<Record<string, boolean>>({});
const actionColumn = ref(false);
const startDateDialog = ref(false);

const isSmAndDown = ref(window.innerWidth < 960);
const isLgAndUp = ref(window.innerWidth >= 1280);

window.addEventListener("resize", () => {
  isSmAndDown.value = window.innerWidth < 960;
  isLgAndUp.value = window.innerWidth >= 1280;
});

const columnHeader = computed(() => {
  actionColumn.value = $ability.can("create", "create-dob");
  let _column = {};
  if (actionColumn.value) {
    _column = {
      md: "2",
      title: actionColumn.value ? "Action" : "",
      align: "center",
    };
  }

  return [
    { sm: "2", md: "2", title: "No.", align: "left", visible: true },
    {
      sm: "4",
      md: "2",
      title: isSmAndDown.value ? "Date / DOB Closed in" : "Date",
      align: "left",
      visible: true,
    },
    {
      md: "3",
      title: "DOB Closed in",
      align: isLgAndUp.value ? "start" : "center",
      visible: isSmAndDown.value ? false : true,
    },
    {
      sm: "4",
      md: "2",
      title: isSmAndDown.value ? "Total Input Log / Status" : "Total Input Log",
      align: "left",
      visible: true,
    },
    {
      md: actionColumn.value ? "2" : "2",
      title: "Status",
      align: "left",
      visible: isSmAndDown.value ? false : true,
    },
    {
      sm: "1",
      md: actionColumn.value ? "1" : "3",
      title: "Actions",
      align: "start",
      visible: true,
    },
    _column,
  ];
}) as unknown as { sm: string; md: string; title: string; align: string }[];

const filterOpt = computed(() => {
  return [
    {
      name: "All",
      value: "",
      disabled: false,
    },
    {
      name: "Open",
      value: "open",
      disabled: false,
    },
    {
      name: "Close",
      value: "close",
      disabled: false,
    },
  ];
});

const formatTime = (seconds: any) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours}hr ${minutes}m`;
};

const updateRemainingTime = () => {
  occurrences.value.forEach((item) => {
    const itemId = item._id;
    const _time = calculateRemainingTime(item.date);
    remainingTime.value[itemId] = _time < 0 ? "00h 00m" : formatTime(_time);
  });
};

onMounted(async () => {
  dateSelected.value = "";
  itemsPerPage.value = 10;
  await getSitesOptionsForFiltering();
  await setOccurrences({
    site: mySite.value,
  });
  updateRemainingTime();
  setInterval(updateRemainingTime, 30000);
});

async function onSearch(value: string) {
  searchEntries.value = value;
  isShowOccurrenceEntryDialog.value = true;
  await setSearchOccurrencesEntry({
    site: mySite.value,
    keywords: value,
  });
}

async function onClearSearch() {
  searchEntries.value = "";
}

async function onFilter(value: string) {
  selectFilter.value = value;
  await setOccurrences({
    site: filterSite.value || mySite.value,
  });
}

async function onSelectDate(value: Date) {
  dateSelected.value = new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));

  startDateDialog.value = false;
  await setOccurrences({
    site: filterSite.value || mySite.value,
  });
  updateRemainingTime();
}

async function callItBack() {
  await setOccurrences({
    site: filterSite.value || mySite.value,
  });
}

async function onDownloadDobPdf(id: string) {
  try {
    isDownloadingPdf.value[id] = true;
    const currentUrl = `/occurrences/${id}/download?site=${mySite.value}`;
    await downloadDobPdf(currentUrl);
  } finally {
    isDownloadingPdf.value[id] = false;
  }
}
</script>

<style scoped>
@media only screen and (max-width: 960px) {
  .title-header {
    display: none;
  }
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

.dob-counter {
  background-color: #052439;
  color: #fff;
  min-width: 50px;
}

.dob-input-log {
  min-width: 10px;
  color: #000;
  min-width: 15px;
}

.dob-status-open {
  color: #fff;
  background-color: #2e7d32;
}

.dob-status-close {
  background-color: #ff5252;
  color: #fff;
}

:deep() .v-field__field {
  font-size: 14px;
}
</style>
