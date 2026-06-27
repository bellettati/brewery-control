using BreweryControl.Api.Data;
using BreweryControl.Api.Services;
using BreweryControl.Api.Middlewares;

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(o =>
        o.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
        p.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddScoped<TankService>();
builder.Services.AddScoped<BeerService>();
builder.Services.AddScoped<ClassificationService>();
builder.Services.AddScoped<FermentationService>();
builder.Services.AddScoped<DashboardService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    using var scope = app.Services.CreateScope();
    var sp = scope.ServiceProvider;
    await DbSeeder.SeedAsync(
        sp.GetRequiredService<AppDbContext>(),
        sp.GetRequiredService<BeerService>(),
        sp.GetRequiredService<TankService>(),
        sp.GetRequiredService<FermentationService>());
}

app.UseCors();
app.UseExceptionHandler();
app.MapControllers();

app.Run();
