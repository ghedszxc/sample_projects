<template>
  <filter-page
    :bgImage="`${useRuntimeConfig().public.S3_BUCKET}/images/bg/dob.jpg`"
    @submit="submit($event)"
  >
    <template v-slot:form-header>
      <v-col cols="12">
        <v-icon class="mr-2" :size="40">
          mdi-table-question
        ></v-icon>
        <span
          style="
            font-size: 24px;
            font-style: normal;
            font-weight: 400;
            line-height: 19px;
            position: relative;
            top: 7px;
          "
        >
          Daily Occurrence Book</span
        >
      </v-col>
    </template>
  
  </filter-page>
</template>

<script setup lang="ts">


function submit(queryString: String) {
  useRouter().push({
    name: "occurrences",
    query: queryString.query,
  });
}

</script>