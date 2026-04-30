import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) =>{
    const config = useRuntimeConfig();
    const api = axios.create({
        baseURL: config.public.apiBase,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Interceptor to include the token in each request
    api.interceptors.request.use(config => {
        const token = localStorage.getItem('auth_token');
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;  // Attach the token
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    nuxtApp.provide('api', api);
})