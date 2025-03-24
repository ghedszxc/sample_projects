<template>
  <VitePwaManifest />
  <ClientOnly>
    <NuxtLayout>
      <Snackbar
        :text="defaultSnackbarText"
        :type="defaultSnackbarType"
        v-model="defaultSnackbar"
        :highlight="defaultSnackbarHighlight"
        @redirect="defaultSnackbarCallback()"
      />
      <NuxtPage page-key="static" />
    </NuxtLayout>
  </ClientOnly>
</template>

<script setup lang="ts">
const {
  defaultSnackbar,
  defaultSnackbarText,
  defaultSnackbarType,
  defaultSnackbarHighlight,
  defaultSnackbarCallback,
} = useLocal();
</script>
