using ATM.Domain.Enums;
using ATM.Domain.Exceptions;
using ATM.Domain.ValueObjects;

namespace ATM.Domain.Entities
{
    public class Account : BaseEntity
    {
        public string AccountNumber { get; private set; }
        public string CustomerName { get; private set; }
        public decimal Balance { get; private set; }
        public string Currency { get; private set; }
        public AccountStatus Status { get; private set; }
        public uint Version { get; private set; } // For optimistic concurrency

        // Navigation
        public ICollection<Card> Cards { get; private set; }
        public ICollection<Transaction> Transactions { get; private set; }

        private Account()
        {
            Cards = new List<Card>();
            Transactions = new List<Transaction>();
        }

        public Account(string accountNumber, string customerName, decimal initialBalance = 0, string currency = "USD")
        {
            AccountNumber = accountNumber;
            CustomerName = customerName;
            Balance = initialBalance;
            Currency = currency;
            Status = AccountStatus.Active;
            Version = 0;
            CreatedAt = DateTime.UtcNow;
            Cards = new List<Card>();
            Transactions = new List<Transaction>();
        }

        public void Withdraw(Money amount)
        {
            if (Status != AccountStatus.Active)
                throw new DomainException("Account is not active");

            if (amount.Currency != Currency)
                throw new DomainException("Currency mismatch");

            if (Balance < amount.Amount)
                throw new InsufficientFundsException($"Insufficient funds. Available: {Balance:C}");

            Balance -= amount.Amount;
            Version++;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Deposit(Money amount)
        {
            if (Status != AccountStatus.Active)
                throw new DomainException("Account is not active");

            if (amount.Currency != Currency)
                throw new DomainException("Currency mismatch");

            Balance += amount.Amount;
            Version++;
            UpdatedAt = DateTime.UtcNow;
        }

        public Money GetBalance() => new Money(Balance, Currency);
    }


}
