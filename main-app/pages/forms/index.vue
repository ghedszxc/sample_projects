<template>
  <v-row no-gutters :class="$vuetify.display.mdAndUp ? 'pa-8' : 'py-8 px-4'">
    <BaseGCard :elevation="1">
      <v-col cols="12" class="pa-0">
        <FormsTable />
      </v-col>
    </BaseGCard>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});
</script>

<style>
.w-45 {
  width: 45%;
}
</style>
