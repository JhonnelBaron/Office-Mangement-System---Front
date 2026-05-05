// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // <--- Siguraduhin na false ito para sa Hostinger
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
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