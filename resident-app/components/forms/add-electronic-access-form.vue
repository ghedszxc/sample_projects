<template>
  <!-- Back Navigation -->
  <v-form
    v-model="isValid"
    class="w-100 d-flex flex-column ga-7"
    @submit.prevent="submit()"
  >
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">Application for electronic access card</p>

      <div class="custom-input-class">
        <v-date-input
          v-model="managementDate"
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

    <!-- OWNER -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">To be completed by unit owner</p>

      <v-text-field
        v-model="addItem.nameOfOwner"
        :rules="[requiredInput]"
        label="I / We *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.unitNumber"
        :rules="[requiredInput]"
        label="Being the owner of unit *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <p>
        of {{ currentUser.siteName }} hereby submit my / our application for
        number/s of
      </p>

      <v-text-field
        v-model="addItem.accessCardNumber"
        :rules="[requiredInput]"
        label="Access Card *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.ownerNricNumber"
        :rules="[requiredInput]"
        label="Owner's NRIC No. *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.ownerHomePhone"
        :rules="[requiredInput]"
        label="Owner's Home Phone *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.ownerR"
        :rules="[requiredInput]"
        label="Owner's (R): *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />
    </section>

    <!-- NOMINEE -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">To be completed for nominee (if applicable)</p>

      <v-text-field
        v-model="addItem.nominatorName"
        :rules="[requiredInput]"
        label="I / We *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.nominatorUnitNumber"
        :rules="[requiredInput]"
        label="Being the owner of unit *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <p>
        of {{ currentUser.siteName }} hereby nominate my immediate family /
        tenant whose name is given below for the application for (Access Card
        Type) number/s of Access Card
      </p>

      <v-text-field
        v-model="addItem.tenantAccessCardNumber"
        :rules="[requiredInput]"
        label="Access Card *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />
    </section>

    <!-- NOMINEE IS TENANT -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">If the Nominee is a Tenant, please state:</p>

      <v-text-field
        v-model="addItem.nameOfTenant"
        :rules="[requiredInput]"
        label="Name of Tenant *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <div class="custom-input-class">
        <v-date-input
          v-model="tenancyCommencement"
          :rules="[requiredInput]"
          label="Commencement of Tenancy : *"
          density="compact"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
        />
      </div>

      <div class="custom-input-class">
        <v-date-input
          v-model="tenancyExpiry"
          :rules="[requiredInput]"
          label="Expiry of Tenancy : *"
          density="compact"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
        />
      </div>

      <div class="d-flex ga-2">
        <!-- temp hide -->
        <!-- <v-text-field
          v-model="addItem.tenantICPassportNumber"
          :rules="[requiredInput]"
          label="I/C/Passport No. *"
          class="custom-input-class"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
        /> -->
        <v-text-field
          v-model="addItem.tenantContactNumber"
          :rules="[requiredInput]"
          label="Contact No. *"
          class="custom-input-class"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
        />
      </div>

      <div class="d-flex ga-2">
        <v-text-field
          v-model="addItem.tenantHp"
          :rules="[requiredInput]"
          label="(Hp) *"
          class="custom-input-class"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
        />
        <v-text-field
          v-model="addItem.tenantR"
          :rules="[requiredInput]"
          label="(R) *"
          class="custom-input-class"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
        />
      </div>
    </section>

    <!-- RULES AND REGULATIONS -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 18px">Rules and regulations</p>

      <div
        v-if="
          configForm &&
          configForm.firstLabel &&
          configForm.firstLabel.trim() !== `<p></p>`.trim()
        "
        v-html="configForm.firstLabel"
      ></div>
      <span v-else>
        <p class="align-start text-body pt-6 font-weight-regular">
          A. The electronic access card is used to access the side gate, lift
          lobby and common facilities (where applicable) within the development.
        </p>

        <p class="align-start text-body pt-6 font-weight-regular">
          B. Additional cards above the allocated number (as distributed at time
          of vacant possession) will be charged at S$50.00 per card (subject to
          availability). Units requiring extra cards will be considered on a
          case-by-case basis and documentary proof is required to prove that the
          applicants are residing in the Development.
        </p>

        <p class="align-start text-body pt-6 font-weight-regular">
          C. The replacement of lost / damaged card is charged at S$50.00 per
          card (non-refundable). All lost card/s must be reported to the
          Management immediately.
        </p>

        <p class="align-start text-body pt-6 font-weight-regular">
          D. All residents must exercise due care and diligence in the
          maintenance of the access card to keep it in good working condition.
          Keep all cards away from any magnetic device/fields and place them in
          a cool dry place when not in use.
        </p>

        <p class="align-start text-body pt-6 font-weight-regular">
          E. The Management reserves the right to request for documentary proof
          to prove that the applicant/s is/are residing in the development
          before issuing the access card/s.
        </p>

        <p class="align-start text-body pt-6 font-weight-regular">
          F. Upon termination of lease, tenants must surrender the access card/s
          to the Management before moving out of the estate.
        </p>

        <p class="align-start text-body pt-6 font-weight-regular">
          G. When the owner sells/lease his/her unit, he/she must surrender the
          access card/s to the Management prior to moving out of the estate.
        </p>

        <p class="align-start text-body pt-6 font-weight-regular">
          H. The Management, personnel or any appointed representative of the
          Managing Agent may require the person/s using the access card to
          identify themselves.
        </p>

        <p class="align-start text-body pt-6 font-weight-regular">
          I. The access card/s will only be issued to residents living in [Site
          Name]. Visitors at the Development will not be eligible for an access
          card. The Management reserves the right to reject the application if
          documentary proof of the intended access cardholder is not fully
          furnished.
        </p>

        <p class="align-start text-body pt-6 font-weight-regular">
          J. The Management reserves the right to change any rules and
          regulations.
        </p>

        <p class="align-start text-body pt-6 font-weight-regular">
          K. All cheques are to be issued in favour of “[Site Name]” or the MCST
          Plan No. (upon constitution).
        </p>
      </span>
    </section>

    <!-- CHECKBOX -->
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
          other purposes.
        </span>
      </p>
    </section>

    <!-- SIGNATURE -->
    <template v-if="configForm && configForm.isShowFirstSignature">
      <section class="d-flex flex-column ga-5 border-bottom">
        <div v-if="(isFormEdit || isFormView) && addItem.signature">
          <p
            v-if="isFormEdit"
            class="cursor-pointer mb-2"
            style="text-align: right; color: blue"
            @click="isFormEdit = false"
          >
            Edit
          </p>
          <v-img
            :src="addItem.signature"
            alt="Signature"
            class="custom-height-md"
          />
        </div>

        <SharedSignature
          v-else
          label="Signature"
          :signatory-email="
            addItem.signatoryEmail
              ? `Email: (${addItem.signatoryEmail})`
              : 'Email'
          "
          @on-sign="onSign($event)"
          @input-email="isSignatoryEmail = true"
        />

        <SharedEmailDialog
          v-model="isSignatoryEmail"
          label="Email"
          @set-email="signatoryEmail"
        />

        <div class="custom-input-class">
          <v-date-input
            v-model="signedDate"
            label="Signature Date"
            density="compact"
            hide-details
            variant="plain"
            :clearable="!isFormView"
            :disabled="isFormView"
          />
        </div>
      </section>
    </template>

    <!-- MANAGEMENT -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 18px">For management use:</p>

      <v-text-field
        v-model="addItem.applicationFee"
        label="Application Fees Received:"
        class="custom-input-class disabled-input"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.chequeNumber"
        label="[ ] By Bank / Cheque No:"
        class="custom-input-class disabled-input"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.approvedName"
        label="Approved By"
        class="custom-input-class disabled-input"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <div class="custom-input-class disabled-input" :style="computeInputColor">
        <v-date-input
          v-model="chequeDate"
          label="Date"
          density="compact"
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
const { item, isValid, isAdding, getItemById } = useElectronicAccessCard();
const { currentUser } = useLocalAuth();
const { requiredInput } = useUtils();
const route = useRoute();
const { configForm, getSelectedFormById } = useSiteSettings();
const { setSnackbar, theme } = useLocal();

// eslint-disable-next-line no-unused-vars
const emit = defineEmits<{
  (
    event: "onSubmit",
    payload: TElectronicAccessCard,
    queryAction: string,
  ): void;
}>();

const addItem = ref(item.value);
const isFormEdit = ref(false);
const isFormView = ref(false);
const queryAction = ref("");
const isSignatoryEmail = ref(false);

onMounted(async () => {
  addItem.value.management = currentUser.value.siteName;

  // Owner's Particulars
  addItem.value.nameOfOwner = userFullname.value;
  addItem.value.unitNumber = unitNumber.value;
  addItem.value.ownerNricNumber = currentUser.value.nric;
  addItem.value.ownerHomePhone = currentUser.value.primaryPhone; // applied primaryPhone instead, because current user doesn't have homePhone
  addItem.value.isAgree = true;

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

//Actions

const submit = async () => {
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

const onSign = (signature: string) => {
  addItem.value.signature = signature;
  addItem.value.signedDate = new Date();
};

const signatoryEmail = (email: string, action: string) => {
  action === "set"
    ? (addItem.value.signatoryEmail = email)
    : (addItem.value.signatoryEmail = "");
};

//Computed

const unitNumber = computed(() => {
  const { blockName, levelName, unitName } = currentUser.value;
  return `${blockName} / ${levelName} / ${unitName}`;
});

const userFullname = computed(() => {
  return `${currentUser.value.surname}, ${currentUser.value.givenName}`;
});

const tenancyCommencement = computed({
  get: () =>
    addItem.value.tenancyCommencement
      ? new Date(addItem.value.tenancyCommencement)
      : null, // Convert string to Date for v-date-input
  set: (value) =>
    (addItem.value.tenancyCommencement = value ? value.toISOString() : ""), // Convert Date to string when updated
});

const managementDate = computed({
  get: () => (addItem.value.date ? new Date(addItem.value.date) : null), // Convert string to Date for v-date-input
  set: (value) => (addItem.value.date = value ? value.toISOString() : ""), // Convert Date to string when updated
});

const tenancyExpiry = computed({
  get: () =>
    addItem.value.tenancyExpiry ? new Date(addItem.value.tenancyExpiry) : null, // Convert string to Date for v-date-input
  set: (value) =>
    (addItem.value.tenancyExpiry = value ? value.toISOString() : ""), // Convert Date to string when updated
});

const signedDate = computed({
  get: () =>
    addItem.value.signedDate ? new Date(addItem.value.signedDate) : null, // Convert string to Date for v-date-input
  set: (value) => (addItem.value.signedDate = value ? value.toISOString() : ""), // Convert Date to string when updated
});

const chequeDate = computed({
  get: () =>
    addItem.value.chequeDate ? new Date(addItem.value.chequeDate) : null, // Convert string to Date for v-date-input
  set: (value) => (addItem.value.chequeDate = value ? value.toISOString() : ""), // Convert Date to string when updated
});

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
