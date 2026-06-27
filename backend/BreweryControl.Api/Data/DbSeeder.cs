using BreweryControl.Api.Services;
using BreweryControl.Api.Services.Inputs;
using Microsoft.EntityFrameworkCore;

namespace BreweryControl.Api.Data;

/// <summary>
/// Seeds the database with demo data (beers, tanks, and fermentation records)
/// on first run. Records go through FermentationService so the classification
/// rule runs for real, producing genuine Status values for the dashboard.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(
        AppDbContext db,
        BeerService beers,
        TankService tanks,
        FermentationService fermentation)
    {
        // idempotency guard: if any beer exists, assume already seeded
        if (await db.Beers.AnyAsync()) return;

        // --- Beers (ranges based on real BJCP-style fermentation profiles) ---
        var ipa = await beers.CreateAsync(new CreateBeerInput(
            Name: "Hop Storm IPA", Style: "American IPA",
            TempMin: 18, TempMax: 20,
            PhMin: 4.2m, PhMax: 4.6m,
            ExtractMin: 11, ExtractMax: 14));

        var pilsner = await beers.CreateAsync(new CreateBeerInput(
            Name: "Clear Sky Pilsner", Style: "German Pilsner",
            TempMin: 10, TempMax: 13,
            PhMin: 4.3m, PhMax: 4.7m,
            ExtractMin: 11, ExtractMax: 13));

        var weiss = await beers.CreateAsync(new CreateBeerInput(
            Name: "Golden Wheat Weiss", Style: "Hefeweizen",
            TempMin: 18, TempMax: 22,
            PhMin: 4.0m, PhMax: 4.5m,
            ExtractMin: 11, ExtractMax: 13));

        // --- Tanks ---
        var tank1 = await tanks.CreateAsync("Tank A", 1000);
        var tank2 = await tanks.CreateAsync("Tank B", 2000);
        var tank3 = await tanks.CreateAsync("Tank C", 1500);

        // --- Fermentation records ---
        // Each record's Status is computed by the real classification rule.
        // Values are chosen to land in each category on purpose.

        var baseDate = DateTime.UtcNow.AddDays(-5);

        // Batch IPA001 — evolution over time, all WithinStandard
        await fermentation.CreateAsync(new CreateFermentationRecordInput(
            ipa.Id, tank1.Id, "IPA001", 19, 4.4m, 13, baseDate, "Início da fermentação"));
        await fermentation.CreateAsync(new CreateFermentationRecordInput(
            ipa.Id, tank1.Id, "IPA001", 19.5m, 4.3m, 11.5m, baseDate.AddDays(1), "Progredindo bem"));

        // Batch PILS001 — one Attention reading (temp slightly out of range)
        await fermentation.CreateAsync(new CreateFermentationRecordInput(
            pilsner.Id, tank2.Id, "PILS001", 12, 4.5m, 12, baseDate.AddDays(1), null));
        await fermentation.CreateAsync(new CreateFermentationRecordInput(
            pilsner.Id, tank2.Id, "PILS001", 13.1m, 4.5m, 12, baseDate.AddDays(2), "Temperatura subiu um pouco"));

        // Batch WEISS001 — one OutOfStandard reading (pH far off)
        await fermentation.CreateAsync(new CreateFermentationRecordInput(
            weiss.Id, tank3.Id, "WEISS001", 20, 4.2m, 12, baseDate.AddDays(2), null));
        await fermentation.CreateAsync(new CreateFermentationRecordInput(
            weiss.Id, tank3.Id, "WEISS001", 20, 5.5m, 12, baseDate.AddDays(3), "pH muito alto — investigar"));
    }
}
