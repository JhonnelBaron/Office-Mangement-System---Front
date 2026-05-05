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
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  // 2. Nitro Configuration - Importante para sa Static Hosting (Hostinger)
  nitro: {
    prerender: {
      // Pinipilit si Nuxt na i-generate ang index.html sa root
      routes: ['/'] 
    },
    // Sinisigurado na ang output ay compatible sa standard static server
    serveStatic: true
  },

  experimental: {
    // KRITIKAL: Ito ang papatay sa "Cannot read properties of undefined (reading 'entries')" error.
    payloadExtraction: false 
  },

  runtimeConfig: {
    public: {
      // I-inject ang API URL mula sa GitHub Secrets
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '' 
    }
  },

  plugins: [
    '~/plugins/axios.js',
    '~/plugins/pusher.js',
  ],

  // Sinisigurado na walang conflict sa imports
  imports: {
    dirs: ['stores']
  }
})
