<template>
  <v-row v-if="!pageShow" no-gutters>
    <v-col cols="12" class="mx-4 mt-4 mb-8">
      <span class="d-flex align-center">
        <v-icon color="red" class="cursor-pointer mr-4" @click="goBack()">
          mdi-chevron-left
        </v-icon>
        <span> Intelligent Lock </span>
      </span>
    </v-col>
    <v-col cols="12">
      <v-img
        class="ma-4"
        height="50"
        :src="`/icons/resident/home/${theme === 'dark' ? 'dark' : 'light'}/security.svg`"
      />
      <div class="text-center text-h5">Intelligent Lock</div>
    </v-col>

    <v-col cols="12" class="px-4 mt-6">
      <div v-if="isAccessCardLoading">
        <v-skeleton-loader
          class="rounded-xl"
          :elevation="4"
          type="list-item"
          height="80"
        ></v-skeleton-loader>
      </div>
      <v-list v-else class="rounded-lg">
        <v-list-item @click="pageShow = 'doorAndLift'">
          <span class="text-body-2"> QR Code Access </span>

          <template #append>
            <v-icon color="grey-lighten-1">mdi-qrcode</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-col>

    <v-col cols="12" class="px-4 mt-3">
      <div v-if="isAccessCardLoading">
        <v-skeleton-loader
          class="rounded-xl"
          :elevation="4"
          type="list-item"
          height="80"
        ></v-skeleton-loader>
      </div>
      <v-list v-else class="rounded-lg">
        <v-list-item @click="pageShow = 'bluetoothAccess'">
          <span class="text-body-2"> Bluetooth Access </span>

          <template #append>
            <v-icon color="grey-lighten-1">mdi-cellphone-wireless</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
  <v-row v-else no-gutters>
    <v-col cols="12" class="mx-4 mt-4">
      <span class="text-h6">
        <v-icon color="red" class="cursor-pointer mr-2" @click="pageShow = ''">
          mdi-chevron-left
        </v-icon>
        {{
          pageShow == "doorAndLift" ? "Intelligent Lock" : "Bluetooth Access"
        }}
      </span>
    </v-col>

    <v-col cols="12" class="px-4 mt-6">
      <v-tabs v-model="tab" grow slider-color="red">
        <v-tab value="lift">
          <span class="text-body-2 text-white">Lift</span>
        </v-tab>
        <v-tab value="door">
          <span class="text-body-2 text-white">Door</span>
        </v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="lift">
          <intelligent-lock-lift :page-show="pageShow" />
        </v-tabs-window-item>

        <v-tabs-window-item value="door">
          <intelligent-lock-door-and-gate :page-show="pageShow" />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

const { theme } = useLocal();
const {
  isAccessCardLoading,
  getAccessCard,
  accessCard,
  getLiftAccessLevels,
  getDoorAccessLevels,
} = useEntryPass();
const { currentUser } = useLocalAuth();

const pageShow = ref("");
const tab = ref("lift");
const doorItems = ref<{ description: string; name: string }[]>([]);

onMounted(() => {
  getAccessCard({
    user: currentUser.value._id,
  });
});

async function goBack() {
  await navigateTo("/resident");
}
</script>

<style scoped></style>
