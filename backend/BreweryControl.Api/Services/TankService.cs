using BreweryControl.Api.Data;
using BreweryControl.Api.Models;
using Microsoft.EntityFrameworkCore; 

namespace BreweryControl.Api.Services;

public class TankService(AppDbContext db)
{
    public async Task<Tank> CreateAsync(string name, decimal capacityLiters)
    {
        var tank = new Tank { Name = name, CapacityLiters = capacityLiters };
        db.Tanks.Add(tank);
        await db.SaveChangesAsync();
        return tank;
    }

    public async Task<List<Tank>> GetAllAsync() => await db.Tanks.ToListAsync();

    public async Task<Tank?> GetByIdAsync(string id) => await db.Tanks.FindAsync(id);

    public async Task<bool> UpdateAsync(int id, string? name, decimal? capacityLiters)
    {
        var tank = await db.Tanks.FindAsync(id);
        if (tank is null) return false;

        if (name is not null) tank.Name = name;
        if (capacityLiters is not null) tank.CapacityLiters = capacityLiters.Value;

        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id) 
    {
        var tank = await db.Tanks.FindAsync(id);
        if (tank is null) return false;

        db.Tanks.Remove(tank);
        await db.SaveChangesAsync();
        return true;
    }
}

