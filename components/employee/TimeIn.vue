<template>
    <div>
      <!-- Modal for Time In -->
      <div v-if="showTimeInModal" class="time-in-modal">
        <div class="modal-content">
          <h2>Time In</h2>
          <p>You have logged in today at: {{ timeIn }}</p>
          <button @click="closeModal" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">Close</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showTimeInModal: false,
        timeIn: null, // Store the timeIn value here
      };
    },
    mounted() {
      this.checkTimeIn();
    },
    methods: {
      checkTimeIn() {
        // Get user info and the stored time-in from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        const lastLoginDate = localStorage.getItem('lastLoginDate');
        const lastTimeIn = localStorage.getItem('timeIn');
  
        // Get current date and time
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.getHours() + ":" + now.getMinutes();
  
        // Define the cutoff times (4:00 AM and 12:00 AM)
        const fourAM = new Date();
        fourAM.setHours(4, 0, 0, 0); // 4:00 AM
        const midnight = new Date();
        midnight.setHours(0, 0, 0, 0); // Midnight (start of the day)
  
        // Check if current time is valid and if this is the first login of the day
        if (now > fourAM && (!lastLoginDate || lastLoginDate !== currentDate)) {
          this.showTimeInModal = true;
          this.timeIn = lastTimeIn;
  
          // Update localStorage with the current login date
          localStorage.setItem('lastLoginDate', currentDate);
          localStorage.setItem('timeIn', lastTimeIn); // Update with time in from the backend
        }
      },
      closeModal() {
        this.showTimeInModal = false;
      }
    }
  };
  </script>
  
  <style scoped>
  .time-in-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  }
  </style>
  