<template>
    <div>
      <h1 class="text-2xl font-bold mb-6">Pending Users</h1>
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full bg-white">
          <thead>
            <tr>
              <th class="py-2 px-4 bg-gray-200 text-left">Date</th>
              <th class="py-2 px-4 bg-gray-200 text-left">Name</th>
              <th class="py-2 px-4 bg-gray-200 text-left">Email</th>
              <th class="py-2 px-4 bg-gray-200 text-left">Status</th>
              <th class="py-2 px-4 bg-gray-200 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in pendingUsers" :key="user.id" class="border-b">
              <td class="py-2 px-4">{{ formatDate(user.created_at) }}</td>
              <td class="py-2 px-4">{{ user.name }}</td>
              <td class="py-2 px-4">{{ user.email }}</td>
              <td class="py-2 px-4">{{ user.status }}</td>
              <td class="py-2 px-4">
                <button
                  @click="activateUser(user.id)"
                  class="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Activate
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>

<script setup>
    definePageMeta({
        layout: 'admin'
    })

    import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

const pendingUsers = ref([]);
const { $api } = useNuxtApp();

// Fetch pending users on page load
onMounted(async () => {
  try {
    const response = await $api.get('/getPending');
    pendingUsers.value = response.data.registered.data;
  } catch (error) {
    console.error('Failed to fetch pending users:', error);
  }
});

// Function to activate a user
const activateUser = async (userId) => {
  try {
    await $api.post(`/activate/${userId}`);
    pendingUsers.value = pendingUsers.value.filter(user => user.id !== userId);
    alert('User activated successfully.');
  } catch (error) {
    console.error('Failed to activate user:', error);
    alert('Activation failed.');
  }
};

// Function to format the date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>

<style scoped>

</style>