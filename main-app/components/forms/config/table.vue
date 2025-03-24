<template>
  <BaseTable
    table-name="Configure Forms"
    :items="configForms"
    :elevation="0"
    :headers="headers"
    :itemPerPage="itemsPerPage"
    :pageRange="pageRange"
    :page="page"
    :pages="pages"
    :isLoading="isLoading"
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
              Configure Forms
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
            :class="$vuetify.display.lgAndUp ? '' : 'px-0 py-2'"
          >
            <v-btn
              v-if="$ability.can('read', 'view-all-available-forms-config')"
              color="primary"
              @click="isShowAllAvailableForms = true"
            >
              All Available Forms
            </v-btn>
            <!-- Delete Confirmation -->
            <v-dialog v-model="isShowAllAvailableForms" width="600" persistent>
              <v-card class="pa-5">
                <div class="text-h4 font-weight-bold pl-3 pb-5">
                  All Available Forms
                </div>
                <div class="pl-5">
                  <v-row
                    v-for="(item, itemIndex) in availableForms"
                    :key="itemIndex"
                  >
                    <v-col class="pa-1" cols="auto">
                      <li>{{ item.typeOfForm }}</li>
                    </v-col>
                    <v-col class="pa-1" cols="auto">
                      <v-btn
                        density="compact"
                        icon="mdi-plus"
                        color="green"
                        @click="onAddSelectedItem(item)"
                      ></v-btn>
                    </v-col>
                  </v-row>
                </div>
                <div class="pl-3 pt-3 text-h6 font-weight-bold">
                  <div>
                    Selected Forms:
                    <v-btn
                      color="#EB261E"
                      class="text-caption mb-1"
                      size="small"
                      :disabled="addItems.length === 0"
                      @click="addItems = []"
                    >
                      Clear
                    </v-btn>
                  </div>
                  <v-chip
                    v-for="(item, itemIndex) in addItems"
                    :key="item._id"
                    class="ma-1"
                    color="primary"
                    variant="outlined"
                    closable
                    @click:close="onRemoveSelectedItem(item)"
                  >
                    {{ item.typeOfForm }}
                  </v-chip>
                </div>

                <template v-slot:actions>
                  <v-spacer></v-spacer>
                  <v-col cols="12" class="pa-0 py-3">
                    <v-row no-gutters>
                      <v-col cols="6" class="pr-2">
                        <v-btn
                          class="w-100"
                          variant="outlined"
                          @click="onHideDialog"
                        >
                          Cancel
                        </v-btn>
                      </v-col>

                      <v-col cols="6" class="pl-2">
                        <v-btn
                          class="bg-primary w-100"
                          :loading="isAddFormLoading"
                          @click="onAddForms"
                        >
                          Add
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </template>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-col>
      <v-divider></v-divider>
    </template>

    <template #tableItems="{ items }">
      <v-list class="pa-0">
        <template v-for="(item, itemIndex) in items" :key="itemIndex">
          <v-list-item class="py-4">
            <v-list-item-title>
              <v-row no-gutters class="align-center">
                <v-col
                  cols="12"
                  md="6"
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
                      >Date Submitted:
                    </span>

                    <span class="d-inline-block text-truncate">
                      {{ formatStandardDate(item.raw.createdAt || "") }}
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
                            Array.isArray(item.raw.isActivate) &&
                              item.raw.isActivate.length !== 0
                              ? item.raw.isActivate.find(
                                  (stat) => stat.site === mySite,
                                )?.isActivate || null
                              : item.raw.isActivate,
                          )
                        "
                        class="px-10 font-weight-bold"
                      >
                        <span
                          class="text-truncate text-center"
                          style="min-width: 70px"
                        >
                          {{
                            item.raw.isActivate ? "Activated" : "Deactivated"
                          }}
                        </span>
                      </v-chip>
                    </span>
                  </v-row>
                </v-col>

                <v-col
                  v-if="$ability.can('update', 'configure-form')"
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
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
const { $ability } = useNuxtApp();

const { isLoading } = usePetRecords();
const {
  items: availableForms,
  page,
  pages,
  itemsPerPage,
  pageRange,
  nextPage,
  prevPage,
  setItems,
} = useConfigForms();
const { formatStandardDate, uiStatusColor, jsonItem } = useUtils();
const { mySite } = useFilter();
const { setSnackbar } = useLocal();
const { createSelectedForms, getAllSelectedForms, siteSetting, configForms } =
  useSiteSettings();

const isActionLoading = ref<Record<string, boolean>>({});
const isShowAllAvailableForms = ref(false);
const isAddFormLoading = ref(false);
const currentForm = ref<TConfigForms | undefined>();
const addItems = ref<TConfigForms[]>([]);

const actions = [
  // {
  //   text: "Activate",
  //   gate: $ability.can("update", "activate-form-status-config-form"),
  // },
  // {
  //   text: "Deactivate",
  //   gate: $ability.can("update", "deactivate-form-status-config-form"),
  // },
  {
    text: "Configure Form",
    gate: $ability.can("update", "configure-form"),
  },
];
const headers = computed(() => {
  return [
    {
      md: "6",
      title: "Type of Form",
      align: "left",
      visible: true,
    },
    {
      md: "3",
      title: "Date Created",
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
  await Promise.all([getAllSelectedForms(mySite.value), setItems()]);
  addItems.value = jsonItem(configForms.value);
});

const onSearch = async (search: string) => {
  await setItems({
    site: mySite.value,
    searchParam: search,
  });
};

const onClearSearch = async () => {
  await setItems({
    site: mySite.value,
  });
};

const onAddSelectedItem = (item: TConfigForms) => {
  const isAlreadyExist = addItems.value.some(
    (i) => i.typeOfForm === item.typeOfForm,
  );
  if (isAlreadyExist) return;
  addItems.value.push(item);
};

const onRemoveSelectedItem = (item: TConfigForms) => {
  const index = addItems.value.findIndex(
    (i) => i.typeOfForm === item.typeOfForm,
  );
  if (index !== -1) {
    addItems.value.splice(index, 1); // Removes one element at the found index
  }
};

const onAddForms = async () => {
  try {
    isAddFormLoading.value = true;
    await createSelectedForms(mySite.value, addItems.value);
    setSnackbar({
      text: "All forms successfully added!",
      modal: true,
      type: "success",
    });
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  } finally {
    isAddFormLoading.value = false;
    isShowAllAvailableForms.value = false;
    await getAllSelectedForms(mySite.value);
  }
};

const onHideDialog = () => {
  isShowAllAvailableForms.value = false;
  if (configForms.value.length === 0) {
    addItems.value = [];
  }
};

const onTableAction = async (item: TConfigForms, action: string) => {
  const { _id } = item;
  const id = _id as string;
  currentForm.value = item;
  isActionLoading.value[id] = true;
  try {
    if (/^Configure Form$/i.test(action)) {
      // route
      if (item.typeOfForm && /Pet Record/i.test(item.typeOfForm)) {
        navigateTo({
          name: "forms-id-configure-pet-record",
          params: { id: item._id },
        });
      } else if (item.typeOfForm && /Renovation Form/i.test(item.typeOfForm)) {
        navigateTo({
          name: "forms-id-configure-renovation",
          params: { id: item._id },
        });
      } else if (
        item.typeOfForm &&
        /Letter of Undertaking/i.test(item.typeOfForm)
      ) {
        navigateTo({
          name: "forms-id-configure-loui",
          params: { id: item._id },
        });
      } else if (
        item.typeOfForm &&
        /Renovation Refund Form/i.test(item.typeOfForm)
      ) {
        navigateTo({
          name: "forms-id-configure-refund-renovation",
          params: { id: item._id },
        });
      } else if (
        item.typeOfForm &&
        /Application for Moving In/i.test(item.typeOfForm)
      ) {
        navigateTo({
          name: "forms-id-configure-moving",
          params: { id: item._id },
        });
      } else if (
        item.typeOfForm &&
        /Application for Electronic Access Card/i.test(item.typeOfForm)
      ) {
        navigateTo({
          name: "forms-id-configure-electronic-access-card",
          params: { id: item._id },
        });
      } else if (
        item.typeOfForm &&
        /Application for Bicycle Parking/i.test(item.typeOfForm)
      ) {
        navigateTo({
          name: "forms-id-configure-bicycle-parking",
          params: { id: item._id },
        });
      } else if (
        item.typeOfForm &&
        /Vehicle Registration Form/i.test(item.typeOfForm)
      ) {
        navigateTo({
          name: "forms-id-configure-vehicle-registration",
          params: { id: item._id },
        });
      }
    }
  } finally {
    isActionLoading.value[id] = false;
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
