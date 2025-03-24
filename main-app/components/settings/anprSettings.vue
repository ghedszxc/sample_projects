<template>
  <v-row no-gutters justify="center">
    <v-col cols="12" sm="4" md="4" lg="3" xl="3">
      <v-row class="pb-4">
        <v-col cols="12">
          <v-row no-gutters justify="center">
            <v-col
              cols="6"
              sm="4"
              md="4"
              lg="6"
              xl="6"
              class="mt-4 font-weight-bold text-h5"
            >
              ANPR Camera Settings</v-col
            >
            <v-col cols="6" sm="4" md="4" lg="6" xl="6" class="mt-4 text-end">
              <v-btn
                flat
                rounded="lg"
                color="#1867C0"
                class="px-6"
                @click="addNewCamera()"
                :disabled="isAddProgress"
                :loading="isAddProgress"
              >
                Add Camera
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col
          v-for="(camera, index) in siteSetting.anpr!.cameras"
          :key="index"
          cols="12"
        >
          <SettingsAnprCard
            v-model="siteSetting.anpr!.cameras[index]"
            :index="index"
            @remove="removeCamera(index)"
            @switch-change="onsubmit()"
            @test="testConnection($event)"
          />
        </v-col>

        <v-col cols="12" class="mt-4 text-end">
          <v-btn
            flat
            rounded="lg"
            color="#1867C0"
            class="px-6"
            @click="onsubmit()"
            :disabled="isProgress"
            :loading="isProgress"
          >
            Submit
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
const { setSnackbar } = useLocal();
const { siteSetting, getSiteSettingsById, updateSiteSettingsById } =
  useSiteSettings();
const { mySite } = useFilter();
const anprRef = ref<{
  showUnregisteredTransactions: boolean;
  cameras: TANPR[];
} | null>(null);

const canvas = ref({});

const isProgress = ref(false);
const isAddProgress = ref(false);

onMounted(async () => {
  if (siteSetting.value.anpr) anprRef.value = siteSetting.value.anpr;
});

const addNewCamera = () => {
  siteSetting.value.anpr!.cameras.push({
    isEnabled: false,
    api: null,
    username: null,
    password: null,
    channel: null,
    type: "CHECK-IN",
  });
};

const testConnection = async (camera: TANPR) => {
  // Implement test connection logic
};

const removeCamera = (index: number) => {
  siteSetting.value.anpr!.cameras.splice(index, 1);
};

async function onsubmit() {
  try {
    isProgress.value = true;

    await updateSiteSettingsById(
      siteSetting.value._id || "",
      siteSetting.value,
    );

    setSnackbar({
      text: "Site Settings updated",
      modal: true,
    });
  } catch (error: any) {
    isProgress.value = false;

    setSnackbar({
      text: error.message,
      modal: true,
      type: "error",
    });
  } finally {
    isProgress.value = false;
  }
}
</script>
