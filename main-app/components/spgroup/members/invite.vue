<template>
    <v-dialog
      v-model="isDialogVisible"
      transition="dialog-right-transition"
      fullscreen
      :style="{
        'margin-left': 'auto',
        'margin-right': '0',
        'max-width': '551px',
      }"
    >
      <v-card class="px-3 h-100">
        <v-toolbar color="white">
          <v-btn icon="mdi-arrow-left" @click="hideModal"></v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" @click="hideModal"></v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text>
          <v-row class="h-100 align-center">
            <v-form
              v-model="isInviteValid"
              @submit.prevent="submit()"
              class="w-100"
            >
              <v-col cols="12">
                <v-row class="justify-center mb-7">
                  <v-img
                    src="/images/undraw_team_page.svg"
                    width="190px"
                    height="190px"
                  ></v-img>
                </v-row>

                <v-responsive class="mx-auto">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Email Address
                  </div>
                  <v-text-field
                    v-model="email"
                    density="comfortable"
                    hint=""
                    placeholder="Enter email address"
                    :rules="[requiredInput, validEmail]"
                    :persistent-hint="false"
                  ></v-text-field>

                 

                  <v-btn
                    color="#1867C0"
                    :disabled="!isInviteValid"
                    type="submit"
                    class="py-4 w-100 rounded-lg"
                    height="52px"
                  >
                    Send Invite
                  </v-btn>
                </v-responsive>
              </v-col>
            </v-form>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
    let props = defineProps({
        isConfirmModal: {
            type: Boolean,
            default: false,
        },
    });

    const { requiredInput, validEmail } = useUtils();
    const typeOpt = ref("service-provider");
    const email = ref("")
    const {
        isInviteValid,
    } = useUser()


    const emit = defineEmits(["closeModal","submit"]);
    const isDialogVisible = computed(() => props.isConfirmModal)

    const hideModal = () => {
        emit("closeModal", false);
    }

    const submit = async () => {
        emit("submit", email.value.toLowerCase());

    }
</script>