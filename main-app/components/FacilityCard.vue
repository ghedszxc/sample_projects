<template>
  <v-row no-gutters class="pa-0">
    <v-col cols="12" lg="4" class="mb-4 pr-5">
      <v-card
        :style="{
          width: '100%',
          border: `thin solid ${theme == 'dark' ? '#000000' : '#EEEEEE'} !important`,
          borderRadius: '15px',
        }"
        class="override_shadow"
      >
        <v-card-title class="py-4">
          <v-row justify="space-between">
            <v-col
              cols="8"
              class="align-self-center text-body-2 text-wrap font-weight-medium"
            >
              Total number of Bookings
            </v-col>
            <v-col cols="4" class="text-end">
              <v-icon size="small" color="orange">mdi-calendar</v-icon>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row justify="space-between" align="end">
            <v-col cols="8" class="text-h3 pt-2"> 300 </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="6" class="d-flex align-center justify-start">
              <v-avatar variant="outlined" color="surface-variant">
                <v-icon size="13">mdi-trending-up</v-icon>
              </v-avatar>
              <span class="text-caption font-weight-medium ml-2"> 10% </span>
            </v-col>
            <!-- dropdown -->
            <v-col cols="6" class="d-flex justify-end">
              <v-select
                :items="items"
                v-model="selectedItem"
                label="Select Period"
                color="default"
                dense
                hide-details
                class="white--text"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" lg="4" class="mb-4 pr-5">
      <v-card
        :style="{
          width: '100%',
          border: `thin solid ${theme == 'dark' ? '#000000' : '#EEEEEE'} !important`,
          borderRadius: '15px',
        }"
        class="override_shadow"
      >
        <v-card-title class="py-4">
          <v-row justify="space-between">
            <v-col
              cols="8"
              class="align-self-center text-body-2 text-wrap font-weight-medium"
            >
              Total number of Upcoming Bookings
            </v-col>
            <v-col cols="4" class="text-end">
              <v-icon size="small" color="orange">mdi-calendar</v-icon>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row justify="space-between" align="end">
            <v-col cols="8" class="text-h3 pt-2"> 100 </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="6" class="d-flex align-center justify-start">
              <v-avatar variant="outlined" color="surface-variant">
                <v-icon size="13">mdi-trending-up</v-icon>
              </v-avatar>
              <span class="text-caption font-weight-medium ml-2"> 10% </span>
            </v-col>
            <v-col cols="6" class="d-flex justify-end">
              <v-select
                :items="items"
                v-model="selectedItem"
                label="Select Period"
                color="default"
                dense
                hide-details
                class="white--text"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" lg="4" class="mb-4 pr-5">
      <v-card
        :style="{
          width: '100%',
          border: `thin solid ${theme == 'dark' ? '#000000' : '#EEEEEE'} !important`,
          borderRadius: '15px',
        }"
        class="override_shadow"
      >
        <v-card-title class="py-4">
          <v-row justify="space-between">
            <v-col
              cols="8"
              class="align-self-center text-body-2 text-wrap font-weight-medium"
            >
              Total number of Cancelled Bookings
            </v-col>
            <v-col cols="4" class="text-end">
              <v-icon size="small" color="orange">mdi-calendar</v-icon>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row justify="space-between" align="end">
            <v-col cols="8" class="text-h3 pt-2"> 100 </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="6" class="d-flex align-center justify-start">
              <v-avatar variant="outlined" color="surface-variant">
                <v-icon size="13">mdi-trending-up</v-icon>
              </v-avatar>
              <span class="text-caption font-weight-medium ml-2"> 10% </span>
            </v-col>
            <v-col cols="6" class="d-flex justify-end">
              <v-select
                :items="items"
                v-model="selectedItem"
                label="Select Period"
                color="default"
                dense
                hide-details
                class="white--text"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const { theme } = useLocal();
const items = ["Today", "Last 7 days", "Last 30 days"];

// Create a ref to hold the selected item and set "Today" as the default
const selectedItem = ref("Today");
</script>

<style scoped>
:deep() .v-avatar {
  height: 20px !important;
  width: 20px !important;
  border-radius: 15% !important;
}

.override_shadow {
  box-shadow: 0px 13px 19px -13px rgba(0, 0, 0, 0.15);
  -webkit-box-shadow: 0px 13px 19px -13px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 13px 19px -13px rgba(0, 0, 0, 0.15);
}
</style>
