<template>
    <div>
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold mb-4">Attendance Monitoring</h2>
        <div class="mb-4 text-right text-sm font-medium text-gray-600">
          <strong>Date Today: </strong>{{ formatDate(new Date()) }}
        </div>
      </div>
  
      <!-- Recent Attendance Log -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-8">
        <h3 class="text-xl font-semibold mb-4">Weekly Attendance Summary</h3>
        <table class="w-full table-auto mt-2">
          <thead>
            <tr class="text-left text-gray-700 dark:text-gray-300">
              <th class="pb-2">Employee Name</th>
              <th class="pb-2">Mon</th>
              <th class="pb-2">Tue</th>
              <th class="pb-2">Wed</th>
              <th class="pb-2">Thu</th>
              <th class="pb-2">Fri</th>
              <th class="pb-2">Average</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.id" class="border-t text-gray-600 dark:text-gray-400">
              <td class="py-2">{{ employee.first_name }} {{ employee.last_name }}</td>
              <td class="py-2">{{ calculateWeeklyAverage(employee.id, 'Mon') }}</td>
              <td class="py-2">{{ calculateWeeklyAverage(employee.id, 'Tue') }}</td>
              <td class="py-2">{{ calculateWeeklyAverage(employee.id, 'Wed') }}</td>
              <td class="py-2">{{ calculateWeeklyAverage(employee.id, 'Thu') }}</td>
              <td class="py-2">{{ calculateWeeklyAverage(employee.id, 'Fri') }}</td>
              <td class="py-2">{{ calculateAverageScore(employee.id) }}</td>
            </tr>
          </tbody>
        </table>
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
  const employees = ref([]); // Assuming you have a list of employees
  const filterDate = ref(currentDate);
  
  // Function to fetch attendance data
  const fetchAttendance = async () => {
    try {
      attendance.value = await getAttendance();
      // Assuming you have a function to fetch employees
      employees.value = await getEmployees(); // Replace with your function to get employees
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };
  
  // Calculate average score for an employee
  const calculateAverageScore = (userId) => {
    const scores = attendance.value
      .filter(a => a.user.id === userId)
      .map(a => a.score);
    const total = scores.reduce((sum, score) => sum + score, 0);
    return scores.length > 0 ? (total / scores.length).toFixed(2) : 'N/A';
  };
  
  // Calculate weekly averages for each day
  const calculateWeeklyAverage = (userId, day) => {
    const dayMap = {
      'Mon': 0,
      'Tue': 1,
      'Wed': 2,
      'Thu': 3,
      'Fri': 4
    };
  
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + dayMap[day]);
    
    const weekScores = attendance.value.filter(a => {
      const attendanceDate = new Date(a.date);
      return a.user.id === userId && attendanceDate.toDateString() === weekStart.toDateString();
    });
  
    const total = weekScores.reduce((sum, a) => sum + a.score, 0);
    return weekScores.length > 0 ? (total / weekScores.length).toFixed(2) : 'N/A';
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
  