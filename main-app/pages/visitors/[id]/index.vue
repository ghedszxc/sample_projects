<template>
  <v-row no-gutters class="pa-8" justify="center">
    <v-col cols="12" xxl="4" xl="8" lg="8">
      <v-row no-gutters>
        <v-col cols="12">
          <v-btn
            class="mr-2"
            size="small"
            icon="mdi-chevron-left"
            flat
            :to="{ name: 'visitors', query: { site: mySite } }"
          ></v-btn>
          <span
            class="text-h6 font-weight-bold"
            style="letter-spacing: 2px !important"
          >
            {{
              visitor.type === "pick-up" || visitor.type === "drop-off"
                ? visitor.type === "pick-up"
                  ? `PICKUP - ${visitor.companyName?.toUpperCase()}`
                  : `DROPOFF - ${visitor.companyName?.toUpperCase()}`
                : visitor.name
            }}
          </span>
        </v-col>

        <v-col cols="12" class="font-weight-light mt-4">
          <v-card
            width="100%"
            elevation="0"
            style="border-width: thin"
            min-height="168px"
            class="d-flex justify-center align-center"
          >
            <v-row no-gutters>
              <v-col cols="12" class="font-weight-light">
                <v-card width="100%" elevation="0">
                  <v-list class="pa-0" density="compact">
                    <template
                      v-for="(item, itemIndex) in items"
                      :key="itemIndex"
                    >
                      <v-list-item
                        v-if="item.to"
                        :to="{
                          name: item.to,
                          params: item.params,
                          query: {
                            site: mySite,
                          },
                        }"
                        :prepend-icon="item.icon"
                        class="py-6"
                        density="compact"
                      >
                        <v-list-item-title class="text-subtitle-1">
                          {{ item.text }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                          v-if="item.subtitle"
                          :class="`text-subtitle-2 ${item.class}`"
                        >
                          {{ item.subtitle }}
                        </v-list-item-subtitle>
                      </v-list-item>

                      <v-list-item
                        v-else-if="item.text == 'NRIC/Passport Number'"
                        :prepend-icon="item.icon"
                        class="py-6"
                        density="compact"
                      >
                        <v-tooltip
                          v-if="item.subtitle"
                          activator="parent"
                          location="bottom"
                          open-on-click
                          >{{ item.subtitle }}</v-tooltip
                        >

                        <template
                          v-if="
                            (item.text == 'NRIC/Passport Number' &&
                              currentUser.type === 'organization') ||
                            currentUser.type === 'admin'
                          "
                          v-slot:append
                        >
                          <v-btn
                            @click="toggleFullText"
                            color="grey-lighten-1"
                            :icon="showString ? 'mdi-eye-minus' : 'mdi-eye'"
                            variant="text"
                          ></v-btn>
                        </template>
                        <v-list-item-title class="text-subtitle-1">
                          {{ item.text }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                          v-if="item.subtitle"
                          :class="`text-subtitle-2 ${item.class}`"
                        >
                          <template v-if="!showString">
                            {{ nricChecker(item.subtitle) }}
                          </template>
                          <template v-else>
                            {{ item.subtitle }}
                          </template>
                        </v-list-item-subtitle>
                      </v-list-item>

                      <v-list-item
                        v-else-if="item.text == 'Email'"
                        :prepend-icon="item.icon"
                        class="py-6"
                        @click="openUpdateEmailDialog(item)"
                      >
                        <v-tooltip
                          v-if="item.subtitle"
                          activator="parent"
                          location="bottom"
                          open-on-click
                        >
                          {{ item.subtitle }}
                        </v-tooltip>

                        <v-list-item-title class="text-subtitle-1">
                          {{ item.text }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                          :class="`text-subtitle-2 ${item.class}`"
                        >
                          {{ item.subtitle }}
                        </v-list-item-subtitle>
                      </v-list-item>

                      <v-list-item
                        v-else
                        :prepend-icon="item.icon"
                        class="py-6"
                      >
                        <v-tooltip
                          v-if="item.subtitle"
                          activator="parent"
                          location="bottom"
                          open-on-click
                        >
                          {{
                            item.text === "Actual Check In" ||
                            item.text === "Actual Check Out"
                              ? item.subtitle
                                ? standardFormatDateTime(item.subtitle)
                                : "N/A"
                              : item.subtitle
                          }}
                        </v-tooltip>

                        <v-list-item-title class="text-subtitle-1">
                          {{ item.text }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                          :class="`text-subtitle-2 ${item.class}`"
                        >
                          {{
                            item.text === "Actual Check In" ||
                            item.text === "Actual Check Out"
                              ? item.subtitle
                                ? standardFormatDateTime(item.subtitle)
                                : "N/A"
                              : item.subtitle
                          }}
                          <v-list-item-subtitle
                            v-if="
                              $vuetify.display.mdAndUp &&
                              item.text == 'Visitor Name' &&
                              visitor?.members?.length &&
                              visitor?.members[0]?.name !== '' &&
                              visitor?.members[0]?.nric !== ''
                            "
                          >
                            {{
                              $vuetify.display.mdAndUp &&
                              item.text == "Visitor Name" &&
                              visitor?.members?.length &&
                              visitor?.members[0]?.name !== "" &&
                              visitor?.members[0]?.nric !== ""
                                ? `(+${visitor?.members?.length} members)`
                                : ""
                            }}
                            <v-tooltip
                              v-if="
                                $vuetify.display.mdAndUp &&
                                item.text == 'Visitor Name' &&
                                visitor?.members?.length &&
                                visitor?.members[0]?.name !== '' &&
                                visitor?.members[0]?.nric !== ''
                              "
                              activator="parent"
                              location="bottom left"
                            >
                              <v-list
                                :style="{
                                  backgroundColor:
                                    theme == 'light' && 'transparent',
                                  color: theme == 'light' && '#FFFFFF',
                                }"
                              >
                                <template
                                  v-for="(member, key) in visitor?.members"
                                  :key="key"
                                >
                                  <v-list-item
                                    :title="member.name"
                                    :subtitle="nricChecker(member.nric)"
                                  />
                                  <v-divider></v-divider>
                                </template>
                              </v-list>
                            </v-tooltip>
                          </v-list-item-subtitle>
                          <v-list-item-subtitle
                            v-else="
                              item.text == 'Visitor Name' &&
                              visitor?.members?.length &&
                              visitor?.members[0]?.name !== '' &&
                              visitor?.members[0]?.nric !== ''
                            "
                            class="cursor-pointer"
                          >
                            <div>
                              <span @click="toggleTooltip">{{
                                item.text == "Visitor Name" &&
                                visitor?.members?.length &&
                                visitor?.members[0]?.name !== "" &&
                                visitor?.members[0]?.nric !== ""
                                  ? `(+${visitor?.members?.length} members)`
                                  : ""
                              }}</span>

                              <v-dialog
                                v-if="
                                  item.text == 'Visitor Name' &&
                                  visitor?.members?.length &&
                                  visitor?.members[0]?.name !== '' &&
                                  visitor?.members[0]?.nric !== ''
                                "
                                v-model="showTooltip"
                                :style="{
                                  backgroundColor:
                                    theme == 'light' && 'transparent',
                                  color: theme == 'light' && '#FFFFFF',
                                }"
                              >
                                <v-card>
                                  <v-card-text class="pb-3">
                                    <v-list> Members </v-list>
                                    <v-list>
                                      <template
                                        v-for="(
                                          member, key
                                        ) in visitor?.members"
                                        :key="key"
                                      >
                                        <v-list-item
                                          :title="member.name"
                                          :subtitle="nricChecker(member.nric)"
                                        />
                                        <v-divider></v-divider>
                                      </template>
                                    </v-list>
                                  </v-card-text>
                                </v-card>
                              </v-dialog>
                            </div>
                          </v-list-item-subtitle>
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-divider
                        v-if="itemIndex + 1 !== items.length"
                      ></v-divider>
                    </template>
                    <v-divider v-if="!visitor.actualCheckIn"></v-divider>
                    <v-list-item
                      v-if="!visitor.actualCheckIn"
                      class="py-6"
                      density="compact"
                    >
                      <v-list-item-title>
                        <v-row no-gutters>
                          <v-icon start class="mr-8">
                            mdi-email-outline
                          </v-icon>
                          Email Sent ({{ visitor.emailSending.length || 0 }})
                          <v-spacer></v-spacer>
                          <v-btn
                            size="small"
                            variant="outlined"
                            @click="resendEmail(visitor._id)"
                            :loading="loading"
                          >
                            <v-icon v-if="$vuetify.display.mdAndUp" start>
                              mdi-send-variant-outline
                            </v-icon>
                            <v-icon v-else center>
                              mdi-email-sync-outline
                            </v-icon>
                            <span v-if="$vuetify.display.mdAndUp">
                              Resend Email
                            </span>
                          </v-btn>
                        </v-row>
                      </v-list-item-title>
                      <v-list-item-subtitle
                        v-if="visitor.emailSending.length"
                        class="ml-10"
                      >
                        <v-row
                          v-for="(
                            emailSent, itemIndex
                          ) in visitor.emailSending.sort(
                            (a, b) =>
                              new Date(b.lastSent).getTime() -
                              new Date(a.lastSent).getTime(),
                          )"
                          :key="itemIndex"
                          no-gutters
                          align="center"
                        >
                          <v-col cols="12" md="3" class="pa-2">
                            <v-chip
                              v-if="emailSent.status"
                              size="small"
                              class="text-capitalize"
                              :color="
                                emailSent.status === 'success' ? 'green' : 'red'
                              "
                            >
                              {{ emailSent.status }}
                            </v-chip>
                          </v-col>
                          <v-col cols="12" md="4" class="pa-2">
                            {{ standardFormatDateTime(emailSent.lastSent) }}
                          </v-col>
                          <v-col cols="12" md="5" class="text-capitalize pa-2">
                            By: {{ emailSent.givenName }}
                            {{ emailSent.surname }}
                          </v-col>
                          <v-divider
                            v-if="itemIndex + 1 !== visitor.emailSending.length"
                          ></v-divider>
                        </v-row>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <!-- dialog -->
    <v-dialog
      v-model="updateEmailDialog"
      transition="dialog-right-transition"
      fullscreen
      persistent
      :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
    >
      <v-card
        :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
        :class="`${theme == 'light' && 'bg-white'} px-3 h-100 ${$vuetify.display.mdAndUp && 'rounded-s-xl'}`"
      >
        <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
          <span class="font-weight-bold pl-4 pt-1 text-capitalize">
            Update Visitor Email
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
            <v-form v-model="isVisitorValid" @submit.prevent="submit()">
              <!-- Email -->
              <v-col cols="12" class="mb-4">
                <v-text-field
                  v-model="visitor.email"
                  label="Email"
                  density="comfortable"
                  :rules="[requiredInput, validEmail]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" class="mt-4">
                <v-row no-gutters justify="center">
                  <v-btn
                    theme="dark"
                    class="font-weight-bold ma-4"
                    @click="submit"
                    :disabled="!isVisitorValid"
                    :loading="loading"
                  >
                    submit
                  </v-btn>

                  <v-btn
                    variant="text"
                    class="font-weight-bold ma-4"
                    @click="updateEmailDialog = false"
                  >
                    cancel
                  </v-btn>
                </v-row>
              </v-col>
            </v-form>
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
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure"],
});

const loading = ref(false);

const updateEmailDialog = ref(false);
const { requiredInput, validEmail } = useUtils();

const {
  tab,
  visitor,
  getVisitorById,
  setVisitor,
  resendEmailToVisitor,
  updateVisitorEmail,
  isVisitorValid,
} = useVisitor();
const { standardFormatDateTime } = useUtils();
const { theme } = useLocal();
const { currentUser } = useLocalAuth();
const { getSitesOptionsForFiltering, mySite } = useFilter();

const { setSnackbar } = useLocal();

const id = computed(() => useRoute().params.id as string);
const showTooltip = ref(false);

const toggleTooltip = () => {
  showTooltip.value = !showTooltip.value;
};

const params = ref({
  id: id.value,
});

const showString = ref(false);

onMounted(async () => {
  const [result] = await Promise.all([
    getVisitorById(id.value),
    getSitesOptionsForFiltering(),
  ]);
  setVisitor(result as TVisitor | undefined);
  validateFields();
});

const items = ref([]);

const fieldsInfo = {
  name: {
    text: "Visitor Name",
    params: params.value,
    to: "visitors-id-name",
    icon: "mdi-account-circle-outline",
  },
  phoneNumber: {
    text: "Phone Number",
    params: params.value,
    to: "visitors-id-phone",
    icon: "mdi-phone",
  },
  email: {
    text: "Email",
    params: params.value,
    to: "",
    icon: "mdi-email",
  },
  plateNumber: {
    text: "Vehicle Number",
    params: params.value,
    to: "visitors-id-plate",
    icon: "mdi-car",
  },
  companyName: {
    text: "Company Name",
    params: "",
    to: "",
    icon: "mdi-sitemap-outline",
  },
  nric: {
    text: "NRIC/Passport Number",
    params: "",
    to: "",
    icon: "mdi-id-card",
  },
  blockName: {
    text: "Block",
    params: "",
    to: "",
    icon: "mdi-office-building",
  },
  blockLevelName: {
    text: "Level",
    params: "",
    to: "",
    icon: "mdi-domain",
  },
  unitName: {
    text: "Unit",
    params: "",
    to: "",
    icon: "mdi-office-building-marker-outline",
  },
  actualCheckIn: {
    text: "Actual Check In",
    params: "",
    to: "",
    icon: "mdi-check-circle",
  },
  actualCheckOut: {
    text: "Actual Check Out",
    params: "",
    to: "",
    icon: "mdi-close-circle",
  },
  remarks: {
    text: "Remarks",
    params: "",
    to: "",
    icon: "mdi-id-card",
  },
};

async function validateFields() {
  items.value = [];

  await Object.keys(visitor.value).map((objKey) => {
    if (fieldsInfo[objKey]) {
      items.value.push({
        text: fieldsInfo[objKey].text,
        // to: fieldsInfo[objKey].to || "",
        icon: fieldsInfo[objKey].icon,
        // params: fieldsInfo[objKey].params,
        subtitle:
          objKey == "nric"
            ? currentUser.value.type != "site" &&
              currentUser.value.type != "organization"
              ? nricChecker(visitor.value[objKey])
              : visitor.value[objKey]
            : visitor.value[objKey],
      });
    }
  });
}

function toggleFullText() {
  showString.value = !showString.value;
}

function nricChecker(data: string) {
  const length = data.length;
  if (length <= 4) {
    return data;
  } else {
    return "*".repeat(length - 4) + data.slice(-4);
  }
}

function openUpdateEmailDialog(item: any) {
  visitor.value.email = item.subtitle;
  updateEmailDialog.value = true;
}

async function resendEmail(visitorId: string) {
  loading.value = true;
  try {
    const resendEmail = await resendEmailToVisitor(visitorId);

    setSnackbar({
      text: resendEmail.message,
      modal: true,
      type: resendEmail.success ? "success" : "error",
    });

    //refetch visitor
    const [result] = await Promise.all([
      getVisitorById(id.value),
      getSitesOptionsForFiltering(),
    ]);
    await setVisitor(result as TVisitor | undefined);
    await validateFields();
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  loading.value = false;
}

async function submit() {
  loading.value = true;
  try {
    const result1: any = await updateVisitorEmail(
      visitor.value._id,
      visitor.value.email,
    );

    visitor.value.email = result1.email;

    validateFields();

    setSnackbar({
      text: "Successfully update visitor's email.",
      modal: true,
      type: "success",
    });

    //close dialog
    updateEmailDialog.value = false;
  } catch (error) {
    setSnackbar({ text: error, modal: true, type: "error" });
  }
  loading.value = false;
}
</script>

<style scoped>
.dialog_desktop {
  margin: 0 0 0 auto;
  max-width: 28%;
  border-radius: 25px 0 0 25px;

  box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
}
</style>
