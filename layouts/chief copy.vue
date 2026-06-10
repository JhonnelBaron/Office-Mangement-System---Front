<!-- layouts/chief.vue -->
<template>
  <div class="layout-root">

    <!-- ── Sidebar ── -->
    <aside class="sidebar">

      <!-- Divider -->
      <div class="sidebar-divider"></div>

      <!-- Profile Card -->
      <div class="sidebar-profile">
        <div class="profile-avatar">
          <div class="avatar-initials">CH</div>
          <span class="online-dot"></span>
        </div>
        <div class="profile-info">
          <p class="profile-name">Chief</p>
          <p class="profile-role">Administrator</p>
        </div>
      </div>

      <!-- Divider -->
      <div class="sidebar-divider"></div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <p class="nav-section-label">Menu</p>
        <ul>

          <!-- Dashboard -->
          <li>
            <NuxtLink to="/chief" class="nav-item" active-class="nav-item--active" exact>
              <span class="nav-icon">
                <svg class="icon" fill="currentColor" viewBox="0 0 22 21">
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                </svg>
              </span>
              <span class="nav-label">Dashboard</span>
            </NuxtLink>
          </li>

          <!-- Tasks -->
          <li>
            <NuxtLink to="/chief/tasks" class="nav-item" active-class="nav-item--active">
              <span class="nav-icon">
                <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z"/>
                  <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z"/>
                  <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z"/>
                </svg>
              </span>
              <span class="nav-label">Tasks</span>
            </NuxtLink>
          </li>

          <!-- Attendance -->
          <li>
            <NuxtLink to="/chief/attendance" class="nav-item" active-class="nav-item--active">
              <span class="nav-icon">
                <svg class="icon" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                </svg>
              </span>
              <span class="nav-label">Attendance</span>
            </NuxtLink>
          </li>

        </ul>
      </nav>

      <!-- Spacer -->
      <div class="sidebar-spacer"></div>

      <!-- Logout -->
      <div class="sidebar-footer">
        <button class="logout-btn" @click="handleLogout">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span>Logout</span>
        </button>
      </div>

    </aside>

    <!-- ── Main Content ── -->
    <main class="main-content">
      <NuxtPage />
    </main>

  </div>
</template>

<script setup>
import { logoutUser } from '@/services/authService';

const handleLogout = async () => {
  await logoutUser();
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ── Root Layout ── */
.layout-root {
  display: flex;
  min-height: 100vh;
  background: #f4f6fb;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* ── Sidebar ── */
.sidebar {
  width: 240px;
  background: #ffffff;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e8ecf4;
  box-shadow: 2px 0 20px rgba(30, 60, 120, 0.05);
  z-index: 50;
}

/* ── Brand ── */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 18px 14px;
}
.brand-logo {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #1d4ed8, #3b82f6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
}
.brand-text {
  display: flex;
  flex-direction: column;
}
.brand-name {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
  letter-spacing: -0.3px;
}
.brand-sub {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 1px;
}

/* ── Divider ── */
.sidebar-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 0 14px;
}

/* ── Profile ── */
.sidebar-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  margin: 8px 8px 4px;
  background: linear-gradient(135deg, #eff6ff, #f8fafc);
  border-radius: 12px;
  border: 1px solid #dbeafe;
}
.profile-avatar {
  position: relative;
  flex-shrink: 0;
}
.avatar-initials {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  font-weight: 700;
  font-size: 12px;
}
.online-dot {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid white;
}
.profile-info {
  min-width: 0;
  flex: 1;
}
.profile-name {
  font-size: 12.5px;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  margin: 0;
}
.profile-role {
  font-size: 10.5px;
  color: #3b82f6;
  font-weight: 600;
  margin: 1px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Navigation ── */
.sidebar-nav {
  padding: 8px 10px 0;
}
.nav-section-label {
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  padding: 8px 8px 6px;
  margin: 0;
}
.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #64748b;
  text-decoration: none;
  position: relative;
  font-size: 13.5px;
  font-weight: 500;
}
.nav-item:hover {
  background: #f0f7ff;
  color: #2563eb;
}
.nav-item:hover .nav-icon {
  background: #dbeafe;
  color: #2563eb;
}
.nav-item--active {
  background: #eff6ff !important;
  color: #1d4ed8 !important;
  font-weight: 700;
}
.nav-item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 55%;
  background: #2563eb;
  border-radius: 0 3px 3px 0;
}
.nav-item--active .nav-icon {
  background: #dbeafe !important;
  color: #1d4ed8 !important;
}
.nav-icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 8px;
  flex-shrink: 0;
  transition: all 0.15s ease;
  color: #94a3b8;
}
.nav-icon .icon {
  width: 15px;
  height: 15px;
}
.nav-label {
  line-height: 1;
}

/* ── Spacer & Footer ── */
.sidebar-spacer {
  flex: 1;
}
.sidebar-footer {
  padding: 12px 12px 16px;
  border-top: 1px solid #f1f5f9;
}
.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: 10px;
  background: #fff5f5;
  color: #dc2626;
  border: 1px solid #fecaca;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.logout-btn svg {
  width: 15px;
  height: 15px;
  transition: transform 0.2s ease;
}
.logout-btn:hover {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
}
.logout-btn:hover svg {
  transform: translateX(2px);
}

/* ── Main Content ── */
.main-content {
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;
  overflow-y: auto;
}
</style>