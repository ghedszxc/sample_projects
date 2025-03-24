<template>
  <div>
    <v-file-input
      v-model="files"
      :label="label"
      accept="image/*"
      :prepend-icon="prependIcon"
      :loading="isFileUploading"
      hide-details
      show-size
      chips
      multiple
      clearable
      @update:modelValue="handleFileSelect"
      @click:clear="handleClear"
      :hide-input="hasHideInput"
    >
      <template v-slot:append v-if="hasLabel">
        <slot name="append">
          <v-btn color="primary" height="50px" @click="openCameraDialog">
            <v-icon>mdi-camera</v-icon>
          </v-btn>
        </slot>
      </template>
    </v-file-input>

    <v-row no-gutters v-if="hasLabel">
      <v-col cols="12" class="mt-1">
        <v-chip-group column>
          <template v-for="(file, index) in files" :key="file.name">
            <v-chip
              closable
              class="text-wrap text-caption custom-chip"
              @click:close="removeFile(index)"
            >
              <span class="chip-text">{{ file.name }}</span>
            </v-chip>
          </template>
        </v-chip-group>
      </v-col>
    </v-row>

    <!-- Camera Dialog -->
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
            <v-card-title class="text-h5">Take a Picture</v-card-title>
            <v-spacer></v-spacer>
            <v-btn
              color="grey-darken-1"
              icon="mdi-close"
              @click="closeCameraDialog"
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
          </div>

          <v-row align="center" justify="center">
            <v-col cols="6">
              <v-btn color="primary" icon class="mt-4" @click="switchCamera">
                <v-icon>mdi-camera-switch</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                color="secondary"
                icon
                class="mt-4"
                @click="captureImageFromCamera"
              >
                <v-icon large>mdi-camera-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
interface FileWithPreview {
  name: string;
  data: File;
  progress: number;
  url: string;
}

const props = defineProps({
  label: {
    type: String,
    default: "Select File",
  },
  prependIcon: {
    type: String,
    default: "mdi-paperclip",
  },
  required: {
    type: Boolean,
    default: true,
  },
  initFiles: {
    type: Array,
  },
  hasLabel: {
    type: Boolean,
    default: true,
  },
  hasHideInput: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (event: "onFileAttach", payload: Array<{ data: File }>): void;
  (event: "update:files", files: FileWithPreview[]): void;
  (event: "onFileRemoved", payload: { index: number; file: File }): void;
  (event: "onClear"): void;
}>();

const { isFileUploading, showUploadedFiles } = useUploadFiles();

const { setSnackbar } = useLocal();
const files = ref<File[]>([]);
const attachedFiles = ref<FileWithPreview[]>([]);
const showCameraDialog = ref(false);
const video = ref<HTMLVideoElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const cameraFacingMode = ref<"environment" | "user">("environment");

watchEffect(() => {
  if (Array.isArray(props.initFiles) && props.initFiles.length > 0) {
    files.value = props.initFiles.filter((file) => file && file.name); // Ensure valid files
  }
});
const handleFileSelect = async () => {
  if (files.value && files.value.length > 0) {
    const newFiles = files.value.map((file: File) => ({
      name: file.name,
      data: file,
      progress: 0,
      url: URL.createObjectURL(file),
    }));

    //   attachedFiles.value = [...newFiles];
    showUploadedFiles(newFiles);

    emit("update:files", newFiles);
  } else {
    files.value = [...(props.initFiles as typeof files.value)];
  }
};

const handleClear = () => {
  files.value = [];
  emit("onClear");
};

const openCameraDialog = () => {
  showCameraDialog.value = true;
};

const closeCameraDialog = () => {
  showCameraDialog.value = false;
  stopCamera();
};

const startCamera = async () => {
  try {
    const constraints = {
      video: {
        facingMode: cameraFacingMode.value,
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    if (video.value) {
      video.value.srcObject = stream;
      video.value.play();
    }
  } catch (error: any) {
    setSnackbar({
      text: `Error accessing camera: ${error.message}`,
      type: "error",
      modal: true,
    });
    closeCameraDialog();
  }
};

const stopCamera = () => {
  if (video.value) {
    const stream = video.value.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
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

const captureImageFromCamera = () => {
  if (!video.value || !canvas.value) return;

  const context = canvas.value.getContext("2d");
  if (!context) return;

  // Set canvas dimensions to match video
  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoHeight;

  // Capture the frame
  context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);

  // Convert to file
  canvas.value.toBlob((blob) => {
    if (!blob) return;

    const file = new File([blob], `camera-capture-${Date.now()}.png`, {
      type: "image/png",
    });

    files.value = [file];
    handleFileSelect();
    closeCameraDialog();
  }, "image/png");
};

const removeFile = (index) => {
  const removedFile = files.value[index];
  files.value = files.value.filter((_, i) => i !== index);
  emit("onFileRemoved", { index, file: removedFile }); // Emit when a file is removed
  // emit("onFilesUpdated", files.value); // Emit updated files list
};

// Cleanup
onUnmounted(() => {
  stopCamera();
});
</script>

<style scoped>
.custom-chip {
  max-width: 100%;
  height: auto !important;
  white-space: normal;
  padding: 3px 20px;
}

.chip-text {
  word-break: break-word;
  white-space: normal;
  line-height: 1.2;
}
</style>
