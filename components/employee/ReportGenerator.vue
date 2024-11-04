<template>
  <div>
    <!-- Button to trigger printing -->
    <button @click="printReport" class="btn-print">
      Print Accomplishment Report
    </button>
  </div>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';

const props = defineProps({
  tasks: Array,
  cutoffDateRange: Object,
  selectedCutoff: String, // Add selectedCutoff prop to receive from tasking.vue
});

// Utility function to format dates
const formatDate = (dateString) => {
  const options = { day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Utility function to get the day of the week
const getDayOfWeek = (dateString) => {
  const options = { weekday: 'long' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Computed property to get the cutoff display text
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

// Method to print the report
const printReport = () => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');

  // Sort tasks in ascending order by date
  const sortedTasks = props.tasks.sort(
    (a, b) => new Date(a.date_added) - new Date(b.date_added)
  );

  // Group tasks by date
  const groupedTasks = sortedTasks.reduce((acc, task) => {
    const dateKey = task.date_added.split(' ')[0];

    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: formatDate(task.date_added),
        day: getDayOfWeek(task.date_added),
        descriptions: [],
      };
    }
    acc[dateKey].descriptions.push(task.description);
    return acc;
  }, {});

  const tasksArray = Object.values(groupedTasks);

  printWindow.document.write(
    `<html>
      <head>
        <title>Accomplishment Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
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
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          td.date, td.day {
            text-align: center;
          }
          th.date, th.day{
            text-align: center;
            width: 25px;
            background-color: #cfe2f3;
          }
          th.act, th.range{
            text-align: center;
            background-color: #cfe2f3;
          }
          p {
            text-align: right;
          }
          span.ed{
            margin-right: 42px;
          }
        </style>
      </head>
      <body>
        <h1>2024 ACCOMPLISHMENT REPORT</h1>
        <table>
          <thead>
            <tr>
              <th class="range" colspan="2">${cutoffDisplay.value}</th>
              <th class="act" rowspan="2">ACTIVITIES/MEETINGS</th>
            </tr>
            <tr>
              <th class="date">DATE</th>
              <th class="day">DAY</th>
            </tr>
          </thead>
          <tbody>
            ${tasksArray
              .map(
                (group) => 
                `<tr>
                  <td class="date">${group.date}</td>
                  <td class="day">${group.day}</td>
                  <td>
                    <ul>
                      ${group.descriptions
                        .map((description) => `<li>${description}</li>`)
                        .join('')}
                    </ul>
                  </td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
        <p class="submit">submitted to</p>
        <br>
        <p>Rosalina S. Constantino <br><span class="ed"> Executive Director</span></p>
      </body>
    </html>`
  );
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};
</script>

<style scoped>
.btn-print {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-print:hover {
  background-color: #45a049;
}
</style>
