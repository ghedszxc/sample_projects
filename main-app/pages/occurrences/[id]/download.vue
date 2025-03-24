<template>
  <v-row class="pa-5" style="background-color: rgba(255, 255, 255, 0.5)">
    <v-col cols="12" md="12">
      <v-data-iterator :items="newOccurrenceEntries" :items-per-page="-1">
        <template v-slot:header>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title>
                <v-row align="center" justify="center">
                  <v-col cols="12" md="6" class="text-h4"
                    >Daily Occurrence Book</v-col
                  >
                  <v-col cols="12" md="6" align="end">
                    <v-row align="center" justify="end">
                      <v-col cols="12" md="2">Date:</v-col>
                      <v-col cols="12" md="3" class="text-h4">{{
                        dobDate
                      }}</v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-list-item-title>
            </v-list-item>

            <v-divider />

            <v-list-item class="pt-4 px-8">
              <v-list-item-title>
                <v-row no-gutters class="pb-4">
                  <template v-for="(col, idx) in columnHeader" :key="idx">
                    <v-col
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
                        >
                          {{ col.title }}
                        </span>
                      </v-row>
                    </v-col>
                  </template>
                </v-row>
              </v-list-item-title>
            </v-list-item>

            <v-divider />
          </v-list>
        </template>

        <template #default="{ items }">
          <v-list class="pa-0">
            <template v-for="(item, itemIndex) in items" :key="item.raw._id">
              <v-list-item class="py-4 px-8">
                <v-list-item-title>
                  <v-row no-gutters class="align-start">
                    <!-- Column for ID -->
                    <v-col
                      cols="12"
                      md="1"
                      class="text-capitalize white--text text d-flex align-center text-lowercase"
                      :class="item.raw.isCrossOut ? 'cross-out' : ''"
                    >
                      {{ item.raw.serialNumber }}
                      {{ item.raw?.version ? item.raw?.version : "" }}
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      class="text-capitalize white--text text d-flex align-center"
                      :class="item.raw.isCrossOut ? 'cross-out' : ''"
                    >
                      {{ formatDateSG(item.raw.date) }}
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      class="text-capitalize white--text text d-flex align-center"
                      :class="item.raw.isCrossOut ? 'cross-out' : ''"
                    >
                      {{ formatTime24(item.raw.date) }}
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="text-capitalize white--text text d-flex align-center"
                      :class="item.raw.isCrossOut ? 'cross-out' : ''"
                    >
                      <span class="text-truncate pr-4">{{
                        typeof item.raw.subject === "object"
                          ? item.raw.subject.subject
                          : ""
                      }}</span>
                    </v-col>

                    <v-col
                      cols="12"
                      md="3"
                      class="text-capitalize white--text text d-flex align-center text-wrap pr-5"
                      :class="item.raw.isCrossOut ? 'cross-out' : ''"
                    >
                      {{ item.raw.occurrence }}
                    </v-col>

                    <v-col
                      cols="12"
                      md="2"
                      class="text-capitalize white--text text d-flex align-center"
                    >
                      <v-row
                        no-gutters
                        class="fill-height"
                        align-content="center"
                      >
                        <v-col
                          v-if="typeof item.raw.signature === 'object'"
                          cols="12"
                        >
                          <span
                            v-if="typeof item.raw.signature === 'object'"
                            class="text-truncate mt-1"
                            :style="{
                              maxWidth: $vuetify.display.lgAndUp
                                ? '180px'
                                : '160px',
                            }"
                          >
                            {{ item.raw.signature.givenName }}
                            {{ item.raw.signature.surname }}
                          </span>
                          <span v-else>Undefined Signature</span>
                        </v-col>
                        <v-col cols="12" v-if="item.raw.attachmentReport">
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
                                query: { site: mySite }
                              }"
                              target="_blank"
                              :color="
                                stringToColor(
                                  item.raw.attachmentReport.reportId || ''
                                )
                              "
                            >
                              {{ item.raw.attachmentReport.reportId }} -
                              {{
                                `"${item.raw.attachmentReport.incidentInformation.incidentTypeAndTime?.typeOfIncident}"`
                              }}
                            </nuxt-link>
                          </div>
                        </v-col>
                        <v-col cols="12">
                          <div
                            v-if="
                              Boolean(item.raw.attachmentReport) &&
                              typeof item.raw.attachmentReport === 'object'
                            "
                          >
                            <span
                              v-if="
                                Boolean(item.raw.attachmentReport.updatedAt)
                              "
                            >
                              {{
                                formatDateAndTimeSG(
                                  item.raw.attachmentReport.updatedAt || ""
                                )
                              }}
                            </span>
                            <span v-else>
                              {{
                                formatDateAndTimeSG(
                                  item.raw.attachmentReport.createdAt || ""
                                )
                              }}
                            </span>
                          </div>
                        </v-col>
                        <v-col cols="12">
                          <div
                            v-if="
                              Boolean(item.raw.attachmentReport) &&
                              typeof item.raw.attachmentReport === 'object' &&
                              /^(pending|approve|approved)$/i.test(
                                item.raw.attachmentReport.status || ''
                              )
                            "
                          >
                            <span
                              :class="
                                /^(pending)$/i.test(
                                  item.raw.attachmentReport.status || ''
                                )
                                  ? 'text-orange'
                                  : 'text-green'
                              "
                              >{{ item.raw.attachmentReport.status }}</span
                            >
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col
                      cols="12"
                      md="1"
                      class="text-capitalize white--text text d-flex align-center text-wrap pr-5"
                      :class="item.raw.isCrossOut ? 'cross-out' : ''"
                    >
                      {{ item.raw.createdAt || "" }}
                    </v-col>
                  </v-row>
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </template>
      </v-data-iterator>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "plain",
});
const { formatDate, formatTime24, stringToColor, formatDateSG } = useUtils();
const { setOccurrencesEntry, occurrencesEntry, dateSelectedForm } =
  useOccurrenceEntry();
const { getOccurrenceById } = useOccurrence();
const { getSitesOptionsForFiltering, mySite } = useFilter();
const route = useRoute();

const columnHeader = computed(() => {
  return [
    {
      md: "1",
      title: "S/No",
      align: "left",
      visible: true,
    },
    {
      md: "1",
      title: "Date",
      align: "left",
      visible: true,
    },
    {
      md: "1",
      title: "Time",
      align: "left",
      visible: true,
    },
    {
      md: "2",
      title: "Subject",
      align: "left",
      visible: true,
    },
    {
      md: "3",
      title: "Occurrence",
      align: "left",
      visible: true,
    },
    {
      md: "2",
      title: "Signature",
      align: "left",
      visible: true,
    },
    {
      md: "1",
      title: "Timestamp",
      align: "left",
      visible: true,
    },
  ];
});
const dobDate = ref();
const newOccurrenceEntries = computed(() => {
  const value = occurrencesEntry.value.map((item) => {
    return {
      ...item,
      createdAt: formatDateAndTimeSG(item.createdAt || ""),
      updatedAt: formatDateAndTimeSG(item.updatedAt || ""),
    };
  });
  return value;
});

onMounted(async () => {
  dateSelectedForm.value = "";
  const id = route.params.id ? String(route.params.id) : "";
  const site = route.query.site ? String(route.query.site) : "";
  await getSitesOptionsForFiltering();
  const [occurrence] = await Promise.all([
    getOccurrenceById(id),
    setOccurrencesEntry({
      site: site,
      dailyOccurrenceBookId: id,
      date: "",
    }),
  ]);
  dobDate.value = occurrence && formatDate(occurrence.createdAt || "");
});

function formatDateAndTimeSG(value: string | Date) {
  if (!value) return;
  const dateTime = new Date(value);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const hours = dateTime.getHours().toString().padStart(2, "0");
  const minutes = dateTime.getMinutes().toString().padStart(2, "0");
  return `${dateTime.toLocaleDateString("en-SG", options)} ${hours}${minutes}h`;
}
</script>

<style scoped>
.cross-out {
  text-decoration: line-through;
}
</style>
