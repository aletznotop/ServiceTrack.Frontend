async function initTickets() {
  const tickets = await fetchTickets();
  // Contadores
  setSectionCounts(tickets);

  // Agrupamos por estado
  const grouped = {
    pending: tickets.filter((t) => t.estado === "pending"),
    inProgress: tickets.filter((t) => t.estado === "inProgress"),
    review: tickets.filter((t) => t.estado === "review"),
    completed: tickets.filter((t) => t.estado === "completed"),
  };

  // Render columnas Kanban
  document.getElementById("pending-tickets-column").innerHTML =
    generateTicketsCards(grouped.pending);
  document.getElementById("inprogress-tickets-column").innerHTML =
    generateTicketsCards(grouped.inProgress);
  document.getElementById("completed-tickets-column").innerHTML =
    generateTicketsCards(grouped.completed);
}

async function fetchTickets() {
  try {
    const res = await fetch(`${API_BASE}/tickets`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error cargando tickets");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function fetchUsers() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/users`, {
      headers: { Authorization: "Bearer " + token },
    });
    if (!res.ok) throw new Error("Error cargando usuarios");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function fetchProjects() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/projects`, {
      headers: { Authorization: "Bearer " + token },
    });
    if (!res.ok) throw new Error("Error cargando proyectos");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

function setSectionCounts(tickets) {
  const pending = document.querySelector("#pending-count");
  const inprog = document.querySelector("#inprogress-count");
  const review = document.querySelector("#review-count");
  const done = document.querySelector("#completed-count");

  if (pending)
    pending.textContent = tickets.filter((t) => t.estado === "pending").length;
  if (inprog)
    inprog.textContent = tickets.filter(
      (t) => t.estado === "inProgress"
    ).length;
  if (review)
    review.textContent = tickets.filter((t) => t.estado === "review").length;
  if (done)
    done.textContent = tickets.filter((t) => t.estado === "completed").length;
}

function generateticketsCards(tickets) {
  return tickets
    .map(
      (tickets) => `
    <div class="tickets-card p-2 mb-2" draggable="true">
      <div class="d-flex justify-content-between">
        <div class="flex-grow-1">
          <h6 class="mb-1 small">${tickets.nombre}</h6>
          <small class="text-muted"><i class="bi bi-person"></i> ${
            tickets.assignee?.nombre || "Sin asignar"
          }</small>
          <br>
          <small class="text-muted"><i class="bi bi-calendar"></i> ${
            Utils.formatDate(tickets.fechaVencimiento) || "Sin fecha"
          }</small>
          <br>
          <small class="text-muted"><i class="bi bi-tag"></i> ${
            tickets.proyecto?.nombre || "Sin proyecto"
          }</small>
        </div>
        <div class="dropdown ms-2">
          <button class="btn btn-sm btn-light" data-bs-toggle="dropdown">
            <i class="bi bi-three-dots-vertical"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="javascript:void(0)" onclick='showEditticketsModal(${JSON.stringify(
              tickets
            )})'><i class="bi bi-pencil"></i> Editar</a></li>
            <li><a class="dropdown-item" href="javascript:void(0)" onclick='showticketsDetails(${JSON.stringify(
              tickets
            )})'><i class="bi bi-eye"></i> Ver detalles</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="confirmDeletetickets(${
              tickets.id
            })"><i class="bi bi-trash"></i> Eliminar</a></li>
          </ul>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

async function showCreateTicketModal() {
  if (!window.Swal) return;

  // 1. Traer proyectos desde el backend
  const proyectos = await fetchProjects();
  // 2 . Traer usuarios desde el backend
  const usuarios = await fetchUsers();

  const usuariosOptions = usuarios
    .map((u) => `<option value="${u.id}">${u.nombre}</option>`)
    .join("");
  const proyectosOptions = proyectos
    .map((p) => `<option value="${p.id}">${p.nombre}</option>`)
    .join("");
  // 2. Mostrar modal con formulario
  Swal.fire({
    title: "Crear Nuevo Ticket",
    html: `
      <div class="text-start">
        <div class="mb-3">
          <label class="form-label">Título del ticket</label>
          <input type="text" class="form-control" id="ticketTitle" placeholder="Ej: Error en Sistema Cogniti/Interface">
        </div>
        <div class="mb-3">
          <label class="form-label">Descripción</label>
          <textarea class="form-control" id="ticketDescription" rows="3" placeholder="Describe los detalles del ticket..."></textarea>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Prioridad</label>
            <select class="form-select" id="ticketPriority">
              <option value="low">Baja</option>
              <option value="medium" selected>Media</option>
              <option value="high">Alta</option>
            </select>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Asignar a (Usuario)</label>
          <select class="form-select" id="ticketAssignee">
            ${usuariosOptions}
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Proyecto</label>
          <select class="form-select" id="ticketProject">
            ${proyectosOptions}
          </select>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Crear Ticket",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#2563eb",
    preConfirm: () => {
      const title = document.getElementById("ticketTitle").value.trim();
      const description = document
        .getElementById("ticketDescription")
        .value.trim();
      const priority = document.getElementById("ticketPriority").value;
      const assignee = document.getElementById("ticketAssignee").value;
      const projectId = document.getElementById("ticketProject").value;
      if (!title) {
        Swal.showValidationMessage("El título es requerido");
        return false;
      }
      return { title, description, priority, assignee, projectId };
    },
  }).then((result) => {
    if (result.isConfirmed) createTicket(result.value);
  });
}

async function createTicket(ticketsData) {
  try {
    const res = await fetch(`${API_BASE}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        Nombre: ticketsData.title,
        Descripcion: ticketsData.description,
        Prioridad:
          ticketsData.priority === "low"
            ? 1
            : ticketsData.priority === "medium"
            ? 2
            : 3, // 🔄 conviértelo a int,
        AssigneeId: parseInt(ticketsData.assignee),
        ProyectoId: parseInt(ticketsData.projectId),
        Estado: "pending",
      }),
    });

    if (!res.ok) throw new Error("Error creando el Ticket ");

    Swal.fire({
      icon: "success",
      title: "¡Ticket creado!",
      text: `El ticket "${ticketsData.title}" ha sido creado exitosamente.`,
      timer: 2000,
      showConfirmButton: false,
    });

    // Recargar tickets
    initTickets();
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "No se pudo crear el ticket", "error");
  }
}

function generateTicketsCards(tickets) {
  return tickets
    .map(
      (ticket) => `
    <div class="task-card p-2 mb-2" draggable="true">
      <div class="d-flex justify-content-between">
        <div class="flex-grow-1">
          <h6 class="mb-1 small">${ticket.nombre}</h6>
          <small class="text-muted"><i class="bi bi-person"></i> ${
            ticket.assignee?.nombre || "Sin asignar"
          }</small>
          <br>
          <small class="text-muted"><i class="bi bi-calendar"></i> ${
            Utils.formatDate(ticket.fechaVencimiento) || "Sin fecha"
          }</small>
          <br>
          <small class="text-muted"><i class="bi bi-tag"></i> ${
            ticket.proyecto?.nombre || "Sin proyecto"
          }</small>
        </div>
        <div class="dropdown ms-2">
          <button class="btn btn-sm btn-light" data-bs-toggle="dropdown">
            <i class="bi bi-three-dots-vertical"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="javascript:void(0)" onclick='showEditTaskModal(${JSON.stringify(
              ticket
            )})'><i class="bi bi-pencil"></i> Editar</a></li>
            <li><a class="dropdown-item" href="javascript:void(0)" onclick='showTaskDetails(${JSON.stringify(
              ticket
            )})'><i class="bi bi-eye"></i> Ver detalles</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="confirmDeleteTask(${
              ticket.id
            })"><i class="bi bi-trash"></i> Eliminar</a></li>
          </ul>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}
