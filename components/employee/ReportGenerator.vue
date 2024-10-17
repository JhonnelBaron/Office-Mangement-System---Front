<template>
    <div>
      <!-- Button to trigger printing -->
      <button @click="printReport" class="btn-print">
        Print Accomplishment Report
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps } from 'vue';
  
  const props = defineProps({
    tasks: Array,
    cutoffDateRange: String,
  });
  
  // Utility function to format dates
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Utility function to get the day of the week
  const getDayOfWeek = (dateString) => {
    const options = { weekday: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Method to print the report
  const printReport = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
  
    // Sort tasks in ascending order by date
    const sortedTasks = props.tasks.sort((a, b) => new Date(a.date_added) - new Date(b.date_added));
  
    // Group tasks by date
    const groupedTasks = sortedTasks.reduce((acc, task) => {
      const dateKey = task.date_added; // Use the date as a key
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: formatDate(task.date_added),
          day: getDayOfWeek(task.date_added),
          descriptions: []
        };
      }
      acc[dateKey].descriptions.push(task.description); // Push task description into the grouped object
      return acc;
    }, {});
  
    // Convert grouped tasks into an array for rendering
    const tasksArray = Object.values(groupedTasks);
  
    printWindow.document.write(`
      <html>
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
          </style>
        </head>
        <body>
          <h1>2024 ACCOMPLISHMENT REPORT</h1>
          <table>
            <thead>
              <tr>
                <th colspan="2">${props.cutoffDateRange}</th>
                <th rowspan="2">ACTIVITIES/MEETINGS</th>
              </tr>
              <tr>
                <th>DATE</th>
                <th>DAY</th>
              </tr>
            </thead>
            <tbody>
              ${tasksArray
                .map(
                  (group) => `
                  <tr>
                    <td>${group.date}</td>
                    <td>${group.day}</td>
                    <td>
                      <ul>
                        ${group.descriptions
                          .map(description => `<li>${description}</li>`)
                          .join('')}
                      </ul>
                    </td>
                  </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
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
  