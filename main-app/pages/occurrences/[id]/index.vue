<template>
  <v-row no-gutters class="pa-8 h-100">
    <v-col cols="12">
      <g-card :loading="isTableLoading">
        <v-row no-gutters>
          <template
            v-if="/^(leader|service-provider)$/i.test(currentUser.type)"
          >
            <v-col cols="12">
              <v-row no-gutters class="pa-4" justify="space-between">
                <v-col cols="12" sm="8" md="6" lg="7">
                  <v-row no-gutters align="center">
                    <v-col cols="12" md="6" v-if="$vuetify.display.smAndDown">
                      <span class="font-weight-bold text-h6">
                        DOB for
                        <span class="text-blue font-weight-medium">
                          {{ formatDate(occurrence.date) }}</span
                        >
                      </span>
                    </v-col>

                    <v-col cols="12" md="6" class="d-flex">
                      <span
                        class="font-weight-medium text-h6 mr-6 pt-1"
                        v-if="$vuetify.display.mdAndUp"
                      >
                        DOB for
                        <span class="text-blue font-weight-medium">
                          {{ formatDate(occurrence.date) }}</span
                        >
                      </span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" sm="4" md="6" lg="5" class="mt-4 mt-sm-0">
                  <v-row align="center" justify="end">
                    <v-col
                      cols="12"
                      md="6"
                      lg="4"
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
              </v-row>
            </v-col>
          </template>

          <v-divider></v-divider>

          <v-col cols="12">
            <v-row no-gutters style="min-height: 700px">
              <v-col
                cols="12"
                sm="12"
                class="mb-4"
                v-if="$vuetify.display.smAndDown && allowedEdit"
              >
                <v-row no-gutters>
                  <v-btn block color="primary" @click="toggleDobEntry">
                    {{ showDobEntry ? "Hide DOB Entry" : "Show DOB Entry" }}
                    <v-icon class="ml-2">
                      {{
                        showDobEntry ? "mdi-eye-off-outline" : "mdi-eye-outline"
                      }}
                    </v-icon>
                  </v-btn>
                </v-row>
              </v-col>
              <v-col
                v-if="($vuetify.display.lgAndUp || showDobEntry) && allowedEdit"
                cols="12"
                md="4"
              >
                <v-row no-gutters class="mt-4 h-100 border-e-md">
                  <v-card class="px-3 w-100" elevation="0">
                    <v-toolbar class="pr-3">
                      <span class="ml-3 text-h5">Daily Occurrence</span>
                    </v-toolbar>

                    <v-card-text class="px-0">
                      <v-row no-gutters class="h-100 align-center">
                        <DobEntryAddEntry
                          @add-data="submit($event)"
                          @cancel="cancelVersion()"
                          :isEdit="isEditMode"
                          :serialNumber="serialNumber"
                          :showButtonIfAllowed="showButtonIfAllowed"
                          :today="
                            formatDate(occurrence.date) ==
                            formatDate(new Date())
                              ? true
                              : false
                          "
                        ></DobEntryAddEntry>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-row>
              </v-col>
              <v-col
                cols="12"
                :lg="allowedEdit ? 8 : 12"
                :md="allowedEdit ? (showDobEntry ? '8' : '12') : '12'"
              >
                <template v-if="!isIncidentList">
                  <DobEntryOccurrenceEntry
                    @edit-data="getVersionId($event)"
                    @cross-data="updateCrossData($event)"
                    @direct-attach-ir="onDirectAttachIr($event)"
                    @create-ir="newIr()"
                    @attach-ir="attachIrModal($event)"
                    :isView="isView"
                    :showDobEntry="showDobEntry"
                    :allowedEdit="allowedEdit"
                    @toggle-dob-entry="toggleDobEntry"
                  ></DobEntryOccurrenceEntry>
                </template>

                <template>
                  <DobEntryCreateIncident
                    :isConfirmModal="isCreateIncident"
                    @close-modal="isCreateIncident = false"
                    @create-incident="updateDobIncident($event)"
                  />
                </template>

                <template>
                  <DobEntryIncident
                    :isConfirmModal="isAttachIncident"
                    @view-ir="viewIr($event)"
                    @submit-data="attachIR($event)"
                    @close-modal="isAttachIncident = false"
                  />
                </template>

                <template>
                  <IncidentsView
                    :isConfirmModal="isViewAttachIncident"
                    @close-modal="isViewAttachIncident = false"
                  />
                </template>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </g-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure", "incident"],
});
const { currentUser } = useLocalAuth();
const { formatDateAndTime, calculateRemainingTime, formatDate } = useUtils();
const { setSnackbar } = useLocal();
const { occurrence, getOccurrenceById, setOccurrence } = useOccurrence();
const { getIncidentById, setIncident } = useIncident();
const { setLogSubjects } = useLogSubject();
const {
  occurrenceEntry,
  isTableLoading,
  timeSelected,
  selectDateForm,
  addOccurrenceEntry,
  setOccurrenceEntry,
  dateSelectedForm,
  setOccurrencesEntry,
  isSigned,
  signedBy,
  isIncidentList,
  attachBy,
  getOccurrenceEntryGeneratedId,
  itemsPerPage,
  updateCrossOut,
  updateAttachIR,
  getIncrementedSerialNumber,
} = useOccurrenceEntry();
const { getSitesOptionsForFiltering, mySite, filterSite } = useFilter();
const route = useRoute();
const { $ability } = useNuxtApp();
const isEditMode = ref(false);
const isCreateIncident = ref(false);
const isAttachIncident = ref(false);
const isDirectAttachIr = ref(false);
const isViewAttachIncident = ref(false);
const incidentId = ref("");
const serialNumber = ref("");
const showDobEntry = ref(false);

const toggleDobEntry = () => {
  showDobEntry.value = !showDobEntry.value;
};

const isView = computed(() => {
  return ["admin", "organization"].includes(currentUser.value.type);
});
const dob = computed(() => (route.params.id ? String(route.params.id) : ""));
const allowedEdit = computed(() => {
  if (
    $ability.can("create", "create-dob") &&
    occurrence.value.status == "open"
  ) {
    return true;
  }
  return false;
});
const showButtonIfAllowed = computed(() => {
  let seconds = calculateRemainingTime(occurrence.value.date);
  const hours = Math.floor(seconds / 3600);
  if (hours < 48) {
    return false;
  }
  return true;
});

watch(occurrence, (newValue) => {
  dateSelectedForm.value = "";
});

onMounted(async () => {
  itemsPerPage.value = 100;
  const [_occurrence] = await Promise.all([
    await getOccurrenceById(dob.value),
    await getSitesOptionsForFiltering(),
  ]);
  await setOccurrence(_occurrence);
  const [_sNum] = await Promise.all([
    getIncrementedSerialNumber({
      id: occurrence.value._id || "",
      site: mySite.value || filterSite.value,
    }),
    setOccurrencesEntry({
      site: mySite.value || filterSite.value,
      dailyOccurrenceBookId: occurrence.value._id,
    }),

    setLogSubjects({
      site: mySite.value || filterSite.value,
    }),
  ]);

  resetOccurrenceEntry();
  occurrenceEntry.value.serialNumber = String(_sNum || "1");

  occurrenceEntry.value.date = new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
});

const updateDobIncident = async (data: any) => {
  await updateAttachIR({
    id: occurrenceEntry.value._id || "",
    site: mySite.value,
    attachmentId: data._id,
  });

  setOccurrencesEntry({
    site: mySite.value,
    dailyOccurrenceBookId: occurrence.value._id,
  });
};

const submit = async (data: any) => {
  try {
    let response = await addOccurrenceEntry(data);
    setSnackbar({
      text: "Successfully created occurrence",
      modal: true,
      type: "success",
    });
    const [_sNum] = await Promise.all([
      getIncrementedSerialNumber({
        id: occurrence.value._id || "",
        site: mySite.value,
      }),
      setOccurrencesEntry({
        site: mySite.value,
        dailyOccurrenceBookId: occurrence.value._id,
      }),
    ]);
    resetOccurrenceEntry();
    occurrenceEntry.value.serialNumber = _sNum?.toString() || "1";
    isEditMode.value = false;
    isDirectAttachIr.value = false;
    attachBy.value = "";
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
};

function newIr() {
  isCreateIncident.value = true;
}

function attachIrModal(data: any) {
  occurrenceEntry.value._id = data._id;
  isAttachIncident.value = true;
}
const cancelVersion = async () => {
  const [_sNum] = await Promise.all([
    getIncrementedSerialNumber({
      id: occurrence.value._id || "",
      site: mySite.value,
    }),
    setOccurrencesEntry({
      site: mySite.value,
      dailyOccurrenceBookId: occurrence.value._id,
    }),
  ]);
  resetOccurrenceEntry();
  occurrenceEntry.value.serialNumber = _sNum?.toString() || "1";
  isEditMode.value = false;
};

const getVersionId = async (data: TOccurrenceEntry) => {
  let response = await getOccurrenceEntryGeneratedId({
    site: mySite.value,
    dailyOccurrenceBookId: data.dailyOccurrenceBookId,
    serialNumber: data.serialNumber,
  });

  occurrenceEntry.value.serialNumber = data.serialNumber;
  occurrenceEntry.value.version = response;
  occurrenceEntry.value.subject = data.subject;
  isEditMode.value = true;
};

async function onDirectAttachIr(data: TOccurrenceEntry) {
  let response = await getOccurrenceEntryGeneratedId({
    site: mySite.value,
    dailyOccurrenceBookId: data.dailyOccurrenceBookId,
    serialNumber: data.serialNumber,
  });
  occurrenceEntry.value.serialNumber = data.serialNumber;
  occurrenceEntry.value.version = response;
  occurrenceEntry.value.subject = data.subject;
  isDirectAttachIr.value = true;
  isEditMode.value = true;
  isIncidentList.value = true;
}

const updateCrossData = async (data: any) => {
  await updateCrossOut({
    id: data._id,
    site: mySite.value,
    isCrossOut: !data.isCrossOut,
  });

  setOccurrencesEntry({
    site: mySite.value,
    dailyOccurrenceBookId: occurrence.value._id,
  });
};

async function resetOccurrenceEntry() {
  setOccurrenceEntry({
    site: mySite.value,
    dailyOccurrenceBookId: occurrence.value._id,
    serialNumber: "",
    date: formatDateAndTime(occurrence.value.date),
  } as TOccurrenceEntry);

  timeSelected.value = "";
  isSigned.value = false;
  signedBy.value = "";
  selectDateForm.value = new Date();
}

const attachIR = async (data: any) => {
  await updateAttachIR({
    id: occurrenceEntry.value._id || "",
    site: mySite.value,
    attachmentId: data._id,
  });

  const [_sNum] = await Promise.all([
    getIncrementedSerialNumber({
      id: occurrence.value._id || "",
      site: mySite.value,
    }),
    setOccurrencesEntry({
      site: mySite.value,
      dailyOccurrenceBookId: occurrence.value._id,
    }),
  ]);
  resetOccurrenceEntry();
  occurrenceEntry.value.serialNumber = _sNum?.toString() || "1";
  isAttachIncident.value = false;
};

const viewIr = async (data: any) => {
  incidentId.value = data._id;

  // const result = await getIncidentById(incidentId.value);
  // if (result) {
  //   setIncident(result);
  // } else {
  //   throw new Error("Failed to fetch incident data");
  // }
  if (data) {
    setIncident(data);
    isViewAttachIncident.value = true;
  } else {
    setSnackbar({
      text: "Failed to fetch incident data",
      modal: true,
      type: "error",
    });
  }
};
</script>

<style scoped>
.text {
  text-align: start;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}

:deep() .v-field__field {
  font-size: 14px;
}
</style>
