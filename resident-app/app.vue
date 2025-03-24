<template>
  <ClientOnly>
    <NuxtLayout>
      <Snackbar
        :text="defaultSnackbarText"
        :type="defaultSnackbarType"
        v-model="defaultSnackbar"
      />
      <NuxtPage page-key="static" />
      <google-translate v-show="false" />
    </NuxtLayout>
  </ClientOnly>
</template>

<script setup lang="ts">
const { defaultSnackbar, defaultSnackbarText, defaultSnackbarType } =
  useLocal();
</script>
