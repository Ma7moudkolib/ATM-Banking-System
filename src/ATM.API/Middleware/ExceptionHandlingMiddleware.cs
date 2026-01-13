using ATM.Application.DTOs.Common;
using ATM.Domain.Exceptions;
using System.Net;
using System.Text.Json;

namespace ATM.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var response = exception switch
            {
                InsufficientFundsException insufficientEx => new
                {
                    StatusCode = (int)HttpStatusCode.BadRequest,
                    Response = ApiResponse<object>.FailureResponse(
                        "Insufficient funds",
                        new List<string> { insufficientEx.Message }
                    )
                },
                CardBlockedException blockedEx => new
                {
                    StatusCode = (int)HttpStatusCode.Forbidden,
                    Response = ApiResponse<object>.FailureResponse(
                        "Card blocked",
                        new List<string> { blockedEx.Message }
                    )
                },
                UnauthorizedAccessException => new
                {
                    StatusCode = (int)HttpStatusCode.Unauthorized,
                    Response = ApiResponse<object>.FailureResponse(
                        "Unauthorized",
                        new List<string> { "Invalid credentials or session expired" }
                    )
                },
                KeyNotFoundException => new
                {
                    StatusCode = (int)HttpStatusCode.NotFound,
                    Response = ApiResponse<object>.FailureResponse(
                        "Resource not found",
                        new List<string> { exception.Message }
                    )
                },
                _ => new
                {
                    StatusCode = (int)HttpStatusCode.InternalServerError,
                    Response = ApiResponse<object>.FailureResponse(
                        "An error occurred processing your request",
                        new List<string> { "Please try again later" }
                    )
                }
            };

            context.Response.StatusCode = response.StatusCode;

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response.Response, options)
            );
        }
    }
}
