<script setup lang="ts">
const props = defineProps({
  visitor: Object,
  qrCodeUrl: String,
  // name: String,
  // nric: String, //this field can be either nric or passport number
  // address: String, //this field is tenant/address
  // phone: String,
  // email: String,
  // vehiclePlateNumber: String,
  overnightParking: Boolean,
  // arrivalDate: Date,
  // arrivalTime: Number,
  // duration: String,
  // remarks: String, //this is purpose of visit but remarks on database
  // actualactualCheckIn: Number,
  // actualactualCheckOut: Number,
});
// const arrivalDateFormatted = computed(() => {
//   return props.visitor?.checkIn
//     ? new Date(props.visitor?.checkIn).toLocaleDateString()
//     : "Arrival Date";
// });

const arrivalDateFormatted = computed(() => {
  return props.visitor?.checkIn
    ? new Date(props.visitor?.checkIn).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Arrival Date";
});

import QrcodeVue from "qrcode.vue";
import type { Level, RenderAs } from "qrcode.vue";
const { theme } = useLocal();
const { maskString, standardFormatTime } = useUtils();

const value = computed<typeof props.qrCodeUrl>(() => props.qrCodeUrl);
const level = ref<Level>("L");
const renderAs = ref<RenderAs>("svg");
const tableData = ref([
  {
    label: "Name",
    value: props.visitor?.name ?? "Name",
    requireType: "",
  },
  // {
  //   label: "NRIC/Passport/ID No.",
  //   value: props.visitor?.nric
  //     ? maskString(props.visitor.nric, {
  //         startingLength: 0,
  //         lastLength: props.visitor.nric.length / 4,
  //         staticMaskLength: 4,
  //         isNricMask: true,
  //       })
  //     : props.visitor?.nric ?? "NRIC",
  //   requireType: "",
  // },
  {
    label: "Tenant/Resident Address",
    value: `${props.visitor?.blockName} ${props.visitor?.blockLevelName} ${props.visitor?.unitName} `,
    requireType: "",
  },
  {
    label: "Contact No.",
    value: props.visitor?.phoneNumber ?? "Contact Number",
    requireType: "",
  },
  {
    label: "Email",
    value: props.visitor?.email ?? "Email Address",
    requireType: "",
  },
  {
    label: "Vehicle Plate No.",
    value: props.visitor?.plateNumber ?? "Vehicle Plate No.",
    requireType: props.visitor?.plateNumber && "drive-in",
  },
  {
    label: "Overnight Parking",
    value: props.overnightParking ? "Yes" : "No",
    requireType: props.visitor?.plateNumber && "drive-in",
  },
  {
    label: "Arrival Date",
    value: arrivalDateFormatted,
    requireType: "",
  },
  {
    label: "Arrival Time",
    value: props.visitor?.arrivalTime ?? "Arrival Time",
    requireType: "",
  },
  {
    label: "Duration",
    // value: props.visitor?.duration + ` Hour(s)` ?? "Duration",
    value: props.visitor?.duration
      ? `${props.visitor?.duration} Hour(s)`
      : "N/A",
    requireType: "",
  },
  ...(props?.overnightParking && props?.visitor?.overnightParking
    ? [
        {
          label: "Overnight Parking",
          value:
            props?.visitor?.overnightParking.status.charAt(0).toUpperCase() +
            props?.visitor?.overnightParking.status.slice(1),
          requireType: "",
        },
      ]
    : []),
  // ...(props?.overnightParking
  //   ? [
  //       {
  //         label: "Overnight Parking",
  //         value:
  //           props?.visitor?.overnightParking.status.charAt(0).toUpperCase() +
  //           props?.visitor?.overnightParking.status.slice(1),
  //         requireType: "",
  //       },
  //     ]
  //   : []),
  // ...(props?.visitor?.numberOfPassenger
  //   ? [
  //       {
  //         label: "Number of Passenger",
  //         value: props?.visitor?.numberOfPassenger,
  //         requireType: "",
  //       },
  //     ]
  //   : []),

  ...(props?.visitor?.isOvernightParking !== null
    ? [
        {
          label: "Number of Passenger",
          value: props?.visitor?.numberOfPassenger || 0,
          requireType: "",
        },
      ]
    : []),
  {
    label: "Purpose of Visit",
    value: props.visitor?.remarks ?? "Purpose of Visit",
    requireType: "",
  },
]);

onMounted(async () => {
  if (!theme.value) theme.value = "light";
});

const textColor = computed(() =>
  theme.value === "dark" ? "#FFFFFF" : "#0F131C",
);

const textColorGray = computed(() =>
  theme.value === "dark" ? "#555E6F" : "#555E6F",
);

const colorCard = computed(() =>
  theme.value === "dark" ? "#111723" : "#FFFFFF",
);

const borderStyle = computed(() =>
  theme.value === "dark" ? "1px solid #555E6F" : "none",
);

const boxShadowStyle = computed(() =>
  theme.value === "dark"
    ? "0px 0px 18px 0px rgba(255, 255, 255, 0.10)"
    : "0px 5px 14px 0px rgba(15, 14, 20, 0.10)",
);

const cardColor = computed(() =>
  theme.value === "dark" ? "#111723" : "#FFFFFF",
);

const cardClass = computed(() =>
  theme.value === "dark"
    ? "mx-2 my-8  style-card timer-card"
    : "mx-2 my-8 timer-card card-color",
);
</script>
<template>
  <v-row no-gutters class="pa-6" justify="center">
    <v-col cols="12" class="mb-4">
      <p class="text-heading text-center pa-4" :style="{ color: textColor }">
        Hey
        {{
          $props.visitor?.firstName
            ? $props.visitor?.firstName
            : $props.visitor?.lastName
        }},
      </p>
      <p class="text-content text-center" :style="{ color: textColorGray }">
        You are now ready to check in upon arrival on {{ arrivalDateFormatted }}
      </p>
    </v-col>

    <v-card class="qrcode-card text-center" flat>
      <qrcode-vue
        :value="value"
        :level="level"
        :render-as="renderAs"
        :size="250"
      />
    </v-card>

    <v-col cols="12" class="mt-8" v-if="!$props.visitor?.plateNumber">
      <p class="text-content text-center" :style="{ color: textColorGray }">
        Please present the QR code sent to you at the pedestrian entrance for
        access.
      </p>
    </v-col>

    <v-col cols="12" class="mt-8" v-else>
      <p
        class="text-content text-center pb-4 px-6"
        :style="{ color: textColorGray }"
      >
        You have 2 convenient options for check-in:
      </p>

      <v-card class="style-card" flat :color="colorCard">
        <div class="">
          <v-avatar class="ml-3 mt-3 mb-3" size="small" color="red">
            <span class="text-h5">1</span>
          </v-avatar>

          <p
            class="text-content px-5 pb-3 text-justify"
            :style="{ color: textColor }"
          >
            QR Code Entry: Please present the QR code sent to you at the
            pedestrian entrance for access.
          </p>
        </div>
      </v-card>

      <v-card class="style-card mt-6" flat :color="colorCard">
        <div class="">
          <v-avatar class="ml-3 mt-3 mb-3" size="small" color="red">
            <span class="text-h5">2</span>
          </v-avatar>

          <p
            class="text-content px-5 pb-3 text-justify"
            :style="{ color: textColor }"
          >
            Automatic Vehicle Entry: If arriving by vehicle, simply drive up to
            the boom gate. It will automatically recognize your vehicle's
            registered details given and grant access.
          </p>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" class="mt-6 pa-4 visitor-information">
      <p class="text-h5 text-white text-center" :style="{ color: textColor }">
        Visitor Information
      </p>
    </v-col>

    <v-row no-gutters class="text-center" v-if="$props.visitor?.actualCheckIn">
      <v-col>
        <v-card
          class="mx-2 my-8 timer-card"
          flat
          :class="cardClass"
          :style="{ backgroundColor: colorCard }"
        >
          <v-card-text>
            <p class="text-check-time-value" style="color: #eb261e">
              {{ standardFormatTime(props.visitor?.actualCheckIn) ?? "N/A" }}
            </p>
            <p class="text-check-time">Actual Check In</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          class="mx-2 my-8 timer-card card-color"
          flat
          :style="{ backgroundColor: colorCard }"
        >
          <v-card-text>
            <p
              class="text-check-time-value"
              :style="
                standardFormatTime(props.visitor?.actualCheckOut)
                  ? 'color: #EB261E'
                  : 'color: #EB261E'
              "
            >
              {{
                (props.visitor?.actualCheckOut &&
                  standardFormatTime(props.visitor?.actualCheckOut)) ??
                "N/A"
              }}
            </p>
            <p class="text-check-time">Actual Check Out</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-col cols="12" class="mt-4">
      <v-table
        :style="{
          backgroundColor: colorCard,
          borderRadius: '10px',
          boxShadow: boxShadowStyle,
          border: borderStyle,
        }"
      >
        <tbody>
          <tr v-for="(data, index) in tableData" :key="index">
            <template v-if="data.label !== 'Purpose of Visit'">
              <template v-if="data.requireType === 'drive-in'">
                <td class="text-table-content" :style="{ color: textColor }">
                  {{ data.label }}
                </td>
                <td class="text-table-content-value text-right">
                  {{
                    data.label === "Number of Passenger"
                      ? data.value || 0
                      : data.value || "N/A"
                  }}
                </td>
              </template>
              <template v-else-if="data.requireType === ''">
                <td class="text-table-content" :style="{ color: textColor }">
                  {{ data.label }}
                </td>
                <td class="text-table-content-value text-right">
                  {{
                    data.label === "Number of Passenger"
                      ? data.value || 0
                      : data.value || "N/A"
                  }}
                </td>
              </template>
            </template>
            <!-- <template v-if="data.label !== 'Purpose of Visit'">
              <template v-if="data.requireType === 'drive-in'">
                <td class="text-table-content" :style="{ color: textColor }">
                  {{ data.label }}
                </td>
                <td class="text-table-content-value text-right">
                  {{ data.value ? data.value : "N/A" }}
                </td>
              </template>
              <template v-else-if="data.requireType === ''">
                <td class="text-table-content" :style="{ color: textColor }">
                  {{ data.label }}
                </td>
                <td class="text-table-content-value text-right">
                  {{ data.value ? data.value : "N/A" }}
                </td>
              </template>
            </template> -->
            <template v-else>
              <td class="text-table-content" :style="{ color: textColor }">
                {{ data.label }}
                <p class="text-table-content-value">
                  {{ data.value ? data.value : "N/A" }}
                </p>
              </td>
            </template>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>
<style scoped>
.qrcode-card {
  font-size: 12px;
  line-height: 24px;
  border: 1px solid #f2f2f2;
  border-radius: 16px;
  padding: 42px;
  background: #fff;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}

.timer-card {
  border: 1px solid #f2f2f2;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}

.text-heading {
  color: #052439;
  font-weight: 600;
  font-size: 32px;
  line-height: 30px;
  /* 150% */
}

.text-content {
  color: #052439;
  font-weight: 400;
  font-size: 16px;
  font-style: normal;
  line-height: 30px;
  word-spacing: 2px;
  /* 150% */
}

.text-table-content {
  color: #052439;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  /* 150% */
}

.text-table-content-value {
  color: #eb261e;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  /* 150% */
}

.text-check-time-value {
  font-weight: 500;
  font-size: 32px;
  line-height: 48px;
}

.text-check-time {
  font-weight: 400;
  font-size: 12px;
  line-height: 19px;
  /* 150% */
}

.visitor-information {
  background-color: #052439;
  border-radius: 16px;
}

.style-card {
  border-radius: 16px;
  background: #fff;

  border: 2px solid var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}

.card-color {
  border: 2px solid var(--Primary, #eb261e);

  /* button-s-red */
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}
</style>
