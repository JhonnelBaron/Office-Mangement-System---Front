<template>
  <div class="bg-gray-100 min-h-screen p-6">
    <div class="container mx-auto">
      <!-- Message for Tasks -->
      <div v-if="tasks.length" class="text-center text-gray-700 font-semibold mb-4">
        <p>Eto na nga pala yung ambag mo</p>
      </div>
      <!-- Task List Container -->
      <div v-if="tasks.length" class="space-y-4">
        <div
          v-for="task in tasks"
          :key="task.id"
          :class="taskBorderClass(task)"
          class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <!-- Task Title and Details Container -->
          <div class="flex justify-between items-start">
            <div class="flex-grow">
              <h3 class="text-xl font-semibold">{{ task.title }}</h3>
              <div class="text-gray-600 text-sm mt-2">
                <p v-if="task.description" class="mt-1">Subject: {{ task.description }}</p>
                <p v-if="task.link" class="mt-1">
                  Link:
                  <a :href="task.link" target="_blank" class="text-blue-600 hover:underline">
                    {{ shortenLink(task.link) }}
                  </a>
                </p>
                <p v-if="task.paps" class="mt-1">PAPs: {{ task.paps }}</p>
                <p v-if="task.type" class="mt-1">Document Type: {{ task.type }}</p>
                <!-- <p v-if="task.task" class="mt-1">Task: {{ task.task }}</p> -->
                <p v-if="task.no_of_documents" class="mt-1">Number of Documents: {{ task.no_of_documents }}</p>
<p v-if="task.document_links.length" class="mt-1">
  References:
  <ul>
    <li v-for="(doc, index) in task.document_links" :key="doc.id">
      <a :href="doc.document_link" target="_blank" class="text-blue-600 hover:underline">
        {{ shortenLink(doc.document_link) || `Document ${index + 1}` }}
      </a>
    </li>
  </ul>
</p>
                <br>
                <p>Added: {{ formatDate(task.date_added) }}</p>
                <p v-if="task.date_finished">Done: {{ formatDate(task.date_finished) }}</p>
                <p v-if="task.hours_worked">
                  Hours Worked:
                  <span v-if="Math.floor(task.hours_worked) > 0">
                    {{ Math.floor(task.hours_worked) }} hour<span v-if="Math.floor(task.hours_worked) > 1">s</span>
                  </span>
                  <span>
                    {{ ' ' + ((task.hours_worked - Math.floor(task.hours_worked)) * 60).toFixed(0) }} minutes
                  </span>
                </p>
              </div>
            </div>

            <!-- Task Status and Edit Button -->
            <div class="flex flex-col items-end ml-4">
              <span
                :class="{
                  'text-green-500': task.status === 'Done',
                  'text-green-500': task.status === 'Suspended',
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
        <p>Ayy.. wala ka pang ambag? :(</p>
        <br><p>baka namannn</p>
      </div>

      <!-- Edit Task Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
  <div class="bg-white p-6 rounded-lg w-full max-w-4xl">
    <h3 class="text-lg font-bold mb-4">Edit Task</h3>

    <!-- Two-column grid layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Column 1 -->
      <div>
        <!-- PAPs -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">PAPs</label>
          <select v-model="editedTask.paps" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="Program">Program</option>
            <option value="Activities">Activities</option>
            <option value="Projects">Projects</option>
          </select>
        </div>

        <!-- Title -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Task</label>
          <input v-model="editedTask.title" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter task (e.g. MOA Review)" />
        </div>

        <!-- Type -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Document Type</label>
          <select v-model="editedTask.type" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="CSW">CSW</option>
            <option value="Memo">Memo</option>
            <option value="MOA">MOA</option>
            <option value="Letter">Letter</option>
            <option value="MoM">MOM</option>
            <option value="Email">Email</option>
            <option value="Others">Others</option>
          </select>
          <div v-if="editedTask.type === 'Others'" class="mt-2">
            <input v-model="editedTask.otherType" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter document type">
          </div>
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Subject</label>
          <textarea v-model="editedTask.description" class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3" placeholder="Enter task description (e.g. MOA between TESDA & Philippine Army)" ></textarea>
        </div>

        <!-- Link -->
        <!-- <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Link</label>
          <input v-model="editedTask.link" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter task link" />
        </div> -->


      </div>

      <!-- Column 2 -->
      <div>
        <!-- Status -->
        <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Status</label>
        <select v-model="editedTask.status" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Suspended">Suspend</option>
        </select>
        </div>
        
        <div>
  <!-- Number of Documents -->
  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700">Number of Documents</label>
    <input 
      v-model="editedTask.no_of_document" 
      type="number" 
      min="0" 
      class="w-full px-3 py-2 border border-gray-300 rounded-md" 
      placeholder="Enter number of documents" 
      required 
    />
  </div>

  <!-- Document Links -->
  <div>
    <div v-for="n in editedTask.no_of_document" :key="n" class="mb-4">
      <label class="block text-sm font-medium text-gray-700">References {{ n }}</label>
      <input 
        v-model="editedTask.document_links[n - 1]" 
        type="url" 
        class="w-full px-3 py-2 border border-gray-300 rounded-md" 
        placeholder="Enter document link" 
      />
    </div>
  </div>
</div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end mt-6">
      <button @click="closeEditModal" class="text-gray-500 mr-4">Cancel</button>
      <button @click="updateTask" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Update</button>
    </div>
  </div>
</div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getTask as getTaskService, updateTask as updateTaskService } from '@/services/taskService';
import Swal from 'sweetalert2';

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['updateTasks']);
const showEditModal = ref(false);
const editedTask = ref({
  title: '',
  description: '',
  status: '',
  type: '',
  otherType: '',
  paps: '',
  no_of_documents: 0,
  link: '',
  document_links: [],
  hours_worked: 0,
  date_added: '',
  date_finished: ''
});

const formatDate = (dateString) => {
  if (!dateString) return 'Invalid Date';
  const date = new Date(dateString);
  if (isNaN(date)) return 'Invalid Date';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString(undefined, options);
};

const shortenLink = (link) => {
  if (!link) return null; // Handle null or undefined link
  const url = new URL(link);
  // Optional shortening logic based on pathname length
  return `${url.hostname}${url.pathname.length > 10 ? '/...' : url.pathname}`;
};


const editTask = async (task) => {
  try {
    // Fetch the task details by ID
    const response = await getTaskService(task.id);
    if (response.status === 200) {
      const data = response.data;

      const predefinedTypes = ['CSW', 'Memo', 'MOA', 'Letter', 'MoM', 'Email'];


      // Populate `editedTask` with the response data
      editedTask.value = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        type: predefinedTypes.includes(data.type) ? data.type : 'Others',
        otherType: predefinedTypes.includes(data.type) ? '' : data.type,
        paps: data.paps,
        no_of_document: data.no_of_document,
        document_links: data.document_links.map(linkObj => linkObj.document_link), // Handle array
        link: data.link || '', // Optional fields
        hours_worked: data.hours_worked || 0,
        date_added: data.date_added || '',
        date_finished: data.date_finished || '',
      };

      // Show the modal
      showEditModal.value = true;
    } else {
      console.error('Failed to fetch task details:', response);
    }
  } catch (error) {
    console.error('Error fetching task details:', error);
  }
};

const updateTask = async () => {
  try {
    // Ensure the document_links array has the same number of items as no_of_document
    editedTask.value.document_links = editedTask.value.document_links.slice(0, editedTask.value.no_of_document);

    // Format the document links for the payload
    const formattedDocumentLinks = editedTask.value.document_links.map((link) => ({
      document_link: link,
    }));
    // Prepare the payload for the API
    const payload = {
      ...editedTask.value,
      document_links: formattedDocumentLinks,
    };

    // Determine final type for payload
    const finalTaskType = editedTask.value.type === "Others" ? editedTask.value.otherType : editedTask.value.type;
    payload.type = finalTaskType;

    await updateTaskService(editedTask.value.id, payload);
    emit('updateTasks', editedTask.value);
    closeEditModal();
    Swal.fire({
      icon: 'success',
      title: 'Task Updated Successfully!',
      text: 'Your task has been updated successfully.',
      showConfirmButton: false,
      timer: 2000,
    });
  } catch (error) {
    // console.error("Failed to update the task:", error);
      Swal.fire({
        icon: 'error',
        title: 'Task Update Failed',
        text: error,  // Show the error message from backend
        showConfirmButton: false,
        timer: 2000,
      });
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
  editedTask.value = {};
};

const taskBorderClass = (task) => {
  const hoursSinceAdded = (new Date() - new Date(task.date_added)) / (1000 * 60 * 60);
  let borderColor = 'border-transparent';
  
  if (task.status !== 'Done') {
    if (hoursSinceAdded >= 72) {
      borderColor = 'border-red-500';
    } else if (hoursSinceAdded >= 48) {
      borderColor = 'border-orange-500';
    } else if (hoursSinceAdded >= 24) {
      borderColor = 'border-yellow-500';
    }
  }
  
  return `border-4 ${borderColor}`;
};

function addDocumentLink() {
  editedTask.value.document_links.push('');
}

function removeDocumentLink(index) {
  editedTask.value.document_links.splice(index, 1);
}

</script>

<style scoped>
/* Additional styles if needed */
</style>
