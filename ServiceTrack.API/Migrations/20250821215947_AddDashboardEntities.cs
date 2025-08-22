using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServiceTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDashboardEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ACTIVIDADES",
                schema: "PROYECTOS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaVencimiento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Prioridad = table.Column<int>(type: "int", nullable: false),
                    ProyectoId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ACTIVIDADES", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ACTIVIDADES_PROYECTOS_ProyectoId",
                        column: x => x.ProyectoId,
                        principalSchema: "PROYECTOS",
                        principalTable: "PROYECTOS",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EQUIPOS",
                schema: "PROYECTOS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProyectoId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EQUIPOS", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EQUIPOS_PROYECTOS_ProyectoId",
                        column: x => x.ProyectoId,
                        principalSchema: "PROYECTOS",
                        principalTable: "PROYECTOS",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TAREAS",
                schema: "PROYECTOS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaVencimiento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Prioridad = table.Column<int>(type: "int", nullable: false),
                    ProyectoId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TAREAS", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TAREAS_PROYECTOS_ProyectoId",
                        column: x => x.ProyectoId,
                        principalSchema: "PROYECTOS",
                        principalTable: "PROYECTOS",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ACTIVIDADES_ProyectoId",
                schema: "PROYECTOS",
                table: "ACTIVIDADES",
                column: "ProyectoId");

            migrationBuilder.CreateIndex(
                name: "IX_EQUIPOS_ProyectoId",
                schema: "PROYECTOS",
                table: "EQUIPOS",
                column: "ProyectoId");

            migrationBuilder.CreateIndex(
                name: "IX_TAREAS_ProyectoId",
                schema: "PROYECTOS",
                table: "TAREAS",
                column: "ProyectoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ACTIVIDADES",
                schema: "PROYECTOS");

            migrationBuilder.DropTable(
                name: "EQUIPOS",
                schema: "PROYECTOS");

            migrationBuilder.DropTable(
                name: "TAREAS",
                schema: "PROYECTOS");
        }
    }
}
