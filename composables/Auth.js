import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import FingerprintJS from '@fingerprintjs/fingerprintjs'; 
import { timeoutUser } from '@/services/authService';  // Adjust the path based on where timeoutUser is defined

export const Auth = () => {
    const email = ref('');
    const password = ref('');
    const error = ref(null);
    const deviceFingerprint = ref(null);  
    const timeIn = ref(true);  // Default to "Time In"
    const router = useRouter();
    const pictureData = ref(null);  // To store the captured picture data   

    const generateFingerprint = async () => {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        deviceFingerprint.value = result.visitorId;  
        console.log("Generated Fingerprint:", deviceFingerprint.value);
    };

    generateFingerprint();

    // const handleLogin = async () => {
    //     try {
    //         if (timeIn.value) {
    //             // Handle "Time In"
    //             console.log("Attempting Time In with", email.value, password.value);

    //             const loginData = {
    //                 email: email.value,
    //                 password: password.value,
    //                 deviceFingerprint: deviceFingerprint.value,
    //             };

    //             // If a picture is captured, add it to the login data
    //             if (pictureData.value) {
    //                 loginData.photo = pictureData.value;  // Add photo data
    //             }

    //             const response = await useNuxtApp().$api.post('/login', loginData);

    //             // Store the token and keep the user on the same page
    //             if (response.data.access_token) {
    //                 localStorage.setItem('auth_token', response.data.access_token);
    //                 localStorage.setItem('user', JSON.stringify(response.data));
    //                 localStorage.setItem('timeIn', new Date().toLocaleTimeString());
                    
    //                 // Do not redirect immediately, wait for camera modal to complete
    //                 return true; // Success
    //             }
    //         } else {
    //         // Handle "Time Out"
    //         console.log("Attempting Time Out");

    //         // Make sure to pass email and password here as well when calling timeoutUser
    //         const timeoutData = {
    //             email: email.value,
    //             password: password.value,
    //         };
            
    //         await timeoutUser(timeoutData); // Call timeoutUser with credentials
    //             localStorage.removeItem('auth_token');
    //             localStorage.removeItem('user');
    //             router.push('/login'); // Replace with the correct route
    //         }
    //     } catch (err) {
    //         console.error("Error:", err);
    //         error.value = err.response?.data?.error || 'Action failed. Please try again.';
    //         return false;
    //     }
    // };

    const handleLogin = async () => {
        try {
          if (timeIn.value) {
            // Handle "Time In"
            console.log("Attempting Time In with", email.value, password.value);
      
            if (!email.value || !password.value) {
              error.value = 'Email and password are required.';
              return false; 
            }
      
            const loginData = {
              email: email.value,
              password: password.value,
              deviceFingerprint: deviceFingerprint.value,
            };
      
            if (pictureData.value) {
              loginData.photo = pictureData.value;  
            }
      
            const response = await useNuxtApp().$api.post('/login', loginData);
      
            if (response.data.access_token) {
              localStorage.setItem('auth_token', response.data.access_token);
              localStorage.setItem('user', JSON.stringify(response.data));
              localStorage.setItem('timeIn', new Date().toLocaleTimeString());
      
              return true; 
            } else {
              error.value = 'Invalid login credentials.';
              return false; 
            }
          } else {
            // Handle "Time Out"
            console.log("Attempting Time Out");
      
            if (!email.value || !password.value) {
              error.value = 'Email and password are required to log out.';
              return false;
            }
      
            const timeoutData = {
              email: email.value,
              password: password.value,
            };
      
            const response = await timeoutUser(timeoutData); 

            console.log("🚀 Full API Response for Logout:", response); // Debugging line
            
            // 🔥 Check if response is a string (since API returns only a timestamp)
            if (typeof response === "string") {
                console.log("✅ Received string response:", response);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                router.push('/login');
                return 'logged out';
            } else {
                console.error("❌ Unexpected Logout Response:", response);
                error.value = 'Logout failed. Please try again.';
                return false;
            }
            
          }
        } catch (err) {
          console.error("🔥 Error during login/logout:", err);
          error.value = err.response?.data?.error || 'Action failed. Please try again.';
          return false;
        }
      };
      

    // Function to save the captured picture when it's available
    const saveCapturedPicture = (imageData) => {
        pictureData.value = imageData;  // Store the image data
        console.log("Captured image data:", imageData);

        // Optionally, you can now upload the picture or store it as needed
    };
    
    return {
        email,
        password,
        timeIn,  // Expose timeIn state
        error,
        pictureData,  // Expose the picture data ref
        saveCapturedPicture,
        handleLogin,
    };
};
