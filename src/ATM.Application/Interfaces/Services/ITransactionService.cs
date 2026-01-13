using ATM.Application.DTOs.Transaction;

namespace ATM.Application.Interfaces.Services
{
    public interface ITransactionService
    {
        Task<TransactionResponse> WithdrawAsync(WithdrawalRequest request);
        Task<TransactionResponse> DepositAsync(DepositRequest request);
        Task<TransactionHistoryResponse> GetTransactionHistoryAsync(TransactionHistoryRequest request);
    }
}
