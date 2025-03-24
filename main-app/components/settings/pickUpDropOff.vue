<template>
  <v-card class="pa-2">
    <v-card-title class="font-weight-bold text-body-1">
      Pick-Up/Drop-Off Companies
    </v-card-title>
    <v-divider class="mb-2"></v-divider>
    <v-row no-gutters justify="space-evenly">
      <v-col
        cols="12"
        v-if="
          siteSetting.pickUpdropOffCompanyList &&
          siteSetting.pickUpdropOffCompanyList.length > 0
        "
      >
        <v-list style="max-height: 400px; overflow-y: auto">
          <v-list-item>
            <v-text-field
              v-model="pickUpDropOff"
              class="pb-2"
              density="compact"
              placeholder="Enter pick-up/drop-off company name"
              clearable
              hide-details
              :loading="isPickUpDropOffLoading"
              :disabled="isPickUpDropOffLoading"
              @keyup.enter="onUpdateSiteSettings('add')"
              @click:clear="resetValues()"
            >
              <template v-slot:prepend-inner>
                <v-icon color="blue-darken-3" class="mr-4">mdi-moped</v-icon>
              </template>

              <template v-slot:append-inner>
                <v-btn
                  icon
                  class="mr-2"
                  size="small"
                  density="compact"
                  type="submit"
                  color="success"
                  :loading="isPickUpDropOffLoading"
                  :disabled="!Boolean(pickUpDropOff)"
                  @click="onUpdatePickUpDropOff('add')"
                >
                  <v-icon size="small">mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-list-item>
          <v-divider></v-divider>

          <template
            v-for="(item, idx) in siteSetting.pickUpdropOffCompanyList"
            :key="idx"
          >
            <v-list-item>
              <v-text-field
                v-if="isEditPickUpDropOff && pickUpDropOffIndex == idx"
                v-model="editPickUpDropOff"
                class="pb-2"
                density="compact"
                placeholder="Enter pick-up/drop-off company name"
                clearable
                hide-details
                :loading="isPickUpDropOffLoading"
                :disabled="isPickUpDropOffLoading"
                @keyup.enter="onUpdateSiteSettings('edit')"
                @click:clear="resetValues()"
              >
                <template v-slot:prepend-inner>
                  <v-icon color="orange-darken-3" class="mr-4"
                    >mdi-moped</v-icon
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
                    :loading="isPickUpDropOffLoading"
                    :disabled="!Boolean(editPickUpDropOff)"
                    @click="onUpdatePickUpDropOff('edit')"
                  >
                    <v-icon size="small">mdi-check</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
              <div v-else>
                <v-icon class="mr-4">mdi-moped</v-icon>
                {{ item }}
              </div>

              <template v-slot:append v-if="pickUpDropOffIndex != idx">
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
                      :loading="isPickUpDropOffLoading"
                      :disabled="isPickUpDropOffLoading"
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
                      :loading="isPickUpDropOffLoading"
                      :disabled="isPickUpDropOffLoading"
                      @click="onDeleteSiteSetting(idx)"
                    >
                      <v-icon size="small">mdi-delete-forever</v-icon>
                    </v-btn>
                  </div>
                </v-menu>
              </template>
            </v-list-item>
            <v-divider></v-divider>
          </template>
        </v-list>
      </v-col>

      <v-col cols="12" v-else>
        <v-list>
          <v-list-item>
            <v-text-field
              v-model="pickUpDropOff"
              class="pb-2"
              density="compact"
              placeholder="Enter pick-up/drop-off company name"
              clearable
              hide-details
              :loading="isPickUpDropOffLoading"
              :disabled="isPickUpDropOffLoading"
              @keyup.enter="onUpdateSiteSettings('add')"
              @click:clear="resetValues()"
            >
              <template v-slot:prepend-inner>
                <v-icon color="blue-darken-3" class="mr-4">mdi-moped</v-icon>
              </template>

              <template v-slot:append-inner>
                <v-btn
                  icon
                  class="mr-2"
                  size="small"
                  density="compact"
                  type="submit"
                  color="success"
                  :loading="isPickUpDropOffLoading"
                  :disabled="!Boolean(pickUpDropOff)"
                  @click="onUpdatePickUpDropOff('add')"
                >
                  <v-icon size="small">mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-list-item>
          <v-divider></v-divider>

          <template
            v-for="(item, idx) in siteSetting.pickUpdropOffCompanyList"
            :key="idx"
          >
            <v-list-item>
              <v-text-field
                v-if="isEditPickUpDropOff && pickUpDropOffIndex == idx"
                v-model="editPickUpDropOff"
                class="pb-2"
                density="compact"
                placeholder="Enter pick-up/drop-off company name"
                clearable
                hide-details
                :loading="isPickUpDropOffLoading"
                :disabled="isPickUpDropOffLoading"
                @keyup.enter="onUpdateSiteSettings('edit')"
                @click:clear="resetValues()"
              >
                <template v-slot:prepend-inner>
                  <v-icon color="orange-darken-3" class="mr-4"
                    >mdi-moped</v-icon
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
                    :loading="isPickUpDropOffLoading"
                    :disabled="!Boolean(editPickUpDropOff)"
                    @click="onUpdatePickUpDropOff('edit')"
                  >
                    <v-icon size="small">mdi-check</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
              <div v-else>
                <v-icon class="mr-4">mdi-moped</v-icon>
                {{ item }}
              </div>

              <template v-slot:append v-if="pickUpDropOffIndex != idx">
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
                      :loading="isPickUpDropOffLoading"
                      :disabled="isPickUpDropOffLoading"
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
                      :loading="isPickUpDropOffLoading"
                      :disabled="isPickUpDropOffLoading"
                      @click="onDeleteSiteSetting(idx)"
                    >
                      <v-icon size="small">mdi-delete-forever</v-icon>
                    </v-btn>
                  </div>
                </v-menu>
              </template>
            </v-list-item>
            <v-divider></v-divider>
          </template>
        </v-list>
        <v-row no-gutters justify="center" class="pa-16">
          <v-col cols="12">
            <v-row no-gutters justify="center">
              <v-img src="/empty.svg" width="100px" height="100px"></v-img>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-row no-gutters justify="center">
              <span class="font-weight-bold">
                No Pick-up/Drop-off Company
              </span>
            </v-row>
          </v-col>
        </v-row>
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

const pickUpDropOff = ref("");
const editPickUpDropOff = ref("");
const pickUpDropOffIndex = ref(NaN);
const isEditPickUpDropOff = ref(false);
const isPickUpDropOffLoading = ref(false);

onMounted(async () => {
  await getSitesOptionsForFiltering();
  await getSiteSettingsById(mySite.value);
});

async function onUpdateSiteSettings(action: string) {
  try {
    isPickUpDropOffLoading.value = true;
    action == "edit"
      ? (siteSetting.value.pickUpdropOffCompanyList![pickUpDropOffIndex.value] =
          editPickUpDropOff.value)
      : siteSetting.value.pickUpdropOffCompanyList.splice(
          0,
          0,
          pickUpDropOff.value,
        );

    await updateSiteSettingsById(
      siteSetting.value._id || "",
      siteSetting.value,
    );

    action == "edit"
      ? (editPickUpDropOff.value = "")
      : (pickUpDropOff.value = "");
    resetValues();

    setSnackbar({
      text: "Site Settings updated",
      modal: true,
    });
  } catch (error: any) {
    setSnackbar({
      text: error.message,
      modal: true,
      type: "error",
    });
  } finally {
    isPickUpDropOffLoading.value = false;
  }
}

async function onDeleteSiteSetting(idx: number) {
  try {
    isPickUpDropOffLoading.value = true;
    siteSetting.value.pickUpdropOffCompanyList?.splice(idx, 1);
    pickUpDropOffIndex.value = -1;

    await updateSiteSettingsById(
      siteSetting.value._id || "",
      siteSetting.value,
    );

    setSnackbar({
      text: "Successfully Deleted!",
      modal: true,
    });
  } catch (error: any) {
    setSnackbar({
      text: error.message,
      modal: true,
      type: "error",
    });
  } finally {
    isPickUpDropOffLoading.value = false;
  }
}

async function onSelectPickupDropOffToBeUpdate(
  value: string,
  idx: number,
  action: string,
) {
  if (value) {
    const result = siteSetting.value.pickUpdropOffCompanyList?.find(
      (v: string) => v === value,
    );

    action == "edit"
      ? (editPickUpDropOff.value = result || "")
      : (pickUpDropOff.value = result || "");

    pickUpDropOffIndex.value = idx;
    isEditPickUpDropOff.value = true;
  }
}

async function onUpdatePickUpDropOff(action: string) {
  try {
    isPickUpDropOffLoading.value = true;
    action == "edit"
      ? (siteSetting.value.pickUpdropOffCompanyList![pickUpDropOffIndex.value] =
          editPickUpDropOff.value)
      : siteSetting.value.pickUpdropOffCompanyList.splice(
          0,
          0,
          pickUpDropOff.value,
        );

    await updateSiteSettingsById(
      siteSetting.value._id || "",
      siteSetting.value,
    );
    if (editPickUpDropOff.value || pickUpDropOff.value) {
      action == "edit"
        ? (editPickUpDropOff.value = "")
        : (pickUpDropOff.value = "");
      isEditPickUpDropOff.value = false;
    }
    setSnackbar({
      text: "Successfully Updated!",
      modal: true,
    });
  } catch (error: any) {
    setSnackbar({
      text: error.message,
      modal: true,
      type: "error",
    });
  } finally {
    isPickUpDropOffLoading.value = false;
  }
}

function resetValues() {
  isEditPickUpDropOff.value = false;
  pickUpDropOffIndex.value = NaN;
}
</script>
<style scoped>
:deep() .v-switch .v-label {
  font-size: 12px;
}
</style>
