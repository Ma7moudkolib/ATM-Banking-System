using ATM.Domain.Entities;

namespace ATM.Application.Interfaces.Repositories
{
    public interface ICardRepository : IGenericRepository<Card>
    {
        Task<Card> GetByCardNumberAsync(string cardNumber);
        Task<Card> GetByCardNumberWithAccountAsync(string cardNumber);
        Task<IEnumerable<Card>> GetByAccountIdAsync(int accountId);
    }

}
