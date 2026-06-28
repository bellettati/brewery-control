using System.ComponentModel.DataAnnotations;

namespace BreweryControl.Api.Dtos;

public record CreateBeerRequest(
    [property: Required(ErrorMessage = "Nome é obrigatório")]
    [property: MaxLength(100)]
    string Name,

    [property: Required(ErrorMessage = "Estilo é obrigatório")]
    [property: MaxLength(100)]
    string Style,

    [property: Range(-50, 100, ErrorMessage = "Temperatura fora da faixa permitida")]
    decimal TempMin,
    [property: Range(-50, 100, ErrorMessage = "Temperatura fora da faixa permitida")]
    decimal TempMax,

    [property: Range(0, 14, ErrorMessage = "pH deve estar entre 0 e 14")]
    decimal PhMin,
    [property: Range(0, 14, ErrorMessage = "pH deve estar entre 0 e 14")]
    decimal PhMax,

    [property: Range(0, 100, ErrorMessage = "Extrato deve estar entre 0 e 100")]
    decimal ExtractMin,
    [property: Range(0, 100, ErrorMessage = "Extrato deve estar entre 0 e 100")]
    decimal ExtractMax);

public record UpdateBeerRequest(
    [property: MaxLength(100)] string? Name,
    [property: MaxLength(100)] string? Style,
    [property: Range(-50, 100)] decimal? TempMin,
    [property: Range(-50, 100)] decimal? TempMax,
    [property: Range(0, 14)] decimal? PhMin,
    [property: Range(0, 14)] decimal? PhMax,
    [property: Range(0, 100)] decimal? ExtractMin,
    [property: Range(0, 100)] decimal? ExtractMax);

public record BeerResponse(
    int Id, string Name, string Style,
    decimal TempMin, decimal TempMax,
    decimal PhMin, decimal PhMax,
    decimal ExtractMin, decimal ExtractMax);
