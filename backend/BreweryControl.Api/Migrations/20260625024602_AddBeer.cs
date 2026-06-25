using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BreweryControl.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddBeer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Beers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Style = table.Column<string>(type: "text", nullable: false),
                    TempMin = table.Column<decimal>(type: "numeric", nullable: false),
                    TempMax = table.Column<decimal>(type: "numeric", nullable: false),
                    PhMin = table.Column<decimal>(type: "numeric", nullable: false),
                    PhMax = table.Column<decimal>(type: "numeric", nullable: false),
                    ExtractMin = table.Column<decimal>(type: "numeric", nullable: false),
                    ExtractMax = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Beers", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Beers");
        }
    }
}
