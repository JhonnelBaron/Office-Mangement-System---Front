<template>
    <div>
      <!-- <h2 class="text-3xl font-bold">Hi, {{userName}}!!</h2> -->
        <!-- <p class="text-xl">Mag aambag ka ba ngayon sa gobyerno?</p> -->
        <!-- <calendar /> -->
        <TimeIn />
    </div>
    <div class="p-6 rounded bg-white text-gray-800 shadow-lg">
        <h3 class="text-3xl font-bold">Hi, {{userName}}!!</h3>
        <p class="mt-2 text-xl font-semibold">Mag aambag ka ba ngayon sa gobyerno?</p>
        <p class="mt-1 text-sm"> </p>
      </div>
      
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 mt-10">
      <div class="p-6 rounded bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg">
        <h3 class="text-lg font-bold">Task created today</h3>
        <p class="mt-2 text-4xl font-semibold">{{ tasksToday }}</p>
        <p class="mt-1 text-sm">In Progress</p>
      </div>
      <div class="p-6 rounded bg-gradient-to-r from-lime-500 to-yellow-500 text-white shadow-lg">
        <h3 class="text-lg font-bold">Total task this cutoff</h3>
        <p class="mt-2 text-4xl font-semibold">{{ tasksThisCutoff }}</p>
        <p class="mt-1 text-sm">Done</p>
      </div>
      <div class="p-6 rounded bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
        <h3 class="text-lg font-bold">Total Done Task</h3>
        <p class="mt-2 text-4xl font-semibold">{{ tasksDone }}</p>
        <p class="mt-1 text-sm"> </p>
      </div>
      <div class="p-6 rounded bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
        <h3 class="text-lg font-bold">Suspended Task</h3>
        <p class="mt-2 text-4xl font-semibold">{{ tasksSuspended }}</p>
        <p class="mt-1 text-sm"> </p>
      </div>
      <div class="p-6 rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg">
        <h3 class="text-lg font-bold">In Progress Task</h3>
        <p class="mt-2 text-4xl font-semibold">{{ tasksInProgress }}</p>
        <p class="mt-1 text-sm"> </p>
      </div>
    </div>

    <div class="grid grid-cols-5 gap-4 mb-4">
  <!-- First Container -->
  <div class="flex flex-col rounded bg-white dark:bg-gray-800 h-full overflow-hidden col-span-2">
    <div class="p-4 bg-blue-500 text-white rounded-t">
      <h3 class="text-lg font-bold">Time Log</h3>
    </div>
    <div class="overflow-y-auto max-h-60 p-4">
      <table class="table-auto w-full text-sm text-gray-700 dark:text-gray-300">
        <thead class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
          <tr>
            <th class="py-2 px-4 text-left">Date</th>
            <th class="py-2 px-4 text-left">Day</th>
            <th class="py-2 px-4 text-left">Time In</th>
            <!-- <th class="py-2 px-4 text-left">Time Out</th> -->
          </tr>
        </thead>
        <tbody>
        <!-- Dynamically generate rows -->
        <tr
          v-for="(log, index) in userAttendance"
          :key="index"
          class="border-b dark:border-gray-600"
        >
          <td class="py-2 px-4">{{ log.date }}</td>
          <td class="py-2 px-4">{{ log.day }}</td>
          <td class="py-2 px-4">{{ log.time_in }}</td>
          <!-- <td class="py-2 px-4">{{ log.time_out }}</td> -->
        </tr>
        <!-- Display a message if no logs are available -->
        <tr v-if="!userAttendance || userAttendance.length === 0">
          <td colspan="4" class="py-2 px-4 text-center text-gray-500 dark:text-gray-400">
            No attendance records found.
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Second Container -->
  <!-- <div class="flex items-center justify-center rounded bg-white dark:bg-gray-800 h-64 col-span-3">
    <div>
    <Line :chart-data="chartData" :chart-options="chartOptions" />
</div>
  </div> -->

  <div class="flex flex-col rounded-lg bg-white shadow dark:bg-gray-800 h-full overflow-hidden col-span-3">
  <!-- Header Section -->
  <div class="flex justify-between p-4 md:p-6 pb-0 md:pb-0">
    <div>
      <h5 class="text-xl font-bold text-gray-900 dark:text-white pb-2">Attendance</h5>
      <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Hours logged this week</p>
    </div>
    <!-- <div class="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500">
      +10%
      <svg class="w-3 h-3 ms-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
      </svg>
    </div> -->
  </div>

  <!-- Chart Section -->
  <div class="flex-grow px-4">
    <div class="relative h-96 w-full">
      <!-- Chart Component -->
      <Line :chart-data="chartData" :chart-options="chartOptions" />
    </div>
  </div>

  <!-- Footer Section -->
  <div class="border-t border-gray-200 dark:border-gray-700 mt-5 p-4 md:p-6">

  </div>
</div>



</div>


            <!-- <calendar /> -->

</template>

<script setup>
import { ref, onMounted } from 'vue';
import TimeIn from '@/components/employee/TimeIn.vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, PointElement, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { getTasks, getUserAttendance } from '@/services/empDashboardService';

const user = ref('');
const tasksToday = ref(0);
const tasksThisCutoff = ref(0);
const tasksDone = ref(0);
const tasksSuspended = ref(0);
const tasksInProgress = ref(0);
const userAttendance = ref(null); // Add a new reactive variable for attendance data

// Register Chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Attendance (Hours)',
      data: [],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 2,
  scales: {
    x: {
      type: 'category',
      title: {
        display: true,
        text: 'Date',
      },
    },
    y: {
      type: 'linear',
      title: {
        display: true,
        text: 'Time In',
      },
      ticks: {
        callback: function(value) {
          const hours = Math.floor(value / 60);
          const minutes = value % 60;
          return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`; 
        },
      },
    },
  },
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      enabled: true,
    },
  },
});


const updateChartData = (attendance) => {
  if (attendance && attendance.length > 0) {
    const labels = attendance.map((log) => log.date); // X-axis will be the dates
    const data = attendance.map((log) => {
      const timeParts = log.time_in.split(' '); // Split AM/PM from time (e.g., "08:50 AM")
      const [hours, minutes] = timeParts[0].split(':').map(num => parseInt(num));
      const isPM = timeParts[1] === 'PM';
      const totalMinutes = (isPM ? hours + 12 : hours) * 60 + minutes; // Convert to 24-hour time
      return totalMinutes; // Return the time in minutes for the Y-axis
    });

    // Debugging logs to check data
    console.log("Chart Labels (Dates):", labels);
    console.log("Chart Data (Minutes):", data);

    chartData.value.labels = labels;
    chartData.value.datasets[0].data = data;
  }
};



    definePageMeta({
        layout: 'employee'

    })

    const userName = ref('');

    onMounted(async () => {
  if (process.client) {
    // Retrieve user name from localStorage
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    userName.value = user?.first_name || 'Guest';

    // Fetch tasks data
    try {
      const tasks = await getTasks();
      tasksToday.value = tasks.tasks_today;
      tasksThisCutoff.value = tasks.tasks_this_cutoff;
      tasksDone.value = tasks.tasks_done;
      tasksSuspended.value = tasks.tasks_suspended;
      tasksInProgress.value = tasks.tasks_in_progress;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }

    try {
      const attendance = await getUserAttendance(user?.id); // Pass user ID if needed
      userAttendance.value = attendance || null;
      updateChartData(attendance); // Update chart data
    } catch (error) {
      console.error('Failed to fetch user attendance:', error);
    }
  }
});

</script>

<style scoped>

</style>