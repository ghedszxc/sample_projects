<template>
  <!-- Back Navigation -->
  <v-form
    v-model="isValid"
    class="w-100 d-flex flex-column ga-7"
    @submit.prevent="submit()"
  >
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">
        Application for renovation/ addition & alteration works
      </p>

      <div class="custom-input-class">
        <v-date-input
          v-model="addItem.date"
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

    <!-- Owner's Particulars -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">Unit owner's particulars</p>

      <v-text-field
        v-model="addItem.nameOfOwner"
        :rules="[requiredInput]"
        label="Name *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.unitNumber"
        :rules="[requiredInput]"
        label="Unit No *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.ownerContactNumber"
        :rules="[requiredInput]"
        label="Contact No *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.ownerOfficeNumber"
        :rules="[requiredInput]"
        label="Office No. *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.ownerMobileNumber"
        label="Mobile No (Optional)"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />
    </section>

    <!-- Contractor's Particulars -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">Contractor's Particulars</p>

      <v-text-field
        v-model="addItem.companyName"
        :rules="[requiredInput]"
        label="Company name *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.registrationNumber"
        :rules="[requiredInput]"
        label="Registration number *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.contractorAddress"
        label="Address"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.contractorPersonInCharge"
        :rules="[requiredInput]"
        label="Person in charge *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.contractorOfficeNumber"
        :rules="[requiredInput]"
        label="Office No. *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.contractorContactNumber"
        label="Mobile (Optional)"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.contractorHomePhone"
        label="Home Phone (Optional)"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />
    </section>

    <!-- Summary of proposed renovation -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 18px">
        Summary of Proposed Renovation / Addition & Alteration Works (Attach
        separate sheet if applicable)
      </p>

      <div class="custom-input-class">
        <v-date-input
          v-model="summaryStartDate"
          :rules="[requiredInput]"
          label="Start date *"
          density="compact"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
        />
      </div>

      <div class="custom-input-class">
        <v-date-input
          v-model="summaryEndDate"
          :rules="[requiredInput]"
          label="End date *"
          density="compact"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
          :min="new Date()"
        />
      </div>
    </section>

    <!-- Hacking Period -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 18px">Hacking Period</p>

      <div class="custom-input-class">
        <v-date-input
          v-model="hackingFromDate"
          :rules="[requiredInput]"
          label="Start date *"
          density="compact"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
        />
      </div>

      <div class="custom-input-class">
        <v-date-input
          v-model="hackingEndDate"
          :rules="[requiredInput]"
          label="End date *"
          density="compact"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
          :min="new Date()"
        />
      </div>
    </section>

    <section>
      <p>
        <span
          v-if="
            configForm &&
            configForm.firstLabel &&
            configForm.firstLabel.trim() !== `<p></p>`.trim()
          "
          v-html="configForm.firstLabel"
        >
        </span>
        <span v-else>
          In applying for approval, the Subsidiary Proprietor (Unit Owner) and
          Contractor undertake to abide by and be subjected to the General Rules
          & Regulations on Renovation / Addition & Alteration Works as contained
          in the House Rules.
        </span>
      </p>
    </section>

    <!-- Checkox -->
    <section class="d-flex ga-10">
      <div style="margin-top: -13px">
        <v-checkbox
          v-model="addItem.isAgree"
          :disabled="isFormView"
          :rules="[requiredInput]"
        />
      </div>
      <p>
        <span
          v-if="
            configForm &&
            configForm.secondLabel &&
            configForm.secondLabel.trim() !== `<p></p>`.trim()
          "
          v-html="configForm.secondLabel"
        >
        </span>
        <span v-else>
          I / We agree to provide my personal information as indicated and
          understand that it is solely to be used by the Management for
          management purposes only. The personal data shall not be used for
          other purposes
        </span>
      </p>
    </section>

    <!-- SIGNATURE -->
    <section class="d-flex flex-column ga-5 pb-15 border-bottom">
      <template v-if="configForm && configForm.isShowFirstSignature">
        <div
          v-if="
            (isFormEdit || isFormView) &&
            addItem.signatureOfSubsidiaryProprietors
          "
        >
          <p
            v-if="isFormEdit"
            class="cursor-pointer mb-2"
            style="text-align: right; color: blue"
            @click="isSignProprietorsEdit = false"
          >
            Edit
          </p>
          <v-img
            :src="addItem.signatureOfSubsidiaryProprietors"
            alt="Signature"
            class="custom-height-md"
          />
        </div>

        <SharedSignature
          v-else
          label="Signature of Subsidiary Proprietors"
          :signatory-email="
            addItem.subsidiaryProprietorsEmail
              ? `Subsidiary Email: (${addItem.subsidiaryProprietorsEmail})`
              : 'Subsidiary Email'
          "
          @on-sign="onSignProprietors($event)"
          @input-email="isSubsidiaryEmail = true"
        />

        <SharedEmailDialog
          v-model="isSubsidiaryEmail"
          label="Subsidiary Email"
          @set-email="subsidiaryEmail"
        />

        <div class="custom-input-class">
          <v-date-input
            v-model="signatureOfSubsidiaryDate"
            label="Signature Date"
            density="compact"
            hide-details
            variant="plain"
            :clearable="!isFormView"
            :disabled="isFormView"
          />
        </div>
      </template>

      <template v-if="configForm && configForm.isShowSecondSignature">
        <div v-if="(isFormEdit || isFormView) && addItem.signatureOfContractor">
          <p
            v-if="isFormEdit"
            class="cursor-pointer mb-2"
            style="text-align: right; color: blue"
            @click="isSignContractorEdit = false"
          >
            Edit
          </p>
          <v-img
            :src="addItem.signatureOfContractor"
            alt="Signature"
            class="custom-height-md"
          />
        </div>

        <SharedSignature
          v-else
          label="Signature of Contractor"
          :signatory-email="
            addItem.contractorEmail
              ? `Contractor Email: (${addItem.contractorEmail})`
              : 'Contractor Email'
          "
          @on-sign="onSignContractor($event)"
          @input-email="isContractorEmail = true"
        />

        <SharedEmailDialog
          v-model="isContractorEmail"
          label="Contractor Email"
          @set-email="contractorEmail"
        />

        <div class="custom-input-class">
          <v-date-input
            v-model="signatureOfContractorDate"
            label="Signature Date"
            density="compact"
            hide-details
            variant="plain"
            :clearable="!isFormView"
            :disabled="isFormView"
          />
        </div>
      </template>
    </section>
    -->

    <section
      v-if="isSignContractorEdit || isContractorEmail || isFormView"
      class="d-flex flex-column ga-5 pb-15 border-bottom"
    >
      <div>
        <v-text-field
          v-model="addItem.subsidiaryProprietorsEmail"
          label="Subsidiary Proprietor's Email"
          class="custom-input-class"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
        />
      </div>
      <div>
        <v-text-field
          v-model="addItem.contractorEmail"
          label="Contractor's Email"
          class="custom-input-class"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
        />
      </div>
    </section>

    <!-- Management -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 20px">For Management Use</p>

      <v-text-field
        v-model="addItem.processedBy"
        label="Processed By"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <div class="custom-input-class" :style="computeInputColor">
        <v-date-input
          v-model="workToBeCompletedDate"
          label="Work to be completed by:"
          density="compact"
          hide-details
          variant="plain"
          disabled
        />
      </div>

      <v-text-field
        v-model="addItem.renovationDeposit"
        label="Renovation deposit of"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.address"
        label="Address *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.personInCharge"
        label="Person in charge"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.officeNumber"
        label="Office No."
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.mobileNumber"
        label="Mobile"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.homePhone"
        label="Home Phone"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <p>
        (Cheque payable to “{{ currentUser.siteName }}” or the MCST Plan No.
        [upon constitution]).
      </p>

      <v-text-field
        v-model="addItem.management"
        label="Management *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.chequeNumber"
        label="By Cheque - Bank / Cheque No *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />
    </section>

    <!-- Note -->
    <section>
      <p style="font-size: 20px">Note:</p>
      <p class="ma-5">
        <span
          v-if="
            configForm &&
            configForm.thirdLabel &&
            configForm.thirdLabel.trim() !== `<p></p>`.trim()
          "
          v-html="configForm.thirdLabel"
        >
        </span>
        <span v-else>
          1. The submission by Subsidiary Proprietor(s) to the Management for
          the “Application for Renovation / Addition & Alteration Works” shall
          not be construed as exemption from compliance with the building
          regulations/laws or exemption from obtaining approval from other
          relevant authorities.
        </span>
      </p>
      <p class="mx-5">
        <span
          v-if="
            configForm &&
            configForm.fourthLabel &&
            configForm.fourthLabel.trim() !== `<p></p>`.trim()
          "
          v-html="configForm.fourthLabel"
        >
        </span>
        <span v-else>
          2. Subsidiary Proprietor(s) shall consult or liaise directly and/or
          obtain necessary approvals from the relevant authorities before
          submitting this application to the Management.
        </span>
      </p>
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

    <section
      v-if="queryAction === 'view' && addItem.status === 'Approved'"
      class="mt-10"
    >
      <p class="text-h5">
        The renovation will only be approved once all three required steps have
        been fulfilled.
      </p>
      <ul class="stepper-custom-class">
        <li class="d-flex align-center">
          <img class="mr-5" width="45" src="/check-rounded-green.svg" />
          <p>Application For Renovation Form</p>
        </li>
        <li class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <p v-if="!addItem.louiId" class="stepper-number mr-5">2</p>
            <img
              v-else
              class="mr-5"
              width="45"
              src="/check-rounded-green.svg"
            />
            <p>Letter of undertaking & indemnity Form</p>
          </div>
          <v-btn
            v-if="addItem.louiId"
            icon="mdi-eye"
            density="comfortable"
            @click="viewForm(addItem, 'view', 'loui')"
          />
        </li>
        <li class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <p v-if="!addItem.refundId" class="stepper-number mr-5">3</p>
            <img
              v-else
              class="mr-5"
              width="45"
              src="/check-rounded-green.svg"
            />
            <p>Refund of deposit Form</p>
          </div>
          <v-btn
            v-if="addItem.refundId"
            icon="mdi-eye"
            density="comfortable"
            @click="viewForm(addItem, 'view', 'renovation-refund')"
          />
        </li>
      </ul>

      <v-btn
        v-if="!addItem.louiId"
        color="#EB261E"
        height="42px"
        class="mt-10 w-100"
        @click="nextStep(addItem, 'stepper')"
      >
        Letter of undertaking & indemnity Form
      </v-btn>
    </section>
  </v-form>
</template>

<script setup lang="ts">
const { item, isValid, isAdding, getItemById } = useRenovation();
const { requiredInput } = useUtils();
const { configForm, getSelectedFormById } = useSiteSettings();
const { currentUser } = useLocalAuth();
const { setSnackbar, theme } = useLocal();
const route = useRoute();

onMounted(async () => {
  addItem.value.management = currentUser.value.siteName; // editable
  addItem.value.date = new Date(); // editable

  // Owner's Particulars
  addItem.value.nameOfOwner = userFullname.value;
  addItem.value.unitNumber = unitNumber.value;
  addItem.value.ownerContactNumber = currentUser.value.primaryPhone;
  addItem.value.processedByName = addItem.value.processedBy;

  // Common fields
  addItem.value.isAgree = true;
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

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (event: "onSubmit", payload: TRenovation, queryAction: string): void;
}>();

const addItem = ref(item.value);
const isFormEdit = ref(false);
const isSignProprietorsEdit = ref(false);
const isSignContractorEdit = ref(false);
const isFormView = ref(false);
const queryAction = ref("");
const isSubsidiaryEmail = ref(false);
const isContractorEmail = ref(false);

const onSignProprietors = (signature: string) => {
  addItem.value.signatureOfSubsidiaryProprietors = signature;
  addItem.value.signatureOfSubsidiaryDate = new Date();
};

const onSignContractor = (signature: string) => {
  addItem.value.signatureOfContractor = signature;
  addItem.value.signatureOfContractorDate = new Date();
};

const userFullname = computed(() => {
  return `${currentUser.value.surname}, ${currentUser.value.givenName}`;
});

const unitNumber = computed(() => {
  const { blockName, levelName, unitName } = currentUser.value;
  return `${blockName} / ${levelName} / ${unitName}`;
});

const summaryStartDate = computed({
  get: () =>
    addItem.value.startDate ? new Date(addItem.value.startDate) : null, // Convert string to Date for v-date-input
  set: (value) => (addItem.value.startDate = value ? value.toISOString() : ""), // Convert Date to string when updated
});

const summaryEndDate = computed({
  get: () => (addItem.value.endDate ? new Date(addItem.value.endDate) : null),
  set: (value) => (addItem.value.endDate = value ? value.toISOString() : ""),
});

const hackingFromDate = computed({
  get: () =>
    addItem.value.hackingPeriodFrom
      ? new Date(addItem.value.hackingPeriodFrom)
      : null,
  set: (value) =>
    (addItem.value.hackingPeriodFrom = value ? value.toISOString() : ""),
});

const hackingEndDate = computed({
  get: () =>
    addItem.value.hackingPeriodTo
      ? new Date(addItem.value.hackingPeriodTo)
      : null,
  set: (value) =>
    (addItem.value.hackingPeriodTo = value ? value.toISOString() : ""),
});

const signatureOfSubsidiaryDate = computed({
  get: () =>
    addItem.value.signatureOfSubsidiaryDate
      ? new Date(addItem.value.signatureOfSubsidiaryDate)
      : null,
  set: (value) =>
    (addItem.value.signatureOfSubsidiaryDate = value
      ? value.toISOString()
      : ""),
});

const signatureOfContractorDate = computed({
  get: () =>
    addItem.value.signatureOfContractorDate
      ? new Date(addItem.value.signatureOfContractorDate)
      : null,
  set: (value) =>
    (addItem.value.signatureOfContractorDate = value
      ? value.toISOString()
      : ""),
});

const workToBeCompletedDate = computed({
  get: () => addItem.value.workToBeCompletedDate!,
  set: (value) =>
    (addItem.value.workToBeCompletedDate = value
      ? (value as Date).toISOString()
      : ""),
});

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
          isSignProprietorsEdit.value = true;
          isSignContractorEdit.value = true;
          addItem.value.status = "Pending";
        } else if (queryAction.value === "view") {
          isFormView.value = true;
        } else {
          console.log("No Query Action");
        }
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

const subsidiaryEmail = (email: string, action: string) => {
  action === "set"
    ? (addItem.value.subsidiaryProprietorsEmail = email)
    : (addItem.value.subsidiaryProprietorsEmail = "");
};

const contractorEmail = (email: string, action: string) => {
  action === "set"
    ? (addItem.value.contractorEmail = email)
    : (addItem.value.contractorEmail = "");
};

const nextStep = (addItem: TRenovation, action: string) => {
  const { _id: id } = addItem;
  useRouter().push({
    path: "/online-forms/loui-form",
    query: { id, action },
  });
};

const viewForm = (addItem: TRenovation, action: string, formType: string) => {
  let id: string = "";

  formType === "loui"
    ? (id = addItem.louiId as string)
    : (id = addItem.refundId as string);

  useRouter().push({
    path: `/online-forms/${formType}-form`,
    query: { id, action },
  });
};

const computeInputColor = computed(() => {
  return theme.value === "dark"
    ? { background: "#343a45" }
    : { background: "#EBEBE4" };
});
</script>

<style scoped>
.custom-input-class {
  border: 1px solid #343a45;
  padding: 12px 12px 17px 12px;
  border-radius: 4px;
}

.border-bottom {
  border-bottom: 1px solid #b9b8c033;
  padding-bottom: 25px;
}

.disabled-input {
  background: #343a45;
}
.stepper-custom-class {
  margin-top: 20px;
  list-style: none;
  border: 1px solid #b9b8c0;
}
.stepper-custom-class li {
  padding: 20px;
}
.stepper-custom-class li:not(:last-child) {
  border-bottom: 1px solid #b9b8c0;
}
.stepper-number {
  background: #555e6f;
  width: fit-content;
  padding: 4px 11px;
  border-radius: 100%;
  margin-left: 7px;
}
</style>
