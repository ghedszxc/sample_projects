<template>
  <!-- Back Navigation -->
  <v-form
    v-model="isValid"
    class="w-100 px-3 py-5 d-flex flex-column ga-7 w-lg-66 mx-auto"
    @submit.prevent="onUpdateItem()"
  >
    <!-- Header -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">Refund of deposit</p>

      <v-text-field
        v-model="item.unitNumber"
        label="Request for refund of renovation deposit
                  In respect of renovation / addition & alteration works at unit no *"
        class="custom-input-class disabled-input"
        hide-details
        variant="plain"
        disabled
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

      <div class="custom-input-class disabled-input">
        <v-date-input
          v-model="item.dateOfCompletion"
          label="Date of completion of Renovation / A & A works *"
          density="compact"
          hide-details
          variant="plain"
          disabled
        />
      </div>

      <div class="custom-input-class disabled-input">
        <v-date-input
          v-model="item.dateOfJointInspection"
          label="Date of joint inspection *"
          density="compact"
          hide-details
          variant="plain"
          disabled
        />
      </div>

      <v-textarea
        v-model="item.remarks"
        label="Remarks *"
        class="custom-input-class disabled-input"
        hide-details
        variant="plain"
        disabled
      />
    </section>

    <!-- Checkox -->
    <section class="d-flex ga-10">
      <div style="margin-top: -13px">
        <v-checkbox v-model="item.isAgree" disabled />
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
        v-model="item.submittedByApplicant"
        label="Name of Applicant (Subsidiary Proprietor) *"
        class="custom-input-class"
        :class="
          Boolean(!isAppCurrentlySignature && item.signedByApplicant)
            ? 'disabled-input'
            : ''
        "
        hide-details
        variant="plain"
        :disabled="Boolean(!isAppCurrentlySignature && item.signedByApplicant)"
      />

      <v-img
        v-if="!isAppCurrentlySignature && item.signedByApplicant"
        :src="item.signedByApplicant"
        alt="Signature"
        class="custom-height-md"
      />

      <SharedSignature v-else @on-sign="onSignByApplicant($event)" />

      <div class="custom-input-class disabled-input">
        <v-date-input
          v-model="item.dateOfRefund"
          label="Date of refund *"
          density="compact"
          hide-details
          variant="plain"
          disabled
        />
      </div>
    </section>

    <!-- Certified By -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 20px">Certified By</p>

      <v-text-field
        v-model="item.certifiedByStaff"
        label="Name of MA Staff"
        class="custom-input-class disabled-input"
        hide-details
        disabled
        variant="plain"
      />

      <SharedSignature :isDisabled="true" />

      <v-text-field
        v-model="item.chequeNumber"
        label="Cheque No:"
        class="custom-input-class disabled-input"
        hide-details
        variant="plain"
        disabled
      />
    </section>

    <!-- Received By -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 20px">Received By</p>

      <v-text-field
        v-model="item.receivedBy"
        label="Name *"
        class="custom-input-class"
        :class="
          Boolean(!isRcvrCurrentlySignature && item.signedByReceiver)
            ? 'disabled-input'
            : ''
        "
        hide-details
        variant="plain"
        :disabled="Boolean(!isRcvrCurrentlySignature && item.signedByReceiver)"
      />

      <v-img
        v-if="!isRcvrCurrentlySignature && item.signedByReceiver"
        :src="item.signedByReceiver"
        alt="Signature"
        class="custom-height-md"
      />

      <SharedSignature v-else @on-sign="onSignByReceiver($event)" />

      <div class="custom-input-class disabled-input">
        <v-date-input
          v-model="item.signatureDate"
          label="Signature Date *"
          density="compact"
          hide-details
          variant="plain"
          disabled
        />
      </div>
    </section>

    <v-btn
      v-if="item.status === 'Pending for Signature'"
      color="#EB261E"
      type="submit"
      class="mb-5"
      height="42px"
      :disabled="!isValid"
      :loading="isUpdating"
    >
      Submit
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
const { item, isValid, isUpdating, setItem, getItemById, updateItemSignature } =
  useRenovationRefund();
const { configForm, getSelectedFormByType } = useSiteSettings();
const { setSnackbar } = useLocal();
const route = useRoute();

const isAppCurrentlySignature = ref(false);
const isRcvrCurrentlySignature = ref(false);

const routeId = computed(() =>
  route.params.id ? String(route.params.id) : "",
);

const onSignByApplicant = (signature: string) => {
  item.value.signedByApplicant = signature;
  item.value.signatureDate = new Date();
  isAppCurrentlySignature.value = true;
};

const onSignByReceiver = (signature: string) => {
  item.value.signedByReceiver = signature;
  item.value.signatureDate = new Date();
  isRcvrCurrentlySignature.value = true;
};

onMounted(async () => {
  try {
    setItem(await getItemById(routeId.value));
    await getSelectedFormByType("Renovation Refund Form");
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  }
});

const onUpdateItem = async () => {
  const id = item.value._id ? item.value._id : "";
  let payload: any;
  const status =
    item.value.signedByApplicant && item.value.signedByReceiver
      ? "Pending"
      : "Pending for Signature";
  if (isAppCurrentlySignature.value && item.value.signedByApplicant) {
    payload = {
      submittedByApplicant: item.value.submittedByApplicant,
      signedByApplicant: item.value.signedByApplicant,
      updatedAt: new Date(),
      status: status,
    };
  } else if (isRcvrCurrentlySignature.value && item.value.signedByReceiver) {
    payload = {
      receivedBy: item.value.receivedBy,
      signedByReceiver: item.value.signedByReceiver,
      signatureDate: item.value.signatureDate,
      updatedAt: new Date(),
      status: status,
    };
  }

  await updateItemSignature(id, payload);
  window.location.href = `${useRuntimeConfig().public.RESIDENT_APP}/online-forms`;
};
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

.disabled-input {
  background: #e0e0e0;
}
</style>
