<template>
  <v-row no-gutters class="fill-height" align-content="center">
    <v-col v-if="valid" cols="12" class="text-center">
      Thank you for verifying your email address. You can now
      <nuxt-link :to="{ name: 'login' }">login</nuxt-link>.
    </v-col>

    <v-col v-else-if="valid === false" cols="12" class="text-center">
      Invalid verification link, it either the link has expired or was already
      used. Want to try again?
      <nuxt-link :to="{ name: 'sign-up' }">Sign Up</nuxt-link>
    </v-col>

    <v-col v-else cols="12" class="text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-col>
  </v-row>
</template>

<script setup>
const valid = ref(null);

onMounted(async () => {
  const route = useRoute();
  const { error } = await useLocalFetch(
    `/api/auth/users/sign-up/${route.params.id}`,
    { method: "POST" },
  );
  if (error.value) valid.value = false;
  else valid.value = true;
});

definePageMeta({
  layout: "plain",
});
</script>
