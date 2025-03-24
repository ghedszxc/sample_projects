import { defineNuxtPlugin } from '#app';
import { VTimePicker } from 'vuetify/labs/VTimePicker'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VTimePicker', VTimePicker);
});
