<template>
  <v-row no-gutters justify="space-between">
    <v-col cols="12" sm="5" class="px-5 pt-2">
      <v-row
        no-gutters
        class="d-flex fill-height align-center"
        align-content="center"
        justify-content="start"
      >
        <v-btn
          size="small"
          icon="mdi-chevron-left"
          flat
          @click="goBack()"
        ></v-btn>

        <span class="text-capitalize text-body-2 ml-2">
          <v-icon
            size="x-small"
            class="mx-1 pa-3"
            style="background: #1976d2; border-radius: 25px; color: #ffffff"
            >{{
              props.footerFor == "cctvBlock" ? "mdi-cctv" : "mdi-domain"
            }}</v-icon
          >
          {{
            props.footerFor == "cctvBlock"
              ? `${block.block} ${block.level}`
              : vPatrol.routeDetails.routeName
          }}
        </span>
      </v-row>
    </v-col>
    <v-col cols="12" sm="7">
      <v-row align="center">
        <v-col
          cols="12"
          md="3"
          :class="$vuetify.display.smAndDown && 'px-10 pt-8 pb-0'"
        >
          <v-select
            v-model="computedSelectedItem"
            :items="filterPageNumber"
            label="Max feeds per page"
            hide-details
            density="compact"
          ></v-select>
        </v-col>
        <v-col cols="12" md="5" offset-md="4">
          <v-pagination
            v-model="paginationModel"
            ellipsis="..."
            :length="props.footerFor == 'cctvBlock' ? pages : routeCCTVPages"
            :total-visible="
              $vuetify.display.mdAndDown
                ? 2
                : props.footerFor == 'cctvBlock'
                  ? pages
                  : routeCCTVPages
            "
          >
            <template v-slot:prev>
              <v-btn
                width="35"
                height="35"
                density="compact"
                size="x-small"
                icon="mdi-chevron-left"
                :disabled="
                  (props.footerFor == 'cctvBlock' ? page : routeCCTVPage) <= 1
                "
                @click="
                  setPage(
                    Number(
                      props.footerFor == 'cctvBlock' ? page : routeCCTVPage,
                    ) - 1,
                  )
                "
              ></v-btn>
            </template>

            <template v-slot:item="{ page: itemPage }">
              <v-btn
                v-if="itemPage != '...'"
                width="35"
                height="35"
                variant="text"
                density="compact"
                size="x-small"
                :active="isPageActive(Number(itemPage))"
                @click="setPage(Number(itemPage))"
                >{{ itemPage }}
              </v-btn>

              <v-btn
                v-else
                width="35"
                height="35"
                variant="text"
                density="compact"
                size="x-small"
                readonly
              >
                {{ itemPage }}
              </v-btn>
            </template>

            <template v-slot:next>
              <v-btn
                width="35"
                height="35"
                density="compact"
                size="x-small"
                icon="mdi-chevron-right"
                :disabled="
                  (props.footerFor == 'cctvBlock' ? page : routeCCTVPage) >=
                  (props.footerFor == 'cctvBlock' ? pages : routeCCTVPages)
                "
                @click="
                  setPage(
                    Number(
                      props.footerFor == 'cctvBlock' ? page : routeCCTVPage,
                    ) + 1,
                  )
                "
              ></v-btn>
            </template>
          </v-pagination>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure"],
});

const props = defineProps({
  footerFor: {
    type: String,
    required: true,
  },
});

const { drawer } = useDrawer();
const { getSitesOptionsForFiltering } = useFilter();
const {
  setBlockCctvs,

  getBlockInfo,
  pages,
  page,
  limit,
  selectedItem,
  filterPageNumber,
} = useCCTV();

const block = ref({
  _id: "",
  block: "",
  level: "",
});
const routeId = computed(() =>
  useRoute().params.routeId ? String(useRoute().params.routeId) : "",
);

const {
  vPatrol,
  getVPatrolById,
  setVPatrol,
  selectedCctv,
  routeCCTVPages,
  routeCCTVPage,
  routeSelectedItem,
  routeLimit
} = useVirtualPatrol();

onMounted(async () => {
  if (props.footerFor == "cctvBlock") {
    onPopulateCctvBlock();
  } else if (props.footerFor == "selectedRoute") {
    onPopulateSelectedRoute();
  }
});

async function onPopulateCctvBlock() {
  const cctvId = useRoute().params.id || "";

  page.value = 1;
  drawer.value = false;

  setBlockCctvs({ block: cctvId }).then((res: any) => {
    console.log("!", JSON.stringify(res));
  });

  const [resBlock] = await Promise.all([
    await getBlockInfo({ block: cctvId }),
    setBlockCctvs({ block: cctvId }),
    getSitesOptionsForFiltering(),
  ]);
  block.value = resBlock as { _id: string; block: string; level: string };
}

async function onPopulateSelectedRoute() {
  routeCCTVPage.value = 1;
  drawer.value = false;

  const [result] = await Promise.all([
    getVPatrolById(routeId.value, routeCCTVPage.value, limit.value),
    getSitesOptionsForFiltering(),
  ]);
  setVPatrol(result as TVirtualPatrol | undefined);
}

async function setPage(pageNumber: number) {
  if (props.footerFor == "cctvBlock") {
    page.value = pageNumber;
    setBlockCctvs({ block: block.value._id });
  } else if (props.footerFor == "selectedRoute") {
    routeCCTVPage.value = pageNumber;
    const [result] = await Promise.all([
      getVPatrolById(routeId.value, routeCCTVPage.value, limit.value),
      getSitesOptionsForFiltering(),
    ]);
    setVPatrol(result as TVirtualPatrol | undefined);
  }
}

function isPageActive(itemPage: number) {
  return itemPage === paginationModel.value;
}

const paginationModel = computed({
  get() {
    return props.footerFor === "cctvBlock" ? page.value : routeCCTVPage.value;
  },
  set(value) {
    if (props.footerFor === "cctvBlock") {
      page.value = value;
    } else {
      routeCCTVPage.value = value;
    }
  },
});

const computedSelectedItem = computed({
  get() {
    return props.footerFor === 'cctvBlock' ? selectedItem.value : routeSelectedItem.value;
  },
  set(value) {
    if (props.footerFor === 'cctvBlock') {
      selectedItem.value = value;
    } else {
      routeSelectedItem.value = value;
    }
  }
});

async function goBack() {
  page.value = 1;
  routeCCTVPage.value = 1;

  useRouter().push({
    name: `${props.footerFor == "cctvBlock" ? "cctv" : "routes"}`,
  });

  if (props.footerFor == "cctvBlock") drawer.value = true;
  if (props.footerFor == "selectedRoute") drawer.value = true;
}
</script>

<style scoped>
:deep() .v-pagination__list {
  justify-content: end;
  padding: 5px 24px 0 0;
}
</style>
