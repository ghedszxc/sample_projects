<template>
  <!-- Back Navigation -->
  <v-form
    v-model="isValid"
    class="w-100 d-flex flex-column ga-10"
    @submit.prevent="submit()"
  >
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">Application for Bicycle Parking</p>

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
        label="Unit Owner/Tenant Name: *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.unitNumber"
        :rules="[requiredInput]"
        label="Unit No. *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.ownerContactNumber"
        :rules="[requiredInput]"
        label="Contact No. *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.ownerHP"
        label="(Hp)"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />
    </section>

    <!-- REASON CHECKBOXES -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 18px">
        Reasons for application (please tick accordingly)
      </p>

      <v-radio-group
        v-model="addItem.reasonForApplication"
        :rules="[requiredInput]"
        column
        hide-details
        :clearable="!isFormView"
        :disabled="isFormView"
      >
        <v-radio
          label="I am the new owner/ tenant of the above apartment."
          value="I am the new owner/ tenant of the above apartment."
        />
        <v-radio
          label="I have sold/changed my bicycle."
          value="I have sold/changed my bicycle."
        />
        <v-radio label="Others" value="others" />
      </v-radio-group>

      <v-textarea
        v-if="addItem.reasonForApplication === 'others'"
        v-model="otherReason"
        :rules="[requiredInput]"
        label="Others - Please elaborate *"
        class="custom-textarea-class"
        variant="plain"
        hide-details
        :clearable="!isFormView"
        :disabled="isFormView"
      />
    </section>

    <!-- AGREE CHECKBOXES -->
    <section class="d-flex flex-column ga-5">
      <div class="d-flex ga-10">
        <div style="margin-top: -13px">
          <v-checkbox
            v-model="addItem.isAgreeToAboveCondition"
            :clearable="!isFormView"
            :disabled="isFormView"
          />
        </div>
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
            I / We agree to provide my personal information as indicated and
            understand that it is solely to be used by the Management for
            management purposes only. The personal data shall not be used for
            other purposes.
          </span>
        </p>
      </div>

      <div class="d-flex ga-10">
        <div style="margin-top: -13px">
          <v-checkbox
            v-model="addItem.isAgree"
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
      </div>

      <div class="d-flex ga-10">
        <div style="margin-top: -13px">
          <v-checkbox
            v-model="addItem.isAgreeToLeaseMoveOut"
            :clearable="!isFormView"
            :disabled="isFormView"
          />
        </div>
        <p>
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
            I / We agree to provide my personal information as indicated and
            understand that it is solely to be used by the Management for
            management purposes only. The personal data shall not be used for
            other purposes.
          </span>
        </p>
      </div>
    </section>

    <!-- SIGNATURE -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <template v-if="configForm && configForm.isShowFirstSignature">
        <div v-if="(isFormEdit || isFormView) && addItem.ownerSignature">
          <p
            v-if="isFormEdit"
            class="cursor-pointer mb-2"
            style="text-align: right; color: blue"
            @click="isFormEdit = false"
          >
            Edit
          </p>
          <v-img
            :src="addItem.ownerSignature"
            alt="Signature"
            class="custom-height-md"
          />
        </div>

        <SharedSignature
          v-else
          label="Owner Signature"
          :signatory-email="
            addItem.ownerEmail
              ? `Owner Email: (${addItem.ownerEmail})`
              : 'Owner Email'
          "
          @on-sign="onOwnerSign($event)"
          @input-email="isOwnerEmail = true"
        />

        <SharedEmailDialog
          v-model="isOwnerEmail"
          label="Owner Email"
          @set-email="ownerEmail"
        />

        <div class="custom-input-class">
          <v-date-input
            v-model="ownerSignedDate"
            :rules="!addItem.ownerEmail ? [requiredInput] : []"
            label="Date"
            density="compact"
            hide-details
            variant="plain"
            :clearable="!isFormView"
            :disabled="isFormView"
          />
        </div>
      </template>
    </section>

    <!-- ACKNOWLEDGEMENT -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">Acknowledgement:</p>

      <v-text-field
        v-model="addItem.recipient"
        :rules="[requiredInput]"
        label="I/We *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <p>hereby acknowledge receipt of bicycle tag.</p>

      <!-- SIGNATURE -->
      <template v-if="configForm && configForm.isShowSecondSignature">
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
          label="Recipient Signature"
          :signatory-email="
            addItem.recipientEmail
              ? `Recipient Email: (${addItem.recipientEmail})`
              : 'Recipient Email'
          "
          @on-sign="onRecipientSign($event)"
          @input-email="isRecipientEmail = true"
        />

        <SharedEmailDialog
          v-model="isRecipientEmail"
          label="Recipient Email"
          @set-email="recipientEmail"
        />

        <div class="custom-input-class">
          <v-date-input
            v-model="recipientSignedDate"
            :rules="!addItem.recipientEmail ? [requiredInput] : []"
            label="Date"
            density="compact"
            hide-details
            variant="plain"
            :clearable="!isFormView"
            :disabled="isFormView"
          />
        </div>
      </template>
    </section>

    <!-- MANAGEMENT USE -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 20px">For management use:</p>

      <v-text-field
        v-model="addItem.tagNumber"
        label="Tag No. Issued:"
        class="custom-input-class disabled-input"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.approvedName"
        label="Approved By:"
        class="custom-input-class disabled-input"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <div class="custom-input-class disabled-input" :style="computeInputColor">
        <v-date-input
          v-model="approvedDate"
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
const { item, isValid, isAdding, getItemById } = useBicycle();
const { currentUser } = useLocalAuth();
const { requiredInput } = useUtils();
const route = useRoute();
const { configForm, getSelectedFormById } = useSiteSettings();
const { setSnackbar, theme } = useLocal();

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (event: "onSubmit", payload: TBicycleRecord, queryAction: string): void;
}>();

const addItem = ref(item.value);
const isFormEdit = ref(false);
const isFormView = ref(false);
const queryAction = ref("");
const otherReason = ref("");
const isRecipientSignatureEdit = ref(false);
const isOwnerEmail = ref(false);
const isRecipientEmail = ref(false);

const unitNumber = computed(() => {
  const { blockName, levelName, unitName } = currentUser.value;
  return `${blockName} / ${levelName} / ${unitName}`;
});
const userFullname = computed(() => {
  return `${currentUser.value.surname}, ${currentUser.value.givenName}`;
});

const computedDate = computed({
  get: () => (addItem.value.date ? new Date(addItem.value.date) : null), // Convert string to Date for v-date-input
  set: (value) => (addItem.value.date = value ? value.toISOString() : ""), // Convert Date to string when updated
});

const ownerSignedDate = computed({
  get: () =>
    addItem.value.ownerSignedDate
      ? new Date(addItem.value.ownerSignedDate)
      : null, // Convert string to Date for v-date-input
  set: (value) =>
    (addItem.value.ownerSignedDate = value ? value.toISOString() : ""), // Convert Date to string when updated
});

const recipientSignedDate = computed({
  get: () =>
    addItem.value.recipientSignedDate
      ? new Date(addItem.value.recipientSignedDate)
      : null, // Convert string to Date for v-date-input
  set: (value) =>
    (addItem.value.recipientSignedDate = value ? value.toISOString() : ""), // Convert Date to string when updated
});

const approvedDate = computed({
  get: () =>
    addItem.value.approvedDate ? new Date(addItem.value.approvedDate) : null, // Convert string to Date for v-date-input
  set: (value) =>
    (addItem.value.approvedDate = value ? value.toISOString() : ""), // Convert Date to string when updated
});

onMounted(async () => {
  addItem.value.management = currentUser.value.siteName; // editable
  addItem.value.date = new Date(); // editable
  // Owner's Particulars
  addItem.value.unitOwner = userFullname.value;
  addItem.value.unitNumber = unitNumber.value;
  addItem.value.ownerContactNumber = currentUser.value.primaryPhone;
  // Agreements
  addItem.value.isAgreeToAboveCondition = true;
  addItem.value.isAgreeToLeaseMoveOut = true;
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

const submit = () => {
  addItem.value.reasonForApplication =
    addItem.value.reasonForApplication === "others"
      ? otherReason.value
      : addItem.value.reasonForApplication;
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

const onOwnerSign = (signature: string) => {
  addItem.value.ownerSignature = signature;
  addItem.value.ownerSignedDate = new Date();
};

const ownerEmail = (email: string, action: string) => {
  action === "set"
    ? (addItem.value.ownerEmail = email)
    : (addItem.value.ownerEmail = "");
};

const onRecipientSign = (signature: string) => {
  addItem.value.recipientSignature = signature;
  addItem.value.recipientSignedDate = new Date();
};

const recipientEmail = (email: string, action: string) => {
  action === "set"
    ? (addItem.value.recipientEmail = email)
    : (addItem.value.recipientEmail = "");
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

.custom-textarea-class {
  border: 1px solid #343a45;
  padding: 11px 11px 16px 11px;
  border-radius: 4px;
  height: 120px;
}

.border-bottom {
  border-bottom: 1px solid #b9b8c033;
  padding-bottom: 25px;
}
</style>
