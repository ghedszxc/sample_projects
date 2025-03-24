<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <g-card :loading="isOrganizationLoading">
        <v-row no-gutters>
          <v-col cols="12" :style="{ minHeight: '74vh' }">
            <v-data-iterator :items="organizations" :items-per-page="pageLimit">
              <template v-slot:header>
                <v-row no-gutters class="pa-4" justify="space-between">
                  <v-col cols="12" md="6">
                    <div class="d-flex align-center">
                      <span class="font-weight-bold text-h5 mr-4">
                        Organizations
                      </span>

                      <search-text-field
                        v-if="$vuetify.display.mdAndUp"
                        @on-search="onSearch($event)"
                        @clear-search="callItBack"
                      ></search-text-field>

                      <v-btn
                        v-if="$vuetify.display.mdAndUp"
                        variant="outlined"
                        color="#1867C0"
                        class="mx-3"
                        size="small"
                        style="height: 40px"
                        @click="isShowPendingOrgDialog = true"
                      >
                        View Pending Invites
                      </v-btn>
                    </div>
                  </v-col>

                  <v-col cols="12" v-if="$vuetify.display.smAndDown">
                    <search-text-field
                      class="mt-3"
                      @on-search="onSearch($event)"
                      @clear-search="callItBack"
                    ></search-text-field>
                  </v-col>

                  <v-col cols="12" v-if="$vuetify.display.smAndDown">
                    <v-btn
                      block
                      variant="outlined"
                      color="#1867C0"
                      class="mt-4"
                      size="small"
                      style="height: 40px"
                      @click="isShowPendingOrgDialog = true"
                    >
                      View Pending Invites
                    </v-btn>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-row align="center" justify="end">
                      <v-col
                        cols="12"
                        md="5"
                        :class="{ 'mb-5 mt-3': $vuetify.display.smAndDown }"
                      >
                        <v-btn
                          v-if="$ability.can('create', 'create-organizations')"
                          color="blue-darken-3"
                          block
                          variant="flat"
                          size="small"
                          style="height: 40px"
                          :to="{ name: 'organizations-add' }"
                        >
                          Add Organization
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-list
                  class="pa-0"
                  density="compact"
                  v-if="$vuetify.display.mdAndUp"
                >
                  <v-list-item class="pt-4 px-8">
                    <v-list-item-title>
                      <v-row no-gutters>
                        <v-col cols="12" md="5">
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                            >
                              Name
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
                              class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                            >
                              Members
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
                              class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                            >
                              Sites
                            </span>
                          </v-row>
                        </v-col>

                        <v-col cols="12" md="3">
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                            >
                              Email
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
                  <template v-for="(item, itemIndex) in items" :key="itemIndex">
                    <v-list-item class="pt-2 pb-1 px-8">
                      <v-list-item-title>
                        <v-row no-gutters>
                          <v-col
                            cols="12"
                            md="5"
                            :class="`text ${
                              $vuetify.display.mdAndUp ? 'my-1' : 'mb-2 mt-2'
                            }`"
                          >
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                            >
                              <span
                                class="d-inline-block text-truncate text-capitalize text-body-2"
                              >
                                <v-avatar size="x-small">
                                  <template
                                    v-if="
                                      item.raw.logo &&
                                      item.raw.name &&
                                      item.raw.logo.id
                                    "
                                  >
                                    <v-img
                                      :src="`/api/files/${item.raw.logo?.id}`"
                                    />
                                  </template>
                                  <template v-else>
                                    <v-avatar
                                      size="small"
                                      :color="materialColors[itemIndex]"
                                    >
                                      {{ getInitial(item.raw.name) }}
                                    </v-avatar>
                                  </template>
                                </v-avatar>

                                <span
                                  class="ml-5 pt-1"
                                  :style="{
                                    maxWidth: $vuetify.display.mdAndUp
                                      ? '150px'
                                      : '200px',
                                  }"
                                  >{{ item.raw.name }} -
                                  <span
                                    :class="
                                      /^(active)$/i.test(item.raw.status || '')
                                        ? 'text-green'
                                        : 'text-red'
                                    "
                                    >{{ item.raw.status }}</span
                                  ></span
                                >
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            md="2"
                            :class="`text ${
                              $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                            }`"
                          >
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                            >
                              <span
                                class="d-inline-block text-truncate text-capitalize text-body-2"
                              >
                                <v-icon size="small" class="mr-6">
                                  mdi-account-group</v-icon
                                >
                                {{ item.raw.members || 0 }}
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            md="2"
                            :class="`text ${
                              $vuetify.display.mdAndUp
                                ? 'my-1'
                                : item.raw.email
                                  ? 'mb-2'
                                  : ''
                            }`"
                          >
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                            >
                              <span
                                class="d-inline-block text-truncate text-capitalize text-body-2"
                              >
                                <v-icon size="small" color="blue" class="mr-6">
                                  mdi-map-marker-outline
                                </v-icon>
                                {{
                                  (item.raw.sites && item.raw.sites.length) || 0
                                }}
                              </span>
                            </v-row>
                          </v-col>

                          <v-col cols="12" md="3" class="text text-capitalize">
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                            >
                              <v-col cols="12">
                                <span
                                  class="d-inline-block text-truncate text-body-2"
                                >
                                  <v-icon color="red" size="small" class="mr-6">
                                    mdi-at
                                  </v-icon>
                                  <span
                                    :style="{
                                      maxWidth: $vuetify.display.lgAndUp
                                        ? '180px'
                                        : '160px',
                                    }"
                                  >
                                    {{ item.raw.email }}
                                  </span>
                                </span>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-list-item-title>

                      <template v-slot:append>
                        <v-menu location="bottom">
                          <template #activator="{ props }">
                            <v-btn
                              v-bind="props"
                              icon
                              flat
                              size="x-small"
                              style="position: absolute; right: 20px"
                            >
                              <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>

                          <v-card>
                            <v-list class="pa-0" density="compact">
                              <template
                                v-for="(
                                  actionItem, actionIndex
                                ) in filteredActions"
                                :key="actionItem.text"
                              >
                                <v-list-item
                                  v-if="actionItem.link"
                                  style="min-width: 150px"
                                  class="text-center"
                                  :to="{
                                    name: actionItem.to,
                                    params: {
                                      organization: item.raw._id,
                                    },
                                  }"
                                  :disabled="
                                    (/^Resend Invite$/i.test(actionItem.text) &&
                                      /^active$/i.test(
                                        item.raw.status || '',
                                      )) ||
                                    (/^assigned role$/i.test(actionItem.text) &&
                                      /^inactive$/i.test(item.raw.status || ''))
                                  "
                                >
                                  <template #title>
                                    <span class="text-caption">
                                      {{ actionItem.text }}
                                    </span>
                                  </template>
                                </v-list-item>

                                <v-list-item
                                  v-else
                                  style="min-width: 150px"
                                  class="text-center"
                                  :disabled="
                                    (/^Resend Invite$/i.test(actionItem.text) &&
                                      /^active$/i.test(
                                        item.raw.status || '',
                                      )) ||
                                    (/^assigned role$/i.test(actionItem.text) &&
                                      /^inactive$/i.test(item.raw.status || ''))
                                  "
                                  @click="
                                    actionItem.event &&
                                    actionItem.event(item.raw)
                                  "
                                >
                                  <template #title>
                                    <span class="text-caption">
                                      {{ actionItem.text }}
                                    </span>
                                  </template>
                                </v-list-item>
                                <v-divider
                                  v-if="actionIndex + 1 !== actions.length"
                                ></v-divider>
                              </template>
                            </v-list>
                          </v-card>
                        </v-menu>
                      </template>
                    </v-list-item>

                    <v-divider v-if="itemIndex + 1 !== items.length" />
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
                        You don't have any organization yet.
                      </span>
                    </v-row>
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>
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
                :disabled="page === 1"
                @click="prevPage()"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="page >= pages"
                @click="nextPage()"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </g-card>
    </v-col>
    <organizations-invites-table
      v-if="isShowPendingOrgDialog"
      :isConfirmModal="isShowPendingOrgDialog"
      @on-hide-dialog="isShowPendingOrgDialog = false"
    ></organizations-invites-table>
    <dialog-role
      :isConfirmModal="dialogAssignRoles"
      :roleSet="selectedOrg"
      @close-modal="dialogAssignRoles = false"
      @confirm-select="submitReassign($event)"
    ></dialog-role>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure", "role"],
});
const { $ability } = useNuxtApp();
const { setSnackbar } = useLocal();
const { getInitial, materialColors } = useUtils();
const { resendVerificationEmail } = useVerificationInvites();
const { updateUserRole } = useUser();
const isShowPendingOrgDialog = ref(false);
const dialogAssignRoles = ref(false);

const selectedOrg = ref({});

function showRoleModal(item: any) {
  console.log("dialog called");
  selectedOrg.value = item;
  dialogAssignRoles.value = true;
}

const columnHeader = computed(() => {
  return [
    {
      md: "5",
      title: "Name",
      align: "left",
      visible: true,
    },
    {
      md: "2",
      title: "Members",
      align: "left",
      visible: true,
    },
    {
      md: "2",
      title: "Sites",
      align: "left",
      visible: true,
    },
    {
      md: "3",
      title: "Email",
      align: "left",
      visible: true,
    },
  ];
}) as unknown as {
  md: string;
  title: string;
  align: string;
  visible: boolean;
}[];

const actions = [
  {
    text: "View Organization",
    to: "organizations-organization",
    link: true,
    action: "read",
    subject: "view-organizations",
  },
  {
    text: "Resend Invite",
    link: false,
    event: async (value: TOrganization) => {
      try {
        if (!value.email) throw new Error("No email available to resend");
        const response = await resendVerificationEmail(value.email);
        if (response) {
          setSnackbar({
            modal: true,
            text: "Successfully Resend email invitation.",
          });
        } else {
          setSnackbar({
            modal: true,
            text: "UnSuccessfully send a invitation again.",
            type: "error",
          });
        }
      } catch (error: any) {
        setSnackbar({
          modal: true,
          text: error || error.message,
          type: "error",
        });
      }
    },
    action: "create",
    subject: "create-organizations",
  },
  {
    text: "Assigned Role",
    link: false,
    event: (value: any) => {
      showRoleModal(value);
    },
    action: "update",
    subject: "edit-organizations",
  },
  {
    text: "Delete Organization",
    to: "organizations-organization-delete",
    link: true,
    action: "delete",
    subject: "delete-organizations",
  },
];

const filteredActions = computed(() => {
  return actions.filter((action) =>
    $ability.can(action.action, action.subject),
  );
});
const {
  setOrganization,
  setOrganizations,
  organizations,
  page,
  pages,
  pageRange,
  search,
  nextPage,
  prevPage,
  pageLimit,
  isOrganizationLoading,
} = useOrganization();
const { currentUser } = useLocalAuth();
const { setRoles } = useRole();
const { mySite, myOrg } = useFilter();

onMounted(async () => {
  setOrganization();
  await setOrganizations({
    searchKeyword: "",
    createdBy: ["service-provider", "site"].includes(currentUser.value.type)
      ? currentUser.value._id
      : "",
  });
  await setRoles({
    page: 1,
    limit: 10000,
    organization: currentUser.value.type === "admin" ? "" : myOrg.value,
    site: currentUser.value.type === "admin" ? "" : mySite.value,
    userId: currentUser.value.type === "admin" ? "" : currentUser.value._id,
  });
});

async function onSearch(keywords: string) {
  search.value = keywords;
  page.value = 1; // reset when search keywords
  await setOrganizations({
    searchKeyword: search.value,
    createdBy: ["service-provider", "site"].includes(currentUser.value.type)
      ? currentUser.value._id
      : "",
  });
}

async function callItBack() {
  search.value = "";
  await setOrganizations({
    searchKeyword: search.value,
    createdBy: ["service-provider", "site"].includes(currentUser.value.type)
      ? currentUser.value._id
      : "",
  });
}

async function submitReassign(_role: any) {
  console.log("🚀 ~ submitReassign ~ _role:", _role);
  console.log("🚀 ~ Selected Org ~ _role:", selectedOrg.value);
  try {
    await updateUserRole({
      id: selectedOrg.value.userId,
      role: _role._id,
    });
    setSnackbar({
      text: "Role updated successfully",
      modal: true,
      type: "success",
    });
    await setOrganizations({
      searchKeyword: "",
      createdBy: ["service-provider", "site"].includes(currentUser.value.type)
        ? currentUser.value._id
        : "",
    });
    dialogAssignRoles.value = false;
  } catch (error: any) {
    setSnackbar({ text: error.message, modal: true, type: "error" });
  }
}
</script>
