using ATM.Domain.Enums;
using ATM.Domain.Exceptions;

namespace ATM.Domain.Entities
{
    public class AtmMachine : BaseEntity
    {
        public string MachineCode { get; private set; }
        public string Location { get; private set; }
        public AtmStatus Status { get; private set; }
        public decimal CashAvailable { get; private set; }
        public decimal MaxWithdrawalAmount { get; private set; }
        public DateTime? LastMaintenanceDate { get; private set; }

        private AtmMachine() { }

        public AtmMachine(string machineCode, string location, decimal initialCash = 100000, decimal maxWithdrawal = 1000)
        {
            MachineCode = machineCode;
            Location = location;
            Status = AtmStatus.Online;
            CashAvailable = initialCash;
            MaxWithdrawalAmount = maxWithdrawal;
            CreatedAt = DateTime.UtcNow;
        }

        public void DispenseCash(decimal amount)
        {
            if (Status != AtmStatus.Online)
                throw new DomainException("ATM is not available");

            if (amount > MaxWithdrawalAmount)
                throw new DomainException($"Amount exceeds maximum withdrawal limit of {MaxWithdrawalAmount:C}");

            if (CashAvailable < amount)
            {
                Status = AtmStatus.OutOfCash;
                throw new DomainException("ATM has insufficient cash");
            }

            CashAvailable -= amount;
            UpdatedAt = DateTime.UtcNow;

            if (CashAvailable < 1000)
                Status = AtmStatus.OutOfCash;
        }

        public void AcceptCash(decimal amount)
        {
            if (Status == AtmStatus.OutOfService)
                throw new DomainException("ATM is out of service");

            CashAvailable += amount;

            if (Status == AtmStatus.OutOfCash && CashAvailable >= 1000)
                Status = AtmStatus.Online;

            UpdatedAt = DateTime.UtcNow;
        }

        public void SetOffline()
        {
            Status = AtmStatus.Offline;
            UpdatedAt = DateTime.UtcNow;
        }

        public void SetOnline()
        {
            if (CashAvailable < 1000)
                Status = AtmStatus.OutOfCash;
            else
                Status = AtmStatus.Online;

            UpdatedAt = DateTime.UtcNow;
        }
    }

}
