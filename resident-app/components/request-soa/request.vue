<template>
  <v-row no-gutters justify="center" class="d-flex flex-column">
    <v-col class="w-100 mt-10">
      <div class="custom-input-class">
        <v-date-input
          v-model="fromDate"
          :rules="[requiredInput]"
          label="From"
          density="compact"
          hide-details
          variant="plain"
        />
      </div>

      <div class="custom-input-class">
        <v-date-input
          v-model="toDate"
          :rules="[requiredInput]"
          label="To"
          density="compact"
          hide-details
          variant="plain"
          :min="fromDate"
        />
      </div>
    </v-col>
    <v-btn
      color="#EB261E"
      class="mb-5 mt-10"
      height="42px"
      @click="onRequest"
      :disabled="isLoading"
    >
      {{ isLoading ? "Sending Request" : "Request SOA" }}
    </v-btn>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

// Props

// Emits
const emit = defineEmits<{
  (event: "onRequest", fromDate: Date, toDate: Date): void;
}>();

//Imports

// Utilities
const { isLoading } = useSOA();
const { requiredInput } = useUtils();
const { theme } = useLocal();

// Local State
const fromDate = ref(new Date());
const toDate = ref(new Date());

// Computed

// Methods

const onRequest = () => {
  emit("onRequest", fromDate.value, toDate.value);
};

// onMounted
onMounted(async () => {});
</script>

<style lang="scss" scoped>
.custom-input-class {
  border: 1px solid #343a45;
  padding: 12px 12px 17px 12px;
  border-radius: 4px;
  margin-top: 20px;
}
</style>
