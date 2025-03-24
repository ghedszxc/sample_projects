<template>
  <v-row no-gutters justify="center">
    <v-col cols="12" sm="4" md="4" lg="3" xl="3">
      <v-row class="pb-4">
        <v-col cols="12" class="mt-4 font-weight-bold text-h5">
          Site Settings
        </v-col>

        <v-col cols="12">
          <span class="text-capitalize font-weight-bold"> Cover Photo </span>
          <input
            type="file"
            accept="image/*"
            @change="onUploadImage"
            :disabled="isProgress"
            class="mt-2"
          />

          <canvas
            ref="canvas"
            id="canvas"
            width="640"
            class="rounded-lg mt-4"
            height="480"
            style="position: relative; width: 100%; display: none"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="siteSetting.siteInformation.description"
            label="Description"
            :disabled="isProgress"
            rows="3"
          ></v-textarea>
        </v-col>

        <v-col cols="12">
          <span class="text-capitalize font-weight-bold"> Site Documents </span>

          <v-file-input
            v-model="files"
            label="File"
            variant="solo"
            density="compact"
            hide-details
            @change="onUploadFile"
            multiple
            :disabled="isProgress"
            class="mt-2"
          ></v-file-input>
          <v-list v-if="siteSetting.siteInformation?.docs" class="mt-2">
            <v-list-item
              v-for="(docs, index) in siteSetting.siteInformation?.docs"
              :key="index"
            >
              <v-row
                no-gutters
                class="fill-height"
                align-content="center"
                align="center"
              >
                <v-col cols="12">
                  <a target="_blank" :href="`/api/files/${docs.id}`">
                    <v-icon class="mr-2" size="x-small"> mdi-paperclip </v-icon>
                    {{ docs.name }}
                  </a>
                  <v-icon
                    class="ml-4"
                    size="x-small"
                    style="cursor: pointer"
                    @click="removeDoc(index)"
                  >
                    mdi-close
                  </v-icon>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="12" class="mt-4 text-end">
          <v-btn
            flat
            rounded="lg"
            color="#1867C0"
            class="px-6"
            @click="onsubmit()"
            :disabled="isProgress"
            :loading="isProgress"
          >
            Submit
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
const { setSnackbar } = useLocal();
const { siteSetting, getSiteSettingsById, updateSiteSettingsById } =
  useSiteSettings();
const { mySite } = useFilter();

const canvas = ref({});

const isProgress = ref(false);

// onMounted(() => {
//   siteSetting.value.siteInformation = {
//     bgImage: null,
//     description: null,
//     docs: [],
//   };
// });

onMounted(() => {
  if (siteSetting.value.siteInformation?.bgImage) {
    let image = `/api/files/${siteSetting.value.siteInformation?.bgImage}`;
    let base_image = new Image();
    base_image.src = image;
    base_image.onload = function () {
      canvas.value.getContext("2d").drawImage(base_image, 0, 0, 640, 480);
      canvas.value.style.display = "";
    };
  }
});

function removeDoc(index: number) {
  siteSetting.value.siteInformation?.docs &&
    siteSetting.value.siteInformation?.docs.splice(index, 1);
}

async function onsubmit() {
  try {
    isProgress.value = true;

    await updateSiteSettingsById(
      siteSetting.value._id || "",
      siteSetting.value,
    );

    setSnackbar({
      text: "Site Settings updated",
      modal: true,
    });

    files.value = [];
  } catch (error: any) {
    isProgress.value = false;

    setSnackbar({
      text: error.message,
      modal: true,
      type: "error",
    });
  } finally {
    isProgress.value = false;
  }
}

const files = ref<File[]>([]);

async function onUploadImage(event: any) {
  if (event.target.files[0] != null) {
    let image = event.target.files[0];
    let base_image = new Image();
    base_image.src = URL.createObjectURL(image);
    base_image.onload = function () {
      canvas.value.getContext("2d").drawImage(base_image, 0, 0, 640, 480);
      canvas.value.style.display = "";

      requestStorageApi("image", [
        {
          name: event.target.name,
          data: image,
          progress: 0,
          url: URL.createObjectURL(image),
        },
      ]);
    };
  }
}

async function onUploadFile() {
  const filteredFiles = files.value.map((item: any) => {
    return {
      name: item.name,
      data: item,
      progress: 0,
      url: URL.createObjectURL(item),
    };
  });

  requestStorageApi("docs", filteredFiles);
}

async function requestStorageApi(fileType: string, attachments: []) {
  isProgress.value = true;

  for (let i = 0; i < attachments.length; i++) {
    const formData = new FormData();
    formData.append("file", attachments[i].data);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/files/upload?status=draft");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        attachments[i].progress = Math.round(
          (event.loaded / event.total) * 100,
        );
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        isProgress.value = false;
        const response = JSON.parse(xhr.responseText);
        if (fileType == "docs") {
          if (siteSetting.value.siteInformation?.docs) {
            siteSetting.value.siteInformation.docs.push({
              id: response.id,
              name: attachments[i].name,
            });
          } else {
            siteSetting.value.siteInformation.docs = [
              {
                id: response.id,
                name: attachments[i].name,
              },
            ];
          }
        } else {
          siteSetting.value.siteInformation.bgImage = response.id;
        }
      }
    };
    xhr.send(formData);
  }
}
</script>
