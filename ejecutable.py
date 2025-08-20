# Create project structure and files for the refactored frontend

import os, textwrap, zipfile, json, shutil, re, pathlib

base = "ServiceTrack.Frontend"
assets_css = os.path.join(base, "assets", "css")
assets_js = os.path.join(base, "assets", "js")
views = os.path.join(base, "views")

# Clean up if exists
if os.path.exists(base):
    shutil.rmtree(base)

os.makedirs(assets_css, exist_ok=True)
os.makedirs(assets_js, exist_ok=True)
os.makedirs(views, exist_ok=True)

# ---- THEME CSS ----
theme_css = """
/* === THEME VARIABLES & GLOBAL TOKENS ===
   Mantén aquí colores y decisiones de diseño reutilizables.
   Cambia estos valores para generar un tema distinto sin tocar estilos específicos.
*/
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --success-color: #059669;
  --warning-color: #d97706;
  --danger-color: #dc2626;
  --sidebar-width: 250px;
}

/* Tipografía y fondo global */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8fafc;
}
"""
open(os.path.join(assets_css, "theme.css"), "w", encoding="utf-8").write(textwrap.dedent(theme_css).strip()+"\n")

# ---- STYLE CSS (moved from Index.html <style> block, cleaned & grouped) ----
style_css = """
/* === LAYOUT & COMPONENTS === */

/* Sidebar Navigation */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: var(--sidebar-width);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1000;
  transition: transform 0.3s ease;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.sidebar-header h4 {
  color: white;
  margin: 0;
  font-weight: 600;
}

.nav-menu {
  padding: 1rem 0;
}

.nav-item {
  margin: 0.25rem 0;
}

.nav-link {
  color: rgba(255,255,255,0.8) !important;
  padding: 0.75rem 1.5rem;
  border-radius: 0;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-link:hover, .nav-link.active {
  color: white !important;
  background: rgba(255,255,255,0.1);
  border-left-color: white;
}

.nav-link i {
  margin-right: 0.75rem;
  width: 20px;
  text-align: center;
}

/* Main Content Area */
.main-content {
  margin-left: var(--sidebar-width);
  min-height: 100vh;
}

/* Top Navigation */
.top-nav {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 999;
}

.navbar-brand {
  font-weight: 600;
}

/* Dashboard Cards */
.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #e2e8f0;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-icon.primary { background: var(--primary-color); }
.stat-icon.success { background: var(--success-color); }
.stat-icon.warning { background: var(--warning-color); }
.stat-icon.danger  { background: var(--danger-color); }

/* Task Cards */
.task-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: var(--primary-color);
}

.task-priority {
  width: 4px;
  border-radius: 2px;
}

.priority-high   { background: var(--danger-color); }
.priority-medium { background: var(--warning-color); }
.priority-low    { background: var(--success-color); }

/* Status Badges */
.status-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.show { transform: translateX(0); }
  .main-content { margin-left: 0; }
}

/* Chart Container */
.chart-container { position: relative; height: 300px; }

/* Loading Animation */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
"""
open(os.path.join(assets_css, "style.css"), "w", encoding="utf-8").write(textwrap.dedent(style_css).strip()+"\n")

# ---- APP.JS ----
app_js = """
// === CONFIGURACIÓN GLOBAL DE LA APLICACIÓN ===
// Centraliza constantes y valores compartidos por todos los módulos.
const AppConfig = {
  API_BASE_URL: 'http://localhost:5000/api',
  ENDPOINTS: {
    projects: '/projects',
    tasks: '/tasks',
    users: '/users',
    auth: '/auth'
  },
  TASK_STATUS: {
    pending: 'Pendiente',
    inProgress: 'En Progreso',
    completed: 'Completado',
    cancelled: 'Cancelado'
  },
  PRIORITY_LEVELS: {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta'
  }
};

// === MANEJO GLOBAL DE ERRORES ===
window.addEventListener('error', (e) => {
  console.error('Error en la aplicación:', e.error || e.message);
  if (window.Swal) {
    Swal.fire({
      icon: 'error',
      title: 'Error inesperado',
      text: 'Ha ocurrido un error en la aplicación. Por favor, recarga la página.',
      confirmButtonColor: '#dc2626'
    });
  }
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Promesa rechazada:', e.reason);
  e.preventDefault();
});
"""
open(os.path.join(assets_js, "app.js"), "w", encoding="utf-8").write(textwrap.dedent(app_js).strip()+"\n")

# ---- NAVIGATION.JS ----
navigation_js = """
// === NAVEGACIÓN ===
// Encargado de: sidebar, rutas/secciones y carga de vistas.

document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  // Cargar sección inicial
  loadSection('dashboard');
  
  // Toggle del sidebar para móviles
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }
});

/** Configura los listeners del menú lateral */
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      const section = this.dataset.section;
      loadSection(section);
    });
  });
}

/** Carga el HTML de una sección desde /views/{section}.html */
function loadSection(section) {
  const content = document.getElementById('dashboard-content');
  if (!content) return;

  content.innerHTML = `
    <div class="text-center py-5">
      <div class="loading-spinner"></div>
      <p class="mt-2">Cargando ${section}...</p>
    </div>
  `;

  fetch(`./views/${section}.html`, { cache: 'no-store' })
    .then(r => r.ok ? r.text() : Promise.reject(r.statusText))
    .then(html => {
      content.innerHTML = html;

      // Hooks de inicialización por sección
      if (section === 'dashboard' && typeof initDashboard === 'function') initDashboard();
      if (section === 'projects'  && typeof initProjects  === 'function') initProjects();
      if (section === 'tasks'     && typeof initTasks     === 'function') initTasks();
      if (section === 'team'      && typeof initTeam      === 'function') initTeam();
    })
    .catch(err => {
      console.error('Error cargando vista:', err);
      content.innerHTML = `<p>Error cargando la sección <b>${section}</b></p>`;
    });
}

/** Muestra/oculta el sidebar en móviles */
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('show');
}
"""
open(os.path.join(assets_js, "navigation.js"), "w", encoding="utf-8").write(textwrap.dedent(navigation_js).strip()+"\n")

# ---- DASHBOARD.JS ----
dashboard_js = """
// === DASHBOARD ===
// Encargado de estadísticas, actividades recientes, próximas tareas y gráfica.

function initDashboard() {
  loadStatistics();
  loadRecentActivities();
  loadUpcomingTasks();
  initializeChart();
}

/** Actualiza las tarjetas de estadísticas */
function loadStatistics() {
  const stats = {
    totalProjects: 1,
    completedTasks: 47,
    pendingTasks: 23,
    overdueTasks: 5
  };

  animateCounter('total-projects', stats.totalProjects);
  animateCounter('completed-tasks', stats.completedTasks);
  animateCounter('pending-tasks', stats.pendingTasks);
  animateCounter('overdue-tasks', stats.overdueTasks);
}

/** Anima un contador numérico suave */
function animateCounter(elementId, targetValue) {
  const element = document.getElementById(elementId);
  if (!element) return;
  let currentValue = 0;
  const steps = 50;
  const increment = targetValue / steps;
  const timer = setInterval(() => {
    currentValue += increment;
    if (currentValue >= targetValue) {
      currentValue = targetValue;
      clearInterval(timer);
    }
    element.textContent = Math.round(currentValue);
  }, 30);
}

/** Renderiza la lista de actividades recientes */
function loadRecentActivities() {
  const activities = [
    { text: 'Tarea completada: "Revisar diseño UI"', time: 'hace 2 horas', icon: 'check-circle', class: 'text-success' },
    { text: 'Nuevo comentario en "API Development"', time: 'hace 4 horas', icon: 'chat', class: 'text-primary' },
    { text: 'Tarea asignada: "Testing de funcionalidades"', time: 'hace 1 día', icon: 'person-plus', class: 'text-info' },
    { text: 'Proyecto creado: "Dashboard Analytics"', time: 'hace 2 días', icon: 'folder-plus', class: 'text-warning' },
    { text: 'Reunión programada con el equipo de desarrollo', time: 'hace 3 días', icon: 'calendar-event', class: 'text-secondary' }
  ];

  const container = document.getElementById('recent-activities');
  if (!container) return;
  container.innerHTML = activities.map(a => `
    <div class="d-flex align-items-start mb-3">
      <i class="bi bi-${a.icon} ${a.class} me-2 mt-1"></i>
      <div class="flex-grow-1">
        <p class="mb-1 small">${a.text}</p>
        <small class="text-muted">${a.time}</small>
      </div>
    </div>
  `).join('');
}

/** Renderiza las próximas tareas */
function loadUpcomingTasks() {
  const tasks = [
    { id: 1, title: 'Implementar autenticación JWT', project: 'TaskFlow API', priority: 'high',   dueDate: '2025-08-25', assignee: 'Juan Pérez' },
    { id: 2, title: 'Diseñar dashboard de reportes', project: 'Dashboard UI', priority: 'medium', dueDate: '2025-08-27', assignee: 'Ana García' },
    { id: 3, title: 'Configurar base de datos Oracle', project: 'Infrastructure', priority: 'high', dueDate: '2025-08-23', assignee: 'Carlos López' }
  ];

  const container = document.getElementById('upcoming-tasks');
  if (!container) return;
  container.innerHTML = tasks.map(task => `
    <div class="col-lg-4 col-md-6 mb-3">
      <div class="task-card p-3 h-100">
        <div class="d-flex">
          <div class="task-priority priority-${task.priority} me-3"></div>
          <div class="flex-grow-1">
            <h6 class="mb-1">${task.title}</h6>
            <p class="text-muted small mb-2">${task.project}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="status-badge bg-light text-dark"><i class="bi bi-calendar"></i> ${formatDate(task.dueDate)}</span>
              <span class="status-badge bg-primary text-white">${getPriorityText(task.priority)}</span>
            </div>
            <small class="text-muted mt-1 d-block"><i class="bi bi-person"></i> ${task.assignee}</small>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

/** Inicializa la gráfica del dashboard */
function initializeChart() {
  const ctx = document.getElementById('progressChart');
  if (!ctx || typeof Chart === 'undefined') return;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [{
        label: 'Tareas Completadas',
        data: [12, 19, 15, 25, 32, 42, 47, 55, 0, 0, 0, 0],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' } },
        x: { grid: { display: true } }
      }
    }
  });
}

// === Utilidades compartidas por varios módulos del Frontend ===
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long' });
}

function getPriorityText(priority) {
  return AppConfig.PRIORITY_LEVELS[priority] || priority;
}
"""
open(os.path.join(assets_js, "dashboard.js"), "w", encoding="utf-8").write(textwrap.dedent(dashboard_js).strip()+"\n")

# ---- PROJECTS.JS ----
projects_js = """
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
"""
open(os.path.join(assets_js, "projects.js"), "w", encoding="utf-8").write(textwrap.dedent(projects_js).strip()+"\n")

# ---- TASKS.JS ----
tasks_js = """
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
"""
open(os.path.join(assets_js, "tasks.js"), "w", encoding="utf-8").write(textwrap.dedent(tasks_js).strip()+"\n")

# ---- TEAM.JS ----
team_js = """
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
"""
open(os.path.join(assets_js, "team.js"), "w", encoding="utf-8").write(textwrap.dedent(team_js).strip()+"\n")

# ---- AUTH.JS ----
auth_js = """
// === AUTENTICACIÓN (UI) ===
function logout() {
  if (!window.Swal) {
    window.location.href = 'login.html';
    return;
  }
  Swal.fire({
    title: '¿Cerrar sesión?',
    text: '¿Estás seguro de que quieres cerrar tu sesión?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) window.location.href = 'login.html';
  });
}
"""
open(os.path.join(assets_js, "auth.js"), "w", encoding="utf-8").write(textwrap.dedent(auth_js).strip()+"\n")

# ---- API.JS ----
api_js = """
// === SIMULACIÓN DE API ===
// En producción estas funciones realizarán fetch() reales al backend .NET
class TaskFlowAPI {
  static baseUrl = AppConfig.API_BASE_URL;

  static async login(credentials) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, token: 'jwt-token-example', user: { id: 1, name: 'Juan Pérez', role: 'admin' } });
      }, 800);
    });
  }

  static async getProjects() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, data: [
          { id: 1, name: 'TaskFlow Manager', status: 'active' },
          { id: 2, name: 'API Development', status: 'active' }
        ]});
      }, 600);
    });
  }

  static async createTask(taskData) {
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true, data: { id: Date.now(), ...taskData } }), 500);
    });
  }
}
"""
open(os.path.join(assets_js, "api.js"), "w", encoding="utf-8").write(textwrap.dedent(api_js).strip()+"\n")

# ---- INDEX.HTML (clean) ----
index_html = """
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TaskFlow Manager - Dashboard</title>

  <!-- Bootstrap 5.3 CSS -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
  <!-- Bootstrap Icons -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" rel="stylesheet" />
  <!-- SweetAlert2 CSS (para estilos por defecto del modal) -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.7.0/sweetalert2.min.css" rel="stylesheet" />

  <!-- App CSS -->
  <link href="./assets/css/theme.css" rel="stylesheet" />
  <link href="./assets/css/style.css" rel="stylesheet" />
</head>
<body>
  <!-- === SIDEBAR NAVIGATION === -->
  <nav class="sidebar">
    <div class="sidebar-header">
      <h4><i class="bi bi-kanban"></i> TaskFlow</h4>
      <small class="text-light opacity-75">Manager v1.0</small>
    </div>

    <ul class="nav flex-column nav-menu">
      <li class="nav-item">
        <a class="nav-link active" href="#dashboard" data-section="dashboard">
          <i class="bi bi-house-door"></i>Dashboard
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#projects" data-section="projects">
          <i class="bi bi-folder"></i>Proyectos
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#tasks" data-section="tasks">
          <i class="bi bi-check-square"></i>Tareas
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#team" data-section="team">
          <i class="bi bi-people"></i>Equipo
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#reports" data-section="reports">
          <i class="bi bi-graph-up"></i>Reportes
        </a>
      </li>
      <li class="nav-item">
        <hr class="text-light opacity-25 my-3" />
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#settings" data-section="settings">
          <i class="bi bi-gear"></i>Configuración
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" onclick="logout()">
          <i class="bi bi-box-arrow-right"></i>Cerrar Sesión
        </a>
      </li>
    </ul>
  </nav>

  <!-- === MAIN CONTENT === -->
  <main class="main-content">
    <!-- Top Navigation -->
    <nav class="navbar navbar-expand-lg top-nav">
      <div class="container-fluid">
        <!-- Mobile menu toggle -->
        <button class="btn btn-outline-primary d-lg-none" id="sidebarToggle">
          <i class="bi bi-list"></i>
        </button>

        <span class="navbar-brand mb-0 h1">Begining</span>

        <!-- User Menu -->
        <div class="dropdown">
          <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            <i class="bi bi-person-circle"></i> Alejandro Cancino
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#"><i class="bi bi-person"></i> Mi Perfil</a></li>
            <li><a class="dropdown-item" href="#"><i class="bi bi-gear"></i> Configuración</a></li>
            <li><hr class="dropdown-divider" /></li>
            <li><a class="dropdown-item" href="#" onclick="logout()"><i class="bi bi-box-arrow-right"></i> Cerrar Sesión</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container-fluid p-4" id="dashboard-content">
      <!-- Aquí se cargará dinámicamente la vista seleccionada desde /views -->
    </div>
  </main>

  <!-- Vendor JS -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.7.0/sweetalert2.min.js"></script>

  <!-- App JS -->
  <script src="./assets/js/app.js"></script>
  <script src="./assets/js/api.js"></script>
  <script src="./assets/js/auth.js"></script>
  <script src="./assets/js/navigation.js"></script>
  <script src="./assets/js/dashboard.js"></script>
  <script src="./assets/js/projects.js"></script>
  <script src="./assets/js/tasks.js"></script>
  <script src="./assets/js/team.js"></script>
</body>
</html>
"""
open(os.path.join(base, "index.html"), "w", encoding="utf-8").write(textwrap.dedent(index_html).strip()+"\n")

# ---- LOGIN.HTML ----
login_html = """
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TaskFlow - Iniciar Sesión</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" rel="stylesheet" />
  <link href="./assets/css/theme.css" rel="stylesheet" />
  <link href="./assets/css/style.css" rel="stylesheet" />
</head>
<body>
  <div class="container d-flex align-items-center justify-content-center" style="min-height: 100vh;">
    <div class="card shadow-lg p-4" style="max-width: 420px; width: 100%;">
      <h3 class="text-center mb-3">🔐 Iniciar Sesión</h3>
      <form onsubmit="event.preventDefault(); doLogin();">
        <div class="mb-3">
          <label class="form-label">Usuario</label>
          <input type="text" class="form-control" id="username" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Contraseña</label>
          <input type="password" class="form-control" id="password" required />
        </div>
        <button type="submit" class="btn btn-primary w-100">Ingresar</button>
      </form>
      <hr />
      <button class="btn btn-danger w-100 mt-2"><i class="bi bi-google"></i> Login con Google</button>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
  <script>
    async function doLogin() {
      // Simulación de login; en el backend real, se llamará a /auth/login
      window.location.href = './index.html';
    }
  </script>
</body>
</html>
"""
open(os.path.join(base, "login.html"), "w", encoding="utf-8").write(textwrap.dedent(login_html).strip()+"\n")

# ---- VIEWS ----

dashboard_view = """
<!-- === DASHBOARD VIEW === -->
<!-- Comentario: esta vista contiene la estructura del dashboard.
     La lógica que la alimenta vive en assets/js/dashboard.js (initDashboard). -->

<!-- Welcome Section -->
<div class="row mb-4">
  <div class="col-12">
    <h2 class="mb-1">¡Bienvenido de vuelta, Alejandro Cancino! 👋</h2>
    <p class="text-muted">Aquí tienes un resumen de tu actividad hoy</p>
  </div>
</div>

<!-- Statistic Cards -->
<div class="row mb-4">
  <div class="col-lg-3 col-md-6 mb-3">
    <div class="stat-card">
      <div class="d-flex align-items-center">
        <div class="stat-icon primary me-3"><i class="bi bi-kanban"></i></div>
        <div>
          <h4 class="mb-0" id="total-projects">0</h4>
          <small class="text-muted">Proyectos Activos</small>
        </div>
      </div>
    </div>
  </div>

  <div class="col-lg-3 col-md-6 mb-3">
    <div class="stat-card">
      <div class="d-flex align-items-center">
        <div class="stat-icon success me-3"><i class="bi bi-check-circle"></i></div>
        <div>
          <h4 class="mb-0" id="completed-tasks">0</h4>
          <small class="text-muted">Tareas Completadas</small>
        </div>
      </div>
    </div>
  </div>

  <div class="col-lg-3 col-md-6 mb-3">
    <div class="stat-card">
      <div class="d-flex align-items-center">
        <div class="stat-icon warning me-3"><i class="bi bi-clock"></i></div>
        <div>
          <h4 class="mb-0" id="pending-tasks">0</h4>
          <small class="text-muted">Tareas Pendientes</small>
        </div>
      </div>
    </div>
  </div>

  <div class="col-lg-3 col-md-6 mb-3">
    <div class="stat-card">
      <div class="d-flex align-items-center">
        <div class="stat-icon danger me-3"><i class="bi bi-exclamation-triangle"></i></div>
        <div>
          <h4 class="mb-0" id="overdue-tasks">0</h4>
          <small class="text-muted">Tareas Vencidas</small>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Charts and Recent Activity -->
<div class="row">
  <!-- Progress Chart -->
  <div class="col-lg-8 mb-4">
    <div class="stat-card">
      <h5 class="mb-3"><i class="bi bi-graph-up text-primary"></i> Progreso de Proyectos</h5>
      <div class="chart-container">
        <canvas id="progressChart"></canvas>
      </div>
    </div>
  </div>

  <!-- Recent Tasks -->
  <div class="col-lg-4 mb-4">
    <div class="stat-card">
      <h5 class="mb-3"><i class="bi bi-clock-history text-primary"></i> Actividad Reciente</h5>
      <div id="recent-activities"></div>
    </div>
  </div>
</div>

<!-- Upcoming Tasks -->
<div class="row">
  <div class="col-12">
    <div class="stat-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0"><i class="bi bi-calendar-check text-primary"></i> Próximas Tareas</h5>
        <button class="btn btn-primary btn-sm" onclick="showCreateTaskModal()">
          <i class="bi bi-plus"></i> Nueva Tarea
        </button>
      </div>
      <div class="row" id="upcoming-tasks"></div>
    </div>
  </div>
</div>
"""
open(os.path.join(views, "dashboard.html"), "w", encoding="utf-8").write(textwrap.dedent(dashboard_view).strip()+"\n")

projects_view = """
<!-- === PROJECTS VIEW === -->
<div class="row mb-4">
  <div class="col-12 d-flex justify-content-between align-items-center">
    <h2>Gestión de Proyectos</h2>
    <button class="btn btn-primary" onclick="/* showCreateProjectModal(); */">
      <i class="bi bi-plus"></i> Nuevo Proyecto
    </button>
  </div>
</div>

<!-- Filtros de proyectos -->
<div class="row mb-4">
  <div class="col-md-4">
    <input type="text" class="form-control" placeholder="Buscar proyectos..." id="projectSearch">
  </div>
  <div class="col-md-3">
    <select class="form-select" id="projectStatusFilter">
      <option value="">Todos los estados</option>
      <option value="active">Activo</option>
      <option value="completed">Completado</option>
      <option value="paused">Pausado</option>
    </select>
  </div>
  <div class="col-md-3">
    <select class="form-select" id="projectPriorityFilter">
      <option value="">Todas las prioridades</option>
      <option value="high">Alta</option>
      <option value="medium">Media</option>
      <option value="low">Baja</option>
    </select>
  </div>
  <div class="col-md-2">
    <button class="btn btn-outline-primary w-100" onclick="/* applyProjectFilters(); */">
      <i class="bi bi-funnel"></i> Filtrar
    </button>
  </div>
</div>

<!-- Lista de proyectos -->
<div class="row" id="projects-list"></div>
<script>
  // Hook inline para asegurar que initProjects se ejecute al insertar esta vista
  if (typeof initProjects === 'function') initProjects();
</script>
"""
open(os.path.join(views, "projects.html"), "w", encoding="utf-8").write(textwrap.dedent(projects_view).strip()+"\n")

tasks_view = """
<!-- === TASKS VIEW === -->
<div class="row mb-4">
  <div class="col-12 d-flex justify-content-between align-items-center">
    <h2>Gestión de Tareas</h2>
    <button class="btn btn-primary" onclick="showCreateTaskModal()"><i class="bi bi-plus"></i> Nueva Tarea</button>
  </div>
</div>

<div class="row">
  <div class="col-lg-3 col-md-6 mb-4">
    <div class="stat-card">
      <h6 class="text-muted mb-3"><i class="bi bi-clock text-warning"></i> Pendientes (<span id="pending-count">0</span>)</h6>
      <div class="kanban-column" id="pending-tasks-column"></div>
    </div>
  </div>

  <div class="col-lg-3 col-md-6 mb-4">
    <div class="stat-card">
      <h6 class="text-muted mb-3"><i class="bi bi-play text-info"></i> En Progreso (<span id="inprogress-count">0</span>)</h6>
      <div class="kanban-column" id="inprogress-tasks-column"></div>
    </div>
  </div>

  <div class="col-lg-3 col-md-6 mb-4">
    <div class="stat-card">
      <h6 class="text-muted mb-3"><i class="bi bi-eye text-primary"></i> En Revisión (<span id="review-count">0</span>)</h6>
      <div class="kanban-column" id="review-tasks-column"></div>
    </div>
  </div>

  <div class="col-lg-3 col-md-6 mb-4">
    <div class="stat-card">
      <h6 class="text-muted mb-3"><i class="bi bi-check-circle text-success"></i> Completadas (<span id="completed-count">0</span>)</h6>
      <div class="kanban-column" id="completed-tasks-column"></div>
    </div>
  </div>
</div>

<script>
  if (typeof initTasks === 'function') initTasks();
</script>
"""
open(os.path.join(views, "tasks.html"), "w", encoding="utf-8").write(textwrap.dedent(tasks_view).strip()+"\n")

team_view = """
<!-- === TEAM VIEW === -->
<div class="row mb-4">
  <div class="col-12 d-flex justify-content-between align-items-center">
    <h2>Gestión de Equipo</h2>
    <button class="btn btn-primary" onclick="/* showInviteUserModal(); */"><i class="bi bi-person-plus"></i> Invitar Usuario</button>
  </div>
</div>

<div class="row" id="team-grid"></div>
<script>
  if (typeof initTeam === 'function') initTeam();
</script>
"""
open(os.path.join(views, "team.html"), "w", encoding="utf-8").write(textwrap.dedent(team_view).strip()+"\n")

reports_view = "<!-- === REPORTS VIEW (placeholder) === --><h3>Reportes</h3><p>Contenido en desarrollo...</p>"
open(os.path.join(views, "reports.html"), "w", encoding="utf-8").write(reports_view)

settings_view = "<!-- === SETTINGS VIEW (placeholder) === --><h3>Configuración</h3><p>Contenido en desarrollo...</p>"
open(os.path.join(views, "settings.html"), "w", encoding="utf-8").write(settings_view)

# ---- Zip the project for download ----
zip_path = "/mnt/data/ServiceTrack.Frontend.zip"
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
    for foldername, subfolders, filenames in os.walk(base):
        for filename in filenames:
            path = os.path.join(foldername, filename)
            z.write(path, os.path.relpath(path, base))

zip_path
