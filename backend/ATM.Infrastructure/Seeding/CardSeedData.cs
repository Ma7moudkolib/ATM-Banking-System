using Backend.ATM.Domain.Enums;

namespace Backend.ATM.Infrastructure.Seeding
{
    public static class CardSeedData
    {
        private const string PinHash1234 = "$2a$11$nCdtdzVGJISdwC00RwVoV.7eLfiTtbcyXF5CFGHWpLybYmrXnvJ/C";
        private const string PinHash5678 = "$2a$11$dJmjW2ruBbqHnitbHlTh2.rjAx3i8piCCD2ELxVzAT.htZSw29eEq";

        public static IEnumerable<object> GetSeeds()
        {
            return new object[]
            {
                new
                {
                    Id = 1,
                    AccountId = 1,
                    Status = CardStatus.Active,
                    ExpiryDate = new DateTime(2029, 12, 31, 0, 0, 0, DateTimeKind.Utc),
                    FailedPinAttempts = 0,
                    LastFailedAttempt = (DateTime?)null,
                    BlockedAt = (DateTime?)null,
                    DailyWithdrawalLimit = 1000,
                    CreatedAt = new DateTime(2026, 1, 10, 8, 45, 0, DateTimeKind.Utc),
                    UpdatedAt = (DateTime?)null
                },
                new
                {
                    Id = 2,
                    AccountId = 2,
                    Status = CardStatus.Active,
                    ExpiryDate = new DateTime(2030, 6, 30, 0, 0, 0, DateTimeKind.Utc),
                    FailedPinAttempts = 0,
                    LastFailedAttempt = (DateTime?)null,
                    BlockedAt = (DateTime?)null,
                    DailyWithdrawalLimit = 1500,
                    CreatedAt = new DateTime(2026, 1, 11, 10, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = (DateTime?)null
                }
            };
        }

        public static IEnumerable<object> GetCardNumberSeeds()
        {
            return new object[]
            {
                new { CardId = 1, Value = "4532015112830366" },
                new { CardId = 2, Value = "4485275742308327" }
            };
        }

        public static IEnumerable<object> GetPinSeeds()
        {
            return new object[]
            {
                new { CardId = 1, HashedValue = PinHash1234 },
                new { CardId = 2, HashedValue = PinHash5678 }
            };
        }

    }
}
