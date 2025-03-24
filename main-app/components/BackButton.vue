<template>
  <v-btn
    fav
    density="compact"
    icon="mdi-chevron-left"
    variant="text"
    class="mb-1"
    @click="goBack()"
  >
  </v-btn>
</template>
<script setup lang="ts">
function goBack() {
  useRouter().back();
}
</script>
