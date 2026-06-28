using System.ComponentModel.DataAnnotations;

namespace BreweryControl.Api.Dtos;

public record CreateBeerRequest(
    [Required(ErrorMessage = "Nome é obrigatório")]
    [MaxLength(100)]
    string Name,

    [Required(ErrorMessage = "Estilo é obrigatório")]
    [MaxLength(100)]
    string Style,

    [Range(-50, 100, ErrorMessage = "Temperatura fora da faixa permitida")]
    decimal TempMin,
    [Range(-50, 100, ErrorMessage = "Temperatura fora da faixa permitida")]
    decimal TempMax,

    [Range(0, 14, ErrorMessage = "pH deve estar entre 0 e 14")]
    decimal PhMin,
    [Range(0, 14, ErrorMessage = "pH deve estar entre 0 e 14")]
    decimal PhMax,

    [Range(0, 100, ErrorMessage = "Extrato deve estar entre 0 e 100")]
    decimal ExtractMin,
    [Range(0, 100, ErrorMessage = "Extrato deve estar entre 0 e 100")]
    decimal ExtractMax);

public record UpdateBeerRequest(
    [MaxLength(100)] string? Name,
    [MaxLength(100)] string? Style,
    [Range(-50, 100)] decimal? TempMin,
    [Range(-50, 100)] decimal? TempMax,
    [Range(0, 14)] decimal? PhMin,
    [Range(0, 14)] decimal? PhMax,
    [Range(0, 100)] decimal? ExtractMin,
    [Range(0, 100)] decimal? ExtractMax);

public record BeerResponse(
    int Id, string Name, string Style,
    decimal TempMin, decimal TempMax,
    decimal PhMin, decimal PhMax,
    decimal ExtractMin, decimal ExtractMax);
