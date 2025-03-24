<template>
  <filter-page
    :bgImage="`${useRuntimeConfig().public.S3_BUCKET}/images/bg/building.jpg`"
    @submit="submit($event)"
  >
    <template v-slot:form-header>
      <v-col cols="12" style="font-size: 24px">
        <v-row no-gutters align="center">
          <v-col cols="2">
            <v-icon>mdi-domain</v-icon>
          </v-col>
          <v-col cols="10" class="mt-3"> Building Management </v-col>
        </v-row>
      </v-col>
    </template>
  
  </filter-page>
</template>

<script setup lang="ts">
function submit(value: { query: any }) {
	useRouter().push({
    name: "building-blocks",
		query: value.query,
	});
}
</script>