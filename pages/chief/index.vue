<template>
  <div class="dashboard">

    <!-- ── Welcome Banner ── -->
    <div class="welcome-banner">
      <div class="welcome-left">
        <div class="welcome-avatar">CH</div>
        <div>
          <h1 class="welcome-title">Good {{ timeOfDay }}, <span class="welcome-name">Chief</span> 👋</h1>
          <p class="welcome-sub">Here's your team's task activity at a glance.</p>
        </div>
      </div>
      <div class="welcome-date-chip">
        <span class="live-dot"></span>
        {{ formatDate(new Date()) }}
      </div>
    </div>

    <!-- ── Stat Cards ── -->
    <div class="stats-grid">

      <div
        v-for="card in statCards"
        :key="card.key"
        class="stat-card"
        :class="[card.color, { 'stat-card--active': selectedCategory === card.key }]"
        @click="toggleDropdown(card.key)"
      >
        <div class="stat-card-top">
          <div class="stat-card-icon">
            <component :is="card.icon" />
          </div>
          <span class="stat-view-btn">
            {{ selectedCategory === card.key ? 'Hide' : 'View' }}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                :d="selectedCategory === card.key ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"/>
            </svg>
          </span>
        </div>
        <p class="stat-value">{{ card.count }}</p>
        <p class="stat-label">{{ card.label }}</p>
        <p class="stat-sub">{{ card.sub }}</p>
      </div>

    </div>

    <!-- ── Task Detail Panel ── -->
    <Transition name="slide-down">
      <div v-if="selectedCategory" class="detail-panel">

        <!-- Panel Header -->
        <div class="detail-header">
          <div class="detail-header-left">
            <div class="detail-icon" :class="activeCard?.iconBg">
              <component :is="activeCard?.icon" />
            </div>
            <div>
              <h3 class="detail-title">{{ activeCard?.label }}</h3>
              <p class="detail-sub">
                {{ activeList.length }} task{{ activeList.length !== 1 ? 's' : '' }} found
              </p>
            </div>
          </div>

          <div class="detail-actions">
            <!-- Search -->
            <div class="search-wrap">
              <span class="search-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
                </svg>
              </span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name or subject…"
                class="search-input"
              />
              <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <!-- Close -->
            <button class="close-btn" @click="selectedCategory = null">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredList.length === 0" class="detail-empty">
          <div class="empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <h4 class="empty-title">No tasks found</h4>
          <p class="empty-sub">{{ searchQuery ? 'Try a different search term.' : 'No tasks in this category yet.' }}</p>
        </div>

        <!-- Task Table -->
        <div v-else class="table-wrap">
          <table class="task-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Subject / Title</th>
                <th>Description</th>
                <th>PAPs</th>
                <th>Type</th>
                <th>Documents</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="task in filteredList"
                :key="task.id"
                class="task-row"
              >
                <!-- Employee -->
                <td class="td-employee">
                  <div class="emp-cell">
                    <div class="emp-avatar">{{ formatInitials(task.user) }}</div>
                    <span class="emp-name">{{ formatName(task.user) }}</span>
                  </div>
                </td>

                <!-- Title -->
                <td class="td-title">
                  <span class="task-title-text">{{ task.title || '—' }}</span>
                </td>

                <!-- Description -->
                <td class="td-desc">
                  <span class="task-desc-text">{{ task.description || '—' }}</span>
                </td>

                <!-- PAPs -->
                <td class="td-paps">
                  <span v-if="task.paps" class="tag tag--paps">{{ task.paps }}</span>
                  <span v-else class="no-val">—</span>
                </td>

                <!-- Type -->
                <td class="td-type">
                  <span v-if="task.type" class="tag tag--type">{{ task.type }}</span>
                  <span v-else class="no-val">—</span>
                </td>

                <!-- Documents -->
                <td class="td-docs">
                  <div v-if="task.links && task.links.length" class="doc-links">
                    <a
                      v-for="(link, index) in task.links"
                      :key="index"
                      :href="link"
                      target="_blank"
                      class="doc-link"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                      Doc {{ index + 1 }}
                    </a>
                  </div>
                  <span v-else class="no-val">No files</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </Transition>

    <!-- ── Bottom Grid: Quick Links + Summary ── -->
    <div class="bottom-grid">

      <!-- Quick Navigation -->
      <div class="quick-panel">
        <div class="panel-header">
          <div class="panel-icon panel-icon--teal">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div>
            <h3 class="panel-title">Quick Navigation</h3>
            <p class="panel-sub">Jump to any section</p>
          </div>
        </div>
        <div class="quick-links">
          <NuxtLink to="/chief/tasks" class="quick-link">
            <div class="quick-link-icon quick-link-icon--blue">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
            <div class="quick-link-text">
              <span class="quick-link-label">Task Overview</span>
              <span class="quick-link-sub">Monitor team tasks</span>
            </div>
            <svg class="quick-link-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6"/>
            </svg>
          </NuxtLink>

          <NuxtLink to="/chief/attendance" class="quick-link">
            <div class="quick-link-icon quick-link-icon--green">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div class="quick-link-text">
              <span class="quick-link-label">Attendance Log</span>
              <span class="quick-link-sub">Daily time-in records</span>
            </div>
            <svg class="quick-link-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6"/>
            </svg>
          </NuxtLink>

          <NuxtLink to="/chief/attendance-summary" class="quick-link">
            <div class="quick-link-icon quick-link-icon--amber">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div class="quick-link-text">
              <span class="quick-link-label">Weekly Summary</span>
              <span class="quick-link-sub">Attendance by week</span>
            </div>
            <svg class="quick-link-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6"/>
            </svg>
          </NuxtLink>

          <NuxtLink to="/chief/attendance-summary-monthly" class="quick-link">
            <div class="quick-link-icon quick-link-icon--purple">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div class="quick-link-text">
              <span class="quick-link-label">Monthly Summary</span>
              <span class="quick-link-sub">Year-at-a-glance view</span>
            </div>
            <svg class="quick-link-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6"/>
            </svg>
          </NuxtLink>
        </div>
      </div>

      <!-- Task Distribution -->
      <div class="summary-panel">
        <div class="panel-header">
          <div class="panel-icon panel-icon--blue">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
            </svg>
          </div>
          <div>
            <h3 class="panel-title">Today's Distribution</h3>
            <p class="panel-sub">Task status breakdown</p>
          </div>
        </div>

        <div class="distribution-list">
          <div v-for="card in statCards" :key="card.key" class="dist-row">
            <div class="dist-label-group">
              <span class="dist-dot" :class="card.dotColor"></span>
              <span class="dist-label">{{ card.label }}</span>
            </div>
            <div class="dist-bar-wrap">
              <div class="dist-bar-bg">
                <div
                  class="dist-bar-fill"
                  :class="card.barColor"
                  :style="{ width: totalTasks > 0 ? `${(card.count / totalTasks) * 100}%` : '0%' }"
                ></div>
              </div>
              <span class="dist-count">{{ card.count }}</span>
              <span class="dist-pct">{{ totalTasks > 0 ? ((card.count / totalTasks) * 100).toFixed(0) : 0 }}%</span>
            </div>
          </div>

          <div class="dist-total">
            <span class="dist-total-label">Total Tasks Today</span>
            <span class="dist-total-value">{{ totalTasks }}</span>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { getTasksCount } from '@/services/chief/taskService';
import { onMounted, ref, computed, h } from 'vue';

definePageMeta({ layout: 'chief' });

/* ── State ── */
const tasksCreatedToday  = ref(0);
const doneTasks          = ref(0);
const suspendedTasks     = ref(0);
const inProgressTasks    = ref(0);
const createdTasksList   = ref([]);
const doneTasksList      = ref([]);
const suspendedTasksList = ref([]);
const inProgressTasksList = ref([]);
const selectedCategory   = ref(null);
const searchQuery        = ref('');
const isLoading          = ref(false);

/* ── Helpers ── */
const timeOfDay = computed(() => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
});

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

const formatName = (user) => {
  if (!user) return 'No User';
  const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
  return `${cap(user.first_name)} ${cap(user.last_name)}`;
};

const formatInitials = (user) => {
  if (!user) return '?';
  return ((user.first_name?.[0] ?? '') + (user.last_name?.[0] ?? '')).toUpperCase();
};

/* ── Icon components (inline SVG render functions) ── */
const IconCreated = {
  render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2.2' },
    [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 4v16m8-8H4' })])
};
const IconDone = {
  render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2.2' },
    [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })])
};
const IconSuspended = {
  render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2.2' },
    [h('circle', { cx: '12', cy: '12', r: '10' }), h('line', { x1: '4.93', y1: '4.93', x2: '19.07', y2: '19.07' })])
};
const IconInProgress = {
  render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2.2' },
    [h('circle', { cx: '12', cy: '12', r: '10' }), h('polyline', { points: '12 6 12 12 16 14' })])
};

/* ── Stat cards config ── */
const statCards = computed(() => [
  {
    key: 'created', label: 'Tasks Created', sub: 'Added today',
    count: tasksCreatedToday.value, color: 'stat-card--blue',
    dotColor: 'dot--blue', barColor: 'bar--blue', iconBg: 'icon-bg--blue',
    icon: IconCreated,
  },
  {
    key: 'done', label: 'Tasks Done', sub: 'Completed today',
    count: doneTasks.value, color: 'stat-card--green',
    dotColor: 'dot--green', barColor: 'bar--green', iconBg: 'icon-bg--green',
    icon: IconDone,
  },
  {
    key: 'suspended', label: 'Tasks Suspended', sub: 'Paused or deferred',
    count: suspendedTasks.value, color: 'stat-card--amber',
    dotColor: 'dot--amber', barColor: 'bar--amber', iconBg: 'icon-bg--amber',
    icon: IconSuspended,
  },
  {
    key: 'inprogress', label: 'In Progress', sub: 'Currently active',
    count: inProgressTasks.value, color: 'stat-card--purple',
    dotColor: 'dot--purple', barColor: 'bar--purple', iconBg: 'icon-bg--purple',
    icon: IconInProgress,
  },
]);

const totalTasks = computed(() =>
  tasksCreatedToday.value + doneTasks.value + suspendedTasks.value + inProgressTasks.value
);

const activeCard = computed(() => statCards.value.find(c => c.key === selectedCategory.value));

const activeList = computed(() => {
  const map = {
    created: createdTasksList,
    done: doneTasksList,
    suspended: suspendedTasksList,
    inprogress: inProgressTasksList,
  };
  return map[selectedCategory.value]?.value ?? [];
});

const filteredList = computed(() => {
  if (!searchQuery.value.trim()) return activeList.value;
  const q = searchQuery.value.toLowerCase();
  return activeList.value.filter(t =>
    formatName(t.user).toLowerCase().includes(q) ||
    t.title?.toLowerCase().includes(q) ||
    t.description?.toLowerCase().includes(q)
  );
});

/* ── Actions ── */
const toggleDropdown = (category) => {
  if (selectedCategory.value === category) {
    selectedCategory.value = null;
    searchQuery.value = '';
  } else {
    selectedCategory.value = category;
    searchQuery.value = '';
  }
};

/* ── Data fetch ── */
onMounted(async () => {
  isLoading.value = true;
  try {
    const data = await getTasksCount();
    tasksCreatedToday.value   = data.tasksCreatedToday.created_count;
    doneTasks.value           = data.doneTasks.done_count;
    suspendedTasks.value      = data.suspendedTasks.suspended_count;
    inProgressTasks.value     = data.inProgressTasks.inprogress_count;
    createdTasksList.value    = data.tasksCreatedToday.created_tasks;
    doneTasksList.value       = data.doneTasks.done_tasks;
    suspendedTasksList.value  = data.suspendedTasks.suspended_tasks;
    inProgressTasksList.value = data.inProgressTasks.inprogress_tasks;
  } catch (error) {
    console.error('Error fetching task counts:', error);
  } finally {
    isLoading.value = false;
  }
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
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.05);
}
.welcome-left { display: flex; align-items: center; gap: 14px; }
.welcome-avatar {
  width: 46px; height: 46px; border-radius: 12px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white; font-size: 14px; font-weight: 800;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}
.welcome-title { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 3px; letter-spacing: -0.3px; }
.welcome-name  { color: #2563eb; }
.welcome-sub   { font-size: 13px; color: #94a3b8; font-weight: 500; margin: 0; }
.welcome-date-chip {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 12.5px; font-weight: 600; color: #475569;
  background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px;
  padding: 6px 14px; white-space: nowrap; flex-shrink: 0;
}
.live-dot {
  width: 7px; height: 7px; background: #22c55e; border-radius: 50%; animation: pulse 2s infinite;
}
@keyframes pulse {
  0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(34,197,94,.5); }
  50%      { opacity:.8; box-shadow: 0 0 0 5px rgba(34,197,94,0); }
}

/* ── Stat Cards ── */
.stats-grid {
  display: grid; grid-template-columns: repeat(4,1fr); gap: 14px;
}
@media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 500px) { .stats-grid { grid-template-columns: 1fr; } }

.stat-card {
  border-radius: 16px; padding: 20px 18px;
  border: 1px solid transparent; cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.15s ease;
  position: relative; overflow: hidden;
}
.stat-card::after {
  content: ''; position: absolute; top: -20px; right: -20px;
  width: 80px; height: 80px; border-radius: 50%; opacity: 0.1; background: currentColor;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(15,23,42,0.1); }
.stat-card--active { transform: translateY(-2px); }

.stat-card--blue   { background: #eff6ff; border-color: #bfdbfe; color: #2563eb; }
.stat-card--green  { background: #f0fdf4; border-color: #86efac; color: #16a34a; }
.stat-card--amber  { background: #fffbeb; border-color: #fde68a; color: #d97706; }
.stat-card--purple { background: #faf5ff; border-color: #d8b4fe; color: #7c3aed; }
.stat-card--active.stat-card--blue   { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
.stat-card--active.stat-card--green  { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.15); }
.stat-card--active.stat-card--amber  { border-color: #d97706; box-shadow: 0 0 0 3px rgba(217,119,6,0.15); }
.stat-card--active.stat-card--purple { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }

.stat-card-top {
  display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;
}
.stat-card-icon {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.7); color: inherit;
}
.stat-view-btn {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11.5px; font-weight: 700; color: inherit; opacity: 0.7;
  transition: opacity 0.15s;
}
.stat-card:hover .stat-view-btn { opacity: 1; }
.stat-value {
  font-size: 38px; font-weight: 800; color: inherit; line-height: 1;
  margin: 0 0 5px; letter-spacing: -1.5px;
}
.stat-label {
  font-size: 13px; font-weight: 700; color: inherit; opacity: 0.85; margin: 0 0 2px;
}
.stat-sub {
  font-size: 11px; font-weight: 500; color: inherit; opacity: 0.6; margin: 0;
}

/* ── Detail Panel ── */
.detail-panel {
  background: #ffffff; border: 1px solid #e8ecf4; border-radius: 16px;
  overflow: hidden; box-shadow: 0 2px 12px rgba(15,23,42,0.06);
}
.detail-header {
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 12px; padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9; background: #fafbfe;
}
.detail-header-left { display: flex; align-items: center; gap: 12px; }
.detail-icon {
  width: 34px; height: 34px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.icon-bg--blue   { background: #dbeafe; color: #2563eb; }
.icon-bg--green  { background: #dcfce7; color: #16a34a; }
.icon-bg--amber  { background: #fef9c3; color: #d97706; }
.icon-bg--purple { background: #ede9fe; color: #7c3aed; }
.detail-title { font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 2px; }
.detail-sub   { font-size: 11.5px; color: #94a3b8; margin: 0; }
.detail-actions { display: flex; align-items: center; gap: 10px; }

/* Search */
.search-wrap { position: relative; display: flex; align-items: center; }
.search-icon {
  position: absolute; left: 11px; color: #94a3b8; pointer-events: none; display: flex;
}
.search-input {
  padding: 8px 32px 8px 34px; border: 1px solid #e2e8f0; border-radius: 10px;
  font-size: 12.5px; font-family: inherit; font-weight: 500;
  color: #1e293b; background: #f8fafc; outline: none; width: 220px; transition: all 0.15s;
}
.search-input::placeholder { color: #94a3b8; }
.search-input:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
.search-clear {
  position: absolute; right: 9px; width: 20px; height: 20px; border-radius: 5px;
  border: none; background: #e2e8f0; color: #64748b;
  display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s;
}
.search-clear:hover { background: #fecaca; color: #dc2626; }
.close-btn {
  width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e2e8f0;
  background: #f8fafc; color: #64748b;
  display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s;
}
.close-btn:hover { background: #fee2e2; color: #dc2626; border-color: #fecaca; }

/* Empty state */
.detail-empty {
  display: flex; flex-direction: column; align-items: center;
  gap: 10px; padding: 56px 32px; text-align: center;
}
.empty-icon {
  width: 56px; height: 56px; background: #f1f5f9; border-radius: 14px;
  display: flex; align-items: center; justify-content: center; color: #cbd5e1;
}
.empty-title { font-size: 15px; font-weight: 700; color: #334155; margin: 0; }
.empty-sub   { font-size: 13px; color: #94a3b8; margin: 0; }

/* ── Task Table ── */
.table-wrap { overflow-x: auto; max-height: 400px; overflow-y: auto; }
.task-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.task-table thead th {
  position: sticky; top: 0; z-index: 2;
  padding: 10px 16px; text-align: left;
  font-size: 10.5px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: #94a3b8;
  background: #f8fafc; border-bottom: 1px solid #f1f5f9; white-space: nowrap;
}
.task-row { border-bottom: 1px solid #f8fafc; transition: background 0.1s; }
.task-row:last-child { border-bottom: none; }
.task-row:hover { background: #f8fafc; }
.task-table td { padding: 11px 16px; vertical-align: middle; }

/* Employee cell */
.emp-cell { display: flex; align-items: center; gap: 9px; white-space: nowrap; }
.emp-avatar {
  width: 30px; height: 30px; border-radius: 8px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white; font-size: 10.5px; font-weight: 800;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.emp-name { font-weight: 600; color: #1e293b; font-size: 13px; }
.task-title-text { font-weight: 600; color: #1e293b; }
.task-desc-text { color: #64748b; font-size: 12.5px; max-width: 240px; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* Tags */
.tag {
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: 5px;
  font-size: 10.5px; font-weight: 700; border: 1px solid transparent;
  text-transform: uppercase; letter-spacing: 0.04em;
}
.tag--paps { background: #f0f9ff; color: #0369a1; border-color: #bae6fd; }
.tag--type { background: #faf5ff; color: #7c3aed; border-color: #e9d5ff; }

/* Doc links */
.doc-links { display: flex; flex-wrap: wrap; gap: 5px; }
.doc-link {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 600; color: #2563eb;
  background: #eff6ff; border: 1px solid #bfdbfe;
  border-radius: 6px; padding: 3px 8px; text-decoration: none; transition: all 0.15s;
}
.doc-link:hover { background: #dbeafe; color: #1d4ed8; }
.no-val { color: #cbd5e1; font-size: 13px; }

/* ── Bottom Grid ── */
.bottom-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
}
@media (max-width: 768px) { .bottom-grid { grid-template-columns: 1fr; } }

/* Shared panel base */
.quick-panel, .summary-panel {
  background: #ffffff; border: 1px solid #e8ecf4;
  border-radius: 16px; overflow: hidden;
  box-shadow: 0 1px 4px rgba(15,23,42,0.04);
}
.panel-header {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 20px; border-bottom: 1px solid #f1f5f9; background: #fafbfe;
}
.panel-icon {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.panel-icon--blue  { background: #dbeafe; color: #2563eb; }
.panel-icon--teal  { background: #ccfbf1; color: #0d9488; }
.panel-title { font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 2px; }
.panel-sub   { font-size: 11.5px; color: #94a3b8; margin: 0; }

/* Quick links */
.quick-links { padding: 8px 10px; display: flex; flex-direction: column; gap: 2px; }
.quick-link {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 12px; border-radius: 10px; text-decoration: none;
  transition: background 0.12s ease; color: #1e293b;
}
.quick-link:hover { background: #f0f7ff; }
.quick-link:hover .quick-link-arrow { transform: translateX(3px); color: #2563eb; }
.quick-link-icon {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.quick-link-icon--blue   { background: #dbeafe; color: #2563eb; }
.quick-link-icon--green  { background: #dcfce7; color: #16a34a; }
.quick-link-icon--amber  { background: #fef9c3; color: #d97706; }
.quick-link-icon--purple { background: #ede9fe; color: #7c3aed; }
.quick-link-text { flex: 1; display: flex; flex-direction: column; gap: 1px; }
.quick-link-label { font-size: 13px; font-weight: 700; color: #1e293b; }
.quick-link-sub   { font-size: 11.5px; color: #94a3b8; font-weight: 500; }
.quick-link-arrow { color: #cbd5e1; flex-shrink: 0; transition: transform 0.15s, color 0.15s; }

/* Distribution bars */
.distribution-list { padding: 14px 20px; display: flex; flex-direction: column; gap: 12px; }
.dist-row { display: flex; flex-direction: column; gap: 6px; }
.dist-label-group { display: flex; align-items: center; gap: 7px; }
.dist-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot--blue   { background: #2563eb; }
.dot--green  { background: #16a34a; }
.dot--amber  { background: #d97706; }
.dot--purple { background: #7c3aed; }
.dist-label { font-size: 12px; font-weight: 600; color: #475569; }
.dist-bar-wrap { display: flex; align-items: center; gap: 8px; }
.dist-bar-bg {
  flex: 1; height: 7px; background: #f1f5f9; border-radius: 20px; overflow: hidden;
}
.dist-bar-fill { height: 100%; border-radius: 20px; transition: width 0.6s cubic-bezier(0.16,1,0.3,1); }
.bar--blue   { background: linear-gradient(90deg, #3b82f6, #2563eb); }
.bar--green  { background: linear-gradient(90deg, #22c55e, #16a34a); }
.bar--amber  { background: linear-gradient(90deg, #fbbf24, #d97706); }
.bar--purple { background: linear-gradient(90deg, #a78bfa, #7c3aed); }
.dist-count { font-size: 13px; font-weight: 800; color: #334155; min-width: 20px; text-align: right; }
.dist-pct   { font-size: 11px; font-weight: 600; color: #94a3b8; min-width: 34px; }
.dist-total {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 4px;
}
.dist-total-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
.dist-total-value { font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }

/* ── Transition ── */
.slide-down-enter-active { transition: all 0.35s cubic-bezier(0.16,1,0.3,1); }
.slide-down-leave-active { transition: all 0.2s ease-in; }
.slide-down-enter-from   { opacity: 0; transform: translateY(-10px); }
.slide-down-leave-to     { opacity: 0; transform: translateY(-6px); }
</style>