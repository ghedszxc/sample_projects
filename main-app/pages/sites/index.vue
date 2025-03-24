<template>
  <v-row no-gutters class="fill-height" align-content="center">
    <v-col cols="12" class="text-h1 font-weight-bold text-center">
      Manage your sites here.
    </v-col>
  </v-row>
</template>

<script setup>
definePageMeta({
  middleware: "secure",
});
</script>
