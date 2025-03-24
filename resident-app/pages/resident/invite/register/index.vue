<template>
  <v-row no-gutters class="fill-height" align-content="center">
    <v-col cols="12" style="position: absolute">
      <v-row no-gutters class="px-6 pt-6">
        <v-col cols="12" class="d-flex justify-end align-center">
          <div @click="cancel()" style="cursor: pointer">
            <v-avatar rounded="0" style="width: 24px; height: 24px">
              <v-img :src="BackIconimgSrc" cover></v-img>
            </v-avatar>
            <!-- <v-avatar rounded="0" style="width: 24px; height: 24px">
              <v-img src="/images/forgot-password/x-icon.svg" cover></v-img>
            </v-avatar> -->
          </div>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12">
      <v-row no-gutters justify="center">
        <!-- gif icon -->
        <v-col cols="12" style="margin-top: 100px">
          <v-row no-gutters justify="center">
            <v-img
              src="/icons/resident/home/invite-visitor/expired-link-red.svg"
              style="width: 120px; height: 120px"
            ></v-img>
          </v-row>
        </v-col>

        <v-col
          cols="12"
          class="text-capitalize text-center mt-"
          style="
            color: #052439;
            font-size: 32px;
            font-weight: 600;
            line-height: 30px;
          "
          :style="{ color: textColor }"
        >
          expired link
        </v-col>

        <v-col
          cols="8"
          class="mt-4"
          style="
            color: #555e6f;
            text-align: center;
            font-size: 16px;
            font-weight: 400;
            line-height: 30px;
          "
        >
          {{ message }} Please contact your inviter for further information.
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "plain-footer-none",
});
const { theme } = useLocal();

const message = ref("Your invitation link has been expired.");
onMounted(() => {
  if (!theme.value) theme.value = "light";
  const route = useRoute();
  const msg = route.query.msg as string;
  if (msg) message.value = msg;
});

const imgSrc = computed(() =>
  theme.value === "dark"
    ? "/dark-mode/forgot-password/images/dark-mode-up.svg"
    : "/dark-mode/forgot-password/images/light-mode-up.svg",
);

const BackIconimgSrc = computed(() =>
  theme.value === "dark"
    ? "/dark-mode/forgot-password/images/back.svg"
    : "/dark-mode/forgot-password/images/back-light.svg",
);

const textColor = computed(() =>
  theme.value === "dark" ? "#FFFFFF" : "#0F131C",
);

function cancel() {
  useRouter().push({ name: "resident" });
}
</script>
