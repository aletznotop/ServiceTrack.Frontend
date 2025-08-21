async function fetchProjects() {
  const response = await fetch("http://localhost:5176/api/projects");
  if (!response.ok) throw new Error("Error al obtener proyectos");
  return await response.json();
}

async function initProjects() {
  try {
    const projects = await fetchProjects();

    const html = projects.map(p => `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="stat-card h-100">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <h5 class="mb-0">${p.nombre}</h5>
            <div class="dropdown">
              <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown">
                <i class="bi bi-three-dots"></i>
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#"><i class="bi bi-pencil"></i> Editar</a></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-eye"></i> Ver detalles</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-trash"></i> Eliminar</a></li>
              </ul>
            </div>
          </div>

          <p class="text-muted small mb-3">${p.descripcion}</p>

          <div class="mb-3">
            <div class="d-flex justify-content-between mb-1">
              <small class="text-muted">Progreso</small>
              <small class="text-muted">50%</small>
            </div>
            <div class="progress" style="height: 6px;">
              <div class="progress-bar bg-primary" style="width: 50%"></div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-6">
              <small class="text-muted d-block">Estado</small>
              <span class="status-badge bg-success text-white">Activo</span>
            </div>
            <div class="col-6">
              <small class="text-muted d-block">Prioridad</small>
              <span class="status-badge bg-warning text-white">Media</span>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center">
            <div><small class="text-muted"><i class="bi bi-people"></i> 3 miembros</small></div>
            <div><small class="text-muted"><i class="bi bi-calendar"></i> ${p.fechaFin ? formatDate(p.fechaFin) : "Sin fecha"}</small></div>
          </div>

          <hr>
          <small class="text-muted"><i class="bi bi-person-badge"></i> Usuario #${p.usuarioId}</small>
        </div>
      </div>
    `).join('');

    document.getElementById("projects-list").innerHTML = html;

  } catch (err) {
    console.error(err);
    document.getElementById("projects-list").innerHTML = "<p>Error cargando proyectos</p>";
  }
}
