<template>
  <v-row no-gutters class="fill-height pa-8" align-content="center">
    <v-col
      cols="12"
      class="text-xxl-h1 text-xl-h1 text-lg-h1 text-h4 text-md-h2 font-weight-bold text-center"
    >
      Notifications
    </v-col>
  </v-row>
</template>

<script setup>
definePageMeta({
  layout: "resident",
  middleware: "secure",
});
</script>
