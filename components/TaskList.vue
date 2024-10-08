<template>
    <div class="bg-gray-100 min-h-screen p-6">
      <div class="container mx-auto">
        <!-- Task List Container -->
        <div v-if="tasks.length" class="space-y-4">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <!-- Task Title and Details Container -->
            <div class="flex justify-between items-start">
              <div class="flex-grow">
                <h3 class="text-xl font-semibold">{{ task.title }}</h3>
                <div class="text-gray-600 text-sm mt-2">
                    <p v-if="task.description" class="mt-1">Description: {{ task.description }}</p>
                  <p v-if="task.link" class="mt-1">
                    Link: 
                    <a :href="task.link" target="_blank" class="text-blue-600 hover:underline">
                      {{ shortenLink(task.link) }}
                    </a>
                  </p>
                  <br>
                  <!-- <p>Added: {{ formatDate(task.dateAdded) }}</p> -->
                  <p>Added: {{ formatDate(task.date_added) }}</p>
                  <p v-if="task.date_finished">Done: {{ formatDate(task.date_finished) }}</p>
                  <p v-if="task.hours_worked">  Hours Worked: 
                  <span v-if="Math.floor(task.hours_worked) > 0">
                    {{ Math.floor(task.hours_worked) }} hour<span v-if="Math.floor(task.hours_worked) > 1">s</span> 
                  </span>
                  <span>
                    {{ ' ' + ((task.hours_worked - Math.floor(task.hours_worked)) * 60).toFixed(0) }} minutes
                  </span></p>
                </div>
              </div>
  
              <!-- Task Status and Edit Button -->
              <div class="flex flex-col items-end ml-4">
                <span
                  :class="{
                    'text-green-500': task.status === 'Done',
                    'text-yellow-500': task.status === 'In Progress'
                  }"
                  class="text-sm font-bold mb-1"
                >
                  {{ task.status }}
                </span>
                <button @click="editTask(task)" class="text-blue-600 hover:underline">Edit</button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Message for No Tasks -->
        <div v-else class="text-center text-gray-500 mt-8">
          <p>No tasks available.</p>
        </div>
  
        <!-- Edit Task Modal -->
        <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div class="bg-white rounded-lg p-6 w-1/3">
            <h3 class="text-xl font-semibold mb-4">Edit Task</h3>
            <div>
              <label class="block mb-1">Title</label>
              <input v-model="editedTask.title" class="border p-2 w-full" />
            </div>
            <div class="mt-4">
              <label class="block mb-1">Description</label>
              <textarea v-model="editedTask.description" class="border p-2 w-full" rows="4"></textarea>
            </div>
            <div class="mt-4">
              <label class="block mb-1">Link</label>
              <input v-model="editedTask.link" class="border p-2 w-full" placeholder="Enter task link" />
            </div>
            <div class="mt-4">
              <label class="block mb-1">Status</label>
              <select v-model="editedTask.status" class="border p-2 w-full">
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div class="mt-4 flex justify-end">
              <button @click="updateTask" class="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
              <button @click="closeEditModal" class="ml-2 bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { updateTask as updateTaskService } from '@/services/taskService';

  
  // Props to receive tasks data
  const props = defineProps({
    tasks: {
      type: Array,
      default: () => []
    }
  });
  
  // State for showing the edit modal
  const showEditModal = ref(false);
  const editedTask = ref({});
  
  // Utility function to format dates
  // const formatDate = (dateString) => {
  //   const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };
  const formatDate = (dateString) => {
  if (!dateString) return 'Invalid Date'; // Return early if the dateString is missing or invalid
  
  // Handle cases where dateString may include time
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date)) return 'Invalid Date';
  
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString(undefined, options);
};

  
  // Function to shorten the link
  const shortenLink = (link) => {
    const url = new URL(link);
    return `${url.hostname}${url.pathname}`;
  };
  
  // Function to edit a task
  const editTask = (task) => {
    editedTask.value = { ...task }; // Create a copy of the task to edit
    showEditModal.value = true; // Show the edit modal
  };
  
  // Function to update a task
  // const updateTask = () => {
  //   const index = props.tasks.findIndex(task => task.id === editedTask.value.id);
  //   if (index !== -1) {
  //     props.tasks[index] = { ...editedTask.value }; // Update the task in the original array
  //   }
  //   closeEditModal(); // Close the edit modal
  // };
  const updateTask = async () => {
  try {
    await updateTaskService(editedTask.value.id, editedTask.value); // Update task using the service

    // Update the task locally after a successful API response
    const index = props.tasks.findIndex(task => task.id === editedTask.value.id);
    if (index !== -1) {
      props.tasks[index] = { ...editedTask.value }; // Update the task in the original array
    }

    closeEditModal(); // Close the edit modal
  } catch (error) {
    console.error("Failed to update the task:", error);
  }
};
  
  // Function to close the edit modal
  const closeEditModal = () => {
    showEditModal.value = false; // Hide the edit modal
    editedTask.value = {}; // Reset edited task
  };
  </script>
  
  <style scoped>
  /* Additional styles if needed */
  </style>
  