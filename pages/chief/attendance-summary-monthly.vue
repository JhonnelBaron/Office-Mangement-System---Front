<template>
    <div>
      <div class="flex justify-between items-center pb-2">
        <div class="flex items-center">
          <NuxtLink to="/chief/attendance">
            <h2 class="text-2xl font-bold mb-4">Attendance Monitoring</h2>
          </NuxtLink>
          <NuxtLink to="/chief/attendance-summary" class="text-sm font-bold mb-4 mt-1.5 ml-10">
            <span>Weekly Summary</span>
          </NuxtLink>
          <NuxtLink to="/chief/attendance-summary-monthly" class="text-sm font-bold mb-4 mt-1.5 ml-10">
            <span>Monthly Summary</span>
          </NuxtLink>
        </div>
        <div class="mb-4 text-right text-sm font-medium text-gray-600">
          <strong>Date Today: </strong>{{ formatDate(new Date()) }}
        </div>
      </div>
  
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-8">
        <div class="flex justify-between">
          <h3 class="text-xl font-semibold mb-4">Monthly Attendance Summary</h3>
        </div>
  
        <table class="w-full table-auto mt-2">
          <thead>
            <tr class="text-left text-gray-700 dark:text-gray-300">
              <th class="pb-2 w-1/4">Employee Name</th>
              <th v-for="(month, index) in months" :key="index" class="pb-2 w-1/8">{{ month }}</th>
              <th class="pb-2 w-1/8">Yearly Average</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.id" class="border-t text-gray-600 dark:text-gray-400">
              <td class="py-2">{{ employee.first_name }} {{ employee.last_name }}</td>
              <td v-for="(month, index) in months" :key="index" class="py-2">{{ getMonthlyAttendance(employee.id, index + 1) }}</td>
              <td class="py-2">{{ calculateYearlyAverage(employee.id) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getAttendance, getEmployees } from '@/services/chief/attendanceService';
  
  // Meta for the layout
  definePageMeta({
    layout: 'chief', // Using the sidebar
  });
  
  const employees = ref([]);
  const attendance = ref([]);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Utility to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      employees.value = response;
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };
  
  // Fetch attendance
  const fetchAttendance = async () => {
    try {
      const response = await getAttendance(); // Modify this to fetch monthly data
      attendance.value = response;
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };
  
  // Get attendance for a specific month
  const getMonthlyAttendance = (employeeId, month) => {
    const record = attendance.value.find(a => a.employee_id === employeeId && a.month === month);
    return record ? record.attendance : '-';
  };
  
  // Calculate yearly average for each employee
  const calculateYearlyAverage = (employeeId) => {
    const records = attendance.value.filter(a => a.employee_id === employeeId);
    if (records.length === 0) return '-';
  
    const total = records.reduce((sum, record) => sum + record.attendance, 0);
    return (total / records.length).toFixed(2);
  };
  
  onMounted(() => {
    fetchEmployees();
    fetchAttendance();
  });
  </script>
  
  <style scoped>
  /* Style adjustments for better alignment */
  </style>
  