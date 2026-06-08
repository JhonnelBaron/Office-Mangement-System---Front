<template>
  <div class="dashboard">

    <!-- ── Time In (always on top) ── -->
    <TimeIn />

    <!-- ── Welcome Banner ── -->
    <div class="welcome-banner">
      <div class="welcome-left">
        <div class="welcome-avatar">{{ userInitials }}</div>
        <div>
          <h1 class="welcome-title">Good {{ timeOfDay }}, <span class="welcome-name">{{ userName }}</span> 👋</h1>
          <p class="welcome-sub">Here's what's happening with your tasks today.</p>
        </div>
      </div>
      <div class="welcome-date-chip">
        <span class="live-dot"></span>
        {{ todayLabel }}
      </div>
    </div>

    <!-- ── Stat Cards ── -->
    <div class="stats-grid">

      <div class="stat-card stat-card--blue">
        <div class="stat-card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="stat-card-body">
          <p class="stat-label">Created Today</p>
          <p class="stat-value">{{ tasksToday }}</p>
          <p class="stat-sub">New task entries</p>
        </div>
      </div>

      <div class="stat-card stat-card--teal">
        <div class="stat-card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </div>
        <div class="stat-card-body">
          <p class="stat-label">This Cutoff</p>
          <p class="stat-value">{{ tasksThisCutoff }}</p>
          <p class="stat-sub">Total tasks logged</p>
        </div>
      </div>

      <div class="stat-card stat-card--green">
        <div class="stat-card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="stat-card-body">
          <p class="stat-label">Completed</p>
          <p class="stat-value">{{ tasksDone }}</p>
          <p class="stat-sub">Tasks marked done</p>
        </div>
      </div>

      <div class="stat-card stat-card--amber">
        <div class="stat-card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="stat-card-body">
          <p class="stat-label">Suspended</p>
          <p class="stat-value">{{ tasksSuspended }}</p>
          <p class="stat-sub">Paused or deferred</p>
        </div>
      </div>

      <div class="stat-card stat-card--purple">
        <div class="stat-card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="stat-card-body">
          <p class="stat-label">In Progress</p>
          <p class="stat-value">{{ tasksInProgress }}</p>
          <p class="stat-sub">Currently active</p>
        </div>
      </div>

    </div>

    <!-- ── Bottom Grid: Time Log + Chart ── -->
    <div class="bottom-grid">

      <!-- Time Log -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-header-icon panel-header-icon--blue">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <h3 class="panel-title">Time Log</h3>
            <p class="panel-sub">Your attendance records</p>
          </div>
        </div>

        <div class="panel-table-wrap">
          <table class="panel-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Time In</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(log, index) in userAttendance" :key="index">
                <td>{{ log.date }}</td>
                <td class="cell-day">{{ log.day }}</td>
                <td>
                  <span class="time-pill">{{ log.time_in }}</span>
                </td>
              </tr>
              <tr v-if="!userAttendance || userAttendance.length === 0">
                <td colspan="3" class="empty-cell">
                  <div class="empty-state">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>No attendance records found.</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Attendance Chart -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-header-icon panel-header-icon--teal">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div>
            <h3 class="panel-title">Attendance</h3>
            <p class="panel-sub">Time-in trend this week</p>
          </div>
        </div>

        <div class="chart-wrap">
          <Line :chart-data="chartData" :chart-options="chartOptions" />
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import TimeIn from '@/components/employee/TimeIn.vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS, PointElement, LineElement,
  CategoryScale, LinearScale, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { getTasks, getUserAttendance } from '@/services/empDashboardService';

definePageMeta({ layout: 'employee' });

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, Filler);

const userName     = ref('');
const userInitials = ref('');
const tasksToday      = ref(0);
const tasksThisCutoff = ref(0);
const tasksDone       = ref(0);
const tasksSuspended  = ref(0);
const tasksInProgress = ref(0);
const userAttendance  = ref([]);
const userCookie = useCookie('user');

const timeOfDay = computed(() => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
});

const todayLabel = computed(() =>
  new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
);

/* ── Chart config ── */
const chartData = ref({
  labels: [],
  datasets: [{
    label: 'Time In (minutes from midnight)',
    data: [],
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37,99,235,0.08)',
    pointBackgroundColor: '#2563eb',
    pointBorderColor: '#ffffff',
    pointBorderWidth: 2,
    pointRadius: 5,
    pointHoverRadius: 7,
    borderWidth: 2.5,
    tension: 0.4,
    fill: true,
  }],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: 'category',
      grid: { display: false },
      ticks: { color: '#94a3b8', font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" } },
      border: { display: false },
    },
    y: {
      type: 'linear',
      grid: { color: 'rgba(148,163,184,0.12)', drawBorder: false },
      border: { display: false, dash: [4, 4] },
      ticks: {
        color: '#94a3b8',
        font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" },
        callback(value) {
          const h = Math.floor(value / 60);
          const m = value % 60;
          const ampm = h >= 12 ? 'PM' : 'AM';
          const h12 = h % 12 || 12;
          return `${h12}:${m < 10 ? '0' : ''}${m} ${ampm}`;
        },
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: '#f8fafc',
      bodyColor: '#cbd5e1',
      padding: 10,
      cornerRadius: 8,
      callbacks: {
        label(ctx) {
          const v = ctx.parsed.y;
          const h = Math.floor(v / 60), m = v % 60;
          const ampm = h >= 12 ? 'PM' : 'AM';
          const h12 = h % 12 || 12;
          return `Time in: ${h12}:${m < 10 ? '0' : ''}${m} ${ampm}`;
        },
      },
    },
  },
});

const updateChartData = (attendance) => {
  if (!attendance?.length) return;
  chartData.value.labels = attendance.map(l => l.date);
  chartData.value.datasets[0].data = attendance.map(log => {
    const parts = log.time_in.split(' ');
    const [h, m] = parts[0].split(':').map(Number);
    return (parts[1] === 'PM' && h !== 12 ? h + 12 : (parts[1] === 'AM' && h === 12 ? 0 : h)) * 60 + m;
  });
};

onMounted(async () => {
  const raw = userCookie.value;
  let userData = null;
  if (raw) {
    try {
      const decoded = typeof raw === 'string' ? decodeURIComponent(raw) : raw;
      userData = typeof decoded === 'string' ? JSON.parse(decoded) : decoded;
    } catch (e) { console.error('Failed to parse user cookie:', e); }
  }

  if (userData?.first_name) {
    userName.value = userData.first_name;
    userInitials.value = ((userData.first_name?.[0] ?? '') + (userData.last_name?.[0] ?? '')).toUpperCase();
  }

  try {
    const tasks = await getTasks();
    tasksToday.value      = tasks.tasks_today      ?? 0;
    tasksThisCutoff.value = tasks.tasks_this_cutoff ?? 0;
    tasksDone.value       = tasks.tasks_done        ?? 0;
    tasksSuspended.value  = tasks.tasks_suspended   ?? 0;
    tasksInProgress.value = tasks.tasks_in_progress ?? 0;
  } catch (e) { console.error('Failed to fetch tasks:', e); }

  if (userData?.id) {
    try {
      const attendance = await getUserAttendance(userData.id);
      userAttendance.value = attendance ?? [];
      updateChartData(attendance);
    } catch (e) { console.error('Failed to fetch attendance:', e); }
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ── Root ── */
.dashboard {
  padding: 0px 32px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  font-family: 'Plus Jakarta Sans', sans-serif;
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
.welcome-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.welcome-avatar {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(37,99,235,0.3);
}
.welcome-title {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 3px;
  letter-spacing: -0.3px;
}
.welcome-name { color: #2563eb; }
.welcome-sub {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
  margin: 0;
}
.welcome-date-chip {
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
  flex-shrink: 0;
}
.live-dot {
  width: 7px;
  height: 7px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34,197,94,.5); }
  50%      { opacity: .8; box-shadow: 0 0 0 5px rgba(34,197,94,0); }
}

/* ── Stats Grid ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}
@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 640px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

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
  box-shadow: 0 8px 24px rgba(15,23,42,0.1);
}
.stat-card::after {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  opacity: 0.12;
  background: currentColor;
}

.stat-card--blue   { background: #eff6ff; border-color: #bfdbfe; color: #2563eb; }
.stat-card--teal   { background: #f0fdfa; border-color: #99f6e4; color: #0d9488; }
.stat-card--green  { background: #f0fdf4; border-color: #86efac; color: #16a34a; }
.stat-card--amber  { background: #fffbeb; border-color: #fde68a; color: #d97706; }
.stat-card--purple { background: #faf5ff; border-color: #d8b4fe; color: #7c3aed; }

.stat-card-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(4px);
  color: inherit;
}
.stat-card-body {}
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
  font-size: 32px;
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

/* ── Bottom Grid ── */
.bottom-grid {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 16px;
}
@media (max-width: 768px) {
  .bottom-grid { grid-template-columns: 1fr; }
}

/* ── Panel ── */
.panel {
  background: #ffffff;
  border: 1px solid #e8ecf4;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(15,23,42,0.04);
  display: flex;
  flex-direction: column;
}
.panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafbfe;
}
.panel-header-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.panel-header-icon--blue  { background: #dbeafe; color: #2563eb; }
.panel-header-icon--teal  { background: #ccfbf1; color: #0d9488; }
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

/* ── Time Log Table ── */
.panel-table-wrap {
  flex: 1;
  overflow-y: auto;
  max-height: 340px;
}
.panel-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.panel-table thead th {
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
}
.panel-table tbody tr {
  border-bottom: 1px solid #f8fafc;
  transition: background 0.1s;
}
.panel-table tbody tr:hover { background: #f8fafc; }
.panel-table tbody td {
  padding: 10px 16px;
  color: #334155;
  font-weight: 500;
}
.cell-day { color: #64748b; font-weight: 400; }
.time-pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 700;
  border: 1px solid #bfdbfe;
}

.empty-cell { padding: 32px 16px; }
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #cbd5e1;
  font-size: 12.5px;
  text-align: center;
}

/* ── Chart ── */
.chart-wrap {
  flex: 1;
  padding: 16px 20px 20px;
  position: relative;
  min-height: 300px;
}
</style>