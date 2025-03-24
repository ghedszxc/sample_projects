<template>
  <v-row no-gutters justify="center" class="py-md-8 h-100 h-md-auto">
    <v-col cols="12" md="6" class="font-weight-light mt-md-4">
      <v-card
        width="100%"
        height="100%"
        elevation="0"
        style="border-width: thin"
        min-height="368px"
      >
        <v-form v-model="isEventValid" @submit.prevent="submit()">
          <v-row no-gutters class="pa-8" justify="center">
            <v-col
              cols="12"
              class="text-h4 font-weight-bold mb-7 text-capitalize"
              style="letter-spacing: 2px !important"
            >
              <v-btn
                @click="goBack"
                class="rounded-xl"
                elevation="0"
              >
                <v-icon> mdi-arrow-left </v-icon></v-btn
              >
              Update Date
              <v-divider class="mt-2" />
            </v-col>

            <v-col cols="12" sm="12" md="6">
              <v-row :class="$vuetify.display.mdAndUp && 'pr-2'">
                <v-col cols="12">
                  <span class="font-weight-bold">Start Date</span>
                  <span class="text-red mx-1 mb-1">*</span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-text-field
                    v-model="startDate"
                    density="comfortable"
                    :rules="[requiredInput]"
                    type="date"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" sm="12" md="6">
              <v-row :class="$vuetify.display.mdAndUp && 'pl-2'">
                <v-col cols="12">
                  <span class="font-weight-bold">End Date</span>
                  <span class="text-red mx-1 mb-2">*</span>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-text-field
                    v-model="endDate"
                    density="comfortable"
                    :rules="[requiredInput]"
                    type="date"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-row no-gutters>
                <v-col cols="12" md="3" class="mr-md-2">
                  <v-btn
                    theme="dark"
                    class="font-weight-bold w-100 mb-2"
                    :disabled="!isEventValid"
                    type="submit"
                    :loading="loading"
                    color="primary"
                    variant="tonal"
                  >
                    submit
                  </v-btn>
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn
                    variant="outlined"
                    class="font-weight-bold w-100"
                    @click="cancel()"
                    color="red"
                  >
                    cancel
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

import moment from "moment-timezone";

const { setSnackbar } = useLocal();
const { requiredInput } = useUtils();
const { event, getEventById, setEvent, isEventValid, updateEvent } = useEvent();

const startDate = ref("");
const endDate = ref("");

const id = computed(() => useRoute().params.id as string);

const loading = ref(false);

onMounted(async () => {
  const result = await getEventById(id.value);
  setEvent(result);
  setFormateDates(result);
});

function dateStrToObj(data: string) {
  const [year, month, date] = data.split("-").map(Number);
  return new Date(year, month - 1, date);
}

function setFormateDates(data: any) {
  const getStartDate = new Date(data.start);
  const startFormat =
    getStartDate.getFullYear() +
    "-" +
    (getStartDate.getMonth() > 8
      ? getStartDate.getMonth() + 1
      : "0" + (getStartDate.getMonth() + 1)) +
    "-" +
    (getStartDate.getDate() > 9
      ? getStartDate.getDate()
      : "0" + getStartDate.getDate());
  startDate.value = startFormat;

  const getEndDate = new Date(data.end);
  const endFormat =
    getEndDate.getFullYear() +
    "-" +
    (getEndDate.getMonth() > 8
      ? getEndDate.getMonth() + 1
      : "0" + (getEndDate.getMonth() + 1)) +
    "-" +
    (getEndDate.getDate() > 9
      ? getEndDate.getDate()
      : "0" + getEndDate.getDate());
  endDate.value = endFormat;
}

function goBack() {
  useRouter().back();
}

async function cancel() {
  goBack();
}

async function submit() {
  loading.value = true;
  try {
    const checkStartDate = dateStrToObj(startDate.value);
    const checkEndDate = dateStrToObj(endDate.value);
    if (checkEndDate.valueOf() < checkStartDate.valueOf()) {
      setSnackbar({
        text: "End date must not be earlier than start date",
        modal: true,
        type: "warning",
      });
      return;
    } else {
      await updateEvent(id.value, {
        start: moment
          .tz(
            moment(new Date(startDate.value), "DD/MM/YYYY").startOf("day"),
            "Asia/Singapore",
          )
          .toDate(),
        end: moment
          .tz(
            moment(new Date(endDate.value), "DD/MM/YYYY").endOf("day"),
            "Asia/Singapore",
          )
          .toDate(),
      });
      goBack();
    }
    await updateEvent(id.value, { title: event.value.title });
    setSnackbar({ text: "Successfully Updated", modal: true, type: "success" });
    goBack();
  } catch (error: any) {
    setSnackbar({ text: error.message, type: "error", modal: true });
  } finally {
    loading.value = false;
  }
}
</script>
