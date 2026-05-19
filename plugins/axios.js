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
        // Direct execution of cookie composition within the request instance cycle
        const tokenCookie = useCookie('auth_token');
        const token = tokenCookie.value;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    // 2. RESPONSE INTERCEPTOR (Handling Expired Tokens)
    api.interceptors.response.use(
        (response) => response, 
        (error) => {
            // Trigger routine evaluations upon hitting 401 token lifecycles
            if (error.response && error.response.status === 401) {
                console.warn("Token expired or invalid. Resetting verification states...");

                // Target and terminate active runtime session cookies
                const tokenCookie = useCookie('auth_token');
                const userCookie = useCookie('user');
                const timeInCookie = useCookie('timeIn');
                
                tokenCookie.value = null;
                userCookie.value = null;
                timeInCookie.value = null;

                // Force return routing to the entry login location
                return navigateTo('/');
            }
            return Promise.reject(error);
        }
    );

    nuxtApp.provide('api', api);
});