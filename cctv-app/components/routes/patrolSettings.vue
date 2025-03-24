<template>
  <v-dialog
    v-model="patrolSettingsDialog"
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
        <span class="font-weight-bold px-3 pt-1 text-capitalize"
          >Add Question</span
        >
        <v-spacer></v-spacer>
        <v-btn
          size="small"
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
              height="125"
              :src="`${
                useRuntimeConfig().public.S3_BUCKET
              }/images/empty-building-management-list.svg`"
            />
          </v-col>

          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12" v-if="addQuestionSteps <= 2">
                <v-row class="px-3 mb-4" justify="space-between">
                  <span class="font-weight-bold">
                    <v-btn
                      v-if="addQuestionSteps === 2"
                      size="x-small"
                      variant="flat"
                      class="grey-darken-1"
                      icon="mdi-chevron-left"
                      @click="addQuestionSteps--"
                    />
                    {{
                      addQuestionSteps === 1
                        ? "General Information"
                        : "Questions"
                    }}
                  </span>
                  <v-chip size="small" color="grey-lighten-1">
                    <span
                      :class="`${theme === 'dark' ? 'grey-darken-4' : 'white'}`"
                    >
                      Step <span class="text-blue">{{ addQuestionSteps }}</span
                      >/2
                    </span>
                  </v-chip>
                </v-row>
              </v-col>

              <v-col cols="12" class="mb-6" v-if="addQuestionSteps <= 2">
                <v-row v-if="addQuestionSteps === 1">
                  <v-col cols="12">
                    <v-textarea
                      ref="mainQuestionRef"
                      v-model="specificPatrolQuestion.question"
                      label="Subject"
                      density="comfortable"
                      hide-details
                      :disabled="isProgress"
                      :rules="[requiredInput]"
                    ></v-textarea>
                  </v-col>
                </v-row>

                <v-row v-if="addQuestionSteps === 2">
                  <v-col cols="12">
                    <v-text-field
                      v-model="specificInnerQuestion.name"
                      label="Inner Question"
                      ref="innerQuestionRef"
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
                  </v-col>

                  <v-col
                    cols="12"
                    v-if="specificPatrolQuestion.innerQuestions.length"
                  >
                    <template
                      v-for="(
                        item, index
                      ) in specificPatrolQuestion.innerQuestions"
                      :key="item.uid"
                    >
                      <v-card class="px-2 py-3 mb-5">
                        <v-text-field
                          :model-value="item.name"
                          hide-details
                          readonly
                          :label="`Inner Question ${index + 1}`"
                        >
                          <template v-slot:append>
                            <v-icon
                              class="cursor-pointer"
                              color="red"
                              @click="onDeleteInnerQuestion(item.uid)"
                              >mdi-delete</v-icon
                            >
                          </template></v-text-field
                        >

                        <div
                          v-if="item.options.length"
                          v-for="(i, idx) in item.options"
                          class="py-2 mt-2"
                        >
                          <v-text-field
                            :label="`Answer ${idx + 1}`"
                            :model-value="i.innerOption"
                            hide-details
                            readonly
                          >
                            <template v-slot:append>
                              <v-icon
                                class="cursor-pointer"
                                color="red"
                                @click="onDeleteInnerOption(item.uid, i.uid)"
                                >mdi-close-circle</v-icon
                              >
                            </template>
                          </v-text-field>
                        </div>

                        <v-text-field
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
                                onAddInnerQuestionOption(
                                  item.newOption,
                                  item.uid,
                                )
                              "
                              >mdi-plus-box</v-icon
                            >
                          </template></v-text-field
                        >
                      </v-card>
                    </template>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="specificPatrolQuestion.routes"
                      label="Applied Routes"
                      :items="vPatrols"
                      :item-title="(res: TVirtualPatrol) => res.routeName"
                      item-value="_id"
                      density="comfortable"
                      :disabled="isProgress || appliedToAll"
                      :rules="[requiredArrayInput]"
                      multiple
                      chips
                    ></v-select>
                    <v-checkbox
                      v-model:model-value="appliedToAll"
                      label="Apply to All Routes"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" v-if="addQuestionSteps === 3">
                <div class="text-center mt-6 text-subtitle-1 font-weight-bold">
                  Great!
                </div>
                <div class="text-center mt-2 text-caption">
                  A new patrol log question is added.
                </div>
                <v-row class="px-3 mt-5" justify="space-between">
                  <v-col cols="6">
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

                  <v-col cols="6">
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
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-btn
                  v-if="addQuestionSteps === 1"
                  block
                  color="blue-darken-3"
                  size="small"
                  variant="flat"
                  style="height: 40px"
                  @click="onNextStep()"
                >
                  Next
                </v-btn>

                <v-btn
                  v-if="addQuestionSteps === 2"
                  block
                  color="blue-darken-3"
                  size="small"
                  variant="flat"
                  style="height: 40px"
                  @click="onAddPatrolLogQuestion(specificPatrolQuestion)"
                  :loading="isAddingPatrolQuestion"
                  :disabled="isInvalid(specificPatrolQuestion)"
                >
                  Start Patrol Question
                </v-btn>
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
import { v4 as uuidv4 } from "uuid";

definePageMeta({
  middleware: "secure",
});

const { theme } = useLocal();
const { getUserList, users, setUsers } = useUser();
const { setSnackbar } = useLocal();
const { currentUser } = useLocalAuth();
const { requiredInput, requiredArrayInput } = useUtils();

const {
  setVPatrol,
  addDialog,
  patrolSettingsDialog,
  patrolMainQuestions,
  addPatrolQuestionnaire,
  getPatrolQuestionnairesByPage,
  specificPatrolQuestion,
  addQuestionSteps,
  vPatrols,
} = useVirtualPatrol();
const { getSitesOptionsForFiltering, mySite, myOrg, myProvider } = useFilter();
const { getAllServicesAvailable } = useSiteCollab();

interface IFormRef {
  validate: () => void;
}

const isProgress = ref(false);
const isAddingPatrolQuestion = ref(false);
const mainQuestionRef = ref<IFormRef | null>(null);
const innerQuestionRef = ref<IFormRef | null>(null);

const patrolQuestionOption = ref("");
const innerQuestionOption = ref("");

const appliedToAll = ref(false);

const specificInnerQuestion = ref({
  uid: uuidv4(),
  name: "",
  options: [],
  newOption: "",
});

function onNextStep() {
  if (!specificPatrolQuestion.value.question) {
    (mainQuestionRef.value as any)?.focus();
    return mainQuestionRef.value?.validate();
  }

  addQuestionSteps.value++;
}

function isInvalid(patrolLogQuestion: TPatrolLogQuestion) {
  if (appliedToAll.value || patrolLogQuestion.routes?.length >= 1) return false;

  return true;
}

async function onAddPatrolLogQuestion(patrolLogQuestion: TPatrolLogQuestion) {
  patrolLogQuestion.site = mySite.value;
  patrolLogQuestion.isAppliedAll = appliedToAll.value;

  if (!specificPatrolQuestion.value.innerQuestions.length) {
    (innerQuestionRef.value as any).focus();
    return innerQuestionRef.value?.validate();
  }

  // This comment is use to check if there is existing options in every innerQuestions for validation
  const questionWithoutOptions =
    specificPatrolQuestion.value.innerQuestions.find(
      (question: any) => !question.options || question.options.length === 0,
    );

  if (questionWithoutOptions) {
    return setSnackbar({
      text: "Inner question must have option/answer.",
      modal: true,
      type: "error",
    });
  }

  if (patrolLogQuestion.routes?.length <= 0 && !appliedToAll.value) {
    return setSnackbar({
      text: "Please select routes to apply this question.",
      modal: true,
      type: "error",
    });
  }

  if (appliedToAll.value) {
    if (vPatrols.value) {
      patrolLogQuestion.routes = vPatrols.value.map((item: any) => item._id);
    } else {
      isAddingPatrolQuestion.value = false;

      return setSnackbar({
        text: "No available routes.",
        modal: true,
        type: "error",
      });
    }
  }

  isAddingPatrolQuestion.value = true;

  const item = await addPatrolQuestionnaire(patrolLogQuestion);

  if (item) {
    const questions: any = await getPatrolQuestionnairesByPage({
      page: 1,
      site: mySite.value,
      limit: 10,
      search: "",
    });

    if (Array.isArray(questions.items) && questions?.items.length) {
      patrolMainQuestions.value = questions?.items;
    }

    setSnackbar({
      text: "Successful created patrol log question.",
      modal: true,
      type: "success",
    });

    specificPatrolQuestion.value = {
      question: "",
      options: [],
      innerQuestions: [],
      site: "",
    };

    addQuestionSteps.value++;
  }

  isAddingPatrolQuestion.value = false;
}

function onAddInnerQuestion(innerQuestion: TPatrolLogInnerQuestion) {
  if (!specificInnerQuestion.value.name) {
    return;
  }

  specificPatrolQuestion.value.innerQuestions.push(innerQuestion);

  specificInnerQuestion.value = {
    uid: uuidv4(),
    name: "",
    options: [],
    newOption: "",
  };
}

function onAddInnerQuestionOption(innerOption: string, uid: string) {
  const index = specificPatrolQuestion.value.innerQuestions.findIndex(
    (i: any) => i.uid === uid,
  );

  if (index !== -1) {
    specificPatrolQuestion.value.innerQuestions[index].options.push({
      innerOption: innerOption,
      uid: uuidv4(),
    });

    specificPatrolQuestion.value.innerQuestions[index].newOption = "";
  }

  // console.log(specificPatrolQuestion.value);
}

function onDeleteInnerQuestion(uid: string) {
  specificPatrolQuestion.value.innerQuestions =
    specificPatrolQuestion.value.innerQuestions.filter(
      (i: any) => i.uid !== uid,
    );
}

function onDeleteInnerOption(innerQuestionUid: string, innerOptionUid: string) {
  const itemIndex = specificPatrolQuestion.value.innerQuestions.findIndex(
    (i: any) => i.uid === innerQuestionUid,
  );

  specificPatrolQuestion.value.innerQuestions[itemIndex].options =
    specificPatrolQuestion.value.innerQuestions[itemIndex].options.filter(
      (x: any) => x.uid !== innerOptionUid,
    );
}

async function onCloseDialog() {
  patrolSettingsDialog.value = false;
  addQuestionSteps.value = 1;

  specificPatrolQuestion.value = {
    question: "",
    options: [],
    innerQuestions: [],
    site: "",
  };
}

async function goBack() {
  addQuestionSteps.value = 1;
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
