<template>
  <div class="notif-page">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="page-title-group">
        <div class="page-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </div>
        <div>
          <h1 class="page-title">Notifications</h1>
          <p class="page-subtitle">Manage and view all your system activities and alerts.</p>
        </div>
      </div>
      <div class="header-stats">
        <div v-if="unreadNotifications.length > 0" class="unread-badge">
          <span class="unread-dot"></span>
          {{ unreadNotifications.length }} unread
        </div>
        <div class="total-chip">{{ notifStore.notifications.length }} total</div>
      </div>
    </div>

    <!-- ── Search ── -->
    <div class="search-bar">
      <span class="search-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
        </svg>
      </span>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by routeslip no., subject, or instructions..."
        class="search-input"
      />
      <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- ── Loading ── -->
    <div v-if="notifStore.loading" class="state-card">
      <div class="spinner"></div>
      <p class="state-text">Fetching your updates…</p>
    </div>

    <!-- ── Empty ── -->
    <div v-else-if="notifStore.notifications.length === 0" class="state-card">
      <div class="empty-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
      </div>
      <h3 class="state-title">All caught up!</h3>
      <p class="state-sub">No notifications found in your history.</p>
    </div>

    <!-- ── No search results ── -->
    <div v-else-if="searchQuery && filteredNotifications.length === 0" class="state-card">
      <div class="empty-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
        </svg>
      </div>
      <h3 class="state-title">No results found</h3>
      <p class="state-sub">No notifications match "<strong>{{ searchQuery }}</strong>".</p>
    </div>

    <!-- ── Notification List ── -->
    <div v-else class="notif-sections">

      <!-- Unread group -->
      <div v-if="unreadNotifications.length > 0" class="notif-group">
        <div class="group-header">
          <span class="group-label group-label--unread">Unread</span>
          <span class="group-count group-count--unread">{{ unreadNotifications.length }}</span>
        </div>
        <div class="notif-list notif-list--unread">
          <div
            v-for="notif in unreadNotifications"
            :key="notif.id"
            class="notif-item notif-item--unread"
            @click="handleNotifClick(notif)"
          >
            <div class="notif-accent notif-accent--blue"></div>
            <div class="notif-dot-col">
              <span class="unread-indicator"></span>
            </div>
            <div class="notif-content">
              <div class="notif-meta-row">
                <div class="notif-tags">
                  <span class="tag tag--routeslip">{{ notif.routeslip_no }}</span>
                  <span class="tag" :class="urgencyTagClass(notif.urgency)">{{ notif.urgency }}</span>
                </div>
                <time class="notif-time">{{ formatTimestamp(notif.updated_at) }}</time>
              </div>
              <h4 class="notif-subject notif-subject--unread">{{ notif.r_subject }}</h4>
              <p v-if="notif.assigned_focal_name" class="notif-focal">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                {{ notif.assigned_focal_name }}
              </p>
            </div>
            <div class="notif-chevron">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Read group -->
      <div v-if="readNotifications.length > 0" class="notif-group">
        <div class="group-header">
          <span class="group-label group-label--read">Read</span>
          <span class="group-count group-count--read">{{ readNotifications.length }}</span>
        </div>
        <div class="notif-list notif-list--read">
          <div
            v-for="notif in readNotifications"
            :key="notif.id"
            class="notif-item notif-item--read"
            @click="handleNotifClick(notif)"
          >
            <div class="notif-accent notif-accent--gray"></div>
            <div class="notif-content notif-content--read">
              <div class="notif-meta-row">
                <div class="notif-tags">
                  <span class="tag tag--routeslip tag--muted">{{ notif.routeslip_no }}</span>
                  <span class="tag" :class="urgencyTagClass(notif.urgency, true)">{{ notif.urgency }}</span>
                </div>
                <time class="notif-time">{{ formatTimestamp(notif.updated_at) }}</time>
              </div>
              <h4 class="notif-subject notif-subject--read">{{ notif.r_subject }}</h4>
              <p v-if="notif.assigned_focal_name" class="notif-focal notif-focal--muted">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                {{ notif.assigned_focal_name }}
              </p>
            </div>
            <div class="notif-chevron notif-chevron--muted">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ── Detail Drawer ── -->
    <Transition name="slide">
      <div v-if="selectedNotif" class="drawer">

        <div class="drawer-header">
          <div class="drawer-header-left">
            <div class="drawer-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <h3 class="drawer-title">Routeslip Details</h3>
              <p class="drawer-routeslip-no">{{ selectedNotif.routeslip_no }}</p>
            </div>
          </div>
          <button class="drawer-close" @click="selectedNotif = null">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="drawer-body">

          <div class="drawer-section">
            <label class="drawer-label">Subject</label>
            <h2 class="drawer-subject">{{ selectedNotif.r_subject }}</h2>
          </div>

          <div class="drawer-chips">
            <div class="chip-group">
              <span class="chip-label">Urgency</span>
              <span class="chip" :class="urgencyChipClass(selectedNotif.urgency)">
                <span class="chip-dot"></span>{{ selectedNotif.urgency }}
              </span>
            </div>
            <div class="chip-group">
              <span class="chip-label">Status</span>
              <span class="chip chip--status">{{ selectedNotif.status }}</span>
            </div>
          </div>

          <div class="drawer-section">
            <label class="drawer-label">Instructions</label>
            <div class="drawer-instructions">
              <svg class="instructions-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="drawer-instructions-text">
                {{ (selectedNotif.r_instructions && selectedNotif.r_instructions !== 'N/A')
                    ? selectedNotif.r_instructions
                    : 'No specific instructions provided.' }}
              </p>
            </div>
          </div>

          <div class="drawer-details-grid">
            <div class="drawer-detail">
              <label class="drawer-label">Assigned Focal</label>
              <div class="focal-row">
                <div class="focal-avatar">{{ focalInitials(selectedNotif.assigned_focal_name) }}</div>
                <p class="drawer-detail-val">{{ selectedNotif.assigned_focal_name || '—' }}</p>
              </div>
            </div>
            <div class="drawer-detail">
              <label class="drawer-label">Action Taken</label>
              <p class="drawer-detail-val">{{ selectedNotif.r_action_taken || 'None yet' }}</p>
            </div>
            <div class="drawer-detail">
              <label class="drawer-label">Received</label>
              <p class="drawer-detail-val">{{ formatTimestamp(selectedNotif.created_at) }}</p>
            </div>
            <div class="drawer-detail">
              <label class="drawer-label">Last Updated</label>
              <p class="drawer-detail-val">{{ formatTimestamp(selectedNotif.updated_at) }}</p>
            </div>
          </div>

          <div class="drawer-section">
            <label class="drawer-label">Document Reference</label>
            <button
              v-if="hasReference(selectedNotif.reference)"
              class="ref-btn"
              @click="openReference(selectedNotif.reference)"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              View Document Reference
            </button>
            <div v-else class="ref-empty">No reference link available.</div>
          </div>

        </div>

        <div class="drawer-footer">
          <button class="btn-secondary" @click="selectedNotif = null">Dismiss</button>
          <button class="btn-primary" @click="handleCreateTask">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Create Task
          </button>
        </div>

      </div>
    </Transition>

    <!-- Backdrop -->
    <Transition name="fade">
      <div v-if="selectedNotif" class="drawer-backdrop" @click="selectedNotif = null"/>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import { useRoute } from 'vue-router';

definePageMeta({ layout: 'employee' });

const notifStore    = useNotificationStore();
const selectedNotif = ref(null);
const route         = useRoute();
const searchQuery   = ref('');
const userCookie    = useCookie('user');

const filteredNotifications = computed(() => {
  if (!searchQuery.value) return notifStore.notifications;
  const q = searchQuery.value.toLowerCase();
  return notifStore.notifications.filter(n =>
    n.routeslip_no?.toLowerCase().includes(q) ||
    n.r_subject?.toLowerCase().includes(q) ||
    n.r_instructions?.toLowerCase().includes(q) ||
    n.assigned_focal_name?.toLowerCase().includes(q)
  );
});

const unreadNotifications = computed(() =>
  filteredNotifications.value.filter(n => !n.read_at && n.is_read === 0)
);
const readNotifications = computed(() =>
  filteredNotifications.value.filter(n => n.read_at || n.is_read === 1)
);

const urgencyTagClass = (urgency, muted = false) => {
  if (urgency === 'High')   return muted ? 'tag--high-muted'   : 'tag--high';
  if (urgency === 'Medium') return muted ? 'tag--medium-muted' : 'tag--medium';
  return muted ? 'tag--low-muted' : 'tag--low';
};
const urgencyChipClass = (urgency) => {
  if (urgency === 'High')   return 'chip--high';
  if (urgency === 'Medium') return 'chip--medium';
  return 'chip--low';
};
const focalInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
};
const hasReference = (ref) =>
  ref && ref !== '-' && ref !== 'N/A' && ref.startsWith('http');
const formatTimestamp = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const handleNotifClick = async (notif) => {
  if (notif.is_read === 0 || !notif.read_at) await notifStore.markAsRead(notif.id);
  selectedNotif.value = notif;
};
const checkQueryParam = () => {
  const id = route.query.id;
  if (id) {
    const target = notifStore.notifications.find(n => n.id == id);
    if (target) handleNotifClick(target);
  }
};
const handleCreateTask = () => {
  if (!selectedNotif.value) return;
  const notif = selectedNotif.value;
  navigateTo({ path: '/employee/tasking', query: { subject: notif.r_subject, paps: 'Routeslips', ref_no: notif.routeslip_no } });
};
const openReference = (url) => {
  if (!url) return;
  const w = 1100, h = 900;
  const left = (window.innerWidth - w) / 2 + window.screenX;
  const top  = (window.innerHeight - h) / 2 + window.screenY;
  window.open(url, 'DocRef', `width=${w},height=${h},top=${top},left=${left},scrollbars=yes,resizable=yes`);
};

onMounted(async () => {
  await notifStore.fetchNotifications();
  checkQueryParam();
});
watch(() => route.query.id, () => checkQueryParam());
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.notif-page {
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
  gap: 12px;
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
.header-stats { display: flex; align-items: center; gap: 8px; }
.unread-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 12px; background: #eff6ff; color: #1d4ed8;
  border: 1px solid #bfdbfe; border-radius: 20px;
  font-size: 12px; font-weight: 700;
}
.unread-dot {
  width: 7px; height: 7px; background: #2563eb; border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(37,99,235,.4); }
  50%      { opacity:.7; box-shadow: 0 0 0 5px rgba(37,99,235,0); }
}
.total-chip {
  padding: 5px 12px; background: #f8fafc; color: #64748b;
  border: 1px solid #e2e8f0; border-radius: 20px; font-size: 12px; font-weight: 600;
}

/* ── Search ── */
.search-bar { position: relative; display: flex; align-items: center; }
.search-icon {
  position: absolute; left: 14px; color: #94a3b8;
  display: flex; align-items: center; pointer-events: none;
}
.search-input {
  width: 100%; padding: 11px 42px;
  border: 1px solid #e2e8f0; border-radius: 12px;
  font-size: 13.5px; font-family: inherit; font-weight: 500;
  color: #1e293b; background: #fff; outline: none;
  box-shadow: 0 1px 4px rgba(15,23,42,0.04);
  transition: all 0.15s ease;
}
.search-input::placeholder { color: #94a3b8; }
.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.12), 0 1px 4px rgba(15,23,42,0.04);
}
.search-clear {
  position: absolute; right: 12px;
  width: 24px; height: 24px; border-radius: 6px;
  border: none; background: #f1f5f9; color: #64748b;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.15s;
}
.search-clear:hover { background: #e2e8f0; color: #0f172a; }

/* ── State cards ── */
.state-card {
  background: #fff; border: 1px solid #e8ecf4; border-radius: 16px;
  padding: 56px 32px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.spinner {
  width: 32px; height: 32px;
  border: 3px solid #e2e8f0; border-top-color: #2563eb;
  border-radius: 50%; animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.empty-icon {
  width: 60px; height: 60px; background: #f1f5f9; border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  color: #cbd5e1; margin-bottom: 4px;
}
.state-title { font-size: 16px; font-weight: 700; color: #334155; margin: 0; }
.state-text  { font-size: 13px; color: #94a3b8; margin: 0; }
.state-sub   { font-size: 13px; color: #94a3b8; margin: 0; }
.state-sub strong { color: #475569; font-weight: 600; }

/* ── Groups ── */
.notif-sections { display: flex; flex-direction: column; gap: 20px; }
.notif-group    { display: flex; flex-direction: column; gap: 10px; }
.group-header   { display: flex; align-items: center; gap: 8px; }
.group-label {
  font-size: 10.5px; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.08em;
}
.group-label--unread { color: #2563eb; }
.group-label--read   { color: #94a3b8; }
.group-count {
  padding: 1px 8px; border-radius: 20px;
  font-size: 10.5px; font-weight: 800;
}
.group-count--unread { background: #dbeafe; color: #1d4ed8; }
.group-count--read   { background: #f1f5f9; color: #94a3b8; }

/* ── Notif list wrapper ── */
.notif-list {
  background: #fff; border: 1px solid #e8ecf4;
  border-radius: 14px; overflow: hidden;
  box-shadow: 0 1px 4px rgba(15,23,42,0.04);
}
.notif-list--unread { border-color: #bfdbfe; }

/* ── Notif item ── */
.notif-item {
  display: flex; align-items: center;
  cursor: pointer; transition: background 0.12s ease;
  border-bottom: 1px solid #f8fafc; position: relative; overflow: hidden;
}
.notif-item:last-child { border-bottom: none; }
.notif-item--unread { background: #f8fbff; }
.notif-item--read   { background: #fff; }
.notif-item--unread:hover { background: #eff6ff; }
.notif-item--read:hover   { background: #f8fafc; }

.notif-accent { width: 3px; align-self: stretch; flex-shrink: 0; }
.notif-accent--blue { background: #2563eb; }
.notif-accent--gray { background: transparent; transition: background 0.12s; }
.notif-item--read:hover .notif-accent--gray { background: #e2e8f0; }

.notif-dot-col {
  padding: 0 10px 0 12px; flex-shrink: 0;
  display: flex; align-items: center;
}
.unread-indicator {
  width: 8px; height: 8px;
  background: #2563eb; border-radius: 50%;
}

.notif-content { flex: 1; padding: 14px 12px 14px 0; min-width: 0; }
.notif-content--read { padding-left: 16px; }

.notif-meta-row {
  display: flex; justify-content: space-between; align-items: center;
  gap: 8px; margin-bottom: 6px; flex-wrap: wrap;
}
.notif-tags { display: flex; gap: 5px; flex-wrap: wrap; }

/* ── Tags ── */
.tag {
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: 5px;
  font-size: 10.5px; font-weight: 700;
  border: 1px solid transparent;
  text-transform: uppercase; letter-spacing: 0.04em;
}
.tag--routeslip       { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.tag--routeslip.tag--muted { background: #f1f5f9; color: #64748b; border-color: #e2e8f0; }
.tag--high            { background: #fff1f2; color: #be123c; border-color: #fecdd3; }
.tag--high-muted      { background: #fafafa; color: #94a3b8; border-color: #f1f5f9; }
.tag--medium          { background: #fffbeb; color: #b45309; border-color: #fde68a; }
.tag--medium-muted    { background: #fafafa; color: #94a3b8; border-color: #f1f5f9; }
.tag--low             { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
.tag--low-muted       { background: #fafafa; color: #94a3b8; border-color: #f1f5f9; }

.notif-time { font-size: 11px; color: #94a3b8; font-weight: 500; white-space: nowrap; flex-shrink: 0; }
.notif-subject {
  font-size: 13.5px; font-weight: 600; line-height: 1.4; margin: 0 0 4px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.notif-subject--unread { color: #0f172a; }
.notif-subject--read   { color: #475569; font-weight: 500; }

.notif-focal {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; color: #3b82f6; font-weight: 500; margin: 0;
}
.notif-focal--muted { color: #94a3b8; }

.notif-chevron {
  padding: 0 14px 0 8px; color: #cbd5e1; flex-shrink: 0;
  transition: color 0.12s, transform 0.15s;
}
.notif-chevron--muted { color: #e2e8f0; }
.notif-item:hover .notif-chevron        { color: #2563eb; transform: translateX(2px); }
.notif-item:hover .notif-chevron--muted { color: #94a3b8; }

/* ── Drawer ── */
.drawer {
  position: fixed; inset-y: 0; right: 0;
  width: 100%; max-width: 480px;
  background: #fff; border-left: 1px solid #e8ecf4;
  box-shadow: -8px 0 40px rgba(15,23,42,0.1);
  z-index: 60; display: flex; flex-direction: column;
  border-radius: 20px 20px 20px 20px;
}
.drawer-backdrop {
  position: fixed; inset: 0;
  background: rgba(15,23,42,0.3); backdrop-filter: blur(2px); z-index: 50;
}

.drawer-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 20px; border-bottom: 1px solid #f1f5f9;
  background: #fafbfe; position: sticky; top: 0; z-index: 1; flex-shrink: 0;
  border-radius: 20px 20px 20px 20px;
  
}
.drawer-header-left { display: flex; align-items: center; gap: 12px; }
.drawer-icon {
  width: 36px; height: 36px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border-radius: 10px; display: flex; align-items: center; justify-content: center;
  color: white; flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(37,99,235,0.3);
}
.drawer-title { font-size: 14.5px; font-weight: 800; color: #0f172a; margin: 0 0 2px; }
.drawer-routeslip-no {
  font-size: 11px; font-weight: 700; color: #2563eb;
  text-transform: uppercase; letter-spacing: 0.06em; margin: 0;
}
.drawer-close {
  width: 32px; height: 32px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #f8fafc;
  display: flex; align-items: center; justify-content: center;
  color: #64748b; cursor: pointer; transition: all 0.15s; flex-shrink: 0;
}
.drawer-close:hover { background: #fee2e2; color: #dc2626; border-color: #fecaca; }

.drawer-body {
  flex: 1; overflow-y: auto; padding: 20px;
  display: flex; flex-direction: column; gap: 18px;
}

.drawer-section { display: flex; flex-direction: column; gap: 6px; }
.drawer-label {
  font-size: 10.5px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8;
}
.drawer-subject { font-size: 16px; font-weight: 700; color: #0f172a; line-height: 1.5; margin: 0; }

.drawer-chips { display: flex; gap: 12px; flex-wrap: wrap; }
.chip-group   { display: flex; flex-direction: column; gap: 5px; }
.chip-label {
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8;
}
.chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700;
  border: 1px solid transparent;
}
.chip-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.chip--high   { background: #fff1f2; color: #be123c; border-color: #fecdd3; }
.chip--medium { background: #fffbeb; color: #b45309; border-color: #fde68a; }
.chip--low    { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
.chip--status { background: #f0f9ff; color: #0369a1; border-color: #bae6fd; }

.drawer-instructions {
  display: flex; gap: 10px; padding: 12px 14px;
  background: #f0f7ff; border: 1px solid #dbeafe; border-radius: 10px;
}
.instructions-icon { color: #3b82f6; flex-shrink: 0; margin-top: 1px; }
.drawer-instructions-text { font-size: 13px; color: #334155; line-height: 1.6; margin: 0; font-style: italic; }

.drawer-details-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
  padding: 16px; background: #f8fafc; border-radius: 12px; border: 1px solid #f1f5f9;
}
.drawer-detail { display: flex; flex-direction: column; gap: 6px; }
.drawer-detail-val { font-size: 13px; font-weight: 600; color: #334155; margin: 0; }
.focal-row { display: flex; align-items: center; gap: 8px; }
.focal-avatar {
  width: 26px; height: 26px; border-radius: 7px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white; font-size: 10px; font-weight: 800;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.ref-btn {
  display: inline-flex; align-items: center; gap: 8px;
  width: 100%; justify-content: center; padding: 11px 18px;
  border-radius: 11px; background: #0f172a; color: white;
  border: none; font-size: 13px; font-weight: 700;
  cursor: pointer; font-family: inherit; transition: all 0.18s ease;
}
.ref-btn:hover {
  background: #1e293b; transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(15,23,42,0.2);
}
.ref-empty {
  padding: 14px; border: 2px dashed #e2e8f0; border-radius: 10px;
  text-align: center; font-size: 12px; color: #94a3b8; font-style: italic;
}

.drawer-footer {
  padding: 14px 20px 18px; border-top: 1px solid #f1f5f9;
  background: #fafbfe; display: flex; gap: 10px; flex-shrink: 0;
  border-radius: 20px 20px 20px 20px;
}
.btn-secondary {
  flex: 1; padding: 10px 16px;
  font-size: 13px; font-weight: 600; border-radius: 10px;
  border: 1px solid #e2e8f0; background: #f8fafc; color: #475569;
  cursor: pointer; font-family: inherit; transition: all 0.15s;
}
.btn-secondary:hover { background: #f1f5f9; color: #1e293b; }
.btn-primary {
  flex: 2; display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  padding: 10px 20px; font-size: 13px; font-weight: 700; border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white;
  border: none; cursor: pointer; font-family: inherit;
  box-shadow: 0 4px 12px rgba(37,99,235,0.3); transition: all 0.2s ease;
}
.btn-primary:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  box-shadow: 0 6px 18px rgba(37,99,235,0.4); transform: translateY(-1px);
}

/* ── Transitions ── */
.slide-enter-active, .slide-leave-active { transition: transform 0.38s cubic-bezier(0.16,1,0.3,1); }
.slide-enter-from, .slide-leave-to       { transform: translateX(100%); }
.fade-enter-active, .fade-leave-active   { transition: opacity 0.25s ease; }
.fade-enter-from,  .fade-leave-to        { opacity: 0; }
</style>