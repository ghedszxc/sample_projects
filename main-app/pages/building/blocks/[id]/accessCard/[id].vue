<template>
  <v-card
    class="pa-8"
    width="100%"
    elevation="3"
    height="100%"
    :loading="isUnitsLoaded"
  >
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="deep-purple"
        height="4"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-card-text>
      <v-data-iterator :items="dummyItems" :items-per-page="10">
        <!-- :items="unitSetupDetails?.residents?.items"
        :items-per-page="unitSetupDetails?.residents?.pages" -->
        <template v-slot:header>
          <v-row no-gutters class="pa-4">
            <v-col cols="12">
              <v-row no-gutters align="center">
                <v-col
                  cols="12"
                  :class="{
                    'pb-2': !$vuetify.display.mdAndUp,
                    'pr-0': $vuetify.display.mdAndUp,
                  }"
                >
                  <v-row no-gutter>
                    <v-col
                      cols="12"
                      md="6"
                      :class="`${$vuetify.display.smAndUp && 'd-flex  pr-6'} align-center`"
                    >
                      <back-button></back-button>

                      <div class="text-h6 font-weight-bold ml-3">
                        Access Card Log
                      </div>

                      <span class="text-subtitle-1 mx-3 mr-5"> (L3331) </span>

                      <v-text-field
                        v-model="search"
                        placeholder="Search name, id"
                        hide-details
                        density="compact"
                        append-inner-icon="mdi-magnify"
                        :class="`${$vuetify.display.smAndDown && 'mt-4'}`"
                      ></v-text-field>
                      <!-- @update:modelValue="onSearch" -->
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-row align="center" justify="end">
                        <v-col cols="12" md="4">
                          <v-btn
                            block
                            variant="outlined"
                            size="small"
                            style="height: 40px"
                            @click=""
                          >
                            <v-icon>mdi-export</v-icon>
                            Export</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-divider class="mb-6" />

          <v-list
            class="pa-0"
            density="compact"
            v-if="$vuetify.display.mdAndUp"
          >
            <v-list-item>
              <v-list-item-title>
                <v-row no-gutters>
                  <v-col cols="12" md="4">
                    <v-row
                      no-gutters
                      class="fill-height"
                      align-content="center"
                    >
                      <span
                        class="d-inline-block text-truncate text-capitalize text-body-2"
                      >
                        Card Owner
                      </span>
                    </v-row>
                  </v-col>

                  <v-col cols="12" md="2">
                    <v-row
                      no-gutters
                      class="fill-height"
                      align-content="center"
                    >
                      <span
                        class="d-inline-block text-truncate text-capitalize text-body-2"
                      >
                        Card Number
                      </span>
                    </v-row>
                  </v-col>

                  <v-col cols="12" md="2">
                    <v-row
                      no-gutters
                      class="fill-height"
                      align-content="center"
                    >
                      <span
                        class="d-inline-block text-truncate text-capitalize text-body-2"
                      >
                        Type
                      </span>
                    </v-row>
                  </v-col>

                  <v-col cols="12" md="2">
                    <v-row
                      no-gutters
                      class="fill-height"
                      align-content="center"
                    >
                      <span
                        class="d-inline-block text-truncate text-capitalize text-body-2"
                      >
                        Status
                      </span>
                    </v-row>
                  </v-col>

                  <v-col cols="12" md="2">
                    <v-row
                      no-gutters
                      class="fill-height"
                      align-content="center"
                    >
                      <span
                        class="d-inline-block text-truncate text-capitalize text-body-2"
                      >
                        Card Use
                      </span>
                    </v-row>
                  </v-col>
                </v-row>
              </v-list-item-title>
            </v-list-item>
            <v-divider />
          </v-list>
        </template>

        <template v-if="$vuetify.display.mdAndUp" #default="{ items }">
          <v-list class="pa-0 mt-2">
            <template v-for="(item, itemIndex) in items" :key="itemIndex">
              <v-list-item class="rounded-sm">
                <v-list-item-title>
                  <v-row no-gutters align="center">
                    <v-col cols="12" md="4" class="text-capitalize">
                      <v-row no-gutters align="center">
                        <span class="mr-2">
                          <v-avatar
                            size="x-small"
                            :color="materialColors[itemIndex]"
                            class="mr-2 pa-4"
                          >
                            {{ getInitial(item.raw?.cardOwner) }}
                          </v-avatar>

                          <span
                            class="text-capitalize text-body-2"
                            style="word-break: break-word; white-space: normal"
                          >
                            {{ item.raw?.cardOwner }}
                          </span>
                        </span>
                      </v-row>
                    </v-col>

                    <v-col cols="12" md="2" class="text-capitalize">
                      <v-row no-gutters align="center">
                        <span
                          class="text-capitalize text-body-2"
                          style="word-break: break-word; white-space: normal"
                        >
                          {{ item.raw?.cardNumber }}
                        </span>
                      </v-row>
                    </v-col>

                    <v-col cols="12" md="2" class="text text-capitalize">
                      <v-row
                        no-gutters
                        class="fill-height"
                        align-content="center"
                      >
                        <span
                          class="d-inline-block text-truncate text-capitalize text-body-2"
                        >
                          {{ item.raw?.type }}
                        </span>
                      </v-row>
                    </v-col>

                    <v-col cols="12" md="2" class="text text-capitalize">
                      <v-row
                        no-gutters
                        class="fill-height"
                        align-content="center"
                      >
                        <span
                          class="d-inline-block text-truncate text-capitalize text-body-2"
                        >
                          <v-chip
                            :color="
                              item.raw.status == 'Active' ? 'green' : 'red'
                            "
                          >
                            {{
                              item?.raw?.status == "Active"
                                ? "Access Granted"
                                : "Access Denied"
                            }}
                          </v-chip>
                        </span>
                      </v-row>
                    </v-col>

                    <v-col cols="12" md="2" class="text text-capitalize">
                      <v-row
                        no-gutters
                        class="fill-height"
                        align-content="center"
                      >
                        <span
                          class="d-inline-block text-truncate text-capitalize text-body-2"
                        >
                          {{ item?.raw?.cardUse }}
                        </span>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-list-item-title>
              </v-list-item>

              <v-divider v-if="itemIndex + 1 !== items.length"></v-divider>
            </template>
          </v-list>
        </template>
        <template v-else #default="{ items }">
          <v-list class="pa-0">
            <template v-for="(item, itemIndex) in items" :key="itemIndex">
              <v-list-item class="mb-4">
                <v-list-item-title>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                    >
                      <v-row
                        no-gutters
                        class="fill-height text-truncate"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown ? 'space-between' : 'start'
                        "
                      >
                        <span class="mr-2 d-flex d-md-none font-weight-bold"
                          >Card Owner:
                        </span>
                        <span
                          class="text-truncate mt-1"
                          :style="
                            $vuetify.display.smAndDown
                              ? 'font-size: .8rem;'
                              : ''
                          "
                        >
                          <v-avatar
                            size="x-small"
                            :color="materialColors[itemIndex]"
                            class="mr-2 pa-2"
                          >
                            {{ getInitial(item.raw.cardOwner) }}
                          </v-avatar>

                          <span
                            class="text-capitalize text-body-2"
                            style="word-break: break-word; white-space: normal"
                          >
                            {{ item.raw?.cardOwner }}
                          </span>
                        </span>
                      </v-row>
                    </v-col>

                    <v-col
                      cols="12"
                      :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                    >
                      <v-row
                        no-gutters
                        class="fill-height text-truncate"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown ? 'space-between' : 'start'
                        "
                      >
                        <span class="mr-2 d-flex d-md-none font-weight-bold"
                          >Card Number:
                        </span>
                        <span
                          class="text-truncate mt-1"
                          :style="
                            $vuetify.display.smAndDown
                              ? 'font-size: .8rem;'
                              : ''
                          "
                        >
                          {{ item.raw.cardNumber }}
                        </span>
                      </v-row>
                    </v-col>

                    <v-col
                      cols="12"
                      :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                    >
                      <v-row
                        no-gutters
                        class="fill-height text-truncate"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown ? 'space-between' : 'start'
                        "
                      >
                        <span class="mr-2 d-flex d-md-none font-weight-bold"
                          >Type:
                        </span>
                        <span
                          class="text-truncate mt-1"
                          :style="
                            $vuetify.display.smAndDown
                              ? 'font-size: .8rem;'
                              : ''
                          "
                        >
                          {{ item.raw.type }}
                        </span>
                      </v-row>
                    </v-col>

                    <v-col
                      cols="12"
                      :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                    >
                      <v-row
                        no-gutters
                        class="fill-height text-truncate"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown ? 'space-between' : 'start'
                        "
                      >
                        <span class="mr-2 d-flex d-md-none font-weight-bold"
                          >Status:
                        </span>
                        <span
                          class="text-truncate mt-1"
                          :style="
                            $vuetify.display.smAndDown
                              ? 'font-size: .8rem;'
                              : ''
                          "
                        >
                          <v-chip
                            :color="
                              item.raw.status == 'Active' ? 'green' : 'red'
                            "
                          >
                            {{ item?.raw?.status }}
                          </v-chip>
                        </span>
                      </v-row>
                    </v-col>

                    <v-col
                      cols="12"
                      :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                    >
                      <v-row
                        no-gutters
                        class="fill-height text-truncate"
                        align-content="center"
                        align="center"
                        :justify="
                          $vuetify.display.smAndDown ? 'space-between' : 'start'
                        "
                      >
                        <span class="mr-2 d-flex d-md-none font-weight-bold"
                          >Card Use:
                        </span>
                        <span
                          class="text-truncate mt-1"
                          :style="
                            $vuetify.display.smAndDown
                              ? 'font-size: .8rem;'
                              : ''
                          "
                        >
                          {{ item.raw.cardUse }}
                        </span>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-list-item-title>
              </v-list-item>
              <v-divider />
            </template>
          </v-list>
        </template>

        <template #no-data>
          <v-row no-gutters justify="center" class="pa-16">
            <v-col cols="12">
              <v-row no-gutters justify="center">
                <v-img
                  src="/images/empty-building-management-list.svg"
                  width="150px"
                  height="150px"
                ></v-img>
              </v-row>
            </v-col>

            <v-col cols="12" class="mt-10">
              <v-row no-gutters justify="center">
                <span class="font-weight-bold text-h5">
                  Residents / Tenants
                </span>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-row no-gutters justify="center">
                <span class="caption text-disabled">
                  You don't have list of residents/tenants yet.
                </span>
              </v-row>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>

      <v-divider class="mb-3"></v-divider>
      <v-row>
        <v-col cols="12" class="pa-4">
          <v-row no-gutters justify="end" align-content="center">
            <span class="pt-1 pr-2">{{ pageRange }}</span>
            <v-btn
              density="compact"
              variant="text"
              icon
              class="mx-2"
              :disabled="canPrevPage"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>

            <v-btn
              density="compact"
              variant="text"
              icon
              class="mx-2"
              :disabled="!canNextPage"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

definePageMeta({
  middleware: "secure",
});

const {
  isUnitsLoaded,
  viewUnitSetup,
  units,
  setBlockLevelUnits,
  filterBySite,

  unitSetupDetails,

  pageRange,
  canPrevPage,
  canNextPage,
} = useBlockLevelUnit();

const { materialColors, getInitial } = useUtils();
const { theme, setSnackbar } = useLocal();
const { mySite, myOrg } = useFilter();
const route = useRoute();
const router = useRouter();

const dummyItems = ref([
  {
    cardOwner: "Juan Carlo",
    cardNumber: "L3331",
    type: "Lift - Level 1",
    status: "Active",
    cardUse: "2024-12-31 00:00:00",
  },
  {
    cardOwner: "John Doe",
    cardNumber: "L3331",
    type: "Door - Unit 1",
    status: "Active",
    cardUse: "2024-12-31 00:00:00",
  },
  {
    cardOwner: "Juana Dy",
    cardNumber: "L3331",
    type: "Lift - Level 1",
    status: "Active",
    cardUse: "2024-12-31 00:00:00",
  },
  {
    cardOwner: "Cifi Tan",
    cardNumber: "L3331",
    type: "Lift - Level 1",
    status: "Active",
    cardUse: "2024-12-31 00:00:00",
  },
  {
    cardOwner: "Daniel Wei",
    cardNumber: "L3331",
    type: "Door - Unit 1",
    status: "Inactive",
    cardUse: "2024-12-31 00:00:00",
  },
  {
    cardOwner: "Chris Roblin",
    cardNumber: "L3331",
    type: "Lift - Level 1",
    status: "Active",
    cardUse: "2024-12-31 00:00:00",
  },
]);

const selectedUnit = ref({
  block: {
    name: "",
  },
  level: {
    level: "",
  },
  name: "",
});

const search = ref("");

const unitId = computed(() => route.params.id);

watch(search, (newValue: string) => {
  // debouncedSearch(newValue);
});

const debouncedSearch = debounce(async (value: string) => {
  await viewUnitSetup(route.params.id, 1, value);
}, 500);

onMounted(async () => {
  // await setBlockLevelUnits({
  //   organization: myOrg.value ?? "",
  //   site: filterBySite.value || mySite.value,
  // });
  // selectedUnit.value = units.value.find((find) => find._id == route.params.id);
  // await viewUnitSetup(route.params.id, 1, "");
});
</script>

<style scoped>
:deep() .v-field__outline {
  --v-field-border-opacity: 0.1;
}

:deep() .v-overlay__scrim {
  opacity: var(--v-overlay-opacity, 0);
}

:deep() .v-switch .v-label {
  padding-right: 10px;
  font-size: 13px;
}

:deep() .v-switch .v-selection-control {
  display: flex;
  flex-direction: row-reverse;
}

:deep() .v-text-field input {
  font-size: 13px !important;
}

:deep() .v-textarea .v-field__input {
  font-size: 13px !important;
}

:deep() .v-selection-control .v-label {
  font-size: 13px;
}
</style>
