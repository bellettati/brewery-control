namespace BreweryControl.Api.Dtos;

public record DashboardResponse(int Total, int WithinStandard, int Attention, int OutOfStandard);
