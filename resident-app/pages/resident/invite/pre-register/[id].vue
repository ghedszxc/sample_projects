<template>
  <v-row
    no-gutters
    class="pa-6"
    :style="`opacity: ${dialog_share ? '0.3' : '1'};${
      dialog_share ? 'background: #fff' : ''
    };`"
  >
    <v-col cols="6" class="d-flex justify-start">
      <div @click="cancel()" style="cursor: pointer">
        <!-- <v-avatar rounded="0" style="width: 57px; height: 57px">
          <v-img :src="imgSrc" cover></v-img>
        </v-avatar> -->
      </div>
    </v-col>
    <v-col cols="6" class="d-flex justify-end align-center">
      <div @click="cancel()" style="cursor: pointer">
        <v-avatar rounded="0" style="width: 24px; height: 24px">
          <v-img :src="BackIconimgSrc" cover></v-img>
        </v-avatar>
        <!-- <v-avatar rounded="0" style="width: 24px; height: 24px">
              <v-img src="/images/forgot-password/x-icon.svg" cover></v-img>
            </v-avatar> -->
      </div>
    </v-col>
    <v-col cols="12">
      <v-row no-gutters>
        <!-- gif icon -->
        <v-col cols="12" style="margin-top: 70px">
          <v-row no-gutters justify="center">
            <v-img :src="SrcImage" style="width: 190px; height: 190px"></v-img>
            <!-- <v-img
              src="/icons/resident/home/invite-visitor/invitation-sent.svg"
              style="width: 190px; height: 120px"
            ></v-img> -->
          </v-row>
        </v-col>
        <v-col cols="12" class="title text-center" :color="textColor">
          Visitor QR Code Link
        </v-col>
        <!-- <v-col cols="12" class="subtitle mt-3 text-center" :color="textColor">
          Invitation has been successfully Saved.
        </v-col> -->

        <v-col cols="12" class="mt-6">
          <v-card
            :color="cardColor"
            class="card-color"
            flat
            :style="`align-items: center;
                    align-self: stretch;
                    border-radius: 4px;
                    padding: 6px 16px;
           border: 1px solid red;
                    opacity: ${dialog_share ? '0.3' : '1'}; ${
                      dialog_share ? 'background: #fff' : ''
                    };`"
          >
            <v-row no-gutters>
              <v-col cols="12" class="pre-register-label" :color="textColor">
                link:
              </v-col>
              <v-col cols="10" class="pre-register-link">
                {{ config.public.BASE_URL }}resident/invite/register/{{ id }}
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="1">
                <v-row no-gutters class="fill-height" align-content="center">
                  <v-avatar size="small" @click="copyRegistrationLink">
                    <v-img
                      style="margin: auto 0"
                      max-height="200"
                      max-width="200"
                      :src="imgSrcCopy"
                    />
                  </v-avatar>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="12" class="mt-6">
          <v-card
            :color="cardColor"
            class="card-color"
            flat
            :style="`
                    border-radius: 4px;
                    padding: 8px 16px 0px 16px;
                    border: 1px solid var(--black-004, rgba(0, 0, 0, 0.04));
                    opacity: ${dialog_share ? '0.3' : '1'}; ${
                      dialog_share ? 'background: #fff' : ''
                    };`"
          >
            <v-row no-gutters>
              <v-col cols="12" class="remarks" :color="textColor">
                Remarks
              </v-col>

              <v-col cols="12" class="message-content" :color="textColor">
                <div>
                  Hi <span class="text-capitalize"> {{ visitor.name }} </span>,
                  you have been invited to my unit:
                </div>

                <div class="mt-4" :color="textColor">
                  {{ visitor.blockName }}, {{ visitor.blockLevelName }},
                  {{ visitor.unitName }}
                </div>

                <div class="mt-4">Invited for {{ checkIn }}</div>

                <div class="mt-4">
                  Your QR code validity: {{ checkIn }} until 11:59 pm
                </div>

                <!-- <div class="mt-4">
                  Please register yourself with the link below:
                </div> -->

                <div class="mt-4">Link:</div>

                <nuxt-link
                  :to="{
                    name: 'resident-invite-register-id',
                    params: { id: id },
                  }"
                  class="message-content-pre-register-link text-decoration-none mb-3"
                  target="_blank"
                >
                  {{ config.public.BASE_URL }}resident/invite/register/{{ id }}
                </nuxt-link>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <!-- back and share -->
        <v-col cols="12" class="mt-8">
          <v-row no-gutters>
            <v-col cols="6" class="pr-2" v-if="backValue == 'false'">
              <v-btn
                block
                flat
                color="#EB261E"
                @click="goBack()"
                class="button"
                style="border: 1px solid var(--black-02, rgba(0, 0, 0, 0.2))"
              >
                Back
              </v-btn>
            </v-col>

            <v-col :cols="backValue == 'false' ? 6 : 12" class="pl-2 text-end">
              <v-menu
                v-model="dialog_share"
                :close-on-content-click="false"
                location="end"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    block
                    color="#EB261E"
                    flat
                    class="button"
                    :style="`opacity: ${dialog_share ? '0.3' : '1'};`"
                    @click="share"
                  >
                    Share
                  </v-btn>
                </template>

                <v-card min-width="300">
                  <v-row no-gutters class="pa-6">
                    <v-col cols="11" class="share"> Share </v-col>
                    <v-col cols="1">
                      <v-icon size="small" @click="dialog_share = false">
                        mdi-close-circle-outline
                      </v-icon>
                    </v-col>
                    <v-col cols="12" class="as-a-message mt-2">
                      As a message
                    </v-col>

                    <!-- messaging apps -->
                    <template
                      v-for="messagingApp in messagingApps"
                      :key="messagingApp.icon"
                    >
                      <v-col cols="3" class="mt-3">
                        <v-row no-gutters>
                          <v-col cols="12">
                            <v-card
                              flat
                              class="card-menu-items"
                              :style="`background: ${messagingApp.background}`"
                              @click=""
                            >
                              <v-row no-gutters>
                                <v-img
                                  :src="`/icons/resident/home/invite-visitor/messaging-apps/${messagingApp.icon}.png`"
                                  class="menu-icon"
                                ></v-img>
                              </v-row>
                            </v-card>
                          </v-col>
                          <v-col cols="12" class="app-name mt-2">
                            {{ messagingApp.name }}
                          </v-col>
                        </v-row>
                      </v-col>
                    </template>

                    <v-col cols="12" class="or-copy-link mt-4">
                      or copy link
                    </v-col>
                    <v-col cols="12" class="mt-2">
                      <v-row
                        no-gutters
                        class="fill-height"
                        align-content="center"
                      >
                        <v-col cols="9">
                          <v-card flat class="dialog-share-pre-register-link">
                            {{
                              config.public.BASE_URL
                            }}resident/invite/register/{{ id }}
                          </v-card>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="2">
                          <v-btn
                            class="font-weight-bold mb-1"
                            flat
                            size="x-small"
                            color="#F3D74C"
                            @click="copyRegistrationLink"
                          >
                            copy
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
definePageMeta({
  // layout: "only-footer-without-header",
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

const { theme } = useLocal();

const config = useRuntimeConfig();

const { visitor, getVisitorById, setVisitor } = useVisitor();
const { setSnackbar } = useLocal();
const id = computed(() => useRoute().params.id as string);

const checkIn = ref("");
const startTime = ref("");
const endTime = ref("");
const textHeader = ref("");
const visitorType = ref("");

const backValue = ref("");

onMounted(async () => {
  // fetch visitor by id
  backValue.value = useRoute().query.back;

  if (!theme.value) theme.value = "light";
  const visitor = await getVisitorById(id.value);
  setVisitor(visitor);

  // format checkIn
  const options = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  visitorType.value = localStorage.getItem("Visitor type");
  textHeader.value = visitorType.value ?? "";

  checkIn.value = new Date(visitor.checkIn).toLocaleString("en-GB", options);
  startTime.value = new Date(visitor.checkIn).toLocaleString("en-GB", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  endTime.value = addHours(
    new Date(visitor.checkIn),
    visitor.duration,
  ).toLocaleString("en-GB", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
});

function addHours(date, hours) {
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);

  return date;
}

const dialog_share = ref(false);

const messagingApps = [
  {
    background: "rgba(68, 138, 255, 0.25);",
    icon: "messenger",
    name: "Messenger",
  },
  {
    background: "rgba(64, 195, 81, 0.25);",
    icon: "whatsapp",
    name: "WhatsApp",
  },
  {
    background: "rgba(41, 182, 246, 0.25);",
    icon: "telegram",
    name: "Telegram",
  },
  {
    background: "rgba(139, 195, 74, 0.25);",
    icon: "wechat",
    name: "WeChat",
  },
];

function copyRegistrationLink() {
  navigator.clipboard.writeText(
    `${config.public.BASE_URL}resident/invite/register/${id.value}`,
  );
  setSnackbar({
    text: "Link copied",
    modal: true,
  });
}

async function share() {
  navigator.share({
    title: "Visitor Invitation Link",
    text: `Hi ${visitor.value.name}, you have been invited to my unit:
    ${visitor.value.blockName}, ${visitor.value.blockLevelName}, ${visitor.value.unitName}.
    
    Invited for ${checkIn.value}.
    Your QR code validity: ${checkIn.value} until 11:59 PM.
    
    Link:`,
    url: `${config.public.BASE_URL}resident/invite/register/${id.value}`,
  });
}

function goBack() {
  if (backValue.value === "false") {
    useRouter().push({ name: "resident-my-visitor" });
  } else {
    useRouter().push({ name: "resident-invite-visitor-form" });
  }
}
function cancel() {
  useRouter().push({ name: "resident" });
}

const imgSrc = computed(() =>
  theme.value === "dark"
    ? "/dark-mode/forgot-password/images/dark-mode-up.svg"
    : "/dark-mode/forgot-password/images/light-mode-up.svg",
);

const BackIconimgSrc = computed(() =>
  theme.value === "dark"
    ? "/dark-mode/forgot-password/images/back.svg"
    : "/dark-mode/forgot-password/images/back-light.svg",
);

const baseColor = computed(() =>
  theme.value === "dark" ? "#FAFAFAFA" : "#111723",
);

const bgColor = computed(() =>
  theme.value === "dark" ? "#111723" : "#FAFAFAFA",
);

const cardColor = computed(() =>
  theme.value === "dark" ? "#111723" : "#FFFFFF",
);
const textColor = computed(() =>
  theme.value === "dark" ? "#DFE2E9" : "#0F131C",
);

const imgSrcCopy = computed(() =>
  theme.value === "dark"
    ? "/dark-mode/invite-visitor/copy.svg"
    : "/dark-mode/invite-visitor/copy-light.svg",
);

const SrcImage = computed(() => {
  if (textHeader.value === "guest") {
    return theme.value === "dark"
      ? "/dark-mode/invite-visitor/drive-in-dark.png"
      : "/dark-mode/invite-visitor/drive-in.png";
  } else {
    return theme.value === "dark"
      ? "/dark-mode/invite-visitor/walk-in-dark.png"
      : "/dark-mode/invite-visitor/walk-in.png";
  }
});
</script>

<style scoped>
.title {
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
}

.subtitle {
  font-size: 16px;
  font-weight: 400;
  line-height: 30px;
}

.pre-register-label {
  font-size: 10px;
  font-weight: 400;
  line-height: 19px;
}

.pre-register-link {
  font-size: 18.176px;
  font-weight: 400;
  letter-spacing: -0.341px;
}

.message-content {
  font-size: 17.176px;
  font-weight: 400;
  letter-spacing: -0.341px;
}

.remarks {
  font-size: 10px;
  font-weight: 400;
  line-height: 19px;
}

.message-content-pre-register-link {
  color: var(--black-038, var(--Primary, #eb261e));
  font-size: 18.176px;
  font-weight: 400;
  letter-spacing: -0.341px;
}

.card-menu-items {
  padding: 6.118px;
  align-items: center;
  gap: 6.118px;
  border-radius: 6.118px;
  width: 48.4974px;
  height: 48.4974px;
}

.menu-icon {
  width: 36.711px;
  height: 36.711px;
}

.app-name {
  color: #363636;
  font-family: Verdana;
  font-size: 9.178px;
  font-weight: 400;
}

.button {
  width: 178px;
  height: 48px;
}

.share {
  color: #363636;
  font-family: Verdana;
  font-size: 18.355px;
  font-weight: 700;
}

.as-a-message {
  color: #363636;
  font-family: Verdana;
  font-size: 9.178px;
  font-weight: 700;
}

.or-copy-link {
  color: #363636;
  font-family: Verdana;
  font-size: 9.178px;
  font-weight: 700;
}

.dialog-share-pre-register-link {
  display: flex;
  height: 23px;
  padding: 6.118px;
  align-items: center;
  gap: 6.118px;
  border-radius: 6.118px;
  background: rgba(0, 0, 0, 0.05);
  color: #363636;
  text-align: center;
  font-family: Verdana;
  font-size: 9.178px;
  font-weight: 400;
}

.card-color {
  border: 1px solid var(--Primary, #eb261e);

  /* button-s-red */
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}
</style>
