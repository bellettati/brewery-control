namespace BreweryControl.Api.Services.Inputs;

public record CreateFermentationRecordInput(
    int BeerId, 
    int TankId, 
    string BatchNumber,
    decimal Temperature, 
    decimal Ph, 
    decimal Extract,
    DateTime RecordedAt, 
    string? Observation
);

public record UpdateFermentationRecordInput(
    int? BeerId, 
    int? TankId, 
    string? BatchNumber,
    decimal? Temperature, 
    decimal? Ph, 
    decimal? Extract,
    DateTime? RecordedAt, 
    string? Observation
);
