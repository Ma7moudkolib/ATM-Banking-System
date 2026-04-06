# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

# Copy solution file
COPY backend/*.sln ./

# Copy project files for dependency caching
COPY backend/ATM.Domain/ATM.Domain.csproj ./ATM.Domain/
COPY backend/ATM.Application/ATM.Application.csproj ./ATM.Application/
COPY backend/ATM.Infrastructure/ATM.Infrastructure.csproj ./ATM.Infrastructure/
COPY backend/ATM.API/ATM.API.csproj ./ATM.API/
COPY backend/ATM.Tests/ATM.Tests.csproj ./ATM.Tests/

# Restore dependencies
RUN dotnet restore *.sln

# Copy remaining source code
COPY backend/ .

# Build and publish the API
RUN dotnet publish ./ATM.API/ATM.API.csproj \
    -c Release \
    -o /app/publish \
    --no-restore


# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0

WORKDIR /app

# Copy published output from build stage
COPY --from=build /app/publish .

# Expose port 8080
EXPOSE 8080

# Set ASP.NET Core URLs
ENV ASPNETCORE_URLS=http://+:8080

# Set environment to Production by default
ENV ASPNETCORE_ENVIRONMENT=Production

# Run the application
ENTRYPOINT ["dotnet", "ATM.API.dll"]
