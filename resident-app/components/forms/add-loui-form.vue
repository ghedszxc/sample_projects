<template>
  <!-- Back Navigation -->
  <v-form
    v-model="isValid"
    class="w-100 d-flex flex-column ga-7"
    @submit.prevent="submit()"
  >
    <h5 style="font-size: 20px">Letter of undertaking & indemnity</h5>

    <!-- Prerequisite upload attachment -->
    <section v-if="!route.query.id" class="mt-10">
      <p class="text-h5">
        The renovation will only be approved once all three required steps have
        been fulfilled.
      </p>
      <ul class="stepper-custom-class stepper-attachment">
        <li class="d-flex align-center" :style="stepperComputedStyle">
          <img class="mr-5" width="45" src="/check-rounded-green.svg" />
          <p class="d-flex align-center">
            Application For Renovation Form
            <v-btn
              icon="mdi-paperclip"
              @click="loadRenovation()"
              class="ml-10"
            />
          </p>
        </li>
        <li class="stepper-dropDown" v-if="renovationItems.length">
          <v-radio-group v-model="selectedRenovation">
            <v-radio
              v-for="item in renovationItems"
              :key="item?._id ? item._id : ''"
              :label="
                item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : 'No Date Available'
              "
              :value="item._id"
              color="green"
            ></v-radio>
          </v-radio-group>
        </li>

        <li class="d-flex align-center" :style="stepperComputedStyle">
          <div class="mr-5">
            <p class="stepper-number">2</p>
          </div>
          <p class="d-flex align-center">
            Letter of undertaking & indemnity Form
          </p>
        </li>
        <li class="d-flex align-center" :style="stepperComputedStyle">
          <div class="mr-5">
            <p class="stepper-number">3</p>
          </div>
          <p>Refund of deposit Form</p>
        </li>
      </ul>
    </section>

    <section class="d-flex flex-column ga-5 border-bottom">
      <p style="font-size: 20px">
        Letter of undertaking in respect of renovation / addition & alteration
        works at unit
      </p>

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

    <section class="d-flex flex-column ga-5">
      <v-text-field
        v-model="addItem.unitNumber"
        :rules="[requiredInput]"
        label="I / We, Subsidiary Proprietor(s) of Unit *"
        class="custom-input-class"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.contractor"
        :rules="[requiredInput]"
        label="hereby authorize our contractor,*"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.contractorOwner"
        :rules="[requiredInput]"
        label="Of M/s *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
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
          v-model="dateFrom"
          :rules="[requiredInput]"
          label="From *"
          density="compact"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
        />
      </div>

      <div class="custom-input-class">
        <v-date-input
          v-model="dateTo"
          :rules="[requiredInput]"
          label="To *"
          density="compact"
          hide-details
          variant="plain"
          :clearable="!isFormView"
          :disabled="isFormView"
          :min="new Date()"
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
      <div style="margin-top: -13px">
        <v-checkbox
          v-model="addItem.isAgree"
          :rules="[requiredInput]"
          :clearable="!isFormView"
          :disabled="isFormView"
        />
      </div>
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
        understand that it is solely to be used by the Management for management
        purposes only. The personal data shall not be used for other purposes.
      </p>
    </section>

    <!-- Signature and dates -->
    <section class="d-flex flex-column ga-5">
      <v-text-field
        v-model="addItem.nameOfSubProp"
        label="Name of Subsidiary Proprietor(s)"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

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
            addItem.subsidiaryEmail
              ? `Email: (${addItem.subsidiaryEmail})`
              : 'Email'
          "
          @on-sign="onSign($event)"
          @input-email="isSubsidiaryEmail = true"
        />

        <SharedEmailDialog
          v-model="isSubsidiaryEmail"
          label="Email"
          @set-email="subsidiaryEmail"
        />

        <div class="custom-input-class">
          <v-date-input
            v-model="signedDate"
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

    <section
      v-if="queryAction === 'view' && addItem.status === 'Approved'"
      class="mt-10"
    >
      <p class="text-h5">
        The renovation will only be approved once all three required steps have
        been fulfilled.
      </p>
      <ul class="stepper-custom-class">
        <li class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <img class="mr-5" width="45" src="/check-rounded-green.svg" />
            <p>Application For Renovation Form</p>
          </div>
          <v-btn
            icon="mdi-eye"
            density="comfortable"
            @click="viewForm(addItem, 'view', 'renovation')"
          />
        </li>
        <li class="d-flex align-center">
          <img class="mr-5" width="45" src="/check-rounded-green.svg" />
          <p>Letter of undertaking & indemnity Form</p>
        </li>
        <li class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <p v-if="!addItem.refundId" class="stepper-number mr-5">3</p>
            <img
              v-else
              class="mr-5"
              width="45"
              src="/check-rounded-green.svg"
            />
            <p>Refund of deposit Form</p>
          </div>
          <v-btn
            v-if="addItem.refundId"
            icon="mdi-eye"
            density="comfortable"
            @click="viewForm(addItem, 'view', 'renovation-refund')"
          />
        </li>
      </ul>

      <v-btn
        v-if="!addItem.refundId"
        color="#EB261E"
        height="42px"
        class="mt-10 w-100"
        @click="nextStep(addItem, 'stepper')"
      >
        Refund Form
      </v-btn>
    </section>
  </v-form>
</template>

<script setup lang="ts">
const { item, isValid, isAdding, getItemById } = useLOUI();
const { items, setItems } = useForms();
const { configForm, getSelectedFormById } = useSiteSettings();
const { currentUser } = useLocalAuth();
const { setSnackbar, theme } = useLocal();
const route = useRoute();

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (event: "onSubmit", payload: TLOUI, queryAction: string): void;
}>();

const addItem = ref(item.value);
const isFormEdit = ref(false);
const isSubsidiaryEmail = ref(false);
const isFormView = ref(false);
const selectedRenovation = ref("");
const renovationItems = ref<TForms[]>([]);
const queryAction = ref("");

onMounted(async () => {
  addItem.value.management = currentUser.value.siteName;
  addItem.value.unitNumber = unitNumber.value;
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

//Actions

const submit = async () => {
  addItem.value.createdBy = currentUser.value._id;
  addItem.value.createdByName = userFullname.value;
  addItem.value.renovationId = route.query.id
    ? route.query.id?.toLocaleString()
    : selectedRenovation.value;
  emit("onSubmit", addItem.value, queryAction.value);
};

const checkForQuery = async () => {
  try {
    const id = route.query.id ? String(route.query.id) : "";
    const action = route.query.action ? String(route.query.action) : "";
    if (action === "add") {
      await getSelectedFormById(id);
    } else {
      if (id && queryAction.value !== "stepper") {
        const idString = id.toString();
        addItem.value = (await getItemById(idString)) || item.value;
        if (queryAction.value === "edit") {
          addItem.value.status = "Pending";
        } else if (queryAction.value === "view") {
          isFormView.value = true;
        } else {
          console.log("No Query Action");
        }
      } else {
        console.log("No 'id' query parameter found, or it is a stepper");
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

const subsidiaryEmail = (email: string, action: string) => {
  action === "set"
    ? (addItem.value.subsidiaryEmail = email)
    : (addItem.value.subsidiaryEmail = "");
};

const loadRenovation = async () => {
  try {
    await setItems({
      searchParam: "Application for Renovation/Addition & Alteration Works",
      pageParam: 1,
      limitParam: 100,
      filterStatus: "Approved",
      site: currentUser.value.site,
      createdBy: currentUser.value._id,
    });

    renovationItems.value = items.value;
  } catch (error) {
    console.error("Failed to load", error);
  }
};

//Computed

const unitNumber = computed(() => {
  const { blockName, levelName, unitName } = currentUser.value;
  return `${blockName} / ${levelName} / ${unitName}`;
});
const userFullname = computed(() => {
  return `${currentUser.value.surname}, ${currentUser.value.givenName}`;
});

const computedDate = computed({
  get: () => (addItem.value.date ? new Date(addItem.value.date) : null),
  set: (value) => (addItem.value.date = value ? value.toISOString() : ""),
});

const dateFrom = computed({
  get: () => (addItem.value.dateFrom ? new Date(addItem.value.dateFrom) : null),
  set: (value) => (addItem.value.dateFrom = value ? value.toISOString() : ""),
});

const dateTo = computed({
  get: () => (addItem.value.dateTo ? new Date(addItem.value.dateTo) : null),
  set: (value) => (addItem.value.dateTo = value ? value.toISOString() : ""),
});

const signedDate = computed({
  get: () =>
    addItem.value.signedDate ? new Date(addItem.value.signedDate) : null,
  set: (value) => (addItem.value.signedDate = value ? value.toISOString() : ""),
});

const computeInputColor = computed(() => {
  return theme.value === "dark"
    ? { background: "#343a45" }
    : { background: "#EBEBE4" };
});

const stepperComputedStyle = computed(() => {
  return theme.value === "dark"
    ? { background: "#111723" }
    : { background: "#EBEBE4" };
});

const viewForm = (addItem: TLOUI, action: string, formType: string) => {
  let id: string = "";

  formType === "renovation"
    ? (id = addItem.renovationId as string)
    : (id = addItem.refundId as string);

  useRouter().push({
    path: `/online-forms/${formType}-form`,
    query: { id, action },
  });
};

const nextStep = (addItem: TLOUI, action: string) => {
  const { _id: id } = addItem;
  useRouter().push({
    path: "/online-forms/renovation-refund-form",
    query: { id, action },
  });
};
</script>

<style scoped>
.custom-input-class {
  border: 1px solid #343a45;
  padding: 12px 12px 17px 12px;
  border-radius: 4px;
}
.border-bottom {
  border-bottom: 1px solid #b9b8c033;
  padding-bottom: 25px;
}
.stepper-custom-class {
  margin-top: 20px;
  list-style: none;
  border: 1px solid #b9b8c0;
}
.stepper-attachment {
  border: none !important;
}
.stepper-custom-class li {
  padding: 20px;
}
.stepper-custom-class li:not(:last-child) {
  border-bottom: 1px solid #b9b8c0;
}
.stepper-attachment li:not(:last-child) {
  margin-bottom: 5px;
  border-bottom: none !important;
}
.stepper-number {
  background: #555e6f;
  width: fit-content;
  padding: 4px 11px;
  border-radius: 100%;
  margin-left: 7px;
}
</style>
