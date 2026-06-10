<template>
  <div class="min-h-screen flex bg-slate-50 font-sans">

    <aside class="sidebar w-64 bg-white h-screen fixed flex flex-col z-50 border-r border-slate-200/80">
      <div class="px-5 py-4 flex-shrink-0">
        <div class="profile-card relative flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100/60">

          <div class="avatar-wrapper relative flex-shrink-0">
            <div class="w-11 h-11 rounded-xl overflow-hidden ring-2 ring-blue-200/60 ring-offset-1 ring-offset-white">
              <img
                v-if="currentUser?.profile_image || currentUser?.avatar"
                :src="currentUser?.profile_image || currentUser?.avatar"
                :alt="`${currentUser?.first_name} ${currentUser?.last_name}`"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-sm select-none"
              >
                {{ userInitials }}
              </div>
            </div>
            <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white"></span>
          </div>

          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-slate-800 truncate leading-tight">
              {{ currentUser?.first_name }} {{ currentUser?.last_name }}
            </p>
            <p class="text-[11px] text-blue-500 font-medium truncate leading-snug mt-0.5">
              {{ currentUser?.position || 'Employee' }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="mx-5 h-px bg-slate-100 flex-shrink-0"></div>

      <div class="flex-1 px-3 pb-4 relative z-30 flex flex-col">

        <p class="px-2 mt-4 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 flex-shrink-0">Menu</p>

        <nav class="flex flex-col flex-1">
          <ul class="space-y-0.5">

            <li class="relative z-50" @click="toggleNotifActive">
              <div 
                class="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 cursor-pointer select-none text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                :class="{ 'nav-link--forced-active !text-blue-700 !bg-blue-50 font-semibold': isNotifOpen }"
              >
                <NotificationBell />
              </div>
            </li>

            <li>
              <NuxtLink
                to="/employee"
                class="nav-link group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                :class="{ '!text-slate-500 !bg-transparent font-normal opacity-60': isNotifOpen }"
                active-class="nav-link--active !text-blue-700 !bg-blue-50 font-semibold"
              >
                <span class="nav-icon flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 bg-slate-100 group-hover:bg-blue-100 text-slate-400 group-hover:text-blue-600">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 22 21">
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                  </svg>
                </span>
                <span class="text-sm">Dashboard</span>
              </NuxtLink>
            </li>

            <li>
              <NuxtLink
                to="/employee/tasking"
                class="nav-link group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                :class="{ '!text-slate-500 !bg-transparent font-normal opacity-60': isNotifOpen }"
                active-class="nav-link--active !text-blue-700 !bg-blue-50 font-semibold"
              >
                <span class="nav-icon flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 bg-slate-100 group-hover:bg-blue-100 text-slate-400 group-hover:text-blue-600">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z"/>
                  <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z"/>
                  <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z"/>
                  </svg>
                </span>
                <span class="text-sm">Tasks</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <div class="px-4 py-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0 relative z-20">
        <button
          class="logout-btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 border border-red-100 font-semibold text-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 group"
          @click="handleLogout"
        >
          <svg class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
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
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { logoutUser } from '@/services/authService'
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'

const route = useRoute()
const notifStore = useNotificationStore()
const { unreadCount } = storeToRefs(notifStore)

// State para kontrolin kung kailan ipapakita ang active color sa Notification block
const isNotifOpen = ref(false)

const userCookie = useCookie('user')

const currentUser = computed(() => {
  const rawData = userCookie.value
  if (!rawData) return null

  try {
    const decoded = typeof rawData === 'string' ? decodeURIComponent(rawData) : rawData
    return typeof decoded === 'string' ? JSON.parse(decoded) : decoded
  } catch (error) {
    console.error("Failed to resolve user session profile within layout navigation:", error)
    return null
  }
})

const userInitials = computed(() => {
  const first = currentUser.value?.first_name?.[0] ?? ''
  const last = currentUser.value?.last_name?.[0] ?? ''
  return (first + last).toUpperCase() || '?'
})

// Toggle function kapag pinindot ang notification block area
const toggleNotifActive = () => {
  isNotifOpen.value = !isNotifOpen.value
}

// Kapag lumipat ang user ng page gamit ang Dashboard o Tasks, kailangang patayin ang active style ng Notification automatically
watch(() => route.path, () => {
  isNotifOpen.value = false
})

const handleLogout = async () => {
  await logoutUser()
}

onMounted(() => {
  const user = currentUser.value
  if (user) {
    const userId = user.id || user.user_id

    if (userId) {
      notifStore.fetchNotifications()
      notifStore.listenForNotifications(userId)
    }
  }
})
</script>

<style scoped>
/* ── Active nav link styles ── */
.nav-link--active .nav-icon {
  @apply bg-blue-100 text-blue-700;
}

.nav-link--active {
  position: relative;
}
.nav-link--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  border-radius: 0 3px 3px 0;
  background: #2563eb;
}

/* ── 🔔 Forced Active States para sa Notification Kapag Bukas ── */
.nav-link--forced-active {
  position: relative;
}
.nav-link--forced-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  border-radius: 0 3px 3px 0;
  background: #2563eb;
}

/* Dito pinupwersa nating maging kulay asul ang icon sa loob ng Notification Bell component kapag active siya */
.nav-link--forced-active deep .nav-icon,
.nav-link--forced-active :deep(.nav-icon) {
  @apply bg-blue-100 text-blue-700 !important;
}

.sidebar {
  box-shadow: 1px 0 16px 0 rgba(148, 163, 184, 0.10);
}

.logout-btn:hover svg {
  transform: translateX(2px);
}
</style>