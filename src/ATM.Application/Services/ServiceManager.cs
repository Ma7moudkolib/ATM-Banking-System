using ATM.Application.Interfaces.Repositories;
using ATM.Application.Interfaces.Services;

namespace ATM.Application.Services
{
    public class ServiceManager : IServiceManager
    {
        private readonly Lazy<IAuthenticationService> _authenticationService;
        private readonly Lazy<IAccountService> _accountService;
        private readonly Lazy<ITransactionService> _transactionService;
        private readonly Lazy<IAuditService> _auditService;

        public ServiceManager(
            IRepositoryManager repository,
            Microsoft.Extensions.Caching.Memory.IMemoryCache cache)
        {
            _auditService = new Lazy<IAuditService>(() => new AuditService(repository));
            _authenticationService = new Lazy<IAuthenticationService>(() => new AuthenticationService(repository, cache));
            _accountService = new Lazy<IAccountService>(() => new AccountService(repository, _authenticationService.Value));
            _transactionService = new Lazy<ITransactionService>(() => new TransactionService(repository, _authenticationService.Value, _auditService.Value));
        }

        public IAuthenticationService Authentication => _authenticationService.Value;
        public IAccountService Account => _accountService.Value;
        public ITransactionService Transaction => _transactionService.Value;
        public IAuditService Audit => _auditService.Value;
    }
}
