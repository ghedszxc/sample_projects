<template>
  <v-row no-gutters class="pa-8">
    <!-- back -->
    <v-col
      cols="12"
      class="text-h6 font-weight-bold my-4"
      style="letter-spacing: 2px !important"
    >
      <v-btn
        fav
        density="compact"
        icon="mdi-arrow-left"
        variant="text"
        @click="goBack()"
      ></v-btn>
      Pass & Keys
    </v-col>

    <v-col cols="12">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="isVMSLogsLoading"
      >
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-row no-gutters>
          <v-col cols="12">
            <v-data-iterator
              :items="listOfLogsVms.items"
              :items-per-page="itemsPerPage"
            >
              <template v-slot:header>
                <v-row no-gutters class="pa-4" justify="space-between">
                  <v-col cols="12" md="6">
                    <v-row align="center">
                      <v-col cols="12" md="1" v-if="$vuetify.display.smAndDown">
                        <span class="font-weight-bold text-h6"> VMS Logs </span>
                      </v-col>

                      <v-col cols="12" md="11" class="d-flex">
                        <span
                          class="font-weight-bold text-h6 mr-3 pt-1"
                          v-if="$vuetify.display.mdAndUp"
                        >
                          VMS Logs
                        </span>

                        <v-chip class="mt-1 font-weight-bold" color="gray">
                          <v-avatar
                            :color="
                              passKeyType !== 'pass-key' ? 'primary' : 'green'
                            "
                            :class="`${$vuetify.display.smAndUp ? 'mr-2' : 'mr-1'}`"
                          >
                            <v-icon
                              :icon="
                                passKeyType !== 'pass-key'
                                  ? 'mdi-badge-account-outline'
                                  : 'mdi-key-variant'
                              "
                            />
                          </v-avatar>
                          {{ prefixName }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-divider></v-divider>
                <v-list
                  class="pa-0"
                  density="compact"
                  v-if="$vuetify.display.smAndUp"
                >
                  <v-list-item class="px-8">
                    <v-list-item-title>
                      <v-row no-gutters>
                        <v-col cols="12" sm="7" md="2">
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-caption font-weight-bold"
                            >
                              Name
                            </span>
                          </v-row>
                        </v-col>

                        <v-col cols="12" sm="7" md="2">
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-caption font-weight-bold"
                            >
                              Type/Company
                            </span>
                          </v-row>
                        </v-col>

                        <v-col
                          cols="12"
                          sm="4"
                          md="2"
                          v-if="$vuetify.display.mdAndUp"
                        >
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-caption font-weight-bold"
                            >
                              Location
                            </span>
                          </v-row>
                        </v-col>

                        <v-col cols="12" sm="4" md="2">
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-caption font-weight-bold"
                            >
                              Contact/Vehicle No.
                            </span>
                          </v-row>
                        </v-col>

                        <v-col cols="12" sm="4" md="2">
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-caption font-weight-bold"
                            >
                              Received/Last Update
                            </span>
                          </v-row>
                        </v-col>
                        <v-col cols="12" sm="4" md="2">
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-caption font-weight-bold"
                            >
                              Status
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
                        <v-row no-gutters>
                          <v-col
                            cols="12"
                            sm="7"
                            md="2"
                            :class="`text-capitalize text-body-2 white--text text ${$vuetify.display.xs && 'mb-1'}`"
                          >
                            <v-row
                              no-gutters
                              class="fill-height text-truncate"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.xs ? 'space-between' : 'start'
                              "
                            >
                              <span
                                class="mr-2 d-flex d-sm-none font-weight-bold"
                              >
                                Name:
                              </span>
                              <span class="d-flex flex-column text-truncate">
                                <span
                                  class="text-truncate mt-1"
                                  :style="
                                    $vuetify.display.xs
                                      ? 'font-size: .8rem;'
                                      : ''
                                  "
                                >
                                  <v-avatar
                                    size="x-small"
                                    :color="materialColors[itemIndex]"
                                    :class="`${$vuetify.display.smAndUp ? 'mr-2' : 'mr-1'}`"
                                  >
                                    {{ getInitial(item.raw.name || "") }}
                                  </v-avatar>

                                  {{ item.raw.name }}
                                </span>
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            md="2"
                            :class="`text ${$vuetify.display.mdAndUp ? 'my-1 pr-2' : 'mb-2'}`"
                          >
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                            >
                              <v-col cols="12" class="d-flex flex-column">
                                <span
                                  class="d-inline-block text-capitalize text-body-2"
                                  style="
                                    word-break: break-word;
                                    white-space: normal;
                                  "
                                >
                                  <v-icon
                                    size="small"
                                    :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1 mr-4'}`"
                                  >
                                    mdi-account
                                  </v-icon>
                                  {{
                                    item.raw.type === "contractor" &&
                                    item.raw.contractorType
                                      ? item.raw.contractorType ||
                                        "".split("-").join(" ")
                                      : item.raw.type === "guest"
                                        ? item.raw.residentGuestType
                                          ? item.raw.residentGuestType
                                          : "Drive-In"
                                        : item.raw.type === "delivery" &&
                                            item.raw.deliveryType
                                          ? `${item.raw.deliveryType}-Delivery`
                                          : item.raw.type
                                  }}
                                </span>
                                <span
                                  class="d-inline-block text-wrap text-capitalize text-body-2"
                                >
                                  <v-icon
                                    size="small"
                                    :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1 mr-4'}`"
                                  >
                                    mdi-domain
                                  </v-icon>
                                  {{
                                    item.raw.companyName
                                      ? item.raw.companyName
                                      : `N/A`
                                  }}
                                </span>
                              </v-col>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="4"
                            md="2"
                            :class="`text text-capitalize text-body-2 ${
                              !$vuetify.display.smAndUp && 'mb-1'
                            }`"
                            v-if="
                              $vuetify.display.mdAndUp || $vuetify.display.xs
                            "
                          >
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                            >
                              <span
                                class="d-inline-block text-wrap text-capitalize text-body-2"
                              >
                                <v-icon
                                  v-if="
                                    item.raw.blockName ||
                                    item.raw.blockLevelName ||
                                    item.raw.unitName
                                  "
                                  size="small"
                                  :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1 mr-4'}`"
                                >
                                  mdi-storefront-outline
                                </v-icon>
                                {{
                                  item.raw.blockName ||
                                  item.raw.blockLevelName ||
                                  item.raw.unitName
                                    ? `${item.raw.blockName} ${item.raw.blockLevelName ? "/ " + item.raw.blockLevelName : ""} ${item.raw.unitName ? "/ " + item.raw.unitName : ""}`
                                    : "N/A"
                                }}
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="4"
                            md="2"
                            class="text text-capitalize"
                          >
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                            >
                              <v-col
                                cols="12"
                                :class="`${$vuetify.display.mdAndUp ? 'pl-1 text-body-2' : 'pl-4 text-body-2'}`"
                              >
                                <template
                                  v-if="item.raw.email && item.raw.phoneNumber"
                                >
                                  <div
                                    :class="
                                      !item.raw.email && 'pt-2 text-body-2'
                                    "
                                    style="
                                      word-break: break-word;
                                      white-space: normal;
                                    "
                                  >
                                    <v-icon size="small" class="mr-1"
                                      >mdi-phone</v-icon
                                    >
                                    {{
                                      item.raw.phoneNumber
                                        ? item.raw.phoneNumber
                                        : "N/A"
                                    }}
                                  </div>
                                  <div
                                    class="text-caption text-grey text-truncate text-body-2"
                                    v-if="item.raw.email"
                                  >
                                    <v-icon size="small" class="mr-1"
                                      >mdi-email</v-icon
                                    >
                                    {{
                                      item.raw.email ? item.raw.email : "N/A"
                                    }}
                                  </div>
                                </template>
                                <div
                                  v-else
                                  style="
                                    word-break: break-word;
                                    white-space: normal;
                                  "
                                >
                                  <v-icon size="small" class="mr-1"
                                    >mdi-phone</v-icon
                                  >
                                  {{
                                    item.raw.email
                                      ? item.raw.email
                                      : item.raw.phoneNumber
                                        ? item.raw.phoneNumber
                                        : "N/A"
                                  }}
                                </div>
                                <span
                                  class="d-inline-block text-capitalize text-body-2"
                                  style="width: 100%"
                                >
                                  <v-row
                                    no-gutters
                                    align="center"
                                    justify="start"
                                    class="d-flex align-center"
                                  >
                                    <v-icon
                                      size="small"
                                      class="mr-2"
                                      :class="`${$vuetify.display.mdAndUp ? '' : 'mx-1'}`"
                                      >mdi-car-back</v-icon
                                    >
                                    <div>
                                      {{
                                        item.raw.plateNumber
                                          ? item.raw.plateNumber.toUpperCase()
                                          : "N/A"
                                      }}
                                    </div>
                                    <div
                                      v-if="
                                        item.raw.type === 'guest' &&
                                        currentUser.type === 'organization'
                                      "
                                    >
                                      <div
                                        v-if="
                                          compareDate(
                                            item.raw.checkIn,
                                            item.raw.checkOut,
                                          )
                                        "
                                        class="text-caption text-grey"
                                      >
                                        Overnight
                                      </div>
                                    </div>
                                  </v-row>
                                </span>
                              </v-col>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="4"
                            md="2"
                            class="text text-capitalize"
                          >
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                            >
                              <v-col cols="12" class="d-flex flex-column">
                                <span
                                  class="d-inline-block text-capitalize text-body-2"
                                  style="
                                    word-break: break-word;
                                    white-space: normal;
                                  "
                                >
                                  <v-icon
                                    size="small"
                                    :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1 mr-4'}`"
                                  >
                                    <v-img
                                      src="/icons/timein-green.svg"
                                    ></v-img>
                                  </v-icon>
                                  {{
                                    item.raw.receivedDate
                                      ? standardFormatDateTime(
                                          item.raw.receivedDate,
                                        )
                                      : `N/A`
                                  }}
                                </span>
                                <span
                                  class="d-inline-block text-wrap text-capitalize text-body-2"
                                >
                                  <v-icon
                                    size="small"
                                    :class="`${$vuetify.display.mdAndUp ? 'mx-1' : 'mx-1 mr-4'}`"
                                  >
                                    <v-img
                                      src="/icons/timeout-green.svg"
                                    ></v-img>
                                  </v-icon>
                                  {{
                                    item.raw.lastUpdate
                                      ? standardFormatDateTime(
                                          item.raw.receivedDate,
                                        )
                                      : `N/A`
                                  }}
                                </span>
                              </v-col>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="4"
                            md="2"
                            class="text text-capitalize"
                          >
                            <v-row
                              no-gutters
                              class="fill-height text-truncate"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.xs ? 'space-between' : 'start'
                              "
                            >
                              <span
                                class="mr-2 d-flex d-sm-none font-weight-bold"
                              >
                                Status:
                              </span>
                              <span
                                class="text-truncate mt-1 text-body-2"
                                :style="
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                              >
                                <v-chip
                                  v-if="item.raw.status"
                                  size="small"
                                  class="text-white"
                                  :style="`background-color: ${
                                    item.raw.status == 'Returned'
                                      ? '#4CAF50'
                                      : '#F44336'
                                  }`"
                                >
                                  {{ item.raw.status }}
                                </v-chip>
                              </span>
                              <!-- remarks -->
                              <v-col
                                v-if="
                                  !['Returned', 'Not Returned'].includes(
                                    item.raw.status,
                                  )
                                "
                                cols="12"
                                class="mt-2"
                              >
                                <div class="text-caption font-weight-bold">
                                  Remarks:
                                </div>
                                <div class="text-caption text-wrap">
                                  {{ item.raw.remarks }}
                                </div>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider
                      v-if="itemIndex + 1 !== items.length"
                    ></v-divider>
                  </template>
                </v-list>
              </template>

              <template #no-data>
                <v-row no-gutters justify="center" class="pa-16">
                  <v-col cols="12">
                    <v-row no-gutters justify="center">
                      <v-img
                        src="/empty.svg"
                        width="100px"
                        height="100px"
                      ></v-img>
                    </v-row>
                  </v-col>

                  <v-col cols="12">
                    <v-row no-gutters justify="center">
                      <span class="font-weight-bold"> No data found. </span>
                    </v-row>
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>
          </v-col>

          <v-divider></v-divider>

          <!-- pagination -->
          <v-col cols="12" class="pa-4">
            <v-row no-gutters justify="end" align-content="center">
              <span>{{ listOfLogsVms.pageRange }}</span>
              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="canPrevPage"
                @click="prevPage()"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>

              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="!canNextPage"
                @click="nextPage()"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure", "site"],
});

const { mySite } = useFilter();

const { standardFormatDateTime, materialColors, getInitial, compareDate } =
  useUtils();

const { getVisitorVmsLogsByPageSearch } = useVisitor();

const passKeyType = ref(useRoute().query?.type);
const passID = ref(useRoute().query?.id);
const prefixName = ref(useRoute().query?.prefixName);
const { currentUser } = useLocalAuth();

const { itemsPerPage, page, pages } = usePassKey();

const isVMSLogsLoading = ref(false);
const VMSLogs = ref([]);

const listOfLogsVms = ref<any[]>([]);

const canNextPage = computed(() => pages.value > page.value);
const canPrevPage = computed(() => page.value <= 1);

onMounted(async () => {
  await getVMSLogs();
});

async function getVMSLogs() {
  isVMSLogsLoading.value = true;
  VMSLogs.value = [];

  const result: any = await getVisitorVmsLogsByPageSearch({
    sites: [mySite.value],
    passOrKey: {
      keyId: passID.value,
      type: passKeyType.value == "pass-key" ? "key" : "pass",
    },
  });

  result.items.map((item: any) => {
    if (passKeyType.value == "pass-key") {
      let passKeyData = item.passKeys.find((item2: any) => {
        return passID.value == item2.keyId;
      });
      item.receivedDate = passKeyData.receivedDate;
      item.status = passKeyData.status;
      item.lastUpdate = passKeyData.lastUpdate;
      item.remarks = passKeyData.remarks;
    } else {
      let passKeyData = item.visitorPass.find((item2: any) => {
        return passID.value == item2.keyId;
      });
      item.receivedDate = passKeyData.receivedDate;
      item.status = passKeyData.status;
      item.lastUpdate = passKeyData.lastUpdate;
      item.remarks = passKeyData.remarks;
    }
  });

  listOfLogsVms.value = result;

  pages.value = listOfLogsVms.value?.pages;

  isVMSLogsLoading.value = false;
}

async function prevPage() {
  isVMSLogsLoading.value = true;
  page.value -= 1;
  listOfLogsVms.value = await getVisitorVmsLogsByPageSearch({
    page: page.value,
    sites: [mySite.value],
    passOrKey: {
      keyId: passID.value,
      type: passKeyType.value == "pass-key" ? "key" : "pass",
    },
  });
  isVMSLogsLoading.value = false;
}

async function nextPage() {
  isVMSLogsLoading.value = true;
  page.value += 1;
  listOfLogsVms.value = await getVisitorVmsLogsByPageSearch({
    page: page.value,
    sites: [mySite.value],
    passOrKey: {
      keyId: passID.value,
      type: passKeyType.value == "pass-key" ? "key" : "pass",
    },
  });
  isVMSLogsLoading.value = false;
}

async function goBack() {
  await navigateTo({
    path: "/keys/visitor",
    query: {
      site: mySite.value,
    },
  });
}
</script>

<style scoped>
.text {
  text-align: start;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}

.rows-per-page :deep() .v-field__outline {
  --v-field-border-width: 0;
  --v-field-border-opacity: 0;
  border-bottom: 0.1px solid;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  width: 50px;
  margin-left: 16px;
}

:deep() .v-field__field {
  font-size: 14px;
}

.overridePicker {
  width: 18px;
}
</style>
