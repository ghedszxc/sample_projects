// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ["vuetify/styles", "@/assets/css/main.css"],
  imports: {
    dirs: ["composables/**", "types/**"], // Adjusted to include nested directories
  },
  build: {
    transpile: ["vuetify"],
  },
  plugins: [{ src: "~/plugins/fullcalendar.client.ts", mode: "client" }],
  app: {
    head: {
      title: "Resident | Seven365 Suite",
    },
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error: vuetify plugin type mismatch
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@nuxt/eslint",
    "@nuxtjs/i18n",
    "nuxt-proxy",
    "nuxt-signature-pad",
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  runtimeConfig: {
    public: {
      API: process.env.API as string,
      API_VISITOR: process.env.API_VISITOR as string,
      DOMAIN: (process.env.DOMAIN || "localhost") as string,
      MAIN_APP_URL: (process.env.MAIN_APP_URL || "localhost") as string,
      BASE_URL: (process.env.BASE_URL as string) || "",
      SERVICE_ACCOUNT: (process.env.SERVICE_ACCOUNT as string) || "",
      SERVICE_FEEDBACK: (process.env.SERVICE_FEEDBACK as string) || "",
      SERVICE_ANPR: (process.env.SERVICE_ANPR as string) || "",
      SERVICE_SKY_I: (process.env.SERVICE_SKY_I as string) || "",
      SERVICE_E_GUARD: (process.env.SERVICE_E_GUARD as string) || "",
    },
  },

  proxy: {
    options: [
      {
        target: process.env.API,
        changeOrigin: true,
        pathRewrite: {
          "^/api/auth": "/api/",
          "^/api/my-unit": "/api/my-unit",
          "^/api/users": "/api/users",
        },
        pathFilter: ["/api/auth", "/api/my-unit", "/api/users"],
      },
      {
        target: process.env.API_STORAGE,
        changeOrigin: true,
        pathRewrite: {
          "^/api/files": "/api/files",
        },
        pathFilter: ["/api/files"],
      },
      {
        target: process.env.API_ORGANIZATION,
        changeOrigin: true,
        pathRewrite: {
          "^/api/organizations": "/api/organizations",
          "^/api/sites": "/api/sites",
          "^/api/service-providers": "/api/service-providers",
          "^/api/dashboard": "/api/dashboard",
          "^/api/keys": "/api/keys",
          "^/api/building-management": "/api/building-management",
          "^/api/announcements": "/api/announcements",
          "^/api/emergency-contacts": "/api/emergency-contacts",
        },
        pathFilter: [
          "/api/organizations",
          "/api/sites",
          "/api/service-providers",
          "/api/dashboard",
          "/api/keys",
          "/api/building-management",
          "/api/announcements",
          "/api/emergency-contacts",
        ],
      },
      {
        target: process.env.API_VISITOR,
        changeOrigin: true,
        pathRewrite: {
          "^/api/visitors": "/api/visitors",
          "^/api/overnight-parking-approval-settings":
            "/api/overnight-parking-approval-settings",
        },
        pathFilter: [
          "/api/visitors",
          "/api/overnight-parking-approval-settings",
        ],
      },
      {
        target: (process.env.API_FORMS || "localhost") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/form": "/api/form",
          "^/api/pet-records": "/api/pet-records",
          "^/api/renovation": "/api/renovation",
          "^/api/loui-records": "/api/loui-records",
          "^/api/renovation-refund": "/api/renovation-refund",
          "^/api/miod-records": "/api/miod-records",
          "^/api/eac-records": "/api/eac-records",
          "^/api/bike-parking-records": "/api/bike-parking-records",
          "^/api/vehicle-registration": "/api/vehicle-registration",
        },
        pathFilter: [
          "/api/form",
          "/api/pet-records",
          "/api/renovation",
          "/api/loui-records",
          "/api/renovation-refund",
          "/api/miod-records",
          "/api/eac-records",
          "/api/bike-parking-records",
          "/api/vehicle-registration",
        ],
      },
      {
        target: process.env.API_VISITOR,
        changeOrigin: true,
        pathRewrite: {
          "^/api/visitors": "/api/visitors",
          "^/api/entrypass": "/api/entrypass",
        },
        pathFilter: ["/api/visitors", "/api/entrypass"],
      },
      {
        target: process.env.API_FEEDBACK,
        changeOrigin: true,
        pathRewrite: {
          "^/api/feedback": "/api/feedback",
        },
        pathFilter: ["/api/feedback"],
      },

      {
        target: (process.env.API_FACILITY || "http://localhost:4025") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/facilities": "/api/facilities",
          "^/api/facilities-settings": "/api/facilities-settings",
          "^/api/facilities-booking": "/api/facilities-booking",
        },
        pathFilter: [
          "/api/facilities",
          "/api/facilities-settings",
          "/api/facilities-booking",
        ],
      },
      {
        target: (process.env.API_BILLING || "http://localhost:4016") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/summary-of-account": "/api/summary-of-account",
          "^/api/unit-bill": "/api/unit-bill",
        },
        pathFilter: ["/api/summary-of-account", "/api/unit-bill"],
      },
    ],
  },
});
