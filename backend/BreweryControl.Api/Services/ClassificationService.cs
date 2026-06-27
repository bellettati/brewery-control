using BreweryControl.Api.Models;

namespace BreweryControl.Api.Services;

public class ClassificationService
{
    // Ha uma tolerancia de 5% de diferenca
    private const decimal ToleranceFactor = 0.05m;

    public FermentationStatus Classify(Beer beer, decimal temperature, decimal ph, decimal extract)
    {
        var temp = Evaluate(temperature, beer.TempMin, beer.TempMax);
        var phStatus = Evaluate(ph, beer.PhMin, beer.PhMax);
        var ext = Evaluate(extract, beer.ExtractMin, beer.ExtractMax);

        return new[] { temp, phStatus, ext }.Max();
    }

    private static FermentationStatus Evaluate(decimal value, decimal min, decimal max)
    {
        if (value >= min && value <= max) return FermentationStatus.WithinStandard;

        var tolerance = (max - min) * ToleranceFactor;
        if (value >= min - tolerance && value <= max + tolerance) return FermentationStatus.Attention;

        return FermentationStatus.OutOfStandard;
    }
}
