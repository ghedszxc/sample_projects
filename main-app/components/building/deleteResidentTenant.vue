<template>
  <v-dialog v-model="deleteDialog" max-width="400" persistent>
    <v-card class="pb-6 rounded-xl">
      <v-toolbar color="transparent">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          icon
          @click="deleteDialog = false"
          :disabled="isUnitsLoaded"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="px-10">
        <div class="d-flex justify-center">
          <v-img :src="'/images/undraw_throw_away.png'" alt="Delete Image" />
        </div>
        <div class="font-weight-bold text-center my-5 px-12">
          Are you sure you want to delete this?
        </div>
      </v-card-text>

      <v-card-actions class="px-10 pt-0">
        <v-btn
          class="bg-blue-darken-4 w-100"
          @click="onDelete(_id)"
          :disabled="isUnitsLoaded"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
defineProps({
  _id: String,
});

const { setSnackbar } = useLocal();
const { deleteDialog, isUnitsLoaded, onDeleteResidentTenant } =
  useBlockLevelUnit();

async function onDelete(_id) {
  try {
    await onDeleteResidentTenant(_id);
    deleteDialog.value = false;
    setSnackbar({
      text: "Successfully deleted.",
      modal: true,
      type: "success",
    });
  } catch (err) {
    setSnackbar({
      text: err,
      modal: true,
      type: "error",
    });
  }
}
</script>
