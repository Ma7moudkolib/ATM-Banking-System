using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Backend.ATM.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    AccountNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CustomerName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Balance = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Currency = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Version = table.Column<long>(type: "bigint", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AtmMachines",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    MachineCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Location = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CashAvailable = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    MaxWithdrawalAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    LastMaintenanceDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AtmMachines", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    EntityType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    EntityId = table.Column<int>(type: "int", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Changes = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    PerformedBy = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IpAddress = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Cards",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    CardNumber = table.Column<string>(type: "nvarchar(19)", maxLength: 19, nullable: false),
                    HashedPin = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    AccountId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FailedPinAttempts = table.Column<int>(type: "int", nullable: false),
                    LastFailedAttempt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    BlockedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DailyWithdrawalLimit = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cards_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    TransactionReference = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AccountId = table.Column<int>(type: "int", nullable: false),
                    CardId = table.Column<int>(type: "int", nullable: true),
                    AtmMachineId = table.Column<int>(type: "int", nullable: true),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Currency = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    BalanceBefore = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    BalanceAfter = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transactions_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Transactions_AtmMachines_AtmMachineId",
                        column: x => x.AtmMachineId,
                        principalTable: "AtmMachines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Transactions_Cards_CardId",
                        column: x => x.CardId,
                        principalTable: "Cards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LedgerEntries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    TransactionId = table.Column<int>(type: "int", nullable: false),
                    AccountId = table.Column<int>(type: "int", nullable: false),
                    EntryType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Currency = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    BalanceAfter = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    EntryDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LedgerEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LedgerEntries_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LedgerEntries_Transactions_TransactionId",
                        column: x => x.TransactionId,
                        principalTable: "Transactions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_AccountNumber",
                table: "Accounts",
                column: "AccountNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AtmMachines_MachineCode",
                table: "AtmMachines",
                column: "MachineCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_EntityId",
                table: "AuditLogs",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_Timestamp",
                table: "AuditLogs",
                column: "Timestamp");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_AccountId",
                table: "Cards",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_CardNumber",
                table: "Cards",
                column: "CardNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LedgerEntries_AccountId",
                table: "LedgerEntries",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_LedgerEntries_EntryDate",
                table: "LedgerEntries",
                column: "EntryDate");

            migrationBuilder.CreateIndex(
                name: "IX_LedgerEntries_TransactionId",
                table: "LedgerEntries",
                column: "TransactionId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_AccountId",
                table: "Transactions",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_AtmMachineId",
                table: "Transactions",
                column: "AtmMachineId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_CardId",
                table: "Transactions",
                column: "CardId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_CreatedAt",
                table: "Transactions",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_TransactionReference",
                table: "Transactions",
                column: "TransactionReference",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "LedgerEntries");

            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropTable(
                name: "AtmMachines");

            migrationBuilder.DropTable(
                name: "Cards");

            migrationBuilder.DropTable(
                name: "Accounts");
        }
    }
}
