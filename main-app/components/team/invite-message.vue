<template>
    <v-dialog max-width="600" v-model="isDialogVisible" persistent>
      <v-card class="rounded-xl">
        <v-toolbar color="white" class="rounded-xl">
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" @click="hideModal"></v-btn>
        </v-toolbar>
        <v-card-text class="mb-10">
          <v-row class="justify-center mb-7 mt-3">
            <slot name="image">
                <v-img
                    src="/images/invite/message-send.svg"
                    width="200px"
                    height="200px"
                ></v-img>
            </slot>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" class="text-center  mb-5">
                <span class="font-weight-bold text-h5">
                    Invitation Sent
                </span>
            </v-col>
            <v-col cols="12" class="text-center">
              <span class="font-weight-bold text-small" v-html="isConfirmTitle || 'We sent an email to join your team to'"></span>
            </v-col>
  
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>
  
  <script setup lang="ts">
    const emit = defineEmits(["confirmSign","closeModal"]);

    let props = defineProps({
        isConfirmTitle: {
            type: String,
        },
        isConfirmModal: {
            type: Boolean,
            default: false,
        },
    });

    const isDialogVisible = computed(() => props.isConfirmModal)

    const hideModal = () => {
        emit("closeModal", false);
    }
  </script>
  