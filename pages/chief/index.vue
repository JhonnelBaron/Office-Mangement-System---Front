<template>
    <div class="p-6 rounded bg-white text-gray-800 shadow-lg">
        <h3 class="text-3xl font-bold">Welcome Chief!!</h3>
        <p class="mt-2 text-xl font-semibold">Eto na nga pala yung ambag ng mga bata</p>
        <p class="mt-1 text-sm"></p>
    </div>
    
    <div class="mb-8 mt-5">
        <h2>As of Today</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Tasks Created -->
            <div class="p-6 rounded bg-blue-500 text-white shadow-lg flex flex-col">
                <h3 class="text-lg font-bold">Tasks Created</h3>
                <p class="mt-2 text-4xl font-semibold">{{ tasksCreatedToday }}</p>
                <button class="self-end mr-4" @click="toggleDropdown('created')">View</button>
            </div>

            <!-- Tasks Done -->
            <div class="p-6 rounded bg-blue-500 text-white shadow-lg flex flex-col">
                <h3 class="text-lg font-bold">Tasks Done</h3>
                <p class="mt-2 text-4xl font-semibold">{{ doneTasks }}</p>
                <button class="self-end mr-4" @click="toggleDropdown('done')">View</button>
            </div>

            <!-- Tasks Suspended -->
            <div class="p-6 rounded bg-blue-500 text-white shadow-lg flex flex-col">
                <h3 class="text-lg font-bold">Tasks Suspended</h3>
                <p class="mt-2 text-4xl font-semibold">{{ suspendedTasks }}</p>
                <button class="self-end mr-4" @click="toggleDropdown('suspended')">View</button>
            </div>

            <!-- Tasks In Progress -->
            <div class="p-6 rounded bg-blue-500 text-white shadow-lg flex flex-col">
                <h3 class="text-lg font-bold">Tasks In Progress</h3>
                <p class="mt-2 text-4xl font-semibold">{{ inProgressTasks }}</p>
                <button class="self-end mr-4" @click="toggleDropdown('inprogress')">View</button>
            </div>
        </div>
    </div>

    <div v-if="selectedCategory" class="task-dropdown">
        <h3 class="text-l">
    {{ selectedCategory.toLowerCase() === 'inprogress' ? 'In Progress' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).toLowerCase() }}
</h3>
    <!-- Task List Container (Dropdown effect) -->
    <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
        <div v-if="selectedCategory" class="task-dropdown p-6 bg-white shadow-lg rounded">
            <div v-if="selectedCategory === 'created'" class="task-table">
            <div class="task-row header">
                <div class="task-column text-gray-800"><strong>Name</strong></div>
                <div class="task-column text-gray-800"><strong>Task</strong></div>
                <div class="task-column text-gray-800"><strong>Subject</strong></div>
                <div class="task-column text-gray-800"><strong>Documents</strong></div>
            </div>
            <div v-for="task in createdTasksList" :key="task.id" class="task-row">
                <div class="task-column">    {{ task.user 
                    ? `${task.user.first_name.charAt(0).toUpperCase() + task.user.first_name.slice(1).toLowerCase()} 
                    ${task.user.last_name.charAt(0).toUpperCase() + task.user.last_name.slice(1).toLowerCase()}` 
                    : 'No User' 
                }}</div>
                <div class="task-column">{{ task.title }}</div>
                <div class="task-column">{{ task.description }}</div>
                <div v-if="task.links && task.links.length" class="text-blue-500">
                    <a 
                        v-for="(link, index) in task.links" 
                        :href="link" 
                        :key="index" 
                        target="_blank" 
                        :title="link" 
                        class="hover:underline">
                        Doc {{ index + 1 }}
                    </a>
                </div>
                <div v-else>
                    No Document
                </div>
            </div>
        </div>
            <div v-if="selectedCategory === 'done'" class="task-table">
                <div class="task-row header">
                <div class="task-column"><strong>Name</strong></div>
                <div class="task-column"><strong>Task</strong></div>
                <div class="task-column"><strong>Subject</strong></div>
                <div class="task-column"><strong>Documents</strong></div>
            </div>
            <div v-for="task in doneTasksList" :key="task.id" class="task-row">
                <div class="task-column">    {{ task.user 
                    ? `${task.user.first_name.charAt(0).toUpperCase() + task.user.first_name.slice(1).toLowerCase()} 
                    ${task.user.last_name.charAt(0).toUpperCase() + task.user.last_name.slice(1).toLowerCase()}` 
                    : 'No User' 
                }}</div>
                <div class="task-column">{{ task.title }}</div>
                <div class="task-column">{{ task.description }}</div>
                <div v-if="task.links && task.links.length" class="text-blue-500">
                    <a 
                        v-for="(link, index) in task.links" 
                        :href="link" 
                        :key="index" 
                        target="_blank" 
                        :title="link" 
                        class="hover:underline">
                        Doc {{ index + 1 }}
                    </a>
                </div>
                <div v-else>
                    No Document
                </div>
            </div>
            </div>
            <div v-if="selectedCategory === 'suspended'" class="task-table">
                <div class="task-row header">
                <div class="task-column"><strong>Name</strong></div>
                <div class="task-column"><strong>Task</strong></div>
                <div class="task-column"><strong>Subject</strong></div>
                <div class="task-column"><strong>Documents</strong></div>
            </div>
            <div v-for="task in suspendedTasksList" :key="task.id" class="task-row">
                <div class="task-column">    {{ task.user 
                    ? `${task.user.first_name.charAt(0).toUpperCase() + task.user.first_name.slice(1).toLowerCase()} 
                    ${task.user.last_name.charAt(0).toUpperCase() + task.user.last_name.slice(1).toLowerCase()}` 
                    : 'No User' 
                }}</div>
                <div class="task-column">{{ task.title }}</div>
                <div class="task-column">{{ task.description }}</div>
                <div v-if="task.links && task.links.length" class="text-blue-500">
                    <a 
                        v-for="(link, index) in task.links" 
                        :href="link" 
                        :key="index" 
                        target="_blank" 
                        :title="link" 
                        class="hover:underline">
                        Doc {{ index + 1 }}
                    </a>
                </div>
                <div v-else>
                    No Document
                </div>
            </div>
            </div>
            <div v-if="selectedCategory === 'inprogress'" class="task-table">
                <div class="task-row header">
                <div class="task-column"><strong>Name</strong></div>
                <div class="task-column"><strong>Task</strong></div>
                <div class="task-column"><strong>Subject</strong></div>
                <div class="task-column"><strong>Documents</strong></div>
            </div>
            <div v-for="task in inProgressTasksList" :key="task.id" class="task-row">
                <div class="task-column">    {{ task.user 
                    ? `${task.user.first_name.charAt(0).toUpperCase() + task.user.first_name.slice(1).toLowerCase()} 
                    ${task.user.last_name.charAt(0).toUpperCase() + task.user.last_name.slice(1).toLowerCase()}` 
                    : 'No User' 
                }}</div>
                <div class="task-column">{{ task.title }}</div>
                <div class="task-column">{{ task.description }}</div>
                <div v-if="task.links && task.links.length" class="text-blue-500">
                    <a 
                        v-for="(link, index) in task.links" 
                        :href="link" 
                        :key="index" 
                        target="_blank" 
                        :title="link" 
                        class="hover:underline">
                        Doc {{ index + 1 }}
                    </a>
                </div>
                <div v-else>
                    No Document
                </div>
            </div>
            </div>
        </div>
    </transition>
    </div>
</template>

<script setup>
  import { getTasksCount } from '@/services/chief/taskService';
  import { onMounted, ref } from 'vue';

  definePageMeta({
      layout: 'chief'
  })

  const tasksCreatedToday = ref(0);
  const doneTasks = ref(0);
  const suspendedTasks = ref(0);
  const inProgressTasks = ref(0);

  const createdTasksList = ref([]);
  const doneTasksList = ref([]);
  const suspendedTasksList = ref([]);
  const inProgressTasksList = ref([]);
  
  const selectedCategory = ref(null);

  onMounted(async () => {
      try {
        const data = await getTasksCount();

        tasksCreatedToday.value = data.tasksCreatedToday.created_count;
        doneTasks.value = data.doneTasks.done_count;
        suspendedTasks.value = data.suspendedTasks.suspended_count;
        inProgressTasks.value = data.inProgressTasks.inprogress_count;

        createdTasksList.value = data.tasksCreatedToday.created_tasks;
        doneTasksList.value = data.doneTasks.done_tasks;
        suspendedTasksList.value = data.suspendedTasks.suspended_tasks;
        inProgressTasksList.value = data.inProgressTasks.inprogress_tasks;

      } catch (error) {
        console.error("Error fetching task counts:", error);
      }
  });

  const toggleDropdown = (category) => {
    if (selectedCategory.value === category) {
      selectedCategory.value = null; // Hide the dropdown if the same category is clicked
    } else {
      selectedCategory.value = category; // Show the dropdown for the selected category
    }
  };

  const beforeEnter = (el) => {
    el.style.height = '0px';
  };

  const enter = (el) => {
    el.offsetHeight; // trigger reflow
    el.style.transition = 'height 0.3s ease-in-out';
    el.style.height = 'auto';
  };

  const leave = (el) => {
    el.style.transition = 'height 0.3s ease-in-out';
    el.style.height = '0px';
  };
</script>

<style scoped>
  .task-dropdown {
    overflow: hidden;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease-in-out;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }

  .task-table {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 5 equal columns */
  gap: 16px;
}

.task-row {
  display: contents; /* Makes each row use the column layout */
}

.task-column {
  padding: 8px;
  text-align: left;
}

.task-row.header {
  font-weight: bold;
}

.task-column a {
  color: blue;
  text-decoration: none;
  margin-right: 8px;
}

</style>
