using System.ComponentModel.DataAnnotations;

namespace BreweryControl.Api.Dtos;

public record CreateFermentationRecordRequest(
    [property: Range(1, int.MaxValue, ErrorMessage = "Selecione uma cerveja")]
    int BeerId,
    [property: Range(1, int.MaxValue, ErrorMessage = "Selecione um tanque")]
    int TankId,
    [property: Required(ErrorMessage = "Número do lote é obrigatório")]
    [property: MaxLength(50)]
    string BatchNumber,
    [property: Range(-50, 100)] decimal Temperature,
    [property: Range(0, 14, ErrorMessage = "pH deve estar entre 0 e 14")] decimal Ph,
    [property: Range(0, 100)] decimal Extract,
    DateTime RecordedAt,
    [property: MaxLength(500)] string? Observation);

public record UpdateFermentationRecordRequest(
    [property: Range(1, int.MaxValue)] int? BeerId,
    [property: Range(1, int.MaxValue)] int? TankId,
    [property: MaxLength(50)] string? BatchNumber,
    [property: Range(-50, 100)] decimal? Temperature,
    [property: Range(0, 14)] decimal? Ph,
    [property: Range(0, 100)] decimal? Extract,
    DateTime? RecordedAt,
    [property: MaxLength(500)] string? Observation);

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
