<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card width="100%" elevation="3" height="100%" :loading="isRoleLoading">
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-row no-gutters>
          <v-col cols="12" class="pa-4">
            <v-row no-gutters justify="space-between">
              <v-col cols="12">
                <v-row align="center">
                  <v-col
                    class="fill-height"
                    cols="12"
                    align-content="center"
                    no-gutters
                  >
                    <span class="text-h6 font-weight-bold">
                      Roles & Permissions
                    </span>
                  </v-col>
                  <v-col cols="12" md="5" lg="6">
                    <v-row no-gutters>
                      <v-col cols="12" sm="12" lg="6">
                        <v-text-field
                          v-model="search"
                          placeholder="Search"
                          hide-details
                          density="compact"
                          append-inner-icon="mdi-magnify"
                          clearable
                          @update:model-value="onSearch()"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" lg="3">
                    <v-select
                      v-model="type"
                      :items="roleTypes"
                      item-title="title"
                      item-value="value"
                      hide-details
                      density="compact"
                      menu-icon="mdi-chevron-down"
                      clearable
                      @update:model-value="onFilter(selectFilter)"
                    >
                    </v-select>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="3"
                    v-if="$ability.can('create', 'create-roles')"
                  >
                    <v-row no-gutters>
                      <v-btn
                        block
                        color="primary"
                        :to="{ name: 'roles-add' }"
                        class="mr-3 text-truncate white--text"
                      >
                        <span>Roles & Permissions</span>
                        <v-icon class="">mdi-cogs</v-icon>
                      </v-btn>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>

          <v-divider></v-divider>
          <v-row
            no-gutters
            class="pa-2 px-6 d-none d-sm-flex text-caption"
            align="center"
            col="12"
          >
            <v-col cols="3" sm="6" md="5" lg="3">
              <span class="font-weight-bold"> Name </span>
              <span
                class="font-weight-bold w-100"
                v-if="$vuetify.display.mdAndDown"
              >
                & Created by
              </span>
            </v-col>
            <v-col cols="3" v-if="$vuetify.display.lgAndUp">
              <span class="font-weight-bold"> Created By </span>
            </v-col>
            <v-col cols="3" sm="6" md="4" lg="3">
              <span class="font-weight-bold"> Role & Permission </span>
              <span
                class="font-weight-bold w-100"
                v-if="$vuetify.display.smAndDown"
              >
                / Date Created
              </span>
            </v-col>
            <v-col cols="2" lg="3" v-if="$vuetify.display.mdAndUp">
              <span class="font-weight-bold"> Date Created </span>
            </v-col>
          </v-row>
          <v-divider v-if="$vuetify.display.lgAndUp"></v-divider>
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <v-data-iterator :items="roles" :items-per-page="itemsPerPage">
                  <template #default="{ items }">
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="item.raw._id"
                      >
                        <v-list-item
                          :class="
                            $vuetify.display.smAndDown || $vuetify.display.md
                              ? 'py-2 border-md px-4 px-sm-2 rounded-lg mb-2 mx-2 my-2'
                              : 'py-1 px-2 mx-2 my-0 text-body-2'
                          "
                        >
                          <template #default>
                            <v-list-item-title>
                              <v-row no-gutters align="center">
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="5"
                                  lg="3"
                                  class="text-capitalize white--text text mb-2 mb-sm-0"
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
                                      >Role Name:
                                    </span>

                                    <span
                                      class="text-truncate mt-1 mr-lg-2"
                                      :style="
                                        $vuetify.display.xs
                                          ? 'font-size: .8rem;'
                                          : ''
                                      "
                                      :class="
                                        $vuetify.display.smAndUp
                                          ? 'text-body-2'
                                          : ''
                                      "
                                    >
                                      <v-icon class="mr-1" color="blue"
                                        >mdi-file-document</v-icon
                                      >
                                      {{ item.raw.roleName }}
                                    </span>
                                    <span
                                      class="text-truncate mt-1 w-100"
                                      :style="
                                        $vuetify.display.xs
                                          ? 'font-size: .8rem;'
                                          : ''
                                      "
                                      :class="
                                        $vuetify.display.smAndUp
                                          ? 'text-body-2'
                                          : ''
                                      "
                                      v-if="
                                        $vuetify.display.sm ||
                                        $vuetify.display.md
                                      "
                                    >
                                      <v-avatar
                                        size="x-small"
                                        :color="materialColors[itemIndex]"
                                        class="mr-1"
                                      >
                                        {{
                                          getInitial(
                                            item.raw.createdBy.split(" ")[0],
                                          )
                                        }}
                                      </v-avatar>
                                      {{ item.raw.createdBy }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  lg="3"
                                  class="text-capitalize white--text text mb-2 mb-sm-0"
                                  v-if="
                                    $vuetify.display.lgAndUp ||
                                    $vuetify.display.xs
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
                                    v-if="item.raw.createdBy"
                                  >
                                    <span
                                      class="mr-2 d-flex d-sm-none font-weight-bold"
                                      >Created by:
                                    </span>

                                    <span
                                      class="text-truncate mt-1 mr-lg-2"
                                      :style="
                                        $vuetify.display.xs
                                          ? 'font-size: .8rem;'
                                          : 'font-size: .9rem;'
                                      "
                                    >
                                      <v-avatar
                                        size="small"
                                        :color="materialColors[itemIndex]"
                                        class="mr-1"
                                      >
                                        {{
                                          getInitial(
                                            item.raw.createdBy.split(" ")[0],
                                          )
                                        }}
                                      </v-avatar>
                                      {{ item.raw.createdBy }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  sm="5"
                                  md="4"
                                  lg="3"
                                  class="text-capitalize white--text text mb-2 mb-sm-0"
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
                                      >Role:
                                    </span>
                                    <span
                                      :style="
                                        $vuetify.display.xs
                                          ? 'font-size: .8rem;'
                                          : 'font-size: .9rem;'
                                      "
                                    >
                                      <v-icon class="mr-1">mdi-account</v-icon>
                                      {{ item.raw.type }}
                                    </span>
                                    <span
                                      :style="
                                        $vuetify.display.xs
                                          ? 'font-size: .8rem;'
                                          : ''
                                      "
                                      :class="
                                        $vuetify.display.smAndUp
                                          ? 'text-body-2'
                                          : ''
                                      "
                                      v-if="$vuetify.display.sm"
                                      class="w-100 mt-sm-1 mr-lg-2 text-truncate"
                                    >
                                      <v-icon class="mr-1">mdi-calendar</v-icon>
                                      {{
                                        standardFormatDate(item.raw.createdAt)
                                      }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="2"
                                  class="text-capitalize white--text text my-1"
                                  v-if="
                                    $vuetify.display.mdAndUp ||
                                    $vuetify.display.xs
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
                                      >Date Created:
                                    </span>
                                    <span
                                      :style="
                                        $vuetify.display.xs
                                          ? 'font-size: .8rem;'
                                          : ''
                                      "
                                      :class="
                                        $vuetify.display.smAndUp
                                          ? 'text-body-2'
                                          : ''
                                      "
                                    >
                                      <v-icon class="mr-1">mdi-calendar</v-icon>
                                      {{
                                        standardFormatDate(item.raw.createdAt)
                                      }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="1"
                                  class="text-capitalize white--text text my-1"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height d-flex justify-end"
                                    align-content="center"
                                  >
                                    <v-menu>
                                      <template v-slot:activator="{ props }">
                                        <v-icon
                                          density="compact"
                                          v-bind="props"
                                          class="pa-4 rounded-xl border-md"
                                        >
                                          mdi-account-box-edit-outline
                                        </v-icon>
                                      </template>
                                      <v-list>
                                        <template
                                          v-for="(
                                            actionItem, actionIndex
                                          ) in filteredActions"
                                          :key="actionItem.text"
                                        >
                                          <v-list-item
                                            :to="{
                                              name: actionItem.to,
                                              params: {
                                                id: item.raw._id,
                                              },
                                            }"
                                            :disabled="actionItem.disabled"
                                          >
                                            <template #title>
                                              <span class="text-caption">
                                                {{ actionItem.text }}
                                              </span>
                                            </template>
                                          </v-list-item>

                                          <v-divider
                                            v-if="
                                              actionIndex + 1 !== actions.length
                                            "
                                          ></v-divider>
                                        </template>
                                      </v-list>
                                    </v-menu>
                                  </v-row>
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </template>
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
                            You don't have any roles set yet.
                          </span>
                        </v-row>
                      </v-col>
                    </v-row>
                  </template>
                </v-data-iterator>
              </v-col>
            </v-row>
          </v-col>

          <v-divider></v-divider>

          <v-col cols="12" class="pa-4">
            <v-row no-gutters justify="end" align-content="center">
              <span>{{ pageRange }}</span>
              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="canPrevPage"
                @click="onPrevPage()"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="!canNextPage"
                @click="onNextPage()"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

definePageMeta({
  middleware: ["secure"],
});
const { $ability } = useNuxtApp();
const { getInitial, materialColors, standardFormatDate } = useUtils();
const {
  setRole,
  roles,
  setRoles,
  pageRange,
  canNextPage,
  canPrevPage,
  nextPage,
  isRoleLoading,
  prevPage,
  page,
} = useRole();
const { getSitesOptionsForFiltering, mySite, myOrg, myProvider } = useFilter();
const { currentUser } = useLocalAuth();

const search = ref("");
const type = ref("");
const itemsPerPage = 10;
const actions = [
  {
    text: "View Role",
    to: "roles-id",
    disabled: false,
    action: "read",
    subject: "view-roles",
  },
  {
    text: "Delete Role",
    to: "roles-id-delete",
    disabled: false,
    action: "delete",
    subject: "delete-roles",
  },
];
const roleTypes = [
  {
    title: "Admin",
    value: "admin",
  },
  {
    title: "Managing Agency",
    value: "organization",
  },
  {
    title: "Site Personnel",
    value: "site",
  },
  {
    title: "Service Provider",
    value: "service-provider",
  },
  {
    title: "Service Provider Team Member",
    value: "service-provider-member",
  },
];

const filteredActions = computed(() => {
  return actions.filter((action) =>
    $ability.can(action.action, action.subject),
  );
});

onBeforeMount(async () => {
  roles.value = [];
});

onMounted(async () => {
  setRole();
  await getSitesOptionsForFiltering();
  await getAllRoles();
});

async function getAllRoles() {
  if (currentUser.value.isAdmin) {
    // seven365 admin, ma, site, spm & spt

    await setRoles({
      type: currentUser.value.type,
      site: myProvider.value ? "" : mySite.value,
      serviceProvider: myProvider.value,
      organization: mySite.value || myProvider.value ? "" : myOrg.value,
      search: search.value,
    });
  } else {
    if (currentUser.value.type === "admin") {
      // non admin
      await setRoles({
        search: search.value,
        type: type.value,
      });
    } else {
      // non admin
      await setRoles({
        type: currentUser.value.type,
        site: myProvider.value ? "" : mySite.value,
        organization: mySite.value || myProvider.value ? "" : myOrg.value,
        serviceProvider: myProvider.value,
        // userId: currentUser.value._id,
        search: search.value,
      });
    }
  }
}

async function onNextPage() {
  if (currentUser.value.isAdmin) {
    // seven365 admin, ma, site, spm & spt
    await nextPage({
      type: currentUser.value.type,
      site: mySite.value,
      serviceProvider: myProvider.value,
    });
  } else {
    if (currentUser.value.type === "admin") {
      // non admin
      await nextPage({
        search: search.value,
        type: type.value,
      });
    } else {
      // non admin
      await nextPage({
        type: currentUser.value.type,
        site: mySite.value,
        userId: currentUser.value._id,
      });
    }
  }
}

async function onPrevPage() {
  if (currentUser.value.isAdmin) {
    // seven365 admin, ma, site, spm & spt
    await prevPage({
      type: currentUser.value.type,
      site: mySite.value,
      serviceProvider: myProvider.value,
    });
  } else {
    if (currentUser.value.type === "admin") {
      // non admin
      await prevPage({
        search: search.value,
        type: type.value,
      });
    } else {
      // non admin
      await prevPage({
        type: currentUser.value.type,
        site: mySite.value,
        userId: currentUser.value._id,
      });
    }
  }
}

async function onSearch() {
  await debouncedSearch(search.value);
}

const debouncedSearch = debounce(async (value: string) => {
  page.value = 1;
  await getAllRoles();
}, 500);

async function onFilter() {
  page.value = 1;
  await getAllRoles();
}
</script>

<style scoped>
.my-custom-component ::v-deep(.v-field__outline) {
  border-bottom: 0.1px solid;
  width: 57%;
  margin-left: 16px;
}

::v-deep(.v-select .v-select__selection-text) {
  font-size: 16px;
}
</style>
