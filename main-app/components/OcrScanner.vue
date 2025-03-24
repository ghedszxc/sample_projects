<template>
  <v-dialog v-model="isShowDialog" fullscreen @after-enter="startNricScanner">
    <v-card
      elevation="2"
      class="d-flex flex-column align-center pa-0"
      style="height: 100vh; overflow: hidden"
    >
      <v-toolbar
        :color="theme === 'dark' ? 'grey-darken-4' : 'white'"
        dense
        flat
      >
        <v-card-title class="text-h5"
          >Scan NRIC
          <span class="text-green" v-if="isLoading"
            >"Scanning..."</span
          ></v-card-title
        >
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          icon="mdi-close"
          @click="closeNricScan"
        ></v-btn>
      </v-toolbar>

      <!-- Full-screen video with fixed 1080px resolution -->
      <div
        style="
          position: relative;
          width: 100%;
          height: calc(100% - 56px);
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: black;
        "
      >
        <video
          playsinline
          muted
          autoplay
          ref="ivideo"
          width="1920"
          height="1080"
          style="max-width: 100%; max-height: 100%; object-fit: cover"
        ></video>
      </div>

      <!-- Buttons overlaid on video -->
      <div
        style="
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 16px;
        "
      >
        <v-btn
          color="primary"
          icon
          :loading="isLoading"
          :disabled="isLoading"
          @click="captureAndSendImage"
        >
          <v-icon large>mdi-camera-outline</v-icon>
        </v-btn>
        <v-btn
          color="secondary"
          icon
          :disabled="isLoading"
          @click="switchCamera"
        >
          <v-icon large>mdi-camera-switch</v-icon>
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import cv from "@techstark/opencv-js";

const { setSnackbar } = useLocal();
const { getScannedNricInfo } = useVisitor();
const emit = defineEmits<{
  (event: "onHideDialog", payload: any): void;
  (event: "onScanning", payload: boolean): void;
}>();
const props = defineProps({
  isNricScanning: {
    type: Boolean,
    default: false,
  },
});
// Reactive variables
const cameraFacingMode = ref("environment");
const theme = ref<"light" | "dark">("light");
const ivideo = ref<HTMLVideoElement | null>(null);
const isLoading = ref(false);
const isShowDialog = computed(() => props.isNricScanning);

// Capture and send the image to the backend
const captureAndSendImage = async () => {
  try {
    emit("onScanning", true);
    isLoading.value = true;
    // Capture image from the video stream
    const imageDataUrl = await captureImage();
    const imageFile = dataURLtoFile(imageDataUrl, "nric_card.png");

    // Send image to the backend
    const scanNric = await getScannedNricInfo(imageFile);
    console.log("🚀 ~ captureAndSendImage ~ scanNric:", scanNric);
    const { result } = scanNric!;
    // Show success message
    setSnackbar({
      text: "NRIC successfully captured.",
      type: "success",
      modal: true,
    });
    closeNricScan(result);
  } catch (error: any) {
    setSnackbar({
      text: error || error.message || "Failed to capture image.",
      type: "error",
      modal: true,
    });
  } finally {
    emit("onScanning", false);
    isLoading.value = false;
  }
};

// Capture image from video
const captureImage = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const videoElement = ivideo.value;
    if (!videoElement) {
      reject("Video element not found");
      return;
    }

    // Create a canvas to capture the frame
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      reject("Failed to get canvas context");
      return;
    }

    // Set the canvas dimensions to match the video element
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Ensure OpenCV is loaded before using this code
    // Convert canvas to OpenCV Mat object
    const src = cv.imread(canvas);

    // Create an empty Mat object to hold intermediate and final results
    const dst = new cv.Mat();

    // Resize the image to a fixed size (600x600)
    const dsize = new cv.Size(600, 600);
    cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA);

    // Convert the resized image to grayscale
    const gray = new cv.Mat();
    cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY);

    cv.imshow(canvas, gray);

    resolve(canvas.toDataURL("image/png"));
    // Free memory used by other Mat objects
    src.delete();
    dst.delete();
    gray.delete();
    stopNricScanner();
  });
};

// Convert data URL to File
const dataURLtoFile = (dataURL: string, filename: string): File => {
  const [header, base64Data] = dataURL.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "";
  const binary = atob(base64Data);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  const blob = new Blob([new Uint8Array(array)], { type: mime });
  return new File([blob], filename, { type: mime });
};

// Close the NRIC scanning dialog
const closeNricScan = (result: any) => {
  stopNricScanner();
  emit("onHideDialog", result);
};

const startNricScanner = async () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: cameraFacingMode.value,
        },
        audio: false,
      })
      .then((stream) => {
        ivideo.value!.style.display = "";
        ivideo.value!.srcObject = stream;
        ivideo.value!.play();
      });
  }
};

const stopNricScanner = async () => {
  // const videoElement = ivideo.value;

  if (ivideo.value) {
    const stream = ivideo.value.srcObject as MediaStream | null;

    if (stream) {
      const tracks = stream.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });
    }

    ivideo.value.srcObject = null;
  }
};

// Switch the camera
const switchCamera = () => {
  cameraFacingMode.value =
    cameraFacingMode.value === "user" ? "environment" : "user";
  stopNricScanner(); // Stop the current camera stream
  startNricScanner(); // Start the camera with the new facing mode
};
</script>
