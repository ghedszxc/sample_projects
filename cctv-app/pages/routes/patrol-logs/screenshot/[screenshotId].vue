<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="isScreenshotLoading"
      >
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-row no-gutters>
          <v-col cols="12" class="pa-10 d-flex flex-column align-center">
            <template v-if="imageBase64String">
              <div id="screenshot_image_vpatrol">
                <img class="mx-auto" width="500px" :src="imageBase64String" />
              </div>
              <v-btn @click="printImage()">Print/Download</v-btn>
            </template>

            <v-progress-circular
              v-else
              color="primary"
              indeterminate
            ></v-progress-circular>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});
const { $ability } = useNuxtApp();
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const {
  getInitial,
  materialColors,
  formatScheduleDays,
  standardFormatDateTime,
} = useUtils();
const { setOrganizations, organizations } = useOrganization();
const { sites, setSites } = useSite();
const { isScreenshotLoading, getVPatrolScreenshot } = useVirtualPatrol();
const {
  getSitesOptionsForFiltering,
  siteOptions,
  mySite,
  filterSite,
  filterOrganization,
} = useFilter();

const imageBase64String = ref<null | string>(null);

const screenshotId = computed(() =>
  useRoute().params.screenshotId ? String(useRoute().params.screenshotId) : "",
);

function printImage() {
  const divContent =
    document.getElementById("screenshot_image_vpatrol")?.innerHTML || "";

  const printWindow: any = window.open();

  printWindow.document.write(`
    <html>
      <head>
        <title>Virtual Patrol</title>
        <style>
          @media print {
            @page {
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
            }
            img {
              max-width: 100%;
              height: auto;
            }
          }
        </style>
      </head>
      <body>
        ${divContent}
      </body>
    </html>`);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

watch(
  filterOrganization,
  (newValue) => {
    setSites(newValue);
  },
  { deep: true },
);

onMounted(async () => {
  isScreenshotLoading.value = true;
  //   await getSitesOpt();
  //   // await Promise.all([
  //   //   setVPatrols({
  //   //     site: mySite.value,
  //   //   }),
  //   //   setOrganizations(),
  //   // ]);

  const result: any = await getVPatrolScreenshot(screenshotId.value);
  imageBase64String.value = `data:image/jpeg;base64,${result.data}`;
  isScreenshotLoading.value = false;
});

onUnmounted(() => {
  filterSite.value = "";
  siteOptions.value = [];
});
</script>

<style scoped>
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

:deep() .v-text-field input {
  font-size: 13px !important;
}
</style>
