import { defineNuxtPlugin } from '#app';
import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate';

export default defineNuxtPlugin((nuxtApp) => {
  // Register VeeValidate components
  nuxtApp.vueApp.component('VField', Field);
  nuxtApp.vueApp.component('VForm', Form);
  nuxtApp.vueApp.component('VErrorMessage', ErrorMessage);

});
