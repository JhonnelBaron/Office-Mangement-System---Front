<template>
  <div>
    <!-- Button to trigger printing -->
     <div class="flex items-center">
     <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11.5c.07 0 .14-.007.207-.021.095.014.193.021.293.021h2a2 2 0 0 0 2-2V7a1 1 0 0 0-1-1h-1a1 1 0 1 0 0 2v11h-2V5a2 2 0 0 0-2-2H5Zm7 4a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2H13a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2H13a1 1 0 0 1-1-1Zm-6 4a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1ZM7 6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H7Zm1 3V8h1v1H8Z" clip-rule="evenodd"/>
</svg>
    <button @click="validateBeforePrint" class="btn-print">
      Print AR
    </button>
  </div>

    <!-- Modal for Missing Data -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Missing Task Data</h2>
        <p>Please provide reasons for the missing data:</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in missingDates" :key="index">
              <td>{{ entry.date }}</td>
              <td>{{ entry.day }}</td>
              <td>
                <label class="custom-checkbox" :class="{ selected: entry.reason === 'HOLIDAY' }">
                  <input
                    type="radio"
                    :name="'reason-' + index"
                    value="HOLIDAY"
                    v-model="entry.reason"
                  />
                  Holiday
                </label>
                <label class="custom-checkbox" :class="{ selected: entry.reason === 'WORK SUSPENDED' }">
                  <input
                    type="radio"
                    :name="'reason-' + index"
                    value="WORK SUSPENDED"
                    v-model="entry.reason"
                  />
                  Work Suspended
                </label>
                <label class="custom-checkbox" :class="{ selected: entry.reason === 'ABSENT' }">
                  <input
                    type="radio"
                    :name="'reason-' + index"
                    value="ABSENT"
                    v-model="entry.reason"
                  />
                  Absent
                </label>
              </td>

            </tr>
          </tbody>
        </table>
        <div class="button-container">
    <button @click="cancelModal" class="btn-cancel">Cancel</button> <!-- Cancel Button -->
    <button @click="confirmReasons" class="btn-confirm">Confirm</button> <!-- Confirm Button -->
</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, computed } from "vue";
import axios from 'axios';
import { getUser } from "~/services/taskService";

const props = defineProps({
  tasks: Array,
  cutoffDateRange: Object,
  selectedCutoff: String,
});


const firstName = ref('');
const lastName = ref('');
const position = ref('');

const showModal = ref(false);
const missingDates = ref([]);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString(undefined, { day: "numeric" });
const getDayOfWeek = (dateString) =>
  new Date(dateString).toLocaleDateString(undefined, { weekday: "long" });

const validateBeforePrint = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  let startDate, endDate;
  switch (props.selectedCutoff) {
    case "previousCutoff1":
      startDate = new Date(currentYear, currentMonth - 1, 11);
      endDate = new Date(currentYear, currentMonth - 1, 25);
      break;
    case "previousCutoff2":
      startDate = new Date(currentYear, currentMonth - 1, 26);
      endDate = new Date(currentYear, currentMonth, 10);
      break;
    case "cutoff1":
      startDate = new Date(currentYear, currentMonth, 11);
      endDate = new Date(currentYear, currentMonth, 25);
      break;
    case "cutoff2":
      startDate = new Date(currentYear, currentMonth, 26);
      endDate = new Date(currentYear, currentMonth + 1, 10);
      break;
    default:
      return;
  }

  const allDates = [];
  while (startDate <= endDate) {
    if (startDate.getDay() !== 0 && startDate.getDay() !== 6) {
      // Skip weekends
      allDates.push({
        date: formatDate(startDate.toISOString()),
        day: getDayOfWeek(startDate.toISOString()),
        reason: null, // Placeholder for reasons
      });
    }
    startDate.setDate(startDate.getDate() + 1);
  }

  const groupedTasks = props.tasks.reduce((acc, task) => {
    const dateKey = formatDate(task.date_added);
    acc[dateKey] = true;
    return acc;
  }, {});

  missingDates.value = allDates.filter(
    (dateObj) => !groupedTasks[dateObj.date]
  );

  if (missingDates.value.length > 0) {
    showModal.value = true;
  } else {
    printReport();
  }
};

onMounted(async () => {
  try {
    const response = await getUser();
    firstName.value = response.first_name;
    lastName.value = response.last_name;
    position.value = response.position;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
});


const confirmReasons = () => {
  const unresolved = missingDates.value.some((entry) => !entry.reason);
  if (unresolved) {
    alert("Please select a reason for all missing dates.");
    return;
  }
  showModal.value = false;
  printReport();
};

const cancelModal = () => {
  showModal.value = false; // Close the modal without saving anything
};

const printReport = () => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');

  if (!printWindow) {
    alert('Unable to open print window. Please check your browser settings.');
    return;
  }

  // Get start and end dates for the selected cutoff
  let startDate, endDate;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  switch (props.selectedCutoff) {
    case 'previousCutoff1':
      startDate = new Date(currentYear, currentMonth - 1, 11);
      endDate = new Date(currentYear, currentMonth - 1, 25);
      break;
    case 'previousCutoff2':
      startDate = new Date(currentYear, currentMonth - 1, 26);
      endDate = new Date(currentYear, currentMonth, 10);
      break;
    case 'cutoff1':
      startDate = new Date(currentYear, currentMonth, 11);
      endDate = new Date(currentYear, currentMonth, 25);
      break;
    case 'cutoff2':
      startDate = new Date(currentYear, currentMonth, 26);
      endDate = new Date(currentYear, currentMonth + 1, 10);
      break;
    default:
      return;
  }

  const cutoffDisplay = computed(() => {
  switch (props.selectedCutoff) {
    case 'previousCutoff1':
      return `${props.cutoffDateRange.previousCutoff1.previousMonth} 11-25`;
    case 'previousCutoff2':
      return `${props.cutoffDateRange.previousCutoff2.previousMonth} 26 - ${props.cutoffDateRange.previousCutoff2.currentMonth} 10`;
    case 'cutoff1':
      return `${props.cutoffDateRange.cutoff1.currentMonth} 11-25`;
    case 'cutoff2':
      return `${props.cutoffDateRange.cutoff2.currentMonth} 26 - ${props.cutoffDateRange.cutoff2.nextMonth} 10`;
    default:
      return '';
  }
});
          // <p class="submit">Submitted to:</p>

        // <p class="line">_______________________</p>
        // <p class="rsc">Rosalina S. Constantino <br><span class="ed"> Executive Director</span></p>
  // Generate all dates in the range
  const allDates = [];
  while (startDate <= endDate) {
    allDates.push({
      date: formatDate(startDate.toISOString()),
      day: getDayOfWeek(startDate.toISOString()),
      descriptions: [], // Placeholder for tasks
      missingReason: "", // Placeholder for reasons
    });
    startDate.setDate(startDate.getDate() + 1);
  }

  // Group tasks by date
  const groupedTasks = props.tasks.reduce((acc, task) => {
    const dateKey = formatDate(task.date_added);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(task.description);
    return acc;
  }, {});

  // Add the missing data reasons to the dates
  allDates.forEach((dateObj) => {
    if (groupedTasks[dateObj.date]) {
      dateObj.descriptions = groupedTasks[dateObj.date];
    } else if (missingDates.value.some(m => m.date === dateObj.date)) {
      const missingEntry = missingDates.value.find(m => m.date === dateObj.date);
      dateObj.missingReason = missingEntry.reason ? `${missingEntry.reason}` : "No reason provided";
    } else if (dateObj.day === 'Saturday' || dateObj.day === 'Sunday') {
      // Add "REST DAY" for weekends with no tasks
      dateObj.descriptions = [{ isRestDay: true }];
    }
  });

  const tasksArray = Object.values(groupedTasks);

  // Ensure the document is opened, write content and trigger print
  printWindow.document.write(
    `<html>
      <head>
        <title>Accomplishment Report</title>
        <style>
          body {
            font-family: Times new roman, sans-serif;
            margin: 20px;
          }
          h1 {
            text-align: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #000;
            padding: 4px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          th.act, th.range{
            text-align: center;
            background-color: #cfe2f3; !important;
          }
          td.date, td.day {
            text-align: center;
          }
          th.date, th.day{
            text-align: center;
            width: 25px;
            background-color: #cfe2f3;
          }
          p {
            text-align: right;
          }
          .rest-day {
          text-align: center;
            font-style: italic;
            text-transform: uppercase;
            margin-left: 40px;
          }
          .missing-reason {
          text-align: center;
            font-style: italic;
            text-transform: uppercase;
          }
            .submit{
              margin-right: 162.5px;
            }
            // .line1{
            //     border-bottom: 1px solid #000;
            //       margin: 0;

            // }
            // .line2{
            //     border-bottom: 1px solid #000;
            // }
            .rsc{
              margin-right: 26px;
              font-weight: bold;
              text-transform: uppercase;
              border-top: 1px solid #666;
              padding-top: 5px;
              margin-top: 55px;
            }
            .ed{
              margin-right: 46px;
              font-weight: normal;
              text-transform: none;
            }
            .name{
              text-align: left ;
              font-weight: bold;
              text-transform: uppercase;
              border-top: 1px solid #666;
              padding-top: 5px;
              margin-top: 55px;
            }
            .position{
              text-align: left ;
              font-weight: normal;
              text-transform: none;

            }
            .prep{
              text-align:left;
            }
        @media print {
          thead {
            display: table-row-group; /* Keeps the header visible only on the first page */
          }
        </style>
      </head>
      <body>
        <h1>2025 ACCOMPLISHMENT REPORT</h1>
        <table>
          <thead>
            <tr>
              <th class="range" colspan="2">${cutoffDisplay.value}, 2025</th>
              <th class="act" rowspan="2">ACTIVITIES/MEETINGS</th>
            </tr>
            <tr>
              <th class="date">DATE</th>
              <th class="day">DAY</th>
            </tr>
          </thead>
          <tbody>
            ${allDates
              .map(
                (group) => 
                `<tr>
                  <td class="date">${group.date}</td>
                  <td class="day">${group.day}</td>
                  <td>
                    ${
                      group.descriptions.length === 1 && group.descriptions[0].isRestDay
                        ? `<div class="rest-day">REST DAY</div>`
                        : `<ul>
                            ${group.descriptions
                              .map((description) => `<li>${description}</li>`)
                              .join('')}`
                    }
                    ${group.missingReason ? `<div class="missing-reason">${group.missingReason}</div>` : ""}
                  </td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
         <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <div class="prepared">
          <p class="prep">Prepared by:</p>
          <p class="line1"></p>
          <p class="name">${firstName.value} ${lastName.value}<br>
          <span class="position">Project Support Staff, ROMD</span></p>
        </div>
        <div>
          <p class="submit">Submitted to:</p>
          <p class="line2"></p>
          <p class="rsc">Rosalina S. Constantino <br><span class="ed"> Executive Director, ROMO</span></p>
        </div>
      </div>
      </body>
    </html>`
  );
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

</script>

<style scoped>

.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-cancel {
  background-color: #d92c2c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
}

.btn-cancel:hover {
  background-color: #931a1a;
}

.custom-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  transition: all 0.2s ease;
}

.custom-checkbox input[type="radio"] {
  display: none;
}

.custom-checkbox.selected {
  border-color: #28a745;
  background-color: #d4edda;
  color: #155724;
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.btn-confirm {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
}

.btn-confirm:hover {
  background-color: #0056b3;
}

.btn-print {
  /* background-color: #4CAF50; */
  color: rgb(66, 51, 51);
  padding: 20px 2px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
/* .btn-print:hover {
  background-color: #45a049;
} */

.button-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

</style>
