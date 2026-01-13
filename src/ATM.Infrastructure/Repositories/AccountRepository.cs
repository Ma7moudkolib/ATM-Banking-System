using ATM.Application.Interfaces.Repositories;
using ATM.Domain.Entities;
using ATM.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace ATM.Infrastructure.Repositories
{
    public class AccountRepository : GenericRepository<Account>, IAccountRepository
    {
        public AccountRepository(AtmDbContext context) : base(context) { }

        public async Task<Account> GetByAccountNumberAsync(string accountNumber)
        {
            return await _dbSet
                .FirstOrDefaultAsync(a => a.AccountNumber == accountNumber);
        }

        public async Task<Account> GetByIdWithTransactionsAsync(int id)
        {
            return await _dbSet
                .Include(a => a.Transactions)
                .FirstOrDefaultAsync(a => a.Id == id);
        }
    }
}
