<template>
    <v-card
        width="100%"
        :elevation="elevation"
        height="100%"
        :loading="loading"
      >
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>
        <slot></slot>
    </v-card>
</template>

<script setup>
defineProps({
  loading: Boolean,
  elevation: {
    type: Number,
    default: 3
  }
});
</script>
