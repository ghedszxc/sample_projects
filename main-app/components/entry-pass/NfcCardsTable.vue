<template>
  <v-col cols="12">
    <base-table
      :items="accessCards"
      :headers="headers"
      :itemPerPage="10"
      :pageRange="pageRange"
      :page="page"
      :pages="pages"
      :isLoading="false"
      noDataMsg="You don't have any access cards yet."
      noDataImg="/empty.svg"
      :elevation="0"
      @next-page="emit('nextPage')"
      @prev-page="emit('prevPage')"
    >
      <template #customHeader><div class="mt-n2"></div></template>
      <template #tableItems="{ items }">
        <v-list class="pa-0">
          <template v-for="(item, index) in items" :key="item.raw._id">
            <v-list-item
              :class="
                $vuetify.display.smAndDown || $vuetify.display.md
                  ? 'py-2 border-md px-2 rounded-lg mx-2 my-2'
                  : 'py-2 px-2 mx-2 my-0 text-body-2'
              "
            >
              <template #default>
                <v-list-item-title>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      sm="3"
                      class="text text-capitalize mb-2 mb-sm-0"
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
                          >Block / Level / Unit:
                        </span>
                        <span
                          :style="
                            $vuetify.display.smAndDown
                              ? 'font-size: .8rem;'
                              : ''
                          "
                          :class="`cursor-pointer ${$vuetify.display.mdAndUp ? 'text-body-2' : ''}`"
                        >
                          <v-icon color="primary" class="mr-2" size="large">
                            mdi-home-map-marker
                          </v-icon>
                          {{
                            `${item.raw.block.name} / ${item.raw.level.level} / ${item.raw.name}`
                          }}
                        </span>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="3"
                      class="text text-capitalize mb-2 mb-sm-0"
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
                          >Unit Owner:
                        </span>
                        <span
                          :style="
                            $vuetify.display.smAndDown
                              ? 'font-size: .8rem;'
                              : ''
                          "
                          :class="`text-capitalize ${$vuetify.display.mdAndUp ? 'text-body-2' : ''}`"
                        >
                          <v-icon class="mr-2" size="large">
                            mdi-home-account
                          </v-icon>
                          {{
                            item.raw.unit_owner
                              ? `${item.raw.unit_owner.givenName} ${item.raw.unit_owner.surname}`
                              : "N/A"
                          }}
                        </span>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="3"
                      class="text text-capitalize mb-2 mb-sm-0"
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
                          >Available Access Card:
                        </span>
                        <span
                          :style="
                            $vuetify.display.smAndDown
                              ? 'font-size: .8rem;'
                              : ''
                          "
                          :class="
                            $vuetify.display.mdAndUp
                              ? 'text-body-2'
                              : 'd-flex flex-column'
                          "
                        >
                          <span>{{
                            `(${item.raw.available.length > 0 ? item.raw.available[0].physical.length : 0}) Physical, `
                          }}</span>
                          <span>{{
                            `(${item.raw.available.length > 0 ? item.raw.available[0].non_physical.length : 0}) QR Code Access`
                          }}</span>
                        </span>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="2"
                      class="text text-capitalize mb-2 mb-sm-0"
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
                          >Assigned Access Card:
                        </span>
                        <span
                          :style="
                            $vuetify.display.smAndDown
                              ? 'font-size: .8rem;'
                              : ''
                          "
                          :class="
                            $vuetify.display.mdAndUp
                              ? 'text-body-2'
                              : 'd-flex flex-column'
                          "
                        >
                          <span>{{
                            `(${item.raw.assigned.length > 0 ? item.raw.assigned[0].physical.length : 0}) Physical, `
                          }}</span>
                          <span>{{
                            `(${item.raw.assigned.length > 0 ? item.raw.assigned[0].non_physical.length : 0}) QR Code Access`
                          }}</span>
                        </span>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="1"
                      class="text text-capitalize mb-2 mb-sm-0"
                    >
                      <v-row
                        no-gutters
                        class="fill-height"
                        align-content="center"
                        justify="end"
                      >
                        <v-menu>
                          <template v-slot:activator="{ props }">
                            <v-icon
                              density="compact"
                              v-bind="props"
                              class="rounded-xl border-md pa-4"
                            >
                              mdi-dots-vertical
                            </v-icon>
                          </template>
                        </v-menu>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-list-item-title>
              </template>
            </v-list-item>
            <v-divider
              v-if="index + 1 !== items.length && $vuetify.display.lgAndUp"
            ></v-divider>
          </template>
        </v-list>
      </template>
    </base-table>
  </v-col>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

const { page, isAccessCardLoading, search, pages, pageRange, accessCards } =
  useEntryPass();
const { stringToColor, getInitial, standardFormatDate } = useUtils();

const emit = defineEmits(["nextPage", "prevPage"]);

const actions = computed(() => []);
const headers = computed(() => {
  return [
    {
      sm: "3",
      title: "Block / Level / Unit",
      align: "left",
      visible: true,
    },
    {
      sm: "3",
      title: "Unit Owner",
      align: "left",
      visible: true,
    },
    {
      sm: "3",
      title: "Available Access Card",
      align: "left",
      visible: true,
    },
    {
      sm: "3",
      title: "Assigned Access Card",
      align: "left",
      visible: true,
    },
    {
      sm: "1",
      title: "Actions",
      align: "center",
      visible: false,
    },
  ];
}) as unknown as {
  sm: string;
  md: string;
  title: string;
  align: string;
  visible: boolean;
}[];

watch(search, (newValue: string) => {
  debouncedSearch(newValue);
});

const debouncedSearch = debounce(async (value: string) => {}, 500);
</script>
