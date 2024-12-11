<template>
    <div class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Capture Your Picture</h3>
        
        <video ref="video" autoplay playsinline class="w-full h-64 rounded-lg mb-4"></video>
        
        <button @click="capture" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Capture Image
        </button>
        
        <canvas ref="canvas" class="mt-4"></canvas>
        
        <div class="mt-4 flex justify-between">
          <button @click="closeModal" class="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700">Cancel</button>
          <button @click="savePicture" class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">Save</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  // Get the router instance
  const router = useRouter();
  
  // Emit for closing the modal
  const emit = defineEmits();
  
  // Refs for video and canvas
  const video = ref(null);
  const canvas = ref(null);
  
  // Function to close modal
  const closeModal = () => {
    emit('close');
  };
  
  // Function to start the camera
  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          video.value.srcObject = stream;
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
          alert('Camera access is required to proceed.');
          closeModal();
        });
    }
  };
  
  // Capture current frame from video
  const capture = () => {
    const context = canvas.value.getContext('2d');
    canvas.value.width = video.value.videoWidth;
    canvas.value.height = video.value.videoHeight;
    context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
  };
  
  // Save the captured image
  const savePicture = () => {
    const imageData = canvas.value.toDataURL();
    console.log('Captured image data:', imageData); // Save or send this data to the server
  
    // Proceed with redirection after picture is saved
    router.push('/login'); // Adjust this to your correct route
    closeModal();
  };
  
  // Start camera when the component is mounted
  onMounted(() => {
    startCamera();
  });
  </script>
  
  <style scoped>
  .video-container {
    width: 100%;
    height: auto;
  }
  </style>
  