<template>
  <v-row no-gutter class="fill-height pa-4" justify="center">
    <v-col cols="12" style="min-height: 80vh">
      <v-row class="fill-height" justify="center">
        <v-col
          v-for="(item, itemIndex) in availableCctvs"
          :key="itemIndex"
          :cols="$vuetify.display.lgAndUp ? columnsPerCCTVfeedItem :  $vuetify.display.md ? columnsPerCCTVfeedItemMd :  12"
          style="position: relative"
        >
        
          <v-skeleton-loader
            v-show="!cctvLoadingState[itemIndex]"
            :style="{
              width: '100%',
              height: '100%',
            }"
            class="cctv-iframe"
          ></v-skeleton-loader>

          <iframe
            v-show="cctvLoadingState[itemIndex]"
            :src="item.ip"
            :style="{
              backgroundColor: !item && '#000000',
              pointerEvents: 'unset !important',
            }"
            class="cctv-iframe"
            @load="iframeLoaded(itemIndex)"
          />

          <v-chip
            v-if="item"
            :to="{
              name: 'cctv-id-cctvblock-cctvid',
              params: { cctvid: item._id },
              query: {
                site: mySite,
              },
            }"
            variant="elevated"
            :style="{
              width: 'auto',
              height: '20px',
              position: 'absolute',
              bottom: '27px',
              right: '30px',
              color: '#000',
              background: '#fff',
              fontSize: '10px',
            }"
          >
            {{ item.name }}
          </v-chip>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <Footer :footerFor="'cctvBlock'"></Footer>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure"],
});

const {
  setBlockCctvs,
  blockCctvs,
  getBlockInfo,
  page,
  limit,
  selectedItem,
  isCctvsLoaded,
} = useCCTV();
const { drawer } = useDrawer();
const { getSitesOptionsForFiltering, mySite } = useFilter();
const route = useRoute();

const _id = computed(() => (route.params.id ? String(route.params.id) : ""));

const block = ref({
  _id: "",
  block: "",
  level: "",
});

const cctvLengths = computed(() => {
  return availableCctvs.value.length;
});

const columnsPerCCTVfeedItem = computed(() => {
  const len = cctvLengths.value;
  const lim = limit.value;

  if (len === 1 || (lim === 1 && len <= 1)) return 12;
  if (len <= 4 || (lim <= 4 && len <= lim)) return 6;
  if (len <= 6 || (lim <= 6 && len <= lim)) return 4;
  if (len === 9 || (lim === 9 && len <= lim)) return 4;
  if (len <= 12 || (lim <= 12 && len <= lim)) return 3;

  return 3;
});

const columnsPerCCTVfeedItemMd = computed(() => {
  const len = cctvLengths.value;
  const lim = limit.value;

  if (len === 1 || (lim === 1 && len <= 1)) return 12;
  if (len <= 4 || (lim <= 4 && len <= lim)) return 6;
  if (len <= 6 || (lim <= 6 && len <= lim)) return 6;
  if (len === 9 || (lim === 9 && len <= lim)) return 6;
  if (len <= 12 || (lim <= 12 && len <= lim)) return 6;

  return 6;
});


const availableCctvs = computed(() => {
  return blockCctvs.value.filter((cctv) => cctv && cctv.ip);
});

const cctvLoadingState = ref<boolean[]>([]);

const iframeLoaded = (index: number) => {
  setTimeout(() => {
    cctvLoadingState.value[index] = true;
  }, 3000);
};

watch(
  availableCctvs,
  (newCctvs, oldCctvs) => {
    newCctvs = newCctvs || [];
    oldCctvs = oldCctvs || [];
    newCctvs.forEach((cctv, index) => {
      if (oldCctvs[index] && cctv.ip === oldCctvs[index].ip) {
        cctvLoadingState.value[index] = cctvLoadingState.value[index] || false;
      } else {
        cctvLoadingState.value[index] = false;
      }
    });

    if (newCctvs.length < oldCctvs.length) {
      cctvLoadingState.value.splice(newCctvs.length);
    }
  },
  { immediate: true, deep: true }
);

const totalPages = computed(() => {
  return Math.ceil(availableCctvs.value.length / limit.value);
});

watch(
  selectedItem,
  (newValue: number) => {
    limit.value = newValue;
    if (page.value > totalPages.value) {
      page.value = totalPages.value;
    }
    setBlockCctvs({ block: block.value._id });
  },

  { deep: true },
);

onMounted(async () => {
  drawer.value = false;
  page.value = 1;
  const [resBlock] = await Promise.all([
    await getBlockInfo({
      block: _id.value,
    }),
    setBlockCctvs({ block: _id.value }),
    getSitesOptionsForFiltering(),
  ]);
  block.value = resBlock as { _id: string; block: string; level: string };
});
</script>

<style scoped>
.cctv-iframe {
  width: 100%;
  height: 100%;

  @media (max-width: 575.98px) {
    height: 20vh;
  }
  @media (min-width: 576px) and (max-width: 959px) {
    height: 30vh;
  }
  @media (min-width: 960px){
    height: 100%;
  }
}
</style>
