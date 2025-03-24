<template>
  <v-dialog max-width="1500" v-model="isDialogVisible" persistent>
    <v-card class="rounded-xl" min-height="600px">
      <v-toolbar>
        <v-toolbar-title>
          <v-btn icon="mdi-arrow-left" elevation="0" @click="hideModal"></v-btn>

          <span class="text-h6 d-none d-md-inline-flex"> Incidents </span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-row align="center" justify="end">
          <v-col cols="3" md="6" lg="6">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="dateSelected"
                  v-bind="props"
                  hide-details
                  @click:clear="callItBack()"
                  clearable
                  density="compact"
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

          <v-col cols="9" md="6" lg="6">
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
              <v-list density="compact" v-if="$vuetify.display.mdAndUp">
                <v-list-item class="pt-4 px-8">
                  <v-list-item-title>
                    <v-row no-gutters class="pb-4">
                      <v-col
                        v-for="(col, idx) in columnHeaderIncident"
                        :key="idx"
                        cols="12"
                        :md="col.md"
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
                  :key="item.raw._id"
                >
                  <v-list-item>
                    <v-list-item-title>
                      <v-row no-gutters class="align-center">
                        <!-- Column for ID -->
                        <v-col
                          cols="12"
                          md="1"
                          :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
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
                            <span class="mr-2 d-flex d-md-none font-weight-bold"
                              >Id:
                            </span>
                            <span
                              class="text-truncate mt-1"
                              :style="
                                $vuetify.display.smAndDown
                                  ? 'font-size: .8rem;'
                                  : ''
                              "
                            >
                              {{ item.raw.reportId }}
                            </span>
                          </v-row>
                        </v-col>

                        <v-col
                          cols="12"
                          md="2"
                          :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
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
                            <span class="mr-2 d-flex d-md-none font-weight-bold"
                              >Submmitted by:
                            </span>
                            <span
                              class="text-truncate mt-1"
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
                                    item.raw.incidentInformation?.siteInfo
                                      .submittedBy || "",
                                  )
                                }}
                              </v-avatar>
                              <span
                                class="text-truncate mt-1"
                                :style="{
                                  maxWidth: $vuetify.display.lgAndUp
                                    ? '180px'
                                    : '160px',
                                }"
                              >
                                {{
                                  item.raw.incidentInformation?.siteInfo
                                    .submittedBy || "N/A"
                                }}
                              </span>
                            </span>
                          </v-row>
                        </v-col>

                        <v-col
                          cols="12"
                          md="2"
                          :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
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
                            <span class="mr-2 d-flex d-md-none font-weight-bold"
                              >Incident Type:
                            </span>
                            <span
                              class="text-truncate mt-1"
                              :style="
                                $vuetify.display.smAndDown
                                  ? 'font-size: .8rem;'
                                  : ''
                              "
                            >
                              {{
                                item.raw.incidentInformation
                                  ?.incidentTypeAndTime.typeOfIncident
                              }}
                            </span>
                          </v-row>
                        </v-col>

                        <v-col
                          cols="12"
                          md="2"
                          :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
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
                            <span class="mr-2 d-flex d-md-none font-weight-bold"
                              >Date & Time:
                            </span>
                            <span
                              class="text-truncate mt-1"
                              :style="
                                $vuetify.display.smAndDown
                                  ? 'font-size: .8rem;'
                                  : ''
                              "
                            >
                              {{
                                formatDateAndTimeSG(
                                  `${item.raw.incidentInformation.submissionForm?.dateOfReport} ${item.raw.incidentInformation.submissionForm?.time}`,
                                )
                              }}
                            </span>
                          </v-row>
                        </v-col>

                        <v-col
                          cols="12"
                          md="2"
                          :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
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
                            <span class="mr-2 d-flex d-md-none font-weight-bold"
                              >Incident Location:
                            </span>
                            <span
                              class="text-truncate mt-1"
                              :style="
                                $vuetify.display.smAndDown
                                  ? 'font-size: .8rem;'
                                  : ''
                              "
                            >
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
                          </v-row>
                        </v-col>

                        <v-col
                          cols="12"
                          md="1"
                          :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
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
                            <span class="mr-2 d-flex d-md-none font-weight-bold"
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
                          md="2"
                          class="text-capitalize white--text text text-center"
                        >
                          <div class="d-flex align-center justify-center">
                            <v-btn
                              flat
                              class="fs12 text-black rounded-lg mx-3 border"
                              color="#fff"
                              type="submit"
                              variant="outlined"
                              target="_blank"
                              @click="viewIr(item.raw)"
                            >
                              <!-- :to="{ name: 'incidents-id-download', params: { id: item.raw._id } }" -->
                              View
                            </v-btn>

                            <v-btn
                              style="
                                border-radius: 8px;
                                border: 1px solid
                                  var(--black-004, rgba(0, 0, 0, 0.04));
                              "
                              flat
                              class="fs12 rounded-lg mx-3 border"
                              color="#1867C0"
                              @click="attachIR(item.raw)"
                            >
                              Attach
                            </v-btn>
                          </div>
                        </v-col>
                      </v-row>
                    </v-list-item-title>
                  </v-list-item>

                  <v-divider v-if="itemIndex + 1 !== items.length"></v-divider>
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

    <DigitalPassword
      @confirm-sign="submitAttach($event)"
      @close-modal="isConfirmModalAttach = false"
      :isConfirmModal="isConfirmModalAttach"
      :isConfirmTitle="`Confirm your digital signature with password`"
    />
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
const columnHeaderIncident = computed(() => {
  return [
    {
      md: "1",
      title: "ID",
      align: "left",
    },
    {
      md: "2",
      title: "Submitted By",
      align: "left",
    },
    {
      md: "2",
      title: "Incident Type",
      align: "left",
    },
    {
      md: "2",
      title: "Date & Time",
      align: "left",
    },
    {
      md: "2",
      title: "Incident Location",
      align: "left",
    },
    {
      md: "1",
      title: "Status",
      align: "center",
    },
    {
      md: "2",
      title: "Actions",
      align: "center",
    },
  ];
});
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
  // emit('submitData',data)
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
