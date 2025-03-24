<template>
  <v-dialog
    v-model="addEmergencyContactDialog"
    transition="dialog-right-transition"
    fullscreen
    persistent
    :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
  >
    <v-card
      :loading="isProgress"
      :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
      :class="`${theme == 'light' && 'bg-white'} px-3 h-100 ${$vuetify.display.mdAndUp && 'rounded-s-xl'}`"
    >
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="orange"
          height="8"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
        <span class="font-weight-bold pl-4 pt-1 text-capitalize">
          {{
            existingEmergencyContact
              ? "View Emergency Contact"
              : "Add Emergency Contact"
          }}
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
        <v-row class="h-100 align-center">
          <v-col cols="12" class="mt-5">
            <v-row>
              <v-col cols="12" class="mb-5">
                <v-img
                  :src="`/images/emergency-contact/emergencyContact.png`"
                  height="125"
                />
              </v-col>

              <v-col cols="12">
                <v-row no-gutters>
                  <v-col
                    cols="12"
                    class="mb-6"
                    v-if="addEmergencyContactSteps === 1"
                    ><v-form ref="addAnnouncementForm">
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          class="text-end"
                          v-if="existingEmergencyContact"
                        >
                          <v-chip
                            :color="
                              currentEmergencyContact.isDefault ? 'success' : ''
                            "
                          >
                            {{
                              currentEmergencyContact.isDefault
                                ? "Visible"
                                : "Not Visible"
                            }}
                          </v-chip>
                        </v-col>

                        <v-col cols="12" class="font-weight-bold pb-4">
                          General information
                          <v-chip v-if="currentEmergencyContact.isDefault">
                            Default
                          </v-chip>
                        </v-col>

                        <template v-if="existingEmergencyContact">
                          <v-col cols="12">
                            <v-text-field
                              :model-value="currentEmergencyContact.title"
                              label="Title"
                              density="compact"
                              hide-details
                              :disabled="isProgress"
                              :readonly="existingEmergencyContact"
                              :rules="[requiredInput]"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" class="mt-6">
                            <v-text-field
                              :model-value="currentEmergencyContact.phoneNumber"
                              label="Contact Number"
                              :readonly="existingEmergencyContact"
                              density="compact"
                              type="number"
                              hide-details
                              hide-spin-buttons
                              :disabled="isProgress"
                              :rules="[requiredInput]"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" class="mt-6">
                            <v-text-field
                              :model-value="
                                currentEmergencyContact.categoryName
                              "
                              label="Category"
                              :readonly="existingEmergencyContact"
                              density="compact"
                              hide-details
                              :disabled="isProgress"
                              :rules="[requiredInput]"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" class="mt-6">
                            <v-select
                              v-model="currentEmergencyContact.icon"
                              :items="emergencyContactIcons"
                              label="Select Icon"
                              hide-details
                              :rules="[requiredInput]"
                              :readonly="existingEmergencyContact"
                            >
                              <template v-slot:selection="{ item, index }">
                                <v-icon>
                                  <v-img
                                    :src="`/icons/emergency-contact/${theme === 'dark' ? 'dark' : 'light'}/${item.raw}`"
                                    cover
                                  ></v-img>
                                </v-icon>
                              </template>
                              <template v-slot:item="{ props, item }">
                                <v-row no-gutters v-bind="props" class="px-3">
                                  <v-col cols="12" class="pa-2">
                                    <v-icon size="x-large">
                                      <v-img
                                        :src="`/icons/emergency-contact/${theme === 'dark' ? 'dark' : 'light'}/${item.raw}`"
                                        cover
                                      ></v-img>
                                    </v-icon>
                                  </v-col>
                                </v-row>
                              </template>
                            </v-select>
                          </v-col>
                        </template>

                        <template v-else>
                          <v-col cols="12">
                            <v-text-field
                              v-model="newEmergencyContact.title"
                              label="Title"
                              :class="existingEmergencyContact && 'grey-field'"
                              density="compact"
                              hide-details
                              :disabled="isProgress"
                              :rules="[requiredInput]"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" class="mt-6">
                            <v-text-field
                              v-model="newEmergencyContact.phoneNumber"
                              label="Contact Number"
                              density="compact"
                              type="number"
                              hide-spin-buttons
                              hide-details
                              :disabled="isProgress"
                              :rules="[requiredInput]"
                              @input="filterNumericInput"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" class="mt-6">
                            <v-select
                              label="Select Category"
                              placeholder="Select Category"
                              v-model="newEmergencyContact.categoryName"
                              :items="emergencyContactCategoriesName"
                              hide-details
                              :rules="[requiredInput]"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" class="mt-6">
                            <v-select
                              v-model="newEmergencyContact.icon"
                              :items="emergencyContactIcons"
                              label="Select Icon"
                              placeholder="Select Icon"
                              hide-details
                              :rules="[requiredInput]"
                            >
                              <template v-slot:selection="{ item, index }">
                                <v-icon>
                                  <v-img
                                    :src="`/icons/emergency-contact/${theme === 'dark' ? 'dark' : 'light'}/${item.raw}`"
                                    cover
                                  ></v-img>
                                </v-icon>
                              </template>
                              <template v-slot:item="{ props, item }">
                                <v-row no-gutters v-bind="props" class="px-3">
                                  <v-col cols="12" class="pa-2">
                                    <v-icon size="x-large">
                                      <v-img
                                        :src="`/icons/emergency-contact/${theme === 'dark' ? 'dark' : 'light'}/${item.raw}`"
                                        cover
                                      ></v-img>
                                    </v-icon>
                                  </v-col>
                                </v-row>
                              </template>
                            </v-select>
                          </v-col>
                        </template>
                        <v-col
                          cols="12"
                          class="mt-6"
                          v-if="!existingEmergencyContact"
                        >
                          <v-btn
                            block
                            color="blue-darken-3"
                            size="small"
                            variant="flat"
                            style="height: 40px"
                            @click="onAddSingleEmergencyContact()"
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                          >
                            Add Emergency Contact
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-col>

                  <v-col cols="12" v-if="addEmergencyContactSteps === 2">
                    <div
                      class="text-center mt-6 text-subtitle-1 font-weight-bold"
                    >
                      Great!
                    </div>
                    <div class="text-center mt-2 text-caption">
                      A new emergency contact is added to the list.
                    </div>
                    <v-row class="px-3 mt-5" justify="space-between">
                      <v-col cols="12">
                        <v-btn
                          block
                          size="small"
                          variant="flat"
                          style="height: 40px"
                          @click="onCloseDialog()"
                        >
                          Close
                        </v-btn>
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
import phoneCode from "@/components/phone-code.json";
const prefixes = ref(phoneCode);
const { theme } = useLocal();
const { setSnackbar } = useLocal();
const { requiredInput } = useUtils();

const { currentUser } = useLocalAuth();

const addAnnouncementForm = ref<HTMLFormElement | null>(null);
const primaryPhone = ref("");
const filterNumericInput = (event) => {
  const value = event.target.value;
  primaryPhone.value = value.replace(/\D/g, "");
};

const {
  emergencyContact,
  setEmergencyContacts,
  addEmergencyContact,
  addEmergencyContactDialog,
  addEmergencyContactSteps,
  emergencyContactCategories,
} = useEmergencyContact();

const { mySite } = useFilter();

const isProgress = ref(false);

const emergencyContactIcons = [
  "ambulance.svg",
  "fire-fighter.svg",
  "management.svg",
  "police.svg",
  "security-officer.svg",
];

const existingEmergencyContact = computed(
  () =>
    emergencyContact.value.title &&
    emergencyContact.value.phoneNumber &&
    emergencyContact.value.category &&
    emergencyContact.value.icon != "",
);

const emergencyContactCategoriesName = computed<string[]>(() => {
  let categoryNames: string[] = [];
  emergencyContactCategories.value.forEach((category) => {
    categoryNames.push(category.categoryName!);
  });
  return categoryNames;
});

const currentEmergencyContact = computed(() => {
  return {
    title: emergencyContact.value.title || "",
    phoneNumber: emergencyContact.value.phoneNumber || "",
    categoryName: emergencyContact.value.categoryName || null,
    icon: emergencyContact.value.icon || null,
    isDefault:
      emergencyContact.value.isDefault ||
      emergencyContact.value.isShown ||
      false,
  };
});

const newEmergencyContact = ref({
  title: emergencyContact.value.title || "",
  phoneNumber: emergencyContact.value.phoneNumber || "",
  categoryName: null,
  icon: null,
});

async function onAddSingleEmergencyContact() {
  console.log("Data", newEmergencyContact.value);

  if (!mySite.value || !currentUser.value.organization) return;
  try {
    isProgress.value = true;

    if (
      !newEmergencyContact.value.title ||
      !newEmergencyContact.value.phoneNumber ||
      !newEmergencyContact.value.categoryName ||
      !newEmergencyContact.value.icon
    ) {
      isProgress.value = false;

      addAnnouncementForm.value?.validate();

      if (!newEmergencyContact.value.title) {
        isProgress.value = false;
        return setSnackbar({
          text: "Title is required",
          type: "error",
          modal: true,
        });
      }

      if (!newEmergencyContact.value.phoneNumber) {
        isProgress.value = false;
        return setSnackbar({
          text: "Phone Number is required",
          type: "error",
          modal: true,
        });
      }
      if (!newEmergencyContact.value.categoryName) {
        isProgress.value = false;
        return setSnackbar({
          text: "Category is required",
          type: "error",
          modal: true,
        });
      }
      if (!newEmergencyContact.value.icon) {
        isProgress.value = false;
        return setSnackbar({
          text: "Icon is required",
          type: "error",
          modal: true,
        });
      }
    }

    const category = emergencyContactCategories.value.find(
      (cat) => cat.categoryName === newEmergencyContact.value.categoryName,
    );
    const newItem = await addEmergencyContact({
      title: newEmergencyContact.value.title,
      phoneNumber: newEmergencyContact.value.phoneNumber,
      category: category?._id,
      site: mySite.value,
      icon: newEmergencyContact.value.icon,
    });

    if (newItem.status === "error") {
      isProgress.value = false;
      return setSnackbar({ text: newItem.message, type: "error", modal: true });
    }

    if (newItem.status === "success") {
      setSnackbar({ text: newItem.message, modal: true });

      await setEmergencyContacts(mySite.value);

      addEmergencyContactSteps.value = 2;
      isProgress.value = false;

      newEmergencyContact.value.title = "";
      newEmergencyContact.value.phoneNumber = "";
      newEmergencyContact.value.categoryName = null;
      newEmergencyContact.value.icon = null;
    }
  } catch (err) {
    setSnackbar({ text: err as string, type: "error", modal: true });
    isProgress.value = false;
  }
}

async function onCloseDialog() {
  addEmergencyContactDialog.value = false;
  addEmergencyContactSteps.value = 1;
  newEmergencyContact.value.title = "";
  newEmergencyContact.value.phoneNumber = "";
  newEmergencyContact.value.categoryName = null;
  newEmergencyContact.value.icon = null;
  primaryPhone.value = "";
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
  max-width: 28rem;
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
</style>
