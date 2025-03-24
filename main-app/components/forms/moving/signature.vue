<template>
  <!-- Back Navigation -->
  <v-form
    v-model="isValid"
    class="w-100 px-3 py-5 d-flex flex-column ga-7 w-lg-66 mx-auto"
    @submit.prevent="onUpdateItem()"
  >
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">Application for Moving In/Out & Delivery</p>

      <div class="custom-input-class">
        <v-date-input
          v-model="item.date"
          label="Date *"
          density="compact"
          hide-details
          disabled
        />
      </div>

      <v-text-field
        v-model="item.management"
        label="To: The Management *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />
    </section>

    <!-- UNIT INFO -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 20px">
        Unit No. (Block/Level/Unit) Move In / Out / Delivery
      </p>

      <v-text-field
        v-model="item.unitNumber"
        label="Unit No *"
        class="custom-input-class disabled-input"
        hide-details
        variant="plain"
        disabled
      />
    </section>

    <!-- Owner’s Particulars: -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 18px">Owner’s Particulars</p>

      <v-text-field
        v-model="item.nameOfOwner"
        label="Name *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.icPassportNumber"
        label="IC/Passport No.: *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.ownerContactNumber"
        label="Contact No. *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.ownerOffice"
        label="Office No."
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.ownerHP"
        label="Home Phone No."
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />
    </section>

    <section class="d-flex ga-10">
      <div style="margin-top: -13px">
        <v-checkbox v-model="item.isAgree" disabled />
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
        v-model="item.companyName"
        label="Mover's Company *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.office"
        label="Office No. *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.hp"
        label="Home Phone No."
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.nameOfSupervisor"
        label="Name of Supervisor *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.iDPassportNumber"
        label="ID/Passport No."
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.workPermit"
        label="Work Permit"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.address"
        label="Address *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <div class="d-flex ga-2">
        <v-text-field
          v-model="item.vehicleType"
          label="Vehicle Type *"
          class="custom-input-class"
          hide-details
          variant="plain"
          disabled
        />
        <v-text-field
          v-model="item.vehicleRgn"
          label="Vehicle Regn *"
          class="custom-input-class"
          hide-details
          variant="plain"
          disabled
        />
      </div>
    </section>

    <!-- UNDERTAKINGS -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 18px">
        Undertakings by Subsidiary Proprietor / Tenant
      </p>

      <section class="d-flex ga-10">
        <div style="margin-top: -13px">
          <v-checkbox v-model="item.isAgree" disabled />
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
          <v-checkbox v-model="item.isAgree" disabled />
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
  useMoving();
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
    await getSelectedFormByType("Application for Moving");
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
