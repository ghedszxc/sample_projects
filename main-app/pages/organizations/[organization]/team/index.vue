<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12" style="letter-spacing: 2px !important; font-size: 14px">
      <v-row no-gutters class="fill-height" align-content="center">
        <v-breadcrumbs class="pa-0" :items="nav">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
          <template #item="{ item }">
            <v-breadcrumbs-item :to="item.to">
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-row>
    </v-col>
    <v-col cols="12" class="mt-7">
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
            <v-row no-gutters>
              <v-col cols="12">
                <v-data-iterator :items="users" :items-per-page="itemsPerPage">
                  <template v-slot:header>
                    <v-row no-gutters class="pa-4">
                      <v-col cols="12">
                        <v-row no-gutters class="align-center">
                          <!-- heading -->
                          <v-col cols="12" lg="6">
                            <div class="d-flex align-center">
                              <span class="font-weight-bold text-h5 mr-4">
                                {{ organization.name }}
                              </span>
                            </div>
                          </v-col>
                          <v-spacer></v-spacer>
                          <v-col cols="3">
                            <v-btn
                              block
                              variant="outlined"
                              color="#1867C0"
                              size="small"
                              style="height: 40px"
                              @click="isShowPendingOrgDialog = true"
                            >
                              View Pending Invites
                            </v-btn>
                          </v-col>
                          <v-col cols="3" class="px-4">
                            <v-btn
                              v-if="$ability.can('create', 'create-teams')"
                              color="#1867C0"
                              @click="dialog = true"
                              block
                            >
                              Invite
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-divider></v-divider>
                  </template>

                  <!-- rows  -->
                  <template #default="{ items }">
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="item.raw._id"
                      >
                        <v-list-item class="py-4 px-8">
                          <v-list-item-title>
                            <v-row no-gutters>
                              <v-col
                                cols="12"
                                md="4"
                                class="text-capitalize white--text text"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <v-avatar
                                    size="small"
                                    :color="materialColors[itemIndex]"
                                    class="mr-5"
                                  >
                                    {{ getInitial(item.raw.givenName) }}
                                  </v-avatar>
                                  <span class="mt-1">
                                    {{ item.raw.givenName }}
                                    {{ item.raw.surname }}
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col cols="12" md="4" class="text my-1">
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <v-icon color="red" class="ml-1 mr-6">
                                    mdi-at
                                  </v-icon>
                                  {{ item.raw.email }}
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="3"
                                class="text text-capitalize"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <path
                                      d="M5.85 17.1C6.7 16.45 7.65 15.9375 8.7 15.5625C9.75 15.1875 10.85 15 12 15C13.15 15 14.25 15.1875 15.3 15.5625C16.35 15.9375 17.3 16.45 18.15 17.1C18.7333 16.4167 19.1875 15.6417 19.5125 14.775C19.8375 13.9083 20 12.9833 20 12C20 9.78333 19.2208 7.89583 17.6625 6.3375C16.1042 4.77917 14.2167 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 12.9833 4.1625 13.9083 4.4875 14.775C4.8125 15.6417 5.26667 16.4167 5.85 17.1ZM12 13C11.0167 13 10.1875 12.6625 9.5125 11.9875C8.8375 11.3125 8.5 10.4833 8.5 9.5C8.5 8.51667 8.8375 7.6875 9.5125 7.0125C10.1875 6.3375 11.0167 6 12 6C12.9833 6 13.8125 6.3375 14.4875 7.0125C15.1625 7.6875 15.5 8.51667 15.5 9.5C15.5 10.4833 15.1625 11.3125 14.4875 11.9875C13.8125 12.6625 12.9833 13 12 13ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C12.8833 20 13.7167 19.8708 14.5 19.6125C15.2833 19.3542 16 18.9833 16.65 18.5C16 18.0167 15.2833 17.6458 14.5 17.3875C13.7167 17.1292 12.8833 17 12 17C11.1167 17 10.2833 17.1292 9.5 17.3875C8.71667 17.6458 8 18.0167 7.35 18.5C8 18.9833 8.71667 19.3542 9.5 19.6125C10.2833 19.8708 11.1167 20 12 20ZM12 11C12.4333 11 12.7917 10.8583 13.075 10.575C13.3583 10.2917 13.5 9.93333 13.5 9.5C13.5 9.06667 13.3583 8.70833 13.075 8.425C12.7917 8.14167 12.4333 8 12 8C11.5667 8 11.2083 8.14167 10.925 8.425C10.6417 8.70833 10.5 9.06667 10.5 9.5C10.5 9.93333 10.6417 10.2917 10.925 10.575C11.2083 10.8583 11.5667 11 12 11Z"
                                      fill="#1867C0"
                                    />
                                  </svg>
                                </v-row>
                              </v-col>

                              <v-col cols="12" md="1" class="text-caption">
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  justify="end"
                                  align-content="center"
                                >
                                  <v-menu>
                                    <template v-slot:activator="{ props }">
                                      <v-icon density="compact" v-bind="props"
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
                        </v-list-item>
                        <v-divider
                          v-if="itemIndex + 1 !== items.length"
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
                @click="prevPage()"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="!canNextPage"
                @click="nextPage()"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <v-dialog
      v-model="dialog"
      transition="dialog-right-transition"
      fullscreen
      :style="{
        'margin-left': 'auto',
        'margin-right': '0',
        'max-width': '551px',
      }"
    >
      <v-card class="h-100">
        <v-toolbar>
          <v-btn icon="mdi-arrow-left" @click="dialog = false"></v-btn>
          <v-toolbar-title>Invite Team Member</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text>
          <v-row class="h-100 align-center">
            <v-form
              v-model="isInviteValid"
              @submit.prevent="submit()"
              class="w-100"
            >
              <v-col cols="12">
                <v-row class="justify-center mb-7">
                  <v-img
                    src="/images/organizations-organization-team-invite.svg"
                    width="190px"
                    height="190px"
                  ></v-img>
                </v-row>

                <v-responsive class="mx-auto">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Email <span class="text-red">*</span>
                  </div>
                  <v-text-field
                    v-model="user.email"
                    density="comfortable"
                    hint=""
                    placeholder="Enter email address"
                    :rules="[requiredInput, validEmail]"
                    :persistent-hint="false"
                  ></v-text-field>

                  <div class="text-subtitle-1 text-medium-emphasis">
                    Given Name <span class="text-red">*</span>
                  </div>
                  <v-text-field
                    v-model="user.givenName"
                    density="comfortable"
                    hint=""
                    placeholder="Enter given name"
                    :rules="[requiredInput]"
                    :persistent-hint="false"
                  ></v-text-field>

                  <div class="text-subtitle-1 text-medium-emphasis">
                    Given Surname <span class="text-red">*</span>
                  </div>
                  <v-text-field
                    v-model="user.surname"
                    density="comfortable"
                    hint=""
                    placeholder="Enter surname"
                    :rules="[requiredInput]"
                    :persistent-hint="false"
                  ></v-text-field>

                  <v-btn
                    color="#1867C0"
                    :disabled="!isInviteValid"
                    type="submit"
                    class="py-4 w-100 rounded-lg"
                    height="52px"
                  >
                    Send Invitation
                  </v-btn>
                </v-responsive>
              </v-col>
            </v-form>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <organizations-invites-table
      v-if="isShowPendingOrgDialog"
      :isConfirmModal="isShowPendingOrgDialog"
      @on-hide-dialog="isShowPendingOrgDialog = false"
    ></organizations-invites-table>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure", "organization"],
});
const { $ability } = useNuxtApp();
const dialog = ref(false);
const isShowPendingOrgDialog = ref(false);

const {
  setUser,
  user,
  users,
  isUsersLoaded,
  isInviteValid,
  setUsers,
  itemsPerPage,
  pageRange,
  canNextPage,
  canPrevPage,
  nextPage,
  prevPage,
} = useUser();

const { requiredInput, validEmail, getInitial, materialColors } = useUtils();

const { organization } = useOrganization();

const id = computed(() => useRoute().params.organization as string);
const { getSitesOptionsForFiltering, siteOptions, filterSite, mySite } =
  useFilter();

onMounted(async () => {
  setUser();
  users.value = [];
  setUsers({
    site: mySite.value,
    organization: id.value,
    type: "organization",
  });
});

const nav = computed(() => {
  return [
    {
      title: "Organizations",
      to: { name: "organizations" },
    },
    {
      title: organization.value.name,
      to: {
        name: "organizations-organization",
        params: { organization: id.value },
      },
    },
    {
      title: "Team",
    },
  ];
});

const actions = [
  {
    text: "View User",
    to: "organizations-organization-team-id",
    disabled: false,
    action: "read",
    subject: "view-teams",
  },
  {
    text: "Suspend User",
    to: "organizations-organization-team-id-suspend",
    disabled: false,
    action: "update",
    subject: "edit-teams",
  },
  {
    text: "Activate User",
    to: "organizations-organization-team-id-activate",
    disabled: false,
    action: "update",
    subject: "edit-teams",
  },
  {
    text: "Delete User",
    to: "organizations-organization-team-id-delete",
    disabled: false,
    action: "delete",
    subject: "delete-teams",
  },
];

const filteredActions = computed(() => {
  return actions.filter((action) =>
    $ability.can(action.action, action.subject),
  );
});

const { inviteUser } = useLocalAuth();
const { setSnackbar } = useLocal();

async function submit() {
  const data = {
    givenName: user.value.givenName,
    surname: user.value.surname,
    email: user.value.email,
    type: "organization",
    organization: id.value,
    sites: [],
    role: "",
  };

  try {
    const result = await inviteUser(data);
    setSnackbar({ text: result.message, modal: true, type: "success" });
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}
</script>
