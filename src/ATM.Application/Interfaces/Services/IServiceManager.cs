namespace ATM.Application.Interfaces.Services
{
    public interface IServiceManager
    {
        IAuthenticationService Authentication { get; }
        IAccountService Account { get; }
        ITransactionService Transaction { get; }
        IAuditService Audit { get; }
    }
}
