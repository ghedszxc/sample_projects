<template>
  <v-snackbar
    :timeout="5000"
    :color="props.type"
    v-model="internalVisible"
    :style="snackbarStyle"
    multi-line
    :location="$vuetify.display.mdAndUp ? 'bottom center' : 'left'"
  >
    {{ text }}
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
});

const emit = defineEmits(["update:modelValue"]);
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
