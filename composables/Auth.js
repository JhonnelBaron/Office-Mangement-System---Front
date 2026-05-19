import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { timeoutUser } from '@/services/authService'; 

export const Auth = () => {
    const email = ref('');
    const password = ref('');
    const error = ref(null);
    const timeIn = ref(true);  // Default state tracking for attendance entry
    const router = useRouter();
    const pictureData = ref(null);   

    const handleLogin = async () => {
        try {
          // Initialize unified cookie management states
          const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7, path: '/' });
          const userCookie = useCookie('user', { maxAge: 60 * 60 * 24 * 7, path: '/' });
          const timeInCookie = useCookie('timeIn', { maxAge: 60 * 60 * 24 * 7, path: '/' });

          if (timeIn.value) {
            console.log("Attempting Time In with", email.value, password.value);
      
            if (!email.value || !password.value) {
              error.value = 'Email and password are required.';
              return false; 
            }
      
            const loginData = {
              email: email.value,
              password: password.value
            };
      
            if (pictureData.value) {
              loginData.photo = pictureData.value;  
            }
      
            const response = await useNuxtApp().$api.post('/login', loginData);
      
            if (response.data.access_token) {
              // Commit application state profiles strictly to cookies for SSR validation
              tokenCookie.value = response.data.access_token;
              userCookie.value = JSON.stringify(response.data);
              timeInCookie.value = new Date().toLocaleTimeString();
      
              return true; 
            } else {
              error.value = 'Invalid login credentials.';
              return false; 
            }
          } else {
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

            console.log("🚀 Full API Response for Logout:", response); 
            
            if (typeof response === "string") {
                console.log("✅ Received string response:", response);
                
                // Clear out active cookie credentials upon tracking termination
                tokenCookie.value = null;
                userCookie.value = null;
                timeInCookie.value = null;

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
      
    const saveCapturedPicture = (imageData) => {
        pictureData.value = imageData;  
        console.log("Captured image data:", imageData);
    };
    
    return {
        email,
        password,
        timeIn,  
        error,
        pictureData,  
        saveCapturedPicture,
        handleLogin,
    };
};