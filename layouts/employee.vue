<template>
  <div class="min-h-screen flex bg-gray-100 font-sans">
    <aside class="w-64 bg-gray-800 text-white h-screen fixed flex flex-col z-50">
      <div class="p-6 flex-1">
        <h2 class="text-xl font-bold mb-8 text-blue-400">Employee Portal</h2>
        <nav>
          <ul class="space-y-2">
            <li>
              <NotificationBell />
            </li>

            <li>
              <NuxtLink to="/employee" class="hover:bg-gray-700 flex items-center p-2 rounded transition">
                <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 22 21"><path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/><path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/></svg>
                <span class="ml-3 text-sm font-medium text-gray-200">Dashboard</span>
              </NuxtLink>
            </li>

            <li>
              <NuxtLink to="/employee/tasking" class="hover:bg-gray-700 flex items-center p-2 rounded transition">
                <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z"/><path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z"/></svg>
                <span class="ml-3 text-sm font-medium text-gray-200">Tasks</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <div class="p-4 border-t border-gray-700">
        <button class="w-full p-2 bg-red-600/80 text-white rounded hover:bg-red-600 transition font-medium text-sm" @click="handleLogout">
          Logout
        </button>
      </div>
    </aside>

    <main class="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { logoutUser } from '@/services/authService'
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'
// Siguraduhin na ang NotificationBell component ay naka-import kung hindi automatic ng Nuxt
// import NotificationBell from '@/components/NotificationBell.vue' 

const notifStore = useNotificationStore()
const { unreadCount } = storeToRefs(notifStore)

const handleLogout = async () => {
  await logoutUser()
}

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    const user = JSON.parse(userData)
    const userId = user.id || user.user_id; 

    if (userId) {
      notifStore.fetchNotifications() 
      notifStore.listenForNotifications(userId) 
    }
  }
})
</script>