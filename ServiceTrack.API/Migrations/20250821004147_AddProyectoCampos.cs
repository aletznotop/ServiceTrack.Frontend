using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServiceTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProyectoCampos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Manager",
                table: "Proyectos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Priority",
                table: "Proyectos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Progress",
                table: "Proyectos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Proyectos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "TeamSize",
                table: "Proyectos",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Manager",
                table: "Proyectos");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "Proyectos");

            migrationBuilder.DropColumn(
                name: "Progress",
                table: "Proyectos");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Proyectos");

            migrationBuilder.DropColumn(
                name: "TeamSize",
                table: "Proyectos");
        }
    }
}
