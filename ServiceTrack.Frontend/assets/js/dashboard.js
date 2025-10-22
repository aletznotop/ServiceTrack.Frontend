const API_DASHBOARD = Utils.API_BASE_URL + "/dashboard";

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
    headers: { "Authorization": "Bearer " + localStorage.getItem("token") ,
      "Content-Type": "application/json"
    }
  })
    .then(r => r.json())
    .then(stats => {
      animateCounter('total-projects', stats.totalProjects);
      animateCounter('completed-tasks', stats.completedTasks);
      animateCounter('pending-tasks', stats.pendingTasks);
      animateCounter('overdue-tasks', stats.overdueTasks);
      animateCounter('revisanding-tasks', stats.underReviewTasks);
      animateCounter('inProgress-tasks', stats.inProgressTasks);
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
              <div class="task-priority priority-${task.prioridad} me-3"></div>
              <div class="flex-grow-1">
                <h6 class="mb-1">${task.nombre}</h6>
                <p class="text-muted small mb-2">${task.proyecto}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="status-badge bg-light text-dark"><i class="bi bi-calendar"></i> ${Utils.formatDate(task.fechaVencimiento)}</span>
                  <span class="status-badge bg-primary text-white">${Utils.getPriorityText(task.prioridad)}</span>
                </div>
                <small class="text-muted mt-1 d-block"><i class="bi bi-person"></i> ${task.assignee?.nombre || "Sin asignar"}</small>
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


/** Inicializa la gráfica del dashboard */
async function initializeChart() {
  const ctx = document.getElementById('progressChart');
  if (!ctx || typeof Chart === 'undefined') return;

  try {
    const res = await fetch(`${API_BASE_URL}/tasks/report/monthly`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (!res.ok) throw new Error("Error cargando reporte");
    const data = await res.json();
  const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago','Sep','Oct','Nov','Dic'];
    const dataset = Array(12).fill(0); // inicializar 12 meses en 0

    data.forEach(item => {
      dataset[item.mes - 1] = item.total; // Mes empieza en 1, array en 0
    });


  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago','Sep','Oct','Nov','Dic'],
      datasets: [{
        label: 'Tareas Completadas',
        data: dataset, 
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
}catch(err){
  console.error("Error inicializando gráfica", err);
}}
