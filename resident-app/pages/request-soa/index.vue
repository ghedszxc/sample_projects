<template>
  <v-row no-gutters justify="center" class="px-5">
    <v-col cols="12">
      <v-toolbar color="secondaryDark">
        <v-row no-gutters class="d-flex align-center mt-5">
          <GoBackArrow header-text="Request SOA" @go-back="goBack" />
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
          <RequestSoaRequest @onRequest="onRequest" />
        </v-tabs-window-item>

        <v-tabs-window-item :value="2">
          <RequestSoaPending />
        </v-tabs-window-item>

        <v-tabs-window-item :value="3">
          <RequestSoaComplete />
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

//Imports
import moment from "moment";

// Utilities
const { theme } = useLocal();
const { requestSOA } = useSOA();
const { currentUser } = useLocalAuth();

// Local State
const tabs = ref(1);

const tabsDetails = ref([
  {
    value: 1,
    text: "Request",
  },

  {
    value: 2,
    text: "Pending",
  },
  {
    value: 3,
    text: "Complete",
  },
]);

// Computed

// Methods
const goBack = () => useRouter().push({ name: "resident" });

const onRequest = async (fromDate: Date, toDate: Date) => {
  
  const unitId = currentUser.value.unitNumber;
  const dateFrom = moment(fromDate).format("YYYY-MM-DD");
  const dateTo = moment(toDate).format("YYYY-MM-DD");
  const site = currentUser.value.site;
  const organization = currentUser.value.organization;
  const userId = currentUser.value._id;

  await requestSOA(unitId, dateFrom, dateTo, site, organization, userId);

  tabs.value = 2
};

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
