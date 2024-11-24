import { useRouter } from 'vue-router';

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useState('auth');
  const router = useRouter();
  
  // Check if we're on the client side before accessing localStorage
  if (process.client) {
    // Retrieve the user data and token from localStorage (only on the client)
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null; 
    const token = localStorage.getItem('auth_token');
    
    // If the user is not authenticated, allow access to the login page ("/")
    if (!token || !user) {
      // Allow unauthenticated users to access login or register pages
      if (to.path === '/register' || to.path === '/' || to.path === '/reset-password' || to.path === '/update-password') {
        // Allow access to register or login page
        return;
      } else {
        // Redirect to login page if not logged in
        router.push('/'); // Redirect to login page if trying to access any other page
      }
    } else {
      // If the user is authenticated, get their user type
      const userType = user.user_type;

      // Restrict access based on user type
      if (userType === 'employee') {
        // Employee can only access specific pages
        if (!to.path.startsWith('/employee') && to.path !== '/unauthorized') {
          router.push('/unauthorized'); // Redirect to unauthorized if employee tries to access other pages
        }
      } else if (userType === 'admin') {
        // Admin can only access admin pages
        if (!to.path.startsWith('/admin') && to.path !== '/unauthorized') {
          router.push('/unauthorized'); // Redirect to unauthorized if admin tries to access other pages
        }
      } else if (userType === 'chief') {
        // Chief can only access chief pages
        if (!to.path.startsWith('/chief') && to.path !== '/unauthorized') {
          router.push('/unauthorized'); // Redirect to unauthorized if chief tries to access other pages
        }
      } else {
        // If the user type is not recognized, redirect to login
        router.push('/'); // Default to login page
      }
    }
  }
});
