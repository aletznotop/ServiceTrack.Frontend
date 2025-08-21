using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServiceTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class AddSchemas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Proyectos_Usuarios_UsuarioId",
                table: "Proyectos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Usuarios",
                table: "Usuarios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Proyectos",
                table: "Proyectos");

            migrationBuilder.EnsureSchema(
                name: "PROYECTOS");

            migrationBuilder.EnsureSchema(
                name: "SEGURIDAD");

            migrationBuilder.RenameTable(
                name: "Usuarios",
                newName: "USUARIOS",
                newSchema: "SEGURIDAD");

            migrationBuilder.RenameTable(
                name: "Proyectos",
                newName: "PROYECTOS",
                newSchema: "PROYECTOS");

            migrationBuilder.RenameIndex(
                name: "IX_Proyectos_UsuarioId",
                schema: "PROYECTOS",
                table: "PROYECTOS",
                newName: "IX_PROYECTOS_UsuarioId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_USUARIOS",
                schema: "SEGURIDAD",
                table: "USUARIOS",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PROYECTOS",
                schema: "PROYECTOS",
                table: "PROYECTOS",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PROYECTOS_USUARIOS_UsuarioId",
                schema: "PROYECTOS",
                table: "PROYECTOS",
                column: "UsuarioId",
                principalSchema: "SEGURIDAD",
                principalTable: "USUARIOS",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PROYECTOS_USUARIOS_UsuarioId",
                schema: "PROYECTOS",
                table: "PROYECTOS");

            migrationBuilder.DropPrimaryKey(
                name: "PK_USUARIOS",
                schema: "SEGURIDAD",
                table: "USUARIOS");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PROYECTOS",
                schema: "PROYECTOS",
                table: "PROYECTOS");

            migrationBuilder.RenameTable(
                name: "USUARIOS",
                schema: "SEGURIDAD",
                newName: "Usuarios");

            migrationBuilder.RenameTable(
                name: "PROYECTOS",
                schema: "PROYECTOS",
                newName: "Proyectos");

            migrationBuilder.RenameIndex(
                name: "IX_PROYECTOS_UsuarioId",
                table: "Proyectos",
                newName: "IX_Proyectos_UsuarioId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Usuarios",
                table: "Usuarios",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Proyectos",
                table: "Proyectos",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Proyectos_Usuarios_UsuarioId",
                table: "Proyectos",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
