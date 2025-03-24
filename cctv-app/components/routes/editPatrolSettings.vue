<template>
  <v-dialog
    v-model="editDialog"
    transition="dialog-right-transition"
    fullscreen
    persistent
    :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
  >
    <v-card
      :loading="isProgress"
      :style="{ border: `${theme === 'light' && 'thin solid #E8E8E8'}` }"
      :class="`${theme === 'light' && 'bg-white'} h-100 ${
        $vuetify.display.mdAndUp && 'rounded-s-xl'
      }`"
    >
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="orange"
          height="8"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-toolbar>
        <span class="font-weight-bold pl-4 pt-1 text-capitalize"
          >View Question</span
        >
        <v-spacer></v-spacer>
        <v-btn
          size="x-small"
          color="grey-darken-1"
          icon="mdi-close"
          @click="onCloseDialog()"
        ></v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text>
        <v-row>
          <v-col cols="12" class="my-15">
            <v-img
              :src="`${
                useRuntimeConfig().public.S3_BUCKET
              }/images/empty-building-management-list.svg`"
              height="125"
            />
          </v-col>

          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12" v-if="editQuestionSteps <= 2">
                <v-row class="px-3 mb-4" justify="space-between">
                  <span class="font-weight-bold">
                    <v-btn
                      v-if="editQuestionSteps === 2"
                      size="x-small"
                      variant="flat"
                      class="grey-darken-1"
                      icon="mdi-chevron-left"
                      @click="editQuestionSteps--"
                    />
                    {{
                      editQuestionSteps === 1
                        ? "General Information"
                        : "Questions"
                    }}
                  </span>
                  <v-chip size="small" color="grey-lighten-1">
                    <span
                      :class="`${theme === 'dark' ? 'grey-darken-4' : 'white'}`"
                    >
                      Step <span class="text-blue">{{ editQuestionSteps }}</span
                      >/2
                    </span>
                  </v-chip>
                </v-row>
              </v-col>

              <v-col cols="12" class="mb-6" v-if="editQuestionSteps <= 2">
                <v-row v-if="editQuestionSteps === 1">
                  <v-col cols="12">
                    <v-textarea
                      v-model="specificPatrolQuestion.question"
                      label="Subject"
                      density="comfortable"
                      hide-details
                      :disabled="isProgress"
                      :rules="[requiredInput]"
                      readonly
                    ></v-textarea>
                  </v-col>

                  <!-- <v-col cols="12">
                    <v-text-field
                      v-model="patrolQuestionOption"
                      label="Options"
                      density="comfortable"
                      hide-details
                      :disabled="isProgress"
                    >
                      <template v-slot:append-inner>
                        <v-icon
                          class="cursor-pointer"
                          color="#1565C0"
                          @click="onAddPatrolOption(patrolQuestionOption)"
                          >mdi-plus-box-multiple</v-icon
                        >
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col cols="12 ">
                    <div
                      v-for="(item, index) in specificPatrolQuestion.options"
                      :key="index"
                      class="d-flex align-center justify-space-between mb-2"
                    >
                      <li>{{ item }}</li>
                      <v-icon
                        color="red"
                        class="cursor-pointer"
                        icon="$vuetify"
                        @click="onDeletePatrolOption(item)"
                        >mdi-delete</v-icon
                      >
                    </div>
                  </v-col> -->
                </v-row>

                <v-row v-if="editQuestionSteps === 2">
                  <!-- <v-col cols="12">
                    <v-text-field
                      v-model="specificInnerQuestion.name"
                      label="Inner Question"
                      density="comfortable"
                      hide-details
                      :disabled="isProgress"
                    >
                      <template v-slot:append-inner>
                        <v-icon
                          class="cursor-pointer"
                          color="#1565C0"
                          @click="onAddInnerQuestion(specificInnerQuestion)"
                          >mdi-plus-box-multiple</v-icon
                        >
                      </template>
                    </v-text-field>
                  </v-col> -->

                  <v-col
                    cols="12"
                    v-if="specificPatrolQuestion.innerQuestions.length"
                  >
                    <template
                      v-for="(
                        item, index
                      ) in specificPatrolQuestion.innerQuestions"
                      :key="item._id"
                    >
                      <v-card class="px-2 py-3 mb-5">
                        <v-textarea
                          :model-value="item.name"
                          hide-details
                          :label="`Question ${index + 1}`"
                          rows="1"
                          auto-grow
                          readonly
                        >
                          <!-- <template v-slot:append>
                            <v-icon
                              class="cursor-pointer"
                              color="red"
                              @click="onRemoveInnerQuestion(item.name)"
                              >mdi-delete</v-icon
                            >
                          </template> -->
                        </v-textarea>

                        <div
                          v-if="item.options.length"
                          v-for="(i, idx) in item.options"
                          class="py-2 mt-2"
                        >
                          <v-text-field
                            :label="`Answer ${idx + 1}`"
                            :model-value="i.innerOption"
                            :key="i._id"
                            hide-details
                            readonly
                          >
                            <!-- <template v-slot:append>
                              <v-icon
                                class="cursor-pointer"
                                color="red"
                                @click="onDeleteInnerOption(item._id, i._id)"
                                >mdi-close-circle</v-icon
                              >
                            </template> -->
                          </v-text-field>
                        </div>

                        <!-- <v-text-field
                          v-model="item.newOption"
                          label="New Option"
                          hide-details
                          class="mt-3"
                        >
                          <template v-slot:append>
                            <v-icon
                              class="cursor-pointer"
                              color="blue"
                              @click="
                                onAddInnerQuestionOption(item.newOption, item)
                              "
                              >mdi-plus-box</v-icon
                            >
                          </template>
                          </v-text-field
                        > -->
                      </v-card>
                    </template>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" v-if="editQuestionSteps === 3">
                <div class="text-center mt-6 text-subtitle-1 font-weight-bold">
                  Great!
                </div>
                <div class="text-center mt-2 text-caption">
                  Specific patrol log question updated.
                </div>
                <v-row class="px-3 mt-5" justify="space-between">
                  <v-col cols="12">
                    <v-btn
                      block
                      size="small"
                      variant="flat"
                      style="height: 40px"
                      @click="onCloseDialog()"
                    >
                      Close
                    </v-btn>
                  </v-col>

                  <!-- <v-col cols="6">
                    <v-btn
                      block
                      color="blue-darken-3"
                      size="small"
                      variant="flat"
                      style="height: 40px"
                      @click="goBack()"
                    >
                      Add New Question
                    </v-btn>
                  </v-col> -->
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-btn
                  v-if="editQuestionSteps === 1"
                  block
                  color="blue-darken-3"
                  size="small"
                  variant="flat"
                  style="height: 40px"
                  @click="editQuestionSteps++"
                >
                  Next
                </v-btn>

                <!-- <v-btn
                  v-if="editQuestionSteps === 2"
                  block
                  color="blue-darken-3"
                  size="small"
                  variant="flat"
                  style="height: 40px"
                  @click="onUpdatePatrolLogQuestion(specificPatrolQuestion)"
                  :disabled="isUpdating"
                >
                  Save
                </v-btn> -->
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <span :class="`${$vuetify.display.mdAndUp && 'pl-4'} text-caption`">
          @ 2024 by Seven 365 Pte Ltd V1.0
        </span>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const { theme } = useLocal();
const { getUserList, users, setUsers } = useUser();
const { setSnackbar } = useLocal();
const { currentUser } = useLocalAuth();
const { requiredInput } = useUtils();
const { getBlocks, getCctvOfBlock } = useCCTV();
const {
  vPatrol,
  setVPatrol,
  editDialog,
  addVirtualPatrol,
  getPatrolQuestionnairesByPage,
  updatePatrolQuestionnaire,
  specificPatrolQuestion,
  editQuestionSteps,
  currentPatrolLog,
  newOptionValues,
} = useVirtualPatrol();
const { getSitesOptionsForFiltering, mySite, myOrg, myProvider } = useFilter();
const { getAllServicesAvailable } = useSiteCollab();

const isProgress = ref(false);
const selectedLocation = ref("");

const patrolQuestionOption = ref("");
const innerQuestionOption = ref("");
const specificInnerQuestion = ref<TPatrolLogInnerQuestion>({
  name: "",
  options: [],
});
const isUpdating = ref(false);

const cctvList = ref([]);

async function onUpdatePatrolLogQuestion(
  patrolLogQuestion: TPatrolLogQuestion,
) {
  console.log(patrolLogQuestion);
  // isUpdating.value = true;
  // const item = await updatePatrolQuestionnaire(patrolLogQuestion);

  // if (item?.status === "success") {
  //   await getPatrolQuestionnairesByPage({
  //     page: 1,
  //     site: mySite.value,
  //     limit: 10,
  //     search: "",
  //   });
  //   setSnackbar({
  //     text: "Successful updated patrol log question.",
  //     modal: true,
  //     type: "success",
  //   });
  //   specificPatrolQuestion.value = {
  //     question: "",
  //     options: [],
  //     innerQuestions: [],
  //   };
  //   isUpdating.value = false;
  //   editQuestionSteps.value++;
  // } else {
  //   setSnackbar({
  //     text: "Failed to update patrol log question.",
  //     modal: true,
  //     type: "error",
  //   });
  //   isUpdating.value = false;
  // }
}

function onAddInnerQuestion(innerQuestion: TPatrolLogInnerQuestion) {
  specificPatrolQuestion.value.innerQuestions.push(innerQuestion);

  specificInnerQuestion.value = {
    name: "",
    options: [],
  };
}

function onAddInnerQuestionOption(
  innerOption: string,
  innerQuestion: { _id: string },
) {
  const index = specificPatrolQuestion.value.innerQuestions.findIndex(
    (i: any) => i._id === innerQuestion._id,
  );

  if (index !== -1) {
    specificPatrolQuestion.value.innerQuestions[index].options.push({
      innerOption: innerOption,
    });

    specificPatrolQuestion.value.innerQuestion[index].newOption = "";
  }
}

function onRemoveInnerQuestion(item: string) {
  specificPatrolQuestion.value.innerQuestions =
    specificPatrolQuestion.value.innerQuestions.filter(
      (i: any) => i.name !== item,
    );
}

function onDeleteInnerOption(innerQuestionId: string, innerOptionId: string) {
  const itemIndex = specificPatrolQuestion.value.innerQuestions.findIndex(
    (i: any) => i._id === innerQuestionId,
  );

  specificPatrolQuestion.value.innerQuestions[itemIndex].options =
    specificPatrolQuestion.value.innerQuestions[itemIndex].options.filter(
      (x: any) => x._id !== innerOptionId,
    );
}

// async function submit() {
//   try {
//     isProgress.value = true;

//     await addVirtualPatrol(vPatrol.value);

//     setSnackbar({
//       text: "Successful created route",
//       modal: true,
//       type: "success",
//     });

//     editQuestionSteps.value = 3;
//     isProgress.value = false;

//     cctvList.value = [];
//     selectedLocation.value = "";
//   } catch (err) {
//     setSnackbar({ text: err as string, modal: true, type: "error" });
//     isProgress.value = false;
//   }
// }

async function onCloseDialog() {
  await setVPatrol();

  editDialog.value = false;
  editQuestionSteps.value = 1;

  specificPatrolQuestion.value = {
    question: "",
    options: [],
    innerQuestions: [],
  };
}

async function goBack() {
  await setVPatrol();
  editQuestionSteps.value = 1;
}
</script>

<style scoped>
.text {
  text-align: start;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}

.dialog_desktop {
  margin: 0 0 0 auto;
  max-width: 28rem;
  border-radius: 25px 0 0 25px;

  box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
}

:deep() .v-field__outline {
  --v-field-border-opacity: 0.1;
}

:deep() .v-overlay__scrim {
  opacity: var(--v-overlay-opacity, 0);
}

:deep() .v-switch .v-label {
  padding-right: 10px;
  font-size: 13px;
}

:deep() .v-switch .v-selection-control {
  display: flex;
  flex-direction: row-reverse;
}

:deep() .v-text-field input {
  font-size: 13px !important;
}

.overridePicker {
  width: 28px;
}
</style>
