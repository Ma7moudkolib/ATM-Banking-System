using ATM.Application.DTOs.Account;
using ATM.Application.Interfaces.Repositories;
using ATM.Application.Interfaces.Services;

namespace ATM.Application.Services
{
    public class AccountService : IAccountService
    {
        private readonly IRepositoryManager _repository;
        private readonly IAuthenticationService _authService;

        public AccountService(IRepositoryManager repository, IAuthenticationService authService)
        {
            _repository = repository;
            _authService = authService;
        }

        public async Task<BalanceInquiryResponse> GetBalanceAsync(Guid sessionId)
        {
            var accountId = await _authService.GetAccountIdFromSessionAsync(sessionId);
            var account = await _repository.Account.GetByIdAsync(accountId);

            if (account == null)
                throw new KeyNotFoundException("Account not found");

            return new BalanceInquiryResponse
            {
                AccountNumber = account.AccountNumber,
                AvailableBalance = account.Balance,
                Currency = account.Currency,
                InquiryDate = DateTime.UtcNow
            };
        }

        public async Task<AccountDto> GetAccountDetailsAsync(Guid sessionId)
        {
            var accountId = await _authService.GetAccountIdFromSessionAsync(sessionId);
            var account = await _repository.Account.GetByIdAsync(accountId);

            if (account == null)
                throw new KeyNotFoundException("Account not found");

            return new AccountDto
            {
                Id = account.Id,
                AccountNumber = account.AccountNumber,
                CustomerName = account.CustomerName,
                Balance = account.Balance,
                Currency = account.Currency,
                Status = account.Status.ToString()
            };
        }
    }
}
