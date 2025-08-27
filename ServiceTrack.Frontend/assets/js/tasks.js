// === TAREAS ===

const API_BASE = "http://localhost:5176/api";

async function initTasks() {
  const tasks = await fetchTasks();
console.log(tasks);
  // Contadores
  setSectionCounts(tasks);

  // Agrupamos por estado
  const grouped = {
    pending: tasks.filter(t => t.estado === "pending"),
    inProgress: tasks.filter(t => t.estado === "inProgress"),
    review: tasks.filter(t => t.estado === "review"),
    completed: tasks.filter(t => t.estado === "completed")
  };

  // Render columnas Kanban
  document.getElementById("pending-tasks-column").innerHTML =
    generateTaskCards(grouped.pending);
  document.getElementById("inprogress-tasks-column").innerHTML =
    generateTaskCards(grouped.inProgress);
  document.getElementById("review-tasks-column").innerHTML =
    generateTaskCards(grouped.review);
  document.getElementById("completed-tasks-column").innerHTML =
    generateTaskCards(grouped.completed);
}

/** Trae todas las tareas del backend */
async function fetchTasks() {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });
    if (!res.ok) throw new Error("Error cargando tareas");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

/** Actualiza los contadores en las cabeceras de columnas */
function setSectionCounts(tasks) {
  const pending = document.querySelector('#pending-count');
  const inprog  = document.querySelector('#inprogress-count');
  const review  = document.querySelector('#review-count');
  const done    = document.querySelector('#completed-count');

  if (pending) pending.textContent = tasks.filter(t => t.estado === "pending").length;
  if (inprog)  inprog.textContent  = tasks.filter(t => t.estado === "inProgress").length;
  if (review)  review.textContent  = tasks.filter(t => t.estado === "review").length;
  if (done)    done.textContent    = tasks.filter(t => t.estado === "completed").length;
}

/** Genera las tarjetas de cada tarea */
function generateTaskCards(tasks) {
  return tasks.map(task => `
    <div class="task-card p-2 mb-2" draggable="true">
      <div class="d-flex">
        <div class="task-priority priority-${task.prioridad} me-2"></div>
        <div class="flex-grow-1">
          <h6 class="mb-1 small">${task.nombre}</h6>
          <small class="text-muted"><i class="bi bi-person"></i> ${task.assignee?.nombre || "Sin asignar"}</small>
          <br>
          <small class="text-muted"><i class="bi bi-calendar"></i> ${task.fechaVencimiento || "Sin fecha"}</small>
          <br>
          <small class="text-muted"><i class="bi bi-tag"></i> ${task.proyecto?.nombre || "Sin proyecto"}</small>
        </div>
      </div>
    </div>
  `).join('');
}

// === Modal de creación de Tarea ===
async function showCreateTaskModal() {
  if (!window.Swal) return;

// 1. Traer proyectos desde el backend
  let proyectos = [];
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(API_BASE+"/Projects", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    proyectos = await res.json();
  } catch (err) {
    console.error("Error cargando proyectos:", err);
    proyectos = [];
  }

  const proyectosOptions = proyectos.map(
    p => `<option value="${p.id}">${p.nombre}</option>`
  ).join("");
// 2. Mostrar modal con formulario
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
          <label class="form-label">Asignar a (Usuario)</label>
          <select class="form-select" id="taskAssignee">
            <option value="1">Juan Pérez</option>
            <option value="2">Ana García</option>
            <option value="3">Carlos López</option>
            <option value="4">María Rodríguez</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Proyecto</label>
          <select class="form-select" id="taskProject">
            ${proyectosOptions || '<option value="">(No hay proyectos)</option>'}
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
      const projectId = document.getElementById('taskProject').value;
      if (!title) {
        Swal.showValidationMessage('El título es requerido');
        return false;
      }
      return { title, description, priority, dueDate, assignee, projectId };
    }
  }).then((result) => {
    if (result.isConfirmed) createTask(result.value);
  });
}

/** Llama al backend para crear una nueva tarea */
async function createTask(taskData) {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        Nombre: taskData.title,
        Descripcion: taskData.description,
        Prioridad: taskData.priority === "low" ? 1 : taskData.priority === "medium" ? 2 : 3, // 🔄 conviértelo a int,
        FechaVencimiento: taskData.dueDate,
        AssigneeId: parseInt(taskData.assignee),
        ProyectoId: parseInt(taskData.projectId),
        Estado: "pending"
      })
    });

    if (!res.ok) throw new Error("Error creando la tarea ");

    Swal.fire({
      icon: 'success',
      title: '¡Tarea creada!',
      text: `La tarea "${taskData.title}" ha sido creada exitosamente.`,
      timer: 2000,
      showConfirmButton: false
    });

    // Recargar tareas
    initTasks();
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "No se pudo crear la tarea", "error");
  }
}
