export default defineNuxtConfig({
  // Core settings
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // App settings
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      htmlAttrs: {
        lang: "da",
      },
    },
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
  icon: {
    clientBundle: {
      icons: [
        "material-symbols:computer-rounded",
        "material-symbols:video-camera-back-rounded",
        "material-symbols:dashboard-rounded",
        "material-symbols:lightbulb-2-rounded",
        "material-symbols:handshake-rounded",
        "material-symbols:mindfulness-rounded",
        "material-symbols:toys-and-games",
        "material-symbols:favorite-rounded",
        "material-symbols:cloud",
        "material-symbols:local-fire-department-rounded",
        "material-symbols:thumb-up-rounded",
        "material-symbols:bolt-rounded",
        "material-symbols:person-rounded",
        "material-symbols:explore-rounded",
        "material-symbols:sentiment-excited-rounded",
        "material-symbols:chess-rook-rounded",
        "material-symbols:movie-rounded",
        "material-symbols:music-note-rounded",
        "material-symbols:front-hand-rounded",
        "material-symbols:book-5-rounded",
      ],
      scan: false,
    },
  },
});
