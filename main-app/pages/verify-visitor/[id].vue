<template>
  <div :class="`fill-height background_img d-flex align-center`">
    <v-row no-gutters>
      <v-col cols="12">
        <v-card
          :width="$vuetify.display.lgAndUp ? '550px' : '94.5%'"
          color="navigationDrawer"
          :class="`pa-5 ${$vuetify.display.mdAndDown ? 'ml-3 mt-10' : 'ml-16'}`"
          rounded="xl"
          :loading="isVerifying"
        >
          <template v-slot:loader="{ isActive }">
            <v-progress-linear
              :active="isActive"
              color="orange"
              height="4"
              indeterminate
            ></v-progress-linear>
          </template>

          <v-card-title>
            <v-icon class="mr-2" :size="40">mdi-security</v-icon>
            <span v-if="isVerified === 1" class="header_title"
              >Generating QR Code</span
            >
            <span v-else class="header_title">Verify Visitor</span>
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="onVerifyCode()">
              <v-row class="h-100 align-center">
                <div
                  class="d-flex justify-center w-100 my-10 py-10"
                  v-if="isVerified <= 1"
                >
                  <v-progress-circular
                    :size="50"
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </div>

                <v-col cols="12" v-if="isVerified === 2">
                  <v-row class="text-start mt-2">
                    <v-col
                      cols="12"
                      md="6"
                      class="d-flex flex-column justify-center align-center ga-4"
                    >
                      <QrcodeVue
                        :value="qrCodeLink"
                        :size="$vuetify.display.mdAndUp ? 225 : 330"
                        level="M"
                        background="transparent"
                        foreground="white"
                      />
                      <v-btn
                        class="d-flex ga-1 px-3 rounded-pill reset-qr"
                        @click="generateNewQrCode()"
                      >
                        <v-icon icon="mdi-arrow-u-right-bottom"></v-icon>
                        <div>Reset QR Code</div>
                      </v-btn>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                      <v-row no-gutters>
                        <v-col cols="5" class="text-grey text-body-2">
                          Name
                        </v-col>
                        <v-col
                          cols="7"
                          class="text-body-2 font-weight-bold text-capitalize"
                        >
                          {{ visitor.firstName }} {{ visitor.lastName }}
                        </v-col>
                        <v-col cols="5" class="text-grey text-body-2">
                          Type
                        </v-col>
                        <v-col cols="7" class="text-body-2 font-weight-bold">
                          {{ visitor.type }}
                        </v-col>

                        <v-col cols="5" class="text-grey text-body-2">
                          ID
                        </v-col>
                        <v-col cols="7" class="text-body-2 font-weight-bold">
                          {{ visitor.nric.toUpperCase() }}
                        </v-col>

                        <v-col
                          cols="5"
                          class="text-grey text-body-2"
                          v-if="visitor?.plateNumber"
                        >
                          Vehicle Number
                        </v-col>
                        <v-col
                          cols="7"
                          class="text-body-2 font-weight-bold"
                          v-if="visitor?.plateNumber"
                        >
                          {{ visitor.plateNumber.toUpperCase() }}
                        </v-col>

                        <v-col cols="5" class="text-grey text-body-2">
                          {{ visitor.companyName ? "Company" : "Location" }}
                        </v-col>
                        <v-col
                          cols="7"
                          class="text-body-2 font-weight-bold text-capitalize"
                        >
                          {{
                            visitor.companyName
                              ? visitor.companyName
                              : `${visitor.blockName} / ${visitor.blockLevelName} / ${visitor.unitName}`
                          }}
                        </v-col>

                        <v-col cols="5" class="text-grey text-body-2">
                          Phone No.
                        </v-col>
                        <v-col
                          cols="7"
                          class="text-body-2 font-weight-bold text-capitalize"
                        >
                          {{ visitor.phoneNumber }}
                        </v-col>

                        <v-col cols="12">
                          <v-divider class="my-2" />
                        </v-col>

                        <v-col cols="5" class="text-grey text-body-2">
                          Check In
                        </v-col>
                        <v-col
                          cols="7"
                          class="text-body-2 font-weight-bold text-capitalize"
                        >
                          {{ standardFormatDateTime(visitor.checkIn) }}
                        </v-col>

                        <v-col cols="5" class="text-grey text-body-2">
                          Check Out
                        </v-col>
                        <v-col
                          cols="7"
                          class="text-body-2 font-weight-bold text-capitalize"
                        >
                          {{ standardFormatDateTime(visitor.checkOut) }}
                        </v-col>

                        <v-col cols="5" class="text-grey text-body-2">
                          Purpose of Visit
                        </v-col>
                        <v-col
                          cols="7"
                          class="text-body-2 font-weight-bold text-capitalize"
                        >
                          {{ visitor.remarks }}
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12">
                      <v-card
                        class="rounded-xl py-2 px-4 text-caption text-cyan-darken-3"
                        color="cyan-lighten-5"
                      >
                        This QR code is valid for 1 minute. This invitation can
                        only be accepted once.
                        <!-- Make sure both people have
                        selected the same region. -->
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
import QrcodeVue from "qrcode.vue";

definePageMeta({
  layout: "plain",
});

const { visitor, setVisitor, validateVisitorCode } = useVisitor();
const { formatDateAndTime, formatDateAndTimeSG, standardFormatDateTime } =
  useUtils();
const { setSnackbar } = useLocal();
const qrCodeLink = ref("");

const verificationCode = ref("");
const isVerified = ref(0);
const isVerifying = ref(false);

const id = useRoute().params.id;

onMounted(async () => {
  isVerified.value = 1;
  setTimeout(async () => {
    await onVerifyCode();
  }, 1000);
});

async function onVerifyCode() {
  isVerified.value = 1;
  try {
    isVerifying.value = true;
    const result = await validateVisitorCode(id);

    if (result?.status === "success") {
      isVerified.value = 2;

      qrCodeLink.value = `${window.location.origin}/visitors/qr-code/${id}/${result?.visitor?.qrCodeId}`;

      setVisitor(result.visitor);
    } else {
      await setSnackbar({ text: result.message as string, modal: true, type: "success" });
      isVerified.value = 1;
    }

    isVerifying.value = false;
  } catch (error) {
    await setSnackbar({ text: error as string, modal: true, type: "error" });
    isVerifying.value = false;
  }
}

async function generateNewQrCode() {
  isVerified.value = 1;
  setTimeout(async () => {
    onVerifyCode();
  }, 1000);
}
</script>
<style scoped>
.background_img {
  position: relative;
  background-size: 100% 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)),
    url('`${useRuntimeConfig().public.S3_BUCKET}/images/bg/keys-and-visitor-filter-bg.jpg`');
}

.header_title {
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
  position: relative;
  top: 5px;
}

:deep() .v-text-field input {
  font-size: 13px;
}

:deep() .v-field__field {
  font-size: 13px;
}

.reset-qr {
  font-weight: bold;
  cursor: pointer;
}

.reset-qr:hover {
  background-color: rgb(195, 195, 195);
  transition: all ease 0.1s;
}
</style>
