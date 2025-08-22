// === AUTENTICACIÓN (UI) ===

document.addEventListener("DOMContentLoaded", () => {
  const nombre = localStorage.getItem("userNombre");
  const email = localStorage.getItem("userEmail");

  if (!nombre) {
    // Si no hay sesión válida → al login
    window.location.href = "login.html";
    return;
  }

  // Poner el nombre en el header
  document.getElementById("userNameHeader").innerText = nombre;
  
  // Opcional: tooltip con el correo
  const userMenu = document.getElementById("userMenu");
  userMenu.setAttribute("title", email);
});


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
    if (result.isConfirmed) {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.clear();
    window.history.pushState(null,"",window.location.href);
    window.onpopstate = function() {
      window.history.go(1);
    }
    window.location.href = 'login.html';
    }else{
      Swal.fire({
        title: 'Sesión no cerrada',
        text: 'Tu sesión sigue activa.',
        icon: 'info'
      });
    }
  });
}
