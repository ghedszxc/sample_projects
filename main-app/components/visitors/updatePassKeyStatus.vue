<template>
  <div>
    <v-list-item @click.stop="confirmDialog = true">
      Return Pass & Keys
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

            <v-col
              v-if="visitorInfo.members !== null"
              cols="12"
              class="text-center pt-0"
            >
              Are you sure you want to return pass & keys?
              <v-row align="center" justify="center" class="mt4 pt-2"
                ><span style="color: red"
                  >*This will return members passes also</span
                ></v-row
              >
            </v-col>
            <v-col cols="6">
              <v-btn size="small" color="green" block @click="onUpdateStatus()"
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
  visitorInfo: {
    type: Object,
  },
});

const { setSnackbar } = useLocal();
const { visitors, updateVisitorPassStatusById, updateVisitorKeyStatusById } =
  useVisitor();

const isProgress = ref(false);
const confirmDialog = ref(false);

async function onUpdateStatus() {
  isProgress.value = true;

  try {
    const result = await Promise.all([
      updateVisitorPassStatusById(
        props.visitorInfo._id!,
        (props.visitorInfo.isPassReturned = true),
        props.visitorInfo.visitorPass._id!,
        props.visitorInfo.members !== null
          ? props.visitorInfo.memberPassDetails.map((p) => p._id)
          : [],
      ),
      updateVisitorKeyStatusById(
        props.visitorInfo._id!,
        (props.visitorInfo.isKeyReturned = true),
      ),
    ]);

    updateSelectedContractorFromTable(result[0]);
    setSnackbar({
      text: `Success returning pass & keys.`,
      modal: true,
      type: "success",
    });
    isProgress.value = false;
    confirmDialog.value = false;
  } catch (err) {
    setSnackbar({ text: err, modal: true, type: "error" });
    isProgress.value = false;
  }
}

async function updateSelectedContractorFromTable(data: any) {
  const findContractor = visitors.value.findIndex(
    (find: any) => find._id == data._id,
  );

  if (findContractor != -1) visitors.value[findContractor] = data;
}
</script>
