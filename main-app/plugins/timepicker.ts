import { defineNuxtPlugin } from '#app';
import VueTimepicker from 'vue3-timepicker'
import 'vue3-timepicker/dist/VueTimepicker.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VTimePicker', VueTimepicker);
});
