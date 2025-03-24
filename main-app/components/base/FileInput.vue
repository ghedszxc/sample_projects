<template>
  <div>
    <div class="text-subtitle-1 text-medium-emphasis">{{ label }}</div>
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
    >
      <template v-slot:append>
        <slot name="append">
          <v-btn
            :color="$vuetify.display.mdAndDown ? '#1867C0' : '#1867C0'"
            height="50px"
            @click="handleButtonClick()"
          >
            <v-icon>mdi-camera</v-icon>
          </v-btn>
        </slot>
      </template>
    </v-file-input>
  </div>
</template>

<script setup lang="ts">
const { isFileUploading, showUploadedFiles } = useVisitor();

const files = ref<File[]>([]);
const fileString = ref<Array<{ data: File }>>([]);

const emit = defineEmits<{
  (event: "onFileAttach", payload: Array<{ data: File }>): void;
  (event: "onButtonClick"): void;
}>();

const props = defineProps({
  label: {
    type: String,
    default: "Attach Image",
  },
  prependIcon: {
    type: String,
    default: "mdi-paperclip",
  },
});

const onFileSelect = async () => {
  //upload files immediately, then get the file ids
  fileString.value = files.value.map((file: any) => ({
    name: file.name,
    data: file,
    progress: 0,
    url: URL.createObjectURL(file),
  }));
  showUploadedFiles(fileString.value);
  emit("onFileAttach", fileString.value);
};

function handleButtonClick() {
  emit("onButtonClick");
}

// Function to add a captured image to the file input
const addFileToInput = async (file: File) => {
  files.value = [...files.value, file];
  await onFileSelect();
};

defineExpose({
  addFileToInput,
});
</script>
