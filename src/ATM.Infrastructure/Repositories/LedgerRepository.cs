using ATM.Application.Interfaces.Repositories;
using ATM.Domain.Entities;
using ATM.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace ATM.Infrastructure.Repositories
{
    public class LedgerRepository : GenericRepository<LedgerEntry>, ILedgerRepository
    {
        public LedgerRepository(AtmDbContext context) : base(context) { }

        public async Task<IEnumerable<LedgerEntry>> GetByAccountIdAsync(int accountId)
        {
            return await _dbSet
                .Where(l => l.AccountId == accountId)
                .OrderByDescending(l => l.EntryDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<LedgerEntry>> GetByTransactionIdAsync(int transactionId)
        {
            return await _dbSet
                .Where(l => l.TransactionId == transactionId)
                .ToListAsync();
        }
    }

}
