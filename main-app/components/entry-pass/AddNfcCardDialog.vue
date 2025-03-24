<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-right-transition"
    fullscreen
    :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
    @update:modelValue="openDialog = ''"
  >
    <v-card class="px-3 h-100">
      <v-toolbar
        class="d-flex align-center"
        :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`"
      >
        <v-btn
          color="grey-darken-1"
          icon="mdi-arrow-left"
          @click="openDialog = ''"
        ></v-btn>
        <span class="font-weight-bold pl-2 text-capitalize text-body-1">
          {{
            openDialog === "addNFCCard" ? "Add NFC Card" : "Add QR Code Access"
          }}
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
        <v-row>
          <v-form v-model="form" @submit.prevent="submit()" class="w-100 pa-0">
            <v-col cols="12">
              <v-row v-if="openDialog === 'addQRCodeAccess'" class="px-4 pb-8">
                <v-col cols="12">
                  <span class="font-weight-bold text-body-1">
                    QR Code Access
                  </span></v-col
                >
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="accessCard.rangeFrom"
                        density="compact"
                        hide-details
                        :rules="[requiredInput]"
                        :disabled="isAssigningNFC"
                        type="number"
                      >
                        <template v-slot:label>
                          Range from
                          <span class="text-red font-weight-bold">*</span>
                        </template>
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="accessCard.rangeTo"
                        density="compact"
                        hide-details
                        :rules="[requiredInput]"
                        :disabled="isAssigningNFC"
                        type="number"
                      >
                        <template v-slot:label>
                          Range to
                          <span class="text-red font-weight-bold">*</span>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row></v-col
                ></v-row
              >

              <v-tabs grow v-model="tab" color="#0077b6" height="40px">
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
              <v-tabs-window v-model="tab">
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
                          @click:clear="clearDateFilter('liftAccessStartDate')"
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
                          @click:clear="clearDateFilter('liftAccessEndDate')"
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
            </v-col>
            <v-col cols="12" class="px-8">
              <v-btn
                color="blue-darken-3"
                block
                variant="flat"
                size="small"
                style="height: 40px"
                :loading="isAssigningNFC"
                :disabled="!isFormValid() || isAssigningNFC"
                >Add</v-btn
              >
            </v-col>
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
        </v-row>
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
const { openDialog, isAssigningNFC, getLiftAccessLevels, getDoorAccessLevels } =
  useEntryPass();
const { theme } = useLocal();
const { requiredInput, standardFormatDate } = useUtils();

const dialog = ref(false);
const form = ref(false);
const tab = ref("card-setup");

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

const setDateTo = ref("");
const currentDate = ref<Date | null>(null);
const dateDialog = ref(false);
const cardTypeItems = ref(["Normal", "Access Card"]);

//dummy data
const accessLevelItems = ref<{ name: string; code: string }[]>([]);
const liftAccessLevelItems = ref<{ name: string; code: string }[]>([]);

onMounted(() => {
  getDoorLevels();
  getLiftLevels();
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

watch(openDialog, (value) => {
  dialog.value = value === "addNFCCard" || value === "addQRCodeAccess";
});

watch(currentDate, (value) => {
  applyDate(value);
});

function submit() {}

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

    if (setDateTo.value === "startDate") {
      const newDate = getDate.setFullYear(getDate.getFullYear() + 10) as any;
      setDateToObject("endDate", standardFormatDate(newDate));
    }
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
</style>
