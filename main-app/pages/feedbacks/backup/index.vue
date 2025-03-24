<template>
  <v-row no-gutters class="pa-8" justify="center">
    <v-col cols="12" xxl="4" xl="8" lg="8">
      <v-row no-gutters>
        <v-col cols="12">
          <v-row no-gutters class="fill-height" align="end">
            <v-col cols="12">
              <v-row no-gutters>
                <v-col
                  cols="12"
                  class="text-h6 font-weight-bold"
                  style="letter-spacing: 2px !important"
                >
                  Feedback Information
                </v-col>
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
                      v-else
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

const { feedback, getFeedbackById, setFeedback } = useFeedback();
const { getSitesOptionsForFiltering, mySite } = useFilter();

const id = computed(() => useRoute().params.id as string);

const actionMenu = ref(false);
const params = ref({
  id: id.value,
});

const result = await getFeedbackById(id.value);
setFeedback(result);
filterItems();

const _feedback = computed(() => feedback.value);

const items = computed(() => {
  return [
    {
      text: "Name",
      icon: "mdi-createdBy",
      subtitle: _feedback.value.createdByName,
    },
    {
      text: "Email",
      icon: "mdi-createdBy",
      subtitle: _feedback.value.createdByEmail,
    },
    {
      text: "Description",
      to: "feedbacks-id-description",
      params: params.value,
      icon: "mdi-feedback",
      subtitle: _feedback.value.description,
    },
    {
      text: "Location",
      icon: "mdi-feedback",
      subtitle: _feedback.value.location,
    },
    {
      text: "Service",
      icon: "mdi-feedback",
      subtitle: _feedback.value.service,
    },
    {
      text: "Provider",
      icon: "mdi-feedback",
      subtitle: _feedback.value.providerName,
    },
    {
      text: "Status",
      icon: "mdi-createdBy",
      subtitle: _feedback.value.status,
    },
    {
      text: "Work Order",
      icon: "mdi-createdBy",
      to: "work-orders-id",
      params: { id: _feedback.value.workOrder },
      subtitle: _feedback.value.workOrder
        ? _feedback.value.workOrder.slice(-6)
        : "N/A",
    },
  ];
});

async function filterItems() {
  if (!feedback.value.service) {
    items.value.push({
      text: "Service",
      to: "feedbacks-id-service",
      params: params.value,
      icon: "mdi-service",
      subtitle: _feedback.value.service,
    });
  } else {
    items.value.push({
      text: "Service",
      icon: "mdi-service",
      subtitle: _feedback.value.service,
    });
  }

  if (feedback.value.status) {
    items.value.push({
      text: "Status",
      icon: "mdi-status",
      subtitle: _feedback.value.status,
    });
  }

  if (
    feedback.value.status == "On Going" ||
    feedback.value.status == "Completed"
  ) {
    items.value.push({
      text: "Assignee",
      icon: "mdi-assignee",
      subtitle: `${_feedback.value.assignee.givenName} ${_feedback.value.assignee.surname}`,
    });
  }
}

onMounted(async () => {
  await getSitesOptionsForFiltering();
});
</script>
