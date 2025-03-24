<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <base-table
        table-name="Sites"
        :items="selectedOrgSites"
        :headers="headers"
        :itemPerPage="10"
        :pageRange="selectedOrgSitesPageRange"
        :page="page"
        :pages="selectedOrgSitesPages"
        :isLoading="isSiteLoading"
        noDataMsg="You don't have any site team member yet."
        noDataImg="/empty.svg"
        @next-page="onNext()"
        @prev-page="onPrev()"
        @on-search="onSearch($event)"
        @on-clear="onClear()"
      >
        <template #headerActions>
          <v-col
            cols="12"
            md="4"
            lg="2"
            class="mt-md-14 mt-lg-0"
            v-if="
              $ability.can('create', 'create-sites') ||
              $ability.can('create', 'create-organizations')
            "
          >
            <v-row no-gutters justify="end">
              <v-btn
                block
                color="#1867C0"
                @click="dialogInvite = true"
                class="mt-2 w-100 mt-md-0 w-md-auto"
              >
                Add Site
              </v-btn>
            </v-row>
          </v-col>
        </template>
        <template #tableItems="{ items }">
          <v-list class="pa-0">
            <template v-for="(item, index) in items" :key="item.raw._id">
              <v-list-item
                :class="
                  $vuetify.display.smAndDown || $vuetify.display.md
                    ? 'py-2 border-md px-2 rounded-lg mb-2 mx-2 my-2'
                    : 'py-2 px-2 mx-2 my-0 text-body-2'
                "
              >
                <template #default>
                  <v-list-item-title>
                    <v-row no-gutters align="center">
                      <v-col
                        cols="12"
                        sm="2"
                        class="text text-capitalize mb-2 mb-sm-0"
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
                          <span class="mr-2 d-flex d-sm-none font-weight-bold"
                            >Site Name:
                          </span>
                          <span
                            :style="
                              $vuetify.display.smAndDown
                                ? 'font-size: .8rem;'
                                : ''
                            "
                            :class="
                              $vuetify.display.mdAndUp ? 'text-body-2' : ''
                            "
                          >
                            <v-avatar
                              size="small"
                              :color="stringToColor(item.raw.name)"
                              class="mr-2"
                            >
                              {{ getInitial(item.raw.name) }}
                            </v-avatar>
                            {{ item.raw.name }}
                          </span>
                        </v-row>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="3"
                        class="text text-capitalize mb-2 mb-sm-0"
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
                          <span class="mr-2 d-flex d-sm-none font-weight-bold"
                            >Email:
                          </span>
                          <span
                            class="text-lowercase text-truncate mr-sm-2"
                            :style="
                              $vuetify.display.smAndDown
                                ? 'font-size: .8rem;'
                                : ''
                            "
                            :class="
                              $vuetify.display.mdAndUp ? 'text-body-2' : ''
                            "
                          >
                            <v-icon
                              color="red"
                              class="mr-1 mr-md-2 mb-1 mb-md-0"
                            >
                              mdi-at
                            </v-icon>
                            {{ item.raw.email || "N/A" }}
                          </span>
                        </v-row>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="2"
                        class="text text-capitalize mb-2 mb-sm-0"
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
                          <span class="mr-2 d-flex d-sm-none font-weight-bold"
                            >Category:
                          </span>
                          <span
                            class="text-capitalize text-truncate mr-sm-2"
                            :style="
                              $vuetify.display.smAndDown
                                ? 'font-size: .8rem;'
                                : ''
                            "
                            :class="
                              $vuetify.display.mdAndUp ? 'text-body-2' : ''
                            "
                          >
                            <v-icon
                              :color="
                                /^owned$/i.test(item.raw.category || 'owned')
                                  ? 'primary'
                                  : 'orange'
                              "
                              class="mr-1 mr-md-2 mb-1 mb-md-0"
                            >
                              mdi-office-building-marker
                            </v-icon>
                            {{ item.raw.category || "owned" }}
                          </span>
                        </v-row>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="2"
                        class="text text-capitalize mb-2 mb-sm-0"
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
                          <span class="mr-2 d-flex d-sm-none font-weight-bold"
                            >Site Category:
                          </span>
                          <span
                            class="text-capitalize text-truncate mr-sm-2"
                            :style="
                              $vuetify.display.smAndDown
                                ? 'font-size: .8rem;'
                                : ''
                            "
                            :class="
                              $vuetify.display.mdAndUp ? 'text-body-2' : ''
                            "
                          >
                            <v-icon
                              color="primary"
                              class="mr-1 mr-md-2 mb-1 mb-md-0"
                            >
                              mdi-office-building
                            </v-icon>
                            {{ item.raw.siteCategory || "N/A" }}
                          </span>
                        </v-row>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="2"
                        class="text text-capitalize mb-2 mb-sm-0"
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
                          <span class="mr-2 d-flex d-sm-none font-weight-bold"
                            >Status:
                          </span>
                          <span
                            :style="
                              $vuetify.display.smAndDown
                                ? 'font-size: .8rem;'
                                : ''
                            "
                            :class="
                              $vuetify.display.mdAndUp
                                ? 'text-body-2 text-capitalize'
                                : 'text-capitalized'
                            "
                          >
                            <v-icon
                              class="mr-1 mr-md-2 mb-1 mb-md-0"
                              :color="
                                /^inactive$/i.test(item.raw.status || '')
                                  ? 'red'
                                  : 'green'
                              "
                            >
                              mdi-power
                            </v-icon>
                            {{ item.raw.status || "N/A" }}
                          </span>
                        </v-row>
                      </v-col>

                      <v-col cols="12" sm="1" class="text text-capitalize">
                        <v-row
                          no-gutters
                          class="fill-height"
                          align-content="center"
                          justify="end"
                        >
                          <v-menu>
                            <template v-slot:activator="{ props }">
                              <v-icon
                                density="compact"
                                v-bind="props"
                                class="rounded-xl border-md pa-4"
                              >
                                mdi-dots-vertical
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
                                  v-if="actionItem.link"
                                  :disabled="actionItem.disabled"
                                  @click="
                                    onRouteOrFunction(actionItem, item.raw)
                                  "
                                >
                                  <template #title>
                                    <span
                                      v-if="
                                        actionItem.text === 'Suspend Site' &&
                                        /^inactive$/i.test(
                                          item.raw.status || '',
                                        )
                                      "
                                      class="text-caption"
                                    >
                                      <span>Activate Site</span>
                                    </span>
                                    <span class="text-caption" v-else>
                                      {{ actionItem.text }}</span
                                    >
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
                </template>
              </v-list-item>
              <v-divider
                v-if="index + 1 !== items.length && $vuetify.display.lgAndUp"
              ></v-divider>
            </template>
          </v-list>
        </template>
      </base-table>
    </v-col>

    <digital-password
      :isConfirmTitle="`Are you sure you want to ${
        /^inactive$/i.test(_site.status || '') ? 'Active' : 'Suspend'
      } this Site?`"
      :isConfirmModal="dialog"
      @close-modal="dialog = false"
      @confirm-sign="onAssignSite()"
    />

    <team-invite-site
      :isConfirmModal="dialogInvite"
      @close-modal="dialogInvite = false"
      @submit="submit($event)"
    />

    <team-invite-message
      :isConfirmModal="confirmMsg"
      :isConfirmTitle="`We sent an email to join your team to <a href='#'>${site.email}</a>`"
      @close-modal="confirmMsg = false"
    />
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure", "organization"],
});

const { $ability } = useNuxtApp();
const {
  setSite,
  isSiteLoading,
  isSiteLoadingBtn,
  site,

  page,
  search,
  nextPage,
  prevPage,
  getSiteById,
  updateSiteStatusById,
  addSiteWithSendInvite,
  setProviderSites,
  nextPageProvider,
  prevPageProvider,

  selectedOrgSites,
  selectedOrgSitesPages,
  selectedOrgSitesPageRange,
  getSelectedOrganizationSites,
} = useSite();
const { stringToColor, getInitial } = useUtils();
const route = useRoute();
const router = useRouter();

const dialog = ref(false);
const dialogInvite = ref(false);
const confirmMsg = ref(false);

const _site = ref({
  status: "",
  _id: "",
} as TSite);

const orgId = computed(() => route.params.organization as string);
const siteId = computed(() => route.params.site as string);
const { setSnackbar } = useLocal();
const { currentUser } = useLocalAuth();

onMounted(async () => {
  selectedOrgSites.value = [];
  setSite();

  if (currentUser.value.type === "service-provider") {
    await setProviderSites(orgId.value);
    return;
  }

  await orgId.value;
  await Promise.all([
    getSelectedOrganizationSites(orgId.value),
    getSiteById(siteId.value),
  ]);
});

const { resendVerificationEmail } = useVerificationInvites();
const updateSiteStatus = async (siteId: string, status: string) => {
  try {
    _site.value._id = siteId;
    _site.value.status = status;
    const response = await updateSiteStatusById(
      _site.value as TUpdateSiteStatusOptions,
    );

    if (response) {
      setSnackbar({
        modal: true,
        text: `Successfully updated site status to ${status}.`,
      });

      if (currentUser.value.type === "service-provider") {
        await setProviderSites(orgId.value);
        return;
      }

      await getSiteById(siteId);
      await getSelectedOrganizationSites(orgId.value);
    } else {
      throw new Error("Failed to update site status.");
    }
  } catch (error: any) {
    setSnackbar({
      modal: true,
      text: error.message || "An error occurred while updating site status.",
      type: "error",
    });
  }
};
const actions = [
  {
    text: "View Site",
    to: "organizations-organization-sites-site",
    link: true,
    disabled: false,
    action: "read",
    subject: ["view-sites", "view-organizations"],
  },
  {
    text: "Resend Invite",
    link: false,
    event: async (value: any) => {
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
    action: "read",
    subject: ["view-sites", "view-organizations"],
  },
  {
    text: "Suspend Site",
    link: false,
    event: async (value: any) => {
      await updateSiteStatus(value._id, "inactive");
    },
    disabled: false,
    action: "update",
    subject: ["edit-sites", "edit-organizations"],
  },
  {
    text: "Activate Site",
    link: false,
    event: async (value: any) => {
      await updateSiteStatus(value._id, "active");
    },
    disabled: false,
    action: "update",
    subject: ["edit-sites", "edit-organizations"],
  },
];

const headers = computed(() => {
  return [
    {
      sm: "2",
      title: "Name",
      align: "left",
      visible: true,
    },
    {
      sm: "3",
      title: "Email",
      align: "left",
      visible: true,
    },
    {
      sm: "2",
      title: "Category",
      align: "left",
      visible: true,
    },
    {
      sm: "2",
      title: "Site Category",
      align: "left",
      visible: true,
    },
    {
      sm: "2",
      title: "Status",
      align: "left",
      visible: true,
    },
    {
      sm: "1",
      title: "Actions",
      align: "center",
      visible: false,
    },
  ];
}) as unknown as {
  sm: string;
  md: string;
  title: string;
  align: string;
  visible: boolean;
}[];

const filteredActions = computed(() => {
  return actions.filter((action) => {
    if (Array.isArray(action.subject) && action.subject!.length > 0) {
      return (
        $ability.can(action.action, action.subject[0]) ||
        $ability.can(action.action, action.subject[1])
      );
    }
  });
});

function onRouteOrFunction(actionItem: any, item: TSite) {
  if (typeof actionItem.to === "string") {
    router.push({
      name: actionItem.to,
      params: {
        organization: orgId.value,
        site: item._id,
      },
    });
  } else if (typeof actionItem.to === "function") {
    if (actionItem.text === "Suspend Site") {
      dialog.value = true;
      _site.value = item;
    }
  }
}

async function onAssignSite() {
  if (/^inactive$/i.test(_site.value.status || "")) {
    const payload = {
      _id: _site.value._id,
      status: "active",
    } as TUpdateSiteStatusOptions;
    await updateSiteStatusById(payload);
  } else {
    const payload = {
      _id: _site.value._id,
      status: "inactive",
    } as TUpdateSiteStatusOptions;
    await updateSiteStatusById(payload);
  }
  await getSelectedOrganizationSites(orgId.value);
  dialog.value = false;
}

async function submit(data: any) {
  isSiteLoadingBtn.value = true;
  try {
    site.value.email = data.payload.email;
    site.value.organization =
      currentUser.value.type === "service-provider" ? "" : orgId.value;

    const result = await addSiteWithSendInvite(site.value, {
      ...data.payload,
      organization: orgId.value,
    });
    setSnackbar({ text: result.message, modal: true, type: "success" });

    if (currentUser.value.type === "service-provider") {
      await setProviderSites(orgId.value);
    } else {
      await getSelectedOrganizationSites(orgId.value);
    }

    dialogInvite.value = false;
    confirmMsg.value = true;
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  } finally {
    isSiteLoadingBtn.value = false;
  }
}
function onSearch(query: string) {
  search.value = query;
  currentUser.value.type === "service-provider"
    ? setProviderSites(orgId.value)
    : getSelectedOrganizationSites(orgId.value);
}

function onClear() {
  search.value = "";
  currentUser.value.type === "service-provider"
    ? setProviderSites(orgId.value)
    : getSelectedOrganizationSites(orgId.value);
}

function onPrev() {
  currentUser.value.type === "service-provider"
    ? prevPageProvider(orgId.value)
    : prevPage(orgId.value);
}

function onNext() {
  currentUser.value.type === "service-provider"
    ? nextPageProvider(orgId.value)
    : nextPage(orgId.value);
}
</script>

<style scoped>
:deep() .v-col && .v-row {
  border: none;
}
</style>
