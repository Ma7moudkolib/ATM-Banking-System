using Backend.ATM.Domain.Entities;

namespace Backend.ATM.Application.Interfaces.Repositories
{
    public interface IAccountRepository : IGenericRepository<Account>
    {
        Task<Account> GetByAccountNumberAsync(string accountNumber);
        Task<Account> GetByIdWithTransactionsAsync(int id);
    }
}
