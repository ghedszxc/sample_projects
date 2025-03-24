<template>
  <div style="max-height: 100%" class="overflow-auto">
    <v-data-iterator :items="occurrencesEntry" :items-per-page="-1">
      <!-- ✍🏻 start of table header with search and filter -->
      <template v-slot:header>
        <v-list density="compact">
          <v-list-item>
            <v-list-item-title>
              <v-row no-gutters class="space-between align-center">
                <v-col cols="12">
                  <v-row no-gutters align="center">
                    <v-col
                      cols="12"
                      :md="isView ? 4 : 8"
                      lg="8"
                      class="d-flex align-center"
                    >
                      <v-btn
                        icon="mdi-arrow-left"
                        elevation="0"
                        :to="{
                          name: 'occurrences',
                          query: {
                            site: mySite,
                          },
                        }"
                      ></v-btn>

                      <span class="font-weight-bold text-h6 mr-6">
                        DOB's
                        {{ actionColumn ? formatDateSG(occurrence.date) : "" }}
                      </span>

                      <template v-if="actionColumn && !isSite">
                        <v-select
                          v-model:model-value="selectFilter"
                          :items="theSites"
                          item-title="name"
                          item-value="_id"
                          hide-details
                          density="compact"
                          clearable
                          menu-icon="mdi-chevron-down"
                          @update:model-value="onFilter(selectFilter)"
                        >
                        </v-select>
                      </template>
                    </v-col>

                    <v-col
                      cols="12"
                      md="4"
                      lg="5"
                      class="mt-4 mt-md-0"
                      v-if="$vuetify.display.md && allowedEdit"
                    >
                      <v-row align="center" justify="end">
                        <v-col cols="12">
                          <v-btn
                            color="primary"
                            block
                            @click="$emit('toggle-dob-entry')"
                          >
                            {{ showDobEntry ? "Hide DO" : "Show DO" }}
                            <v-icon class="ml-2">
                              {{
                                showDobEntry
                                  ? "mdi-eye-off-outline"
                                  : "mdi-eye-outline"
                              }}
                            </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12" md="4" v-if="isView">
                      <v-row align="center" justify="end">
                        <v-col
                          cols="12"
                          :class="{ 'mb-5': $vuetify.display.smAndDown }"
                        >
                          <v-btn
                            color="#1867C0"
                            class="w-100 rounded-lg"
                            :to="{
                              name: 'occurrences',
                              query: {
                                site: mySite,
                              },
                            }"
                          >
                            View All DOB
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12" sm="8" md="8" lg="9" class="pr-sm-2 mb-2">
                      <v-row no-gutters>
                        <v-col cols="12" lg="6">
                          <v-text-field
                            :model-value="search"
                            id="title"
                            name="title"
                            placeholder="Search"
                            hide-details
                            density="compact"
                            append-inner-icon="mdi-magnify"
                            @update:modelValue="onSearch"
                            autocomplete=""
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12" sm="4" md="4" lg="3" class="mb-2">
                      <v-text-field
                        v-model="dateSelectedForm"
                        readonly
                        hide-details
                        placeholder="Select Date"
                        density="compact"
                        @click:clear="callItBack()"
                        @click="startDateDialog = true"
                        clearable
                      >
                        <template #prepend-inner>
                          <v-icon class="cursor-pointer"
                            >mdi-calendar-month-outline</v-icon
                          >
                        </template>
                      </v-text-field>
                      <v-dialog v-model="startDateDialog" max-width="355">
                        <v-date-picker
                          v-model:model-value="selectDateFrom"
                          @update:model-value="onSelectDate(selectDateFrom)"
                        >
                          <template v-slot:header="{}"></template>
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-list-item-title>
          </v-list-item>

          <v-divider v-if="$vuetify.display.smAndUp" />

          <v-list-item v-if="$vuetify.display.smAndUp">
            <v-list-item-title>
              <v-row no-gutters class="pb-lg-2 text-body-2 px-lg-2 pt-3">
                <template v-for="(col, idx) in columnHeader">
                  <v-col
                    :key="idx"
                    cols="12"
                    v-if="col.visible"
                    :sm="col.sm"
                    :md="col.md"
                    :lg="col.lg"
                    class="text-capitalize white--text text"
                  >
                    <v-row
                      no-gutters
                      class="fill-height"
                      align-content="center"
                    >
                      <span
                        class="d-inline-block text-truncate text-capitalize w-100 font-weight-bold"
                        :class="`text-${col.align}`"
                      >
                        {{ col.title }}
                      </span>
                    </v-row>
                  </v-col>
                </template>
              </v-row>
            </v-list-item-title>
          </v-list-item>

          <v-divider v-if="$vuetify.display.lgAndUp" class="mt-2" />
        </v-list>
      </template>

      <!-- ✍🏻 start of item display -->
      <template #default="{ items }">
        <v-responsive>
          <v-list class="pa-0">
            <template v-for="(item, itemIndex) in items" :key="item.raw._id">
              <v-list-item
                :class="
                  $vuetify.display.smAndDown || $vuetify.display.md
                    ? 'py-2 border-md px-4 px-sm-2 rounded-lg mb-2 mx-2 my-2'
                    : 'py-1 px-2 px-lg-4 mx-2 my-0 text-body-2'
                "
              >
                <v-list-item-title>
                  <v-row no-gutters class="align-center">
                    <!-- Column for ID -->
                    <v-col
                      cols="12"
                      sm="1"
                      class="text-capitalize white--text text d-flex align-center font-weight-bold mb-2 mb-md-0"
                      :class="item.raw.isCrossOut ? 'cross-out' : ''"
                    >
                      <v-row
                        no-gutters
                        class="fill-height text-truncate"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.xs ? 'space-between' : 'center'
                        "
                      >
                        <span class="mr-2 d-flex d-sm-none font-weight-bold"
                          >Id:
                        </span>
                        <span class="text-truncate mt-1">
                          {{ item.raw.serialNumber }}
                          {{ item.raw?.version ? item.raw?.version : "" }}
                        </span>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="3"
                      lg="2"
                      class="text-capitalize white--text text d-flex align-center mb-2 mb-md-0"
                      :class="item.raw.isCrossOut ? 'cross-out' : ''"
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
                        <span
                          class="text-truncate mt-1"
                          :style="
                            $vuetify.display.xs ? 'font-size: .8rem;' : ''
                          "
                          :class="$vuetify.display.smAndUp ? 'text-body-2' : ''"
                        >
                          <v-icon class="mr-1" color="green">
                            mdi-calendar </v-icon
                          >{{ formatDateSG(item.raw.date) }}
                        </span>

                        <span
                          class="text-truncate mt-1 w-100"
                          v-if="$vuetify.display.sm || $vuetify.display.mdAndUp"
                          :style="
                            $vuetify.display.xs ? 'font-size: .8rem;' : ''
                          "
                          :class="$vuetify.display.smAndUp ? 'text-body-2' : ''"
                        >
                          <v-icon> mdi-calendar-month </v-icon>
                          {{ formatTime24(item.raw.date) }}
                        </span>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      class="text-capitalize white--text text d-flex align-center mb-2 mb-md-0"
                      :class="item.raw.isCrossOut ? 'cross-out' : ''"
                      v-if="$vuetify.display.xs || $vuetify.display.xs"
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
                        <span class="mr-2 d-flex d-md-none font-weight-bold"
                          >Time:
                        </span>
                        <span class="text-truncate mt-1">
                          {{ formatTime24(item.raw.date) }}
                        </span>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="4"
                      lg="2"
                      class="text-capitalize white--text text d-flex align-center mb-2 mb-md-0"
                      :class="item.raw.isCrossOut ? 'cross-out' : ''"
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
                          >Subject:
                        </span>
                        <span class="text-truncate mt-1">
                          {{
                            typeof item.raw.subject === "object"
                              ? item.raw.subject.subject
                              : ""
                          }}
                        </span>
                        <span
                          class="mt-1 w-100"
                          v-if="$vuetify.display.sm || $vuetify.display.md"
                        >
                          <truncated-text
                            :text="item.raw.occurrence"
                            :max-length="150"
                          ></truncated-text>
                        </span>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      :md="actionColumn ? '4' : '3'"
                      class="text-capitalize white--text text d-flex align-center mb-2 mb-md-0 text-wrap pr-0 pr-md-5"
                      :class="item.raw.isCrossOut ? 'cross-out' : ''"
                      v-if="$vuetify.display.xs || $vuetify.display.lgAndUp"
                    >
                      <v-row
                        no-gutters
                        class="fill-height"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown ? 'space-between' : 'start'
                        "
                      >
                        <span class="mr-2 d-flex d-md-none font-weight-bold"
                          >Occurrence:
                        </span>
                        <span class="mt-1">
                          <truncated-text
                            :text="item.raw.occurrence"
                            :max-length="150"
                          ></truncated-text>
                        </span>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="4"
                      lg="3"
                      class="text-capitalize white--text text d-flex align-center mb-2 mb-md-0"
                      :class="item.raw.isCrossOut ? 'cross-out' : ''"
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
                          >Signature:
                        </span>
                        <span class="text-truncate mt-1 text-body-2">
                          <v-avatar
                            size="small"
                            :color="
                              stringToColor(
                                typeof item.raw.signature === 'object'
                                  ? `${item.raw.signature?.givenName} ${item.raw.signature?.surname}`
                                  : '',
                              )
                            "
                            class="mr-4"
                          >
                            {{
                              getInitial(
                                typeof item.raw.signature === "object"
                                  ? `${item.raw.signature?.givenName} ${item.raw.signature?.surname}`
                                  : "",
                              )
                            }}
                          </v-avatar>
                          <span
                            v-if="typeof item.raw.signature === 'object'"
                            class="text-truncate mt-1"
                            :style="{
                              maxWidth: $vuetify.display.lgAndUp
                                ? '180px'
                                : '160px',
                            }"
                          >
                            {{ item.raw.signature?.givenName }}
                            {{ item.raw.signature?.surname }}
                          </span>
                          <span v-else>Undefined Signature</span>
                          <span
                            v-if="
                              Boolean(item.raw.attachmentReport) &&
                              typeof item.raw.attachmentReport === 'object' &&
                              /^(pending|approved)$/i.test(
                                item.raw.attachmentReport.status || '',
                              )
                            "
                          >
                            <div>
                              <p class="mt-2">Link to Incident Report</p>
                              <nuxt-link
                                v-if="
                                  typeof item.raw.attachmentReport === 'object'
                                "
                                class="mx-0 px-0 text-decoration-none"
                                :to="{
                                  name: 'incidents-id-download',
                                  params: { id: item.raw.attachmentReport._id },
                                  query: { site: mySite },
                                }"
                                target="_blank"
                                :color="
                                  stringToColor(
                                    item.raw.attachmentReport.reportId || '',
                                  )
                                "
                              >
                                <span class="text-truncate">
                                  {{ item.raw.attachmentReport.reportId }} -
                                  {{
                                    `"${item.raw.attachmentReport.incidentInformation.incidentTypeAndTime?.typeOfIncident}"`
                                  }}
                                </span>
                              </nuxt-link>
                            </div>
                          </span>
                          <span
                            v-if="
                              Boolean(item.raw.attachmentReport) &&
                              typeof item.raw.attachmentReport === 'object' &&
                              /^(pending|approved)$/i.test(
                                item.raw.attachmentReport.status || '',
                              )
                            "
                          >
                            <span
                              v-if="
                                Boolean(item.raw.attachmentReport.updatedAt)
                              "
                            >
                              {{
                                formatDateAndTimeSG(
                                  item.raw.attachmentReport.updatedAt || "",
                                  true,
                                )
                              }}
                            </span>
                            <span v-else>
                              {{
                                formatDateAndTimeSG(
                                  item.raw.attachmentReport.createdAt || "",
                                  true,
                                )
                              }}
                            </span>
                          </span>
                          <div
                            v-if="
                              Boolean(item.raw.attachmentReport) &&
                              typeof item.raw.attachmentReport === 'object' &&
                              /^(pending|approved)$/i.test(
                                item.raw.attachmentReport.status || '',
                              )
                            "
                          >
                            <span
                              :class="
                                /^(pending)$/i.test(
                                  item.raw.attachmentReport.status || '',
                                )
                                  ? 'text-orange'
                                  : 'text-green'
                              "
                              >{{ item.raw.attachmentReport.status }}</span
                            >
                          </div>
                        </span>
                      </v-row>
                    </v-col>

                    <v-divider
                      v-if="$vuetify.display.sm || $vuetify.display.md"
                      class="mt-2"
                    />

                    <v-col
                      v-if="calculateRemainingTime(occurrence.date) > 0"
                      cols="12"
                      lg="1"
                      class="text-capitalize white--text text d-flex align-center justify-end"
                    >
                      <v-row
                        no-gutters
                        align="end"
                        justify="end"
                        align-content="end"
                      >
                        <v-col
                          :cols="$vuetify.display.lgAndUp ? '12' : 'auto'"
                          class="d-flex align-center justify-center"
                        >
                          <v-btn
                            v-if="$ability.can('update', 'edit-dob')"
                            variant="plain"
                            icon
                            :disabled="item.raw.isCrossOut"
                            @click="showEditForm(item.raw)"
                          >
                            <v-icon>mdi-square-edit-outline</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col
                          :cols="$vuetify.display.lgAndUp ? '12' : 'auto'"
                          class="d-flex align-center justify-center"
                          v-if="
                            $ability.can('create', 'create-incident-dob') ||
                            $ability.can('update', 'edit-incident-dob')
                          "
                        >
                          <v-menu>
                            <template v-slot:activator="{ props }">
                              <v-btn
                                v-bind="props"
                                icon
                                variant="plain"
                                :disabled="
                                  item.raw.isCrossOut ||
                                  (Boolean(item.raw.attachmentReport) &&
                                    typeof item.raw.attachmentReport ===
                                      'object' &&
                                    /^(pending|approve|approved)$/i.test(
                                      item.raw.attachmentReport.status || '',
                                    ))
                                "
                              >
                                <v-icon>mdi-paperclip</v-icon>
                              </v-btn>
                            </template>
                            <v-list class="rounded-xl">
                              <v-list-item
                                v-if="
                                  $ability.can('create', 'create-incident-dob')
                                "
                                key="create-incident-report"
                                value="create-incident-report"
                                @click="createIncident(item.raw)"
                              >
                                <v-list-item-title
                                  >Create Incident Report</v-list-item-title
                                >
                              </v-list-item>
                              <v-list-item
                                v-if="
                                  $ability.can('update', 'edit-incident-dob')
                                "
                                key="attach-incident-report"
                                value="attach-incident-report"
                                @click="attachIncident(item.raw)"
                              >
                                <v-list-item-title
                                  >Attach Incident Report</v-list-item-title
                                >
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </v-col>
                        <v-col
                          :cols="$vuetify.display.lgAndUp ? '12' : 'auto'"
                          class="d-flex align-center justify-center"
                        >
                          <v-btn
                            v-if="$ability.can('delete', 'delete-dob')"
                            icon
                            variant="plain"
                            :disabled="item.raw.isCrossOut"
                            @click="updateCrossOut(item.raw)"
                          >
                            <v-icon>mdi-trash-can-outline </v-icon>
                          </v-btn>
                        </v-col>
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
        </v-responsive>
      </template>
      <!-- ✍🏻 end of item display -->

      <!-- ✍🏻 no records display -->
      <template #no-data>
        <v-row no-gutters justify="center" class="pa-16">
          <v-col cols="12">
            <v-row no-gutters justify="center">
              <v-img src="/empty.svg" width="100px" height="100px"></v-img>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-row no-gutters justify="center">
              <span class="font-weight-bold"> No DOB Entry recorded yet. </span>
            </v-row>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>

    <DobEntryConfirmPasswordCrossOut
      @sign-cross="confirmSignCross($event)"
      :isConfirmTitle="`Confirm your digital signature with password`"
    />
    <DobEntryConfirmPasswordCrossOut
      @sign-cross="confirmSignCross($event)"
      :isConfirmTitle="`Confirm your digital signature with password`"
    />
  </div>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";
import vuetify from "~/plugins/vuetify";
const { $ability } = useNuxtApp();
defineProps({
  isView: {
    type: Boolean,
    default: false,
  },
  showDobEntry: {
    type: Boolean,
    required: true,
  },
  allowedEdit: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits([
  "editData",
  "crossData",
  "directAttachIr",
  "createIr",
  "attachIr",
  "toggle-dob-entry",
]);

const {
  dateSelectedForm,
  occurrenceEntry,
  occurrencesEntry,
  search,
  setOccurrenceEntry,
  setOccurrencesEntry,
  isConfirmModalCross,
  isConfirmModalAttach,
} = useOccurrenceEntry();
const { occurrence } = useOccurrence();
const {
  getInitial,
  stringToColor,
  formatTime24,
  calculateRemainingTime,
  formatDateSG,
  formatDateAndTimeSG,
} = useUtils();
const { currentUser } = useLocalAuth();
const { sites } = useSite();
const { getSitesOptionsForFiltering, mySite } = useFilter();

const filterSite = ref("");
const selectFilter = ref("");
const actionColumn = ref(false);
const selectDateFrom = ref(new Date());
const startDateDialog = ref(false);

const theSites = computed(() => sites.value);
const isSite = computed(() => currentUser.value.type == "site");

const isLgAndUp = ref(window.innerWidth >= 1280);

window.addEventListener("resize", () => {
  isLgAndUp.value = window.innerWidth >= 1280;
});
const columnHeader = computed(() => {
  const baseHeaders = [
    {
      sm: "1",
      md: "1",
      lg: "1",
      title: "No.",
      align: "center",
      visible: true,
    },
    {
      sm: "3",
      md: "3",
      lg: "2",
      title: "Date / Time",
      align: "left",
      visible: true,
    },
    {
      sm: "4",
      lg: "2",
      title: "Subject / Occurence",
      align: "left",
      visible: true,
    },
    {
      sm: "4",
      title: "Signature",
      align: "left",
      visible: true,
    },
  ];
  if (isLgAndUp.value) {
    baseHeaders[2].title = "Subject";
    baseHeaders.splice(3, 0, {
      sm: "3",
      md: "3",
      lg: "3",
      title: "Occurence",
      align: "left",
      visible: true,
    });
  }

  return baseHeaders;
}) as unknown as {
  sm: string;
  md: string;
  lg: string;
  title: string;
  align: string;
  visible: any;
}[];

onMounted(async () => {
  await getSitesOptionsForFiltering();
});

async function onSelectDate(value: Date) {
  dateSelectedForm.value = new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
  startDateDialog.value = false;

  await setOccurrencesEntry({
    site: mySite.value,
    date: dateSelectedForm.value,
    dailyOccurrenceBookId: occurrence.value._id,
  });
}

async function onFilter(value: any) {
  filterSite.value = value;
  await setOccurrencesEntry({
    site: value,
    dailyOccurrenceBookId: occurrence.value._id,
  });
}

async function showEditForm(data: any) {
  emit("editData", data);
}

async function onDirectAttachIr(data: any) {
  emit("directAttachIr", data);
}

const selectedRow = ref({});
async function updateCrossOut(data: any) {
  isConfirmModalCross.value = true;
  selectedRow.value = data;
}

async function confirmSignCross(data: any) {
  isConfirmModalCross.value = false;
  emit("crossData", selectedRow.value);
}

async function createIncident(data: any) {
  setOccurrenceEntry(data);
  emit("createIr");
}

async function updateAttach(data: any) {
  isConfirmModalAttach.value = true;
  selectedRow.value = data;
}
async function attachIncident(data: any) {
  // setOccurrenceEntry({
  //   _id:data._id
  // } as TOccurrenceEntry );
  emit("attachIr", data);
}

function onSearch(val: string) {
  debouncedSearch(val);
}

const debouncedSearch = debounce(async (value: string) => {
  search.value = value;
  await setOccurrencesEntry({
    site: mySite.value,
    dailyOccurrenceBookId: occurrence.value._id,
  });
}, 500);

async function callItBack() {
  await setOccurrencesEntry({
    site: mySite.value,
    dailyOccurrenceBookId: occurrence.value._id,
  });
}
</script>

<style>
.cross-out {
  text-decoration: line-through;
}
</style>
