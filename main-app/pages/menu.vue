<template>
  <v-row no-gutters class="fill-height pa-2 d-flex">
    <v-col cols="12">
      <v-row no-gutters>
        <v-col cols="12" class="text-h4 font-weight-black pa-2"> Menu </v-col>
        <v-col cols="12" class="pa-2">
          <v-card class="pa-3">
            <v-avatar class="mr-2">
              <v-img src="/the-pardoned-chicken.jpg"></v-img>
            </v-avatar>
            <span class="font-weight-bold text-h6">
              {{ currentUser?.givenName }} {{ currentUser?.surname }}
            </span>
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" class="pa-2">
      <v-row no-gutters class="fill-height" align-content="end">
        <v-btn block variant="tonal" :to="{ name: 'logout' }"> logout </v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup>
definePageMeta({
  layout: "resident",
  middleware: "secure",
});
const { currentUser } = useLocalAuth();
</script>
