// plugins/html5-qrcode.client.js
import { defineNuxtPlugin } from "#app";
import { Html5Qrcode } from "html5-qrcode";

export default defineNuxtPlugin((nuxtApp) => {
  // Attach Html5Qrcode to the global Vue instance
  nuxtApp.provide("Html5Qrcode", Html5Qrcode);
});
