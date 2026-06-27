using BreweryControl.Api.Dtos;
using BreweryControl.Api.Models;
using BreweryControl.Api.Services;
using BreweryControl.Api.Services.Inputs;

using Microsoft.AspNetCore.Mvc;

namespace BreweryControl.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BeersController(BeerService service) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<BeerResponse>> Create(CreateBeerRequest req)
    {
        var input = new CreateBeerInput(
            req.Name,
            req.Style,
            req.TempMin,
            req.TempMax,
            req.PhMin,
            req.PhMax,
            req.ExtractMin,
            req.ExtractMax
        );

        var beer = await service.CreateAsync(input);

        return CreatedAtAction(nameof(GetById), new { id = beer.Id }, ToResponse(beer));
    }

    [HttpGet]
    public async Task<ActionResult<List<BeerResponse>>> GetAll()
    {
        var beers = await service.GetAllAsync();
        return beers.Select(ToResponse).ToList();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BeerResponse>>GetById(int id)
    {
        var beer = await service.GetByIdAsync(id);
        if (beer is null) return NotFound();
        return ToResponse(beer);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateBeerRequest req)
    {
        var input = new UpdateBeerInput(
            req.Name,
            req.Style,
            req.TempMin,
            req.TempMax,
            req.PhMin,
            req.PhMax,
            req.ExtractMin,
            req.ExtractMax
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
 
    private static BeerResponse ToResponse(Beer beer) => new (
        beer.Id,
        beer.Name,
        beer.Style,
        beer.TempMin,
        beer.TempMax,
        beer.PhMin,
        beer.PhMax,
        beer.ExtractMin,
        beer.ExtractMax
    );
}
