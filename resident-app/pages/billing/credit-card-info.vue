<template>
  <v-row no-gutters justify="center" class="px-5 d-flex flex-column">
    <GoBackArrow header-text="Credit Card" @go-back="goBack" />
    <v-col class="w-100 mb-5">
      <v-select
        label="Select Card"
        :items="['Master Card', 'Master Card 1', 'Master Card 2']"
        variant="plain"
        class="custom-input-class"
        hide-details
      ></v-select>

      <v-text-field
        label="Card Number"
        class="custom-input-class"
        hide-details
        variant="plain"
      />

      <v-text-field
        label="Full Name"
        class="custom-input-class"
        hide-details
        variant="plain"
      />

      <v-text-field
        label="Card ID"
        class="custom-input-class"
        hide-details
        variant="plain"
      />

      <div class="d-flex align-center">
        <div class="custom-input-class mr-2" style="width: 50%">
          <v-date-input
            label="Expiry date"
            density="compact"
            hide-details
            variant="plain"
          />
        </div>
        <v-text-field
          label="CVV"
          class="custom-input-class"
          hide-details
          variant="plain"
        />
      </div>
    </v-col>

    <v-btn color="#EB261E" class="mt-10" height="42px">Pay </v-btn>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

// Props

// Emits

// Utilities
const { theme } = useLocal();
const router = useRouter();

// Local State

// Computed

// Methods
const goBack = () => router.push("payment-method");

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
