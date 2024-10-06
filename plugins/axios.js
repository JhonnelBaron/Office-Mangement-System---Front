import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) =>{
    const api = axios.create({
        baseURL: 'http://127.0.0.1:8000',
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