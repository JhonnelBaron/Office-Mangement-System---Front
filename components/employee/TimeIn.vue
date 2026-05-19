<template>
  <div>
    <div v-if="showTimeInModal" class="time-in-modal">
      <div class="modal-content shadow-2xl border border-gray-100">
        <h2 class="text-xl font-bold text-gray-800 mb-2">Time In</h2>
        <p class="text-gray-600 mb-4">
          You have logged in today at: <span class="font-bold text-blue-600">{{ timeInDisplay }}</span>
        </p>
        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 font-medium" @click="closeModal">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showTimeInModal = ref(false);
const timeInDisplay = ref('');

// Bind core session user identity cookie
const userCookie = useCookie('user');

const checkTimeIn = () => {
  // 1. Safely capture and parse the user profile cookie to find the Unique User ID
  const rawUser = userCookie.value;
  let parsedUser = null;
  
  if (rawUser) {
    try {
      const decoded = typeof rawUser === 'string' ? decodeURIComponent(rawUser) : rawUser;
      parsedUser = typeof decoded === 'string' ? JSON.parse(decoded) : decoded;
    } catch (e) {
      console.error("Failed to parse core user attributes:", e);
    }
  }

  // Guard Clause: Kung walang naka-login na user, huwag patakbuhin ang modal engine
  if (!parsedUser || !parsedUser.id) {
    console.warn("No valid user profile context found. Skipping isolation tracking pass.");
    return;
  }

  const userId = parsedUser.id;

  // 2. Dynamically instantiate per-user isolated cookies using the User ID as a suffix
  const userLoginDateCookie = useCookie(`lastLoginDate_${userId}`, { path: '/' });
  const userTimeInCookie = useCookie(`timeIn_${userId}`, { path: '/' });

  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];

  // 3. Generate an immediate fallback format of the current system execution moment
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
  const currentSystemTime = `${displayHours}:${displayMinutes} ${ampm}`;

  // 4. Resolve the correct isolated time parameter value
  const evaluatedTime = userTimeInCookie.value || parsedUser?.last_time_in || currentSystemTime;
  timeInDisplay.value = evaluatedTime;

  // 5. Operational control window evaluation logic (Triggers after 4:00 AM framework marker resets)
  const fourAM = new Date();
  fourAM.setHours(4, 0, 0, 0);

  const lastLoginDate = userLoginDateCookie.value;

  // Verification pass execution block per isolated account id
  if (now > fourAM && (!lastLoginDate || lastLoginDate !== currentDate)) {
    showTimeInModal.value = true;

    // Hard-commit configuration tracking changes into the dynamic isolated cookie keys
    userLoginDateCookie.value = currentDate;
    userTimeInCookie.value = evaluatedTime;
  }
};

const closeModal = () => {
  showTimeInModal.value = false;
};

onMounted(() => {
  checkTimeIn();
});
</script>

<style scoped>
.time-in-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  min-width: 320px;
}
</style>