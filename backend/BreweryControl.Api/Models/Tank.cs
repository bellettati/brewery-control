namespace BreweryControl.Api.Models;

public class Tank
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal CapacityLiters { get; set; }
}
