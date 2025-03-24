<template>
  <v-card
    class="mb-3"
    style="width: 100% !important"
    elevation="0"
    link
    :color="
      $vuetify.theme.current.dark
        ? record.user?.hasRead
          ? '#212529'
          : '#2C2C2C'
        : record.user?.hasRead
          ? '#f8f9fa'
          : '#ecf8fe'
    "
    v-if="record"
    @click="redirectNotification(record)"
  >
    <v-card-text>
      <v-row no-gutters class="align-center">
        <v-col cols="10">
          <v-list class="bg-transparent">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon class="rounded-icon">mdi-bell-outline</v-icon>
              </template>

              <v-list-item-title>{{
                _messageHeader(record)
              }}</v-list-item-title>
              <v-list-item-subtitle>{{
                _messageSubHeader(record)
              }}</v-list-item-subtitle>
              <span class="mr-3" v-if="$vuetify.display.smAndDown">
                {{ formatDate(record.createdAt) }}</span
              >
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="2">
          <v-row align="center" justify="end" class="mr-3">
            <span class="mr-3" v-if="$vuetify.display.mdAndUp">
              {{ formatDate(record.createdAt) }}</span
            >

            <v-menu @click.stop>
              <template v-slot:activator="{ props }">
                <v-icon
                  density="compact"
                  v-bind="props"
                  class="pa-4 border-md rounded-xl"
                >
                  mdi-dots-vertical
                </v-icon>
              </template>

              <v-list>
                <v-list-item @click="updateNotification(record)">
                  <template #title>
                    <span class="text-caption">
                      <span>Mark as Read</span>
                    </span>
                  </template>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import moment from "moment";

const props = defineProps({
  record: {
    type: [Object, Array],
  },
});

const { standardFormatDate } = useUtils();

const _messageHeader = (record: any) => {
  let msg = "";
  switch (record.module) {
    case "announcement":
      msg = `You have new announcement received`;
      break;
    case "work-order":
      msg = `You have new work order`;
      break;
    case "visitor":
      msg = `Incoming Visitor`;
      break;
  }
  switch (record.event) {
    case "new-calendar":
      msg = `You have a new calendar event created`;
      break;
    case "update-calendar":
      msg = `A recent calendar event has been updated`;
      break;
    case "added-assignee-calendar":
      msg = `You have been assigned to a calendar event`;
      break;
    case "removed-assignee-calendar":
      msg = `You have been removed to a calendar event`;
      break;

    case "new-pending-approval-resident":
      msg = `You have a new pending approval for a resident`;
      break;
    case "new-pending-approval-review-resident":
      msg = `You have a new pending approval/resubmitted to review for a resident`;
      break;
    case "request-account-deletion":
      msg = `You have a new request for an account deletion from a resident`;
      break;
    case "new-incident":
      msg = `You received an Incident Report.`;
      break;
    case "approved-incident":
      msg = `Your Incident Report has been approved.`;
      break;
    case "rejected-incident":
      msg = `Your Incident Report has been rejected.`;
      break;
    case "updated-feedback":
      msg = `Feedback Status Update.`;
      break;
    case "new-pending-booked-slot-request":
      msg = `You have a new pending facility booked slot request.`;
      break;
    case "updated-booked-slot-request-status-by-resident":
      msg = `A facility booked slot has just been ${record.data?.status} by a resident.`;
      break;
    case "new-pending-overnight-parking-approval":
      msg = `You have a new pending overnight parking request from a visitor.`;
      break;
    case "new-feedback":
      msg = `You have a new feedback from a resident.`;
      break;
    case "feedback-message":
      msg = `You have a new feedback notification.`;
      break;
    case "unreturned-contractor-passkeys":
      msg = `Unreturned Passkeys`;
      break;
    case "visitor-allotted-time-limit":
      msg = `Visitor still in Establishment`;
      break;
    case "contractor-allotted-time-limit":
      msg = `Contractor still in Establishment`;
      break;
    default:
      break;
  }
  return msg;
};

const _messageSubHeader = (record: any) => {
  let msg = "";
  switch (record.module) {
    case "announcement":
      msg = `${record.data?.title} announcement has been created`;
      break;
    case "work-order":
      msg = `${record.data?.subject} word order has been created `;
      break;
    case "visitor":
      msg = `new visitor with a plate number ${record.data?.plateNumber} coming to your place`;
      break;
  }
  switch (record.event) {
    case "new-calendar":
      msg = `You have a new calendar event called ${record.data?.title} created`;
      break;
    case "update-calendar":
      msg = `A recent calendar event called ${record.data?.title} has been updated`;
      break;
    case "added-assignee-calendar":
      msg = `You have been assigned to a calendar event called ${record.data?.title}`;
      break;
    case "removed-assignee-calendar":
      msg = `You have been removed to a calendar event called ${record.data?.title}`;
      break;

    case "new-pending-approval-resident":
      msg = `You have a new pending approval for a resident who is ${record.data?.givenName} ${record.data?.surname}`;
      break;
    case "new-pending-approval-review-resident":
      msg = `You have a new pending approval/resubmitted to review for a resident who is ${record.data?.givenName} ${record.data?.surname}`;
      break;
    case "request-account-deletion":
      msg = `You have a new request for an account deletion from a resident who is ${record.data?.givenName} ${record.data?.surname}`;
      break;
    case "new-incident":
      msg = `Your Incident Report: ${record.data.reportId} has been created.`;
      break;
    case "approved-incident":
      msg = `Your Incident Report: ${record.data.reportId} has been approved.`;
      break;
    case "rejected-incident":
      msg = `Your Incident Report: ${record.data.reportId} has been rejected.`;
      break;
    case "updated-feedback":
      msg = `Hello, your feedback for ${record.data?.subject} has been updated to ${record.data?.status}.`;
      break;
    case "new-pending-booked-slot-request":
      msg = `You have a new pending booked slot request for the ${record.data?.facilityName} from ${record.data?.givenName} ${record.data?.surname} scheduled on ${standardFormatDate(record.data?.date)} at ${record.data?.slotName}.`;
      break;
    case "updated-booked-slot-request-status-by-resident":
      msg = `A resident who is ${record.data?.givenName} ${record.data?.surname} just ${record.data?.status} his/her booked slot for the ${record.data?.facilityName} scheduled on ${standardFormatDate(record.data?.date)} at ${record.data?.slotName}.`;
      break;
    case "new-pending-overnight-parking-approval":
      msg = `You have a new pending approval for an overnight parking request from a visitor who is ${record.data?.firstName} ${record.data?.lastName} invited by ${record.data?.residentName}. The visitor is scheduled to arrive on ${standardFormatDate(record.data?.checkIn)} at ${record.data?.arrivalTime}.`;
      break;
    case "new-feedback":
      msg = `You have a new feedback from a resident. Subject: ${record.data?.subject}`;
      break;
    case "feedback-message":
      msg = record.data?.message;
      break;
    case "unreturned-contractor-passkeys":
      msg = `There are ${record.data.length} unreturned contractor passkeys.`;
      break;
    case "visitor-allotted-time-limit":
      msg = `Hello, ${record.data?.firstName ? `${record.data?.firstName} ` : ``}${
        record.data?.lastName ? `${record.data?.lastName}` : ``
      } is still in the establishment, thank you.`;
      break;
    case "contractor-allotted-time-limit":
      msg = `Hello, ${record.data?.firstName ? `${record.data?.firstName} ` : ``}${
        record.data?.lastName ? `${record.data?.lastName}` : ``
      } is still in the establishment, thank you.`;
      break;
    default:
      break;
  }
  return msg;
};

const emit = defineEmits(["updateNotification", "redirectNotification"]);

const formatDate = (date: any) => {
  return moment(date).fromNow();
};

const updateNotification = (record: any) => {
  emit("updateNotification", record);
  record.user.hasRead = true;
};

const redirectNotification = (record: any) => {
  emit("redirectNotification", record);
};
</script>
