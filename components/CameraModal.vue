<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h3 class="text-lg font-semibold mb-4">Capture Your Picture</h3>
      
      <!-- Show the video stream only if pictureTaken is false -->
      <video ref="video" v-if="!pictureTaken" autoplay playsinline class="w-full h-64 rounded-lg mb-4"></video>
      
      <!-- Only show the Capture Image button if no picture has been taken -->
      <button v-if="!pictureTaken" @click="capture" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
        Capture Image
      </button>

      <canvas ref="canvas" class="mt-4 max-w-full max-h-56 mx-auto"></canvas> <!-- Limit the size of the captured image -->

      <!-- Show the Retake button below the canvas after a picture has been taken -->
      <div v-if="pictureTaken" class="mt-4 flex flex-col items-center">
        <button @click="retake" class="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 mb-2">
          Retake
        </button>
        <button @click="savePicture" class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2'; // Import SweetAlert2

// Get the router instance
const router = useRouter();

// Emit for closing the modal
const emit = defineEmits();

// Refs for video and canvas
const video = ref(null);
const canvas = ref(null);

// Flag to check if picture has been taken
const pictureTaken = ref(false);

// To store the video stream for stopping it later
let videoStream = null;

// Function to close modal
const closeModal = () => {
  emit('close');
  stopCamera(); // Stop the camera when the modal is closed
};

// Function to start the camera
const startCamera = () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoStream = stream; // Save the stream to stop it later
        video.value.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
        alert('Camera access is required to proceed.');
        closeModal();
      });
  }
};

// Function to stop the camera
const stopCamera = () => {
  if (videoStream) {
    const tracks = videoStream.getTracks();
    tracks.forEach(track => track.stop()); // Stop all tracks of the stream
  }
};

// Capture current frame from video
const capture = () => {
  const context = canvas.value.getContext('2d');
  canvas.value.width = 320; // Set width to a standard size
  canvas.value.height = 240; // Set height to a standard size
  context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
  pictureTaken.value = true; // Set the flag to true after capturing
  stopCamera(); // Stop the camera after capturing the image
};

// Retake the picture (reset the canvas and allow recapturing)
const retake = () => {
  pictureTaken.value = false; // Reset the flag for retake
  const context = canvas.value.getContext('2d');
  context.clearRect(0, 0, canvas.value.width, canvas.value.height); // Clear the canvas
  startCamera(); // Start the camera again
};

// Save the captured image
const savePicture = () => {
  const imageData = canvas.value.toDataURL('image/png'); // Encode the image in Base64
  console.log('Captured image data:', imageData);
  emit('savePicture', imageData); // Emit the captured image to the parent component
  Swal.fire({
    title: 'Success!',
    text: 'You have successfully time in.',
    icon: 'success',
    showConfirmButton: false,
    timer: 2000,
    // confirmButtonText: 'OK',
  }).then(() => {
    // Close the modal and clear fields (emit or update the parent component)
    // emit('clearFields'); // Emit an event to clear fields for email and password
    clearFields(); 
    closeModal();
  });
};

// Start camera when the component is mounted
onMounted(() => {
  startCamera();
});

const clearFields = () => {
  email.value = '';
  password.value = '';
};

</script>

<style scoped>
.video-container {
  width: 100%;
  height: auto;
}
</style>
