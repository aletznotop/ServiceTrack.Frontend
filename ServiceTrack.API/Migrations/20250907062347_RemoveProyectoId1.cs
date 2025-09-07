using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServiceTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveProyectoId1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TAREAS_PROYECTOS_ProyectoId1",
                schema: "PROYECTOS",
                table: "TAREAS");

            migrationBuilder.DropIndex(
                name: "IX_TAREAS_ProyectoId1",
                schema: "PROYECTOS",
                table: "TAREAS");

            migrationBuilder.DropColumn(
                name: "ProyectoId1",
                schema: "PROYECTOS",
                table: "TAREAS");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProyectoId1",
                schema: "PROYECTOS",
                table: "TAREAS",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TAREAS_ProyectoId1",
                schema: "PROYECTOS",
                table: "TAREAS",
                column: "ProyectoId1");

            migrationBuilder.AddForeignKey(
                name: "FK_TAREAS_PROYECTOS_ProyectoId1",
                schema: "PROYECTOS",
                table: "TAREAS",
                column: "ProyectoId1",
                principalSchema: "PROYECTOS",
                principalTable: "PROYECTOS",
                principalColumn: "Id");
        }
    }
}
