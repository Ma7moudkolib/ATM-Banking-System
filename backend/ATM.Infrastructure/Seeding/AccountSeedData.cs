using Backend.ATM.Domain.Entities;
using Backend.ATM.Domain.Enums;

namespace Backend.ATM.Infrastructure.Seeding
{
    public static class AccountSeedData
    {
        public static IEnumerable<Account> GetSeeds()
        {
            return new[]
            {
                CreateAccount(
                    id: 1,
                    accountNumber: "100000000001",
                    customerName: "John Doe",
                    balance: 1500.00m,
                    currency: "USD",
                    status: AccountStatus.Active,
                    version: 0,
                    createdAt: new DateTime(2026, 1, 10, 8, 30, 0, DateTimeKind.Utc),
                    updatedAt: null),
                CreateAccount(
                    id: 2,
                    accountNumber: "100000000002",
                    customerName: "Jane Smith",
                    balance: 2750.50m,
                    currency: "USD",
                    status: AccountStatus.Active,
                    version: 0,
                    createdAt: new DateTime(2026, 1, 11, 9, 45, 0, DateTimeKind.Utc),
                    updatedAt: null)
            };
        }

        private static Account CreateAccount(
            int id,
            string accountNumber,
            string customerName,
            decimal balance,
            string currency,
            AccountStatus status,
            uint version,
            DateTime createdAt,
            DateTime? updatedAt)
        {
            var account = new Account(accountNumber, customerName, balance, currency);

            typeof(Account).GetProperty(nameof(Account.Id))!.SetValue(account, id);
            typeof(Account).GetProperty(nameof(Account.Status))!.SetValue(account, status);
            typeof(Account).GetProperty(nameof(Account.Version))!.SetValue(account, version);
            typeof(Account).GetProperty(nameof(Account.CreatedAt))!.SetValue(account, createdAt);
            typeof(Account).GetProperty(nameof(Account.UpdatedAt))!.SetValue(account, updatedAt);

            return account;
        }
    }
}