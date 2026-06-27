using BreweryControl.Api.Data;
using BreweryControl.Api.Models;
using BreweryControl.Api.Services.Inputs;
using Microsoft.EntityFrameworkCore;

namespace BreweryControl.Api.Services;

public class FermentationService(AppDbContext db, ClassificationService classifier)
{
    public async Task<FermentationRecord> CreateAsync(CreateFermentationRecordInput input)
    {
        var beer = await db.Beers.FindAsync(input.BeerId)
            ?? throw new ArgumentException($"Beer {input.BeerId} not found");

        if (!await db.Tanks.AnyAsync(t => t.Id == input.TankId))
            throw new ArgumentException($"Tank {input.TankId} not found");

        var record = new FermentationRecord
        {
            BeerId = input.BeerId,
            TankId = input.TankId,
            BatchNumber = input.BatchNumber,
            Temperature = input.Temperature,
            Ph = input.Ph,
            Extract = input.Extract,
            RecordedAt = DateTime.SpecifyKind(input.RecordedAt, DateTimeKind.Utc), // Postgres requires UTC
            Observation = input.Observation,
            Status = classifier.Classify(beer, input.Temperature, input.Ph, input.Extract)
        };

        db.FermentationRecords.Add(record);
        await db.SaveChangesAsync();
        return record;
    }

    public async Task<List<FermentationRecord>> GetAllAsync() =>
        await db.FermentationRecords
            .Include(r => r.Beer).Include(r => r.Tank)
            .AsNoTracking().ToListAsync();

    public async Task<FermentationRecord?> GetByIdAsync(int id) =>
        await db.FermentationRecords
            .Include(r => r.Beer).Include(r => r.Tank)
            .AsNoTracking().FirstOrDefaultAsync(r => r.Id == id);

    public async Task<List<FermentationRecord>> GetByBatchAsync(string batchNumber) =>
        await db.FermentationRecords
            .Where(r => r.BatchNumber == batchNumber)
            .Include(r => r.Beer).Include(r => r.Tank)
            .OrderBy(r => r.RecordedAt)
            .AsNoTracking().ToListAsync();

    public async Task<bool> UpdateAsync(int id, UpdateFermentationRecordInput input)
    {
        var record = await db.FermentationRecords.FindAsync(id);
        if (record is null) return false;

        if (input.BeerId is not null) record.BeerId = input.BeerId.Value;
        if (input.TankId is not null) record.TankId = input.TankId.Value;
        if (input.BatchNumber is not null) record.BatchNumber = input.BatchNumber;
        if (input.Temperature is not null) record.Temperature = input.Temperature.Value;
        if (input.Ph is not null) record.Ph = input.Ph.Value;
        if (input.Extract is not null) record.Extract = input.Extract.Value;
        if (input.RecordedAt is not null) record.RecordedAt = DateTime.SpecifyKind(input.RecordedAt.Value, DateTimeKind.Utc);
        if (input.Observation is not null) record.Observation = input.Observation;

        var beer = await db.Beers.FindAsync(record.BeerId)
            ?? throw new ArgumentException($"Beer {record.BeerId} not found");
        record.Status = classifier.Classify(beer, record.Temperature, record.Ph, record.Extract);

        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var record = await db.FermentationRecords.FindAsync(id);
        if (record is null) return false;
        db.FermentationRecords.Remove(record);
        await db.SaveChangesAsync();
        return true;
    }
}
