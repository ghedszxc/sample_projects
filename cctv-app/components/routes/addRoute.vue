<template>
  <v-dialog
    v-model="addDialog"
    transition="dialog-right-transition"
    fullscreen
    persistent
    :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
  >
    <v-card
      :loading="isProgress"
      :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
      :class="`${theme == 'light' && 'bg-white'} h-100 ${$vuetify.display.mdAndUp && 'rounded-s-xl'}`"
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
          >Add Patrol</span
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
          <v-col cols="12" class="my-12">
            <v-img src="/images/undraw_surveillance.svg" height="200" />
          </v-col>

          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12" v-if="addRouteSteps <= 2">
                <v-row class="px-3 mb-4" justify="space-between">
                  <span class="font-weight-bold">
                    <v-btn
                      v-if="addRouteSteps == 2"
                      size="small"
                      variant="flat"
                      class="grey-darken-1"
                      icon="mdi-chevron-left"
                      @click="addRouteSteps--"
                    />
                    {{ addRouteSteps == 1 ? "General" : "CCTV" }} Information
                  </span>
                  <v-chip size="small" color="grey-lighten-1">
                    <span
                      :class="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`"
                    >
                      Step <span class="text-blue">{{ addRouteSteps }}</span
                      >/2
                    </span>
                  </v-chip>
                </v-row>
              </v-col>

              <v-col cols="12" class="mb-2" v-if="addRouteSteps <= 2">
                <v-row v-if="addRouteSteps == 1" no-gutters>
                  <v-col cols="12">
                    <v-text-field
                      v-model="vPatrol.routeName"
                      label="Route Name"
                      density="compact"
                      :disabled="isProgress"
                      :rules="[requiredInput]"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-select
                      v-model="vPatrol.assignedUser"
                      label="Assign To"
                      :items="users"
                      :item-title="
                        (res: TUser) =>
                          `${res.givenName || ''} ${res.surname || ''}`
                      "
                      item-value="_id"
                      density="compact"
                      :disabled="isProgress || assignEveryone"
                      :rules="[requiredArrayInput]"
                      multiple
                      chips
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-checkbox
                      v-model:model-value="assignEveryone"
                      label="Assign to All"
                      density="compact"
                    ></v-checkbox>
                  </v-col>

                  <v-col cols="12">
                    <v-row>
                      <v-col cols="7">
                        <v-select
                          v-model="vPatrol.schedule.startDay"
                          label="Start Day"
                          :items="schedules"
                          item-title="name"
                          item-value="_id"
                          density="compact"
                          :disabled="isProgress"
                          :rules="[requiredInput]"
                          clearable
                        >
                        </v-select>
                      </v-col>
                      <v-col cols="5">
                        <v-text-field
                          v-model="vPatrol.schedule.startTime"
                          :active="timePickerStart"
                          label="Start Time"
                          append-inner-icon="mdi-clock-time-four-outline"
                          class="w-100"
                          clearable
                          :rules="[requiredInput, timeFormatRule]"
                          :disabled="isProgress"
                          @input="(e: any) => handleTimeInput(e, 'startTime')"
                        >
                          <v-menu
                            v-model="timePickerStart"
                            :close-on-content-click="false"
                            activator="parent"
                            transition="scale-transition"
                          >
                            <v-time-picker
                              v-if="timePickerStart"
                              v-model="vPatrol.schedule.startTime"
                              full-width
                              format="24hr"
                            ></v-time-picker>
                          </v-menu>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="7">
                        <v-select
                          v-model="vPatrol.schedule.endDay"
                          label="End Day"
                          :items="schedules"
                          item-title="name"
                          item-value="_id"
                          density="compact"
                          :disabled="
                            isProgress ||
                            validateDateTimeInput(
                              vPatrol.schedule.startDay,
                              vPatrol.schedule.startTime,
                            )
                          "
                          :rules="[requiredInput]"
                          clearable
                          @update:modelValue="vPatrol.schedule.endTime = ''"
                        >
                        </v-select>
                      </v-col>
                      <v-col cols="5">
                        <v-text-field
                          v-model="vPatrol.schedule.endTime"
                          :active="timePickerEnd"
                          label="End Time"
                          append-inner-icon="mdi-clock-time-four-outline"
                          class="w-100"
                          clearable
                          :rules="[
                            requiredInput,
                            validateSchedule(vPatrol.schedule),
                          ]"
                          :disabled="
                            isProgress ||
                            validateDateTimeInput(
                              vPatrol.schedule.startDay,
                              vPatrol.schedule.startTime,
                            ) ||
                            !vPatrol.schedule.endDay
                          "
                        >
                          <v-menu
                            v-model="timePickerEnd"
                            :close-on-content-click="false"
                            activator="parent"
                            transition="scale-transition"
                            @update:modelValue="
                              onCalculateDays(vPatrol.schedule)
                            "
                          >
                            <v-time-picker
                              v-if="timePickerEnd"
                              v-model="vPatrol.schedule.endTime"
                              full-width
                              format="24hr"
                            ></v-time-picker>
                          </v-menu>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" v-if="repeatEvery.length">
                    <v-select
                      v-model="selectedRepeat"
                      label="Repeat Every"
                      :items="repeatEvery"
                      item-title="label"
                      item-value="value"
                      density="compact"
                      :disabled="isProgress"
                      multiple
                      chips
                      optional
                      clearable
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row v-if="addRouteSteps == 2" no-gutters>
                  <v-col cols="12" class="ma-0">
                    <v-select
                      v-model="selectedLocation"
                      label="CCTV Blocks"
                      :items="blockList"
                      item-title="name"
                      item-value="_id"
                      density="compact"
                      :disabled="isProgress || onProgressGetCCTV"
                      :loading="onProgressGetCCTV"
                      @update:modelValue="onSelectBlock(selectedLocation)"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" class="ma-0 pb-4" v-if="cctvList.length">
                    <v-row
                      no-gutters
                      align-content="center"
                      align="center"
                      justify="end"
                      class="ga-3 px-3 pb-2"
                    >
                      <span class="text-body-2">Select All</span>
                      <v-icon
                        size="large"
                        class="mx-1 cursor:pointer"
                        :color="selectAllCctv ? 'green' : 'grey'"
                        @click="onSelectAllCctv"
                      >
                        mdi-check-circle
                      </v-icon>
                    </v-row>
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in cctvList.filter(
                          (find) => find.isActive,
                        )"
                        :key="itemIndex"
                      >
                        <v-list-item class="py-2">
                          <v-list-item-title>
                            <v-row no-gutters justify="space-between">
                              <v-col
                                md="6"
                                :class="`text ${$vuetify.display.mdAndUp ? 'my-1' : 'mb-2'}`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <span
                                    class="d-inline-block text-truncate text-capitalize text-body-2"
                                  >
                                    {{ item.name }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                md="5"
                                :class="`text ${$vuetify.display.mdAndUp ? 'my-1' : 'mb-2'}`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <v-btn
                                    size="small"
                                    variant="flat"
                                    color="grey-lighten-4"
                                    class="px-3"
                                    @click="onShowLiveFeed(item)"
                                  >
                                    <v-icon size="small" class="mx-1"
                                      >mdi-cctv</v-icon
                                    >
                                    Live Feed
                                  </v-btn>
                                </v-row>
                              </v-col>

                              <v-col
                                md="1"
                                :class="`text ${$vuetify.display.mdAndUp ? 'my-1' : 'mb-2'}`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <v-icon
                                    size="large"
                                    color="grey"
                                    v-if="
                                      !vPatrol.cctvList.find(
                                        (find) => find == item._id,
                                      )
                                    "
                                    @click="onSelectCCTV(item._id)"
                                  >
                                    mdi-check-circle
                                  </v-icon>

                                  <div
                                    v-else
                                    class="bg-green rounded-circle mx-auto text-center cursor-pointer"
                                    style="height: 24px; width: 24px"
                                    @click="onSelectCCTV(item._id)"
                                  >
                                    {{
                                      vPatrol.cctvList.findIndex(
                                        (find) => find == item._id,
                                      ) + 1
                                    }}
                                  </div>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-list-item-title>
                        </v-list-item>
                        <v-divider />
                      </template>
                    </v-list>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" v-if="addRouteSteps == 3">
                <div class="text-center mt-6 text-subtitle-1 font-weight-bold">
                  Great!
                </div>
                <div class="text-center mt-2 text-caption">
                  A new route is added to the list of routes
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
                      Add New Route
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-btn
                  v-if="addRouteSteps == 1"
                  block
                  color="blue-darken-3"
                  size="small"
                  variant="flat"
                  style="height: 40px"
                  :disabled="!isFormValid() || users.length === 0"
                  @click="addRouteSteps++"
                >
                  Next Step
                </v-btn>
                <v-btn
                  v-if="addRouteSteps == 2"
                  block
                  color="blue-darken-3"
                  size="small"
                  variant="flat"
                  style="height: 40px"
                  @click="submit()"
                  :disabled="isProgress || users.length === 0"
                >
                  Add Patrol
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions v-if="$vuetify.display.smAndDown">
        <v-spacer></v-spacer>
        <span class="text-caption"> @ 2024 by Seven 365 Pte Ltd V1.0 </span>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="cctvLiveFeedDialog"
    transition="dialog-top-transition"
    max-width="900"
  >
    <v-card>
      <v-toolbar color="white" v-if="selectCctvLiveFeed.name">
        <span class="font-weight-bold pl-4 pt-1 text-capitalize">{{
          selectCctvLiveFeed?.name
        }}</span>
      </v-toolbar>
      <v-card-text class="text-center">
        <iframe
          v-if="selectCctvLiveFeed.ip"
          :src="selectCctvLiveFeed.ip"
          :style="{
            width: '100%',
            height: $vuetify.display.mdAndUp ? '500px' : '200px',
          }"
        />
        <h2 v-else>Cctv IP is empty</h2>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const { theme } = useLocal();
const { users, getAllSecurityGroupMembers, setUsers } = useUser();
const { setSnackbar } = useLocal();
const { currentUser } = useLocalAuth();
const {
  requiredInput,
  requiredArrayInput,
  validateStartAndEndTime,
  validateOneHourGapTime,
  validateDateTimeInput,
  validateSchedule,
  calculateDaysInSchedule,
} = useUtils();
const { getBlocks, getCctvOfBlock } = useCCTV();
const {
  vPatrol,
  setVPatrol,
  addDialog,
  addRouteSteps,
  cctvLiveFeedDialog,
  addVirtualPatrol,
  filterOrganization,
  setVPatrols,
} = useVirtualPatrol();
const { getSitesOptionsForFiltering, mySite, myOrg, myProvider } = useFilter();
const { getAllServicesAvailable } = useSiteCollab();

const isProgress = ref(false);
const onProgressGetCCTV = ref(false);
const selectedLocation = ref("");
const schedules = ref([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]); // 'All', 'Weekdays', 'Weekend',
const blockList = ref([]);
const cctvList = ref([]);
const selectCctvLiveFeed = ref({});
const selectedGroup = ref("");
const assignEveryone = ref<boolean>(false);
const timePickerStart = ref<boolean>(false);
const timePickerEnd = ref<boolean>(false);
const selectAllCctv = ref<boolean>(false);
const repeatEvery = ref([]);
const selectedRepeat = ref([]);

const allSchedules = computed(() => {
  return vPatrol.value.schedule.daysOfWeek.length === schedules.value.length;
});

const onCalculateDays = (schedules: any) => {
  repeatEvery.value = [];
  selectedRepeat.value = [];
  if (validateSchedule(schedules) === true) {
    repeatEvery.value = calculateDaysInSchedule(schedules) as any;
  }
};

const onSelectAllCctv = () => {
  selectAllCctv.value = !selectAllCctv.value;

  const filteredCctv = cctvList.value.filter((find: any) => find.isActive);

  if (selectAllCctv.value) {
    filteredCctv.forEach((item: any) => {
      if (
        vPatrol.value &&
        vPatrol.value.cctvList &&
        vPatrol.value?.cctvList.findIndex((find: any) => find == item._id) ===
          -1
      ) {
        vPatrol.value?.cctvList.push(item._id);
      }
    });
  } else {
    filteredCctv.forEach((item: any) => {
      const index = vPatrol.value?.cctvList.findIndex(
        (find: any) => find == item._id,
      );

      if (index !== -1) {
        vPatrol.value?.cctvList.splice(index, 1);
      }
    });
  }
};

const timeFormatRule = (v: any) => {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timePattern.test(v) || "Time must be in HH:mm format";
};

const handleTimeInput = (e: any, field: any) => {
  let input = e.target.value;
  input = input.replace(/[^0-9:]/g, "");
  if (input.length > 5) input = input.slice(0, 5);
  if (input.length > 2 && input[2] !== ":")
    input = input.slice(0, 2) + ":" + input.slice(2);
  vPatrol.value.schedule[field] = input;
};

onMounted(async () => {
  try {
    await Promise.all([setVPatrol(), getSitesOptionsForFiltering()]);

    const [dataBlock, response] = await Promise.all([
      getBlocks({
        site: mySite.value || "",
      }),
      getAllServicesAvailable(
        String(mySite.value),
        String(currentUser.value.serviceProvider || ""),
        "Security",
      ),
    ]);

    blockList.value = dataBlock;

    // get all assignees from service provider security group only
    const assignedGroup =
      response.items.length > 0
        ? response.items.filter((i) => i)[0].assignedGroup
        : undefined;

    selectedGroup.value =
      assignedGroup &&
      Boolean(assignedGroup) &&
      typeof assignedGroup === "object"
        ? assignedGroup._id || ""
        : String(assignedGroup || "");
    if (selectedGroup.value) {
      await getAllAssignee();
    }
  } catch (err) {
    setSnackbar({ text: err as string, modal: true, type: "error" });
  }
});

async function getAllAssignee() {
  await getAllSecurityGroupMembers({
    service: "security",
    serviceProvider: myProvider.value,
    serviceProviderGroup: selectedGroup.value,
    site: mySite.value,
  });
}

async function onSelectSchedule() {
  vPatrol.value.schedule.daysOfWeek =
    vPatrol.value.schedule.daysOfWeek.length != schedules.value.length
      ? [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ]
      : [];
}

async function onSelectBlock(_id: string) {
  onProgressGetCCTV.value = true;
  try {
    const result = await getCctvOfBlock({ block: _id });
    cctvList.value = result.items;

    if (
      cctvList.value.every((cctv: any) =>
        vPatrol.value.cctvList.some((selected: any) => selected === cctv._id),
      )
    ) {
      selectAllCctv.value = true;
    } else {
      selectAllCctv.value = false;
    }

    onProgressGetCCTV.value = false;
  } catch (err) {
    setSnackbar({ text: err as string, modal: true, type: "error" });
    onProgressGetCCTV.value = false;
  }
}

async function onShowLiveFeed(cctv: any) {
  selectCctvLiveFeed.value = cctv;
  cctvLiveFeedDialog.value = true;
}

async function onSelectCCTV(_id: string) {
  let findCctvIndex = vPatrol.value?.cctvList.findIndex(
    (find: string) => find == _id,
  );

  if (findCctvIndex == -1) {
    vPatrol.value?.cctvList.push(_id);

    // let findCctv = cctvList.value.findIndex((find: string) => find._id == _id);

    // cctvList.value.splice(
    //   vPatrol.value?.cctvList.length - 1 || 0,
    //   0,
    //   cctvList.value[vPatrol.value?.cctvList.length ? findCctv : findCctv + 1],
    // );

    // cctvList.value.splice(findCctv + 1, 1);
  } else {
    selectAllCctv.value = false;
    vPatrol.value?.cctvList.splice(findCctvIndex, 1);
    // let findCctv = cctvList.value.findIndex((find: string) => find._id == _id);
    // cctvList.value.splice(
    //   findCctvIndex + vPatrol.value?.cctvList.length,
    //   0,
    //   cctvList.value[findCctv],
    // );

    // let deleteCctv = cctvList.value.findIndex(
    //   (find: string) => find._id == _id,
    // );

    // cctvList.value.splice(deleteCctv, 1);
    // vPatrol.value?.cctvList.splice(deleteCctv, 1);
  }
}

function isFormValid() {
  const schedule = vPatrol.value.schedule || {
    startTime: "",
    endTime: "",
    endDay: "",
    startDay: "",
    daysOfWeek: [],
  };
  const startTime = schedule.startTime || "";
  const endTime = schedule.endTime || "";
  const daysOfWeek = schedule.daysOfWeek || [];

  const isRouteNameValid =
    vPatrol.value.routeName !== "" &&
    requiredInput(vPatrol.value.routeName) === true;
  const isAssignedUserValid =
    vPatrol.value.assignedUser !== "" &&
    requiredInput(vPatrol.value.assignedUser) === true;
  // const isStartTimeValid =
  //   startTime !== "" && requiredInput(startTime) === true;
  // const isEndTimeValid = endTime !== "" && requiredInput(endTime) === true;
  // const areDaysOfWeekValid = daysOfWeek.length > 0;

  // const validateDates =
  //   vPatrol.value.schedule.startTime != "" &&
  //   vPatrol.value.schedule.endTime != "";

  // const onValidateStartAndEndTime =
  //   validateStartAndEndTime(
  //     vPatrol.value.schedule.startTime,
  //     vPatrol.value.schedule.endTime,
  //   ) == "End time value must be higher than start time."
  //     ? false
  //     : true;

  // const onValidateOneHourGapTime =
  //   validateOneHourGapTime(
  //     vPatrol.value.schedule.startTime,
  //     vPatrol.value.schedule.endTime,
  //   ) == "End time value must have at least 1 hour gap from start time."
  //     ? false
  //     : true;

  if (
    !isRouteNameValid ||
    !isAssignedUserValid ||
    validateSchedule(schedule) !== true
  ) {
    return false;
  }
  return true;
}

async function submit() {
  try {
    isProgress.value = true;

    vPatrol.value.site = mySite.value;
    vPatrol.value.organization =
      currentUser.value?.type != "admin"
        ? currentUser.value?.organization
        : filterOrganization.value;

    vPatrol.value.cctvList = vPatrol.value?.cctvList?.map(
      (cctv: string, key: number) => {
        return { cctv: cctv, sequence: key + 1 };
      },
    );

    let schedule = vPatrol.value.schedule;

    vPatrol.value.schedule.schedules = [
      {
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        startDay: schedule.startDay,
        endDay: schedule.endDay,
      },
      ...selectedRepeat.value,
    ];

    vPatrol.value.schedule.daysOfWeek = vPatrol.value.schedule.schedules
      .map((item) => [item.startDay, item.endDay])
      .flat();

    if (assignEveryone.value) {
      if (users.value) {
        vPatrol.value.assignedUser = users.value.map((item: any) => item._id);
      } else {
        isProgress.value = false;

        return setSnackbar({
          text: "No security personnel can be assigned.",
          modal: true,
          type: "error",
        });
      }
    }

    await addVirtualPatrol(vPatrol.value);

    setSnackbar({
      text: "Successful created route",
      modal: true,
      type: "success",
    });

    addRouteSteps.value = 3;
    isProgress.value = false;

    cctvList.value = [];
    selectedLocation.value = "";
    repeatEvery.value = [];
    selectedRepeat.value = [];
  } catch (err) {
    setSnackbar({ text: err as string, modal: true, type: "error" });
    isProgress.value = false;
  } finally {
    await setVPatrols({
      site: mySite.value,
      assigneeIds: users.value
        ? users.value.map((item: any) => item._id).join(",")
        : "",
    });
  }
}

async function onCloseDialog() {
  await setVPatrol();

  addDialog.value = false;
  addRouteSteps.value = 1;
  selectAllCctv.value = false;
  repeatEvery.value = [];
  selectedRepeat.value = [];
}

async function goBack() {
  await setVPatrol();
  addRouteSteps.value = 1;
  selectAllCctv.value = false;
}

async function onUpdateDate(elementId: string) {
  const getTime = document.getElementById(elementId).value;
  vPatrol.value.schedule[elementId] = getTime;
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
