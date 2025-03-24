// nuxt.config.ts
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  css: ["vuetify/styles", "@/assets/css/main.css"],

  imports: {
    dirs: ["composables/**", "types/**"], // Adjusted to include nested directories
  },

  build: {
    transpile: ["vuetify"],
  },

  app: {
    head: {
      title: "Seven365 Suite",
      script: [
        {
          src: "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit",
        },
        {
          src: "https://pay.google.com/gp/p/js/pay.js",
          async: true,
        },
      ],
    },
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@nuxt/eslint",
    "@nuxt/image",
    "nuxt-proxy",
    "@vite-pwa/nuxt",
    "nuxt-papa-parse",
    "nuxt-signature-pad",
  ],

  papaparse: {
    global: true,
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  pwa: {
    manifest: {
      name: "Seven365",
      short_name: "Seven365",
      description: "Seven365",
      icons: [
        {
          src: "icons/pwa/64x64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "icons/pwa/144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "icons/pwa/192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "icons/pwa/512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
    },
  },

  runtimeConfig: {
    public: {
      S3_BUCKET: process.env.S3_BUCKET as string,
      API: process.env.API as string,
      API_WORK_ORDER: process.env.API_FEEDBACK as string,
      API_VISITOR: process.env.API_VISITOR as string,
      API_REAL_TIME: process.env.API_REAL_TIME as string,
      DOMAIN: (process.env.DOMAIN || "localhost") as string,
      BASE_URL: (process.env.BASE_URL as string) || "",
      CCTV_LINK: (process.env.CCTV_LINK as string) || "#",
      SERVICE_APP: (process.env.SERVICE_APP as string) || "",
      RESIDENT_APP: (process.env.RESIDENT_APP as string) || "",
      SERVICE_CALENDAR: (process.env.SERVICE_CALENDAR as string) || "",
      SERVICE_FEEDBACK: (process.env.SERVICE_FEEDBACK as string) || "",
      SERVICE_ANPR: (process.env.SERVICE_ANPR as string) || "",
      SERVICE_SKY_I: (process.env.SERVICE_SKY_I as string) || "",
      SERVICE_E_GUARD: (process.env.SERVICE_E_GUARD as string) || "",
      MERCHANT_ID: (process.env.MERCHANT_ID as string) || "",
      PAYMENT_GATEWAY: (process.env.PAYMENT_GATEWAY as string) || "",
      PAYMENT_GATEWAY_MERCHANT_ID:
        (process.env.PAYMENT_GATEWAY_MERCHANT_ID as string) || "",
      GOOGLE_PAY_ENVIRONMENT:
        (process.env.GOOGLE_PAY_ENVIRONMENT as string) || "",
      cookieConfig: {
        domain: (process.env.DOMAIN as string) ?? "",
        secure: true,
        maxAge: 30 * 24 * 60 * 60,
      },
    },
  },

  routeRules: {
    "/api/payment/**": { proxy: `${process.env.API_PAYMENT}/api/payment/**` },
    "/api/pet-records/**": {
      proxy: `${process.env.API_FORMS}/api/pet-records/**`,
    },
    "/api/renovation/**": {
      proxy: `${process.env.API_FORMS}/api/renovation/**`,
    },
    "/api/loui-records/**": {
      proxy: `${process.env.API_FORMS}/api/loui-records/**`,
    },
    "/api/renovation-refund/**": {
      proxy: `${process.env.API_FORMS}/api/renovation-refund/**`,
    },
    "/api/miod-records/**": {
      proxy: `${process.env.API_FORMS}/api/miod-records/**`,
    },
    "/api/eac-records/**": {
      proxy: `${process.env.API_FORMS}/api/eac-records/**`,
    },
    "/api/bike-parking-records/**": {
      proxy: `${process.env.API_FORMS}/api/bike-parking-records/**`,
    },
    "/api/vehicle-registration/**": {
      proxy: `${process.env.API_FORMS}/api/vehicle-registration/**`,
    },
    "/api/config-forms/**": {
      proxy: `${process.env.API_FORMS}/api/config-forms/**`,
    },
  },

  proxy: {
    options: [
      {
        target: (process.env.API || "http://localhost:4001") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/auth": "/api",
          "^/api/roles": "/api/roles",
          "^/api/module-list": "/api/module-list",
          "^/api/users": "/api/users",
          "^/api/verification": "/api/verification",
        },
        pathFilter: [
          "/api/auth",
          "/api/roles",
          "/api/module-list",
          "/api/users",
          "/api/verification",
        ],
      },
      {
        target: (process.env.API_ORGANIZATION ||
          "http://localhost:4002") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/organizations": "/api/organizations",
          "^/api/sites": "/api/sites",
          "^/api/service-providers": "/api/service-providers",
          "^/api/dashboard": "/api/dashboard",
          "^/api/keys": "/api/keys",
          "^/api/building-management": "/api/building-management",
          "^/api/site-collabs": "/api/site-collabs",
          "^/api/service-provider-groups": "/api/service-provider-groups",
          "^/api/announcements": "/api/announcements",
          "^/api/emergency-contacts": "/api/emergency-contacts",
          "^/api/qr-code-templates": "/api/qr-code-templates",
        },
        pathFilter: [
          "/api/organizations",
          "/api/sites",
          "/api/service-providers",
          "/api/dashboard",
          "/api/keys",
          "/api/building-management",
          "/api/site-collabs",
          "/api/service-provider-groups",
          "/api/announcements",
          "/api/emergency-contacts",
          "/api/qr-code-templates",
        ],
      },
      {
        target: (process.env.API_FEEDBACK || "http://localhost:4003") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/feedback": "/api/feedback",
          "^/api/work-orders": "/api/work-orders",
          "^/api/comments": "/api/comments",
          "^/api/notification-intervals": "/api/notification-intervals",
        },
        pathFilter: [
          "/api/feedback",
          "/api/work-orders",
          "/api/comments",
          "/api/notification-intervals",
        ],
      },
      {
        target: (process.env.API_EVENT || "http://localhost:4004") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/event": "/api/event",
        },
        pathFilter: ["/api/event"],
      },
      {
        target: (process.env.API_VISITOR || "http://localhost:4005") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/visitors": "/api/visitors",
          "^/api/overnight-parking-approval-settings":
            "/api/overnight-parking-approval-settings",
          "^/api/entrypass": "/api/entrypass",
        },
        pathFilter: [
          "/api/visitors",
          "/api/overnight-parking-approval-settings",
          "/api/entrypass",
        ],
      },
      {
        target: (process.env.API_CCTV || "http://localhost:4006") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/cctvs": "/api/cctvs",
        },
        pathFilter: ["/api/cctvs"],
      },
      {
        target: (process.env.API_ROUTE || "http://localhost:4007") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/routes": "/api/routes",
        },
        pathFilter: ["/api/routes"],
      },
      {
        target: (process.env.API_INCIDENT || "http://localhost:4008") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/incidents": "/api/incidents",
        },
        pathFilter: ["/api/incidents"],
      },
      {
        target: (process.env.API_STORAGE || "http://localhost:4009") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/files": "/api/files",
        },
        pathFilter: ["/api/files"],
      },
      {
        target: (process.env.API_DOB || "http://localhost:4010") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/occurrence-entries": "/api/occurrence-entries",
          "^/api/occurrences": "/api/occurrences",
          "^/api/subjects": "/api/subjects",
        },
        pathFilter: [
          "/api/occurrences",
          "/api/subjects",
          "/api/occurrence-entries",
        ],
      },
      {
        target: (process.env.API_FORMS || "http://localhost:4011") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/form": "/api/form",
        },
        pathFilter: ["/api/form"],
      },
      {
        target: (process.env.API_REAL_TIME ||
          "http://localhost:4012") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/notification": "/api/notification",
        },
        pathFilter: ["/api/notification"],
      },
      {
        target: (process.env.API_FACILITY || "http://localhost:4025") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/facilities": "/api/facilities",
          "^/api/facilities-settings": "/api/facilities-settings",
          "^/api/facilities-pdf": "/api/facilities-pdf",
        },
        pathFilter: [
          "/api/facilities",
          "/api/facilities-settings",
          "/api/facilities-pdf",
        ],
      },
    ],
  },

  compatibilityDate: "2025-02-20",
});