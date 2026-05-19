// plugins/echo.client.js
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  window.Pusher = Pusher

  const tokenCookie = useCookie('auth_token')
  const token = tokenCookie.value
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