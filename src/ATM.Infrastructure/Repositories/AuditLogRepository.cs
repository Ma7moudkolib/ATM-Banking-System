using ATM.Application.Interfaces.Repositories;
using ATM.Domain.Entities;
using ATM.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace ATM.Infrastructure.Repositories
{
    public class AuditLogRepository : GenericRepository<AuditLog>, IAuditLogRepository
    {
        public AuditLogRepository(AtmDbContext context) : base(context) { }

        public async Task<IEnumerable<AuditLog>> GetByEntityAsync(string entityType, int entityId)
        {
            return await _dbSet
                .Where(a => a.EntityType == entityType && a.EntityId == entityId)
                .OrderByDescending(a => a.Timestamp)
                .ToListAsync();
        }
    }
}
