<template>
  <v-card class="pa-2">
    <v-card-title class="font-weight-bold text-body-1">
      Season Pass Type
    </v-card-title>
    <v-divider class="mb-2"></v-divider>
    <v-row no-gutters justify="space-evenly">
      <v-col
        cols="12"
        v-if="
          siteSetting.seasonPassType && siteSetting.seasonPassType.length > 0
        "
      >
        <v-list-item>
          <v-text-field
            v-model="seasonPassType"
            class="pb-2"
            density="compact"
            placeholder="Enter season pass type name"
            clearable
            hide-details
            :loading="isSeasonPassTypeLoading"
            :disabled="isSeasonPassTypeLoading"
            @keyup.enter="onUpdateSiteSettings('add')"
            @click:clear="resetValues()"
          >
            <template v-slot:prepend-inner>
              <v-icon color="blue-darken-3" class="mr-4">mdi-card-plus</v-icon>
            </template>

            <template v-slot:append-inner>
              <v-btn
                icon
                class="mr-2"
                size="small"
                density="compact"
                type="submit"
                color="success"
                :loading="isSeasonPassTypeLoading"
                :disabled="!Boolean(seasonPassType)"
                @click="onUpdatePickUpDropOff('add')"
              >
                <v-icon size="small">mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-list-item>
        <v-divider class="mb-2"></v-divider>
        <v-list style="max-height: 400px; overflow-y: auto">
          <draggableVue
            v-model="siteSetting.seasonPassType"
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
                      v-if="isEditSeasonPass && seasonPassIndex == index"
                      v-model="editSeasonPassType"
                      class="pb-2"
                      density="compact"
                      placeholder="Enter season pass type name"
                      clearable
                      hide-details
                      :loading="isSeasonPassTypeLoading"
                      :disabled="isSeasonPassTypeLoading"
                      @keyup.enter="onUpdateSiteSettings('edit')"
                      @click:clear="resetValues()"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon color="orange-darken-3" class="mr-4"
                          >mdi-card-bulleted</v-icon
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
                          :loading="isSeasonPassTypeLoading"
                          :disabled="!Boolean(editSeasonPassType)"
                          @click="onUpdatePickUpDropOff('edit')"
                        >
                          <v-icon size="small">mdi-check</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                    <div v-else>
                      <v-icon class="mr-4">mdi-card-bulleted</v-icon>
                      {{ element }}
                    </div>

                    <template v-slot:append v-if="seasonPassIndex != index">
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
                            :loading="isSeasonPassTypeLoading"
                            :disabled="isSeasonPassTypeLoading"
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
                            :loading="isSeasonPassTypeLoading"
                            :disabled="isSeasonPassTypeLoading"
                            @click="onDeleteSiteSetting(index)"
                          >
                            <v-icon size="small">mdi-delete-forever</v-icon>
                          </v-btn>
                        </div>
                      </v-menu>
                    </template>
                  </v-list-item>
                </transition-group>
                <v-divider></v-divider>
              </div>
            </template>
          </draggableVue>
        </v-list>
      </v-col>

      <v-col cols="12" v-else>
        <v-list>
          <v-list-item>
            <v-text-field
              v-model="seasonPassType"
              class="pb-2"
              density="compact"
              placeholder="Enter season pass type name"
              clearable
              hide-details
              :loading="isSeasonPassTypeLoading"
              :disabled="isSeasonPassTypeLoading"
              @keyup.enter="onUpdateSiteSettings('add')"
              @click:clear="resetValues()"
            >
              <template v-slot:prepend-inner>
                <v-icon color="blue-darken-3" class="mr-4"
                  >mdi-card-plus</v-icon
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
                  :loading="isSeasonPassTypeLoading"
                  :disabled="!Boolean(seasonPassType)"
                  @click="onUpdatePickUpDropOff('add')"
                >
                  <v-icon size="small">mdi-plus</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-list-item>
          <v-divider></v-divider>

          <template
            v-for="(item, index) in siteSetting.seasonPassType"
            :key="index"
          >
            <v-list-item>
              <v-text-field
                v-if="isEditSeasonPass && seasonPassIndex == index"
                v-model="editSeasonPassType"
                class="pb-2"
                density="compact"
                placeholder="Enter season pass type name"
                clearable
                hide-details
                :loading="isSeasonPassTypeLoading"
                :disabled="isSeasonPassTypeLoading"
                @keyup.enter="onUpdateSiteSettings('edit')"
                @click:clear="resetValues()"
              >
                <template v-slot:prepend-inner>
                  <v-icon color="orange-darken-3" class="mr-4"
                    >mdi-card-bulleted</v-icon
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
                    :loading="isSeasonPassTypeLoading"
                    :disabled="!Boolean(editSeasonPassType)"
                    @click="onUpdatePickUpDropOff('edit')"
                  >
                    <v-icon size="small">mdi-check</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
              <div v-else>
                <v-icon class="mr-4">mdi-card-bulleted</v-icon>
                {{ item }}
              </div>

              <template v-slot:append v-if="seasonPassIndex != index">
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
                      :loading="isSeasonPassTypeLoading"
                      :disabled="isSeasonPassTypeLoading"
                      @click="
                        onSelectPickupDropOffToBeUpdate(item, index, 'edit')
                      "
                    >
                      <v-icon size="small">mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn
                      icon
                      class="mr-2"
                      density="compact"
                      color="red"
                      :loading="isSeasonPassTypeLoading"
                      :disabled="isSeasonPassTypeLoading"
                      @click="onDeleteSiteSetting(index)"
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
              <span class="font-weight-bold"> No Season Pass Type </span>
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

const seasonPassType = ref("");
const editSeasonPassType = ref("");
const seasonPassIndex = ref(NaN);
const isEditSeasonPass = ref(false);
const isSeasonPassTypeLoading = ref(false);

async function onDragEnd(event: any) {
  try {
    await updateSiteSettingsById(
      siteSetting.value._id || "",
      siteSetting.value,
    );

    setSnackbar({
      text: "SeasonPass Type Settings updated!",
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

onMounted(async () => {
  await getSitesOptionsForFiltering();
  await getSiteSettingsById(mySite.value);
});

async function onUpdateSiteSettings(action: string) {
  try {
    isSeasonPassTypeLoading.value = true;
    action == "edit"
      ? (siteSetting.value.seasonPassType![seasonPassIndex.value] =
          editSeasonPassType.value)
      : siteSetting.value.seasonPassType.splice(0, 0, seasonPassType.value);

    await updateSiteSettingsById(
      siteSetting.value._id || "",
      siteSetting.value,
    );

    action == "edit"
      ? (editSeasonPassType.value = "")
      : (seasonPassType.value = "");
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
    isSeasonPassTypeLoading.value = false;
  }
}

async function onDeleteSiteSetting(index: number) {
  try {
    isSeasonPassTypeLoading.value = true;
    siteSetting.value.seasonPassType?.splice(index, 1);
    seasonPassIndex.value = -1;

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
    isSeasonPassTypeLoading.value = false;
  }
}

async function onSelectPickupDropOffToBeUpdate(
  value: string,
  index: number,
  action: string,
) {
  if (value) {
    const result = siteSetting.value.seasonPassType?.find(
      (v: string) => v === value,
    );

    action == "edit"
      ? (editSeasonPassType.value = result || "")
      : (seasonPassType.value = result || "");

    seasonPassIndex.value = index;
    isEditSeasonPass.value = true;
  }
}

async function onUpdatePickUpDropOff(action: string) {
  try {
    isSeasonPassTypeLoading.value = true;
    action == "edit"
      ? (siteSetting.value.seasonPassType![seasonPassIndex.value] =
          editSeasonPassType.value)
      : siteSetting.value.seasonPassType.splice(0, 0, seasonPassType.value);

    await updateSiteSettingsById(
      siteSetting.value._id || "",
      siteSetting.value,
    );
    if (editSeasonPassType.value || seasonPassType.value) {
      action == "edit"
        ? (editSeasonPassType.value = "")
        : (seasonPassType.value = "");
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
    isSeasonPassTypeLoading.value = false;
  }
}

function resetValues() {
  isEditSeasonPass.value = false;
  seasonPassIndex.value = NaN;
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
