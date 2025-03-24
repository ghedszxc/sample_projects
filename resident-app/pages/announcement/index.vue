<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-col cols="12">
        <v-toolbar color="secondaryDark">
          <v-col
            cols="12"
            class="header d-flex justify-space-between align-center pa-0"
          >
            <v-col cols="12">
              <v-icon
                start
                size="x-large"
                @click="goBack()"
                style="position: relative; right: 15px; top: 2px"
              >
                <v-img
                  class="pl-0 ml-0 mt-1"
                  src="/dark-mode/utility-all/right-arrow.svg"
                  cover
                ></v-img>
              </v-icon>
              <span style="position: relative; right: 23px; color: baseColor">
                Bulletin Board</span
              >
            </v-col>
          </v-col>

          <template v-slot:extension>
            <v-tabs
              v-model="tabsAnnouncements"
              slider-color="#EB261E"
              grow
              stacked
              class="fs16"
            >
              <v-tab :value="1" text="Community" class="pb-2 fs16"> </v-tab>

              <!-- <v-tab :value="2" text="Promotional" class="pb-2"> </v-tab> -->
              <v-tab :value="3" text="History" class="pb-2"> </v-tab>
            </v-tabs>
          </template>
        </v-toolbar>

        <v-tabs-window v-model="tabsAnnouncements">
          <v-tabs-window-item :value="1">
            <v-row no-gutters v-if="loading || totalLengthAnnouncements">
              <v-col cols="12" class="">
                <div v-if="loading" class="my-6 mx-2">
                  <skeleton-loader-component
                    :loading="loading"
                    v-for="i in 10"
                    :key="i"
                    transition="fade-transition"
                  />
                </div>
                <v-infinite-scroll
                  v-else-if="totalLengthAnnouncements"
                  mode="manual"
                  @load="load"
                >
                  <template
                    v-for="(announcementsItems, date) in announcements"
                    :key="date"
                  >
                    <div class="date-text pl-4 pb-3">Posted {{ date }}</div>
                    <template
                      v-for="(announcement, i) in announcementsItems"
                      :key="announcement._id"
                    >
                      <v-col cols="12" class="">
                        <nuxt-link
                          class="no-underline"
                          :to="{
                            name: 'announcement-id',
                            params: { id: announcement._id },
                          }"
                        >
                          <v-card variant="flat" :class="cardDesign">
                            <v-col cols="12">
                              <v-row no-gutters>
                                <v-col cols="2">
                                  <v-avatar
                                    color="#E0241C"
                                    class="pa-3"
                                    size="48"
                                  >
                                    <v-img
                                      src="/icons/resident/home/announcement.svg"
                                    ></v-img>
                                  </v-avatar>
                                </v-col>
                                <v-col cols="10">
                                  <v-row no-gutters>
                                    <v-col
                                      cols="12"
                                      class="pl-4 text-header-announcement"
                                    >
                                      Bulletin Board
                                    </v-col>
                                    <v-col cols="12">
                                      <v-card-subtitle>
                                        <span
                                          class="text-truncate text-content-announcement"
                                          style="max-width: 240px"
                                        >
                                          {{ announcement.title }}
                                        </span>
                                      </v-card-subtitle>
                                    </v-col>
                                  </v-row>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-card>
                          <!-- <v-card
                            class="style-card"
                            :subtitle="formatDate(announcement.createdAt)"
                            :title="announcement.title"
                            variant="flat"
                            :color="color[i]"
                          >
                            <template v-slot:prepend>
                              <v-avatar>
                                <v-img
                                  src="/icons/resident/home/home-announcement-orange.svg"
                                  class="menu-icon"
                                ></v-img>
                              </v-avatar>
                            </template>

                            <v-card-text class="text-truncate">
                              {{ announcement.content }}
                            </v-card-text>
                          </v-card> -->
                        </nuxt-link>
                      </v-col>
                    </template>
                  </template>

                  <template v-slot:load-more="{ props }">
                    <v-btn
                      v-if="canNextPage"
                      :variant="!canNextPage ? 'text' : 'outlined'"
                      width="100%"
                      size="large"
                      color="#E0241C"
                      class="mt-4 my-button"
                      v-bind="props"
                      :disabled="!canNextPage"
                    >
                      {{
                        !canNextPage
                          ? "No more announcement to load."
                          : "Load more"
                      }}
                    </v-btn>

                    <div class="w-100" v-else>
                      <p class="text-grey text-center">
                        No more items to show on the bulletin board.
                      </p>
                    </div>
                  </template>
                </v-infinite-scroll>
              </v-col>
            </v-row>
            <v-row
              no-gutters
              class="d-flex px-6 pb-0 mb-0"
              v-else-if="!loading"
            >
              <v-col cols="12" class="">
                <v-row no-gutters justify="center" class="mt-11">
                  <v-col cols="12" class="mt-3">
                    <v-row no-gutters justify="center">
                      <v-card max-width="504" mb-3 rounded="0" flat>
                        <v-img height="100%" cover>
                          <v-avatar rounded="0" size="190">
                            <v-img
                              src="/images/resident/approve.svg"
                              cover
                            ></v-img>
                          </v-avatar>
                        </v-img>
                      </v-card>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" class="mt-6">
                <v-row justify="end">
                  <v-col cols="12" class="text-center pb-3">
                    <div class="px-15">
                      <span class="forgot-password"
                        >The bulletin board is empty for now.</span
                      >
                      <br class="" />
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-tabs-window-item>

          <v-tabs-window-item :value="2">
            <v-row no-gutters v-if="loading || totalLengthAnnouncements">
              <v-col cols="12" class="">
                <v-infinite-scroll mode="manual" @load="load">
                  <template
                    v-for="(announcementsItems, date) in announcements"
                    :key="date"
                  >
                    <div class="date-text pl-4 pb-3">Posted {{ date }}</div>
                    <template
                      v-for="(announcement, i) in announcementsItems"
                      :key="announcement._id"
                    >
                      <skeleton-loader-component
                        v-if="loading"
                        :loading="loading"
                      />

                      <v-col cols="12" class="" v-else>
                        <nuxt-link
                          class="no-underline"
                          :to="{
                            name: 'announcement-promotional-id',
                            params: { id: 1 },
                          }"
                        >
                          <v-card
                            class="mx-auto rounded-xl mx-6 card-promotional"
                            variant="flat"
                          >
                            <v-img
                              height="152px"
                              src="/icons/feedback/sample-image.jpg"
                              cover
                            ></v-img>

                            <v-row
                              no-gutters
                              class="d-flex px-4 py-3"
                              justify="center"
                            >
                              <v-col
                                cols="2"
                                class="align-self-center text-center"
                              >
                                <v-avatar>
                                  <v-img
                                    alt="John"
                                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                                  ></v-img> </v-avatar
                              ></v-col>
                              <v-col cols="10">
                                <v-card-title class="pb-0">
                                  Aircon Servicing
                                </v-card-title>

                                <v-card-subtitle>
                                  10% off on all services
                                </v-card-subtitle></v-col
                              >
                            </v-row>
                          </v-card>
                        </nuxt-link>
                      </v-col>
                    </template>
                  </template>

                  <template v-slot:load-more="{ props }">
                    <v-btn
                      flat
                      tile
                      size="small"
                      :variant="!canNextPage ? 'text' : 'outlined'"
                      class="mt-4"
                      v-bind="props"
                      :disabled="!canNextPage"
                    >
                      {{
                        !canNextPage
                          ? "No more promotional announcement to load."
                          : "Load more"
                      }}
                    </v-btn>
                  </template>
                </v-infinite-scroll>
              </v-col>
            </v-row>
            <v-row
              no-gutters
              class="d-flex px-6 pb-0 mb-0"
              v-else-if="!loading"
            >
              <v-col cols="12" class="">
                <v-row no-gutters justify="center" class="mt-11">
                  <v-col cols="12" class="mt-3">
                    <v-row no-gutters justify="center">
                      <v-card max-width="504" mb-3 rounded="0" flat>
                        <v-img height="100%" cover>
                          <v-avatar rounded="0" size="190">
                            <v-img
                              src="/images/resident/approve.svg"
                              cover
                            ></v-img>
                          </v-avatar>
                        </v-img>
                      </v-card>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" class="mt-6">
                <v-row justify="end">
                  <v-col cols="12" class="text-center pb-3">
                    <div class="px-15">
                      <span class="forgot-password"
                        >No announcement(s) yet.</span
                      >
                      <br class="" />
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-tabs-window-item>
          <v-tabs-window-item :value="3">
            <v-row
              no-gutters
              v-if="prevLoading || totalLengthPreviousAnnouncements"
            >
              <v-col cols="12" class="">
                <div v-if="prevLoading" class="my-6 mx-2">
                  <skeleton-loader-component
                    :loading="prevLoading"
                    v-for="i in 10"
                    :key="i"
                    transition="fade-transition"
                  />
                </div>
                <v-infinite-scroll
                  v-else-if="totalLengthPreviousAnnouncements"
                  mode="manual"
                  @load="loadPreviousAnnouncements"
                >
                  <template
                    v-for="(announcementsItems, date) in previousAnnouncements"
                    :key="date"
                  >
                    <div class="date-text pl-4 pb-3">Posted {{ date }}</div>
                    <template
                      v-for="(announcement, i) in announcementsItems"
                      :key="announcement._id"
                    >
                      <v-col cols="12" class="">
                        <nuxt-link
                          class="no-underline"
                          :to="{
                            name: 'announcement-id',
                            params: { id: announcement._id },
                          }"
                        >
                          <v-card variant="flat" :class="cardDesign">
                            <v-col cols="12">
                              <v-row no-gutters>
                                <v-col cols="2">
                                  <v-avatar
                                    color="#E0241C"
                                    class="pa-3"
                                    size="48"
                                  >
                                    <v-img
                                      src="/icons/resident/home/announcement.svg"
                                    ></v-img>
                                  </v-avatar>
                                </v-col>
                                <v-col cols="10">
                                  <v-row no-gutters>
                                    <v-col
                                      cols="12"
                                      class="pl-4 text-header-announcement"
                                    >
                                      Bulletin Board
                                    </v-col>
                                    <v-col cols="12">
                                      <v-card-subtitle>
                                        <span
                                          class="text-truncate text-content-announcement"
                                          style="max-width: 240px"
                                        >
                                          {{ announcement.title }}
                                        </span>
                                      </v-card-subtitle>
                                    </v-col>
                                  </v-row>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-card>
                        </nuxt-link>
                      </v-col>
                    </template>
                  </template>

                  <template v-slot:load-more="{ props }">
                    <!-- <v-btn
                      flat
                      tile
                      size="small"
                      :variant="!prevCanNextPage ? 'text' : 'outlined'"
                      class="mt-4"
                      v-bind="props"
                      :disabled="!prevCanNextPage"
                    >
                      {{
                        !prevCanNextPage
                          ? "No more announcement to load."
                          : "Load more"
                      }}
                    </v-btn> -->

                    <v-btn
                      v-if="prevCanNextPage"
                      :variant="!prevCanNextPage ? 'text' : 'outlined'"
                      width="100%"
                      size="large"
                      color="#E0241C"
                      class="mt-4 my-button"
                      v-bind="props"
                      :disabled="!prevCanNextPage"
                    >
                      {{
                        !prevCanNextPage
                          ? "No more announcement to load."
                          : "Load more"
                      }}
                    </v-btn>

                    <div class="w-100" v-else>
                      <p class="text-grey text-center">
                        No more items to show on the bulletin board.
                      </p>
                    </div>
                  </template>
                </v-infinite-scroll>
              </v-col>
            </v-row>
            <v-row
              no-gutters
              class="d-flex px-6 pb-0 mb-0"
              v-else-if="!prevLoading"
            >
              <v-col cols="12" class="">
                <v-row no-gutters justify="center" class="mt-11">
                  <v-col cols="12" class="mt-3">
                    <v-row no-gutters justify="center">
                      <v-card max-width="504" mb-3 rounded="0" flat>
                        <v-img height="100%" cover>
                          <v-avatar rounded="0" size="190">
                            <v-img
                              src="/images/resident/approve.svg"
                              cover
                            ></v-img>
                          </v-avatar>
                        </v-img>
                      </v-card>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" class="mt-6">
                <v-row justify="end">
                  <v-col cols="12" class="text-center pb-3">
                    <div class="px-15">
                      <span class="forgot-password"
                        >The bulletin board is empty for now..</span
                      >
                      <br class="" />
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-col>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});
const { theme } = useLocal();
import { groupBy } from "lodash";
const { currentUser } = useLocalAuth();
const { tabsAnnouncements, getAllResidentAnnouncement } = useAnnouncement();
const { formatDate } = useUtils();

const announcements = ref([]);
const previousAnnouncements = ref([]);

const page = ref<number>(1);
const pages = ref<number>(0);
const canNextPage = computed(() => pages.value > page.value);
const loading = ref(true);
const totalLengthAnnouncements = ref(0);

// prev annoucements
const prevPage = ref<number>(1);
const prevPages = ref<number>(0);
const prevCanNextPage = computed(() => prevPages.value > prevPage.value);
const prevLoading = ref(true);
const totalLengthPreviousAnnouncements = ref(0);

onMounted(async () => {
  if (!theme.value) theme.value = "light";
  const announcement: any = await getAllResidentAnnouncement(
    currentUser.value.site,
    page.value,
  );
  pages.value = announcement.pages;
  const groupedAnnouncements = groupBy(announcement.items, (item) =>
    formatDate(item.createdAt),
  );

  announcements.value = groupedAnnouncements;
  totalLengthAnnouncements.value = Object.values(groupedAnnouncements).reduce(
    (sum, items) => sum + items.length,
    0,
  );

  const PreviousAnnouncement: any = await getAllResidentAnnouncement(
    currentUser.value.site,
    page.value,
    "expired",
  );
  prevPages.value = PreviousAnnouncement.pages;
  const groupedPreviousAnnouncements = groupBy(
    PreviousAnnouncement.items,
    (item) => formatDate(item.createdAt),
  );
  previousAnnouncements.value = groupedPreviousAnnouncements;
  totalLengthPreviousAnnouncements.value = Object.values(
    groupedPreviousAnnouncements,
  ).reduce((sum, items) => sum + items.length, 0);

  setTimeout(() => {
    loading.value = false;
    prevLoading.value = false;
  }, 1000);
});

function goBack() {
  useRouter().push({ name: "resident" });
}

function groupAndMergeAnnouncements(
  announcements: { value: { [dateKey: string]: any[] } },
  newAnnouncements: { items: any },
) {
  const groupedAnnouncements = groupBy(newAnnouncements.items, (item) =>
    formatDate(item.createdAt),
  );

  for (const [dateKey, value] of Object.entries(groupedAnnouncements)) {
    if (announcements.value[dateKey]) {
      announcements.value[dateKey] = [
        ...announcements.value[dateKey],
        ...value,
      ];
    } else {
      announcements.value[dateKey] = value;
    }
  }
}
function load({ done }: { done: any }) {
  setTimeout(async () => {
    page.value = page.value + 1;

    const _nextAnnouncements: any = await getAllResidentAnnouncement(
      currentUser.value.site,
      page.value,
    );

    pages.value = _nextAnnouncements.pages;

    if (_nextAnnouncements.items.length) {
      groupAndMergeAnnouncements(announcements, _nextAnnouncements);
    }

    done("ok");
  }, 1000);
}

function loadPreviousAnnouncements({ done }: { done: any }) {
  setTimeout(async () => {
    prevPage.value = prevPage.value + 1;

    const _previousAnnouncements = await getAllResidentAnnouncement(
      currentUser.value.site,
      prevPage.value,
      "expired",
    );

    prevPages.value = _previousAnnouncements.pages;

    if (_previousAnnouncements.items.length) {
      groupAndMergeAnnouncements(previousAnnouncements, _previousAnnouncements);
    }

    done("ok");
  }, 1000);
}

const cardDesign = computed(() =>
  theme.value === "dark" ? "card-announcements" : "card-announcements-light",
);
</script>

<style lang="scss" scoped>
.style-card {
  font-size: 12px;
  line-height: 24px;
  border: 1px solid #f2f2f2;
  border-radius: 16px;
  padding: 10px;

  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}
.menu-icon {
  width: 48px;
  height: 48px;
}

.no-underline {
  text-decoration: none;
}

.card-announcements {
  border-radius: 20px;
  height: 97px;
  align-content: center;
  border-radius: 16px;
  border: 1px solid var(--dark-grey-border, #343a45);

  /* button-s-red */
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}
.card-announcements-light {
  border-radius: 20px;
  height: 97px;
  align-content: center;
  border-radius: 16px;

  border: 1px solid var(--stroke-light-mode, rgba(185, 184, 192, 0.2));

  /* ds-light-mode */
  box-shadow: 0px 5px 14px 0px rgba(15, 14, 20, 0.1);
}
.card-promotional {
  border-radius: 16px;

  align-content: center;
}

.date-text {
  font-feature-settings:
    "clig" off,
    "liga" off;

  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 36px; /* 257.143% */
}

.text-header-announcement {
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.text-content-announcement {
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
}

.my-button {
  background-color: #e0241c !important;
  color: #ffffff !important;
}
</style>
