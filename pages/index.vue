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
                    <p class="underline">+00 000 0000</p>
                    <p class="underline">romo.romd@tesda.gov.ph</p>
                </div>
            </div>

            <!-- Right Side: Login Form -->
            <div class="lg:w-1/2 flex justify-center lg:justify-end">
                <!-- Client-only login form -->
                <client-only>
                    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-[-30px] mr-5">
                        <h2 class="text-2xl font-bold text-gray-800 mb-6">Login to your account</h2>

                        <form @submit.prevent="handleLogin">
                            <div class="mb-4">
                                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                                <input id="email" type="email" v-model="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter your email"/>
                            </div>

                            <div class="mb-6">
                                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                                <input id="password" type="password" v-model="password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter your password"/>
                            </div>

                            <!-- Error Message Display -->
                            <div v-if="error" class="mb-4 error">
                                {{ error }}
                            </div>

                            <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Login
                            </button>

                            <p class="mt-4 text-sm text-center text-gray-600">Forgot your password? <a href="#" class="hover:underline" style="color: #E81A1A;">Click here</a></p>
                            <p class="mt-4 text-center">
                                <NuxtLink to="/register" class="hover:underline" style="color: #E81A1A;">Register</NuxtLink>
                            </p>
                        </form>
                    </div>
                </client-only>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth';

const { email, password, error, handleLogin } = useAuth();

</script>

<style scoped>
.error {
    color: red;
}
</style>
