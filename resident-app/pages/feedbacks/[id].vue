<template>
  <v-row no-gutters>
    <!-- go back -->
    <v-col
      :cols="$vuetify.display.smAndDown ? '5' : '6'"
      :class="`mt-8 ${$vuetify.display.smAndUp ? 'px-12' : 'px-3'}`"
      @click="goBack()"
    >
      <v-icon start size="x-large" style="position: relative; left: 5px">
        <v-img
          class="pl-0 ml-0"
          src="/dark-mode/utility-all/right-arrow.svg"
          cover
        ></v-img>
      </v-icon>
      <span
        style="position: relative; right: 5px; color: baseColor; bottom: 3px"
      >
        Feedbacks
      </span>
    </v-col>

    <!-- feedback -->
    <v-col cols="12" class="pa-6">
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
        hover
      >
        <v-card-item>
          <v-row no-gutters>
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
                {{ standardFormatDateTime(feedback.createdAt) }}
              </v-card-subtitle>
            </v-col>
          </v-row>

          <p
            class="pt-4 text-feedback text-capitalize fsheader2 font-weight-bold"
          >
            {{ feedback.subject }}
          </p>
          <div class="pb-4 pt-1">
            <span
              class="text-feedback text-capitalize fsheader3"
              style="font-style: normal; font-weight: 400; line-height: 19px"
              >{{ feedback.location }}
            </span>
          </div>
          <span class="text-capitalize content-style" style="font-size: 16px"
            >{{ feedback.description }}
          </span>

          <v-row no-gutters class="pt-4">
            <!-- images -->
            <v-col
              cols="12"
              v-if="isFetchingImages"
              class="pt-8 text-center text-disabled"
            >
              Loading images...
            </v-col>
            <v-col
              cols="12"
              v-else-if="!isFetchingImages && feedback.attachments.length > 0"
            >
              <v-carousel
                color="#052439"
                height="300"
                width="150"
                hide-delimiter-background
                hide-delimiters
                continuous
                cycle
                touch
                show-arrows
              >
                <template v-slot:prev="{ props }">
                  <v-btn
                    variant="flat"
                    size="small"
                    color="#EB261E"
                    icon="mdi-chevron-left"
                    @click="props.onClick"
                  >
                  </v-btn>
                </template>
                <template v-slot:next="{ props }">
                  <v-btn
                    variant="flat"
                    size="small"
                    color="#EB261E"
                    icon="mdi-chevron-right"
                    @click="props.onClick"
                  >
                  </v-btn>
                </template>
                <v-carousel-item
                  v-for="(image, index) in feedback.attachments"
                  :key="index"
                >
                  <NuxtLink
                    class="no-underline"
                    :to="`/api/files/${image}`"
                    target="_blank"
                  >
                    <v-card
                      variant="flat"
                      height="100%"
                      width="100%"
                      style="align-content: center; justify-content: center"
                    >
                      <v-img
                        :src="`/api/files/${image}`"
                        max-width="100%"
                        contain
                      >
                        <template v-slot:placeholder>
                          <div
                            class="d-flex align-center justify-center fill-height"
                          >
                            <v-progress-circular
                              color="grey-lighten-4"
                              indeterminate
                            ></v-progress-circular>
                          </div>
                        </template>
                      </v-img>
                    </v-card>
                  </NuxtLink>
                </v-carousel-item>
              </v-carousel>
            </v-col>
            <v-col cols="12" v-else class="pt-8 text-center text-disabled">
              No images
            </v-col>
            <v-row no-gutters class="pt-4" v-if="feedback.workOrder">
              <v-col cols="12" class="d-flex justify-end" align-self="end">
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
                      Array.isArray(feedback?.workOrder) &&
                      feedback.workOrder.length
                        ? feedback.workOrder[
                            feedback.workOrder.length - 1
                          ].slice(-6)
                        : null
                    }}
                  </span>
                </v-chip>
              </v-col>
            </v-row>
            <v-col cols="12" class="d-flex justify-end pt-4" align-self="end">
              <v-chip
                variant="flat"
                :color="feedBackStatus(feedback.status, 'color')"
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
                  {{ feedBackStatus(feedback.status) }}
                  <template
                    v-if="
                      /^(Completed|done|cancelled|resolved)$/i.test(
                        feedback.status,
                      )
                    "
                  >
                    &nbsp; {{ standardFormatDateTime(feedback.updatedAt) }}
                  </template>
                </span>
              </v-chip>
            </v-col>
          </v-row>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

const { theme } = useLocal();
const isFetchingImages = ref(false);
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
    if (/^(Completed|done|cancelled)$/i.test(status)) {
      return "Completed";
    } else if (/^(to-do|pending)$/i.test(status)) {
      return status.charAt(0).toUpperCase() + status.slice(1);
    } else {
      return "Done";
    }
  }
};

const { standardFormatDateTime } = useUtils();

const { getFeedbackById, feedback } = useFeedback();

const id = computed(() => useRoute().params.id as string);

onMounted(async () => {
  const feedbackData = await getFeedbackById(id.value);

  feedback.value = feedbackData;
  isFetchingImages.value = true;

  isFetchingImages.value = false;
});

async function goBack() {
  await navigateTo("/feedbacks");
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
  font-family: Roboto;
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
  font-family: Roboto;
  font-size: 16px;
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
  font-family: Roboto;
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
  background: var(--Grey-sub-text, #555e6f);
}

.content-style {
  word-break: break-all;
  hyphens: auto;
  -webkit-hyphens: auto;

  font-style: normal;
  font-weight: 300;
  line-height: 24px;
}
</style>
