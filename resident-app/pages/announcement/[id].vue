<template>
  <v-row no-gutters class="px-6">
    <!-- header -->
    <v-col cols="12" class="header mt-6">
      <v-icon
        start
        size="x-large"
        @click="goBack()"
        style="position: relative; right: 9px; top: 2px"
      >
        <v-img
          class="pl-0 ml-0 mt-1"
          src="/dark-mode/utility-all/right-arrow.svg"
          cover
        ></v-img>
      </v-icon>
      <span style="position: relative; right: 19px">
        Community Announcement</span
      >
    </v-col>
    <v-col cols="12" class="mt-5">
      <v-card variant="flat" class="card-announcements">
        <v-col cols="12">
          <v-row no-gutters>
            <v-col cols="2">
              <v-avatar color="#E0241C" class="pa-3" size="48">
                <v-img src="/icons/resident/home/announcement.svg"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="10">
              <v-row no-gutters>
                <v-col cols="12" class="pl-4">Bulletin Board</v-col>
                <v-col cols="12">
                  <v-card-subtitle>
                    <span class="text-truncate" style="max-width: 240px">
                      {{ announcement.title }}
                    </span>
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-card>
    </v-col>

    <v-col cols="12" class="mt-4">
      <span class="fsheader1">
        {{ announcement.title }}
      </span>
      <br />
      <span class="pt-1 content-PostedStyle fsParagraph">
        Posted {{ standardFormatDateTime(announcement.createdAt) }}</span
      >
      <br />
      <p class="content-Tostyle fsheader3 pt-2">To: Resident</p>
      <br />
      <p class="content-style fsParagraph text-justify text-wrap">
        {{ announcement.content }}
      </p>
      <br />
      <v-col
        class="pl-0"
        cols="12"
        v-if="announcement.file && announcement.file.length === 0"
      >
        <h1 class="text-subtitle-1 font-weight-medium fsParagraph">
          No files attachment
        </h1></v-col
      >

      <v-col cols="12" v-else class="mt-6 pl-0 ml-0">
        <v-divider></v-divider>
        <p class="content-Tostyle fsheader3 pt-1">Files</p>
        <v-slide-group class="pt-2" selected-class="bg-primary" multiple>
          <v-slide-group-item
            v-for="(fileData, index) in announcement.file"
            :key="fileData._id"
            v-slot="{ isSelected, toggle }"
          >
            <v-col
              v-if="announcement.file.length === 1"
              cols="12"
              class="pa-0 ma-0"
            >
              <v-card variant="flat" height="200" class="pa-0 ma-0">
                <div style="height: 100%; position: relative">
                  <template v-if="isVideo(fileData.name)">
                    <div
                      style="
                        position: relative;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <video
                        ref="video"
                        @play="isPlaying = true"
                        @pause="isPlaying = false"
                        :src="`/api/files/${announcement?.file[0]?._id}`"
                        height="100%"
                        width="100%"
                      ></video>
                      <v-icon
                        style="
                          position: absolute;
                          top: 50%;
                          left: 50%;
                          transform: translate(-50%, -50%);
                          z-index: 2;
                          background: rgba(0, 0, 0, 0.5);
                          border-radius: 50%;
                        "
                        color="#eb261e"
                        size="48"
                      >
                        mdi-play-circle-outline
                      </v-icon>
                    </div>
                  </template>
                  <template v-else-if="isDocument(fileData.name)">
                    <v-icon color="red" size="48"> mdi-file-pdf-box </v-icon>
                  </template>
                  <template v-else>
                    <v-img
                      :src="`/api/files/${announcement?.file[0]?._id}`"
                    ></v-img>
                  </template>
                  <div
                    @click="
                      toggle;
                      showDialog = true;
                      selectedFileId = fileData._id;
                      selectedFileIndex = index;
                    "
                    style="
                      position: absolute;
                      top: 0;
                      bottom: 0;
                      left: 0;
                      right: 0;
                    "
                  ></div>
                </div>
              </v-card>
            </v-col>
            <v-card
              v-else
              :class="['ma-2 ', selectedClass]"
              height="200"
              :style="{ width: $vuetify.display.smAndUp ? '420px' : '180px' }"
            >
              <div style="height: 100%; position: relative">
                <template v-if="isVideo(fileData.name)">
                  <div
                    style="
                      position: relative;
                      width: 100%;
                      height: 100%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <video
                      :src="`/api/files/${fileData._id}`"
                      controls
                      preload="none"
                      height="100%"
                      width="100%"
                    ></video>
                    <v-icon
                      style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        z-index: 2;
                        background: rgba(0, 0, 0, 0.5);
                        border-radius: 50%;
                      "
                      color="#eb261e"
                      size="48"
                    >
                      mdi-play-circle-outline
                    </v-icon>
                  </div>
                </template>
                <template v-else-if="isDocument(fileData.name)">
                  <NuxtLink
                    :to="`/api/files/${fileData._id}`"
                    target="_blank"
                    style="text-decoration: none"
                  >
                    <div
                      style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                      "
                    >
                      <v-icon color="red" size="96"> mdi-file-pdf-box </v-icon>
                    </div></NuxtLink
                  >
                </template>
                <template v-else>
                  <v-img
                    :src="`/api/files/${fileData._id}`"
                    height="100%"
                  ></v-img>
                </template>
                <div
                  @click="
                    toggle;
                    showDialog = true;
                    selectedFileId = fileData._id;
                    selectedFileIndex = index;
                  "
                  style="
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                  "
                ></div>
              </div>
              <div class="d-flex fill-height align-center justify-center">
                <v-scale-transition>
                  <v-icon
                    v-if="isSelected"
                    color="white"
                    icon="mdi-close-circle-outline"
                    size="48"
                  ></v-icon>
                </v-scale-transition>
              </div>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-col>

      <v-dialog v-model="showDialog">
        <v-card>
          <v-carousel v-model="selectedFileIndex" hide-delimiters>
            <v-carousel-item
              v-for="(item, index) in announcement.file"
              :key="index"
            >
              <template v-if="isVideo(item.name)">
                <div style="position: relative; width: 100%; height: 100%">
                  <video
                    :ref="videoRefs[index]"
                    @play="isPlaying[index] = true"
                    @pause="isPlaying[index] = false"
                    @click="togglePlay(index)"
                    :src="`/api/files/${item._id}`"
                    height="100%"
                    width="100%"
                    controls
                    preload="none"
                    autoplay
                  ></video>

                  <v-icon
                    v-if="!isPlaying[index]"
                    @click.stop="togglePlay(index, $event)"
                    style="
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      z-index: 2;
                      background: rgba(0, 0, 0, 0.5);
                      border-radius: 50%;
                    "
                    color="#eb261e"
                    size="58"
                  >
                    mdi-play-circle-outline
                  </v-icon>
                  <div
                    style="
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      width: 100px;
                      height: 100px;
                      transform: translate(-50%, -50%);
                      cursor: pointer;
                    "
                    @click.stop="togglePlay(index)"
                  ></div>
                </div>
              </template>
              <template v-else-if="isDocument(item.name)">
                <NuxtLink
                  :to="`/api/files/${item._id}`"
                  target="_blank"
                  style="text-decoration: none"
                >
                  <div
                    style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      height: 100%;
                    "
                  >
                    <v-row
                      no-gutters
                      class="d-flex justify-center align-center mx-10"
                    >
                      <v-col cols="12" class="text-center">
                        <v-icon color="red" size="96">
                          mdi-file-pdf-box
                        </v-icon></v-col
                      >
                      <v-col cols="12" class="text-center">
                        <v-chip
                          class="mt-3 white--text"
                          style="
                            max-width: 300px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            color: white;
                            background-color: red;
                          "
                        >
                          {{ item.name }}
                        </v-chip></v-col
                      >
                    </v-row>
                  </div>
                </NuxtLink>
              </template>

              <template v-else>
                <v-img :src="`/api/files/${item._id}`" height="100%"></v-img>
                <!-- <v-img
                  :src="`/api/files/${item._id}`"
                  height="100%"
                  width="100%"
                  cover
                ></v-img> -->
              </template>
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

const { currentUser } = useLocalAuth();
const { fileIndex } = useAnnouncement();

const id = computed(() => useRoute().params.id as string);
const organizationID = computed(() => currentUser.value.organization);
const siteID = computed(() => currentUser.value.site);
const { formatDate, standardFormatDateTime } = useUtils();
const { getByIdAnnouncement } = useAnnouncement();

const announcement = ref([]);
const showDialog = ref(false);
const selectedFileId = ref("");

const selectedFileIndex = ref(null);
const queryIsOpenDialog = ref();

function toggleDialog(fileData, index) {
  showDialog.value = true;
  selectedFileId.value = fileData._id;
  selectedFileIndex.value = index;
}

function isVideo(filename) {
  const extension = filename.split(".").pop();
  return ["mp4", "avi", "mov"].includes(extension);
}

const videoRefs = reactive([]);
const isPlaying = reactive([]);
watch(announcement, (newVal) => {
  newVal.file.forEach((item, index) => {
    if (isVideo(item.name)) {
      videoRefs[index] = ref(null);
      isPlaying[index] = false;
    }
  });
});

async function togglePlay(index) {
  const videoRef = videoRefs[index];
  const video = videoRef._value[0];

  if (video.paused) {
    await video.play();
    isPlaying[index] = true;
  } else {
    await video.pause();

    isPlaying[index] = true;
  }
  await nextTick();
}
const color = ref(["success", "purple", "primary", "warning", "purple"]);
const icon = ref([
  "home-announcement-green.svg",
  "home-announcement-purple.svg",
  "home-announcement-blue.svg",
  "home-announcement-orange.svg",
  "home-announcement-purple.svg",
]);

onMounted(async () => {
  selectedFileIndex.value = null;
  const announcements = await getByIdAnnouncement(
    id.value,
    siteID.value,
    organizationID.value,
  );

  announcement.value = announcements;

  if (fileIndex.value == "true") {
    const previewFileIndex = announcement.value.file.findIndex(
      (file) => file.preview === true,
    );

    if (previewFileIndex !== -1) {
      selectedFileIndex.value = previewFileIndex;
    }

    showDialog.value = true;
  }
});

const randomIndex = ref(getRandomIndex());

function getRandomIndex() {
  return Math.floor(Math.random() * 4) + 1;
}

function goBack() {
  fileIndex.value = false;
  useRouter().push({ name: "announcement" });
}

const isDocument = (name) => {
  const documentExtensions = ["pdf", "doc", "docx"];
  const extension = name.split(".").pop().toLowerCase();
  return documentExtensions.includes(extension);
};
</script>

<style lang="scss" scoped>
.style-card {
  font-size: 12px;
  line-height: 24px;
  border: 1px solid #f2f2f2;
  border-radius: 16px;
  padding: 10px;
  background: #fff;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}
.menu-icon {
  width: 48px;
  height: 48px;
}

.no-underline {
  text-decoration: none;
}
.style-card {
  font-size: 12px;
  line-height: 24px;
  border: 1px solid #f2f2f2;
  border-radius: 16px;
  padding: 10px;
  background: #fff;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}

.card-announcements {
  border-radius: 20px;
  height: 97px;
  align-content: center;
  border: 1px solid var(--stroke-light-mode, rgba(185, 184, 192, 0.2));
  /* button-s-red */
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}

// .content-style {
//   white-space: pre-wrap;
//   font-feature-settings: "clig" off, "liga" off;
//   text-justify: auto;
//   font-style: normal;
//   font-weight: 300;
//   line-height: 24px;
//   white-space: nowrap;
// }

.content-style {
  word-break: break-word;
  hyphens: auto;
  -webkit-hyphens: auto;
  word-spacing: -1px;

  font-style: normal;
  font-weight: 300;
  line-height: 24px;
}
.content-Tostyle {
  font-feature-settings:
    "liga" off,
    "clig" off;
  font-family: Roboto;

  font-style: normal;
  font-weight: 400;
  line-height: 36px; /* 225% */
}

.content-PostedStyle {
  font-feature-settings:
    "liga" off,
    "clig" off;
  font-family: Roboto;

  font-style: normal;
  font-weight: 300;
  line-height: 24px; /* 150% */
}
</style>
