<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-6 text-slate-900">
    <div class="max-w-2xl w-full text-center">
      <div class="relative">
        <h1 class="text-[12rem] font-black leading-none tracking-tighter text-slate-100 select-none">
          {{ error.statusCode }}
        </h1>
        <div class="absolute inset-0 flex items-center justify-center">
          <p class="text-4xl font-bold tracking-tight px-4 bg-white uppercase">Something's Wrong</p>
        </div>
      </div>

      <div class="mt-10 space-y-4">
        <h2 class="text-2xl font-semibold text-slate-800">
          {{ error.statusCode === 404 ? "We can't find that page" : "Unexpected error occurred" }}
        </h2>
        <p class="text-slate-500 max-w-md mx-auto leading-relaxed">
          {{ error.message || "The link might be broken or the page has been moved to a new location." }}
        </p>
      </div>

      <div class="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button @click="handleClearError" class="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-slate-300 transition-all active:scale-95">
          Take Me Home
        </button>
        <button @click="$router.back()" class="px-8 py-4 border-2 border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['error']);

const handleClearError = () => clearError({ redirect: '/' });
</script>

<style>
/* Optional: Smooth floating animation */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
</style>