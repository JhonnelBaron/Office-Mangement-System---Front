// composables/useAuth.js
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuth = () => {
    const email = ref('');
    const password = ref('');
    const error = ref(null);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            console.log("Attempting login with", email.value, password.value);
            // Updated the API endpoint to /api/login
            const response = await useNuxtApp().$api.post('/login', {
                email: email.value,
                password: password.value,
            });

            console.log("Login response:", response);

            // Store the token in localStorage
            if (response.data.access_token) {
                localStorage.setItem('auth_token', response.data.access_token);
                const now = new Date().toLocaleTimeString(); // Get the current time
                localStorage.setItem('timeIn', now); // Store the time in localStorage
                // Redirect based on user type
                router.push(response.data.redirect_to);
            }
        } catch (err) {
            console.error("Login error:", err);
            // Show an error message
            error.value = err.response?.data?.message || 'Login failed. Please try again.';
        }
    };

    return {
        email,
        password,
        error,
        handleLogin,
    };
};
