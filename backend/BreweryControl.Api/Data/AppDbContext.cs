using BreweryControl.Api.Models; 
using Microsoft.EntityFrameworkCore;

namespace BreweryControl.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Tank> Tanks => Set<Tank>();
    public DbSet<Beer> Beers => Set<Beer>();
    public DbSet<FermentationRecord> FermentationRecords => Set<FermentationRecord>();
}
