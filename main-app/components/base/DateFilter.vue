<template>
  <v-text-field
    v-model="selectedDate"
    density="compact"
    hide-details
    readonly
    clearable
    @click:clear="onUpdateDate('empty')"
  >
    <template v-slot:append-inner>
      <v-menu>
        <template v-slot:activator="{ props }">
          <input
            v-bind="props"
            type="date"
            class="overridePicker"
            id="selectedDate"
            @input="onUpdateDate('hasValue')"
          />
        </template>
      </v-menu>
    </template>
  </v-text-field>
</template>
<script setup lang="ts">
const { standardFormatDate } = useUtils();
const emit = defineEmits<{
  (event: "onSelectDate", value: string): void;
  (event: "onClearDate", value: string): void;
}>();
const selectedDate = ref("");

function onUpdateDate(elem: string) {
  const docValue =
    document &&
    (document.getElementById(elem) as unknown as { value: string }).value;
  const getDate = new Date(String(docValue));
  if (elem === "hasValue") {
    selectedDate.value = elem == "hasValue" ? standardFormatDate(getDate) : "";
    emit("onSelectDate", selectedDate.value);
  } else if (elem === "empty") {
    emit("onClearDate", "");
  }
}
</script>
<style scoped>
.overridePicker {
  width: 18px;
}
</style>
