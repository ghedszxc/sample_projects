<template>
  <!-- Back Navigation -->
  <v-form
    v-model="isValid"
    class="w-100 d-flex flex-column ga-7"
    @submit.prevent="submit()"
  >
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">Application for Moving In/Out & Delivery</p>
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

    <!-- UNIT INFO -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 20px">
        Unit No. (Block/Level/Unit) Move In / Out / Delivery
      </p>

      <v-text-field
        v-model="addItem.unitNumber"
        :rules="[requiredInput]"
        label="Unit No *"
        class="custom-input-class disabled-input"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />
    </section>

    <!-- Owner’s Particulars: -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 18px">Owner’s Particulars</p>

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

      <!-- temp hide -->
      <!-- <v-text-field
        v-model="addItem.icPassportNumber"
        :rules="[requiredInput]"
        label="IC/Passport No.: *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      /> -->

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
        v-model="addItem.ownerOffice"
        :rules="[requiredInput]"
        label="Office No. *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.ownerHP"
        label="Home Phone No."
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />
    </section>

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
            configForm.firstLabel &&
            configForm.firstLabel.trim() !== `<p></p>`.trim()
          "
          v-html="configForm.firstLabel"
        >
        </span>
        <span v-else>
          I / We shall be responsible for our mover(s) (particulars below)
          complying with the Rules & Regulations of [Your Site].
        </span>
      </p>
    </section>

    <!-- MOVER'S PARTICULAR -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 18px">Mover’s Particulars</p>

      <v-text-field
        v-model="addItem.companyName"
        :rules="[requiredInput]"
        label="Mover's Company *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.office"
        :rules="[requiredInput]"
        label="Office No. *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.hp"
        label="Home Phone No."
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.nameOfSupervisor"
        :rules="[requiredInput]"
        label="Name of Supervisor *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <!-- temp hide -->
      <!-- <v-text-field
        v-model="addItem.iDPassportNumber"
        label="ID/Passport No."
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      /> -->

      <!-- temp hide -->
      <!-- <v-text-field
        v-model="addItem.workPermit"
        label="Work Permit"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      /> -->

      <v-text-field
        v-model="addItem.address"
        :rules="[requiredInput]"
        label="Address *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <div class="d-flex ga-2">
        <v-text-field
          v-model="addItem.vehicleType"
          :rules="[requiredInput]"
          label="Vehicle Type *"
          class="custom-input-class"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
        />
        <!-- temp hide -->
        <!-- <v-text-field
          v-model="addItem.vehicleRgn"
          :rules="[requiredInput]"
          label="Vehicle Regn *"
          class="custom-input-class"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
        /> -->
      </div>
    </section>

    <!-- UNDERTAKINGS -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 18px">
        Undertakings by Subsidiary Proprietor / Tenant
      </p>

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
            I confirm that I have read and will abide by the House Rules
            governing the Moving In / Out & Delivery (or any changes to the
            House Rules thereafter) as determined by the Management.
          </span>
        </p>
      </section>

      <section class="d-flex ga-10 border-bottom">
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
      </section>

      <!-- SIGNATURE -->
      <template v-if="configForm && configForm.isShowFirstSignature">
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
            v-model="signedDateModel"
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

    <section class="d-flex flex-column ga-5">
      <p style="font-size: 18px">For management use:</p>
      <p>Security deposit of S$ 1,000.00</p>

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
        class="custom-input-class disabled-input"
        :style="computeInputColor"
        label="Approved By"
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
const { item, isValid, isAdding, getItemById } = useMoving();
const { currentUser } = useLocalAuth();
const { requiredInput } = useUtils();
const route = useRoute();
const { configForm, getSelectedFormById } = useSiteSettings();
const { setSnackbar, theme } = useLocal();

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (event: "onSubmit", payload: TMoving, queryAction: string): void;
}>();

const addItem = ref(item.value);
const isFormEdit = ref(false);
const isFormView = ref(false);
const queryAction = ref("");
const isSignatoryEmail = ref(false);

const userFullname = computed(() => {
  return `${currentUser.value.surname}, ${currentUser.value.givenName}`;
});

const unitNumber = computed(() => {
  const { blockName, levelName, unitName } = currentUser.value;
  return `${blockName} / ${levelName} / ${unitName}`;
});

const signedDateModel = computed({
  get: () =>
    addItem.value.signedDate ? new Date(addItem.value.signedDate) : null,
  set: (value) => (addItem.value.signedDate = value ? value.toISOString() : ""),
});

const chequeDate = computed({
  get: () =>
    addItem.value.chequeDate ? new Date(addItem.value.chequeDate) : null,
  set: (value) => (addItem.value.chequeDate = value ? value.toISOString() : ""),
});

onMounted(async () => {
  addItem.value.management = currentUser.value.siteName; // editable
  addItem.value.date = new Date(); // editable

  // Owner's Particulars
  addItem.value.nameOfOwner = userFullname.value;
  addItem.value.icPassportNumber = currentUser.value.nric;
  addItem.value.ownerContactNumber = currentUser.value.primaryPhone;
  addItem.value.unitNumber = unitNumber.value;

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

//Actions
const submit = async () => {
  addItem.value.unitNumber = unitNumber.value;
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

const computeInputColor = computed(() => {
  return theme.value === "dark"
    ? { background: "#343a45" }
    : { background: "#EBEBE4" };
});

const signatoryEmail = (email: string, action: string) => {
  action === "set"
    ? (addItem.value.signatoryEmail = email)
    : (addItem.value.signatoryEmail = "");
};

onBeforeUnmount(() => {
  isFormEdit.value = false;
  isFormView.value = false;
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
