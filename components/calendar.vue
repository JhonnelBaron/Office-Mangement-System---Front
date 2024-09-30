<template>
    <div class="calendar">
      <header class="calendar-header">
        <h2>{{ monthName }} {{ year }}</h2>
        <p class="today-date">Today: {{ formattedToday }}</p> <!-- Display today's date -->
        <button @click="openModal" class="add-task-btn">Add Task</button>
      </header>
      <div class="calendar-grid">
        <div class="day-header" v-for="(day, index) in dayNames" :key="index">
          {{ day }}
        </div>
        <div
          class="day"
          v-for="(day, index) in daysInMonth"
          :key="index"
          @click="selectDay(day)"
          :class="{ selected: isSelected(day) }"  
        >
          {{ day }}
          <div v-if="tasks[day]" class="task-list">
            <ul>
              <li v-for="(task, i) in tasks[day]" :key="i">{{ task.name }} - {{ task.deadline }}</li>
            </ul>
          </div>
          <span v-if="tasks[day]" class="task-indicator">⚠️</span>
        </div>
      </div>
      <taskModal v-if="isModalOpen" @close="closeModal" @addTask="addTask" :selectedDate="selectedDate" />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import taskModal from './taskModal.vue'; // Import the modal component
  
  // Get the current date
  const currentDate = new Date();
  const month = ref(currentDate.getMonth());
  const year = ref(currentDate.getFullYear());
  const tasks = ref({}); // Store tasks for each day
  const isModalOpen = ref(false);
  const selectedDate = ref(null);
  
  // Names of the days and months
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  
  // Computed properties for month name and days in month
  const monthName = computed(() => monthNames[month.value]);
  const daysInMonth = computed(() => {
    const days = [];
    const firstDayOfMonth = new Date(year.value, month.value, 1).getDay();
    const totalDays = new Date(year.value, month.value + 1, 0).getDate();
  
    // Fill in the days of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push('');
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    return days;
  });
  
  // Computed property for today's date
  const formattedToday = computed(() => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return currentDate.toLocaleDateString('en-US', options);
  });
  
  // Methods to handle task modal
  const openModal = () => {
    isModalOpen.value = true;
  };
  
  const closeModal = () => {
    isModalOpen.value = false;
  };
  
  // Method to select a day
  const selectDay = (day) => {
    if (day) {
      selectedDate.value = day;
    }
  };
  
  // Check if the day is selected
  const isSelected = (day) => {
    return selectedDate.value === day;
  };
  
  // Method to add a task
  const addTask = (task) => {
    const day = selectedDate.value;
    if (!tasks.value[day]) {
      tasks.value[day] = [];
    }
    tasks.value[day].push(task);
    closeModal();
  };
  </script>
  
  <style scoped>
  .calendar {
    max-width: 600px;
    margin: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .calendar-header {
    background-color: #4a90e2;
    color: white;
    padding: 10px;
    text-align: center;
  }
  
  .today-date {
    font-size: 14px;
    margin: 5px 0;
  }
  
  .add-task-btn {
    margin-top: 10px;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    background-color: #3a78b7;
    color: white;
    cursor: pointer;
  }
  
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
  
  .day-header {
    background-color: #e7e7e7;
    padding: 10px;
    text-align: center;
    font-weight: bold;
  }
  
  .day {
    padding: 20px;
    text-align: center;
    border: 1px solid #ddd;
    min-height: 50px; /* Set a minimum height for the days */
    position: relative; /* For positioning task list */
    transition: background-color 0.3s; /* Smooth transition */
  }
  
  /* Highlight Sundays */
  .day:nth-child(7n + 1) {
    color: red; 
  }
  
  /* Selected day styling */
  .selected {
    background-color: #3a78b7; /* Highlight color */
    color: white; /* Change text color for contrast */
  }
  
  .task-list {
    margin-top: 5px;
    font-size: 12px;
  }
  
  .task-indicator {
    display: inline-block;
    color: orange; /* Change color as needed */
    margin-top: 5px;
    font-size: 18px; /* Adjust size for visibility */
  }
  </style>
  