using Backend.ATM.Application.DTOs.Authentication;
using Backend.ATM.Application.Interfaces.Repositories;
using Backend.ATM.Application.Interfaces.Services;
using Backend.ATM.Application.Services;
using Backend.ATM.Domain.Entities;
using Backend.ATM.Domain.ValueObjects;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using Xunit;

namespace Backend.ATM.Tests.Services
{
    public class AuthenticationServiceTests
    {
        private readonly Mock<IRepositoryManager> _mockRepositoryManager;
        private readonly Mock<ICardRepository> _mockCardRepository;
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly IMemoryCache _memoryCache;
        private readonly AuthenticationService _authenticationService;

        public AuthenticationServiceTests()
        {
            _mockRepositoryManager = new Mock<IRepositoryManager>();
            _mockCardRepository = new Mock<ICardRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _memoryCache = new MemoryCache(new MemoryCacheOptions());

            _mockRepositoryManager.Setup(x => x.Card).Returns(_mockCardRepository.Object);
            _mockRepositoryManager.Setup(x => x.UnitOfWork).Returns(_mockUnitOfWork.Object);
            _mockUnitOfWork.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

            _authenticationService = new AuthenticationService(_mockRepositoryManager.Object, _memoryCache);
        }

        private Card CreateCard(string cardNumber, string pin, Account account)
        {
            var card = new Card(
                new CardNumber(cardNumber),
                Pin.Create(pin),
                account.Id,
                DateTime.UtcNow.AddYears(3));

            // Use reflection to set the Account property since it's read-only
            var accountProperty = typeof(Card).GetProperty("Account");
            accountProperty?.SetValue(card, account);

            return card;
        }

        [Fact]
        public async Task AuthenticateCardAsync_WithValidCardAndPin_ReturnsCardAuthResponse()
        {
            // Arrange
            var cardNumber = "4532015112830366"; // Valid test card number that passes Luhn
            var pin = "1234";
            var account = new Account("ACC001", "John Doe", 5000, "USD");
            var card = CreateCard(cardNumber, pin, account);

            var authRequest = new CardAuthRequest
            {
                CardNumber = cardNumber,
                Pin = pin
            };

            _mockCardRepository
                .Setup(x => x.GetByCardNumberWithAccountAsync(cardNumber))
                .ReturnsAsync(card);

            // Act
            var result = await _authenticationService.AuthenticateCardAsync(authRequest);

            // Assert
            Assert.NotNull(result);
            Assert.NotEqual(Guid.Empty, result.SessionId);
            Assert.Equal(card.CardNumber.Masked, result.CardNumber);
            Assert.Equal(account.AccountNumber, result.AccountNumber);
            Assert.Equal(account.CustomerName, result.CustomerName);
            Assert.True(result.ExpiresAt > DateTime.UtcNow);

            _mockUnitOfWork.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task AuthenticateCardAsync_WithInvalidCardNumber_ThrowsUnauthorizedAccessException()
        {
            // Arrange
            var cardNumber = "0000000000000000";

            var authRequest = new CardAuthRequest
            {
                CardNumber = cardNumber,
                Pin = "1234"
            };

            _mockCardRepository
                .Setup(x => x.GetByCardNumberWithAccountAsync(cardNumber))
                .ReturnsAsync((Card?)null);

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
                _authenticationService.AuthenticateCardAsync(authRequest));
        }

        [Fact]
        public async Task AuthenticateCardAsync_WithInvalidPin_ThrowsDomainException()
        {
            // Arrange
            var cardNumber = "4532015112830366"; // Valid test card number
            var correctPin = "1234";
            var wrongPin = "0000";
            var account = new Account("ACC001", "John Doe", 5000, "USD");
            var card = CreateCard(cardNumber, correctPin, account);

            var authRequest = new CardAuthRequest
            {
                CardNumber = cardNumber,
                Pin = wrongPin
            };

            _mockCardRepository
                .Setup(x => x.GetByCardNumberWithAccountAsync(cardNumber))
                .ReturnsAsync(card);

            // Act & Assert
            await Assert.ThrowsAsync<Backend.ATM.Domain.Exceptions.DomainException>(() =>
                _authenticationService.AuthenticateCardAsync(authRequest));
        }

        [Fact]
        public async Task AuthenticateCardAsync_WithExpiredCard_ThrowsDomainException()
        {
            // Arrange
            var cardNumber = "4532015112830366"; // Valid test card number
            var pin = "1234";
            var account = new Account("ACC001", "John Doe", 5000, "USD");
            var card = new Card(
                new CardNumber(cardNumber),
                Pin.Create(pin),
                account.Id,
                DateTime.UtcNow.AddSeconds(-1)); // Already expired

            var accountProperty = typeof(Card).GetProperty("Account");
            accountProperty?.SetValue(card, account);

            var authRequest = new CardAuthRequest
            {
                CardNumber = cardNumber,
                Pin = pin
            };

            _mockCardRepository
                .Setup(x => x.GetByCardNumberWithAccountAsync(cardNumber))
                .ReturnsAsync(card);

            // Act & Assert
            await Assert.ThrowsAsync<Backend.ATM.Domain.Exceptions.DomainException>(() =>
                _authenticationService.AuthenticateCardAsync(authRequest));
        }

        [Fact]
        public async Task ValidateSessionAsync_WithValidSession_ReturnsTrue()
        {
            // Arrange
            var sessionId = Guid.NewGuid();
            var sessionData = new { CardId = 1, AccountId = 1, ExpiresAt = DateTime.UtcNow.AddMinutes(5) };
            _memoryCache.Set($"session:{sessionId}", sessionData, TimeSpan.FromMinutes(5));

            // Act
            var result = await _authenticationService.ValidateSessionAsync(sessionId);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task ValidateSessionAsync_WithInvalidSession_ReturnsFalse()
        {
            // Arrange
            var sessionId = Guid.NewGuid();

            // Act
            var result = await _authenticationService.ValidateSessionAsync(sessionId);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task ValidateSessionAsync_WithExpiredSession_ReturnsFalse()
        {
            // Arrange
            var sessionId = Guid.NewGuid();
            var sessionData = new { CardId = 1, AccountId = 1, ExpiresAt = DateTime.UtcNow.AddSeconds(-1) };
            // Set with extremely short timeout so it expires
            _memoryCache.Set($"session:{sessionId}", sessionData, TimeSpan.FromMilliseconds(1));
            
            // Wait for expiration
            await Task.Delay(100);

            // Act
            var result = await _authenticationService.ValidateSessionAsync(sessionId);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task GetAccountIdFromSessionAsync_WithValidSession_ReturnsAccountId()
        {
            // Arrange
            var cardNumber = "4532015112830366"; // Valid test card number
            var pin = "1234";
            var account = new Account("ACC001", "John Doe", 5000, "USD");
            var card = CreateCard(cardNumber, pin, account);

            var authRequest = new CardAuthRequest
            {
                CardNumber = cardNumber,
                Pin = pin
            };

            _mockCardRepository
                .Setup(x => x.GetByCardNumberWithAccountAsync(cardNumber))
                .ReturnsAsync(card);

            // First authenticate to create a valid session
            var authResult = await _authenticationService.AuthenticateCardAsync(authRequest);

            // Act
            var result = await _authenticationService.GetAccountIdFromSessionAsync(authResult.SessionId);

            // Assert
            Assert.Equal(account.Id, result);
        }

        [Fact]
        public async Task GetAccountIdFromSessionAsync_WithInvalidSession_ThrowsUnauthorizedAccessException()
        {
            // Arrange
            var sessionId = Guid.NewGuid();

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
                _authenticationService.GetAccountIdFromSessionAsync(sessionId));
        }

        [Fact]
        public async Task GetAccountIdFromSessionAsync_WithExpiredSession_ThrowsUnauthorizedAccessException()
        {
            // Arrange
            var sessionId = Guid.NewGuid();
            var sessionData = new { CardId = 1, AccountId = 1, ExpiresAt = DateTime.UtcNow.AddSeconds(-1) };
            _memoryCache.Set($"session:{sessionId}", sessionData, TimeSpan.FromMilliseconds(1));
            
            // Wait for expiration
            await Task.Delay(100);

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
                _authenticationService.GetAccountIdFromSessionAsync(sessionId));
        }

        [Fact]
        public async Task AuthenticateCardAsync_CreatesSessionWithCorrectExpiration()
        {
            // Arrange
            var cardNumber = "4532015112830366"; // Valid test card number
            var pin = "1234";
            var account = new Account("ACC001", "John Doe", 5000, "USD");
            var card = CreateCard(cardNumber, pin, account);

            var authRequest = new CardAuthRequest
            {
                CardNumber = cardNumber,
                Pin = pin
            };

            _mockCardRepository
                .Setup(x => x.GetByCardNumberWithAccountAsync(cardNumber))
                .ReturnsAsync(card);

            var beforeAuth = DateTime.UtcNow;

            // Act
            var result = await _authenticationService.AuthenticateCardAsync(authRequest);

            var afterAuth = DateTime.UtcNow;

            // Assert - Session should exist and be retrievable
            var canValidate = await _authenticationService.ValidateSessionAsync(result.SessionId);
            Assert.True(canValidate);

            // Assert - Expiration should be approximately 5 minutes from now
            var timeDiff = result.ExpiresAt - beforeAuth;
            Assert.True(timeDiff >= TimeSpan.FromMinutes(4.9) && timeDiff <= TimeSpan.FromMinutes(5.1));
        }

        [Fact]
        public async Task AuthenticateCardAsync_WithBlockedCard_ThrowsDomainException()
        {
            // Arrange
            var cardNumber = "4532015112830366"; // Valid test card number
            var pin = "1234";
            var account = new Account("ACC001", "John Doe", 5000, "USD");
            var card = CreateCard(cardNumber, pin, account);
            card.Block();

            var authRequest = new CardAuthRequest
            {
                CardNumber = cardNumber,
                Pin = pin
            };

            _mockCardRepository
                .Setup(x => x.GetByCardNumberWithAccountAsync(cardNumber))
                .ReturnsAsync(card);

            // Act & Assert
            await Assert.ThrowsAsync<Backend.ATM.Domain.Exceptions.DomainException>(() =>
                _authenticationService.AuthenticateCardAsync(authRequest));
        }

        [Fact]
        public async Task AuthenticateCardAsync_MultipleValidAuthentications_CreateDifferentSessions()
        {
            // Arrange
            var cardNumber = "4532015112830366"; // Valid test card number
            var pin = "1234";
            var account = new Account("ACC001", "John Doe", 5000, "USD");

            _mockCardRepository
                .Setup(x => x.GetByCardNumberWithAccountAsync(cardNumber))
                .ReturnsAsync(() =>
                {
                    return CreateCard(cardNumber, pin, account);
                });

            var authRequest = new CardAuthRequest
            {
                CardNumber = cardNumber,
                Pin = pin
            };

            // Act
            var result1 = await _authenticationService.AuthenticateCardAsync(authRequest);
            var result2 = await _authenticationService.AuthenticateCardAsync(authRequest);

            // Assert - Both sessions should be valid but different
            Assert.NotEqual(result1.SessionId, result2.SessionId);
            
            var validate1 = await _authenticationService.ValidateSessionAsync(result1.SessionId);
            var validate2 = await _authenticationService.ValidateSessionAsync(result2.SessionId);
            
            Assert.True(validate1);
            Assert.True(validate2);
        }
    }
}
