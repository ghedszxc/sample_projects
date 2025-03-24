<template>
  <v-dialog v-model="manageEmergencyContactCategories" max-width="500">
    <v-card
      :loading="isProgress"
      :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
    >
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="orange"
          height="8"
          indeterminate
        ></v-progress-linear>
      </template>
      <v-toolbar>
        <span class="font-weight-bold pl-4 pt-1 text-capitalize">
          Manage Categories
        </span>
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          icon="mdi-close"
          @click="onCloseDialog()"
        ></v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text>
        <v-row class="align-center">
          <v-col class="mt-5">
            <v-row>
              <v-col>
                <v-row no-gutters>
                  <v-col class="mb-6">
                    <v-row>
                      <v-col
                        cols="12"
                        class="font-weight-bold pb-4 text-center"
                      >
                        <v-row class="align-center">
                          <v-text-field
                            class="mr-2"
                            placeholder="Category Name"
                            outlined
                            hide-details
                            v-model="categoryName"
                          ></v-text-field>

                          <v-btn
                            @click="addCategory"
                            color="blue-darken-3"
                            variant="flat"
                          >
                            Add Category
                          </v-btn>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col class="mb-6">
                    <v-row>
                      <v-col cols="12">
                        <v-sheet
                          class="d-flex ga-2 flex-wrap overflow-auto"
                          max-height="100px"
                          max-width="452px"
                        >
                          <template
                            v-for="category in emergencyContactCategories"
                            :key="category._id"
                          >
                            <div
                              class="custom__chip d-flex ga-1 text-body-2 bg-grey-lighten-2 align-center justify-center px-3 py-1 rounded-pill text-no-wrap overflow-hidden"
                            >
                              <div>
                                {{ category.categoryName }}
                              </div>

                              <v-btn
                                @click="deleteCategory(category._id)"
                                variant="plain"
                                size="xs"
                                icon="mdi-close-circle"
                              ></v-btn>
                            </div>
                          </template>
                        </v-sheet>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <span :class="`${$vuetify.display.mdAndUp && 'pl-4'} text-caption`">
          @ 2024 by Seven 365 Pte Ltd V1.0
        </span>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure"],
});

const {
  getAllEmergencyCategories,
  addEmergencyContactCategory,
  deleteEmergencyContactCategoryById,
  emergencyContactCategories,
  manageEmergencyContactCategories,
} = useEmergencyContact();
const { mySite } = useFilter();
const { setSnackbar } = useLocal();

async function onCloseDialog() {
  manageEmergencyContactCategories.value = false;
  categoryName.value = "";
}

const categoryName = ref<string>("");
const isProgress = ref<boolean>(false);

async function addCategory() {
  isProgress.value = true;
  if (!categoryName.value) {
    isProgress.value = false;
    return setSnackbar({
      text: "Category name is required.",
      modal: true,
      type: "error",
    });
  }
  try {
    const newItem = await addEmergencyContactCategory(
      categoryName.value,
      mySite.value,
    );

    if (newItem.status === "error") {
      isProgress.value = false;
      return setSnackbar({
        text: newItem.message,
        modal: true,
        type: "error",
      });
    }

    if (newItem.status === "success") {
      await getAllEmergencyCategories(mySite.value), (categoryName.value = "");
      isProgress.value = false;
      return setSnackbar({
        text: newItem.message,
        modal: true,
      });
    }
  } catch (err) {
    setSnackbar({ text: err as string, modal: true, type: "error" });
  }
  isProgress.value = false;
}

async function deleteCategory(id: string) {
  isProgress.value = true;
  try {
    const item = await deleteEmergencyContactCategoryById(id, mySite.value);
    if (item.status === "error") {
      setSnackbar({ text: item.message, modal: true, type: item.status });
    } else if (item.status === "success") {
      setSnackbar({ text: item.message, modal: true, type: item.status });
      emergencyContactCategories.value =
        emergencyContactCategories.value.filter((item) => item._id !== id);
    } else {
      setSnackbar({
        text: "Failed to delete category",
        modal: true,
        type: "error",
      });
    }
  } catch (err) {
    setSnackbar({ text: err as string, modal: true, type: "error" });
  }
  isProgress.value = false;
}
</script>
<style scoped>
.grey-field {
  pointer-events: none;
  background-color: #f2f2f2;
}

.override_shadow {
  box-shadow: 0px 13px 19px -13px rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 0px 13px 19px -13px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 13px 19px -13px rgba(0, 0, 0, 0.15);
}

.dialog_desktop {
  margin: 0 0 0 auto;
  max-width: 28%;
  border-radius: 25px 0 0 25px;

  box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
}

:deep() .v-field__outline {
  --v-field-border-opacity: 0.1;
}

:deep() .v-overlay__scrim {
  opacity: var(--v-overlay-opacity, 0);
}

:deep() .v-text-field input {
  font-size: 13px !important;
}

:deep() .v-textarea .v-field__input {
  font-size: 13px !important;
}

:deep() .v-switch .v-label {
  padding-right: 10px;
  font-size: 13px;
}

:deep() .v-switch .v-selection-control {
  display: flex;
  flex-direction: row-reverse;
}

.custom__chip {
  max-height: 28px;
}
</style>
