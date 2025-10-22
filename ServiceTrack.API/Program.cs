using Microsoft.EntityFrameworkCore;
using ServiceTrack.API.Data;
using ServiceTrack.API.Services;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ====================== 🔐 CONFIGURACIÓN JWT ======================
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // ✅ en dev
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// ====================== 🧩 BASE DE DATOS ======================
builder.Services.AddDbContext<ServiceTrackContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ====================== 🌐 CONFIGURACIÓN CORS ======================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://127.0.0.1:5500",   // VSCode Live Server
                "http://localhost:5500",   // Variante Live Server
                "http://127.0.0.1:81",     // API HTTP local
                "https://127.0.0.1:443",   // API HTTPS local
                "http://localhost"         // fallback general
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// ====================== 🧰 SERVICIOS ======================
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthorization();
builder.Services.AddScoped<JwtService>();
builder.Services.AddControllers();

var app = builder.Build();

// ====================== 🚀 PIPELINE DE LA APLICACIÓN ======================
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ⚠️ MUY IMPORTANTE: CORS antes de HTTPS y Auth
app.UseCors("AllowFrontend");

// En producción usamos HTTPS, en desarrollo no
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// 🔑 Autenticación y autorización
app.UseAuthentication();
app.UseAuthorization();

// ====================== 🌦️ ENDPOINT DE EJEMPLO ======================
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast(
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

// ====================== 🧭 CONTROLADORES ======================
app.MapControllers();

// ====================== 🟢 ARRANQUE ======================
app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
