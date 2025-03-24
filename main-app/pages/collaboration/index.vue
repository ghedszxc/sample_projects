<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <g-card :loading="isTableLoadingSiteCollab">
        <v-row no-gutters>
          <v-col cols="12">
            <v-data-iterator
              :items="sitesCollab"
              :items-per-page="itemsPerPage"
            >
              <template v-slot:header>
                <v-row no-gutters class="pa-4" justify="space-between">
                  <v-col cols="12" md="4" class="mb-2">
                    <v-row no-gutters>
                      <v-col cols="12">
                        <span class="font-weight-bold text-h6">
                          Site Invitations
                        </span>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="12" md="8">
                    <v-row align="center" justify="end">
                      <v-col cols="12" md="8" lg="5">
                        <search-text-field
                          @on-search="onSearch($event)"
                          @clear-search="callItBack"
                        ></search-text-field>
                      </v-col>
                    </v-row>
                    <v-spacer></v-spacer>
                  </v-col>
                </v-row>

                <v-divider />

                <v-list density="compact" v-if="$vuetify.display.smAndUp">
                  <v-list-item>
                    <v-list-item-title>
                      <v-row
                        no-gutters
                        class="pb-lg-2 text-body-2 px-lg-2 px-2"
                      >
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
                    <v-list-item>
                      <v-list-item-title
                        :class="
                          $vuetify.display.smAndDown || $vuetify.display.md
                            ? 'py-2 border-md px-2 rounded-lg mb-2 my-2'
                            : 'py-0 my-0 text-body-2'
                        "
                      >
                        <v-row no-gutters align="center">
                          <v-col
                            cols="12"
                            sm="4"
                            md="3"
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
                                >Name:
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
                                  class="ml-1 mr-1 mr-md-3"
                                  :size="
                                    $vuetify.display.smAndUp ? 'large' : 'small'
                                  "
                                >
                                  mdi-tooltip-account
                                </v-icon>
                                <span v-if="item.raw.isAdmin"
                                  >Administrator</span
                                >
                                <span class="text-truncate">{{
                                  item.raw.site.name || "N/A"
                                }}</span>
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="4"
                            md="3"
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
                                >Email:
                              </span>
                              <span
                                :style="
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                                :class="
                                  $vuetify.display.smAndUp
                                    ? 'text-body-2 text-truncate mr-2'
                                    : ''
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
                                  <v-icon class="ml-1 mr-1 mr-md3"
                                    >mdi-at</v-icon
                                  >
                                  {{ item.raw.site.email || "N/A" }}
                                </span>
                                <span v-else>N/A</span>
                              </span>

                              <span
                                :style="
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                                :class="
                                  $vuetify.display.smAndUp ? 'text-body-2' : ''
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
                                  <v-icon class="ml-1 mr-1">mdi-phone</v-icon>
                                  {{ item.raw.site.contactNumber || "N/A" }}
                                </span>
                                <span v-else>N/A</span>
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            md="3"
                            lg="2"
                            class="text text-capitalize mb-2 mb-sm-0"
                            v-if="
                              $vuetify.display.xs || $vuetify.display.lgAndUp
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
                                class="mr-2 d-flex d-md-none font-weight-bold"
                                >Contact:
                              </span>
                              <span
                                :style="
                                  $vuetify.display.smAndDown
                                    ? 'font-size: .8rem;'
                                    : ''
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
                                  <v-icon class="ml-1 mr-1 mr-md-1"
                                    >mdi-phone</v-icon
                                  >
                                  {{ item.raw.site.contactNumber || "N/A" }}
                                </span>
                                <span v-else>N/A</span>
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="3"
                            md="3"
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
                                <span
                                  v-if="
                                    item.raw.assignedGroup &&
                                    Boolean(item.raw.assignedGroup) &&
                                    typeof item.raw.assignedGroup ===
                                      'object' &&
                                    Object.keys(item.raw.assignedGroup).length >
                                      0
                                  "
                                >
                                  <v-icon class="ml-1 mr-1 mr-md-3"
                                    >mdi-account-multiple-plus</v-icon
                                  >
                                  {{
                                    item.raw.assignedGroup.groupName || "N/A"
                                  }}
                                </span>
                                <span v-else
                                  ><v-icon class="ml-1 mr-1 mr-md-6"
                                    >mdi-account-multiple-plus</v-icon
                                  >N/A</span
                                >
                              </span>

                              <span
                                :style="
                                  $vuetify.display.smAndDown
                                    ? 'font-size: .8rem;'
                                    : ''
                                "
                                class="w-100"
                                v-if="$vuetify.display.sm"
                              >
                                <v-chip
                                  v-if="item.raw.status"
                                  class="text-capitalize"
                                  :color="
                                    item.raw.status === 'approved'
                                      ? 'green'
                                      : 'red'
                                  "
                                >
                                  {{ item.raw.status }}
                                </v-chip>
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="1"
                            md="2"
                            class="text text-capitalize mb-2 mb-sm-0"
                            v-if="
                              $vuetify.display.xs || $vuetify.display.mdAndUp
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
                                class="mr-2 d-flex d-md-none font-weight-bold"
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
                                    item.raw.status === 'approved'
                                      ? 'green'
                                      : 'red'
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
                                    class="pa-4 rounded-xl border-md"
                                    >mdi-dots-vertical</v-icon
                                  >
                                </template>
                                <v-list class="py-0">
                                  <v-list-item
                                    v-if="
                                      $ability.can('read', 'view-site-collab')
                                    "
                                    :to="{
                                      name: 'collaboration-site',
                                      params: {
                                        site: item.raw.site?._id,
                                      },
                                    }"
                                  >
                                    <template #title>
                                      <span class="text-caption"> View </span>
                                    </template>
                                  </v-list-item>

                                  <v-divider />

                                  <v-list-item
                                    v-if="
                                      item.raw.status != 'approved' &&
                                      $ability.can('update', 'edit-site-collab')
                                    "
                                    @click="
                                      acceptInvitation(item.raw._id || '')
                                    "
                                  >
                                    <template #title>
                                      <span class="text-caption">
                                        Approve
                                      </span>
                                    </template>
                                  </v-list-item>

                                  <v-divider />

                                  <v-list-item
                                    v-if="
                                      item.raw.status != 'reject' &&
                                      $ability.can('update', 'edit-site-collab')
                                    "
                                    @click="
                                      rejectInvitation(item.raw._id || '')
                                    "
                                  >
                                    <template #title>
                                      <span class="text-caption"> Reject </span>
                                    </template>
                                  </v-list-item>
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
                        You don't have invitation from sites.
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
  isTableLoadingSiteCollab,
  sitesCollab,
  itemsPerPage,
  searchSiteCollab,
  page,
  pages,
  pageRange,
  nextPage,
  prevPage,
  setSitesCollab,
  patchSiteCollabStatus,
} = useSiteCollab();

const isLgAndUp = ref(window.innerWidth >= 1280);
const isMdAndUp = ref(window.innerWidth >= 960);

window.addEventListener("resize", () => {
  isLgAndUp.value = window.innerWidth >= 1280;
  isMdAndUp.value = window.innerWidth >= 960;
});

const columnHeader = computed(() => {
  const baseHeaders = [
    {
      sm: "4",
      md: "3",
      lg: "3",
      title: "Site Name",
      align: "left",
      visible: true,
    },
    {
      sm: "4",
      md: "3",
      lg: "2",
      title: "Email / Contact #",
      align: "left",
      visible: true,
    },
    {
      sm: "3",
      title: "Group / Status",
      align: "left",
      visible: true,
    },
  ];
  if (isMdAndUp.value) {
    baseHeaders[2].title = "Status";
    baseHeaders.splice(2, 0, {
      sm: "3",
      md: "3",
      lg: "2",
      title: "Group Name",
      align: "left",
      visible: true,
    });
  }
  if (isLgAndUp.value) {
    baseHeaders[1].title = "Email";
    baseHeaders.splice(2, 0, {
      sm: "3",
      md: "3",
      lg: "2",
      title: "Contact",
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

onMounted(async () => {
  await getAllSiteCollabs();
});

async function getAllSiteCollabs() {
  await setSitesCollab({
    serviceProvider: String(currentUser.value.serviceProvider),
  });
}

async function rejectInvitation(id: string) {
  try {
    const response = await patchSiteCollabStatus(id, "reject");
    if (
      response &&
      Boolean(response) &&
      typeof response === "object" &&
      Object.keys(response).length > 0
    ) {
      setSnackbar({
        text: "Successfully rejected!",
        modal: true,
        type: "success",
      });
    }
  } catch (error: any) {
    setSnackbar({ text: error || error.message, modal: true, type: "error" });
  } finally {
    await getAllSiteCollabs();
  }
}

async function acceptInvitation(id: string) {
  try {
    const response = await patchSiteCollabStatus(id, "approved");
    if (
      response &&
      Boolean(response) &&
      typeof response === "object" &&
      Object.keys(response).length > 0
    ) {
      setSnackbar({
        text: "Successfully approved!",
        modal: true,
        type: "success",
      });
    }
  } catch (error: any) {
    setSnackbar({ text: error || error.message, modal: true, type: "error" });
  } finally {
    await getAllSiteCollabs();
  }
}

const onSearch = async (search: string) => {
  searchSiteCollab.value = search;
  getAllSiteCollabs();
};

const callItBack = async () => {
  getAllSiteCollabs();
};

const _nextPage = async () => {
  nextPage({
    serviceProvider: String(currentUser.value.serviceProvider),
  });
};

const _prevPage = async () => {
  prevPage({
    serviceProvider: String(currentUser.value.serviceProvider),
  });
};
</script>
