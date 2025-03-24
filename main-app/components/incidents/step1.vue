<template>
  <div class="w-100 pa-8" v-if="incident">
    <div>
      <span class="font-weight-bold">Site Information</span>
      <v-row>
        <v-col class="pa-5" cols="12" md="3">
          <v-text-field
            v-model="siteName"
            :rules="[requiredInput]"
            hide-details="auto"
            label="Site"
            readonly
          ></v-text-field>
        </v-col>

        <v-col class="pa-5" cols="12" md="3">
          <v-text-field
            v-model="incident.incidentInformation.siteInfo.irNumber"
            hide-details="auto"
            :rules="[requiredInput]"
            label="Incident Reference Number"
            readonly
          ></v-text-field>
        </v-col>

        <v-col class="pa-5" cols="12" md="3">
          <v-text-field
            v-model="incident.incidentInformation.siteInfo.submittedBy"
            hide-details="auto"
            :rules="[requiredInput]"
            label="Submitted By"
          ></v-text-field>
        </v-col>

        <v-col class="pa-5" cols="12" md="3">
          <v-text-field
            v-model="incident.incidentInformation.siteInfo.designation"
            label="Designation"
            hide-details="auto"
            :rules="[requiredInput]"
            ref="designation"
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <v-divider class="border-opacity-25 my-5"></v-divider>

    <div>
      <span class="font-weight-bold">Place of Incident</span>
      <v-row>
        <template v-if="!incident.incidentInformation.placeOfIncident.isOther">
          <v-col class="pa-5" cols="12" md="4">
            <v-autocomplete
              v-model="incident.incidentInformation.placeOfIncident.block"
              :items="blocks"
              label="Block"
              hide-details="auto"
              :rules="[requiredInput]"
              item-title="name"
              item-value="_id"
              ref="placeOfIncidentBlock"
              @update:modelValue="
                onSelectBlock(
                  incident?.incidentInformation.placeOfIncident.block,
                )
              "
              @update:search="onSearchBlock"
              clearable
            ></v-autocomplete>
          </v-col>

          <v-col class="pa-5" cols="12" md="3">
            <v-autocomplete
              v-model="incident.incidentInformation.placeOfIncident.level"
              label="Level"
              hide-details="auto"
              :rules="[requiredInput]"
              :items="blockLevels"
              item-title="level"
              item-value="_id"
              ref="placeOfIncidentLevel"
              @update:modelValue="
                onSelectBlockLevel(
                  incident.incidentInformation.placeOfIncident.block,
                  incident.incidentInformation.placeOfIncident.level,
                )
              "
            ></v-autocomplete>
          </v-col>

          <v-col class="pa-5" cols="12" md="3">
            <v-autocomplete
              v-model="incident.incidentInformation.placeOfIncident.unit"
              label="Unit"
              hide-details="auto"
              :rules="[requiredInput]"
              :items="units"
              item-title="name"
              item-value="_id"
              ref="placeOfIncidentUnit"
            ></v-autocomplete>
          </v-col>
        </template>

        <template v-else>
          <v-col cols="12" sm="12" md="10">
            <v-text-field
              v-model="incident.incidentInformation.placeOfIncident.other"
              label="Other Place"
              hide-details="auto"
              class="mt-2"
              :rules="[requiredInput]"
            ></v-text-field>
          </v-col>
        </template>

        <v-col cols="12" sm="12" md="2">
          <v-checkbox
            class=""
            label="Other"
            v-model="incident.incidentInformation.placeOfIncident.isOther"
          ></v-checkbox>
        </v-col>
      </v-row>
    </div>

    <v-divider class="border-opacity-25 my-5"></v-divider>

    <div>
      <span class="font-weight-bold">Incident Type / Time</span>
      <v-row>
        <v-col class="pa-5" cols="12" md="4">
          <v-text-field
            v-model="
              incident.incidentInformation.incidentTypeAndTime.typeOfIncident
            "
            :rules="[requiredInput]"
            hide-details="auto"
            ref="typeOfIncident"
            label="Type of Incident"
          ></v-text-field>
        </v-col>

        <v-col class="pa-5" cols="12" md="4">
          <v-text-field
            v-model="
              incident.incidentInformation.incidentTypeAndTime.incidentStart
            "
            :active="timePickerStart"
            :focus="timePickerStart"
            label="Incident Start (HH:mm)"
            append-inner-icon="mdi-clock-time-four-outline"
            :rules="[requiredInput, timeFormatRule]"
            class="w-100"
            @keypress="validateMilitaryTime"
          >
            <v-menu
              v-model="timePickerStart"
              :close-on-content-click="false"
              activator="parent"
              transition="scale-transition"
            >
              <v-time-picker
                v-if="timePickerStart"
                v-model="
                  incident.incidentInformation.incidentTypeAndTime.incidentStart
                "
                full-width
                format="24h"
              ></v-time-picker>
            </v-menu>
          </v-text-field>
        </v-col>

        <v-col class="pa-5" cols="12" md="4">
          <template
            v-if="
              selectedOption === 'Time' &&
              incident.incidentInformation.incidentTypeAndTime.incidentEnd !==
                'N/A' &&
              incident.incidentInformation.incidentTypeAndTime.incidentEnd !==
                'Pending'
            "
          >
            <v-text-field
              id="incidentEnd"
              class="w-100"
              v-model="
                incident.incidentInformation.incidentTypeAndTime.incidentEnd
              "
              placeholder="Incident End (HH:mm)"
              @click:append="timePickerEnd = true"
              readonly
            >
              <template #append>
                <v-icon>mdi-clock</v-icon>
              </template>
            </v-text-field>

            <v-menu
              v-model="timePickerEnd"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template #activator="{ on, attrs }">
                <div class="d-flex mt-2">
                  <v-text-field
                    v-model="
                      incident.incidentInformation.incidentTypeAndTime
                        .incidentEnd
                    "
                    :active="timePickerEnd"
                    :focus="timePickerEnd"
                    label="Incident Ends (HH:mm)"
                    append-inner-icon="mdi-clock-time-four-outline"
                    :rules="[timeFormatRule]"
                    @keypress="validateMilitaryTime"
                    @click="() => (timePickerEnd = true)"
                  >
                    <v-menu
                      v-model="timePickerEnd"
                      :close-on-content-click="false"
                      activator="parent"
                      transition="scale-transition"
                    >
                      <v-time-picker
                        v-if="timePickerEnd"
                        v-model="
                          incident.incidentInformation.incidentTypeAndTime
                            .incidentEnd
                        "
                        full-width
                        close-on-complete
                        format="24h"
                      ></v-time-picker>
                    </v-menu>
                  </v-text-field>
                  <v-btn
                    @click="closePicker"
                    color="error"
                    class="rounded-md ml-2"
                  >
                    <v-icon> mdi-close </v-icon>
                  </v-btn>
                </div>
              </template>
            </v-menu>
          </template>

          <v-select
            v-else
            v-model="selectedOption"
            :items="options"
            label="Select Incident End Status"
          ></v-select>
        </v-col>
      </v-row>
    </div>

    <v-divider class="border-opacity-25 my-5"></v-divider>

    <div>
      <span class="font-weight-bold"
        >Response/Submission From (1st Contact)</span
      >
      <v-row>
        <v-col class="pa-5" cols="12" md="4">
          <v-text-field
            v-model="incident.incidentInformation.submissionForm.time"
            :active="menuResponseTime"
            :focus="menuResponseTime"
            label="Time (HH:mm)"
            append-inner-icon="mdi-clock-time-four-outline"
            :rules="[timeFormatRule]"
            class="w-100"
            @keypress="validateMilitaryTime"
            @click="() => (menuResponseTime = true)"
          >
            <v-menu
              v-model="menuResponseTime"
              :close-on-content-click="false"
              activator="parent"
              transition="scale-transition"
            >
              <v-time-picker
                v-if="menuResponseTime"
                v-model="incident.incidentInformation.submissionForm.time"
                :rules="[requiredInput]"
                full-width
                format="24h"
              ></v-time-picker>
            </v-menu>
          </v-text-field>
        </v-col>

        <v-col class="pa-5" cols="12" md="4">
          <v-text-field
            v-model="incident.incidentInformation.submissionForm.timeOfResponse"
            :active="menuResponseSubmitTime"
            :focus="menuResponseSubmitTime"
            label="Time of Response Report Submission (HH:mm)"
            append-inner-icon="mdi-clock-time-four-outline"
            class="w-100"
            :rules="[timeFormatRule]"
            @keypress="validateMilitaryTime"
            @click="() => (menuResponseSubmitTime = true)"
          >
            <v-menu
              v-model="menuResponseSubmitTime"
              :close-on-content-click="false"
              activator="parent"
              transition="scale-transition"
            >
              <v-time-picker
                v-if="menuResponseSubmitTime"
                v-model="
                  incident.incidentInformation.submissionForm.timeOfResponse
                "
                :rules="[requiredInput]"
                full-width
                format="24h"
              ></v-time-picker>
            </v-menu>
          </v-text-field>
        </v-col>

        <v-col class="pa-5" cols="12" md="4">
          <v-text-field
            v-model="incident.incidentInformation.submissionForm.dateOfReport"
            label="Select Date"
            readonly
            hide-details
            append-inner-icon="mdi-calendar"
            @click="openDateDialog"
          >
          </v-text-field>
          <v-dialog v-model="selectDateDialog" max-width="355">
            <v-card>
              <v-card-subtitle>
                <v-date-picker
                  width="320"
                  v-model="selectedDate"
                  :locale="locale"
                  @change="applySelectedDate"
                ></v-date-picker>
              </v-card-subtitle>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </div>

    <v-divider class="border-opacity-25 my-5"></v-divider>

    <div>
      <span class="font-weight-bold"
        >Name of Informant/Complainant Information</span
      >
      <v-row>
        <v-col class="pa-5" cols="12" md="6">
          <v-text-field
            v-model="incident.incidentInformation.complaintInfo.complainant"
            :rules="[requiredInput]"
            hide-details="auto"
            ref="complaintInfoComplainant"
            label="Name"
          ></v-text-field>
        </v-col>

        <v-col class="pa-5" cols="12" md="6">
          <v-text-field
            v-model="incident.incidentInformation.complaintInfo.nric"
            hide-details
            ref="complaintInfoNric"
            label="NRIC/WP Number (optional)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pa-5 pt-0" cols="12" md="9">
          <div class="mb-5">
            <span class="font-weight">Contact Number</span>
          </div>
          <v-row no-gutters>
            <v-col cols="12" md="4" class="mb-4 mb-md-0 mr-md-2">
              <v-select
                v-model="prefix"
                :items="prefixes"
                item-title="country"
                item-value="dial_code"
                hide-details
                menu-icon="mdi-chevron-down"
                chips
                label="Dial Code"
                flat
                density="compact"
              >
                <template v-slot:chip="{ props, item }">
                  <div v-bind="props">
                    {{
                      item.raw.code
                        ? `${item.raw?.code} (+${item.raw?.phone})`
                        : ""
                    }}
                  </div>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list v-bind="props" density="compact">
                    <v-list-item link>
                      {{ `${item.raw.label} (+${item.raw.phone})` }}
                    </v-list-item>
                  </v-list>
                  <v-divider></v-divider>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="7">
              <v-text-field
                v-model="primaryPhone"
                label="Phone Number"
                type="number"
                hint=""
                @update:modelValue="onFormatComplainantContact"
                :rules="[
                  (input) =>
                    prefix?.phoneLength
                      ? input?.length == prefix?.phoneLength ||
                        `Phone number must contain ${prefix?.phoneLength} numbers`
                      : 'Select from dial code first',
                ]"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <v-divider class="border-opacity-25 my-5"></v-divider>

    <div>
      <span class="font-weight-bold"
        >Name of Recipient of Complaint (1st Contact)</span
      >
      <v-row>
        <v-col class="pa-5" cols="12" md="6">
          <v-text-field
            v-model="
              incident.incidentInformation.recipientOfComplaint.recipient
            "
            :rules="[requiredInput]"
            hide-details="auto"
            label="Name"
            ref="recipientOfComplaintRecipient"
          ></v-text-field>
        </v-col>
        <v-col class="pa-5" cols="12" md="6">
          <v-text-field
            v-model="incident.incidentInformation.recipientOfComplaint.nric"
            hide-details
            ref="recipientOfComplaintNric"
            label="NRIC/WP Number (optional)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pa-5 pt-0" cols="12" md="9">
          <div class="mb-5">
            <span class="font-weight">Contact Number</span>
          </div>
          <v-row no-gutters>
            <v-col cols="12" md="4" class="mb-4 mb-md-0 mr-md-2">
              <v-select
                v-model="prefix_recipient"
                :items="prefixes"
                item-title="country"
                item-value="dial_code"
                hide-details
                menu-icon="mdi-chevron-down"
                chips
                label="Dial Code"
                flat
                density="compact"
              >
                <template v-slot:chip="{ props, item }">
                  <div v-bind="props">
                    {{
                      item.raw.code
                        ? `${item.raw?.code} (+${item.raw?.phone})`
                        : ""
                    }}
                  </div>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list v-bind="props" density="compact">
                    <v-list-item link>
                      {{ `${item.raw.label} (+${item.raw.phone})` }}
                    </v-list-item>
                  </v-list>
                  <v-divider></v-divider>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="7">
              <v-text-field
                v-model="primaryPhone_recipient"
                label="Phone Number"
                type="number"
                hint=""
                @update:modelValue="onFormatRecipientContact"
                :rules="[
                  (input) =>
                    prefix_recipient?.phoneLength
                      ? input?.length == prefix_recipient?.phoneLength ||
                        `Phone number must contain ${prefix_recipient?.phoneLength} numbers`
                      : 'Select from dial code first',
                ]"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <v-divider class="border-opacity-25 my-5"></v-divider>

    <div>
      <span class="font-weight-bold">Complaint Received through</span>
      <v-radio-group
        v-model="incident.incidentInformation.complaintReceivedTo.receivedVia"
        ref="complaintReceivedVia"
        :rules="[requiredInput]"
      >
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-radio label="Phone" value="phone"></v-radio>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-radio label="FCC Counter" value="fcc"></v-radio>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-radio label="Walkie Talkie" value="walkie"></v-radio>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-radio label="Other" value="other"></v-radio>
          </v-col>
        </v-row>
      </v-radio-group>

      <v-col
        class="my-4"
        v-if="
          incident.incidentInformation.complaintReceivedTo.receivedVia ===
          'other'
        "
      >
        <v-text-field
          v-model="
            incident.incidentInformation.complaintReceivedTo.otherDescription
          "
          hide-details="auto"
          :rules="[requiredInput]"
          ref="complaintOtherDesc"
          label="Other please specify"
        ></v-text-field>
      </v-col>

      <v-divider class="border-opacity-25 my-5"></v-divider>

      <span class="font-weight-bold">Brief Description</span>

      <v-col class="w-100 my-4">
        <v-textarea
          v-model="
            incident.incidentInformation.complaintReceivedTo.briefDescription
          "
          hide-details="auto"
          :rules="[requiredInput]"
          ref="briefDesc"
          label="Brief description"
        ></v-textarea>
      </v-col>
    </div>
  </div>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";
import phoneCode from "../phone-code.json";
const {
  requiredInput,
  formatPhoneNumber,
  displayPhoneNumber,
  validateMilitaryTime,
  timeFormatRule,
  standardFormatDateYearMonthDay,
} = useUtils();
const { currentUser } = useLocalAuth();
const { getSiteById } = useSite();
const { getAllBuildingBlocks, blocks, search: blockSearch } = useBlock();
const { getAllLevel, blockLevels, search: levelSearch } = useBlockLevel();
const { getAllUnits, units, search: unitSearch } = useBlockLevelUnit();
const { mySite } = useFilter();

const emit = defineEmits(["updateData"]);
let props = defineProps({
  incident: {
    type: Object,
  },
  blocks: {
    type: Object,
  },
  blockLevels: {
    type: Object,
  },
  units: {
    type: Object,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const prefixes = phoneCode;
const prefix = ref("+65");
const prefix_recipient = ref("+65");
const primaryPhone = ref("");
const primaryPhone_recipient = ref("");
const siteName = ref("");
const otherPlaceIncident = ref(false);

const fullName = computed(() => {
  const submittedBy = props.incident.incidentInformation.siteInfo.submittedBy;

  return typeof submittedBy === "object"
    ? `${submittedBy.givenName || ""} ${submittedBy.middleName || ""} ${submittedBy.surname || ""}`.trim()
    : submittedBy;
});

const timePickerStart = ref(false);
const timePickerEnd = ref(false);
const menuResponseTime = ref(false);
const menuResponseSubmitTime = ref(false);
const options = ["Time", "N/A", "Pending"];
const selectedOption = ref("Time");
const selectDateDialog = ref(false);
const selectedDate = ref(null);
const locale = "en";

const openDateDialog = () => {
  selectDateDialog.value = true;
};

onMounted(async () => {
  if (
    props.isEdit &&
    props.incident.incidentInformation.submissionForm.dateOfReport
  ) {
    selectedDate.value = new Date(
      props.incident.incidentInformation.submissionForm.dateOfReport,
    );
  }
  displayComplainantContact();
  displayRecipientContact();
  const site = await getSiteById(mySite.value);
  siteName.value = (site && site.name) || "No Site";

  const submittedBy = props.incident.incidentInformation.siteInfo.submittedBy;

  props.incident.incidentInformation.siteInfo.submittedBy =
    typeof submittedBy === "object"
      ? `${submittedBy.givenName || ""} ${submittedBy.middleName || ""} ${submittedBy.surname || ""}`.trim()
      : submittedBy;

  if (!props.incident?.incidentInformation.incidentTypeAndTime.incidentEnd) {
    if (props.isEdit) {
      const incidentEnd =
        props.incident?.incidentInformation.incidentTypeAndTime.incidentEnd;

      if (incidentEnd === "Pending") {
        selectedOption.value = "Pending";
      } else if (incidentEnd === "N/A") {
        selectedOption.value = "N/A";
      } else if (incidentEnd) {
        selectedOption.value = "Time";
      } else {
        selectedOption.value = "N/A";
      }
    } else if (
      !props.incident?.incidentInformation.incidentTypeAndTime.incidentEnd
    ) {
      selectedOption.value = "N/A";
    }
  }
});

const applySelectedDate = () => {
  if (selectedDate.value) {
    props.incident.incidentInformation.submissionForm.dateOfReport =
      standardFormatDateYearMonthDay(selectedDate.value);
    selectDateDialog.value = false;
  }
};

// Watch the selected date and apply changes
watch(selectedDate, (newVal) => {
  if (newVal) {
    applySelectedDate();
  }
});

watch(selectedOption, (newValue) => {
  if (newValue === "Pending" || newValue === "N/A") {
    props.incident.incidentInformation.incidentTypeAndTime.incidentEnd =
      selectedOption.value;
  } else if (newValue === "Time") {
    props.incident.incidentInformation.incidentTypeAndTime.incidentEnd = "";
  }
});

function closePicker() {
  selectedOption.value = "N/A";
  timePickerEnd.value = false;
}

const onSelectBlock = async (block: string) => {
  await getAllLevel({
    block: block,
  });
  props.incident.incidentInformation.placeOfIncident.level = "";
  props.incident.incidentInformation.placeOfIncident.unit = "";
};

const onSelectBlockLevel = async (block: string, blockLevel: string) => {
  await getAllUnits({
    block: block,
    level: blockLevel,
    // organization: currentUser.value.organization,
  });
  props.incident.incidentInformation.placeOfIncident.unit = "";
};

function displayComplainantContact(value?: string) {
  // format mobile number
  const { countryCode, pNumber } = displayPhoneNumber(
    props.incident!.incidentInformation.complaintInfo.contact || value || "",
  );
  primaryPhone.value = pNumber;
  if (countryCode) {
    prefix.value = countryCode;
  }
}

function displayRecipientContact(value?: string) {
  // format primary number
  const { countryCode, pNumber } = displayPhoneNumber(
    props.incident!.incidentInformation.recipientOfComplaint.contact ||
      value ||
      "",
  );
  primaryPhone_recipient.value = pNumber;
  if (countryCode) {
    prefix_recipient.value = countryCode;
  }
}

const onSearchBlock = async (_search: string) => {
  debouncedSearchBlock(_search);
};

const onFormatComplainantContact = () => {
  debounceFormatComplainantContact();
};

const onFormatRecipientContact = () => {
  debounceFormatRecipientContact();
};

const debouncedSearchBlock = debounce(async (value: string) => {
  blockSearch.value = value;
  await getAllBuildingBlocks({
    site: mySite.value,
  });
}, 500);

const debounceFormatComplainantContact = debounce(() => {
  if (primaryPhone.value) {
    props.incident!.incidentInformation.complaintInfo.contact =
      formatPhoneNumber(prefix.value, primaryPhone.value || "");
  } else {
    props.incident!.incidentInformation.complaintInfo.contact = "";
  }
}, 500);

const debounceFormatRecipientContact = debounce(() => {
  if (primaryPhone_recipient.value) {
    props.incident!.incidentInformation.recipientOfComplaint.contact =
      formatPhoneNumber(
        prefix_recipient.value,
        primaryPhone_recipient.value || "",
      );
  } else {
    props.incident!.incidentInformation.recipientOfComplaint.contact = "";
  }
}, 500);
</script>
