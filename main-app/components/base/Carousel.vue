<template>
  <v-carousel :show-arrows="imgUrls.length > 1">
    <v-carousel-item
      :class="clickable ? 'cursor-pointer' : ''"
      v-for="(url, idx) in imgUrls"
      :key="idx"
      :src="url"
      cover
      @click="clickable && emit('onClickCarousel', url)"
    >
      <template #placeholder>
        <v-skeleton-loader height="100%" width="100%" />
      </template>
    </v-carousel-item>
  </v-carousel>
</template>
<script setup lang="ts">
const emit = defineEmits<{
  (event: "onClickCarousel", url: string): void;
}>();

const props = defineProps<{
  urls: string[];
  clickable?: boolean;
}>();

const imgUrls = computed(() => {
  return props.urls.map((u) => {
    if (u.split("/").length > 1) return u;
    else return `/api/files/${u}`;
  });
});
</script>
