<template>
  <!--Unreturned-Contractor-Keys-->
  <v-list-item
    class="text-caption text-grey"
    v-if="event === 'unreturned-contractor-passkeys'"
  >
    <template v-slot:prepend>
      <v-avatar size="x-small" :color="materialColors[key]">
        {{ getInitial(data?.name) }}
      </v-avatar>
    </template>
    {{ data?.name }} haven't return the pass keys of
    {{ data?.passKeyNumber }}
  </v-list-item>

  <!--Unreturned-Contractor-Keys-->
  <!-- <v-list-item
    class="text-caption text-grey"
    v-if="event === 'unreturned-contractor-passkeys'"
  >
    <template v-slot:prepend>
      <v-avatar size="x-small" :color="materialColors[key]">
        {{ getInitial(data?.name) }}
      </v-avatar>
    </template>
    {{ data?.name }} haven't return the pass keys of
    {{ data?.passKeyNumber }}
  </v-list-item> -->
</template>
<script setup lang="ts">
const { getInitial } = useUtils();
defineProps<TNotification & { materialColors: string[]; key: any }>();
</script>
