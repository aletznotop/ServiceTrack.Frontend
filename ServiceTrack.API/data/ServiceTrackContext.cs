using Microsoft.EntityFrameworkCore;
using ServiceTrack.API.Models;

namespace ServiceTrack.API.Data
{
    public class ServiceTrackContext : DbContext
    {
        public ServiceTrackContext(DbContextOptions<ServiceTrackContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Proyecto> Proyectos { get; set; }
        public DbSet<Actividades> Actividades { get; set; }
        public DbSet<Tareas> Tareas { get; set; }
        public DbSet<Equipos> Equipos { get; set; }
        // Luego añadimos Tareas y Equipos

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // === Relación Proyecto -> Usuario ===
            modelBuilder.Entity<Proyecto>()
                .HasOne(p => p.Usuario)
                .WithMany()
                .HasForeignKey(p => p.UsuarioId)
                .OnDelete(DeleteBehavior.NoAction);

            // === Relación Actividad -> Proyecto ===
            modelBuilder.Entity<Actividades>()
                .HasOne(a => a.Proyecto)
                .WithMany()
                .HasForeignKey(a => a.ProyectoId)
                .OnDelete(DeleteBehavior.NoAction);

            // === Relación Equipo -> Proyecto ===
            modelBuilder.Entity<Equipos>()
                .HasOne(e => e.Proyecto)
                .WithMany()
                .HasForeignKey(e => e.ProyectoId)
                .OnDelete(DeleteBehavior.NoAction);

            // === Relación Tarea -> Proyecto ===
            modelBuilder.Entity<Tareas>()
                .HasOne(t => t.Proyecto)
                .WithMany()
                .HasForeignKey(t => t.ProyectoId)
                .OnDelete(DeleteBehavior.NoAction);

            // === Relación Tarea -> Usuario (Assignee) ===
            // 👇 Aquí es donde quitamos Cascade para evitar múltiples rutas de borrado
            modelBuilder.Entity<Tareas>()
                .HasOne(t => t.Assignee)
                .WithMany()
                .HasForeignKey(t => t.AssigneeId)
                .OnDelete(DeleteBehavior.NoAction); // o NoAction si prefieres
        }
    }
}
