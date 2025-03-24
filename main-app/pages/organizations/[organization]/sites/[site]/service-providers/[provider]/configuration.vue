<template>
  <v-row no-gutters class="pa-8" justify="center">
    <v-col cols="12" class="fill-height mb-5" align-content="center">
      <v-breadcrumbs class="pa-0" :items="nav">
        <template #item="{ item }">
          <v-breadcrumbs-item :to="item.to">
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </v-col>

    <v-col cols="12">
      <v-card width="100%" elevation="3" height="100%">
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
                <v-data-iterator :items="accessControl" :items-per-page="10">
                  <template v-slot:header>
                    <v-row no-gutters class="pa-4">
                      <v-col cols="12">
                        <v-row no-gutters class="align-center">
                          <!-- heading -->
                          <v-col cols="12" lg="6">
                            <div class="d-flex align-center">
                              <span class="font-weight-bold text-h5 mr-4 py-2">
                                Access Control
                              </span>
                            </div>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-divider></v-divider>
                  </template>

                  <template #default="{ items }">
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="itemIndex"
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
                                    :color="item.raw.color"
                                    class="mr-5 pa-5"
                                  >
                                    <v-icon>{{ item.raw.icon }}</v-icon>
                                  </v-avatar>
                                  <span class="mt-1">
                                    {{ item.raw.text }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col cols="12" md="4" class="text my-1">
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  {{ item.raw.description }}
                                </v-row>
                              </v-col>

                              <v-col cols="12" md="4" class="text my-1">
                                <v-row
                                  no-gutters
                                  class="fill-height justify-end mr-4"
                                  align-content="center"
                                >
                                  <v-switch
                                    v-model="selectedCards"
                                    :color="item.raw.color"
                                    :value="item.raw.slug"
                                    hide-details
                                    @change="handleSwitchToggle(item.raw.slug)"
                                  ></v-switch>
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
                </v-data-iterator>
              </v-col>

              <v-col cols="12" class="pa-10">
                <v-row no-gutters justify="end" align-content="center"> </v-row>
              </v-col>
            </v-row>
          </v-col>

          <v-divider></v-divider>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure", "organization", "site", "service-provider"],
});

const providerId = computed(() => useRoute().params.provider as string);
const orgId = computed(() => useRoute().params.organization as string);
const siteId = computed(() => useRoute().params.site as string);
const {
  serviceProvider,
  allServices,
  updateServiceProviderServicesAccessById,
  getServiceProvidersAccessList,
} = useServiceProvider();
const { setSnackbar } = useLocal();

const actionMenu = ref(false);
const selectedCards = ref([]);
const params = ref({
  provider: providerId.value,
});

onMounted(async () => {
  await getServiceProvidersAccessList();
  let _list = await getServiceProvidersAccessList();
  selectedCards.value = serviceProvider.value.service_access || [];
});

const pageRoute =
  "organizations-organization-sites-site-service-providers-provider";

const nav = computed(() => {
  return [
    {
      title: "Service Provider",
      to: {
        name: "organizations-organization-sites-site-service-providers",
        params: {
          organization: orgId.value,
          site: siteId.value,
        },
      },
    },
    {
      title: serviceProvider.value.name,
      to: {
        name: "organizations-organization-sites-site-service-providers-provider",
        params: {
          organization: orgId.value,
          site: siteId.value,
          provider: providerId.value,
        },
      },
    },

    {
      title: "Service Provider Configuration",
    },
  ];
});

async function handleSwitchToggle(cardId) {
  // if (selectedCards.value.includes(cardId)) {
  //   selectedCards.value = selectedCards.value.filter(id => id !== cardId);
  // } else {
  //   selectedCards.value.push(cardId);
  // }
  serviceProvider.value.service_access = selectedCards.value;
  try {
    await updateServiceProviderServicesAccessById({
      _id: serviceProvider.value._id as string,
      service_access: serviceProvider.value.service_access as string[],
    });
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}

const accessControl = computed(() => {
  return allServices.value.map((service, index) => {
    let _data = [
      {
        slug: "calendar-access",
        icon: "mdi-calendar-month-outline",
        color: "#FB8C00",
      },
      {
        slug: "feedback-access",
        icon: "mdi-comment-account-outline",
        color: "#1867C0",
      },
      { slug: "cctv-camera-management", icon: "mdi-cctv", color: "#6200EA" },
      { slug: "virtual-patrol", icon: "mdi-shield-account", color: "#4CAF50" },
      {
        slug: "visitor-management",
        icon: "mdi-account-reactivate",
        color: "#6C63FF",
      },
      { slug: "vehicle-management", icon: "mdi-car", color: "#1867C0" },
      {
        slug: "incident-management",
        icon: "mdi-alert-octagon",
        color: "#FF5252",
      },
    ];

    const matchingData = _data.find((data) => data.slug === service.slug);
    const icon = matchingData
      ? matchingData.icon
      : "mdi-calendar-month-outline";
    const color = matchingData ? matchingData.color : "#FB8C00";

    return {
      id: (index + 1).toString(),
      text: service?.title,
      slug: service?.slug,
      icon: icon,
      color: color,
      description:
        "One line of text goes here description about " + service?.title,
      disabled: false,
      toggled: true,
    };
  });
});
</script>

<style scoped>
.highlight {
  background-color: yellow; /* Change this to your desired highlight color */
}
</style>
