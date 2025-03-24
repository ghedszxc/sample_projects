<template>
    <v-dialog max-width="400" v-model="isDialogVisible" persistent>
      <v-card class="rounded-xl">
        <v-toolbar color="white" class="rounded-xl">
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" @click="hideModal"></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row class="justify-center mb-7 mt-3">
            <slot name="image">
              <svg xmlns="http://www.w3.org/2000/svg" width="202" height="139" viewBox="0 0 202 139" fill="none">
                <path d="M157.035 138.609H44.966C20.3242 138.609 0.275391 118.56 0.275391 93.9183C0.275391 70.9754 17.6538 52.0144 39.9365 49.5097C45.9285 20.915 71.2396 0 101 0C130.764 0 156.075 20.9172 162.065 49.5097C184.347 52.0144 201.726 70.9754 201.726 93.9183C201.726 118.56 181.677 138.609 157.035 138.609Z" fill="#E86060"/>
                <path d="M110.495 82.7529L128.608 64.6403C131.231 62.0192 131.231 57.7663 128.608 55.1452C125.984 52.5219 121.736 52.5219 119.113 55.1452L101 73.2578L82.8873 55.1452C80.2662 52.5219 76.0134 52.5219 73.3923 55.1452C70.769 57.7663 70.769 62.0192 73.3923 64.6403L91.5049 82.7529L73.3923 100.865C70.769 103.487 70.769 107.739 73.3923 110.36C74.7017 111.672 76.423 112.328 78.1398 112.328C79.8566 112.328 81.5779 111.672 82.8873 110.36L101 92.2479L119.113 110.36C120.424 111.672 122.143 112.328 123.86 112.328C125.577 112.328 127.296 111.672 128.608 110.36C131.231 107.739 131.231 103.487 128.608 100.865L110.495 82.7529Z" fill="white"/>
              </svg>
            </slot>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" class="text-center">
              <span class="font-weight-bold text-h6">{{
                isConfirmTitle || "Unable to attach incident report"
              }}</span>
            </v-col>
            <v-col cols="12" class="text-center">
              <span class="font-weight-bold text-h6">{{
                subtitle || "There’s a pending incident report awaiting to be approve. Please try again later!"
              }}</span>
            </v-col>
  
           
  
            <v-col cols="12" class="text-center">
              <v-btn
                color="#1867C0"
                type="submit"
                class="my-4 w-100 rounded-lg"
                height="40px"
                @click="hideModal"
              >
                Return
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>
  
  <script setup lang="ts">
    const { confirmSign, isSigned } = useOccurrenceEntry();
    const { currentUser } = useLocalAuth();
    const { setSnackbar } = useLocal();
    
    const username = ref("");
    const password = ref("");
    const errMsg = ref("");
    
    const emit = defineEmits(["signDob","closeModal"]);

    let props = defineProps({
        isConfirmTitle: {
            type: String,
        },
        isConfirmModal: {
            type: Boolean,
            default: false,
        },
        subtitle: {
          type: String,
        }
    });

    const isDialogVisible = computed(() => props.isConfirmModal)

    const hideModal = () => {
        emit("closeModal", false);
    }
    
  </script>
  