<template>
  <v-carousel :show-arrows="imgUrls && imgUrls.length > 1">
    <v-carousel-item
      :class="clickable ? 'cursor-pointer' : ''"
      v-for="(url, idx) in imgUrls"
      :key="idx"
      :src="url"
      cover
      @click="clickable && emit('onClickCarousel', url)"
    >
      <template #placeholder>
        <v-skeleton-loader height="100%" width="100%" />
      </template>
      <div v-if="imgEditable" class="edit-btn">
        <v-btn color="primary" width="100px" @click="onImageEdit(url, idx)">
          <v-icon start>mdi-pencil</v-icon>
          Edit
        </v-btn>
      </div>
    </v-carousel-item>
  </v-carousel>
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
const { getImage } = useUtils();
const { attachedFiles } = useUploadFiles();
const emit = defineEmits<{
  (event: "onClickCarousel", url: string): void;
  (event: "onImageEdit", url: string, idx: number): void;
}>();

const props = defineProps<{
  urls?: string[] | any[];
  clickable?: boolean;
  imgEditable?: boolean;
  dataFiles?: File[];
}>();

const isShowImageEdit = ref(false);
const imageUrl = ref();
const imageIdx = ref();
// const images = ref<string[]>([]);

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

const imgUrls = computed(() => {
  if (props.urls && props.urls.length > 0) {
    return props.urls.map((u: any) => {
      if (u.split("/").length > 1) return u;
      else return `/api/files/${u}`;
    });
  }
});
</script>

<style scoped>
.edit-btn {
  position: absolute;
  bottom: 15%; /* Adjust as needed */
  right: 5%; /* Adjust as needed */
}
</style>
