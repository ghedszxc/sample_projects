<template>
  <div
    id="qr-reader"
    class="d-flex justify-center align-center w-100 h-100"
    style="height: calc(100vh - 64px)"
  ></div>
</template>

<script setup>
const emit = defineEmits(["qr-scanned", "error"]);

const html5QrCodeInstance = ref(null);
const cameraFacingMode = ref("environment");
const { $Html5Qrcode } = useNuxtApp();

const startScanner = async () => {
  if (html5QrCodeInstance.value) return;

  const config = { fps: 10, qrbox: { width: 250, height: 250 } };
  html5QrCodeInstance.value = new $Html5Qrcode("qr-reader");

  html5QrCodeInstance.value
    .start(
      { facingMode: cameraFacingMode.value },
      config,
      (qrCodeMessage) => {
        emit("qr-scanned", qrCodeMessage);
      },
      (msg) => {
        console.error(msg);
        emit("error", msg);
      },
    )
    .catch((err) => {
      console.error(`Unable to start scanning, error: ${err}`);
      emit("error", err);
    });
};

const stopScanner = () => {
  return new Promise((resolve, reject) => {
    if (html5QrCodeInstance.value) {
      html5QrCodeInstance.value
        .stop()
        .then(() => {
          html5QrCodeInstance.value.clear();
          html5QrCodeInstance.value = null;
          resolve();
        })
        .catch((err) => {
          console.error("Unable to stop scanning.", err);
          reject(err);
        });
    } else {
      resolve();
    }
  });
};

onMounted(() => {
  startScanner();
});

onBeforeUnmount(() => {
  stopScanner();
});
</script>
