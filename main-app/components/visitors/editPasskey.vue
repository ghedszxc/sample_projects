<template>
  <v-dialog
    v-model="editPasskeysDialog"
    transition="dialog-right-transition"
    fullscreen
    persistent
    :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
  >
    <v-card
      v-if="contractorInfo"
      :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
      :class="`${theme == 'light' && 'bg-white'} px-3 h-100 ${$vuetify.display.mdAndUp && 'rounded-s-xl'}`"
    >
      <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
        <span class="font-weight-bold pl-4 pt-1 text-capitalize"
          >Add Pass & Keys</span
        >
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          icon="mdi-close"
          @click="onCloseDialog()"
        ></v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text v-if="contractorInfo">
        <v-row>
          <v-col cols="12" :class="`${addVisitorSteps == 1 && 'mb-12'}`">
            <v-img
              :src="`/images/${addVisitorSteps == 1 ? 'visitor-contractor.svg' : 'confirmation.svg'}`"
              height="125"
            />
          </v-col>

          <v-col cols="12" v-if="addVisitorSteps == 1">
            <v-row>
              <v-col cols="12">
                <v-row class="px-3 pb-4" justify="space-between">
                  <span class="font-weight-bold"> Pass Information </span>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="contractorInfo.visitorPass._id"
                  label="Pass Type"
                  :items="passList"
                  item-title="name"
                  item-value="_id"
                  density="comfortable"
                  hide-details
                  :disabled="isProgress"
                  @update:modelValue="onSelectPassType()"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <span class="font-weight-bold"> Pass Keys </span>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="contractorInfo.passKeys"
                  :items="keys"
                  item-title="name"
                  item-value="_id"
                  label="Pass Keys"
                  density="comfortable"
                  hide-details
                  :disabled="isProgress"
                  clearable
                  multiple
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index < 2" size="x-small">
                      <span>{{ item.title }}</span>
                    </v-chip>
                    <span
                      v-if="index === 2"
                      class="text-grey text-caption align-self-center"
                    >
                      (+{{ (contractorInfo.passKeys || []).length - 2 }} others)
                    </span>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" v-if="addVisitorSteps == 2">
            <div class="text-center mt-6 text-subtitle-1 font-weight-bold">
              Great!
            </div>
            <div class="text-center mt-2 text-caption">
              A update pass & keys from contractor
            </div>
            <v-row class="px-3 mt-5" justify="space-between">
              <v-col cols="12">
                <v-btn
                  color="grey-lighten-4"
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

          <v-col cols="12">
            <v-btn
              v-if="addVisitorSteps == 1"
              block
              color="blue-darken-3"
              size="small"
              variant="flat"
              style="height: 40px"
              @click="submit()"
              :disabled="isProgress"
            >
              Update
            </v-btn>
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
const { theme } = useLocal();
const {
  contractorInfo,
  editPasskeysDialog,
  addVisitorSteps,
  updateContractorPassKeys,
  visitors,
} = useVisitor();
const { passList, keyList } = useKey();
const { setSnackbar } = useLocal();

const isProgress = ref(false);

const keys = computed(() => {
  return keyList.value.map((k: { codes: string | any[]; code: any }) => {
    const codes = k.codes || [];
    if (k.codes && k.codes.length > 0 && !k.code) {
      return {
        ...k,
        code: codes[0],
      };
    }
    return k;
  });
});

async function onCloseDialog() {
  editPasskeysDialog.value = false;
  addVisitorSteps.value = 1;
}

async function onSelectPassType() {
  contractorInfo.value.passKeyNumber = "";
}

async function submit() {
  try {
    isProgress.value = true;

    const payload: any = {
      visitorPass: contractorInfo.value.visitorPass._id,
      passKeys: contractorInfo.value.passKeys,
      passKeyNumber: contractorInfo.value.passKeyNumber,
    };
    const result = await updateContractorPassKeys(
      contractorInfo.value._id,
      payload,
    );

    setSnackbar({
      text: "Successful update contractor information",
      modal: true,
      type: "success",
    });

    const findVisitor = visitors.value.findIndex(
      (find: any) => find._id == contractorInfo.value._id,
    );
    if (findVisitor != -1) visitors.value[findVisitor] = result;
    addVisitorSteps.value++;
    isProgress.value = false;
  } catch (err) {
    setSnackbar({ text: err, modal: true, type: "error" });
    isProgress.value = false;
  }
}
</script>

<style scoped>
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
</style>
