<template>
  <v-row no-gutters class="px-6">
    <!-- header -->

    <v-col cols="12" class="header mt-6">
      <v-icon
        start
        size="x-large"
        @click="goBack()"
        style="position: relative; right: 5px"
      >
        <v-img
          class="pl-0 ml-0 mt-1"
          src="/dark-mode/utility-all/right-arrow.svg"
          cover
        ></v-img>
      </v-icon>
      <span
        style="position: relative; right: 15px; bottom: 1px"
        :class="textBackColor"
      >
        Profile Picture</span
      >
    </v-col>

    <!-- title-->
    <v-col cols="12" class="mt-8">
      <v-row no-gutters>
        <span class="title font-weight-bold mt-1" :class="textBackColor">
          Profile Picture
        </span>
        <v-spacer></v-spacer>
        <v-chip variant="flat" class="pa-4 chip-shadow" color="#EB261E">
          Step
          <span class="ml-1"> 3 </span>
          /5
        </v-chip>
      </v-row>
    </v-col>

    <!-- image -->
    <v-col cols="12" class="mt-6">
      <v-card
        color="#111723"
        variant="outlined"
        rounded="xl"
        :style="`border: 1px solid var(--black-02, rgba(0, 0, 0, 0.2));box-shadow: 0px 0px 14px 0px rgba(255, 255, 255, 0.10) 
        ${!file.length ? '' : ''}`"
      >
        <v-row
          no-gutters
          class="fill-height"
          align-content="center"
          justify="center"
        >
          <v-img
            :src="
              !file.length
                ? resident.profilePicture
                  ? `/api/files/${resident.profilePicture}`
                  : `/dark-mode/create-account/icons/camera.svg`
                : file[0].url
            "
            :cover="
              file.length ? (resident.profilePicture ? true : false) : true
            "
            :style="`max-width: ${!file.length ? '' : null};`"
          ></v-img>
        </v-row>
      </v-card>
    </v-col>

    <!-- image file name -->
    <v-col cols="12" class="mt-6 text-center">
      <span class="d-inline-block text-truncate" style="max-width: 150px">
        {{
          file.length
            ? file[0].name
            : resident.profilePicture
            ? resident.profilePicture
            : "No file selected"
        }}
      </span>
    </v-col>

    <!-- attach image file to upload -->

    <v-col cols="12" class="mt-6 pa-0 ma-0 file-design-input">
      <v-card variant="plain" height="60px">
        <v-file-input
          :base-color="baseColor"
          :bg-color="bgColor"
          v-model="files"
          accept="image/*"
          label="Upload Photo"
          variant="plain"
          prepend-icon=""
          @change="onFileSelect()"
          :clearable="false"
        >
          <template v-slot:prepend-inner>
            <div style="width: 40px" class="pl-3">
              <v-img
                style="margin: auto 0"
                max-height="60"
                max-width="60"
                src="/dark-mode/create-account/icons/image-file-upload.svg"
              />
            </div>
          </template>
          <!-- <template v-slot:prepend-inner>
          <v-icon size="large" color="primary" icon="mdi-file-upload-outline" />
        </template> -->
        </v-file-input>
      </v-card>
    </v-col>

    <!-- progress -->
    <v-col cols="12" class="text-center mt-3" v-if="uploadProgress > 0">
      <v-progress-circular
        v-model="uploadProgress"
        :rotate="-90"
        :size="65"
        :width="8"
        color="#EB261E"
      >
        {{ uploadProgress }}%
      </v-progress-circular>
    </v-col>

    <!-- back and next -->
    <v-col cols="12" class="mt-8">
      <v-row no-gutters>
        <v-col cols="6" class="pr-2">
          <v-btn
            block
            rounded="lg"
            flat
            color="#E0241C"
            @click="goBack()"
            class="button"
            style="border: 1px solid var(--black-02, rgba(0, 0, 0, 0.2))"
          >
            Back
          </v-btn>
        </v-col>

        <v-col cols="6" class="pl-2">
          <v-btn
            block
            color="#E0241C"
            flat
            class="button"
            @click="goNext()"
            rounded="lg"
          >
            Next
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "only-footer",
  pageTitle: "Profile Picture",
  pageRedirect: "create-account-site-residency",
});
const { theme } = useLocal();
const { resident } = useResident();

onMounted(() => {
  if (!theme.value) theme.value = "light";
  const values = localStorage.getItem("resident");

  if (values) {
    resident.value = JSON.parse(values);
  } else {
    useRouter().push({ name: "create-account-info" });
  }
});

const files = ref<File[]>([]);

const file = ref<Record<string, any>>([]);

const uploadProgress = ref(0);

const onFileSelect = () => {
  file.value = files.value.map((file) => ({
    name: file.name,
    data: file,
    progress: 0,
    url: URL.createObjectURL(file),
  }));

  for (let i = 0; i < file.value.length; i++) {
    const formData = new FormData();
    formData.append("file", file.value[i].data);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/files/upload?status=draft");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        file.value[i].progress = Math.round((event.loaded / event.total) * 100);
        uploadProgress.value = file.value[i].progress;
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        file.value[i].id = response.id;
        resident.value.profilePicture = response.id;
      }
    };

    xhr.send(formData);
  }
};

function goNext() {
  localStorage.setItem("resident", JSON.stringify(resident.value));
  useRouter().push({ name: "create-account-proof-document" });
}

function goBack() {
  useRouter().push({ name: "create-account-site-residency" });
}

const textBackColor = computed(() =>
  theme.value === "dark" ? "text-back-dark" : "text-back",
);

const baseColor = computed(() => (theme.value === "dark" ? "red" : "red"));

const bgColor = computed(() =>
  theme.value === "dark" ? "#111723" : "#FAFAFAFA",
);
</script>

<style scoped>
.header {
  font-size: 16px;
  line-height: 24px;
  color: #052439;
}
.title {
  font-size: 20px;
  line-height: 32px;
  color: #052439;
}
.button {
  width: 178px;
  height: 48px;
}

.text-back-dark {
  color: #dfe2e9;
}

.text-back {
  color: #0f131c;
}

.chip-shadow {
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}

.file-design-input {
  /* button-s-red */
  border-radius: 4px;
  border: 1px solid var(--Primary, #eb261e);

  /* button-s-red */
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}
</style>
