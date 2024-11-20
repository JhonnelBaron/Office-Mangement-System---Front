<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <!-- Main Container -->
      <div class="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-start p-4 lg:p-8">
        
        <!-- Left Side: System Info -->
        <div class="lg:w-1/2 text-center mt-20 lg:text-left mb-8 lg:mb-0 ml-20">
          <h1 class="text-4xl font-bold" style="color: #E81A1A;">
            Regional Operations Management Division - System
          </h1>
          <p class="mt-4 text-lg text-gray-600">
            An office management system for employees where they can manage their tasks, track deadlines, and access various office documents.
          </p>
          <div class="mt-6 flex space-x-6 text-blue-600">
            <p class="underline">+00 000 0000</p>
            <p class="underline">romo.romd@tesda.gov.ph</p>
          </div>
        </div>
  
        <!-- Right Side: Registration Form -->
        <div class="lg:w-1/2 flex justify-center lg:justify-end">
          <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-[-30px] mr-5">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Create your account</h2>
  
            <form @submit.prevent="handleRegister">
              <!-- First and Last Name -->
              <div class="flex mb-4 space-x-2">
                <div class="flex-1">
                  <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    v-model="firstName"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div class="flex-1">
                  <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    v-model="lastName"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <!-- Position -->
              <div class="mb-4">
              <label for="position" class="block text-sm font-medium text-gray-700">Position</label>
              <select
                id="position"
                v-model="position"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="" disabled selected>Select your position</option>
                <option value="Project Support Staff I">Project Support Staff I</option>
                <option value="Project Support Staff II">Project Support Staff II</option>
                <option value="Project Support Staff III">Project Support Staff III</option>
                <option value="Admin Support Staff">Admin Support Staff</option>
              </select>
            </div>

              <!-- Email -->
              <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  v-model="email"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
  
              <!-- Password -->
              <div class="mb-6">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input
                  id="password"
                  type="password"
                  v-model="password"
                  minlength="8"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password (min. 8 characters)"
                  required
                />
              </div>
  
              <!-- Confirm Password -->
              <div class="mb-6">
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  v-model="confirmPassword"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Confirm your password"
                  required
                />
              </div>
  
              <button
                type="submit"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Register
              </button>
  
              <p class="mt-4 text-sm text-center text-gray-600">
                Already have an account? 
                <NuxtLink to="/" class="hover:underline" style="color: #E81A1A;">Login here</NuxtLink>
              </p>
            </form>
            <div v-if="success" class="success">{{ success }}</div>
            <div v-if="error" class="error">{{ error }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { registerUser } from '@/services/authService';
  
  const firstName = ref('');
  const lastName = ref('');
  const position = ref('');
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const error = ref(null);
  const success = ref(null); 
  const router = useRouter();
  
  const handleRegister = async () => {
    error.value = null;
    success.value = null;

    if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long.';
    return;
  }

    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match.';
      return;
    }
  
    const payload = {
      first_name: firstName.value,
      last_name: lastName.value,
      position: position.value,
      email: email.value,
      password: password.value,
    };
  
    // try {
    //   await registerUser(payload);
    //   success.value = response.data.message;
    //   router.push('/');
    // } catch (err) {
    //   error.value = err.response?.data?.message || 'Registration failed.';
    // }
    try {
    // Call the registration API
    const response = await registerUser(payload); // Assign the API response to a variable
    success.value = response.data.message; // Access the message from the response
    router.push('/'); // Redirect to the login page on successful registration
  } catch (err) {
    // Handle errors and display appropriate messages
    error.value = err.response?.data?.message || 'Registration failed.';
  }
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
    margin-top: 10px;
  }
  .success {
  color: green;
  margin-top: 10px;
}
  </style>
  