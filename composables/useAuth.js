export const useAuth = () => {
    const email = ref('');
    const password = ref('');
    const error = ref(null);
    const deviceFingerprint = ref(null);
    const router = useRouter();
    const { $echo } = useNuxtApp();

    // Initialize Cookies
    const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7, path: '/' });
    const userCookie = useCookie('user', { maxAge: 60 * 60 * 24 * 7, path: '/' });

    const generateFingerprint = async () => {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        deviceFingerprint.value = result.visitorId;
    };

    generateFingerprint();

    const handleLogin = async () => {
        try {
            const response = await useNuxtApp().$api.post('/login', {
                email: email.value,
                password: password.value,
                deviceFingerprint: deviceFingerprint.value,
            });

            if (response.data.access_token) {
                // 1. I-store sa COOKIES (Para sa Middleware/SSR)
                tokenCookie.value = response.data.access_token;
                userCookie.value = JSON.stringify(response.data);

                // 2. I-store sa LOCALSTORAGE (Para sa existing logic mo)
                localStorage.setItem('auth_token', response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data));
                localStorage.setItem('timeIn', new Date().toLocaleTimeString());

                // 3. Echo Reconnection
                if ($echo) {
                    $echo.options.auth.headers.Authorization = `Bearer ${response.data.access_token}`;
                    $echo.disconnect();
                    $echo.connect();
                }

                // 4. Redirect gamit ang navigateTo
                const redirectTo = response.data.redirect_to || '/employee';
                return navigateTo(redirectTo);
            }
        } catch (err) {
            error.value = err.response?.data?.error || 'Login failed.';
        }
    };

    return { email, password, error, handleLogin };
};