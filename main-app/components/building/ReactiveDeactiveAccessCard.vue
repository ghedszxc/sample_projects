<template>
  <v-dialog
    v-model="reactiveDeactiveAccessCardDialog"
    max-width="400"
    persistent
  >
    <v-card class="pb-6 rounded-xl">
      <v-toolbar color="transparent">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          icon
          @click="reactiveDeactiveAccessCardDialog = false"
          :disabled="isUnitsLoaded"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <div class="d-flex justify-center mb-8">
          <v-img
            :src="'/images/undraw_credit-card-payments.png'"
            alt="Delete Image"
            height="130"
          />
        </div>
        <div class="font-weight-bold text-center px-12">
          Are you sure you want to
          <span
            :class="`text-capitalize ${props.action === 'activate' ? 'text-primary' : 'text-error'}`"
            >{{ props.action }}</span
          >
          the <span class="text-capitalize">{{ props.title }}</span> Access Card
          for this Resident/Tenant?
        </div>
      </v-card-text>

      <v-card-actions class="px-10 pt-0">
        <v-btn
          class="bg-blue-darken-4 w-100"
          @click="onDelete"
          :loading="isAssigningNFC"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
const props = defineProps({
  title: String,
  action: String,
});

const emits = defineEmits(["onUpdate"]);

const { reactiveDeactiveAccessCardDialog, isUnitsLoaded } = useBlockLevelUnit();
const { isAssigningNFC } = useEntryPass();

async function onDelete(_id) {
  emits("onUpdate");
}
</script>
