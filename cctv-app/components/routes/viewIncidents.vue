<template>
  <v-dialog max-width="1500" v-model="isDialogVisible" persistent>
    <v-card class="rounded-xl" min-height="600px">
      <v-toolbar>
        <v-toolbar-title v-if="$vuetify.display.mdAndUp">
          <span class="text-h6 d-none d-md-inline-flex"> Incidents </span>
        </v-toolbar-title>
        <v-row align="center" justify="end" class="fill-height px-4 px-sm-3">
          <v-col cols="3" sm="5" md="6" lg="6">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="dateSelected"
                  v-bind="props"
                  hide-details
                  @click:clear="callItBack()"
                  clearable
                  placeholder="Filter Date"
                  density="compact"
                  class="mx-3"
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
              >
                <template v-slot:header="{}"></template>
              </v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="9" sm="7" md="6" lg="6">
            <v-text-field
              :model-value="search"
              placeholder="Search"
              hide-details
              clearable
              density="compact"
              append-inner-icon="mdi-magnify"
              @update:modelValue="onSearch"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-btn icon="mdi-close" @click="hideModal"></v-btn>
      </v-toolbar>
      <v-divider></v-divider>

      <v-card-text class="py-0 px-1 overflow-auto" style="max-height: 800px">
        <g-card :loading="isTableLoading" :elevation="0">
          <v-data-iterator :items="incidents" :items-per-page="itemsPerPage">
            <template v-slot:header>
              <v-list density="compact" v-if="$vuetify.display.smAndUp">
                <v-list-item>
                  <v-list-item-title>
                    <v-row no-gutters class="text-body-2 px-lg-2">
                      <v-col
                        v-for="(col, idx) in columnHeaderIncident"
                        :key="idx"
                        cols="12"
                        :lg="col.lg"
                        :md="col.md"
                        :sm="col.sm"
                        class="text-capitalize white--text text"
                      >
                        <v-row
                          no-gutters
                          class="fill-height"
                          align-content="center"
                        >
                          <span
                            class="d-inline-block text-capitalize font-weight-bold mr-1"
                            style="word-break: break-word; white-space: normal"
                          >
                            {{ col.title }}
                          </span>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </template>

            <template #default="{ items }">
              <v-divider />
              <v-list class="pa-0">
                <template
                  v-for="(item, itemIndex) in items"
                  :key="item.raw._id"
                >
                  <v-list-item
                    :class="
                      $vuetify.display.smAndDown || $vuetify.display.md
                        ? 'py-2 border-md px-4 px-sm-2 rounded-lg mb-2 mx-2 my-2'
                        : 'py-1 px-2 px-lg-4 mx-2 my-0 text-body-2'
                    "
                  >
                    <v-list-item-title>
                      <v-row no-gutters align="center">
                        <!-- Column for ID -->
                        <v-col cols="12" sm="1" md="1" class="mb-2">
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
                            <span class="mr-2 d-flex d-sm-none font-weight-bold"
                              >Id:
                            </span>
                            <span
                              class="text-truncate font-weight-bold"
                              :style="
                                $vuetify.display.xs ? 'font-size: .8rem;' : ''
                              "
                              :class="
                                $vuetify.display.smAndUp ? 'text-body-2' : ''
                              "
                            >
                              {{ item.raw.reportId }}
                            </span>
                          </v-row>
                        </v-col>

                        <v-col cols="12" sm="3" md="2" class="mb-2">
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
                            <span class="mr-2 d-flex d-sm-none font-weight-bold"
                              >Submmitted by:
                            </span>
                            <span
                              class="text-truncate"
                              :style="
                                $vuetify.display.smAndDown
                                  ? 'font-size: .8rem;'
                                  : ''
                              "
                            >
                              <v-avatar
                                size="small"
                                :color="materialColors[itemIndex]"
                                class="mr-4"
                              >
                                {{
                                  getInitial(
                                    `${item.raw.incidentInformation?.siteInfo.submittedBy}`,
                                  )
                                }}
                              </v-avatar>
                              <span
                                class="text-truncate text-body-2"
                                style="
                                  word-break: break-word;
                                  white-space: normal;
                                "
                              >
                                {{
                                  item.raw.incidentInformation?.siteInfo
                                    .submittedBy
                                }}
                              </span>
                            </span>

                            <span
                              class="text-truncate w-100 mt-1"
                              :style="
                                $vuetify.display.smAndDown
                                  ? 'font-size: .8rem;'
                                  : ''
                              "
                              v-if="$vuetify.display.sm"
                            >
                              <span
                                style="
                                  word-break: break-word;
                                  white-space: normal;
                                "
                                class="text-capitalize mr-2"
                                :class="
                                  $vuetify.display.smAndUp ? 'text-body-2' : ''
                                "
                              >
                                <v-icon color="error"> mdi-alert </v-icon>
                                {{
                                  item.raw.incidentInformation
                                    ?.incidentTypeAndTime.typeOfIncident
                                }}
                              </span>
                            </span>
                          </v-row>
                        </v-col>

                        <v-col
                          cols="12"
                          md="2"
                          class="mb-2"
                          v-if="$vuetify.display.xs || $vuetify.display.mdAndUp"
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
                            <span class="mr-2 d-flex d-sm-none font-weight-bold"
                              >Incident Type:
                            </span>
                            <span
                              class="text-truncate"
                              :style="
                                $vuetify.display.smAndDown
                                  ? 'font-size: .8rem;'
                                  : ''
                              "
                            >
                              <span
                                style="
                                  word-break: break-word;
                                  white-space: normal;
                                "
                                class="text-capitalize mr-2"
                                :class="
                                  $vuetify.display.smAndUp ? 'text-body-2' : ''
                                "
                              >
                                <v-icon color="error"> mdi-alert </v-icon>
                                {{
                                  item.raw.incidentInformation
                                    ?.incidentTypeAndTime.typeOfIncident
                                }}
                              </span>
                            </span>
                          </v-row>
                        </v-col>

                        <v-col cols="12" sm="4" md="2" class="mb-2">
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
                            <span class="mr-2 d-flex d-sm-none font-weight-bold"
                              >Date & Time:
                            </span>
                            <span
                              class="text-truncate"
                              :style="
                                $vuetify.display.smAndDown
                                  ? 'font-size: .8rem;'
                                  : ''
                              "
                            >
                              <span
                                :class="
                                  $vuetify.display.smAndUp ? 'text-body-2' : ''
                                "
                              >
                                <v-icon color="green">
                                  mdi-calendar-month-outline
                                </v-icon>
                                {{
                                  formatDateAndTimeSG(
                                    `${item.raw.incidentInformation.submissionForm?.dateOfReport} ${item.raw.incidentInformation.submissionForm?.time}`,
                                  )
                                }}
                              </span>
                            </span>

                            <span
                              class="text-truncate w-100 mt-1"
                              :style="
                                $vuetify.display.smAndDown
                                  ? 'font-size: .8rem;'
                                  : ''
                              "
                              :class="
                                $vuetify.display.smAndUp ? 'text-body-2' : ''
                              "
                              v-if="$vuetify.display.sm"
                            >
                              <span
                                style="
                                  word-break: break-word;
                                  white-space: normal;
                                "
                                class="d-flex align-center mr-2"
                              >
                                <v-icon> mdi-office-building-marker </v-icon>
                                {{
                                  item.raw.incidentInformation.placeOfIncident
                                    ?.block.name
                                }}-
                                {{
                                  item.raw.incidentInformation.placeOfIncident
                                    ?.level.level
                                }}-
                                {{
                                  item.raw.incidentInformation.placeOfIncident
                                    ?.unit.name
                                }}
                              </span>
                            </span>
                          </v-row>
                        </v-col>

                        <v-col
                          cols="12"
                          md="2"
                          class="mb-2"
                          v-if="$vuetify.display.xs || $vuetify.display.mdAndUp"
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
                            <span class="mr-2 d-flex d-sm-none font-weight-bold"
                              >Incident Location:
                            </span>
                            <span
                              class="text-truncate"
                              :style="
                                $vuetify.display.smAndDown
                                  ? 'font-size: .8rem;'
                                  : ''
                              "
                              :class="
                                $vuetify.display.smAndUp ? 'text-body-2' : ''
                              "
                            >
                              <span
                                style="
                                  word-break: break-word;
                                  white-space: normal;
                                "
                                class="d-flex align-center mr-2"
                              >
                                <v-icon> mdi-office-building-marker </v-icon>
                                {{
                                  item.raw.incidentInformation.placeOfIncident
                                    ?.block.name
                                }}-
                                {{
                                  item.raw.incidentInformation.placeOfIncident
                                    ?.level.level
                                }}-
                                {{
                                  item.raw.incidentInformation.placeOfIncident
                                    ?.unit.name
                                }}
                              </span>
                            </span>
                          </v-row>
                        </v-col>

                        <v-col cols="12" sm="3" md="2" class="mb-2">
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
                            <span class="mr-2 d-flex d-sm-none font-weight-bold"
                              >Status:
                            </span>
                            <span
                              class="text-truncate"
                              :style="
                                $vuetify.display.smAndDown
                                  ? 'font-size: .8rem;'
                                  : ''
                              "
                            >
                              <v-chip
                                class="text-capitalize"
                                :color="
                                  item.raw.status === 'pending'
                                    ? 'orange'
                                    : 'green'
                                "
                              >
                                {{ item.raw.status }}
                              </v-chip>
                            </span>
                          </v-row>
                        </v-col>

                        <v-col
                          cols="12"
                          sm="1"
                          md="1"
                          class="text-capitalize white--text text text-center"
                        >
                          <div class="d-flex align-center justify-center">
                            <v-btn
                              style="
                                border-radius: 8px;
                                border: 1px solid
                                  var(--black-004, rgba(0, 0, 0, 0.04));
                              "
                              flat
                              block
                              class="fs12 rounded-lg mx-3 border"
                              color="#1867C0"
                              @click="attachIR(item.raw)"
                            >
                              <span class="text-caption">
                                <span
                                  v-if="
                                    $vuetify.display.xs ||
                                    $vuetify.display.mdAndUp
                                  "
                                  >Attach IR</span
                                >
                                <v-icon v-if="$vuetify.display.sm"
                                  >mdi-attachment-plus</v-icon
                                >
                              </span>
                            </v-btn>
                          </div>
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
          </v-data-iterator>
        </g-card>
        <v-col cols="12" class="pa-4">
          <!-- footer page of v-data-iteration -->
          <FooterPagination
            @next-page="
              nextPage({
                site: mySite,
                status: 'approved&&pending',
              })
            "
            @prev-page="
              prevPage({
                site: mySite,
                status: 'approved&&pending',
              })
            "
            :pageRange="pageRange"
            :page="page"
            :pages="pages"
          />
        </v-col>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

let props = defineProps({
  isConfirmModal: {
    type: Boolean,
    default: false,
  },
});

const {
  dateSelected,
  incidents,
  search,
  setIncidents,
  itemsPerPage,
  nextPage,
  prevPage,
  pageRange,
  page,
  pages,
  isTableLoading,
} = useIncident();
const { currentUser } = useLocalAuth();
const { getInitial, materialColors, formatDateAndTime, formatDateAndTimeSG } =
  useUtils();
const { getSitesOptionsForFiltering, siteOptions, filterSite, mySite } =
  useFilter();
const isDialogVisible = computed(() => props.isConfirmModal);
const isConfirmModalAttach = ref(false);

const isLgAndUp = ref(window.innerWidth >= 960);

window.addEventListener("resize", () => {
  isLgAndUp.value = window.innerWidth >= 960;
});

const columnHeaderIncident = computed(() => {
  const baseHeaders = [
    {
      sm: "1",
      md: "1",
      lg: "1",
      title: "ID",
      align: "left",
      visible: true,
    },
    {
      sm: "3",
      md: "2",
      lg: "2",
      title: "Submitted By / Incident Type",
      align: "left",
      visible: true,
    },
    {
      sm: "4",
      md: "2",
      lg: "2",
      title: "Date & Time / Incident Location",
      align: "left",
      visible: true,
    },
    {
      sm: "3",
      md: "2",
      lg: "2",
      title: "Status",
      align: "left",
      visible: true,
    },
  ];
  if (isLgAndUp.value) {
    baseHeaders[1].title = "Submitted By";
    baseHeaders[2].title = "Date & Time";
    baseHeaders.splice(2, 0, {
      sm: "3",
      md: "2",
      lg: "2",
      title: "Incident Type",
      align: "left",
      visible: true,
    });
    baseHeaders.splice(4, 0, {
      sm: "3",
      md: "2",
      lg: "2",
      title: "Incident Location",
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
const selectDateFrom = ref(new Date());

const emit = defineEmits(["submitData", "closeModal", "viewIr"]);
onMounted(async () => {
  await getSitesOptionsForFiltering();
  await setIncidents({
    site: mySite.value,
    status: "approved&&pending",
  });
});
const selectData = ref({});
async function attachIR(data: any) {
  selectData.value = data;
  isConfirmModalAttach.value = true;
  emit("submitData", data);
}

async function submitAttach(data: any) {
  emit("submitData", selectData.value);
  isConfirmModalAttach.value = false;
}

async function viewIr(data: any) {
  emit("viewIr", data);
}

const hideModal = () => {
  emit("closeModal", false);
};

function onSearch(val: string) {
  debouncedSearch(val);
}

const debouncedSearch = debounce(async (value: string) => {
  search.value = value;
  await setIncidents({
    site: mySite.value,
    status: "approved&&pending",
  });
}, 500);

async function onSelectDate(value: Date) {
  dateSelected.value = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));

  await setIncidents({
    site: mySite.value,
    status: "approved&&pending",
  });
}

async function callItBack() {
  await setIncidents({
    site: mySite.value,
    status: "approved&&pending",
  });
}
</script>
