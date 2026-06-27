namespace BreweryControl.Api.Models;

public class FermentationRecord
{
    public int Id { get; set; }

    public int BeerId { get; set; }
    public Beer Beer { get; set; } = null!;

    public int TankId { get; set; }
    public Tank Tank { get; set; } = null!;

    public string BatchNumber { get; set; } = string.Empty;
    public decimal Temperature { get; set; }
    public decimal Ph { get; set; }
    public decimal Extract { get; set; }
    public DateTime RecordedAt { get; set; }
    public string? Observation { get; set; }
    public FermentationStatus Status { get; set; }
}
