namespace BreweryControl.Api.Models;

public class Beer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Style { get; set; } = string.Empty;
    public decimal TempMin { get; set; }
    public decimal TempMax{ get; set; }
    public decimal PhMin { get; set; }
    public decimal PhMax { get; set; }
    public decimal ExtractMin { get; set; }
    public decimal ExtractMax { get; set; }
}
