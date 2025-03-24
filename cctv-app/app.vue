<template>
  <ClientOnly>
    <VitePwaManifest />
    <NuxtLayout>
      <Snackbar
        :text="defaultSnackbarText"
        :type="defaultSnackbarType"
        v-model="defaultSnackbar"
      />
      <NuxtPage page-key="static" />
    </NuxtLayout>
  </ClientOnly>
</template>
<script setup lang="ts">
const { defaultSnackbar, defaultSnackbarText, defaultSnackbarType } =
  useLocal();
</script>
