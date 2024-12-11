<template>
    <div>
      <h2 class="text-3xl font-bold">Hi, {{userName}}!!</h2>
        <p class="text-xl">Mag aambag ka ba ngayon sa gobyerno?</p>
        <!-- <calendar /> -->
        <TimeIn />
    </div>
</template>

<script setup>
import TimeIn from '@/components/employee/TimeIn.vue';
    definePageMeta({
        layout: 'employee'

    })

    const userName = ref('');

onMounted(() => {
  // Ensure the code only runs on the client side
  if (process.client) {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (user && user.first_name) {
      userName.value = user.first_name; // Retrieve and set the first name
    } else {
      userName.value = 'Guest'; // Fallback in case user is not logged in or first_name is missing
    }
  }
});

</script>

<style scoped>

</style>