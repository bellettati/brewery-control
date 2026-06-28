using BreweryControl.Api.Data;
using BreweryControl.Api.Models;
using BreweryControl.Api.Services.Inputs;

using Microsoft.EntityFrameworkCore;

namespace BreweryControl.Api.Services;

public class BeerService(AppDbContext db) 
{
    private void Validate(Beer beer) 
    {
        if (beer.TempMin > beer.TempMax) throw new ArgumentException("TempMin cannot exceed TempMax");
        if (beer.PhMin > beer.PhMax) throw new ArgumentException("PhMin cannot exceed PhMax");
        if (beer.ExtractMin > beer.ExtractMax) throw new ArgumentException("ExtractMin cannot exceed ExtractMax");
    }

    public async Task<Beer> CreateAsync(CreateBeerInput input)
    {
        var beer = new Beer
        {
            Name = input.Name,
            Style = input.Style,
            TempMin = input.TempMin,
            TempMax = input.TempMax,
            PhMin = input.PhMin,
            PhMax = input.PhMax,
            ExtractMin = input.ExtractMin,
            ExtractMax = input.ExtractMax
        };

        Validate(beer);

        db.Beers.Add(beer);
        await db.SaveChangesAsync();
        return beer;
    }

    public async Task<List<Beer>> GetAllAsync() => await db.Beers.ToListAsync();

    public async Task<Beer?> GetByIdAsync(int id) => await db.Beers.FindAsync(id);

    public async Task<bool> UpdateAsync(int id, UpdateBeerInput input)
    {
        var beer = await db.Beers.FindAsync(id);
        if (beer is null) return false;

        if (input.Name is not null) beer.Name = input.Name;
        if (input.Style is not null) beer.Style = input.Style;
        if (input.TempMin is not null) beer.TempMin = input.TempMin.Value;
        if (input.TempMax is not null) beer.TempMax = input.TempMax.Value;
        if (input.PhMin is not null) beer.PhMin = input.PhMin.Value;
        if (input.PhMax is not null) beer.PhMax = input.PhMax.Value;
        if (input.ExtractMin is not null) beer.ExtractMin = input.ExtractMin.Value;
        if (input.ExtractMax is not null) beer.ExtractMax = input.ExtractMax.Value;

        Validate(beer);

        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var beer = await db.Beers.FindAsync(id);
        if (beer is null) return false;

        var hasRecords = await db.FermentationRecords.AnyAsync(r => r.BeerId == id);
        if (hasRecords)
            throw new InvalidOperationException(
                "Não é possível excluir uma cerveja que possui registros de fermentação.");

        db.Beers.Remove(beer);
        await db.SaveChangesAsync();
        return true;
    }
}
