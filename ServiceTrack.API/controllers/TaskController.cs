using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceTrack.API.Data;
using ServiceTrack.API.Models;

namespace ServiceTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ServiceTrackContext _context;

        public TasksController(ServiceTrackContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tareas>>> GetTasks()
        {
            return await _context.Tareas
                .Include(t => t.Proyecto)
                .Include(t => t.Assignee)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Tareas>> CreateTask(Tareas task)
        {
            var proyecto = await _context.Proyectos
                .Include(p => p.Tareas) 
                .FirstOrDefaultAsync(p => p.Id == task.ProyectoId);

            if (proyecto == null)
                return BadRequest(new { message = "El proyecto no existe." });

            var usuario = await _context.Usuarios.FindAsync(task.AssigneeId);
            if (usuario == null)
                return BadRequest(new { message = "El usuario asignado no existe." });

            task.FechaCreacion = DateTime.Now;

            _context.Tareas.Add(task);
            await _context.SaveChangesAsync();

            // 🔹 Recalcular progreso
            await UpdateProjectProgress(task.ProyectoId);

            return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, Tareas task)
        {
            if (id != task.Id) return BadRequest();

            _context.Entry(task).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            // 🔹 Recalcular progreso
            await UpdateProjectProgress(task.ProyectoId);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tareas.FindAsync(id);
            if (task == null) return NotFound();

            int projectId = task.ProyectoId;

            _context.Tareas.Remove(task);
            await _context.SaveChangesAsync();

            // 🔹 Recalcular progreso
            await UpdateProjectProgress(projectId);

            return NoContent();
        }

        [HttpGet("report/monthly")]
        public async Task<ActionResult<IEnumerable<TareasMesDto>>> GetMonthlyTaskReport()
        {
            var tareasPorMes = await _context.Tareas
                .Where(t => t.Estado == "completed") // 👈 ojo, tu modelo usa "completada" en español
                .GroupBy(t => t.FechaCreacion.Month)
                .Select(g => new TareasMesDto
                {
                    Mes = g.Key,
                    Total = g.Count()
                })
                .OrderBy(x => x.Mes)
                .ToListAsync();

            return Ok(tareasPorMes);
        }

        // =====================================================
        // 🔹 MÉTODO PRIVADO PARA ACTUALIZAR PROGRESO DE PROYECTO
        // =====================================================
        private async Task UpdateProjectProgress(int projectId)
        {
            var project = await _context.Proyectos
                .Include(p => p.Tareas)
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project != null && project.Tareas.Any())
            {
                int total = project.Tareas.Count;
                int completadas = project.Tareas.Count(t => t.Estado == "completed");

                project.Progress = (int)Math.Round((double)completadas / total * 100);

                _context.Proyectos.Update(project);
                await _context.SaveChangesAsync();
            }
        }
    }
}
