using Backend.ATM.Domain.Entities;

namespace Backend.ATM.Infrastructure.Seeding
{
    public static class AuditLogSeedData
    {
        public static IEnumerable<AuditLog> GetSeedData()
        {
            return new[]
            {
                CreateAuditLog(
                    id: 1,
                    entityType: "Account",
                    entityId: 1,
                    action: "SeedCreated",
                    changes: "Initial account seed created with opening balance 5000.00 USD.",
                    performedBy: "SystemSeed",
                    ipAddress: "127.0.0.1",
                    timestamp: new DateTime(2026, 1, 10, 8, 15, 0, DateTimeKind.Utc),
                    createdAt: new DateTime(2026, 1, 10, 8, 15, 0, DateTimeKind.Utc)),

                CreateAuditLog(
                    id: 2,
                    entityType: "AtmMachine",
                    entityId: 1,
                    action: "SeedCreated",
                    changes: "ATM machine ATM-LAG-001 seeded as Online with cash available 50000.00.",
                    performedBy: "SystemSeed",
                    ipAddress: "127.0.0.1",
                    timestamp: new DateTime(2026, 1, 10, 8, 20, 0, DateTimeKind.Utc),
                    createdAt: new DateTime(2026, 1, 10, 8, 20, 0, DateTimeKind.Utc)),

                CreateAuditLog(
                    id: 3,
                    entityType: "Card",
                    entityId: 2,
                    action: "StatusReviewed",
                    changes: "Seeded card linked to Account 2 verified for initial active status.",
                    performedBy: "SystemSeed",
                    ipAddress: "127.0.0.1",
                    timestamp: new DateTime(2026, 1, 11, 9, 0, 0, DateTimeKind.Utc),
                    createdAt: new DateTime(2026, 1, 11, 9, 0, 0, DateTimeKind.Utc))
            };
        }

        private static AuditLog CreateAuditLog(
            int id,
            string entityType,
            int entityId,
            string action,
            string changes,
            string performedBy,
            string ipAddress,
            DateTime timestamp,
            DateTime createdAt)
        {
            var auditLog = new AuditLog(entityType, entityId, action, changes, performedBy, ipAddress);

            SetProperty(auditLog, nameof(AuditLog.Id), id);
            SetProperty(auditLog, nameof(AuditLog.Timestamp), timestamp);
            SetProperty(auditLog, nameof(AuditLog.CreatedAt), createdAt);

            return auditLog;
        }

        private static void SetProperty<T>(object target, string propertyName, T value)
        {
            typeof(AuditLog).GetProperty(propertyName)?.SetValue(target, value);
        }
    }
}