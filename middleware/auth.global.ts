// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const tokenCookie = useCookie('auth_token') as any
  const userCookie = useCookie('user') as any

  const token = tokenCookie.value
  const userRaw = userCookie.value

  const publicPaths = ['/', '/login', '/register', '/reset-password', '/update-password', '/camtest']
  const allowedGlobalRoutes = ['/notifications', '/profile', '/unauthorized']

  // --- 1. GUEST CHECK ---
  if (!token) {
    if (!publicPaths.includes(to.path)) {
      return navigateTo('/')
    }
    return 
  }

  // --- 2. AUTHENTICATED BUT NO USER DATA ---
  if (token && !userRaw && !publicPaths.includes(to.path)) {
    tokenCookie.value = null 
    return navigateTo('/')
  }

  // --- 3. ALREADY LOGGED IN REDIRECT ---
  if (token && publicPaths.includes(to.path)) {
    if (userRaw) {
      const user = typeof userRaw === 'string' ? JSON.parse(userRaw) : userRaw;
      return navigateTo(`/${user.user_type}`);
    }
  }

  // --- 4. ROLE & PATH PROTECTION ---
  if (token && userRaw) {
    const user = typeof userRaw === 'string' ? JSON.parse(userRaw) : userRaw
    const userType = user.user_type
    
    const isGlobal = allowedGlobalRoutes.includes(to.path)
    const isCorrectRoleFolder = to.path.startsWith(`/${userType}`)

    if (!isGlobal && !isCorrectRoleFolder && to.path !== '/unauthorized') {
      return navigateTo('/unauthorized')
    }
  }
})