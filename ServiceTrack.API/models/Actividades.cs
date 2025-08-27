using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceTrack.API.Models
{
    [Table("ACTIVIDADES", Schema = "PROYECTOS")]
    public class Actividades
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Estado { get; set; } = "pendiente"; // pendiente, en progreso, completada
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public DateTime FechaVencimiento { get; set; }
        public int Prioridad { get; set; } // 1: baja, 2: media, 3: alta
        public int ProyectoId { get; set; }
        public int Tipo { get; set; }
        public Proyecto Proyecto { get; set; } = null!;
    }
}
// This class represents a task in the ServiceTrack API, with properties for ID, name, description, status, creation date, due date, priority, and associated project.