<template>
  <BaseTable
    table-name="Online Forms"
    :items="items"
    :elevation="0"
    :headers="headers"
    :itemPerPage="itemsPerPage"
    :pageRange="pageRange"
    :page="page"
    :pages="pages"
    :isLoading="isLoading || isSearching"
    noDataMsg="You don't have any records yet."
    noDataImg="/icons/empty.svg"
    @next-page="nextPage({ site: mySite })"
    @prev-page="prevPage({ site: mySite })"
  >
    <template #customHeader>
      <!-- tabs here -->
      <!-- pet records settings -->
      <v-col cols="12" class="p-0">
        <v-row no-gutters class="align-center">
          <v-col cols="12">
            <span class="font-weight-bold text-h6 mr-6 pt-1 text-truncate">
              Forms
            </span>
          </v-col>
          <v-col cols="12" md="3" class="d-flex justify-end">
            <BaseSearch
              @on-search="onSearch($event)"
              @on-clear-search="onClearSearch"
            ></BaseSearch>
          </v-col>
          <v-spacer></v-spacer>
          <v-col
            cols="12"
            md="3"
            class="d-flex justify-end"
            :class="$vuetify.display.lgAndUp ? 'px-4' : 'px-0 py-2'"
          >
            <v-autocomplete
              v-model="currentTypeOfForm"
              class="mr-2"
              :items="[
                'All',
                'Pet Records Form',
                'Application for Renovation/Addition & Alteration Works',
                'Letter of Undertaking & Indemnity',
                'Refund of Deposit',
                'Application for Moving In/Out & Delivery',
                'Application for Electronic Access Card',
                'Application for Bicycle Parking',
                'Vehicle Registration Form',
              ]"
              item-title="text"
              item-value="value"
              label="Type of Form"
              density="compact"
              hide-details
              @update:model-value="onFilterTypeOfForm"
            ></v-autocomplete>
          </v-col>
          <v-col
            cols="12"
            md="3"
            class="d-flex justify-end"
            :class="$vuetify.display.lgAndUp ? '' : 'px-0 py-2'"
          >
            <v-autocomplete
              v-model="currentStatus"
              class="mr-2"
              :items="[
                'All',
                'Pending',
                'Pending for Signature',
                'Approved',
                'Resubmission',
                'Rejected',
                'Cancelled',
              ]"
              item-title="text"
              item-value="value"
              label="Filter Status"
              density="compact"
              hide-details
              @update:model-value="onFilterStatus"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-col>
      <v-divider></v-divider>
    </template>

    <template #tableItems="{ items }">
      <v-list class="pa-0">
        <template v-for="(item, itemIndex) in items" :key="itemIndex">
          <v-list-item
            link
            class="py-4"
            @click="
              $ability.can('read', 'view-form') &&
                navigateToForm(item.raw._id as string, item.raw.typeOfForm)
            "
          >
            <v-list-item-title>
              <v-row no-gutters class="align-center">
                <v-col
                  cols="12"
                  md="3"
                  class="text-capitalize white--text text mb-2 mb-sm-0"
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
                      >Type of Form:
                    </span>

                    <span class="d-inline-block text-truncate">
                      {{ item.raw.typeOfForm }}
                    </span>
                  </v-row>
                </v-col>

                <v-col
                  cols="12"
                  md="2"
                  class="text-capitalize white--text text mb-2 mb-sm-0"
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
                      >Submitted By:
                    </span>

                    <span class="d-inline-block text-truncate">
                      <SharedAvatar
                        :item="{
                          name: getFullName(
                            item.raw.createdByName || item.raw.createdBy || '',
                          ),
                        }"
                        :isIcon="true"
                      />
                    </span>
                  </v-row>
                </v-col>

                <v-col
                  cols="12"
                  md="2"
                  class="text-capitalize white--text text mb-2 mb-sm-0"
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
                      >Unit No.:
                    </span>

                    <span class="d-inline-block text-truncate">
                      {{ item.raw.unitNumber }}
                    </span>
                  </v-row>
                </v-col>

                <v-col
                  cols="12"
                  md="2"
                  class="text-capitalize white--text text mb-2 mb-sm-0"
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
                      >Date Submitted:
                    </span>

                    <span class="d-inline-block text-truncate">
                      {{
                        formatStandardDate(
                          item.raw.date || item.raw.createdAt || "",
                        )
                      }}
                    </span>
                  </v-row>
                </v-col>

                <v-col
                  cols="12"
                  md="2"
                  lg="2"
                  class="white--text text mb-2 mb-sm-0"
                  v-if="$vuetify.display.xs || $vuetify.display.mdAndUp"
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
                    <span class="mr-2 d-flex d-sm-none font-weight-bold"
                      >Status:
                    </span>
                    <span class="d-inline-block text-truncate">
                      <v-chip
                        :color="
                          getColorForStatus(
                            Array.isArray(item.raw.status) &&
                              item.raw.status.length !== 0
                              ? item.raw.status.find(
                                  (stat) => stat.site === mySite,
                                )?.status || null
                              : item.raw.status,
                          )
                        "
                        class="px-10 font-weight-bold"
                      >
                        <span
                          class="text-truncate text-center"
                          style="min-width: 70px"
                        >
                          {{
                            Array.isArray(item.raw.status) &&
                            item.raw.status.length !== 0
                              ? item.raw.status.find(
                                  (stat) => stat.site === mySite,
                                )?.status || null
                              : item.raw.status
                          }}
                        </span>
                      </v-chip>
                    </span>
                  </v-row>
                </v-col>

                <v-col
                  v-if="
                    $ability.can('create', 'download-form-pdf') ||
                    $ability.can('delete', 'delete-form')
                  "
                  cols="12"
                  md="1"
                  class="mt-2 mt-md-0"
                >
                  <v-row
                    no-gutters
                    class="fill-height"
                    justify="end"
                    align-content="center"
                  >
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-dots-vertical"
                          density="compact"
                          variant="flat"
                          :loading="isActionLoading[item.raw._id || '']"
                        ></v-btn>
                      </template>
                      <v-list>
                        <template
                          v-for="(actionItem, actionIndex) in actions"
                          :key="actionItem.text"
                        >
                          <v-list-item
                            v-if="actionItem.gate"
                            class="text-center"
                            :disabled="
                              (/^Download$/i.test(actionItem.text) &&
                                !/^Approved$/i.test(item.raw.status || '')) ||
                              (/^Edit|Delete$/i.test(actionItem.text) &&
                                /^Approved$/i.test(item.raw.status || ''))
                            "
                            :loading="isActionLoading[item.raw._id || '']"
                            @click="onTableAction(item.raw, actionItem.text)"
                          >
                            <v-list-item-title v-text="actionItem.text">
                            </v-list-item-title>
                          </v-list-item>

                          <v-divider
                            v-if="actionIndex + 1 !== actions.length"
                          ></v-divider>
                        </template>
                      </v-list>
                    </v-menu>
                  </v-row>
                </v-col>
              </v-row>
            </v-list-item-title>
          </v-list-item>
          <v-divider v-if="itemIndex + 1 !== items.length"></v-divider>
        </template>
      </v-list>
      <!-- Delete Confirmation -->
      <v-dialog v-model="isShowDeleteDialog" max-width="400" persistent>
        <v-card class="pa-10">
          <div>
            <div class="d-flex justify-center">
              <v-img :src="'/images/throw.svg'" alt="Delete Image" />
            </div>

            <div class="font-weight-bold text-center my-5">
              Confirm Password to Delete
              <span class="text-red"
                >"{{ currentForm && currentForm.typeOfForm }}"</span
              >
            </div>
            <div class="text-caption text-red">
              NOTE: This is a permanent deletion!
            </div>
            <v-text-field
              type="password"
              label="Enter Password"
              v-model="yourPassword"
            ></v-text-field>
          </div>
          <template v-slot:actions>
            <v-spacer></v-spacer>
            <v-col cols="12">
              <v-row no-gutters>
                <v-col cols="6" class="pr-2">
                  <v-btn
                    class="w-100"
                    @click="isShowDeleteDialog = false"
                    variant="outlined"
                  >
                    Cancel
                  </v-btn>
                </v-col>

                <v-col cols="6" class="pl-2">
                  <v-btn
                    class="bg-red-darken-4 w-100"
                    :loading="isDeleting"
                    @click="
                      onDeleteItem((currentForm && currentForm._id) || '')
                    "
                  >
                    Confirm
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </template>
        </v-card>
      </v-dialog>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

const { $ability } = useNuxtApp();
const {
  items,
  page,
  pages,
  itemsPerPage,
  pageRange,
  isLoading,
  isDeleting,
  nextPage,
  prevPage,
  setItems,
  downloadDobPdf,
  deleteItem,
} = useForms();
const { formatStandardDate, getFullName, uiStatusColor } = useUtils();
const { mySite } = useFilter();
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const { confirmPassword } = useUser();

const yourPassword = ref("");
const isActionLoading = ref<Record<string, boolean>>({});
const isShowDeleteDialog = ref(false);
const currentForm = ref<TForm | undefined>();
const currentTypeOfForm = ref("All");
const currentStatus = ref("All");
const search = ref("");
const isSearching = ref(false);
const isClearingSearch = ref(false);

const actions = [
  {
    text: "Download",
    gate: $ability.can("create", "download-form-pdf"),
  },
  {
    text: "Delete",
    gate: $ability.can("delete", "delete-form"),
  },
];
const headers = computed(() => {
  return [
    {
      md: "3",
      title: "Type of Form",
      align: "left",
      visible: true,
    },
    {
      md: "2",
      title: "Submitted By",
      align: "left",
      visible: true,
    },
    {
      md: "2",
      title: "Unit No.",
      align: "left",
      visible: true,
    },
    {
      md: "2",
      title: "Date Submitted",
      align: "left",
      visible: true,
    },
    {
      md: "2",
      title: "Status",
      align: "left",
      visible: true,
    },
    {
      md: "1",
      title: "Action",
      align: "right",
      visible:
        $ability.can("create", "download-form-pdf") ||
        $ability.can("delete", "delete-form"),
    },
  ];
}) as unknown as {
  md: string;
  title: string;
  align: string;
  visible: boolean;
}[];

onMounted(async () => {
  await setItems({ site: mySite.value });
});

const onFilterTypeOfForm = async (type: string) => {
  isSearching.value = true;
  currentTypeOfForm.value = type;
  await getItems(currentStatus.value, currentTypeOfForm.value, search.value);
};

const onFilterStatus = async (status: string) => {
  isSearching.value = true;
  currentStatus.value = status;
  await getItems(currentStatus.value, currentTypeOfForm.value, search.value);
};

const onClearSearch = async () => {
  search.value = "";
  await getItems();
  isClearingSearch.value = true;
};

const onSearch = async (_search: string) => {
  isSearching.value = true;
  if (isClearingSearch.value) {
    // to avoid searching again
    isClearingSearch.value = false;
    return;
  }
  debouncedSearch(_search);
};

const debouncedSearch = debounce(async (value: string) => {
  page.value = 1;
  await getItems(currentStatus.value, currentTypeOfForm.value, value);
  isSearching.value = false;
}, 1000);

const getItems = async (
  status?: string,
  typeOfForm?: string,
  searchValue?: string,
) => {
  search.value = searchValue || "";
  items.value = [];
  await setItems({
    searchParam: search.value,
    filterStatus: currentStatus.value,
    filterType: currentTypeOfForm.value,
    site: mySite.value,
  });
  isSearching.value = false;
};

const onTableAction = async (item: TForm, action: string) => {
  const { _id } = item;
  const id = _id as string;
  currentForm.value = item;
  isActionLoading.value[id] = true;
  try {
    if (/^Download$/i.test(action)) {
      await onDownloadPdf(item);
    } else if (/^Delete$/i.test(action)) {
      isShowDeleteDialog.value = true;
    }
  } finally {
    isActionLoading.value[id] = false;
  }
};

const onDownloadPdf = async (item: TForm) => {
  const { _id, typeOfForm } = item;
  const id = _id as string;
  let currentUrl = "";
  if (typeOfForm === "Pet Records Form") {
    currentUrl = `/forms/${id}/download/pet-record?site=${mySite.value}`;
  } else if (
    typeOfForm === "Application for Renovation/Addition & Alteration Works"
  ) {
    currentUrl = `/forms/${id}/download/renovation?site=${mySite.value}`;
  } else if (typeOfForm === "Letter of Undertaking & Indemnity") {
    currentUrl = `/forms/${id}/download/loui?site=${mySite.value}`;
  } else if (typeOfForm === "Refund of Deposit") {
    currentUrl = `/forms/${id}/download/renovation-refund?site=${mySite.value}`;
  } else if (typeOfForm === "Application for Moving In/Out & Delivery") {
    currentUrl = `/forms/${id}/download/miod-record?site=${mySite.value}`;
  } else if (typeOfForm === "Application for Electronic Access Card") {
    currentUrl = `/forms/${id}/download/electronic-access-card?site=${mySite.value}`;
  } else if (typeOfForm === "Application for Bicycle Parking") {
    currentUrl = `/forms/${id}/download/bicycle-parking?site=${mySite.value}`;
  } else if (typeOfForm === "Vehicle Registration Form") {
    currentUrl = `/forms/${id}/download/vehicle-registration?site=${mySite.value}`;
  }
  await downloadDobPdf(currentUrl, typeOfForm);
};

const onDeleteItem = async (id: string) => {
  try {
    isDeleting.value = true;
    const confirmResult = await confirmPassword({
      user: currentUser.value._id,
      password: yourPassword.value,
    });
    if (confirmResult) {
      await deleteItem(id);
      await setItems({ site: mySite.value });
    }
  } catch (error: any) {
    setSnackbar({
      text: error.message || error || "Failed to confirm password!",
      type: "error",
      modal: true,
    });
  } finally {
    isDeleting.value = false;
    isShowDeleteDialog.value = false;
    yourPassword.value = "";
  }
};

const navigateToForm = (id: string, typeOfForm: string) => {
  if (typeOfForm === "Pet Records Form") {
    navigateTo({ name: "forms-id-view-pet-record", params: { id } });
  } else if (
    typeOfForm === "Application for Renovation/Addition & Alteration Works"
  ) {
    navigateTo({ name: "forms-id-view-renovation", params: { id } });
  } else if (typeOfForm === "Letter of Undertaking & Indemnity") {
    navigateTo({ name: "forms-id-view-loui", params: { id } });
  } else if (typeOfForm === "Refund of Deposit") {
    navigateTo({ name: "forms-id-view-refund-renovation", params: { id } });
  } else if (typeOfForm === "Application for Moving In/Out & Delivery") {
    navigateTo({ name: "forms-id-view-moving", params: { id } });
  } else if (typeOfForm === "Application for Electronic Access Card") {
    navigateTo({
      name: "forms-id-view-electronic-access-card",
      params: { id },
    });
  } else if (typeOfForm === "Application for Bicycle Parking") {
    navigateTo({ name: "forms-id-view-bicycle-parking", params: { id } });
  } else if (typeOfForm === "Vehicle Registration Form") {
    navigateTo({ name: "forms-id-view-vehicle-registration", params: { id } });
  }
};

const getColorForStatus = (status: string) => {
  return uiStatusColor(status);
};
</script>

<style>
.w-45 {
  width: 45%;
}
</style>
