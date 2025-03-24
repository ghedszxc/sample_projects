<template>
  <v-row no-gutters>
    <!-- go back -->
    <v-col cols="12" class="mt-4 px-3">
      <v-row no-gutters @click="goBack()">
        <v-col cols="1">
          <v-img
            src="/icons/resident/home/chevron-left.svg"
            class="chevron-icon"
          ></v-img>
        </v-col>
        <v-col cols="9" :class="`${back} ml-1`">
          Create Incident Feedback
        </v-col>
      </v-row>
    </v-col>

    <!-- form -->
    <v-col cols="12" xxl="4" xl="4" lg="5" class="font-weight-light mt-1 px-5">
      <v-form v-model="isFeedbackValid" @submit.prevent="submit()">
        <v-row no-gutters justify="center" class="mt-8">
          <v-col cols="12">
            <template v-for="(item, index) in residentType" :key="item">
              <v-text-field
                :base-color="baseColor"
                :bg-color="bgColor"
                class="mb-6"
                v-model="residentType[index]"
                required
                density="default"
                filled
                variant="outlined"
                readonly
                @click="toggleUnitOwner(item)"
                :append-inner-icon="
                  feedbackCheck === item ? 'mdi-circle' : 'mdi-circle-outline'
                "
                :class="{ 'text-green': feedbackCheck === item }"
                hide-details
              ></v-text-field>
            </template>
          </v-col>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12">
                <v-select
                  :base-color="baseColor"
                  :bg-color="bgColor"
                  :persistent-hint="false"
                  label="Selct Common Area"
                  :items="['Sample Common 1', 'Sample Common 2']"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  :base-color="baseColor"
                  :bg-color="bgColor"
                  :persistent-hint="false"
                  label="Select Incident Type"
                  :items="['Sample Incident 1', 'Sample Incident 2']"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :base-color="baseColor"
                  :bg-color="bgColor"
                  label="Location"
                  v-model="feedback.location"
                  density="comfortable"
                  placeholder="e.g. Lobby, Hallway"
                  :rules="[requiredInput]"
                  clearable
                  :persistent-hint="false"
                ></v-text-field>
              </v-col>

              <v-col cols="12" class="">
                <v-textarea
                  :base-color="baseColor"
                  :bg-color="bgColor"
                  label="Feedback Description"
                  v-model="feedback.description"
                  density="comfortable"
                  placeholder="e.g. Light bulbs are defective"
                  :rules="[requiredInput]"
                  clearable
                  :persistent-hint="false"
                  no-resize
                  auto-grow
                ></v-textarea>
              </v-col>

              <v-col cols="12">
                <div class="text-subtitle-1 text-medium-emphasis">
                  Attach Image
                </div>
                <v-file-input
                  :base-color="baseColor"
                  :bg-color="bgColor"
                  v-model="files"
                  accept="image/*"
                  label="Select file"
                  variant="plain"
                  prepend-icon=""
                  @change="onFileSelect()"
                  :clearable="false"
                >
                  <template v-slot:prepend-inner>
                    <div style="width: 40px" class="pl-3">
                      <v-img
                        style="
                          margin: auto 0;
                          filter: drop-shadow(
                            0px 12px 14px rgba(233, 38, 30, 0.3)
                          );
                        "
                        max-height="60"
                        max-width="60"
                        src="/icons/resident/home/paperclip.svg"
                      />
                    </div>
                  </template>
                </v-file-input>
              </v-col>

              <v-col cols="12" class="pb-4" style="font-size: 12px">
                <v-card style="height: 52px" flat>
                  <v-row no-gutters align="center">
                    <v-col cols="9">
                      <p class="text-center button-text">
                        Allow management to share with community
                      </p>
                    </v-col>
                    <v-col
                      cols="3"
                      class="d-flex justify-center"
                      align-self="end"
                    >
                      <v-switch
                        color="indigo"
                        value="indigo"
                        hide-details
                      ></v-switch
                    ></v-col>
                  </v-row>
                </v-card>
              </v-col>

              <!-- send feedback button -->
              <v-col cols="12">
                <v-row no-gutters>
                  <v-btn
                    block
                    style="
                      display: flex;
                      height: 52px;
                      padding: 0px 16px;
                      justify-content: center;
                      align-items: center;
                      align-self: stretch;
                      border-radius: 8px;
                      box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
                    "
                    color="#EB261E"
                    type="submit"
                    :disabled="!isFeedbackValid"
                    :loading="isLoading"
                  >
                    Send Feedback
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

const { theme } = useLocal();

const back = computed(() =>
  theme.value === "dark" ? "go-back-dark" : "go-back-light",
);

const baseColor = computed(() => (theme.value === "dark" ? "red" : "red"));

const bgColor = computed(() =>
  theme.value === "dark" ? "#111723" : "#FAFAFAFA",
);

const { requiredInput } = useUtils();
const { isLoading, feedback, isFeedbackValid } = useFeedback();

const feedbackCheck = ref("");
const residentType = ref(["My Location", "Common Area"]);
const unitOwnerClicked = ref<boolean | string>(false);
const toggleUnitOwner = (item: string) => {
  unitOwnerClicked.value = item;
  feedbackCheck.value = item;
};

async function goBack() {
  await navigateTo("/feedbacks");
}
</script>

<style scoped>
.chevron-icon {
  filter: drop-shadow(0px 4px 10px #d01b1b);
}
.go-back-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  margin-top: 2px;
}
.go-back-dark {
  color: #fcfcfc;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  margin-top: 2px;
}
.button-text {
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}
</style>
