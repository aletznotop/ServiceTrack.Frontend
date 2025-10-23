
function initReports() {
  console.log("Dashboard initialized");
  const nombre = localStorage.getItem("userNombre") || "Usuario";
  console.log("User name:", nombre);
}