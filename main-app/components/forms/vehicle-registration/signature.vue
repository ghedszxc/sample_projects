<template>
  <!-- Back Navigation -->
  <v-form
    v-model="isValid"
    class="w-100 px-3 py-5 d-flex flex-column ga-7 w-lg-66 mx-auto"
    @submit.prevent="onUpdateItem()"
  >
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">Vehicle Registration Form</p>

      <div class="custom-input-class">
        <v-date-input
          v-model="item.date"
          label="Date *"
          density="compact"
          hide-details
          variant="plain"
          clearable
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

    <!-- OWNER INFO -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <v-text-field
        v-model="item.unitOwner"
        label="Name of Unit Owner *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.ownerNRIC"
        label="NRIC: *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.ownerContactNumber"
        label="Contact No. (HP) *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.unitNumber"
        :rules="[requiredInput]"
        label="Unit No. # *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.carOwner"
        label="Vehicle Owner Name"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.carPlateNumber"
        label="Vehicle Plate No."
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.model"
        label="Vehicle Model"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.colour"
        label="Vehicle Color"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />
    </section>

    <!-- AGREE CHECKBOXES -->
    <section class="d-flex flex-column border-bottom">
      <div
        v-if="
          configForm &&
          configForm.firstLabel &&
          configForm.firstLabel.trim() !== `<p></p>`.trim()
        "
        v-html="configForm.firstLabel"
      ></div>
      <span v-else>
        <p class="mt-10">
          A. I/We agree to abide by the rules and regulations as stipulated in
          Royal Palms handbook at all times.
        </p>

        <p class="mt-5">
          B. I/We also understand that all vehicles are parked entirely at the
          owner’s risk. All persons and vehicles within the car park enter
          entirely at the risk of such person and/or the motorist. Persons
          entering the car park shall be responsible for any damage or loss to
          the car(s) parked or the car park equipment caused by such persons.
        </p>

        <p class="mt-5 mb-5">
          C. I/We acknowledge that the vehicle shall be parked properly without
          causing any inconvenience to other users.
        </p>

        <p class="mt-5 mb-5">
          D. I/We acknowledge that I/we fully understand the balloting of car
          park lots when required.
        </p>

        <p class="mt-5 mb-5">
          E. I/We acknowledge that for 2 nd and subsequent car application will
          not be entertained. The Management reserved the right to terminate the
          approval of vehicle application at any point in time.
        </p>
      </span>
    </section>

    <!-- ACKNOWLEDGEMENT -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 20px">Acknowledge By:</p>

      <v-img
        v-if="!isSigned && item.recipientSignature"
        :src="item.recipientSignature"
        alt="Signature"
        class="custom-height-md"
      />

      <SharedSignature v-else label="Signature *" @on-sign="onSign($event)" />

      <div class="custom-input-class">
        <v-date-input
          v-model="item.recipientSignedDate"
          label="Date *"
          density="compact"
          hide-details
          variant="plain"
          clearable
          disabled
        />
      </div>

      <div class="d-flex ga-2">
        <v-text-field
          v-model="item.unitOwner"
          label="Name of Unit Owner *"
          class="custom-input-class"
          hide-details
          variant="plain"
          disabled
        />

        <v-text-field
          v-model="item.unitNumber"
          label="Unit No. #"
          class="custom-input-class"
          hide-details
          variant="plain"
          disabled
        />
      </div>
    </section>

    <v-btn
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
  useVehicleRegistration();
const { requiredInput } = useUtils();
const { configForm, getSelectedFormByType } = useSiteSettings();
const { setSnackbar } = useLocal();
const route = useRoute();

const isSigned = ref(false);

const routeId = computed(() =>
  route.params.id ? String(route.params.id) : "",
);
const onSign = (signature: string) => {
  item.value.recipientSignature = signature;
  item.value.recipientSignedDate = new Date() as unknown as string;
  isSigned.value = true;
};

onMounted(async () => {
  try {
    setItem(await getItemById(routeId.value));
    await getSelectedFormByType("Vehicle Registration Form");
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
    recipientSignature: item.value.recipientSignature,
    recipientSignedDate: item.value.recipientSignedDate,
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
