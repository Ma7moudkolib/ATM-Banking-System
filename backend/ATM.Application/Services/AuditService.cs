using Backend.ATM.Application.Interfaces.Repositories;
using Backend.ATM.Application.Interfaces.Services;
using Backend.ATM.Domain.Entities;

namespace Backend.ATM.Application.Services
{
    public class AuditService : IAuditService
    {
        private readonly IRepositoryManager _repository;

        public AuditService(IRepositoryManager repository)
        {
            _repository = repository;
        }

        public async Task LogAsync(string entityType, int entityId, string action, string changes, string performedBy, string ipAddress)
        {
            var auditLog = new AuditLog(entityType, entityId, action, changes, performedBy, ipAddress);
            await _repository.AuditLog.AddAsync(auditLog);
            await _repository.UnitOfWork.SaveChangesAsync();
        }
    }
}
