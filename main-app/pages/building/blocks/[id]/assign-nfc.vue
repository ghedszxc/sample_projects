<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card width="100%" elevation="3" height="100%">
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>
        <v-card-title class="pt-3 font-weight-bold">
          <back-button></back-button>
          Assign NFC
        </v-card-title>
        <v-divider></v-divider>
        <v-col cols="12">
          <v-tabs grow v-model="tab" color="#0077b6" height="60px">
            <v-tab value="individual"
              ><span class="font-weight-bold"> Assign Individual </span></v-tab
            >
            <v-tab value="multiple"
              ><span class="font-weight-bold">Assign Multiple</span></v-tab
            >
            <v-tab value="qr-code"
              ><span class="font-weight-bold">Assign QR Code</span></v-tab
            >
          </v-tabs>
        </v-col>
        <v-tabs-window v-model="tab">
          <!-- Assign Individual tab -->
          <v-tabs-window-item value="individual">
            <entry-pass-assign-individual-tab @submit="submitIndividual" />
          </v-tabs-window-item>
          <!-- Assign Multiple tab -->
          <v-tabs-window-item value="multiple">
            <entry-pass-assign-multiple-tab
              @add-nfc-card="setDialog('addNFCCard')"
            />
          </v-tabs-window-item>
          <!-- Assign QR Code tab -->
          <v-tabs-window-item value="qr-code">
            <entry-pass-assign-qr-code-tab
              @add-q-r-code-access="setDialog('addQRCodeAccess')"
            />
          </v-tabs-window-item>
        </v-tabs-window>
        <entry-pass-add-nfc-card-dialog />
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const {
  accessCard,
  addAssignNFC,
  isAssigningNFC,
  setAccessCards,
  openDialog,
  setQrAccessCards,
} = useEntryPass();
const { mySite } = useFilter();
const { setSnackbar } = useLocal();
const route = useRoute();
const tab = ref("individual");

const unitOwner = computed(() => route.params.id);

onMounted(async () => {
  await setAccessCards();
  await setQrAccessCards();
});

function setDialog(dialog: "addNFCCard" | "addQRCodeAccess") {
  openDialog.value = dialog;
}

async function submitIndividual(data: any) {
  try {
    isAssigningNFC.value = true;
    const result = await addAssignNFC({
      site: mySite.value,
      accessCard: data,
      userId: unitOwner.value as string,
    });

    if (result) {
      setSnackbar({
        text: "Access Card has been assigned successfully.",
        modal: true,
        type: "success",
      });
    }

    isAssigningNFC.value = false;
  } catch (error) {
    isAssigningNFC.value = false;
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}
</script>
<style scoped>
:deep() .v-slide-group__content {
  border-bottom: 2px #e0e0e0 solid;
}
</style>
