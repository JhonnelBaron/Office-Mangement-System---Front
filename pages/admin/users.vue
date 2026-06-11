<template>
  <div class="users-page">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="page-title-group">
        <div class="page-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <div>
          <h1 class="page-title">User Management</h1>
          <p class="page-subtitle">Review and activate pending user registrations.</p>
        </div>
      </div>

      <div class="header-right">
        <div class="date-chip">
          <span class="live-dot"></span>
          {{ formatDate(new Date()) }}
        </div>
        <button class="refresh-btn" :class="{ 'refresh-btn--spinning': isRefreshing }" @click="fetchUsers(true)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/>
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- ── Stat Cards ── -->
    <div class="stats-grid">
      <div class="stat-card stat-card--amber">
        <div class="stat-card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="stat-card-body">
          <p class="stat-label">Pending</p>
          <p class="stat-value">{{ pendingUsers.length }}</p>
          <p class="stat-sub">Awaiting activation</p>
        </div>
      </div>

      <div class="stat-card stat-card--blue">
        <div class="stat-card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <div class="stat-card-body">
          <p class="stat-label">Registered Today</p>
          <p class="stat-value">{{ registeredToday }}</p>
          <p class="stat-sub">New sign-ups</p>
        </div>
      </div>

      <div class="stat-card stat-card--green">
        <div class="stat-card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="stat-card-body">
          <p class="stat-label">Activated This Session</p>
          <p class="stat-value">{{ activatedThisSession }}</p>
          <p class="stat-sub">Since page load</p>
        </div>
      </div>
    </div>

    <!-- ── Main Panel ── -->
    <div class="panel">

      <!-- Panel Header -->
      <div class="panel-header">
        <div class="panel-header-left">
          <div class="panel-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <div>
            <h3 class="panel-title">Pending Registrations</h3>
            <p class="panel-sub">
              {{ filteredUsers.length }} user{{ filteredUsers.length !== 1 ? 's' : '' }} found
            </p>
          </div>
        </div>

        <!-- Search + filter row -->
        <div class="panel-controls">
          <div class="search-wrap">
            <span class="search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"/>
                <path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name or email…"
              class="search-input"
            />
            <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="filter-group">
            <label class="filter-label">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
              </svg>
              Sort
            </label>
            <select v-model="sortOrder" class="filter-select">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">By name</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading skeletons -->
      <div v-if="isLoading" class="table-wrap">
        <table class="users-table">
          <thead>
            <tr>
              <th>Registered</th>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="n in 4" :key="n" class="skeleton-row">
              <td><div class="skeleton skeleton--date"></div></td>
              <td>
                <div class="skeleton-emp">
                  <div class="skeleton skeleton--avatar"></div>
                  <div class="skeleton skeleton--name"></div>
                </div>
              </td>
              <td><div class="skeleton skeleton--email"></div></td>
              <td><div class="skeleton skeleton--badge"></div></td>
              <td><div class="skeleton skeleton--btn"></div></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredUsers.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <h3 class="empty-title">
          {{ searchQuery ? 'No users match your search' : 'No pending users' }}
        </h3>
        <p class="empty-sub">
          {{ searchQuery ? 'Try a different name or email.' : 'All registrations have been reviewed.' }}
        </p>
      </div>

      <!-- Table -->
      <div v-else class="table-wrap">
        <table class="users-table">
          <thead>
            <tr>
              <th>Registered</th>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="data-row"
              :class="{ 'data-row--activating': activatingId === user.id }"
            >
              <!-- Date -->
              <td class="td-date">
                <div class="date-block">
                  <span class="date-primary">{{ formatDateShort(user.created_at) }}</span>
                  <span class="date-secondary">{{ timeAgo(user.created_at) }}</span>
                </div>
              </td>

              <!-- User -->
              <td class="td-user">
                <div class="user-cell">
                  <div class="user-avatar">{{ nameInitials(user.name) }}</div>
                  <div class="user-info">
                    <span class="user-name">{{ user.name }}</span>
                    <span class="user-id">ID #{{ user.id }}</span>
                  </div>
                </div>
              </td>

              <!-- Email -->
              <td class="td-email">
                <a :href="`mailto:${user.email}`" class="email-link">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  {{ user.email }}
                </a>
              </td>

              <!-- Status -->
              <td class="td-status">
                <span class="status-badge badge--pending">
                  <span class="status-dot"></span>
                  {{ user.status ?? 'Pending' }}
                </span>
              </td>

              <!-- Action -->
              <td class="td-action">
                <button
                  class="activate-btn"
                  :class="{ 'activate-btn--loading': activatingId === user.id }"
                  :disabled="activatingId === user.id"
                  @click="activateUser(user.id)"
                >
                  <template v-if="activatingId === user.id">
                    <svg class="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" d="M12 2a10 10 0 0 1 10 10"/>
                    </svg>
                    Activating…
                  </template>
                  <template v-else>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Activate
                  </template>
                </button>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- ── Toast Notification ── -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
          <div class="toast-icon">
            <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <span class="toast-msg">{{ toast.message }}</span>
          <button class="toast-close" @click="toast.show = false">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Confirm Modal ── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="confirmModal.show" class="modal-overlay" @click.self="confirmModal.show = false">
          <div class="modal-panel">
            <div class="modal-header">
              <div class="modal-header-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <div>
                <h3 class="modal-title">Confirm Activation</h3>
                <p class="modal-sub">This action will grant portal access to the user.</p>
              </div>
            </div>

            <div class="modal-body">
              <div class="confirm-user-card">
                <div class="confirm-avatar">{{ nameInitials(confirmModal.user?.name) }}</div>
                <div>
                  <p class="confirm-name">{{ confirmModal.user?.name }}</p>
                  <p class="confirm-email">{{ confirmModal.user?.email }}</p>
                </div>
              </div>
              <p class="confirm-warning">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                The user will be able to log in immediately after activation.
              </p>
            </div>

            <div class="modal-footer">
              <button class="btn-cancel" @click="confirmModal.show = false">Cancel</button>
              <button class="btn-confirm" @click="confirmActivate">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                Confirm Activation
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useNuxtApp } from '#app';

definePageMeta({ layout: 'admin' });

const { $api } = useNuxtApp();

/* ── State ── */
const pendingUsers       = ref([]);
const isLoading          = ref(false);
const isRefreshing       = ref(false);
const activatingId       = ref(null);
const activatedThisSession = ref(0);
const searchQuery        = ref('');
const sortOrder          = ref('newest');

const toast = reactive({ show: false, message: '', type: 'success' });
const confirmModal = reactive({ show: false, userId: null, user: null });

/* ── Computed ── */
const registeredToday = computed(() => {
  const today = new Date().toLocaleDateString('en-CA');
  return pendingUsers.value.filter(u =>
    new Date(u.created_at).toLocaleDateString('en-CA') === today
  ).length;
});

const filteredUsers = computed(() => {
  let list = [...pendingUsers.value];

  // Search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(u =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sortOrder.value === 'newest') {
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortOrder.value === 'oldest') {
    list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else if (sortOrder.value === 'name') {
    list.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
  }

  return list;
});

/* ── Helpers ── */
const nameInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

const formatDateShort = (d) =>
  new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const showToast = (message, type = 'success') => {
  toast.message = message;
  toast.type    = type;
  toast.show    = true;
  setTimeout(() => { toast.show = false; }, 3500);
};

/* ── Data fetching ── */
const fetchUsers = async (isRefresh = false) => {
  if (isRefresh) isRefreshing.value = true;
  else isLoading.value = true;
  try {
    const response = await $api.get('/getPending');
    pendingUsers.value = response.data.registered.data;
  } catch (error) {
    console.error('Failed to fetch pending users:', error);
    showToast('Failed to load users. Please try again.', 'error');
  } finally {
    isLoading.value   = false;
    isRefreshing.value = false;
  }
};

/* ── Activation flow ── */
const activateUser = (userId) => {
  const user = pendingUsers.value.find(u => u.id === userId);
  confirmModal.userId = userId;
  confirmModal.user   = user ?? null;
  confirmModal.show   = true;
};

const confirmActivate = async () => {
  const userId = confirmModal.userId;
  confirmModal.show = false;
  activatingId.value = userId;
  try {
    await $api.post(`/activate/${userId}`);
    pendingUsers.value = pendingUsers.value.filter(u => u.id !== userId);
    activatedThisSession.value++;
    showToast('User activated successfully.', 'success');
  } catch (error) {
    console.error('Failed to activate user:', error);
    showToast('Activation failed. Please try again.', 'error');
  } finally {
    activatingId.value = null;
  }
};

onMounted(() => fetchUsers());
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ── Root ── */
.users-page {
  padding: 28px 32px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* ── Page Header ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e8ecf4;
}
.page-title-group { display: flex; align-items: center; gap: 14px; }
.page-icon {
  width: 44px; height: 44px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: white; flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
}
.page-title    { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.4px; margin: 0 0 3px; }
.page-subtitle { font-size: 13px; color: #94a3b8; font-weight: 500; margin: 0; }
.header-right  { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.date-chip {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 12.5px; font-weight: 600; color: #475569;
  background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 20px; padding: 6px 14px; white-space: nowrap;
}
.live-dot {
  width: 7px; height: 7px; background: #22c55e;
  border-radius: 50%; animation: pulse 2s infinite;
}
@keyframes pulse {
  0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(34,197,94,.5); }
  50%      { opacity:.8; box-shadow: 0 0 0 5px rgba(34,197,94,0); }
}
.refresh-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 10px; font-size: 13px; font-weight: 600; font-family: inherit;
  color: #475569; cursor: pointer; transition: all 0.15s ease;
}
.refresh-btn:hover { background: #f1f5f9; color: #1e293b; }
.refresh-btn svg { transition: transform 0.3s ease; }
.refresh-btn--spinning svg { animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Stat Cards ── */
.stats-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
}
@media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } }

.stat-card {
  border-radius: 14px; padding: 18px 16px;
  display: flex; flex-direction: column; gap: 10px;
  border: 1px solid transparent; position: relative; overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,23,42,0.1); }
.stat-card::after {
  content: ''; position: absolute; top: -20px; right: -20px;
  width: 70px; height: 70px; border-radius: 50%; opacity: 0.12; background: currentColor;
}
.stat-card--amber { background: #fffbeb; border-color: #fde68a; color: #d97706; }
.stat-card--blue  { background: #eff6ff; border-color: #bfdbfe; color: #2563eb; }
.stat-card--green { background: #f0fdf4; border-color: #86efac; color: #16a34a; }

.stat-card-icon {
  width: 34px; height: 34px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.7); color: inherit;
}
.stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: inherit; opacity: 0.7; margin: 0 0 4px; }
.stat-value { font-size: 32px; font-weight: 800; color: inherit; line-height: 1; margin: 0 0 4px; letter-spacing: -1px; }
.stat-sub   { font-size: 11px; font-weight: 500; color: inherit; opacity: 0.6; margin: 0; }

/* ── Panel ── */
.panel {
  background: #ffffff; border: 1px solid #e8ecf4;
  border-radius: 16px; overflow: hidden;
  box-shadow: 0 1px 4px rgba(15,23,42,0.04);
}
.panel-header {
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 12px; padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9; background: #fafbfe;
}
.panel-header-left { display: flex; align-items: center; gap: 12px; }
.panel-icon {
  width: 32px; height: 32px; border-radius: 8px;
  background: #dbeafe; color: #2563eb;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.panel-title { font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 2px; }
.panel-sub   { font-size: 11.5px; color: #94a3b8; margin: 0; }
.panel-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

/* Search */
.search-wrap { position: relative; display: flex; align-items: center; }
.search-icon {
  position: absolute; left: 12px; color: #94a3b8;
  pointer-events: none; display: flex; align-items: center;
}
.search-input {
  padding: 8px 34px 8px 36px; border: 1px solid #e2e8f0; border-radius: 10px;
  font-size: 12.5px; font-family: inherit; font-weight: 500;
  color: #1e293b; background: #f8fafc; outline: none; width: 220px; transition: all 0.15s ease;
}
.search-input::placeholder { color: #94a3b8; }
.search-input:focus {
  border-color: #3b82f6; background: #fff;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1); width: 260px;
}
.search-clear {
  position: absolute; right: 10px; width: 20px; height: 20px; border-radius: 5px;
  border: none; background: #e2e8f0; color: #64748b;
  display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s;
}
.search-clear:hover { background: #fecaca; color: #dc2626; }

/* Sort filter */
.filter-group { display: flex; align-items: center; gap: 6px; }
.filter-label {
  display: flex; align-items: center; gap: 4px;
  font-size: 11.5px; font-weight: 600; color: #64748b; white-space: nowrap;
}
.filter-select {
  padding: 7px 11px; border: 1px solid #e2e8f0; border-radius: 9px;
  font-size: 12.5px; font-family: inherit; font-weight: 500;
  color: #1e293b; background: #f8fafc; outline: none; cursor: pointer; transition: all 0.15s;
}
.filter-select:focus {
  border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}

/* ── Table ── */
.table-wrap { overflow-x: auto; }
.users-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.users-table thead th {
  position: sticky; top: 0; z-index: 2;
  padding: 10px 16px; text-align: left;
  font-size: 10.5px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: #94a3b8;
  background: #f8fafc; border-bottom: 1px solid #f1f5f9; white-space: nowrap;
}
.data-row {
  border-bottom: 1px solid #f8fafc;
  transition: background 0.1s ease;
}
.data-row:last-child { border-bottom: none; }
.data-row:hover { background: #f8fafc; }
.data-row--activating { opacity: 0.6; pointer-events: none; }
.users-table td { padding: 13px 16px; vertical-align: middle; }

/* Date cell */
.td-date { white-space: nowrap; }
.date-block { display: flex; flex-direction: column; gap: 2px; }
.date-primary   { font-size: 13px; font-weight: 600; color: #334155; }
.date-secondary { font-size: 11px; color: #94a3b8; font-weight: 500; }

/* User cell */
.td-user {}
.user-cell { display: flex; align-items: center; gap: 10px; }
.user-avatar {
  width: 34px; height: 34px; border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white; font-size: 11.5px; font-weight: 800;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.user-info { display: flex; flex-direction: column; gap: 1px; }
.user-name  { font-size: 13px; font-weight: 700; color: #1e293b; white-space: nowrap; }
.user-id    { font-size: 10.5px; color: #94a3b8; font-weight: 500; }

/* Email cell */
.td-email {}
.email-link {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12.5px; font-weight: 500; color: #2563eb;
  text-decoration: none; transition: color 0.15s;
}
.email-link:hover { color: #1d4ed8; text-decoration: underline; }

/* Status badge */
.td-status {}
.status-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 700;
  border: 1px solid transparent;
}
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.badge--pending { background: #fffbeb; color: #d97706; border-color: #fde68a; }

/* Activate button */
.td-action {}
.activate-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 16px; font-size: 12.5px; font-weight: 700;
  border-radius: 9px; border: none; cursor: pointer; font-family: inherit;
  background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white;
  box-shadow: 0 3px 10px rgba(37,99,235,0.3); transition: all 0.2s ease;
}
.activate-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  box-shadow: 0 5px 16px rgba(37,99,235,0.4);
  transform: translateY(-1px);
}
.activate-btn--loading { opacity: 0.75; cursor: not-allowed; }
.activate-btn:disabled { cursor: not-allowed; }
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.7s linear infinite; }

/* ── Empty State ── */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  gap: 10px; padding: 64px 32px; text-align: center;
}
.empty-icon {
  width: 60px; height: 60px; background: #f1f5f9; border-radius: 16px;
  display: flex; align-items: center; justify-content: center; color: #cbd5e1; margin-bottom: 4px;
}
.empty-title { font-size: 16px; font-weight: 700; color: #334155; margin: 0; }
.empty-sub   { font-size: 13px; color: #94a3b8; margin: 0; }

/* ── Skeleton ── */
.skeleton-row td { padding: 14px 16px; }
.skeleton {
  border-radius: 6px; margin: 0;
  background: linear-gradient(90deg, #f1f5f9 25%, #e8ecf4 50%, #f1f5f9 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite; height: 13px;
}
.skeleton--date   { width: 90px; }
.skeleton--avatar { width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0; }
.skeleton--name   { width: 120px; }
.skeleton--email  { width: 160px; }
.skeleton--badge  { width: 70px; height: 22px; border-radius: 20px; }
.skeleton--btn    { width: 86px; height: 32px; border-radius: 9px; }
.skeleton-emp { display: flex; align-items: center; gap: 10px; }
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Toast ── */
.toast {
  position: fixed; bottom: 28px; right: 28px; z-index: 300;
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; border-radius: 12px; font-size: 13px; font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 8px 30px rgba(15,23,42,0.15); min-width: 260px;
  border: 1px solid transparent;
}
.toast--success { background: #f0fdf4; color: #15803d; border-color: #86efac; }
.toast--error   { background: #fff1f2; color: #be123c; border-color: #fecdd3; }
.toast-icon { display: flex; flex-shrink: 0; }
.toast-msg  { flex: 1; }
.toast-close {
  width: 20px; height: 20px; border-radius: 5px; border: none; background: transparent;
  color: inherit; opacity: 0.6; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: opacity 0.15s;
}
.toast-close:hover { opacity: 1; }

/* Toast animation */
.toast-enter-active { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
.toast-leave-active { transition: all 0.2s ease-in; }
.toast-enter-from   { transform: translateY(16px); opacity: 0; }
.toast-leave-to     { transform: translateY(8px); opacity: 0; }

/* ── Confirm Modal ── */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,0.55);
  backdrop-filter: blur(4px); z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.modal-panel {
  background: #fff; border-radius: 20px; width: 100%; max-width: 440px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 24px 80px rgba(15,23,42,0.18); overflow: hidden;
}
.modal-header {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 20px 24px 16px; border-bottom: 1px solid #f1f5f9; background: #fafbfe;
}
.modal-header-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: #dbeafe; color: #2563eb;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;
}
.modal-title { font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 3px; }
.modal-sub   { font-size: 12px; color: #94a3b8; margin: 0; }
.modal-body  { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }

.confirm-user-card {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; background: #f8fafc;
  border: 1px solid #e8ecf4; border-radius: 12px;
}
.confirm-avatar {
  width: 40px; height: 40px; border-radius: 11px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white; font-size: 13px; font-weight: 800;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.confirm-name  { font-size: 14px; font-weight: 700; color: #1e293b; margin: 0 0 2px; }
.confirm-email { font-size: 12px; color: #64748b; margin: 0; }

.confirm-warning {
  display: flex; align-items: center; gap: 7px;
  font-size: 12px; color: #64748b; background: #fffbeb;
  border: 1px solid #fde68a; border-radius: 9px; padding: 10px 13px; margin: 0;
}
.confirm-warning svg { color: #d97706; flex-shrink: 0; }

.modal-footer {
  display: flex; justify-content: flex-end; align-items: center; gap: 10px;
  padding: 14px 24px 20px; border-top: 1px solid #f1f5f9;
}
.btn-cancel {
  padding: 9px 18px; font-size: 13px; font-weight: 600; border-radius: 10px;
  border: 1px solid #e2e8f0; background: #f8fafc; color: #64748b;
  cursor: pointer; font-family: inherit; transition: all 0.15s;
}
.btn-cancel:hover { background: #f1f5f9; color: #1e293b; }
.btn-confirm {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 20px; font-size: 13px; font-weight: 700; border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none;
  cursor: pointer; font-family: inherit;
  box-shadow: 0 4px 12px rgba(37,99,235,0.3); transition: all 0.2s ease;
}
.btn-confirm:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  box-shadow: 0 6px 18px rgba(37,99,235,0.4); transform: translateY(-1px);
}

/* Modal fade */
.fade-enter-active { transition: opacity 0.25s ease; }
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>