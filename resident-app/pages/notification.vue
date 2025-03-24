<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-col cols="12">
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
              Notification</span
            >
          </v-col>
        </v-col>

        <v-row no-gutters v-if="loading || totalLengthAnnouncements">
          <v-col cols="12" class="">
            <v-infinite-scroll mode="manual" @load="load">
              <template
                v-for="(announcementsItems, date) in announcements"
                :key="date"
              >
                <div class="date-text pl-4 pb-3">
                  {{ date === latestDate ? `Today ${date}` : date }}
                </div>
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
                        name: 'announcement-id',
                        params: { id: announcement._id },
                      }"
                    >
                      <v-card variant="flat" :class="cardDesign">
                        <v-col cols="12">
                          <v-row>
                            <v-col cols="1">
                              <v-avatar size="24" class="ml-3">
                                <v-img src="/notificationBell.svg"></v-img>
                              </v-avatar>
                            </v-col>
                            <v-col cols="11" class="pl-5">
                              <v-row no-gutters>
                                <v-col
                                  cols="12"
                                  class="pl-4 text-header-annoucement"
                                >
                                  New Announcement</v-col
                                >
                                <v-col cols="12">
                                  <v-card-subtitle>
                                    <span
                                      class="text-truncate text-content-announcement"
                                      style="max-width: 240px"
                                    >
                                      {{ announcement.title }}
                                    </span>
                                    <h5 class="mt-5">
                                      {{
                                        formatTime24hrs(announcement.createdAt)
                                      }}
                                    </h5>
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
                    !canNextPage ? "No more notification to load." : "Load more"
                  }}
                </v-btn>
              </template>
            </v-infinite-scroll>
          </v-col>
        </v-row>
        <v-row no-gutters class="d-flex px-6 pb-0 mb-0" v-else-if="!loading">
          <v-col cols="12" class="">
            <v-row no-gutters justify="center" class="mt-11">
              <v-col cols="12" class="mt-3">
                <v-row no-gutters justify="center">
                  <v-card max-width="504" mb-3 rounded="0" flat>
                    <v-img height="100%" cover>
                      <v-avatar rounded="0" size="190">
                        <v-img src="/images/resident/approve.svg" cover></v-img>
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
                  <span class="forgot-password">No announcement(s) yet.</span>
                  <br class="" />
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
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
const { getAllResidentAnnouncement } = useAnnouncement();
const { formatDate, formatTime24hrs, formatDateNotification } = useUtils();

const announcements = ref([]);
const latestDate = ref(null);
const page = ref<number>(1);
const pages = ref<number>(0);
const canNextPage = computed(() => pages.value > page.value);
const loading = ref(true);
const totalLengthAnnouncements = ref(0);

onMounted(async () => {
  if (!theme.value) theme.value = "light";
  const announcement = await getAllResidentAnnouncement(
    currentUser.value.site,
    page.value,
  );
  pages.value = announcement.pages;
  const groupedAnnouncements = groupBy(announcement.items, (item) =>
    formatDateNotification(item.createdAt),
  );

  latestDate.value = Object.keys(groupedAnnouncements).sort().pop();

  announcements.value = groupedAnnouncements;
  totalLengthAnnouncements.value = Object.values(groupedAnnouncements).reduce(
    (sum, items) => sum + items.length,
    0,
  );

  setTimeout(() => {
    loading.value = false;
  }, 1000);
});

function goBack() {
  useRouter().push({ name: "resident" });
}

function load({ done }) {
  setTimeout(async () => {
    page.value = page.value + 1;

    const _nextVisitors = await getAllResidentAnnouncement(
      currentUser.value.site,
      page.value,
    );

    pages.value = _nextVisitors.pages;
    if (_nextVisitors.items.length) {
      announcements.value.items.push(
        ..._nextVisitors.items.map((item, index) => ({
          ...item,
          index: announcements.value.length + index + 1,
        })),
      );
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

  align-content: center;
  border-radius: 16px;
  border: 1px solid var(--dark-grey-border, #343a45);

  /* button-s-red */
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}
.card-announcements-light {
  border-radius: 20px;

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
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 36px; /* 257.143% */
}

.text-header-annoucement {
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.text-content-announcement {
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
}
</style>
