export const useAuth = () => {
    const email = ref('');
    const password = ref('');
    const error = ref(null);
    const router = useRouter();
    const { $echo } = useNuxtApp();

    // Initialize Cookies
    const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7, path: '/' });
    const userCookie = useCookie('user', { maxAge: 60 * 60 * 24 * 7, path: '/' });
    const timeInCookie = useCookie('timeIn', { maxAge: 60 * 60 * 24 * 7, path: '/' });

    const handleLogin = async () => {
        try {
            const response = await useNuxtApp().$api.post('/login', {
                email: email.value,
                password: password.value
            });

            if (response.data.access_token) {
                // 1. Commit session states strictly to cookie variables for SSR compliance
                tokenCookie.value = response.data.access_token;
                userCookie.value = JSON.stringify(response.data);
                timeInCookie.value = new Date().toLocaleTimeString();

                // 2. Real-time Echo broadcaster reconnection using cookie token updates
                if ($echo) {
                    $echo.options.auth.headers.Authorization = `Bearer ${tokenCookie.value}`;
                    $echo.disconnect();
                    $echo.connect();
                }

                // 3. Routing enforcement execution
                const redirectTo = response.data.redirect_to || '/employee';
                return navigateTo(redirectTo);
            }
        } catch (err) {
            error.value = err.response?.data?.error || 'Login failed.';
        }
    };

    return { email, password, error, handleLogin };
};