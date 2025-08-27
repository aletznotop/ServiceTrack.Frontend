using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServiceTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class FixMultipleCascadePaths : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ACTIVIDADES_PROYECTOS_ProyectoId",
                schema: "PROYECTOS",
                table: "ACTIVIDADES");

            migrationBuilder.DropForeignKey(
                name: "FK_EQUIPOS_PROYECTOS_ProyectoId",
                schema: "PROYECTOS",
                table: "EQUIPOS");

            migrationBuilder.DropForeignKey(
                name: "FK_PROYECTOS_USUARIOS_UsuarioId",
                schema: "PROYECTOS",
                table: "PROYECTOS");

            migrationBuilder.DropForeignKey(
                name: "FK_TAREAS_PROYECTOS_ProyectoId",
                schema: "PROYECTOS",
                table: "TAREAS");

            migrationBuilder.AddColumn<int>(
                name: "AssigneeId",
                schema: "PROYECTOS",
                table: "TAREAS",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TAREAS_AssigneeId",
                schema: "PROYECTOS",
                table: "TAREAS",
                column: "AssigneeId");

            migrationBuilder.AddForeignKey(
                name: "FK_ACTIVIDADES_PROYECTOS_ProyectoId",
                schema: "PROYECTOS",
                table: "ACTIVIDADES",
                column: "ProyectoId",
                principalSchema: "PROYECTOS",
                principalTable: "PROYECTOS",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_EQUIPOS_PROYECTOS_ProyectoId",
                schema: "PROYECTOS",
                table: "EQUIPOS",
                column: "ProyectoId",
                principalSchema: "PROYECTOS",
                principalTable: "PROYECTOS",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PROYECTOS_USUARIOS_UsuarioId",
                schema: "PROYECTOS",
                table: "PROYECTOS",
                column: "UsuarioId",
                principalSchema: "SEGURIDAD",
                principalTable: "USUARIOS",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TAREAS_PROYECTOS_ProyectoId",
                schema: "PROYECTOS",
                table: "TAREAS",
                column: "ProyectoId",
                principalSchema: "PROYECTOS",
                principalTable: "PROYECTOS",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TAREAS_USUARIOS_AssigneeId",
                schema: "PROYECTOS",
                table: "TAREAS",
                column: "AssigneeId",
                principalSchema: "SEGURIDAD",
                principalTable: "USUARIOS",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ACTIVIDADES_PROYECTOS_ProyectoId",
                schema: "PROYECTOS",
                table: "ACTIVIDADES");

            migrationBuilder.DropForeignKey(
                name: "FK_EQUIPOS_PROYECTOS_ProyectoId",
                schema: "PROYECTOS",
                table: "EQUIPOS");

            migrationBuilder.DropForeignKey(
                name: "FK_PROYECTOS_USUARIOS_UsuarioId",
                schema: "PROYECTOS",
                table: "PROYECTOS");

            migrationBuilder.DropForeignKey(
                name: "FK_TAREAS_PROYECTOS_ProyectoId",
                schema: "PROYECTOS",
                table: "TAREAS");

            migrationBuilder.DropForeignKey(
                name: "FK_TAREAS_USUARIOS_AssigneeId",
                schema: "PROYECTOS",
                table: "TAREAS");

            migrationBuilder.DropIndex(
                name: "IX_TAREAS_AssigneeId",
                schema: "PROYECTOS",
                table: "TAREAS");

            migrationBuilder.DropColumn(
                name: "AssigneeId",
                schema: "PROYECTOS",
                table: "TAREAS");

            migrationBuilder.AddForeignKey(
                name: "FK_ACTIVIDADES_PROYECTOS_ProyectoId",
                schema: "PROYECTOS",
                table: "ACTIVIDADES",
                column: "ProyectoId",
                principalSchema: "PROYECTOS",
                principalTable: "PROYECTOS",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EQUIPOS_PROYECTOS_ProyectoId",
                schema: "PROYECTOS",
                table: "EQUIPOS",
                column: "ProyectoId",
                principalSchema: "PROYECTOS",
                principalTable: "PROYECTOS",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PROYECTOS_USUARIOS_UsuarioId",
                schema: "PROYECTOS",
                table: "PROYECTOS",
                column: "UsuarioId",
                principalSchema: "SEGURIDAD",
                principalTable: "USUARIOS",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TAREAS_PROYECTOS_ProyectoId",
                schema: "PROYECTOS",
                table: "TAREAS",
                column: "ProyectoId",
                principalSchema: "PROYECTOS",
                principalTable: "PROYECTOS",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
