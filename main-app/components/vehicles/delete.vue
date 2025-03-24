<template>
  <div>
    <v-list-item @click.stop="confirmDialog = true">
      <span class="text-caption"> Delete Vehicle</span>
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
              Are you sure you want to Delete the Vehicle from the List?
            </v-col>
            <v-col cols="6">
              <v-btn size="small" color="green" block @click="onDeleteVehicle()"
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
  vehicle: {
    type: Object,
  },
});

const { setSnackbar } = useLocal();
const { mySite } = useFilter();
const { softDeleteVehicle, setVehicles } = useVehicle();
const isProgress = ref(false);
const confirmDialog = ref(false);

// async function onDeleteRoute() {
//   isProgress.value = true;

//   try {
//     const data = await deleteVPatrol(props.route!._id);
//     isProgress.value = false;
//     confirmDialog.value = false;

//     if (data) {
//       setSnackbar({
//         text: data.message,
//         modal: true,
//         type: data.success ? "success" : "error",
//       });
//     }

//     setVPatrols({ site: mySite.value });
//   } catch (err) {
//     confirmDialog.value = false;
//     setSnackbar({ text: err, modal: true, type: "error" });
//     isProgress.value = false;
//   }
// }

async function onDeleteVehicle() {
  isProgress.value = true;

  try {
    const data = await softDeleteVehicle(props.vehicle!._id, mySite.value);
    isProgress.value = false;
    confirmDialog.value = false;

    if (data) {
      setSnackbar({
        text: "Successfully Deleted The Vehicle Record!",
        modal: true,
        type: "success",
      });
    }

    setVehicles({ site: mySite.value });
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
