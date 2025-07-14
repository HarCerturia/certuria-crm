// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  devtools: { enabled: false },

  // domain driven architecture (best for CRM)
  extends: [
      './app/domains/core',
      './app/domains/self-disclosures',
      './app/domains/offers',
  ],

  // Hybrid Rendering optimized for performance
  routeRules: {
    '/': { ssr: true, prerender: false },
    '/dashboard': { ssr: false, prerender: false },
    '/self-disclosures/**': { ssr: false, prerender: false },
    '/offers/**': { ssr: false, prerender: false },
    '/admin/**': { ssr: false, prerender: false },
    '/_nuxt/**': { headers: { 'cache-control': 's-maxage=31536000' } },
    '/api/**': { cors: true },
  },

  runtimeConfig: {

    // Server-side only
    awApiKey: process.env.NUXT_APPWRITE_API_KEY,

    // Public (client + server)
    public: {

      // DocuSeal API Key (public for client-side usage)
      docusealApiKey: process.env.NUXT_DOCUSEAL_API_KEY,

      awEndpoint: process.env.NUXT_APPWRITE_ENDPOINT,
      awProject: process.env.NUXT_APPWRITE_PROJECT,

      // Database: Selbstauskünfte zur Trägerzulassung
      awDatabaseSelfDisclosuresTz: process.env.NUXT_APPWRITE_DATABASE_SELF_DISCLOSURES_TZ,
        // Self Disclosures Collections
        awSelfDisclosuresCollectionTzCompletedSubmissions: process.env.NUXT_APPWRITE_SELF_DISCLOSURES_COLLECTION_TZ_COMPLETED_SUBMISSIONS, // Abgeschlossene (Signierte) Einreichungen
        awSelfDisclosuresCollectionTzAllSubmissions: process.env.NUXT_APPWRITE_SELF_DISCLOSURES_COLLECTION_TZ_ALL_SUBMISSIONS, // ALLE Einreichungen

      // Database: Offers
      awDatabaseOffers: process.env.NUXT_APPWRITE_DATABASE_OFFERS,

    }
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],

  googleFonts: {
    families: {
      'Nunito+Sans': true,
      'Kumbh+Sans': true,
    },
  },

  css: ['~/assets/css/main.css'],

  experimental: {
    viewTransition: true
  },

  nitro: {
    experimental: {
      wasm: true
    },
    minify: true
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-11-27'
})
