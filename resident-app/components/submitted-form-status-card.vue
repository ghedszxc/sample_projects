<template>
  <div
    v-for="item in data"
    :key="item._id"
    class="border rounded-lg my-2"
    :style="computeInputColor"
  >
    <v-row class="d-flex flex-column gap-10" style="padding: 30px">
      <row class="d-flex align-center justify-space-between">
        <v-col cols="2" style="padding-left: 0">
          <v-img
            src="/icons/resident/home/form-list-icon.svg"
            style="width: 70%"
          />
        </v-col>
        <v-col cols="10">
          <p>
            {{
              formatDateAndTimeORIG(String(item.date || item.createdAt), true)
            }}
          </p>
        </v-col>
      </row>

      <p style="font-size: 20px; margin: 30px 0 20px 0">
        {{ item.typeOfForm }}
      </p>

      <v-row align="center">
        <v-col>
          <button
            class="btn"
            :class="getStatusClass(item.status || '')"
            style="width: 100%"
          >
            {{ item.status }}
          </button>
        </v-col>
        <v-col v-if="item.status === 'Approved'" cols="2">
          <v-btn
            icon="mdi mdi-download"
            density="comfortable"
            variant="outlined"
            :loading="isDownloadingPdf[item._id || '']"
            @click="onDownloadPdf(item)"
        /></v-col>
        <v-col v-if="item.status === 'Resubmission'" cols="2">
          <v-btn
            icon="mdi-pencil"
            density="comfortable"
            variant="outlined"
            @click="onFormAction(item, 'edit')"
        /></v-col>
        <v-col v-if="item.status?.includes('Pending')" cols="2">
          <v-btn
            icon="mdi-eye"
            density="comfortable"
            variant="outlined"
            @click="onFormAction(item, 'view')"
        /></v-col>

        <v-col
          v-if="
            item.status === 'Approved' &&
            (item.typeOfForm ===
              'Application for Renovation/Addition & Alteration Works' ||
              item.typeOfForm === 'Letter of Undertaking & Indemnity' ||
              'Refund of Deposit')
          "
          cols="2"
        >
          <v-btn
            icon="mdi-eye"
            density="comfortable"
            variant="outlined"
            @click="onFormAction(item, 'view')"
        /></v-col>
      </v-row>

      <!-- RENOVATION -->
      <div
        v-if="
          item.status === 'Approved' &&
          item.typeOfForm ===
            'Application for Renovation/Addition & Alteration Works' &&
          !item.louiId
        "
        class="mt-6"
      >
        <p>Next Required Step</p>
        <button
          class="btn mt-5"
          :class="getStatusClass(item.status || '')"
          style="width: 100%; background: #eb261e; border: #eb261e"
          @click="nextStep(item, 'stepper')"
        >
          Letter of undertaking & indemnity Form
        </button>
      </div>

      <!-- LOUI -->
      <div
        v-if="
          item.status === 'Approved' &&
          item.typeOfForm === 'Letter of Undertaking & Indemnity' &&
          !item.refundId
        "
        class="mt-6"
      >
        <p>Next Required Step</p>
        <button
          class="btn mt-5"
          :class="getStatusClass(item.status || '')"
          style="width: 100%; background: #eb261e; border: #eb261e"
          @click="nextStep(item, 'stepper')"
        >
          Refund Form
        </button>
      </div>
    </v-row>
  </div>
  <v-pagination :length="pages" @update:model-value="onSelectPage" />
</template>

<script setup lang="ts">
const { formatDateAndTimeORIG } = useUtils();
const { downloadDobPdf, page, pages } = useForms();
const { currentUser } = useLocalAuth();
const { theme } = useLocal();

const emit = defineEmits(["onSelectPage"]);
defineProps({
  data: {
    type: Array as PropType<TForms[]>,
    default: () => [],
  },
});

const isDownloadingPdf = ref<Record<string, boolean>>({});

const getStatusClass = computed(() => {
  return (status: string) => {
    switch (status) {
      case "Pending for Signature":
        return "pending-class";
      case "Pending":
        return "pending-class";
      case "Approved":
        return "approved-class";
      case "Resubmission":
        return "resubmission-class";
      case "Rejected":
        return "rejected-class";
      default:
        return "";
    }
  };
});

const computeInputColor = computed(() => {
  return theme.value === "dark"
    ? { background: "#0F131C" }
    : { background: "#FFFFFF" };
});

const onSelectPage = (val: number) => {
  page.value = val;
  emit("onSelectPage", val);
};

const onDownloadPdf = async (item: TForms) => {
  const { _id, typeOfForm } = item;
  const id = _id as string;
  let currentUrl = "";
  try {
    isDownloadingPdf.value[id] = true;
    if (typeOfForm === "Pet Records Form") {
      currentUrl = `/forms/${id}/download/pet-record?site=${currentUser.value.site}`;
    } else if (
      typeOfForm === "Application for Renovation/Addition & Alteration Works"
    ) {
      currentUrl = `/forms/${id}/download/renovation?site=${currentUser.value.site}`;
    } else if (typeOfForm === "Letter of Undertaking & Indemnity") {
      currentUrl = `/forms/${id}/download/loui?site=${currentUser.value.site}`;
    } else if (typeOfForm === "Refund of Deposit") {
      currentUrl = `/forms/${id}/download/renovation-refund?site=${currentUser.value.site}`;
    } else if (typeOfForm === "Application for Moving In/Out & Delivery") {
      currentUrl = `/forms/${id}/download/miod-record?site=${currentUser.value.site}`;
    } else if (typeOfForm === "Application for Electronic Access Card") {
      currentUrl = `/forms/${id}/download/electronic-access-card?site=${currentUser.value.site}`;
    } else if (typeOfForm === "Application for Bicycle Parking") {
      currentUrl = `/forms/${id}/download/bicycle-parking?site=${currentUser.value.site}`;
    } else if (typeOfForm === "Vehicle Registration Form") {
      currentUrl = `/forms/${id}/download/vehicle-registration?site=${currentUser.value.site}`;
    }
    await downloadDobPdf(currentUrl, typeOfForm);
  } finally {
    isDownloadingPdf.value[id] = false;
  }
};

const onFormAction = (item: TForms, action: string) => {
  const { _id: id, typeOfForm } = item;

  if (typeOfForm === "Pet Records Form") {
    useRouter().push({
      path: "/online-forms/pet-record-form",
      query: { id, action },
    });
  } else if (
    typeOfForm === "Application for Renovation/Addition & Alteration Works"
  ) {
    // const iStepper = status === 'Approved' ? 'true' : 'false'
    useRouter().push({
      path: "/online-forms/renovation-form",
      query: { id, action },
    });
  } else if (typeOfForm === "Letter of Undertaking & Indemnity") {
    useRouter().push({
      path: "/online-forms/loui-form",
      query: { id, action },
    });
  } else if (typeOfForm === "Refund of Deposit") {
    useRouter().push({
      path: "/online-forms/renovation-refund-form",
      query: { id, action },
    });
  } else if (typeOfForm === "Application for Moving In/Out & Delivery") {
    useRouter().push({
      path: "/online-forms/moving-in-out-form",
      query: { id, action },
    });
  } else if (typeOfForm === "Application for Electronic Access Card") {
    useRouter().push({
      path: "/online-forms/electronic-access-form",
      query: { id, action },
    });
  } else if (typeOfForm === "Application for Bicycle Parking") {
    useRouter().push({
      path: "/online-forms/bicycle-parking-form",
      query: { id, action },
    });
  } else if (typeOfForm === "Vehicle Registration Form") {
    useRouter().push({
      path: "/online-forms/vehicle-registration-form",
      query: { id, action },
    });
  }
};

const nextStep = (item: TForms, action: string) => {
  const { _id: id, typeOfForm } = item;

  if (typeOfForm === "Application for Renovation/Addition & Alteration Works") {
    useRouter().push({
      path: "/online-forms/loui-form",
      query: { id, action },
    });
  } else if (typeOfForm === "Letter of Undertaking & Indemnity") {
    useRouter().push({
      path: "/online-forms/renovation-refund-form",
      query: { id, action },
    });
  }
};
</script>

<style>
.custom-card {
  border-radius: 16px !important;
  border: 1px solid #343a45;
  background: #111723;
}

.btn {
  padding: 10px 5px;
  border-radius: 24px;
}

.pending-class {
  background-color: #fb8c00;
  border: 1px solid #fb8c00;
}

.approved-class {
  background-color: #4caf50;
  border: 1px solid #4caf50;
}

.resubmission-class {
  background-color: #2196f3;
  border: 1px solid #2196f3;
}

.rejected-class {
  background-color: #f34f21;
  border: 1px solid #f34f21;
}
</style>
