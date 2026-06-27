namespace BreweryControl.Api.Dtos;

public record CreateBeerRequest(
    string Name,
    string Style,
    decimal TempMin,
    decimal TempMax,
    decimal PhMin,
    decimal PhMax,
    decimal ExtractMin,
    decimal ExtractMax
);

public record UpdateBeerRequest(
    string? Name,
    string? Style,
    decimal? TempMin,
    decimal? TempMax,
    decimal? PhMin,
    decimal? PhMax,
    decimal? ExtractMin,
    decimal? ExtractMax
);

public record BeerResponse(
    int Id,
    string Name,
    string Style,
    decimal TempMin,
    decimal TempMax,
    decimal PhMin,
    decimal PhMax,
    decimal ExtractMin,
    decimal ExtractMax
);
