<template>
  <!-- Back Navigation -->
  <v-form
    v-model="isValid"
    class="w-100 px-3 py-5 d-flex flex-column ga-7 w-lg-66 mx-auto"
    @submit.prevent="onUpdateItem()"
  >
    <h5 style="font-size: 20px">Letter of undertaking & indemnity</h5>

    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">
        Letter of undertaking in respect of renovation / addition & alteration
        works at unit
      </p>

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
        disabled
      />
    </section>

    <section class="d-flex flex-column ga-5">
      <v-text-field
        v-model="item.unitNumber"
        label="I / We, Subsidiary Proprietor(s) of Unit *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.contractor"
        label="hereby authorise our contractor,*"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="item.contractorOwner"
        label="Of M/s *"
        class="custom-input-class"
        hide-details
        variant="plain"
        disabled
      />
    </section>

    <!-- From and To Date -->
    <section class="d-flex flex-column ga-5">
      <p style="font-size: 18px">
        to undertake the purposes of renovation / addition & alteration works to
        the above property, such works to commence from
      </p>

      <div class="custom-input-class">
        <v-date-input
          v-model="item.dateFrom"
          label="From *"
          density="compact"
          hide-details
          variant="plain"
          disabled
        />
      </div>

      <div class="custom-input-class">
        <v-date-input
          v-model="item.dateTo"
          label="To *"
          density="compact"
          hide-details
          variant="plain"
          disabled
        />
      </div>
    </section>

    <!-- Text Section -->
    <section class="d-flex flex-column ga-5">
      <div
        v-if="
          configForm &&
          configForm.firstLabel &&
          configForm.firstLabel.trim() !== `<p></p>`.trim()
        "
        v-html="configForm.firstLabel"
      ></div>
      <span v-else>
        <p style="font-size: 18px">
          In consideration of you at our request permitting the contractor to
          have access to the above premises, we hereby agree and undertake to
          indemnify and hold harmless the Developer, the appointed Managing
          Agent and the Management, for and against all actions, claims,
          damages, costs and expenses that may arise from any loss, damage,
          death, injury from any causes whatsoever to the property or persons
          caused by or resulting from the Subsidiary Proprietor(s)’ A&A works
          caused by any act, omission, neglect, default of the Subsidiary
          Proprietor(s), their servants, agents, contractors, sub-contractors,
          employees, invitees or any other persons whether or not the loss,
          damage death or injury is due to the negligence of the Developer, the
          appointed Managing Agent and the Management.
        </p>

        <p style="font-size: 18px">
          We further undertake to reimburse the developer and its appointed
          managing agent for all costs involved in removing waste materials and
          debris arising from our works if they are not removed by our
          contractors, failing which the costs involved is to be offset from our
          deposit.
        </p>

        <p style="font-size: 18px">
          We understand that it is our sole responsibility to consult, liaise
          directly and/or obtain the necessary approvals from the relevant
          authorities and/or our own Qualified Person before submitting our
          application to the Management. We shall not commence works of any
          nature unless we have received the acknowledgement letter from the
          Management.
        </p>

        <p style="font-size: 18px">
          Enclosed herewith is our cheque of
          <span class="text-primary">S${{ item.chequeAmount || 0 }}</span>
          being the refundable deposit required to be placed with the
          Management. We shall ensure that our contractors comply with the
          following:
        </p>
      </span>

      <div
        v-if="
          configForm &&
          configForm.secondLabel &&
          configForm.secondLabel.trim() !== `<p></p>`.trim()
        "
        v-html="configForm.secondLabel"
        class="pt-10"
      ></div>
      <template v-else>
        <p style="font-size: 18px">
          A. To adhere to the renovation guidelines as laid out in the
          Renovation / Addition & Alteration Guidelines.
        </p>
        <p style="font-size: 18px">
          B. To keep the common property clean and remove and cart away waste
          materials and debris, arising out of works, from time to time and on
          completion of our works or as and when directed by the Management.
        </p>
        <p style="font-size: 18px">
          C. To protect the lobby floors, wall finishes, carpets and lifts
          against damages when transporting materials.
        </p>
        <p style="font-size: 18px">
          D. To note that any replacement of the existing floor finishes (with
          or without water proofing membrane) will void the waterproof warranty
          on the floor finishes.
        </p>
        <p style="font-size: 18px">
          E. To strictly comply with all conditions stated in the application
          for permit to carry out Addition & Alteration works.
        </p>
      </template>
    </section>

    <!-- Checkox -->
    <section class="d-flex ga-10 border-bottom">
      <v-container style="margin-top: -13px">
        <v-row class="text-h6" align="start" justify="space-between">
          <v-col cols="auto" class="pa-0">
            <v-icon icon="mdi-check-circle" color="green" disabled />
          </v-col>
          <v-col class="pa-0 ml-10">
            <p
              v-if="
                configForm &&
                configForm.thirdLabel &&
                configForm.thirdLabel.trim() !== `<p></p>`.trim()
              "
              v-html="configForm.thirdLabel"
            ></p>
            <p v-else>
              I / We agree to provide my personal information as indicated and
              understand that it is solely to be used by the Management for
              management purposes only. The personal data shall not be used for
              other purposes.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Signature and dates -->
    <section class="d-flex flex-column ga-5">
      <v-text-field
        v-model="item.nameOfSubProp"
        :rules="[requiredInput]"
        label="Name of Subsidiary Proprietor(s) *"
        class="custom-input-class"
        :class="Boolean(!isSigned && item.signature)"
        :style="
          Boolean(!isSigned && item.signature)
            ? ''
            : 'background: none !important'
        "
        hide-details
        variant="plain"
        :disabled="Boolean(!isSigned && item.signature)"
      />

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
          label="Date *"
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
  useLOUI();
const { requiredInput } = useUtils();
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
    await getSelectedFormByType("Letter of Undertaking & Indemnity");
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
    nameOfSubProp: item.value.nameOfSubProp,
    signature: item.value.signature,
    signedDate: item.value.signedDate,
    subsidiaryEmail: item.value.subsidiaryEmail,
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
