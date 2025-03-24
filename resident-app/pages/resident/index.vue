<template>
  <v-row no-gutters>
    <!-- header -->
    <v-col cols="12" class="header">
      <!-- profile image -->
      <v-card variant="flat" width="100" height="100" :class="cardProfileImage">
        <v-img
          :src="
            currentUser.profilePicture
              ? `/api/files/${currentUser.profilePicture}`
              : '/default-profile.svg'
          "
          class="profile-image"
          :style="{ marginLeft: theme === 'dark' ? '0px' : '10px' }"
          elevation="0"
        ></v-img>
      </v-card>
      <!-- background image -->
      <!-- <v-img :class="headerBackgroundImage"> -->
      <div>
        <v-img
          :src="
            settingInfoData &&
            settingInfoData.siteInformation &&
            settingInfoData.siteInformation.bgImage
              ? `/api/files/${settingInfoData.siteInformation.bgImage}`
              : '/icons/facility-booking/default.jpg'
          "
          cover
          :class="headerBackgroundImage"
          class="header-background-image"
        >
          <!-- site name -->
          <v-chip
            variant="outlined"
            size="small"
            class="ml-4 chip"
            style="position: relative; top: 9px; right: 2px; z-index: 1"
          >
            <span class="chip-text text-capitalize">
              {{ siteName }}
            </span>
          </v-chip>
          <v-row no-gutters class="fill-height px-6" align-content="end">
            <v-col cols="12" class="pb-3">
              <v-row no-gutters>
                <v-col :cols="$vuetify.display.smAndUp ? '5' : '4'"> </v-col>
                <!-- full name, block name, level name, unit name, resident type -->
                <v-col cols="7" class="text-capitalize">
                  <v-row no-gutters>
                    <v-col
                      :cols="$vuetify.display.smAndDown ? '9' : '8'"
                      class="mb-3"
                    >
                      <v-row no-gutters>
                        <!-- full name -->
                        <v-col
                          cols="12"
                          :class="`${residentName} font-weight-bold text-truncate`"
                          class="pl-1"
                          :style="`color: ${textColor}; z-index: 1;top: 2px; position: relative`"
                        >
                          {{ currentUser.givenName }}
                          {{ currentUser.surname }}
                        </v-col>
                        <!-- block name, level name, unit name -->
                        <v-col
                          cols="12"
                          :class="`${blockLevelUnit} `"
                          class="mt-1"
                          :style="`  color: ${textColor}; z-index: 2;bottom: 6px; position: relative`"
                        >
                          {{ currentUser.blockName }}
                          {{ currentUser.levelName }}
                          {{ currentUser.unitName }}
                        </v-col>
                      </v-row>
                    </v-col>
                    <!-- resident type -->
                    <v-col :cols="$vuetify.display.smAndDown ? '3' : '4'">
                      <v-chip
                        variant="outlined"
                        size="small"
                        class="mt-3 chip"
                        style="z-index: 1"
                      >
                        <span class="chip-text text-capitalize">
                          {{ currentUser.type }}
                        </span>
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-img>
      </div>
    </v-col>

    <!-- offering assistance -->
    <v-col cols="12" :class="`${offerAssistance} pt-12 pl-6 `">
      How can we help you,
      <span class="text-capitalize"> {{ currentUser.givenName }} ? </span>
    </v-col>

    <!-- menus -->
    <v-col cols="12" class="px-3 py-0">
      <v-row no-gutters>
        <template v-for="menuItem in menu" :key="menuItem.icon">
          <v-col cols="4" class="pl-2 py-0">
            <v-card :class="cardMenuItems" :to="{ name: menuItem.to }" flat>
              <v-row no-gutters class="fill-height" align-content="center">
                <v-col cols="12" class="">
                  <v-row no-gutters justify="center" class="">
                    <v-img
                      class="ma-4"
                      height="30"
                      :src="`/icons/resident/home/${
                        theme === 'dark' ? 'dark' : 'light'
                      }/${menuItem.icon}`"
                      :class="menuIcon"
                    ></v-img>
                    <!-- <v-avatar size="40" class="text-center" tile> </v-avatar> -->
                  </v-row>
                </v-col>
                <v-col
                  cols="12"
                  :style="`font-size: ${
                    $vuetify.display.smAndDown ? '11' : '12'
                  }px`"
                >
                  <v-row no-gutters justify="center" :class="menuTitle">
                    {{ menuItem.title }}
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-col>

    <!-- announcements-->
    <v-col cols="12" class="px-5 mb-3">
      <!-- <v-col cols="12" class="container-card-announcements px-5 mb-3"> -->
      <skeleton-loader-component v-if="loading" :loading="loading" />
      <v-carousel
        v-else-if="announcements.length > 0"
        color="#052439"
        :height="$vuetify.display.smAndUp ? '100%' : '100%'"
        :show-arrows="false"
        hide-delimiter-background
        hide-delimiters
        continuous
        cycle
        touch
      >
        <v-carousel-item v-for="(item, i) in announcements" :key="item.index">
          <v-card :class="cardAnnouncements" class="mt-5">
            <v-row
              no-gutters
              class="pa-0 ma-0 d-flex justify-center align-center"
            >
              <v-col cols="12" sm="6" md="6" class="pl-2 py-3">
                <nuxt-link
                  class="no-underline no-space pa-0 ma-0"
                  :to="{
                    name: 'announcement-id',
                    params: { id: item._id },
                    query: {
                      index: item.index,
                    },
                  }"
                  @click="fileIndex = 'false'"
                >
                  <v-row no-gutters class="">
                    <v-col cols="12">
                      <v-row no-gutters>
                        <v-row
                          no-gutters
                          class="justify-start align-center d-flex"
                        >
                          <v-col cols="auto" xs="2" sm="1" md="1">
                            <v-avatar
                              class="pa-1"
                              :size="$vuetify.display.xs ? 25 : 32"
                              style="
                                border-radius: 48px;
                                background: var(--Primary, #eb261e);
                                box-shadow: 0px 5px 14px 0px
                                  rgba(235, 38, 30, 0.5);
                              "
                            >
                              <v-img
                                :src="`/icons/resident/home/home-announcement.svg`"
                              ></v-img>
                            </v-avatar>
                          </v-col>

                          <v-col
                            class="pb-1"
                            cols="auto"
                            xs="10"
                            sm="11"
                            md="11"
                            :class="[
                              'mt-2 font-weight-bold',
                              announcementHeader,
                              !$vuetify.display.xs
                                ? 'text-h5 pl-2 pl-4'
                                : 'pl-2',
                            ]"
                          >
                            Bulletin Board
                          </v-col>
                        </v-row>
                        <!-- <v-col cols="12" class="">
                          <v-avatar
                            class="pa-1"
                            :size="$vuetify.display.xs ? 25 : 60"
                            style="
                              border-radius: 48px;
                              background: var(--Primary, #eb261e);
                              box-shadow: 0px 5px 14px 0px
                                rgba(235, 38, 30, 0.5);
                            "
                          >
                            <v-img
                              :src="`/icons/resident/home/home-announcement.svg`"
                            ></v-img>
                          </v-avatar>
                        </v-col> -->
                        <!-- <v-col
                          cols="12"
                          :class="`mt-2 font-weight-bold ${announcementHeader} text-h5`"
                        >
                          Bulletin Board
                        </v-col>
                        <v-col cols="12">
                          <v-card-title class="pa-0">
                            <v-row no-gutters>
                              <v-col>
                                <span
                                  :class="`${announcementDetails} text-wrap truncate-4-lines text-h6`"
                                >
                                  {{ item.title }}
                                </span>
                              </v-col>
                            </v-row>
                          </v-card-title>
                        </v-col> -->
                        <!-- <v-col
                          cols="12"
                          :class="[
                            'mt-2 font-weight-bold',
                            announcementHeader,
                            !$vuetify.display.xs ? 'text-h5' : '',
                          ]"
                        >
                          Bulletin Board
                        </v-col> -->
                        <v-col cols="12" class="pt-1">
                          <v-card-title class="pa-0">
                            <v-row no-gutters>
                              <v-col>
                                <span
                                  :class="[
                                    announcementDetails,
                                    'text-wrap ',
                                    !$vuetify.display.xs ? 'text-h6' : '',
                                  ]"
                                >
                                  {{ item.title }}
                                </span>
                                <!-- <span
                                  :class="[
                                    announcementDetails,
                                    'text-wrap truncate-4-lines',
                                    !$vuetify.display.xs ? 'text-h6' : '',
                                  ]"
                                >
                                  {{ item.title }}
                                </span> -->
                              </v-col>
                            </v-row>
                          </v-card-title>
                        </v-col>
                        <!-- <v-col cols="12" v-if="!$vuetify.display.xs">
                          <v-card-subtitle class="pa-0">
                            <v-row no-gutters>
                              <v-col>
                                <span
                                  :class="`${announcementDetails} text-wrap truncate-4-lines`"
                                >
                                  {{ item.content }}
                                </span>
                              </v-col>
                            </v-row>
                          </v-card-subtitle>
                        </v-col> -->
                      </v-row>
                    </v-col>
                  </v-row>
                </nuxt-link>
              </v-col>
              <!-- tablet  view -->
              <v-col
                cols="12"
                sm="6"
                md="6"
                :class="[$vuetify.display.xs ? 'ma-0 px-3' : 'ma-0 pr-3']"
              >
                <nuxt-link
                  class="no-underline no-space pa-0 ma-0"
                  :to="{
                    name: 'announcement-id',
                    params: { id: item._id },
                    query: {
                      index: item.index,
                    },
                  }"
                  @click="fileIndex = 'true'"
                >
                  <div v-if="item.file && item.file.length > 0">
                    <div
                      class="pa-0"
                      v-if="
                        item.file.some(
                          (file) =>
                            file.preview &&
                            ['.mp4', '.avi', '.mov', '.flv', '.wmv'].some(
                              (ext) => file.name.toLowerCase().endsWith(ext),
                            ),
                        )
                      "
                      style="position: relative; width: 100%; height: 100%"
                    >
                      <video
                        :src="`/api/files/${
                          item.file.find(
                            (file) =>
                              file.preview &&
                              ['.mp4', '.avi', '.mov', '.flv', '.wmv'].some(
                                (ext) => file.name.toLowerCase().endsWith(ext),
                              ),
                          )._id
                        }`"
                        loop
                        cover
                        style="object-fit: cover"
                        class="image-borderVideo pa-0"
                      ></video>
                      <div
                        style="
                          position: absolute;
                          top: 0;
                          left: 0;
                          width: 100%;
                          height: 100%;
                          background: rgba(
                            0,
                            0,
                            0,
                            0.3
                          ); /* Darken the background */
                          z-index: 1;
                          border-radius: 10px;
                        "
                      ></div>
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
                        :size="$vuetify.display.xs ? 54 : 100"
                      >
                        mdi-play-circle-outline
                      </v-icon>
                    </div>
                    <v-img
                      v-else-if="
                        item.file.some(
                          (file) =>
                            file.preview &&
                            ['.png', '.jpg', '.jpeg'].some((ext) =>
                              file.name.toLowerCase().endsWith(ext),
                            ),
                        )
                      "
                      :src="`/api/files/${
                        item.file.find(
                          (file) =>
                            file.preview &&
                            ['.png', '.jpg', '.jpeg'].some((ext) =>
                              file.name.toLowerCase().endsWith(ext),
                            ),
                        )._id
                      }`"
                      class="image-border"
                      cover
                    ></v-img>
                    <!-- <v-img
                      v-else-if="
                        item.file.some(
                          (file) =>
                            file.preview &&
                            ['.png', '.jpg', '.jpeg'].some((ext) =>
                              file.name.toLowerCase().endsWith(ext),
                            ),
                        )
                      "
                      :src="`/api/files/${
                        item.file.find(
                          (file) =>
                            file.preview &&
                            ['.png', '.jpg', '.jpeg'].some((ext) =>
                              file.name.toLowerCase().endsWith(ext),
                            ),
                        )._id
                      }`"
                      :width="300"
                      :height="50"
                      cover
                    ></v-img> -->
                    <div
                      v-else-if="
                        item.file.some(
                          (file) =>
                            file.preview &&
                            file.name.toLowerCase().endsWith('.pdf'),
                        )
                      "
                      style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                      "
                      class="image-border"
                    >
                      <v-icon
                        color="red"
                        :size="$vuetify.display.xs ? 54 : 120"
                      >
                        mdi-file-pdf-box
                      </v-icon>
                    </div>
                    <!-- <div
                      v-else-if="
                        item.file.some((file) =>
                          ['.mp4', '.avi', '.mov', '.flv', '.wmv'].some((ext) =>
                            file.name.toLowerCase().endsWith(ext),
                          ),
                        )
                      "
                      style="position: relative; width: 100%; height: 100%"
                      
                    >
                      <video
                        :src="`/api/files/${
                          item.file.find((file) =>
                            ['.mp4', '.avi', '.mov', '.flv', '.wmv'].some(
                              (ext) => file.name.toLowerCase().endsWith(ext),
                            ),
                          )._id
                        }`"
                        loop
                        style="width: 100%; object-fit: cover"
                        
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
                        color="white"
                        size="48"
                      >
                        mdi-play-circle-outline
                      </v-icon>
                    </div> -->
                    <!-- <div
                      class="pa-0"
                      v-else-if="
                        item.file.some((file) =>
                          ['.mp4', '.avi', '.mov', '.flv', '.wmv'].some((ext) =>
                            file.name.toLowerCase().endsWith(ext),
                          ),
                        )
                      "
                      style="position: relative; width: 100%; height: 100%"
                    >
                      <video
                        :src="`/api/files/${
                          item.file.find((file) =>
                            ['.mp4', '.avi', '.mov', '.flv', '.wmv'].some(
                              (ext) => file.name.toLowerCase().endsWith(ext),
                            ),
                          )._id
                        }`"
                        loop
                        cover
                        style="object-fit: cover"
                        class="image-borderVideo pa-0"
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
                        :size="$vuetify.display.xs ? 54 : 100"
                      >
                        mdi-play-circle-outline
                      </v-icon>
                    </div> -->
                    <div
                      class="pa-0"
                      v-else-if="
                        item.file.some((file) =>
                          ['.mp4', '.avi', '.mov', '.flv', '.wmv'].some((ext) =>
                            file.name.toLowerCase().endsWith(ext),
                          ),
                        )
                      "
                      style="position: relative; width: 100%; height: 100%"
                    >
                      <video
                        :src="`/api/files/${
                          item.file.find((file) =>
                            ['.mp4', '.avi', '.mov', '.flv', '.wmv'].some(
                              (ext) => file.name.toLowerCase().endsWith(ext),
                            ),
                          )._id
                        }`"
                        loop
                        cover
                        style="object-fit: cover"
                        class="image-borderVideo pa-0"
                      ></video>
                      <div
                        style="
                          position: absolute;
                          top: 0;
                          left: 0;
                          width: 100%;
                          height: 100%;
                          background: rgba(
                            0,
                            0,
                            0,
                            0.3
                          ); /* Darken the background */
                          z-index: 1;
                          border-radius: 10px;
                        "
                      ></div>
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
                        :size="$vuetify.display.xs ? 54 : 100"
                      >
                        mdi-play-circle-outline
                      </v-icon>
                    </div>
                    <v-img
                      v-else-if="
                        item.file.some((file) =>
                          ['.png', '.jpg', '.jpeg'].some((ext) =>
                            file.name.toLowerCase().endsWith(ext),
                          ),
                        )
                      "
                      :src="`/api/files/${
                        item.file.find((file) =>
                          ['.png', '.jpg', '.jpeg'].some((ext) =>
                            file.name.toLowerCase().endsWith(ext),
                          ),
                        )._id
                      }`"
                      cover
                      class="image-border"
                    ></v-img>
                    <!-- <v-img
                      v-else-if="
                        item.file.some((file) =>
                          ['.png', '.jpg', '.jpeg'].some((ext) =>
                            file.name.toLowerCase().endsWith(ext),
                          ),
                        )
                      "
                      :src="`/api/files/${
                        item.file.find((file) =>
                          ['.png', '.jpg', '.jpeg'].some((ext) =>
                            file.name.toLowerCase().endsWith(ext),
                          ),
                        )._id
                      }`"
                      :width="300"
                      :height="50"
                      cover
                    ></v-img> -->
                    <div
                      v-else-if="
                        item.file.some((file) =>
                          file.name.toLowerCase().endsWith('.pdf'),
                        )
                      "
                      style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                      "
                      class="image-border"
                    >
                      <v-icon
                        color="red"
                        :size="$vuetify.display.xs ? 54 : 120"
                      >
                        mdi-file-pdf-box</v-icon
                      >
                    </div>
                    <!-- <v-icon
                      v-else-if="
                        item.file.some((file) =>
                          file.name.toLowerCase().endsWith('.pdf'),
                        )
                      "
                      color="red"
                      size="48"
                      style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                      "
                    >
                      mdi-file-pdf-box
                    </v-icon> -->
                  </div></nuxt-link
                >
              </v-col>
            </v-row>
          </v-card>
        </v-carousel-item>
      </v-carousel>
      <v-card v-else :class="cardAnnouncements">
        <v-col cols="12">
          <v-row no-gutters>
            <v-col cols="2" class="mt-2">
              <v-avatar
                class="pa-3"
                size="48"
                style="
                  border-radius: 48px;
                  background: var(--Primary, #eb261e);
                  box-shadow: 0px 5px 14px 0px rgba(235, 38, 30, 0.5);
                "
              >
                <v-img
                  :src="`/icons/resident/home/home-announcement.svg`"
                ></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="10">
              <v-row no-gutters>
                <v-col
                  cols="12"
                  :class="`pl-4 mt-2 font-weight-bold ${announcementHeader}`"
                >
                  No Announcement
                </v-col>
                <v-col cols="12">
                  <v-card-subtitle>
                    <span :class="`${announcementDetails} text-truncate`">
                      No announcements yet.
                    </span>
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-card>
    </v-col>

    <!-- service providers-->
    <v-col cols="12" class="container-card-service-providers">
      <!--  <span
        cols="12"
        :class="`${spHeader} text-capitalize font-weight-bold px-6`"
      >
        service providers
      </span>
      <v-row no-gutters justify="center">
        <v-sheet
          class="mx-auto"
          elevation="0"
          max-height="150"
          max-width="100%"
          :style="{
            background:
              theme === 'dark' ? 'var(--Secondary-Dark, #0F131C)' : '#fff',
          }"
        >
          <v-slide-group
            v-model="model"
            class="py-4"
            :selected-class="selectedServiceProvider"
            show-arrows
          >
            <v-slide-group-item
              v-for="n in serviceProviders"
              :key="n"
              v-slot="{ isSelected, toggle, selectedClass }"
            >
              <v-card
                :class="[`ma-3 ${cardServiceProviders}`, selectedClass]"
                @click="toggle"
              >
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-row no-gutters justify="center">
                      <v-card class="sp-icon">
                        <v-img
                          :src="`/icons/resident/home/${n.icon}.svg`"
                          style="width: 20px; height: 20px"
                        ></v-img>
                      </v-card>
                    </v-row>
                  </v-col>

                  <v-col cols="12" :class="`${spName} mt-4 text-center`">
                    {{ n.service }}
                  </v-col>
                </v-row>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>
      </v-row>-->
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

const { theme } = useLocal();

const siteName = ref("");

const { getSiteById } = useSite();
const { getByIdAnnouncementLatest, fileIndex, getAllResidentAnnouncement } =
  useAnnouncement();
const { getSiteSettingsById } = useSiteSettings();
const { formatDate } = useUtils();
const { currentUser } = useLocalAuth();
const announcements = ref([]);
const loading = ref(true);
const settingInfoData = ref<any>(null);

onMounted(async () => {
  const siteId = currentUser.value.site;
  fileIndex.value = false;
  if (!theme.value) theme.value = "light";

  const res = await getSiteById(currentUser.value.site);
  siteName.value = res.name;
  // const announcement = await getByIdAnnouncementLatest(currentUser.value.site);
  const announcement: any = await getAllResidentAnnouncement(
    currentUser.value.site,
  );

  settingInfoData.value = await getSiteSettingsById(siteId);
  announcements.value = Array.isArray(announcement?.items)
    ? announcement.items
    : [];

  loading.value = false;
});

const fileIndices = computed(() => {
  if (Array.isArray(announcements.value) && announcements.value.length > 0) {
    return announcements.value.map((item) => {
      const previewIndex = item.file.findIndex((file) => file.preview === true);

      if (previewIndex !== -1) {
        return previewIndex;
      }

      const videoIndex = item.file.findIndex((file) =>
        [".mp4", ".avi", ".mov", ".flv", ".wmv"].some((ext) =>
          file.name.toLowerCase().endsWith(ext),
        ),
      );

      if (videoIndex === -1) {
        const imageIndex = item.file.findIndex((file) =>
          [".png", ".jpg", ".jpeg"].some((ext) =>
            file.name.toLowerCase().endsWith(ext),
          ),
        );

        if (imageIndex === -1) {
          return item.file.findIndex((file) =>
            file.name.toLowerCase().endsWith(".pdf"),
          );
        }

        return imageIndex;
      }

      return videoIndex;
    });
  } else {
    return [];
  }
});

watch(fileIndices, (newVal: any) => {
  if (newVal.length > 0) {
    fileIndex.value = true;
  }
});

const headerBackgroundImage = computed(() =>
  theme.value === "dark"
    ? "header-background-image-dark"
    : "header-background-image-light",
);

const cardProfileImage = computed(() =>
  theme.value === "dark"
    ? "card-profile-image-dark"
    : "card-profile-image-light",
);

const residentName = computed(() =>
  theme.value === "dark" ? "resident-name-dark" : "resident-name-light",
);

const blockLevelUnit = computed(() =>
  theme.value === "dark" ? "block-level-unit-dark" : "block-level-unit-light",
);

const cardAnnouncements = computed(() =>
  theme.value === "dark"
    ? "card-announcements-dark "
    : "card-announcements-light",
);

const announcementHeader = computed(() =>
  theme.value === "dark"
    ? "announcements-header-dark "
    : "announcements-header-light",
);

const announcementDetails = computed(() =>
  theme.value === "dark"
    ? "announcements-details-dark "
    : "announcements-details-light",
);

const offerAssistance = computed(() =>
  theme.value === "dark" ? "offer-assistance-dark " : "offer-assistance-light",
);

const cardMenuItems = computed(() =>
  theme.value === "dark" ? "card-menu-items-dark " : "card-menu-items-light",
);

const menuIcon = computed(() =>
  theme.value === "dark" ? "menu-icon-dark" : "menu-icon-light",
);

const menuTitle = computed(() =>
  theme.value === "dark" ? "menu-title-dark" : "menu-title-light",
);
const textColor = computed(() => (theme.value === "dark" ? "white" : "white"));
const menu = [
  {
    title: "Feedback",
    icon: "feedbackFinal.svg",
    to: "feedbacks",
  },
  {
    title: "Bulletin Board",
    icon: "announcementFinal.svg",
    to: "announcement",
  },
  {
    title: "Invite Visitors",
    icon: "invite-visitorFinal.svg",
    to: "resident-invite",
  },
  {
    title: "My Visitors",
    icon: "my-visitorFinal.svg",
    to: "resident-my-visitor",
  },
  {
    title: "My Unit",
    icon: "my-unitFinal.svg",
    to: "coming-soon",
    params: {},
  },
  {
    title: "Billing",
    icon: "billingModuleFinal.svg",
    to: "billing",
    params: {},
  },
  // {
  //   title: "Contacts",
  //   icon: "contacts.svg",
  //   to: "coming-soon",
  //   params: {},
  // },
  {
    title: "Emergency",
    icon: "medical-emergency.svg",
    to: "resident-emergency",
    params: {},
  },
  {
    title: "Intelligent Lock",
    icon: "intelligentLockFinal.svg",
    to: "intelligent-lock",
    params: {},
  },
  {
    title: "Facility Booking",
    icon: "facility-bookingFinal.svg",
    to: "resident-facility-booking",
    params: {},
  },
  {
    title: "Online Form",
    icon: "OnlineFormsFinalIcon.svg",
    to: "online-forms",
    params: {},
  },
  {
    title: "Request SOA",
    icon: "requestSoaFinal.svg",
    to: "request-soa",
    params: {},
  },
  {
    title: "About Site",
    icon: "about-site.svg",
    to: "about-site",
    params: {},
  },
];

const serviceProviders = [
  {
    icon: "aircon",
    service: "Aircon",
  },
  {
    icon: "solar-film",
    service: "Solar Film",
  },
  {
    icon: "plumbing",
    service: "Plumbing",
  },
  {
    icon: "house-paint",
    service: "House Painting",
  },
];
</script>

<style scoped>
.truncate-4-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: normal;
}

.no-space {
  margin: 0;
  padding: 0;
}
.header {
  position: relative;
}
.header-background-image {
  position: relative;
  height: 240px;
}

.header-background-image-light::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  box-shadow: inset 0 -1px 0 rgb(134, 134, 134);
  z-index: 1;
}

.header-background-image-dark::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    180deg,
    rgba(20, 22, 39, 0.5) 0%,
    rgba(0, 0, 0, 0.5) 100%,
    #131218 120%
  );
  box-shadow: inset 0 -1px 0 rgb(255, 255, 255);
  z-index: 1;
}
.card-profile-image-light {
  position: absolute;
  bottom: -35px;
  left: 15px;
  z-index: 1;
  border-radius: 757.819px;
  align-content: center;
}
.card-profile-image-dark {
  position: absolute;
  bottom: -35px;
  left: 15px;
  z-index: 1;
  border-radius: 757.819px;
  border: 11.89px solid #131218;
  align-content: center;
}
.profile-image {
  width: 81px;
  height: 81px;
  border-radius: 757.819px;
  border: 2px solid var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(224, 36, 28, 0.2);
}
.resident-name-light {
  color: #111824;
  font-feature-settings:
    "liga" off,
    "clig" off;
  font-family: Roboto;
  font-weight: 500;
  font-size: 17px;
  font-style: normal;
  line-height: 24px;
}
.resident-name-dark {
  color: var(--Light, #dfe2e9);
  font-feature-settings:
    "liga" off,
    "clig" off;
  font-family: Roboto;
  font-weight: 500;
  font-size: 17px;
  font-style: normal;
  line-height: 24px;
}
.block-level-unit-light {
  color: #111824;
  font-feature-settings:
    "liga" off,
    "clig" off;
  text-shadow:
    0px 4px 10px rgba(0, 0, 0, 0.3),
    0px 16px 30px rgba(0, 0, 0, 0.9);
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
}
.block-level-unit-dark {
  color: var(--Light, #dfe2e9);
  font-feature-settings:
    "liga" off,
    "clig" off;
  text-shadow:
    0px 4px 10px rgba(0, 0, 0, 0.3),
    0px 16px 30px rgba(0, 0, 0, 0.9);
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
}
.chip {
  border-radius: 24px;
  border: 1px solid var(--Primary, #eb261e);
  background: var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
  position: absolute;
}
.chip-text {
  color: var(--Light, #dfe2e9);
  font-feature-settings:
    "liga" off,
    "clig" off;
  text-shadow:
    0px 4px 10px rgba(0, 0, 0, 0.3),
    0px 16px 30px rgba(0, 0, 0, 0.9);
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
}
.container-card-service-providers {
  margin-top: 15px;
}
.card-service-providers-light {
  width: 92px;
  height: 120px;
  border-radius: 12px;
  border: 2px solid rgba(185, 184, 192, 0.18);
  background: rgba(250, 250, 250, 0.98);
  box-shadow: 0px 5px 14px 0px rgba(15, 14, 20, 0.1);
  align-content: center;
}
.card-service-providers-dark {
  width: 92px;
  height: 120px;
  border-radius: 12px;
  border: 2px solid rgba(185, 184, 192, 0.18);
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.02) 0%,
      rgba(0, 0, 0, 0) 74.55%
    ),
    #121a25;
  box-shadow: 0px 5px 14px 0px rgba(255, 255, 255, 0.1);
  align-content: center;
}
.selected-service-provider-light {
  width: 92px;
  height: 120px;
  border-radius: 12px;
  border: 2px solid var(--Primary, #eb261e);
  background: var(--Off-white, #fff);
  box-shadow: 0px 12px 14px 0px rgba(235, 38, 30, 0.5);
}
.selected-service-provider-dark {
  width: 92px;
  height: 120px;
  border-radius: 12px;
  border: 2px solid #e0241c;
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.02) 0%,
      rgba(0, 0, 0, 0) 74.55%
    ),
    #121a25;
  box-shadow: 0px 12px 14px 0px rgba(235, 38, 30, 0.5);
}
.sp-header-light {
  color: #111824;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
}
.sp-header-dark {
  color: var(--Light, #dfe2e9);
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
}
.sp-icon {
  width: 45px;
  height: 45px;
  padding: 10px;
  border-radius: 26.667px;
  border: 3.333px solid #73717f;
  box-shadow: 0px 3.333px 6.667px 0px rgba(201, 201, 201, 0.3);
}
.sp-name-light {
  color: #111824;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  opacity: 0.7;
}
.sp-name-dark {
  color: var(--Light, #dfe2e9);
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  opacity: 0.7;
}
.container-card-announcements {
  margin-top: 10px;
  margin-bottom: -40px;
}
.card-announcements-light {
  border-radius: 16px;
  border: 2px solid var(--stroke-light-mode, rgba(185, 184, 192, 0.2));
  background: var(--Off-white, #fff);
  box-shadow: 0px 5px 14px 0px rgba(19, 18, 24, 0.1);
  align-content: center;
}
.card-announcements-dark {
  border-radius: 16px;
  border: 2px solid #202733;
  background: #121a25;
  box-shadow: 0px 5px 14px 0px rgba(19, 18, 24, 0.1);
  align-content: center;
}
.announcements-header-light {
  color: #111824;
  font-size: 16px;
  font-style: normal;
  line-height: 24px;
}
.announcements-header-dark {
  color: var(--Light, #dfe2e9);
  font-size: 16px;
  font-style: normal;
  line-height: 24px;
}
.announcements-details-light {
  color: #111824;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
}
.announcements-details-dark {
  color: var(--Light, #dfe2e9);
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
}
.offer-assistance-light {
  color: #052439;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}
.offer-assistance-dark {
  color: var(--Light, #dfe2e9);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}
.card-menu-items-light {
  font-size: 12px;
  line-height: 24px;
  padding: 10px;
  background: #fff;
  /* width: 116px;
  height: 90px; */
}
.card-menu-items-dark {
  font-size: 12px;
  line-height: 24px;
  padding: 10px;
  background: #0f131c;
  /* width: 116px;
  height: 90px; */
}
.menu-icon-light {
  width: 100%;
  height: 100%;
  fill: var(--icon-gradient, linear-gradient(180deg, #b9b8c0 0%, #57565a 100%));
  object-fit: cover;
}

.menu-icon-dark {
  width: 100%;
  height: 100%;
  fill: var(--icon-gradient, linear-gradient(180deg, #b9b8c0 0%, #57565a 100%));
  object-fit: cover;
}

.menu-title-light {
  color: #111824;
  text-align: center;
  font-feature-settings:
    "liga" off,
    "clig" off;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.menu-title-dark {
  color: var(--Light, #dfe2e9);
  text-align: center;
  font-feature-settings:
    "liga" off,
    "clig" off;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.no-underline {
  text-decoration: none;
}

.svg-big {
  transform: scale(1, 1);
}

.avatar-no-color {
  background-color: transparent !important;
}

.image-border {
  border: 1px solid #e6e6e7;
  border-radius: 10px;
  object-fit: contain;
  width: 100%;
  height: 15vh;
  min-height: 100px;
  display: block;
  margin: 10px 0;
  padding: 10px 0;
  box-sizing: border-box;
}

@media (max-width: 600px) {
  .image-border {
    height: 200px;
    padding: 10px;
  }
}

.image-borderVideo {
  border: 1px solid #e6e6e7;
  border-radius: 10px;
  object-fit: contain;
  width: 100%;
  height: 15vh;
  min-height: 100px;
  display: block;
  margin: 10px 0;
  padding: 10px 0;
  box-sizing: border-box;
}
@media (max-width: 600px) {
  .image-borderVideo {
    height: 200px;
    padding: 10px;
  }
}
</style>
