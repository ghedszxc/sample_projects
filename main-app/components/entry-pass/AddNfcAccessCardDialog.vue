<template>
  <v-dialog
    v-model="isAccessCardDialog"
    transition="dialog-right-transition"
    fullscreen
    :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
  >
    <v-card class="px-3 h-100">
      <v-toolbar
        class="d-flex align-center"
        :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`"
      >
        <v-btn
          color="grey-darken-1"
          icon="mdi-arrow-left"
          @click="goBack()"
        ></v-btn>
        <span class="font-weight-bold pl-2 text-capitalize text-body-1">
          {{ openDialog }}
        </span>
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          icon="mdi-close"
          @click="closeDialog()"
        ></v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text>
        <v-form v-model="form" @submit.prevent="submit()" class="w-100 pa-0">
          <v-row>
            <v-col cols="12">
              <span class="font-weight-bold text-body-1"> Access Card </span>
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="payload.typeAccessCard"
                :items="['Physical Access Card', 'Non Physical Access Card']"
                density="compact"
                hide-details
                :rules="[requiredInput]"
                :disabled="isAccessCardLoading"
              >
                <template v-slot:label>
                  Type of Access Card
                  <span class="text-red font-weight-bold">*</span>
                </template>
              </v-select>
            </v-col>

            <v-col cols="12" v-if="openDialog === 'Contractor/Visitor'">
              <v-select
                v-model="payload.userType"
                :items="['Contractor', 'Visitor']"
                density="compact"
                hide-details
                :rules="[requiredInput]"
                :disabled="isAccessCardLoading"
              >
                <template v-slot:label>
                  Type of Visitor
                  <span class="text-red font-weight-bold">*</span>
                </template>
              </v-select>
            </v-col>

            <v-col cols="12">
              <v-text-field
                density="compact"
                hide-details
                :disabled="isAccessCardLoading"
                readonly
                id="availableAccessCard"
              >
                <template v-slot:label>
                  Available Access Card
                  <span class="text-red font-weight-bold">*</span>
                </template>
                <template v-slot:append-inner>
                  <v-icon
                    color="primary"
                    size="small"
                    @click="availableAccessCardDialog = true"
                    >mdi-eye</v-icon
                  >
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                density="compact"
                hide-details
                :disabled="isAccessCardLoading"
                readonly
                id="assignedAccessCard"
              >
                <template v-slot:label>
                  Assigned Access Card
                  <span class="text-red font-weight-bold">*</span>
                </template>
                <template v-slot:append-inner>
                  <v-icon
                    color="primary"
                    size="small"
                    @click="assignedAccessCardDialog = true"
                    >mdi-eye</v-icon
                  >
                </template>
              </v-text-field>
            </v-col>

            <v-col
              cols="12"
              v-if="
                !payload.typeAccessCard ||
                payload.typeAccessCard == 'Physical Access Card'
              "
            >
              <v-radio-group v-model="cardAction" inline>
                <v-radio
                  label="Add Access Card"
                  value="add-card"
                  color="primary"
                  class="w-50 border rounded-lg"
                  :style="{
                    'font-size': '12px',
                    'max-width': '49%',
                    marginRight: '2%',
                  }"
                ></v-radio>
                <v-radio
                  label="Assign Access Card"
                  value="assign-card"
                  color="primary"
                  class="w-50 border rounded-lg"
                  :style="{ 'font-size': '12px', 'max-width': '49%' }"
                ></v-radio>
              </v-radio-group>

              <v-divider></v-divider>
            </v-col>

            <v-col
              cols="12"
              v-if="
                (!payload.typeAccessCard ||
                  payload.typeAccessCard == 'Physical Access Card') &&
                cardAction === 'add-card'
              "
            >
              <v-tabs grow v-model="tab" color="#0077b6">
                <v-tab value="manual">
                  <span class="font-weight-bold text-body-2">Manual</span>
                </v-tab>
                <v-tab value="upload">
                  <span class="font-weight-bold text-body-2">Upload</span>
                </v-tab>
              </v-tabs>
              <v-tabs-window v-model="tab">
                <v-tabs-window-item value="manual" class="mt-6">
                  <v-tabs grow v-model="subTab" color="#0077b6">
                    <v-tab value="card-setup"
                      ><span class="font-weight-bold text-body-2">
                        Door Access Set Up
                      </span></v-tab
                    >
                    <v-tab value="lift-setup"
                      ><span class="font-weight-bold text-body-2"
                        >Lift Set Up</span
                      ></v-tab
                    >
                  </v-tabs>
                  <v-tabs-window v-model="subTab">
                    <v-tabs-window-item value="card-setup">
                      <v-row class="py-8 px-4"
                        ><v-col cols="12">
                          <v-select
                            v-model="accessCard.accessLevel"
                            density="compact"
                            :items="accessLevelItems"
                            item-title="name"
                            item-value="no"
                            hide-details
                            :rules="[requiredInput]"
                            :disabled="isAssigningNFC"
                          >
                            <template v-slot:label>
                              Access Level
                              <span class="text-red font-weight-bold">*</span>
                            </template>
                          </v-select>
                        </v-col>
                        <v-col cols="12">
                          <v-select
                            v-model="accessCard.accessType"
                            density="compact"
                            :items="cardTypeItems"
                            hide-details
                            :rules="[requiredInput]"
                            :disabled="isAssigningNFC"
                          >
                            <template v-slot:label>
                              Access Card Type
                              <span class="text-red font-weight-bold">*</span>
                            </template>
                          </v-select>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="accessCard.cardNo"
                            density="compact"
                            hide-details
                            :rules="[requiredInput]"
                            :disabled="isAssigningNFC"
                          >
                            <template v-slot:label>
                              Card No
                              <span class="text-red font-weight-bold">*</span>
                            </template>
                          </v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="accessCard.pin"
                            density="compact"
                            hide-details
                            :rules="[requiredInput]"
                            :disabled="isAssigningNFC"
                          >
                            <template v-slot:label>
                              Pin No
                              <span class="text-red font-weight-bold">*</span>
                            </template>
                          </v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="accessCard.startDate"
                            readonly
                            hide-details
                            clearable
                            append-inner-icon="mdi-calendar"
                            @click="openDateDialog('startDate')"
                            @click:clear="clearDateFilter('startDate')"
                            :disabled="isAssigningNFC"
                            :rules="[requiredInput]"
                          >
                            <template v-slot:label>
                              Start Date
                              <span class="text-red font-weight-bold">*</span>
                            </template>
                          </v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="accessCard.endDate"
                            readonly
                            hide-details
                            clearable
                            append-inner-icon="mdi-calendar"
                            @click="openDateDialog('endDate')"
                            @click:clear="clearDateFilter('endDate')"
                            :disabled="isAssigningNFC"
                            :rules="[requiredInput]"
                          >
                            <template v-slot:label>
                              End Date
                              <span class="text-red font-weight-bold">*</span>
                            </template>
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" class="pa-0 px-4">
                          <div
                            :class="`${$vuetify.display.xs ? ' flex-column' : 'align-center'} d-flex `"
                          >
                            <span class="d-flex align-center text-body-2"
                              >Activate
                              <v-checkbox
                                v-model="accessCard.isActivated"
                                label="Yes"
                                class="d-flex align-center"
                              ></v-checkbox
                            ></span>
                            <span
                              :class="`${$vuetify.display.xs ? '' : 'ml-6'} d-flex align-center text-body-2`"
                              >Anti Pass Back
                              <v-checkbox
                                v-model="accessCard.isAntiPassBack"
                                label="Yes"
                                class="d-flex align-center"
                              ></v-checkbox
                            ></span>
                          </div>
                        </v-col>
                      </v-row>
                    </v-tabs-window-item>
                    <v-tabs-window-item value="lift-setup">
                      <v-col cols="12">
                        <v-row class="pa-2">
                          <div class="d-flex align-center pa-4">
                            <span class="text-body-1 mr-2">Use lift Card</span>
                            <v-radio-group
                              inline
                              v-model="accessCard.isLiftCard"
                              class="d-flex align-center"
                            >
                              <v-radio label="No" :value="false"></v-radio>
                              <v-radio label="Yes" :value="true"></v-radio>
                            </v-radio-group>
                          </div>
                          <v-col cols="12">
                            <v-select
                              v-model="accessCard.liftAccessLevel"
                              :items="liftAccessLevelItems"
                              item-title="name"
                              item-value="no"
                              density="compact"
                              hide-details
                              :rules="[requiredInput]"
                              :disabled="!accessCard.isLiftCard"
                            >
                              <template v-slot:label>
                                Lift Access Level
                                <span class="text-red font-weight-bold">*</span>
                              </template>
                            </v-select>
                          </v-col>

                          <v-col cols="12">
                            <v-text-field
                              v-model="accessCard.liftAccessStartDate"
                              readonly
                              hide-details
                              clearable
                              append-inner-icon="mdi-calendar"
                              @click="openDateDialog('liftAccessStartDate')"
                              @click:clear="
                                clearDateFilter('liftAccessStartDate')
                              "
                              :disabled="!accessCard.isLiftCard"
                              :rules="[requiredInput]"
                            >
                              <template v-slot:label>
                                Start Date
                                <span class="text-red font-weight-bold">*</span>
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="accessCard.liftAccessEndDate"
                              readonly
                              hide-details
                              clearable
                              append-inner-icon="mdi-calendar"
                              @click="openDateDialog('liftAccessEndDate')"
                              @click:clear="
                                clearDateFilter('liftAccessEndDate')
                              "
                              :disabled="!accessCard.isLiftCard"
                              :rules="[requiredInput]"
                            >
                              <template v-slot:label>
                                End Date
                                <span class="text-red font-weight-bold">*</span>
                              </template>
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-tabs-window-item>
                  </v-tabs-window>
                </v-tabs-window-item>

                <v-tabs-window-item value="upload">
                  <v-row no-gutters>
                    <v-col cols="12" class="my-4 mb-6">
                      <span class="font-weight-bold text-body-1">
                        Upload Access Card
                      </span>
                    </v-col>
                    <v-col cols="12" class="mb-3">
                      <v-btn variant="outlined" block class="py-6 border">
                        <v-icon color="success" class="mr-2"
                          >mdi-microsoft-excel</v-icon
                        >
                        Download Template
                      </v-btn>
                    </v-col>
                    <v-col cols="12" class="mb-3">
                      <v-btn variant="outlined" block class="py-6 border">
                        Choose File
                      </v-btn>
                    </v-col>
                    <v-col cols="12">
                      <v-btn variant="flat" block class="py-6" color="primary">
                        Upload
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-tabs-window-item>
              </v-tabs-window>
            </v-col>

            <v-col
              cols="12"
              v-if="
                cardAction === 'assign-card' ||
                payload.typeAccessCard === 'Non Physical Access Card'
              "
            >
              <v-text-field
                v-model="payload.quantity"
                density="compact"
                hide-details
                :rules="[requiredInput]"
                :disabled="isAccessCardLoading"
                type="number"
                min="1"
              >
                <template v-slot:label>
                  Quantity
                  <span class="text-red font-weight-bold">*</span>
                </template>
              </v-text-field>
            </v-col>

            <v-col
              cols="12"
              v-if="
                cardAction === 'assign-card' ||
                payload.typeAccessCard === 'Non Physical Access Card'
              "
            >
              <v-select
                v-model="payload.accessLevels"
                density="compact"
                hide-details
                :rules="[requiredInput]"
                :disabled="isAccessCardLoading"
                multiple
                :items="accessLevelList"
              >
                <template v-slot:label>
                  Access Level
                  <span class="text-red font-weight-bold">*</span>
                </template>
                <template v-slot:item="{ props, item, index }">
                  <div v-if="!index">
                    <div class="font-weight-bold text-h6 pl-4 pt-2">Level</div>
                    <div class="px-4 mt-2">
                      <v-text-field
                        v-model="search"
                        placeholder="Search name, id"
                        hide-details
                        density="compact"
                        append-inner-icon="mdi-magnify"
                      ></v-text-field>
                      <v-divider class="mt-3" />
                    </div>
                  </div>
                  <v-list v-bind="props">
                    <v-list-item link>
                      <v-icon class="mr-1" style="padding-bottom: 3px">
                        {{
                          `mdi-${payload.accessLevels.includes(item?.raw) ? "checkbox-marked" : "checkbox-blank-outline"}`
                        }}
                      </v-icon>
                      {{ `Level ${item.raw}` }}
                    </v-list-item>
                  </v-list>
                </template>
              </v-select>
            </v-col>

            <v-col
              cols="12"
              class="py-0"
              v-if="
                cardAction === 'assign-card' ||
                payload.typeAccessCard === 'Non Physical Access Card'
              "
            >
              <v-checkbox
                v-model="accessCard.isActivated"
                label="Select all building management levels"
                class="d-flex align-center text-body-2"
                color="primary"
                density="compact"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" v-if="cardAction === 'assign-card'">
              <v-select
                v-model="payload.assignedUnits"
                density="compact"
                hide-details
                :rules="[requiredInput]"
                :disabled="isAccessCardLoading"
                multiple
                :items="accessCards"
                item-title="name"
                item-value="_id"
                chips
              >
                <template v-slot:label>
                  Unit
                  <span class="text-red font-weight-bold">*</span>
                </template>
                <template v-slot:item="{ props, item, index }">
                  <div v-if="!index">
                    <div class="font-weight-bold text-h6 pl-4 pt-2">Unit</div>
                    <div class="px-4 mt-2">
                      <v-text-field
                        v-model="search"
                        placeholder="Search name, id"
                        hide-details
                        density="compact"
                        append-inner-icon="mdi-magnify"
                      ></v-text-field>
                      <v-divider class="mt-3" />
                    </div>
                    <v-row class="pa-4 text-body-1">
                      <v-col cols="6"><span>Block / Level / Unit</span></v-col>
                      <!-- <v-col cols="6"><span>Unit Owner</span></v-col> -->
                      <v-divider class="mx-3" />
                    </v-row>
                  </div>

                  <v-list v-bind="props">
                    <v-list-item link>
                      <v-icon
                        class="mr-2"
                        style="padding-bottom: 3px"
                        size="small"
                      >
                        {{
                          `mdi-${payload.assignedUnits.includes(item.raw._id) ? "checkbox-marked" : "checkbox-blank-outline"}`
                        }}
                      </v-icon>

                      <span class="text-body-2">{{
                        `${item.raw.block.name} / ${item.raw.level.level} / ${item.raw.name}`
                      }}</span>
                    </v-list-item>
                  </v-list>
                </template>
              </v-select>
            </v-col>

            <v-col cols="12" class="px-3" v-if="tab == 'manual'">
              <v-btn
                color="blue-darken-3"
                block
                variant="flat"
                size="small"
                style="height: 40px"
                :loading="isAssigningNFC"
                :disabled="isAssigningNFC"
                type="submit"
              >
                <!-- PLEASE UPDATE FORM VALIDATION FOR QR Code Access Card -->
                <!-- !isFormValid() ||  -->
                Add
              </v-btn>
            </v-col>
          </v-row>
        </v-form>

        <v-dialog v-model="dateDialog" max-width="355">
          <v-card>
            <v-card-subtitle>
              <v-date-picker
                width="320"
                v-model="currentDate"
                locale="en"
              ></v-date-picker>
            </v-card-subtitle>
          </v-card>
        </v-dialog>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <span :class="`${$vuetify.display.mdAndUp && 'pl-4'} text-caption`">
          @ 2024 by Seven 365 Pte Ltd V1.0
        </span>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const emits = defineEmits(["onSubmit"]);
const {
  openDialog,
  isAssigningNFC,
  isAccessCardDialog,
  isAccessCardLoading,
  availableAccessCardDialog,
  assignedAccessCardDialog,
  getDoorAccessLevels,
  getLiftAccessLevels,
  accessCards,
} = useEntryPass();
const { theme } = useLocal();
const { requiredInput, standardFormatDate } = useUtils();

const dialog = ref(false);
const form = ref(false);

const tab = ref("manual");
const subTab = ref("card-setup");
const cardAction = ref("add-card");

const payload = ref({
  typeAccessCard: "Physical Access Card",
  userType: "Contractor",
  quantity: 1,
  accessLevels: [],
  assignedUnits: [],
});

const accessCard = ref({
  accessLevel: null,
  accessType: "Normal",
  cardNo: "",
  pin: "",
  startDate: "",
  endDate: "",
  isActivated: false,
  isAntiPassBack: false,
  isLiftCard: false,
  liftAccessLevel: null,
  liftAccessStartDate: "",
  liftAccessEndDate: "",
  rangeFrom: null,
  rangeTo: null,
});

const search = ref("");

const setDateTo = ref("");
const currentDate = ref<Date | null>(null);
const dateDialog = ref(false);
const cardTypeItems = ref(["Normal", "Access Card"]);

const accessLevelItems = ref<{ name: string; code: string }[]>([]);
const liftAccessLevelItems = ref<{ name: string; code: string }[]>([]);

onMounted(async () => {
  await getDoorLevels();
  await getLiftLevels();

  document.getElementById("assignedAccessCard").disabled = true;
  document.getElementById("availableAccessCard").disabled = true;
});

async function getDoorLevels() {
  try {
    accessLevelItems.value = await getDoorAccessLevels();
  } catch (error) {
    console.error(error);
  }
}

async function getLiftLevels() {
  try {
    liftAccessLevelItems.value = await getLiftAccessLevels();
  } catch (error) {
    console.error(error);
  }
}

watch(openDialog, (value: any) => {
  dialog.value = value === "addNFCCard" || value === "addQRCodeAccess";
});

watch(currentDate, (value: any) => {
  applyDate(value);
});

const accessLevelList = computed(() => {
  const list = ["1", "2", "3", "4", "5", "6"];

  return list.filter((find: any) =>
    search.value
      ? find.toLowerCase().includes(search.value.toLowerCase())
      : find,
  );
});

async function submit() {
  if (payload.value.typeAccessCard === "Non Physical Access Card") {
    emits("onSubmit", payload.value);
  }
}

function isFormValid() {
  let isValid = true;
  const temp = accessCard.value as any;

  Object.keys(temp).forEach((key: string) => {
    if (
      ![
        "isLiftCard",
        "liftAccessLevel",
        "liftAccessStartDate",
        "liftAccessEndDate",
      ].includes(key)
    ) {
      if (temp[key] === "" || temp[key] === null) {
        isValid = false;
        return;
      }
    } else {
      if (temp["isLiftCard"]) {
        if (!temp[key]) {
          isValid = false;
          return;
        }
      } else {
        return;
      }
    }
  });

  return isValid;
}

function closeDialog() {
  openDialog.value = "";
  payload.value.typeAccessCard = "";
  isAccessCardDialog.value = false;
}

function goBack() {
  if (!payload.value.typeAccessCard) {
    closeDialog();
  } else if (payload.value.typeAccessCard == "QR Code Access Card") {
    payload.value.typeAccessCard = "";
  }
}

function openDateDialog(dateTo: string) {
  setDateTo.value = dateTo;
  dateDialog.value = true;
}

function clearDateFilter(key: string) {
  currentDate.value = null;
  setDateToObject(key, "");
}

function setDateToObject(key: string, date: string) {
  if (
    key === "startDate" ||
    key === "endDate" ||
    key === "liftAccessStartDate" ||
    key === "liftAccessEndDate"
  ) {
    accessCard.value[key] = date;
  }

  currentDate.value = null;
}

async function applyDate(condition: any) {
  if (condition && currentDate.value) {
    const getDate = new Date(currentDate.value);

    setDateToObject(setDateTo.value, standardFormatDate(getDate));

    const newDate = getDate.setFullYear(getDate.getFullYear() + 10) as any;
    setDateToObject(
      setDateTo.value === "startDate" ? "endDate" : "liftAccessEndDate",
      standardFormatDate(newDate),
    );
  }

  dateDialog.value = false;
}
</script>

<style scoped>
.dialog_desktop {
  margin: 0 0 0 auto;
  max-width: 28rem;
  border-radius: 25px 0 0 25px;

  box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
}

:deep() .v-slide-group__content {
  border-bottom: 2px #e0e0e0 solid;
}

:deep() .v-label--clickable {
  font-size: 12px;
}

:deep() .v-field__input,
.v-input--readonly:hover {
  cursor: default;
}
</style>
