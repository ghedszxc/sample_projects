<template>
  <v-card :loading="isVPatrolLoading" style="height: 100%">
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="orange"
        height="8"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-row no-gutters class="mt-3">
      <v-col cols="12">
        <v-row no-gutters justify="space-between">
          <v-col cols="12" class="pl-8 pt-2">
            <div :class="`${$vuetify.display.smAndDown && 'mb-3'}`">
              <v-btn
                size="small"
                class="border"
                icon="mdi-chevron-left"
                flat
                :disabled="isVPatrolLoading"
                @click="goBack()"
              ></v-btn>
            </div>
            <div class="text-h6">
              <b>Route -- </b> {{ vPatrol?.routeDetails?.routeName }}
              <span
                v-if="isLatePatrolling"
                class="text-red text-subtitle-2 font-weight-bold"
              >
                Late Patrolling
              </span>
            </div>
            <div>
              <b>Day: </b>
              <span
                v-for="(day, key) in vPatrol?.routeDetails?.schedule
                  ?.daysOfWeek"
                :key="key"
              >
                {{
                  key + 1 != vPatrol?.routeDetails?.schedule?.daysOfWeek.length
                    ? `${day}, `
                    : day
                }}
              </span>
            </div>
            <div>
              <b>Time: </b>
              {{
                `${vPatrol?.routeDetails?.schedule?.startTime} - ${vPatrol?.routeDetails?.schedule?.endTime}`
              }}
            </div>
          </v-col>
          <v-col cols="12">
            <v-row
              no-gutters
              align="center"
              :class="`${$vuetify.display.smAndDown && 'my-3'}`"
            >
              <v-col cols="12" class="pl-5">
                <span class="text-capitalize text-body-2 ml-2 mr-6">
                  <v-icon
                    size="x-small"
                    class="mx-1 pa-3 border"
                    style="
                      background: #1976d2;
                      border-radius: 25px;
                      color: #ffffff;
                    "
                    >mdi-cctv</v-icon
                  >
                  {{ selectedCctv.name }}
                </span>
                <span
                  v-if="$ability.can('create', 'create-virtual-patrol-log')"
                >
                  <v-btn
                    color="blue-darken-3"
                    size="small"
                    variant="flat"
                    class="mr-2"
                    @click="showAddPatrolLogDialog()"
                    :disabled="isVPatrolLoading"
                  >
                    Start Patrol
                  </v-btn>

                  <v-btn
                    size="small"
                    variant="flat"
                    :class="`${$vuetify.display.mdAndUp ? 'mr-2' : 'ml-5 mr-2'}`"
                    icon="mdi-chevron-left"
                    @click="onPrevPage()"
                    :disabled="activePrevPage || isVPatrolLoading"
                    style="
                      height: 30px;
                      width: 30px;
                      border: thin solid #e1e1e1;
                    "
                  >
                  </v-btn>

                  <v-btn
                    size="small"
                    variant="flat"
                    icon="mdi-chevron-right"
                    @click="onNextPage()"
                    :disabled="activeNextPage || isVPatrolLoading"
                    style="
                      height: 30px;
                      width: 30px;
                      border: thin solid #e1e1e1;
                    "
                  >
                  </v-btn>
                </span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" class="pt-2 px-7">
        <v-skeleton-loader
          v-show="!cctvLoadingState"
          :style="{
            width: !addDialog ? '100%' : '85%',
            height: $vuetify.display.mdAndUp ? '68vh' : '60vh',
          }"
        ></v-skeleton-loader>

        <iframe
          v-show="cctvLoadingState"
          id="cctv_feed"
          :style="{
            width: !addDialog ? '100%' : '85%',
            height: $vuetify.display.mdAndUp ? '68vh' : '30vh',
            opacity: `${isVPatrolLoading ? '0.3' : '1'}`,
          }"
          @load="iframeLoaded()"
        />
        <!-- :src="selectedCctv.ip" -->
      </v-col>
    </v-row>
  </v-card>

  <RoutesAddPatrol />
</template>
<script setup lang="ts">
import moment from "moment-timezone";

definePageMeta({
  middleware: ["secure"],
});

const { $ability } = useNuxtApp();
const { getCctvById } = useCCTV();
const { setSnackbar } = useLocal();
const {
  vPatrol,
  selectedCctv,
  isVPatrolLoading,
  getVPatrolById,
  addDialog,

  getPatrolQuestionnaires,

  getQuestionnairesWithAnswers,
  getQuestionnairesWithoutAnswers,

  patrolStartDateTimeDuration,
  patrolEndDateTimeDuration,

  onStartRecording,
  onStopRecording,

  isScheduleToday,
  isLatePatrolling,

  validateNextCctv,
  isEditExistingPatrolLog,
  isValidPatrolLog,
  patrolTimeDuration,
  renderAttachments,
  reportStatus,

  validateRouteIfAlreadyPatrolledToday,
} = useVirtualPatrol();

const {
  MPatrolLog,
  patrolLog,
  setPatrolLog,
  questionnaires,
  setQuestionnaires,
  patrolLogKey,
  patrolLogError,
  onGoingPatrolLog,
} = usePatrolLog();

const { getSitesOptionsForFiltering, mySite, myOrg } = useFilter();
const { siteSetting, getSiteSettingsById } = useSiteSettings();
const { currentUser } = useLocalAuth();

const routeId = computed(() =>
  useRoute().params.routeId ? String(useRoute().params.routeId) : "",
);
const cctvId = computed(() =>
  useRoute().params.cctvId ? String(useRoute().params.cctvId) : "",
);

const activeNextPage = ref(false);
const activePrevPage = ref(false);

const cctvLoadingState = ref<boolean>(false);

const iframeLoaded = () => {
  setTimeout(() => {
    cctvLoadingState.value = true;
  }, 3000);
};

watch(
  cctvId,
  (newValue: string) => {
    onStopRecording();

    if (onGoingPatrolLog.value === "") {
      onGoingPatrolLog.value = newValue;
    }

    validateNextCctv.value = true;
    patrolStartDateTimeDuration.value = "";
    reportStatus.value = "";
    setPatrolLog();
    checkStoredLogs(cctvId.value);

    setupCctv(newValue);

    getVPatrolById(routeId.value, 1).then((resRoute: any) => {
      vPatrol.value = resRoute as TVirtualPatrol;
      validateCctvPatrolSchedule(resRoute?.routeDetails?.schedule);
    });

    //onCheckPreSubmitPayload(newValue);
    onUpdateIframe();
    checkPatrolLogIsCompleted(newValue);
  },
  { deep: true },
);

watch(
  addDialog,
  (newValue: boolean) => {
    if (newValue) {
      onStartRecording(cctvId.value);

      // // START: THIS WILL DETERMINE IF THE ADD PATROL BUTTON WILL NEXT OR SUBMIT
      // const countLogs = JSON.parse(localStorage.getItem("pre-reg-log"))?.filter(
      //   (find: any) => find.routeId == routeId.value,
      // );
      // const countCamera = vPatrol.value.items;

      // if (
      //   countLogs?.length ? countCamera.length - 1 == countLogs.length : false
      // ) {
      //   const checkCurrentCctvLog = countLogs.find(
      //     (find: any) => find.cctvId == cctvId.value,
      //   );
      //   validateNextCctv.value = checkCurrentCctvLog;
      // }
      // // END
    } else {
      onStopRecording();
    }
  },
  { deep: true },
);

watch(
  routeId,
  (newValue: string) => {
    getVPatrolById(newValue, 1).then((resRoute: any) => {
      vPatrol.value = resRoute as TVirtualPatrol;
      validateCctvPatrolSchedule(resRoute?.routeDetails?.schedule);
    });
  },
  { deep: true },
);

onMounted(async () => {
  const [resRoute, resCctv] = await Promise.all([
    getVPatrolById(routeId.value, 1),
    getCctvById(cctvId.value),
    getSitesOptionsForFiltering(),
  ]);

  vPatrol.value = resRoute as TVirtualPatrol;
  selectedCctv.value = resCctv as boolean;
  validateCctvPatrolSchedule(resRoute?.routeDetails?.schedule);
  onStopRecording();

  await setupCctv(cctvId.value);

  patrolLogKey.value = `${routeId.value}-${moment
    .tz(moment(new Date()), "Asia/Singapore")
    .format("YYYY-MM-DD")}`;

  await setQuestionnaires(mySite.value, routeId.value);
  checkStoredLogs(cctvId.value);

  //onCheckPreSubmitPayload();
  getSiteSettingsById(mySite.value); // TO POPULATE QUESTIONNAIRES

  onUpdateIframe();
  checkPatrolLogIsCompleted(cctvId.value);

  console.log("1");
  validateRouteIfAlreadyPatrolledToday({
    site: mySite.value,
    routeId: routeId.value,
  });
  console.log("2.0");
});

onUnmounted(async () => {
  patrolStartDateTimeDuration.value = "";
  patrolEndDateTimeDuration.value = "";
});

function checkPatrolLogIsCompleted(cctvId: string) {
  const logKey = patrolLogKey.value;
  if (!localStorage.getItem(logKey)) {
    localStorage.setItem(logKey, JSON.stringify({}));
  }

  const cctvList = vPatrol.value.items;
  validateNextCctv.value = true;

  let logs = JSON.parse(localStorage.getItem(logKey) ?? "{}");
  logs = Object.keys(logs).map((key: any) => logs[key] as TPatrolLog);

  const isCompleted = logs
    .filter((item: TPatrolLog) => item.cctvId !== cctvId)
    .map((item: TPatrolLog) => item.isLocked)
    .every(Boolean);

  logs = new Set(logs.map((log: TPatrolLog) => log.cctvId));
  logs.add(cctvId);
  const logDiff = cctvList.every((cctv: any) => logs.has(cctv._id));

  if (!logDiff) {
    validateNextCctv.value = true;
    return;
  }

  validateNextCctv.value = !isCompleted;
}

function setInitialPatrolLog(cctvId: string) {
  patrolLog.value = new MPatrolLog({
    site: mySite.value,
    organization: myOrg.value,
    cctvId: cctvId,
    routeId: routeId.value,
    assignee: currentUser.value._id,
    logQuestions: JSON.parse(JSON.stringify(questionnaires.value)),
    duration: 0,
    startDateTimeDuration: moment
      .tz(moment(new Date()), "Asia/Singapore")
      .toDate(),
    endDateTimeDuration: "",
    reportStatus: "",
    reportLabel: "",
    isActiveReportStatus: false,
    isLatePatrolling: isLatePatrolling.value,
    editHistory: [],
    isLocked: false,
  });
}

function checkStoredLogs(cctvId: string) {
  const logKey = patrolLogKey.value;

  if (!localStorage.getItem(logKey)) {
    localStorage.setItem(logKey, JSON.stringify({}));
    setInitialPatrolLog(cctvId);
    if (addDialog.value) onStartRecording(cctvId);
    return;
  }

  let logs = JSON.parse(localStorage.getItem(logKey) ?? "{}");

  if (!logs[cctvId]) {
    setInitialPatrolLog(cctvId);
    if (addDialog.value && onGoingPatrolLog.value === cctvId)
      onStartRecording(cctvId);
    return;
  }

  patrolTimeDuration.value = patrolTimeDuration.value + logs[cctvId].duration;
  patrolLog.value = new MPatrolLog(logs[cctvId]);

  if (patrolLog.value.isActiveReportStatus) {
    reportStatus.value = patrolLog.value.reportStatus.report ?? "";
  }
  renderAttachments(patrolLog.value.logQuestions);
  if (
    addDialog.value &&
    !patrolLog.value.isLocked &&
    onGoingPatrolLog.value === cctvId
  )
    onStartRecording(cctvId);
}

async function validateCctvPatrolSchedule(selectedCctv: any) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const checkDaySchedule = selectedCctv.daysOfWeek.includes(
    daysOfWeek[new Date().getDay()],
  );

  if (checkDaySchedule) {
    const getStartScheduledHour = parseInt(
      selectedCctv.startTime.split(":")[0],
    );
    const getStartScheduledMins = parseInt(
      selectedCctv.startTime.split(":")[1],
    );

    const getEndScheduledHour = parseInt(selectedCctv.endTime.split(":")[0]);
    const getEndScheduledMins = parseInt(selectedCctv.endTime.split(":")[1]);

    const start = getStartScheduledHour * 60 + getStartScheduledMins;
    const end = getEndScheduledHour * 60 + getEndScheduledMins;

    const date = new Date(moment.tz(moment(new Date()), "Asia/Singapore"));
    const now = date.getHours() * 60 + date.getMinutes();

    const graceTime =
      date.getMinutes() +
      parseInt(siteSetting.value.virtualPatrolGracePeriod || "0"); // DYNAMIC GRACE PERIOD TIME IS TO SET GRACE TIME PERIOD
    const graceTimeFormula =
      graceTime < 60
        ? date.getHours() * 60 + graceTime
        : (date.getHours() + 1) * 60 + (graceTime - 60); // THIS IS THE FORMULA FOR GRACE TIME

    const logs = JSON.parse(localStorage.getItem("pre-reg-log"))?.filter(
      (find: any) => find.routeId == routeId.value,
    );

    if (logs?.length) {
      const getStartTimeLog = new Date(
        moment.tz(
          moment(new Date(logs[0].startDateTimeDuration)),
          "Asia/Singapore",
        ),
      );

      const getStartTime =
        getStartTimeLog.getHours() * 60 + getStartTimeLog.getMinutes();

      const getDateNow = new Date(
        moment.tz(moment(new Date()), "Asia/Singapore"),
      );
      getDateNow.setHours(getStartScheduledHour);
      getDateNow.setMinutes(getStartScheduledMins);

      const getRouteSchedule =
        getDateNow.getHours() * 60 + getDateNow.getMinutes();

      isLatePatrolling.value = getStartTime > getRouteSchedule;

      isScheduleToday.value = now > end; // getStartTime < getRouteSchedule && now > end
    } else {
      isLatePatrolling.value = now < end ? start < now : false;
      isScheduleToday.value = start <= graceTimeFormula && now > end;
    }
  } else {
    isScheduleToday.value = true;
    isLatePatrolling.value = false;
  }
}

async function setupCctv(id: string) {
  activeNextPage.value = true;
  activePrevPage.value = true;

  const cctvIndex = vPatrol.value.items.findIndex(
    (find: any) => find._id == id,
  );

  const validateNextPage = vPatrol.value.items[cctvIndex + 1];
  const validateBackPage = vPatrol.value.items[cctvIndex - 1];

  activeNextPage.value = !validateNextPage;
  activePrevPage.value = !validateBackPage;

  isVPatrolLoading.value = false;
}

async function goBack() {
  useRouter().push({
    name: "routes-routeId",
    params: {
      routeId: routeId.value,
    },
    query: {
      site: mySite.value,
    },
  });
}

async function onPrevPage() {
  if (!isValidPatrolLog.value) {
    setSnackbar({
      text: patrolLogError.value,
      type: "error",
      modal: true,
    });
    return;
  }

  const cctvIndex = vPatrol.value.items.findIndex(
    (find: any) => find._id == cctvId.value,
  );
  selectedCctv.value = vPatrol.value.items[cctvIndex - 1];

  cctvLoadingState.value = false;

  isVPatrolLoading.value = true;
  //await onCheckPreSubmitPayload(vPatrol.value.items[cctvIndex - 1]._id);

  useRouter().push({
    name: "routes-routeId-cctv-cctvId",
    params: {
      routeId: routeId.value,
      cctvId: vPatrol.value.items[cctvIndex - 1]._id,
    },
    query: {
      site: mySite.value,
    },
  });
}

async function onNextPage() {
  if (!isValidPatrolLog.value) {
    setSnackbar({
      text: patrolLogError.value,
      type: "error",
      modal: true,
    });
    return;
  }

  const cctvIndex = vPatrol.value.items.findIndex(
    (find: any) => find._id == cctvId.value,
  );
  selectedCctv.value = vPatrol.value.items[cctvIndex + 1];

  cctvLoadingState.value = false;

  isVPatrolLoading.value = true;
  //await onCheckPreSubmitPayload(vPatrol.value.items[cctvIndex + 1]._id);

  useRouter().push({
    name: "routes-routeId-cctv-cctvId",
    params: {
      routeId: routeId.value,
      cctvId: vPatrol.value.items[cctvIndex + 1]._id,
    },
    query: {
      site: mySite.value,
    },
  });
}

async function onCheckPreSubmitPayload(cctv_id: string) {
  const get_questionnaires = await getPatrolQuestionnaires(
    mySite.value,
    routeId.value,
  );
  getQuestionnairesWithoutAnswers(get_questionnaires);

  const logs = JSON.parse(localStorage.getItem("pre-reg-log"))?.filter(
    (find: any) => find.routeId == routeId.value,
  );
  const patrolLog = logs && logs.find((find: any) => find.cctvId == cctv_id);

  if (patrolLog) {
    getQuestionnairesWithAnswers(patrolLog, get_questionnaires);
  } else {
    getQuestionnairesWithoutAnswers(get_questionnaires);
  }
}

async function showAddPatrolLogDialog() {
  addDialog.value = true;

  const get_questionnaires = await getPatrolQuestionnaires(
    mySite.value,
    routeId.value,
  );

  const logs = JSON.parse(localStorage.getItem("pre-reg-log"))?.filter(
    (find: any) => find.routeId == routeId.value,
  );
  const patrolLog =
    logs && logs.find((find: any) => find.cctvId == cctvId.value);

  if (patrolLog) {
    getQuestionnairesWithAnswers(patrolLog, get_questionnaires);
    isEditExistingPatrolLog.value = true;
  } else {
    getQuestionnairesWithoutAnswers(get_questionnaires);
    isEditExistingPatrolLog.value = false;
  }
}

import CryptoJS from "crypto-js";

const SECRET_KEY = CryptoJS.enc.Hex.parse(
  useRuntimeConfig().public.CRYPTO_ENCRYPTION_KEY,
);

const decryptIP = (encryptedData: string, iv: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return bytes.toString(CryptoJS.enc.Utf8);
};

async function onUpdateIframe(id?: string) {
  var iframeUrl = document.querySelector("#cctv_feed");
  iframeUrl?.setAttribute("src", selectedCctv.value?.ip);

  const response = await fetch(`/api/cctvs/cctv/${selectedCctv.value._id}`);
  const data = await response.json();

  console.log("1", data);
  const result = decryptIP(data.bin, data.data);
  console.log("2", result);
}
</script>
