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
