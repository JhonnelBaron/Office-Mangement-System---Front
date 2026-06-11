<template>
  <div class="dashboard">

    <!-- ── Welcome Banner ── -->
    <div class="welcome-banner">
      <div class="welcome-left">
        <div class="welcome-avatar">AD</div>
        <div>
          <h1 class="welcome-title">Good {{ timeOfDay }}, <span class="welcome-name">Administrator</span> 👋</h1>
          <p class="welcome-sub">Here's a real-time overview of your system and team activity.</p>
        </div>
      </div>
      <div class="welcome-right">
        <div class="date-chip">
          <span class="live-dot"></span>
          {{ formatDate(new Date()) }}
        </div>
        <button class="refresh-btn" :class="{ 'refresh-btn--spinning': isRefreshing }" @click="refreshAll">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/>
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- ── KPI Stat Cards ── -->
    <div class="stats-grid">

      <div class="stat-card stat-card--blue">
        <div class="stat-card-top">
          <div class="stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <NuxtLink to="/admin/users" class="stat-view-link">View all →</NuxtLink>
        </div>
        <p class="stat-value">{{ stats.totalUsers }}</p>
        <p class="stat-label">Total Users</p>
        <p class="stat-sub">Registered in system</p>
      </div>

      <div class="stat-card stat-card--amber">
        <div class="stat-card-top">
          <div class="stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <NuxtLink to="/admin/users" class="stat-view-link">Review →</NuxtLink>
        </div>
        <p class="stat-value">{{ stats.pendingUsers }}</p>
        <p class="stat-label">Pending Activation</p>
        <p class="stat-sub">Awaiting approval</p>
      </div>

      <div class="stat-card stat-card--green">
        <div class="stat-card-top">
          <div class="stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
        <p class="stat-value">{{ stats.activeUsers }}</p>
        <p class="stat-label">Active Users</p>
        <p class="stat-sub">Successfully activated</p>
      </div>

      <div class="stat-card stat-card--purple">
        <div class="stat-card-top">
          <div class="stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
        </div>
        <p class="stat-value">{{ stats.totalTasksToday }}</p>
        <p class="stat-label">Tasks Created Today</p>
        <p class="stat-sub">Across all employees</p>
      </div>

      <div class="stat-card stat-card--teal">
        <div class="stat-card-top">
          <div class="stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>
        <p class="stat-value">{{ stats.presentToday }}</p>
        <p class="stat-label">Present Today</p>
        <p class="stat-sub">Logged time-in today</p>
      </div>

      <div class="stat-card stat-card--red">
        <div class="stat-card-top">
          <div class="stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
            </svg>
          </div>
        </div>
        <p class="stat-value">{{ stats.absentToday }}</p>
        <p class="stat-label">Absent Today</p>
        <p class="stat-sub">No time-in recorded</p>
      </div>

    </div>

    <!-- ── Middle Grid: Recent Registrations + System Health ── -->
    <div class="mid-grid">

      <!-- Recent Pending Users -->
      <div class="panel panel--lg">
        <div class="panel-header">
          <div class="panel-header-left">
            <div class="panel-icon panel-icon--amber">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <h3 class="panel-title">Pending Registrations</h3>
              <p class="panel-sub">Users waiting for account activation</p>
            </div>
          </div>
          <NuxtLink to="/admin/users" class="panel-link-btn">
            View all
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6"/>
            </svg>
          </NuxtLink>
        </div>

        <!-- Skeleton -->
        <div v-if="isLoading" class="user-list">
          <div v-for="n in 4" :key="n" class="user-list-row skeleton-row">
            <div class="skeleton skeleton--avatar"></div>
            <div class="skeleton-info">
              <div class="skeleton skeleton--name"></div>
              <div class="skeleton skeleton--email"></div>
            </div>
            <div class="skeleton skeleton--btn"></div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="pendingUsers.length === 0" class="panel-empty">
          <div class="empty-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="empty-title">All clear!</p>
          <p class="empty-sub">No pending registrations.</p>
        </div>

        <!-- List -->
        <div v-else class="user-list">
          <div
            v-for="user in pendingUsers.slice(0, 5)"
            :key="user.id"
            class="user-list-row"
          >
            <div class="user-avatar-sm">{{ nameInitials(user.name) }}</div>
            <div class="user-list-info">
              <span class="user-list-name">{{ user.name }}</span>
              <span class="user-list-email">{{ user.email }}</span>
            </div>
            <div class="user-list-right">
              <span class="time-ago-chip">{{ timeAgo(user.created_at) }}</span>
              <button
                class="activate-sm-btn"
                :disabled="activatingId === user.id"
                @click="quickActivate(user.id)"
              >
                <svg v-if="activatingId !== user.id" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                <svg v-else class="spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" d="M12 2a10 10 0 0 1 10 10"/>
                </svg>
                {{ activatingId === user.id ? '…' : 'Activate' }}
              </button>
            </div>
          </div>
          <div v-if="pendingUsers.length > 5" class="more-row">
            <NuxtLink to="/admin/users">
              +{{ pendingUsers.length - 5 }} more pending — view all
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- System Health / Quick Info -->
      <div class="panel panel--sm">
        <div class="panel-header">
          <div class="panel-header-left">
            <div class="panel-icon panel-icon--green">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div>
              <h3 class="panel-title">System Health</h3>
              <p class="panel-sub">Current service status</p>
            </div>
          </div>
        </div>

        <div class="health-list">
          <div v-for="svc in systemServices" :key="svc.name" class="health-row">
            <div class="health-left">
              <span class="health-dot" :class="svc.status === 'Operational' ? 'dot--green' : svc.status === 'Degraded' ? 'dot--amber' : 'dot--red'"></span>
              <span class="health-name">{{ svc.name }}</span>
            </div>
            <span class="health-badge" :class="svc.status === 'Operational' ? 'badge--ok' : svc.status === 'Degraded' ? 'badge--warn' : 'badge--err'">
              {{ svc.status }}
            </span>
          </div>
        </div>

        <div class="health-footer">
          <span class="health-footer-dot dot--green"></span>
          <span class="health-footer-text">All core services running</span>
          <span class="health-footer-time">{{ formatTime(new Date()) }}</span>
        </div>
      </div>

    </div>

    <!-- ── Bottom Grid: User Distribution + Quick Nav ── -->
    <div class="bottom-grid">

      <!-- User Role Distribution -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-header-left">
            <div class="panel-icon panel-icon--blue">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
              </svg>
            </div>
            <div>
              <h3 class="panel-title">User Distribution</h3>
              <p class="panel-sub">Breakdown by role type</p>
            </div>
          </div>
        </div>

        <div class="dist-list">
          <div v-for="role in userRoles" :key="role.label" class="dist-row">
            <div class="dist-label-group">
              <span class="dist-dot" :class="role.dot"></span>
              <span class="dist-label">{{ role.label }}</span>
              <span class="dist-count-badge">{{ role.count }}</span>
            </div>
            <div class="dist-bar-wrap">
              <div class="dist-bar-bg">
                <div
                  class="dist-bar-fill"
                  :class="role.bar"
                  :style="{ width: stats.totalUsers > 0 ? `${(role.count / stats.totalUsers) * 100}%` : '0%' }"
                ></div>
              </div>
              <span class="dist-pct">
                {{ stats.totalUsers > 0 ? ((role.count / stats.totalUsers) * 100).toFixed(0) : 0 }}%
              </span>
            </div>
          </div>
        </div>

        <div class="dist-total-row">
          <span class="dist-total-label">Total Registered Users</span>
          <span class="dist-total-val">{{ stats.totalUsers }}</span>
        </div>
      </div>

      <!-- Activity Feed -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-header-left">
            <div class="panel-icon panel-icon--purple">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div>
              <h3 class="panel-title">Recent Activity</h3>
              <p class="panel-sub">Latest system events</p>
            </div>
          </div>
        </div>

        <div class="activity-list">
          <div v-for="(event, idx) in recentActivity" :key="idx" class="activity-row">
            <div class="activity-icon-wrap" :class="event.color">
              <component :is="event.iconComponent" />
            </div>
            <div class="activity-info">
              <p class="activity-text">{{ event.text }}</p>
              <p class="activity-time">{{ event.time }}</p>
            </div>
          </div>
          <div v-if="recentActivity.length === 0" class="panel-empty">
            <p class="empty-sub">No recent activity recorded.</p>
          </div>
        </div>
      </div>

      <!-- Quick Navigation -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-header-left">
            <div class="panel-icon panel-icon--teal">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <h3 class="panel-title">Quick Navigation</h3>
              <p class="panel-sub">Jump to any admin section</p>
            </div>
          </div>
        </div>

        <div class="quick-links">
          <NuxtLink
            v-for="link in quickLinks"
            :key="link.to"
            :to="link.to"
            class="quick-link"
          >
            <div class="quick-link-icon" :class="link.iconColor">
              <component :is="link.iconComponent" />
            </div>
            <div class="quick-link-text">
              <span class="quick-link-label">{{ link.label }}</span>
              <span class="quick-link-sub">{{ link.sub }}</span>
            </div>
            <svg class="quick-link-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6"/>
            </svg>
          </NuxtLink>
        </div>
      </div>

    </div>

    <!-- ── Toast ── -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
          <div class="toast-icon">
            <svg v-if="toast.type === 'success'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <span class="toast-msg">{{ toast.message }}</span>
          <button class="toast-close" @click="toast.show = false">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, h } from 'vue';
import { useNuxtApp } from '#app';

definePageMeta({ layout: 'admin' });

const { $api } = useNuxtApp();

/* ── State ── */
const isLoading    = ref(false);
const isRefreshing = ref(false);
const activatingId = ref(null);
const pendingUsers = ref([]);
const toast = reactive({ show: false, message: '', type: 'success' });

const stats = reactive({
  totalUsers:      0,
  pendingUsers:    0,
  activeUsers:     0,
  totalTasksToday: 0,
  presentToday:    0,
  absentToday:     0,
});

/* ── Time helpers ── */
const timeOfDay = computed(() => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
});

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const formatTime = (d) =>
  new Date(d).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const nameInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
};

/* ── System services ── */
const systemServices = ref([
  { name: 'API Server',          status: 'Operational' },
  { name: 'Database',            status: 'Operational' },
  { name: 'Authentication',      status: 'Operational' },
  { name: 'Task Service',        status: 'Operational' },
  { name: 'Attendance Service',  status: 'Operational' },
  { name: 'Notification Service',status: 'Operational' },
]);

/* ── User roles distribution ── */
const userRoles = computed(() => [
  { label: 'Employees',     count: stats.activeUsers,  dot: 'dot--blue',   bar: 'bar--blue'   },
  { label: 'Pending',       count: stats.pendingUsers, dot: 'dot--amber',  bar: 'bar--amber'  },
  { label: 'Chiefs',        count: stats.chiefCount ?? 0, dot: 'dot--purple', bar: 'bar--purple' },
  { label: 'Admins',        count: stats.adminCount  ?? 1, dot: 'dot--teal',   bar: 'bar--teal'   },
]);

/* ── Recent activity (populated from API data) ── */
const recentActivity = computed(() => {
  const items = [];
  pendingUsers.value.slice(0, 4).forEach(u => {
    items.push({
      text:  `${u.name} registered an account`,
      time:  timeAgo(u.created_at),
      color: 'activity-icon--amber',
      iconComponent: {
        render: () => h('svg', { width:13, height:13, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':'2.5' },
          [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', d:'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' })])
      },
    });
  });
  if (stats.totalTasksToday > 0) {
    items.unshift({
      text:  `${stats.totalTasksToday} tasks created today across the team`,
      time:  'Today',
      color: 'activity-icon--blue',
      iconComponent: {
        render: () => h('svg', { width:13, height:13, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':'2.5' },
          [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', d:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' })])
      },
    });
  }
  if (stats.presentToday > 0) {
    items.unshift({
      text:  `${stats.presentToday} employees clocked in today`,
      time:  'Today',
      color: 'activity-icon--green',
      iconComponent: {
        render: () => h('svg', { width:13, height:13, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':'2.5' },
          [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', d:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })])
      },
    });
  }
  return items.slice(0, 6);
});

/* ── Quick links config ── */
const makeIcon = (d) => ({
  render: () => h('svg', { width:16, height:16, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':'2.5' },
    [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', d })])
});

const quickLinks = [
  {
    to: '/admin/users', label: 'User Management', sub: 'Activate pending accounts',
    iconColor: 'ql-icon--blue',
    iconComponent: makeIcon('M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'),
  },
  {
    to: '/chief/tasks', label: 'Task Overview', sub: 'Monitor team accomplishments',
    iconColor: 'ql-icon--purple',
    iconComponent: makeIcon('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'),
  },
  {
    to: '/chief/attendance', label: 'Attendance Log', sub: 'Daily time-in records',
    iconColor: 'ql-icon--green',
    iconComponent: makeIcon('M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'),
  },
  {
    to: '/chief/attendance-summary', label: 'Weekly Summary', sub: 'Punctuality scores by week',
    iconColor: 'ql-icon--amber',
    iconComponent: makeIcon('M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'),
  },
  {
    to: '/chief/attendance-summary-monthly', label: 'Monthly Summary', sub: 'Year-at-a-glance view',
    iconColor: 'ql-icon--teal',
    iconComponent: makeIcon('M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'),
  },
];

/* ── Toast ── */
const showToast = (message, type = 'success') => {
  toast.message = message;
  toast.type    = type;
  toast.show    = true;
  setTimeout(() => { toast.show = false; }, 3500);
};

/* ── Data fetching ── */
const fetchDashboardData = async () => {
  try {
    const [usersRes, tasksRes, attRes] = await Promise.allSettled([
      $api.get('/getPending'),
      $api.get('/getTasksCount'),
      $api.get('/getAttendanceToday'),
    ]);

    if (usersRes.status === 'fulfilled') {
      const data = usersRes.value.data;
      pendingUsers.value    = data.registered?.data ?? [];
      stats.pendingUsers    = pendingUsers.value.length;
      stats.totalUsers      = data.total_users ?? pendingUsers.value.length;
      stats.activeUsers     = data.active_users ?? (stats.totalUsers - stats.pendingUsers);
      stats.chiefCount      = data.chief_count  ?? 0;
      stats.adminCount      = data.admin_count  ?? 1;
    }

    if (tasksRes.status === 'fulfilled') {
      const t = tasksRes.value.data;
      stats.totalTasksToday = t.tasksCreatedToday?.created_count ?? 0;
    }

    if (attRes.status === 'fulfilled') {
      const a = attRes.value.data;
      stats.presentToday = a.present_count ?? 0;
      stats.absentToday  = a.absent_count  ?? 0;
    }
  } catch (err) {
    console.error('Dashboard fetch error:', err);
  }
};

const refreshAll = async () => {
  isRefreshing.value = true;
  await fetchDashboardData();
  isRefreshing.value = false;
  showToast('Dashboard refreshed successfully.', 'success');
};

const quickActivate = async (userId) => {
  activatingId.value = userId;
  try {
    await $api.post(`/activate/${userId}`);
    pendingUsers.value   = pendingUsers.value.filter(u => u.id !== userId);
    stats.pendingUsers   = Math.max(0, stats.pendingUsers - 1);
    stats.activeUsers    = stats.activeUsers + 1;
    showToast('User activated successfully.', 'success');
  } catch (err) {
    showToast('Activation failed. Please try again.', 'error');
  } finally {
    activatingId.value = null;
  }
};

onMounted(async () => {
  isLoading.value = true;
  await fetchDashboardData();
  isLoading.value = false;
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ── Root ── */
.dashboard {
  padding: 28px 32px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* ── Welcome Banner ── */
.welcome-banner {
  background: #ffffff;
  border: 1px solid #e8ecf4;
  border-radius: 16px;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 1px 4px rgba(15,23,42,0.05);
}
.welcome-left  { display: flex; align-items: center; gap: 14px; }
.welcome-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.welcome-avatar {
  width: 46px; height: 46px; border-radius: 12px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white; font-size: 14px; font-weight: 800;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(37,99,235,0.3);
}
.welcome-title { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 3px; letter-spacing: -0.3px; }
.welcome-name  { color: #2563eb; }
.welcome-sub   { font-size: 13px; color: #94a3b8; font-weight: 500; margin: 0; }
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
  border-radius: 10px; font-size: 13px; font-weight: 600;
  font-family: inherit; color: #475569; cursor: pointer; transition: all 0.15s;
}
.refresh-btn:hover { background: #f1f5f9; color: #1e293b; }
.refresh-btn svg { transition: transform 0.3s ease; }
.refresh-btn--spinning svg { animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Stats Grid ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
}
@media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(3,1fr); } }
@media (max-width: 640px)  { .stats-grid { grid-template-columns: repeat(2,1fr); } }

.stat-card {
  border-radius: 14px; padding: 18px 16px;
  display: flex; flex-direction: column; gap: 6px;
  border: 1px solid transparent;
  position: relative; overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,23,42,0.1); }
.stat-card::after {
  content: ''; position: absolute; top: -20px; right: -20px;
  width: 70px; height: 70px; border-radius: 50%; opacity: 0.1; background: currentColor;
}
.stat-card--blue   { background: #eff6ff; border-color: #bfdbfe; color: #2563eb; }
.stat-card--amber  { background: #fffbeb; border-color: #fde68a; color: #d97706; }
.stat-card--green  { background: #f0fdf4; border-color: #86efac; color: #16a34a; }
.stat-card--purple { background: #faf5ff; border-color: #d8b4fe; color: #7c3aed; }
.stat-card--teal   { background: #f0fdfa; border-color: #99f6e4; color: #0d9488; }
.stat-card--red    { background: #fff1f2; border-color: #fecdd3; color: #e11d48; }

.stat-card-top {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;
}
.stat-icon {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.7); color: inherit;
}
.stat-view-link {
  font-size: 10.5px; font-weight: 700; color: inherit;
  opacity: 0.65; text-decoration: none; transition: opacity 0.15s;
}
.stat-view-link:hover { opacity: 1; }
.stat-value { font-size: 32px; font-weight: 800; color: inherit; line-height: 1; margin: 0; letter-spacing: -1px; }
.stat-label { font-size: 12px; font-weight: 700; color: inherit; opacity: 0.85; margin: 0; }
.stat-sub   { font-size: 10.5px; font-weight: 500; color: inherit; opacity: 0.6; margin: 0; }

/* ── Panel base ── */
.panel {
  background: #ffffff; border: 1px solid #e8ecf4; border-radius: 16px;
  overflow: hidden; box-shadow: 0 1px 4px rgba(15,23,42,0.04);
  display: flex; flex-direction: column;
}
.panel-header {
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 10px; padding: 15px 20px;
  border-bottom: 1px solid #f1f5f9; background: #fafbfe;
}
.panel-header-left { display: flex; align-items: center; gap: 12px; }
.panel-icon {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.panel-icon--blue   { background: #dbeafe; color: #2563eb; }
.panel-icon--amber  { background: #fef9c3; color: #d97706; }
.panel-icon--green  { background: #dcfce7; color: #16a34a; }
.panel-icon--purple { background: #ede9fe; color: #7c3aed; }
.panel-icon--teal   { background: #ccfbf1; color: #0d9488; }
.panel-title { font-size: 13.5px; font-weight: 700; color: #0f172a; margin: 0 0 2px; }
.panel-sub   { font-size: 11px; color: #94a3b8; margin: 0; }
.panel-link-btn {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 700; color: #2563eb;
  background: #eff6ff; border: 1px solid #bfdbfe;
  border-radius: 8px; padding: 5px 11px; text-decoration: none; transition: all 0.15s;
}
.panel-link-btn:hover { background: #dbeafe; }

/* ── Mid Grid ── */
.mid-grid {
  display: grid; grid-template-columns: 1fr 320px; gap: 16px;
}
@media (max-width: 900px) { .mid-grid { grid-template-columns: 1fr; } }

/* ── User List (pending panel) ── */
.user-list { padding: 6px 12px 10px; display: flex; flex-direction: column; gap: 2px; }
.user-list-row {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 8px; border-radius: 10px; transition: background 0.1s;
}
.user-list-row:hover { background: #f8fafc; }
.user-avatar-sm {
  width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white; font-size: 11px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.user-list-info { flex: 1; min-width: 0; }
.user-list-name  { display: block; font-size: 13px; font-weight: 700; color: #1e293b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.user-list-email { display: block; font-size: 11px; color: #94a3b8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.user-list-right { display: flex; align-items: center; gap: 7px; flex-shrink: 0; }
.time-ago-chip {
  font-size: 10.5px; font-weight: 600; color: #94a3b8;
  background: #f1f5f9; border-radius: 20px; padding: 2px 8px;
}
.activate-sm-btn {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 5px 11px; font-size: 11.5px; font-weight: 700;
  border-radius: 8px; border: none; cursor: pointer; font-family: inherit;
  background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white;
  box-shadow: 0 2px 8px rgba(37,99,235,0.25); transition: all 0.15s;
}
.activate-sm-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.35); }
.activate-sm-btn:disabled { opacity: 0.65; cursor: not-allowed; }
.more-row {
  text-align: center; padding: 8px 0; font-size: 12px;
}
.more-row a { color: #2563eb; font-weight: 600; text-decoration: none; }
.more-row a:hover { text-decoration: underline; }

/* ── Panel empty ── */
.panel-empty {
  display: flex; flex-direction: column; align-items: center;
  gap: 8px; padding: 36px 20px; text-align: center;
}
.empty-icon {
  width: 48px; height: 48px; background: #f1f5f9; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; color: #cbd5e1;
}
.empty-title { font-size: 14px; font-weight: 700; color: #334155; margin: 0; }
.empty-sub   { font-size: 12px; color: #94a3b8; margin: 0; }

/* ── Health panel ── */
.health-list {
  padding: 10px 16px; display: flex; flex-direction: column; gap: 4px;
}
.health-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 7px 8px; border-radius: 8px; transition: background 0.1s;
}
.health-row:hover { background: #f8fafc; }
.health-left { display: flex; align-items: center; gap: 8px; }
.health-dot {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
}
.dot--green { background: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
.dot--amber { background: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,0.2); }
.dot--red   { background: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.2); }
.health-name { font-size: 12.5px; font-weight: 600; color: #334155; }
.health-badge {
  font-size: 10.5px; font-weight: 700; padding: 2px 8px;
  border-radius: 20px; border: 1px solid transparent;
}
.badge--ok   { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
.badge--warn { background: #fffbeb; color: #d97706; border-color: #fde68a; }
.badge--err  { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }
.health-footer {
  display: flex; align-items: center; gap: 7px;
  padding: 10px 16px; border-top: 1px solid #f1f5f9;
  background: #fafbfe; margin-top: auto;
}
.health-footer-dot  { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.health-footer-text { font-size: 11px; font-weight: 600; color: #64748b; flex: 1; }
.health-footer-time { font-size: 11px; color: #94a3b8; }

/* ── Bottom Grid ── */
.bottom-grid {
  display: grid; grid-template-columns: repeat(3,1fr); gap: 16px;
}
@media (max-width: 1000px) { .bottom-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 640px)  { .bottom-grid { grid-template-columns: 1fr; } }

/* Distribution */
.dist-list { padding: 14px 20px; display: flex; flex-direction: column; gap: 12px; }
.dist-row  { display: flex; flex-direction: column; gap: 5px; }
.dist-label-group { display: flex; align-items: center; gap: 7px; }
.dist-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot--blue   { background: #2563eb; }
.dot--amber  { background: #d97706; }
.dot--purple { background: #7c3aed; }
.dot--teal   { background: #0d9488; }
.dist-label { font-size: 12px; font-weight: 600; color: #475569; flex: 1; }
.dist-count-badge {
  font-size: 10.5px; font-weight: 800; color: #475569;
  background: #f1f5f9; border-radius: 20px; padding: 1px 7px;
}
.dist-bar-wrap { display: flex; align-items: center; gap: 8px; }
.dist-bar-bg { flex: 1; height: 6px; background: #f1f5f9; border-radius: 20px; overflow: hidden; }
.dist-bar-fill { height: 100%; border-radius: 20px; transition: width 0.6s cubic-bezier(0.16,1,0.3,1); }
.bar--blue   { background: linear-gradient(90deg, #3b82f6, #2563eb); }
.bar--amber  { background: linear-gradient(90deg, #fbbf24, #d97706); }
.bar--purple { background: linear-gradient(90deg, #a78bfa, #7c3aed); }
.bar--teal   { background: linear-gradient(90deg, #2dd4bf, #0d9488); }
.dist-pct { font-size: 11px; font-weight: 600; color: #94a3b8; min-width: 34px; text-align: right; }
.dist-total-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 11px 20px; border-top: 1px solid #f1f5f9; margin-top: auto;
}
.dist-total-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
.dist-total-val   { font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }

/* Activity feed */
.activity-list { padding: 8px 16px 12px; display: flex; flex-direction: column; gap: 2px; }
.activity-row  {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 8px 6px; border-radius: 9px; transition: background 0.1s;
}
.activity-row:hover { background: #f8fafc; }
.activity-icon-wrap {
  width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; margin-top: 1px;
}
.activity-icon--blue   { background: #dbeafe; color: #2563eb; }
.activity-icon--green  { background: #dcfce7; color: #16a34a; }
.activity-icon--amber  { background: #fef9c3; color: #d97706; }
.activity-info { flex: 1; min-width: 0; }
.activity-text { font-size: 12.5px; font-weight: 600; color: #334155; margin: 0 0 2px; line-height: 1.4; }
.activity-time { font-size: 10.5px; color: #94a3b8; margin: 0; }

/* Quick links */
.quick-links { padding: 8px 10px 12px; display: flex; flex-direction: column; gap: 2px; }
.quick-link {
  display: flex; align-items: center; gap: 11px;
  padding: 10px 10px; border-radius: 10px; text-decoration: none; transition: background 0.12s;
}
.quick-link:hover { background: #f0f7ff; }
.quick-link:hover .quick-link-arrow { transform: translateX(3px); color: #2563eb; }
.quick-link-icon {
  width: 34px; height: 34px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ql-icon--blue   { background: #dbeafe; color: #2563eb; }
.ql-icon--purple { background: #ede9fe; color: #7c3aed; }
.ql-icon--green  { background: #dcfce7; color: #16a34a; }
.ql-icon--amber  { background: #fef9c3; color: #d97706; }
.ql-icon--teal   { background: #ccfbf1; color: #0d9488; }
.quick-link-text  { flex: 1; display: flex; flex-direction: column; gap: 1px; }
.quick-link-label { font-size: 12.5px; font-weight: 700; color: #1e293b; }
.quick-link-sub   { font-size: 11px; color: #94a3b8; }
.quick-link-arrow { color: #cbd5e1; flex-shrink: 0; transition: transform 0.15s, color 0.15s; }

/* ── Skeleton ── */
.skeleton-row { display: flex; align-items: center; gap: 10px; padding: 9px 8px; }
.skeleton {
  border-radius: 6px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e8ecf4 50%, #f1f5f9 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite;
}
.skeleton--avatar { width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0; }
.skeleton--name   { width: 120px; height: 13px; }
.skeleton--email  { width: 160px; height: 11px; margin-top: 4px; }
.skeleton--btn    { width: 72px; height: 28px; border-radius: 8px; margin-left: auto; }
.skeleton-info    { flex: 1; }
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
  box-shadow: 0 8px 30px rgba(15,23,42,0.14); min-width: 260px;
  border: 1px solid transparent;
}
.toast--success { background: #f0fdf4; color: #15803d; border-color: #86efac; }
.toast--error   { background: #fff1f2; color: #be123c; border-color: #fecdd3; }
.toast-icon  { display: flex; flex-shrink: 0; }
.toast-msg   { flex: 1; }
.toast-close {
  width: 20px; height: 20px; border-radius: 5px; border: none;
  background: transparent; color: inherit; opacity: 0.6; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: opacity 0.15s;
}
.toast-close:hover { opacity: 1; }
.toast-enter-active { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
.toast-leave-active { transition: all 0.2s ease-in; }
.toast-enter-from   { transform: translateY(16px); opacity: 0; }
.toast-leave-to     { transform: translateY(8px); opacity: 0; }
</style>