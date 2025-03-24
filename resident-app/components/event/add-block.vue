<template>
  <div class="text-center">
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
      <template v-slot:activator="{ props: activatorProps }">
        <v-text-field
          :base-color="baseColor"
          :bg-color="bgColor"
          class="mb-6"
          v-model="resident.block.name"
          label="Select Block"
          placeholder="Select Block"
          density="default"
          fill
          variant="outlined"
          append-inner-icon="mdi-chevron-right"
          readonly
          v-bind="activatorProps"
          hide-details
        >
          <template v-slot:label>
            <span>Block </span><span class="required">*</span>
          </template></v-text-field
        >
      </template>

      <v-card class="pa-8" :class="baseColor" :color="bgColor">
        <v-row no-gutters>
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
              Block</span
            >

            <!-- Search Block -->
            <v-text-field
              rounded="lg"
              class="button-shadow mb-3 mt-5"
              :base-color="baseColorSearch"
              :bg-color="bgColorSearch"
              v-model="searchInput"
              placeholder="Search Block"
              density="default"
              filled
              variant="outlined"
              hide-details
              @input="(e: Event) => searchBLock(e)"
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

            <!-- Block List -->
            <template v-for="(item, index) in blockNames.items" :key="item">
              <v-col cols="12" class="mb-0 px-0 py-0 mb-3">
                <v-card
                  :base-color="baseColorSearch"
                  :bg-color="bgColor"
                  variant="outlined"
                  rounded="lg"
                  :style="`display: flex;height: 73.1px;border-color: ${
                    selectedBlock === item ? 'green' : ''
                  } ;`"
                  :class="[
                    { 'text-green': selectedBlock === item },
                    BorderCard,
                  ]"
                  @click="toggleBlock(item)"
                >
                  <v-row no-gutters class="align-center pa-4" @click="">
                    <!-- <v-col cols="2">
                      <v-avatar size="small" color="#FF5252" class="pa-1">
                        <v-img src="/icons/blocks.svg"></v-img>
                      </v-avatar>
                    </v-col> -->
                    <v-col cols="11">
                      {{ item.name }}
                    </v-col>
                    <v-col cols="1">
                      <v-icon :color="selectedBlock === item ? 'success' : ''">
                        {{
                          selectedBlock === item
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
                @click="nextBlock"
                v-if="hasMorePages(blockNames.pageRange)"
                >Load More</v-btn
              >
              <div class="w-100" v-else>
                <p class="text-grey text-center">No more blocks</p>
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
const { getBlockLevelsByPageSearch } = useBlockLevel();
const { getBlocksByPageSearch } = useBlock();
const { setSnackbar } = useLocal();

const dialog = ref(false);
const block = ref("");
const selectedBlock = ref<Record<string, any>>();
const searchInput = ref("");

const emit = defineEmits(["addLevels"]);
const blocks = defineProps(["childBlock"]);
const blockNames = ref<Record<string, any>>({});
const originalBlocks = ref({});
const pageSite = ref<number>(1);
const hasNextPage = ref(true);

const goBack = () => {
  dialog.value = false; // Close the dialog when going back
};

watch(dialog, async () => {
  if (resident.value.site?._id) {
    if (dialog.value == true) {
      searchInput.value = "";
      blockNames.value = (await getBlocksByPageSearch({
        // organization: resident.value.organization,
        site: resident.value.site._id,
      })) as Record<string, any>;
      // blockNames.value = blocks.childBlock;
      // originalBlocks.value = blocks.childBlock;
    }
  } else {
    dialog.value = false;

    setSnackbar({
      text: "Please select site first",
      modal: true,
    });
  }
});

const toggleBlock = async <T extends Record<string, any>>(item: T) => {
  selectedBlock.value = item;
  dialog.value = false;
  resident.value.level = { _id: "", name: "" };
  resident.value.unitNumber = { _id: "", name: "" };
  resident.value.block.name = selectedBlock.value.name;
  resident.value.block._id = selectedBlock.value._id;
  // resident.value.organization = selectedBlock.value.organization;

  if (resident.value.block) {
    const result = (await getBlockLevelsByPageSearch({
      // organization: resident.value.organization,
      block: resident.value.block._id,
    })) as Record<string, any>;
    if (result?.items.length > 0) {
      emit("addLevels", result);
    } else {
      emit("addLevels", { items: [] });
      setSnackbar({
        text: "No levels for this block",
        modal: true,
      });
    }
  }
};

function updatePage(site: Record<string, any>) {
  if (site.items.length === 0) {
    hasNextPage.value = false;
  } else {
    hasNextPage.value = true;
  }
}

async function nextBlock() {
  pageSite.value = pageSite.value + 1;
  const nextBlocks = (await getBlocksByPageSearch({
    page: pageSite.value,
    // organization: resident.value.organization,
    ...(searchInput.value && {
      search: searchInput.value,
    }),
    site: resident.value.site._id,
  })) as Record<string, any>;

  updatePage(nextBlocks);
  const items = [...blockNames.value.items, ...nextBlocks.items];
  blockNames.value = {
    items,
    pages: nextBlocks.pages,
    pageRange: nextBlocks.pageRange,
  };
}

async function searchBLock(event: Event) {
  debouncedSearch((event.target as HTMLInputElement)?.value);
}

const debouncedSearch = debounce(async (value: string) => {
  hasNextPage.value = true;
  pageSite.value = 1;
  const blocks = (await getBlocksByPageSearch({
    search: value,
    // organization: resident.value.organization,
    site: resident.value.site._id,
  })) as Record<string, any>;
  blockNames.value = blocks;
  // updatePage(blocks);
  // if (!value) {
  //   pageSite.value = 1;
  //   blockNames.value = originalBlocks.value;
  //   updatePage(blockNames.value);
  // } else {
  //   blockNames.value = blocks;
  // }
}, 1000);

onMounted(async () => {
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
  if (dialog.value === false) {
    searchInput.value = "";
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
  flex: 3; /* Take up remaining space */
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
.no-flex {
  display: block !important;
  justify-content: initial !important;
  align-items: initial !important;
}

.required {
  color: red;
  font-size: 16px;
}
</style>
