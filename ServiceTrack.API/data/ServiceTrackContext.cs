using Microsoft.EntityFrameworkCore;
using ServiceTrack.API.Models;

namespace ServiceTrack.API.Data
{
    public class ServiceTrackContext : DbContext
    {
        public ServiceTrackContext(DbContextOptions<ServiceTrackContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Proyecto> Proyectos { get; set; }
        // Luego añadimos Tareas y Equipos
    }
}
