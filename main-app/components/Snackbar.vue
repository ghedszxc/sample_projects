<template>
  <v-snackbar
    :timeout="props.timeout"
    :color="props.type"
    v-model="internalVisible"
    :style="snackbarStyle"
    multi-line
    location="bottom center"
  >
    {{ text }}
    <span
      v-if="props.highlight"
      @click="emit('redirect')"
      class="cursor-pointer text-decoration-underline"
      >{{ props.highlight }}.</span
    >
    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        @click="closeSnackbar"
        icon="mdi-close"
      >
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "success",
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  timeout: {
    type: Number,
    default: 8000,
  },
  highlight: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "redirect"]);
const internalVisible = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    internalVisible.value = newValue;
  },
);

watch(internalVisible, (newValue) => {
  emit("update:modelValue", newValue);
});

const closeSnackbar = () => {
  internalVisible.value = false;
};

const snackbarStyle = computed(() => {
  switch (props.type) {
    case "success":
    case "warning":
    case "error":
    default:
      return {};
  }
});
</script>
