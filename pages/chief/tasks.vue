<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">User Task Overview</h2>
  
      <!-- Display today's date -->
      <div class="mb-4">
        <strong>Date Today: </strong>{{ currentDate }}
      </div>
  
      <!-- Container for Date Filter and Add Task Link -->
      <div class="mb-4 flex items-center justify-between">
  <!-- Filter Container -->
  <div class="flex items-center mr-4 space-x-4"> <!-- Added space-x-4 for spacing -->
    <!-- User Filter -->
    <div class="flex items-center">
      <label for="userFilter" class="mr-2 font-medium">Filter by User:</label>
      <select v-model="selectedUserFilter" class="border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500">
        <option value="">All Users</option>
        <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
      </select>
    </div>

    <!-- Date Filter -->
    <div class="flex items-center">
      <label for="taskDate" class="mr-2 font-medium">Filter by Date:</label>
      <input
        type="date"
        v-model="filterDate"
        class="border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
        @change="updateFilteredTasks"
      />
    </div>
  </div>

  <!-- Text link to open modal for adding a task -->
  <span
    @click="showModal = true"
    class="cursor-pointer text-blue-600 underline mb-4 ml-4"
  >
    <i class="fas fa-plus"></i> + Assign Task
  </span>
</div>

  
      <!-- User Task List -->
      <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
        <thead class="bg-gray-200">
          <tr>
            <th class="border border-gray-300 px-4 py-2 text-left font-medium">Employee</th>
            <th class="border border-gray-300 px-4 py-2 text-left font-medium">Tasks Assigned</th>
            <th class="border border-gray-300 px-4 py-2 text-left font-medium">Total Hours Worked</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-100 transition duration-200">
            <td class="border border-gray-300 px-4 py-2">{{ user.name }}</td>
            <td class="border border-gray-300 px-4 py-2">
              <ul>
                <li v-for="task in filteredTasks(user.tasks, filterDate)" :key="task.id">
                <div>
                  <strong>{{ task.title }}</strong> -
                  <span>{{ task.completed ? '✔ Completed' : '✦ In Progress' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <p class="text-gray-600">Description: {{ task.description }}</p>
                  <p v-if="task.completed" class="text-gray-500 inline">Hours: {{ task.hours }}</p>
                </div>
                </li>
                <li v-if="filteredTasks(user.tasks, filterDate).length === 0" class="text-gray-500">No tasks for this date.</li>
              </ul>
            </td>
            <td class="border border-gray-300 px-4 py-2">
              <span>{{ totalHoursWorked(filteredTasks(user.tasks, filterDate)) }} hours</span>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Modal for adding a new task -->
      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h3 class="text-lg font-bold mb-4">Assign New Task</h3>
          <label class="block mb-1">Employee:</label>
          <select v-model="selectedUser" class="border border-gray-300 mb-2 p-2 rounded">
            <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
          </select>
  
          <label class="block mb-1">Task Title:</label>
          <input v-model="newTask.title" type="text" class="border border-gray-300 mb-2 p-2 rounded w-full" />
  
          <label class="block mb-1">Description:</label>
          <textarea v-model="newTask.description" class="border border-gray-300 mb-2 p-2 rounded w-full"></textarea>
  
          <div class="flex justify-end">
            <button @click="showModal = false" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200">Cancel</button>
            <button @click="addTask" class="bg-gray-200 hover:bg-green-700 text-black px-4 py-2 rounded transition duration-200">Add Task</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue';
  
  // Define page metadata
  definePageMeta({
    layout: 'chief',
  });
  
  // Current date
  const currentDate = new Date().toLocaleDateString('en-CA'); // Ensure correct format (YYYY-MM-DD)
  
  // Date filter
  const filterDate = ref(currentDate); // Default to today
  
  // User filter
  const selectedUserFilter = ref('');
  
  // Fake user data with tasks
  const users = ref([
    {
      id: 1,
      name: 'Alice',
      tasks: [
        { id: 1, title: 'Task 1', description: 'Description for task 1', completed: false, hours: 3, date: currentDate }, // Today's date
        { id: 2, title: 'Task 2', description: 'Description for task 2', completed: true, hours: 2, date: currentDate }, // Today's date
        { id: 3, title: 'Past Task', description: 'A task from yesterday', completed: false, hours: 1, date: '2024-09-30' }, // Past date
      ],
    },
    {
      id: 2,
      name: 'Bob',
      tasks: [
        { id: 4, title: 'Task 3', description: 'Description for task 3', completed: false, hours: 4, date: currentDate }, // Today's date
        { id: 5, title: 'Future Task', description: 'A task for tomorrow', completed: true, hours: 1, date: '2024-10-02' }, // Future date
      ],
    },
    {
      id: 3,
      name: 'Charlie',
      tasks: [
        { id: 6, title: 'Task 4', description: 'Description for task 4', completed: true, hours: 1, date: currentDate }, // Today's date
        { id: 7, title: 'Task 5', description: 'Description for task 5', completed: false, hours: 5, date: currentDate }, // Today's date
      ],
    },
  ]);
  
  // Modal state
  const showModal = ref(false);
  const selectedUser = ref(users.value[0].id); // Default to the first user
  const newTask = ref({ title: '', description: '' }); // Removed hours field
  
  // Function to add a new task
  const addTask = () => {
    const user = users.value.find((u) => u.id === selectedUser.value);
    if (user) {
      const taskId = user.tasks.length + 1; // Simple ID generation
      user.tasks.push({ id: taskId, ...newTask.value, completed: false, hours: 0, date: currentDate }); // Set date to current date for new tasks
      newTask.value = { title: '', description: '' }; // Reset the new task form
      showModal.value = false; // Close modal
    }
  };
  
  // Function to filter tasks by date
  const filteredTasks = (tasks, date) => {
    return tasks.filter((task) => task.date === date);
  };
  
  // Function to calculate total hours worked (only for completed tasks)
  const totalHoursWorked = (tasks) => {
    return tasks.reduce((total, task) => (task.completed ? total + task.hours : total), 0);
  };
  
  // Computed property for filtered users
  const filteredUsers = computed(() => {
    if (selectedUserFilter.value) {
      return users.value.filter(user => user.id === Number(selectedUserFilter.value));
    }
    return users.value;
  });
  
  // Watch for changes in the filterDate
  watch(filterDate, (newValue) => {
    if (newValue === '') {
      filterDate.value = null; // Reset to null when the date input is cleared
    }
  });
  
  // Update the filtered tasks when the date changes (this can be removed if not needed)
  const updateFilteredTasks = () => {
    // Trigger reactivity when the date changes, if necessary.
    filteredUsers.value; // Access to trigger reactivity
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  