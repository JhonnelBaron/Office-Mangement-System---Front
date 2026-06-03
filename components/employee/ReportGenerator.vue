<template>
  <div>
    <!-- Print AR trigger -->
    <button class="btn-print" @click="validateBeforePrint">
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11.5c.07 0 .14-.007.207-.021.095.014.193.021.293.021h2a2 2 0 0 0 2-2V7a1 1 0 0 0-1-1h-1a1 1 0 1 0 0 2v11h-2V5a2 2 0 0 0-2-2H5Zm7 4a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2H13a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2H13a1 1 0 0 1-1-1Zm-6 4a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1ZM7 6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H7Zm1 3V8h1v1H8Z" clip-rule="evenodd"/>
      </svg>
      Print AR
    </button>

    <!-- Missing Data Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="cancelModal">
        <div class="modal-panel">

          <div class="modal-header">
            <div class="modal-header-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="modal-title">Missing task data</h3>
              <p class="modal-sub">Provide a reason for each day with no logged tasks before printing.</p>
            </div>
          </div>

          <div class="modal-body">
            <table class="reasons-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(entry, index) in missingDates" :key="index">
                  <td class="cell-date">{{ entry.date }}</td>
                  <td class="cell-day">{{ entry.day }}</td>
                  <td class="cell-reason">
                    <div class="reason-pills">
                      <label
                        v-for="opt in reasonOptions"
                        :key="opt.value"
                        class="reason-pill"
                        :class="{ 'reason-pill--selected': entry.reason === opt.value }"
                      >
                        <input
                          v-model="entry.reason"
                          type="radio"
                          :name="'reason-' + index"
                          :value="opt.value"
                        />
                        {{ opt.label }}
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="modal-footer">
            <button class="btn-danger" @click="cancelModal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Cancel
            </button>
            <button class="btn-confirm" @click="confirmReasons">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              Confirm reasons
            </button>
          </div>

        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* ── Print button ── */
.btn-print {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
}
.btn-print:hover {
  background: #f1f5f9;
  color: #1e293b;
  border-color: #cbd5e1;
}

/* ── Modal overlay ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 16px;
}

/* ── Modal panel ── */
.modal-panel {
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.15);
  overflow: hidden;
}

/* ── Modal header ── */
.modal-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafbfe;
}
.modal-header-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d97706;
  flex-shrink: 0;
  margin-top: 1px;
}
.modal-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 3px;
}
.modal-sub {
  font-size: 12.5px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.5;
}

/* ── Table ── */
.modal-body {
  padding: 16px 24px;
}
.reasons-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.reasons-table thead th {
  text-align: left;
  padding: 0 12px 10px 0;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
}
.reasons-table tbody tr {
  border-top: 1px solid #f1f5f9;
}
.cell-date {
  padding: 12px 16px 12px 0;
  color: #1e293b;
  font-weight: 600;
  white-space: nowrap;
}
.cell-day {
  padding: 12px 16px 12px 0;
  color: #64748b;
  white-space: nowrap;
}
.cell-reason {
  padding: 12px 0;
}

/* ── Reason pills ── */
.reason-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.reason-pill {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}
.reason-pill input[type="radio"] {
  display: none;
}
.reason-pill:hover {
  border-color: #cbd5e1;
  color: #334155;
  background: #f8fafc;
}
.reason-pill--selected {
  background: #f0fdf4;
  border-color: #86efac;
  color: #15803d;
  font-weight: 600;
}

/* ── Modal footer ── */
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px 18px;
  border-top: 1px solid #f1f5f9;
}
.btn-danger,
.btn-confirm {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}
.btn-danger {
  background: #fff5f5;
  color: #dc2626;
  border-color: #fecaca;
}
.btn-danger:hover {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
}
.btn-confirm {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}
.btn-confirm:hover {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}
</style>
<script setup>
import { ref, defineProps, computed } from "vue";
import { getUser } from "~/services/taskService";

const props = defineProps({
  tasks: Array,
  cutoffDateRange: Object,
  selectedCutoff: String,
});
const reasonOptions = [
  { value: 'HOLIDAY', label: 'Holiday' },
  { value: 'WORK SUSPENDED', label: 'Work suspended' },
  { value: 'ABSENT', label: 'Absent' },
  { value: 'REST DAY', label: 'Rest day' },
];

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
      // May aktwal na tasks
      dateObj.descriptions = groupedTasks[dateObj.date];
    } else if (missingDates.value.some(m => m.date === dateObj.date)) {
      // May piniling dahilan sa modal (Holiday, Absent, Work Suspended)
      const missingEntry = missingDates.value.find(m => m.date === dateObj.date);
      dateObj.missingReason = missingEntry.reason ? `${missingEntry.reason}` : "No reason provided";
    } else if (dateObj.day === 'Saturday' || dateObj.day === 'Sunday') {
      // Katutubong katapusan ng linggo (Weekend Rest Day)
      dateObj.descriptions = [{ isRestDay: true }];
    }
  });

  const tasksArray = Object.values(groupedTasks);

  printWindow.document.write(
    `<html>
      <head>
        <title>Accomplishment Report</title>
        <style>
          body {
            font-family: "Times New Roman", Times, serif;
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
            background-color: #cfe2f3 !important;
          }
          td.date, td.day {
            text-align: center;
          }
          th.date, th.day{
            text-align: center;
            width: 25px;
            background-color: #cfe2f3;
          }
          /* Pinag-isa ang disenyo para sa Rest Day at iba pang exception reasons */
          .rest-day, .missing-reason {
            text-align: center;
            text-transform: uppercase;
            font-weight: bold;
          }
          ul {
            margin: 4px 0;
            padding-left: 50px;
          }
          li {
            margin-bottom: 2px;
          }
          .submit{
            margin-right: 162.5px;
          }
          .rsc{
            margin-right: 10px;
            font-weight: bold;
            text-transform: uppercase;
            border-top: 1px solid #666;
            padding-top: 5px;
            margin-top: 55px;
          }
          .ed{
            margin-right: 2px;
            font-weight: normal;
            text-transform: none;
          }
          .name{
            text-align: left;
            font-weight: bold;
            text-transform: uppercase;
            border-top: 1px solid #666;
            padding-top: 5px;
            margin-top: 55px;
          }
          .position{
            text-align: left;
            font-weight: normal;
            text-transform: none;
          }
          .prep{
            text-align: left;
          }
          @media print {
            thead {
              display: table-row-group;
            }
            th.act, th.range, th.date, th.day {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        </style>
      </head>
      <body>
        <h1>2026 ACCOMPLISHMENT REPORT</h1>
        <table>
          <thead>
            <tr>
              <th class="range" colspan="2">${cutoffDisplay.value}, 2026</th>
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
                (group) => `
                <tr>
                  <td class="date">${group.date}</td>
                  <td class="day">${group.day}</td>
                  <td>
                    ${
                      // KASO A: Kung ito ay minarkahang Rest Day mula sa weekend check
                      group.descriptions.length === 1 && group.descriptions[0].isRestDay
                        ? `<div class="rest-day">REST DAY</div>`
                        
                        // KASO B: Kung ito ay may piniling Exception Reason (Work Suspended, Absent, Holiday)
                        : group.missingReason
                        ? `<div class="missing-reason">${group.missingReason}</div>`
                        
                        // KASO C: Kung may aktwal na mga listahan ng gawain (Ito rin ang nag-aayos sa kulang na </ul>)
                        : `<ul>
                            ${group.descriptions
                              .map((description) => `<li>${description}</li>`)
                              .join('')}
                           </ul>`
                    }
                  </td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
          <div class="prepared">
            <p class="prep">Prepared by:</p>
            <p class="name">${firstName.value} ${lastName.value}<br>
            <span class="position">Project Support Staff, ROMD</span></p>
          </div>
          <div>
            <p class="submit">Submitted to:</p>
            <p class="rsc">Rea M. Dalumpines <br><span class="ed"> Chief TESD Specialist, ROMD</span></p>
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
