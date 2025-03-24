<template>
  <div v-if="incident" class="pa-8">
    <div class="w-100">
      <div class="font-weight-bold">Any unit affected:</div>
      <v-radio-group
        class="mb-5"
        :rules="[requiredInput]"
        v-model="incident.affectedEntities.anyUnitAffectedValue"
      >
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-radio label="Yes, details appended herein" value="yes"></v-radio>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-radio label="No" value="no"></v-radio>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-radio
              label="Uncertain/Unable to determine"
              value="uncertain"
            ></v-radio>
          </v-col>
        </v-row>
      </v-radio-group>
    </div>

    <div
      v-if="
        incident.affectedEntities.anyUnitAffectedValue === 'yes' ||
        incident.affectedEntities.anyUnitAffectedValue === 'uncertain'
      "
    >
      <v-row class="align-center">
        <template v-if="!incident.affectedEntities.affectedUnit.isOther">
          <v-col cols="12" md="2">
            <v-autocomplete
              v-model="incident.affectedEntities.affectedUnit.block"
              :items="blocks"
              label="Block"
              hide-details="auto"
              item-title="name"
              item-value="_id"
              :rules="[requiredInput]"
              :disabled="
                incident.affectedEntities.anyUnitAffectedValue === 'no' ||
                incident.affectedEntities.anyUnitAffectedValue === ''
              "
              @update:modelValue="
                onSelectBlockAffectedUnit(
                  incident?.affectedEntities.affectedUnit.block,
                )
              "
              @update:search="onSearchBlock"
              clearable
              no-filter
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="2">
            <v-autocomplete
              v-model="incident.affectedEntities.affectedUnit.level"
              label="Level"
              hide-details="auto"
              :rules="[requiredInput]"
              :items="blockLevels"
              item-title="level"
              item-value="_id"
              :disabled="
                incident.affectedEntities.anyUnitAffectedValue === 'no'
              "
              @update:modelValue="
                onSelectBlockLevelAffectedUnit(
                  incident.affectedEntities.affectedUnit.block,
                  incident.affectedEntities.affectedUnit.level,
                )
              "
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="incident.affectedEntities.affectedUnit.unit"
              label="Unit"
              hide-details="auto"
              :rules="[requiredInput]"
              :items="units"
              item-title="name"
              item-value="_id"
              :disabled="
                incident.affectedEntities.anyUnitAffectedValue === 'no'
              "
              @update:model-value="onSelectUnit()"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="incident.affectedEntities.affectedUnit.resident"
              label="Resident"
              hide-details="auto"
              :rules="[requiredInput]"
              :items="users"
              :item-title="
                (user) =>
                  `${user.givenName || ''} ${user.surname || ''}`.toUpperCase()
              "
              item-value="_id"
              :disabled="
                incident.affectedEntities.anyUnitAffectedValue === 'no'
              "
            ></v-autocomplete>
          </v-col>
        </template>

        <template v-else>
          <v-col cols="12" sm="12" md="10">
            <v-text-field
              v-model="incident.affectedEntities.affectedUnit.other"
              label="Other Place"
              hide-details="auto"
              class="mt-2"
              :rules="[requiredInput]"
            ></v-text-field>
          </v-col>
        </template>

        <v-col cols="12" sm="12" md="2">
          <v-checkbox
            class=""
            label="Other"
            v-model="incident.affectedEntities.affectedUnit.isOther"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-sheet class="w-100 mb-3 mt-2">
        <v-textarea
          v-model="incident.affectedEntities.affectedUnit.description"
          density="comfortable"
          label="Remarks"
          clearable
          no-resize
          :rules="[requiredInput]"
          :disabled="incident.affectedEntities.anyUnitAffectedValue === 'no'"
        >
        </v-textarea>
      </v-sheet>
    </div>

    <v-divider class="border-opacity-25 my-5"></v-divider>

    <!-- Anyone affected/injured? -->
    <div class="w-100">
      <div class="font-weight-bold">Anyone affected/injured?</div>
      <v-radio-group
        :rules="[requiredInput]"
        v-model="incident.affectedEntities.anyoneAffectedValue"
      >
        <v-row class="my-3">
          <v-col cols="12" sm="4">
            <v-radio label="Yes, details appended herein" value="yes"></v-radio>
          </v-col>
          <v-col cols="12" sm="4">
            <v-radio label="No" value="no"></v-radio>
          </v-col>
          <v-col cols="12" sm="4" style="margin-top: -6px">
            <v-radio
              label="Pending determination by relevant authorities"
              value="pending"
            ></v-radio>
          </v-col>
        </v-row>
      </v-radio-group>
    </div>

    <div
      v-if="
        incident.affectedEntities.anyoneAffectedValue === 'yes' ||
        incident.affectedEntities.anyoneAffectedValue === 'pending'
      "
    >
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="affectedInjured.name"
            hide-details="auto"
            label="Name"
            :disabled="isAnyoneAffectedHasNoValue"
            :hint="isAnyoneAffectedHasNoValue ? 'This is required.' : ''"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="affectedInjured.nric"
            hide-details="auto"
            label="NRIC/WP no."
            :disabled="isAnyoneAffectedHasNoValue"
            :hint="isAnyoneAffectedHasNoValue ? 'This is required.' : ''"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="mb-5">
            <span class="font-weight">Contact Number</span>
          </div>
          <v-row>
            <v-col cols="12" md="4" sm="12">
              <v-select
                v-model="prefix_affected"
                :items="prefixes"
                item-title="country"
                item-value="dial_code"
                hide-details
                menu-icon="mdi-chevron-down"
                chips
                label="Dial Code"
              >
                <template v-slot:chip="{ props, item }">
                  <div v-bind="props">
                    {{
                      item.raw.code
                        ? `${item.raw?.code} (+${item.raw?.phone})`
                        : ""
                    }}
                  </div>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list v-bind="props" density="compact">
                    <v-list-item link>
                      {{ `${item.raw.label} (+${item.raw.phone})` }}
                    </v-list-item>
                  </v-list>
                  <v-divider></v-divider>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field
                v-model="primaryPhone_affected"
                label="Phone Number"
                type="tel"
                @update:modelValue="onFormatAffectedContact"
                :rules="[
                  (input) =>
                    prefix_affected?.phoneLength
                      ? input?.length == prefix_affected?.phoneLength ||
                        `Phone number must contain ${prefix_affected?.phoneLength} numbers`
                      : 'Select from dial code first',
                ]"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="2">
          <v-btn
            class="bg-blue-darken-4 w-100"
            :disabled="isAnyoneAffectedHasNoValue"
            @click="addAffectedPerson()"
            ><v-icon class="mr-2">mdi-table</v-icon>Add</v-btn
          ></v-col
        >
      </v-row>
    </div>

    <div class="my-5 mx-2">
      <v-row
        class="d-none d-md-flex"
        :style="
          $vuetify.theme.current.dark
            ? 'background-color: #495057'
            : 'background-color: #f5f5f5'
        "
      >
        <v-col class="border pa-3 font-weight-medium">
          <div>Name</div>
        </v-col>
        <v-col class="border pa-3 font-weight-medium">
          <div>NRIC/WP No.</div>
        </v-col>
        <v-col class="border pa-3 font-weight-medium">
          <div>Contact Number</div>
        </v-col>
      </v-row>

      <v-row
        v-if="incident.affectedEntities.affectedInjured.length > 0"
        v-for="person in incident.affectedEntities.affectedInjured"
        :key="person.nric"
        class="border"
      >
        <v-col class="border pa-3" cols="12" md="4">
          <div class="font-weight-bold d-md-none">Name</div>
          <div>{{ person.name }}</div>
        </v-col>
        <v-col class="border pa-3" cols="12" md="4">
          <div class="font-weight-bold d-md-none">NRIC/WP No.</div>
          <div>{{ person.nric }}</div>
        </v-col>
        <v-col class="border pa-3" cols="12" md="4">
          <div class="font-weight-bold d-md-none">Contact Number</div>
          <div>{{ person.contact }}</div>
        </v-col>
      </v-row>

      <v-row v-else class="d-flex justify-center border pa-3">
        <v-col class="pa-3" cols="12"
          ><div class="text-center">No affected persons found.</div></v-col
        >
      </v-row>
    </div>

    <v-divider class="border-opacity-25 my-5"></v-divider>

    <!-- Anyone damage to property? -->

    <div class="w-100">
      <div class="font-weight-bold">Anyone damage to property?</div>
      <v-radio-group
        :rules="[requiredInput]"
        v-model="incident.affectedEntities.anyPropertyAffectedValue"
      >
        <v-row class="my-3">
          <v-col cols="12" sm="6">
            <v-radio label="Yes, details appended herein" value="yes"></v-radio>
          </v-col>
          <v-col cols="12" sm="6">
            <v-radio label="No" value="no"></v-radio>
          </v-col>
        </v-row>
      </v-radio-group>
    </div>

    <div v-if="incident.affectedEntities.anyPropertyAffectedValue === 'yes'">
      <v-sheet class="w-100">
        <v-textarea
          v-model="anyoneDamageToProperty.description"
          density="comfortable"
          label="Description of damage"
          clearable
          no-resize
          :disabled="isPropertyAffectedHasNoValue"
          :hint="isPropertyAffectedHasNoValue ? 'This is required.' : ''"
        ></v-textarea>
      </v-sheet>

      <v-row class="align-center">
        <template v-if="!anyoneDamageToProperty.isOther">
          <v-col cols="12" md="2">
            <v-autocomplete
              v-model="anyoneDamageToProperty.block"
              :items="blocks"
              label="Block"
              item-title="name"
              item-value="_id"
              hide-details="auto"
              :disabled="isPropertyAffectedHasNoValue"
              :hint="isPropertyAffectedHasNoValue ? 'This is required.' : ''"
              @update:modelValue="
                onSelectBlockAnyoneDamageToProperty(
                  anyoneDamageToProperty.block,
                )
              "
              @update:search="onSearchBlock"
              clearable
              no-filter
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
              v-model="anyoneDamageToProperty.level"
              label="Level"
              hide-details="auto"
              :items="blockLevels"
              item-title="level"
              item-value="_id"
              :disabled="isPropertyAffectedHasNoValue"
              :hint="isPropertyAffectedHasNoValue ? 'This is required.' : ''"
              @update:modelValue="
                onSelectBlockLevelAnyoneDamageToProperty(
                  anyoneDamageToProperty.block,
                  anyoneDamageToProperty.level,
                )
              "
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-model="anyoneDamageToProperty.unit"
              label="Unit"
              hide-details="auto"
              :items="units"
              item-title="name"
              item-value="_id"
              :disabled="isPropertyAffectedHasNoValue"
              :hint="isPropertyAffectedHasNoValue ? 'This is required.' : ''"
            ></v-autocomplete>
          </v-col>
        </template>

        <template v-else>
          <v-col cols="12" sm="12" md="7">
            <v-text-field
              v-model="anyoneDamageToProperty.other"
              label="Other Place"
              hide-details="auto"
              hint=""
              :rules="[requiredInput]"
            ></v-text-field>
          </v-col>
        </template>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="anyoneDamageToProperty.name"
            label="Name"
            hide-details="auto"
            :disabled="isPropertyAffectedHasNoValue"
            :hint="isPropertyAffectedHasNoValue ? 'This is required.' : ''"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="12" md="2">
          <v-checkbox
            class="mt-5"
            label="Other"
            v-model="anyoneDamageToProperty.isOther"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="mb-5">
            <span class="font-weight">Contact Number</span>
          </div>
          <v-row>
            <v-col cols="12" md="4" sm="12">
              <v-select
                v-model="prefix_anyone"
                :items="prefixes"
                item-title="country"
                item-value="dial_code"
                hide-details
                menu-icon="mdi-chevron-down"
                chips
                label="Dial Code"
              >
                <template v-slot:chip="{ props, item }">
                  <div v-bind="props">
                    {{
                      item.raw.code
                        ? `${item.raw?.code} (+${item.raw?.phone})`
                        : ""
                    }}
                  </div>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list v-bind="props" density="compact">
                    <v-list-item link>
                      {{ `${item.raw.label} (+${item.raw.phone})` }}
                    </v-list-item>
                  </v-list>
                  <v-divider></v-divider>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field
                v-model="primaryPhone_anyone"
                label="Phone Number"
                type="number"
                @update:modelValue="onFormatAnyoneContact"
                :rules="[
                  (input) =>
                    prefix_anyone?.phoneLength
                      ? input?.length == prefix_anyone?.phoneLength ||
                        `Phone number must contain ${prefix_anyone?.phoneLength} numbers`
                      : 'Select from dial code first',
                ]"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="2">
          <v-btn
            class="bg-blue-darken-4 w-100"
            :disabled="isPropertyAffectedHasNoValue"
            @click="addAffectedProperty()"
            ><v-icon class="mr-2">mdi-table</v-icon>Add</v-btn
          ></v-col
        ></v-row
      >
    </div>

    <div class="my-5 mx-5">
      <v-row
        class="d-none d-md-flex"
        :style="
          $vuetify.theme.current.dark
            ? 'background-color: #495057'
            : 'background-color: #f5f5f5'
        "
      >
        <v-col class="border pa-3 font-weight-medium" cols="12" md="3">
          <div>Description</div>
        </v-col>
        <v-col class="border pa-3 font-weight-medium" cols="12" md="3">
          <div>Block / Level / Unit</div>
        </v-col>
        <v-col class="border pa-3 font-weight-medium" cols="12" md="3">
          <div>Name</div>
        </v-col>
        <v-col class="border pa-3 font-weight-medium" cols="12" md="2">
          <div>Contact Number</div>
        </v-col>
        <v-col class="border pa-3 font-weight-medium" cols="12" md="1">
          <div>Action</div>
        </v-col>
      </v-row>

      <pre></pre>
      <v-row
        v-if="incident.affectedEntities.anyoneDamageToProperty.length > 0"
        v-for="(property, index) in incident.affectedEntities
          .anyoneDamageToProperty"
        :key="index"
        class="border"
      >
        <v-col class="border pa-3" cols="12" md="3">
          <div class="font-weight-bold d-md-none">Description</div>
          <div>{{ property.description }}</div>
        </v-col>
        <v-col class="border pa-3" cols="12" md="3">
          <div class="font-weight-bold d-md-none">Block / Level / Unit</div>
          <div v-if="!property.isOther">
            {{
              `${property.block.name || blocks.find((i) => i._id === property.block)?.name || ""} /
              ${property.level.level || tempLevel.find((i) => i._id === property.level)?.level || ""} /
              ${property.unit.name || tempUnit.find((i) => i._id === property.unit)?.name || ""}`
            }}
          </div>
          <div v-else>
            {{ property.other }}
          </div>
        </v-col>
        <v-col class="border pa-3" cols="12" md="3">
          <div class="font-weight-bold d-md-none">Name</div>
          <div>{{ property.name }}</div>
        </v-col>
        <v-col class="border pa-3" cols="12" md="2">
          <div class="font-weight-bold d-md-none">Contact Number</div>
          <div>{{ property.contact }}</div>
        </v-col>

        <v-col class="border pa-3" cols="12" md="1">
          <v-icon color="red" @click="removeDamage(index)"
            >mdi-trash-can-outline</v-icon
          >
        </v-col>
      </v-row>

      <v-row v-else class="d-flex justify-center border pa-3">
        <v-col class="pa-3" cols="12">
          <div class="text-center">No property affected.</div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";
import phoneCode from "../phone-code.json";
const { requiredInput, formatPhoneNumber, displayPhoneNumber } = useUtils();
const { getAllResidentsByOrgAndSite, users } = useUser();
const { getAllBuildingBlocks, blocks, search: blockSearch } = useBlock();
const { getAllLevel, blockLevels, search: levelSearch } = useBlockLevel();
const { getAllUnits, units, search: unitSearch } = useBlockLevelUnit();
const { mySite } = useFilter();
let props = defineProps({
  incident: {
    type: Object,
  },
});

const prefixes = phoneCode;
const prefix_affected = ref("+65");
const prefix_anyone = ref("+65");
const primaryPhone_affected = ref("");
const primaryPhone_anyone = ref("");
const tempLevel: Ref<TBlockLevel[]> = ref([]);
const tempUnit: Ref<TBlockLevel[]> = ref([]);
const affectedInjured = ref({
  contact: "",
  name: "",
  nric: "",
} as IAffectedInjured);
const anyoneDamageToProperty = ref({
  contact: "",
  name: "",
  block: "",
  description: "",
  level: "",
  unit: "",
} as IAnyoneDamageToProperty);
const isAnyoneAffectedHasNoValue = computed(() => {
  return props.incident.affectedEntities.anyoneAffectedValue === "no";
});
const isPropertyAffectedHasNoValue = computed(() => {
  return props.incident.affectedEntities.anyPropertyAffectedValue === "no";
});

onMounted(() => {
  displayAffectedContact();
  displayAnyoneContact();
});

// affected unit
const onSelectBlockAffectedUnit = async (block: string) => {
  await getAllLevel({
    block: block,
  });
  props.incident.affectedEntities.affectedUnit.level = "";
  props.incident.affectedEntities.affectedUnit.unit = "";
};

const onSelectBlockLevelAffectedUnit = async (
  block: string,
  blockLevel: string,
) => {
  await getAllUnits({
    block: block,
    level: blockLevel,
    // organization: currentUser.value?.organization,
  });
  props.incident.affectedEntities.affectedUnit.unit = "";
};

const addAffectedPerson = async () => {
  if (
    affectedInjured.value.nric &&
    affectedInjured.value.name &&
    affectedInjured.value.contact
  ) {
    props.incident.affectedEntities.affectedInjured.push(affectedInjured.value);
    affectedInjured.value = {};
    primaryPhone_affected.value = "";
    prefix_affected.value = "+65";
    primaryPhone_anyone.value = "";
    prefix_anyone.value = "+65";
  }
};

// anyoneDamageToProperty
const onSelectBlockAnyoneDamageToProperty = async (block: string) => {
  await getAllLevel({
    block: block,
  });

  anyoneDamageToProperty.value.level = "";
  anyoneDamageToProperty.value.unit = "";
};

const addAffectedProperty = async () => {
  tempLevel.value = [...tempLevel.value, ...blockLevels.value];
  tempUnit.value = [...tempUnit.value, ...units.value];
  if (
    anyoneDamageToProperty.value.isOther &&
    anyoneDamageToProperty.value.other != ""
  ) {
    props.incident.affectedEntities.anyoneDamageToProperty.push(
      anyoneDamageToProperty.value,
    );
    anyoneDamageToProperty.value = {};
  } else {
    if (
      anyoneDamageToProperty.value.contact &&
      anyoneDamageToProperty.value.name &&
      anyoneDamageToProperty.value.description &&
      anyoneDamageToProperty.value.block &&
      anyoneDamageToProperty.value.level &&
      anyoneDamageToProperty.value.unit
    ) {
      let data = JSON.stringify(anyoneDamageToProperty.value);
      let propertyData = JSON.parse(data);
      props.incident.affectedEntities.anyoneDamageToProperty.push(propertyData);
      anyoneDamageToProperty.value = {};
      primaryPhone_anyone.value = "";
    }
  }
};

const onSelectBlockLevelAnyoneDamageToProperty = async (
  block: string,
  blockLevel: string,
) => {
  await getAllUnits({
    block: block,
    level: blockLevel,
  });

  anyoneDamageToProperty.value.unit = "";
};

const onSelectUnit = async () => {
  await getAllResidentsByOrgAndSite({
    site: mySite.value,
    unit: props.incident.affectedEntities.affectedUnit.unit,
  });
};

function displayAffectedContact(value?: string) {
  // format mobile number
  const { countryCode, pNumber } = displayPhoneNumber(
    affectedInjured.value.contact || value || "",
  );
  primaryPhone_affected.value = pNumber;
  if (countryCode) {
    prefix_affected.value = countryCode;
  }
}

function displayAnyoneContact(value?: string) {
  // format primary number
  const { countryCode, pNumber } = displayPhoneNumber(
    anyoneDamageToProperty.value.contact || value || "",
  );
  primaryPhone_anyone.value = pNumber;
  if (countryCode) {
    prefix_anyone.value = countryCode;
  }
}

const onSearchBlock = async (_search: string) => {
  debouncedSearchBlock(_search);
};

const onFormatAffectedContact = () => {
  debounceFormatAffectedContact();
};

const onFormatAnyoneContact = () => {
  debounceFormatAnyoneContact();
};

const debouncedSearchBlock = debounce(async (value: string) => {
  blockSearch.value = value;
  await getAllBuildingBlocks({
    site: mySite.value,
  });
}, 500);

const debounceFormatAffectedContact = debounce(() => {
  if (primaryPhone_affected.value) {
    affectedInjured.value.contact = formatPhoneNumber(
      prefix_affected.value,
      primaryPhone_affected.value || "",
    );
  } else {
    affectedInjured.value.contact = "";
  }
}, 500);

const debounceFormatAnyoneContact = debounce(() => {
  if (primaryPhone_anyone.value) {
    anyoneDamageToProperty.value.contact = formatPhoneNumber(
      prefix_anyone.value,
      primaryPhone_anyone.value || "",
    );
  } else {
    anyoneDamageToProperty.value.contact = "";
  }
}, 500);

const removeDamage = (index: number) => {
  // console.log(props.incident.affectedEntities.anyoneDamageToProperty);
  props.incident.affectedEntities.anyoneDamageToProperty.splice(index, 1);
};
</script>
