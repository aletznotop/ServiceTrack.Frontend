using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServiceTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class AddTicketsTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TICKETS",
                schema: "PROYECTOS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Prioridad = table.Column<int>(type: "int", nullable: false),
                    ProyectoId = table.Column<int>(type: "int", nullable: false),
                    AssigneeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TICKETS", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TICKETS_PROYECTOS_ProyectoId",
                        column: x => x.ProyectoId,
                        principalSchema: "PROYECTOS",
                        principalTable: "PROYECTOS",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TICKETS_USUARIOS_AssigneeId",
                        column: x => x.AssigneeId,
                        principalSchema: "SEGURIDAD",
                        principalTable: "USUARIOS",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TICKETS_AssigneeId",
                schema: "PROYECTOS",
                table: "TICKETS",
                column: "AssigneeId");

            migrationBuilder.CreateIndex(
                name: "IX_TICKETS_ProyectoId",
                schema: "PROYECTOS",
                table: "TICKETS",
                column: "ProyectoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TICKETS",
                schema: "PROYECTOS");
        }
    }
}
