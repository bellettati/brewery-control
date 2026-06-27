using BreweryControl.Api.Dtos;
using BreweryControl.Api.Models;
using BreweryControl.Api.Services;
using BreweryControl.Api.Services.Inputs;
using Microsoft.AspNetCore.Mvc;

namespace BreweryControl.Api.Controllers;

[ApiController]
[Route("api/fermentation-records")]
public class FermentationRecordsController(FermentationService service) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<FermentationRecordResponse>> Create(CreateFermentationRecordRequest req)
    {
        var input = new CreateFermentationRecordInput(
            req.BeerId, 
            req.TankId, 
            req.BatchNumber,
            req.Temperature, 
            req.Ph, 
            req.Extract, 
            req.RecordedAt, 
            req.Observation
        );

        var record = await service.CreateAsync(input);

        // consultando banco, para que Tank/Beer estejam populados na resposta 
        var full = await service.GetByIdAsync(record.Id);
        return CreatedAtAction(nameof(GetById), new { id = record.Id }, ToResponse(full!));
    }

    [HttpGet]
    public async Task<ActionResult<List<FermentationRecordResponse>>> GetAll()
    {
        var records = await service.GetAllAsync();
        return records.Select(ToResponse).ToList();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FermentationRecordResponse>> GetById(int id)
    {
        var record = await service.GetByIdAsync(id);
        if (record is null) return NotFound();
        return ToResponse(record);
    }

    [HttpGet("batch/{batchNumber}")]
    public async Task<ActionResult<List<FermentationRecordResponse>>> GetByBatch(string batchNumber)
    {
        var records = await service.GetByBatchAsync(batchNumber);
        return records.Select(ToResponse).ToList();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateFermentationRecordRequest req)
    {
        var input = new UpdateFermentationRecordInput(
            req.BeerId, 
            req.TankId, 
            req.BatchNumber,
            req.Temperature, 
            req.Ph, 
            req.Extract, 
            req.RecordedAt, 
            req.Observation
        );

        var ok = await service.UpdateAsync(id, input);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    private static FermentationRecordResponse ToResponse(FermentationRecord r) => new(
        r.Id, 
        r.BeerId, 
        r.Beer.Name, 
        r.TankId, 
        r.Tank.Name,
        r.BatchNumber, 
        r.Temperature, 
        r.Ph, 
        r.Extract,
        r.RecordedAt, 
        r.Observation, 
        r.Status.ToString()
    );
}
