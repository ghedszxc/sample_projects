<template>
  <v-dialog
    max-width="1500"
    v-model="isShowOccurrenceEntryDialog"
    persistent
    v-bind="$attrs"
  >
    <v-card class="rounded-xl" min-height="600px">
      <v-toolbar color="white" class="rounded-xl">
        <v-btn
          icon="mdi-arrow-left"
          elevation="0"
          @click="hideDialog()"
        ></v-btn>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="hideDialog()"></v-btn>
      </v-toolbar>
      <v-card-text class="py-0 px-1">
        <g-card :loading="isTableLoading" :elevation="0">
          <v-data-iterator :items="searchOccurrencesEntry" :items-per-page="-1">
            <template v-slot:header>
              <v-list density="compact" v-if="$vuetify.display.mdAndUp">
                <v-list-item class="pt-4 px-8">
                  <v-list-item-title>
                    <v-row no-gutters class="pb-4">
                      <v-col
                        v-for="(col, idx) in columnHeader"
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
                  <v-list-item class="py-4 px-8">
                    <v-list-item-title>
                      <v-row no-gutters class="align-center">
                        <!-- Column for ID -->
                        <v-col
                          cols="12"
                          md="1"
                          class="text-capitalize white--text text d-flex align-center"
                        >
                          {{ item.raw.occurrenceId }}
                        </v-col>
                        <v-col
                          cols="12"
                          md="1"
                          class="text-capitalize white--text text d-flex align-center text-lowercase"
                        >
                          {{ item.raw.serialNumber }}
                          {{ item.raw?.version ? item.raw?.version : "" }}
                        </v-col>
                        <v-col
                          cols="12"
                          md="1"
                          class="text-capitalize white--text text d-flex align-center"
                        >
                          {{ formatDateSG(item.raw.date) }}
                        </v-col>
                        <v-col
                          cols="12"
                          md="1"
                          class="text-capitalize white--text text d-flex align-center"
                        >
                          {{ formatTime24(item.raw.date) }}
                        </v-col>
                        <v-col
                          cols="12"
                          md="2"
                          class="text-capitalize white--text text d-flex align-center"
                        >
                          <span class="text-truncate pr-4">{{
                            typeof item.raw.subject === "object"
                              ? item.raw.subject.subject
                              : ""
                          }}</span>
                        </v-col>

                        <v-col
                          cols="12"
                          md="4"
                          class="text-capitalize white--text text d-flex align-center text-wrap pr-5"
                        >
                          {{ item.raw.occurrence }}
                        </v-col>
                        <v-col
                          cols="12"
                          md="2"
                          class="text-capitalize white--text text d-flex align-center"
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
                      </v-row>
                    </v-list-item-title>
                  </v-list-item>
                  <v-divider v-if="itemIndex + 1 !== items.length"></v-divider>
                </template>
              </v-list>
            </template>
          </v-data-iterator>
        </g-card>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const {
  isTableLoading,
  searchOccurrencesEntry,
  isShowOccurrenceEntryDialog,
  searchEntries,
} = useOccurrenceEntry();
const { formatDateSG, formatTime24 } = useUtils();

const columnHeader = computed(() => {
  return [
    {
      md: "1",
      title: "Book No.",
      align: "left",
    },
    {
      md: "1",
      title: "S/No",
      align: "left",
    },
    {
      md: "1",
      title: "Date",
      align: "left",
    },
    {
      md: "1",
      title: "Time",
      align: "left",
    },
    {
      md: "2",
      title: "Subject",
      align: "left",
    },
    {
      md: "4",
      title: "Occurrence",
      align: "left",
    },
    {
      md: "2",
      title: "Signature",
      align: "left",
    },
  ];
});

function hideDialog() {
  isShowOccurrenceEntryDialog.value = false;
  searchEntries.value = "";
}
</script>
