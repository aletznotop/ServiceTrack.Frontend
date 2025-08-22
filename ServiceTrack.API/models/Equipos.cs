using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceTrack.API.Models
{
    [Table("EQUIPOS", Schema = "PROYECTOS")]
    public class Equipos
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public int ProyectoId { get; set; }
        public Proyecto Proyecto { get; set; } = null!;
    }
}
// This class represents a team in the ServiceTrack API, with properties for ID, name, description, creation date, and associated project.