<template>
  <v-dialog
    v-model="editEmergencyContactDialog"
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
          Edit Emergency Contact
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
                    v-if="editEmergencyContactSteps === 1"
                    ><v-form ref="addAnnouncementForm">
                      <v-row>
                        <v-col cols="12" class="font-weight-bold pb-4">
                          General information
                        </v-col>

                        <v-col cols="12" class="text-end">
                          <v-chip
                            :color="
                              editEmergencyContact.isDefault ? 'success' : ''
                            "
                          >
                            {{
                              editEmergencyContact.isDefault
                                ? "Visible"
                                : "Not Visible"
                            }}
                          </v-chip>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="editEmergencyContact.title"
                            label="Title"
                            :class="existingEmergencyContact && 'grey-field'"
                            density="compact"
                            hide-details
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="editEmergencyContact.phoneNumber"
                            label="Contact Number"
                            :class="existingEmergencyContact && 'grey-field'"
                            density="compact"
                            type="number"
                            hide-details
                            hide-spin-buttons
                            :disabled="isProgress"
                            :rules="[requiredInput]"
                            @input="filterNumericInput"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-select
                            label="Select Category"
                            v-model="editEmergencyContact.categoryName"
                            :items="emergencyContactCategoriesName"
                            hide-details
                          ></v-select>
                        </v-col>
                        <v-col cols="12">
                          <v-select
                            v-model="editEmergencyContact.icon"
                            :items="emergencyContactIcons"
                            label="Select Icon"
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
                        <v-col cols="12">
                          <v-checkbox
                            label="Mark as default"
                            v-model="editEmergencyContact.isDefault"
                          ></v-checkbox>
                        </v-col>

                        <v-col cols="12">
                          <v-btn
                            block
                            color="blue-darken-3"
                            size="small"
                            variant="flat"
                            style="height: 40px"
                            @click="onEditSingleAnnouncement()"
                            :disabled="isProgress"
                          >
                            Edit Emergency Contact
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-col>

                  <v-col cols="12" v-if="editEmergencyContactSteps === 2">
                    <div
                      class="text-center mt-6 text-subtitle-1 font-weight-bold"
                    >
                      Great!
                    </div>
                    <div class="text-center mt-2 text-caption">
                      Emergency Contact has been successfully edited.
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

const primaryPhone = ref("");
const filterNumericInput = (event) => {
  const value = event.target.value;
  primaryPhone.value = value.replace(/\D/g, "");
};
const { currentUser } = useLocalAuth();

const addAnnouncementForm = ref<HTMLFormElement | null>(null);

const {
  emergencyContact,
  setEmergencyContacts,
  editEmergencyContactById,
  editEmergencyContactDialog,
  editEmergencyContactSteps,
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

const editEmergencyContact = ref({
  title: "",
  phoneNumber: "",
  categoryName: "",
  icon: "",
  isDefault: false,
});

onMounted(() => {
  editEmergencyContact.value.title = emergencyContact.value.title || "";
  editEmergencyContact.value.phoneNumber =
    emergencyContact.value.phoneNumber || "";
  editEmergencyContact.value.categoryName =
    emergencyContact.value.categoryName || "";
  editEmergencyContact.value.icon = emergencyContact.value.icon || "";
  editEmergencyContact.value.isDefault =
    emergencyContact.value.isDefault || emergencyContact.value.isShown || false;
});

watch(currentEmergencyContact, (newValue) => {
  editEmergencyContact.value = newValue;
});

async function onEditSingleAnnouncement() {
  if (!mySite.value || !currentUser.value.organization) return;
  try {
    isProgress.value = true;

    if (
      !editEmergencyContact.value.title ||
      !editEmergencyContact.value.phoneNumber ||
      !editEmergencyContact.value.categoryName ||
      !editEmergencyContact.value.icon
    ) {
      isProgress.value = false;

      addAnnouncementForm.value?.validate();

      if (!editEmergencyContact.value.title) {
        isProgress.value = false;
        return setSnackbar({
          text: "Title is required",
          type: "error",
          modal: true,
        });
      }

      if (!editEmergencyContact.value.phoneNumber) {
        isProgress.value = false;
        return setSnackbar({
          text: "Phone Number is required",
          type: "error",
          modal: true,
        });
      }
      if (!editEmergencyContact.value.categoryName) {
        isProgress.value = false;
        return setSnackbar({
          text: "Category is required",
          type: "error",
          modal: true,
        });
      }
      if (!editEmergencyContact.value.icon) {
        isProgress.value = false;
        return setSnackbar({
          text: "Icon is required",
          type: "error",
          modal: true,
        });
      }
    }

    const category = emergencyContactCategories.value.find(
      (cat) => cat.categoryName === editEmergencyContact.value.categoryName,
    );
    await editEmergencyContactById(emergencyContact.value._id!, {
      site: mySite.value,
      title: editEmergencyContact.value.title,
      phoneNumber: editEmergencyContact.value.phoneNumber,
      category: category?._id,
      icon: editEmergencyContact.value.icon,
      isDefault: editEmergencyContact.value.isDefault,
      isShown: editEmergencyContact.value.isDefault,
    });

    await setEmergencyContacts(mySite.value);

    setSnackbar({
      text: "Emergency Contact successfully edited!",
      modal: true,
    });
    editEmergencyContactSteps.value = 2;
    isProgress.value = false;

    editEmergencyContact.value.title = "";
    editEmergencyContact.value.phoneNumber = "";
    editEmergencyContact.value.icon = "";
  } catch (err) {
    setSnackbar({ text: err as string, type: "error", modal: true });
    isProgress.value = false;
  }
}

async function onCloseDialog() {
  editEmergencyContactDialog.value = false;
  editEmergencyContactSteps.value = 1;
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
