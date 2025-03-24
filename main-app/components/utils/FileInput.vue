<template>
  <div>
    <v-file-input
      v-model="files"
      labe="Image"
      accept="image/*"
      label="Select File"
      :prepend-icon="prependIcon"
      :loading="isFileUploading"
      hide-details
      show-size
      chips
      multiple
      clearable
      @update:modelValue="onFileSelect()"
      @click:clear="attachedFiles = []"
    >
      <template v-slot:append>
        <slot name="append">
          <v-btn color="primary" height="50px" @click="openCameraDialog()">
            <v-icon>mdi-camera</v-icon>
          </v-btn>
        </slot>
      </template>
    </v-file-input>
  </div>

  <!-- camera dialog -->
  <v-dialog
    v-model="showCameraDialog"
    transition="dialog-bottom-transition"
    width="800"
    max-width="800"
    persistent
    @after-enter="startCamera"
  >
    <v-container
      class="d-flex justify-center"
      max-height="90vh"
      width="800"
      max-width="800"
    >
      <v-card elevation="2" class="d-flex flex-column align-center pa-2">
        <v-toolbar>
          <v-card-title class="text-h5"> Take a Picture </v-card-title>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            icon="mdi-close"
            @click="closeCameraDialog()"
          ></v-btn>
        </v-toolbar>

        <div
          id="reader"
          class="d-flex justify-center align-center"
          style="
            position: relative;
            width: 500px;
            min-width: 400px;
            height: 400px;
          "
        >
          <video
            ref="video"
            style="flex: 1; height: 400px; min-width: 300px"
            class="video-shutter"
            autoplay
          ></video>
          <canvas
            ref="canvas"
            style="flex: 1; height: 400px; min-width: 300px; display: none"
          ></canvas>
          <div ref="flash" class="flash-effect"></div>
        </div>

        <v-row align="center" justify="center">
          <v-col cols="6"
            ><v-btn color="primary" icon class="mt-4" @click="switchCamera()">
              <v-icon>mdi-camera-switch</v-icon>
            </v-btn></v-col
          >
          <v-col cols="6"
            ><v-btn
              color="secondary"
              icon
              class="mt-4"
              @click="captureImageFromCamera()"
            >
              <v-icon large>mdi-camera-outline</v-icon>
            </v-btn></v-col
          >
        </v-row>
      </v-card>
    </v-container>
  </v-dialog>
</template>

<script setup lang="ts">
const { files, attachedFiles, isFileUploading, showUploadedFiles } =
  useUploadFiles();

const { setSnackbar } = useLocal();

const showCameraDialog = ref<boolean>(false);

const video = ref(null);
const canvas = ref(null);
const flash = ref(null);

const isCapturing = ref<boolean>(false);

const cameraFacingMode = ref<string>("environment");

const emit = defineEmits<{
  (event: "onFileAttach", payload: Array<{ data: File }>): void;
  (event: "onButtonClick"): void;
}>();

const props = defineProps({
  label: {
    type: String,
    default: null,
  },
  prependIcon: {
    type: String,
    default: "mdi-paperclip",
  },
  required: {
    type: Boolean,
    default: true,
  },
});

async function openCameraDialog() {
  showCameraDialog.value = true;
}

const closeCameraDialog = () => {
  showCameraDialog.value = false;
  stopCamera();
};

const startCamera = async () => {
  try {
    const videoElement: any = video.value;
    const constraints: any = {
      video: {
        facingMode: cameraFacingMode, // Use the current facing mode (front or back)
      },
    };

    // Request access to the camera
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = stream;
    videoElement.play();
  } catch (error: any) {
    setSnackbar({
      text: `Error accessing camera: ${error.message}`,
      type: "error",
      modal: true,
    });
  }
};

const switchCamera = async () => {
  await stopCamera();
  cameraFacingMode.value =
    cameraFacingMode.value === "environment" ? "user" : "environment";
  setSnackbar({
    text: `Switched to ${cameraFacingMode.value === "environment" ? "Back Camera" : "Front Camera"}`,
    modal: true,
    type: "info",
  });
  startCamera();
};

const shutterEffect = () => {
  const videoElement: any = video.value;

  // Briefly apply a flash effect using CSS
  videoElement.style.transition = "opacity 0.1s ease-in-out";
  videoElement.style.opacity = "0.1"; // Make the video almost invisible

  setTimeout(() => {
    videoElement.style.opacity = "1"; // Restore the video after the flash
  }, 100); // Flash duration
};

const stopCamera = async () => {
  const videoElement: any = video.value;
  const stream = videoElement.srcObject;
  if (stream) {
    stream.getTracks().forEach((track: any) => track.stop());
  }
};

const captureImageFromCamera = async () => {
  // Check if video and canvas refs are available
  if (video.value && canvas.value) {
    // Get video and canvas contexts

    setTimeout(() => {
      const videoElement: any = video.value;
      const canvasElement: any = canvas.value;
      if (canvasElement instanceof HTMLCanvasElement) {
        const context = canvasElement.getContext("2d");

        if (context) {
          // Draw the current frame from video onto the canvas
          context.drawImage(
            videoElement,
            0,
            0,
            canvasElement.width,
            canvasElement.height,
          );
          const imageDataUrl = canvasElement.toDataURL("image/png");
          const capturedImage = dataURLtoFile(imageDataUrl, "image.png");
          appendCapturedImage(capturedImage);
          shutterEffect();
          isCapturing.value = false;
        } else {
          console.error("Failed to get canvas context");
        }
      } else {
        console.error(
          "Canvas element reference is not a valid HTMLCanvasElement",
        );
      }
    }, 1000);
  } else {
    console.error("Video or Canvas element not found");
  }
};

function dataURLtoFile(dataUrl: any, filename: string) {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

async function appendCapturedImage(file: File) {
  files.value = [];
  files.value = [...files.value, file];
  await onFileSelect();
}

const onFileSelect = async () => {
  const newFiles = files.value.map((file: any) => ({
    name: file.name,
    data: file,
    progress: 0,
    url: URL.createObjectURL(file),
  }));

  attachedFiles.value = [...attachedFiles.value, ...newFiles];

  showUploadedFiles(attachedFiles.value);
};

// defineExpose({
//   addFileToInput,
// });
</script>
