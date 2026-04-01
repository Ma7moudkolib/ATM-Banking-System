using Backend.ATM.Application.Interfaces.Repositories;
using Backend.ATM.Application.Interfaces.Services;
using Backend.ATM.Application.Services;
using Backend.ATM.Domain.Entities;
using Moq;
using Xunit;

namespace Backend.ATM.Tests.Services
{
    public class AuditServiceTests
    {
        private readonly Mock<IRepositoryManager> _mockRepositoryManager;
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IAuditLogRepository> _mockAuditLogRepository;
        private readonly AuditService _auditService;

        public AuditServiceTests()
        {
            _mockRepositoryManager = new Mock<IRepositoryManager>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockAuditLogRepository = new Mock<IAuditLogRepository>();

            _mockRepositoryManager.Setup(x => x.UnitOfWork).Returns(_mockUnitOfWork.Object);
            _mockRepositoryManager.Setup(x => x.AuditLog).Returns(_mockAuditLogRepository.Object);

            _auditService = new AuditService(_mockRepositoryManager.Object);
        }

        [Fact]
        public async Task LogAsync_WithValidParameters_AddsAuditLogAndSavesChanges()
        {
            // Arrange
            var entityType = "Transaction";
            var entityId = 123;
            var action = "Withdrawal";
            var changes = "Amount: 1000";
            var performedBy = "1";
            var ipAddress = "192.168.1.1";

            _mockAuditLogRepository
                .Setup(x => x.AddAsync(It.IsAny<AuditLog>()))
                .Returns(Task.CompletedTask);

            _mockUnitOfWork
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act
            await _auditService.LogAsync(entityType, entityId, action, changes, performedBy, ipAddress);

            // Assert
            _mockAuditLogRepository.Verify(x => x.AddAsync(It.IsAny<AuditLog>()), Times.Once);
            _mockUnitOfWork.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task LogAsync_WithDifferentActions_LogsCorrectly()
        {
            // Arrange
            var actions = new[] { "Create", "Update", "Delete", "Read" };

            _mockAuditLogRepository
                .Setup(x => x.AddAsync(It.IsAny<AuditLog>()))
                .Returns(Task.CompletedTask);

            _mockUnitOfWork
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act
            foreach (var action in actions)
            {
                await _auditService.LogAsync("Entity", 1, action, "Changes", "admin", "192.168.1.1");
            }

            // Assert
            _mockAuditLogRepository.Verify(x => x.AddAsync(It.IsAny<AuditLog>()), Times.Exactly(4));
            _mockUnitOfWork.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Exactly(4));
        }

        [Fact]
        public async Task LogAsync_WithEmptyChanges_LogsSuccessfully()
        {
            // Arrange
            var entityType = "Account";
            var entityId = 456;
            var action = "Read";
            var changes = "";
            var performedBy = "user123";
            var ipAddress = "10.0.0.1";

            _mockAuditLogRepository
                .Setup(x => x.AddAsync(It.IsAny<AuditLog>()))
                .Returns(Task.CompletedTask);

            _mockUnitOfWork
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act
            await _auditService.LogAsync(entityType, entityId, action, changes, performedBy, ipAddress);

            // Assert
            _mockAuditLogRepository.Verify(x => x.AddAsync(It.IsAny<AuditLog>()), Times.Once);
            _mockUnitOfWork.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task LogAsync_WithMultipleConsecutiveCalls_LogsAllEntries()
        {
            // Arrange
            _mockAuditLogRepository
                .Setup(x => x.AddAsync(It.IsAny<AuditLog>()))
                .Returns(Task.CompletedTask);

            _mockUnitOfWork
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act
            for (int i = 0; i < 5; i++)
            {
                await _auditService.LogAsync(
                    $"Entity{i}",
                    i,
                    $"Action{i}",
                    $"Changes{i}",
                    $"User{i}",
                    $"192.168.1.{i}");
            }

            // Assert
            _mockAuditLogRepository.Verify(x => x.AddAsync(It.IsAny<AuditLog>()), Times.Exactly(5));
            _mockUnitOfWork.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Exactly(5));
        }
    }
}
