<template>
    <div class="modal">
      <div class="modal-content">
        <span class="close" @click="$emit('close')">&times;</span>
        <h3>Add Task for {{ selectedDate }}</h3>
        <input v-model="taskName" placeholder="Task Name" />
        <input v-model="taskDeadline" type="date" />
        <button @click="submitTask">Add Task</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    selectedDate: String // Pass selected date from the calendar
  });
  
  const taskName = ref('');
  const taskDeadline = ref('');
  
  // Emit the task data when adding
  const submitTask = () => {
    if (taskName.value && taskDeadline.value) {
      const task = {
        name: taskName.value,
        deadline: taskDeadline.value,
      };
      // Emit task data to parent
      emit('addTask', task);
      taskName.value = '';
      taskDeadline.value = '';
    }
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    position: relative;
    width: 300px;
  }
  
  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
  </style>
  