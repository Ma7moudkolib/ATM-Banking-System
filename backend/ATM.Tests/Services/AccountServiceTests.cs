using Backend.ATM.Application.DTOs.Account;
using Backend.ATM.Application.Interfaces.Repositories;
using Backend.ATM.Application.Interfaces.Services;
using Backend.ATM.Application.Services;
using Backend.ATM.Domain.Entities;
using Backend.ATM.Domain.Enums;
using Moq;
using Xunit;

namespace Backend.ATM.Tests.Services
{
    public class AccountServiceTests
    {
        private readonly Mock<IRepositoryManager> _mockRepositoryManager;
        private readonly Mock<IAuthenticationService> _mockAuthenticationService;
        private readonly AccountService _accountService;

        public AccountServiceTests()
        {
            _mockRepositoryManager = new Mock<IRepositoryManager>();
            _mockAuthenticationService = new Mock<IAuthenticationService>();
            _accountService = new AccountService(_mockRepositoryManager.Object, _mockAuthenticationService.Object);
        }

        [Fact]
        public async Task GetBalanceAsync_WithValidSessionId_ReturnsBalanceInquiryResponse()
        {
            // Arrange
            var sessionId = Guid.NewGuid();
            var accountId = 1;
            var account = new Account("1234567890", "John Doe", 5000, "USD");

            _mockAuthenticationService
                .Setup(x => x.GetAccountIdFromSessionAsync(sessionId))
                .ReturnsAsync(accountId);

            var mockAccountRepository = new Mock<IAccountRepository>();
            mockAccountRepository
                .Setup(x => x.GetByIdAsync(accountId))
                .ReturnsAsync(account);

            _mockRepositoryManager
                .Setup(x => x.Account)
                .Returns(mockAccountRepository.Object);

            // Act
            var result = await _accountService.GetBalanceAsync(sessionId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("1234567890", result.AccountNumber);
            Assert.Equal(5000, result.AvailableBalance);
            Assert.Equal("USD", result.Currency);
        }

        [Fact]
        public async Task GetBalanceAsync_WithAccountNotFound_ThrowsKeyNotFoundException()
        {
            // Arrange
            var sessionId = Guid.NewGuid();
            var accountId = 1;

            _mockAuthenticationService
                .Setup(x => x.GetAccountIdFromSessionAsync(sessionId))
                .ReturnsAsync(accountId);

            var mockAccountRepository = new Mock<IAccountRepository>();
            mockAccountRepository
                .Setup(x => x.GetByIdAsync(accountId))
                .ReturnsAsync((Account?)null);

            _mockRepositoryManager
                .Setup(x => x.Account)
                .Returns(mockAccountRepository.Object);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _accountService.GetBalanceAsync(sessionId));
        }

        [Fact]
        public async Task GetAccountDetailsAsync_WithValidSessionId_ReturnsAccountDto()
        {
            // Arrange
            var sessionId = Guid.NewGuid();
            var accountId = 1;
            var account = new Account("9876543210", "Jane Smith", 10000, "EUR");

            _mockAuthenticationService
                .Setup(x => x.GetAccountIdFromSessionAsync(sessionId))
                .ReturnsAsync(accountId);

            var mockAccountRepository = new Mock<IAccountRepository>();
            mockAccountRepository
                .Setup(x => x.GetByIdAsync(accountId))
                .ReturnsAsync(account);

            _mockRepositoryManager
                .Setup(x => x.Account)
                .Returns(mockAccountRepository.Object);

            // Act
            var result = await _accountService.GetAccountDetailsAsync(sessionId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("9876543210", result.AccountNumber);
            Assert.Equal("Jane Smith", result.CustomerName);
            Assert.Equal(10000, result.Balance);
            Assert.Equal("EUR", result.Currency);
            Assert.Equal("Active", result.Status);
        }

        [Fact]
        public async Task GetAccountDetailsAsync_WithAccountNotFound_ThrowsKeyNotFoundException()
        {
            // Arrange
            var sessionId = Guid.NewGuid();
            var accountId = 1;

            _mockAuthenticationService
                .Setup(x => x.GetAccountIdFromSessionAsync(sessionId))
                .ReturnsAsync(accountId);

            var mockAccountRepository = new Mock<IAccountRepository>();
            mockAccountRepository
                .Setup(x => x.GetByIdAsync(accountId))
                .ReturnsAsync((Account?)null);

            _mockRepositoryManager
                .Setup(x => x.Account)
                .Returns(mockAccountRepository.Object);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _accountService.GetAccountDetailsAsync(sessionId));
        }
    }
}
