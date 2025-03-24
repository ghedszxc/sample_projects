<template>
  <v-row no-gutters class="d-flex px-6 pb-0 mb-0">
    <v-col cols="12" class="">
      <v-row no-gutters justify="start" class="mt-6">
        <v-col cols="12" class="header">
          <v-icon
            start
            size="x-large"
            @click="goBack()"
            style="position: relative; right: 10px"
          >
            <v-img
              class="pl-0 ml-0 mt-1"
              src="/dark-mode/utility-all/right-arrow.svg"
              cover
            ></v-img>
          </v-icon>
          <span
            style="position: relative; right: 15px; bottom: 1px"
            :class="textBackColor"
          >
            Go Back</span
          >
        </v-col>
        <v-col cols="12" class="mt-3">
          <v-card class="rounded-xl mx-auto pa-6 border-card">
            <v-row no-gutters>
              <v-col
                cols="2 "
                prepend-icon="mdi-account"
                class="d-flex justify-center"
              >
                <v-avatar size="46" class="box-shadow-red pa-2" color="#E0241C">
                  <v-img
                    class="pa-1"
                    width="46px"
                    height="46px"
                    src="/dark-mode/create-account/icons/info-1.svg"
                    cover
                  ></v-img>
                </v-avatar>
              </v-col>
              <v-col cols="10 pl-3">
                <span class="text-hello"> Hello,</span>
                <br />

                <span class="text-box-content">
                  Before you create an account please read and accept our terms
                  and conditions
                </span>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12"> <TermsAndConditions /></v-col>
      </v-row>
      <!-- <v-row justify="center" class="fixed-button mx-3"> -->
      <v-btn
        color="#E0241C"
        style="height: 60px"
        rounded="lg"
        block
        @click="handleAgreedToTerms"
        class="mb-3"
      >
        <span style="font-size: 16px">Agree</span>
      </v-btn>

      <!-- <v-btn
        color="#E0241C"
        style="height: 60px"
        rounded="lg"
        block
        @click="handleAgreedToTerms"
      >
        <span style="font-size: 16px">Agree</span>
      </v-btn> -->
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "only-footer",
});
const { theme } = useLocal();
import TermsAndConditions from "../../components/terms-and-conditions.vue";
const agreedToTerms = ref(false);

function goBack() {
  useRouter().push({ name: "index" });
}

const textBackColor = computed(() =>
  theme.value === "dark" ? "text-back-dark" : "text-back",
);

const handleAgreedToTerms = () => {
  agreedToTerms.value = true;
  useRouter().push({ name: "create-account-info" });
};
</script>

<style scoped>
.fixed-button {
  position: relative;
  bottom: 0;
  right: 0;
  left: 0;
}

.text-content {
  color: #052439;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 24px; /* 150% */
}

.text-title {
  color: #052439;
  text-align: left;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 100% */
}

.text-box-content {
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 24px; /* 150% */
}

.text-hello {
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 150% */
}
.card-content {
  color: #052439;
}
.text-back {
  color: #052439;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
}
.text-back-dark {
  color: #fcfcfc;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
}

.box-shadow-red {
  box-shadow: 0px 5px 14px 0px rgba(235, 38, 30, 0.5);
}

.border-card {
  border-radius: 24px;
  /* border: 2px solid var(--dark-grey-border, #343a45); */
  border: 2px solid var(--stroke-light-mode, rgba(185, 184, 192, 0.2));
  /* card-ds */
  box-shadow: 0px 0px 14px 0px rgba(255, 255, 255, 0.1);
}
</style>
