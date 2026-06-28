using BreweryControl.Api.Data;
using BreweryControl.Api.Models;
using BreweryControl.Api.Services.Inputs;
using Microsoft.EntityFrameworkCore;

namespace BreweryControl.Api.Services;

public class FermentationService(AppDbContext db, ClassificationService classifier)
{
    public async Task<FermentationRecord> CreateAsync(CreateFermentationRecordInput input)
    {
        // Busca a cerveja (objeto completo): suas faixas são necessárias para a
        // classificação logo abaixo. O FindAsync também valida a FK de uma vez.
        var beer = await db.Beers.FindAsync(input.BeerId)
            ?? throw new ArgumentException($"Beer {input.BeerId} not found");

        // Para o tanque basta confirmar que existe — nenhum dado dele é usado —,
        // então AnyAsync (apenas um booleano) em vez de carregar a entidade inteira.
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
            // O Npgsql exige DateTime em UTC; SpecifyKind marca o valor como UTC
            // sem converter o horário.
            RecordedAt = DateTime.SpecifyKind(input.RecordedAt, DateTimeKind.Utc),
            Observation = input.Observation,
            // A classificação roda no momento do registro e é persistida no campo
            // Status, alimentando os contadores do dashboard sem recálculo na leitura.
            Status = classifier.Classify(beer, input.Temperature, input.Ph, input.Extract)
        };

        db.FermentationRecords.Add(record);
        await db.SaveChangesAsync();
        return record;
    }

    // Leituras incluem Beer e Tank (para exibir nomes) e usam AsNoTracking,
    // já que são somente-leitura — evita o overhead do change tracker do EF.
    public async Task<List<FermentationRecord>> GetAllAsync() =>
        await db.FermentationRecords
            .Include(r => r.Beer).Include(r => r.Tank)
            .AsNoTracking().ToListAsync();

    public async Task<FermentationRecord?> GetByIdAsync(int id) =>
        await db.FermentationRecords
            .Include(r => r.Beer).Include(r => r.Tank)
            .AsNoTracking().FirstOrDefaultAsync(r => r.Id == id);

    // Histórico do lote: registros filtrados pelo número do lote e ordenados
    // por data, para acompanhar a evolução da fermentação ao longo do tempo.
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

        // Atualização parcial: cada campo só é alterado se enviado (não-nulo),
        // permitindo que o mesmo método sirva tanto PUT quanto PATCH.
        if (input.BeerId is not null) record.BeerId = input.BeerId.Value;
        if (input.TankId is not null) record.TankId = input.TankId.Value;
        if (input.BatchNumber is not null) record.BatchNumber = input.BatchNumber;
        if (input.Temperature is not null) record.Temperature = input.Temperature.Value;
        if (input.Ph is not null) record.Ph = input.Ph.Value;
        if (input.Extract is not null) record.Extract = input.Extract.Value;
        if (input.RecordedAt is not null) record.RecordedAt = DateTime.SpecifyKind(input.RecordedAt.Value, DateTimeKind.Utc);
        if (input.Observation is not null) record.Observation = input.Observation;

        // Reclassifica após aplicar as mudanças: as leituras (ou a cerveja) podem
        // ter sido alteradas, então o Status precisa ser recalculado para continuar
        // coerente.
        var beer = await db.Beers.FindAsync(record.BeerId)
            ?? throw new ArgumentException($"Beer {record.BeerId} not found");
        record.Status = classifier.Classify(beer, record.Temperature, record.Ph, record.Extract);

        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        // Registro é entidade folha (ninguém o referencia), então a exclusão é
        // livre — diferente de Beer/Tank, que são bloqueados quando há histórico.
        var record = await db.FermentationRecords.FindAsync(id);
        if (record is null) return false;

        db.FermentationRecords.Remove(record);
        await db.SaveChangesAsync();
        return true;
    }
}
