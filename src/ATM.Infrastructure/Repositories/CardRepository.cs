using ATM.Application.Interfaces.Repositories;
using ATM.Domain.Entities;
using ATM.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace ATM.Infrastructure.Repositories
{
    public class CardRepository : GenericRepository<Card>, ICardRepository
    {
        public CardRepository(AtmDbContext context) : base(context) { }

        public async Task<Card> GetByCardNumberAsync(string cardNumber)
        {
            return await _dbSet
                .FirstOrDefaultAsync(c => c.CardNumber.Value == cardNumber);
        }

        public async Task<Card> GetByCardNumberWithAccountAsync(string cardNumber)
        {
            return await _dbSet
                .Include(c => c.Account)
                .FirstOrDefaultAsync(c => c.CardNumber.Value == cardNumber);
        }

        public async Task<IEnumerable<Card>> GetByAccountIdAsync(int accountId)
        {
            return await _dbSet
                .Where(c => c.AccountId == accountId)
                .ToListAsync();
        }
    }
}
