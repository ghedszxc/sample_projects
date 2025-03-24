<template>
  <v-col cols="12">
    <base-table
      :items="nfcList"
      :headers="headers"
      :itemPerPage="10"
      :pageRange="pageRangeNfc"
      :page="page"
      :pages="pageNfc"
      :isLoading="isAccessCardLoading"
      noDataMsg="You don't have any access cards yet."
      noDataImg="/empty.svg"
      :elevation="0"
    >
      <template #customHeader>
        <v-row no-gutters class="px-4 pb-4">
          <v-col cols="12" sm="6">
            <v-row no-gutters align="center" class="ga-4">
              <span class="font-weight-bold text-h6 text-truncate">
                Access Card
              </span>
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
          <v-col cols="12" sm="6">
            <v-row align="center" justify="end">
              <v-col cols="12" md="4" sm="6">
                <v-btn
                  color="blue-darken-3"
                  block
                  variant="flat"
                  size="small"
                  style="height: 40px"
                  :class="$vuetify.display.xs ? 'mt-4' : ''"
                  @click="emit('addNfcCard')"
                  >Add NFC Card</v-btn
                ></v-col
              >
            </v-row>
          </v-col>
        </v-row>
      </template>
      <template #tableItems="{ items }">
        <v-list class="pa-0">
          <template v-for="(item, index) in items" :key="item.raw.cardNo">
            <v-list-item
              :class="
                $vuetify.display.smAndDown || $vuetify.display.md
                  ? 'py-2 border-md px-2 rounded-lg mx-2 my-2'
                  : 'py-4 px-2 mx-2 my-0 text-body-2'
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
                          >NFC Card:
                        </span>
                        <span
                          :style="
                            $vuetify.display.smAndDown
                              ? 'font-size: .8rem;'
                              : ''
                          "
                          :class="`text-primary cursor-pointer ${$vuetify.display.mdAndUp ? 'text-body-2' : ''}`"
                        >
                          {{ item.raw.cardNo }}
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
                          >Access By:
                        </span>
                        <span
                          :style="
                            $vuetify.display.smAndDown
                              ? 'font-size: .8rem;'
                              : ''
                          "
                          :class="`text-capitalize ${$vuetify.display.mdAndUp ? 'text-body-2' : ''}`"
                        >
                          <v-avatar
                            v-if="item.raw.accessBy"
                            size="small"
                            :color="stringToColor(item.raw.accessBy)"
                            class="mr-2"
                          >
                            {{
                              getInitial(
                                `${item.raw.accessBy.givenName} ${item.raw.accessBy.surname}`,
                              )
                            }}
                          </v-avatar>
                          {{
                            `${item.raw.accessBy.givenName} ${item.raw.accessBy.surname}` ||
                            "--"
                          }}
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
                          >Category:
                        </span>
                        <span
                          :style="
                            $vuetify.display.smAndDown
                              ? 'font-size: .8rem;'
                              : ''
                          "
                          :class="`text-capitalize ${$vuetify.display.mdAndUp ? 'text-body-2' : ''}`"
                        >
                          {{ item.raw.accessBy.type || "--" }}
                        </span>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="2"
                      md="3"
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
                          >Date Assigned:
                        </span>
                        <span
                          :style="
                            $vuetify.display.smAndDown
                              ? 'font-size: .8rem;'
                              : ''
                          "
                          :class="$vuetify.display.mdAndUp ? 'text-body-2' : ''"
                        >
                          {{ item.raw.dateOfJoin || "--" }}
                        </span>
                      </v-row>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="2"
                      md="1"
                      class="text text-capitalize mb-2 mb-sm-0"
                    >
                      <v-btn
                        block
                        variant="flat"
                        size="small"
                        style="height: 40px"
                        :class="`${!item.raw.accessBy && 'border rounded-lg'} w-100`"
                        :disabled="item.raw.accessBy"
                        @click="onAssign(item.raw)"
                        >{{ item.raw.accessBy ? "Assigned" : "Assign" }}</v-btn
                      >
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

    <building-assign-nfc />
  </v-col>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

const {
  page,
  isAccessCardLoading,
  search,

  pageNfc,
  pageRangeNfc,
  nfcList,
  getNfcQrCodeList,
} = useEntryPass();
const { stringToColor, getInitial, standardFormatDate } = useUtils();
const { assignDialog, selectedCardItem } = useBlockLevelUnit();

const emit = defineEmits(["addNfcCard"]);

const headers = computed(() => {
  return [
    {
      sm: "3",
      title: "NFC Card",
      align: "left",
      visible: true,
    },
    {
      sm: "3",
      title: "Access By",
      align: "left",
      visible: true,
    },
    {
      sm: "2",
      title: "Category",
      align: "left",
      visible: true,
    },
    {
      sm: "2",
      title: "Date Assigned",
      align: "left",
      visible: true,
    },
    {
      sm: "2",
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
  await getNfcQrCodeList({
    site: mySite.value,
    type: "NFC",
    page: pageNfc.value,
    search: value,
  });
}, 500);

const { mySite } = useFilter();
onMounted(async () => {
  getNfcQrCodeList({ site: mySite.value, type: "NFC", page: pageNfc.value });
});

async function onAssign(data: any) {
  selectedCardItem.value = data;
  assignDialog.value = true;
}
</script>
