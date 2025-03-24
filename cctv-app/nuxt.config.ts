// https://nuxt.com/docs/api/configuration/nuxt-config

import { primaryTheme, vuetifyDefaults } from "./vuetify.options";

export default defineNuxtConfig({
  devtools: { enabled: false },
  compatibilityDate: "2024-07-15",
  extends: [
    [
      `${process.env.BASE_LAYER}`,
      { install: true, auth: process.env.GITHUB_TOKEN },
    ],
  ],
  css: ["vuetify/styles", "@/assets/css/main.css"],
  imports: {
    dirs: ["composables/**", "types/**"], // Adjusted to include nested directories
  },
  modules: ["@vite-pwa/nuxt", "vuetify-nuxt-module", "nuxt-proxy"],
  vuetify: {
    vuetifyOptions: {
      theme: {
        themes: {
          light: primaryTheme,
        },
      },
      defaults: vuetifyDefaults,
    },
  },
  pwa: {
    manifest: {
      name: "Sky-I | Seven365",
      short_name: "Sky-I | Seven365",
      description: "Sky-I | Seven365",
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
      DOMAIN: (process.env.DOMAIN || "localhost") as string,
      BASE_URL: (process.env.BASE_URL as string) || "",
      API_REAL_TIME: process.env.API_REAL_TIME as string,
      SERVICE_ACCOUNT: process.env.SERVICE_ACCOUNT as string,
      CRYPTO_ENCRYPTION_KEY: process.env.ENCRYPTION_KEY as string,
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
        target: (process.env.API_DOB || "http://localhost:4010") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/occurrences": "/api/occurrences",
        },
        pathFilter: [
          "/api/occurrences",
        ],
      },
      {
        target: (process.env.API_STORAGE || "http://localhost:4009") as string,
        changeOrigin: true,
        pathRewrite: {
          "^/api/files": "/api/files",
          "^/api/storage": "/api/storage",
        },
        pathFilter: ["/api/files", "/api/storage"],
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
    ],
  },
});
