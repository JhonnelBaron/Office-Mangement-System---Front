// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 1. Siguraduhing naka-false para sa SPA mode sa Hostinger
  ssr: false, 

  compatibilityDate: '2024-04-03',
  
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  app: {
    // Tinitiyak na sa root domain magsisimula ang lahat ng paths
    baseURL: '/',
    buildAssetsDir: '/_nuxt/',
  },

  experimental: {
    // KRITIKAL: Ito ang papatay sa "Cannot read properties of undefined (reading 'entries')" error.
    // Pinipigilan nito si Nuxt na maghanap ng maliliit na json files na madalas mag-404 sa Hostinger.
    payloadExtraction: false 
  },

  runtimeConfig: {
    public: {
      // @ts-ignore
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '' 
    }
  },

  plugins: [
    '~/plugins/axios.js',
    '~/plugins/pusher.js',
  ],
})
