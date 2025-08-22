const API_DASHBOARD = "http://localhost:5176/api/dashboard";

function initDashboard() {
  const nombre = localStorage.getItem("userNombre") || "Usuario";
  const span = document.getElementById("userNombreHeader");
  if (span) span.innerText = nombre;

  loadStatistics();
  loadRecentActivities();
  loadUpcomingTasks();
  initializeChart();
}

/** Estadísticas desde API */
function loadStatistics() {
  fetch(`${API_DASHBOARD}/statistics`, {
    headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
  })
    .then(r => r.json())
    .then(stats => {
      animateCounter('total-projects', stats.totalProjects);
      animateCounter('completed-tasks', stats.completedTasks);
      animateCounter('pending-tasks', stats.pendingTasks);
      animateCounter('overdue-tasks', stats.overdueTasks);
    })
    .catch(err => console.error("Error estadísticas", err));
}

/** Actividades recientes */
function loadRecentActivities() {
  fetch(`${API_DASHBOARD}/recent-activities`, {
    headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
  })
    .then(r => r.json())
    .then(activities => {
      const container = document.getElementById('recent-activities');
      if (!container) return;
      container.innerHTML = activities.map(a => `
        <div class="d-flex align-items-start mb-3">
          <i class="bi bi-${a.icon} ${a.class} me-2 mt-1"></i>
          <div class="flex-grow-1">
            <p class="mb-1 small">${a.text}</p>
            <small class="text-muted">${formatDate(a.time)}</small>
          </div>
        </div>
      `).join('');
    })
    .catch(err => console.error("Error actividades", err));
}

/** Próximas tareas */
function loadUpcomingTasks() {
  fetch(`${API_DASHBOARD}/upcoming-tasks`, {
    headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
  })
    .then(r => r.json())
    .then(tasks => {
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
    })
    .catch(err => console.error("Error próximas tareas", err));
}

/** Animación contador */
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

/** Formato fecha */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long' });
}

function getPriorityText(priority) {
  const map = { high: "Alta", medium: "Media", low: "Baja" };
  return map[priority] || priority;
}

/** Inicializa la gráfica del dashboard */
function initializeChart() {
  const ctx = document.getElementById('progressChart');
  if (!ctx || typeof Chart === 'undefined') return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
      datasets: [{
        label: 'Tareas Completadas',
        data: [5, 10, 8, 15, 20, 25, 30, 35], // luego lo puedes reemplazar con datos reales
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
        y: { beginAtZero: true },
        x: { grid: { display: true } }
      }
    }
  });
}
