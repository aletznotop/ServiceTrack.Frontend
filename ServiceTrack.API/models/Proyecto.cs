using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceTrack.API.Models
{
 [Table("PROYECTOS",Schema = "PROYECTOS")]
    public class Proyecto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }

        // 🔹 Nuevos campos
        public string Status { get; set; } = "active";    // active, completed, paused
        public string Priority { get; set; } = "medium";  // high, medium, low
        public int Progress { get; set; } = 0;            // 0-100
        public int TeamSize { get; set; } = 1;            // número de miembros
        public string Manager { get; set; } = "Sin asignar";

        // Relación con Usuario
        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }
    }
}
