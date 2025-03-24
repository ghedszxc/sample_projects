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
          Setup Unit
          <span class="text-subtitle-1 ml-3">
            (
            {{
              `${selectedUnit.block.name} / ${selectedUnit.level.level} / ${selectedUnit.name}`
            }}
            )
          </span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
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
                        v-model="selectedUnit.block.name"
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
                        v-model="selectedUnit.level.level"
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
                        v-model="selectedUnit.name"
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
                        v-model="form.unitArea"
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
                        v-model="form.unitCategory"
                        :items="unitCategoryItems"
                        density="compact"
                        menu-icon="mdi-chevron-down"
                        :persistent-hint="false"
                        hide-details
                        :rules="[requiredInput]"
                        :disabled="isUnitsLoaded"
                      >
                        <template v-slot:label>
                          Unit Category
                          <span class="text-red font-weight-bold">*</span>
                        </template>
                      </v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="form.unitOwner"
                        label="Unit Owner"
                        :items="userList"
                        item-value="_id"
                        density="compact"
                        menu-icon="mdi-chevron-down"
                        :persistent-hint="false"
                        hide-details
                        :disabled="isUnitsLoaded"
                      >
                        <template v-slot:chip="{ props, item }">
                          <div
                            v-bind="props"
                            class="text-capitalize text-truncate"
                          >
                            {{ item.props.title.surname }}
                            {{ item.props.title.givenName }}
                          </div>
                        </template>
                        <template v-slot:item="{ props, item }">
                          <v-list v-bind="props" density="compact">
                            <v-list-item link class="text-capitalize">
                              {{ item.props.title.surname }}
                              {{ item.props.title.givenName }}
                            </v-list-item>
                          </v-list>
                          <v-divider></v-divider>
                        </template>
                      </v-select>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="form.moveInDate"
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
                        v-model="form.parkingLotNo"
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
                        v-model="form.vehicleNo"
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
                        v-model="form.vehicleModel"
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
                        v-model="form.vehicleColor"
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
                        v-model="form.billingAddress.line1"
                        density="compact"
                        :persistent-hint="false"
                        hide-details
                        :disabled="isUnitsLoaded"
                        :rules="[requiredInput]"
                      >
                        <template v-slot:label>
                          Address 1
                          <span class="text-red font-weight-bold">*</span>
                        </template>
                      </v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.billingAddress.line2"
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
                        v-model="form.billingAddress.city"
                        density="compact"
                        :persistent-hint="false"
                        hide-details
                        :disabled="isUnitsLoaded"
                        :rules="[requiredInput]"
                      >
                        <template v-slot:label>
                          City
                          <span class="text-red font-weight-bold">*</span>
                        </template>
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="form.billingAddress.state"
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
                        v-model="form.billingAddress.country"
                        :items="countryList"
                        item-value="country"
                        density="compact"
                        :persistent-hint="false"
                        hide-details
                        :disabled="isUnitsLoaded"
                        :rules="[requiredInput]"
                      >
                        <template v-slot:label>
                          Country
                          <span class="text-red font-weight-bold">*</span>
                        </template>
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
                        v-model="form.billingAddress.postalCode"
                        density="compact"
                        :persistent-hint="false"
                        hide-details
                        :disabled="isUnitsLoaded"
                        type="number"
                        :rules="[requiredInput]"
                      >
                        <template v-slot:label>
                          Postal Code
                          <span class="text-red font-weight-bold">*</span>
                        </template>
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
                    <v-checkbox
                      :label="data.label"
                      v-model="data.value"
                      hide-details
                      :disabled="isUnitsLoaded"
                      color="green"
                    ></v-checkbox>
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
                @click="onCreateUnitSetup()"
                :disabled="isUnitsLoaded"
              >
                Save
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
} = useBlockLevelUnit();

const { standardFormatDate, materialColors, requiredInput } = useUtils();
const { theme, setSnackbar } = useLocal();
const { mySite, myOrg } = useFilter();
const route = useRoute();
const { getSiteById } = useSite();
const { getUsersByPageSearch } = useUser();

const siteCat = ref("");

const countryList = phoneCode;

const moveInDateDialog = ref(false);
const moveInDate = ref<Date | null>(null);
const unitCategoryItems = computed(() => {
  return siteCat.value === "Residential"
    ? ["Resident", "Amenities", "Management"]
    : ["Commercial", "Amenities", "Management"];
});
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

const userList = ref([]);

onMounted(async () => {
  const [getSite, getBlock, getUsers] = await Promise.all([
    getSiteById(mySite.value),
    setBlockLevelUnits({
      organization: myOrg.value ?? "",
      site: filterBySite.value || mySite.value,
    }),
    getUsersByPageSearch({
      organization: myOrg.value ?? "",
      site: filterBySite.value || mySite.value,
    }),
  ]);

  userList.value = getUsers.items;

  siteCat.value = getSite?.siteCategory;

  const unitInfo = units.value.find((find) => find._id == route.params.id);
  selectedUnit.value = unitInfo;
  form.value.unitOwner = unitInfo.unit_owner._id;
  form.value.unitCategory = unitInfo.category;
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

function clearDateFilter() {
  moveInDate.value = null;
  form.value.moveInDate = "";
}

async function onCreateUnitSetup() {
  isUnitsLoaded.value = true;
  form.value.features = features.value.filter((find) => find.value);

  try {
    const result = await createUnitSetup(route.params.id, form.value);

    if (result.acknowledged) {
      setSnackbar({
        text: "Successfully created unit setup.",
        type: "success",
        modal: true,
      });

      isUnitsLoaded.value = false;
      useRouter().back();
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
