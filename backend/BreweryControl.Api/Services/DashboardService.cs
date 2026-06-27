using BreweryControl.Api.Data;
using BreweryControl.Api.Dtos;
using BreweryControl.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BreweryControl.Api.Services;

public class DashboardService(AppDbContext db)
{
    public async Task<DashboardResponse> GetSummaryAsync()
    {
        var counts = await db.FermentationRecords
            .GroupBy(r => r.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync();

        int CountFor(FermentationStatus s) =>
            counts.FirstOrDefault(c => c.Status == s)?.Count ?? 0;

        return new DashboardResponse(
            Total:          counts.Sum(c => c.Count),
            WithinStandard: CountFor(FermentationStatus.WithinStandard),
            Attention:      CountFor(FermentationStatus.Attention),
            OutOfStandard:  CountFor(FermentationStatus.OutOfStandard));
    }
}
