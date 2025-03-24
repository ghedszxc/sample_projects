<template>
  <v-row no-gutters class="pa-8 h-100">
    <v-col cols="12">
      <g-card :loading="isTableLoading">
        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters class="pa-4" justify="space-between">
              <v-col cols="12" md="6" lg="7">
                <v-row no-gutters align="center">
                  <v-col cols="12" md="6" v-if="$vuetify.display.smAndDown">
                    <span class="font-weight-bold text-h6"> Today DOB </span>
                  </v-col>

                  <v-col cols="12" md="6" class="d-flex">
                    <span
                      class="font-weight-bold text-h6 mr-6 pt-1"
                      v-if="$vuetify.display.mdAndUp"
                    >
                      Today DOB
                    </span>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" md="6" lg="5">
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
                          site:  mySite,
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

          <v-divider></v-divider>

          <!-- form -->
          <v-col cols="12" v-if="occurrence._id">
            <v-row no-gutters style="min-height: 800px">
              <v-col
                v-if="$ability.can('create', 'create-dob')"
                cols="12"
                md="4"
                class="border-e-sm"
              >
                <v-row no-gutters class="mt-4 h-100 border-e-sm">
                  <v-card class="px-3 w-100" elevation="0">
                    <v-toolbar color="white" class="pr-3">
                      <span class="ml-3 text-h5 font-weight-bold"
                        >Daily Occurrence</span
                      >
                    </v-toolbar>

                    <v-card-text class="px-0">
                      <v-row no-gutters class="h-100 align-center">
                        <DobEntryAddEntry
                          @add-data="submit($event)"
                          @cancel="cancelVersion()"
                          :isEdit="isEditMode"
                          :serialNumber="serialNumber"
                          :today="true"
                        ></DobEntryAddEntry>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-row>
              </v-col>

              <v-col cols="12" :md="$ability.can('create', 'create-dob') ? '8' : '12'">
                <template v-if="!isIncidentList">
                  <DobEntryOccurrenceEntry
                    @edit-data="getVersionId($event)"
                    @cross-data="updateCrossData($event)"
                    @direct-attach-ir="onDirectAttachIr($event)"
                    @create-ir="newIr()"
                    @attach-ir="attachIrModal($event)"
                    :isView="isView"
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
                    @close-modal="closeAttachIR()"
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

          <v-col cols="12" v-else>
            <v-row no-gutters align="center" justify="center" class="pa-16">
              <v-col cols="12">
                <v-row no-gutters justify="center">
                  <v-img src="/empty.svg" width="100px" height="100px"></v-img>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-row no-gutters justify="center">
                  <span class="font-weight-bold">
                    No daily occurrence book open today. Please contact your
                    administrator
                  </span>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </g-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";
definePageMeta({
  middleware: ["secure", "dob", "incident"],
});

const { currentUser } = useLocalAuth();
const { formatDateAndTime } = useUtils();
const { setSnackbar } = useLocal();
const { occurrence } = useOccurrence();
const {
  occurrenceEntry,
  search,
  isTableLoading,
  timeSelected,
  isOccurrenceEntryValid,
  selectDateForm,
  addOccurrenceEntry,
  setOccurrenceEntry,
  setOccurrencesEntry,
  isSigned,
  signedBy,
  isIncidentList,
  getOccurrenceEntryGeneratedId,
  getIncrementedSerialNumber,
  updateCrossOut,
  updateAttachIR,
} = useOccurrenceEntry();
const { getIncidentById, setIncident } = useIncident();
const { setLogSubjects } = useLogSubject();
const { getSitesOptionsForFiltering, mySite, filterSite } = useFilter();
const { $ability } = useNuxtApp() 

const isEditMode = ref(false);
const isView = ref(false);
const isDirectAttachIr = ref(false);
const isCreateIncident = ref(false);
const isAttachIncident = ref(false);
const isViewAttachIncident = ref(false);
const incidentId = ref("");
const serialNumber = ref("");

onMounted(async () => {
  await getSitesOptionsForFiltering();
  const [_sNum] = await Promise.all([
    getIncrementedSerialNumber({
      id: occurrence.value._id || "",
      site: mySite.value,
    }),
    setOccurrencesEntry({
      site: mySite.value,
      dailyOccurrenceBookId: occurrence.value._id,
    }),

    setLogSubjects({
      site: mySite.value,
    }),
  ]);
  resetOccurrenceEntry();
  occurrenceEntry.value.serialNumber = _sNum?.toString() || "1";

});

function onSearch(val: string) {
  debouncedSearch(val);
}

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
}

const debouncedSearch = debounce(async (value: string) => {
  search.value = value;
  await setOccurrencesEntry({
    dailyOccurrenceBookId: occurrence.value._id,
  });
}, 500);

const submit = async (data: any) => {
  try {
    let response = await addOccurrenceEntry(data);
    setSnackbar({ text: "Successfully created occurrence", modal: true, type: "success" });
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
    isOccurrenceEntryValid.value = false;
    isDirectAttachIr.value = false;
    timeSelected.value = "";

  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
};

const getVersionId = async (data: TOccurrenceEntry) => {
  let response = await getOccurrenceEntryGeneratedId({
    dailyOccurrenceBookId: data.dailyOccurrenceBookId,
    serialNumber: data.serialNumber,
    site: mySite.value
  });

  occurrenceEntry.value.serialNumber = data.serialNumber;
  occurrenceEntry.value.version = response;
  occurrenceEntry.value.subject = data.subject;
  isEditMode.value = true;
};

async function onDirectAttachIr(data: TOccurrenceEntry) {
  let response = await getOccurrenceEntryGeneratedId({
    dailyOccurrenceBookId: data.dailyOccurrenceBookId,
    serialNumber: data.serialNumber,
    site: mySite.value
  });

  occurrenceEntry.value.serialNumber = data.serialNumber;
  occurrenceEntry.value.version = response;
  occurrenceEntry.value.subject = data.subject;
  isDirectAttachIr.value = true;
  isEditMode.value = true;
  isIncidentList.value = true;
}

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

const closeAttachIR = async () => {
  isAttachIncident.value = false
  const [_sNum] = await Promise.all([
      getIncrementedSerialNumber({
        id: occurrence.value._id || "",
        site: mySite.value,
      }),
    ]);

  occurrenceEntry.value.serialNumber = _sNum?.toString() || "1";

};

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
  const result = await getIncidentById(incidentId.value);
  if (typeof result !== "undefined") {
    setIncident(result);
  } else {
    throw new Error("Failed to fetch incident data");
  }
  isViewAttachIncident.value = true;
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
