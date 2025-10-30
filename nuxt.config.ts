export default defineNuxtConfig({
  // Core settings
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // App settings
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },

  // Styling & UI
  css: ["~/assets/css/main.css"],

  // Modules & configuration
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/device",
  ],
  image: {
    format: ["webp"],
  },
});