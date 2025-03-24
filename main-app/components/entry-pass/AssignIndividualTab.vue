<template>
  <v-row no-gutters align="center" justify="center" class="pa-8">
    <v-col cols="12" md="6">
      <v-col cols="12">
        <span class="font-weight-bold text-body-1">Personal Data</span>
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="accessCard.staffNo"
              density="compact"
              hide-details
              :rules="[requiredInput]"
              :disabled="isAssigningNFC"
            >
              <template v-slot:label>
                Staff No
                <span class="text-red font-weight-bold">*</span>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="accessCard.fullName"
              label="Full Name"
              density="compact"
              hide-details
              :disabled="isAssigningNFC"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="accessCard.dateOrBirth"
              readonly
              hide-details
              clearable
              append-inner-icon="mdi-calendar"
              @click="openDateDialog('dateOrBirth')"
              @click:clear="clearDateFilter('dateOrBirth')"
              :disabled="isAssigningNFC"
              :rules="[requiredInput]"
            >
              <template v-slot:label>
                Date of Birth
                <span class="text-red font-weight-bold">*</span>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="accessCard.dateOfJoin"
              readonly
              hide-details
              clearable
              append-inner-icon="mdi-calendar"
              @click="openDateDialog('dateOfJoin')"
              @click:clear="clearDateFilter('dateOfJoin')"
              :disabled="isAssigningNFC"
              :rules="[requiredInput]"
            >
              <template v-slot:label>
                Date of Join
                <span class="text-red font-weight-bold">*</span>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12">
        <v-tabs grow v-model="individualTab" color="#0077b6" height="60px">
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
      </v-col>
      <v-tabs-window v-model="individualTab">
        <!-- Card Setup tab -->
        <v-tabs-window-item value="card-setup">
          <v-col cols="12">
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="accessCard.accessLevel"
                  density="compact"
                  :items="accessLevelItems"
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
              <v-col cols="12" sm="6">
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
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col cols="12" sm="6">
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
              <v-col cols="12" sm="6">
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
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col cols="12" sm="6">
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
              <v-col cols="12" sm="6">
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
            </v-row>
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
        </v-tabs-window-item>

        <!-- List Setup tab -->
        <v-tabs-window-item value="lift-setup">
          <v-col cols="12">
            <div class="d-flex align-center">
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
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="accessCard.liftAccessLevel"
              :items="liftAccessLevelItems"
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
            <v-row>
              <v-col cols="12" sm="6">
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
              <v-col cols="12" sm="6">
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
                  class="pb-3"
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

      <v-divider></v-divider>

      <v-col cols="12" class="mt-2">
        <v-row no-gutters justify="end">
          <v-col cols="12" md="4">
            <v-btn
              color="blue-darken-3"
              block
              variant="flat"
              size="small"
              style="height: 40px"
              :disabled="!isFormValid() || isAssigningNFC"
              @click="submit()"
              :loading="isAssigningNFC"
              >Add</v-btn
            ></v-col
          >
        </v-row>
      </v-col>

      <v-dialog v-model="dateDialog" max-width="355">
        <v-card>
          <v-card-subtitle>
            <v-date-picker
              width="320"
              v-model="currentDate"
              @input="updateDate"
              locale="en"
              @change="applyDate"
            ></v-date-picker>
          </v-card-subtitle>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { requiredInput, standardFormatDate } = useUtils();
const { accessCard, isAssigningNFC } = useEntryPass();

const tab = ref("individual");
const individualTab = ref("card-setup");

const setDateTo = ref("");
const currentDate = ref<Date | null>(null);
const dateDialog = ref(false);
const cardTypeItems = ref(["Normal", "Access Card"]);

//dummy data
const accessLevelItems = ref(["Level 1", "Level 2", "Level 3", "Level 4"]);
const liftAccessLevelItems = ref(["Lift 1", "Lift 2", "Lift 3"]);

const emit = defineEmits(["submit"]);

watch(currentDate, (newVal: any) => {
  applyDate(newVal && "hasValue");
});

function submit() {
  const payload = accessCard.value;
  emit("submit", payload);
}

function isFormValid() {
  let isValid = true;
  const temp = accessCard.value as any;

  delete temp._id;
  delete temp.userId;
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

function openDateDialog(dateTo: string) {
  setDateTo.value = dateTo;
  dateDialog.value = true;
}

function clearDateFilter(key: string) {
  currentDate.value = null;

  setDateToObject(key, null);
}

function setDateToObject(key: string, date: string | null) {
  if (
    (tab.value === "individual" && key === "dateOrBirth") ||
    key === "dateOrBirth" ||
    key === "dateOfJoin" ||
    key === "startDate" ||
    key === "endDate" ||
    key === "liftAccessStartDate" ||
    key === "liftAccessEndDate"
  ) {
    accessCard.value[key] = date;
  }

  currentDate.value = null;
}

async function updateDate(date: Date | null) {
  currentDate.value = date;
}

async function applyDate(condition: string) {
  if (condition === "hasValue" && currentDate.value) {
    const getDate = new Date(currentDate.value);

    setDateToObject(setDateTo.value, standardFormatDate(getDate));
  }

  dateDialog.value = false;
}
</script>

<style scoped>
:deep() .v-slide-group__content {
  border-bottom: 2px #e0e0e0 solid;
}
</style>
