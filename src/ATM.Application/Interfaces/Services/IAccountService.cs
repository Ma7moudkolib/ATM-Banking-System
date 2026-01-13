using ATM.Application.DTOs.Account;

namespace ATM.Application.Interfaces.Services
{
    public interface IAccountService
    {
        Task<BalanceInquiryResponse> GetBalanceAsync(Guid sessionId);
        Task<AccountDto> GetAccountDetailsAsync(Guid sessionId);
    }
}
