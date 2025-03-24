<template>
  <div>
    <v-list class="bg-transparent">
      <v-list-item
        class="pb-3 mb-8 mt-2 border-thin rounded-lg"
        style="background: #111723"
      >
        <v-text-field placeholder="Search" variant="plain" hide-details>
          <template #append>
            <v-icon color="grey-lighten-1">mdi-magnify</v-icon>
          </template>
        </v-text-field>
      </v-list-item>

      <div v-if="isLoading">
        <v-skeleton-loader
          class="rounded-xl mb-4"
          :elevation="4"
          type="list-item"
          height="60"
          v-for="i in 10"
          :key="i"
        ></v-skeleton-loader>
      </div>
      <template v-if="!isLoading" v-for="(item, key) in doorItems" :key="key">
        <v-list-item
          class="my-2 py-3 border-thin rounded-lg"
          style="background: #111723"
          @click="
            onGenerate(
              props.pageShow == 'doorAndLift'
                ? '/intelligent-lock/generateQr'
                : '/intelligent-lock/bluetoothAccess',
              `Glass Door ${item.no}`,
            )
          "
        >
          <span class="text-body-2"> Glass Door {{ item.no }} </span>

          <template #append>
            <v-icon color="grey-lighten-1"> mdi-qrcode </v-icon>
          </template>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const props = defineProps<{
  pageShow: string;
}>();

const { getDoorAccessLevels } = useEntryPass();
const router = useRouter();

const doorItems = ref<{ description: string; no: string }[]>([
  { description: "1", no: "1" },
]);
const isLoading = ref(false);

onMounted(() => {
  // getDoors();
});

async function onGenerate(to: string, access: string) {
  router.push({ path: to, query: { type: "Door", access } });
}

async function getDoors() {
  try {
    isLoading.value = true;
    const result = await getDoorAccessLevels();
    isLoading.value = false;
    if (result) doorItems.value = result;
  } catch (error) {
    isLoading.value = false;
    console.error(error);
  }
}
</script>
