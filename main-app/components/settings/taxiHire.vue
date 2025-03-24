<template>
  <v-card class="pa-2">
    <v-card-title class="font-weight-bold text-body-1">
      Taxi Hire Companies
    </v-card-title>
    <v-divider class="mb-2"></v-divider>
    <v-row no-gutters justify="space-evenly">
      <v-col
        cols="12"
        v-if="
          siteSetting.taxiHireCompanies &&
          siteSetting.taxiHireCompanies.length > 0
        "
      >
        <v-list-item>
          <v-text-field
            v-model="taxiHire"
            class="pb-2"
            density="compact"
            placeholder="Enter taxi hire company name"
            clearable
            hide-details
            :loading="isTaxiHireLoading"
            :disabled="isTaxiHireLoading"
            @keyup.enter="onUpdateSiteSettings('add')"
            @click:clear="resetValues()"
          >
            <template v-slot:prepend-inner>
              <v-icon color="blue-darken-3" class="mr-4">mdi-truck-plus</v-icon>
            </template>

            <template v-slot:append-inner>
              <v-btn
                icon
                class="mr-2"
                size="small"
                density="compact"
                type="submit"
                color="success"
                :loading="isTaxiHireLoading"
                :disabled="!Boolean(taxiHire)"
                @click="onUpdatePickUpDropOff('add')"
              >
                <v-icon size="small">mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-list-item>
        <v-divider></v-divider>
        <v-list style="max-height: 400px; overflow-y: auto">
          <draggableVue
            v-model="siteSetting.taxiHireCompanies"
            item-key="index"
            :animation="200"
            disable="false"
            ghost-class="ghost"
            drag-class="dragging"
            @end="onDragEnd"
          >
            <template #item="{ element, index }">
              <div>
                <transition-group type="transition" name="flip-list">
                  <v-list-item
                    class="border-b-sm draggable-item"
                    :style="
                      $vuetify.theme.current.dark
                        ? 'background-color: #212529'
                        : 'background-color: #f8f9fa'
                    "
                  >
                    <template v-slot:prepend>
                      <v-icon class="cursor-hand">mdi-drag</v-icon>
                    </template>
                    <v-text-field
                      v-if="isEditTaxiHire && taxiHireIndex == index"
                      v-model="editTaxiHire"
                      class="pb-2"
                      density="compact"
                      placeholder="Enter taxi hire company name"
                      clearable
                      hide-details
                      :loading="isTaxiHireLoading"
                      :disabled="isTaxiHireLoading"
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
                          :loading="isTaxiHireLoading"
                          :disabled="!Boolean(editTaxiHire)"
                          @click="onUpdatePickUpDropOff('edit')"
                        >
                          <v-icon size="small">mdi-check</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                    <div v-else>
                      <v-icon class="mr-4">mdi-truck</v-icon>
                      {{ element }}
                    </div>

                    <template v-slot:append v-if="taxiHireIndex != index">
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
                            :loading="isTaxiHireLoading"
                            :disabled="isTaxiHireLoading"
                            @click="
                              onSelectPickupDropOffToBeUpdate(
                                element,
                                index,
                                'edit',
                              )
                            "
                          >
                            <v-icon size="small">mdi-pencil</v-icon>
                          </v-btn>

                          <v-btn
                            icon
                            class="mr-2"
                            density="compact"
                            color="red"
                            :loading="isTaxiHireLoading"
                            :disabled="isTaxiHireLoading"
                            @click="onDeleteSiteSetting(index)"
                          >
                            <v-icon size="small">mdi-delete-forever</v-icon>
                          </v-btn>
                        </div>
                      </v-menu>
                    </template>
                  </v-list-item>
                  <v-divider></v-divider>
                </transition-group>
              </div>
            </template>
          </draggableVue>
        </v-list>
      </v-col>

      <v-col cols="12" v-else>
        <v-list>
          <v-list-item>
            <v-text-field
              v-model="taxiHire"
              class="pb-2"
              density="compact"
              placeholder="Enter taxi hire company name"
              clearable
              hide-details
              :loading="isTaxiHireLoading"
              :disabled="isTaxiHireLoading"
              @keyup.enter="onUpdateSiteSettings('add')"
              @click:clear="resetValues()"
            >
              <template v-slot:prepend-inner>
                <v-icon color="blue-darken-3" class="mr-4"
                  >mdi-truck-plus</v-icon
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
                  :loading="isTaxiHireLoading"
                  :disabled="!Boolean(taxiHire)"
                  @click="onUpdatePickUpDropOff('add')"
                >
                  <v-icon size="small">mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-list-item>
          <v-divider></v-divider>
        </v-list>
        <v-row no-gutters justify="center" class="pa-16">
          <v-col cols="12">
            <v-row no-gutters justify="center">
              <v-img src="/empty.svg" width="100px" height="100px"></v-img>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-row no-gutters justify="center">
              <span class="font-weight-bold"> No Taxi Hire Company </span>
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

const taxiHire = ref("");
const editTaxiHire = ref("");
const taxiHireIndex = ref(NaN);
const isEditTaxiHire = ref(false);
const isTaxiHireLoading = ref(false);

onMounted(async () => {
  await getSitesOptionsForFiltering();
  await getSiteSettingsById(mySite.value);
});

async function onDragEnd(event: any) {
  try {
    await updateSiteSettingsById(
      siteSetting.value._id || "",
      siteSetting.value,
    );

    setSnackbar({
      text: "Taxi Hire Settings updated!",
      modal: true,
    });
  } catch (error: any) {
    setSnackbar({
      text: error.message,
      modal: true,
      type: "error",
    });
  }
}

async function onUpdateSiteSettings(action: string) {
  try {
    isTaxiHireLoading.value = true;
    action == "edit"
      ? (siteSetting.value.taxiHireCompanies![taxiHireIndex.value] =
          editTaxiHire.value)
      : siteSetting.value.taxiHireCompanies.splice(0, 0, taxiHire.value);

    await updateSiteSettingsById(
      siteSetting.value._id || "",
      siteSetting.value,
    );

    action == "edit" ? (editTaxiHire.value = "") : (taxiHire.value = "");
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
    isTaxiHireLoading.value = false;
  }
}

async function onDeleteSiteSetting(index: number) {
  try {
    isTaxiHireLoading.value = true;
    siteSetting.value.taxiHireCompanies?.splice(index, 1);
    taxiHireIndex.value = -1;

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
    isTaxiHireLoading.value = false;
  }
}

async function onSelectPickupDropOffToBeUpdate(
  value: string,
  index: number,
  action: string,
) {
  if (value) {
    const result = siteSetting.value.taxiHireCompanies?.find(
      (v: string) => v === value,
    );

    action == "edit"
      ? (editTaxiHire.value = result || "")
      : (taxiHire.value = result || "");

    taxiHireIndex.value = index;
    isEditTaxiHire.value = true;
  }
}

async function onUpdatePickUpDropOff(action: string) {
  try {
    isTaxiHireLoading.value = true;
    action == "edit"
      ? (siteSetting.value.taxiHireCompanies![taxiHireIndex.value] =
          editTaxiHire.value)
      : siteSetting.value.taxiHireCompanies.splice(0, 0, taxiHire.value);

    await updateSiteSettingsById(
      siteSetting.value._id || "",
      siteSetting.value,
    );
    if (editTaxiHire.value || taxiHire.value) {
      action == "edit" ? (editTaxiHire.value = "") : (taxiHire.value = "");
      resetValues();
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
    isTaxiHireLoading.value = false;
  }
}

function resetValues() {
  isEditTaxiHire.value = false;
  taxiHireIndex.value = NaN;
}
</script>
<style scoped>
:deep() .v-switch .v-label {
  font-size: 12px;
}

.draggable-item {
  cursor: move;
  transition: background-color 0.3s ease;
}

.dragging {
  background-color: black; /* Example dragging effect */
}
.flip-list-move {
  transition: transform 1s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
}
/* Transition styles */
.list-enter-active,
.list-leave-active {
  transition: opacity 0.8s;
}
.list-enter, .list-leave-to /* .list-leave-active in <2.1.8 */ {
  opacity: 0;
}

/* Optional: Hover effect for items */
.draggable-item:hover {
  background-color: #f1f1f1; /* Slightly darker background on hover */
}
</style>
