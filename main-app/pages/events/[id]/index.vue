<template>
  <v-row no-gutters class="pa-8" justify="center">
    <v-col cols="12" xxl="4" xl="8" lg="8">
      <v-row no-gutters>
        <v-col cols="12">
          <v-row no-gutters class="fill-height" align="end">
            <v-col cols="6">
              <v-row no-gutters>
                <v-col
                  cols="12"
                  class="text-h6 font-weight-bold"
                  style="letter-spacing: 2px !important"
                >
                  <v-btn
                    @click="goBack"
                    class="rounded-xl"
                    size="small"
                    elevation="0"
                  >
                    <v-icon> mdi-chevron-left </v-icon></v-btn
                  >
                  {{ event.title }}
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="6">
              <v-row no-gutters justify="end" align-content="end">
                <v-menu v-model="actionMenu" location="bottom">
                  <template #activator="{ props }">
                    <v-btn variant="text" v-bind="props">
                      <template #append>
                        <v-icon>{{
                          props["aria-expanded"] === "false"
                            ? "mdi-chevron-down"
                            : "mdi-chevron-up"
                        }}</v-icon>
                      </template>
                      Options
                    </v-btn>
                  </template>

                  <v-card>
                    <v-list density="compact" class="pa-0">
                      <template
                        v-for="(actionItem, actionIndex) in actions"
                        :key="actionItem.text"
                      >
                        <v-list-item
                          :to="{
                            name: actionItem.to,
                            params: actionItem.params,
                            query: { site: mySite },
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
                          v-if="actionIndex + 1 !== actions.length"
                        ></v-divider>
                      </template>
                    </v-list>
                  </v-card>
                </v-menu>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-col cols="12" class="font-weight-light mt-4">
        <v-card
          width="100%"
          elevation="0"
          style="border-width: thin"
          min-height="168px"
          class="d-flex justify-center align-center"
        >
          <v-row no-gutters>
            <v-col cols="12" class="font-weight-light">
              <v-card width="100%" elevation="0">
                <v-list class="pa-0" density="compact">
                  <template v-for="(item, itemIndex) in items" :key="item.text">
                    <v-list-item
                      v-if="item.to"
                      :to="{
                        name: item.to,
                        params: item.params,
                        query: { site: mySite },
                      }"
                      :prepend-icon="item.icon"
                      class="py-6"
                      density="compact"
                    >
                      <v-list-item-title class="text-subtitle-1">
                        {{ item.text }}
                      </v-list-item-title>
                      <v-list-item-subtitle
                        :class="`text-subtitle-2 ${item.class}`"
                      >
                        {{ item.subtitle ? item.subtitle : "N/A" }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item
                      v-else-if="item.accessible"
                      :prepend-icon="item.icon"
                      class="py-6"
                      density="compact"
                    >
                      <v-list-item-title class="text-subtitle-1">
                        {{ item.text }}
                      </v-list-item-title>
                      <v-list-item-subtitle
                        v-if="item.subtitle"
                        :class="`text-subtitle-2 ${item.class}`"
                      >
                        {{ item.subtitle }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider
                      v-if="itemIndex + 1 !== items.length"
                    ></v-divider>
                  </template>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure"],
});

const { setEventsByDate, event } = useEvent();
const { formatDate } = useUtils();
const { currentUser } = useLocalAuth();
const { getSitesOptionsForFiltering, mySite } = useFilter();

const id = computed(() => useRoute().params.id as string);

const actionMenu = ref(false);
const params = ref({
  id: id.value,
});

function goBack() {
  useRouter().back();
}

onMounted(async () => {
  await Promise.all([
    getSitesOptionsForFiltering(),
    setEventsByDate({ _id: id.value }),
  ]);

  console.log("Event", event.value);
});

const _event = computed(() => event.value);

const items = computed(() => {
  return [
    {
      text: "Organization",
      to: "",
      params: params.value,
      icon: "mdi-event",
      subtitle: _event.value.organizationName,
      accessible: ["organization", "service-provider"].includes(
        currentUser.value.type,
      ),
    },
    {
      text: "Site",
      to: "",
      params: params.value,
      icon: "mdi-event",
      subtitle: _event.value.siteName,
      accessible: ["organization", "service-provider"].includes(
        currentUser.value.type,
      ),
    },
    {
      text: "Title",
      to: "events-id-title",
      params: params.value,
      icon: "mdi-event",
      subtitle: _event.value.title,
    },
    {
      text: "Description",
      to: "events-id-description",
      params: params.value,
      icon: "mdi-event",
      subtitle: _event.value.description,
    },
    {
      text: "Service",
      to: "events-id-service",
      params: params.value,
      icon: "mdi-event",
      subtitle: _event.value.serviceType,
      accessible: ["organization", "site"].includes(currentUser.value.type),
    },
    {
      text: "Service Provider",
      to: "",
      params: params.value,
      icon: "mdi-event",
      subtitle: _event.value.serviceProviderName,
      accessible: ["organization", "site"].includes(currentUser.value.type),
    },
    {
      text: "Service Provider Group",
      to: "events-id-service-provider-group",
      params: params.value,
      icon: "mdi-event",
      subtitle: _event.value.serviceProviderGroupName,
      accessible: true,
    },
    {
      text: "Service Provider Member",
      to: "events-id-service-provider-member",
      params: params.value,
      icon: "mdi-event",
      subtitle: _event.value.serviceProviderMemberName,
      accessible: true,
    },
    {
      text: "Date",
      to: "events-id-date",
      params: params.value,
      icon: "mdi-event",
      subtitle: `${_event.value.start == _event.value.end ? formatDate(_event.value.start) : formatDate(_event.value.start) + " - " + formatDate(_event.value.end)}`,
    },
  ];
});

const actions = computed(() => {
  return [
    {
      text: "Delete Event",
      to: "events-id-delete",
      params: params.value,
      disabled: false,
    },
  ];
});

// async function filterActions() {
// 	// if (event.value.status == "Pending" || event.value.status == "On Going") {
// 	// 	actions.value.push({
// 	// 		text: `${event.value.status == "Pending" ? 'Assign to me' : 'Task Completed'}`,
// 	// 		to: "event-id-assignee",
// 	// 		params: params.value,
// 	// 		disabled: false,
// 	// 	})
// 	// }
// }

// async function filterItems() {
// 	if (!event.value.service){
// 		items.value.push({
// 			text: "Service",
// 			to: "event-id-service",
// 			params: params.value,
// 			icon: "mdi-service",
// 			subtitle: _event.value.service
// 		})
// 	} else {
// 		items.value.push({
// 			text: "Service",
// 			icon: "mdi-service",
// 			subtitle: _event.value.service
// 		})
// 	}

// 	// if (event.value.status) {
// 	// 	items.value.push({
// 	// 		text: "Status",
// 	// 		icon: "mdi-status",
// 	// 		subtitle: _event.value.status
// 	// 	})
// 	// }

// 	// if (event.value.status == "On Going" || event.value.status == "Completed") {
// 	// 	items.value.push({
// 	// 		text: "Assignee",
// 	// 		icon: "mdi-assignee",
// 	// 		subtitle: `${_event.value.assignee.givenName} ${_event.value.assignee.surname}`,
// 	// 	})
// 	// }
// }
</script>
