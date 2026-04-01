using Backend.ATM.Application.DTOs.Account;

namespace Backend.ATM.Application.Interfaces.Services
{
    public interface IAccountService
    {
        Task<BalanceInquiryResponse> GetBalanceAsync(Guid sessionId);
        Task<AccountDto> GetAccountDetailsAsync(Guid sessionId);
    }
}
