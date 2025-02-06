<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <!-- Main Container -->
        <div class="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-start p-4 lg:p-8">

            <!-- Left Side: System Info -->
            <div class="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0 mt-5 ml-20">
                <h1 class="text-4xl font-bold" style="color: #E81A1A;">
                    Regional Operations Management Division - System
                </h1>
                <p class="mt-4 text-lg text-gray-600">
                    An office management system for employees where they can manage their tasks, track deadlines, and access various office documents.
                </p>
                <div class="mt-6 flex space-x-6 text-blue-600">
                    <p class="underline">+(02) 8832 3783</p> 
                    <p class="underline">+(02) 8830 8514</p>
                    <p class="underline">romo.romd@tesda.gov.ph</p>
                </div>
            </div>
            

            <!-- Right Side: Login Form -->
             
            <div class="lg:w-1/2 flex justify-center lg:justify-end">
              
                <!-- Client-only login form -->
                <client-only>
                  
                    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-[-30px] mr-5">
                       <div class="mb-4  flex justify-end items-center">
                        <!-- <label class="block text-sm font-medium text-gray-700">Time In / Time Out</label> -->
                        <label class="inline-flex items-center cursor-pointer -mb-16">
                          <input type="checkbox" v-model="timeIn" class="sr-only peer">
                          <div
                            class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                          ></div>
                          <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {{ timeIn ? 'Time In' : 'Time Out' }}
                          </span>
                        </label>
                      </div> 
                        <h2 class="text-2xl font-bold text-gray-800 mb-6">Login to your account </h2>
                        

                        <form @submit.prevent="handleLoginWithCamera">
                            <div class="mb-4">
                                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                                <input id="email" type="email" v-model="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter your email"/>
                            </div>


                            <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <div class="relative">
                  <input
                    id="password"
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    @click="togglePasswordVisibility"
                    class="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-500 hover:text-gray-700"
                  >
                    {{ showPassword ? 'Hide' : 'Show' }}
                  </button>
                </div>
              </div>


              <!-- <div class="mb-4 flex items-center">
                <input
                  id="remember_me"
                  type="checkbox"
                  v-model="rememberMe"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="remember_me" class="ml-2 block text-sm text-gray-900">
                  Remember Me
                </label>
              </div> -->

                            <!-- Error Message Display -->
                            <div v-if="error" class="mb-4 error">
                                {{ error }}
                            </div>

                            <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"> {{ timeIn ? 'Time In' : 'Time Out' }}
                            </button>

                            <p class="mt-4 text-sm text-center text-gray-600">
                            Forgot your password? 
                            <NuxtLink to="/reset-password" class="hover:underline" style="color: #E81A1A;">Click here</NuxtLink>
                            </p>

                            <p class="mt-4 text-center">
                                <NuxtLink to="/register" class="hover:underline" style="color: #E81A1A;">Register</NuxtLink>
                            </p>
                        </form>
                    </div>
                </client-only>
            </div>
        </div>
        <CameraModal v-if="isCameraModalOpen" @close="isCameraModalOpen = false"  @savePicture="saveCapturedPicture"  @clearFields="clearFields"/>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import CameraModal from '@/components/CameraModal.vue';
import { Auth } from '@/composables/Auth';
import { uploadLoginPhoto } from '@/services/authService';
import Swal from 'sweetalert2'; // Import SweetAlert2

const { email, password, timeIn, error, handleLogin } = Auth();
const showPassword = ref(false); // Control password visibility
const isCameraModalOpen = ref(false); // Control the camera modal visibility.

// const timeIn = ref(true); // Toggle for Time In / Time Out

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// const handleLoginWithCamera = async () => {
//   try {
//     const success = await handleLogin();
//     if (success) {
//       isCameraModalOpen.value = true; // Open the camera modal after successful login
//     } else {
//       alert('Login failed. Please check your credentials.');
//     }
//   } catch (err) {
//     console.error('Login error:', err.message);
//     alert('An error occurred during login.');
//   }
// };

// const handleLoginWithCamera = async () => {
//   try {
//     error.value = ''; // Clear any existing error before attempting login
//     console.log('Attempting login with email:', email.value);

//     // Check if we're in "Time In" mode
//     if (timeIn.value) {
//       // Proceed with Time In login
//       // console.log("Attempting Time In login");
//       const success = await handleLogin(); // Attempt login for "Time In"

//       if (success === true) {
//         // Only open the camera modal if login was successful and it's "Time In"
//         isCameraModalOpen.value = true;
//       } else {
//         // If login failed, display error
//         error.value = 'Login failed. Please check your credentials.';
//       }
//     } else {
//       // If it's "Time Out", just handle that and log the user out
//       // console.log("Attempting Time Out");
//       await handleLogin(); // This should handle "Time Out" logic
//       alert('Successfully logged out.');
//     }
//   } catch (err) {
//     console.error('Login error:', err.message);
//     error.value = 'An error occurred during login.'; // Set error message for other errors
//   }
// };
const handleLoginWithCamera = async () => {
  try {
    error.value = ''; // Clear any existing error before attempting login
    console.log('Attempting login with email:', email.value);

    // Check if we're in "Time In" mode
    if (timeIn.value) {
      // Proceed with Time In login
      const success = await handleLogin(); // Attempt login for "Time In"

      if (success === true) {
        // Only open the camera modal if login was successful and it's "Time In"
        isCameraModalOpen.value = true;
      } else {
        // If login failed, display error
        error.value = 'Login failed. Please check your credentials.';
      }
    } else {
      // If it's "Time Out", just handle that and log the user out
      const result = await handleLogin(); // Capture the result
      

      if (result === 'logged out') {
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have successfully time out.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500, // Auto-close after 1.5 seconds
        }).then(() => {
          clearFields(); // Optionally clear fields after logout
        });
      } else {
        error.value = 'Logout failed. Please try again.';
      }
    }
  } catch (err) {
    console.error('Login error:', err.message);
    error.value = 'An error occurred during login.'; // Set error message for other errors
  }
};


// Save the captured picture (image data) and proceed with login
const saveCapturedPicture = async (imageData) => {
  try {
    console.log('Picture captured:', imageData);
    // Upload the captured photo
    const response = await uploadLoginPhoto(imageData);

    console.log('Photo upload response:', response);

    // Save the photo URL (or data) to localStorage if needed
    localStorage.setItem('photoUrl', response.photoUrl || '');

    // Proceed to submit the "Time In" data
    isCameraModalOpen.value = false; // Close the camera modal
    await handleLogin(); // Ensure login completion
  } catch (error) {
    console.error('Error uploading photo:', error.message);
    alert('Failed to upload photo. Please try again.');
  }
};

const clearFields = () => {
  email.value = '';
  password.value = '';
};

</script>

<style scoped>
.error {
    color: red;
}
</style>
