<template>
  <v-row no-gutters justify="center" class="px-2">
    <v-col cols="12">
      <v-toolbar color="secondaryDark">
        <GoBackArrow header-text="Online Forms" @go-back="goBack" />

        <template #extension>
          <v-tabs v-model="tabs" slider-color="transparent" grow stacked>
            <v-tab
              v-for="tab in tabsDetails"
              :key="tab.value"
              :value="tab.value"
              :text="tab.text"
              :loading="isDataLoading[tab.text || '']"
              class="pb-2"
              :class="{
                'active-tab': tabs === tab.value,
                'inactive-tab': tabs !== tab.value,
              }"
              @click="getItems(tab.text, '')"
            />
          </v-tabs>
        </template>
      </v-toolbar>

      <v-spacer />

      <section class="w-100 my-5 position-relative">
        <v-text-field
          v-if="tabs !== 1"
          v-model="search"
          class="search-bar"
          label="Search Type of Form"
          density="compact"
          variant="plain"
          hide-details
          clearable
          @update:model-value="onSearch"
          @click:clear="onClearSearch"
        />
        <v-img
          src="/icons/resident/home/search.svg"
          alt="search-icon"
          class="position-absolute"
          style="right: 28px; top: 18px"
        />
      </section>

      <v-tabs-window v-model="tabs">
        <v-tabs-window-item :value="1">
          <v-row v-if="formsAvailable.length > 0" no-gutters class="mt-5">
            <template v-for="formItems in formsAvailable" :key="formItems.icon">
              <v-col cols="12" class="mb-2">
                <v-card
                  class="mx-2 style-card"
                  :class="cardDesign"
                  :to="{
                    name: formItems.to,
                    query: { id: formItems._id || '', action: 'add' },
                  }"
                  flat
                >
                  <v-row no-gutters class="d-flex align-center">
                    <v-col cols="11">
                      <v-card-title class="text-subtitle-1">
                        {{ formItems.typeOfForm }}
                      </v-card-title>
                    </v-col>

                    <v-col cols="1">
                      <v-img
                        src="/icons/resident/home/form-list-icon.svg"
                        class="menu-icon"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </template>
          </v-row>
          <div
            v-else
            class="d-flex justify-center align-center text-h5 fond-weight-bold"
          >
            No Configured Forms
          </div>
        </v-tabs-window-item>

        <v-tabs-window-item :value="2">
          <SubmittedFormStatusCard
            :page-number="page"
            :data="items"
            @on-select-page="onSelectPage"
          />
        </v-tabs-window-item>

        <v-tabs-window-item :value="3">
          <SubmittedFormStatusCard
            :page-number="page"
            :data="items"
            @on-select-page="onSelectPage"
          />
        </v-tabs-window-item>

        <v-tabs-window-item :value="4">
          <SubmittedFormStatusCard
            :page-number="page"
            :data="items"
            @on-select-page="onSelectPage"
          />
        </v-tabs-window-item>

        <v-tabs-window-item :value="5">
          <SubmittedFormStatusCard
            :page-number="page"
            :data="items"
            @on-select-page="onSelectPage"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});
const { items, page, nextPage, setItems } = useForms();
const { theme } = useLocal();
const { currentUser } = useLocalAuth();
const { configForms, getAllSelectedForms } = useSiteSettings();

const tabs = ref(1);
const currentStatus = ref("");
const search = ref("");
const isDataLoading = ref<Record<string, boolean>>({});
const isClearingSearch = ref(false);

const tabsDetails = ref([
  {
    value: 1,
    text: "Forms",
  },

  {
    value: 2,
    text: "Pending",
  },
  {
    value: 3,
    text: "Approved",
  },
  {
    value: 4,
    text: "Resubmission",
  },
  {
    value: 5,
    text: "Rejected",
  },
]);

const formDetails = ref([
  {
    title: "Pet Record Form",
    to: "online-forms-pet-record-form",
  },
  {
    title: "Renovation Form",
    to: "online-forms-renovation-form",
  },
  {
    title: "Letter of Undertaking & Indemnity",
    to: "online-forms-loui-form",
  },
  {
    title: "Renovation Refund Form",
    to: "online-forms-renovation-refund-form",
  },
  {
    title: "Application for Moving In/Out & Delivery",
    to: "online-forms-moving-in-out-form",
  },
  {
    title: "Application for Electronic Access Card",
    to: "online-forms-electronic-access-form",
  },
  {
    title: "Application for Bicycle Parking",
    to: "online-forms-bicycle-parking-form",
  },
  {
    title: "Vehicle Registration Form",
    to: "online-forms-vehicle-registration-form",
  },
]);

const cardDesign = computed(() =>
  theme.value === "dark" ? "card-light" : "card-dark",
);

const formsAvailable = computed(() => {
  if (Array.isArray(configForms.value) && configForms.value.length > 0) {
    return (
      configForms.value
        .map((item1) => {
          const match = formDetails.value.find(
            (item2) => item2.title === item1.typeOfForm,
          );
          if (match) {
            return {
              ...item1,
              to: match.to,
            };
          }
          return null;
        })
        .filter((item) => item !== null) || []
    );
  }
  return [];
});

onMounted(async () => {
  if (!theme.value) theme.value = "light";
  isDataLoading.value[currentStatus.value] = true;
  await getAllSelectedForms(currentUser.value.site);
  isDataLoading.value[currentStatus.value] = false;
});

const onClearSearch = async () => {
  search.value = "";
  await getItems(currentStatus.value);
  isClearingSearch.value = true;
};

const onSearch = async (_search: string) => {
  isDataLoading.value[currentStatus.value] = true;
  if (isClearingSearch.value) {
    // to avoid searching again
    isClearingSearch.value = false;
    return;
  }
  debouncedSearch(_search);
};

const debouncedSearch = debounce(async (value: string) => {
  page.value = 1;
  await getItems(currentStatus.value, value);
  isDataLoading.value[currentStatus.value] = false;
}, 1000);

const getItems = async (status: string, searchValue?: string) => {
  isDataLoading.value[status] = true;
  currentStatus.value = status;
  page.value = 1;
  search.value = searchValue || "";
  items.value = [];
  await setItems({
    searchParam: search.value,
    pageParam: page.value,
    limitParam: 5,
    filterStatus: status,
    site: currentUser.value.site,
    createdBy: currentUser.value._id,
  });
  isDataLoading.value[status] = false;
};

const onSelectPage = async (pageVal: number) => {
  await nextPage({
    searchParam: search.value,
    pageParam: pageVal,
    limitParam: 5,
    filterStatus: currentStatus.value,
    site: currentUser.value.site,
    createdBy: currentUser.value._id,
  });
};

const goBack = () => useRouter().push({ name: "resident" });

onUnmounted(() => {});
</script>

<style lang="scss" scoped>
.menu-icon {
  width: 19px;
  height: 19px;
}

.info-card {
  border: 1px solid #f2f2f2;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}

.style-card {
  font-size: 12px;
  border: 1px solid #343a45;
  padding: 10px;
  border-radius: 8px;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.v-tab {
  border-bottom: 1px solid #ffffff;
  transition: border-color 0.3s ease;
}

.active-tab {
  border-bottom: 1px solid #eb261e;
}

.search-bar {
  border: 1px solid #eb261e;
  padding: 12px 12px 17px 12px;
  border-radius: 4px;
}
</style>
