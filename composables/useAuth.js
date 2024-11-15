// composables/useAuth.js
// import { ref, nextTick  } from 'vue';
// import { useRouter } from 'vue-router';

// export const useAuth = () => {
//     const email = ref('');
//     const password = ref('');
//     const error = ref(null);
//     const router = useRouter();

//     const handleLogin = async () => {
//         try {
//             console.log("Attempting login with", email.value, password.value);
//             const response = await useNuxtApp().$api.post('/login', {
//                 email: email.value,
//                 password: password.value,
//             });

//             console.log("Login response:", response);

//             // Store the token in localStorage
//             if (response.data.access_token) {
//                 localStorage.setItem('auth_token', response.data.access_token);
//                 localStorage.setItem('user', JSON.stringify(response.data)); 
//                 const now = new Date().toLocaleTimeString(); // Get the current time
//                 localStorage.setItem('timeIn', now); // Store the time in localStorage
//                 // Redirect based on user type
//                 nextTick(() => {
//                 // Redirect based on user type
//                 const redirectTo = response.data.redirect_to;
//                 if (redirectTo) {
//                     navigateTo(redirectTo); // Redirect to the appropriate route
//                 }
//             });
//             }
//         } catch (err) {
//             console.error("Login error:", err);
//             // Show an error message
//             error.value = err.response?.data?.message || 'Login failed. Please try again.';
//         }
//     };

//     return {
//         email,
//         password,
//         error,
//         handleLogin,
//     };
// };

import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import FingerprintJS from '@fingerprintjs/fingerprintjs';  // Import FingerprintJS

export const useAuth = () => {
    const email = ref('');
    const password = ref('');
    const error = ref(null);
    const deviceFingerprint = ref(null);  // Store device fingerprint
    const router = useRouter();

    // Generate the fingerprint when the composable is mounted
    const generateFingerprint = async () => {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        deviceFingerprint.value = result.visitorId;  // Store the fingerprint
        
        // Log the fingerprint to the console
        console.log("Generated Fingerprint:", deviceFingerprint.value);
    };

    // Call generateFingerprint when the composable is mounted
    generateFingerprint();

    const handleLogin = async () => {
        try {
            console.log("Attempting login with", email.value, password.value);
            // Include the fingerprint in the login request
            const response = await useNuxtApp().$api.post('/login', {
                email: email.value,
                password: password.value,
                deviceFingerprint: deviceFingerprint.value,  // Send fingerprint here
            });

            console.log("Login response:", response);

            // Store the token in localStorage
            if (response.data.access_token) {
                localStorage.setItem('auth_token', response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data));
                const now = new Date().toLocaleTimeString(); // Get the current time
                localStorage.setItem('timeIn', now); // Store the time in localStorage
                // Redirect based on user type
                nextTick(() => {
                    const redirectTo = response.data.redirect_to;
                    if (redirectTo) {
                        navigateTo(redirectTo); // Redirect to the appropriate route
                    }
                });
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
