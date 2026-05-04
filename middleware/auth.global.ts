// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('auth_token').value
  const userCookie = useCookie('user').value

  const publicPaths = ['/', '/login', '/register', '/reset-password', '/update-password', '/camtest']
  const allowedGlobalRoutes = ['/notifications', '/profile', '/unauthorized']

  // --- 1. GUEST CHECK ---
  // Kung walang token at wala sa public paths, balik sa login
  if (!token) {
    if (!publicPaths.includes(to.path)) {
      return navigateTo('/')
    }
    return // Hayaan lang kung nasa public path na
  }

  // --- 2. AUTHENTICATED BUT NO USER DATA ---
  // Kung may token pero nawala ang user cookie (data corruption/manual delete),
  // mas safe na i-force logout para hindi magka-error ang UI na umaasa sa user data.
  if (token && !userCookie && !publicPaths.includes(to.path)) {
    useCookie('auth_token').value = null // Linisin ang token
    return navigateTo('/')
  }

  // --- 3. ALREADY LOGGED IN REDIRECT ---
  // Iwasan ang login page kung may token na
  if (token && publicPaths.includes(to.path)) {
    if (userCookie) {
      const user = typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
      return navigateTo(`/${user.user_type}`);
    }
  }

  // --- 4. ROLE & PATH PROTECTION ---
  if (token && userCookie) {
    const user = typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie
    const userType = user.user_type
    
    const isGlobal = allowedGlobalRoutes.includes(to.path)
    const isCorrectRoleFolder = to.path.startsWith(`/${userType}`)

    // Redirect sa unauthorized kung maling folder at hindi global path
    if (!isGlobal && !isCorrectRoleFolder && to.path !== '/unauthorized') {
      return navigateTo('/unauthorized')
    }
  }
})