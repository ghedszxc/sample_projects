<template>
  <v-row no-gutters justify="center" class="px-5 d-flex flex-column">
    <GoBackArrow header-text="Current Invoice" @go-back="goBack" />
    <v-col class="w-100 mt-10">
      <p style="font-size: 20px">Request SOA</p>
      <div class="custom-input-class">
        <v-date-input
          label="From"
          density="compact"
          hide-details
          variant="plain"
        />
      </div>

      <div class="custom-input-class">
        <v-date-input
          label="To"
          density="compact"
          hide-details
          variant="plain"
        />
      </div>
    </v-col>
    <v-btn color="#EB261E" class="mb-5 mt-10" height="42px">
      Request SOA
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

// Utilities
const { theme } = useLocal();
const router = useRouter();

// Local State

// Computed

// Methods
const goBack = () => useRouter().push({ name: "billing" });

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
