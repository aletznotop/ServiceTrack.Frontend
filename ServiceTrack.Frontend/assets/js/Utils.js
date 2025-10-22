/** Formato fecha */
const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:81/api`;

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long' });
}

function getPriorityText(priority) {
  const map = { 3: "Alta", 2: "Media", 1: "Baja" };
  return map[priority] || priority;
}

function mapPriorityToInt(priority) {
  switch (priority) {
    case "low": return 1;
    case "medium": return 2;
    case "high": return 3;
    default: return 2;
  }
}

function mapStatusToString(status) {
  switch (status) {
    case "pending": return "pendiente";
    case "inProgress": return "en progreso";
    case "completed": return "completada";
    default: return "pendiente";
  }
}

window.Utils = {
    formatDate,
    getPriorityText,
    mapPriorityToInt,
    mapStatusToString,
    API_BASE_URL
};