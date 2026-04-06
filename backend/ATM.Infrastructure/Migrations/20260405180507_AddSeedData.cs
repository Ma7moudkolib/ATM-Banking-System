using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Backend.ATM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Accounts",
                columns: new[] { "Id", "AccountNumber", "Balance", "CreatedAt", "Currency", "CustomerName", "Status", "UpdatedAt", "Version" },
                values: new object[,]
                {
                    { 1, "100000000001", 1500.00m, new DateTime(2026, 1, 10, 8, 30, 0, 0, DateTimeKind.Utc), "USD", "John Doe", "Active", null, 0L },
                    { 2, "100000000002", 2750.50m, new DateTime(2026, 1, 11, 9, 45, 0, 0, DateTimeKind.Utc), "USD", "Jane Smith", "Active", null, 0L }
                });

            migrationBuilder.InsertData(
                table: "AtmMachines",
                columns: new[] { "Id", "CashAvailable", "CreatedAt", "LastMaintenanceDate", "Location", "MachineCode", "MaxWithdrawalAmount", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 50000m, new DateTime(2026, 1, 10, 8, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 1, 12, 14, 0, 0, 0, DateTimeKind.Utc), "12 Marina Road, Lagos", "ATM-LAG-001", 1000m, "Online", new DateTime(2026, 1, 15, 9, 30, 0, 0, DateTimeKind.Utc) },
                    { 2, 25000m, new DateTime(2026, 1, 11, 8, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 1, 14, 14, 0, 0, 0, DateTimeKind.Utc), "45 Central Business District, Abuja", "ATM-ABJ-002", 1000m, "Offline", new DateTime(2026, 1, 16, 9, 30, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "AuditLogs",
                columns: new[] { "Id", "Action", "Changes", "CreatedAt", "EntityId", "EntityType", "IpAddress", "PerformedBy", "Timestamp", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "SeedCreated", "Initial account seed created with opening balance 5000.00 USD.", new DateTime(2026, 1, 10, 8, 15, 0, 0, DateTimeKind.Utc), 1, "Account", "127.0.0.1", "SystemSeed", new DateTime(2026, 1, 10, 8, 15, 0, 0, DateTimeKind.Utc), null },
                    { 2, "SeedCreated", "ATM machine ATM-LAG-001 seeded as Online with cash available 50000.00.", new DateTime(2026, 1, 10, 8, 20, 0, 0, DateTimeKind.Utc), 1, "AtmMachine", "127.0.0.1", "SystemSeed", new DateTime(2026, 1, 10, 8, 20, 0, 0, DateTimeKind.Utc), null },
                    { 3, "StatusReviewed", "Seeded card linked to Account 2 verified for initial active status.", new DateTime(2026, 1, 11, 9, 0, 0, 0, DateTimeKind.Utc), 2, "Card", "127.0.0.1", "SystemSeed", new DateTime(2026, 1, 11, 9, 0, 0, 0, DateTimeKind.Utc), null }
                });

            migrationBuilder.InsertData(
                table: "Cards",
                columns: new[] { "Id", "AccountId", "BlockedAt", "CreatedAt", "DailyWithdrawalLimit", "ExpiryDate", "FailedPinAttempts", "LastFailedAttempt", "Status", "UpdatedAt", "CardNumber", "HashedPin" },
                values: new object[,]
                {
                    { 1, 1, null, new DateTime(2026, 1, 10, 8, 45, 0, 0, DateTimeKind.Utc), 1000, new DateTime(2029, 12, 31, 0, 0, 0, 0, DateTimeKind.Utc), 0, null, "Active", null, "4532015112830366", "$2a$11$M/8cXrN0bGfYfK7xO6jM3eQq8u0Jw3xVQxQ5vWlA9QvHjQ9mYwY7K" },
                    { 2, 2, null, new DateTime(2026, 1, 11, 10, 0, 0, 0, DateTimeKind.Utc), 1500, new DateTime(2030, 6, 30, 0, 0, 0, 0, DateTimeKind.Utc), 0, null, "Active", null, "4485275742308327", "$2a$11$7oQZ0JrM0QeWmP4nJbFQ7uRj0n0f7V8cZrJQm9sLQvN2aXbT8cD1G" }
                });

            migrationBuilder.InsertData(
                table: "Transactions",
                columns: new[] { "Id", "AccountId", "Amount", "AtmMachineId", "BalanceAfter", "BalanceBefore", "CardId", "CompletedAt", "CreatedAt", "Currency", "Description", "Status", "TransactionReference", "Type", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 1, 200.00m, 1, 1300.00m, 1500.00m, 1, new DateTime(2026, 4, 5, 9, 1, 0, 0, DateTimeKind.Utc), new DateTime(2026, 4, 5, 9, 0, 0, 0, DateTimeKind.Utc), "USD", "ATM cash withdrawal", "Completed", "TXN-20260405-0001", "Withdrawal", new DateTime(2026, 4, 5, 9, 1, 0, 0, DateTimeKind.Utc) },
                    { 2, 2, 0.00m, 1, 800.00m, 800.00m, 2, new DateTime(2026, 4, 5, 9, 15, 30, 0, DateTimeKind.Utc), new DateTime(2026, 4, 5, 9, 15, 0, 0, DateTimeKind.Utc), "USD", "ATM balance inquiry", "Completed", "TXN-20260405-0002", "BalanceInquiry", new DateTime(2026, 4, 5, 9, 15, 30, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "LedgerEntries",
                columns: new[] { "Id", "AccountId", "Amount", "BalanceAfter", "CreatedAt", "Currency", "Description", "EntryDate", "EntryType", "TransactionId", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 1, 200.00m, 1300.00m, new DateTime(2026, 4, 5, 9, 1, 0, 0, DateTimeKind.Utc), "USD", "Ledger entry for ATM cash withdrawal", new DateTime(2026, 4, 5, 9, 1, 0, 0, DateTimeKind.Utc), "Debit", 1, null },
                    { 2, 2, 0.00m, 800.00m, new DateTime(2026, 4, 5, 9, 15, 30, 0, DateTimeKind.Utc), "USD", "Ledger entry for ATM balance inquiry", new DateTime(2026, 4, 5, 9, 15, 30, 0, DateTimeKind.Utc), "Credit", 2, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AtmMachines",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "AuditLogs",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "AuditLogs",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "AuditLogs",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "LedgerEntries",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "LedgerEntries",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Transactions",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "AtmMachines",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Cards",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
