namespace BreweryControl.Api.Dtos;

public record CreateFermentationRecordRequest(
    int BeerId, 
    int TankId, 
    string BatchNumber,
    decimal Temperature, 
    decimal Ph, 
    decimal Extract,
    DateTime RecordedAt, 
    string? Observation
);

public record UpdateFermentationRecordRequest(
    int? BeerId, 
    int? TankId, 
    string? BatchNumber,
    decimal? Temperature, 
    decimal? 
    Ph, decimal? 
    Extract,
    DateTime? RecordedAt, 
    string? Observation
);

public record FermentationRecordResponse(
    int Id, 
    int BeerId, 
    string BeerName, 
    int TankId, 
    string TankName,
    string BatchNumber, 
    decimal Temperature, 
    decimal Ph, 
    decimal Extract,
    DateTime RecordedAt, 
    string? Observation, 
    string Status
);
