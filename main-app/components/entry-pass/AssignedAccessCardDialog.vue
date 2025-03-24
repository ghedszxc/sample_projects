<template>
  <v-dialog v-model="assignedAccessCardDialog" max-width="700">
    <v-card>
      <v-toolbar
        class="d-flex align-center px-4"
        :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`"
      >
        <span class="font-weight-bold pl-2 text-capitalize text-body-1">
          Assigned Access Card
        </span>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text>
        <v-text-field
          v-model="search"
          placeholder="Search name, id"
          hide-details
          density="compact"
          append-inner-icon="mdi-magnify"
        ></v-text-field>

        <v-data-iterator :page="1" :items="dummyItems" :items-per-page="10">
          <template v-slot:header>
            <v-list class="pa-0 mt-8" density="compact">
              <v-list-item>
                <v-list-item-title>
                  <v-row no-gutters>
                    <v-col cols="12" md="4">
                      <v-row
                        no-gutters
                        class="fill-height"
                        align-content="center"
                      >
                        <span
                          class="d-inline-block text-truncate text-capitalize text-body-2"
                        >
                          Block / Level / Unit
                        </span>
                      </v-row>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-row
                        no-gutters
                        class="fill-height"
                        align-content="center"
                      >
                        <span
                          class="d-inline-block text-truncate text-capitalize text-body-2"
                        >
                          Unit Owner
                        </span>
                      </v-row>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-row
                        no-gutters
                        class="fill-height"
                        align-content="center"
                      >
                        <span
                          class="d-inline-block text-truncate text-capitalize text-body-2"
                        >
                          Assigned Access Card
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
            <v-list class="pa-0 mt-2">
              <template v-for="(item, itemIndex) in items" :key="itemIndex">
                <v-list-item
                  class="rounded-sm my-2"
                  :style="{
                    border: $vuetify.display.mdAndUp
                      ? theme == 'light'
                        ? '1px solid #E0E0E0'
                        : '1px solid #424242'
                      : '',
                  }"
                >
                  <v-list-item-title>
                    <v-row no-gutters align="center">
                      <v-col cols="12" md="5" class="text-capitalize">
                        <v-row no-gutters align="center">
                          <span
                            class="text-capitalize text-body-2"
                            style="word-break: break-word; white-space: normal"
                          >
                            <v-icon color="primary" class="mr-2" size="large">
                              mdi-home-map-marker
                            </v-icon>
                            {{ item.raw.name }}
                          </span>
                        </v-row>
                      </v-col>

                      <v-col cols="12" md="5" class="text-capitalize">
                        <v-row no-gutters align="center">
                          <span
                            class="text-capitalize text-body-2"
                            style="word-break: break-word; white-space: normal"
                          >
                            <v-icon class="mr-2" size="large">
                              mdi-home-account
                            </v-icon>
                            {{ item.raw.unitOwner }}
                          </span>
                        </v-row>
                      </v-col>

                      <v-col cols="12" md="2" class="text-capitalize">
                        <v-row
                          no-gutters
                          class="fill-height"
                          align-content="center"
                        >
                          <span
                            class="d-inline-block text-truncate text-capitalize text-body-2"
                          >
                            {{ item.raw.assignedAccessCard }}
                          </span>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-list-item-title>
                </v-list-item>

                <v-divider v-if="itemIndex + 1 !== items.length"></v-divider>
              </template>
            </v-list>
          </template>

          <template #no-data>
            <v-row no-gutters justify="center" class="pa-16">
              <v-col cols="12">
                <v-row no-gutters justify="center">
                  <v-img
                    src="/images/empty-building-management-list.svg"
                    width="150px"
                    height="150px"
                  ></v-img>
                </v-row>
              </v-col>

              <v-col cols="12" class="mt-10">
                <v-row no-gutters justify="center">
                  <span class="font-weight-bold text-h5">
                    Assigned Access Card
                  </span>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-row no-gutters justify="center">
                  <span class="caption text-disabled">
                    You don't have list of assigned access card yet.
                  </span>
                </v-row>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import debounce from "lodash/debounce";

const { theme } = useLocal();
const { assignedAccessCardDialog } = useEntryPass();

const search = ref("");

watch(search, (newValue: string) => {
  debouncedSearch(newValue);
});

const debouncedSearch = debounce(async (value: string) => {
  // function of searching
}, 500);

const dummyItems = ref([
  { name: "28 / 30 / 02", unitOwner: "Harris West", assignedAccessCard: 23 },
  { name: "28 / 30 / 02", unitOwner: "Harris West", assignedAccessCard: 20 },
  { name: "28 / 30 / 02", unitOwner: "Harris West", assignedAccessCard: 20 },
  { name: "28 / 30 / 02", unitOwner: "Harris West", assignedAccessCard: 30 },
  { name: "28 / 30 / 02", unitOwner: "Harris West", assignedAccessCard: 12 },
  { name: "28 / 30 / 02", unitOwner: "Harris West", assignedAccessCard: 12 },
  { name: "28 / 30 / 02", unitOwner: "Harris West", assignedAccessCard: 12 },
  { name: "28 / 30 / 02", unitOwner: "Harris West", assignedAccessCard: 16 },
  { name: "28 / 30 / 02", unitOwner: "Harris West", assignedAccessCard: 15 },
  { name: "28 / 30 / 02", unitOwner: "Harris West", assignedAccessCard: 123 },
  { name: "28 / 30 / 02", unitOwner: "Harris West", assignedAccessCard: 123 },
]);
</script>
