namespace ATM.Application.Interfaces.Repositories
{
    public interface IRepositoryManager
    {
        ICardRepository Card { get; }
        IAccountRepository Account { get; }
        ITransactionRepository Transaction { get; }
        ILedgerRepository Ledger { get; }
        IAtmMachineRepository AtmMachine { get; }
        IAuditLogRepository AuditLog { get; }
        IUnitOfWork UnitOfWork { get; }
    }
}
