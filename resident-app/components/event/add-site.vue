<template>
  <div class="text-center">
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
      <template v-slot:activator="{ props: activatorProps }">
        <v-text-field
          :base-color="baseColor"
          :bg-color="bgColor"
          class="mb-6"
          v-model="resident.site.name"
          label="Select Site"
          placeholder="Select Site"
          density="default"
          fill
          variant="outlined"
          append-inner-icon="mdi-chevron-right"
          readonly
          v-bind="activatorProps"
          hide-details
        >
          <template v-slot:label>
            <span>Select Site </span><span class="required">*</span>
          </template></v-text-field
        >
      </template>

      <v-card class="pa-8 pab-0" :class="baseColor" :color="bgColor">
        <v-row>
          <v-col cols="12">
            <v-icon start size="x-large" @click="goBack">
              <v-img
                class="pl-0 ml-0 mt-1"
                src="/dark-mode/utility-all/right-arrow.svg"
                cover
              ></v-img>
            </v-icon>
            <span
              style="position: relative; right: 4px; color: baseColor"
              :class="textBackColor"
            >
              Site</span
            >
            <!-- Search Site -->
            <v-text-field
              rounded="lg"
              class="button-shadow mb-3 mt-5"
              :base-color="baseColorSearch"
              :bg-color="bgColorSearch"
              v-model="searchInput"
              placeholder="Search Site"
              density="default"
              variant="outlined"
              hide-details
              @input="(e: Event) => searchSite(e)"
            >
              <template v-slot:append-inner>
                <div style="width: 30px">
                  <v-img
                    style="margin: auto 0"
                    max-height="25"
                    max-width="30"
                    src="/dark-mode/create-account/icons/search.svg"
                  />
                </div> </template
            ></v-text-field>

            <!-- Site List -->
            <!-- <v-list>
              <v-card
                v-for="(item, index) in siteNames.items"
                :key="index"
                @click="toggleSite(index)"
                :class="{ 'text-blue': selectedSite === index }"
                class="outlined-card"
              >
                <v-card-text class="card-content">
                  <v-row>
                    <v-col>
                      <v-list-item-icon>
                        <v-avatar size="32" color="#FF5252">
                          <v-img
                            style="
                              display: flex;
                              width: 16px;
                              height: 16px;
                              padding: 0px 1.373px;
                              justify-content: center;
                              align-items: center;
                            "
                            src="/icons/site.svg"
                          >
                          </v-img>
                        </v-avatar>
                      </v-list-item-icon>
                      <v-list-item-content>{{ item.name }}</v-list-item-content>
                    </v-col>
                    <v-col align="right">
                      <v-list-item-icon>
                        <v-icon v-if="selectedSite === index"
                          >mdi-check-circle</v-icon
                        >

                        <v-icon v-else>mdi-check-circle-outline</v-icon>
                      </v-list-item-icon></v-col
                    >
                  </v-row>
                </v-card-text>
              </v-card>     
            </v-list> -->
            <template v-for="(item, index) in siteNames.items" :key="item._id">
              <v-col cols="12" class="mb-0 px-0 py-0 mb-3">
                <v-card
                  :base-color="baseColorSearch"
                  :bg-color="bgColor"
                  variant="outlined"
                  rounded="lg"
                  :style="`display: flex;height: 73.1px; border-color: ${
                    selectedSite === item ? 'green' : ''
                  } ;`"
                  @click="toggleSite(item)"
                  :class="[{ 'text-green': selectedSite === item }, BorderCard]"
                >
                  <v-row no-gutters class="align-center pa-4" @click="">
                    <!-- <v-col cols="2">
                      <v-avatar size="small" color="#FF5252" class="pa-1">
                        <v-img src="/icons/site.svg"></v-img>
                      </v-avatar>
                    </v-col> -->
                    <v-col cols="11">
                      {{ item.name }}
                    </v-col>
                    <v-col cols="1">
                      <v-icon :color="selectedSite === item ? 'success' : ''">
                        {{
                          selectedSite === item
                            ? "mdi-check-circle"
                            : "mdi-check-circle-outline"
                        }}
                      </v-icon>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </template>
            <v-row no-gutters class="align-center">
              <v-btn
                width="100%"
                size="large"
                color="#E0241C"
                @click="nextSite"
                v-if="hasMorePages(siteNames.pageRange)"
                >Load More</v-btn
              >
              <div class="w-100" v-else>
                <p class="text-grey text-center">No more sites</p>
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";
import { hasMorePages } from "../../utils/paginations";

const { theme } = useLocal();
const { resident } = useResident();
const { getAllSites } = useSite();
const { getBlocksLists, getBlocksByPageSearch } = useBlock();
const { setSnackbar } = useLocal();
const dialog = ref(false);
const site = ref("");
const selectedSite = ref<Record<string, any> | number>([]);
const searchInput = ref("");
const siteNames = ref<Record<string, any>>([]);
const emit = defineEmits(["addBlocks"]);
const goBack = () => {
  dialog.value = false; // Close the dialog when going back
};
const pageSite = ref<number>(1);
const hasNextPage = ref(true);

const toggleSite = async <T extends Record<string, any>>(item: T) => {
  // selectedSite.value.name = "";
  selectedSite.value = item;

  dialog.value = false;
  resident.value.block = { _id: "", name: "" };
  resident.value.level = { _id: "", name: "" };
  resident.value.unitNumber = { _id: "", name: "" };
  resident.value.site.name = selectedSite.value.name;
  resident.value.site._id = selectedSite.value._id;
  resident.value.organization = selectedSite.value.organization?._id;

  if (resident.value.site?._id) {
    const result = (await getBlocksByPageSearch({
      // organization: resident.value.organization,
      site: resident.value.site._id,
    })) as Record<string, any>;
    if (result?.items.length > 0) {
      emit("addBlocks", result);
    } else {
      emit("addBlocks", { items: [] });
      setSnackbar({
        text: "No blocks for this site",
        modal: true,
      });
    }
  } else {
    setSnackbar({
      text: "Invalid parameters",
      modal: true,
    });
  }
};

function updatePage(site: Record<string, any>) {
  if (site.items.length === 0) {
    hasNextPage.value = false;
  } else {
    hasNextPage.value = true;
  }
}

async function nextSite() {
  pageSite.value = pageSite.value + 1;
  const nextSites = (await getAllSites({
    page: pageSite.value,
    ...(searchInput.value && {
      search: searchInput.value,
    }),
  })) as Record<string, any>;
  updatePage(nextSites);
  const items = [...siteNames.value.items, ...nextSites.items];
  siteNames.value = {
    items,
    pages: nextSites.pages,
    pageRange: nextSites.pageRange,
  };
}

async function searchSite(event: Event) {
  debouncedSearch((event.target as HTMLInputElement)?.value);
}

const debouncedSearch = debounce(async (value: string) => {
  hasNextPage.value = true;
  pageSite.value = 1;
  const sites = (await getAllSites({
    search: value,
  })) as Record<string, any>;
  updatePage(sites);
  if (!value) {
    pageSite.value = 1;
    siteNames.value = (await getAllSites()) as any;
    updatePage(siteNames.value);
  } else {
    siteNames.value = sites;
  }
}, 1000);

onMounted(async () => {
  // siteNames.value = (await getAllSites()) as any;
  if (!theme.value) theme.value = "light";
});

const baseColor = computed(() =>
  theme.value === "dark" ? "#FAFAFAFA" : "#111723",
);
const baseColorSearch = computed(() =>
  theme.value === "dark" ? "#EB261E" : "#EB261E",
);

const bgColor = computed(() =>
  theme.value === "dark" ? "#111723" : "#FAFAFAFA",
);

const bgColorSearch = computed(() => (theme.value === "dark" ? "#111723" : ""));

const textBackColor = computed(() =>
  theme.value === "dark" ? "text-back-dark" : "text-back",
);

const BorderCard = computed(() =>
  theme.value === "dark" ? "card-dark" : "card-light",
);

watch(dialog, async () => {
  if (dialog.value == true) {
    searchInput.value = "";
    siteNames.value = (await getAllSites()) as any;
  }
});
</script>
<style scoped>
.outlined-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding: 5px;
  margin: 5px;
}

.text-blue {
  color: blue;
}
.card-content v-list-item-content {
  flex: 1; /* Take up remaining space */
}

.card-content v-list-item-icon {
  margin-left: auto; /* Push the icon to the right */
}
.text-back {
  color: #052439;
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
}
.text-back-dark {
  color: #fcfcfc;
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
}

.button-shadow {
  border-radius: 8px;

  box-shadow: 0px 0px 30px 0px rgba(233, 38, 30, 0.2);
}

.card-light {
  border: 1px solid var(--stroke-light-mode, rgba(185, 184, 192, 0.2));
  box-shadow: 0px 5px 14px 0px rgba(15, 14, 20, 0.1);
}

.card-dark {
  border: 1px solid var(--black-004, rgba(0, 0, 0, 0.1));
  box-shadow: 0px 0px 14px 0px rgba(255, 255, 255, 0.1);
}

.v-input--is-focused .v-input__slot {
  border: 2px solid #005fcc !important;
  border-bottom-color: rgba(0, 0, 0, 0.38) !important;
}
.required {
  color: red;
  font-size: 16px;
}
</style>
