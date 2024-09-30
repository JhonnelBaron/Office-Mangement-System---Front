<!-- layouts/admin.vue -->
<template>
    <div class="min-h-screen flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-gray-800 text-white min-h-screen">
        <div class="p-6">
          <h2 class="text-xl font-bold mb-8">Admin Dashboard</h2>
          <nav>
            <ul>
              <li class="mb-4">
                <NuxtLink to="/admin" class="hover:bg-gray-700 block p-2 rounded">Dashboard</NuxtLink>
              </li>
              <li class="mb-4">
                <NuxtLink to="/admin/users" class="hover:bg-gray-700 block p-2 rounded">Users</NuxtLink>
              </li>
              <!-- Add more links as needed -->
            </ul>
          </nav>
        </div>
        <div class="p-4">
        <button @click="handleLogout" class="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700 mb-0">
          Logout
        </button>
      </div>
      </aside>
  
      <!-- Main Content Area -->
      <main class="flex-1 bg-gray-100 p-8">
        <NuxtPage />
      </main>
    </div>
  </template>

<script setup>
import { logoutUser } from '@/services/authService'; // Import the logout function

const handleLogout = async () => {
  await logoutUser(); // Call the logout function
};
</script>
  
  <style scoped>
  /* Styling for the admin layout can be customized here */
  </style>
  