<template>
  <filter-page
    v-if="$ability.can('read', 'view-virtual-patrol')"
    :bgImage="`${useRuntimeConfig().public.S3_BUCKET}/images/bg/security.jpg`"
    @submit="submit($event)"
  >
    <template v-slot:form-header>
      <v-col cols="12" style="font-size: 24px">
        <v-row no-gutters>
          <v-col cols="2">
            <v-icon class="mr-2" :size="40">mdi-alert-circle-outline</v-icon>
          </v-col>
          <v-col cols="10" class="mt-3"> Virtual Patrol List </v-col>
        </v-row>
      </v-col>
    </template>
  </filter-page>
</template>
<script setup lang="ts">
import moment from "moment-timezone";
const { $ability } = useNuxtApp();
const { mySite } = useFilter();
const { setSnackbar } = useLocal();
const { currentUser } = useLocalAuth();
const { setVPatrols, vPatrols, getVPatrolById, getScheduledPatrollingToday } =
  useVirtualPatrol();

const daysOfWeek = ref([
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]);

onMounted(async () => {
  if (
    !["admin", "organization", "service-provider"].includes(
      currentUser.value.type,
    )
  ) {
    // await submit({ query: { site: mySite.value } });

    const assigneeIds = /^(service-provider|service-provider-member)$/i.test(
      currentUser.value.type,
    )
      ? currentUser.value._id
      : "";

    const scheduledRoutes = await getScheduledPatrollingToday(
      mySite.value,
      daysOfWeek.value[new Date().getDay()],
      assigneeIds,
    );

    onSelectScheduledRoute(new Date().getDay(), scheduledRoutes.items);
  }
});

// async function submit(value: { query: any }) {
//   await setVPatrols({ site: value.query.site });
// }

async function onSelectScheduledRoute(dayToday: number, routes: any) {
  const filteredRoute = routes.filter((find: any) => {
    return find.schedule.daysOfWeek.includes(daysOfWeek.value[dayToday]);
  });
}

function submit(value: { query: any }) {
  useRouter().push({
    name: "routes-start-virtual-patrol",
    query: value.query,
  });
}
</script>
