// === TAREAS ===

const API_BASE = "https://localhost:7037/api";

async function initTasks() {
  const tasks = await fetchTasks();
  // Contadores
  setSectionCounts(tasks);

  // Agrupamos por estado
  const grouped = {
    pending: tasks.filter((t) => t.estado === "pending"),
    inProgress: tasks.filter((t) => t.estado === "inProgress"),
    review: tasks.filter((t) => t.estado === "review"),
    completed: tasks.filter((t) => t.estado === "completed"),
  };

  // Render columnas Kanban
  document.getElementById("pending-tasks-column").innerHTML = generateTaskCards(
    grouped.pending
  );
  document.getElementById("inprogress-tasks-column").innerHTML =
    generateTaskCards(grouped.inProgress);
  document.getElementById("review-tasks-column").innerHTML = generateTaskCards(
    grouped.review
  );
  document.getElementById("completed-tasks-column").innerHTML =
    generateTaskCards(grouped.completed);
}

/** Trae todas las tareas del backend */
async function fetchTasks() {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error cargando tareas");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function fetchUsers() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/users`, {
      headers: { Authorization: "Bearer " + token },
    });
    if (!res.ok) throw new Error("Error cargando usuarios");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function fetchProjects() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/projects`, {
      headers: { Authorization: "Bearer " + token },
    });
    if (!res.ok) throw new Error("Error cargando proyectos");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

/** Actualiza los contadores en las cabeceras de columnas */
function setSectionCounts(tasks) {
  const pending = document.querySelector("#pending-count");
  const inprog = document.querySelector("#inprogress-count");
  const review = document.querySelector("#review-count");
  const done = document.querySelector("#completed-count");

  if (pending)
    pending.textContent = tasks.filter((t) => t.estado === "pending").length;
  if (inprog)
    inprog.textContent = tasks.filter((t) => t.estado === "inProgress").length;
  if (review)
    review.textContent = tasks.filter((t) => t.estado === "review").length;
  if (done)
    done.textContent = tasks.filter((t) => t.estado === "completed").length;
}

/** Genera las tarjetas de cada tarea */
function generateTaskCards(tasks) {
  return tasks
    .map(
      (task) => `
    <div class="task-card p-2 mb-2" draggable="true">
      <div class="d-flex justify-content-between">
        <div class="flex-grow-1">
          <h6 class="mb-1 small">${task.nombre}</h6>
          <small class="text-muted"><i class="bi bi-person"></i> ${
            task.assignee?.nombre || "Sin asignar"
          }</small>
          <br>
          <small class="text-muted"><i class="bi bi-calendar"></i> ${
            Utils.formatDate(task.fechaVencimiento) || "Sin fecha"
          }</small>
          <br>
          <small class="text-muted"><i class="bi bi-tag"></i> ${
            task.proyecto?.nombre || "Sin proyecto"
          }</small>
        </div>
        <div class="dropdown ms-2">
          <button class="btn btn-sm btn-light" data-bs-toggle="dropdown">
            <i class="bi bi-three-dots-vertical"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="javascript:void(0)" onclick='showEditTaskModal(${JSON.stringify(
              task
            )})'><i class="bi bi-pencil"></i> Editar</a></li>
            <li><a class="dropdown-item" href="javascript:void(0)" onclick='showTaskDetails(${JSON.stringify(
              task
            )})'><i class="bi bi-eye"></i> Ver detalles</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="confirmDeleteTask(${
              task.id
            })"><i class="bi bi-trash"></i> Eliminar</a></li>
          </ul>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// === Modal de creación de Tarea ===
async function showCreateTaskModal() {
  if (!window.Swal) return;

  // 1. Traer proyectos desde el backend
  const proyectos = await fetchProjects();
  // 2 . Traer usuarios desde el backend
  const usuarios = await fetchUsers();

  const usuariosOptions = usuarios
    .map((u) => `<option value="${u.id}">${u.nombre}</option>`)
    .join("");
  const proyectosOptions = proyectos
    .map((p) => `<option value="${p.id}">${p.nombre}</option>`)
    .join("");
  // 2. Mostrar modal con formulario
  Swal.fire({
    title: "Crear Nueva Tarea",
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
            ${usuariosOptions}
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Proyecto</label>
          <select class="form-select" id="taskProject">
            ${proyectosOptions}
          </select>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Crear Tarea",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#2563eb",
    preConfirm: () => {
      const title = document.getElementById("taskTitle").value.trim();
      const description = document
        .getElementById("taskDescription")
        .value.trim();
      const priority = document.getElementById("taskPriority").value;
      const dueDate = document.getElementById("taskDueDate").value;
      const assignee = document.getElementById("taskAssignee").value;
      const projectId = document.getElementById("taskProject").value;
      if (!title) {
        Swal.showValidationMessage("El título es requerido");
        return false;
      }
      return { title, description, priority, dueDate, assignee, projectId };
    },
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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        Nombre: taskData.title,
        Descripcion: taskData.description,
        Prioridad:
          taskData.priority === "low"
            ? 1
            : taskData.priority === "medium"
            ? 2
            : 3, // 🔄 conviértelo a int,
        FechaVencimiento: taskData.dueDate,
        AssigneeId: parseInt(taskData.assignee),
        ProyectoId: parseInt(taskData.projectId),
        Estado: "pending",
      }),
    });

    if (!res.ok) throw new Error("Error creando la tarea ");

    Swal.fire({
      icon: "success",
      title: "¡Tarea creada!",
      text: `La tarea "${taskData.title}" ha sido creada exitosamente.`,
      timer: 2000,
      showConfirmButton: false,
    });

    // Recargar tareas
    initTasks();
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "No se pudo crear la tarea", "error");
  }
}

async function showEditTaskModal(task) {
  if (!window.Swal) return;

  const users = await fetchUsers();
  const projects = await fetchProjects();
  
  const userOptions = users
    .map(
      (u) =>
        `<option value="${u.id}" ${
          u.id === task.assigneeId ? "selected" : ""
        }>${u.nombre}</option>`
    )
    .join("");

  const projectOptions = projects
    .map(
      (p) =>
        `<option value="${p.id}" ${
          p.id === task.proyectoId ? "selected" : ""
        }>${p.nombre}</option>`
    )
    .join("");

  Swal.fire({
    title: "Editar Tarea",
    html: `
      <div class="text-start">
        <div class="mb-3">
          <label class="form-label">Título</label>
          <input type="text" class="form-control" id="editTaskTitle" value="${
            task.nombre
          }">
        </div>
        <div class="mb-3">
          <label class="form-label">Descripción</label>
          <textarea class="form-control" id="editTaskDescription" rows="3">${
            task.descripcion
          }</textarea>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Prioridad</label>
            <select class="form-select" id="editTaskPriority">
              <option value="low" ${
                task.prioridad === "low" ? "selected" : ""
              }>Baja</option>
              <option value="medium" ${
                task.prioridad === "medium" ? "selected" : ""
              }>Media</option>
              <option value="high" ${
                task.prioridad === "high" ? "selected" : ""
              }>Alta</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Fecha límite</label>
            <input type="date" class="form-control" id="editTaskDueDate" value="${
              task.fechaVencimiento ? task.fechaVencimiento.split("T")[0] : ""
            }">
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Asignado a</label>
          <select class="form-select" id="editTaskAssignee">
            ${userOptions}
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Proyecto</label>
          <select class="form-select" id="editTaskProject">
            ${projectOptions}
          </select>
        </div>
        <div class="mb-3">
  <label class="form-label">Estado</label>
  <select class="form-select" id="taskStatus">
    <option value="pending">Pendiente</option>
    <option value="inProgress">En Progreso</option>
    <option value="review">En Revisión</option>
    <option value="completed">Completada</option>
  </select>
</div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Guardar cambios",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#2563eb",
    preConfirm: () => {
      return {
        id: task.id,
        nombre: document.getElementById("editTaskTitle").value.trim(),
        descripcion: document
          .getElementById("editTaskDescription")
          .value.trim(),
        prioridad: mapPriorityToInt(
          document.getElementById("editTaskPriority").value
        ),
        fechaVencimiento: document.getElementById("editTaskDueDate").value,
        assigneeId: parseInt(document.getElementById("editTaskAssignee").value),
        proyectoId: parseInt(document.getElementById("editTaskProject").value),
        estado: document.getElementById("taskStatus").value
      };
    },
  }).then((result) => {
    if (result.isConfirmed) updateTask(result.value);
  });
}

async function updateTask(task) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(task),
    });

    if (!res.ok) throw new Error("Error al actualizar la tarea");

    Swal.fire("¡Éxito!", "La tarea fue actualizada.", "success");
    initTasks();
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "No se pudo actualizar la tarea.", "error");
  }
}

function showTaskDetails(task) {
  Swal.fire({
    title: task.nombre,
    html: `
      <p><b>Descripción:</b> ${task.descripcion || "Sin descripción"}</p>
      <p><b>Asignado a:</b> ${task.assignee?.nombre || "Sin asignar"}</p>
      <p><b>Proyecto:</b> ${task.proyecto?.nombre || "Sin proyecto"}</p>
      <p><b>Prioridad:</b> ${Utils.getPriorityText(task.prioridad)}</p>
      <p><b>Estado:</b> ${task.estado}</p>
      <p><b>Fecha límite:</b> ${Utils.formatDate(task.fechaVencimiento)}</p>
    `,
    confirmButtonText: "Cerrar",
    confirmButtonColor: "#2563eb",
  });
}

function confirmDeleteTask(taskId) {
  Swal.fire({
    title: "¿Eliminar Tarea?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteTask(taskId);
    }
  });
}

async function deleteTask(taskId) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    if (!res.ok) throw new Error("Error eliminando tarea");

    Swal.fire("Eliminada", "La tarea fue eliminada", "success");
    initTasks();
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "No se pudo eliminar la tarea", "error");
  }
}
