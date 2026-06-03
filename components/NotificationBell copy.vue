<template>
  <div class="relative">
    <button
class="w-full hover:bg-gray-700 flex items-center justify-between p-2 rounded group transition text-left" 
      @click="isOpen = !isOpen">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        <span class="ml-2 font-medium">Notifications</span>
      </div>
      <span v-if="notifStore.unreadCount > 0" class="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
        {{ notifStore.unreadCount }}
      </span>
    </button>

    <div v-if="isOpen" class="fixed inset-0 z-10 bg-transparent" @click="closeDropdown"/>

    <div v-if="isOpen" class="absolute left-full top-0 ml-2 w-80 bg-white rounded-xl shadow-2xl z-20 border border-gray-200 text-gray-800 overflow-hidden flex flex-col">
      <div class="p-3 border-b bg-gray-50 flex justify-between items-center">
        <span class="font-bold text-sm">Recent</span>
        <button 
          v-if="notifStore.unreadCount > 0"
          class="text-[10px] text-blue-600 hover:underline font-bold" 
          @click="notifStore.markAllAsRead"
        >
          Mark all as read
        </button>
      </div>

      <div class="max-h-80 overflow-y-auto">
        <div v-if="notifStore.notifications.length === 0" class="p-8 text-center text-gray-400">
          <p class="text-xs italic">No notifications yet.</p>
        </div>

        <div v-else class="divide-y divide-gray-50">
        <div 
        v-for="notif in notifStore.notifications.slice(0, 5)" 
        :key="notif.id"
        class="p-4 hover:bg-blue-50/50 cursor-pointer transition relative group"
        :class="{ 'bg-blue-50/30': !notif.read_at && notif.is_read === 0 }"
        @click="handleNotifClick(notif)"
        >
            <div v-if="!notif.read_at && notif.is_read === 0" class="absolute top-4 right-3 w-2 h-2 bg-blue-600 rounded-full"/>
            
            <div class="pr-4">
            <div class="flex items-center gap-2 mb-1">
                <span class="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase">
                {{ notif.data?.routeslip_no || notif.routeslip_no }}
                </span>
            </div>
            <p class="text-xs text-gray-800 line-clamp-2" :class="{ 'font-bold': !notif.read_at && notif.is_read === 0 }">
                {{ notif.data?.r_subject || notif.r_subject }}
            </p>
            </div>
        </div>
        </div>
      </div>

      <NuxtLink 
        to="/notifications" 
        class="block p-3 text-center text-xs text-blue-600 font-bold hover:bg-gray-50 border-t" 
        @click="closeDropdown"
      >
        View All Notifications
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import { navigateTo } from '#app'
const notifStore = useNotificationStore()
const isOpen = ref(false)

const closeDropdown = () => { isOpen.value = false }

const handleNotifClick = async (notif) => {
  isOpen.value = false; // Close dropdown

  // I-redirect lang sa notifications page na may ID
  await navigateTo({
    path: '/notifications',
    query: { id: notif.id } // Gagamit tayo ng ?id=5
  });
};
</script>