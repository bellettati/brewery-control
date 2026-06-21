using BreweryControl.Api.Dtos;
using BreweryControl.Api.Services;

using Microsoft.AspNetCore.Mvc;

namespace BreweryControl.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TanksController(TankService service) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<TankResponse>> Create(CreateTankRequest request)
    {
        var tank = await service.CreateAsync(request.Name, request.CapacityLiters);
        var response = new TankResponse(tank.Id, tank.Name, tank.CapacityLiters);
        return CreatedAtAction(nameof(GetById), new { id = tank.Id }, response);
    }


    [HttpGet]
    public async Task<ActionResult<List<TankResponse>>> GetAll()
    {
        var tanks = await service.GetAllAsync();
        return tanks.Select(t => new TankResponse(t.Id, t.Name, t.CapacityLiters)).ToList();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TankResponse>> GetById(int id)
    {
        var tank = await service.GetByIdAsync(id);
        if (tank is null) return NotFound();
        return new TankResponse(tank.Id, tank.Name, tank.CapacityLiters);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateTankRequest request)
    {
        var ok = await service.UpdateAsync(id, request.Name, request.CapacityLiters);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) {
        var ok = await service.DeleteAsync(id); 
        return ok ? NoContent() : NotFound();
    }
}
