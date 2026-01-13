using ATM.Domain.Enums;

namespace ATM.Domain.Entities
{
    public class Transaction : BaseEntity
    {
        public string TransactionReference { get; private set; }
        public int AccountId { get; private set; }
        public int? CardId { get; private set; }
        public int? AtmMachineId { get; private set; }
        public TransactionType Type { get; private set; }
        public TransactionStatus Status { get; private set; }
        public decimal Amount { get; private set; }
        public string Currency { get; private set; }
        public decimal BalanceBefore { get; private set; }
        public decimal BalanceAfter { get; private set; }
        public string Description { get; private set; }
        public DateTime? CompletedAt { get; private set; }

        // Navigation
        public Account Account { get; private set; }
        public Card Card { get; private set; }
        public AtmMachine AtmMachine { get; private set; }

        private Transaction() { }

        public Transaction(
            int accountId,
            TransactionType type,
            decimal amount,
            string currency,
            decimal balanceBefore,
            int? cardId = null,
            int? atmMachineId = null,
            string description = null)
        {
            TransactionReference = GenerateReference();
            AccountId = accountId;
            CardId = cardId;
            AtmMachineId = atmMachineId;
            Type = type;
            Status = TransactionStatus.Pending;
            Amount = amount;
            Currency = currency;
            BalanceBefore = balanceBefore;
            BalanceAfter = balanceBefore;
            Description = description;
            CreatedAt = DateTime.UtcNow;
        }

        public void Complete(decimal balanceAfter)
        {
            Status = TransactionStatus.Completed;
            BalanceAfter = balanceAfter;
            CompletedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Fail()
        {
            Status = TransactionStatus.Failed;
            UpdatedAt = DateTime.UtcNow;
        }

        private static string GenerateReference()
        {
            return $"TXN{DateTime.UtcNow:yyyyMMddHHmmss}{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
        }
    }



}
