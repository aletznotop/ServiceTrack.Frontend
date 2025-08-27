async function fetchProjects() {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:5176/api/projects", {
    headers: { 
      "Authorization": "Bearer " + token 
    }
  });
  if (!response.ok) throw new Error("No autorizado o error al obtener proyectos");
  return await response.json();
}

async function initProjects() {
  try {
    const projects = await fetchProjects();

    const html = projects
      .map(
        (p) => `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="stat-card h-100">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <h5 class="mb-0">${p.nombre}</h5>
            <div class="dropdown">
              <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown">
                <i class="bi bi-three-dots"></i>
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="javascript:void(0)" onclick='showEditProjectModal(${JSON.stringify(p)})'><i class="bi bi-pencil"></i> Editar</a></li>
                <li><a class="dropdown-item" href="javascript:void(0)" onclick='showProjectDetails(${JSON.stringify(p)})'><i class="bi bi-eye"></i> Ver detalles</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="confirmDeleteProject(${p.id})"><i class="bi bi-trash"></i> Eliminar</a></li>
              </ul>
            </div>
          </div>

          <p class="text-muted small mb-3">${p.descripcion}</p>

          <div class="mb-3">
            <div class="d-flex justify-content-between mb-1">
  <small class="text-muted">Progreso</small>
  <small class="text-muted">${p.progress}%</small>
</div>
<div class="progress" style="height: 6px;">
  <div class="progress-bar bg-primary" style="width: ${p.progress}%"></div>
</div>
          </div>

          <div class="row mb-3">
  <div class="col-6">
    <small class="text-muted d-block">Estado</small>
    <span class="status-badge bg-success text-white">${getStatusText(p.status)}</span>
  </div>
  <div class="col-6">
    <small class="text-muted d-block">Prioridad</small>
    <span class="status-badge bg-${getPriorityColor(p.priority)} text-white">${getPriorityText(p.priority)}</span>
  </div>
</div>

          <div class="d-flex justify-content-between align-items-center">
  <div><small class="text-muted"><i class="bi bi-people"></i> ${p.teamSize} miembros</small></div>
  <div><small class="text-muted"><i class="bi bi-calendar"></i> ${formatDate(p.fechaFin)}</small></div>
</div>

          <hr>
<small class="text-muted"><i class="bi bi-person-badge"></i> ${p.manager}</small>
        </div>
      </div>
    `
      )
      .join("");

    document.getElementById("projects-list").innerHTML = html;
  } catch (err) {
    console.error(err);
    document.getElementById("projects-list").innerHTML =
      "<p>Error cargando proyectos</p>";
  }
}

function showCreateProjectModal() {
  if (!window.Swal) return;

  Swal.fire({
    title: "Crear Nuevo Proyecto",
    html: `
      <div class="text-start">
        <div class="mb-3">
          <label class="form-label">Nombre del Proyecto</label>
          <input type="text" class="form-control" id="projectName" placeholder="Ej: Sistema CRM">
        </div>

        <div class="mb-3">
          <label class="form-label">Descripción</label>
          <textarea class="form-control" id="projectDescription" rows="3" placeholder="Describe el proyecto..."></textarea>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Fecha Inicio</label>
            <input type="date" class="form-control" id="projectStartDate">
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Fecha Fin</label>
            <input type="date" class="form-control" id="projectEndDate">
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Estado</label>
            <select class="form-select" id="projectStatus">
              <option value="active" selected>Activo</option>
              <option value="paused">Pausado</option>
              <option value="completed">Completado</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Prioridad</label>
            <select class="form-select" id="projectPriority">
              <option value="high">Alta</option>
              <option value="medium" selected>Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Tamaño del equipo</label>
          <input type="number" min="1" class="form-control" id="projectTeamSize" value="1">
        </div>

        <div class="mb-3">
          <label class="form-label">Manager</label>
          <input type="text" class="form-control" id="projectManager" placeholder="Ej: Juan Pérez">
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Crear Proyecto",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#2563eb",
    preConfirm: () => {
      const name = document.getElementById("projectName").value.trim();
      const description = document.getElementById("projectDescription").value.trim();
      const startDate = document.getElementById("projectStartDate").value;
      const endDate = document.getElementById("projectEndDate").value;
      const status = document.getElementById("projectStatus").value;
      const priority = document.getElementById("projectPriority").value;
      const teamSize = parseInt(document.getElementById("projectTeamSize").value);
      const manager = document.getElementById("projectManager").value.trim();

      if (!name) {
        Swal.showValidationMessage("El nombre es requerido");
        return false;
      }

      return { name, description, startDate, endDate, status, priority, teamSize, manager };
    }
  }).then((result) => {
    if (result.isConfirmed) createProject(result.value);
  });
}

async function createProject(projectData) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        nombre: projectData.name,
        descripcion: projectData.description,
        fechaInicio: projectData.startDate,
        fechaFin: projectData.endDate || null,
        status: projectData.status,
        priority: projectData.priority,
        progress: 0,
        teamSize: projectData.teamSize,
        manager: projectData.manager,
        usuarioId: 1 // ⚡ Aquí pon el id del usuario loggeado
      })
    });

    if (!res.ok) throw new Error("Error creando proyecto");
    
    Swal.fire({
      icon: "success",
      title: "¡Proyecto creado!",
      text: `El proyecto "${projectData.name}" fue creado exitosamente.`,
      timer: 2000,
      showConfirmButton: false
    });

    initProjects(); // recarga lista
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "No se pudo crear el proyecto", "error");
  }
}

function showProjectDetails(project) {
  Swal.fire({
    title: project.nombre,
    html: `
      <p><b>Descripción:</b> ${project.descripcion}</p>
      <p><b>Estado:</b> ${getStatusText(project.status)}</p>
      <p><b>Prioridad:</b> ${getPriorityText(project.priority)}</p>
      <p><b>Progreso:</b> ${project.progress}%</p>
      <p><b>Tamaño del equipo:</b> ${project.teamSize}</p>
      <p><b>Manager:</b> ${project.manager}</p>
      <p><b>Inicio:</b> ${formatDate(project.fechaInicio)}</p>
      <p><b>Fin:</b> ${formatDate(project.fechaFin)}</p>
    `,
    confirmButtonText: "Cerrar",
    confirmButtonColor: "#2563eb"
  });
}

function showEditProjectModal(project) {
  Swal.fire({
    title: "Editar Proyecto",
    html: `
      <div class="text-start">
        <div class="mb-3">
          <label class="form-label">Nombre</label>
          <input type="text" class="form-control" id="projectName" value="${project.nombre}">
        </div>

        <div class="mb-3">
          <label class="form-label">Descripción</label>
          <textarea class="form-control" id="projectDescription" rows="3">${project.descripcion}</textarea>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Fecha Inicio</label>
            <input type="date" class="form-control" id="projectStartDate" value="${project.fechaInicio.split("T")[0]}">
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Fecha Fin</label>
            <input type="date" class="form-control" id="projectEndDate" value="${project.fechaFin ? project.fechaFin.split("T")[0] : ""}">
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Estado</label>
            <select class="form-select" id="projectStatus">
              <option value="active" ${project.status === "active" ? "selected" : ""}>Activo</option>
              <option value="paused" ${project.status === "paused" ? "selected" : ""}>Pausado</option>
              <option value="completed" ${project.status === "completed" ? "selected" : ""}>Completado</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Prioridad</label>
            <select class="form-select" id="projectPriority">
              <option value="high" ${project.priority === "high" ? "selected" : ""}>Alta</option>
              <option value="medium" ${project.priority === "medium" ? "selected" : ""}>Media</option>
              <option value="low" ${project.priority === "low" ? "selected" : ""}>Baja</option>
            </select>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Tamaño del equipo</label>
          <input type="number" min="1" class="form-control" id="projectTeamSize" value="${project.teamSize}">
        </div>

        <div class="mb-3">
          <label class="form-label">Manager</label>
          <input type="text" class="form-control" id="projectManager" value="${project.manager}">
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Guardar Cambios",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#2563eb",
    preConfirm: () => {
      return {
        ...project,
        nombre: document.getElementById("projectName").value,
        descripcion: document.getElementById("projectDescription").value,
        fechaInicio: document.getElementById("projectStartDate").value,
        fechaFin: document.getElementById("projectEndDate").value,
        status: document.getElementById("projectStatus").value,
        priority: document.getElementById("projectPriority").value,
        teamSize: parseInt(document.getElementById("projectTeamSize").value),
        manager: document.getElementById("projectManager").value
      };
    }
  }).then((result) => {
    if (result.isConfirmed) updateProject(result.value);
  });
}

async function updateProject(project) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/projects/${project.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(project)
    });

    if (!res.ok) throw new Error("Error actualizando proyecto");

    Swal.fire("Actualizado", "El proyecto se actualizó correctamente", "success");
    initProjects();
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "No se pudo actualizar el proyecto", "error");
  }
}
function confirmDeleteProject(projectId) {
  Swal.fire({
    title: "¿Eliminar Proyecto?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteProject(projectId);
    }
  });
}

async function deleteProject(projectId) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!res.ok) throw new Error("Error eliminando proyecto");

    Swal.fire("Eliminado", "El proyecto fue eliminado", "success");
    initProjects();
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "No se pudo eliminar el proyecto", "error");
  }
}

//a cambiar a utils

function getStatusText(status) {
  const statusMap = { 
    active: "Activo", 
    completed: "Completado", 
    paused: "Pausado" 
  };
  return statusMap[status] || status;
}

function getPriorityText(priority) {
  const priorityMap = { 
    high: "Alta", 
    medium: "Media", 
    low: "Baja" 
  };
  return priorityMap[priority] || priority;
}

function getPriorityColor(priority) {
  const colorMap = { 
    high: "danger", 
    medium: "warning", 
    low: "success" 
  };
  return colorMap[priority] || "secondary";
}

function formatDate(dateString) {
  if (!dateString) return "Sin fecha";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
