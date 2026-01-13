using ATM.Application.Interfaces.Repositories;
using ATM.Infrastructure.Context;

namespace ATM.Infrastructure.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly AtmDbContext _context;
        private readonly Lazy<ICardRepository> _cardRepository;
        private readonly Lazy<IAccountRepository> _accountRepository;
        private readonly Lazy<ITransactionRepository> _transactionRepository;
        private readonly Lazy<ILedgerRepository> _ledgerRepository;
        private readonly Lazy<IAtmMachineRepository> _atmMachineRepository;
        private readonly Lazy<IAuditLogRepository> _auditLogRepository;
        private readonly Lazy<IUnitOfWork> _unitOfWork;

        public RepositoryManager(AtmDbContext context)
        {
            _context = context;
            _cardRepository = new Lazy<ICardRepository>(() => new CardRepository(context));
            _accountRepository = new Lazy<IAccountRepository>(() => new AccountRepository(context));
            _transactionRepository = new Lazy<ITransactionRepository>(() => new TransactionRepository(context));
            _ledgerRepository = new Lazy<ILedgerRepository>(() => new LedgerRepository(context));
            _atmMachineRepository = new Lazy<IAtmMachineRepository>(() => new AtmMachineRepository(context));
            _auditLogRepository = new Lazy<IAuditLogRepository>(() => new AuditLogRepository(context));
            _unitOfWork = new Lazy<IUnitOfWork>(() => new UnitOfWork(context));
        }

        public ICardRepository Card => _cardRepository.Value;
        public IAccountRepository Account => _accountRepository.Value;
        public ITransactionRepository Transaction => _transactionRepository.Value;
        public ILedgerRepository Ledger => _ledgerRepository.Value;
        public IAtmMachineRepository AtmMachine => _atmMachineRepository.Value;
        public IAuditLogRepository AuditLog => _auditLogRepository.Value;
        public IUnitOfWork UnitOfWork => _unitOfWork.Value;
    }
}
