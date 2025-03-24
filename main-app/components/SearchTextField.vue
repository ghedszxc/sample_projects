<template>
    <v-text-field
      v-model="search"
      :placeholder="placeholder"
      hide-details
      density="compact"
      :append-inner-icon="icon"
      :clearable="clearable"
      @update:modelValue="onSearch"
      @click:clear="callItBack()"
    >
    </v-text-field>
</template>
  
<script setup lang="ts">
  import debounce from "lodash/debounce";

  defineProps({
    placeholder: {
      type: String,
      default: "Search for keyword"
    },
    icon: {
      type: String,
      default: "mdi-magnify"
    },
    clearable: {
      type: Boolean,
      default: true
    }
  });  
  const search = ref("");
    
  const emit = defineEmits(["onSearch","clearSearch"]);

  const onSearch = (val: string) => {
    debouncedSearch(val);
  }

const debouncedSearch = debounce(async (value: string) => {
    emit("onSearch", search.value);
  }, 500);

  const callItBack = () => {
    emit("clearSearch");
  }
  </script>
  