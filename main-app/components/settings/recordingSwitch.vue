<template>
  <v-card class="pa-2" :loading="isAnprLoading">
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="primary"
        height=""
        indeterminate
      ></v-progress-linear>
    </template>
    <v-card-title class="font-weight-bold text-body-1">
      Recording
    </v-card-title>
    <v-divider class="pb-6"></v-divider>
    <v-row no-gutters justify="space-evenly">
      <v-col cols="12">
        <v-list>
          <v-list-item>
            <v-switch
              color="blue"
              v-model="siteSetting.virtualPatrolSettings.isRecordingEnabled"
              :label="
                siteSetting.virtualPatrolSettings.isRecordingEnabled
                  ? 'Enabled'
                  : 'Disabled'
              "
              class="ml-3"
              @change="onUpdateSiteSettings()"
            ></v-switch>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-card>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const { setSnackbar } = useLocal();
const { siteSetting, getSiteSettingsById, updateSiteSettingsById } =
  useSiteSettings();
const { getSitesOptionsForFiltering, mySite } = useFilter();

const isAnprLoading = ref(false);
onMounted(async () => {
  await getSitesOptionsForFiltering();
  await getSiteSettingsById(mySite.value);
});

async function onUpdateSiteSettings() {
  isAnprLoading.value = true;
  await updateSiteSettingsById(siteSetting.value._id || "", siteSetting.value);
  setSnackbar({
    text: "Site Settings updated",
    modal: true,
  });
  isAnprLoading.value = false;
}
</script>
<style scoped>
:deep() .v-switch .v-label {
  font-size: 12px;
}
</style>
