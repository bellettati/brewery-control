namespace BreweryControl.Api.Services.Inputs;

public record CreateBeerInput(
    string Name, 
    string Style,
    decimal TempMin, 
    decimal TempMax, 
    decimal PhMin, 
    decimal PhMax, 
    decimal ExtractMin, 
    decimal ExtractMax 
);


public record UpdateBeerInput(
    string? Name, 
    string? Style,
    decimal? TempMin, 
    decimal? TempMax, 
    decimal? PhMin, 
    decimal? PhMax, 
    decimal? ExtractMin, 
    decimal? ExtractMax 
);
