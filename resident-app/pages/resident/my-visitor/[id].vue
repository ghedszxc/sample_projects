<template>
  <v-row no-gutters>
    <!-- go back -->
    <v-col
      cols="6"
      :class="`mt-6 ${$vuetify.display.smAndUp ? 'px-6' : 'px-3'}`"
      @click="goBack()"
    >
      <v-icon start size="x-large" style="position: relative; right: 5px">
        <v-img
          class="pl-0 ml-0 mt-2"
          src="/dark-mode/utility-all/right-arrow.svg"
          cover
        ></v-img>
      </v-icon>
      <span style="position: relative; right: 15px"> My Visitor </span>
    </v-col>

    <v-col
      cols="12"
      :class="`${cardTitle} mt-8 ${$vuetify.display.smAndUp ? 'px-6' : 'px-5'}`"
    >
      {{
        `${new Date(dataVisitor.registeredAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}`
      }}
    </v-col>

    <v-col cols="12" :class="$vuetify.display.smAndUp ? 'px-6' : 'px-5'">
      <v-card :class="`${card} mt-8`" flat>
        <v-row no-gutters>
          <v-col cols="1" class="mr-3 text-capitalize">
            <v-avatar style="height: 32px; width: 32px" color="#eb261e">
              {{ visitorInitial }}
            </v-avatar>
          </v-col>
          <v-col cols="7" :class="`${visitorName} text-capitalize`">
            {{ dataVisitor.name }}
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="3" class="text-end">
            <v-chip variant="outlined" class="chip">
              <span class="chip-text text-capitalize">
                {{
                  dataVisitor.isOvernightParking === null
                    ? "walk in"
                    : "Drive in"
                }}
              </span>
            </v-chip>
          </v-col>

          <v-col cols="12" class="mt-6">
            <v-card
              flat
              class="text-capitalize text-white pa-2"
              :style="`display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    align-self: stretch;border-radius: 24px;
                    background: ${
                      !['approved', 'rejected'].includes(dataVisitor.status)
                        ? 'var(--standart-theme-warning, #FB8C00);'
                        : dataVisitor.status == 'approved'
                          ? 'var(--standart-theme-success, #4CAF50)'
                          : 'var(--standart-theme-error, #FF5252)'
                    };
                    #FFFFFF
                    `"
            >
              {{ getStatus(dataVisitor) }}
            </v-card>
          </v-col>

          <v-col cols="12" class="mt-6">
            <v-divider></v-divider>
          </v-col>

          <v-col cols="12" class="mt-6">
            <v-row no-gutters>
              <v-col cols="5">
                <v-row no-gutters>
                  <v-col cols="12" :class="text"> Arrival Date </v-col>
                  <v-col cols="12" :class="`${value} mt-2`">
                    <v-icon size="small"> mdi-calendar-month-outline </v-icon>

                    {{
                      new Date(
                        convertDateTimeToSGT(
                          dataVisitor.checkIn,
                          "Asia/Singapore",
                        ),
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="4">
                <v-row no-gutters>
                  <v-col cols="12" :class="text"> Arrival Time </v-col>
                  <v-col cols="12" class="mt-3">
                    <v-row no-gutters>
                      <v-col :cols="$vuetify.display.smAndUp ? '1' : '2'">
                        <v-img
                          src="/icons/resident/home/my-visitor/arrival-time.svg"
                          style="width: 16px; height: 16px"
                        ></v-img>
                      </v-col>
                      <v-col cols="10" :class="value">
                        {{ dataVisitor.arrivalTime }}
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="3">
                <v-row no-gutters>
                  <v-col cols="12" :class="text"> Duration </v-col>
                  <v-col cols="12" :class="`${value} mt-2`">
                    {{
                      dataVisitor.duration
                        ? `${dataVisitor.duration} Hour(s)`
                        : "N/A"
                    }}
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>

      <v-row no-gutters class="text-center">
        <v-col cols="6">
          <v-card :class="`mx-2 mt-6 ${textCheckTimeCard}`" flat>
            <v-card-text>
              <p class="text-check-time-value">
                {{
                  dataVisitor.actualCheckIn
                    ? new Date(dataVisitor.actualCheckIn).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                          timeZone: "Asia/Singapore",
                        },
                      )
                    : "N/A"
                }}
              </p>
              <p :class="textCheckTime">Actual Check In</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card :class="`mx-2 mt-6 ${textCheckTimeCard}`" flat>
            <v-card-text>
              <p class="text-check-time-value">
                {{
                  dataVisitor.actualCheckOut
                    ? new Date(dataVisitor.actualCheckOut).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                          timeZone: "Asia/Singapore",
                        },
                      )
                    : "N/A"
                }}
              </p>
              <p :class="textCheckTime">Actual Check Out</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6"> </v-col>
      </v-row>

      <v-row no-gutters class="text-center">
        <v-col cols="12" class="mt-6 mb-4">
          <v-card
            v-for="(item, index) in visitorInfo"
            :key="index"
            :class="`mx-2 ${infoCard}`"
            flat
          >
            <v-row align="center">
              <v-col cols="6">
                <v-card-text>
                  <p :class="infoText">
                    {{ item.title }}
                  </p>

                  <v-icon
                    v-if="item.title == 'Email'"
                    size="small"
                    @click="openUpdateEmailDialog(item)"
                  >
                    mdi-pencil-outline
                  </v-icon>

                  <div v-if="item.title == 'Email Sending'">
                    <p v-if="item.info.givenName" style="font-size: 10px">
                      By:
                      {{
                        typeof item.info === "object"
                          ? `${item.info.givenName} ${item.info.surname}`
                          : ""
                      }}
                    </p>
                    <p v-if="item.info.lastSent" style="font-size: 10px">
                      {{
                        typeof item.info === "object"
                          ? standardFormatDateTime(item.info.lastSent)
                          : ""
                      }}
                    </p>
                    <p v-else class="text-caption">No email sent yet.</p>
                  </div>
                </v-card-text>
              </v-col>

              <v-col cols="6">
                <!-- <v-card-text>
                  {{ item.info }}
                </v-card-text> -->
                <v-card-text>
                  <p
                    v-if="!['Overnight Parking'].includes(item.title)"
                    :class="`${infoText} ${item.title !== 'Email' ? 'text-capitalize' : ''} ${item.title == 'Email Sending' ? (item.info.status == 'success' ? 'text-success' : 'text-error') : ''}`"
                  >
                    {{
                      item.title === "Number of passenger"
                        ? item.info || 0
                        : item.title == "Email Sending"
                          ? item.info.status
                          : item.info || "N/A"
                    }}
                  </p>
                  <v-chip
                    class="pa-2 text-capitalize"
                    variant="flat"
                    v-else-if="['Overnight Parking'].includes(item.title)"
                    :color="
                      item.info == 'Rejected'
                        ? 'red'
                        : item.info == 'Approved'
                          ? 'green'
                          : ''
                    "
                  >
                    {{ item.info || "N/A" }}
                  </v-chip>

                  <v-btn
                    v-if="item.title == 'Email Sending'"
                    variant="outlined"
                    size="small"
                    @click="resendEmail(id)"
                    :loading="isResendingEmail"
                  >
                    Resend Email
                  </v-btn>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-col cols="12" class="" v-if="shareValue === 'true'">
        <v-btn block color="#EB261E" class="button" @click="share" size="large">
          Share
        </v-btn>
      </v-col>
    </v-col>

    <!-- dialog -->
    <v-dialog
      v-model="updateEmailDialog"
      transition="dialog-bottom-transition"
      persistent
      :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
    >
      <v-card
        :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
        :class="`${theme == 'light' && 'bg-white'} px-3 h-100}`"
      >
        <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
          <span
            class="font-weight-bold pl-4 pt-1 text-capitalize"
            style="color: #eb261e"
          >
            Update Email
          </span>

          <v-spacer></v-spacer>

          <v-btn
            color="grey-darken-1"
            icon="mdi-close"
            @click="updateEmailDialog = false"
          ></v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text>
          <v-row class="fill-height" justify="center" align-content="center">
            <v-form v-model="isVisitorValid" @submit.prevent="updateEmail()">
              <!-- Email -->
              <v-col cols="12">
                <v-text-field
                  v-model="emailToUpdate"
                  label="Email"
                  density="compact"
                  :rules="[requiredInput, validEmail]"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-row no-gutters justify="center">
                  <v-btn
                    color="#EB261E"
                    class="font-weight-bold mx-4"
                    type="submit"
                    :disabled="!isVisitorValid"
                    :loading="isUpdatingEmail"
                  >
                    submit
                  </v-btn>

                  <v-btn
                    variant="text"
                    class="font-weight-bold mx-4"
                    color="#EB261E"
                    @click="updateEmailDialog = false"
                  >
                    cancel
                  </v-btn>
                </v-row>
              </v-col>
            </v-form>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  secure: "secure",
});

const { theme, setSnackbar } = useLocal();

const { standardFormatDateTime, requiredInput, validEmail } = useUtils();

const cardTitle = computed(() =>
  theme.value === "dark" ? "card-title-dark" : "card-title-light",
);

const card = computed(() =>
  theme.value === "dark" ? "card-dark" : "card-light",
);

const visitorName = computed(() =>
  theme.value === "dark" ? "visitor-name-dark" : "visitor-name-light",
);

const text = computed(() =>
  theme.value === "dark" ? "text-dark" : "text-light",
);

const value = computed(() =>
  theme.value === "dark" ? "value-dark" : "value-light",
);

const textCheckTimeCard = computed(() =>
  theme.value === "dark"
    ? "text-check-time-card-dark"
    : "text-check-time-card-light",
);

const textCheckTime = computed(() =>
  theme.value === "dark" ? "text-check-time-dark" : "text-check-time-light",
);

const infoCard = computed(() =>
  theme.value === "dark" ? "info-card-dark" : "info-card-light",
);

const infoText = computed(() =>
  theme.value === "dark" ? "info-text-dark" : "info-text-light",
);

const {
  getVisitorById,
  isVisitorValid,
  updateVisitorEmail,
  resendEmailToVisitor,
} = useVisitor();

const emailToUpdate = ref("");
const updateEmailDialog = ref(false);
const isUpdatingEmail = ref(false);
const isResendingEmail = ref(false);

const convertDateTimeToSGT = (dateTime: string | Date, timeZone: string) => {
  let date = new Date(dateTime);
  let convertedDateString = date.toLocaleString("en-US", {
    timeZone: timeZone,
  });
  let convertedDate = new Date(convertedDateString);
  return convertedDate;
};

const visitorInfo = ref([
  { title: "Type", info: "" },
  { title: "Phone", info: "" },
  { title: "Email", info: "" },
  { title: "Email Sending", info: "" },
  { title: "Purpose Of Visit", info: "" },
  { title: "Location", info: "" },
  { title: "Number of passenger", info: "" },
  { title: "Overnight Parking", info: "" },
  { title: "Remarks Overnight Parking", info: "" },
]);

const visitorInitial = ref("");

const dataVisitor = ref({});

const id = computed(() => useRoute().params.id as string);
const shareValue = computed(() => useRoute().query.share as string);
function goBack() {
  useRouter().push({ name: "resident-my-visitor" });
}

onMounted(async () => {
  if (!theme.value) theme.value = "light";

  const visitor: any = await getVisitorById(id.value);

  dataVisitor.value = visitor;

  const emailSendingInfo =
    Array.isArray(visitor.emailSending) && visitor.emailSending.length > 0
      ? visitor.emailSending[visitor.emailSending.length - 1]
      : "N/A";

  visitorInfo.value = [
    {
      title: "Type",
      info: visitor.isOvernightParking === null ? "Walk in" : "Drive in",
    },
    { title: "Phone", info: visitor.phoneNumber },
    { title: "Email", info: visitor.email },
    { title: "Email Sending", info: emailSendingInfo },
    {
      title: "Location",
      info: `${visitor.blockName} ${visitor.blockLevelName} ${visitor.unitName}`,
    },

    ...(visitor.isOvernightParking !== null
      ? [
          {
            title: "Number of passenger",
            info: visitor.numberOfPassenger,
          },
        ]
      : []),
    { title: "Purpose Of Visit", info: visitor.remarks },
    ...(visitor.isOvernightParking !== null
      ? [
          {
            title: "Overnight Parking",
            info:
              visitor?.overnightParking?.status?.charAt(0).toUpperCase() +
              visitor?.overnightParking?.status?.slice(1),
          },
        ]
      : []),
    {
      title: "Overnight Parking Remarks ",
      info: visitor.overnightParking?.remarks,
    },
  ];

  visitorInitial.value = (
    dataVisitor?.value?.name?.split(" ")[0][0] +
    dataVisitor?.value?.name?.split(" ").slice(-1)[0][0]
  ).toUpperCase();
});

async function share() {
  useRouter().push(`/resident/invite/pre-register/${id.value}?back=false`);
  // navigator.share({
  //   title: "Visitor Invitation Link",
  //   text: `
  //   Please register yourself with the given link.`,
  //   url: `${config.public.BASE_URL}resident/invite/register/${id.value}`,
  // });
}

function convertToTimeZone(date, timeZone) {
  const utcDate = new Date(date).toISOString();
  const dateOptions = {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return new Date(
    new Intl.DateTimeFormat("en-US", dateOptions).format(new Date(utcDate)),
  );
}

function getStatus(item: any) {
  let status = "Pending";

  if (item.actualCheckIn && !item.actualCheckOut) {
    status = "Checked In";
  } else if (item.actualCheckOut) {
    status = "Checked Out";
  } else if (
    item.status == "approved" &&
    !item.actualCheckIn &&
    new Date() < convertToTimeZone(item.checkOut, "Asia/Singapore")
  ) {
    status = "Approved";
  } else if (
    item.status == "approved" &&
    !item.actualCheckIn &&
    new Date() > convertToTimeZone(item.checkOut, "Asia/Singapore")
  ) {
    status = "No show";
  } else if (
    item?.status?.includes("pre registered") &&
    !item.actualCheckIn &&
    new Date() > convertToTimeZone(item.checkOut, "Asia/Singapore")
  ) {
    status = "Expired";
  } else if (item.status == "rejected") {
    status = "Rejected";
  }
  return status;
}

function openUpdateEmailDialog(item: object) {
  emailToUpdate.value = item.info;
  updateEmailDialog.value = true;
}

async function updateEmail() {
  isUpdatingEmail.value = true;
  try {
    await updateVisitorEmail(id.value, emailToUpdate.value);
    const result: any = await getVisitorById(id.value);

    dataVisitor.value = result;

    visitorInfo.value = visitorInfo.value.map((item) => {
      if (item.title === "Email") {
        item.info = result.email;
      }
      return item;
    });
    setSnackbar({
      text: "Successfully updated the visitor's email.",
      modal: true,
      type: "success",
    });

    //close dialog
    updateEmailDialog.value = false;
  } catch (error) {
    setSnackbar({ text: error, modal: true, type: "error" });
  }
  isUpdatingEmail.value = false;
}
async function resendEmail(visitorId: string) {
  isResendingEmail.value = true;
  try {
    const resendEmail = await resendEmailToVisitor(visitorId);
    if (resendEmail.success) {
      const result: any = await getVisitorById(id.value);

      dataVisitor.value = result;

      const emailSendingInfo =
        Array.isArray(result.emailSending) && result.emailSending.length > 0
          ? result.emailSending[result.emailSending.length - 1]
          : "N/A";

      visitorInfo.value = visitorInfo.value.map((item) => {
        if (item.title === "Email Sending") {
          item.info = emailSendingInfo;
        }
        return item;
      });

      setSnackbar({
        text: resendEmail.message,
        modal: true,
        type: "success",
      });
    } else {
      setSnackbar({
        text: resendEmail.message,
        modal: true,
        type: "error",
      });
    }
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  isResendingEmail.value = false;
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
}
.go-back-dark {
  color: #fcfcfc;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}
.card-title-light {
  color: #052439;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
}
.card-title-dark {
  color: var(--White, #fff);
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
}
.card-light {
  display: flex;
  padding: 24px 16px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--black-004, rgba(0, 0, 0, 0.04));
  background: #fff;
}
.card-dark {
  display: flex;
  padding: 24px 16px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--black-004, rgba(0, 0, 0, 0.04));
  background: var(--Corporate-blue, #111723);
}
.visitor-name-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
  margin-top: 6px;
  margin-left: 3px;
}
.visitor-name-dark {
  color: var(--White, #fff);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
  margin-top: 6px;
  margin-left: 3px;
}
.chip {
  padding: var(--f-spacing-40, 4px) 16px;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  border: 1px solid var(--Primary, #eb261e);
  background: var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}
.chip-text {
  color: #fff;
  text-shadow:
    0px 4px 10px rgba(0, 0, 0, 0.3),
    0px 16px 30px rgba(0, 0, 0, 0.9);
  font-size: 10px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  margin-top: 1px;
}
.text-light {
  color: #052439;
  font-size: 12px;
  font-weight: 400;
  line-height: 19px;
}
.text-dark {
  color: var(--White, #fff);
  font-size: 12px;
  font-weight: 400;
  line-height: 19px;
}
.value-light {
  color: #052439;
  font-size: 13px;
  font-weight: 400;
  line-height: 19px;
}
.value-dark {
  color: var(--White, #fff);
  font-size: 13px;
  font-weight: 400;
  line-height: 19px;
}
.text-check-time-card-light {
  border-radius: 16px;
  border: 1px solid var(--Primary, #eb261e);
  background: var(--White, #fff);
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}
.text-check-time-card-dark {
  border-radius: 16px;
  border: 1px solid var(--Primary, #eb261e);
  background: var(--Corporate-blue, #111723);
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}
.text-check-time-value {
  color: var(--Primary, #eb261e);
  font-size: 32px;
  font-style: normal;
  font-weight: 500;
  line-height: 48px;
}
.text-check-time-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}
.text-check-time-dark {
  color: var(--White, #fff);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}
.info-card-light {
  border: 1px solid var(--black-004, rgba(0, 0, 0, 0.04));
  background: var(--White, #fff);
  box-shadow: 0px 5px 14px 0px rgba(0, 0, 0, 0.03);
}
.info-card-dark {
  border: 1px solid var(--black-004, rgba(0, 0, 0, 0.04));
  background: var(--Corporate-blue, #111723);
  box-shadow: 0px 5px 14px 0px rgba(0, 0, 0, 0.03);
}
.info-text-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px; /* 135.714% */
}
.info-text-dark {
  color: var(--White, #fff);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px; /* 135.714% */
}
.text-time {
  color: #052439;
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px; /* 158.333% */
}
</style>
