<template>
  <div>
    <v-row
      class="d-flex flex-column d-flex flex-sm-row justify-center mt-5 mt-sm-0"
    >
      <v-col class="pb-0">
        <div class="text-body text-medium-emphasis">
          {{ label || "Signature *" }}
        </div>
      </v-col>
      <br />

      <v-col
        v-if="!isDisabled"
        cols="12"
        sm="auto"
        class="pt-0 d-flex justify-start justify-sm-end"
        style="margin-bottom: 10px"
      >
        <v-btn
          v-if="!isApplicant"
          color="blue"
          class="text-caption"
          size="small"
          style="margin-right: 8px"
          @click="signViaLink"
        >
          {{ signatoryEmail || "email" }}
        </v-btn>
        <v-btn color="#EB261E" class="text-caption" size="small" @click="clear">
          Clear
        </v-btn>
      </v-col>
    </v-row>
    <div
      style="border: 1px solid #343a45; border-radius: 4px"
      :style="isDisabled ? computeInputColor : null"
    >
      <NuxtSignaturePad
        ref="signature"
        :height="options.height"
        :width="options.width"
        :options="{
          penColor: options.penColor,
          backgroundColor: options.backgroundColor,
        }"
        :disabled="isDisabled || false"
        @end-stroke="handleEndStroke"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";
const { theme } = useLocal();
const emit = defineEmits(["onSign", "inputEmail"]);
defineProps({
  label: {
    type: String,
    default: "",
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  signatoryEmail: {
    type: String,
    default: "",
  },
  isApplicant: {
    type: Boolean,
    default: false,
  },
});

interface SignatureOptions {
  penColor: string;
  backgroundColor: string;
  height: string;
  width: string;
}
const options = computed<SignatureOptions>(() => ({
  // need to support dark and light theme
  penColor: theme.value === "dark" ? "rgb(255,255,255)" : "rgb(0,0,0)",
  backgroundColor: theme.value === "dark" ? "rgb(0,0,0)" : "rgb(255,255,255)",
  height: "200px",
  width: "100%",
}));
const computeInputColor = computed(() => {
  return theme.value === "dark"
    ? { background: "#343a45" }
    : { background: "#EBEBE4" };
});
const signature = ref<{
  clearCanvas(): void;
  // eslint-disable-next-line no-unused-vars
  saveSignature(params: "image/png" | "image/svg"): void;
} | null>(null);

const clear = () => {
  signature.value && signature.value.clearCanvas();
};

const signViaLink = () => emit("inputEmail");

const debounceSignature = debounce(async () => {
  emit("onSign", signature.value && signature.value.saveSignature("image/png"));
}, 500);
const handleEndStroke = () => {
  debounceSignature();
};
</script>
