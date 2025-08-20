// === PROYECTOS ===
function initProjects() {
  const list = document.getElementById('projects-list');
  if (list) list.innerHTML = generateProjectCards();
}

function generateProjectCards() {
  const projects = [
    { id: 1, name: 'TaskFlow Manager', description: 'Sistema completo de gestión de tareas y proyectos colaborativo', status: 'active', priority: 'high', progress: 75, teamSize: 4, dueDate: '2025-09-15', manager: 'Juan Pérez' },
    { id: 2, name: 'API REST Backend', description: 'Desarrollo de API RESTful con .NET 8 y Entity Framework', status: 'active', priority: 'high', progress: 60, teamSize: 2, dueDate: '2025-08-30', manager: 'Ana García' },
    { id: 3, name: 'Dashboard Analytics', description: 'Implementación de métricas y reportes visuales', status: 'active', priority: 'medium', progress: 30, teamSize: 3, dueDate: '2025-10-01', manager: 'Carlos López' }
  ];

  return projects.map(project => `
    <div class="col-lg-4 col-md-6 mb-4">
      <div class="stat-card h-100">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <h5 class="mb-0">${project.name}</h5>
          <div class="dropdown">
            <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#"><i class="bi bi-pencil"></i> Editar</a></li>
              <li><a class="dropdown-item" href="#"><i class="bi bi-eye"></i> Ver detalles</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-trash"></i> Eliminar</a></li>
            </ul>
          </div>
        </div>

        <p class="text-muted small mb-3">${project.description}</p>

        <div class="mb-3">
          <div class="d-flex justify-content-between mb-1">
            <small class="text-muted">Progreso</small>
            <small class="text-muted">${project.progress}%</small>
          </div>
          <div class="progress" style="height: 6px;">
            <div class="progress-bar bg-primary" style="width: ${project.progress}%"></div>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-6">
            <small class="text-muted d-block">Estado</small>
            <span class="status-badge bg-success text-white">${getStatusText(project.status)}</span>
          </div>
          <div class="col-6">
            <small class="text-muted d-block">Prioridad</small>
            <span class="status-badge bg-${getPriorityColor(project.priority)} text-white">${getPriorityText(project.priority)}</span>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center">
          <div><small class="text-muted"><i class="bi bi-people"></i> ${project.teamSize} miembros</small></div>
          <div><small class="text-muted"><i class="bi bi-calendar"></i> ${formatDate(project.dueDate)}</small></div>
        </div>

        <hr>
        <small class="text-muted"><i class="bi bi-person-badge"></i> ${project.manager}</small>
      </div>
    </div>
  `).join('');
}

function getStatusText(status) {
  const statusMap = { active: 'Activo', completed: 'Completado', paused: 'Pausado' };
  return statusMap[status] || status;
}

function getPriorityColor(priority) {
  const colorMap = { high: 'danger', medium: 'warning', low: 'success' };
  return colorMap[priority] || 'secondary';
}
