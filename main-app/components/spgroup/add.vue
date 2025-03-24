<template>
  <v-dialog
    v-model="isDialogVisible"
    fullscreen
    transition="dialog-right-transition"
    :style="{
      'margin-left': 'auto',
      'margin-right': '0',
      'max-width': '551px',
    }"
    persistent
  >
    <v-card>
      <v-toolbar>
        <v-toolbar-title> New Group </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="hideModal"></v-btn>
      </v-toolbar>
      <v-divider></v-divider>

      <v-card-text>
        <v-row class="h-100 align-center">
          <v-form
            v-model="isSpGroupValid"
            @submit.prevent="submit()"
            class="w-100"
          >
            <v-col cols="12">
              <v-row class="justify-center mb-7">
                <v-img
                  src="/images/undraw_location_tracking_re_n3ok (1) 1.svg"
                  width="190px"
                  height="190px"
                ></v-img>
              </v-row>

              <v-responsive class="mx-auto">
                <v-col cols="12" class="font-weight-bold text-h6 mb-0 pb-0">
                  <v-row no-gutters> Group Name </v-row>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="spGroup.groupName"
                    density="comfortable"
                    hint=""
                    label="Group Name"
                    :rules="[requiredInput]"
                    :persistent-hint="false"
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="mt-5">
                  <v-row no-gutters justify="center">
                    <v-col cols="12">
                      <v-btn
                        color="#1867C0"
                        :disabled="!isSpGroupValid"
                        type="submit"
                        class="py-4 w-100 rounded-lg"
                        height="52px"
                        :loading="isLoading"
                      >
                        Save
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-responsive>
            </v-col>
          </v-form>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const { isSpGroupValid, spGroup, isLoading } = useSPGroup();
const { requiredInput } = useUtils();

const emit = defineEmits(["submit", "closeModal"]);

let props = defineProps({
  isConfirmTitle: {
    type: String,
  },
  isConfirmModal: {
    type: Boolean,
    default: false,
  },
});

const isDialogVisible = computed(() => props.isConfirmModal);

const hideModal = () => {
  emit("closeModal", false);
};

const submit = async () => {
  delete spGroup.value.siteCollab;
  emit("submit", spGroup.value);
};
</script>
