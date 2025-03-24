<template>
  <g-card :loading="isTableLoading" :elevation="2">
    <v-data-iterator :items="sitesCollab" :items-per-page="pageLimit">
      <template v-slot:header>
        <v-row no-gutters class="pa-4">
          <v-col cols="12">
            <v-row no-gutters class="align-center">
              <v-col cols="12" md="6" lg="5">
                <div class="d-flex align-center">
                  <span class="font-weight-bold text-h5 mr-4">
                    <v-btn
                      icon="mdi-arrow-left"
                      elevation="0"
                      @click="useRouter().back()"
                    ></v-btn
                    >{{ spGroup.groupName }}
                  </span>

                  <search-text-field
                    @on-search="onSearch($event)"
                    @clear-search="callItBack"
                  ></search-text-field>
                </div>
              </v-col>

              <v-spacer></v-spacer>
            </v-row>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </template>

      <!-- rows  -->
      <template #default="{ items }">
        <v-list class="pa-0">
          <template v-for="(item, itemIndex) in items" :key="item.raw._id">
            <v-list-item class="py-4 px-8">
              <v-list-item-title>
                <v-row no-gutters>
                  <v-col
                    cols="12"
                    md="3"
                    class="text-capitalize white--text text"
                  >
                    <v-row
                      no-gutters
                      class="d-flex fill-height"
                      align-content="center"
                      justify-content="start"
                    >
                      <v-card class="" elevation="2" rounded>
                        <v-img
                          :src="`/images/org-${Math.min(3, Math.max(1, itemIndex / 2))}.png`"
                          height="32px"
                          width="32px"
                        />
                      </v-card>
                      <span
                        v-if="
                          item.raw.site &&
                          Boolean(item.raw.site) &&
                          typeof item.raw.site === 'object' &&
                          Object.keys(item.raw.site).length > 0
                        "
                        class="ml-5"
                      >
                        {{ item.raw.site.name }}
                      </span>
                      <span v-else> N/A </span>
                    </v-row>
                  </v-col>

                  <v-col cols="12" md="8" class="text">
                    <v-row
                      no-gutters
                      class="fill-height"
                      align-content="center"
                    >
                      <v-icon color="red" class="ml-1 mr-6"> mdi-at </v-icon>
                      <span
                        v-if="
                          item.raw.site &&
                          Boolean(item.raw.site) &&
                          typeof item.raw.site === 'object' &&
                          Object.keys(item.raw.site).length > 0
                        "
                      >
                        {{ item.raw.site.email }}
                      </span>
                      <span v-else> N/A </span>
                    </v-row>
                  </v-col>

                  <v-col cols="12" md="1" class="text">
                    <div class="d-flex align-center justify-center">
                      <v-btn
                        style="
                          border-radius: 8px;
                          border: 1px solid
                            var(--black-004, rgba(0, 0, 0, 0.04));
                        "
                        flat
                        size="small"
                        class="fs12 rounded-lg mx-3 border"
                        color="#1867C0"
                        @click="
                          $emit('onAssignSite', item.raw.site, item.raw._id)
                        "
                      >
                        Assign Site
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-list-item-title>
            </v-list-item>
            <v-divider v-if="itemIndex + 1 !== items.length"></v-divider>
          </template>
        </v-list>
      </template>

      <!-- row without data -->
      <template #no-data>
        <v-row no-gutters justify="center" class="pa-16">
          <v-col cols="12">
            <v-row no-gutters justify="center">
              <v-img src="/empty.svg" width="100px" height="100px"></v-img>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-row no-gutters justify="center">
              <span class="font-weight-bold">
                You don't have any sites to join.
              </span>
            </v-row>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>

    <v-divider></v-divider>
    <v-row class="my-1">
      <v-col cols="12" class="pa-4">
        <FooterPagination
          @next-page="
            nextPage({
              serviceProvider: currentUser.serviceProvider,
            })
          "
          @prev-page="
            prevPage({
              serviceProvider: currentUser.serviceProvider,
            })
          "
          :pageRange="pageRange"
          :page="page"
          :pages="pages"
        />
      </v-col>
    </v-row>
  </g-card>
</template>

<script setup lang="ts">
const emit = defineEmits(["onAssignSite"]);
let props = defineProps({
  isTableLoading: {
    type: Boolean,
    default: false,
  },
  actions: {
    type: Array,
    default: [],
  },
});
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const {
  setSitesCollab,
  sitesCollab,
  searchSiteCollab,
  pageRange,
  page,
  pages,
  nextPage,
  prevPage,
} = useSiteCollab();
const { getSPGroupById, spGroup } = useSPGroup();
const route = useRoute();
const pageLimit = 10;

const groupId = computed(() => String(route.params.group)).value;

onMounted(async () => {
  await Promise.all([getAllSitesApproved(), getSPGroupById(groupId)]);
});

async function getAllSitesApproved() {
  await setSitesCollab({
    serviceProvider: currentUser.value.serviceProvider,
    status: "approved",
  });
}

const onSearch = async (data: any) => {
  searchSiteCollab.value = data;
  setSitesCollab({
    serviceProvider: currentUser.value.serviceProvider,
  });
};

const callItBack = async () => {
  searchSiteCollab.value = "";
  setSitesCollab({
    serviceProvider: currentUser.value.serviceProvider,
  });
};
</script>
