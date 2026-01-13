namespace ATM.Application.Interfaces.Services
{
    public interface IAuditService
    {
        Task LogAsync(string entityType, int entityId, string action, string changes, string performedBy, string ipAddress);
    }
}
