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
        Bluetooth Access
      </span>
    </v-col>

    <v-col cols="12" class="px-12 mt-4 text-center">
      <v-card color="transparent">
        <v-card-text class="px-0">
          <v-img
            :class="`${!remainingTime && 'mt-12'} ma-4`"
            :height="remainingTime ? 300 : 200"
            :src="`${remainingTime ? '/wifi-signal-red.svg' : '/wifi-signal-green.svg'}`"
          />

          <div :class="`${!remainingTime && 'mt-12'} px-12`">
            {{
              `${remainingTime ? "Please stand in within 1 meter of the door for" : "Door Unlocked!"}`
            }}
          </div>

          <div
            class="border rounded-xl pa-3 w-50 mx-auto mt-4"
            v-if="remainingTime"
          >
            <v-icon color="red">mdi-timer-outline</v-icon>
            {{ remainingTimeTextFormat }}
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const props = defineProps<{
  data: any;
}>();

const remainingTime = ref(10);
const remainingTimeTextFormat = ref("00:00");

onMounted(async () => {
  let getCount = remainingTime.value;

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
});
</script>
