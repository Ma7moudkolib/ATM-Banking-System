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
var dbServer = builder.Configuration["Database:Server"] ?? "db";
var dbName = builder.Configuration["Database:Name"] ?? "ATMBankingDB";
var dbUser = builder.Configuration["Database:User"] ?? "sa";
var dbPassword = builder.Configuration["Database:Password"] ?? "YourStrong@Password123";
var trustServerCert = builder.Configuration.GetValue<bool>("Database:TrustServerCertificate");
var dbServerPort = builder.Configuration["Database:Port"] ?? "1433";

var connectionString = $"Server={dbServer},{dbServerPort};Database={dbName};User Id={dbUser};Password={dbPassword};Trusted_Connection=false;TrustServerCertificate={trustServerCert};";

builder.Services.AddDbContext<AtmDbContext>(options =>
    options.UseSqlServer(
        connectionString,
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
}
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
