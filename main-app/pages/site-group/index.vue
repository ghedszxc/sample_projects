<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <g-card :loading="isTableLoadingSpGroup">
        <v-row no-gutters>
          <v-col cols="12">
            <v-data-iterator :items="spsGroup" :items-per-page="itemsPerPage">
              <template v-slot:header>
                <v-row
                  no-gutters
                  class="pa-4"
                  justify="space-between"
                  align="center"
                >
                  <v-col cols="12" lg="1" class="mb-2 mb-lg-0">
                    <v-row align="center">
                      <v-col cols="12">
                        <span class="font-weight-bold text-h6"> Groups </span>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="12" sm="7" lg="9" class="mb-2 mb-sm-0">
                    <v-row no-gutters>
                      <v-col cols="12" sm="11" lg="4">
                        <search-text-field
                          @on-search="onSearch($event)"
                          @clear-search="callItBack"
                        ></search-text-field>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="5"
                    lg="2"
                    v-if="$ability.can('create', 'create-site-groups')"
                  >
                    <v-btn
                      color="blue-darken-3"
                      block
                      variant="flat"
                      style="height: 40px"
                      @click="isConfirmModal = true"
                    >
                      Create Group
                    </v-btn>
                  </v-col>
                </v-row>

                <v-divider />

                <v-list density="compact" v-if="$vuetify.display.smAndUp">
                  <v-list-item class="">
                    <v-list-item-title>
                      <v-row no-gutters class="pb-lg-2 text-body-2 px-lg-2">
                        <v-col
                          v-for="(col, idx) in columnHeader"
                          :key="idx"
                          cols="12"
                          :sm="col.sm"
                          :md="col.md"
                          :lg="col.lg"
                          class="text-capitalize white--text text"
                        >
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-truncate text-capitalize font-weight-bold"
                            >
                              {{ col.title }}
                            </span>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-list-item-title>
                  </v-list-item>
                  <v-divider v-if="$vuetify.display.lgAndUp" />
                </v-list>
              </template>

              <template #default="{ items }">
                <v-list class="pa-0">
                  <template
                    v-for="(item, itemIndex) in items"
                    :key="item.raw._id"
                  >
                    <v-list-item
                      :class="
                        $vuetify.display.smAndDown || $vuetify.display.md
                          ? 'py-2 border-md px-4 px-sm-2 rounded-lg mb-2 mx-2 my-2'
                          : 'py-1 px-2 px-lg-4 mx-2 my-0 text-body-2'
                      "
                    >
                      <v-list-item-title>
                        <v-row no-gutters align="center">
                          <v-col
                            cols="12"
                            sm="4"
                            lg="4"
                            class="text text-capitalize mb-2 mb-sm-0"
                          >
                            <v-row
                              no-gutters
                              class="fill-height text-truncate"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.smAndDown
                                  ? 'space-between'
                                  : 'start'
                              "
                            >
                              <span
                                class="mr-2 d-flex d-sm-none font-weight-bold"
                                >Group Name:
                              </span>
                              <span
                                :style="
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                                :class="
                                  $vuetify.display.smAndUp ? 'text-body-2' : ''
                                "
                              >
                                <v-icon class="ml-1 mr-1 mr-md-2 mb-1 mb-md-0">
                                  mdi-account-multiple-outline
                                </v-icon>
                                {{ item.raw.groupName }}
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="4"
                            lg="2"
                            class="text text-capitalize mb-2 mb-sm-0"
                          >
                            <v-row
                              no-gutters
                              class="fill-height text-truncate"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.smAndDown
                                  ? 'space-between'
                                  : 'start'
                              "
                            >
                              <span
                                class="mr-2 d-flex d-sm-none font-weight-bold"
                                >Members:
                              </span>
                              <span
                                :style="
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                                :class="
                                  $vuetify.display.smAndUp ? 'text-body-2' : ''
                                "
                              >
                                <v-icon
                                  class="ml-1 mr-1 mr-md-3 mb-1"
                                  color="red"
                                >
                                  mdi-account-group
                                </v-icon>
                                {{ item.raw.members }}
                              </span>

                              <span
                                :style="
                                  $vuetify.display.smAndDown
                                    ? 'font-size: .8rem;'
                                    : ''
                                "
                                class="w-100"
                                v-if="
                                  $vuetify.display.sm || $vuetify.display.md
                                "
                              >
                                <span
                                  v-if="
                                    item.raw.site &&
                                    Boolean(item.raw.site) &&
                                    typeof item.raw.site === 'object' &&
                                    Object.keys(item.raw.site).length > 0
                                  "
                                >
                                  <v-icon class="ml-1 mr-1 mr-md-2 mb-1 mb-md-0"
                                    >mdi-office-building-marker</v-icon
                                  >
                                  {{ item.raw.site.name }}
                                </span>
                                <span v-else
                                  ><v-icon
                                    class="ml-1 mr-1 mr-md-2 mb-1 mb-md-0"
                                    >mdi-office-building-marker</v-icon
                                  >N/A</span
                                >
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="2"
                            lg="3"
                            class="text text-capitalize mb-2 mb-sm-0"
                            v-if="
                              $vuetify.display.lgAndUp || $vuetify.display.xs
                            "
                          >
                            <v-row
                              no-gutters
                              class="fill-height text-truncate"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.smAndDown
                                  ? 'space-between'
                                  : 'start'
                              "
                            >
                              <span
                                class="mr-2 d-flex d-sm-none font-weight-bold"
                                >Site:
                              </span>
                              <span
                                :style="
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                                :class="
                                  $vuetify.display.smAndUp ? 'text-body-2' : ''
                                "
                              >
                                <span
                                  v-if="
                                    item.raw.site &&
                                    Boolean(item.raw.site) &&
                                    typeof item.raw.site === 'object' &&
                                    Object.keys(item.raw.site).length > 0
                                  "
                                >
                                  <v-icon class="ml-1 mr-1 mr-md-2 mb-1 mb-md-0"
                                    >mdi-office-building-marker</v-icon
                                  >
                                  {{ item.raw.site.name }}
                                </span>
                                <span v-else
                                  ><v-icon
                                    class="ml-1 mr-1 mr-md-3 mb-1 mb-md-0"
                                    >mdi-office-building-marker</v-icon
                                  >N/A</span
                                >
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="3"
                            lg="2"
                            class="text text-capitalize mb-2 mb-sm-0"
                          >
                            <v-row
                              no-gutters
                              class="fill-height text-truncate"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.smAndDown
                                  ? 'space-between'
                                  : 'start'
                              "
                            >
                              <span
                                class="mr-2 d-flex d-sm-none font-weight-bold"
                                >Status:
                              </span>
                              <span
                                :style="
                                  $vuetify.display.smAndDown
                                    ? 'font-size: .8rem;'
                                    : ''
                                "
                              >
                                <v-chip
                                  v-if="item.raw.status"
                                  class="text-capitalize"
                                  :color="
                                    item.raw.status === 'available'
                                      ? 'green'
                                      : 'blue'
                                  "
                                >
                                  {{ item.raw.status }}
                                </v-chip>
                              </span>
                            </v-row>
                          </v-col>

                          <v-col cols="12" sm="1" class="text text-capitalize">
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                              justify="end"
                            >
                              <v-menu>
                                <template v-slot:activator="{ props }">
                                  <v-icon
                                    density="compact"
                                    v-bind="props"
                                    class="rounded-xl border-md pa-4"
                                    >mdi-dots-vertical</v-icon
                                  >
                                </template>
                                <v-list class="py-0">
                                  <template v-if="item.raw.status">
                                    <v-list-item
                                      v-if="
                                        $ability.can('read', 'view-site-groups')
                                      "
                                      :to="{
                                        name: 'site-group-group',
                                        params: {
                                          group: item.raw._id,
                                        },
                                      }"
                                    >
                                      <template #title>
                                        <span class="text-caption"> View </span>
                                      </template>
                                    </v-list-item>
                                    <v-divider></v-divider>
                                    <v-list-item
                                      v-if="
                                        item.raw.status != 'available' &&
                                        $ability.can(
                                          'update',
                                          'edit-site-groups',
                                        )
                                      "
                                      @click="disconnectTeam(item.raw)"
                                    >
                                      <template #title>
                                        <span class="text-caption">
                                          Disconnect
                                        </span>
                                      </template>
                                    </v-list-item>
                                  </template>
                                </v-list>
                              </v-menu>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider
                      v-if="
                        itemIndex + 1 !== items.length &&
                        $vuetify.display.lgAndUp
                      "
                    ></v-divider>
                  </template>
                </v-list>
              </template>

              <template #no-data>
                <v-row no-gutters justify="center" class="pa-16">
                  <v-col cols="12">
                    <v-row no-gutters justify="center">
                      <v-img
                        src="/empty.svg"
                        width="100px"
                        height="100px"
                      ></v-img>
                    </v-row>
                  </v-col>

                  <v-col cols="12">
                    <v-row no-gutters justify="center">
                      <span class="font-weight-bold">
                        You don't have groups yet.
                      </span>
                    </v-row>
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>
          </v-col>
        </v-row>

        <v-divider></v-divider>
        <v-row class="my-1">
          <v-col cols="12" class="pa-4">
            <!-- footer page of v-data-iteration -->
            <FooterPagination
              @next-page="_nextPage()"
              @prev-page="_prevPage()"
              :pageRange="pageRange"
              :page="page"
              :pages="pages"
            />
          </v-col>
        </v-row>
      </g-card>

      <SpgroupAdd
        :isConfirmModal="isConfirmModal"
        @close-modal="isConfirmModal = false"
        @submit="submit($event)"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const { $ability } = useNuxtApp();
const { setSnackbar } = useLocal();
const { currentUser } = useLocalAuth();

const {
  spsGroup,
  searchSpGroup,
  page,
  pages,
  itemsPerPage,
  pageRange,
  isTableLoadingSpGroup,
  nextPage,
  prevPage,
  setSPGroup,
  setSpsGroup,
  createSPGroup,
  disconnectSiteToGroup,
  getSPGroupById,
} = useSPGroup();
const { disconnectGroupToSite } = useSiteCollab();

const isConfirmModal = ref(false);

const isLgAndUp = ref(window.innerWidth >= 1280);

window.addEventListener("resize", () => {
  isLgAndUp.value = window.innerWidth >= 1280;
});
const columnHeader = computed(() => {
  const baseHeaders = [
    {
      sm: "4",
      md: "4",
      lg: "4",
      title: "Group Name",
      align: "left",
      visible: true,
    },
    {
      sm: "4",
      md: "4",
      lg: "2",
      title: "Members / Site",
      align: "left",
      visible: true,
    },
    {
      sm: "3",
      title: "Status",
      align: "left",
      visible: true,
    },
  ];
  if (isLgAndUp.value) {
    baseHeaders[1].title = "Members";
    baseHeaders.splice(2, 0, {
      sm: "3",
      md: "3",
      lg: "3",
      title: "Assigned Site",
      align: "left",
      visible: true,
    });
  }

  return baseHeaders;
}) as unknown as {
  sm: string;
  md: string;
  lg: string;
  title: string;
  align: string;
  visible: any;
}[];

const serviceProvider = computed(() =>
  currentUser.value.serviceProvider &&
  Boolean(currentUser.value.serviceProvider) &&
  typeof currentUser.value.serviceProvider === "object" &&
  Object.keys(currentUser.value.serviceProvider).length > 0
    ? currentUser.value.serviceProvider._id
    : currentUser.value.serviceProvider,
).value;

onMounted(async () => {
  setSPGroup();
  await getAllSiteGroups();
});

async function getAllSiteGroups() {
  await setSpsGroup({
    serviceProvider: String(serviceProvider),
  });
}

async function submit(data: TSPGroup) {
  try {
    const response = await createSPGroup({
      ...data,
      serviceProvider: currentUser.value.serviceProvider,
    });
    isConfirmModal.value = false;
    setSnackbar({
      text: response.message,
      modal: response.data.acknowledged,
      type: "success",
    });
  } catch (error: any) {
    setSnackbar({ text: error || error.message, modal: true, type: "error" });
  } finally {
    await getAllSiteGroups();
    setSPGroup();
  }
}

const onSearch = async (search: string) => {
  searchSpGroup.value = search;
  getAllSiteGroups();
};

const callItBack = async () => {
  getAllSiteGroups();
};

const _nextPage = async () => {
  nextPage({ serviceProvider: String(serviceProvider) });
};

const _prevPage = async () => {
  prevPage({ serviceProvider: String(serviceProvider) });
};

async function disconnectTeam(value: TSPGroup) {
  const id = value._id || "";
  try {
    const response = await getSPGroupById(id);
    const siteCollabId =
      response && response.siteCollab && response.siteCollab._id;
    await Promise.all([
      // group
      disconnectSiteToGroup(id, {
        status: "available",
      }),
      // site collab
      disconnectGroupToSite(siteCollabId || "", id),
    ]);
    setSnackbar({
      text: "Successfully disconnected!",
      modal: true,
      type: "success",
    });
  } catch (error: any) {
    setSnackbar({ text: error || error.message, modal: true, type: "error" });
  } finally {
    await getAllSiteGroups();
  }
}
</script>
