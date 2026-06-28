using System.ComponentModel.DataAnnotations;

namespace BreweryControl.Api.Dtos;

public record CreateTankRequest(
    [property: Required(ErrorMessage = "Nome é obrigatório")]
    [property: MaxLength(100)]
    string Name,

    [property: Range(0.01, 1_000_000, ErrorMessage = "Capacidade deve ser maior que zero")]
    decimal CapacityLiters);

public record UpdateTankRequest(
    [property: MaxLength(100)] string? Name,
    [property: Range(0.01, 1_000_000, ErrorMessage = "Capacidade deve ser maior que zero")]
    decimal? CapacityLiters);

public record TankResponse(int Id, string Name, decimal CapacityLiters);
