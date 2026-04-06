using Backend.ATM.Domain.Entities;
using Backend.ATM.Domain.Enums;

namespace Backend.ATM.Infrastructure.Seeding
{
    public static class LedgerEntrySeed
    {
        public static IEnumerable<LedgerEntry> GetSeedData()
        {
            return
            [
                CreateLedgerEntry(
                    id: 1,
                    transactionId: 1,
                    accountId: 1,
                    entryType: LedgerEntryType.Debit,
                    amount: 200.00m,
                    currency: "USD",
                    balanceAfter: 1300.00m,
                    description: "Ledger entry for ATM cash withdrawal",
                    entryDate: new DateTime(2026, 4, 5, 9, 1, 0, DateTimeKind.Utc)),

                CreateLedgerEntry(
                    id: 2,
                    transactionId: 2,
                    accountId: 2,
                    entryType: LedgerEntryType.Credit,
                    amount: 0.00m,
                    currency: "USD",
                    balanceAfter: 800.00m,
                    description: "Ledger entry for ATM balance inquiry",
                    entryDate: new DateTime(2026, 4, 5, 9, 15, 30, DateTimeKind.Utc))
            ];
        }

        private static LedgerEntry CreateLedgerEntry(
            int id,
            int transactionId,
            int accountId,
            LedgerEntryType entryType,
            decimal amount,
            string currency,
            decimal balanceAfter,
            string description,
            DateTime entryDate)
        {
            var ledgerEntry = new LedgerEntry(
                transactionId,
                accountId,
                entryType,
                amount,
                currency,
                balanceAfter,
                description);

            typeof(LedgerEntry).GetProperty(nameof(LedgerEntry.Id))!.SetValue(ledgerEntry, id);
            typeof(LedgerEntry).GetProperty(nameof(LedgerEntry.EntryDate))!.SetValue(ledgerEntry, entryDate);
            typeof(LedgerEntry).GetProperty(nameof(LedgerEntry.CreatedAt))!.SetValue(ledgerEntry, entryDate);

            return ledgerEntry;
        }
    }
}
