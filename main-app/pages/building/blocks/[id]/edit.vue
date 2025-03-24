<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card width="100%" elevation="3" height="100%" :loading="isUnitsLoaded">
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-card-title class="pt-3 font-weight-bold">
          <back-button></back-button>
          Edit
          <span class="text-subtitle-1 ml-3">
            (
            {{
              `${selectedUnit.block.name} / ${selectedUnit.level.level} / ${selectedUnit.name}`
            }}
            )
          </span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text v-if="unitSetupDetails">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="6"
              :class="{ 'pr-5': $vuetify.display.mdAndUp }"
              :style="{
                borderRight: $vuetify.display.mdAndUp
                  ? theme == 'light'
                    ? '1px solid #E0E0E0'
                    : '1px solid #424242'
                  : '',
              }"
            >
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12" class="font-weight-bold">
                      General Info
                      <v-divider class="mt-3"></v-divider>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-select
                        v-model="unitSetupDetails.block.name"
                        label="Block"
                        density="compact"
                        menu-icon="mdi-chevron-down"
                        :persistent-hint="false"
                        hide-details
                        disabled
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="unitSetupDetails.level.level"
                        label="Level"
                        density="compact"
                        menu-icon="mdi-chevron-down"
                        :persistent-hint="false"
                        hide-details
                        disabled
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="unitSetupDetails.name"
                        label="Unit"
                        density="compact"
                        menu-icon="mdi-chevron-down"
                        :persistent-hint="false"
                        hide-details
                        disabled
                      >
                      </v-select>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="unitSetupDetails.unitArea"
                        label="Unit Area"
                        density="compact"
                        :persistent-hint="false"
                        hide-details
                        :disabled="isUnitsLoaded"
                        type="number"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="unitSetupDetails.category"
                        label="Unit Category"
                        :items="[
                          'Resident',
                          // 'Commercial',
                          'Amenities',
                          'Management',
                        ]"
                        density="compact"
                        menu-icon="mdi-chevron-down"
                        :persistent-hint="false"
                        hide-details
                        :disabled="
                          !selectedUnit.unitOwnerName ? isUnitsLoaded : true
                        "
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="selectedUnit.unitOwnerName"
                        label="Unit Owner"
                        density="compact"
                        menu-icon="mdi-chevron-down"
                        :persistent-hint="false"
                        hide-details
                        disabled
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="unitSetupDetails.unitOwner.moveInDate"
                        label="Moved In Date"
                        readonly
                        hide-details
                        clearable
                        append-inner-icon="mdi-calendar"
                        @click="moveInDateDialog = true"
                        @click:clear="clearDateFilter"
                        :disabled="isUnitsLoaded"
                      >
                      </v-text-field>

                      <v-dialog v-model="moveInDateDialog" max-width="355">
                        <v-card>
                          <v-card-subtitle>
                            <v-date-picker
                              width="320"
                              v-model="moveInDate"
                              @input="updateStartDate"
                              locale="en"
                              @change="applyStartDate"
                            ></v-date-picker>
                          </v-card-subtitle>
                        </v-card>
                      </v-dialog>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="unitSetupDetails.unitOwner.parkingLotNo"
                        label="Parking Lot No."
                        density="compact"
                        :persistent-hint="false"
                        hide-details
                        :disabled="isUnitsLoaded"
                        type="number"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="unitSetupDetails.unitOwner.vehicleNo"
                        label="Vehicle No."
                        density="compact"
                        :persistent-hint="false"
                        hide-details
                        :disabled="isUnitsLoaded"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="unitSetupDetails.unitOwner.vehicleModel"
                        label="Model"
                        density="compact"
                        :persistent-hint="false"
                        hide-details
                        :disabled="isUnitsLoaded"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="unitSetupDetails.unitOwner.vehicleColor"
                        label="Color"
                        :items="materialColors"
                        density="compact"
                        menu-icon="mdi-chevron-down"
                        :persistent-hint="false"
                        :disabled="isUnitsLoaded"
                        hide-details
                      >
                        <template v-slot:chip="{ props, item }">
                          <div v-bind="props" class="text-capitalize">
                            <v-icon :color="item.raw">mdi-circle</v-icon>
                            {{ item.raw }}
                          </div>
                        </template>
                        <template v-slot:item="{ props, item }">
                          <v-list v-bind="props" density="compact">
                            <v-list-item link class="text-capitalize">
                              <v-icon :color="item.raw">mdi-circle</v-icon>
                              {{ item.raw }}
                            </v-list-item>
                          </v-list>
                          <v-divider></v-divider>
                        </template>
                      </v-select>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12" class="font-weight-bold pt-4">
                      Billing Address
                      <v-divider class="mt-3"></v-divider>
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="
                          unitSetupDetails.unitOwner.billingAddress.line1
                        "
                        label="Address 1"
                        density="compact"
                        :persistent-hint="false"
                        hide-details
                        :disabled="isUnitsLoaded"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="
                          unitSetupDetails.unitOwner.billingAddress.line2
                        "
                        label="Address 2"
                        density="compact"
                        :persistent-hint="false"
                        hide-details
                        :disabled="isUnitsLoaded"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="unitSetupDetails.unitOwner.billingAddress.city"
                        label="City"
                        density="compact"
                        :persistent-hint="false"
                        hide-details
                        :disabled="isUnitsLoaded"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="
                          unitSetupDetails.unitOwner.billingAddress.state
                        "
                        label="State"
                        density="compact"
                        :persistent-hint="false"
                        hide-details
                        :disabled="isUnitsLoaded"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="
                          unitSetupDetails.unitOwner.billingAddress.country
                        "
                        label="Country"
                        :items="countryList"
                        item-value="country"
                        density="compact"
                        :persistent-hint="false"
                        hide-details
                        :disabled="isUnitsLoaded"
                      >
                        <template v-slot:chip="{ props, item }">
                          <div v-bind="props" class="text-truncate">
                            {{ `(${item.raw.code}) ${item.raw.label}` }}
                          </div>
                        </template>
                        <template v-slot:item="{ props, item }">
                          <v-list v-bind="props" density="compact">
                            <v-list-item link>
                              {{ `${item.raw.label}` }}
                            </v-list-item>
                          </v-list>
                          <v-divider></v-divider>
                        </template>
                      </v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="
                          unitSetupDetails.unitOwner.billingAddress.postalCode
                        "
                        label="Postal Code"
                        density="compact"
                        :persistent-hint="false"
                        hide-details
                        :disabled="isUnitsLoaded"
                        type="number"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12">
                  <v-row>
                    <v-col cols="12" class="font-weight-bold pt-4">
                      Documents
                      <v-divider class="mt-3"></v-divider>
                    </v-col>
                    <v-col cols="12" class="pt-0 mb-3">
                      <template
                        v-for="(data, key) in selectedUnit?.uploadedDocuments"
                        :key="key"
                      >
                        <template
                          v-for="(file, index) in data?.files"
                          :key="index"
                        >
                          <v-chip class="ma-2">
                            {{ file?.name }}
                            <v-icon class="ml-2" color="red" @click=""
                              >mdi-delete</v-icon
                            >
                          </v-chip>
                        </template>
                      </template>

                      <template v-if="!selectedUnit?.uploadedDocuments?.length">
                        <v-row no-gutters justify="center" class="my-5">
                          <v-col cols="12">
                            <v-row no-gutters justify="center">
                              <span class="caption text-disabled">
                                No documents included for this unit.
                              </span>
                            </v-row>
                          </v-col>
                        </v-row>
                      </template>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-col cols="12" class="font-weight-bold"> Features </v-col>
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col v-for="(data, key) in features" :key="key" cols="6">
                    <v-list density="compact" :disabled="isUnitsLoaded">
                      <v-list-item class="pl-0" @click="onSelectFeature(data)">
                        <v-icon
                          class="mr-1"
                          :color="
                            unitSetupDetails?.features
                              ? unitSetupDetails?.features?.findIndex(
                                  (find) => find.label == data.label,
                                ) != -1
                                ? 'green'
                                : 'grey'
                              : 'grey'
                          "
                        >
                          {{
                            unitSetupDetails?.features
                              ? unitSetupDetails?.features?.findIndex(
                                  (find) => find.label == data.label,
                                ) != -1
                                ? "mdi-check-circle"
                                : "mdi-radiobox-blank"
                              : "mdi-radiobox-blank"
                          }}
                        </v-icon>
                        {{ data.label }}
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12" md="2" offset-md="10" offset="0">
              <v-btn
                color="#1867C0"
                class="my-4 w-100"
                height="40px"
                @click="onUpdateUnitSetup()"
                :disabled="isUnitsLoaded"
              >
                Update
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import phoneCode from "../../../../components/phone-code.json";
definePageMeta({
  middleware: "secure",
});

const {
  isUnitsLoaded,
  createUnitSetup,
  units,
  setBlockLevelUnits,
  filterBySite,
  viewUnitSetup,
  unitSetupDetails,
} = useBlockLevelUnit();

const { standardFormatDate, materialColors } = useUtils();
const { theme, setSnackbar } = useLocal();
const { mySite, myOrg } = useFilter();
const route = useRoute();

const countryList = phoneCode;

const moveInDateDialog = ref(false);
const moveInDate = ref<Date | null>(null);

const features = ref([
  { label: "Enable EntryPass (NFC) Card", value: false },
  { label: "Enable QR Code Access", value: false },
  { label: "Enable Resident / Tenant Access Card", value: false },
]);

const form = ref({
  unitOwner: null,
  unitArea: null,
  unitCategory: null,
  vehicleNo: null,
  vehicleModel: null,
  vehicleColor: null,
  moveInDate: null,
  parkingLotNo: null,
  billingAddress: {
    line1: null,
    line2: null,
    city: null,
    state: null,
    country: null,
    postalCode: null,
  },
  features: [],
});

const selectedUnit = ref({
  block: {
    name: "",
  },
  level: {
    level: "",
  },
  name: "",
  unitOwnerName: "",
});

onMounted(async () => {
  await setBlockLevelUnits({
    organization: myOrg.value ?? "",
    site: filterBySite.value || mySite.value,
  });

  const unitInfo = units.value.find((find) => find._id == route.params.id);
  selectedUnit.value = unitInfo;
  selectedUnit.value.unitOwnerName = `${unitInfo.unit_owner.givenName} ${unitInfo.unit_owner.surname}`;

  form.value.unitOwner = unitInfo.unit_owner._id;
  form.value.unitCategory = unitInfo.category;

  await viewUnitSetup(route.params.id, 1, "");
});

watch(moveInDate, (newVal) => {
  applyStartDate(newVal && "hasValue");
});

async function updateStartDate(date: Date | null) {
  moveInDate.value = date;
}

async function applyStartDate(condition: string) {
  if (condition === "hasValue" && moveInDate.value) {
    const getDate = new Date(moveInDate.value);

    form.value.moveInDate = standardFormatDate(getDate);
  }

  moveInDateDialog.value = false;
}

async function clearDateFilter() {
  moveInDate.value = null;
  form.value.moveInDate = "";
}

async function onSelectFeature(data: any) {
  const findFeature = unitSetupDetails.value?.features?.findIndex(
    (find) => find.label == data.label,
  );

  if (findFeature == -1) {
    unitSetupDetails.value?.features.push(data);
    data.value = true;
  } else {
    unitSetupDetails.value?.features.splice(findFeature, 1);
    data.value = false;
  }
}

async function onUpdateUnitSetup() {
  const payload = {
    unitOwner: form.value.unitOwner,
    unitArea: unitSetupDetails.value.unitArea,
    unitCategory: form.value.unitCategory,
    vehicleNo: unitSetupDetails.value.unitOwner.vehicleNo,
    vehicleModel: unitSetupDetails.value.unitOwner.vehicleModel,
    vehicleColor: unitSetupDetails.value.unitOwner.vehicleColor,
    moveInDate: form.value.moveInDate
      ? form.value.moveInDate
      : unitSetupDetails.value.unitOwner.moveInDate,
    parkingLotNo: unitSetupDetails.value.unitOwner.parkingLotNo,
    billingAddress: {
      line1: unitSetupDetails.value.unitOwner.billingAddress.line1,
      line2: unitSetupDetails.value.unitOwner.billingAddress.line2,
      city: unitSetupDetails.value.unitOwner.billingAddress.city,
      state: unitSetupDetails.value.unitOwner.billingAddress.state,
      country: unitSetupDetails.value.unitOwner.billingAddress.country,
      postalCode: unitSetupDetails.value.unitOwner.billingAddress.postalCode,
    },
    features: unitSetupDetails.value.features,
  };

  isUnitsLoaded.value = true;

  try {
    const result = await createUnitSetup(route.params.id, payload);
    if (result.acknowledged) {
      setSnackbar({
        text: "Successfully updated unit setup.",
        type: "success",
        modal: true,
      });
      isUnitsLoaded.value = false;
    }
  } catch (err) {
    setSnackbar({
      text: err,
      type: "error",
      modal: true,
    });
    isUnitsLoaded.value = false;
  }
}
</script>

<style scoped>
:deep() .v-field__outline {
  --v-field-border-opacity: 0.1;
}

:deep() .v-overlay__scrim {
  opacity: var(--v-overlay-opacity, 0);
}

:deep() .v-switch .v-label {
  padding-right: 10px;
  font-size: 13px;
}

:deep() .v-switch .v-selection-control {
  display: flex;
  flex-direction: row-reverse;
}

:deep() .v-text-field input {
  font-size: 13px !important;
}

:deep() .v-textarea .v-field__input {
  font-size: 13px !important;
}

:deep() .v-selection-control .v-label {
  font-size: 13px;
}
</style>
