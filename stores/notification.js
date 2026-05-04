import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    unreadCount: 0,
    notifications: [],
    loading: false,
    isModalOpen: false, 
  }),

  actions: {
    async fetchNotifications() {
      this.loading = true;
      const { $api } = useNuxtApp();
      try {
        const response = await $api.get('/notifications');
        this.unreadCount = response.data.count || 0;
        this.notifications = response.data.data || [];
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        this.loading = false;
      }
    },

    increment(payload) {
      this.unreadCount++;
      // Nilalagay ang bago sa pinakataas ng listahan
        this.notifications.unshift({
            id: payload.id, 
            read_at: null,
            data: {
            routeslip_no: payload.routeslip_no,
            r_subject: payload.r_subject,
            urgency: payload.urgency || 'Normal',
            },
            created_at: new Date().toISOString()
        });
    },

    listenForNotifications(userId) {
      const { $echo } = useNuxtApp();
      if (!$echo) return;

      $echo.private(`user.${userId}`)
        .listen('.routeslip.updated', (payload) => {
          this.increment(payload); 
        });
    },

    toggleModal() {
      this.isModalOpen = !this.isModalOpen;
    },

    clearCount() {
      this.unreadCount = 0;
    },
async markAsRead(id) {
  try {
    const { $api } = useNuxtApp();
    const notif = this.notifications.find(n => n.id === id);
    
    if (notif) {
      // Tatawag sa API gamit ang RouteSlip ID (3)
      await $api.post(`/notifications/${id}/read`);

      // Update local state para mag-trigger ang computed properties sa index.vue
      notif.read_at = new Date().toISOString(); 
      notif.is_read = 1;     // Sync RouteSlip table logic

      if (this.unreadCount > 0) {
        this.unreadCount--;
      }
    }
  } catch (error) {
    console.error("Failed to mark as read:", error);
  }
}
  }
})