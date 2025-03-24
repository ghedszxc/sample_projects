<template>
    <v-dialog
      v-model="showQRdialog"
      transition="dialog-bottom-transition"
      width="700"
      max-width="700"
      persistent
      @after-enter="startScanner"
    >
      <v-container class="d-flex justify-center" max-height="90vh">
        <v-card
          elevation="2"
          class="d-flex flex-column align-center pa-2 w-100 h-100"
          :style="
            $vuetify.display.xs
              ? 'max-width: 90vw;'
              : $vuetify.display.sm
                ? 'max-width: 80vw;'
                : 'max-width: 100%;'
          "
        >
          <v-toolbar class="w-100">
            <v-card-title class="text-h5">Scan QR Code</v-card-title>
            <v-spacer></v-spacer>
            <v-btn
              color="grey-darken-1"
              icon="mdi-close"
              @click="closeDialog"
            ></v-btn>
          </v-toolbar>
  
          <CameraReader @qr-scanned="handleScannedResult" @error="handleError" />
  
          <v-btn color="primary" icon class="mt-4" @click="switchCamera">
            <v-icon large>mdi-camera-switch</v-icon>
          </v-btn>
        </v-card>
      </v-container>
    </v-dialog>
  </template>
  
  <script setup>
  
  const props = defineProps({
    modelValue: Boolean,
  });
  
  const emit = defineEmits(['update:modelValue', 'qr-scanned']);
  const showNotFoundMessage = ref(false);
  const errorMessage = ref("");
  const cameraFacingMode = ref("environment");
  
  const showQRdialog = ref(props.modelValue);
  
  watch(() => props.modelValue, (newVal) => {
    showQRdialog.value = newVal;
  });
  
  watch(showQRdialog, (newVal) => {
    emit("update:modelValue", newVal);
  });
  
  const handleScannedResult = (result) => {
    showNotFoundMessage.value = false;
    emit('qr-scanned', result); 
  };
  
  const handleError = (errorMsg) => {
    showNotFoundMessage.value = true;
    errorMessage.value = errorMsg;
  };
  
  const closeDialog = () => {
    showQRdialog.value = false;
  };
  
  const switchCamera = async () => {
    cameraFacingMode.value =
      cameraFacingMode.value === "environment" ? "user" : "environment";
  };
  </script>
  