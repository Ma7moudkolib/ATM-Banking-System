using ATM.Domain.Entities;

namespace ATM.Application.Interfaces.Repositories
{
    public interface ILedgerRepository : IGenericRepository<LedgerEntry>
    {
        Task<IEnumerable<LedgerEntry>> GetByAccountIdAsync(int accountId);
        Task<IEnumerable<LedgerEntry>> GetByTransactionIdAsync(int transactionId);
    }
}
