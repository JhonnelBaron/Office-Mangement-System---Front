// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // 1. Gamitin ang cookies para gumana sa Server side (Hydration safe)
  const token = useCookie('auth_token').value
  const userCookie = useCookie('user').value // Siguraduhin na nagse-set ka rin ng cookie para sa user data

  const publicPaths = ['/', '/login', '/register', '/reset-password', '/update-password', '/camtest']
  const allowedGlobalRoutes = ['/notifications', '/profile', '/unauthorized']

  // 2. Kung walang token at susubok pumasok sa hindi public page
  if (!token && !publicPaths.includes(to.path)) {
    return navigateTo('/')
  }

  // 3. Kung logged in na at susubok bumalik sa login/register
  if (token && publicPaths.includes(to.path)) {
      if (userCookie) {
        const user = typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
        return navigateTo(`/${user.user_type}`);
      }
    }

  if (token && userCookie) {
    const user = typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie
    const userType = user.user_type
    
    // Normalize path check
    const isGlobal = allowedGlobalRoutes.includes(to.path)
    const isCorrectRoleFolder = to.path.startsWith(`/${userType}`)

    // 4. Role Protection Logic
    // Payagan kung: Global Route OR Tama ang folder role OR Unauthorized page
    if (!isGlobal && !isCorrectRoleFolder && to.path !== '/unauthorized') {
      return navigateTo('/unauthorized')
    }
  }
})