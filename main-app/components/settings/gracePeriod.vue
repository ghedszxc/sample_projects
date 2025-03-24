<template>
  <v-card class="pa-2" :loading="isAnprLoading">
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="primary"
        height="4"
        indeterminate
      ></v-progress-linear>
    </template>
    <v-card-title class="font-weight-bold text-body-1">
      Patrol Grace Period
    </v-card-title>
    <v-divider class="mb-2"></v-divider>
    <v-row no-gutters justify="space-evenly">
      <v-col cols="12">
        <v-list>
          <v-list-item>
            <v-text-field
              v-if="isEditing"
              v-model="siteSetting.virtualPatrolGracePeriod"
              class="pb-2"
              density="compact"
              placeholder="Enter Grace Period interval in Minutes"
              clearable
              hide-details
              :disabled="isAnprLoading"
            >
              <template v-slot:prepend-inner>
                <v-icon color="blue-darken-3" class="mr-4">mdi-timer</v-icon>
              </template>
            </v-text-field>
            <div v-else>
              <v-icon class="mr-4">mdi-timer</v-icon>
              {{
                !siteSetting.virtualPatrolGracePeriod
                  ? "Grace Period not set"
                  : `${siteSetting.virtualPatrolGracePeriod} minutes`
              }}
            </div>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-card-actions class="d-flex justify-end">
      <v-btn
        v-if="isEditing"
        color="blue-darken-3"
        size="small"
        variant="flat"
        @click="onUpdateSiteSettings()"
        >Save</v-btn
      >
      <v-btn
        v-if="!isEditing"
        color="blue-darken-3"
        size="small"
        variant="flat"
        @click="onEditSiteSettings()"
        >Edit</v-btn
      >
    </v-card-actions>
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

const isEditing = ref(false);
const isAnprLoading = ref(false);
onMounted(async () => {
  await getSitesOptionsForFiltering();
  await getSiteSettingsById(mySite.value);
});

async function onUpdateSiteSettings() {
  isAnprLoading.value = true;

  await updateSiteSettingsById(siteSetting.value._id || "", siteSetting.value);
  isEditing.value = false;
  isAnprLoading.value = false;
}

async function onEditSiteSettings() {
  isEditing.value = true;
  setTimeout(() => {
    isAnprLoading.value = false;
  }, 3000);
}
</script>
<style scoped>
:deep() .v-switch .v-label {
  font-size: 12px;
}
</style>
