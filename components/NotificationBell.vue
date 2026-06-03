<template>
  <div class="w-full">
    <button
      class="w-full flex items-center justify-between transition-all duration-150 text-left select-none outline-none border-none bg-transparent" 
      @click="toggleDropdown"
    >
      <div class="flex items-center">
        <span 
          class="nav-icon flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 bg-slate-100 group-hover:bg-blue-100 text-slate-400 group-hover:text-blue-600"
          :class="{ '!bg-blue-100 !text-blue-700': isOpen || isParentActive }"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </span>
        
        <span class="ml-3 text-sm transition-colors duration-150">
          Notifications
        </span>
      </div>

      <span 
        v-if="notifStore.unreadCount > 0" 
        class="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm flex-shrink-0 mr-1 animate-pulse"
      >
        {{ notifStore.unreadCount }}
      </span>
    </button>

    <div v-if="isOpen" class="fixed inset-0 z-40 bg-transparent" @click="closeDropdown"/>

    <div 
      v-if="isOpen" 
      class="absolute left-full top-0 ml-4 w-80 bg-white rounded-xl shadow-2xl z-50 border border-slate-200 text-slate-800 overflow-hidden flex flex-col popup-panel"
    >
      <div class="p-3 border-b bg-slate-50 flex justify-between items-center">
        <span class="font-bold text-xs text-slate-700">Recent Notifications</span>
        <button 
          v-if="notifStore.unreadCount > 0"
          class="text-[10px] text-blue-600 hover:underline font-bold" 
          @click="notifStore.markAllAsRead"
        >
          Mark all as read
        </button>
      </div>

      <div class="max-h-80 overflow-y-auto divide-y divide-slate-100">
        <div v-if="notifStore.notifications.length === 0" class="p-8 text-center text-slate-400">
          <p class="text-xs italic">No notifications yet.</p>
        </div>

        <div v-else>
          <div 
            v-for="notif in notifStore.notifications.slice(0, 5)" 
            :key="notif.id"
            class="p-3.5 hover:bg-slate-50 cursor-pointer transition relative group/item"
            :class="{ 'bg-blue-50/40': !notif.read_at && notif.is_read === 0 }"
            @click="handleNotifClick(notif)"
          >
            <div v-if="!notif.read_at && notif.is_read === 0" class="absolute top-4 right-3 w-1.5 h-1.5 bg-blue-600 rounded-full"/>
            
            <div class="pr-3">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 uppercase tracking-wider">
                  {{ notif.data?.routeslip_no || notif.routeslip_no }}
                </span>
              </div>
              <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed" :class="{ 'font-semibold text-slate-900': !notif.read_at && notif.is_read === 0 }">
                {{ notif.data?.r_subject || notif.r_subject }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <NuxtLink 
        to="/notifications" 
        class="block p-3 text-center text-xs text-blue-600 font-bold hover:bg-slate-50 border-t border-slate-100 transition" 
        @click="closeDropdown"
      >
        View All Notifications
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import { navigateTo } from '#app'

const notifStore = useNotificationStore()
const isOpen = ref(false)

// Kumukuha ng signal mula sa ginawa nating state sa parent sidebar kung bukas ba ito o hindi
const isParentActive = inject('isNotifOpen', ref(false))

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => { 
  isOpen.value = false 
}

const handleNotifClick = async (notif) => {
  closeDropdown()
  await navigateTo({
    path: '/notifications',
    query: { id: notif.id }
  })
}
</script>

<style scoped>
/* ── Mas pinatinding drop shadow para lumutang sa ibabaw ng main container dashboard ── */
.popup-panel {
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.12);
}
</style>