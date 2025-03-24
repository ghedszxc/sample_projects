<template>
  <v-card class="pa-2 mb-4">
    <v-card-title class="d-flex justify-space-between">
      <v-switch
        v-model="modelValue.isEnabled"
        color="primary"
        label="Enable ANPR Camera"
        hide-details
        density="compact"
        @update:model-value="onSwitchChange($event)"
      />
      <v-col cols="1" class="text-end" v-if="index !== 0">
        <v-icon @click="emit('remove')" color="red"> mdi-delete </v-icon>
      </v-col>
    </v-card-title>

    <v-divider class="mb-2" />

    <v-list>
      <v-list-item>
        <v-select
          v-model="modelValue.type"
          :items="['CHECK-IN', 'CHECK-OUT', 'RESIDENTS']"
          density="compact"
          clearable
          hide-details
          placeholder="Select ANPR Camera Type"
          :style="
            $vuetify.theme.current.dark
              ? 'background-color: #212529'
              : 'background-color: #f8f9fa'
          "
          @update:model-value="updateField('type', $event)"
        >
          <template #prepend-inner>
            <v-icon color="blue-darken-3" class="mr-4"
              >mdi-doorbell-video</v-icon
            >
          </template>
        </v-select>
      </v-list-item>

      <v-list-item>
        <v-text-field
          v-model="modelValue.api"
          density="compact"
          placeholder="Enter DAHUA API url"
          clearable
          hide-details
          :style="
            $vuetify.theme.current.dark
              ? 'background-color: #212529'
              : 'background-color: #f8f9fa'
          "
          @update:model-value="updateField('api', $event)"
        >
          <template #prepend-inner>
            <v-icon color="blue-darken-3" class="mr-4">mdi-api</v-icon>
          </template>
        </v-text-field>
      </v-list-item>
      <v-list-item>
        <v-text-field
          v-model="modelValue.username"
          density="compact"
          placeholder="Enter DAHUA Username"
          clearable
          hide-details
          :style="
            $vuetify.theme.current.dark
              ? 'background-color: #212529'
              : 'background-color: #f8f9fa'
          "
        >
          <template v-slot:prepend-inner>
            <v-icon color="blue-darken-3" class="mr-4">mdi-account</v-icon>
          </template>
        </v-text-field>
      </v-list-item>
      <v-list-item>
        <v-text-field
          v-model="modelValue.password"
          density="compact"
          clearable
          hide-details
          placeholder="Enter DAHUA Password"
          :style="
            $vuetify.theme.current.dark
              ? 'background-color: #212529'
              : 'background-color: #f8f9fa'
          "
        >
          <template v-slot:prepend-inner>
            <v-icon color="blue-darken-3" class="mr-4">mdi-lock</v-icon>
          </template>
        </v-text-field>
      </v-list-item>
      <v-list-item>
        <v-text-field
          v-model="modelValue.channel"
          density="compact"
          placeholder="Enter DAHUA Channel Number"
          clearable
          hide-details
          :style="
            $vuetify.theme.current.dark
              ? 'background-color: #212529'
              : 'background-color: #f8f9fa'
          "
        >
          <template v-slot:prepend-inner>
            <v-icon color="blue-darken-3" class="mr-4">mdi-cctv</v-icon>
          </template>
        </v-text-field>
      </v-list-item>
    </v-list>

    <v-card-actions>
      <v-btn
        color="green-darken-3"
        size="small"
        variant="flat"
        @click="$emit('test', modelValue)"
        >Test Connection</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
const { theme, setSnackbar } = useLocal();
const props = defineProps<{
  modelValue: TANPR;
  index: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: TANPR];
  remove: [];
  test: [value: TANPR];
  "switch-change": [value: TANPR];
}>();

async function onSwitchChange(event: boolean) {
  if (event) {
    if (isSwitchDisabled.value) {
      props.modelValue.isEnabled = false;
      setSnackbar({
        text: "Please setup ANPR Settings first before enabling it",
        modal: true,
        type: "error",
      });
    } else {
      props.modelValue.isEnabled = true;
      emit("switch-change", props.modelValue);
    }
  } else {
    props.modelValue.isEnabled = false;
    emit("switch-change", props.modelValue);
  }
}

const isSwitchDisabled = computed(() => {
  const { api, username, password, channel } = props.modelValue;
  return (
    api === null ||
    api === "" ||
    username === null ||
    username === "" ||
    password === null ||
    password === "" ||
    channel === null
  );
});

const updateField = (field: keyof TANPR, value: any) => {
  emit("update:modelValue", {
    ...props.modelValue,
    [field]: value,
  });
};
</script>
