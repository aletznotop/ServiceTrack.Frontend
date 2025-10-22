using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceTrack.API.Data;   // Asegúrate que este namespace es el de tu DbContext
using System;
using System.Linq;

namespace ServiceTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Requiere token JWT
    public class DashboardController : ControllerBase
    {
        private readonly ServiceTrackContext _context;

        public DashboardController(ServiceTrackContext context)
        {
            _context = context;
        }

        // === Estadísticas ===
        [HttpGet("statistics")]
        public IActionResult GetStatistics()
        {
            var stats = new
            {
                totalProjects = _context.Proyectos.Count(),
                completedTasks = _context.Tareas.Count(t => t.Estado == "completed"),
                pendingTasks = _context.Tareas.Count(t => t.Estado == "pending"),
                underReviewTasks = _context.Tareas.Count(t => t.Estado == "review"),
                inProgressTasks = _context.Tareas.Count(t => t.Estado == "inProgress"),
                overdueTasks = _context.Tareas.Count(t => t.FechaVencimiento < DateTime.Now && t.Estado != "completed")
            };
            return Ok(stats);
        }

        // === Actividades recientes ===
        [HttpGet("recent-activities")]
        public IActionResult GetRecentActivities()
        {
            var activities = _context.Actividades
                .OrderByDescending(a => a.FechaCreacion)
                .Take(5)
                .Select(a => new
                {
                    text = a.Descripcion,
                    time = a.FechaCreacion,
                    icon = a.Tipo
                    //@class = a.CssClass
                })
                .ToList();

            return Ok(activities);
        }

        // === Próximas tareas ===
        [HttpGet("upcoming-tasks")]
        public IActionResult GetUpcomingTasks()
        {
            var tasks = _context.Tareas
                .Where(t => t.FechaVencimiento >= DateTime.Now && t.Estado != "completed")
                .OrderBy(t => t.FechaVencimiento)
                .Take(10)
                .Select(t => new
                {
                    id = t.Id,
                    nombre = t.Nombre,
                    proyecto = t.Proyecto != null ? t.Proyecto.Nombre : "Sin proyecto",
                    prioridad = t.Prioridad,
                    fechaVencimiento = t.FechaVencimiento
                })
                .ToList();

            return Ok(tasks);
        }
    }
}
