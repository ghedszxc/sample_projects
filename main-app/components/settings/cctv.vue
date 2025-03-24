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
      CCTV Settings
    </v-card-title>
    <v-divider class="mb-2"></v-divider>
    <v-row no-gutters justify="space-evenly">
      <v-col cols="12">
        <v-list>
          <v-list-item>
            <v-text-field
              v-if="isEditing"
              v-model="siteSetting.cctv.url"
              class="pa-2"
              density="compact"
              placeholder="Enter CCTV Base API url"
              clearable
              hide-details
              :disabled="isAnprLoading"
              :style="
                $vuetify.theme.current.dark
                  ? 'background-color: #212529'
                  : 'background-color: #f8f9fa'
              "
            >
              <template v-slot:prepend-inner>
                <v-icon color="blue-darken-3" class="mr-4">mdi-api</v-icon>
              </template>
            </v-text-field>
            <div
              v-else
              :style="
                $vuetify.theme.current.dark
                  ? 'background-color: #212529'
                  : 'background-color: #f8f9fa'
              "
              class="pa-2"
            >
              <v-icon class="mr-4">mdi-api</v-icon>
              {{
                siteSetting.cctv.url === null || siteSetting.cctv.url == ""
                  ? "CCTV base IP not set"
                  : siteSetting.cctv.url
              }}
            </div>
          </v-list-item>

          <v-list-item>
            <v-text-field
              v-if="isEditing"
              v-model="siteSetting.cctv.username"
              class="pa-2"
              density="compact"
              placeholder="Enter CCTV Username"
              clearable
              hide-details
              :disabled="isAnprLoading"
              :style="
                $vuetify.theme.current.dark
                  ? 'background-color: #212529'
                  : 'background-color: #f8f9fa'
              "
            >
              <template v-slot:prepend-inner>
                <v-icon color="blue-darken-3" class="mr-4">mdi-account</v-icon>
              </template>
            </v-text-field>
            <div
              v-else
              :style="
                $vuetify.theme.current.dark
                  ? 'background-color: #212529'
                  : 'background-color: #f8f9fa'
              "
              class="pa-2"
            >
              <v-icon class="mr-4">mdi-account</v-icon>
              {{
                siteSetting.cctv.username === null ||
                siteSetting.cctv.username == ""
                  ? "CCTV Username not set"
                  : siteSetting.cctv.username
              }}
            </div>
          </v-list-item>

          <v-list-item>
            <v-text-field
              v-if="isEditing"
              v-model="siteSetting.cctv.password"
              class="pa-2"
              density="compact"
              placeholder="Enter CCTV Password"
              clearable
              hide-details
              :disabled="isAnprLoading"
              :style="
                $vuetify.theme.current.dark
                  ? 'background-color: #212529'
                  : 'background-color: #f8f9fa'
              "
            >
              <template v-slot:prepend-inner>
                <v-icon color="blue-darken-3" class="mr-4">mdi-lock</v-icon>
              </template>
            </v-text-field>
            <div
              v-else
              :style="
                $vuetify.theme.current.dark
                  ? 'background-color: #212529'
                  : 'background-color: #f8f9fa'
              "
              class="pa-2"
            >
              <v-icon class="mr-4">mdi-lock</v-icon>
              {{
                siteSetting.cctv.password === null ||
                siteSetting.cctv.password == ""
                  ? "CCTV Password not set"
                  : siteSetting.cctv.password
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
      <v-btn color="green-darken-3" size="small" variant="flat"
        >Test Connection</v-btn
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
