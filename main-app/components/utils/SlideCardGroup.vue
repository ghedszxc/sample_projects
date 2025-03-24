<template>
  <v-sheet class="mx-auto">
    <v-slide-group class="pa-1" show-arrows>
      <v-slide-group-item
        v-for="(data, idx) in localDataFiles"
        :key="idx"
        v-slot="{ isSelected }"
      >
        <v-card
          :class="['ma-1', isSelected && 'selected']"
          width="150"
          height="100"
          @click="clickable && emit('onClickCarousel', data.path)"
          class="rounded-lg border-thin"
          border=" opacity-50 thin "
        >
          <v-btn
            icon
            variant="text"
            size="x-small"
            class="remove-btn pa-0 ma-0"
            @click.stop="removeFile(data)"
          >
            <v-icon color="red" class="pa-0 ma-0" size="x-large"
              >mdi-close-circle</v-icon
            >
          </v-btn>
          <!-- File Icons -->

          <v-img :src="data.url" cover height="200">
            <template #placeholder>
              <v-skeleton-loader height="100%" width="100%" />
            </template>
          </v-img>
          <!-- <template v-if="url.type !== 'image'">
            <div
              class="d-flex fill-height align-center justify-center flex-column"
            >
              <v-icon
                :icon="getFileIcon(url.type)"
                size="64"
                :color="getFileColor(url.type)"
              ></v-icon>
            </div>
          </template>



          <template v-else>
            <v-img :src="url.path" cover height="200">
              <template #placeholder>
                <v-skeleton-loader height="100%" width="100%" />
              </template>
            </v-img>
          </template> -->

          <!-- Edit Button -->
          <!-- <div v-if="imgEditable" class="edit-btn">
            <v-btn
              color="primary"
              size="small"
              @click.stop="onImageEdit(url.path, idx)"
            >
              <v-icon start>mdi-pencil</v-icon>
              Edit
            </v-btn>
          </div>  -->
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>

  <BaseDrawImage
    v-if="isShowImageEdit"
    :is-show-dialog="isShowImageEdit"
    :image-url="imageUrl"
    :image-idx="imageIdx"
    @on-submit="onImageSubmitEdit"
    @on-close-dialog="isShowImageEdit = false"
  />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const { getImage } = useUtils();
const { attachedFiles } = useUploadFiles();

const emit = defineEmits<{
  (event: "onClickCarousel", url: string): void;
  (event: "onImageEdit", url: string, idx: number): void;
  (event: "onFileRemove"): void;
}>();

const props = defineProps<{
  clickable?: boolean;
  imgEditable?: boolean;
  dataFiles?: File[];
}>();
const localDataFiles = ref([...props.dataFiles]);
const isShowImageEdit = ref(false);
const imageUrl = ref("");
const imageIdx = ref(0);

const getFileType = (url: string) => {
  const extension = url.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) return "image";
  if (["pdf"].includes(extension)) return "pdf";
  if (["doc", "docx"].includes(extension)) return "word";
  return "other";
};

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return "mdi-file-pdf-box";
    case "word":
      return "mdi-file-word-box";
    default:
      return "mdi-file-outline";
  }
};

const getFileColor = (type: string) => {
  switch (type) {
    case "pdf":
      return "red";
    case "word":
      return "blue";
    default:
      return "grey";
  }
};

const onImageEdit = (url: string, idx: number) => {
  isShowImageEdit.value = true;
  imageUrl.value = url;
  imageIdx.value = idx;
};

const onImageSubmitEdit = async (url: string, idx: number) => {
  const response = await getImage(url);
  if (!response) return;
  attachedFiles.value[idx].data = new File(
    [response],
    attachedFiles.value[idx].data?.name,
  );
  attachedFiles.value[idx].url = url;
  isShowImageEdit.value = false;
};

const isImageFile = (type: string) => {
  return type?.startsWith("image/");
};

watch(
  () => props.dataFiles,
  (newDataFiles) => {
    localDataFiles.value = [...newDataFiles];
  },
);

const removeFile = (file) => {
  const index = localDataFiles.value.findIndex(
    (dataFile) => dataFile.id === file.id,
  );

  if (index !== -1) {
    localDataFiles.value.splice(index, 1);
    emit("onFileRemove", file);
  }
};
</script>

<style scoped>
.edit-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
}

.selected {
  border: 2px solid var(--v-theme-primary);
}

.remove-btn {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 2;
}
</style>
