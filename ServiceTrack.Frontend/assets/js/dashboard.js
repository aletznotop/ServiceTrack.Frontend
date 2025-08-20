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
