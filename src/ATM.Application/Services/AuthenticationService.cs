using ATM.Application.DTOs.Authentication;
using ATM.Application.Interfaces.Repositories;
using ATM.Application.Interfaces.Services;
using ATM.Domain.ValueObjects;
using Microsoft.Extensions.Caching.Memory;

namespace ATM.Application.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMemoryCache _cache;
        private const int SessionExpirationMinutes = 5;

        public AuthenticationService(IRepositoryManager repository, IMemoryCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<CardAuthResponse> AuthenticateCardAsync(CardAuthRequest request)
        {
            var cardNumber = new CardNumber(request.CardNumber);
            var card = await _repository.Card.GetByCardNumberWithAccountAsync(cardNumber.Value);

            if (card == null)
                throw new UnauthorizedAccessException("Invalid card number");

            card.ValidatePin(request.Pin);

            var sessionId = Guid.NewGuid();
            var expiresAt = DateTime.UtcNow.AddMinutes(SessionExpirationMinutes);

            _cache.Set($"session:{sessionId}", new
            {
                CardId = card.Id,
                AccountId = card.AccountId,
                ExpiresAt = expiresAt
            }, TimeSpan.FromMinutes(SessionExpirationMinutes));

            await _repository.UnitOfWork.SaveChangesAsync();

            return new CardAuthResponse
            {
                SessionId = sessionId,
                CardNumber = card.CardNumber.Masked,
                AccountNumber = card.Account.AccountNumber,
                CustomerName = card.Account.CustomerName,
                ExpiresAt = expiresAt
            };
        }

        public Task<bool> ValidateSessionAsync(Guid sessionId)
        {
            return Task.FromResult(_cache.TryGetValue($"session:{sessionId}", out _));
        }

        public Task<int> GetAccountIdFromSessionAsync(Guid sessionId)
        {
            if (_cache.TryGetValue($"session:{sessionId}", out dynamic session))
            {
                return Task.FromResult((int)session.AccountId);
            }

            throw new UnauthorizedAccessException("Invalid or expired session");
        }
    }
}
