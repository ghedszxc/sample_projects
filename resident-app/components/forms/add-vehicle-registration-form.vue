<template>
  <!-- Back Navigation -->
  <v-form
    v-model="isValid"
    class="w-100 d-flex flex-column ga-7"
    @submit.prevent="submit()"
  >
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">Vehicle Registration Form</p>

      <div class="custom-input-class">
        <v-date-input
          v-model="computedDate"
          :rules="[requiredInput]"
          label="Date *"
          density="compact"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
        />
      </div>

      <v-text-field
        v-model="addItem.management"
        :rules="[requiredInput]"
        label="To: The Management *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />
    </section>

    <!-- OWNER INFO -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <v-text-field
        v-model="addItem.unitOwner"
        :rules="[requiredInput]"
        label="Name of Unit Owner *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.ownerNRIC"
        :rules="[requiredInput]"
        label="NRIC: *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.ownerContactNumber"
        :rules="[requiredInput]"
        label="Contact No. (HP) *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.unitNumber"
        :rules="[requiredInput]"
        label="Unit No. # *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.carOwner"
        label="Vehicle Owner Name"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.carPlateNumber"
        label="Vehicle Plate No."
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.model"
        label="Vehicle Model"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.colour"
        label="Vehicle Color"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />
    </section>

    <!-- AGREE CHECKBOXES -->
    <section class="d-flex flex-column border-bottom">
      <section
        v-if="
          configForm &&
          configForm.firstLabel &&
          configForm.firstLabel.trim() !== `<p></p>`.trim()
        "
        class="d-flex ga-10"
      >
        <div style="margin-top: -13px">
          <v-checkbox
            v-model="addItem.isAgreeToAbideRules"
            :rules="[requiredInput]"
            :clearable="!isFormView"
            :disabled="isFormView"
          />
        </div>
        <div v-html="configForm.firstLabel"></div>
      </section>
      <template v-else>
        <v-row justify="center" align="start">
          <v-col class="pt-0">
            <v-checkbox
              v-model="addItem.isAgreeToAbideRules"
              :clearable="!isFormView"
              :disabled="isFormView"
            />
          </v-col>
          <v-col class="pl-0" cols="10">
            <p class="text-justify">
              I/We agree to abide by the rules and regulations as stipulated in
              {{ currentUser.siteName }} handbook at all times.
            </p>
          </v-col>
        </v-row>

        <v-row justify="center" align="start">
          <v-col class="pt-0">
            <v-checkbox
              v-model="addItem.isAgreeToUnderstandVehicleRisk"
              :clearable="!isFormView"
              :disabled="isFormView"
            />
          </v-col>
          <v-col class="pl-0" cols="10">
            <p class="text-justify">
              I/We also understand that all vehicles are parked entirely at the
              owner’s risk. All persons and vehicles within the car park enter
              entirely at the risk of such person and/or the motorist. Persons
              entering the car park shall be responsible for any damage or loss
              to the car(s) parked or the car park equipment caused by such
              persons.
            </p>
          </v-col>
        </v-row>

        <v-row justify="center" align="start">
          <v-col class="pt-0">
            <v-checkbox
              v-model="addItem.isAgreeToParkProperly"
              :clearable="!isFormView"
              :disabled="isFormView"
            />
          </v-col>
          <v-col class="pl-0" cols="10">
            <p class="text-justify">
              I/We acknowledge that the vehicle shall be parked properly without
              causing any inconvenience to other users.
            </p>
          </v-col>
        </v-row>

        <v-row justify="center" align="start">
          <v-col class="pt-0">
            <v-checkbox
              v-model="addItem.isAgreeToBallotingCar"
              :clearable="!isFormView"
              :disabled="isFormView"
            />
          </v-col>
          <v-col class="pl-0" cols="10">
            <p class="text-justify">
              I/We acknowledge that I/we fully understand the balloting of car
              park lots when required.
            </p>
          </v-col>
        </v-row>

        <v-row justify="center" align="start">
          <v-col class="pt-0">
            <v-checkbox
              v-model="addItem.isAgreeToSubsCarApplication"
              :clearable="!isFormView"
              :disabled="isFormView"
            />
          </v-col>
          <v-col class="pl-0" cols="10">
            <p class="text-justify">
              I/We acknowledge that for 2 nd and subsequent car application will
              not be entertained. The Management reserved the right to terminate
              the approval of vehicle application at any point in time.
            </p>
          </v-col>
        </v-row>
      </template>
    </section>

    <!-- ACKNOWLEDGEMENT -->
    <!-- SIGNATURE -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 20px">Acknowledge By:</p>

      <template v-if="configForm && configForm.isShowFirstSignature">
        <div v-if="(isFormEdit || isFormView) && addItem.recipientSignature">
          <p
            v-if="isFormEdit"
            class="cursor-pointer mb-2"
            style="text-align: right; color: blue"
            @click="isFormEdit = false"
          >
            Edit
          </p>
          <v-img
            :src="addItem.recipientSignature"
            alt="Signature"
            class="custom-height-md"
          />
        </div>

        <SharedSignature
          v-else
          label="Signature"
          :signatory-email="
            addItem.recipientEmail
              ? `Email: (${addItem.recipientEmail})`
              : 'Email'
          "
          @on-sign="onSign($event)"
          @input-email="isRecipientEmail = true"
        />

        <SharedEmailDialog
          v-model="isRecipientEmail"
          label="Email"
          @set-email="recipientEmail"
        />

        <div class="custom-input-class">
          <v-date-input
            v-model="addItem.recipientSignedDate"
            label="Signature Date"
            density="compact"
            hide-details
            variant="plain"
            :clearable="!isFormView"
            :disabled="isFormView"
          />
        </div>
      </template>

      <div class="d-flex ga-2">
        <v-text-field
          v-model="addItem.unitOwner"
          :rules="[requiredInput]"
          label="Name of Unit Owner *"
          class="custom-input-class"
          :style="computeInputColor"
          hide-details
          variant="plain"
          disabled
        />

        <v-text-field
          v-model="addItem.unitNumber"
          :rules="[requiredInput]"
          label="Unit No. #"
          class="custom-input-class"
          :style="computeInputColor"
          hide-details
          variant="plain"
          disabled
        />
      </div>
    </section>

    <v-btn
      v-if="!/^(approved|cancelled)$/i.test(addItem.status || '')"
      color="#EB261E"
      type="submit"
      class="mb-5"
      height="42px"
      :disabled="!isValid"
      :loading="isAdding"
    >
      {{ isFormView ? "Cancel Submission" : "Submit" }}
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
const { item, isValid, isAdding, getItemById } = useVehicle();
const { currentUser } = useLocalAuth();
const { requiredInput } = useUtils();
const route = useRoute();
const { configForm, getSelectedFormById } = useSiteSettings();
const { setSnackbar, theme } = useLocal();
const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (event: "onSubmit", payload: TVehicleRecord, queryAction: string): void;
}>();

const addItem = ref(item.value);
const isFormEdit = ref(false);
const isFormView = ref(false);
const queryAction = ref("");
const isRecipientEmail = ref(false);

const userFullname = computed(() => {
  return `${currentUser.value.surname}, ${currentUser.value.givenName}`;
});

const unitNumber = computed(() => {
  const { blockName, levelName, unitName } = currentUser.value;
  return `${blockName} / ${levelName} / ${unitName}`;
});

const computedDate = computed({
  get: () => (addItem.value.date ? new Date(addItem.value.date) : null), // Convert string to Date for v-date-input
  set: (value) => (addItem.value.date = value ? value.toISOString() : ""), // Convert Date to string when updated
});

onMounted(async () => {
  addItem.value.management = currentUser.value.siteName; // editable
  addItem.value.date = new Date(); // editable

  // Owner's Particulars
  addItem.value.unitOwner = userFullname.value;
  addItem.value.ownerNRIC = currentUser.value.nric;
  addItem.value.unitNumber = unitNumber.value;
  addItem.value.ownerContactNumber = currentUser.value.primaryPhone;
  addItem.value.isAgreeToAbideRules = true;
  addItem.value.isAgreeToUnderstandVehicleRisk = true;
  addItem.value.isAgreeToParkProperly = true;
  addItem.value.isAgreeToBallotingCar = true;
  addItem.value.isAgreeToSubsCarApplication = true;
  // Vehicle
  addItem.value.carOwner = userFullname.value;
  addItem.value.carPlateNumber = currentUser.value.vehicleNo;
  addItem.value.model = currentUser.value.vehicleModel;
  addItem.value.colour = currentUser.value.vehicleColor;
  // Common fields
  addItem.value.siteName = currentUser.value.siteName;
  addItem.value.site = currentUser.value.site;

  queryAction.value = (route.query.action ?? "") as string;
  try {
    await checkForQuery();
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  }
});

const onSign = (signature: string) => {
  addItem.value.recipientSignature = signature;
  addItem.value.recipientSignedDate = new Date();
};

const recipientEmail = (email: string, action: string) => {
  action === "set"
    ? (addItem.value.recipientEmail = email)
    : (addItem.value.recipientEmail = "");
};

const submit = () => {
  addItem.value.createdBy = currentUser.value._id;
  addItem.value.createdByName = userFullname.value;
  emit("onSubmit", addItem.value, queryAction.value);
};

const checkForQuery = async () => {
  try {
    const id = route.query.id ? String(route.query.id) : "";
    const action = route.query.action ? String(route.query.action) : "";
    if (action === "add") {
      await getSelectedFormById(id);
    } else {
      if (id) {
        const idString = id.toString();
        addItem.value = (await getItemById(idString)) || item.value;
        if (queryAction.value === "edit") {
          isFormEdit.value = true;
          addItem.value.status = "Pending";
        } else if (queryAction.value === "view") {
          isFormView.value = true;
        } else {
          console.log("No Query Action");
        }
      } else {
        console.log("No 'id' query parameter found.");
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  }
};
//COMPUTED
const computeInputColor = computed(() => {
  return theme.value === "dark"
    ? { background: "#343a45" }
    : { background: "#EBEBE4" };
});
</script>

<style>
.custom-input-class {
  border: 1px solid #343a45;
  padding: 12px 12px 17px 12px;
  border-radius: 4px;
}

.border-bottom {
  border-bottom: 1px solid #b9b8c033;
  padding-bottom: 25px;
}
</style>
