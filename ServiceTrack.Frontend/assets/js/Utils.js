/** Formato fecha */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long' });
}

function getPriorityText(priority) {
  const map = { 3: "Alta", 2: "Media", 1: "Baja" };
  return map[priority] || priority;
}


window.Utils = {
    formatDate,
    getPriorityText
};