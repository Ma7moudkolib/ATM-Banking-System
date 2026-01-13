using ATM.Application.DTOs.Authentication;

namespace ATM.Application.Interfaces.Services
{
    public interface IAuthenticationService
    {
        Task<CardAuthResponse> AuthenticateCardAsync(CardAuthRequest request);
        Task<bool> ValidateSessionAsync(Guid sessionId);
        Task<int> GetAccountIdFromSessionAsync(Guid sessionId);
    }
}
