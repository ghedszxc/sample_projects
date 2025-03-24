<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <base-table
        :items="accessCards"
        :headers="headers"
        :itemPerPage="10"
        :pageRange="pageRange"
        :page="page"
        :pages="pages"
        :isLoading="isAccessCardLoading"
        noDataMsg="You don't have any access cards yet."
        noDataImg="/empty.svg"
        @next-page="onNext"
        @prev-page="onPrev"
      >
        <template #customHeader>
          <v-row no-gutters class="px-4 pa-4" align="center">
            <v-col cols="12" md="5">
              <v-row no-gutters align="center">
                <v-col
                  cols="12"
                  sm="6"
                  :class="$vuetify.display.xs ? 'pb-2' : ''"
                >
                  <span class="font-weight-bold">
                    Resident / Tenant NFC Card
                  </span></v-col
                >
                <v-col cols="12" sm="6"
                  ><v-text-field
                    v-model="search"
                    placeholder="Search name, id"
                    hide-details
                    density="compact"
                    append-inner-icon="mdi-magnify"
                  >
                  </v-text-field
                ></v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="7">
              <v-row
                no-gutters
                align="center"
                :class="`${$vuetify.display.smAndDown ? 'pt-4 px-2' : 'justify-end'}`"
              >
                <v-col cols="12" sm="4"
                  ><span class="text-body-2">
                    Assigned Physical NFC Card
                    <span class="text-body-1 ml-2">
                      {{ 200 }}
                      <v-icon
                        class="ml-2 pb-1 cursor-pointer"
                        color="primary"
                        size="medium"
                      >
                        mdi-eye
                      </v-icon>
                    </span>
                  </span></v-col
                >
                <v-col cols="12" sm="4"
                  ><span class="text-body-2">
                    Available Physical NFC Card
                    <span class="text-body-1 ml-2">
                      {{ 100 }}
                      <v-icon
                        class="ml-2 pb-1 cursor-pointer"
                        color="primary"
                        size="medium"
                      >
                        mdi-eye
                      </v-icon>
                    </span>
                  </span></v-col
                >
                <v-col cols="12" sm="4" md="3">
                  <v-btn
                    color="blue-darken-3"
                    block
                    variant="flat"
                    size="small"
                    style="height: 40px"
                    :class="$vuetify.display.xs ? 'mt-4' : ''"
                    @click="onShowAddAccessCardDialog()"
                  >
                    Add Access Card
                  </v-btn>
                  <entry-pass-add-nfc-access-card-dialog></entry-pass-add-nfc-access-card-dialog>
                  <entry-pass-available-access-card-dialog></entry-pass-available-access-card-dialog>
                  <entry-pass-assigned-access-card-dialog></entry-pass-assigned-access-card-dialog>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </template>
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
                            $vuetify.display.smAndDown
                              ? 'space-between'
                              : 'start'
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
                            $vuetify.display.smAndDown
                              ? 'space-between'
                              : 'start'
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
                            $vuetify.display.smAndDown
                              ? 'space-between'
                              : 'start'
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
                            $vuetify.display.smAndDown
                              ? 'space-between'
                              : 'start'
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
  </v-row>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

const {
  page,
  isAccessCardLoading,
  search,
  accessCards,
  pageRange,
  pages,
  isAccessCardDialog,
  openDialog,
  getAccessCards,
} = useEntryPass();
const { stringToColor, getInitial, standardFormatDate } = useUtils();
const { assignDialog, selectedCardItem } = useBlockLevelUnit();

const emit = defineEmits(["addNfcCard", "nextPage", "prevPage"]);

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

const debouncedSearch = debounce(async (value: string) => {
  page.value = 1;
  await getAccessCards({
    page: page.value,
    site: mySite.value,
    type: "residents-tenants",
    search: value,
  });
}, 500);

const { mySite } = useFilter();
onMounted(async () => {
  page.value = 1;
  await getAccessCards({
    page: page.value,
    site: mySite.value,
    type: "residents-tenants",
  });
});

async function onAssign(data: any) {
  selectedCardItem.value = data;
  assignDialog.value = true;
}

async function onShowAddAccessCardDialog() {
  isAccessCardDialog.value = true;
  openDialog.value = "Resident/Tenant";
}

function onPrev() {
  page.value--;

  getAccessCards({
    page: page.value,
    site: mySite.value,
    type: "residents-tenants",
  });
}

function onNext() {
  page.value++;

  getAccessCards({
    page: page.value,
    site: mySite.value,
    type: "residents-tenants",
  });
}
</script>
