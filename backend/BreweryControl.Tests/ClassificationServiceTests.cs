using BreweryControl.Api.Models;
using BreweryControl.Api.Services;
using Xunit;

namespace BreweryControl.Tests;

public class ClassificationServiceTests
{
    private readonly ClassificationService _classifier = new();

    // instancia de Beer reutilizavel para todos os testes
    private static Beer SampleBeer () =>  new()
    {
        TempMin = 10,
        TempMax = 15,
        PhMin = 4.0m,
        PhMax = 5.0m,
        ExtractMin = 10,
        ExtractMax = 14
    };

    [Fact]
    public void AllValuesInsideRanges_ReturnsWithinStandard()
    {
        var status = _classifier.Classify(SampleBeer(), temperature: 12, ph: 4.5m, extract: 12);
        Assert.Equal(FermentationStatus.WithinStandard, status);
    }

    [Fact]
    public void ValueExactlyAtBoundary_ReturnsWithinStandard()
    {
        var status = _classifier.Classify(SampleBeer(), temperature: 10, ph: 5.0m, extract: 14);
        Assert.Equal(FermentationStatus.WithinStandard, status);
    }

    [Fact]
    public void ValueSlightlyOutsideButWithinTolerance_ReturnsAttention()
    {
        var status = _classifier.Classify(SampleBeer(), temperature: 15.2m, ph: 4.5m, extract: 12);
        Assert.Equal(FermentationStatus.Attention, status);
    }

    [Fact]
    public void ValueFarOutsideRange_ReturnsOutOfStandard()
    {
        var status = _classifier.Classify(SampleBeer(), temperature: 20, ph: 4.5m, extract: 12);
        Assert.Equal(FermentationStatus.OutOfStandard, status);
    }

    [Fact]
    public void WorstParameterDeterminesStatus()
    {
        var status = _classifier.Classify(SampleBeer(), temperature: 12, ph: 4.5m, extract: 30);
        Assert.Equal(FermentationStatus.OutOfStandard, status);
    }
}
