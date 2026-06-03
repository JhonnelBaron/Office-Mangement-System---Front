<template>
  <div class="tasking-page">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="header-left">
        <div class="page-title-group">
          <div class="page-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
          <div>
            <h1 class="page-title">Tasking</h1>
            <p class="page-subtitle">Manage and track your official accomplishments.</p>
          </div>
        </div>
      </div>

      <div class="header-right">
        <div class="date-chip">
          <span class="live-dot"></span>
          <span>Today: {{ formatDate(new Date()) }}</span>
        </div>
        <div class="hover-lift">
          <ReportGenerator
            :tasks="filteredTasks"
            :cutoff-date-range="cutoffDateRange"
            :selected-cutoff="selectedCutoff"
          />
        </div>
        <button
          class="add-task-btn"
          :class="{ 'add-task-btn--disabled': hasInProgressTask }"
          :disabled="hasInProgressTask"
          @click="handleAddTaskClick"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Add Task</span>
        </button>
      </div>
    </div>

    <!-- ── Filters Bar ── -->
    <div class="filters-bar">
      <div class="filter-controls">
        <div class="filter-group">
          <label class="filter-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Tasks for:
          </label>
          <input
            v-model="filterDate"
            type="date"
            class="filter-input"
            @change="updateFilteredTasks"
          />
        </div>

        <div class="filter-divider"></div>

        <div class="filter-group">
          <label class="filter-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Cutoff Period:
          </label>
          <select
            v-model="selectedCutoff"
            class="filter-select"
            @change="filterTasks('cutoff')"
          >
            <option value="previousCutoff1">{{ cutoffDateRange.previousCutoff1.previousMonth }} 11–25</option>
            <option value="previousCutoff2">{{ cutoffDateRange.previousCutoff2.previousMonth }} 26 – {{ cutoffDateRange.previousCutoff2.currentMonth }} 10</option>
            <option value="cutoff1">{{ cutoffDateRange.cutoff1.currentMonth }} 11–25</option>
            <option value="cutoff2">{{ cutoffDateRange.cutoff2.currentMonth }} 26 – {{ cutoffDateRange.cutoff2.nextMonth }} 10</option>
          </select>
        </div>
      </div>

      <div class="sla-legend">
        <div class="sla-badges">
          <span class="sla-badge sla-badge--watch">
            <span class="sla-dot"></span>1 Day Pending
          </span>
          <span class="sla-badge sla-badge--warning">
            <span class="sla-dot"></span>2 Days Pending
          </span>
          <span class="sla-badge sla-badge--critical">
            <span class="sla-dot"></span>3+ Days Pending
          </span>
        </div>
      </div>
    </div>

    <!-- ── Task List ── -->
    <div class="task-list-section">
      <TaskList :tasks="filteredTasks" @update-tasks="handleTaskUpdate" />
    </div>

    <!-- ── Add Task Modal ── -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-panel">

          <div class="modal-header">
            <div class="modal-header-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <div>
              <h3 class="modal-title">Add New Task Entry</h3>
              <p class="modal-sub">Create a complete record of your task accomplishment.</p>
            </div>
            <button class="modal-close" @click="closeModal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form @submit.prevent="addTask" class="modal-body">
            <div class="form-grid">

              <!-- Left Column -->
              <div class="form-col">
                <div class="form-group">
                  <label class="form-label">PAPs Category</label>
                  <select v-model="newTaskPaps" class="form-select">
                    <option value="Program">Program</option>
                    <option value="Activities">Activities</option>
                    <option value="Projects">Projects</option>
                    <option value="Routeslips">Routeslips</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Subject Heading</label>
                  <input
                    v-model="newTaskTitle"
                    class="form-input"
                    placeholder="e.g., MOA Review, General Cleaning"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Document Classification</label>
                  <select v-model="newTaskType" class="form-select">
                    <option value="CSW">CSW — Complete Staff Work</option>
                    <option value="Memo">Memo</option>
                    <option value="MOA">MOA</option>
                    <option value="Letter">Letter</option>
                    <option value="MoM">Minutes of Meeting</option>
                    <option value="Email">Email</option>
                    <option value="Others">Others</option>
                  </select>
                  <div v-if="newTaskType === 'Others'" class="mt-2">
                    <input v-model="newTaskOtherType" class="form-input" placeholder="Specify document type" />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Task Description / Action Taken</label>
                  <textarea
                    v-model="newTaskDescription"
                    class="form-textarea"
                    placeholder="Describe the work done clearly and completely..."
                    rows="5"
                    required
                  />
                </div>
              </div>

              <!-- Right Column -->
              <div class="form-col">
                <div class="form-group">
                  <label class="form-label">Volume <span class="label-sub">(No. of Documents)</span></label>
                  <input
                    v-model="newTaskNoOfDocuments"
                    type="number"
                    min="0"
                    class="form-input"
                    placeholder="0"
                    required
                  />
                </div>

                <div v-if="newTaskNoOfDocuments > 0" class="form-group">
                  <label class="form-label">Attachment Link References</label>
                  <div class="doc-links-container">
                    <div
                      v-for="n in newTaskNoOfDocuments"
                      :key="n"
                      class="doc-link-row"
                    >
                      <span class="doc-link-num">#{{ n }}</span>
                      <div class="doc-link-input-group">
                        <span class="doc-link-label">Reference Link</span>
                        <input
                          v-model="newTaskDocumentLinks[n-1]"
                          type="url"
                          class="form-input form-input--sm"
                          placeholder="https://sharepoint.com/file-link"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="doc-empty-hint">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                  </svg>
                  <p>Set volume above to add reference links for each document.</p>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn-primary" :disabled="isSubmitting">
                <svg v-if="!isSubmitting" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                <svg v-else class="spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40" stroke-dashoffset="10" stroke-linecap="round"/>
                </svg>
                <span>{{ isSubmitting ? 'Saving...' : 'Save Entry' }}</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive, computed } from 'vue';
import TaskList from '@/components/TaskList.vue';
import ReportGenerator from '@/components/employee/ReportGenerator.vue';
import { addTask as addTaskService, getTasks } from '@/services/taskService';
import Swal from 'sweetalert2';

definePageMeta({ layout: 'employee' });

const taskData = ref([]);
const filteredTasks = ref([]);
const currentDate = new Date().toLocaleDateString('en-CA');
const filterDate = ref(currentDate);
const showModal = ref(false);
const newTaskTitle = ref('');
const newTaskDescription = ref('');
const newTaskLink = ref('');
const newTaskPaps = ref('Program');
const newTaskType = ref('CSW');
const newTaskOtherType = ref('');
const newTaskStatus = ref('Draft');
const newTaskOtherStatus = ref('');
const newTaskNoOfDocuments = ref(0);
const newTaskDocumentLinks = ref([]);
const isSubmitting = ref(false);

const getMonthName = (monthIndex) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[monthIndex];
};

const cutoffDateRange = reactive({
  cutoff1: {
    start: 11, end: 25,
    currentMonth: getMonthName(new Date().getMonth()),
  },
  cutoff2: {
    start: 26, end: 10,
    currentMonth: getMonthName(new Date().getMonth()),
    nextMonth: getMonthName((new Date().getMonth() + 1) % 12),
  },
  previousCutoff1: {
    start: 11, end: 25,
    previousMonth: getMonthName((new Date().getMonth() - 1 + 12) % 12),
  },
  previousCutoff2: {
    start: 26, end: 10,
    previousMonth: getMonthName((new Date().getMonth() - 1 + 12) % 12),
    currentMonth: getMonthName(new Date().getMonth()),
  },
});

const selectedCutoff = ref('');

const determineDefaultCutoff = () => {
  const day = new Date().getDate();
  if (day >= 11 && day <= 25) selectedCutoff.value = 'cutoff1';
  else if (day >= 26) selectedCutoff.value = 'cutoff2';
  else if (day <= 10) selectedCutoff.value = 'previousCutoff2';
  else selectedCutoff.value = 'previousCutoff1';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

const filterTasks = (filterType) => {
  const today = new Date();
  filteredTasks.value = taskData.value.filter((task) => {
    const taskDate = new Date(task.date_added);
    if (filterType === 'cutoff') {
      if (selectedCutoff.value === 'cutoff1') return taskDate.getDate() >= 11 && taskDate.getDate() <= 25 && taskDate.getMonth() === today.getMonth();
      if (selectedCutoff.value === 'cutoff2') return (taskDate.getDate() >= 26 && taskDate.getMonth() === today.getMonth()) || (taskDate.getDate() <= 10 && taskDate.getMonth() === (today.getMonth() + 1) % 12);
      if (selectedCutoff.value === 'previousCutoff1') return taskDate.getDate() >= 11 && taskDate.getDate() <= 25 && taskDate.getMonth() === (today.getMonth() - 1 + 12) % 12;
      if (selectedCutoff.value === 'previousCutoff2') return (taskDate.getDate() >= 26 && taskDate.getMonth() === (today.getMonth() - 1 + 12) % 12) || (taskDate.getDate() <= 10 && taskDate.getMonth() === today.getMonth());
    }
    return false;
  });
};

const updateFilteredTasks = () => {
  selectedCutoff.value = '';
  if (!filterDate.value) { filteredTasks.value = taskData.value; return; }
  filteredTasks.value = taskData.value.filter((task) => {
    if (!task.date_added) return false;
    const d = new Date(task.date_added);
    const taskLocalDateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    return taskLocalDateStr === filterDate.value;
  });
};

const fetchTasks = async () => {
  try {
    const tasks = await getTasks();
    taskData.value = tasks;
    filterTasks('cutoff');
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

const handleTaskUpdate = async () => {
  await fetchTasks();
};

const openModal = () => { showModal.value = true; };
const closeModal = () => { showModal.value = false; resetTaskFields(); };

const resetTaskFields = () => {
  newTaskTitle.value = '';
  newTaskDescription.value = '';
  newTaskLink.value = '';
  newTaskPaps.value = 'Program';
  newTaskType.value = 'CSW';
  newTaskOtherType.value = '';
  newTaskStatus.value = 'Draft';
  newTaskOtherStatus.value = '';
  newTaskNoOfDocuments.value = 0;
  newTaskDocumentLinks.value = [];
};

const addTask = async () => {
  const finalTaskType = newTaskType.value === "Others" ? newTaskOtherType.value : newTaskType.value;
  const finalTaskStatus = newTaskStatus.value === "Others" ? newTaskOtherStatus.value : newTaskStatus.value;
  const task = {
    title: newTaskTitle.value,
    description: newTaskDescription.value,
    link: newTaskLink.value || null,
    paps: newTaskPaps.value,
    type: finalTaskType,
    task: finalTaskStatus,
    no_of_document: newTaskNoOfDocuments.value,
    document_links: newTaskDocumentLinks.value,
  };
  isSubmitting.value = true;
  try {
    await addTaskService(task);
    Swal.fire({ icon: 'success', title: 'Task Added!', text: 'Your task has been logged successfully.', timer: 2000, showConfirmButton: false });
    resetTaskFields();
    await fetchTasks();
    closeModal();
  } catch (error) {
    console.error('Error adding task:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const hasInProgressTask = computed(() => filteredTasks.value.some((task) => task.status === "In Progress"));

const handleAddTaskClick = () => {
  if (hasInProgressTask.value) {
    Swal.fire({ icon: "warning", title: "Ongoing Task", text: "Please finish your current in-progress task before adding a new one." });
  } else {
    openModal();
  }
};

onMounted(() => {
  determineDefaultCutoff();
  setInterval(determineDefaultCutoff, 24 * 60 * 60 * 1000);
});

onMounted(async () => {
  await fetchTasks();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.tasking-page {
  padding: 28px 32px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Page Header ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e8ecf4;
}
.header-left {}
.page-title-group {
  display: flex;
  align-items: center;
  gap: 14px;
}
.page-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
}
.page-title {
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.5px;
  line-height: 1.2;
}
.page-subtitle {
  font-size: 13px;
  color: #94a3b8;
  margin: 3px 0 0;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.date-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}
.live-dot {
  width: 7px;
  height: 7px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
  50% { opacity: 0.8; box-shadow: 0 0 0 5px rgba(34, 197, 94, 0); }
}


.add-task-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
  transition: all 0.2s ease;
}
.add-task-btn:hover:not(.add-task-btn--disabled) {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
  transform: translateY(-1px);
}
.add-task-btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Filters Bar ── */
.filters-bar {
  background: #ffffff;
  border: 1px solid #e8ecf4;
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
}
.filter-controls {
  display: flex;
  align-items: center;
  gap: 0;
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.filter-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}
.filter-input,
.filter-select {
  padding: 7px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  font-size: 12.5px;
  font-family: inherit;
  font-weight: 600;
  color: #1e293b;
  background: #f8fafc;
  outline: none;
  cursor: pointer;
  transition: all 0.15s;
}
.filter-input:focus,
.filter-select:focus {
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.filter-divider {
  width: 1px;
  height: 28px;
  background: #e8ecf4;
  margin: 0 16px;
}
.sla-legend {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.sla-label {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #94a3b8;
}
.sla-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.sla-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid transparent;
}
.sla-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.sla-badge--watch   { background: #fffbeb; color: #d97706; border-color: #fde68a; }
.sla-badge--warning { background: #fff7ed; color: #ea580c; border-color: #fed7aa; }
.sla-badge--critical{ background: #fff1f2; color: #e11d48; border-color: #fecdd3; }

/* ── Task List Section ── */
.task-list-section {}

/* ── Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(6px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.modal-panel {
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 880px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.2);
}
.modal-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafbfe;
  border-radius: 20px 20px 0 0;
  position: sticky;
  top: 0;
  z-index: 1;
}
.modal-header-icon {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
}
.modal-title {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}
.modal-sub {
  font-size: 12px;
  color: #94a3b8;
  margin: 2px 0 0;
}
.modal-close {
  margin-left: auto;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  flex-shrink: 0;
  transition: all 0.15s;
}
.modal-close:hover { background: #fee2e2; color: #dc2626; border-color: #fecaca; }

.modal-body {
  padding: 20px 24px 0;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
@media (max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
}
.form-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
}
.label-sub {
  font-size: 10px;
  font-weight: 500;
  text-transform: none;
  color: #94a3b8;
  letter-spacing: 0;
}
.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 9px 13px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13px;
  font-family: inherit;
  color: #1e293b;
  background: #f8fafc;
  outline: none;
  transition: all 0.15s;
  box-sizing: border-box;
}
.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}
.form-input--sm { padding: 7px 10px; font-size: 12px; }
.form-textarea { resize: vertical; }
.mt-2 { margin-top: 8px; }

.doc-links-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 260px;
  overflow-y: auto;
  padding-right: 2px;
}
.doc-link-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e8ecf4;
  border-radius: 10px;
}
.doc-link-num {
  font-size: 11px;
  font-weight: 700;
  color: #2563eb;
  background: #dbeafe;
  padding: 3px 8px;
  border-radius: 6px;
  flex-shrink: 0;
  margin-top: 1px;
}
.doc-link-input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.doc-link-label {
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.doc-empty-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 32px 16px;
  background: #f8fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  color: #94a3b8;
  gap: 8px;
}
.doc-empty-hint p {
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 16px 24px 20px;
  border-top: 1px solid #f1f5f9;
  margin-top: 20px;
  position: sticky;
  bottom: 0;
  background: white;
  border-radius: 0 0 20px 20px;
}
.btn-cancel {
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #64748b;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.btn-cancel:hover { background: #f1f5f9; color: #1e293b; }
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 22px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
  transition: all 0.2s ease;
}
.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
  transform: translateY(-1px);
}
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

@keyframes spin {
  to { transform: rotate(360deg); }
}
.spin {
  animation: spin 0.75s linear infinite;
}
</style>