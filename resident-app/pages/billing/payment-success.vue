<template>
  <v-row no-gutters justify="center" class="px-5 d-flex flex-column">
    <h2
      class="mt-12"
      style="font-size: 25px; font-weight: 700; text-align: center"
    >
      Thank you!
    </h2>
    <p style="font-size: 20px; text-align: center">
      Your transaction was successful
    </p>

    <!-- INVOICE SUMMARY -->
    <v-col class="pa-5 border mt-10 rounded">
      <div class="py-5 border-b d-flex align-center justify-space-between">
        <p style="font-weight: 500">Invoice Date</p>
        <p style="font-weight: 700">12/03/25</p>
      </div>

      <div class="d-flex align-center justify-space-between mt-5">
        <p>Transaction</p>
        <p style="color: #eb261e">Invoice 001</p>
      </div>

      <div class="d-flex align-center justify-space-between mt-3">
        <p>Invoice Period</p>
        <p>12/01/24 - 01/01/25</p>
      </div>
    </v-col>

    <!-- INVOICE TOTAL -->
    <v-col class="my-10" style="border-top: 2px dotted gray">
      <div class="mt-7 mb-5 d-flex align-center justify-space-between">
        <p>Total</p>
        <p style="font-size: 24px; color: #4caf50">$S800.00</p>
      </div>

      <div class="py-3 px-5 border">
        <p style="font-size: 18px">Credit Card</p>
        <p>Mastercard **78</p>
      </div>
    </v-col>
    <v-btn color="#4CAF50" class="mb-5 rounded-xl" height="42px"> Paid </v-btn>

    <v-btn color="#EB261E" class="mb-5" height="42px"> Download Invoice </v-btn>
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

<style lang="scss" scoped></style>
