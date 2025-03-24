<template>
  <!-- Back Navigation -->
  <v-form
    v-model="isValid"
    class="w-100 px-3 py-5 d-flex flex-column ga-7 w-lg-66 mx-auto"
    @submit.prevent="onUpdateItem()"
  >
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">Application for Bicycle Parking</p>

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
        label="Unit Owner/Tenant Name: *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.unitNumber"
        label="Unit No. *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.ownerContactNumber"
        label="Contact No."
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.ownerHP"
        label="(Hp)"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />
    </section>

    <!-- REASON CHECKBOXES -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 18px">
        Reasons for application (please tick accordingly)
      </p>

      <v-radio-group
        v-model="item.reasonForApplication"
        disabled
        column
        hide-details
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
        v-model="item.reasonForApplication"
        label="Others - Please elaborate *"
        class="custom-textarea-class"
        variant="plain"
        hide-details
        disabled
      />
    </section>

    <!-- AGREE CHECKBOXES -->
    <section class="d-flex flex-column ga-5">
      <div class="d-flex ga-10">
        <p>
          <v-container>
            <v-row class="text-h6" align="start" justify="space-between">
              <v-col cols="auto" class="pa-0">
                <v-icon
                  :icon="item.isAgree ? 'mdi-check-circle' : 'mdi-close-circle'"
                  :color="item.isAgree ? 'green' : 'red'"
                />
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
                  I / We agree to provide my personal information as indicated
                  and understand that it is solely to be used by the Management
                  for management purposes only. The personal data shall not be
                  used for other purposes.
                </span>
              </v-col>
            </v-row>
          </v-container>
        </p>
      </div>

      <div class="d-flex ga-10">
        <p>
          <v-container>
            <v-row class="text-h6" align="start" justify="space-between">
              <v-col cols="auto" class="pa-0">
                <v-icon
                  :icon="item.isAgree ? 'mdi-check-circle' : 'mdi-close-circle'"
                  :color="item.isAgree ? 'green' : 'red'"
                />
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
                  I / We agree to provide my personal information as indicated
                  and understand that it is solely to be used by the Management
                  for management purposes only. The personal data shall not be
                  used for other purposes.
                </span>
              </v-col>
            </v-row>
          </v-container>
        </p>
      </div>

      <div class="d-flex ga-10">
        <p>
          <v-container>
            <v-row class="text-h6" align="start" justify="space-between">
              <v-col cols="auto" class="pa-0">
                <v-icon
                  :icon="item.isAgree ? 'mdi-check-circle' : 'mdi-close-circle'"
                  :color="item.isAgree ? 'green' : 'red'"
                />
              </v-col>
              <v-col class="pa-0 ml-10">
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
                  I / We agree to provide my personal information as indicated
                  and understand that it is solely to be used by the Management
                  for management purposes only. The personal data shall not be
                  used for other purposes.
                </span>
              </v-col>
            </v-row>
          </v-container>
        </p>
      </div>
    </section>

    <!-- SIGNATURE -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <v-img
        v-if="!isOwnerSignature && item.ownerSignature"
        :src="item.ownerSignature"
        alt="Signature"
        class="custom-height-md"
      />

      <SharedSignature
        v-else
        label="Owner Signature"
        @on-sign="onOwnerSign($event)"
      />

      <div class="custom-input-class">
        <v-date-input
          v-model="item.ownerSignedDate"
          label="Date *"
          density="compact"
          hide-details
          variant="plain"
          clearable
          disabled
        />
      </div>
    </section>

    <!-- ACKNOWLEDGEMENT -->
    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">Acknowledgement:</p>

      <v-text-field
        v-model="item.recipient"
        label="I/We *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <p>hereby acknowledge receipt of bicycle tag.</p>

      <v-img
        v-if="!isRecipientSignature && item.recipientSignature"
        :src="item.recipientSignature"
        alt="Signature"
        class="custom-height-md"
      />

      <SharedSignature
        v-else
        label="Recipient Signature"
        @on-sign="onRecipientSign($event)"
      />

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
  useBicycleParking();
const { configForm, getSelectedFormByType } = useSiteSettings();
const { setSnackbar } = useLocal();
const route = useRoute();

const isOwnerSignature = ref(false);
const isRecipientSignature = ref(false);

const routeId = computed(() =>
  route.params.id ? String(route.params.id) : "",
);

const onOwnerSign = (signature: string) => {
  item.value.ownerSignature = signature;
  item.value.ownerSignedDate = new Date();
  isOwnerSignature.value = true;
};

const onRecipientSign = (signature: string) => {
  item.value.recipientSignature = signature;
  item.value.recipientSignedDate = new Date();
  isRecipientSignature.value = true;
};

onMounted(async () => {
  try {
    setItem(await getItemById(routeId.value));
    await getSelectedFormByType("Application for Bicycle Parking");
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
    item.value.ownerSignature && item.value.recipientSignature
      ? "Pending"
      : "Pending for Signature";
  if (isOwnerSignature.value && item.value.ownerSignature) {
    payload = {
      ownerSignature: item.value.ownerSignature,
      ownerSignedDate: item.value.ownerSignedDate,
      updatedAt: new Date(),
      status: status,
    };
  } else if (isRecipientSignature.value && item.value.recipientSignature) {
    payload = {
      recipientSignature: item.value.recipientSignature,
      recipientSignedDate: item.value.recipientSignedDate,
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
  background: #e0e0e0;
}

.border-bottom {
  border-bottom: 1px solid #b9b8c033;
  padding-bottom: 25px;
}
</style>
