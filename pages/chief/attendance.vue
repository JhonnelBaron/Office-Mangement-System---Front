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
        <p class="mt-2 text-4xl font-semibold">45</p>
        <p class="mt-1 text-sm">Today</p>
      </div>
      <div class="p-6 rounded bg-green-500 text-white shadow-lg">
        <h3 class="text-lg font-bold">Total Absent</h3>
        <p class="mt-2 text-4xl font-semibold">5</p>
        <p class="mt-1 text-sm">Today</p>
      </div>
      <div class="p-6 rounded bg-yellow-500 text-white shadow-lg">
        <h3 class="text-lg font-bold">Late Arrivals</h3>
        <p class="mt-2 text-4xl font-semibold">3</p>
        <p class="mt-1 text-sm">Today</p>
      </div>
      <!-- <div class="p-6 rounded bg-red-500 text-white shadow-lg">
        <h3 class="text-lg font-bold">On Leave</h3>
        <p class="mt-2 text-4xl font-semibold">2</p>
        <p class="mt-1 text-sm">Today</p>
      </div> -->
    </div>

    <!-- Recent Attendance Log -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-8">
        <div class="flex justify-between items-center">
      <h3 class="text-xl font-semibold mb-4">Recent Attendance</h3>
      <div class="flex items-center">
      <label for="taskDate" class="mr-2 font-medium">Date:</label>
      <input
        type="date"
        v-model="filterDate"
        class="border border-gray-300 p-2 rounded-full focus:outline-none focus:ring focus:ring-blue-500"
        @change="updateFilteredTasks"
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
          <tr class="border-t text-gray-600 dark:text-gray-400">
            <td class="py-2">John Doe</td>
            <td class="py-2 text-green-500">Present</td>
            <td class="py-2">8:30 AM</td>
            <td class="py-2">5:00 PM</td>
          </tr>
          <tr class="border-t text-gray-600 dark:text-gray-400">
            <td class="py-2">Jane Smith</td>
            <td class="py-2 text-yellow-500">Late</td>
            <td class="py-2">9:15 AM</td>
            <td class="py-2">5:00 PM</td>
          </tr>
          <tr class="border-t text-gray-600 dark:text-gray-400">
            <td class="py-2">Michael Brown</td>
            <td class="py-2 text-red-500">Absent</td>
            <td class="py-2">--</td>
            <td class="py-2">--</td>
          </tr>
          <!-- <tr class="border-t text-gray-600 dark:text-gray-400">
            <td class="py-2">Sarah Wilson</td>
            <td class="py-2 text-blue-500">On Leave</td>
            <td class="py-2">--</td>
            <td class="py-2">--</td>
          </tr> -->
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
definePageMeta({
  layout: 'chief', // Using the sidebar
});

const currentDate = new Date().toLocaleDateString('en-CA'); // Ensure correct format (YYYY-MM-DD)
  const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>

<style scoped>
</style>
