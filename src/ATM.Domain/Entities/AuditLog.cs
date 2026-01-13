namespace ATM.Domain.Entities
{
    public class AuditLog : BaseEntity
    {
        public string EntityType { get; private set; }
        public int EntityId { get; private set; }
        public string Action { get; private set; }
        public string Changes { get; private set; }
        public string PerformedBy { get; private set; }
        public string IpAddress { get; private set; }
        public DateTime Timestamp { get; private set; }

        private AuditLog() { }

        public AuditLog(string entityType, int entityId, string action, string changes, string performedBy, string ipAddress)
        {

            EntityType = entityType;
            EntityId = entityId;
            Action = action;
            Changes = changes;
            PerformedBy = performedBy;
            IpAddress = ipAddress;
            Timestamp = DateTime.UtcNow;
            CreatedAt = DateTime.UtcNow;
        }
    }
}
