using ATM.Domain.Entities;

namespace ATM.Application.Interfaces.Repositories
{
    public interface ITransactionRepository : IGenericRepository<Transaction>
    {
        Task<IEnumerable<Transaction>> GetByAccountIdAsync(int accountId, DateTime? fromDate, DateTime? toDate);
        Task<Transaction> GetByReferenceAsync(string reference);
        Task<decimal> GetTotalWithdrawalsToday(int accountId);
    }
}
