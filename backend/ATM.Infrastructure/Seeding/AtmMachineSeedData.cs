using Backend.ATM.Domain.Entities;
using Backend.ATM.Domain.Enums;

namespace Backend.ATM.Infrastructure.Seeding
{
    public static class AtmMachineSeedData
    {
        public static IEnumerable<AtmMachine> GetSeedData()
        {
            var createdAt = new DateTime(2026, 1, 10, 8, 0, 0, DateTimeKind.Utc);
            var updatedAt = new DateTime(2026, 1, 15, 9, 30, 0, DateTimeKind.Utc);
            var maintenanceDate = new DateTime(2026, 1, 12, 14, 0, 0, DateTimeKind.Utc);

            return new[]
            {
                CreateAtmMachine(
                    id: 1,
                    machineCode: "ATM-LAG-001",
                    location: "12 Marina Road, Lagos",
                    status: AtmStatus.Online,
                    cashAvailable: 50000m,
                    maxWithdrawalAmount: 1000m,
                    createdAt: createdAt,
                    updatedAt: updatedAt,
                    lastMaintenanceDate: maintenanceDate),

                CreateAtmMachine(
                    id: 2,
                    machineCode: "ATM-ABJ-002",
                    location: "45 Central Business District, Abuja",
                    status: AtmStatus.Offline,
                    cashAvailable: 25000m,
                    maxWithdrawalAmount: 1000m,
                    createdAt: createdAt.AddDays(1),
                    updatedAt: updatedAt.AddDays(1),
                    lastMaintenanceDate: maintenanceDate.AddDays(2))
            };
        }

        private static AtmMachine CreateAtmMachine(
            int id,
            string machineCode,
            string location,
            AtmStatus status,
            decimal cashAvailable,
            decimal maxWithdrawalAmount,
            DateTime createdAt,
            DateTime? updatedAt,
            DateTime? lastMaintenanceDate)
        {
            var atmMachine = new AtmMachine(machineCode, location, cashAvailable, maxWithdrawalAmount);

            SetProperty(atmMachine, nameof(AtmMachine.Id), id);
            SetProperty(atmMachine, nameof(AtmMachine.Status), status);
            SetProperty(atmMachine, nameof(AtmMachine.CreatedAt), createdAt);
            SetProperty(atmMachine, nameof(AtmMachine.UpdatedAt), updatedAt);
            SetProperty(atmMachine, nameof(AtmMachine.LastMaintenanceDate), lastMaintenanceDate);

            return atmMachine;
        }

        private static void SetProperty<T>(object target, string propertyName, T value)
        {
            typeof(AtmMachine).GetProperty(propertyName)?.SetValue(target, value);
        }
    }
}