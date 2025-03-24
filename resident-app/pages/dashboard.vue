<template>
  <div>
    <v-row no-gutters class="fill-height pa-8" align-content="center">
      <v-col cols="12">
        <!-- ADD EVENT MODAL -->
        <add-event-modal />
        <!-- /ADD EVENT MODAL -->

        <FullCalendar :options="calendarOptions">
          <template #eventContent="{ event }">
            <a class="fc-event">{{ event.title }}</a>
          </template>
        </FullCalendar>
      </v-col>
    </v-row>
    <v-dialog
      v-model="showModal"
      width="600"
      max-width="90vh"
      :persistent="true"
    >
      <v-card>
        <v-card-title>
          <div class="text-h4 text-wrap">
            {{ selectedEvent?.title.toUpperCase() }}
          </div>
          <div class="text-subtitle-1 text-wrap">
            {{ selectedEvent?.date }}
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <v-badge
            color="info"
            :content="selectedEvent?.allDay ? `ALL DAY` : `NOT ALL DAY`"
            inline
          ></v-badge>
          <div
            class="text-body-1 mt-6 mb-6"
            v-html="selectedEvent?.extendedProps.description"
          ></div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="showModal = false">
            [Close]
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import AddEventModal from "~/components/event/add-modal.vue";

definePageMeta({
  middleware: "secure",
});

const showModal = ref(false);
const selectedEvent = ref<Record<string, any>>();

const showEventModal = <T extends Record<string, any>>(event: T) => {
  if (event && event.event) {
    console.log(event.event._def);
    showModal.value = true;
    selectedEvent.value = event.event._def;
  }
};
const calendarOptions = computed(() => {
  return {
    plugins: [dayGridPlugin, listPlugin],
    initialView: "dayGridMonth",
    eventClick: showEventModal,
    headerToolbar: {
      start: "prev,next today",
      center: "title",
      end: "dayGridMonth,dayGridWeek,dayGridDay,listMonth",
    },
    events: [
      {
        title: "Pool Cleaning",
        date: "2024-01-01",
        description:
          "Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
      },
      {
        title: "Security Checkup",
        date: "2024-01-02",
        description:
          "Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
      },
      {
        title: "Employee Health Tracker",
        date: "2024-01-02",
        description:
          "Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
      },
    ],
  };
});
</script>

<style scoped>
.fc-event {
  padding-left: 5px;
  cursor: pointer;
  width: 100%;
  display: block;
}
</style>
