using ATM.Domain.Entities;

namespace ATM.Application.Interfaces.Repositories
{
    public interface IAuditLogRepository : IGenericRepository<AuditLog>
    {
        Task<IEnumerable<AuditLog>> GetByEntityAsync(string entityType, int entityId);
    }
}
