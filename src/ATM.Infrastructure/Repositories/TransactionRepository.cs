using ATM.Application.Interfaces.Repositories;
using ATM.Domain.Entities;
using ATM.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace ATM.Infrastructure.Repositories
{
    public class TransactionRepository : GenericRepository<Transaction>, ITransactionRepository
    {
        public TransactionRepository(AtmDbContext context) : base(context) { }

        public async Task<IEnumerable<Transaction>> GetByAccountIdAsync(int accountId, DateTime? fromDate, DateTime? toDate)
        {
            var query = _dbSet.Where(t => t.AccountId == accountId);

            if (fromDate.HasValue)
                query = query.Where(t => t.CreatedAt >= fromDate.Value);

            if (toDate.HasValue)
                query = query.Where(t => t.CreatedAt <= toDate.Value);

            return await query
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<Transaction> GetByReferenceAsync(string reference)
        {
            return await _dbSet
                .FirstOrDefaultAsync(t => t.TransactionReference == reference);
        }

        public async Task<decimal> GetTotalWithdrawalsToday(int accountId)
        {
            var today = DateTime.UtcNow.Date;
            return await _dbSet
                .Where(t => t.AccountId == accountId
                    && t.Type == Domain.Enums.TransactionType.Withdrawal
                    && t.CreatedAt >= today
                    && t.Status == Domain.Enums.TransactionStatus.Completed)
                .SumAsync(t => t.Amount);
        }
    }
}
