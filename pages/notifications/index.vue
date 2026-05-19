<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto relative">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Notifications</h1>
        <p class="text-gray-500 mt-1">Manage and view all your system activities and alerts.</p>
      </div>
    </div>
    <div class="mb-6 relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="Search by Routeslip No, Subject, or Instructions..."
        class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm shadow-sm transition-all"
      >
    </div>

    <div v-if="notifStore.loading" class="p-20 text-center bg-white rounded-2xl border border-gray-100">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"/>
      <p class="mt-4 text-gray-500 font-medium">Fetching your updates...</p>
    </div>

    <div v-else-if="notifStore.notifications.length === 0" class="p-24 text-center bg-white rounded-2xl border border-gray-100">
      <div class="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-800">All caught up!</h3>
      <p class="text-gray-400 text-sm">No notifications found in your history.</p>
    </div>

    <div v-else class="space-y-8">
      <div v-if="unreadNotifications.length > 0">
        <h3 class="text-xs font-black text-blue-600 uppercase tracking-[2px] mb-4 flex items-center gap-2">
          Unread
          <span class="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px]">{{ unreadNotifications.length }}</span>
        </h3>
        <div class="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden divide-y divide-blue-50">
          <div 
            v-for="notif in unreadNotifications" 
            :key="notif.id"
            class="p-6 hover:bg-blue-50/30 transition cursor-pointer flex gap-4 items-start relative group bg-blue-50/10"
            @click="handleNotifClick(notif)"
          >
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"/>
            <div class="flex-1">
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center gap-3">
                  <span class="text-[10px] font-black px-2 py-0.5 rounded bg-blue-100 text-blue-700 uppercase tracking-widest">{{ notif.routeslip_no }}</span>
                  <span class="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-500 uppercase">{{ notif.urgency }}</span>
                </div>
                <time class="text-[11px] text-gray-400 font-medium">{{ formatTimestamp(notif.updated_at) }}</time>
              </div>
              <h4 class="text-sm font-bold text-blue-900 mb-1 leading-snug">{{ notif.r_subject }}</h4>
              <p class="text-[11px] text-gray-500 italic">Received: {{ formatTimestamp(notif.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="readNotifications.length > 0">
        <h3 class="text-xs font-black text-gray-400 uppercase tracking-[2px] mb-4">Read</h3>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50 opacity-80 hover:opacity-100 transition-opacity">
          <div 
            v-for="notif in readNotifications" 
            :key="notif.id"
            class="p-6 hover:bg-gray-50 transition cursor-pointer flex gap-4 items-start relative group"
            @click="handleNotifClick(notif)"
          >
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-gray-200"/>
            <div class="flex-1">
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center gap-3">
                  <span class="text-[10px] font-black px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase tracking-widest">{{ notif.routeslip_no }}</span>
                  <span class="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-50 text-gray-400 uppercase">{{ notif.urgency }}</span>
                </div>
                <time class="text-[11px] text-gray-400 font-medium">{{ formatTimestamp(notif.updated_at) }}</time>
              </div>
              <h4 class="text-sm font-bold text-gray-700 mb-1 leading-snug">{{ notif.r_subject }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="slide">
      <div v-if="selectedNotif" class="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] z-[60] flex flex-col border-l border-gray-100">
        <div class="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 class="font-black text-gray-900 text-lg">Routeslip Details</h3>
            <p class="text-xs text-blue-600 font-bold tracking-widest uppercase">{{ selectedNotif.routeslip_no }}</p>
          </div>
          <button class="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-600" @click="selectedNotif = null">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-8 space-y-8">
          <section>
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">Subject</label>
            <h2 class="mt-2 text-md font-bold text-gray-800 leading-relaxed">{{ selectedNotif.r_subject }}</h2>
          </section>

          <section>
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">Instructions</label>
            <div class="mt-2 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
              <p class="text-sm text-gray-700 leading-relaxed italic">
                {{ (selectedNotif.r_instructions && selectedNotif.r_instructions !== 'N/A') ? selectedNotif.r_instructions : 'No specific instructions provided.' }}
              </p>
            </div>
          </section>

          <div class="grid grid-cols-2 gap-6">
            <section>
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">Assigned Focal</label>
              <p class="mt-1 text-sm font-semibold text-gray-700">{{ selectedNotif.assigned_focal_name }}</p>
            </section>
            <section>
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">Urgency</label>
              <p class="mt-1 text-sm font-bold" :class="selectedNotif.urgency === 'High' ? 'text-red-600' : 'text-green-600'">
                {{ selectedNotif.urgency }}
              </p>
            </section>
            <section>
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">Current Status</label>
              <p class="mt-1 text-sm font-medium text-gray-700">{{ selectedNotif.status }}</p>
            </section>
            <section>
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">Action Taken</label>
              <p class="mt-1 text-sm font-medium text-gray-700">{{ selectedNotif.r_action_taken || 'None yet' }}</p>
            </section>
          </div>

          <section class="pt-4">
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] mb-3 block">Document Reference</label>
            <button 
              v-if="hasReference(selectedNotif.reference)"
              class="flex items-center justify-center gap-3 w-full p-4 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition shadow-lg active:scale-[0.98]" 
              @click="openReference(selectedNotif.reference)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Document Reference
            </button>
            <div v-else class="p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400 italic text-xs">
              No reference link available.
            </div>
          </section>
        </div>

      <div class="p-6 border-t bg-gray-50 flex gap-3">
        <button 
          @click="handleCreateTask"
          class="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-md active:scale-95"
        >
          Create Task to take action
        </button>
      </div>
      </div>
    </Transition>

    <div v-if="selectedNotif" class="fixed inset-0 bg-black/10 z-[50] transition-opacity" @click="selectedNotif = null"/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import { useRoute } from 'vue-router';
const notifStore = useNotificationStore();
const selectedNotif = ref(null);
const route = useRoute();
const searchQuery = ref('');

const userCookie = useCookie('user');

definePageMeta({ layout: 'employee' });

const filteredNotifications = computed(() => {
  if (!searchQuery.value) return notifStore.notifications;
  
  const query = searchQuery.value.toLowerCase();
  return notifStore.notifications.filter(n => {
    return (
      n.routeslip_no?.toLowerCase().includes(query) ||
      n.r_subject?.toLowerCase().includes(query) ||
      n.r_instructions?.toLowerCase().includes(query) ||
      n.assigned_focal_name?.toLowerCase().includes(query)
    );
  });
});

const unreadNotifications = computed(() => 
  filteredNotifications.value.filter(n => !n.read_at && n.is_read === 0)
);

const readNotifications = computed(() => 
  filteredNotifications.value.filter(n => n.read_at || n.is_read === 1)
);
const handleNotifClick = async (notif) => {
  if (notif.is_read === 0 || !notif.read_at) {
    await notifStore.markAsRead(notif.id); 
  }
  selectedNotif.value = notif;
};

const checkQueryParam = () => {
  const idFromQuery = route.query.id;
  if (idFromQuery) {
    const targetNotif = notifStore.notifications.find(n => n.id == idFromQuery);
    if (targetNotif) {
      handleNotifClick(targetNotif);
    }
  }
};

const hasReference = (ref) => {
  return ref && ref !== '-' && ref !== 'N/A' && ref.startsWith('http');
};

const handleCreateTask = () => {
  // Guard clause: Siguraduhing may napiling notification bago mag-redirect
  if (!selectedNotif.value) return;

  const notif = selectedNotif.value;

  // Programmatic Navigation
  navigateTo({
    path: '/employee/tasking',
    query: {
      subject: notif.r_subject,
      paps: 'Routeslips',
      ref_no: notif.routeslip_no // Dinagdag ko na rin ito para complete reference
    }
  });
};

const openReference = (url) => {
  if (!url) return;
  const width = 1100;
  const height = 900;
  const left = (window.innerWidth - width) / 2 + window.screenX;
  const top = (window.innerHeight - height) / 2 + window.screenY;
  window.open(url, 'DocRef', `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`);
};

const goToRecord = (notif) => {
  // Resolve core account identities directly through cookie string extraction
  const rawData = userCookie.value;
  let user = {};

  if (rawData) {
    try {
      const decoded = typeof rawData === 'string' ? decodeURIComponent(rawData) : rawData;
      user = typeof decoded === 'string' ? JSON.parse(decoded) : decoded;
    } catch (e) {
      console.error("Failed to parse user profile context in notification layout:", e);
    }
  }

  // Redirect cleanly based on evaluated profile access roles
  return navigateTo(`/${user?.user_type || 'employee'}/routeslips/${notif.id}`);
};

const formatTimestamp = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
};

onMounted(async () => {
  await notifStore.fetchNotifications();
  checkQueryParam();
});
watch(() => route.query.id, () => {
  checkQueryParam();
});
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>