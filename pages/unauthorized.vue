<template>
  <div class="min-h-screen relative flex items-center justify-center bg-[#f8fafc] p-6 overflow-hidden">
    <div class="absolute top-[-10%] left-[-10%] w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

    <div class="relative max-w-md w-full bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl p-10 text-center">
      <div class="relative inline-flex mb-8">
        <div class="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-20"></div>
        <div class="relative w-20 h-20 bg-gradient-to-tr from-red-500 to-orange-400 rounded-3xl rotate-12 flex items-center justify-center shadow-lg transform transition hover:rotate-0 duration-500">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 15v2m0-8V7m0 0v2m-9 11h18a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <h1 class="text-3xl font-black text-slate-900 tracking-tight mb-3">Access Denied</h1>
      <p class="text-slate-500 mb-10 leading-relaxed font-medium">
        This area is restricted. Please make sure you are logged into the correct portal.
      </p>

      <div class="space-y-4">
        <div v-if="user?.user_type === 'employee'">
          <NuxtLink to="/employee" class="group flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-xl shadow-slate-200">
            <span>Return to Dashboard</span>
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </NuxtLink>
        </div>
        
        <div v-else-if="user?.user_type === 'admin'">
          <NuxtLink to="/admin" class="group flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-100">
            <span>Admin Control Panel</span>
          </NuxtLink>
        </div>

        <div v-else>
          <NuxtLink to="/" class="block w-full py-4 border-2 border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all">
            Back to Login
          </NuxtLink>
        </div>
      </div>

      <p class="mt-8 text-xs text-slate-400 font-semibold uppercase tracking-widest">Error Code: 403 Forbidden</p>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';

const user = ref(null);

onMounted(() => {
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
  }
});
</script>