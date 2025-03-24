<template>
  <!-- Back Navigation -->
  <v-form
    v-model="isValid"
    class="w-100 px-3 py-5 d-flex flex-column ga-7 w-lg-66 mx-auto"
    @submit.prevent="onUpdateItem()"
  >
    <!-- Dropdown and Calendar Section -->
    <section class="d-flex flex-column ga-5">
      <v-text-field
        v-model="item.management"
        label="Management *"
        class="custom-input-class"
        density="compact"
        hide-details
        variant="plain"
        disabled
      />

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
    </section>

    <!-- Pets Info Section -->
    <section class="d-flex flex-column ga-5">
      <h5 style="font-size: 20px">Name of Pet/s</h5>

      <v-text-field
        v-model="item.nameOfPet"
        label="Name *"
        placeholder="Enter name of pet/s"
        class="custom-input-class"
        density="compact"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.typeOfPet"
        label="Type of Pet/s *"
        placeholder="Enter type of pet/s"
        class="custom-input-class"
        density="compact"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.breed"
        label="Breed (if applicable)"
        placeholder="Enter breed of pet/s"
        class="custom-input-class"
        density="compact"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.licenseNumber"
        label="License No.: (if applicable)"
        placeholder="Enter license no."
        class="custom-input-class"
        density="compact"
        hide-details
        variant="plain"
        disabled
      />
    </section>

    <!-- Owner's Particulars -->
    <section class="d-flex flex-column ga-5">
      <h5 style="font-size: 20px">Owner's Particulars</h5>

      <v-text-field
        v-model="item.nameOfOwner"
        label="Name *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.unitNumber"
        label="Unit No *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.contactNumber"
        label="Contact Number *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.email"
        label="Email *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.correspondenceAddress"
        label="Correspondence Address *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />
    </section>

    <!-- Checkbox -->
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
                  configForm.firstLabel &&
                  configForm.firstLabel.trim() !== `<p></p>`.trim()
                "
                v-html="configForm.firstLabel"
              >
              </span>
              <span v-else>
                I / We agree to provide my personal information as indicated and
                understand that it is solely to be used by the Management for
                management purposes only. The personal data shall not be used
                for other purposes.
              </span>
            </v-col>
          </v-row>
        </v-container>
      </p>
    </section>

    <!-- Declaration from Subsidiary -->
    <section class="d-flex flex-column ga-5">
      <div>
        <h5 style="font-size: 20px; margin-bottom: 15px">
          Declaration from Subsidiary <br />
          Proprietor / Tenant:
        </h5>
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
            I declare that I am residing at (Site Property) and that all the
            above particulars given by me are true and correct.
          </span>
        </p>
      </div>

      <v-text-field
        v-model="item.management"
        label="Site Property *"
        placeholder="Select Site Property"
        class="custom-input-class"
        density="compact"
        hide-details
        variant="plain"
        disabled
      />

      <div class="label-class mr-4">
        Attach Files <span class="ml-1">(Optional)</span>
      </div>
      <div
        v-if="Array.isArray(item.attachments) && item.attachments.length > 0"
      >
        {{ item.attachments }}
      </div>
      <div v-else>No Attachments</div>

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
  usePetRecords();
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
    await getSelectedFormByType("Pet Record Form");
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
