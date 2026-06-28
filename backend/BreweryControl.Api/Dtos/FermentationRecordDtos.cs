using System.ComponentModel.DataAnnotations;

namespace BreweryControl.Api.Dtos;

public record CreateFermentationRecordRequest(
    [Range(1, int.MaxValue, ErrorMessage = "Selecione uma cerveja")]
    int BeerId,
    [Range(1, int.MaxValue, ErrorMessage = "Selecione um tanque")]
    int TankId,
    [Required(ErrorMessage = "Número do lote é obrigatório")]
    [MaxLength(50)]
    string BatchNumber,
    [Range(-50, 100)] decimal Temperature,
    [Range(0, 14, ErrorMessage = "pH deve estar entre 0 e 14")] decimal Ph,
    [Range(0, 100)] decimal Extract,
    DateTime RecordedAt,
    [MaxLength(500)] string? Observation);

public record UpdateFermentationRecordRequest(
    [Range(1, int.MaxValue)] int? BeerId,
    [Range(1, int.MaxValue)] int? TankId,
    [MaxLength(50)] string? BatchNumber,
    [Range(-50, 100)] decimal? Temperature,
    [Range(0, 14)] decimal? Ph,
    [Range(0, 100)] decimal? Extract,
    DateTime? RecordedAt,
    [MaxLength(500)] string? Observation);

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
