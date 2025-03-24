<template>
  <v-icon
    class="ml-3"
    size="x-small"
    style="cursor: pointer"
    color="red"
    @click="confirmDialog = true"
  >
    mdi-close
  </v-icon>
  <v-dialog v-model="confirmDialog" persistent max-width="500px">
    <v-card :loading="isProgress">
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="blue"
          height="8"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-card-text class="pb-3">
        <v-row>
          <v-col cols="12" align="center" class="pt-0">
            <v-img
              src="/images/confirmation.svg"
              width="130px"
              height="130px"
            ></v-img>
          </v-col>

          <v-col cols="12" class="text-center pt-0">
            Are you sure you want to delete this document?
          </v-col>
          <v-col cols="6">
            <v-btn size="small" color="green" block @click="onDeleteDocument"
              >Confirm</v-btn
            >
          </v-col>
          <v-col cols="6">
            <v-btn size="small" color="red" block @click="confirmDialog = false"
              >Cancel</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
const emit = defineEmits(["delete"]);
const { _id, documentName, unitDocument } = defineProps([
  "_id",
  "documentName",
  "unitDocument",
]);

const { setSnackbar } = useLocal();
const isProgress = ref(false);
const confirmDialog = ref(false);

const { deleteDocumentById } = useBlockLevelUnit();

async function deleteFile(file: any) {
  const { error, data } = await useLocalFetch(`/api/files/${file}`, {
    method: "DELETE",
  });

  if (error && error.value && error.value.data) {
    return Promise.reject(error.value.data.message as string);
  }

  const result = data as any;

  if (result && result.value) {
    return Promise.resolve(result.value.message as string);
  }
}

async function onDeleteDocument() {
  isProgress.value = true;

  try {
    const item = await deleteDocumentById(_id, documentName, unitDocument.id);

    // if (item.status === "success") {
    //   await deleteFile(unitDocument.id);
    // }

    emit("delete");
    if (item) {
      setSnackbar({
        text: `${item.message}`,
        modal: true,
        type: `${item.status}`,
      });
      isProgress.value = false;
      confirmDialog.value = false;
      return;
    }
  } catch (err: any) {
    confirmDialog.value = false;
    setSnackbar({ text: err, modal: true, type: "error" });
    isProgress.value = false;
  }
}
</script>
