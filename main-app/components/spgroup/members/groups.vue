<template>
  <v-dialog max-width="1500" v-model="isDialogVisible" persistent>
    <v-card class="rounded-xl" min-height="600px">
      <v-toolbar color="white" class="rounded-xl">
        <v-toolbar-title>
          <v-btn icon="mdi-arrow-left" elevation="0" @click="hideModal"></v-btn>

          <span class="text-h6"> Teams / Groups </span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-row align="center" justify="end">
      
          <v-col
            cols="12"
            md="6"
            lg="6"
            :class="{ 'mb-5': $vuetify.display.smAndDown }"
          >
            <search-text-field
            @on-search="onSearch($event)"
            @clear-search="callItBack"
            ></search-text-field>
          </v-col>
        </v-row>
        <v-btn icon="mdi-close" @click="hideModal"></v-btn>
      </v-toolbar>
      <v-divider></v-divider>

      <v-card-text class="py-0 px-1 overflow-auto" style="max-height: 800px;">
        <g-card :loading="isTableLoadingSpGroup" :elevation="0">
          <v-divider></v-divider>
          <v-row class="my-1">
            <v-col cols="12" class="px-4">

              <v-data-iterator :items="spsGroup" :items-per-page="itemsPerPage">
                <template v-slot:header>

                  <v-list density="compact" v-if="$vuetify.display.mdAndUp">
                    <v-list-item class="px-8">
                      <v-list-item-title>
                        <v-row no-gutters class="pb-4">
                          <v-col
                            v-for="(col, idx) in columnHeader"
                            :key="idx"
                            cols="12"
                            :md="col.md"
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
                    <v-divider />
                  </v-list>
                </template>

                <template #default="{ items }">
                  <v-list class="pa-0">
                    <template
                      v-for="(item, itemIndex) in items"
                      :key="item.raw._id"
                    >
                      <v-list-item class="py-4 px-8">
                        <v-list-item-title>
                          <v-row no-gutters>
                            <v-col cols="12" md="4" class="text text-capitalize">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                {{ item.raw.groupName }}
                              </v-row>
                            </v-col>

                            <v-col cols="12" md="4" class="text text-capitalize">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <template v-for="_team in item.raw.members">
                                  <v-avatar size="36px" class="ml-1">
                                    <img
                                      v-if="_team.image"
                                      :src="_team.image"
                                      :alt="_team.name"
                                      style="width: 100%; height: 100%"
                                    />
                                    <span v-else class="white--text">{{
                                      getInitial(_team.name)
                                    }}</span>
                                  </v-avatar>
                                </template>
                              </v-row>
                            </v-col>

                            <v-col cols="12" md="2" class="text text-capitalize">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  v-if="
                                    item.raw.site &&
                                    Boolean(item.raw.site) &&
                                    typeof item.raw.site === 'object' &&
                                    Object.keys(item.raw.site).length > 0
                                  "
                                >
                                  {{ item.raw.site.name }}
                                </span>
                                <span v-else>N/A</span>
                              </v-row>
                            </v-col>


                            <v-col cols="12" md="2" class="text text-capitalize" >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                                justify="end"
                              >
                                <div class="d-flex align-center justify-center">
                                  <v-btn
                                    v-if="currentGroup != item.raw._id"
                                    style="
                                      border-radius: 8px;
                                      border: 1px solid
                                        var(--black-004, rgba(0, 0, 0, 0.04));
                                    "
                                    flat
                                    class="fs12 rounded-lg mx-3 border"
                                    color="#1867C0"
                                    size="small"
                                    @click="transferMember(item.raw)"
                                  >
                                    Transfer
                                  </v-btn>

                                  <v-btn
                                    v-else
                                    flat
                                    class="fs12 text-black rounded-lg mx-3 border"
                                    color="#fff"
                                    type="submit"
                                    size="small"
                                    variant="outlined"
                                    target="_blank"
                                  >
                                    Current&nbsp;
                                  </v-btn>
                                </div>
                              </v-row>
                            </v-col>

                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider></v-divider>
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

              <v-row class="my-1">
                <v-col cols="12" class="pa-4">
                  <FooterPagination
                    @next-page="nextPage()"
                    @prev-page="prevPage()"
                    :pageRange="pageRange"
                    :page="page"
                    :pages="pages"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </g-card>

      </v-card-text>
    </v-card>

   
  </v-dialog>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

let props = defineProps({
  isConfirmModal: {
    type: Boolean,
    default: false,
  },
  currentGroup: {
    type: String
  }
});

const {
  spGroup,
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
  getSPGroupById,
  setSpsGroup,
  createSPGroup,
  disconnectSiteToGroup
} = useSPGroup();

const isDialogVisible = computed(() => props.isConfirmModal);
const { currentUser } = useLocalAuth();
const { getInitial, materialColors, formatDateAndTime, formatDateAndTimeSG } = useUtils();

const columnHeader = computed(() => {
  return [
    { md: "4", title: "Group Name" },
    { md: "4", title: "Team Members" },
    { md: "2", title: "Assigned Site" },
    { md: "1", title: "" },
  ];
});


const selectDateFrom = ref(new Date());

const emit = defineEmits(["transferMember", "closeModal", "viewIr"]);

const selectData = ref({});


const hideModal = () => {
  emit("closeModal", false);
}

const onSearch = async (data: any) => {
  searchSpGroup.value = data
  await getAllSiteGroups();
    
}

const callItBack = async () => {
  searchSpGroup.value = ""
  await getAllSiteGroups();
    
}

const transferMember = async (value: any) => {
  emit("transferMember",value)
}
onMounted(async () => {
  await getAllSiteGroups();
});


async function getAllSiteGroups() {
  await setSpsGroup({
    serviceProvider: currentUser.value.serviceProvider,
  });
}


</script>
