using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace BreweryControl.Api.Middlewares;

/// <summary>
/// Tratamento global de exceções: captura exceções não tratadas e as converte
/// em respostas HTTP no formato padrão ProblemDetails (RFC 7807), evitando
/// try/catch repetido nos controllers.
/// </summary>
public class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext ctx, Exception ex, CancellationToken ct)
    {
        // Mapeia tipos de exceção da camada de serviço para o status HTTP
        // correspondente: erros de validação viram 400; conflitos de estado
        // (ex.: excluir cerveja com histórico) viram 409; o resto é 500.
        var status = ex switch
        {
            ArgumentException => StatusCodes.Status400BadRequest,
            InvalidOperationException => StatusCodes.Status409Conflict,
            _ => StatusCodes.Status500InternalServerError
        };

        var problem = new ProblemDetails
        {
            Status = status,
            Title = status == 400 ? "Validation error" : "Server error",
            Detail = ex.Message
        };

        ctx.Response.StatusCode = status;
        await ctx.Response.WriteAsJsonAsync(problem, ct);

        // true = exceção tratada; o pipeline não a propaga adiante.
        return true;
    }
}
