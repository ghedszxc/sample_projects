<template>
  <v-row no-gutters class="pa-8" justify="space-between" align="center">
    <v-col cols="12" md="3" class="d-flex align-center">
      <span
        v-if="$vuetify.display.lgAndUp"
        class="font-weight-bold text-h6 mr-6 text-truncate"
      >
        Notifications
      </span>
      <search-text-field
        @on-search="onSearch($event)"
        @clear-search="callItBack"
      ></search-text-field>
    </v-col>

    <v-col cols="12" md="2">
      <v-select
        v-model="_module"
        :items="_modules"
        item-title="label"
        item-value="value"
        hide-details
        :persistent-hint="false"
        @update:model-value="onFilterNotification(_module)"
        class="my-4 my-md-0 mx-md-3 pr-md-0"
      ></v-select>
    </v-col>

    <v-col cols="12" md="2" class="d-flex align-center px-md-4 mb-4 mb-md-0">
      <div class="w-100">
        <v-btn-toggle
          v-model="_notification"
          style="height: 40px !important"
          class="w-100"
        >
          <v-btn class="border w-50" @click="onFilterStatus('0')"> Read </v-btn>
          <v-btn class="border w-50" @click="onFilterStatus('1')">
            Unread
          </v-btn>
        </v-btn-toggle>
      </div>
    </v-col>

    <v-col cols="12" md="5">
      <v-row class="no-gutters d-flex justify-end align-center">
        <div class="w-100">
          <base-date-range-filter
            @on-select-date-range="onSelectDateRange($event)"
            @on-clear-date-rage="onClearDateRage($event)"
          />
        </div>
      </v-row>
    </v-col>

    <v-divider class="my-4"></v-divider>

    <v-col cols="12" md="12">
      <div class="w-100 w-md-auto">
        <v-btn
          variant="tonal"
          @click="markAllNotificationRead"
          class="w-100 w-md-auto"
          color="primary"
          :loading="loading"
        >
          Mark All as Read
        </v-btn>
      </div>
    </v-col>

    <v-col cols="12" class="mt-4">
      <v-data-iterator :items="groupedByDate" :items-per-page="itemsPerPage">
        <template #default="{ items }">
          <div v-for="(item, i) in items" :key="i">
            <span class="font-weight-bold text-h6 mr-6 pt-4 text-truncate">
              {{ formatHeaderDate(item.raw.date) }}
            </span>

            <v-row no-gutters class="mt-2">
              <template v-for="record in item.raw.records" :key="record._id">
                <NotificationCard
                  :record="record"
                  @update-notification="updateNotification($event)"
                  @redirect-notification="redirectNotification($event)"
                />
              </template>
            </v-row>
          </div>
        </template>
      </v-data-iterator>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";

definePageMeta({
  middleware: "secure",
});

const { $ability } = useNuxtApp();
const { setSnackbar } = useLocal();
const { currentUser } = useLocalAuth();
const { getInitial, materialColors, standardFormatDate } = useUtils();
const { getSitesOptionsForFiltering, siteOptions, filterSite, mySite, myOrg } =
  useFilter();
const {
  searchNotifications,
  getAllNotificationsCount,
  setNotifications,
  updateNotificationById,
  updateAllNotifications,
  page,
  pages,
  pageRange,
  itemsPerPage,
  notifications,
  unreadNotifications,
  searchNotification,
  prevPage,
  nextPage,
} = useNotification();

const filters = {
  from: new Date().toLocaleDateString(),
  to: new Date().toLocaleDateString(),
};
const selectDateFrom = ref(new Date());
const selectDateTo = ref(new Date());
const _module = ref("");
const _notification = ref("");
const notificationStatus = ref(false);
const groupedByDate = ref([]);
const items = ref([]);
const loading = ref(false);
const endOfList = ref(false);

interface Module {
  label: string;
  value: string;
}

const _modules = ref<Module[]>([
  { label: "All", value: "" },
  { label: "Service Provider", value: "service-provider" },
  { label: "Resident", value: "resident" },
  { label: "Form", value: "form" },
  { label: "Role", value: "role" },
  { label: "Feedback", value: "feedback" },
  { label: "Work Order", value: "work-order" },
  { label: "Calendar", value: "calendar" },
  { label: "Key", value: "key" },
  { label: "Visitor", value: "visitor" },
  { label: "Building", value: "building" },
  { label: "CCTV", value: "cctv" },
  { label: "Announcement", value: "announcement" },
  { label: "Emergency Contact", value: "emergency-contact" },
  { label: "Daily Occurrence Book", value: "daily-occurrence-book" },
  { label: "Incident", value: "incident" },
]);

enum ModuleType {
  Incident = "incident",
  Role = "role",
  ServiceProvider = "service-provider",
  Resident = "resident",
  Form = "form",
  Feedback = "feedback",
  WorkOrder = "work-order",
  Calendar = "calendar",
  Key = "key",
  Visitor = "visitor",
  Building = "building",
  CCTV = "cctv",
  Announcement = "announcement",
  EmergencyContact = "emergency-contact",
  DailyOccurrenceBook = "daily-occurrence-book",
}

onMounted(() => {
  page.value = 1;
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(async () => {
  filterSite.value = "";
  siteOptions.value = [];
  page.value = 1;
  window.removeEventListener("scroll", handleScroll);
});

const formatHeaderDate = (date: any) => {
  const momentDate = moment(date);
  if (momentDate.isSame(moment(), "day")) {
    return "Today";
  } else {
    return momentDate.format("MMMM D, YYYY");
  }
};

async function onFilterNotification(value: string) {
  page.value = 1;
  items.value = [];
  loadData();
}

async function onSearch(searchTerm: string) {
  searchNotification.value = searchTerm;
  loadData();
}

const callItBack = async () => {
  loadData();
};

const onFilterStatus = async (status: string) => {
  notificationStatus.value = status === "0" ? true : false;
  _notification.value = status;
  page.value = 1;
  items.value = [];
  loadData();
};

const loadData = async () => {
  loading.value = true;
  await setNotifications({
    module: _module.value as ModuleType,
    hasRead: _notification.value ? notificationStatus.value : "",
    startDate: selectDateFrom.value,
    endDate: selectDateTo.value,
  });
  page.value += 1;

  items.value = [...items.value, ...notifications.value];
  groupedByDate.value = _.groupBy(items.value, (record) => {
    // Extract date part from createdAt (assuming UTC format)
    return record.createdAt.slice(0, 10); // Get "YYYY-MM-DD" part
  });

  // Convert groupedByDate object to array of objects
  groupedByDate.value = _.map(groupedByDate.value, (value, key) => {
    return { date: key, records: value };
  });

  if (notifications.value.length < 10) {
    endOfList.value = true;
  }
  loading.value = false;
};

const updateNotification = async (item: TNotification) => {
  await updateNotificationById({
    _id: item._id,
    hasRead: true,
  });

  loadData();
};
const router = useRouter();

const redirectNotification = async (item: TNotification) => {
  await updateNotificationById({
    _id: item._id,
    hasRead: true,
  });

  loadData();

  switch (item.module) {
    case "announcement":
      router.push({ name: "announcements" });
      break;
    case "incident":
      router.push({ name: "incidents-id", params: { id: item.data._id } });
      break;
    case "work-order":
      router.push({
        name: "work-orders-id",
        params: { id: item.data._id },
        query: {
          site: item.data?.site,
        },
      });
      break;
    case "visitor":
      router.push({ name: "visitors", params: { id: item._id } });
      break;
    case "resident":
      router.push({
        path: `/organizations/${currentUser.value.organization}/sites/${mySite.value}/residents`,
        query: {
          visitor: item.data?._id,
        },
      });
      break;
    case "facility":
      router.push({
        path: "/facilities/bookings",
        query: {
          booking: item.data?._id,
        },
      });
      break;
    case "feedback":
      router.push({
        path: `/feedbacks/${item.data?._id}`,
        query: {
          site: item.data?.site,
        },
      });
      break;
    default:
      break;
  }
};

const handleScroll = async () => {
  const bottomOfWindow =
    window.innerHeight + window.scrollY >=
    document.documentElement.offsetHeight - 100;
  if (bottomOfWindow && !loading.value && !endOfList.value) {
    loadData();
  }
};

async function onSelectDateRange(filter: { to: string; from: string }) {
  items.value = [];
  selectDateFrom.value = filter.from ? filter.from : "";
  selectDateTo.value = filter.to ? filter.to : "";
  loadData();
}

async function onClearDateRage(filter: { to: string; from: string }) {
  items.value = [];
  selectDateFrom.value = "";
  selectDateTo.value = "";
  loadData();
}

async function markAllNotificationRead() {
  try {
    loading.value = true;
    await updateAllNotifications({
      hasRead: true,
    });
    unreadNotifications.value = (await getAllNotificationsCount({
      hasRead: false,
      isArchived: false,
    })) as TNotification[];
    items.value = [];
    groupedByDate.value = [];
    page.value = 1;
    await loadData();
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    setSnackbar({
      message: "Failed to mark notifications as read.",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style>
.v-list-item__prepend > .v-badge .v-icon,
.v-list-item__prepend > .v-icon,
.v-list-item__append > .v-badge .v-icon,
.v-list-item__append > .v-icon {
  opacity: 1 !important;
}
.rounded-icon {
  border-radius: 50%; /* Makes the icon rounded */
  background-color: #fe5d5d; /* Sets the background color */
  color: white; /* Sets the icon color */
  width: 35px; /* Adjust size as needed */
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bg-transparent {
  background: transparent !important;
}
</style>
