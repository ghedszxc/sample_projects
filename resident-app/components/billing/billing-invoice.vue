<template>
  <v-row no-gutters class="mt-10 flex-column">
    <!-- INVOICE TOTAL -->
    <v-col class="border-md rounded pa-5" :style="computeInputColor">
      <section class="border-b pb-5">
        <v-icon start size="x-large">
          <v-img
            class="pl-0 ml-0 mt-1"
            src="/dark-mode/utility-all/billing-icon-red.svg"
            cover
          />
        </v-icon>
        <p class="mt-3 mb-2">Current Invoice Total</p>
        <p style="font-size: 32px; font-family: 500">$S {{ invoiceTotal }}</p>
      </section>

      <section class="mt-5">
        <div class="my-5">
          <p style="font-weight: 500">Billing Period</p>
          <p class="mt-1">{{ computedMonthRange }}</p>
        </div>

        <div>
          <p style="font-weight: 500">Billed To</p>
          <p class="mt-1">{{ billedTo }}</p>
        </div>
      </section>
    </v-col>

    <!-- HEADERS -->
    <v-col class="border-md rounded mt-10 mb-5" :style="computeInputColor">
      <section class="d-flex align-center justify-space-between pa-4">
        <p>Items</p>
        <p>Amount</p>
      </section>
    </v-col>

    <v-col
      v-for="billing in billingData"
      :key="billing._id"
      class="border-md rounded mb-5"
      :style="computeInputColor"
    >
      <section class="d-flex align-center justify-space-between px-5 my-3">
        <p class="d-flex align-center" style="margin-left: -20px">
          <v-checkbox
            hide-details
            :model-value="isInputAmount[billing._id!] || false"
            @change="toggleInput(billing._id as string)"
          ></v-checkbox>
          {{ billing.billDetails?.billItem || "" }}
        </p>
        <p>S$ {{ billing.billDetails?.price || "" }}</p>
      </section>

      <section class="px-2 pb-4" v-if="isInputAmount[billing._id!]">
        <v-text-field
          label="Pay amount of"
          class="custom-input-class"
          hide-details
          variant="plain"
        />
      </section>
    </v-col>

    <div class="mb-5">
      <v-text-field
        label="Custom Amount"
        class="custom-input-class"
        hide-details
        variant="plain"
      />
    </div>

    <v-btn
      color="#EB261E"
      type="submit"
      class="mb-5"
      height="42px"
      :to="`/billing/payment-method`"
    >
      Partial Payment
    </v-btn>
    <v-btn
      color="#EB261E"
      type="submit"
      class="mb-5"
      height="42px"
      :to="`/billing/payment-method`"
    >
      Full Payment
    </v-btn>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

// Imports
import moment from "moment";

// Types

// Props

// Emits

// Utilities
const { theme } = useLocal();
const { getUserBillings } = useBilling();
const { currentUser } = useLocalAuth();

// Local State
const billingData = ref<TBillingUnits[]>([]);
const isInputAmount = ref<Record<string, boolean>>({});
const invoiceTotal = ref(0);
const billedTo = ref("");

// Computed
const computeInputColor = computed(() => {
  return theme.value === "dark"
    ? { background: "#111723" }
    : { background: "#FFF" };
});

const computedMonthRange = computed(() => {
  const start = moment().startOf("month").format("DD/MM/YYYY");
  const end = moment().endOf("month").format("DD/MM/YYYY");
  return `${start} - ${end}`;
});

// Methods
const loadUserBillings = async () => {
  const res = await getUserBillings(currentUser.value.unitNumber);
  if (!res) return;

  billingData.value = res.items;
  billedTo.value = billingData.value[0]?.unit || "";

  const allDetails = billingData.value.flatMap((item) => item.billDetails);
  const subTotal = allDetails.reduce(
    (sum, { price }) => sum + parseFloat(price),
    0,
  );
  const vatTotal = allDetails.reduce(
    (sum, { vat }) => sum + parseFloat(vat),
    0,
  );

  invoiceTotal.value = subTotal + vatTotal;
};

const toggleInput = (id: string) => {
  isInputAmount.value[id] = !isInputAmount.value[id];
};

// onMounted
onMounted(async () => {
  await loadUserBillings();
});
</script>

<style lang="scss" scoped>
.custom-input-class {
  border: 1px solid #343a45;
  padding: 10px 12px 17px 12px;
  border-radius: 4px;
}
</style>
