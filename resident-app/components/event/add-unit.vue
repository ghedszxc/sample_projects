<template>
  <div class="text-center">
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
      <template v-slot:activator="{ props: activatorProps }">
        <v-text-field
          :base-color="baseColor"
          :bg-color="bgColor"
          v-model="resident.unitNumber.name"
          label="Unit"
          placeholder="Select Unit"
          density="default"
          fill
          variant="outlined"
          append-inner-icon="mdi-chevron-right"
          readonly
          v-bind="activatorProps"
          hide-details
        >
          <template v-slot:label>
            <span>Unit </span><span class="required">*</span>
          </template></v-text-field
        >
      </template>

      <v-card class="pa-8" :class="baseColor" :color="bgColor">
        <v-row>
          <v-col cols="12">
            <!-- Search Unit -->
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
              Units</span
            >
            <v-text-field
              rounded="lg"
              class="button-shadow mb-3 mt-5"
              :base-color="baseColorSearch"
              :bg-color="bgColorSearch"
              v-model="searchInput"
              placeholder="Search Unit"
              density="default"
              filled
              variant="outlined"
              hide-details
              @input="(e: Event) => searchUnit(e)"
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

            <!-- Unit List -->
            <template v-for="(item, index) in unitNames.items" :key="item">
              <v-col cols="12" class="mb-0 px-0 py-0 mb-3">
                <v-card
                  :base-color="baseColorSearch"
                  :bg-color="bgColor"
                  variant="outlined"
                  rounded="lg"
                  :style="`display: flex;height: 73.1px;border-color: ${
                    selectedUnit === item ? 'green' : ''
                  } ;`"
                  @click="toggleUnit(item)"
                  :class="[{ 'text-green': selectedUnit === item }, BorderCard]"
                >
                  <v-row no-gutters class="align-center pa-4" @click="">
                    <v-col cols="2">
                      <v-avatar size="small" color="#FF5252" class="pa-1">
                        <v-img src="/icons/units.svg"></v-img>
                      </v-avatar>
                    </v-col>
                    <v-col cols="9">
                      {{ item.name }}
                    </v-col>
                    <v-col cols="1">
                      <v-icon :color="selectedUnit === item ? 'success' : ''">
                        {{
                          selectedUnit === item
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
                @click="nextUnit"
                v-if="hasMorePages(unitNames.pageRange)"
                >Load More</v-btn
              >
              <div class="w-100" v-else>
                <p class="text-grey text-center">No more levels</p>
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
const { setSnackbar } = useLocal();
const { theme } = useLocal();
const { resident } = useResident();
const { getUnitsByPageSearch } = useBlockLevelUnit();

const dialog = ref(false);
const unit = ref("");
const selectedUnit = ref<Record<string, any>>();
const searchInput = ref("");

const units = defineProps(["childUnit"]);
const unitNames = ref<Record<string, any>>({});
const originalUnits = ref({});
const pageSite = ref<number>(1);
const hasNextPage = ref(true);

const goBack = () => {
  dialog.value = false; // Close the dialog when going back
};

watch(dialog, async () => {
  // if (dialog.value == true) {
  //   // unitNames.value = units.childUnit;
  //   // originalUnits.value = units.childUnit;
  // }
  if (resident.value.level?._id) {
    if (dialog.value == true) {
      searchInput.value = "";
      unitNames.value = (await getUnitsByPageSearch({
        // organization: resident.value.organization,
        level: resident.value.level._id,
      })) as Record<string, any>;
      // blockNames.value = blocks.childBlock;
      // originalBlocks.value = blocks.childBlock;
    }
  } else {
    dialog.value = false;

    setSnackbar({
      text: "Please select level first",
      modal: true,
    });
  }
});

const toggleUnit = async <T extends Record<string, any>>(item: T) => {
  selectedUnit.value = item;
  dialog.value = false;

  resident.value.unitNumber._id = selectedUnit.value._id;
  resident.value.unitNumber.name = selectedUnit.value.name;
};

function updatePage(site: Record<string, any>) {
  if (site.items.length === 0) {
    hasNextPage.value = false;
  } else {
    hasNextPage.value = true;
  }
}

async function nextUnit() {
  pageSite.value = pageSite.value + 1;
  const nextUnits = (await getUnitsByPageSearch({
    page: pageSite.value,
    // organization: resident.value.organization,
    ...(searchInput.value && {
      search: searchInput.value,
    }),
    // block: resident.value.block._id,
    level: resident.value.level._id,
  })) as Record<string, any>;
  updatePage(nextUnits);
  const items = [...unitNames.value.items, ...nextUnits.items];
  unitNames.value = {
    items,
    pages: nextUnits.pages,
    pageRange: nextUnits.pageRange,
  };
}

async function searchUnit(event: Event) {
  debouncedSearch((event.target as HTMLInputElement)?.value);
}

const debouncedSearch = debounce(async (value: string) => {
  hasNextPage.value = true;
  pageSite.value = 1;
  const levels = (await getUnitsByPageSearch({
    search: value,
    // organization: resident.value.organization,
    // block: resident.value.block._id,
    level: resident.value.level._id,
  })) as Record<string, any>;
  unitNames.value = levels;
  // updatePage(levels);
  // if (!value) {
  //   pageSite.value = 1;
  //   unitNames.value = originalUnits.value;
  //   updatePage(unitNames.value);
  // } else {
  //   unitNames.value = levels;
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

watch(dialog, () => {
  if (dialog.value == false) {
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
.required {
  color: red;
  font-size: 16px;
}
</style>
