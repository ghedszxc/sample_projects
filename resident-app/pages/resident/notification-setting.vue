<template>
  <v-row no-gutters>
    <v-col
      cols="6"
      :class="`mt-3 pb-3 ${$vuetify.display.smAndUp ? 'px-6' : 'px-3'}`"
      @click="goBack()"
    >
      <v-icon
        start
        size="x-large"
        style="position: relative; right: 5px; top: 1px"
      >
        <v-img
          class="pl-0 ml-0 mt-2"
          src="/dark-mode/utility-all/right-arrow.svg"
          cover
        ></v-img>
      </v-icon>
      <span style="position: relative; right: 15px; top: 1px"> Go Menu </span>
    </v-col>
    <v-col cols="12"
      ><v-row no-gutters>
        <v-col cols="12" class="px-4">
          <v-card class="rounded-lg" :class="cardMenuItems" elevation="1">
            <v-card-text>
              <v-row align="center" no-gutters>
                <v-col>
                  <span
                    :class="$vuetify.theme.dark ? 'text-white' : 'text-dark'"
                  >
                    Enable Notification
                  </span>
                </v-col>
                <v-col cols="auto">
                  <v-switch
                    :class="$vuetify.theme.dark ? 'text-white' : 'text-dark'"
                    v-model="enableAllNotifications"
                    color="success"
                    hide-details
                    inset
                    density="compact"
                    @update:model-value="handleEnableNotificationChange"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12"
      ><v-row no-gutters>
        <v-col cols="12" class="pa-4">
          <v-card
            v-for="(setting, index) in modules"
            :key="index"
            class="mb-4 rounded-lg"
            :class="cardMenuItems"
            elevation="1"
          >
            <v-card-text>
              <v-row align="center" no-gutters>
                <v-col>
                  <span
                    :class="$vuetify.theme.dark ? 'text-white' : 'text-dark'"
                  >
                    {{ setting.label }}
                  </span>
                </v-col>
                <v-col cols="auto">
                  <v-switch
                    :class="$vuetify.theme.dark ? 'text-white' : 'text-dark'"
                    v-model="setting.value"
                    color="success"
                    hide-details
                    inset
                    density="compact"
                    @change="updateNotificationModules"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col> </v-row
    ></v-col>
  </v-row>
</template>
<script setup lang="ts">
import debounce from "lodash/debounce";
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});
const { visitorSocket } = useSocket();
const { theme } = useLocal();
const { updateNotificationSettings } = useUser();
const { currentUser, getCurrentUser } = useLocalAuth();
const { setSnackbar } = useLocal();

function goBack() {
  useRouter().push({ name: "menu" });
}
const isLoading = ref(false);
const enableAllNotifications = ref<boolean>(false);

const modules = ref([
  // I commented this so that when adding a new notification, it will only require uncommenting.
  //   {
  //     label: "Service Providers",
  //     key: "service-provider",
  //     value: currentUser.value.notificationSettings["service-provider"] || false,
  //   },
  //   {
  //     label: "Residents",
  //     key: "resident",
  //     value: currentUser.value.notificationSettings.resident || false,
  //   },
  //   {
  //     label: "Facility Management",
  //     key: "facility",
  //     value: currentUser.value.notificationSettings.facility || false,
  //   },
  //   {
  //     label: "Forms",
  //     key: "form",
  //     value: currentUser.value.notificationSettings.form || false,
  //   },
  //   {
  //     label: "Roles & Permissions",
  //     key: "role",
  //     value: currentUser.value.notificationSettings.role || false,
  //   },
  //   {
  //     label: "Feedback",
  //     key: "feedback",
  //     value: currentUser.value.notificationSettings.feedback || false,
  //   },
  //   {
  //     label: "Work Orders",
  //     key: "work-order",
  //     value: currentUser.value.notificationSettings["work-order"] || false,
  //   },
  //   {
  //     label: "Calendar",
  //     key: "calendar",
  //     value: currentUser.value.notificationSettings.calendar || false,
  //   },
  //   {
  //     label: "Key Management",
  //     key: "key",
  //     value: currentUser.value.notificationSettings.key || false,
  //   },
  {
    label: "Visitors",
    key: "visitor",
    value: currentUser.value.notificationSettings.visitor || false,
  },
  //   {
  //     label: "Building Management",
  //     key: "building",
  //     value: currentUser.value.notificationSettings.building || false,
  //   },
  //   {
  //     label: "Sky-I",
  //     key: "cctv",
  //     value: currentUser.value.notificationSettings.cctv || false,
  //   },
  //   {
  //     label: "Announcement Configuration",
  //     key: "announcement",
  //     value: currentUser.value.notificationSettings.announcement || false,
  //   },
  //   {
  //     label: "Emergency Contact Configuration",
  //     key: "emergency-contact",
  //     value: currentUser.value.notificationSettings["emergency-contact"] || false,
  //   },
  //   {
  //     label: "Daily Occurrence Book Configuration",
  //     key: "daily-occurrence-book",
  //     value:
  //       currentUser.value.notificationSettings["daily-occurrence-book"] || false,
  //   },
  //   {
  //     label: "Incident Management",
  //     key: "incident",
  //     value: currentUser.value.notificationSettings.incident || false,
  //   },
]);

const cardMenuItems = computed(() =>
  theme.value === "dark" ? "bg-dark" : "bg-light",
);

// I commented this so that when adding a new notification, it will only require uncommenting.
const updateNotificationModules = debounce(async () => {
  isLoading.value = true;
  //   const notificationSettings: TUserNotificationSettings = {
  //     // "service-provider": modules.value.find(
  //     //   (module) => module.key === "service-provider",
  //     // )!.value,
  //     // resident: modules.value.find((module) => module.key === "resident")!.value,
  //     // facility: modules.value.find((module) => module.key === "facility")!.value,
  //     // form: modules.value.find((module) => module.key === "form")!.value,
  //     // role: modules.value.find((module) => module.key === "role")!.value,
  //     // feedback: modules.value.find((module) => module.key === "feedback")!.value,
  //     // "work-order": modules.value.find((module) => module.key === "work-order")!
  //     //   .value,
  //     // calendar: modules.value.find((module) => module.key === "calendar")!.value,
  //     // key: modules.value.find((module) => module.key === "key")!.value,
  //     visitor: modules.value.find((module) => module.key === "visitor")!.value,
  //     // building: modules.value.find((module) => module.key === "building")!.value,
  //     // cctv: modules.value.find((module) => module.key === "cctv")!.value,
  //     // announcement: modules.value.find((module) => module.key === "announcement")!
  //     //   .value,
  //     // "emergency-contact": modules.value.find(
  //     //   (module) => module.key === "emergency-contact",
  //     // )!.value,
  //     // "daily-occurrence-book": modules.value.find(
  //     //   (module) => module.key === "daily-occurrence-book",
  //     // )!.value,
  //     // incident: modules.value.find((module) => module.key === "incident")!.value,
  //   };

  const notificationSettings: TUserNotificationSettings = {
    "service-provider": false,
    resident: false,
    facility: false,
    form: false,
    role: false,
    feedback: false,
    "work-order": false,
    calendar: false,
    key: false,
    visitor: modules.value.find((module) => module.key === "visitor")!.value,
    building: false,
    cctv: false,
    announcement: false,
    "emergency-contact": false,
    "daily-occurrence-book": false,
    incident: false,
  };

  try {
    console.log("notificationSettings: ", notificationSettings);
    await updateNotificationSettings(
      currentUser.value._id,
      notificationSettings,
    );

    // Handle socket connections
    // if (allModulesDisabled.value) {
    //   visitorSocket.disconnect();
    //   organizationSocket.disconnect();
    //   feedbackSocket.disconnect();
    //   incidentSocket.disconnect();
    //   facilitySocket.disconnect();
    // } else {
    //   const socketAuth = {
    //     userId: currentUser.value._id,
    //     siteId: currentUser.value.site,
    //     organizationId: currentUser.value.organization,
    //     serviceProviderId: currentUser.value.serviceProvider,
    //     serviceProviderGroupId: currentUser.value.serviceProviderGroup,
    //     type: currentUser.value.type,
    //   };

    //   // Disconnect all sockets first
    //   [
    //     visitorSocket,
    //     organizationSocket,
    //     feedbackSocket,
    //     incidentSocket,
    //     facilitySocket,
    //   ].forEach((socket) => {
    //     socket.disconnect();
    //     socket.auth = socketAuth;
    //     socket.connect();
    //   });
    // }

    setSnackbar({
      modal: true,
      text: "Successfully updated Notification Settings.",
      type: "success",
    });
  } catch (error: any) {
    setSnackbar({
      modal: true,
      text: error?.message || "Server internal error.",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
}, 1000);

const allModulesEnabled = computed(() => {
  return modules.value.every((module) => module.value);
});

watch(
  () => modules.value.map((m) => m.value),
  (newValues) => {
    enableAllNotifications.value = newValues.every((value) => value === true);
  },
  { deep: true },
);

watchEffect(() => {
  enableAllNotifications.value = allModulesEnabled.value;
});

const handleEnableNotificationChange = (value: boolean | null) => {
  modules.value = modules.value.map((module) => ({
    ...module,
    value: value,
  }));

  updateNotificationModules();
};
</script>

<style scoped>
.chevron-icon {
  filter: drop-shadow(0px 4px 10px #d01b1b);
}
.go-back-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.go-back-dark {
  color: #fcfcfc;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.bg-dark {
  background-color: #111723 !important;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.bg-light {
  background-color: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.text-dark {
  color: #fcfcfc;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.text-white {
  color: #0f131c;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}
</style>
