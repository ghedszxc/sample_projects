<template>
  <v-row no-gutters>
    <!-- go back -->
    <v-col
      :cols="$vuetify.display.smAndDown ? '5' : '6'"
      :class="`mt-8 ${$vuetify.display.smAndUp ? 'px-12' : 'px-3'}`"
      @click="goBack()"
    >
      <v-icon start size="x-large" style="position: relative; right: 5px">
        <v-img
          class="pl-0 ml-0"
          src="/dark-mode/utility-all/right-arrow.svg"
          cover
        ></v-img>
      </v-icon>
      <span
        style="position: relative; right: 15px; color: baseColor; bottom: 3px"
      >
        Feedbacks
      </span>
    </v-col>

    <v-col
      :cols="$vuetify.display.smAndDown ? '7' : '6'"
      :class="`mt-8 d-flex justify-end ${
        $vuetify.display.smAndUp ? 'px-12' : 'px-3'
      }`"
      @click="createFeedback"
    >
      <v-icon start size="50" style="position: relative; left: 3px; top: 1px">
        <v-img
          class="pl-0 ml-0"
          src="/dark-mode/utility-all/add-visitor.svg"
          cover
        ></v-img>
      </v-icon>

      <span style="position: relative; left: -5px; top: 1px">
        Create Feedback
      </span>
    </v-col>

    <!-- tabs -->

    <v-col cols="12" class="ma-0 pa-0">
      <v-tabs
        v-model="tabsFeedbacks"
        grow
        stacked
        slider-color="#EB261E"
        class="pa-0 ma-0"
        :class="` ${$vuetify.display.smAndUp ? 'px-12' : 'px-5'}`"
      >
        <v-tab @click="loadTab(1)" :value="1" text="Pending" class=""> </v-tab>
        <v-tab @click="loadTab(2)" :value="2" text="Resolved" class=""> </v-tab>
      </v-tabs>
      <v-tabs-window
        v-model="tabsFeedbacks"
        :class="`${$vuetify.display.smAndUp ? 'px-9' : 'px-1'}`"
      >
        <v-tabs-window-item :value="1" class="">
          <v-col v-if="loading || data.feedbacks.pages" cols="12">
            <div v-if="loading">
              <skeleton-loader-component
                :loading="loading"
                v-for="i in 10"
                :key="i"
                transition="fade-transition"
              />
            </div>
            <v-col v-else-if="loadingTabPending" cols="12">
              <div v-for="i in 10" :key="i">
                <skeleton-loader-component
                  :loading="loadingTabPending"
                  transition="fade-transition"
                />
              </div>
            </v-col>
            <v-infinite-scroll
              v-else-if="data.feedbacks.items"
              mode="manual"
              @load="load"
              style="width: 100%"
              :class="`${$vuetify.display.smAndUp ? 'px-9' : 'px-3'}`"
            >
              <v-card
                class="mb-4"
                :style="`padding: ${
                  $vuetify.display.smAndUp ? '50' : '12'
                }px;border-radius:16px; border: ${
                  theme === 'dark'
                    ? '1px solid var(--dark-grey-border, #343A45)'
                    : '1px solid var(--stroke-light-mode, rgba(185, 184, 192, 0.20))'
                };background: ${
                  theme === 'dark'
                    ? 'var(--Corporate-blue, #111723)'
                    : 'var(--White, #FFF)'
                }`"
                elevation="2"
                v-for="feed in data.feedbacks.items"
                :key="feed._id"
                hover
              >
                <v-col cols="12" class="pa-2 ma-0">
                  <nuxt-link
                    class="no-underline"
                    :to="{
                      name: 'feedbacks-id',
                      params: { id: feed._id },
                    }"
                  >
                    <v-card-item class="pa-0 ma-0">
                      <v-row no-gutters class="pa-0 ma-0">
                        <v-col cols="2" class="px-2">
                          <v-img
                            :src="`/icons/resident/home/${
                              theme === 'dark' ? 'dark' : 'light'
                            }/feedbackFinal.svg`"
                            style="width: 50px; height: 50px"
                          ></v-img>
                        </v-col>
                        <v-col cols="10" class="d-flex justify-end">
                          <v-card-subtitle
                            :class="$vuetify.display.smAndUp ? 'mt-8' : 'mt-2'"
                            class="font-weight-medium"
                            style="font-size: 16px; line-height: 19px"
                          >
                            Created
                            {{ standardFormatDateTime(feed.createdAt) }}
                          </v-card-subtitle></v-col
                        >
                      </v-row>
                      <div>
                        <h6
                          class="pt-4 pl-1 font-weight-bold text-capitalize"
                          style="
                            font-size: 18px;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                            width: 280px;
                          "
                        >
                          {{ feed.subject }}
                        </h6>
                      </div>

                      <div class="pt-2">
                        <p
                          class="text-capitalize pl-1 textTruncate3lines text-justify text-6"
                          style="
                            font-size: 16px;
                            font-style: normal;
                            line-height: 17px;
                          "
                        >
                          {{ feed.description }}
                        </p>
                      </div>
                      <div class="pt-4">
                        <p
                          class="text-capitalize pl-1 text-body-2"
                          style="
                            font-size: 16px;
                            font-style: normal;
                            line-height: 19px;
                          "
                        >
                          {{ getFeedStatus(feed.status) }}
                        </p>
                      </div>

                      <v-row
                        no-gutters
                        class="pt-4"
                        v-if="
                          Array.isArray(feed?.workOrders) &&
                          feed.workOrders.length > 0
                        "
                      >
                        <v-col
                          cols="12"
                          class="d-flex justify-end"
                          align-self="end"
                        >
                          <v-chip variant="flat" color="blue">
                            <span
                              class="text-capitalize"
                              style="
                                text-shadow:
                                  0px 4px 10px rgba(0, 0, 0, 0.3),
                                  0px 16px 30px rgba(0, 0, 0, 0.9);
                                font-size: 16px;
                                font-style: normal;
                                font-weight: 300;
                                line-height: normal;
                              "
                            >
                              Work order #{{
                                Array.isArray(feed?.workOrders) &&
                                feed.workOrders.length > 0
                                  ? feed.workOrders[
                                      feed.workOrders.length - 1
                                    ]._id.slice(-6)
                                  : null
                              }}
                            </span>
                          </v-chip>
                        </v-col>
                      </v-row>
                      <v-row no-gutters class="pt-4">
                        <v-col
                          cols="12"
                          class="d-flex justify-end"
                          align-self="end"
                        >
                          <v-chip
                            variant="flat"
                            :color="feedBackStatus(feed.status, 'color')"
                          >
                            <span
                              style="
                                text-shadow:
                                  0px 4px 10px rgba(0, 0, 0, 0.3),
                                  0px 16px 30px rgba(0, 0, 0, 0.9);
                                font-size: 16px;
                                font-style: normal;
                                font-weight: 300;
                                line-height: normal;
                              "
                            >
                              {{ feedBackStatus(feed.status) }}
                            </span>
                          </v-chip>
                        </v-col>
                      </v-row>
                    </v-card-item>
                  </nuxt-link></v-col
                >
              </v-card>

              <template v-slot:load-more="{ props }">
                <v-row no-gutters class="align-center">
                  <v-btn
                    width="100%"
                    size="large"
                    color="#E0241C"
                    class="mt-4 my-button"
                    v-bind="props"
                    :disabled="!canNextPage"
                    @click="props.onClick"
                    v-if="canNextPage"
                  >
                    Load More
                  </v-btn>
                  <div class="w-100" v-else>
                    <p class="text-grey text-center">
                      No more feedbacks to load.
                    </p>
                  </div>
                </v-row>
              </template>
            </v-infinite-scroll>
          </v-col>
          <!-- if there are no feedbacks -->

          <v-col v-if="loadingTabPending" cols="12">
            <div v-for="i in 10" :key="i">
              <skeleton-loader-component
                :loading="loadingTabPending"
                transition="fade-transition"
              />
            </div>
          </v-col>
          <v-col
            v-else-if="!loading && !data.feedbacks.pages"
            cols="12"
            class="mt-10"
          >
            <v-row no-gutters justify="center">
              <v-card
                style="
                  width: 124px;
                  height: 124px;
                  padding: 8px;
                  border-radius: 80px;
                  border: 10px solid var(--icon-gradient, #b9b8c0);
                  box-shadow: 0px 10px 20px 0px rgba(201, 201, 201, 0.3);
                "
              >
                <v-img
                  :src="`/icons/resident/home/${
                    theme === 'dark' ? 'dark' : 'light'
                  }/create-feedback.svg`"
                  class="mt-3"
                ></v-img>
              </v-card>
            </v-row>
          </v-col>

          <v-col
            v-if="!loading && !data.feedbacks.pages"
            cols="12"
            :class="`text-center ${
              theme === 'dark'
                ? 'var(--White, #FFF)'
                : 'var(--Secondary-Dark, #0F131C)'
            } mt-0`"
          >
            No Pending feedbacks.
          </v-col>

          <v-col
            v-if="!loading && !data.feedbacks.pages"
            cols="12"
            class="text-center mt-4"
          >
            <v-btn
              @click="createFeedback"
              color="#eb261e"
              style="
                width: 260px;
                height: 52px;
                padding: 0px 16px;
                justify-content: center;
                align-items: center;
                background: var(--Primary, #eb261e);
                box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
              "
            >
              Create Feedback
            </v-btn>
          </v-col>
        </v-tabs-window-item>

        <v-tabs-window-item :value="2">
          <v-col v-if="loading || data.feedbacks.pages" cols="12">
            <div v-if="loading">
              <skeleton-loader-component
                :loading="loading"
                v-for="i in 10"
                :key="i"
                transition="fade-transition"
              />
            </div>
            <v-col v-else-if="loadingTabResolved" cols="12">
              <div v-for="i in 10" :key="i">
                <skeleton-loader-component
                  :loading="loadingTabResolved"
                  transition="fade-transition"
                />
              </div>
            </v-col>
            <v-infinite-scroll
              v-else-if="data.feedbacks.items"
              mode="manual"
              @load="load"
              style="width: 100%"
              :class="`${$vuetify.display.smAndUp ? 'px-9' : 'px-3'}`"
            >
              <v-card
                class="mb-4"
                :style="`padding: ${
                  $vuetify.display.smAndUp ? '50' : '12'
                }px;border-radius:16px; border: ${
                  theme === 'dark'
                    ? '1px solid var(--dark-grey-border, #343A45)'
                    : '1px solid var(--stroke-light-mode, rgba(185, 184, 192, 0.20))'
                };background: ${
                  theme === 'dark'
                    ? 'var(--Corporate-blue, #111723)'
                    : 'var(--White, #FFF)'
                }`"
                elevation="2"
                v-for="feed in data.feedbacks.items"
                :key="feed._id"
                hover
              >
                <v-col cols="12" class="pa-2 ma-0">
                  <nuxt-link
                    class="no-underline"
                    :to="{
                      name: 'feedbacks-id',
                      params: { id: feed._id },
                    }"
                  >
                    <v-card-item class="pa-0 ma-0">
                      <v-row no-gutters class="pa-0 ma-0">
                        <v-col cols="2" class="px-2">
                          <v-img
                            :src="`/icons/resident/home/${
                              theme === 'dark' ? 'dark' : 'light'
                            }/feedbackFinal.svg`"
                            style="width: 50px; height: 50px"
                          ></v-img>
                        </v-col>
                        <v-col cols="10" class="d-flex justify-end">
                          <v-card-subtitle
                            :class="$vuetify.display.smAndUp ? 'mt-8' : 'mt-2'"
                            class="font-weight-medium"
                            style="font-size: 15px; line-height: 19px"
                          >
                            Created
                            {{ standardFormatDateTime(feed.createdAt) }}
                          </v-card-subtitle>
                        </v-col>
                      </v-row>
                      <p
                        class="pt-4 font-weight-bold text-capitalize text-h6"
                        style="
                          font-size: 20px;
                          text-overflow: ellipsis;
                          overflow: hidden;
                          white-space: nowrap;
                        "
                      >
                        {{ feed.subject }}
                      </p>

                      <div class="pt-2">
                        <p
                          class="text-capitalize pl-1 textTruncate3lines text-justify text-6"
                          style="
                            font-size: 18px;
                            font-style: normal;
                            line-height: 19px;
                          "
                        >
                          {{ feed.description }}
                        </p>
                      </div>
                      <div class="pt-4">
                        <p
                          class="text-capitalize pl-1 text-body-2"
                          style="
                            font-size: 16px;
                            font-style: normal;
                            line-height: 19px;
                          "
                        >
                          {{ getFeedStatus(feed.status) }}
                        </p>
                      </div>
                      <!-- <span
                        style="
                          font-size: 16px;
                          font-style: normal;
                          font-weight: 400;
                          line-height: 19px;
                        "
                      >
                        {{ getFeedStatus(feed.status) }}
                      </span> -->

                      <v-row
                        no-gutters
                        class="pt-4"
                        v-if="
                          Array.isArray(feed?.workOrders) &&
                          feed.workOrders.length > 0
                        "
                      >
                        <v-col
                          cols="12"
                          class="d-flex justify-end"
                          align-self="end"
                        >
                          <v-chip variant="flat" color="blue">
                            <span
                              class="text-capitalize"
                              style="
                                text-shadow:
                                  0px 4px 10px rgba(0, 0, 0, 0.3),
                                  0px 16px 30px rgba(0, 0, 0, 0.9);
                                font-size: 16px;
                                font-style: normal;
                                font-weight: 300;
                                line-height: normal;
                              "
                            >
                              Work order #{{
                                Array.isArray(feed?.workOrders) &&
                                feed.workOrders.length > 0
                                  ? feed.workOrders[
                                      feed.workOrders.length - 1
                                    ]._id.slice(-6)
                                  : null
                              }}
                            </span>
                          </v-chip>
                        </v-col>
                      </v-row>

                      <v-row no-gutters class="pt-4">
                        <v-col
                          cols="12"
                          class="d-flex justify-end"
                          align-self="end"
                        >
                          <v-chip
                            variant="flat"
                            :color="feedBackStatus(feed.status, 'color')"
                          >
                            <span
                              class="text-capitalize"
                              style="
                                text-shadow:
                                  0px 4px 10px rgba(0, 0, 0, 0.3),
                                  0px 16px 30px rgba(0, 0, 0, 0.9);
                                font-size: 16px;
                                font-style: normal;
                                font-weight: 300;
                                line-height: normal;
                              "
                            >
                              {{ feedBackStatus(feed.status) }}
                              <template
                                v-if="
                                  /^(Completed|done|cancelled|resolved)$/i.test(
                                    feed.status,
                                  )
                                "
                              >
                                &nbsp;
                                {{ standardFormatDateTime(feed.updatedAt) }}
                              </template>
                            </span>
                          </v-chip>
                        </v-col>
                      </v-row>
                    </v-card-item>
                  </nuxt-link>
                </v-col>
              </v-card>
              <template v-slot:load-more="{ props }">
                <v-row no-gutters class="align-center">
                  <v-btn
                    width="100%"
                    size="large"
                    color="#E0241C"
                    class="mt-4 my-button"
                    v-bind="props"
                    :disabled="!canNextPage"
                    @click="props.onClick"
                    v-if="canNextPage"
                  >
                    Load More
                  </v-btn>
                  <div class="w-100" v-else>
                    <p class="text-grey text-center">
                      No more feedbacks to load.
                    </p>
                  </div>
                </v-row>
              </template>
            </v-infinite-scroll>
          </v-col>
          <!-- if there are no feedbacks -->

          <v-col v-if="loadingTabResolved" cols="12">
            <div v-for="i in 10" :key="i">
              <skeleton-loader-component
                :loading="loadingTabResolved"
                transition="fade-transition"
              />
            </div>
          </v-col>
          <v-col
            v-else-if="!loading && !data.feedbacks.pages"
            cols="12"
            class="mt-10"
          >
            <v-row no-gutters justify="center">
              <v-card
                style="
                  width: 124px;
                  height: 124px;
                  padding: 0px;
                  border-radius: 80px;
                  border: 10px solid var(--icon-gradient, #b9b8c0);
                  box-shadow: 0px 10px 20px 0px rgba(201, 201, 201, 0.3);
                "
              >
                <v-img
                  :src="`/icons/resident/home/${
                    theme === 'dark' ? 'dark' : 'light'
                  }/create-feedback.svg`"
                  style="width: 124px; height: 124px"
                  class="mt-3"
                ></v-img>
              </v-card>
            </v-row>
          </v-col>

          <v-col
            v-if="!loading && !data.feedbacks.pages"
            cols="12"
            :class="`text-center ${
              theme === 'dark'
                ? 'var(--White, #FFF)'
                : 'var(--Secondary-Dark, #0F131C)'
            } mt-0`"
          >
            No Resolved feedbacks .
          </v-col>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

const { theme } = useLocal();

const feedBackStatus = (status, returnArg) => {
  if (returnArg == "color") {
    if (status == "to-do") {
      return "#555E6F";
    } else if (status == "pending") {
      return "#FB8C00";
    } else {
      return "#4CAF50";
    }
  } else {
    if (/^(Completed|done|cancelled|resolved)$/i.test(status)) {
      return "Completed";
    } else if (/^(to-do|pending)$/i.test(status)) {
      return status.charAt(0).toUpperCase() + status.slice(1);
    } else {
      return "Done";
    }
  }
};

const { standardFormatDateTime } = useUtils();

const { tabsFeedbacks, getFeedbackByResidentId, setFeedback } = useFeedback();
const data = reactive({
  feedbacks: [],
});

const page = ref<number>(1);
const pages = ref<number>(0);
const canNextPage = computed(() => pages.value > page.value);
const status = computed(() =>
  tabsFeedbacks.value === 2 ? "resolved" : "pending",
);

const loading = ref(true);
const loadingTabPending = ref(false);
const loadingTabResolved = ref(false);

watch(status, (newStatus) => {
  getFeedback(newStatus);
});

async function getFeedback(status) {
  data.feedbacks = await getFeedbackByResidentId({
    tab: status,
    page: 1,
  });

  pages.value = data.feedbacks.pages;

  page.value = 1;
}

onMounted(async () => {
  data.feedbacks = await getFeedbackByResidentId({
    tab: status.value,
    page: 1,
  });

  pages.value = data.feedbacks.pages;

  setTimeout(() => {
    loading.value = false;
  }, 1000);
});

const loadTab = (tab) => {
  if (tab === 1) {
    loadingTabPending.value = true;
    setTimeout(() => {
      loadingTabPending.value = false;
    }, 1000);
  } else if (tab === 2) {
    loadingTabResolved.value = true;
    setTimeout(() => {
      loadingTabResolved.value = false;
    }, 1000);
  }
};

async function goBack() {
  await navigateTo("/resident");
}

const createFeedback = async () => {
  setFeedback();
  await navigateTo("/feedbacks/add");
};

function getFeedStatus(status) {
  if (status == "to-do") {
    return "The Management is discussing the matter.";
  } else if (status == "pending") {
    return "The Management has created a Work Order and the Service Provider is on the way.";
  } else if (status == "done") {
    return "Thank you for your feedback!";
  } else if (status == "Completed") {
    return "Thank you for your feedback!";
  } else if (status == "cancelled") {
    return "Your feedback was taken cared of.";
  } else {
    return "Thank you for your feedback.";
  }
}

function load({ done }) {
  setTimeout(async () => {
    page.value = page.value + 1;

    const _nextVisitors = await getFeedbackByResidentId({
      tab: status.value,
      page: page.value,
    });

    pages.value = _nextVisitors.pages;

    if (_nextVisitors.items.length) {
      _nextVisitors.items.forEach((item, index) => {
        data.feedbacks.items.push({
          ...item,
          index: data.feedbacks.items.length + index + 1,
        });
      });
    }
    done("ok");
  }, 1000);
}
</script>

<style scoped>
.chevron-icon {
  filter: drop-shadow(0px 4px 10px #d01b1b);
}
.go-back-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  margin-top: 3px;
}
.go-back-dark {
  color: #fcfcfc;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  margin-top: 3px;
}
.text {
  text-align: start;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}

.rows-per-page :deep() .v-field__outline {
  --v-field-border-width: 0;
  --v-field-border-opacity: 0;
  border-bottom: 0.1px solid;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  width: 50px;
  margin-left: 16px;
}

:deep() .v-field__field {
  font-size: 14px;
}

.header-text {
  color: #052439;
  font-feature-settings:
    "clig" off,
    "liga" off;

  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
}
:deep() .v-tabs .v-tab-text {
  color: #052439;
  text-align: center;
  font-feature-settings:
    "clig" off,
    "liga" off;

  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 36px;
}

.nofeedback-header {
  color: #052439;
  text-align: right;
  font-feature-settings:
    "clig" off,
    "liga" off;

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.nofeedback-text {
  color: var(--black-054, rgba(0, 0, 0, 0.54));
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}

.text-feedback {
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.chip-status {
  border-radius: 100px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
  background: var(--Light, #dfe2e9);
}

.dialog-text {
  color: #052439;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
}
.outer-card-dialog {
  border-radius: 6.118px;
}

.style-card {
  height: 100px;
  border-radius: 16px;
  border: 1px solid var(--stroke-light-mode, rgba(185, 184, 192, 0.2));
}

.dialog-text {
  color: #052439;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 36px; /* 257.143% */
}

.no-underline {
  text-decoration: none;
  color: inherit;
}

.my-button {
  background-color: #e0241c !important;
  color: #ffffff !important;
}

.textTruncate3lines {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  white-space: normal;
  word-break: break-all;
  hyphens: auto;
  -webkit-hyphens: auto;
}
</style>
