using BreweryControl.Api.Data;
using BreweryControl.Api.Dtos;
using BreweryControl.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BreweryControl.Api.Services;

public class DashboardService(AppDbContext db)
{
    public async Task<DashboardResponse> GetSummaryAsync()
    {
        // Agrupa os registros por Status no banco e conta cada grupo — um único
        // round-trip (GROUP BY), em vez de quatro consultas de contagem separadas.
        var counts = await db.FermentationRecords
            .GroupBy(r => r.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync();

        // A partir daqui o cálculo é em memória, sobre no máximo 3 linhas.
        // Um status sem registros não aparece no GroupBy, então o padrão é 0.
        int CountFor(FermentationStatus s) =>
            counts.FirstOrDefault(c => c.Status == s)?.Count ?? 0;

        return new DashboardResponse(
            Total:          counts.Sum(c => c.Count),
            WithinStandard: CountFor(FermentationStatus.WithinStandard),
            Attention:      CountFor(FermentationStatus.Attention),
            OutOfStandard:  CountFor(FermentationStatus.OutOfStandard));
    }
}
