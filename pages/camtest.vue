<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="flex flex-col items-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Test Camera</h2>
  
        <!-- Video element to show camera feed -->
        <video ref="video" autoplay playsinline class="w-full max-w-sm border-2 rounded-lg"></video>
        
        <button @click="capture" class="bg-blue-600 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700">
          Capture Image
        </button>
  
        <canvas ref="canvas" class="mt-4"></canvas>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const video = ref(null);
  const canvas = ref(null);
  
  // Function to check camera availability and start video feed
  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.value.srcObject = stream;
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
          alert('Camera access failed.');
        });
    } else {
      alert('Camera not supported in this browser.');
    }
  };
  
  // Capture the current frame from the video
  const capture = () => {
    const context = canvas.value.getContext('2d');
    canvas.value.width = video.value.videoWidth;
    canvas.value.height = video.value.videoHeight;
    context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
  };
  
  onMounted(() => {
    startCamera();
  });
  </script>
  
  <style scoped>
  /* You can style this as needed */
  </style>
  