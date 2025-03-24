<template>
  <v-dialog
    v-model="addVisitorRealtimeDialog"
    transition="dialog-bottom-transition"
    max-width="500"
  >
    <v-card
      :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
      :class="`${theme == 'light' && 'bg-white'} px-3 h-100 ${$vuetify.display.mdAndUp && 'rounded-lg'}`"
    >
      <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
        <span class="font-weight-bold pl-4 pt-1 text-capitalize">
          Visitor
        </span>
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          icon="mdi-close"
          @click="onCloseDialog()"
        ></v-btn>
      </v-toolbar>

      <v-card-text class="text-center">
        A {{ visitor?.cat === "new" ? "new" : "previous" }} visitor with vehicle
        #{{ visitor?.plateNumber }}

        is at the barrier
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-3"
          size="small"
          variant="flat"
          style="height: 35px; width: 200px"
          @click="emits('onProceed', visitor)"
        >
          Proceed Adding Visitor
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
const props = defineProps({
  data: {},
});

const emits = defineEmits(["onProceed"]);

const { theme } = useLocal();
const { addVisitorRealtimeDialog, addVisitorRealtime } = useVisitor();

const visitor = computed(() => props.data as TVisitor);

async function onCloseDialog() {
  addVisitorRealtime.value = false;
  addVisitorRealtimeDialog.value = false;
}
</script>
