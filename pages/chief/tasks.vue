<template>
  <div class="tasks-page">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="page-title-group">
        <div class="page-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <div>
          <h1 class="page-title">User Task Overview</h1>
          <p class="page-subtitle">Monitor and track your team's accomplishments and progress.</p>
        </div>
      </div>
      <div class="header-right">
        <div class="date-chip">
          <span class="live-dot"></span>
          {{ formatDate(new Date()) }}
        </div>
        <button class="reload-btn" :class="{ 'reload-btn--spinning': isReloading }" title="Reload data" @click="reloadData">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- ── Filters Bar ── -->
    <div class="filters-bar">
      <div class="filters-left">
        <div class="filter-group">
          <label class="filter-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Filter by employee
          </label>
          <select v-model="selectedUserFilter" class="filter-select">
            <option value="">All employees</option>
            <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
          </select>
        </div>

        <div class="filter-divider"></div>

        <div class="filter-group">
          <label class="filter-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Filter by date
          </label>
          <input
            v-model="filterDate"
            type="date"
            class="filter-input"
            @change="updateFilteredTasks"
          />
        </div>

        <button v-if="filterDate || selectedUserFilter" class="clear-filters-btn" @click="clearFilters">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear filters
        </button>
      </div>

      <div class="filters-right">
        <div class="summary-chip summary-chip--total">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ filteredUsers.length }} employee{{ filteredUsers.length !== 1 ? 's' : '' }}
        </div>
        <div class="summary-chip summary-chip--tasks">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {{ totalTasksForView }} task{{ totalTasksForView !== 1 ? 's' : '' }} shown
        </div>
      </div>
    </div>

    <!-- ── Loading ── -->
    <div v-if="isLoading" class="state-card">
      <div class="spinner"></div>
      <p class="state-text">Loading team tasks…</p>
    </div>

    <!-- ── Empty ── -->
    <div v-else-if="filteredUsers.length === 0" class="state-card">
      <div class="empty-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 class="state-title">No employees found</h3>
      <p class="state-sub">Try adjusting your filters or refreshing the data.</p>
    </div>

    <!-- ── Employee Cards ── -->
    <div v-else class="employees-grid">
      <div v-for="user in filteredUsers" :key="user.id" class="employee-card">

        <!-- Card Header -->
        <div class="employee-card-header">
          <div class="employee-avatar">{{ nameInitials(user.name) }}</div>
          <div class="employee-info">
            <h3 class="employee-name">{{ user.name }}</h3>
            <p class="employee-task-count">
              {{ filteredTasks(user.tasks, filterDate).length }}
              task{{ filteredTasks(user.tasks, filterDate).length !== 1 ? 's' : '' }} for this period
            </p>
          </div>
          <div class="employee-hours-badge">
            <template v-if="totalHoursWorked(filteredTasks(user.tasks, filterDate)).totalHours > 0 || totalHoursWorked(filteredTasks(user.tasks, filterDate)).totalMinutes > 0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <span>
                <span v-if="totalHoursWorked(filteredTasks(user.tasks, filterDate)).totalHours > 0">
                  {{ totalHoursWorked(filteredTasks(user.tasks, filterDate)).totalHours }}h
                </span>
                <span v-if="totalHoursWorked(filteredTasks(user.tasks, filterDate)).totalMinutes > 0">
                  {{ totalHoursWorked(filteredTasks(user.tasks, filterDate)).totalMinutes }}m
                </span>
              </span>
            </template>
            <span v-else class="no-hours">—</span>
          </div>
        </div>

        <!-- Task List -->
        <div class="task-list">

          <!-- Empty for this date -->
          <div v-if="filteredTasks(user.tasks, filterDate).length === 0" class="task-empty">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>No tasks logged for this date.</span>
          </div>

          <!-- Task Items -->
          <div
            v-for="task in filteredTasks(user.tasks, filterDate)"
            :key="task.id"
            class="task-item"
            :class="taskItemClass(task)"
          >
            <div class="task-item-accent"></div>

            <div class="task-item-body">
              <!-- Top row -->
              <div class="task-item-header">
                <div class="task-status-badge" :class="taskStatusBadgeClass(task)">
                  <span class="status-dot"></span>
                  {{ task.done ? 'Done' : 'In Progress' }}
                </div>
                <span v-if="task.done && task.hours" class="task-hours-pill">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  {{ formatTaskHours(task.hours) }}
                </span>
                <span v-if="!task.done" class="sla-badge" :class="slaBadgeClass(task)">
                  {{ slaLabel(task) }}
                </span>
              </div>

              <!-- Title & description -->
              <h4 class="task-title">{{ task.title }}</h4>
              <p v-if="task.description" class="task-description">{{ task.description }}</p>

              <!-- Links -->
              <div v-if="task.links && task.links.length" class="task-links">
                <a
                  v-for="(link, index) in task.links"
                  :key="index"
                  :href="link"
                  target="_blank"
                  class="task-link"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View document {{ task.links.length > 1 ? index + 1 : '' }}
                </a>
              </div>
            </div>
          </div>

        </div>

        <!-- Card Footer: SLA Legend if there are in-progress tasks -->
        <div v-if="hasInProgressTasks(filteredTasks(user.tasks, filterDate))" class="card-sla-footer">
          <span class="sla-legend-label">SLA:</span>
          <span class="sla-legend-item sla-legend--watch">▸ 1 day</span>
          <span class="sla-legend-item sla-legend--warning">▸ 2 days</span>
          <span class="sla-legend-item sla-legend--critical">▸ 3+ days</span>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { getTasks } from '@/services/chief/taskService';

definePageMeta({ layout: 'chief' });

/* ── State ── */
const currentDate        = new Date().toLocaleDateString('en-CA');
const filterDate         = ref(currentDate);
const selectedUserFilter = ref('');
const users              = ref([]);
const isLoading          = ref(false);
const isReloading        = ref(false);
const showModal          = ref(false);
const selectedUser       = ref(null);
const newTask            = ref({ title: '', description: '' });
let intervalId           = null;

/* ── Computed ── */
const filteredUsers = computed(() => {
  if (selectedUserFilter.value) {
    return users.value.filter(u => u.id === Number(selectedUserFilter.value));
  }
  return users.value;
});

const totalTasksForView = computed(() =>
  filteredUsers.value.reduce(
    (sum, user) => sum + filteredTasks(user.tasks, filterDate.value).length, 0
  )
);

/* ── Helpers ── */
const nameInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  });

const formatTaskHours = (hours) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  let str = '';
  if (h > 0) str += `${h}h `;
  if (m > 0) str += `${m}m`;
  return str.trim() || '< 1m';
};

const filteredTasks = (tasks, date) => {
  if (!date) return tasks;
  return tasks.filter(t => new Date(t.date).toISOString().split('T')[0] === date);
};

const totalHoursWorked = (tasks) => {
  let totalMinutes = 0;
  tasks.forEach(t => {
    if (t.done && t.hours) totalMinutes += Math.round(t.hours * 60);
  });
  return {
    totalHours: Math.floor(totalMinutes / 60),
    totalMinutes: totalMinutes % 60,
  };
};

const getHoursElapsed = (task) => {
  return Math.floor((new Date() - new Date(task.date)) / (1000 * 60 * 60));
};

const taskItemClass = (task) => {
  if (task.done) return 'task-item--done';
  const h = getHoursElapsed(task);
  if (h >= 72) return 'task-item--critical';
  if (h >= 48) return 'task-item--warning';
  if (h >= 24) return 'task-item--watch';
  return 'task-item--active';
};

const taskStatusBadgeClass = (task) => {
  if (task.done) return 'badge--done';
  return 'badge--inprogress';
};

const slaBadgeClass = (task) => {
  const h = getHoursElapsed(task);
  if (h >= 72) return 'sla--critical';
  if (h >= 48) return 'sla--warning';
  if (h >= 24) return 'sla--watch';
  return '';
};

const slaLabel = (task) => {
  const h = getHoursElapsed(task);
  if (h >= 72) return `${Math.floor(h / 24)}d pending`;
  if (h >= 48) return '2d pending';
  if (h >= 24) return '1d pending';
  return null;
};

const hasInProgressTasks = (tasks) => tasks.some(t => !t.done);

/* ── Data fetching ── */
const fetchTasks = async (isReload = false) => {
  if (isReload) {
    isReloading.value = true;
  } else {
    isLoading.value = true;
  }
  try {
    const fetchedTasks = await getTasks();
    users.value = fetchedTasks.reduce((acc, task) => {
      const user = acc.find(u => u.id === task.user_id);
      const mapped = {
        id: task.id,
        title: task.title,
        description: task.description,
        done: task.status === 'Done',
        hours: task.hours_worked,
        date: task.date_added,
        links: task.links,
      };
      if (user) {
        user.tasks.push(mapped);
      } else {
        acc.push({
          id: task.user_id,
          name: `${task.user.first_name} ${task.user.last_name}`,
          tasks: [mapped],
        });
      }
      return acc;
    }, []);
    if (users.value.length > 0 && !selectedUser.value) {
      selectedUser.value = users.value[0].id;
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
  } finally {
    isLoading.value = false;
    isReloading.value = false;
  }
};

const reloadData = async () => fetchTasks(true);

const clearFilters = () => {
  filterDate.value = currentDate;
  selectedUserFilter.value = '';
};

const updateFilteredTasks = () => {};

const addTask = () => {
  const user = users.value.find(u => u.id === selectedUser.value);
  if (user) {
    user.tasks.push({
      id: user.tasks.length + 1,
      ...newTask.value,
      done: false,
      hours: 0,
      date: currentDate,
    });
    newTask.value = { title: '', description: '' };
    showModal.value = false;
  }
};

watch(filterDate, (val) => {
  if (val === '') filterDate.value = null;
});

onMounted(async () => {
  await fetchTasks();
});
onUnmounted(() => clearInterval(intervalId));
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ── Root ── */
.tasks-page {
  padding: 28px 32px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
.page-title-group {
  display: flex;
  align-items: center;
  gap: 14px;
}
.page-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
}
.page-title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.4px;
  margin: 0 0 3px;
  line-height: 1.2;
}
.page-subtitle {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
  margin: 0;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.date-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 6px 14px;
  white-space: nowrap;
}
.live-dot {
  width: 7px;
  height: 7px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
  50%       { opacity: .8; box-shadow: 0 0 0 5px rgba(34, 197, 94, 0); }
}
.reload-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
}
.reload-btn:hover { background: #f1f5f9; color: #1e293b; }
.reload-btn svg { transition: transform 0.3s ease; }
.reload-btn--spinning svg { animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Filters Bar ── */
.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #e8ecf4;
  border-radius: 14px;
  padding: 13px 18px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
}
.filters-left {
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap;
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.filter-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}
.filter-select,
.filter-input {
  padding: 7px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  font-size: 12.5px;
  font-family: inherit;
  font-weight: 500;
  color: #1e293b;
  background: #f8fafc;
  outline: none;
  cursor: pointer;
  transition: all 0.15s;
}
.filter-select:focus,
.filter-input:focus {
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.filter-divider {
  width: 1px;
  height: 26px;
  background: #e8ecf4;
  margin: 0 14px;
}
.clear-filters-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: 12px;
  padding: 5px 10px;
  font-size: 11.5px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.clear-filters-btn:hover { background: #fee2e2; color: #dc2626; border-color: #fecaca; }
.filters-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.summary-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 11px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 600;
  border: 1px solid transparent;
}
.summary-chip--total  { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.summary-chip--tasks  { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }

/* ── State cards ── */
.state-card {
  background: #ffffff;
  border: 1px solid #e8ecf4;
  border-radius: 16px;
  padding: 56px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
.empty-icon {
  width: 60px;
  height: 60px;
  background: #f1f5f9;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}
.state-title { font-size: 16px; font-weight: 700; color: #334155; margin: 0; }
.state-text  { font-size: 13px; color: #94a3b8; margin: 0; }
.state-sub   { font-size: 13px; color: #94a3b8; margin: 0; }

/* ── Employee Grid ── */
.employees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 16px;
}
@media (max-width: 860px) {
  .employees-grid { grid-template-columns: 1fr; }
}

/* ── Employee Card ── */
.employee-card {
  background: #ffffff;
  border: 1px solid #e8ecf4;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  display: flex;
  flex-direction: column;
}
.employee-card:hover {
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

/* Card Header */
.employee-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  background: linear-gradient(135deg, #fafbfe, #f0f4ff);
  border-bottom: 1px solid #e8ecf4;
}
.employee-avatar {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  font-size: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(37, 99, 235, 0.3);
}
.employee-info { flex: 1; min-width: 0; }
.employee-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.employee-task-count {
  font-size: 11.5px;
  color: #94a3b8;
  margin: 0;
  font-weight: 500;
}
.employee-hours-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}
.no-hours { color: #94a3b8; font-size: 13px; }

/* Task list */
.task-list {
  flex: 1;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.task-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 12px;
  color: #cbd5e1;
  font-size: 12.5px;
  font-style: italic;
}

/* ── Task Item ── */
.task-item {
  display: flex;
  border-radius: 10px;
  border: 1px solid transparent;
  overflow: hidden;
  transition: background 0.12s ease;
}
.task-item--done     { background: #fafafa;    border-color: #f1f5f9; }
.task-item--active   { background: #f8fbff;    border-color: #dbeafe; }
.task-item--watch    { background: #fffdf0;    border-color: #fde68a; }
.task-item--warning  { background: #fff8f4;    border-color: #fed7aa; }
.task-item--critical { background: #fff5f5;    border-color: #fecaca; }

.task-item-accent {
  width: 3px;
  align-self: stretch;
  flex-shrink: 0;
  background: transparent;
  border-radius: 3px 0 0 3px;
}
.task-item--done .task-item-accent     { background: #94a3b8; }
.task-item--active .task-item-accent   { background: #3b82f6; }
.task-item--watch .task-item-accent    { background: #f59e0b; }
.task-item--warning .task-item-accent  { background: #f97316; }
.task-item--critical .task-item-accent { background: #ef4444; }

.task-item-body { padding: 11px 13px; flex: 1; min-width: 0; }

/* Task item header row */
.task-item-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

/* Status badges */
.task-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 10.5px;
  font-weight: 700;
  border: 1px solid transparent;
}
.status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
.badge--done       { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
.badge--inprogress { background: #fffbeb; color: #d97706; border-color: #fde68a; }

/* Hours pill */
.task-hours-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  border-radius: 20px;
  font-size: 10.5px;
  font-weight: 700;
  margin-left: auto;
}

/* SLA badge */
.sla-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 10.5px;
  font-weight: 700;
  border: 1px solid transparent;
  margin-left: auto;
}
.sla--watch    { background: #fffbeb; color: #d97706; border-color: #fde68a; }
.sla--warning  { background: #fff7ed; color: #ea580c; border-color: #fed7aa; }
.sla--critical { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }

/* Task content */
.task-title {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 3px;
  line-height: 1.4;
}
.task-item--done .task-title {
  color: #94a3b8;
  text-decoration: line-through;
  text-decoration-color: #cbd5e1;
}
.task-description {
  font-size: 12px;
  color: #64748b;
  margin: 0 0 6px;
  line-height: 1.5;
}
.task-item--done .task-description { color: #94a3b8; }

/* Links */
.task-links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}
.task-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  padding: 3px 8px;
  text-decoration: none;
  transition: all 0.15s ease;
}
.task-link:hover { background: #dbeafe; color: #1d4ed8; }

/* SLA footer legend */
.card-sla-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-top: 1px solid #f1f5f9;
  background: #fafbfe;
  flex-wrap: wrap;
}
.sla-legend-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
}
.sla-legend-item {
  font-size: 10.5px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  border: 1px solid transparent;
}
.sla-legend--watch    { background: #fffbeb; color: #d97706; border-color: #fde68a; }
.sla-legend--warning  { background: #fff7ed; color: #ea580c; border-color: #fed7aa; }
.sla-legend--critical { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }
</style>