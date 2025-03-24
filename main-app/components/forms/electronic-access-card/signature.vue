<template>
  <!-- Back Navigation -->
  <v-form
    v-model="isValid"
    class="w-100 px-3 py-5 d-flex flex-column ga-7 w-lg-66 mx-auto"
    @submit.prevent="onUpdateItem()"
  >
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">Application for electronic access card</p>

      <div class="custom-input-class">
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
        class="custom-input-class"
        hide-details
        variant="plain"
        clearable
        disabled
      />
    </section>

    <!-- OWNER -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">To be completed by unit owner</p>

      <v-text-field
        v-model="item.nameOfOwner"
        label="I / We *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.unitNumber"
        label="Being the owner of unit *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <p>
        of {{ item.siteName }} hereby submit my / our application for number/s
        of
      </p>

      <v-text-field
        v-model="item.accessCardNumber"
        label="Access Card *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.ownerNricNumber"
        label="Owner's NRIC No. *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.ownerHomePhone"
        label="Owner's Home Phone *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.ownerR"
        label="Owner's (R): *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />
    </section>

    <!-- NOMINEE -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">To be completed for nominee (if applicable)</p>

      <v-text-field
        v-model="item.nominatorName"
        label="I / We *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.nominatorUnitNumber"
        label="Being the owner of unit *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <p>
        of {{ item.siteName }} hereby nominate my immediate family / tenant
        whose name is given below for the application for (Access Card Type)
        number/s of Access Card
      </p>

      <v-text-field
        v-model="item.tenantAccessCardNumber"
        label="Access Card *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />
    </section>

    <!-- NOMINEE IS TENANT -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">If the Nominee is a Tenant, please state:</p>

      <v-text-field
        v-model="item.nameOfTenant"
        label="Name of tenant *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <div class="custom-input-class">
        <v-date-input
          v-model="item.tenancyCommencement"
          label="Commencement of Tenancy : *"
          density="compact"
          hide-details
          variant="plain"
          disabled
        />
      </div>

      <div class="custom-input-class">
        <v-date-input
          v-model="item.tenancyExpiry"
          label="Expiry of Tenancy : *"
          density="compact"
          hide-details
          variant="plain"
          disabled
        />
      </div>

      <div class="d-flex ga-2">
        <v-text-field
          v-model="item.tenantICPassportNumber"
          label="Tenant’s I/C or Passport No. *"
          class="custom-input-class"
          hide-details
          variant="plain"
          disabled
        />
        <v-text-field
          v-model="item.tenantContactNumber"
          label="Tenant’s Contact No. *"
          class="custom-input-class"
          hide-details
          variant="plain"
          disabled
        />
      </div>

      <div class="d-flex ga-2">
        <v-text-field
          v-model="item.tenantHp"
          label="(Hp) *"
          class="custom-input-class"
          hide-details
          variant="plain"
          disabled
        />
        <v-text-field
          v-model="item.tenantR"
          label="(R) *"
          class="custom-input-class"
          hide-details
          variant="plain"
          disabled
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
          I. The access card/s will only be issued to residents living in Royal
          Palms. Visitors at the Development will not be eligible for an access
          card. The Management reserves the right to reject the application if
          documentary proof of the intended access cardholder is not fully
          furnished.
        </p>

        <p class="align-start text-body pt-6 font-weight-regular">
          J. The Management reserves the right to change any rules and
          regulations.
        </p>

        <p class="align-start text-body pt-6 font-weight-regular">
          K. All cheques are to be issued in favour of “Royal Palms” or the MCST
          Plan No. (upon constitution).
        </p>
      </span>
    </section>

    <!-- CHECKBOX -->
    <section class="d-flex ga-10">
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
              management purposes only. The personal data shall not be used for
              other purposes.
            </span>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- SIGNATURE -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <v-img
        v-if="!isSigned && item.signature"
        :src="item.signature"
        alt="Signature"
        class="custom-height-md"
      />

      <SharedSignature v-else label="Signature *" @on-sign="onSign($event)" />

      <div class="custom-input-class">
        <v-date-input
          v-model="item.signedDate"
          label="Signature Date *"
          density="compact"
          hide-details
          variant="plain"
          clearable
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
  useElectronicAccessCard();
const { configForm, getSelectedFormByType } = useSiteSettings();
const { setSnackbar } = useLocal();
const route = useRoute();

const isSigned = ref(false);

const routeId = computed(() =>
  route.params.id ? String(route.params.id) : "",
);
const onSign = (signature: string) => {
  item.value.signature = signature;
  item.value.signedDate = new Date();
  isSigned.value = true;
};
onMounted(async () => {
  try {
    setItem(await getItemById(routeId.value));
    await getSelectedFormByType("Application for Electronic Access Card");
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
  const payload = {
    signature: item.value.signature,
    signedDate: item.value.signedDate,
    updatedAt: new Date(),
    status: "Pending",
  };
  await updateItemSignature(id, payload);
  window.location.href = `${useRuntimeConfig().public.RESIDENT_APP}/online-forms`;
};
</script>

<style>
.custom-input-class {
  border: 1px solid #343a45;
  padding: 12px 12px 17px 12px;
  border-radius: 4px;
  background: #e0e0e0;
}

.border-bottom {
  border-bottom: 1px solid #b9b8c033;
  padding-bottom: 25px;
}
</style>
