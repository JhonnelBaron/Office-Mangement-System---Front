import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import FingerprintJS from '@fingerprintjs/fingerprintjs'; 

export const Auth = () => {
    const email = ref('');
    const password = ref('');
    const error = ref(null);
    const deviceFingerprint = ref(null);  
    const timeIn = ref(true);  // Default to "Time In"
    const router = useRouter();

    const generateFingerprint = async () => {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        deviceFingerprint.value = result.visitorId;  
        console.log("Generated Fingerprint:", deviceFingerprint.value);
    };

    generateFingerprint();

    const handleLogin = async () => {
        try {
            if (timeIn.value) {
                // Handle "Time In"
                console.log("Attempting Time In with", email.value, password.value);
                const response = await useNuxtApp().$api.post('/login', {
                    email: email.value,
                    password: password.value,
                    deviceFingerprint: deviceFingerprint.value,
                });
    
                // Store the token and keep the user on the same page
                if (response.data.access_token) {
                    localStorage.setItem('auth_token', response.data.access_token);
                    localStorage.setItem('user', JSON.stringify(response.data));
                    localStorage.setItem('timeIn', new Date().toLocaleTimeString());
                    
                    // Do not redirect immediately, wait for camera modal to complete
                    return true; // Success
                }
            } else {
                // Handle "Time Out"
                console.log("Attempting Time Out");
                await useNuxtApp().$api.post('/logout'); // Logout API
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                router.push('/time-in-out'); // Replace with the correct route
            }
        } catch (err) {
            console.error("Error:", err);
            error.value = err.response?.data?.error || 'Action failed. Please try again.';
            return false;
        }
    };
    

    return {
        email,
        password,
        timeIn,  // Expose timeIn state
        error,
        handleLogin,
    };
};
