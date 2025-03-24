<template>
  <v-app :theme="theme">
    <NuxtLoadingIndicator />
    <v-navigation-drawer v-model="drawer" color="navigationDrawer">
      <v-row no-gutters justify="center" class="my-4 mx-2 text-center">
        <span class="font-weight-bold text-h6 text-capitalize">
          {{ userType }}
        </span>
      </v-row>
      <v-list density="compact">
        <template v-for="route in routes" :key="route.text">
          <v-list-item
            v-if="route.gate && !route?.sublist"
            class="text-subtitle-2 my-1"
            :to="{ name: route.name, params: route.params }"
            :prepend-icon="route.icon"
            @click="routeName = route.text"
          >
            {{ route.text }}
            <template v-slot:append>
              <v-badge
                v-if="
                  unreadNotifications &&
                  unreadNotifications[
                    Object.keys(unreadNotifications).find((key) =>
                      new RegExp(`^${route.name.replace(/s$/, '')}(s?)$`).test(
                        key,
                      ),
                    ) as any
                  ]
                "
                color="error"
                :content="
                  unreadNotifications[
                    Object.keys(unreadNotifications).find((key) =>
                      new RegExp(`^${route.name.replace(/s$/, '')}(s?)$`).test(
                        key,
                      ),
                    ) as any
                  ]
                "
                inline
              ></v-badge>
            </template>
          </v-list-item>
          <v-list-group v-if="route.gate && route?.sublist">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="route.icon"
                class="text-subtitle-2 my-1"
              >
                {{ route.text }}
              </v-list-item>
            </template>

            <template v-for="(item, index) in route.sublist" :key="index">
              <v-list-item
                v-if="item.gate"
                :to="{ name: item.name }"
                @click="routeName = item.text"
                class="text-subtitle-2 my-1"
              >
                {{ item.text }}
                <template v-slot:append>
                  <v-badge
                    v-if="
                      unreadNotifications &&
                      unreadNotifications[
                        Object.keys(unreadNotifications).find((key) =>
                          new RegExp(
                            `^${item.name.replace(/s$/, '')}(s?)$`,
                          ).test(key),
                        ) as any
                      ]
                    "
                    color="error"
                    :content="
                      unreadNotifications[
                        Object.keys(unreadNotifications).find((key) =>
                          new RegExp(
                            `^${item.name.replace(/s$/, '')}(s?)$`,
                          ).test(key),
                        ) as any
                      ]
                    "
                    inline
                  ></v-badge>
                </template>
              </v-list-item>
            </template>
          </v-list-group>
        </template>
      </v-list>

      <v-list class="pa-0">
        <v-list-subheader color="white" v-if="services.length"
          >Services</v-list-subheader
        >

        <v-list density="compact">
          <template
            v-for="service in services.filter((find) => find.show)"
            :key="service.text"
          >
            <template v-if="!service?.sublist">
              <v-list-item
                v-if="service.gate && !service.isLink"
                class="text-subtitle-2 my-1"
                :prepend-icon="service.icon"
                :to="{ name: service.name }"
                @click="routeName = service.text"
              >
                {{ service.text }}
                <template v-slot:append>
                  <v-badge
                    v-if="
                      service.name &&
                      unreadNotifications &&
                      unreadNotifications[
                        Object.keys(unreadNotifications).find((key) =>
                          new RegExp(
                            `^${service.name.replace(/s$/, '')}(s?)$`,
                          ).test(key),
                        ) as any
                      ]
                    "
                    color="error"
                    :content="
                      unreadNotifications[
                        Object.keys(unreadNotifications).find((key) =>
                          new RegExp(
                            `^${service.name.replace(/s$/, '')}(s?)$`,
                          ).test(key),
                        ) as any
                      ]
                    "
                    inline
                  ></v-badge>
                </template>
              </v-list-item>
              <v-list-item
                v-else-if="service.gate && service.isLink"
                class="text-subtitle-2 my-1"
                :prepend-icon="service.icon"
                @click="goToExternalLink"
              >
                {{ service.text }}
                <template v-slot:append>
                  <v-badge
                    v-if="
                      service.name &&
                      unreadNotifications &&
                      unreadNotifications[
                        Object.keys(unreadNotifications).find((key) =>
                          new RegExp(
                            `^${(service as any).name.replace(/s$/, '')}(s?)$`,
                          ).test(key),
                        ) as any
                      ]
                    "
                    color="error"
                    :content="
                      unreadNotifications[
                        Object.keys(unreadNotifications).find((key) =>
                          new RegExp(
                            `^${(service as any).name.replace(/s$/, '')}(s?)$`,
                          ).test(key),
                        ) as any
                      ]
                    "
                    inline
                  ></v-badge>
                </template>
              </v-list-item>
            </template>

            <template v-else>
              <v-list-group v-if="service.gate">
                <template v-slot:activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    :prepend-icon="service.icon"
                    class="text-subtitle-2 my-1"
                  >
                    {{ service.text }}
                  </v-list-item>
                </template>

                <v-list-item
                  v-for="(item, index) in service.sublist"
                  :key="index"
                  :to="{ name: item.name, query: item.query }"
                  @click="routeName = item.text"
                  class="text-subtitle-2 my-1"
                >
                  {{ item.text }}
                  <template v-slot:append>
                    <v-badge
                      v-if="
                        unreadNotifications &&
                        unreadNotifications[
                          Object.keys(unreadNotifications).find((key) =>
                            new RegExp(
                              `^${item.name.replace(/s$/, '')}(s?)$`,
                            ).test(key),
                          ) as any
                        ]
                      "
                      color="error"
                      :content="
                        unreadNotifications[
                          Object.keys(unreadNotifications).find((key) =>
                            new RegExp(
                              `^${item.name.replace(/s$/, '')}(s?)$`,
                            ).test(key),
                          ) as any
                        ]
                      "
                      inline
                    ></v-badge>
                  </template>
                </v-list-item>
              </v-list-group>
            </template>
          </template>
        </v-list>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar density="comfortable" elevation="0">
      <template #prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-chip class="ma-2" variant="outlined" v-if="siteNameComputed">
          <v-icon icon="mdi-domain" start></v-icon>
          <span class="text-responsive">
            {{ siteNameComputed }}
          </span>
        </v-chip>
      </template>

      <template #append>
        <v-btn
          icon
          class="mx-1"
          density="comfortable"
          @click="theme = theme === 'light' ? 'dark' : 'light'"
        >
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>

        <v-menu
          v-model="menu_notification"
          :close-on-content-click="false"
          location="bottom"
        >
          <template #activator="{ props }">
            <NuxtLink
              :to="{
                name: 'notifications',
              }"
              v-bind="props"
              icon
              class="mx-1"
              density="comfortable"
            >
              <v-badge
                v-if="countNotification"
                color="error"
                :content="countNotification"
              >
                <v-icon>mdi-bell-outline</v-icon>
              </v-badge>
              <v-icon v-else>mdi-bell-outline</v-icon>
            </NuxtLink>
          </template>
        </v-menu>

        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          location="bottom"
        >
          <template #activator="{ props }">
            <v-btn variant="text" height="48px" v-bind="props" class="ml-4">
              <SharedAvatar
                :item="{
                  name: getFullName(currentUser || ''),
                  type: getUserType(currentUser.type),
                  profilePicture: currentUser.profilePicture,
                }"
                :isIcon="$vuetify.display.smAndUp && true"
              />
              <template #append>
                <v-icon>{{
                  props["aria-expanded"] === "false"
                    ? "mdi-chevron-down"
                    : "mdi-chevron-up"
                }}</v-icon>
              </template>
            </v-btn>
          </template>

          <v-card width="350">
            <v-list density="compact" class="pa-0">
              <v-list-item class="mt-2" :subtitle="currentUser.email">
                <template #title>
                  <span class="font-weight-bold">
                    {{ currentUser.givenName }}
                    {{ currentUser.surname }}
                  </span>
                  <div v-if="$vuetify.display.smAndDown">
                    {{
                      `${currentUser.type ? `(${getUserType(currentUser.type)})` : ""}`
                    }}
                  </div>
                </template>
              </v-list-item>

              <v-divider class="mt-4"></v-divider>
              <v-list-item
                :active="false"
                v-if="/site/i.test(currentUser.type || '')"
                @click="goToSiteSettingsPage()"
              >
                Site Settings
              </v-list-item>
              <v-divider></v-divider>
            </v-list>
            <v-card-text>
              <span
                class="font-weight-bold text-primary pointer-cursor nuxt-link"
                @click="
                  useRouter().push({
                    name: 'logout',
                  })
                "
              >
                Sign Out
              </span>
            </v-card-text>
          </v-card>
        </v-menu>
      </template>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>
    <v-footer
      :height="$vuetify.display.smAndDown ? 100 : 50"
      class="px-0 text-caption"
      app
    >
      <v-row
        class="px-5"
        align="center"
        align-content="center"
        justify="center"
      >
        <v-col
          :class="$vuetify.display.smAndDown ? 'pa-0' : ''"
          :cols="$vuetify.display.smAndDown ? 12 : 6"
        >
          <div
            class="text-truncate"
            :class="$vuetify.display.smAndDown ? 'text-center' : ''"
          >
            © 2024 powered by Seven 365 Pte. Ltd. v.1
          </div>
        </v-col>
        <v-col :cols="$vuetify.display.smAndDown ? 12 : 6">
          <v-row :justify="$vuetify.display.smAndDown ? 'center' : 'end'">
            <v-icon class="pr-2 pt-3" icon="mdi-web"> </v-icon>
            <div id="google_translate_element"></div>
          </v-row>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { keyBy } from "lodash";

definePageMeta({
  middleware: "secure",
});

if (process.client) {
  setTimeout(() => {
    // @ts-ignore
    new google.translate.TranslateElement(
      { pageLanguage: "en" },
      "google_translate_element",
    );
  }, 1000);
}

const props = defineProps({
  cols: {
    type: Number,
    default: 12,
  },
  xs: {
    type: Number,
    default: 12,
  },
  sm: {
    type: Number,
    default: 6,
  },
  md: {
    type: Number,
    default: 6,
  },
  lg: {
    type: Number,
    default: 6,
  },
  xl: {
    type: Number,
    default: 6,
  },
});

const { $ability } = useNuxtApp();
const { theme, cctvLink, setSnackbar } = useLocal();
const { drawer } = useDrawer();
const { getUserType, getFullName } = useUtils();
const { currentUser, loggedIn } = useLocalAuth();
const { routes, services } = useLocalRoute();
const { getOrganizationById } = useOrganization();
const { getServiceProviderById, getServiceProviderGroupById } =
  useServiceProvider();
const { getSiteById } = useSite();
const { getSitesOptionsForFiltering, mySite, globalSite, myOrg, myProvider } =
  useFilter();
const { setVisitors, filters, tab } = useVisitor();

const menu = ref(false);
const menu_notification = ref(false);
const countNotification = computed(() => unreadNotifications.value?.all);
const siteName = ref("");
const siteNameComputed = computed(() => siteName.value || "");
const siteId = computed(() => globalSite.value);
const routeName = ref("");

const userType = computed(() => getUserType(currentUser.value.type));
const {
  visitorSocket,
  organizationSocket,
  feedbackSocket,
  incidentSocket,
  eventSocket,
  authorizationSocket,
  facilitySocket,
} = useSocket();
const { setVisitor, addVisitorRealtimeDialog } = useVisitor();
const { siteSetting } = useSiteSettings();
const { getAllNotificationsCount, unreadNotifications } = useNotification();

const allNotificationsDisabled = computed(() => {
  const settings = currentUser.value.notificationSettings || {};
  return Object.values(settings).every((enabled) => !enabled);
});

watchEffect(async () => {
  const { name } = (await getSiteById(siteId.value)) as TSite;
  siteName.value = name;
});

watchEffect(() => {
  if (loggedIn.value) {
    if (allNotificationsDisabled.value) {
      visitorSocket.disconnect();
      organizationSocket.disconnect();
      feedbackSocket.disconnect();
      incidentSocket.disconnect();
      eventSocket.disconnect();
      authorizationSocket.disconnect();
      facilitySocket.disconnect();
    } else {
      visitorSocket.auth = {
        userId: currentUser.value._id,
        siteId: currentUser.value.site,
        organizationId: currentUser.value.organization,
        serviceProviderId: currentUser.value.serviceProvider,
        serviceProviderGroupId: currentUser.value.serviceProviderGroup,
        type: currentUser.value.type,
      };
      visitorSocket.connect();
      organizationSocket.auth = {
        userId: currentUser.value._id,
        siteId: currentUser.value.site,
        organizationId: currentUser.value.organization,
        serviceProviderId: currentUser.value.serviceProvider,
        serviceProviderGroupId: currentUser.value.serviceProviderGroup,
        type: currentUser.value.type,
      };
      organizationSocket.connect();
      feedbackSocket.auth = {
        userId: currentUser.value._id,
        siteId: currentUser.value.site,
        organizationId: currentUser.value.organization,
        serviceProviderId: currentUser.value.serviceProvider,
        serviceProviderGroupId: currentUser.value.serviceProviderGroup,
        type: currentUser.value.type,
      };
      feedbackSocket.connect();
      incidentSocket.auth = {
        userId: currentUser.value._id,
        siteId: currentUser.value.site,
        organizationId: currentUser.value.organization,
        serviceProviderId: currentUser.value.serviceProvider,
        serviceProviderGroupId: currentUser.value.serviceProviderGroup,
        type: currentUser.value.type,
      };
      incidentSocket.connect();
      eventSocket.auth = {
        userId: currentUser.value._id,
        siteId: currentUser.value.site,
        organizationId: currentUser.value.organization,
        serviceProviderId: currentUser.value.serviceProvider,
        serviceProviderGroupId: currentUser.value.serviceProviderGroup,
        type: currentUser.value.type,
      };
      authorizationSocket.connect();
      authorizationSocket.auth = {
        userId: currentUser.value._id,
        siteId: currentUser.value.site,
        organizationId: currentUser.value.organization,
        serviceProviderId: currentUser.value.serviceProvider,
        serviceProviderGroupId: currentUser.value.serviceProviderGroup,
        type: currentUser.value.type,
      };
      authorizationSocket.connect();
      facilitySocket.connect();
      facilitySocket.auth = {
        userId: currentUser.value._id,
        siteId: currentUser.value.site,
        organizationId: currentUser.value.organization,
        serviceProviderId: currentUser.value.serviceProvider,
        serviceProviderGroupId: currentUser.value.serviceProviderGroup,
        type: currentUser.value.type,
      };
      facilitySocket.connect();
    }
  } else {
    visitorSocket.disconnect();
    organizationSocket.disconnect();
    feedbackSocket.disconnect();
    incidentSocket.disconnect();
    eventSocket.disconnect();
    authorizationSocket.disconnect();
    facilitySocket.disconnect();
  }
});

watchEffect(async () => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
});

useHead({
  title() {
    const { generatePageTitle } = useUtils();
    const title = generatePageTitle(routeName.value);
    return title;
  },
});

if (
  $ability.can("read", "view-visitors") ||
  $ability.can("read", "view-keys")
) {
  visitorSocket.on("unreturned-contractor-passkeys", async (data) => {
    unreadNotifications.value = await getAllNotificationsCount({
      hasRead: false,
      isArchived: false,
    });
    setSnackbar({
      text: "You have a new notification.",
      type: "success",
      modal: true,
    });
  });

  visitorSocket.on("visitor-allotted-time-limit", async (data) => {
    unreadNotifications.value = await getAllNotificationsCount({
      hasRead: false,
      isArchived: false,
    });
    setSnackbar({
      text: "You have a new notification.",
      type: "success",
      modal: true,
    });
  });

  visitorSocket.on("contractor-allotted-time-limit", async (data) => {
    unreadNotifications.value = await getAllNotificationsCount({
      hasRead: false,
      isArchived: false,
    });
    setSnackbar({
      text: "You have a new notification.",
      type: "success",
      modal: true,
    });
  });
}
// visitorSocket.on("new-visitor", async (data) => {
//   unreadNotifications.value = (await getAllNotificationsCount({
//     hasRead: false,
//     isArchived: false,
//   }))
//   setSnackbar({
//     text: "You have a new notification.",
//     type: "success",
//     modal: true,
//   });
// });

// visitorSocket.on("old-visitor", async (data) => {
//   unreadNotifications.value = (await getAllNotificationsCount({
//     hasRead: false,
//     isArchived: false,
//   }))
//   setSnackbar({
//     text: "You have a new notification.",
//     type: "success",
//     modal: true,
//   });
// });

const onRedirect = () => {
  useRouter().push({
    name: "visitors",
    query: {
      site: mySite.value,
    },
  });
};

visitorSocket.on("add-unregistered", async (data: any) => {
  tab.value = "unregistered";

  setSnackbar({
    text: `Unregistered vehicle has checked ${data.transactionType === "check-in" ? "in" : "out"} with the plate number `,
    modal: true,
    type: "info",
    highlight: data.plateNumber,
    callback: onRedirect,
  });
});

visitorSocket.on("new-visitor", async (data: any) => {
  if (siteSetting.value.anpr.showUnregisteredTransactions) {
    setVisitor({ plateNumber: data.plateNumber });
    addVisitorRealtimeDialog.value = true;
  }
});

visitorSocket.on("old-visitor", async (data: any) => {
  if (siteSetting.value.anpr.showUnregisteredTransactions) {
    setVisitor({
      firstName: data.firstName,
      lastName: data.lastName,
      plateNumber: data.plateNumber,
      isPassReturned: true,
      isKeyReturned: true,
      nric: data.nric,
    });
    addVisitorRealtimeDialog.value = true;
  }
});

visitorSocket.on("new-pending-overnight-parking-approval", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

organizationSocket.on("new-announcement", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

feedbackSocket.on("new-work-order", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

feedbackSocket.on("new-work-order-assignee", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

feedbackSocket.on("new-work-order-comment", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  await getAllNotificationsCount();
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

feedbackSocket.on("new-feedback", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

feedbackSocket.on("updated-feedback", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

feedbackSocket.on("feedback-message", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

incidentSocket.on("new-incident", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

incidentSocket.on("approved-incident", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

incidentSocket.on("rejected-incident", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

eventSocket.on("new-calendar", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

eventSocket.on("added-assignee-calendar", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

eventSocket.on("update-calendar", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

eventSocket.on("removed-assignee-calendar", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

authorizationSocket.on("new-pending-approval-resident", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

authorizationSocket.on("new-pending-approval-review-resident", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

authorizationSocket.on("request-account-deletion", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

facilitySocket.on("new-pending-booked-slot-request", async (data) => {
  unreadNotifications.value = await getAllNotificationsCount({
    hasRead: false,
    isArchived: false,
  });
  setSnackbar({
    text: "You have a new notification.",
    type: "success",
    modal: true,
  });
});

facilitySocket.on(
  "updated-booked-slot-request-status-by-resident",
  async (data) => {
    unreadNotifications.value = await getAllNotificationsCount({
      hasRead: false,
      isArchived: false,
    });
    setSnackbar({
      text: "You have a new notification.",
      type: "success",
      modal: true,
    });
  },
);

async function getHeaderTitle() {
  await getSitesOptionsForFiltering();
  let orgOrSpmName = "";
  let sptOrSite = "";
  if (/^(organization|site)$/i.test(currentUser.value.type)) {
    const org = await getOrganizationById(myOrg.value || "");
    orgOrSpmName = org?.name || "";
  } else if (
    /^(service-provider|service-provider-member)$/i.test(currentUser.value.type)
  ) {
    const spm = await getServiceProviderById(myProvider.value);
    orgOrSpmName = spm?.name || "";
  }

  if (/^(site)$/i.test(currentUser.value.type)) {
    const site = await getSiteById(mySite.value);
    sptOrSite = site?.name || "";
  } else if (/^(service-provider-member)$/i.test(currentUser.value.type)) {
    const spt = (await getServiceProviderGroupById(
      String(currentUser.value.serviceProviderGroup),
    )) as unknown as { groupName: string };
    sptOrSite = spt?.groupName || "";
  }
}

async function goToSiteSettingsPage() {
  useRouter().push({
    name: "settings",
  });
}

function goToExternalLink() {
  const link = ["admin", "organization", "service-provider"].includes(
    currentUser.value.type,
  )
    ? `${cctvLink.value}/cctv/filter`
    : `${cctvLink.value}/cctv`;
  window.open(link, "_blank");
}

onMounted(async () => {
  console.log("Started!");
  if (!theme.value) theme.value = "light";
  const [unreadNotif] = await Promise.all([
    getAllNotificationsCount({
      hasRead: false,
      isArchived: false,
    }) as unknown as number,
    getHeaderTitle(),
  ]);
  unreadNotifications.value = unreadNotif;
  await getHeaderTitle();
});

onUnmounted(() => {
  visitorSocket.disconnect();
  organizationSocket.disconnect();
  feedbackSocket.disconnect();
  incidentSocket.disconnect();
  eventSocket.disconnect();
  authorizationSocket.disconnect();
  facilitySocket.disconnect();
});
</script>
<style>
.text-responsive {
  font-weight: bold;
  text-transform: capitalize;
  font-size: 1.2rem;

  @media (max-width: 960px) {
    font-size: 1rem;
  }

  @media (max-width: 600px) {
    font-size: 0.7rem;
  }
}

.goog-te-combo {
  border: 1px solid black;
  border-radius: 5px;
  padding: 2px;
  margin: 0px !important;
}
</style>
