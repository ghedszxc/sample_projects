<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <base-table
        table-name="Service Providers"
        :items="serviceProviders"
        :headers="headers"
        :itemPerPage="itemsPerPage"
        :pageRange="pageRange"
        :page="page"
        :pages="pages"
        :isLoading="isServiceProviderLoading"
        noDataMsg="You don't have any service provider yet."
        noDataImg="/empty.svg"
        @next-page="nextPage()"
        @prev-page="prevPage()"
        @on-search="onSearch($event)"
      >
        <template #headerActions>
          <v-row
            no-gutters
            justify="space-between"
            :style="$vuetify.display.md ? 'margin-top: 3rem' : ''"
          >
            <v-col cols="12" sm="6" md="5" lg="4" class="mt-2 ml-md-2 mt-lg-0">
              <v-btn
                variant="tonal"
                size="small"
                style="height: 40px"
                block
                @click="isShowPendingOrgDialog = true"
                ><v-icon class="mr-2">mdi-send-clock-outline</v-icon>
                View Pending Invites
              </v-btn>
            </v-col>

            <v-col cols="12" sm="6" lg="4" class="mt-2 mt-lg-0">
              <v-row class="d-flex justify-end align-center">
                <v-col cols="12" sm="11">
                  <v-btn
                    color="blue-darken-3"
                    block
                    variant="flat"
                    size="small"
                    style="height: 40px"
                    @click="isShowInviteServiceProviderDialog = true"
                  >
                    <v-icon class="mr-2">mdi-plus</v-icon>
                    Add Service Provider
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </template>
        <template #tableItems="{ items }">
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
                        <span class="d-inline-block text-truncate text-body-2">
                          <v-avatar size="x-small">
                            <v-avatar
                              size="large"
                              :color="materialColors[itemIndex]"
                            >
                              {{
                                getInitial(
                                  item.raw.name || item.raw.email || "",
                                )
                              }}
                            </v-avatar>
                          </v-avatar>

                          <span
                            class="ml-2 pt-1"
                            :style="{
                              maxWidth: $vuetify.display.mdAndUp
                                ? '150px'
                                : '200px',
                            }"
                          >
                            <span v-if="item.raw.name" class="text-capitalize">
                              {{ item.raw.name }}
                            </span>
                            <span v-else>{{ item.raw.email }}</span>
                            <span v-if="$vuetify.display.smAndUp"> - </span>
                            <span
                              class="text-capitalize"
                              v-if="$vuetify.display.smAndUp"
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
                      v-if="$vuetify.display.xs"
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
                          :class="
                            /^(active)$/i.test(item.raw.status || '')
                              ? 'text-green'
                              : 'text-red'
                          "
                        >
                          <v-icon size="small" class="mr-2">
                            mdi-account-badge-outline</v-icon
                          >
                          {{ item.raw.status }}
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
                          <v-icon size="small" class="mr-2">
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
                          <v-icon size="small" color="blue" class="mr-2">
                            mdi-map-marker-outline
                          </v-icon>
                          {{ (item.raw.sites && item.raw.sites.length) || 0 }}
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
                            <v-icon color="red" size="small" class="mr-2">
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
                        class="border-md pa-4 d-flex align-center justify-center"
                        style="position: absolute; right: 20px"
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>

                    <v-card>
                      <v-list class="pa-0" density="compact">
                        <template
                          v-for="(actionItem, actionIndex) in filteredActions"
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
                                /^active$/i.test(item.raw.status || '')) ||
                              (/^Assigned Role$/i.test(actionItem.text) &&
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
                                /^active$/i.test(item.raw.status || '')) ||
                              (/^Assigned Role$/i.test(actionItem.text) &&
                                /^inactive$/i.test(item.raw.status || ''))
                            "
                            @click="
                              actionItem.event && actionItem.event(item.raw)
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
      </base-table>
    </v-col>
    <service-providers-invites-table
      v-if="isShowPendingOrgDialog"
      :isConfirmModal="isShowPendingOrgDialog"
      @on-hide-dialog="isShowPendingOrgDialog = false"
    ></service-providers-invites-table>
    <service-providers-invites-add
      v-if="isShowInviteServiceProviderDialog"
      :isConfirmModal="isShowInviteServiceProviderDialog"
      @close-modal="isShowInviteServiceProviderDialog = false"
      @submit-data="submit($event)"
    >
    </service-providers-invites-add>

    <!-- dialogAssignRoles -->
    <dialog-role
      :isConfirmModal="dialogAssignRoles"
      :roleSet="selectedSP"
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
const {
  sendInviteLink,
  setServiceProvider,
  setServiceProviders,
  serviceProviders,
  page,
  pages,
  pageRange,
  search,
  nextPage,
  prevPage,
  itemsPerPage,
  isServiceProviderLoading,
} = useServiceProvider();

const { updateUserRole } = useUser();
const { currentUser } = useLocalAuth();
const { mySite, myOrg } = useFilter();
const { setRoles } = useRole();
const isShowPendingOrgDialog = ref(false);
const isShowInviteServiceProviderDialog = ref(false);

const dialogAssignRoles = ref(false);

const selectedSP = ref({});

function showRoleModal(item: any) {
  console.log("dialog called");
  selectedSP.value = item;
  dialogAssignRoles.value = true;
}
const actions = [
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
    subject: "create-service-providers",
  },
  {
    text: "Assigned Role",
    link: false,
    event: (value: any) => {
      showRoleModal(value);
    },
    action: "update",
    subject: "edit-service-providers",
  },
];

const headers = computed(() => {
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

const filteredActions = computed(() => {
  return actions.filter((action) =>
    $ability.can(action.action, action.subject),
  );
});

onMounted(async () => {
  setServiceProvider();
  await setServiceProviders();
  await setRoles({
    page: 1,
    limit: 10000,
    organization: currentUser.value.type === "admin" ? "" : myOrg.value,
    site: currentUser.value.type === "admin" ? "" : mySite.value,
    userId: currentUser.value.type === "admin" ? "" : currentUser.value._id,
  });
});

const submit = async (payload: any) => {
  try {
    const result = await sendInviteLink({
      email: payload.email,
      role: payload.role,
    });
    setSnackbar({ text: result, modal: true, type: "success" });
    isShowInviteServiceProviderDialog.value = false;
    await setServiceProviders();
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
};

async function onSearch(keywords: string) {
  search.value = keywords;
  page.value = 1; // reset when search keywords
  await setServiceProviders();
}

async function callItBack() {
  search.value = "";
  await setServiceProviders();
}

async function submitReassign(_role: any) {
  try {
    await updateUserRole({
      id: selectedSP.value.userId,
      role: _role._id,
    });
    setSnackbar({
      text: "Role updated successfully",
      modal: true,
      type: "success",
    });
    await setServiceProviders();
    dialogAssignRoles.value = false;
  } catch (error: any) {
    setSnackbar({ text: error.message, modal: true, type: "error" });
  }
}
</script>
