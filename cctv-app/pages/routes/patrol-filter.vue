<template>
  <filter-page
    v-if="$ability.can('read', 'view-virtual-patrol')"
    :bgImage="`${useRuntimeConfig().public.S3_BUCKET}/images/bg/security.jpg`"
    @submit="submit($event)"
  >
    <template v-slot:form-header>
      <v-col cols="12" style="font-size: 24px">
        <v-row no-gutters>
          <v-col cols="2">
            <v-icon class="mr-2" :size="40">mdi-alert-circle-outline</v-icon>
          </v-col>
          <v-col cols="10" class="mt-3"> Patrol Log List </v-col>
        </v-row>
      </v-col>
    </template>
  </filter-page>
</template>

<script setup lang="ts">
const { $ability } = useNuxtApp();
function submit(value: { query: any }) {
  useRouter().push({
    name: "routes-patrol-logs",
    query: value.query,
  });
}
</script>
