<template>
  <v-row no-gutters justify="center">
    <v-col cols="12" sm="4" md="4" lg="3" xl="3">
      <v-row no-gutters>
        <v-col cols="12" class="mt-4 font-weight-bold text-h5">
          Visitor & Contractor Notification Interval
        </v-col>

        <v-col cols="12" class="text-end">
          <v-icon
            @click="isChecked = !isChecked"
            :color="isChecked ? 'green' : ''"
          >
            {{ isChecked ? "mdi-check-circle" : "mdi-check-circle-outline" }}
          </v-icon>
          <div @click="alertUser">
            <v-text-field
              class="pt-2"
              :disabled="!isChecked"
              label="Interval Minutes"
              type="number"
              @keypress="isNumber"
              v-model="visitorContractorIntervalMinutes"
            ></v-text-field>
          </div>

          <v-snackbar v-model="showSnackbar" color="#E0241C">
            Please enable the checkbox first.
          </v-snackbar>
        </v-col>

        <v-col cols="12" class="mt-4 text-end">
          <v-btn
            flat
            rounded="lg"
            color="#1867C0"
            class="px-6"
            @click="updateVisitorContractorIntervalNotification"
            :loading="isUpdatingVisitorContractorInterval"
          >
            Update
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
const { setSnackbar } = useLocal();
const showSnackbar = ref(false);
const isChecked = ref<boolean>(false);
const visitorContractorIntervalMinutes = ref<number>();
const isUpdatingVisitorContractorInterval = ref<boolean>(false);
const { siteSetting, getSiteSettingsById, updateSiteSettingsById } =
  useSiteSettings();
const { mySite } = useFilter();
const alertUser = () => {
  if (!isChecked.value) {
    showSnackbar.value = true;
  }
};

onMounted(async () => {
  await getSiteSettingsById(mySite.value);
  if (siteSetting.value.visitorContractorNotificationInterval) {
    visitorContractorIntervalMinutes.value =
      siteSetting.value.visitorContractorNotificationInterval.value;
    isChecked.value =
      siteSetting.value.visitorContractorNotificationInterval.isEnabled;
  }
});

const isNumber = (evt) => {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    evt.preventDefault();
  } else {
    return true;
  }
};

async function updateVisitorContractorIntervalNotification() {
  isUpdatingVisitorContractorInterval.value = true;

  try {
    await updateSiteSettingsById(mySite.value, {
      ...siteSetting.value,
      visitorContractorNotificationInterval: {
        isEnabled: isChecked.value,
        value: visitorContractorIntervalMinutes.value!,
      },
    });

    setSnackbar({
      text: "Notification interval for Visitors & Contractors has been successfully updated!",
      modal: true,
    });
  } catch (error: any) {
    console.log("error", error);

    setSnackbar({
      text: error.message,
      modal: true,
      type: "error",
    });
  }
  isUpdatingVisitorContractorInterval.value = false;
}
</script>
