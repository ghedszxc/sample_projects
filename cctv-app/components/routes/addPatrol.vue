<template>
  <v-navigation-drawer
    v-model="addDialog"
    transition="dialog-right-transition"
    location="right"
    permanent
    :style="
      addDialog
        ? $vuetify.display.mdAndUp
          ? 'width: 24rem;'
          : 'width: 100vw;'
        : ''
    "
  >
    <v-card
      :loading="isProgress"
      :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
      :class="`${theme == 'light' && 'bg-white'} px-3 h-100 ${
        $vuetify.display.mdAndUp && ''
      }`"
      style="overflow-y: auto; height: 100%"
    >
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="orange"
          height="8"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
        <span class="font-weight-bold pl-4 pt-1 text-capitalize text-h6"
          >Patrol Log</span
        >
        <v-spacer></v-spacer>
        <v-tooltip
          text="Edit Patrol Log"
          location="bottom"
          v-if="patrolLog.isLocked"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              color="warning"
              size="x-small"
              icon
              class="mr-3"
              @click="onEditPatrolLog()"
            >
              <v-icon size="35px">mdi-pencil</v-icon></v-btn
            >
          </template>
        </v-tooltip>

        <v-tooltip
          :text="
            !patrolLog.isActiveReportStatus
              ? 'Report Camera'
              : 'Display Questionnaires'
          "
          location="bottom"
          v-if="!isScheduleToday && !canDoPatrolling"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              :color="
                !patrolLog.isActiveReportStatus ? 'error' : 'blue-darken-3'
              "
              size="x-small"
              icon
              class="mr-3"
              @click="onReportCamera()"
              :disabled="patrolLog.isLocked || onGoingPatrolLog !== cctvId"
            >
              <v-icon size="35px">
                {{
                  !patrolLog.isActiveReportStatus
                    ? "mdi-alert"
                    : "mdi-format-list-bulleted-square"
                }}
              </v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-btn
          size="x-small"
          color="grey-darken-1"
          icon="mdi-close"
          @click="onCloseDialog()"
        ></v-btn>
      </v-toolbar>

      <v-divider></v-divider>
      <div
        class="text-caption px-6 pt-2 pb-3 text-grey"
        v-if="
          !isScheduleToday &&
          !canDoPatrolling &&
          patrolLog.startDateTimeDuration
        "
      >
        <v-row>
          <v-col cols="7">
            <v-icon class="mr-1">mdi-calendar-clock</v-icon>
            {{ standardFormatDateTime(patrolLog.startDateTimeDuration) }}
          </v-col>
          <v-col cols="5" class="text-end">
            {{
              `${patrolLog.isLocked ? patrolLog.duration : patrolTimeDuration} seconds`
            }}
          </v-col>
        </v-row>
      </div>

      <v-card-text>
        <div v-if="!isScheduleToday">
          <v-row no-gutters v-if="!canDoPatrolling">
            <v-col cols="12" class="mb-6" v-if="addRouteSteps == 1">
              <v-row>
                <v-col
                  cols="12"
                  v-if="
                    !patrolLog.isActiveReportStatus && !displayEditPatrolLogForm
                  "
                >
                  <draggableVue
                    v-model="patrolLog.logQuestions"
                    item-key="index"
                    :animation="200"
                    :disabled="isProgress || patrolLog.isLocked"
                    ghost-class="ghost"
                    drag-class="dragging"
                    handle=".cursor-grab"
                  >
                    <template #item="{ element, index }">
                      <div>
                        <transition-group type="transition" name="flip-list">
                          <v-row>
                            <v-col
                              cols="9"
                              class="pt-6 font-weight-bold"
                              style="font-size: 1.1rem"
                            >
                              <v-icon
                                class="cursor-grab mb-1 mr-1"
                                size="x-small"
                              >
                                mdi-drag
                              </v-icon>
                              {{ element.question }}
                            </v-col>
                            <v-col cols="3" align-self="center">
                              <v-switch
                                v-model="element.options"
                                color="green-darken-3"
                                density="compact"
                                hide-details
                                inset
                                :disabled="
                                  isProgress ||
                                  patrolLog.isLocked ||
                                  onGoingPatrolLog !== cctvId
                                "
                              ></v-switch>
                            </v-col>

                            <v-col cols="12" v-if="element.options">
                              <v-row>
                                <v-col
                                  cols="12"
                                  v-for="(
                                    inner, index
                                  ) in element.innerQuestions"
                                  :key="index"
                                >
                                  <v-select
                                    v-model="inner.answer"
                                    :label="inner.name"
                                    :items="inner.options"
                                    item-title="innerOption"
                                    item-value="innerOption"
                                    density="comfortable"
                                    hide-details
                                    :disabled="isProgress || patrolLog.isLocked"
                                    :rules="[requiredArrayInput]"
                                    multiple
                                    chips
                                  ></v-select>
                                </v-col>

                                <v-col cols="12" v-if="isScreenshotEnabled">
                                  <v-btn
                                    color="blue-darken-3"
                                    size="small"
                                    variant="flat"
                                    style="height: 40px"
                                    @click="onCaptureCctv(index)"
                                    :disabled="isProgress || patrolLog.isLocked"
                                    :loading="isProgressDoodle"
                                    class="mb-3"
                                  >
                                    <v-icon class="mr-2 mt-1">mdi-camera</v-icon
                                    >Take Screenshot
                                  </v-btn>

                                  <div
                                    :id="`div_${index}`"
                                    style="display: none"
                                  >
                                    <canvas
                                      :id="`imageCanvas_${index}`"
                                      style="width: 100%; height: 100%"
                                    ></canvas>
                                  </div>
                                </v-col>

                                <v-col cols="12" v-if="isRecordingEnabled">
                                  <v-btn
                                    color="blue-darken-3"
                                    size="small"
                                    variant="flat"
                                    style="height: 40px"
                                    @click="onRecordCctv(index)"
                                    :disabled="isProgress || patrolLog.isLocked"
                                    class="mb-3"
                                  >
                                    <v-icon class="mr-2 mt-1">mdi-video</v-icon
                                    >Take Recording
                                  </v-btn>

                                  <div
                                    :id="`div_video_${index}`"
                                    style="display: none"
                                  >
                                    <video
                                      controls
                                      style="width: 100%; height: 100%"
                                      :id="`video_${index}`"
                                    ></video>
                                  </div>
                                </v-col>
                                <v-col cols="12">
                                  <v-textarea
                                    v-model="element.remarks"
                                    label="Input Remarks"
                                    density="compact"
                                    hide-details
                                    rows="3"
                                    :disabled="isProgress || patrolLog.isLocked"
                                    :rules="[requiredInput]"
                                    class="mb-4"
                                  ></v-textarea>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </transition-group>
                      </div>
                    </template>
                  </draggableVue>
                </v-col>

                <v-col
                  v-if="
                    patrolLog.isActiveReportStatus && !displayEditPatrolLogForm
                  "
                  cols="12"
                >
                  <v-select
                    v-model="patrolLog.reportLabel"
                    label="Report Camera"
                    :items="cameraReportStatus"
                    density="comfortable"
                    hide-details
                    :disabled="isProgress || patrolLog.isLocked"
                    :rules="[requiredInput]"
                  ></v-select>
                  <v-textarea
                    v-if="patrolLog.reportLabel === 'Others'"
                    v-model="reportStatus"
                    density="compact"
                    hide-details
                    rows="5"
                    class="mt-5"
                    :disabled="isProgress || patrolLog.isLocked"
                    :rules="[requiredInput]"
                  ></v-textarea>
                </v-col>

                <v-col cols="12" v-if="displayEditPatrolLogForm">
                  <v-textarea
                    v-model="editHistory.reason"
                    label="Reason for edit"
                    density="compact"
                    hide-details
                    rows="5"
                    class="mt-5"
                    :disabled="isProgress"
                    :rules="[requiredInput]"
                  ></v-textarea>

                  <v-btn
                    block
                    color="blue-darken-3"
                    size="small"
                    variant="flat"
                    style="height: 40px"
                    class="mt-4"
                    :disabled="isProgress || !editHistory.reason"
                    @click="onSubmitEditPatrolLogReason()"
                  >
                    Submit Reason
                  </v-btn>
                </v-col>

                <v-col cols="12" v-if="!displayEditPatrolLogForm">
                  <v-btn
                    v-if="onGoingPatrolLog === cctvId"
                    block
                    :color="`${
                      validateNextCctv ? 'blue-darken-3' : 'green-darken-2'
                    }`"
                    size="small"
                    variant="flat"
                    style="height: 40px"
                    @click="
                      validateNextCctv ? onCheckEndTime() : beforeSubmit()
                    "
                    :disabled="
                      isProgress ||
                      isEditExistingPatrolLog ||
                      checkReportStatus(patrolLog)
                    "
                  >
                    {{
                      validateNextCctv
                        ? "Proceed Next Patrol Log"
                        : "Submit All Patrol Logs"
                    }}
                  </v-btn>
                  <v-btn
                    v-else
                    block
                    color="orange"
                    size="small"
                    variant="flat"
                    style="height: 40px"
                    @click="onRerouteCctv(onGoingPatrolLog)"
                    :disabled="isProgress"
                  >
                    Go to Ongoing Patrol
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" v-if="addRouteSteps == 2">
              <div class="mb-5">
                <v-img :src="`/images/confirmation.svg`" height="125" />
              </div>
              <div class="text-center mt-6 text-subtitle-1 font-weight-bold">
                Great!
              </div>
              <div class="text-center mt-2 text-caption">
                A new log is added to the list of patrol log
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
              </v-row>
            </v-col>
          </v-row>

          <div v-else class="text-center text-h6">Already patrolled today.</div>
        </div>
        <div v-else class="text-center text-h6">
          Patrolling for this route is not scheduled at this moment.
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <span :class="`${$vuetify.display.mdAndUp && 'pl-4'} text-caption`">
          @ 2024 by Seven 365 Pte Ltd V1.0
        </span>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>

  <v-dialog
    v-model="confirmationDialog"
    transition="dialog-top-transition"
    max-width="500"
  >
    <v-card :loading="isConfirming">
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="orange"
          height="8"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-card-text class="py-5">
        <v-img :src="`/images/confirmation.svg`" height="125" />
        <div class="font-weight-bold text-center py-5">
          Confirm Password to Submit
        </div>

        <v-text-field
          v-model="password"
          label="Input Your Password"
          density="compact"
          hide-details
          :disabled="isProgress || isEditExistingPatrolLog"
          :rules="[requiredInput]"
          class="mb-4"
          type="password"
        ></v-text-field>

        <v-btn
          block
          color="blue-darken-3"
          size="small"
          variant="flat"
          style="height: 40px"
          @click="onConfirmPassword()"
          :disabled="isProgress || isEditExistingPatrolLog"
        >
          Confirm
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="doodleImageDialog"
    transition="dialog-top-transition"
    max-width="1000"
    persistent
  >
    <v-card :loading="isProgress" class="pa-1">
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="orange"
          height="8"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-card-title class="text-end" v-if="!isProgress">
        <v-btn
          color="orange-darken-3"
          size="small"
          variant="flat"
          style="height: 40px; margin-right: 12px"
          @click="onClearDoodle()"
        >
          Clear Drawing
        </v-btn>
        <v-btn
          color="blue-darken-3"
          size="small"
          variant="flat"
          style="height: 40px"
          @click="onSubmitDoodle()"
        >
          Submit
        </v-btn>
      </v-card-title>
      <canvas id="imageCanvas" />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import moment from "moment-timezone";
import usePatrolLog from "~/composables/cctv/usePatrolLog";

const emits = defineEmits(["onProceed"]);

definePageMeta({
  middleware: "secure",
});

const { theme } = useLocal();
const { setSnackbar } = useLocal();
const { verifyPassword } = useUser();
const { currentUser } = useLocalAuth();
const { standardFormatDateTime, requiredInput } = useUtils();
const { getSiteSettingsById } = useSiteSettings();

const { mySite, myOrg } = useFilter();
const site_id = computed(() => window.location.search.split("=")[1] as string);

const {
  vPatrol,
  vPatrols,
  setVPatrols,
  getVPatrolById,

  selectedCctv,
  isVPatrolLoading,

  addDialog,
  addRouteSteps,

  patrolQuestionnaires,
  getPatrolQuestionnaires,

  addPatrolLog,

  getQuestionnairesWithAnswers,
  getQuestionnairesWithoutAnswers,

  patrolTimeDuration,
  lastPatrolTimeDuration,
  patrolStartDateTimeDuration,

  onStartRecording,
  onStopRecording,

  isActiveReportStatus,
  isReportStatus,

  reportStatus,

  isScheduleToday,
  isLatePatrolling,

  validateNextCctv,
  isEditExistingPatrolLog,
  isValidPatrolLog,
  canDoPatrolling,
} = useVirtualPatrol();

const { patrolLog, patrolLogKey, patrolLogError, onGoingPatrolLog } =
  usePatrolLog();

const { getCctvById } = useCCTV();

const isProgress = ref(false);
const isProgressDoodle = ref(false);

const isConfirming = ref(false);
const confirmationDialog = ref(false);
const isScreenshotEnabled = ref(false);
const isRecordingEnabled = ref(false);

const password = ref("");

const displayEditPatrolLogForm = ref(false);

const cctvName = ref("");
const cctvBlock = ref("");

const cameraReportStatus = ref(["Inaccessible / Obstructed", "Others"]);
const editHistory = ref({ reason: "", datetime: new Date() });

const cctvId = computed(() =>
  useRoute().params.cctvId ? String(useRoute().params.cctvId) : "",
);

const routeId = computed(() =>
  useRoute().params.routeId ? String(useRoute().params.routeId) : "",
);

onMounted(async () => {
  const assigneeIds = /^(service-provider-member)$/i.test(
    currentUser.value.type,
  )
    ? currentUser.value._id
    : "";

  await setVPatrols({
    site: mySite.value,
    assigneeIds: assigneeIds,
  });
  const result = await getSiteSettingsById(mySite.value);

  if (result && result.virtualPatrolSettings) {
    isScreenshotEnabled.value =
      result.virtualPatrolSettings.isScreenshotEnabled;
    isRecordingEnabled.value = result.virtualPatrolSettings.isRecordingEnabled;
  }

  if (onGoingPatrolLog.value === "") {
    onGoingPatrolLog.value = cctvId.value;
  }
});

window.onbeforeunload = function () {
  if (addDialog.value) storePatrolLog({ cctvId: cctvId.value });
};

watch(
  addDialog,
  (value) => {
    if (value) storePatrolLog({ cctvId: cctvId.value });
    else isValidPatrolLog.value = true;
  },
  { deep: true },
);

watch(
  cctvId,
  (value, lastValue) => {
    if (!addDialog.value) return;

    const isValid = /^[0-9a-fA-F]{24}$/.test(lastValue);
    storePatrolLog({ cctvId: value, lastCctv: isValid ? lastValue : "" });
    displayEditPatrolLogForm.value = false;
  },
  { deep: true },
);

watch(
  patrolLog,
  (value) => {
    checkPatrolLogValidity(value);
    if (!value.isLocked) storePatrolLog({ cctvId: cctvId.value });
  },
  { deep: true },
);

function checkReportStatus(value: TPatrolLog) {
  let inValid = false;
  isValidPatrolLog.value = true;

  if (!value.isActiveReportStatus) return false;
  if (!value.reportLabel) inValid = true;
  if (value.reportLabel === "Others" && reportStatus.value === "")
    inValid = true;

  if (inValid) {
    patrolLogError.value = "Please input the camera report status.";
    isValidPatrolLog.value = false;
  }

  return inValid;
}

function checkPatrolLogValidity(value: TPatrolLog) {
  value.logQuestions.forEach((item: TPatrolLogQuestion) => {
    if (item.options) {
      isValidPatrolLog.value = false;
      patrolLogError.value = "Please answer the selected patrol log questions.";
      if (
        item.innerQuestions &&
        item.innerQuestions
          .map((q: any) => q.hasOwnProperty("answer"))
          .every(Boolean)
      ) {
        isValidPatrolLog.value = true;
      } else {
        return;
      }
    }
  });
}

function storePatrolLog({
  cctvId = "",
  lastCctv = "",
  isLock = false,
}: {
  cctvId: string;
  lastCctv?: string;
  isLock?: boolean;
}) {
  const logKey = patrolLogKey.value;

  if (!/^[0-9a-fA-F]{24}$/.test(routeId.value)) return;

  if (!localStorage.getItem(logKey)) {
    localStorage.setItem(logKey, JSON.stringify({}));
  }

  let logs = JSON.parse(localStorage.getItem(logKey) ?? "{}");

  let newPatrolLog = JSON.parse(JSON.stringify(patrolLog.value)) as TPatrolLog;
  newPatrolLog.duration = patrolTimeDuration.value;

  if (isLock) {
    newPatrolLog.endDateTimeDuration = moment
      .tz(moment(new Date()), "Asia/Singapore")
      .toDate();

    if (patrolLog.value.isActiveReportStatus) {
      newPatrolLog.reportStatus = {
        report:
          patrolLog.value.reportLabel === "Others"
            ? reportStatus.value
            : patrolLog.value.reportLabel,
        camera: cctvName.value,
        location: cctvBlock.value,
      };
    }
    newPatrolLog.isLocked = true;
  }

  if (/^[0-9a-fA-F]{24}$/.test(cctvId)) logs[cctvId] = newPatrolLog;

  if (lastCctv && logs[lastCctv] && !logs[lastCctv].isLocked) {
    logs[lastCctv].duration = lastPatrolTimeDuration.value;
  }

  localStorage.setItem(logKey, JSON.stringify(logs));
}

async function submit() {
  try {
    isProgress.value = true;

    const logKey = patrolLogKey.value;

    let logs = JSON.parse(localStorage.getItem(logKey) ?? "{}");
    logs = Object.keys(logs).map((key: any) => logs[key]);

    logs = logs.map((item: TPatrolLog) => constructPayload(item));

    if (!logs) {
      setSnackbar({
        text: "Cannot submit patrol log, try again.",
        type: "error",
        modal: true,
      });
    }
    // const payload = await constructPayload();

    // if (!localStorage.getItem("pre-reg-log")) {
    //   localStorage.setItem("pre-reg-log", JSON.stringify([]));
    // }

    // const logs = JSON.parse(localStorage.getItem("pre-reg-log"))?.filter(
    //   (find: any) => find.routeId == window.location.pathname.split("/")[2],
    // );
    // logs.push(payload);

    // localStorage.setItem("pre-reg-log", JSON.stringify(logs));

    const bodyData = {
      routeId: window.location.pathname.split("/")[2],
      assignee: currentUser.value._id,
      site: site_id.value,
      organization: myOrg.value,
      isLatePatrolling: isLatePatrolling.value,
      timeStartedPatrolling: logs[0].startDateTimeDuration,
      patrolLogsArray: logs,
    };

    await addPatrolLog(bodyData);

    localStorage.removeItem(logKey);

    setSnackbar({
      text: "Successful created patrol log",
      modal: true,
      type: "success",
    });

    addDialog.value = false;
    confirmationDialog.value = false;
    password.value = "";

    isProgress.value = false;
    isConfirming.value = false;
    validateNextCctv.value = true;
    onGoingPatrolLog.value = "";

    useRouter().push({
      name: "routes",
    });
  } catch (err) {
    setSnackbar({ text: err as string, modal: true, type: "error" });
    isProgress.value = false;
    isConfirming.value = false;
  }
}

function constructPayload(log: TPatrolLog) {
  let newLog = log as any;

  delete newLog._id;
  delete newLog.isLocked;
  delete newLog.reportLabel;

  newLog.logQuestions = !log.isActiveReportStatus
    ? log.logQuestions
        .filter((find: any) => find.options)
        .map((item: any) => {
          return {
            _id: item._id,
            answer: "Yes",
            screenshotAttachment: item?.screenshotAttachment || "",
            recordingAttachment: item?.recordingAttachment || "",
            remarks: item?.remarks || "",
            innerQuestions: item.innerQuestions.map((inner: any) => {
              return {
                _id: inner._id,
                answer: inner.answer || [],
              };
            }),
          };
        })
    : [];

  return newLog;
}

async function beforeSubmit() {
  if (!isValidPatrolLog.value) {
    setSnackbar({
      text: patrolLogError.value,
      type: "error",
      modal: true,
    });
    return;
  }

  storePatrolLog({ cctvId: cctvId.value, isLock: true });
  patrolLog.value.isLocked = true;
  patrolLog.value.duration = patrolTimeDuration.value;
  onStopRecording();

  confirmationDialog.value = true;
  password.value = "";
}

async function onConfirmPassword() {
  try {
    isConfirming.value = true;
    await verifyPassword({
      id: currentUser.value._id,
      password: password.value,
    });
    submit();
  } catch (err) {
    setSnackbar({ text: err as string, modal: true, type: "error" });
    isConfirming.value = false;
  }
}

async function onCloseDialog() {
  addDialog.value = false;
  addRouteSteps.value = 1;
  // patrolQuestionnaires.value = [];
  storePatrolLog({ cctvId: cctvId.value });

  // const getLogs = JSON.parse(localStorage.getItem("pre-reg-log"))?.filter(
  //   (find: any) => find.routeId == window.location.pathname.split("/")[2],
  // );

  // if (getLogs?.length) {
  //   const logIndex = getLogs?.findIndex(
  //     (find: any) => find.cctvId == window.location.pathname.split("/")[4],
  //   );

  //   if (logIndex != -1) {
  //     getLogs[logIndex].duration = patrolTimeDuration.value;
  //     localStorage.setItem("pre-reg-log", JSON.stringify(getLogs));
  //   }
  // }
}

async function proceedNextPatrolLog() {
  storePatrolLog({ cctvId: cctvId.value, isLock: true });
  if (validateNextCctv.value) rerouteNextCctv();
  // const payload = await constructPayload();

  // const logs = JSON.parse(localStorage.getItem("pre-reg-log"))?.filter(
  //   (find: any) => find.routeId == window.location.pathname.split("/")[2],
  // );

  // if (logs?.length) {
  //   const findLogIndex = logs.findIndex(
  //     (find: any) => find.cctvId == window.location.pathname.split("/")[4],
  //   );

  //   // UPDATE PATROL LOG FROM LOCAL STORAGE
  //   if (findLogIndex != -1) {
  //     logs[findLogIndex] = payload;
  //     localStorage.setItem("pre-reg-log", JSON.stringify(logs));

  //     // onCloseDialog();

  //     setSnackbar({
  //       text: `patrol log for ${selectedCctv.value?.name} is updated`,
  //       modal: true,
  //       type: "success",
  //     });

  //     rerouteNextCctv();
  //   }
  //   // ADD PATROL LOG FROM LOCAL STORAGE
  //   else {
  //     logs.push(payload);
  //     localStorage.setItem("pre-reg-log", JSON.stringify(logs));

  //     if (validateNextCctv.value) rerouteNextCctv();
  //   }
  // } else {
  //   localStorage.setItem("pre-reg-log", JSON.stringify([payload]));
  //   if (validateNextCctv.value) rerouteNextCctv();
  // }
}

function onRerouteCctv(cctvId?: string) {
  useRouter().push({
    name: "routes-routeId-cctv-cctvId",
    params: {
      routeId: routeId.value,
      cctvId: cctvId,
    },
    query: {
      site: mySite.value,
    },
  });
}

async function onCheckEndTime() {
  if (!isValidPatrolLog.value) {
    setSnackbar({
      text: patrolLogError.value,
      type: "error",
      modal: true,
    });
    return;
  }

  const getRouteSchedule = vPatrol.value.routeDetails.schedule;

  const getEndScheduledHour = parseInt(getRouteSchedule.endTime.split(":")[0]);
  const getEndScheduledMins = parseInt(getRouteSchedule.endTime.split(":")[1]);

  const end = getEndScheduledHour * 60 + getEndScheduledMins;

  const date = new Date(moment.tz(moment(new Date()), "Asia/Singapore"));
  const now = date.getHours() * 60 + date.getMinutes();

  now > end ? beforeSubmit() : proceedNextPatrolLog();
}

function getNextCctv() {
  const logKey = patrolLogKey.value;
  let logs = JSON.parse(localStorage.getItem(logKey) || "");

  const cctvList = vPatrol.value.items;

  if (logs) {
    logs = Object.keys(logs).map((keys: any) => logs[keys] as TPatrolLog);
    let nextIncomplete = logs.find((item: TPatrolLog) => !item.isLocked);

    logs = new Set(logs.map((log: TPatrolLog) => log.cctvId));
    let next = cctvList.find((cctv: any) => !logs.has(cctv._id));

    if (next) return next;
    if (nextIncomplete) return nextIncomplete;
  }

  return false;
}

async function rerouteNextCctv() {
  const nextCctv = getNextCctv();

  if (nextCctv) {
    selectedCctv.value = nextCctv;
    onGoingPatrolLog.value = nextCctv._id;
    useRouter().push({
      name: "routes-routeId-cctv-cctvId",
      params: {
        routeId: routeId.value || nextCctv.routeId,
        cctvId: nextCctv._id || nextCctv.cctvId,
      },
      query: {
        site: mySite.value,
      },
    });
  }
  // if (logs) {
  //   onStopRecording();
  //   isVPatrolLoading.value = true;
  //   //validateNextCctv.value = true;

  //   for (let i = 0; i < vPatrol.value.items.length; i++) {
  //     const isLogExisting = logs.findIndex(
  //       (find: any) => find.cctvId == vPatrol.value.items[i]._id,
  //     );

  //     if (isLogExisting == -1) {
  //       selectedCctv.value = vPatrol.value.items[i];
  //       useRouter().push({
  //         name: "routes-routeId-cctv-cctvId",
  //         params: {
  //           routeId: routeId.value,
  //           cctvId: vPatrol.value.items[i]._id,
  //         },
  //         query: {
  //           site: mySite.value,
  //         },
  //       });

  //       break;
  //     } else {
  //       if (!logs[isLogExisting].isLocked) {
  //         selectedCctv.value = vPatrol.value.items[i];
  //         useRouter().push({
  //           name: "routes-routeId-cctv-cctvId",
  //           params: {
  //             routeId: routeId.value,
  //             cctvId: vPatrol.value.items[i]._id,
  //           },
  //           query: {
  //             site: mySite.value,
  //           },
  //         });

  //         break;
  //       }
  //     }
  //   }
  // }
}

async function validateNextCctvUponPageLoad() {
  let checkRouteValue = setInterval(() => {
    if (vPatrol.value && vPatrol.value.items && vPatrol.value.items.length) {
      validateNextCctv.value = vPatrol.value.items.length != 1;
      clearInterval(checkRouteValue);
    }

    console.log(
      vPatrol.value && vPatrol.value.items && vPatrol.value.items.length,
    );
  }, 1000);
}

async function onCheckPreSubmitPayload(cctv_id: string) {
  const get_questionnaires = await getPatrolQuestionnaires(
    mySite.value,
    routeId.value,
  );

  const logs = JSON.parse(localStorage.getItem("pre-reg-log"))?.filter(
    (find: any) => find.routeId == window.location.pathname.split("/")[2],
  );
  const patrolLog = logs && logs.find((find: any) => find.cctvId == cctv_id);

  if (patrolLog) {
    getQuestionnairesWithAnswers(patrolLog, get_questionnaires);
  } else {
    getQuestionnairesWithoutAnswers(get_questionnaires);
  }
}

async function onReportCamera() {
  patrolLog.value.isActiveReportStatus = !patrolLog.value.isActiveReportStatus;

  if (!patrolLog.value.isActiveReportStatus) return;

  const cctv = (await getCctvById(patrolLog.value.cctvId)) as any;
  cctvName.value = cctv ? cctv.name : "";
  cctvBlock.value = cctv ? cctv.cctvBlock : "";
}

async function onEditPatrolLog() {
  displayEditPatrolLogForm.value = true;
}

async function onSubmitEditPatrolLogReason() {
  editHistory.value.datetime = moment
    .tz(moment(new Date()), "Asia/Singapore")
    .toDate();

  patrolLog.value.isLocked = false;
  patrolLog.value.editHistory = [editHistory.value];
  editHistory.value.reason = "";

  patrolTimeDuration.value = patrolLog.value.duration;
  onStartRecording(cctvId.value);
  displayEditPatrolLogForm.value = false;
  isEditExistingPatrolLog.value = false;
  onGoingPatrolLog.value = cctvId.value;

  // try {
  //   const get_questionnaires = await getPatrolQuestionnaires(mySite.value);
  //   const cctv_id = window.location.pathname.split("/")[4];
  //   const logs = JSON.parse(localStorage.getItem("pre-reg-log"))?.filter(
  //     (find: any) => find.routeId == window.location.pathname.split("/")[2],
  //   );
  //   const patrolLog = logs && logs.find((find: any) => find.cctvId == cctv_id);
  //   getQuestionnairesWithAnswers(patrolLog, get_questionnaires);
  // } catch (err) {
  //   setSnackbar({
  //     text: err,
  //     modal: true,
  //     type: "error",
  //   });
  // } finally {
  //   displayEditPatrolLogForm.value = false;
  //   isEditExistingPatrolLog.value = false;
  //   editPatrolLogForm.value.datetime = moment.tz(
  //     moment(new Date()),
  //     "Asia/Singapore",
  //   );
  // }
}

const doodleImageDialog = ref(false);
const doodleKey = ref(-1);
var canvas = document.getElementById("imageCanvas");
var ctx = "";
var img = "";

var pos = { x: 0, y: 0 };

watch(doodleImageDialog, (val) => {
  if (val) {
    pos.x = 0;
    pos.y = 0;
  }
});

async function setPosition(e: any) {
  var rect = canvas.getBoundingClientRect();

  if (rect.width < 712 && rect.height < 400) {
    var scaleX = 712 / rect.width;
    var scaleY = 400 / rect.height;

    pos.x = (e.clientX - rect.left) * scaleX;
    pos.y = (e.clientY - rect.top) * scaleY;
    return;
  }

  pos.x = e.clientX - rect.left;
  pos.y = e.clientY - rect.top;
}

async function draw(e: any) {
  canvas.style.cursor = "crosshair";

  if (e.buttons !== 1) return;

  if (pos.x === 0 && pos.y === 0) setPosition(e);

  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#FF0000";
  ctx.moveTo(pos.x, pos.y);

  setPosition(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.closePath();
}

const { captureCctvFeed, recordCctvFeed } = useCCTV();
async function onCaptureCctv(key: number) {
  isProgressDoodle.value = true;

  try {
    const item: any = await captureCctvFeed(selectedCctv.value.ip);
    const image = await convertBlobToBase64(item);

    doodleImageDialog.value = true;

    setTimeout(() => {
      canvas = document.getElementById("imageCanvas");
      ctx = canvas.getContext("2d");

      var rect = canvas.getBoundingClientRect();
      canvas.width = rect.width < 712 ? 712 : rect.width;
      canvas.height = rect.height < 400 ? 400 : rect.height;

      img = new Image();

      img.onload = function () {
        var ratio = this.height / this.width;
        canvas.height = canvas.width * ratio;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = image;

      canvas.addEventListener("mousedown", setPosition);
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener(
        "touchstart",
        function (e) {
          var touch = e.touches[0];
          var mouseEvent = new MouseEvent("mousedown", {
            buttons: 1,
            clientX: touch.clientX,
            clientY: touch.clientY,
          });
          canvas.dispatchEvent(mouseEvent);
        },
        false,
      );
      canvas.addEventListener(
        "touchmove",
        function (e) {
          var touch = e.touches[0];
          var mouseEvent = new MouseEvent("mousemove", {
            buttons: 1,
            clientX: touch.clientX,
            clientY: touch.clientY,
          });
          canvas.dispatchEvent(mouseEvent);
        },
        false,
      );
    }, 500);
  } catch (error) {
    console.error(error);
  } finally {
    isProgressDoodle.value = false;

    doodleKey.value = key;
    document.getElementById("imageCanvas").style.cursor = "crosshair";
  }
}

async function convertBlobToBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
}

async function onSubmitDoodle() {
  var canvasCopy = document.getElementById(`imageCanvas_${doodleKey.value}`);
  var ctxCopy = canvasCopy.getContext("2d");

  var getDoodledCanvasBase64 = canvas.toDataURL("image/jpeg");

  var rect = canvas.getBoundingClientRect();

  ctxCopy.canvas.width = rect.width < 712 ? 712 : rect.width;
  ctxCopy.canvas.height = rect.height < 400 ? 400 : rect.height;

  var imgCopy = new Image();

  imgCopy.onload = function () {
    ctxCopy.drawImage(
      imgCopy,
      0,
      0,
      ctxCopy.canvas.width,
      ctxCopy.canvas.height,
    );
  };
  imgCopy.src = getDoodledCanvasBase64;

  document.getElementById(`div_${doodleKey.value}`).style.display =
    "inline-block";
  doodleImageDialog.value = false;

  // BELOW WILL UPLOAD IMAGE FROM STORAGE API
  var blobBin = atob(getDoodledCanvasBase64.split(",")[1]);
  var array = [];
  for (var i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i));
  }
  var blob = new Blob([new Uint8Array(array)], {
    type: "image/jpeg",
  });

  var fileName = `screenshot_${new Date().getTime().toString().slice(-10)}`;

  var file = new File([blob], `${fileName}.jpeg`, {
    type: blob.type,
  });

  var files = [
    {
      name: fileName,
      data: file,
      progress: 0,
      url: URL.createObjectURL(file),
    },
  ];

  for (let i = 0; i < files.length; i++) {
    const formData = new FormData();
    formData.append("file", files[i].data);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/files/upload?status=draft");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        files[i].progress = Math.round((event.loaded / event.total) * 100);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        isProgress.value = false;
        const response = JSON.parse(xhr.responseText);

        // CODE BELOW WILL UPDATE THE IMAGE FROM PAYLOAD OF ATTACHED IMAGE FROM ADD PATROL LOG
        patrolLog.value.logQuestions[doodleKey.value].screenshotAttachment =
          response.id;
      }
    };

    xhr.send(formData);
  }
}

async function onClearDoodle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

// BELOW IS THE VIDEO RECORDING
async function onRecordCctv(key: number) {
  const getIp = selectedCctv.value.ip;
  const getInitialPath = selectedCctv.value.ip.slice(0, getIp.length - 1);
  const getCameraId = selectedCctv.value.ip.slice(
    getIp.length - 1,
    getIp.length,
  );

  const getRecordingPath = getInitialPath.concat(
    `record/${getCameraId}/duration/10`,
  );

  const getVideo = document.getElementById(`video_${key}`);

  isProgress.value = true;

  try {
    const result = await recordCctvFeed({ url: getRecordingPath });

    var sourceMP4 = document.createElement("source");
    sourceMP4.src = getRecordingPath;
    sourceMP4.type = "video/mp4";
    sourceMP4.id = `source_${key}`;
    getVideo?.appendChild(sourceMP4);

    const getDiv = document.getElementById(`div_video_${key}`);
    getDiv.style.display = "inline-block";

    patrolLog.value.logQuestions[key].recordingAttachment = result.url;

    setSnackbar({
      text: result.message,
      modal: true,
      type: "success",
    });

    isProgress.value = false;
  } catch (err) {
    setSnackbar({
      text: err,
      modal: true,
      type: "error",
    });
  }
}
</script>

<style scoped>
.text {
  text-align: start;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}

:deep() .v-field__outline {
  --v-field-border-opacity: 0.1;
}

:deep() .v-overlay__scrim {
  opacity: var(--v-overlay-opacity, 0);
}

:deep() .v-switch .v-label {
  padding-right: 10px;
  font-size: 30px;
}

:deep() .v-switch .v-selection-control {
  display: flex;
  flex-direction: row-reverse;
}

:deep() .v-text-field input {
  font-size: 13px !important;
}

:deep() .v-input--density-comfortable .v-field--variant-outlined,
.v-input--density-comfortable .v-field--single-line,
.v-input--density-comfortable .v-field--no-label {
  font-size: 1.3rem !important;
}
</style>
