<template>
  <v-row no-gutters class="px-6">
    <v-col cols="12" class="header mt-6">
      <v-icon
        start
        size="x-large"
        style="position: relative; right: 10px"
        @click="goBack"
      >
        <v-img
          class="pl-0 ml-0 mt-1"
          src="/dark-mode/utility-all/right-arrow.svg"
          cover
        ></v-img>
      </v-icon>
      <span
        style="position: relative; right: 15px; bottom: 1px"
        :class="textBackColor"
      >
        Site and Residency</span
      >
    </v-col>
    <v-col cols="12" class="mt-6">
      <v-row
        no-gutters
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-img
          src="/dark-mode/create-account/icons/site-residency.svg"
          style="width: 190px; height: 190px"
        ></v-img>
      </v-row>
    </v-col>

    <!-- title-->
    <v-col cols="12">
      <v-row no-gutters>
        <span class="title font-weight-bold mt-1" :class="textColor"
          >Site and Residency
        </span>
        <v-spacer></v-spacer>
        <v-chip variant="flat" class="pa-4" color="#EB261E">
          Step
          <span class="ml-1"> 2 </span>
          /5
        </v-chip>
      </v-row>
    </v-col>

    <!-- Note for required fields -->
    <v-col cols="12" class="text-right mt-2">
      <span class="text-body-2" :class="textColor">
        <span style="color: red">*</span> are required fields
      </span>
    </v-col>

    <v-col cols="12" class="mt-4">
      <!-- Select Site -->
      <add-site-modal @addBlocks="getBlocks" />

      <!-- Block -->
      <add-block-modal :childBlock="block" @addLevels="getLevels" />

      <!-- Level -->
      <v-row>
        <v-col cols="6">
          <add-level-modal :childLevel="level" @addUnits="getUnits"
        /></v-col>

        <!-- Unit -->
        <v-col cols="6"> <add-unit-modal :childUnit="unit" /></v-col>
      </v-row>

      <!-- House/Unit Owner  -->
      <template v-for="(item, index) in residentType" :key="item">
        <v-text-field
          :base-color="baseColor"
          :bg-color="bgColor"
          class="mb-6"
          v-model="residentType[index]"
          required
          density="default"
          filled
          variant="outlined"
          readonly
          @click="toggleUnitOwner(item)"
          :append-inner-icon="
            resident.residentType === item
              ? 'mdi-check-circle'
              : 'mdi-check-circle-outline'
          "
          :class="{ 'text-green': resident.residentType === item }"
          hide-details
        ></v-text-field>
      </template>
      <!-- Resident/Tenant -->
      <!-- <v-text-field
            v-model="resident.residentType"
            model-value="Resident/Tenant"
            required
            density="default"
            filled
            variant="outlined"
            readonly
            @click="toggleResident"
            :append-inner-icon="
              unitOwnerClicked ? 'mdi-check-circle' : 'mdi-check-circle-outline'
            "
            :class="{ 'text-blue': residentClicked }"
            hide-details=""
          ></v-text-field> -->
    </v-col>

    <!-- back and next -->
    <v-col cols="12" class="mt-6">
      <v-row no-gutters>
        <v-col cols="6" class="pr-2">
          <v-btn
            block
            flat
            color="#E0241C"
            @click="goBack"
            class="button"
            style="border: 1px solid var(--black-02, rgba(0, 0, 0, 0.2))"
            rounded="lg"
          >
            Back
          </v-btn>
        </v-col>
        <v-col cols="6" class="pl-2">
          <v-btn
            block
            color="#E0241C"
            flat
            class="button"
            @click="validate"
            rounded="lg"
          >
            Next
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "only-footer",
  pageTitle: " Site and Residency",
  pageRedirect: "create-account-info",
});
const { resident } = useResident();
const { theme } = useLocal();
import { ref } from "vue";
import AddSiteModal from "~/components/event/add-site.vue";
import AddBlockModal from "~/components/event/add-block.vue";
import AddLevelModal from "~/components/event/add-level.vue";
import AddUnitModal from "~/components/event/add-unit.vue";
const { getBlocksByPageSearch } = useBlock();
const { getBlockLevelsByPageSearch } = useBlockLevel();
const { getUnitsByPageSearch } = useBlockLevelUnit();
const block = ref("");
const level = ref("");
const unit = ref("");

const residentType = ref(["House/Unit Owner", "House/Unit Tenant"]);
const unitOwnerClicked = ref<boolean | string>(false);
// const residentClicked = ref(false);

const { setSnackbar } = useLocal();

const toggleUnitOwner = (item: string) => {
  unitOwnerClicked.value = item;
  resident.value.residentType = item;
};

const getBlocks = (data: string) => {
  block.value = data;
};
const getLevels = (data: string) => {
  level.value = data;
};
const getUnits = (data: string) => {
  unit.value = data;
};
function validate() {
  const {
    givenName,
    surname,
    email,
    prefix,
    primaryPhone,
    nric,
    // passport,
    dateOfBirth,
    vehicleModel,
    vehicleNo,
    vehicleColor,
    password,
  } = resident.value;
  if (
    !(
      givenName &&
      surname &&
      email &&
      prefix &&
      primaryPhone &&
      nric &&
      //passport &&
      dateOfBirth &&
      password
    ) ||
    (vehicleModel && !vehicleNo && !vehicleColor)
  ) {
    useRouter().push({ name: "create-account-info" });
  }
  const { site, block, level, unitNumber, residentType } = resident.value;
  if (site._id && block._id && level._id && unitNumber._id && residentType) {
    localStorage.setItem("resident", JSON.stringify(resident.value));
    useRouter().push({ name: "create-account-profile-capture" });
  } else {
    setSnackbar({
      text: "Please fill out all required fields.",
      modal: true,
      type: "error",
    });
  }
}
function goBack() {
  if (
    resident.value.vehicleModel &&
    resident.value.vehicleNo &&
    resident.value.vehicleColor
  ) {
    useRouter().push({ name: "create-account-car-registration" });
  } else {
    useRouter().push({ name: "create-account-info" });
  }
}
onMounted(async () => {
  if (!theme.value) theme.value = "light";
  const values = localStorage.getItem("resident");

  if (values) {
    resident.value = JSON.parse(values);

    if (resident.value.status === "resubmit") {
      block.value = await getBlocksByPageSearch({
        site: resident.value.site._id,
      });

      level.value = await getBlockLevelsByPageSearch({
        block: resident.value.block._id,
      });

      unit.value = await getUnitsByPageSearch({
        level: resident.value.level._id,
        block: resident.value.block._id,
      });
    }

    if (!resident.value.residentType) {
      resident.value.residentType = "House/Unit Owner";
    }
  } else {
    useRouter().push({ name: "create-account-info" });
  }
});

const textBackColor = computed(() =>
  theme.value === "dark" ? "text-back-dark" : "text-back",
);

const textColor = computed(() =>
  theme.value === "dark" ? "title-dark" : "title",
);

const baseColor = computed(() =>
  theme.value === "dark" ? "#FAFAFAFA" : "#111723",
);

const bgColor = computed(() =>
  theme.value === "dark" ? "#111723" : "#FAFAFAFA",
);
</script>

<style scoped>
.header {
  font-size: 16px;
  line-height: 24px;
  color: #052439;
}
.title {
  font-size: 20px;
  line-height: 32px;
  color: #052439;
}
.title-dark {
  font-size: 20px;
  line-height: 32px;
  color: #fcfcfc;
}

.button {
  width: 178px;
  height: 48px;
}

.text-back {
  color: #052439;
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
}
.text-back-dark {
  color: #fcfcfc;
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
}
</style>
