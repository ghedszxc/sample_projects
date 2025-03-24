<template>
  <v-row no-gutters class="px-6">
    <v-col cols="12" class="header mt-6">
      <v-icon
        start
        size="x-large"
        @click="goBack()"
        style="position: relative; right: 10px"
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
        Car Registration
      </span>
    </v-col>
    <v-col cols="12" class="mt-8">
      <v-row no-gutters>
        <span class="title font-weight-bold" :class="textBackColor">
          Upload Car Registration
        </span>
      </v-row>
    </v-col>

    <!-- image -->
    <v-col cols="12" class="mt-6">
      <v-card
        variant="outlined"
        rounded="xl"
        style="
          border: 1px solid var(--black-02, rgba(0, 0, 0, 0.2));
          box-shadow: 0px 0px 14px 0px rgba(255, 255, 255, 0.1);
          height: 380px;
        "
      >
        <v-row
          no-gutters
          class="fill-height"
          align-content="center"
          justify="center"
        >
          <v-img
            src="/dark-mode/create-account/icons/document.svg"
            style="max-width: 200px"
          ></v-img>
        </v-row>
      </v-card>
    </v-col>

    <!-- attach pdf/doc/image file to upload -->
    <v-col cols="12" class="pa-4 mt-6">
      <v-file-input
        class="file-input"
        :base-color="baseColor"
        :bg-color="bgColor"
        label="Car Registration"
        prepend-icon=""
        v-model="files"
        :model-value="null"
        @change="onFileSelect()"
        multiple
      >
        <template v-slot:label>
          <span> Car Registration </span>
          <span class="required">*</span>
        </template>
        <template v-slot:prepend-inner>
          <div style="width: 40px" class="">
            <v-img
              style="margin: auto 0"
              max-height="60"
              max-width="60"
              src="/dark-mode/create-account/icons/image-file-upload.svg"
            />
          </div>
        </template>
      </v-file-input>
    </v-col>

    <!-- progress -->
    <v-col cols="12" class="text-center" v-if="uploadProgress > 0">
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

    <!-- uploaded files -->
    <v-col cols="12" class="mt-1">
      <v-chip-group column multiple>
        <template v-for="file in resident.carRegistration" :key="file._id">
          <NuxtLink
            :to="`/api/files/${file._id}`"
            target="_blank"
            style="color: #eb261e"
          >
            <v-chip
              closable
              @click:close="removeFile(file._id)"
              class="text-wrap text-caption pa-6"
            >
              {{ file.name }}
            </v-chip>
          </NuxtLink>
        </template>
      </v-chip-group>
    </v-col>

    <!-- back and next -->
    <v-col cols="12" class="mt-6">
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
        <v-spacer></v-spacer>
        <v-col cols="6" class="pl-2">
          <v-btn
            block
            color="#E0241C"
            flat
            class="button"
            @click="goNext()"
            rounded="lg"
            :disabled="!resident.carRegistration.length"
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
  pageTitle: "Car Registration",
  pageRedirect: "create-account-profile-capture",
});

const { theme } = useLocal();
const { setSnackbar } = useLocal();
const { resident } = useResident();

function goBack() {
  useRouter().push({ name: "create-account-info" });
}
function goNext() {
  const {
    givenName,
    surname,
    email,
    prefix,
    primaryPhone,
    nric,
    dateOfBirth,
    vehicleModel,
    vehicleNo,
    vehicleColor,
    password,
  } = resident.value;
  if (
    !(
      givenName &&
      surname &&
      email &&
      prefix &&
      primaryPhone &&
      nric &&
      dateOfBirth &&
      password
    ) ||
    (vehicleModel && !vehicleNo && !vehicleColor)
  ) {
    useRouter().push({ name: "create-account-info" });
  }

  const { carRegistration } = resident.value;
  if (carRegistration.length > 0) {
    localStorage.setItem("resident", JSON.stringify(resident.value));
    useRouter().push({ name: "create-account-site-residency" });
  } else {
    setSnackbar({
      modal: true,
      text: "Please upload car registration.",
      type: "error",
    });
  }
}

onMounted(() => {
  if (!theme.value) theme.value = "light";
  const values = localStorage.getItem("resident");

  if (values) {
    resident.value = JSON.parse(values);

    if (resident.value.status === "resubmit") {
      files.value = resident.value.carRegistration;
    }
  } else {
    useRouter().push({ name: "create-account-info" });
  }

  // resident.value.carRegistration = [];
});

const files = ref<File[]>([]);

type TFile = {
  name: string;
  data: File;
  progress: number;
  id?: string;
};

const file = ref<TFile[]>([]);

const uploadProgress = ref(0);
const onFileSelect = () => {
  const newFiles = files.value.map((file) => ({
    name: file.name,
    data: file,
    progress: 0,
    url: URL.createObjectURL(file),
  }));

  // Append new files to the existing list of files
  file.value = [...file.value, ...newFiles];

  // Process each file
  for (let i = 0; i < newFiles.length; i++) {
    const formData = new FormData();
    formData.append("file", newFiles[i].data);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/files/upload?status=draft");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        newFiles[i].progress = Math.round((event.loaded / event.total) * 100);
        uploadProgress.value = newFiles[i].progress;
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        newFiles[i].id = response.id;
        if (response?.id) {
          resident.value.carRegistration.push({
            _id: response.id,
            name: newFiles[i].name,
          });
        }
      }
    };

    xhr.send(formData);
  }
};

function removeFile(id: string) {
  resident.value.carRegistration = resident.value.carRegistration.filter(
    (item) => item._id !== id,
  );
}

const textBackColor = computed(() =>
  theme.value === "dark" ? "text-back-dark" : "text-back",
);

const baseColor = computed(() => (theme.value === "dark" ? "black" : "black"));

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

.title {
  font-size: 20px;
  line-height: 32px;
}

.required {
  color: red;
  font-size: 16px;
}
.file-upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-upload-icon {
  margin-left: 8px;
}
</style>
