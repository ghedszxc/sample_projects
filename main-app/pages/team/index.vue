<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card width="100%" elevation="3" height="100%" :loading="isUsersLoaded">
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-row no-gutters>
          <v-col cols="12">
            <v-data-iterator :items="users" :items-per-page="itemsPerPage">
              <template v-slot:header>
                <v-row no-gutters class="pa-4">
                  <v-col cols="12">
                    <v-row no-gutters class="align-center">
                      <v-col cols="12" md="7" lg="6">
                        <div
                          class="d-flex flex-column flex-md-row align-md-center"
                        >
                          <span
                            class="font-weight-bold text-h6 mr-md-4 mb-2 mb-md-0"
                            >Team Members</span
                          >

                          <v-text-field
                            v-model="userSearch"
                            hide-details
                            density="compact"
                            placeholder="Search"
                            append-inner-icon="mdi-magnify"
                            class="flex-grow-1 mr-md-4 mb-2 mb-md-0"
                          ></v-text-field>
                        </div>
                      </v-col>

                      <v-spacer></v-spacer>
                      <v-col cols="12" sm="6" md="3" lg="4">
                        <v-row no-gutters>
                          <v-col cols="12" sm="11">
                            <v-btn
                              block
                              variant="tonal"
                              color="primary"
                              class="mb-2 mb-sm-0"
                              @click="isShowPendingInvite = true"
                            >
                              <span class="d-none d-lg-inline"
                                >View Pending Invited Members</span
                              >
                              <span class="mr-2 mr-lg-0 d-lg-none"
                                >Pending</span
                              >
                              <v-icon class="ml-md-2 ml-0"
                                >mdi-account-multiple-plus</v-icon
                              >
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="2"
                        v-if="$ability.can('create', 'create-teams')"
                      >
                        <v-btn
                          block
                          color="#1867C0"
                          @click="dialog = true"
                          class="mx-0 w-100 w-md-auto"
                        >
                          Invite
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row
                  no-gutters
                  class="pa-2 px-6 d-none d-sm-flex text-caption"
                  align="center"
                  col="12"
                >
                  <v-col cols="12" sm="6" md="5" lg="3">
                    <span class="font-weight-bold"> Name </span>
                    <span
                      class="font-weight-bold w-100"
                      v-if="$vuetify.display.mdAndDown"
                    >
                      & Email
                    </span>
                  </v-col>
                  <v-col cols="3" v-if="$vuetify.display.lgAndUp">
                    <span class="font-weight-bold"> Email </span>
                  </v-col>
                  <v-col cols="3" sm="5" md="4" lg="3">
                    <span class="font-weight-bold"> Role & Permission </span>
                    <span
                      class="font-weight-bold w-100"
                      v-if="$vuetify.display.smAndDown"
                    >
                      / Status
                    </span>
                  </v-col>
                  <v-col cols="12" sm="3" v-if="$vuetify.display.mdAndUp">
                    <span class="font-weight-bold"> Status </span>
                  </v-col>
                </v-row>
                <v-divider v-if="$vuetify.display.lgAndUp"></v-divider>
              </template>

              <!-- rows  -->
              <template #default="{ items }">
                <v-list class="pa-0">
                  <template
                    v-for="(item, itemIndex) in items"
                    :key="item.raw._id"
                  >
                    <v-list-item
                      :class="
                        $vuetify.display.smAndDown || $vuetify.display.md
                          ? 'py-2 border-md px-2 rounded-lg mb-2 mx-2 my-2'
                          : 'py-2 px-2 mx-2 my-0 text-body-2'
                      "
                    >
                      <v-list-item-title>
                        <v-row no-gutters align="center">
                          <v-col
                            cols="12"
                            sm="6"
                            md="5"
                            lg="3"
                            class="text-capitalize white--text text text-truncate mb-sm-0"
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
                                >Name:
                              </span>
                              <span
                                class="text-truncate mt-1 mr-sm-2"
                                :style="
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                                :class="
                                  $vuetify.display.smAndUp ? 'text-body-2' : ''
                                "
                              >
                                <v-avatar
                                  size="small"
                                  :color="materialColors[itemIndex]"
                                  class="mr-1"
                                >
                                  {{ getInitial(item.raw.givenName) }}
                                </v-avatar>
                                {{ item.raw.givenName }}
                                {{ item.raw.surname }}
                              </span>
                              <span
                                style="
                                  display: block;
                                  overflow: hidden;
                                  text-overflow: ellipsis;
                                  white-space: nowrap;
                                "
                                :style="
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                                :class="
                                  $vuetify.display.smAndUp
                                    ? 'text-body-2 mt-1 mt-lg-0 w-100'
                                    : ''
                                "
                                v-if="
                                  $vuetify.display.sm || $vuetify.display.md
                                "
                              >
                                <v-icon color="red" class="ml-1 mr-1">
                                  mdi-at
                                </v-icon>
                                {{ item.raw.email }}
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="3"
                            class="text my-1 text-truncate mb-2 mb-sm-0"
                            v-if="
                              $vuetify.display.lgAndUp || $vuetify.display.xs
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
                                class="mr-2 d-flex d-sm-none font-weight-bold"
                                >Email:
                              </span>

                              <span
                                style="
                                  display: block;
                                  overflow: hidden;
                                  text-overflow: ellipsis;
                                  white-space: nowrap;
                                "
                                :style="
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                                :class="
                                  $vuetify.display.smAndUp ? 'text-body-2' : ''
                                "
                              >
                                <v-icon color="red" class="mr-1">
                                  mdi-at
                                </v-icon>
                                {{ item.raw.email }}
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="5"
                            md="4"
                            lg="3"
                            class="text text-capitalize mb-2 mb-sm-0"
                          >
                            <v-row
                              no-gutters
                              class="fill-height text-truncate mr-sm-2"
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
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                                :class="
                                  $vuetify.display.smAndUp ? 'text-body-2' : ''
                                "
                                class="mr-sm-2 text-truncate mt-sm-1 mt-md-0"
                              >
                                <v-icon color="blue" class="mr-1">
                                  mdi-account-cog-outline
                                </v-icon>
                                <span v-if="item.raw.isAdmin"
                                  >Administrator-</span
                                >
                                <span class="text-truncate mr-sm-2">{{
                                  item.raw.role?.roleName
                                }}</span>
                              </span>
                              <span
                                class="w-100 mt-1"
                                v-if="$vuetify.display.sm"
                              >
                                <v-chip>
                                  <v-icon
                                    class="mr-1"
                                    :color="
                                      /^suspended$/i.test(item.raw.status || '')
                                        ? 'red'
                                        : 'green'
                                    "
                                  >
                                    mdi-power
                                  </v-icon>
                                  {{ item.raw.status || "N/A" }}
                                </v-chip>
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="2"
                            class="text text-capitalize"
                            v-if="
                              $vuetify.display.mdAndUp || $vuetify.display.xs
                            "
                          >
                            <v-row
                              no-gutters
                              :class="
                                /^suspended$/i.test(item.raw.status || '')
                                  ? 'text-red'
                                  : 'text-green'
                              "
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
                                >Status:
                              </span>
                              <v-chip>
                                <v-icon
                                  class="mr-1"
                                  :color="
                                    /^suspended$/i.test(item.raw.status || '')
                                      ? 'red'
                                      : 'green'
                                  "
                                >
                                  mdi-power
                                </v-icon>
                                {{ item.raw.status || "N/A" }}
                              </v-chip>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="1"
                            class="text-caption mt-2 mt-md-0"
                            v-if="!item.raw.isAdmin"
                          >
                            <v-row
                              no-gutters
                              class="fill-height"
                              justify="end"
                              align-content="center"
                            >
                              <v-menu>
                                <template v-slot:activator="{ props }">
                                  <v-icon
                                    density="compact"
                                    v-bind="props"
                                    class="border-md rounded-xl pa-4"
                                    >mdi-dots-vertical</v-icon
                                  >
                                </template>
                                <v-list>
                                  <template
                                    v-for="(
                                      actionItem, actionIndex
                                    ) in filteredActions"
                                    :key="actionItem.text"
                                  >
                                    {{ userStatus(item.raw.status) }}
                                    <v-list-item
                                      v-if="actionItem.link"
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

                                    <v-list-item
                                      v-else
                                      class="text-center"
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
                              </v-menu>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-list-item-title>
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

              <!-- row without data -->
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
                        You don't have any team member yet.
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

    <!-- dialogAssignRoles -->
    <dialog-role
      :isConfirmModal="dialogAssignRoles"
      :roleSet="selectedTeam"
      @close-modal="dialogAssignRoles = false"
      @confirm-select="submitReassign($event)"
    ></dialog-role>

    <team-invite
      :isConfirmModal="dialog"
      @close-modal="dialog = false"
      @submit="submit($event)"
    />

    <team-invite-message
      :isConfirmModal="confirmMsg"
      :isConfirmTitle="`We sent an email to join your team to <a href='#'>${user.email}</a>`"
      @close-modal="confirmMsg = false"
    />

    <team-pending
      v-if="isShowPendingInvite"
      :isConfirmModal="isShowPendingInvite"
      @on-hide-dialog="isShowPendingInvite = false"
    />
  </v-row>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

definePageMeta({
  middleware: ["secure", "role"],
});
const { $ability } = useNuxtApp();
const dialog = ref(false);
const dialogAssignRoles = ref(false);
const confirmMsg = ref(false);

const { setRole } = useRole();
const {
  setUser,
  user,
  users,
  isUsersLoaded,
  setUsers,
  search: userSearch,
  itemsPerPage,
  pageRange,
  canNextPage,
  canPrevPage,
  nextPage,
  prevPage,
  page,
  updateUserRole,
} = useUser();
const { inviteUser, currentUser } = useLocalAuth();
const { getInitial, materialColors } = useUtils();
const { getSitesOptionsForFiltering, mySite, myOrg, myProvider } = useFilter();
const { setSnackbar } = useLocal();

const isShowPendingInvite = ref(false);
const selectUser = ref("");
const actions = [
  {
    text: "Assigned Role",
    link: false,
    event: (value: any) => {
      showRoleModal(value);
    },
    action: "update",
    subject: "edit-teams",
  },
  {
    text: "View User",
    link: true,
    to: "team-id",
    disabled: false,
    action: "read",
    subject: "view-teams",
  },
  {
    text: "Suspend User",
    link: true,
    to: "team-id-suspend",
    disabled: false,
    action: "update",
    subject: "edit-teams",
  },
  {
    text: "Activate User",
    link: true,
    to: "team-id-activate",
    disabled: false,
    action: "update",
    subject: "edit-teams",
  },
  {
    text: "Delete User",
    link: true,
    to: "team-id-delete",
    disabled: false,
    action: "delete",
    subject: "delete-teams",
  },
];

onMounted(async () => {
  setUser();
  setRole();
  users.value = [];
  await getSitesOptionsForFiltering();
  await getUsers();
});

const userStatus = (status: string) => {
  selectUser.value = status;
};

const filteredActions = computed(() => {
  const isActive = selectUser.value === "active";

  return actions.filter((action) => {
    if (action.text === "Activate User") {
      return !isActive;
    }
    if (action.text === "Suspend User") {
      return isActive;
    }
    return $ability.can(action.action, action.subject);
  });
});

const debouncedSearch = debounce(async (value: string) => {
  await getUsers(value);
}, 500);

watch(userSearch, (newValue, oldValue) => {
  debouncedSearch(newValue);
});

async function getUsers(searchQuery = "") {
  page.value = 1;
  await setUsers({
    search: searchQuery,
    type: currentUser.value.type,
    organization: currentUser.value.type === "organization" ? myOrg.value : "",
    site: mySite.value,
    serviceProvider: /^(service-provider|servicer-provider-member)$/i.test(
      currentUser.value.type,
    )
      ? myProvider.value
      : "",
  });
}

async function submit(_user: any) {
  try {
    await inviteUser({
      givenName: user.value.givenName,
      surname: user.value.surname,
      email: user.value.email,
      role: user.value.role,
      type: currentUser.value.type,
      organization: myOrg.value,
      site: mySite.value,
      serviceProvider: myProvider.value,
      isAdmin: false,
    });
    dialog.value = false;
    confirmMsg.value = true;
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}

const selectedTeam = ref({});
function showRoleModal(item: any) {
  selectedTeam.value = item;
  dialogAssignRoles.value = true;
}

async function submitReassign(_role: any) {
  try {
    await updateUserRole({
      id: selectedTeam.value._id,
      role: _role._id,
    });
    setSnackbar({
      text: "Role updated successfully",
      modal: true,
      type: "success",
    });
    await getUsers();
    dialogAssignRoles.value = false;
  } catch (error: any) {
    setSnackbar({ text: error.message, modal: true, type: "error" });
  }
}

async function onPrevPage() {
  prevPage({
    type: currentUser.value.type,
    organization: currentUser.value.type === "organization" ? myOrg.value : "",
    site: mySite.value,
    serviceProvider: /^(service-provider|servicer-provider-member)$/i.test(
      currentUser.value.type,
    )
      ? myProvider.value
      : "",
  });
}

async function onNextPage() {
  nextPage({
    type: currentUser.value.type,
    organization: currentUser.value.type === "organization" ? myOrg.value : "",
    site: mySite.value,
    serviceProvider: /^(service-provider|servicer-provider-member)$/i.test(
      currentUser.value.type,
    )
      ? myProvider.value
      : "",
  });
}
</script>
