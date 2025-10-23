using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceTrack.API.Data;
using ServiceTrack.API.Models;

namespace ServiceTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly ServiceTrackContext _context;

        public TicketsController(ServiceTrackContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tickets>>> GetTickets()
        {
            return await _context.Tickets
                .Include(t => t.Proyecto)
                .Include(t => t.Assignee)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Tickets>> CreateTicket(Tickets ticket)
        {
            var proyecto = await _context.Proyectos
                .Include(p => p.Tareas) 
                .FirstOrDefaultAsync(p => p.Id == ticket.ProyectoId);

            if (proyecto == null)
                return BadRequest(new { message = "El proyecto no existe." });

            var usuario = await _context.Usuarios.FindAsync(ticket.AssigneeId);
            if (usuario == null)
                return BadRequest(new { message = "El usuario asignado no existe." });

            ticket.FechaCreacion = DateTime.Now;

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            // 🔹 Recalcular progreso
            // await UpdateProjectProgress(ticket.ProyectoId);

            return CreatedAtAction(nameof(GetTickets), new { id = ticket.Id }, ticket);
        }

    }
}