<template>
  <!-- Back Navigation -->
  <v-form
    v-model="isValid"
    class="w-100 px-3 py-5 d-flex flex-column ga-7 w-lg-66 mx-auto"
    @submit.prevent="onUpdateItem()"
  >
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">
        Application for renovation/ addition & alteration works
      </p>

      <div class="custom-input-class disabled-input">
        <v-date-input
          v-model="item.date"
          label="Date *"
          density="compact"
          hide-details
          variant="plain"
          disabled
        />
      </div>
      <v-text-field
        v-model="item.management"
        label="To: The Management *"
        class="custom-input-class disabled-input"
        hide-details
        variant="plain"
        disabled
      />
    </section>

    <!-- Owner's Particulars -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">Unit owner's particulars</p>

      <v-text-field
        v-model="item.nameOfOwner"
        label="Name *"
        class="custom-input-class disabled-input"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.unitNumber"
        label="Unit No *"
        class="custom-input-class disabled-input"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.ownerContactNumber"
        label="Contact No *"
        class="custom-input-class disabled-input"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.ownerOfficeNumber"
        label="Office No (Optional)"
        class="custom-input-class disabled-input"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.ownerMobileNumber"
        label="Mobile No (Optional)"
        class="custom-input-class disabled-input"
        hide-details
        variant="plain"
        disabled
      />
    </section>

    <!-- Contractor's Particulars -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">Contractor's Particulars</p>

      <v-text-field
        v-model="item.companyName"
        label="Company name *"
        class="custom-input-class disabled-input"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.registrationNumber"
        label="Registration number *"
        class="custom-input-class disabled-input"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.contractorAddress"
        label="Address *"
        class="custom-input-class disabled-input"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.contractorPersonInCharge"
        label="Person in charge *"
        class="custom-input-class disabled-input"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.contractorOfficeNumber"
        label="Office No (Optional)"
        class="custom-input-class disabled-input"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.contractorContactNumber"
        label="Mobile (Optional)"
        class="custom-input-class disabled-input"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.contractorHomePhone"
        label="Home Phone (Optional)"
        class="custom-input-class disabled-input"
        hide-details
        variant="plain"
        disabled
      />
    </section>

    <!-- Summary of proposed renovation -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 18px">
        Summary of Proposed Renovation / Addition & Alteration Works (Attach
        separate sheet if applicable)
      </p>

      <div class="custom-input-class disabled-input">
        <v-date-input
          v-model="item.startDate"
          label="Date *"
          density="compact"
          hide-details
          variant="plain"
          disabled
        />
      </div>
      <div class="custom-input-class disabled-input">
        <v-date-input
          v-model="item.endDate"
          label="Date *"
          density="compact"
          hide-details
          variant="plain"
          disabled
        />
      </div>
    </section>

    <!-- Hacking Period -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 18px">Hacking Period</p>

      <div class="custom-input-class disabled-input">
        <v-date-input
          v-model="item.hackingPeriodFrom"
          label="Date *"
          density="compact"
          hide-details
          variant="plain"
          disabled
        />
      </div>
      <div class="custom-input-class disabled-input">
        <v-date-input
          v-model="item.hackingPeriodTo"
          label="Date *"
          density="compact"
          hide-details
          variant="plain"
          disabled
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
        <v-checkbox v-model="item.isAgree" disabled />
      </div>
      <p>
        <v-container>
          <v-row class="text-h6" align="start" justify="space-between">
            <v-col cols="auto" class="pa-0">
              <v-icon icon="mdi-check-circle" color="green" />
            </v-col>
            <v-col class="pa-0 ml-10">
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
                management purposes only. The personal data shall not be used
                for other purposes
              </span>
            </v-col>
          </v-row>
        </v-container>
      </p>
    </section>

    <!-- Signature and dates -->
    <section class="d-flex flex-column ga-5 pb-15 border-bottom">
      <!-- <SharedSignature
          label="Signature of Subsidiary Proprietors"
          @on-sign="onSignProprietors($event)"
        /> -->

      <v-img
        v-if="
          !isSubsCurrentlySignature && item.signatureOfSubsidiaryProprietors
        "
        :src="item.signatureOfSubsidiaryProprietors"
        alt="Signature"
        class="custom-height-md"
      />

      <SharedSignature
        v-else
        label="Signature of Subsidiary Proprietors"
        @on-sign="onSignProprietors($event)"
      />

      <div class="custom-input-class disabled-input">
        <v-date-input
          v-model="item.signatureOfSubsidiaryDate"
          label="Date *"
          density="compact"
          hide-details
          variant="plain"
          disabled
        />
      </div>

      <v-img
        v-if="!isContCurrentlySignature && item.signatureOfContractor"
        :src="item.signatureOfContractor"
        alt="Signature"
        class="custom-height-md"
      />

      <SharedSignature
        v-else
        label="Signature of Contractor"
        @on-sign="onSignContractor($event)"
      />

      <div class="custom-input-class disabled-input">
        <v-date-input
          v-model="item.signatureOfContractorDate"
          label="Date *"
          density="compact"
          hide-details
          variant="plain"
          disabled
        />
      </div>
    </section>

    <!-- Note -->
    <section>
      <p style="font-size: 20px">Note:</p>
      <p class="my-5">
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
      <p>
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
const { item, isUpdating, isValid, setItem, getItemById, updateItemSignature } =
  useRenovation();
const { configForm, getSelectedFormByType } = useSiteSettings();
const { setSnackbar } = useLocal();
const route = useRoute();

const routeId = computed(() =>
  route.params.id ? String(route.params.id) : "",
);

const isSubsCurrentlySignature = ref(false);
const isContCurrentlySignature = ref(false);

onMounted(async () => {
  try {
    setItem(await getItemById(routeId.value));
    await getSelectedFormByType("Renovation Form");
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  }
});

const onSignProprietors = (signature: string) => {
  item.value.signatureOfSubsidiaryProprietors = signature;
  item.value.signatureOfSubsidiaryDate = new Date();
  isSubsCurrentlySignature.value = true;
};

const onSignContractor = (signature: string) => {
  item.value.signatureOfContractor = signature;
  item.value.signatureOfContractorDate = new Date();
  isContCurrentlySignature.value = true;
};

const onUpdateItem = async () => {
  const id = item.value._id ? item.value._id : "";
  let payload: any;
  const status =
    item.value.signatureOfSubsidiaryProprietors &&
    item.value.signatureOfContractor
      ? "Pending"
      : "Pending for Signature";
  if (
    isSubsCurrentlySignature.value &&
    item.value.signatureOfSubsidiaryProprietors
  ) {
    payload = {
      signatureOfSubsidiaryProprietors:
        item.value.signatureOfSubsidiaryProprietors,
      signatureOfSubsidiaryDate: item.value.signatureOfSubsidiaryDate,
      updatedAt: new Date(),
      status: status,
    };
  } else if (
    isContCurrentlySignature.value &&
    item.value.signatureOfContractor
  ) {
    payload = {
      signatureOfContractor: item.value.signatureOfContractor,
      signatureOfContractorDate: item.value.signatureOfContractorDate,
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
