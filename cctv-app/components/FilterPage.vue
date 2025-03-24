<template>
  <div
    :style="`
      background-image: linear-gradient(
          rgba(0, 0, 0, 0.25),
          rgba(0, 0, 0, 0.25)
        ),
        url('${bgImage}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    `"
    :class="`fill-height ${
      $vuetify.display.lgAndUp ? 'd-flex align-center' : ''
    }`"
  >
    <v-row no-gutters>
      <v-col cols="12">
        <v-card
          :width="$vuetify.display.lgAndUp ? '35%' : '94.5%'"
          color="navigationDrawer"
          :class="`pa-5 ${$vuetify.display.mdAndDown ? 'ml-3 mt-10' : 'ml-16'}`"
          rounded="xl"
        >
          <v-card-text>
            <v-form @submit.prevent="submit()">
              <v-row>
                <slot name="form-header"></slot>

                <v-col cols="12" class="mt-4 text-subtitle-2">
                  Please Select
                  {{
                    currentUser.type === "admin"
                      ? "Organization & Site"
                      : "Site"
                  }}
                  Below
                </v-col>

                <v-col cols="12" v-if="currentUser.type === 'admin'">
                  <v-autocomplete
                    v-model:model-value="filterOrganization"
                    :items="organizations"
                    item-title="name"
                    item-value="_id"
                    label="Select Organization"
                    hide-details
                    density="comfortable"
                    :loading="isLoading"
                    :disabled="isLoading"
                    @update:modelValue="onSelectOrganization"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="filterSite"
                    :items="siteOptions"
                    item-title="name"
                    item-value="_id"
                    label="Select Site"
                    hide-details
                    density="comfortable"
                    :loading="isLoading"
                    :disabled="isLoading"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" class="mb-3">
                  <v-btn
                    class="rounded-lg"
                    color="blue"
                    block
                    size="large"
                    :disabled="!Boolean(filterSite)"
                    @click="submit()"
                  >
                    view
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure"],
});
const emit = defineEmits<{
  (event: "submit", query: any): void;
}>();
const props = defineProps<{
  bgImage: string;
}>();

const { setSnackbar } = useLocal();
const { organizations, setOrganizations } = useOrganization();
const { currentUser } = useLocalAuth();
const {
  getSitesOptionsForFiltering,
  siteOptions,
  filterOrganization,
  filterSite,
  fetchOrg,
} = useFilter();
const isLoading = ref(false);

onMounted(async () => {
  filterSite.value = "";
  try {
    isLoading.value = true;
    await Promise.all([setOrganizations(), getSitesOptionsForFiltering()]);
  } catch (error: any) {
    setSnackbar({ text: error.message || error, modal: true, type: "error" });
  } finally {
    isLoading.value = false;
  }
});
const { getSiteById, setSite } = useSite();

async function submit() {
  const _site = await getSiteById(filterSite.value);
  fetchOrg.value = String(_site?.organization);

  emit("submit", {
    query: queryString(),
  });
}

function queryString() {
  if (filterSite.value) {
    return { site: filterSite.value };
  } else {
    return undefined;
  }
}

async function onSelectOrganization() {
  isLoading.value = true;
  filterSite.value = "";
  await getSitesOptionsForFiltering();
  isLoading.value = false;
}
</script>
