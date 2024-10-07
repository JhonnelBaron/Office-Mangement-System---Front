import { useRouter } from 'vue-router';

export default function () {
  const router = useRouter();  // Get the router instance

  // Get the stored user information from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // If no user is found in localStorage, redirect to login
  if (!user) {
    return router.push('/');
  }

  // Get the current route
  const currentRoute = window.location.pathname;

  // Define route access based on user type
  if (user.user_type === 'employee' && (currentRoute.startsWith('/admin') || currentRoute.startsWith('/chief'))) {
    // If an employee tries to access an admin or chief route
    return router.push('/employee');
  } else if (user.user_type === 'admin' && (currentRoute.startsWith('/employee') || currentRoute.startsWith('/chief'))) {
    // If an admin tries to access an employee or chief route
    return router.push('/admin');
  } else if (user.user_type === 'chief' && (currentRoute.startsWith('/employee') || currentRoute.startsWith('/admin'))) {
    // If a chief tries to access an employee or admin route
    return router.push('/chief');
  }
}
