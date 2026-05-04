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
        // Mas safe kuhanin sa cookie para sa SSR, pero kung localStorage ang gamit mo, okay lang
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    // 2. RESPONSE INTERCEPTOR (Handling Expired Tokens)
    api.interceptors.response.use(
        (response) => response, // Pag success, hayaan lang
        (error) => {
            // Dito papasok kung nag-expire ang token (401)
            if (error.response && error.response.status === 401) {
                console.warn("Token expired or invalid. Redirecting to login...");

                // A. Linisin ang Storage
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                localStorage.removeItem('timeIn');

                // B. Linisin ang Cookies (Importante para sa middleware mo)
                const tokenCookie = useCookie('auth_token');
                const userCookie = useCookie('user');
                tokenCookie.value = null;
                userCookie.value = null;

                // C. I-redirect sa Login Page
                // Gumamit ng window.location para sa hard refresh o navigateTo
                return navigateTo('/');
            }
            return Promise.reject(error);
        }
    );

    nuxtApp.provide('api', api);
});