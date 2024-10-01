<template>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Tasking</h2>
  
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
      <div class="mb-6 flex space-x-4">
        <!-- Dropdown for 'Tasks for Today' with date options -->
        <div class="flex items-center">
          <label class="mr-2">Tasks for:</label>
          <select v-model="selectedTodayDate" @change="filterTasks('today')" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            <option v-for="day in last7Days" :key="day.value" :value="day.value">
              {{ day.label }}
            </option>
          </select>
        </div>
  
        <!-- Dropdown for Cutoff Filter -->
        <div class="flex items-center">
          <label class="mr-2">Filter by Cutoff:</label>
          <select v-model="selectedCutoff" @change="filterTasks('cutoff')" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            <option value="cutoff1">Cutoff (26-10)</option>
            <option value="cutoff2">Cutoff (11-25)</option>
          </select>
        </div>
      </div>
  
      <!-- Task List -->
      <TaskList :tasks="filteredTasks" />
  
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
  import { ref } from 'vue';
  import TaskList from '@/components/TaskList.vue';
  
  definePageMeta({
    layout: 'employee'
  });
  
  // Fake task data for display
  const taskData = ref([
    {
      id: 1,
      title: 'Complete project proposal',
      description: 'Finalize and submit the project proposal for approval.',
      link: 'https://projectproposal.com',
      dateAdded: '2024-09-28T09:30:00',
      timeDone: '2024-09-29T14:00:00',
      status: 'Done',
      hoursWorked: 4,
    },
    {
      id: 2,
      title: 'Submit team report',
      description: 'Compile the team’s progress and submit the report to the manager.',
      link: 'https://teamreport.com',
      dateAdded: '2024-10-01T11:45:00',
      status: 'In Progress',
    },
    {
      id: 3,
      title: 'Attend client meeting',
      description: 'Join the Zoom call to discuss project deliverables with the client.',
      link: 'https://zoom.com',
      dateAdded: '2024-10-01T15:00:00',
      timeDone: '2024-10-02T10:30:00',
      status: 'Done',
      hoursWorked: 2,
    },
    {
      id: 4,
      title: 'Prepare presentation slides',
      description: 'Create slides for the upcoming project presentation.',
      link: null,
      dateAdded: '2024-10-03T08:00:00',
      status: 'In Progress',
    },
    {
      id: 5,
      title: 'Finalize budget plan',
      description: 'Complete the budget plan for the next quarter.',
      link: null,
      dateAdded: '2024-10-03T09:30:00',
      status: 'In Progress',
    },
  ]);
  
  // State for managing the modal
  const showModal = ref(false);
  const newTaskTitle = ref('');
  const newTaskDescription = ref('');
  const newTaskLink = ref('');
  
  // Filtered tasks for display
  const filteredTasks = ref([...taskData.value]);
  
  // State for dropdown selection
  const selectedTodayDate = ref(new Date().toISOString().split('T')[0]); // Today's date selected by default
  const selectedCutoff = ref('cutoff1');
  
  // Generate last 7 days for "Tasks for Today" filter
  const last7Days = ref(generateLast7Days());
  
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
  const addTask = () => {
    if (newTaskTitle.value) {
      const newTask = {
        id: taskData.value.length + 1, // Incremental ID
        title: newTaskTitle.value,
        description: newTaskDescription.value,
        link: newTaskLink.value || null,
        dateAdded: new Date().toISOString(), // Current date and time
        status: 'In Progress', // Automatically set status
      };
  
      taskData.value.push(newTask);
      closeModal(); // Close the modal after adding the task
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
  
  // Task filters
  const filterTasks = (filterType) => {
    const today = new Date(selectedTodayDate.value);
    filteredTasks.value = taskData.value.filter((task) => {
      const taskDate = new Date(task.dateAdded);
      if (filterType === 'today') {
        return taskDate.toDateString() === today.toDateString();
      } else if (filterType === 'cutoff') {
        return selectedCutoff.value === 'cutoff1'
          ? taskDate.getDate() <= 10
          : taskDate.getDate() >= 11;
      }
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
  