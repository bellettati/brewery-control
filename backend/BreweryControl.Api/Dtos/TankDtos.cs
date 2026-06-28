using System.ComponentModel.DataAnnotations;

namespace BreweryControl.Api.Dtos;

public record CreateTankRequest(
    [Required(ErrorMessage = "Nome é obrigatório")]
    [MaxLength(100)]
    string Name,

    [Range(0.01, 1_000_000, ErrorMessage = "Capacidade deve ser maior que zero")]
    decimal CapacityLiters);

public record UpdateTankRequest(
    [MaxLength(100)] string? Name,
    [Range(0.01, 1_000_000, ErrorMessage = "Capacidade deve ser maior que zero")]
    decimal? CapacityLiters);

public record TankResponse(int Id, string Name, decimal CapacityLiters);
