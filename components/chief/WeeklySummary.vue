<template>
    <div>
        <div class="flex justify-between items-center pb-2">
        <div class="flex items-center">
        <NuxtLink to="/chief/attendance">
        <h2 class="text-2xl font-bold mb-4">Attendance Monitoring</h2></NuxtLink>
        <NuxtLink to="/chief/attendance-summary" class="text-sm font-bold mb-4 mt-1.5 ml-10 border-bottom:black">
        <span>Weekly Summary</span>
        </NuxtLink>
        <NuxtLink to="/chief/attendance-summary-monthly" class="text-sm font-bold mb-4 mt-1.5 ml-10 border-bottom:black">
        <span>Monthly Summary</span>
        </NuxtLink>
        </div>
        <div class="mb-4 text-right text-sm font-medium text-gray-600">
            <strong>Date Today: </strong>{{ formatDate(new Date()) }}
        </div>
        </div>

      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-8">
        <div class="flex justify-between">
        <h3 class="text-xl font-semibold mb-4">Weekly Attendance Summary</h3>
        <div>
      <label for="monthSelect" class="mr-2">Select Month:</label>
      <select id="monthSelect" class="border border-gray-300 p-2 rounded-full" v-model="selectedMonth" @change="updateWeeks">
        <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}</option>
      </select>

      <label for="weekSelect" class="ml-4 mr-2">Week:</label>
      <select id="weekSelect" class="border border-gray-300 p-2 rounded-full" v-model="selectedWeek">
        <option v-for="(week, index) in weeks" :key="index" :value="index">{{ week }}</option>
      </select>
    </div>
        </div>
        <table class="w-full table-auto mt-2">
          <thead>
            <tr class="text-left text-gray-700 dark:text-gray-300">
              <th class="pb-2  w-1/4">Employee Name</th>
              <th class="pb-2 w-1/12">
                <div>Mon</div>
                <div class="text-sm ">{{ getDayOfMonth(1) }}</div>
                </th>
                <th class="pb-2 w-1/12">
                <div>Tue</div>
                <div class="text-sm">{{ getDayOfMonth(2) }}</div>
                </th>
                <th class="pb-2 w-1/12">
                <div>Wed</div>
                <div class="text-sm">{{ getDayOfMonth(3) }}</div>
                </th>
                <th class="pb-2 w-1/12">
                <div>Thu</div>
                <div class="text-sm">{{ getDayOfMonth(4) }}</div>
                </th>
                <th class="pb-2 w-1/12">
                <div>Fri</div>
                <div class="text-sm ">{{ getDayOfMonth(5) }}</div>
                </th>
              <th class="pb-2 w-1/12">Average</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in filteredEmployeeAttendance" :key="data.employee.id"class="border-t text-gray-600 dark:text-gray-400">
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

      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-8">
        <h3 class="text-xl font-semibold mb-4">Weekly Attendance Score</h3>
        <table class="w-full table-auto mt-2">
          <thead>
            <tr class="text-left text-gray-700 dark:text-gray-300">
              <th class="pb-2  w-1/4">Employee Name</th>
              <th class="pb-2 w-1/12">
                <div>Mon</div>
                <div class="text-sm ">{{ getDayOfMonth(1) }}</div>
                </th>
                <th class="pb-2 w-1/12">
                <div>Tue</div>
                <div class="text-sm">{{ getDayOfMonth(2) }}</div>
                </th>
                <th class="pb-2 w-1/12">
                <div>Wed</div>
                <div class="text-sm">{{ getDayOfMonth(3) }}</div>
                </th>
                <th class="pb-2 w-1/12">
                <div>Thu</div>
                <div class="text-sm">{{ getDayOfMonth(4) }}</div>
                </th>
                <th class="pb-2 w-1/12">
                <div>Fri</div>
                <div class="text-sm ">{{ getDayOfMonth(5) }}</div>
                </th>
              <th class="pb-2 w-1/12">Average</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in filteredEmployeeAttendance" :key="data.employee.id"class="border-t text-gray-600 dark:text-gray-400">
              <td class="py-2">{{  data.employee.first_name }} {{  data.employee.last_name }}</td>
              <td class="py-2 ">{{ data.attendance.Mon.score || '-' }}</td>
              <td class="py-2 ">{{ data.attendance.Tue.score || '-' }}</td>
              <td class="py-2 ">{{ data.attendance.Wed.score || '-' }}</td>
              <td class="py-2 ">{{ data.attendance.Thu.score || '-' }}</td>
              <td class="py-2 ">{{ data.attendance.Fri.score || '-' }}</td>
              <td class="py-2">{{ calculateAverageScore(data.attendance) }}</td>
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
  const selectedMonth = ref(new Date().getMonth());
  const selectedWeek = ref();
  const months = ref(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
  const weeks = ref([]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const updateWeeks = () => {
  const year = new Date().getFullYear();
  const daysInMonth = getDaysInMonth(year, selectedMonth.value);

  // Calculate the total number of weeks based on the number of days in the month
  const firstDayOfMonth = new Date(year, selectedMonth.value, 1).getDay(); 
  const totalDays = daysInMonth + firstDayOfMonth; // Add days from the previous month
  
  const numberOfWeeks = Math.ceil(totalDays / 7);
  weeks.value = Array.from({ length: numberOfWeeks }, (_, i) => `Week ${i + 1}`);
};

// Get the current week number based on the current date
const currentWeekNumber = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Calculate the first day of the month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  // Get the day of the month
  const currentDayOfMonth = currentDate.getDate();
  
  // Calculate the current week number
  // Adjust based on first day of the month
  const weekNumber = Math.ceil((currentDayOfMonth + firstDayOfMonth) / 7) - 1; // Zero-indexed
  
  return weekNumber;
};

// Set the default selected week to the current week number
selectedWeek.value = currentWeekNumber();



const filteredEmployeeAttendance = computed(() => {
  const startDate = new Date(new Date().getFullYear(), selectedMonth.value, (selectedWeek.value * 7) + 1);
  const endDate = new Date(new Date().getFullYear(), selectedMonth.value, (selectedWeek.value + 1) * 7);
  
  return employees.value.map(employee => {
    const records = attendance.value.filter(record => record.user_id === employee.id && new Date(record.date) >= startDate && new Date(record.date) < endDate);
    return {
      employee,
      attendance: {
        Mon: records.find(r => r.date === getDateOfWeek(1)) || {},
        Tue: records.find(r => r.date === getDateOfWeek(2)) || {},
        Wed: records.find(r => r.date === getDateOfWeek(3)) || {},
        Thu: records.find(r => r.date === getDateOfWeek(4)) || {},
        Fri: records.find(r => r.date === getDateOfWeek(5)) || {}
      }
    };
  });
});


const getDateOfWeek = (dayOffset) => {
  const year = new Date().getFullYear();
  const month = selectedMonth.value; // Use the selected month

  // Calculate the first day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // Get the first day of the month
  const weekStartDay = (selectedWeek.value * 7) - firstDayOfMonth; // Adjust based on first day of the month

  // Calculate the date of the week
  const date = new Date(year, month, 1 + weekStartDay + dayOffset); // Adjust date calculation

  // Return the formatted date (ISO format)
  return date.toLocaleDateString('en-CA');
};

const getDayOfMonth = (dayOffset) => {
  // Calculate the start of the month (1st day of the month)
  const year = new Date().getFullYear();
  const startOfMonth = new Date(year, selectedMonth.value, 1);

  // Adjust to the start of the selected week
  const startOfSelectedWeek = new Date(year, selectedMonth.value, selectedWeek.value * 7 + 1);

  // Calculate the weekday of the 1st day of the month
  const firstDayOfMonth = startOfMonth.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Move to the start of the selected week and add the day offset
  const startOfWeek = new Date(startOfSelectedWeek);
  startOfWeek.setDate(startOfSelectedWeek.getDate() - firstDayOfMonth + dayOffset);

  return startOfWeek.getDate(); // Return the day of the month
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
          Mon: records.find(r => r.date === getDateOfWeek(1)) || {},
          Tue: records.find(r => r.date === getDateOfWeek(2)) || {},
          Wed: records.find(r => r.date === getDateOfWeek(3)) || {},
          Thu: records.find(r => r.date === getDateOfWeek(4)) || {},
          Fri: records.find(r => r.date === getDateOfWeek(5)) || {}
        }
      };
    });

    employeeAttendance.value = weeklyAttendance;
  } catch (error) {
    console.error('Error fetching attendance:', error);
  }
};

onMounted(() => {
  fetchEmployees().then(fetchAttendance).then(() => {
    updateWeeks();
    selectedWeek.value = currentWeekNumber(); // Set default week based on the current date
  });
});


  const employeeAttendance = computed(() => {
  return employees.value.map(employee => {
    // Find attendance records for this employee
    const records = attendance.value.filter(record => record.user_id === employee.id);
    
    // Create an object to hold attendance data for each day of the week
    const attendanceData = {
      employee,
      attendance: {
        Mon: records.find(r => r.date === getDateOfWeek(1)) || {},
        Tue: records.find(r => r.date === getDateOfWeek(2)) || {},
        Wed: records.find(r => r.date === getDateOfWeek(3)) || {},
        Thu: records.find(r => r.date === getDateOfWeek(4)) || {},
        Fri: records.find(r => r.date === getDateOfWeek(5)) || {},
      }
    };
    return attendanceData;
  });
});

const calculateAverage = (attendance) => {
  // Convert time_in to total minutes from midnight (00:00) for averaging
  const totalMinutes = Object.values(attendance).reduce((sum, record) => {
    if (record.time_in) {
      const [hours, minutes] = record.time_in.split(':').map(Number); // Split time_in into hours and minutes
      return sum + (hours * 60) + minutes; // Convert to minutes and add to sum
    }
    return sum;
  }, 0);

  // Count the number of days the employee has time_in data (for averaging)
  const daysPresent = Object.values(attendance).filter(record => record.time_in).length;

  if (daysPresent === 0) return '-'; // Return '-' if no attendance data is available

  // Calculate the average time in (in minutes)
  const averageMinutes = totalMinutes / daysPresent;

  // Convert the average back to hours and minutes
  const averageHours = Math.floor(averageMinutes / 60);
  const averageRemainingMinutes = Math.floor(averageMinutes % 60);

  // Format the average time as HH:MM
  return `${String(averageHours).padStart(2, '0')}:${String(averageRemainingMinutes).padStart(2, '0')}`;
};

const calculateAverageScore = (attendance) => {
  // Calculate total score and count the number of valid days with a score
  const totalScore = Object.values(attendance).reduce((sum, record) => {
    return sum + (record.score ? record.score : 0); // Add score if it exists, otherwise add 0
  }, 0);

  // Count the number of days where a score exists
  const daysWithScore = Object.values(attendance).filter(record => record.score !== undefined && record.score !== null).length;

  // If there are no scores, return '-'
  if (daysWithScore === 0) return '-';

  // Calculate and return the average score
  return (totalScore / daysWithScore).toFixed(2); // Rounded to 2 decimal places
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
  