import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const api = axios.create({
        baseURL: config.public.apiBase,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // 1. REQUEST INTERCEPTOR (Token Injection)
    api.interceptors.request.use(config => {
        const tokenCookie = useCookie('auth_token');
        const token = tokenCookie.value;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    // 2. RESPONSE INTERCEPTOR (Handling Expired Tokens with Silent Refresh)
    api.interceptors.response.use(
        (response) => response, 
        async (error) => { // Ginawang 'async' para magamit ang await sa API call
            const originalRequest = error.config;

            // 1. Suriin kung 401 (Expired) ang error at kung HINDI pa ito nasusubukang i-retry
            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // Markahan para maiwasan ang infinite loop

                try {
                    console.warn("Token expired. Attempting silent refresh...");

                    const tokenCookie = useCookie('auth_token');
                    console.log("Ang token na ipapasa sa refresh:", tokenCookie.value);
                    // 2. Patagong tawagan si Laravel gamit ang direktang vanilla axios instance 
                    // (Huwag gamitin ang 'api' instance dito para hindi umikot ang interceptor)
                    const refreshResponse = await axios.post(`${config.public.apiBase}/refresh`, {}, {
                        headers: {
                            'Authorization': `Bearer ${tokenCookie.value}`
                        }
                    });

                    // 3. Kunin ang bagong token na galing kay Laravel
                    const newToken = refreshResponse.data.access_token;
                    
                    // 4. I-save ang bagong-bagong token sa Nuxt cookie
                    tokenCookie.value = newToken;

                    console.log("Token successfully refreshed! Retrying original request...");

                    // 5. I-update ang authorization header ng orihinal na request ng user
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    // 6. Patakbuhin muli ang naudlot na request ng user. 
                    // Ibabalik nito ang tamang data na parang walang nangyaring error.
                    return api(originalRequest);

                } catch (refreshError) {
                    // 7. KUNG SUMABLAY ANG REFRESH (Ibig sabihin tunay na inactive o patay na ang refresh_ttl)
                    console.error("Refresh failed or user session expired completely. Redirecting to login...");
                    console.error("Eksaktong dahilan ng fail:", refreshError.response?.data || refreshError.message);
                    console.error("Status Code ng fail:", refreshError.response?.status);

                    const tokenCookie = useCookie('auth_token');
                    const userCookie = useCookie('user');
                    const timeInCookie = useCookie('timeIn');
                    
                    // Linisin ang lahat ng bakas ng session cookies
                    tokenCookie.value = null;
                    userCookie.value = null;
                    timeInCookie.value = null;

                    // I-tapon ang user pabalik sa main entrance/login page
                    return navigateTo('/');
                }
            }

            return Promise.reject(error);
        }
    );

    nuxtApp.provide('api', api);
});