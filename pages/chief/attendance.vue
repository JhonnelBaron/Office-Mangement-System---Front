<template>
  <div class="attendance-page">

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
          <h1 class="page-title">Attendance Monitoring</h1>
          <p class="page-subtitle">Track and review your team's daily attendance records.</p>
        </div>
      </div>

      <div class="header-right">
        <div class="date-chip">
          <span class="live-dot"></span>
          {{ formatDate(new Date()) }}
        </div>
        <div class="header-nav-links">
          <NuxtLink to="/chief/attendance-summary" class="nav-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Weekly Summary
          </NuxtLink>
          <NuxtLink to="/chief/attendance-summary-monthly" class="nav-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Monthly Summary
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ── Stat Cards ── -->
    <div class="stats-grid">

      <div class="stat-card stat-card--blue">
        <div class="stat-card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="stat-card-body">
          <p class="stat-label">Total Present</p>
          <p class="stat-value">{{ presentCount }}</p>
          <p class="stat-sub">{{ filterDate === currentDate ? 'Today' : formatDate(filterDate) }}</p>
        </div>
      </div>

      <div class="stat-card stat-card--red">
        <div class="stat-card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="stat-card-body">
          <p class="stat-label">Total Absent</p>
          <p class="stat-value">{{ absentCount }}</p>
          <p class="stat-sub">{{ filterDate === currentDate ? 'Today' : formatDate(filterDate) }}</p>
        </div>
      </div>

      <div class="stat-card stat-card--amber">
        <div class="stat-card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="stat-card-body">
          <p class="stat-label">Late Arrivals</p>
          <p class="stat-value">{{ lateCount }}</p>
          <p class="stat-sub">{{ filterDate === currentDate ? 'Today' : formatDate(filterDate) }}</p>
        </div>
      </div>

      <div class="stat-card stat-card--green">
        <div class="stat-card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <div class="stat-card-body">
          <p class="stat-label">Total Employees</p>
          <p class="stat-value">{{ employees.length }}</p>
          <p class="stat-sub">In the system</p>
        </div>
      </div>

    </div>

    <!-- ── Attendance Log Panel ── -->
    <div class="panel">

      <!-- Panel Header -->
      <div class="panel-header">
        <div class="panel-header-left">
          <div class="panel-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div>
            <h3 class="panel-title">Attendance Log</h3>
            <p class="panel-sub">
              {{ filteredAttendance.length }} record{{ filteredAttendance.length !== 1 ? 's' : '' }} found
            </p>
          </div>
        </div>

        <!-- Filters -->
        <div class="panel-filters">
          <div class="filter-group">
            <label class="filter-label">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
              </svg>
              Status
            </label>
            <select v-model="selectedFilter" class="filter-select" @change="updateFilteredAttendance">
              <option value="all">All statuses</option>
              <option value="onTime">On Time</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          <div class="filter-divider"></div>

          <div class="filter-group">
            <label class="filter-label">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Date
            </label>
            <input
              v-model="filterDate"
              type="date"
              class="filter-input"
              @change="updateFilteredAttendance"
            />
          </div>

          <button
            v-if="filterDate !== currentDate || selectedFilter !== 'all'"
            class="clear-btn"
            @click="clearFilters"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Clear
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrap">
        <table class="att-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Status</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loading skeleton -->
            <template v-if="isLoading">
              <tr v-for="n in 5" :key="n" class="skeleton-row">
                <td><div class="skeleton skeleton--name"></div></td>
                <td><div class="skeleton skeleton--badge"></div></td>
                <td><div class="skeleton skeleton--time"></div></td>
                <td><div class="skeleton skeleton--time"></div></td>
                <td><div class="skeleton skeleton--score"></div></td>
              </tr>
            </template>

            <!-- Empty state -->
            <tr v-else-if="filteredAttendance.length === 0">
              <td colspan="5" class="empty-cell">
                <div class="empty-state">
                  <div class="empty-state-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <h4 class="empty-state-title">No records found</h4>
                  <p class="empty-state-sub">Try adjusting your date or status filter.</p>
                </div>
              </td>
            </tr>

            <!-- Data rows -->
            <tr
              v-else
              v-for="record in filteredAttendance"
              :key="record.employeeName"
              class="data-row"
            >
              <td class="cell-employee">
                <div class="employee-row">
                  <div class="employee-avatar">{{ nameInitials(record.employeeName) }}</div>
                  <span class="employee-name">{{ record.employeeName }}</span>
                </div>
              </td>
              <td class="cell-status">
                <span class="status-badge" :class="statusBadgeClass(record.status)">
                  <span class="status-dot"></span>
                  {{ normalizeStatus(record.status) }}
                </span>
              </td>
              <td class="cell-time">
                <span v-if="record.time_in && record.time_in !== '--'" class="time-pill">
                  {{ record.time_in }}
                </span>
                <span v-else class="time-empty">—</span>
              </td>
              <td class="cell-time">
                <span v-if="record.time_out && record.time_out !== '--'" class="time-pill time-pill--out">
                  {{ record.time_out }}
                </span>
                <span v-else class="time-empty">—</span>
              </td>
              <td class="cell-score">
                <div class="score-wrapper">
                  <div class="score-bar-bg">
                    <div
                      class="score-bar-fill"
                      :class="scoreBarClass(record.score)"
                      :style="{ width: `${Math.min(record.score, 100)}%` }"
                    ></div>
                  </div>
                  <span class="score-value">{{ record.score }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAttendance, getEmployees } from '@/services/chief/attendanceService';

definePageMeta({ layout: 'chief' });

/* ── State ── */
const employees         = ref([]);
const attendance        = ref([]);
const filteredAttendance = ref([]);
const filterDate        = ref('');
const selectedFilter    = ref('all');
const isLoading         = ref(false);
const currentDate       = new Date().toLocaleDateString('en-CA');

/* ── Helpers ── */
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  });

const nameInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
};

const normalizeStatus = (status) => {
  if (!status) return 'Unknown';
  if (status === 'On Time' || status === 'early' || status === 'exactly') return 'On Time';
  const map = { late: 'Late', absent: 'Absent' };
  return map[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
};

const statusBadgeClass = (status) => {
  const s = normalizeStatus(status);
  if (s === 'On Time') return 'badge--present';
  if (s === 'Late')    return 'badge--late';
  if (s === 'Absent')  return 'badge--absent';
  return 'badge--default';
};

const scoreBarClass = (score) => {
  if (score >= 80) return 'bar--high';
  if (score >= 50) return 'bar--mid';
  return 'bar--low';
};

/* ── Computed counts ── */
const presentCount = computed(() =>
  attendance.value.filter(
    a => new Date(a.date).toLocaleDateString('en-CA') === filterDate.value &&
         a.status !== 'absent'
  ).length
);

const absentCount = computed(() =>
  filteredAttendance.value.filter(item => item.status === 'absent').length
);

const lateCount = computed(() =>
  attendance.value.filter(
    a => new Date(a.date).toLocaleDateString('en-CA') === filterDate.value &&
         a.status === 'late'
  ).length
);

/* ── Data ── */
const fetchEmployees = async () => {
  try {
    employees.value = await getEmployees();
  } catch (e) {
    console.error('Error fetching employees:', e);
  }
};

const fetchAttendance = async () => {
  try {
    attendance.value = await getAttendance();
    updateFilteredAttendance();
  } catch (e) {
    console.error('Error fetching attendance:', e);
  }
};

const updateFilteredAttendance = () => {
  filteredAttendance.value = employees.value
    .map((employee) => {
      const record = attendance.value.find(
        item =>
          item.user_id === employee.id &&
          new Date(item.date).toLocaleDateString('en-CA') === filterDate.value
      );
      return {
        employeeName: `${employee.first_name} ${employee.last_name}`,
        status: record
          ? (record.status === 'early' || record.status === 'exactly' ? 'On Time' : record.status)
          : 'absent',
        time_in:  record ? record.time_in  : '--',
        time_out: record ? record.time_out : '--',
        score:    record ? record.score    : 0,
      };
    })
    .filter(item => {
      if (selectedFilter.value === 'all')    return true;
      if (selectedFilter.value === 'onTime') return item.status === 'On Time';
      if (selectedFilter.value === 'late')   return item.status === 'late';
      if (selectedFilter.value === 'absent') return item.status === 'absent';
      return true;
    });
};

const clearFilters = () => {
  filterDate.value    = currentDate;
  selectedFilter.value = 'all';
  updateFilteredAttendance();
};

onMounted(async () => {
  isLoading.value = true;
  filterDate.value = currentDate;
  await fetchEmployees();
  await fetchAttendance();
  isLoading.value = false;
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ── Root ── */
.attendance-page {
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
  flex-wrap: wrap;
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
.header-nav-links {
  display: flex;
  align-items: center;
  gap: 6px;
}
.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  font-size: 12.5px;
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.15s ease;
}
.nav-link:hover {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}
.router-link-active.nav-link {
  background: #eff6ff;
  color: #1d4ed8;
  border-color: #bfdbfe;
  font-weight: 700;
}

/* ── Stats Grid ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
@media (max-width: 900px)  { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px)  { .stats-grid { grid-template-columns: 1fr; } }

.stat-card {
  border-radius: 14px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
}
.stat-card::after {
  content: '';
  position: absolute;
  top: -20px; right: -20px;
  width: 70px; height: 70px;
  border-radius: 50%;
  opacity: 0.12;
  background: currentColor;
}

.stat-card--blue  { background: #eff6ff; border-color: #bfdbfe; color: #2563eb; }
.stat-card--red   { background: #fff1f2; border-color: #fecdd3; color: #e11d48; }
.stat-card--amber { background: #fffbeb; border-color: #fde68a; color: #d97706; }
.stat-card--green { background: #f0fdf4; border-color: #86efac; color: #16a34a; }

.stat-card-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  color: inherit;
}
.stat-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: inherit;
  opacity: 0.7;
  margin: 0 0 4px;
}
.stat-value {
  font-size: 34px;
  font-weight: 800;
  color: inherit;
  line-height: 1;
  margin: 0 0 4px;
  letter-spacing: -1px;
}
.stat-sub {
  font-size: 11px;
  font-weight: 500;
  color: inherit;
  opacity: 0.6;
  margin: 0;
}

/* ── Panel ── */
.panel {
  background: #ffffff;
  border: 1px solid #e8ecf4;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafbfe;
}
.panel-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.panel-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #dbeafe;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.panel-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px;
}
.panel-sub {
  font-size: 11.5px;
  color: #94a3b8;
  margin: 0;
}
.panel-filters {
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap;
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 7px;
}
.filter-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}
.filter-select,
.filter-input {
  padding: 7px 11px;
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
  background: #fff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.filter-divider {
  width: 1px;
  height: 26px;
  background: #e8ecf4;
  margin: 0 12px;
}
.clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: 10px;
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
.clear-btn:hover { background: #fee2e2; color: #dc2626; border-color: #fecaca; }

/* ── Table ── */
.table-wrap {
  overflow-x: auto;
}
.att-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.att-table thead th {
  position: sticky;
  top: 0;
  background: #f8fafc;
  padding: 10px 16px;
  text-align: left;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}
.data-row {
  border-bottom: 1px solid #f8fafc;
  transition: background 0.1s ease;
}
.data-row:last-child { border-bottom: none; }
.data-row:hover { background: #f8fafc; }
.att-table td { padding: 12px 16px; vertical-align: middle; }

/* Employee cell */
.cell-employee {}
.employee-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.employee-avatar {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.employee-name {
  font-weight: 600;
  color: #1e293b;
}

/* Status badge */
.cell-status {}
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 700;
  border: 1px solid transparent;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.badge--present { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
.badge--late    { background: #fffbeb; color: #d97706; border-color: #fde68a; }
.badge--absent  { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }
.badge--default { background: #f1f5f9; color: #64748b; border-color: #e2e8f0; }

/* Time cells */
.cell-time { white-space: nowrap; }
.time-pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 700;
}
.time-pill--out {
  background: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}
.time-empty {
  color: #cbd5e1;
  font-size: 13px;
}

/* Score cell */
.cell-score {}
.score-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 100px;
}
.score-bar-bg {
  flex: 1;
  height: 6px;
  background: #f1f5f9;
  border-radius: 20px;
  overflow: hidden;
}
.score-bar-fill {
  height: 100%;
  border-radius: 20px;
  transition: width 0.4s ease;
}
.bar--high { background: linear-gradient(90deg, #22c55e, #16a34a); }
.bar--mid  { background: linear-gradient(90deg, #f59e0b, #d97706); }
.bar--low  { background: linear-gradient(90deg, #f87171, #ef4444); }
.score-value {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  min-width: 24px;
  text-align: right;
}

/* ── Skeleton loading ── */
.skeleton-row td { padding: 14px 16px; }
.skeleton {
  border-radius: 6px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e8ecf4 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  height: 14px;
}
.skeleton--name  { width: 140px; }
.skeleton--badge { width: 70px; height: 22px; border-radius: 20px; }
.skeleton--time  { width: 80px; }
.skeleton--score { width: 100px; }
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Empty state ── */
.empty-cell { padding: 48px 16px !important; }
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}
.empty-state-icon {
  width: 56px;
  height: 56px;
  background: #f1f5f9;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}
.empty-state-title {
  font-size: 15px;
  font-weight: 700;
  color: #334155;
  margin: 0;
}
.empty-state-sub {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}
</style>