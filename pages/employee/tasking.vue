<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Tasking</h2>
      <ReportGenerator :tasks="filteredTasks" :cutoffDateRange="cutoffDateRange" :selectedCutoff="selectedCutoff" />

      <!-- Add Task Text Link with Plus Icon -->
      <div class="flex items-center cursor-pointer text-blue-600 hover:underline" @click="openModal">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Add Task</span>
      </div>
    </div>

    <!-- Display Today's Date -->
    <div class="mb-4 text-right text-sm font-medium text-gray-600">
      Today: {{ formatDate(new Date()) }}
    </div>
    

    <!-- Filters for Task List as Dropdowns -->
    <div class="mb-6 flex justify-between space-x-4">
      <div class="flex items-center">
        <label class="mr-2">Tasks for:</label>
        <div class="flex items-center">
      <input
        type="date"
        class="border p-2 rounded focus:outline-none focus:ring focus:ring-blue-500 bg-gray-200 rounded-lg hover:bg-gray-300"
        @change="updateFilteredTasks"
      />
    </div>
        <label class="ml-3 mr-2">Cutoff:</label>
        <select v-model="selectedCutoff" @change="filterTasks('cutoff')" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            <option value="previousCutoff1">{{ cutoffDateRange.previousCutoff1.previousMonth }} 11-25</option>
  <option value="previousCutoff2">{{ cutoffDateRange.previousCutoff2.previousMonth }} 26 - {{ cutoffDateRange.previousCutoff2.currentMonth }} 10</option>
          <option value="cutoff1">{{ cutoffDateRange.cutoff1.currentMonth }} 11-25</option>
          <option value="cutoff2">{{ cutoffDateRange.cutoff2.currentMonth }} 26 - {{ cutoffDateRange.cutoff2.nextMonth }} 10</option>
        </select>
      </div>

      <div class="flex space-x-4">
        <div class="flex items-center">
          <p>Pending: </p>
          <div class="border border-yellow-500 bg-yellow-300 w-4 h-4 ml-2 mr-2 rounded-full"></div>
        <span>1 Day</span>
      </div>
      <div class="flex items-center">
        <div class="border border-orange-500 bg-orange-500 w-4 h-4 mr-2 rounded-full"></div>
        <span>2 Days</span>
      </div>
      <div class="flex items-center">
        <div class="border border-red-500 bg-red-500 w-4 h-4 mr-2 rounded-full"></div>
        <span>3 Days</span>
      </div>
      </div>
    </div>


    <!-- Task List -->
    <TaskList :tasks="filteredTasks" @updateTasks="handleTaskUpdate" />

    <!-- "Print Accomplishment Report" Link -->
    <div class="mt-8">
      <a href="#" @click.prevent="printAccomplishmentReport" class="text-blue-600 hover:underline">Print Accomplishment Report</a>
    </div>

    <!-- Modal for Adding Task -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">Add New Task</h3>

        <form @submit.prevent="addTask">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Task Title</label>
            <input v-model="newTaskTitle" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter task title" required>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea v-model="newTaskDescription" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter task description" rows="3"></textarea>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Link (Optional)</label>
            <input v-model="newTaskLink" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter related link">
          </div>

          <div class="flex justify-end">
            <button type="button" @click="closeModal" class="text-gray-500 mr-4">Cancel</button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import TaskList from '@/components/TaskList.vue';
import ReportGenerator from '@/components/employee/ReportGenerator.vue';
import { addTask as addTaskService, getTasks } from '@/services/taskService';

definePageMeta({
  layout: 'employee'
});

// State for task data
const taskData = ref([]);
const filteredTasks = ref([]);
const currentDate = new Date().toLocaleDateString('en-CA');
// State for managing the modal
const filterDate = ref(currentDate); // Default to today
const showModal = ref(false);
const newTaskTitle = ref('');
const newTaskDescription = ref('');
const newTaskLink = ref('');
const getMonthName = (monthIndex) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[monthIndex];
};
// Computed properties for cutoff dates
const cutoffDateRange = reactive({
  cutoff1: {
    start: 11,
    end: 25,
    currentMonth: getMonthName(new Date().getMonth()),
  },
  cutoff2: {
    start: 26,
    end: 10,
    currentMonth: getMonthName(new Date().getMonth()),
    nextMonth: getMonthName((new Date().getMonth() + 1) % 12),// Handle month increment for cutoff2
  },
  previousCutoff1: {
    start: 11,
    end: 25,
    previousMonth: getMonthName((new Date().getMonth() - 1 + 12) % 12),
  },
  previousCutoff2: {
    start: 26,
    end: 10,
    previousMonth: getMonthName((new Date().getMonth() - 1 + 12) % 12),
    currentMonth: getMonthName(new Date().getMonth()),
  },
});


// State for dropdown selection
const selectedTodayDate = ref(new Date().toISOString().split('T')[0]);
const selectedCutoff = ref('');

const determineDefaultCutoff = () => {
  const today = new Date();
  const day = today.getDate();
  const currentMonth = today.getMonth();

  if (day >= 11 && day <= 25) {
    // Current month 11-25
    selectedCutoff.value = 'cutoff1';
  } else if (day >= 26) {
    // Current month 26 - Next month 10
    selectedCutoff.value = 'cutoff2';
  } else if (day <= 10) {
    // Previous month 26 - Current month 10
    selectedCutoff.value = 'previousCutoff2';
  } else {
    // Previous month 11-25
    selectedCutoff.value = 'previousCutoff1';
  }
};



// Automatically set and update the default cutoff when component mounts
onMounted(() => {
  determineDefaultCutoff();

  // Optionally, you could add a daily check if you need it to dynamically adjust each day
  setInterval(() => {
    determineDefaultCutoff();
  }, 24 * 60 * 60 * 1000); // Check once a day
});

// Generate last 7 days for "Tasks for Today" filter
const last7Days = ref(generateLast7Days());

let intervalId = null;
onMounted(async () => {

  // Start polling for new tasks
  onUnmounted(() => clearInterval(intervalId)); // Clear interval on component unmount
  await fetchTasks();
});

// Function to fetch tasks
const fetchTasks = async () => {
  try {
    const tasks = await getTasks();
    // console.log('Fetched tasks:', tasks); 
    taskData.value = tasks;
    // filteredTasks.value = tasks;
    filterTasks('cutoff');
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

const handleTaskUpdate = async (updatedTask) => {
  console.log("Updated Task:", updatedTask);
  
  // Optionally, update the task list locally or re-fetch tasks
  await fetchTasks();
};


// Function to open the modal
const openModal = () => {
  showModal.value = true;
};

// Function to close the modal
const closeModal = () => {
  showModal.value = false;
  newTaskTitle.value = '';
  newTaskDescription.value = '';
  newTaskLink.value = '';
};

// Function to add a new task
const addTask = async () => {
  const task = {
    title: newTaskTitle.value,
    description: newTaskDescription.value,
    link: newTaskLink.value || null,
  };

  try {
    const newTask = await addTaskService(task);
    taskData.value.push(newTask);
    filteredTasks.value.push(newTask);
    await fetchTasks(); 
    closeModal();
  } catch (error) {
    console.error('Error adding task:', error);
  }
};

// Utility function to generate last 7 days
function generateLast7Days() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      label: date.toDateString(),
      value: date.toISOString().split('T')[0],
    });
  }
  return days;
}

// Utility function to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};


const filterTasks = (filterType) => {
  const today = new Date();
  filteredTasks.value = taskData.value.filter((task) => {
    const taskDate = new Date(task.date_added);

    if (filterType === 'cutoff') {
      if (selectedCutoff.value === 'cutoff1') {
        return taskDate.getDate() >= 11 && taskDate.getDate() <= 25 && taskDate.getMonth() === today.getMonth();
      }
      if (selectedCutoff.value === 'cutoff2') {
        return (taskDate.getDate() >= 26 && taskDate.getMonth() === today.getMonth()) ||
               (taskDate.getDate() <= 10 && taskDate.getMonth() === (today.getMonth() + 1) % 12);
      }
      if (selectedCutoff.value === 'previousCutoff1') {
        return taskDate.getDate() >= 11 && taskDate.getDate() <= 25 && taskDate.getMonth() === (today.getMonth() - 1 + 12) % 12;
      }
      if (selectedCutoff.value === 'previousCutoff2') {
        return (taskDate.getDate() >= 26 && taskDate.getMonth() === (today.getMonth() - 1 + 12) % 12) ||
               (taskDate.getDate() <= 10 && taskDate.getMonth() === today.getMonth());
      }
    }

    return false;
  });
};


const updateFilteredTasks = () => {
  const selectedDate = filterDate.value;
  filteredTasks.value = taskData.value.filter((task) => {
    const taskDate = new Date(task.date_added).toISOString().split('T')[0];
    return taskDate === selectedDate;
  });
};

// Function to print accomplishment report
const printAccomplishmentReport = () => {
  window.print();
};
</script>

<style scoped>
/* Add your styles here */
</style>
