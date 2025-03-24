<template>
  <!-- Back Navigation -->
  <v-form
    v-model="isValid"
    class="w-100 d-flex flex-column ga-10"
    @submit.prevent="submit()"
  >
    <!-- Dropdown and Calendar Section -->
    <section class="d-flex flex-column ga-5">
      <v-text-field
        v-model="addItem.management"
        :rules="[requiredInput]"
        label="Management *"
        class="custom-input-class"
        density="compact"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

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
    </section>

    <!-- Pets Info Section -->
    <section class="d-flex flex-column ga-5">
      <h5 style="font-size: 20px">Name of Pet/s</h5>

      <v-text-field
        v-model="addItem.nameOfPet"
        :rules="[requiredInput]"
        label="Name *"
        placeholder="Enter name of pet/s"
        class="custom-input-class"
        density="compact"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.typeOfPet"
        label="Type of Pet/s *"
        placeholder="Enter type of pet/s"
        class="custom-input-class"
        density="compact"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.breed"
        label="Breed (if applicable)"
        placeholder="Enter breed of pet/s"
        class="custom-input-class"
        density="compact"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <v-text-field
        v-model="addItem.licenseNumber"
        label="License No.: (if applicable)"
        placeholder="Enter license no."
        density="compact"
        variant="plain"
        class="custom-input-class"
        :clearable="!isFormView"
        :disabled="isFormView"
        hide-details
      />
    </section>

    <!-- Owner's Particulars -->
    <section class="d-flex flex-column ga-5">
      <h5 style="font-size: 20px">Owner's Particulars</h5>

      <v-text-field
        v-model="addItem.nameOfOwner"
        :rules="[requiredInput]"
        label="Name *"
        class="custom-input-class disabled-input"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

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

      <v-text-field
        v-model="addItem.contactNumber"
        :rules="[requiredInput]"
        label="Contact Number *"
        class="custom-input-class disabled-input"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.email"
        :rules="[requiredInput]"
        label="Email *"
        class="custom-input-class disabled-input"
        :style="computeInputColor"
        hide-details
        variant="plain"
        disabled
      />

      <v-text-field
        v-model="addItem.correspondenceAddress"
        label="Correspondence Address *"
        class="custom-input-class"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />
    </section>

    <!-- Checkbox -->
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
        />
        <span v-else>
          I / We agree to provide my personal information as indicated and
          understand that it is solely to be used by the Management for
          management purposes only. The personal data shall not be used for
          other purposes.
        </span>
      </p>
    </section>

    <!-- Declaration from Subsidiary -->
    <section class="d-flex flex-column ga-5">
      <div>
        <h5 style="font-size: 20px; margin-bottom: 15px">
          Declaration from Subsidiary <br />
          Proprietor / Tenant:
        </h5>
        <p :class="configForm && configForm.secondLabel ? 'ml-5' : ''">
          <span
            v-if="
              configForm &&
              configForm.secondLabel &&
              configForm.secondLabel.trim() !== `<p></p>`.trim()
            "
            v-html="configForm.secondLabel"
          />

          <span v-else>
            I declare that I am residing at (Site Property) and that all the
            above particulars given by me are true and correct.
          </span>
        </p>
      </div>

      <v-text-field
        v-model="addItem.management"
        :rules="[requiredInput]"
        label="Site Property *"
        placeholder="Select Site Property"
        class="custom-input-class"
        density="compact"
        hide-details
        variant="plain"
        :clearable="!isFormView"
        :disabled="isFormView"
      />

      <!-- <v-file-input
        :rules="[requiredInput]"
        label="Attach Files (Optional)"
        placeholder="Select File"
        class="custom-input-class"
        density="compact"
        hide-details
        variant="plain"
        prepend-icon=""
        append-icon=""
        :clearable="!isFormView"
        :disabled="isFormView"
      /> -->

      <Carousel
        v-if="fileString && fileString.length > 0"
        :urls="fileString.map((e: any) => e.url)"
      />

      <!-- <v-file-input
        v-model="files"
        label="Attach Files (Optional)"
        placeholder="Select File"
        class="custom-input-class"
        density="compact"
        hide-details
        variant="plain"
        prepend-icon=""
        append-icon=""
        :clearable="!isFormView"
        :disabled="isFormView"
        accept="image/*"
        show-size
        chips
        multiple
        @change="onFileSelect()"
      /> -->

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
const { item, isValid, isAdding, getItemById } = usePetRecords();
const { currentUser } = useLocalAuth();
const { requiredInput } = useUtils();
const { configForm, getSelectedFormById } = useSiteSettings();
const route = useRoute();
const config = useRuntimeConfig();
const isLoadingUpload = ref<boolean>(false);
const { setSnackbar, theme } = useLocal();

const files = ref<File[]>([]);
const fileString = ref<Record<string, any>>([]);
type TFile = {
  name: string;
  data: File;
  progress: number;
  id?: string;
};
const uploadedAttachments = ref<TFile[]>([]);
const uploadProgress = ref(0);
const isSignatoryEmail = ref(false);

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (event: "onSubmit", payload: TPetRecords, queryAction: string): void;
}>();

const addItem = ref(item.value);
const isFormEdit = ref(false);
const isFormView = ref(false);
const queryAction = ref("");

const baseColor = computed(() => (theme.value === "dark" ? "red" : "red"));
const bgColor = computed(() =>
  theme.value === "dark" ? "#111723" : "#FAFAFAFA",
);

const correspondenceAddress = computed(() => {
  const { address } = currentUser.value;
  return address.city && address.country && address.postalCode
    ? `${address.city}, ${address.country}, ${address.postalCode}`
    : "";
});
const unitNumber = computed(() => {
  const { blockName, levelName, unitName } = currentUser.value;
  return `${blockName} / ${levelName} / ${unitName}`;
});
const userFullname = computed(() => {
  return `${currentUser.value.surname}, ${currentUser.value.givenName}`;
});

onMounted(async () => {
  addItem.value.management = currentUser.value.siteName; // editable
  addItem.value.date = new Date(); // editable
  // Owner's Particulars
  addItem.value.nameOfOwner = userFullname.value;
  addItem.value.unitId = currentUser.value.unitNumber; // ObjectId
  addItem.value.unitNumber = unitNumber.value;
  addItem.value.residentType = currentUser.value.residentType;
  addItem.value.contactNumber = currentUser.value.primaryPhone;
  addItem.value.email = currentUser.value.email;
  addItem.value.correspondenceAddress = correspondenceAddress.value;
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

const onSign = (signature: string) => {
  addItem.value.signature = signature;
  addItem.value.signedDate = new Date();
};

const signatoryEmail = (email: string, action: string) => {
  action === "set"
    ? (addItem.value.signatoryEmail = email)
    : (addItem.value.signatoryEmail = "");
};

const submit = () => {
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

const signedDateModel = computed({
  get: () =>
    addItem.value.signedDate ? new Date(addItem.value.signedDate) : null,
  set: (value) => (addItem.value.signedDate = value ? value.toISOString() : ""),
});

const computeInputColor = computed(() => {
  return theme.value === "dark"
    ? { background: "#343a45" }
    : { background: "#EBEBE4" };
});

// upload attachments
const onFileSelect = async () => {
  fileString.value = files.value.map((file: any) => ({
    name: file.name,
    data: file,
    progress: 0,
    url: URL.createObjectURL(file),
  }));

  for (let i = 0; i < fileString.value.length; i++) {
    const formData = new FormData();

    try {
      formData.append("file", fileString.value[i].data);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/files/upload?status=draft");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          fileString.value[i].progress = Math.round(
            (event.loaded / event.total) * 100,
          );
          uploadProgress.value = fileString.value[i].progress;
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          fileString.value[i].id = response.id;
          addItem.value.attachments &&
            addItem.value.attachments.push(response.id);
        }
      };

      xhr.send(formData);
    } catch (e) {
      console.log("Error occurred while attaching images.", e);
    }
  }
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
</style>
