<template>
  <v-dialog
    v-model="innerValue"
    transition="dialog-top-transition"
    max-width="400"
    @update:model-value="showLogAttachmentDialog = ''"
  >
    <v-card>
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="orange"
          height="8"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-card-text class="py-5">
        <span
          @click="showLogAttachmentDialog = ''"
          style="cursor: pointer"
          class="d-flex align-center text-truncate text-body-2"
          ><v-btn
            size="x-small"
            class="border mr-2"
            icon="mdi-chevron-left"
            flat
          ></v-btn
          >Close</span
        >
        <div class="font-weight-bold text-center py-5">
          Patrol Log {{ showLogAttachmentDialog }}
          <p class="text-caption">Select a file to open.</p>
        </div>
        <v-list density="compact" max-height="200" class="my-4">
          <template v-for="(item, key) in dialogAttachments" :key="key">
            <v-list-item
              border="primary thin"
              :class="`my-2 rounded text-body-2 hover-effect`"
            >
              <v-row align="center">
                <v-col cols="12">
                  <a
                    target="_blank"
                    :href="`/api/files/${item.file}`"
                    class="d-flex align-center text-truncate text-decoration-none"
                  >
                    <v-icon
                      size="x-small"
                      class="mr-2"
                      style="
                        background: #1976d2;
                        border-radius: 24px;
                        color: #ffffff;
                        width: 22px;
                        height: 22px;
                      "
                      >{{
                        showLogAttachmentDialog === "Screenshots"
                          ? "mdi-image-outline"
                          : "mdi-file-video-outline"
                      }}</v-icon
                    >
                    <span>{{ item.question }}</span>
                  </a>
                </v-col>
              </v-row>
            </v-list-item>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const { showLogAttachmentDialog, dialogAttachments } = useVirtualPatrol();

const innerValue = ref(false);

watch(showLogAttachmentDialog, (value) => {
  if (value && value !== "") innerValue.value = true;
  else innerValue.value = false;
});
</script>
