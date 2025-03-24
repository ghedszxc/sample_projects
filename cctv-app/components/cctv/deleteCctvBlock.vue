<template>
  <div>
    <v-list-item @click.stop="confirmDialog = true">
      <span class="text-caption"> Delete CCTV Block </span>
    </v-list-item>

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
              Are you sure you want to Delete the CCTV Block?
            </v-col>
            <v-col cols="6">
              <v-btn
                size="small"
                color="green"
                block
                @click="onDeleteCctvBlock()"
                >Confirm</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-btn
                size="small"
                color="red"
                block
                @click="confirmDialog = false"
                >Cancel</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
let props = defineProps({
  cctvBlock: {
    type: Object,
  },
});

const { setSnackbar } = useLocal();
const { mySite } = useFilter();
const { deleteCctvBlock, getBlocks, setCctvs } = useCCTV();
const isProgress = ref(false);
const confirmDialog = ref(false);

async function onDeleteCctvBlock() {
  isProgress.value = true;

  try {
    const data = await deleteCctvBlock(props.cctvBlock!._id);
    console.log(data.message.status);
    if (data.message.status === "error") {
      console.log(data.message.status);
      setSnackbar({
        text: `${data.message.message}`,
        modal: true,
        type: "error",
      });
      isProgress.value = false;
      confirmDialog.value = false;
      return;
    }

    isProgress.value = false;
    confirmDialog.value = false;
    setCctvs({ site: mySite.value });
    setSnackbar({
      text: `Successfully Deleted the CCTV Block.`,
      modal: true,
      type: "success",
    });
  } catch (err) {
    confirmDialog.value = false;
    setSnackbar({ text: err, modal: true, type: "error" });
    isProgress.value = false;
  }
}

// async function updateSelectedContractorFromTable(data: any) {
//   const findContractor = visitors.value.findIndex(
//     (find: any) => find._id == data._id,
//   );

//   if (findContractor != -1) visitors.value[findContractor] = data;
// }
</script>
