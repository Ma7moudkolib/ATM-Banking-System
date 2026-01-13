using ATM.Domain.Enums;
using ATM.Domain.Exceptions;
using ATM.Domain.ValueObjects;

namespace ATM.Domain.Entities
{
    public class Card : BaseEntity
    {
        public CardNumber CardNumber { get; private set; }
        public Pin Pin { get; private set; }
        public int AccountId { get; private set; }
        public CardStatus Status { get; private set; }
        public DateTime ExpiryDate { get; private set; }
        public int FailedPinAttempts { get; private set; }
        public DateTime? LastFailedAttempt { get; private set; }
        public DateTime? BlockedAt { get; private set; }
        public int DailyWithdrawalLimit { get; private set; }

        // Navigation
        public Account Account { get; private set; }

        private Card() { } // EF Core

        public Card(CardNumber cardNumber, Pin pin, int accountId, DateTime expiryDate, int dailyLimit = 1000)
        {
            CardNumber = cardNumber;
            Pin = pin;
            AccountId = accountId;
            Status = CardStatus.Active;
            ExpiryDate = expiryDate;
            FailedPinAttempts = 0;
            DailyWithdrawalLimit = dailyLimit;
            CreatedAt = DateTime.UtcNow;
        }

        public bool ValidatePin(string plainPin)
        {
            if (Status == CardStatus.Blocked)
                throw new DomainException("Card is blocked");

            if (ExpiryDate < DateTime.UtcNow)
            {
                Status = CardStatus.Expired;
                throw new DomainException("Card has expired");
            }

            bool isValid = Pin.Verify(plainPin);

            if (!isValid)
            {
                FailedPinAttempts++;
                LastFailedAttempt = DateTime.UtcNow;

                if (FailedPinAttempts >= 3)
                {
                    Block();
                    throw new DomainException("Card blocked due to multiple failed PIN attempts");
                }

                throw new DomainException($"Invalid PIN. {3 - FailedPinAttempts} attempts remaining");
            }

            FailedPinAttempts = 0;
            LastFailedAttempt = null;
            return true;
        }

        public void Block()
        {
            Status = CardStatus.Blocked;
            BlockedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public void ResetPin(Pin newPin)
        {
            Pin = newPin;
            FailedPinAttempts = 0;
            LastFailedAttempt = null;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
