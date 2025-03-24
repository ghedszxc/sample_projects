<template>
  <v-row no-gutter class="fill-height pa-4" justify="center">
    <v-col cols="12" style="min-height: 80vh" v-if="availableCctvs.length">
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
            :src="vPatrol.items[itemIndex]?.ip"
            :style="{
              backgroundColor: !item && '#000000',
              pointerEvents: 'unset !important',
            }"
            class="cctv-iframe"
            @load="iframeLoaded(itemIndex)"
          />

          <v-chip
            variant="elevated"
            v-if="vPatrol.items[itemIndex]?.ip"
            :style="{
              width: 'auto',
              height: '20px',
              position: 'absolute',
              bottom: '27px',
              right: vPatrol.items[itemIndex]?.name ? '65px' : '30px',
              color: '#000',
              background: '#fff',
              fontSize: '10px',
            }"
          >
            {{
              vPatrol.items[itemIndex]
                ? vPatrol.items[itemIndex]?.name
                  ? vPatrol.items[itemIndex]?.name
                  : `Cam ${page === 1 ? itemIndex + 1 : (page - 1) * limit + (itemIndex + 1)}`
                : "No Cam"
            }}
          </v-chip>

          <v-btn
            v-if="vPatrol.items[itemIndex]?.name"
            size="x-small"
            icon="mdi-eye"
            color="primary"
            style="position: absolute; bottom: 22px; right: 30px"
            @click="onSelectCctv(vPatrol.items[itemIndex])"
          ></v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" v-if="vPatrol?.routeDetails">
      <Footer :footerFor="'selectedRoute'"></Footer>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure"],
});

const {
  vPatrol,
  getVPatrolById,
  setVPatrol,
  selectedCctv,
  routeCCTVPage,
  routeSelectedItem,
  routeLimit,
} = useVirtualPatrol();
const { getSitesOptionsForFiltering, mySite } = useFilter();

const routeId = computed(() =>
  useRoute().params.routeId ? String(useRoute().params.routeId) : "",
);

const { drawer } = useDrawer();

const availableCctvs = computed(() => {
  if (vPatrol.value && vPatrol.value.items) {
    return vPatrol.value.items.filter((item: any) => item.isActive);
  }
  return [];
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
  { immediate: true, deep: true },
);

const totalPages = computed(() => {
  return Math.ceil(availableCctvs.value.length / routeLimit.value);
});

const cctvLengths = computed(() => {
  return availableCctvs.value.length;
});

const columnsPerCCTVfeedItem = computed(() => {
  const len = cctvLengths.value;
  const lim = routeLimit.value;

  if (len === 1 || (lim === 1 && len <= 1)) return 12;
  if (len <= 4 || (lim <= 4 && len <= lim)) return 6;
  if (len <= 6 || (lim <= 6 && len <= lim)) return 4;
  if (len === 9 || (lim === 9 && len <= lim)) return 4;
  if (len <= 12 || (lim <= 12 && len <= lim)) return 3;

  return 3;
});

const columnsPerCCTVfeedItemMd = computed(() => {
  const len = cctvLengths.value;
  const lim = routeLimit.value;

  if (len === 1 || (lim === 1 && len <= 1)) return 12;
  if (len <= 4 || (lim <= 4 && len <= lim)) return 6;
  if (len <= 6 || (lim <= 6 && len <= lim)) return 6;
  if (len === 9 || (lim === 9 && len <= lim)) return 6;
  if (len <= 12 || (lim <= 12 && len <= lim)) return 6;

  return 6;
});

watch(
  routeSelectedItem,
  (newValue: number) => {
    routeLimit.value = newValue;
    if (routeCCTVPage.value > totalPages.value) {
      routeCCTVPage.value = totalPages.value;
    }
    fetchPatrolData();
  },
  { deep: true },
);

async function fetchPatrolData() {
  try {
    const [result] = await Promise.all([
      getVPatrolById(routeId.value, routeCCTVPage.value, routeLimit.value),
      getSitesOptionsForFiltering(),
    ]);
    setVPatrol(result as TVirtualPatrol | undefined);
  } catch (error) {
    console.error("Error fetching patrol data:", error);
  }
}

onMounted(async () => {
  drawer.value = false;
  routeCCTVPage.value = 1;
  await fetchPatrolData();
});

async function onSelectCctv(cctv: any) {
  selectedCctv.value = cctv;
  useRouter().push({
    name: "routes-routeId-cctv-cctvId",
    params: {
      routeId: routeId.value,
      cctvId: cctv._id,
    },
    query: {
      site: mySite.value,
    },
  });
}
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
