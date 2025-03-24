<template>
  <v-row no-gutters>
    <v-col cols="12" class="px-4 pt-5 text-h6">Site Personnel Remark(s) </v-col>
    <v-col cols="12" class="px-3 mt-6">
      <v-expansion-panels v-model="remarksLenght">
        <v-expansion-panel v-for="remark in remarks.remarks" :key="remark.id">
          <v-expansion-panel-title v-slot="{ expanded }">
            <v-row no-gutters>
              <v-col class="d-flex justify-start pt-2" cols="4">
                {{ remark.name }}
              </v-col>
              <v-col class="text--secondary" cols="8">
                <v-fade-transition leave-absolute>
                  <v-row style="width: 100%" no-gutters>
                    <v-col class="d-flex justify-start pt-2" cols="6">
                      {{ formatDate(remark.dateTime) }}
                    </v-col>
                    <v-col class="d-flex justify-start" cols="6">
                      <v-chip :color="statusColor(remark.status)">
                        {{ prettifyString(remark.status) }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            {{ remark.message }}

            <v-btn
              v-if="remarks.remarks.length - 1 === remarksLenght"
              class="text-none mt-4"
              color="#eb261e"
              size="large"
              variant="flat"
              block
              @click="() => useRouter().push({ name: 'create-account-info' })"
            >
              Update
            </v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel></v-expansion-panels
      >
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "only-footer",
});
const { formatDate, prettifyString } = useUtils();
const remarks = ref([]);
const remarksLenght = ref(null);

function statusColor(status) {
  if (status === "resubmit") {
    return "orange";
  } else if (status === "rejected" || status === "suspended") {
    return "#eb261e";
  } else {
    return "green";
  }
}

onMounted(() => {
  const values = localStorage.getItem("resident");
  if (values) remarks.value = JSON.parse(values);
  remarksLenght.value = remarks.value.remarks.length - 1;
});
</script>

<style lang="scss" scoped></style>
