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
