using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceTrack.API.Models
{
    [Table("USUARIOS", Schema = "SEGURIDAD")]
    public class Usuario
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Rol { get; set; } = "User"; // Admin, Manager, User
    }
}
// This class represents a user in the ServiceTrack API, with properties for ID, name, email, password hash, and role.