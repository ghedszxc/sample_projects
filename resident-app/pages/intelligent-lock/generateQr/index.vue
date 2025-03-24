<template>
  <v-row no-gutters>
    <v-col cols="12" class="mx-4 mt-4">
      <span class="text-h6">
        <v-icon
          color="red"
          class="cursor-pointer mr-2"
          @click="useRouter().push('/intelligent-lock/')"
        >
          mdi-chevron-left
        </v-icon>
        {{ type }} Access
      </span>
    </v-col>
    <v-col cols="12" class="px-4 mt-4" v-if="remainingTime">
      <div class="border rounded-xl px-3 py-2">
        <v-icon color="red">mdi-timer-outline</v-icon>
        QR code will expire in
        <span class="float-right pr-2">{{ remainingTimeTextFormat }}</span>
      </div>
    </v-col>
    <v-col cols="12" class="px-4 mt-4 text-center">
      <v-card elevation="5">
        <v-card-title class="pt-5">{{ access }}</v-card-title>
        <v-divider class="mt-2" />
        <v-card-text class="px-0">
          <v-card class="qrcode-card text-center" flat>
            <div
              v-if="remainingTime > 0"
              class="d-flex flex-column justify-space-between"
            >
              <div class="d-flex justify-space-between">
                <qrcode-vue
                  :value="value"
                  level="H"
                  :render-as="renderAs"
                  :size="40"
                />
                <qrcode-vue
                  :value="value"
                  level="H"
                  :render-as="renderAs"
                  :size="40"
                />
              </div>
              <div class="d-flex justify-center">
                <qrcode-vue
                  :value="value"
                  level="H"
                  :render-as="renderAs"
                  :size="200"
                />
              </div>
              <div class="d-flex justify-space-between">
                <qrcode-vue
                  :value="value"
                  level="H"
                  :render-as="renderAs"
                  :size="40"
                />
                <qrcode-vue
                  :value="value"
                  level="H"
                  :render-as="renderAs"
                  :size="40"
                />
              </div>
            </div>

            <div v-else></div>
          </v-card>
          <v-divider class="mb-5" />
          <div v-if="remainingTime <= 0" class="px-12">
            Please be informed that the previous QR code has expired. Kindly
            generate a new one. Thank you.
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" class="px-4 mt-12">
      <v-btn
        :class="`${remainingTime <= 0 ? 'bg-red-darken-4' : 'bg-gray'} py-5`"
        size="small"
        block
        @click="onGenerateQr()"
        :disabled="remainingTime > 0"
        >Generate New QR Codes</v-btn
      >
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

import QrcodeVue from "qrcode.vue";
import type { Level, RenderAs } from "qrcode.vue";

const { accessCard } = useEntryPass();

const value = computed(() =>
  accessCard.value.qrData.toString().padStart(9, "0"),
);
const level = ref<Level>("L");
const renderAs = ref<RenderAs>("svg");
const remainingTime = ref(0);
const remainingTimeTextFormat = ref("00:00");
const route = useRoute();

const access = computed(() => route.query.access);
const type = computed(() => route.query.type);

onMounted(() => {
  onGenerateQr();
});

async function onGenerateQr() {
  remainingTime.value = 15;
}

watch(remainingTime, (newVal) => {
  if (newVal) {
    let getCount = newVal;

    remainingTimeTextFormat.value = `00:${getCount <= 9 ? "0" + getCount : getCount}`;
    const countRemainingTime = setInterval(() => {
      remainingTimeTextFormat.value = `00:${getCount <= 9 ? "0" + getCount : getCount}`;
      getCount--;

      if (!getCount) {
        setTimeout(() => {
          clearInterval(countRemainingTime);
          remainingTimeTextFormat.value = `00:00`;
          remainingTime.value = 0;
        }, 1000);
      }
    }, 1000);
  }
});
</script>

<style scoped>
.qrcode-card {
  font-size: 12px;
  line-height: 24px;
  border: 1px solid #f2f2f2;
  border-radius: 16px;
  padding: 20px 42px 20px 42px;
  background: #fff;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}
</style>
