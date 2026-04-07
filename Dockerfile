# ─────────────────────────────────────────────
# Stage 1: Restore dependencies (shared cache)
# ─────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS restore

WORKDIR /src

# Copy solution + project files first for optimal layer caching
COPY backend/*.sln ./
COPY backend/ATM.Domain/ATM.Domain.csproj          ./ATM.Domain/
COPY backend/ATM.Application/ATM.Application.csproj ./ATM.Application/
COPY backend/ATM.Infrastructure/ATM.Infrastructure.csproj ./ATM.Infrastructure/
COPY backend/ATM.API/ATM.API.csproj                ./ATM.API/
COPY backend/ATM.Tests/ATM.Tests.csproj            ./ATM.Tests/

RUN dotnet restore *.sln

# Copy the rest of the source code
COPY backend/ .


# ─────────────────────────────────────────────
# Stage 2: Build (Release artefacts)
# ─────────────────────────────────────────────
FROM restore AS build

RUN dotnet publish ./ATM.API/ATM.API.csproj \
    -c Release \
    -o /app/publish \
    --no-restore


# ─────────────────────────────────────────────
# Stage 3: Development
#   • SDK image so `dotnet watch` is available
#   • Source mounted at runtime via docker-compose
#   • Hot-reload enabled out of the box
# ─────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS development

WORKDIR /src

# Pre-restore so the first `dotnet watch` run is fast
COPY --from=restore /root/.nuget /root/.nuget
COPY --from=restore /src .

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Development
ENV DOTNET_USE_POLLING_FILE_WATCHER=true
ENV DOTNET_WATCH_RESTART_ON_RUDE_EDIT=true

ENTRYPOINT ["dotnet", "watch", "--project", "ATM.API/ATM.API.csproj", "run", "--no-launch-profile"]


# ─────────────────────────────────────────────
# Stage 4: Production
#   • Minimal ASP.NET runtime image (no SDK)
#   • Only published artefacts copied in
# ─────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS production

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "ATM.API.dll"]