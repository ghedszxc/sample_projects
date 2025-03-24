<template>
  <v-dialog v-model="isOpen">
    <v-card
      class="w-100"
      text="By entering an email, the signatory will receive an email with a link where they can sign."
    >
      <div style="padding: 0 16px">
        <v-text-field
          v-model="email"
          :label="label"
          type="email"
          class="custom-input-class"
          variant="plain"
          hide-details
        />
      </div>
      <template #actions>
        <v-btn color="blue" text="Set Email" @click="handleSetEmail" />
        <v-btn text="Cancel" @click="handleCancel" />
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  label: {
    type: String,
    default: "Email",
  },
});

const emit = defineEmits(["setEmail", "update:modelValue", "submit"]);

const email = ref("");

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleSetEmail = () => {
  emit("setEmail", email.value, "set");
  emit("update:modelValue", false);
};

const handleCancel = () => {
  emit("setEmail", email.value, "cancel");
  email.value = "";
  emit("update:modelValue", false);
};
</script>

<style scoped>
.custom-input-class {
  border: 1px solid #343a45;
  padding: 12px 12px 17px 12px;
  border-radius: 4px;
}
</style>
