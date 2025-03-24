<template>
  <v-row no-gutters class="px-6">
    <!-- go back -->
    <v-col
      cols="6"
      :class="`mt-8 ${$vuetify.display.smAndUp ? 'px-6' : 'px-3'}`"
      @click="goBack()"
    >
      <v-icon start size="x-large" style="position: relative; right: 10px">
        <v-img
          class="pl-0 ml-0 mt-2"
          src="/dark-mode/utility-all/right-arrow.svg"
          cover
        ></v-img>
      </v-icon>
      <span style="position: relative; right: 15px"> Go Back </span>
    </v-col>

    <div><TermsAndConditions /></div>
  </v-row>
</template>
<script setup lang="ts">
import TermsAndConditions from "~/components/terms-and-conditions.vue";
definePageMeta({
  layout: "resident-bottom-navigation",
});

const { theme } = useLocal();

const back = computed(() =>
  theme.value === "dark" ? "go-back-dark" : "go-back-light",
);

const cardHeader = computed(() =>
  theme.value === "dark" ? "card-header-dark" : "card-header-light",
);

onMounted(() => {
  if (!theme.value) theme.value = "light";
});

function goBack() {
  useRouter().push({ name: "menu" });
}
</script>

<style scoped>
.chevron-icon {
  filter: drop-shadow(0px 4px 10px #d01b1b);
}
.go-back-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}
.go-back-dark {
  color: #fcfcfc;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.card-header-light {
  height: 129px;
  width: 100%;
  border-radius: 16px;
  border: 2px solid var(--dark-grey-border, #343a45);
  background: var(--Corporate-blue, #111723);
  box-shadow: 0px 5px 14px 0px rgba(15, 14, 20, 0.1);
}
.card-header-dark {
  height: 129px;
  width: 100%;
  border-radius: 16px;
  border: 2px solid var(--dark-grey-border, #343a45);
  background: var(--Corporate-blue, #111723);
  box-shadow: 0px 0px 14px 0px rgba(255, 255, 255, 0.1);
}
.card-icon-information {
  width: 48px;
  height: 48px;
  border-radius: 100px;
  background: var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(235, 38, 30, 0.3);
}
.information-icon {
  width: 24px;
  height: 24px;
}
</style>
