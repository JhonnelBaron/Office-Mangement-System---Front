<template>
    <div>
        <div class="flex justify-between items-center pb-2">
        <div class="flex items-center">
        <NuxtLink to="/chief/attendance">
        <h2 class="text-2xl font-bold mb-4">Attendance Monitoring</h2></NuxtLink>
        <NuxtLink to="/chief/attendance-summary" class="text-sm font-bold mb-4 mt-1.5 ml-10 border-bottom:black">
        <span>Weekly Summary</span>
        </NuxtLink>
        </div>
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
              <th class="pb-2  w-1/4">Employee Name</th>
              <th class="pb-2 w-1/12">
                <div>Mon</div>
                <div class="text-sm ">{{ getDayOfMonth(0) }}</div>
                </th>
                <th class="pb-2 w-1/12">
                <div>Tue</div>
                <div class="text-sm">{{ getDayOfMonth(1) }}</div>
                </th>
                <th class="pb-2 w-1/12">
                <div>Wed</div>
                <div class="text-sm">{{ getDayOfMonth(2) }}</div>
                </th>
                <th class="pb-2 w-1/12">
                <div>Thu</div>
                <div class="text-sm">{{ getDayOfMonth(3) }}</div>
                </th>
                <th class="pb-2 w-1/12">
                <div>Fri</div>
                <div class="text-sm ">{{ getDayOfMonth(4) }}</div>
                </th>
              <th class="pb-2 w-1/12">Average</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in employeeAttendance" :key="data.employee.id"class="border-t text-gray-600 dark:text-gray-400">
              <td class="py-2">{{  data.employee.first_name }} {{  data.employee.last_name }}</td>
              <td class="py-2 ">{{ data.attendance.Mon.time_in || '-' }}</td>
              <td class="py-2 ">{{ data.attendance.Tue.time_in || '-' }}</td>
              <td class="py-2 ">{{ data.attendance.Wed.time_in || '-' }}</td>
              <td class="py-2 ">{{ data.attendance.Thu.time_in || '-' }}</td>
              <td class="py-2 ">{{ data.attendance.Fri.time_in || '-' }}</td>
              <td class="py-2">{{ calculateAverage(data.attendance) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { getAttendance, getEmployees } from '@/services/chief/attendanceService';
  
  const currentDate = new Date().toLocaleDateString('en-CA');
  const attendance = ref([]);
  const employees = ref([]); // Assuming you have a list of employees
  const filterDate = ref(currentDate);

  const getDateOfWeek = (dayOffset) => {
  const date = new Date();
  // Set to the start of the week (Monday)
  const weekStart = new Date(date.setDate(date.getDate() - date.getDay() + 1)); // Monday is the start of the week
  weekStart.setDate(weekStart.getDate() + dayOffset); // Add the offset for the specific day
  return weekStart.toLocaleDateString('en-CA'); // Return just the day of the month
};

const getDayOfMonth = (dayOffset) => {
  const date = new Date();
  const weekStart = new Date(date.setDate(date.getDate() - date.getDay() + 1)); // Monday is the start of the week
  weekStart.setDate(weekStart.getDate() + dayOffset);
  return weekStart.getDate(); // Return just the day of the month
};
  
  // Function to fetch attendance data
  const fetchEmployees = async () => {
  try {
    const response = await getEmployees();
    console.log('Fetched Employees:', response);
    employees.value = response; 
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
};

// Function to fetch attendance data
const fetchAttendance = async () => {
  try {
    const response = await getAttendance();
    console.log('Fetched Attendance:', response);
    attendance.value = response;

        // Build employee attendance summary
        const weeklyAttendance = employees.value.map(employee => {
      const records = attendance.value.filter(record => record.user_id === employee.id);
      return {
        employee,
        attendance: {
          Mon: records.find(r => r.date === getDateOfWeek(0)) || {},
          Tue: records.find(r => r.date === getDateOfWeek(1)) || {},
          Wed: records.find(r => r.date === getDateOfWeek(2)) || {},
          Thu: records.find(r => r.date === getDateOfWeek(3)) || {},
          Fri: records.find(r => r.date === getDateOfWeek(4)) || {}
        }
      };
    });

    employeeAttendance.value = weeklyAttendance;
  } catch (error) {
    console.error('Error fetching attendance:', error);
  }
};

  // Fetch employees and attendance on component mount
  onMounted(() => {
    fetchEmployees().then(fetchAttendance); // Ensure attendance is fetched after employees
  });


  const employeeAttendance = computed(() => {
  return employees.value.map(employee => {
    // Find attendance records for this employee
    const records = attendance.value.filter(record => record.user_id === employee.id);
    
    // Create an object to hold attendance data for each day of the week
    const attendanceData = {
      employee,
      attendance: {
        Mon: records.find(r => r.date === getDateOfWeek(0)) || {},
        Tue: records.find(r => r.date === getDateOfWeek(1)) || {},
        Wed: records.find(r => r.date === getDateOfWeek(2)) || {},
        Thu: records.find(r => r.date === getDateOfWeek(3)) || {},
        Fri: records.find(r => r.date === getDateOfWeek(4)) || {},
      }
    };
    return attendanceData;
  });
});

const calculateAverage = (attendance) => {
  const totalTimeIn = Object.values(attendance).reduce((sum, record) => {
    return sum + (record.time_in ? 1 : 0); // Count presence based on time_in
  }, 0);
  return totalTimeIn / 5; // Calculate average based on days
};


  // Utility to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  
  </script>
  
  <style scoped>
  /* Add any necessary custom styles */
  
  </style>
  