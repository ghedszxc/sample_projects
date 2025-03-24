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
      ANPR Settings
    </v-card-title>
    <v-divider class="mb-2"></v-divider>
    <v-row no-gutters justify="space-evenly">
      <v-col cols="12">
        <v-list>
          <v-list-item>
            <v-text-field
              v-if="isEditing"
              v-model="siteSetting.anpr.api"
              class="pa-2"
              density="compact"
              placeholder="Enter DAHUA API url"
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
                siteSetting.anpr?.api === null || siteSetting.anpr?.api == ""
                  ? "DAHUA API not set"
                  : siteSetting.anpr?.api
              }}
            </div>
          </v-list-item>

          <v-list-item>
            <v-text-field
              v-if="isEditing"
              v-model="siteSetting.anpr.username"
              class="pa-2"
              density="compact"
              placeholder="Enter DAHUA Username"
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
                siteSetting.anpr?.username === null ||
                siteSetting.anpr?.username == ""
                  ? "DAHUA Username not set"
                  : siteSetting.anpr?.username
              }}
            </div>
          </v-list-item>

          <v-list-item>
            <v-text-field
              v-if="isEditing"
              v-model="siteSetting.anpr.password"
              class="pa-2"
              density="compact"
              placeholder="Enter DAHUA Password"
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
                siteSetting.anpr?.password === null ||
                siteSetting.anpr?.password == ""
                  ? "DAHUA Password not set"
                  : siteSetting.anpr?.password
              }}
            </div>
          </v-list-item>

          <v-list-item>
            <v-text-field
              v-if="isEditing"
              v-model="siteSetting.anpr.channel"
              class="pa-2"
              density="compact"
              placeholder="Enter DAHUA Channel Number"
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
                <v-icon color="blue-darken-3" class="mr-4">mdi-cctv</v-icon>
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
              <v-icon class="mr-4">mdi-cctv</v-icon>
              {{
                siteSetting.anpr?.channel === null
                  ? "DAHUA Channel not set"
                  : siteSetting.anpr?.channel
              }}
            </div>
          </v-list-item>

          <!-- <template
            v-for="(item, idx) in siteSetting.deliveryCompanyList"
            :key="idx"
          >
            <v-list-item>
              <v-text-field
                v-model="editDelivery"
                class="pb-2"
                density="compact"
                placeholder="Enter delivery company name"
                clearable
                hide-details
                :loading="isDeliveryLoading"
                :disabled="isDeliveryLoading"
                @keyup.enter="onUpdateSiteSettings('edit')"
                @click:clear="resetValues()"
              >
                <template v-slot:prepend-inner>
                  <v-icon color="orange-darken-3" class="mr-4"
                    >mdi-truck-alert</v-icon
                  >
                </template>

                <template v-slot:append-inner>
                  <v-btn
                    icon
                    class="mr-2"
                    size="small"
                    density="compact"
                    type="submit"
                    color="success"
                    :loading="isDeliveryLoading"
                    :disabled="!Boolean(editDelivery)"
                    @click="onUpdatePickUpDropOff('edit')"
                  >
                    <v-icon size="small">mdi-check</v-icon>
                  </v-btn>
                </template>
              </v-text-field>

              <template v-slot:append v-if="deliveryIndex != idx">
                <v-menu open-on-hover location="left">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-dots-vertical"
                      size="x-small"
                      variant="flat"
                    >
                    </v-btn>
                  </template>

                  <div class="d-flex">
                    <v-btn
                      icon
                      class="mr-2"
                      density="compact"
                      color="primary"
                      :loading="isDeliveryLoading"
                      :disabled="isDeliveryLoading"
                      @click="
                        onSelectPickupDropOffToBeUpdate(item, idx, 'edit')
                      "
                    >
                      <v-icon size="small">mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn
                      icon
                      class="mr-2"
                      density="compact"
                      color="red"
                      :loading="isDeliveryLoading"
                      :disabled="isDeliveryLoading"
                      @click="onDeleteSiteSetting(idx)"
                    >
                      <v-icon size="small">mdi-delete-forever</v-icon>
                    </v-btn>
                  </div>
                </v-menu>
              </template>
            </v-list-item>
            <v-divider></v-divider>
          </template> -->
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
