<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 v-if="!isResetSuccessful" class="text-2xl font-bold text-gray-800 mb-6">
          Update Your Password
        </h2>
  
        <form v-if="!isResetSuccessful" @submit.prevent="handlePasswordReset">
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">New Password</label>
            <div class="relative">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter new password"
                required
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
  
          <div class="mb-4">
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div class="relative">
              <input
                id="password_confirmation"
                :type="showPassword ? 'text' : 'password'"
                v-model="passwordConfirmation"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirm new password"
                required
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
  
          <div v-if="error" class="mb-4 text-red-600">
            {{ error }}
          </div>
  
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Password
          </button>
        </form>
  
        <div v-else>
          <div class="text-green-600 text-center mb-4">{{ message }}</div>
          <button
            @click="redirectToLogin"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Back to Login
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter, useRoute } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  const password = ref('');
  const passwordConfirmation = ref('');
  const message = ref('');
  const error = ref('');
  const showPassword = ref(false);
  const isResetSuccessful = ref(false); // Tracks if reset was successful
  
  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };
  
  onMounted(() => {
    if (!route.query.token || !route.query.email) {
      error.value = 'Invalid or missing token.';
    }
  });
  
  const handlePasswordReset = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/password/reset', {
        token: route.query.token,
        email: route.query.email,
        password: password.value,
        password_confirmation: passwordConfirmation.value,
      });
      message.value = response.data.message;
      isResetSuccessful.value = true; // Mark as successful
      error.value = '';
    } catch (err) {
      error.value = err.response?.data?.message || 'Something went wrong';
      message.value = '';
    }
  };
  
  const redirectToLogin = () => {
    router.push('/');
  };
  </script>
  