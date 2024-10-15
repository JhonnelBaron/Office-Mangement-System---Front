<template>
  <div>
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold mb-4">Attendance Monitoring</h2>
      <div class="mb-4 text-right text-sm font-medium text-gray-600">
        <strong>Date Today: </strong>{{ formatDate(new Date()) }}
      </div>
    </div>

    <!-- Overview Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="p-6 rounded bg-blue-500 text-white shadow-lg">
        <h3 class="text-lg font-bold">Total Present</h3>
        <p class="mt-2 text-4xl font-semibold">{{ presentCount }}</p>
        <p class="mt-1 text-sm">  {{ filterDate === currentDate ? "Today" : formatDate(filterDate) }}</p>
      </div>
      <div class="p-6 rounded bg-green-500 text-white shadow-lg">
        <h3 class="text-lg font-bold">Total Absent</h3>
        <p class="mt-2 text-4xl font-semibold">{{ absentCount }}</p>
        <p class="mt-1 text-sm">  {{ filterDate === currentDate ? "Today" : formatDate(filterDate) }}</p>
      </div>
      <div class="p-6 rounded bg-yellow-500 text-white shadow-lg">
        <h3 class="text-lg font-bold">Late Arrivals</h3>
        <p class="mt-2 text-4xl font-semibold">{{ lateCount }}</p>
        <p class="mt-1 text-sm">  {{ filterDate === currentDate ? "Today" : formatDate(filterDate) }}</p>
      </div>
    </div>

    <!-- Recent Attendance Log -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-8">
      <div class="flex justify-between items-center">
        <h3 class="text-xl font-semibold mb-4">Recent Attendance</h3>
        <div class="flex items-center">
            <label for="attendanceFilter" class="mr-2 font-medium">Filter by Status:</label>
            <select 
                id="attendanceFilter" 
                v-model="selectedFilter" 
                @change="updateFilteredAttendance" 
                class="border border-gray-300 p-2 rounded-full">
                <option value="all">All</option>
                <option value="onTime">On Time</option>
                <option value="late">Late</option>
                <option value="absent">Absent</option>
            </select>
          <label for="taskDate" class="mr-2 font-medium">Date:</label>
          <input
            type="date"
            v-model="filterDate"
            class="border border-gray-300 p-2 rounded-full focus:outline-none focus:ring focus:ring-blue-500"
            @change="updateFilteredAttendance"
          />
        </div>
      </div>
      <table class="w-full table-auto mt-2">
        <thead>
          <tr class="text-left text-gray-700 dark:text-gray-300">
            <th class="pb-2">Employee</th>
            <th class="pb-2">Status</th>
            <th class="pb-2">Time In</th>
            <th class="pb-2">Time Out</th>
            <th class="pb-2">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="attendance in filteredAttendance"
            :key="attendance.id"
            class="border-t text-gray-600 dark:text-gray-400"
          >
            <td class="py-2">{{ attendance.user.first_name }} {{ attendance.user.last_name }}</td>
            <td class="py-2" :class="getStatusClass(attendance.status)">
              {{ attendance.status }}
            </td>
            <td class="py-2">{{ attendance.time_in }}</td>
            <td class="py-2">{{ attendance.time_out ? attendance.time_out : '--' }}</td>
            <td class="py-2">{{ attendance.score }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Attendance Summary Chart (Placeholder) -->
    <div class="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md">
      <h3 class="text-lg font-bold mb-4 text-gray-700 dark:text-gray-300">Attendance Summary (Monthly)</h3>
      <div class="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
        <!-- Placeholder for chart (You can replace this with a chart component like Chart.js) -->
        [Attendance Chart Placeholder]
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAttendance } from '@/services/chief/attendanceService';

definePageMeta({
  layout: 'chief', // Using the sidebar
});

const currentDate = new Date().toLocaleDateString('en-CA');
const attendance = ref([]);
const filterDate = ref(currentDate);
const filteredAttendance = ref([]);
const selectedFilter = ref('all');

// Function to fetch attendance data
const fetchAttendance = async () => {
  try {
    attendance.value = await getAttendance();
    filteredAttendance.value = attendance.value;
  } catch (error) {
    console.error('Error fetching attendance:', error);
  }
};

// Watcher to update filtered tasks based on the selected date
// const updateFilteredTasks = () => {
//   if (filterDate.value) {
//     filteredAttendance.value = attendance.value.filter((item) =>
//       item.date.includes(filterDate.value)
//     );
//   } else {
//     filteredAttendance.value = attendance.value;
//   }
// };

// // Function to filter attendance based on selected status
// const filterAttendance = () => {
//   if (selectedFilter.value === 'onTime') {
//     filteredAttendance.value = attendance.value.filter(
//       (a) => a.status === 'early' || a.status === 'exactly'
//     );
//   } else if (selectedFilter.value === 'late') {
//     filteredAttendance.value = attendance.value.filter((a) => a.status === 'late');
//   } else if (selectedFilter.value === 'absent') {
//     filteredAttendance.value = attendance.value.filter((a) => a.status === 'absent');
//   } else {
//     filteredAttendance.value = attendance.value; // Show all
//   }
// };

// Function to update filtered attendance based on selected date and status
const updateFilteredAttendance = () => {
  filteredAttendance.value = attendance.value.filter((item) => {
    const matchesDate = filterDate.value ? item.date.includes(filterDate.value) : true;
    const matchesStatus = selectedFilter.value === 'all' || 
      (selectedFilter.value === 'onTime' && (item.status === 'early' || item.status === 'exactly')) ||
      (selectedFilter.value === 'late' && item.status === 'late') ||
      (selectedFilter.value === 'absent' && item.status === 'absent');

    return matchesDate && matchesStatus;
  });
};

// Function to count present, absent, and late attendees
const presentCount = computed(() => 
  attendance.value.filter(a => a.date.includes(filterDate.value) && a.status !== 'absent').length
);

const absentCount = computed(() => 
  attendance.value.filter(a => a.date.includes(filterDate.value) && a.status === 'absent').length
);

const lateCount = computed(() => 
  attendance.value.filter(a => a.date.includes(filterDate.value) && (a.status === 'late' || a.status === 'early' || a.status === 'exactly')).length
);
// const presentCount = computed(() =>
//   filteredAttendance.value.filter((a) => a.status !== 'absent').length
// );

// const absentCount = computed(() =>
//   filteredAttendance.value.filter((a) => a.status === 'absent').length
// );

// const lateCount = computed(() => {
//   return filteredAttendance.value.filter((a) => a.status === 'late').length +
//          filteredAttendance.value.filter((a) => a.status === 'early' || a.status === 'exactly').length; // Assuming early and exactly are considered on time
// });

// Helper function to assign status classes for colors
const getStatusClass = (status) => {
  switch (status) {
    case 'present':
      return 'text-green-500';
    case 'absent':
      return 'text-red-500';
    case 'late':
      return 'text-yellow-500';
    default:
      return '';
  }
};

// Utility to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Fetch attendance data when component is mounted
onMounted(fetchAttendance);
</script>

<style scoped>
/* Add any necessary custom styles */
</style>
