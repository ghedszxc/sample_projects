<template>
  <v-dialog
    v-model="editRouteDialog"
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
          >Edit Route</span
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

              <v-col cols="12" class="mb-6" v-if="addRouteSteps <= 2">
                <v-row v-if="addRouteSteps == 1">
                  <v-col cols="12">
                    <v-text-field
                      v-model="newVPatrol.routeName"
                      label="Route Name"
                      density="compact"
                      hide-details
                      :disabled="isProgress"
                      :rules="[requiredInput]"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-select
                      v-model="newVPatrol.assignedUser"
                      label="Assign To"
                      :items="users"
                      :item-title="
                        (res: TUser) =>
                          `${res.givenName || ''} ${res.surname || ''}`
                      "
                      item-value="_id"
                      density="compact"
                      hide-details
                      :disabled="isProgress || assignEveryone"
                      :rules="[requiredInput]"
                      multiple
                      chips
                    >
                    </v-select>
                    <v-checkbox
                      v-model:model-value="assignEveryone"
                      label="Assign to All"
                    ></v-checkbox>
                  </v-col>

                  <v-col cols="12">
                    <v-row>
                      <v-col cols="7">
                        <v-select
                          v-model="newVPatrol.schedule.startDay"
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
                          v-model="newVPatrol.schedule.startTime"
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
                              v-model="newVPatrol.schedule.startTime"
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
                          v-model="newVPatrol.schedule.endDay"
                          label="End Day"
                          :items="schedules"
                          item-title="name"
                          item-value="_id"
                          density="compact"
                          :disabled="
                            isProgress ||
                            validateDateTimeInput(
                              newVPatrol.schedule.startDay,
                              newVPatrol.schedule.startTime,
                            )
                          "
                          :rules="[requiredInput]"
                          clearable
                          @update:modelValue="newVPatrol.schedule.endTime = ''"
                        >
                        </v-select>
                      </v-col>
                      <v-col cols="5">
                        <v-text-field
                          v-model="newVPatrol.schedule.endTime"
                          :active="timePickerEnd"
                          label="End Time"
                          append-inner-icon="mdi-clock-time-four-outline"
                          class="w-100"
                          clearable
                          :rules="[
                            requiredInput,
                            validateSchedule(newVPatrol.schedule),
                          ]"
                          :disabled="
                            isProgress ||
                            validateDateTimeInput(
                              newVPatrol.schedule.startDay,
                              newVPatrol.schedule.startTime,
                            ) ||
                            !newVPatrol.schedule.endDay
                          "
                        >
                          <v-menu
                            v-model="timePickerEnd"
                            :close-on-content-click="false"
                            activator="parent"
                            transition="scale-transition"
                            @update:modelValue="
                              onCalculateDays(newVPatrol.schedule)
                            "
                          >
                            <v-time-picker
                              v-if="timePickerEnd"
                              v-model="newVPatrol.schedule.endTime"
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
                      hide-details
                      :disabled="isProgress || onProgressGetCCTV"
                      :loading="onProgressGetCCTV"
                      @update:modelValue="onSelectBlock(selectedLocation)"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" v-if="cctvList.length" class="ma-0 pb-4">
                    <v-row
                      no-gutters
                      align-content="center"
                      align="center"
                      justify="end"
                      class="ga-3 px-3 py-2"
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
                                    class="mx-1"
                                    color="grey"
                                    v-if="
                                      !newVPatrol.cctvList.find(
                                        (find) => find.cctv == item._id,
                                      )
                                    "
                                    @click="onSelectCCTV(item._id)"
                                  >
                                    mdi-check-circle
                                  </v-icon>
                                  <div
                                    v-else
                                    class="bg-green rounded-circle mx-auto text-center cursor-pointer"
                                    style="height: 25px; width: 25px"
                                    @click="onSelectCCTV(item._id)"
                                  >
                                    {{
                                      newVPatrol.cctvList[
                                        newVPatrol.cctvList.findIndex(
                                          (find) => find.cctv == item._id,
                                        )
                                      ].sequence
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
                  This route has been updated.
                </div>
                <v-row class="px-3 mt-5" justify="center">
                  <v-col cols="6">
                    <v-btn
                      block
                      size="small"
                      variant="outlined"
                      style="height: 40px"
                      @click="onCloseDialog()"
                    >
                      Close
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
                  Update Route
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
    v-model="editCctvLiveFeedDialog"
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
const { getUserList, users, getAllSecurityGroupMembers, setUsers } = useUser();
const { setSnackbar } = useLocal();
const { currentUser } = useLocalAuth();
const {
  requiredInput,
  requiredArrayInput,
  validateStartAndEndTime,
  validateOneHourGapTime,
  validateSchedule,
  validateDateTimeInput,
  calculateDaysInSchedule,
} = useUtils();
const { getBlocks, getCctvOfBlock } = useCCTV();
const {
  setNewVPatrol,
  newVPatrol,
  vPatrols,
  setVPatrol,
  addRouteSteps,
  updateVPatrol,
  filterOrganization,
  filterSite,
  setVPatrols,
  editRouteDialog,
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

const editCctvLiveFeedDialog = ref(false);

const allSchedules = computed(() => {
  return newVPatrol.value.schedule.daysOfWeek.length === schedules.value.length;
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
        newVPatrol.value &&
        newVPatrol.value.cctvList &&
        newVPatrol.value?.cctvList.findIndex(
          (find: any) => find.cctv == item._id,
        ) === -1
      ) {
        newVPatrol.value?.cctvList.push({
          cctv: item._id,
          sequence: newVPatrol.value.cctvList.length + 1,
        });
      }
    });
  } else {
    filteredCctv.forEach((item: any) => {
      const index = newVPatrol.value?.cctvList.findIndex(
        (find: any) => find.cctv == item._id,
      );

      if (index !== -1) {
        newVPatrol.value?.cctvList.splice(index, 1);
      }
    });

    newVPatrol.value.cctvList.sort((a, b) => a.sequence - b.sequence);
    newVPatrol.value.cctvList = newVPatrol.value.cctvList.map(
      (item: {}, index: number) => {
        return {
          cctv: item.cctv,
          sequence: index + 1,
        };
      },
    );
  }
};

const handleTimeInput = (e: Event, field: any, schedule: any): void => {
  const inputElement = e.target as HTMLInputElement;
  let input = inputElement.value;
  input = input.replace(/[^0-9:]/g, "");
  if (input.length > 5) input = input.slice(0, 5);
  if (input.length > 2 && input[2] !== ":")
    input = input.slice(0, 2) + ":" + input.slice(2);
  schedule[field] = input;
};

onMounted(async () => {
  try {
    await Promise.all([getSitesOptionsForFiltering()]);

    const [dataBlock, response] = await Promise.all([
      getBlocks({
        site: mySite.value || "",
      }),
      getAllServicesAvailable(
        String(mySite.value),
        String(myProvider.value),
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
  newVPatrol.value.schedule.daysOfWeek =
    newVPatrol.value.schedule.daysOfWeek.length != schedules.value.length
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
        newVPatrol.value.cctvList.some(
          (selected: any) => selected.cctv === cctv._id,
        ),
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
  editCctvLiveFeedDialog.value = true;
}

async function onSelectCCTV(_id: string) {
  let findCctvIndex = newVPatrol.value?.cctvList.findIndex(
    (find: {}) => find.cctv == _id,
  );

  if (findCctvIndex == -1) {
    newVPatrol.value?.cctvList.push({
      cctv: _id,
      sequence: newVPatrol.value.cctvList.length + 1,
    });

    // let findCctv = cctvList.value.findIndex((find: string) => find._id == _id);

    // cctvList.value.splice(
    //   newVPatrol.value?.cctvList.length - 1 || 0,
    //   0,
    //   cctvList.value[newVPatrol.value?.cctvList.length ? findCctv : findCctv + 1],
    // );

    // cctvList.value.splice(findCctv + 1, 1);
  } else {
    selectAllCctv.value = false;
    newVPatrol.value?.cctvList.splice(findCctvIndex, 1);

    newVPatrol.value.cctvList.sort((a, b) => a.sequence - b.sequence);
    newVPatrol.value.cctvList = newVPatrol.value.cctvList.map(
      (item: {}, index: number) => {
        return {
          cctv: item.cctv,
          sequence: index + 1,
        };
      },
    );
    // let findCctv = cctvList.value.findIndex((find: string) => find._id == _id);
    // cctvList.value.splice(
    //   findCctvIndex + newVPatrol.value?.cctvList.length,
    //   0,
    //   cctvList.value[findCctv],
    // );

    // let deleteCctv = cctvList.value.findIndex(
    //   (find: string) => find._id == _id,
    // );

    // cctvList.value.splice(deleteCctv, 1);
    // newVPatrol.value?.cctvList.splice(deleteCctv, 1);
  }
}

function isEndTimeBeforeStartTime(startTime: string, endTime: string): boolean {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  return end < start;
}

const endTimeError = ref("");
const hasInteracted = ref(false);

const isEndTimeDisabled = computed(() => {
  return newVPatrol.value.schedule.startTime === "";
});

function isFormValid() {
  const schedule = newVPatrol.value.schedule || {
    startTime: "",
    endTime: "",
    daysOfWeek: [],
  };
  const startTime = schedule.startTime || "";
  const endTime = schedule.endTime || "";
  const daysOfWeek = schedule.daysOfWeek || [];

  // if (isEndTimeBeforeStartTime(startTime, endTime)) {
  //   endTimeError.value = "End time cannot be before start time.";
  //   setSnackbar({
  //     text: "End time cannot be before start time.",
  //     modal: true,
  //     type: "error",
  //   });
  //   return false;
  // } else {
  //   endTimeError.value = "";
  // }

  const isRouteNameValid =
    newVPatrol.value.routeName !== "" &&
    requiredInput(newVPatrol.value.routeName) === true;
  const isAssignedUserValid =
    newVPatrol.value.assignedUser !== "" &&
    requiredInput(newVPatrol.value.assignedUser) === true;
  const isStartTimeValid =
    startTime !== "" && requiredInput(startTime) === true;
  const isEndTimeValid =
    endTime !== "" &&
    requiredInput(endTime) === true &&
    validateStartAndEndTime(startTime, endTime) === true &&
    validateOneHourGapTime(startTime, endTime) === true;

  const areDaysOfWeekValid = daysOfWeek.length > 0;
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

    newVPatrol.value.site = mySite.value;
    newVPatrol.value.organization =
      currentUser.value?.type != "admin"
        ? currentUser.value?.organization
        : filterOrganization.value;

    let schedule = newVPatrol.value.schedule;

    newVPatrol.value.schedule.schedules = [
      {
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        startDay: schedule.startDay,
        endDay: schedule.endDay,
      },
      ...selectedRepeat.value,
    ];

    newVPatrol.value.schedule.daysOfWeek = newVPatrol.value.schedule.schedules
      .map((item) => [item.startDay, item.endDay])
      .flat();

    const assignedUser = newVPatrol.value.assignedUser;

    !assignEveryone.value &&
      (newVPatrol.value.assignedUser = assignedUser.map((item: any) =>
        typeof item === "object" ? item._id : item,
      ));

    if (assignEveryone.value) {
      if (users.value) {
        newVPatrol.value.assignedUser = users.value.map(
          (item: any) => item._id,
        );
      } else {
        isProgress.value = false;

        return setSnackbar({
          text: "No security personnel can be assigned.",
          modal: true,
          type: "error",
        });
      }
    }

    const item = await updateVPatrol(newVPatrol.value);

    if (item.status === "error") {
      return setSnackbar({
        text: item.message as string,
        modal: true,
        type: "warning",
      });
    }

    setSnackbar({
      text: "Successful created route",
      modal: true,
      type: "success",
    });

    addRouteSteps.value = 3;
    isProgress.value = false;
    assignEveryone.value = false;
    repeatEvery.value = [];
    selectedRepeat.value = [];

    cctvList.value = [];
    selectedLocation.value = "";
  } catch (err) {
    setSnackbar({ text: err as string, modal: true, type: "error" });
    isProgress.value = false;
  } finally {
    await setVPatrols({
      site: mySite.value,
    });
  }
}

async function onCloseDialog() {
  await setNewVPatrol();
  assignEveryone.value = false;
  editRouteDialog.value = false;
  addRouteSteps.value = 1;
  selectAllCctv.value = false;
  repeatEvery.value = [];
  selectedRepeat.value = [];
}

async function goBack() {
  await setNewVPatrol();
  addRouteSteps.value = 1;
}

async function onUpdateDate(elementId: string) {
  const getTime = document.getElementById(elementId).value;
  newVPatrol.value.schedule[elementId] = getTime;
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
