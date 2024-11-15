<template>
    <div>
        <h1>Unauthorized Access</h1>
        <p>You do not have permission to access this page.</p>
         <!-- Provide links based on user type -->
        <div v-if="user?.user_type === 'employee'">
        <NuxtLink to="/employee">Go to Employee Dashboard</NuxtLink>
        </div>
        <div v-if="user?.user_type === 'admin'">
        <NuxtLink to="/admin">Go to Admin Dashboard</NuxtLink>
        </div>
        <div v-if="user?.user_type === 'chief'">
        <NuxtLink to="/chief">Go to Chief Dashboard</NuxtLink>
        </div>
        <!-- If not logged in, provide a login link -->
        <div v-if="!user">
        <NuxtLink to="/">Go to Login</NuxtLink>
        </div>
    </div>
</template>

<script setup>
const user = process.client ? JSON.parse(localStorage.getItem('user') || '{}') : null;
</script>

<style scoped>

</style> 