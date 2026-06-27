using BreweryControl.Api.Dtos;
using BreweryControl.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BreweryControl.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(DashboardService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<DashboardResponse>> Get() => await service.GetSummaryAsync();
}
