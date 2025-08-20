// === TAREAS ===
function initTasks() {
  // Contadores
  setSectionCounts();
  // Columnas Kanban
  const cols = {
    'pending-tasks-column': generateTaskCards('pending'),
    'inprogress-tasks-column': generateTaskCards('inProgress'),
    'review-tasks-column': generateTaskCards('review'),
    'completed-tasks-column': generateTaskCards('completed')
  };
  for (const [id, html] of Object.entries(cols)) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }
}

function setSectionCounts() {
  const pending = document.querySelector('#pending-count');
  const inprog  = document.querySelector('#inprogress-count');
  const review  = document.querySelector('#review-count');
  const done    = document.querySelector('#completed-count');
  if (pending) pending.textContent = getPendingTasksCount();
  if (inprog)  inprog.textContent  = getInProgressTasksCount();
  if (review)  review.textContent  = getReviewTasksCount();
  if (done)    done.textContent    = getCompletedTasksCount();
}

function getPendingTasksCount() { return 8; }
function getInProgressTasksCount() { return 5; }
function getReviewTasksCount() { return 3; }
function getCompletedTasksCount() { return 12; }

function generateTaskCards(status) {
  const tasksByStatus = {
    pending: [
      { id: 1, title: 'Configurar base de datos', priority: 'high', assignee: 'Juan Pérez' },
      { id: 2, title: 'Diseñar API endpoints', priority: 'medium', assignee: 'Ana García' }
    ],
    inProgress: [
      { id: 3, title: 'Implementar autenticación', priority: 'high', assignee: 'Carlos López' }
    ],
    review: [
      { id: 4, title: 'Testing de componentes', priority: 'medium', assignee: 'María Rodríguez' }
    ],
    completed: [
      { id: 5, title: 'Setup inicial del proyecto', priority: 'low', assignee: 'Juan Pérez' },
      { id: 6, title: 'Documentación técnica', priority: 'medium', assignee: 'Ana García' }
    ]
  };
  const tasks = tasksByStatus[status] || [];

  return tasks.map(task => `
    <div class="task-card p-2 mb-2" draggable="true">
      <div class="d-flex">
        <div class="task-priority priority-${task.priority} me-2"></div>
        <div class="flex-grow-1">
          <h6 class="mb-1 small">${task.title}</h6>
          <small class="text-muted"><i class="bi bi-person"></i> ${task.assignee}</small>
        </div>
      </div>
    </div>
  `).join('');
}

// === Modal de creación de Tarea ===
function showCreateTaskModal() {
  if (!window.Swal) return;
  Swal.fire({
    title: 'Crear Nueva Tarea',
    html: `
      <div class="text-start">
        <div class="mb-3">
          <label class="form-label">Título de la tarea</label>
          <input type="text" class="form-control" id="taskTitle" placeholder="Ej: Implementar API de usuarios">
        </div>
        <div class="mb-3">
          <label class="form-label">Descripción</label>
          <textarea class="form-control" id="taskDescription" rows="3" placeholder="Describe los detalles de la tarea..."></textarea>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Prioridad</label>
            <select class="form-select" id="taskPriority">
              <option value="low">Baja</option>
              <option value="medium" selected>Media</option>
              <option value="high">Alta</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Fecha límite</label>
            <input type="date" class="form-control" id="taskDueDate">
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Asignar a</label>
          <select class="form-select" id="taskAssignee">
            <option value="1">Juan Pérez</option>
            <option value="2">Ana García</option>
            <option value="3">Carlos López</option>
            <option value="4">María Rodríguez</option>
          </select>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Crear Tarea',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#2563eb',
    preConfirm: () => {
      const title = document.getElementById('taskTitle').value.trim();
      const description = document.getElementById('taskDescription').value.trim();
      const priority = document.getElementById('taskPriority').value;
      const dueDate = document.getElementById('taskDueDate').value;
      const assignee = document.getElementById('taskAssignee').value;
      if (!title) {
        Swal.showValidationMessage('El título es requerido');
        return false;
      }
      return { title, description, priority, dueDate, assignee };
    }
  }).then((result) => {
    if (result.isConfirmed) createTask(result.value);
  });
}

function createTask(taskData) {
  console.log('Creando tarea:', taskData);
  Swal.fire({
    icon: 'success',
    title: '¡Tarea creada!',
    text: `La tarea "${taskData.title}" ha sido creada exitosamente.`,
    timer: 2000,
    showConfirmButton: false
  });
  setTimeout(() => loadSection('dashboard'), 2000);
}
