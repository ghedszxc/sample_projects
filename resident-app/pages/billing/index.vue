<template>
  <v-row no-gutters justify="center" class="px-5">
    <v-col cols="12">
      <v-toolbar color="secondaryDark">
        <v-row no-gutters class="d-flex align-center mt-5">
          <v-col cols="8">
            <GoBackArrow header-text="Billing" @go-back="goBack" />
          </v-col>
          <v-col cols="4" style="margin-top: -29px; padding: 12px">
            <p @click="requestSOA">Request SOA</p>
          </v-col>
        </v-row>

        <template #extension>
          <v-tabs v-model="tabs" slider-color="transparent" grow stacked>
            <v-tab
              v-for="tab in tabsDetails"
              :key="tab.value"
              :value="tab.value"
              :text="tab.text"
              class="pb-2"
              :class="{
                'active-tab': tabs === tab.value,
                'inactive-tab': tabs !== tab.value,
              }"
            />
          </v-tabs>
        </template>
      </v-toolbar>

      <v-spacer />

      <v-tabs-window v-model="tabs">
        <v-tabs-window-item :value="1">
          <BillingInvoice />
        </v-tabs-window-item>

        <v-tabs-window-item :value="2">
          <BillingHistory/>
        </v-tabs-window-item>

        <v-tabs-window-item :value="3">
          <BillingHistory/>
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

// Props

// Emits

// Utilities
const { theme } = useLocal();
const { currentUser } = useLocalAuth();
const router = useRouter();

// Local State
const tabs = ref(1);

const tabsDetails = ref([
  {
    value: 1,
    text: "Current Invoice",
  },
  {
    value: 2,
    text: "Payment Status",
  },
  {
    value: 3,
    text: "Billing History",
  },
]);

// Computed
const cardDesign = computed(() =>
  theme.value === "dark" ? "card-light" : "card-dark",
);

// Methods
const goBack = () => useRouter().push({ name: "resident" });

const requestSOA = () => router.push("billing/request-SOA");

// onMounted
onMounted(async () => {});
</script>

<style lang="scss" scoped>
.menu-icon {
  width: 19px;
  height: 19px;
}

.info-card {
  border: 1px solid #f2f2f2;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}

.style-card {
  font-size: 12px;
  border: 1px solid #343a45;
  padding: 10px;
  border-radius: 8px;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.v-tab {
  border-bottom: 1px solid #ffffff;
  transition: border-color 0.3s ease;
}

.active-tab {
  border-bottom: 1px solid #eb261e;
}
</style>
