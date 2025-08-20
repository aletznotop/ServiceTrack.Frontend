// === EQUIPO ===
function initTeam() {
  const container = document.getElementById('team-grid');
  if (container) container.innerHTML = generateTeamCards();
}

function generateTeamCards() {
  const teamMembers = [
    { id: 1, name: 'Juan Pérez',  role: 'Full Stack Developer',  email: 'juan.perez@taskflow.com',  avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=2563eb&color=fff', activeTasks: 5,  completedTasks: 23, status: 'online' },
    { id: 2, name: 'Ana García',  role: 'Frontend Developer',     email: 'ana.garcia@taskflow.com',  avatar: 'https://ui-avatars.com/api/?name=Ana+Garcia&background=059669&color=fff', activeTasks: 3,  completedTasks: 18, status: 'online' },
    { id: 3, name: 'Carlos López', role: 'Backend Developer',     email: 'carlos.lopez@taskflow.com', avatar: 'https://ui-avatars.com/api/?name=Carlos+Lopez&background=d97706&color=fff', activeTasks: 4,  completedTasks: 15, status: 'offline' }
  ];

  return teamMembers.map(member => `
    <div class="col-lg-4 col-md-6 mb-4">
      <div class="stat-card text-center">
        <div class="position-relative d-inline-block mb-3">
          <img src="${member.avatar}" alt="${member.name}" class="rounded-circle" width="80" height="80">
          <span class="position-absolute bottom-0 end-0 bg-${member.status === 'online' ? 'success' : 'secondary'} rounded-circle p-1" style="width: 20px; height: 20px;"></span>
        </div>
        <h5 class="mb-1">${member.name}</h5>
        <p class="text-muted mb-2">${member.role}</p>
        <p class="small text-muted mb-3">${member.email}</p>
        <div class="row text-center mb-3">
          <div class="col-6">
            <h6 class="text-primary mb-0">${member.activeTasks}</h6>
            <small class="text-muted">Activas</small>
          </div>
          <div class="col-6">
            <h6 class="text-success mb-0">${member.completedTasks}</h6>
            <small class="text-muted">Completadas</small>
          </div>
        </div>
        <div class="d-grid gap-2 d-md-block">
          <button class="btn btn-outline-primary btn-sm"><i class="bi bi-chat"></i> Mensaje</button>
          <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-eye"></i> Perfil</button>
        </div>
      </div>
    </div>
  `).join('');
}
