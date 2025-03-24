<template>
  <!-- Back Navigation -->
  <v-form
    v-model="isValid"
    class="w-100 d-flex flex-column ga-10"
    @submit.prevent="submit()"
  >
    <!-- STEPPER -->
    <section v-if="!route.query.id" class="mt-10">
      <p class="text-h5">
        The renovation will only be approved once all three required steps have
        been fulfilled.
      </p>
      <ul class="stepper-custom-class stepper-attachment">
        <li class="d-flex align-center" :style="stepperComputedStyle">
          <img class="mr-5" width="45" src="/check-rounded-green.svg" />
          <p class="d-flex align-center">
            Application For Renovation Form
            <v-btn
              icon="mdi-paperclip"
              class="ml-10"
              @click="loadRenovation()"
            />
          </p>
        </li>
        <li class="stepper-dropDown" v-if="renovationItems.length">
          <v-radio-group v-model="selectedRenovation">
            <v-radio
              v-for="item in renovationItems"
              :key="item?._id ? item._id : ''"
              :label="
                item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : 'No Date Available'
              "
              :value="item._id"
              color="green"
            />
          </v-radio-group>
        </li>

        <li class="d-flex align-center" :style="stepperComputedStyle">
          <img class="mr-5" width="45" src="/check-rounded-green.svg" />
          <p class="d-flex align-center">
            Letter of undertaking & indemnity Form
            <v-btn icon="mdi-paperclip" @click="loadLOUI()" class="ml-10" />
          </p>
        </li>
        <li class="stepper-dropDown" v-if="louiItems.length">
          <v-radio-group v-model="selectedLOUI">
            <v-radio
              v-for="item in louiItems"
              :key="item._id"
              :label="
                item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : 'No Date Available'
              "
              :value="item._id"
              color="green"
            />
          </v-radio-group>
        </li>
        <li class="d-flex align-center" :style="stepperComputedStyle">
          <div class="mr-5">
            <p class="stepper-number">3</p>
          </div>
          <p>Refund of deposit Form</p>
        </li>
      </ul>
    </section>

    <!-- Header -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">Refund of deposit</p>

      <v-text-field
        v-model="addItem.unitNumber"
        :rules="[requiredInput]"
        label="Request for refund of renovation deposit
                In respect of renovation / addition & alteration works at unit no *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />
    </section>

    <!-- Body -->
    <section class="d-flex flex-column ga-5">
      <div>
        <p style="margin-bottom: -10px; font-size: 20px">Dear Sir/Madam</p>
        <br />
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
          We wish to inform you that we have completed the works that are
          reflected in the Application for Renovation / A&A works and there is
          no violation of the stated guidelines as contained herewith.
        </span>
      </div>

      <div class="custom-input-class">
        <v-date-input
          v-model="dateOfCompletion"
          :rules="[requiredInput]"
          label="Date of completion of Renovation / A & A works *"
          density="compact"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
        />
      </div>

      <div class="custom-input-class">
        <v-date-input
          v-model="dateOfJointInspection"
          :rules="[requiredInput]"
          label="Date of joint inspection *"
          density="compact"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
        />
      </div>

      <v-textarea
        v-model="addItem.remarks"
        :rules="[requiredInput]"
        label="Remarks *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />
    </section>

    <!-- Checkox -->
    <section class="d-flex ga-10">
      <div style="margin-top: -13px">
        <v-checkbox
          v-model="addItem.isAgree"
          :rules="[requiredInput]"
          :clearable="!isFormView"
          :disabled="isFormView"
        />
      </div>
      <p>
        I / We agree to provide my personal information as indicated and
        understand that it is solely to be used by the Management for management
        purposes only. The personal data shall not be used for other purposes.
      </p>
    </section>

    <!-- Submitted By -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 20px">Submitted By</p>

      <v-text-field
        v-model="addItem.submittedByApplicant"
        label="Name of Applicant (Subsidiary Proprietor)"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <!-- SIGNATURE -->
      <template v-if="configForm && configForm.isShowFirstSignature">
        <div v-if="(isFormEdit || isFormView) && addItem.signedByApplicant">
          <p
            v-if="isFormEdit"
            class="cursor-pointer mb-2"
            style="text-align: right; color: blue"
            @click="isSignByApplicantEdit = false"
          >
            Edit
          </p>
          <v-img
            :src="addItem.signedByApplicant"
            alt="Signature"
            class="custom-height-md"
          />
        </div>

        <SharedSignature
          v-else
          label="Application Signature"
          :signatory-email="
            addItem.applicantEmail
              ? `Applicant Email: (${addItem.applicantEmail})`
              : 'Applicant Email'
          "
          @on-sign="onSignByApplicant($event)"
          @input-email="isApplicantEmail = true"
        />

        <SharedEmailDialog
          v-model="isApplicantEmail"
          label="Applicant Email"
          @set-email="applicantEmail"
        />

        <div class="custom-input-class">
          <v-date-input
            v-model="dateOfRefund"
            label="Date of refund *"
            density="compact"
            hide-details
            variant="plain"
            :clearable="!isFormView"
            :disabled="isFormView"
          />
        </div>
      </template>
    </section>

    <!-- Certified By -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 20px">Certified By</p>

      <v-text-field
        v-model="addItem.certifiedByStaff"
        label="Name of MA Staff"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <!-- SIGNATURE -->
      <template v-if="configForm && configForm.isShowSecondSignature">
        <div v-if="(isFormEdit || isFormView) && isSignByStaffEdit">
          <p
            v-if="isFormEdit"
            class="cursor-pointer mb-2"
            style="text-align: right; color: blue"
            @click="isSignByStaffEdit = false"
          >
            Edit
          </p>
          <v-img
            :src="addItem.signedByStaff"
            alt="Signature"
            class="custom-height-md"
          />
        </div>

        <SharedSignature
          v-else
          label="Signature"
          :is-disabled="true"
          @on-sign="onSignByStaff($event)"
        />

        <v-text-field
          v-model="addItem.chequeNumber"
          label="Cheque No:"
          class="custom-input-class"
          :style="computeInputColor"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
        />
      </template>
    </section>

    <!-- Received By -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 20px">Received By</p>

      <v-text-field
        v-model="addItem.receivedBy"
        label="Name"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <!-- SIGNATURE -->
      <template v-if="configForm && configForm.isShowThirdSignature">
        <div v-if="(isFormEdit || isFormView) && addItem.signedByReceiver">
          <p
            v-if="isFormEdit"
            class="cursor-pointer mb-2"
            style="text-align: right; color: blue"
            @click="isSignByReceiverEdit = false"
          >
            Edit
          </p>
          <v-img
            :src="addItem.signedByReceiver"
            alt="Signature"
            class="custom-height-md"
          />
        </div>

        <SharedSignature
          v-else
          label="Receiver Signature"
          :signatory-email="
            addItem.receiverEmail
              ? `Receiver Email: (${addItem.receiverEmail})`
              : 'Receiver Email'
          "
          @on-sign="onSignByReceiver($event)"
          @input-email="isReceiverEmail = true"
        />

        <SharedEmailDialog
          v-model="isReceiverEmail"
          label="Receiver Email"
          @set-email="receiverEmail"
        />

        <div class="custom-input-class">
          <v-date-input
            v-model="signatureDate"
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
        <li class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <img class="mr-5" width="45" src="/check-rounded-green.svg" />
            <p>Application For Renovation Form</p>
          </div>
          <v-btn
            icon="mdi-eye"
            density="comfortable"
            @click="viewForm(addItem, 'view', 'renovation')"
          />
        </li>
        <li class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <img class="mr-5" width="45" src="/check-rounded-green.svg" />
            <p>Letter of undertaking & indemnity Form</p>
          </div>
          <v-btn
            icon="mdi-eye"
            density="comfortable"
            @click="viewForm(addItem, 'view', 'loui')"
          />
        </li>
        <li class="d-flex align-center">
          <img class="mr-5" width="45" src="/check-rounded-green.svg" />
          <p>Refund of deposit Form</p>
        </li>
      </ul>
    </section>
  </v-form>
</template>

<script setup lang="ts">
const { requiredInput } = useUtils();
const { currentUser } = useLocalAuth();
const { item, isValid, isAdding, getItemById } = useRenovationRefund();
const { items, setItems } = useForms();
const { configForm, getSelectedFormById } = useSiteSettings();
const { setSnackbar, theme } = useLocal();
const route = useRoute();

onMounted(async () => {
  addItem.value.unitNumber = unitNumber.value;

  // checkbox
  addItem.value.isAgree = true;

  // common fields
  addItem.value.siteName = currentUser.value.siteName;
  addItem.value.site = currentUser.value.site;
  addItem.value.createdBy = currentUser.value._id;

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
  (event: "onSubmit", payload: TRenovationRefund, isEdit: boolean): void;
}>();

const addItem = ref(item.value);
const isFormEdit = ref(false);
const isFormView = ref(false);
const isSignByApplicantEdit = ref(false);
const isSignByStaffEdit = ref(false);
const isSignByReceiverEdit = ref(false);
const isReceiverEmail = ref(false);
const isApplicantEmail = ref(false);
const queryAction = ref("");
const selectedRenovation = ref("");
const renovationItems = ref<TForms[]>([]);
const selectedLOUI = ref("");
const louiItems = ref<TForms[]>([]);

const onSignByApplicant = (signature: string) => {
  addItem.value.signedByApplicant = signature;
};

const onSignByStaff = (signature: string) => {
  addItem.value.signedByStaff = signature;
};

const onSignByReceiver = (signature: string) => {
  addItem.value.signedByReceiver = signature;
  addItem.value.signatureDate = new Date();
};

const submit = async () => {
  addItem.value.createdByName = userFullname.value;
  addItem.value.louiId = route.query.id
    ? route.query.id?.toLocaleString()
    : selectedLOUI.value;

  const id = route.query.id?.toString();
  if (!selectedRenovation.value && id) {
    const getLOUI = await getItemById(id);
    addItem.value.renovationId = getLOUI?.renovationId as string;
  } else {
    addItem.value.renovationId = selectedRenovation.value;
  }

  emit("onSubmit", addItem.value, isFormEdit.value);
};

const checkForQuery = async () => {
  try {
    const id = route.query.id ? String(route.query.id) : "";
    const action = route.query.action ? String(route.query.action) : "";
    if (action === "add") {
      await getSelectedFormById(id);
    } else {
      if (id && queryAction.value !== "stepper") {
        const idString = id.toString();
        addItem.value = (await getItemById(idString)) || item.value;

        if (queryAction.value === "edit") {
          isFormEdit.value = true;
          isSignByApplicantEdit.value = true;
          isSignByReceiverEdit.value = true;
          isSignByStaffEdit.value = true;
          addItem.value.status = "Pending";
        } else if (queryAction.value === "view") {
          isFormView.value = true;
        } else {
          console.log("No Query Action");
        }
      } else {
        console.log("No 'id' query parameter found, or it is a stepper");
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

const receiverEmail = (email: string, action: string) => {
  action === "set"
    ? (addItem.value.receiverEmail = email)
    : (addItem.value.receiverEmail = "");
};

const loadRenovation = async () => {
  try {
    await setItems({
      searchParam: "Application for Renovation/Addition & Alteration Works",
      pageParam: 1,
      limitParam: 100,
      filterStatus: "Approved",
      site: currentUser.value.site,
      createdBy: currentUser.value._id,
    });

    renovationItems.value = items.value;
  } catch (error) {
    console.error("Failed to load", error);
  }
};

const loadLOUI = async () => {
  try {
    await setItems({
      searchParam: "Letter of Undertaking & Indemnity",
      pageParam: 1,
      limitParam: 5,
      filterStatus: "Approved",
      site: currentUser.value.site,
      createdBy: currentUser.value._id,
    });

    louiItems.value = items.value;
  } catch (error) {
    console.error("Failed to load", error);
  }
};

const applicantEmail = (email: string, action: string) => {
  action === "set"
    ? (addItem.value.applicantEmail = email)
    : (addItem.value.applicantEmail = "");
};

const viewForm = (
  addItem: TRenovationRefund,
  action: string,
  formType: string,
) => {
  let id: string = "";

  formType === "renovation"
    ? (id = addItem.renovationId as string)
    : (id = addItem.louiId as string);

  useRouter().push({
    path: `/online-forms/${formType}-form`,
    query: { id, action },
  });
};

//Computed

const unitNumber = computed(() => {
  const { blockName, levelName, unitName } = currentUser.value;
  return `${blockName} / ${levelName} / ${unitName}`;
});

const userFullname = computed(() => {
  return `${currentUser.value.surname}, ${currentUser.value.givenName}`;
});

const dateOfCompletion = computed({
  get: () =>
    addItem.value.dateOfCompletion
      ? new Date(addItem.value.dateOfCompletion)
      : null,
  set: (value) =>
    (addItem.value.dateOfCompletion = value ? value.toISOString() : ""),
});

const dateOfJointInspection = computed({
  get: () =>
    addItem.value.dateOfJointInspection
      ? new Date(addItem.value.dateOfJointInspection)
      : null,
  set: (value) =>
    (addItem.value.dateOfJointInspection = value ? value.toISOString() : ""),
});

const dateOfRefund = computed({
  get: () =>
    addItem.value.dateOfRefund ? new Date(addItem.value.dateOfRefund) : null,
  set: (value) =>
    (addItem.value.dateOfRefund = value ? value.toISOString() : ""),
});

const signatureDate = computed({
  get: () =>
    addItem.value.signatureDate ? new Date(addItem.value.signatureDate) : null,
  set: (value) =>
    (addItem.value.signatureDate = value ? value.toISOString() : ""),
});

const computeInputColor = computed(() => {
  return theme.value === "dark"
    ? { background: "#343a45" }
    : { background: "#EBEBE4" };
});

const stepperComputedStyle = computed(() => {
  return theme.value === "dark"
    ? { background: "#111723" }
    : { background: "#EBEBE4" };
});
</script>

<style>
.custom-input-class {
  border: 1px solid #343a45;
  padding: 12px 12px 17px 12px;
  border-radius: 4px;
}

.disabled-input {
  background: #343a45;
}

.stepper-custom-class {
  margin-top: 20px;
  list-style: none;
  border: 1px solid #b9b8c0;
}
.stepper-attachment {
  border: none !important;
}
.stepper-custom-class li {
  padding: 20px;
}
.stepper-custom-class li:not(:last-child) {
  border-bottom: 1px solid #b9b8c0;
}
.stepper-attachment li:not(:last-child) {
  margin-bottom: 5px;
  border-bottom: none !important;
}
.stepper-number {
  background: #555e6f;
  width: fit-content;
  padding: 4px 11px;
  border-radius: 100%;
  margin-left: 7px;
}
</style>
