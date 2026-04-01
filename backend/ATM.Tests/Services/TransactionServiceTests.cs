using Backend.ATM.Application.DTOs.Transaction;
using Backend.ATM.Application.Interfaces.Repositories;
using Backend.ATM.Application.Interfaces.Services;
using Backend.ATM.Application.Services;
using Backend.ATM.Domain.Entities;
using Backend.ATM.Domain.Enums;
using Moq;
using Xunit;

namespace Backend.ATM.Tests.Services
{
    public class TransactionServiceTests
    {
        private readonly Mock<IRepositoryManager> _mockRepositoryManager;
        private readonly Mock<IAuthenticationService> _mockAuthenticationService;
        private readonly Mock<IAuditService> _mockAuditService;
        private readonly Mock<IAccountRepository> _mockAccountRepository;
        private readonly Mock<IAtmMachineRepository> _mockAtmMachineRepository;
        private readonly Mock<ITransactionRepository> _mockTransactionRepository;
        private readonly Mock<ILedgerRepository> _mockLedgerRepository;
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly TransactionService _transactionService;

        public TransactionServiceTests()
        {
            _mockRepositoryManager = new Mock<IRepositoryManager>();
            _mockAuthenticationService = new Mock<IAuthenticationService>();
            _mockAuditService = new Mock<IAuditService>();
            _mockAccountRepository = new Mock<IAccountRepository>();
            _mockAtmMachineRepository = new Mock<IAtmMachineRepository>();
            _mockTransactionRepository = new Mock<ITransactionRepository>();
            _mockLedgerRepository = new Mock<ILedgerRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();

            SetupMockDependencies();

            _transactionService = new TransactionService(
                _mockRepositoryManager.Object,
                _mockAuthenticationService.Object,
                _mockAuditService.Object);
        }

        private void SetupMockDependencies()
        {
            _mockRepositoryManager.Setup(x => x.Account).Returns(_mockAccountRepository.Object);
            _mockRepositoryManager.Setup(x => x.AtmMachine).Returns(_mockAtmMachineRepository.Object);
            _mockRepositoryManager.Setup(x => x.Transaction).Returns(_mockTransactionRepository.Object);
            _mockRepositoryManager.Setup(x => x.Ledger).Returns(_mockLedgerRepository.Object);
            _mockRepositoryManager.Setup(x => x.UnitOfWork).Returns(_mockUnitOfWork.Object);

            _mockUnitOfWork.Setup(x => x.BeginTransactionAsync()).Returns(Task.CompletedTask);
            _mockUnitOfWork.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);
            _mockUnitOfWork.Setup(x => x.CommitTransactionAsync()).Returns(Task.CompletedTask);
            _mockUnitOfWork.Setup(x => x.RollbackTransactionAsync()).Returns(Task.CompletedTask);
        }

        [Fact]
        public async Task WithdrawAsync_WithValidRequest_ReturnsTransactionResponse()
        {
            // Arrange
            var sessionId = Guid.NewGuid();
            var accountId = 1;
            var atmMachineCode = "ATM001";

            var account = new Account("ACC123", "John Doe", 5000, "USD");
            var atm = new AtmMachine("ATM001", "Main Street");

            var withdrawalRequest = new WithdrawalRequest
            {
                SessionId = sessionId,
                Amount = 500,
                AtmMachineCode = atmMachineCode
            };

            _mockAuthenticationService
                .Setup(x => x.GetAccountIdFromSessionAsync(sessionId))
                .ReturnsAsync(accountId);

            _mockAccountRepository
                .Setup(x => x.GetByIdAsync(accountId))
                .ReturnsAsync(account);

            _mockAtmMachineRepository
                .Setup(x => x.GetByMachineCodeAsync(atmMachineCode))
                .ReturnsAsync(atm);

            _mockTransactionRepository.Setup(x => x.AddAsync(It.IsAny<Transaction>())).Returns(Task.CompletedTask);
            _mockLedgerRepository.Setup(x => x.AddAsync(It.IsAny<LedgerEntry>())).Returns(Task.CompletedTask);
            _mockAuditService.Setup(x => x.LogAsync(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).Returns(Task.CompletedTask);

            // Act
            var result = await _transactionService.WithdrawAsync(withdrawalRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Withdrawal", result.Type);
            Assert.Equal(500, result.Amount);
            Assert.Equal("USD", result.Currency);
            Assert.NotNull(result.TransactionReference);

            _mockUnitOfWork.Verify(x => x.BeginTransactionAsync(), Times.Once);
            _mockUnitOfWork.Verify(x => x.CommitTransactionAsync(), Times.Once);
            _mockAuditService.Verify(x => x.LogAsync(It.IsAny<string>(), It.IsAny<int>(), "Withdrawal", It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Once);
        }

        [Fact]
        public async Task WithdrawAsync_WithAccountNotFound_ThrowsKeyNotFoundException()
        {
            // Arrange
            var sessionId = Guid.NewGuid();
            var accountId = 1;

            var withdrawalRequest = new WithdrawalRequest
            {
                SessionId = sessionId,
                Amount = 500,
                AtmMachineCode = "ATM001"
            };

            _mockAuthenticationService
                .Setup(x => x.GetAccountIdFromSessionAsync(sessionId))
                .ReturnsAsync(accountId);

            _mockAccountRepository
                .Setup(x => x.GetByIdAsync(accountId))
                .ReturnsAsync((Account?)null);

            _mockUnitOfWork.Setup(x => x.BeginTransactionAsync()).Returns(Task.CompletedTask);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _transactionService.WithdrawAsync(withdrawalRequest));
            _mockUnitOfWork.Verify(x => x.RollbackTransactionAsync(), Times.Once);
        }

        [Fact]
        public async Task DepositAsync_WithValidRequest_ReturnsTransactionResponse()
        {
            // Arrange
            var sessionId = Guid.NewGuid();
            var accountId = 1;
            var atmMachineCode = "ATM001";

            var account = new Account("ACC123", "John Doe", 5000, "USD");
            var atm = new AtmMachine("ATM001", "Main Street");

            var depositRequest = new DepositRequest
            {
                SessionId = sessionId,
                Amount = 1000,
                AtmMachineCode = atmMachineCode
            };

            _mockAuthenticationService
                .Setup(x => x.GetAccountIdFromSessionAsync(sessionId))
                .ReturnsAsync(accountId);

            _mockAccountRepository
                .Setup(x => x.GetByIdAsync(accountId))
                .ReturnsAsync(account);

            _mockAtmMachineRepository
                .Setup(x => x.GetByMachineCodeAsync(atmMachineCode))
                .ReturnsAsync(atm);

            _mockTransactionRepository.Setup(x => x.AddAsync(It.IsAny<Transaction>())).Returns(Task.CompletedTask);
            _mockLedgerRepository.Setup(x => x.AddAsync(It.IsAny<LedgerEntry>())).Returns(Task.CompletedTask);
            _mockAuditService.Setup(x => x.LogAsync(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).Returns(Task.CompletedTask);

            // Act
            var result = await _transactionService.DepositAsync(depositRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Deposit", result.Type);
            Assert.Equal(1000, result.Amount);
            Assert.Equal("USD", result.Currency);
            Assert.NotNull(result.TransactionReference);

            _mockUnitOfWork.Verify(x => x.BeginTransactionAsync(), Times.Once);
            _mockUnitOfWork.Verify(x => x.CommitTransactionAsync(), Times.Once);
            _mockAuditService.Verify(x => x.LogAsync(It.IsAny<string>(), It.IsAny<int>(), "Deposit", It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Once);
        }

        [Fact]
        public async Task DepositAsync_WithAtmNotFound_ThrowsKeyNotFoundException()
        {
            // Arrange
            var sessionId = Guid.NewGuid();
            var accountId = 1;

            var account = new Account("ACC123", "John Doe", 5000, "USD");

            var depositRequest = new DepositRequest
            {
                SessionId = sessionId,
                Amount = 1000,
                AtmMachineCode = "INVALID_ATM"
            };

            _mockAuthenticationService
                .Setup(x => x.GetAccountIdFromSessionAsync(sessionId))
                .ReturnsAsync(accountId);

            _mockAccountRepository
                .Setup(x => x.GetByIdAsync(accountId))
                .ReturnsAsync(account);

            _mockAtmMachineRepository
                .Setup(x => x.GetByMachineCodeAsync("INVALID_ATM"))
                .ReturnsAsync((AtmMachine?)null);

            _mockUnitOfWork.Setup(x => x.BeginTransactionAsync()).Returns(Task.CompletedTask);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _transactionService.DepositAsync(depositRequest));
            _mockUnitOfWork.Verify(x => x.RollbackTransactionAsync(), Times.Once);
        }

        [Fact]
        public async Task GetTransactionHistoryAsync_WithValidRequest_ReturnsTransactionHistory()
        {
            // Arrange
            var sessionId = Guid.NewGuid();
            var accountId = 1;

            var transactionHistoryRequest = new TransactionHistoryRequest
            {
                SessionId = sessionId,
                FromDate = DateTime.UtcNow.AddMonths(-1),
                ToDate = DateTime.UtcNow,
                PageNumber = 1,
                PageSize = 10
            };

            var transactions = new List<Transaction>
            {
                new Transaction(accountId, TransactionType.Withdrawal, 500, "USD", 5000, null, 1, "ATM Withdrawal - Main Street"),
                new Transaction(accountId, TransactionType.Deposit, 1000, "USD", 5500, null, 1, "ATM Deposit - Main Street")
            };

            _mockAuthenticationService
                .Setup(x => x.GetAccountIdFromSessionAsync(sessionId))
                .ReturnsAsync(accountId);

            _mockTransactionRepository
                .Setup(x => x.GetByAccountIdAsync(accountId, It.IsAny<DateTime>(), It.IsAny<DateTime>()))
                .ReturnsAsync(transactions);

            // Act
            var result = await _transactionService.GetTransactionHistoryAsync(transactionHistoryRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.TotalCount);
            Assert.Equal(1, result.PageNumber);
            Assert.Equal(10, result.PageSize);
            Assert.NotNull(result.Transactions);
            Assert.Equal(2, result.Transactions.Count);
        }

        [Fact]
        public async Task GetTransactionHistoryAsync_WithNoTransactions_ReturnsEmptyList()
        {
            // Arrange
            var sessionId = Guid.NewGuid();
            var accountId = 1;

            var transactionHistoryRequest = new TransactionHistoryRequest
            {
                SessionId = sessionId,
                FromDate = DateTime.UtcNow.AddMonths(-1),
                ToDate = DateTime.UtcNow,
                PageNumber = 1,
                PageSize = 10
            };

            _mockAuthenticationService
                .Setup(x => x.GetAccountIdFromSessionAsync(sessionId))
                .ReturnsAsync(accountId);

            _mockTransactionRepository
                .Setup(x => x.GetByAccountIdAsync(accountId, It.IsAny<DateTime>(), It.IsAny<DateTime>()))
                .ReturnsAsync(new List<Transaction>());

            // Act
            var result = await _transactionService.GetTransactionHistoryAsync(transactionHistoryRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(0, result.TotalCount);
            Assert.Empty(result.Transactions);
        }
    }
}
