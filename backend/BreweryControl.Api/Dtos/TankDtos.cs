namespace BreweryControl.Api.Dtos;

public record CreateTankRequest(string Name, decimal CapacityLiters);
public record UpdateTankRequest(string? Name, decimal? CapacityLiters);

public record TankResponse(int Id, string Name, decimal CapacityLiters);
