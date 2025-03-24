<template>
    <v-dialog v-model="deleteEmergencyContactDialog" max-width="500">
        <v-card :loading="isProgress" :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
            :class="`${theme == 'light' && 'bg-white'} px-3 h-100 ${$vuetify.display.mdAndUp}`">
            <template v-slot:loader="{ isActive }">
                <v-progress-linear :active="isActive" color="orange" height="8" indeterminate></v-progress-linear>
            </template>
            <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
                <span class="font-weight-bold pl-4 pt-1 text-capitalize">
                    Delete <span v-if="$vuetify.display.mdAndUp">Emergency Contact</span>
                </span>
                <v-spacer></v-spacer>
                <v-btn color="grey-darken-1" icon="mdi-close" @click="onCloseDialog()"></v-btn>
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
                                            <v-col cols="12" class="font-weight-bold pb-4 text-center">
                                                Are you sure you want to delete
                                                this contact?
                                                <v-col class="mt-5">
                                                    {{ emergencyContact.title }}
                                                </v-col>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>

                                <v-btn :disabled="loading" :loading="loading" class="text-none mb-4" color="red"
                                    size="x-large" variant="flat" block @click="deleteEmergencyContact">
                                    Delete <span v-if="$vuetify.display.mdAndUp">Emergency Contact</span>
                                </v-btn>

                                <v-btn class="text-none" color="grey-lighten-3" size="x-large" variant="flat" block
                                    @click="onCloseDialog()">
                                    Cancel
                                </v-btn>
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
    deleteEmergencyContactDialog,
    emergencyContact,
    // filterByType,
    // filterByStatus,
    // filterOrganization,
    deleteEmergencyContactById,
    setEmergencyContacts,
} = useEmergencyContact();
const { mySite } = useFilter();
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();

async function onCloseDialog() {
    deleteEmergencyContactDialog.value = false;
}

async function deleteEmergencyContact() {
    try {
        await Promise.all([
            await deleteEmergencyContactById(
                emergencyContact.value._id as string,
                mySite.value,
            ),
            await setEmergencyContacts(mySite.value)
        ])
        onCloseDialog();
        setSnackbar({
            text: "Emergency Contact deleted successfully",
            modal: true, type: "success"
        });
    } catch (err) {
        setSnackbar({ text: err as string, modal: true, type: "error" });
    }
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
