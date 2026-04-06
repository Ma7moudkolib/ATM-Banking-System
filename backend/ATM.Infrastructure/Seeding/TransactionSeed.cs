using Backend.ATM.Domain.Entities;
using Backend.ATM.Domain.Enums;

namespace Backend.ATM.Infrastructure.Seeding
{
    public static class TransactionSeed
    {
        public static IEnumerable<Transaction> GetSeedData()
        {
            return
            [
                CreateTransaction(
                    id: 1,
                    transactionReference: "TXN-20260405-0001",
                    accountId: 1,
                    cardId: 1,
                    atmMachineId: 1,
                    type: TransactionType.Withdrawal,
                    status: TransactionStatus.Completed,
                    amount: 200.00m,
                    currency: "USD",
                    balanceBefore: 1500.00m,
                    balanceAfter: 1300.00m,
                    description: "ATM cash withdrawal",
                    createdAt: new DateTime(2026, 4, 5, 9, 0, 0, DateTimeKind.Utc),
                    completedAt: new DateTime(2026, 4, 5, 9, 1, 0, DateTimeKind.Utc)),

                CreateTransaction(
                    id: 2,
                    transactionReference: "TXN-20260405-0002",
                    accountId: 2,
                    cardId: 2,
                    atmMachineId: 1,
                    type: TransactionType.BalanceInquiry,
                    status: TransactionStatus.Completed,
                    amount: 0.00m,
                    currency: "USD",
                    balanceBefore: 800.00m,
                    balanceAfter: 800.00m,
                    description: "ATM balance inquiry",
                    createdAt: new DateTime(2026, 4, 5, 9, 15, 0, DateTimeKind.Utc),
                    completedAt: new DateTime(2026, 4, 5, 9, 15, 30, DateTimeKind.Utc))
            ];
        }

        private static Transaction CreateTransaction(
            int id,
            string transactionReference,
            int accountId,
            int? cardId,
            int? atmMachineId,
            TransactionType type,
            TransactionStatus status,
            decimal amount,
            string currency,
            decimal balanceBefore,
            decimal balanceAfter,
            string description,
            DateTime createdAt,
            DateTime? completedAt)
        {
            var transaction = new Transaction(
                accountId,
                type,
                amount,
                currency,
                balanceBefore,
                cardId,
                atmMachineId,
                description);

            typeof(Transaction).GetProperty(nameof(Transaction.Id))!.SetValue(transaction, id);
            typeof(Transaction).GetProperty(nameof(Transaction.TransactionReference))!.SetValue(transaction, transactionReference);
            typeof(Transaction).GetProperty(nameof(Transaction.Status))!.SetValue(transaction, status);
            typeof(Transaction).GetProperty(nameof(Transaction.BalanceAfter))!.SetValue(transaction, balanceAfter);
            typeof(Transaction).GetProperty(nameof(Transaction.CreatedAt))!.SetValue(transaction, createdAt);
            typeof(Transaction).GetProperty(nameof(Transaction.CompletedAt))!.SetValue(transaction, completedAt);
            typeof(Transaction).GetProperty(nameof(Transaction.UpdatedAt))!.SetValue(transaction, completedAt);

            return transaction;
        }
    }
}
