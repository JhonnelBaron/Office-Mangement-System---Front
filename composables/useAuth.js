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
      localStorage.setItem('access_token', data.access_token);

      // Redirect to the dashboard or another page
      router.push('/dashboard');
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
