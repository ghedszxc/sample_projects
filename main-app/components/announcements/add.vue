<template>
  <v-dialog
    v-model="addAnnouncementDialog"
    transition="dialog-right-transition"
    fullscreen
    persistent
    :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
  >
    <v-card
      :loading="isProgress"
      :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
      :class="`${theme == 'light' && 'bg-white'} px-3 h-100 ${$vuetify.display.mdAndUp && 'rounded-s-xl'}`"
    >
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="orange"
          height="8"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
        <span class="font-weight-bold pl-4 pt-1 text-capitalize">
          {{
            existingAnnouncement ? "View Bulletin Board" : "Add Bulletin Board"
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          icon="mdi-close"
          @click="onCloseDialog()"
        ></v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text>
        <v-row class="h-100 align-center">
          <v-col cols="12" class="mt-5">
            <v-row>
              <v-col cols="12" class="mb-5">
                <v-img
                  :src="`/images/announcement/announcement.jpg`"
                  height="125"
                />
              </v-col>

              <v-col cols="12">
                <v-row no-gutters>
                  <v-col
                    cols="12"
                    class="mb-6"
                    v-if="addAnnouncementSteps === 1"
                    ><v-form ref="addAnnouncementForm">
                      <v-row>
                        <v-col cols="12" class="font-weight-bold pb-4">
                          <v-btn
                            v-if="addAnnouncementSteps === 1"
                            variant="flat"
                            class="grey-darken-1"
                            icon="mdi-chevron-left"
                            @click="onGoBack()"
                          />
                          General information
                        </v-col>

                        <template v-if="existingAnnouncement">
                          <v-col cols="12">
                            <v-autocomplete
                              v-model="currentAnnouncement.recipients"
                              :items="recipients"
                              item-title="name"
                              item-value="value"
                              label="Recipient(s)"
                              placeholder="Select Recipient(s)"
                              density="compact"
                              hide-details
                              :disabled="isProgress"
                              :readonly="existingAnnouncement"
                              :rules="[requiredInput]"
                              @update:modelValue="onSelectRecipient"
                              chips
                              closable-chips
                              multiple
                              clearable
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              :model-value="currentAnnouncement.title"
                              label="Title"
                              density="compact"
                              hide-details
                              :disabled="isProgress"
                              :readonly="existingAnnouncement"
                              :rules="[requiredInput]"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12">
                            <v-textarea
                              :model-value="currentAnnouncement.content"
                              label="Content"
                              density="compact"
                              hide-details
                              :disabled="isProgress"
                              :readonly="existingAnnouncement"
                              :rules="[requiredInput]"
                            ></v-textarea>
                          </v-col>

                          <v-col cols="12">
                            <v-checkbox
                              v-model="currentAnnouncement.noExpiration"
                              label="No Expiration"
                              :disabled="isProgress"
                              :readonly="existingAnnouncement"
                              hide-details
                            ></v-checkbox>
                          </v-col>

                          <v-col cols="12">
                            <v-text-field
                              hide-details
                              :model-value="currentAnnouncement.startDate"
                              density="comfortable"
                              :disabled="isProgress"
                              :readonly="existingAnnouncement"
                              :rules="[requiredInput]"
                              append-inner-icon="mdi-calendar"
                            />
                          </v-col>

                          <v-col cols="12">
                            <v-text-field
                              hide-details
                              :model-value="currentAnnouncement.endDate"
                              density="comfortable"
                              :disabled="isProgress"
                              :readonly="existingAnnouncement"
                              :rules="[requiredInput]"
                              append-inner-icon="mdi-calendar"
                            />
                          </v-col>
                        </template>

                        <template v-else>
                          <v-col cols="12">
                            <v-autocomplete
                              v-model="newAnnouncement.recipients"
                              :items="recipients"
                              item-title="name"
                              item-value="value"
                              label="Recipient(s)"
                              :class="existingAnnouncement && 'grey-field'"
                              placeholder="Select Recipient(s)"
                              density="compact"
                              hide-details
                              :disabled="isProgress"
                              :rules="[requiredInput]"
                              @update:modelValue="onSelectRecipient"
                              chips
                              closable-chips
                              multiple
                              clearable
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="newAnnouncement.title"
                              label="Title"
                              :class="existingAnnouncement && 'grey-field'"
                              density="compact"
                              hide-details
                              :disabled="isProgress"
                              :rules="[requiredInput]"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12">
                            <v-textarea
                              v-model="newAnnouncement.content"
                              label="Content"
                              :class="existingAnnouncement && 'grey-field'"
                              density="compact"
                              hide-details
                              :disabled="isProgress"
                              :rules="[requiredInput]"
                            ></v-textarea>
                          </v-col>

                          <v-col cols="12">
                            <v-checkbox
                              v-model="newAnnouncement.noExpiration"
                              label="No Expiration"
                              :class="existingAnnouncement && 'grey-field'"
                              :disabled="isProgress"
                              hide-details
                            ></v-checkbox>
                          </v-col>

                          <v-col cols="12">
                            <span class="font-weight-bold">Start Date</span>
                            <v-text-field
                              hide-details
                              v-model="filters.from"
                              density="comfortable"
                              :class="existingAnnouncement && 'grey-field'"
                              :disabled="isProgress"
                              :rules="[requiredInput]"
                              clearable
                              readonly
                              @click="startDateDialog = true"
                              append-inner-icon="mdi-calendar"
                            />
                            <v-dialog
                              v-model="startDateDialog"
                              :max-width="
                                $vuetify.display.smAndDown ? 260 : 332
                              "
                            >
                              <v-card>
                                <v-card-subtitle>
                                  <v-date-picker
                                    :width="
                                      $vuetify.display.smAndDown ? 220 : 300
                                    "
                                    v-model="selectedStartDate"
                                    :locale="locale"
                                  ></v-date-picker>
                                </v-card-subtitle>
                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-btn @click="startDateDialog = false">
                                    Cancel
                                  </v-btn>
                                  <v-btn @click="onUpdateDate('from', 'new')">
                                    Apply
                                  </v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                          </v-col>

                          <v-col cols="12">
                            <span class="font-weight-bold">End Date</span>
                            <v-text-field
                              hide-details
                              v-model="filters.to"
                              density="comfortable"
                              :class="existingAnnouncement && 'grey-field'"
                              :disabled="isProgress"
                              :rules="[requiredInput]"
                              clearable
                              readonly
                              @click="endDateDialog = true"
                              append-inner-icon="mdi-calendar"
                            />
                            <v-dialog
                              v-model="endDateDialog"
                              :max-width="
                                $vuetify.display.smAndDown ? 260 : 332
                              "
                            >
                              <v-card>
                                <v-card-subtitle>
                                  <v-date-picker
                                    :width="
                                      $vuetify.display.smAndDown ? 220 : 300
                                    "
                                    v-model="selectedEndDate"
                                    :locale="locale"
                                  ></v-date-picker>
                                </v-card-subtitle>
                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-btn @click="endDateDialog = false">
                                    Cancel
                                  </v-btn>
                                  <v-btn @click="onUpdateDate('to', 'new')">
                                    Apply
                                  </v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                          </v-col>
                        </template>

                        <v-col cols="12" v-if="!existingAnnouncement">
                          <v-btn
                            @click="uploader.click()"
                            prepend-icon="mdi-upload"
                            :loading="isUploading"
                          >
                            <v-file-input
                              v-model="files"
                              accept="image/*,video/*,application/pdf"
                              ref="uploader"
                              class="d-none"
                              :rules="[requiredInput]"
                              @change="handleFile"
                              multiple
                            />
                            Upload File
                          </v-btn>
                        </v-col>
                        <v-col v-if="!existingAnnouncement" cols="12">
                          <v-row no-gutters align="center">
                            Videos ({{
                              newAnnouncement.file.filter((file) =>
                                videoExtensions.some((extension) =>
                                  file.name.endsWith(extension),
                                ),
                              ).length
                            }})
                            <v-spacer></v-spacer>
                            Preview
                          </v-row>
                          <v-chip-group column multiple>
                            <template
                              v-for="file in newAnnouncement.file.filter(
                                (file) =>
                                  videoExtensions.some((extension) =>
                                    file.name.endsWith(extension),
                                  ),
                              )"
                              :key="file._id"
                            >
                              <v-col cols="11" class="pa-0 mx-3 mt-1">
                                <v-row align="center">
                                  <NuxtLink
                                    :to="`/api/files/${file._id}`"
                                    target="_blank"
                                  >
                                    <v-chip
                                      closable
                                      @click:close="removeFile(file._id)"
                                      class="text-wrap text-caption"
                                    >
                                      {{ file.name }}
                                    </v-chip>
                                  </NuxtLink>
                                  <v-spacer></v-spacer>
                                  <v-checkbox
                                    v-model="file.preview"
                                    label=""
                                    hide-details
                                    @click="
                                      newAnnouncement.file
                                        .filter((i) => i._id !== file._id)
                                        .map((i) => (i.preview = false))
                                    "
                                  />
                                </v-row>
                              </v-col>
                            </template>
                          </v-chip-group>
                          Photos ({{
                            newAnnouncement.file.filter((file) =>
                              imageExtensions.some((extension) =>
                                file.name?.endsWith(extension),
                              ),
                            ).length
                          }})

                          <v-chip-group column multiple>
                            <template
                              v-for="file in newAnnouncement.file.filter(
                                (file) =>
                                  imageExtensions.some((extension) =>
                                    file.name.endsWith(extension),
                                  ),
                              )"
                              :key="file._id"
                            >
                              <v-col cols="11" class="pa-0 mx-3 mt-1">
                                <v-row align="center">
                                  <NuxtLink
                                    :to="`/api/files/${file._id}`"
                                    target="_blank"
                                  >
                                    <v-chip
                                      closable
                                      @click:close="removeFile(file._id)"
                                      class="text-wrap text-caption"
                                    >
                                      {{ file.name }}
                                    </v-chip>
                                  </NuxtLink>
                                  <v-spacer></v-spacer>
                                  <v-checkbox
                                    v-model="file.preview"
                                    label=""
                                    hide-details
                                    @click="
                                      newAnnouncement.file
                                        .filter((i) => i._id !== file._id)
                                        .map((i) => (i.preview = false))
                                    "
                                  />
                                </v-row>
                              </v-col>
                            </template>
                          </v-chip-group>

                          Documents ({{
                            newAnnouncement.file.filter((file) =>
                              file.name.endsWith(".pdf"),
                            ).length
                          }})
                          <v-chip-group column multiple>
                            <template
                              v-for="file in newAnnouncement.file.filter(
                                (file) => file.name.endsWith('.pdf'),
                              )"
                              :key="file._id"
                            >
                              <v-col cols="11" class="pa-0 mx-3 mt-1">
                                <v-row align="center">
                                  <NuxtLink
                                    :to="`/api/files/${file._id}`"
                                    target="_blank"
                                  >
                                    <v-chip
                                      closable
                                      @click:close="removeFile(file._id)"
                                      class="text-wrap text-caption"
                                    >
                                      {{ file.name }}
                                    </v-chip>
                                  </NuxtLink>
                                  <v-spacer></v-spacer>
                                  <v-checkbox
                                    v-model="file.preview"
                                    label=""
                                    hide-details
                                    @click="
                                      newAnnouncement.file
                                        .filter((i) => i._id !== file._id)
                                        .map((i) => (i.preview = false))
                                    "
                                  />
                                </v-row>
                              </v-col>
                            </template>
                          </v-chip-group>
                        </v-col>
                        <v-col cols="12" v-else>
                          <v-chip-group column multiple>
                            <template
                              v-for="file in currentAnnouncement.file"
                              :key="file._id"
                            >
                              <NuxtLink
                                :to="`/api/files/${file._id}`"
                                target="_blank"
                                ><v-chip class="text-wrap">
                                  {{ file.name }}
                                </v-chip>
                              </NuxtLink>
                            </template>
                          </v-chip-group>
                        </v-col>

                        <v-col cols="12" v-if="!existingAnnouncement">
                          <v-btn
                            block
                            color="blue-darken-3"
                            size="small"
                            variant="flat"
                            style="height: 40px"
                            @click="onAddSingleAnnouncement()"
                            :disabled="isProgress || isUploading"
                            :loading="loading"
                          >
                            Add Bulletin Board
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-col>

                  <v-col cols="12" v-if="addAnnouncementSteps === 2">
                    <div
                      class="text-center mt-6 text-subtitle-1 font-weight-bold"
                    >
                      Great!
                    </div>
                    <div class="text-center mt-2 text-caption">
                      A new bulletin is added in the bulletin board!
                    </div>
                    <v-row class="px-3 mt-5" justify="space-between">
                      <v-col cols="12">
                        <v-btn
                          block
                          size="small"
                          variant="flat"
                          style="height: 40px"
                          @click="onCloseDialog()"
                        >
                          Close
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <span :class="`${$vuetify.display.mdAndUp && 'pl-4'} text-caption`">
          @ 2024 by Seven 365 Pte Ltd V1.0
        </span>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure"],
});

const { theme } = useLocal();
const { setSnackbar } = useLocal();
const { requiredInput } = useUtils();
const { standardFormatDate } = useUtils();

import moment from "moment-timezone";

const { currentUser } = useLocalAuth();

const addAnnouncementForm = ref<HTMLFormElement | null>(null);

const isUploading = ref(false);

const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".flv", ".wmv"];

const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".svg",
  ".webp",
];

const {
  tab,
  search,
  date,
  dates,
  announcement,
  setAnnouncement,
  setAnnouncements,
  addAnnouncement,
  addAnnouncementDialog,
  addAnnouncementSteps,
} = useAnnouncement();
const { mySite } = useFilter();

const isProgress = ref(false);

const loading = ref(false);

const uploader = ref();

const recipients = [
  {
    name: "All",
    value: "all",
  },
  {
    name: "Admin",
    value: "admin",
  },
  {
    name: "Management Agency",
    value: "organization",
  },
  {
    name: "Site Personnel",
    value: "site",
  },
  {
    name: "Service Provider",
    value: "service-provider",
  },
  {
    name: "Service Provider Member",
    value: "service-provider-member",
  },
  {
    name: "Resident",
    value: "resident",
  },
];

function onSelectRecipient(value: string[]) {
  newAnnouncement.value.recipients = [];
  if (value.includes("all")) {
    recipients.forEach((recipient) => {
      if (recipient.value !== "all") {
        newAnnouncement.value.recipients.push(recipient.value);
      }
    });
  } else {
    value.forEach((val) => {
      newAnnouncement.value.recipients.push(val);
    });
  }
}

const existingAnnouncement = computed<boolean>(
  () =>
    announcement.value.title != "" &&
    announcement.value.content != "" &&
    announcement.value.recipients.length > 0,
);

const currentAnnouncement = computed(() => {
  return {
    title: announcement.value.title || "",
    content: announcement.value.content || "",
    file: announcement.value.file || [],
    recipients: announcement.value.recipients || [],
    noExpiration: announcement.value.noExpiration || false,
    startDate: standardFormatDate(announcement.value.startDate || new Date()),
    endDate: standardFormatDate(announcement.value.endDate || new Date()),
  };
});

const newAnnouncement = ref({
  title: announcement.value.title || "",
  content: announcement.value.content || "",
  file: announcement.value.file || ([] as Array<Record<string, any>>),
  recipients: announcement.value.recipients || [],
  noExpiration: announcement.value.noExpiration || false,
  startDate: announcement.value.startDate || new Date(),
  endDate: announcement.value.endDate || new Date(),
});

const file = ref();
const files = ref<File[]>([]);

const startDateDialog = ref<boolean>(false);
const selectedStartDate = ref<Date | null>(null);
const endDateDialog = ref<boolean>(false);
const selectedEndDate = ref<Date | null>(new Date());

const locale = ref("en");

const filters = ref<any>({
  from: standardFormatDate(new Date()),
  to: standardFormatDate(new Date()),
});

async function onUpdateDate(filterType: string, type: string) {
  if (filterType === "from") {
    filters.value.from = standardFormatDate(selectedStartDate.value);
    if (type == "new") {
      newAnnouncement.value.startDate = filters.value.from;
    } else {
      currentAnnouncement.value.startDate = filters.value.from;
    }
    startDateDialog.value = false;
  } else {
    filters.value.to = standardFormatDate(selectedEndDate.value);
    if (type == "new") {
      newAnnouncement.value.endDate = filters.value.to;
    } else {
      currentAnnouncement.value.endDate = filters.value.to;
    }
    endDateDialog.value = false;
  }
}

async function handleFile() {
  isUploading.value = true;
  file.value = files.value.map((file: any) => ({
    name: file.name,
    preview: false,
    data: file,
    progress: 0,
    url: URL.createObjectURL(file),
  }));

  const validFiles: any = [];

  for (let i = 0; i < file.value.length; i++) {
    const currentFile = file.value[i];
    if (currentFile.data.type.startsWith("video/")) {
      const isValid = await validateVideo(currentFile);
      if (!isValid) {
        setSnackbar({
          text: `Only video with minimum of 720p and maximum of 10 seconds duration only.`,
          modal: true,
          type: "error",
        });
        isUploading.value = false;
      } else {
        validFiles.push(currentFile);
      }
    } else if (currentFile.data.type.startsWith("image/")) {
      validFiles.push(currentFile);
    } else if (currentFile.data.type === "application/pdf") {
      validFiles.push(currentFile);
    } else {
      setSnackbar({
        text: "Only images, videos and pdf files are allowed.",
        modal: true,
        type: "error",
      });
      isUploading.value = false;
    }
  }

  for (let i = 0; i < validFiles.length; i++) {
    const formData = new FormData();
    formData.append("file", validFiles[i].data);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/files/upload?status=draft");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        validFiles[i].progress = Math.round((event.loaded / event.total) * 100);
        if (validFiles[i].progress === 100)
          setTimeout(() => {
            isUploading.value = false;
          }, 2000);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        validFiles[i].id = response.id;
        if (response.id) {
          newAnnouncement.value.file.push({
            _id: response.id,
            name: validFiles[i].name,
            preview: validFiles[i].preview,
          });
          files.value = [];
        }
      }
    };

    xhr.send(formData);
  }
}

function validateVideo(fileObj: any) {
  return new Promise((resolve) => {
    const url = fileObj.url;

    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = function () {
      URL.revokeObjectURL(video.src);

      const width = video.videoWidth;
      const height = video.videoHeight;
      const duration = video.duration;

      // Remove the video element
      video.remove();

      // Check resolution
      if (height < 720 || width < 1280) {
        resolve(false);
        return;
      }

      // Check duration
      if (duration > 10) {
        resolve(false);
        return;
      }

      resolve(true);
    };

    video.onerror = function () {
      // Remove the video element
      video.remove();
      resolve(false);
    };

    video.src = url;
    // Add the video element to the DOM (hidden)
    video.style.display = "none";
    document.body.appendChild(video);
  });
}

function removeFile(id: any) {
  newAnnouncement.value.file = newAnnouncement.value.file.filter(
    (item: any) => item._id !== id,
  );
}

async function updateFilter() {
  dates.value = JSON.parse(
    JSON.stringify(
      date.value.map((dateString: any) => {
        return moment
          .tz(moment(dateString, "DD/MM/YYYY"), "Asia/Singapore")
          .toDate();
      }),
    ),
  );
  await setAnnouncements({
    search: search.value,
    site: mySite.value!,
    dates: dates.value,
    tab: tab.value,
  });
}

async function onAddSingleAnnouncement() {
  loading.value = true;
  if (!mySite.value || !currentUser.value.organization) return;
  try {
    if (
      !newAnnouncement.value.recipients.length ||
      !newAnnouncement.value.title ||
      !newAnnouncement.value.content
    ) {
      addAnnouncementForm.value?.validate();

      if (!newAnnouncement.value.recipients.length) {
        loading.value = false;
        return setSnackbar({
          text: "Recipient(s) is required",
          modal: true,
          type: "error",
        });
      }

      if (!newAnnouncement.value.title) {
        loading.value = false;
        return setSnackbar({
          text: "Title is required",
          modal: true,
          type: "error",
        });
      }
      if (!newAnnouncement.value.content) {
        loading.value = false;
        return setSnackbar({
          text: "Content is required",
          modal: true,
          type: "error",
        });
      }
    }
    let sortByTypeFiles = [];
    for (let i = 0; i < newAnnouncement.value.file.length; i++) {
      if (
        videoExtensions.some((extension) =>
          newAnnouncement.value.file[i].name.endsWith(extension),
        )
      ) {
        sortByTypeFiles.push(newAnnouncement.value.file[i]);
      }
    }
    for (let i = 0; i < newAnnouncement.value.file.length; i++) {
      if (
        imageExtensions.some((extension) =>
          newAnnouncement.value.file[i].name.endsWith(extension),
        )
      ) {
        sortByTypeFiles.push(newAnnouncement.value.file[i]);
      }
    }
    for (let i = 0; i < newAnnouncement.value.file.length; i++) {
      if (newAnnouncement.value.file[i].name.endsWith(".pdf")) {
        sortByTypeFiles.push(newAnnouncement.value.file[i]);
      }
    }
    await addAnnouncement({
      site: mySite.value,
      organization: currentUser.value.organization,
      title: newAnnouncement.value.title,
      content: newAnnouncement.value.content,
      file: sortByTypeFiles,
      recipients: newAnnouncement.value.recipients,
      noExpiration: newAnnouncement.value.noExpiration,
      startDate: moment
        .tz(
          moment(newAnnouncement.value.startDate, "DD/MM/YYYY").startOf("day"),
          "Asia/Singapore",
        )
        .toDate(),
      endDate: moment
        .tz(
          moment(newAnnouncement.value.endDate, "DD/MM/YYYY").endOf("day"),
          "Asia/Singapore",
        )
        .toDate(),
    });

    await updateFilter();

    addAnnouncementSteps.value = 2;
    loading.value = false;
    newAnnouncement.value.title = "";
    newAnnouncement.value.content = "";
    newAnnouncement.value.file = [];
    newAnnouncement.value.recipients = [];
    newAnnouncement.value.startDate = new Date();
    newAnnouncement.value.endDate = new Date();
    files.value = [];
  } catch (err) {
    setSnackbar({ text: err as string, modal: true, type: "error" });
  }
  loading.value = false;
}

async function onCloseDialog() {
  addAnnouncementDialog.value = false;
  addAnnouncementSteps.value = 1;
  newAnnouncement.value.title = "";
  newAnnouncement.value.content = "";
  newAnnouncement.value.file = [];
  newAnnouncement.value.recipients = [];
  newAnnouncement.value.startDate = new Date();
  newAnnouncement.value.endDate = new Date();
  files.value = [];
}

async function onGoBack() {
  if (existingAnnouncement.value) return;
  await setAnnouncement();
  addAnnouncementSteps.value = 1;
}
</script>
<style scoped>
.grey-field {
  pointer-events: none;
  background-color: #f2f2f2;
}

.override_shadow {
  box-shadow: 0px 13px 19px -13px rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 0px 13px 19px -13px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 13px 19px -13px rgba(0, 0, 0, 0.15);
}

.dialog_desktop {
  margin: 0 0 0 auto;
  max-width: 28rem;
  border-radius: 25px 0 0 25px;

  box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
}

:deep() .v-field__outline {
  --v-field-border-opacity: 0.1;
}

:deep() .v-overlay__scrim {
  opacity: var(--v-overlay-opacity, 0);
}

:deep() .v-text-field input {
  font-size: 13px !important;
}

:deep() .v-textarea .v-field__input {
  font-size: 13px !important;
}

:deep() .v-switch .v-label {
  padding-right: 10px;
  font-size: 13px;
}

:deep() .v-switch .v-selection-control {
  display: flex;
  flex-direction: row-reverse;
}

.overridePicker {
  width: 18px;
}
</style>
