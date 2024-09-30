import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginUser } from '@/services/authService';

export function useAuth() {
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  const error = ref(null);
  const loading = ref(false);

  const handleLogin = async () => {
    try {
      loading.value = true;
      const data = await loginUser({ email: email.value, password: password.value });

      // Save token or user data to localStorage/cookies
      // localStorage.setItem('access_token', data.access_token);
      const token = localStorage.getItem('auth_token');
      const user = JSON.parse(localStorage.getItem('user'));
      // Redirect to the dashboard or another page
    //   router.push('/admin');
    // } catch (err) {
    //   error.value = err;
    // } finally {
    //   loading.value = false;
    // }
      if (token && user) {
        // Redirect to the dashboard or another page
        // router.push('/admin');
        switch (user.user_type) {
          case 'admin':
            router.push('/admin/dashboard'); // Redirect to admin dashboard
            break;
          case 'chief':
            router.push('/chief/dashboard'); // Redirect to chief dashboard
            break;
          case 'employee':
            router.push('/employee/dashboard'); // Redirect to employee dashboard
            break;
          default:
            router.push('/'); // Fallback redirect
            break;
        }
      }
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    email,
    password,
    error,
    loading,
    handleLogin,
  };
}
