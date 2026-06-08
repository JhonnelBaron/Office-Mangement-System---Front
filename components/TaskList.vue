<template>
  <div class="task-list-root">

    <!-- Tasks Header Banner -->
    <div v-if="tasks.length" class="tasks-banner">
      <div class="banner-inner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>Your contributions for this period — keep it up!</span>
        <span class="task-count-badge">{{ tasks.length }} {{ tasks.length === 1 ? 'task' : 'tasks' }}</span>
      </div>
    </div>

    <!-- Task Cards -->
    <div v-if="tasks.length" class="tasks-grid">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="task-card"
        :class="taskSlaClass(task)"
      >
        <!-- Left accent bar (SLA color indicator) -->
        <div class="card-accent"></div>

        <div class="card-body">
          <!-- Top Row: Title + Status -->
          <div class="card-header">
            <div class="card-title-group">
              <h3 class="card-title">{{ task.title }}</h3>
              <div v-if="task.description" class="card-description">
                <span class="field-label">Task:</span> {{ task.description }}
              </div>
            </div>
            <div class="card-actions">
              <span class="status-badge" :class="statusClass(task.status)">
                <span class="status-dot"></span>
                {{ task.status }}
              </span>
              <button
                :disabled="task.status === 'Done'"
                class="edit-btn"
                :class="{ 'edit-btn--disabled': task.status === 'Done' }"
                @click="editTask(task)"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Edit
              </button>
            </div>
          </div>

          <!-- Tags Row -->
          <div class="card-tags">
            <span v-if="task.paps" class="tag tag--paps">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              {{ task.paps }}
            </span>
            <span v-if="task.type" class="tag tag--type">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              {{ task.type }}
            </span>
            <span v-if="task.no_of_documents" class="tag tag--vol">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              {{ task.no_of_documents }} doc{{ task.no_of_documents > 1 ? 's' : '' }}
            </span>
          </div>

          <!-- References -->
          <div v-if="task.document_links && task.document_links.length" class="card-references">
            <span class="field-label">References:</span>
            <ul class="ref-list">
              <li v-for="(doc, index) in task.document_links" :key="doc.id">
                <a :href="doc.document_link" target="_blank" class="ref-link">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  {{ shortenLink(doc.document_link) || `Document ${index + 1}` }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Footer Meta Row -->
          <div class="card-footer">
            <div class="meta-dates">
              <div class="meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span class="meta-label">Added:</span>
                <span class="meta-val">{{ formatDate(task.date_added) }}</span>
              </div>
              <div v-if="task.date_finished" class="meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="meta-label">Done:</span>
                <span class="meta-val">{{ formatDate(task.date_finished) }}</span>
              </div>
            </div>
            <div v-if="task.hours_worked" class="hours-pill">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>
                <span v-if="Math.floor(task.hours_worked) > 0">{{ Math.floor(task.hours_worked) }}h </span>{{ ((task.hours_worked - Math.floor(task.hours_worked)) * 60).toFixed(0) }}m worked
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      </div>
      <h3 class="empty-title">No tasks found</h3>
      <p class="empty-sub">No contributions logged for this period yet. Add your first task above.</p>
    </div>

    <!-- ── Edit Task Modal ── -->
    <Teleport to="body">
      <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
        <div class="modal-panel">

          <div class="modal-header">
            <div>
              <h3 class="modal-title">Edit Task Entry</h3>
              <p class="modal-sub">Modify your logged task details below.</p>
            </div>
            <button class="modal-close" @click="closeEditModal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="form-grid">

              <!-- Left Column -->
              <div class="form-col">
                <div class="form-group">
                  <label class="form-label">PAPs Category</label>
                  <select v-model="editedTask.paps" class="form-select">
                      <option value="" disabled selected>-- Select PAPS --</option>
                          
                          <option 
                            v-for="option in papsOptions" 
                            :key="option" 
                            :value="option"
                          >
                            {{ option }}
                          </option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Subject Heading</label>
                  <input v-model="editedTask.title" class="form-input" placeholder="Enter task title">
                </div>

                <div class="form-group">
                  <label class="form-label">Document Classification</label>
                  <select v-model="editedTask.type" class="form-select">
                    <option value="CSW">CSW</option>
                    <option value="Memo">Memo</option>
                    <option value="MOA">MOA</option>
                    <option value="Letter">Letter</option>
                    <option value="MoM">Minutes of Meeting</option>
                    <option value="Email">Email</option>
                    <option value="Others">Others</option>
                  </select>
                  <div v-if="editedTask.type === 'Others'" class="mt-2">
                    <input v-model="editedTask.otherType" class="form-input" placeholder="Specify document type">
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Task Description / Subject Details</label>
                  <textarea v-model="editedTask.description" class="form-textarea" rows="3" placeholder="Enter details..." />
                </div>
              </div>

              <!-- Right Column -->
              <div class="form-col">
                <div class="form-group">
                  <label class="form-label">Task Status</label>
                  <select v-model="editedTask.status" class="form-select">
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Document References</label>
                  <div class="doc-links-list">
                    <div
                      v-for="(link, index) in editedTask.document_links"
                      :key="index"
                      class="doc-link-row"
                    >
                      <span class="doc-link-num">#{{ index + 1 }}</span>
                      <input
                        v-model="editedTask.document_links[index]"
                        type="url"
                        class="form-input form-input--sm"
                        placeholder="https://sharepoint.com/..."
                      />
                      <button type="button" class="remove-link-btn" @click="removeDocumentLink(index)">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                    <button type="button" class="add-link-btn" @click="addDocumentLink">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                      </svg>
                      Add Reference Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeEditModal">Cancel</button>
            <button class="btn-primary" @click="updateTask">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              Update
            </button>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getTask as getTaskService, updateTask as updateTaskService } from '@/services/taskService';
import { useToast } from "vue-toastification";

const toast = useToast();

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

const papsOptions = ref([
  "Administrative and Financial Support",
  "Devolution",
  "Digitalization",
  "Disaster Response Management",
  "Field Visit",
  "Inter-Office Memorandum",
  "Legislative",
  "Meetings",
  "Mid-Year and Year-End Performance Review",
  "Misroutes",
  "Monitoring/Evaluation of TEST Operations",
  "National Archives of the Philippines",
  "National Conferences",
  "Regional Reports",
  "Request for Scholarship",
  "Scholarship and TESD Operation-related Policies",
  "Secretary's Directives",
  "SIPTVETS",
  "Special Clients under Presidential Directives",
  "Strategic Performance Management System",
  "Sustain/Maintain Partnerships",
  "Technical and Administrative Assistance to ROPODOs",
  "Technical Assistance to Internal Clients, Partners, and Stakeholders",
  "TESDA Organizational Excellence Awards",
  "TESDA Technology Institution (TTIs)",
  "TESDA-BARMM",
  "TESDA-DOLE Convergence",
  "TTIs Advisory Councils (TACs)",
  "Updating of National Records"
]);
const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date)) return '—';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const shortenLink = (link) => {
  if (!link) return null;
  try {
    const url = new URL(link);
    return `${url.hostname}${url.pathname.length > 10 ? '/...' : url.pathname}`;
  } catch {
    return link;
  }
};

const statusClass = (status) => {
  if (status === 'Done') return 'status--done';
  if (status === 'Suspended') return 'status--suspended';
  return 'status--inprogress';
};

const taskSlaClass = (task) => {
  if (task.status === 'Done') return '';
  const hours = (new Date() - new Date(task.date_added)) / (1000 * 60 * 60);
  if (hours >= 72) return 'sla--critical';
  if (hours >= 48) return 'sla--warning';
  if (hours >= 24) return 'sla--watch';
  return '';
};

const editTask = async (task) => {
  try {
    const response = await getTaskService(task.id);
    if (response.status === 200) {
      const data = response.data;
      const predefinedTypes = ['CSW', 'Memo', 'MOA', 'Letter', 'MoM', 'Email'];
      editedTask.value = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        type: predefinedTypes.includes(data.type) ? data.type : 'Others',
        otherType: predefinedTypes.includes(data.type) ? '' : data.type,
        paps: data.paps,
        no_of_document: data.no_of_document,
        document_links: data.document_links.map(linkObj => linkObj.document_link),
        link: data.link || '',
        hours_worked: data.hours_worked || 0,
        date_added: data.date_added || '',
        date_finished: data.date_finished || '',
      };
      showEditModal.value = true;
    }
  } catch (error) {
    console.error('Error fetching task details:', error);
  }
};

const updateTask = async () => {
  try {
    editedTask.value.document_links = editedTask.value.document_links.slice(0, editedTask.value.no_of_document);
    const formattedDocumentLinks = editedTask.value.document_links.map((link) => ({ document_link: link }));
    const payload = { ...editedTask.value, document_links: formattedDocumentLinks };
    const finalTaskType = editedTask.value.type === "Others" ? editedTask.value.otherType : editedTask.value.type;
    payload.type = finalTaskType;
    await updateTaskService(editedTask.value.id, payload);
    emit('updateTasks', editedTask.value);
    closeEditModal();
    toast.success("Task successfully updated!");
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || String(error);
    toast.error(errorMessage);
    closeEditModal();
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
  editedTask.value = {};
};

function addDocumentLink() {
  editedTask.value.document_links.push('');
}

function removeDocumentLink(index) {
  editedTask.value.document_links.splice(index, 1);
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.task-list-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* ── Banner ── */
.tasks-banner {
  background: linear-gradient(135deg, #eff6ff, #f0fdf4);
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 10px 16px;
  margin-bottom: 16px;
}
.banner-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: #1d4ed8;
  font-weight: 600;
}
.task-count-badge {
  margin-left: auto;
  background: #dbeafe;
  color: #1d4ed8;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

/* ── Task Grid ── */
.tasks-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Task Card ── */
.task-card {
  display: flex;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e8ecf4;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.task-card:hover {
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.09);
  transform: translateY(-1px);
}

/* SLA accent bar */
.card-accent {
  width: 4px;
  background: #e2e8f0;
  flex-shrink: 0;
}
.sla--watch .card-accent { background: #f59e0b; }
.sla--warning .card-accent { background: #f97316; }
.sla--critical .card-accent { background: #ef4444; }

.card-body {
  flex: 1;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

/* ── Card Header ── */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.card-title-group {
  flex: 1;
  min-width: 0;
}
.card-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
  margin: 0 0 3px;
}
.card-description {
  font-size: 12.5px;
  color: #64748b;
  line-height: 1.5;
}
.field-label {
  font-weight: 600;
  color: #94a3b8;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-right: 3px;
}
.card-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

/* ── Status Badge ── */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid transparent;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.status--done { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
.status--inprogress { background: #fffbeb; color: #d97706; border-color: #fde68a; }
.status--suspended { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }

/* ── Edit Button ── */
.edit-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  font-size: 11.5px;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}
.edit-btn:hover {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}
.edit-btn--disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.edit-btn--disabled:hover {
  background: #f8fafc;
  color: #475569;
  border-color: #e2e8f0;
}

/* ── Tags ── */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}
.tag--paps { background: #f0f9ff; color: #0369a1; border: 1px solid #bae6fd; }
.tag--type { background: #faf5ff; color: #7c3aed; border: 1px solid #e9d5ff; }
.tag--vol  { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }

/* ── References ── */
.card-references {
  padding: 8px 10px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
}
.ref-list {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.ref-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #2563eb;
  font-size: 11.5px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s;
}
.ref-link:hover { color: #1d4ed8; text-decoration: underline; }

/* ── Card Footer ── */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}
.meta-dates {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: #94a3b8;
}
.meta-label { font-weight: 600; color: #64748b; }
.meta-val { color: #475569; }

.hours-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  color: #1d4ed8;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 700;
  border: 1px solid #bfdbfe;
}

/* ── Empty State ── */
.empty-state {
  text-align: center;
  padding: 56px 32px;
  background: #ffffff;
  border: 2px dashed #e2e8f0;
  border-radius: 16px;
}
.empty-icon {
  width: 64px;
  height: 64px;
  background: #f1f5f9;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #94a3b8;
}
.empty-title {
  font-size: 16px;
  font-weight: 700;
  color: #334155;
  margin: 0 0 6px;
}
.empty-sub {
  font-size: 13px;
  color: #94a3b8;
}

/* ── Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.modal-panel {
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafbfe;
  border-radius: 20px 20px 0 0;
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
  transition: all 0.15s;
}
.modal-close:hover { background: #fee2e2; color: #dc2626; border-color: #fecaca; }

.modal-body {
  padding: 20px 24px;
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

.doc-links-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.doc-link-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.doc-link-num {
  font-size: 11px;
  font-weight: 700;
  color: #3b82f6;
  background: #eff6ff;
  padding: 3px 7px;
  border-radius: 6px;
  flex-shrink: 0;
}
.remove-link-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid #fecaca;
  background: #fff5f5;
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s;
}
.remove-link-btn:hover { background: #ef4444; color: white; }
.add-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  border: 1px dashed #bfdbfe;
  border-radius: 8px;
  padding: 7px 12px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.add-link-btn:hover { background: #dbeafe; border-style: solid; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 14px 24px 20px;
  border-top: 1px solid #f1f5f9;
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
  padding: 9px 20px;
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
.btn-primary:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.45);
  transform: translateY(-1px);
}
</style>