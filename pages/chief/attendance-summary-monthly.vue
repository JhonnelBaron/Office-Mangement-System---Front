<template>
  <div class="monthly-page">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="page-title-group">
        <div class="page-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
        <div>
          <h1 class="page-title">Monthly Attendance Summary</h1>
          <p class="page-subtitle">Year-at-a-glance attendance breakdown per employee.</p>
        </div>
      </div>

      <div class="header-right">
        <div class="date-chip">
          <span class="live-dot"></span>
          {{ formatDate(new Date()) }}
        </div>
        <div class="header-nav-links">
          <NuxtLink to="/chief/attendance" class="nav-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Daily Log
          </NuxtLink>
          <NuxtLink to="/chief/attendance-summary" class="nav-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Weekly Summary
          </NuxtLink>
          <NuxtLink to="/chief/attendance-summary-monthly" class="nav-link nav-link--active">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Monthly Summary
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ── Year Selector ── -->
    <div class="year-bar">
      <div class="year-bar-left">
        <button class="year-btn" @click="changeYear(-1)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="year-label">{{ selectedYear }}</span>
        <button class="year-btn" :disabled="selectedYear >= currentYear" @click="changeYear(1)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <div class="year-bar-right">
        <!-- Current month highlight indicator -->
        <div class="current-month-chip">
          <span class="chip-dot chip-dot--blue"></span>
          Current month: <strong>{{ months[currentMonth - 1] }}</strong>
        </div>
        <!-- Legend -->
        <div class="legend">
          <div class="legend-item">
            <span class="legend-swatch legend-swatch--high"></span>High (≥80%)
          </div>
          <div class="legend-item">
            <span class="legend-swatch legend-swatch--mid"></span>Mid (50–79%)
          </div>
          <div class="legend-item">
            <span class="legend-swatch legend-swatch--low"></span>Low (&lt;50%)
          </div>
          <div class="legend-item">
            <span class="legend-swatch legend-swatch--empty"></span>No data
          </div>
        </div>
      </div>
    </div>

    <!-- ── Summary Panel ── -->
    <div class="panel">

      <!-- Panel Header -->
      <div class="panel-header">
        <div class="panel-header-left">
          <div class="panel-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div>
            <h3 class="panel-title">Employee Attendance — {{ selectedYear }}</h3>
            <p class="panel-sub">{{ employees.length }} employee{{ employees.length !== 1 ? 's' : '' }} · hover a cell to see details</p>
          </div>
        </div>

        <div class="search-wrap">
          <span class="search-icon-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search employee…"
            class="search-input"
          />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrap">
        <table class="monthly-table">
          <thead>
            <tr>
              <th class="th-employee">Employee</th>
              <th
                v-for="(month, index) in months"
                :key="index"
                class="th-month"
                :class="{ 'th-month--current': index + 1 === currentMonth && selectedYear === currentYear }"
              >
                {{ month }}
              </th>
              <th class="th-avg">Yearly Avg</th>
            </tr>
          </thead>
          <tbody>

            <!-- Loading skeletons -->
            <template v-if="isLoading">
              <tr v-for="n in 6" :key="n" class="skeleton-row">
                <td><div class="skeleton skeleton--name"></div></td>
                <td v-for="m in 12" :key="m"><div class="skeleton skeleton--cell"></div></td>
                <td><div class="skeleton skeleton--avg"></div></td>
              </tr>
            </template>

            <!-- Empty search state -->
            <tr v-else-if="filteredEmployees.length === 0">
              <td :colspan="14" class="empty-cell">
                <div class="empty-state">
                  <div class="empty-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
                    </svg>
                  </div>
                  <h4 class="empty-title">No employees found</h4>
                  <p class="empty-sub">Try a different search term.</p>
                </div>
              </td>
            </tr>

            <!-- Data rows -->
            <tr
              v-else
              v-for="employee in filteredEmployees"
              :key="employee.id"
              class="data-row"
            >
              <!-- Employee name -->
              <td class="td-employee">
                <div class="employee-cell">
                  <div class="emp-avatar">{{ nameInitials(employee) }}</div>
                  <div class="emp-info">
                    <span class="emp-name">{{ employee.first_name }} {{ employee.last_name }}</span>
                    <span class="emp-avg-inline">
                      Avg: {{ calculateYearlyAverage(employee.id, selectedYear) }}%
                    </span>
                  </div>
                </div>
              </td>

              <!-- Month cells -->
              <td
                v-for="(month, index) in months"
                :key="index"
                class="td-month"
                :class="{ 'td-month--current': index + 1 === currentMonth && selectedYear === currentYear }"
              >
                <div
                  class="month-cell"
                  :class="monthCellClass(employee.id, index + 1)"
                  :title="`${employee.first_name} ${employee.last_name} — ${month}: ${getMonthlyAttendance(employee.id, index + 1, selectedYear)}`"
                >
                  <span class="month-val">
                    {{ getMonthlyAttendance(employee.id, index + 1, selectedYear) }}
                  </span>
                </div>
              </td>

              <!-- Yearly average -->
              <td class="td-avg">
                <div class="avg-cell" :class="avgCellClass(employee.id)">
                  {{ calculateYearlyAverage(employee.id, selectedYear) }}
                  <span v-if="calculateYearlyAverage(employee.id, selectedYear) !== '—'" class="avg-pct">%</span>
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

/* ── Constants ── */
const months      = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const currentYear  = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

/* ── State ── */
const employees   = ref([]);
const attendance  = ref([]);
const isLoading   = ref(false);
const searchQuery = ref('');
const selectedYear = ref(currentYear);

/* ── Computed ── */
const filteredEmployees = computed(() => {
  if (!searchQuery.value.trim()) return employees.value;
  const q = searchQuery.value.toLowerCase();
  return employees.value.filter(e =>
    `${e.first_name} ${e.last_name}`.toLowerCase().includes(q)
  );
});

/* ── Helpers ── */
const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

const nameInitials = (emp) =>
  ((emp.first_name?.[0] ?? '') + (emp.last_name?.[0] ?? '')).toUpperCase();

const changeYear = (delta) => {
  const next = selectedYear.value + delta;
  if (next <= currentYear) selectedYear.value = next;
};

/* ── Data helpers ── */
const getMonthlyAttendance = (employeeId, month, year) => {
  const record = attendance.value.find(
    a => a.employee_id === employeeId &&
         a.month === month &&
         (year ? new Date(a.date ?? `${year}-${month}-01`).getFullYear() === year : true)
  );
  return record ? record.attendance : '—';
};

const calculateYearlyAverage = (employeeId, year) => {
  const records = attendance.value.filter(
    a => a.employee_id === employeeId &&
         (year ? new Date(a.date ?? `${year}-01-01`).getFullYear() === year : true)
  );
  if (!records.length) return '—';
  const total = records.reduce((sum, r) => sum + (r.attendance ?? 0), 0);
  return (total / records.length).toFixed(1);
};

const monthCellClass = (employeeId, month) => {
  const val = getMonthlyAttendance(employeeId, month, selectedYear.value);
  if (val === '—') return 'cell--empty';
  const n = parseFloat(val);
  if (n >= 80) return 'cell--high';
  if (n >= 50) return 'cell--mid';
  return 'cell--low';
};

const avgCellClass = (employeeId) => {
  const val = calculateYearlyAverage(employeeId, selectedYear.value);
  if (val === '—') return '';
  const n = parseFloat(val);
  if (n >= 80) return 'avg--high';
  if (n >= 50) return 'avg--mid';
  return 'avg--low';
};

/* ── Data fetching ── */
const fetchAll = async () => {
  isLoading.value = true;
  try {
    const [empRes, attRes] = await Promise.all([getEmployees(), getAttendance()]);
    employees.value  = empRes ?? [];
    attendance.value = attRes ?? [];
  } catch (e) {
    console.error('Error fetching data:', e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchAll);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ── Root ── */
.monthly-page {
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
  0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
  50%      { opacity: .8; box-shadow: 0 0 0 5px rgba(34, 197, 94, 0); }
}
.header-nav-links {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  font-size: 12.5px;
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.nav-link:hover { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
.nav-link--active,
.router-link-active.nav-link {
  background: #eff6ff;
  color: #1d4ed8;
  border-color: #bfdbfe;
  font-weight: 700;
}

/* ── Year Bar ── */
.year-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #e8ecf4;
  border-radius: 14px;
  padding: 12px 18px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
}
.year-bar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.year-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}
.year-btn:hover:not(:disabled) { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
.year-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.year-label {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
  min-width: 52px;
  text-align: center;
}
.year-bar-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.current-month-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #475569;
  font-weight: 500;
}
.current-month-chip strong { color: #1d4ed8; font-weight: 700; }
.chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.chip-dot--blue { background: #2563eb; }

/* Legend */
.legend {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: #64748b;
  font-weight: 500;
}
.legend-swatch {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}
.legend-swatch--high  { background: #22c55e; }
.legend-swatch--mid   { background: #f59e0b; }
.legend-swatch--low   { background: #ef4444; }
.legend-swatch--empty { background: #e2e8f0; }

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

/* Search */
.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon-wrap {
  position: absolute;
  left: 11px;
  color: #94a3b8;
  pointer-events: none;
  display: flex;
}
.search-input {
  padding: 8px 34px 8px 34px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 12.5px;
  font-family: inherit;
  font-weight: 500;
  color: #1e293b;
  background: #f8fafc;
  outline: none;
  width: 200px;
  transition: all 0.15s ease;
}
.search-input::placeholder { color: #94a3b8; }
.search-input:focus {
  border-color: #3b82f6;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  width: 240px;
}
.search-clear {
  position: absolute;
  right: 9px;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  border: none;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}
.search-clear:hover { background: #fecaca; color: #dc2626; }

/* ── Table ── */
.table-wrap {
  overflow-x: auto;
}
.monthly-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}

/* Thead */
.monthly-table thead th {
  padding: 10px 8px;
  text-align: center;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 2;
}
.th-employee {
  text-align: left !important;
  padding-left: 20px !important;
  min-width: 200px;
  z-index: 3 !important;
  position: sticky !important;
  left: 0 !important;
  background: #f8fafc !important;
  box-shadow: 2px 0 4px rgba(15,23,42,0.04);
}
.th-month { min-width: 52px; }
.th-month--current {
  background: #eff6ff !important;
  color: #1d4ed8 !important;
}
.th-avg {
  min-width: 90px;
  color: #475569 !important;
  background: #f1f5f9 !important;
}

/* Data rows */
.data-row {
  border-bottom: 1px solid #f8fafc;
  transition: background 0.1s ease;
}
.data-row:last-child { border-bottom: none; }
.data-row:hover { background: #f8fafc; }
.data-row:hover .td-employee { background: #f0f7ff; }

/* Employee cell */
.td-employee {
  position: sticky;
  left: 0;
  background: #ffffff;
  z-index: 1;
  padding: 10px 12px 10px 20px;
  box-shadow: 2px 0 4px rgba(15, 23, 42, 0.04);
  transition: background 0.1s ease;
}
.employee-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.emp-avatar {
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
.emp-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.emp-name {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
}
.emp-avg-inline {
  font-size: 10.5px;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 1px;
}

/* Month cells */
.td-month {
  padding: 8px 5px;
  text-align: center;
}
.td-month--current { background: rgba(37, 99, 235, 0.03); }

.month-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 28px;
  border-radius: 7px;
  font-size: 11.5px;
  font-weight: 700;
  cursor: default;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  border: 1px solid transparent;
}
.month-cell:hover {
  transform: scale(1.15);
  box-shadow: 0 3px 10px rgba(15, 23, 42, 0.12);
  z-index: 1;
  position: relative;
}

/* Cell color states */
.cell--high  { background: #dcfce7; color: #15803d; border-color: #86efac; }
.cell--mid   { background: #fef9c3; color: #a16207; border-color: #fde047; }
.cell--low   { background: #fee2e2; color: #b91c1c; border-color: #fca5a5; }
.cell--empty { background: #f1f5f9; color: #cbd5e1; border-color: transparent; }

/* Avg cell */
.td-avg {
  padding: 8px 12px;
  text-align: center;
  background: #fafbfe;
  border-left: 1px solid #f1f5f9;
}
.avg-cell {
  display: inline-flex;
  align-items: baseline;
  gap: 1px;
  font-size: 13px;
  font-weight: 800;
  border-radius: 8px;
  padding: 3px 10px;
  border: 1px solid transparent;
}
.avg-pct { font-size: 10px; font-weight: 600; }
.avg--high { background: #dcfce7; color: #15803d; border-color: #86efac; }
.avg--mid  { background: #fef9c3; color: #a16207; border-color: #fde047; }
.avg--low  { background: #fee2e2; color: #b91c1c; border-color: #fca5a5; }

/* Skeleton */
.skeleton-row td { padding: 12px 8px; }
.skeleton {
  border-radius: 6px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e8ecf4 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  height: 12px;
  margin: 0 auto;
}
.skeleton--name { width: 140px; height: 14px; }
.skeleton--cell { width: 36px; height: 24px; border-radius: 7px; }
.skeleton--avg  { width: 52px; height: 24px; border-radius: 7px; }
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty state */
.empty-cell { padding: 56px 16px !important; }
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}
.empty-icon {
  width: 56px;
  height: 56px;
  background: #f1f5f9;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}
.empty-title { font-size: 15px; font-weight: 700; color: #334155; margin: 0; }
.empty-sub   { font-size: 13px; color: #94a3b8; margin: 0; }
</style>