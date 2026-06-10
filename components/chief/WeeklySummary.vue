<template>
  <div class="weekly-page">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="page-title-group">
        <div class="page-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div>
          <h1 class="page-title">Weekly Attendance Summary</h1>
          <p class="page-subtitle">Monitor time-in records and punctuality scores per week.</p>
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
          <NuxtLink to="/chief/attendance-summary" class="nav-link nav-link--active">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
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

    <!-- ── Week Selector Bar ── -->
    <div class="week-bar">
      <div class="week-bar-selectors">
        <div class="filter-group">
          <label class="filter-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Month
          </label>
          <select v-model="selectedMonth" class="filter-select" @change="updateWeeks">
            <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}</option>
          </select>
        </div>

        <div class="filter-divider"></div>

        <div class="filter-group">
          <label class="filter-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Week
          </label>
          <select v-model="selectedWeek" class="filter-select">
            <option v-for="(week, index) in weeks" :key="index" :value="index">{{ week }}</option>
          </select>
        </div>

        <div class="week-range-chip">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {{ weekRangeLabel }}
        </div>
      </div>

      <div class="week-bar-right">
        <!-- Tab switcher -->
        <div class="tab-group">
          <button
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === 'timein' }"
            @click="activeTab = 'timein'"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Time In
          </button>
          <button
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === 'score' }"
            @click="activeTab = 'score'"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Scores
          </button>
        </div>
      </div>
    </div>

    <!-- ── Stat Row ── -->
    <div class="stats-grid">
      <div class="stat-card stat-card--blue">
        <div class="stat-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <div>
          <p class="stat-label">Total Employees</p>
          <p class="stat-value">{{ filteredEmployeeAttendance.length }}</p>
        </div>
      </div>
      <div class="stat-card stat-card--green">
        <div class="stat-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <p class="stat-label">Full Week Present</p>
          <p class="stat-value">{{ fullWeekPresentCount }}</p>
        </div>
      </div>
      <div class="stat-card stat-card--amber">
        <div class="stat-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div>
          <p class="stat-label">With Absences</p>
          <p class="stat-value">{{ withAbsencesCount }}</p>
        </div>
      </div>
      <div class="stat-card stat-card--purple">
        <div class="stat-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
        </div>
        <div>
          <p class="stat-label">Avg Weekly Score</p>
          <p class="stat-value">{{ weeklyAvgScore }}</p>
        </div>
      </div>
    </div>

    <!-- ── Main Table Panel ── -->
    <div class="panel">

      <!-- Panel Header -->
      <div class="panel-header">
        <div class="panel-header-left">
          <div class="panel-icon" :class="activeTab === 'score' ? 'panel-icon--purple' : 'panel-icon--blue'">
            <svg v-if="activeTab === 'timein'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div>
            <h3 class="panel-title">
              Weekly {{ activeTab === 'timein' ? 'Time-In Log' : 'Punctuality Scores' }}
            </h3>
            <p class="panel-sub">
              {{ months[selectedMonth] }} · {{ weeks[selectedWeek] }} ·
              {{ filteredEmployeeAttendance.length }} employee{{ filteredEmployeeAttendance.length !== 1 ? 's' : '' }}
            </p>
          </div>
        </div>

        <!-- Search -->
        <div class="search-wrap">
          <span class="search-icon-wrap">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
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
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrap">
        <table class="weekly-table">
          <thead>
            <tr>
              <th class="th-employee">Employee</th>
              <th v-for="(day, idx) in weekDays" :key="idx" class="th-day" :class="{ 'th-day--today': isToday(idx + 1) }">
                <div class="th-day-name">{{ day }}</div>
                <div class="th-day-date" :class="{ 'th-day-date--today': isToday(idx + 1) }">{{ getDayOfMonth(idx + 1) }}</div>
              </th>
              <th class="th-avg">{{ activeTab === 'timein' ? 'Avg Time In' : 'Avg Score' }}</th>
            </tr>
          </thead>
          <tbody>

            <!-- Loading -->
            <template v-if="isLoading">
              <tr v-for="n in 5" :key="n" class="skeleton-row">
                <td><div class="skeleton skeleton--name"></div></td>
                <td v-for="d in 5" :key="d"><div class="skeleton skeleton--cell"></div></td>
                <td><div class="skeleton skeleton--avg"></div></td>
              </tr>
            </template>

            <!-- No results -->
            <tr v-else-if="displayedAttendance.length === 0">
              <td colspan="7" class="empty-cell">
                <div class="empty-state">
                  <div class="empty-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
                    </svg>
                  </div>
                  <h4 class="empty-title">No records found</h4>
                  <p class="empty-sub">Try adjusting your week selection or search term.</p>
                </div>
              </td>
            </tr>

            <!-- Data rows -->
            <tr
              v-else
              v-for="data in displayedAttendance"
              :key="data.employee.id"
              class="data-row"
            >
              <!-- Employee -->
              <td class="td-employee">
                <div class="emp-cell">
                  <div class="emp-avatar">{{ nameInitials(data.employee) }}</div>
                  <div class="emp-info">
                    <span class="emp-name">{{ data.employee.first_name }} {{ data.employee.last_name }}</span>
                    <span class="emp-sub">{{ daysPresent(data.attendance) }}/5 days present</span>
                  </div>
                </div>
              </td>

              <!-- Time-in mode -->
              <template v-if="activeTab === 'timein'">
                <td v-for="(day, idx) in ['Mon','Tue','Wed','Thu','Fri']" :key="idx" class="td-day" :class="{ 'td-day--today': isToday(idx + 1) }">
                  <span v-if="data.attendance[day]?.time_in" class="time-pill" :class="timePillClass(data.attendance[day].time_in)">
                    {{ data.attendance[day].time_in }}
                  </span>
                  <span v-else class="absent-pill">—</span>
                </td>
                <td class="td-avg">
                  <span class="avg-val">{{ calculateAverage(data.attendance) }}</span>
                </td>
              </template>

              <!-- Score mode -->
              <template v-else>
                <td v-for="(day, idx) in ['Mon','Tue','Wed','Thu','Fri']" :key="idx" class="td-day" :class="{ 'td-day--today': isToday(idx + 1) }">
                  <div v-if="data.attendance[day]?.score !== undefined && data.attendance[day]?.score !== null" class="score-cell">
                    <div class="score-bar-bg">
                      <div
                        class="score-bar-fill"
                        :class="scoreBarClass(data.attendance[day].score)"
                        :style="{ width: `${Math.min(data.attendance[day].score, 100)}%` }"
                      ></div>
                    </div>
                    <span class="score-num" :class="scoreNumClass(data.attendance[day].score)">
                      {{ data.attendance[day].score }}
                    </span>
                  </div>
                  <span v-else class="absent-pill">—</span>
                </td>
                <td class="td-avg">
                  <span
                    class="avg-score-badge"
                    :class="avgScoreBadgeClass(calculateAverageScore(data.attendance))"
                  >
                    {{ calculateAverageScore(data.attendance) }}
                  </span>
                </td>
              </template>

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

/* ── Constants ── */
const months   = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const weekDays = ['Mon','Tue','Wed','Thu','Fri'];
const today    = new Date();

/* ── State ── */
const attendance  = ref([]);
const employees   = ref([]);
const isLoading   = ref(false);
const searchQuery = ref('');
const activeTab   = ref('timein'); // 'timein' | 'score'

const selectedMonth = ref(today.getMonth());
const selectedWeek  = ref(0);
const weeks         = ref([]);

/* ── Helpers ── */
const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

const nameInitials = (emp) =>
  ((emp.first_name?.[0] ?? '') + (emp.last_name?.[0] ?? '')).toUpperCase();

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const updateWeeks = () => {
  const year = today.getFullYear();
  const daysInMonth = getDaysInMonth(year, selectedMonth.value);
  const firstDayOfMonth = new Date(year, selectedMonth.value, 1).getDay();
  const totalDays = daysInMonth + firstDayOfMonth;
  const numberOfWeeks = Math.ceil(totalDays / 7);
  weeks.value = Array.from({ length: numberOfWeeks }, (_, i) => `Week ${i + 1}`);
};

const currentWeekNumber = () => {
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  return Math.ceil((today.getDate() + firstDayOfMonth) / 7) - 1;
};

const getDateOfWeek = (dayOffset) => {
  const year = today.getFullYear();
  const month = selectedMonth.value;
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const weekStartDay = (selectedWeek.value * 7) - firstDayOfMonth;
  const date = new Date(year, month, 1 + weekStartDay + dayOffset);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${mm}-${dd}-${date.getFullYear()}`;
};

const getDayOfMonth = (dayOffset) => {
  const year = today.getFullYear();
  const startOfMonth = new Date(year, selectedMonth.value, 1);
  const startOfSelectedWeek = new Date(year, selectedMonth.value, selectedWeek.value * 7 + 1);
  const firstDayOfMonth = startOfMonth.getDay();
  const startOfWeek = new Date(startOfSelectedWeek);
  startOfWeek.setDate(startOfSelectedWeek.getDate() - firstDayOfMonth + dayOffset);
  return startOfWeek.getDate();
};

const isToday = (dayOffset) => {
  const year = today.getFullYear();
  const month = selectedMonth.value;
  if (month !== today.getMonth() || year !== today.getFullYear()) return false;
  return getDayOfMonth(dayOffset) === today.getDate();
};

const weekRangeLabel = computed(() => {
  const start = getDayOfMonth(1);
  const end   = getDayOfMonth(5);
  return `${months[selectedMonth.value].slice(0, 3)} ${start} – ${end}`;
});

const daysPresent = (att) =>
  weekDays.filter(d => att[d]?.time_in).length;

/* ── Time formatting ── */
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr || timeStr === '-') return null;
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const timePillClass = (timeStr) => {
  const mins = parseTimeToMinutes(timeStr);
  if (mins === null) return '';
  if (mins <= 8 * 60)  return 'pill--early';
  if (mins <= 8 * 60 + 15) return 'pill--ontime';
  return 'pill--late';
};

const calculateAverage = (att) => {
  const values = weekDays
    .map(d => parseTimeToMinutes(att[d]?.time_in))
    .filter(v => v !== null);
  if (!values.length) return '—';
  const avg = values.reduce((s, v) => s + v, 0) / values.length;
  const h = Math.floor(avg / 60);
  const m = Math.floor(avg % 60);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2,'0')}:${String(m).padStart(2,'0')} ${period}`;
};

const calculateAverageScore = (att) => {
  const scores = weekDays
    .map(d => att[d]?.score)
    .filter(s => s !== undefined && s !== null);
  if (!scores.length) return '—';
  return (scores.reduce((s, v) => s + v, 0) / scores.length).toFixed(1);
};

/* ── Score helpers ── */
const scoreBarClass = (score) => {
  if (score >= 80) return 'bar--high';
  if (score >= 50) return 'bar--mid';
  return 'bar--low';
};
const scoreNumClass = (score) => {
  if (score >= 80) return 'num--high';
  if (score >= 50) return 'num--mid';
  return 'num--low';
};
const avgScoreBadgeClass = (val) => {
  if (val === '—') return '';
  const n = parseFloat(val);
  if (n >= 80) return 'avg-badge--high';
  if (n >= 50) return 'avg-badge--mid';
  return 'avg-badge--low';
};

/* ── Computed attendance ── */
const filteredEmployeeAttendance = computed(() =>
  employees.value.map(employee => ({
    employee,
    attendance: {
      Mon: attendance.value.find(r => r.user_id === employee.id && r.date === getDateOfWeek(1)) || {},
      Tue: attendance.value.find(r => r.user_id === employee.id && r.date === getDateOfWeek(2)) || {},
      Wed: attendance.value.find(r => r.user_id === employee.id && r.date === getDateOfWeek(3)) || {},
      Thu: attendance.value.find(r => r.user_id === employee.id && r.date === getDateOfWeek(4)) || {},
      Fri: attendance.value.find(r => r.user_id === employee.id && r.date === getDateOfWeek(5)) || {},
    },
  }))
);

const displayedAttendance = computed(() => {
  if (!searchQuery.value.trim()) return filteredEmployeeAttendance.value;
  const q = searchQuery.value.toLowerCase();
  return filteredEmployeeAttendance.value.filter(d =>
    `${d.employee.first_name} ${d.employee.last_name}`.toLowerCase().includes(q)
  );
});

/* ── Quick stats ── */
const fullWeekPresentCount = computed(() =>
  filteredEmployeeAttendance.value.filter(d => daysPresent(d.attendance) === 5).length
);
const withAbsencesCount = computed(() =>
  filteredEmployeeAttendance.value.filter(d => daysPresent(d.attendance) < 5).length
);
const weeklyAvgScore = computed(() => {
  const scores = filteredEmployeeAttendance.value
    .map(d => calculateAverageScore(d.attendance))
    .filter(v => v !== '—')
    .map(Number);
  if (!scores.length) return '—';
  return (scores.reduce((s, v) => s + v, 0) / scores.length).toFixed(1);
});

/* ── Data fetching ── */
onMounted(async () => {
  isLoading.value = true;
  updateWeeks();
  selectedWeek.value = currentWeekNumber();
  try {
    const [empRes, attRes] = await Promise.all([getEmployees(), getAttendance()]);
    employees.value  = empRes  ?? [];
    attendance.value = attRes ?? [];
  } catch (e) {
    console.error('Error fetching data:', e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ── Root ── */
.weekly-page {
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
.page-title-group { display: flex; align-items: center; gap: 14px; }
.page-icon {
  width: 44px; height: 44px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: white; flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(37,99,235,0.3);
}
.page-title { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.4px; margin: 0 0 3px; }
.page-subtitle { font-size: 13px; color: #94a3b8; font-weight: 500; margin: 0; }
.header-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
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
.header-nav-links { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.nav-link {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 13px; font-size: 12.5px; font-weight: 600;
  color: #475569; background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 10px; text-decoration: none; transition: all 0.15s ease; white-space: nowrap;
}
.nav-link:hover { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
.nav-link--active { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; font-weight: 700; }

/* ── Week Bar ── */
.week-bar {
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 12px;
  background: #fff; border: 1px solid #e8ecf4; border-radius: 14px;
  padding: 13px 18px; box-shadow: 0 1px 4px rgba(15,23,42,0.04);
}
.week-bar-selectors { display: flex; align-items: center; gap: 0; flex-wrap: wrap; }
.filter-group { display: flex; align-items: center; gap: 7px; }
.filter-label {
  display: flex; align-items: center; gap: 4px;
  font-size: 11.5px; font-weight: 600; color: #64748b; white-space: nowrap;
}
.filter-select {
  padding: 7px 11px; border: 1px solid #e2e8f0; border-radius: 9px;
  font-size: 12.5px; font-family: inherit; font-weight: 500;
  color: #1e293b; background: #f8fafc; outline: none; cursor: pointer; transition: all 0.15s;
}
.filter-select:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
.filter-divider { width: 1px; height: 26px; background: #e8ecf4; margin: 0 12px; }
.week-range-chip {
  display: inline-flex; align-items: center; gap: 5px;
  margin-left: 14px; padding: 5px 12px; border-radius: 20px;
  font-size: 12px; font-weight: 700; color: #1d4ed8;
  background: #eff6ff; border: 1px solid #bfdbfe;
}
.week-bar-right { display: flex; align-items: center; }

/* Tab group */
.tab-group {
  display: inline-flex; align-items: center;
  background: #f1f5f9; border-radius: 10px; padding: 3px;
}
.tab-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 8px; border: none;
  font-size: 12.5px; font-weight: 600; font-family: inherit;
  color: #64748b; background: transparent; cursor: pointer; transition: all 0.15s ease;
}
.tab-btn:hover { color: #334155; }
.tab-btn--active { background: #fff; color: #1d4ed8; box-shadow: 0 1px 4px rgba(15,23,42,0.08); }

/* ── Stats Grid ── */
.stats-grid {
  display: grid; grid-template-columns: repeat(4,1fr); gap: 14px;
}
@media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 500px) { .stats-grid { grid-template-columns: 1fr; } }

.stat-card {
  border-radius: 14px; padding: 16px 16px;
  display: flex; align-items: center; gap: 12px;
  border: 1px solid transparent;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,23,42,0.08); }
.stat-card--blue   { background: #eff6ff; border-color: #bfdbfe; color: #2563eb; }
.stat-card--green  { background: #f0fdf4; border-color: #86efac; color: #16a34a; }
.stat-card--amber  { background: #fffbeb; border-color: #fde68a; color: #d97706; }
.stat-card--purple { background: #faf5ff; border-color: #d8b4fe; color: #7c3aed; }
.stat-icon {
  width: 34px; height: 34px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.7); color: inherit; flex-shrink: 0;
}
.stat-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: inherit; opacity: 0.65; margin: 0 0 3px; }
.stat-value { font-size: 26px; font-weight: 800; color: inherit; line-height: 1; margin: 0; letter-spacing: -0.5px; }

/* ── Panel ── */
.panel { background: #fff; border: 1px solid #e8ecf4; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 4px rgba(15,23,42,0.04); }
.panel-header {
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 12px; padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9; background: #fafbfe;
}
.panel-header-left { display: flex; align-items: center; gap: 12px; }
.panel-icon {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.panel-icon--blue   { background: #dbeafe; color: #2563eb; }
.panel-icon--purple { background: #ede9fe; color: #7c3aed; }
.panel-title { font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 2px; }
.panel-sub   { font-size: 11.5px; color: #94a3b8; margin: 0; }

/* Search */
.search-wrap { position: relative; display: flex; align-items: center; }
.search-icon-wrap { position: absolute; left: 11px; color: #94a3b8; pointer-events: none; display: flex; }
.search-input {
  padding: 8px 32px 8px 34px; border: 1px solid #e2e8f0; border-radius: 10px;
  font-size: 12.5px; font-family: inherit; font-weight: 500;
  color: #1e293b; background: #f8fafc; outline: none; width: 190px; transition: all 0.15s ease;
}
.search-input::placeholder { color: #94a3b8; }
.search-input:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); width: 230px; }
.search-clear {
  position: absolute; right: 9px; width: 20px; height: 20px;
  border-radius: 5px; border: none; background: #e2e8f0; color: #64748b;
  display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s;
}
.search-clear:hover { background: #fecaca; color: #dc2626; }

/* ── Table ── */
.table-wrap { overflow-x: auto; }
.weekly-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }

.weekly-table thead th {
  padding: 10px 12px; text-align: center;
  font-size: 10.5px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: #94a3b8;
  background: #f8fafc; border-bottom: 1px solid #f1f5f9;
  white-space: nowrap; position: sticky; top: 0; z-index: 2;
}
.th-employee {
  text-align: left !important; padding-left: 20px !important;
  min-width: 210px; position: sticky !important; left: 0 !important;
  z-index: 3 !important; box-shadow: 2px 0 4px rgba(15,23,42,0.04);
}
.th-day { min-width: 90px; }
.th-day--today { background: #eff6ff !important; }
.th-day-name { font-weight: 700; font-size: 11px; }
.th-day-date { font-size: 12px; color: #64748b; font-weight: 600; margin-top: 2px; }
.th-day-date--today {
  background: #2563eb; color: white; border-radius: 20px;
  padding: 1px 6px; display: inline-block;
}
.th-avg { min-width: 110px; color: #475569 !important; background: #f1f5f9 !important; }

.data-row { border-bottom: 1px solid #f8fafc; transition: background 0.1s ease; }
.data-row:last-child { border-bottom: none; }
.data-row:hover { background: #f8fafc; }
.data-row:hover .td-employee { background: #f0f7ff; }

/* Employee cell */
.td-employee {
  position: sticky; left: 0; background: #fff; z-index: 1;
  padding: 10px 12px 10px 20px;
  box-shadow: 2px 0 4px rgba(15,23,42,0.04); transition: background 0.1s ease;
}
.emp-cell { display: flex; align-items: center; gap: 10px; }
.emp-avatar {
  width: 32px; height: 32px; border-radius: 9px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white; font-size: 11px; font-weight: 800;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.emp-info { display: flex; flex-direction: column; min-width: 0; }
.emp-name { font-size: 13px; font-weight: 700; color: #1e293b; white-space: nowrap; }
.emp-sub  { font-size: 10.5px; color: #94a3b8; font-weight: 500; margin-top: 1px; }

/* Day cells */
.td-day { padding: 10px 8px; text-align: center; vertical-align: middle; }
.td-day--today { background: rgba(37,99,235,0.03); }
.td-avg { padding: 10px 12px; text-align: center; background: #fafbfe; border-left: 1px solid #f1f5f9; vertical-align: middle; }

/* Time pills */
.time-pill {
  display: inline-flex; align-items: center; padding: 3px 9px;
  border-radius: 20px; font-size: 11.5px; font-weight: 700;
  border: 1px solid transparent; white-space: nowrap;
}
.pill--early  { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
.pill--ontime { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.pill--late   { background: #fff1f2; color: #be123c; border-color: #fecdd3; }
.absent-pill  { color: #cbd5e1; font-size: 14px; font-weight: 500; }

.avg-val { font-size: 12.5px; font-weight: 700; color: #475569; }

/* Score cells */
.score-cell { display: flex; align-items: center; gap: 6px; justify-content: center; }
.score-bar-bg { width: 44px; height: 5px; background: #f1f5f9; border-radius: 20px; overflow: hidden; flex-shrink: 0; }
.score-bar-fill { height: 100%; border-radius: 20px; transition: width 0.4s ease; }
.bar--high { background: linear-gradient(90deg, #22c55e, #16a34a); }
.bar--mid  { background: linear-gradient(90deg, #f59e0b, #d97706); }
.bar--low  { background: linear-gradient(90deg, #f87171, #ef4444); }
.score-num { font-size: 12px; font-weight: 800; min-width: 24px; }
.num--high { color: #16a34a; }
.num--mid  { color: #d97706; }
.num--low  { color: #dc2626; }

/* Avg score badge */
.avg-score-badge {
  display: inline-flex; align-items: center; padding: 3px 10px;
  border-radius: 20px; font-size: 12px; font-weight: 800; border: 1px solid transparent;
}
.avg-badge--high { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
.avg-badge--mid  { background: #fef9c3; color: #a16207; border-color: #fde047; }
.avg-badge--low  { background: #fee2e2; color: #b91c1c; border-color: #fca5a5; }

/* Skeleton */
.skeleton-row td { padding: 12px 8px; }
.skeleton {
  border-radius: 6px; margin: 0 auto;
  background: linear-gradient(90deg, #f1f5f9 25%, #e8ecf4 50%, #f1f5f9 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite; height: 12px;
}
.skeleton--name { width: 140px; height: 14px; }
.skeleton--cell { width: 72px; height: 26px; border-radius: 20px; }
.skeleton--avg  { width: 80px; height: 26px; border-radius: 20px; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* Empty state */
.empty-cell { padding: 56px 16px !important; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; }
.empty-icon { width: 56px; height: 56px; background: #f1f5f9; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #cbd5e1; }
.empty-title { font-size: 15px; font-weight: 700; color: #334155; margin: 0; }
.empty-sub   { font-size: 13px; color: #94a3b8; margin: 0; }
</style>