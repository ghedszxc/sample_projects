<template>
  <div v-if="incident" class="pa-8">
    <div class="w-100">
      <div class="font-weight-bold text-h6 mb-4">Brief Summary</div>
      <div class="my-3">
        Must include the following answers to
        <span class="font-weight-bold"
          >What happened?, Where did it happened?, Who was involved, How did it
          happened?, Why did it happened?, Is there any security implications
          due to incident ?</span
        >
      </div>

      <v-textarea
        v-model="incident.briefSummary"
        label="Brief Summary"
        class="my-5"
        :loading="isSummary"
        :disabled="isSummary"
        density="comfortable"
        clearable
        no-resize
        :rules="[requiredInput]"
      ></v-textarea>
    </div>

    <v-divider />

    <div class="w-100">
      <div class="my-3">
        Add Images related to the incident
        <span class="font-weight-bold">allow multiple photo attachment</span>
      </div>

      <v-btn @click="selectAttachment()" variant="tonal"> Attach Photo </v-btn>
      <v-row no-gutters class="mt-4" v-if="files && files.length > 0">
        <template
          v-for="(fileItem, fileIndex) in uploadedAttachments"
          :key="fileIndex"
        >
          <v-col cols="12">
            <code class="mr-2">{{ fileItem.name }}</code>
            <v-progress-circular
              v-if="fileItem.progress < 100"
              :size="15"
              model-value="fileItem.progress"
              :width="4"
              color="primary"
            ></v-progress-circular>

            <v-btn
              v-else
              density="compact"
              variant="text"
              icon="mdi-close"
              @click="deleteAttachment(fileItem.id)"
            ></v-btn>
          </v-col>
        </template>
      </v-row>
      <v-row no-gutters v-if="incident.photos && incident.photos.length > 0">
        <template v-for="(uploadedPhoto, idx) in incident.photos" :key="idx">
          <v-col cols="12">
            <code class="mr-2">{{ uploadedPhoto.name }}</code>
            <v-progress-circular
              v-if="uploadedPhoto.progress < 100"
              :size="15"
              model-value="fileItem.progress"
              :width="4"
              color="primary"
            ></v-progress-circular>

            <v-btn
              v-else
              density="compact"
              variant="text"
              icon="mdi-close"
              @click="deleteIncidentPhotos(idx, uploadedPhoto.id)"
            ></v-btn>
          </v-col>
        </template>
      </v-row>

      <v-file-input
        v-show="false"
        v-model="files"
        multiple
        class="attachment-input"
        @change="onFileChange"
      ></v-file-input>
    </div>
  </div>
</template>

<script setup lang="ts">
const { incident, photoId, isSummary } = useIncident();
const { requiredInput } = useUtils();
const { setSnackbar } = useLocal();
let props = defineProps({
  incident: {
    type: Object,
  },
  uploadedAttachments: {
    type: Array,
  },
});

type TFile = {
  name: string;
  data: File;
  progress: number;
  id?: string;
};

const files = ref<File[]>([]);

async function deleteIncidentPhotos(photoIdx: number, id: string) {
  incident.value.photos && incident.value.photos.splice(photoIdx, 1);
  photoId.value = id;
}

const selectAttachment = () => {
  const input = document.querySelector(
    ".attachment-input input",
  ) as HTMLInputElement;
  input.click();
};

const deleteAttachment = async (id: string) => {
  const { error, data } = await useLocalFetch(`/api/files/${id}`, {
    method: "DELETE",
  });

  if (error && error.value) {
    setSnackbar({ text: error, modal: true, type: "error" });
  } else {
    const index = props.uploadedAttachments.findIndex((file) => file.id === id);
    props.uploadedAttachments.splice(index, 1);
  }
};

const onFileChange = () => {
  const uploadProgress = ref(0);
  if (files.value.length > 0) {
    files.value.forEach((file) => {
      props.uploadedAttachments.push({
        name: file.name,
        data: file,
        progress: 0,
      });
    });

    for (let i = 0; i < props.uploadedAttachments.length; i++) {
      const formData = new FormData();
      formData.append("file", props.uploadedAttachments[i].data);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/files/upload?status=draft");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          props.uploadedAttachments[i].progress = Math.round(
            (event.loaded / event.total) * 100,
          );
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          props.uploadedAttachments[i].id = response.id;
        }
      };

      xhr.send(formData);
    }
  }
};
</script>
