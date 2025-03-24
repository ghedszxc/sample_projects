<template>
  <v-col
    cols="12"
    class="header d-flex justify-space-between align-center px-0 mb-5"
    @click="goBack()"
  >
    <v-col cols="12">
      <v-icon start size="x-large" style="position: relative; right: 17px">
        <v-img
          class="pl-0 ml-0 mt-1"
          src="/dark-mode/utility-all/right-arrow.svg"
          cover
        />
      </v-icon>
      <span
        style="position: relative; right: 23px; color: baseColor; width: 100%; font-size: 20px;"
      >
        {{ headerText }}
      </span>
    </v-col>
  </v-col>
</template>

<script setup>
defineProps({
  headerText: {
    type: String,
    default: "Back",
  },
});

const emit = defineEmits(["go-back"]);

const goBack = () => emit("go-back");
</script>
