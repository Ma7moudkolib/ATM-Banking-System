using ATM.Application.DTOs.Transaction;
using ATM.Application.Interfaces.Repositories;
using ATM.Application.Interfaces.Services;
using ATM.Domain.Entities;
using ATM.Domain.Enums;
using ATM.Domain.ValueObjects;

namespace ATM.Application.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly IRepositoryManager _repository;
        private readonly IAuthenticationService _authService;
        private readonly IAuditService _auditService;

        public TransactionService(
            IRepositoryManager repository,
            IAuthenticationService authService,
            IAuditService auditService)
        {
            _repository = repository;
            _authService = authService;
            _auditService = auditService;
        }

        public async Task<TransactionResponse> WithdrawAsync(WithdrawalRequest request)
        {
            var accountId = await _authService.GetAccountIdFromSessionAsync(request.SessionId);

            await _repository.UnitOfWork.BeginTransactionAsync();

            try
            {
                var account = await _repository.Account.GetByIdAsync(accountId);
                if (account == null)
                    throw new KeyNotFoundException("Account not found");

                var atm = await _repository.AtmMachine.GetByMachineCodeAsync(request.AtmMachineCode);
                if (atm == null)
                    throw new KeyNotFoundException("ATM not found");

                var money = new Money(request.Amount, account.Currency);

                var transaction = new Transaction(
                    accountId,
                    TransactionType.Withdrawal,
                    money.Amount,
                    money.Currency,
                    account.Balance,
                    null,
                    atm.Id,
                    $"ATM Withdrawal - {atm.Location}"
                );

                await _repository.Transaction.AddAsync(transaction);

                account.Withdraw(money);
                atm.DispenseCash(money.Amount);

                _repository.Account.Update(account);
                _repository.AtmMachine.Update(atm);

                transaction.Complete(account.Balance);

                var debitEntry = new LedgerEntry(
                    transaction.Id,
                    accountId,
                    LedgerEntryType.Debit,
                    money.Amount,
                    money.Currency,
                    account.Balance,
                    $"Withdrawal - {transaction.TransactionReference}"
                );

                await _repository.Ledger.AddAsync(debitEntry);

                await _repository.UnitOfWork.SaveChangesAsync();
                await _repository.UnitOfWork.CommitTransactionAsync();

                await _auditService.LogAsync("Transaction", transaction.Id, "Withdrawal",
                    $"Amount: {money.Amount}", accountId.ToString(), "ATM");

                return new TransactionResponse
                {
                    TransactionReference = transaction.TransactionReference,
                    Type = transaction.Type.ToString(),
                    Amount = transaction.Amount,
                    Currency = transaction.Currency,
                    BalanceBefore = transaction.BalanceBefore,
                    BalanceAfter = transaction.BalanceAfter,
                    TransactionDate = transaction.CreatedAt,
                    Status = transaction.Status.ToString()
                };
            }
            catch
            {
                await _repository.UnitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task<TransactionResponse> DepositAsync(DepositRequest request)
        {
            var accountId = await _authService.GetAccountIdFromSessionAsync(request.SessionId);

            await _repository.UnitOfWork.BeginTransactionAsync();

            try
            {
                var account = await _repository.Account.GetByIdAsync(accountId);
                if (account == null)
                    throw new KeyNotFoundException("Account not found");

                var atm = await _repository.AtmMachine.GetByMachineCodeAsync(request.AtmMachineCode);
                if (atm == null)
                    throw new KeyNotFoundException("ATM not found");

                var money = new Money(request.Amount, account.Currency);

                var transaction = new Transaction(
                    accountId,
                    TransactionType.Deposit,
                    money.Amount,
                    money.Currency,
                    account.Balance,
                    null,
                    atm.Id,
                    $"ATM Deposit - {atm.Location}"
                );

                await _repository.Transaction.AddAsync(transaction);

                account.Deposit(money);
                atm.AcceptCash(money.Amount);

                _repository.Account.Update(account);
                _repository.AtmMachine.Update(atm);

                transaction.Complete(account.Balance);

                var creditEntry = new LedgerEntry(
                    transaction.Id,
                    accountId,
                    LedgerEntryType.Credit,
                    money.Amount,
                    money.Currency,
                    account.Balance,
                    $"Deposit - {transaction.TransactionReference}"
                );

                await _repository.Ledger.AddAsync(creditEntry);

                await _repository.UnitOfWork.SaveChangesAsync();
                await _repository.UnitOfWork.CommitTransactionAsync();

                await _auditService.LogAsync("Transaction", transaction.Id, "Deposit",
                    $"Amount: {money.Amount}", accountId.ToString(), "ATM");

                return new TransactionResponse
                {
                    TransactionReference = transaction.TransactionReference,
                    Type = transaction.Type.ToString(),
                    Amount = transaction.Amount,
                    Currency = transaction.Currency,
                    BalanceBefore = transaction.BalanceBefore,
                    BalanceAfter = transaction.BalanceAfter,
                    TransactionDate = transaction.CreatedAt,
                    Status = transaction.Status.ToString()
                };
            }
            catch
            {
                await _repository.UnitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task<TransactionHistoryResponse> GetTransactionHistoryAsync(TransactionHistoryRequest request)
        {
            var accountId = await _authService.GetAccountIdFromSessionAsync(request.SessionId);

            var transactions = await _repository.Transaction.GetByAccountIdAsync(
                accountId,
                request.FromDate,
                request.ToDate
            );

            var transactionList = transactions
                .OrderByDescending(t => t.CreatedAt)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(t => new TransactionResponse
                {
                    TransactionReference = t.TransactionReference,
                    Type = t.Type.ToString(),
                    Amount = t.Amount,
                    Currency = t.Currency,
                    BalanceBefore = t.BalanceBefore,
                    BalanceAfter = t.BalanceAfter,
                    TransactionDate = t.CreatedAt,
                    Status = t.Status.ToString()
                })
                .ToList();

            return new TransactionHistoryResponse
            {
                Transactions = transactionList,
                TotalCount = transactions.Count(),
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }
    }
}
