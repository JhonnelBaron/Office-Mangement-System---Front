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
                  <span>{{ task.done ? '✔ Done' : '✦ In Progress' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <p class="text-gray-600">Description: {{ task.description }}</p>
                  <p v-if="task.done" class="text-gray-500 inline">Hours: {{ task.hours }}</p>
                  <p v-if="task.link" class="text-blue-600">
                    <a :href="task.link" target="_blank">View Document</a>
                  </p>
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
  import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
  import { getTasks } from '@/services/chief/taskService';
  import Pusher from 'pusher-js';

  
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
            link: task.link
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
                link: task.link
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
// let intervalId = null;

// onMounted(async () => {
//     await fetchTasks(); // Initial fetch
//     intervalId = setInterval(fetchTasks, 5000); // Poll every 5 seconds
// });

// onUnmounted(() => {
//     clearInterval(intervalId); // Clear interval on component unmount
// });

onMounted(async () => {
  await fetchTasks();

  // Initialize Pusher with your app key and cluster
  const pusher = new Pusher('3d3383452fb5db324a27', {
    cluster: 'ap1',
  });

  // Subscribe to the channel
  const channel = pusher.subscribe('private-tasks');

  // Bind to the 'task-updated' event
  channel.bind('task.created', async (data) => {
    // When new data is received from Pusher, re-fetch tasks
    await fetchTasks();
  });
});

onUnmounted(() => {
  const pusher = new Pusher('3d3383452fb5db324a27', {
    cluster: 'ap1',
  });
  const channel = pusher.channel('private-tasks');
  channel.unbind('task.created');
  pusher.unsubscribe('private-tasks');
});

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
  
  // Function to calculate total hours worked (only for done tasks)
  const totalHoursWorked = (tasks) => {
    return tasks.reduce((total, task) => task.done ? total + (task.hours || 0) : total, 0);
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
  