<template>
  <v-row no-gutters class="pa-8">
    <v-col
      cols="12"
      class="text-h6 font-weight-bold"
      style="letter-spacing: 2px !important"
    >
      Contact Reference
    </v-col>
    <v-col cols="12" class="font-weight-light mt-4">
      <v-card
        width="100%"
        elevation="0"
        style="border-width: thin"
        min-height="368px"
        class="d-flex justify-center align-center"
      >
        <v-row no-gutters class="pa-4" justify="center">
          <v-col>
            <v-row no-gutters justify="center">
              <v-img src="/empty.svg" width="100px" height="100px"></v-img>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
definePageMeta({
  middleware: "secure",
});
</script>
