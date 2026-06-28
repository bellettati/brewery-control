using BreweryControl.Api.Models;

namespace BreweryControl.Api.Services;

/// <summary>
/// Classifica um registro fermentativo comparando suas leituras (temperatura,
/// pH e extrato) com as faixas aceitáveis da cerveja correspondente.
/// </summary>
public class ClassificationService
{
    // Margem de tolerância aplicada para além da faixa min/máx, expressa como
    // fração da largura da faixa (5%). Uma leitura fora da faixa, mas dentro
    // dessa margem, é classificada como Atenção em vez de Fora do Padrão.
    private const decimal ToleranceFactor = 0.05m;

    public FermentationStatus Classify(Beer beer, decimal temperature, decimal ph, decimal extract)
    {
        // Cada parâmetro é avaliado individualmente contra sua própria faixa.
        var temp = Evaluate(temperature, beer.TempMin, beer.TempMax);
        var phStatus = Evaluate(ph, beer.PhMin, beer.PhMax);
        var ext = Evaluate(extract, beer.ExtractMin, beer.ExtractMax);

        // O status geral é o pior dos três (um parâmetro Fora do Padrão já
        // classifica o registro inteiro como Fora do Padrão). Funciona porque o
        // enum FermentationStatus está ordenado por severidade crescente:
        // WithinStandard(0) < Attention(1) < OutOfStandard(2), então Max() retorna
        // o mais severo.
        return new[] { temp, phStatus, ext }.Max();
    }

    // Avalia um único valor contra sua faixa aceitável:
    // dentro da faixa -> Dentro do Padrão; fora da faixa mas dentro da
    // tolerância -> Atenção; além da tolerância -> Fora do Padrão.
    private static FermentationStatus Evaluate(decimal value, decimal min, decimal max)
    {
        if (value >= min && value <= max) return FermentationStatus.WithinStandard;

        // a tolerância é proporcional à largura da faixa daquele parâmetro
        var tolerance = (max - min) * ToleranceFactor;
        if (value >= min - tolerance && value <= max + tolerance)
            return FermentationStatus.Attention;

        return FermentationStatus.OutOfStandard;
    }
}
