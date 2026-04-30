// plugins/echo.client.js
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  window.Pusher = Pusher

  // Kunin ang token bago i-initialize ang Echo
  const token = localStorage.getItem('auth_token')
  const echo = new Echo({
    broadcaster: 'pusher',
    key: '3d3383452fb5db324a27',
    cluster: 'ap1',
    forceTLS: true,
    authEndpoint: `${config.public.apiBase}/broadcasting/auth`,
    auth: {
      headers: {
        // Tanggalin ang function wrapper, gawin nating string lang
        Authorization: token ? `Bearer ${token}` : '',
        Accept: 'application/json',
      },
    },
  })

  return { provide: { echo } }
})