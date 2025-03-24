<template>
  <v-dialog
    v-model="confirmationDialog"
    transition="dialog-top-transition"
    max-width="500"
    persistent
  >
    <v-card :loading="isProgress">
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="orange"
          height="8"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-card-text class="py-5">
        <span
          @click="goBack()"
          style="cursor: pointer"
          class="d-flex align-center text-truncate text-body-2"
          ><v-btn
            size="x-small"
            class="border mr-2"
            icon="mdi-chevron-left"
            flat
            :disabled="isVPatrolLoading"
          ></v-btn
          >Back</span
        >

        <v-img :src="`/images/confirmation.svg`" height="100" />
        <div class="font-weight-bold text-center py-5">
          Multiple Routes Scheduled
          <p class="text-caption">Please select a route to proceed.</p>
        </div>
        <v-list density="compact" max-height="200" class="my-4">
          <template v-for="(route, key) in scheduledRoutes" :key="key">
            <v-list-item
              border="primary thin"
              :disabled="route.isDonePatrolling"
              :class="`my-2 rounded text-body-2 hover-effect ${route.isDonePatrolling ? 'text-decoration-line-through' : 'text-decoration-none'}`"
              @click="selectedItem = route._id"
            >
              <v-row align="center">
                <v-col cols="6">
                  <span class="d-flex align-center text-truncate">
                    <v-icon
                      v-if="route._id !== selectedItem"
                      size="small"
                      class="mr-2"
                    >
                      mdi-checkbox-blank-outline
                    </v-icon>
                    <v-icon v-else size="small" class="mr-2" color="primary">
                      mdi-checkbox-marked
                    </v-icon>
                    <v-icon
                      size="x-small"
                      class="mr-2"
                      style="
                        background: #1976d2;
                        border-radius: 24px;
                        color: #ffffff;
                        width: 22px;
                        height: 22px;
                      "
                      >mdi-cctv</v-icon
                    >
                    <span>{{ route.routeName || "" }}</span>
                  </span>
                </v-col>
                <v-col cols="3">
                  <span class="d-flex align-center text-truncate">
                    <v-icon
                      class="mr-1"
                      color="green"
                      style="width: 16px; height: 16px"
                    >
                      <v-img src="/icons/timein-green.svg"></v-img>
                    </v-icon>
                    <span>{{ route.schedule.startTime || "" }}</span>
                  </span>
                </v-col>
                <v-col cols="3">
                  <span class="d-flex align-center text-truncate">
                    <v-icon
                      class="mr-1"
                      color="red"
                      style="width: 16px; height: 16px"
                    >
                      <v-img src="/icons/timeout-green.svg"></v-img>
                    </v-icon>
                    <span>{{ route.schedule.endTime || "" }}</span>
                  </span>
                </v-col>
              </v-row>
            </v-list-item>
          </template>
        </v-list>

        <v-btn
          block
          color="blue-darken-3"
          size="small"
          variant="flat"
          style="height: 40px"
          @click="onConfirmRoute()"
          :disabled="isProgress || !selectedItem"
        >
          Proceed Virtual Patrolling
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import moment from "moment-timezone";

const { mySite } = useFilter();
const { setSnackbar } = useLocal();
const { currentUser } = useLocalAuth();
const {
  setVPatrols,
  vPatrols,
  getVPatrolById,
  getScheduledPatrollingToday,
  getScheduledRouteToday,
} = useVirtualPatrol();

const { siteSetting, getSiteSettingsById } = useSiteSettings();
const { setOnGoingPatrol } = usePatrolLog();

const daysOfWeek = ref([
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]);

const confirmationDialog = ref(false);
const isProgress = ref(true);
const scheduledRoutes = ref([]);
const selectedItem = ref("");

onMounted(async () => {
  await getSiteSettingsById(mySite.value);

  const assigneeIds = /^(service-provider-member)$/i.test(
    currentUser.value.type,
  )
    ? currentUser.value._id
    : "";

  // const scheduledRoutes = await getScheduledPatrollingToday(
  //   mySite.value,
  //   daysOfWeek.value[new Date().getDay()],
  //   assigneeIds,
  // );
  const gracePeriod =
    (siteSetting.value.virtualPatrolGracePeriod &&
      Number(siteSetting.value.virtualPatrolGracePeriod)) ||
    15;

  const timeWithGrace = moment().add(gracePeriod, "minutes").format("HH:mm");
  const currentTime = moment().format("HH:mm");

  isProgress.value = true;
  const result = (await getScheduledRouteToday({
    siteId: mySite.value,
    dayToday: daysOfWeek.value[new Date().getDay()],
    currentTime: currentTime,
    timeWithGrace: timeWithGrace,
    assigneeIds: assigneeIds,
  })) as TVirtualPatrol;

  isProgress.value = false;
  if (result) {
    scheduledRoutes.value = result.items;

    if (result && result.items.length > 1) {
      confirmationDialog.value = true;
    } else if (result.items.length === 1) {
      selectedItem.value = scheduledRoutes.value[0]._id;
      onConfirmRoute();
    } else {
      setSnackbar({
        text: "No schedule of patrolling today.",
        modal: true,
        type: "primary",
      });
      setTimeout(() => {
        useRouter().push({
          name: "routes",
          query: {
            site: mySite.value,
          },
        });
      }, 3000);
    }
  } else {
    setSnackbar({
      text: "No schedule of patrolling today.",
      modal: true,
      type: "primary",
    });
    setTimeout(() => {
      useRouter().push({
        name: "routes",
        query: {
          site: mySite.value,
        },
      });
    }, 3000);
  }

  const isPatrolling = await setOnGoingPatrol({ site: mySite.value });

  if (isPatrolling.length > 0) {
    setSnackbar({
      text: "Virtual Patrolling is currently ongoing.",
      type: "info",
      modal: true,
    });
  }
});

// async function submit(value: { query: any }) {
//   getAssignedSchedule(value.query.site);
//   // await setVPatrols({ site: value.query.site });
// }

async function goBack() {
  useRouter().push({
    name: "routes",
    query: {
      site: mySite.value,
    },
  });
}

async function onConfirmRoute() {
  // const filteredRoute = routes.filter((find: any) => {
  //   return find.schedule.daysOfWeek.includes(daysOfWeek.value[dayToday]);
  // });
  // const arrangeRouteSchedule = filteredRoute.sort((current: any, next: any) =>
  //   current.schedule?.startTime.localeCompare(next.schedule?.startTime),
  // );
  // var selectedSchedule = "";
  // if (arrangeRouteSchedule.length) {
  //   for (let i = 0; i < arrangeRouteSchedule.length; i++) {
  //     // START: CHECK THE NEAREST SCHEDULE TODAY
  //     const getStartScheduledHour = parseInt(
  //       arrangeRouteSchedule[i].schedule.startTime.split(":")[0],
  //     );
  //     const getStartScheduledMins = parseInt(
  //       arrangeRouteSchedule[i].schedule.startTime.split(":")[1],
  //     );
  //     const getEndScheduledHour = parseInt(
  //       arrangeRouteSchedule[i].schedule.endTime.split(":")[0],
  //     );
  //     const getEndScheduledMins = parseInt(
  //       arrangeRouteSchedule[i].schedule.endTime.split(":")[1],
  //     );
  //     const start = getStartScheduledHour * 60 + getStartScheduledMins;
  //     const end = getEndScheduledHour * 60 + getEndScheduledMins;
  //     const date = new Date(moment.tz(moment(new Date()), "Asia/Singapore"));
  //     const now = date.getHours() * 60 + date.getMinutes();
  //     const graceTime = date.getMinutes() + 15; // +15: IS TO SET GRACE TIME PERIOD
  //     const graceTimeFormula =
  //       graceTime < 60
  //         ? date.getHours() * 60 + graceTime
  //         : (date.getHours() + 1) * 60 + (graceTime - 60); // THIS IS THE FORMULA FOR GRACE TIME
  //     if ((start <= now || start <= graceTimeFormula) && now <= end) {
  //       selectedSchedule = arrangeRouteSchedule[i];
  //       break;
  //     }
  // END

  isProgress.value = true;
  const result = await getVPatrolById(selectedItem.value, 1);

  if (result) {
    const getFirstCctv = result?.items
      .filter((find: any) => find.isActive)
      .sort((a: any, b: any) => a.sequence - b.sequence);

    useRouter().push({
      name: "routes-routeId-cctv-cctvId",
      params: {
        routeId: selectedItem.value,
        cctvId: getFirstCctv[0]?._id,
      },
      query: {
        site: mySite.value,
      },
    });
    isProgress.value = false;
  } else {
    setSnackbar({
      text: "Cannot proceed to virtual patrolling at this time.",
      modal: true,
      type: "error",
    });

    isProgress.value = false;

    setTimeout(() => {
      useRouter().push({
        name: "routes",
        query: {
          site: mySite.value,
        },
      });
    }, 3000);
  }
}
</script>
<style scoped>
.hover-effect:hover {
  cursor: pointer;
  background-color: rgba(240, 248, 255, 0.212);
}
</style>
