<template>
  <div class="d-flex align-center">
    <v-avatar
      v-if="item"
      size="small"
      :color="stringToColor(getFullName(item.name || ''))"
      class="mr-4 mr-sm-1 mr-lg-3"
    >
      <v-img
        :src="`/api/files/${item.profilePicture}`"
        v-if="item.profilePicture"
      ></v-img>
      <template v-else>
        {{ getInitial(getFullName(item.name || "")) }}
      </template>
    </v-avatar>
    <span
      v-if="isIcon"
      class="text-body-2 mr-sm-2 text-capitalize"
      style="word-break: break-word; white-space: normal"
      >{{ item?.name || "" }}
      <div class="text-muted">
        {{ `${item && item.type ? `(${item.type})` : ""}` }}
      </div></span
    >
  </div>
</template>

<script setup lang="ts">
const { stringToColor, getInitial, getFullName } = useUtils();

const props = defineProps({
  item: {
    type: Object,
  },
  isIcon: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.text-muted {
  color: #d6d6d6;
}
</style>
