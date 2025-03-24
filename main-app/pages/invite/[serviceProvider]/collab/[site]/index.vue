<template>
  <div v-if="isAlreadyExist">Site Invitation is Already exist!</div>
  <div v-else>You Successfully Accepted the Invite for Site Invitation!</div>
  <v-btn
    :to="{
      name: 'collaboration',
    }"
    >Redirect to Site Invitation Please</v-btn
  >
</template>

<script setup lang="ts">
import type { TSiteCollab } from "~/types/site-collaboration";

definePageMeta({
  layout: "plain",
});
const { createSiteCollab } = useSiteCollab();
const { setSnackbar } = useLocal();
const route = useRoute();

const isAlreadyExist = ref(false);

onMounted(async () => {
  try {
    const payload = {
      serviceProvider: route.params.serviceProvider,
      site: route.params.site,
      status: "pending",
    } as TSiteCollab;
    const response = await createSiteCollab(payload);
    setSnackbar({
      text: response.message,
      modal: response.data.acknowledged,
      type: "success",
    });
  } catch (error: any) {
    isAlreadyExist.value = true;
    setSnackbar({ text: error || error.message, modal: true, type: "error" });
  }
});
</script>
