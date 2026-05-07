using Backend.ATM.API.Middleware;
using Backend.ATM.Application.Interfaces.Repositories;
using Backend.ATM.Application.Interfaces.Services;
using Backend.ATM.Application.Services;
using Backend.ATM.Infrastructure.Context;
using Backend.ATM.Infrastructure.Repositories;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Load environment-specific configuration
var env = builder.Environment.EnvironmentName;
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{env}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

builder.Services.AddControllers();
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});
builder.Services.AddVersionedApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Build connection string from configuration
builder.Services.AddDbContext<AtmDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
         b => b.MigrationsAssembly("Backend.ATM.Infrastructure")
    )
);
builder.Services.AddMemoryCache();

builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();

builder.Services.AddScoped<IServiceManager, ServiceManager>();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "ATM API",
        Version = "v1",
        Description = "A secure ATM API following Clean Architecture principles"
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhostFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
    
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("AllowLocalhostFrontend");
}
else
{
    // In production, use more restrictive CORS policy or specify your deployment domain
    app.UseCors("AllowLocalhostFrontend");
}
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
