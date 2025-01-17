<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">User Task Overview</h2>
  
      <!-- Display today's date -->
      <!-- <div class="mb-4 text-right text-sm font-medium text-gray-600">
        <strong>Date Today: </strong>{{ formatDate(new Date()) }}
      </div> -->
  
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
        <!-- Reload Icon -->
    <svg 
          class="w-6 h-6 text-gray-800 dark:text-white cursor-pointer hover:text-gray-900 transition duration-200" 
          aria-hidden="true" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          @click="reloadData"
          title="Reload Data"
        >
          <path 
            stroke="currentColor" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
          />
        </svg>
  </div>



  <div class="mb-4 text-right text-sm font-medium text-gray-600">
        <strong>Date Today: </strong>{{ formatDate(new Date()) }}
      </div>
  <!-- Text link to open modal for adding a task -->
  <!-- <span
    @click="showModal = true"
    class="cursor-pointer text-blue-600 underline mb-4 ml-4"
  >
    <i class="fas fa-plus"></i> + Assign Task
  </span> -->
</div>

  
      <!-- User Task List -->
      <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
        <thead class="bg-gray-200">
          <tr>
            <th class="border border-gray-300 px-4 py-2 text-left font-medium" style="width: 50px;">Employee</th>
            <th class="border border-gray-300 px-4 py-2 text-left font-medium" style="width: 500px;">Tasks Assigned</th>
            <th class="border border-gray-300 px-4 py-2 text-left font-medium" style="width: 150px;">Total Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-100 transition duration-200">
            <td class="border border-gray-300 px-4 py-2">{{ user.name }}</td>
            <td class="border border-gray-300 px-4 py-2">
              <ul>
                <li v-for="task in filteredTasks(user.tasks, filterDate)" :key="task.id">
                <div :class="getTaskColor(task)">
                  <strong>{{ task.title }}</strong> -
                  <span>{{ task.done ? '✔ Done' : '✦ In Progress' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <p class="text-gray-600">Description: {{ task.description }}</p>
                  <!-- <p v-if="task.done" class="text-gray-500 inline">Hours: {{ task.hours }}</p> -->
                  <p v-if="task.done" class="text-gray-500">
                    <span v-if="Math.floor(task.hours) > 0">
                      {{ Math.floor(task.hours) }} hour<span v-if="Math.floor(task.hours) > 1">s</span> 
                    </span>
                    <span  v-if="(task.hours - Math.floor(task.hours)) * 60 > 0">
                      {{ ' ' +  ((task.hours - Math.floor(task.hours)) * 60).toFixed(0) }} minute<span v-if="((task.hours - Math.floor(task.hours)) * 60).toFixed(0) > 1">s</span>
                    </span>
                  </p>
                </div>
                <div v-if="task.links && task.links.length">
                  <ul>
                    <li v-for="(link, index) in task.links" :key="index">
                      <a :href="link" target="_blank" class="text-blue-600" :title="link">View Document</a>
                    </li>
                  </ul>
                </div>
                </li>
                <li v-if="filteredTasks(user.tasks, filterDate).length === 0" class="text-gray-500">No tasks for this date.</li>
              </ul>
            </td>
            <td class="border border-gray-300 px-4 py-2">
              <span>
              {{ 
                totalHoursWorked(filteredTasks(user.tasks, filterDate)).totalHours > 0 
                  ? totalHoursWorked(filteredTasks(user.tasks, filterDate)).totalHours + 
                    (totalHoursWorked(filteredTasks(user.tasks, filterDate)).totalHours === 1 ? ' hour ' : ' hours ') 
                  : '' 
              }}
              {{ 
                totalHoursWorked(filteredTasks(user.tasks, filterDate)).totalMinutes > 0 
                  ? totalHoursWorked(filteredTasks(user.tasks, filterDate)).totalMinutes + 
                    (totalHoursWorked(filteredTasks(user.tasks, filterDate)).totalMinutes === 1 ? ' minute' : ' minutes') 
                  : '' 
              }}
            </span>
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
  import { getTasks } from '@/services/chief/taskService';
  
  // Define page metadata
  definePageMeta({
    layout: 'chief',
  });
  
  // Current date
  const currentDate = new Date().toLocaleDateString('en-CA'); // Ensure correct format (YYYY-MM-DD)
  const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
  
  // Date filter
  const filterDate = ref(currentDate); // Default to today
  
  // User filter
  const selectedUserFilter = ref('');
  
  // Modal state
  const showModal = ref(false);
  const selectedUser = ref(null); // Default to the first user
  const newTask = ref({ title: '', description: '' }); // Removed hours field

  //state for storing users and tasks
  const users = ref([]);
  const tasks = ref([]);

  //Function to fetch and map tasks to users
  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getTasks();
      //Process tasks to group by users
      const groupedUsers = fetchedTasks.reduce((acc, task) => {
        const user = acc.find((u) => u.id === task.user_id);
        if (user) {
          user.tasks.push({
            id: task.id,
            title: task.title,
            description: task.description,
            done: task.status === 'Done',
            hours: task.hours_worked,
            date: task.date_added,
            links: task.links
          });
        } else {
          acc.push({
            id: task.user_id,
            name: `${task.user.first_name} ${task.user.last_name}`,
            tasks:[
              {
                id: task.id,
                title: task.title,
                description: task.description,
                done: task.status === 'Done',
                hours: task.hours_worked,
                date: task.date_added,
                links: task.links
              },
            ],
          });
        }
        return acc;
      }, []);
      users.value = groupedUsers;
      if (users.value.length > 0) {
      selectedUser.value = users.value[0].id;
    }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  //Call fetchTasks on component mount
  // onMounted(() => {
  //   fetchTasks();
  // });
//   onMounted(async () => {

//   // Start polling for new tasks
//   onUnmounted(() => clearInterval(intervalId)); // Clear interval on component unmount
//   await fetchTasks();
// });
let intervalId = null;

onMounted(async () => {
    await fetchTasks(); // Initial fetch
    // intervalId = setInterval(fetchTasks, 5000); // Poll every 5 seconds
});

onUnmounted(() => {
    clearInterval(intervalId); // Clear interval on component unmount
});

// Reload function to refresh tasks
const reloadData = async () => {
  await fetchTasks();
  console.log('Data reloaded');
};

  // Function to add a new task
  const addTask = () => {
    const user = users.value.find((u) => u.id === selectedUser.value);
    if (user) {
      const taskId = user.tasks.length + 1; // Simple ID generation
      user.tasks.push({ id: taskId, ...newTask.value, done: false, hours: 0, date: currentDate }); // Set date to current date for new tasks
      newTask.value = { title: '', description: '' }; // Reset the new task form
      showModal.value = false; // Close modal
    }
  };
  
  // Function to filter tasks by date
  const filteredTasks = (tasks, date) => {
    // return tasks.filter((task) => task.date.slice(0, 10) === date);
    return tasks.filter((task) => new Date(task.date).toISOString().split('T')[0] === date);
  };

  function convertDecimalToTime(decimalHours) {
    const totalMinutes = Math.floor(decimalHours * 60); // Total minutes
    const hours = Math.floor(totalMinutes / 60); // Full hours
    const minutes = totalMinutes % 60; // Remaining minutes
    return { hours, minutes };
}
const totalHoursWorked = (tasks) => {
    let totalHours = 0;
    let totalMinutes = 0;

    tasks.forEach(task => {
        if (task.done && task.hours) {
            totalHours += Math.floor(task.hours); // Add full hours
            totalMinutes += Math.round((task.hours % 1) * 60); // Add minutes from decimal part
        }
    });

    // Convert total minutes to hours if greater than 60
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    return { totalHours, totalMinutes }; // Return an object
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

  const getTaskColor = (task) => {
  const taskDate = new Date(task.date);
  const now = new Date();
  const diffInHours = Math.floor((now - taskDate) / (1000 * 60 * 60)); // Difference in hours

  if (task.done) return 'text-gray-500'; // If done, return gray color

  if (diffInHours >= 72) return 'text-red-600'; // Red if over 72 hours
  if (diffInHours >= 48) return 'text-orange-600'; // Orange if over 48 hours
  if (diffInHours >= 24) return 'text-yellow-500'; // Yellow if over 24 hours

  return ''; // Default color if not in progress long enough
};

  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  