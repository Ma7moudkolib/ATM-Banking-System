using ATM.Domain.Enums;

namespace ATM.Domain.Entities
{
    public class LedgerEntry : BaseEntity
    {
        public Guid TransactionId { get; private set; }
        public Guid AccountId { get; private set; }
        public LedgerEntryType EntryType { get; private set; }
        public decimal Amount { get; private set; }
        public string Currency { get; private set; }
        public decimal BalanceAfter { get; private set; }
        public string Description { get; private set; }
        public DateTime EntryDate { get; private set; }

        // Navigation
        public Transaction Transaction { get; private set; }
        public Account Account { get; private set; }

        private LedgerEntry() { }

        public LedgerEntry(
            Guid transactionId,
            Guid accountId,
            LedgerEntryType entryType,
            decimal amount,
            string currency,
            decimal balanceAfter,
            string description)
        {
            Id = Guid.NewGuid();
            TransactionId = transactionId;
            AccountId = accountId;
            EntryType = entryType;
            Amount = amount;
            Currency = currency;
            BalanceAfter = balanceAfter;
            Description = description;
            EntryDate = DateTime.UtcNow;
            CreatedAt = DateTime.UtcNow;
        }
    }
}
