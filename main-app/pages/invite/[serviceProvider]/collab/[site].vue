<template>
  <v-row no-gutters class="fill-height" align-content="center">
    <v-col v-if="valid" cols="12" class="text-center">
      Thank you for accepting invitation to collaborate with site name.
      <nuxt-link
        :to="{
          name: 'collaboration',
        }"
        >Go To Site Invitation</nuxt-link
      >.
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "plain",
});

const siteId = computed(() => useRoute().params.site as string);
const serviceProvider = computed(
  () => useRoute().params.serviceProvider as string,
);
const { createSiteCollab } = useSiteCollab();
const valid = ref("true");
const { setSnackbar } = useLocal();
const route = useRoute();

onMounted(async () => {
  const result = await createSiteCollab({
    serviceProvider: serviceProvider.value,
    site: siteId.value,
    status: "approved",
  });
});
</script>
