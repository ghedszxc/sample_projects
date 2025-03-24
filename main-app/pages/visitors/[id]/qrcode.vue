<template>
    <div ref="qrCode"></div>
</template>
  
<script setup lang="ts">
import type QRCodeStyling from "qr-code-styling";

const { $qrCodeStyling } = useNuxtApp();
const qrCode = ref<HTMLElement | null>(null);
  
// Default options
const options = {
    width: 300,
    height: 300,
    type: "svg",
    data: 'https://fliqr.codes',
    image: "https://fliqr.codes/fliqr.svg",
    dotsOptions: {
        color: "#000",
        type: "rounded"
    },
    backgroundOptions: {
        color: "#fff",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 10
    }
};
  
const qrCodeStyling: QRCodeStyling = $qrCodeStyling(options);
  
onMounted(() => {
    // Append QR code to DOM element
    qrCodeStyling.append(qrCode.value);
    // Add viewbox to make it resizable
    qrCode.value!.firstChild!.setAttribute('viewBox', '0 0 300 300');
});
  
//   watch(() => props.data, (newValue: string) => {
//     // Update QR code data when props change
//     options.data = newValue;
//     qrCodeStyling.update(options);
//     // Add viewbox to make it resizable
//     qrCode.value!.firstChild!.setAttribute('viewBox', '0 0 300 300');
//   });
</script>