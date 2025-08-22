using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceTrack.API.Data;
using ServiceTrack.API.Models;
using ServiceTrack.API.Services;
using System.Security.Cryptography;
using System.Text;

namespace ServiceTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ServiceTrackContext _context;
        private readonly JwtService _jwtService;

        public AuthController(ServiceTrackContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(Usuario user)
        {
            // Hash básico de contraseña
            user.PasswordHash = HashPassword(user.PasswordHash);
            _context.Usuarios.Add(user);
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Usuario login)
        {
            var user = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == login.Email);

            if (user == null || !VerifyPassword(login.PasswordHash, user.PasswordHash))
                return Unauthorized("Usuario o contraseña incorrectos");

            var token = _jwtService.GenerateToken(user.Id, user.Email, user.Rol);
            return Ok(new
            {
                token,
            user = new
            {
                id = user.Id,
                nombre = user.Nombre,
                email = user.Email,
                rol = user.Rol
            }
             });
        }

        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        private bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }
    }
}
