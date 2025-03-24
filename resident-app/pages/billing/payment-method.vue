<template>
  <v-row no-gutters justify="center" class="px-5">
    <GoBackArrow header-text="Payment Method" @go-back="goBack" />
    <section class="w-100 mb-5">
      <v-text-field
        class="search-bar"
        label="Search Type of Form"
        density="compact"
        variant="plain"
        hide-details
        clearable
        append-inner-icon="mdi-magnify"
      />

      <v-col
        class="border mt-5 rounded d-flex align-center"
        v-for="(item, itemIndex) in paymentMethodsList"
        :key="itemIndex"
        @click="creditCardRoute(item.name)"
      >
        <img width="80px" :src="item.icon" />
        <p class="ml-5" style="font-size: 18px" :to="`/billing`">
          {{ item.name }}
        </p>
      </v-col>
    </section>
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
const paymentMethodsList = ref([
  {
    name: "Credit Card",
    icon: "/payment-method-icons/Qiwi.svg",
  },
  {
    name: "Pay Now",
    icon: "/payment-method-icons/Skrill.svg",
  },
  {
    name: "Google Pay",
    icon: "/payment-method-icons/GooglePay.svg",
  },
  {
    name: "Apple Pay",
    icon: "/payment-method-icons/ApplePay.svg",
  },
  {
    name: "Paypal",
    icon: "/payment-method-icons/Paypal.svg",
  },
  {
    name: "Stripe",
    icon: "/payment-method-icons/Stripe.svg",
  },
  {
    name: "Alipay",
    icon: "/payment-method-icons/Alipay.svg",
  },
]);

// Computed

// Methods
const goBack = () => useRouter().push({ name: "billing" });

const creditCardRoute = (name: string) => {
  if (name === "Credit Card") {
    router.push('credit-card-info');
  }
};

// onMounted
onMounted(async () => {});
</script>

<style lang="scss" scoped>
.search-bar {
  border: 1px solid #eb261e;
  padding: 12px 12px 17px 12px;
  border-radius: 4px;
  position: relative;
}
</style>
